---
name: verify
description: Read-only review of one FounderRace deliverable (MVP, video pitch, traction proof or repository) against the race rules, recorded as findings in verification.md.
---

# Verify

Use this skill when the user invokes `verify` or `$verify`, or asks for a review of a deliverable, the product, the code or the submission.

## Workflow

**Setup**
- Read `AGENTS.md` first and follow its read-only rule.
- Read `CLAUDE.md` and `docs/race/` for the race facts: deliverables, judging, red cards, freeze time.
- Read `verification.md` at the start of every pass. Its `##` sections are the review targets: MVP, video pitch, traction proof, repository. A section with `Status: UNREVIEWED` and no `Findings:` is a stub.
- If the user hasn't named a target, list the sections and ask which one. Match names case-insensitively, ignoring punctuation.

**Ground rules**
- Treat the product, code, docs and video as read-only. Never edit them during a review.
- The authority for requirement decisions:
  - the official rules: the French original at https://founderrace.com/en/legal/reglement/ is binding, and `docs/race/rules.md` is the team's translation;
  - the runner's guide: `docs/race/guide.md` and https://founderrace.com/en/guide/;
  - the finish-line form: `docs/race/finish-line.md`.

  Treat the README, log, checklist and earlier reviews as leads, not proof. When sources conflict, say so and recommend the option that satisfies every reading.
- Run only commands that don't change state: reading files, `git log`, `git ls-files`, `git grep`, `gh repo view`, `curl` against the live site, and `ffmpeg -i` on the video (through `imageio_ffmpeg` if ffmpeg isn't on PATH). Ask before anything that writes files, installs, deploys, pushes or submits.

**Typical checks per target**
- MVP:
  - reachable over HTTPS with both a browser and a headless-bot user agent (no Cloudflare challenge, no Vercel protection, no login wall on the landing page);
  - the core flow works;
  - it's a SaaS people can use, tied to AI and Human Connection.
- Video:
  - mp4, mov or webm, under 500 MB, English or French, roughly 1 to 3 minutes;
  - covers the problem, the solution, results and traction, and a demo;
  - includes race footage, which is a ranking condition.
- Traction:
  - Stripe is in live mode, with a restricted read-only key (never a secret key);
  - the numbers quoted in the README, site or pitch match the real data;
  - no test payments, team purchases or fake accounts.
- Repository:
  - first commit after 2026-11-21 08:00 UTC;
  - public and non-empty by the finish;
  - boilerplates credited with link and exact commit;
  - no secrets or perk codes in history (`git log -p --all`);
  - `raw/` and `footage/` untracked;
  - README complete;
  - commit messages short and meaningful.

**Findings**
- Lead with rule violations and disqualification risks, then broken behaviour, then polish. Give evidence for each.
- Record the review in `verification.md` only when the user authorized the write or the request asked to record it.
- Update the matching section instead of adding a second heading. For a stub, replace the `Status:` line with Scope, Verdict, Findings, Tests/checks and Open questions, and keep `Due:`.
- No duplicate bullets: compare by meaning, and extend an existing bullet instead of repeating it.
- Bullets marked `[corrected ...]` or `[dismissed ...]` were resolved through Claude's `/review_verification`. Re-check the claim: if the fix holds, leave the bullet; if it doesn't, add a short reviewer reply under it.

**Final chat summary**
- whether the deliverable looks ready;
- the remaining issues;
- open questions;
- the main checks run.

## Section format

```markdown
## FounderRace <Deliverable>: <Target>

- Scope: <what was checked>
- Verdict: <short overall status>
- Findings:
  - <issue, risk or confirmation, with evidence>
- Tests/checks:
  - <commands, files or manual checks>
- Open questions:
  - <anything unresolved, or "None">
```

Write in plain sentences without em or en dashes; this file goes public with the repo.
