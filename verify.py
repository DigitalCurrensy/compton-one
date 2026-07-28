#!/usr/bin/env python3
"""COMPTON ONE: FIX — wave-3 + wave-4 functional verification suite.

Self-contained: starts its own http.server on an ephemeral port, drives the
app with Playwright (chromium headless), prints one line per check and exits
non-zero on any failure.

Usage:  python3 verify.py
"""
import functools
import http.server
import os
import re
import subprocess
import sys
import threading
import traceback

REPO = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------------------
# HTTP server (ephemeral port)
# ---------------------------------------------------------------------------
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

def start_server():
    handler = functools.partial(QuietHandler, directory=REPO)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    return srv, srv.server_address[1]

# ---------------------------------------------------------------------------
# Check registry
# ---------------------------------------------------------------------------
RESULTS = []  # (num, name, ok, detail)
CONSOLE_ERRORS = []  # (phase, message)

def report(num, name, ok, detail=""):
    RESULTS.append((num, name, ok, detail))
    line = f"{num:>2} {'PASS' if ok else 'FAIL'} {name}" + (f" :: {detail}" if detail and not ok else "")
    print(line, flush=True)

def run(fn):
    num = int(fn.__name__[1:])
    name = CHECK_NAMES.get(num, fn.__name__)
    try:
        ok, detail = fn()
    except Exception as e:
        ok, detail = False, f"EXC {type(e).__name__}: {e}"
        if os.environ.get("VERIFY_DEBUG"):
            traceback.print_exc()
    report(num, name, bool(ok), detail or "")

CHECK_NAMES = {
    1: "boot: zero console errors on load",
    2: "boot: 4 language buttons exist",
    3: "boot: exactly 22 .tile buttons on landing",
    4: "boot: How-it-works contains 22",
    5: "boot: voice removed (#btn-voice, window.voiceInput)",
    6: "journey: runDemo -> receipt, zero console errors",
    7: "journey: receipt contents (email/copy/report-link/tabs/evidence)",
    8: "journey: msg studio tabs + token substitution",
    9: "save: empty save -> amber #conf-note",
    10: "save: SR-TEST-1 saved",
    11: "save: duplicate save -> confSame, funnel stays 1",
    12: "privacy: funnel bars do not overflow tracks",
    13: "privacy: friendly evlog has no raw tokens",
    14: "privacy: repeated events collapse to xN badge",
    15: "contrast: .step.on paper color on receipt",
    16: "routing: pot hole -> pothole",
    17: "routing: grafitti -> graffiti removal",
    18: "routing: lost dog -> animal control",
    19: "routing: heart attack -> emergency gate",
    20: "routing: broken glass -> clarify -> illegal dumping",
    21: "routing: gibberish -> unsupported view",
    22: "langs: tl hero/tiles/group headers Tagalog",
    23: "langs: zh hero + group headers Chinese",
    24: "langs: tl demo -> English receipt + langNote, zero errors",
    25: "langs: zh emergency -> English guidance + em-note",
    26: "langs: document.title changes per language",
    27: "mobile: no horizontal overflow on 5 views",
    28: "mobile: language buttons visible/clickable",
    29: "build: scripts/build-check.sh exits 0",
    30: "build: index.html == compton-one-fix.html",
    31: "persistence: keep -> reload -> dashboard -> openSaved",
    32: "ics: download click does not throw (en + tl)",
    33: "wave4: form-type receipt shows official form link (dumping)",
    34: "wave4: email-type receipt names verified address + mailto hook",
    35: "wave4: phone-only service says so honestly (no fake channel)",
    36: "wave4: send block translates (zh + tl headings)",
    37: "wave4: channel map complete — 22 services, official domains only",
}

# ---------------------------------------------------------------------------
# Browser harness
# ---------------------------------------------------------------------------
from playwright.sync_api import sync_playwright  # noqa: E402

