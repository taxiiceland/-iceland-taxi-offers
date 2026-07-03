import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms & Conditions | Iceland Taxi Offers",
  description:
    "Terms and conditions for Iceland Taxi Offers airport transfers, taxi rides, and private tours.",
  alternates: {
    canonical: absoluteUrl("/terms-and-conditions")
  },
  openGraph: {
    url: absoluteUrl("/terms-and-conditions")
  }
};

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
