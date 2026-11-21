# Three Hellos

Walk into any event knowing the three people you should say hello to.

Built in 24 hours by team Two Pizzas at [FounderRace](https://founderrace.com/en/) Edition 2, from Saturday 21 November 2026 09:00 to Sunday 22 November 2026 09:00 (Paris time). Theme: Artificial Intelligence. Sub-theme: Human Connection.

| | |
|---|---|
| Live product | [threehellos.app](https://threehellos.app) |
| Sample event | [threehellos.app/demo](https://threehellos.app/demo): 14 fictional guests with intros written by Claude |
| Pitch video | Submitted on the FounderRace finish line |
| Team | Daniel and David (Two Pizzas) |

## The problem

Student club committees and meetup hosts work hard to fill a room for a social, and then most guests spend the evening with the friends they came with. Newcomers and quieter people often leave without a single new contact, and icebreaker games feel forced. The organiser has no easy way to help the right people find each other.

## What it does

Guests sign up through the event link and answer four short questions: what they do, what they're into, who they would love to meet, and what to ask them about. Claude picks the three people each guest should meet, explains why in one line, and suggests a first question. Guests see their three hellos on their phone, and the organiser can print a door poster, name badges and intro cards.

Organisers pay, guests never do. Events of up to 4 guests are free. Above that, each extra guest costs €1, or €9 once covers 30 days of unlimited guests on all of an organiser's events. The dashboard shows which is cheaper for the room.

## How it works

1. The organiser creates an event without an account and gets a private dashboard link, a join link and a QR code for the door.
2. Guests join from their phone, answer the four questions and get a badge number and a personal page.
3. When the doors open, the organiser presses "Make intros". Claude reads the guest list and writes three matches per guest, each with a reason based on what both people wrote and a first question to ask. It prefers pairs who would also pick each other and spreads attention so nobody is everyone's pick. If the AI is unavailable, a simpler matcher based on shared interests takes over.
4. Each guest sees their three hellos with badge numbers, so they can find each other in the room, plus conversation starters drawn from this week's news on the event's theme.
5. Late arrivals are matched without redoing everyone, and guests can be removed.
6. Above 4 guests, the dashboard shows the exact price for the waiting guests and the 30-day pass, both through Stripe Checkout. Each payment is recorded once, whether the success page or Stripe's webhook reports it first.

## Results during the race

Real use only. Our own test events are marked and left out of every number.

| | |
|---|---|
| Money collected | €1.00 from 1 paying organiser (Stripe, live mode) |
| Organisers and guests | 1 event from an organiser outside the team, 5 guests signed up |
| Visitors | 29 visitors and 160 page views since launch, including our own visits ([Vercel Analytics](docs/traction/vercel-analytics.png)) |
| Outreach | 55 messages to event organisers by Saturday evening, 51 delivered, more scheduled for Sunday |

The Stripe account also shows a €1 payment from 16:04 Paris. That was a checkout test by a team member; it was refunded and is not counted above.

## Built in 24 hours

Times are Paris time on Saturday 21 November. The full story is in the commit history.

| Time | Milestone |
|---|---|
| 09:00 | Race starts. This repository is created at 09:58. |
| 11:20 | Idea chosen: Three Hellos, for organisers of club socials and meetups |
| 12:16 | Database, sign-up flow and Claude matching work end to end |
| 12:26 | First version live on the web |
| 13:51 | Live Stripe payments switched on |
| 15:13 | Own domain threehellos.app |
| 17:02 | First paying organiser |
| 17:41 | Pitch video submitted |

## Stack

Next.js and TypeScript on Vercel, Supabase Postgres (Singapore), the Claude API (`claude-opus-5-5`) for matching, Stripe Checkout for payments, and Tavily search for the conversation starters. Stripe and Tavily are the race's partner tools.

| Where | What |
|---|---|
| `app/` | Pages: landing, `/demo`, `/new` (create event), `/o/[token]` (organiser dashboard and door poster), `/e/[code]` (guest sign-up), `/g/[token]` (guest page), `/print/[token]`, legal pages, `/checkout/success`, `/api/stripe/webhook`, `/api/keepalive` (daily, keeps the database awake) |
| `lib/matching/` | The matcher: Claude in parallel batches with structured output, plus the heuristic fallback |
| `lib/sparks/` | Conversation starters from Tavily news search, cached per event |
| `lib/data.ts`, `lib/pricing.ts` | Database access (server side only) and the pricing rules |
| `supabase/schema.sql` | Tables, row level security and the join function |
| `scripts/` | `npm run seed:demo` rebuilds the sample event; `npm run mark-test` marks our own test events so they never count as traction |

Guests' answers are only shared with the other guests of the same event; emails are never shown to anyone or sent to the AI. Details on the [privacy page](https://threehellos.app/privacy).

## Run it locally

Needs Node 20 or later.

```bash
npm install
cp .env.example .env.local   # fill in the keys
npm run dev                  # http://localhost:3000
```

The variables are listed in `.env.example`. The database schema is in `supabase/schema.sql`; run it once in the Supabase SQL editor. Until the Supabase keys are set, pages that read data use the sample data in `lib/mock.ts`. Without a Claude key the heuristic matcher runs; without a Tavily key the conversation starters are left out.

## Boilerplates and templates

The race rules require every boilerplate or template to be public and generic, imported in a commit made after the start, and credited here with its link and the exact version or commit used.

| Boilerplate | Link | Version used | What we took from it |
|---|---|---|---|
| create-next-app | [vercel/next.js, packages/create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) | `create-next-app@16.4.6`, generated on Sat 21 Nov 2026 at 11:28 Paris (race day) | The empty Next.js + TypeScript + Tailwind project setup: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, the favicon and the starter layout, which we then replaced. |
