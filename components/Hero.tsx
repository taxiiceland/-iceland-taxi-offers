import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { telLink, whatsappLink } from "@/lib/contact-links";
import { contact, images } from "@/lib/site-data";
import ContactActionLink from "./ContactActionLink";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-gradient-to-b from-sky-50 to-ice pt-20 text-slate-950 sm:pt-24"
    >
      <div className="section-shell py-5 sm:py-8">
        <div className="grid gap-4 overflow-hidden rounded-2xl bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.10)] ring-1 ring-slate-100 sm:p-5 md:grid-cols-[1fr_0.78fr] md:items-center">
          <div className="relative z-10">
            <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-black uppercase tracking-[0.08em] text-sky-800">
              SUMMER OFFER
            </p>
            <h1 className="mt-3 text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
              Keflavík Airport ↔ Reykjavík
            </h1>
            <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
              <p className="text-4xl font-black leading-none text-sky-700 sm:text-5xl">
                19,000 ISK
              </p>
              <p className="pb-1 text-sm font-black uppercase tracking-[0.08em] text-slate-800 sm:text-base">
                Fixed Price
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <ContactActionLink
                action="call"
                placement="hero_offer"
                href={telLink()}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-black text-white transition hover:bg-sky-800"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call: {contact.phone}
              </ContactActionLink>
              <ContactActionLink
                action="whatsapp"
                placement="hero_offer"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 text-sm font-black text-emerald-800 transition hover:bg-emerald-100"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </ContactActionLink>
              <a
                href="#book-now"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sky-700 px-5 text-sm font-black uppercase tracking-[0.06em] text-white shadow-[0_12px_28px_rgba(3,105,161,0.22)] transition hover:bg-sky-800"
              >
                Book Now
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative h-36 overflow-hidden rounded-xl bg-sky-100 sm:h-48 md:h-56">
            <Image
              src={images.hero}
              alt="Iceland road transfer route between Keflavík Airport and Reykjavík"
              fill
              priority
              sizes="(min-width: 768px) 36vw, 100vw"
              quality={82}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
