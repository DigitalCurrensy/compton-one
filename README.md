# COMPTON ONE: FIX

**One problem. One path forward.**

A bilingual (EN/ES) civic service navigation prototype for Compton, California.
A resident describes a city service problem in plain language; the app identifies
the correct department from a catalog of **22 verified city service routes**, lists
the evidence to gather, hands off to the official channel with a prepared call
script and ready-to-send message, issues a **Civic Action Receipt**, and tracks
the case to a recorded outcome.

**22 routes catalogued and routed.** Each carries a verified phone number or URL,
the responsible department, and a `verificationState` (`officially_verified` or
`needs_confirmation`) sourced directly from official City of Compton pages on
2026-07-27. The catalog finding that justifies this product: **13 of 22 routes
have no dedicated online intake form at all** — they are phone-only barriers for
residents who work business hours or who are Deaf or hard of hearing.

**How routing works (two deterministic passes, no LLM anywhere):**
1. The tested engine (`bundle.js`) routes its five keyword-tuned services
   (illegal dumping, pothole, streetlight, missed trash, water/sewer) plus the
   emergency gate.
2. If — and only if — the engine returns *unsupported*, the controller's
   **scenario engine** (patch R-01) scores the description against ~30 plain-language
   phrase groups (EN/ES, strong/medium/weak) covering all 22 services, and routes
   or asks an either/or question. It can only emit known catalog IDs; when nothing
   matches it still says so honestly, with the verified city main line.

> **Scope:** This prototype prepares and tracks a resident's action. It does not
> submit anything to the City of Compton. That limit is stated on the landing page,
> on every receipt, and in the footer.

---

## Run it — no build, no server

```
open index.html        # or compton-one-fix.html — same page
```

The page loads `bundle.js` (the tested, compiled TypeScript engine), `app.js`
(controller part 1: state, strings, routing) and `app.ui.js` (controller part 2:
receipt, timeline, dashboard, boot) from the same folder — **keep the four files
together**. No server, no network calls, no account.

Press **Run the demo scenario** for the 60-second guided path.

---

## Verify it

```bash
npm install
npx vitest run                  # unit tests (requires lib/ sources — see note below)
npx tsc --noEmit                # strict TypeScript (requires lib/ sources)
python3 verify.py               # browser-journey checks (requires playwright)
```

> **Repo note (2026-07-28):** the `lib/` TypeScript sources and the filled test
> files were never committed — only their compiled output (`bundle.js`) is in the
> repo. `bundle.js` is committed verbatim and loaded as-is; treat it as the
> source of truth for the engine until `lib/` is rebuilt. `npm run build` will
> fail without `lib/`; the HTML does not depend on it.

---

## Layout

```
index.html              Entry point — loads bundle.js + app.js + app.ui.js
compton-one-fix.html    Same page, legacy name (kept for existing links)
app.template.html       Markup + design system (source for the HTML)
app.js                  Controller part 1 — state, strings, routing (no build step)
app.ui.js               Controller part 2 — receipt/timeline/dashboard/boot
entry.ts                TypeScript entry point; exports C1 to window
bundle.js               esbuild output of entry.ts + lib/ (committed, loaded as-is)
verify.py               Browser checks (requires playwright)
tests/                  Unit tests (stubs — lib/ sources not yet committed)
media/                  Architecture, journey, before/after, title, teaser
shots/                  Screenshots produced by verify.py
docs/
  SERVICE-CATALOG.md    22 verified city service routes (source of truth)
  ARCHITECTURE.md       Design decisions and security model
  SPEC.md               Full repository specification
```

---

## Controller patches — 2026-07-28 (wave 2)

All engine code (`bundle.js`) is untouched. Fixes live in `app.js`, `app.ui.js`
and `app.template.html`, marked with `CONTROLLER PATCH` comments:

- **R-01 — scenario engine.** "broken glass on sidewalk" hit the unsupported
  wall; "lost my dog" had no route. A second-pass classifier now covers all 22
  services with ~30 EN/ES phrase groups (lost pet → animal control, flooded
  street → storm drain, graffiti, e-waste, permits, records, and more). It runs
  only on *unsupported*, can only emit catalog IDs, and falls back to an
  either/or question instead of guessing when two services score close.
