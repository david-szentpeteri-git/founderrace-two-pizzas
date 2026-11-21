import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { AutoRefresh, ConfirmSubmit, CopyButton, SubmitButton } from "@/components/organiser/client";
import { ButtonLink } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { getAdminView } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { FREE_GUEST_LIMIT, MIN_GUESTS_TO_MATCH, PAID_GUEST_LIMIT, siteUrl } from "@/lib/site";
import { formatEventDate } from "@/lib/utils";
import { generateIntrosAction, removeGuestAction, startCheckoutAction } from "./actions";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // matching a big room can take a minute

export const metadata: Metadata = {
  title: "Organiser dashboard",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Props = {
  params: Promise<{ adminToken: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ERRORS: Record<string, string> = {
  limit: `This event has more guests than the free plan covers. Upgrade it to make intros for everyone.`,
  generate: "Something went wrong while making the intros. Please try again.",
  checkout: "We couldn't open the payment page. Please try again in a moment.",
  alreadypaid: "This event is already upgraded.",
  demo: "This is the sample event, so it can't be changed. Create your own event to try everything.",
  remove: "We couldn't remove that guest just now. Please try again.",
};

export default async function OrganiserPage({ params, searchParams }: Props) {
  const { adminToken } = await params;
  const query = await searchParams;
  const view = hasDatabase() ? await getAdminView(adminToken) : null;

  if (!view) {
    return (
      <div className="min-h-screen bg-white text-zinc-900">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight">We can&apos;t find this event</h1>
          <p className="mt-3 text-lg text-zinc-500">
            Check that you opened the full organiser link. It is the link you saw right after creating the event.
          </p>
          <div className="mt-8">
            <ButtonLink href="/new" size="lg">
              Create an event
            </ButtonLink>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { event, guests } = view;
  const joinUrl = `${siteUrl()}/e/${event.slug}`;
  const dashboardUrl = `${siteUrl()}/o/${adminToken}`;
  const qrSvg = await QRCode.toString(joinUrl, { type: "svg", margin: 1, width: 240 });
  const qrDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`;

  const count = guests.length;
  const overLimit = count > view.guestLimit;
  const withoutHellos = guests.filter((g) => g.helloCount < 3).length;
  const allNew = guests.filter((g) => g.helloCount < 3).every((g) => g.helloCount === 0);
  const removed = typeof query.removed === "string" ? query.removed : null;
  const matched = event.status === "matched";
  // Test events (ours) follow the free plan rules so the whole flow can be rehearsed.
  const isFree = view.plan === "free" || (view.plan === "test" && !view.paidAt);
  const when = formatEventDate(event.startsAt, event.timeZone);
  const error = typeof query.error === "string" ? ERRORS[query.error] : undefined;
  const done = typeof query.done === "string" ? Number(query.done) : null;
  const checkoutNote =
    query.checkout === "cancelled"
      ? "Payment cancelled. Your event is still on the free plan, nothing was charged."
      : query.checkout === "pending"
        ? "Your payment is still being confirmed. Refresh this page in a minute."
        : undefined;
  const mailto = `mailto:${view.organiserEmail}?subject=${encodeURIComponent(`Your Three Hellos links for ${event.name}`)}&body=${encodeURIComponent(
    `Your private organiser dashboard (keep it to yourself):
${dashboardUrl}

Join link to share with guests:
${joinUrl}
`,
  )}`;

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <AutoRefresh seconds={10} />
      <main className="mx-auto max-w-5xl space-y-8 px-4 pb-20 pt-10 sm:px-6">
        <div>
          <p className="text-sm font-medium text-zinc-500">Organiser dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{event.name}</h1>
          <p className="mt-2 text-zinc-500">
            {[when, event.place].filter(Boolean).join(" · ") || "No date or place set"}
            {" · "}
            {view.plan === "paid" ? "Paid, up to 150 guests" : view.plan === "pilot" ? "Pilot event" : view.plan === "demo" ? "Sample event" : view.plan === "test" ? (view.paidAt ? "Test event, test payment done" : "Test event, free plan rules") : `Free plan, up to ${FREE_GUEST_LIMIT} guests`}
          </p>
          {query.new !== "1" ? (
            <p className="mt-2 text-sm text-zinc-500">
              This page is your private organiser link. Bookmark it or{" "}
              <a href={mailto} className="font-medium text-zinc-900 underline underline-offset-4">
                email it to yourself
              </a>
              .
            </p>
          ) : null}
        </div>

        {query.new === "1" ? (
          <Card className="bg-lime-50 ring-lime-300">
            <h2 className="text-lg font-semibold">Your event is ready. Save this page.</h2>
            <p className="mt-1 text-sm text-zinc-800">
              This private link is how you get back to your dashboard. Anyone with it can manage the event, so keep it to
              yourself.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <code className="truncate rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-zinc-200">{dashboardUrl}</code>
              <CopyButton text={dashboardUrl} label="Copy organiser link" />
              <a href={mailto} className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-900">
                Email it to myself
              </a>
            </div>
          </Card>
        ) : null}

        {query.paid === "1" ? (
          <Card className="bg-lime-50 ring-lime-300">
            <h2 className="text-lg font-semibold">Payment received. Thank you.</h2>
            <p className="mt-1 text-sm text-zinc-800">Your event now takes up to {PAID_GUEST_LIMIT} guests. Stripe has emailed you a receipt.</p>
          </Card>
        ) : null}

        {error ? <p className="rounded-2xl bg-red-50 p-4 text-base font-medium text-red-700">{error}</p> : null}
        {removed ? (
          <p className="rounded-2xl bg-zinc-50 p-4 text-base font-medium text-zinc-900 ring-1 ring-zinc-200">
            Guest #{removed} removed.{matched ? " Anyone who had them in their three can get a new match with \"Update intros\"." : ""}
          </p>
        ) : null}
        {checkoutNote ? (
          <p className="rounded-2xl bg-zinc-50 p-4 text-base font-medium text-zinc-900 ring-1 ring-zinc-200">{checkoutNote}</p>
        ) : null}
        {done !== null && !Number.isNaN(done) ? (
          <p className="rounded-2xl bg-lime-50 p-4 text-base font-medium text-lime-950 ring-1 ring-lime-300">
            {done === 0 ? "Everyone already has their three hellos." : `Done: ${done} guest${done === 1 ? "" : "s"} now ${done === 1 ? "has" : "have"} their three hellos.`}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Share */}
          <Card className="lg:col-span-2">
            <h2 className="text-lg font-semibold">1. Share the join link</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Post it in your group chat, or show the QR code on a screen at the door. Guests answer four quick questions
              on their phone.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR code for ${joinUrl}`} width={200} height={200} className="mx-auto mt-5" />
            <div className="mt-4 flex flex-col gap-2">
              <code className="truncate rounded-xl bg-zinc-50 px-3 py-2 text-sm ring-1 ring-zinc-200">{joinUrl}</code>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={joinUrl} label="Copy join link" />
                <a href={qrDataUrl} download={`three-hellos-${event.slug}.svg`} className="inline-flex items-center rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium hover:border-zinc-900">
                  Download QR
                </a>
                <Link href={`/o/${adminToken}/poster`} className="inline-flex items-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700">
                  Print door poster
                </Link>
                <Link href={`/e/${event.slug}`} className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium underline-offset-4 hover:underline">
                  Open join page
                </Link>
              </div>
            </div>
          </Card>

          {/* Intros */}
          <Card className="lg:col-span-3">
            <h2 className="text-lg font-semibold">2. Make the intros</h2>
            <p className="mt-1 text-sm text-zinc-500">
              When most guests have joined, press the button. Every guest gets three people to meet, why, and a first
              question. It takes about half a minute.
            </p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight">{count}</span>
              <span className="text-zinc-500">
                guest{count === 1 ? "" : "s"} joined{isFree ? ` · free up to ${view.guestLimit}` : ""}
              </span>
            </div>

            {overLimit && isFree ? (
              <div className="mt-5 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
                <p className="font-semibold">
                  {count} guests are waiting for their intros. The free plan covers {view.guestLimit}.
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Upgrade this event for €29 to make intros for up to {PAID_GUEST_LIMIT} guests. One payment, no
                  subscription.
                </p>
                <form action={startCheckoutAction.bind(null, adminToken)} className="mt-4">
                  <SubmitButton pendingLabel="Opening payment...">Upgrade for €29</SubmitButton>
                </form>
              </div>
            ) : count < MIN_GUESTS_TO_MATCH ? (
              <p className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
                You need at least {MIN_GUESTS_TO_MATCH} guests before intros can be made. Share the link above.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {!matched ? (
                  <form action={generateIntrosAction.bind(null, adminToken, "all")}>
                    <SubmitButton pendingLabel="Making intros, about 30 seconds...">Make intros for {count} guests</SubmitButton>
                  </form>
                ) : (
                  <>
                    {withoutHellos > 0 ? (
                      <form action={generateIntrosAction.bind(null, adminToken, "new")}>
                        <SubmitButton pendingLabel="Matching new arrivals...">
                          {allNew
                            ? `Match ${withoutHellos} new arrival${withoutHellos === 1 ? "" : "s"}`
                            : `Update intros for ${withoutHellos} guest${withoutHellos === 1 ? "" : "s"}`}
                        </SubmitButton>
                      </form>
                    ) : null}
                    <form action={generateIntrosAction.bind(null, adminToken, "all")}>
                      <SubmitButton variant="secondary" pendingLabel="Making intros again...">
                        Redo intros for everyone
                      </SubmitButton>
                    </form>
                    <ButtonLink href={`/print/${adminToken}`} variant="secondary" size="lg">
                      Print badges and cards
                    </ButtonLink>
                  </>
                )}
              </div>
            )}

            {isFree && !overLimit ? (
              <form action={startCheckoutAction.bind(null, adminToken)} className="mt-4 text-sm text-zinc-500">
                Expecting more than {view.guestLimit} guests?{" "}
                <button type="submit" className="font-medium text-zinc-900 underline underline-offset-4">
                  Upgrade for €29
                </button>{" "}
                for up to {PAID_GUEST_LIMIT}.
              </form>
            ) : null}
          </Card>
        </div>

        {/* Guests */}
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Guests</h2>
            <span className="text-sm text-zinc-500">Updates by itself</span>
          </div>
          {count === 0 ? (
            <p className="mt-4 text-zinc-500">Nobody has joined yet. Share the join link to get started.</p>
          ) : (
            <ul className="mt-4 divide-y divide-zinc-100">
              {guests
                .slice()
                .reverse()
                .map((g) => (
                  <li key={g.number} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">
                        <Pill className="mr-2">#{g.number}</Pill>
                        {g.name}
                      </p>
                      <p className="truncate text-sm text-zinc-500">
                        {g.role}
                        {g.interests.length ? ` · ${g.interests.join(", ")}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-4">
                      <Link href={`/g/${g.token}`} className="text-sm font-medium underline-offset-4 hover:underline">
                        {g.helloCount > 0 ? "See their hellos" : "Their page"}
                      </Link>
                      {view.plan !== "demo" ? (
                        <form action={removeGuestAction.bind(null, adminToken, g.number)}>
                          <ConfirmSubmit confirmText={`Remove ${g.name} (#${g.number}) from this event? Their answers and intros are deleted.`}>
                            Remove
                          </ConfirmSubmit>
                        </form>
                      ) : null}
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
