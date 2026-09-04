import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  Plane,
  Phone
} from "lucide-react";
import Image from "next/image";
import { telLink } from "@/lib/contact-links";
import { contact, images } from "@/lib/site-data";
import ContactActionLink from "./ContactActionLink";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-midnight pb-5 pt-20 text-white sm:pb-10 sm:pt-28"
    >
      <Image
        src={images.hero}
        alt="Private transfer vehicle on an Iceland road for Keflavík Airport transfers and Iceland tours"
        fill
        priority
        sizes="100vw"
        quality={82}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#07111f]/80 to-black/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      <div className="absolute inset-0 dark-grid opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ice to-transparent" />

      <div className="section-shell relative">
        <div className="max-w-4xl">
          <p className="text-base font-black text-gold sm:text-xl">
            Iceland Taxi Offers
          </p>

          <p className="mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur sm:text-sm">
            Pre-booked private transfers and tours
          </p>

          <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.98] tracking-normal text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.72)] sm:mt-5 sm:text-6xl">
            Keflavík Airport Transfers & Private Tours
          </h1>

          <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.85)] sm:text-xl sm:leading-8">
            Request a licensed Icelandic taxi driver for Keflavík Airport,
            Reykjavík, Blue Lagoon, Selfoss, and custom long-distance trips
            around Iceland.
          </p>

          <div className="mt-5 grid max-w-xl gap-2 sm:flex sm:gap-3">
            <ContactActionLink
              action="call"
              placement="hero"
              href={telLink()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-5 text-base font-black text-midnight shadow-glow transition hover:bg-ember sm:min-h-14 sm:px-7"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {contact.phone}
            </ContactActionLink>
            <a
              href="#book-now"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/15 px-5 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/20 sm:min-h-14 sm:px-7"
            >
              Request Booking
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mt-4 flex max-w-2xl flex-wrap gap-2 text-[0.68rem] font-black uppercase tracking-[0.05em] text-white sm:text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Pay After Ride
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur">
              <CreditCard className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Card & Cash
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur">
              <CalendarCheck className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Manual Confirmation
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/35 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur">
              <Plane className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              Airport Name Pickup
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
