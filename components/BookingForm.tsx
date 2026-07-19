"use client";

import { getAvailableSlots } from "@/lib/availability";
import { trackBookingCompleted } from "@/lib/analytics";
import {
  createBookingNotification,
  type BookingNotification,
  type BookingRequest
} from "@/lib/booking";
import { contact } from "@/lib/site-data";
import { CheckCircle2, Clock, Phone, Send } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";

type BookingFormState = BookingRequest;

type RouteSelectedEvent = CustomEvent<{
  id: string;
  routeName: string;
  pickup: string;
  dropoff: string;
}>;

const initialForm: BookingFormState = {
  selectedRouteId: "",
  selectedRoute: "",
  name: "",
  phone: "",
  email: "",
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  passengers: "1",
  suitcases: "0",
  specialLuggage: "",
  notes: ""
};

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

const timeGroups = [
  { label: "Night", start: 0, end: 6 * 60 },
  { label: "Morning", start: 6 * 60, end: 12 * 60 },
  { label: "Afternoon", start: 12 * 60, end: 18 * 60 },
  { label: "Evening", start: 18 * 60, end: 24 * 60 }
];

function slotToMinutes(slot: string) {
  const [hours, minutes] = slot.split(":").map(Number);
  return hours * 60 + minutes;
}

function groupAvailableSlots(slots: string[]) {
  return timeGroups
    .map((group) => ({
      ...group,
      slots: slots.filter((slot) => {
        const minutes = slotToMinutes(slot);
        return minutes >= group.start && minutes < group.end;
      })
    }))
    .filter((group) => group.slots.length > 0);
}

