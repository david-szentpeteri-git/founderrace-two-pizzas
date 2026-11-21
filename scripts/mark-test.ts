// Marks our own test events as plan "test" so they never count as traction.
// Run: npm run mark-test   (events whose name starts with "TEST", any case)
// Add event codes as arguments to mark others too: npm run mark-test -- k7m2xq9d

import { db } from "@/lib/db";

async function main() {
  const slugs = process.argv.slice(2);
  const { data, error } = await db()
    .from("events")
    .select("id, slug, name, plan, amount_paid_cents")
    .neq("plan", "test")
    .neq("plan", "demo");
  if (error) throw error;

  const targets = (data ?? []).filter((e) => /^test\b/i.test(e.name.trim()) || slugs.includes(e.slug));
  for (const e of targets) {
    const { error: upError } = await db().from("events").update({ plan: "test" }).eq("id", e.id);
    if (upError) throw upError;
    console.log(`marked test: ${e.slug} "${e.name}" (was ${e.plan}${e.amount_paid_cents ? `, paid ${e.amount_paid_cents / 100} EUR` : ""})`);
  }
  console.log(`${targets.length} event(s) marked as test.`);
}

process.loadEnvFile(".env.local");
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
