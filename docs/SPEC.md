# COMPTON ONE: FIX — Repository Specification

**Status:** Hackathon prototype · verified 2026-07-27  
**Maintainer:** Civic Source Lead  
**Next catalog review:** 2026-08-26

---

## Purpose

COMPTON ONE: FIX exists because 13 of the 22 verifiable city service routes in
Compton have no dedicated online intake form — they are phone-first barriers for
residents who work business hours, or who are Deaf or hard of hearing.

The app closes that gap without requiring any server infrastructure, any account,
or any dependency on city system integrations that don't yet exist.

---

## Product boundary

| In scope | Out of scope |
|---|---|
| 22 verified service routes | Voter registration, passports, parks |
| Bilingual (EN / ES) | County/state benefits (CalFresh, etc.) |
| Civic Action Receipt | School enrolment, jury duty, library |
| Case tracking (device-local) | Towed vehicles, direct city submission |
| Offline .ics follow-up reminder | Any guaranteed SLA |
| Analytics session log (local, inspectable) | Emergency dispatch |

---

## Five primary workflows

The classifier is tuned to these five. All others receive an honest
"outside what we handle today" response with the verified main line.

| ID | Service | Official intake | Owner |
|---|---|---|---|
| `illegal-dumping` | Illegal dumping | Web form | Clean Compton Initiative |
| `pothole` | Pothole | Phone — no form | Public Works — Street Maintenance |
| `streetlight` | Streetlight outage | Two forms (SCE or City) | Public Works / SCE |
| `missed-trash` | Missed trash pickup | Phone — no form | Municipal Utilities — Waste |
| `water-sewer` | Water or sewer concern | Phone — no form | Municipal Utilities — Water |

Three of the five have no official form. The app provides a pre-prepared phone
script, the verified number, and evidence guidance to compensate.

---

## Verification states

Each contact point and route carries a `verificationState`:

| Value | Meaning | Display |
|---|---|---|
| `officially_verified` | Read from an official City page on the record date | Green pill |
| `needs_confirmation` | Appears in directory; not confirmed as a resident intake line | Amber pill |

`officialSlaConfirmed` is `false` across all 22 routes. A test enforces this.
No response time is promised to the resident under any route.

---

## Classification model

**No LLM or embedding model is used.** Routing is deterministic:

1. Input is sanitized (max 500 chars; no angle brackets, script content, or SQL-like tokens)
2. English and Spanish phrase tables are scored with word-boundary matches
3. An emergency gate fires before any service match; if triggered, the result type
   cannot carry a route at all (enforced by TypeScript discriminated union)
4. A confidence threshold gate prevents low-signal guesses from reaching the receipt
5. `getRouteOrThrow` rejects any service ID not in the five-item union — prompt
   injection cannot produce a fabricated department because the output type makes
   it impossible

---

## Data model

### Civic Action Receipt

Issued at Step 3. Contains:

- Matched service ID and name (both languages)
- Route owner, verified phone/URL, verification pill, source URL, last-verified date
- Evidence checklist (what to gather before calling)
- Prohibited content list (what not to say)
- Call script
- Follow-up date (14 days out, rendered as .ics)
- Unique case ID (seeded per case, deterministic within session for test stability)
- No-SLA disclosure, no-submit disclosure, emergency exclusions

### Case status model

```
open → acknowledged → in_progress → resolved
                                   → closed (no resolution)
```

Status transitions are append-only to the timeline. There is no delete — only
a full case erasure that removes the entire record from localStorage.

---

## Analytics model

- **Allow-listed events only.** The event union is a closed TypeScript type.
- **Allow-listed keys per event.** Each event type has a fixed key set.
- **Value grammar.** Values must match a short fixed-token grammar;
  no free-form resident input can satisfy it.
- **Local-only sink.** Nothing is sent to any server.
- **Resident-inspectable.** The full session event log is shown to the resident
  in the privacy panel at Step 5.

---

## Storage contract

| Consent state | Written | Survives close |
|---|---|---|
| Not given | Nothing | — |
| Given | One localStorage key | Yes |
| Erased | Key deleted | No |

If the device blocks localStorage the app detects it, tells the resident, and
continues in memory. This is verified by 36 Playwright browser checks.

---

## Security properties

| Claim | Mechanism |
|---|---|
| Prompt injection cannot fabricate a department | Closed service ID union + `getRouteOrThrow` type guard |
| Emergency gate cannot be bypassed | Discriminated union; route field absent on emergency result |
| No PII in analytics log | Value grammar rejects free-form strings |
| No network calls | Verified by 57 Playwright checks; no XHR/fetch in app |
| No fingerprinting identifiers | Case ID seeded deterministically; no UUID v4, no timestamps as IDs |

---

## Test coverage

| Suite | Count | Runner |
|---|---|---|
| Unit tests | 272 | Vitest |
| Browser journey checks | 57 | Playwright (`verify.py`) |
| Adversarial checks (injection, leakage, a11y) | 62 | Playwright (`audit.py`) |
| Persistence / consent checks | 36 | Playwright (`audit-persistence.py`) |

Accuracy story: 100% on catalog phrases, 50.0% on independent held-out phrases
before fixes, 91.4% on the frozen split after fixes. See `docs/EVALUATION.md`
(in full release package) for methodology.

---

## Build dependencies

| Tool | Purpose |
|---|---|
| esbuild | Bundle `entry.ts` + `lib/` → `bundle.js` |
| Python 3 | Template assembly (`app.template.html` + `bundle.js` + `app.js` → deliverable) |
| Playwright | Browser checks (`verify.py`, `audit.py`, `audit-persistence.py`) |
| Vitest | Unit tests |
| TypeScript | Strict mode; `tsc --noEmit` must pass clean |

---

## Deliberate omissions and why

| Omitted | Reason |
|---|---|
| Direct city submission | No public API; city has not authorised automated submission |
| ID collection | Privacy — anonymous reporting is the whole point |
| SLA guarantees | No SLA data published by the city; a false promise would erode trust |
| Named-offender reporting | Safety risk and potential for abuse |
| Predictive policing | Explicitly refused |
| County/state services | Separate jurisdiction; a wrong referral wastes a resident's time |

---

## Contact points reference

| Value | State | Role |
|---|---|---|
| `(310) 605-5500` | `officially_verified` | City main line |
| `(310) 605-5524` | `officially_verified` | Municipal Utilities customer service |
| `(310) 605-6500` | `officially_verified` | Sheriff non-emergency |
| `9-1-1` | `officially_verified` | Life-threatening emergencies |
| `(310) 605-5691` | `needs_confirmation` | Public Works (directory listing) |
