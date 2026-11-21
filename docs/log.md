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
| Sat 12:16 | Sat 19:16 | David | Backend works end to end on the real database: create event, join, guest page, organiser dashboard, print. Claude matching tested on the 14 sample guests of the demo event: 42 of 42 intros from Claude in about 30 seconds, 40 of them mutual, nobody suggested more than 4 times. Demo event seeded (plan `demo`, excluded from traction). |
| Sat 12:41 | Sat 19:41 | David | No custom domain: the product stays at https://three-hellos.vercel.app (MVP URL saved on the finish line at 12:31, screenshot fine). Contact address becomes a free product Gmail (Daniel); email sending dropped. Stripe test checkout works; `/stats` added for real traction numbers. |
| Sat 12:46 | Sat 19:46 | David | Repo made public early (rules require it at the finish anyway) so that Vercel deploys Daniel's pushes too: the free plan blocks collaborator deploys only on private repos. All 55 commits scanned first for keys, session secrets and personal details: clean. |
| Sat 13:20 | Sat 20:20 | David | Stripe Checkout verified end to end in test mode (test card, €29, event upgraded to 150 guests). Fixed: test-mode payments could have been counted as revenue; now only live-mode payments mark an event paid. Live webhook set up by Daniel, its secret in Vercel. |
| Sat 13:31 | Sat 20:31 | David | Product demo recorded on the live site for the pitch video: six browser clips (landing, create event, guest joins on a phone, Claude makes intros, three hellos on a phone, poster and badges), in David's local `footage/demo/`. Race points 39/100: Problem 10/10, MVP 26/28 (no own domain), Traction 3/37, Pitch 0/25. |
| Sat 13:41 | Sat 20:41 | Daniel | Outreach wave 1 started: 5 first messages to event organisers (1 email, 4 Luma host messages; Paris, Amsterdam, Singapore), each checked against the event page. Traction at this moment: 0 payments, 0 replies yet. Pricing decided by Daniel: free up to 15 guests, 2 cents per extra guest with a 1 EUR minimum, 9 EUR for 30 days unlimited; David is building it in the checkout. Motion pass and header fix live. Race points 39/100. |
| Sat 13:51 | Sat 20:51 | David | **Live payments on.** Stripe live key in Production (restricted key without payout rights); a real live checkout opened from the site and was cancelled unpaid. New pricing (Daniel's plan): free up to 15 guests, 2 cents per extra guest with €1 minimum, €9 once for a 30-day unlimited pass. |
| Sat 14:20 | Sat 21:20 | Daniel | Topic sparks (Tavily) live on `/demo` and every guest page since about 14:13 Paris: three questions from this week's news on the event's theme, three different sources, one search per event per six hours. Checked on the live site at phone width. Outreach: 9 organisers contacted (5 emails, 4 Luma host messages), 0 replies, 0 payments. Pitch video first cut rendered (93 seconds, real product clips in the demo), not yet uploaded. All of Daniel's build rows N0 to N7 and N10 are done. |
| Sat 15:18 | Sat 22:18 | David | Own domain live: https://threehellos.app (bought for one year, auto-renew off; served by Vercel with HTTPS). The legal pages, preview image, README and plan now use it. |
| Sat 15:33 | Sat 22:33 | Daniel | Outreach wave 2 sent between 15:19 and 15:33 Paris from threehellos3@gmail.com: 51 cold emails to event organisers with a public contact address (founder dinners, networking nights, supper clubs, community hubs; Europe, North America, Asia, Australia), all linking to threehellos.app/demo, price line "free up to 15 guests, and from 1 euro above that". 5 bounced, so 46 delivered. One wave 1 email also bounced (Silicon Allee). Reached in total: 54 organisers (50 by email, 4 by Luma host message). Replies from a person: 0. Payments: 0. Selling video posted at 15:00 on Daniel's Instagram, YouTube Shorts and TikTok. Pitch cut with real race footage (commit history, task board) rendered, not yet uploaded. |
| Sat 15:51 | Sat 22:51 | David | Visual redesign live (David's request): site-wide light and grain, bolder hero, pull quote, checklist audience, spotlight pricing and hello cards, lime glow on the closing block. New Vercel design skills installed for it (view transitions, composition patterns). Product clips to be re-recorded (D13). |
| Sat 16:04 | Sat 23:04 | David | **Team test payment, not traction:** David paid €1 with his own card on his test event "LOL" (live mode) to check the checkout end to end. It will appear in the finish-line payment count; it is not a customer and is never counted as traction in our numbers, the README or the pitch. Real customer payments so far: 0. |
| Sat 16:08 | Sat 23:08 | David | The €1 team test payment from 16:04 is refunded in full (Stripe refund succeeded). Real customer payments: still 0. |
| Sat 16:18 | Sat 23:18 | David | Price per extra guest raised to €1 (David); free up to 15 and the €9 30-day pass unchanged, the dashboard suggests the pass from 25 guests. Copy pass on the site; the join form no longer promises an email we don't send. Recording scripts committed for Daniel (`scripts/record/`). |
| Sat 16:26 | Sat 23:26 | David | All events deleted from the database at David's request (13 events, 91 guests, 123 intros; all were tests except the not yet used fashion event). Free limit cut from 15 to 4 guests: €1 per guest from the 5th, or €9 for 30 days unlimited. |
| Sat 16:31 | Sat 23:31 | David | Sample event rebuilt for /demo (14 fictional guests, 42 intros from Claude, plan demo, never counted). |
| Sat 16:46 | Sat 23:46 | David | Daily keep-alive added (Vercel cron calls /api/keepalive, one database query) so the free Supabase database never pauses while the jury reviews the site. |

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

**Daniel to David, Sat 11:56 Paris / 18:56 SGT**
1. Pulled your data layer, matching, checkout, `/new` and dashboard. Type check is clean on my side.
2. B1, my half: `/demo`, `/e/[slug]`, `/g/[token]` and `/print/[adminToken]` now import from `@/lib/data` (they fall back to the mock without keys, as you built it). I have no Supabase keys locally, so the run against the real database is yours to do on production, or send me the keys privately.
3. Landing page redesigned and pushed (phone preview in the hero, photo band, pricing with a recommended plan). The photo is `public/img/mixer.jpg`, AI generated today and captioned as an illustration.
4. Thanks for the seller details: `/legal`, `/terms` and `/privacy` now show their full text.
5. Still open from my first note: the 14 day waiver consent at checkout (point 4), event time zone (point 7) and an early 29 EUR Payment Link (point 8).
6. What is the deploy status of threehellos.app? We want to start outreach as soon as the live link and `/demo` work.

## Handoffs

Written by `/handoff` at the end of each session, newest at the bottom. The latest entry is where the next session starts.

### Sat 16:39 Paris / 23:39 SGT · David
- Done: David is finished for the race and hands everything remaining to Daniel. This session: live product at threehellos.app (own domain, one year, no renewal), live Stripe payments with webhook, pricing now free with up to 4 guests then €1 a guest or €9 for a 30-day pass, organiser dashboard with poster, saved events list and remove guest, site-wide redesign, copy pass, sample event rebuilt, all test events deleted, recording scripts in `scripts/record/`, stats fixed so deleted test payments never count.
- Live: https://threehellos.app works end to end (create event, guests join, Claude intros, guest pages, poster and badges, live checkout). Sample event at /demo with 14 fictional guests. www redirects to the bare domain.
- Traction: 0 events from real organisers, 0 real guests, 0 real payments (the only Stripe charge is David's €1 test, refunded). Visitors: see Vercel Analytics. Outreach so far by Daniel: 54 organisers reached, no replies logged.
- Next step: Daniel uploads the pitch video on https://founderrace.com/en/finish-line/ (first cut now, final by Sun 08:00 Paris / 15:00 SGT), then posts the Discord note about the refunded €1 test.
- Blockers: Vercel settings and environment variables need David's account (free plan, no team seats); everything else (Stripe admin, GitHub, Supabase data through the app) is open to Daniel.
- Review points open: none recorded; all four `verification.md` sections are still unreviewed stubs.
