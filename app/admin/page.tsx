import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import {
  getStoredBookings,
  redisNotConfiguredMessage
} from "@/lib/booking-storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | Iceland Taxi Offers",
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminPage() {
  try {
    const bookings = await getStoredBookings();
    const newestFirst = bookings.sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );

    return <AdminDashboard initialBookings={newestFirst} />;
  } catch (error) {
    const message =
      error instanceof Error && error.message === "REDIS_NOT_CONFIGURED"
        ? redisNotConfiguredMessage
        : "Admin bookings could not be loaded.";

    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-400/30 bg-red-500/12 p-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-red-200">
            Admin setup needed
          </p>
          <h1 className="mt-3 text-3xl font-black">Bookings unavailable</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-red-50">
            {message}
          </p>
        </div>
      </main>
    );
  }
}
