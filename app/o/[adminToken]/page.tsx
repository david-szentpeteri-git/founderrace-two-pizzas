import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { AutoRefresh, ConfirmSubmit, CopyButton, SubmitButton } from "@/components/organiser/client";
import { ButtonLink, buttonClass } from "@/components/ui/button";
import { Card, Pill } from "@/components/ui/card";
import { getAdminView } from "@/lib/data";
import { hasDatabase } from "@/lib/db";
import { FREE_GUESTS, PASS_DAYS, PASS_PRICE_CENTS, euros, guestTopUp } from "@/lib/pricing";
import { MIN_GUESTS_TO_MATCH, siteUrl } from "@/lib/site";
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
  // Organisers can pay on their own events; test events (ours) follow the same rules so the flow can be rehearsed.
  const canPay = view.plan === "free" || view.plan === "paid" || view.plan === "test";
  const hasPass = Boolean(view.passUntil);
  const passEnds = view.passUntil ? formatEventDate(view.passUntil, event.timeZone) : null;
  // What paying for the waiting guests costs now (2 cents each above what is covered, at least €1).
  const topUp = guestTopUp(count, view.coveredLimit);
  const planLabel = hasPass
    ? `Unlimited pass until ${passEnds}`
    : view.plan === "pilot"
      ? "Pilot event"
      : view.plan === "demo"
        ? "Sample event"
        : view.coveredLimit > FREE_GUESTS
          ? `Paid, up to ${view.coveredLimit} guests${view.plan === "test" ? " (test)" : ""}`
          : `Free up to ${FREE_GUESTS} guests${view.plan === "test" ? " (test)" : ""}`;
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
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{event.name}</h1>
          <p className="mt-2 text-zinc-500">
            {[when, event.place].filter(Boolean).join(" · ") || "No date or place set"}
            {" · "}
            {planLabel}
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
              <code translate="no" className="block min-w-0 max-w-full truncate rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-zinc-200">{dashboardUrl}</code>
              <CopyButton text={dashboardUrl} label="Copy organiser link" />
              <a href={mailto} className={buttonClass({ variant: "secondary" })}>
                Email it to myself
              </a>
            </div>
          </Card>
        ) : null}

        {query.paid === "1" ? (
          <Card className="bg-lime-50 ring-lime-300">
            <h2 className="text-lg font-semibold">Payment received. Thank you.</h2>
            <p className="mt-1 text-sm text-zinc-800">
              {hasPass
                ? `Every event you create with ${view.organiserEmail} has unlimited guests until ${passEnds}.`
                : `This event now takes up to ${view.guestLimit} guests.`}{" "}
              Stripe has emailed you a receipt.
            </p>
          </Card>
        ) : null}

        {error ? (
          <p role="alert" className="rounded-2xl bg-red-50 p-4 text-base font-medium text-red-700">
            {error}
          </p>
        ) : null}
        {removed ? (
          <p role="status" className="rounded-2xl bg-zinc-50 p-4 text-base font-medium text-zinc-900 ring-1 ring-zinc-200">
            Guest #{removed} removed.{matched ? " Anyone who had them in their three can get a new match with “Update intros”." : ""}
          </p>
        ) : null}
        {checkoutNote ? (
          <p role="status" className="rounded-2xl bg-zinc-50 p-4 text-base font-medium text-zinc-900 ring-1 ring-zinc-200">{checkoutNote}</p>
        ) : null}
        {done !== null && !Number.isNaN(done) ? (
          <p role="status" className="rounded-2xl bg-lime-50 p-4 text-base font-medium text-lime-950 ring-1 ring-lime-300">
            {done === 0 ? "Everyone already has their three hellos." : `Done: ${done} guest${done === 1 ? "" : "s"} now ${done === 1 ? "has" : "have"} their three hellos.`}
          </p>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Share */}
          <Card className="min-w-0 lg:col-span-2">
            <h2 className="text-lg font-semibold">1. Share the join link</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Post it in your group chat, or show the QR code on a screen at the door. Guests answer four quick questions
              on their phone.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt={`QR code for ${joinUrl}`} width={200} height={200} className="mx-auto mt-5" />
            <div className="mt-4 flex flex-col gap-2">
              <code translate="no" className="block max-w-full truncate rounded-xl bg-zinc-50 px-3 py-2 text-sm ring-1 ring-zinc-200">{joinUrl}</code>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={joinUrl} label="Copy join link" />
                <a href={qrDataUrl} download={`three-hellos-${event.slug}.svg`} className={buttonClass({ variant: "secondary" })}>
                  Download QR
                </a>
                <Link href={`/o/${adminToken}/poster`} className={buttonClass()}>
                  Print door poster
                </Link>
                <Link href={`/e/${event.slug}`} className={buttonClass({ variant: "ghost" })}>
                  Open join page
                </Link>
              </div>
            </div>
          </Card>

          {/* Intros */}
          <Card className="min-w-0 lg:col-span-3">
            <h2 className="text-lg font-semibold">2. Make the intros</h2>
            <p className="mt-1 text-sm text-zinc-500">
              When most guests have joined, press the button. Every guest gets three people to meet, why, and a first
              question. It takes about half a minute.
            </p>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tabular-nums tracking-tight">{count}</span>
              <span className="text-zinc-500">
                guest{count === 1 ? "" : "s"} joined{!hasPass && canPay ? ` · covered up to ${view.guestLimit}` : ""}
              </span>
            </div>

            {overLimit && canPay ? (
              <div className="mt-5 rounded-2xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
                <p className="font-semibold">
                  {count} guests are waiting for their intros. This event covers {view.guestLimit}.
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  {topUp.extraGuests} more guest{topUp.extraGuests === 1 ? "" : "s"} at 2 cents each, at least €1, covers
                  up to {topUp.newLimit}. Or {euros(PASS_PRICE_CENTS)} once for {PASS_DAYS} days of unlimited events.
                  No subscription.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <form action={startCheckoutAction.bind(null, adminToken, "guests")}>
                    <SubmitButton pendingLabel="Opening payment…">
                      Pay {euros(topUp.cents)} for {topUp.extraGuests} guest{topUp.extraGuests === 1 ? "" : "s"}
                    </SubmitButton>
                  </form>
                  <form action={startCheckoutAction.bind(null, adminToken, "pass")}>
                    <SubmitButton variant="secondary" pendingLabel="Opening payment…">
                      Unlimited for {PASS_DAYS} days, {euros(PASS_PRICE_CENTS)}
                    </SubmitButton>
                  </form>
                </div>
              </div>
            ) : count < MIN_GUESTS_TO_MATCH ? (
              <p className="mt-5 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600 ring-1 ring-zinc-200">
                You need at least {MIN_GUESTS_TO_MATCH} guests before intros can be made. Share the link above.
              </p>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {!matched ? (
                  <form action={generateIntrosAction.bind(null, adminToken, "all")}>
                    <SubmitButton pendingLabel="Making intros, about 30 seconds…">Make intros for {count} guests</SubmitButton>
                  </form>
                ) : (
                  <>
                    {withoutHellos > 0 ? (
                      <form action={generateIntrosAction.bind(null, adminToken, "new")}>
                        <SubmitButton pendingLabel="Matching new arrivals…">
                          {allNew
                            ? `Match ${withoutHellos} new arrival${withoutHellos === 1 ? "" : "s"}`
                            : `Update intros for ${withoutHellos} guest${withoutHellos === 1 ? "" : "s"}`}
                        </SubmitButton>
                      </form>
                    ) : null}
                    <form action={generateIntrosAction.bind(null, adminToken, "all")}>
                      <SubmitButton
                        variant="secondary"
                        pendingLabel="Making intros again…"
                        confirmText="Make new intros for everyone? Guests who already opened their page will see different names."
                      >
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

            {canPay && !hasPass && !overLimit ? (
              <form action={startCheckoutAction.bind(null, adminToken, "pass")} className="mt-4 text-sm text-zinc-500">
                Free up to {FREE_GUESTS} guests. Above that, 2 cents a guest (at least €1), or{" "}
                <button type="submit" className="font-medium text-zinc-900 underline underline-offset-4">
                  {euros(PASS_PRICE_CENTS)} for {PASS_DAYS} days of unlimited events
                </button>
                .
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
