# Team messages

Short async notes between Daniel and David, so neither of us has to scroll WhatsApp to find what changed or what the other needs. Each inbox is newest at the bottom. Tick a request when it is handled and add one line saying how.

Times are Paris / SGT. No keys, perk codes or contacts of people outside the team here: the repo goes public. Claude's `/brief` shows your open requests; `/handoff` adds a note for the other person when they need to act.

## For Daniel

### Sat 11:56 Paris / 18:56 SGT · from David

Done on my side (all pushed, build passes):
- Merged your pages with my skeleton. Kept your `app/page.tsx`, `Header` and `Footer`; the root layout no longer renders a header or footer, so each page keeps rendering its own (and print stays clean).
- Restyled `components/ui` (button, field, card) to your zinc and lime look, so my organiser pages match the landing page.
- `content/legal/seller.ts` is filled in: David Szentpeteri, "Budapest, Hungary" (city only, by choice), private individual, no VAT charged, contact hello@threehellos.app (forwarding gets set up after the domain is bought), Vercel's address from its terms. The legal pages now show their full text.
- `lib/data.ts` talks to Supabase and falls back to `lib/mock.ts` while there are no database keys. Saw you already switched your pages to it, thanks.
- New routes: `/new` (create event), `/o/[adminToken]` (organiser dashboard: join link, QR, live guest list, make intros, match new arrivals, print link, €29 upgrade), `/checkout/success` (checks the payment with Stripe and lifts the guest limit to 150).
- Matching engine in `lib/matching/`: Claude (`claude-opus-5-5`) in parallel batches with a heuristic fallback that needs no AI.
- `lib/types.ts` gained `CreateEventInput`, `AdminGuest`, `AdminView`. Additive only; your types are unchanged.
- `next.config.ts` has Cache Components off, so dynamic pages need no Suspense boundaries.

Coming next from David: database and API keys, deploy on Vercel, threehellos.app, then the demo event seeded from `content/demo-guests.json` (D6) so `/demo` shows real pages. The €29 Payment Link will be posted here when it exists.

Requests:
- [x] Once `/demo` reads the seeded demo event (D6), check it still looks right. Until then `getDemo()` returns the mock.
  Done 12:38 Paris on the live site: 14 guests listed with badge numbers and roles, every "See hellos" link opens, no sideways scroll. Looks right.
- [x] Start N3 (outreach list) in the private sheet if not done; outreach starts when the live URL works, target 00:00 SGT.
  Done 11:40 Paris: 42 organisers ranked A to C (Paris, Singapore, Budapest, Europe) with a first message drafted for each A and B row, Hungarian versions for Budapest. Kept private, outside the repo. Daniel also has his own warm list of club leads.
- [ ] If you need a new field or type from the backend, write it here instead of editing `lib/`.

### Sat 12:20 Paris / 19:20 SGT · from David

Answered your four requests in my inbox below. New since my last note: `EventPublic.timeZone`, the Checkout consent box, a Stripe webhook as backup (`/api/stripe/webhook`), and `npm run seed:demo` (D6, runs once the keys are in).

Requests:
- [x] Use `event.timeZone ?? "Europe/Paris"` in `components/guest/format.ts` (and anywhere else you format `startsAt`).
  Done 12:06 Paris: `formatEventTime(iso, timeZone)` in `components/guest/format.ts`, used by `/e`, `/g`, `/print` and `/demo`. An invalid or missing zone falls back to Paris.

### Sat 12:26 Paris / 19:26 SGT · from David

**Live: https://three-hellos.vercel.app** (deployed from `main`; every push to `main` redeploys in about a minute). All pages return 200; `/demo` shows the seeded sample event with Claude's 42 intros from the database.

On the live site right now: database, Claude matching, demo event. Not yet: Stripe (test key comes next, so "Upgrade for €29" shows an error until then), your Tavily key (send it to me privately), the threehellos.app domain.

Requests:
- [x] Run your full flow on the live site with an event named "TEST ..." (6 guests, intros, guest pages, print view) and write what breaks here.
  Done 12:27 to 12:33 Paris. Nothing broke. Details in my note of 12:34 below.
- [ ] Send me the Tavily key privately (not here); I add it to Vercel and check the sparks on `/demo`.

### Sat 12:45 Paris / 19:45 SGT · from David

**No custom domain.** David decided not to buy threehellos.app. The product stays at https://three-hellos.vercel.app. Already changed by David: `fixed.website` in `content/legal/seller.ts`, the domain text in `app/opengraph-image.tsx`, README, plan (outreach drafts, P1 email dropped since it needs a domain), and the demo organiser's email. Your "TEST integration run 1" event is marked `test` (`npm run mark-test` does that for any event named "TEST ...").

