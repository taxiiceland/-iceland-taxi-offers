import type { Metadata } from "next";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import {
  absoluteUrl,
  defaultSeoDescription,
  defaultSeoImage,
  defaultSeoTitle,
  siteUrl
} from "@/lib/seo";
import { contact, images } from "@/lib/site-data";
import "./globals.css";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: contact.businessName,
      url: siteUrl,
      email: contact.email,
      telephone: contact.phone,
      image: images.hero
    },
    {
      "@type": "LocalBusiness",
      "@id": absoluteUrl("/#local-business"),
      name: contact.businessName,
      url: siteUrl,
      email: contact.email,
      telephone: contact.phone,
      image: images.hero,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Reykjavík",
        addressCountry: "IS"
      },
      areaServed: [
        { "@type": "Place", name: "Keflavík Airport" },
        { "@type": "Place", name: "Reykjavík" },
        { "@type": "Place", name: "Blue Lagoon" },
        { "@type": "Country", name: "Iceland" }
      ],
      paymentAccepted: "Cash, card payment terminal",
      priceRange: "ISK"
    },
    {
      "@type": "TaxiService",
      "@id": absoluteUrl("/#taxi-service"),
      name: `${contact.businessName} Taxi Service`,
      serviceType: [
        "Iceland Taxi",
        "Keflavík Airport Taxi",
        "Airport Transfer Iceland",
        "Reykjavík Taxi",
        "Blue Lagoon Taxi",
        "Golden Circle Taxi",
        "Private Taxi Iceland"
      ],
      provider: { "@id": absoluteUrl("/#local-business") },
      url: siteUrl,
      areaServed: contact.serviceArea,
      offers: [
        { "@type": "Offer", name: "Keflavík Airport taxi transfers" },
        { "@type": "Offer", name: "Reykjavík taxi rides" },
        { "@type": "Offer", name: "Blue Lagoon taxi transfers" },
        { "@type": "Offer", name: "Golden Circle private taxi tours" },
        { "@type": "Offer", name: "South Coast private tours" }
      ]
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: contact.businessName,
      url: siteUrl,
      description: defaultSeoDescription,
      publisher: { "@id": absoluteUrl("/#organization") },
      inLanguage: "en"
    }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultSeoTitle,
    template: "%s | Iceland Taxi Offers"
  },
  description: defaultSeoDescription,
  keywords: [
    "Iceland taxi",
    "Taxi Iceland",
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
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    url: absoluteUrl("/"),
    siteName: contact.businessName,
    type: "website",
    locale: "en_US",
    images: [defaultSeoImage]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    images: [defaultSeoImage.url]
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
