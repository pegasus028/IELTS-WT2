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
   token, and touch only that student's rows. Five wrong passwords in a row
   lock that account for 5 minutes (LOCK_SECONDS); five wrong PINs lock the
   Staff Room door for 1 minute (PIN_LOCK_SECONDS).

   HOUSE CUP (Oct 2026). `houses` needs no sign-in: it returns only the four
   house totals and member counts for one cohort, never a name or an id, so
   the student console can show the House Cup to everyone. Chapter unlocks and
   re-sorts from the Staff Room travel as ordinary Assignments rows
   ({kind:'unlock'} / {kind:'resort'}); no new sheet column is needed.
   "Your five" (19 Oct 2026): the five prompts T.Chris sets a student or a
   cohort travel the same way, as {kind:'coreset', studentId | cohort,
   prompts:[5 ids]} rows.

   VERSION (19 Oct 2026). ping and doGet return APP_VERSION; the Staff Room
   asks for a redeploy when it is missing or older than the front end expects.

   WP10 (20 Oct 2026), additive only:
   - `houses` takes an optional `challenge` id and adds { challenge: { id, totals, members } }:
     the sum of story.challenge.score per house for students whose story.challenge.id matches.
   - `owl` (send · list · tag): the owl exchange between housemates, on a new Owls sheet.
     A student sends one anonymous body paragraph to her house; a housemate tags its
     mechanism, example and nuance sentences; both see the result. The sender's id is
     stored (fromId) but never returned to anyone but herself; the tagger's id (taggedBy)
     is never returned at all.

   Requests are POST with Content-Type text/plain (a "simple request", so no
   CORS preflight), body {action, payload}. Every reply is JSON {ok, …}.
   =========================================================================== */

var SHEETS = {
  Students: ['id', 'name', 'pw', 'created', 'cohort', 'token', 'progress'],
  Attempts: ['ts', 'studentId', 'itemId', 'topic', 'level', 'type', 'tag', 'cefr', 'correct', 'ms', 'hinted', 'fast', 'mode', 'given', 'expected'],
  Sessions: ['sessionId', 'studentId', 'loginTs', 'logoutTs', 'durationSec', 'items', 'correct'],
  Reports: ['id', 'ts', 'studentId', 'name', 'cohort', 'promptId', 'type', 'tier', 'kind', 'uiMode', 'words', 'seconds', 'bad', 'warn', 'status', 'released', 'aiVisible', 'overall', 'json', 'ownShare', 'ownSentences', 'fillUsed', 'landAgree', 'revisionOf'],
  Assignments: ['id', 'ts', 'json'],
  Projector: ['ts', 'round', 'kind', 'json'],
  Log: ['ts', 'what'],
  Owls: ['id', 'ts', 'cohort', 'house', 'fromId', 'promptId', 'para', 'taggedBy', 'taggedTs', 'json']
};

/* WP1 (19 Oct 2026): the build this file belongs to. ping and doGet report it, and the Staff Room
   shows a banner when the live deployment is older than the front end expects. Change it with every
   release that touches this file (and the Staff Room's EXPECTED_BACKEND in teacher.js). */
var APP_VERSION = '20261020';

function doGet() { return out({ ok: true, app: 'Quillmoor Academy', sheet: SpreadsheetApp.getActive().getName(), version: APP_VERSION }); }

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
    case 'ping': return { ok: true, sheet: SpreadsheetApp.getActive().getName(), students: sheet('Students').getLastRow() - 1, version: APP_VERSION };
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
    case 'owl': return owl(p);
  }
  return { ok: false, error: 'Unknown action ' + action };
}

/* ---------------------------------------------------------------- sheets */
function sheet(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(SHEETS[name]); sh.setFrozenRows(1); }
  else headTail(sh, name);
  return sh;
}
/* Columns added at the END of a sheet in a later release (Reports: ownShare … revisionOf, 19 Oct 2026)
   get their header cell on an existing sheet. Only empty header cells are written: nothing is renamed
   or moved. Checked once per request. */
var HEAD_DONE = {};
function headTail(sh, name) {
  if (HEAD_DONE[name] || !SHEETS[name]) return;
  HEAD_DONE[name] = 1;
  var head = SHEETS[name], cur = sh.getRange(1, 1, 1, head.length).getValues()[0], from = -1;
  for (var j = head.length - 1; j >= 0 && String(cur[j] == null ? '' : cur[j]) === ''; j--) from = j;
  if (from > 0 && String(cur[from - 1]) === head[from - 1]) sh.getRange(1, from + 1, 1, head.length - from).setValues([head.slice(from)]);
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
    overall: rep.teacher && rep.teacher.bands ? rep.teacher.bands.overall : (rep.ai && rep.ai.bands ? rep.ai.bands.overall : ''), json: JSON.stringify(rep),
    /* 19 Oct 2026, appended columns: how much of the essay is hers, Fill, Landing Check agreement, revision link */
    ownShare: typeof rep.ownShare === 'number' ? Math.round(rep.ownShare * 100) / 100 : '', ownSentences: rep.ownSentences == null ? '' : rep.ownSentences,
    fillUsed: rep.fillUsed == null ? '' : (rep.fillUsed ? 1 : 0), landAgree: typeof rep.landAgree === 'number' ? Math.round(rep.landAgree * 100) / 100 : '', revisionOf: rep.revisionOf || '' };
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
  var want = String((p && p.cohort) || '').trim().toLowerCase(), chal = String((p && p.challenge) || '').trim();
  var totals = {}, members = {}, ct = {}, cm = {};
  HOUSE_IDS.forEach(function (h) { totals[h] = 0; members[h] = 0; ct[h] = 0; cm[h] = 0; });
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
    /* WP10c: the weekly house challenge, scored by each student on her own progress */
    if (chal && st.challenge && String(st.challenge.id) === chal) {
      var sc = Number(st.challenge.score); if (!isFinite(sc) || sc < 0) sc = 0;
      cm[h] += 1; ct[h] += Math.min(Math.round(sc), 1000000);
    }
  });
  var out = { ok: true, cohort: (p && p.cohort) || '', totals: totals, members: members };
  if (chal) out.challenge = { id: chal, totals: ct, members: cm };
  return out;
}

