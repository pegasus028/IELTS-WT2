#!/usr/bin/env node
/* Leak check (WP12a, Oct 2026): a lesson's worked examples must teach the point
   without handing over a quiz answer. For every lesson (42), each example text —
   the example sentence (theory.examples[i].s), its C1 gloss (theory.examples[i].g)
   and its A1–B2 glosses in lesson-levels.js, plus every quoted or <em> fragment
   of five or more words inside a gloss — is compared with every answer and option text of that
   lesson's own questions and of its module's examiner's gate pool:
     choose / select options, a gap-fill stem completed with its key (or a sentence quoted in the
     stem), judge
     "given", spot sentence (as written and as
     fixed), sort cards, build solution (and alt), order sentences, rewrite
     "given", and the _good sample of free-text items.
   A pair is flagged when, after normalising (lower case, tags and punctuation
   removed), the two texts are equal, one contains the other (the shorter has
   4+ words), or their content words overlap by 0.8 or more (shared words over
   the longer text's words, both texts 3+ content words; or over the shorter
   text's words when it has 5+ content words). Texts under four
   words are taught terms ("the latter", "such a ban"), not answers, and are
   skipped. One exemption: when one text merely contains the other and the
   shorter one is fixed course text the student is meant to know by heart —
   an instruction sentence from a prompt, or frame wording from template.js —
   the pair is not a leak (it is printed with -v).
   Usage: node tools/leak-check.js [-v]     Exit 1 on any flag. */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
global.window = { CONTENT: null };
function load(f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); }
load('content.js');
fs.readdirSync(root).filter(function (f) { return /^prompts.*\.js$/.test(f) && f !== 'prompts-levels.js'; }).sort().forEach(load);
fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort().forEach(load);
load('lesson-levels.js');
global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
load('template.js');
var C = window.CONTENT, LL = window.QM_LESSON_LEVELS || {}, verbose = process.argv.indexOf('-v') >= 0;

var STOP = {};
('a an the and or but of to in on at by for with from as is are was were be been being it its this that these those ' +
 'there their they them he she his her we our you your i my not no so than then too very can could should would will ' +
 'may might must do does did has have had into over under about more most less also only just such which who whom what ' +
 'when where why how all any each every some both either neither one two').split(' ').forEach(function (w) { STOP[w] = 1; });
