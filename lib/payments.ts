import "server-only";
import type Stripe from "stripe";
import { recordPayment } from "./data";

/** Applies a paid Checkout Session (from the success page or the webhook). Safe to call twice. */
export async function applyCheckoutSession(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== "paid") return;
  const m = session.metadata ?? {};
  const kind = m.kind === "pass" ? "pass" : "guests";
  const limit = Number(m.guest_limit_after);
  await recordPayment({
    sessionId: session.id,
    kind,
    eventId: m.event_id ?? session.client_reference_id ?? null,
    email: m.email ?? session.customer_details?.email ?? session.customer_email ?? null,
    amountCents: session.amount_total ?? 0,
    livemode: session.livemode,
    guestLimitAfter: Number.isFinite(limit) && limit > 0 ? limit : null,
  });
}
