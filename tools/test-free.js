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
/* Oct 2026: filler must fail. Built only from each item's own keywords and
   cue phrases, so it has the right words and no content. */
function filler(it) {
  var kw = (it.must || []).map(function (g) { return g[0]; }).concat(it.keyNouns || []).join(' and ');
  if (it.type === 'thesis') return 'There is a lot to say about ' + kw + ' and the topic is very interesting for many young people today.';
  if (it.type === 'bodypara') return 'One benefit is clear. ' + kw + ' matters because it helps many people, which in turn changes daily life in many ways for most of the people. For example, a school in Bangkok may use it every day. However, this overlooks some small problems in other places and for other groups. It is also important for the future of young people everywhere and for their families and neighbours too.';
  return kw + ' the big thing about many people';
}
var ALT = { m03s1q4: ['The restriction of private cars in city centres.', 'The regulation of private car use in city centres.'],
            m03s1q4_no: ['Limiting private cars in city centres to reduce pollution.', 'Banning cars from the city centre.'],
            m02s3q3: ['Cars should be phased out of city centres as buses improve, because clean air matters more than convenience.'],
            m01s2q7: ['On balance, online lessons do more harm than good, because students lose the teacher who notices confusion.',
                      'On balance, the disadvantages of online lessons outweigh the advantages due to the loss of face-to-face contact.',
                      'The drawbacks of online learning are greater than its benefits, as students lose the teacher who notices confusion.'],
            m02ckq6: ['Junk food in schools is an important issue, and I agree that schools should stop selling sugary snacks because habits formed at school last.'] };
function each(fn) { C.TOPICS.forEach(function (t) { t.levels.forEach(function (lv) { lv.subs.forEach(function (s) { s.items.forEach(fn); }); lv.check.items.forEach(fn); }); }); }
each(function (it) {
  var fn = it.type === 'thesis' ? W.checkThesis : it.type === 'bodypara' ? W.checkBody : it.type === 'rewrite' ? W.checkRewrite : null;
  if (!fn) return;
  n++; if (fn(filler(it), it).ok) { fails++; console.log('FAIL filler accepted       ' + it.id); }
  (ALT[it.id] || []).forEach(function (a) { n++; var r = fn(a, it); if (!r.ok) { fails++; console.log('FAIL sound answer rejected ' + it.id + ' "' + a + '" → ' + r.notes.join(' | ')); } });
  (ALT[it.id + '_no'] || []).forEach(function (a) { n++; if (fn(a, it).ok) { fails++; console.log('FAIL method breach accepted ' + it.id + ' "' + a + '"'); } });
});
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
