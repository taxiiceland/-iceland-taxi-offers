import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Conditions | Iceland Taxi Offers Private Taxi",
  description:
    "Terms for Iceland Taxi Offers private taxi rides, Keflavík Airport transfers, Reykjavík taxi service, Blue Lagoon trips, and Iceland private tours.",
  path: "/terms-and-conditions"
});

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms & Conditions"
      intro="These terms apply to bookings made with Iceland Taxi Offers for airport transfers, private taxi rides, and private tours."
      sections={[
        {
          title: "Booking Terms",
          items: [
            "Prices are per vehicle, not per passenger.",
            "Tour durations are approximate.",
            "Customers should arrive at the pickup location on time."
          ]
        },
        {
          title: "Routes, Weather, and Safety",
          items: [
            "Weather or road conditions may require route changes.",
            "Drivers may refuse unsafe or illegal requests.",
            "Trips may be cancelled due to severe weather or circumstances beyond our control."
          ]
        },
        {
          title: "Payment",
          body:
            "Payment is collected after the ride by card using our payment terminal or by cash."
        }
      ]}
    />
  );
}
