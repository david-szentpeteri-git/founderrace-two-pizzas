// Privacy page for /privacy. Build it with completeSeller(); render nothing if that returns null.
// Facts here come from docs/plan.md sections 5 and 5.9. If the product changes, update this file.
import { fixed, type CompleteSeller, type LegalPage, type LegalSection } from "./seller";

// Add this section to the page only once guest and organiser emails are switched on (plan P1, Resend).
export const emailSection: LegalSection = {
  heading: "Emails we send",
  paragraphs: [
    "If you give us your email, we use it to send you the link to your page or dashboard and a note when the intros are ready. We use Resend to send these emails. We do not send newsletters or marketing.",
  ],
};

export function privacyPolicy(s: CompleteSeller, options: { emailsOn?: boolean } = {}): LegalPage {
  const sections: LegalSection[] = [
    {
      heading: "Who is responsible for your data",
      paragraphs: [
        `${s.fullName}, ${s.postalAddress}, is responsible for the personal data handled by ${fixed.productName}. For any question or request about your data, write to ${s.contactEmail}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "From organisers: your name, your email, and the event details you enter (name, date, place and a short description).",
        "From guests: your name, your answers on the join form (what you do, your interests, who you would like to meet, what people can ask you about), your email if you choose to give it, and your agreement to the consent line.",
        "For payments: Stripe handles the payment. We receive the payer's name and email, the amount and whether the payment went through. We never see full card details.",
        "For visits: we use Vercel Web Analytics to count page visits. We do not use advertising cookies and we do not sell data or show ads.",
      ],
    },
    {
      heading: "Why we use it",
      paragraphs: [
        "To run the event you created or joined: show the guest list to the organiser, write the introductions and show each guest their page. For organisers this is needed to provide the service you asked for. For guests, it is based on the consent you give on the join form.",
        "To take payments and keep the records that tax law requires. This is a legal obligation.",
        "To understand how many people visit the site, so we can improve it. This is our legitimate interest in running a working service.",
      ],
    },
    {
      heading: "Who can see your answers",
      paragraphs: [
        "Other guests of the same event can see your name, your badge number and your answers. Your email is never shown to other guests.",
        "The organiser of the event can see who has joined and their answers.",
        "Pages are reached through private links. Anyone you share your own link with can open your page, so keep it to yourself.",
      ],
    },
    {
      heading: "How the AI matching uses your data",
      paragraphs: [
        "To suggest introductions, we send the names and answers of the guests of one event to Claude, an AI model run by Anthropic, through its API. Along with them we send the event name and description. Emails are never sent to the model. The model only receives what guests wrote on the join form and the event details, and is told not to add facts about anyone.",
      ],
    },
    {
      heading: "Services that process data for us",
      paragraphs: [
        "Supabase stores the database, on servers in Singapore.",
        "Vercel hosts the site and counts visits.",
        "Anthropic runs the Claude model that writes the introductions.",
        "Stripe processes payments.",
        "Tavily, a search service, finds recent news headlines for the conversation topics on guest pages. We send it only the event name and description. Guest names, emails and answers are never sent.",
        "Some of these providers are outside the European Union, in Singapore and the United States. Where data leaves the EU, we rely on the safeguards in each provider's data processing terms, such as the EU standard contractual clauses.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "We delete each event, its guests, their answers and the introductions 30 days after the event date, or 30 days after the event was created if it has no date. We do this by hand for now.",
        `You can ask us to delete your data sooner at any time by writing to ${s.contactEmail}.`,
        "Payment records are the exception: Stripe and we keep them for as long as tax and accounting law requires.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        `You can ask to see the data we hold about you, to correct it, to delete it, to receive a copy, or to object to how we use it. You can withdraw your consent at any time, which removes you from the event. Write to ${s.contactEmail} and we will answer within one month.`,
        `If you think we handle your data wrongly, you can complain to ${fixed.supervisoryAuthority.name} (${fixed.supervisoryAuthority.website}) or to the data protection authority in the country where you live.`,
      ],
    },
    {
      heading: "Age",
      paragraphs: [
        `${fixed.productName} is meant for people aged 16 and over. If you are younger, please do not join an event without a parent or guardian agreeing.`,
      ],
    },
    {
      heading: "Changes",
      paragraphs: ["If we change how we use data, we will update this page and the date at the top."],
    },
  ];

  if (options.emailsOn) sections.splice(5, 0, emailSection);

  return {
    title: "Privacy",
    lastUpdated: fixed.lastUpdated,
    intro: `This page explains what data ${fixed.productName} collects, why, who sees it and when we delete it.`,
    sections,
  };
}
