# Official race rules (English translation)

Source: https://founderrace.com/en/legal/reglement/ ("Règlement de la course"), Edition 2, last updated 18 November 2026, captured Sat 21 Nov 2026. The site publishes the rules in French only and states: "In case of any discrepancy, the French version is the binding one." This is our full translation for the team. The French original is in `raw/site/rules.md` (local only).

## Points that matter most for us

- **Art. 6**: the pitch video must include footage of the race (the work, the team, key moments) showing the product was built during the 24 hours. **Art. 8** makes that footage a condition for being ranked.
- **Art. 6**: at closing the organisers keep the GitHub repo's last commit, a screenshot of the MVP address and the payment count, and judge on those.
- **Art. 7**: no prior work of any kind. The repo is created on race day. A public boilerplate is allowed if added by a commit after the start and named in the README. At least one partner tool (Lovable, Stripe, Tavily).
- **Art. 8**: the jury reads the GitHub repo's README, code and commit history when it is provided. Traction ranks revenue first, then sign-ups, then visitors, and the amount counts, not the number of sales.
- **Art. 13**: pushing code or changing the submission after closing, or a provided repo that is private or empty at the finish, can disqualify.

## Preamble

**These are the Edition 2 rules.** They take over the first edition's rules and will be completed by the time registration opens (dates, prizes, terms). The version in force when you registered prevails. The terms for buying a registration (tiers, payment, refund, transfer) are those of the terms of sale.

## Article 1 · Organiser

FounderRace is organised by Christopher Williams, sole trader (SIRET 101 637 783 00016), hereafter "the Organiser". Contact: sylvain@founderrace.com.

## Article 2 · The event

FounderRace is a 100% remote execution race. The start is given on 21 November 2026 at 09:00 (Paris time); the race lasts 24 hours. The goal: build a SaaS MVP (an online software product that third parties can use) during the event, on the theme announced at the start. Registration is personal, free or paid depending on the tier open at the time of registration, under the terms of sale.

## Article 3 · Eligibility

- Be at least 16 years old on the day of registration;
- Register with a valid and unique email address, which is the participant's official identifier;
- Take part solo or in a team of 3 people at most.

The race is open regardless of nationality or country of residence. A participant invited by a team captain is attached to that team when their registration is validated.

## Article 4 · Registration and team composition

Registration is done only on the website, through the dedicated form. Participants commit to providing accurate information. The Organiser reserves the right to refuse or cancel a registration that is clearly fraudulent or incomplete.

Registration closes before the start, at a date and time announced on the website. After that time, any change to a team's composition (removing an absent member, grouping solo participants) is requested from the Organiser on the official channel and remains possible until the start. A team with an absent member races without them; the absence does not cancel the team's participation. Solo participants are ranked in the same way as teams.

## Article 5 · How the race runs

- **Mass start**: the race theme is announced at the start time on the official channel. It is a broad theme, freely interpreted, to which the product must relate. All participants discover it at the same moment.
- **Official clock**: the race lasts 24 hours, with no mandatory break. Each participant organises their own pace and place of work; there is no official venue.
- **Submission**: the deliverables of Article 6 must be submitted in the online submission space before the finish line closes, Paris time. They can be replaced as many times as needed until it closes. The submission is then frozen: any late submission or change is excluded from the ranking.
- **Results**: the jury deliberates in the hours after the finish. The podium is announced on the official channel and live on the event's stream.

## Article 6 · Deliverables

