import { tourCards } from "@/lib/site-data";
import BookButton from "./BookButton";

export default function TourGallery() {
  return (
    <section className="bg-ice py-16 sm:py-20">
      <div className="section-shell">
        <h2 className="sr-only">
          Iceland private taxi destinations and tour gallery
        </h2>
        <div className="grid gap-5 lg:grid-cols-2">
          {tourCards.slice(0, 5).map((tour) => (
            <article
              key={tour.title}
              className="relative min-h-80 overflow-hidden rounded-2xl bg-midnight shadow-soft"
            >
              <img
                src={tour.image}
                alt={tour.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
                <h3 className="text-2xl font-black">{tour.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tour.gallery.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-white/14 px-3 py-1.5 text-xs font-bold backdrop-blur"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <BookButton
                  route={tour.price}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 text-xs font-black uppercase tracking-[0.08em] text-midnight"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
