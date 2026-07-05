"use client";

import { bookingStatuses, type BookingStatus } from "@/lib/booking-status";
import type { StoredBooking } from "@/lib/booking-storage";
import { useMemo, useState } from "react";

type AdminDashboardProps = {
  initialBookings: StoredBooking[];
};

const statusLabels: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled"
};

function formatCreatedDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function bookingPrice(booking: StoredBooking) {
  if (booking.notification.summerPrice === "Price confirmed before booking") {
    return booking.notification.regularPrice;
  }

  return booking.notification.summerPrice;
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

export default function AdminDashboard({
  initialBookings
}: AdminDashboardProps) {
  const [bookings, setBookings] = useState(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const statusMatches =
          statusFilter === "all" || booking.status === statusFilter;

        return statusMatches && matchesSearch(booking, search);
      }),
    [bookings, search, statusFilter]
  );

  async function updateStatus(bookingId: string, status: BookingStatus) {
    setError("");
    setUpdatingId(bookingId);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
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
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Booking status could not be updated."
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
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
          <div className="rounded-2xl border border-white/10 bg-white/8 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/50">
              Total bookings
            </p>
            <p className="mt-1 text-3xl font-black">{bookings.length}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl border border-white/10 bg-white/8 p-4 md:grid-cols-[1fr_260px]">
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

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/12 p-4 text-sm font-bold text-red-100">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-2xl border border-white/10 bg-white p-4 text-slate-950 shadow-[0_20px_70px_rgba(0,0,0,0.25)] sm:p-5"
              >
                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black">{booking.name}</h2>
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black uppercase text-white">
                        {statusLabels[booking.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      Created {formatCreatedDate(booking.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {bookingStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={updatingId === booking.id || booking.status === status}
                        onClick={() => updateStatus(booking.id, status)}
                        className={`rounded-full px-3 py-2 text-xs font-black uppercase tracking-[0.06em] transition ${
                          booking.status === status
                            ? "bg-gold text-slate-950"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  <Detail label="Phone" value={booking.phone || "Not provided"} />
                  <Detail label="Email" value={booking.email || "Not provided"} />
                  <Detail label="Route / tour" value={booking.notification.selectedRoute} />
                  <Detail label="Price" value={bookingPrice(booking)} />
                  <Detail label="Pickup" value={booking.pickup} />
                  <Detail label="Dropoff" value={booking.dropoff} />
                  <Detail label="Date and time" value={`${booking.date} ${booking.time}`} />
                  <Detail label="Passengers" value={booking.passengers} />
                  <Detail label="Suitcases" value={booking.suitcases} />
                  <Detail label="Special luggage" value={booking.specialLuggage || "None"} />
                  <Detail label="Notes" value={booking.notes || "None"} wide />
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/8 p-8 text-center text-sm font-bold text-white/70">
              No bookings match the current search or filter.
            </div>
          )}
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
