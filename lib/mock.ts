// Sample data with the same shape as lib/data.ts, so pages can be built
// before the database is wired. Fictional people, for development only.

import type { BadgeCard, DemoData, EventPublic, GuestView, Hello, JoinInput, PrintData } from "./types";

const event: EventPublic = {
  slug: "mockmix1",
  name: "Sample mixer",
  startsAt: "2026-11-28T11:00:00.000Z",
  timeZone: "Asia/Singapore",
  place: "Level 3 lounge",
  description: "A sample event used while building the pages.",
  organiserName: "Sample organiser",
  guestCount: 6,
  status: "matched",
  isDemo: true,
};

const people = [
  { number: 1, name: "Ana", role: "Second-year computer science student", askMeAbout: "the robot I built for a hackathon" },
  { number: 2, name: "Ben", role: "Product designer at a fintech startup", askMeAbout: "why most onboarding flows fail" },
  { number: 3, name: "Chloe", role: "Runs a climbing club", askMeAbout: "the best beginner climbing spots" },
  { number: 4, name: "Dev", role: "Data analyst moving into machine learning", askMeAbout: "my first Kaggle medal" },
  { number: 5, name: "Emma", role: "Exchange student from Lyon", askMeAbout: "where to find real croissants here" },
  { number: 6, name: "Farid", role: "Founder of a small edtech app", askMeAbout: "what 200 students taught me about homework" },
];

function hello(rank: 1 | 2 | 3, n: number, reason: string, opener: string, mutual = false): Hello {
  const p = people.find((x) => x.number === n)!;
  return { rank, name: p.name, number: p.number, role: p.role, askMeAbout: p.askMeAbout, reason, opener, mutual };
}

const anaHellos: Hello[] = [
  hello(1, 4, "You both want to get into machine learning, and Dev has already made the jump from analysis.", "What was the first ML project that actually worked for you?", true),
  hello(2, 6, "Farid builds an app for students, and you said you'd love to meet founders.", "How did you find your first 200 users?"),
  hello(3, 3, "You both put climbing in your interests.", "Which wall would you take a complete beginner to?"),
];

export async function getEventBySlug(slug: string): Promise<EventPublic | null> {
  return slug ? { ...event, slug, status: "collecting" } : null;
}

export async function joinEvent(_slug: string, _input: JoinInput): Promise<{ guestToken: string }> {
  return { guestToken: "mock-guest-ana" };
}

export async function getGuestView(token: string): Promise<GuestView | null> {
  if (!token) return null;
  const waiting = token.includes("waiting");
  return {
    event: { ...event, status: waiting ? "collecting" : "matched" },
    guest: { name: "Ana", number: 1, role: people[0].role },
    hellos: waiting ? [] : anaHellos,
    wantsToMeetYou: waiting ? [] : [{ name: "Dev", number: 4 }, { name: "Emma", number: 5 }],
  };
}

export async function getPrintData(_adminToken: string): Promise<PrintData | null> {
  const cards: BadgeCard[] = people.map((p) => ({
    number: p.number,
    name: p.name,
    role: p.role,
    askMeAbout: p.askMeAbout,
    hellos: p.number === 1 ? anaHellos : anaHellos.map((h) => ({ ...h })),
  }));
  return { event, cards };
}

export async function getDemo(): Promise<DemoData> {
  return {
    event,
    adminToken: "mock-admin",
    guests: people.map((p) => ({ name: p.name, token: `mock-guest-${p.name.toLowerCase()}` })),
  };
}
