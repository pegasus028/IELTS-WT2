/* Runs Code.gs + Lab.gs in Node against an in-memory Google Sheet and a fake
   Claude API, to check the Template Lab back end, the access rules and the
   Quillmoor House Cup (`houses`) and story orders before deploying.
   node tools/gs-test.js                                                   */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

/* ---------------------------------------------------- in-memory sheets */
function Sheet(name) { this.name = name; this.rows = []; }
Sheet.prototype.appendRow = function (r) { this.rows.push(r.slice()); };
Sheet.prototype.setFrozenRows = function () {};
Sheet.prototype.getLastRow = function () { return this.rows.length; };
Sheet.prototype.getName = function () { return this.name; };
Sheet.prototype.deleteRow = function (r) { this.rows.splice(r - 1, 1); };
Sheet.prototype.deleteRows = function (r, n) { this.rows.splice(r - 1, n); };
Sheet.prototype.getRange = function (r, c, nr, nc) {
  const sh = this; nr = nr || 1; nc = nc || 1;
  if (typeof r === 'string') { r = 1; c = 1; nr = sh.rows.length; nc = 1; }
  return {
    getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; const o = []; for (let j = 0; j < nc; j++) o.push(row[c - 1 + j] == null ? '' : row[c - 1 + j]); out.push(o); } return out; },
    getValue() { const row = sh.rows[r - 1] || []; return row[c - 1] == null ? '' : row[c - 1]; },
    setValues(v) { for (let i = 0; i < v.length; i++) { const row = sh.rows[r - 1 + i] || (sh.rows[r - 1 + i] = []); for (let j = 0; j < v[i].length; j++) row[c - 1 + j] = v[i][j]; } },
    createTextFinder(t) { return { matchEntireCell() { return this; }, findNext() {
      for (let i = 0; i < nr; i++) { const row = sh.rows[r - 1 + i] || []; for (let j = 0; j < nc; j++) if (String(row[c - 1 + j]) === String(t)) return { getRow: () => r + i }; }
      return null; } }; }
  };
};
const book = { sheets: {}, getSheetByName(n) { return this.sheets[n] || null; }, insertSheet(n) { return (this.sheets[n] = new Sheet(n)); }, getName() { return 'Test sheet'; } };

/* ---------------------------------------------------------- fake Claude */
const calls = [];
let failModel = null;
function fakeFetch(url, opts) {
  const body = JSON.parse(opts.payload);
  calls.push(body);
  if (!opts.headers['x-api-key']) throw new Error('no key header');
  if (body.model === failModel) return { getResponseCode: () => 404, getContentText: () => '{"error":"not_found"}' };
  const name = body.tool_choice.name;
  let input;
  if (name === 'coach_line') input = { errors: [{ original: 'recieve', correction: 'receive', type: 'spelling', explain: 'i before e.' }, { original: 'same', correction: 'same', type: 'grammar', explain: 'bogus' }],
    fn: { verdict: 'meets', comment: 'Does the job.' }, generic: { ok: true, note: '' }, slotForm: 'noun phrase', cefr: 'C1', band: 7.74, praise: 'x', tip: 'y' };
  if (name === 'coach_variable') input = { errors: [], fn: { verdict: 'partly', comment: 'Too general.' }, relevance: { ok: true, note: '' }, fit: { ok: false, note: 'agreement' }, reword: { ok: true, note: '' }, cefr: 'B2', band: 6.5, praise: 'p', tip: 't' };
  if (name === 'rate_essay') input = { tr: 7.2, cc: 7, lr: 6.5, gra: 7, cefr: 'C1', summary: 's', strengths: ['a', 'b', 'c', 'd'], priorities: [{ crit: 'LR', text: 'x' }], frameNote: 'f' };
  return { getResponseCode: () => 200, getContentText: () => JSON.stringify({ content: [{ type: 'tool_use', name, input }] }) };
}

