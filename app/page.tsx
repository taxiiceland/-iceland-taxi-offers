import type { Metadata } from "next";
import AirportTransferCards from "@/components/AirportTransferCards";
import BookingForm from "@/components/BookingForm";
import DiscountBanner from "@/components/DiscountBanner";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MobileStickyBar from "@/components/MobileStickyBar";
import NeedHelp from "@/components/NeedHelp";
import TourGallery from "@/components/TourGallery";
import TourCards from "@/components/TourCards";
import TrustBadges from "@/components/TrustBadges";
import WhyChooseUs from "@/components/WhyChooseUs";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Private Taxi Iceland | Airport Transfers & Private Tours",
  description:
    "Book a licensed Icelandic taxi driver for Keflavík Airport transfers, Reykjavík rides, Golden Circle trips, South Coast tours, and custom private taxi journeys.",
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    url: absoluteUrl("/")
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-ice pb-20 text-midnight md:pb-0">
      <Header />
      <Hero />
      <DiscountBanner />
      <AirportTransferCards />
      <TourCards />
      <TourGallery />
      <BookingForm />
      <TrustBadges />
      <WhyChooseUs />
      <FAQ />
      <NeedHelp />
      <Footer />
      <MobileStickyBar />
    </main>
  );
}
