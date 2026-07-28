/* COMPTON ONE: FIX — demo controller.
   All routing/classification comes from the bundled, tested TypeScript (window.C1). */
(function () {
  var C1 = window.C1;
  var lang = 'en';
  var state = { text: '', cls: null, receipt: null, confirmation: null, resolved: false, deleted: false, evidenceTicks: [], contacted: false };
  // AUDIT A-01: every case used to be issued the same hard-coded id, so a
  // resident with two cases saw C1-1042 twice. Seeded per case, still
  // deterministic within a session so the demo and tests stay stable.
  var caseSeed = 1042;

  var T = {
    en: {
      eyebrow: 'City service navigation · Compton, California',
      h1a: 'One problem.', h1b: 'One path forward.',
      lede: 'Describe a city service issue in your own words. COMPTON ONE: FIX helps you prepare the right information, find the official next step, and keep track of what happens.',
      cta: 'Start a report', ctademo: 'Run the demo scenario',
      trust: 'Built for clear next steps. Your report stays under your control.',
      supported: 'What we can route today',
      howlabel: 'How it works',
      privacy: 'We ask for approximate block, not your exact address. No government ID. No public reporter name. You can delete a case at any time.',
      disclosure: 'Hackathon prototype: this app prepares and tracks your action. It does not submit directly to the City of Compton.',
      step1: 'Step 1 of 5 — Tell us what happened',
      step2: 'Step 2 of 5 — One quick question',
      step3: 'Step 3 of 5 — Your Civic Action Receipt',
      step4: 'Step 4 of 5 — Do not lose the thread',
      step5: 'Step 5 of 5 — Your cases',
      intakeH: 'You do not need to know the department.',
      what: 'What happened?',
      whatHint: 'Describe the problem the way you would explain it to a neighbor. Plain words work best.',
      examples: 'Or start from an example:',
      intakePriv: 'Do not include names, license plates, or accusations about a specific person. Describe what you saw.',
      analyze: 'Find the right path', voice: '🎤 Speak instead of typing', back: '← Back',
      voiceNote: 'Voice uses your browser\'s own speech recognition. On some browsers, including Chrome, that means the audio is sent to the browser maker to be turned into text — we never receive it and we never store it. Typing works exactly the same and sends nothing anywhere.',
      voiceListening: '🎙 Listening… speak now, then pause.',
      voiceHeard: '✓ Got it. Check the words below and fix anything that came out wrong.',
      voiceDenied: 'Your browser blocked the microphone. You can allow it in the address bar, or just type — typing works exactly the same.',
      voiceNoSpeech: 'We did not catch anything. Try again, or type it instead.',
      voiceFailed: 'Voice did not work on this device. Please type it instead.',
      voiceNetFail: 'This browser\'s speech service could not be reached — some browsers, including Brave, block it by default. Typing works exactly the same and sends nothing anywhere.',
      voiceNoMic: 'No microphone was found on this device. Typing works exactly the same.',
      voiceUnsupported: 'This browser has no voice typing — Brave and some other browsers block or skip it entirely. Typing works exactly the same and sends nothing anywhere.',
      printFallback: 'Your browser blocked printing. Use your browser menu → Print, or take a screenshot of this receipt.',
      clarifyH: 'One quick question',
      yes: 'Yes, that is right', notsure: 'No, or I am not sure',
      chooseH: 'This could be two different services',
      chooseHint: 'We are not confident enough to choose for you. Pick the one that matches what you saw.',
      unsupH: 'This is outside what we handle today',
      unsupBody: 'COMPTON ONE: FIX currently supports five service types. We will not guess a department for you, because a wrong guess wastes your time. For anything else, call the City of Compton main line at (310) 605-5500.',
      saved: 'Next: track this case', print: 'Print or save PDF', edit: 'Change my answer',
      tlH: 'Case timeline',
      confLabel: 'Confirmation number you received',
      confHint: 'Enter whatever the city gave you: a service request number, a reference code, or the date and name of the person you spoke with.',
      saveConf: 'Save confirmation', resolve: 'Mark resolved', del: 'Delete this case',
      simNote: 'Simulated in this prototype: SMS reminders and any city acknowledgment. Everything else on this page is real behaviour.',
      toDash: 'Go to my cases →',
      dashH: 'Your cases', demoData: 'Demo data. These cases illustrate the outcome loop and are not real city records.',
      yourCases: 'Active and recent', newReport: 'Start another report',
      footer: 'COMPTON ONE: FIX is an independent prototype. It is not operated by the City of Compton and does not submit reports on your behalf.',
      owner: 'Who handles this', evidence: 'Prepare these details', prohibited: 'Do not include',
      action: 'Take the official next step', script: 'What to say', save: 'Save what you receive',
      follow: 'Follow up', sources: 'Where this came from', yousaid: 'What you told us',
      conf: 'Match confidence', notsub: 'This prototype does not submit to the city for you.',
      verified: 'Officially verified', needsconf: 'Needs confirmation',
      useWhen: 'Use when', reaches: 'Reaches',
      noSla: 'The city has not published a response time for this service, so this is a reminder for you — not a promise from the city.',
      stopFirst: 'Stop and call 9-1-1 first if you see any of these:',
      empty: 'Please describe what happened first.',
      reopen: 'Reopen this case', evDone: 'Evidence gathered',
      keepH: 'Keep this case on this phone?',
      keepBody: 'Right now this case disappears if you close the page. We can save it on this device so you can come back to it. Saved: what you typed, the matched service, your confirmation number, and your follow-up date. Nothing is sent anywhere and nothing identifies you. You can erase it all with one button.',
      keepYes: 'Save on this device', keepNo: 'No, keep it temporary',
      keepOn: 'Saved on this device only', keepOff: 'Not saved — this case ends when you close the page',
      keepFail: 'This device would not let us save. The case still works, but it will not survive closing the page.',
      erase: 'Erase everything saved', erased: 'Everything saved on this device was erased.',
      savedCases: 'Saved on this device', noSaved: 'Nothing saved on this device yet.',
      openCase: 'Open', cal: 'Add follow-up to calendar',
      calDone: '✓ Reminder downloaded. Open the file to add the follow-up to your calendar.',
      nextH: 'What happens next',
      nextS1: 'Gather the details above and check them off as you go.',
      nextS2: 'Take the official step — call or open the form. The script below is what to say.',
      nextS3: 'Ask for a service request or confirmation number, then continue to tracking.',
      nextS4: 'Come back on the follow-up date and record what happened.',
      evReady: 'All details prepared. You are ready to contact the city.',
      evReadyBtn: 'Go to the official step ↓',
      evDoneBtn: 'I have contacted the city — save my confirmation →',
      afterContactText: 'Contacted the city? Save the confirmation number they gave you so the follow-up has teeth.',
      afterContactBtn: 'Save my confirmation →',
      privLabel: 'What this app recorded about you',
      privNote: 'Every event this session produced is listed below, in full. No description you typed, no address, and no confirmation number can enter this log — the analytics layer only accepts short fixed tokens, and rejects anything else. Nothing is sent anywhere; this stays on your device.',
      evLabel: 'Session event log',
      evNone: 'No events recorded yet.',
    },
    es: {
      eyebrow: 'Navegación de servicios municipales · Compton, California',
      h1a: 'Un problema.', h1b: 'Un camino claro.',
      lede: 'Describa un problema de servicio municipal en sus propias palabras. COMPTON ONE: FIX le ayuda a preparar la información correcta, encontrar el siguiente paso oficial y dar seguimiento a lo que pasa.',
      cta: 'Iniciar un reporte', ctademo: 'Ver el escenario de demostración',
      trust: 'Hecho para dar pasos claros. Su reporte permanece bajo su control.',
      supported: 'Lo que podemos encaminar hoy',
      howlabel: 'Cómo funciona',
      privacy: 'Pedimos la cuadra aproximada, no su dirección exacta. Sin identificación oficial. Sin nombre público del reportante. Puede eliminar un caso en cualquier momento.',
      disclosure: 'Prototipo de hackathon: esta aplicación prepara y da seguimiento a su acción. No envía nada directamente a la Ciudad de Compton.',
      step1: 'Paso 1 de 5 — Cuéntenos qué pasó',
      step2: 'Paso 2 de 5 — Una pregunta rápida',
      step3: 'Paso 3 de 5 — Su Recibo de Acción Cívica',
      step4: 'Paso 4 de 5 — No pierda el hilo',
      step5: 'Paso 5 de 5 — Sus casos',
      intakeH: 'No necesita saber el departamento.',
      what: '¿Qué pasó?',
      whatHint: 'Describa el problema como se lo explicaría a un vecino. Las palabras sencillas funcionan mejor.',
      examples: 'O empiece con un ejemplo:',
      intakePriv: 'No incluya nombres, placas de vehículos ni acusaciones contra una persona específica. Describa lo que vio.',
      analyze: 'Encontrar el camino correcto', voice: '🎤 Hablar en vez de escribir', back: '← Atrás',
      voiceNote: 'La voz usa el reconocimiento de voz de su propio navegador. En algunos navegadores, incluido Chrome, eso significa que el audio se envía al fabricante del navegador para convertirlo en texto — nosotros nunca lo recibimos ni lo guardamos. Escribir funciona igual y no envía nada a ningún lado.',
      voiceListening: '🎙 Escuchando… hable ahora y luego haga una pausa.',
      voiceHeard: '✓ Listo. Revise las palabras de abajo y corrija lo que salió mal.',
      voiceDenied: 'Su navegador bloqueó el micrófono. Puede permitirlo en la barra de direcciones, o simplemente escriba — funciona igual.',
      voiceNoSpeech: 'No captamos nada. Intente otra vez o escríbalo.',
      voiceFailed: 'La voz no funcionó en este dispositivo. Por favor escríbalo.',
      voiceNetFail: 'No se pudo conectar con el servicio de voz de este navegador — algunos navegadores, incluido Brave, lo bloquean por defecto. Escribir funciona igual y no envía nada a ningún lado.',
      voiceNoMic: 'No se encontró un micrófono en este dispositivo. Escribir funciona igual.',
      voiceUnsupported: 'Este navegador no tiene escritura por voz — Brave y algunos otros la bloquean o no la incluyen. Escribir funciona igual y no envía nada a ningún lado.',
      printFallback: 'Su navegador bloqueó la impresión. Use el menú del navegador → Imprimir, o tome una captura de pantalla de este recibo.',
      clarifyH: 'Una pregunta rápida',
      yes: 'Sí, así es', notsure: 'No, o no estoy seguro',
      chooseH: 'Esto podría ser dos servicios distintos',
      chooseHint: 'No tenemos suficiente certeza para elegir por usted. Escoja el que coincide con lo que vio.',
      unsupH: 'Esto está fuera de lo que atendemos hoy',
      unsupBody: 'COMPTON ONE: FIX admite cinco tipos de servicio por ahora. No adivinaremos un departamento, porque una suposición equivocada le hace perder tiempo. Para todo lo demás, llame a la línea principal de la Ciudad de Compton al (310) 605-5500.',
      saved: 'Siguiente: seguir el caso', print: 'Imprimir o guardar PDF', edit: 'Cambiar mi respuesta',
      tlH: 'Cronología del caso',
      confLabel: 'Número de confirmación que recibió',
      confHint: 'Escriba lo que le dio la ciudad: un número de solicitud, un código de referencia, o la fecha y el nombre de la persona con quien habló.',
      saveConf: 'Guardar confirmación', resolve: 'Marcar como resuelto', del: 'Eliminar este caso',
      simNote: 'Simulado en este prototipo: recordatorios por SMS y cualquier acuse de recibo de la ciudad. Todo lo demás en esta página es comportamiento real.',
      toDash: 'Ir a mis casos →',
      dashH: 'Sus casos', demoData: 'Datos de demostración. Estos casos ilustran el ciclo de resultados y no son registros reales de la ciudad.',
      yourCases: 'Activos y recientes', newReport: 'Iniciar otro reporte',
      footer: 'COMPTON ONE: FIX es un prototipo independiente. No es operado por la Ciudad de Compton y no envía reportes en su nombre.',
      owner: 'Quién se encarga', evidence: 'Prepare estos datos', prohibited: 'No incluya',
      action: 'Dé el siguiente paso oficial', script: 'Qué decir', save: 'Guarde lo que reciba',
      follow: 'Seguimiento', sources: 'De dónde viene esto', yousaid: 'Lo que nos dijo',
      conf: 'Confianza de coincidencia', notsub: 'Este prototipo no envía nada a la ciudad por usted.',
      verified: 'Verificado oficialmente', needsconf: 'Requiere confirmación',
      useWhen: 'Úselo cuando', reaches: 'Llega a',
      noSla: 'La ciudad no ha publicado un tiempo de respuesta para este servicio, así que esto es un recordatorio para usted — no una promesa de la ciudad.',
      stopFirst: 'Deténgase y llame al 9-1-1 primero si ve algo de esto:',
      empty: 'Por favor describa primero qué pasó.',
      reopen: 'Reabrir este caso', evDone: 'Evidencia reunida',
      keepH: '¿Guardar este caso en este teléfono?',
      keepBody: 'Por ahora este caso desaparece si cierra la página. Podemos guardarlo en este dispositivo para que pueda regresar. Se guarda: lo que escribió, el servicio identificado, su número de confirmación y su fecha de seguimiento. No se envía nada a ningún lado y nada lo identifica a usted. Puede borrarlo todo con un botón.',
      keepYes: 'Guardar en este dispositivo', keepNo: 'No, solo por ahora',
      keepOn: 'Guardado solo en este dispositivo', keepOff: 'Sin guardar — este caso termina al cerrar la página',
      keepFail: 'Este dispositivo no permitió guardar. El caso funciona, pero no seguirá al cerrar la página.',
      erase: 'Borrar todo lo guardado', erased: 'Se borró todo lo guardado en este dispositivo.',
      savedCases: 'Guardados en este dispositivo', noSaved: 'Todavía no hay nada guardado en este dispositivo.',
      openCase: 'Abrir', cal: 'Agregar seguimiento al calendario',
      calDone: '✓ Recordatorio descargado. Abra el archivo para agregarlo a su calendario.',
      nextH: 'Qué sigue',
      nextS1: 'Reúna los datos de arriba y márquelos a medida que avanza.',
      nextS2: 'Dé el paso oficial — llame o abra el formulario. El guion de abajo es lo que debe decir.',
      nextS3: 'Pida un número de solicitud o confirmación, y luego continúe al seguimiento.',
      nextS4: 'Regrese en la fecha de seguimiento y anote qué pasó.',
      evReady: 'Todos los datos listos. Ya puede contactar a la ciudad.',
      evReadyBtn: 'Ir al paso oficial ↓',
      evDoneBtn: 'Ya contacté a la ciudad — guardar mi confirmación →',
      afterContactText: '¿Ya contactó a la ciudad? Guarde el número de confirmación que le dieron para que el seguimiento tenga fuerza.',
      afterContactBtn: 'Guardar mi confirmación →',
      privLabel: 'Lo que esta aplicación registró sobre usted',
      privNote: 'Aquí está, completa, cada acción registrada en esta sesión. Ninguna descripción que usted escribió, ninguna dirección y ningún número de confirmación puede entrar en este registro — la capa de analítica solo acepta etiquetas cortas y fijas, y rechaza todo lo demás. Nada se envía a ningún lado; esto se queda en su dispositivo.',
      evLabel: 'Registro de eventos de la sesión',
      evNone: 'Aún no hay eventos registrados.',
    }
  };
  var A = C1.analytics;
  var store = C1.createCaseStore();
  function track(ev, props) { props = props || {}; props.lang = lang; A.track(ev, props); renderPrivacy(); }
  function sid() { return state.cls && state.cls.serviceId ? state.cls.serviceId : (state.receipt && state.receipt.serviceId) || 'none'; }
  function t(k) { return T[lang][k] || k; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  var VIEWS = ['landing', 'intake', 'clarify', 'choose', 'unsupported', 'emergency', 'receipt', 'timeline', 'dashboard'];
  var STEPMAP = { intake: 0, clarify: 1, choose: 1, receipt: 2, timeline: 3, dashboard: 4 };
  var current = 'landing';

  function go(v) {
    current = v;
    VIEWS.forEach(function (x) { document.getElementById('v-' + x).classList.toggle('hidden', x !== v); });
    renderSteps();
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    var h = document.querySelector('#v-' + v + ' h1, #v-' + v + ' h2');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  }
  window.go = go;

  function renderSteps() {
    var el = document.getElementById('steps');
    if (!(current in STEPMAP)) { el.innerHTML = ''; return; }
    var names = lang === 'en'
      ? ['Describe', 'Classify', 'Receipt', 'Follow up', 'Resolve']
      : ['Describir', 'Clasificar', 'Recibo', 'Seguimiento', 'Resolver'];
    var i = STEPMAP[current];
    el.innerHTML = names.map(function (n, k) {
      return '<span class="step ' + (k < i ? 'done' : k === i ? 'on' : '') + '">' + esc(n) + '</span>';
    }).join('');
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(function (n) { n.textContent = t(n.getAttribute('data-t')); });
    document.getElementById('lang-en').setAttribute('aria-pressed', String(lang === 'en'));
    document.getElementById('lang-es').setAttribute('aria-pressed', String(lang === 'es'));
    document.getElementById('conf-hint').textContent = t('confHint');
    renderTiles(); renderHow(); renderChips(); renderSteps(); renderDash();
    if (state.receipt) renderReceipt();
    if (state.cls && state.cls.kind === 'clarify') renderClarify();
    if (state.cls && state.cls.kind === 'ambiguous') renderChoose();
    if (state.cls && state.cls.kind === 'emergency') renderEmergency();
    renderTimeline();
  }
  window.setLang = function (l) { var from = lang; lang = l; applyLang(); track('language_selected', { from: from }); };

  // 22 routes is too many for a flat grid, so they are grouped the way a
  // resident thinks about them, not the way the city is organised.
  var TILE_GROUPS = [
    { en: 'Streets and lighting', es: 'Calles y alumbrado',
      ids: ['pothole', 'sidewalk', 'streetlight', 'traffic_sign_signal', 'street_tree', 'storm_drain'] },
    { en: 'Trash and the block', es: 'Basura y la cuadra',
      ids: ['missed_trash', 'bulky_item', 'illegal_dumping', 'recycling_ewaste', 'graffiti', 'abandoned_vehicle'] },
    { en: 'Home, water and property', es: 'Casa, agua y propiedad',
      ids: ['water_or_sewer', 'utility_billing', 'power_outage', 'code_violation', 'housing_help', 'business_permit'] },
    { en: 'People and city hall', es: 'Personas y el ayuntamiento',
      ids: ['animal_control', 'homeless_outreach', 'parking_citation', 'public_records'] },
  ];

  function tileHtml(id) {
    var r = C1.serviceCatalog[id];
    if (!r) return '';
    return '<button class="tile" onclick="pick(\'' + id + '\')"><span class="t">' + esc(r.title[lang]) +
      '</span><span class="s">' + esc(r.triggerExamples[lang][0]) + '</span></button>';
  }

  function renderTiles() {
    var grouped = TILE_GROUPS.map(function (g) {
      return '<p class="tile-group">' + esc(g[lang]) + '</p><div class="grid5">' +
        g.ids.map(tileHtml).join('') + '</div>';
    }).join('');
    var covered = TILE_GROUPS.reduce(function (n, g) { return n + g.ids.length; }, 0);
    // Anything added to the catalog but not to a group still has to appear.
    var orphans = C1.SERVICE_IDS.filter(function (id) {
      return !TILE_GROUPS.some(function (g) { return g.ids.indexOf(id) !== -1; });
    });
    if (orphans.length) grouped += '<div class="grid5">' + orphans.map(tileHtml).join('') + '</div>';
    var el = document.getElementById('tiles');
    if (el) el.innerHTML = grouped;
    var un = document.getElementById('unsup-tiles');
    if (un) un.innerHTML = '<div class="grid5">' + C1.SERVICE_IDS.map(tileHtml).join('') + '</div>';
    var count = document.getElementById('service-count');
    if (count) count.textContent = String(C1.SERVICE_IDS.length);
  }

  function renderHow() {
    var steps = lang === 'en'
      ? [['Describe', 'Say what happened in your own words. No department names needed.'],
         ['Route', 'We match it to one of five verified city services and show you the source.'],
         ['Act', 'You get the evidence list, the official contact, and what to say.'],
         ['Track', 'Save your confirmation number and get a follow-up date.']]
      : [['Describir', 'Diga qué pasó en sus propias palabras. No necesita nombres de departamentos.'],
         ['Dirigir', 'Lo asociamos con uno de cinco servicios verificados y le mostramos la fuente.'],
         ['Actuar', 'Recibe la lista de evidencia, el contacto oficial y qué decir.'],
         ['Seguir', 'Guarde su número de confirmación y reciba una fecha de seguimiento.']];
    document.getElementById('how').innerHTML = steps.map(function (s, i) {
      return '<div><p class="n">0' + (i + 1) + '</p><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
    }).join('');
  }

  function renderChips() {
    var ex = [
      C1.serviceCatalog.missed_trash.triggerExamples[lang][0],
      C1.serviceCatalog.streetlight.triggerExamples[lang][0],
      C1.serviceCatalog.illegal_dumping.triggerExamples[lang][0],
      C1.serviceCatalog.pothole.triggerExamples[lang][0]
    ];
    document.getElementById('chips').innerHTML = ex.map(function (e) {
      return '<button class="chip" onclick="useExample(this)">' + esc(e) + '</button>';
    }).join('');
  }
  window.useExample = function (b) { document.getElementById('issue').value = b.textContent; };

  window.pick = function (id) {
    track('route_manually_selected', { service_id: id, origin: current === 'landing' ? 'tile' : 'ambiguous_choice' });
    var r = C1.serviceCatalog[id];
    state.text = document.getElementById('issue') && document.getElementById('issue').value
      ? document.getElementById('issue').value : r.triggerExamples[lang][0];
    state.cls = { kind: 'routed', serviceId: id, confidence: 1, alternates: [] };
    buildAndShow();
  };

  var recog = null, recognising = false;
  function speechSupported() {
    return typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  window.voiceInput = function () {
    var el = document.getElementById('issue');
    var status = document.getElementById('voice-status');
    var Ctor = speechSupported();
    if (!Ctor) {
      // CONTROLLER PATCH V-01: no speech engine on this device/browser (Brave
      // blocks the API entirely). Say so honestly and stop — the old build
      // silently auto-filled a scripted example, which read as "the voice
      // typed the wrong thing" and eroded trust in the intake box.
      if (status) status.textContent = t('voiceUnsupported');
      return;
    }
    if (recognising && recog) { try { recog.stop(); } catch (e) {} return; }
    try {
      recog = new Ctor();
    } catch (e) {
      if (status) status.textContent = t('voiceUnsupported');
      return;
    }
    recog.lang = lang === 'es' ? 'es-MX' : 'en-US';
    recog.interimResults = true;
    recog.continuous = false;
    recog.maxAlternatives = 1;
    var base = el.value ? el.value.trim() + ' ' : '';
    recognising = true;
    document.getElementById('btn-voice').setAttribute('aria-pressed', 'true');
    if (status) status.textContent = t('voiceListening');

    recog.onresult = function (ev) {
      var text = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) text += ev.results[i][0].transcript;
      el.value = base + text;
      if (status) status.textContent = t('voiceHeard');
    };
    recog.onerror = function (ev) {
      recognising = false;
      document.getElementById('btn-voice').setAttribute('aria-pressed', 'false');
      var code = ev && ev.error ? String(ev.error) : 'unknown';
      // CONTROLLER PATCH V-02: name the actual failure. 'network' is the
      // common desktop failure — the browser's speech service is unreachable
      // or blocked (Brave, some Linux Chromium builds) — and it used to fall
      // into the same generic "did not work" bucket as a denied microphone.
      if (status) {
        status.textContent =
          code === 'not-allowed' || code === 'service-not-allowed' ? t('voiceDenied')
          : code === 'no-speech' ? t('voiceNoSpeech')
          : code === 'network' ? t('voiceNetFail')
          : code === 'audio-capture' ? t('voiceNoMic')
          : t('voiceFailed');
      }
      track('error_shown', { error_code: 'voice_' + code.replace(/[^a-z-]/g, ''), view: 'intake' });
    };
    recog.onend = function () {
      recognising = false;
      var b = document.getElementById('btn-voice');
      if (b) b.setAttribute('aria-pressed', 'false');
      if (status && status.textContent === t('voiceListening')) status.textContent = t('voiceNoSpeech');
      el.focus();
    };
    state.inputMode = 'voice';
    try { recog.start(); } catch (e) {
      recognising = false;
      if (status) status.textContent = t('voiceFailed');
    }
  };

  window.micDemo = function () {
    state.inputMode = 'voice_sim';
    var el = document.getElementById('issue');
    var demo = lang === 'en'
      ? 'Our trash was skipped and my mother cannot move the carts herself.'
      : 'No recogieron nuestra basura y mi mamá no puede mover los botes sola.';
    el.value = demo; el.focus();
  };

  window.startReport = function (entry) { track('report_started', { entry: entry }); go('intake'); };

  window.runDemo = function () {
    track('report_started', { entry: 'demo' });
    go('intake');
    setTimeout(function () { window.micDemo(); }, 120);
  };

  // CONTROLLER PATCH C-01: the committed bundle's keyword tables predate real
  // debris phrasings — "car metal on sidewalk" reached the street-tree
  // checklist on the deployed build. Until lib/rules is rebuilt and
  // recommitted, the controller catches obvious dumped-debris language and
  // asks the honest either/or question instead of guessing a department.
  var DEBRIS_TERMS = /\b(scrap\s+metal|metal\s+(debris|scraps?|pieces?|pipe|pipes)|car\s+parts?|auto\s+parts?|rebar|bicycle\s+frame|bike\s+frame|bed\s+frame|box\s+spring|water\s+heater|engine\s+block)\b/i;
  var DEBRIS_HIJACKED = { sidewalk: 1, street_tree: 1, pothole: 1, streetlight: 1 };
  var DEBRIS_QUESTION = {
    en: 'Is this material someone dumped on public ground — like scrap metal or parts — rather than damage to the sidewalk or street itself?',
    es: '¿Es material que alguien tiró en suelo público — como chatarra o partes — y no daño a la banqueta o a la calle misma?'
  };
  function debrisGuard(text, cls) {
    if (!DEBRIS_TERMS.test(text)) return cls;
    if (!cls) return cls;
    if (cls.kind === 'routed' && DEBRIS_HIJACKED[cls.serviceId]) {
      return {
        kind: 'clarify', serviceId: 'illegal_dumping',
        confidence: Math.min(cls.confidence, 0.7),
        alternates: [cls.serviceId],
        question: DEBRIS_QUESTION
      };
    }
    if (cls.kind === 'unsupported') {
      return {
        kind: 'clarify', serviceId: 'illegal_dumping',
        confidence: 0.65,
        alternates: ['bulky_item'],
        question: DEBRIS_QUESTION
      };
    }
    return cls;
  }

  window.analyze = function () {
    var text = document.getElementById('issue').value.trim();
    var err = document.getElementById('err');
    if (!text) {
      err.textContent = t('empty'); document.getElementById('issue').focus();
      track('error_shown', { error_code: 'empty_description', view: 'intake' });
      return;
    }
    err.textContent = '';
    // Stop any in-flight recognition so its callbacks cannot overwrite the
    // submitted text while the resident is already on the next screen.
    if (recognising && recog) { try { recog.stop(); } catch (e) {} recognising = false; }
    state.text = text;
    state.cls = debrisGuard(text, C1.classifyResidentText(text));
    var k = state.cls.kind;
    track('issue_description_entered', {
      length_bucket: C1.lengthBucket(text.length),
      input_mode: state.inputMode || 'text'
    });
    state.inputMode = 'text';
    if (k !== 'routed' && k !== 'clarify') { state.receipt = null; state.confirmation = null; state.resolved = false; }
    if (k === 'emergency') { track('emergency_gate_shown', { trigger_class: 'keyword_gate' }); renderEmergency(); return go('emergency'); }
    if (k === 'unsupported') { track('error_shown', { error_code: 'out_of_scope', view: 'intake' }); return go('unsupported'); }
    if (k === 'ambiguous') { track('clarification_shown', { confidence_band: 'low' }); renderChoose(); return go('choose'); }
    if (k === 'clarify') { track('clarification_shown', { service_id: state.cls.serviceId, confidence_band: C1.confidenceBand(state.cls.confidence) }); renderClarify(); return go('clarify'); }
    buildAndShow();
  };

  function renderClarify() {
    document.getElementById('clarify-q').textContent = state.cls.question[lang];
    document.getElementById('clarify-conf').textContent =
      t('conf') + ': ' + Math.round(state.cls.confidence * 100) + '% — ' +
      (lang === 'en' ? 'we want to be sure before we send you anywhere.' : 'queremos estar seguros antes de enviarle a algún lado.');
  }
  window.clarifyAnswer = function (yes) {
    if (yes) { state.cls = { kind: 'routed', serviceId: state.cls.serviceId, confidence: 0.95, alternates: [] }; return buildAndShow(); }
    var alts = state.cls.alternates && state.cls.alternates.length ? state.cls.alternates : C1.SERVICE_IDS.filter(function (i) { return i !== state.cls.serviceId; });
    state.cls = { kind: 'ambiguous', options: [state.cls.serviceId, alts[0]], confidence: 0.4 };
    renderChoose(); go('choose');
  };

  function renderChoose() {
    document.getElementById('choose-opts').innerHTML = state.cls.options.map(function (id) {
      var r = C1.serviceCatalog[id];
      return '<button class="tile" onclick="pick(\'' + id + '\')"><span class="t">' + esc(r.title[lang]) +
        '</span><span class="s">' + esc(r.responsibleEntity) + '</span></button>';
    }).join('');
  }

  function renderEmergency() {
    var g = C1.EMERGENCY_GUIDANCE[lang];
    document.getElementById('em-h').textContent = g.heading;
    document.getElementById('em-b').textContent = g.body;
    document.getElementById('em-911').textContent = g.emergency;
    document.getElementById('em-sh').textContent = g.sheriff;
  }

  function buildAndShow() {
    caseSeed = caseSeed >= 9999 ? 1000 : caseSeed + 1;
    state.receipt = C1.buildReceipt(state.text, state.cls, { lang: lang, caseIdSeed: caseSeed });
    state.confirmation = null; state.resolved = false; state.deleted = false; state.evidenceDone = false;
    state.evidenceTicks = []; state.contacted = false;
    // AUDIT A-02: the previous case's confirmation number used to stay in the
    // field, where it could be saved onto the wrong case.
    var confEl = document.getElementById('conf');
    if (confEl) confEl.value = '';
    state.createdAt = new Date().toISOString();
    if (state.receipt && state.receipt.kind === 'action') {
      track('route_recommended', {
        service_id: state.receipt.serviceId,
        confidence_band: C1.confidenceBand(state.receipt.confidence),
        jurisdiction: state.receipt.jurisdiction
      });
      var dd = Math.max(0, Math.round((new Date(state.receipt.followUpDate) - new Date()) / 86400000));
      track('follow_up_scheduled', { service_id: state.receipt.serviceId, days_ahead: dd });
    }
    renderReceipt(); renderTimeline(); renderDash(); renderKeepBar(); persist();
    go('receipt');
  }

  function pill(v) {
    if (v === 'officially_verified') return '<span class="pill p-ver">● ' + t('verified') + '</span>';
    if (v === 'needs_confirmation') return '<span class="pill p-need">▲ ' + t('needsconf') + '</span>';
    return '<span class="pill p-hist">○ ' + esc(v) + '</span>';
  }

  function renderReceipt() {
    if (!state.cls || !state.receipt) return;
    // Rebuild in the active language so the receipt is never mixed-language.
    // Classifications that carry no route (emergency, unsupported, ambiguous)
    // legitimately return null here; bail rather than dereference it.
    var rebuilt = C1.buildReceipt(state.text, state.cls, { lang: lang, caseIdSeed: caseSeed });
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
        '<span>CASE <b>' + esc(r.caseId) + '</b></span>' +
        '<span>STATUS <b>' + esc(r.status) + '</b></span>' +
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
          // CONTROLLER PATCH P-01: the checklist used to dead-end. Completing
          // it now surfaces the next move explicitly — go take the official
          // step, then come back and save the confirmation.
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
        '<div class="blk"><h3>' + t('save') + '</h3><p class="kv">' + esc(r.expectedConfirmation || '—') + '</p></div>' +
        '<div class="blk"><h3>' + t('follow') + '</h3><p class="kv"><b>' + esc(r.followUpDate) + '</b> — ' + esc(r.followUpCheckpoint) + '</p>' +
          '<p style="font-size:13px;color:var(--ink-60)">' + t('noSla') + '</p></div>' +
        // CONTROLLER PATCH P-02: the receipt never answered "after I prepare
        // the details, what happens?" A short ordered path now closes the
        // loop from checklist → official step → confirmation → follow-up.
        '<div class="blk noprint"><h3>' + t('nextH') + '</h3><ol class="nextsteps">' +
          [t('nextS1'), t('nextS2'), t('nextS3'), t('nextS4')].map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') +
          '</ol></div>' +
        '<div class="blk"><h3>' + t('sources') + '</h3><div class="srcs">' +
          r.sources.map(function (s) { return '<div>• <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + '</a> — verified ' + esc(s.lastVerifiedAt) + '</div>'; }).join('') +
          '<div style="margin-top:4px">Maintainer: ' + esc(r.maintainer) + ' · Next review ' + esc(r.nextReviewAt) + '</div></div></div>' +
      '</div>';
    restoreEvidenceTicks();
    renderAfterContact();
  }

  // Scrolls the resident to the official contact block — used when the
  // evidence checklist completes and the next move is the handoff itself.
  window.goContact = function () {
    var el = document.getElementById('blk-action');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  window.goConfirm = function () {
    go('timeline');
    setTimeout(function () {
      var c = document.getElementById('conf');
      if (c) c.focus();
    }, 60);
  };

  // CONTROLLER PATCH P-03: clicking the official phone/link used to be a
  // silent exit. After the handoff the receipt now says what comes back next.
  function renderAfterContact() {
    var bar = document.getElementById('after-contact');
    if (!bar) return;
    bar.classList.toggle('hidden', !state.contacted || state.deleted);
  }

  function renderTimeline() {
    var el = document.getElementById('tl'); if (!el) return;
    var r = state.receipt;
    // AUDIT A-03: the deleted-state message was unreachable, because the
    // null-receipt guard ran first and blanked the timeline silently. A
    // resident who pressed Delete saw nothing at all.
    if (state.deleted) {
      el.innerHTML = '<li><div class="d"></div><div class="dot"><i></i></div><div><div class="st">' +
        (lang === 'en' ? 'Case deleted' : 'Caso eliminado') + '</div><div class="nt">' +
        (lang === 'en' ? 'All details for this case were removed from this device.' : 'Todos los detalles de este caso se eliminaron de este dispositivo.') +
        '</div></div></li>';
      return;
    }
    if (!r || r.kind !== 'action') { el.innerHTML = ''; return; }
    var day = lang === 'en' ? ['Today', 'Today', 'Today', 'By ' + r.followUpDate, r.followUpDate]
                            : ['Hoy', 'Hoy', 'Hoy', 'Para ' + r.followUpDate, r.followUpDate];
    var rows = [
      ['HEARD', day[0], lang === 'en' ? 'You described the issue in your own words.' : 'Usted describió el problema en sus propias palabras.', true],
      ['CLASSIFIED', day[1], (lang === 'en' ? 'Matched to ' : 'Asociado con ') + r.title + ' (' + Math.round(r.confidence * 100) + '%).', true],
      ['READY', day[2], lang === 'en' ? 'Evidence list and official contact prepared.' : 'Lista de evidencia y contacto oficial preparados.', true],
      ['SUBMITTED', day[3], state.confirmation
        ? (lang === 'en' ? 'Confirmation saved: ' : 'Confirmación guardada: ') + state.confirmation
        : (lang === 'en' ? 'Waiting for you to contact the city and save your confirmation.' : 'Esperando que contacte a la ciudad y guarde su confirmación.'), !!state.confirmation],
      ['FOLLOW-UP DUE', day[4], lang === 'en' ? 'Check back if you have not heard anything.' : 'Verifique si no ha recibido respuesta.', state.resolved],
      ['RESOLVED', state.resolved ? day[4] : '—', state.resolved
        ? (lang === 'en' ? 'You marked this resolved.' : 'Usted marcó esto como resuelto.')
        : (lang === 'en' ? 'Not yet.' : 'Todavía no.'), state.resolved]
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
    var done = boxes.filter(function (b) { return b.checked; }).length;
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
    // AUDIT A-04: deletion used to leave the resident's own words rendered on
    // the receipt view. Deletion has to remove the surface, not just the state.
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
            var title = C1.serviceCatalog[c.serviceId] ? C1.serviceCatalog[c.serviceId].title[lang] : c.serviceId;
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
    var stats = [[String(list.length), lang === 'en' ? 'Cases' : 'Casos'],
                 [String(resolved), lang === 'en' ? 'Verified resolved' : 'Resueltos verificados'],
                 [String(due), lang === 'en' ? 'Follow-up due' : 'Seguimiento pendiente'],
                 [Math.round(100 * resolved / Math.max(1, list.length)) + '%', lang === 'en' ? 'Outcome rate' : 'Tasa de resultado']];
    var se = document.getElementById('stats');
    if (se) se.innerHTML = stats.map(function (s) { return '<div class="stat"><div class="v">' + esc(s[0]) + '</div><div class="l">' + esc(s[1]) + '</div></div>'; }).join('');
    var ce = document.getElementById('cases');
    if (ce) ce.innerHTML = list.map(function (c) {
      return '<div class="caseitem"><span class="id">' + esc(c.id) + '</span><span class="ti">' +
        esc(C1.serviceCatalog[c.sid].title[lang]) + (c.mine ? ' ★' : '') + '</span>' + badge(c.st) + '</div>';
    }).join('');
  }

  function statusOf() {
    return state.deleted ? null : state.resolved ? 'RESOLVED' : state.confirmation ? 'SUBMITTED' : 'READY';
  }

  function persist() {
    if (!store.isEnabled() || !state.receipt || state.receipt.kind !== 'action' || state.deleted) return;
    var r = state.receipt, now = new Date().toISOString();
    store.save({
      caseId: r.caseId, serviceId: r.serviceId, lang: lang, text: state.text,
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
      // AUDIT P-01: declining used to be permanent — there was no way back.
      // The card does not nag again, but the door stays open.
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
    lang = c.lang; applyLang();
    // AUDIT P-02: stripping all non-digits also ate the '1' in the 'C1-'
    // prefix, so reopening C1-1044 rebuilt it as C1-11044 — and the later
    // delete then missed the stored record entirely. Match the suffix only.
    var m = /(\d+)$/.exec(String(c.caseId));
    caseSeed = m ? parseInt(m[1], 10) : caseSeed;
    state.text = c.text;
    state.cls = { kind: 'routed', serviceId: c.serviceId, confidence: c.confidence || 0.9, alternates: [] };
    state.receipt = C1.buildReceipt(c.text, state.cls, { lang: lang, caseIdSeed: caseSeed });
    state.confirmation = c.confirmation; state.resolved = c.status === 'RESOLVED';
    state.deleted = false; state.evidenceTicks = (c.evidenceTicks || []).slice();
    state.evidenceDone = false; state.createdAt = c.createdAt; state.keepAsked = true;
    state.contacted = !!c.confirmation;
    var confEl = document.getElementById('conf'); if (confEl) confEl.value = c.confirmation || '';
    renderReceipt(); renderTimeline(); renderDash(); renderKeepBar();
    go('receipt');
  };

  window.downloadIcs = function () {
    var r = state.receipt;
    if (!r || r.kind !== 'action') return;
    var m = r.intakeMethods && r.intakeMethods[0];
    var ics = C1.buildReminderIcs({
      caseId: r.caseId, title: r.title, owner: r.owner, followUpDate: r.followUpDate,
      contact: m ? m.destination : '(310) 605-5500', confirmation: state.confirmation, lang: lang
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
      // CONTROLLER PATCH B-01: the download used to give zero on-page
      // feedback, so it read as a dead button. Confirm it inline.
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
    var doc = '<!doctype html><html lang="' + lang + '"><head><meta charset="utf-8">' +
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
  // printable window, then to an inline printable view. The page now also
  // ships a real print stylesheet, so the first path produces a clean
  // one-job receipt instead of four mostly-blank pages.
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

  var _go = go;
  go = window.go = function (v) { _go(v); if (v === 'dashboard') renderPrivacy(); };

  applyLang();
  renderPrivacy();
  renderKeepBar();
  renderDash();
  go('landing');
})();
