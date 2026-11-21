import type { Spark } from "@/lib/sparks/core";
import { getSparks } from "@/lib/sparks";

const focus = "rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";

const countWord: Record<number, string> = { 1: "One thing", 2: "Two things", 3: "Three things" };

/** The list of sparks. Renders nothing when there are none. */
export function Sparks({ sparks, headingLevel = 2 }: { sparks: Spark[]; headingLevel?: 2 | 3 }) {
  if (sparks.length === 0) return null;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <section aria-label="Things to talk about this week">
      <Heading className="font-display text-xl font-semibold tracking-tight text-zinc-900">
        {countWord[sparks.length] ?? "Things"} to talk about this week
      </Heading>
      <p className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-lime-400" />
        Fresh this week, found with Tavily
      </p>
      <ul className="mt-4 space-y-3">
        {sparks.map((spark) => (
          <li key={spark.url} className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-base font-medium leading-relaxed text-zinc-900">{spark.prompt}</p>
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="text-zinc-500">{spark.source}</span>
              <a
                href={spark.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 ${focus}`}
              >
                Read the story<span className="sr-only"> on {spark.source} (opens in a new tab)</span>
              </a>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

type SparkEvent = { slug: string; name: string; description: string | null };

/**
 * Loads the sparks for an event and renders them. Wrap it in <Suspense fallback={null}>
 * so a slow search never holds up the page. Renders nothing when there are no sparks.
 */
export async function EventSparks({ event, className }: { event: SparkEvent; className?: string }) {
  const sparks = await getSparks(event);
  if (sparks.length === 0) return null;
  return (
    <div className={className}>
      <Sparks sparks={sparks} />
    </div>
  );
}

/** The demo page version: same cards under a "What guests also get" heading. */
export async function DemoSparks({ event }: { event: SparkEvent }) {
  const sparks = await getSparks(event);
  if (sparks.length === 0) return null;
  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        What guests also get
      </h2>
      <p className="mt-3 max-w-[65ch] text-lg leading-relaxed text-zinc-500">
        Every guest page also shows a few questions built from this week&apos;s news on the event&apos;s
        theme, so people have something current to talk about.
      </p>
      <div className="mt-6 max-w-md">
        <Sparks sparks={sparks} headingLevel={3} />
      </div>
    </div>
  );
}
