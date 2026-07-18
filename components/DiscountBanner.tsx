import { BadgePercent, Plane, Route } from "lucide-react";

export default function DiscountBanner() {
  return (
    <section id="offers" className="-mt-10 bg-transparent pb-8">
      <div className="section-shell relative z-10">
        <div className="overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-glow">
          <div className="grid gap-0 md:grid-cols-[0.8fr_1fr_1fr]">
            <div className="bg-midnight p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <BadgePercent className="h-7 w-7 text-gold" aria-hidden="true" />
                <p className="text-sm font-black uppercase tracking-[0.14em] text-gold">
                  Summer Offers
                </p>
              </div>
              <h2 className="mt-4 text-3xl font-semibold leading-tight">
                Limited-time savings on airport transfers and private tours.
              </h2>
            </div>
            <div className="border-b border-slate-100 p-6 sm:p-8 md:border-b-0 md:border-r">
              <Plane className="h-7 w-7 text-gold" aria-hidden="true" />
              <p className="mt-4 text-4xl font-black text-midnight">
                20% ☀️ Summer Discount
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-700">
                Airport Transfers
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Keflavík Airport, Reykjavík and Blue Lagoon.
              </p>
            </div>
            <div className="p-6 sm:p-8">
              <Route className="h-7 w-7 text-gold" aria-hidden="true" />
              <p className="mt-4 text-4xl font-black text-midnight">
                25% ☀️ Summer Discount
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-700">
                Private Tours
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Golden Circle, South Coast, Silver Circle and more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
