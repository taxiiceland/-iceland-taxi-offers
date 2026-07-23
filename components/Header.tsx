"use client";

import { telLink, whatsappLink } from "@/lib/contact-links";
import { contact } from "@/lib/site-data";
import { links as siteLinks } from "@/lib/links";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import ContactActionLink from "./ContactActionLink";

const links = [
  { label: "Home", href: siteLinks.home },
  { label: "Airport Transfer", href: siteLinks.airport },
  { label: "Private Tours", href: siteLinks.tours },
  { label: "Offers", href: siteLinks.offers },
  { label: "Book Now", href: siteLinks.book },
  { label: "Contact", href: siteLinks.contact }
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.10] bg-[#07111f]/95 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <nav className="section-shell flex h-18 items-center justify-between py-3">
        <a href={siteLinks.home} className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/[0.40] bg-white/[0.10] text-sm font-black text-gold shadow-glow">
            IT
          </span>
          <span>
            <span className="block text-sm font-semibold leading-none">
              {contact.businessName}
            </span>
            <span className="mt-1 block text-xs text-glacier/[0.70]">
              Licensed Private Driver • Reykjavík, Iceland
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-white/[0.78] transition hover:bg-white/[0.10] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ContactActionLink
            action="call"
            placement="header"
            href={telLink()}
            className="rounded-full border border-white/[0.16] px-4 py-2.5 text-sm font-bold text-white/[0.86] transition hover:bg-white/[0.10]"
          >
            Call 24/7
          </ContactActionLink>
          <ContactActionLink
            action="whatsapp"
            placement="header"
            href={whatsappLink()}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.16] px-4 py-2.5 text-sm font-bold text-white/[0.86] transition hover:bg-white/[0.10]"
          >
            <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
            WhatsApp
          </ContactActionLink>
          <a
            href={siteLinks.book}
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-black uppercase tracking-[0.06em] text-midnight shadow-glow transition hover:bg-ember"
          >
            Book Now
          </a>
        </div>

        <button
          type="button"
          className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.15] bg-white/[0.10] lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/[0.10] bg-midnight px-4 pb-5 lg:hidden">
          <div className="mx-auto grid max-w-lg gap-2 pt-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-white/[0.82] hover:bg-white/[0.10]"
              >
                {link.label}
              </a>
            ))}
            <ContactActionLink
              action="call"
              placement="mobile_menu"
              href={telLink()}
              className="rounded-lg bg-gold px-4 py-3 text-sm font-black text-midnight"
            >
              Call 24/7 {contact.phone}
            </ContactActionLink>
            <ContactActionLink
              action="whatsapp"
              placement="mobile_menu"
              href={whatsappLink()}
              className="rounded-lg border border-white/[0.15] px-4 py-3 text-sm font-black text-white"
            >
              WhatsApp {contact.whatsapp}
            </ContactActionLink>
          </div>
        </div>
      ) : null}
    </header>
  );
}
