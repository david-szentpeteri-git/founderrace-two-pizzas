"""Records the product flow on the live site as sharp .webm clips for the pitch video.

Usage (from the repo root):
    python scripts/record/record_product.py footage/demo
    python scripts/record/record_product.py footage/demo --base https://threehellos.app

It creates a real event named "Winter Social" on the live site, signs up sample
guests (fictional, from content/demo-guests.json), makes the intros with Claude,
and records eight clips. Afterwards, write the printed event code in
docs/messages.md so David's side marks the event as `test` (it must never count
as traction). Clip 8 opens the live Stripe checkout and closes it without paying:
never pay on the live site, a team payment counts against us.
"""

import argparse
import glob
import json
import os
import re
import shutil

from playwright.sync_api import sync_playwright

DESK = {"width": 1440, "height": 900}
PHONE = {"width": 390, "height": 844}
EXTRA = [
    {"name": "Noor Haddad", "role": "Community manager at a coworking space", "interests": ["events", "design", "running"], "lookingFor": "Founders who host meetups", "askMeAbout": "Running a 300 person community"},
    {"name": "Lukas Brenner", "role": "Physics student who builds synthesizers", "interests": ["music", "electronics", "climbing"], "lookingFor": "Someone into hardware", "askMeAbout": "The synth I built from scrap"},
    {"name": "Mei Tanaka", "role": "UX researcher at a travel startup", "interests": ["travel", "research", "board games"], "lookingFor": "Students thinking about UX", "askMeAbout": "Interviewing 50 travellers in a week"},
]


def slow_scroll(page, step=6, pause=12):
    end = page.evaluate("document.documentElement.scrollHeight") - page.viewport_size["height"]
    y = 0
    while y < end:
        y = min(end, y + step)
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(pause)


class Recorder:
    def __init__(self, browser, out):
        self.browser, self.out = browser, out

    def start(self, name, viewport, scale=2):
        folder = os.path.join(self.out, "_tmp_" + name)
        os.makedirs(folder, exist_ok=True)
        phone = viewport is PHONE
        ctx = self.browser.new_context(viewport=viewport, device_scale_factor=scale, record_video_dir=folder,
                                       record_video_size=viewport, is_mobile=phone, has_touch=phone)
        return ctx, folder

    def finish(self, ctx, folder, name):
        ctx.close()
        clip = glob.glob(os.path.join(folder, "*.webm"))[0]
        shutil.move(clip, os.path.join(self.out, name + ".webm"))
        shutil.rmtree(folder)
        print("recorded", name)


