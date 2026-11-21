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
- [ ] Once `/demo` reads the seeded demo event (D6), check it still looks right. Until then `getDemo()` returns the mock.
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
- [ ] Run your full flow on the live site with an event named "TEST ..." (6 guests, intros, guest pages, print view) and write what breaks here.
- [ ] Send me the Tavily key privately (not here); I add it to Vercel and check the sparks on `/demo`.

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
- [ ] An early 29 EUR Payment Link, as you planned.

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

