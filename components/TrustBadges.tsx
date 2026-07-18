import {
  BadgePercent,
  Car,
  CreditCard,
  Luggage,
  Map,
  Plane,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import SectionHeading from "./SectionHeading";

const items = [
  { label: "Licensed Icelandic Taxi Driver", icon: ShieldCheck },
  { label: "Comfortable SUV", icon: Car },
  { label: "Airport Transfers", icon: Plane },
  { label: "Private Tours", icon: Map },
  { label: "Local Knowledge", icon: Sparkles },
  { label: "Pay After Ride", icon: CreditCard },
  { label: "Up to 4 Passengers", icon: Users },
  { label: "Up to 5 Standard Suitcases", icon: Luggage },
  { label: "Summer Discounts", icon: BadgePercent }
];

export default function TrustBadges() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Trust"
          title="Trusted Private Taxi Iceland Service"
          align="center"
        />

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex min-h-16 items-center gap-3 rounded-2xl bg-ice px-4 shadow-[0_10px_28px_rgba(7,17,31,0.05)]"
            >
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-midnight text-gold">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-sm font-black text-midnight">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
