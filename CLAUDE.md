# FounderRace Edition 2: team Two Pizzas

This repo is our entry for FounderRace Edition 2, a 24-hour, fully remote race to ship a real SaaS. Team "Two Pizzas": Daniel and David. Everything below comes from the official runner's guide, the official rules and the organisers' Discord announcements. Full versions are in `docs/race/`.

## The clock (check it before planning anything)
- Race: Sat 21 Nov 2026 09:00 to Sun 22 Nov 2026 09:00, Paris time (CET, UTC+1).
- The finish line freezes at **Sun 22 Nov 09:00 Paris = 08:00 UTC = 16:00 SGT**, to the minute. Nothing submitted, pushed or changed after that counts.
- Paris time is the official clock. David's machine runs on SGT (UTC+8). Give times in both. Run `date -u` and work out the time left before proposing a plan.
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
- No plagiarism, nothing that infringes anyone's rights, no illegal content. Three people per team at most.

## Secrets and public-repo hygiene
The repo is private now and goes public before the finish, so treat every commit as public.
- Never commit API keys or tokens (Stripe `sk_`/`rk_`, Tavily `tvly-`, Supabase service keys, OAuth secrets). Keep them in `.env` files (gitignored) and in the host's environment variables. `.env.example` lists variable names only.
- Never write the partner perk codes (Lovable, Tavily, HubSpot) into the repo. The organisers asked that they stay inside the race; they are in the Discord announcements.
- `raw/` is local only and gitignored: the original screenshots (they show the perk codes and personal browser tabs) and HTML and Markdown snapshots of the FounderRace site. Read them when you need the exact source wording. Never `git add -f` anything in it.
- Videos and race footage stay out of git (`footage/` is gitignored). The pitch video is uploaded on the finish line.

## How to work in this repo
- Speed over polish. Get a live URL and a payment path early, then iterate. Prefer managed services and a single deploy target.
- Small commits with descriptive messages, because the jury reads the history. Two people push to `main`: `git pull --rebase` before pushing, and never force-push `main`. Follow the user's own rules about when to commit and push.
- Log decisions, pivots, milestones and traction numbers in `docs/log.md` with Paris and SGT times. It feeds the video and the README.
- `README.md` is the product's public face: name, tagline, problem, key feature, live URL, how it works, stack, boilerplate credits, team. Keep it current.
- Tick items off in `docs/checklist.md` as they are done.
- When a rule is unclear, the French rules are binding (`docs/race/rules.md` is our translation). Ask Sylvain on Discord, or email sylvain@founderrace.com, rather than guessing.

## Where things are
- `docs/race/guide.md`: the runner's guide, all 11 sections
- `docs/race/rules.md`: the official rules, Articles 1 to 15, translated from French
- `docs/race/finish-line.md`: the submission form field by field, with the Stripe key steps
- `docs/race/discord.md`: organiser announcements, perk codes left out
- `docs/race/context.md`: Edition 1 winners, jury guests, partners, prizes, site FAQ
- `docs/checklist.md`: timeline in Paris and SGT, and the submission checklist
- `docs/log.md`: race log
- `raw/`: local-only source material, see `raw/README.md`
