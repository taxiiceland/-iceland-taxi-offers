import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import ContactActionLink from "@/components/ContactActionLink";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { telLink, whatsappLink } from "@/lib/contact-links";
import { createPageMetadata } from "@/lib/seo";
import { contact } from "@/lib/site-data";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export const metadata: Metadata = createPageMetadata({
  title: "Contact Iceland Taxi Offers | Reykjavík Taxi & Airport Transfer",
  description:
    "Contact Iceland Taxi Offers for Reykjavík taxi service, Keflavík Airport transfers, Blue Lagoon taxi rides, and private taxi tours across Iceland.",
  path: "/contact"
});

const contactCards = [
  {
    label: "Phone Number",
    value: contact.phone,
    href: telLink(),
    icon: Phone,
    action: "call" as const
  },
  {
    label: "Email",
    value: contact.email,
    href: `mailto:${contact.email}`,
    icon: Mail,
    action: null
  },
  {
    label: "WhatsApp",
    value: contact.whatsapp,
    href: whatsappLink(),
    icon: MessageCircle,
    action: "whatsapp" as const
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-ice text-midnight">
      <Header />
      <section className="pt-28 pb-8 sm:pb-10">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Contact</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              Contact Iceland Taxi Offers
            </h1>
            <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">
              Contact a licensed Reykjavík taxi driver for Keflavík Airport
              transfers, Blue Lagoon taxi rides, or private tours around Iceland.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {contactCards.map(({ label, value, href, icon: Icon, action }) => {
              const content = (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-midnight text-gold">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="mt-5 block text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                    {label}
                  </span>
                  <span className="mt-2 block text-lg font-black text-midnight">
                    {value}
                  </span>
                </>
              );
              const className =
                "rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-glow";

              return action ? (
                <ContactActionLink
                  key={label}
                  action={action}
                  placement="contact_card"
                  href={href}
                  className={className}
                >
                  {content}
                </ContactActionLink>
              ) : (
                <a key={label} href={href} className={className}>
                  {content}
                </a>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold/[0.18] text-midnight">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-2xl font-black">
                    Iceland Taxi Booking Hours
                  </h2>
                  <p className="mt-2 text-base font-semibold leading-7 text-slate-600">
                    Online booking is open 24/7. Airport transfers, private rides,
                    and tours are available by reservation and driver availability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold/[0.18] text-midnight">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="text-2xl font-black">
                    Iceland Taxi Service Area
                  </h2>
                  <p className="mt-2 text-base font-semibold leading-7 text-slate-600">
                    {contact.serviceArea}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <BookingForm />
      <Footer />
    </main>
  );
}
