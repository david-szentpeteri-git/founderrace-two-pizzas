import Link from "next/link";
import { BrandLine } from "./BrandLine";

export function GuestNotFound({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-16 text-zinc-900">
      <div>
        <BrandLine />
      </div>
      <h1 className="mt-8 font-display text-3xl font-semibold leading-tight tracking-tight">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-zinc-500">{body}</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center justify-center self-start rounded-full bg-zinc-900 px-6 text-base font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Go to the home page
      </Link>
    </main>
  );
}
