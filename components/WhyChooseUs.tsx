import { CalendarClock, Car, HandHeart, UsersRound } from "lucide-react";
import SectionHeading from "./SectionHeading";

const reasons = [
  {
    title: "Private Experience",
    copy: "No crowded buses.",
    icon: UsersRound
  },
  {
    title: "Flexible Schedule",
    copy: "Travel when you want.",
    icon: CalendarClock
  },
  {
    title: "Comfort",
    copy: "Clean SUV.",
    icon: Car
  },
  {
    title: "Local Driver",
    copy: "Friendly Icelandic service.",
    icon: HandHeart
  }
];

export default function WhyChooseUs() {
  return (
    <section className="bg-ice py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Why choose us"
          title="Why Choose This Reykjavík Taxi Driver"
          align="center"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ title, copy, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl bg-white p-6 text-center shadow-[0_12px_36px_rgba(7,17,31,0.06)] ring-1 ring-slate-100"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-midnight text-gold">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-black text-midnight">{title}</h3>
              <p className="mt-2 text-sm font-semibold text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