class App:
    def __init__(self, base):
        self.base = base
        self.pw = sync_playwright().start()
        self.browser = self.pw.chromium.launch(headless=True, args=["--no-sandbox"])
        self.ctx = self.browser.new_context(viewport={"width": 1280, "height": 900},
                                            accept_downloads=True)
        self.page = self.ctx.new_page()
        self.phase = "boot"
        self._wire(self.page)

    def _wire(self, page):
        def on_console(msg):
            if msg.type != "error":
                return
            txt = msg.text or ""
            loc = ""
            try:
                loc = (msg.location or {}).get("url", "")
            except Exception:
                pass
            if "favicon" in txt or "favicon" in loc:
                return  # environment artifact: no favicon in the static repo
            CONSOLE_ERRORS.append((self.phase, txt))
        def on_pageerror(err):
            CONSOLE_ERRORS.append((self.phase, f"pageerror: {err}"))
        page.on("console", on_console)
        page.on("pageerror", on_pageerror)

    def goto(self):
        self.page.goto(self.base + "/index.html", wait_until="load")
        self.page.wait_for_timeout(150)

    def reload(self):
        self.page.reload(wait_until="load")
        self.page.wait_for_timeout(150)

    def eval(self, expr):
        return self.page.evaluate(expr)

    def errors_since(self, n):
        return CONSOLE_ERRORS[n:]

    def close(self):
        try:
            self.browser.close()
            self.pw.stop()
        except Exception:
            pass

APP = None  # set in main

def visible(sel):
    return APP.eval(f"!!document.querySelector('{sel}') && !document.querySelector('{sel}').classList.contains('hidden')")

def view_visible(name):
    return visible(f"#v-{name}")

def inner_text(sel):
    return APP.eval(f"(document.querySelector('{sel}')||{{innerText:''}}).innerText")

def body_text():
    return APP.eval("document.body.innerText")

def assert_true(cond, detail):
    return (bool(cond), "" if cond else detail)

def run_demo():
    # Click the landing demo CTA when it is on screen (otherwise call runDemo()),
    # which fills the intake via micDemo; then Analyze.
    btn = APP.page.query_selector("button[onclick='runDemo()']")
    clicked = False
    if btn:
        try:
            if btn.is_visible():
                btn.click(); clicked = True
        except Exception:
            clicked = False
    if not clicked:
        APP.eval("runDemo()")
    APP.page.wait_for_timeout(300)
    APP.eval("analyze()")
    APP.page.wait_for_timeout(250)

def analyze_text(text):
    APP.eval("go('intake')")
    APP.page.fill("#issue", text)
    APP.page.click("#v-intake button[onclick='analyze()']")
    APP.page.wait_for_timeout(200)

# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

def c01():
    n = len(CONSOLE_ERRORS)
    return assert_true(n == 0, f"{n} console errors: {CONSOLE_ERRORS[:3]}")

def c02():
    ok = all(APP.eval(f"!!document.getElementById('lang-{l}')") for l in ("en", "es", "tl", "zh"))
    return assert_true(ok, "missing a language button")

def c03():
    tiles = APP.page.query_selector_all("#v-landing .tile")
    allbtn = all(t.evaluate("e=>e.tagName==='BUTTON'") for t in tiles)
    return assert_true(len(tiles) == 22 and allbtn, f"found {len(tiles)} tiles, all buttons={allbtn}")

def c04():
    txt = inner_text("#how")
    return assert_true(re.search(r"\b22\b", txt) is not None, f"'22' not in How-it-works: {txt[:120]!r}")

def c05():
    el = APP.eval("!!document.getElementById('btn-voice')")
    vi = APP.eval("typeof window.voiceInput === 'undefined'")
    return assert_true(not el and vi, f"btn-voice present={el}, voiceInput defined={not vi}")

def c06():
    n0 = len(CONSOLE_ERRORS)
    run_demo()
    ok = view_visible("receipt")
    errs = APP.errors_since(n0)
    return assert_true(ok and not errs, f"receipt visible={ok}, errors={errs[:3]}")

