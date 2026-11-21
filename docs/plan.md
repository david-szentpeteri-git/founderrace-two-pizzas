# Three Hellos: plan to the finish

Decided Sat 21 Nov, 11:20 Paris / 18:20 SGT, by Daniel and David. This is the single plan both of us work from. Times are **Paris / SGT** (both of us work on SGT). The freeze is **Sun 09:00 Paris / 16:00 SGT**.

How to use it: find your rows in the task board (section 6), work in the files you own (section 5.3), tick your own rows when they meet "done when", commit, `git pull --rebase`, push. Never edit the other person's files without telling them first.

## 1. The product

| | |
|---|---|
| Name | Three Hellos |
| Address | https://three-hellos.vercel.app (no custom domain: decided Sat 12:41 Paris, see section 2) |
| Tagline (draft) | Walk into any event knowing the three people you should say hello to. |
| Who pays | The organiser of a community event of 15 to 150 people: student club and society committees, meetup hosts, community managers, office social committees. Guests never pay. |
| Problem | At club socials, mixers and meetups, most guests spend the evening with the people they arrived with. Newcomers and quieter people leave without a single new contact, icebreaker games feel forced, and name tags say nothing about who is worth talking to. The organiser put in the work to fill the room and the room never mixes. |
| Key feature | Guests sign up through the event link and answer four short questions. Claude picks the three people each guest should meet, says why, and suggests a first question. Guests see their three hellos on their phone; the organiser can print name badges and intro cards. |
| Price | Free up to 15 guests per event. **€29 per event** for up to 150 guests, one-time, through Stripe Checkout. |
| Theme fit | Artificial Intelligence: Claude does the matching and writes each reason and opener. Human Connection: the product exists to get strangers talking face to face. |

## 2. Decisions taken

