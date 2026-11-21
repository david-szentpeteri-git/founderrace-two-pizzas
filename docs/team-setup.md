# Team setup

Both of us work with the same setup. Open this folder in Claude Code and it loads `CLAUDE.md`, which carries the race rules, the deadline and our working rules. Codex reads `AGENTS.md`.

## What happens by itself
- Every Claude session starts with `/brief`: the time left, what the other person pushed, what's next, and a question about what to work on.
- Claude commits small steps without asking and asks before every push. Commit messages stay short and meaningful. Nothing is pushed after 08:55 Paris on Sunday.
- Claude asks with AskUserQuestion when a choice is genuinely ours to make, and otherwise gets on with it.

## Commands

| Command | Use it when |
|---|---|
| `/brief` | you want a status check |
| `/ingest` | you drop a new Discord screenshot into `raw/screenshots/` or paste an announcement |
| `/handoff` | you stop, sleep or hand over to the other person |
| `/preflight` | before going public and before the freeze: audits every deliverable |
| `/review_verification` | after review points were recorded in `verification.md` |
| Codex: `verify <section>` | you want a read-only review of the MVP, video, traction proof or repo |

## Local-only folders
These are gitignored, so each of us has our own copy:
- `raw/`: screenshots and source snapshots. Perk codes live here, never in git. On a fresh clone, create `raw/screenshots/`.
- `footage/`: race footage for the video. The rules make race footage a condition for being ranked.

## Times to remember (Sunday)
| Paris | SGT | What |
|---|---|---|
| 08:00 | 15:00 | video uploaded |
| 08:30 | 15:30 | repo public (David, owner only), README final |
| 08:45 | 15:45 | final check on the finish line |
| 08:55 | 15:55 | last push |
| 09:00 | 16:00 | freeze |
