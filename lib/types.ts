// Shared types between the data layer (lib/data.ts) and the pages.

export type Plan = "free" | "paid" | "pilot" | "demo" | "test";

export type EventPublic = {
  slug: string;
  name: string;
  startsAt: string | null; // ISO date
  timeZone?: string | null; // organiser's IANA zone, e.g. "Asia/Singapore"; format startsAt in it
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

// Organiser side.

export type CreateEventInput = {
  name: string;
  startsAt: string | null; // ISO date
  timeZone: string | null;
  place: string | null;
  description: string | null;
  organiserName: string;
  organiserEmail: string;
};

export type AdminGuest = {
  number: number;
  name: string;
  role: string;
  interests: string[];
  lookingFor: string | null;
  askMeAbout: string | null;
  token: string;
  joinedAt: string;
  helloCount: number;
};

export type AdminView = {
  event: EventPublic;
  adminToken: string;
  plan: Plan;
  guestLimit: number; // limit that applies now (the pass lifts it)
  coveredLimit: number; // places bought for this event (free places + paid places)
  passUntil: string | null; // end of the organiser's 30-day unlimited pass
  amountPaidCents: number;
  paidAt: string | null;
  organiserEmail: string;
  matchedAt: string | null;
  guests: AdminGuest[];
};
