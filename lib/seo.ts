import type { Metadata } from "next";
import { contact, images } from "./site-data";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://icelandtaxioffers.com";

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}

export const defaultSeoTitle =
  "Iceland Taxi | Keflavík Airport Transfers & Private Tours";

export const defaultSeoDescription =
  "Book Iceland Taxi Offers for Keflavík Airport taxi transfers, Reykjavík rides, Blue Lagoon taxi trips, Golden Circle tours, and private taxi service in Iceland.";

export const defaultSeoImage = {
  url: images.hero,
  width: 1200,
  height: 630,
  alt: "Iceland Taxi Offers private taxi for Keflavík Airport transfers and Iceland tours"
};

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: typeof defaultSeoImage;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = defaultSeoImage,
  noIndex = false
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path);

  return {
    title: {
      absolute: title
    },
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName: contact.businessName,
      type: "website",
      locale: "en_US",
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url]
    },
    robots: noIndex ? { index: false, follow: false } : undefined
  };
}
