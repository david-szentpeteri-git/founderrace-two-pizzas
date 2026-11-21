import type { Metadata } from "next";
// Data source for the guest route. Switch to "@/lib/data" at integration.
import { getGuestView } from "@/lib/data";
import { HelloCard } from "@/components/guest/HelloCard";
import { Marker } from "@/components/guest/Marker";
import { GuestNotFound } from "@/components/guest/NotFound";
import { formatEventTime } from "@/components/guest/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Your three hellos",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function GuestPage({ params }: Props) {
  const { token } = await params;
  const view = await getGuestView(token);

  if (!view) {
    return (
      <GuestNotFound
        title="We can’t find this guest page"
        body="Check that you opened the full link. If you joined from another device, open the link you saved there."
      />
    );
  }

  const { event, guest, wantsToMeetYou } = view;
  const hellos = [...view.hellos].sort((a, b) => a.rank - b.rank);
  const when = formatEventTime(event.startsAt);
  const selfHref = `/g/${encodeURIComponent(token)}`;

  return (
    <main className="mx-auto min-h-dvh max-w-md bg-white px-6 pb-20 pt-10 text-zinc-900">
      <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">Three Hellos</p>

      <header className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">{event.name}</h1>
          <p className="mt-2 text-base text-zinc-500">
            {[when, event.place].filter(Boolean).join(" · ") || `Hosted by ${event.organiserName}`}
          </p>
        </div>
      </header>

      <section className="mt-8 flex items-center gap-5 rounded-3xl bg-zinc-900 p-6 text-white">
        <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-lime-300 text-zinc-900">
          <span className="text-xs font-medium uppercase tracking-wider">Badge</span>
          <span className="text-4xl font-semibold leading-none">{guest.number}</span>
        </div>
        <div className="min-w-0">
          <p className="text-xl font-semibold">{guest.name}</p>
          <p className="mt-1 text-base text-zinc-400">{guest.role}</p>
        </div>
      </section>

      {hellos.length === 0 ? (
        <section className="mt-10">
          {event.status === "matched" ? (
            <>
              <h2 className="text-2xl font-semibold leading-snug tracking-tight">
                Intros for this event went out before you joined.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-zinc-500">
                Let {event.organiserName} know you’ve joined, then check back here for your three hellos.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold leading-snug tracking-tight">
                You’re guest <Marker>#{guest.number}</Marker>.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-zinc-500">
                Your three hellos appear here when {event.organiserName} opens the doors.
              </p>
            </>
          )}

          <div className="mt-8 rounded-3xl bg-zinc-50 p-6">
            <p className="text-base font-medium">Keep this page</p>
            <p className="mt-1 text-base leading-relaxed text-zinc-500">
              Bookmark it or add it to your home screen. This link is yours, and it’s how you get back
              here.
            </p>
          </div>

          <a
            href={selfHref}
            className="mt-8 flex min-h-14 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-lg font-medium text-white"
          >
            Check for my hellos
          </a>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold leading-snug tracking-tight">
            Your <Marker>three hellos</Marker>
          </h2>
          <p className="mt-2 text-base text-zinc-500">
            Look for their badge numbers. Start with the first one.
          </p>
          <div className="mt-6 space-y-5">
            {hellos.map((hello) => (
              <HelloCard key={`${hello.rank}-${hello.number}`} hello={hello} />
            ))}
          </div>
        </section>
      )}

      {wantsToMeetYou.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">They’d like to meet you</h2>
          <p className="mt-1 text-base text-zinc-500">These guests have you on their list, so expect a hello.</p>
          <ul className="mt-4 divide-y divide-zinc-200 rounded-2xl border border-zinc-200">
            {wantsToMeetYou.map((person) => (
              <li key={person.number} className="flex items-center justify-between gap-4 px-4 py-3 text-base">
                <span className="min-w-0 truncate">{person.name}</span>
                <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
                  Badge {person.number}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-16 text-center text-sm text-zinc-500">
        Hosted by {event.organiserName}. Your email is never shown to other guests.
      </p>
    </main>
  );
}
