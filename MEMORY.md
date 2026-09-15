# MEMORY.md — decisions that must not regress

Short-term project memory for COMPTON ONE : FIX. Update when a decision changes. Do not duplicate the README.
Last earned loop: 2026-09-15 premium docs pass + skill/engram write.

## Locked decisions

- **No AI in routing.** Keyword + phrase scoring only. Closed catalog of 22 service IDs. Unknown input → honest miss + city main line `(310) 605-5500`.
- **No city submission.** Receipts prepare a call, a form deep-link, or an email draft in the resident's own mail app. The app never POSTs to the city.
- **Consent-gated localStorage only.** Key `c1fix.cases.v1`. Created by `enable()`. Destroyed by `wipe()` → `removeItem`. Analytics stay in memory.
- **Four-language chrome, two-language matching.** EN/ES/TL/ZH UI. Typed matching is EN/ES. TL/ZH hint text must stay honest.
- **Voice input is gone.** Wave 3 removed it. `shots/02-intake.png` is a stale frame and must not be captioned as current UI.
- **13 of 22 routes are phone-only.** That finding is the product justification. Do not invent forms to make the table look better.
- **No published SLA.** Every route has `officialSlaConfirmed: false`.
- **Emergency gate is structural.** Result type for an emergency has no `route` field. 9-1-1 is the only next step.
- **`lib/` is missing.** Engine source of truth is the committed `bundle.js`. Do not tell people to run `npm run build` as if it works.
- **Independent prototype.** Footer, landing, and every receipt must keep saying this is not the City of Compton.

## Earned loops — 2026-09-15 docs pass

- The live app was already premium. The defect was jargon on the repo front door. Default to docs-only unless the user asks for a product change.
- README is the one-minute resident page. Wave and patch IDs live only in `CHANGELOG.md`.
- Never link README to a file that is not on `main`. Companions land first, or in the same commit as the links. (`eee9b11` linked USAGE/CHANGELOG/AGENTS/MEMORY before they existed.)
- One writer per GitHub path per session. Multi-agent `create_or_update_file` on the same new path hits the duplicate-push guard and can report success while main is still missing the file. Confirm with `get_file_contents`.
- GitHub About / description / topics cannot be written by current tools. Hand the user paste-ready copy for Settings → General. A README rewrite does not change search snippets.
- Caption only current frames in README/USAGE: 01, 03, 04, 05, 06, 08, 09, 10. Skip 02 until recaptured.
- Brand assets path `wave-6_Compton- one-逻辑/brand-assets/` is a Vercel copy contract. Do not rename it without updating `vercel-build`.
- Inspect the live UI at https://compton-one.vercel.app before rewriting docs.

Atomic engrams for this product live in `mem/`.
Cross-session skill: `compton-one-ops`.

## Stale artifacts (do not treat as current)

- `shots/02-intake.png` — still shows “Speak instead of typing” and EN/ES-only pills
- `shots/07-unsupported.png` — body copy still says “five service types”
- `media/04-title-16x9.png` — still says “FIVE VERIFIED SERVICE ROUTES” and “BILINGUAL”
- `docs/ARCHITECTURE.md` — still describes a 5-route inlined single file in places (live app is 22 routes + five external scripts)
- `docs/ROADMAP.md` — Wave 5 may still read as in progress; Waves 5 and 6 shipped 2026-07-29
- GitHub About sidebar — still the old jargon sentence until the owner pastes the new description
- `package.json` description — still the short prototype line unless updated

## Open gaps (intentional)

1. TL/ZH intake matching
2. PWA / offline shell
3. Real SMS reminders (currently labeled simulated)
4. Restore `lib/` sources and fill `tests/`
5. Recapture stale screenshots (02, 07, title card)

## Brand and deploy

- Live: https://compton-one.vercel.app
- Video: https://github.com/DigitalCurrensy/compton-one/blob/main/compton-one-demo.mp4
- Brand assets live under `wave-6_Compton- one-逻辑/brand-assets/` and are copied to `public/` by `vercel-build`
- Folder name is messy on purpose of history; do not break the Vercel copy path without updating the build script