def c07():
    miss = []
    if not APP.page.query_selector("#receipt button[onclick*='emailDraft']"):
        miss.append("email draft button")
    if not APP.page.query_selector("#receipt button[onclick*='copyScript']"):
        miss.append("copy script button")
    link = APP.page.query_selector("#receipt a[href*='github.com/DigitalCurrensy/compton-one/issues']")
    if not link:
        miss.append("Report it link")
    tabs = APP.page.query_selector_all("#receipt [id^='msgtab-']")
    if len(tabs) != 3:
        miss.append(f"msg tabs={len(tabs)}")
    boxes = APP.page.query_selector_all("#evlist .evbox")
    if not boxes:
        miss.append("evidence checkboxes")
    # labels sanity
    rt = inner_text("#receipt")
    for frag in ("Open email draft", "Copy the script"):
        if frag not in rt:
            miss.append(f"label {frag!r}")
    return assert_true(not miss, "missing: " + ", ".join(miss))

def c08():
    t0 = APP.eval("document.getElementById('msgbox').innerText")
    APP.page.click("#msgtab-follow"); APP.page.wait_for_timeout(80)
    t1 = APP.eval("document.getElementById('msgbox').innerText")
    APP.page.click("#msgtab-escalate"); APP.page.wait_for_timeout(80)
    t2 = APP.eval("document.getElementById('msgbox').innerText")
    APP.page.click("#msgtab-report"); APP.page.wait_for_timeout(80)
    probs = []
    if not (t0 and t1 and t2):
        probs.append("empty msgbox")
    if t0 == t1 or t1 == t2:
        probs.append("tab switch did not change text")
    if "(Case C1-" not in t1 or "(Case C1-" not in t0:
        probs.append("no '(Case C1-' in msgbox")
    bt = body_text()
    for tok in ("{title}", "{caseId}", "{conf}", "{loc}", "{since}", "{date}",
                "{followUpDate}", "{n}", "{pct}"):
        if tok in bt:
            probs.append(f"raw token {tok} on page")
    return assert_true(not probs, "; ".join(probs))

def c09():
    APP.eval("go('timeline')"); APP.page.wait_for_timeout(120)
    APP.page.fill("#conf", "")
    APP.page.click("#v-timeline button[onclick='saveConf()']")
    APP.page.wait_for_timeout(80)
    note = inner_text("#conf-note")
    color = APP.eval("getComputedStyle(document.getElementById('conf-note')).color")
    ok = note.strip() != "" and color == "rgb(143, 82, 0)"
    return assert_true(ok, f"note={note!r} color={color}")

def c10():
    APP.page.fill("#conf", "SR-TEST-1")
    APP.page.click("#v-timeline button[onclick='saveConf()']")
    APP.page.wait_for_timeout(120)
    note = inner_text("#conf-note")
    tl = inner_text("#tl")
    ok = "✓" in note and "Confirmation saved: SR-TEST-1" in tl
    return assert_true(ok, f"note={note!r}, tl has saved line={'Confirmation saved: SR-TEST-1' in tl}")

def c11():
    note_before = inner_text("#conf-note")
    APP.page.click("#v-timeline button[onclick='saveConf()']")
    APP.page.wait_for_timeout(80)
    note = inner_text("#conf-note")
    same_msg = APP.eval("C1X.T[C1X.lang].confSame")
    ok1 = note.strip() == same_msg.strip() and note != note_before
    APP.eval("go('dashboard')"); APP.page.wait_for_timeout(150)
    cnt = APP.eval("""(() => {
      const rows = [...document.querySelectorAll('#funnel .r')];
      const r = rows.find(x => x.querySelector('.lab') && x.querySelector('.lab').textContent.trim() === C1X.T[C1X.lang].fnl6);
      return r ? r.querySelector('.n').textContent.trim() : 'ROW-MISSING';
    })()""")
    ok = ok1 and cnt == "1"
    return assert_true(ok, f"note={note!r} (expected confSame), funnel Confirmation recorded={cnt}")

