import { contact } from "@/lib/site-data";
import { links } from "@/lib/links";

export default function Footer() {
  return (
    <footer className="bg-midnight py-10 text-white">
      <div className="section-shell">
        <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-lg font-black">{contact.businessName}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-glacier/72">
              Licensed Icelandic Taxi Driver for airport transfers, private
              taxi rides and Iceland private tours.
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-glacier/72">
              Service area: {contact.serviceArea}
            </p>
            <p className="mt-4 rounded-xl bg-gold/12 px-4 py-3 text-sm font-black text-ember">
              No online payment. Payment is made after the ride by card using
              our payment terminal or by cash.
            </p>
          </div>
          <div className="grid gap-2 text-sm font-bold text-white/72 md:text-right">
            <a href={links.home} className="hover:text-white">
              Iceland Taxi Home
            </a>
            <a href={links.airport} className="hover:text-white">
              Keflavík Airport Taxi
            </a>
            <a href={links.tours} className="hover:text-white">
              Private Taxi Tours
            </a>
            <a href={links.offers} className="hover:text-white">
              Summer Offers
            </a>
            <a href={links.book} className="hover:text-white">
              Book Private Taxi Iceland
            </a>
            <a href={links.privacy} className="hover:text-white">
              Privacy Policy
            </a>
            <a href={links.terms} className="hover:text-white">
              Terms & Conditions
            </a>
            <a href={links.cancellation} className="hover:text-white">
              Cancellation Policy
            </a>
            <a href={links.contact} className="hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
