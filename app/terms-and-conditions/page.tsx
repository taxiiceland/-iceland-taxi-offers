import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Conditions | Iceland Taxi Offers Private Taxi",
  description:
    "Terms for Iceland Taxi Offers pre-booked Keflavík Airport transfers, long-distance private trips, Blue Lagoon transfers, and Iceland private tours.",
  path: "/terms-and-conditions"
});

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms & Conditions"
      intro="These terms apply to booking requests made with Iceland Taxi Offers for airport transfers, long-distance private transfers, and private tours."
      sections={[
        {
          title: "Booking Terms",
          items: [
            "Sending the booking form creates a booking request, not a guaranteed booking.",
            "Bookings are accepted only after manual confirmation.",
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
