/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — Code.gs
   Google Apps Script Web App behind index.html and teacher.html (Staff Room).

   SET-UP (once)
   1. Create a Google Sheet. Extensions → Apps Script. Paste this file.
   2. Project Settings → Script properties:
        TEACHER_PIN        e.g. 4821            (teacher console PIN; required —
                                                 the console refuses to open without it)
        LEVELUP_SECRET     optional: lets LevelUp write an AI band back into a
                                                 report through markReport
   3. Deploy → New deployment → Web app · Execute as: Me · Access: Anyone.
      Paste the /exec URL into window.PC_API_URL in index.html and teacher.html.
   4. AFTER EVERY EDIT: Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.
   AI marking of Scriptorium (Writer) essays is NOT done here: they are handed off to
   LevelUp English (https://pegasus028.github.io/LevelUp/). The Template Lab's
   AI coaching lives in Lab.gs (a second file in this project) and is reached
   through the LAB-HOOK line in doPost.

   ACCESS (Oct 2026). Teacher actions (roster, detail, all reports, marking,
   setting assignments, running the projector) need the short-lived teacher
   token that teacherLogin returns. Student actions need the student's own
   token, and touch only that student's rows. Five wrong PINs or passwords in
   a row lock that door for 15 minutes.

   HOUSE CUP (Oct 2026). `houses` needs no sign-in: it returns only the four
   house totals and member counts for one cohort, never a name or an id, so
   the student console can show the House Cup to everyone. Chapter unlocks and
   re-sorts from the Staff Room travel as ordinary Assignments rows
   ({kind:'unlock'} / {kind:'resort'}); no new sheet column is needed.

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

function doGet() { return out({ ok: true, app: 'Quillmoor Academy', sheet: SpreadsheetApp.getActive().getName() }); }

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
  var T = isTeacher(p);
  switch (action) {
    case 'ping': return { ok: true, sheet: SpreadsheetApp.getActive().getName(), students: sheet('Students').getLastRow() - 1 };
    case 'register': return register(p);
    case 'login': return login(p);
    case 'save': return save(p);
    case 'session': return session(p);
    case 'teacherLogin': return teacherLogin(p);
    case 'logout': return logout(p);
    case 'unlock': return T ? unlock(p.id) : denied();
    case 'roster': return T ? roster() : denied();
    case 'detail': return T ? detail(p.id) : denied();
    case 'submitReport': return submitReport(p);
    case 'reports': return reports(p, T);
    case 'markReport': return (T || levelUp(p)) ? markReport(p.id, p.mark, T) : denied();
    case 'assignments': return assignments(p, T);
    case 'projector': return projector(p, T);
    case 'assign': return T ? { ok: true } : denied();
    case 'houses': return houses(p);
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

/* ---------------------------------------------------------------- access */
var LOCK_AFTER = 5, LOCK_SECONDS = 300, PIN_LOCK_SECONDS = 60, TEACHER_SECONDS = 21600;
function cache() { return CacheService.getScriptCache(); }
function denied() { return { ok: false, auth: 'teacher', error: 'Teacher sign-in needed: reload the console and enter the PIN.' }; }
function locked(key) { return Number(cache().get(key) || 0) >= LOCK_AFTER; }
function failed(key, secs) { var c = cache(); c.put(key, String(Number(c.get(key) || 0) + 1), secs || LOCK_SECONDS); }
function teacherLogin(p) {
  var want = prop('TEACHER_PIN');
  if (!want) return { ok: false, error: 'No teacher PIN is set. In Apps Script: Project Settings → Script properties → add TEACHER_PIN.' };
  if (locked('lock:teacher')) return { ok: false, error: 'Too many wrong PINs. Wait a minute, then try again.' };
  if (String(p.pin || '') !== want) { failed('lock:teacher', PIN_LOCK_SECONDS); return { ok: false, error: 'Wrong teacher PIN.' }; }
  cache().remove('lock:teacher');
  var t = token();
  cache().put('tt:' + t, '1', TEACHER_SECONDS);
  return { ok: true, tt: t };
}
function isTeacher(p) {
  if (!p || !p.tt) return false;
  try { return cache().get('tt:' + String(p.tt)) === '1'; } catch (e) { return false; }
}
/* LevelUp may write an AI estimate back into a report when both sides share LEVELUP_SECRET. */
function levelUp(p) {
  var want = prop('LEVELUP_SECRET');
  return !!(want && p && p.secret && String(p.secret) === want && p.mark && Object.keys(p.mark).every(function (k) { return k === 'ai'; }));
}
/* The signed-in student whose token this is — and, when an id is given, only if it is that student. */
function student(p, id) {
  if (!p || !p.token) return null;
  var tok = String(p.token), want = id == null ? null : String(id).toLowerCase(), all = rows('Students');
  for (var i = 0; i < all.length; i++) {
    if (all[i].token && String(all[i].token) === tok) return (want === null || String(all[i].id).toLowerCase() === want) ? all[i] : null;
  }
  return null;
}
function log(w) { try { append('Log', { ts: new Date().toISOString(), what: String(w).slice(0, 500) }); } catch (e) {} }
function hash(s) {
  var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s) + '|position-control');
  return raw.map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
}
function token() { return Utilities.getUuid().replace(/-/g, ''); }
/* Passwords: a per-student salt and 200 rounds of SHA-256 ("v2$salt$hash").
   Accounts made before Oct 2026 hold the old single-round hash; they are
   upgraded the next time the student logs in. */
