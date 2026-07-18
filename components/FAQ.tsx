import { contact } from "@/lib/site-data";
import SectionHeading from "./SectionHeading";

const faqs = [
  {
    question: "Do I pay online?",
    answer:
      "No. Payment is made after the ride by card using our payment terminal or by cash."
  },
  {
    question: "Can I book before arriving in Iceland?",
    answer: "Yes. Choose route, date, available time, pickup and drop-off."
  },
  {
    question: "How many passengers can book?",
    answer: "Up to 4 passengers."
  },
  {
    question: "How many suitcases fit?",
    answer: "Up to 5 standard suitcases. Add special luggage notes if needed."
  },
  {
    question: "Can I book a private Golden Circle trip?",
    answer: "Yes. Select Golden Circle or write your custom plan."
  },
  {
    question: "Can I call directly?",
    answer: `Yes. Call ${contact.phone}.`
  }
];

export default function FAQ() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="FAQ"
          title="Iceland Taxi Booking Questions"
          copy="Short answers for booking an Iceland taxi, Keflavík airport transfer, or private driver in Iceland."
        />

        <div className="mt-8 grid gap-3 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl bg-ice p-5 shadow-[0_10px_28px_rgba(7,17,31,0.05)]"
            >
              <summary className="cursor-pointer list-none text-lg font-black text-midnight">
                <span className="flex items-center justify-between gap-5">
                  {faq.question}
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white text-gold transition group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
