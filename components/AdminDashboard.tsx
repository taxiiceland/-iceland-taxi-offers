"use client";

import { bookingStatuses, type BookingStatus } from "@/lib/booking-status";
import type { StoredBooking } from "@/lib/booking-storage";
import { useMemo, useState } from "react";

type AdminDashboardProps = {
  initialBookings: StoredBooking[];
};

type AdminView = "list" | "calendar" | "statistics";
type PendingStatusAction = {
  booking: StoredBooking;
  status: BookingStatus;
};
type StatusUpdateHandler = (
  booking: StoredBooking,
  status: BookingStatus
) => void;
type CopyBookingHandler = (booking: StoredBooking) => void;
type OpenMapsHandler = (address: string) => void;
type ChartDay = {
  dateKey: string;
  label: string;
  bookings: number;
  revenue: number;
};
type StatisticsData = {
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  mostPopularRoute: string;
  busiestHour: string;
  statusSummary: Record<BookingStatus, number>;
  chartDays: ChartDay[];
};

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled"
};

const statusClasses: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-900 ring-amber-200",
  confirmed: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  completed: "bg-sky-100 text-sky-900 ring-sky-200",
  cancelled: "bg-rose-100 text-rose-900 ring-rose-200"
};

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const chartDayCount = 30;

function formatCreatedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function bookingPrice(booking: StoredBooking) {
  if (booking.notification?.summerPrice === "Price confirmed before booking") {
    return booking.notification.regularPrice || "Custom Quote";
  }

  return (
    booking.notification?.summerPrice ||
    booking.notification?.regularPrice ||
    "Custom Quote"
  );
}

function matchesSearch(booking: StoredBooking, search: string) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return [booking.name, booking.phone, booking.email]
    .join(" ")
    .toLowerCase()
    .includes(query);
}

function text(value: unknown, fallback = "Not provided") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed || fallback;
}

function normalizedStatus(status: unknown): BookingStatus {
  if (bookingStatuses.includes(status as BookingStatus)) {
    return status as BookingStatus;
  }

  return "pending";
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);

  nextDate.setDate(date.getDate() + days);

  return nextDate;
}

function isDateInRange(dateKey: string, startKey: string, endKey: string) {
  return dateKey >= startKey && dateKey <= endKey;
}

function monthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function createCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const calendarStart = new Date(firstDay);

  calendarStart.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);

    return date;
  });
}

function getBookingsForDate(bookings: StoredBooking[], dateKey: string) {
  return bookings
    .filter((booking) => booking.date === dateKey)
    .sort((left, right) => text(left.time, "99:99").localeCompare(text(right.time, "99:99")));
}

