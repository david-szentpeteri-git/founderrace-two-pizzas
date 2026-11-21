import Link from "next/link";

const focus = "rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

/** Small logo line for guest pages: the tile and the name, linking home. */
export function BrandLine() {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-display text-base font-semibold tracking-tight text-zinc-900 ${focus}`}
    >
      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center rounded-lg bg-zinc-900 text-sm text-lime-300"
      >
        3
      </span>
      Three Hellos
    </Link>
  );
}

/** Quiet footer line on guest pages, so a guest can find the product. */
export function MadeWith() {
  return (
    <p className="mt-12 border-t border-zinc-200 pt-6 text-center text-sm text-zinc-500">
      <Link href="/" className={`font-medium text-zinc-900 underline-offset-4 hover:underline ${focus}`}>
        Made with Three Hellos
      </Link>
    </p>
  );
}
