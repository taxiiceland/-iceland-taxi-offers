import { telLink, whatsappLink } from "@/lib/contact-links";
import { contact } from "@/lib/site-data";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default function NeedHelp() {
  return (
    <section id="need-help" className="bg-midnight py-16 text-white sm:py-20">
      <div className="section-shell">
        <div className="rounded-2xl border border-white/12 bg-white/8 p-7 text-center shadow-glow backdrop-blur sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-midnight">
            <Phone className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.14em] text-gold">
            Need Help?
          </p>
          <h2 className="mt-2 text-4xl font-black">Call 24/7</h2>
          <a
            href={telLink()}
            className="mt-4 inline-block text-3xl font-black text-white sm:text-5xl"
          >
            {contact.phone}
          </a>
          <a
            href={whatsappLink()}
            className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-5 py-3 text-sm font-black uppercase tracking-[0.06em] text-white"
          >
            <MessageCircle className="h-5 w-5 text-gold" aria-hidden="true" />
            WhatsApp
          </a>
          <a
            href={`mailto:${contact.email}`}
            className="mx-auto mt-4 flex w-fit items-center gap-2 text-base font-bold text-glacier"
          >
            <Mail className="h-5 w-5 text-gold" aria-hidden="true" />
            {contact.email}
          </a>
          <p className="mx-auto mt-5 max-w-lg text-base font-semibold leading-7 text-white/72">
            Questions? Need a custom route? Call us anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
