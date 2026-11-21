import { db, hasDatabase } from "@/lib/db";

// Called once a day by Vercel Cron (vercel.json). Supabase pauses free projects
// after 7 days without database activity; this tiny query keeps the database
// awake so the jury can open the site long after the race. It reads nothing
// sensitive and returns no data.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!hasDatabase()) return Response.json({ ok: false, reason: "no database configured" }, { status: 503 });
  const { error } = await db().from("events").select("id", { count: "exact", head: true });
  if (error) return Response.json({ ok: false }, { status: 500 });
  return Response.json({ ok: true, at: new Date().toISOString() });
}
