# Changelog

Product-facing history of COMPTON ONE : FIX. The README stays current; this file keeps the wave notes.

---

## Wave 6 — 2026-07-29 — brand

- Open Graph + Twitter card (`og.jpg` 1200×630) on both entry HTML files
- Favicon, Apple touch icon, Android 192 icon derived from the project mark
- `vercel-build` copies brand assets into `public/`
- `scripts/build-check.sh` fails the build if OG wiring or assets go missing
- Playwright suite: 41 checks

## Wave 5 — 2026-07-29 — catalog trust pipeline

- `scripts/verify-channels.py` re-fetches every official source page
- Per-channel `src` registry on `C1X.SUBMISSION_CHANNELS`
- Receipt warns when a channel is older than 45 days
- First catch applied same day: City Clerk email `contactcc@` → `contactcityclerk@comptoncity.org`
- Weekly CI workflow added via web UI (bot token lacked `workflow` scope)
- Playwright suite: 40 checks

## Wave 4 — 2026-07-29 — verified submission channels

- 7 official online forms (comptoncity.org → I Want To → Report, plus pticket.com/compton)
- 13 official published department emails @comptoncity.org
- 1 honest phone-only route (abandoned vehicles)
- Official Compton app referenced as a secondary street-maintenance channel
- New file `app.send.js` wraps receipt + email draft. Zero edits to `bundle.js`
- Doctrine holds: the app never sends; the resident always presses send
- Playwright suite: 37 checks

## Wave 3 — 2026-07-28 — four languages and honesty passes

Controller-only. `bundle.js` untouched.

- Full chrome in Tagalog and Simplified Chinese, English fallback so a missing string cannot render as a raw key
- Receipts, emergency guidance, and calendar files stay EN/ES (city working languages); UI says so
- Voice input removed (W-01). Typing is the one input path. `shots/02-intake.png` still shows the old Speak button and is stale.
- Typo rewrite table + order-free word-set scorer (R-02). Low-confidence receipts offer one-tap alternates
- Save confirmation + dedupe so repeat taps do not inflate the funnel
- Privacy panel uses friendly event names; raw tokens sit behind a technical log
- Receipts gained one-tap email draft, copy-script, print, calendar
- Every receipt shows verification date + stale-link report path
- Contrast and mobile fixes at 560px / 380px
- Dynamic service counts from `C1.SERVICE_IDS.length` (R-03)

## Waves 1–2 — 2026-07-28

Scenario engine (R-01), pathway steps, Message Studio, Google Calendar + `.ics`, outcome-named journey, palette discipline, dead-button feedback, print blank-page fix. Early voice-honesty work later removed in wave 3.

---

Known source gap: `lib/` TypeScript and filled unit tests were never committed. Runtime source of truth is `bundle.js` plus the four controller files.
