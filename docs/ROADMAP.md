# COMPTON ONE: FIX — Roadmap

Single source of truth for what ships, in what order, and why.
Doctrine lives in `docs/ARCHITECTURE.md`; the catalog lives in
`docs/SERVICE-CATALOG.md`. This file is the plan.

**Product thesis:** one problem, one path forward. The app prepares and tracks
a resident's action — it never submits anything to the city, and says so
everywhere.

---

## Shipped

### Waves 1–2 — foundation (2026-07-28)
Scenario engine (R-01) · voice honesty layer (later removed) · debris guard ·
pathway steps · Message Studio · Google Calendar + ICS · outcome-named journey ·
palette discipline (no blue, no red) · dead-button feedback · print blank-page
fix.

### Wave 3 — brutal-review fix pack (2026-07-28/29, PR #1)
Voice feature removed entirely · routing tolerance (typo table R-02, word-set
scoring, receipt alternates) · save-confirmation feedback + dedupe · privacy
panel redesign · invisible-active-step contrast fix · four-language interface
(EN/ES/TL/ZH) · mobile passes at 560px/380px · dynamic service counts (R-03) ·
37-check Playwright QA surface established.

### Wave 4 — close the loop to the city (2026-07-29, PR #2)
**Roadmap item #1.** Every route carries a verified official submission
channel: 7 official online forms (comptoncity.org → I Want To → Report, +
pticket.com/compton for citations), 13 published @comptoncity.org email
addresses, 1 honestly-declared phone-only route (abandoned vehicles), official
Compton App as secondary channel. Delivered as `app.send.js`, a self-contained
5th script wrapping `X.renderReceipt` / `window.emailDraft` — zero edits to
existing files. Unverified channels (e.g. SeeClickFix) deliberately omitted.

---

## In progress

### Wave 5 — catalog trust pipeline (branch `wave-5/channel-trust`)
**Why:** the verified catalog is an asset and a liability — one stale channel
quietly breaks trust with exactly the resident who needed it most. Wave 4
multiplied the number of channels that can rot (7 forms + 13 emails + pticket +
the app page). SPEC sets the next manual catalog review for **2026-08-26**;
this wave converts that quarterly chore into a tripwire.

- `scripts/verify-channels.py` — re-fetches every channel's official source
  (form URLs directly; the official city pages that publish each email),
  flags dead/moved/changed channels, exits non-zero with a Markdown report.
- Weekly scheduled CI (workflow YAML — committed via web UI due to token
  scope) that runs the script and opens a GitHub issue on failure.
- Per-channel verification-source metadata (`src`) on
  `C1X.SUBMISSION_CHANNELS`; staleness indicator on the receipt's send block
  when the last verification ages past threshold.

---

## Backlog (ranked)

1. **TL/ZH intake routing.** Four-language chrome shipped in wave 3, but intake
   matching is still EN/ES-only (the tl/zh hint text says so up front). Closing
   this is real parity and the largest resident-facing gap left.
2. **PWA / offline shell.** The app is already serverless; a manifest +
   service worker makes it resilient on flaky connections. Cheap, high value.
3. **Real SMS reminder channel.** Currently labelled simulated on the receipt.
   Requires an actual gateway decision (cost, consent flow, privacy review).
4. **Open311 watch.** If Compton or LA County ever exposes an endpoint, wire
   it. Until then this is monitoring, not building.

## Standing rules

- `bundle.js` is never edited; controllers layer around it.
- No LLM in the routing path; every route emits known catalog IDs only.
- Honesty over features: if a channel can't be verified, the UI says so.
- Every wave ships through: local QA green → SHA-verified pushes → PR →
  Vercel preview check → merge → production verification.
- Catalog review cadence: quarterly (next: 2026-08-26), now automated weekly
  via the wave-5 tripwire.
