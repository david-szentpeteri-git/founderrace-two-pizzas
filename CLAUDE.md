# FounderRace Edition 2: team Two Pizzas

This repo is our entry for FounderRace Edition 2, a 24-hour, fully remote race to ship a real SaaS. Team "Two Pizzas": Daniel and David. The race facts below come from the official runner's guide, the official rules and the organisers' Discord announcements; full versions are in `docs/race/`. Both of us use this same setup (`docs/team-setup.md`).

## Session start
- Before anything else, run the `brief` skill: time left, what changed since the last session, what's next, then a question about what to work on. If the first message already says what to do, keep the brief to three lines and skip the question.
- If your global or personal instructions ask you to read or rewrite a personal primer or notes file (such as `~/.claude/primer.md`), skip that in this repo. Race state lives here, in the `docs/log.md` handoffs and in `docs/checklist.md`, and the race stays out of personal notes.

## Asking questions
- Use AskUserQuestion whenever a request is ambiguous or has no single correct answer. Don't silently guess on non-trivial choices.
- Ask only when the answer changes what you do, never about something you can check yourself. Offer only useful, distinct options with the recommended one first, and batch questions into one round: the clock is running.

## The clock
- Race: Sat 21 Nov 2026 09:00 to Sun 22 Nov 2026 09:00, Paris time (CET, UTC+1).
- The finish line freezes at **Sun 22 Nov 09:00 Paris = 08:00 UTC = 16:00 SGT**, to the minute. Nothing submitted, pushed or changed after that counts.
- Paris time is the official clock. Give times in Paris time and in the local time of whoever you work with (David's machine runs on SGT, UTC+8). Check the real time before proposing a plan.
- Discord standings drop at H+2, 4, 6, 8, 10, 12, 14 and 20. Full timeline and team targets: `docs/checklist.md`.

## The task
- Theme: **Artificial Intelligence**. Sub-theme: **Human Connection**. A broad theme, not a brief: any product that ties in.
- Build a **SaaS**: an online software product people can use. Not a showcase website, not a service. Pivoting mid-race is allowed.
- In 24 hours: find a real problem, build the MVP and put it live, get real users to test it and go after first payments, record the video pitch.
- Mandatory: use at least one partner tool during the race: **Lovable, Stripe or Tavily**. Stripe for payments already counts. Tavily also runs a "Best Use of Tavily" prize.

## Deliverables (all three, or the race is not ranked)
Submitted at https://founderrace.com/en/finish-line/ (sign in with the registration email). Any team member can edit, and everything can be replaced until the freeze: submit early, improve later.
1. **MVP URL**: the live product, public, reachable without logging in. A screenshot is taken at every save and at the finish, so bot protection must be off (Cloudflare bot fight mode, Vercel deployment protection, a login wall on the landing page). Keep it running after the finish: the jury opens it later.
2. **Video pitch**: mp4, mov or webm, max 500 MB, English or French, aim for 1 to 3 minutes. The problem and solution, results and traction, a product demo, and **footage of the race** (the work, the team, key moments). Race footage is a condition for being ranked, so capture it all day.
3. **Traction proof**: a read-only Stripe restricted key (`rk_live_...`, read access to payments only), created in **live mode** from the button on the finish line. It counts payments from the start to the freeze. Zero sales is still valid. Never the secret key (`sk_live_...`). Another payment platform is allowed, but then the organisers must be told on Discord or by email.

The form also asks for the project name, a one-sentence tagline, the problem you solve, the key feature of the MVP and, optionally, the GitHub repo. A submitted repo must be **public and non-empty** at the finish.

## How we are judged
- Four criteria of equal weight, one overall judgement, no appeal: **a real problem** (someone has to need it), **MVP quality** (simple, but it really works), **proof of traction**, **the video pitch**.
- Traction order: money actually collected, then signed-up users, then visitors. The amount counts, not the number of sales: one 10 EUR sale equals ten 1 EUR sales, and an artificially low price gains nothing.
- The jury uses the video, the live product, the payment key and, if given, the GitHub repo: **README, code and commit history**. Exchanges with the organisers during the race count a little.
- Race points (Problem 10, MVP 28, Traction 37, Pitch 25; 28 checkpoints; a "Go live" call is worth +7) are for the show and never enter the jury's ranking.

## Hard rules (red card means disqualification)
- **Nothing made before 09:00 Paris on 21 Nov.** No code, mockups, copy, designs or assets from any earlier project, ours or anyone else's, even unfinished, even if the idea fits. Never copy files in from other folders or repos on this machine.
- **Boilerplates**: only public and generic ones (auth, payments, database, UI components), never business logic, mockups or content tied to the product. Import them in a commit made after the start (copy the files or use GitHub's "Use this template"; never bring their git history). Credit them in the README with the link and the exact commit used.
- **No pushes, deploys or submission edits after the freeze.** At 09:00 Paris the organisers keep the repo's last commit, a screenshot of the MVP and the payment count.
- **No fake traction**: no invented sales, fake accounts, purchases by the team or inflated numbers. Test-mode payments do not count.
  - A club or group that Daniel or David runs or sits on the committee of (the AI Club included) is a free pilot: it counts for users, feedback and footage, never as a paying customer.
  - Nobody on the team completes a payment in Stripe live mode, not even as a test: the finish-line key would count it. Payment tests run in test mode only.
  - Events and guests we create for testing are marked `test` and left out of every number we report.
- No plagiarism, nothing that infringes anyone's rights, no illegal content. Three people per team at most.

## Secrets and public-repo hygiene
The repo is private now and goes public before the finish, so treat every commit as public.
- Never commit API keys or tokens (Stripe `sk_`/`rk_`, Tavily `tvly-`, Supabase service keys, OAuth secrets). Keep them in `.env` files (gitignored) and in the host's environment variables. `.env.example` lists variable names only.
- Never write the partner perk codes (Lovable, Tavily, HubSpot) into the repo. The organisers asked that they stay inside the race; they are in the Discord announcements.
- `raw/` is local only and gitignored: original screenshots (they show perk codes and personal browser tabs) and snapshots of the FounderRace site. Each of us has our own. Read it when you need the exact source wording; never `git add -f` anything in it.
- Videos and race footage stay out of git (`footage/` is gitignored). The pitch video is uploaded on the finish line.

## Git
- Commit without asking whenever a step works: small, focused commits.
- Ask before every push, with one short question. Run `git pull --rebase` first. Never force-push or rewrite pushed history.
- Commit messages are short and meaningful: one imperative subject line, about 50 characters and never over 72, saying what changed ("Add Stripe checkout to pricing page"). Add a body only when the reason isn't obvious, two or three short lines at most. Never vague ("update", "fix", "wip"), never long, no dashes. The jury reads this history.
- Stop pushing at 08:55 Paris / 15:55 SGT on Sunday. Nothing is pushed or deployed after 09:00 Paris.
- Before `git add -A`, move stray screenshots into `raw/` (they may show perk codes). Never stage `raw/`, `footage/`, `.env` files or anything holding a key.

## Installs
- Normal project dependencies (npm, pnpm or pip packages and the like) install without asking.
- Ask first before multi-GB downloads: local LLMs, model weights, model runtimes (Ollama, llama.cpp), large Docker images. Read-only checks of what is installed need no permission.

## Workflows
| Skill | Use it when |
|---|---|
| `/brief` | every session start (automatic), or any time someone asks where we are |
| `/ingest` | a new Discord screenshot, file or pasted announcement arrives, or you notice one in `raw/` or loose in the repo |
| `/handoff` | the user wraps up, goes to sleep or hands over to the teammate |
| `/preflight` | before making the repo public, before the freeze, or any time: audits every deliverable against the rules |
| `/review_verification` | resolving review points recorded in `verification.md` |

Codex has its own `verify` skill (`AGENTS.md`, `.codex-skills/verify/`): a read-only review that records findings in `verification.md`.

## Review before submission
`verification.md` has one section per deliverable: MVP, video pitch, traction proof, repository. Sections start as stubs (`Status: UNREVIEWED`). Codex `verify` fills them with findings and `/review_verification` resolves them with the user. Claude doesn't write new findings there itself; it raises them in chat (`/preflight` reports in chat too).

## Task rules
Read only the file the current task needs, only while doing that task:

| File | Read when... |
|---|---|
| `task_rules/writing.md` | writing anything people outside the team will read: landing page and app copy, README, pitch script, outreach and social posts, the finish-line project fields |
| `task_rules/tooling.md` | running shell commands or scripts on Windows, handling text with backslashes, or working on the pitch video (ffmpeg) |

## How to work in this repo
- Speed over polish. Get a live URL and a payment path early, then iterate. Prefer managed services and a single deploy target.
- Log decisions, pivots, milestones and traction numbers in `docs/log.md` with Paris and local times. It feeds the video and the README.
- `README.md` is the product's public face: name, tagline, problem, key feature, live URL, how it works, stack, boilerplate credits, team. Keep it current.
- Tick items off in `docs/checklist.md` as they are done. Re-read shared files (log, checklist, verification) right before editing them; the teammate may have pushed.
- When a rule is unclear, the French rules are binding (`docs/race/rules.md` is our translation). Ask Sylvain on Discord, or email sylvain@founderrace.com, rather than guessing.

## Where things are
- `docs/plan.md`: **the build plan for Three Hellos**: product, architecture, file ownership, task board (D = David, N = Daniel), timeline, traction and video plans. Work from your rows; tick them when done.
- `docs/race/guide.md`: the runner's guide, all 11 sections
- `docs/race/rules.md`: the official rules, Articles 1 to 15, translated from French
- `docs/race/finish-line.md`: the submission form field by field, with the Stripe key steps
- `docs/race/discord.md`: organiser announcements, perk codes left out
- `docs/race/context.md`: Edition 1 winners, jury guests, partners, prizes, site FAQ
- `docs/checklist.md`: timeline in Paris and SGT, and the submission checklist
- `docs/log.md`: race log and handoffs
- `docs/team-setup.md`: how the two of us use Claude Code and Codex here
- `verification.md`: review inbox, one section per deliverable
- `.claude/skills/`: brief, ingest, handoff, preflight, review_verification
- `AGENTS.md`, `.codex-skills/verify/`: Codex rules and its review skill
- `task_rules/`: writing and tooling rules
- `raw/`: local-only source material, indexed in `raw/README.md`