def c12():
    # Trigger a burst of identical events (also feeds check 14), then re-render.
    APP.eval("go('timeline')"); APP.page.wait_for_timeout(80)
    APP.page.fill("#conf", "")
    for _ in range(3):
        APP.page.click("#v-timeline button[onclick='saveConf()']")
        APP.page.wait_for_timeout(60)
    APP.eval("go('dashboard')"); APP.page.wait_for_timeout(150)
    over = APP.eval("""(() => {
      const bad = [];
      document.querySelectorAll('.fnl .track').forEach(tr => {
        const bar = tr.querySelector('.bar');
        if (bar && bar.getBoundingClientRect().width > tr.getBoundingClientRect().width + 0.5) bad.push(1);
      });
      return bad.length;
    })()""")
    return assert_true(over == 0, f"{over} overflowing bars")

def c13():
    ev = inner_text("#evlog")
    raw = APP.eval("(document.getElementById('rawevlog')||{textContent:''}).textContent")
    bad = [t for t in ("confirmation_saved", "service_id=") if t in ev]
    ok = not bad and "confirmation_saved" in raw
    return assert_true(ok, f"raw tokens in friendly log={bad}, raw log has confirmation_saved={'confirmation_saved' in raw}")

def c14():
    ev = inner_text("#evlog")
    ok = re.search(r"×3\b", ev) is not None
    return assert_true(ok, f"no ×3 badge in evlog: {ev[:200]!r}")

def c15():
    APP.eval("go('receipt')"); APP.page.wait_for_timeout(120)
    color = APP.eval("""(() => {
      const el = document.querySelector('#steps .step.on');
      return el ? getComputedStyle(el).color : 'NO-STEP-ON';
    })()""")
    return assert_true(color == "rgb(242, 239, 229)", f".step.on color={color}")

def route_case(text, expect_view, expect_frag, num):
    APP.reload()
    analyze_text(text)
    APP.page.wait_for_timeout(150)
    okv = view_visible(expect_view)
    frag_ok = True
    if expect_frag:
        scope = f"#v-{expect_view}" if expect_view != "receipt" else "#receipt"
        frag_ok = expect_frag in inner_text(scope)
    n0errs = [e for e in CONSOLE_ERRORS if e[0] == f"route{num}"]
    return okv and frag_ok and not n0errs, f"view {expect_view} visible={okv}, frag {expect_frag!r}={frag_ok}, errors={n0errs[:2]}"

def c16(): return assert_true(*route_case("There is a pot hole on my street", "receipt", "Pothole", 16))
def c17(): return assert_true(*route_case("grafitti on the wall by my house", "receipt", "Graffiti removal", 17))

def c18():
    # fixText rewrites 'lost my dog' -> 'lost dog'. The canonical engine scores
    # this in the clarify band (weak 'dog' hit, 0.62), so the designed journey
    # reaches animal control either directly or via the animal-control clarify
    # question. Accept both; the final receipt must be Animal control.
    APP.reload()
    analyze_text("i lost my dog near the park")
    APP.page.wait_for_timeout(150)
    if view_visible("receipt") and "Animal control" in inner_text("#receipt"):
        return assert_true(True)
    if view_visible("clarify"):
        APP.page.click("#v-clarify button[onclick='clarifyAnswer(true)']")
        APP.page.wait_for_timeout(200)
        ok = view_visible("receipt") and "Animal control" in inner_text("#receipt")
        return assert_true(ok, f"via clarify-yes: receipt={view_visible('receipt')}, animal={'Animal control' in inner_text('#receipt')}")
    return assert_true(False, f"neither receipt nor clarify shown; visible receipt={view_visible('receipt')}")

def c19(): return assert_true(*route_case("someone is having a heart attack", "emergency", None, 19))

def c20():
    APP.reload()
    analyze_text("broken glass dumped on the sidewalk")
    APP.page.wait_for_timeout(150)
    if not view_visible("clarify"):
        return assert_true(False, "clarify view not shown for debris input")
    q = inner_text("#clarify-q") or inner_text("#v-clarify")
    APP.page.click("#v-clarify button[onclick='clarifyAnswer(true)']")
    APP.page.wait_for_timeout(200)
    ok = view_visible("receipt") and "Illegal dumping" in inner_text("#receipt")
    return assert_true(ok, f"after yes: receipt visible={view_visible('receipt')}, dumping={'Illegal dumping' in inner_text('#receipt')}")

