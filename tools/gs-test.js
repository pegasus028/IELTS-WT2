/* Runs Code.gs + Lab.gs in Node against an in-memory Google Sheet and a fake
   Claude API, to check the Template Lab back end before deploying.
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
  CacheService: { getScriptCache: () => ({ get: (k) => cacheStore[k] || null, put: (k, v) => { cacheStore[k] = v; } }) },
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
check('uses tool_choice + the coach model', lastCall.tool_choice.name === 'coach_line' && lastCall.model === 'claude-haiku-4-5-20251001', lastCall.model);
check('prompt contains the student line', lastCall.messages[0].content.indexOf('Few questions divide opinion') > 0);

const va = post('lab.coach', { studentId: 'ploy', token: tok, kind: 'variable', level: 'C1', band: '7.5–8', pct: 40, prompt: { text: 'Some argue…', type: 'Discuss both views', demand: 'd' }, variable: { key: 'mechA', label: 'Mechanism A', does: 'd', form: 'f' }, value: 'removing cars', value2: null, words: 2, budget: { lo: 8, hi: 20 }, inContext: ['p'], filled: [] });
check('coach variable ok, reword dropped when no second mention', va.ok && va.coach.fn.verdict === 'partly' && !va.coach.reword && va.coach.fit.ok === false, va);

failModel = 'claude-sonnet-4-6';
const rt = post('lab.rate', { studentId: 'ploy', token: tok, level: 'C1', band: '7.5–8', pct: 40, prompt: { text: 'x', type: 'Discuss', demand: 'd' }, essay: 'e'.repeat(1200), words: 260, share: 0.3, frame: ['a', 'b', 'c', 'd'] });
check('rate falls back to the next model when one is unavailable', rt.ok && calls[calls.length - 1].model === 'claude-haiku-4-5-20251001', calls.slice(-2).map((c) => c.model));
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

console.log(fails ? fails + ' failure(s)' : 'all Lab.gs checks passed');
process.exit(fails ? 1 : 0);
