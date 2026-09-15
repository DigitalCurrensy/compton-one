# COMPTON ONE : FIX

**One problem. One path forward.**

A phone-first civic navigator for residents of Compton, California.
Describe a city problem in your own words — English, Español, Tagalog, or 中文 — and the app finds the **one official next step**: the right department, a verified phone number or form, a checklist of what to gather, and a ready-to-use call script.

It does **not** file the report for you. It does **not** talk to a city server. It does **not** use AI to guess a department.

<p align="center">
  <img src="shots/01-landing.png" alt="COMPTON ONE landing page — One problem. One path forward. Four languages and 22 city services." width="920">
</p>

<p align="center">
  <a href="https://compton-one.vercel.app"><strong>Open the live app</strong></a>
  &nbsp;·&nbsp;
  <a href="https://github.com/DigitalCurrensy/compton-one/blob/main/compton-one-demo.mp4"><strong>Watch the 45-second video</strong></a>
  &nbsp;·&nbsp;
  <a href="docs/USAGE.md"><strong>How to use it</strong></a>
</p>

| Live app | Languages | City routes | Routing | Data |
|---|---|---|---|---|
| [compton-one.vercel.app](https://compton-one.vercel.app) | English · Español · Tagalog · 中文 | 22 verified Compton services | Keyword matching. No AI. | Stays on your phone |

---

## Why it exists

Most Compton service requests still start with “who do I even call?”

**13 of the 22 official routes have no online form.** They are phone-only, during business hours. That is a real barrier if you work those hours, if English is not your first language, or if you are Deaf or hard of hearing.

COMPTON ONE is the missing front door:

1. You describe what you saw.
2. The app matches it to one of 22 catalogued city services.
3. You leave with a **Civic Action Receipt** — official contact, evidence list, script, and a way to track what happens next.

Independent prototype. Not operated by the City of Compton.

---

## See the platform

### Demo video

**[Play the 45-second guided journey →](https://github.com/DigitalCurrensy/compton-one/blob/main/compton-one-demo.mp4)**

Landing → describe the problem → Civic Action Receipt → switch to Español → save the case → track it → open the privacy panel.

Same path, live: open [compton-one.vercel.app](https://compton-one.vercel.app) and press **Run the demo scenario**.

### Screenshots

| Landing — 22 services, 4 languages | Civic Action Receipt |
|---|---|
| ![Landing](shots/01-landing.png) | ![Receipt](shots/03-receipt.png) |

| Recibo en Español | Phone receipt |
|---|---|
| ![Spanish receipt](shots/08-receipt-es.png) | ![Mobile receipt](shots/09-mobile-receipt.png) |

| Case timeline | Your cases + privacy log |
|---|---|
| ![Timeline](shots/04-timeline.png) | ![Dashboard](shots/05-dashboard.png) |

| Emergency gate (always 9-1-1 first) | Honest miss — no guessed department |
|---|---|
| ![Emergency](shots/06-emergency.png) | ![Unsupported](shots/07-unsupported.png) |

Full captioned walkthrough: **[docs/USAGE.md](docs/USAGE.md)**.

---

## How to use it

Takes about one minute. No account. No download.

### 1. Open the app

Go to **[compton-one.vercel.app](https://compton-one.vercel.app)**.
Pick **English**, **Español**, **Tagalog**, or **中文** in the header.

### 2. Describe the problem

Tap **Start a report**. Type what happened the way you would tell a neighbor:

> “Our trash was skipped and my mother cannot move the carts herself.”

Or tap a service tile on the landing page (pothole, graffiti, missed trash, streetlight, and 18 more).

You do not need to know the department name.

### 3. Read the Civic Action Receipt

The receipt is the product. It shows:

- Which city division handles this
- The **officially verified** phone number, web form, or email — with the date it was last checked
- What to photograph or write down before you call
- A call script and a ready-to-send message
- One-tap open of your own mail app (the app never presses send)
- “Wrong number or dead link? Report it” if a contact has gone stale

### 4. Take the official next step

Call, open the city form, or send the email **yourself**. COMPTON ONE prepares the action. The city still receives it from you.

### 5. Track the case on this phone

If you want a reminder, tap **Keep this case on this phone**. Add the confirmation number the city gives you. Drop a follow-up on your calendar. Mark it resolved when it is done.

Nothing is saved until you opt in. **Erase everything saved** deletes it for real.

---

## The 22 routes

Every number and form was read from official City of Compton pages. Full source record: **[docs/SERVICE-CATALOG.md](docs/SERVICE-CATALOG.md)**.

| # | What you can report | Official intake |
|---|---|---|
| 1 | Illegal dumping | City web form |
| 2 | Pothole or roadway damage | Phone — no form |
| 3 | Streetlight outage | City form or SCE form (depends on the pole) |
| 4 | Missed trash pickup | Phone — no form |
| 5 | Water or sewer | Phone — no form |
| 6 | Graffiti | City web form |
| 7 | Abandoned vehicle | Phone — no form |
| 8 | Broken or lifted sidewalk | Phone — no form |
| 9 | Street tree | Phone — no form |
| 10 | Traffic signal, sign, or marking | Phone — no form |
| 11 | Storm drain or street flooding | Phone — no form |
| 12 | Bulky item pickup | Phone + info page |
| 13 | Recycling and e-waste | Info page + phone |
| 14 | Animal control | City web form |
| 15 | Property or code violation | City web form |
| 16 | Housing help | Department page + phone |
| 17 | Parking citation | Pay page + appeal page |
| 18 | Utility billing | Pay page + service page |
| 19 | Business license / building permit | Apply pages |
| 20 | Public records | City Clerk request pages |
| 21 | Power outage | SCE / city report page |
| 22 | Homeless outreach | Services page + phone |

City main line if nothing matches: **(310) 605-5500**.
Life-threatening emergency: **9-1-1**. The app stops and says so.

---

## How matching works (no AI)

There is no language model in the routing path.

1. Common typos are repaired with a fixed list (`pot hole` → pothole, `grafitti` → graffiti).
2. The engine scores your words against keyword tables for the 22 services.
3. If that miss, a second phrase-group pass tries again or asks an either/or question.
4. Emergencies (“fire”, “gun”, medical danger) hit a hard gate. The only next step is 9-1-1.
5. If nothing matches, the app says **this is outside what we handle** and gives the city main line. It will not invent a department.

Chrome (buttons, labels, receipts) exists in four languages. Matching the typed description is strongest in English and Spanish. Tagalog and 中文 screens say that up front.

Deep dive: **[docs/HOW-IT-WORKS.md](docs/HOW-IT-WORKS.md)** · **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Your data stays on your phone

COMPTON ONE never creates an account and never talks to a city server.

- No cookies, no login, no cloud database.
- If you tap **Keep this case on this phone**, the browser writes one local key (`c1fix.cases.v1`) on that device only.
- Session analytics are short fixed tokens in memory. Your description, address, and confirmation number cannot enter that log.
- **Erase everything saved** runs a real delete, not an empty list.
- Close the tab without saving and nothing is left behind.

Schema and integrity rules: **[docs/DATA.md](docs/DATA.md)**.

---

## What is real vs. labeled as a demo

**Real**

- 22-route catalog and official contacts
- Routing, receipt, scripts, evidence checklist
- One-tap email draft into *your* mail app
- Local save, timeline, calendar file, privacy panel

**Labeled in the UI as simulated**

- SMS reminders
- A city “we got it” acknowledgment
- Four sample cases on the dashboard

**Deliberately not built**

Emergency dispatch · filing the report for you · ID collection · payments · public accusations · named-offender reporting · minor profiles · predictive policing · promised response times.

Permissions requested: **none.**

---

## Run it on your computer

No build. No server. No environment variables.

```bash
git clone https://github.com/DigitalCurrensy/compton-one.git
cd compton-one
open index.html
```

Keep these files next to each other:

```
index.html          # or compton-one-fix.html — same page
bundle.js           # routing engine
app.js              # state, strings, routing controller
app.langs.js        # Tagalog + 中文 pack
app.ui.js           # receipt, timeline, dashboard
app.send.js         # official send channels
```

That is the whole runtime. Open the HTML file. Press **Run the demo scenario**.

### Checks (optional)

```bash
bash scripts/build-check.sh          # files, syntax, brand assets
python3 scripts/verify-channels.py   # re-check official city URLs and emails
python3 verify.py                    # browser journey (needs Playwright)
```

`npm run build` and the unit tests need a `lib/` TypeScript tree that was never committed. `bundle.js` is the engine source of truth until that tree is restored. The live page does not need it.

---

## Project map

```
index.html                 Live entry page
app.template.html          Markup + design system
app.js / app.ui.js         Controller
app.langs.js               TL / ZH language pack
app.send.js                Verified submission channels
bundle.js                  Compiled routing engine
compton-one-demo.mp4       45-second walkthrough
shots/                     Product screenshots
media/                     Architecture and title frames
docs/
  USAGE.md                 How to use the app, screen by screen
  HOW-IT-WORKS.md          Plain-language product walkthrough
  SERVICE-CATALOG.md       22 routes and official sources
  DATA.md                  What is stored, where, and how to erase it
  ARCHITECTURE.md          Design and security model
  REPLICATE.md             Stand this up for another city
  HACKATHON.md             Pitch: problem, demo, differentiators
  SPEC.md                  Original 2026-07-27 spec (historical)
  ROADMAP.md               Shipped work + next gaps
CHANGELOG.md               Wave-by-wave history
AGENTS.md                  How to change this repo
MEMORY.md                  Decisions that must not regress
```

---

## Bring this to another city

The routing idea is portable. The Compton phone numbers are not.

Fork the repo, replace the catalog with 15–25 services from *that* city’s official pages, and keep the rules: no invented channels, no AI classifier, no “we submitted it for you.”

Step-by-step: **[docs/REPLICATE.md](docs/REPLICATE.md)**.

---

## Status and next gaps

Shipped: four-language chrome, 22-route catalog, Civic Action Receipt, official send channels, channel-drift checker, local case tracking, privacy panel.

Still open:

- Tagalog / 中文 **intake matching** (chrome is translated; typed matching is still strongest in EN/ES)
- Offline / PWA shell
- Real SMS reminders (today they are labeled simulated)

History: **[CHANGELOG.md](CHANGELOG.md)** · **[docs/ROADMAP.md](docs/ROADMAP.md)**.

---

## License

MIT © Digital Currensy Inc.

COMPTON ONE : FIX is an independent prototype. It is not operated by the City of Compton and does not submit reports on your behalf.