def c21():
    APP.reload()
    analyze_text("zqxwv fkmlorp")
    APP.page.wait_for_timeout(150)
    body = inner_text("#unsup-body")
    ok = (view_visible("unsupported") and "(310) 605-5500" in body
          and re.search(r"\b22\b", body) is not None)
    return assert_true(ok, f"unsup visible={view_visible('unsupported')}, body={body[:140]!r}")

def c22():
    APP.page.click("#lang-tl"); APP.page.wait_for_timeout(150)
    hero = inner_text("#v-landing h1").lower()
    exp_hero = (APP.eval("C1X.T.tl.h1a"), APP.eval("C1X.T.tl.h1b"))
    ok_hero = all(p.lower() in hero for p in exp_hero if p)
    mism = APP.eval("""(() => {
      const bad = [];
      document.querySelectorAll('#v-landing .tile .t').forEach(el => {
        const txt = el.textContent.trim();
        const ids = Object.keys(C1X.C1.serviceCatalog);
        const ok = ids.some(id => (C1X.C1.serviceCatalog[id].title.tl || '') === txt);
        if (!ok) bad.push(txt);
      });
      return bad;
    })()""")
    n_tiles = len(APP.page.query_selector_all("#v-landing .tile"))
    groups_dom = APP.eval("[...document.querySelectorAll('#v-landing .tile-group')].map(e=>e.textContent.trim())")
    groups_tl = APP.eval("C1X.TILE_GROUPS.map(g=>g.tl)")
    ok = ok_hero and not mism and n_tiles == 22 and groups_dom == groups_tl
    return assert_true(ok, f"hero ok={ok_hero}, tile mismatches={mism[:3]}, groups {groups_dom} vs {groups_tl}")

def c23():
    APP.page.click("#lang-zh"); APP.page.wait_for_timeout(150)
    hero = inner_text("#v-landing h1").lower()
    exp_hero = (APP.eval("C1X.T.zh.h1a"), APP.eval("C1X.T.zh.h1b"))
    ok_hero = all(p.lower() in hero for p in exp_hero if p)
    groups_dom = APP.eval("[...document.querySelectorAll('#v-landing .tile-group')].map(e=>e.textContent.trim())")
    groups_zh = APP.eval("C1X.TILE_GROUPS.map(g=>g.zh)")
    ok = ok_hero and groups_dom == groups_zh
    return assert_true(ok, f"hero ok={ok_hero}, groups {groups_dom} vs {groups_zh}")

def c24():
    n0 = len(CONSOLE_ERRORS)
    APP.page.click("#lang-tl"); APP.page.wait_for_timeout(120)
    run_demo()
    APP.page.wait_for_timeout(200)
    probs = []
    if not view_visible("receipt"):
        probs.append("receipt not visible")
    rt = inner_text("#receipt")
    en_titles = APP.eval("Object.values(C1X.C1.serviceCatalog).map(r=>r.title.en)")
    if not any(t in rt for t in en_titles):
        probs.append("no English receipt title")
    note_txt = APP.eval("C1X.T.tl.receiptLangNote")
    if note_txt not in rt:
        probs.append("receiptLangNote not visible")
    errs = APP.errors_since(n0)
    if errs:
        probs.append(f"{len(errs)} console errors: {errs[:2]}")
    return assert_true(not probs, "; ".join(probs))

def c25():
    n0 = len(CONSOLE_ERRORS)
    APP.page.click("#lang-zh"); APP.page.wait_for_timeout(120)
    analyze_text("someone is having a heart attack")
    APP.page.wait_for_timeout(150)
    probs = []
    if not view_visible("emergency"):
        probs.append("emergency view not shown")
    emh = inner_text("#em-h")
    exp = APP.eval("C1X.C1.EMERGENCY_GUIDANCE.en.heading")
    if emh.strip().lower() != exp.strip().lower():
        probs.append(f"em-h={emh!r} expected {exp!r}")
    if not inner_text("#em-note").strip():
        probs.append("#em-note empty")
    errs = APP.errors_since(n0)
    if errs:
        probs.append(f"{len(errs)} console errors")
    return assert_true(not probs, "; ".join(probs))

