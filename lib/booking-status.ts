export const bookingStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled"
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];
