import Link from "next/link";
import type { LegalPage } from "@/content/legal/seller";

// Shared layout for /legal, /terms and /privacy.
// The page text lives in content/legal/; this file only renders it.

type Route = "/legal" | "/terms" | "/privacy";

const links: { href: Route; label: string }[] = [
  { href: "/legal", label: "Legal notice" },
  { href: "/terms", label: "Terms of sale" },
  { href: "/privacy", label: "Privacy" },
];

function OtherPages({ current }: { current: Route }) {
  return (
    <nav aria-label="Legal pages" className="mt-12 border-t border-zinc-200 pt-6">
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {links
          .filter((l) => l.href !== current)
          .map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-zinc-900 underline underline-offset-4 hover:text-zinc-600">
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
    <main className="bg-white text-zinc-900">
      <article className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{page.title}</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated {page.lastUpdated}</p>
        <p className="mt-6 text-base leading-7">{page.intro}</p>
        {page.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="text-xl font-semibold tracking-tight">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="mt-3 text-base leading-7 text-zinc-700">
                {p}
              </p>
            ))}
          </section>
        ))}
        <OtherPages current={current} />
      </article>
    </main>
  );
}

// Shown while the seller details in content/legal/seller.ts are not all filled in,
// so the page never shows a blank or made up value.
export function LegalPending({ title, current }: { title: string; current: Route }) {
  return (
    <main className="bg-white text-zinc-900">
      <article className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-6 text-base leading-7 text-zinc-700">
          We are adding the full text of this page today. Please check back soon.
        </p>
        <OtherPages current={current} />
      </article>
    </main>
  );
}
