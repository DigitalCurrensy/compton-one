# AGENTS.md — how to change COMPTON ONE

Operating file for humans and coding agents. Read this before editing.

## Product identity

COMPTON ONE : FIX is a static civic navigator for Compton residents.
A resident describes a city problem in plain language. The app matches that text to one of 22 verified official channels and hands back a Civic Action Receipt.

It never submits to the City of Compton. It never uses an LLM in the routing path. It never invents a department.

Live site: https://compton-one.vercel.app

## Repo rules

1. Do not add a server, an account system, or a cloud database.
2. Do not put an LLM, embedding model, or prompt in the routing path.
3. Do not invent phone numbers, emails, or forms. Official sources only. Link [docs/SERVICE-CATALOG.md](docs/SERVICE-CATALOG.md).
4. Do not claim the app filed a report. The resident always presses send.
5. Do not collect ID, payments, accusations against a named person, or profiles of minors.
6. Do not promise response times. `officialSlaConfirmed` is false on every route.
7. Emergency phrases must hard-stop at 9-1-1. That gate cannot be argued past.
8. Persist only after explicit opt-in. The only key is `c1fix.cases.v1`. Wipe is `removeItem`, not an empty array. See [docs/DATA.md](docs/DATA.md).
9. Keep the six runtime files together: `index.html`, `bundle.js`, `app.js`, `app.langs.js`, `app.ui.js`, `app.send.js`.
10. `lib/` TypeScript was never committed. Treat `bundle.js` as the engine source of truth until that tree is restored. Do not advertise `npm run build` as a working path.

## File ownership

| Path | Owns |
|---|---|
| `bundle.js` | Routing engine (compiled). Do not hand-edit unless you are restoring `lib/`. |
| `app.js` | State, strings, controller routing, typo table |
| `app.langs.js` | Tagalog + 中文 chrome and bundle-boundary patches |
| `app.ui.js` | Receipt, timeline, dashboard, boot |
| `app.send.js` | Verified submission channels and send block |
| `app.template.html` | Markup + design system. Rebuild `index.html` after edits. |
| `docs/SERVICE-CATALOG.md` | Civic source of truth for the 22 routes |
| `docs/DATA.md` | Persistence contract |
| `README.md` | Resident-facing front door. No wave/patch IDs. |
| `CHANGELOG.md` | Wave history |
| `shots/` | Product screenshots. `02-intake.png` is stale (still shows voice). |

## Docs standard

- README is for a resident or a reviewer who has one minute.
- USAGE is the screenshot walkthrough.
- HOW-IT-WORKS is the product logic in plain language.
- ARCHITECTURE is the security model.
- DATA is the storage contract.
- CHANGELOG is the only place wave numbers belong.

## Languages

Chrome: EN / ES / TL / ZH.
Intake matching: EN / ES today. TL / ZH screens must keep saying that until matching is extended. Do not silently claim four-language routing.

## Checks before a change ships

```bash
bash scripts/build-check.sh
python3 scripts/verify-channels.py
python3 verify.py    # needs Playwright
```

## Out of scope forever unless the README scope section changes

Emergency dispatch · direct city submission · identity collection · payments · public accusations · predictive policing · guaranteed SLAs.
