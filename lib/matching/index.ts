import "server-only";
import { eventGuests, eventMatches, saveMatches, type EventRow, type GuestRow } from "@/lib/data";
import { MIN_GUESTS_TO_MATCH } from "@/lib/site";
import { claudeBatch, hasClaude, rosterText } from "./claude";
import { heuristicMatches } from "./heuristic";
import { HELLOS_PER_GUEST, MAX_TIMES_SUGGESTED, type MatchGuest, type ProposedHello } from "./types";

const BATCH_SIZE = 15;

export type MatchRunResult = {
  guestsMatched: number;
  aiHellos: number;
  fallbackHellos: number;
  usedAi: boolean;
};

function toMatchGuest(g: GuestRow): MatchGuest {
  return {
    id: g.id,
    key: `g${g.number}`,
    name: g.name,
    role: g.role,
    interests: g.interests ?? [],
    lookingFor: g.looking_for,
    askMeAbout: g.ask_me_about,
  };
}

function trimTo(text: string, maxWords: number): string {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  return words.length <= maxWords ? words.join(" ") : `${words.slice(0, maxWords).join(" ")}...`;
}

/**
 * Generates hellos for an event. With `onlyNew`, only guests without hellos
 * are matched (late arrivals); everyone else keeps theirs.
 */
export async function generateIntros(event: EventRow, { onlyNew = false } = {}): Promise<MatchRunResult> {
  const [rows, existing] = await Promise.all([eventGuests(event.id), eventMatches(event.id)]);
  if (rows.length < MIN_GUESTS_TO_MATCH) {
    throw new Error(`At least ${MIN_GUESTS_TO_MATCH} guests are needed to make intros.`);
  }
  const everyone = rows.map(toMatchGuest);
  const byKey = new Map(everyone.map((g) => [g.key, g]));

  const withHellos = new Set(existing.map((m) => m.guest_id));
  const targets = onlyNew ? everyone.filter((g) => !withHellos.has(g.id)) : everyone;
  if (targets.length === 0) return { guestsMatched: 0, aiHellos: 0, fallbackHellos: 0, usedAi: false };

  // Popularity counts start from the hellos we keep.
  const suggested = new Map<string, number>();
  if (onlyNew) for (const m of existing) suggested.set(m.match_guest_id, (suggested.get(m.match_guest_id) ?? 0) + 1);

  const proposal = new Map<string, ProposedHello[]>();
  let usedAi = false;

  if (hasClaude()) {
    const roster = rosterText(event.name, event.description, everyone);
    const batches: MatchGuest[][] = [];
    for (let i = 0; i < targets.length; i += BATCH_SIZE) batches.push(targets.slice(i, i + BATCH_SIZE));
    const results = await Promise.all(batches.map((b) => claudeBatch(roster, b.map((g) => g.key))));

    for (const result of results) {
      if (!result) continue;
      usedAi = true;
      for (const entry of result.guests) {
        const guest = byKey.get(entry.guestId.trim());
        if (!guest || proposal.has(guest.id) || !targets.some((t) => t.id === guest.id)) continue;
        const picked: ProposedHello[] = [];
        for (const h of entry.hellos) {
          const other = byKey.get(h.matchId.trim());
          if (!other || other.id === guest.id || picked.some((p) => p.matchId === other.id)) continue;
          if ((suggested.get(other.id) ?? 0) >= MAX_TIMES_SUGGESTED) continue;
          if (!h.reason.trim() || !h.opener.trim()) continue;
          picked.push({ matchId: other.id, reason: trimTo(h.reason, 30), opener: trimTo(h.opener, 25), source: "ai" });
          suggested.set(other.id, (suggested.get(other.id) ?? 0) + 1);
          if (picked.length === HELLOS_PER_GUEST) break;
        }
        proposal.set(guest.id, picked);
      }
    }
  }

  // Fill every gap (no AI, a failed batch, a dropped pick) with the heuristic.
  const needFill = targets.filter((g) => (proposal.get(g.id)?.length ?? 0) < HELLOS_PER_GUEST);
  if (needFill.length > 0) {
    const filled = heuristicMatches(needFill, everyone, suggested, proposal);
    for (const [id, hellos] of filled) proposal.set(id, hellos);
  }

  const rowsToSave = targets.flatMap((g) =>
    (proposal.get(g.id) ?? []).slice(0, HELLOS_PER_GUEST).map((h, i) => ({
      guest_id: g.id,
      match_guest_id: h.matchId,
      rank: i + 1,
      reason: h.reason,
      opener: h.opener,
      source: h.source,
    })),
  );

  await saveMatches(
    event.id,
    rowsToSave,
    targets.map((g) => g.id),
  );

  return {
    guestsMatched: targets.length,
    aiHellos: rowsToSave.filter((r) => r.source === "ai").length,
    fallbackHellos: rowsToSave.filter((r) => r.source === "fallback").length,
    usedAi,
  };
}
