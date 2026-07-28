# COMPTON ONE: FIX

**One problem. One path forward.**

A bilingual (EN/ES) civic service navigation prototype for Compton, California.
A resident describes a city service problem in plain language; the app identifies
the correct department from a catalog of **22 verified city service routes**, lists
the evidence to gather, hands off to the official channel with a prepared call
script, issues a **Civic Action Receipt**, and tracks the case to a recorded outcome.

**22 routes catalogued.** Each carries a verified phone number or URL, the
responsible department, and a `verificationState` (`officially_verified` or
`needs_confirmation`) sourced directly from official City of Compton pages on
2026-07-27. The catalog finding that justifies this product: **13 of 22 routes
have no dedicated online intake form at all** — they are phone-only barriers for
residents who work business hours or who are Deaf or hard of hearing.

**5 routes actively routed.** Illegal dumping · pothole · streetlight outage ·
missed trash pickup · water or sewer concern. For anything outside these five the
app returns an honest "outside what we handle today" with the verified city main
line — it never guesses a department. The remaining 17 routes are fully documented
in [`docs/SERVICE-CATALOG.md`](docs/SERVICE-CATALOG.md) and represent the product
roadmap.

> **Scope:** This prototype prepares and tracks a resident's action. It does not
> submit anything to the City of Compton. That limit is stated on the landing page,
> on every receipt, and in the footer.

---

## Run it — no build, no server

```
open index.html        # or compton-one-fix.html — same page
```

The page loads `bundle.js` (the tested, compiled TypeScript engine) and `app.js`
(the view controller) from the same folder — **keep the three files together**.
No server, no network calls, no account.

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
index.html              Entry point — loads bundle.js + app.js
compton-one-fix.html    Same page, legacy name (kept for existing links)
app.template.html       Markup + design system (source for the HTML)
app.js                  View controller — no framework, no build step
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

## Controller patches — 2026-07-28

All engine code (`bundle.js`) is untouched. Fixes live in `app.js` (controller)
and `app.template.html` (markup/CSS), and are marked with `CONTROLLER PATCH`
comments:

- **V-01 / V-02 — voice input honesty.** Brave (and some Chromium builds) block
  or ship no speech service. The old build either silently auto-filled a scripted
  example or showed a generic "did not work". Now: unsupported browsers get a
  clear explanation with no fake autofill, and real failures are named
  (`not-allowed`, `no-speech`, `network`, `audio-capture` each get their own
  message). In-flight recognition is stopped on submit so it cannot overwrite
  submitted text.
- **C-01 — debris guard.** "car metal on sidewalk" reached the street-tree
  checklist on the deployed build. Obvious dumped-debris language (scrap metal,
  car/auto parts, rebar, frames, water heater…) now triggers the honest
  either/or clarify question (illegal dumping vs. the literal keyword match)
  instead of a confident wrong route.
- **P-01 / P-02 / P-03 — the missing pathway.** The receipt now answers "after
  I prepare the details, what happens?": a *What happens next* ordered panel on
  every receipt; a banner that appears when the evidence checklist is completed
  (jump to the official step, or go save your confirmation); and an
  after-contact bar that appears once you click the official phone/link,
  pointing straight at the confirmation field.
- **B-01 — dead-button feedback.** The calendar download now confirms inline
  ("Reminder downloaded — open the file…"), and the primary button is relabelled
  to say where it actually goes ("Next: track this case").
- **Print — blank-page fix.** `break-inside:avoid` on the full-height receipt
  plus the tear-drop `filter` made Chrome emit four mostly-blank pages. Print
  CSS is consolidated; only small blocks avoid breaks, filters are stripped,
  and only the receipt section prints.

---

## The 22 catalogued routes — 5 actively routed today

All 22 routes are sourced, verified, and documented in
[`docs/SERVICE-CATALOG.md`](docs/SERVICE-CATALOG.md). The app actively routes
five; the rest are the product roadmap.

**Actively routed:** Illegal dumping · pothole · streetlight outage · missed trash pickup · water or sewer concern.

**Catalogued, not yet routed:** Graffiti · abandoned vehicle · sidewalk · street tree · traffic signal / sign / marking · storm drain & flooding · bulky item pickup · recycling & e-waste · animal control · code / property violation · housing help · parking citation · utility billing · business licence / building permit · public records · power outage · homeless outreach.

Anything outside the five active routes returns "outside what we handle today"
plus the verified city main line `(310) 605-5500`. The app never guesses.

---

## Architecture in one paragraph

There is **no model in the routing path.** Classification is deterministic keyword
and phrase scoring with word-boundary matching in English and Spanish. The classifier
can only emit one of five known service IDs; a type guard and `getRouteOrThrow`
reject anything else. The emergency gate cannot be argued out of firing. This is why
prompt injection cannot produce a fabricated department.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design rationale.

---

## Rebuild after editing `app.template.html`

The HTML is assembled by replacing two placeholders:

```bash
python3 - <<'EOF'
import pathlib
t = pathlib.Path('app.template.html').read_text()
out = (t.replace('<script>/*__BUNDLE__*/</script>', '<script src="bundle.js"></script>')
        .replace('<script>/*__APP__*/</script>', '<script src="app.js"></script>'))
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
browsers that block or lack the service the app says so and typing is the
identical path. No camera, location, contacts, or network calls of its own.

The only writable surface is `localStorage`, and only after explicit resident
opt-in on the receipt screen — one key, on that device, never sent anywhere,
erased completely by a single control.