function hashPw(pw, salt) {
  salt = salt || token().slice(0, 16);
  var h = salt + '|' + String(pw);
  for (var i = 0; i < 200; i++) {
    h = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + '|' + salt)
      .map(function (b) { return ('0' + (b & 255).toString(16)).slice(-2); }).join('');
  }
  return 'v2$' + salt + '$' + h;
}
function checkPw(s, pw) {
  var st = String(s.pw || '');
  if (st.indexOf('v2$') === 0) return hashPw(pw, st.split('$')[1]) === st;
  return st === hash(pw);
}
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
  if (prop('JOIN_CODE') && String(p.code || '').trim().toLowerCase() !== prop('JOIN_CODE').trim().toLowerCase()) return { ok: false, error: 'Ask T.Chris for the class code.' };
  if (String(p.pw || '').length < 4) return { ok: false, error: 'Choose a password of at least 4 characters.' };
  append('Students', { id: id, name: p.name || id, pw: hashPw(p.pw), created: new Date().toISOString(), cohort: p.cohort || '', token: t, progress: JSON.stringify(progress) });
  return { ok: true, token: t, progress: progress };
}
function login(p) {
  var lid = String(p.id || '').toLowerCase().trim();
  if (!/^[a-z0-9._-]{3,24}$/.test(lid)) return { ok: false, error: 'No account with that ID. Create one first.' };
  var s = findStudent(lid);
  if (!s) return { ok: false, error: 'No account with that ID. Create one first.' };
  var key = 'lock:pw:' + lid;
  if (locked(key)) return { ok: false, error: 'Too many wrong passwords. Wait 5 minutes, then try again, or ask T.Chris to unlock you.' };
  if (!checkPw(s, p.pw)) { failed(key); return { ok: false, error: 'Wrong password.' }; }
  cache().remove(key);
  /* One token per student, kept across logins, so an iPad and a phone can both stay signed in. */
  var t = s.token || token(), upd = { token: t };
  if (String(s.pw || '').indexOf('v2$') !== 0) upd.pw = hashPw(p.pw);
  update('Students', s._row, upd);
  return { ok: true, token: t, progress: parse(s.progress, {}) };
}
function auth(p) { return student(p, p.progress && p.progress.studentId); }
/* Logging out retires the token, so a shared iPad keeps no working sign-in. */
function logout(p) {
  var s = student(p);
  if (s) update('Students', s._row, { token: token() });
  return { ok: true };
}
function unlock(id) { cache().remove('lock:pw:' + String(id || '').toLowerCase().trim()); return { ok: true }; }
function save(p) {
  var s = auth(p);
  if (!s) return { ok: false, error: 'Not signed in.' };
  var prog = p.progress;
  if (prog.cohort && !s.cohort) update('Students', s._row, { cohort: prog.cohort });
  update('Students', s._row, { progress: JSON.stringify(prog), name: prog.displayName || s.name });
  var head = SHEETS.Attempts, sh = sheet('Attempts'), batch = [];
  (p.attempts || []).forEach(function (a) { if (a && a.itemId) { a.studentId = s.id; batch.push(head.map(function (h) { return a[h] == null ? '' : a[h]; })); } });
  if (batch.length) sh.getRange(sh.getLastRow() + 1, 1, batch.length, head.length).setValues(batch);
  return { ok: true };
}
function session(p) {
  var r = p.row || {};
  if (!student(p, r.studentId)) return { ok: false, error: 'Not signed in.' };
  if (p.kind === 'start') append('Sessions', r);
  else {
    var all = rows('Sessions');
    for (var i = all.length - 1; i >= 0; i--) if (all[i].sessionId === r.sessionId && String(all[i].studentId).toLowerCase() === String(r.studentId).toLowerCase()) { update('Sessions', all[i]._row, { logoutTs: r.logoutTs, durationSec: r.durationSec, items: r.items, correct: r.correct }); break; }
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
function submitReport(p) {
  var rep = p.report;
  if (!rep || !rep.id || !rep.studentId) return { ok: false, error: 'Bad report' };
  if (!student(p, rep.studentId)) return { ok: false, error: 'Not signed in.' };
  var all = rows('Reports');
  for (var i = 0; i < all.length; i++) if (all[i].id === rep.id) return { ok: true, id: rep.id };
  append('Reports', reportRow(rep));
  return { ok: true, id: rep.id };
}
function reports(p, T) {
  var sid = String(p.studentId || '').toLowerCase();
  if (!T && (!sid || !student(p, sid))) return { ok: false, error: 'Not signed in.' };
  var list = rows('Reports').filter(function (r) { return !sid || String(r.studentId).toLowerCase() === sid; }).map(function (r) {
    var rep = parse(r.json, {});
    if (!T) { /* the student never sees an unreleased teacher mark or a hidden AI estimate */
      if (!rep.released) delete rep.teacher;
      if (!rep.aiVisible) delete rep.ai;
    }
    return rep;
  });
  return { ok: true, reports: list };
}
var MARK_FIELDS = ['teacher', 'released', 'aiVisible', 'status', 'ai'];
function markReport(id, mark, T) {
  var keys = Object.keys(mark || {});
  if (keys.some(function (k) { return MARK_FIELDS.indexOf(k) < 0; })) return { ok: false, error: 'Unknown field in mark' };
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
function assignments(p, T) {
  var kind = p.kind, row = p.row;
  if (kind === 'set' || kind === 'remove') { if (!T) return denied(); }
  else if (!T && !student(p)) return { ok: false, error: 'Not signed in.' };
  if (kind === 'set' && row && row.id) append('Assignments', { id: row.id, ts: row.ts || new Date().toISOString(), json: JSON.stringify(row) });
  if (kind === 'remove' && row && row.id) { var all = rows('Assignments'); for (var i = 0; i < all.length; i++) if (all[i].id === row.id) { sheet('Assignments').deleteRow(all[i]._row); break; } }
  return { ok: true, assignments: rows('Assignments').map(function (a) { return parse(a.json, null); }).filter(Boolean) };
}

/* ------------------------------------------------------------- projector */
function projector(p, T) {
  var kind = p.kind, row = p.row, sh = sheet('Projector');
  if (!T) {
    var s = student(p);
    if (!s || kind === 'clear') return kind === 'clear' ? denied() : { ok: false, error: 'Not signed in.' };
    if (kind === 'post' && (!row || row.kind === 'round' || String(row.studentId || '').toLowerCase() !== String(s.id).toLowerCase())) return denied();
    if (!row || !row.round) return { ok: false, error: 'Round code needed.' };
    if (kind === 'post') row = { kind: 'post', id: String(row.id || '').slice(0, 40), round: String(row.round).slice(0, 20), team: String(row.team || '').slice(0, 40), studentId: s.id, text: String(row.text || '').slice(0, 900), ts: row.ts || new Date().toISOString() };
  }
  if (kind === 'clear') { if (sh.getLastRow() > 1) sh.deleteRows(2, sh.getLastRow() - 1); return { ok: true, posts: [] }; }
  if (kind === 'post' && row) append('Projector', { ts: row.ts || new Date().toISOString(), round: row.round || '', kind: row.kind || 'post', json: JSON.stringify(row) });
  var posts = rows('Projector').filter(function (r) { return !row || !row.round || r.round === row.round; }).map(function (r) { return parse(r.json, null); }).filter(Boolean);
  return { ok: true, posts: posts.slice(-300) };
}

/* ------------------------------------------------------------- house cup */
var HOUSE_IDS = ['compass', 'bridge', 'lexicon', 'loom'];
/* Totals of story.hp per house, and how many students are in each, for one
   cohort (all cohorts when none is given). Names and ids never leave here. */
function houses(p) {
  var want = String((p && p.cohort) || '').trim().toLowerCase();
  var totals = {}, members = {};
  HOUSE_IDS.forEach(function (h) { totals[h] = 0; members[h] = 0; });
  rows('Students').forEach(function (s) {
    var prog = parse(s.progress, null);
    if (!prog || typeof prog !== 'object') return;
    var coh = String(prog.cohort || s.cohort || '').trim().toLowerCase();
    if (want && coh !== want) return;
    var st = prog.story || {}, h = String(st.house || '').toLowerCase();
    if (HOUSE_IDS.indexOf(h) < 0) return;
    var hp = Number(st.hp);
    if (!isFinite(hp) || hp < 0) hp = 0;
    members[h] += 1;
    totals[h] += Math.min(Math.round(hp), 100000);
  });
  return { ok: true, cohort: (p && p.cohort) || '', totals: totals, members: members };
}