def join(page, base, slug, guest, typing=0):
    page.goto(f"{base}/e/{slug}", wait_until="networkidle")

    def fill(selector, text):
        if not text:
            return
        field = page.locator(selector)
        if typing:
            field.click()
            field.press_sequentially(text, delay=typing)
        else:
            field.fill(text)

    fill("#name", guest["name"])
    fill("#role", guest["role"])
    for i, interest in enumerate(guest["interests"][:3]):
        fill(f'input[name="interest{i + 1}"]', interest)
    fill("#lookingFor", guest.get("lookingFor", ""))
    fill("#askMeAbout", guest.get("askMeAbout", ""))
    page.locator('input[name="consent"]').check()
    page.get_by_role("button", name=re.compile("Join and get my three hellos")).click()
    page.wait_for_url(re.compile(r"/g/"), timeout=30000)
    page.wait_for_load_state("networkidle")
    return page.url


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("out", help="folder for the clips, e.g. footage/demo")
    parser.add_argument("--base", default="https://threehellos.app")
    parser.add_argument("--guests", default="content/demo-guests.json")
    args = parser.parse_args()
    base, out = args.base.rstrip("/"), args.out
    os.makedirs(out, exist_ok=True)
    guests = json.load(open(args.guests, encoding="utf-8"))["guests"]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        rec = Recorder(browser, out)

        ctx, f = rec.start("01-landing", DESK)
        page = ctx.new_page()
        page.goto(base, wait_until="networkidle")
        page.wait_for_timeout(2000)
        slow_scroll(page)
        page.wait_for_timeout(1000)
        rec.finish(ctx, f, "01-landing")

        ctx, f = rec.start("02-create-event", DESK)
        page = ctx.new_page()
        page.goto(f"{base}/new", wait_until="networkidle")
        page.wait_for_timeout(800)
        for selector, text in [("#name", "Winter Social"), ("#place", "Student union, room 2"),
                               ("#description", "End of term mixer for members and new joiners. Mostly students, a few founders and alumni."),
                               ("#organiserName", "Mira"), ("#organiserEmail", "demo@example.com")]:
            page.locator(selector).click()
            page.locator(selector).press_sequentially(text, delay=35)
        page.get_by_role("button", name="Create event").click()
        page.wait_for_url(re.compile(r"/o/"), timeout=30000)
        page.wait_for_load_state("networkidle")
        admin_url = page.url.split("?")[0]
        slug = re.search(r"/e/([a-z0-9]+)", page.content()).group(1)
        page.wait_for_timeout(2500)
        rec.finish(ctx, f, "02-create-event")
        print("EVENT CODE:", slug, "(write it in docs/messages.md so it gets marked as test)")

        ctx = browser.new_context(viewport=PHONE)
        page = ctx.new_page()
        for g in guests[:7]:
            join(page, base, slug, g)
        ctx.close()

        ana = {"name": "Ana", "role": "Second year computer science student", "interests": ["climbing", "AI", "startups"],
               "lookingFor": "Someone who has started a company", "askMeAbout": "The robot I built for a hackathon"}
        ctx, f = rec.start("03-guest-joins-phone", PHONE, 3)
        page = ctx.new_page()
        guest_url = join(page, base, slug, ana, typing=45)
        page.wait_for_timeout(1500)
        slow_scroll(page, 4, 12)
        rec.finish(ctx, f, "03-guest-joins-phone")

        ctx, f = rec.start("04-make-intros", DESK)
        page = ctx.new_page()
        page.goto(admin_url, wait_until="networkidle")
        page.wait_for_timeout(2000)
        page.get_by_role("button", name=re.compile(r"Make intros for")).click()
        page.wait_for_url(re.compile(r"done="), timeout=180000)
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(1500)
        slow_scroll(page, 5, 12)
        rec.finish(ctx, f, "04-make-intros")

        ctx, f = rec.start("05-three-hellos-phone", PHONE, 3)
        page = ctx.new_page()
        page.goto(guest_url, wait_until="networkidle")
        page.wait_for_timeout(2000)
        slow_scroll(page, 3, 14)
        rec.finish(ctx, f, "05-three-hellos-phone")

        ctx, f = rec.start("06-sample-event-with-sparks", DESK)
        page = ctx.new_page()
        page.goto(f"{base}/demo", wait_until="networkidle")
        page.wait_for_timeout(2000)
        slow_scroll(page, 6, 12)
        rec.finish(ctx, f, "06-sample-event-with-sparks")

        ctx, f = rec.start("07-poster-and-badges", DESK)
        page = ctx.new_page()
        page.goto(admin_url + "/poster", wait_until="networkidle")
        page.wait_for_timeout(3000)
        page.goto(admin_url.replace("/o/", "/print/"), wait_until="networkidle")
        page.wait_for_timeout(1500)
        slow_scroll(page, 6, 12)
        rec.finish(ctx, f, "07-poster-and-badges")

        # More guests so the room passes the free 15 and the price card shows.
        ctx = browser.new_context(viewport=PHONE)
        page = ctx.new_page()
        for g in guests[7:] + EXTRA:
            join(page, base, slug, g)
        ctx.close()

        ctx, f = rec.start("08-pricing-and-checkout", DESK)
        page = ctx.new_page()
        page.goto(admin_url, wait_until="networkidle")
        page.wait_for_timeout(1500)
        button = page.get_by_role("button", name=re.compile(r"^(Pay €|Unlimited for)")).first
        button.scroll_into_view_if_needed()
        page.wait_for_timeout(3500)
        button.click()
        page.wait_for_url(re.compile(r"checkout\.stripe\.com"), timeout=30000)
        page.wait_for_load_state("load")  # Stripe never goes network-idle
        page.wait_for_timeout(5000)
        rec.finish(ctx, f, "08-pricing-and-checkout")  # closed without paying
        browser.close()


if __name__ == "__main__":
    main()
