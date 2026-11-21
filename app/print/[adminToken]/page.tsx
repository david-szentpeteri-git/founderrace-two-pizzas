import type { Metadata } from "next";
import Link from "next/link";
import type { BadgeCard, Hello, PrintData } from "@/lib/types";
import { getPrintData } from "@/lib/data";
import { GuestNotFound } from "@/components/guest/NotFound";
import { formatEventTime } from "@/components/guest/format";
import { PrintButton } from "./PrintButton";
import { printCss } from "./printStyles";
import { getSparks } from "@/lib/sparks";
import type { Spark } from "@/lib/sparks/core";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Print badges and intro cards",
  robots: { index: false, follow: false },
};

const BADGES_PER_PAGE = 8;
const CARDS_PER_PAGE = 4;

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export default async function PrintPage({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;
  const data: PrintData | null = await getPrintData(adminToken);

  if (!data) {
    return (
      <GuestNotFound
        title="We could not find this event"
        body="This print link does not match any event. Check that you copied the whole link from your organiser dashboard."
      />
    );
  }

  const { event } = data;
  const cards = [...data.cards].sort((a, b) => a.number - b.number);
  const introsReady = event.status === "matched" && cards.some((c) => c.hellos.length > 0);
  const when = formatEventTime(event.startsAt, event.timeZone);
  const badgeSheets = chunk(cards, BADGES_PER_PAGE);
  const cardSheets = chunk(cards, CARDS_PER_PAGE);
  // Never throws; [] without a Tavily key or results, and then no extra card is printed.
  const sparks = cards.length > 0 ? await getSparks({ slug: event.slug, name: event.name, description: event.description }) : [];

  return (
    <main className="pv-root mx-auto max-w-[210mm] px-4 py-6">
      <style dangerouslySetInnerHTML={{ __html: printCss }} />

      <div className="pv-bar pv-no-print">
        <div className="min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full font-display text-sm font-semibold tracking-tight text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            <span
              aria-hidden="true"
              className="flex size-5 items-center justify-center rounded-md bg-zinc-900 text-xs text-lime-300"
            >
              3
            </span>
            Three Hellos
          </Link>
          <p className="mt-3 font-display text-xl font-semibold tracking-tight">{event.name}</p>
          <p className="text-zinc-500">
            {[when, event.place].filter(Boolean).join(", ") || "Print view"}
            {" · "}
            {cards.length} {cards.length === 1 ? "guest" : "guests"}
          </p>
          <p className="mt-1 text-zinc-500">Print from Chrome, A4, margins default.</p>
        </div>
        <PrintButton />
      </div>

      {cards.length === 0 ? (
        <p className="pv-note">
          No guests have joined yet. Share the join link from your dashboard, then come back here to
          print badges and intro cards.
        </p>
      ) : (
        <>
          <section aria-label="Name badges" className={introsReady ? "pv-break" : undefined}>
            <h2 className="pv-section-title pv-no-print">Name badges</h2>
            {badgeSheets.map((sheet, i) => (
              <div
                key={i}
                className={`pv-sheet pv-sheet-badges${i < badgeSheets.length - 1 ? " pv-break" : ""}`}
              >
                {sheet.map((card) => (
                  <Badge key={card.number} card={card} />
                ))}
              </div>
            ))}
          </section>

          {introsReady ? (
            <section aria-label="Intro cards">
              <h2 className="pv-section-title pv-no-print">Intro cards</h2>
              {cardSheets.map((sheet, i) => (
                <div
                  key={i}
                  className={`pv-sheet pv-sheet-cards${i < cardSheets.length - 1 ? " pv-break" : ""}`}
                >
                  {sheet.map((card) => (
                    <IntroCard key={card.number} card={card} eventName={event.name} />
                  ))}
                </div>
              ))}
            </section>
          ) : (
            <p className="pv-note pv-no-print">
              Intro cards appear here once you generate intros from your dashboard. You can print the
              badges now and the cards later.
            </p>
          )}

          {sparks.length > 0 ? <SparksCard sparks={sparks} /> : null}
        </>
      )}
    </main>
  );
}

function Badge({ card }: { card: BadgeCard }) {
  return (
    <article className="pv-badge">
      <div className="pv-badge-number">{card.number}</div>
      <div className="pv-badge-name">{card.name}</div>
      {card.role ? <div className="pv-badge-role">{card.role}</div> : null}
      {card.askMeAbout ? (
        <div className="pv-badge-ask">
          <strong>Ask me about:</strong> {card.askMeAbout}
        </div>
      ) : null}
    </article>
  );
}

function IntroCard({ card, eventName }: { card: BadgeCard; eventName: string }) {
  const hellos: Hello[] = [...card.hellos].sort((a, b) => a.rank - b.rank).slice(0, 3);
  return (
    <article className="pv-card">
      <header className="pv-card-head">
        <span className="pv-card-number">{card.number}</span>
        <span className="pv-card-name">{card.name}, your three hellos</span>
        <span className="pv-card-sub">{eventName}</span>
      </header>
      {hellos.length === 0 ? (
        <p className="pv-empty-hellos">
          Your intros are not ready yet. Ask the organiser, or check your guest page later.
        </p>
      ) : (
        <div className="pv-hellos">
          {hellos.map((h) => (
            <div key={h.rank} className="pv-hello">
              <div className="pv-hello-who">
                #{h.number} {h.name}
              </div>
              {h.role ? <div className="pv-hello-who" style={{ fontWeight: 400 }}>{h.role}</div> : null}
              <p className="pv-hello-reason">{h.reason}</p>
              <p className="pv-hello-opener">Try: “{h.opener}”</p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

/** One compact card with the topic prompts, printed after everything else. */
function SparksCard({ sparks }: { sparks: Spark[] }) {
  return (
    <section aria-label="Things to talk about this week" className="pv-sparks">
      <div className="pv-sparks-title">Things to talk about this week</div>
      <ol className="pv-sparks-list">
        {sparks.slice(0, 3).map((s) => (
          <li key={s.url}>
            {s.prompt} <span className="pv-sparks-source">({s.source})</span>
          </li>
        ))}
      </ol>
      <div className="pv-sparks-note">Fresh this week, found with Tavily</div>
    </section>
  );
}
