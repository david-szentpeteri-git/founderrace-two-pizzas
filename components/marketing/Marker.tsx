import type { ReactNode } from "react";
import m from "@/components/marketing/motion";

// The one highlight colour: lime behind a key word, like a marker pen.
// `draw` sweeps the highlight in once from left to right (the hero uses it).
export default function Marker({ children, draw = false }: { children: ReactNode; draw?: boolean }) {
  return (
    <span
      className={`rounded-sm px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone] ${
        draw ? m.markerDraw : "bg-lime-300"
      }`}
    >
      {children}
    </span>
  );
}
