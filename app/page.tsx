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
import { Spotlight } from "@/components/ui/Spotlight";

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

const section = "mx-auto max-w-6xl px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-24";
const h2 = "font-display text-3xl font-semibold tracking-[-0.03em] text-zinc-900 sm:text-5xl sm:leading-[1.05]";
const lift = "transition duration-150 motion-safe:hover:-translate-y-0.5 hover:shadow-md hover:shadow-zinc-900/5";
const lead = "mt-4 max-w-[65ch] text-lg leading-relaxed text-zinc-500";

export default function HomePage() {
  return (
    <div className="min-h-screen text-zinc-900">
      <Header />
      <main>
        {/* Hero */}
        <section id="hero" className="relative isolate mx-auto max-w-6xl overflow-x-clip px-4 pb-20 pt-12 sm:px-6 sm:pt-20 lg:pb-28">
          <div aria-hidden="true" className="th-dots pointer-events-none absolute inset-x-0 -top-10 -z-10 h-[34rem]" />
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <div>
              <p className="text-sm font-medium text-zinc-500">{hero.eyebrow}</p>
              <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl lg:leading-[0.98]">
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
              <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 backdrop-blur">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-lime-500" />
                Built in 24 hours at FounderRace, Edition 2
              </p>
            </div>
            <div className="lg:justify-self-center xl:pl-32">
              <PhonePreview />
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="bg-gradient-to-b from-zinc-50 to-white">
          <Reveal className={section}>
            <h2 className={h2}>{problem.heading}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 md:gap-12">
              {problem.paragraphs.map((p) => (
                <p key={p} className="max-w-[65ch] text-lg leading-relaxed text-zinc-500">
                  {p}
                </p>
              ))}
            </div>
            <figure className="relative mt-14 max-w-3xl">
              <span aria-hidden="true" className="absolute -left-1 -top-8 font-display text-8xl leading-none text-lime-400/80 sm:-left-10 sm:-top-6">
                &ldquo;
              </span>
              <blockquote className="font-display text-2xl font-medium leading-snug tracking-[-0.02em] text-zinc-900 sm:text-3xl">
                {hero.solution}
              </blockquote>
            </figure>
          </Reveal>
        </section>

        {/* Photo band */}
        {mixerPhoto ? (
          <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6 sm:pt-24">
            <figure>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-zinc-100 shadow-2xl shadow-lime-900/10 ring-1 ring-zinc-900/5 sm:aspect-[16/9]">
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
        <section className="bg-gradient-to-b from-white via-zinc-50 to-white">
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
                <Spotlight>
                  <Reveal
                    stagger
                    className="th-spot-children mt-8 grid gap-6 lg:grid-cols-3 [&>article]:h-full [&>article]:transition [&>article]:duration-200 motion-safe:[&>article:hover]:-translate-y-1 [&>article:hover]:shadow-xl [&>article:hover]:shadow-lime-900/10"
                  >
                    {sampleHellos.map((h) => (
                      <HelloCard key={h.rank} hello={h} />
                    ))}
                  </Reveal>
                </Spotlight>
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
          <Reveal as="ul" stagger className="mt-10 grid gap-x-12 sm:grid-cols-2">
            {audience.groups.map((g) => (
              <li key={g} className="flex gap-4 border-t border-zinc-200 py-5 text-lg leading-relaxed text-zinc-900">
                <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1.5 size-5 shrink-0 text-lime-600" fill="none">
                  <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.15" />
                  <path d="m6.5 10.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {g}
              </li>
            ))}
          </Reveal>
          <p className="mt-6 max-w-[65ch] text-base text-zinc-500">{audience.note}</p>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 bg-gradient-to-b from-zinc-50 to-white">
          <div className={section}>
            <h2 className={h2}>{pricing.heading}</h2>
            <p className={lead}>{pricing.intro}</p>
            <Spotlight>
            <Reveal stagger className="mt-10 grid gap-6 lg:grid-cols-3">
              {pricing.plans.map((plan, i) => {
                const recommended = i === 1;
                return (
                  <div
                    key={plan.name}
                    className={`th-spot relative flex flex-col rounded-3xl bg-white p-8 ${lift} ${
                      recommended ? "ring-2 ring-zinc-900 shadow-2xl shadow-lime-900/10" : "ring-1 ring-zinc-200"
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
            </Spotlight>
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
          <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-16 text-center text-white shadow-2xl shadow-zinc-900/20 sm:px-12 sm:py-24">
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_50%_-4rem,rgb(190_242_100/0.28),transparent_70%)]" />
            <div aria-hidden="true" className="th-dots-dark absolute inset-0 -z-10" />
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-[-0.035em] sm:text-6xl sm:leading-[1.02]">
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
