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
- **The checkpoint list only shows when signed in.** Copied from David's screenshots of "See the detail", Sat 21 Nov 18:04 SGT (11:04 Paris). Header: "Checkpoints to win in any order you like." Footer: "For entertainment only. Points and rankings during the race do not replace the jury's final marking."

### Problem (10)

| Checkpoint | Points | What it asks |
|---|---|---|
| Problem described | +2 | Describe the problem you solve in a few sentences, in the "Your project" section. |
| Precise target | +3 | Say exactly who has this problem: a job, a situation, not "everyone". |
| Concrete problem | +3 | Make the problem concrete: a real situation, a cost, time lost. |
| The site states the problem | +2 | Show the problem right on your site's home page. |

### MVP (28)

| Checkpoint | Points | What it asks |
|---|---|---|
| Key feature described | +2 | Describe your product's key feature, in the "Your project" section. |
| MVP URL submitted | +2 | Submit your MVP's address. |
| MVP online | +4 | Your MVP must load at its address, with no error and no bot protection. |
| Own domain name | +2 | Connect a real domain name instead of a free hosting address. |
| Several pages | +2 | Add at least three pages linked from your home page with real links. |
| Feature visible | +5 | Show your key feature on the site: we should see it, not just read about it. |
| Perceived quality | +4 | Polish it: nothing broken, no placeholder text, a consistent design. |
| Readable on mobile | +3 | Check your site on a phone: readable text, nothing overflowing. |
| Path to payment | +2 | Show a price and a button that leads to payment. |
| Legal pages | +2 | Add your legal notice and terms of sale, linked from your site. |

### Traction (37)

| Checkpoint | Points | What it asks |
|---|---|---|
| Payment key verified | +3 | (Won Sat 21 Nov, 17:57 SGT / 10:57 Paris.) |
| First paying customer | +6 | Land your first paying customer (not a team member, €1 minimum). |
| 5 paying customers | +6 | Reach 5 different paying customers. |
| 10 paying customers | +6 | Reach 10 different paying customers. |
| 15 paying customers | +6 | Reach 15 different paying customers. |
| €50 in revenue | +3 | Reach €50 collected since the start. |
| €200 in revenue | +3 | Reach €200 collected since the start. |
| €500 in revenue | +4 | Reach €500 collected since the start. |

### Pitch (25)

| Checkpoint | Points | What it asks |
|---|---|---|
| Pitch submitted | +3 | Submit your pitch video. |
| Pitch of 1 to 3 minutes | +2 | Aim for a pitch between 1 and 3 minutes. |
| Problem and solution presented | +5 | In your pitch, present the problem, then your solution. |
| Results and proof presented | +5 | In your pitch, show your results and your traction proof. |
| MVP demo | +3 | In your pitch, show your product working. |
| Live call | +7 | Join a call on the live: book it on Discord, the control room gives you the points. |

Our read: the race points count distinct paying customers, while the jury weighs the total amount collected, not the number of sales (Art. 8). Set the price for the jury; the customer count only moves the show points.

## Go live (+7)

"Come and show your product in a call on the race live. Book it on Discord: the control room gives you the points." The "Book a call" button links to https://discord.gg/YC9Va27QPu . In the checkpoint list this is "Live call", counted in the Pitch family.

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
