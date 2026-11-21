import type { Metadata } from "next";
import Link from "next/link";
import type { EventPublic } from "@/lib/types";
import { getDemo, getGuestView } from "@/lib/mock";
import demoData from "@/content/demo-guests.json";
import { cta } from "@/content/landing";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import Marker from "@/components/marketing/Marker";

export const metadata: Metadata = {
  title: "Sample event | Three Hellos",
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
          if (view) {
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

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-xl border border-lime-400 bg-lime-50 px-4 py-3 text-sm text-zinc-900">
          Sample data. This event, its organiser and all {event.guestCount} guests are fictional, made up
          to show how Three Hellos works.
        </div>

        <section className="mt-10">
          <p className="text-sm font-medium text-zinc-500">Sample event</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">{event.name}</h1>
          {event.description ? (
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-500">{event.description}</p>
          ) : null}
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {when ? (
              <div className="rounded-2xl border border-zinc-200 p-4">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">When</dt>
                <dd className="mt-1 text-sm font-medium">{when}</dd>
              </div>
            ) : null}
            {event.place ? (
              <div className="rounded-2xl border border-zinc-200 p-4">
                <dt className="text-xs uppercase tracking-wide text-zinc-500">Where</dt>
                <dd className="mt-1 text-sm font-medium">{event.place}</dd>
              </div>
            ) : null}
            <div className="rounded-2xl border border-zinc-200 p-4">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">Organiser</dt>
              <dd className="mt-1 text-sm font-medium">{event.organiserName}</dd>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">Guests</dt>
              <dd className="mt-1 text-sm font-medium">
                {event.guestCount} signed up{matched ? ", intros generated" : ""}
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            The organiser&apos;s <Marker>guest list</Marker>
          </h2>
          <p className="mt-3 max-w-2xl text-base text-zinc-500">
            This is the organiser&apos;s view, read only. Open any guest to see the three people they were told
            to meet, why, and a first question to ask.
          </p>
          <ul className="mt-6 divide-y divide-zinc-200 rounded-2xl border border-zinc-200">
            {rows.map((row) => (
              <li key={row.href}>
                <Link
                  href={row.href}
                  className="flex items-center gap-4 px-4 py-4 hover:bg-zinc-50 sm:px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                    {row.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{row.name}</span>
                    {row.role ? <span className="block text-sm text-zinc-500">{row.role}</span> : null}
                  </span>
                  <span className="hidden shrink-0 text-sm font-medium text-zinc-900 sm:inline">
                    See their hellos
                  </span>
                  <span aria-hidden className="shrink-0 text-zinc-500 sm:hidden">
                    &rsaquo;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-3xl bg-zinc-900 px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Try it with your own guests</h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-zinc-300">
            Free up to 15 guests, €29 for up to 150. No account needed.
          </p>
          <Link
            href={cta.primary.href}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 text-base font-medium text-zinc-900 hover:bg-lime-200"
          >
            {cta.primary.label}
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
