/* Checks worked-example blueprints and Assembly runs with the Lab's own
   quick checks, so every stored example passes what a student would see.

     node tools/lab-examples-check.js examples/B1-PROBLEM.json [more.json …]
     node tools/lab-examples-check.js --all          (every examples/*.json)
     node tools/lab-examples-check.js --essays FILE  (also print the essays)

   One file = one student level × one question type:
   { level:'B1', type:'PROBLEM', promptId:'p-teen-sleep',
     blueprints: { '60': { lines: { 'i-open': 'The problem of [Core Topic] …', … 14 lines } }, '50': …, '40': …, '30': … },
     runs:       { '60': { vars: { core: { text, text2 }, facetA: { text, text2 }, mechA: { text }, … } }, … },
     coaching:   [ { share:'60', line:'a-mech', first:'…', note:'…' } ]   (optional)
   }
   Exit code 1 when anything is red.                                       */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');

function loadApp() {
  const win = { addEventListener() {}, removeEventListener() {}, localStorage: { getItem() { return null; }, setItem() {} }, navigator: {}, location: { href: '' }, setTimeout, clearTimeout };
  win.window = win;
  win.document = { addEventListener() {}, querySelector() { return null; }, querySelectorAll() { return []; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {} }; }, body: {} };
  const ctx = vm.createContext(win);
  ['content.js', 'prompts.js', 'prompts-2.js', 'template.js', 'lab-content.js', 'lab-scenario.js', 'writer.js', 'lab.js'].forEach(function (f) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
  });
  return win;
}

const W = loadApp(), Lab = W.Lab, L = W.LabContent, C = W.CONTENT, WR = W.Writer;
const PCTS = ['60', '50', '40', '30'];
let red = 0, amber = 0;
function bad(where, msg) { red++; console.log('  ✕ ' + where + ': ' + msg); }
function warn(where, msg) { amber++; console.log('  ! ' + where + ': ' + msg); }
function prompt(id) { return C.PROMPTS.filter(function (p) { return p.id === id; })[0]; }

function buildTpl(set, pct) {
  const bp = (set.blueprints || {})[pct];
  if (!bp) return null;
  const t = { id: 'X' + set.level + set.type + pct, pct: +pct, level: set.level, type: set.type, lines: {}, slotNotes: {} };
  L.COMPONENTS.forEach(function (c) { t.lines[c.id] = { text: Lab._toTokens(bp.lines[c.id] || '').text.trim() }; });
  return t;
}

