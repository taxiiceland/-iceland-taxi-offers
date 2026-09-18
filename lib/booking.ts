import { getBlockedTimeRange, type Reservation } from "./availability";
import {
  isPastDateInIceland,
  isPastDateTimeInIceland,
  isValidDateValue,
  isValidTimeValue
} from "./iceland-time";
import {
  formatPrice,
  getDiscountedPrice,
  getSavings,
  prices,
  type PriceConfig
} from "./pricing";
import { contact, publicBookableRouteIds } from "./site-data";

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

export function isPublicBookableRouteId(routeId: string) {
  return publicBookableRouteIds.has(routeId);
}

function normalizeLocation(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function hasAny(value: string, terms: string[]) {
  return terms.some((term) => value.includes(term));
}

export function inferSelectedPriceFromLocations(
  pickup: string,
  dropoff: string
): PriceConfig {
  const from = normalizeLocation(pickup);
  const to = normalizeLocation(dropoff);
  const fromAirport = hasAny(from, ["keflavik", "kef", "airport"]);
  const toAirport = hasAny(to, ["keflavik", "kef", "airport"]);
  const fromReykjavik = hasAny(from, ["reykjavik", "hotel"]);
  const toReykjavik = hasAny(to, ["reykjavik", "hotel"]);
  const fromBlueLagoon = hasAny(from, ["blue lagoon"]);
  const toBlueLagoon = hasAny(to, ["blue lagoon"]);
  const fromSelfoss = hasAny(from, ["selfoss"]);
  const toSelfoss = hasAny(to, ["selfoss"]);

  if (fromAirport && toBlueLagoon) {
    return prices.airportToBlueLagoon;
  }

  if (fromBlueLagoon && toAirport) {
    return prices.blueLagoonToAirport;
  }

  if (fromReykjavik && toBlueLagoon) {
    return prices.reykjavikToBlueLagoon;
  }

  if (fromBlueLagoon && toReykjavik) {
    return prices.blueLagoonToReykjavik;
  }

  if (fromReykjavik && toSelfoss) {
    return prices.reykjavikToSelfoss;
  }

  if (fromSelfoss && toReykjavik) {
    return prices.customAddressTransfer;
  }

  if (fromAirport && !toAirport) {
    return prices.airportToReykjavik;
  }

  if (toAirport && !fromAirport) {
    return prices.reykjavikToAirport;
  }

  return prices.customAddressTransfer;
}

export function resolveSelectedPrice(booking: BookingRequest) {
  const explicitRoute = booking.selectedRouteId
    ? findSelectedPrice(booking.selectedRouteId)
    : null;

  if (
    explicitRoute?.category === "tour" ||
    explicitRoute?.id === prices.customTrip.id
  ) {
    return explicitRoute;
  }

  return inferSelectedPriceFromLocations(booking.pickup, booking.dropoff);
}

export function validatePickupDateTime(date: string, time: string) {
  if (!isValidDateValue(date)) {
    return "Please choose a valid pickup date.";
  }

  if (!isValidTimeValue(time)) {
    return "Please choose a valid pickup time.";
  }

  if (isPastDateInIceland(date)) {
    return "Please choose today or a future pickup date.";
  }

  if (isPastDateTimeInIceland(date, time)) {
    return "Please choose a pickup time that has not already passed.";
  }

  return "";
}

export function createBookingNotification(
  booking: BookingRequest
): BookingNotification {
  const selectedPrice = resolveSelectedPrice(booking);
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
  const customerName = booking.name.trim() || "Customer";
  const selectedRoute =
    selectedPrice?.routeName || booking.selectedRoute || "Custom long-distance trip";

  return {
    to: contact.email,
    subject: `New booking request: ${selectedRoute} ${booking.date} ${booking.time}`,
    customerName,
    phone: booking.phone || "Not provided",
    email: booking.email || "Not provided",
    selectedRoute,
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
        : "Price confirmed before booking acceptance",
    youSave:
      hasFixedPrice && selectedPrice ? formatPrice(savings, currency) : "Not applicable",
    blockedTime: `${blockedTime.date} ${blockedTime.start}–${blockedEnd} (${blockedTime.blockMinutes} minutes)`
  };
}

export function toReservation(booking: BookingRequest): Reservation {
  const selectedPrice = resolveSelectedPrice(booking);
  const blockedTime = getBlockedTimeRange(
    booking.date,
    booking.time,
    selectedPrice
  );

  return {
    routeId: selectedPrice?.id || booking.selectedRouteId || "custom",
    date: booking.date,
    startTime: booking.time,
    blockMinutes: blockedTime.blockMinutes
  };
}
