import "server-only";
import { db, hasDatabase } from "./db";
import * as mock from "./mock";
import { FREE_GUEST_LIMIT } from "./site";
import { newSlug, newToken } from "./tokens";
import type {
  AdminView,
  BadgeCard,
  CreateEventInput,
  DemoData,
  EventPublic,
  GuestView,
  Hello,
  JoinInput,
  Plan,
  PrintData,
} from "./types";

// Server-only data functions (docs/plan.md 5.6). Daniel's pages use the first
// five; the organiser pages use the rest. Without Supabase keys the page
// functions fall back to lib/mock.ts so the site still renders in development.

// ---------- Row shapes (snake_case, as stored) ----------

export type EventRow = {
  id: string;
  slug: string;
  admin_token: string;
  name: string;
  starts_at: string | null;
  time_zone: string | null;
  place: string | null;
  description: string | null;
  organiser_name: string;
  organiser_email: string;
  plan: Plan;
  guest_limit: number;
  stripe_session_id: string | null;
  amount_paid_cents: number | null;
  paid_at: string | null;
  status: "collecting" | "matched";
  matched_at: string | null;
  created_at: string;
};

export type GuestRow = {
  id: string;
  event_id: string;
  token: string;
  number: number;
  name: string;
  email: string | null;
  role: string;
  interests: string[];
  looking_for: string | null;
  ask_me_about: string | null;
  created_at: string;
};

export type MatchRow = {
  guest_id: string;
  match_guest_id: string;
  rank: number;
  reason: string;
  opener: string;
  source: "ai" | "fallback";
};

const GUEST_PUBLIC_COLUMNS = "id, event_id, token, number, name, email, role, interests, looking_for, ask_me_about, created_at";

// ---------- Helpers ----------

function toEventPublic(row: EventRow, guestCount: number): EventPublic {
  return {
    slug: row.slug,
    name: row.name,
    startsAt: row.starts_at,
    timeZone: row.time_zone,
    place: row.place,
    description: row.description,
    organiserName: row.organiser_name,
    guestCount,
    status: row.status,
    isDemo: row.plan === "demo",
  };
}

async function eventBy(column: "slug" | "admin_token" | "id", value: string): Promise<EventRow | null> {
  if (!value) return null;
  const { data, error } = await db().from("events").select("*").eq(column, value).maybeSingle();
  if (error) throw error;
  return (data as EventRow | null) ?? null;
}

async function guestCount(eventId: string): Promise<number> {
  const { count, error } = await db()
    .from("guests")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);
  if (error) throw error;
  return count ?? 0;
}

export async function eventGuests(eventId: string): Promise<GuestRow[]> {
  const { data, error } = await db()
    .from("guests")
    .select(GUEST_PUBLIC_COLUMNS)
    .eq("event_id", eventId)
    .order("number", { ascending: true });
  if (error) throw error;
  return (data as GuestRow[]) ?? [];
}

export async function eventMatches(eventId: string): Promise<MatchRow[]> {
  const { data, error } = await db()
    .from("matches")
    .select("guest_id, match_guest_id, rank, reason, opener, source")
    .eq("event_id", eventId)
    .order("rank", { ascending: true });
  if (error) throw error;
  return (data as MatchRow[]) ?? [];
}

/** Builds each guest's hellos from the event's matches, with the mutual flag. */
function hellosFor(guestId: string, matches: MatchRow[], byId: Map<string, GuestRow>): Hello[] {
  const picks = new Set(matches.map((m) => `${m.guest_id}>${m.match_guest_id}`));
  return matches
    .filter((m) => m.guest_id === guestId)
    .sort((a, b) => a.rank - b.rank)
    .flatMap((m) => {
      const other = byId.get(m.match_guest_id);
      if (!other) return [];
      return [
        {
          rank: m.rank as 1 | 2 | 3,
          name: other.name,
          number: other.number,
          role: other.role,
          askMeAbout: other.ask_me_about,
          reason: m.reason,
          opener: m.opener,
          mutual: picks.has(`${m.match_guest_id}>${guestId}`),
        },
      ];
    });
}

