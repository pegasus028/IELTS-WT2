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
var all = fs.readdirSync(root).filter(function (f) { return /^prompts.*\.js$/.test(f); });
all.forEach(load);
if (!files.length) files = fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort();
files.forEach(load);
load('template.js');
if (fs.existsSync(path.join(root, 'models.js'))) load('models.js');

var errors = [], warnings = [], ids = {};
var PROMPT = {}; C.PROMPTS.forEach(function (p) { PROMPT[p.id] = p; });
function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }
function uid(id, where) { if (ids[id]) err('duplicate id ' + id + ' (' + where + ')'); ids[id] = 1; }

var TYPES = { choose: 1, judge: 1, spot: 1, sort: 1, build: 1, order: 1, select: 1, thesis: 1, bodypara: 1, rewrite: 1 };
var LEVELS = { B1: 1, B2: 1, C1: 1 };
var CLICHE = [/double[- ]edged sword/i, /in a nutshell/i, /hot topic/i, /every coin has two sides/i, /since the dawn of/i, /nowadays,? in this modern/i, /last but not least/i];

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
  ['C1', 'B2'].forEach(function (t) {
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

report.forEach(function (r) { console.log(r); });
console.log(C.PROMPTS.length + ' prompts, ' + C.MODELS.length + ' models, ' + C.TOPICS.length + ' modules');
warnings.forEach(function (w) { console.log('WARN ' + w); });
errors.forEach(function (e) { console.log('ERROR ' + e); });
console.log(errors.length ? errors.length + ' error(s)' : 'OK — no errors');
process.exit(errors.length ? 1 : 0);
