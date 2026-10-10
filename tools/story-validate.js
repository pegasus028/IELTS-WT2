#!/usr/bin/env node
/* Validates the Quillmoor story layer against QUILLMOOR-SPEC.md.
   Loads content.js + the topic files + story-content.js + sorting.js in a vm,
   then checks ids, views, keyword markup, the Sorting set and the banned-word
   list over the story and console files.
   Usage: node tools/story-validate.js [--sorting path/to/sorting.js]
   Exits 1 on any error; warnings never fail the run. */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var args = process.argv.slice(2), sortingPath = path.join(root, 'sorting.js');
for (var i = 0; i < args.length; i++) if (args[i] === '--sorting' && args[i + 1]) sortingPath = path.resolve(args[++i]);

var errors = [], warnings = [];
function err(m) { errors.push(m); }
function warn(m) { warnings.push(m); }

/* ------------------------------------------------------------------ load */
var ctx = { window: null, localStorage: { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} }, console: console };
ctx.window = ctx; ctx.global = ctx; ctx.self = ctx;
vm.createContext(ctx);
function load(f, optional) {
  var full = path.isAbsolute(f) ? f : path.join(root, f);
  if (!fs.existsSync(full)) { if (!optional) err('missing file ' + f); return false; }
  try { vm.runInContext(fs.readFileSync(full, 'utf8'), ctx, { filename: f }); return true; }
  catch (e) { err(f + ' failed to load: ' + e.message); return false; }
}
load('content.js');
fs.readdirSync(root).filter(function (f) { return /^prompts.*\.js$/.test(f); }).forEach(function (f) { load(f); });
fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort().forEach(function (f) { load(f); });
load('story-content.js');
var haveSorting = load(sortingPath, false);

var C = ctx.CONTENT || {}, STORY = ctx.STORY, SORTING = ctx.SORTING;
if (!STORY) { err('window.STORY was not defined by story-content.js'); }

/* --------------------------------------------------------- lookup tables */
var SUBS = {}, LEVELS = {}, CHECKS = {};
(C.TOPICS || []).forEach(function (t) {
  (t.levels || []).forEach(function (lv) {
    LEVELS[lv.id] = lv; CHECKS[lv.check.id] = lv;
    (lv.subs || []).forEach(function (s) { SUBS[s.id] = s; });
  });
});
var VIEWS = {};
try {
  var html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  var re = /data-view="([a-z]+)"/g, m;
  while ((m = re.exec(html))) VIEWS[m[1]] = 1;
  var re2 = /id="view-([a-z]+)"/g;
  while ((m = re2.exec(html))) VIEWS[m[1]] = 1;
} catch (e) { err('could not read index.html: ' + e.message); }

