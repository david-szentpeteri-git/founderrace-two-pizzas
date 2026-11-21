import type { Hello } from "@/lib/types";
import { demo } from "@/content/landing";
import demoData from "@/content/demo-guests.json";

// One sample guest from the demo event and the three hellos they get.
// Names, roles and badge numbers come from content/demo-guests.json
// (badge number = position in the list). Reasons and openers below are
// written for the landing preview and point only to answers both guests gave.
// A name missing from the file drops that card instead of breaking the page.

type DemoGuest = (typeof demoData.guests)[number];

function find(name: string): { guest: DemoGuest; number: number } | null {
  const index = demoData.guests.findIndex((g) => g.name === name);
  if (index < 0) return null;
  return { guest: demoData.guests[index], number: index + 1 };
}

function hello(rank: 1 | 2 | 3, name: string, reason: string, opener: string): Hello | null {
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
    mutual: rank === 1,
  };
}

const me = find("Dev Malhotra");
const first = demoData.guests[0];

export const sampleGuest = me
  ? { name: me.guest.name, number: me.number, role: me.guest.role }
  : { name: first?.name ?? "", number: 1, role: first?.role ?? "" };

export const sampleHellos: Hello[] = me
  ? [
      hello(1, "Tomasz Brecki", demo.example.reason, demo.example.opener),
      hello(
        2,
        "Oskar Vennholm",
        "You both listed robotics and open source. Oskar trains AI models on medical scans, so he can tell you what the software side of a research robot looks like.",
        "Why can a model be right for the wrong reason, and how would you spot it in a robot?",
      ),
      hello(
        3,
        "Kenji Ostrander",
        "You both care about open source, and Kenji maintains a project at weekends. Ask him what it takes to keep one going once people start using it.",
        "How did you pick the open source project you maintain now?",
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
