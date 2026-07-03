import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { findSelectedPrice } from "@/lib/booking";
import {
  bookingsToReservations,
  getStoredBookings,
  redisNotConfiguredMessage
} from "@/lib/booking-storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "";
  const routeId = searchParams.get("routeId") || "";
  const route = findSelectedPrice(routeId);
  try {
    const bookings = await getStoredBookings();
    const slots = getAvailableSlots(
      date,
      route,
      bookingsToReservations(bookings)
    );

    return NextResponse.json({ slots });
  } catch (error) {
    if ((error as Error).message === "REDIS_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: redisNotConfiguredMessage },
        { status: 503 }
      );
    }

    console.error(error);

    return NextResponse.json(
      { error: "Availability could not be loaded. Please try again later." },
      { status: 500 }
    );
  }
}