function hasContactValue(value: string) {
  return value !== "Not provided";
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

function emailHref(email: string) {
  return `mailto:${email}`;
}

function bookingRoute(booking: StoredBooking) {
  return text(
    booking.notification?.selectedRoute || booking.selectedRoute,
    "Custom ride"
  );
}

function buildBookingClipboardText(booking: StoredBooking) {
  const status = normalizedStatus(booking.status);

  return `Customer: ${text(booking.name)}
Phone: ${text(booking.phone)}
Email: ${text(booking.email)}

Route: ${bookingRoute(booking)}

Pickup: ${text(booking.pickup)}
Drop-off: ${text(booking.dropoff)}

Date: ${text(booking.date, "Unknown date")}
Time: ${text(booking.time, "Unknown time")}

Passengers: ${text(booking.passengers)}
Suitcases: ${text(booking.suitcases)}
Special luggage: ${text(booking.specialLuggage, "None")}
Notes: ${text(booking.notes, "None")}

Price: ${bookingPrice(booking)}

Status: ${statusLabels[status]}`;
}

function parseISKPrice(value: string) {
  if (!value.includes("ISK")) {
    return 0;
  }

  const amount = Number(value.replace(/[^\d]/g, ""));

  return Number.isFinite(amount) ? amount : 0;
}

function bookingRevenue(booking: StoredBooking) {
  if (normalizedStatus(booking.status) === "cancelled") {
    return 0;
  }

  return parseISKPrice(booking.notification?.summerPrice || bookingPrice(booking));
}

function formatISK(amount: number) {
  return `${new Intl.NumberFormat("en-US").format(amount)} ISK`;
}

function getWeekRange(todayKey: string) {
  const today = parseDateKey(todayKey);
  const mondayOffset = (today.getDay() + 6) % 7;
  const start = addDays(today, -mondayOffset);
  const end = addDays(start, 6);

  return {
    startKey: toDateKey(start),
    endKey: toDateKey(end)
  };
}

function getMonthRange(todayKey: string) {
  const today = parseDateKey(todayKey);
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return {
    startKey: toDateKey(start),
    endKey: toDateKey(end)
  };
}

function getRouteCounts(bookings: StoredBooking[]) {
  return bookings
    .filter((booking) => normalizedStatus(booking.status) !== "cancelled")
    .reduce<Record<string, number>>((counts, booking) => {
      const route = bookingRoute(booking);

      counts[route] = (counts[route] ?? 0) + 1;

      return counts;
    }, {});
}

function getMostPopularRoute(bookings: StoredBooking[]) {
  const routeCounts = getRouteCounts(bookings);
  const [route] =
    Object.entries(routeCounts).sort((left, right) => right[1] - left[1])[0] ??
    [];

  return route || "No bookings yet";
}

function getBusiestBookingHour(bookings: StoredBooking[]) {
  const hourCounts = bookings
    .filter((booking) => normalizedStatus(booking.status) !== "cancelled")
    .reduce<Record<string, number>>((counts, booking) => {
      const hour = text(booking.time, "").slice(0, 2);

      if (!/^\d{2}$/.test(hour)) {
        return counts;
      }

      counts[hour] = (counts[hour] ?? 0) + 1;

      return counts;
    }, {});
  const [hour] =
    Object.entries(hourCounts).sort((left, right) => right[1] - left[1])[0] ??
    [];

  if (!hour) {
    return "No bookings yet";
  }

  const nextHour = String((Number(hour) + 1) % 24).padStart(2, "0");

  return `${hour}:00–${nextHour}:00`;
}

function getLastThirtyDays(todayKey: string) {
  const today = parseDateKey(todayKey);

  return Array.from({ length: chartDayCount }, (_, index) =>
    toDateKey(addDays(today, index - (chartDayCount - 1)))
  );
}

function chartLabel(dateKey: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short"
  }).format(parseDateKey(dateKey));
}

