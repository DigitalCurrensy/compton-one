#!/usr/bin/env bash
# COMPTON ONE: FIX — pre-deploy build check.
# Run before every push:  bash scripts/build-check.sh
# Exits non-zero on any failure. Keep this in sync with .github/workflows/ci.yml.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "1/6 required deploy files exist"
for f in index.html compton-one-fix.html bundle.js app.js app.langs.js app.ui.js app.send.js; do
  test -f "$f" || { echo "MISSING: $f"; exit 1; }
done

echo "2/6 controller + engine syntax check"
node --check bundle.js
node --check app.js
node --check app.langs.js
node --check app.ui.js
node --check app.send.js

echo "3/6 HTML loads the five scripts"
grep -q 'src="bundle.js"' index.html
grep -q 'src="app.js"' index.html
grep -q 'src="app.langs.js"' index.html
grep -q 'src="app.ui.js"' index.html
grep -q 'src="app.send.js"' index.html

echo "4/6 index.html and compton-one-fix.html identical"
cmp index.html compton-one-fix.html

echo "5/6 no placeholder or test-stub content shipped"
! grep -q 'PLACEHOLDER' app.js app.langs.js app.ui.js app.send.js index.html
! grep -q 'window.C1 stand-in' app.js app.ui.js

echo "6/6 palette guard — no blue, no red in the design system"
! grep -qiE '#315cff|#ff6b35|--blue|--orange' index.html app.template.html

echo "BUILD CHECK OK"