/* ------------------------------------------------------------ the story */
var KW = /\[\[([^\[\]]*)\]\]/g;
function checkKeywords(text, where, bag) {
  var s = String(text || ''), m, n = 0;
  var opens = (s.match(/\[\[/g) || []).length, closes = (s.match(/\]\]/g) || []).length;
  if (opens !== closes) err(where + ': unbalanced [[ ]] keyword markup');
  while ((m = KW.exec(s))) {
    n++;
    var parts = m[1].split('|');
    if (parts.length !== 3) err(where + ': keyword "' + m[0].slice(0, 40) + '" needs exactly 3 parts (word|gloss|Thai), has ' + parts.length);
    else {
      if (!parts[0].trim() || !parts[1].trim() || !parts[2].trim()) err(where + ': keyword with an empty part: ' + m[0]);
      if (!/[฀-๿]/.test(parts[2])) warn(where + ': third part of ' + parts[0] + ' is not Thai');
      if (bag) bag.push(parts[0].trim().toLowerCase());
    }
  }
  if (/\[[^\[\]]*\|[^\[\]]*\]/.test(s.replace(KW, ''))) warn(where + ': single-bracket markup left behind');
  return n;
}
function sentenceStats(text) {
  var plain = String(text || '').replace(KW, function (x, p) { return p.split('|')[0]; });
  var sents = plain.split(/[.!?]+(?:\s|$)/).map(function (x) { return x.trim(); }).filter(Boolean);
  var words = sents.reduce(function (a, s) { return a + s.split(/\s+/).length; }, 0);
  return { sents: sents.length, words: words, avg: sents.length ? words / sents.length : 0 };
}
if (STORY) {
  if (!Array.isArray(STORY.houses) || STORY.houses.length !== 4) err('STORY.houses must have 4 houses');
  else {
    var crits = {};
    STORY.houses.forEach(function (h) {
      ['id', 'name', 'crit', 'critName', 'values', 'main', 'accent', 'emblem', 'head', 'motto', 'welcome', 'challengeLine'].forEach(function (k) { if (!h[k]) err('house ' + (h.id || '?') + ' is missing ' + k); });
      crits[h.crit] = 1;
    });
    ['TR', 'CC', 'LR', 'GRA'].forEach(function (k) { if (!crits[k]) err('no house for criterion ' + k); });
  }
  var chs = STORY.chapters || [];
  if (chs.length !== 7) err('expected 7 chapters, found ' + chs.length);
  var keepIds = {}, chIds = {};
  chs.forEach(function (ch, idx) {
    var w = 'chapter ' + (ch.n || idx + 1);
    if (ch.n !== idx + 1) err(w + ': n should be ' + (idx + 1));
    if (!ch.id || chIds[ch.id]) err(w + ': missing or duplicate id'); chIds[ch.id] = 1;
    ['title', 'place', 'blurb', 'keepsake', 'opens', 'pages', 'missions', 'gate', 'ending'].forEach(function (k) { if (ch[k] == null) err(w + ': missing ' + k); });
    if (ch.keepsake) { if (!ch.keepsake.id || keepIds[ch.keepsake.id]) err(w + ': keepsake id missing or duplicate'); keepIds[ch.keepsake.id] = 1; }
    (ch.opens || []).forEach(function (v) { if (!VIEWS[v]) err(w + ': opens unknown view "' + v + '"'); });
    var bag = [];
    (ch.pages || []).forEach(function (pg, i) {
      var pw = w + ' page ' + (i + 1);
      if (!pg.text) err(pw + ': no text');
      if (!pg.img) warn(pw + ': no img path');
      else if (!/^story\/[a-z0-9-]+\.(webp|png|jpg|svg)$/.test(pg.img)) err(pw + ': img path should be story/<name>.webp: ' + pg.img);
      if (!pg.alt) warn(pw + ': no alt text');
      checkKeywords(pg.text, pw, bag);
      var stt = sentenceStats(pg.text);
      if (stt.avg > 15) warn(pw + ': average ' + stt.avg.toFixed(1) + ' words per sentence (B1 target ≤ 15)');
      if (pg.event && !/^(sorting|campaign|tournament)$/.test(pg.event)) err(pw + ': unknown event "' + pg.event + '"');
      if (pg.event && pg.event !== 'sorting' && !(STORY.events && STORY.events[pg.event])) err(pw + ': event "' + pg.event + '" has no STORY.events entry');
      if (pg.choice) {
        if (!pg.choice.q || !Array.isArray(pg.choice.options) || pg.choice.options.length < 2) err(pw + ': choice needs q and ≥2 options');
        (pg.choice.options || []).forEach(function (o) { if (!o.label || !o.flag) err(pw + ': choice option needs label and flag'); });
      }
    });
    if (ch.n === 1 && !(ch.pages || []).some(function (pg) { return pg.event === 'sorting'; })) err('chapter 1 has no page with event:"sorting"');
    if ((ch.pages || []).length < 5) warn(w + ': fewer than 5 pages');
    if (ch.ending) { checkKeywords(ch.ending.text, w + ' ending', bag); if (!ch.ending.text) err(w + ': ending has no text'); }
    if (bag.length < 6 || bag.length > 10) warn(w + ': ' + bag.length + ' keywords (spec: 6–10)');
    (ch.missions || []).forEach(function (m, i) {
      var mw = w + ' mission ' + (i + 1);
      if (m.kind === 'sub') { if (!SUBS[m.id]) err(mw + ': unknown sub id ' + m.id); }
      else if (m.kind === 'check') { if (!LEVELS[m.id]) err(mw + ': unknown level id ' + m.id + ' (expected mXXl1)'); }
      else if (m.kind === 'view') { if (!VIEWS[m.view]) err(mw + ': unknown view ' + m.view); if (!m.label) err(mw + ': view mission needs a label'); }
      else if (m.kind === 'writing') { if (!m.label) err(mw + ': writing mission needs a label'); }
      else if (m.kind === 'event') { if (!/^(sorting|campaign|tournament)$/.test(m.event)) err(mw + ': unknown event ' + m.event); if (!m.label) err(mw + ': event mission needs a label'); }
      else err(mw + ': unknown mission kind ' + m.kind);
    });
    if (ch.gate) {
      (ch.gate.checks || []).forEach(function (id) { if (!LEVELS[id]) err(w + ' gate: unknown level id ' + id); });
      (ch.gate.checkIds || []).forEach(function (id) { if (!CHECKS[id]) err(w + ' gate: unknown check id ' + id); });
      if (ch.gate.checks && ch.gate.checkIds) ch.gate.checks.forEach(function (id, k) { var lv = LEVELS[id]; if (lv && ch.gate.checkIds[k] && lv.check.id !== ch.gate.checkIds[k]) err(w + ' gate: ' + id + ' does not own check ' + ch.gate.checkIds[k]); });
      (ch.gate.extra || []).forEach(function (x) { if (!/^(lab-design|essay-sent|faults-under-5|best-band)$/.test(x.id)) err(w + ' gate: unknown extra id ' + x.id); if (!x.label) err(w + ' gate: extra ' + x.id + ' needs a label'); });
      if (!ch.gate.intro) warn(w + ' gate: no intro line'); if (!ch.gate.pass) warn(w + ' gate: no pass line');
    }
  });
  var ev = STORY.events || {};
  ['campaign', 'tournament'].forEach(function (k) {
    if (!ev[k]) { err('STORY.events.' + k + ' is missing'); return; }
    if (!ev[k].title) err('event ' + k + ': no title');
    (ev[k].pages || []).forEach(function (pg, i) { if (!pg.text) err('event ' + k + ' page ' + (i + 1) + ': no text'); checkKeywords(pg.text, 'event ' + k + ' page ' + (i + 1)); });
  });
  if (ev.tournament) {
    var tasks = ev.tournament.tasks || [];
    if (tasks.length !== 3) err('tournament needs 3 tasks');
    tasks.forEach(function (t) { if (!VIEWS[t.view]) err('tournament task ' + t.id + ': unknown view ' + t.view); if (!t.id || !t.label) err('tournament task needs id and label'); });
  }
  if (!STORY.mapIntro) warn('no mapIntro');
  if (!STORY.finale || !STORY.finale.text) err('no finale.text');
}

