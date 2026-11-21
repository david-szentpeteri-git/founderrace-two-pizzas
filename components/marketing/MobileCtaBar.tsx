"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Sticky bottom bar on phones. Shows once the hero has scrolled out of view
// and hides again when the footer comes in, so it never covers footer links.
export default function MobileCtaBar({
  href,
  label,
  heroId,
  footerId,
}: {
  href: string;
  label: string;
  heroId: string;
  footerId: string;
}) {
  const [heroGone, setHeroGone] = useState(false);
  const [footerIn, setFooterIn] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    const footer = document.getElementById(footerId);
    if (!("IntersectionObserver" in window)) return;
    const observers: IntersectionObserver[] = [];
    if (hero) {
      const o = new IntersectionObserver(([e]) => setHeroGone(!e.isIntersecting));
      o.observe(hero);
      observers.push(o);
    }
    if (footer) {
      const o = new IntersectionObserver(([e]) => setFooterIn(e.isIntersecting));
      o.observe(footer);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [heroId, footerId]);

  const visible = heroGone && !footerIn;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/90 px-4 pt-3 backdrop-blur transition-transform duration-200 sm:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
    >
      <Link
        href={href}
        tabIndex={visible ? 0 : -1}
        className="flex min-h-12 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-base font-medium text-white hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        {label}
      </Link>
    </div>
  );
}
