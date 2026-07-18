import { ArrowDown, Clock, Plane, ShieldCheck } from "lucide-react";
import { airportRoutes } from "@/lib/site-data";
import BookButton from "./BookButton";
import RoutePrice from "./RoutePrice";
import SectionHeading from "./SectionHeading";

export default function AirportTransferCards() {
  return (
    <section id="airport-transfer" className="bg-ice py-14 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Airport transfer Iceland"
          title="Keflavík Airport Taxi & Transfers"
          copy="Choose a fixed airport transfer route for Keflavík Airport, Reykjavík, or Blue Lagoon and the booking form fills it in for you."
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {airportRoutes.map((route) => (
            <article
              key={route.id}
              className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-midnight text-gold">
                  <Plane className="h-6 w-6" aria-hidden="true" />
                </div>
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-black text-midnight">
                  {route.discountPercent}% ☀️ Summer Discount
                </span>
              </div>

              <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                  {route.pickup}
                </p>
                <ArrowDown className="my-2 h-5 w-5 text-gold" aria-hidden="true" />
                <h3 className="text-2xl font-semibold text-midnight">
                  {route.dropoff}
                </h3>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                {route.duration}
              </div>

              <div className="mt-5">
                <RoutePrice price={route} />
              </div>

              <BookButton
                route={route}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-midnight px-5 text-sm font-black uppercase tracking-[0.08em] text-white shadow-glow transition hover:bg-navy"
              />
            </article>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-white p-4 text-sm leading-6 text-slate-600 shadow-[0_12px_36px_rgba(7,17,31,0.06)]">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none text-gold" />
          Prices are based on selected route and confirmed before pickup.
          Payment is made after the ride by card using our payment terminal or
          by cash. Final fare may vary for custom addresses, waiting time, extra
          stops, or changed routes.
        </p>
      </div>
    </section>
  );
}
