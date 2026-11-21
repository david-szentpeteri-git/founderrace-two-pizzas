import type { Metadata } from "next";
// Data source for the guest route. Switch to "@/lib/data" at integration.
import { getGuestView } from "@/lib/data";
import { HelloCard } from "@/components/guest/HelloCard";
import { Marker } from "@/components/guest/Marker";
import { GuestNotFound } from "@/components/guest/NotFound";
import { formatEventTime } from "@/components/guest/format";
import { BrandLine, MadeWith } from "@/components/guest/BrandLine";

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
  const when = formatEventTime(event.startsAt, event.timeZone);
  const selfHref = `/g/${encodeURIComponent(token)}`;

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md bg-white px-5 pb-12 pt-6 text-zinc-900 sm:px-6">
      <BrandLine />

      <header className="mt-8 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{event.name}</h1>
          <p className="mt-2 text-base text-zinc-500">
            {[when, event.place].filter(Boolean).join(" · ") || `Hosted by ${event.organiserName}`}
          </p>
        </div>
      </header>

      <section className="mt-6 flex items-center gap-4 rounded-3xl bg-zinc-900 p-5 text-white sm:gap-5 sm:p-6">
        <div className="flex size-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-lime-300 text-zinc-900">
          <span className="text-[11px] font-medium uppercase tracking-wider">Badge</span>
          <span className="mt-0.5 font-display text-4xl font-semibold leading-none">{guest.number}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">This is you</p>
          <p className="mt-0.5 break-words font-display text-xl font-semibold tracking-tight">{guest.name}</p>
          {guest.role ? <p className="mt-1 text-base text-zinc-300">{guest.role}</p> : null}
        </div>
      </section>

      {hellos.length === 0 ? (
        <section className="mt-10">
          {event.status === "matched" ? (
            <>
              <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight">
                Intros for this event went out before you joined.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-zinc-500">
                Let {event.organiserName} know you’ve joined, then check back here for your three hellos.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight">
                You’re guest <Marker>#{guest.number}</Marker>.
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-zinc-500">
                Your three hellos appear here when {event.organiserName} opens the doors.
              </p>
            </>
          )}

          <div className="mt-8 flex gap-4 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
            <span aria-hidden="true" className="mt-1 size-2.5 shrink-0 rounded-full bg-lime-400" />
            <div>
            <p className="text-base font-medium">Save this link</p>
            <p className="mt-1 text-base leading-relaxed text-zinc-500">
              Bookmark it or add it to your home screen. This link is yours, and it’s how you get back
              here.
            </p>
            </div>
          </div>

          <a
            href={selfHref}
            className="mt-8 flex min-h-14 w-full items-center justify-center rounded-full bg-zinc-900 px-6 text-lg font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Check for my hellos
          </a>
        </section>
      ) : (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold leading-snug tracking-tight">
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
          <p className="mt-6 flex gap-3 rounded-2xl bg-zinc-50 px-5 py-4 text-sm leading-relaxed text-zinc-500 ring-1 ring-zinc-200">
            <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-lime-400" />
            <span>
              <span className="font-medium text-zinc-900">Save this link.</span> Bookmark it so you can open
              your hellos again during the event.
            </span>
          </p>
        </section>
      )}

      {wantsToMeetYou.length > 0 && (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold tracking-tight">They’d like to meet you</h2>
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
      <MadeWith />
    </main>
  );
}
