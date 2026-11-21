import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { audience, demo, faq, finalCta, hero, howItWorks, meta, pricing, problem } from "@/content/landing";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Marker from "@/components/marketing/Marker";
import Faq from "@/components/marketing/Faq";
import PhonePreview from "@/components/marketing/PhonePreview";
import { Reveal } from "@/components/marketing/Reveal";
import m from "@/components/marketing/motion";
import MobileCtaBar from "@/components/marketing/MobileCtaBar";
import { HelloCard } from "@/components/guest/HelloCard";
import { sampleGuest, sampleHellos } from "@/components/marketing/sampleHellos";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
};

function markPhrase(text: string, phrase: string, draw = false) {
  const at = text.indexOf(phrase);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <Marker draw={draw}>{phrase}</Marker>
      {text.slice(at + phrase.length)}
    </>
  );
}

// The photo band renders only when the file is present.
const mixerPhoto = fs.existsSync(path.join(process.cwd(), "public", "img", "mixer.jpg"));

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";
const press = "transition duration-150 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]";
const primaryButton = `inline-flex min-h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-center text-base font-medium text-white shadow-sm shadow-zinc-900/10 hover:bg-zinc-700 hover:shadow-md hover:shadow-zinc-900/15 sm:w-auto ${press} ${focus}`;
const secondaryButton = `inline-flex min-h-12 w-full items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-center text-base font-medium text-zinc-900 hover:border-zinc-900 hover:shadow-sm sm:w-auto ${press} ${focus}`;
const textLink = `group inline-flex min-h-12 items-center justify-center gap-1.5 rounded-full px-2 text-base font-medium text-zinc-900 underline-offset-4 hover:underline ${focus}`;

