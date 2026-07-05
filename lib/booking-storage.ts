import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { BookingNotification, BookingRequest } from "./booking";
import type { Reservation } from "./availability";
import { bookingStatuses, type BookingStatus } from "./booking-status";

export type StoredBooking = BookingRequest & {
  id: string;
  status: BookingStatus;
  createdAt: string;
  reservation: Reservation;
  notification: BookingNotification;
};

const bookingsKey = "icelandtaxioffers:bookings:v1";
const bookingLockKey = "icelandtaxioffers:booking-lock:v1";
const localDataFile =
  process.env.BOOKING_STORAGE_FILE ||
  path.join(process.cwd(), ".data", "bookings.json");
export const redisNotConfiguredMessage =
  "Booking storage is not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel Environment Variables.";

let localQueue = Promise.resolve();

function hasUpstashConfig() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

function canUseLocalStorage() {
  return process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1";
}

function ensureStorageConfigured() {
  if (hasUpstashConfig()) {
    return;
  }

  if (canUseLocalStorage()) {
    return;
  }

  throw new Error("REDIS_NOT_CONFIGURED");
}

async function redisCommand<T>(command: Array<string | number>) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error("Upstash Redis environment variables are not configured.");
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command),
    cache: "no-store"
  });

  const payload = (await response.json()) as { result?: T; error?: string };

  if (!response.ok || payload.error) {
    throw new Error(payload.error || "Upstash Redis request failed.");
  }

  return payload.result as T;
}

async function readLocalBookings() {
  try {
    const contents = await fs.readFile(localDataFile, "utf8");
    return (JSON.parse(contents) as StoredBooking[]).map(normalizeStoredBooking);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writeLocalBookings(bookings: StoredBooking[]) {
  await fs.mkdir(path.dirname(localDataFile), { recursive: true });
  await fs.writeFile(localDataFile, JSON.stringify(bookings, null, 2));
}

async function appendLocalBooking(booking: StoredBooking) {
  const bookings = await readLocalBookings();

  bookings.push(booking);
  await writeLocalBookings(bookings);
}

async function withLocalLock<T>(callback: () => Promise<T>) {
  let release = () => {};
  const previous = localQueue;

  localQueue = new Promise<void>((resolve) => {
    release = resolve;
  });

  await previous;

  try {
    return await callback();
  } finally {
    release();
  }
}

async function acquireUpstashLock() {
  const lockValue = randomUUID();
  const result = await redisCommand<string | null>([
    "SET",
    bookingLockKey,
    lockValue,
    "NX",
    "EX",
    15
  ]);

  if (result !== "OK") {
    return null;
  }

  return async () => {
    await redisCommand<number>([
      "EVAL",
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      1,
      bookingLockKey,
      lockValue
    ]).catch(() => undefined);
  };
}

export async function withBookingLock<T>(callback: () => Promise<T>) {
  ensureStorageConfigured();

  if (!hasUpstashConfig()) {
    return withLocalLock(callback);
  }

  const release = await acquireUpstashLock();

  if (!release) {
    throw new Error("BOOKING_LOCK_BUSY");
  }

  try {
    return await callback();
  } finally {
    await release();
  }
}

export async function getStoredBookings() {
  ensureStorageConfigured();

  if (!hasUpstashConfig()) {
    return readLocalBookings();
  }

  const rows = await redisCommand<string[]>(["LRANGE", bookingsKey, 0, -1]);

  return rows.map((row) => normalizeStoredBooking(JSON.parse(row) as StoredBooking));
}

export async function saveStoredBooking(booking: StoredBooking) {
  ensureStorageConfigured();

  if (!hasUpstashConfig()) {
    await appendLocalBooking(booking);
    return { provider: "local-file" as const };
  }

  await redisCommand<number>(["RPUSH", bookingsKey, JSON.stringify(booking)]);
  return { provider: "upstash-redis" as const };
}

export function bookingsToReservations(bookings: StoredBooking[]) {
  return bookings
    .filter((booking) => normalizeBookingStatus(booking.status) !== "cancelled")
    .map((booking) => booking.reservation);
}

export async function updateStoredBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  ensureStorageConfigured();

  if (!bookingStatuses.includes(status)) {
    throw new Error("INVALID_BOOKING_STATUS");
  }

  if (!hasUpstashConfig()) {
    const bookings = await readLocalBookings();
    const index = bookings.findIndex((booking) => booking.id === bookingId);

    if (index === -1) {
      return null;
    }

    const updatedBooking = { ...bookings[index], status };
    bookings[index] = updatedBooking;
    await writeLocalBookings(bookings);

    return updatedBooking;
  }

  const rows = await redisCommand<string[]>(["LRANGE", bookingsKey, 0, -1]);
  const index = rows.findIndex((row) => {
    const booking = JSON.parse(row) as StoredBooking;

    return booking.id === bookingId;
  });

  if (index === -1) {
    return null;
  }

  const booking = normalizeStoredBooking(JSON.parse(rows[index]) as StoredBooking);
  const updatedBooking = { ...booking, status };

  await redisCommand<string>(["LSET", bookingsKey, index, JSON.stringify(updatedBooking)]);

  return updatedBooking;
}

export function normalizeBookingStatus(status: string | undefined): BookingStatus {
  if (status === "reserved") {
    return "pending";
  }

  if (bookingStatuses.includes(status as BookingStatus)) {
    return status as BookingStatus;
  }

  return "pending";
}

function normalizeStoredBooking(booking: StoredBooking): StoredBooking {
  return {
    ...booking,
    status: normalizeBookingStatus(booking.status)
  };
}

export function createStoredBooking(
  booking: BookingRequest,
  reservation: Reservation,
  notification: BookingNotification
): StoredBooking {
  return {
    ...booking,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
    reservation,
    notification
  };
}
