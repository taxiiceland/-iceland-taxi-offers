"use client";

import { getAvailableSlots } from "@/lib/availability";
import {
  trackBookingCompleted,
  trackBookingFormStarted
} from "@/lib/analytics";
import {
  createBookingNotification,
  type BookingNotification,
  type BookingRequest
} from "@/lib/booking";
import {
  airportRoutes,
  bookingRouteOptions,
  contact,
  tourCards
} from "@/lib/site-data";
import { CheckCircle2, Phone, Send } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import ContactActionLink from "./ContactActionLink";
import SectionHeading from "./SectionHeading";

type BookingFormProps = {
  variant?: "full" | "quick";
};

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

const routeGroups = [
  {
    label: "Airport and private transfers",
    routes: airportRoutes
  },
  {
    label: "Private tours",
    routes: tourCards.map((tour) => tour.price)
  }
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

function findRoute(routeId: string) {
  return bookingRouteOptions.find((route) => route.id === routeId) || null;
}

export default function BookingForm({ variant = "full" }: BookingFormProps) {
  const isQuick = variant === "quick";
  const [form, setForm] = useState<BookingFormState>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingNotification | null>(
    null
  );
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const quickFormStartedTracked = useRef(false);

  const groupedAvailableSlots = groupAvailableSlots(availableSlots);

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
          setAvailableSlots(
            getAvailableSlots(
              form.date,
              form.selectedRouteId ? { id: form.selectedRouteId } : null
            )
          );
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

  function updateRoute(event: ChangeEvent<HTMLSelectElement>) {
    const route = findRoute(event.currentTarget.value);

    setSubmitted(false);
    setConfirmation(null);
    setError("");
    setForm((current) => ({
      ...current,
      selectedRouteId: route?.id || "",
      selectedRoute: route?.routeName || "",
      pickup: route ? route.pickup : current.pickup,
      dropoff: route ? route.dropoff : current.dropoff,
      time: ""
    }));
  }

  function handleQuickFormStarted() {
    if (!isQuick || quickFormStartedTracked.current) {
      return;
    }

    quickFormStartedTracked.current = true;
    trackBookingFormStarted();
  }

  function validateBeforeSubmit(bookingPayload: BookingFormState) {
    const passengers = Number(bookingPayload.passengers);
    const suitcases = Number(bookingPayload.suitcases);

    if (!bookingPayload.selectedRouteId) {
      return "Please choose a service or route.";
    }

    if (!bookingPayload.pickup.trim()) {
      return "Please add your pickup location.";
    }

    if (!bookingPayload.dropoff.trim()) {
      return "Please add your destination.";
    }

    if (!bookingPayload.date) {
      return "Please choose a date.";
    }

    if (!bookingPayload.time) {
      return "Please select an available time.";
    }

    if (!Number.isInteger(passengers) || passengers < 1 || passengers > 4) {
      return "Please choose 1 to 4 passengers.";
    }

    if (!Number.isInteger(suitcases) || suitcases < 0 || suitcases > 5) {
      return "Please choose 0 to 5 standard suitcases.";
    }

    if (!bookingPayload.phone.trim() && !bookingPayload.email.trim()) {
      return "Please add a phone number or email so we can contact you.";
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const bookingPayload: BookingFormState = {
      ...form,
      name: form.name.trim(),
      selectedRoute:
        findRoute(form.selectedRouteId)?.routeName || form.selectedRoute,
      passengers: form.passengers || "1",
      suitcases: form.suitcases || "0"
    };
    const validationError = validateBeforeSubmit(bookingPayload);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (isStaticExport) {
        setConfirmation(createBookingNotification(bookingPayload));
        setSubmitted(true);
        setForm(initialForm);
        return;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingPayload)
      });
      const result = (await response.json()) as {
        notification?: BookingNotification;
        error?: string;
      };

      if (!response.ok || !result.notification) {
        setError(
          result.error ||
            "We could not complete the booking request. Please call us for help."
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
      trackBookingCompleted(result.notification, bookingPayload);
      setForm(initialForm);
      setAvailableSlots([]);
    } catch {
      setError("We could not complete the booking request. Please call us for help.");
    }
  }

  return (
    <section
      id="book-now"
      className={
        isQuick ? "bg-ice pb-24 pt-3 sm:pb-16 sm:pt-6" : "bg-ice py-16 sm:py-20"
      }
    >
      <div className="section-shell">
        <div
          className={
            isQuick
              ? "mx-auto max-w-5xl"
              : "grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start"
          }
        >
          {!isQuick ? (
            <div className="lg:sticky lg:top-28">
              <SectionHeading
                eyebrow="Booking request"
                title="Request a Private Transfer"
                copy="Choose a pre-booked airport transfer, long-distance private transfer, private tour, or custom Iceland route."
              />

              <div className="mt-6 rounded-2xl bg-midnight p-5 text-white shadow-soft">
                <p className="text-2xl font-black">No online payment.</p>
                <p className="mt-2 text-sm leading-6 text-glacier/80">
                  Sending this form creates a booking request. The booking is
                  not guaranteed until manually confirmed. Payment is made after
                  the ride by card using our payment terminal or by cash.
                </p>
                <ContactActionLink
                  action="call"
                  placement="booking_full_notice"
                  href={`tel:${contact.phone.replaceAll(" ", "")}`}
                  className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-gold px-5 text-sm font-black text-midnight"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {contact.phone}
                </ContactActionLink>
              </div>
            </div>
          ) : null}

          <div
            className={
              isQuick
                ? "rounded-2xl bg-white p-3 shadow-soft ring-1 ring-slate-100 sm:p-5"
                : "rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-7"
            }
          >
            {submitted ? (
              <div
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950"
                role="status"
              >
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                <h3 className="mt-4 text-2xl font-black">
                  Booking request received
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6">
                  Your booking request has been received. It is not guaranteed
                  until manually confirmed.
                </p>
                <p className="mt-2 text-sm leading-6">
                  Confirmation will be sent using the phone number or email you
                  provided.
                </p>
                <p className="mt-2 text-sm leading-6">
                  Payment is made after the ride by card using our payment
                  terminal or by cash.
                </p>
                <p className="mt-2 text-sm leading-6">
                  Custom-trip prices are confirmed before the booking is
                  accepted.
                </p>
                {confirmation ? (
                  <div className="mt-5 rounded-xl bg-white/70 p-4 text-sm font-semibold leading-6 text-emerald-950">
                    <p>Request: {confirmation.selectedRoute}</p>
                    <p>
                      Requested time: {confirmation.date} {confirmation.time}
                    </p>
                  </div>
                ) : null}
                <ContactActionLink
                  action="call"
                  placement="booking_success"
                  href={`tel:${contact.phone.replaceAll(" ", "")}`}
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-midnight px-5 text-sm font-black text-white"
                >
                  Call {contact.phone}
                </ContactActionLink>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                onFocusCapture={handleQuickFormStarted}
                onPointerDownCapture={handleQuickFormStarted}
                className={isQuick ? "grid gap-3" : "grid gap-4"}
                noValidate
              >
                {isQuick ? (
                  <div className="grid gap-1 border-b border-slate-100 pb-3">
                    <h2 className="text-xl font-black text-midnight sm:text-2xl">
                      Request a Private Transfer
                    </h2>
                    <p className="text-sm font-semibold leading-5 text-slate-600">
                      Airport transfers, long-distance private trips, and tours
                      by manual confirmation.
                    </p>
                    <p className="mt-1 inline-flex w-fit rounded-full bg-midnight px-2.5 py-1 text-[0.68rem] font-black uppercase tracking-[0.04em] text-white sm:px-3 sm:py-1.5 sm:text-xs">
                      KEF ↔ Reykjavík • Fixed fare • 18,000 ISK
                    </p>
                  </div>
                ) : null}

                {error ? (
                  <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950 sm:p-4">
                    {error}
                  </p>
                ) : null}

                <label className="grid gap-2 text-sm font-bold text-midnight">
                  Service or route
                  <select
                    className="field"
                    name="selectedRouteId"
                    value={form.selectedRouteId}
                    onChange={updateRoute}
                    required
                  >
                    <option value="">Choose transfer or tour</option>
                    {routeGroups.map((group) => (
                      <optgroup key={group.label} label={group.label}>
                        {group.routes.map((route) => (
                          <option key={route.id} value={route.id}>
                            {route.routeName}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>

                <input
                  type="hidden"
                  name="selectedRoute"
                  value={form.selectedRoute}
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Pickup location
                    <input
                      className="field"
                      name="pickup"
                      value={form.pickup}
                      onChange={updateField}
                      placeholder="Keflavík Airport, hotel, or address"
                      required
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Destination
                    <input
                      className="field"
                      name="dropoff"
                      value={form.dropoff}
                      onChange={updateField}
                      placeholder="Reykjavík, Blue Lagoon, Selfoss..."
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
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
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Time
                    <select
                      className="field"
                      name="time"
                      value={form.time}
                      onChange={updateField}
                      disabled={!form.date || availabilityLoading}
                      required
                    >
                      <option value="">
                        {availabilityLoading
                          ? "Loading..."
                          : form.date
                            ? "Select time"
                            : "Choose date first"}
                      </option>
                      {groupedAvailableSlots.map((group) => (
                        <optgroup key={group.label} label={group.label}>
                          {group.slots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                </div>

                {form.date &&
                !availabilityLoading &&
                groupedAvailableSlots.length === 0 ? (
                  <p className="rounded-xl bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
                    No available times for this date.
                  </p>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Phone number
                    <input
                      className="field"
                      name="phone"
                      value={form.phone}
                      onChange={updateField}
                      type="tel"
                      placeholder="+354 760 7201"
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

                <div className="grid gap-3 sm:grid-cols-2">
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Name for pickup sign, optional
                    <input
                      className="field"
                      name="name"
                      value={form.name}
                      onChange={updateField}
                      autoComplete="name"
                      placeholder="Name displayed for airport pickup"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-midnight">
                    Special or oversized luggage
                    <input
                      className="field"
                      name="specialLuggage"
                      value={form.specialLuggage}
                      onChange={updateField}
                      placeholder="Skis, stroller, wheelchair..."
                    />
                  </label>
                </div>

                <label className="grid gap-2 text-sm font-bold text-midnight">
                  Additional notes
                  <textarea
                    className="field min-h-24 resize-y"
                    name="notes"
                    value={form.notes}
                    onChange={updateField}
                    placeholder="Custom route, extra stop, child seat, or timing notes."
                  />
                </label>

                <p className="rounded-xl bg-slate-50 p-3 text-sm font-semibold leading-6 text-slate-600">
                  Sending this form is a booking request. The booking is not
                  guaranteed until manually confirmed. No online payment is
                  required. Payment is made after your ride using our card
                  payment terminal or by cash.
                </p>

                <button
                  type="submit"
                  className={`${isQuick ? "min-h-12" : "min-h-14"} focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-midnight px-7 text-sm font-black uppercase tracking-[0.08em] text-white shadow-glow transition hover:bg-navy`}
                >
                  <Send className="h-4 w-4 text-gold" aria-hidden="true" />
                  Send Booking Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