| Decision | Choice | Why |
|---|---|---|
| Idea | Event icebreaker (Daniel's idea 1, merged with the seating-plan idea) | Highest amount per sale, buyers we can reach today, instant result for the demo |
| Name | Three Hellos | Says the promise |
| Domain | None: the product runs on three-hellos.vercel.app (David, Sat 12:41 Paris) | Saves the purchase. Costs the "own domain" checkpoint (+2, show points only) and rules out email from our own domain, so the contact address is a free product Gmail (Daniel creates it) and sending email (Resend) is dropped |
| Pricing | Free up to 15 guests, €29 per event up to 150 | One price, easy for a club to approve; the free tier brings sign-ups |
| Stack | Next.js + Supabase + Vercel + Claude API + Stripe | One TypeScript repo, both of us building in parallel with Claude Code |
| AI model | `claude-opus-5-5` through the Anthropic TypeScript SDK | Current default model; structured output for the matches |
| **Pilot rule** | Any club or group that Daniel or David runs or sits on the committee of (the AI Club included, where one of us is VP of Events) is a **free pilot**: it counts for users, feedback and footage, **never as a paying customer** (plan `pilot` in the database). | Rules forbid purchases by the team; the first-customer checkpoint excludes team members |
| **Live-mode rule** | We never pay for our own product in Stripe live mode, not even as a test. Every payment test runs in test mode. | A live payment by us would be counted by the finish-line key as a team purchase |
| Outreach data | Names and contacts of organisers stay in a private sheet, never in this repo | The repo goes public before the finish |

## 3. Scope

### P0: must be live by Sat 17:00 Paris / Sun 00:00 SGT
1. Landing page that states the problem, who it is for, how it works, the price, a demo link and a "Create your event" button.
2. Create an event without an account. The organiser gets a secret dashboard link.
3. Guest join form through the event link or QR code; each guest gets a personal page.
4. "Generate intros": Claude matches every guest to three others, with a heuristic fallback if the API fails.
5. Guest page shows the three hellos: name, badge number, role, why, opener.
6. Organiser dashboard: join link, QR code, live guest list, generate button, upgrade card.
7. Stripe Checkout for €29 (test mode first, then live).
8. Demo event with sample guests, clearly labelled as sample data.
9. Legal notice, terms of sale and privacy pages, linked from the footer.
10. Deployed on three-hellos.vercel.app, readable on a phone, Vercel Web Analytics on.

### P1: by Sat 19:00 Paris / Sun 02:00 SGT
1. Print view: name badges ("Ask me about...") and one intro card per guest, A4.
2. ~~Email with Resend~~ dropped: it needs our own domain. Instead the dashboard offers "Email this link to myself" (a mailto link) and guest pages ask guests to save their link.
3. "Who wants to meet you" on the guest page, and a mutual-match mark.
4. Late arrivals: generate intros for new guests only, without redoing everyone.
5. Stripe webhook as a backup to the success-page check.
6. Internal stats page (protected by a secret) with organisers, guests and payments, excluding team, test and demo data.

### P2: Sunday morning, only if P0 and P1 are solid
1. Topic sparks with Tavily: three conversation prompts built from this week's news on the event's theme, shown on guest pages and cards (also our entry for Best Use of Tavily).
2. Paste an attendee list (name, role, interests) instead of everyone filling the form.
3. Organiser can remove a guest or edit the event.
4. Social preview image (Open Graph).

### Out of scope
Accounts and passwords, several organisers per event, chat between guests, native apps, languages other than English, seating plans.

## 4. User flows

**Organiser.** Home, "Create your event", form (event name, date and time, place, one-line description, organiser name, email), then the dashboard `/o/[adminToken]` with a "save this link" note. They share the join link or QR in the group chat or on a slide, watch guests arrive, and press "Generate intros" when the doors open. With more than 15 guests on the free plan, the button leads to the €29 checkout first. Optionally they print badges and intro cards.

**Guest.** Scans the QR or opens `/e/[slug]`, fills four questions (what you do, three interests, who you would love to meet, ask me about) plus name, optional email and a consent box. Lands on `/g/[token]`: "You're guest #12. Your three hellos appear here when [organiser] opens the doors." Later the page shows three cards, each with the person's name and badge number, why to meet them and a first question.

**Jury.** Home page, then the demo (a finished sample event with clickable guest pages), then optionally creates their own free event.

## 5. Architecture

### 5.1 Stack

| Part | Choice |
|---|---|
| App | Next.js (App Router, TypeScript), Tailwind CSS. Scaffolded with `create-next-app` (credited in the README with its version). |
| Database | Supabase Postgres, region Singapore (`ap-southeast-1`). Accessed only from the server with the service role key; row level security on, no public policies. |
| AI | `@anthropic-ai/sdk`, model `claude-opus-5-5`, structured output with `client.messages.parse` and `zodOutputFormat`, roster block cached with `cache_control`, effort `low` (raise to `medium` if the reasons read generic). |
| Payments | `stripe` npm package, Checkout Session, EUR, one-time. |
| Hosting | Vercel, function region `sin1` (next to the database), Web Analytics, address three-hellos.vercel.app. Production deployment protection off. |
| Other | `zod` (validation), `nanoid` (tokens), `qrcode` (QR codes). P1 `resend`. P2 `@tavily/core` or the Tavily REST API. |

### 5.2 Environment variables (`.env.example` lists names only)

`NEXT_PUBLIC_SITE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (P1), `RESEND_API_KEY` (P1), `TAVILY_API_KEY` (P2), `STATS_KEY` (P1). Values live in `.env.local` (gitignored) and in Vercel. Test keys in Preview and local, live Stripe keys in Production only.

### 5.3 Who owns which files

| Path | Owner | Notes |
|---|---|---|
| `package.json`, configs, `vercel.json`, `.env.example` | David | Daniel asks before adding a package |
| `app/layout.tsx`, `app/globals.css` (design tokens) | David | Created in D1; Daniel can request changes |
| `lib/types.ts`, `lib/data.ts`, `lib/db.ts`, `lib/mock.ts` | David | The contract both sides build against (5.6) |
| `lib/matching/**`, `lib/stripe.ts`, `lib/email.ts` | David | |
| `supabase/schema.sql`, `scripts/**` | David | |
| `app/new/**`, `app/o/**`, `app/checkout/**`, `app/api/**`, `app/stats/**` | David | |
| `app/page.tsx` (landing), `app/demo/**`, `app/legal/**`, `app/terms/**`, `app/privacy/**` | Daniel | |
| `app/e/**` (join), `app/g/**` (guest page), `app/print/**` | Daniel | Use `lib/data.ts`, or `lib/mock.ts` until it is wired |
| `components/site/**` (header, footer), `components/marketing/**`, `components/guest/**` | Daniel | |
| `components/ui/**` (buttons, inputs, cards) | David creates in D1, both may add files | Don't change an existing component's props without telling the other |
| `content/**` (landing copy, demo guests) | Daniel | |
| `lib/sparks/**` (P2 Tavily) | Daniel | |
| `README.md`, `docs/**` | Both | Re-read before editing; keep edits small |

### 5.4 Data model (`supabase/schema.sql`)

```sql
create table events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,            -- public join code, 8 chars
  admin_token text unique not null,     -- secret organiser token
  name text not null,
  starts_at timestamptz,
  place text,
  description text,
  organiser_name text not null,
  organiser_email text not null,
  plan text not null default 'free',    -- free | paid | pilot | demo | test
  guest_limit int not null default 15,  -- 150 once paid or pilot
  stripe_session_id text,
  amount_paid_cents int,
  paid_at timestamptz,
  status text not null default 'collecting', -- collecting | matched
  matched_at timestamptz,
  created_at timestamptz not null default now()
);

create table guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  token text unique not null,           -- secret guest token
  number int not null,                  -- badge number within the event
  name text not null,
  email text,
  role text not null,                   -- "what do you do?"
  interests text[] not null default '{}',
  looking_for text,                     -- "who would you love to meet?"
  ask_me_about text,
  created_at timestamptz not null default now(),
  unique (event_id, number)
);

create table matches (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  guest_id uuid not null references guests(id) on delete cascade,
  match_guest_id uuid not null references guests(id) on delete cascade,
  rank int not null,                    -- 1 to 3
  reason text not null,
  opener text not null,
  source text not null default 'ai',    -- ai | fallback
  created_at timestamptz not null default now(),
  unique (guest_id, rank)
);

alter table events enable row level security;
alter table guests enable row level security;
alter table matches enable row level security;
```

Badge numbers come from a Postgres function `join_event(slug, ...)` that locks the event row and assigns `max(number) + 1`, so two guests joining at once never share a number. Guests can always join, whatever the plan; **generating intros needs `guest count <= guest_limit`**. That puts the payment at the moment the value is visible ("42 guests are waiting for their intros").

### 5.5 Routes

| Route | What | Owner |
|---|---|---|
| `/` | Landing: problem, who it's for, how it works, demo, pricing, FAQ, CTA | Daniel |
| `/demo` | Sample event: organiser view (read only) and links to every sample guest's page | Daniel (page), David (seed data) |
| `/new` | Create event form | David |
| `/o/[adminToken]` | Organiser dashboard | David |
| `/print/[adminToken]` | Badges and intro cards, print CSS (P1) | Daniel |
| `/e/[slug]` | Guest join form | Daniel |
| `/g/[token]` | Guest page | Daniel |
| `/checkout/success` | Verifies the Checkout Session, upgrades the event, redirects to the dashboard | David |
| `/api/stripe/webhook` | Backup upgrade path (P1) | David |
| `/legal`, `/terms`, `/privacy` | Legal notice, terms of sale, privacy | Daniel |
| `/stats` | Internal numbers, needs `?key=` (P1) | David |

### 5.6 The contract between the two halves (David writes it in D1)

```ts
// lib/types.ts
export type Plan = "free" | "paid" | "pilot" | "demo" | "test";

export type EventPublic = {
  slug: string; name: string; startsAt: string | null; place: string | null;
  description: string | null; organiserName: string; guestCount: number;
  status: "collecting" | "matched"; isDemo: boolean;
};

export type JoinInput = {
  name: string; email?: string; role: string; interests: string[];
  lookingFor?: string; askMeAbout?: string; consent: true;
};

export type Hello = {
  rank: 1 | 2 | 3; name: string; number: number; role: string;
  askMeAbout: string | null; reason: string; opener: string; mutual: boolean;
};

export type GuestView = {
  event: EventPublic;
  guest: { name: string; number: number; role: string };
  hellos: Hello[];                                   // empty until intros are generated
  wantsToMeetYou: { name: string; number: number }[]; // P1
};

export type BadgeCard = { number: number; name: string; role: string; askMeAbout: string | null; hellos: Hello[] };
export type PrintData = { event: EventPublic; cards: BadgeCard[] };

// lib/data.ts (server only). lib/mock.ts exports the same functions with sample data.
export declare function getEventBySlug(slug: string): Promise<EventPublic | null>;
export declare function joinEvent(slug: string, input: JoinInput): Promise<{ guestToken: string }>;
export declare function getGuestView(token: string): Promise<GuestView | null>;
export declare function getPrintData(adminToken: string): Promise<PrintData | null>;
export declare function getDemo(): Promise<{ event: EventPublic; adminToken: string; guests: { name: string; token: string }[] }>;
```

Daniel builds pages against `lib/mock.ts` from the start and switches the import to `lib/data.ts` at the integration sync (B1). Neither side changes a type without telling the other.

### 5.7 Matching engine (D3)

- **Input**: event name and description, and for each guest a short id, name, role, interests, looking for, ask me about. Emails never go to the model.
- **Roster block**: one line per guest, placed in the system prompt after the instructions and cached with `cache_control: { type: "ephemeral" }` so every batch reuses it.
- **Batches**: guests split into batches of 15; all batches run in parallel with `Promise.all`. Each call asks for the three hellos of the guests in its batch.
- **Call shape** (verify against the SDK when wiring):

  ```ts
  const res = await client.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    system: [
      { type: "text", text: INSTRUCTIONS },
      { type: "text", text: roster, cache_control: { type: "ephemeral" } },
    ],
    messages: [{ role: "user", content: `Three hellos for guests: ${ids.join(", ")}` }],
    output_config: { format: zodOutputFormat(BatchSchema), effort: "low" },
  });
  ```

  `BatchSchema`: `{ guests: [{ guestId, hellos: [{ matchId, reason, opener }] x3 }] }`. Check `stop_reason` before reading; on a refusal, an error or invalid ids, that batch uses the heuristic. Turn on the server-side refusal fallback (`server-side-fallback-2026-07-01`, `fallbacks: "default"`) when wiring it.
- **Instructions**: pick a mix of shared interests and complementary needs (someone's "looking for" matches another's role); prefer mutual matches; spread attention so nobody is everyone's pick; the reason (25 words max) must quote something both people actually wrote; the opener is one question (20 words max) the guest can ask. Never invent facts about a person.
- **Post-processing**: drop self-matches, duplicates and unknown ids; cap how often one person is suggested (at most 5 times); fill gaps from the heuristic; mark mutual pairs.
- **Heuristic fallback** (`lib/matching/heuristic.ts`, built first so the product works before the API key arrives): score pairs by shared interests and by keyword overlap between "looking for" and role; reasons like "You both picked climbing and AI safety"; opener from the other person's "ask me about".
- **Limits**: at least 4 guests to generate. Route `maxDuration` 300 seconds if the Vercel plan allows it; if capped at 60, use batches of 8.
- **Cost**: a 100-guest event is about 7 calls and roughly 20k output tokens, well under a euro.

### 5.8 Payments (D5)

- Checkout Session: `mode: "payment"`, one line item with inline `price_data` (EUR 2900, product "Three Hellos: one event, up to 150 guests"), `client_reference_id` and `metadata.event_id`, `customer_creation: "always"`, receipt email on, `success_url: /checkout/success?session_id={CHECKOUT_SESSION_ID}`, `cancel_url` back to the dashboard.
- `/checkout/success` retrieves the session; if `payment_status === "paid"` it sets `plan = paid`, `guest_limit = 150`, `amount_paid_cents`, `paid_at`, then redirects to the dashboard.
- P1 webhook on `checkout.session.completed` does the same, idempotently.
- Test everything with test keys and card 4242 4242 4242 4242. In production, check only that the live Checkout page opens. **Nobody on the team completes a live payment.**
- After going live: Stripe public business name, website and statement descriptor change from TWO PIZZAS to THREE HELLOS (shortened: 3HELLOS).

### 5.9 Privacy and safety

- Tokens are 21-character nanoid strings; dashboard and guest links are unguessable.
- Other guests see name, badge number, role, interests and "ask me about"; never email.
- The join form has a consent line ("Your answers are shared with other guests of this event and used to suggest introductions") and a hidden honeypot field against bots.
- Data from an event is deleted 30 days after it, on request sooner (stated on `/privacy`; deletion done by hand for now).
- Test events we create on production get `plan = test` and are excluded from every number we report.

## 6. Task board

Owner D is David (with Claude Code in this repo), N is Daniel (with his Claude Code), B is both. Tick your own rows only.

### David

| | ID | Task | Due (Paris / SGT) | Done when |
|---|---|---|---|---|
| [ ] | D0 | Accounts and keys: Vercel (GitHub login), Supabase project in Singapore, Anthropic API key with credit, Stripe test keys (no custom domain) | 12:00 / 19:00 | All keys in `.env.local` and Vercel; domain bought |
| [ ] | D1 | Skeleton: create-next-app, Tailwind, design tokens, layout, `components/ui` basics, `lib/types.ts`, `lib/mock.ts`, `lib/data.ts` stubs, schema applied, `.env.example`, first deploy on Vercel, README stack and boilerplate credit | 12:15 / 19:15 | Pushed; the vercel.app address shows a placeholder; Daniel can pull and run it |
| [x] | D2 | Data layer: `lib/db.ts`, real `lib/data.ts`, `join_event` function, create-event action | 13:30 / 20:30 | Join and guest view work against the database |
| [x] | D3 | Matching engine: heuristic first, then Claude (5.7), `generateIntros(adminToken)` action, tested on 14 sample guests | 14:30 / 21:30 | Every guest gets 3 valid hellos in under 60 s; fallback proven by unsetting the key |
| [ ] | D4 | Organiser flow: `/new`, `/o/[adminToken]` with join link, QR, live guest list, generate button, upgrade card, status | 15:00 / 22:00 | An organiser can run an event end to end without help |
| [ ] | D5 | Payments: Checkout, `/checkout/success`, plan upgrade; full test-mode run; live keys in Production | 16:00 / 23:00 (live by 17:30 / 00:30) | Test payment upgrades an event; live Checkout page opens with the right price |
| [x] | D6 | Demo seed: `scripts/seed-demo.ts` from Daniel's `content/demo-guests.json`, plan `demo`, intros pre-generated | 16:30 / 23:30 | `/demo` shows a finished event |
| [ ] | D7 | Production check: env vars, protection off, analytics on, phone check, MVP URL saved on the finish line, "What the jury will see" screenshot checked, Stripe name and descriptor updated, Stripe public details point at the vercel.app address | 17:00 / 00:00 | Finish line shows the MVP URL with a good screenshot |
| [ ] | D8 | P1: webhook, late arrivals, `/stats` (Resend email dropped, no domain) | 19:00 / 02:00 | Each works on production |
| [ ] | D9 | Sunday morning: fixes from organiser feedback, concierge setups, traction numbers in `docs/log.md` every 2 hours | 07:00 / 14:00 rolling | Log has real numbers |
| [ ] | D10 | Screen-record the full product flow for the video (create, join on phone, generate, guest page, print) | 05:30 / 12:30 | Clean 2-minute capture in `footage/` |
| [ ] | D11 | README final, `/preflight`, repo public (owner only), GitHub URL saved on the finish line | 08:30 / 15:30 | Preflight clean on the public repo |

### Daniel

| | ID | Task | Due (Paris / SGT) | Done when |
|---|---|---|---|---|
| [ ] | N0 | Setup: accept the GitHub invite, clone, create `raw/screenshots/` and `footage/`, run `/brief`, sign in to the finish line, redeem the Tavily coupon | 11:45 / 18:45 | Repo runs `/brief`; Tavily key saved privately |
| [x] | N1 | Finish line "Your project": paste the four drafts from section 9 and save | 12:00 / 19:00 | Fields saved; Problem and Key feature checkpoints move |
| [x] | N2 | Content, following `task_rules/writing.md`: landing copy, legal page texts, `content/demo-guests.json` (14 fictional guests, marked as sample data, varied roles and interests) | 13:00 / 20:00 | Files committed; no dashes, no stock AI words |
| [ ] | N3 | Outreach list in a private sheet (never in the repo): 40 organisers with an event in the next 3 weeks, with event date, channel, warm or cold | 13:00 / 20:00 | Sheet shared with David |
| [x] | N4 | Landing page, header, footer, pricing section, `/demo` page | 15:00 / 22:00 | States the problem, target and price; 3+ pages linked from home; fine on a phone |
| [ ] | N5 | Guest pages: `/e/[slug]` join form (mobile first, consent, honeypot) and `/g/[token]` (waiting state, three cards, "save this link" hint) | 15:30 / 22:30 | Works on a phone against real data after B1 |
| [ ] | N6 | `/legal`, `/terms`, `/privacy` pages | 16:00 / 23:00 | Linked from the footer; David approved the legal notice details |
| [ ] | N7 | P1 print view `/print/[adminToken]`: A4 badges and intro cards | 18:00 / 01:00 | Prints cleanly from Chrome |
| [ ] | N8 | Outreach wave 1 once the live link works: warm messages to organisers we know, LinkedIn post (both of us), then European contacts in their evening | 17:00 to 20:00 / 00:00 to 03:00 | 30 organisers contacted; replies logged |
| [ ] | N9 | Book a "Go live" call on Discord once the MVP is live | 18:00 / 01:00 | Slot confirmed |
| [ ] | N10 | P2 Tavily topic sparks (`lib/sparks/**` plus display on the guest page and cards) | 03:00 / 10:00 | Sparks show for the demo event |
| [ ] | N11 | Video lead: script by 04:00 / 11:00, edit 06:00 to 07:00 / 13:00 to 14:00, first cut uploaded 07:00 / 14:00, final 08:00 / 15:00 | 08:00 / 15:00 | Final mp4 on the finish line, 1 to 3 minutes |
| [ ] | N12 | Outreach wave 2: Singapore morning follow-ups, new contacts, concierge setups | 00:00 to 04:00 / 07:00 to 11:00 | Every reply answered; payments logged |

### Both

| | ID | Task | When (Paris / SGT) | Done when |
|---|---|---|---|---|
| [ ] | B1 | Integration sync: Daniel's pages switch from mock to real data; full run on three-hellos.vercel.app with a `test` event and 6 test guests | 15:00 / 22:00 | Whole flow works on three-hellos.vercel.app |
| [ ] | B2 | Race footage all day: decision call, first deploy, first sign-up, first payment, the clock, both of us working | rolling | 10+ clips in `footage/` |
| [ ] | B3 | `/handoff` before each sleep or break | before sleep | Log has the next step |
| [ ] | B4 | AI Club pilot (free, plan `pilot`): use it at the next club event, or run a short online mixer with members before the freeze | Sunday morning SGT | Real guests used it; one quote with permission |
| [ ] | B5 | Codex `verify` on each `verification.md` section, then `/review_verification` | 07:30 / 14:30 | No open findings |

## 7. Timeline

| Paris | SGT | Milestone |
|---|---|---|
| Sat 11:20 | 18:20 | Idea, name, price and stack decided; this plan pushed |
| 12:00 | 19:00 | Finish-line project fields saved (N1); accounts ready (D0) |
| 12:15 | 19:15 | Skeleton live on the domain (D1); Daniel starts pages against mocks |
| 13:00 | 20:00 | H+4 standings. Content and outreach list ready (N2, N3) |
| 14:30 | 21:30 | Matching engine works (D3) |
| 15:00 | 22:00 | **Integration sync (B1)**; first full run on production |
| 16:00 | 23:00 | Payments in test mode (D5); legal pages (N6) |
| **17:00** | **00:00** | **H+8: MVP live, URL on the finish line (D7)**; outreach wave 1 starts |
| 17:30 | 00:30 | Live payments on |
| 19:00 | 02:00 | P1 done; David hands off and sleeps until 07:00 SGT |
| 20:00 | 03:00 | Daniel finishes European outreach, hands off and sleeps until 08:30 SGT |
| Sun 00:00 | 07:00 | David back: replies, fixes, concierge setups |
| 01:30 | 08:30 | Daniel back: outreach wave 2 |
| 03:00 | 10:00 | P2 (Tavily sparks) if everything else is solid |
| 04:00 | 11:00 | **Feature freeze** (fixes only). Video script final, README product sections final |
| 05:00 | 12:00 | H+20 standings. Record the video (D10 screen capture, voice-over, face cam) |
| 07:00 | 14:00 | First video cut uploaded |
| 07:30 | 14:30 | Codex verify and review (B5) |
| 08:00 | 15:00 | Final video uploaded |
| 08:30 | 15:30 | README final, `/preflight`, repo public, GitHub URL saved (D11) |
| 08:40 | 15:40 | Second `/preflight` on the public repo |
| 08:45 | 15:45 | Finish line: 3/3 deliverables, fields saved, screenshot fine |
| 08:55 | 15:55 | Last push |
| **09:00** | **16:00** | **Freeze. Hands off. Leave the site and the database running.** |

## 8. Traction plan

**What counts**, in the jury's order: money collected in Stripe live mode, then registered users (organisers who created an event and guests who joined, excluding team, `test` and `demo` data), then visitors (Vercel Analytics). The race points also count distinct paying customers, but the jury counts the amount, so we keep €29 and never discount to get more sales.

**Rules we hold to.** No purchases by us or by groups we run (pilot rule). No asking friends to buy to fill the count. Every number we show is the real one from Stripe, the database or analytics.

**Offer.** "Free for events up to 15 guests. €29 for your next event, up to 150 guests. We'll set it up with you in five minutes." Concierge setup: we create the event with the organiser on a call or chat and send them the dashboard link.

**Who we contact**, organisers with an event in the next three weeks: student club and society committees at our university and others (excluding the clubs we run), IEC event organisers, Luma and Meetup hosts in Singapore (tech meetups, founder mixers, language exchanges), coworking community managers, office Christmas party organisers. Plus European contacts during their evening.

**Channels.** Warm WhatsApp and Telegram messages to people we know first, then LinkedIn DMs to event hosts, then one LinkedIn post each about building it in 24 hours, then club and community group chats where posting is allowed.

**Targets by the freeze** (aims, not claims): 60 organisers contacted, 10 events created by real organisers, 100 guests joined, 3 paying organisers.

**Message drafts** (adapt to each person; plain and short):

> Hi [name], I saw you're running [event] on [date]. We built Three Hellos this weekend: guests answer four quick questions when they sign up, and each one gets the three people they should meet that night, with a reason and a first question. It's free up to 15 guests and €29 for bigger events. Want me to set it up for [event]? Here's a sample event: three-hellos.vercel.app/demo

> Hey [name], quick one: does [club] have a social or mixer coming up? We made a small tool so people actually meet each other instead of staying with their friends. I can set it up for you in five minutes if you want to try it: three-hellos.vercel.app

**Tracking.** Every 2 hours from Sunday 07:00 SGT, one line in `docs/log.md`: visitors, organisers, guests, paying organisers, euros collected. Ask happy organisers and guests for one sentence we can quote with their first name, with their permission.

## 9. Finish-line fields (drafts for N1)

Written to `task_rules/writing.md`. Update them when the product changes.

- **Project name**: Three Hellos
- **Tagline, in one sentence**: Walk into any event knowing the three people you should say hello to.
- **The problem you solve**: Student club committees and meetup hosts work hard to fill a room for a social, and then most guests spend the evening with the friends they came with. Newcomers and quieter people often leave without a single new contact, and icebreaker games feel forced. For events of 15 to 150 people, the organiser has no easy way to help the right people find each other.
- **The key feature of your MVP**: Guests sign up through the event link and answer four short questions. Claude picks the three people each guest should meet, explains why in one line, and suggests a first question to ask. Guests see their three hellos on their phone, and the organiser can print name badges and intro cards for the room.

## 10. Pitch video

- **Length** 2:00 to 2:30, English, mp4, edited in Clipchamp (built into Windows) or CapCut, 1080p, well under 500 MB.
- **Outline**: 0:00 hook, the moment of walking into a room of strangers (10 s). 0:10 the problem from the organiser's side (20 s). 0:30 the product, live: create an event, a guest joins on a phone, generate, the guest's three hellos, printed badges (50 s). 1:20 traction: the real numbers from Stripe, the database and analytics, plus one organiser quote (25 s). 1:45 race footage: the decision call, building, the clock, first sale (20 s). 2:05 close: what comes next and the URL (10 s).
- **Race footage is a condition for ranking**: capture it all day (B2).
- **Numbers in the video** match the data at recording time. Never round up.

## 11. Submission and the freeze

- MVP URL: https://three-hellos.vercel.app (saved on the finish line Sat 12:31 Paris).
- Video: first cut at 07:00 / 14:00, final at 08:00 / 15:00.
- Traction proof: already saved and verified.
- GitHub: public at 08:30 / 15:30 by David, URL saved on the finish line.
- After 09:00 / 16:00: no pushes, no deploys, no edits to the finish line. The site, database and Stripe keep running for the jury.

## 12. Working in parallel with git

- Everyone works on `main`, inside the files they own (5.3). Small commits, one change each, messages per `CLAUDE.md`.
- `git pull --rebase` before every push; push as soon as something works so the other side sees it.
- Shared files (`README.md`, `docs/**`, `package.json`): re-read right before editing, edit small, push fast.
- New npm packages go through David (one `package.json`, one lockfile).
- If a pull conflicts, stop and resolve it together on a call; never force-push.
- Secrets only in `.env.local` and Vercel. Outreach contacts only in the private sheet.

## 13. Risks and fallbacks

| Risk | Fallback |
|---|---|
| Claude API key or billing late | Heuristic matching ships first (D3); Claude is switched on when the key works |
| Matching too slow for one function | Parallel batches, effort `low`, smaller batches if the time limit is 60 s |
| Stripe live payments blocked or under review | Keep test mode working, contact Stripe support, tell Sylvain early if the proof is at risk |
| DNS for the domain slow | Save the vercel.app URL on the finish line, switch when the domain resolves |
| No real event before the freeze | Sell for upcoming events (December socials and Christmas parties); the pilot can run an online mixer |
| Merge conflicts | File ownership, small commits, frequent pushes |
| Organisers worry about privacy | `/privacy` page, no emails shown, deletion after 30 days |
| Exhaustion | Staggered sleep (section 7) with handoffs |

## 14. Definition of done

Each line maps to a finish-line checkpoint or a jury criterion.

- [ ] Problem described, precise target and concrete problem in the finish-line fields (Problem 8 pts)
- [ ] Home page states the problem (Problem 2 pts)
- [ ] Key feature described; MVP URL submitted and online with no bot protection (MVP 8 pts)
- [ ] Own domain (MVP 2 pts)
- [ ] At least three pages linked from home (MVP 2 pts)
- [ ] Key feature visible on the site: demo plus a live flow (MVP 5 pts)
- [ ] No placeholder text, nothing broken, consistent design (MVP 4 pts)
- [ ] Readable on a phone (MVP 3 pts)
- [ ] Price and a button that leads to payment (MVP 2 pts)
- [ ] Legal notice and terms of sale linked from the site (MVP 2 pts)
- [ ] Real paying organisers, real money (Traction, and the jury's first traction signal)
- [ ] Pitch 1 to 3 minutes with problem, solution, results, demo and race footage (Pitch 18 pts)
- [ ] "Go live" call (Pitch 7 pts)
- [ ] Public repo with a complete README, credited boilerplates and a clean, meaningful history
