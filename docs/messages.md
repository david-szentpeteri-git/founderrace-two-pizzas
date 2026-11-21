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
- [ ] Start N3 (outreach list) in the private sheet if not done; outreach starts when the live URL works, target 00:00 SGT.
- [ ] If you need a new field or type from the backend, write it here instead of editing `lib/`.

## For David

(Daniel writes here.)
