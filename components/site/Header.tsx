import Link from "next/link";
import { cta, routes } from "@/content/landing";

export default function Header() {
  return (
    <header className="border-b border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-semibold tracking-tight text-zinc-900">
          Three Hellos
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-6">
          <Link href={routes.demo} className="hidden text-zinc-500 hover:text-zinc-900 sm:inline">
            Sample event
          </Link>
          <Link href="/#pricing" className="text-zinc-500 hover:text-zinc-900">
            Pricing
          </Link>
          <Link
            href={cta.primary.href}
            className="whitespace-nowrap rounded-full bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700"
          >
            {cta.primary.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
