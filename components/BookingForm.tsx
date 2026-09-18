"use client";

import { getAvailableSlots } from "@/lib/availability";
import {
  trackBookingCompleted,
  trackBookingFormStarted
} from "@/lib/analytics";
import {
  createBookingNotification,
  validatePickupDateTime,
  type BookingNotification,
  type BookingRequest
} from "@/lib/booking";
import { getIcelandToday } from "@/lib/iceland-time";
import { contact } from "@/lib/site-data";
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

export default function BookingForm({ variant = "full" }: BookingFormProps) {
  const isQuick = variant === "quick";
  const todayInIceland = getIcelandToday();
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

      const dateValidationError = validatePickupDateTime(form.date, "00:00");

      if (dateValidationError && form.date < todayInIceland) {
        setAvailableSlots([]);
        setError(dateValidationError);
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
      } catch (availabilityError) {
        if (!cancelled) {
          setAvailableSlots([]);
          setError(
            availabilityError instanceof Error
              ? availabilityError.message
              : "Available times could not be loaded. Please refresh the page or call us."
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
  }, [form.date, form.selectedRouteId, todayInIceland]);

  function updateField(
    event:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | FormEvent<HTMLInputElement>
  ) {
    const { name, value } = event.currentTarget;
    const locationChanged = name === "pickup" || name === "dropoff";

    setError("");
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
      ...(locationChanged ? { selectedRouteId: "", selectedRoute: "" } : {})
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

    const dateTimeError = validatePickupDateTime(
      bookingPayload.date,
      bookingPayload.time
    );

    if (dateTimeError) {
      return dateTimeError;
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
      name: "",
      selectedRoute: form.selectedRoute,
      passengers: "1",
      suitcases: "0",
      specialLuggage: "",
      notes: ""
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
      className={isQuick ? "bg-ice py-8 sm:py-10" : "bg-ice py-12 sm:py-16"}
    >
      <div className="section-shell">
        <div
          className={
            isQuick
              ? "mx-auto max-w-3xl"
              : "mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
          }
        >
          {!isQuick ? (
            <div>
              <SectionHeading
                eyebrow="Booking request"
                title="Send a Transfer Request"
                copy="Add your pickup, destination, date, time, and contact details. The booking is manually confirmed before pickup."
              />

              <div className="mt-5 rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-slate-600 shadow-[0_10px_28px_rgba(7,17,31,0.05)] ring-1 ring-slate-100">
                No online payment. Pay after the ride by card terminal or cash.
                <ContactActionLink
                  action="call"
                  placement="booking_full_notice"
                  href={`tel:${contact.phone.replaceAll(" ", "")}`}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-700 px-4 text-sm font-black text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {contact.phone}
                </ContactActionLink>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl bg-white p-4 shadow-[0_16px_42px_rgba(15,23,42,0.10)] ring-1 ring-slate-100 sm:p-5">
            {submitted ? (
              <div
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950"
                role="status"
              >
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                <h3 className="mt-3 text-xl font-black">
                  Booking request received
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6">
                  Your booking request has been received. It is not guaranteed
                  until manually confirmed.
                </p>
                <p className="mt-2 text-sm leading-6">
                  Confirmation will be sent using the phone number or email you
                  provided. Payment is made after the ride by card terminal or
                  cash.
                </p>
                {confirmation ? (
                  <div className="mt-4 rounded-lg bg-white/70 p-3 text-sm font-semibold leading-6 text-emerald-950">
                    <p>Request: {confirmation.selectedRoute}</p>
                    <p>
                      Requested time: {confirmation.date} {confirmation.time}
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                onFocusCapture={handleQuickFormStarted}
                onPointerDownCapture={handleQuickFormStarted}
                className="grid gap-3"
                noValidate
              >
                <div className="grid gap-1 border-b border-slate-100 pb-3">
                  <h2 className="text-xl font-black text-slate-950">
                    Book Your Transfer
                  </h2>
                  <p className="text-sm font-semibold leading-5 text-slate-600">
                    Simple booking request. Manual confirmation. Pay after the
                    ride.
                  </p>
                </div>

                {error ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-900">
                    Pickup location
                    <input
                      className="field"
                      name="pickup"
                      value={form.pickup}
                      onChange={updateField}
                      placeholder="Keflavík Airport or address"
                      required
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-900">
                    Destination
                    <input
                      className="field"
                      name="dropoff"
                      value={form.dropoff}
                      onChange={updateField}
                      placeholder="Reykjavík hotel or address"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-900">
                    Date
                    <input
                      className="field"
                      name="date"
                      value={form.date}
                      onChange={updateField}
                      onInput={updateField}
                      type="date"
                      min={todayInIceland}
                      required
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm font-bold text-slate-900">
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
                  <p className="rounded-lg bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950">
                    No available future times for this date.
                  </p>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="grid gap-1.5 text-sm font-bold text-slate-900">
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
                  <label className="grid gap-1.5 text-sm font-bold text-slate-900">
                    Email address
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

                <p className="text-xs font-semibold leading-5 text-slate-500">
                  Booking is manually confirmed. No online payment; pay after
                  the ride by card terminal or cash.
                </p>

                <button
                  type="submit"
                  className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sky-700 px-6 text-sm font-black uppercase tracking-[0.06em] text-white shadow-[0_12px_28px_rgba(3,105,161,0.22)] transition hover:bg-sky-800"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
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
