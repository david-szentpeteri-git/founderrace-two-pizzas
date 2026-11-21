import type { Metadata } from "next";
import Link from "next/link";
import type { EventPublic } from "@/lib/types";
import { getDemo, getGuestView } from "@/lib/data";
import demoData from "@/content/demo-guests.json";
import { cta } from "@/content/landing";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Marker from "@/components/marketing/Marker";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900";
const h2 = "font-display text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl";
const lead = "mt-4 max-w-[65ch] text-lg leading-relaxed text-zinc-500";

export const metadata: Metadata = {
  title: "Sample event",
  description:
    "A finished sample event on Three Hellos: the organiser's guest list and every guest's three hellos. All names are fictional.",
};

export const dynamic = "force-dynamic";

type Row = { number: number; name: string; role: string; href: string };

// Fallback used when the data layer is not ready: built from the sample file.
// Badge numbers follow the order of the file; tokens follow "demo-<number>".
function fallbackFromFile(): { event: EventPublic; rows: Row[] } {
  const e = demoData.event;
  return {
    event: {
      slug: "demo",
      name: e.name,
      startsAt: e.startsAt,
      place: e.place,
      description: e.description,
      organiserName: e.organiserName,
      guestCount: demoData.guests.length,
      status: "matched",
      isDemo: true,
    },
    rows: demoData.guests.map((g, i) => ({
      number: i + 1,
      name: g.name,
      role: g.role,
      href: `/g/demo-${i + 1}`,
    })),
  };
}

async function loadDemo(): Promise<{ event: EventPublic; rows: Row[] }> {
  try {
    const demo = await getDemo();
    if (!demo || !demo.event || !Array.isArray(demo.guests) || demo.guests.length === 0) {
      return fallbackFromFile();
    }
    const rows = await Promise.all(
      demo.guests.map(async (g, i): Promise<Row> => {
        const fromFile = demoData.guests.findIndex((d) => d.name === g.name);
        let number = fromFile >= 0 ? fromFile + 1 : i + 1;
        let role = fromFile >= 0 ? demoData.guests[fromFile].role : "";
        try {
          const view = await getGuestView(g.token);
          if (view && view.guest.name === g.name) {
            number = view.guest.number;
            role = view.guest.role;
          }
        } catch {
          // keep the values from the sample file
        }
        return { number, name: g.name, role, href: `/g/${encodeURIComponent(g.token)}` };
      }),
    );
    rows.sort((a, b) => a.number - b.number);
    return { event: demo.event, rows };
  } catch {
    return fallbackFromFile();
  }
}

function formatWhen(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(d);
}

export default async function DemoPage() {
  const { event, rows } = await loadDemo();
  const when = formatWhen(event.startsAt);
  const matched = event.status === "matched";
  const firstGuest = rows[0];

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
          <p
            role="note"
            className="flex items-start gap-3 rounded-2xl bg-lime-50 px-5 py-4 text-sm leading-relaxed text-zinc-900 ring-1 ring-lime-300"
          >
            <span className="shrink-0 rounded-full bg-lime-300 px-2.5 py-0.5 text-xs font-semibold">Sample data</span>
            <span>
              This event, its organiser and all {event.guestCount} guests are fictional, made up to show how
              Three Hellos works.
            </span>
          </p>
        </div>

        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16">
          <p className="text-sm font-medium text-zinc-500">Sample event</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {event.name}
          </h1>
          {event.description ? <p className={`${lead} mt-6`}>{event.description}</p> : null}
          <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {when ? (
              <div className="rounded-2xl border border-zinc-200 px-5 py-4">
                <dt className="text-sm text-zinc-500">When</dt>
                <dd className="mt-1 text-base font-medium">{when}</dd>
              </div>
            ) : null}
            {event.place ? (
              <div className="rounded-2xl border border-zinc-200 px-5 py-4">
                <dt className="text-sm text-zinc-500">Where</dt>
                <dd className="mt-1 text-base font-medium">{event.place}</dd>
              </div>
            ) : null}
            <div className="rounded-2xl border border-zinc-200 px-5 py-4">
              <dt className="text-sm text-zinc-500">Organiser</dt>
              <dd className="mt-1 text-base font-medium">{event.organiserName}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-200 px-5 py-4">
              <dt className="text-sm text-zinc-500">Guests</dt>
              <dd className="mt-1 text-base font-medium">
                {event.guestCount} signed up{matched ? ", intros ready" : ""}
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-zinc-50">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <h2 className={h2}>
              What your <Marker>guests see</Marker>
            </h2>
            <p className={lead}>
              Each guest gets a private page with three people to meet at this event, the reason for each,
              and a first question to ask. Below is the organiser&apos;s guest list. Open any guest to see
              their page exactly as they would on their phone.
            </p>

            <ul className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
              {rows.map((row) => (
                <li key={row.href} className="min-w-0">
                  <Link
                    href={row.href}
                    className={`group flex min-h-20 items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-4 py-4 transition-colors hover:border-zinc-900 sm:px-5 ${focus}`}
                  >
                    <span
                      className="flex size-12 shrink-0 flex-col items-center justify-center rounded-xl bg-zinc-900 text-white"
                      aria-label={`Badge number ${row.number}`}
                    >
                      <span aria-hidden="true" className="text-[9px] uppercase tracking-wider text-zinc-400">
                        Badge
                      </span>
                      <span aria-hidden="true" className="font-display text-lg font-semibold leading-none">
                        {row.number}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{row.name}</span>
                      {row.role ? <span className="block truncate text-sm text-zinc-500">{row.role}</span> : null}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-900">
                      <span className="hidden sm:inline">See hellos</span>
                      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                        &rarr;
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {firstGuest ? (
              <p className="mt-6 text-sm text-zinc-500">
                Not sure where to start? Open{" "}
                <Link
                  href={firstGuest.href}
                  className={`rounded font-medium text-zinc-900 underline underline-offset-4 ${focus}`}
                >
                  {firstGuest.name}&apos;s page
                </Link>
                .
              </p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
          <div className="rounded-3xl bg-zinc-900 px-6 py-16 text-center text-white sm:px-12 sm:py-20">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Try it with your own guests
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-300">
              Free up to 15 guests, €29 for up to 150. No account needed.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href={cta.primary.href}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-lime-300 px-7 py-3 text-center text-base font-semibold text-zinc-900 transition-colors hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 sm:w-auto"
              >
                {cta.primary.label}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
