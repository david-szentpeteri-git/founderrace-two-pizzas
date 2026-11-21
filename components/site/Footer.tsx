import Link from "next/link";
import { footer } from "@/content/landing";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <Link href="/" className="text-base font-semibold text-zinc-900">
            Three Hellos
          </Link>
          <p className="mt-1 text-sm text-zinc-500">{footer.tagline}</p>
          <p className="mt-4 text-xs text-zinc-500">{footer.madeBy}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {footer.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-zinc-500 hover:text-zinc-900">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
