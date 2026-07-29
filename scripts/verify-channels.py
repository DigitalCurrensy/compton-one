#!/usr/bin/env python3
"""COMPTON ONE: FIX — wave 5: catalog trust pipeline.

Re-verifies every submission channel in app.send.js (C1X.SUBMISSION_CHANNELS)
against its official source:

  form   → fetch the form URL itself; a real 200 page passes.
  email  → fetch each src page; the published address must appear in the raw
           HTML (CivicPlus hides addresses behind mailto: "Email" links, so we
           search the markup, not just rendered text). Any one src containing
           the address passes; a real page set WITHOUT the address = DRIFT.
  phone  → nothing written to check; reported, never failed.

WAF honesty: comptoncity.org sits behind a bot wall. A challenge page (~340
bytes, no real content) is NOT proof of drift — it is INCONCLUSIVE and we
retry. Only hard signals fail a channel: a real page that lost the address,
or a hard HTTP error. Inconclusive runs never auto-bump the verified date.

Usage:
  python3 scripts/verify-channels.py [--report REPORT.md] [--strict]
                                     [--update-date] [--timeout MS]

  --strict       exit 1 on INCONCLUSIVE as well as FAIL
  --update-date  after a fully clean pass, bump VERIFIED in app.send.js to today
  exit code: 0 = no hard failures, 1 = drift/dead channel found, 2 = usage/env error
"""
import argparse
import datetime
import re
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SEND_JS = REPO / "app.send.js"

CHALLENGE_MAX_BYTES = 2000  # WAF challenge pages are ~340 bytes
CHALLENGE_MARKERS = ("challenge", "captcha", "cf-ray", "just a moment")
RETRIES = 3
BACKOFF_S = (2, 5, 10)

# ---------------------------------------------------------------------------
# Parse the channel map out of app.send.js (single source of truth).
# The module is authored in a deterministic style; we parse entries of the
# shape:   key: { type: 'form'|'email'|'phone', url?: '...', email?: '...',
#                 src: ['...', ...] },
# ---------------------------------------------------------------------------
ENTRY_RE = re.compile(
    r"(\w+)\s*:\s*\{\s*type:\s*'(form|email|phone)'(.*?)\},?", re.DOTALL)
FIELD_RE = re.compile(r"(url|email):\s*'([^']+)'")
SRC_RE = re.compile(r"src:\s*\[([^\]]*)\]", re.DOTALL)
STR_RE = re.compile(r"'([^']+)'")
VERIFIED_RE = re.compile(r"var VERIFIED = '(\d{4}-\d{2}-\d{2})';")


def load_channels():
    text = SEND_JS.read_text(encoding="utf-8")
    m = re.search(r"var CHANNELS = \{(.*?)\n  \};", text, re.DOTALL)
    if not m:
        raise SystemExit("could not locate CHANNELS block in app.send.js")
    channels = {}
    for key, ctype, rest in ENTRY_RE.findall(m.group(1)):
        fields = dict(FIELD_RE.findall(rest))
        srcm = SRC_RE.search(rest)
        src = STR_RE.findall(srcm.group(1)) if srcm else []
        channels[key] = {"type": ctype, "url": fields.get("url"),
                         "email": fields.get("email"), "src": src}
    if not channels:
        raise SystemExit("CHANNELS block parsed empty — format drift?")
    verified = VERIFIED_RE.search(text)
    return channels, (verified.group(1) if verified else "unknown")


