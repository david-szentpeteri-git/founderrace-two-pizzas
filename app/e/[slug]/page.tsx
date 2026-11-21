import type { Metadata } from "next";
import { getEventBySlug } from "./source";
import { JoinForm } from "@/components/guest/JoinForm";
import { Marker } from "@/components/guest/Marker";
import { GuestNotFound } from "@/components/guest/NotFound";
import { formatEventTime } from "@/components/guest/format";
import { joinAction } from "./actions";
import { BrandLine, MadeWith } from "@/components/guest/BrandLine";
import m from "@/components/guest/motion";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  return {
    title: event ? `Join ${event.name}` : "Event not found",
    robots: { index: false },
  };
}

export default async function JoinPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return (
      <GuestNotFound
        title="We can’t find this event"
        body="The link may be mistyped or the event may have been removed. Ask the organiser for the link again."
      />
    );
  }

  const when = formatEventTime(event.startsAt, event.timeZone);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-md px-5 pb-12 pt-6 text-zinc-900 sm:px-6">
      <BrandLine />

      <header className={`${m.enter} mt-8`}>
        <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{event.name}</h1>
        <dl className="mt-4 space-y-1 text-base text-zinc-500">
          {when && (
            <div>
              <dt className="sr-only">When</dt>
              <dd>{when}</dd>
            </div>
          )}
          {event.place && (
            <div>
              <dt className="sr-only">Where</dt>
              <dd>{event.place}</dd>
            </div>
          )}
          <div>
            <dt className="sr-only">Organiser</dt>
            <dd>Hosted by {event.organiserName}</dd>
          </div>
        </dl>
        {event.description && <p className="mt-4 text-base leading-relaxed">{event.description}</p>}
      </header>

      <section className={`${m.enterLate} mt-8 rounded-3xl bg-zinc-50 p-6 ring-1 ring-zinc-200`}>
        <p className="text-lg leading-relaxed">
          Answer a few short questions and we’ll suggest the <Marker>three people</Marker> you should say
          hello to at this event, with a first question for each.
        </p>
        {event.guestCount > 0 && (
          <p className="mt-3 text-sm text-zinc-500">
            {event.guestCount === 1 ? "1 guest has" : `${event.guestCount} guests have`} joined so far.
          </p>
        )}
      </section>

      <div className="mt-10">
        <JoinForm slug={event.slug} action={joinAction} />
      </div>

      <MadeWith />
    </main>
  );
}
