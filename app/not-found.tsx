import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-20 sm:px-6 sm:py-24">
        <p className="text-sm font-medium text-zinc-500">Error 404</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          We can&apos;t find this page.
        </h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-zinc-500">
          The link may be mistyped, or the page may have moved.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className={`inline-flex min-h-12 items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-700 ${focus}`}
          >
            Go to the home page
          </Link>
          <Link
            href="/demo"
            className={`inline-flex min-h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-base font-medium text-zinc-900 transition-colors hover:border-zinc-900 ${focus}`}
          >
            See a sample event
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
