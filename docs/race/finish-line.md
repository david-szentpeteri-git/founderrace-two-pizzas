# The finish line (submission form)

URL: https://founderrace.com/en/finish-line/ . Captured Sat 21 Nov 2026 from the public page HTML and David's screenshots of the signed-in view.

## Window

- Opens Sat 21 Nov 2026 08:30 Paris (07:30 UTC, 15:30 SGT), 30 minutes before the start.
- Closes **Sun 22 Nov 2026 09:00 Paris (08:00 UTC, 16:00 SGT)**. The page data says `"ends_at": "2026-11-22T08:00:00+00:00"`. Afterwards it shows "Submissions are closed: the jury takes over." and "Submission frozen".
- Sign in with the email you registered with. A 6-digit code is emailed; there is no password.
- Every team member can edit. The form shows who made the last change ("Last change by").

## Team card

- Team **Two Pizzas**, Daniel · David.
- "Required deliverables 0/3": MVP URL, Video pitch, Traction proof. "The jury expects these three deliverables: submit them before closing." Once all are in: "All three deliverables are in. You can still improve everything until it closes."

## Race points panel

- "Your race points", out of 100: Problem 10, MVP 28, Traction 37, Pitch 25. "0 / 28 checkpoints won". "See the detail" opens the checkpoint list ("Checkpoints to win in any order you like").
- "For entertainment only. Points and rankings during the race do not replace the jury's final marking."
- The points are computed on the server from Stripe, the site and the organisers, and the page refreshes them every 20 seconds while it is open.
- **The checkpoint list only shows when signed in.** To do: open "See the detail" and copy the 28 checkpoints into this table.

| Family | Max | Checkpoints |
|---|---|---|
| Problem | 10 | to fill in |
| MVP | 28 | to fill in |
| Traction | 37 | to fill in |
| Pitch | 25 | to fill in |

## Go live (+7)

"Come and show your product in a call on the race live. Book it on Discord: the control room gives you the points." The "Book a call" button links to https://discord.gg/YC9Va27QPu .

## MVP URL (required)

- Placeholder `https://monprojet.com`. "The public address of your live product, the one the jury will open."
- After a save the page captures a screenshot ("What the jury will see", "Taking a screenshot of your site…", "Try the screenshot again"). The guide adds that a screenshot is taken for every saved address and at the finish, so bot protection must be off.

## Video pitch (required)

"The problem and your solution, your results and traction proof, a demo of your MVP. mp4, mov or webm, 500 MB max." Upload with "Choose my video". An upload can be cancelled, and a submitted video can be removed and replaced.

## Traction proof (required)

- Field "Read-only Stripe API key", placeholder `rk_live_…`.
- "A restricted, read-only key from your Stripe account: we count the payments you receive from the start until the finish line closes. Using another payment platform? Paste its read-only key here and let us know on Discord or by email: otherwise your payments can't be counted."
- The "Create my key in Stripe" button opens https://dashboard.stripe.com/apikeys/create?name=FounderRace&permissions[0]=rak_charge_read&thirdparty_integration_name=FounderRace&thirdparty_integration_url=https%3A%2F%2Ffounderrace.com
  1. The button opens Stripe on a key already set up for FounderRace: read access to payments, nothing else.
  2. Check you are in live mode (not test), then create the key.
  3. Copy the key (`rk_live_…`) and paste it here. Never your secret key (`sk_live_…`).
- After saving: "Key saved. Only the FounderRace team can use it, read-only." The status reads "Verified" or "To be checked by the team", followed by a live count ("N payments since the start").
- The key lives only in this form. Never put it in the repo.

## Your project

Fields: Project name · Tagline, in one sentence · The problem you solve · The key feature of your MVP. Then Save.

## GitHub repository (optional)

Placeholder `https://github.com/equipe/projet`. "A public repository. Leave it empty if you don't have one." The Discord lists it as recommended. If we give it, it must be public and non-empty at the finish, and the organisers keep its last commit at closing.
