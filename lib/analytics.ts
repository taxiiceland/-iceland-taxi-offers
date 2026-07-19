import type { BookingNotification, BookingRequest } from "./booking";

type GtagArgs = [string, ...unknown[]];

declare global {
  interface Window {
    dataLayer?: GtagArgs[];
    gtag?: (...args: GtagArgs) => void;
  }
}

export const googleAnalyticsId =
  process.env.NEXT_PUBLIC_GA_ID || "G-5K197GWZKP";

function ensureGtag() {
  if (typeof window === "undefined") {
    return null;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    ((...args: GtagArgs) => {
      window.dataLayer?.push(args);
    });

  return window.gtag;
}

function parseISKPrice(value: string) {
  if (!value.includes("ISK")) {
    return undefined;
  }

  const amount = Number(value.replace(/[^\d]/g, ""));

  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

export function trackPageView(path: string) {
  const gtag = ensureGtag();

  if (!gtag) {
    return;
  }

  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
  });
}

export function trackBookingCompleted(
  notification: BookingNotification,
  booking: BookingRequest
) {
  const gtag = ensureGtag();

  if (!gtag) {
    return;
  }

  const value = parseISKPrice(notification.summerPrice);

  gtag("event", "booking_completed", {
    event_category: "booking",
    event_label: notification.selectedRoute,
    route_name: notification.selectedRoute,
    route_id: booking.selectedRouteId || "custom",
    passengers: Number(booking.passengers) || undefined,
    suitcases: Number(booking.suitcases) || undefined,
    value,
    currency: value ? "ISK" : undefined
  });
}
