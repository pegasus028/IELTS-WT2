#!/usr/bin/env node
/* Validates content files against CONTENT-SCHEMA.md.
   Usage: node tools/validate.js [topic-03.js ...]   (no args = all content files) */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
global.window = { CONTENT: null };
function load(f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); }
load('content.js');
var C = window.CONTENT;
var files = process.argv.slice(2);
var all = fs.readdirSync(root).filter(function (f) { return /^prompts.*\.js$/.test(f) && f !== 'prompts-levels.js'; }).sort(function (a, b) { return a === 'prompts.js' ? -1 : b === 'prompts.js' ? 1 : a < b ? -1 : 1; });
all.forEach(load);
if (fs.existsSync(path.join(root, 'prompts-levels.js'))) load('prompts-levels.js');
if (!files.length) files = fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort();
files.forEach(load);
load('template.js');
if (fs.existsSync(path.join(root, 'models.js'))) load('models.js');
/* Levelled lesson explanations (lesson-levels.js): every lesson needs A1, A2, B1 and B2. */
if (fs.existsSync(path.join(root, 'lesson-levels.js'))) load('lesson-levels.js');

var errors = [], warnings = [], ids = {};
var PROMPT = {}; C.PROMPTS.forEach(function (p) { PROMPT[p.id] = p; });
function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }
function uid(id, where) { if (ids[id]) err('duplicate id ' + id + ' (' + where + ')'); ids[id] = 1; }

var TYPES = { choose: 1, judge: 1, spot: 1, sort: 1, build: 1, order: 1, select: 1, thesis: 1, bodypara: 1, rewrite: 1 };
var LEVELS = { B1: 1, B2: 1, C1: 1 };
var CLICHE = [/double[- ]edged sword/i, /in a nutshell/i, /hot topic/i, /every coin has two sides/i, /since the dawn of/i, /nowadays,? in this modern/i, /last but not least/i];

/* Hints (Oct 2026): every item carries its own one-sentence hint that outlines the rule without giving the answer.
   The tag principle is no longer a fallback, because for fact questions it stated the answer. These checks catch
   the mechanical leaks; a human read is still needed for paraphrased ones. */
