---
name: handoff
description: End-of-session handoff for the race. Use when the user wraps up, takes a break, goes to sleep or hands over to the teammate. Records what was done, the exact next step and blockers in docs/log.md, ticks the checklist, commits, and asks to push so the teammate can pick up from there.
---

# /handoff

## Steps

1. **Clock.** Time now (Paris and local) and time left to the freeze (2026-11-22T08:00:00Z).
2. **Collect.**
   - Commits since the previous handoff (`git log --oneline` back to it).
   - Checklist items finished this session.
   - The live URL and what works on it right now.
   - Traction numbers: visitors, sign-ups, payments. Ask if they aren't known; never guess or round up.
   - Open review points in `verification.md`.
3. **Write.** Re-read `docs/log.md` right before editing (the teammate may have pushed), then append under "Handoffs":

   ```markdown
   ### Sat 23:40 Paris / Sun 06:40 SGT · David
   - Done: <what changed this session>
   - Live: <URL and what works, or "not deployed yet">
   - Traction: <visitors, sign-ups, payments, or "not measured yet">
   - Next step: <one exact, actionable step>
   - Blockers: <or "none">
   - Review points open: <count, or "none">
   ```

4. **Checklist.** Tick the finished items in `docs/checklist.md` and add any new to-dos where they belong.
5. **Commit and push.** Commit with a short message such as "Handoff: wire up Stripe webhook next", then ask before pushing. Recommend pushing: the teammate needs it. Never push after the freeze.
6. **Reply** with the handoff entry and the time left.

## Rules
- The next step must be concrete enough that the other person, or a fresh Claude session, can start on it without asking.
- Plain sentences, no dashes (see `task_rules/writing.md`). The log goes public with the repo.
- Never write the handoff into a personal primer or global notes file.