/* ---------------------------------------------------------- the Sorting */
if (haveSorting) {
  if (!SORTING || !Array.isArray(SORTING.items)) err('sorting.js must define window.SORTING.items');
  else {
    var items = SORTING.items, perCrit = { TR: 0, CC: 0, LR: 0, GRA: 0 }, pos = [0, 0, 0, 0], longest = 0, ids = {};
    if (items.length !== 12) err('sorting: expected 12 items, found ' + items.length);
    if (!SORTING.intro) warn('sorting: no intro'); if (!SORTING.tieLine) warn('sorting: no tieLine');
    items.forEach(function (it, i) {
      var w = 'sorting item ' + (it.id || i + 1);
      if (!it.id || ids[it.id]) err(w + ': missing or duplicate id'); ids[it.id] = 1;
      if (!perCrit.hasOwnProperty(it.crit)) err(w + ': bad crit ' + it.crit); else perCrit[it.crit]++;
      if (!/^(B1|B2)$/.test(it.cefr || '')) warn(w + ': cefr should be B1 or B2');
      if (!it.stem) err(w + ': no stem');
      if (!Array.isArray(it.options) || it.options.length !== 4) err(w + ': needs 4 options');
      else {
        var seen = {}; it.options.forEach(function (o) { if (seen[o]) err(w + ': duplicate option "' + o + '"'); seen[o] = 1; });
        if (typeof it.answer !== 'number' || it.answer < 0 || it.answer > 3) err(w + ': answer must be 0..3');
        else {
          pos[it.answer]++;
          var lens = it.options.map(function (o) { return String(o).length; }), max = Math.max.apply(null, lens);
          if (lens[it.answer] === max && lens.filter(function (l) { return l === max; }).length === 1) longest++;
        }
      }
      if (!it.why) err(w + ': no why'); else if (String(it.why).split(/\s+/).length > 35) warn(w + ': why over 35 words');
      if (/\b(option|answer) [a-d]\b/i.test(String(it.why))) err(w + ': why refers to an option letter');
    });
    Object.keys(perCrit).forEach(function (k) { if (perCrit[k] !== 3) err('sorting: ' + k + ' has ' + perCrit[k] + ' items (need 3)'); });
    pos.forEach(function (n, k) { if (n !== 3) err('sorting: answer position ' + 'ABCD'[k] + ' is the key ' + n + ' times (need 3)'); });
    if (longest > 4) warn('sorting: key is the single longest option in ' + longest + ' of 12 items (aim ~3)');
  }
}

/* ------------------------------------------------------- banned words */
var BANNED = ['Hogwarts', 'Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin', 'Quidditch', 'Muggle', 'Horcrux', 'Patronus', 'Dumbledore', 'Snape', 'Expelliarmus', 'Lumos', 'Accio', 'Wingardium', 'Sorting Hat', 'Platform 9', 'Hogsmeade', 'Diagon'];
var SCAN = ['story-content.js', sortingPath, 'index.html', 'student.js', 'story.js'];
SCAN.forEach(function (f) {
  var full = path.isAbsolute(f) ? f : path.join(root, f);
  if (!fs.existsSync(full)) return;
  var text = fs.readFileSync(full, 'utf8');
  BANNED.forEach(function (word) {
    var re = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (/\d$/.test(word) ? '' : 's?\\b'), 'ig');
    var hits = text.match(re);
    if (hits) err(path.basename(f) + ': banned word "' + word + '" appears ' + hits.length + ' time' + (hits.length > 1 ? 's' : ''));
  });
});

/* -------------------------------------------------------------- report */
warnings.forEach(function (w) { console.log('warn  ' + w); });
errors.forEach(function (e) { console.log('ERROR ' + e); });
console.log((errors.length ? 'FAILED: ' : 'OK: ') + errors.length + ' errors, ' + warnings.length + ' warnings' + (STORY ? ' · ' + (STORY.chapters || []).length + ' chapters' : '') + (haveSorting && SORTING ? ' · ' + (SORTING.items || []).length + ' sorting items' : ' · sorting.js not checked'));
process.exit(errors.length ? 1 : 0);
