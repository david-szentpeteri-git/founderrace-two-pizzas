# Recording clips for the pitch video

The scripts drive a headless Chromium browser with [Playwright](https://playwright.dev/python/) and record what it shows as sharp `.webm` clips (2x pixel density, 3x on the phone shots). Nothing on your own screen is captured, so no private tabs or keys can end up in a clip.

## Setup (once, about 2 minutes)

```bash
python3 -m pip install playwright
python3 -m playwright install chromium
```

On Windows use `py -3` instead of `python3`. CapCut and Clipchamp import `.webm` directly; to convert to mp4 there is `ffmpeg` (`brew install ffmpeg`, or `pip install imageio-ffmpeg` for a bundled copy).

## Product demo (8 clips, about 2.5 minutes in total)

```bash
python3 scripts/record/record_product.py footage/demo
```

| Clip | What it shows |
|---|---|
| 01-landing | Landing page, slow scroll top to bottom (1440 wide) |
| 02-create-event | An organiser fills in `/new` and lands on the dashboard |
| 03-guest-joins-phone | Phone: a guest types her four answers and joins |
| 04-make-intros | Dashboard: "Make intros", spinner, done, guest list |
| 05-three-hellos-phone | Phone: the guest's three hellos |
| 06-sample-event-with-sparks | The sample event and its Tavily conversation starters |
| 07-poster-and-badges | Door poster, then printed badges and intro cards |
| 08-pricing-and-checkout | 18 guests waiting, the price card, the live Stripe checkout (closed unpaid) |

Rules for every run:
- The script creates a real event on the live site. It prints the event code: write it in `docs/messages.md` so it gets marked `test` and never counts as traction.
- Clip 8 opens the live Stripe checkout and closes it. Never pay on the live site.
- Re-record after any visual change so the clips match what the jury opens.

## Race footage of the repo (4 clips)

```bash
python3 scripts/record/record_repo.py footage/race
```

Commit history, race log, team inbox and task board on GitHub. Clips of the two of you working still come from a phone: the jury wants to see the team.

`footage/` is gitignored; clips stay on your machine.
