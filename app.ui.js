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
    var en = X.lang === 'en';
    var conf = state.confirmation || (en ? '[request number]' : '[número de solicitud]');
    if (en) {
      if (kind === 'report') return 'Hello — I would like to report: ' + r.title + ', near [nearest cross streets or approximate address]. It has been like this since [date you first saw it]. Can you give me a service request number for this report? (Case ' + r.caseId + ')';
      if (kind === 'follow') return 'Hello — I am following up on ' + r.title + ', reported on [date]. My service request number is ' + conf + '. What is the current status, and when can I expect action? (Case ' + r.caseId + ')';
      return 'Hello — I reported ' + r.title + ' on [date], request number ' + conf + '. My follow-up date ' + r.followUpDate + ' has passed with no update. Can this be escalated, and who is supervising the case? (Case ' + r.caseId + ')';
    }
    if (kind === 'report') return 'Buenos días — quisiera reportar: ' + r.title + ', cerca de [calles transversales o dirección aproximada]. Está así desde [fecha en que lo vio por primera vez]. ¿Me puede dar un número de solicitud para este reporte? (Caso ' + r.caseId + ')';
    if (kind === 'follow') return 'Buenos días — doy seguimiento a ' + r.title + ', reportado el [fecha]. Mi número de solicitud es ' + conf + '. ¿Cuál es el estado actual y cuándo puedo esperar acción? (Caso ' + r.caseId + ')';
    return 'Buenos días — reporté ' + r.title + ' el [fecha], número de solicitud ' + conf + '. Mi fecha de seguimiento ' + r.followUpDate + ' ya pasó sin novedad. ¿Se puede escalar el caso y quién lo supervisa? (Caso ' + r.caseId + ')';
  }

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
    track('message_copied', { service_id: sid(), kind: state.msgKind || 'report' });
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
        '<div style="font-family:var(--mono);font-size:11px;color:var(--ink-60)">LAST VERIFIED ' + esc(m.lastVerifiedAt) + '</div></div>';
    }).join('');

    document.getElementById('receipt').innerHTML =
      '<div class="r-head"><div class="r-meta">' +
        '<span>' + t('mCase') + ' <b>' + esc(r.caseId) + '</b></span>' +
        '<span>' + t('mStatus') + ' <b>' + esc(r.status) + '</b></span>' +
        '<span>' + t('conf').toUpperCase() + ' <b>' + Math.round(r.confidence * 100) + '%</b></span>' +
        '<span>' + esc(r.jurisdiction.toUpperCase()) + '</span></div>' +
        '<h2>' + esc(r.title) + '</h2></div>' +
      '<div class="r-body">' +
        '<div class="blk"><h3>' + t('yousaid') + '</h3><p class="kv" style="font-style:italic">“' + esc(r.residentSummary) + '”</p></div>' +
        '<div class="blk"><h3>' + t('owner') + '</h3><p class="kv"><b>' + esc(r.owner) + '</b></p></div>' +
        '<div class="blk" id="blk-action"><h3>' + t('action') + '</h3>' + methods +
          '<div class="notice n-demo" style="margin-top:4px"><span class="ic" aria-hidden="true">▲</span><span>' + esc(r.disclosure) + '</span></div></div>' +
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
        '<div class="blk"><h3>' + t('script') + '</h3><p class="script">' + esc(r.script) + '</p></div>' +
        // M-01: ready-to-send message, three moments of the case lifecycle.
        '<div class="blk noprint"><h3>' + t('msgH') + '</h3><p class="hint" style="margin:0">' + t('msgHint') + '</p>' +
          '<div class="msgtabs" role="group" aria-label="' + esc(t('msgH')) + '">' +
            '<button class="msgtab" id="msgtab-report" aria-pressed="true" onclick="msgShow(\'report\')">' + esc(t('msgReport')) + '</button>' +
            '<button class="msgtab" id="msgtab-follow" aria-pressed="false" onclick="msgShow(\'follow\')">' + esc(t('msgFollow')) + '</button>' +
            '<button class="msgtab" id="msgtab-escalate" aria-pressed="false" onclick="msgShow(\'escalate\')">' + esc(t('msgEscalate')) + '</button>' +
          '</div>' +
          '<div class="msgbox" id="msgbox"></div>' +
          '<div class="row" style="margin-top:10px"><button class="btn btn-quiet" onclick="copyMsg()">' + esc(t('msgCopy')) + '</button></div>' +
          '<p class="hint" id="msg-note" aria-live="polite" style="margin-top:8px"></p></div>' +
        '<div class="blk"><h3>' + t('save') + '</h3><p class="kv">' + esc(r.expectedConfirmation || '—') + '</p></div>' +
        '<div class="blk"><h3>' + t('follow') + '</h3><p class="kv"><b>' + esc(r.followUpDate) + '</b> — ' + esc(r.followUpCheckpoint) + '</p>' +
          '<p style="font-size:13px;color:var(--ink-60)">' + t('noSla') + '</p></div>' +
        // P-02: ordered path from checklist → official step → confirmation → follow-up.
        '<div class="blk noprint"><h3>' + t('nextH') + '</h3><ol class="nextsteps">' +
          [t('nextS1'), t('nextS2'), t('nextS3'), t('nextS4')].map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
          '</ol></div>' +
        '<div class="blk"><h3>' + t('sources') + '</h3><div class="srcs">' +
          r.sources.map(function (s) { return '<div>• <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a> — verified ' + esc(s.lastVerifiedAt) + '</div>'; }).join('') +
          '<div style="margin-top:4px">Maintainer: ' + esc(r.maintainer) + ' · Next review ' + esc(r.nextReviewAt) + '</div></div></div>' +
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
    var en = X.lang === 'en';
    // AUDIT A-03: the deleted-state message was unreachable, because the
    // null-receipt guard ran first and blanked the timeline silently.
    if (state.deleted) {
      el.innerHTML = '<li><div class="d"></div><div class="dot"><i></i></div><div><div class="st">' +
        (en ? 'Case deleted' : 'Caso eliminado') + '</div><div class="nt">' +
        (en ? 'All details for this case were removed from this device.' : 'Todos los detalles de este caso se eliminaron de este dispositivo.') +
        '</div></div></li>';
      return;
    }
    if (!r || r.kind !== 'action') { el.innerHTML = ''; return; }
    var day = en ? ['Today', 'Today', 'Today', 'By ' + r.followUpDate, r.followUpDate]
                 : ['Hoy', 'Hoy', 'Hoy', 'Para ' + r.followUpDate, r.followUpDate];
    var rows = [
      ['HEARD', day[0], en ? 'You described the issue in your own words.' : 'Usted describió el problema en sus propias palabras.', true],
      ['CLASSIFIED', day[1], (en ? 'Matched to ' : 'Asociado con ') + r.title + ' (' + Math.round(r.confidence * 100) + '%).', true],
      ['READY', day[2], en ? 'Evidence list and official contact prepared.' : 'Lista de evidencia y contacto oficial preparados.', true],
      ['SUBMITTED', day[3], state.confirmation
        ? (en ? 'Confirmation saved: ' : 'Confirmación guardada: ') + state.confirmation
        : (en ? 'Waiting for you to contact the city and save your confirmation.' : 'Esperando que contacte a la ciudad y guarde su confirmación.'), !!state.confirmation],
      ['FOLLOW-UP DUE', day[4], en ? 'Check back if you have not heard anything.' : 'Verifique si no ha recibido respuesta.', state.resolved],
      ['RESOLVED', state.resolved ? day[4] : '—', state.resolved
        ? (en ? 'You marked this resolved.' : 'Usted marcó esto como resuelto.')
        : (en ? 'Not yet.' : 'Todavía no.'), state.resolved]
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
    var v = document.getElementById('conf').value.trim();
    if (!v) {
      track('error_shown', { error_code: 'empty_confirmation', view: 'timeline' });
      document.getElementById('conf').focus();
      return;
    }
    state.confirmation = C1.sanitizeResidentText(v, 60);
    track('confirmation_saved', { service_id: sid() });
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
  function badge(s) {
    var m = { 'RESOLVED': 'b-res', 'FOLLOW-UP DUE': 'b-due', 'SUBMITTED': 'b-sub', 'READY': 'b-ready' };
    return '<span class="badge ' + (m[s] || '') + '">' + esc(s) + '</span>';
  }
  function renderDash() {
    var savedEl = document.getElementById('saved');
    if (savedEl) {
      var saved = store.list();
      savedEl.innerHTML = saved.length
        ? saved.map(function (c) {
            var title = C1.serviceCatalog[c.serviceId] ? C1.serviceCatalog[c.serviceId].title[X.lang] : c.serviceId;
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
    var en = X.lang === 'en';
    var stats = [[String(list.length), en ? 'Cases' : 'Casos'],
                 [String(resolved), en ? 'Verified resolved' : 'Resueltos verificados'],
                 [String(due), en ? 'Follow-up due' : 'Seguimiento pendiente'],
                 [Math.round(100 * resolved / Math.max(1, list.length)) + '%', en ? 'Outcome rate' : 'Tasa de resultado']];
    var se = document.getElementById('stats');
    if (se) se.innerHTML = stats.map(function (s) { return '<div class="stat"><div class="v">' + esc(s[0]) + '</div><div class="l">' + esc(s[1]) + '</div></div>'; }).join('');
    var ce = document.getElementById('cases');
    if (ce) ce.innerHTML = list.map(function (c) {
      return '<div class="caseitem"><span class="id">' + esc(c.id) + '</span><span class="ti">' +
        esc(C1.serviceCatalog[c.sid].title[X.lang]) + (c.mine ? ' ★' : '') + '</span>' + badge(c.st) + '</div>';
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
    var next = new Date(r.followUpDate + 'T12:00:00');
    next.setDate(next.getDate() + 1);
    var d2 = next.toISOString().slice(0, 10).replace(/-/g, '');
    var title = (X.lang === 'en' ? 'Follow up: ' : 'Seguimiento: ') + r.title + ' (' + r.caseId + ')';
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
    track('follow_up_scheduled', { service_id: r.serviceId, days_ahead: 0, method: 'gcal' });
  };

  window.downloadIcs = function () {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return;
    var m = r.intakeMethods && r.intakeMethods[0];
    var ics = C1.buildReminderIcs({
      caseId: r.caseId, title: r.title, owner: r.owner, followUpDate: r.followUpDate,
      contact: m ? m.destination : '(310) 605-5500', confirmation: state.confirmation, lang: X.lang
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
    track('follow_up_scheduled', { service_id: r.serviceId, days_ahead: 0, method: 'ics' });
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

  function renderPrivacy() {
    var f = document.getElementById('funnel');
    var l = document.getElementById('evlog');
    if (!f || !l) return;
    var rows = A.funnel();
    var max = Math.max(1, rows[0].count, 1);
    f.innerHTML = rows.map(function (r) {
      var w = Math.round(8 + 120 * (r.count / max));
      return '<div class="r"><span class="lab">' + esc(r.stage) + '</span>' +
        '<span class="bar" style="width:' + (r.count ? w : 3) + 'px;opacity:' + (r.count ? 1 : .18) + '"></span>' +
        '<span class="n">' + r.count + '</span></div>';
    }).join('');
    var evs = A.drain();
    l.innerHTML = evs.length
      ? evs.slice().reverse().map(function (e) {
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
