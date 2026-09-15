# AGENTS.md — how to change COMPTON ONE

Operating file for humans and coding agents. Read this before editing.
Paired with `MEMORY.md` and `mem/`.

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
11. Default to **docs-only**. Do not touch routing, catalog numbers, or Vercel unless the user asked for a product change.
12. README is the one-minute resident front door. Wave and patch IDs belong only in `CHANGELOG.md`.
13. Never link a file in README until that file is on `main`, or land the link and the file in the same commit.
14. One writer per path per session. Confirm with `get_file_contents` before retrying a blocked push.
15. GitHub About / description / topics are Settings-only. Give the user paste-ready copy. A README rewrite does not update search snippets.
16. Do not caption `shots/02-intake.png` as current UI.

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
| `docs/USAGE.md` | Screenshot walkthrough + video |
| `CHANGELOG.md` | Wave history |
| `AGENTS.md` | This contract |
| `MEMORY.md` | Decisions that must not regress |
| `mem/` | Atomic engrams (9-loop). Directives stay empty until a human promotes one. |
| `shots/` | Product screenshots. `02-intake.png` is stale (still shows voice). |

## Docs standard

- README is for a resident or a reviewer who has one minute.
- USAGE is the screenshot walkthrough.
- HOW-IT-WORKS is the product logic in plain language.
- ARCHITECTURE is the security model.
- DATA is the storage contract.
- CHANGELOG is the only place wave numbers belong.
- MEMORY / mem/ are the only place earned loops belong.

## Languages

Chrome: EN / ES / TL / ZH.
Intake matching: EN / ES today. TL / ZH screens must keep saying that until matching is extended. Do not silently claim four-language routing.

## Memory loop (every session)

1. Read this file and `MEMORY.md`.
2. Recall matching slugs from `mem/index.md` (do not load every engram).
3. Pull live GitHub contents before editing.
4. Write the change.
5. Confirm the blob on main.
6. If a new trap or decision appeared, add one engram and update `mem/index.md`.

## Checks before a change ships

```bash
bash scripts/build-check.sh
python3 scripts/verify-channels.py
python3 verify.py    # needs Playwright
```

## Out of scope forever unless the README scope section changes

Emergency dispatch · direct city submission · identity collection · payments · public accusations · predictive policing · guaranteed SLAs.
