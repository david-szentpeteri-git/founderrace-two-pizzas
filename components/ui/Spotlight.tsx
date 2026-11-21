"use client";

import { useRef, type ReactNode } from "react";

/**
 * Feeds the pointer position to every `.th-spot` card inside it (as --mx, --my),
 * with one listener for the whole group. The light itself is pure CSS in
 * globals.css, so this renders a plain wrapper on the server and on touch screens.
 */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const cards = ref.current?.querySelectorAll<HTMLElement>(".th-spot, .th-spot-children > *");
        cards?.forEach((card) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      }}
    >
      {children}
    </div>
  );
}
