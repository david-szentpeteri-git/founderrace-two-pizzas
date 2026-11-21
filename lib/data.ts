import "server-only";
import * as mock from "./mock";
import type { DemoData, EventPublic, GuestView, JoinInput, PrintData } from "./types";

// Server-only data functions for the pages (docs/plan.md 5.6).
// D1 skeleton: these return the mock data. D2 replaces each body with the
// Supabase implementation without changing the signatures.

export async function getEventBySlug(slug: string): Promise<EventPublic | null> {
  return mock.getEventBySlug(slug);
}

export async function joinEvent(slug: string, input: JoinInput): Promise<{ guestToken: string }> {
  return mock.joinEvent(slug, input);
}

export async function getGuestView(token: string): Promise<GuestView | null> {
  return mock.getGuestView(token);
}

export async function getPrintData(adminToken: string): Promise<PrintData | null> {
  return mock.getPrintData(adminToken);
}

export async function getDemo(): Promise<DemoData> {
  return mock.getDemo();
}
