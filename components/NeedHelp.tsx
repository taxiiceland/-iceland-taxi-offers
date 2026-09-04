import { telLink } from "@/lib/contact-links";
import { contact } from "@/lib/site-data";
import { Mail, Phone } from "lucide-react";
import ContactActionLink from "./ContactActionLink";

export default function NeedHelp() {
  return (
    <section id="need-help" className="bg-midnight py-16 text-white sm:py-20">
      <div className="section-shell">
        <div className="rounded-2xl border border-white/[0.12] bg-white/[0.08] p-7 text-center shadow-glow backdrop-blur sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gold text-midnight">
            <Phone className="h-8 w-8" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-[0.14em] text-gold">
            Need Help?
          </p>
          <h2 className="mt-2 text-4xl font-black">
            Contact Iceland Taxi Offers
          </h2>
          <ContactActionLink
            action="call"
            placement="need_help"
            href={telLink()}
            className="mt-4 inline-block text-3xl font-black text-white sm:text-5xl"
          >
            {contact.phone}
          </ContactActionLink>
          <a
            href={`mailto:${contact.email}`}
            className="mx-auto mt-4 flex w-fit items-center gap-2 text-base font-bold text-glacier"
          >
            <Mail className="h-5 w-5 text-gold" aria-hidden="true" />
            {contact.email}
          </a>
          <p className="mx-auto mt-5 max-w-lg text-base font-semibold leading-7 text-white/[0.72]">
            Questions about Keflavík Airport transfers, long-distance private
            transfers, or a custom route? Contact us before sending your booking
            request.
          </p>
        </div>
      </div>
    </section>
  );
}
