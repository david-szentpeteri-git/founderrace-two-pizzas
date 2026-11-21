---
name: brief
description: Race status briefing for FounderRace Edition 2. Run at the start of every session in this repo, and whenever someone asks where we are. Gives the time left to the freeze, what changed since the last session, deliverable and checklist status, open review points and unprocessed material, then asks what to work on next.
---

# /brief

Read-only, apart from an optional `git pull --rebase`.

## Steps

1. **Clock.** Get the time left to the freeze, 2026-11-22T08:00:00Z (09:00 Paris, 16:00 SGT), with whatever runs on this machine:
   - `node -e "const m=Math.round((Date.parse('2026-11-22T08:00:00Z')-Date.now())/60000);console.log(m<0?'freeze passed':Math.floor(m/60)+'h '+(m%60)+'m left')"`
   - or `python3 -c "import datetime as d;print(d.datetime(2026,11,22,8,tzinfo=d.timezone.utc)-d.datetime.now(d.timezone.utc))"` (`py` instead of `python3` on Windows)

   Also run `date` for the local time and zone. If the freeze has passed, say so and switch to post-race mode: no pushes, no deploys, no edits to submitted material.
2. **Sync.** `git status -sb`, then `git fetch -q`. If the working tree is clean and the branch is behind, `git pull --rebase`; if not clean, don't pull and say why. Then `git log --oneline -12` and name what the teammate pushed since the last handoff.
3. **Read state.**
   - The latest entry under "Handoffs" in `docs/log.md`.
   - `docs/checklist.md`: the unchecked items, in order.
   - `verification.md`: sections with open findings, and the stubs still unreviewed.
   - The README "Live product" row.
   - `docs/messages.md`: unticked requests in the inbox of whoever is at the keyboard (`git config user.name` tells you who), plus any note the teammate added since the last session.
   - The "Working on now" board at the top of `docs/messages.md`: what the teammate has claimed. Name it in the brief, and never edit those files (rule in `CLAUDE.md`).
4. **New material.** Compare `raw/` with its index `raw/README.md` (either may be missing on a fresh clone), and check `git status --porcelain --untracked-files=all` for screenshots or documents dropped outside `raw/`. If anything is new, say so and offer `/ingest`.
5. **Brief**, in at most 8 lines:
   - time left (Paris and local time);
   - deliverables as far as known: MVP URL, video, Stripe key;
   - the next three unchecked checklist items;
   - open review points;
   - anything new or risky, for example no live URL past H+8, no video with 3 hours left, the repo still private an hour before the freeze.
6. **Ask.** AskUserQuestion, "What should we work on now?", with up to four options taken from the most urgent open items, the recommended one first. Don't start work before the answer.

## Flag these Sunday times (Paris / SGT)
- 08:00 / 15:00: video uploaded.
- 08:30 / 15:30: repo public (only the owner, David, can do it), README final.
- 08:45 / 15:45: final check on the finish line.
- 08:55 / 15:55: last push.
- 09:00 / 16:00: hands off.

## Never
- Read or rewrite a personal primer or global notes file (see CLAUDE.md, "Session start").
- Edit files during the brief.