def c26():
    titles = {}
    for l in ("en", "es", "tl", "zh"):
        APP.page.click(f"#lang-{l}"); APP.page.wait_for_timeout(120)
        titles[l] = APP.eval("document.title")
    ok = len(set(titles.values())) >= 3 and titles["en"] != titles["tl"] and titles["en"] != titles["zh"] and titles["en"] != titles["es"]
    return assert_true(ok, f"titles={titles}")

def c27():
    APP.page.set_viewport_size({"width": 375, "height": 812})
    APP.reload()
    APP.page.wait_for_timeout(150)
    over = []
    def sw():
        return APP.eval("document.documentElement.scrollWidth")
    if sw() > 376: over.append(f"landing={sw()}")
    APP.eval("go('intake')"); APP.page.wait_for_timeout(100)
    if sw() > 376: over.append(f"intake={sw()}")
    run_demo(); APP.page.wait_for_timeout(200)
    if sw() > 376: over.append(f"receipt={sw()}")
    APP.eval("go('timeline')"); APP.page.wait_for_timeout(100)
    if sw() > 376: over.append(f"timeline={sw()}")
    APP.eval("go('dashboard')"); APP.page.wait_for_timeout(100)
    if sw() > 376: over.append(f"dashboard={sw()}")
    return assert_true(not over, "overflow: " + ", ".join(over))

def c28():
    APP.eval("go('landing')"); APP.page.wait_for_timeout(100)
    probs = []
    for l in ("en", "es", "tl", "zh"):
        el = APP.page.query_selector(f"#lang-{l}")
        box = el.bounding_box() if el else None
        if not box or box["width"] == 0 or box["x"] < 0 or box["x"] + box["width"] > 376.5:
            probs.append(f"lang-{l} box={box}")
    APP.page.click("#lang-es"); APP.page.wait_for_timeout(120)
    if APP.eval("document.documentElement.lang") != "es":
        probs.append("click did not switch lang")
    APP.page.click("#lang-en"); APP.page.wait_for_timeout(80)
    APP.page.set_viewport_size({"width": 1280, "height": 900})
    return assert_true(not probs, "; ".join(probs))

def c29():
    r = subprocess.run(["bash", "scripts/build-check.sh"], cwd=REPO,
                       capture_output=True, text=True, timeout=120)
    return assert_true(r.returncode == 0, f"exit={r.returncode} {r.stdout[-200:]} {r.stderr[-200:]}")

def c30():
    a = open(os.path.join(REPO, "index.html"), "rb").read()
    b = open(os.path.join(REPO, "compton-one-fix.html"), "rb").read()
    return assert_true(a == b, "index.html != compton-one-fix.html")

def c31():
    n0 = len(CONSOLE_ERRORS)
    APP.reload(); APP.page.wait_for_timeout(150)
    run_demo(); APP.page.wait_for_timeout(200)
    case_id = APP.eval("document.querySelector('#receipt .r-case, #receipt [class*=case]') ? document.body.innerText.match(/C1-\d{4}/)[0] : ''")
    btn = APP.page.query_selector("#keepbar button[onclick='keepAnswer(true)']")
    if not btn:
        return assert_true(False, "keep-yes button not found")
    btn.click(); APP.page.wait_for_timeout(200)
    APP.reload(); APP.page.wait_for_timeout(150)
    APP.eval("go('dashboard')"); APP.page.wait_for_timeout(150)
    saved = inner_text("#saved")
    m = re.search(r"C1-\d{4}", saved)
    if not m:
        return assert_true(False, f"no saved case on dashboard: {saved[:120]!r}")
    cid = m.group(0)
    APP.page.click(f"#saved button[onclick*=\"openSaved('{cid}')\"]")
    APP.page.wait_for_timeout(200)
    ok = view_visible("receipt") and cid in inner_text("#receipt")
    errs = APP.errors_since(n0)
    return assert_true(ok and not errs, f"receipt restored={view_visible('receipt')}, case {cid} in receipt={cid in inner_text('#receipt')}, errors={errs[:2]}")

