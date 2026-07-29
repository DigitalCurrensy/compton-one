# The pitch — presenting COMPTON ONE: FIX

Five-minute arc. Live demo beats slides; keep the recording as backup.

## 1 · Problem (45 seconds)

"In Compton, reporting a pothole means knowing the city's org chart — in
English. 13 of the 22 ways to ask the city for help have **no online form at
all**: phone-only, business-hours-only, English-first. Most residents don't
get through. So problems go unreported — then unmeasured — then unfunded."

Show the city's actual department page (the buried `mailto:` "Email" links
make the point better than any slide).

## 2 · Live demo (2 minutes)

1. Type **"my neighbor dumped a couch on our corner"** → watch it route →
   the Civic Action Receipt: official form link, evidence checklist, call
   script, pre-written message.
2. Switch to **Español** mid-flow — the whole interface follows.
3. Type **"someone is having a heart attack"** → the emergency gate fires.
   That contrast — helpful always, careful when it matters — lands.

## 3 · The differentiator (60 seconds)

"Every civic app demos well once. Ours stays true.

- It **never claims to submit** to the city — the resident always presses
  send, and the app says so in all four languages.
- It **never guesses** a department — two deterministic passes, no AI, and an
  honest 'we don't cover this' when nothing matches.
- And because **civic data rots** — Compton's City Clerk changed their
  published email *while we were building this* — every channel is pinned to
  its official source and re-verified weekly by an automated tripwire. When
  the data ages past 45 days, the app warns the resident itself."

**Tell the clerk-email story. It really happened, mid-build, and judges
remember it.**

## 4 · Vision (45 seconds)

"This is a template for every small city in America. The engine is
city-agnostic — a new city is a new catalog, not a rewrite: one day of
research against official pages (`docs/REPLICATE.md`). The trust pipeline is
the part that doesn't exist anywhere else."

## 5 · Close (15 seconds)

"One problem. One path forward. And an app that never lies to the resident."

---

## Judge questions, answered

- **"Why not just use 311?"** — 311 assumes you know the taxonomy and the
  language. This is the router in front of it — and 13 of 22 Compton routes
  have no online intake for 311 to route to.
- **"Why doesn't it submit directly?"** — Cities don't accept third-party
  submissions. Pretending otherwise is how civic apps lose trust. Honesty is
  the design.
- **"How does it scale?"** — deterministic routing (no AI cost or risk),
  static hosting (near-zero infrastructure), per-city replication = catalog +
  channels + strings.
- **"How do you keep data fresh?"** — the source-pinned channel registry +
  weekly tripwire + honest aging in the UI. Nobody else has this.
- **"Where's the resident data?"** — there isn't any. No account, no server;
  opt-in device storage only, shown to the user in the privacy panel.

## Assets to prepare

- Live URL open on your phone **and** laptop: https://compton-one.vercel.app
- 60–90 second screen recording of the full journey (backup for bad wifi)
- 5 slides: problem → demo stills (`shots/`) → trust pipeline → replication →
  roadmap (`docs/ROADMAP.md`)
- Paste the link in the judges' chat — the OG card renders the logo and the
  honest one-line scope
