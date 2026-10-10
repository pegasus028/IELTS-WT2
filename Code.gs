/* ===========================================================================
   POSITION CONTROL — Code.gs
   Google Apps Script Web App behind index.html and teacher.html.

   SET-UP (once)
   1. Create a Google Sheet. Extensions → Apps Script. Paste this file.
   2. Project Settings → Script properties:
        TEACHER_PIN        e.g. 4821            (teacher console PIN)
   3. Deploy → New deployment → Web app · Execute as: Me · Access: Anyone.
      Paste the /exec URL into window.PC_API_URL in index.html and teacher.html.
   4. AFTER EVERY EDIT: Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.
   AI marking of Writer essays is NOT done here: they are handed off to
   LevelUp English (https://pegasus028.github.io/LevelUp/). The Template Lab's
   AI coaching lives in Lab.gs (a second file in this project) and is reached
   through the LAB-HOOK line in doPost.

   Requests are POST with Content-Type text/plain (a "simple request", so no
   CORS preflight), body {action, payload}. Every reply is JSON {ok, …}.
   =========================================================================== */

var SHEETS = {
  Students: ['id', 'name', 'pw', 'created', 'cohort', 'token', 'progress'],
  Attempts: ['ts', 'studentId', 'itemId', 'topic', 'level', 'type', 'tag', 'cefr', 'correct', 'ms', 'hinted', 'fast', 'mode', 'given', 'expected'],
  Sessions: ['sessionId', 'studentId', 'loginTs', 'logoutTs', 'durationSec', 'items', 'correct'],
  Reports: ['id', 'ts', 'studentId', 'name', 'cohort', 'promptId', 'type', 'tier', 'kind', 'uiMode', 'words', 'seconds', 'bad', 'warn', 'status', 'released', 'aiVisible', 'overall', 'json'],
  Assignments: ['id', 'ts', 'json'],
  Projector: ['ts', 'round', 'kind', 'json'],
  Log: ['ts', 'what']
};

function doGet() { return out({ ok: true, app: 'Position Control', sheet: SpreadsheetApp.getActive().getName() }); }

function doPost(e) {
  var req;
  try { req = JSON.parse(e.postData.contents || '{}'); } catch (err) { return out({ ok: false, error: 'Bad JSON' }); }
  /* LAB-HOOK — Template Lab (Lab.gs). Runs outside the lock below so AI coaching does not queue the class. */
  if (String(req.action || '').indexOf('lab.') === 0) return out(LAB_handle(req.action, req.payload || {}));
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    return out(handle(req.action, req.payload || {}));
  } catch (err) {
    log('ERR ' + req.action + ' ' + err);
    return out({ ok: false, error: String(err) });
  } finally { lock.releaseLock(); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/* ---------------------------------------------------------------- router */
function handle(action, p) {
  switch (action) {
    case 'ping': return { ok: true, sheet: SpreadsheetApp.getActive().getName(), students: sheet('Students').getLastRow() - 1 };
    case 'register': return register(p);
    case 'login': return login(p);
    case 'save': return save(p);
    case 'session': return session(p);
    case 'teacherLogin': return { ok: pin(p.pin), error: pin(p.pin) ? '' : 'Wrong teacher PIN.' };
    case 'roster': return roster();
    case 'detail': return detail(p.id);
    case 'submitReport': return submitReport(p.report);
    case 'reports': return reports(p.studentId);
    case 'markReport': return markReport(p.id, p.mark);
    case 'assignments': return assignments(p.kind, p.row);
    case 'projector': return projector(p.kind, p.row);
    case 'assign': return { ok: true };
  }
  return { ok: false, error: 'Unknown action ' + action };
}

/* ---------------------------------------------------------------- sheets */
function sheet(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function rows(name) {
  var sh = sheet(name), n = sh.getLastRow();
  if (n < 2) return [];
  var head = SHEETS[name], data = sh.getRange(2, 1, n - 1, head.length).getValues();
  return data.map(function (r, i) { var o = { _row: i + 2 }; head.forEach(function (h, j) { o[h] = r[j]; }); return o; });
}
function append(name, obj) { var head = SHEETS[name]; sheet(name).appendRow(head.map(function (h) { return obj[h] == null ? '' : obj[h]; })); }
function update(name, rowIdx, obj) {
  var head = SHEETS[name], sh = sheet(name);
  var cur = sh.getRange(rowIdx, 1, 1, head.length).getValues()[0];
  head.forEach(function (h, j) { if (obj[h] !== undefined) cur[j] = obj[h]; });
  sh.getRange(rowIdx, 1, 1, head.length).setValues([cur]);
}
function prop(k) { return PropertiesService.getScriptProperties().getProperty(k) || ''; }
function pin(x) { return String(x) === (prop('TEACHER_PIN') || '1234'); }
function log(w) { try { append('Log', { ts: new Date().toISOString(), what: String(w).slice(0, 500) }); } catch (e) {} }
function hash(s) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s) + '|position-control');
  return raw.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function token() { return Utilities.getUuid().replace(/-/g, ''); }