const section = "mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24";
const h2 = "font-display text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl";
const lift = "transition duration-150 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-900/5";
const lead = "mt-4 max-w-[65ch] text-lg leading-relaxed text-zinc-500";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main>
        {/* Hero */}
        <section id="hero" className="mx-auto max-w-6xl overflow-x-clip px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              <p className="text-sm font-medium text-zinc-500">{hero.eyebrow}</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                {markPhrase(hero.headline, "three people", true)}
              </h1>
              <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-zinc-500">{hero.problem}</p>
              <div className="mt-8 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
                <Link href={hero.primaryCta.href} className={primaryButton}>
                  {hero.primaryCta.label}
                </Link>
                <Link href={hero.secondaryCta.href} className={textLink}>
                  {hero.secondaryCta.label}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </Link>
              </div>
              <p className="mt-4 text-sm text-zinc-500">{hero.reassurance}</p>
              <p className="mt-6 inline-flex rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
                Built in 24 hours at FounderRace, Edition 2
              </p>
            </div>
            <div className="lg:justify-self-center xl:pl-32">
              <PhonePreview />
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="bg-zinc-50">
          <Reveal className={section}>
            <h2 className={h2}>{problem.heading}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-12">
              {problem.paragraphs.map((p) => (
                <p key={p} className="max-w-[65ch] text-lg leading-relaxed text-zinc-500">
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-10 max-w-[65ch] rounded-2xl border-l-4 border-zinc-900 bg-white px-6 py-5 text-lg leading-relaxed text-zinc-900 ring-1 ring-zinc-200">
              {hero.solution}
            </p>
          </Reveal>
        </section>

        {/* Photo band */}
        {mixerPhoto ? (
          <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-24">
            <figure>
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-zinc-100">
                <Image
                  src="/img/mixer.jpg"
                  alt="People talking in small groups at an evening social, each wearing a blank lime green name badge"
                  fill
                  sizes="(min-width: 1152px) 1104px, calc(100vw - 32px)"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-zinc-500">
                Illustration generated for this page. Not a real event.
              </figcaption>
            </figure>
          </section>
        ) : null}

        {/* How it works */}
        <section className={`${section} scroll-mt-20`} id="how-it-works">
          <h2 className={h2}>{howItWorks.heading}</h2>
          <Reveal as="ol" stagger className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {howItWorks.steps.map((step, i) => (
              <li key={step.title} className="border-t border-zinc-900 pt-6">
                <span
                  aria-hidden="true"
                  className={`${m.num} font-display text-6xl font-semibold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_#18181b]`}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </span>
                <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-zinc-500">{step.body}</p>
              </li>
            ))}
          </Reveal>
        </section>

        {/* Key feature preview */}
        <section className="bg-zinc-50">
          <div className={section}>
            <h2 className={h2}>{demo.heading}</h2>
            <p className={lead}>{demo.body}</p>
            {sampleHellos.length > 0 ? (
              <div className="mt-10">
                <p className="text-sm font-medium text-zinc-500">
                  This is what guest #{sampleGuest.number} sees on their phone
                </p>
                <p className="mt-2 font-display text-2xl font-semibold tracking-tight">
                  {sampleGuest.name}, your <Marker>three hellos</Marker>
                </p>
                <p className="mt-1 text-base text-zinc-500">{sampleGuest.role}</p>
                <Reveal
                  stagger
                  className="mt-8 grid gap-6 lg:grid-cols-3 [&>article]:h-full [&>article]:transition [&>article]:duration-150 motion-safe:[&>article:hover]:-translate-y-0.5 [&>article:hover]:shadow-md"
                >
                  {sampleHellos.map((h) => (
                    <HelloCard key={h.rank} hello={h} />
                  ))}
                </Reveal>
              </div>
            ) : null}
            <p className="mt-6 max-w-[65ch] text-sm text-zinc-500">{demo.disclaimer}</p>
            <div className="mt-8">
              <Link href={demo.cta.href} className={secondaryButton}>
                {demo.cta.label}
              </Link>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className={section}>
          <h2 className={h2}>{audience.heading}</h2>
          <p className={lead}>{audience.intro}</p>
          <Reveal as="ul" stagger className="mt-10 grid gap-4 sm:grid-cols-2">
            {audience.groups.map((g) => (
              <li key={g} className={`rounded-2xl border border-zinc-200 bg-white px-6 py-5 text-base leading-relaxed ${lift}`}>
                {g}
              </li>
            ))}
          </Reveal>
          <p className="mt-6 max-w-[65ch] text-base text-zinc-500">{audience.note}</p>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-zinc-50">
          <div className={section}>
            <h2 className={h2}>{pricing.heading}</h2>
            <p className={lead}>{pricing.intro}</p>
            <Reveal stagger className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricing.plans.map((plan, i) => {
                const recommended = i === 1;
                return (
                  <div
                    key={plan.name}
                    className={`relative flex flex-col rounded-2xl bg-white p-8 ${lift} ${
                      recommended ? "border-2 border-zinc-900 shadow-lg shadow-zinc-900/5" : "border-2 border-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold tracking-tight">{plan.name}</h3>
                      {recommended ? (
                        <span className="rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold text-zinc-900">
                          Most events
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-6 font-display text-6xl font-semibold tracking-tight">{plan.price}</p>
                    <p className="mt-2 min-h-12 text-base text-zinc-500">{plan.priceNote}</p>
                    <ul className="mt-6 space-y-3 text-base">
                      {plan.points.map((pt) => (
                        <li key={pt} className="flex gap-3">
                          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-10 md:mt-auto md:pt-10">
                      <Link
                        href={plan.cta.href}
                        className={`${recommended ? primaryButton : secondaryButton} sm:w-full`}
                      >
                        {plan.cta.label}
                      </Link>
                      <p className="mt-3 min-h-5 text-center text-sm text-zinc-500">
                        {i === 0 ? "No card needed." : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Reveal>
            <p className="mt-8 font-medium text-zinc-900">An event with 80 guests costs €1.30 in total.</p>
            <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-zinc-500">{pricing.footnote}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-24">
          <h2 className={h2}>{faq.heading}</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </section>

        {/* Final call to action */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <Reveal className="rounded-3xl bg-zinc-900 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              {finalCta.heading}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-300">{finalCta.body}</p>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href={finalCta.primary.href}
                className={`inline-flex min-h-12 items-center justify-center rounded-full bg-lime-300 px-7 py-3 text-center text-base font-semibold text-zinc-900 hover:bg-lime-200 ${press} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300`}
              >
                {finalCta.primary.label}
              </Link>
              <Link
                href={finalCta.secondary.href}
                className={`inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-600 px-7 py-3 text-center text-base font-medium text-white hover:border-white ${press} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
              >
                {finalCta.secondary.label}
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
      <MobileCtaBar href={hero.primaryCta.href} label={hero.primaryCta.label} heroId="hero" footerId="site-footer" />
    </div>
  );
}
