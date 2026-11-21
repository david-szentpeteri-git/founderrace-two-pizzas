"""Records race footage of the repo on GitHub: commit history, race log, team inbox, task board.

Usage (from the repo root):
    python scripts/record/record_repo.py footage/race
"""

import glob
import os
import shutil
import sys

from playwright.sync_api import sync_playwright

REPO = "https://github.com/david-szentpeteri-git/founderrace-two-pizzas"
VIEWPORT = {"width": 1440, "height": 900}
SHOTS = [
    ("07-commit-history", f"{REPO}/commits/main", 9),
    ("08-race-log", f"{REPO}/blob/main/docs/log.md", 6),
    ("09-team-inbox", f"{REPO}/blob/main/docs/messages.md", 6),
    ("10-task-board", f"{REPO}/blob/main/docs/plan.md#6-task-board", 6),
]


def main():
    out = sys.argv[1] if len(sys.argv) > 1 else "footage/race"
    os.makedirs(out, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for name, url, step in SHOTS:
            folder = os.path.join(out, "_tmp_" + name)
            ctx = browser.new_context(viewport=VIEWPORT, device_scale_factor=2, record_video_dir=folder, record_video_size=VIEWPORT)
            page = ctx.new_page()
            page.goto(url, wait_until="networkidle", timeout=60000)
            page.wait_for_timeout(1500)
            end = min(9000, page.evaluate("document.documentElement.scrollHeight") - VIEWPORT["height"])
            y = page.evaluate("window.scrollY")
            while y < end:  # about 25 seconds per clip at most
                y = min(end, y + step)
                page.evaluate(f"window.scrollTo(0, {y})")
                page.wait_for_timeout(14)
            page.wait_for_timeout(800)
            ctx.close()
            clip = glob.glob(os.path.join(folder, "*.webm"))[0]
            shutil.move(clip, os.path.join(out, name + ".webm"))
            shutil.rmtree(folder)
            print("recorded", name)
        browser.close()


if __name__ == "__main__":
    main()
