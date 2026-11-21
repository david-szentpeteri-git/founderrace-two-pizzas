import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

// Internal traction numbers (plan D8). Needs ?key=STATS_KEY. Counts real use
// only: events with plan "test" or "demo" and their guests are left out.
// Visitors come from Vercel Analytics, payments are cross-checked in Stripe.

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Stats", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

type EventLite = { id: string; name: string; plan: string; status: string; amount_paid_cents: number | null; created_at: string };

export default async function StatsPage({ searchParams }: Props) {
  const { key } = await searchParams;
  if (!process.env.STATS_KEY || key !== process.env.STATS_KEY) notFound();

  const { data: eventsData, error } = await db()
    .from("events")
    .select("id, name, plan, status, amount_paid_cents, created_at")
    .not("plan", "in", "(test,demo)")
    .order("created_at", { ascending: true });
  if (error) throw error;
  const events = (eventsData as EventLite[]) ?? [];
  const ids = events.map((e) => e.id);

  let guests = 0;
  let guestsWithHellos = 0;
  if (ids.length > 0) {
    const { count } = await db().from("guests").select("id", { count: "exact", head: true }).in("event_id", ids);
    guests = count ?? 0;
    const { data: m } = await db().from("matches").select("guest_id").in("event_id", ids);
    guestsWithHellos = new Set((m ?? []).map((r: { guest_id: string }) => r.guest_id)).size;
  }

  const paid = events.filter((e) => e.plan === "paid");
  const revenue = paid.reduce((sum, e) => sum + (e.amount_paid_cents ?? 0), 0) / 100;
  const generatedAt = new Date().toISOString();

  const rows: Array<[string, string | number]> = [
    ["Events created by organisers", events.length],
    ["Events with intros made", events.filter((e) => e.status === "matched").length],
    ["Guests joined", guests],
    ["Guests with three hellos", guestsWithHellos],
    ["Paying organisers", paid.length],
    ["Revenue (database, check in Stripe)", `€${revenue.toFixed(2)}`],
    ["Pilot events (free, ours)", events.filter((e) => e.plan === "pilot").length],
  ];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 text-zinc-900 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Traction</h1>
      <p className="mt-2 text-sm text-zinc-500">
        Real use only (test and demo events left out). Generated {generatedAt} UTC. Visitors: Vercel Analytics.
      </p>
      <table className="mt-8 w-full text-left">
        <tbody className="divide-y divide-zinc-100">
          {rows.map(([label, value]) => (
            <tr key={label}>
              <td className="py-3 text-zinc-500">{label}</td>
              <td className="py-3 text-right text-xl font-semibold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="mt-12 text-lg font-semibold">Events</h2>
      <ul className="mt-3 divide-y divide-zinc-100 text-sm">
        {events.map((e) => (
          <li key={e.id} className="flex justify-between gap-3 py-2">
            <span className="truncate">{e.name}</span>
            <span className="shrink-0 text-zinc-500">
              {e.plan} · {e.status} · {e.created_at.slice(0, 16).replace("T", " ")}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
