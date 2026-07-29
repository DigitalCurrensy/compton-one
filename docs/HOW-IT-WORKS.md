# How COMPTON ONE: FIX works — plain-language walkthrough

**One sentence:** a resident describes a problem in plain language — English,
Español, Tagalog, or 中文 — and the app walks them to the one verified official
channel, with the evidence to gather and the words to say.
**It never submits anything to the city, and never claims to.**

---

## The five steps

### 1 · Describe

The resident types what happened ("there's a couch dumped on my corner") or
picks one of the 22 service tiles. No account, no sign-up, nothing leaves
their phone.

### 2 · Match

Two deterministic passes — **no AI anywhere in the routing path**:

1. The tested engine (`bundle.js`) scores the description against keyword
   tables for the 22-service catalog, and handles the emergency gate.
2. If — and only if — the engine returns *unsupported*, the controller's
   scenario engine scores ~30 plain-language phrase groups and routes, or asks
   an either/or question.

Before both passes, a curated rewrite table repairs common typos ("pot hole",
"grafitti", "lost my dog"). Every path can only emit a real, catalogued
service ID:

- **Emergencies** ("heart attack") hit a gate that stops everything and shows
  911 guidance. It cannot be argued past.
- **Genuine gibberish** gets an honest "we don't cover this" plus the verified
  city main line — never a guessed department.

### 3 · Act — the Civic Action Receipt

- The **verified official channel**: a deep link to the official form
  (7 routes), the published department email (13 routes), or an honest
  "phone-only" note (1 route) — no invented channels, ever.
- An **evidence checklist**: photos, exact address, dates — what the
  department actually needs.
- A **call script** and a **Message Studio** with a pre-written report the
  resident can copy, or open as a draft in their own email app with the
  verified address already filled in.
- The **verification date** of the channel, and a "wrong number or dead link?
  Report it" repair path.

### 4 · Track

Save the case (stays on the device, behind an explicit opt-in), add the real
confirmation number the city gives them, and drop a follow-up reminder into
Google Calendar or Apple/Outlook (.ics).

### 5 · Resolved

Mark resolved or reopen. The dashboard shows their history — and a privacy
panel that proves what little data exists (aggregate counters only) and that
it never leaves the device.

---

## The trust layer (wave 5)

Civic contact data rots — Compton's own City Clerk page changed its published
email while this project was being built. So every channel carries the exact
official page(s) it was verified against (`src`), a script
(`scripts/verify-channels.py`) re-fetches all 22 sources on a schedule, and
past 45 days without re-verification the receipt itself warns the resident
that the channel is due for a re-check. Drift becomes a caught bug, not a
broken promise.

## Why it matters

13 of Compton's 22 resident-facing service routes have **no online reporting
form at all** — phone-only, business-hours-only, English-first. Residents who
can't navigate that give up; problems go unreported, then unmeasured, then
unfunded. The same is true in thousands of small and mid-size American cities
running the same stack. COMPTON ONE: FIX is the router that gets a resident to
the right front door, in their language, with the right evidence — and it
makes the city's own intake better instead of pretending to replace it.
