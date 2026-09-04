import type { Metadata } from "next";
import AirportTransferCards from "@/components/AirportTransferCards";
import BookingForm from "@/components/BookingForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MobileStickyBar from "@/components/MobileStickyBar";
import TourCards from "@/components/TourCards";
import TrustBadges from "@/components/TrustBadges";
import WhyChooseUs from "@/components/WhyChooseUs";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Iceland Taxi Offers | Keflavík Airport Transfers & Private Tours",
  description:
    "Request pre-booked Keflavík Airport transfers, Reykjavík to Keflavík taxi service, Blue Lagoon transfers, long-distance private trips, and Iceland private tours.",
  path: "/"
});

export default function Home() {
  return (
    <main className="min-h-screen bg-ice pb-20 text-midnight md:pb-0">
      <Header />
      <Hero />
      <BookingForm variant="quick" />
      <AirportTransferCards />
      <TourCards />
      <TrustBadges />
      <WhyChooseUs />
      <FAQ />
      <Footer />
      <MobileStickyBar />
    </main>
  );
}