Also new: `/stats?key=...` (real numbers only; David has the key), an "Email it to myself" link on the organiser dashboard (no email service without a domain), and notes when a payment is cancelled or pending. Stripe Checkout works in test mode; live goes on after David's Stripe settings.

Requests:
- [ ] **Urgent:** create a free Gmail for the product (for example threehellos.hq@gmail.com), then set `contactEmail` in `content/legal/seller.ts` to it and push. The site still shows hello@threehellos.app, which cannot receive mail. That one value feeds the legal pages, the terms and the payment page. Write the address here when done so David puts it in Stripe.
- [ ] Change any private outreach drafts and posts that say threehellos.app to three-hellos.vercel.app.
- [ ] The €29 Payment Link is no longer needed: organisers pay inside the product with Stripe Checkout. Say here if you still want one for selling in chat.

## For David

### Sat 11:58 Paris / 18:58 SGT · from Daniel

Done on my side (all pushed, type check clean, all nine routes respond locally):
- N1 saved on the finish line at 11:35. N2, N4 done. N5, N6, N7 written and working on mock data.
- Landing page redesigned: phone preview of the guest screen in the hero, numbered steps, photo band, pricing with a recommended plan, dark closing block, sticky button on phones. Photo is `public/img/mixer.jpg`, AI generated today and captioned as an illustration.
- Join form tested locally at phone width: validation errors show, a valid submit redirects to the guest page.
- My earlier notes are in `docs/log.md` under "Notes for each other"; from now on I write here.

Requests:
- [x] Post the live address here as soon as the deploy works (the vercel.app one is fine). I will run the full flow on it at once: create an event named "TEST ...", join as six guests, make intros, open guest pages and the print view. Please set that event to plan `test` afterwards.
  Done 12:26 Paris (David): live at https://three-hellos.vercel.app (threehellos.app follows once the domain is bought). Name test events "TEST ..." and David marks every one as plan `test`.
- [x] Checkout should collect the buyer's consent that delivery starts at once and the 14 day right to cancel ends when intros are generated. `/terms` promises this. If Checkout cannot do it, tell me and I change the terms.
  Done 12:20 Paris (David): Checkout now shows a required checkbox: "I agree to the terms of sale (link). I ask for my event to be upgraded right away, and I understand my 14 day right to cancel ends once the intros are made." Stripe only allows the checkbox once a terms URL is set in the account's public details (David sets https://threehellos.app/terms); until then the same sentence shows as plain text above the pay button.
- [x] Event times display in Paris time only (`components/guest/format.ts`). How do you store `starts_at` from `/new`: as the organiser's local time, or with a zone? Tell me and I fix the display so Singapore events show the right hour.
  Done 12:20 Paris (David): `starts_at` is stored as an exact moment (UTC), converted in the organiser's browser. New: `EventPublic.timeZone` (optional, an IANA name like "Asia/Singapore") is the organiser's zone from their browser. Please format with `timeZone: event.timeZone ?? "Europe/Paris"` in `format.ts`. The demo event is seeded with "Europe/Paris", the mock event with "Asia/Singapore".
- [x] An early 29 EUR Payment Link, as you planned.
  Not needed (David, 12:45 Paris): Stripe Checkout is wired into the product, so organisers pay from their dashboard. Ask again if you want a link for chat sales.

### Sat 12:06 Paris / 19:06 SGT · from Daniel

Done (pushed, type check clean):
- Time zone request above.
- Polish pass on `/demo`, `/e`, `/g`, `/legal`, `/terms`, `/privacy` so they match the landing page; legal pages now carry the site header and footer; guest pages end with "Made with Three Hellos" linking home.
- New: `app/icon.svg` (favicon), `app/opengraph-image.tsx` (social preview), `app/not-found.tsx`.
- `/demo` fix: guest numbers and roles are only taken from the data layer when the name matches, so rows no longer all show badge 1 in mock mode.
- Private drafts ready on my side: LinkedIn posts for both of us, WhatsApp messages, the pitch video script and a 60 second Go live pitch. I will send you yours.

Requests:
- [x] Still the main one: the live address, so I can run the full flow and we can start outreach.
  Done: https://three-hellos.vercel.app

### Sat 12:19 Paris / 19:19 SGT · from Daniel

Great news on the backend and the 42 of 42 matching test.

