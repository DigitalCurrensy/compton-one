/* COMPTON ONE: FIX — demo controller (part 2 of 2: receipt, timeline, dashboard, boot).
   Loads after app.js; shares state through window.C1X. */
(function () {
  var X = window.C1X;
  if (!X) return;
  var C1 = X.C1, A = X.A, store = X.store, state = X.state;
  var t = X.t, esc = X.esc, track = X.track, sid = X.sid, pill = X.pill;

  // CONTROLLER PATCH M-01: Message Studio. Deterministic, ready-to-send words
  // for the city — report / follow-up / escalation — in the active language.
  // No LLM: the templates are fixed and every variable is a receipt field the
  // resident can already see, so nothing can hallucinate a department, a
  // promise, or a case number. [brackets] mark what only the resident knows.
  function buildMsg(kind) {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return '';
    var tpl = t(kind === 'report' ? 'msgReportTpl' : kind === 'follow' ? 'msgFollowTpl' : 'msgEscalateTpl');
    var conf = state.confirmation || t('phConf');
    return tpl.replace('{title}', r.title).replace('{caseId}', r.caseId)
      .replace('{conf}', conf).replace('{followUpDate}', r.followUpDate)
      .replace('{loc}', t('phLoc')).replace('{since}', t('phSince')).replace('{date}', t('phDate'));
  }

  // W-04: the receipt now ACTS. One tap opens the resident's own mail app
  // with the message written — the app still never sends anything itself.
  window.emailDraft = function () {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return;
    var body = buildMsg(state.msgKind || 'report');
    window.location.href = 'mailto:?subject=' + encodeURIComponent('Compton One — ' + r.caseId) +
      '&body=' + encodeURIComponent(body);
  };

  window.copyScript = function () {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return;
    var note = document.getElementById('script-note');
    function done(ok) { if (note && ok) note.textContent = t('scriptCopied'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(r.script).then(function () { done(true); }, function () { done(legacyCopy(r.script)); });
    } else {
      done(legacyCopy(r.script));
    }
  };

  window.msgShow = function (kind) {
    state.msgKind = kind;
    ['report', 'follow', 'escalate'].forEach(function (k) {
      var b = document.getElementById('msgtab-' + k);
      if (b) b.setAttribute('aria-pressed', String(k === kind));
    });
    var box = document.getElementById('msgbox');
    if (box) box.textContent = buildMsg(kind);
    var note = document.getElementById('msg-note');
    if (note) note.textContent = '';
  };

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute'; ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  window.copyMsg = function () {
    var text = buildMsg(state.msgKind || 'report');
    var note = document.getElementById('msg-note');
    function done(ok) { if (note && ok) note.textContent = t('msgCopied'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(legacyCopy(text)); });
    } else {
      done(legacyCopy(text));
    }
  };

  function renderReceipt() {
    if (!state.cls || !state.receipt) return;
    // Rebuild in the active language so the receipt is never mixed-language.
    // Classifications that carry no route (emergency, unsupported, ambiguous)
    // legitimately return null here; bail rather than dereference it.
    var rebuilt = C1.buildReceipt(state.text, state.cls, { lang: X.lang, caseIdSeed: X.caseSeed });
    if (!rebuilt || rebuilt.kind !== 'action') return;
    state.receipt = rebuilt;
    var r = state.receipt;
    var methods = r.intakeMethods.map(function (m) {
      var dest = m.type === 'web'
        ? '<a href="' + esc(m.destination) + '" target="_blank" rel="noopener">' + esc(m.destination) + '</a>'
        : '<a href="tel:' + esc(m.destination.replace(/[^0-9]/g, '')) + '">' + esc(m.destination) + '</a>';
      var hook = ' onclick="handoff(\'' + esc(m.type) + '\',\'' + esc(m.verificationState) + '\')"';
      dest = dest.replace('<a ', '<a' + hook + ' ');
      return '<div class="method"><div>' + pill(m.verificationState) + '</div>' +
        '<div style="font-weight:600">' + esc(m.label) + '</div>' +
        '<div class="big">' + dest + '</div>' +
        '<div style="font-size:13px;color:var(--ink-60)">' + t('reaches') + ': ' + esc(m.reaches) + '</div>' +
        (m.appliesWhen ? '<div style="font-size:13px;color:var(--ink-60)">' + t('useWhen') + ': ' + esc(m.appliesWhen) + '</div>' : '') +
        '<div style="font-family:var(--mono);font-size:11px;color:var(--ink-60);text-transform:uppercase">' + t('lastVerified') + ' ' + esc(m.lastVerifiedAt) + '</div></div>';
    }).join('');

    // W-05: catalog trust — every receipt carries a one-tap way to report a
    // wrong number or dead link, prefilled with the service ID.
    var reportLink = '<div style="font-size:13px;margin-top:8px"><a class="linkbtn" target="_blank" rel="noopener" href="' +
      'https://github.com/DigitalCurrensy/compton-one/issues/new?title=' +
      encodeURIComponent('Catalog issue: ' + r.serviceId) + '&body=' +
      encodeURIComponent('Service: ' + r.title + '\nWhat is wrong (number, link, hours): \n') +
      '">' + esc(t('reportIssue')) + '</a></div>';
    // W-06: receipts issue in en/es (the city's working languages); tl/zh
    // residents get an honest note instead of a silent language switch.
    var langNote = (X.lang === 'tl' || X.lang === 'zh')
      ? '<div class="notice n-demo"><span class="ic" aria-hidden="true">i</span><span>' + esc(t('receiptLangNote')) + '</span></div>' : '';
    // R-02: low-confidence routes offer one-tap alternates.
    var altIds = (state.cls && state.cls.alternates ? state.cls.alternates : []).filter(function (id) {
      return id !== r.serviceId && C1.serviceCatalog[id];
    }).slice(0, 3);
    var altBlk = (altIds.length && r.confidence < 0.95)
      ? '<div class="blk noprint"><h3>' + esc(t('altH')) + '</h3><div class="chips">' +
        altIds.map(function (id) {
          var rr = C1.serviceCatalog[id];
          return '<button class="chip" onclick="pick(\'' + id + '\')">' + esc(rr.title[X.lang] || rr.title.en) + '</button>';
        }).join('') + '</div></div>' : '';
    document.getElementById('receipt').innerHTML =
      '<div class="r-head"><div class="r-meta">' +
        '<span>' + t('mCase') + ' <b>' + esc(r.caseId) + '</b></span>' +
        '<span>' + t('mStatus') + ' <b>' + esc(r.status) + '</b></span>' +
        '<span>' + t('conf').toUpperCase() + ' <b>' + Math.round(r.confidence * 100) + '%</b></span>' +
        '<span>' + esc(r.jurisdiction.toUpperCase()) + '</span></div>' +
        '<h2>' + esc(r.title) + '</h2></div>' +
      '<div class="r-body">' + langNote + altBlk +
        '<div class="blk"><h3>' + t('yousaid') + '</h3><p class="kv" style="font-style:italic">“' + esc(r.residentSummary) + '”</p></div>' +
        '<div class="blk"><h3>' + t('owner') + '</h3><p class="kv"><b>' + esc(r.owner) + '</b></p></div>' +
        '<div class="blk" id="blk-action"><h3>' + t('action') + '</h3>' + methods +
          '<div class="notice n-demo" style="margin-top:4px"><span class="ic" aria-hidden="true">▲</span><span>' + esc(r.disclosure) + '</span></div>' + reportLink + '</div>' +
        '<div class="blk"><h3>' + t('evidence') + '</h3><ul class="check live" id="evlist">' +
          r.evidence.map(function (e, i) {
            return '<li><label><input type="checkbox" class="evbox" onchange="evidenceTick()" ' +
              'aria-label="' + esc(e) + '"><span>' + esc(e) + '</span></label></li>';
          }).join('') + '</ul><p class="ev-prog" id="ev-prog"></p>' +
          // P-01: the checklist used to dead-end. Completing it now surfaces
          // the next move explicitly — official step, then confirmation.
          '<div class="notice n-next hidden noprint" id="ev-next"><span class="ic" aria-hidden="true">✓</span>' +
            '<span style="flex:1">' + esc(t('evReady')) + '</span>' +
            '<span class="row" style="margin-top:0">' +
              '<button class="btn btn-dark" onclick="goContact()">' + esc(t('evReadyBtn')) + '</button>' +
              '<button class="btn btn-quiet" onclick="goConfirm()">' + esc(t('evDoneBtn')) + '</button>' +
            '</span></div></div>' +
        '<div class="blk"><h3>' + t('prohibited') + '</h3><ul class="check no">' +
          r.prohibited.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="notice n-warn"><span class="ic" aria-hidden="true">▲</span><div><b>' + t('stopFirst') + '</b><ul style="margin:6px 0 0;padding-left:18px">' +
          r.emergencyExclusions.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul></div></div>' +
        '<div class="blk"><h3>' + t('script') + '</h3><p class="script">' + esc(r.script) + '</p>' +
          '<div class="row noprint" style="margin-top:10px"><button class="btn btn-quiet" onclick="copyScript()">' + esc(t('copyScript')) + '</button></div>' +
          '<p class="hint" id="script-note" aria-live="polite" style="margin-top:8px"></p></div>' +
        // M-01: ready-to-send message, three moments of the case lifecycle.
        '<div class="blk noprint"><h3>' + t('msgH') + '</h3><p class="hint" style="margin:0">' + t('msgHint') + '</p>' +
          '<div class="msgtabs" role="group" aria-label="' + esc(t('msgH')) + '">' +
            '<button class="msgtab" id="msgtab-report" aria-pressed="true" onclick="msgShow(\'report\')">' + esc(t('msgReport')) + '</button>' +
            '<button class="msgtab" id="msgtab-follow" aria-pressed="false" onclick="msgShow(\'follow\')">' + esc(t('msgFollow')) + '</button>' +
            '<button class="msgtab" id="msgtab-escalate" aria-pressed="false" onclick="msgShow(\'escalate\')">' + esc(t('msgEscalate')) + '</button>' +
          '</div>' +
          '<div class="msgbox" id="msgbox"></div>' +
          '<div class="row" style="margin-top:10px"><button class="btn btn-quiet" onclick="copyMsg()">' + esc(t('msgCopy')) + '</button>' +
            '<button class="btn btn-quiet" onclick="emailDraft()">' + esc(t('emailDraft')) + '</button></div>' +
          '<p class="hint" style="margin-top:8px">' + esc(t('emailHint')) + '</p>' +
          '<p class="hint" id="msg-note" aria-live="polite" style="margin-top:8px"></p></div>' +
        '<div class="blk"><h3>' + t('save') + '</h3><p class="kv">' + esc(r.expectedConfirmation || '—') + '</p></div>' +
        '<div class="blk"><h3>' + t('follow') + '</h3><p class="kv"><b>' + esc(r.followUpDate) + '</b> — ' + esc(r.followUpCheckpoint) + '</p>' +
          '<p style="font-size:13px;color:var(--ink-60)">' + t('noSla') + '</p></div>' +
        // P-02: ordered path from checklist → official step → confirmation → follow-up.
        '<div class="blk noprint"><h3>' + t('nextH') + '</h3><ol class="nextsteps">' +
          [t('nextS1'), t('nextS2'), t('nextS3'), t('nextS4')].map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
          '</ol></div>' +
        '<div class="blk"><h3>' + t('sources') + '</h3><div class="srcs">' +
          r.sources.map(function (s) { return '<div>• <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a> — ' + t('srcVerified') + ' ' + esc(s.lastVerifiedAt) + '</div>'; }).join('') +
          '<div style="margin-top:4px">' + t('srcMaintainer') + ': ' + esc(r.maintainer) + ' · ' + t('srcNext') + ' ' + esc(r.nextReviewAt) + '</div></div></div>' +
      '</div>';
    restoreEvidenceTicks();
    window.msgShow(state.msgKind || 'report');
    renderAfterContact();
  }

  // Scrolls the resident to the official contact block — used when the
  // evidence checklist completes and the next move is the handoff itself.
  window.goContact = function () {
    var el = document.getElementById('blk-action');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.goConfirm = function () {
    X.go('timeline');
    setTimeout(function () {
      var c = document.getElementById('conf');
      if (c) c.focus();
    }, 60);
  };

  // P-03: clicking the official phone/link used to be a silent exit. After
  // the handoff the receipt now says what comes back next.
  function renderAfterContact() {
    var bar = document.getElementById('after-contact');
    if (!bar) return;
    bar.classList.toggle('hidden', !state.contacted || state.deleted);
  }

  function renderTimeline() {
    var el = document.getElementById('tl'); if (!el) return;
    var r = state.receipt;
    // AUDIT A-03: the deleted-state message was unreachable, because the
    // null-receipt guard ran first and blanked the timeline silently.
    if (state.deleted) {
      el.innerHTML = '<li><div class="d"></div><div class="dot"><i></i></div><div><div class="st">' +
        t('tlCaseDeleted') + '</div><div class="nt">' + t('tlCaseDeletedBody') + '</div></div></li>';
      return;
    }
    if (!r || r.kind !== 'action') { el.innerHTML = ''; return; }
    var day = [t('dayToday'), t('dayToday'), t('dayToday'), t('dayBy') + r.followUpDate, r.followUpDate];
    var rows = [
      [t('stHeard'), day[0], t('tlHeard'), true],
      [t('stClassified'), day[1], t('tlClassified').replace('{title}', r.title).replace('{pct}', Math.round(r.confidence * 100)), true],
      [t('stReady'), day[2], t('tlReady'), true],
      [t('stSubmitted'), day[3], state.confirmation
        ? t('tlSubSaved').replace('{conf}', state.confirmation)
        : t('tlSubWait'), !!state.confirmation],
      [t('stFollowup'), day[4], t('tlFollowDue'), state.resolved],
      [t('stResolved'), state.resolved ? day[4] : '—', state.resolved ? t('tlResolvedY') : t('tlResolvedN'), state.resolved]
    ];
    var rb = document.getElementById('btn-reopen');
    if (rb) rb.classList.toggle('hidden', !state.resolved);
    var firstOpen = rows.findIndex(function (x) { return !x[3]; });
    el.innerHTML = rows.map(function (x, i) {
      var cls = x[3] ? 'done' : (i === firstOpen ? 'now' : '');
      return '<li class="' + cls + '"><div class="d">' + esc(x[1]) + '</div><div class="dot"><i></i></div>' +
        '<div><div class="st">' + esc(x[0]) + '</div><div class="nt">' + esc(x[2]) + '</div></div></li>';
    }).join('');
  }

  function restoreEvidenceTicks() {
    // AUDIT A-05: renderReceipt rebuilds the list, which used to wipe the
    // resident's progress every time they switched language.
    var boxes = [].slice.call(document.querySelectorAll('#evlist .evbox'));
    boxes.forEach(function (b, i) { b.checked = state.evidenceTicks.indexOf(i) !== -1; });
    updateEvidenceProgress(false);
  }

  function updateEvidenceProgress(fireEvent) {
    var boxes = [].slice.call(document.querySelectorAll('#evlist .evbox'));
    var done = boxes.filter(function (b) { return b.checked; }).length;
    var p = document.getElementById('ev-prog');
    if (p) p.textContent = boxes.length ? t('evDone') + ': ' + done + ' / ' + boxes.length : '';
    var next = document.getElementById('ev-next');
    if (next) next.classList.toggle('hidden', !(boxes.length && done === boxes.length));
    if (fireEvent && boxes.length && done === boxes.length && !state.evidenceDone) {
      state.evidenceDone = true;
      track('evidence_checklist_completed', { service_id: sid(), item_count: boxes.length });
    }
  }

  window.evidenceTick = function () {
    var boxes = [].slice.call(document.querySelectorAll('#evlist .evbox'));
    state.evidenceTicks = boxes.map(function (b, i) { return b.checked ? i : -1; })
                               .filter(function (i) { return i !== -1; });
    updateEvidenceProgress(true);
    persist();
  };

  window.handoff = function (methodType, verificationState) {
    state.contacted = true;
    renderAfterContact();
    track('official_handoff_opened', { service_id: sid(), method_type: methodType, verification_state: verificationState });
  };

  window.saveConf = function () {
    var note = document.getElementById('conf-note');
    var v = document.getElementById('conf').value.trim();
    if (!v) {
      if (note) { note.textContent = t('confEmpty'); note.style.color = 'var(--amber-ink)'; }
      track('error_shown', { error_code: 'empty_confirmation', view: 'timeline' });
      document.getElementById('conf').focus();
      return;
    }
    var clean = C1.sanitizeResidentText(v, 60);
    // W-02: repeat clicks used to re-save and re-track silently — that is how
    // one session inflated the "Confirmation recorded" funnel count 7x.
    if (state.confirmation && clean === state.confirmation) {
      if (note) { note.textContent = t('confSame'); note.style.color = 'var(--ink-60)'; }
      return;
    }
    state.confirmation = clean;
    track('confirmation_saved', { service_id: sid() });
    if (note) { note.textContent = t('confSaved'); note.style.color = '#1a7c46'; }
    renderTimeline(); renderDash(); persist();
  };
  window.markResolved = function () {
    state.resolved = true;
    track('case_marked_resolved', { service_id: sid() });
    renderTimeline(); renderDash(); persist();
  };
  window.reopenCase = function () {
    state.resolved = false;
    track('case_reopened', { service_id: sid() });
    renderTimeline(); renderDash(); persist();
  };
  window.deleteCase = function () {
    var id = sid();
    var removedId = state.receipt && state.receipt.caseId;
    state.deleted = true; state.receipt = null; state.cls = null; state.text = '';
    state.confirmation = null; state.resolved = false; state.evidenceTicks = []; state.evidenceDone = false;
    state.contacted = false;
    // AUDIT A-04: deletion has to remove the surface, not just the state.
    var r = document.getElementById('receipt'); if (r) r.innerHTML = '';
    var c = document.getElementById('conf'); if (c) c.value = '';
    var i = document.getElementById('issue'); if (i) i.value = '';
    if (removedId) store.remove(removedId);
    track('case_deleted', { service_id: id });
    renderTimeline(); renderDash(); renderKeepBar(); renderAfterContact();
  };

  var DEMO = [
    { id: 'C1-1001', sid: 'missed_trash', st: 'FOLLOW-UP DUE', age: 2 },
    { id: 'C1-1002', sid: 'streetlight', st: 'SUBMITTED', age: 1 },
    { id: 'C1-1003', sid: 'illegal_dumping', st: 'RESOLVED', age: 5 },
    { id: 'C1-1004', sid: 'pothole', st: 'READY', age: 0 }
  ];
  var ST_KEY = { 'RESOLVED': 'stResolved', 'FOLLOW-UP DUE': 'stFollowup', 'SUBMITTED': 'stSubmitted',
    'READY': 'stReady', 'HEARD': 'stHeard', 'CLASSIFIED': 'stClassified' };
  function badge(s) {
    var m = { 'RESOLVED': 'b-res', 'FOLLOW-UP DUE': 'b-due', 'SUBMITTED': 'b-sub', 'READY': 'b-ready' };
    return '<span class="badge ' + (m[s] || '') + '">' + esc(ST_KEY[s] ? t(ST_KEY[s]) : s) + '</span>';
  }
  function renderDash() {
    var savedEl = document.getElementById('saved');
    if (savedEl) {
      var saved = store.list();
      savedEl.innerHTML = saved.length
        ? saved.map(function (c) {
            var rr = C1.serviceCatalog[c.serviceId];
            var title = rr ? (rr.title[X.lang] || rr.title.en) : c.serviceId;
            return '<div class="caseitem"><span class="id">' + esc(c.caseId) + '</span><span class="ti">' +
              esc(title) + '</span>' + badge(c.status) +
              '<button class="btn btn-quiet" style="padding:9px 14px;min-height:44px" onclick="openSaved(\'' +
              esc(c.caseId) + '\')">' + esc(t('openCase')) + '</button></div>';
          }).join('')
        : '<p class="hint">' + esc(t('noSaved')) + '</p>';
    }
    var list = DEMO.slice();
    if (state.receipt && state.receipt.kind === 'action' && !state.deleted) {
      list.unshift({ id: state.receipt.caseId, sid: state.receipt.serviceId, age: 0, mine: true,
        st: state.resolved ? 'RESOLVED' : state.confirmation ? 'SUBMITTED' : 'READY' });
    }
    var resolved = list.filter(function (c) { return c.st === 'RESOLVED'; }).length;
    var due = list.filter(function (c) { return c.st === 'FOLLOW-UP DUE'; }).length;
    var stats = [[String(list.length), t('statCases')],
                 [String(resolved), t('statResolved')],
                 [String(due), t('statDue')],
                 [Math.round(100 * resolved / Math.max(1, list.length)) + '%', t('statRate')]];
    var se = document.getElementById('stats');
    if (se) se.innerHTML = stats.map(function (s) { return '<div class="stat"><div class="v">' + esc(s[0]) + '</div><div class="l">' + esc(s[1]) + '</div></div>'; }).join('');
    var ce = document.getElementById('cases');
    if (ce) ce.innerHTML = list.map(function (c) {
      var rr = C1.serviceCatalog[c.sid];
      var title = rr ? (rr.title[X.lang] || rr.title.en) : c.sid;
      return '<div class="caseitem"><span class="id">' + esc(c.id) + '</span><span class="ti">' +
        esc(title) + (c.mine ? '<span aria-hidden="true"> ★</span><span class="vh">' + esc(t('yourCaseMark')) + '</span>' : '') + '</span>' + badge(c.st) + '</div>';
    }).join('');
  }

  function statusOf() {
    return state.deleted ? null : state.resolved ? 'RESOLVED' : state.confirmation ? 'SUBMITTED' : 'READY';
  }

  function persist() {
    if (!store.isEnabled() || !state.receipt || state.receipt.kind !== 'action' || state.deleted) return;
    var r = state.receipt, now = new Date().toISOString();
    store.save({
      caseId: r.caseId, serviceId: r.serviceId, lang: X.lang, text: state.text,
      status: statusOf(), confirmation: state.confirmation, followUpDate: r.followUpDate,
      createdAt: state.createdAt || now, updatedAt: now,
      evidenceTicks: state.evidenceTicks.slice(), confidence: r.confidence
    });
    renderKeepBar(); renderDash();
  }

  window.keepAnswer = function (yes) {
    if (yes) {
      var okSave = store.enable();
      if (!okSave) { renderKeepBar(); return; }
      state.createdAt = state.createdAt || new Date().toISOString();
      persist();
    }
    state.keepAsked = true;
    renderKeepBar();
  };

  window.eraseAll = function () {
    store.wipe();
    state.keepAsked = true;
    renderKeepBar(); renderDash();
    var n = document.getElementById('erased-note');
    if (n) n.textContent = t('erased');
  };

  function renderKeepBar() {
    var bar = document.getElementById('keepbar');
    if (!bar) return;
    bar.removeAttribute('style');
    if (store.isEnabled()) {
      bar.className = 'notice n-privacy';
      bar.innerHTML = '<span class="ic" aria-hidden="true">🔒</span><span>' + esc(t('keepOn')) +
        ' · <button class="linkbtn" onclick="eraseAll()">' + esc(t('erase')) + '</button></span>';
      return;
    }
    if (store.degraded) {
      bar.className = 'notice n-warn';
      bar.innerHTML = '<span class="ic" aria-hidden="true">▲</span><span>' + esc(t('keepFail')) + '</span>';
      return;
    }
    if (state.keepAsked) {
      // AUDIT P-01: declining used to be permanent — the door stays open.
      bar.className = 'notice n-demo';
      bar.innerHTML = '<span class="ic" aria-hidden="true">○</span><span>' + esc(t('keepOff')) +
        ' · <button class="linkbtn" onclick="keepAnswer(true)">' + esc(t('keepYes')) + '</button>' +
        '</span><p class="hint" id="erased-note" style="margin:0"></p>';
      return;
    }
    bar.className = 'card';
    bar.setAttribute('style', 'background:var(--paper);border-style:dashed');
    bar.innerHTML = '<h3 style="font-size:22px;margin-bottom:8px">' + esc(t('keepH')) + '</h3>' +
      '<p class="hint" style="margin-bottom:14px">' + esc(t('keepBody')) + '</p>' +
      '<div class="row"><button class="btn btn-dark" onclick="keepAnswer(true)">' + esc(t('keepYes')) + '</button>' +
      '<button class="btn btn-quiet" onclick="keepAnswer(false)">' + esc(t('keepNo')) + '</button></div>' +
      '<p class="hint" id="erased-note" style="margin-top:10px"></p>';
  }

  window.openSaved = function (caseId) {
    var c = store.get(caseId);
    if (!c) return;
    X.lang = c.lang; X.applyLang();
    // AUDIT P-02: stripping all non-digits also ate the '1' in the 'C1-'
    // prefix. Match the numeric suffix only.
    var m = /(\d+)$/.exec(String(c.caseId));
    X.caseSeed = m ? parseInt(m[1], 10) : X.caseSeed;
    state.text = c.text;
    state.cls = { kind: 'routed', serviceId: c.serviceId, confidence: c.confidence || 0.9, alternates: [] };
    state.receipt = C1.buildReceipt(c.text, state.cls, { lang: X.lang, caseIdSeed: X.caseSeed });
    state.confirmation = c.confirmation; state.resolved = c.status === 'RESOLVED';
    state.deleted = false; state.evidenceTicks = (c.evidenceTicks || []).slice();
    state.evidenceDone = false; state.createdAt = c.createdAt; state.keepAsked = true;
    state.contacted = !!c.confirmation;
    var confEl = document.getElementById('conf'); if (confEl) confEl.value = c.confirmation || '';
    renderReceipt(); renderTimeline(); renderDash(); renderKeepBar();
    X.go('receipt');
  };

  // CONTROLLER PATCH C-02: one-tap Google Calendar via the official web
  // intent — no file download, works in every browser including in-app ones.
  // The .ics download stays for Apple/Outlook calendars.
  function gcalUrl() {
    var r = state.receipt;
    var d = String(r.followUpDate).replace(/-/g, '');
    var next = new Date(r.followUpDate + 'T00:00:00Z');
    next.setUTCDate(next.getUTCDate() + 1);
    var d2 = next.toISOString().slice(0, 10).replace(/-/g, '');
    var title = t('gcalTitlePfx') + r.title + ' (' + r.caseId + ')';
    var m = r.intakeMethods && r.intakeMethods[0];
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(title) +
      '&dates=' + d + '/' + d2 +
      '&details=' + encodeURIComponent(buildMsg('follow') + '\n\n' + r.owner + (m ? '\n' + m.destination : ''));
  }
  window.gcal = function () {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return;
    window.open(gcalUrl(), '_blank', 'noopener');
    var note = document.getElementById('print-note');
    if (note) note.textContent = t('gcalDone');
    track('follow_up_scheduled', { service_id: r.serviceId, days_ahead: 0 });
  };

  window.downloadIcs = function () {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return;
    var m = r.intakeMethods && r.intakeMethods[0];
    var ics = C1.buildReminderIcs({
      caseId: r.caseId, title: r.title, owner: r.owner, followUpDate: r.followUpDate,
      // ICS copy only exists in en/es inside the tested bundle — coerce.
      contact: m ? m.destination : '(310) 605-5500', confirmation: state.confirmation,
      lang: (X.lang === 'es' ? 'es' : 'en')
    });
    // Blob rather than a data: URI — data URIs are blocked or decoded oddly in
    // sandboxed frames and in-app browsers, which is where residents actually are.
    var name = C1.reminderFilename(r.caseId);
    try {
      var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1500);
      // B-01: the download used to give zero on-page feedback. Confirm inline.
      var note = document.getElementById('print-note');
      if (note) note.textContent = t('calDone');
    } catch (e) {
      // Last resort: show the reminder as text the resident can copy.
      openFallbackWindow('<pre style="white-space:pre-wrap;font:13px ui-monospace,monospace">' +
        esc(ics) + '</pre>', name);
    }
    track('follow_up_scheduled', { service_id: r.serviceId, days_ahead: 0 });
  };

  // Opens content in a new window; if popups are blocked, renders it inline.
  function openFallbackWindow(html, title) {
    var doc = '<!doctype html><html lang="' + X.lang + '"><head><meta charset="utf-8">' +
      '<title>' + esc(title) + '</title><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<style>body{font:15px/1.5 system-ui,sans-serif;margin:24px;color:#101210;background:#fff}' +
      'h1,h2,h3{font-family:system-ui,sans-serif} .r-head{margin-bottom:14px} .blk{margin:14px 0}' +
      '.method{border:1px solid #999;border-radius:8px;padding:10px;margin:8px 0}' +
      'ul{padding-left:18px} a{color:#000}</style></head><body>' + html +
      '<script>setTimeout(function(){try{window.print()}catch(e){}},350)<\/script></body></html>';
    var w = null;
    try { w = window.open('', '_blank'); } catch (e) { w = null; }
    if (w && w.document) { w.document.open(); w.document.write(doc); w.document.close(); return true; }
    return false;
  }

  // window.print() is blocked in sandboxed frames and some in-app
  // browsers, so the button silently did nothing. Try it, then fall back to a
  // printable window, then to an inline printable view.
  window.printReceipt = function () {
    var r = state.receipt;
    var printable = document.getElementById('receipt');
    var ok = false;
    try { window.print(); ok = true; } catch (e) { ok = false; }
    if (ok) return;
    if (printable && openFallbackWindow(printable.innerHTML, 'Compton One — ' + (r ? r.caseId : 'receipt'))) return;
    document.body.classList.add('print-only');
    window.scrollTo({ top: 0 });
    var note = document.getElementById('print-note');
    if (note) note.textContent = t('printFallback');
  };

  // W-03: the privacy panel used to render raw analytics tokens, and the
  // funnel scaled its bars off the first stage only — seven rage-clicked
  // saves pushed one bar clean out of the card. Residents read all of it as
  // leaked backend scripts. Now: friendly translated names, service titles
  // instead of IDs, consecutive repeats collapsed to ×n, bars as percentages
  // of the real maximum, and the raw token stream behind a collapsible
  // technical log for auditors.
  var FUNNEL_KEYS = { 'Intake started': 'fnl1', 'Issue described': 'fnl2', 'Route recommended': 'fnl3',
    'Evidence prepared': 'fnl4', 'Official action opened': 'fnl5', 'Confirmation recorded': 'fnl6',
    'Outcome verified': 'fnl7' };
  function friendlyEvent(e) {
    var k = 'evl_' + e.event;
    var label = (X.T[X.lang] && X.T[X.lang][k]) || X.T.en[k] || e.event.replace(/_/g, ' ');
    // Resident view: event name plus the service title, nothing else. All
    // other props (error codes, views, buckets) stay in the technical log.
    var sid = e.props && e.props.service_id;
    if (sid && C1.serviceCatalog[sid]) {
      var rr = C1.serviceCatalog[sid].title;
      label += ' — ' + (rr[X.lang] || rr.en);
    }
    return label;
  }
  function renderPrivacy() {
    var f = document.getElementById('funnel');
    var l = document.getElementById('evlog');
    if (!f || !l) return;
    var rows = A.funnel();
    var max = 1;
    rows.forEach(function (r) { if (r.count > max) max = r.count; });
    f.innerHTML = rows.map(function (r) {
      var pct = r.count ? Math.max(2, Math.round(100 * r.count / max)) : 0;
      var label = FUNNEL_KEYS[r.stage] ? t(FUNNEL_KEYS[r.stage]) : r.stage;
      return '<div class="r"><span class="lab">' + esc(label) + '</span>' +
        '<span class="track"><span class="bar" style="width:' + pct + '%;opacity:' + (r.count ? 1 : .18) + '"></span></span>' +
        '<span class="n">' + r.count + '</span></div>';
    }).join('');
    var evs = A.drain().slice().reverse();
    var merged = [];
    evs.forEach(function (e) {
      var sig = e.event + '|' + JSON.stringify(e.props);
      var last = merged[merged.length - 1];
      if (last && last.sig === sig) last.n += 1;
      else merged.push({ sig: sig, e: e, n: 1 });
    });
    l.innerHTML = merged.length
      ? merged.map(function (m) {
          return '<div class="row2"><span class="p">' + String(m.e.seq).padStart(2, '0') + '</span>' +
            '<span class="e">' + esc(friendlyEvent(m.e)) + '</span>' +
            (m.n > 1 ? '<span class="p">×' + m.n + '</span>' : '') + '</div>';
        }).join('')
      : '<div class="row2"><span class="p">' + esc(t('evNone')) + '</span></div>';
    var raw = document.getElementById('rawevlog');
    if (raw) raw.innerHTML = evs.length
      ? evs.map(function (e) {
          var props = Object.keys(e.props).map(function (k) { return k + '=' + e.props[k]; }).join(' · ');
          return '<div class="row2"><span class="p">' + String(e.seq).padStart(2, '0') + '</span>' +
            '<span class="e">' + esc(e.event) + '</span><span class="p">' + esc(props) + '</span></div>';
        }).join('')
      : '<div class="row2"><span class="p">' + esc(t('evNone')) + '</span></div>';
  }

  // Attach part-2 renderers onto the shared namespace so part-1 flows
  // (analyze, buildAndShow, applyLang, track) can reach them.
  X.renderReceipt = renderReceipt;
  X.renderTimeline = renderTimeline;
  X.renderDash = renderDash;
  X.renderKeepBar = renderKeepBar;
  X.renderPrivacy = renderPrivacy;
  X.persist = persist;

  // Wrap navigation so the dashboard always shows a fresh privacy log.
  var baseGo = X.go;
  X.go = window.go = function (v) { baseGo(v); if (v === 'dashboard') renderPrivacy(); };

  // Boot (runs here, after both parts are loaded).
  X.applyLang();
  renderPrivacy();
  renderKeepBar();
  renderDash();
  X.go('landing');
})();
