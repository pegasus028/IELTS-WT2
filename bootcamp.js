/* ===========================================================================
   POSITION CONTROL — bootcamp.js
   A guided mission: the whole flight plan applied to one prompt, step by
   step, thinking first and writing second. Every question is a drop-down
   with four or more options. Points: 10 for a clean first choice, 5 for a
   correct second choice, minus 3 if the hint was consulted. A mission is
   cleared at 70%. Bootcamp rank rises with cumulative points.

   The matrix steps are built from the prompt's own eleven variables (the
   Matrix Arena bank), at the student's tier (B2 or C1).

   Bootcamp.build(prompt, tier)  → { steps:[{ id, title, brief, questions:[{ id, stem, options, answer, hint, why, tag }] }], total }
   Bootcamp.mount(host, { prompt, tier, onDone, onQuit, onAnswer })
   Bootcamp.RANKS, Bootcamp.CHECKLIST, Bootcamp.POINTS
   =========================================================================== */
(function (global) {
  'use strict';
  var C = global.CONTENT, T = global.Template;

  var CHECKLIST = [
    'Four or five paragraphs, and the position is stated clearly in paragraph one',
    'The position is restated in fresh words in the last paragraph, with no new idea',
    'Every part of the question is answered; both views appear if the prompt names two',
    'Each body paragraph has one central idea, a mechanism and a concrete example',
    'Each body paragraph admits a limit (nuance) without changing the overall position',
    'Cohesion by reference and substitution, not a visible linker on every sentence',
    'No memorised clichés, no "research shows", and no "I think" on every sentence',
    'Formal register: no contractions, no "you", no rhetorical questions, no bullet points',
    'Only complex structures you control; one deliberate swap per body paragraph at most',
    'Between 260 and 290 words, counted before the final five-minute check begins'
  ];
  var RANKS = [
    { min: 0, name: 'Recruit' }, { min: 100, name: 'Cadet' }, { min: 250, name: 'Officer' },
    { min: 450, name: 'Commander' }, { min: 700, name: 'Wing Leader' }, { min: 1000, name: 'Ace' }
  ];
  var POINTS = { first: 10, second: 5, hint: 3, pass: 0.7 };

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function lc(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function strip(s) { return String(s || '').replace(/\.$/, ''); }
  function shuffled(arr, seed) {
    var a = arr.slice(), s = seed || 7;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  var qseq = 0;
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; } return h; }
  var FILLERS = ['Write it any way that feels natural — the examiner does not check this', 'Skip this step to save time for the conclusion', 'Ask the invigilator during the test', 'It does not matter as long as the essay is over 250 words'];
  function q(id, stem, correct, distractors, hint, why, tag) {
    var seen = {}; seen[correct] = 1;
    var ds = distractors.filter(function (d) { if (!d || seen[d]) return false; seen[d] = 1; return true; });
    for (var f = 0; ds.length < 3 && f < FILLERS.length; f++) if (!seen[FILLERS[f]]) { ds.push(FILLERS[f]); seen[FILLERS[f]] = 1; }
    /* options are stored correct-first here; place() in build() spreads the answer position evenly across the mission */
    return { id: id, stem: stem, options: [correct].concat(ds.slice(0, 5)), answer: 0, hint: hint, why: why, tag: tag || 'kn-test-facts' };
  }
  /* Spread the correct answer evenly over the option positions for the whole mission,
     with the distractors in a hashed order, so no position and no pattern is a tell. */
  function place(steps, seed) {
    var k = 0;
    steps.forEach(function (st) { st.questions.forEach(function (qq) {
      var n = qq.options.length, correct = qq.options[0], ds = shuffled(qq.options.slice(1), seed + k * 7919);
      var slot = (k + seed) % n; k++;
      var out = ds.slice(0, slot).concat([correct]).concat(ds.slice(slot));
      qq.options = out; qq.answer = slot;
    }); });
  }

  var PARTS = { DISCUSS: ['Three: view A, view B, and your own opinion', 'Both views, then the verdict'], OPINION: ['One: your position, with two developed reasons', 'One position, held throughout'], ADVANTAGE: ['Three: the advantage, the disadvantage, and which outweighs which', 'A weighing with a verdict'], PROBLEM: ['Two: the causes and the solutions, each solution answering a cause', 'Cause → solution'], TWOPART: ['Two: one body paragraph for each question', 'Both questions, equal weight'] };
  var PARTS_D = ['Three: view A, view B, and your own opinion', 'One: your position, with two developed reasons', 'Three: the advantage, the disadvantage, and which outweighs which', 'Two: the causes and the solutions, each solution answering a cause', 'Two: one body paragraph for each question'];
  var DEMAND = { DISCUSS: 'Both views developed fairly, then your verdict in the introduction and the conclusion', OPINION: 'One position from paragraph one to the end, with two developed reasons behind it', ADVANTAGE: 'A weighing, not a list: say which side is heavier and why, in the intro and the conclusion', PROBLEM: 'Causes with their mechanism, and a solution that answers each named cause', TWOPART: 'Both questions answered with equal weight, one body paragraph for each of them' };
  var OPINION_WHERE = { DISCUSS: 'In the introduction AND the conclusion', OPINION: 'In the introduction, then held in every paragraph', ADVANTAGE: 'A verdict in the introduction and the conclusion', PROBLEM: 'A stated view of what must happen, in the introduction and the conclusion', TWOPART: 'An overall view in the introduction and the conclusion' };

  /* ------------------------------------------------------------ build */
  function build(p, tier) {
    qseq = 0;
    tier = tier === 'C1' ? 'C1' : 'B2';
    var V = (p.vars && p.vars[tier]) || (p.vars && p.vars.B2) || {};
    var ty = C.TYPES[p.type] || C.TYPES.DISCUSS, labels = T.labels(p.type);
    var steps = [];
    function vq(id, key, stem, tag) {
      var v = V[key]; if (!v) return null;
      var lab = C.VARIABLES.filter(function (x) { return x.key === key; })[0] || {};
      return q(id, stem, v.ok, v.d, lab.hint || '', cap(labels[key] || lab.name) + ' — ' + (lab.hint || '') + ' The near-miss option is on the same topic but is the wrong variable, too broad or the other side.', tag);
    }

    steps.push({ id: 'time', title: 'Before you read the prompt', brief: 'The exam gives Task 1 and Task 2 together in 60 minutes. The first decisions are about time and length, not about the topic.', questions: [
      q('time', 'How much time do I have for Task 2?', 'About 40 minutes (Task 1 gets 20)', ['About 30 minutes, half the paper', 'About 20 minutes, then Task 1', 'As long as I need — there is no split'], 'Task 2 counts twice as much as Task 1, so the hour is split 20 / 40.', 'Forty minutes. Task 2 is worth double, so it gets two-thirds of the time.', 'kn-test-facts'),
      q('split', 'How should I split those 40 minutes?', '5:00 decode and fill the matrix · 30:00 write · 5:00 check', ['Start writing immediately and use any time left at the end to check', '15 minutes of planning, 25 minutes of writing and no checking at the end', '2 minutes of reading the prompt, then 38 minutes of writing straight through'], 'Five minutes of thinking before writing produces a better essay in less time.', 'Decode the type, fill the eleven variables, write to the frames, then five minutes for the ten-point check.', 'struct-time'),
      q('words', 'What is my word target?', 'At least 250; aim for 260–290', ['Exactly 250 — no more', 'At least 150, like Task 1', 'No minimum, as long as there are four paragraphs'], 'Under 250 gives the examiner too little evidence; over 320 multiplies errors.', 'At least 250 words. 260–290 gives enough evidence without wasting checking time.', 'struct-length')
    ] });

    steps.push({ id: 'decode', title: 'Decode: 60 seconds', brief: 'Read the instruction sentence, not the topic. The type decides how many parts you must answer and where your opinion goes.', questions: [
      q('type', 'What type of question is this?', ty.name, Object.keys(C.TYPES).filter(function (k) { return k !== p.type; }).map(function (k) { return C.TYPES[k].name; }), 'Ignore the topic. The instruction sentence at the end names the job the examiner wants done — read its verbs, not the subject.', 'This is a ' + lc(ty.name) + ' question: ' + ty.signal, 'kn-question-type'),
      q('demand', 'What does Task Response demand for this type?', DEMAND[p.type], Object.keys(C.TYPES).filter(function (k) { return k !== p.type; }).map(function (k) { return DEMAND[k]; }).slice(0, 3), 'Think about the trap for this type: ' + ty.trap, ty.demand, 'kn-question-type'),
      q('parts', 'How many parts must the essay answer?', PARTS[p.type][0], PARTS_D.filter(function (x) { return x !== PARTS[p.type][0]; }).slice(0, 3), 'Count the questions and the views named in the prompt.', PARTS[p.type][1] + '. A part answered in one sentence is a part not answered.', 'tr-partial'),
      q('where', 'Where does my opinion go?', OPINION_WHERE[p.type], ['Only in the conclusion, as the final word after both sides have been shown', 'Nowhere at all — the examiner wants a neutral, balanced essay with no view', 'In the middle of body paragraph B, once the evidence has been presented', 'In every sentence of the essay, so that the reader can never miss it'].filter(function (x) { return x !== OPINION_WHERE[p.type]; }).slice(0, 3), 'An opinion that first appears in the conclusion reads as an afterthought.', OPINION_WHERE[p.type] + '. The examiner must be able to say what you think after paragraph one.', 'tr-position-late')
    ] });

    var core = vq('core', 'core', 'Which is the Core Topic — the whole issue as a noun phrase?', 'lr-nominal');
    var nomOK = V.core ? V.core.ok : '';
    steps.push({ id: 'core', title: 'Matrix 1: the Core Topic', brief: 'Name the whole issue as a nominalised noun phrase. Too broad and the essay drifts; too narrow and one side disappears. The Core Topic opens the introduction and the conclusion.', questions: [core,
      q('nom', 'Why must the Core Topic be a noun phrase?', 'It slots into every frame and opens the essay in academic register', ['Because verbs are not allowed in the introduction of an academic essay', 'Because a noun phrase is always longer and lifts the word count early', 'Because examiners count the nouns when they mark Lexical Resource'], 'Compare "banning cars" with "the regulation of private cars in city centres".', 'A nominalised topic slots into every frame and is the seed of the dense noun phrases that drive Band 8 grammar.', 'lr-nominal')
    ].filter(Boolean) });

    steps.push({ id: 'sideA', title: 'Matrix 2: Side A', brief: cap(labels.facetA) + ', then how it works, where it is seen, and its limit. Facet → mechanism → example → nuance is the shape of a Band 8 paragraph.', questions: [
      vq('facetA', 'facetA', 'Which is ' + lc(labels.facetA) + '?', 'tr-partial'),
      vq('mechA', 'mechA', 'Which is the mechanism — how ' + lc(labels.facetA) + ' actually works?', 'tr-generalised'),
      vq('exA', 'exA', 'Which is the best concrete example for side A?', 'tr-no-example'),
      vq('nuanceA', 'nuanceA', 'Which nuance limits side A without abandoning it?', 'tr-no-nuance')
    ].filter(Boolean) });

    steps.push({ id: 'sideB', title: 'Matrix 3: Side B', brief: 'The same four moves for ' + lc(labels.facetB) + '. Introduce it smoothly — "Equally significant is …", not "Secondly".', questions: [
      vq('facetB', 'facetB', 'Which is ' + lc(labels.facetB) + '?', 'tr-partial'),
      vq('mechB', 'mechB', 'Which is the mechanism behind side B?', 'tr-generalised'),
      vq('exB', 'exB', 'Which is the best concrete example for side B?', 'tr-no-example'),
      vq('nuanceB', 'nuanceB', 'Which nuance limits side B?', 'tr-no-nuance')
    ].filter(Boolean) });

    steps.push({ id: 'synth', title: 'Matrix 4: the position', brief: 'The verdict and the one reason it holds. The position appears in the introduction and again, in fresh words, in the conclusion.', questions: [
      vq('position', 'position', 'Which is the ' + lc(labels.position) + '?', 'tr-no-position'),
      vq('rationale', 'rationale', 'Which is the rationale — the one logical reason the position holds?', 'tr-generalised'),
      q('newidea', 'The conclusion may contain…', 'The Core Topic, the position in fresh words, and the rationale', ['A fresh example that none of the body paragraphs used or mentioned', 'A third facet, mentioned briefly so that the essay feels complete', 'A question for the reader to think about after finishing the essay'], 'The conclusion evaluates and restates; it never introduces.', 'Nothing new in the conclusion. A new idea there is an undeveloped idea, which costs TR and CC at once.', 'tr-new-idea')
    ].filter(Boolean) });

    /* assemble: sentences built from the frames with the variables filled */
    var vars = {}; Object.keys(V).forEach(function (k) { vars[k] = strip(V[k].ok); });
    var paras = T.paragraphs(tier, p.type);
    var introOK = T.tidy(T.fill(paras[0].frames[0].text, vars));
    var introD = ['Nowadays, in this modern era, ' + lc(strip(vars.core || 'this issue')) + ' is a hot topic that everybody is talking about. Some people agree with it and some people disagree with it, and both sides have strong feelings. In this essay I will discuss both sides of the topic and then give my own opinion at the end.',
      cap(p.text) + ' This essay will look at the question carefully and discuss it.',
      'There are many different opinions about ' + lc(strip(vars.core || 'this issue')) + '. Some people think that ' + lc(strip(vars.facetA || 'the first view')) + ' matters most, while others think that ' + lc(strip(vars.facetB || 'the second view')) + ' matters more. It is hard to say which side is right because both have good points and bad points.'];
    var nuOK = 'However, this overlooks an important limit: ' + lc(strip(vars.nuanceA || 'the idea has limits')) + '.';
    var nuD = ['However, this is completely wrong, so ' + lc(strip(vars.facetB || 'the other side')) + ' is the only answer worth considering.',
      'Another important point is ' + lc(strip(vars.facetB || 'the second facet')) + ', which also matters a great deal here.',
      'But honestly, everyone knows this doesn\'t really work in real life, whatever the experts say about it.'];
    var PAD_I = [' Many people have argued about this for a long time.', ' It is a question that affects everyone in society today.', ' There are strong opinions on both sides of the argument.', ' This essay will explain the different views in detail.'];
    var PAD_C = [' This is something that everyone should think about carefully.', ' Society will have to decide what it wants in the future.', ' There is no easy answer to a question as big as this one.', ' Only time will tell which side turns out to be right.'];
    function pad(list, target, pool) { return list.map(function (d, i) { var out = d, k = i; while (out.length < target && k < i + pool.length) { out += pool[k % pool.length]; k++; } return out; }); }
    introD = pad(introD, introOK.length, PAD_I);
    var conOK = T.tidy(T.fill(paras[3].frames[0].text, vars));
    var conD = ['In conclusion, this essay has discussed ' + lc(strip(vars.facetA || 'side A')) + ' and ' + lc(strip(vars.facetB || 'side B')) + '. Both of these are important, and people should think carefully about each of them before they make up their minds.',
      'To sum up, ' + lc(strip(vars.position || 'this is the position')) + '. In addition, governments should also invest in education and technology, because these will solve every related problem in the future.',
      'In a nutshell, every coin has two sides, and ' + lc(strip(vars.core || 'this issue')) + ' is no exception. It really depends on the situation, so it is difficult to say which side is right.'];
    conD = pad(conD, conOK.length, PAD_C);
    steps.push({ id: 'assemble', title: 'Assemble: the frames', brief: 'The eleven variables slot into four frames. Choose the sentence that fills the frame correctly — then, in the Writer, edit the frame into your own words.', questions: [
      q('intro', 'Which introduction is best?', introOK, introD, 'Core Topic, both facets, and the position, in academic register, with no cliché and no copied prompt.', 'It names the Core Topic, both facets and the position. The others are a memorised opener, the copied prompt, or a fence-sitter.', 'tr-no-position'),
      q('nuance', 'Which nuance sentence belongs at the end of Body A?', nuOK, nuD, 'Nuance admits a limit and keeps the position. It does not switch sides, add a facet, or go informal.', 'A limit, admitted in formal register, with the position intact. The others contradict, add a new facet, or break register.', 'tr-no-nuance'),
      q('concl', 'Which conclusion is best?', conOK, conD, 'Core Topic, position in fresh words, rationale. Nothing new, no cliché.', 'It evaluates and restates with the rationale. The others only summarise, add a new idea, or use a memorised cliché.', 'tr-new-idea')
    ] });

    var chk = [];
    chk.push(q('ck1', 'This paragraph fails which check? "Firstly, … Secondly, … Thirdly, … Moreover, … Finally, …"', CHECKLIST[5], [CHECKLIST[0], CHECKLIST[3], CHECKLIST[7], CHECKLIST[9]], 'Count the sentence openers.', 'Every sentence begins with a linker: mechanical cohesion. Link with reference words instead.', 'cc-linker-overuse'));
    chk.push(q('ck2', 'This sentence fails which check? "In a nutshell, this issue is a double-edged sword."', CHECKLIST[6], [CHECKLIST[1], CHECKLIST[4], CHECKLIST[8], CHECKLIST[2]], 'Two memorised phrases in one sentence.', 'Examiners discount memorised language. Say it plainly.', 'lr-memorised'));
    chk.push(q('ck3', 'This paragraph fails which check? "' + cap(strip(vars.facetA || 'The first view')) + ' is very important. It helps society in many ways. Many people agree with this."', CHECKLIST[3], [CHECKLIST[0], CHECKLIST[5], CHECKLIST[7], CHECKLIST[9]], 'Where is the mechanism? Where is the example?', 'Three claims, no mechanism, no example: over-generalised. That is the Band 7 ceiling.', 'tr-generalised'));
    chk.push(q('ck4', 'Your essay is 238 words with four minutes left. What now?', 'Add an example or the nuance to the thinner body paragraph, then check', ['Write a fifth paragraph with a completely new idea to reach the 250 mark', 'Add "In conclusion, I think it depends on the situation" to the end', 'Submit as it is — 238 words is close enough to the minimum to be safe'], 'Under 250 gives too little evidence; the cheapest safe words are an example or a nuance inside a body paragraph.', 'An example or a nuance adds words and TR credit at once. A new idea adds neither.', 'struct-length'));
    steps.push({ id: 'check', title: 'The pre-flight check: last 5 minutes', brief: 'Ten checks, in order, every time. ' + CHECKLIST.map(function (c, i) { return (i + 1) + '. ' + c; }).join('  '), questions: chk, checklist: true });

    place(steps, hash(p.id + tier) % 4);
    return { steps: steps, total: steps.reduce(function (a, s) { return a + s.questions.length * POINTS.first; }, 0) };
  }

  /* --------------------------------------------------------------- UI */
  function rankFor(points) { var r = RANKS[0]; RANKS.forEach(function (x) { if (points >= x.min) r = x; }); return r; }
  function nextRank(points) { for (var i = 0; i < RANKS.length; i++) if (RANKS[i].min > points) return RANKS[i]; return null; }

  function mount(host, cfg) {
    var p = typeof cfg.prompt === 'string' ? global.Prompts.get(cfg.prompt) : cfg.prompt;
    var mission = build(p, cfg.tier), st = { i: 0, points: 0, answered: {}, log: [] };
    var total = mission.total;
    function paint() {
      var step = mission.steps[st.i];
      var html = '<div class="wr"><div class="wr-top"><button class="btn ghost sm" id="bc-quit">✕</button>' +
        '<div class="wr-phases">' + mission.steps.map(function (s, i) { return '<span class="' + (i === st.i ? 'on' : i < st.i ? 'past' : '') + '">' + (i + 1) + '</span>'; }).join('') + '</div>' +
        '<span class="wr-words">' + st.points + ' / ' + total + ' pts</span></div>' +
        '<div class="wr-grid"><div class="wr-left">' + global.Prompts.card(p, { demand: st.i >= 1 }) + '</div><div class="wr-right">' +
        '<div class="card theory" style="gap:10px"><p class="kicker">Step ' + (st.i + 1) + ' of ' + mission.steps.length + '</p><h3>' + esc(step.title) + '</h3>' +
        (step.checklist ? '<ol class="bc-list">' + CHECKLIST.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol>' : '<p class="key" style="font-weight:500">' + esc(step.brief) + '</p>') +
        step.questions.map(function (qq) {
          var a = st.answered[qq.id] || {};
          return '<div class="bc-q' + (a.done ? (a.correct ? ' ok' : ' no') : '') + '" data-q="' + qq.id + '"><p class="bc-stem">' + esc(qq.stem) + '</p>' +
            '<select class="bc-sel" ' + (a.done ? 'disabled' : '') + '><option value="">Choose…</option>' + qq.options.map(function (o, oi) { return '<option value="' + oi + '"' + (a.wrongFirst === oi && !a.done ? ' disabled' : '') + (a.chosen === oi ? ' selected' : '') + '>' + esc(o) + (a.wrongFirst === oi ? ' ✕' : (a.done && oi === qq.answer ? ' ✓' : '')) + '</option>'; }).join('') + '</select>' +
            '<div class="bc-acts">' + (a.done ? '' : '<button class="btn sm" data-hint="' + qq.id + '"' + (a.hinted ? ' disabled' : '') + '>Hint (−' + POINTS.hint + ')</button><button class="btn primary sm" data-check="' + qq.id + '">' + (a.wrongFirst != null ? 'Try second choice (' + POINTS.second + ' pts)' : 'Check (' + POINTS.first + ' pts)') + '</button>') + '</div>' +
            (a.hinted && !a.done ? '<div class="bc-hint">' + esc(qq.hint) + '</div>' : '') +
            (a.wrongFirst != null && !a.done ? '<div class="bc-hint no">Not that one. Choose again — a correct second choice earns ' + POINTS.second + ' points.</div>' : '') +
            (a.done ? '<div class="bc-why ' + (a.correct ? 'ok' : 'no') + '"><b>' + (a.correct ? '✓ +' + a.gain : '✕ 0') + '</b> ' + (a.correct ? '' : 'Answer: ' + esc(String(qq.options[qq.answer]).replace(/\.$/, '')) + '. ') + esc(qq.why) + '</div>' : '') + '</div>';
        }).join('') +
        '<div class="qfoot"><span class="tiny">' + step.questions.filter(function (qq) { return (st.answered[qq.id] || {}).done; }).length + ' of ' + step.questions.length + ' answered</span><span class="grow"></span><button class="btn primary" id="bc-next"' + (step.questions.every(function (qq) { return (st.answered[qq.id] || {}).done; }) ? '' : ' disabled') + '>' + (st.i + 1 >= mission.steps.length ? 'Finish mission' : 'Next step →') + '</button></div></div></div></div></div>';
      host.innerHTML = html;
      host.querySelector('#bc-quit').addEventListener('click', function () { if (cfg.onQuit) cfg.onQuit(); });
      host.querySelectorAll('[data-hint]').forEach(function (b) { b.addEventListener('click', function () { var a = st.answered[b.dataset.hint] || (st.answered[b.dataset.hint] = {}); a.hinted = true; paint(); }); });
      host.querySelectorAll('[data-check]').forEach(function (b) { b.addEventListener('click', function () {
        var id = b.dataset.check, qq = step.questions.filter(function (x) { return x.id === id; })[0];
        var sel = host.querySelector('[data-q="' + id + '"] .bc-sel'); var v = sel.value; if (v === '') return;
        var a = st.answered[id] || (st.answered[id] = {}); var oi = parseInt(v, 10); a.chosen = oi;
        if (oi === qq.answer) { a.done = true; a.correct = true; a.gain = Math.max(0, (a.wrongFirst != null ? POINTS.second : POINTS.first) - (a.hinted ? POINTS.hint : 0)); st.points += a.gain; }
        else if (a.wrongFirst == null) { a.wrongFirst = oi; }
        else { a.done = true; a.correct = false; a.gain = 0; }
        if (a.done) { st.log.push({ id: id, tag: qq.tag, correct: a.correct, hinted: !!a.hinted, second: a.wrongFirst != null }); if (cfg.onAnswer) cfg.onAnswer({ promptId: p.id, id: id, tag: qq.tag, correct: a.correct, hinted: !!a.hinted, second: a.wrongFirst != null, gain: a.gain }); }
        paint();
        var el = host.querySelector('[data-q="' + id + '"]'); if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }); });
      host.querySelector('#bc-next').addEventListener('click', function () {
        if (st.i + 1 >= mission.steps.length) { if (cfg.onDone) cfg.onDone({ promptId: p.id, points: st.points, total: total, passed: st.points / total >= POINTS.pass, log: st.log }); return; }
        st.i++; paint(); window.scrollTo({ top: 0 });
      });
    }
    paint();
    return { state: st };
  }

  global.Bootcamp = { build: build, mount: mount, RANKS: RANKS, CHECKLIST: CHECKLIST, POINTS: POINTS, rankFor: rankFor, nextRank: nextRank };
})(window);