- **V-03 — Brave reality.** Brave ships the `SpeechRecognition` API but blocks
  the speech service itself, so voice prompted for the mic and then failed.
  Brave is now detected up front (no pointless permission prompt) with an
  honest explanation: voice works in Chrome/Safari/Edge; typing is identical.
  `network`/`unknown`/`aborted` errors map to service-blocked messages, not
  mic blame.
- **M-01 — Message Studio.** Every receipt now carries ready-to-send words for
  the city — first report, follow-up, escalation — in the active language, with
  one-tap copy. Deterministic templates + receipt fields only: nothing can
  hallucinate a department, a promise, or a case number.
- **C-02 — one-tap Google Calendar.** The follow-up date exports via the
  official Google Calendar web intent (works in every browser, no file
  handling); the `.ics` download stays for Apple/Outlook. Both confirm inline.
- **J-01 — outcome-named journey.** Steps read Describe → Match → Act → Track →
  Resolved; the receipt meta is bilingual (CASE/CASO, STATUS/ESTADO); the
  timeline card explains where a confirmation number actually comes from
  ("ask the city for a service request number").
- **D-01 / D-02 — design.** Blue and red are gone from the palette. Primary
  action is signal lime on night; warnings use amber; the emergency panel is
  night with signal links; spacing is tightened across hero, cards, receipt.
- **C-01 extended — debris guard** now also catches broken glass, needles,
  syringes, dumped tires and construction debris (EN/ES).

Wave 1 (same day, earlier): V-01/V-02 voice honesty · C-01 debris guard ·
P-01/P-02/P-03 pathway (what-happens-next panel, checklist-complete banner,
after-contact bar) · B-01 dead-button feedback · print blank-page fix.
The controller is split into `app.js` + `app.ui.js` purely so each file stays
small enough to review and push independently; they share state through
`window.C1X`.

---

## The 22 catalogued routes

All 22 routes are sourced, verified, and documented in
[`docs/SERVICE-CATALOG.md`](docs/SERVICE-CATALOG.md) — and all 22 are reachable
today: five through the tested engine's own keyword tables, the rest through the
R-01 scenario engine, with an honest unsupported wall (and the verified main
line `(310) 605-5500`) when nothing matches.

Illegal dumping · pothole · streetlight outage · missed trash pickup · water or
sewer · graffiti · abandoned vehicle · sidewalk · street tree · traffic
signal/sign · storm drain & flooding · bulky item pickup · recycling & e-waste ·
animal control · code/property violation · housing help · parking citation ·
utility billing · business licence/permit · public records · power outage ·
homeless outreach.

---

## Architecture in one paragraph

There is **no model in the routing path.** Classification is deterministic keyword
and phrase scoring with word-boundary matching in English and Spanish, in two
passes (tested engine, then controller scenario net). Both can only emit known
service IDs; a type guard and `getRouteOrThrow` reject anything else. The
emergency gate cannot be argued out of firing. This is why prompt injection
cannot produce a fabricated department.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design rationale.

---

## Rebuild after editing `app.template.html`

The HTML is assembled by replacing three placeholders:

```bash
python3 - <<'EOF'
import pathlib
t = pathlib.Path('app.template.html').read_text()
out = (t.replace('<script>\n/*__BUNDLE__*/\n</script>', '<script src="bundle.js"></script>')
        .replace('<script>\n/*__APP__*/\n</script>', '<script src="app.js"></script>')
        .replace('<script>\n/*__APPUI__*/\n</script>', '<script src="app.ui.js"></script>'))
pathlib.Path('compton-one-fix.html').write_text(out)
pathlib.Path('index.html').write_text(out)
EOF
```

(`npm run build` still documents the original inline-bundle pipeline; it requires
the uncommitted `lib/` sources and is not needed for deployment.)

---

## What is simulated, and labelled as such

SMS reminders · city acknowledgment · four dashboard demo cases.

## What is deliberately not built

Emergency dispatch · direct city submission · ID collection · payments ·
public accusations · named-offender reporting · minor profiles · predictive
policing · guaranteed response times.

## Permissions this app requests

**None of its own.** Voice input, where the browser offers it, uses the
browser's built-in speech recognition — the audio never touches this app; on
browsers that block or lack the service (Brave blocks it entirely) the app says
so and typing is the identical path. No camera, location, contacts, or network
calls of its own.

The only writable surface is `localStorage`, and only after explicit resident
opt-in on the receipt screen — one key, on that device, never sent anywhere,
erased completely by a single control.
