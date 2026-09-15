# Data, storage, and catalog integrity

COMPTON ONE has **no server, no account, no cookies, no IndexedDB, and no cloud database.**
Everything that persists lives in one browser key on the resident's device.

This page is the source of truth for what is stored, when it is written, and how it is erased.

---

## The one rule

Nothing is written until the resident taps **Keep this case on this phone.**

Close the tab without that tap and the device holds nothing.

---

## Where data lives

| Surface | Mechanism | Survives a refresh? | Leaves the device? |
|---|---|---|---|
| Saved cases | `localStorage` key `c1fix.cases.v1` | Yes, on that browser only | No |
| Session analytics | In-memory `AnalyticsRecorder` | No | No |
| Open receipt / timeline | In-memory `state` object | No | No |
| Calendar reminder | Resident-downloaded `.ics` or Google Calendar link | On *their* calendar, if they chose it | Only if they save the file |
| Email draft | `mailto:` into the resident's own mail app | In *their* mail app, if they send | Only if they press send |

There is no API. There is no tenant table. One resident, one device, one key.

---

## The storage key

```
c1fix.cases.v1
```

Created by `C1.createCaseStore().enable()` — and **only** by that call.
The store first probes `localStorage` with a throwaway `__c1probe__` key. If the probe fails (private mode, quota, policy), the store is marked `degraded` and the app keeps working in memory.

### Envelope

```json
{
  "version": 1,
  "consentAt": "2026-07-29T18:04:00.000Z",
  "cases": []
}
```

| Field | Type | Meaning |
|---|---|---|
| `version` | number | Schema version. Current: `1`. |
| `consentAt` | ISO-8601 | Instant the resident opted in. |
| `cases` | CaseRecord[] | Cases the resident chose to keep. |

### Case record

Written by `persist()` in `app.ui.js` after opt-in.

| Field | Type | Meaning |
|---|---|---|
| `caseId` | string | Local id, e.g. `C1-1043`. Not a city ticket. |
| `serviceId` | string | Closed catalog id (`missed_trash`, `pothole`, …). |
| `lang` | `en` \| `es` \| `tl` \| `zh` | UI language at save time. |
| `text` | string | What the resident typed. Device only. |
| `status` | string | `HEARD` · `CLASSIFIED` · `READY` · `SUBMITTED` · `FOLLOW-UP DUE` · `RESOLVED` |
| `confirmation` | string \| null | Number *the city gave them*, typed back in by the resident. |
| `followUpDate` | string \| null | Reminder date the resident set. |
| `createdAt` | ISO-8601 | First save. |
| `updatedAt` | ISO-8601 | Last save. |
| `evidenceTicks` | array | Which checklist boxes they marked. |
| `confidence` | number | Match confidence shown on the receipt. |

`caseId` is generated on-device. It is not sent anywhere and is not a City of Compton confirmation number.

---

## Store API

`C1.createCaseStore()` returns:

| Method | Effect |
|---|---|
| `enable()` | First write. Creates the key with an empty `cases` array and `consentAt`. |
| `isEnabled()` | `true` only if the key exists and parses. |
| `consentedAt()` | The `consentAt` timestamp, or null. |
| `save(record)` | Upsert one case. |
| `get(caseId)` | Read one case. |
| `list()` | All saved cases (feeds **Your cases**). |
| `remove(caseId)` | Delete one case. |
| `wipe()` | `localStorage.removeItem("c1fix.cases.v1")`. Real delete. |
| `degraded` | `true` when the localStorage probe failed. |

`wipe()` does **not** set the value to `[]` or `null`. It removes the key. A Playwright check in `verify.py` reads storage after erasure and asserts the key is absent.

If the device blocks storage, the UI shows: *This device would not let us save. The case still works, but it will not survive closing the page.*

---

## What is never stored

- Passwords, emails, phone numbers of the resident
- Government IDs, names of neighbors, license plates (intake copy forbids them)
- City-side tickets other than the confirmation string the resident typed
- Analytics events (memory only — see below)
- Anything on a server

