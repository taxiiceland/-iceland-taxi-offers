import { Clock } from "lucide-react";
import { tourCards } from "@/lib/site-data";
import BookButton from "./BookButton";
import RoutePrice from "./RoutePrice";
import SectionHeading from "./SectionHeading";

export default function TourCards() {
  return (
    <section id="private-tours" className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Iceland private tours"
          title="Private Taxi Tours Across Iceland"
          copy="Choose a Golden Circle taxi, South Coast private tour, Blue Lagoon taxi, or custom trip. Select a time and pay after your ride."
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tourCards.map((tour) => (
            <article
              key={tour.title}
              className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-slate-100"
            >
              <div className="relative min-h-64 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.alt}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/12 to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-black text-midnight">
                  {tour.price.category === "custom"
                    ? "Custom quote"
                    : `${tour.price.discountPercent}% ☀️ Summer Discount`}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-black text-white">{tour.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-white/82">
                    {tour.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 p-5">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                  <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                  {tour.price.duration}
                </div>
                {tour.price.category === "custom" ? (
                  <div className="grid gap-2">
                    <div className="rounded-lg bg-midnight px-3 py-3 text-center text-sm font-black text-white">
                      Custom Quote
                    </div>
                    <div className="rounded-lg bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-600">
                      Price confirmed before booking.
                    </div>
                  </div>
                ) : (
                  <RoutePrice price={tour.price} />
                )}
                <div className="flex flex-wrap gap-2">
                  {tour.gallery.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-ice px-3 py-1.5 text-xs font-bold text-slate-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <BookButton
                  route={tour.price}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-midnight px-5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:bg-navy"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
