import type { ReactNode } from "react";

// The one highlight colour: lime behind a key word, like a marker pen.
export default function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-lime-300 px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </span>
  );
}
