"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-10 items-center justify-center rounded-full bg-zinc-900 px-5 text-sm font-medium text-white"
    >
      Print
    </button>
  );
}
