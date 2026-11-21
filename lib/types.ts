// The contract between David's backend and Daniel's pages (docs/plan.md 5.6).
// Change a type only after telling the other person.

export type Plan = "free" | "paid" | "pilot" | "demo" | "test";

export type EventPublic = {
  slug: string;
  name: string;
  startsAt: string | null; // ISO date
  place: string | null;
  description: string | null;
  organiserName: string;
  guestCount: number;
  status: "collecting" | "matched";
  isDemo: boolean;
};

export type JoinInput = {
  name: string;
  email?: string;
  role: string; // "What do you do?"
  interests: string[]; // up to 3
  lookingFor?: string; // "Who would you love to meet?"
  askMeAbout?: string;
  consent: true;
};

export type Hello = {
  rank: 1 | 2 | 3;
  name: string;
  number: number; // badge number
  role: string;
  askMeAbout: string | null;
  reason: string;
  opener: string;
  mutual: boolean; // they also have you in their three
};

export type GuestView = {
  event: EventPublic;
  guest: { name: string; number: number; role: string };
  hellos: Hello[]; // empty until the organiser generates intros
  wantsToMeetYou: { name: string; number: number }[]; // P1
};

export type BadgeCard = {
  number: number;
  name: string;
  role: string;
  askMeAbout: string | null;
  hellos: Hello[];
};

export type PrintData = { event: EventPublic; cards: BadgeCard[] };

export type DemoData = {
  event: EventPublic;
  adminToken: string;
  guests: { name: string; token: string }[];
};
