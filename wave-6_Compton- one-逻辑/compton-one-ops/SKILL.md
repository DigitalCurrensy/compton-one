---
name: compton-one-ops
description: >
  Operating doctrine for the COMPTON ONE: FIX civic app (repo
  DigitalCurrensy/compton-one, deployed on Vercel). Use whenever the user asks
  to fix, extend, restyle, audit, or redeploy that app — including routing
  fixes, voice/browser issues, journey/design changes, adding service
  scenarios, or pushing updates to GitHub/Vercel. Encodes the non-obvious
  architecture (bundle.js never edited; two-part controller), the Brave voice
  reality, the no-blue/no-red palette, the deterministic-routing doctrine, and
  the test-then-push-then-verify release loop learned from production
  incidents (including a placeholder push that broke main).
---

# COMPTON ONE: FIX — operating doctrine

A bilingual (EN/ES) civic service navigator. Resident describes a problem →
app routes to one of 22 verified Compton city services → issues a Civic Action
Receipt (evidence, official contact, script, message studio) → tracks to
resolution. **The app never submits to the city** — say so, everywhere.

## Architecture (read before touching anything)

| File | Role | Rule |
|---|---|---|
| `bundle.js` | esbuild-compiled TS engine, exposes `window.C1` | **NEVER edit.** `lib/` sources were never committed; bundle is the source of truth. |
| `app.js` | Controller part 1: state, strings (T), voice, debris guard, scenario engine, routing flows | All fixes go here or in part 2, marked `CONTROLLER PATCH`. |
| `app.ui.js` | Controller part 2: message studio, receipt, timeline, dashboard, calendar, **boot** | Shares state via `window.C1X`; attaches renderers back onto `X`. |
| `app.template.html` | Markup + design system with `/*__BUNDLE__*/` `/*__APP__*/` `/*__APPUI__*/` placeholders | Edit here, then regenerate `index.html` + `compton-one-fix.html` (swap placeholders for `<script src>` tags). |
| `index.html` / `compton-one-fix.html` | Identical deploy copies loading 3 external scripts | Generated, not hand-edited. |

`lang` and `caseSeed` are live via `Object.defineProperty` getters on `C1X` —
part 2 must always read `X.lang`, never alias it.

## Non-negotiables

1. **No LLM in the routing path.** Two deterministic passes only: bundle
   keyword scoring, then (only on `unsupported`) the R-01 scenario engine
   (~30 EN/ES phrase groups, strong=3/medium=2/weak=1, word-boundary match).
   Both can only emit catalogued service IDs. Emergency gate cannot be
   bypassed. Never propose an LLM classifier for this app.
2. **Honesty over features.** If the app can't do something (voice in Brave,
   unsupported scenario, city submission), the UI says exactly that and gives
   the working alternative. No fake progress, no guessed departments.
3. **Palette: no blue, no red.** night `#101210` · paper `#F2EFE5` · signal
   lime `#D7FF45` (primary) · amber `#B06A00` (warnings) · green `#2FCB75`.
   Steps are outcome-named: Describe → Match → Act → Track → Resolved.
4. **Bilingual parity.** Every new string exists in `T.en` AND `T.es`; receipt
   chrome uses `t('mCase')`/`t('mStatus')`; nothing renders hard-coded English.

## Browser realities (hard-won)

- **Brave blocks the speech service entirely** while shipping the
  `SpeechRecognition` API surface. Voice can NEVER work there. Detect via
  `navigator.brave.isBrave()` (handles both Promise and sync-boolean returns)
  BEFORE prompting for the mic; show the honest message (works in
  Chrome/Safari/Edge; typing is identical). Map `network`/`unknown`/`aborted`
  errors to "service blocked", not mic blame.
- Calendar: use the Google Calendar web intent
  (`calendar.google.com/calendar/render?action=TEMPLATE&dates=YYYYMMDD/YYYYMMDD+1`)
  — no file download; keep `.ics` for Apple/Outlook. Both confirm inline.
- `window.print()` is blocked in sandboxed/in-app browsers — try/catch, fall
  back to a printable window, then inline. Never `break-inside:avoid` a
  full-page element and never print through a `filter` (blank pages).

## Release loop (follow exactly — a skipped step broke main once)

1. Edit locally; `node --check` every JS file.
2. Run the Playwright journey suite against `test.html` (index.html with a
   `window.C1` stub covering all 22 services) — all checks pass, zero console
   errors. See `references/testing.md`.
3. Push via GitHub MCP `push_files` in **small commits (<50KB each)** — large
   single-file pushes truncate with "unexpected end of JSON input". Never push
   placeholder content; the site loads controller files externally, so a bad
   `app.js` breaks production on the next Vercel deploy.
4. **Verify every push**: compare the blob SHA returned by
   `get_file_contents` (or the `/` directory listing) against
   `git hash-object` of the exact local file tested. Mismatch = re-push.
5. Vercel auto-deploys `main`; confirm the commit reached `main` before
   telling the user it's live (preview ≠ published).

## Adding a service scenario

1. Add the phrase group to `SCENARIO_RULES` in `app.js` (strong/medium/weak,
   EN+ES, accents stripped in matching text).
2. If the bundle mis-routes it, extend `DEBRIS_TERMS`-style guards, don't
   touch bundle.js.
3. Add the service to the stub's `serviceCatalog` in the test harness.
4. Add a journey check; run suite; push per the release loop.


## Deployment doctrine (learned from production failures, 2026-07-28)

**Vercel Drop ≠ Git.** The project was originally deployed by drag-and-drop
("Vercel Drop"). In that state, pushes to GitHub are invisible to Vercel and
"Redeploy" just re-serves the same dropped files. Symptom: user says "I don't
see the updates" while every commit is verified on `main`. First diagnostic,
always: is the Vercel project connected to Git? (Dashboard → Overview →
"Connect Git".) Only the user can click it.

**Build failure ladder on a static repo:**
1. `package.json` has a `build` script → Vercel runs it → esbuild needs the
   uncommitted `lib/` sources → crash. Fix: add a `vercel-build` script
   (Vercel prefers it over `build`).
2. A no-op `vercel-build` then fails with `Error: No Output Directory named
   "public" found` — after ANY build command runs, Vercel demands output in
   `public/`. Fix: `vercel-build` assembles the five deploy files
   (`index.html`, `compton-one-fix.html`, `app.js`, `app.ui.js`, `bundle.js`)
   into `public/`.
3. Failures that complete in ~15 seconds are config-stage failures, not build
   failures. Repo-side fixes won't help: Project Settings (Framework Preset,
   Build/Output/Install Command overrides, Root Directory) override
   `vercel.json` and `package.json`. Ask the user for the build log line and
   to clear dashboard overrides.

**Release workflow now standing:** branch → push → PR → Vercel preview
deployment (green check + "View deployment" button) → merge to `main` →
production auto-deploys. Preview URLs may prompt for Vercel login (deployment
protection — expected, not an error).

**Token limitation:** the GitHub connector token lacks the `workflow` scope —
`.github/workflows/*` cannot be committed programmatically (404 on create).
Give the user the YAML to paste via the web UI instead. `push_files` can also
404 on brand-new branches; use `create_or_update_file` per file as the
fallback path.

**Cache hygiene:** `vercel.json` sets `Cache-Control: no-cache` on the HTML
and controller files so deploys are visible immediately; keep it.
