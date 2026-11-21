# Race log

Times are Paris / SGT, newest at the bottom. Note decisions, pivots, milestones, traction numbers (visitors, sign-ups, payments) and where race footage was captured. This feeds the pitch video and the README.

| Paris | SGT | Who | What |
|---|---|---|---|
| Sat 09:00 | Sat 16:00 | | Start. Theme Artificial Intelligence, sub-theme Human Connection. |
| Sat 09:58 | Sat 16:58 | David | Repo created on race day, after the start (private until the finish). Race guide, rules, finish-line requirements and Discord announcements written up in `docs/race/`. |
| Sat 10:15 | Sat 17:15 | David | Shared Claude Code and Codex setup added: session brief, ingest, handoff, preflight and review skills, Codex verify, `verification.md`, writing and tooling rules. |
| Sat 10:22 | Sat 17:22 | David | Idea shortlist for the team decision (due 12:00 Paris). AI that brings people together in person, with a seasonal hook and one buyer bringing many users: (1) seating plans and intro cards that get strangers talking at parties, weddings and team dinners; (2) a briefing for meeting your partner's family abroad over the holidays; (3) many voices, one speech: friends' memories woven into a toast or farewell; (4) Secret Santa with real gift ideas found by Tavily; (5) a first-week social plan for newcomers to a city. Avoiding what most teams will build: AI companions, icebreaker generators, dating wingmen, keep-in-touch reminders. |
| Sat 10:44 | Sat 17:44 | David | Stripe account (Two Pizzas, individual, Hungary) activated in live mode: identity verified, payout account and two-step login set, Radar Lite only. Stripe CLI installed for the build. |
| Sat 10:49 | Sat 17:49 | David | Read-only Stripe key (charges read, live mode) created from the finish-line button for the traction proof. |
| Sat 10:56 | Sat 17:56 | David | Traction proof saved on the finish line, status Verified (deliverable 1 of 3 in). 0 payments so far. Clip of the moment recorded. |
| Sat 11:05 | Sat 18:05 | David | Ingested: finish-line checkpoint list (28 checkpoints, 3/100 race points so far) into `docs/race/finish-line.md`. |
| Sat 11:20 | Sat 18:20 | Both | **Decision: Three Hellos.** Guests answer four questions when they sign up for an event; Claude tells each guest the three people to meet, why, and a first question. Organisers pay: free up to 15 guests, €29 per event up to 150. Stack: Next.js, Supabase, Vercel, Claude API, Stripe. Picked over the family-abroad briefing and the weekly family letter because organisers have a budget and we can reach them today through student clubs and IEC. Clubs we run are free pilots only. Full plan in `docs/plan.md`. |
| Sat 11:38 | Sat 18:38 | Daniel | Pushed N2 and first versions of N4 to N7: content (landing copy, 14 sample guests, legal texts), landing, demo, join form, guest page, legal pages and print view. Written against the 5.6 contract, importing from `@/lib/mock`. Not type checked yet (no `package.json`). N1 saved on the finish line at 11:35. Open points for David are in "Notes for each other" below. |

## Notes for each other

Short asks between the two of us, newest at the bottom. Strike a line through when it is done.

**Daniel to David, Sat 11:45 Paris / 18:45 SGT**
1. Your scaffold will create its own `app/page.tsx`. Please keep mine (the landing page is already there).
2. `Header` and `Footer` are rendered inside my pages (`components/site/`). Leave them out of `app/layout.tsx`, or tell me and I will remove mine so they do not show twice.
3. Please fill in `content/legal/seller.ts` (full name, postal address, contact email, business status, VAT status, Vercel's postal address). `/legal`, `/terms` and `/privacy` show a holding note until every required value is set.
4. The terms say checkout asks the buyer to confirm that delivery starts at once and the 14 day right to cancel ends when intros are generated. Checkout (D5) needs to collect that consent, or tell me and I will change the terms.
5. My pages assume a recent Next.js and React (`useActionState`, awaited `params`) and Tailwind 3.4 or later. Tell me if the skeleton differs.
6. `/demo` links use tokens from `getDemo()`. Until the mock or seed returns them, the guest links show "can't find this guest page".
7. Event times currently display in Paris time only (`components/guest/format.ts`). I will fix this for Singapore events; tell me if you plan to store a time zone on the event.
8. Could you create a 29 EUR Stripe Payment Link now? It lets us take a payment from an organiser who says yes before Checkout is wired at 17:30.
9. Tell me here or on a call as soon as D1 is pushed. I will pull, run the type check and fix my files.

## Handoffs

Written by `/handoff` at the end of each session, newest at the bottom. The latest entry is where the next session starts.
