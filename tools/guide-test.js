#!/usr/bin/env node
/* ===========================================================================
   QUILLMOOR ACADEMY · SCRIPTORIUM — tools/guide-test.js  (15 Nov 2026)
   Checks for High and Medium guidance (Task 2): the engine (guide.js) and every
   script in guide/<promptId>.js with its Medium cases in
   tools/guide-cases/<promptId>.json. Standard: docs/GUIDE-AUTHORING-T2.md.
   Ported from the Task 1 app (IELTS-WT1 tools/guide-test.js).

     node tools/guide-test.js                   every script, exit 1 on failure
     node tools/guide-test.js p-cars-city       one or more scripts (substring)
     node tools/guide-test.js --essay           also print the essay each script builds
     node tools/guide-test.js --index           ONLY rewrite guide-index.js from the guide/ folder, then stop
                                                (so a writer's index run never tests other writers' files)

   For every script:
     0  ES5 (no arrow functions, let / const, template literals, regex lookbehind);
        registers exactly its own prompt id; guide-index.js lists it; never a mock prompt.
     1  shape: five sections (triage, intro, bodyA, bodyB, conclusion; panes
        null,0,1,2,3); 45–60 steps; t-type, t-parts, t-trap, t-core, t-facetA,
        t-facetB and t-position exist; unique ids with the section's letter
        (t- i- a- b- c-); label (≤ 24 characters), question, one right option and
        three wrong ones, all different, each wrong one with its own hint; a tag in
        REMEDIATION; the Medium fields (askFree, shape, expect, accept, hint,
        hint2); every regex compiles; t-type names the prompt's type; 6 or more
        steps (at most 60%) carry ai: true; on a step WITHOUT ai: true every accept
        alternative is anchored (^…$).
     2  hints never give the answer: no hint (wrong option, reject, hint, hint2)
        and no shape contains the right option (5+ characters).
     3  options: the right one is the longest in at most a third of the steps,
        and its position is spread over the four places.
     4  the essay built from the right options: four paragraphs, 260–290 words,
        clean joins, capitals and full stops; Writer.preflight (B2 share 40%,
        practice) has NO red and NO amber row (so the position is in paragraph 1
        and restated in paragraph 4, every body has mechanism, example and nuance,
        reference, register, template share); Writer.checkThesis passes on the
        last sentence of paragraph 1 and Writer.checkBody on both bodies; no run
        of 8+ words copied from the prompt; no digit in the essay unless the
        script lists it in facts[] (a checked real-world fact); every one of the
        eleven variables of the script's tier has a step (v: key) whose right
        option carries at least half of the variable's content words; a v-step
        whose wrong options come from the variable's near-misses (d[]) has the
        Duelling Hall's right answer as its right option (the duel and High never
        disagree); with spine: 'b2-u', each paragraph follows its Universal Spine
        line (template.js b2-u-i / -a / -b / -c) word for word around the slots.
     5  Medium rule check: the right option of every step is accepted; no wrong
        option is accepted outright; every row of the cases file behaves as it
        says ('accept' | 'revise' | 'not-accept'); every step has at least three
        rows, an accepted one, one sent back, and an accepted wording that is not
        the right option when expect lists "also accepted".
     6  Guide.tidy / Guide.essay: answers typed without a first capital and with
        stray punctuation build the same essay; leaks() catches a hint that
        quotes the answer and never flags the step's own hints.
     7  the estimated High run (reading the question, the options and the gap at
        150 words a minute, plus 12 s a decision and 25 s a wrong choice on a
        third of the steps) is printed; over 40 minutes fails.
   =========================================================================== */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var ROOT = path.resolve(__dirname, '..'), GDIR = path.join(ROOT, 'guide'), CDIR = path.join(__dirname, 'guide-cases');
