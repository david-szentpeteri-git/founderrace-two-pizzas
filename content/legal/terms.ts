// Terms of sale for /terms. Build it with completeSeller(); render nothing if that returns null.
// The refund wording must stay in line with the refund answer in content/landing.ts.
import { fixed, type CompleteSeller, type LegalPage } from "./seller";

export function termsOfSale(s: CompleteSeller): LegalPage {
  const vatLine =
    s.vatStatus === "registered"
      ? "The price includes VAT."
      : "No VAT is charged, because the seller is exempt from VAT.";

  return {
    title: "Terms of sale",
    lastUpdated: fixed.lastUpdated,
    intro: `These terms apply when you use ${fixed.productName} (${fixed.website}) and when you pay for an event. ${fixed.productName} is run by ${s.fullName}, ${s.postalAddress}, ${s.contactEmail} ("we"). Please read them before you pay.`,
    sections: [
      {
        heading: "What the service does",
        paragraphs: [
          `${fixed.productName} lets an organiser create an event and share a join link. Guests answer a few questions, and the service suggests three people for each guest to meet, with a reason and a first question. The suggestions are written by an AI model and can be imperfect. They are suggestions only.`,
        ],
      },
      {
        heading: "Plans and price",
        paragraphs: [
          "An event with up to 15 guests is free.",
          `For a larger event, you pay €29 once for that one event. It raises the limit to 150 guests for that event only. There is no subscription and nothing renews. ${vatLine}`,
          "You pay through Stripe Checkout. Stripe processes your card and sends you a receipt by email. We never see your full card details.",
        ],
      },
      {
        heading: "When the service starts",
        paragraphs: [
          "The upgrade starts as soon as your payment is confirmed: your event can then take up to 150 guests and you can generate the intros straight away.",
        ],
      },
      {
        heading: "Your right to cancel within 14 days",
        paragraphs: [
          "If you buy as a consumer in the EU, you can normally cancel within 14 days of paying, without giving a reason.",
          "When you pay, you ask us to start the service straight away. Once you have generated the intros for your event, the service has been fully delivered and you can no longer cancel. At checkout we ask you to confirm that you understand this.",
          `Until then, you can cancel by emailing ${s.contactEmail} within 14 days of paying, with the name of your event. We refund the full €29 to the card you paid with, within 14 days of your email.`,
        ],
      },
      {
        heading: "Other refunds",
        paragraphs: [
          "If the service did not work for your event because of a problem on our side, for example the intros could not be generated, tell us and we will refund you, also after the 14 days.",
        ],
      },
      {
        heading: "What we ask of organisers",
        paragraphs: [
          "Share the join link only with people invited to your event, and tell them their answers will be shown to other guests. Do not use the service for anything unlawful, or to collect data about people for other purposes.",
          "Guests are responsible for what they write on the join form. We may remove content that is abusive or unlawful.",
        ],
      },
      {
        heading: "Availability and liability",
        paragraphs: [
          "We are a small team and the service is new. We do our best to keep it running but cannot promise it will never be down.",
          "As far as the law allows, our liability for a paid event is limited to the amount you paid for it. Nothing in these terms limits your rights as a consumer under the law of your country, or our liability where the law does not allow it to be limited.",
        ],
      },
      {
        heading: "Your data",
        paragraphs: ["How we handle personal data is explained on the privacy page."],
      },
      {
        heading: "Complaints and applicable law",
        paragraphs: [
          `If something goes wrong, email ${s.contactEmail} first and we will try to fix it quickly.`,
          `These terms are governed by the law of ${fixed.country}. If you are a consumer, you keep the protection of the law of the country where you live, and you can take a dispute to the courts there.`,
        ],
      },
      {
        heading: "Changes to these terms",
        paragraphs: [
          "We may update these terms. The version that applies to a payment is the one shown on this page when you paid.",
        ],
      },
    ],
  };
}
