import type Stripe from "stripe";
import { markEventPaid } from "@/lib/data";
import { stripe } from "@/lib/stripe";

// Backup path for payments (plan D8): if the organiser closes the tab before
// /checkout/success loads, Stripe still tells us here. Idempotent with that page.
// Stripe dashboard: Developers > Webhooks > endpoint https://threehellos.app/api/stripe/webhook,
// event checkout.session.completed; its signing secret goes in STRIPE_WEBHOOK_SECRET.

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Webhook not configured", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response("Bad signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const eventId = session.metadata?.event_id ?? session.client_reference_id;
    if (eventId && session.payment_status === "paid") {
      try {
        await markEventPaid(eventId, session.id, session.amount_total ?? 0);
      } catch (error) {
        console.error("Webhook could not mark event paid", error);
        return new Response("Retry later", { status: 500 });
      }
    }
  }

  return new Response("ok");
}
