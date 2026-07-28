/* COMPTON ONE: FIX — wave 4: submission channels ("close the loop").
   Loads LAST, after app.ui.js. Self-contained module: no edits to bundle.js,
   app.js, app.langs.js or app.ui.js were needed — it wraps X.renderReceipt and
   window.emailDraft from the outside.

   What it does:
   1. SUBMISSION_CHANNELS: one VERIFIED official channel per service — an
      official online form, an official published email, or phone-only when no
      written channel could be verified (verified 2026-07-29; sources:
      comptoncity.org, republicservices.com/municipality/compton-ca,
      pticket.com/compton, sce.com). Unverified channels are NEVER invented.
   2. Injects a "Send your report" block into every action receipt: the form
      link, or a mailto with the verified address pre-filled, plus the honesty
      line — the app never sends anything itself.
   3. Overrides window.emailDraft so the draft carries the verified To address
      and the message currently shown in the Message Studio.
*/
(function () {
  var X = window.C1X;
  if (!X) return;
  var C1 = X.C1;

  // ---------- strings (en/es/tl/zh — local to this module) ----------
  var S = {
    en: {
      sendH: 'Send your report',
      sendFormBtn: 'Open the official form',
      sendFormHint: 'Opens the city\u2019s official form in a new tab. Copy your message first (Message Studio, above), then paste it in. The app never sends anything itself.',
      sendEmailBtn: 'Open email draft',
      sendEmailHint: 'Opens your own mail app addressed to {email} — the address the city publishes for this. You press send; the app never does.',
      sendPhoneNote: 'This route is phone-only — no official online form or published email could be verified. Call with the script above.',
      sendVerified: 'Channel verified {date}',
      sendAppNote: 'You can also report street maintenance in the official City of Compton app (see comptoncity.org/services/compton-app).',
      sendNever: 'You press send — always. Nothing is ever transmitted by this app.'
    },
    es: {
      sendH: 'Envíe su reporte',
      sendFormBtn: 'Abrir el formulario oficial',
      sendFormHint: 'Abre el formulario oficial de la ciudad en una pestaña nueva. Copie primero su mensaje (Estudio de mensajes, arriba) y luego péguelo. La aplicación nunca envía nada por sí misma.',
      sendEmailBtn: 'Abrir borrador de correo',
      sendEmailHint: 'Abre su propia aplicación de correo dirigida a {email} — la dirección que la ciudad publica para esto. Usted presiona enviar; la aplicación nunca lo hace.',
      sendPhoneNote: 'Esta ruta es solo por teléfono — no se pudo verificar un formulario en línea ni un correo oficial. Llame con el guion de arriba.',
      sendVerified: 'Canal verificado el {date}',
      sendAppNote: 'También puede reportar mantenimiento de calles en la aplicación oficial de la Ciudad de Compton (vea comptoncity.org/services/compton-app).',
      sendNever: 'Usted presiona enviar — siempre. Esta aplicación nunca transmite nada.'
    },
    tl: {
      sendH: 'Ipadala ang inyong report',
      sendFormBtn: 'Buksan ang opisyal na form',
      sendFormHint: 'Binubuksan ang opisyal na form ng lungsod sa bagong tab. Kopyahin muna ang inyong mensahe (Message Studio, sa itaas), pagkatapos i-paste ito. Ang app ay hindi kailanman nagpapadala nang mag-isa.',
      sendEmailBtn: 'Buksan ang email draft',
      sendEmailHint: 'Binubuksan ang inyong sariling mail app na nakadirekta sa {email} — ang address na inilalathala ng lungsod para dito. Kayo ang pipindot ng send; ang app ay hindi kailanman.',
      sendPhoneNote: 'Phone-only ang rutang ito — walang opisyal na online form o na-verify na email. Tumawag gamit ang script sa itaas.',
      sendVerified: 'Na-verify ang channel noong {date}',
      sendAppNote: 'Maaari rin kayong mag-report ng street maintenance sa opisyal na City of Compton app (tingnan ang comptoncity.org/services/compton-app).',
      sendNever: 'Kayo ang pipindot ng send — palagi. Walang ipinapadala ang app na ito kailanman.'
    },
    zh: {
      sendH: '发送您的报告',
      sendFormBtn: '打开官方表格',
      sendFormHint: '将在新标签页中打开市政府官方表格。请先复制您的信息（上方“信息工作室”），然后粘贴进去。本应用绝不会自行发送任何内容。',
      sendEmailBtn: '打开邮件草稿',
      sendEmailHint: '将打开您自己的邮件应用，收件人为 {email}——市政府公布的地址。由您点击发送；本应用绝不会代发。',
      sendPhoneNote: '此渠道仅限电话——未能核实到官方在线表格或公开邮箱。请使用上方话术拨打电话。',
      sendVerified: '渠道核实日期 {date}',
      sendAppNote: '您也可以通过康普顿市官方 App 报告街道维护问题（见 comptoncity.org/services/compton-app）。',
      sendNever: '始终由您点击发送——本应用从不传输任何内容。'
    }
  };
  function s(k) {
    var d = S[X.lang] || S.en;
    return d[k] || S.en[k] || k;
  }

  // ---------- the verified channel map (2026-07-29) ----------
  var VERIFIED = '2026-07-29';
  var CHANNELS = {
    illegal_dumping:  { type: 'form', url: 'https://www.comptoncity.org/i-want-to/report/illegal-dumping' },
    graffiti:         { type: 'form', url: 'https://www.comptoncity.org/i-want-to/report/graffiti' },
    code_violation:   { type: 'form', url: 'https://www.comptoncity.org/i-want-to/report/code-violations' },
    animal_control:   { type: 'form', url: 'https://www.comptoncity.org/i-want-to/report/animal-control' },
    streetlight:      { type: 'form', url: 'https://www.comptoncity.org/i-want-to/report/outage-street-light-compton' },
    power_outage:     { type: 'form', url: 'https://www.comptoncity.org/i-want-to/report/outage-power' },
    parking_citation: { type: 'form', url: 'https://www.pticket.com/compton/' },
    pothole:          { type: 'email', email: 'contactpw@comptoncity.org' },
    sidewalk:         { type: 'email', email: 'contactpw@comptoncity.org' },
    street_tree:      { type: 'email', email: 'contactpw@comptoncity.org' },
    traffic_sign_signal: { type: 'email', email: 'contactpw@comptoncity.org' },
    storm_drain:      { type: 'email', email: 'contactpw@comptoncity.org' },
    missed_trash:     { type: 'email', email: 'contacttrash@comptoncity.org' },
    bulky_item:       { type: 'email', email: 'contacttrash@comptoncity.org' },
    recycling_ewaste: { type: 'email', email: 'contacttrash@comptoncity.org' },
    water_or_sewer:   { type: 'email', email: 'cwdcd@comptoncity.org' },
    utility_billing:  { type: 'email', email: 'cwdcd@comptoncity.org' },
    housing_help:     { type: 'email', email: 'contactlh@comptoncity.org' },
    homeless_outreach:{ type: 'email', email: 'contactlh@comptoncity.org' },
    public_records:   { type: 'email', email: 'contactcc@comptoncity.org' },
    business_permit:  { type: 'email', email: 'contactbl@comptoncity.org' },
    // No official written channel could be verified for abandoned vehicles —
    // the receipt's verified phone path stands, and we say so honestly.
    abandoned_vehicle:{ type: 'phone' }
  };
  X.SUBMISSION_CHANNELS = CHANNELS;

  function esc(s2) { return X.esc(s2); }

  // ---------- the send block ----------
  function sendBlockHtml(r) {
    var ch = CHANNELS[r.serviceId];
    if (!ch) return '';
    var inner = '';
    if (ch.type === 'form') {
      inner =
        '<div class="row" style="margin-top:12px"><a class="btn btn-primary" href="' + esc(ch.url) +
        '" target="_blank" rel="noopener" onclick="trackSend()">' + esc(s('sendFormBtn')) + ' →</a></div>' +
        '<p style="font-size:14px;color:#F2EFE5CC;margin-top:12px">' + esc(s('sendFormHint')) + '</p>';
    } else if (ch.type === 'email') {
      inner =
        '<div class="row" style="margin-top:12px"><button class="btn btn-primary" onclick="emailDraft()">' + esc(s('sendEmailBtn')) + ' →</button></div>' +
        '<p style="font-size:14px;color:#F2EFE5CC;margin-top:12px">' + esc(s('sendEmailHint').replace('{email}', ch.email)) + '</p>';
    } else {
      inner = '<p style="font-size:14px;color:#F2EFE5CC;margin-top:12px">' + esc(s('sendPhoneNote')) + '</p>';
    }
    return '<div class="blk" id="send-block" style="background:var(--night);color:var(--paper);border-radius:14px;padding:18px;margin-top:4px">' +
      '<h3 style="color:var(--signal)">' + esc(s('sendH')) + '</h3>' +
      inner +
      '<p style="font-family:var(--mono);font-size:11px;color:var(--concrete);margin-top:12px;letter-spacing:.06em;text-transform:uppercase">' +
      esc(s('sendVerified').replace('{date}', VERIFIED)) + ' · ' + esc(s('sendNever')) + '</p>' +
      '<p style="font-size:13px;color:var(--concrete);margin-top:8px">' + esc(s('sendAppNote')) + '</p>' +
      '</div>';
  }

  // Track the hand-off with the existing, contract-legal analytics event.
  window.trackSend = function () {
    if (X.state.receipt) X.track('official_handoff_opened', { service_id: X.state.receipt.serviceId });
  };

  function injectSendBlock() {
    var old = document.getElementById('send-block');
    if (old) old.remove();
    var r = X.state.receipt;
    if (!r || r.kind !== 'action') return;
    var body = document.querySelector('#receipt .r-body');
    if (!body) return;
    body.insertAdjacentHTML('beforeend', sendBlockHtml(r));
  }

  // Wrap the receipt renderer — every render path (routing, language switch,
  // saved-case reopen) flows through X.renderReceipt.
  var _renderReceipt = X.renderReceipt;
  X.renderReceipt = function () {
    _renderReceipt();
    injectSendBlock();
  };

  // ---------- email draft with the verified To address ----------
  window.emailDraft = function () {
    var r = X.state.receipt;
    if (!r || r.kind !== 'action') return;
    var ch = CHANNELS[r.serviceId] || {};
    // The Message Studio box holds the current, translated message — send
    // exactly what the resident sees.
    var box = document.getElementById('msgbox');
    var body = box ? box.textContent : '';
    var href = 'mailto:' + (ch.email || '') +
      '?subject=' + encodeURIComponent('Compton One — ' + r.caseId) +
      '&body=' + encodeURIComponent(body);
    window.__lastMailto = href; // test hook (verify.py): the exact draft URL
    window.location.href = href;
    window.trackSend();
  };
})();
