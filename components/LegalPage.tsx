import Footer from "./Footer";
import Header from "./Header";

type LegalSection = {
  title: string;
  body?: string;
  items?: string[];
};

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections
}: LegalPageProps) {
  return (
    <main className="min-h-screen bg-ice text-midnight">
      <Header />
      <section className="pt-28 pb-16 sm:pb-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">
              {intro}
            </p>
          </div>

          <div className="mt-8 grid gap-5">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
              >
                <h2 className="text-2xl font-black">{section.title}</h2>
                {section.body ? (
                  <p className="mt-3 text-base font-semibold leading-7 text-slate-600">
                    {section.body}
                  </p>
                ) : null}
                {section.items ? (
                  <ul className="mt-4 grid gap-3 text-base font-semibold leading-7 text-slate-600">
                    {section.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 flex-none rounded-full bg-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
