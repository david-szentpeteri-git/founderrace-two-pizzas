import Link from "next/link";
import { footer } from "@/content/landing";

const focus = "rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

export default function Footer() {
  return (
    <footer id="site-footer" className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" className={`font-display text-lg font-semibold tracking-tight text-zinc-900 ${focus}`}>
              Three Hellos
            </Link>
            <p className="mt-1 text-sm text-zinc-500">{footer.tagline}</p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={`text-zinc-500 hover:text-zinc-900 ${focus}`}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-zinc-100 py-6">
          <p className="text-xs text-zinc-500">{footer.madeBy}</p>
        </div>
      </div>
    </footer>
  );
}