export default function BookingForm() {
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingNotification | null>(
    null
  );
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  useEffect(() => {
    function handleRouteSelected(event: Event) {
      const routeEvent = event as RouteSelectedEvent;
      const route = routeEvent.detail;

      setSubmitted(false);
      setConfirmation(null);
      setError("");
      setForm((current) => ({
        ...current,
        selectedRouteId: route.id,
        selectedRoute: route.routeName,
        pickup: route.pickup,
        dropoff: route.dropoff,
        time: ""
      }));
    }

    window.addEventListener("booking-route-selected", handleRouteSelected);

    return () => {
      window.removeEventListener("booking-route-selected", handleRouteSelected);
    };
  }, []);

  function updateField(
    event:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | FormEvent<HTMLInputElement>
  ) {
    const { name, value } = event.currentTarget;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "date" ? { time: "" } : {})
    }));
  }

  const selectedRoute = form.selectedRouteId
    ? { id: form.selectedRouteId }
    : null;
  const groupedAvailableSlots = groupAvailableSlots(availableSlots);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailability() {
      if (!form.date) {
        setAvailableSlots([]);
        return;
      }

      setAvailabilityLoading(true);

      try {
        if (isStaticExport) {
          setAvailableSlots(getAvailableSlots(form.date, selectedRoute));
          return;
        }

        const params = new URLSearchParams({ date: form.date });

        if (form.selectedRouteId) {
          params.set("routeId", form.selectedRouteId);
        }

        const response = await fetch(`/api/availability?${params.toString()}`, {
          cache: "no-store"
        });
        const payload = (await response.json()) as {
          slots?: string[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Availability could not be loaded.");
        }

        if (!cancelled) {
          setAvailableSlots(payload.slots ?? []);
        }
      } catch {
        if (!cancelled) {
          setAvailableSlots([]);
          setError(
            "Available times could not be loaded. Please refresh the page or call us."
          );
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [form.date, form.selectedRouteId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.phone.trim() && !form.email.trim()) {
      setError("Please add a phone number or email so we can send your booking details.");
      return;
    }

    const passengers = Number(form.passengers);
    const suitcases = Number(form.suitcases);

    if (passengers < 1 || passengers > 4) {
      setError("Please choose 1 to 4 passengers.");
      return;
    }

    if (suitcases < 0 || suitcases > 5) {
      setError("Please choose 0 to 5 standard suitcases.");
      return;
    }

    if (!form.time) {
      setError("Please select an available time.");
      return;
    }

    try {
      if (isStaticExport) {
        setConfirmation(createBookingNotification(form));
        setSubmitted(true);
        setForm(initialForm);
        return;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const result = (await response.json()) as {
        notification?: BookingNotification;
        error?: string;
      };

      if (!response.ok || !result.notification) {
        setError(
          result.error ||
            "We could not complete the booking. Please call us for help."
        );

        if (response.status === 409) {
          setAvailableSlots((slots) =>
            slots.filter((slot) => slot !== form.time)
          );
          setForm((current) => ({ ...current, time: "" }));
        }

        return;
      }

      setConfirmation(result.notification);
      setSubmitted(true);
      trackBookingCompleted(result.notification, form);
      setForm(initialForm);
      setAvailableSlots([]);
    } catch {
      setError("We could not complete the booking. Please call us for help.");
    }
  }

  return (
    <section id="book-now" className="bg-ice py-16 sm:py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              eyebrow="Book now"
              title="Reserve Your Iceland Taxi"
              copy="Choose your airport transfer, Reykjavík taxi ride, private tour, or custom destination and select an available time."
            />

            <div className="mt-6 rounded-2xl bg-midnight p-5 text-white shadow-soft">
              <p className="text-2xl font-black">No online payment.</p>
              <p className="mt-2 text-sm leading-6 text-glacier/80">
                No online payment is required. Payment is made after your ride
                using our card payment terminal or by cash.
              </p>
              <a
                href={`tel:${contact.phone.replaceAll(" ", "")}`}
                className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-midnight"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {contact.phone}
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-7">
            {submitted ? (
              <div
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950"
                role="status"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <h3 className="mt-4 text-2xl font-black">
                  Your taxi has been reserved
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6">
                  Your booking has been received.
                </p>
                <p className="mt-2 text-sm leading-6">
                  Payment is made after the ride by card using our payment
                  terminal or by cash.
                </p>
                <p className="mt-2 text-sm leading-6">
                  If there is any urgent issue with your booking, we will contact
                  you as soon as possible using the phone or email you provided.
                </p>
                {confirmation ? (
                  <div className="mt-5 rounded-xl bg-white/70 p-4 text-sm font-semibold leading-6 text-emerald-950">
                    <p>Reserved: {confirmation.selectedRoute}</p>
                    <p>
                      Time blocked: {confirmation.blockedTime}
                    </p>
                  </div>
                ) : null}
                <a
                  href={`tel:${contact.phone.replaceAll(" ", "")}`}
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-midnight px-5 text-sm font-black text-white"
                >
                  Need urgent help? Call {contact.phone}
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
                {form.selectedRoute ? (
                  <div className="rounded-xl bg-gold/14 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Selected offer
                    </p>
                    <p className="mt-1 text-lg font-black text-midnight">
                      {form.selectedRoute}
                    </p>
                  </div>
                ) : null}

                {error ? (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-950">
                    {error}
                  </p>
                ) : null}

                <input
                  type="hidden"
                  name="selectedRouteId"
                  value={form.selectedRouteId}
                />
                <input
                  type="hidden"
                  name="selectedRoute"
                  value={form.selectedRoute}
                />

                <label className="grid gap-2 text-sm font-bold text-midnight">
                  Name
                  <input
                    className="field"
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    autoComplete="name"
                    required
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Phone
                    <input
                      className="field"
                      name="phone"
                      value={form.phone}
                      onChange={updateField}
                      type="tel"
                      placeholder="+354 000 0000"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Email
                    <input
                      className="field"
                      name="email"
                      value={form.email}
                      onChange={updateField}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Pickup
                    <input
                      className="field"
                      name="pickup"
                      value={form.pickup}
                      onChange={updateField}
                      placeholder="Keflavík Airport"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Drop-off
                    <input
                      className="field"
                      name="dropoff"
                      value={form.dropoff}
                      onChange={updateField}
                      placeholder="Reykjavík"
                      required
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-bold text-midnight">
                  Date
                  <input
                    className="field"
                    name="date"
                    value={form.date}
                    onChange={updateField}
                    onInput={updateField}
                    type="date"
                    required
                  />
                </label>

                <div className="grid gap-3 rounded-2xl bg-ice p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-midnight">
                    <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                    Available times
                  </div>
                  {availabilityLoading ? (
                    <p className="text-sm font-semibold text-slate-600">
                      Loading available times...
                    </p>
                  ) : form.date ? (
                    groupedAvailableSlots.length > 0 ? (
                      <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
                        {groupedAvailableSlots.map((group) => (
                          <div key={group.label} className="grid gap-2">
                            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                              {group.label}
                            </p>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                              {group.slots.map((slot) => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() =>
                                    setForm((current) => ({
                                      ...current,
                                      time: slot
                                    }))
                                  }
                                  className={`min-h-11 rounded-full px-3 text-sm font-black transition ${
                                    form.time === slot
                                      ? "bg-midnight text-white shadow-glow"
                                      : "bg-white text-midnight hover:bg-gold/18"
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-slate-600">
                        No available times for this date.
                      </p>
                    )
                  ) : (
                    <p className="text-sm font-semibold text-slate-600">
                      Choose a date to see available times.
                    </p>
                  )}
                  <input type="hidden" name="time" value={form.time} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Passengers
                    <select
                      className="field"
                      name="passengers"
                      value={form.passengers}
                      onChange={updateField}
                    >
                      <option value="1">1 passenger</option>
                      <option value="2">2 passengers</option>
                      <option value="3">3 passengers</option>
                      <option value="4">4 passengers</option>
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Standard suitcases
                    <select
                      className="field"
                      name="suitcases"
                      value={form.suitcases}
                      onChange={updateField}
                    >
                      <option value="0">0 suitcases</option>
                      <option value="1">1 suitcase</option>
                      <option value="2">2 suitcases</option>
                      <option value="3">3 suitcases</option>
                      <option value="4">4 suitcases</option>
                      <option value="5">5 suitcases</option>
                    </select>
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-bold text-midnight">
                  Special luggage
                  <input
                    className="field"
                    name="specialLuggage"
                    value={form.specialLuggage}
                    onChange={updateField}
                    placeholder="Skis, golf clubs, baby stroller, wheelchair, oversized luggage..."
                  />
                </label>

                <label className="grid gap-2 text-sm font-bold text-midnight">
                  Notes
                  <textarea
                    className="field min-h-28 resize-y"
                    name="notes"
                    value={form.notes}
                    onChange={updateField}
                    placeholder="Custom route, extra stop, child seat, or timing notes."
                  />
                </label>

                <button
                  type="submit"
                  className="focus-ring inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-midnight px-7 text-sm font-black uppercase tracking-[0.08em] text-white shadow-glow transition hover:bg-navy"
                >
                  <Send className="h-4 w-4 text-gold" aria-hidden="true" />
                  Confirm Booking
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
