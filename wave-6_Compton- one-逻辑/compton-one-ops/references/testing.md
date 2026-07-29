# Testing the controller without the 148KB bundle

Build `test.html` = `index.html` with `<script src="bundle.js">` replaced by a
stub that mirrors the `window.C1` API:

- `serviceCatalog` with ALL 22 services (id, title{en,es}, responsibleEntity,
  triggerExamples) — the scenario engine skips any service missing here, which
  is a real failure mode (a 9-service stub once failed the storm-drain route).
- `classifyResidentText` stub that routes 2–3 phrases and returns
  `{kind:'unsupported'}` otherwise, so the controller's own second-pass engine
  is what gets tested.
- `buildReceipt`, `createCaseStore`, `analytics` (track/funnel/drain),
  `buildReminderIcs`, `lengthBucket`, `confidenceBand`,
  `sanitizeResidentText`, `EMERGENCY_GUIDANCE`.

Journey checks (Playwright, headless Chromium) cover: tile count == 22;
signal-lime primary `rgb(215, 255, 69)`; honest voice state with no fake
autofill; broken glass → clarify → illegal dumping; lost dog → animal control;
flooded street → storm drain; gibberish → unsupported; message-studio tabs
switch content; gcal button present; checklist → ev-next banner; handoff →
after-contact → timeline; confWhere explainer; confirmation saved; Spanish
chrome (`CASO`, `Buenos días`) with evidence ticks surviving the language
switch; zero console errors.

Gotchas: `inner_text` reflects `text-transform:uppercase` (compare
case-insensitively); disambiguate duplicate button labels by scoping selectors
to the visible section (`#v-unsupported button[data-t="back"]`).
