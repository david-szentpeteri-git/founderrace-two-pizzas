import { HELLOS_PER_GUEST, MAX_TIMES_SUGGESTED, type MatchGuest, type ProposedHello } from "./types";

// Fallback matcher: no AI, only what guests wrote. Used when the Claude API is
// unavailable, and to fill any gap the AI leaves.

const STOP = new Set(
  "the and for with who are that this from your you our their they them have has into about some someone people person would love meet like who's whos just also want wants looking new any".split(
    " ",
  ),
);

function words(text: string | null | undefined): Set<string> {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3 && !STOP.has(w)),
  );
}

function overlap(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((w) => b.has(w));
}

type Scored = { other: MatchGuest; score: number; shared: string | null; wanted: boolean };

function scorePair(a: MatchGuest, b: MatchGuest): Scored {
  const aInterests = a.interests.map((i) => i.toLowerCase());
  const sharedExact = b.interests.find((i) => aInterests.includes(i.toLowerCase())) ?? null;
  const interestWords = overlap(words(a.interests.join(" ")), words(b.interests.join(" "))).length;
  const aWantsB = overlap(words(a.lookingFor), new Set([...words(b.role), ...words(b.interests.join(" "))])).length;
  const bWantsA = overlap(words(b.lookingFor), new Set([...words(a.role), ...words(a.interests.join(" "))])).length;
  const score = (sharedExact ? 3 : 0) + interestWords + 2 * Math.min(aWantsB, 2) + Math.min(bWantsA, 2);
  return { other: b, score, shared: sharedExact, wanted: aWantsB > 0 };
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function reasonFor(s: Scored): string {
  const name = firstName(s.other.name);
  if (s.shared) return `You both put ${s.shared.toLowerCase()} in your interests.`;
  if (s.wanted) return `You said who you'd love to meet, and ${name} is ${lowerFirst(s.other.role)}.`;
  return `${name} is ${lowerFirst(s.other.role)}, a different angle from yours.`;
}

function openerFor(s: Scored): string {
  if (s.other.askMeAbout) return `Ask ${firstName(s.other.name)} about ${lowerFirst(s.other.askMeAbout).replace(/[.?!]+$/, "")}.`;
  if (s.shared) return `How did you get into ${s.shared.toLowerCase()}?`;
  return `What are you working on at the moment?`;
}

/**
 * Proposes hellos for `targets`, choosing among `everyone`. `alreadySuggested`
 * counts existing suggestions so the popularity cap holds across calls.
 */
export function heuristicMatches(
  targets: MatchGuest[],
  everyone: MatchGuest[],
  alreadySuggested: Map<string, number> = new Map(),
  keep: Map<string, ProposedHello[]> = new Map(),
): Map<string, ProposedHello[]> {
  const counts = new Map(alreadySuggested);
  const result = new Map<string, ProposedHello[]>();

  for (const guest of targets) {
    const current = [...(keep.get(guest.id) ?? [])];
    const taken = new Set(current.map((h) => h.matchId));
    const candidates = everyone
      .filter((o) => o.id !== guest.id && !taken.has(o.id))
      .map((o) => scorePair(guest, o))
      .sort((x, y) => y.score - x.score || (counts.get(x.other.id) ?? 0) - (counts.get(y.other.id) ?? 0));

    for (const pass of [true, false]) {
      for (const c of candidates) {
        if (current.length >= HELLOS_PER_GUEST) break;
        if (taken.has(c.other.id)) continue;
        if (pass && (counts.get(c.other.id) ?? 0) >= MAX_TIMES_SUGGESTED) continue;
        current.push({ matchId: c.other.id, reason: reasonFor(c), opener: openerFor(c), source: "fallback" });
        taken.add(c.other.id);
        counts.set(c.other.id, (counts.get(c.other.id) ?? 0) + 1);
      }
    }
    result.set(guest.id, current);
  }
  return result;
}
