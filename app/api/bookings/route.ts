import { NextResponse } from "next/server";
import { isSlotAvailable } from "@/lib/availability";
import {
  createBookingNotification,
  findSelectedPrice,
  toReservation,
  type BookingRequest
} from "@/lib/booking";
import {
  bookingsToReservations,
  createStoredBooking,
  getStoredBookings,
  redisNotConfiguredMessage,
  saveStoredBooking,
  withBookingLock
} from "@/lib/booking-storage";
import {
  sendBookingEmail,
  sendCustomerConfirmationEmail
} from "@/lib/email";

export const dynamic = "force-dynamic";

function isString(value: unknown) {
  return typeof value === "string";
}

function sanitizeBooking(payload: unknown): BookingRequest | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const booking = payload as Record<string, unknown>;
  const fields = [
    "selectedRouteId",
    "selectedRoute",
    "name",
    "phone",
    "email",
    "pickup",
    "dropoff",
    "date",
    "time",
    "passengers",
    "suitcases",
    "specialLuggage",
    "notes"
  ];

  if (!fields.every((field) => isString(booking[field]))) {
    return null;
  }

  const text = (field: string) => (booking[field] as string).trim();

  return {
    selectedRouteId: text("selectedRouteId"),
    selectedRoute: text("selectedRoute"),
    name: text("name"),
    phone: text("phone"),
    email: text("email"),
    pickup: text("pickup"),
    dropoff: text("dropoff"),
    date: text("date"),
    time: text("time"),
    passengers: text("passengers"),
    suitcases: text("suitcases"),
    specialLuggage: text("specialLuggage"),
    notes: text("notes")
  };
}

function validateBooking(booking: BookingRequest) {
  const passengers = Number(booking.passengers);
  const suitcases = Number(booking.suitcases);

  if (!booking.name || !booking.pickup || !booking.dropoff || !booking.date || !booking.time) {
    return "Please complete the required booking details.";
  }

  if (!booking.phone && !booking.email) {
    return "Please add a phone number or email so we can send your booking details.";
  }

  if (!Number.isInteger(passengers) || passengers < 1 || passengers > 4) {
    return "Please choose 1 to 4 passengers.";
  }

  if (!Number.isInteger(suitcases) || suitcases < 0 || suitcases > 5) {
    return "Please choose 0 to 5 standard suitcases.";
  }

  return "";
}

export async function POST(request: Request) {
  const booking = sanitizeBooking(await request.json().catch(() => null));

  if (!booking) {
    return NextResponse.json(
      { error: "Please check the booking details and try again." },
      { status: 400 }
    );
  }

  const validationError = validateBooking(booking);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const result = await withBookingLock(async () => {
      const route = findSelectedPrice(booking.selectedRouteId);
      const existingBookings = await getStoredBookings();
      const reservations = bookingsToReservations(existingBookings);

      if (!isSlotAvailable(booking.date, booking.time, route, reservations)) {
        return {
          status: "unavailable" as const,
          error: "That time has just been reserved. Please choose another available time."
        };
      }

      const notification = createBookingNotification(booking);
      const reservation = toReservation(booking);
      const storedBooking = createStoredBooking(
        booking,
        reservation,
        notification
      );

      const storage = await saveStoredBooking(storedBooking);
      const email = await sendBookingEmail(notification).catch((emailError) => {
        console.error(emailError);

        return {
          configured: true,
          provider: "resend" as const,
          error: "Booking was saved, but the email provider returned an error."
        };
      });
      const customerEmail = await sendCustomerConfirmationEmail(
        notification
      ).catch((emailError) => {
        console.error(emailError);

        return {
          configured: true,
          provider: "resend" as const,
          error:
            "Booking was saved, but the customer confirmation email returned an error."
        };
      });

      return {
        status: "reserved" as const,
        notification,
        bookingId: storedBooking.id,
        storage,
        email,
        customerEmail
      };
    });

    if (result.status === "unavailable") {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    return NextResponse.json(result);
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
      { error: "We could not complete the booking. Please call us for help." },
      { status: 500 }
    );
  }
}
