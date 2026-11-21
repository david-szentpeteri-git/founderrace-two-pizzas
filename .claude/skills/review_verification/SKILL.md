---
name: review_verification
description: Work through the review points recorded in verification.md for one deliverable (MVP, video pitch, traction proof or repository). Triages each point against the real product and the race rules, discusses it with the user, applies the fix when the point is valid, and marks the bullet in place as corrected or dismissed.
---

# /review_verification

`verification.md` is the review inbox. Codex (`.codex-skills/verify/SKILL.md`) and the two of us write in things we believe are wrong, with one `## FounderRace <Deliverable>: <Target>` section per deliverable. Nothing in it has been acted on yet: every bullet is a claim, not a confirmed defect. This skill is the resolving half of the loop; Codex's `verify` only adds.

## Usage

```
/review_verification              # ask which section
/review_verification Repository   # skip the question when the section is named
```

## Steps

1. **Enumerate.** Read `verification.md` in full and list its `##` sections.
   - A review section has `Findings:` / `Open questions:` bullets.
   - A stub has `Status: UNREVIEWED` and no `Findings:`, so there is nothing to resolve.
   - If no section holds points, say so and stop, and suggest running Codex `verify`.
2. **Ask which section.** AskUserQuestion, single-select: one option per section that holds points, described by its open-point count. Name the stubs in one line after the question. If the invocation named a section, match it case-insensitively and ask only when the match is ambiguous.
3. **Extract the actionable points.**
   - Actionable: every bullet under `Findings:` and `Open questions:`, plus free-form bullets someone wrote by hand.
   - Metadata, never a point: `Scope:`, `Verdict:`, `Status:` and `Due:`.
   - `Tests/checks:` entries count only if they say something is missing or unrun.
   - Settled: bullets marked `[corrected ...]` or `[dismissed ...]`. List them, but don't re-litigate them.
4. **Load the ground truth for each point.**
   - The code and config it names.
   - The live site (curl it, or ask the user).
   - For any claim about requirements, the race rules themselves: `docs/race/rules.md` (our translation; the French original at https://founderrace.com/en/legal/reglement/ is binding), `docs/race/guide.md`, `docs/race/finish-line.md` and `CLAUDE.md`. A point saying "the rules require X" gets checked against the rules, not accepted because it is written down.
5. **Triage, with no edits yet.** Number every actionable point and give each:
   - a one-line summary;
   - a verdict: Valid, Invalid or Needs your call;
   - one line of evidence (`file_path:line_number`, a command output or a rule article).
6. **Resolve one point at a time.**
   - Restate the point and the evidence, and recommend the exact change.
   - Get the user's agreement before editing; use AskUserQuestion when there are two defensible fixes.
   - Apply the fix, then say what changed and where.
   - Fix only what the point is about: no drive-by refactors.
7. **Mark each point in `verification.md` as soon as it is settled**, not batched at the end:
   - corrected: append `[corrected YYYY-MM-DD: <one-line fix, file_path:line_number>]`;
   - dismissed: append `[dismissed YYYY-MM-DD: <one-line reason>]`;
   - deferred: leave it untouched.

   Never reword the original bullet, and never touch other bullets or sections. When every finding in a section is resolved, append `(YYYY-MM-DD: all findings addressed)` to its `Verdict:` line. New problems you notice go in chat, not into the file.
8. **Git**, per CLAUDE.md: commit the fixes with a short message ("Fix bot block on landing page") and ask before pushing. Nothing after the freeze.
9. **Summarize:**
   - corrected: what changed, and where;
   - dismissed: the reason;
   - deferred: what each is waiting on;
   - the files edited and the open points left in the section.