// ---------- Guest-facing (Daniel's pages) ----------

export async function getEventBySlug(slug: string): Promise<EventPublic | null> {
  if (!hasDatabase()) return mock.getEventBySlug(slug);
  const event = await eventBy("slug", slug);
  if (!event) return null;
  return toEventPublic(event, await guestCount(event.id));
}

export async function joinEvent(slug: string, input: JoinInput): Promise<{ guestToken: string }> {
  if (!hasDatabase()) return mock.joinEvent(slug, input);

  // A double tap or a retry on a slow phone must not create the same guest twice:
  // same event, same name and role within two minutes returns the first entry.
  const event = await eventBy("slug", slug);
  if (event) {
    const since = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    const { data: recent, error: recentError } = await db()
      .from("guests")
      .select("token, name, role")
      .eq("event_id", event.id)
      .gte("created_at", since);
    if (recentError) throw recentError;
    const norm = (t: string) => t.trim().toLowerCase().replace(/\s+/g, " ");
    const twin = (recent as Array<{ token: string; name: string; role: string }> | null)?.find(
      (g) => norm(g.name) === norm(input.name) && norm(g.role) === norm(input.role),
    );
    if (twin) return { guestToken: twin.token };
  }

  const token = newToken();
  const { error } = await db().rpc("join_event", {
    p_slug: slug,
    p_token: token,
    p_name: input.name,
    p_email: input.email ?? "",
    p_role: input.role,
    p_interests: input.interests.slice(0, 3),
    p_looking_for: input.lookingFor ?? "",
    p_ask_me_about: input.askMeAbout ?? "",
  });
  if (error) throw error;
  return { guestToken: token };
}

export async function getGuestView(token: string): Promise<GuestView | null> {
  if (!hasDatabase()) return mock.getGuestView(token);
  if (!token) return null;
  const { data, error } = await db().from("guests").select(GUEST_PUBLIC_COLUMNS).eq("token", token).maybeSingle();
  if (error) throw error;
  const guest = data as GuestRow | null;
  if (!guest) return null;

  const event = await eventBy("id", guest.event_id);
  if (!event) return null;
  const [guests, matches] = await Promise.all([eventGuests(event.id), eventMatches(event.id)]);
  const byId = new Map(guests.map((g) => [g.id, g]));

  const wantsToMeetYou = matches
    .filter((m) => m.match_guest_id === guest.id)
    .map((m) => byId.get(m.guest_id))
    .filter((g): g is GuestRow => Boolean(g))
    .map((g) => ({ name: g.name, number: g.number }));

  return {
    event: toEventPublic(event, guests.length),
    guest: { name: guest.name, number: guest.number, role: guest.role },
    hellos: hellosFor(guest.id, matches, byId),
    wantsToMeetYou,
  };
}

export async function getPrintData(adminToken: string): Promise<PrintData | null> {
  if (!hasDatabase()) return mock.getPrintData(adminToken);
  const event = await eventBy("admin_token", adminToken);
  if (!event) return null;
  const [guests, matches] = await Promise.all([eventGuests(event.id), eventMatches(event.id)]);
  const byId = new Map(guests.map((g) => [g.id, g]));
  const cards: BadgeCard[] = guests.map((g) => ({
    number: g.number,
    name: g.name,
    role: g.role,
    askMeAbout: g.ask_me_about,
    hellos: hellosFor(g.id, matches, byId),
  }));
  return { event: toEventPublic(event, guests.length), cards };
}

export async function getDemo(): Promise<DemoData> {
  if (!hasDatabase()) return mock.getDemo();
  const { data, error } = await db()
    .from("events")
    .select("*")
    .eq("plan", "demo")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  const event = data as EventRow | null;
  if (!event) return mock.getDemo();
  const guests = await eventGuests(event.id);
  return {
    event: toEventPublic(event, guests.length),
    adminToken: event.admin_token,
    guests: guests.map((g) => ({ name: g.name, token: g.token })),
  };
}

