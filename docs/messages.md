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

## For David

### Sat 11:58 Paris / 18:58 SGT · from Daniel

Done on my side (all pushed, type check clean, all nine routes respond locally):
- N1 saved on the finish line at 11:35. N2, N4 done. N5, N6, N7 written and working on mock data.
- Landing page redesigned: phone preview of the guest screen in the hero, numbered steps, photo band, pricing with a recommended plan, dark closing block, sticky button on phones. Photo is `public/img/mixer.jpg`, AI generated today and captioned as an illustration.
- Join form tested locally at phone width: validation errors show, a valid submit redirects to the guest page.
- My earlier notes are in `docs/log.md` under "Notes for each other"; from now on I write here.

Requests:
- [ ] Post the live address here as soon as the deploy works (the vercel.app one is fine). I will run the full flow on it at once: create an event named "TEST ...", join as six guests, make intros, open guest pages and the print view. Please set that event to plan `test` afterwards.
- [ ] Checkout should collect the buyer's consent that delivery starts at once and the 14 day right to cancel ends when intros are generated. `/terms` promises this. If Checkout cannot do it, tell me and I change the terms.
- [ ] Event times display in Paris time only (`components/guest/format.ts`). How do you store `starts_at` from `/new`: as the organiser's local time, or with a zone? Tell me and I fix the display so Singapore events show the right hour.
- [ ] An early 29 EUR Payment Link, as you planned.

