import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  CreditCard,
  MessageCircle,
  Phone
} from "lucide-react";
import Image from "next/image";
import ContactActionLink from "./ContactActionLink";
import { telLink, whatsappLink } from "@/lib/contact-links";
import { contact, images } from "@/lib/site-data";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-midnight pb-1 pt-16 text-white sm:pb-8 sm:pt-28"
    >
      <Image
        src={images.hero}
        alt="Licensed private taxi on an Iceland road for Keflavík Airport transfers and tours"
        fill
        priority
        sizes="100vw"
        quality={82}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/[0.88] via-midnight/[0.74] to-black/[0.38]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/[0.42] via-transparent to-black/[0.18]" />
      <div className="absolute inset-0 bg-black/[0.18] sm:bg-black/[0.08]" />
      <div className="absolute inset-0 dark-grid opacity-35" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ice to-transparent" />

      <div className="section-shell relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-base font-black text-gold sm:text-xl">
            🚖 Iceland Taxi Offers
          </p>

          <p className="mx-auto mt-2 inline-flex rounded-full border border-white/[0.18] bg-white/[0.12] px-4 py-2 text-xs font-black uppercase tracking-[0.08em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.24)] backdrop-blur sm:text-sm">
            24/7 Taxi Service in Reykjavík & Keflavík
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase leading-[0.98] tracking-normal text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.72)] sm:mt-5 sm:text-6xl">
            Need a taxi now?
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-6 text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)] max-[380px]:hidden sm:mt-3 sm:text-lg sm:leading-7">
            Call, message us on WhatsApp, or book below in seconds.
          </p>

          <div className="mx-auto mt-3 grid max-w-xl grid-cols-2 gap-2 sm:mt-4 sm:flex sm:justify-center sm:gap-3">
            <ContactActionLink
              action="call"
              placement="hero"
              href={telLink()}
              className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-5 text-base font-black text-midnight shadow-glow transition hover:bg-ember sm:min-h-14 sm:px-7"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call us: {contact.phone}
            </ContactActionLink>
            <ContactActionLink
              action="whatsapp"
              placement="hero"
              href={whatsappLink()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/[0.28] bg-white/[0.16] px-4 text-sm font-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur transition hover:bg-white/[0.22] sm:min-h-14 sm:px-6"
            >
              <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
              WhatsApp
            </ContactActionLink>
            <a
              href="#book-now"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/[0.28] bg-white/[0.12] px-4 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/[0.18] sm:min-h-14 sm:px-7"
            >
              Book Below
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="mx-auto mt-1 flex max-w-xl flex-wrap justify-center gap-1 text-[0.62rem] font-black uppercase tracking-[0.05em] text-white sm:mt-3 sm:gap-2 sm:text-xs">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.18] bg-black/[0.32] px-2 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur sm:px-2.5 sm:py-1.5">
              <BadgeCheck className="h-3 w-3 text-gold sm:h-3.5 sm:w-3.5" aria-hidden="true" />
              Pay After Ride
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.18] bg-black/[0.32] px-2 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur sm:px-2.5 sm:py-1.5">
              <CreditCard className="h-3 w-3 text-gold sm:h-3.5 sm:w-3.5" aria-hidden="true" />
              Card & Cash
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.18] bg-black/[0.32] px-2 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur sm:px-2.5 sm:py-1.5">
              <Clock3 className="h-3 w-3 text-gold sm:h-3.5 sm:w-3.5" aria-hidden="true" />
              24/7 Service
            </span>
          </div>

          <p className="mx-auto mt-3 hidden max-w-2xl text-sm font-black uppercase tracking-[0.12em] text-gold sm:block">
            Book below — we usually confirm your booking within seconds.
          </p>

          <div className="mx-auto mt-1.5 hidden max-w-2xl grid-cols-2 gap-2 px-5 min-[381px]:grid sm:mt-5 sm:gap-3 sm:px-0">
            <div className="relative min-h-12 rounded-2xl border border-red-200 bg-white/95 py-2 pl-3 pr-12 text-left text-[0.72rem] font-black text-red-700 shadow-glow backdrop-blur sm:min-h-14 sm:pl-4 sm:pr-16 sm:text-sm">
              <span className="flex min-h-8 items-center leading-tight sm:min-h-10">
                20% OFF Airport Transfers
              </span>
              <span className="absolute -right-7 -top-3 z-10 flex h-12 w-12 rotate-[10deg] items-center justify-center rounded-full bg-red-600 p-1 text-[0.4rem] font-black uppercase leading-[0.82] text-white shadow-[0_14px_28px_rgba(127,29,29,0.44)] ring-2 ring-white/[0.85] sm:-right-9 sm:-top-4 sm:h-14 sm:w-14 sm:text-[0.46rem]">
                <span className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-white/[0.85] text-center">
                  SUMMER
                  <br />
                  DISCOUNT
                </span>
              </span>
            </div>
            <div className="relative min-h-12 rounded-2xl border border-red-200 bg-white/95 py-2 pl-3 pr-12 text-left text-[0.72rem] font-black text-red-700 shadow-glow backdrop-blur sm:min-h-14 sm:pl-4 sm:pr-16 sm:text-sm">
              <span className="flex min-h-8 items-center leading-tight sm:min-h-10">
                25% OFF Private Tours
              </span>
              <span className="absolute -right-7 -top-3 z-10 flex h-12 w-12 rotate-[10deg] items-center justify-center rounded-full bg-red-600 p-1 text-[0.4rem] font-black uppercase leading-[0.82] text-white shadow-[0_14px_28px_rgba(127,29,29,0.44)] ring-2 ring-white/[0.85] sm:-right-9 sm:-top-4 sm:h-14 sm:w-14 sm:text-[0.46rem]">
                <span className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-white/[0.85] text-center">
                  SUMMER
                  <br />
                  DISCOUNT
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
