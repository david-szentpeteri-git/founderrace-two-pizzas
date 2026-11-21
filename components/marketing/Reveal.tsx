"use client";

import { createElement, useEffect, useRef, type ReactNode } from "react";
import m from "./motion";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ol" | "ul" | "section";
  /** Reveal the direct children one after another instead of the block as one. */
  stagger?: boolean;
};

/**
 * Rises and fades its content in once, when it scrolls into view.
 * The server HTML is plain and visible. The hidden class is added only on the
 * client, only after the first real scroll, and only for blocks still below
 * the fold, so content cannot stay hidden without JavaScript, under reduced
 * motion, in print, or in a capture that never scrolls.
 */
export function Reveal({ children, className, as = "div", stagger = false }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const pending = stagger ? m.pendingStagger : m.pending;
    const shown = stagger ? m.inStagger : m.in;
    let io: IntersectionObserver | null = null;

    const show = () => {
      el.classList.remove(pending);
      el.classList.add(shown);
      io?.disconnect();
    };

    // Nothing is hidden until the visitor really scrolls. A page that is only
    // loaded and captured (the race's automatic screenshot, a link preview, a
    // full page capture) therefore always shows every section.
    const arm = () => {
      window.removeEventListener("scroll", arm);
      const box = el.getBoundingClientRect();
      if (box.top < window.innerHeight) return; // on screen or already passed: leave it alone
      el.classList.add(pending);
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) show();
        },
        { threshold: 0 },
      );
      io.observe(el);
    };
    window.addEventListener("scroll", arm, { passive: true });
    window.addEventListener("beforeprint", show);
    return () => {
      window.removeEventListener("scroll", arm);
      window.removeEventListener("beforeprint", show);
      io?.disconnect();
      el.classList.remove(pending);
    };
  }, [stagger]);

  return createElement(as, { ref, className }, children);
}
