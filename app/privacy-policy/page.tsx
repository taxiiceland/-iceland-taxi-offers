import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy | Iceland Taxi Offers Taxi Bookings",
  description:
    "Read how Iceland Taxi Offers handles customer details for Iceland taxi bookings, Keflavík Airport transfers, Reykjavík rides, and private tours.",
  path: "/privacy-policy"
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      intro="We collect only the information needed to arrange and complete your taxi, transfer, or private tour booking."
      sections={[
        {
          title: "Information We Collect",
          items: [
            "Name",
            "Email",
            "Phone Number",
            "Pickup Address",
            "Destination",
            "Flight Number, if provided"
          ]
        },
        {
          title: "How We Use Information",
          body:
            "Customer information is used only to complete bookings, communicate about your trip, manage pickup details, and comply with Icelandic law."
        },
        {
          title: "Information Sharing",
          body:
            "Customer information is never sold. We do not share customer details for advertising or unrelated marketing."
        },
        {
          title: "Contact",
          body:
            "For privacy questions, contact Iceland Taxi Offers by phone or email using the details on the Contact page."
        }
      ]}
    />
  );
}
