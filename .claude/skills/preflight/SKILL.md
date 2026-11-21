---
name: preflight
description: Pre-finish audit of every FounderRace deliverable against the rules. Checks that the MVP is reachable by a screenshot bot, the repository is ready to be public, the secrets scan is clean, the README and boilerplate credits are complete, the video file meets the specs, and the traction proof is in place, plus the time left. Read-only; reports PASS, FAIL or CHECK BY HAND for each item. Run before making the repo public, at about 08:00 and 08:40 Paris on Sunday, or whenever asked.
---

# /preflight

Read-only until the user picks fixes. Results go in chat. Writing review findings into `verification.md` is Codex's job, not this skill's.

## 0. Clock
Give the time now (Paris and local) and the time left to 2026-11-22T08:00:00Z. If the freeze has passed, report only and change nothing.

## 1. MVP
Take the MVP URL from the README "Live product" row, or ask for it.

```bash
URL="https://example.com"
BODY=$(mktemp)
curl -sS -L -o /dev/null -w "browser  %{http_code} %{time_total}s %{url_effective}\n" -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36" "$URL"
curl -sS -L -o "$BODY" -w "headless %{http_code} %{time_total}s %{url_effective}\n" -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0 Safari/537.36" "$URL"
grep -ioE "just a moment|cf-chl|challenge-platform|attention required|captcha|vercel.com/sso|authentication required|log in to vercel|access denied" "$BODY" | sort -u
```

- **PASS** if:
  - both requests return 200 over HTTPS;
  - the final URL is not a login or auth page;
  - there are no challenge markers;
  - the response time is sensible (a cold start over about 5 s risks a blank screenshot).
- **FAIL** otherwise. The usual fix is to turn off bot protection (Cloudflare bot fight mode, Vercel deployment protection) or to move the login wall off the landing page.
- **CHECK BY HAND:**
  - the core flow works end to end;
  - the finish line's "What the jury will see" screenshot looks right.

## 2. Repository

```bash
git fetch -q && git status -sb
git log --oneline origin/main..HEAD
git log --reverse --format="%h %cI %s" | head -3
gh repo view --json visibility,isEmpty --jq '.visibility + " empty=" + (.isEmpty|tostring)'
git ls-files raw footage
git ls-files | grep -E "(^|/)\.env" | grep -v "\.env\.example$"
git ls-files | grep -iE "\.(png|jpe?g|webp|gif|mp4|mov|webm)$"
git log -p --all | grep -nE "sk_live|rk_live|sk_test|rk_test|tvly-|service_role|BEGIN [A-Z ]*PRIVATE KEY" | head
grep -n "TBD" README.md
```

- **PASS** when all of these hold:
  - the tree is clean and fully pushed;
  - the first commit is after 2026-11-21T08:00:00Z;
  - nothing is tracked under `raw/` or `footage/`;
  - no `.env` file is tracked;
  - no key patterns appear in history;
  - the README has no TBD left;
  - the repo is not empty;
  - visibility is PUBLIC. Still private from 08:30 Paris is a FAIL, and only the owner (David) can flip it; the command is in `docs/checklist.md`. Without `gh`, check the repo page.
- **CHECK BY HAND:** none of the tracked images is a Discord screenshot or shows perk codes.
- **Boilerplates:** ask whether any template, starter or boilerplate was used, including a Lovable starter. If one was, the README table needs its link and the exact commit (FAIL if missing).
- **Commit messages:** skim `git log --oneline -30` and flag vague or very long ones. Pushed history can't be rewritten, so this is a note for the rest of the race.

## 3. Partner tool and theme
- **PASS** if at least one partner tool is really used. Look for it with:
  - `git grep -niE "stripe|tavily" -- ':!docs' ':!*.md'`;
  - `lovable-tagger` in `package.json` (a sign of a Lovable project).
- **CHECK BY HAND:** the product is a SaaS people can use, not a showcase site, and it ties in with AI and Human Connection.

## 4. Video
Ask for the file path; the video lives outside git.

```bash
FF=$(command -v ffmpeg || py -3.11 -c "import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())" 2>/dev/null || python3 -c "import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())" 2>/dev/null)
"$FF" -hide_banner -i "pitch.mp4" 2>&1 | grep -E "Duration|Stream"
ls -l "pitch.mp4"
```

- **PASS** when:
  - the format is mp4, mov or webm;
  - the file is under 500 MB;
  - it has an audio stream;
  - it runs roughly 1 to 3 minutes (outside that range is a warning, not a FAIL).
- Shrinking commands are in `task_rules/tooling.md`.
- **CHECK BY HAND:**
  - it is in English or French;
  - it covers the problem, the solution, results and traction, and a demo;
  - it includes race footage (the team working, the clock), which the rules make a condition for ranking;
  - it is uploaded on the finish line.

## 5. Traction proof
**CHECK BY HAND:**
- Stripe is in live mode.
- The restricted key (payments read only, `rk_live_`) is saved on the finish line with status "Verified".
- The payment count shows on the finish line.
- If another payment platform is used, the organisers were told on Discord or by email.
- Every number in the README, site or pitch matches Stripe and analytics: no test payments, team purchases or fake accounts.

## 6. Finish line
**CHECK BY HAND:**
- 3/3 deliverables.
- Project fields saved: name, tagline, problem, key feature.
- The GitHub URL is saved if we submit it, and the repo is public.

## 7. Report
1. Print one table: area, check, PASS / FAIL / CHECK BY HAND, evidence or fix.
2. List the FAILs in order of disqualification risk, with the time left.
3. Ask (AskUserQuestion, multi-select) which FAILs to fix now, and fix only those.
4. Tick the checklist items that passed, after re-reading `docs/checklist.md`.
5. Commit per CLAUDE.md and ask before pushing. Nothing after the freeze.
