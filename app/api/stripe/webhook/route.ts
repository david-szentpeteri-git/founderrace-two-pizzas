import type Stripe from "stripe";
import { applyCheckoutSession } from "@/lib/payments";
import { stripe } from "@/lib/stripe";

// Backup path for payments: if the organiser closes the tab before
// /checkout/success loads, Stripe still tells us here. Idempotent with that page.
// Stripe dashboard: Developers > Webhooks > endpoint https://three-hellos.vercel.app/api/stripe/webhook (also reachable on threehellos.app),
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
    try {
      await applyCheckoutSession(event.data.object);
    } catch (error) {
      console.error("Webhook could not record the payment", error);
      return new Response("Retry later", { status: 500 });
    }
  }

  return new Response("ok");
}
