// Landing page copy for Three Hellos (route "/").
// Written for task N2 under task_rules/writing.md: plain words, no dashes,
// sentence case headings. Prices and claims here must match /terms and the product.

export type Cta = { label: string; href: string };

export type Step = { title: string; body: string };

export type FaqItem = {
  question: string;
  answer: string;
  // Set when the answer describes a feature that is not live yet.
  // The page should show answerUntilLive instead until it ships.
  dependsOn?: string;
  answerUntilLive?: string;
};

export type PricingPlan = {
  name: string;
  price: string;
  priceNote: string;
  points: string[];
  cta: Cta;
};

export const routes = {
  create: "/new",
  demo: "/demo",
  legal: "/legal",
  terms: "/terms",
  privacy: "/privacy",
} as const;

export const meta = {
  title: "Three Hellos: the three people to meet at your event",
  description:
    "Guests answer four short questions when they sign up. Each one gets the three people they should meet, why, and a first question to ask. Free up to 15 guests.",
};

export const cta = {
  primary: { label: "Create your event", href: routes.create },
  demo: { label: "See a sample event", href: routes.demo },
  free: { label: "Start free", href: routes.create },
  paid: { label: "Create an event for up to 150 guests", href: routes.create },
  final: { label: "Create your event, it takes two minutes", href: routes.create },
} satisfies Record<string, Cta>;

export const hero = {
  eyebrow: "For organisers of club socials, meetups and community events",
  headline: "Walk into any event knowing the three people you should say hello to.",
  problem:
    "You filled the room, and most guests still spend the evening with the friends they came with. Newcomers and quieter people go home without a single new contact.",
  solution:
    "With Three Hellos, guests answer four short questions when they sign up. On the night, each one gets three people to meet, the reason, and a first question to ask.",
  primaryCta: cta.primary,
  secondaryCta: cta.demo,
  reassurance: "Free up to 15 guests. No account needed.",
};

export const problem = {
  heading: "The room fills up and never mixes",
  paragraphs: [
    "A club social or a meetup takes weeks of work: the venue, the snacks, the posts in every group chat. Then people arrive, find the two faces they know, and stay there.",
    "Icebreaker games feel forced, and a name tag tells you nothing about who is worth talking to. The guests who came to meet someone new are the ones who leave without doing it.",
  ],
};

export const audience = {
  heading: "Who it is for",
  intro: "Anyone who runs an event for 15 to 150 people where guests are meant to meet each other.",
  groups: [
    "Student club and society committees running socials, mixers and welcome evenings",
    "Meetup hosts and community managers",
    "Founder, alumni and networking evenings",
    "Office social committees planning a team party",
  ],
  note: "Guests never pay and never need an account. The organiser pays once per event, only when it has more than 15 guests.",
};

export const howItWorks = {
  heading: "How it works",
  steps: [
    {
      title: "Create your event",
      body: "Give it a name, a date and a place. You get a private dashboard link and a join link with a QR code. No account or password.",
    },
    {
      title: "Guests sign up",
      body: "Share the link in your group chat or put the QR code on a slide. Each guest gives their name and answers four questions: what they do, three interests, who they would love to meet, and what to ask them about.",
    },
    {
      title: "Generate the intros",
      body: "When the doors open, press one button. Claude reads every answer and picks three people for each guest, with a one line reason and a first question.",
    },
    {
      title: "Say hello",
      body: "Each guest sees their three hellos on their phone, with names and badge numbers so they can find each other. You can also print name badges and intro cards.",
    },
  ] satisfies Step[],
};

export const demo = {
  heading: "See a finished event",
  body: "Our sample event is a founders and students mixer with 14 made up guests. Open any guest's page and see who they were told to meet and why.",
  example: {
    label: "What an intro looks like",
    guest: "Dev, who leads a robotics society and wants an internship at a hardware startup",
    hello: "Tomasz, who recycles electric bike batteries and is hiring spring interns",
    reason: "You both like robotics and bouldering, and Tomasz is looking for students for a spring internship.",
    opener: "What would an intern actually build in their first month at your company?",
  },
  disclaimer:
    "All names and answers in the demo are fictional. The intros shown there were written by the same matching that runs on real events.",
  cta: cta.demo,
};