def c32():
    n0 = len(CONSOLE_ERRORS)
    probs = []
    dl_note = ""
    for lang in ("en", "tl"):
        APP.eval(f"setLang('{lang}')"); APP.page.wait_for_timeout(150)
        btn = APP.page.query_selector("button[onclick^='downloadIcs']")
        if not btn:
            probs.append(f"ics button missing (lang={lang})")
            continue
        try:
            with APP.page.expect_download(timeout=3000) as dl_info:
                btn.click()
            dl = dl_info.value
            dl_note += f" [{lang}] downloaded {dl.suggested_filename}"
        except Exception:
            dl_note += f" [{lang}] no download event captured"
        APP.page.wait_for_timeout(150)
    errs = APP.errors_since(n0)
    if errs:
        probs.append(f"{len(errs)} console errors: {errs[:2]}")
    return (not probs, ("; ".join(probs) if probs else dl_note.strip()))

# ---------------------------------------------------------------------------
# WAVE 4 — submission channels
# ---------------------------------------------------------------------------
def c33():
    APP.reload()
    analyze_text("someone dumped a couch and old tires on my corner")
    APP.page.wait_for_timeout(200)
    probs = []
    if not view_visible("receipt"):
        probs.append("no receipt for dumping input")
    blk = inner_text("#send-block") if APP.page.query_selector("#send-block") else ""
    if "Illegal dumping" not in inner_text("#receipt"):
        probs.append("not the dumping receipt")
    if not blk:
        probs.append("no #send-block injected")
    href = APP.eval("(document.querySelector('#send-block a')||{}).href || ''")
    if "comptoncitycity.org/i-want-to/report/illegal-dumping" not in href:
        probs.append(f"form href wrong: {href}")
    tgt = APP.eval("(document.querySelector('#send-block a')||{}).target || ''")
    if tgt != "_blank":
        probs.append("form link does not open a new tab")
    errs = APP.errors_since(0)
    if errs:
        probs.append(f"console errors: {errs[:1]}")
    return (not probs, "; ".join(probs) if probs else "form channel rendered")

def c34():
    APP.reload()
    analyze_text("There is a pot hole on my street")
    APP.page.wait_for_timeout(200)
    probs = []
    blk = inner_text("#send-block") if APP.page.query_selector("#send-block") else ""
    if "contactpw@comptoncity.org" not in blk:
        probs.append("verified address not shown in block")
    APP.eval("emailDraft()")
    APP.page.wait_for_timeout(150)
    href = APP.eval("window.__lastMailto || ''")
    if not href.startswith("mailto:contactpw@comptoncity.org"):
        probs.append(f"mailto To wrong: {href[:80]}")
    if "Compton%20One" not in href and "Compton+One" not in href and "Compton One" not in href:
        probs.append("subject missing from mailto")
    if len(href) < 120:
        probs.append("body suspiciously short — msgbox text not included")
    return (not probs, "; ".join(probs) if probs else f"mailto ok ({len(href)} chars)")

def c35():
    APP.reload()
    analyze_text("an abandoned car has been on my street for two weeks")
    APP.page.wait_for_timeout(200)
    probs = []
    if not view_visible("receipt"):
        probs.append("no receipt for abandoned vehicle")
    blk = inner_text("#send-block") if APP.page.query_selector("#send-block") else ""
    if not blk:
        probs.append("no #send-block")
    if APP.page.query_selector("#send-block a, #send-block button"):
        probs.append("phone-only service must NOT show a form/email action")
    if "phone" not in blk.lower():
        probs.append("no honest phone-only note")
    return (not probs, "; ".join(probs) if probs else "phone-only honesty ok")

def c36():
    APP.reload(); run_demo()
    APP.eval("analyze()")
    APP.page.wait_for_timeout(250)
    probs = []
    APP.eval("setLang('zh')")
    APP.page.wait_for_timeout(250)
    blk = APP.page.query_selector("#send-block")
    if not blk:
        probs.append("send block lost after zh switch")
    else:
        h3 = blk.query_selector("h3").inner_text()
        if "发送" not in h3:
            probs.append(f"zh heading not translated: {h3}")
    APP.eval("setLang('tl')")
    APP.page.wait_for_timeout(250)
    blk = APP.page.query_selector("#send-block")
    if not blk:
        probs.append("send block lost after tl switch")
    else:
        h3 = blk.query_selector("h3").inner_text()
        if "ipadala" not in h3.lower():  # h3 is CSS-uppercased
            probs.append(f"tl heading not translated: {h3}")
    APP.eval("setLang('en')")
    return (not probs, "; ".join(probs) if probs else "zh + tl headings ok")

