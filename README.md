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
open compton-one-fix.html
```

`compton-one-fix.html` is fully self-contained — the tested TypeScript is bundled
into the file. No server, no network calls, no account.

Press **Run the demo scenario** for the 60-second guided path.

---

## Verify it

```bash
npm install
npx vitest run                  # 272 unit tests
npx tsc --noEmit                # strict TypeScript, no errors
python3 verify.py               # 57 Playwright browser-journey checks
```

---

## Layout

```
compton-one-fix.html    The deliverable — open this in a browser
app.template.html       Markup + design system (source for the HTML)
app.js                  View controller — no framework, no build step
entry.ts                TypeScript entry point; exports C1 to window
bundle.js               esbuild output of entry.ts + lib/ (committed)
verify.py               57 browser checks (requires playwright)
tests/                  272 unit tests
media/                  Architecture, journey, before/after, title, teaser
shots/                  Screenshots produced by verify.py
docs/
  SERVICE-CATALOG.md    22 verified city service routes (source of truth)
  ARCHITECTURE.md       Design decisions and security model
  SPEC.md               Full repository specification
```

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

## Rebuild after editing `lib/` or `app.js`

```bash
npx esbuild entry.ts --bundle --format=iife --target=es2018 --outfile=bundle.js
python3 -c "
import pathlib
t = pathlib.Path('app.template.html').read_text()
pathlib.Path('compton-one-fix.html').write_text(
  t.replace('/*__BUNDLE__*/', pathlib.Path('bundle.js').read_text())
   .replace('/*__APP__*/', pathlib.Path('app.js').read_text())
)
"
```

---

## What is simulated, and labelled as such

SMS reminders · city acknowledgment · four dashboard demo cases · voice input
(scripted; text is always the primary path).

## What is deliberately not built

Emergency dispatch · direct city submission · ID collection · payments ·
public accusations · named-offender reporting · minor profiles · predictive
policing · guaranteed response times.

## Permissions this app requests

**None.** No camera, microphone, location, contacts, or network calls of its own.
Works with every permission on the phone denied.

The only writable surface is `localStorage`, and only after explicit resident
opt-in on the receipt screen — one key, on that device, never sent anywhere,
erased completely by a single control. Verified by 36 browser checks.
