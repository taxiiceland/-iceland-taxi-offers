"use client";

import { telLink, whatsappLink } from "@/lib/contact-links";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";
import ContactActionLink from "./ContactActionLink";

export default function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.16] bg-[#07111f] p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.36)] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href="#book-now"
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-gold px-3 text-xs font-black uppercase tracking-[0.04em] text-midnight shadow-[0_10px_24px_rgba(0,0,0,0.24)]"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Book
        </a>
        <ContactActionLink
          action="call"
          placement="mobile_sticky"
          href={telLink()}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/[0.22] bg-white/[0.14] px-3 text-xs font-black uppercase tracking-[0.04em] text-white"
        >
          <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
          Call
        </ContactActionLink>
        <ContactActionLink
          action="whatsapp"
          placement="mobile_sticky"
          href={whatsappLink()}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/[0.22] bg-white/[0.14] px-3 text-xs font-black uppercase tracking-[0.04em] text-white"
        >
          <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
          WhatsApp
        </ContactActionLink>
      </div>
    </div>
  );
}