function plain(s) {
  return String(s == null ? '' : s).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/[‘’`]/g, "'").replace(/[“”]/g, '"').replace(/\{[^}]*\}/g, ' ');
}
function norm(s) { return plain(s).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/'(?![a-z])|(^|\s)'/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(s) { var n = norm(s); return n ? n.split(' ') : []; }
function content(s) { var out = {}; words(s).forEach(function (w) { if (w.length >= 3 && !STOP[w]) out[w] = 1; }); return Object.keys(out); }

/* every answer and option text of an item */
function itemTexts(it) {
  var out = [];
  function add(t, what) { if (t && norm(t)) out.push({ text: plain(t), what: it.id + ' ' + what }); }
  (it.options || []).forEach(function (o, i) { add(o, 'option ' + (i + 1) + (i === it.answer || (it.answers || []).indexOf(i) >= 0 ? ' (key)' : '')); });
  if (it.given) add(it.given, 'given');
  /* a gap-fill stem completed with its key is an answer text too */
  if (it.stem && /_{3,}/.test(it.stem) && it.options && typeof it.answer === 'number') {
    var q = plain(it.stem).match(/"([^"]*_{3,}[^"]*)"/);
    add((q ? q[1] : plain(it.stem)).replace(/_{3,}/, plain(it.options[it.answer])), 'stem with its key');
  } else if (it.stem) {
    /* a sentence quoted in the stem is the material the question is about */
    var m, re = /"([^"]{20,})"/g, st = plain(it.stem);
    while ((m = re.exec(st))) add(m[1], 'stem quote');
  }
  if (it.type === 'spot' && it.words) {
    add(it.words.join(' '), 'sentence');
    var fixed = it.words.slice(); fixed[it.answer] = /^\(delete\)/.test(it.fix || '') ? '' : it.fix; add(fixed.join(' '), 'fixed sentence');
  }
  if (it.type === 'sort') (it.items || []).forEach(function (x, i) { add(x.text, 'card ' + (i + 1)); });
  if (it.type === 'build') { add(it.solution || (it.tiles || []).join(' '), 'solution'); (it.alt || []).forEach(function (a) { add(a, 'alt'); }); }
  if (it.type === 'order') (it.items || []).forEach(function (x, i) { add(x, 'sentence ' + (i + 1)); });
  if (it._good) add(it._good, 'model answer');
  return out;
}
/* every example text of a lesson, at every level */
function fragments(s) {
  var out = [], m, src = String(s || '').replace(/[“”]/g, '"'), re = /<em>([\s\S]*?)<\/em>|"([^"]{8,})"|'([^']{12,})'/g;
  while ((m = re.exec(src))) out.push(m[1] || m[2] || m[3]);
  return out;
}
function exampleTexts(sb) {
  var out = [], ex = (sb.theory && sb.theory.examples) || [];
  function add(t, what) { if (t && norm(t)) out.push({ text: plain(t), what: sb.id + ' ' + what }); }
  ex.forEach(function (x, i) {
    add(x.s, 'example ' + i);
    fragments(x.g).forEach(function (f) { if (words(f).length >= 5) add(f, 'example ' + i + ' C1 gloss quote'); });
    ['A1', 'A2', 'B1', 'B2'].forEach(function (lv) {
      var g = LL[sb.id] && LL[sb.id][lv] && LL[sb.id][lv].examples ? LL[sb.id][lv].examples[i] : '';
      fragments(g).forEach(function (f) { if (words(f).length >= 5) add(f, 'example ' + i + ' ' + lv + ' gloss quote'); });
    });
  });
  return out;
}
/* fixed course text: every prompt (its instruction sentence included) and every frame */
var FIXED = ['we can see this happening in the real world when'];  /* the Standard Body A frame as the M05 lessons quote it */
C.PROMPTS.forEach(function (p) { FIXED.push(norm(p.text)); });
Object.keys(C.TYPES || {}).forEach(function (k) { FIXED.push(norm(C.TYPES[k].signal)); });
(function () {
  var T = window.Template, types = Object.keys(C.TYPES || {});
  ['B2', 'C1'].forEach(function (tier) { types.forEach(function (ty) {
    T.paragraphs(tier, ty).forEach(function (pg) { pg.frames.forEach(function (f) {
      FIXED.push(norm(String(f.text).replace(/\{[^}]*\}/g, ' ')));
      String(f.text).split(/\{[^}]*\}/).forEach(function (bit) { if (norm(bit)) FIXED.push(norm(bit)); });
    }); });
  }); });
})();
function isFixed(t) { var n = ' ' + norm(t) + ' '; return FIXED.some(function (f) { return (' ' + f + ' ').indexOf(n) >= 0; }); }
function isFixedContent(t) { var c = content(t); return FIXED.some(function (f) { var F = {}; f.split(' ').forEach(function (w) { F[w] = 1; }); return c.every(function (w) { return F[w]; }); }); }
var exempt = [];
function clash(a, b) {
  var na = norm(a), nb = norm(b);
  if (!na || !nb) return '';
  var wa = na.split(' ').length, wb = nb.split(' ').length;
  if (wa < 4 || wb < 4) return '';
  if (na === nb) return 'equal';
  if (wb >= wa && (' ' + nb + ' ').indexOf(' ' + na + ' ') >= 0) return isFixed(a) ? 'fixed:' : 'answer contains example';
  if (wa >= wb && (' ' + na + ' ').indexOf(' ' + nb + ' ') >= 0) return isFixed(b) ? 'fixed:' : 'example contains answer';
  var ca = content(a), cb = content(b);
  if (ca.length >= 3 && cb.length >= 3) {
    var B = {}; cb.forEach(function (w) { B[w] = 1; });
    var shared = ca.filter(function (w) { return B[w]; }).length, ov = shared / Math.max(ca.length, cb.length);
    if (ov >= 0.8) return Math.round(ov * 100) + '% overlap';
    /* the shorter text's content words are (almost) all inside the longer one */
    var lo = shared / Math.min(ca.length, cb.length), short = ca.length <= cb.length ? a : b;
    if (Math.min(ca.length, cb.length) >= 5 && lo >= 0.8) return isFixedContent(short) ? 'fixed:' : Math.round(lo * 100) + '% of the shorter text';
  }
  return '';
}

var flags = [], lessons = 0, exN = 0, ansN = 0;
C.TOPICS.forEach(function (t) {
  t.levels.forEach(function (lv) {
    var gate = [];
    lv.check.items.forEach(function (it) { gate = gate.concat(itemTexts(it)); });
    lv.subs.forEach(function (sb) {
      lessons++;
      var answers = gate.slice();
      sb.items.forEach(function (it) { answers = answers.concat(itemTexts(it)); });
      var exs = exampleTexts(sb);
      exN += exs.length; ansN += answers.length;
      exs.forEach(function (e) {
        answers.forEach(function (a) {
          var why = clash(e.text, a.text);
          if (why === 'fixed:') { exempt.push(e.what + ' ~ ' + a.what + ': ' + norm(a.text.length < e.text.length ? a.text : e.text).slice(0, 80)); return; }
          if (why) flags.push(e.what + ' ~ ' + a.what + ' [' + why + ']\n      example: ' + norm(e.text).slice(0, 110) + '\n      answer:  ' + norm(a.text).slice(0, 110));
        });
      });
    });
  });
});
flags.forEach(function (f) { console.log('LEAK ' + f); });
if (verbose) exempt.forEach(function (f) { console.log('fixed course text (not a leak): ' + f); });
console.log('leak-check: ' + lessons + ' lessons, ' + exN + ' example texts against ' + ansN + ' answer/option texts, ' + exempt.length + ' fixed-text match(es) exempt — ' + (flags.length ? flags.length + ' leak(s)' : 'no leaks'));
process.exit(flags.length ? 1 : 0);
