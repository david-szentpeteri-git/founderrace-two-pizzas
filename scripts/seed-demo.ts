// Seeds the sample event shown on /demo from content/demo-guests.json (plan D6).
// Run: npm run seed:demo   (reads .env.local; replaces any earlier demo event)
// The guests are fictional and the event has plan "demo", so it is excluded
// from every traction number.

import demo from "../content/demo-guests.json";
import { db } from "@/lib/db";
import { createEvent, getEventRowByAdminToken } from "@/lib/data";
import { generateIntros } from "@/lib/matching";
import { newToken } from "@/lib/tokens";

type DemoGuest = {
  name: string;
  role: string;
  interests: string[];
  lookingFor?: string;
  askMeAbout?: string;
};

async function main() {
  const { error: delError } = await db().from("events").delete().eq("plan", "demo");
  if (delError) throw delError;

  const { adminToken, slug } = await createEvent(
    {
      name: demo.event.name,
      startsAt: new Date(demo.event.startsAt).toISOString(),
      timeZone: "Europe/Paris",
      place: demo.event.place,
      description: demo.event.description,
      organiserName: demo.event.organiserName,
      organiserEmail: "demo@example.com", // fictional organiser of the sample event
    },
    "demo",
  );

  for (const g of demo.guests as DemoGuest[]) {
    const { error } = await db().rpc("join_event", {
      p_slug: slug,
      p_token: newToken(),
      p_name: g.name,
      p_email: "",
      p_role: g.role,
      p_interests: g.interests.slice(0, 3),
      p_looking_for: g.lookingFor ?? "",
      p_ask_me_about: g.askMeAbout ?? "",
    });
    if (error) throw error;
  }

  const event = await getEventRowByAdminToken(adminToken);
  if (!event) throw new Error("Demo event vanished after creation");
  const result = await generateIntros(event);

  console.log(`Demo event seeded: /e/${slug}, ${demo.guests.length} guests.`);
  console.log(`Hellos: ${result.aiHellos} from Claude, ${result.fallbackHellos} from the fallback matcher.`);
  console.log(`Organiser view: /o/${adminToken}`);
}

process.loadEnvFile(".env.local");
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