# ---------------------------------------------------------------------------
# Browser fetch with WAF-challenge detection
# ---------------------------------------------------------------------------
class Fetcher:
    def __init__(self, timeout_ms):
        from playwright.sync_api import sync_playwright
        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch(headless=True, args=["--no-sandbox"])
        self._page = self._browser.new_context(
            user_agent=("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                        "(KHTML, like Gecko) Chrome/126.0 Safari/537.36")
        ).new_page()
        self.timeout = timeout_ms

    def fetch(self, url):
        """Return (status, html). status: 'ok' | 'http_error' | 'challenge' | 'error'."""
        for attempt in range(RETRIES):
            try:
                resp = self._page.goto(url, wait_until="domcontentloaded",
                                       timeout=self.timeout)
                self._page.wait_for_timeout(1200)
                html = self._page.content()
                low = html[:4000].lower()
                if len(html) < CHALLENGE_MAX_BYTES or any(
                        mk in low for mk in CHALLENGE_MARKERS):
                    if attempt < RETRIES - 1:
                        time.sleep(BACKOFF_S[attempt])
                        continue
                    return "challenge", html
                code = resp.status if resp else 0
                if code and code >= 400:
                    return "http_error", f"HTTP {code}"
                return "ok", html
            except Exception as e:  # noqa: BLE001 — report any fetch failure
                if attempt < RETRIES - 1:
                    time.sleep(BACKOFF_S[attempt])
                    continue
                return "error", f"{type(e).__name__}: {e}"
        return "error", "unreachable"

    def close(self):
        try:
            self._browser.close()
            self._pw.stop()
        except Exception:
            pass


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------
def check_all(channels, fetcher):
    """Return list of dicts: key, type, target, result, detail.
    result in PASS | FAIL | INCONCLUSIVE | SKIP."""
    results = []
    email_cache = {}  # src url -> (status, html) — emails share src pages

    def fetch_cached(url):
        if url not in email_cache:
            email_cache[url] = fetcher.fetch(url)
        return email_cache[url]

    for key, ch in channels.items():
        if ch["type"] == "phone":
            results.append(dict(key=key, type="phone", target="(phone-only)",
                                result="SKIP",
                                detail="no written channel — nothing to re-verify"))
            continue

        if ch["type"] == "form":
            status, html = fetcher.fetch(ch["url"])
            if status == "ok":
                results.append(dict(key=key, type="form", target=ch["url"],
                                    result="PASS", detail="form page live"))
            elif status == "challenge":
                results.append(dict(key=key, type="form", target=ch["url"],
                                    result="INCONCLUSIVE",
                                    detail="bot wall — could not load a real page"))
            else:
                results.append(dict(key=key, type="form", target=ch["url"],
                                    result="FAIL", detail=f"form dead: {html}"))
            continue

        # email
        saw_real_page = False
        inconclusive = 0
        for src in ch["src"]:
            status, html = fetch_cached(src)
            if status == "ok":
                saw_real_page = True
                if ch["email"] in html:
                    results.append(dict(key=key, type="email", target=ch["email"],
                                        result="PASS",
                                        detail=f"published on {src}"))
                    break
            elif status == "challenge":
                inconclusive += 1
        else:
            if saw_real_page:
                results.append(dict(
                    key=key, type="email", target=ch["email"], result="FAIL",
                    detail="DRIFT: real pages loaded, address no longer published"))
            elif inconclusive:
                results.append(dict(key=key, type="email", target=ch["email"],
                                    result="INCONCLUSIVE",
                                    detail="bot wall on every source page"))
            else:
                results.append(dict(key=key, type="email", target=ch["email"],
                                    result="FAIL",
                                    detail="all source pages failed to load"))
    return results


def render_report(channels, verified, results):
    today = datetime.date.today().isoformat()
    lines = [
        f"# Channel re-verification — {today}",
        "",
        f"Channels last verified in-app: **{verified}** · services covered: "
        f"**{len(channels)}**",
        "",
        "| Service | Type | Channel | Result | Detail |",
        "|---|---|---|---|---|",
    ]
    icon = {"PASS": "✅", "FAIL": "❌", "INCONCLUSIVE": "⚠️", "SKIP": "➖"}
    for r in results:
        lines.append(f"| {r['key']} | {r['type']} | {r['target']} "
                     f"| {icon[r['result']]} {r['result']} | {r['detail']} |")
    counts = {}
    for r in results:
        counts[r["result"]] = counts.get(r["result"], 0) + 1
    lines += ["", "Totals: " + " · ".join(f"{k} {v}" for k, v in sorted(counts.items()))]
    if counts.get("FAIL"):
        lines += ["",
                  "**Action needed:** re-verify the failed channel(s) by hand on "
                  "comptoncity.org, update `SUBMISSION_CHANNELS` in `app.send.js`, "
                  "and bump `VERIFIED`."]
    return "\n".join(lines) + "\n"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--report", help="write the Markdown report here")
    ap.add_argument("--strict", action="store_true",
                    help="exit 1 on INCONCLUSIVE as well as FAIL")
    ap.add_argument("--update-date", action="store_true",
                    help="after a clean pass, bump VERIFIED in app.send.js")
    ap.add_argument("--timeout", type=int, default=45000, help="ms per page load")
    args = ap.parse_args()

    channels, verified = load_channels()
    fetcher = Fetcher(args.timeout)
    try:
        results = check_all(channels, fetcher)
    finally:
        fetcher.close()

    report = render_report(channels, verified, results)
    print(report)
    if args.report:
        Path(args.report).write_text(report, encoding="utf-8")

    fails = [r for r in results if r["result"] == "FAIL"]
    inconclusive = [r for r in results if r["result"] == "INCONCLUSIVE"]

    if args.update_date:
        if fails or inconclusive:
            print("update-date: skipped — run was not fully clean "
                  f"({len(fails)} FAIL, {len(inconclusive)} INCONCLUSIVE)")
        else:
            today = datetime.date.today().isoformat()
            text = SEND_JS.read_text(encoding="utf-8")
            text, n = VERIFIED_RE.subn(f"var VERIFIED = '{today}';", text, count=1)
            if n == 1:
                SEND_JS.write_text(text, encoding="utf-8")
                print(f"update-date: VERIFIED bumped to {today}")
            else:
                print("update-date: VERIFIED literal not found — nothing changed")

    if fails or (args.strict and inconclusive):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
