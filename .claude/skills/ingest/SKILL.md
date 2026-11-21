---
name: ingest
description: Ingest new race material into the shared docs with perk codes stripped. Covers Discord screenshots, pasted organiser announcements, rule clarifications, the finish-line checkpoint list, and user feedback or analytics screenshots. Use when someone adds or pastes something new, or when you notice an unprocessed file in raw/ or a stray screenshot elsewhere in the repo.
---

# /ingest

`raw/` holds local source material: it is gitignored, a file is never edited once it lands there, and each of us has our own copy. `docs/` is the shared, committed write-up. Ingesting carries the content from one to the other, so both of us end up with it.

## Steps

1. **Find what's new.**
   - Files in `raw/` that are not listed in `raw/README.md`. On a fresh clone, create `raw/screenshots/` and an index file first.
   - Untracked images or documents elsewhere: `git status --porcelain --untracked-files=all`.
   - Text pasted into the conversation.
2. **Secure strays first.** Move screenshots or documents found outside `raw/` into `raw/screenshots/` (or `raw/files/`) before anything is staged: they may show perk codes or private browser tabs. Keep the original file names. If a file might be a product asset instead (a logo, a landing-page image), ask before moving it.
3. **Read** every new item in full (images with the Read tool).
4. **Write it up where it belongs.**
   - Organiser announcements go to `docs/race/discord.md`: in posting order, English version, title as posted.
   - Rule clarifications or changes go in a dated note under the relevant section of `docs/race/rules.md` or `docs/race/guide.md`. Never rewrite the translated rule text itself.
   - The finish-line checkpoint list, or any change to the form, goes to `docs/race/finish-line.md`.
   - User feedback, analytics or payment screenshots become a dated entry in `docs/log.md`, with the real numbers.
5. **Strip what must not go public**: perk and coupon codes, partner referral codes, invite links that are not already public, names or emails of people outside the team, API keys. Write "(see Discord)" or "(redacted)" in their place.
6. **Propagate changes.** If the material changes a rule, deadline, deliverable or scoring, update `CLAUDE.md` and `docs/checklist.md` as well, and lead your reply with the change.
7. **Index.** Add each file to the local `raw/README.md` (name, date, one-line content).
8. **Log** one line in `docs/log.md`: "Ingested: <what>".
9. **Commit** with a short message ("Ingest H+6 race update"), then ask before pushing.

## When to ask
Use AskUserQuestion, with your recommendation first, only for real judgment calls: sources that conflict (the French rules win; otherwise suggest asking Sylvain on Discord), an unclear destination, or source material versus product asset. Otherwise just do it.