def c37():
    probs = []
    n = APP.eval("Object.keys(C1X.SUBMISSION_CHANNELS).length")
    if n != 22:
        probs.append(f"channel map has {n} entries, expected 22")
    bad = APP.eval("""Object.entries(C1X.SUBMISSION_CHANNELS).flatMap(([id,c]) => {
      const out = [];
      if (!['form','email','phone'].includes(c.type)) out.push(id + ':bad-type');
      if (c.url && !/^https:\/\/([a-z0-9.-]+\.)?(comptoncity\.org|pticket\.com|sce\.com)\//.test(c.url)) out.push(id + ':url:' + c.url);
      if (c.email && !/@comptoncity\.org$/.test(c.email)) out.push(id + ':email:' + c.email);
      return out;
    })""")
    if bad:
        probs.append(f"off-domain/unverified entries: {bad}")
    ids = APP.eval("Object.keys(C1X.SUBMISSION_CHANNELS).filter(id => !C1.serviceCatalog[id])")
    if ids:
        probs.append(f"channels reference unknown services: {ids}")
    return (not probs, "; ".join(probs) if probs else "22 services, official domains only")

# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------
def main():
    global APP
    srv, port = start_server()
    base = f"http://127.0.0.1:{port}"
    print(f"serving {REPO} on {base}", flush=True)
    APP = App(base)

    # BOOT / LANDING
    APP.phase = "boot"; APP.goto()
    for f in (c01, c02, c03, c04, c05): run(f)

    # JOURNEY EN (stays on the same loaded page)
    APP.phase = "journey"
    for f in (c06, c07, c08): run(f)

    # SAVE FEEDBACK — reload for a clean analytics session
    APP.phase = "save"; APP.reload(); run_demo()
    for f in (c09, c10, c11): run(f)

    # PRIVACY PANEL (burst of identical events happens inside c12)
    APP.phase = "privacy"
    for f in (c12, c13, c14): run(f)

    # CONTRAST (receipt still in state; reload+runDemo to be safe)
    APP.phase = "contrast"; APP.reload(); run_demo()
    run(c15)

    # ROUTING (each reloads internally)
    for f in (c16, c17, c18, c19, c20, c21):
        APP.phase = f"route{int(f.__name__[1:])}"; run(f)

    # LANGUAGES
    APP.phase = "langs"; APP.reload()
    for f in (c22, c23, c24, c25, c26): run(f)

    # MOBILE
    APP.phase = "mobile"
    for f in (c27, c28): run(f)

    # BUILD GATE (no browser)
    APP.phase = "build"
    for f in (c29, c30): run(f)

    # PERSISTENCE
    APP.phase = "persistence"
    run(c31)

    # ICS / GCAL (receipt restored by c31)
    APP.phase = "ics"
    run(c32)

    # WAVE 4 — submission channels
    APP.phase = "wave4"
    for f in (c33, c34, c35, c36, c37): run(f)

    APP.close()
    srv.shutdown()

    print("-" * 72)
    failed = [r for r in RESULTS if not r[2]]
    if CONSOLE_ERRORS:
        print(f"CONSOLE ERRORS CAPTURED ({len(CONSOLE_ERRORS)}):")
        for ph, msg in CONSOLE_ERRORS[:20]:
            print(f"  [{ph}] {msg[:220]}")
    else:
        print("CONSOLE ERRORS CAPTURED: none")
    print(f"TOTAL: {len(RESULTS) - len(failed)}/{len(RESULTS)} passed")
    print("VERDICT:", "PASS" if not failed else "FAIL")
    return 0 if not failed else 1

if __name__ == "__main__":
    sys.exit(main())
