"use server";

import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { effectiveGuestLimit, eventGuests, getEventRowByAdminToken, removeGuest } from "@/lib/data";
import { generateIntros } from "@/lib/matching";
import { PASS_DAYS, PASS_PRICE_CENTS, guestTopUp } from "@/lib/pricing";
import { siteUrl } from "@/lib/site";
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
  if (guests.length > (await effectiveGuestLimit(event))) back(adminToken, { error: "limit" });

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

/**
 * Starts a Stripe Checkout. "guests" pays 2 cents for each guest above what the
 * event already covers (at least 1 EUR); "pass" is 9 EUR for 30 days of unlimited
 * events for this organiser's email.
 */
export async function startCheckoutAction(adminToken: string, kind: "guests" | "pass"): Promise<void> {
  const event = await getEventRowByAdminToken(adminToken);
  if (!event) back(adminToken, { error: "notfound" });
  if (event.plan === "demo" || event.plan === "pilot") back(adminToken, { error: "demo" });

  const base = siteUrl();
  let unitAmount: number;
  let productName: string;
  let description: string;
  const metadata: Record<string, string> = { kind, event_id: event.id, event_slug: event.slug, email: event.organiser_email };

  if (kind === "guests") {
    const count = (await eventGuests(event.id)).length;
    const covered = event.guest_limit;
    const { cents, newLimit, extraGuests } = guestTopUp(Math.max(count, covered + 1), covered);
    unitAmount = cents;
    productName = `Three Hellos: intros for up to ${newLimit} guests`;
    description = `${event.name.slice(0, 120)}. ${extraGuests > 0 ? `${extraGuests} guests above ${covered}` : `Places above ${covered}`}, 2 cents each, at least €1.`;
    metadata.guest_limit_after = String(newLimit);
  } else {
    unitAmount = PASS_PRICE_CENTS;
    productName = `Three Hellos: ${PASS_DAYS} days of unlimited events`;
    description = `Every event created with ${event.organiser_email} for ${PASS_DAYS} days, any number of guests. One payment, no subscription.`;
  }

  // The buyer agrees to the terms and to delivery starting at once, which ends
  // the 14 day right to cancel when the intros are made (see /terms).
  const waiverTail = "I ask for this to start right away, and I understand my 14 day right to cancel ends once the intros are made.";
  const waiver = `I agree to the [terms of sale](${base}/terms). ${waiverTail}`;
  const waiverPlain = `By paying you agree to the terms of sale at ${base}/terms. ${waiverTail}`;

  let url: string | null = null;
  try {
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: { currency: "eur", unit_amount: unitAmount, product_data: { name: productName, description } },
        },
      ],
      client_reference_id: event.id,
      metadata,
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
      url = (await stripe().checkout.sessions.create({ ...rest, custom_text: { submit: { message: waiverPlain } } })).url;
    }
  } catch (error) {
    console.error("Stripe checkout failed", error);
  }
  if (!url) back(adminToken, { error: "checkout" });
  redirect(url);
}
