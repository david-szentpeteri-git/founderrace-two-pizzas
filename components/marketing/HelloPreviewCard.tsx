import type { Hello } from "@/lib/types";

export default function HelloPreviewCard({ hello }: { hello: Hello }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Hello {hello.rank}</p>
          <h3 className="mt-1 text-lg font-semibold text-zinc-900">{hello.name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{hello.role}</p>
        </div>
        <span className="shrink-0 rounded-full bg-zinc-900 px-3 py-1 text-sm font-semibold text-white">
          #{hello.number}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-900">Why you should meet</p>
      <p className="mt-1 text-sm text-zinc-700">{hello.reason}</p>
      <p className="mt-4 text-sm font-medium text-zinc-900">Start with</p>
      <p className="mt-1 text-sm text-zinc-700">&ldquo;{hello.opener}&rdquo;</p>
      {hello.askMeAbout ? (
        <p className="mt-auto pt-4 text-xs text-zinc-500">Ask them about: {hello.askMeAbout}</p>
      ) : null}
    </article>
  );
}