/* ----------------------------------------------------------- owl exchange (WP10d) */
var OWL_MAX_SENT = 12, OWL_MAX_LEN = 600;
function owlPublic(r, mine) {
  var j = parse(r.json, {});
  var o = { id: r.id, ts: r.ts, house: r.house, promptId: r.promptId, para: r.para, sentences: j.sentences || [], tagged: !!r.taggedBy, taggedTs: r.taggedTs || '' };
  if (mine) { o.selfTags = j.selfTags || null; o.tags = j.tags || null; }
  return o;
}
function owl(p) {
  var s = student(p);
  if (!s) return { ok: false, error: 'Not signed in.' };
  var prog = parse(s.progress, {}) || {}, st = prog.story || {};
  var house = String(st.house || '').toLowerCase(), coh = String(prog.cohort || s.cohort || '').trim().toLowerCase(), sid = String(s.id).toLowerCase();
  var kind = p.kind, row = p.row || {};
  if (HOUSE_IDS.indexOf(house) < 0) return { ok: false, error: 'Not sorted yet: the Lantern must sort you first.' };
  var all = rows('Owls');
  function sameHouse(r) { return String(r.house).toLowerCase() === house && String(r.cohort || '').trim().toLowerCase() === coh; }
  function isMine(r) { return String(r.fromId).toLowerCase() === sid; }
  if (kind === 'send') {
    if (all.some(function (r) { return isMine(r) && !r.taggedBy; })) return { ok: false, error: 'Your last owl is still flying.' };
    var sents = (row.sentences || []).slice(0, OWL_MAX_SENT).map(function (x) { return String(x || '').slice(0, OWL_MAX_LEN); }).filter(Boolean);
    if (sents.length < 3) return { ok: false, error: 'A paragraph needs at least three sentences.' };
    var self = row.selfTags && typeof row.selfTags === 'object' ? { mech: Number(row.selfTags.mech), ex: Number(row.selfTags.ex), nuance: Number(row.selfTags.nuance) } : null;
    var id = String(row.id || ('O' + Utilities.getUuid().slice(0, 12))).slice(0, 40);
    if (all.some(function (r) { return r.id === id; })) return { ok: true, id: id };
    append('Owls', { id: id, ts: new Date().toISOString(), cohort: coh, house: house, fromId: sid, promptId: String(row.promptId || '').slice(0, 60), para: String(row.para || '').slice(0, 12), taggedBy: '', taggedTs: '',
      json: JSON.stringify({ sentences: sents, selfTags: self, reportId: String(row.reportId || '').slice(0, 40) }) });
    return { ok: true, id: id };
  }
  if (kind === 'tag') {
    var tags = row.tags && typeof row.tags === 'object' ? { mech: Number(row.tags.mech), ex: Number(row.tags.ex), nuance: Number(row.tags.nuance) } : null;
    if (!tags) return { ok: false, error: 'Tags needed.' };
    for (var i = 0; i < all.length; i++) if (all[i].id === String(row.id || '')) {
      var r = all[i];
      if (isMine(r)) return { ok: false, error: 'You cannot tag your own owl.' };
      if (!sameHouse(r)) return { ok: false, error: 'That owl is for another house.' };
      if (r.taggedBy) return { ok: false, error: 'A housemate has already read that owl.' };
      var j = parse(r.json, {}); j.tags = tags;
      update('Owls', r._row, { taggedBy: sid, taggedTs: new Date().toISOString(), json: JSON.stringify(j) });
      var back = owlPublic(r, true); back.tags = tags; back.selfTags = j.selfTags || null; back.tagged = true;
      return { ok: true, owl: back };
    }
    return { ok: false, error: 'Not found' };
  }
  /* list */
  var mine = all.filter(isMine).slice(-5).map(function (r) { return owlPublic(r, true); });
  var forMe = all.filter(function (r) { return !isMine(r) && !r.taggedBy && sameHouse(r); }).slice(-3).map(function (r) { return owlPublic(r, false); });
  return { ok: true, mine: mine, forMe: forMe };
}
