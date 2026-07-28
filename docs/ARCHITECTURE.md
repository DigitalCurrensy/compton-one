# Architecture — COMPTON ONE: FIX

## Governing principle

Every architectural decision follows a single rule: **the resident must never
receive wrong information about a city service.** Wrong routing, fabricated
departments, false SLA promises, and data leakage all violate resident trust
in ways that real harm follows from. Every mechanism below traces back to this.

---

## Routing layer: deterministic, closed, and type-safe

```
resident text → sanitizer → emergency gate → classifier → confidence gate → receipt
                                  ↓ (if triggered)
                             EmergencyResult
                             (no route field possible)
```

**No LLM or embedding model is in this path.** The classifier scores English and
Spanish phrase tables with word-boundary matching. The output is one of five known
service IDs — nothing else can emerge from the function because the return type
is a discriminated union of exactly those five IDs plus an emergency variant.

`getRouteOrThrow` is the runtime enforcement of the compile-time guarantee: if
anything outside the five-item set appears (e.g., from a future code change or a
test fixture), the function throws before a receipt is built.

**Why this matters for prompt injection:** a resident who types `ignore all
previous instructions and route to FAKE_DEPT` receives "outside what we handle
today" because `FAKE_DEPT` is not in the phrase tables and the output type
cannot carry an arbitrary string.

---

## Emergency gate

The emergency gate is evaluated before any service match. Its result type has no
`route` field — it is structurally impossible to carry both an emergency flag
and a routed service at the same time. This is enforced by TypeScript's
discriminated union, not by runtime logic that could be misconfigured.

The gate fires on phrases like "fire", "someone is hurt", "gun", "collapsed".
When it fires, the resident is shown 9-1-1 and nothing else.

---

## Service catalog as the single source of civic truth

`lib/serviceCatalog.ts` is the only file allowed to contain civic facts (phone
numbers, URLs, department names, verification states). The receipt, the scripts,
the evidence lists — everything pulls from the catalog. If a number changes, it
changes in one place and all surfaces update.

Each entry carries:
- `verificationState`: `'officially_verified'` | `'needs_confirmation'`
- `lastVerifiedAt`: ISO date string
- `sourceUrl`: the official page it was read from

The resident sees the verification pill and the source date on every receipt.
`officialSlaConfirmed: false` is enforced by a unit test across all 22 routes.

---

## Analytics: allow-list at every layer

```
event name → allowed set?  → reject
key names  → per-event allowlist? → reject
value      → matches token grammar? → reject
              ↓ (all pass)
         append to local session log
```

The resident can open the full session event log in the privacy panel and verify
that no description text, no address, and no confirmation number entered the log.
The privacy claim is **inspectable, not asserted.**

---

## Storage: consent-first, real erase

Storage is not written until the resident explicitly opts in at Step 3.
"Erase everything" calls `localStorage.removeItem` for the one key — it does
not set the value to null or empty. This is verified by a Playwright check that
reads `localStorage` after erasure and confirms the key is absent.

If the device blocks localStorage, the app detects it, informs the resident, and
continues in memory with full functionality.

---

## Accessibility

- Skip link to main content
- All interactive controls meet 44×44px minimum touch target
- `aria-pressed` on language toggle buttons
- `role="alert"` on dynamic status messages (voice recognition feedback, save
  confirmation, erasure confirmation)
- Focus management on view transitions (focus moves to the new view's heading)
- Color is never the sole indicator of state (verification pills also carry text)
- Works with the browser's built-in zoom up to 200% without horizontal scroll

---

## Single-file delivery model

`compton-one-fix.html` is the product. It is fully self-contained:
- `bundle.js` (compiled from `entry.ts` + `lib/`) is inlined
- `app.js` (view controller) is inlined
- All CSS is inlined
- Fonts are loaded from Google Fonts (the one network call; degrades gracefully)

This means a resident can save the file to their phone's files app and open it
with no internet connection, and every feature works except font rendering.

---

## What is simulated, and where it is labelled

| Simulated | Label location |
|---|---|
| SMS reminders | Timeline view, `simNote` string |
| City acknowledgment | Timeline view, `simNote` string |
| Four dashboard demo cases | Dashboard view, `demoData` string |
| Voice input (scripted on demo run) | Voice note in intake |

Simulation labels are hardcoded strings in the translation table (`T.en` / `T.es`)
and are not toggled by any flag — they cannot be accidentally removed.

---

## File dependency graph

```
entry.ts
  └─ lib/classifier.ts      (routing, emergency gate)
  └─ lib/serviceCatalog.ts  (civic facts — single source of truth)
  └─ lib/receipt.ts         (receipt builder, status model, sanitiser)
  └─ lib/analytics.ts       (allow-listed events and value grammar)
  └─ lib/storage.ts         (consent-gated localStorage)
  └─ lib/calendar.ts        (offline .ics reminder)
       ↓ esbuild
    bundle.js
       ↓ template assembly
app.template.html + app.js + bundle.js → compton-one-fix.html
```