export const pricing = {
  heading: "Pricing",
  intro: "One price per event. No subscription.",
  plans: [
    {
      name: "Free",
      price: "€0",
      priceNote: "up to 15 guests",
      points: [
        "Every guest gets three hellos",
        "Join link and QR code",
        "Live guest list on your dashboard",
      ],
      cta: cta.free,
    },
    {
      name: "One event",
      price: "€29",
      priceNote: "per event, up to 150 guests, paid once",
      points: [
        "Everything in Free",
        "Up to 150 guests",
        "The same intros for a bigger room",
      ],
      cta: cta.paid,
    },
  ] satisfies PricingPlan[],
  footnote:
    "Guests can keep joining on the free plan. You only pay if more than 15 have signed up when you want to generate the intros. Payment goes through Stripe Checkout.",
};

export const faq = {
  heading: "Questions organisers ask",
  items: [
    {
      question: "What do other guests see about me?",
      answer:
        "Your name, your badge number and the answers you gave on the join form. Your email is never shown to anyone, and it is never sent to the AI that writes the intros.",
    },
    {
      question: "What happens to the data after the event?",
      answer:
        "We delete each event and its guests 30 days after the event date. An organiser or a guest can ask us to delete it sooner by email. Payment records are kept by Stripe for as long as tax law requires. The details are on our privacy page.",
    },
    {
      question: "How does the matching work?",
      answer:
        "Claude, an AI model made by Anthropic, reads the answers for your event and looks for shared interests and for people who can help each other, for example a founder looking for a designer and a design student looking for a project. Every reason has to point to something both people wrote. If the AI is unavailable, a simpler matcher based on shared interests takes over, so nobody is left without intros.",
    },
    {
      question: "What if someone arrives after the intros are out?",
      answer:
        "They can still join with the same link. The organiser presses the button again and only the new arrivals get their intros, without changing anyone else's.",
      dependsOn: "D8 late arrivals",
      answerUntilLive:
        "They can still join with the same link and appear on your guest list. For now, matching runs for the whole room at once, so the best moment to press the button is once most guests have signed up.",
    },
    {
      question: "Does it work for online events?",
      answer:
        "Yes. Guests join and see their hellos the same way, and they can look for each other in the breakout rooms or the chat. The printed badges are the only part made for a room.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "If you paid and have not generated the intros yet, email us within 14 days and we refund you in full. Once the intros are generated, the service has been delivered and the payment is final, unless something on our side stopped it from working, in which case we refund you.",
    },
    {
      question: "Do guests need to download anything or make an account?",
      answer: "No. They open the link or scan the QR code, fill in a short form and keep the link to their own page.",
    },
    {
      question: "Is it free to try?",
      answer:
        "Yes. Any event with up to 15 guests is free, with the same intros as a paid event. Try it with your committee before the real night.",
    },
  ] satisfies FaqItem[],
};

export const finalCta = {
  heading: "Give your guests a reason to meet someone new",
  body: "Set up your next event in two minutes. Free up to 15 guests, €29 for up to 150.",
  primary: cta.final,
  secondary: cta.demo,
};

export const footer = {
  tagline: "Three people to meet at every event.",
  links: [
    { label: "Sample event", href: routes.demo },
    { label: "Legal notice", href: routes.legal },
    { label: "Terms of sale", href: routes.terms },
    { label: "Privacy", href: routes.privacy },
  ] satisfies Cta[],
  madeBy: "Made by Daniel and David in 24 hours for FounderRace.",
};

const landing = { meta, hero, problem, audience, howItWorks, demo, pricing, faq, finalCta, footer, cta, routes };
export default landing;
