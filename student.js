/* ===========================================================================
   QUILLMOOR ACADEMY — student.js
   The student console: sign-in, the Map Room (story.js paints it), the
   classes, the Duelling Hall, the Scriptorium, the Spellbook, the Exemplar
   Archive, the Mending Room, the Report Card and Your Trunk. Inherits the
   practice runner and progress flow from Chart Control (Position Control).
   Marking is handed to the examiners in LevelUp English (window.PC_LEVELUP_URL).
   All ids, localStorage keys and API payloads are unchanged; only the words
   the student reads have moved to Quillmoor.
   =========================================================================== */
(function () {
  'use strict';
  var C = window.CONTENT, E = window.Engine, P = E.Progress, api = window.API, W = window.Writer, PR = window.Prompts, T = window.Template, ST = window.Story;
  var $ = function (s) { return document.querySelector(s); };
  var esc = E.esc;
  var LEVELUP = window.PC_LEVELUP_URL || 'https://pegasus028.github.io/LevelUp/';

  var S = {
    p: null, sessItems: 0, sessCorrect: 0,
    run: null, write: null, simple: false, sysOpen: null, mapPainted: false, returnTo: 'map', celebrateTimer: null,
    filters: { type: 'all', domain: 'all' }, uiMode: 'guided', reports: null, assignments: [], modelOpen: null, modelMode: 'read', tplType: 'DISCUSS'
  };
  /* Where "back" goes after a lesson or a gate: the Classes, the Map Room or the chapter page. */
  /* After a lesson opened from the Classes list, the way back is the map (T.Chris, Oct 2026). */
  /* 'write': a lesson opened from a Ten Wards row in the Scriptorium goes back to the essay (18 Oct 2026). */
  function homeView() { return { story: 'story', faults: 'faults', write: 'write' }[S.returnTo] || 'plan'; }
  function homeLabel() { return { story: 'Chapter', faults: 'Mending Room', write: 'My essay' }[S.returnTo] || 'Map Room'; }

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
  /* The Duelling Hall answer level: A2 · B1 · B2 · C1, chosen in the hall; defaults to the track. */
  var DUEL_LVLS = ['A2', 'B1', 'B2', 'C1'];
  function duelTier() { var v = S.p && S.p.duelTier; return DUEL_LVLS.indexOf(v) >= 0 ? v : tier(); }

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
  /* What the Spellbook Workshop (lab.js) and the story engine (story.js) may use from this console. */
  window.PCHost = {
    get p() { return S.p; },
    get assignments() { return openAssignments(); },
    sync: sync, syncSoon: syncSoon, toast: toast, modal: modal, esc: esc, tier: tier,
    celebrate: function (b, rest) { celebrate(b, rest); },
    paintHeader: function () { if (S.p) paintHeader(); },
    show: function (v) { show(v); },
    setReturn: function (v) { S.returnTo = v; },
    openSub: function (id) { openSub(id); },
    startCheck: function (levelId) { startCheck(levelId); },
    testOut: function (levelId) { startCheck(levelId, { testOut: true }); },
    startAssignment: function (id) { startAssignment(id); },
    podInfo: function (topicId) { var t = E.Bank.topic(topicId), md = mdOf(topicId); return t ? { has: !!t.podcast, done: !!md.done, seconds: md.seconds || 0, code: t.code, name: t.name, video: !!t.video, watched: !!md.videoOpens } : null; },
    playVid: function (topicId) { playVideo(E.Bank.topic(topicId)); },
    togglePod: function (drop, topicId) { togglePodcast(drop, E.Bank.topic(topicId)); },
    /* Your five (19 Oct 2026), read-only for lab.js and story.js: the ids in teaching order, her steps on
       one prompt { duel, essay, revised, cast }, a list split into { core:[…], extra:[…] }, and the steps line. */
    coreSet: function () { return S.p ? coreIds() : []; },
    coreSteps: function (id) { return S.p ? coreSteps(S.p, id) : null; },
    coreSplit: function (list) { var ids = S.p ? coreIds() : [], core = []; ids.forEach(function (id) { (list || []).forEach(function (pr) { if (pr.id === id) core.push(pr); }); }); return { core: core, extra: (list || []).filter(function (pr) { return ids.indexOf(pr.id) < 0 && !pr.mockOnly; }) }; },
    coreStepsHtml: function (id) { return S.p ? coreStepsHtml(coreSteps(S.p, id)) : ''; },
    /* WP10 (20 Oct 2026): the teacher's rows (challenge rows live here too) and the essay opener for the daily spell */
    orders: function () { return S.assignments || []; },
    practicePrompts: function () { return practicePrompts(); },
    explainLevel: function () { return explainLevel(); },
    startWrite: function (cfg) { startWrite(cfg); }
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
        api.register(id, pw, name).then(function (r2) { if (r2 && r2.ok) return done(r2); failed(r && r.error && !/No account/.test(r.error) ? r.error : (r2 && r2.error) || (r && r.error)); }).catch(crashed);
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
    if (!S.p.media) S.p.media = {};
    if (ST) { ST.ensure(S.p); ST.init(window.PCHost); }
    takeCoreSet(false);
    var newDay = P.touchDay(S.p);
    $('#screen-login').classList.add('hidden');
    $('#screen-app').classList.remove('hidden');
    paintHeader();
    var want = String(location.hash || '').replace('#', '');
    show(VIEWS.indexOf(want) >= 0 && want !== 'play' && want !== 'write' && want !== 'bootrun' && want !== 'story' && visibleViews().indexOf(want) >= 0 ? want : 'plan');
    api.startSession(S.p.studentId);
    api.assignments('list').then(function (r) { S.assignments = (r && r.assignments) || []; takeOrders(r); if ($('#view-plan') && !$('#view-plan').classList.contains('hidden')) paintPlan(); paintHeader(); });
    var earned = P.checkBadges(S.p);
    sync();
    if (newDay && S.p.streak > 1) toast('Day ' + S.p.streak + ' in a row. Your candles are still lit.');
    if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0]); }, 900);
  }
  /* Teacher unlocks ride in the assignments list as {kind:'unlock'} rows. */
  function takeUnlocks() { if (ST && S.p && ST.applyUnlocks(S.p, S.assignments)) syncSoon(); }
  function logout() {
    if (S.write && !confirm('You are in the middle of an essay. Leaving now will lose it. Log out anyway?')) return;
    api.endSession(S.p.studentId, S.sessItems, S.sessCorrect);
    sync().then(function () { api.clearToken(); document.documentElement.removeAttribute('data-house'); location.reload(); });
  }
  $('#btn-out').addEventListener('click', logout);
  function flushOnExit() { if (!S.p) return; api.endSession(S.p.studentId, S.sessItems, S.sessCorrect); if (!api.flushBeacon(S.p)) sync(); }
  window.addEventListener('pagehide', flushOnExit);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && S.p && api.pendingCount()) api.flushBeacon(S.p); });

  /* ----------------------------------------------------------- header UI */
  function hasBand(p) { return (Number(p.bestBand) || 0) > 0 || (p.reports || []).some(function (r) { return r.bands && Number(r.bands.overall) > 0; }); }
  function paintHeader() {
    var p = S.p, r = P.rank(p), g = P.gateReadiness(p);
    var ready = Math.round((g.TR + g.CC + g.LR + g.GRA) / 4);
    var h = ST ? ST.house(p) : null;
    $('#hdr-name').textContent = p.displayName;
    $('#hdr-rank').textContent = r.name + (h ? ' of ' + h.name : '') + ' · ' + P.checksCleared(p) + '/' + E.Bank.allLevels().length + ' classes · ' + (tier() === 'C1' ? 'Band 8 track' : 'Band 7 track');
    /* B12: until an essay has a band (teacher-released or an AI estimate) the gauge only measures
       the classes she has done, so it says so; the examiners' verdict appears with the first band. */
    var banded = hasBand(p), lbl = $('#hdr-gauge-lbl');
    if (lbl) lbl.textContent = banded ? 'The examiners\' verdict' : 'Course progress';
    var gauge = lbl && lbl.closest ? lbl.closest('.gauge') : null;
    if (gauge) gauge.title = banded ? 'Your classes and the bands on your marked essays.' : 'Classes completed. The examiners\' verdict appears when an essay is marked.';
    $('#hdr-ready').textContent = ready + '%';
    $('#hdr-bar').style.width = ready + '%';
    $('#hdr-streak').textContent = p.streak || 0;
    $('#hdr-xp').textContent = p.xp || 0;
    var due = P.dueReview(p).length;
    $('#nav-faults').textContent = due ? ' (' + due + ')' : '';
    var open = openAssignments().length;
    $('#nav-record').textContent = open ? ' •' : '';
    applyTabs();
  }
  /* Which rooms are on her map: the story engine decides (chapters reached,
     what her progress already earned, owl post, the Mending Room when it fills). */
  function visibleViews() { return ST && S.p ? ST.visibleViews(S.p, openAssignments()) : VIEWS; }
  /* Phone bottom bar: the first PRIMARY rooms that are visible stay on the bar;
     the rest sit behind More. On wider screens every tab shows as before. */
  var PRIMARY = ['plan', 'map', 'writer', 'faults', 'record', 'bootcamp', 'template', 'lab'];
  function applyTabs() {
    if (!S.p) return;
    var vis = visibleViews();
    var hasVideo = window.MEDIA && Object.keys(window.MEDIA).some(function (k) { return window.MEDIA[k] && window.MEDIA[k].video; });
    var nav = document.querySelector('.nav'), shown = [];
    nav.querySelectorAll('button[data-view]').forEach(function (b) {
      var v = b.dataset.view, hide = vis.indexOf(v) < 0 || (v === 'vids' && !hasVideo);
      b.classList.toggle('hidden', hide);
      if (!hide) shown.push(b);
    });
    var cur = (location.hash || '').replace('#', ''), curNav = NAV_OF[cur] || cur;
    var primary = PRIMARY.filter(function (v) { return shown.some(function (b) { return b.dataset.view === v; }); }).slice(0, shown.length > 5 ? 4 : 5);
    if (shown.length > 5 && primary.indexOf(curNav) < 0 && shown.some(function (b) { return b.dataset.view === curNav; })) primary[primary.length - 1] = curNav;
    shown.forEach(function (b) { b.classList.toggle('nav-overflow', shown.length > 5 && primary.indexOf(b.dataset.view) < 0); });
    var more = nav.querySelector('.nav-more');
    if (!more) {
      more = document.createElement('button'); more.className = 'nav-more'; more.type = 'button'; more.setAttribute('aria-expanded', 'false');
      more.addEventListener('click', function () { var open = nav.classList.toggle('open'); more.setAttribute('aria-expanded', String(open)); more.textContent = open ? 'Close' : 'More'; });
      nav.appendChild(more);
    }
    more.textContent = nav.classList.contains('open') ? 'Close' : 'More';
    more.classList.toggle('hidden', shown.length <= 5);
  }

  /* --------------------------------------------------------------- views */
  var VIEWS = ['plan', 'story', 'map', 'play', 'bootcamp', 'bootrun', 'writer', 'write', 'template', 'lab', 'models', 'vids', 'pods', 'faults', 'record', 'settings', 'live'];
  var NAV_OF = { write: 'writer', play: 'map', bootrun: 'bootcamp', story: 'plan' };
  function show(v) {
    clearTimeout(S.celebrateTimer);
    if (v !== 'lab' && window.Lab) window.Lab.leave();
    $('#modal-slot').innerHTML = '';
    stopAllAudio();
    lsayStop();
    VIEWS.forEach(function (x) { $('#view-' + x).classList.toggle('hidden', x !== v); });
    document.querySelectorAll('.nav button[data-view]').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v || NAV_OF[v] === b.dataset.view); });
    var navEl = document.querySelector('.nav'); if (navEl && navEl.classList.contains('open')) { navEl.classList.remove('open'); var mb = navEl.querySelector('.nav-more'); if (mb) { mb.textContent = 'More'; mb.setAttribute('aria-expanded', 'false'); } }
    try { if (location.hash.replace('#', '') !== v) history.replaceState(null, '', '#' + v); } catch (e) {}
    if (ST && S.p) ST.markVisited(v);
    applyTabs();
    if (v === 'map') paintMap();
    if (v === 'story' && ST) ST.resume();
    if (v === 'plan') { paintPlan(); api.assignments('list').then(function (r) { var list = (r && r.assignments) || []; if (JSON.stringify(list) !== JSON.stringify(S.assignments)) { S.assignments = list; takeOrders(r); if (!$('#view-plan').classList.contains('hidden')) { paintPlan(); paintHeader(); } } }); }
    if (v === 'writer') paintWriter();
    if (v === 'template') paintTemplate();
    if (v === 'lab' && window.Lab) window.Lab.mount($('#view-lab'), window.PCHost);
    if (v === 'models') paintModels();
    if (v === 'vids') paintVids();
    if (v === 'pods') paintPods();
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
      if (S.boot && !confirm('Leave the duel? Points so far will be lost.')) return;
      S.boot = null;
      S.returnTo = b.dataset.view === 'plan' ? 'plan' : 'map';
      show(b.dataset.view);
    });
  });

  /* =====================================================================
     THE MAP ROOM (story.js paints it; this console supplies the next step)
     ===================================================================== */
  function openAssignments() {
    var mine = (S.p.cohort || '');
    var done = {}; (S.p.reports || []).forEach(function (r) { if (r.assignmentId) done[r.assignmentId] = 1; });
    return (S.assignments || []).filter(function (a) {
      if (ST && ST.isUnlockRow(a)) return false;
      if (a.kind === 'coreset' || a.kind === 'challenge') return false;
      if (a.studentId && a.studentId !== S.p.studentId) return false;
      if (a.cohort && a.cohort !== 'all' && !a.studentId && a.cohort !== mine) return false;
      return !done[a.id];
    });
  }
  function nextAction(p) {
    var due = P.dueReview(p);
    if (due.length >= 5) return { kind: 'faults', kicker: 'The Mending Room', label: due.length + ' faults are waiting', sub: 'Mend them first. A question you get right twice leaves the room for good.', go: 'Mend →' };
    var open = openAssignments();
    if (open.length) return { kind: 'assign', kicker: 'Owl post', id: open[0].id, label: open[0].title || 'From T.Chris', sub: open[0].note || 'Set by T.Chris. It opens in the Scriptorium.', go: 'Open →' };
    for (var i = 0; i < C.TOPICS.length; i++) {
      var t = C.TOPICS[i], lv = t.levels[0];
      for (var j = 0; j < lv.subs.length; j++) {
        var s = lv.subs[j], rec = p.subs[s.id];
        if (!P.subPassed(p, s.id)) return { kind: 'sub', kicker: 'Next lesson', id: s.id, t: t, label: t.code + ' · ' + s.name, sub: t.name + ' — ' + (rec ? 'take it again to pass it' : 'not started'), go: 'Start →' };
      }
      var ck = p.checks[lv.check.id];
      if (!ck || ck.best < E.PASS_CHECK) return { kind: 'check', kicker: 'Next gate', id: lv.id, t: t, label: t.code + ' · the examiner\'s gate', sub: 'Pass the gate to finish ' + t.name + '.', go: 'Go →' };
    }
    return null;
  }
  /* The one next step for the Map Room: faults and owl post first, then the
     current chapter's next mission, then anything the old plan still finds. */
  function nextStep(p) {
    var due = P.dueReview(p);
    if (due.length >= 5 || openAssignments().length) return nextAction(p);
    var nm = ST ? ST.nextMission(p) : null;
    if (nm && nm.mission) {
      var m = nm.mission, i = m._info;
      /* E4: a chapter's essay mission (not the one-sentence campaign, not the mocks) is written on her five */
      if (m.kind === 'writing' && !m.thesis && !/mock/i.test(m.label || '')) {
        var cn = coreNext(p, true);
        if (cn) { cn.kicker = 'Chapter ' + nm.chapter.n + ' · Your five'; cn.label = i.label + ': ' + (PR.get(cn.promptId) || {}).title; return cn; }
      }
      var kick = { sub: 'Next lesson', check: 'Next gate', view: 'Next room', writing: m.thesis ? 'Chapter ' + nm.chapter.n : 'In the Scriptorium', event: 'Chapter ' + nm.chapter.n }[m.kind] || 'Next';
      return { kind: 'mission', chapter: nm.chapter, mission: m, kicker: kick, label: i.label, sub: i.sub, go: m.kind === 'sub' ? 'Start →' : 'Open →' };
    }
    if (nm && nm.gate) return { kind: 'gate', chapter: nm.chapter, kicker: 'Chapter ' + nm.chapter.n, label: 'Pass the gate', sub: nm.chapter.gate.intro || '', go: 'Go →' };
    /* Oct 2026: when only the 7.5 mark is missing, or every chapter is done, the path continues as
       one timed examination a week (Bangkok week, Monday to Sunday) on a prompt she has not written. */
    if (!nm || (nm.gateItem && nm.gateItem.id === 'best-band')) {
      /* E4: her five come before the weekly examination */
      var c5 = coreNext(p);
      if (c5) return c5;
      var wk = weeklyExam(p);
      if (wk) return wk;
    }
    if (nm && nm.gateItem) return { kind: 'gateitem', chapter: nm.chapter, item: nm.gateItem, kicker: 'Still needed for chapter ' + nm.chapter.n, label: nm.gateItem.label, sub: nm.gateItem.note || nm.gateItem.detail || '', go: 'Open →' };
    return nextAction(p);
  }
  function weekKey(iso) { var d = new Date(iso + 'T00:00:00Z'), day = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - day); return d.toISOString().slice(0, 10); }
  function weeklyExam(p) {
    var thisWeek = weekKey(E.today()), sent = (p.reports || []).filter(function (r) { return r.ts && weekKey(String(r.ts).slice(0, 10)) === thisWeek; }).length;
    var written = {}; (p.reports || []).forEach(function (r) { written[r.promptId] = 1; });
    var pool = practicePrompts().filter(function (pr) { return !written[pr.id]; });
    if (!pool.length) pool = practicePrompts();
    var pick = pool[Math.floor(((p.studentId || '').length + Number(thisWeek.replace(/-/g, ''))) % pool.length)];
    if (sent >= 1) return { kind: 'weekdone', kicker: 'The Examination Hall', label: 'This week\'s examination is sent', sub: 'One timed essay a week keeps the spellbook sharp. The next one opens on Monday; the Mending Room and the elective classes are open meanwhile.', go: 'Mending Room →' };
    return { kind: 'weekexam', promptId: pick.id, kicker: 'The Examination Hall', label: 'This week\'s examination: ' + (pick.title || typeName(pick.type)), sub: 'Forty minutes, a blank page and the clock, on a prompt you have not written. Then send it to the examiners.', go: 'Sit it →' };
  }
  function goNext(next) {
    if (!next) return;
    if (next.kind === 'weekexam') { startWrite({ promptId: next.promptId, uiMode: 'exam', minutes: 40, kind: 'weekly' }); return; }
    if (next.kind === 'weekdone') { show('faults'); return; }
    if (next.kind === 'core') { startWrite({ promptId: next.promptId, uiMode: S.uiMode, minutes: 40, kind: 'practice' }); return; }
    if (next.kind === 'coreduel') { startBootcamp(next.promptId); return; }
    if (next.kind === 'corerevise') { openReportById(next.reportId); return; }
    if (next.kind === 'sub') { S.returnTo = 'plan'; openSub(next.id); }
    else if (next.kind === 'check') { S.returnTo = 'plan'; startCheck(next.id); }
    else if (next.kind === 'faults') show('faults');
    else if (next.kind === 'assign') startAssignment(next.id);
    else if (next.kind === 'mission' || next.kind === 'gate') ST.open(next.chapter.n, next.kind === 'gate' ? 'ending' : undefined);
    else if (next.kind === 'gateitem') {
      var it = next.item;
      if (it.kind === 'check') { S.returnTo = 'plan'; var lv = E.Bank.level(it.id); if (lv && P.checkUnlocked(S.p, lv)) startCheck(it.id); else ST.open(next.chapter.n, 'chapter'); }
      else if (it.id === 'lab-design') show('lab');
      else if (it.id === 'essay-sent' || it.id === 'best-band') show('writer');
      else if (it.id === 'faults-under-5') show('faults');
      else ST.open(next.chapter.n, 'chapter');
    }
  }
  /* =====================================================================
     YOUR FIVE (E4, 19 Oct 2026). T.Chris's decision: the chapter path plus ONE prompt of each
     question type in the writing rooms, not all 37. S.p.coreSet = { prompts:[5 ids], by:'app'|'teacher', at }.
     Teaching order (ielts-writing-task-2 skill, Type Switch Card and LAB.TYPE_FIT): Discuss first (the
     Universal Spine fits it best, and it is the type of the cars lesson every tutee has met), then
     Advantages (also a good fit, one new demand: a verdict), Opinion (acceptable fit, adds "how far"),
     then the two hard fits: Problem (two causes and two measures) and Two-part (each question in its
     own paragraph). The default prompts have A2 and B1 duel answers, and none has an Exemplar Archive
     model or a Workshop worked example, so the five are her own work: Taxing fast food (the same
     "ban for the public good or free choice" shape as the cars prompt), Cameras in public places,
     Free public transport, Graduates without jobs and Young people leaving villages. The mock prompts
     (p-tourism, p-teen-jobs, p-teen-sleep) are never in the five. T.Chris may set other five in the
     Staff Room ({kind:'coreset'} assignment rows); every other prompt stays open as extra practice.
     ===================================================================== */
  var CORE_TYPES = ['DISCUSS', 'ADVANTAGE', 'OPINION', 'PROBLEM', 'TWOPART'];
  var CORE_DEFAULT = { DISCUSS: 'p-fast-food-tax', ADVANTAGE: 'p-cctv-everywhere', OPINION: 'p-free-transport', PROBLEM: 'p-youth-unemployment', TWOPART: 'p-rural-youth' };
  var CORE_AVOID = { 'p-tourism': 1, 'p-teen-jobs': 1, 'p-teen-sleep': 1 };
  var OWN_MIN = (P.MERITS && P.MERITS.ownMin) || 0.3;
  function lc(s) { return String(s == null ? '' : s).toLowerCase().trim(); }
  /* The prompts a student practises from (mock-only prompts never appear in these lists). */
  function practicePrompts() { return C.PROMPTS.filter(function (pr) { return !pr.mockOnly; }); }
  /* mock-only prompts live in CONTENT.MOCK_PROMPTS (Prompts.get finds them): never in her five */
  function inPractice(id) { return practicePrompts().some(function (pr) { return pr.id === id; }); }
  function coreOk(pr) { return !!(pr && !CORE_AVOID[pr.id] && !pr.mockOnly && pr.vars && pr.vars.A2 && pr.vars.B1); }
  function defaultCore() {
    var all = practicePrompts();
    return CORE_TYPES.map(function (t) {
      var want = PR.get(CORE_DEFAULT[t]);
      if (coreOk(want) && want.type === t && inPractice(want.id)) return want.id;
      var alt = all.filter(function (pr) { return pr.type === t && coreOk(pr); })[0];
      return alt ? alt.id : null;
    }).filter(Boolean);
  }
  /* The teacher's row for her: her own latest row first, else the latest one for her cohort or everyone. */
  function coreRow(p, rows) {
    var sid = lc(p.studentId), coh = lc(p.cohort), mine = null, cls = null;
    (rows || []).forEach(function (a) {
      if (!a || a.kind !== 'coreset' || !a.prompts || !a.prompts.length) return;
      if (a.studentId) { if (lc(a.studentId) === sid && (!mine || String(a.ts || '') >= String(mine.ts || ''))) mine = a; return; }
      if (!a.cohort || a.cohort === 'all' || lc(a.cohort) === coh) { if (!cls || String(a.ts || '') >= String(cls.ts || '')) cls = a; }
    });
    return mine || cls;
  }
  /* listOk: the assignments list has just loaded, so a missing teacher row really is missing. */
  function takeCoreSet(listOk) {
    var p = S.p; if (!p) return false;
    var cur = p.coreSet, row = listOk ? coreRow(p, S.assignments) : null, next = null;
    if (row) {
      var ids = row.prompts.filter(function (id, i, a) { return inPractice(id) && a.indexOf(id) === i; }).slice(0, 5);
      if (ids.length) next = { prompts: ids, by: 'teacher', at: row.ts || new Date().toISOString(), row: row.id || '' };
    }
    if (!next) {
      var curOk = cur && cur.prompts && cur.prompts.length && cur.prompts.every(inPractice);
      if (curOk && (cur.by === 'app' || !listOk)) return false;
      next = { prompts: defaultCore(), by: 'app', at: new Date().toISOString() };
    }
    if (cur && JSON.stringify(cur.prompts) === JSON.stringify(next.prompts) && cur.by === next.by && (cur.row || '') === (next.row || '')) return false;
    p.coreSet = next;
    return true;
  }
  function takeOrders(r) { takeUnlocks(); if (takeCoreSet(!!(r && r.ok !== false && r.assignments))) syncSoon(); }
  function coreIds() { var cs = S.p && S.p.coreSet; return cs && cs.prompts && cs.prompts.length ? cs.prompts.slice() : defaultCore(); }
  /* Prompts she has cast in the Spellbook Workshop: lab.js's summary (p.lab.castPrompts) when it has one,
     else the Workshop's copy in this browser (the same place story.js reads for the tournament). */
  var CAST = { at: 0, sid: '', map: {} };
  function castMap(p) {
    var lab = (p && p.lab) || {};
    if (lab.castPrompts) return lab.castPrompts;
    if (CAST.sid === p.studentId && Date.now() - CAST.at < 3000) return CAST.map;
    var map = {};
    try {
      var d = JSON.parse(localStorage.getItem('pc.lab.v1.' + lc(p.studentId)) || 'null');
      ((d && d.attempts) || []).forEach(function (a) { if (a && a.status === 'complete' && a.promptId) map[a.promptId] = (map[a.promptId] || 0) + 1; });
    } catch (e) {}
    CAST.at = Date.now(); CAST.sid = p.studentId; CAST.map = map;
    return map;
  }
  function frameOnly(r) { return r.meritWhy === 'frame' || (typeof r.ownShare === 'number' && r.ownShare < OWN_MIN); }
  /* duel ✓ (won) · essay ✓ (sent, not mostly frame) · revised ✓ (a revision sent) · cast ✓ (Workshop cast) */
  function coreSteps(p, id) {
    var reps = p.reports || [], bm = ((p.bootcamp || {}).missions || {})[id];
    /* an essay counts once one on this prompt is not mostly frame (a good revision of a frame-only essay counts too) */
    var good = reps.filter(function (r) { return r.promptId === id && r.kind !== 'mock' && !frameOnly(r); });
    /* WP14 (20 Oct 2026): an essay with no red rows needs no revision; the step is "clean" and the five move on */
    var clean = good.some(function (r) { return !r.revisionOf && Number(r.bad) === 0; });
    return { duel: !!(bm && bm.passed), essay: good.length > 0, revised: reps.some(function (r) { return r.promptId === id && !!r.revisionOf; }), clean: clean,
      cast: !!castMap(p)[id], last: good.length ? good[good.length - 1].id : '' };
  }
  function coreProgress(p) {
    var ids = coreIds(), steps = ids.map(function (id) { return coreSteps(p, id); }), cur = -1, done = 0;
    steps.forEach(function (s, i) { if (s.essay && (s.revised || s.clean)) done++; else if (cur < 0) cur = i; });
    return { ids: ids, steps: steps, done: done, current: cur, by: (p.coreSet && p.coreSet.by) || 'app' };
  }
  function coreStepsHtml(st) {
    return '<span class="core-steps">' + [['duel', 'duel'], ['essay', 'essay'], ['revised', 'revised'], ['cast', 'cast']].map(function (k) {
      var on = !!st[k[0]], lbl = k[1];
      if (k[0] === 'revised' && !st.revised && st.clean) { on = true; lbl = 'no red rows'; }
      return '<span class="core-step' + (on ? ' on' : '') + '">' + lbl + (on ? ' ✓' : '') + '</span>';
    }).join('<span class="core-dot" aria-hidden="true">·</span>') + '</span>';
  }
  /* A prompt card for the five: number, steps, and "Next" on the one to work on now (soft: all stay open). */
  function coreCard(pr, i, cp, attr, extraPill) {
    var st = cp.steps[i], now = cp.current === i, full = st.essay && (st.revised || st.clean);
    return '<button class="pcard core-card' + (full ? ' done' : '') + (now ? ' core-now' : '') + '" ' + attr + '><span class="pcard-t"><span class="core-n">' + (i + 1) + '</span>' + esc(pr.title) + '</span>' +
      '<span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(PR.domainName(pr.domain)) + '</span>' + (now ? '<span class="pill on">next</span>' : '') + (extraPill || '') + '</span>' +
      coreStepsHtml(st) + '<span class="pcard-r">' + esc(pr.text) + '</span></button>';
  }
  function coreHead(cp, room) {
    var who = cp.by === 'teacher' ? 'T.Chris chose these five for you.' : 'One prompt of each question type, simplest first.';
    var nxt = cp.current >= 0 ? ' Next: number ' + (cp.current + 1) + '.' : ' All five are written.';
    return '<div class="sect-h core-h" id="' + room + '-core"><div><h2>Your five</h2><p>' + who + ' For each one: duel it, write it, then revise your weakest row (an essay with no red rows can move on).' + nxt + '</p></div><span class="pill on">' + cp.done + ' of ' + cp.ids.length + ' done</span></div>';
  }
  function extraHead(room, n) {
    return '<div class="sect-h core-h" id="' + room + '-extra" style="margin-top:22px"><div><h2>Extra practice</h2><p>' + n + ' more prompts, all open. Write any of them whenever you like; your five come first.</p></div></div>';
  }
  /* The next of her five for the Map Room pointer: duel (when the Hall is open), write, then revise. */
  function coreNext(p, writeOnly) {
    var cp = coreProgress(p); if (cp.current < 0) return null;
    var i = cp.current, id = cp.ids[i], pr = PR.get(id) || {}, st = cp.steps[i];
    var lbl = 'Your five · ' + (i + 1) + ' of ' + cp.ids.length + ': ' + (pr.title || typeName(pr.type));
    if (!st.essay && !st.duel && !writeOnly && visibleViews().indexOf('bootcamp') >= 0) return { kind: 'coreduel', promptId: id, kicker: 'Your five', label: lbl, sub: typeName(pr.type) + '. Duel it in the Duelling Hall first: the duel plans the essay with you.', go: 'Duel →' };
    if (!st.essay) return { kind: 'core', promptId: id, kicker: 'Your five', label: lbl, sub: typeName(pr.type) + '. Write it in the Scriptorium with your spellbook, then revise your weakest row (no red rows: move on).', go: 'Write →' };
    return { kind: 'corerevise', promptId: id, reportId: st.last, kicker: 'Your five', label: lbl, sub: 'Revise your weakest row: rewrite one paragraph of this essay so it is stronger. Then number ' + (i + 2 <= cp.ids.length ? i + 2 : i + 1) + ' opens as your next step.', go: 'Revise →' };
  }
  /* Small styles for the five (index.html is shared; these live with the code that uses them). */
  (function coreStyle() {
    if (document.getElementById('core-style')) return;
    var st = document.createElement('style'); st.id = 'core-style';
    st.textContent = '.core-steps{display:flex;flex-wrap:wrap;gap:2px 6px;font-size:.8rem;color:var(--ink-3)}.core-step.on{color:var(--ok);font-weight:700}.core-dot{color:var(--ink-3)}' +
      '.core-n{display:inline-flex;align-items:center;justify-content:center;width:1.5em;height:1.5em;border-radius:50%;background:var(--accent-soft,rgba(200,160,60,.18));font-size:.85rem;margin-right:8px}' +
      '.pcard.core-now{border-color:var(--gold,#c8a03c);box-shadow:0 0 0 2px rgba(200,160,60,.25)}' +
      '.merit-note{margin:8px auto 12px;max-width:34rem;font-size:.93rem}.merit-note.none{color:var(--no,#ae3a22)}' +
      '.rev-link{display:inline-block;margin:4px 6px 0 0}';
    document.head.appendChild(st);
  })();

  /* =====================================================================
     REVISION (19 Oct 2026): "Revise your weakest row". The row is a paragraph of her essay
     (intro · bodyA · bodyB · conclusion, the Scriptorium's box keys), chosen from the Ten Wards rows
     that point at one paragraph and from how much of each paragraph is still frame.
     ===================================================================== */
  var PARA_KEYS = ['intro', 'bodyA', 'bodyB', 'conclusion'];
  var PARA_NAME = { intro: 'Introduction', bodyA: 'Body A', bodyB: 'Body B', conclusion: 'Conclusion' };
  function wardPara(row, pre) {
    var id = row.id || '', lbl = row.label || '', m = /^b(\d+)/.exec(id);
    if (m) return Number(m[1]) === 0 ? 'bodyA' : 'bodyB';
    if (id === 'position') return /restated/i.test(lbl) ? 'conclusion' : 'intro';
    if (id === 'verdict' || id === 'extent') return 'intro';
    if (id === 'newidea') return 'conclusion';
    if (id === 'twopart' || id === 'plural-s') return 'bodyB';
    if (id === 'plural-c') return 'bodyA';
    if (id === 'parts') return /no causes/i.test(lbl) ? 'bodyA' : 'bodyB';
    /* too short: the shorter body paragraph grows; too long (amber): the longer one is cut — as writer.js reads it */
    if (id === 'length') { var bw = (pre && pre.bodyWords) || [], long = row.status === 'warn'; return bw.length > 1 && (long ? bw[1] > bw[0] : bw[1] < bw[0]) ? 'bodyB' : 'bodyA'; }
    return '';
  }
  /* res: the Writer's result (or a saved report): preflight.rows and, in guided mode, plan.ownWords per box. */
  function paraScores(res) {
    var pre = res.preflight || {}, out = {}, ow = (res.plan && res.plan.ownWords) || [];
    PARA_KEYS.forEach(function (k) { out[k] = { score: 0, why: null, whyW: 0, frame: null, own: null }; });
    (pre.rows || []).forEach(function (r) {
      if (r.status === 'ok') return;
      var k = wardPara(r, pre); if (!k) return;
      var w = r.status === 'bad' ? 2 : 1;
      out[k].score += w; if (w > out[k].whyW) { out[k].why = r; out[k].whyW = w; }
    });
    PARA_KEYS.forEach(function (k, i) {
      var o = ow[i]; if (!o || !o.words) return;
      out[k].frame = o.frame / o.words; out[k].own = o.own;
      if (o.own === 0) out[k].score += 2; else if (out[k].frame > 0.6) out[k].score += 1;
    });
    return out;
  }
  /* WP14 (20 Oct 2026): the target comes from the Wards only (red rows first, then amber). When no Ward row
     points at a paragraph, the revision is for practice: the shorter body paragraph, one developed sentence more. */
  function weakestRow(res) {
    var sc = paraScores(res), best = null, pre = res.preflight || {};
    var wardKeys = ['bodyA', 'bodyB', 'intro', 'conclusion'].filter(function (k) { return !!sc[k].why; });
    wardKeys.forEach(function (k) {
      if (!best || sc[k].whyW > sc[best].whyW || (sc[k].whyW === sc[best].whyW && sc[k].score > sc[best].score)) best = k;
    });
    var practice = !best;
    if (practice) { var bw = pre.bodyWords || []; best = bw.length > 1 && bw[1] < bw[0] ? 'bodyB' : 'bodyA'; }
    var s = sc[best], why = s.why ? s.why.label : 'no Ward points at it: add one more developed sentence with your own reason or example';
    return { key: best, why: why, ward: s.why ? s.why.id : '', practice: practice, red: Number(pre.bad) > 0, base: { key: best, score: s.score, frame: s.frame, own: s.own, words: 0 } };
  }
  function paraWords(text, key) { var ps = W.paragraphs(text || ''); return W.words(ps[PARA_KEYS.indexOf(key)] || ''); }
  /* reviseRow is the weak paragraph's worst Ward row id (writer.js finds the paragraph from it; '' = any paragraph);
     reviseBox is the paragraph (box key) this console judges the improvement on. */
  function reviseCfg(rep, res, kind) {
    var wk = weakestRow(res), text = String(res.text || rep.text || '');
    wk.base.words = paraWords(text, wk.key);
    return { promptId: rep.promptId, uiMode: rep.uiMode || S.uiMode, minutes: 40, kind: 'practice', revisionOf: rep.id, reviseRow: wk.ward,
      reviseText: text, reviseVars: (res.plan && res.plan.vars) || null, reviseBox: wk.key, reviseWhy: wk.why, reviseBase: wk.base, reviseFrom: kind || 'result', revisePractice: !!wk.practice, reviseRed: !!wk.red };
  }
  /* The weak row improved: fewer Ward points against that paragraph, or its frame share fell by 10 points.
     WP14: a practice revision (no Ward pointed at the row) improves when the row grows by 15 words or more
     with no new red row against it. */
  function reviseImproved(cfg, res) {
    var b = cfg.reviseBase; if (!b || !b.key) return false;
    var now = paraScores(res)[b.key]; if (!now) return false;
    if (now.score < b.score) return true;
    if (b.frame != null && now.frame != null && b.frame - now.frame >= 0.1 - 1e-9) return true;
    if (cfg.revisePractice && now.score <= b.score) {
      return paraWords(res.text, b.key) - (b.words || 0) >= 15;
    }
    return false;
  }
  function meritNote(sum, rep) {
    var M = P.MERITS || { essay: 150, short: 60, improve: 50, revise: 80 }, why = sum && sum.meritWhy, xp = (sum && sum.merits) || 0;
    var row = PARA_NAME[rep.reviseBox] || 'paragraph', own = typeof rep.ownShare === 'number' ? Math.round(rep.ownShare * 100) : null;
    if (why === 'mock') return '+' + xp + ' merits for a mock examination.';
    if (why === 'frame') return 'No merits for this essay. Write more in your own words to earn merits: ' + (own != null ? own + '% of it is yours, and merits start at ' + Math.round(OWN_MIN * 100) + '%.' : 'most of it is still the frame.');
    if (why === 'revise-up') return '+' + xp + ' merits: your ' + row + ' is stronger than before. A better band from the examiners adds ' + M.improve + ' more.';
    if (why === 'revise-same') return 'No merits yet for this revision: by the Wards, your ' + row + ' is not stronger yet. A revision earns merits when its weak row gets stronger, or when the examiners give it a better band.';
    if (why === 'revise-again') return 'No merits: this essay has already earned its revision merits. Revise a new essay to earn more.';
    if (why === 'own-up') return '+' + xp + ' merits: ' + (rep.words >= 250 ? M.essay : M.short) + ' for the essay and ' + M.improve + ' because more of it is in your own words than last time.';
    var need = Math.max(0, 250 - (rep.words || 0));
    return '+' + xp + ' merits' + (rep.words >= 250 ? '.' : ' for a short essay (250 words earns ' + M.essay + '). You need ' + need + ' more word' + (need === 1 ? '' : 's') + ': ' + (need > 60 ? 'two' : 'one') + ' more developed sentence' + (need > 60 ? 's' : '') + ' in each body paragraph, with a reason or an example.') + ' A better band than your best ' + typeName(rep.type) + ' essay adds ' + M.improve + ' more.';
  }
  /* Open one of her saved essays on the Report Card (used by the Map Room's "Revise" pointer). */
  function openReportById(id) {
    S.openAfter = id || '';
    show('record');
  }

  /* Oct 2026: partner apps and the band ladder (data in partners.js). */
  /* The template share of the student's latest Spellbook Workshop design (lab.js keeps it). */
  /* The student's five most frequent fault families (names), for the Landing Check. */
  function topFaultTags() {
    var count = {}; Object.keys((S.p && S.p.review) || {}).forEach(function (id) { var it = E.Bank.item(id); if (it && it.tag) count[it.tag] = (count[it.tag] || 0) + 1; });
    return Object.keys(count).sort(function (a, b) { return count[b] - count[a]; }).slice(0, 5).map(function (t) { return (C.REMEDIATION[t] || {}).name || t; });
  }
  function myShare() { try { var v = T.share ? T.share(S.p.studentId) : Number(localStorage.getItem('pc.share.' + S.p.studentId)); return v ? v / 100 : null; } catch (e) { return null; } }
  function partnerLink(tag) {
    var ps = C.partnerFor ? C.partnerFor(tag) : [];
    if (!ps.length) return '';
    return ' <a class="tiny" href="' + esc(ps[0].url) + '" target="_blank" rel="noopener" title="' + esc(ps[0].use) + '">· practise in ' + esc(ps[0].name) + ' ↗</a>';
  }
  function ladderCard(p) {
    if (!C.LADDER) return '';
    var best = p.bestBand || 0, target = tier() === 'C1' ? 8 : 7;
    var rows = C.LADDER.map(function (r) {
      var b = parseFloat(String(r.band).split('–')[0]), goal = b === target;
      var apps = (r.apps || []).map(function (id) { var a = C.partner(id); return a ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.name) + ' ↗</a>' : ''; }).filter(Boolean).join(' · ');
      return '<tr' + (goal ? ' style="background:rgba(200,160,60,.12)"' : '') + '><td style="white-space:nowrap;vertical-align:top;padding:8px 10px 8px 4px;border-top:1px solid var(--line)"><b>Band ' + esc(r.band) + '</b><br><span class="pill">' + esc(r.cefr) + '</span>' + (goal ? '<br><span class="pill gold">your track</span>' : '') + '</td>' +
        '<td style="vertical-align:top;padding:8px 4px 8px 0;border-top:1px solid var(--line)"><span>' + esc(r.gate) + '</span><br><span class="tiny"><b>Language:</b> ' + esc(r.lang) + (apps ? ' · ' + apps : '') + '</span></td></tr>';
    }).join('');
    return '<div class="card" style="padding:14px 16px;margin-bottom:16px"><div class="sect-h" style="margin-bottom:6px"><div><h2 style="font-size:1.05rem">Your band ladder</h2><p>Each step with the CEFR level IELTS aligns it with: Bands 4–5 around B1, 5.5–6.5 around B2, 7–8 around C1. ' + (best ? 'Your best marked essay so far: Band ' + esc(best) + '. ' : '') + 'Your spellbook gives you the structure; the language line is what moves you up a step.</p></div></div>' +
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.9rem">' + rows + '</table></div></div>';
  }
  function partnersCard() {
    if (!C.PARTNERS) return '';
    return '<div class="card" style="padding:14px 16px;margin-bottom:16px"><div class="sect-h" style="margin-bottom:6px"><div><h2 style="font-size:1.05rem">Elective classes</h2><p>Grammar and vocabulary are taught in the elective classes outside the castle. The Mending Room points to the right one when a fault keeps coming back.</p></div></div>' +
      '<div style="display:flex;flex-direction:column;gap:8px">' + C.PARTNERS.map(function (a) {
        return '<a class="pcard" style="text-decoration:none" href="' + esc(a.url) + '" target="_blank" rel="noopener"><span class="pcard-t">' + esc(a.name) + ' ↗</span><span class="pcard-m"><span class="pill gold">' + esc(a.topic) + '</span><span class="pill">' + esc(a.format) + '</span></span><span class="pcard-r">' + esc(a.use) + '</span></a>';
      }).join('') + '</div></div>';
  }
  /* WP4 / E1 helpers for the lesson and gate rows. A gate attempt is drawn
     from its pool, so the row names the draw, not the pool. */
  function gateCount(lv) { return Math.min(E.GATE_DRAW || 8, lv.check.items.length); }
  function lessonNote(rec) {
    if (!rec) return '';
    if (rec.testedOut && !(rec.best >= E.PASS_SUB)) return ' · tested out — open any time for review';
    return rec.attempts ? ' · best ' + pct(rec.best) + '%' : '';
  }
  /* "Try the gate first": offered while the three lessons are not all passed. */
  function testOutRow(p, lv, cls) {
    if (P.checkUnlocked(p, lv)) return '';
    if (cls === 'mrow') return '<button class="mrow check testout" data-testout="' + lv.id + '"><span class="mrow-tick"></span><span class="mrow-txt"><span class="mrow-name">Try the gate first</span><span class="mrow-sub">Know this class already? ' + gateCount(lv) + ' questions · pass at 75% and the three lessons count as passed. No penalty if not.</span></span><span class="mrow-score">→</span></button>';
    return '<button class="ckrow testout" data-testout="' + lv.id + '"><span class="ck-box">?</span><span class="ck-txt"><span class="ck-name">Try the gate first</span><span class="ck-sub">Know this class already? Pass at 75% and the three lessons count as passed. No penalty if not.</span></span><span class="ck-go">try →</span></button>';
  }
  function paintPlan() {
    var p = S.p, next = nextStep(p);
    if (ST && window.STORY) {
      ST.paintMap($('#view-plan'), { next: next, assignments: openAssignments(), orders: S.assignments || [], ladderHtml: ladderCard(p), electivesHtml: partnersCard(), onResume: goNext });
      wireMedia($('#view-plan'));
      if (window.DailySpell) window.DailySpell.paint($('#spell-slot'), window.PCHost);
      paintOwlSlot($('#owl-slot'));
      return;
    }
    /* No story content loaded: a plain list of the fourteen classes. */
    var html = '';
    if (next) html += '<button class="resume" id="resume"><span class="resume-t"><span class="kicker">' + esc(next.kicker || 'Next') + '</span><span class="resume-n">' + esc(next.label) + '</span><span class="resume-s">' + esc(next.sub || '') + '</span></span><span class="resume-go">' + esc(next.go || 'Go →') + '</span></button>';
    html += ladderCard(p);
    html += '<div class="sect-h"><div><h2>Fourteen classes</h2><p>' + esc(P.rank(p).note) + '</p></div><span class="pill on">' + P.checksCleared(p) + ' of ' + C.TOPICS.length + ' passed</span></div>';
    html += '<div class="plan-grid">';
    C.TOPICS.forEach(function (t) {
      var lv = t.levels[0], tp = P.topicPct(p, t), ck = p.checks[lv.check.id], green = ck && ck.best >= E.PASS_CHECK;
      html += '<div class="step' + (green ? ' done' : '') + '"><div class="step-h"><span class="step-n">' + t.n + '</span><span class="step-t"><span class="step-name">' + esc(t.name) + '</span><span class="step-s">' + esc(t.blurb) + '</span></span><span class="step-pct' + (green ? ' good' : '') + '">' + tp + '%</span></div>' +
        '<div class="step-b"><div class="ckgroup">' + mediaDrop('plan-' + t.id) + '<div class="ckgrid">' + ckMedia(t, 'plan-' + t.id) + '<div class="ckstack">' + lv.subs.map(function (s) {
          var rec = p.subs[s.id], done = P.subPassed(p, s.id);
          return '<button class="ckrow' + (done ? ' done' : '') + '" data-sub="' + s.id + '"><span class="ck-box">' + (done ? '✓' : '') + '</span><span class="ck-txt"><span class="ck-name">' + esc(s.name) + '</span><span class="ck-sub">' + esc(s.cefr) + ' · ' + s.items.length + ' questions' + lessonNote(rec) + '</span></span><span class="ck-go">' + (done ? 'again' : 'open') + ' →</span></button>';
        }).join('') +
        '<button class="ckrow' + (green ? ' done' : '') + '" data-check="' + lv.id + '"' + (P.checkUnlocked(p, lv) ? '' : ' disabled') + '><span class="ck-box">' + (green ? '✓' : '') + '</span><span class="ck-txt"><span class="ck-name">The examiner\'s gate</span><span class="ck-sub">' + (P.checkUnlocked(p, lv) ? gateCount(lv) + ' questions · pass at 75%' : 'pass the three lessons first') + (ck ? ' · best ' + pct(ck.best) + '%' : '') + '</span></span><span class="ck-go">go →</span></button>' + testOutRow(p, lv, 'ckrow') +
        '</div></div></div>' +
        '</div></div>';
    });
    html += '</div>';
    $('#view-plan').innerHTML = html;
    var res = $('#resume');
    if (res) res.addEventListener('click', function () { goNext(next); });
    $('#view-plan').querySelectorAll('[data-sub]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'plan'; openSub(b.dataset.sub); }); });
    $('#view-plan').querySelectorAll('[data-check]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'plan'; startCheck(b.dataset.check); }); });
    $('#view-plan').querySelectorAll('[data-testout]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'plan'; startCheck(b.dataset.testout, { testOut: true }); }); });
    wireMedia($('#view-plan'));
  }

  /* =====================================================================
     MODULES
     ===================================================================== */
  function paintMap() {
    var p = S.p, next = nextAction(p);
    if (!S.mapPainted) { S.mapPainted = true; if (S.sysOpen === null && next && next.t) S.sysOpen = next.t.id; }
    var html = '<div class="sect-h"><div><h2>Classes</h2><p>Three lessons and an examiner\'s gate each. Every class is open from day one; the gate waits for its three lessons.</p></div></div>';
    html += '<div class="modes">' + Object.keys(C.TYPES).map(function (k) { return '<span class="modechip' + ((p.types || {})[k] ? ' on' : '') + '" title="' + esc(C.TYPES[k].signal) + '">' + esc(C.TYPES[k].name) + ((p.types || {})[k] ? ' ✓' : '') + '</span>'; }).join('') + '</div>';
    html += '<div class="systems">';
    C.TOPICS.forEach(function (t) {
      var lv = t.levels[0], tp = P.topicPct(p, t), ck = p.checks[lv.check.id], green = ck && ck.best >= E.PASS_CHECK, open = S.sysOpen === t.id;
      html += '<div class="sys' + (green ? ' done' : '') + (open ? ' exp' : '') + '"><button class="sys-head" data-sys="' + t.id + '">' + E.artBand(t.art, 'sys-art') +
        '<span class="sys-meta"><span class="sys-line1"><span class="sys-code">' + esc(t.code) + '</span><span class="sys-name">' + esc(t.name) + '</span><span class="pill">' + esc(t.cefr) + '</span>' + (green ? '<span class="pill good">Passed</span>' : '') + '</span>' +
        '<span class="sys-blurb">' + esc(t.blurb) + '</span><span class="sys-prog"><span class="bar-line"><span style="width:' + tp + '%"></span></span><span class="sys-pct">' + tp + '%</span></span></span><span class="caret">›</span></button>';
      html += resStrip(t);
      if (open) {
        html += '<div class="sys-body">' + podRow(t, 'row-' + t.id, 'mrow') + lv.subs.map(function (s) {
          var rec = p.subs[s.id], done = P.subPassed(p, s.id), tested = rec && rec.testedOut && !(rec.best >= E.PASS_SUB);
          return '<button class="mrow' + (done ? ' done' : '') + '" data-sub="' + s.id + '"><span class="mrow-tick"></span><span class="mrow-txt"><span class="mrow-name">' + esc(s.name) + '</span><span class="mrow-sub">' + esc(s.cefr) + ' · ' + s.items.length + ' questions' + (tested ? ' · tested out — open any time for review' : '') + '</span></span><span class="mrow-score">' + (rec && rec.attempts ? pct(rec.best) + '%' : '') + '</span></button>';
        }).join('');
        var cu = P.checkUnlocked(p, lv);
        html += '<button class="mrow check' + (green ? ' done' : '') + '" data-check="' + lv.id + '"' + (cu ? '' : ' disabled') + '><span class="mrow-tick"></span><span class="mrow-txt"><span class="mrow-name">' + esc(lv.check.name) + '</span><span class="mrow-sub">' + (cu ? gateCount(lv) + ' questions · pass at 75%' : 'Pass all three lessons to open the gate') + '</span></span><span class="mrow-score">' + (ck ? pct(ck.best) + '%' : '') + '</span></button>' + testOutRow(p, lv, 'mrow') + '</div>';
      }
      html += '</div>';
    });
    html += '</div>';
    $('#view-map').innerHTML = html;
    $('#view-map').querySelectorAll('[data-sys]').forEach(function (b) { b.addEventListener('click', function () { S.sysOpen = S.sysOpen === b.dataset.sys ? null : b.dataset.sys; paintMap(); }); });
    $('#view-map').querySelectorAll('[data-sub]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'map'; openSub(b.dataset.sub); }); });
    $('#view-map').querySelectorAll('[data-check]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'map'; startCheck(b.dataset.check); }); });
    $('#view-map').querySelectorAll('[data-testout]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'map'; startCheck(b.dataset.testout, { testOut: true }); }); });
    wireMedia($('#view-map'));
  }

  /* =====================================================================
     MODULE MEDIA — the podcast and the video for each module (media.js).
     The same players are mounted in four places: the class header on the
     Classes screen, each class card on the plain plan, each class group in
     the Mending Room, and the Memory Basin / Castle Wireless tabs. Listening is tracked on
     the progress object (p.media[moduleId]) wherever it happens, so the
     Staff Room sees who has heard what.
     ===================================================================== */
  function mediaRec(topicId) {
    if (!S.p.media) S.p.media = {};
    return S.p.media[topicId] || (S.p.media[topicId] = { plays: 0, seconds: 0, done: false });
  }
  function mdOf(topicId) { return (S.p.media || {})[topicId] || {}; }
  function ytId(url) {
    var m = String(url || '').match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : '';
  }
  function stopAllAudio() { document.querySelectorAll('audio').forEach(function (a) { try { a.pause(); } catch (e) {} }); }
  function mediaDrop(key) { return '<div class="res-drop" id="drop-' + key + '"></div>'; }

  /* The podcast row that sits before a class's lessons (Classes list). */
  function podRow(t, key, cls) {
    if (!t.podcast) return '';
    var md = mdOf(t.id);
    return '<div class="podpair"><button class="' + cls + ' podrow-btn' + (md.done ? ' done' : '') + '" data-pod="' + t.id + '" data-drop="' + key + '"><span class="mrow-tick"></span><span class="mrow-txt"><span class="mrow-name">Podcast: ' + esc(t.name) + '</span><span class="mrow-sub">Castle Wireless · listen before the lessons' + (md.done ? ' · listened' : md.seconds ? ' · ' + Math.round(md.seconds / 60) + ' min in' : '') + '</span></span><span class="mrow-score">' + (md.done ? '✓' : '♪') + '</span></button>' + vidBtn(t) + '</div>' + mediaDrop(key);
  }
  /* The Video button that sits in the same row as a podcast row (Classes, chapter missions). */
  function vidBtn(t) {
    if (!t.video) return '';
    var md = mdOf(t.id);
    return '<button class="vidbtn' + (md.videoOpens ? ' done' : '') + '" type="button" data-vid="' + t.id + '" title="' + esc(t.name) + ' — in the Memory Basin"><span class="res-i">▶</span><span>Video</span></button>';
  }
  /* The pill strip under a class header on the Classes screen. */
  function resStrip(t) {
    var md = mdOf(t.id), lv = t.levels[0];
    var doneSubs = P.subsDone ? P.subsDone(S.p, lv) : lv.subs.filter(function (sb) { var r = S.p.subs[sb.id]; return r && r.best >= E.PASS_SUB; }).length;
    var h = '<div class="sys-res">';
    if (t.podcast) h += '<button class="res' + (md.done ? ' done' : '') + '" data-pod="' + t.id + '" data-drop="map-' + t.id + '"><span class="res-i">' + (md.done ? '✓' : '♪') + '</span>Podcast' +
      (!md.done && md.seconds ? '<span class="res-x">' + Math.round(md.seconds / 60) + 'm in</span>' : '') + '</button>';
    if (t.video) h += '<button class="res' + (md.videoOpens ? ' done' : '') + '" data-vid="' + t.id + '"><span class="res-i">▶</span>Video</button>';
    h += '<button class="res go' + (doneSubs === lv.subs.length ? ' done' : '') + '" data-sysopen="' + t.id + '"><span class="res-i">' + (doneSubs === lv.subs.length ? '✓' : '▤') + '</span>Lessons<span class="res-x">' + doneSubs + ' of ' + lv.subs.length + '</span></button>';
    return h + mediaDrop('map-' + t.id) + '</div>';
  }
  /* The tall buttons beside a checklist group (plain plan, Mending Room). */
  function ckMedia(t, key) {
    if (!t.podcast && !t.video) return '';
    var md = mdOf(t.id), h = '<div class="ckmedia">';
    if (t.podcast) h += '<button class="ckpod' + (md.done ? ' done' : '') + '" data-pod="' + t.id + '" data-drop="' + key + '" title="' + esc(t.name) + ' — on the wireless"><span class="res-i">' + (md.done ? '✓' : '♪') + '</span><span class="ckpod-l">Podcast</span></button>';
    if (t.video) h += '<button class="ckpod' + (md.videoOpens ? ' done' : '') + '" data-vid="' + t.id + '" title="' + esc(t.name) + ' — in the Memory Basin"><span class="res-i">▶</span><span class="ckpod-l">Video</span></button>';
    return h + '</div>';
  }
  function wireMedia(root) {
    if (!root) return;
    root.querySelectorAll('[data-pod]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); togglePodcast($('#drop-' + b.dataset.drop), E.Bank.topic(b.dataset.pod)); });
    });
    root.querySelectorAll('[data-vid]').forEach(function (b) {
      b.addEventListener('click', function (ev) { ev.stopPropagation(); playVideo(E.Bank.topic(b.dataset.vid)); });
    });
    root.querySelectorAll('[data-sysopen]').forEach(function (b) {
      b.addEventListener('click', function (ev) {
        ev.stopPropagation();
        S.sysOpen = S.sysOpen === b.dataset.sysopen ? null : b.dataset.sysopen;
        paintMap();
      });
    });
  }

  /* The listening bookkeeping, shared by every player in the app. */
  function wirePodAudio(a, topicId, onMissing) {
    var mark = 0, r = mdOf(topicId);
    function rec() { r = mediaRec(topicId); return r; }
    a.addEventListener('error', function () { a.style.display = 'none'; if (onMissing) onMissing(); });
    if (r.seconds && !r.done) {
      a.addEventListener('loadedmetadata', function () {
        if (r.seconds < a.duration - 5) { a.currentTime = r.seconds; mark = r.seconds; }
      });
    }
    a.addEventListener('play', function () {
      document.querySelectorAll('audio').forEach(function (o) { if (o !== a) o.pause(); });
      rec(); r.plays = (r.plays || 0) + 1; r.last = new Date().toISOString(); syncSoon();
    });
    a.addEventListener('seeked', function () { mark = a.currentTime; });
    a.addEventListener('pause', syncSoon);
    a.addEventListener('timeupdate', function () {
      if (a.currentTime - mark < 10) return;
      rec(); r.seconds = Math.round((r.seconds || 0) + (a.currentTime - mark));
      mark = a.currentTime;
    });
    a.addEventListener('ended', function () { rec(); r.done = true; r.seconds = Math.round(a.duration || r.seconds || 0); sync(); });
  }

  /* The inline player, toggled open under whichever button asked for it. */
  function togglePodcast(drop, t) {
    if (!drop || !t || !t.podcast) return;
    if (drop.dataset.open === 'pod') { stopAllAudio(); drop.dataset.open = ''; drop.innerHTML = ''; return; }
    var r = mdOf(t.id);
    drop.dataset.open = 'pod';
    drop.innerHTML = '<div class="pod"><div class="pod-t">' +
      '<span class="pod-n">' + esc(t.code) + ' · ' + esc(t.name) + ' — on the wireless</span>' +
      '<span class="pod-s">' + (r.done ? 'You have listened to this one' : r.seconds ? 'Picking up ' + Math.round(r.seconds / 60) + ' min in' : 'Listen before the questions') + '</span></div>' +
      '<audio class="pod-a" controls preload="none" src="' + esc(t.podcast) + '"></audio></div>';
    var a = drop.querySelector('audio');
    wirePodAudio(a, t.id, function () { drop.querySelector('.pod-s').textContent = 'This episode has not been uploaded yet'; });
    a.addEventListener('ended', function () { toast('Episode finished. Now try the lesson.'); });
    a.play().catch(function () {});
  }

  /* Opening a video is tracked the same way, whichever button started it. */
  function playVideo(t) {
    if (!t || !t.video) return;
    var r = mediaRec(t.id);
    r.videoOpens = (r.videoOpens || 0) + 1;
    r.last = new Date().toISOString();
    syncSoon();
    stopAllAudio();
    var id = ytId(t.video);
    modal('<p class="kicker">' + esc(t.code) + ' · video</p>' +
      '<h3 style="font-size:1.2rem">' + esc(t.name) + '</h3>' +
      (id ? '<div class="ytbox"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(id) + '?rel=0&autoplay=1" ' +
        'title="' + esc(t.name) + '" frameborder="0" allowfullscreen ' +
        'allow="accelerometer; autoplay; encrypted-media; picture-in-picture"></iframe></div>' : '<p class="tiny">This video link could not be read.</p>') +
      '<a class="btn wide" href="' + esc(t.video) + '" target="_blank" rel="noopener">Open on YouTube</a>' +
      '<button class="btn ghost wide" data-close>Close</button>');
  }

  /* ------------------------------------------------------------ VIDEOS tab */
  function paintVids() {
    var withVideo = C.TOPICS.filter(function (t) { return t.video; });
    var html = '<div class="sect-h"><div><h2>Memory Basin</h2><p>' + (withVideo.length
      ? 'Watch a class explained. The memories play here, so there is no need to leave the castle.'
      : 'The class videos are on their way. Each one will appear here and on its class header as soon as it is added.') + '</p></div></div>';
    html += '<div class="vidlist">';
    withVideo.forEach(function (t) {
      var md = mdOf(t.id), id = ytId(t.video);
      html += '<div class="vidrow' + (md.videoOpens ? ' done' : '') + '"><h3><span>' + esc(t.code) + '</span>' + esc(t.name) + '</h3>' +
        (id ? '<div class="ytbox"><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/' + esc(id) + '?rel=0" title="' + esc(t.name) + '" frameborder="0" allowfullscreen allow="accelerometer; encrypted-media; picture-in-picture" data-vid-topic="' + t.id + '"></iframe></div>'
            : '<p class="vid-soon">This video link could not be read.</p>') + '</div>';
    });
    html += '</div>';
    $('#view-vids').innerHTML = html;
    /* An embedded player gives no play event across origins, so count the
       first time a student puts a finger or pointer on it. */
    $('#view-vids').querySelectorAll('iframe[data-vid-topic]').forEach(function (f) {
      var once = false;
      function mark() {
        if (once) return; once = true;
        var r = mediaRec(f.dataset.vidTopic);
        r.videoOpens = (r.videoOpens || 0) + 1; r.last = new Date().toISOString(); syncSoon();
      }
      f.addEventListener('mouseenter', mark);
      f.addEventListener('touchstart', mark, { passive: true });
    });
  }

  /* ---------------------------------------------------------- PODCASTS tab */
  function paintPods() {
    var html = '<div class="sect-h"><div><h2>Castle Wireless</h2><p>One episode for each class. Nothing to answer: put them on for the ride to school.</p></div>' +
      '<a class="btn sm" href="podcasts.html">Open without signing in</a></div>';
    html += '<div class="podlist">';
    C.TOPICS.forEach(function (t) {
      if (!t.podcast) return;
      var md = mdOf(t.id);
      html += '<div class="podrow' + (md.done ? ' done' : '') + '"><h3><span>' + esc(t.code) + (md.done ? ' · LISTENED ✓' : md.seconds ? ' · ' + Math.round(md.seconds / 60) + ' MIN IN' : '') + '</span>' + esc(t.name) + '</h3>' +
        '<audio class="pod-a" controls preload="none" data-pod-topic="' + t.id + '" src="' + esc(t.podcast) + '"></audio>' +
        '<p class="podrow-miss">This episode has not been uploaded yet.</p></div>';
    });
    html += '</div>';
    $('#view-pods').innerHTML = html;
    $('#view-pods').querySelectorAll('audio[data-pod-topic]').forEach(function (a) {
      wirePodAudio(a, a.dataset.podTopic, function () { var row = a.closest('.podrow'); if (row) row.classList.add('missing'); });
    });
  }

  /* ---------------------------------------------------- LESSON READ-ALOUD
     The Listen button on each lesson reads the name, the key sentence and the
     explanation (full or simple, whichever is showing). Recorded audio comes
     from audio/lessons (tools/build-lesson-audio.py, same voice as the story);
     a lesson edited since the last build falls back to the browser's voice.
     lessonSpeech() must stay identical to the copy in that tool. */
  var LSAY = { audio: null, h: null };
  function lfnv(s) { var h = 0x811c9dc5; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ('0000000' + h.toString(16)).slice(-8); }
  function plainSpeech(h) { return String(h || '').replace(/<s>[\s\S]*?<\/s>/g, '').replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/→/g, ' to ').replace(/\s+/g, ' ').trim(); }
  /* Levelled explanations (lesson-levels.js): A1 · A2 · B1 · B2 versions of every lesson's key,
     explanation and example notes. C1 is the original full text in the topic files. The choice is
     kept on the profile (so it follows the student to another device) and on this device. */
  var LVLS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  function explainLevel() {
    var v = S.p && S.p.explainLevel;
    if (!v) { try { v = localStorage.getItem('qm.explain.lvl'); } catch (e) {} }
    if (!v && S.simple) v = 'B1';
    return LVLS.indexOf(v) >= 0 ? v : 'C1';
  }
  function setExplainLevel(v) {
    if (LVLS.indexOf(v) < 0) return;
    if (S.p) S.p.explainLevel = v;
    try { localStorage.setItem('qm.explain.lvl', v); } catch (e) {}
    syncSoon();
  }
  function lessonText(s, lvl) {
    var L = (window.QM_LESSON_LEVELS || {})[s.id], x = lvl !== 'C1' && L && L[lvl];
    if (x && x.body && x.body.length) return { key: x.key || s.theory.key, body: x.body, gloss: x.examples || [], lvl: lvl };
    return { key: s.theory.key, body: s.theory.body, gloss: [], lvl: 'C1' };
  }
  function lvlBar(cur) {
    return '<div class="lvl-bar" role="group" aria-label="Choose the level of this explanation"><span class="lvl-lbl">Read it at my level:</span>' +
      LVLS.map(function (l) { return '<button type="button" class="lvl-btn' + (l === cur ? ' on' : '') + '" data-lvl="' + l + '" aria-pressed="' + (l === cur) + '"' + (l === 'C1' ? ' title="The full explanation"' : '') + '>' + l + '</button>'; }).join('') + '</div>';
  }
  /* WP6 remainder (20 Oct 2026): an optional Thai gloss under the key sentence at A1 and A2 (lesson-thai.js;
     every line is a draft until a Thai speaker has checked docs/THAI-GLOSS-CHECK.md). Off by default. */
  function thaiOn() { var v = S.p && S.p.thaiGloss; if (v == null) { try { v = localStorage.getItem('qm.thai') === '1'; } catch (e) { v = false; } } return !!v; }
  function setThai(on) { if (S.p) S.p.thaiGloss = !!on; try { localStorage.setItem('qm.thai', on ? '1' : '0'); } catch (e) {} syncSoon(); }
  function thaiLine(subId, lvl) { var T_ = window.QM_LESSON_THAI || {}; return (lvl === 'A1' || lvl === 'A2') && T_[subId] ? T_[subId][lvl] || '' : ''; }
  function thaiBar(subId, lvl) {
    var th = thaiLine(subId, lvl); if (!th) return '';
    var on = thaiOn();
    return '<div class="thai-bar"><button type="button" class="lvl-btn thai-btn' + (on ? ' on' : '') + '" id="p-thai" aria-pressed="' + on + '" title="Show the key sentence in Thai">ไทย</button><span class="tiny">' + (on ? 'Thai gloss on (key sentence only).' : 'Tap for the key sentence in Thai.') + '</span></div>' + (on ? '<p class="key-thai" id="p-key-thai" lang="th">' + esc(th) + '</p>' : '');
  }
  function lessonSpeech(s, lvl) { var t = lessonText(s, lvl); return [plainSpeech(s.name) + '.', plainSpeech(t.key)].concat(t.body.map(plainSpeech)).join('\n'); }
  function lsaySlow() { try { return localStorage.getItem('qm.lsay.slow') === '1'; } catch (e) { return false; } }
  function lsayStop() {
    if (LSAY.audio) { try { LSAY.audio.pause(); } catch (e) {} LSAY.audio = null; }
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    LSAY.h = null;
    document.querySelectorAll('.lsay').forEach(function (b) { b.classList.remove('playing'); b.querySelector('.lsay-ico').textContent = '▶'; b.querySelector('.lsay-lbl').textContent = 'Listen to this lesson'; });
  }
  function lsayPlay(btn, text) {
    var h = lfnv(text);
    if (LSAY.h === h) { lsayStop(); return; }
    lsayStop(); stopAllAudio();
    LSAY.h = h; btn.classList.add('playing'); btn.querySelector('.lsay-ico').textContent = '❚❚'; btn.querySelector('.lsay-lbl').textContent = 'Stop reading';
    var A = window.QM_LESSON_AUDIO, rate = lsaySlow() ? 0.85 : 1;
    function browserVoice() {
      try {
        var ss = window.speechSynthesis; if (!ss) { lsayStop(); toast('This browser cannot read aloud.'); return; }
        var u = new SpeechSynthesisUtterance(text.replace(/\n/g, ' ')); u.lang = 'en-GB'; u.rate = 0.95 * rate;
        var v = (ss.getVoices() || []).filter(function (x) { return /^en-GB/i.test(x.lang); })[0]; if (v) u.voice = v;
        u.onend = function () { if (LSAY.h === h) lsayStop(); };
        ss.speak(u);
      } catch (e) { lsayStop(); }
    }
    if (A && A.files && A.files[h]) {
      var a = new Audio(A.base + h + '.mp3'); LSAY.audio = a; a.playbackRate = rate;
      a.addEventListener('ended', function () { if (LSAY.h === h) lsayStop(); });
      a.addEventListener('error', function () { if (LSAY.h === h && LSAY.audio === a) { LSAY.audio = null; browserVoice(); } });
      a.play().catch(function () { if (LSAY.h === h && LSAY.audio === a) { LSAY.audio = null; browserVoice(); } });
    } else browserVoice();
  }
  function lsayBar() {
    var slow = lsaySlow();
    return '<div class="lsay-bar"><button class="lsay" type="button" id="p-say" aria-label="Listen to this lesson read aloud"><span class="lsay-ico" aria-hidden="true">▶</span><span class="lsay-lbl">Listen to this lesson</span></button>' +
      '<button class="lsay-opt' + (slow ? ' on' : '') + '" type="button" id="p-say-slow" aria-pressed="' + slow + '">Slower</button></div>';
  }

  function openSub(subId) {
    lsayStop();
    var s = E.Bank.sub(subId), t = E.Bank.topic(s.topicId);
    var lvl = explainLevel(), tx = lessonText(s, lvl);
    var html = '<div class="play"><div class="play-top"><button class="btn ghost sm" id="p-back">← ' + homeLabel() + '</button><span style="flex:1"></span><span class="qcount">' + esc(t.code) + '</span></div>' +
      '<div class="card theory">' + E.artBand(t.art) + '<p class="kicker">' + esc(s.cefr) + ' · ' + esc(t.name) + '</p><h3>' + esc(s.name) + '</h3>' + lvlBar(tx.lvl) + lsayBar() + '<p class="key">' + tx.key + '</p>' + thaiBar(subId, tx.lvl) +
      '<div class="prose" data-explain-level="' + tx.lvl + '">' + tx.body.map(function (x) { return '<p>' + x + '</p>'; }).join('') + '</div>';
    if (s.theory.examples && s.theory.examples.length) html += '<div class="exlist">' + s.theory.examples.map(function (x, i) { return '<div><div class="s">' + x.s + '</div><div class="g">' + esc(tx.gloss[i] || x.g) + '</div></div>'; }).join('') + '</div>';
    var srec = S.p.subs[subId];
    if (srec && srec.testedOut && !(srec.best >= E.PASS_SUB)) html += '<p class="tiny testout-note" id="p-testedout">You tested out of this lesson at the examiner\'s gate. It counts as passed; open it any time for review.</p>';
    html += '<button class="btn primary wide" id="p-start">Start the ' + s.items.length + ' questions →</button></div></div>';
    $('#view-play').innerHTML = html;
    show('play');
    $('#p-back').addEventListener('click', function () { lsayStop(); show(homeView()); });
    $('#view-play').querySelectorAll('[data-lvl]').forEach(function (b) { b.addEventListener('click', function () {
      var y = window.scrollY; setExplainLevel(b.dataset.lvl); openSub(subId); try { window.scrollTo(0, y); } catch (e) {}
      var nb = $('#view-play [data-lvl="' + b.dataset.lvl + '"]'); if (nb) nb.focus();
    }); });
    $('#p-start').addEventListener('click', function () { lsayStop(); startRun('module', s.items, { subId: subId, title: s.name }); });
    var tb = $('#p-thai'); if (tb) tb.addEventListener('click', function () { var y = window.scrollY; setThai(!thaiOn()); openSub(subId); try { window.scrollTo(0, y); } catch (e) {} });
    $('#p-say').addEventListener('click', function () { lsayPlay($('#p-say'), lessonSpeech(s, explainLevel())); });
    $('#p-say-slow').addEventListener('click', function () {
      var on = !lsaySlow(); try { localStorage.setItem('qm.lsay.slow', on ? '1' : '0'); } catch (e) {}
      this.classList.toggle('on', on); this.setAttribute('aria-pressed', on);
      if (LSAY.audio) LSAY.audio.playbackRate = on ? 0.85 : 1;
    });
  }

  /* =====================================================================
     PRACTICE RUNNER (inherited)
     ===================================================================== */
  function startRun(kind, items, meta) {
    S.run = { kind: kind, items: items.slice(), i: 0, results: [], subId: meta.subId, checkId: meta.checkId, levelId: meta.levelId || '', title: meta.title, hintedAny: false, t0: 0, fxTopic: meta.fxTopic || '',
      testOut: !!meta.testOut, base: meta.base || null, reviewBefore: meta.reviewBefore || null };
    if (kind === 'check') {
      /* WP10e: the chapter's written boss item stays last; the drawn questions are shuffled */
      var last = S.run.items.length && S.run.items[S.run.items.length - 1].boss ? S.run.items.pop() : null;
      S.run.items = E.shuffle(S.run.items); if (last) S.run.items.push(last);
    }
    /* B11: an examiner's gate keeps its key until the gate is passed. */
    if (kind === 'check') S.run.keyHidden = !gatePassed(meta.checkId);
    show('play'); renderQ();
  }
  function gatePassed(checkId) { var c = checkId && S.p.checks && S.p.checks[checkId]; return !!(c && c.best >= E.PASS_CHECK); }
  /* Is the key hidden for this item? Gate items stay keyless until their gate is passed,
     in the gate itself and when they come back in the Mending Room. Lessons always show the key. */
  function keyHiddenFor(r, item) {
    if (r.kind === 'check') return !!r.keyHidden;
    if (r.kind === 'faults') { var ck = E.Bank.checkOf ? E.Bank.checkOf(item.id) : ''; return !!ck && !gatePassed(ck); }
    return false;
  }
  function ruleOnlyHtml(item) {
    var rem = C.REMEDIATION[item.tag] || {};
    return '<div class="verdict-exp">The examiner keeps the answer until you pass the gate. Check this rule and try again.</div>' +
      '<div class="verdict-w"><b>' + esc(rem.name || 'The rule') + '</b>' + (item.hint || rem.principle ? ': ' + esc(item.hint || rem.principle) : '') + '</div>';
  }
  /* WP4: each attempt is eight questions drawn from the gate's pool of fourteen.
     E1: opts.testOut = she tries the gate before its lessons are all passed. */
  function startCheck(levelId, opts) {
    var lv = E.Bank.level(levelId); if (!lv) return;
    var items = E.Bank.drawGate ? E.Bank.drawGate(S.p, levelId) : lv.check.items;
    /* WP10e (20 Oct 2026): three chapter gates end with a written question (story-content.js gate.boss):
       seven drawn questions, then the boss item, marked by Writer.checkThesis / checkBody. */
    var boss = ST && ST.bossFor ? ST.bossFor(levelId) : null;
    if (boss && boss.item) {
      var bi = {}; Object.keys(boss.item).forEach(function (k) { bi[k] = boss.item[k]; });
      bi.boss = { pass: boss.pass, fail: boss.fail, chapter: boss.chapter.n };
      items = items.slice(0, Math.max(1, (E.GATE_DRAW || 8) - 1)).concat([bi]);
    }
    var testOut = !!(opts && opts.testOut) && !P.checkUnlocked(S.p, lv) && !gatePassed(lv.check.id);
    var before = null;
    if (testOut) { before = {}; items.forEach(function (it) { if (S.p.review[it.id]) before[it.id] = 1; }); }
    startRun('check', items, { checkId: lv.check.id, levelId: levelId, title: testOut ? lv.check.name + ' · trying it first' : lv.check.name, testOut: testOut, reviewBefore: before });
  }
  /* E2: a lesson retry re-runs the questions she got wrong plus up to two she
     got right, shuffled. `base` is the whole lesson's state so far
     ({ itemId: true|false }); the retry's score is taken over the whole lesson. */
  function retryNote(r) {
    var wrong = r.items.filter(function (it) { return !r.base[it.id]; }).length, right = r.items.length - wrong;
    return 'Retry: the ' + (wrong === 1 ? 'one question' : wrong + ' questions') + ' you missed' + (right ? ', mixed with ' + (right === 1 ? 'one' : 'two') + ' you got right' : '') + '. Your score counts the whole lesson.';
  }
  function retryItems(sub, base) {
    var wrong = sub.items.filter(function (it) { return !base[it.id]; });
    var right = E.shuffle(sub.items.filter(function (it) { return base[it.id]; })).slice(0, 2);
    return E.shuffle(wrong.concat(right));
  }
  var TIMED_TYPES = { choose: 1, judge: 1, spot: 1 };
  var FREE_TYPES = { thesis: 1, bodypara: 1, rewrite: 1 };

  function renderQ() {
    var r = S.run, item = r.items[r.i];
    if (r.cleanup) { r.cleanup(); r.cleanup = null; }
    var prog = Math.round(100 * r.i / r.items.length);
    var canHint = r.kind === 'module' || r.kind === 'faults';
    var timed = !!TIMED_TYPES[item.type] && !item.prompt;
    var combo = r.combo || 0;
    $('#view-play').innerHTML = '<div class="play"' + (item.boss ? ' data-boss="' + esc(item.id) + '"' : '') + '><div class="play-top"><button class="btn ghost sm" id="p-quit">✕</button><div class="bar-line thin"><span style="width:' + prog + '%"></span></div>' +
      (combo >= 3 ? '<span class="combo">▲ ' + combo + ' in a row</span>' : '') + '<span class="qcount">' + (r.base ? 'Retry · ' : r.testOut ? 'Trying it first · ' : '') + (r.i + 1) + ' / ' + r.items.length + '</span>' +
      (timed ? '<div class="timer" id="timer" title="Answer inside 7 seconds for a time bonus"><svg width="38" height="38" viewBox="0 0 38 38"><circle class="track" cx="19" cy="19" r="15" fill="none" stroke-width="4"></circle><circle class="run" id="timer-run" cx="19" cy="19" r="15" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="94.2" stroke-dashoffset="0"></circle></svg><b id="timer-n">7</b></div>' : '') +
      '</div>' + (r.i === 0 && r.base ? '<p class="tiny retry-note" id="p-retrynote">' + esc(retryNote(r)) + '</p>' : '') + '<div class="card qcard"><div class="qtype"><span>' + esc(E.TYPE_LABEL[item.type] || 'Question') + '</span><span class="lv">' + esc(item.level) + '</span></div><div id="qhost"></div><div id="feedback" role="status" aria-live="polite"></div>' +
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
      stopTimer(); S.run = null; show(homeView());
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
      var hideKey = keyHiddenFor(r, item);
      var out = view.check(); view.lock({ hideKey: hideKey });
      var hinted = !!r.thisHinted; r.thisHinted = false;
      var fast = timed && !hinted && out.correct && ms <= E.SPEED_MS;
      var row = P.recordAttempt(S.p, item, out.correct, ms, hinted, fast);
      row.given = String(out.givenText).slice(0, 400); row.expected = String(out.expectedText).slice(0, 300); row.mode = r.kind;
      api.enqueue([row]);
      S.sessItems++;
      if (out.correct) { S.sessCorrect++; r.combo = (r.combo || 0) + 1; } else r.combo = 0;
      var free = !!FREE_TYPES[item.type];
      var keyless = hideKey && !out.correct && !free;
      r.results.push({ item: item, correct: out.correct, given: out.givenText, expected: out.expectedText, hidden: keyless });
      $('#feedback').innerHTML = '<div class="verdict ' + (out.correct ? 'ok' : 'no') + '"><div class="verdict-h">' + (out.correct ? '✓ ' + (free ? 'Passes every rule' : 'Correct') : '✕ ' + (free ? 'Not yet' : 'Not quite')) + (fast ? '<span class="bonus-note">time bonus +' + E.XP_SPEED + '</span>' : '') + '</div>' +
        (keyless ? ruleOnlyHtml(item) : (out.correct || free ? '' : '<div class="verdict-exp">You chose: ' + esc(out.givenText) + '<br>Answer: ' + esc(out.expectedText) + '</div>') + '<div class="verdict-w">' + item.why + '</div>') +
        (item.boss ? '<div class="verdict-w boss-say" id="boss-say">' + esc(out.correct ? item.boss.pass : item.boss.fail) + '</div>' : '') + '</div>';
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
    var lessonState = null, lessonMisses = 0, toLessons = [];
    if (r.kind === 'module') {
      /* E2: the lesson's state over all its questions; a retry keeps what was right before. */
      var sub = E.Bank.sub(r.subId);
      lessonState = {};
      sub.items.forEach(function (it) { lessonState[it.id] = !!(r.base && r.base[it.id]); });
      r.results.forEach(function (x) { if (x.correct) lessonState[x.item.id] = true; });
      var nRight = sub.items.filter(function (it) { return lessonState[it.id]; }).length;
      lessonMisses = sub.items.length - nRight;
      if (r.base) { score = nRight / sub.items.length; correct = nRight; }
      P.finishSub(S.p, r.subId, score); passed = score >= E.PASS_SUB;
      head = passed ? 'Lesson passed' : 'Not yet: take it again';
      note = passed ? 'You need 60% to pass a lesson, and you have it. Anything you missed has gone to the Mending Room and will come back.' : 'You need 60% to pass this one. Read the explanation again and retry: the misses are worth studying.';
      if (r.base) note = 'This score counts the whole lesson: ' + nRight + ' of ' + sub.items.length + ' right, with the ones you had right before kept. ' + note;
    } else if (r.kind === 'check') {
      var missTags = [];
      r.results.forEach(function (x) { if (!x.correct && missTags.indexOf(x.item.tag) < 0) missTags.push(x.item.tag); });
      passed = score >= E.PASS_CHECK;
      P.finishCheck(S.p, r.checkId, score, r.hintedAny, { ids: r.items.map(function (it) { return it.id; }), miss: missTags, testOut: r.testOut });
      head = score >= 1 ? 'A perfect gate. The examiner bows.' : passed ? 'Gate passed' : 'The gate stays shut';
      note = passed ? 'That class is passed. Your rank on the header may have moved up.' : 'You need 75% to pass an examiner\'s gate. The principles you lost marks on are listed below.';
      var tlv = E.Bank.level(r.levelId);
      if (r.testOut && tlv) {
        if (passed) {
          P.testOut(S.p, tlv);
          head = score >= 1 ? 'Tested out, and a perfect gate' : 'Tested out: the class is passed';
          note = 'The examiner lets you through. The three lessons count as passed: they stay open any time for review.';
        } else {
          /* no penalty: the questions she missed before any lesson do not go to the Mending Room */
          r.items.forEach(function (it) { if (!(r.reviewBefore || {})[it.id]) delete S.p.review[it.id]; });
          toLessons = E.Bank.lessonsForTags(r.levelId, missTags).filter(function (sb) { return !P.subPassed(S.p, sb.id); });
          if (!toLessons.length) toLessons = tlv.subs.filter(function (sb) { return !P.subPassed(S.p, sb.id); });
          head = 'Not yet: the lessons first';
          note = 'No harm done: trying the gate first costs nothing, and these misses do not go to the Mending Room. The lesson' + (toLessons.length > 1 ? 's' : '') + ' below teach' + (toLessons.length > 1 ? '' : 'es') + ' the rules you missed. Then the gate opens the usual way.';
        }
      }
    } else { passed = true; head = 'Mending done'; note = 'A question you get right twice in a row leaves the Mending Room for good.'; }
    var misses = r.results.filter(function (x) { return !x.correct; });
    /* B11: the review shows the answers only once the gate is passed (this try or an earlier one). */
    var reviewOpen = function (m) { return r.kind === 'check' ? passed || !r.keyHidden : !m.hidden || gatePassed(E.Bank.checkOf ? E.Bank.checkOf(m.item.id) : ''); };
    var anyKeyless = misses.some(function (m) { return !reviewOpen(m); });
    var moreDue = r.kind === 'faults' ? fxDue(r.fxTopic).length : 0;
    var againLabel = 'Try again';
    if (r.kind === 'module' && lessonMisses > 0) againLabel = lessonMisses === 1 ? 'Try the one you missed again' : 'Try the ' + lessonMisses + ' you missed again';
    else if (r.kind === 'check') againLabel = r.testOut && !passed ? 'Try the gate again' : 'Try again: new questions';
    var html = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + pct(score) + '"><i>' + pct(score) + '%</i></div><h3>' + esc(head) + '</h3><p>' + esc(note) + '</p>';
    if (anyKeyless) html += '<p class="tiny">The examiner keeps the answers until you pass the gate. Here are the rules to check before you try again.</p>';
    if (misses.length) html += '<div class="misslist">' + misses.map(function (m) {
      var rem = C.REMEDIATION[m.item.tag] || {};
      if (!reviewOpen(m)) return '<div class="miss"><b>' + esc(rem.name || m.item.tag) + '</b>' + esc(m.item.hint || rem.principle || '') + '</div>';
      return '<div class="miss"><b>' + esc(rem.name || m.item.tag) + '</b>' + m.item.why + (r.kind === 'check' && !FREE_TYPES[m.item.type] ? '<br><span class="tiny">Answer: ' + esc(m.expected) + '</span>' : '') + (m.item.boss ? '<br><span class="boss-say">' + esc(m.item.boss.fail) + '</span>' : '') + '</div>';
    }).join('') + '</div>';
    if (toLessons.length) html += '<div class="testout-lessons" id="r-lessons"><p class="kicker">Go to the lesson' + (toLessons.length > 1 ? 's' : '') + '</p>' + toLessons.map(function (sb) { return '<button class="btn wide" data-to-sub="' + sb.id + '">' + esc(sb.name) + ' →</button>'; }).join('') + '</div>';
    if (r.kind === 'faults') html += '<p class="tiny">' + (moreDue ? moreDue + ' more due' + (r.fxTopic && E.Bank.topic(r.fxTopic) ? ' in ' + esc(E.Bank.topic(r.fxTopic).name) : '') + ' · ' + fxMinutes(Math.min(moreDue, FX_SITTING)) + '.' : 'Nothing more is due' + (r.fxTopic ? ' in this class' : '') + '. Well mended.') + '</p>';
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn primary" id="r-map">' + (S.returnTo === 'story' ? 'Back to the chapter' : S.returnTo === 'faults' ? 'Back to the Mending Room' : S.returnTo === 'write' ? 'Back to my essay' : 'Back to the map') + '</button>' + (r.kind === 'module' || r.kind === 'check' ? '<button class="btn" id="r-again">' + esc(againLabel) + '</button>' : '') + (moreDue ? '<button class="btn" id="r-more">Mend ' + Math.min(moreDue, FX_SITTING) + ' more</button>' : '') + '</div></div></div>';
    $('#view-play').innerHTML = html;
    var earned = P.checkBadges(S.p);
    paintHeader(); sync();
    $('#r-map').addEventListener('click', function () { S.run = null; show(homeView()); });
    var more = $('#r-more');
    if (more) more.addEventListener('click', function () { startMending(r.fxTopic); });
    var again = $('#r-again');
    if (again) again.addEventListener('click', function () {
      if (r.kind === 'module') {
        var sb = E.Bank.sub(r.subId);
        if (lessonMisses > 0) startRun('module', retryItems(sb, lessonState), { subId: r.subId, title: r.title, base: lessonState });
        else startRun('module', sb.items, { subId: r.subId, title: r.title });
      } else startCheck(r.levelId, { testOut: r.testOut && !passed });
    });
    $('#view-play').querySelectorAll('[data-to-sub]').forEach(function (b) { b.addEventListener('click', function () { S.run = null; openSub(b.dataset.toSub); }); });
    if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0], earned.slice(1)); }, 600);
  }
  function celebrate(badge, rest) {
    modal('<div class="seal">★</div><p class="kicker">Keepsake earned</p><h3 style="font-size:1.4rem">' + esc(badge.name) + '</h3><p style="color:var(--ink-2);font-size:.95rem">' + esc(badge.perk) + '</p><p class="tiny">' + esc(badge.how) + '</p><button class="btn primary wide" data-close>Collect</button>');
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
    var html = '<div class="sect-h"><div><h2>Scriptorium</h2><p>Forty minutes, one prompt, four paragraphs. Guided mode shows the frames and the eleven keys; Skeleton shows the slot labels only; Exam is a blank page and the clock. After you submit, the essay goes to T.Chris. If you want, one tap also gets an AI band estimate in LevelUp.</p></div></div>';
    html += '<div class="modechoice">' + T.FADE.map(function (f) { return '<label><input type="radio" name="uim" value="' + f.id + '"' + (S.uiMode === f.id ? ' checked' : '') + '> ' + esc(f.name) + ' — ' + esc(f.blurb) + '</label>'; }).join('') + '</div>';
    html += '<div class="filters" id="f-type">' + types.map(function (t) { return '<button data-t="' + t + '"' + (S.filters.type === t ? ' class="on"' : '') + '>' + (t === 'all' ? 'All types' : esc(typeName(t))) + '</button>'; }).join('') + '</div>';
    html += '<div class="filters" id="f-domain">' + domains.map(function (d) { return '<button data-d="' + d + '"' + (S.filters.domain === d ? ' class="on"' : '') + '>' + (d === 'all' ? 'All domains' : esc(C.DOMAINS[d])) + '</button>'; }).join('') + '</div>';
    /* E4: her five first (always shown, in order), then every other prompt as extra practice (the filters apply there) */
    var cp = coreProgress(p), coreIdx = {}; cp.ids.forEach(function (id, i) { coreIdx[id] = i; });
    var fiveHtml = coreHead(cp, 'w') + '<div class="promptgrid" id="w-five">' + cp.ids.map(function (id, i) {
      var pr = PR.get(id); return pr ? coreCard(pr, i, cp, 'data-p="' + pr.id + '"', done[pr.id] ? '<span class="pill good">written ' + done[pr.id] + '×</span>' : '') : '';
    }).join('') + '</div>' + extraHead('w', practicePrompts().length - cp.ids.length);
    html = html.replace('<div class="filters" id="f-type">', function (m) { return fiveHtml + m; });
    var list = practicePrompts().filter(function (pr) { return coreIdx[pr.id] == null && (S.filters.type === 'all' || pr.type === S.filters.type) && (S.filters.domain === 'all' || pr.domain === S.filters.domain); });
    html += '<div class="promptgrid" id="w-extra">' + list.map(function (pr) {
      return '<button class="pcard' + (done[pr.id] ? ' done' : '') + '" data-p="' + pr.id + '"><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(PR.domainName(pr.domain)) + '</span>' + (done[pr.id] ? '<span class="pill good">written ' + done[pr.id] + '×</span>' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
    }).join('') + '</div>';
    html += '<p style="margin:14px 0"><button class="btn sm" id="w-live">Join the Assembly (class game) →</button></p>';
    html += '<div class="sect-h" style="margin-top:26px"><div><h2>Mock examinations</h2><p>Exam mode, forty minutes, marked by your teacher. Sit one when every class you need is passed.</p></div></div>';
    html += '<div class="promptgrid">' + C.MOCKS.map(function (m) {
      var pr = PR.get(m.promptId), rec = (p.mocks || {})[m.id];
      return '<button class="pcard' + (rec ? ' done' : '') + '" data-mock="' + m.id + '"><span class="pcard-t">' + esc(m.name) + '</span><span class="pcard-m"><span class="pill">' + (pr ? esc(typeName(pr.type)) : '') + '</span><span class="pill gold">' + m.minutes + ' min</span><span class="pill">' + m.level + '</span>' + (rec ? '<span class="pill good">sat</span>' : '') + '</span><span class="pcard-r">' + esc(m.blurb) + '</span></button>';
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
    S.write = W.mount(host, { prompt: cfg.promptId, mode: cfg.uiMode, minutes: cfg.minutes, tier: tier(), level: explainLevel(), studentId: S.p.studentId, share: myShare(), faultTags: topFaultTags(),
      /* revision (19 Oct 2026, contract with writer.js): the essay it revises, its weak Ward row (row id), her text and her keys */
      revisionOf: cfg.revisionOf || '', reviseRow: cfg.reviseRow || '', reviseText: cfg.reviseText || null, reviseVars: cfg.reviseVars || null,
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
    if (ST && S.p) { var ss = ST.ensure(S.p); ss.handoffs = (ss.handoffs || 0) + 1; syncSoon(); }
    var w = window.open(url, '_blank');
    if (!w) toast('Pop-up blocked. Allow pop-ups for this site, or copy the essay and paste it into LevelUp.');
  }
  /* What the Writer measured on the essay just submitted (Writer.lastMeta, group s). Without it, the same
     numbers are worked out from the result: frame words per box (guided) or the frame ratio of the Wards. */
  function writerMeta(cfg, res) {
    var m = null;
    m = res && res.meta && typeof res.meta === 'object' ? res.meta : null;
    if (!m) { try { m = W && typeof W.lastMeta === 'function' ? W.lastMeta() : null; } catch (e) { m = null; } }
    m = m || {};
    var ow = (res.plan && res.plan.ownWords) || [], words = 0, frame = 0, sents = 0, have = false;
    ow.forEach(function (o) { if (o && o.words) { have = true; words += o.words; frame += o.frame || 0; sents += o.own || 0; } });
    var cal = res.plan && res.plan.calibration;
    var ownShare = typeof m.ownShare === 'number' ? m.ownShare : have && words ? 1 - frame / words : (res.preflight && typeof res.preflight.ratio === 'number' ? 1 - res.preflight.ratio : null);
    return { ownShare: ownShare == null ? null : Math.max(0, Math.min(1, ownShare)), ownSentences: typeof m.ownSentences === 'number' ? m.ownSentences : have ? sents : null,
      fillUsed: typeof m.fillUsed === 'boolean' ? m.fillUsed : null, landTaps: m.landTaps || null,
      landAgree: typeof m.landAgree === 'number' ? m.landAgree : cal && cal.of ? cal.agree / cal.of : null,
      revisionOf: cfg.revisionOf || m.revisionOf || '', reviseRow: cfg.reviseRow || m.reviseRow || '', reviseBox: cfg.reviseBox || '' };
  }
  function submitReport(cfg, res) {
    var p = S.p, pr = PR.get(cfg.promptId) || {};
    var rep = { id: uid('R'), studentId: p.studentId, name: p.displayName, cohort: p.cohort || '', ts: new Date().toISOString(),
      promptId: cfg.promptId, type: pr.type, tier: res.tier, kind: cfg.kind, mockId: cfg.mockId || '', assignmentId: cfg.assignmentId || '', uiMode: cfg.uiMode,
      text: res.text, words: res.words, seconds: res.seconds, timedOut: res.timedOut, revision: res.revision, firstText: res.firstText,
      preflight: { bad: res.preflight.bad, warn: res.preflight.warn, ratio: res.preflight.ratio, rows: res.preflight.rows.map(function (r) { return { id: r.id, status: r.status, label: r.label, tag: r.tag }; }) },
      plan: res.plan, promptDesc: pr.text, status: 'submitted', released: false };
    /* Writer.lastMeta() (res.meta): ownShare, ownSentences, fillUsed, landTaps, landAgree, revisionOf, reviseRow */
    var meta = writerMeta(cfg, res);
    Object.keys(meta).forEach(function (k) { rep[k] = meta[k]; });
    if (rep.revisionOf) rep.reviseImproved = reviseImproved(cfg, res);
    var sum = P.recordReport(p, rep);
    rep.merits = sum ? sum.merits : 0; rep.meritWhy = sum ? sum.meritWhy : '';
    api.submitReport(rep).then(function (r) { if (!r || !r.ok) toast('Saved on this device; it will reach the class sheet when the connection is back.'); });
    var earned = P.checkBadges(p);
    paintHeader(); sync();
    /* Revision (19 Oct 2026): every essay but a mock can be revised on its weakest row.
       WP14 (20 Oct 2026): with no red rows the revision is optional ("revise for practice, or move on"). */
    var revCfg = cfg.kind === 'mock' ? null : reviseCfg(rep, res, 'result');
    var mustRevise = !!(revCfg && revCfg.reviseRed);
    var projNews = (ST && cfg.kind !== 'mock' && coreIds().indexOf(cfg.promptId) >= 0) ? ST.projectNewsroomHtml(cfg.promptId) : '';
    var html = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + (res.preflight.bad ? 40 : res.preflight.warn ? 75 : 100) + '"><i>' + res.words + '<small style="font-size:.9rem">w</small></i></div>' +
      '<h3>' + (res.timedOut ? 'Time. The owl has taken the essay' : 'The owl has taken the essay') + '</h3><p>' + esc(res.preflight.summary) + ' Written in ' + mmss(res.seconds) + '. ' + (cfg.kind === 'mock' ? 'T.Chris will mark this one.' : 'It has gone to T.Chris: he already has your essay, so you do not need to send it again. If you want, you can also get an AI band estimate and an upgraded version in LevelUp.') + '</p>' +
      '<div class="misslist">' + res.preflight.rows.filter(function (r) { return r.status !== 'ok'; }).map(function (r) { var ns = W.nextStep ? W.nextStep(r, res.preflight, explainLevel()) : null; return '<div class="miss"><b>' + esc(r.label) + '</b>' + esc(r.note) + (ns ? '<span class="miss-next"><span class="miss-next-h">Next time:</span> ' + esc(ns.text) + (ns.sub ? ' <button class="linky" data-miss-sub="' + esc(ns.sub) + '">' + esc(ns.link) + ' →</button>' : '') + '</span>' : '') + '</div>'; }).join('') + '</div>' +
      '<p class="merit-note' + (rep.merits ? '' : ' none') + '" id="w-merits">' + esc(meritNote(sum, rep)) + '</p>' +
      (revCfg ? '<div class="card" id="w-revise-card" data-revise="' + (mustRevise ? 'weak' : 'practice') + '" style="padding:12px 14px;margin:0 auto 12px;max-width:34rem;text-align:left"><p class="kicker">' + (mustRevise ? 'Next: make it stronger' : 'No red rows') + '</p><p style="margin:0 0 8px">' + (mustRevise
        ? 'Your weakest row is <b>' + esc(PARA_NAME[revCfg.reviseBox] || revCfg.reviseBox) + '</b>: ' + esc(revCfg.reviseWhy) + '. Rewrite that paragraph in your own words; the rest of your essay stays as it is.'
        : 'Your essay has no red rows: revise for practice, or move on. ' + (revCfg.revisePractice
          ? 'For practice, <b>' + esc(PARA_NAME[revCfg.reviseBox] || revCfg.reviseBox) + '</b> is the shorter body paragraph: one more developed sentence there earns the revision merits.'
          : 'For practice, the Wards point at <b>' + esc(PARA_NAME[revCfg.reviseBox] || revCfg.reviseBox) + '</b> (amber): ' + esc(revCfg.reviseWhy) + '. Make that paragraph stronger and the revision earns its merits.')) +
        '</p><button class="btn' + (mustRevise ? ' primary' : '') + '" id="w-revise">' + (mustRevise ? 'Revise your weakest row' : 'Revise for practice') + '</button>' + (mustRevise ? '' : ' <button class="btn primary" id="w-moveon">Move on</button>') + '</div>' : '') +
      (cfg.kind !== 'mock' && res.text ? '<p style="margin:0 auto 12px;max-width:34rem"><button class="btn sm" id="w-owl">Send a body paragraph by owl to a housemate</button> <span class="tiny">She tags its mechanism, example and nuance. No names.</span></p>' : '') +
      projNews +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn' + (revCfg ? '' : ' primary') + '" id="w-levelup">Get an AI band estimate (LevelUp)</button><button class="btn" id="w-copy">Copy essay</button><button class="btn" id="w-record">See my report card</button><button class="btn ghost" id="w-another">Write another</button></div></div></div>';
    $('#view-write').innerHTML = html;
    if (revCfg) $('#w-revise').addEventListener('click', function () { startWrite(revCfg); });
    var mo = $('#w-moveon'); if (mo) mo.addEventListener('click', function () { S.returnTo = 'plan'; show('plan'); });
    var ow = $('#w-owl'); if (ow) ow.addEventListener('click', function () { owlSendModal(rep, res.text); });
    if (projNews && ST) { ST.wireWords($('#view-write')); ST.wireArt($('#view-write')); ST.wireProject($('#view-write'), function () { S.returnTo = 'plan'; show('plan'); }); }
    $('#w-levelup').addEventListener('click', function () { handoff(pr, res.text, rep); });
    $('#view-write').querySelectorAll('[data-miss-sub]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'write'; openSub(b.dataset.missSub); }); });
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
    var html = '<div class="sect-h"><div><h2>My Spellbook</h2><p>The eleven keys slot into four frames. Choose an opener for each paragraph and edit it into your own words: that version follows you into the Scriptorium. Frames are scaffolding; the marks are inside the keys.</p></div><span class="pill on">' + esc(T.TIERS[tr].name) + '</span></div>';
    html += '<div class="filters">' + Object.keys(C.TYPES).map(function (k) { return '<button data-tt="' + k + '"' + (S.tplType === k ? ' class="on"' : '') + '>' + esc(C.TYPES[k].name) + '</button>'; }).join('') + '</div>';
    html += spellbookInUseCard(my);
    html += T.switchCard(S.tplType);
    html += '<div class="card" style="padding:14px 16px;margin-bottom:14px"><p class="kicker">The eleven keys · ' + esc(typeName(S.tplType)) + '</p><ol class="bc-list">' + C.VARIABLES.map(function (v) { return '<li><b>' + esc(labels[v.key]) + '</b> — ' + esc(v.hint) + '</li>'; }).join('') + '</ol></div>';
    paras.forEach(function (pg) {
      var chosen = my.choice[pg.key] || pg.frames[0].id, fr = pg.frames.filter(function (f) { return f.id === chosen; })[0] || pg.frames[0];
      html += '<div class="card" style="padding:14px 16px;margin-bottom:12px"><div class="wr-boxh"><b>' + esc(pg.name) + '</b><span class="tiny">~' + pg.target + ' words</span><select class="wr-frame-pick" data-tpick="' + pg.key + '">' + pg.frames.map(function (f) { return '<option value="' + f.id + '"' + (f.id === fr.id ? ' selected' : '') + '>' + esc(f.name) + '</option>'; }).join('') + '</select></div>' +
        '<div class="frame-view">' + T.fill(fr.text, {}, { html: true, labels: labels }) + '</div>' +
        '<textarea class="wr-frame" data-tframe="' + pg.key + '" rows="4" spellcheck="false" placeholder="Your own version of this frame, keeping the {slots}">' + esc(my.custom[pg.key] || '') + '</textarea>' +
        '<p class="tiny">Keep the slot names in braces: ' + T.tokens(fr.text).map(function (k) { return '{' + k + '}'; }).join(' ') + '. Leave the box empty to use the frame as written.</p></div>';
    });
    html += '<div class="card" style="padding:14px 16px;margin-bottom:12px"><p class="kicker">Structural swaps · one per body paragraph at most</p>' + T.SWAPS.map(function (s) { return '<div class="swap"><b>' + esc(s.name) + '</b> <span class="tiny">(' + esc(s.move) + ' sentence)</span><div class="diffpara"><b>Base</b>' + T.fill(s.base, {}, { html: true, labels: labels }) + '</div>' + s.variants.map(function (v) { return '<div class="diffpara" style="background:var(--ok-soft)"><b>Swap</b>' + T.fill(v, {}, { html: true, labels: labels }) + '</div>'; }).join('') + '<p class="tiny">' + esc(s.note) + '</p></div>'; }).join('') + '</div>';
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" id="tpl-reset">Reset my spellbook</button><span class="tiny" style="align-self:center">The track is set in Your Trunk.</span></div>';
    $('#view-template').innerHTML = html;
    $('#view-template').querySelectorAll('[data-tt]').forEach(function (b) { b.addEventListener('click', function () { S.tplType = b.dataset.tt; paintTemplate(); }); });
    $('#view-template').querySelectorAll('[data-tpick]').forEach(function (sel) { sel.addEventListener('change', function () { my.choice[sel.dataset.tpick] = sel.value; delete my.custom[sel.dataset.tpick]; if (my.fromLab) my.edited = true; T.save(S.p.studentId, my); paintTemplate(); }); });
    $('#view-template').querySelectorAll('[data-tframe]').forEach(function (ta) { ta.addEventListener('input', function () { if (ta.value.trim()) my.custom[ta.dataset.tframe] = ta.value; else delete my.custom[ta.dataset.tframe]; if (my.fromLab) my.edited = true; T.save(S.p.studentId, my); }); });
    $('#tpl-reset').addEventListener('click', function () { if (confirm('Reset your spellbook choices and edits? You can bring them back afterwards.')) { T.save(S.p.studentId, { tier: tr, choice: {}, custom: {}, prev: spellbookSnapshot(my) }); paintTemplate(); toast('Spellbook reset to the standard frames.'); } });
    var rs = $('#tpl-restore'); if (rs) rs.addEventListener('click', function () {
      var back = my.prev; if (!back) return;
      back = JSON.parse(JSON.stringify(back)); back.prev = spellbookSnapshot(my);
      T.save(S.p.studentId, back); paintTemplate(); toast('Your earlier spellbook is back. The one it replaced is kept as the earlier version.');
    });
  }

  /* One spellbook in the Scriptorium: say which, and what the Workshop design is to it. */
  function spellbookSnapshot(my) {
    var c = JSON.parse(JSON.stringify(my || {})); delete c.prev; delete c.share; delete c.shareAt; return c;
  }
  function spellbookInUseCard(my) {
    var u = T.inUse ? T.inUse(S.p.studentId) : { kind: my.fromLab ? 'lab' : 'standard', text: '' };
    var designs = (S.p.lab && S.p.lab.templatesComplete) || 0, sh = myShare();
    var other = u.kind === 'lab' || u.kind === 'lab-edited'
      ? 'Your Workshop design (14 lines with [slots]) is where these frames came from: it is the earlier version. Small changes: edit the frames here. Big changes: build a new version in the Workshop and press Use in the Scriptorium again, which replaces these frames.'
      : designs ? 'You also have ' + designs + ' Workshop design' + (designs > 1 ? 's' : '') + '. ' + (designs > 1 ? 'They are' : 'It is') + ' not in the Scriptorium. In the Workshop, Use in the Scriptorium replaces the four frames below with that design.'
      : 'The Spellbook Workshop builds a fuller spellbook (14 lines). Use in the Scriptorium there replaces the four frames below.';
    return '<div class="card" id="tpl-inuse" style="padding:12px 16px;margin-bottom:14px"><p class="kicker">The spellbook in the Scriptorium</p><p><b>' + esc(u.text) + '</b></p>' +
      '<p class="tiny">' + esc(other) + (sh ? ' Template share for skeleton and exam essays: ' + Math.round(sh * 100) + '%.' : '') + ' Saved to your ID, so it is the same on every device.</p>' +
      (my.prev ? '<p style="margin-top:8px"><button class="btn sm" id="tpl-restore">Bring back my earlier spellbook</button> <span class="tiny">' + esc(my.prev.fromLabName ? 'Workshop design "' + my.prev.fromLabName + '"' : 'the frames you had before') + '</span></p>' : '') + '</div>';
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
    var html = '<div class="sect-h"><div><h2>Exemplar Archive</h2><p><span class="pill">AI-written</span> These exemplars were written by AI for teaching. Each band is the level the model was written to show, not an examiner\'s mark. Read one, then dissect it: find the four paragraphs, the position, the nuance and the reference words. Then rebuild it from the prompt with the model hidden.</p></div></div>';
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
    html += '<div class="play-top"><button class="btn ghost sm" id="m-back">← The archive</button><span style="flex:1"></span>' +
      ['read', 'dissect', 'rebuild'].concat(m.contrast ? ['contrast'] : []).map(function (k) { return '<button class="btn sm' + (S.modelMode === k ? ' primary' : '') + '" data-mm="' + k + '">' + k.charAt(0).toUpperCase() + k.slice(1) + '</button>'; }).join('') + '</div>';
    html += PR.card(pr, { compact: true });
    var paras = S.modelMode === 'contrast' ? m.contrast.paragraphs : m.paragraphs;
    if (S.modelMode === 'read' || S.modelMode === 'contrast') {
      html += '<div class="model">' + paras.map(function (pg) { return '<div class="mpara ' + pg.role + '"><span class="role">' + esc(ROLE_NAME[pg.role] || pg.role) + '</span>' + esc(pg.text) + '</div>'; }).join('');
      if (S.modelMode === 'read') html += '<div class="patterns">' + (m.patterns || []).map(function (x) { return '<span class="pill gold">' + esc(x) + '</span>'; }).join('') + '<span class="pill">' + m.words + ' words</span><span class="pill">Band ' + esc(m.band) + '</span></div><ul class="notes">' + (m.notes || []).map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul>' + (m.vars ? '<p class="kicker" style="margin-top:12px">The eleven keys behind it</p><ol class="bc-list">' + C.VARIABLES.map(function (v) { return m.vars[v.key] ? '<li><b>' + esc(v.name) + '</b> — ' + esc(m.vars[v.key]) + '</li>' : ''; }).join('') + '</ol>' : '');
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
          '<div class="card preflight"><div class="pf-h"><b>The Ten Wards on your version</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' + pre.rows.filter(function (r) { return r.status !== 'ok'; }).map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') + '</div>';
      });
    }
  }

  /* =====================================================================
     FAULT LIST
     ===================================================================== */
  /* Which sub-module an item belongs to. A systems-check question is sent to
     the sub-module of its module that teaches the same error tag. */
  var ITEM_SUB = null;
  function itemSubId(id) {
    if (!ITEM_SUB) {
      ITEM_SUB = {};
      C.TOPICS.forEach(function (t) {
        t.levels.forEach(function (lv) {
          var tagSub = {};
          lv.subs.forEach(function (sb) { sb.items.forEach(function (it) { ITEM_SUB[it.id] = sb.id; if (!tagSub[it.tag]) tagSub[it.tag] = sb.id; }); });
          (lv.check.items || []).forEach(function (it) { ITEM_SUB[it.id] = tagSub[it.tag] || lv.subs[0].id; });
        });
      });
    }
    return ITEM_SUB[id];
  }
  /* The lessons to go back to, built from the questions this student missed:
     one group per module (the costliest first), the module's podcast and
     video beside it, and a row for each sub-module with its missed count. */
  function faultChecklist(all, due) {
    var dueSet = {}; due.forEach(function (id) { dueSet[id] = 1; });
    var byTopic = {}, order = [];
    all.forEach(function (id) {
      var sb = E.Bank.sub(itemSubId(id));
      if (!sb) return;
      var tid = sb.topicId;
      if (!byTopic[tid]) { byTopic[tid] = { n: 0, subs: {}, subOrder: [] }; order.push(tid); }
      var g = byTopic[tid]; g.n++;
      if (!g.subs[sb.id]) { g.subs[sb.id] = { n: 0, due: 0 }; g.subOrder.push(sb.id); }
      g.subs[sb.id].n++; if (dueSet[id]) g.subs[sb.id].due++;
    });
    if (!order.length) return '';
    order.sort(function (a, b) { return byTopic[b].n - byTopic[a].n; });
    var html = '<div class="sect-h" style="margin-top:22px"><div><h2 style="font-size:1.1rem">Lessons to go back to</h2><p>Built from the questions you missed. Listen to the class on the wireless first, then reopen the lesson.</p></div></div><div class="fx-groups">';
    order.forEach(function (tid) {
      var t = E.Bank.topic(tid), g = byTopic[tid];
      if (!t) return;
      html += '<div class="step"><div class="step-h"><span class="step-n">' + t.n + '</span><span class="step-t"><span class="step-name">' + esc(t.name) + '</span><span class="step-s">' + g.n + (g.n === 1 ? ' question' : ' questions') + ' in the Mending Room</span></span></div>' +
        '<div class="step-b"><div class="ckgroup">' + mediaDrop('fx-' + tid) + '<div class="ckgrid">' + ckMedia(t, 'fx-' + tid) + '<div class="ckstack">' +
        g.subOrder.map(function (sid) {
          var sb = E.Bank.sub(sid), c = g.subs[sid];
          return '<button class="ckrow" data-fx-sub="' + sid + '"><span class="ck-box"></span><span class="ck-txt"><span class="ck-name">' + esc(sb.name) + '</span><span class="ck-sub">' + esc(t.code) + ' · ' + c.n + (c.n === 1 ? ' question' : ' questions') + ' missed' + (c.due ? ' · ' + c.due + ' due now' : '') + '</span></span><span class="ck-go">open →</span></button>';
        }).join('') + '</div></div></div></div></div>';
    });
    return html + '</div>';
  }

  function paintFaults() {
    var due = P.dueReview(S.p), all = Object.keys(S.p.review).filter(function (id) { return E.Bank.item(id); });
    var html = '<div class="sect-h"><div><h2>Mending Room</h2><p>Every question you get wrong is brought here and comes back a day or two later. Get one right twice in a row and it is mended for good. The gap is the point.</p></div></div>';
    if (!all.length) html += '<div class="card empty">The workbench is empty. Every question you have answered wrong has been mended.</div>';
    else {
      html += '<div class="card" style="padding:var(--pad);display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:14px;flex-wrap:wrap"><span class="pill' + (due.length ? ' bad' : ' good') + '" id="fx-due">' + due.length + ' due now' + (due.length ? ' · ' + fxMinutes(due.length) : '') + '</span><span class="pill">' + all.length + ' on the bench</span><span class="pill gold">' + (S.p.reclaimed || 0) + ' mended</span></div>';
      var tagCount = {}; all.forEach(function (id) { var t = E.Bank.item(id).tag; tagCount[t] = (tagCount[t] || 0) + 1; });
      html += '<div style="display:flex;flex-direction:column;gap:7px">' + Object.keys(tagCount).sort(function (a, b) { return tagCount[b] - tagCount[a]; }).map(function (t) { return '<div style="display:flex;justify-content:space-between;gap:12px;font-size:.9rem"><span>' + esc((C.REMEDIATION[t] || {}).name || t) + partnerLink(t) + '</span><span style="color:var(--ink-3);font-family:var(--f-mono);font-size:.82rem">' + tagCount[t] + '</span></div>'; }).join('') + '</div>';
      if (due.length) {
        if (due.length > FX_SITTING) html += '<p class="tiny fx-est">That is a lot at once. Mend ' + FX_SITTING + ' at a time: one sitting now, another when you are ready.</p>';
        html += '<button class="btn primary wide" id="fx-go">Mend ' + Math.min(due.length, FX_SITTING) + ' now · ' + fxMinutes(Math.min(due.length, FX_SITTING)) + '</button>';
        /* mend by class: the due questions of one class only */
        var dueBy = {}, dueOrder = [];
        due.forEach(function (id) { var tid = E.Bank.topicOf(id); if (!tid) return; if (!dueBy[tid]) { dueBy[tid] = 0; dueOrder.push(tid); } dueBy[tid]++; });
        dueOrder.sort(function (a, b) { var ta = E.Bank.topic(a), tb = E.Bank.topic(b); return ((ta && ta.n) || 0) - ((tb && tb.n) || 0); });
        if (dueOrder.length > 1) html += '<div class="fx-bycls"><p class="kicker" style="margin:4px 0 0">Or mend one class</p><div class="filters fx-mods">' + dueOrder.map(function (tid) { var t = E.Bank.topic(tid); return '<button type="button" data-fx-mod="' + esc(tid) + '">' + esc(t ? t.code + ' · ' + t.name : tid) + ' · ' + dueBy[tid] + '</button>'; }).join('') + '</div></div>';
      } else html += '<p class="tiny">Nothing is due yet. Questions come back after a day or two.</p>';
      html += '</div>';
      html += faultChecklist(all, due);
    }
    $('#view-faults').innerHTML = html;
    wireMedia($('#view-faults'));
    $('#view-faults').querySelectorAll('[data-fx-sub]').forEach(function (b) { b.addEventListener('click', function () { S.returnTo = 'faults'; openSub(b.dataset.fxSub); }); });
    var g = $('#fx-go');
    if (g) g.addEventListener('click', function () { startMending(''); });
    $('#view-faults').querySelectorAll('[data-fx-mod]').forEach(function (b) { b.addEventListener('click', function () { startMending(b.dataset.fxMod); }); });
  }
  /* One sitting in the Mending Room is at most FX_SITTING questions (about 25 seconds each),
     from every class or from one, so fifty due never feels endless. */
  var FX_SITTING = 15, FX_SECONDS = 25;
  function fxDue(topicId) { return P.dueReview(S.p).filter(function (id) { return !topicId || E.Bank.topicOf(id) === topicId; }); }
  function fxMinutes(n) { var m = Math.max(1, Math.round(n * FX_SECONDS / 60)); return 'about ' + m + (m === 1 ? ' minute' : ' minutes'); }
  function startMending(topicId) {
    var list = fxDue(topicId);
    if (!list.length) { show('faults'); return; }
    S.returnTo = 'faults';
    startRun('faults', E.shuffle(list).slice(0, FX_SITTING).map(E.Bank.item), { title: 'Mending Room', fxTopic: topicId || '' });
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
    var html = '<div class="sect-h"><div><h2>Report Card</h2><p>Your essays, the bands the examiners gave them, every class, and every keepsake.</p></div></div>';
    html += '<div class="card" style="padding:var(--pad);margin-bottom:14px"><h3 style="margin-bottom:8px">Essays</h3><div id="rec-list" class="replist"><p class="tiny">Loading…</p></div></div>';
    html += '<div class="card" style="padding:var(--pad);margin-bottom:14px"><h3 style="margin-bottom:10px">Classes</h3><div class="sysgrid">' + C.TOPICS.map(function (t) { var lv = t.levels[0], ck = p.checks[lv.check.id], green = ck && ck.best >= E.PASS_CHECK; return '<div class="systile' + (green ? ' done' : '') + '"><b>' + esc(t.name) + '</b><span>' + esc(t.code) + ' · ' + P.topicPct(p, t) + '%</span></div>'; }).join('') + '</div></div>';
    html += (ST && window.STORY ? '<div class="card" style="padding:var(--pad);margin-bottom:14px"><h3 style="margin-bottom:10px">Keepsakes from the story</h3>' + ST.keepsakesHtml(p) + '</div>' : '');
    html += '<div class="card" style="padding:var(--pad)"><h3 style="margin-bottom:10px">Keepsakes</h3><div class="awards">' + C.BADGES.map(function (b) { var got = p.badges.indexOf(b.id) >= 0; return '<div class="award ' + (got ? 'got' : 'locked') + '"><span class="award-i">' + (got ? '★' : '·') + '</span><span><span class="award-n">' + esc(b.name) + '</span><span class="award-p">' + esc(b.perk) + '</span><span class="award-h">' + esc(b.how) + '</span></span></div>'; }).join('') + '</div></div>';
    $('#view-record').innerHTML = html;
    api.reports(p.studentId).then(function (r) {
      var reps = ((r && r.reports) || []).slice().sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
      S.reports = reps;
      var changed = false;
      /* oldest first, so "better than her best band for the type" compares with the earlier essays (WP11b) */
      reps.slice().reverse().forEach(function (rp) { var bands = bandsOf(rp); if (bands) { var hit = P.applyBands(p, rp.id, bands); if (hit) changed = true; } });
      if (changed) { P.checkBadges(p); paintHeader(); syncSoon(); }
      if (S.openAfter) { var want = S.openAfter; S.openAfter = ''; if (reps.some(function (x) { return x.id === want; })) { openReport(want); return; } }
      var host = $('#rec-list');
      if (!reps.length) { host.innerHTML = '<p class="tiny">No essays yet. Open the Scriptorium and write one.</p>'; return; }
      host.innerHTML = trajectory(reps.slice().reverse().map(function (rp) { return { type: rp.type, bands: bandsOf(rp) }; })) +
        reps.map(function (rp) {
          var bands = bandsOf(rp), pr = PR.get(rp.promptId) || {};
          var revs = reps.filter(function (x) { return x.revisionOf === rp.id; }).length, orig = rp.revisionOf ? reps.filter(function (x) { return x.id === rp.revisionOf; })[0] : null;
          var link = rp.revisionOf ? ' · revision of the essay of ' + (orig ? String(orig.ts).slice(0, 10) : 'an earlier essay') + (rp.reviseBox ? ' (' + (PARA_NAME[rp.reviseBox] || rp.reviseBox) + ')' : '') : revs ? ' · revised ' + revs + '×' : '';
          return '<button class="rep" data-r="' + esc(rp.id) + '"' + (rp.revisionOf ? ' data-rev-of="' + esc(rp.revisionOf) + '" style="margin-left:18px"' : '') + '><span class="rep-t"><span class="rep-n">' + (rp.revisionOf ? '↳ ' : '') + esc(pr.title || rp.promptId) + '</span><span class="rep-s">' + esc(String(rp.ts).slice(0, 10) + ' · ' + typeName(rp.type) + ' · ' + rp.words + ' words · ' + mmss(rp.seconds || 0) + ' · ' + (rp.uiMode || '') + ' · ' + (rp.kind || 'practice') + (rp.preflight ? ' · ' + rp.preflight.bad + ' red' : '') + link + (frameOnly(rp) ? ' · mostly frame' : '')) + '</span></span><span class="rep-b">' + (bands ? fmtBand(bands.overall) : (rp.status === 'submitted' ? '…' : '—')) + '</span></button>';
        }).join('');
      host.querySelectorAll('[data-r]').forEach(function (b) { b.addEventListener('click', function () { openReport(b.dataset.r); }); });
    });
  }
  function openReport(id) {
    var rp = (S.reports || []).filter(function (x) { return x.id === id; })[0];
    if (!rp) return;
    var pr = PR.get(rp.promptId) || {};
    var mark = rp.released && rp.teacher && rp.teacher.bands ? rp.teacher : (rp.aiVisible && rp.ai ? rp.ai : null);
    var orig = rp.revisionOf ? (S.reports || []).filter(function (x) { return x.id === rp.revisionOf; })[0] : null;
    var later = (S.reports || []).filter(function (x) { return x.revisionOf === rp.id; });
    var links = (rp.revisionOf ? '<p class="tiny" id="rp-revof">A revision of ' + (orig ? '<button class="linky rev-link" data-rlink="' + esc(orig.id) + '">your essay of ' + esc(String(orig.ts).slice(0, 10)) + ' →</button>' : 'an earlier essay') + (rp.reviseBox ? ' · the paragraph you revised: ' + esc(PARA_NAME[rp.reviseBox] || rp.reviseBox) : '') + '</p>' : '') +
      (later.length ? '<p class="tiny" id="rp-revised">Revised: ' + later.map(function (x) { return '<button class="linky rev-link" data-rlink="' + esc(x.id) + '">' + esc(String(x.ts).slice(0, 10)) + (x.reviseBox ? ' (' + esc(PARA_NAME[x.reviseBox] || x.reviseBox) + ')' : '') + ' →</button>'; }).join(' ') + '</p>' : '');
    var html = '<div class="play"><div class="play-top"><button class="btn ghost sm" id="rp-back">← Report Card</button><span style="flex:1"></span><span class="qcount">' + esc(String(rp.ts).slice(0, 10)) + '</span></div>' + links + PR.card(pr, { compact: true }) +
      '<div class="model">' + W.paragraphs(rp.text).map(function (t) { return '<div class="mpara">' + esc(t) + '</div>'; }).join('') + '</div>';
    if (mark) {
      var b = mark.bands;
      html += '<div class="card preflight"><div class="pf-h"><b>' + (rp.released ? 'Marked by T.Chris' : 'The examiners\' estimate') + '</b><span class="pill gold">' + (mark.cefr ? esc(mark.cefr) : '') + '</span></div><div class="bands">' +
        [['tr', 'TR'], ['cc', 'CC'], ['lr', 'LR'], ['gra', 'GRA']].map(function (k) { return '<div class="band"><b>' + fmtBand(b[k[0]] != null ? b[k[0]] : b.ta) + '</b><span>' + k[1] + '</span></div>'; }).join('') + '<div class="band overall"><b>' + fmtBand(b.overall) + '</b><span>Overall</span></div></div>' +
        (mark.comment ? '<div class="comment">' + esc(mark.comment) + '</div>' : '') +
        (mark.errors && mark.errors.length ? '<div class="errs" style="margin-top:10px">' + mark.errors.map(function (e) { var rem = C.REMEDIATION[e.tag] || {}; return '<div class="err"><b>' + esc(rem.name || e.tag) + '</b><q>' + esc(e.quote) + '</q> → ' + esc(e.fix) + '</div>'; }).join('') + '</div>' : '') + '</div>';
    } else {
      html += '<div class="card preflight"><div class="pf-h"><b>The Ten Wards at submission</b><span class="pill ' + (rp.preflight && rp.preflight.bad ? 'bad' : 'good') + '">' + (rp.preflight ? rp.preflight.bad + ' red · ' + rp.preflight.warn + ' amber' : '') + '</span></div>' + ((rp.preflight && rp.preflight.rows) || []).filter(function (r) { return r.status !== 'ok'; }).map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b></div></div>'; }).join('') + '<p class="tiny" style="margin-top:8px">T.Chris has not released a mark for this essay yet.</p></div>';
    }
    var canRev = rp.kind !== 'mock' && rp.text, redRows = !!(rp.preflight && Number(rp.preflight.bad) > 0);
    html += (canRev && !redRows ? '<p class="tiny" id="rp-norev">This essay has no red rows: revise it for practice, or move on.</p>' : '') +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px">' + (canRev ? '<button class="btn' + (redRows ? ' primary' : '') + '" id="rp-revise">' + (redRows ? 'Revise your weakest row' : 'Revise for practice') + '</button>' : '') + '<button class="btn' + (canRev && redRows ? '' : ' primary') + '" id="rp-levelup">Send to the examiners →</button><button class="btn" id="rp-copy">Copy essay</button>' + (canRev ? '<button class="btn" id="rp-owl">Send a paragraph by owl</button>' : '') + '</div></div>';
    $('#view-record').innerHTML = html;
    $('#view-record').querySelectorAll('[data-rlink]').forEach(function (b) { b.addEventListener('click', function () { openReport(b.dataset.rlink); }); });
    if (canRev) $('#rp-revise').addEventListener('click', function () { startWrite(reviseCfg(rp, rp, 'record')); });
    var rpo = $('#rp-owl'); if (rpo) rpo.addEventListener('click', function () { owlSendModal(rp, rp.text); });
    $('#rp-back').addEventListener('click', paintRecord);
    $('#rp-levelup').addEventListener('click', function () { handoff(pr, rp.text, rp); });
    $('#rp-copy').addEventListener('click', function () { try { navigator.clipboard.writeText(rp.text); toast('Essay copied.'); } catch (e) { prompt('Copy your essay', rp.text); } });
    window.scrollTo({ top: 0 });
  }

  /* =====================================================================
     THE OWL EXCHANGE (WP10d, 20 Oct 2026). A student sends one anonymous body paragraph by owl to her
     house (same cohort). A housemate who opens it tags its mechanism, example and nuance sentence; the
     sender has tagged her own first, and both see where the two readings agree. No names travel either
     way. Backend: action `owl` (send · list · tag) on the Owls sheet; offline: localStorage (api.js).
     ===================================================================== */
  var OWL = { at: 0, data: null, sid: '' };
  var OWL_ROLES = [['mech', 'Mechanism'], ['ex', 'Example'], ['nuance', 'Nuance']];
  function owlBodies(text) {
    var ps = W.paragraphs(text || ''); if (ps.length >= 4) return [['bodyA', ps[1]], ['bodyB', ps[2]]];
    if (ps.length === 3) return [['bodyA', ps[1]]];
    return ps.length ? [['bodyA', ps[0]]] : [];
  }
  function owlSentences(para) { return W.sentences(para).filter(function (x) { return W.words(x) >= 3; }); }
  function owlTagForm(sentences, prefix) {
    return '<ol class="owl-sents">' + sentences.map(function (x, i) {
      return '<li><span class="owl-s">' + esc(x) + '</span><select class="owl-role" data-owl-i="' + i + '" id="' + prefix + '-' + i + '"><option value="">—</option>' + OWL_ROLES.map(function (r) { return '<option value="' + r[0] + '">' + r[1] + '</option>'; }).join('') + '</select></li>';
    }).join('') + '</ol>';
  }
  function owlReadTags(root) {
    var tags = {}, dup = false;
    root.querySelectorAll('.owl-role').forEach(function (sel) { if (!sel.value) return; if (tags[sel.value] != null) dup = true; tags[sel.value] = Number(sel.dataset.owlI); });
    var missing = OWL_ROLES.filter(function (r) { return tags[r[0]] == null; }).map(function (r) { return r[1]; });
    return { tags: tags, dup: dup, missing: missing };
  }
  function owlCompareHtml(sentences, self, tags) {
    return '<ul class="ftnotes"><li>' + OWL_ROLES.map(function (r) {
      var a = self ? self[r[0]] : null, b = tags ? tags[r[0]] : null, same = a != null && b != null && a === b;
      return '<b>' + r[1] + ':</b> ' + (same ? 'you both chose sentence ' + (a + 1) + ' ✓' : 'the writer chose sentence ' + (a == null ? '—' : a + 1) + ', the reader chose sentence ' + (b == null ? '—' : b + 1) + '.');
    }).join('</li><li>') + '</li></ul><p class="tiny">Where the two readings differ, the sentence may be doing two jobs, or its job is not clear yet. The Wards look for exactly these three.</p>';
  }
  function owlSendModal(rep, text) {
    var ss = ST ? ST.ensure(S.p) : null, house = ss && ss.house;
    if (!house) { toast('The owl exchange opens once the Lantern has sorted you.'); return; }
    var bodies = owlBodies(text); if (!bodies.length) { toast('No body paragraph to send yet.'); return; }
    var pick = 0;
    function paint() {
      var para = bodies[pick][1], sents = owlSentences(para);
      modal('<p class="kicker">Owl exchange</p><h3 style="font-size:1.25rem">Send a body paragraph to a housemate</h3><p class="tiny">A housemate in ' + esc(ST.house(S.p).name) + ' will tag its mechanism, example and nuance. No names travel with the owl. Mark your own three sentences first, so you can both see where you agree.</p>' +
        (bodies.length > 1 ? '<div class="filters" id="owl-pick">' + bodies.map(function (b, i) { return '<button data-owl-pick="' + i + '"' + (i === pick ? ' class="on"' : '') + '>' + (b[0] === 'bodyA' ? 'Body A' : 'Body B') + '</button>'; }).join('') + '</div>' : '') +
        owlTagForm(sents, 'owl-self') + '<div id="owl-msg" class="tiny"></div><div class="wcard-acts"><button class="btn primary" id="owl-send">Send by owl</button><button class="btn ghost" data-close>Not now</button></div>');
      var slot = $('#modal-slot');
      slot.querySelectorAll('[data-owl-pick]').forEach(function (b) { b.addEventListener('click', function () { pick = Number(b.dataset.owlPick); paint(); }); });
      $('#owl-send').addEventListener('click', function () {
        var r = owlReadTags(slot), msg = $('#owl-msg');
        if (r.dup) { msg.textContent = 'Each role goes on one sentence only.'; return; }
        if (r.missing.length) { msg.textContent = 'Mark your ' + r.missing.join(', ').toLowerCase() + ' first.'; return; }
        $('#owl-send').disabled = true; msg.textContent = 'Nutmeg is taking off…';
        var row = { id: uid('O'), ts: new Date().toISOString(), fromId: S.p.studentId, cohort: S.p.cohort || '', house: house, promptId: rep.promptId, reportId: rep.id, para: bodies[pick][0], sentences: sents.slice(0, 12), selfTags: r.tags };
        api.owl('send', row).then(function (res) {
          if (!res || !res.ok) { $('#owl-send').disabled = false; msg.textContent = owlError(res); return; }
          OWL.at = 0; $('#modal-slot').innerHTML = ''; toast('Your owl is on its way to a housemate. The answer comes to the Map Room.', 3600);
        });
      });
    }
    paint();
  }
  function owlError(res) {
    var e = res && res.error ? String(res.error) : '';
    if (/flying/i.test(e)) return 'Your last owl is still flying: wait until a housemate has read it.';
    if (/Unknown action/i.test(e) || !e) return 'The owl exchange starts after the class server is redeployed.';
    return e;
  }
  function owlTagModal(o) {
    var sents = o.sentences || [];
    modal('<p class="kicker">An owl from a housemate · ' + esc((PR.get(o.promptId) || {}).title || '') + '</p><h3 style="font-size:1.25rem">Tag the mechanism, the example and the nuance</h3><p class="tiny">Read the paragraph and mark which sentence does each job. The writer marked hers already; you both see the result. No names.</p>' +
      owlTagForm(sents, 'owl-tag') + '<div id="owl-msg" class="tiny"></div><div class="wcard-acts"><button class="btn primary" id="owl-tagsend">Send my tags</button><button class="btn ghost" data-close>Later</button></div>');
    var slot = $('#modal-slot');
    $('#owl-tagsend').addEventListener('click', function () {
      var r = owlReadTags(slot), msg = $('#owl-msg');
      if (r.dup) { msg.textContent = 'Each role goes on one sentence only.'; return; }
      if (r.missing.length) { msg.textContent = 'Mark the ' + r.missing.join(', ').toLowerCase() + ' too.'; return; }
      $('#owl-tagsend').disabled = true;
      api.owl('tag', { id: o.id, fromId: S.p.studentId, tags: r.tags }).then(function (res) {
        if (!res || !res.ok) { $('#owl-tagsend').disabled = false; msg.textContent = owlError(res); return; }
        var got = res.owl || o;
        S.p.xp = (S.p.xp || 0) + 15; paintHeader(); syncSoon(); OWL.at = 0;
        modal('<p class="kicker">Owl exchange · the result</p><h3 style="font-size:1.2rem">Two readings of one paragraph</h3>' + owlCompareHtml(got.sentences || sents, got.selfTags, r.tags) + '<p class="tiny">+15 merits for reading a housemate\'s paragraph.</p><button class="btn primary wide" data-close>Done</button>');
        var b = $('#modal-slot [data-close]'); if (b) b.addEventListener('click', function () { paintOwlSlot($('#owl-slot')); });
      });
    });
  }
  function paintOwlSlot(el) {
    if (!el || !ST || !S.p) return;
    var ss = ST.ensure(S.p);
    if (!ss.house || !(ST.reached(S.p, 4) || (S.p.reports || []).length)) { el.innerHTML = ''; return; }
    var sid = S.p.studentId;
    function render(d, note) {
      var html = '<div class="card owlx" id="owlx"><div class="sect-h" style="margin-bottom:6px"><div><h3>Owl exchange · ' + esc(ST.house(S.p).name) + '</h3><p class="tiny">Send one body paragraph to your house, and tag a housemate\'s. No names either way.</p></div></div>';
      if (note) html += '<p class="tiny">' + esc(note) + '</p>';
      else {
        var forMe = d.forMe || [], mine = d.mine || [];
        if (forMe.length) html += forMe.map(function (o) { return '<button class="ckrow" data-owl-tag="' + esc(o.id) + '"><span class="ck-box">✉</span><span class="ck-txt"><span class="ck-name">An owl from a housemate: ' + esc((PR.get(o.promptId) || {}).title || 'a body paragraph') + '</span><span class="ck-sub">Tag its mechanism, example and nuance. About three minutes.</span></span><span class="ck-go">open →</span></button>'; }).join('');
        else html += '<p class="tiny">No owl is waiting for you right now.</p>';
        if (mine.length) html += mine.slice(-2).map(function (o) {
          return '<div class="owl-mine' + (o.tags ? ' done' : '') + '"><b>Your owl · ' + esc((PR.get(o.promptId) || {}).title || '') + '</b> <span class="tiny">' + (o.tags ? 'read by a housemate' : 'still flying: no housemate has read it yet') + '</span>' + (o.tags ? owlCompareHtml(o.sentences || [], o.selfTags, o.tags) : '') + '</div>';
        }).join('');
        html += '<p class="tiny">To send one: open an essay on your Report Card, or the result screen after you submit, and tap "Send a paragraph by owl".</p>';
      }
      el.innerHTML = html + '</div>';
      el.querySelectorAll('[data-owl-tag]').forEach(function (b) { b.addEventListener('click', function () { var o = (d.forMe || []).filter(function (x) { return x.id === b.dataset.owlTag; })[0]; if (o) owlTagModal(o); }); });
    }
    if (OWL.sid === sid && OWL.data && Date.now() - OWL.at < 60000) { render(OWL.data); return; }
    el.innerHTML = '<div class="card owlx" id="owlx"><p class="tiny">Looking for owls…</p></div>';
    api.owl('list', { fromId: sid, house: ss.house, cohort: S.p.cohort || '' }).then(function (r) {
      if (!r || !r.ok) { render({}, owlError(r)); return; }
      OWL.sid = sid; OWL.at = Date.now(); OWL.data = r; render(r);
    }).catch(function () { render({}, 'The owl exchange starts after the class server is redeployed.'); });
  }

  /* =====================================================================
     THE DUELLING HALL (bootcamp.js): the whole plan applied to one prompt, step by step
     ===================================================================== */
  var BC = window.Bootcamp;
  function bootState() { if (!S.p.bootcamp) S.p.bootcamp = { points: 0, missions: {} }; return S.p.bootcamp; }
  function paintBootcamp() {
    var bs = bootState(), rank = BC.rankFor(bs.points), nxt = BC.nextRank(bs.points);
    var cleared = Object.keys(bs.missions).filter(function (k) { return bs.missions[k].passed; }).length;
    var cp = coreProgress(S.p), fiveWon = cp.steps.filter(function (x) { return x.duel; }).length;
    var html = '<div class="sect-h"><div><h2>Duelling Hall</h2><p>One prompt, the whole plan, one decision at a time: time, decode, the Core Topic, side A, side B, the position, the frames and the Ten Wards. Every question is a drop-down. Hints cost ' + BC.POINTS.hint + ' points; a correct second choice earns ' + BC.POINTS.second + '. Win a duel at ' + Math.round(BC.POINTS.pass * 100) + '%. Fighting a prompt again adds points only when you beat your best on it.</p></div></div>';
    var dt = duelTier();
    html += '<div class="lvl-bar" role="group" aria-label="Choose the level of the answer options"><span class="lvl-lbl">Answer options at my level:</span>' + DUEL_LVLS.map(function (l) { return '<button type="button" class="lvl-btn' + (l === dt ? ' on' : '') + '" data-duel-lvl="' + l + '" aria-pressed="' + (l === dt) + '">' + l + '</button>'; }).join('') + '<span class="tiny" style="flex-basis:100%">The prompts stay in exam English. This changes the English of the eleven-key choices.</span></div>';
    /* Short duels (Oct 2026): the fixed steps only in the first three duels, then a "Full duel" switch. */
    var nDuelled = BC.duelled(bs);
    if (nDuelled < BC.SHORT_AFTER) html += '<p class="tiny" id="bc-mode-note" style="margin:-6px 0 14px">Your first ' + BC.SHORT_AFTER + ' duels ask every step (' + nDuelled + ' of ' + BC.SHORT_AFTER + ' fought). After that, a duel starts at the Core Topic and takes about ten minutes.</p>';
    else html += '<div class="lvl-bar" role="group" aria-label="Choose short or full duels"><span class="lvl-lbl">Duel length:</span><button type="button" class="lvl-btn' + (bs.full ? '' : ' on') + '" data-duel-mode="short" aria-pressed="' + !bs.full + '">Short duel</button><button type="button" class="lvl-btn' + (bs.full ? ' on' : '') + '" id="bc-full" data-duel-mode="full" aria-pressed="' + !!bs.full + '">Full duel</button><span class="tiny" style="flex-basis:100%">' + (bs.full ? 'Full duel: every step, from the time and the decode to the Ten Wards.' : 'Short duel: from the Core Topic to the frames. Choose Full duel for every step.') + '</span></div>';
    /* WP8 (20 Oct 2026): a per-step clock, off by default; the Midwinter Tournament turns it on for its duel. */
    html += '<div class="lvl-bar" role="group" aria-label="Step clock"><span class="lvl-lbl">Step clock:</span><button type="button" class="lvl-btn' + (bs.clock ? '' : ' on') + '" data-duel-clock="off" aria-pressed="' + !bs.clock + '">Off</button><button type="button" class="lvl-btn' + (bs.clock ? ' on' : '') + '" data-duel-clock="on" aria-pressed="' + !!bs.clock + '">On</button><span class="tiny" style="flex-basis:100%">' + (bs.clock ? BC.CLOCK_PER_Q + ' seconds a question on every step. When the clock runs out, the open questions on that step go to your opponent.' : 'No clock. The tournament duel runs its own clock (' + BC.CLOCK_PER_Q + ' seconds a question).') + '</span></div>';
    html += '<div class="gates" style="grid-template-columns:repeat(2,1fr)"><div class="gate"><span>Duelling rank</span><b>' + esc(rank.name) + '</b><small>' + bs.points + ' points' + (nxt ? ' · ' + (nxt.min - bs.points) + ' to ' + esc(nxt.name) : ' · top rank') + '</small><div class="bar-line gold"><span style="width:' + (nxt ? Math.round(100 * (bs.points - rank.min) / (nxt.min - rank.min)) : 100) + '%"></span></div></div><div class="gate"><span>Your five won</span><b>' + fiveWon + ' of ' + cp.ids.length + '</b><small>' + cleared + ' duel' + (cleared === 1 ? '' : 's') + ' won in all · win at ' + Math.round(BC.POINTS.pass * 100) + '%</small></div></div>';
    html += '<div class="card" style="padding:14px 16px;margin-bottom:16px"><p class="kicker">The Ten Wards</p><ol class="bc-list">' + BC.CHECKLIST.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol></div>';
    /* E4: her five first, in order; the rest as extra practice */
    html += coreHead(cp, 'bc') + '<div class="promptgrid" id="bc-five">' + cp.ids.map(function (id, i) {
      var pr = PR.get(id), m = bs.missions[id]; return pr ? coreCard(pr, i, cp, 'data-bc="' + pr.id + '"', m ? '<span class="pill' + (m.passed ? ' good' : ' bad') + '">best ' + m.best + '%</span>' : '') : '';
    }).join('') + '</div>';
    var order = practicePrompts().filter(function (pr) { return cp.ids.indexOf(pr.id) < 0; }).sort(function (a, b) { return Object.keys(C.TYPES).indexOf(a.type) - Object.keys(C.TYPES).indexOf(b.type) || a.title.localeCompare(b.title); });
    html += extraHead('bc', order.length) + '<div class="promptgrid" id="bc-extra">' + order.map(function (pr) {
      var m = bs.missions[pr.id];
      return '<button class="pcard' + (m && m.passed ? ' done' : '') + '" data-bc="' + pr.id + '"><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span><span class="pill">' + esc(PR.domainName(pr.domain)) + '</span>' + (m ? '<span class="pill' + (m.passed ? ' good' : ' bad') + '">best ' + m.best + '%</span>' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
    }).join('') + '</div>';
    $('#view-bootcamp').innerHTML = html;
    $('#view-bootcamp').querySelectorAll('[data-bc]').forEach(function (b) { b.addEventListener('click', function () { startBootcamp(b.dataset.bc); }); });
    $('#view-bootcamp').querySelectorAll('[data-duel-lvl]').forEach(function (b) { b.addEventListener('click', function () { S.p.duelTier = b.dataset.duelLvl; syncSoon(); paintBootcamp(); toast('Duel answers at ' + b.dataset.duelLvl + '.'); }); });
    $('#view-bootcamp').querySelectorAll('[data-duel-mode]').forEach(function (b) { b.addEventListener('click', function () { bs.full = b.dataset.duelMode === 'full'; syncSoon(); paintBootcamp(); toast(bs.full ? 'Full duels: every step.' : 'Short duels: from the Core Topic.'); }); });
    $('#view-bootcamp').querySelectorAll('[data-duel-clock]').forEach(function (b) { b.addEventListener('click', function () { bs.clock = b.dataset.duelClock === 'on'; syncSoon(); paintBootcamp(); toast(bs.clock ? 'Step clock on.' : 'Step clock off.'); }); });
  }
  /* The tournament's duel task is open: she has entered the Hall and not yet done a duel since. */
  function inTournamentDuel() {
    var ss = ST && S.p ? ST.ensure(S.p) : null, t = ss && ss.tournament;
    return !!(t && t.started && !(t.done || {})['tour-duel']);
  }
  /* B10 (Oct 2026): a duel adds rank points and merits only for the improvement on this prompt's best
     points (m.bestPts), so a prompt cannot be farmed. Older records have only the best percentage of a
     full duel; their best points are worked out from it. */
  function duelBestPts(m, pr, lvl) {
    if (!m || !(m.attempts > 0)) return 0;
    if (typeof m.bestPts === 'number') return m.bestPts;
    var full = pr ? BC.build(pr, m.level || lvl).total : 0;
    return Math.round((m.best || 0) * full / 100);
  }
  function startBootcamp(promptId, forceFull) {
    show('bootrun');
    var dlv = duelTier(), bs0 = bootState(), pr0 = PR.get(promptId);
    var short = !forceFull && BC.isShortDuel(bs0);
    var prevBest = duelBestPts(bs0.missions[promptId], pr0, dlv), liveXp = 0;
    /* WP10a: the term-project scene above her first duel on one of her five (readable again from the Map Room);
       WP8: the clock from the Hall switch, or the tournament's duel. The duel itself mounts in #bc-host. */
    var m0 = bs0.missions[promptId], scene = (ST && ST.projectSceneHtml && !(m0 && m0.attempts > 0)) ? ST.projectSceneHtml(promptId) : '';
    var clock = !!bs0.clock || inTournamentDuel();
    $('#view-bootrun').innerHTML = (scene ? '<div id="proj-scene-wrap">' + scene + '</div>' : '') + '<div id="bc-host"></div>';
    if (scene && ST) { ST.wireWords($('#proj-scene-wrap')); ST.wireArt($('#proj-scene-wrap')); }
    S.boot = BC.mount($('#bc-host'), { prompt: promptId, tier: dlv, short: short, clock: clock,
      onQuit: function () { S.boot = null; show('bootcamp'); },
      onFullDuel: function () { S.boot = null; startBootcamp(promptId, true); },
      onAnswer: function (a) {
        var t = S.p.stats.byTag[a.tag] || (S.p.stats.byTag[a.tag] = { a: 0, c: 0 });
        t.a++; if (a.correct) t.c++;
        S.p.stats.seen++; if (a.correct) S.p.stats.correct++;
        /* merits only once the running score passes the best on this prompt */
        var due = Math.max(0, a.runPoints - prevBest);
        if (due > liveXp) { S.p.xp += due - liveXp; liveXp = due; }
        S.sessItems++; if (a.correct) S.sessCorrect++;
        /* B14: the chosen option, the key and the time go to the Answer log (same columns) */
        var given = a.second ? '1st: ' + a.firstGiven + ' | 2nd: ' + a.given : a.given;
        api.enqueue([{ ts: new Date().toISOString(), studentId: S.p.studentId, itemId: 'bc-' + a.promptId + '-' + a.id, topic: 'bootcamp', level: dlv, type: 'choose', tag: a.tag, cefr: dlv, correct: a.correct ? 1 : 0, ms: Math.round(a.ms || 0), hinted: a.hinted ? 1 : 0, fast: 0, mode: 'bootcamp', given: String(given).slice(0, 400), expected: String(a.expected || '').slice(0, 300) }]);
        paintHeader(); syncSoon();
      },
      onDone: function (res) {
        S.boot = null;
        var bs = bootState(), pctScore = Math.round(100 * res.points / res.total);
        var m = bs.missions[res.promptId] || (bs.missions[res.promptId] = { best: 0, attempts: 0 });
        var gainPts = Math.max(0, res.points - prevBest), firstWin = res.passed && !m.passed;
        m.attempts++; if (pctScore > m.best) m.best = pctScore; m.bestPts = Math.max(prevBest, res.points); m.passed = m.passed || res.passed; m.at = new Date().toISOString(); m.level = res.tier || dlv; m.lastMode = res.short ? 'short' : 'full'; if (res.passed) { m.won = m.won || {}; m.won[m.level] = 1; }
        var before = BC.rankFor(bs.points).name;
        bs.points += gainPts;
        var after = BC.rankFor(bs.points);
        if (gainPts > liveXp) { S.p.xp += gainPts - liveXp; liveXp = gainPts; }
        if (firstWin) S.p.xp += 60;
        var earned = P.checkBadges(S.p);
        paintHeader(); sync();
        var pr = PR.get(res.promptId) || {};
        var gainLine = m.attempts > 1 ? (gainPts > 0 ? ' +' + gainPts + ' rank points: a new best on this prompt.' : ' No new rank points: your best here is ' + m.bestPts + ' points. Beat it to earn more.') : ' +' + gainPts + ' rank points.';
        var op = res.opponent || null;
        $('#view-bootrun').innerHTML = '<div class="play"><div class="card result"><div class="score-ring" style="--p:' + pctScore + '"><i>' + pctScore + '%</i></div><h3>' + (res.passed ? 'Duel won' : 'Duel lost: fight it again') + '</h3>' +
          (op ? '<p class="bc-line ' + (res.passed ? 'won' : 'lost') + '" id="bc-endline">' + esc(op.line || '') + ' <span class="tiny">(' + esc(op.name) + ' took ' + (op.steps - op.stepsWon) + ' of ' + op.steps + ' steps)</span></p>' : '') +
          '<p>' + res.points + ' of ' + res.total + ' points on ' + esc(pr.title) + (res.short ? ' (short duel)' : '') + (res.clock ? ', with the step clock' : '') + '.' + esc(gainLine) + (firstWin ? ' +60 merits for your first win here.' : '') + ' ' + (after.name !== before ? 'You are now ' + esc(after.name) + '!' : 'Duelling rank: ' + esc(after.name) + ' (' + bs.points + ' points).') + '</p>' +
          (function () { var seen = {}, miss = res.log.filter(function (l) { if (l.correct || seen[l.tag]) return false; seen[l.tag] = 1; return true; }); return miss.length ? '<div class="misslist">' + miss.map(function (l) { var rem = C.REMEDIATION[l.tag] || {}; return '<div class="miss"><b>' + esc(rem.name || l.tag) + '</b>' + esc(rem.principle || '') + '</div>'; }).join('') + '</div>' : ''; })() +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn primary" id="bc-back">Back to the Duelling Hall</button><button class="btn" id="bc-again">Duel again</button><button class="btn" id="bc-write">Write this essay in the Scriptorium</button></div></div></div>';
        $('#bc-back').addEventListener('click', function () { show('bootcamp'); });
        $('#bc-again').addEventListener('click', function () { startBootcamp(res.promptId, forceFull); });
        $('#bc-write').addEventListener('click', function () { startWrite({ promptId: res.promptId, uiMode: 'guided', minutes: 40, kind: 'practice' }); });
        if (earned.length) S.celebrateTimer = setTimeout(function () { celebrate(earned[0], earned.slice(1)); }, 600);
      } });
  }

  /* =====================================================================
     ASSEMBLY (projector games)
     ===================================================================== */
  var L = { round: null, team: '', posts: 0 };
  function paintLive() {
    var html = '<div class="sect-h"><div><h2>Assembly</h2><p>T.Chris shows a prompt on the projector and a round code. Enter the code and your team name, then post your team\'s sentences.</p></div></div>';
    if (!L.round) {
      html += '<div class="card settings"><div class="field"><label for="lv-code">Round code</label><input id="lv-code" type="text" placeholder="e.g. L7K2Q" spellcheck="false" style="text-transform:uppercase"></div><div class="field"><label for="lv-team">Team name</label><input id="lv-team" type="text" placeholder="e.g. Team Compass" value="' + esc(L.team) + '"></div><div id="lv-msg" class="msg bad hidden"></div><button class="btn primary" id="lv-join">Join</button></div>';
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
      api.projector('post', { kind: 'post', id: uid('P'), round: L.round.round, team: L.team, studentId: S.p.studentId, text: t.slice(0, 900), ts: new Date().toISOString() }).then(function (res) { if (res && res.ok === false) { toast('Not posted: ' + (res.error || 'try again')); return; } L.posts++; $('#lv-text').value = ''; $('#lv-n').textContent = L.posts + ' posted.'; toast('Posted.'); });
    });
    $('#lv-leave').addEventListener('click', function () { L.round = null; paintLive(); });
  }

  /* =====================================================================
     SETTINGS
     ===================================================================== */
  function paintSettings() {
    var theme = document.documentElement.getAttribute('data-theme') || 'auto';
    var THEME_NAME = { auto: 'Follow the device', light: 'Parchment', dark: 'Night castle' };
    var h = ST ? ST.house(S.p) : null, ss = ST ? ST.ensure(S.p) : null;
    var unlocked = ss && ss.unlockedTo >= (ST.chapters().length || 7);
    $('#view-settings').innerHTML = '<div class="sect-h"><div><h2>Your Trunk</h2><p>Your track, the look of the castle, and the things T.Chris set for you.</p></div></div><div class="card settings">' +
      (h ? '<div class="field"><label>Your house</label><p style="display:flex;align-items:center;gap:10px">' + ST.crestSvg(h.id, 32) + '<span><b>' + esc(h.name) + '</b> · ' + esc(h.values) + '<br><span class="tiny">Sorted ' + esc(String((ss.sort || {}).at || '').slice(0, 10)) + ' · ' + esc(h.head) + '</span></span></p></div>' : '') +
      '<div class="field"><label>Track</label><div style="display:flex;gap:8px;flex-wrap:wrap">' + ['B2', 'C1'].map(function (t) { return '<button class="btn sm' + (tier() === t ? ' primary' : '') + '" data-tier-set="' + t + '">' + esc(T.TIERS[t].name) + ' (' + t + ')</button>'; }).join('') + '</div><p class="tiny">The track sets which tier of the eleven keys and the frames you see. The Duelling Hall has its own A2–C1 buttons for its answer options. T.Chris may ask you to change it.</p></div>' +
      '<div class="field"><label>Look</label><div style="display:flex;gap:8px;flex-wrap:wrap">' + ['auto', 'light', 'dark'].map(function (t) { return '<button class="btn sm' + (theme === t ? ' primary' : '') + '" data-theme-set="' + t + '">' + THEME_NAME[t] + '</button>'; }).join('') + '</div></div>' +
      '<div class="field"><label>Lesson explanations</label><div style="display:flex;gap:8px;flex-wrap:wrap">' + LVLS.map(function (l) { return '<button class="btn sm' + (explainLevel() === l ? ' primary' : '') + '" data-lvl-set="' + l + '">' + l + '</button>'; }).join('') + '</div><p class="tiny">The level of English used to explain each lesson. C1 is the full explanation. You can also change it on any lesson page.</p></div>' +
      '<div class="field"><label for="s-url">Class server address</label><input id="s-url" type="text" placeholder="https://script.google.com/macros/s/…/exec" value="' + esc(api.url || '') + '" spellcheck="false"><p class="tiny">Set by T.Chris. ' + (api.pendingCount() ? api.pendingCount() + ' answers are waiting to be sent.' : 'Everything is up to date.') + '</p><button class="btn sm" id="s-save">Save address</button></div>' +
      '<div class="field"><label>The examiners</label><p class="tiny">Essays are marked by the examiners in LevelUp English: <a href="' + esc(LEVELUP) + '" target="_blank" rel="noopener">' + esc(LEVELUP) + '</a></p></div>' +
      (ST ? '<div class="field"><label for="s-pin">Teacher key</label>' + (unlocked ? '<p class="tiny">Every chapter on this account is unlocked. The map still glows where your progress is.</p>' : '<div style="display:flex;gap:8px;flex-wrap:wrap"><input id="s-pin" type="password" placeholder="T.Chris\'s PIN" autocomplete="off" style="flex:1 1 160px"><button class="btn sm" id="s-unlock">Unlock every chapter</button></div><p class="tiny" id="s-pin-msg">For T.Chris only: opens every room on this account\'s map.</p>') + '</div>' : '') +
      '<p class="tiny">Quillmoor Academy · IELTS Academic Writing Task 2 · T.Chris</p></div>';
    var pinBtn = $('#s-unlock');
    if (pinBtn) pinBtn.addEventListener('click', function () {
      var pin = $('#s-pin').value.trim(), msg = $('#s-pin-msg');
      if (!pin) { msg.textContent = 'Enter the PIN first.'; return; }
      pinBtn.disabled = true; msg.textContent = 'Checking…';
      api.teacherLogin(pin).then(function (r) {
        pinBtn.disabled = false;
        if (!r || !r.ok) { msg.textContent = (r && r.error) || 'That is not the teacher key.'; return; }
        ST.unlockAll(S.p); sync(); paintHeader(); paintSettings(); toast('Every chapter is open on this account.');
      }).catch(function (e) { pinBtn.disabled = false; msg.textContent = 'Could not reach the server: ' + e.message; });
    });
    var pinIn = $('#s-pin'); if (pinIn) pinIn.addEventListener('keydown', function (e) { if (e.key === 'Enter') pinBtn.click(); });
    $('#view-settings').querySelectorAll('[data-tier-set]').forEach(function (b) { b.addEventListener('click', function () { S.p.tier = b.dataset.tierSet; paintHeader(); sync(); paintSettings(); toast('Track set to ' + T.TIERS[S.p.tier].name + '.'); }); });
    $('#view-settings').querySelectorAll('[data-theme-set]').forEach(function (b) { b.addEventListener('click', function () {
      var t = b.dataset.themeSet;
      if (t === 'auto') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('pc.theme', t); } catch (e) {}
      paintSettings();
    }); });
    $('#view-settings').querySelectorAll('[data-lvl-set]').forEach(function (b) { b.addEventListener('click', function () { setExplainLevel(b.dataset.lvlSet); paintSettings(); toast('Lessons will be explained at ' + b.dataset.lvlSet + '.'); }); });
    $('#s-save').addEventListener('click', function () { api.setUrl($('#s-url').value.trim()); toast('Saved. ' + (api.mode === 'cloud' ? 'Connected to the class server.' : 'Working on this device only.')); });
  }
  try { var th = localStorage.getItem('pc.theme'); if (th && th !== 'auto') document.documentElement.setAttribute('data-theme', th); } catch (e) {}
})();