function findStudent(id) {
  id = String(id || '').toLowerCase();
  var all = rows('Students');
  for (var i = 0; i < all.length; i++) if (String(all[i].id).toLowerCase() === id) return all[i];
  return null;
}
function parse(j, dflt) { try { return j ? JSON.parse(j) : dflt; } catch (e) { return dflt; } }

/* -------------------------------------------------------------- students */
function register(p) {
  var id = String(p.id || '').toLowerCase().trim();
  if (!/^[a-z0-9._-]{3,24}$/.test(id)) return { ok: false, error: 'Bad student ID.' };
  if (findStudent(id)) return { ok: false, error: 'That student ID is already taken. Try logging in instead.' };
  var t = token();
  var progress = { studentId: id, displayName: p.name || id, cohort: p.cohort || '', xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null, sessions: 0, runBest: 0, run: 0, reclaimed: 0, speedBonuses: 0, subs: {}, checks: {}, mocks: {}, plans: {}, badges: [], review: {}, stats: { seen: 0, correct: 0, byTag: {} }, reports: [], types: {}, tier: 'B2', assignment: null, created: new Date().toISOString() };
  append('Students', { id: id, name: p.name || id, pw: hash(p.pw), created: new Date().toISOString(), cohort: p.cohort || '', token: t, progress: JSON.stringify(progress) });
  return { ok: true, token: t, progress: progress };
}
function login(p) {
  var s = findStudent(p.id);
  if (!s) return { ok: false, error: 'No account with that ID. Create one first.' };
  if (s.pw !== hash(p.pw)) return { ok: false, error: 'Wrong password.' };
  var t = token();
  update('Students', s._row, { token: t });
  return { ok: true, token: t, progress: parse(s.progress, {}) };
}
function auth(p) {
  var s = p.progress && findStudent(p.progress.studentId);
  if (!s) return null;
  if (p.token && s.token && p.token !== s.token) return null;
  return s;
}
function save(p) {
  var s = auth(p);
  if (!s) return { ok: false, error: 'Not signed in.' };
  var prog = p.progress;
  if (prog.cohort && !s.cohort) update('Students', s._row, { cohort: prog.cohort });
  update('Students', s._row, { progress: JSON.stringify(prog), name: prog.displayName || s.name });
  var head = SHEETS.Attempts, sh = sheet('Attempts'), batch = [];
  (p.attempts || []).forEach(function (a) { if (a && a.itemId) batch.push(head.map(function (h) { return a[h] == null ? '' : a[h]; })); });
  if (batch.length) sh.getRange(sh.getLastRow() + 1, 1, batch.length, head.length).setValues(batch);
  return { ok: true };
}
function session(p) {
  var r = p.row || {};
  if (p.kind === 'start') append('Sessions', r);
  else {
    var all = rows('Sessions');
    for (var i = all.length - 1; i >= 0; i--) if (all[i].sessionId === r.sessionId) { update('Sessions', all[i]._row, { logoutTs: r.logoutTs, durationSec: r.durationSec, items: r.items, correct: r.correct }); break; }
  }
  return { ok: true };
}