function plainLower(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase(); }
function checkHint(it, w) {
  if (!it.hint) return err(w + ': missing hint (every item needs its own; the tag principle can give the answer away)');
  var h = plainLower(it.hint);
  if (h.split(' ').length > 35) warn(w + ': hint over 35 words');
  if (/\b(\w+n't|it's|that's|there's|what's|\w+'re|\w+'ll|\w+'ve)\b/.test(h)) err(w + ': contraction in hint');
  if (/\b(first|second|third|fourth|last) (option|answer|choice|card)\b|\b(option|answer) [a-d]\b/.test(h)) err(w + ': hint names an option by position (options are shuffled)');
  var keys = [];
  if (it.type === 'choose' && it.options) keys.push(it.options[it.answer]);
  if (it.type === 'select' && it.options) (it.answers || []).forEach(function (k) { keys.push(it.options[k]); });
  if (it.type === 'spot') { keys.push(it.fix); if (it.words) keys.push(it.words[it.answer]); }
  if (it.type === 'build') keys.push(it.solution);
  if (it.type === 'judge' && /^(true|false|can't tell)\b/.test(h)) err(w + ': hint starts with the verdict');
  var ctx = plainLower((it.stem || '') + ' ' + (it.given || ''));
  keys.forEach(function (k) {
    var s = plainLower(k).replace(/[.,;:!?]+$/, '');
    if (s.length > 5 && h.indexOf(s) >= 0 && ctx.indexOf(s) < 0) err(w + ': hint contains the answer "' + s + '"');
  });
}

function checkItem(it, where, stats) {
  if (!it.id) return err(where + ': item without id');
  uid(it.id, where);
  var w = where + ' ' + it.id;
  if (!TYPES[it.type]) err(w + ': unknown type ' + it.type);
  if (!C.REMEDIATION[it.tag]) err(w + ': unknown tag ' + it.tag);
  if (!LEVELS[it.level]) err(w + ': bad level ' + it.level);
  if (!it.why) err(w + ': missing why');
  if (it.prompt && typeof it.prompt === 'string' && !PROMPT[it.prompt]) err(w + ': unknown prompt ' + it.prompt);
  var blob = JSON.stringify(it); CLICHE.forEach(function (re) { if (re.test(blob)) warn(w + ': contains a banned cliché (' + re.source + ')'); });
  if (it.stem && String(it.stem).replace(/<[^>]+>/g, '').split(/\s+/).length > 32) warn(w + ': stem over 30 words');
  stats.n++;
  checkHint(it, w);
  switch (it.type) {
    case 'choose':
      if (!Array.isArray(it.options) || it.options.length < 3) err(w + ': choose needs 3+ options');
      else {
        if (typeof it.answer !== 'number' || it.answer < 0 || it.answer >= it.options.length) err(w + ': bad answer index');
        else {
          stats.pos[it.answer] = (stats.pos[it.answer] || 0) + 1;
          var lens = it.options.map(function (o) { return String(o).length; });
          var mx = Math.max.apply(null, lens);
          if (lens[it.answer] === mx && lens.filter(function (l) { return l === mx; }).length === 1) stats.longest++;
          stats.mcq++;
        }
        if (!it.stem) err(w + ': missing stem');
      }
      break;
    case 'judge':
      if (!it.given) err(w + ': judge needs given');
      if ([0, 1, 2].indexOf(it.answer) < 0) err(w + ': judge answer must be 0/1/2');
      break;
    case 'spot':
      if (!Array.isArray(it.words) || it.words.length < 3) err(w + ': spot needs words[]');
      else if (typeof it.answer !== 'number' || it.answer < 0 || it.answer >= it.words.length) err(w + ': bad spot answer');
      if (!it.fix) err(w + ': spot needs fix');
      break;
    case 'sort':
      if (!Array.isArray(it.bins) || it.bins.length < 2) err(w + ': sort needs 2+ bins');
      else {
        var keys = {}; it.bins.forEach(function (b) { if (!b.key || !b.label) err(w + ': bin needs key and label'); keys[b.key] = 1; });
        if (!Array.isArray(it.items) || it.items.length < 3) err(w + ': sort needs 3+ items');
        else it.items.forEach(function (x) { if (!keys[x.bin]) err(w + ': item bin ' + x.bin + ' not a bin key'); });
      }
      break;
    case 'build':
      if (!Array.isArray(it.tiles) || it.tiles.length < 3) err(w + ': build needs tiles');
      else {
        var joined = it.tiles.join(' ');
        var norm = function (s) { return String(s).toLowerCase().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim(); };
        var sol = norm(it.solution || '');
        var sortedTiles = it.tiles.map(norm).sort().join('|');
        var sortedSol = sol.split(' ').sort().join('|');
        var sortedTileWords = norm(joined).split(' ').sort().join('|');
        if (sortedSol !== sortedTileWords) err(w + ': solution words do not match the tiles');
      }
      break;
    case 'order':
      if (!Array.isArray(it.items) || it.items.length < 3) err(w + ': order needs 3+ items');
      break;
    case 'select':
      if (!Array.isArray(it.options) || it.options.length < 4) err(w + ': select needs 4+ options');
      if (!Array.isArray(it.answers) || !it.answers.length) err(w + ': select needs answers[]');
      else {
        if (it.k !== it.answers.length) err(w + ': k must equal answers.length');
        it.answers.forEach(function (a) { if (a < 0 || a >= it.options.length) err(w + ': bad select answer ' + a); });
      }
      break;
    case 'thesis':
      if (!it.prompt) err(w + ': thesis needs prompt');
      if (it.must && !Array.isArray(it.must)) err(w + ': must must be an array of groups');
      break;
    case 'bodypara':
      if (!it.prompt) err(w + ': bodypara needs prompt');
      break;
    case 'rewrite':
      if (!it.given) err(w + ': rewrite needs given');
      if (it.must && !Array.isArray(it.must)) err(w + ': must must be an array of groups');
      break;
  }
}

var report = [];
C.TOPICS.forEach(function (t) {
  var stats = { n: 0, mcq: 0, longest: 0, pos: {} };
  if (!/^m\d\d$/.test(t.id)) err(t.id + ': module id should be mNN');
  uid(t.id, 'topic');
  if (!t.levels || t.levels.length !== 1) err(t.id + ': exactly one level expected');
  (t.levels || []).forEach(function (lv) {
    uid(lv.id, t.id);
    if (!lv.subs || lv.subs.length !== 3) err(t.id + ': 3 subs expected, got ' + (lv.subs || []).length);
    (lv.subs || []).forEach(function (s) {
      uid(s.id, t.id);
      if (!s.theory || !s.theory.key || !Array.isArray(s.theory.body) || !s.theory.body.length) err(s.id + ': theory needs key and body[]');
      if (!s.theory || !Array.isArray(s.theory.simple)) warn(s.id + ': no simple[] version');
      var LL = (window.QM_LESSON_LEVELS || {})[s.id];
      if (window.QM_LESSON_LEVELS) ['A1', 'A2', 'B1', 'B2'].forEach(function (lv) {
        var x = LL && LL[lv];
        if (!x || !x.key || !Array.isArray(x.body) || !x.body.length) return err(s.id + ': lesson-levels needs ' + lv + ' key and body[]');
        if (!Array.isArray(x.examples) || x.examples.length !== ((s.theory && s.theory.examples) || []).length) err(s.id + ' ' + lv + ': examples[] must have one gloss per theory example');
        if (/<(?!\/?(strong|em|br|s)\b)/.test(x.key + x.body.join(''))) err(s.id + ' ' + lv + ': only <strong>, <em>, <br> allowed');
      });
      if (!s.items || s.items.length < 5) err(s.id + ': needs 5+ items (7 recommended), got ' + (s.items || []).length);
      (s.items || []).forEach(function (it) { checkItem(it, s.id, stats); });
    });
    if (!lv.check || !lv.check.items || lv.check.items.length < 6) err(t.id + ': check needs 6+ items');
    else { uid(lv.check.id, t.id); lv.check.items.forEach(function (it) { checkItem(it, lv.check.id, stats); }); }
  });
  var posStr = Object.keys(stats.pos).sort().map(function (k) { return k + ':' + stats.pos[k]; }).join(' ');
  report.push(t.id + ' ' + t.name + ' — ' + stats.n + ' items; MCQ ' + stats.mcq + ', correct-is-longest ' + stats.longest + ', positions ' + posStr);
  if (stats.mcq >= 8 && stats.longest / stats.mcq > 0.4) warn(t.id + ': correct option is the longest in ' + Math.round(100 * stats.longest / stats.mcq) + '% of MCQs (aim ≤ 30%)');
});

var KEYS = ['core', 'facetA', 'mechA', 'exA', 'nuanceA', 'facetB', 'mechB', 'exB', 'nuanceB', 'position', 'rationale'];
C.PROMPTS.forEach(function (p) {
  uid(p.id, 'prompt');
  if (!p.type || !C.TYPES[p.type]) err(p.id + ': bad type ' + p.type);
  if (!p.domain || !C.DOMAINS[p.domain]) err(p.id + ': bad domain ' + p.domain);
  if (!p.text || !p.title) err(p.id + ': prompt needs title and text');
  if (!Array.isArray(p.keyNouns) || p.keyNouns.length < 2) err(p.id + ': prompt needs keyNouns[]');
  ['C1', 'B2', 'B1', 'A2'].forEach(function (t) {
    if (!p.vars || !p.vars[t]) return err(p.id + ': missing vars.' + t);
    KEYS.forEach(function (k) { var v = p.vars[t][k]; if (!v || !v.ok || !Array.isArray(v.d) || v.d.length !== 3) err(p.id + ' ' + t + '.' + k + ': needs ok and 3 distractors'); });
  });
});
C.MODELS.forEach(function (m) {
  uid(m.id, 'model');
  if (!PROMPT[m.promptId]) err(m.id + ': unknown promptId ' + m.promptId);
  if (!Array.isArray(m.paragraphs) || m.paragraphs.length < 4) err(m.id + ': needs 4+ paragraphs[]');
  else m.paragraphs.forEach(function (pg) { if (['intro', 'bodyA', 'bodyB', 'conclusion'].indexOf(pg.role) < 0) err(m.id + ': bad role ' + pg.role); });
  if (m.contrast && (!m.contrast.paragraphs || !m.contrast.faults)) err(m.id + ': contrast needs paragraphs and faults');
  if (m.contrast) (m.contrast.faults || []).forEach(function (f) { if (!C.REMEDIATION[f.tag]) err(m.id + ': contrast fault tag ' + f.tag); });
});

/* Mock isolation (WP12, 19 Oct 2026). A mock must be UNSEEN: its prompt lives in prompts-mock.js
   (CONTENT.MOCK_PROMPTS), never in the practice bank, a model, a lesson item, the A2/B1 duel sets or the
   Duelling Hall / Spellbook Workshop sources, so a mock band measures readiness, not familiarity.
   Checks: every mock's promptId resolves to a mock-only prompt of the right shape; no mock prompt id is a
   practice prompt, an item's prompt: field, a model's promptId, or appears anywhere in any other root .js
   file (topics, models, prompts-levels, bootcamp, lab*, student, teacher …); and the mock prompt's own
   wording (the background sentences, not the fixed instruction sentence of its type) shares no 4-word
   sequence with any practice prompt, model answer or Workshop test-drive prompt. */
var MOCKP = {}, mockIds = [];
(C.MOCK_PROMPTS || []).forEach(function (p) { MOCKP[p.id] = p; mockIds.push(p.id); });
var mockErr0 = errors.length;
if (!C.MOCK_PROMPTS) err('mocks: CONTENT.MOCK_PROMPTS missing (prompts-mock.js not loaded?)');
if (!fs.existsSync(path.join(root, 'mocks.js'))) err('mocks: mocks.js missing');
else load('mocks.js');
(C.MOCKS || []).forEach(function (m) {
  var pr = MOCKP[m.promptId];
  if (PROMPT[m.promptId]) err(m.id + ': promptId ' + m.promptId + ' is a PRACTICE prompt (students have duelled, written and read a model of it); use a mock-only prompt from prompts-mock.js');
  if (!pr) return err(m.id + ': promptId ' + m.promptId + ' does not resolve to a mock prompt');
  var tn = (C.TYPES[pr.type] || {}).name || '';
  var want = /discuss/i.test(m.name) ? 'DISCUSS' : /agree/i.test(m.name) ? 'OPINION' : /advantage/i.test(m.name) ? 'ADVANTAGE' : /problem/i.test(m.name) ? 'PROBLEM' : /two-part|two part/i.test(m.name) ? 'TWOPART' : '';
  if (want && pr.type !== want) err(m.id + ': "' + m.name + '" points at a ' + pr.type + ' prompt (' + tn + ')');
});
(C.MOCK_PROMPTS || []).forEach(function (p) {
  uid(p.id, 'mock prompt');
  if (!/^p-mock-/.test(p.id)) err(p.id + ': mock prompt ids start with p-mock-');
  if (!p.mock) err(p.id + ': mock prompt needs mock: true');
  if (PROMPT[p.id]) err(p.id + ': mock prompt is also in CONTENT.PROMPTS');
  if (!p.type || !C.TYPES[p.type]) err(p.id + ': bad type ' + p.type);
  if (!p.domain || !C.DOMAINS[p.domain]) err(p.id + ': bad domain ' + p.domain);
  if (!p.text || !p.title) err(p.id + ': prompt needs title and text');
  if (!Array.isArray(p.keyNouns) || p.keyNouns.length < 2) err(p.id + ': prompt needs keyNouns[]');
  if (p.modelId) err(p.id + ': a mock prompt must not have a model (modelId ' + p.modelId + ')');
  ['C1', 'B2'].forEach(function (t) {
    if (!p.vars || !p.vars[t]) return err(p.id + ': missing vars.' + t);
    KEYS.forEach(function (k) { var v = p.vars[t][k]; if (!v || !v.ok || !Array.isArray(v.d) || v.d.length !== 3) err(p.id + ' ' + t + '.' + k + ': needs ok and 3 distractors'); });
  });
});
/* practice lists and content fields */
function walkPrompts(o, where) {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) return o.forEach(function (x, i) { walkPrompts(x, where); });
  Object.keys(o).forEach(function (k) {
    var v = o[k];
    if ((k === 'prompt' || k === 'promptId') && typeof v === 'string' && MOCKP[v]) err(where + (o.id ? ' ' + o.id : '') + ': ' + k + ' is the mock-only prompt ' + v);
    else if (v && typeof v === 'object') walkPrompts(v, where);
  });
}
C.PROMPTS.forEach(function (p) { if (MOCKP[p.id]) err('practice bank: contains the mock-only prompt ' + p.id); });
walkPrompts(C.TOPICS, 'lesson items');
C.MODELS.forEach(function (m) { if (MOCKP[m.promptId]) err(m.id + ': model written for the mock-only prompt ' + m.promptId); });
/* raw text: no other root .js file may name a mock prompt id (topic files, models.js, prompts-levels.js,
   bootcamp.js, lab.js, lab-content.js, lab-examples.js, lab-scenario.js, student.js, teacher.js …) */
var MOCK_HOME = { 'prompts-mock.js': 1, 'mocks.js': 1 };
fs.readdirSync(root).filter(function (f) { return /\.js$/.test(f) && !MOCK_HOME[f]; }).sort().forEach(function (f) {
  var src = fs.readFileSync(path.join(root, f), 'utf8');
  mockIds.forEach(function (id) { var i = src.indexOf(id); if (i >= 0) err(f + ':' + src.slice(0, i).split('\n').length + ': names the mock-only prompt ' + id); });
  if (/\bp-mock-[a-z]/.test(src)) err(f + ': names a p-mock-… prompt id (mock prompts belong in prompts-mock.js only)');
});
/* the mock wording itself: no 4-word sequence shared with a practice prompt, a model or a Workshop prompt */
function toks(s) { return String(s || '').replace(/<[^>]+>/g, ' ').toLowerCase().replace(/[’‘]/g, "'").match(/[a-z0-9']+/g) || []; }
function grams(s, n) { var t = toks(s), out = {}; for (var i = 0; i + n <= t.length; i++) out[t.slice(i, i + n).join(' ')] = 1; return out; }
function background(p) {
  var sig = toks((C.TYPES[p.type] || {}).signal).join(' ');
  return String(p.text).replace(/([.!?])\s+/g, '$1\u0001').split('\u0001').filter(function (s) {
    s = s.trim(); return s && !/\?$/.test(s) && toks(s).join(' ') !== sig && !/^discuss both views/i.test(s);
  }).join(' ');
}
var pool = [];
C.PROMPTS.forEach(function (p) { pool.push({ where: p.id, text: p.text }); });
C.MODELS.forEach(function (m) {
  (m.paragraphs || []).forEach(function (pg, i) { pool.push({ where: m.id + ' para ' + (i + 1), text: pg.text }); });
  ((m.contrast || {}).paragraphs || []).forEach(function (pg, i) { pool.push({ where: m.id + ' contrast para ' + (i + 1), text: pg.text }); });
});
if (fs.existsSync(path.join(root, 'lab-scenario.js'))) {
  try { load('lab-content.js'); load('lab-scenario.js'); } catch (e) { warn('mock 4-gram check: lab-scenario.js not loaded (' + e.message + ')'); }
  var LS = window.LabScenario || {}; Object.keys(LS.prompts || {}).forEach(function (t) { pool.push({ where: 'lab-scenario ' + t, text: LS.prompts[t].text }); });
}
pool.forEach(function (x) { x.g = grams(x.text, 4); });
var gramChecks = 0;
(C.MOCK_PROMPTS || []).forEach(function (p) {
  var mine = grams(background(p), 4);
  if (!Object.keys(mine).length) err(p.id + ': no background sentence found before the instruction');
  Object.keys(mine).forEach(function (g) { gramChecks++; pool.forEach(function (x) { if (x.g[g]) err(p.id + ': shares the 4-word sequence "' + g + '" with ' + x.where); }); });
});
console.log('Mock isolation: ' + (C.MOCKS || []).length + ' mocks, ' + mockIds.length + ' mock-only prompts, ' + gramChecks + ' four-word sequences against ' + pool.length + ' texts, ' + (errors.length - mockErr0) + ' problem(s)');

/* Old-iPad safety (B2, 18 Oct 2026). Safari before 16.4 cannot parse a regex lookbehind, and one such
   literal anywhere stops the whole app at start-up; older Safari also fails on newer syntax. Every .js
   file in the repo root must be free of regex lookbehind ((?<= / (?<!, also inside RegExp strings),
   arrow functions and optional chaining. Comments, strings and regex literals are blanked before the
   syntax checks, so "=>" in a comment or a string is not an error; the lookbehind check reads the raw
   text, because new RegExp('(?<!…)') hides the lookbehind inside a string. */
function blankJs(src) {
  var out = '', i = 0, n = src.length, last = '';
  function keep(seg) { return seg.replace(/[^\n]/g, ''); }
  function regexOk() {
    if (!last) return true;
    if (/[(,=:[!&|?{};+\-*%<>~^]/.test(last)) return true;
    return /\b(return|typeof|case|do|else|in|of|new|delete|void|throw|instanceof)\s*$/.test(out);
  }
  while (i < n) {
    var c = src.charAt(i), d = src.charAt(i + 1), j;
    if (c === '/' && d === '/') { j = src.indexOf('\n', i); if (j < 0) j = n; i = j; continue; }
    if (c === '/' && d === '*') { j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2; out += ' ' + keep(src.slice(i, j)); i = j; continue; }
    if (c === '"' || c === "'" || c === '`') {
      j = i + 1; while (j < n && src.charAt(j) !== c) { if (src.charAt(j) === '\\') j++; j++; }
      out += c + keep(src.slice(i, j)) + c; last = c; i = j + 1; continue;
    }
    if (c === '/' && regexOk()) {
      j = i + 1; var cls = false;
      while (j < n) { var ch = src.charAt(j); if (ch === '\\') { j += 2; continue; } if (ch === '\n') break; if (ch === '[') cls = true; else if (ch === ']') cls = false; else if (ch === '/' && !cls) break; j++; }
      j++; while (j < n && /[a-z]/i.test(src.charAt(j))) j++;
      out += '/r/'; last = '/'; i = j; continue;
    }
    out += c; if (!/\s/.test(c)) last = c; i++;
  }
  return out;
}
function lineOf(text, idx) { return text.slice(0, idx).split('\n').length; }
var es5 = 0;
fs.readdirSync(root).filter(function (f) { return /\.js$/.test(f); }).sort().forEach(function (f) {
  var src = fs.readFileSync(path.join(root, f), 'utf8'), m, re = /\(\?<[=!]/g;
  while ((m = re.exec(src))) { es5++; err(f + ':' + lineOf(src, m.index) + ': regex lookbehind "' + m[0] + '" (fails to parse on Safari before 16.4)'); }
  var code = blankJs(src), r2 = /=>|\?\.(?=[A-Za-z_$[(])/g;
  while ((m = r2.exec(code))) { es5++; err(f + ':' + lineOf(code, m.index) + ': ' + (m[0] === '=>' ? 'arrow function' : 'optional chaining') + ' (keep the code ES5 for old iPads)'); }
});
console.log('ES5 check: ' + fs.readdirSync(root).filter(function (f) { return /\.js$/.test(f); }).length + ' root .js files, ' + es5 + ' problem(s)');

report.forEach(function (r) { console.log(r); });
console.log(C.PROMPTS.length + ' prompts, ' + C.MODELS.length + ' models, ' + C.TOPICS.length + ' modules');
warnings.forEach(function (w) { console.log('WARN ' + w); });
errors.forEach(function (e) { console.log('ERROR ' + e); });
console.log(errors.length ? errors.length + ' error(s)' : 'OK — no errors');
process.exit(errors.length ? 1 : 0);