/* ------------------------------------------------------- Apps Script API */
const props = { TEACHER_PIN: '4821', ANTHROPIC_API_KEY: 'sk-test', LAB_STUDENT_DAILY: '5' };
const cacheStore = {};
const ctx = {
  console,
  SpreadsheetApp: { getActive: () => book },
  LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] || null }) },
  CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; }, remove: (k) => { delete cacheStore[k]; } }) },
  UrlFetchApp: { fetch: fakeFetch },
  Utilities: {
    computeDigest: (alg, s) => Array.from(require('crypto').createHash('sha256').update(s).digest()).map((b) => (b > 127 ? b - 256 : b)),
    DigestAlgorithm: { SHA_256: 'sha256' }, getUuid: () => require('crypto').randomUUID(), sleep() {},
    formatDate: () => '20260925'
  },
  ContentService: { createTextOutput: (t) => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 'json' } }
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'Code.gs'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'Lab.gs'), 'utf8'), ctx);
function post(action, payload) { const r = ctx.doPost({ postData: { contents: JSON.stringify({ action, payload }) } }); return JSON.parse(r.t); }

let fails = 0;
function check(label, cond, extra) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (cond ? '' : ' ' + JSON.stringify(extra))); if (!cond) fails++; }

/* ------------------------------------------------------------------ run */
const reg = post('register', { id: 'ploy', pw: 'pw1234', name: 'Ploy' });
check('register', reg.ok && reg.token, reg);
const tok = reg.token;
post('register', { id: 'mint', pw: 'pw9999', name: 'Mint' });

check('lab.status reports AI', post('lab.status', {}).ai === true);
check('lab.list refuses a wrong token', post('lab.list', { studentId: 'ploy', token: 'nope' }).ok === false);
check('lab.list refuses an unknown student', post('lab.list', { studentId: 'ghost', token: tok }).ok === false);

const tpl = { id: 'T1', name: 'C1 frame', version: 1, pct: 40, level: 'C1', status: 'draft', lines: { 'i-open': { text: 'Few questions divide opinion as sharply as {core}.', last: { points: 30, errors: 0, errorList: [], rows: [] } } }, updatedAt: '2026-09-25T01:00:00Z' };
check('saveTemplate (new row)', post('lab.saveTemplate', { studentId: 'ploy', token: tok, template: tpl }).ok);
tpl.status = 'complete'; tpl.score = 400; tpl.updatedAt = '2026-09-25T02:00:00Z';
check('saveTemplate (update same row)', post('lab.saveTemplate', { studentId: 'ploy', token: tok, template: tpl }).ok);
check('one row, updated in place', book.sheets.LabTemplates.rows.length === 2 && book.sheets.LabTemplates.rows[1][7] === 'complete', book.sheets.LabTemplates.rows);
const mintTok = post('login', { id: 'mint', pw: 'pw9999' }).token;
check('another student cannot overwrite it', post('lab.saveTemplate', { studentId: 'mint', token: mintTok, template: tpl }).ok === false);
check('another student cannot delete it', post('lab.deleteTemplate', { studentId: 'mint', token: mintTok, id: 'T1' }).ok === false);

const big = { id: 'A1', templateId: 'T1', pct: 40, level: 'C1', promptId: 'p-cars-city', timing: 'none', version: 1, status: 'complete', words: 280, share: 0.3214, rating: { overall: 7 }, points: { total: 500 }, seconds: 900, vars: {}, parasHtml: ['x'.repeat(20000), 'y'.repeat(20000)] };
for (let i = 0; i < 11; i++) big.vars['v' + i] = { text: 'z'.repeat(300), last: { points: 30, errorList: new Array(8).fill({ original: 'a'.repeat(80), correction: 'b'.repeat(80), type: 'grammar', explain: 'c'.repeat(160) }), rows: new Array(8).fill(['row', 5]), issues: new Array(8).fill({ kind: 'warn', msg: 'm'.repeat(240) }) } };
check('saveAttempt with oversized JSON', post('lab.saveAttempt', { studentId: 'ploy', token: tok, attempt: big }).ok);
const cell = book.sheets.LabAttempts.rows[1][15];
check('JSON cell kept under 50,000 characters and still parses', cell.length < 50000 && JSON.parse(cell).id === 'A1', cell.length);
const list = post('lab.list', { studentId: 'ploy', token: tok });
check('lab.list returns own items only', list.ok && list.templates.length === 1 && list.attempts.length === 1 && post('lab.list', { studentId: 'mint', token: mintTok }).templates.length === 0);

