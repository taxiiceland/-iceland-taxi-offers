const icelandTimeZone = "Atlantic/Reykjavik";

function getIcelandParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: icelandTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return {
    year: value("year"),
    month: value("month"),
    day: value("day"),
    hour: Number(value("hour")),
    minute: Number(value("minute"))
  };
}

export function getIcelandToday(now = new Date()) {
  const parts = getIcelandParts(now);

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getIcelandCurrentMinutes(now = new Date()) {
  const parts = getIcelandParts(now);

  return parts.hour * 60 + parts.minute;
}

export function isValidDateValue(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

export function isValidTimeValue(time: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

export function isPastDateInIceland(date: string, now = new Date()) {
  if (!isValidDateValue(date)) {
    return false;
  }

  return date < getIcelandToday(now);
}

export function isPastDateTimeInIceland(
  date: string,
  time: string,
  now = new Date()
) {
  if (!isValidDateValue(date) || !isValidTimeValue(time)) {
    return false;
  }

  const today = getIcelandToday(now);

  if (date < today) {
    return true;
  }

  if (date > today) {
    return false;
  }

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes < getIcelandCurrentMinutes(now);
}
