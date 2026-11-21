# Three Hellos

Walk into any event knowing the three people you should say hello to.

Built in 24 hours by team Two Pizzas at [FounderRace](https://founderrace.com/en/) Edition 2, from Saturday 21 November 2026 09:00 to Sunday 22 November 2026 09:00 (Paris time). Theme: Artificial Intelligence. Sub-theme: Human Connection.

| | |
|---|---|
| Live product | [three-hellos.vercel.app](https://three-hellos.vercel.app) |
| Sample event | [three-hellos.vercel.app/demo](https://three-hellos.vercel.app/demo): 14 fictional guests with intros written by Claude |
| Pitch video | Submitted on the FounderRace finish line |
| Team | Daniel and David (Two Pizzas) |

## The problem

Student club committees and meetup hosts work hard to fill a room for a social, and then most guests spend the evening with the friends they came with. Newcomers and quieter people often leave without a single new contact, and icebreaker games feel forced. For events of 15 to 150 people, the organiser has no easy way to help the right people find each other.

## What it does

Guests sign up through the event link and answer four short questions: what they do, what they're into, who they would love to meet, and what to ask them about. Claude picks the three people each guest should meet, explains why in one line, and suggests a first question. Guests see their three hellos on their phone, and the organiser can print name badges and intro cards for the room.

Organisers pay, guests never do. Events of up to 15 guests are free; a bigger event costs €29, up to 150 guests.

## How it works

1. The organiser creates an event without an account and gets a private dashboard link, a join link and a QR code to show at the door.
2. Guests join from their phone, answer the four questions and get a badge number and a personal page.
3. When the doors open, the organiser presses "Make intros". Claude reads the guest list and writes three matches per guest, each with a reason based on what both people wrote and a first question to ask. It prefers pairs who would also pick each other and spreads attention so nobody is everyone's pick. If the AI is unavailable, a simpler matcher based on shared interests takes over.
4. Each guest opens their page and sees their three hellos, with badge numbers so they can find each other in the room, plus three conversation starters drawn from this week's news on the event's theme.
5. Late arrivals can be matched without redoing everyone, guests can be removed, and the organiser can print name badges and intro cards.
6. Above 15 guests, the dashboard offers the €29 upgrade through Stripe Checkout; after payment the limit rises to 150.

## Stack

Next.js and TypeScript on Vercel, Supabase Postgres (Singapore), the Claude API (`claude-opus-5-5`) for matching, Stripe Checkout for payments, and Tavily search for the conversation starters. Stripe and Tavily are the race's partner tools.

| Where | What |
|---|---|
| `app/` | Pages: landing, `/demo`, `/new` (create event), `/o/[token]` (organiser dashboard), `/e/[code]` (guest sign-up), `/g/[token]` (guest page), `/print/[token]`, legal pages, `/checkout/success`, `/api/stripe/webhook` |
| `lib/matching/` | The matcher: Claude in parallel batches with structured output, plus the heuristic fallback |
| `lib/sparks/` | Conversation starters from Tavily news search, cached per event |
| `lib/data.ts` | All database access, server side only |
| `supabase/schema.sql` | Tables, row level security and the join function |
| `scripts/` | `npm run seed:demo` rebuilds the sample event; `npm run mark-test` marks our own test events so they never count as traction |

Guests' answers are only shared with the other guests of the same event; emails are never shown to anyone or sent to the AI. Details on the [privacy page](https://three-hellos.vercel.app/privacy).

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
| create-next-app | [vercel/next.js, packages/create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) | `create-next-app@16.4.6`, generated on Sat 21 Nov 2026 at 18:28 SGT (race day) | The empty Next.js + TypeScript + Tailwind project setup: `package.json`, `tsconfig.json`, `eslint.config.mjs`, `next.config.ts`, the favicon and the starter layout, which we then replaced. |

## Built during the race

This repository was created on race day, after the 09:00 Paris start. Build plan and task split: [`docs/plan.md`](docs/plan.md). Race notes: [`docs/log.md`](docs/log.md). Race rules and logistics: [`docs/race/`](docs/race/). How we worked with Claude Code and Codex: [`docs/team-setup.md`](docs/team-setup.md).
