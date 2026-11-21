import Link from "next/link";

export function GuestNotFound({ title, body }: { title: string; body: string }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center bg-white px-6 py-16 text-zinc-900">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Three Hellos</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-zinc-500">{body}</p>
      <Link
        href="/"
        className="mt-10 inline-flex min-h-12 items-center justify-center self-start rounded-full bg-zinc-900 px-6 text-base font-medium text-white"
      >
        Go to the home page
      </Link>
    </main>
  );
}
