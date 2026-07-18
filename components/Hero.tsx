import {
  ArrowRight,
  BadgePercent,
  CalendarCheck,
  CreditCard,
  Mail,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck
} from "lucide-react";
import { telLink, whatsappLink } from "@/lib/contact-links";
import { contact, images } from "@/lib/site-data";

const trustBadges = [
  { label: "Licensed Icelandic Taxi Driver", icon: ShieldCheck },
  { label: "Airport Transfers", icon: Plane },
  { label: "Pay After Your Ride", icon: CreditCard },
  { label: "Summer Discounts Available", icon: BadgePercent },
  { label: "Book in Less Than 30 Seconds", icon: CalendarCheck }
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-midnight pb-24 pt-28 text-white sm:pt-32"
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
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ice to-transparent" />

      <div className="section-shell relative">
        <div className="max-w-4xl">
          <div className="mb-6 inline-grid gap-2 rounded-2xl border border-gold/40 bg-midnight/72 px-4 py-3 text-sm font-black text-white shadow-glow backdrop-blur sm:grid-cols-3 sm:items-center sm:gap-3">
            <span className="text-gold">☀️ Summer Discounts Available</span>
            <span>🚖 Save up to 20% on Airport Transfers</span>
            <span>🌍 Save up to 25% on Selected Tours</span>
          </div>
          <p className="eyebrow">Private Taxi Iceland</p>
          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.96] tracking-normal text-white drop-shadow-[0_8px_26px_rgba(0,0,0,0.72)] sm:text-6xl lg:text-7xl">
            Private Taxi & Airport Transfers in Iceland
          </h1>
          <div className="mt-6 grid max-w-2xl gap-2 text-xl font-semibold text-white drop-shadow-[0_5px_18px_rgba(0,0,0,0.9)] sm:grid-cols-2">
            <span>Licensed Icelandic Taxi Driver</span>
            <span>Airport Transfers</span>
            <span>Private Tours</span>
            <span>Pay After Your Ride</span>
            <span>Book in Less Than 30 Seconds</span>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#book-now"
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gold px-7 text-sm font-black uppercase tracking-[0.08em] text-midnight shadow-glow transition hover:bg-ember"
            >
              Book Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={telLink()}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/28 bg-white/12 px-7 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/18"
            >
              <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
              Call 24/7
            </a>
            <a
              href={whatsappLink()}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/28 bg-white/12 px-7 text-sm font-black uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/18"
            >
              <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
              WhatsApp
            </a>
          </div>

          <div className="mt-7 grid gap-2 text-white/90">
            <a
              href={telLink()}
              className="inline-flex items-center gap-3 text-2xl font-black text-white"
            >
              <Phone className="h-6 w-6 text-gold" aria-hidden="true" />
              {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center gap-3 text-base font-semibold text-glacier"
            >
              <Mail className="h-5 w-5 text-gold" aria-hidden="true" />
              {contact.email}
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {trustBadges.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="glass-card flex items-center gap-3 rounded-xl px-4 py-3"
              >
                <Icon className="h-5 w-5 flex-none text-gold" aria-hidden="true" />
                <span className="text-sm font-bold text-white/92">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