const fr = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'frame', level: 'C1', band: '7.5–8', pct: 40, component: { name: 'Topic opener', fn: 'f', why: 'w', slots: ['Core Topic'], paragraph: 'intro' }, line: 'Few questions divide opinion as sharply as [Core Topic].', words: 7, budget: { lo: 6, hi: 12 } });
check('coach frame ok', fr.ok && fr.coach.fn.verdict === 'meets', fr);
check('band rounded to a half band', fr.coach.band === 7.5, fr.coach.band);
check('no-op "errors" dropped', fr.coach.errors.length === 1, fr.coach.errors);
const lastCall = calls[calls.length - 1];
check('uses tool_choice + the coach model', lastCall.tool_choice.name === 'coach_line' && lastCall.model === 'claude-haiku-5-5', lastCall.model);
check('prompt contains the student line', lastCall.messages[0].content.indexOf('Few questions divide opinion') > 0);

const va = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'variable', level: 'C1', band: '7.5–8', pct: 40, prompt: { text: 'Some argue…', type: 'Discuss both views', demand: 'd' }, variable: { key: 'mechA', label: 'Mechanism A', does: 'd', form: 'f' }, value: 'removing cars', value2: null, words: 2, budget: { lo: 8, hi: 20 }, inContext: ['p'], filled: [] });
check('coach variable ok, reword dropped when no second mention', va.ok && va.coach.fn.verdict === 'partly' && !va.coach.reword && va.coach.fit.ok === false, va);

failModel = 'claude-sonnet-5-5';
const rt = post('lab.rate', { studentId: 'ploy', token: tok, level: 'C1', band: '7.5–8', pct: 40, prompt: { text: 'x', type: 'Discuss', demand: 'd' }, essay: 'e'.repeat(1200), words: 260, share: 0.3, frame: ['a', 'b', 'c', 'd'] });
check('rate falls back to the next model when one is unavailable', rt.ok && calls[calls.length - 1].model === 'claude-sonnet-4-6', calls.slice(-2).map((c) => c.model));
check('rating bands rounded, strengths capped at 3', rt.rating.tr === 7 && rt.rating.strengths.length === 3, rt.rating);
failModel = null;

let blocked = null;
for (let i = 0; i < 6; i++) { const r = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'frame', component: {}, line: 'x', budget: {} }); if (!r.ok) { blocked = r; break; } }
check('daily quota per student enforced', blocked && /today/.test(blocked.error), blocked);

delete props.ANTHROPIC_API_KEY;
check('no key: status ai=false', post('lab.status', {}).ai === false);
const nk = post('lab.coach', { studentId: 'mint', token: mintTok, kind: 'frame', component: {}, line: 'x', budget: {} });
check('no key: coach refuses cleanly', nk.ok === false && /key/i.test(nk.error), nk);

check('existing actions still work (ping)', post('ping', {}).ok === true);
check('delete own attempt', post('lab.deleteAttempt', { studentId: 'ploy', token: tok, id: 'A1' }).ok && book.sheets.LabAttempts.rows.length === 1);


