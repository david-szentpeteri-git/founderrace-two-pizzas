# Codex rules for this repo

FounderRace Edition 2, team Two Pizzas: a 24-hour race to ship a SaaS. The finish line freezes on Sun 22 Nov 2026 at 09:00 Paris (08:00 UTC, 16:00 SGT). Read `CLAUDE.md` and `docs/race/` before any task: they hold the race rules, deliverables, judging criteria, red cards and the team's git rules.

## Rule 1: read-only by default
- Each pass is read-only. Don't create, edit, move, delete or rename files unless the user explicitly asks for that change.
- Before editing, say what will change and ask when the edit isn't already explicit.
- Reviews, checks, planning and analysis never modify the product, code or docs being checked.
- Never commit secrets or partner perk codes, never stage `raw/` or `footage/`, never push after the freeze.

## Rule 2: Codex skill folder
- Codex skills live in `.codex-skills/<skill-name>/SKILL.md`. Read a skill's `SKILL.md` before acting on it.
- Don't use or modify `.claude/skills/` (Claude Code's skills) unless asked.

## Verify skill
- `verify` lives at `.codex-skills/verify/SKILL.md`. Use it when asked to verify, review or check a deliverable, the product, the code or the submission.
- Without a named target, ask which `verification.md` section to review.
- Findings go to the repo-root `verification.md`, under the deliverable's existing section. Stubs (`Status: UNREVIEWED`, no `Findings:`) are filled in place, never duplicated.
- Claude Code's `/review_verification` resolves the points and marks them `[corrected ...]` or `[dismissed ...]`. `verify` only adds and re-checks.
