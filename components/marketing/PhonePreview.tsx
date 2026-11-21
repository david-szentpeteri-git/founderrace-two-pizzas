import type { CSSProperties } from "react";
import m from "@/components/marketing/motion";
import {
  sampleAnswers,
  sampleGuest,
  sampleHellos,
} from "@/components/marketing/sampleHellos";

// A miniature of the guest page, drawn in CSS. Decorative: the same hellos
// are read in full in the "See a finished event" section, so it is aria-hidden.
export default function PhonePreview() {
  if (sampleHellos.length === 0) return null;
  const firstName = sampleGuest.name.split(" ")[0];

  return (
    <div
      aria-hidden="true"
      className="relative isolate mx-auto w-full max-w-[300px] select-none"
    >
      <div className={m.glow} />
      {sampleAnswers.length > 0 ? (
        <div
          className={`absolute -left-36 top-16 hidden w-40 xl:block ${m.answersIn}`}
        >
          <div className={m.driftSlow}>
            <div className="-rotate-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                From four answers.
              </p>
              <dl className="mt-3 space-y-2.5">
                {sampleAnswers.map((a) => (
                  <div key={a.label}>
                    <dt className="text-[10px] font-medium text-zinc-500">
                      {a.label}
                    </dt>
                    <dd className="text-xs leading-snug text-zinc-900">
                      {a.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      ) : null}

      <div className={m.phoneIn}>
        <div className={m.drift}>
          <div className="relative rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl shadow-zinc-900/20">
            <div className="absolute left-1/2 top-0 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
            <div className="overflow-hidden rounded-[1.9rem] bg-zinc-50">
              <div className="px-4 pb-5 pt-8">
                <p className="text-[11px] font-medium text-zinc-500">
                  Founders and students mixer
                </p>
                <p className="mt-1 font-display text-xl font-semibold tracking-tight text-zinc-900">
                  You&rsquo;re guest #{sampleGuest.number}
                </p>
                <p className="text-xs text-zinc-500">
                  {firstName}, here are your three hellos
                </p>

                <div className="mt-4 space-y-2.5">
                  {sampleHellos.map((h, i) => (
                    <div
                      key={h.rank}
                      style={{ "--i": i } as CSSProperties}
                      className={`rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm ${m.cardIn}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {h.name}
                          </p>
                          <p className="line-clamp-1 text-[11px] text-zinc-500">
                            {h.role}
                          </p>
                        </div>
                        <div className="flex size-9 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-900 text-white">
                          <span className="text-[7px] uppercase tracking-wider text-zinc-400">
                            Badge
                          </span>
                          <span className="text-sm font-semibold leading-none">
                            {h.number}
                          </span>
                        </div>
                      </div>
                      {h.mutual ? (
                        <p
                          className={`mt-2 inline-flex origin-left rounded-full bg-lime-300 px-2 py-0.5 text-[10px] font-medium text-zinc-900 ${m.pillPop}`}
                        >
                          You&rsquo;re on their list too
                        </p>
                      ) : null}
                      <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-zinc-700">
                        {h.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