function checkSet(file, opts) {
  const set = JSON.parse(fs.readFileSync(file, 'utf8'));
  const name = path.basename(file);
  console.log('\n' + name + '  (' + set.level + ' · ' + set.type + ' · ' + set.promptId + ')');
  const pr = prompt(set.promptId);
  if (!pr) { bad(name, 'unknown promptId ' + set.promptId); return; }
  if (pr.type !== set.type) bad(name, 'prompt ' + pr.id + ' is ' + pr.type + ', set is ' + set.type);
  const tier = L.LEVELS.filter(function (l) { return l.id === set.level; })[0].tier;
  const summary = [];
  PCTS.forEach(function (pct) {
    const where = set.level + ' ' + set.type + ' ' + pct + '%';
    const bp = (set.blueprints || {})[pct];
    if (!bp) { bad(where, 'no blueprint'); return; }
    /* ---- the fourteen lines */
    L.COMPONENTS.forEach(function (c) {
      const raw = bp.lines[c.id];
      if (!raw) { bad(where + ' ' + c.id, 'missing line'); return; }
      if (/\{\w+\}/.test(raw)) bad(where + ' ' + c.id, 'write slots as [Core Topic], not {core}');
      const comp = Lab._compFor(set.type, c), q = Lab._quickFrame(comp, raw, +pct);
      q.blocking.forEach(function (m) { bad(where + ' ' + c.id, m); });
      if (!q.budget.ok) bad(where + ' ' + c.id, q.words + ' template words, budget ' + q.budget.lo + '–' + q.budget.hi + ': "' + raw + '"');
      if (q.copied) bad(where + ' ' + c.id, 'too close to an app example: "' + raw + '"');
      q.errors.forEach(function (e) { bad(where + ' ' + c.id, e.type + ': ' + e.original + ' → ' + e.correction + ' (' + e.explain + ')'); });
      q.issues.forEach(function (i) { if (i.kind === 'warn' && !/budget/.test(i.msg)) bad(where + ' ' + c.id, i.msg); });
      if (!/[.!?:;]$/.test(raw.trim())) bad(where + ' ' + c.id, 'end the line with a full stop');
    });
    const t = buildTpl(set, pct);
    const fw = Lab._frameWords(t);
    /* ---- the run */
    const run = (set.runs || {})[pct];
    if (!run) { bad(where, 'no run'); return; }
    const occ = Lab._occurrences(t);
    Object.keys(occ).forEach(function (k) {
      const v = run.vars[k];
      if (!v || !String(v.text || '').trim()) { bad(where + ' ' + k, 'empty variable'); return; }
      if (/[.;:]$/.test(v.text.trim())) warn(where + ' ' + k, 'drop the final punctuation (the frame supplies it)');
      const needs2 = occ[k] > 1;
      const q = Lab._quickVar(k, v.text, v.text2, { tpl: t, prompt: pr, tier: tier, needs2: needs2 });
      q.blocking.forEach(function (m) { bad(where + ' ' + k, m); });
      if (!q.budget.ok) bad(where + ' ' + k, q.words + ' words, budget ' + q.budget.lo + '–' + q.budget.hi + ': "' + v.text + '"');
      if (q.copied) bad(where + ' ' + k, 'copied (prompt or model): "' + v.text + '"');
      q.errors.forEach(function (e) { bad(where + ' ' + k, e.type + ': ' + e.original + ' → ' + e.correction); });
      q.issues.forEach(function (i) { if (i.kind === 'warn' && !/shorter|longer/.test(i.msg)) bad(where + ' ' + k, i.msg); });
      if (needs2 && !q.reworded) bad(where + ' ' + k, 'second mention missing or not reworded: "' + (v.text2 || '') + '"');
    });
    const built = Lab._assemble(t, run.vars, {});
    const share = Math.round(built.share * 100);
    if (built.words < 250 || built.words > 310) bad(where, 'essay is ' + built.words + ' words (aim 260–290)');
    else if (built.words < 258 || built.words > 300) warn(where, 'essay is ' + built.words + ' words (aim 260–290)');
    if (Math.abs(share - (+pct)) > 5) bad(where, 'actual template share ' + share + '% (target ' + pct + '%, allowed ±5)');
    const pf = WR.preflight(built.essay, pr, { share: +pct / 100 });
    pf.rows.filter(function (r) { return r.status === 'bad'; }).forEach(function (r) { bad(where + ' pre-flight', r.label + ' — ' + r.note); });
    pf.rows.filter(function (r) { return r.status === 'warn'; }).forEach(function (r) { warn(where + ' pre-flight', r.label); });
    summary.push(pct + '%: frame ' + fw + ' words · essay ' + built.words + ' words · share ' + share + '% · pre-flight ' + pf.bad + ' red / ' + pf.warn + ' amber');
    if (opts.essays) console.log('\n--- ' + where + ' ---\n' + built.essay + '\n');
  });
  summary.forEach(function (s) { console.log('  ' + s); });
}

const args = process.argv.slice(2), opts = { essays: args.indexOf('--essays') >= 0 };
/* Try one line: node tools/lab-examples-check.js --line PROBLEM 60 a-mech "It creates the problem by [Mechanism A]." */
if (args[0] === '--line') {
  const c = L.COMPONENTS.filter(function (x) { return x.id === args[3]; })[0];
  if (!c) { console.log('unknown line id ' + args[3] + ' (use ' + L.COMPONENTS.map(function (x) { return x.id; }).join(' ') + ')'); process.exit(1); }
  const comp = Lab._compFor(args[1], c), q = Lab._quickFrame(comp, args[4], +args[2]);
  console.log(comp.name + ' · ' + q.words + ' template words (budget ' + q.budget.lo + '–' + q.budget.hi + ')' + (q.copied ? ' · COPIED' : ''));
  q.blocking.concat(q.errors.map(function (e) { return e.type + ': ' + e.original + ' → ' + e.correction; })).concat(q.issues.map(function (i) { return i.kind + ': ' + i.msg; })).forEach(function (m) { console.log('  - ' + m); });
  process.exit(0);
}
let files = args.filter(function (a) { return !/^--/.test(a); });
if (args.indexOf('--all') >= 0) files = fs.readdirSync(path.join(ROOT, 'examples')).filter(function (f) { return /\.json$/.test(f); }).map(function (f) { return path.join(ROOT, 'examples', f); });
files.forEach(function (f) { try { checkSet(f, opts); } catch (e) { bad(f, 'could not read: ' + e.message); } });
console.log('\n' + (red ? red + ' red' : 'OK — 0 red') + ', ' + amber + ' amber');
process.exit(red ? 1 : 0);
