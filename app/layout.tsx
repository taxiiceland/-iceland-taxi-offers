import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { absoluteUrl, siteUrl } from "@/lib/seo";
import { contact, images } from "@/lib/site-data";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TaxiService",
  name: contact.businessName,
  url: siteUrl,
  telephone: contact.phone,
  email: contact.email,
  areaServed: contact.serviceArea,
  paymentAccepted: "Cash, credit card",
  priceRange: "ISK"
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Private Taxi Iceland | Airport Transfers & Private Tours",
    template: "%s | Iceland Taxi Offers"
  },
  description:
    "Book a licensed Icelandic taxi driver for Keflavík Airport transfers, Reykjavík rides, Golden Circle trips, South Coast tours, and custom private taxi journeys.",
  keywords: [
    "Iceland taxi",
    "Iceland private taxi",
    "Private taxi Iceland",
    "Keflavík airport taxi",
    "Keflavík airport transfer",
    "airport transfer Iceland",
    "Reykjavík airport transfer",
    "Taxi from Keflavík to Reykjavík",
    "Taxi from Reykjavík to Keflavík",
    "Blue Lagoon taxi",
    "private driver Iceland",
    "Golden Circle private taxi",
    "South Coast private tour",
    "Iceland private tours",
    "Taxi Iceland airport"
  ],
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: "Private Taxi Iceland | Airport Transfers & Private Tours",
    description:
      "Book Iceland Taxi Offers for Keflavík airport transfers, Reykjavík rides, Blue Lagoon taxi service, and private tours across Iceland.",
    url: absoluteUrl("/"),
    siteName: contact.businessName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: images.hero,
        width: 1200,
        height: 630,
        alt: "Iceland Taxi Offers private taxi and airport transfers"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Taxi Iceland | Airport Transfers & Private Tours",
    description:
      "Book a licensed Icelandic taxi driver for airport transfers and private Iceland tours."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