// ---------- Organiser side (David's pages) ----------

export async function createEvent(input: CreateEventInput, plan: Plan = "free"): Promise<{ adminToken: string; slug: string }> {
  const adminToken = newToken();
  // Retry on the rare slug collision.
  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = newSlug();
    const { error } = await db().from("events").insert({
      slug,
      admin_token: adminToken,
      name: input.name,
      starts_at: input.startsAt,
      time_zone: input.timeZone,
      place: input.place,
      description: input.description,
      organiser_name: input.organiserName,
      organiser_email: input.organiserEmail,
      plan,
      guest_limit: plan === "free" ? FREE_GUEST_LIMIT : 150,
    });
    if (!error) return { adminToken, slug };
    if (error.code !== "23505") throw error; // unique violation: try another slug
  }
  throw new Error("Could not create a unique event code. Please try again.");
}

export async function getEventRowByAdminToken(adminToken: string): Promise<EventRow | null> {
  return eventBy("admin_token", adminToken);
}

export async function getAdminView(adminToken: string): Promise<AdminView | null> {
  const event = await eventBy("admin_token", adminToken);
  if (!event) return null;
  const [guests, matches] = await Promise.all([eventGuests(event.id), eventMatches(event.id)]);
  const helloCounts = new Map<string, number>();
  for (const m of matches) helloCounts.set(m.guest_id, (helloCounts.get(m.guest_id) ?? 0) + 1);
  return {
    event: toEventPublic(event, guests.length),
    adminToken: event.admin_token,
    plan: event.plan,
    guestLimit: event.guest_limit,
    paidAt: event.paid_at,
    organiserEmail: event.organiser_email,
    matchedAt: event.matched_at,
    guests: guests.map((g) => ({
      number: g.number,
      name: g.name,
      role: g.role,
      interests: g.interests,
      lookingFor: g.looking_for,
      askMeAbout: g.ask_me_about,
      token: g.token,
      joinedAt: g.created_at,
      helloCount: helloCounts.get(g.id) ?? 0,
    })),
  };
}

/** Replaces the hellos of the given guests and marks the event as matched. */
export async function saveMatches(
  eventId: string,
  rows: Array<Omit<MatchRow, "source"> & { source: "ai" | "fallback" }>,
  guestIds: string[],
): Promise<void> {
  if (guestIds.length > 0) {
    const { error: delError } = await db().from("matches").delete().eq("event_id", eventId).in("guest_id", guestIds);
    if (delError) throw delError;
  }
  if (rows.length > 0) {
    const { error } = await db()
      .from("matches")
      .insert(rows.map((r) => ({ ...r, event_id: eventId })));
    if (error) throw error;
  }
  const { error: evError } = await db()
    .from("events")
    .update({ status: "matched", matched_at: new Date().toISOString() })
    .eq("id", eventId);
  if (evError) throw evError;
}

/** Removes one guest (and every hello that points to or from them). */
export async function removeGuest(eventId: string, number: number): Promise<void> {
  const { error } = await db().from("guests").delete().eq("event_id", eventId).eq("number", number);
  if (error) throw error;
}

/**
 * Records a completed payment and lifts the guest limit. Safe to call twice.
 * Only a live-mode payment makes an event "paid"; a test-mode payment (test card)
 * or one on our own test event keeps the plan "test", so it never counts as traction.
 */
export async function markEventPaid(eventId: string, sessionId: string, amountCents: number, livemode: boolean): Promise<void> {
  const { data: current, error: readError } = await db().from("events").select("plan").eq("id", eventId).maybeSingle();
  if (readError) throw readError;
  const plan = livemode && current?.plan !== "test" ? "paid" : "test";
  const { error } = await db()
    .from("events")
    .update({
      plan,
      guest_limit: 150,
      stripe_session_id: sessionId,
      amount_paid_cents: amountCents,
      paid_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .is("paid_at", null);
  if (error) throw error;
}
