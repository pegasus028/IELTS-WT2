/* ===========================================================================
   POSITION CONTROL — student.js
   The student console: sign-in, flight plan, modules, Bootcamp, the Writer,
   the Template workshop, the model library, the fault list, the record and
   settings. Inherits the practice runner and progress flow from Chart Control.
   Marking is handed off to LevelUp English (window.PC_LEVELUP_URL).
   =========================================================================== */
(function () {
  'use strict';
  var C = window.CONTENT, E = window.Engine, P = E.Progress, api = window.API, W = window.Writer, PR = window.Prompts, T = window.Template;
  var $ = function (s) { return document.querySelector(s); };
  var esc = E.esc;
  var LEVELUP = window.PC_LEVELUP_URL || 'https://pegasus028.github.io/LevelUp/';

  var S = {
    p: null, sessItems: 0, sessCorrect: 0,
    run: null, write: null, simple: false, sysOpen: null, mapPainted: false, planReturn: false, celebrateTimer: null,
    filters: { type: 'all', domain: 'all' }, uiMode: 'guided', reports: null, assignments: [], modelOpen: null, modelMode: 'read', tplType: 'DISCUSS'
  };

  /* ------------------------------------------------------------- helpers */
  function toast(msg, ms) {
    $('#toast-slot').innerHTML = '<div class="toast">' + esc(msg) + '</div>';
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { $('#toast-slot').innerHTML = ''; }, ms || 2600);
  }
  function modal(html) {
    var slot = $('#modal-slot');
    slot.innerHTML = '<div class="modal"><div class="modal-card">' + html + '</div></div>';
    slot.querySelector('.modal').addEventListener('click', function (ev) { if (ev.target === this) slot.innerHTML = ''; });
    var b = slot.querySelector('[data-close]');
    if (b) b.addEventListener('click', function () { slot.innerHTML = ''; });
  }
  function pct(x) { return Math.round((x || 0) * 100); }
  function mmss(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function uid(pre) { return pre + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function typeName(t) { return (C.TYPES[t] || {}).name || t; }
  function fmtBand(b) { return b == null ? '—' : (Math.round(b * 2) / 2).toFixed(1); }
  function tier() { return (S.p && S.p.tier === 'C1') ? 'C1' : 'B2'; }

  /* --------------------------------------------------------------- sync */
  function sync() {
    if (!S.p) return Promise.resolve();
    S.p._readiness = P.readiness(S.p);
    S.p._gates = P.gateReadiness(S.p);
    S.p._rank = P.rank(S.p).name;
    return api.save(S.p).catch(function () { return { ok: false }; });
  }
  var syncSoon = (function () { var t; return function () { clearTimeout(t); t = setTimeout(sync, 10000); }; })();
  api.onModeChange = function () {};
  /* What the Template Lab (lab.js) may use from this console. */
  window.PCHost = {
    get p() { return S.p; },
    sync: sync, syncSoon: syncSoon, toast: toast, modal: modal, esc: esc, tier: tier,
    celebrate: function (b, rest) { celebrate(b, rest); },
    paintHeader: function () { if (S.p) paintHeader(); },
    show: function (v) { show(v); }
  };
  setInterval(function () {
    if (!S.p) return;
    if (api.mode !== 'cloud') api.retryCloud();
    if (api.pendingCount()) sync();
  }, 15000);

  /* =====================================================================
     LOGIN
     ===================================================================== */
  var mode = 'in', fastGroup = null;
  var groups = (typeof ROSTER_GROUPS !== 'undefined' && ROSTER_GROUPS) ? ROSTER_GROUPS.filter(function (g) { return g.students.length; }) : [];
  (function buildTabs() {
    var tabs = $('#login-tabs');
    groups.slice().reverse().forEach(function (g) {
      var b = document.createElement('button');
      b.className = 'tab'; b.id = 'tab-' + g.key; b.textContent = g.label; b.setAttribute('role', 'tab');
      b.addEventListener('click', function () { setMode('fast', g); });
      tabs.insertBefore(b, tabs.firstChild);
    });
  })();
  function fillRoster(g) {
    var sel = $('#f-pick');
    sel.innerHTML = '<option value="">Choose your name…</option>';
    var list = g.students.slice().sort(function (a, b) { return String(a.name).toLowerCase() < String(b.name).toLowerCase() ? -1 : 1; });
    var seen = {}; list.forEach(function (r) { seen[r.name] = (seen[r.name] || 0) + 1; });
    list.forEach(function (r) {
      var o = document.createElement('option');
      o.value = String(r.id).toLowerCase(); o.textContent = seen[r.name] > 1 ? r.name + '  ·  ' + r.id : r.name; o.dataset.name = r.name;
      sel.appendChild(o);
    });
  }
  function setMode(m, g) {
    mode = m; fastGroup = g || null;
    document.querySelectorAll('#login-tabs .tab').forEach(function (t) { t.classList.remove('on'); });
    if (m === 'fast') { $('#tab-' + g.key).classList.add('on'); fillRoster(g); }
    else $('#tab-' + m).classList.add('on');
    $('#wrap-pick').classList.toggle('hidden', m !== 'fast');
    $('#wrap-id').classList.toggle('hidden', m === 'fast');
    $('#wrap-name').classList.toggle('hidden', m !== 'new');
    $('#btn-go').textContent = m === 'in' ? 'Log in' : m === 'new' ? 'Create my account' : 'Go';
    $('#f-pw').setAttribute('autocomplete', m === 'in' ? 'current-password' : 'new-password');
    $('#login-tip').textContent = m === 'fast'
      ? 'Pick your name, then set a password the first time. After that it is the password you sign in with. Your teacher never sees it.'
      : 'Your ID and password are yours to choose. Your teacher can see your progress, never your password.';
    say('');
  }
  function say(text, bad) {
    var m = $('#login-msg');
    m.className = 'msg ' + (bad ? 'bad' : 'info') + (text ? '' : ' hidden');
    m.textContent = text;
  }
  $('#tab-in').addEventListener('click', function () { setMode('in'); });
  $('#tab-new').addEventListener('click', function () { setMode('new'); });
  if (groups.length) setMode('fast', groups[0]); else setMode('in');

  function go() {
    var pick = $('#f-pick'), fast = mode === 'fast';
    var id = fast ? pick.value : $('#f-id').value.trim().toLowerCase();
    var pw = $('#f-pw').value;
    var name = fast ? (pick.selectedIndex > 0 ? pick.options[pick.selectedIndex].dataset.name : '') : $('#f-name').value.trim();
    if (fast && !id) return say('Find your name in the list first.', true);
    if (!id) return say('Enter a student ID.', true);
    if (!/^[a-z0-9._-]{3,24}$/.test(id)) return say('Use 3-24 letters, numbers, dots or dashes, with no spaces.', true);
    if (pw.length < 4) return say('Your password needs at least 4 characters.', true);
    if (mode === 'new' && !name) return say('Enter the name your teacher will see.', true);
    $('#btn-go').disabled = true;
    say(mode === 'new' ? 'Creating your account…' : 'Checking…');
    var slow = setTimeout(function () { say('Still working — the class server is waking up. This can take a few seconds.'); }, 4000);
    function done(r) { clearTimeout(slow); $('#btn-go').disabled = false; var pr = r.progress || P.blank(id, name || id); if (fastGroup && !pr.cohort) pr.cohort = fastGroup.cohort; start(pr); }
    function failed(msg) { clearTimeout(slow); $('#btn-go').disabled = false; say(msg || 'Something went wrong. Try again.', true); }
    function crashed(e) { clearTimeout(slow); $('#btn-go').disabled = false; say('Could not reach the server: ' + e.message, true); }
    if (fast) {
      api.login(id, pw).then(function (r) {
        if (r && r.ok) return done(r);
        api.register(id, pw, name).then(function (r2) { if (r2 && r2.ok) return done(r2); failed((r && r.error) || (r2 && r2.error)); }).catch(crashed);
      }).catch(crashed);
      return;
    }
    var req = mode === 'new' ? api.register(id, pw, name) : api.login(id, pw);
    req.then(function (r) { if (!r || !r.ok) return failed(r && r.error); done(r); }).catch(crashed);
  }
  $('#btn-go').addEventListener('click', go);
  ['f-id', 'f-pw', 'f-name'].forEach(function (k) { $('#' + k).addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); }); });
  $('#f-pick').addEventListener('change', function () { say(''); if (this.value) $('#f-pw').focus(); });

  /* =====================================================================
     START
     ===================================================================== */
  function start(progress) {
    S.p = progress;
    ['stats', 'review', 'badges', 'subs', 'checks', 'mocks', 'reports', 'types'].forEach(function (k) {
      if (!S.p[k]) S.p[k] = (k === 'badges' || k === 'reports') ? [] : (k === 'stats' ? { seen: 0, correct: 0, byTag: {} } : {});
    });
    if (!S.p.tier) S.p.tier = 'B2';
    var newDay = P.touchDay(S.p);
    $('#screen-login').classList.add('hidden');
    $('#screen-app').classList.remove('hidden');
    paintHeader();
    var want = String(location.hash || '').replace('#', '');
    show(VIEWS.indexOf(want) >= 0 && want !== 'play' && want !== 'write' && want !== 'bootrun' ? want : 'plan');
    api.startSession(S.p.studentId);
    api.assignments('list').then(function (r) { S.assignments = (r && r.assignments) || []; if ($('#view-plan') && !$('#view-plan').classList.contains('hidden')) paintPlan(); });
    var earned = P.checkBadges(S.p);
    sync();
    if (newDay && S.p.streak > 1) toast('Day ' + S.p.streak + ' in a row. Keep the streak alive.');
    if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0]); }, 900);
  }
  function logout() {
    if (S.write && !confirm('You are in the middle of an essay. Leaving now will lose it. Log out anyway?')) return;
    api.endSession(S.p.studentId, S.sessItems, S.sessCorrect);
    sync().then(function () { api.clearToken(); location.reload(); });
  }
  $('#btn-out').addEventListener('click', logout);
  function flushOnExit() { if (!S.p) return; api.endSession(S.p.studentId, S.sessItems, S.sessCorrect); if (!api.flushBeacon(S.p)) sync(); }
  window.addEventListener('pagehide', flushOnExit);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && S.p && api.pendingCount()) api.flushBeacon(S.p); });

  /* ----------------------------------------------------------- header UI */
  function paintHeader() {
    var p = S.p, r = P.rank(p), g = P.gateReadiness(p);
    var ready = Math.round((g.TR + g.CC + g.LR + g.GRA) / 4);
    $('#hdr-name').textContent = p.displayName;
    $('#hdr-rank').textContent = r.name + ' · ' + P.checksCleared(p) + '/' + E.Bank.allLevels().length + ' modules · ' + (tier() === 'C1' ? 'Band 8 track' : 'Band 7 track');
    $('#hdr-ready').textContent = ready + '%';
    $('#hdr-bar').style.width = ready + '%';
    $('#hdr-streak').textContent = p.streak || 0;
    $('#hdr-xp').textContent = p.xp || 0;
    var due = P.dueReview(p).length;
    $('#nav-faults').textContent = due ? ' (' + due + ')' : '';
    var open = openAssignments().length;
    $('#nav-record').textContent = open ? ' •' : '';
  }

  /* --------------------------------------------------------------- views */
  var VIEWS = ['plan', 'map', 'play', 'bootcamp', 'bootrun', 'writer', 'write', 'template', 'lab', 'models', 'faults', 'record', 'settings', 'live'];
  function show(v) {
    clearTimeout(S.celebrateTimer);
    if (v !== 'lab' && window.Lab) window.Lab.leave();
    $('#modal-slot').innerHTML = '';
    VIEWS.forEach(function (x) { $('#view-' + x).classList.toggle('hidden', x !== v); });
    document.querySelectorAll('.nav button[data-view]').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v || (v === 'write' && b.dataset.view === 'writer') || (v === 'play' && b.dataset.view === 'map') || (v === 'bootrun' && b.dataset.view === 'bootcamp')); });
    try { if (location.hash.replace('#', '') !== v) history.replaceState(null, '', '#' + v); } catch (e) {}
    if (v === 'map') paintMap();
    if (v === 'plan') { paintPlan(); api.assignments('list').then(function (r) { var list = (r && r.assignments) || []; if (JSON.stringify(list) !== JSON.stringify(S.assignments)) { S.assignments = list; if (!$('#view-plan').classList.contains('hidden')) { paintPlan(); paintHeader(); } } }); }
    if (v === 'writer') paintWriter();
    if (v === 'template') paintTemplate();
    if (v === 'lab' && window.Lab) window.Lab.mount($('#view-lab'), window.PCHost);
    if (v === 'models') paintModels();
    if (v === 'faults') paintFaults();
    if (v === 'record') paintRecord();
    if (v === 'settings') paintSettings();
    if (v === 'live') paintLive();
    if (v === 'bootcamp') paintBootcamp();
    window.scrollTo({ top: 0 });
  }
  document.querySelectorAll('.nav button[data-view]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (S.write && !confirm('Leave the essay? Your text so far will be lost.')) return;
      if (S.write) { S.write.stop(); S.write = null; }
      if (S.boot && !confirm('Leave the mission? Points so far will be lost.')) return;
      S.boot = null;
      show(b.dataset.view);
    });
  });

  /* =====================================================================
     FLIGHT PLAN
     ===================================================================== */
  function openAssignments() {
    var mine = (S.p.cohort || '');
    var done = {}; (S.p.reports || []).forEach(function (r) { if (r.assignmentId) done[r.assignmentId] = 1; });
    return (S.assignments || []).filter(function (a) {
      if (a.studentId && a.studentId !== S.p.studentId) return false;
      if (a.cohort && a.cohort !== 'all' && !a.studentId && a.cohort !== mine) return false;
      return !done[a.id];
    });
  }
  function nextAction(p) {
    var due = P.dueReview(p);
    if (due.length >= 5) return { kind: 'faults', label: due.length + ' faults are due', sub: 'Clear them first — a question you get right twice leaves the list for good.' };
    var open = openAssignments();
    if (open.length) return { kind: 'assign', id: open[0].id, label: open[0].title || 'From your teacher', sub: open[0].note || 'Set by T.Chris — open the Writer to start.' };
    for (var i = 0; i < C.TOPICS.length; i++) {
      var t = C.TOPICS[i], lv = t.levels[0];
      for (var j = 0; j < lv.subs.length; j++) {
        var s = lv.subs[j], rec = p.subs[s.id];
        if (!rec || rec.best < E.PASS_SUB) return { kind: 'sub', id: s.id, t: t, label: t.code + ' · ' + s.name, sub: t.name + ' — ' + (rec ? 'run it again to clear it' : 'not started') };
      }
      var ck = p.checks[lv.check.id];
      if (!ck || ck.best < E.PASS_CHECK) return { kind: 'check', id: lv.id, t: t, label: t.code + ' · Systems check', sub: 'Clear the check to turn ' + t.name + ' green.' };
    }
    return null;
  }
  function paintPlan() {
    var p = S.p, g = P.gateReadiness(p), next = nextAction(p);
    var html = '';
    if (next) {
      html += '<button class="resume" id="resume">' + (next.t ? E.artBand(next.t.art, 'resume-art') : E.artBand('sim', 'resume-art')) +
        '<span class="resume-t"><span class="kicker">' + (next.kind === 'check' ? 'Next systems check' : next.kind === 'assign' ? 'From your teacher' : next.kind === 'faults' ? 'Fault list' : 'Pick up where you left off') + '</span>' +
        '<span class="resume-n">' + esc(next.label) + '</span><span class="resume-s">' + esc(next.sub) + '</span></span><span class="resume-go">Start →</span></button>';
    } else {
      html += '<div class="resume done"><span class="resume-t"><span class="kicker">Every module green</span><span class="resume-n">Mission Director</span><span class="resume-s">Nothing is outstanding. Fly a mock on the clock to push the band higher.</span></span></div>';
    }
    var GATE_NOTE = { TR: 'Position, parts, mechanism, example, nuance', CC: 'Paragraphs, one idea each, reference not linkers', LR: 'Precise collocation, no clichés, formal', GRA: 'Noun phrases, controlled swaps, error-free' };
    html += '<div class="gates">' + ['TR', 'CC', 'LR', 'GRA'].map(function (k) {
      return '<div class="gate"><span>' + k + ' · ' + ({ TR: 'Task Response', CC: 'Coherence & Cohesion', LR: 'Lexical Resource', GRA: 'Grammar' })[k] + '</span><b>' + g[k] + '%</b><div class="bar-line' + (k === 'TR' ? ' gold' : '') + '"><span style="width:' + g[k] + '%"></span></div><small>' + GATE_NOTE[k] + '</small></div>';
    }).join('') + '</div>';

    var open = openAssignments();
    open.forEach(function (a) {
      var pr = PR.get(a.promptId);
      html += '<div class="assign"><p class="kicker">Assignment from T.Chris' + (a.due ? ' · due ' + esc(a.due) : '') + '</p><h3>' + esc(a.title || (pr ? pr.title : 'Task 2 essay')) + '</h3>' +
        '<p>' + esc(a.note || (pr ? typeName(pr.type) + ' · ' + PR.domainName(pr.domain) + ' · ' + (a.timed === false ? 'untimed' : (a.minutes || 40) + ' minutes') + ' · ' + (a.uiMode || 'guided') + ' mode' : '')) + '</p>' +
        '<div><button class="btn primary" data-assign="' + esc(a.id) + '">Start the essay →</button></div></div>';
    });

    html += '<div class="card" style="padding:14px 16px;margin-bottom:16px"><div class="sect-h" style="margin-bottom:6px"><div><h2 style="font-size:1.05rem">Pre-flight check — the last five minutes</h2><p>Run these ten checks before you submit any essay. Bootcamp drills them; the Writer runs them for you.</p></div><button class="btn sm" id="plan-boot">Open Bootcamp →</button></div><ol class="bc-list">' + window.Bootcamp.CHECKLIST.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol></div>';
    html += '<div class="sect-h"><div><h2>Fourteen modules</h2><p>' + esc(P.rank(p).note) + '</p></div><span class="pill on">' + P.checksCleared(p) + ' of ' + C.TOPICS.length + ' green</span></div>';
    html += '<div class="plan-grid">';
    C.TOPICS.forEach(function (t) {
      var lv = t.levels[0], tp = P.topicPct(p, t), ck = p.checks[lv.check.id], green = ck && ck.best >= E.PASS_CHECK;
      html += '<div class="step' + (green ? ' done' : '') + '"><div class="step-h"><span class="step-n">' + t.n + '</span><span class="step-t"><span class="step-name">' + esc(t.name) + '</span><span class="step-s">' + esc(t.blurb) + '</span></span><span class="step-pct' + (green ? ' good' : '') + '">' + tp + '%</span></div>' +
        '<div class="step-b">' + lv.subs.map(function (s) {
          var rec = p.subs[s.id], done = rec && rec.best >= E.PASS_SUB;
          return '<button class="ckrow' + (done ? ' done' : '') + '" data-sub="' + s.id + '"><span class="ck-box">' + (done ? '✓' : '') + '</span><span class="ck-txt"><span class="ck-name">' + esc(s.name) + '</span><span class="ck-sub">' + esc(s.cefr) + ' · ' + s.items.length + ' questions' + (rec ? ' · best ' + pct(rec.best) + '%' : '') + '</span></span><span class="ck-go">' + (done ? 'again' : 'open') + ' →</span></button>';
        }).join('') +
        '<button class="ckrow' + (green ? ' done' : '') + '" data-check="' + lv.id + '"' + (P.checkUnlocked(p, lv) ? '' : ' disabled') + '><span class="ck-box">' + (green ? '✓' : '') + '</span><span class="ck-txt"><span class="ck-name">Systems check</span><span class="ck-sub">' + (P.checkUnlocked(p, lv) ? lv.check.items.length + ' questions · pass at 75%' : 'clear the three modules first') + (ck ? ' · best ' + pct(ck.best) + '%' : '') + '</span></span><span class="ck-go">go →</span></button>' +
        '</div></div>';
    });
    html += '</div>';
    $('#view-plan').innerHTML = html;
    var res = $('#resume');
    if (res) res.addEventListener('click', function () {
      if (next.kind === 'sub') { S.planReturn = true; openSub(next.id); }
      else if (next.kind === 'check') { S.planReturn = true; startCheck(next.id); }
      else if (next.kind === 'faults') show('faults');
      else if (next.kind === 'assign') startAssignment(next.id);
    });
    $('#view-plan').querySelectorAll('[data-sub]').forEach(function (b) { b.addEventListener('click', function () { S.planReturn = true; openSub(b.dataset.sub); }); });
    $('#view-plan').querySelectorAll('[data-check]').forEach(function (b) { b.addEventListener('click', function () { S.planReturn = true; startCheck(b.dataset.check); }); });
    $('#view-plan').querySelectorAll('[data-assign]').forEach(function (b) { b.addEventListener('click', function () { startAssignment(b.dataset.assign); }); });
    $('#plan-boot').addEventListener('click', function () { show('bootcamp'); });
  }

  /* =====================================================================
     MODULES
     ===================================================================== */
  function paintMap() {
    var p = S.p, next = nextAction(p);
    if (!S.mapPainted) { S.mapPainted = true; if (S.sysOpen === null && next && next.t) S.sysOpen = next.t.id; }
    var html = '<div class="sect-h"><div><h2>Modules</h2><p>Three sub-modules and a systems check each. Everything is open from day one; the check waits for its three sub-modules.</p></div></div>';
    html += '<div class="modes">' + Object.keys(C.TYPES).map(function (k) { return '<span class="modechip' + ((p.types || {})[k] ? ' on' : '') + '" title="' + esc(C.TYPES[k].signal) + '">' + esc(C.TYPES[k].name) + ((p.types || {})[k] ? ' ✓' : '') + '</span>'; }).join('') + '</div>';
    html += '<div class="systems">';
    C.TOPICS.forEach(function (t) {
      var lv = t.levels[0], tp = P.topicPct(p, t), ck = p.checks[lv.check.id], green = ck && ck.best >= E.PASS_CHECK, open = S.sysOpen === t.id;
      html += '<div class="sys' + (green ? ' done' : '') + (open ? ' exp' : '') + '"><button class="sys-head" data-sys="' + t.id + '">' + E.artBand(t.art, 'sys-art') +
        '<span class="sys-meta"><span class="sys-line1"><span class="sys-code">' + esc(t.code) + '</span><span class="sys-name">' + esc(t.name) + '</span><span class="pill">' + esc(t.cefr) + '</span>' + (green ? '<span class="pill good">Green</span>' : '') + '</span>' +
        '<span class="sys-blurb">' + esc(t.blurb) + '</span><span class="sys-prog"><span class="bar-line"><span style="width:' + tp + '%"></span></span><span class="sys-pct">' + tp + '%</span></span></span><span class="caret">›</span></button>';
      if (open) {
        html += '<div class="sys-body">' + lv.subs.map(function (s) {
          var rec = p.subs[s.id], done = rec && rec.best >= E.PASS_SUB;
          return '<button class="mrow' + (done ? ' done' : '') + '" data-sub="' + s.id + '"><span class="mrow-tick"></span><span class="mrow-txt"><span class="mrow-name">' + esc(s.name) + '</span><span class="mrow-sub">' + esc(s.cefr) + ' · ' + s.items.length + ' questions</span></span><span class="mrow-score">' + (rec ? pct(rec.best) + '%' : '') + '</span></button>';
        }).join('');
        var cu = P.checkUnlocked(p, lv);
        html += '<button class="mrow check' + (green ? ' done' : '') + '" data-check="' + lv.id + '"' + (cu ? '' : ' disabled') + '><span class="mrow-tick"></span><span class="mrow-txt"><span class="mrow-name">' + esc(lv.check.name) + '</span><span class="mrow-sub">' + (cu ? lv.check.items.length + ' questions · pass at 75%' : 'Clear all three sub-modules to unlock') + '</span></span><span class="mrow-score">' + (ck ? pct(ck.best) + '%' : '') + '</span></button></div>';
      }
      html += '</div>';
    });
    html += '</div>';
    $('#view-map').innerHTML = html;
    $('#view-map').querySelectorAll('[data-sys]').forEach(function (b) { b.addEventListener('click', function () { S.sysOpen = S.sysOpen === b.dataset.sys ? null : b.dataset.sys; paintMap(); }); });
    $('#view-map').querySelectorAll('[data-sub]').forEach(function (b) { b.addEventListener('click', function () { S.planReturn = false; openSub(b.dataset.sub); }); });
    $('#view-map').querySelectorAll('[data-check]').forEach(function (b) { b.addEventListener('click', function () { S.planReturn = false; startCheck(b.dataset.check); }); });
  }

  function openSub(subId) {
    var s = E.Bank.sub(subId), t = E.Bank.topic(s.topicId);
    var paras = (S.simple && s.theory.simple && s.theory.simple.length) ? s.theory.simple : s.theory.body;
    var html = '<div class="play"><div class="play-top"><button class="btn ghost sm" id="p-back">← ' + (S.planReturn ? 'Flight plan' : 'Modules') + '</button><span style="flex:1"></span><span class="qcount">' + esc(t.code) + '</span></div>' +
      '<div class="card theory">' + E.artBand(t.art) + '<p class="kicker">' + esc(s.cefr) + ' · ' + esc(t.name) + '</p><h3>' + esc(s.name) + '</h3><p class="key">' + s.theory.key + '</p>' +
      '<button class="btn sm simple-btn" id="p-simple">' + (S.simple ? 'Show the full explanation' : 'Explain this more simply') + '</button>' +
      '<div class="prose">' + paras.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>';
    if (s.theory.examples && s.theory.examples.length) html += '<div class="exlist">' + s.theory.examples.map(function (x) { return '<div><div class="s">' + x.s + '</div><div class="g">' + esc(x.g) + '</div></div>'; }).join('') + '</div>';
    html += '<button class="btn primary wide" id="p-start">Start the ' + s.items.length + ' questions →</button></div></div>';
    $('#view-play').innerHTML = html;
    show('play');
    $('#p-back').addEventListener('click', function () { show(S.planReturn ? 'plan' : 'map'); });
    $('#p-simple').addEventListener('click', function () { S.simple = !S.simple; openSub(subId); });
    $('#p-start').addEventListener('click', function () { startRun('module', s.items, { subId: subId, title: s.name }); });
  }

  /* =====================================================================
     PRACTICE RUNNER (inherited)
     ===================================================================== */
  function startRun(kind, items, meta) {
    S.run = { kind: kind, items: items.slice(), i: 0, results: [], subId: meta.subId, checkId: meta.checkId, title: meta.title, hintedAny: false, t0: 0 };
    if (kind === 'check') S.run.items = E.shuffle(S.run.items);
    show('play'); renderQ();
  }
  function startCheck(levelId) { var lv = E.Bank.level(levelId); startRun('check', lv.check.items, { checkId: lv.check.id, title: lv.check.name }); }
  var TIMED_TYPES = { choose: 1, judge: 1, spot: 1 };
  var FREE_TYPES = { thesis: 1, bodypara: 1, rewrite: 1 };

  function renderQ() {
    var r = S.run, item = r.items[r.i];
    if (r.cleanup) { r.cleanup(); r.cleanup = null; }
    var prog = Math.round(100 * r.i / r.items.length);
    var canHint = r.kind === 'module' || r.kind === 'faults';
    var timed = !!TIMED_TYPES[item.type] && !item.prompt;
    var combo = r.combo || 0;
    $('#view-play').innerHTML = '<div class="play"><div class="play-top"><button class="btn ghost sm" id="p-quit">✕</button><div class="bar-line thin"><span style="width:' + prog + '%"></span></div>' +
      (combo >= 3 ? '<span class="combo">▲ ' + combo + ' in a row</span>' : '') + '<span class="qcount">' + (r.i + 1) + ' / ' + r.items.length + '</span>' +
      (timed ? '<div class="timer" id="timer" title="Answer inside 7 seconds for a time bonus"><svg width="38" height="38" viewBox="0 0 38 38"><circle class="track" cx="19" cy="19" r="15" fill="none" stroke-width="4"></circle><circle class="run" id="timer-run" cx="19" cy="19" r="15" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="94.2" stroke-dashoffset="0"></circle></svg><b id="timer-n">7</b></div>' : '') +
      '</div><div class="card qcard"><div class="qtype"><span>' + esc(E.TYPE_LABEL[item.type] || 'Question') + '</span><span class="lv">' + esc(item.level) + '</span></div><div id="qhost"></div><div id="feedback" role="status" aria-live="polite"></div>' +
      '<div class="qfoot">' + (canHint ? '<button class="btn sm" id="p-hint">Hint</button>' : '') + '<span class="grow"></span><button class="btn primary" id="p-check" disabled>Check</button></div></div></div>';
    var host = $('#qhost');
    var view = E.mount(item, host);
    r.t0 = Date.now();
    var answered = false, tick = null;
    if (timed) {
      var ring = $('#timer-run'), num = $('#timer-n'), box = $('#timer'), CIRC = 94.2;
      tick = setInterval(function () {
        var left = Math.max(0, E.SPEED_MS - (Date.now() - r.t0));
        ring.setAttribute('stroke-dashoffset', String(CIRC * (1 - left / E.SPEED_MS)));
        if (left > 0) num.textContent = Math.ceil(left / 1000); else { box.classList.add('cold'); num.textContent = '—'; clearInterval(tick); tick = null; }
      }, 100);
    }
    function stopTimer() { if (tick) { clearInterval(tick); tick = null; } }
    host.addEventListener('respond', function () { if (!answered) $('#p-check').disabled = !view.hasResponse(); });
    $('#p-quit').addEventListener('click', function () {
      if (r.results.length && !confirm('Leave now? This attempt will not be saved.')) return;
      stopTimer(); S.run = null; show(S.planReturn ? 'plan' : 'map');
    });
    var hintBtn = $('#p-hint');
    if (hintBtn) hintBtn.addEventListener('click', function () {
      var rem = C.REMEDIATION[item.tag] || {};
      hintBtn.disabled = true; r.hintedAny = true; r.thisHinted = true;
      $('#feedback').innerHTML = '<div class="verdict" style="background:var(--gold-soft);border:1px solid var(--gold)"><div class="verdict-h" style="color:var(--gold)">' + (item.hint ? 'Hint' : 'The principle behind this one') + '</div><div class="verdict-w">' + esc(item.hint || rem.principle || '') + '</div></div>';
    });
    $('#p-check').addEventListener('click', function () {
      if (answered) return next();
      answered = true;
      var ms = Date.now() - r.t0; stopTimer();
      var out = view.check(); view.lock();
      var hinted = !!r.thisHinted; r.thisHinted = false;
      var fast = timed && !hinted && out.correct && ms <= E.SPEED_MS;
      var row = P.recordAttempt(S.p, item, out.correct, ms, hinted, fast);
      row.given = String(out.givenText).slice(0, 400); row.expected = String(out.expectedText).slice(0, 300); row.mode = r.kind;
      api.enqueue([row]);
      S.sessItems++;
      if (out.correct) { S.sessCorrect++; r.combo = (r.combo || 0) + 1; } else r.combo = 0;
      r.results.push({ item: item, correct: out.correct, given: out.givenText, expected: out.expectedText });
      var free = !!FREE_TYPES[item.type];
      $('#feedback').innerHTML = '<div class="verdict ' + (out.correct ? 'ok' : 'no') + '"><div class="verdict-h">' + (out.correct ? '✓ ' + (free ? 'Passes every rule' : 'Correct') : '✕ ' + (free ? 'Not yet' : 'Not quite')) + (fast ? '<span class="bonus-note">time bonus +' + E.XP_SPEED + '</span>' : '') + '</div>' +
        (out.correct || free ? '' : '<div class="verdict-exp">You chose: ' + esc(out.givenText) + '<br>Answer: ' + esc(out.expectedText) + '</div>') + '<div class="verdict-w">' + item.why + '</div></div>';
      if (out.correct && S.p.lastGain) { var f = E.el('span', 'xpfloat' + (fast ? '' : ' plain'), '+' + S.p.lastGain); $('.qfoot').appendChild(f); setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 1200); }
      var btn = $('#p-check'); btn.textContent = r.i + 1 >= r.items.length ? 'See your result' : 'Next →'; btn.disabled = false;
      paintHeader(); syncSoon();
      $('#feedback').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
    function next() { stopTimer(); r.i++; if (r.i >= r.items.length) finishRun(); else renderQ(); }
    function onKey(e) { if (e.key !== 'Enter' || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return; var btn = $('#p-check'); if (btn && !btn.disabled) { e.preventDefault(); btn.click(); } }
    document.addEventListener('keydown', onKey);
    r.cleanup = function () { document.removeEventListener('keydown', onKey); };
  }

  function finishRun() {
    var r = S.run;
    if (r.cleanup) { r.cleanup(); r.cleanup = null; }
    var correct = r.results.filter(function (x) { return x.correct; }).length, score = correct / r.results.length, passed, head, note;
    if (r.kind === 'module') {
      P.finishSub(S.p, r.subId, score); passed = score >= E.PASS_SUB;
      head = passed ? 'Module cleared' : 'Not yet — run it again';
      note = passed ? 'You need 60% to clear a module, and you have it. Anything you missed has gone onto your fault list and will come back.' : 'You need 60% to clear this one. Read the explanation again and retry — the misses are worth studying.';
    } else if (r.kind === 'check') {
      P.finishCheck(S.p, r.checkId, score, r.hintedAny); passed = score >= E.PASS_CHECK;
      head = score >= 1 ? 'All green. Perfect check.' : passed ? 'Systems check cleared' : 'Check held';
      note = passed ? 'That module is green. Your rank has been recalculated.' : 'You need 75% to clear a systems check. The principles you lost marks on are listed below.';
    } else { passed = true; head = 'Fault list cleared'; note = 'A question you get right twice in a row leaves the list for good.'; }
    var misses = r.results.filter(function (x) { return !x.correct; });
    var html = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + pct(score) + '"><i>' + pct(score) + '%</i></div><h3>' + esc(head) + '</h3><p>' + esc(note) + '</p>';
    if (misses.length) html += '<div class="misslist">' + misses.map(function (m) { var rem = C.REMEDIATION[m.item.tag]; return '<div class="miss"><b>' + esc(rem ? rem.name : m.item.tag) + '</b>' + m.item.why + '</div>'; }).join('') + '</div>';
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn primary" id="r-map">' + (S.planReturn ? 'Back to the flight plan' : 'Back to the modules') + '</button>' + (r.kind === 'module' || r.kind === 'check' ? '<button class="btn" id="r-again">Try again</button>' : '') + '</div></div></div>';
    $('#view-play').innerHTML = html;
    var earned = P.checkBadges(S.p);
    paintHeader(); sync();
    $('#r-map').addEventListener('click', function () { S.run = null; show(S.planReturn ? 'plan' : 'map'); });
    var again = $('#r-again');
    if (again) again.addEventListener('click', function () {
      if (r.kind === 'module') startRun('module', E.Bank.sub(r.subId).items, { subId: r.subId, title: r.title });
      else startRun('check', r.items, { checkId: r.checkId, title: r.title });
    });
    if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0], earned.slice(1)); }, 600);
  }
  function celebrate(badge, rest) {
    modal('<div class="seal">★</div><p class="kicker">Award unlocked</p><h3 style="font-size:1.4rem">' + esc(badge.name) + '</h3><p style="color:var(--ink-2);font-size:.95rem">' + esc(badge.perk) + '</p><p class="tiny">' + esc(badge.how) + '</p><button class="btn primary wide" data-close>Collect</button>');
    if (rest && rest.length) document.querySelector('[data-close]').addEventListener('click', function () { S.celebrateTimer = setTimeout(function () { celebrate(rest[0], rest.slice(1)); }, 260); });
  }

  /* =====================================================================
     THE WRITER
     ===================================================================== */
  function promptCardBtn(pr, extra, attr) {
    return '<button class="pcard' + (extra || '') + '" ' + attr + '><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(PR.domainName(pr.domain)) + '</span>' + (extra && extra.indexOf('done') >= 0 ? '' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
  }
  function paintWriter() {
    var p = S.p, done = {};
    (p.reports || []).forEach(function (r) { done[r.promptId] = (done[r.promptId] || 0) + 1; });
    var types = ['all'].concat(Object.keys(C.TYPES)), domains = ['all'].concat(Object.keys(C.DOMAINS));
    var html = '<div class="sect-h"><div><h2>Writer</h2><p>Forty minutes, one prompt, four paragraphs. Guided mode shows the frames and the matrix; Skeleton shows the slot labels only; Exam is a blank page and the clock. Marking happens in LevelUp: after you submit, send the essay across with one tap.</p></div></div>';
    html += '<div class="modechoice">' + T.FADE.map(function (f) { return '<label><input type="radio" name="uim" value="' + f.id + '"' + (S.uiMode === f.id ? ' checked' : '') + '> ' + esc(f.name) + ' — ' + esc(f.blurb) + '</label>'; }).join('') + '</div>';
    html += '<div class="filters" id="f-type">' + types.map(function (t) { return '<button data-t="' + t + '"' + (S.filters.type === t ? ' class="on"' : '') + '>' + (t === 'all' ? 'All types' : esc(typeName(t))) + '</button>'; }).join('') + '</div>';
    html += '<div class="filters" id="f-domain">' + domains.map(function (d) { return '<button data-d="' + d + '"' + (S.filters.domain === d ? ' class="on"' : '') + '>' + (d === 'all' ? 'All domains' : esc(C.DOMAINS[d])) + '</button>'; }).join('') + '</div>';
    var list = C.PROMPTS.filter(function (pr) { return (S.filters.type === 'all' || pr.type === S.filters.type) && (S.filters.domain === 'all' || pr.domain === S.filters.domain); });
    html += '<div class="promptgrid">' + list.map(function (pr) {
      return '<button class="pcard' + (done[pr.id] ? ' done' : '') + '" data-p="' + pr.id + '"><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(PR.domainName(pr.domain)) + '</span>' + (done[pr.id] ? '<span class="pill good">written ' + done[pr.id] + '×</span>' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
    }).join('') + '</div>';
    html += '<p style="margin:14px 0"><button class="btn sm" id="w-live">Join a live mission (class game) →</button></p>';
    html += '<div class="sect-h" style="margin-top:26px"><div><h2>Mocks</h2><p>Exam mode, forty minutes, marked by your teacher. Fly one when every module you need is green.</p></div></div>';
    html += '<div class="promptgrid">' + C.MOCKS.map(function (m) {
      var pr = PR.get(m.promptId), rec = (p.mocks || {})[m.id];
      return '<button class="pcard' + (rec ? ' done' : '') + '" data-mock="' + m.id + '"><span class="pcard-t">' + esc(m.name) + '</span><span class="pcard-m"><span class="pill">' + (pr ? esc(typeName(pr.type)) : '') + '</span><span class="pill gold">' + m.minutes + ' min</span><span class="pill">' + m.level + '</span>' + (rec ? '<span class="pill good">flown</span>' : '') + '</span><span class="pcard-r">' + esc(m.blurb) + '</span></button>';
    }).join('') + '</div>';
    $('#view-writer').innerHTML = html;
    $('#w-live').addEventListener('click', function () { show('live'); });
    $('#view-writer').querySelectorAll('input[name=uim]').forEach(function (r) { r.addEventListener('change', function () { S.uiMode = r.value; }); });
    $('#f-type').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { S.filters.type = b.dataset.t; paintWriter(); }); });
    $('#f-domain').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { S.filters.domain = b.dataset.d; paintWriter(); }); });
    $('#view-writer').querySelectorAll('[data-p]').forEach(function (b) { b.addEventListener('click', function () { startWrite({ promptId: b.dataset.p, uiMode: S.uiMode, minutes: 40, kind: 'practice' }); }); });
    $('#view-writer').querySelectorAll('[data-mock]').forEach(function (b) { b.addEventListener('click', function () {
      var m = C.MOCKS.filter(function (x) { return x.id === b.dataset.mock; })[0];
      modal('<p class="kicker">Before you start</p><h3 style="font-size:1.25rem">' + esc(m.name) + '</h3><p style="color:var(--ink-2);font-size:.93rem">' + m.minutes + ' minutes, exam mode, no frames, no matrix. The clock runs from the moment you press start and the essay submits itself when time is up.</p><button class="btn primary wide" id="mock-start">Start the clock</button><button class="btn ghost wide" data-close>Not now</button>');
      $('#mock-start').addEventListener('click', function () { $('#modal-slot').innerHTML = ''; startWrite({ promptId: m.promptId, uiMode: 'exam', minutes: m.minutes, kind: 'mock', mockId: m.id }); });
    }); });
  }
  function startAssignment(id) {
    var a = (S.assignments || []).filter(function (x) { return x.id === id; })[0];
    if (!a) return;
    startWrite({ promptId: a.promptId, uiMode: a.uiMode || 'guided', minutes: a.timed === false ? 90 : (a.minutes || 40), kind: 'assignment', assignmentId: a.id });
  }
  function startWrite(cfg) {
    var host = $('#view-write');
    show('write');
    S.write = W.mount(host, { prompt: cfg.promptId, mode: cfg.uiMode, minutes: cfg.minutes, tier: tier(), studentId: S.p.studentId,
      onQuit: function () { S.write = null; show('writer'); },
      onSubmit: function (res) { S.write = null; submitReport(cfg, res); } });
  }
  /* Hand the essay to LevelUp English. Same origin (pegasus028.github.io), so
     localStorage is shared; the URL hash carries a copy for safety. */
  function handoff(pr, text, rep) {
    var payload = { source: 'position-control', ts: new Date().toISOString(), studentId: S.p.studentId, name: S.p.displayName, cohort: S.p.cohort || '', promptId: pr.id, prompt: pr.text, essay: text, reportId: rep ? rep.id : '' };
    try { localStorage.setItem('lue_handoff', JSON.stringify(payload)); } catch (e) {}
    var packed = '';
    try { packed = btoa(unescape(encodeURIComponent(JSON.stringify({ prompt: pr.text, essay: text, name: S.p.displayName })))); } catch (e) {}
    var url = LEVELUP + (LEVELUP.indexOf('?') >= 0 ? '&' : '?') + 'from=pc' + (packed ? '#pc=' + packed : '');
    var w = window.open(url, '_blank');
    if (!w) toast('Pop-up blocked — allow pop-ups for this site, or copy the essay and paste it into LevelUp.');
  }
  function submitReport(cfg, res) {
    var p = S.p, pr = PR.get(cfg.promptId) || {};
    var rep = { id: uid('R'), studentId: p.studentId, name: p.displayName, cohort: p.cohort || '', ts: new Date().toISOString(),
      promptId: cfg.promptId, type: pr.type, tier: res.tier, kind: cfg.kind, mockId: cfg.mockId || '', assignmentId: cfg.assignmentId || '', uiMode: cfg.uiMode,
      text: res.text, words: res.words, seconds: res.seconds, timedOut: res.timedOut, revision: res.revision, firstText: res.firstText,
      preflight: { bad: res.preflight.bad, warn: res.preflight.warn, ratio: res.preflight.ratio, rows: res.preflight.rows.map(function (r) { return { id: r.id, status: r.status, label: r.label, tag: r.tag }; }) },
      plan: res.plan, promptDesc: pr.text, status: 'submitted', released: false };
    P.recordReport(p, rep);
    api.submitReport(rep).then(function (r) { if (!r || !r.ok) toast('Saved on this device; it will reach the class sheet when the connection is back.'); });
    var earned = P.checkBadges(p);
    paintHeader(); sync();
    var html = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + (res.preflight.bad ? 40 : res.preflight.warn ? 75 : 100) + '"><i>' + res.words + '<small style="font-size:.9rem">w</small></i></div>' +
      '<h3>' + (res.timedOut ? 'Time — essay submitted' : 'Essay submitted') + '</h3><p>' + esc(res.preflight.summary) + ' Written in ' + mmss(res.seconds) + '. ' + (cfg.kind === 'mock' ? 'Your teacher will mark this one.' : 'It has gone to your teacher. For an AI band estimate and an upgraded version, send it to LevelUp.') + '</p>' +
      '<div class="misslist">' + res.preflight.rows.filter(function (r) { return r.status !== 'ok'; }).map(function (r) { return '<div class="miss"><b>' + esc(r.label) + '</b>' + esc(r.note) + '</div>'; }).join('') + '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn primary" id="w-levelup">Send to LevelUp for marking →</button><button class="btn" id="w-copy">Copy essay</button><button class="btn" id="w-record">See my record</button><button class="btn ghost" id="w-another">Write another</button></div></div></div>';
    $('#view-write').innerHTML = html;
    $('#w-levelup').addEventListener('click', function () { handoff(pr, res.text, rep); });
    $('#w-copy').addEventListener('click', function () { try { navigator.clipboard.writeText(res.text); toast('Essay copied.'); } catch (e) { prompt('Copy your essay', res.text); } });
    $('#w-record').addEventListener('click', function () { show('record'); });
    $('#w-another').addEventListener('click', function () { show('writer'); });
    if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0], earned.slice(1)); }, 600);
  }

  /* =====================================================================
     TEMPLATE WORKSHOP
     ===================================================================== */
  function paintTemplate() {
    var tr = tier(), my = T.load(S.p.studentId); if (!my.choice) my.choice = {}; if (!my.custom) my.custom = {};
    var paras = T.paragraphs(tr, S.tplType), labels = T.labels(S.tplType);
    var html = '<div class="sect-h"><div><h2>My template</h2><p>The eleven variables slot into four frames. Choose an opener for each paragraph and edit it into your own words — that version follows you into the Writer. Frames are scaffolding: the marks are inside the variables.</p></div><span class="pill on">' + esc(T.TIERS[tr].name) + '</span></div>';
    html += '<div class="filters">' + Object.keys(C.TYPES).map(function (k) { return '<button data-tt="' + k + '"' + (S.tplType === k ? ' class="on"' : '') + '>' + esc(C.TYPES[k].name) + '</button>'; }).join('') + '</div>';
    html += '<div class="card" style="padding:14px 16px;margin-bottom:14px"><p class="kicker">The eleven variables · ' + esc(typeName(S.tplType)) + '</p><ol class="bc-list">' + C.VARIABLES.map(function (v) { return '<li><b>' + esc(labels[v.key]) + '</b> — ' + esc(v.hint) + '</li>'; }).join('') + '</ol></div>';
    paras.forEach(function (pg) {
      var chosen = my.choice[pg.key] || pg.frames[0].id, fr = pg.frames.filter(function (f) { return f.id === chosen; })[0] || pg.frames[0];
      html += '<div class="card" style="padding:14px 16px;margin-bottom:12px"><div class="wr-boxh"><b>' + esc(pg.name) + '</b><span class="tiny">~' + pg.target + ' words</span><select class="wr-frame-pick" data-tpick="' + pg.key + '">' + pg.frames.map(function (f) { return '<option value="' + f.id + '"' + (f.id === fr.id ? ' selected' : '') + '>' + esc(f.name) + '</option>'; }).join('') + '</select></div>' +
        '<div class="frame-view">' + T.fill(fr.text, {}, { html: true, labels: labels }) + '</div>' +
        '<textarea class="wr-frame" data-tframe="' + pg.key + '" rows="4" spellcheck="false" placeholder="Your own version of this frame, keeping the {slots}">' + esc(my.custom[pg.key] || '') + '</textarea>' +
        '<p class="tiny">Keep the slot names in braces: ' + T.tokens(fr.text).map(function (k) { return '{' + k + '}'; }).join(' ') + '. Leave the box empty to use the frame as written.</p></div>';
    });
    html += '<div class="card" style="padding:14px 16px;margin-bottom:12px"><p class="kicker">Structural swaps · one per body paragraph at most</p>' + T.SWAPS.map(function (s) { return '<div class="swap"><b>' + esc(s.name) + '</b> <span class="tiny">(' + esc(s.move) + ' sentence)</span><div class="diffpara"><b>Base</b>' + T.fill(s.base, {}, { html: true, labels: labels }) + '</div>' + s.variants.map(function (v) { return '<div class="diffpara" style="background:var(--ok-soft)"><b>Swap</b>' + T.fill(v, {}, { html: true, labels: labels }) + '</div>'; }).join('') + '<p class="tiny">' + esc(s.note) + '</p></div>'; }).join('') + '</div>';
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="tpl-reset">Reset my template</button><span class="tiny" style="align-self:center">Tier is set in Settings.</span></div>';
    $('#view-template').innerHTML = html;
    $('#view-template').querySelectorAll('[data-tt]').forEach(function (b) { b.addEventListener('click', function () { S.tplType = b.dataset.tt; paintTemplate(); }); });
    $('#view-template').querySelectorAll('[data-tpick]').forEach(function (sel) { sel.addEventListener('change', function () { my.choice[sel.dataset.tpick] = sel.value; delete my.custom[sel.dataset.tpick]; T.save(S.p.studentId, my); paintTemplate(); }); });
    $('#view-template').querySelectorAll('[data-tframe]').forEach(function (ta) { ta.addEventListener('input', function () { if (ta.value.trim()) my.custom[ta.dataset.tframe] = ta.value; else delete my.custom[ta.dataset.tframe]; T.save(S.p.studentId, my); }); });
    $('#tpl-reset').addEventListener('click', function () { if (confirm('Reset your template choices and edits?')) { T.save(S.p.studentId, { tier: tr, choice: {}, custom: {} }); paintTemplate(); } });
  }

  /* =====================================================================
     MODELS
     ===================================================================== */
  function markup(text) {
    return esc(text).replace(new RegExp(W.LEX.NUANCE.source, 'gi'), '<span class="cmp">$&</span>')
      .replace(new RegExp(W.LEX.REFERENCE.source, 'gi'), '<span class="num">$&</span>');
  }
  var ROLES = ['intro', 'bodyA', 'bodyB', 'conclusion'];
  var ROLE_NAME = { intro: 'Introduction', bodyA: 'Body A', bodyB: 'Body B', conclusion: 'Conclusion' };
  function paintModels() {
    var html = '<div class="sect-h"><div><h2>Model essays</h2><p>Read one, then dissect it: find the four paragraphs, the position, the nuance and the reference words. Then rebuild it from the prompt with the model hidden.</p></div></div>';
    if (!S.modelOpen) {
      html += '<div class="mgrid">' + C.MODELS.map(function (m) {
        var pr = PR.get(m.promptId) || {};
        return '<button class="pcard" data-m="' + m.id + '"><span class="pcard-t">' + esc(m.title || pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">Band ' + esc(m.band) + '</span><span class="pill">' + m.words + ' words</span>' + (m.contrast ? '<span class="pill bad">+ Band ' + esc(m.contrast.band) + ' contrast</span>' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
      }).join('') + '</div>';
      $('#view-models').innerHTML = html;
      $('#view-models').querySelectorAll('[data-m]').forEach(function (b) { b.addEventListener('click', function () { S.modelOpen = b.dataset.m; S.modelMode = 'read'; paintModels(); }); });
      return;
    }
    var m = C.MODELS.filter(function (x) { return x.id === S.modelOpen; })[0], pr = PR.get(m.promptId);
    html += '<div class="play-top"><button class="btn ghost sm" id="m-back">← All models</button><span style="flex:1"></span>' +
      ['read', 'dissect', 'rebuild'].concat(m.contrast ? ['contrast'] : []).map(function (k) { return '<button class="btn sm' + (S.modelMode === k ? ' primary' : '') + '" data-mm="' + k + '">' + k.charAt(0).toUpperCase() + k.slice(1) + '</button>'; }).join('') + '</div>';
    html += PR.card(pr, { compact: true });
    var paras = S.modelMode === 'contrast' ? m.contrast.paragraphs : m.paragraphs;
    if (S.modelMode === 'read' || S.modelMode === 'contrast') {
      html += '<div class="model">' + paras.map(function (pg) { return '<div class="mpara ' + pg.role + '"><span class="role">' + esc(ROLE_NAME[pg.role] || pg.role) + '</span>' + esc(pg.text) + '</div>'; }).join('');
      if (S.modelMode === 'read') html += '<div class="patterns">' + (m.patterns || []).map(function (x) { return '<span class="pill gold">' + esc(x) + '</span>'; }).join('') + '<span class="pill">' + m.words + ' words</span><span class="pill">Band ' + esc(m.band) + '</span></div><ul class="notes">' + (m.notes || []).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' + (m.vars ? '<p class="kicker" style="margin-top:12px">The eleven variables behind it</p><ol class="bc-list">' + C.VARIABLES.map(function (v) { return m.vars[v.key] ? '<li><b>' + esc(v.name) + '</b> — ' + esc(m.vars[v.key]) + '</li>' : ''; }).join('') + '</ol>' : '');
      else html += '<p class="kicker" style="margin-top:12px">Why this is Band ' + esc(m.contrast.band) + '</p><ul class="notes">' + m.contrast.faults.map(function (f) { var rem = C.REMEDIATION[f.tag] || {}; return '<li><b>' + esc(rem.name || f.tag) + '</b> — ' + esc(f.note) + '</li>'; }).join('') + '</ul>';
      html += '</div>';
    } else if (S.modelMode === 'dissect') {
      html += '<div class="model"><p class="tiny" style="margin-bottom:10px">Tap the role of each paragraph. Nuance words are underlined; reference words are highlighted.</p>' + paras.map(function (pg, i) {
        return '<div class="mpara hide" data-i="' + i + '"><span class="role">' + esc(ROLE_NAME[pg.role] || pg.role) + '</span>' + markup(pg.text) + '<div class="rolepick">' + ROLES.map(function (r) { return '<button data-role="' + r + '" data-i="' + i + '">' + esc(ROLE_NAME[r]) + '</button>'; }).join('') + '</div></div>';
      }).join('') + '<p class="tiny" id="m-score"></p></div>';
    } else if (S.modelMode === 'rebuild') {
      html += '<div class="model"><p class="tiny" style="margin-bottom:10px">The model is hidden. Write the four paragraphs from the prompt, then compare.</p><div class="rebuild-grid"><div>' +
        ROLES.map(function (r, i) { return '<div class="wr-box"><div class="wr-boxh"><b>' + esc(ROLE_NAME[r]) + '</b></div><textarea id="rb' + i + '" rows="' + (i === 0 || i === 3 ? 3 : 6) + '" spellcheck="false"></textarea></div>'; }).join('') +
        '<button class="btn primary wide" id="rb-go">Compare with the model</button></div><div id="rb-out"></div></div></div>';
    }
    $('#view-models').innerHTML = html;
    $('#m-back').addEventListener('click', function () { S.modelOpen = null; paintModels(); });
    $('#view-models').querySelectorAll('[data-mm]').forEach(function (b) { b.addEventListener('click', function () { S.modelMode = b.dataset.mm; paintModels(); }); });
    if (S.modelMode === 'dissect') {
      var right = 0, tries = 0;
      $('#view-models').querySelectorAll('[data-role]').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.dataset.i, box = $('#view-models').querySelector('.mpara[data-i="' + i + '"]');
          if (!box.classList.contains('hide')) return;
          tries++;
          var ok = paras[i].role === b.dataset.role;
          b.classList.add(ok ? 'right' : 'wrong');
          if (ok) { right++; box.classList.remove('hide'); box.classList.add(paras[i].role); }
          $('#m-score').textContent = right + ' of ' + paras.length + ' paragraphs identified' + (tries > right ? ' (' + (tries - right) + ' wrong taps)' : '') + '.';
        });
      });
    }
    if (S.modelMode === 'rebuild') {
      $('#rb-go').addEventListener('click', function () {
        var mine = [0, 1, 2, 3].map(function (i) { return $('#rb' + i).value.trim(); });
        var pre = W.preflight(mine.filter(Boolean).join('\n\n'), pr);
        $('#rb-out').innerHTML = paras.map(function (pg, i) { return '<div class="diffpara"><b>Yours · ' + esc(ROLE_NAME[pg.role] || pg.role) + '</b>' + esc(mine[i] || '—') + '</div><div class="diffpara" style="background:var(--ok-soft)"><b>Model · ' + esc(ROLE_NAME[pg.role] || pg.role) + '</b>' + esc(pg.text) + '</div>'; }).join('') +
          '<div class="card preflight"><div class="pf-h"><b>Pre-flight on your version</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' + pre.rows.filter(function (r) { return r.status !== 'ok'; }).map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') + '</div>';
      });
    }
  }

  /* =====================================================================
     FAULT LIST
     ===================================================================== */
  function paintFaults() {
    var due = P.dueReview(S.p), all = Object.keys(S.p.review).filter(function (id) { return E.Bank.item(id); });
    var html = '<div class="sect-h"><div><h2>Fault list</h2><p>Every question you get wrong is logged here and comes back a day or two later. Get one right twice in a row and it clears for good. The gap is the point.</p></div></div>';
    if (!all.length) html += '<div class="card empty">Nothing logged. Every question you have answered wrong has been cleared.</div>';
    else {
      html += '<div class="card" style="padding:var(--pad);display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:14px;flex-wrap:wrap"><span class="pill' + (due.length ? ' bad' : ' good') + '">' + due.length + ' due now</span><span class="pill">' + all.length + ' on the list</span><span class="pill gold">' + (S.p.reclaimed || 0) + ' cleared</span></div>';
      var tagCount = {}; all.forEach(function (id) { var t = E.Bank.item(id).tag; tagCount[t] = (tagCount[t] || 0) + 1; });
      html += '<div style="display:flex;flex-direction:column;gap:7px">' + Object.keys(tagCount).sort(function (a, b) { return tagCount[b] - tagCount[a]; }).map(function (t) { return '<div style="display:flex;justify-content:space-between;gap:12px;font-size:.9rem"><span>' + esc((C.REMEDIATION[t] || {}).name || t) + '</span><span style="color:var(--ink-3);font-family:var(--f-mono);font-size:.82rem">' + tagCount[t] + '</span></div>'; }).join('') + '</div>';
      html += due.length ? '<button class="btn primary wide" id="fx-go">Clear ' + Math.min(due.length, 12) + ' now</button>' : '<p class="tiny">Nothing is due yet. Questions come back after a day or two.</p>';
      html += '</div>';
    }
    $('#view-faults').innerHTML = html;
    var g = $('#fx-go');
    if (g) g.addEventListener('click', function () { S.planReturn = false; startRun('faults', E.shuffle(due).slice(0, 12).map(E.Bank.item), { title: 'Fault list' }); });
  }

  /* =====================================================================
     RECORD
     ===================================================================== */
  function trajectory(reports) {
    var pts = reports.filter(function (r) { return r.bands && r.bands.overall; });
    if (pts.length < 2) return '';
    var W_ = 600, H_ = 150, padL = 34, padB = 22, padT = 10, target = tier() === 'C1' ? 8 : 7;
    var x = function (i) { return padL + (W_ - padL - 10) * i / (pts.length - 1); }, y = function (b) { return padT + (H_ - padT - padB) * (1 - (b - 4) / 5); };
    var html = '<svg class="trajectory" viewBox="0 0 ' + W_ + ' ' + H_ + '">';
    [4, 5, 6, 7, 8, 9].forEach(function (b) { html += '<line x1="' + padL + '" x2="' + (W_ - 10) + '" y1="' + y(b) + '" y2="' + y(b) + '" stroke="var(--rule-soft)"/><text x="' + (padL - 6) + '" y="' + (y(b) + 4) + '" font-size="10" text-anchor="end" fill="var(--ink-3)" font-family="var(--f-mono)">' + b + '</text>'; });
    html += '<line x1="' + padL + '" x2="' + (W_ - 10) + '" y1="' + y(target) + '" y2="' + y(target) + '" stroke="var(--gold)" stroke-dasharray="4 4"/><text x="' + (W_ - 12) + '" y="' + (y(target) - 4) + '" font-size="9" text-anchor="end" fill="var(--gold)" font-family="var(--f-mono)">target ' + target + '.0</text>';
    html += '<path d="' + pts.map(function (r, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(r.bands.overall); }).join('') + '" fill="none" stroke="var(--accent)" stroke-width="2.5"/>';
    pts.forEach(function (r, i) { html += '<circle cx="' + x(i) + '" cy="' + y(r.bands.overall) + '" r="4.5" fill="var(--accent)"><title>' + esc(typeName(r.type) + ' · ' + fmtBand(r.bands.overall)) + '</title></circle>'; });
    return html + '</svg>';
  }
  function bandsOf(rp) { return rp.released && rp.teacher && rp.teacher.bands ? rp.teacher.bands : (rp.aiVisible && rp.ai && rp.ai.bands ? rp.ai.bands : null); }
  function paintRecord() {
    var p = S.p;
    var html = '<div class="sect-h"><div><h2>Record</h2><p>Your essays, the bands your teacher gave them, and every module and award.</p></div></div>';
    html += '<div class="card" style="padding:var(--pad);margin-bottom:14px"><h3 style="margin-bottom:8px">Essays</h3><div id="rec-list" class="replist"><p class="tiny">Loading…</p></div></div>';
    html += '<div class="card" style="padding:var(--pad);margin-bottom:14px"><h3 style="margin-bottom:10px">Modules</h3><div class="sysgrid">' + C.TOPICS.map(function (t) { var lv = t.levels[0], ck = p.checks[lv.check.id], green = ck && ck.best >= E.PASS_CHECK; return '<div class="systile' + (green ? ' done' : '') + '"><b>' + esc(t.name) + '</b><span>' + esc(t.code) + ' · ' + P.topicPct(p, t) + '%</span></div>'; }).join('') + '</div></div>';
    html += '<div class="card" style="padding:var(--pad)"><h3 style="margin-bottom:10px">Awards</h3><div class="awards">' + C.BADGES.map(function (b) { var got = p.badges.indexOf(b.id) >= 0; return '<div class="award ' + (got ? 'got' : 'locked') + '"><span class="award-i">' + (got ? '★' : '·') + '</span><span><span class="award-n">' + esc(b.name) + '</span><span class="award-p">' + esc(b.perk) + '</span><span class="award-h">' + esc(b.how) + '</span></span></div>'; }).join('') + '</div></div>';
    $('#view-record').innerHTML = html;
    api.reports(p.studentId).then(function (r) {
      var reps = ((r && r.reports) || []).slice().sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
      S.reports = reps;
      var changed = false;
      reps.forEach(function (rp) { var bands = bandsOf(rp); if (bands) { var hit = P.applyBands(p, rp.id, bands); if (hit) changed = true; } });
      if (changed) { P.checkBadges(p); paintHeader(); syncSoon(); }
      var host = $('#rec-list');
      if (!reps.length) { host.innerHTML = '<p class="tiny">No essays yet. Open the Writer and fly one.</p>'; return; }
      host.innerHTML = trajectory(reps.slice().reverse().map(function (rp) { return { type: rp.type, bands: bandsOf(rp) }; })) +
        reps.map(function (rp) {
          var bands = bandsOf(rp), pr = PR.get(rp.promptId) || {};
          return '<button class="rep" data-r="' + esc(rp.id) + '"><span class="rep-t"><span class="rep-n">' + esc(pr.title || rp.promptId) + '</span><span class="rep-s">' + esc(String(rp.ts).slice(0, 10) + ' · ' + typeName(rp.type) + ' · ' + rp.words + ' words · ' + mmss(rp.seconds || 0) + ' · ' + (rp.uiMode || '') + ' · ' + (rp.kind || 'practice') + (rp.preflight ? ' · ' + rp.preflight.bad + ' red' : '')) + '</span></span><span class="rep-b">' + (bands ? fmtBand(bands.overall) : (rp.status === 'submitted' ? '…' : '—')) + '</span></button>';
        }).join('');
      host.querySelectorAll('[data-r]').forEach(function (b) { b.addEventListener('click', function () { openReport(b.dataset.r); }); });
    });
  }
  function openReport(id) {
    var rp = (S.reports || []).filter(function (x) { return x.id === id; })[0];
    if (!rp) return;
    var pr = PR.get(rp.promptId) || {};
    var mark = rp.released && rp.teacher && rp.teacher.bands ? rp.teacher : (rp.aiVisible && rp.ai ? rp.ai : null);
    var html = '<div class="play"><div class="play-top"><button class="btn ghost sm" id="rp-back">← Record</button><span style="flex:1"></span><span class="qcount">' + esc(String(rp.ts).slice(0, 10)) + '</span></div>' + PR.card(pr, { compact: true }) +
      '<div class="model">' + W.paragraphs(rp.text).map(function (t) { return '<div class="mpara">' + esc(t) + '</div>'; }).join('') + '</div>';
    if (mark) {
      var b = mark.bands;
      html += '<div class="card preflight"><div class="pf-h"><b>Marked' + (rp.released ? ' by T.Chris' : ' (estimate)') + '</b><span class="pill gold">' + (mark.cefr ? esc(mark.cefr) : '') + '</span></div><div class="bands">' +
        [['tr', 'TR'], ['cc', 'CC'], ['lr', 'LR'], ['gra', 'GRA']].map(function (k) { return '<div class="band"><b>' + fmtBand(b[k[0]] != null ? b[k[0]] : b.ta) + '</b><span>' + k[1] + '</span></div>'; }).join('') + '<div class="band overall"><b>' + fmtBand(b.overall) + '</b><span>Overall</span></div></div>' +
        (mark.comment ? '<div class="comment">' + esc(mark.comment) + '</div>' : '') +
        (mark.errors && mark.errors.length ? '<div class="errs" style="margin-top:10px">' + mark.errors.map(function (e) { var rem = C.REMEDIATION[e.tag] || {}; return '<div class="err"><b>' + esc(rem.name || e.tag) + '</b><q>' + esc(e.quote) + '</q> → ' + esc(e.fix) + '</div>'; }).join('') + '</div>' : '') + '</div>';
    } else {
      html += '<div class="card preflight"><div class="pf-h"><b>Pre-flight check at submission</b><span class="pill ' + (rp.preflight && rp.preflight.bad ? 'bad' : 'good') + '">' + (rp.preflight ? rp.preflight.bad + ' red · ' + rp.preflight.warn + ' amber' : '') + '</span></div>' + ((rp.preflight && rp.preflight.rows) || []).filter(function (r) { return r.status !== 'ok'; }).map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b></div></div>'; }).join('') + '<p class="tiny" style="margin-top:8px">Your teacher has not released a mark for this essay yet.</p></div>';
    }
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px"><button class="btn primary" id="rp-levelup">Send to LevelUp for marking →</button><button class="btn" id="rp-copy">Copy essay</button></div></div>';
    $('#view-record').innerHTML = html;
    $('#rp-back').addEventListener('click', paintRecord);
    $('#rp-levelup').addEventListener('click', function () { handoff(pr, rp.text, rp); });
    $('#rp-copy').addEventListener('click', function () { try { navigator.clipboard.writeText(rp.text); toast('Essay copied.'); } catch (e) { prompt('Copy your essay', rp.text); } });
    window.scrollTo({ top: 0 });
  }

  /* =====================================================================
     BOOTCAMP — the flight plan applied to one prompt, step by step
     ===================================================================== */
  var BC = window.Bootcamp;
  function bootState() { if (!S.p.bootcamp) S.p.bootcamp = { points: 0, missions: {} }; return S.p.bootcamp; }
  function paintBootcamp() {
    var bs = bootState(), rank = BC.rankFor(bs.points), nxt = BC.nextRank(bs.points);
    var cleared = Object.keys(bs.missions).filter(function (k) { return bs.missions[k].passed; }).length;
    var html = '<div class="sect-h"><div><h2>Bootcamp</h2><p>One prompt, the whole flight plan, one decision at a time: time, decode, the Core Topic, side A, side B, the position, the frames and the pre-flight check. Every question is a drop-down. Hints cost ' + BC.POINTS.hint + ' points; a correct second choice earns ' + BC.POINTS.second + '. Clear a mission at ' + Math.round(BC.POINTS.pass * 100) + '%.</p></div><span class="pill on">' + esc(T.TIERS[tier()].name) + '</span></div>';
    html += '<div class="gates" style="grid-template-columns:repeat(2,1fr)"><div class="gate"><span>Bootcamp rank</span><b>' + esc(rank.name) + '</b><small>' + bs.points + ' points' + (nxt ? ' · ' + (nxt.min - bs.points) + ' to ' + esc(nxt.name) : ' · top rank') + '</small><div class="bar-line gold"><span style="width:' + (nxt ? Math.round(100 * (bs.points - rank.min) / (nxt.min - rank.min)) : 100) + '%"></span></div></div><div class="gate"><span>Missions cleared</span><b>' + cleared + '</b><small>of ' + C.PROMPTS.length + ' prompts · pass at ' + Math.round(BC.POINTS.pass * 100) + '%</small></div></div>';
    html += '<div class="card" style="padding:14px 16px;margin-bottom:16px"><p class="kicker">The 10-point pre-flight check</p><ol class="bc-list">' + BC.CHECKLIST.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol></div>';
    var order = C.PROMPTS.slice().sort(function (a, b) { return Object.keys(C.TYPES).indexOf(a.type) - Object.keys(C.TYPES).indexOf(b.type) || a.title.localeCompare(b.title); });
    html += '<div class="promptgrid">' + order.map(function (pr) {
      var m = bs.missions[pr.id];
      return '<button class="pcard' + (m && m.passed ? ' done' : '') + '" data-bc="' + pr.id + '"><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(PR.domainName(pr.domain)) + '</span>' + (m ? '<span class="pill' + (m.passed ? ' good' : ' bad') + '">best ' + m.best + '%</span>' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
    }).join('') + '</div>';
    $('#view-bootcamp').innerHTML = html;
    $('#view-bootcamp').querySelectorAll('[data-bc]').forEach(function (b) { b.addEventListener('click', function () { startBootcamp(b.dataset.bc); }); });
  }
  function startBootcamp(promptId) {
    show('bootrun');
    S.boot = BC.mount($('#view-bootrun'), { prompt: promptId, tier: tier(),
      onQuit: function () { S.boot = null; show('bootcamp'); },
      onAnswer: function (a) {
        var t = S.p.stats.byTag[a.tag] || (S.p.stats.byTag[a.tag] = { a: 0, c: 0 });
        t.a++; if (a.correct) t.c++;
        S.p.stats.seen++; if (a.correct) S.p.stats.correct++;
        S.p.xp += a.gain; S.sessItems++; if (a.correct) S.sessCorrect++;
        api.enqueue([{ ts: new Date().toISOString(), studentId: S.p.studentId, itemId: 'bc-' + a.promptId + '-' + a.id, topic: 'bootcamp', level: '', type: 'choose', tag: a.tag, cefr: '', correct: a.correct ? 1 : 0, ms: 0, hinted: a.hinted ? 1 : 0, fast: 0, mode: 'bootcamp', given: a.second ? 'second choice' : 'first choice', expected: '' }]);
        paintHeader(); syncSoon();
      },
      onDone: function (res) {
        S.boot = null;
        var bs = bootState(), pctScore = Math.round(100 * res.points / res.total);
        var m = bs.missions[res.promptId] || (bs.missions[res.promptId] = { best: 0, attempts: 0 });
        m.attempts++; if (pctScore > m.best) m.best = pctScore; m.passed = m.passed || res.passed; m.at = new Date().toISOString();
        var before = BC.rankFor(bs.points).name;
        bs.points += res.points;
        var after = BC.rankFor(bs.points);
        if (res.passed) S.p.xp += 60;
        var earned = P.checkBadges(S.p);
        paintHeader(); sync();
        var pr = PR.get(res.promptId) || {};
        $('#view-bootrun').innerHTML = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + pctScore + '"><i>' + pctScore + '%</i></div><h3>' + (res.passed ? 'Mission cleared' : 'Mission held — fly it again') + '</h3><p>' + res.points + ' of ' + res.total + ' points on ' + esc(pr.title) + '. ' + (after.name !== before ? 'Promoted to ' + esc(after.name) + '!' : 'Bootcamp rank: ' + esc(after.name) + ' (' + bs.points + ' points).') + '</p>' +
          (function () { var seen = {}, miss = res.log.filter(function (l) { if (l.correct || seen[l.tag]) return false; seen[l.tag] = 1; return true; }); return miss.length ? '<div class="misslist">' + miss.map(function (l) { var rem = C.REMEDIATION[l.tag] || {}; return '<div class="miss"><b>' + esc(rem.name || l.tag) + '</b>' + esc(rem.principle || '') + '</div>'; }).join('') + '</div>' : ''; })() +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn primary" id="bc-back">Back to Bootcamp</button><button class="btn" id="bc-again">Fly it again</button><button class="btn" id="bc-write">Write this essay in the Writer</button></div></div></div>';
        $('#bc-back').addEventListener('click', function () { show('bootcamp'); });
        $('#bc-again').addEventListener('click', function () { startBootcamp(res.promptId); });
        $('#bc-write').addEventListener('click', function () { startWrite({ promptId: res.promptId, uiMode: 'guided', minutes: 40, kind: 'practice' }); });
        if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0], earned.slice(1)); }, 600);
      } });
  }

  /* =====================================================================
     LIVE MISSION (projector games)
     ===================================================================== */
  var L = { round: null, team: '', posts: 0 };
  function paintLive() {
    var html = '<div class="sect-h"><div><h2>Live mission</h2><p>Your teacher shows a prompt on the projector and a round code. Enter the code and your team name, then post your team\'s sentences.</p></div></div>';
    if (!L.round) {
      html += '<div class="card settings"><div class="field"><label for="lv-code">Round code</label><input id="lv-code" type="text" placeholder="e.g. L7K2Q" spellcheck="false" style="text-transform:uppercase"></div><div class="field"><label for="lv-team">Team name</label><input id="lv-team" type="text" placeholder="e.g. Team Blue" value="' + esc(L.team) + '"></div><div id="lv-msg" class="msg bad hidden"></div><button class="btn primary" id="lv-join">Join</button></div>';
      $('#view-live').innerHTML = html;
      $('#lv-join').addEventListener('click', function () {
        var code = $('#lv-code').value.trim().toUpperCase(), team = $('#lv-team').value.trim();
        if (!code || !team) { $('#lv-msg').classList.remove('hidden'); $('#lv-msg').textContent = 'Enter the code and a team name.'; return; }
        api.projector('list', { round: code }).then(function (r) {
          var rd = ((r && r.posts) || []).filter(function (x) { return x.kind === 'round' && x.round === code; })[0];
          if (!rd) { $('#lv-msg').classList.remove('hidden'); $('#lv-msg').textContent = 'No live round with that code. Check the projector.'; return; }
          L.round = rd; L.team = team; L.posts = 0; paintLive();
        });
      });
      return;
    }
    var pr = PR.get(L.round.promptId);
    html += '<div class="card settings"><p class="kicker">Round ' + esc(L.round.round) + ' · ' + esc(L.round.game) + ' · ' + esc(L.team) + '</p>' + PR.card(pr, { compact: true }) + '<div class="field"><label for="lv-text">Your sentence(s)</label><textarea id="lv-text" class="ftext" rows="4" spellcheck="false"></textarea></div><div style="display:flex;gap:8px"><button class="btn primary" id="lv-post">Post to the projector</button><button class="btn ghost" id="lv-leave">Leave</button></div><p class="tiny" id="lv-n">' + (L.posts ? L.posts + ' posted.' : '') + '</p></div>';
    $('#view-live').innerHTML = html;
    $('#lv-post').addEventListener('click', function () {
      var t = $('#lv-text').value.trim(); if (!t) return;
      api.projector('post', { kind: 'post', id: uid('P'), round: L.round.round, team: L.team, studentId: S.p.studentId, text: t.slice(0, 900), ts: new Date().toISOString() }).then(function () { L.posts++; $('#lv-text').value = ''; $('#lv-n').textContent = L.posts + ' posted.'; toast('Posted.'); });
    });
    $('#lv-leave').addEventListener('click', function () { L.round = null; paintLive(); });
  }

  /* =====================================================================
     SETTINGS
     ===================================================================== */
  function paintSettings() {
    var theme = document.documentElement.getAttribute('data-theme') || 'auto';
    $('#view-settings').innerHTML = '<div class="card settings">' +
      '<div class="field"><label>Track</label><div style="display:flex;gap:8px;flex-wrap:wrap">' + ['B2', 'C1'].map(function (t) { return '<button class="btn sm' + (tier() === t ? ' primary' : '') + '" data-tier-set="' + t + '">' + esc(T.TIERS[t].name) + ' (' + t + ')</button>'; }).join('') + '</div><p class="tiny">The track sets which tier of the matrix, the frames and the Bootcamp options you see. Your teacher may ask you to change it.</p></div>' +
      '<div class="field"><label>Theme</label><div style="display:flex;gap:8px;flex-wrap:wrap">' + ['auto', 'light', 'dark'].map(function (t) { return '<button class="btn sm' + (theme === t ? ' primary' : '') + '" data-theme-set="' + t + '">' + t + '</button>'; }).join('') + '</div></div>' +
      '<div class="field"><label>Explanations</label><button class="btn sm" id="s-simple">' + (S.simple ? 'Show full explanations' : 'Show simpler explanations') + '</button></div>' +
      '<div class="field"><label for="s-url">Class server address</label><input id="s-url" type="text" placeholder="https://script.google.com/macros/s/…/exec" value="' + esc(api.url || '') + '" spellcheck="false"><p class="tiny">Set by your teacher. ' + (api.pendingCount() ? api.pendingCount() + ' answers are waiting to be sent.' : 'Everything is up to date.') + '</p><button class="btn sm" id="s-save">Save address</button></div>' +
      '<div class="field"><label>Marking</label><p class="tiny">Essays are marked in LevelUp English: <a href="' + esc(LEVELUP) + '" target="_blank" rel="noopener">' + esc(LEVELUP) + '</a></p></div>' +
      '<p class="tiny">Position Control · IELTS Academic Writing Task 2 · Satriwithaya School EP · T.Chris</p></div>';
    $('#view-settings').querySelectorAll('[data-tier-set]').forEach(function (b) { b.addEventListener('click', function () { S.p.tier = b.dataset.tierSet; paintHeader(); sync(); paintSettings(); toast('Track set to ' + T.TIERS[S.p.tier].name + '.'); }); });
    $('#view-settings').querySelectorAll('[data-theme-set]').forEach(function (b) { b.addEventListener('click', function () {
      var t = b.dataset.themeSet;
      if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('pc.theme', t); } catch (e) {}
      paintSettings();
    }); });
    $('#s-simple').addEventListener('click', function () { S.simple = !S.simple; paintSettings(); });
    $('#s-save').addEventListener('click', function () { api.setUrl($('#s-url').value.trim()); toast('Saved. ' + (api.mode === 'cloud' ? 'Connected to the class server.' : 'Working on this device only.')); });
  }
  try { var th = localStorage.getItem('pc.theme'); if (th && th !== 'auto') document.documentElement.setAttribute('data-theme', th); } catch (e) {}
})();
