import type { Hello } from "@/lib/types";
import { demo } from "@/content/landing";
import demoData from "@/content/demo-guests.json";

// One sample guest from the demo event and the three hellos they get.
// Names, roles and badge numbers come from content/demo-guests.json
// (badge number = position in the list). Reasons, openers and the mutual
// marks are copied word for word from what the matching engine (Claude)
// generated for this guest in the seeded demo event on 21 Nov 2026, so the
// landing page shows real output. If the demo is regenerated, copy again.
// A name missing from the file drops that card instead of breaking the page.

type DemoGuest = (typeof demoData.guests)[number];

function find(name: string): { guest: DemoGuest; number: number } | null {
  const index = demoData.guests.findIndex((g) => g.name === name);
  if (index < 0) return null;
  return { guest: demoData.guests[index], number: index + 1 };
}

function hello(rank: 1 | 2 | 3, name: string, reason: string, opener: string, mutual: boolean): Hello | null {
  const found = find(name);
  if (!found) return null;
  return {
    rank,
    name: found.guest.name,
    number: found.number,
    role: found.guest.role,
    askMeAbout: found.guest.askMeAbout ?? null,
    reason,
    opener,
    mutual,
  };
}

const me = find("Dev Malhotra");
const first = demoData.guests[0];

export const sampleGuest = me
  ? { name: me.guest.name, number: me.number, role: me.guest.role }
  : { name: first?.name ?? "", number: 1, role: first?.role ?? "" };

export const sampleHellos: Hello[] = me
  ? [
      hello(1, "Tomasz Brecki", demo.example.reason, demo.example.opener, true),
      hello(
        2,
        "Oskar Vennholm",
        "Oskar shares your interests in robotics and open source.",
        "Why can a model be right for the wrong reason?",
        true,
      ),
      hello(
        3,
        "Jonas Weatherby",
        "Jonas is a second time founder who also boulders and enjoys testing student ideas.",
        "What mistakes from your first company would you not repeat?",
        true,
      ),
    ].filter((h): h is Hello => h !== null)
  : [];

// The four sign-up answers of the sample guest, shown beside the phone preview.
export const sampleAnswers = me
  ? [
      { label: "What I do", value: me.guest.role },
      { label: "Interests", value: me.guest.interests.join(", ") },
      { label: "Would love to meet", value: me.guest.lookingFor },
      { label: "Ask me about", value: me.guest.askMeAbout ?? "" },
    ].filter((a) => a.value)
  : [];
