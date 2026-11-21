import type { ReactNode } from "react";

/** Highlighter marker behind key words. */
export function Marker({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm bg-lime-300 px-1 [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
      {children}
    </span>
  );
}
