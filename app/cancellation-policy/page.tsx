import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cancellation Policy | Iceland Taxi Offers",
  description:
    "Cancellation policy for Iceland Taxi Offers airport transfers, taxi rides, and private tours.",
  alternates: {
    canonical: absoluteUrl("/cancellation-policy")
  },
  openGraph: {
    url: absoluteUrl("/cancellation-policy")
  }
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage
      eyebrow="Cancellation"
      title="Cancellation Policy"
      intro="We understand travel plans can change. Please contact us as early as possible if you need to cancel or adjust a booking."
      sections={[
        {
          title: "Cancellation Policy",
          body:
            "If you need to cancel your booking, simply let us know as soon as possible."
        },
        {
          title: "You Can Contact Us By",
          items: ["Phone", "SMS", "Email"]
        },
        {
          title: "No Cancellation Fee",
          body:
            "There is no cancellation fee because payment is only collected after the ride has been completed."
        },
        {
          title: "Delayed Flights",
          body:
            "If your flight is delayed, please contact us as soon as possible so we can adjust your pickup time whenever possible."
        }
      ]}
    />
  );
}
