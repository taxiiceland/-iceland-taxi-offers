import { NextResponse } from "next/server";
import { bookingStatuses, type BookingStatus } from "@/lib/booking-status";
import {
  redisNotConfiguredMessage,
  updateStoredBookingStatus,
  withBookingLock
} from "@/lib/booking-storage";
import { sendCustomerStatusEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    bookingId: string;
  }>;
};

function isBookingStatus(value: unknown): value is BookingStatus {
  return bookingStatuses.includes(value as BookingStatus);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { bookingId } = await context.params;
  const payload = (await request.json().catch(() => null)) as {
    status?: unknown;
    cancellationReason?: unknown;
  } | null;

  if (!payload || !isBookingStatus(payload.status)) {
    return NextResponse.json(
      { error: "Choose a valid booking status." },
      { status: 400 }
    );
  }

  const nextStatus = payload.status;
  const cancellationReason =
    typeof payload.cancellationReason === "string"
      ? payload.cancellationReason.trim().slice(0, 1000)
      : "";

  try {
    const booking = await withBookingLock(() =>
      updateStoredBookingStatus(bookingId, nextStatus)
    );

    if (!booking) {
      return NextResponse.json(
        { error: "Booking was not found." },
        { status: 404 }
      );
    }

    const customerEmail =
      nextStatus === "confirmed" ||
      nextStatus === "completed" ||
      nextStatus === "cancelled"
        ? await sendCustomerStatusEmail(
            booking.notification,
            nextStatus,
            nextStatus === "cancelled" ? cancellationReason : undefined
          ).catch((emailError) => {
            console.error("[admin-status] customer status email failed", {
              bookingId,
              nextStatus,
              error:
                emailError instanceof Error
                  ? emailError.message
                  : "Unknown customer status email error"
            });

            return {
              configured: true,
              provider: "resend" as const,
              error:
                emailError instanceof Error
                  ? emailError.message
                  : "Unknown customer status email error"
            };
          })
        : undefined;

    return NextResponse.json({ booking, customerEmail });
  } catch (error) {
    if ((error as Error).message === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: redisNotConfiguredMessage },
        { status: 503 }
      );
    }

    if ((error as Error).message === "BOOKING_LOCK_BUSY") {
      return NextResponse.json(
        { error: "The booking system is busy. Please try again in a moment." },
        { status: 409 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Booking status could not be updated." },
      { status: 500 }
    );
  }
}
