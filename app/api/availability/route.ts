import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/availability";
import { findSelectedPrice } from "@/lib/booking";
import { bookingsToReservations, getStoredBookings } from "@/lib/booking-storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") || "";
  const routeId = searchParams.get("routeId") || "";
  const route = findSelectedPrice(routeId);
  const bookings = await getStoredBookings();
  const slots = getAvailableSlots(
    date,
    route,
    bookingsToReservations(bookings)
  );

  return NextResponse.json({ slots });
}
