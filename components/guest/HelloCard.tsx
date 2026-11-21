import type { Hello } from "@/lib/types";

const rankLabel: Record<Hello["rank"], string> = {
  1: "First hello",
  2: "Second hello",
  3: "Third hello",
};

/** One suggested introduction. Reused by the guest page, the landing page and the demo. */
export function HelloCard({ hello }: { hello: Hello }) {
  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-900/5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-500">{rankLabel[hello.rank]}</p>
          <h3 className="mt-1 break-words font-display text-2xl font-semibold tracking-tight text-zinc-900">{hello.name}</h3>
          <p className="mt-1 text-base text-zinc-500">{hello.role}</p>
        </div>
        <div
          className="flex size-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-zinc-900 text-white"
          aria-label={`Badge number ${hello.number}`}
        >
          <span className="text-[10px] uppercase tracking-wider text-zinc-400">Badge</span>
          <span className="mt-0.5 font-display text-xl font-semibold leading-none">{hello.number}</span>
        </div>
      </div>

      {hello.mutual && (
        <p data-mutual className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-lime-300 px-3 py-1 text-sm font-medium text-zinc-900">
          <span aria-hidden="true">&#8644;</span> You’re on their list too
        </p>
      )}

      <div className="mt-5 space-y-4 text-base leading-relaxed">
        <div>
          <p className="text-sm font-medium text-zinc-500">Why you should meet</p>
          <p className="mt-1 text-zinc-900">{hello.reason}</p>
        </div>
        <div className="rounded-2xl bg-zinc-50 p-4">
          <p className="text-sm font-medium text-zinc-500">Start with</p>
          <p className="mt-1 font-medium text-zinc-900">“{hello.opener}”</p>
        </div>
        {hello.askMeAbout && (
          <div>
            <p className="text-sm font-medium text-zinc-500">Ask them about</p>
            <p className="mt-1 text-zinc-900">{hello.askMeAbout}</p>
          </div>
        )}
      </div>
    </article>
  );
}
