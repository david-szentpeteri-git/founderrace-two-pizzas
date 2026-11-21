"use server";

import { redirect } from "next/navigation";
import { getEventRowByAdminToken, eventGuests, removeGuest } from "@/lib/data";
import { generateIntros } from "@/lib/matching";
import { EVENT_PRICE_EUR_CENTS, siteUrl } from "@/lib/site";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

function back(adminToken: string, params: Record<string, string>): never {
  redirect(`/o/${encodeURIComponent(adminToken)}?${new URLSearchParams(params).toString()}`);
}

/** Generates hellos for everyone ("all") or only for guests who have none yet ("new"). */
export async function generateIntrosAction(adminToken: string, mode: "all" | "new"): Promise<void> {
  const event = await getEventRowByAdminToken(adminToken);
  if (!event) back(adminToken, { error: "notfound" });
  if (event.plan === "demo") back(adminToken, { error: "demo" });

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

/** Removes a guest, e.g. a duplicate or a test entry. Their hellos go with them. */
export async function removeGuestAction(adminToken: string, number: number): Promise<void> {
  const event = await getEventRowByAdminToken(adminToken);
  if (!event) back(adminToken, { error: "notfound" });
  if (event.plan === "demo") back(adminToken, { error: "demo" });
  try {
    await removeGuest(event.id, number);
  } catch (error) {
    console.error("removeGuest failed", error);
    back(adminToken, { error: "remove" });
  }
  back(adminToken, { removed: String(number) });
}

/** Starts a Stripe Checkout for the €29 event upgrade. */
export async function startCheckoutAction(adminToken: string): Promise<void> {
  const event = await getEventRowByAdminToken(adminToken);
  if (!event) back(adminToken, { error: "notfound" });
  if (event.plan === "demo") back(adminToken, { error: "demo" });
  // Test events behave like free ones so we can rehearse the payment in test mode.
  if (event.plan !== "free" && event.plan !== "test") back(adminToken, { error: "alreadypaid" });

  let url: string | null = null;
  const base = siteUrl();
  // The buyer agrees to the terms and to delivery starting at once, which ends
  // the 14 day right to cancel when the intros are made (see /terms).
  const waiverTail = "I ask for my event to be upgraded right away, and I understand my 14 day right to cancel ends once the intros are made.";
  const waiver = `I agree to the [terms of sale](${base}/terms). ${waiverTail}`;
  const waiverPlain = `By paying you agree to the terms of sale at ${base}/terms. ${waiverTail}`;
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
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
      consent_collection: { terms_of_service: "required" },
      custom_text: { terms_of_service_acceptance: { message: waiver } },
    };
    try {
      url = (await stripe().checkout.sessions.create(params)).url;
    } catch (consentError) {
      // Stripe refuses the consent box until a terms URL is set in the account's
      // public details. Keep selling meanwhile, with the waiver as plain text.
      console.error("Checkout with consent box failed, retrying without it", consentError);
      const { consent_collection: _omit, ...rest } = params;
      void _omit;
      url = (
        await stripe().checkout.sessions.create({
          ...rest,
          custom_text: { submit: { message: waiverPlain } },
        })
      ).url;
    }
  } catch (error) {
    console.error("Stripe checkout failed", error);
  }
  if (!url) back(adminToken, { error: "checkout" });
  redirect(url);
}
