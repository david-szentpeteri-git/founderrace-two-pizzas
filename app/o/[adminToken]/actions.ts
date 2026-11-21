"use server";

import { redirect } from "next/navigation";
import { getEventRowByAdminToken, eventGuests } from "@/lib/data";
import { generateIntros } from "@/lib/matching";
import { EVENT_PRICE_EUR_CENTS, siteUrl } from "@/lib/site";
import { stripe } from "@/lib/stripe";

function back(adminToken: string, params: Record<string, string>): never {
  redirect(`/o/${encodeURIComponent(adminToken)}?${new URLSearchParams(params).toString()}`);
}

/** Generates hellos for everyone ("all") or only for guests who have none yet ("new"). */
export async function generateIntrosAction(adminToken: string, mode: "all" | "new"): Promise<void> {
  const event = await getEventRowByAdminToken(adminToken);
  if (!event) back(adminToken, { error: "notfound" });

  const guests = await eventGuests(event.id);
  if (guests.length > event.guest_limit) back(adminToken, { error: "limit" });

  let summary: string;
  try {
    const result = await generateIntros(event, { onlyNew: mode === "new" });
    summary = String(result.guestsMatched);
  } catch (error) {
    console.error("generateIntros failed", error);
    back(adminToken, { error: "generate" });
  }
  back(adminToken, { done: summary });
}

/** Starts a Stripe Checkout for the €29 event upgrade. */
export async function startCheckoutAction(adminToken: string): Promise<void> {
  const event = await getEventRowByAdminToken(adminToken);
  if (!event) back(adminToken, { error: "notfound" });
  if (event.plan !== "free") back(adminToken, { error: "alreadypaid" });

  let url: string | null = null;
  try {
    const base = siteUrl();
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: EVENT_PRICE_EUR_CENTS,
            product_data: {
              name: "Three Hellos: one event, up to 150 guests",
              description: event.name.slice(0, 200),
            },
          },
        },
      ],
      client_reference_id: event.id,
      metadata: { event_id: event.id, event_slug: event.slug },
      customer_email: event.organiser_email,
      customer_creation: "always",
      success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/o/${encodeURIComponent(adminToken)}?checkout=cancelled`,
    });
    url = session.url;
  } catch (error) {
    console.error("Stripe checkout failed", error);
  }
  if (!url) back(adminToken, { error: "checkout" });
  redirect(url);
}