Each team or solo participant submits three **mandatory** deliverables on the finish line (https://founderrace.com/en/finish-line/):

- **The address of the online MVP**: the product built during the race, publicly accessible to the jury.
- **A pitch video** (mp4, mov or webm, 500 MB maximum, in French or English) presenting the problem and the solution, the results and the traction proof, and a demonstration of the product. It includes some footage of the race (the work, the team, the key moments), which shows that the product was built during the 24 hours and may be reused in the event's communication (Article 11).
- **A proof of traction**: a **read-only** payment key (a Stripe restricted key, or the equivalent from another payment platform). It is used only to count the payments received **from the start until the finish line closes**, and their amount. It is reserved for the Organiser and the jury, is neither shared nor exported, and is deleted after the deliberation. A full secret key is refused. Zero sales is still a valid proof: only the payments in that period count. **A team that does not take payments through Stripe must notify the Organiser** (on Discord or by email) as soon as it submits its key; otherwise its payments cannot be counted.

The team also presents its project (name, tagline, problem solved, key feature) and may **optionally** attach its public GitHub repository.

The three mandatory deliverables are expected for the ranking: an incomplete submission may not be ranked, at the jury's discretion. When the finish line closes, the submission is frozen: the Organiser keeps the last commit of the GitHub repository, a screenshot of the MVP address and the number of payments, and the evaluation is based on these. The Organiser never makes submissions public: they are for the jury.

## Article 7 · Creation rules

- The project must be created during the event: any work done before the start (business code, mockups, content, an existing project even if unfinished) means disqualification. Before the start, only tool preparation is allowed: installing software, creating accounts (hosting, domain name, payment, API) and choosing the stack.
- The GitHub repository, if there is one, is created on race day. A public boilerplate or template may be used, provided it is added by a commit after the start and named in the README.
- All tools are allowed, free or paid: AI, no-code, open-source libraries, APIs and third-party services.
- Each team must use, during the race, at least one tool from a partner of the edition: **Lovable**, **Stripe** and **Tavily**. The perks reserved for participants (credits, codes) are published on Discord.
- The product must be a SaaS related to the announced theme. Changing the idea during the race is free, within the same limits.
- The project must not infringe third-party rights or contain unlawful content.
- The projects created remain the property of their authors.

## Article 8 · Jury and criteria

A jury of founders and operators evaluates each submitted project on four criteria of equal importance, without a numeric scale, through an overall judgement: a real problem identified, the quality of the MVP, the proof of traction and the video pitch. Submitting the race footage (Article 6) is a condition for being ranked.

The jury relies on the pitch video, the online product, the proof of traction, the GitHub repository when it is provided (README, code, commit history) and, secondarily, the exchanges held with the team during the race.

**Traction**: the proof of traction is assessed first by revenue actually collected and evidenced, then by registered users, then by visitors. A paying customer weighs more than a registered user, who weighs more than a mere visitor. The total amount collected counts, not the number of transactions: one €10 sale is worth as much as ten €1 sales, and an artificially low price gives no advantage.

Only projects submitted within the allotted time and meeting all the conditions of these rules are ranked. The jury's decisions are final and without appeal.

## Article 9 · Official channels and broadcasting

- **Official channel**: theme announcement, race information and results, and the first point of contact with the Organiser. Access is sent at registration. The address sylvain@founderrace.com remains available as a backup.
- **Live**: the event is streamed live for its whole duration on FounderRace's channels, barring technical incidents.
- **Checkpoint calls**: the Organiser may offer teams short video calls during the race. They are not mandatory and are only broadcast on the live with the team's agreement.

## Article 10 · Prizes

The Edition 2 prize money and its split between the top three of the ranking, teams or solo participants, will be announced on this website before the start.

The prize-giving takes place **a few days after the race**. Its exact date is given to the winners in the days after the results are announced. The amounts are paid by bank transfer at the prize-giving; for a team, to the captain, and the team splits it among themselves.

Any additional prizes offered by partners (credits, services) are subject to their terms of use; they cannot be exchanged or converted into cash.

## Article 11 · Image rights

By registering, the participant authorises the Organiser to use their image and voice (pitch video, race footage, recordings linked to the event, exchanges broadcast on the live with the team's agreement), as well as the name of their project and team, to communicate about the event and its future editions, on any medium, for 3 years.

## Article 12 · Personal data

The processing of data linked to registration and to project submission is described in the privacy policy.

## Article 13 · Disqualification

The following, among others, may lead to disqualification without compensation:

- work done before the start (code, mockups, content, an existing project);
- any code pushed or any submission changed after the finish line closes, which is not taken into account;
- a GitHub repository that was provided but is private or empty at the finish;
- plagiarism, or a project that infringes third-party rights;
- fake proof of traction (invented sales, fictitious accounts, inflated numbers);
- cheating on the grid: a team of more than 3 people, identity fraud, multiple registrations;
- behaviour contrary to the sporting spirit of the race (harassment, sabotage, cheating).

## Article 14 · Liability

As the event takes place remotely, each participant is responsible for their own connection and equipment. The Organiser cannot be held responsible for technical failures beyond its control (including the unavailability of third-party services such as GitHub or the streaming platforms) and reserves the right to postpone or cancel the event in case of force majeure; registered participants would be informed by email.

## Article 15 · Acceptance

Registering means full acceptance of these rules.

## Edition 1

The rules of Edition 1 (12 and 13 September 2026) remain applicable to its participants, in particular for prize payments, the use of images and data retention. They are available on request from sylvain@founderrace.com.
