import type { Metadata } from "next";
import Link from "next/link";
import { audience, demo, faq, finalCta, hero, howItWorks, meta, pricing, problem } from "@/content/landing";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Marker from "@/components/marketing/Marker";
import Faq from "@/components/marketing/Faq";
import HelloPreviewCard from "@/components/marketing/HelloPreviewCard";
import { sampleGuest, sampleHellos } from "@/components/marketing/sampleHellos";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

function markPhrase(text: string, phrase: string) {
  const at = text.indexOf(phrase);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <Marker>{phrase}</Marker>
      {text.slice(at + phrase.length)}
    </>
  );
}

const primaryButton =
  "inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-center text-base font-medium text-white hover:bg-zinc-700";
const secondaryButton =
  "inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-center text-base font-medium text-zinc-900 hover:border-zinc-900";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
          <p className="text-sm font-medium text-zinc-500">{hero.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            {markPhrase(hero.headline, "three people")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-500">{hero.problem}</p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-900">{hero.solution}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={hero.primaryCta.href} className={primaryButton}>
              {hero.primaryCta.label}
            </Link>
            <Link href={hero.secondaryCta.href} className={secondaryButton}>
              {hero.secondaryCta.label}
            </Link>
          </div>
          <p className="mt-4 text-sm text-zinc-500">{hero.reassurance}</p>
        </section>

        {/* Problem */}
        <section className="bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{problem.heading}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-8">
              {problem.paragraphs.map((p) => (
                <p key={p} className="text-base leading-relaxed text-zinc-500">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6" id="how-it-works">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{howItWorks.heading}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-zinc-200 p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-lime-300 text-sm font-semibold text-zinc-900">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Key feature preview */}
        <section className="bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{demo.heading}</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">{demo.body}</p>
            {sampleHellos.length > 0 ? (
            <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-zinc-200 sm:p-6">
              <p className="text-sm text-zinc-500">
                This is what guest #{sampleGuest.number} sees on their phone
              </p>
              <p className="mt-1 text-xl font-semibold">
                {sampleGuest.name}, your <Marker>three hellos</Marker>
              </p>
              <p className="mt-1 text-sm text-zinc-500">{sampleGuest.role}</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {sampleHellos.map((h) => (
                  <HelloPreviewCard key={h.rank} hello={h} />
                ))}
              </div>
            </div>
            ) : null}
            <p className="mt-4 text-xs text-zinc-500">{demo.disclaimer}</p>
            <div className="mt-6">
              <Link href={demo.cta.href} className={secondaryButton}>
                {demo.cta.label}
              </Link>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{audience.heading}</h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-500">{audience.intro}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {audience.groups.map((g) => (
              <li key={g} className="rounded-xl border border-zinc-200 px-5 py-4 text-base">
                {g}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm text-zinc-500">{audience.note}</p>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-8 bg-zinc-50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{pricing.heading}</h2>
            <p className="mt-4 text-base text-zinc-500">{pricing.intro}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {pricing.plans.map((plan, i) => (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-2xl bg-white p-6 ${i === 1 ? "ring-2 ring-zinc-900" : "ring-1 ring-zinc-200"}`}
                >
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{plan.priceNote}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {plan.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-lime-300 ring-1 ring-zinc-900" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-2 md:mt-auto">
                    <Link href={plan.cta.href} className={`${primaryButton} w-full`}>
                      {plan.cta.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-sm text-zinc-500">{pricing.footnote}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{faq.heading}</h2>
          <div className="mt-8">
            <Faq />
          </div>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="rounded-3xl bg-zinc-900 px-6 py-12 text-center text-white sm:px-12">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{finalCta.heading}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300">{finalCta.body}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={finalCta.primary.href}
                className="inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 text-center text-base font-medium text-zinc-900 hover:bg-lime-200"
              >
                {finalCta.primary.label}
              </Link>
              <Link
                href={finalCta.secondary.href}
                className="inline-flex items-center justify-center rounded-full border border-zinc-600 px-6 py-3 text-center text-base font-medium text-white hover:border-white"
              >
                {finalCta.secondary.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