var argv = process.argv.slice(2), SHOW = argv.indexOf('--essay') >= 0, WRITE_INDEX = argv.indexOf('--index') >= 0;
var ONLY = argv.filter(function (a) { return a.indexOf('--') !== 0; });
if (!fs.existsSync(GDIR)) fs.mkdirSync(GDIR);
if (!fs.existsSync(CDIR)) fs.mkdirSync(CDIR);
/* 15 Nov 2026: three levels per prompt: guide/<id>.js (B2), guide/<id>.b1.js, guide/<id>.c1.js */
var files = fs.readdirSync(GDIR).filter(function (f) { return /^p-[a-z0-9-]+(\.(b1|c1))?\.js$/.test(f); }).sort();

if (WRITE_INDEX) {
  var out = '/* Prompts with a High / Medium guidance script (guide/<promptId>.js). Rebuilt by: node tools/guide-test.js --index */\n' +
    'window.GUIDE_INDEX = ' + JSON.stringify(files.map(function (f) { return f.replace(/\.js$/, ''); }), null, 0).replace(/","/g, '", "') + ';\n';
  fs.writeFileSync(path.join(ROOT, 'guide-index.js'), out);
  console.log('guide-index.js: ' + files.length + ' scripts');
  process.exit(0);
}

var store = {};
var ctx = { console: console, localStorage: { getItem: function (k) { return store[k] || null; }, setItem: function (k, v) { store[k] = String(v); }, removeItem: function (k) { delete store[k]; } } };
ctx.window = ctx; vm.createContext(ctx);
['content.js', 'prompts.js', 'prompts-2.js', 'template.js', 'lab-content.js', 'models.js', 'prompts-mock.js', 'writer.js', 'guide-index.js', 'guide.js'].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
});
var G = ctx.Guide, W = ctx.Writer, C = ctx.CONTENT, PR = ctx.Prompts, T = ctx.Template;
var fails = 0, oks = 0;
function ok(c, msg) { if (c) oks++; else { fails++; console.log('  FAIL  ' + msg); } }
function norm(t) { return String(t).toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').replace(/[.,;!]+$/, '').trim(); }
function words(t) { return W.words(t); }
function strip(src) { return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g, "''"); }
var STOP = { the: 1, a: 1, an: 1, of: 1, to: 1, in: 1, and: 1, or: 1, for: 1, on: 1, at: 1, by: 1, with: 1, that: 1, which: 1, who: 1, is: 1, are: 1, be: 1, has: 1, have: 1, as: 1, they: 1, their: 1, its: 1, it: 1, no: 1, into: 1, from: 1, this: 1, while: 1, each: 1, can: 1, should: 1 };
function contentWords(t) { return norm(t).replace(/[^a-z' -]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 2 && !STOP[w]; }); }
function stem(w) { return w.replace(/(ing|ed|es|s)$/, '').slice(0, 6); }
function overlap(a, b) { var bs = {}; contentWords(b).forEach(function (w) { bs[stem(w)] = 1; }); var aw = contentWords(a); if (!aw.length) return 1; return aw.filter(function (w) { return bs[stem(w)]; }).length / aw.length; }
function longestRun(text, src) {
  var tw = norm(text).replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean), qw = norm(src).replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean), best = 0;
  for (var i = 0; i < tw.length; i++) for (var j = 0; j < qw.length; j++) { var k = 0; while (tw[i + k] && tw[i + k] === qw[j + k]) k++; if (k > best) best = k; }
  return best;
}
/* the top-level alternatives of a regex source (split on | outside brackets) */
function topAlts(src) {
  var out = [], cur = '', depth = 0, cls = false;
  for (var i = 0; i < src.length; i++) {
    var ch = src.charAt(i);
    if (ch === '\\') { cur += ch + src.charAt(i + 1); i++; continue; }
    if (cls) { if (ch === ']') cls = false; cur += ch; continue; }
    if (ch === '[') cls = true; else if (ch === '(') depth++; else if (ch === ')') depth--;
    if (ch === '|' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur); return out;
}
var SECTIONS = 'triage,intro,bodyA,bodyB,conclusion', PREFIX = { triage: 't', intro: 'i', bodyA: 'a', bodyB: 'b', conclusion: 'c' };
var TYPE_WORD = { DISCUSS: /discuss/i, OPINION: /agree|disagree|extent/i, ADVANTAGE: /advantage|outweigh/i, PROBLEM: /problem|cause|solution/i, TWOPART: /two|question/i };
var VARS = C.VARIABLES.map(function (v) { return v.key; });
var mockIds = (C.MOCK_PROMPTS || []).map(function (m) { return m.id; });

var todo = files.filter(function (f) { return !ONLY.length || ONLY.some(function (o) { return f.indexOf(o) >= 0; }); });

todo.forEach(function (f) {
  var key = f.replace(/\.js$/, ''), pid = key.split('.')[0], cefr = (key.split('.')[1] || 'b2').toUpperCase(), src = fs.readFileSync(path.join(GDIR, f), 'utf8');
  /* 0 */
  var bare = strip(src);
  ok(!/=>/.test(bare), pid + ': arrow function (not ES5)');
  ok(!/(^|[;{}\s])(let|const)\s+[A-Za-z_$]/m.test(bare), pid + ': let / const (not ES5)');
  ok(!/`/.test(bare), pid + ': template literal (not ES5)');
  ok(src.indexOf('(?<') < 0, pid + ': a regular expression uses lookbehind "(?<" (old iPads cannot compile it; the rule would be skipped)');
  ok(mockIds.indexOf(pid) < 0, pid + ': a mock prompt must never get a script');
  var before = Object.keys(ctx.GUIDE_SCRIPTS || {});
  try { vm.runInContext(src, ctx, { filename: 'guide/' + f }); } catch (e) { ok(false, pid + ': the file does not run: ' + e.message); return; }
  var added = Object.keys(ctx.GUIDE_SCRIPTS || {}).filter(function (k) { return before.indexOf(k) < 0; });
  ok(added.length === 1 && added[0] === key, key + ': the file must register GUIDE_SCRIPTS["' + key + '"] and nothing else (found ' + added.join(', ') + ')');
  ok((ctx.GUIDE_INDEX || []).indexOf(key) >= 0, key + ': not in guide-index.js (run node tools/guide-test.js --index)');
  var sc = ctx.GUIDE_SCRIPTS[key]; if (!sc) return;
  var p = PR.get(pid), flat = G.steps(sc);
  console.log(key + ' · ' + flat.length + ' steps');
  ok(!!p, pid + ': the prompt exists in the practice bank'); if (!p) return;
  var tier = sc.tier || 'B2', vt = (p.vars || {})[tier] || {};
  ok(tier === cefr, key + ': tier must be ' + cefr + ' for this file (found ' + tier + ')');
  ok(Object.keys(vt).length === 11, key + ': the prompt has no vars.' + tier);
  pid = key;

  /* 1 */
  ok(sc.promptId === pid && sc.version >= 1, pid + ': promptId and version');
  ok(sc.sections.map(function (s) { return s.id; }).join() === SECTIONS, pid + ': five sections in order (' + SECTIONS + ')');
  ok(sc.sections.map(function (s) { return String(s.pane); }).join() === 'null,0,1,2,3', pid + ': panes null,0,1,2,3');
  sc.sections.forEach(function (s) { ok(s.title && s.note && s.steps && s.steps.length >= 5, pid + ' ' + s.id + ': title, note and at least five steps'); });
  ok(flat.length >= 45 && flat.length <= 60, pid + ': ' + flat.length + ' steps (45–60)');
  var ids = {}, longest = 0, pos = [0, 0, 0, 0], readW = 0;
  flat.forEach(function (x) {
    var st = x.step, tag = pid + ' ' + st.id + ': ';
    ok(/^[tiabc]-[a-z0-9]+$/i.test(st.id), tag + 'id is t-/i-/a-/b-/c- + a name');
    ok(st.id.charAt(0) === PREFIX[x.section.id], tag + 'the id prefix matches its section');
    ok(!ids[st.id], tag + 'unique id'); ids[st.id] = 1;
    ok(st.label && st.ask && st.ok && typeof st.ok === 'string', tag + 'label, ask and ok');
    ok(st.label && st.label.length <= 24, tag + 'label is short (24 characters)');
    ok(st.wrong && st.wrong.length === 3, tag + 'three wrong options');
    var all = [st.ok].concat((st.wrong || []).map(function (w) { return w[0]; }));
    ok(all.filter(function (t, i) { return all.map(norm).indexOf(norm(t)) === i; }).length === 4, tag + 'four different options');
    (st.wrong || []).forEach(function (w) { ok(w[1] && w[1].length > 20, tag + 'a hint on "' + w[0] + '"'); });
    ok(C.REMEDIATION[st.tag], tag + 'tag ' + st.tag + ' is in REMEDIATION');
    ok(st.askFree && st.shape && st.expect && st.accept && st.accept.length && st.hint && st.hint2, tag + 'Medium fields (askFree, shape, expect, accept, hint, hint2)');
    ok(!st.v || VARS.indexOf(st.v) >= 0, tag + 'v is one of the eleven variable keys');
    (st.accept || []).forEach(function (g) {
      ok(g && g.length, tag + 'an accept group is empty');
      (g || []).forEach(function (a) {
        try { new RegExp(a, 'i'); } catch (e) { ok(false, tag + 'accept regex ' + a); }
        if (st.ai !== true) topAlts(a).forEach(function (alt) { ok(/^\^/.test(alt) && /\$$/.test(alt), tag + 'no ai: true, so every accept alternative must be anchored ^…$: ' + alt); });
      });
    });
    (st.reject || []).forEach(function (r) { try { new RegExp(r.re, 'i'); } catch (e) { ok(false, tag + 'reject regex ' + r.re); } ok(r.hint && r.hint.length > 15, tag + 'reject hint'); });
    ok(st.pre == null || /^(|[,.:;]? ?)$/.test(st.pre), tag + 'pre is "", " ", ", ", ". ", ": " or "; "');
    ok(st.post == null || /^[,.:;]?$/.test(st.post), tag + 'post is "", ",", ".", ":" or ";"');
    ok(!/[,.;:]$/.test(st.ok) || !st.post, tag + 'the right option ends with punctuation that post supplies');
    /* 2 */
    var hints = (st.wrong || []).map(function (w) { return w[1]; }).concat([st.hint, st.hint2, st.shape], (st.reject || []).map(function (r) { return r.hint; }));
    var a = norm(st.ok).replace(/^[:,.;] ?/, '');
    hints.forEach(function (h) {
      if (a.length >= 5) ok(norm(h).indexOf(a) < 0, tag + 'a hint or shape contains the answer: ' + h);
      ok(!G.leaks(st, h), tag + 'leaks() flags the step\'s own hint: ' + h);
    });
    /* 3 */
    var lens = all.map(function (t) { return t.length; });
    if (lens[0] > Math.max.apply(null, lens.slice(1))) longest++;
    var order = G.options(st, sc); ok(order.length === 4 && order.filter(function (o) { return o.ok; }).length === 1, tag + 'options(): four, one right');
    /* "template", never "Spine", in anything a student reads (T.Chris, 15 Nov 2026) */
    var seen = [st.label, st.ask, st.askFree, st.shape, st.expect, st.hint, st.hint2, x.section.title, x.section.note].concat((st.wrong || []).map(function (w) { return w[1]; }), (st.reject || []).map(function (r) { return r.hint; }));
    seen.forEach(function (t) { ok(!/spine/i.test(t || ''), tag + 'says "Spine" (use "template"): ' + t); });
    if (tier === 'B1') {
      ok(words(st.ask) <= 22, tag + 'B1: the question has ' + words(st.ask) + ' words (keep it to 22)');
      [st.hint, st.hint2].concat((st.wrong || []).map(function (w) { return w[1]; })).forEach(function (h) { ok(words(h || '') <= 30, tag + 'B1: a hint of ' + words(h || '') + ' words (keep it to 30): ' + h); });
    }
    order.forEach(function (o, i) { if (o.ok) pos[i]++; });
    readW += words(st.ask) + all.reduce(function (n, t) { return n + words(t); }, 0) + (x.first && x.section.note ? words(x.section.note) : 0);
    /* 5 */
    ok(G.localCheck(st, st.ok, sc).verdict === 'accept', tag + 'the right option does not pass the Medium rule check');
    (st.wrong || []).forEach(function (w) { ok(G.localCheck(st, w[0], sc).verdict !== 'accept', tag + 'wrong option accepted by the Medium rule check: ' + w[0]); });
    /* the duel and High never disagree */
    if (st.v && vt[st.v]) {
      var d = (vt[st.v].d || []).map(norm), fromDuel = (st.wrong || []).filter(function (w) { return d.indexOf(norm(w[0])) >= 0; }).length;
      if (fromDuel) ok(norm(st.ok) === norm(vt[st.v].ok), tag + 'its wrong options are the duel\'s near-misses, so its right option must be the duel\'s right answer: ' + vt[st.v].ok);
    }
  });
  var nAi = flat.filter(function (x) { return x.step.ai === true; }).length;
  ok(nAi >= 6 && nAi <= flat.length * 0.6, pid + ': ' + nAi + ' steps have ai: true (at least 6, at most 60%)');
  ['t-type', 't-parts', 't-trap', 't-core', 't-facetA', 't-facetB', 't-position'].forEach(function (id) { ok(ids[id], pid + ': step ' + id + ' is required'); });
  var tt = flat.filter(function (x) { return x.step.id === 't-type'; })[0];
  if (tt) ok(TYPE_WORD[p.type] && TYPE_WORD[p.type].test(tt.step.ok), pid + ': t-type answers "' + tt.step.ok + '" but the prompt is ' + p.type);
  ok(longest <= flat.length / 3, pid + ': the right option is the longest in ' + longest + ' of ' + flat.length + ' steps (max a third)');
  ok(Math.max.apply(null, pos) - Math.min.apply(null, pos) <= 1, pid + ': positions of the right option are not balanced: ' + pos.join(' / '));
  /* every variable of the tier is in the essay, in meaning */
  VARS.forEach(function (k) {
    var vs = flat.filter(function (x) { return x.step.v === k && x.section.pane != null; }), want = vt[k] && vt[k].ok;
    ok(vs.length > 0, pid + ': no essay step carries variable ' + k + ' (set v: \'' + k + '\')');
    if (vs.length && want) { var best = Math.max.apply(null, vs.map(function (x) { return overlap(want, x.step.ok); })); ok(best >= 0.5, pid + ': variable ' + k + ' is not in the essay in meaning (' + Math.round(best * 100) + '% of its content words)'); }
  });

  /* 4 the essay */
  var es = G.essay(sc, G.key(sc)), n = words(es.text);
  ok(es.panes.every(function (t) { return t.length > 60; }), pid + ': four paragraphs');
  ok(n >= 260 && n <= 290, pid + ': ' + n + ' words (260–290)');
  ok(!/\s[,.;:]|,,|\.\.|  |,\.|[a-z]\.[A-Za-z]/.test(es.text), pid + ': broken joins in the essay');
  es.panes.forEach(function (t, i) { ok(/^[A-Z]/.test(t) && /\.$/.test(t), pid + ': paragraph ' + (i + 1) + ' starts with a capital and ends with a full stop'); W.sentences(t).forEach(function (s) { ok(/^[A-Z]/.test(s), pid + ': sentence starts with a capital: ' + s.slice(0, 40)); }); });
  var pre = W.preflight(es.text, p, { share: tier === 'C1' ? 0.3 : tier === 'B1' ? 0.5 : 0.4, practice: true });
  pre.rows.forEach(function (r) { ok(r.status === 'ok', pid + ': ward ' + r.id + ' is ' + r.status + ' (' + r.label + ')'); });
  var p1 = W.sentences(es.panes[0]), th = W.checkThesis(p1[p1.length - 1], {});
  ok(th.ok, pid + ': the thesis (last sentence of paragraph 1) fails Writer.checkThesis: ' + th.notes.join(' '));
  [1, 2].forEach(function (i) { var cb = W.checkBody(es.panes[i], {}); ok(cb.ok, pid + ': body ' + i + ' fails Writer.checkBody: ' + cb.notes.join(' ')); });
  var run = longestRun(es.text, p.text);
  ok(run < 8, pid + ': ' + run + ' words in a row copied from the prompt (keep under 8)');
  var facts = sc.facts || [];
  (es.text.match(/\d[\d,.]*/g) || []).forEach(function (num) { ok(facts.some(function (fc) { return String(fc.text || fc).indexOf(num) >= 0; }), pid + ': the figure ' + num + ' is in the essay: check it and list it in facts[] with its source, or make the example hypothetical'); });
  /* the template the essay follows, word for word around its slots: frames:[intro, bodyA, bodyB, conclusion] ids from
     template.js, or spine:'b2-u' for the B2 Universal template (b2-u-i / -a / -b / -c) */
  var fids = sc.frames || (sc.spine === 'b2-u' ? ['b2-u-i', 'b2-u-a', 'b2-u-b', 'b2-u-c'] : null);
  ok(!!fids && fids.length === 4, pid + ': name the template lines the essay follows (frames: [4 ids] or spine: \'b2-u\')');
  if (fids && fids.length === 4) {
    var allFr = {}; ['B2', 'C1'].forEach(function (tr) { T.paragraphs(tr, p.type).forEach(function (pg) { pg.frames.forEach(function (x) { allFr[x.id] = x; }); }); });
    ['i', 'a', 'b', 'c'].forEach(function (suf, i) {
      var fid = fids[i], fr = allFr[fid];
      ok(!!fr, pid + ': template line ' + fid + ' not found in template.js'); if (!fr) return;
      var segs = fr.text.split(/\{\w+\}/).map(function (x) { return norm(x).replace(/^[,.;:]\s*/, '').replace(/[,.;:]\s*$/, ''); }).filter(function (x) { return x.length >= 3; }), at = 0, pt = norm(es.panes[i]);
      segs.forEach(function (sg) { var k = pt.indexOf(sg, at); ok(k >= 0, pid + ': paragraph ' + (i + 1) + ' does not follow its template line (' + fid + '): missing "' + sg + '" in order'); if (k >= 0) at = k + sg.length; });
    });
  }
  var est = Math.round((readW / 150 * 60 + flat.length * 12 + flat.length / 3 * 25) / 60);
  /* level measure (printed): words of 9+ letters in the essay, words per question */
  var ew = norm(es.text).replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean), longW = Math.round(100 * ew.filter(function (w) { return w.length >= 9; }).length / ew.length), askW = Math.round(flat.reduce(function (n, x) { return n + words(x.step.ask); }, 0) / flat.length);
  if (SHOW) console.log('[' + tier + '] long words (9+ letters) ' + longW + '% of the essay · ' + askW + ' words per question');
  if (SHOW) console.log('\n' + es.text + '\n\n(' + n + ' words · ' + es.panes.map(words).join(' / ') + ' · template share ' + Math.round((pre.ratio || 0) * 100) + '% · right option longest in ' + longest + ' steps · positions ' + pos.join(' / ') + ' · ' + nAi + ' ai steps · est. High run ' + est + ' min)\n');
  ok(est <= 40, pid + ': the estimated High run is ' + est + ' minutes (aim 25–35, max 40)');

  /* 5 the Medium cases */
  var cf = path.join(CDIR, pid + '.json'), cases = [];
  ok(fs.existsSync(cf), pid + ': no cases file tools/guide-cases/' + pid + '.json');
  if (fs.existsSync(cf)) { try { cases = JSON.parse(fs.readFileSync(cf, 'utf8')); } catch (e) { ok(false, pid + ': cases file is not valid JSON: ' + e.message); } }
  cases.forEach(function (row) {
    var st = flat.filter(function (x) { return x.step.id === row[0]; })[0]; if (!st) { ok(false, pid + ': cases name a step that does not exist: ' + row[0]); return; }
    var v = G.localCheck(st.step, row[1], sc).verdict;
    ok(row[2] === 'not-accept' ? v !== 'accept' : v === row[2], pid + ' ' + row[0] + ' "' + row[1] + '" → ' + v + ' (want ' + row[2] + ')');
  });
  flat.forEach(function (x) {
    var rows = cases.filter(function (r) { return r[0] === x.step.id; });
    ok(rows.length >= 3, pid + ' ' + x.step.id + ': needs at least three Medium cases (has ' + rows.length + ')');
    ok(rows.some(function (r) { return r[2] !== 'accept'; }), pid + ' ' + x.step.id + ': needs a case that is sent back');
    ok(rows.some(function (r) { return r[2] === 'accept'; }), pid + ' ' + x.step.id + ': needs an accepted case');
    if (/also accepted/i.test(x.step.expect)) ok(rows.some(function (r) { return r[2] === 'accept' && norm(r[1]) !== norm(x.step.ok); }), pid + ' ' + x.step.id + ': needs an accepted case that is not the right option itself');
  });

  /* 6 free text joins cleanly */
  var typed = {}, k = G.key(sc), nth = 0;
  flat.forEach(function (x) {
    var a = k[x.step.id], e = a.charAt(0).toLowerCase() + a.slice(1); nth++;
    if (/^[A-Z]{2}/.test(a) || (sc.proper || []).some(function (pn) { return a.indexOf(pn) === 0; })) e = a;
    typed[x.step.id] = (nth % 3 === 0 ? '  ' : '') + e + (x.step.post ? x.step.post : nth % 4 === 0 ? '.' : nth % 5 === 0 ? ' ,' : '') + (nth % 2 ? ' ' : '');
  });
  var es2 = G.essay(sc, typed);
  ok(es2.text.toLowerCase() === es.text.toLowerCase(), pid + ': answers with stray punctuation build a different essay\n' + es2.text);
  ok(es2.panes.every(function (t) { return /^[A-Z]/.test(t) && !/\s[,.;:]|,,|\.\./.test(t); }), pid + ': capitals and joins are not repaired');
  flat.forEach(function (x) { ok(G.leaks(x.step, 'Write "' + x.step.ok.replace(/^[:;] /, '') + '" here.'), pid + ' ' + x.step.id + ': leaks() misses a hint that quotes the answer'); });
});

if (!ONLY.length) {
  (ctx.GUIDE_INDEX || []).forEach(function (pid) { ok(files.indexOf(pid + '.js') >= 0, 'guide-index.js lists ' + pid + ' but guide/' + pid + '.js does not exist'); });
  fs.readdirSync(CDIR).forEach(function (f) { ok(files.indexOf(f.replace(/\.json$/, '.js')) >= 0, 'tools/guide-cases/' + f + ' has no script'); });
  /* the engine itself */
  ok(!G.has('p-mock-degree-choice') && G.script('p-mock-degree-choice') === null, 'engine: a mock prompt never has a script');
  ok(G.tidy({ post: '.' }, ' hello world. ') === 'hello world', 'engine: tidy() drops her own closing full stop when post supplies one');
}
console.log(fails ? '\nguide-test: ' + fails + ' FAILED, ' + oks + ' ok · ' + todo.length + ' script(s)' : '\nguide-test: all ' + oks + ' checks passed · ' + todo.length + ' script(s)');
process.exit(fails ? 1 : 0);
