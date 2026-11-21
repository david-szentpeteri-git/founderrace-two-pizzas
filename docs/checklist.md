# Race checklist

Paris time is official (CET, UTC+1). SGT is UTC+8, 7 hours ahead of Paris.
Freeze: **Sun 22 Nov 09:00 Paris = 16:00 SGT = 08:00 UTC**.

## Official timeline

| Paris | SGT | What |
|---|---|---|
| Sat 21 Nov 08:30 | Sat 15:30 | Finish line opens |
| Sat 21 Nov 09:00 | Sat 16:00 | Start, sub-theme revealed: Human Connection |
| Sat 11:00 (H+2) | Sat 18:00 | Race update on Discord (points standings) |
| Sat 13:00 (H+4) | Sat 20:00 | Race update |
| Sat 15:00 (H+6) | Sat 22:00 | Race update |
| Sat 17:00 (H+8) | Sun 00:00 | Race update |
| Sat 19:00 (H+10) | Sun 02:00 | Race update |
| Sat 21:00 (H+12) | Sun 04:00 | Race update |
| Sat 23:00 (H+14) | Sun 06:00 | Race update |
| Sun 05:00 (H+20) | Sun 12:00 | Race update |
| **Sun 22 Nov 09:00** | **Sun 16:00** | **Finish line freezes.** Nothing accepted after, not even a minute late |
| Sun, after deliberation | | Podium live on stream and Discord; the top three are contacted |

Lives (streamed calls) run all through the race, each announced on Discord 15 minutes ahead.

## Set-up (do first)

- [ ] Both: sign in to the finish line with the registration email.
- [ ] Daniel: accept the GitHub invitation to this repo (sent to `danielczirjak`).
- [ ] Daniel: after cloning, create `raw/screenshots/` and `footage/` locally (both gitignored) and open the folder in Claude Code (see `docs/team-setup.md`).
- [x] Stripe account on the registration email (that is what the $250 credits are tied to), with **live mode activated**. Verification can take a while, and test payments do not count.
- [x] Create the restricted key with the finish-line button (payments read only, live mode) and save it on the finish line now. Zero sales is a valid proof, and the traction points update live.
- [ ] Redeem the perks (codes are in the Discord announcements): Tavily coupon (valid until 23 Nov), Lovable Pro 1, Stripe credits, HubSpot for Startups if useful.
- [x] On the finish line, open "See the detail" under race points and copy the 28 checkpoints into `docs/race/finish-line.md`. They only show when signed in.
- [ ] Start capturing race footage now: screen recordings, photos of the team working, the clock. Keep the files in `footage/` (local only). The rules make this footage a condition for ranking.

## Build (our own targets, not the organisers')

Product: Three Hellos. The detailed task board, owners and timeline are in [`docs/plan.md`](plan.md).

- [x] Idea chosen (Sat 11:20 Paris / 18:20 SGT): Three Hellos, event intros for organisers of 15 to 150 person events, €29 per event.

- [ ] H+3 (12:00 Paris / 19:00 SGT): problem and target user chosen; README and the "Your project" fields filled in.
- [ ] H+8 (17:00 Paris / 00:00 SGT): first version live and its URL saved on the finish line; "What the jury will see" screenshot checked.
- [ ] H+12 (21:00 Paris / 04:00 SGT): payment path live in Stripe live mode; sign-up flow and visitor analytics on.
- [ ] Outreach running: real users, real feedback, first payments. Numbers logged in `docs/log.md`.
- [ ] At least one partner tool in use: Lovable, Stripe or Tavily.
- [ ] Optional: book a "Go live" call on Discord (+7 race points): https://discord.gg/YC9Va27QPu
- [ ] Before every sleep, break or handover: `/handoff`.

## Finish (Sunday)

- [ ] 07:00 Paris / 14:00 SGT: pitch video recorded. 1 to 3 minutes, English or French, mp4/mov/webm, max 500 MB. Problem, solution, traction, demo, race footage.
- [ ] 07:30 Paris / 14:30 SGT: Codex `verify` on each `verification.md` section, then `/review_verification` to resolve what it finds.
- [ ] 08:00 Paris / 15:00 SGT: video uploaded. Big uploads are slow: upload a first cut early and replace it later.
- [ ] 08:30 Paris / 15:30 SGT: README final (product, live URL, stack, boilerplate credits), `/preflight` clean, secrets check passed, repo made public by David (owner only), GitHub URL saved on the finish line.
- [ ] 08:40 Paris / 15:40 SGT: second `/preflight`, now on the public repo.
- [ ] 08:45 Paris / 15:45 SGT: the finish line shows 3/3 deliverables, the project fields are saved, the MVP screenshot looks right, bot protection is off.
- [ ] 08:55 Paris / 15:55 SGT: last push.
- [ ] 09:00 Paris / 16:00 SGT: hands off. No pushes, no deploys, no edits. Leave the MVP running for the jury.

## Commands

Secrets check before going public (prints `clean` when nothing matches):

```bash
git log -p --all | grep -nE "sk_live|rk_live|sk_test|rk_test|tvly-|service_role|BEGIN [A-Z ]*PRIVATE KEY" || echo clean
```

Make the repo public (only the owner, David, can do this; collaborators cannot change visibility):

```bash
gh repo edit david-szentpeteri-git/founderrace-two-pizzas --visibility public --accept-visibility-change-consequences
```
