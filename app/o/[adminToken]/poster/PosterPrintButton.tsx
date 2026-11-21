"use client";

import { buttonClass } from "@/components/ui/button";

export function PosterPrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClass()}>
      Print poster
    </button>
  );
}
