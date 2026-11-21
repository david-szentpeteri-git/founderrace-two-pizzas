import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import type { LegalPage } from "@/content/legal/seller";

// Shared layout for /legal, /terms and /privacy.
// The page text lives in content/legal/; this file only renders it.

type Route = "/legal" | "/terms" | "/privacy";

const links: { href: Route; label: string }[] = [
  { href: "/legal", label: "Legal notice" },
  { href: "/terms", label: "Terms of sale" },
  { href: "/privacy", label: "Privacy" },
];

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function OtherPages({ current }: { current: Route }) {
  return (
    <nav aria-label="Legal pages" className="mt-12 border-t border-zinc-200 pt-6">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {links
          .filter((l) => l.href !== current)
          .map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="rounded text-zinc-900 underline underline-offset-4 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              >
                {l.label}
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
}

export function LegalDocument({ page, current }: { page: LegalPage; current: Route }) {
  return (
    <Shell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{page.title}</h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated {page.lastUpdated}</p>
        <p className="mt-8 max-w-[65ch] text-lg leading-relaxed text-zinc-500">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="font-display text-2xl font-semibold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-3 max-w-[65ch] text-base leading-7 text-zinc-700">
                {p}
              </p>
            ))}
          </section>
        ))}
        <OtherPages current={current} />
      </article>
    </Shell>
  );
}

// Shown while the seller details in content/legal/seller.ts are not all filled in,
// so the page never shows a blank or made up value.
export function LegalPending({ title, current }: { title: string; current: Route }) {
  return (
    <Shell>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-8 max-w-[65ch] text-lg leading-relaxed text-zinc-500">
          We are adding the full text of this page today. Please check back soon.
        </p>
        <OtherPages current={current} />
      </article>
    </Shell>
  );
}