/* ------------------------------------------------- access (Oct 2026) */
const sub = (id, sid, tk) => post('submitReport', { token: tk, report: { id, studentId: sid, text: 'essay ' + id, words: 260, preflight: {} } });
check('student submits her own report', sub('R1', 'ploy', tok).ok);
check('student cannot submit as another student', sub('R2', 'mint', tok).ok === false);
check('no token: submit refused', sub('R3', 'ploy', undefined).ok === false);
check('roster refused without teacher token', post('roster', {}).ok === false);
check('detail refused without teacher token', post('detail', { id: 'ploy' }).ok === false);
check('all reports refused without teacher token', post('reports', { studentId: '' }).ok === false);
check('student cannot read another student\'s reports', post('reports', { studentId: 'ploy', token: mintTok }).ok === false);
check('student reads her own reports', post('reports', { studentId: 'ploy', token: tok }).reports.length === 1);
check('markReport refused without teacher token', post('markReport', { id: 'R1', mark: { released: true, teacher: { bands: { overall: 9 } } } }).ok === false);
check('student cannot mark her own essay', post('markReport', { id: 'R1', token: tok, mark: { released: true } }).ok === false);
check('assignment set refused for a student', post('assignments', { kind: 'set', token: tok, row: { id: 'A9' } }).ok === false);
check('projector clear refused for a student', post('projector', { kind: 'clear', token: tok }).ok === false);
check('student can list assignments', post('assignments', { kind: 'list', token: tok }).ok === true);
check('student posts to the projector as herself', post('projector', { kind: 'post', token: tok, row: { kind: 'post', studentId: 'ploy', round: 'r1' } }).ok === true);
check('student cannot post as another student', post('projector', { kind: 'post', token: tok, row: { kind: 'post', studentId: 'mint', round: 'r1' } }).ok === false);
const save0 = post('save', { progress: { studentId: 'ploy' }, attempts: [] });
check('save refused with no token', save0.ok === false);
check('save refused with another student\'s token', post('save', { token: mintTok, progress: { studentId: 'ploy' }, attempts: [] }).ok === false);
check('wrong PIN refused', post('teacherLogin', { pin: '0000' }).ok === false);
const tl = post('teacherLogin', { pin: '4821' });
check('teacher login returns a token', tl.ok && tl.tt);
check('teacher reads roster', post('roster', { tt: tl.tt }).ok === true);
check('teacher reads all reports, unstripped', post('reports', { studentId: '', tt: tl.tt }).reports.length === 1);
check('teacher marks and releases', post('markReport', { tt: tl.tt, id: 'R1', mark: { released: true, status: 'released', teacher: { bands: { overall: 7 } } } }).ok === true);
check('markReport refuses unknown fields', post('markReport', { tt: tl.tt, id: 'R1', mark: { studentId: 'mint' } }).ok === false);
check('a forged teacher token is refused', post('roster', { tt: 'forged' }).ok === false);
for (let i = 0; i < 5; i++) post('teacherLogin', { pin: 'x' + i });
check('PIN locks after five misses', /Too many/.test(post('teacherLogin', { pin: '4821' }).error || ''));
for (const k of Object.keys(cacheStore)) if (k.indexOf('lock:') === 0) delete cacheStore[k];
delete props.TEACHER_PIN;
check('no PIN set: console refuses (no 1234 default)', post('teacherLogin', { pin: '1234' }).ok === false);
props.TEACHER_PIN = '4821';
const st = book.sheets.Students.rows.find((r) => r[0] === 'ploy');
check('new passwords are salted (v2)', /^v2\$/.test(st[2]));
const legacyHash = Array.from(require('crypto').createHash('sha256').update('old1|position-control').digest()).map((b) => ('0' + b.toString(16)).slice(-2)).join('');
book.sheets.Students.rows.push(['legacy', 'Legacy', legacyHash, '', '', 'tok-legacy', '{}']);
const lg = post('login', { id: 'legacy', pw: 'old1' });
check('legacy password still logs in, keeps its token', lg.ok && lg.token === 'tok-legacy');
check('legacy password upgraded to v2 on login', /^v2\$/.test(book.sheets.Students.rows.find((r) => r[0] === 'legacy')[2]));
check('second login keeps the same token (two devices)', post('login', { id: 'ploy', pw: 'pw1234' }).token === tok);
for (let i = 0; i < 5; i++) post('login', { id: 'mint', pw: 'bad' + i });
check('five wrong passwords lock the account', /Too many/.test(post('login', { id: 'mint', pw: 'pw9999' }).error || ''));
check('teacher can unlock it', post('unlock', { tt: tl.tt, id: 'mint' }).ok && post('login', { id: 'mint', pw: 'pw9999' }).ok);
check('a student cannot unlock', post('unlock', { token: tok, id: 'mint' }).ok === false);
check('student projector list needs a round', post('projector', { kind: 'list', token: tok, row: {} }).ok === false);
const pr2 = post('projector', { kind: 'post', token: tok, row: { kind: 'post', studentId: 'ploy', round: 'r2', text: 'x'.repeat(2000), win: true } });
check('student posts are trimmed and whitelisted', pr2.ok && pr2.posts.slice(-1)[0].text.length === 900 && pr2.posts.slice(-1)[0].win === undefined);
const lo = post('logout', { token: tok });
check('logout retires the token', lo.ok && post('reports', { studentId: 'ploy', token: tok }).ok === false);
props.JOIN_CODE = 'swep41';
check('join code required when set', post('register', { id: 'nok', pw: 'pw12' }).ok === false && post('register', { id: 'yes1', pw: 'pw12', code: 'SWEP41' }).ok === true);
delete props.JOIN_CODE;

