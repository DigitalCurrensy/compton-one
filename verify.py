from playwright.sync_api import sync_playwright
import pathlib, sys
url = "file://" + str(pathlib.Path("compton-one-fix.html").resolve())
errs, results = [], []
def ok(n,c): results.append(("PASS" if c else "FAIL", n)); return c

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1280,"height":900})
    pg.on("console", lambda m: errs.append(m.text) if (m.type=="error" and "ERR_CERT" not in m.text and "Failed to load resource" not in m.text) else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(700)

    ok("landing renders hero", "one path forward" in pg.inner_text("#v-landing").lower())
    ok("every catalog service is offered as a tile", pg.locator("#tiles .tile").count()==22)
    ok("disclosure on landing", "does not submit directly" in pg.inner_text("#v-landing"))
    pg.screenshot(path="shots/01-landing.png", full_page=False)

    # demo scenario
    pg.click("text=Run the demo scenario"); pg.wait_for_timeout(400)
    ok("intake shown", not pg.locator("#v-intake").is_hidden())
    ok("mic prefilled", "trash was skipped" in pg.input_value("#issue"))
    pg.screenshot(path="shots/02-intake.png")

    pg.click("text=Find the right path"); pg.wait_for_timeout(500)
    ok("receipt shown", not pg.locator("#v-receipt").is_hidden())
    rt = pg.inner_text("#v-receipt")
    ok("receipt names real owner", "Municipal Utilities" in rt)
    ok("receipt shows verified number", "(310) 605-5524" in rt)
    ok("receipt shows verification pill", "officially verified" in rt.lower())
    ok("receipt shows source + date", "2026-07-27" in rt)
    ok("receipt shows follow-up date", "follow up" in rt.lower())
    ok("receipt shows no-submit disclosure", "does not submit directly" in rt)
    ok("receipt shows emergency exclusions", "stop and call 9-1-1" in rt.lower())
    ok("no SLA promise", "guarantee" not in rt.lower())
    pg.screenshot(path="shots/03-receipt.png", full_page=True)

    pg.click("text=I have saved this"); pg.wait_for_timeout(400)
    ok("timeline shown", not pg.locator("#v-timeline").is_hidden())
    pg.fill("#conf","SR-2026-04182"); pg.click("text=Save confirmation"); pg.wait_for_timeout(250)
    ok("confirmation recorded", "SR-2026-04182" in pg.inner_text("#tl"))
    pg.click("text=Mark resolved"); pg.wait_for_timeout(250)
    ok("resolved recorded", "RESOLVED" in pg.inner_text("#tl"))
    pg.screenshot(path="shots/04-timeline.png", full_page=True)

    pg.click("text=Go to my cases"); pg.wait_for_timeout(400)
    ok("dashboard shown", not pg.locator("#v-dashboard").is_hidden())
    ok("demo data labelled", "Demo data" in pg.inner_text("#v-dashboard"))
    pg.screenshot(path="shots/05-dashboard.png", full_page=True)

    # emergency gate
    pg.click("text=Start another report"); pg.wait_for_timeout(300)
    pg.fill("#issue","a power line is down in the street and the light is out")
    pg.click("text=Find the right path"); pg.wait_for_timeout(400)
    ok("EMERGENCY gate fires", not pg.locator("#v-emergency").is_hidden())
    et = pg.inner_text("#v-emergency")
    ok("emergency shows 9-1-1", "9-1-1" in et)
    ok("emergency gives no route", "Municipal Utilities" not in et and "Public Works" not in et)
    pg.screenshot(path="shots/06-emergency.png")

    # unsupported
    pg.click("#v-emergency >> text=Back"); pg.wait_for_timeout(300)
    pg.fill("#issue","how do I register to vote before the next election")
    pg.click("text=Find the right path"); pg.wait_for_timeout(400)
    ok("out-of-scope handled honestly", not pg.locator("#v-unsupported").is_hidden())
    ok("no invented department", "(310) 605-5500" in pg.inner_text("#v-unsupported"))
    pg.screenshot(path="shots/07-unsupported.png")

    # spanish
    pg.click("#lang-es"); pg.wait_for_timeout(300)
    pg.click("#v-unsupported >> text=Atrás"); pg.wait_for_timeout(250)
    pg.fill("#issue","no recogieron nuestra basura y los botes siguen llenos")
    pg.click("text=Encontrar el camino correcto"); pg.wait_for_timeout(500)
    st = pg.inner_text("#v-receipt")
    ok("spanish receipt renders", "recolección de basura omitida" in st.lower())
    ok("spanish not mixed-language", "prepare these details" not in st.lower())
    ok("spanish keeps verified number", "(310) 605-5524" in st)
    pg.screenshot(path="shots/08-receipt-es.png", full_page=True)

    # mobile
    pg.set_viewport_size({"width":390,"height":844}); pg.click("#lang-en"); pg.wait_for_timeout(300)
    pg.screenshot(path="shots/09-mobile-receipt.png", full_page=True)
    ok("no horizontal overflow at 390px", pg.evaluate("document.documentElement.scrollWidth<=391"))

    # ---- analytics contract, evidence checklist, reopen ----
    pg.set_viewport_size({"width":1280,"height":900}); pg.wait_for_timeout(200)
    SENT = "Our trash was skipped on Bullis Road and my mother cannot move the carts herself"
    pg.click("#v-receipt >> text=Change my answer"); pg.wait_for_timeout(250)
    pg.fill("#issue", SENT)
    pg.click("text=Find the right path"); pg.wait_for_timeout(450)
    boxes = pg.locator("#evlist .evbox")
    ok("evidence checklist is interactive", boxes.count() >= 3)
    for i in range(boxes.count()): boxes.nth(i).check()
    pg.wait_for_timeout(200)
    ok("evidence progress shown", "/" in pg.inner_text("#ev-prog"))
    ok("handoff link carries tracking hook",
       pg.evaluate("""()=>!![...document.querySelectorAll('#receipt a')].find(a=>a.getAttribute('onclick'))"""))
    pg.evaluate("""()=>document.querySelector('#receipt a').click()""")
    pg.wait_for_timeout(150)
    pg.click("text=I have saved this"); pg.wait_for_timeout(300)
    ok("reopen hidden before resolution", pg.locator("#btn-reopen").is_hidden())
    pg.fill("#conf","SR-2026-04182"); pg.click("text=Save confirmation"); pg.wait_for_timeout(200)
    pg.click("text=Mark resolved"); pg.wait_for_timeout(200)
    ok("reopen offered after resolution", not pg.locator("#btn-reopen").is_hidden())
    pg.click("text=Reopen this case"); pg.wait_for_timeout(200)
    ok("reopen returns case to open", "Not yet." in pg.inner_text("#tl"))
    pg.click("text=Mark resolved"); pg.wait_for_timeout(200)
    pg.click("text=Go to my cases"); pg.wait_for_timeout(350)

    log = pg.evaluate("()=>window.C1.analytics.drain()")
    names = [e["event"] for e in log]
    for ev in ["report_started","issue_description_entered","route_recommended",
               "evidence_checklist_completed","official_handoff_opened","confirmation_saved",
               "case_reopened","case_marked_resolved","emergency_gate_shown","language_selected"]:
        ok(f"event recorded: {ev}", ev in names)
    ok("funnel rendered with 7 stages", pg.locator("#funnel .r").count()==7)
    ok("event log visible to the resident", len(pg.inner_text("#evlog").strip())>40)
    ok("privacy panel labelled", "recorded about you" in pg.inner_text("#v-dashboard").lower())

    import json as _json
    blob = _json.dumps(log)
    ok("analytics stores no fragment of the description",
       all(SENT[i:i+12] not in blob for i in range(len(SENT)-11)))
    ok("no analytics value contains whitespace",
       all(not (isinstance(v,str) and any(c.isspace() for c in v))
           for e in log for v in e["props"].values()))
    ok("analytics carries no wall-clock timestamp",
       all(e["atMs"] < 3_600_000 for e in log))
    rej = pg.evaluate("()=>window.C1.analytics.track('page_view',{})")
    ok("undeclared event rejected at runtime", rej["ok"] is False)
    rej2 = pg.evaluate("()=>window.C1.analytics.track('route_recommended',{service_id:'a whole sentence typed by a resident'})")
    ok("free-text value rejected at runtime", rej2["ok"] is False)
    ok("rejections did not enter the log",
       "page_view" not in _json.dumps(pg.evaluate("()=>window.C1.analytics.drain()")))
    pg.screenshot(path="shots/10-analytics.png", full_page=True)

    # a11y basics
    ok("skip link present", pg.locator("a.skip").count()==1)
    ok("all buttons >=44px tall", pg.evaluate("""()=>[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&b.getBoundingClientRect().height<44).length===0"""))
    ok("textarea has label", pg.evaluate("""()=>!!document.querySelector('label[for=issue]')"""))
    ok("single h1 per view", pg.evaluate("""()=>[...document.querySelectorAll('section')].every(s=>s.querySelectorAll('h1').length<=1)"""))
    b.close()

for s,n in results: print(f"  {s}  {n}")
print(f"\nconsole errors: {len(errs)}")
for e in errs[:5]: print("   !", e)
f=sum(1 for s,_ in results if s=="FAIL")
print(f"\n{len(results)-f}/{len(results)} checks passed")
sys.exit(1 if f or errs else 0)
