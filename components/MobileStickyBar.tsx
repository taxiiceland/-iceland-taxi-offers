"use client";

import { telLink, whatsappLink } from "@/lib/contact-links";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";

export default function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-midnight/94 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-12px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href="#book-now"
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full bg-gold px-3 text-xs font-black uppercase tracking-[0.04em] text-midnight"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Book
        </a>
        <a
          href={telLink()}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-3 text-xs font-black uppercase tracking-[0.04em] text-white"
        >
          <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
          Call
        </a>
        <a
          href={whatsappLink()}
          className="inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full border border-white/18 bg-white/10 px-3 text-xs font-black uppercase tracking-[0.04em] text-white"
        >
          <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