/* ------------------------------------------- House Cup (Quillmoor, Oct 2026) */
const hcs = [['hc1', 'Tutoring', 'compass', 120], ['hc2', 'Tutoring', 'bridge', 40], ['hc3', 'Tutoring', 'compass', 30],
  ['hc4', 'M4.1', 'compass', 999], ['hc5', 'Tutoring', null, 50], ['hc6', 'Tutoring', 'loom', 'abc'], ['hc7', 'Tutoring', 'lexicon', -5]];
hcs.forEach(([id, coh, house, hp]) => {
  const r = post('register', { id, pw: 'pw12', name: 'Name-' + id });
  post('save', { token: r.token, progress: { studentId: id, displayName: 'Name-' + id, cohort: coh, story: { house, hp, chapter: 2 } }, attempts: [] });
});
const hc = post('houses', { cohort: 'Tutoring' });
check('houses needs no sign-in', hc.ok === true, hc);
check('houses sums story.hp per house for the cohort', hc.totals && hc.totals.compass === 150 && hc.totals.bridge === 40 && hc.totals.loom === 0 && hc.totals.lexicon === 0, hc.totals);
check('houses counts members (bad or negative hp counts as 0)', hc.members && hc.members.compass === 2 && hc.members.bridge === 1 && hc.members.loom === 1 && hc.members.lexicon === 1, hc.members);
check('houses ignores other cohorts and unsorted students', hc.totals.compass === 150 && Object.values(hc.members).reduce((a, b) => a + b, 0) === 5);
check('houses returns no names or ids', !/hc\d|Name-|ploy|mint/.test(JSON.stringify(hc)), hc);
check('houses: cohort match ignores case', post('houses', { cohort: 'tutoring' }).totals.compass === 150);
check('houses: other cohort', post('houses', { cohort: 'M4.1' }).totals.compass === 999);
check('houses: an unknown cohort gives zeros', Object.values(post('houses', { cohort: 'Nobody' }).totals).every((v) => v === 0));
const ul = post('assignments', { kind: 'set', tt: tl.tt, row: { id: 'U1', ts: '2026-10-11T00:00:00Z', kind: 'unlock', cohort: 'Tutoring', chapter: 7 } });
check('teacher stores a chapter-unlock row through assignments', ul.ok && ul.assignments.some((a) => a.kind === 'unlock' && a.chapter === 7));
const rs = post('assignments', { kind: 'set', tt: tl.tt, row: { id: 'U2', ts: '2026-10-11T00:00:00Z', kind: 'resort', studentId: 'hc1' } });
check('teacher stores a re-sort row through assignments', rs.ok && rs.assignments.some((a) => a.kind === 'resort' && a.studentId === 'hc1'));
const hcTok = post('login', { id: 'hc1', pw: 'pw12' }).token;
check('a student sees unlock rows in the assignments list', post('assignments', { kind: 'list', token: hcTok }).assignments.some((a) => a.id === 'U1'));
check('a student cannot set an unlock row', post('assignments', { kind: 'set', token: hcTok, row: { id: 'U3', kind: 'unlock', studentId: 'hc1', chapter: 7 } }).ok === false);

console.log(fails ? fails + ' failure(s)' : 'all Code.gs + Lab.gs checks passed');
process.exit(fails ? 1 : 0);
