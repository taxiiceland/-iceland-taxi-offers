import { prices, type PriceConfig } from "./pricing";

export type Reservation = {
  routeId: string;
  date: string;
  startTime: string;
  blockMinutes: number;
};

export type ManualUnavailableTime = {
  date: string;
  start: string;
  end: string;
  reason: string;
};

const availabilitySchedule = {
  startMinutes: 0,
  endMinutes: 24 * 60,
  intervalMinutes: 30
};

export const manualUnavailableTimes: ManualUnavailableTime[] = [
  // Example:
  // { date: "2026-06-28", start: "02:00", end: "09:00", reason: "Driver rest" }
];

const twoHourTransferBlock = 120;

const routeBlockMinutes: Record<string, number> = {
  [prices.airportToReykjavik.id]: twoHourTransferBlock,
  [prices.reykjavikToAirport.id]: twoHourTransferBlock,
  [prices.airportToBlueLagoon.id]: twoHourTransferBlock,
  [prices.reykjavikToBlueLagoon.id]: twoHourTransferBlock,
  [prices.blueLagoonToReykjavik.id]: twoHourTransferBlock,
  [prices.blueLagoonToAirport.id]: twoHourTransferBlock,
  [prices.customAddressTransfer.id]: twoHourTransferBlock,
  [prices.goldenCircle.id]: 6 * 60,
  [prices.southCoast.id]: 12 * 60,
  [prices.silverCircle.id]: 6 * 60,
  [prices.snaefellsnes.id]: 12 * 60,
  [prices.blueLagoon.id]: 4 * 60,
  [prices.reykjanesLavaTour.id]: 5 * 60,
  [prices.reykjavikSightseeing.id]: 2 * 60,
  [prices.cityCenter.id]: 60,
  [prices.hvammsvikOneWay.id]: twoHourTransferBlock,
  [prices.hvammsvikReturn.id]: 4 * 60,
  [prices.customTrip.id]: 4 * 60
};

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes: number) {
  const normalizedMinutes = ((minutes % minutesPerDay) + minutesPerDay) % minutesPerDay;
  const hours = Math.floor(normalizedMinutes / 60)
    .toString()
    .padStart(2, "0");
  const remainder = (normalizedMinutes % 60).toString().padStart(2, "0");

  return `${hours}:${remainder}`;
}

const minutesPerDay = 24 * 60;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

function toDayIndex(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, day) / millisecondsPerDay);
}

function fromDayIndex(dayIndex: number) {
  const date = new Date(dayIndex * millisecondsPerDay);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toAbsoluteMinutes(date: string, time: string) {
  return toDayIndex(date) * minutesPerDay + toMinutes(time);
}

function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
) {
  return startA < endB && startB < endA;
}

export function getRouteBlockMinutes(route?: Pick<PriceConfig, "id"> | null) {
  if (!route) {
    return twoHourTransferBlock;
  }

  return routeBlockMinutes[route.id] ?? twoHourTransferBlock;
}

export function getBlockedTimeRange(
  date: string,
  startTime: string,
  route?: Pick<PriceConfig, "id"> | null
) {
  const blockMinutes = getRouteBlockMinutes(route);
  const startMinutes = toAbsoluteMinutes(date, startTime);
  const endMinutes = startMinutes + blockMinutes;
  const endDate = fromDayIndex(Math.floor(endMinutes / minutesPerDay));

  return {
    date,
    start: startTime,
    end: toTime(endMinutes),
    endDate,
    blockMinutes
  };
}

export function isSlotAvailable(
  date: string,
  startTime: string,
  route?: Pick<PriceConfig, "id"> | null,
  reservations: Reservation[] = [],
  unavailableTimes: ManualUnavailableTime[] = manualUnavailableTimes
) {
  if (!date || !startTime) {
    return false;
  }

  const blockMinutes = getRouteBlockMinutes(route);
  const slotStartAbsolute = toAbsoluteMinutes(date, startTime);
  const slotEndAbsolute = slotStartAbsolute + blockMinutes;

  const blockedByAcceptedBooking = reservations.some((reservation) => {
    const reservedStart = toAbsoluteMinutes(reservation.date, reservation.startTime);
    const reservedEnd = reservedStart + reservation.blockMinutes;

    return rangesOverlap(
      slotStartAbsolute,
      slotEndAbsolute,
      reservedStart,
      reservedEnd
    );
  });

  const blockedManually = unavailableTimes.some((block) => {
    const blockStart = toAbsoluteMinutes(block.date, block.start);
    let blockEnd = toAbsoluteMinutes(block.date, block.end);

    if (blockEnd <= blockStart) {
      blockEnd += minutesPerDay;
    }

    return rangesOverlap(slotStartAbsolute, slotEndAbsolute, blockStart, blockEnd);
  });

  return !blockedByAcceptedBooking && !blockedManually;
}

export function getAvailableSlots(
  date: string,
  route?: Pick<PriceConfig, "id"> | null,
  reservations: Reservation[] = [],
  unavailableTimes: ManualUnavailableTime[] = manualUnavailableTimes
) {
  if (!date) {
    return [];
  }

  const slots: string[] = [];

  for (
    let slotStart = availabilitySchedule.startMinutes;
    slotStart < availabilitySchedule.endMinutes;
    slotStart += availabilitySchedule.intervalMinutes
  ) {
    const slot = toTime(slotStart);

    if (isSlotAvailable(date, slot, route, reservations, unavailableTimes)) {
      slots.push(slot);
    }
  }

  return slots;
}
