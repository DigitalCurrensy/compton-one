# Replicate this for your city

The engine (`bundle.js`) and the controllers are city-agnostic. What is
Compton-specific: the **service catalog**, the **submission channel map**, and
the **strings**. A new city is a research project, not a rewrite — budget one
focused day for the catalog work.

## Steps

1. **Fork this repository.**
2. **Catalog research (the real work).** List your city's 15–25 most common
   service requests, taken from the city's official site only. For each route,
   record exactly one of:
   - the **official form URL**, or
   - the **published department email** — check the raw page HTML for
     `mailto:` links; CivicPlus sites hide addresses behind "Email" links, or
   - **phone-only** — say so honestly.
   For every value, record the exact page URL where you found it. That becomes
   the channel's `src`, and it is what makes the drift tripwire possible.
3. **Replace the service catalog** (titles + keywords in the bundle's tables)
   and **`SUBMISSION_CHANNELS`** in `app.send.js` (type, url/email, src per
   route). Set `SUBMISSION_VERIFIED` to the day you verified.
4. **Update city-specific strings**: the unsupported-wall fallback number,
   emergency guidance (911 is universal in the US; the non-emergency line is
   not), footer links, brand name.
5. **Translate** the string table into your city's top languages. Compton runs
   EN/ES/TL/ZH; UI chrome is fully translated per language, with English as a
   fallback so an untranslated string can never render as a raw key.
6. **Update the QA expectations** in `verify.py` (routing examples, channel
   counts, domains) — then run until green:
   ```bash
   bash scripts/build-check.sh
   python3 verify.py
   python3 scripts/verify-channels.py --report
   ```
7. **Deploy** as a static site (Vercel free tier works — see `vercel.json` and
   the `vercel-build` script in `package.json`). Add the weekly
   `channel-verify.yml` GitHub Actions workflow so channel drift opens an
   issue automatically.
8. **Put the quarterly re-verification on a calendar.** The tripwire will
   tell you when it slips — past 45 days, the app itself starts warning
   residents.

## The rules that carry over unchanged

- **No LLM in the routing path.** Two deterministic passes; both can only
  emit catalogued service IDs. The emergency gate cannot be bypassed.
- **No fake channels.** If a route is phone-only, the receipt says so.
- **No submission claims.** The app never sends anything to the city; the
  resident always presses send, and the UI says so in every language.
- **Verification dates everywhere.** A stale number presented as verified is
  a broken promise.

## What you get for free

Deterministic routing + emergency gate · four-layer controller architecture ·
Civic Action Receipt + Message Studio · local-first privacy model (no account,
no server, opt-in device storage only) · 41-check browser QA suite + build
gate · channel drift tripwire · bilingual-parity string system with fallback.
