/* ===========================================================================
   POSITION CONTROL — api.js
   One client for both consoles.

   CLOUD MODE   Talks to the Google Apps Script Web App in Code.gs.
                Requests are POST with Content-Type: text/plain so the browser
                treats them as "simple requests" and skips the CORS preflight
                that Apps Script cannot answer. Do not change that header.

   OFFLINE      If the network fails mid-session, everything keeps working
                against localStorage and the answers queue until it is back.
   =========================================================================== */
(function (global) {
  'use strict';

  /* ---- WHERE THE SERVER ADDRESS COMES FROM -------------------------------
     1. A student's own override, saved under Settings (localStorage)
     2. window.PC_API_URL — set in index.html and teacher.html.            */
  var API_URL = (typeof window !== 'undefined' && window.PC_API_URL) || '';

  var LS_URL = 'pc.apiUrl';
  var LS_LOCAL = 'pc.local.v1';
  var LS_SESSION = 'pc.session';
  var LS_OUTBOX = 'pc.outbox.v1';
  var LS_TOKEN = 'pc.token';

  /* A stored address overrides the one built into the page. The sentinel
     'off' means "no server at all" — that is how the teacher console's empty
     address field, and the test harness, ask for the local store instead of
     the class sheet. Without it, clearing the field would simply fall back to
     the built-in URL and there would be no way to reach local data. */
  try {
    var stored = localStorage.getItem(LS_URL);
    if (stored === 'off') API_URL = '';
    else if (stored) API_URL = stored;
  } catch (e) {}

  var state = {
    mode: API_URL ? 'cloud' : 'demo',
    url: API_URL,
    sessionId: null,
    sessionStart: 0,
    token: null,
    lastError: null
  };
  try { state.token = localStorage.getItem(LS_TOKEN) || null; } catch (e) {}

  /* ------------------------------------------------------------- outbox
     Answers are queued the moment they happen and only cleared once the
     server acknowledges them. Because the queue lives in localStorage it
     survives a reload, a closed lid and a flat battery — which is what lets
     the app stay quiet about a dropped connection instead of alarming a
     sixteen-year-old in the middle of a mock paper. */
  function outbox() {
    try { return JSON.parse(localStorage.getItem(LS_OUTBOX)) || []; } catch (e) { return []; }
  }
  function setOutbox(rows) {
    try { localStorage.setItem(LS_OUTBOX, JSON.stringify(rows.slice(-4000))); } catch (e) {}
  }

  /* -------------------------------------------------------------- storage */
  function db() {
    try { return JSON.parse(localStorage.getItem(LS_LOCAL)) || { students: {}, attempts: [], sessions: [], mocks: [], reports: [], assignments: [], projector: [] }; }
    catch (e) { return { students: {}, attempts: [], sessions: [], mocks: [], reports: [], assignments: [], projector: [] }; }
  }
  function saveDb(d) {
    try { localStorage.setItem(LS_LOCAL, JSON.stringify(d)); } catch (e) {}
  }
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; }
    return 'h' + h.toString(36);
  }

  /* ---------------------------------------------------------------- cloud */
  var TIMEOUT_MS = 14000;

  function post(action, payload) {
    if (state.token) payload.token = state.token;
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer;
    var req = fetch(state.url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, payload: payload || {} }),
      redirect: 'follow',
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
    var guard = new Promise(function (_, reject) {
      timer = setTimeout(function () {
        if (ctrl) { try { ctrl.abort(); } catch (e) {} }
        reject(new Error('Timed out after ' + (TIMEOUT_MS / 1000) + 's'));
      }, TIMEOUT_MS);
    });
    return Promise.race([req, guard]).then(
      function (v) { clearTimeout(timer); return v; },
      function (e) { clearTimeout(timer); throw e; }
    );
  }

  function call(action, payload, localFn) {
    if (state.mode !== 'cloud') return Promise.resolve(localFn());
    return post(action, payload).catch(function (err) {
      state.lastError = String(err.message || err);
      state.mode = 'demo';
      if (global.API && typeof global.API.onModeChange === 'function') global.API.onModeChange('demo', state.lastError);
      return localFn();
    });
  }

  /* ------------------------------------------------------------- students */
  function localRegister(id, pw, name) {
    var d = db();
    if (d.students[id]) return { ok: false, error: 'That student ID is already taken. Try logging in instead.' };
    d.students[id] = { id: id, name: name || id, pw: hash(pw), created: new Date().toISOString() };
    d.students[id].progress = global.Engine.Progress.blank(id, name || id);
    saveDb(d);
    return { ok: true, progress: d.students[id].progress };
  }
  function localLogin(id, pw) {
    var d = db();
    var s = d.students[id];
    if (!s) return { ok: false, error: 'No account with that ID. Create one first.' };
    if (s.pw !== hash(pw)) return { ok: false, error: 'Wrong password.' };
    return { ok: true, progress: s.progress };
  }
  function localSave(progress, attempts) {
    var d = db();
    if (!d.students[progress.studentId]) {
      d.students[progress.studentId] = {
        id: progress.studentId, name: progress.displayName,
        pw: hash('offline'), created: new Date().toISOString()
      };
    }
    d.students[progress.studentId].progress = progress;
    d.students[progress.studentId].name = progress.displayName;
    /* A finished simulation arrives as one summary row among the answers. The
       sheet puts it on its own tab; offline we keep the same separation, or the
       teacher console would read it as an unanswered question. */
    if (!d.mocks) d.mocks = [];
    (attempts || []).forEach(function (a) {
      if (a && a.kind === 'mock') d.mocks.push(a); else d.attempts.push(a);
    });
    if (d.attempts.length > 8000) d.attempts = d.attempts.slice(-8000);
    if (d.mocks.length > 2000) d.mocks = d.mocks.slice(-2000);
    saveDb(d);
    return { ok: true };
  }
  function localRoster() {
    var d = db();
    return {
      ok: true,
      students: Object.keys(d.students).map(function (k) {
        var s = d.students[k];
        return { id: s.id, name: s.name, created: s.created, progress: s.progress };
      })
    };
  }
  function localDetail(id) {
    var d = db();
    var s = d.students[id];
    if (!s) return { ok: false, error: 'Not found' };
    return {
      ok: true, student: { id: s.id, name: s.name, created: s.created }, progress: s.progress,
      attempts: d.attempts.filter(function (a) { return a.studentId === id; }),
      sessions: d.sessions.filter(function (x) { return x.studentId === id; }),
      mocks: (d.mocks || []).filter(function (x) { return x.studentId === id; })
    };
  }
  function localSession(kind, row) {
    var d = db();
    if (kind === 'start') { d.sessions.push(row); }
    else {
      for (var i = d.sessions.length - 1; i >= 0; i--) {
        if (d.sessions[i].sessionId === row.sessionId) {
          d.sessions[i].logoutTs = row.logoutTs;
          d.sessions[i].durationSec = row.durationSec;
          d.sessions[i].items = row.items;
          d.sessions[i].correct = row.correct;
          break;
        }
      }
    }
    if (d.sessions.length > 3000) d.sessions = d.sessions.slice(-3000);
    saveDb(d);
    return { ok: true };
  }
  function localAssign(id, paper) {
    var d = db();
    if (!d.students[id]) return { ok: false, error: 'Not found' };
    d.students[id].progress.assignment = paper;
    saveDb(d);
    return { ok: true };
  }

  /* --------------------------------------------------------------- reports */
  function localSubmitReport(rep) {
    var d = db();
    if (!d.reports) d.reports = [];
    d.reports.push(rep);
    if (d.reports.length > 3000) d.reports = d.reports.slice(-3000);
    saveDb(d);
    return { ok: true, id: rep.id };
  }
  function localReports(studentId) {
    var d = db();
    return { ok: true, reports: (d.reports || []).filter(function (r) { return !studentId || r.studentId === studentId; }) };
  }
  function localMarkReport(id, mark) {
    var d = db();
    (d.reports || []).forEach(function (r) { if (r.id === id) { Object.keys(mark).forEach(function (k) { r[k] = mark[k]; }); } });
    saveDb(d);
    return { ok: true };
  }
  function localAssignments(kind, row) {
    var d = db();
    if (!d.assignments) d.assignments = [];
    if (kind === 'set') d.assignments.push(row);
    if (kind === 'remove') d.assignments = d.assignments.filter(function (a) { return a.id !== row.id; });
    saveDb(d);
    return { ok: true, assignments: d.assignments };
  }
  function localProjector(kind, row) {
    var d = db();
    if (!d.projector) d.projector = [];
    if (kind === 'post') { d.projector.push(row); if (d.projector.length > 400) d.projector = d.projector.slice(-400); }
    if (kind === 'clear') d.projector = [];
    saveDb(d);
    return { ok: true, posts: (d.projector || []).filter(function (x) { return !row || !row.round || x.round === row.round; }) };
  }

  /* ------------------------------------------------------------------ API */
  var API = {
    get mode() { return state.mode; },
    get url() { return state.url; },
    get lastError() { return state.lastError; },
    onModeChange: null,

    retryCloud: function () {
      if (state.url && state.mode !== 'cloud') { state.mode = 'cloud'; return true; }
      return false;
    },
    setUrl: function (u) {
      state.url = (u || '').trim();
      state.mode = state.url ? 'cloud' : 'demo';
      try { localStorage.setItem(LS_URL, state.url || 'off'); } catch (e) {}
      return state.mode;
    },
    ping: function () {
      if (state.mode !== 'cloud') return Promise.resolve({ ok: false, mode: 'demo' });
      return post('ping', {}).then(function (r) { return { ok: !!r.ok, mode: 'cloud', sheet: r.sheet, students: r.students }; })
        .catch(function (e) { return { ok: false, mode: 'cloud', error: String(e.message || e) }; });
    },

    register: function (id, pw, name) {
      return call('register', { id: id, pw: pw, name: name }, function () { return localRegister(id, pw, name); })
        .then(keepToken);
    },
    login: function (id, pw) {
      return call('login', { id: id, pw: pw }, function () { return localLogin(id, pw); })
        .then(keepToken);
    },

    enqueue: function (rows) {
      if (!rows || !rows.length) return;
      setOutbox(outbox().concat(rows));
    },
    pendingCount: function () { return outbox().length; },
    save: function (progress) {
      var rows = outbox();
      var n = rows.length;
      return call('save', { progress: progress, attempts: rows },
        function () { return localSave(progress, rows); })
        .then(function (r) {
          if (r && r.ok) setOutbox(outbox().slice(n));
          return r;
        });
    },

    /* fetch() is cancelled on unload; sendBeacon is not. */
    flushBeacon: function (progress) {
      var rows = outbox();
      if (!state.url || state.mode !== 'cloud' || !navigator.sendBeacon) return false;
      try {
        var body = new Blob([JSON.stringify({
          action: 'save', payload: { progress: progress, attempts: rows, token: state.token }
        })], { type: 'text/plain;charset=utf-8' });
        var ok = navigator.sendBeacon(state.url, body);
        if (ok) setOutbox([]);
        return ok;
      } catch (e) { return false; }
    },

    startSession: function (studentId) {
      state.sessionId = 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      state.sessionStart = Date.now();
      var row = { sessionId: state.sessionId, studentId: studentId, loginTs: new Date().toISOString(), logoutTs: '', durationSec: 0, items: 0, correct: 0 };
      try { localStorage.setItem(LS_SESSION, JSON.stringify(row)); } catch (e) {}
      return call('session', { kind: 'start', row: row }, function () { return localSession('start', row); });
    },
    endSession: function (studentId, items, correct) {
      if (!state.sessionId) return Promise.resolve({ ok: true });
      var row = {
        sessionId: state.sessionId, studentId: studentId,
        logoutTs: new Date().toISOString(),
        durationSec: Math.round((Date.now() - state.sessionStart) / 1000),
        items: items || 0, correct: correct || 0
      };
      state.sessionId = null;
      try { localStorage.removeItem(LS_SESSION); } catch (e) {}
      return call('session', { kind: 'end', row: row }, function () { return localSession('end', row); });
    },

    /* teacher */
    teacherLogin: function (pin) {
      return call('teacherLogin', { pin: pin }, function () {
        var d = db();
        var want = d.teacherPin || '1234';
        return want === String(pin) ? { ok: true } : { ok: false, error: 'Wrong teacher PIN. The offline PIN is 1234.' };
      });
    },
    roster: function () { return call('roster', {}, localRoster); },
    detail: function (id) { return call('detail', { id: id }, function () { return localDetail(id); }); },
    assign: function (id, paper) { return call('assign', { id: id, paper: paper }, function () { return localAssign(id, paper); }); },

    /* reports */
    submitReport: function (rep) { return call('submitReport', { report: rep }, function () { return localSubmitReport(rep); }); },
    reports: function (studentId) { return call('reports', { studentId: studentId }, function () { return localReports(studentId); }); },
    markReport: function (id, mark) { return call('markReport', { id: id, mark: mark }, function () { return localMarkReport(id, mark); }); },
    /* assignments: kind = 'list' | 'set' | 'remove' */
    assignments: function (kind, row) { return call('assignments', { kind: kind, row: row }, function () { return localAssignments(kind, row); }); },
    /* projector: kind = 'post' | 'list' | 'clear' */
    projector: function (kind, row) { return call('projector', { kind: kind, row: row }, function () { return localProjector(kind, row); }); },

    localCount: function () { return Object.keys(db().students).length; }
  };

  function keepToken(r) {
    if (r && r.ok && r.token) {
      state.token = r.token;
      try { localStorage.setItem(LS_TOKEN, r.token); } catch (e) {}
    }
    return r;
  }
  API.clearToken = function () {
    state.token = null;
    try { localStorage.removeItem(LS_TOKEN); } catch (e) {}
  };

  global.API = API;
})(window);
