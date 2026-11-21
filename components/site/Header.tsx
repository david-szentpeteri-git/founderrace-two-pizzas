import Link from "next/link";
import { cta, routes } from "@/content/landing";

const focus = "rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className={`flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl ${focus}`}
        >
          <span aria-hidden="true" className="flex size-6 sm:size-7 items-center justify-center rounded-lg bg-zinc-900 text-sm text-lime-300">
            3
          </span>
          Three Hellos
        </Link>
        <nav className="flex items-center gap-2.5 text-sm sm:gap-6">
          <Link href={routes.demo} className={`hidden text-zinc-500 hover:text-zinc-900 sm:inline ${focus}`}>
            Sample event
          </Link>
          <Link href="/#pricing" className={`text-zinc-500 hover:text-zinc-900 max-[359px]:hidden ${focus}`}>
            Pricing
          </Link>
          <Link
            href={cta.primary.href}
            className={`whitespace-nowrap bg-zinc-900 px-3.5 py-2 sm:px-4 font-medium text-white shadow-sm shadow-zinc-900/10 transition duration-150 hover:bg-zinc-700 hover:shadow-md motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] ${focus}`}
          >
            {cta.primary.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
