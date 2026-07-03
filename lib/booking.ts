import { getBlockedTimeRange, type Reservation } from "./availability";
import {
  formatPrice,
  getDiscountedPrice,
  getSavings,
  prices,
  type PriceConfig
} from "./pricing";
import { contact } from "./site-data";

export type BookingRequest = {
  selectedRouteId: string;
  selectedRoute: string;
  name: string;
  phone: string;
  email: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: string;
  suitcases: string;
  specialLuggage: string;
  notes: string;
};

export type BookingNotification = {
  to: string;
  subject: string;
  customerName: string;
  phone: string;
  email: string;
  selectedRoute: string;
  pickup: string;
  dropoff: string;
  date: string;
  time: string;
  passengers: string;
  suitcases: string;
  specialLuggage: string;
  notes: string;
  regularPrice: string;
  summerDiscount: string;
  summerPrice: string;
  youSave: string;
  blockedTime: string;
};

export function findSelectedPrice(routeId: string): PriceConfig | null {
  return Object.values(prices).find((price) => price.id === routeId) ?? null;
}

export function createBookingNotification(
  booking: BookingRequest
): BookingNotification {
  const selectedPrice = findSelectedPrice(booking.selectedRouteId);
  const blockedTime = getBlockedTimeRange(
    booking.date,
    booking.time,
    selectedPrice
  );
  const discountedPrice = selectedPrice
    ? getDiscountedPrice(selectedPrice)
    : null;
  const savings = selectedPrice ? getSavings(selectedPrice) : null;
  const currency = selectedPrice?.currency ?? "ISK";
  const hasFixedPrice = selectedPrice?.normalPrice !== null && Boolean(selectedPrice);
  const blockedEnd =
    blockedTime.endDate === blockedTime.date
      ? blockedTime.end
      : `${blockedTime.end} on ${blockedTime.endDate}`;

  return {
    to: contact.email,
    subject: `New booking: ${booking.selectedRoute || "Custom ride"} ${booking.date} ${booking.time}`,
    customerName: booking.name,
    phone: booking.phone || "Not provided",
    email: booking.email || "Not provided",
    selectedRoute: booking.selectedRoute || "Custom ride",
    pickup: booking.pickup,
    dropoff: booking.dropoff,
    date: booking.date,
    time: booking.time,
    passengers: booking.passengers,
    suitcases: booking.suitcases,
    specialLuggage: booking.specialLuggage || "None",
    notes: booking.notes || "None",
    regularPrice: hasFixedPrice && selectedPrice
      ? formatPrice(selectedPrice.normalPrice, selectedPrice.currency)
      : "Custom Quote",
    summerDiscount: hasFixedPrice && selectedPrice
      ? `${selectedPrice.discountPercent}% Summer Discount`
      : "Not applicable",
    summerPrice:
      hasFixedPrice && selectedPrice
        ? formatPrice(discountedPrice, currency)
        : "Price confirmed before booking",
    youSave:
      hasFixedPrice && selectedPrice ? formatPrice(savings, currency) : "Not applicable",
    blockedTime: `${blockedTime.date} ${blockedTime.start}–${blockedEnd} (${blockedTime.blockMinutes} minutes)`
  };
}

export function toReservation(booking: BookingRequest): Reservation {
  const selectedPrice = findSelectedPrice(booking.selectedRouteId);
  const blockedTime = getBlockedTimeRange(
    booking.date,
    booking.time,
    selectedPrice
  );

  return {
    routeId: booking.selectedRouteId || "custom",
    date: booking.date,
    startTime: booking.time,
    blockMinutes: blockedTime.blockMinutes
  };
}
