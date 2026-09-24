#!/usr/bin/env node
/* Runs the rule checkers over every free-text item (thesis / bodypara /
   rewrite) that carries a `_good` sample (must pass) and a `_bad` sample
   (must fail). Also runs the pre-flight check over every model essay.
   Usage: node tools/test-free.js [topic-04.js ...]   (no args = all) */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
global.window = { CONTENT: null };
global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
function load(f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); }
load('content.js');
fs.readdirSync(root).filter(function (f) { return /^prompts.*\.js$/.test(f); }).forEach(load);
load('template.js');
var files = process.argv.slice(2);
if (!files.length) files = fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort();
files.forEach(load);
if (fs.existsSync(path.join(root, 'models.js'))) load('models.js');
load('writer.js');
var C = window.CONTENT, W = window.Writer, fails = 0, n = 0;
function run(it, where) {
  var fn = it.type === 'thesis' ? W.checkThesis : it.type === 'bodypara' ? W.checkBody : it.type === 'rewrite' ? W.checkRewrite : null;
  if (!fn) return;
  if (it._good) { n++; var g = fn(it._good, it); if (!g.ok) { fails++; console.log('FAIL good sample rejected  ' + where + ' ' + it.id + ' → ' + g.notes.join(' | ')); } }
  if (it._bad) { n++; var b = fn(it._bad, it); if (b.ok) { fails++; console.log('FAIL bad sample accepted   ' + where + ' ' + it.id); } }
  if (!it._good || !it._bad) console.log('NOTE no _good/_bad sample   ' + where + ' ' + it.id);
}
C.TOPICS.forEach(function (t) { t.levels.forEach(function (lv) { lv.subs.forEach(function (s) { s.items.forEach(function (it) { run(it, s.id); }); }); lv.check.items.forEach(function (it) { run(it, lv.check.id); }); }); });
(C.MODELS || []).forEach(function (m) {
  var text = m.paragraphs.map(function (p) { return p.text; }).join('\n\n');
  var pre = W.preflight(text, m.promptId);
  n++;
  if (pre.bad) { fails++; console.log('FAIL model ' + m.id + ' has ' + pre.bad + ' red row(s): ' + pre.rows.filter(function (r) { return r.status === 'bad'; }).map(function (r) { return r.label; }).join(' | ')); }
  else console.log('ok   model ' + m.id + ' · ' + pre.words + ' words · ' + pre.warn + ' amber · template ' + Math.round(pre.ratio * 100) + '%');
  if (m.contrast) {
    var ct = m.contrast.paragraphs.map(function (p) { return p.text; }).join('\n\n');
    var cp = W.preflight(ct, m.promptId);
    console.log('     contrast ' + m.id + ' · ' + cp.bad + ' red · ' + cp.warn + ' amber');
  }
});
console.log(n + ' checks, ' + fails + ' failure(s)');
process.exit(fails ? 1 : 0);