The app requests **no permissions**. No microphone, camera, location, contacts, or background network calls of its own.

---

## Analytics (session memory only)

Analytics never touch `localStorage`.

```
event name  → allow-listed?     → else reject
key names   → per-event allowlist? → else reject
value       → token grammar?    → else reject
                 ↓
         append to in-memory session log
```

Allowed funnel stages (privacy panel):

1. Intake started
2. Issue described
3. Route recommended
4. Evidence prepared
5. Official action opened
6. Confirmation recorded
7. Outcome verified

The log can carry short tokens such as `service_id=missed_trash` and `lang=en`.
It **cannot** carry the description the resident typed, an address, or a confirmation number. The privacy panel is the inspectable proof — not a claim on a marketing page.

Refresh or close the tab and the log is gone.

---

## Civic catalog (source of truth for city facts)

Phone numbers, form URLs, department names, and verification dates do **not** belong in UI copy. They belong in the catalog.

Intended source file: `lib/serviceCatalog.ts`.
Runtime source of truth today: compiled `bundle.js` plus the channel map on `C1X.SUBMISSION_CHANNELS` in `app.send.js`.
(`lib/` was never committed; treat `bundle.js` + `app.send.js` as canonical until it is restored.)

Human-readable source record: **[SERVICE-CATALOG.md](SERVICE-CATALOG.md)**.

### Route fields

| Field | Values | Rule |
|---|---|---|
| `id` | closed set of 22 | Classifier may only emit these ids. |
| owner / department | official name | Copied from the city page. |
| official intake | form \| email \| phone | Never invent a channel. |
| `verificationState` | `officially_verified` \| `needs_confirmation` | Shown as a pill on every receipt. |
| `lastVerifiedAt` | ISO date | Shown on the receipt. |
| `sourceUrl` | official page | Where the number/form was read. |
| `officialSlaConfirmed` | `false` on all 22 | No response-time promises. Enforced by test. |

### Submission channels (wave 4)

`C1X.SUBMISSION_CHANNELS` maps each route to one honest handoff:

- **7** official web forms (deep-linked; resident pastes the Message Studio text)
- **13** published department emails (`mailto:` draft; resident presses send)
- **1** phone-only route (abandoned vehicles) — labeled phone-only, not given a fake inbox

Each channel carries `src`: the official page(s) that publish it.
`scripts/verify-channels.py` re-fetches those pages. A missing address is drift (fail). A bot-wall is inconclusive (retry, never auto-fail).
Past **45 days** without a clean re-check, the receipt warns that the channel is due for review instead of showing a silent "verified" stamp.

---

## Integrity rules (do not regress)

1. **Consent before write.** `enable()` is the only call that creates `c1fix.cases.v1`.
2. **Real erase.** `wipe()` calls `removeItem`. Deleting one case calls `remove(caseId)`.
3. **Closed catalog.** Routing can only emit known service ids. Unknown → honest miss + `(310) 605-5500`.
4. **No SLA field that is true.** `officialSlaConfirmed` stays `false` until a published city SLA exists.
5. **No civic facts in copy.** Change a number in the catalog (or `app.send.js` channel map), not in three README sentences.
6. **Analytics cannot persist and cannot carry free text.**
7. **No network writes.** Email and forms open in the resident's own tools.
8. **Emergency records are not cases.** The emergency gate has no `route` field and must not be saved as a city service case.

---

## Operator notes

- Clearing site data in the browser is equivalent to `wipe()`.
- Two browsers on the same phone are two stores.
- There is nothing to back up on a server. If a resident wants a copy, they print the receipt or save the calendar file.
- Channel drift is a data-quality incident. Fix the catalog, bump the verification date only after `verify-channels.py` is clean, and do not hand-edit dates to silence the 45-day warning.

Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [SERVICE-CATALOG.md](SERVICE-CATALOG.md) · [HOW-IT-WORKS.md](HOW-IT-WORKS.md)