export default function AdminDashboard({
  initialBookings
}: AdminDashboardProps) {
  const todayKey = toDateKey(new Date());
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [activeView, setActiveView] = useState<AdminView>("list");
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [pendingAction, setPendingAction] = useState<PendingStatusAction | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const status = normalizedStatus(booking.status);
        const statusMatches = statusFilter === "all" || status === statusFilter;

        return statusMatches && matchesSearch(booking, search);
      }),
    [bookings, search, statusFilter]
  );

  const bookingsByDate = useMemo(() => {
    return filteredBookings.reduce<Record<string, StoredBooking[]>>(
      (groups, booking) => {
        const date = text(booking.date, "");

        if (!date) {
          return groups;
        }

        groups[date] = [...(groups[date] ?? []), booking];

        return groups;
      },
      {}
    );
  }, [filteredBookings]);

  const todayBookings = getBookingsForDate(filteredBookings, todayKey);
  const selectedBookings = getBookingsForDate(filteredBookings, selectedDate);
  const calendarDays = createCalendarDays(visibleMonth);
  const statistics = useMemo<StatisticsData>(() => {
    const weekRange = getWeekRange(todayKey);
    const monthRange = getMonthRange(todayKey);
    const revenueForRange = (startKey: string, endKey: string) =>
      bookings
        .filter((booking) =>
          isDateInRange(text(booking.date, ""), startKey, endKey)
        )
        .reduce((total, booking) => total + bookingRevenue(booking), 0);
    const countForRange = (startKey: string, endKey: string) =>
      bookings.filter((booking) =>
        isDateInRange(text(booking.date, ""), startKey, endKey)
      ).length;
    const statusSummary = bookingStatuses.reduce<Record<BookingStatus, number>>(
      (summary, status) => {
        summary[status] = bookings.filter(
          (booking) => normalizedStatus(booking.status) === status
        ).length;

        return summary;
      },
      {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0
      }
    );
    const chartDays = getLastThirtyDays(todayKey).map((dateKey) => {
      const dayBookings = bookings.filter((booking) => booking.date === dateKey);

      return {
        dateKey,
        label: chartLabel(dateKey),
        bookings: dayBookings.length,
        revenue: dayBookings.reduce(
          (total, booking) => total + bookingRevenue(booking),
          0
        )
      };
    });

    return {
      todayBookings: countForRange(todayKey, todayKey),
      weekBookings: countForRange(weekRange.startKey, weekRange.endKey),
      monthBookings: countForRange(monthRange.startKey, monthRange.endKey),
      todayRevenue: revenueForRange(todayKey, todayKey),
      weekRevenue: revenueForRange(weekRange.startKey, weekRange.endKey),
      monthRevenue: revenueForRange(monthRange.startKey, monthRange.endKey),
      mostPopularRoute: getMostPopularRoute(bookings),
      busiestHour: getBusiestBookingHour(bookings),
      statusSummary,
      chartDays
    };
  }, [bookings, todayKey]);

  function showSuccessToast(message = "Booking updated successfully.") {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(""), 3500);
  }

  function openMaps(address: string) {
    const query = encodeURIComponent(address);
    const userAgent = navigator.userAgent;
    const isAppleDevice = /iPad|iPhone|iPod|Macintosh/i.test(userAgent);
    const url = isAppleDevice
      ? `http://maps.apple.com/?q=${query}`
      : `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyBooking(booking: StoredBooking) {
    setError("");
    setSuccessMessage("");

    try {
      const details = buildBookingClipboardText(booking);

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(details);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = details;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      showSuccessToast("Booking copied.");
    } catch {
      setError("Booking details could not be copied.");
    }
  }

  function requestStatusUpdate(booking: StoredBooking, status: BookingStatus) {
    setError("");
    setSuccessMessage("");

    if (
      status === "confirmed" ||
      status === "completed" ||
      status === "cancelled"
    ) {
      setPendingAction({ booking, status });
      setCancellationReason("");
      return;
    }

    void updateStatus(booking.id, status);
  }

  async function confirmPendingAction() {
    if (!pendingAction) {
      return;
    }

    const didUpdate = await updateStatus(
      pendingAction.booking.id,
      pendingAction.status,
      pendingAction.status === "cancelled" ? cancellationReason : undefined
    );

    if (didUpdate) {
      setPendingAction(null);
      setCancellationReason("");
    }
  }

  async function updateStatus(
    bookingId: string,
    status: BookingStatus,
    reason?: string
  ) {
    setError("");
    setUpdatingId(bookingId);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status, cancellationReason: reason || "" })
      });
      const payload = (await response.json()) as {
        booking?: StoredBooking;
        error?: string;
      };

      if (!response.ok || !payload.booking) {
        throw new Error(payload.error || "Booking status could not be updated.");
      }

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId ? payload.booking! : booking
        )
      );
      showSuccessToast();
      return true;
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Booking status could not be updated."
      );
      return false;
    } finally {
      setUpdatingId("");
    }
  }

  function moveMonth(direction: -1 | 1) {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + direction, 1)
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      {successMessage ? (
        <div
          role="status"
          className="fixed right-4 top-4 z-50 rounded-2xl border border-emerald-400/30 bg-emerald-500 px-4 py-3 text-sm font-black text-white shadow-[0_16px_45px_rgba(0,0,0,0.25)]"
        >
          {successMessage}
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gold">
              Iceland Taxi Offers
            </p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm font-semibold text-white/60">
              View bookings and update trip status.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.08] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
              Total bookings
            </p>
            <p className="mt-1 text-3xl font-black">{bookings.length}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.08] p-4 md:grid-cols-[1fr_260px]">
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Search by name, phone, or email
            <input
              className="rounded-xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search bookings..."
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-white/80">
            Status
            <select
              className="rounded-xl border border-white/10 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as BookingStatus | "all")
              }
            >
              <option value="all">All statuses</option>
              {bookingStatuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 grid grid-cols-3 rounded-2xl border border-white/10 bg-white/[0.08] p-1 sm:w-fit">
          {(["list", "calendar", "statistics"] as AdminView[]).map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
              className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                activeView === view
                  ? "bg-gold text-slate-950"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              {view === "list"
                ? "List View"
                : view === "calendar"
                  ? "Calendar View"
                  : "Statistics"}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/[0.12] p-4 text-sm font-bold text-red-100">
            {error}
          </div>
        ) : null}

        {activeView === "list" ? (
          <ListView
            bookings={filteredBookings}
            copyBooking={copyBooking}
            openMaps={openMaps}
            updatingId={updatingId}
            updateStatus={requestStatusUpdate}
          />
        ) : activeView === "calendar" ? (
          <CalendarView
            bookingsByDate={bookingsByDate}
            calendarDays={calendarDays}
            selectedBookings={selectedBookings}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            todayBookings={todayBookings}
            todayKey={todayKey}
            copyBooking={copyBooking}
            openMaps={openMaps}
            updateStatus={requestStatusUpdate}
            updatingId={updatingId}
            visibleMonth={visibleMonth}
            moveMonth={moveMonth}
          />
        ) : (
          <StatisticsView statistics={statistics} />
        )}
      </div>
      {pendingAction ? (
        <StatusConfirmationModal
          action={pendingAction}
          cancellationReason={cancellationReason}
          onCancel={() => {
            setPendingAction(null);
            setCancellationReason("");
          }}
          onConfirm={confirmPendingAction}
          onReasonChange={setCancellationReason}
          updating={updatingId === pendingAction.booking.id}
        />
      ) : null}
    </div>
  );
}

function StatisticsView({ statistics }: { statistics: StatisticsData }) {
  return (
    <div className="mt-6 grid gap-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          icon="🚖"
          label="Today's Bookings"
          value={String(statistics.todayBookings)}
          detail="Total bookings today"
        />
        <StatisticsCard
          icon="📅"
          label="This Week"
          value={`${statistics.weekBookings} bookings`}
          detail="Monday through Sunday"
        />
        <StatisticsCard
          icon="📆"
          label="This Month"
          value={`${statistics.monthBookings} bookings`}
          detail="Current calendar month"
        />
        <RevenueStatisticsCard statistics={statistics} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <InsightCard
          icon="⭐"
          label="Most Popular Route"
          value={statistics.mostPopularRoute}
        />
        <InsightCard
          icon="🕒"
          label="Busiest Booking Hour"
          value={statistics.busiestHour}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gold">
              Booking Status Summary
            </p>
            <h2 className="mt-2 text-2xl font-black">Current Status</h2>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {bookingStatuses.map((status) => (
            <div
              key={status}
              className="rounded-2xl border border-white/10 bg-white p-4 text-slate-950"
            >
              <StatusPill status={status} />
              <p className="mt-4 text-3xl font-black">
                {statistics.statusSummary[status]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <StatisticsChart
          title="Bookings per day"
          detail="Last 30 days"
          data={statistics.chartDays}
          metric="bookings"
          formatValue={(value) => String(value)}
        />
        <StatisticsChart
          title="Revenue per day"
          detail="Last 30 days"
          data={statistics.chartDays}
          metric="revenue"
          formatValue={formatISK}
        />
      </section>
    </div>
  );
}

function StatisticsCard({
  detail,
  icon,
  label,
  value
}: {
  detail: string;
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white p-4 text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
          {label}
        </p>
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-2 text-sm font-bold text-slate-500">{detail}</p>
    </div>
  );
}

function RevenueStatisticsCard({
  statistics
}: {
  statistics: StatisticsData;
}) {
  return (
    <div className="rounded-2xl border border-gold/30 bg-gold p-4 text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-800">
          Estimated Revenue
        </p>
        <span className="text-2xl" aria-hidden="true">
          💰
        </span>
      </div>
      <div className="mt-4 grid gap-2">
        <RevenueLine label="Today" value={formatISK(statistics.todayRevenue)} />
        <RevenueLine label="This Week" value={formatISK(statistics.weekRevenue)} />
        <RevenueLine label="This Month" value={formatISK(statistics.monthRevenue)} />
      </div>
    </div>
  );
}

function RevenueLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.35] px-3 py-2">
      <span className="text-xs font-black uppercase tracking-[0.08em]">
        {label}
      </span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  value
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gold">
          {label}
        </p>
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-black">{value}</p>
    </div>
  );
}

function StatisticsChart({
  data,
  detail,
  formatValue,
  metric,
  title
}: {
  data: ChartDay[];
  detail: string;
  formatValue: (value: number) => string;
  metric: "bookings" | "revenue";
  title: string;
}) {
  const maxValue = Math.max(...data.map((day) => day[metric]), 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-white p-4 text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.18)] sm:p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black">{title}</h2>
        <p className="text-sm font-bold text-slate-500">{detail}</p>
      </div>
      <div className="mt-5 overflow-x-auto pb-2">
        <div className="flex min-w-[720px] items-end gap-2">
          {data.map((day, index) => {
            const value = day[metric];
            const height = value > 0 ? Math.max((value / maxValue) * 150, 8) : 4;
            const showLabel = index === 0 || index === data.length - 1 || index % 5 === 0;

            return (
              <div
                key={day.dateKey}
                className="flex flex-1 flex-col items-center gap-2"
                title={`${day.label}: ${formatValue(value)}`}
              >
                <div className="flex h-40 w-full items-end rounded-full bg-slate-100 px-1">
                  <div
                    className="w-full rounded-full bg-gold"
                    style={{ height: `${height}px` }}
                  />
                </div>
                <span className="h-8 text-center text-[0.65rem] font-black leading-3 text-slate-400">
                  {showLabel ? day.label : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ListView({
  bookings,
  copyBooking,
  openMaps,
  updateStatus,
  updatingId
}: {
  bookings: StoredBooking[];
  copyBooking: CopyBookingHandler;
  openMaps: OpenMapsHandler;
  updateStatus: StatusUpdateHandler;
  updatingId: string;
}) {
  return (
    <div className="mt-6 grid gap-4">
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <AdminBookingCard
            key={text(booking.id, `${booking.createdAt}-${booking.date}-${booking.time}`)}
            booking={booking}
            copyBooking={copyBooking}
            mode="full"
            openMaps={openMaps}
            updateStatus={updateStatus}
            updatingId={updatingId}
          />
        ))
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-8 text-center text-sm font-bold text-white/70">
          No bookings match the current search or filter.
        </div>
      )}
    </div>
  );
}

function CalendarView({
  bookingsByDate,
  calendarDays,
  copyBooking,
  moveMonth,
  openMaps,
  selectedBookings,
  selectedDate,
  setSelectedDate,
  todayBookings,
  todayKey,
  updateStatus,
  updatingId,
  visibleMonth
}: {
  bookingsByDate: Record<string, StoredBooking[]>;
  calendarDays: Date[];
  copyBooking: CopyBookingHandler;
  moveMonth: (direction: -1 | 1) => void;
  openMaps: OpenMapsHandler;
  selectedBookings: StoredBooking[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  todayBookings: StoredBooking[];
  todayKey: string;
  updateStatus: StatusUpdateHandler;
  updatingId: string;
  visibleMonth: Date;
}) {
  const selectedLabel = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full"
  }).format(parseDateKey(selectedDate));

  return (
    <div className="mt-6 grid gap-6">
      <section className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gold">
              Today&apos;s Bookings
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {todayBookings.length} booking{todayBookings.length === 1 ? "" : "s"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSelectedDate(todayKey)}
            className="w-fit rounded-full bg-gold px-4 py-2 text-xs font-black uppercase tracking-[0.06em] text-slate-950"
          >
            Open Today
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {todayBookings.length > 0 ? (
            todayBookings.map((booking) => (
              <CalendarBookingCard
                key={text(booking.id, `${booking.createdAt}-${booking.date}-${booking.time}`)}
                booking={booking}
                copyBooking={copyBooking}
                openMaps={openMaps}
              />
            ))
          ) : (
            <p className="rounded-xl bg-white/[0.08] p-4 text-sm font-bold text-white/70">
              No bookings.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white p-4 text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.25)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-black">{monthLabel(visibleMonth)}</h2>
          <div className="grid grid-cols-2 gap-2 sm:w-fit">
            <button
              type="button"
              onClick={() => moveMonth(-1)}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-800 hover:bg-slate-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => moveMonth(1)}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-800 hover:bg-slate-200"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-1 text-center text-[0.68rem] font-black uppercase tracking-[0.08em] text-slate-400 sm:text-xs">
          {weekdayLabels.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((date) => {
            const dateKey = toDateKey(date);
            const inCurrentMonth = date.getMonth() === visibleMonth.getMonth();
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDate;
            const bookingCount = bookingsByDate[dateKey]?.length ?? 0;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={`relative min-h-16 rounded-xl border p-1.5 text-left transition sm:min-h-24 sm:p-3 ${
                  isSelected
                    ? "border-gold bg-gold/[0.16] shadow-[0_0_0_3px_rgba(214,168,79,0.16)]"
                    : "border-slate-100 bg-white hover:border-gold/70"
                } ${inCurrentMonth ? "text-slate-950" : "text-slate-300"}`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${
                    isToday ? "bg-slate-950 text-white" : ""
                  }`}
                >
                  {date.getDate()}
                </span>
                {bookingCount > 0 ? (
                  <span className="absolute bottom-1.5 right-1.5 inline-flex min-w-6 items-center justify-center rounded-full bg-gold px-1.5 py-1 text-xs font-black text-slate-950 sm:bottom-2 sm:right-2">
                    {bookingCount}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-gold">
              Selected Day
            </p>
            <h2 className="mt-2 text-2xl font-black">{selectedLabel}</h2>
          </div>
          <p className="text-sm font-bold text-white/60">
            {selectedBookings.length} booking
            {selectedBookings.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="mt-4 grid gap-4">
          {selectedBookings.length > 0 ? (
            selectedBookings.map((booking) => (
              <AdminBookingCard
                key={text(booking.id, `${booking.createdAt}-${booking.date}-${booking.time}`)}
                booking={booking}
                copyBooking={copyBooking}
                mode="calendar"
                openMaps={openMaps}
                updateStatus={updateStatus}
                updatingId={updatingId}
              />
            ))
          ) : (
            <p className="rounded-xl bg-white/[0.08] p-4 text-sm font-bold text-white/70">
              No bookings.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function AdminBookingCard({
  booking,
  copyBooking,
  mode,
  openMaps,
  updateStatus,
  updatingId
}: {
  booking: StoredBooking;
  copyBooking: CopyBookingHandler;
  mode: "full" | "calendar";
  openMaps: OpenMapsHandler;
  updateStatus: StatusUpdateHandler;
  updatingId: string;
}) {
  const status = normalizedStatus(booking.status);

  return (
    <article className="rounded-2xl border border-white/10 bg-white p-4 text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.25)] sm:p-5">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black">{text(booking.name)}</h2>
            <StatusPill status={status} />
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            {mode === "calendar"
              ? `${text(booking.time, "Unknown time")} • ${text(
                  booking.notification?.selectedRoute || booking.selectedRoute,
                  "Custom ride"
                )}`
              : `Created ${formatCreatedDate(booking.createdAt)}`}
          </p>
        </div>
        <StatusButtons
          booking={booking}
          status={status}
          updateStatus={updateStatus}
          updatingId={updatingId}
        />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {mode === "calendar" ? (
          <>
            <Detail
              label="Route"
              value={text(
                booking.notification?.selectedRoute || booking.selectedRoute,
                "Custom ride"
              )}
            />
            <Detail label="Pickup" value={text(booking.pickup)} />
            <Detail label="Drop-off" value={text(booking.dropoff)} />
            <Detail label="Phone" value={text(booking.phone)} />
          </>
        ) : (
          <>
            <Detail label="Phone" value={text(booking.phone)} />
            <Detail label="Email" value={text(booking.email)} />
            <Detail
              label="Route / tour"
              value={text(
                booking.notification?.selectedRoute || booking.selectedRoute,
                "Custom ride"
              )}
            />
            <Detail label="Price" value={bookingPrice(booking)} />
            <Detail label="Pickup" value={text(booking.pickup)} />
            <Detail label="Dropoff" value={text(booking.dropoff)} />
            <Detail
              label="Date and time"
              value={`${text(booking.date, "Unknown date")} ${text(
                booking.time,
                "Unknown time"
              )}`}
            />
            <Detail label="Passengers" value={text(booking.passengers)} />
            <Detail label="Suitcases" value={text(booking.suitcases)} />
            <Detail
              label="Special luggage"
              value={text(booking.specialLuggage, "None")}
            />
            <Detail label="Notes" value={text(booking.notes, "None")} wide />
          </>
        )}
      </div>
      <BookingQuickActions
        booking={booking}
        copyBooking={copyBooking}
        openMaps={openMaps}
      />
    </article>
  );
}

function CalendarBookingCard({
  booking,
  copyBooking,
  openMaps
}: {
  booking: StoredBooking;
  copyBooking: CopyBookingHandler;
  openMaps: OpenMapsHandler;
}) {
  const status = normalizedStatus(booking.status);

  return (
    <div className="rounded-xl bg-white p-4 text-slate-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black">{text(booking.name)}</h3>
          <p className="mt-1 text-sm font-bold text-slate-500">
            {text(booking.time, "Unknown time")} •{" "}
            {text(
              booking.notification?.selectedRoute || booking.selectedRoute,
              "Custom ride"
            )}
          </p>
        </div>
        <StatusPill status={status} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Detail label="Pickup" value={text(booking.pickup)} />
        <Detail label="Drop-off" value={text(booking.dropoff)} />
        <Detail label="Phone" value={text(booking.phone)} />
      </div>
      <BookingQuickActions
        booking={booking}
        copyBooking={copyBooking}
        openMaps={openMaps}
      />
    </div>
  );
}

function BookingQuickActions({
  booking,
  copyBooking,
  openMaps
}: {
  booking: StoredBooking;
  copyBooking: CopyBookingHandler;
  openMaps: OpenMapsHandler;
}) {
  const phone = text(booking.phone);
  const email = text(booking.email);
  const pickup = text(booking.pickup);
  const dropoff = text(booking.dropoff);
  const hasPhone = hasContactValue(phone);
  const hasEmail = hasContactValue(email);
  const hasPickup = hasContactValue(pickup);
  const hasDropoff = hasContactValue(dropoff);
  const buttonClass =
    "inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-black text-slate-800 transition hover:bg-slate-200";
  const disabledClass =
    "inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-3 py-2 text-center text-xs font-black text-slate-400 opacity-60";

  return (
    <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-5">
      {hasPhone ? (
        <a className={buttonClass} href={phoneHref(phone)}>
          📞 Call Customer
        </a>
      ) : (
        <span className={disabledClass}>📞 Call Customer</span>
      )}
      {hasEmail ? (
        <a className={buttonClass} href={emailHref(email)}>
          📧 Email Customer
        </a>
      ) : (
        <span className={disabledClass}>📧 Email Customer</span>
      )}
      <button
        type="button"
        disabled={!hasPickup}
        onClick={() => openMaps(pickup)}
        className={hasPickup ? buttonClass : disabledClass}
      >
        📍 Open Pickup in Maps
      </button>
      <button
        type="button"
        disabled={!hasDropoff}
        onClick={() => openMaps(dropoff)}
        className={hasDropoff ? buttonClass : disabledClass}
      >
        📍 Open Drop-off in Maps
      </button>
      <button
        type="button"
        onClick={() => copyBooking(booking)}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-3 py-2 text-center text-xs font-black text-white transition hover:bg-slate-800 sm:col-span-2 xl:col-span-1"
      >
        📋 Copy Booking
      </button>
    </div>
  );
}

function StatusButtons({
  booking,
  status,
  updateStatus,
  updatingId
}: {
  booking: StoredBooking;
  status: BookingStatus;
  updateStatus: StatusUpdateHandler;
  updatingId: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {bookingStatuses.map((nextStatus) => (
        <button
          key={nextStatus}
          type="button"
          disabled={updatingId === booking.id || status === nextStatus}
          onClick={() => updateStatus(booking, nextStatus)}
          className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.06em] transition ${
            status === nextStatus
              ? "bg-gold text-slate-950"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {statusLabels[nextStatus]}
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase ring-1 ${statusClasses[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

function StatusConfirmationModal({
  action,
  cancellationReason,
  onCancel,
  onConfirm,
  onReasonChange,
  updating
}: {
  action: PendingStatusAction;
  cancellationReason: string;
  onCancel: () => void;
  onConfirm: () => void;
  onReasonChange: (value: string) => void;
  updating: boolean;
}) {
  const isCancellation = action.status === "cancelled";
  const route = text(
    action.booking.notification?.selectedRoute || action.booking.selectedRoute,
    "Custom ride"
  );
  const question = isCancellation
    ? "Are you sure you want to cancel this booking?"
    : action.status === "confirmed"
      ? "Are you sure you want to confirm this booking?"
      : "Are you sure you want to mark this booking as completed?";
  const confirmLabel = isCancellation
    ? "Cancel Booking"
    : action.status === "confirmed"
      ? "Confirm Booking"
      : "Mark Completed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/75 px-4 py-5 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-confirmation-title"
    >
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 text-slate-950 shadow-[0_24px_90px_rgba(0,0,0,0.35)] sm:p-6">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-gold">
          Booking Status
        </p>
        <h2 id="status-confirmation-title" className="mt-3 text-2xl font-black">
          {question}
        </h2>
        <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4">
          <Detail label="Customer" value={text(action.booking.name)} />
          <Detail
            label="Date and time"
            value={`${text(action.booking.date, "Unknown date")} ${text(
              action.booking.time,
              "Unknown time"
            )}`}
          />
          <Detail label="Route" value={route} />
        </div>

        {isCancellation ? (
          <label className="mt-4 grid gap-2 text-sm font-bold text-slate-700">
            Cancellation reason optional
            <textarea
              className="min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/20"
              value={cancellationReason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Add a short reason for the customer email..."
            />
          </label>
        ) : null}

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={updating}
            className="rounded-full bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={updating}
            className={`rounded-full px-4 py-3 text-sm font-black text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isCancellation
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-slate-950 hover:bg-slate-800"
            }`}
          >
            {updating ? "Updating..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
  wide = false
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "xl:col-span-2" : ""}>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}
