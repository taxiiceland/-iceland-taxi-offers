import {
  ArrowRight,
  Phone
} from "lucide-react";
import { telLink } from "@/lib/contact-links";
import { contact, images } from "@/lib/site-data";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-midnight pb-5 pt-24 text-white sm:pb-8 sm:pt-28"
    >
      <img
        src={images.hero}
        alt="Licensed private taxi on an Iceland road for Keflavík Airport transfers and tours"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-midnight/74 to-black/38" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-black/18" />
      <div className="absolute inset-0 bg-black/18 sm:bg-black/8" />
      <div className="absolute inset-0 dark-grid opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ice to-transparent" />

      <div className="section-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-lg font-black text-gold sm:text-xl">
            🚖 Iceland Taxi Offers
          </p>

          <div className="mx-auto mt-4 grid max-w-2xl gap-3 sm:grid-cols-2">
            <div className="relative min-h-14 rounded-2xl border border-red-200 bg-white/95 py-2 pl-4 pr-16 text-left text-sm font-black text-red-700 shadow-glow backdrop-blur">
              <span className="flex min-h-10 items-center leading-tight">
                20% OFF Airport Transfers
              </span>
              <span className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-[0.56rem] font-black leading-none text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]">
                LIMITED
              </span>
            </div>
            <div className="relative min-h-14 rounded-2xl border border-red-200 bg-white/95 py-2 pl-4 pr-16 text-left text-sm font-black text-red-700 shadow-glow backdrop-blur">
              <span className="flex min-h-10 items-center leading-tight">
                25% OFF Private Tours
              </span>
              <span className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-[0.56rem] font-black leading-none text-white shadow-[0_8px_18px_rgba(220,38,38,0.35)]">
                LIMITED
              </span>
            </div>
          </div>

          <h1 className="mt-5 text-4xl font-black uppercase leading-[0.98] tracking-normal text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.72)] sm:text-6xl">
            Need a taxi now?
          </h1>

          <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={telLink()}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gold px-7 text-base font-black text-midnight shadow-glow transition hover:bg-ember"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call us: {contact.phone}
            </a>
            <a
              href="#book-now"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/28 bg-white/12 px-7 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/18"
            >
              Book Below
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-gold">
            OR
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-7 text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)] sm:text-lg">
            Book below — we usually confirm your booking within seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
