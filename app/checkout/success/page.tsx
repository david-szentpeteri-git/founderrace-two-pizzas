import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { db } from "@/lib/db";
import type { EventRow } from "@/lib/data";
import { applyCheckoutSession } from "@/lib/payments";
import { stripe } from "@/lib/stripe";
import { seller } from "@/content/legal/seller";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Payment",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

// Stripe sends the organiser here after paying. We check the session with
// Stripe ourselves (never trust the URL alone), upgrade the event, and go back
// to the dashboard. The webhook (P1) does the same in case this page is skipped.
export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  let adminToken: string | null = null;
  let paid = false;

  if (typeof sessionId === "string" && sessionId.startsWith("cs_")) {
    try {
      const session = await stripe().checkout.sessions.retrieve(sessionId);
      const eventId = session.metadata?.event_id ?? session.client_reference_id;
      if (eventId) {
        const { data } = await db().from("events").select("*").eq("id", eventId).maybeSingle();
        const event = data as EventRow | null;
        if (event) {
          adminToken = event.admin_token;
          if (session.payment_status === "paid") {
            await applyCheckoutSession(session);
            paid = true;
          }
        }
      }
    } catch (error) {
      console.error("Checkout success check failed", error);
    }
  }

  if (adminToken) redirect(paid ? `/o/${adminToken}?paid=1` : `/o/${adminToken}?checkout=pending`);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight">Thanks for your payment</h1>
        <p className="mt-3 text-lg text-zinc-500">
          We couldn&apos;t match it to your event automatically. Open your organiser link again; if the event still shows
          the free plan, email {seller.contactEmail} with your event name and we&apos;ll fix it right away.
        </p>
      </main>
      <Footer />
    </div>
  );
}