Done (pushed, type check clean, all routes respond):
- N10 topic sparks: `lib/sparks/**` plus `components/guest/Sparks.tsx`. Three conversation prompts from this week's news on the event's theme, on guest pages (waiting and matched), on `/demo` and as one extra card on the print view. Tavily REST with plain fetch, no new package. One search per event per 6 hours (`unstable_cache`), 4 second timeout, and with no key or any failure the pages render exactly as before. Only the event name and description are sent. Our entry for Best Use of Tavily.
- `/privacy` now lists Tavily as a processor.
- Paid plan button label shortened so it stays on one line at tablet width.

Not tested: the live Tavily call (no key on my Mac).

Requests:
- [ ] Add `TAVILY_API_KEY` to Vercel (Production). Daniel will send you his key privately, never here.
- [ ] After that, open `/demo`: three sparks should show under the guest list. If none show, the demo event description is not topical enough for a news search; tell me and I will change it in `content/`.
- [x] Still the main one: the live address.
  Done: https://three-hellos.vercel.app

### Sat 12:34 Paris / 19:34 SGT · from Daniel

Full flow run on https://three-hellos.vercel.app, all passed:
- All public pages return 200, a made-up address returns our 404 page, `/demo` lists 14 guests with working links.
- `/new`: created "TEST integration run 1" (join code `87wpuca7`). Dashboard opened with the join link and QR. The form picked up my browser's time zone.
- `/e/87wpuca7`: joined as test guests, each landed on their guest page with the right badge number and the waiting state.
- "Make intros for 7 guests": finished in about 17 seconds. Reasons and openers read well and quote what guests wrote; mutual marks show.
- Guest page, matched state: fine, including a very long name and a guest who gave one interest and no "ask me about".
- `/print/...`: badges and intro cards render for all seven.

Found:
- One guest appears twice (badges 3 and 4, "Test Chidi"). My test tool submitted that form twice after an error on my side, so it may not happen to real guests, but a double tap on a slow phone could do the same. Worth a guard: ignore a second join with the same name and role within a minute, or disable the button after the first submit on your side of the action. Low priority.
- "Upgrade for €29" not tested, as you said Stripe is not connected yet. No payment was attempted.

Topic sparks, tested against the live Tavily API from my Mac:
- The call works. I tuned it after seeing real results: the query now uses the event description first, at most five words plus "news"; results below a 0.4 score, social feeds, shops, job pages and repeated stories are dropped; fewer than two good stories shows nothing.
- I changed the demo event description in `content/demo-guests.json` to mention AI startups, so the demo search returns real stories.

Requests:
- [ ] Set event `87wpuca7` to plan `test` so it stays out of our numbers.
- [ ] Reseed the demo event so it picks up the new description (`npm run seed:demo`), after adding `TAVILY_API_KEY` to Vercel. Daniel sends the key privately.
- [ ] Then check `/demo` shows "What guests also get" with two or three stories.

### Sat 12:37 Paris / 19:37 SGT · from Daniel

Done (pushed after type check and route checks):
- Landing page preview now shows Claude's real output. The three intros in the hero phone and in "See a finished event" were hand-written; I replaced them with the exact reasons, openers and mutual marks that the live demo shows for Dev Malhotra (#8): Tomasz Brecki, Oskar Vennholm, Jonas Weatherby. Source: `components/marketing/sampleHellos.ts` and `content/landing.ts`.

Requests:
- [ ] When you reseed the demo for the new description, please keep the existing intros if the seed script allows it (update the description only). If the intros are regenerated, tell me and I copy Dev's new three into the landing page so the two keep matching.
- [ ] Can you save https://three-hellos.vercel.app as the MVP URL on the finish line now (D7), or shall I? It registers the MVP checkpoints while the domain is pending.

### Sat 12:39 Paris / 19:39 SGT · from Daniel

**Important: my pushes do not deploy.** GitHub shows the Vercel status on my commits as "failure: Deployment was blocked", while yours show "Deployment has completed". The code is fine (a clean `next build` passes on my Mac with all 15 routes). Vercel's free plan appears to block deployments triggered by commits from a collaborator who is not the Vercel account owner. So the live site only updates when you push; your deploy then includes all my commits up to that point.

Not live yet because of this (all on `main`, all checked): the topic sparks tuning (`158092b`) and the real Claude intros in the landing preview (`3e86eaa`).

Requests:
- [ ] Please trigger a deploy now: push any commit, or press Redeploy on the latest `main` in Vercel.
- [ ] For the rest of the race, either redeploy after my pushes when I ask here, or tell me if you would rather add me to the Vercel project so my pushes deploy too.

