#!/usr/bin/env node
/* Mechanical audit of every question: answer-position spread, correct-is-longest rate,
   judge True/False balance, hint/why leaks, stem naturalness flags. */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
global.window = { CONTENT: null }; global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
function load(f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); }
['content.js', 'prompts.js', 'prompts-2.js', 'template.js'].forEach(load);
fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort().forEach(load);
load('writer.js'); load('bootcamp.js');
var C = window.CONTENT, strip = function (s) { return String(s).replace(/<[^>]+>/g, ''); };
function norm(s) { return strip(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(s) { return norm(s).split(' ').filter(function (w) { return w.length > 3; }); }
function overlap(a, b) { var A = words(a), B = {}; words(b).forEach(function (w) { B[w] = 1; }); var n = 0; A.forEach(function (w) { if (B[w]) n++; }); return A.length ? n / A.length : 0; }
var flags = [];
function auditMcq(where, stem, options, answer, stats, hint) {
  var lens = options.map(function (o) { return strip(o).length; }), mx = Math.max.apply(null, lens);
  stats.n++; stats.pos[answer] = (stats.pos[answer] || 0) + 1;
  if (lens[answer] === mx && lens.filter(function (l) { return l === mx; }).length === 1) { stats.longest++; }
  if (hint && overlap(options[answer], hint) >= 0.6 && words(options[answer]).length >= 3) flags.push(where + ': hint may reveal the answer (' + Math.round(overlap(options[answer], hint) * 100) + '% word overlap)');
  var dup = {}; options.forEach(function (o) { var k = norm(o); if (dup[k]) flags.push(where + ': duplicate option "' + strip(o).slice(0, 40) + '"'); dup[k] = 1; });
}
var report = [];
C.TOPICS.forEach(function (t) {
  var st = { n: 0, longest: 0, pos: {} }, jt = { t: 0, f: 0, c: 0 };
  function item(it, where) {
    if (it.type === 'choose') auditMcq(where + ' ' + it.id, it.stem, it.options, it.answer, st, it.hint || (C.REMEDIATION[it.tag] || {}).principle);
    if (it.type === 'select') it.answers.forEach(function (a) { if (overlap(it.options[a], it.hint || (C.REMEDIATION[it.tag] || {}).principle) >= 0.6 && words(it.options[a]).length >= 3) flags.push(where + ' ' + it.id + ': hint may reveal a select answer'); });
    if (it.type === 'judge' && it.answer === 0 && overlap(it.given, it.hint || (C.REMEDIATION[it.tag] || {}).principle) >= 0.7 && words(it.given).length >= 4) flags.push(where + ' ' + it.id + ': hint restates the given statement');
    if (it.hint && it.type !== 'choose' && it.type !== 'select' && it.type !== 'judge') { var key = it.type === 'spot' ? it.fix : it.type === 'build' ? it.solution : ''; if (key && overlap(key, it.hint) >= 0.6 && words(key).length >= 2) flags.push(where + ' ' + it.id + ': hint may reveal the ' + it.type + ' answer'); }
    if (it.type === 'judge') { jt[['t', 'f', 'c'][it.answer]]++; }
    if (it.stem && /\?\s*\?|\bwhich of the following\b/i.test(it.stem)) flags.push(where + ' ' + it.id + ': stem wording "' + strip(it.stem).slice(0, 60) + '"');
    if (it.why && it.type === 'choose' && /answer is [abcd1-4]\b/i.test(it.why)) flags.push(where + ' ' + it.id + ': why only names the letter');
  }
  t.levels[0].subs.forEach(function (s) { s.items.forEach(function (it) { item(it, s.id); }); });
  t.levels[0].check.items.forEach(function (it) { item(it, t.levels[0].check.id); });
  var posStr = [0, 1, 2, 3].map(function (k) { return k + ':' + (st.pos[k] || 0); }).join(' ');
  report.push(t.id + ' choose ' + st.n + ' · longest ' + Math.round(100 * st.longest / Math.max(1, st.n)) + '% · positions ' + posStr + ' · judge T/F/C ' + jt.t + '/' + jt.f + '/' + jt.c);
  if (st.n >= 8) { [0, 1, 2, 3].forEach(function (k) { var share = (st.pos[k] || 0) / st.n; if (share > 0.4 || (share < 0.12 && st.n >= 10)) flags.push(t.id + ': answer position ' + k + ' used ' + Math.round(share * 100) + '% of the time'); }); }
  if (st.n >= 8 && st.longest / st.n > 0.3) flags.push(t.id + ': correct-is-longest ' + Math.round(100 * st.longest / st.n) + '%');
  if (jt.t + jt.f >= 4 && (jt.t === 0 || jt.f === 0)) flags.push(t.id + ': all judge items have the same answer');
});
/* prompt variables as MCQs (the Bootcamp draws on them) */
var pv = { n: 0, longest: 0 };
C.PROMPTS.forEach(function (p) { ['B2', 'C1'].forEach(function (tier) { Object.keys(p.vars[tier]).forEach(function (k) { var v = p.vars[tier][k]; var lens = [v.ok].concat(v.d).map(function (x) { return x.length; }); pv.n++; if (lens[0] === Math.max.apply(null, lens) && lens.filter(function (l) { return l === lens[0]; }).length === 1) pv.longest++; }); }); });
report.push('prompt variables: ' + pv.n + ' option sets · correct-is-longest ' + Math.round(100 * pv.longest / pv.n) + '%');
/* bootcamp: build every mission at both tiers */
var bc = { n: 0, longest: 0, pos: {} };
C.PROMPTS.forEach(function (p) { ['B2', 'C1'].forEach(function (tier) { window.Bootcamp.build(p, tier).steps.forEach(function (s) { s.questions.forEach(function (q) { auditMcq('bootcamp ' + p.id + ' ' + tier + ' ' + q.id, q.stem, q.options, q.answer, bc, q.hint); }); }); }); });
report.push('bootcamp questions: ' + bc.n + ' · longest ' + Math.round(100 * bc.longest / bc.n) + '% · positions ' + Object.keys(bc.pos).sort().map(function (k) { return k + ':' + bc.pos[k]; }).join(' '));
report.forEach(function (r) { console.log(r); });
var seen = {}; flags.forEach(function (f) { var k = f.replace(/bootcamp p-[\w-]+ (B2|C1) /, 'bootcamp '); if (!seen[k]) { seen[k] = 1; console.log('FLAG ' + k); } });
console.log(flags.length + ' flag(s), ' + Object.keys(seen).length + ' distinct');
