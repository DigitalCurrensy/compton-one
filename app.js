/* COMPTON ONE: FIX — demo controller (part 1 of 2: state, strings, routing).
   All routing/classification comes from the bundled, tested TypeScript (window.C1).
   app.ui.js (part 2) renders the receipt/timeline/dashboard and boots the app.
   Both parts share state through window.C1X. */
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
      step3: 'Step 3 of 5 — Your action plan · one call left',
      step4: 'Step 4 of 5 — Do not lose the thread',
      step5: 'Step 5 of 5 — Your cases',
      intakeH: 'You do not need to know the department.',
      what: 'What happened?',
      whatHint: 'Describe the problem the way you would explain it to a neighbor. Plain words work best.',
      examples: 'Or start from an example:',
      intakePriv: 'Do not include names, license plates, or accusations about a specific person. Describe what you saw.',
      analyze: 'Find the right path', back: '← Back',
      printFallback: 'Your browser blocked printing. Use your browser menu → Print, or take a screenshot of this receipt.',
      clarifyH: 'One quick question',
      yes: 'Yes, that is right', notsure: 'No, or I am not sure',
      chooseH: 'This could be two different services',
      chooseHint: 'We are not confident enough to choose for you. Pick the one that matches what you saw.',
      unsupH: 'We could not match this one',
      unsupBody: 'COMPTON ONE: FIX routes {n} city services, but we will not guess a department for you, because a wrong guess wastes your time. Try different words, pick the closest service below, or call the City of Compton main line at (310) 605-5500.',
      saved: 'Next: track this case', print: 'Print or save PDF', edit: 'Change my answer',
      tlH: 'Case timeline',
      confLabel: 'Confirmation number you received',
      confHint: 'Enter whatever the city gave you: a service request number, a reference code, or the date and name of the person you spoke with.',
      confWhere: 'Where does this number come from? The city gives it to you when you call or submit — ask: "Can I get a service request number for this report?" Write down whatever they give you, right here, so the follow-up has teeth.',
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
      mCase: 'CASE', mStatus: 'STATUS',
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
      openCase: 'Open', cal: 'Download calendar file (.ics)', gcal: 'Add to Google Calendar',
      calDone: '✓ Reminder downloaded. Open the file to add the follow-up to your calendar — or use the Google Calendar button for one-tap adding.',
      gcalDone: '✓ Opening Google Calendar — review the event and press Save.',
      msgH: 'Message studio',
      msgHint: 'Ready-to-send words for the city. Fill in anything in [brackets], then copy and paste it into the city form, an email, or your notes.',
      msgReport: 'First report', msgFollow: 'Follow-up', msgEscalate: 'Escalation',
      msgCopy: 'Copy message', msgCopied: '✓ Copied — paste it into the city form, an email, or your notes.',
      nextH: 'What happens next',
      nextS1: 'Gather the details above and check them off as you go.',
      nextS2: 'Take the official step — call or open the form. The script and message below are what to say.',
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
      stepNames: 'Describe|Match|Act|Track|Resolved',
      how1t: 'Describe', how1d: 'Say what happened in your own words. No department names needed.',
      how2t: 'Match', how2d: 'We match it to one of {n} verified city services and show you the source.',
      how3t: 'Act', how3d: 'You get the evidence list, the official contact, and the exact words to say.',
      how4t: 'Track', how4d: 'Save your confirmation number and get a follow-up date.',
      demoText: 'Our trash was skipped and my mother cannot move the carts herself.',
      clarifySure: 'we want to be sure before we send you anywhere.',
      confSaved: '✓ Confirmation saved — your follow-up now has teeth.',
      confEmpty: 'Enter the confirmation or reference number first — the field is empty.',
      confSame: 'That confirmation is already saved.',
      receiptLangNote: 'Receipts are written in English or Spanish — the languages the city works in. The buttons and menus stay in your language.',
      emNote: 'Emergency details are shown in English. 9-1-1 works in English and Spanish.',
      altH: 'Not quite right? One of these may fit better:',
      reportIssue: 'Wrong number or dead link? Report it',
      emailDraft: 'Open email draft',
      emailHint: 'Opens your mail app with the message written. Paste the official address from the source links above — we never send anything ourselves.',
      copyScript: 'Copy the script',
      scriptCopied: '✓ Script copied — read it aloud when you call.',
      lastVerified: 'LAST VERIFIED',
      srcVerified: 'verified', srcMaintainer: 'Maintainer', srcNext: 'Next review',
      msgReportTpl: 'Hello — I would like to report: {title}, near {loc}. It has been like this since {since}. Can you give me a service request number for this report? (Case {caseId})',
      msgFollowTpl: 'Hello — I am following up on {title}, reported on {date}. My service request number is {conf}. What is the current status, and when can I expect action? (Case {caseId})',
      msgEscalateTpl: 'Hello — I reported {title} on {date}, request number {conf}. My follow-up date {followUpDate} has passed with no update. Can this be escalated, and who is supervising the case? (Case {caseId})',
      phLoc: '[nearest cross streets or approximate address]', phSince: '[date you first saw it]', phDate: '[date]', phConf: '[request number]',
      dayToday: 'Today', dayBy: 'By ',
      stHeard: 'HEARD', stClassified: 'CLASSIFIED', stReady: 'READY', stSubmitted: 'SUBMITTED', stFollowup: 'FOLLOW-UP DUE', stResolved: 'RESOLVED',
      tlHeard: 'You described the issue in your own words.',
      tlClassified: 'Matched to {title} ({pct}%).',
      tlReady: 'Evidence list and official contact prepared.',
      tlSubSaved: 'Confirmation saved: {conf}',
      tlSubWait: 'Waiting for you to contact the city and save your confirmation.',
      tlFollowDue: 'Check back if you have not heard anything.',
      tlResolvedY: 'You marked this resolved.', tlResolvedN: 'Not yet.',
      tlCaseDeleted: 'Case deleted', tlCaseDeletedBody: 'All details for this case were removed from this device.',
      statCases: 'Cases', statResolved: 'Verified resolved', statDue: 'Follow-up due', statRate: 'Outcome rate',
      gcalTitlePfx: 'Follow up: ',
      fnl1: 'Intake started', fnl2: 'Issue described', fnl3: 'Route recommended', fnl4: 'Evidence prepared', fnl5: 'Official action opened', fnl6: 'Confirmation recorded', fnl7: 'Outcome verified',
      evl_report_started: 'Report started', evl_language_selected: 'Language changed', evl_issue_description_entered: 'Issue described', evl_clarification_shown: 'One quick question shown', evl_route_recommended: 'Route recommended', evl_route_manually_selected: 'Service picked by hand', evl_evidence_checklist_completed: 'Evidence checklist finished', evl_official_handoff_opened: 'Official contact opened', evl_confirmation_saved: 'Confirmation saved', evl_follow_up_scheduled: 'Follow-up scheduled', evl_case_reopened: 'Case reopened', evl_case_marked_resolved: 'Marked resolved', evl_case_deleted: 'Case deleted', evl_error_shown: 'Something needed attention', evl_emergency_gate_shown: 'Emergency check shown', evl_message_copied: 'Message copied',
      rawLog: 'Technical log (for auditors)',
      docTitle: 'COMPTON ONE: FIX — One problem. One path forward.',
      skipLink: 'Skip to main content',
      footerMeta: 'SOURCES LAST VERIFIED 2026-07-27 · NEXT REVIEW 2026-08-26',
      reportWrongShort: 'REPORT A WRONG NUMBER',
      yourCaseMark: '(your case)',
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
      step3: 'Paso 3 de 5 — Su plan de acción · una llamada',
      step4: 'Paso 4 de 5 — No pierda el hilo',
      step5: 'Paso 5 de 5 — Sus casos',
      intakeH: 'No necesita saber el departamento.',
      what: '¿Qué pasó?',
      whatHint: 'Describa el problema como se lo explicaría a un vecino. Las palabras sencillas funcionan mejor.',
      examples: 'O empiece con un ejemplo:',
      intakePriv: 'No incluya nombres, placas de vehículos ni acusaciones contra una persona específica. Describa lo que vio.',
      analyze: 'Encontrar el camino correcto', back: '← Atrás',
      printFallback: 'Su navegador bloqueó la impresión. Use el menú del navegador → Imprimir, o tome una captura de pantalla de este recibo.',
      clarifyH: 'Una pregunta rápida',
      yes: 'Sí, así es', notsure: 'No, o no estoy seguro',
      chooseH: 'Esto podría ser dos servicios distintos',
      chooseHint: 'No tenemos suficiente certeza para elegir por usted. Escoja el que coincide con lo que vio.',
      unsupH: 'No pudimos identificar este caso',
      unsupBody: 'COMPTON ONE: FIX encamina {n} servicios municipales, pero no adivinaremos un departamento, porque una suposición equivocada le hace perder tiempo. Intente con otras palabras, escoja el servicio más cercano abajo, o llame a la línea principal de la Ciudad de Compton al (310) 605-5500.',
      saved: 'Siguiente: seguir el caso', print: 'Imprimir o guardar PDF', edit: 'Cambiar mi respuesta',
      tlH: 'Cronología del caso',
      confLabel: 'Número de confirmación que recibió',
      confHint: 'Escriba lo que le dio la ciudad: un número de solicitud, un código de referencia, o la fecha y el nombre de la persona con quien habló.',
      confWhere: '¿De dónde sale este número? La ciudad se lo da cuando usted llama o envía el reporte — pregunte: "¿Me puede dar un número de solicitud para este reporte?" Anótelo aquí para que el seguimiento tenga fuerza.',
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
      mCase: 'CASO', mStatus: 'ESTADO',
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
      openCase: 'Abrir', cal: 'Descargar archivo de calendario (.ics)', gcal: 'Agregar a Google Calendar',
      calDone: '✓ Recordatorio descargado. Abra el archivo para agregarlo a su calendario — o use el botón de Google Calendar para agregarlo con un toque.',
      gcalDone: '✓ Abriendo Google Calendar — revise el evento y presione Guardar.',
      msgH: 'Estudio de mensajes',
      msgHint: 'Palabras listas para enviar a la ciudad. Complete lo que esté en [corchetes], luego cópielo en el formulario de la ciudad, un correo o sus notas.',
      msgReport: 'Primer reporte', msgFollow: 'Seguimiento', msgEscalate: 'Escalamiento',
      msgCopy: 'Copiar mensaje', msgCopied: '✓ Copiado — péguelo en el formulario de la ciudad, un correo o sus notas.',
      nextH: 'Qué sigue',
      nextS1: 'Reúna los datos de arriba y márquelos a medida que avanza.',
      nextS2: 'Dé el paso oficial — llame o abra el formulario. El guion y el mensaje de abajo son lo que debe decir.',
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
      stepNames: 'Describir|Coincidir|Actuar|Seguir|Resuelto',
      how1t: 'Describir', how1d: 'Diga qué pasó en sus propias palabras. No necesita nombres de departamentos.',
      how2t: 'Coincidir', how2d: 'Lo asociamos con uno de {n} servicios verificados y le mostramos la fuente.',
      how3t: 'Actuar', how3d: 'Recibe la lista de evidencia, el contacto oficial y las palabras exactas.',
      how4t: 'Seguir', how4d: 'Guarde su número de confirmación y reciba una fecha de seguimiento.',
      demoText: 'No recogieron nuestra basura y mi mamá no puede mover los botes sola.',
      clarifySure: 'queremos estar seguros antes de enviarle a algún lado.',
      confSaved: '✓ Confirmación guardada — su seguimiento ahora tiene fuerza.',
      confEmpty: 'Escriba primero el número de confirmación o referencia — el campo está vacío.',
      confSame: 'Esa confirmación ya está guardada.',
      receiptLangNote: 'Los recibos se redactan en inglés o español — los idiomas en que trabaja la ciudad. Los botones y menús siguen en su idioma.',
      emNote: 'Los detalles de emergencia se muestran en inglés. El 9-1-1 funciona en inglés y español.',
      altH: '¿No es exactamente esto? Una de estas puede servir mejor:',
      reportIssue: '¿Número equivocado o enlace roto? Repórtelo',
      emailDraft: 'Abrir borrador de correo',
      emailHint: 'Abre su aplicación de correo con el mensaje ya escrito. Pegue la dirección oficial de los enlaces de fuente de arriba — nosotros nunca enviamos nada.',
      copyScript: 'Copiar el guion',
      scriptCopied: '✓ Guion copiado — léalo en voz alta cuando llame.',
      lastVerified: 'ÚLTIMA VERIFICACIÓN',
      srcVerified: 'verificado', srcMaintainer: 'Mantenedor', srcNext: 'Próxima revisión',
      msgReportTpl: 'Buenos días — quisiera reportar: {title}, cerca de {loc}. Está así desde {since}. ¿Me puede dar un número de solicitud para este reporte? (Caso {caseId})',
      msgFollowTpl: 'Buenos días — doy seguimiento a {title}, reportado el {date}. Mi número de solicitud es {conf}. ¿Cuál es el estado actual y cuándo puedo esperar acción? (Caso {caseId})',
      msgEscalateTpl: 'Buenos días — reporté {title} el {date}, número de solicitud {conf}. Mi fecha de seguimiento {followUpDate} ya pasó sin novedad. ¿Se puede escalar el caso y quién lo supervisa? (Caso {caseId})',
      phLoc: '[calles transversales o dirección aproximada]', phSince: '[fecha en que lo vio por primera vez]', phDate: '[fecha]', phConf: '[número de solicitud]',
      dayToday: 'Hoy', dayBy: 'Para ',
      stHeard: 'ESCUCHADO', stClassified: 'CLASIFICADO', stReady: 'LISTO', stSubmitted: 'ENVIADO', stFollowup: 'SEGUIMIENTO PENDIENTE', stResolved: 'RESUELTO',
      tlHeard: 'Usted describió el problema en sus propias palabras.',
      tlClassified: 'Asociado con {title} ({pct}%).',
      tlReady: 'Lista de evidencia y contacto oficial preparados.',
      tlSubSaved: 'Confirmación guardada: {conf}',
      tlSubWait: 'Esperando que contacte a la ciudad y guarde su confirmación.',
      tlFollowDue: 'Verifique si no ha recibido respuesta.',
      tlResolvedY: 'Usted marcó esto como resuelto.', tlResolvedN: 'Todavía no.',
      tlCaseDeleted: 'Caso eliminado', tlCaseDeletedBody: 'Todos los detalles de este caso se eliminaron de este dispositivo.',
      statCases: 'Casos', statResolved: 'Resueltos verificados', statDue: 'Seguimiento pendiente', statRate: 'Tasa de resultado',
      gcalTitlePfx: 'Seguimiento: ',
      fnl1: 'Reporte iniciado', fnl2: 'Problema descrito', fnl3: 'Ruta recomendada', fnl4: 'Evidencia preparada', fnl5: 'Contacto oficial abierto', fnl6: 'Confirmación registrada', fnl7: 'Resultado verificado',
      evl_report_started: 'Reporte iniciado', evl_language_selected: 'Idioma cambiado', evl_issue_description_entered: 'Problema descrito', evl_clarification_shown: 'Pregunta rápida mostrada', evl_route_recommended: 'Ruta recomendada', evl_route_manually_selected: 'Servicio elegido a mano', evl_evidence_checklist_completed: 'Lista de evidencia completada', evl_official_handoff_opened: 'Contacto oficial abierto', evl_confirmation_saved: 'Confirmación guardada', evl_follow_up_scheduled: 'Seguimiento programado', evl_case_reopened: 'Caso reabierto', evl_case_marked_resolved: 'Marcado como resuelto', evl_case_deleted: 'Caso eliminado', evl_error_shown: 'Algo necesitó atención', evl_emergency_gate_shown: 'Aviso de emergencia mostrado', evl_message_copied: 'Mensaje copiado',
      rawLog: 'Registro técnico (para auditores)',
      docTitle: 'COMPTON ONE: FIX — Un problema. Un camino a seguir.',
      skipLink: 'Saltar al contenido principal',
      footerMeta: 'FUENTES VERIFICADAS 2026-07-27 · PRÓXIMA REVISIÓN 2026-08-26',
      reportWrongShort: 'REPORTAR UN NÚMERO EQUIVOCADO',
      yourCaseMark: '(su caso)',
    }
  };
  var A = C1.analytics;
  var store = C1.createCaseStore();
  function track(ev, props) { props = props || {}; props.lang = lang; A.track(ev, props); if (X.renderPrivacy) X.renderPrivacy(); }
  function sid() { return state.cls && state.cls.serviceId ? state.cls.serviceId : (state.receipt && state.receipt.serviceId) || 'none'; }
  // Hardened (review F2): if the language pack ever fails to load, tl/zh
  // falls back to English instead of throwing mid-applyLang.
  function t(k) { var d = T[lang] || T.en; return d[k] || T.en[k] || k; }
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
    // J-01: steps name the outcome the resident gets, not the machinery.
    var names = t('stepNames').split('|');
    var i = STEPMAP[current];
    el.innerHTML = names.map(function (n, k) {
      return '<span class="step ' + (k < i ? 'done' : k === i ? 'on' : '') + '">' + esc(n) + '</span>';
    }).join('');
  }

  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('docTitle');
    document.querySelectorAll('[data-t]').forEach(function (n) { n.textContent = t(n.getAttribute('data-t')); });
    ['en', 'es', 'tl', 'zh'].forEach(function (l) {
      var b = document.getElementById('lang-' + l);
      if (b) b.setAttribute('aria-pressed', String(lang === l));
    });
    var ub = document.getElementById('unsup-body');
    if (ub) ub.textContent = t('unsupBody').replace('{n}', String(C1.SERVICE_IDS.length));
    document.getElementById('conf-hint').textContent = t('confHint');
    renderTiles(); renderHow(); renderChips(); renderSteps();
    if (X.renderDash) X.renderDash();
    if (state.receipt && X.renderReceipt) X.renderReceipt();
    if (state.cls && state.cls.kind === 'clarify') renderClarify();
    if (state.cls && state.cls.kind === 'ambiguous') renderChoose();
    if (state.cls && state.cls.kind === 'emergency') renderEmergency();
    if (X.renderTimeline) X.renderTimeline();
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
    var title = r.title[lang] || r.title.en;
    var example = (r.triggerExamples[lang] || r.triggerExamples.en)[0];
    return '<button class="tile" onclick="pick(\'' + id + '\')"><span class="t">' + esc(title) +
      '</span><span class="s">' + esc(example) + '</span></button>';
  }

  function renderTiles() {
    var grouped = TILE_GROUPS.map(function (g) {
      return '<p class="tile-group">' + esc(g[lang] || g.en) + '</p><div class="grid5">' +
        g.ids.map(tileHtml).join('') + '</div>';
    }).join('');
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
    // R-03: the service count is derived from the live catalog, never
    // hardcoded, so this copy cannot go stale when the catalog changes.
    var n = String(C1.SERVICE_IDS.length);
    var steps = [[t('how1t'), t('how1d')], [t('how2t'), t('how2d').replace('{n}', n)],
                 [t('how3t'), t('how3d')], [t('how4t'), t('how4d')]];
    document.getElementById('how').innerHTML = steps.map(function (s, i) {
      return '<div><p class="n">0' + (i + 1) + '</p><h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p></div>';
    }).join('');
  }

  function renderChips() {
    var trig = function (id) {
      var r = C1.serviceCatalog[id];
      return (r.triggerExamples[lang] || r.triggerExamples.en)[0];
    };
    var ex = [trig('missed_trash'), trig('streetlight'), trig('illegal_dumping'), trig('pothole')];
    document.getElementById('chips').innerHTML = ex.map(function (e) {
      return '<button class="chip" onclick="useExample(this)">' + esc(e) + '</button>';
    }).join('');
  }
  window.useExample = function (b) { document.getElementById('issue').value = b.textContent; };

  window.pick = function (id) {
    track('route_manually_selected', { service_id: id, origin: current === 'landing' ? 'tile' : 'ambiguous_choice' });
    var r = C1.serviceCatalog[id];
    state.text = document.getElementById('issue') && document.getElementById('issue').value
      ? document.getElementById('issue').value : (r.triggerExamples[lang] || r.triggerExamples.en)[0];
    state.cls = { kind: 'routed', serviceId: id, confidence: 1, alternates: [] };
    buildAndShow();
  };

  // VOICE REMOVED (W-01, 2026-07-28): voice input depended on the browser
  // vendor's speech service — hard-blocked on Brave, quietly proxied through
  // Google on Chrome, and a gimmick for the residents who most needed a
  // reliable path. One honest input method now: typing. micDemo stays because
  // the landing-page demo fills the textarea with a sample report.
  window.micDemo = function () {
    state.inputMode = 'demo';
    var el = document.getElementById('issue');
    // Intake matching runs in en/es only (the whatHint note says so in tl/zh),
    // so the demo feeds the engine a routable sentence — English, or Spanish
    // when the UI is Spanish — regardless of the chrome language.
    el.value = lang === 'es' ? T.es.demoText : T.en.demoText;
    el.focus();
  };

  window.startReport = function (entry) { track('report_started', { entry: entry }); go('intake'); };

  window.runDemo = function () {
    track('report_started', { entry: 'demo' });
    go('intake');
    setTimeout(function () { window.micDemo(); }, 120);
  };

  // CONTROLLER PATCH C-01 (extended): the committed bundle's keyword tables
  // predate real debris phrasings — "car metal on sidewalk" reached the
  // street-tree checklist, and "broken glass on sidewalk" hit the unsupported
  // wall. The controller catches obvious dumped-debris language and asks the
  // honest either/or question instead of guessing a department.
  var DEBRIS_TERMS = /\b(scrap\s+metal|metal\s+(debris|scraps?|pieces?|pipe|pipes)|car\s+parts?|auto\s+parts?|rebar|bicycle\s+frame|bike\s+frame|bed\s+frame|box\s+spring|water\s+heater|engine\s+block|broken\s+glass|shattered\s+glass|glass\s+(on|in|all\s+over)\s+the\s+(sidewalk|street|road|parkway|alley)|needles?|syringes?|dumped\s+tires?|construction\s+debris|pile\s+of\s+(trash|garbage|junk|debris)|vidrio\s+roto|escombros|jeringas)\b/i;
  var DEBRIS_HIJACKED = { sidewalk: 1, street_tree: 1, pothole: 1, streetlight: 1 };
  var DEBRIS_QUESTION = {
    en: 'Is this material someone dumped on public ground — like scrap metal, glass, or tires — rather than damage to the sidewalk or street itself?',
    es: '¿Es material que alguien tiró en suelo público — como chatarra, vidrio o llantas — y no daño a la banqueta o a la calle misma?'
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

  // CONTROLLER PATCH R-01: scenario engine. The tested bundle only routes five
  // services; everything else used to hit the unsupported wall ("broken glass
  // on sidewalk", "lost dog"). This second pass runs ONLY when the bundle
  // returns unsupported, scores plain-language phrases (EN/ES) against all 22
  // catalogued services, and can only emit known service IDs — deterministic,
  // no LLM, no guessing beyond the catalog.
  // strong = unmistakable phrasing (3 pts), medium = likely (2), weak = hint (1).
  var SCENARIO_RULES = [
    { id: 'animal_control',
      strong: ['lost dog','lost cat','lost pet','missing dog','missing cat','missing pet','stray dog','stray cat','barking dog','dead animal','animal control','dog bite','found dog','found cat','perro perdido','gato perdido','mascota perdida','perro callejero','gato callejero','animal muerto','control de animales'],
      medium: ['lost my dog','lost my cat','found a dog','found a cat','coyote','raccoon','opossum','possum','loose dog','dog running loose','injured animal','se me perdio el perro','se me perdio el gato','perro suelto','animal herido'],
      weak: ['puppy','kitten','perro','gato','mascota','pet','animal'] },
    { id: 'illegal_dumping',
      strong: ['illegal dumping','dumped trash','dumped furniture','someone dumped','tiraron basura','tiradero','basura tirada','muebles tirados'],
      medium: ['dumping','pile of trash','pile of garbage','pile of junk','mattress on the sidewalk','couch on the curb','construction debris','dumped tires','tires dumped','escombros','llantas tiradas'],
      weak: ['dumped','mattress','couch','sofa','tires','tirado'] },
    { id: 'bulky_item',
      strong: ['bulky item','bulky pickup','large item pickup','furniture pickup','appliance pickup','recoleccion de muebles','recoger muebles'],
      medium: ['old refrigerator','old fridge','broken washing machine','throw away a couch','get rid of a mattress','refrigerador viejo','lavadora vieja'],
      weak: ['refrigerator','fridge','washer','dryer','appliance'] },
    { id: 'graffiti',
      strong: ['graffiti','tagging','spray paint on','gang graffiti','grafiti','pintas','rayado'],
      medium: ['tagged','spray painted','vandalized wall','painted on my wall','pintaron la pared','rayaron'],
      weak: ['tagging crew'] },
    { id: 'code_violation',
      strong: ['code violation','code enforcement','overgrown yard','overgrown weeds','unsafe building','violacion de codigo','maleza','yarda llena de maleza'],
      medium: ['hoarding','abandoned house','vacant house','trash in yard','cars on lawn','casa abandonada'],
      weak: ['weeds','messy yard','overgrown'] },
    { id: 'storm_drain',
      strong: ['storm drain','clogged drain','flooded street','street flooding','drain blocked','drenaje tapado','calle inundada','inundacion'],
      medium: ['water pooling','standing water in street','drain overflowing','catch basin','agua estancada','se inunda'],
      weak: ['flooding','flooded','drain'] },
    { id: 'traffic_sign_signal',
      strong: ['traffic signal','traffic light out','stop sign down','missing stop sign','broken traffic light','senal de transito','semaforo descompuesto','senal de stop caida'],
      medium: ['sign knocked down','street sign missing','faded crosswalk','crosswalk paint','senal caida'],
      weak: ['sign','signal','crosswalk'] },
    { id: 'streetlight',
      strong: ['streetlight','street light out','light pole','lamp post','alumbrado publico','poste de luz','luz de la calle'],
      medium: ['dark street','light flickering','pole light broken','calle oscura'],
      weak: ['light out','lamp'] },
    { id: 'missed_trash',
      strong: ['missed trash','trash not picked up','garbage not collected','missed pickup','skipped our trash','no recogieron la basura','basura no recogida'],
      medium: ['trash still out','carts not emptied','recycling not picked up','no pasaron por la basura'],
      weak: ['trash','garbage'] },
    { id: 'water_or_sewer',
      strong: ['water main','burst pipe','sewer backup','sewage smell','water leak in street','fuga de agua','olor a drenaje','alcantarilla'],
      medium: ['low water pressure','discolored water','brown water','manhole overflowing','agua cafe','poca presion de agua'],
      weak: ['leak','sewer'] },
    { id: 'power_outage',
      strong: ['power outage','power out','no electricity','blackout','apagon','sin luz','se fue la luz'],
      medium: ['lights out in the house','half my power is out','sparking wire','downed power line','cable caido','cables con chispas'],
      weak: ['electricity','power'] },
    { id: 'homeless_outreach',
      strong: ['homeless encampment','encampment','homeless person needs help','campamento de personas sin hogar','persona sin hogar'],
      medium: ['tent on the sidewalk','person sleeping on sidewalk','someone living in car','carpa en la banqueta','persona durmiendo en la calle'],
      weak: ['homeless','tent','unhoused'] },
    { id: 'abandoned_vehicle',
      strong: ['abandoned vehicle','abandoned car','car left for weeks','car hasn t moved','vehiculo abandonado','carro abandonado','auto abandonado'],
      medium: ['car parked for months','car with flat tires parked','car covered in dust','carro estacionado por meses'],
      weak: ['old car'] },
    { id: 'parking_citation',
      strong: ['parking ticket','parking citation','contest a ticket','pay a ticket','multa de estacionamiento','ticket de estacionamiento'],
      medium: ['ticket on my windshield','unfair ticket','dispute ticket','pagar multa','me pusieron una multa','infraccion'],
      weak: ['citation','parking fine'] },
    { id: 'utility_billing',
      strong: ['water bill','utility bill','billing error','bill too high','factura de agua','recibo de agua','cobro de mas'],
      medium: ['charged twice','wrong charge on bill','bill dispute','cuenta muy alta','error en el recibo'],
      weak: ['billing'] },
    { id: 'housing_help',
      strong: ['housing assistance','rent help','eviction help','rental assistance','ayuda para la renta','ayuda de vivienda','desalojo'],
      medium: ['can t pay rent','landlord problem','habitability','no puedo pagar la renta','problema con el dueno'],
      weak: ['eviction','housing'] },
    { id: 'business_permit',
      strong: ['business license','business permit','permit to open','open a business','licencia de negocio','permiso de negocio','abrir un negocio'],
      medium: ['home business permit','sellers permit','health permit','permiso para vender'],
      weak: ['license','permit'] },
    { id: 'public_records',
      strong: ['public records request','records request','freedom of information','solicitud de registros publicos','registros publicos'],
      medium: ['copy of a report','city document','meeting minutes','actas','documentos de la ciudad'],
      weak: ['records','documents'] },
    { id: 'recycling_ewaste',
      strong: ['e-waste','electronic waste','recycle electronics','old tv disposal','battery disposal','residuos electronicos','reciclar electronicos','tirar tele'],
      medium: ['where to recycle','hazardous waste','paint disposal','oil disposal','desecho de pintura','aceite usado'],
      weak: ['recycle','recycling','batteries'] },
    { id: 'pothole',
      strong: ['pothole','potholes','big hole in the street','bache','baches','hoyo en la calle'],
      medium: ['street crumbling','asphalt breaking','cracked road','calle agrietada'],
      weak: ['hole in road'] },
    { id: 'sidewalk',
      strong: ['sidewalk cracked','broken sidewalk','uplifted sidewalk','uneven sidewalk','banqueta rota','banqueta levantada','banqueta agrietada'],
      medium: ['tripping hazard','sidewalk lifted by roots','tree roots lifting sidewalk','raices levantan la banqueta'],
      weak: ['sidewalk','banqueta'] },
    { id: 'street_tree',
      strong: ['street tree','tree trimming','fallen tree','tree branch down','broken branch','arbol caido','rama caida','poda de arbol','arbol de la calle'],
      medium: ['tree blocking sidewalk','low hanging branch','rama colgando'],
      weak: ['tree','branch','roots'] }
  ];

  function scenarioHit(text, phrase) {
    var t = ' ' + text.toLowerCase().replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
    return t.indexOf(' ' + phrase + ' ') !== -1;
  }

  // CONTROLLER PATCH R-02: typo and phrasing tolerance. The tested engine
  // matches exact tokens, so "pot hole", "grafitti" or "lost my dog" used to
  // fall through to the unsupported wall although the intent was obvious.
  // A small curated rewrite table plus an order-free word-set scorer —
  // deterministic, inspectable, no guessing. Additions go here, never in
  // the bundle.
  var TEXT_FIXES = [
    [/\bpot\s*holes?\b/gi, 'pothole'],
    [/\bgrafitt?i\b/gi, 'graffiti'], [/\bgrafity\b/gi, 'graffiti'],
    [/\btrafic\b/gi, 'traffic'], [/\btraffick\b/gi, 'traffic'],
    [/\bst\s+lights?\b/gi, 'streetlight'], [/\bstreet\s+lites?\b/gi, 'streetlight'],
    [/\bstreet\s+ligths?\b/gi, 'streetlight'], [/\blightpost\b/gi, 'lamp post'],
    [/\brecylce\b/gi, 'recycle'], [/\brecyclingg\b/gi, 'recycling'],
    [/\bmattres\b/gi, 'mattress'], [/\bcouchs\b/gi, 'couch'],
    [/\btyres\b/gi, 'tires'],
    [/\bside\s*walk\b/gi, 'sidewalk'], [/\bsidwalk\b/gi, 'sidewalk'],
    [/\bwater\s+leake?\b/gi, 'water leak'],
    [/\bstop\s+sing\b/gi, 'stop sign'],
    [/\bcross\s*walk\b/gi, 'crosswalk'],
    [/\blost\s+my\s+dog\b/gi, 'lost dog'], [/\blost\s+my\s+cat\b/gi, 'lost cat'],
    [/\blost\s+my\s+pet\b/gi, 'lost pet'],
    [/\bfound\s+a\s+dog\b/gi, 'found dog'], [/\bfound\s+a\s+cat\b/gi, 'found cat'],
    [/\bfound\s+a\s+pet\b/gi, 'found pet'],
    [/\bno\s+recojieron\b/gi, 'no recogieron']
  ];
  function fixText(s) {
    var out = ' ' + s + ' ';
    for (var i = 0; i < TEXT_FIXES.length; i++) out = out.replace(TEXT_FIXES[i][0], ' ' + TEXT_FIXES[i][1] + ' ');
    return out.replace(/\s+/g, ' ').trim();
  }

  function looseHit(text, phrase) {
    // Order-free word-set match for interpolated phrasing ("i lost my dog"
    // for the phrase "lost dog"). Only for multiword phrases, and only in
    // secondPass scoring, so exact phrase hits always outrank it.
    var words = phrase.split(' ');
    if (words.length < 2) return false;
    var norm = ' ' + text.toLowerCase().replace(/[^a-z0-9ñ\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
    for (var i = 0; i < words.length; i++) if (norm.indexOf(' ' + words[i] + ' ') === -1) return false;
    return true;
  }

  function secondPass(text) {
    var best = null, runner = null;
    for (var i = 0; i < SCENARIO_RULES.length; i++) {
      var rule = SCENARIO_RULES[i];
      if (!C1.serviceCatalog[rule.id]) continue;
      var s = 0, j;
      for (j = 0; j < rule.strong.length; j++) { if (scenarioHit(text, rule.strong[j])) s += 3; else if (looseHit(text, rule.strong[j])) s += 1; }
      for (j = 0; j < rule.medium.length; j++) { if (scenarioHit(text, rule.medium[j])) s += 2; else if (looseHit(text, rule.medium[j])) s += 1; }
      for (j = 0; j < rule.weak.length; j++) if (scenarioHit(text, rule.weak[j])) s += 1;
      if (s <= 0) continue;
      if (!best || s > best.score) { runner = best; best = { id: rule.id, score: s }; }
      else if (!runner || s > runner.score) { runner = { id: rule.id, score: s }; }
    }
    if (!best) return null;
    var margin = best.score - (runner ? runner.score : 0);
    // R-02: when a runner-up exists, carry it as an alternate so the
    // receipt can offer "not quite right?" one-tap re-routes.
    if (best.score >= 3 && margin >= 2) {
      return { kind: 'routed', serviceId: best.id, confidence: 0.9,
        alternates: runner ? [runner.id] : [] };
    }
    if (runner) {
      return { kind: 'ambiguous', options: [best.id, runner.id], confidence: 0.4 };
    }
    return { kind: 'routed', serviceId: best.id, confidence: 0.72, alternates: [] };
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
    state.text = text;
    // R-02: routing runs on the typo-tolerant rewrite; the resident's own
    // words stay untouched for the receipt.
    var fixed = fixText(text);
    state.cls = debrisGuard(fixed, C1.classifyResidentText(fixed));
    // R-01: only when the tested engine has no answer does the scenario net
    // run. It can still only emit catalogued service IDs.
    if (state.cls && state.cls.kind === 'unsupported') {
      var sp = secondPass(fixed);
      if (sp) state.cls = sp;
    }
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
    var q = state.cls.question;
    document.getElementById('clarify-q').textContent = q[lang] || q.en;
    document.getElementById('clarify-conf').textContent =
      t('conf') + ': ' + Math.round(state.cls.confidence * 100) + '% — ' + t('clarifySure');
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
      return '<button class="tile" onclick="pick(\'' + id + '\')"><span class="t">' + esc(r.title[lang] || r.title.en) +
        '</span><span class="s">' + esc(r.responsibleEntity) + '</span></button>';
    }).join('');
  }

  function renderEmergency() {
    var g = C1.EMERGENCY_GUIDANCE[lang] || C1.EMERGENCY_GUIDANCE.en;
    document.getElementById('em-h').textContent = g.heading;
    document.getElementById('em-b').textContent = g.body;
    document.getElementById('em-911').textContent = g.emergency;
    document.getElementById('em-sh').textContent = g.sheriff;
    var n = document.getElementById('em-note');
    if (n) n.textContent = (lang === 'tl' || lang === 'zh') ? t('emNote') : '';
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
    X.renderReceipt(); X.renderTimeline(); X.renderDash(); X.renderKeepBar(); X.persist();
    go('receipt');
  }

  function pill(v) {
    if (v === 'officially_verified') return '<span class="pill p-ver">● ' + t('verified') + '</span>';
    if (v === 'needs_confirmation') return '<span class="pill p-need">▲ ' + t('needsconf') + '</span>';
    return '<span class="pill p-hist">○ ' + esc(v) + '</span>';
  }

  // Shared namespace — app.ui.js (part 2) reads state through X and attaches
  // its renderers back onto X for the part-1 flows to call. lang and caseSeed
  // are exposed as live accessors so part 2 always sees the current value.
  var X = {
    C1: C1, T: T, A: A, store: store,
    state: state,
    t: t, esc: esc, track: track, sid: sid,
    go: go, pill: pill,
    applyLang: applyLang,
    renderClarify: renderClarify,
    renderChoose: renderChoose,
    renderEmergency: renderEmergency,
    TILE_GROUPS: TILE_GROUPS,
    DEBRIS_QUESTION: DEBRIS_QUESTION
  };
  Object.defineProperty(X, 'lang', { get: function () { return lang; }, set: function (v) { lang = v; } });
  Object.defineProperty(X, 'caseSeed', { get: function () { return caseSeed; }, set: function (v) { caseSeed = v; } });
  window.C1X = X;
})();