/* --------------------------------------------------------------- teacher */
function roster() {
  return { ok: true, students: rows('Students').map(function (s) { return { id: s.id, name: s.name, created: s.created, cohort: s.cohort, progress: parse(s.progress, null) }; }) };
}
function detail(id) {
  var s = findStudent(id);
  if (!s) return { ok: false, error: 'Not found' };
  var lid = String(id).toLowerCase();
  return { ok: true, student: { id: s.id, name: s.name, created: s.created, cohort: s.cohort }, progress: parse(s.progress, {}),
    attempts: rows('Attempts').filter(function (a) { return String(a.studentId).toLowerCase() === lid; }).slice(-600),
    sessions: rows('Sessions').filter(function (x) { return String(x.studentId).toLowerCase() === lid; }).slice(-100) };
}

/* --------------------------------------------------------------- reports */
function reportRow(rep) {
  return { id: rep.id, ts: rep.ts, studentId: rep.studentId, name: rep.name, cohort: rep.cohort || '', promptId: rep.promptId, type: rep.type, tier: rep.tier || '', kind: rep.kind, uiMode: rep.uiMode,
    words: rep.words, seconds: rep.seconds, bad: (rep.preflight || {}).bad || 0, warn: (rep.preflight || {}).warn || 0, status: rep.status || 'submitted', released: rep.released ? 1 : 0, aiVisible: rep.aiVisible ? 1 : 0,
    overall: rep.teacher && rep.teacher.bands ? rep.teacher.bands.overall : (rep.ai && rep.ai.bands ? rep.ai.bands.overall : ''), json: JSON.stringify(rep) };
}
function submitReport(rep) {
  if (!rep || !rep.id || !rep.studentId) return { ok: false, error: 'Bad report' };
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === rep.id) return { ok: true, id: rep.id };
  append('Reports', reportRow(rep));
  return { ok: true, id: rep.id };
}
function reports(studentId) {
  var sid = String(studentId || '').toLowerCase();
  var list = rows('Reports').filter(function (r) { return !sid || String(r.studentId).toLowerCase() === sid; }).map(function (r) {
    var rep = parse(r.json, {});
    if (sid) { /* the student never sees an unreleased teacher mark or a hidden AI estimate */
      if (!rep.released) delete rep.teacher;
      if (!rep.aiVisible) delete rep.ai;
    }
    return rep;
  });
  return { ok: true, reports: list };
}
function markReport(id, mark) {
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === id) {
    var rep = parse(all[i].json, {});
    Object.keys(mark || {}).forEach(function (k) { rep[k] = mark[k]; });
    update('Reports', all[i]._row, reportRow(rep));
    return { ok: true };
  }
  return { ok: false, error: 'Not found' };
}

/* ----------------------------------------------------------- assignments */
function assignments(kind, row) {
  if (kind === 'set' && row && row.id) append('Assignments', { id: row.id, ts: row.ts || new Date().toISOString(), json: JSON.stringify(row) });
  if (kind === 'remove' && row && row.id) { var all = rows('Assignments'); for (var i = 0; i < all.length; i++) if (all[i].id === row.id) { sheet('Assignments').deleteRow(all[i]._row); break; } }
  return { ok: true, assignments: rows('Assignments').map(function (a) { return parse(a.json, null); }).filter(Boolean) };
}

/* ------------------------------------------------------------- projector */
function projector(kind, row) {
  var sh = sheet('Projector');
  if (kind === 'clear') { if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); return { ok: true, posts: [] }; }
  if (kind === 'post' && row) append('Projector', { ts: row.ts || new Date().toISOString(), round: row.round || '', kind: row.kind || 'post', json: JSON.stringify(row) });
  var posts = rows('Projector').filter(function (r) { return !row || !row.round || r.round === row.round; }).map(function (r) { return parse(r.json, null); }).filter(Boolean);
  return { ok: true, posts: posts.slice(-300) };
}
