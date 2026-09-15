# MEMORY.md — decisions that must not regress

Short-term project memory for COMPTON ONE : FIX. Update when a decision changes. Do not duplicate the README.

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

## Stale artifacts (do not treat as current)

- `shots/02-intake.png` — still shows “Speak instead of typing” and EN/ES-only pills
- `shots/07-unsupported.png` — body copy still says “five service types”
- `media/04-title-16x9.png` — still says “FIVE VERIFIED SERVICE ROUTES” and “BILINGUAL”
- `docs/ARCHITECTURE.md` — still describes a 5-route inlined single file (live app is 22 routes + five external scripts)
- `docs/ROADMAP.md` — Wave 5 marked in progress; Waves 5 and 6 shipped 2026-07-29

## Open gaps (intentional)

1. TL/ZH intake matching
2. PWA / offline shell
3. Real SMS reminders (currently labeled simulated)
4. Restore `lib/` sources and fill `tests/`

## Brand and deploy

- Live: https://compton-one.vercel.app
- Brand assets live under `wave-6_Compton- one-逻辑/brand-assets/` and are copied to `public/` by `vercel-build`
- Folder name is messy on purpose of history; do not break the Vercel copy path without updating the build script
