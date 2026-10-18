/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — template.js  (My Spellbook)
   The customisable Matrix template: four paragraph frames at two tiers,
   several openers per paragraph, playbooks that re-map the eleven variables
   for the other question types, the three structural swaps, and the tools the
   Writer and the pre-flight check need.

   Template.paragraphs(tier, type)      → [{ key, name, target, frames:[{id,name,text,tag}], slots:[…] }]
   Template.labels(type)                → { core:'Core Topic', facetA:'View A', … } (playbook names)
   Template.fill(text, vars, opts)      → frame text with {slots} replaced (HTML or plain)
   Template.tokens(text)                → ['core','facetA',…]
   Template.compose(tier, type, vars, choice, custom) → the whole essay as text
   Template.ratio(essay, tier, type)    → share of the essay that is unchanged frame text (0–1)
   Template.load(studentId) / save(studentId, custom)   "my template" per student (also on p.spellbook)
   Template.setShare(studentId, pct) / share(studentId) the chosen template share
   Template.inUse(studentId)            → { kind, text, … } which spellbook the Scriptorium uses
   Template.SWAPS, Template.FADE

   Frames are written with {key} tokens. TO CHANGE THE TEMPLATE: edit the
   text below. Any number of frames per paragraph; the first is the default.
   Every frame must use only the keys listed in CONTENT.VARIABLES.
   =========================================================================== */
(function (global) {
  'use strict';
  var C = global.CONTENT;

  /* -------------------------------------------------------------- tiers */
  var TIERS = {
    B2: {
      name: 'Band 7 track', cefr: 'B2', blurb: 'Plain frames, four moves per paragraph. The B2 Essay Engineering spellbook.',
      paragraphs: [
        { key: 'intro', name: 'Introduction', target: 50, frames: [
          { id: 'b2-u-i', name: 'Universal Spine', text: 'The question of {core} matters to many people today. The first key point is {facetA}, and the second is {facetB}. This essay looks at both and argues that {position}.' },
          { id: 'b2-i1', name: 'Standard', text: 'People often discuss the topic of {core} because it has many different effects. While many people focus on {facetA}, it is also important to consider {facetB}. To fully understand this issue, we need to look at both sides carefully. Personally, I believe that {position}.' },
          { id: 'b2-i2', name: 'Question first', text: 'The question of {core} is one that many people feel strongly about. Some point to {facetA}, while others are more concerned with {facetB}. This essay looks at both sides before arguing that {position}.' },
          { id: 'b2-i3', name: 'Plain', text: 'In recent years, {core} has become an important debate. On one side there is {facetA}; on the other there is {facetB}. In my view, {position}, and this essay explains why.' }
        ] },
        { key: 'bodyA', name: 'Body A', target: 95, frames: [
          { id: 'b2-u-a', name: 'Universal Spine', text: 'The first key point is {facetA}. It works by {mechA}. We can see this clearly in {exA}. However, {nuanceA}, so this point has its limits.' },
          { id: 'b2-a1', name: 'Standard', text: 'One important part of this issue is {facetA}. This idea works by {mechA}. We can see this happening in the real world in {exA}. However, looking only at this side misses an important point; in reality, {nuanceA}, which shows that this is not a perfect solution.' },
          { id: 'b2-a2', name: 'Cause first', text: 'The first side of the debate is {facetA}. It works by {mechA}. A clear example is {exA}. Even so, {nuanceA}, so this argument has its limits.' },
          { id: 'b2-a3', name: 'Example first', text: 'Consider {exA}. This shows the importance of {facetA}, which works by {mechA}. It would be a mistake, though, to stop here: {nuanceA}.' }
        ] },
        { key: 'bodyB', name: 'Body B', target: 95, frames: [
          { id: 'b2-u-b', name: 'Universal Spine', text: 'The second key point is {facetB}. It operates through {mechB}, and the effect is visible in {exB}. Even so, {nuanceB}, which is worth remembering.' },
          { id: 'b2-b1', name: 'Standard', text: 'Another very important part of the debate is {facetB}. This side is based on {mechB}, which usually leads to results like {exB}. Still, we must also be careful with this view. Even though it has a big impact, we must remember that {nuanceB}.' },
          { id: 'b2-b2', name: 'Contrast', text: 'On the other side of the argument is {facetB}. Supporters point to {mechB}; a good illustration of this is {exB}. Yet {nuanceB}, which means this view cannot be accepted without question.' },
          { id: 'b2-b3', name: 'Equally', text: 'Just as important is {facetB}. It works through {mechB}, and we see this in {exB}. At the same time, {nuanceB}, so the picture is more complicated than it first appears.' }
        ] },
        { key: 'conclusion', name: 'Conclusion', target: 45, frames: [
          { id: 'b2-u-c', name: 'Universal Spine', text: 'In conclusion, {position}. Taking {facetA} together with {facetB}, this is the most reasonable view, because {rationale}.' },
          { id: 'b2-c1', name: 'Standard', text: 'To sum up, simply looking at {core} from one side is not enough to show the whole picture. A better way to look at it is that {position}. This view makes the most sense because {rationale}.' },
          { id: 'b2-c2', name: 'Verdict', text: 'In conclusion, both sides of {core} have real strengths and real limits. My own position is that {position}, mainly because {rationale}.' },
          { id: 'b2-c3', name: 'Plain', text: 'Overall, {core} cannot be judged from one side alone. The most reasonable position is that {position}, since {rationale}.' }
        ] }
      ]
    },
    C1: {
      name: 'Band 8 track', cefr: 'C1', blurb: 'The AR Lexical Matrix: nominalised openers, three options per paragraph, structural swaps.',
      paragraphs: [
        { key: 'intro', name: 'Introduction', target: 50, frames: [
          { id: 'c1-i1', name: 'The Standard', text: 'The ongoing discourse surrounding {core} frequently highlights its multifaceted implications. While considerable attention is paid to {facetA}, the significance of {facetB} is equally difficult to ignore. This essay contends that {position}.' },
          { id: 'c1-i2', name: 'Nominalised focus', text: 'A defining characteristic of the modern {core} landscape is its inherent complexity. The debate is typically framed as a contest between {facetA} and {facetB}; ultimately, resolving this phenomenon necessitates analysing both, and this essay argues that {position}.' },
          { id: 'c1-i3', name: 'Action-oriented', text: 'Navigating the systemic integration of {core} has catalysed significant societal debate. Proponents emphasise {facetA}, whereas critics point to {facetB}. Consequently, a comprehensive evaluation demands an impartial examination of each before concluding that {position}.' }
        ] },
        { key: 'bodyA', name: 'Body A', target: 95, frames: [
          { id: 'c1-a1', name: 'The Standard', text: 'A fundamental dimension of this issue is its relationship to {facetA}. This dynamic operates primarily by {mechA}, which leads to {exA}. Yet viewing this element in a vacuum overlooks critical context; indeed, {nuanceA}.' },
          { id: 'c1-a2', name: 'Causality focus', text: 'At the core of this phenomenon lies the undeniable impact of {facetA}. Its influence stems from {mechA}, and this trajectory frequently manifests in real-world scenarios such as {exA}. Notwithstanding this reality, an overreliance on this perspective ignores the fact that {nuanceA}.' },
          { id: 'c1-a3', name: 'Argumentative', text: 'The primary justification often cited within this context is {facetA}. The argument rests on {mechA}; The point is illustrated by {exA}. However, this approach fails to account for {nuanceA}.' }
        ] },
        { key: 'bodyB', name: 'Body B', target: 95, frames: [
          { id: 'c1-b1', name: 'The Standard', text: 'Equally significant is the phenomenon\'s relationship to {facetB}. This dimension functions through {mechB}, as evidenced by {exB}. Nevertheless, {nuanceB}, a consideration that tempers any uncritical endorsement of this view.' },
          { id: 'c1-b2', name: 'Parallelism', text: 'Parallel to this dynamic is the emergence of {facetB}. Its mechanism is {mechB}, subsequently triggering {exB}. It would be simplistic, however, to accept this without qualification: {nuanceB}.' },
          { id: 'c1-b3', name: 'Complication', text: 'Furthermore, this developmental landscape is profoundly complicated by {facetB}. The underlying process is {mechB}, and it is within real-world frameworks, such as {exB}, that this trajectory most clearly manifests. Seldom, though, does this perspective account for the fact that {nuanceB}.' }
        ] },
        { key: 'conclusion', name: 'Conclusion', target: 45, frames: [
          { id: 'c1-c1', name: 'The Standard', text: 'In conclusion, reducing {core} to a single consequence fails to capture its full complexity. A more defensible position is that {position}, because {rationale}.' },
          { id: 'c1-c2', name: 'Perspective', text: 'Ultimately, viewing {core} exclusively through a singular lens represents a dangerously narrow perspective. The evidence considered here supports the view that {position}; {rationale}.' },
          { id: 'c1-c3', name: 'Evaluative', text: 'To summarise, an isolated evaluation of {core} systematically ignores the broader realities of the issue. It is for this reason that {position}: {rationale}.' }
        ] }
      ]
    }
  };

  /* ---------------------------------------------------------- playbooks
     The eleven variables re-mapped for the other question types. `labels`
     rename the slots; `frames` override paragraphs where the standard
     discuss-both-views frame would give the wrong shape. */
  var PLAYBOOKS = {
    DISCUSS: { labels: { facetA: 'View A', facetB: 'View B', position: 'Your verdict' } },
    OPINION: {
      labels: { facetA: 'Reason 1', facetB: 'Reason 2 (or the counter-argument)', position: 'Your position', rationale: 'Why it holds' },
      frames: {
        B2: {
          intro: 'It is sometimes claimed that {core} is the right approach. I strongly agree with this view, because of {facetA} and {facetB}. This essay explains both reasons and concludes that {position}.',
          bodyA: 'The first reason is {facetA}. It works by {mechA}. We can see this in {exA}. Admittedly, {nuanceA}, but this does not weaken the main point.',
          bodyB: 'The second reason is {facetB}. It works through {mechB}, as can be seen in {exB}. It is true that {nuanceB}; even so, the overall benefit remains.',
          conclusion: 'In conclusion, {position}. Given {facetA} and {facetB}, this is the most sensible view, because {rationale}.'
        },
        C1: {
          intro: 'The proposition that {core} is desirable has gained considerable currency. This essay argues that {position}, on the grounds of {facetA} and, more decisively, {facetB}.',
          bodyA: 'The first justification concerns {facetA}. Its force derives from {mechA}, a dynamic clearly visible in {exA}. While it is true that {nuanceA}, this qualification limits rather than negates the argument.',
          bodyB: 'A second, arguably stronger, consideration is {facetB}. This operates by {mechB}, subsequently producing {exB}. Not even the fact that {nuanceB} substantially undermines its weight.',
          conclusion: 'In conclusion, {position}. Taken together, {facetA} and {facetB} make this the only defensible reading, because {rationale}.'
        }
      }
    },
    ADVANTAGE: {
      labels: { facetA: 'The main advantage', facetB: 'The main disadvantage', position: 'Which outweighs which', rationale: 'Why' },
      frames: {
        B2: {
          intro: 'The topic of {core} has both benefits and drawbacks. The main advantage is {facetA}, while the main disadvantage is {facetB}. In my opinion, {position}.',
          bodyA: 'The clearest benefit is {facetA}. This comes about by {mechA}. A clear example is {exA}. Of course, {nuanceA}, but the advantage is still real.',
          bodyB: 'The most serious drawback is {facetB}. The problem arises from {mechB}, which can be seen in {exB}. However, {nuanceB}, so this drawback can be managed.',
          conclusion: 'To conclude, when {facetA} is weighed against {facetB}, {position}. The reason is that {rationale}.'
        },
        C1: {
          intro: 'The emergence of {core} has generated both considerable benefits and genuine costs. Its principal advantage lies in {facetA}, whereas its most significant drawback is {facetB}. On balance, this essay argues that {position}.',
          bodyA: 'The foremost benefit is {facetA}. This advantage arises from {mechA}, a pattern evident in {exA}. Admittedly, {nuanceA}; nonetheless, the gain is substantial.',
          bodyB: 'Set against this is {facetB}. The difficulty stems from {mechB}, as is evident in {exB}. It should be noted, however, that {nuanceB}, which means the cost is neither inevitable nor unmanageable.',
          conclusion: 'In conclusion, once {facetA} is weighed against {facetB}, {position}. This judgement rests on the fact that {rationale}.'
        }
      }
    },
    PROBLEM: {
      labels: { facetA: 'The main cause', mechA: 'How the cause works', exA: 'Where it is seen', nuanceA: 'Why it is hard to fix', facetB: 'The solution', mechB: 'How the solution answers the cause', exB: 'Where it has worked', nuanceB: 'Its limit', position: 'What must happen', rationale: 'Why' },
      frames: {
        B2: {
          intro: 'The problem of {core} is a serious one in many countries. Its main cause is {facetA}, and the most effective response is {facetB}. This essay examines the cause and then the solution, arguing that {position}.',
          bodyA: 'The root of the problem is {facetA}. It creates the problem by {mechA}. We can see the effect in {exA}. Unfortunately, {nuanceA}, which makes the problem hard to solve.',
          bodyB: 'The most effective solution is {facetB}. It works by {mechB}, which directly answers the cause above. Success can already be seen in {exB}. Admittedly, {nuanceB}, so it is not a complete answer.',
          conclusion: 'In conclusion, because {core} is driven mainly by {facetA}, the answer must be {facetB}. {position}, since {rationale}.'
        },
        C1: {
          intro: 'The issue of {core} has become increasingly pressing. Its primary cause is {facetA}, and the most promising remedy is {facetB}. This essay examines the causal mechanism before evaluating the solution, concluding that {position}.',
          bodyA: 'At the root of the problem lies {facetA}. The mechanism is straightforward: the cause operates by {mechA}. The consequences are visible in {exA}. Compounding the difficulty, {nuanceA}, which renders the problem resistant to simple intervention.',
          bodyB: 'The remedy that most directly addresses this cause is {facetB}. It succeeds by {mechB}, thereby targeting the source rather than the symptom; the evidence of its effect lies in {exB}. It must be conceded that {nuanceB}, so the measure is necessary rather than sufficient.',
          conclusion: 'In conclusion, since {core} stems principally from {facetA}, {facetB} is the logical response. {position}, because {rationale}.'
        }
      }
    },
    TWOPART: {
      labels: { facetA: 'Answer to question 1', facetB: 'Answer to question 2', position: 'Your overall view', rationale: 'Why' },
      frames: {
        B2: {
          intro: 'The issue of {core} raises two questions. The first is answered by {facetA}, and the second by {facetB}. This essay deals with each in turn and argues that {position}.',
          bodyA: 'The answer to the first question is {facetA}. This works by {mechA}. A good example is {exA}. It should be said that {nuanceA}, but the main answer stands.',
          bodyB: 'Turning to the second question, the answer is {facetB}. It operates by {mechB}, as can be seen in {exB}. Even so, {nuanceB}, which is worth remembering.',
          conclusion: 'In conclusion, {facetA} answers the first question and {facetB} the second. Taken together, {position}, because {rationale}.'
        },
        C1: {
          intro: 'The question of {core} invites two distinct enquiries. This essay responds to the first with {facetA} and to the second with {facetB}, before arguing that {position}.',
          bodyA: 'With regard to the first question, the answer lies in {facetA}. This follows from {mechA}, a relationship clearly observable in {exA}. Granted, {nuanceA}; the central answer nevertheless holds.',
          bodyB: 'As for the second question, {facetB} is the decisive factor. Its influence operates through {mechB}, as illustrated by {exB}. That {nuanceB} qualifies but does not overturn this answer.',
          conclusion: 'In conclusion, {facetA} resolves the first question and {facetB} the second. Considered together, {position}, since {rationale}.'
        }
      }
    }
  };

  /* --------------------------------------------------- structural swaps */
  var SWAPS = [
    { id: 'inversion', name: 'Inversion', tag: 'gra-inversion', move: 'nuance', base: 'However, this approach fails to account for {nuanceA}.',
      variants: ['Seldom does this approach successfully account for {nuanceA}.', 'Rarely can this methodology operate effectively without acknowledging {nuanceA}.', 'Not only does this view overlook {nuanceA}, but it also overstates its own reach.'],
      note: 'Negative adverb first, then the auxiliary (does / can / did), then the subject. Use it once, on the nuance sentence.' },
    { id: 'cleft', name: 'Cleft sentence', tag: 'gra-cleft', move: 'example', base: 'This trajectory frequently manifests in real-world scenarios, such as {exA}.',
      variants: ['It is within real-world frameworks, such as {exA}, that this trajectory most clearly manifests.', 'What makes this dynamic visible is {exA}.'],
      note: '"It is … that …" or "What … is …" isolates the example for emphasis and breaks the declarative rhythm.' },
    { id: 'participle', name: 'Participle phrase', tag: 'gra-participle', move: 'mechanism', base: 'This dynamic operates primarily by {mechA}, which leads to {exA}.',
      variants: ['This dynamic operates primarily by {mechA}, subsequently triggering {exA}.', 'Operating primarily by {mechA}, this dynamic ultimately produces {exA}.'],
      note: 'Attach an -ing phrase to the mechanism instead of writing "which leads to". The subject of the phrase must be the subject of the sentence.' },
    { id: 'concession', name: 'Concession', tag: 'gra-concession', move: 'nuance', base: 'However, {nuanceA}.',
      variants: ['While this view has force, {nuanceA}.', 'Admittedly, {nuanceA}; the central argument nevertheless holds.', 'Although its advocates rarely admit it, {nuanceA}.'],
      note: 'The grammar of the nuance sentence: concede the limit in a subordinate clause, keep the position in the main clause.' }
  ];

  /* --------------------------------------------------------------- fade */
  var FADE = [
    { id: 'guided', name: 'Guided', blurb: 'Full frames with the slots to fill.' },
    { id: 'skeleton', name: 'Skeleton', blurb: 'Only the slot labels and word targets. Your own frames.' },
    { id: 'exam', name: 'Exam', blurb: 'A blank page and the clock.' }
  ];

  /* ------------------------------------------------------------- helpers */
  var LABEL = {};
  C.VARIABLES.forEach(function (v) { LABEL[v.key] = v.name; });
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function labels(type) {
    var out = {}; Object.keys(LABEL).forEach(function (k) { out[k] = LABEL[k]; });
    var pb = PLAYBOOKS[type]; if (pb && pb.labels) Object.keys(pb.labels).forEach(function (k) { out[k] = pb.labels[k]; });
    return out;
  }
  function tokens(text) { var m = String(text || '').match(/\{(\w+)\}/g) || []; return m.map(function (x) { return x.slice(1, -1); }); }
  /* Fill the {slots}. opts.html → slot spans for the screen; opts.labels → show "[Label]" where a value is missing. */
  function fill(text, vars, opts) {
    opts = opts || {}; vars = vars || {};
    var lab = opts.labels || LABEL;
    return String(text || '').replace(/\{(\w+)\}/g, function (m, k, offset, whole) {
      var v = vars[k];
      if (v) {
        v = String(v).trim().replace(/[.;:,]+$/, '');
        /* lower-case the first letter unless the slot opens a sentence or the value is a proper noun / acronym */
        var before = whole.slice(0, offset).replace(/\s+$/, '');
        var startsSentence = !before || /[.!?]$/.test(before);
        if (!startsSentence && /^[A-Z][a-z]/.test(v)) v = v.charAt(0).toLowerCase() + v.slice(1);
        if (startsSentence && /^[a-z]/.test(v)) v = v.charAt(0).toUpperCase() + v.slice(1);
        return opts.html ? '<span class="slot filled">' + esc(v) + '</span>' : v;
      }
      return opts.html ? '<span class="slot">[' + esc(lab[k] || k) + ']</span>' : '[' + (lab[k] || k) + ']';
    });
  }
  /* Sentence case + trailing punctuation hygiene after a fill. */
  function tidy(s) {
    return String(s).replace(/\.\s*\./g, '.').replace(/,\s*,/g, ',').replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
  }
  /* Oct 2026 (T.Chris): one Universal Spine for everyone. Typed playbook
     frames (one set per question type) are an advanced option: they are
     offered on the C1 track only, and never as the default. */
  /* The Type Switch Card: what each slot of the Universal Spine means in
     each question type (data: LabContent.TYPE_SWITCH). The student's frame
     sentences stay the same; only the job of the slots changes. */
  function switchCard(current) {
    var L = global.LabContent, rows = (L && L.TYPE_SWITCH) || [];
    if (!rows.length) return '';
    var th = ['Type', 'Facet A', 'Nuance A', 'Facet B', 'Nuance B', 'Position says', 'Easy to miss'];
    return '<details class="disc switch-card"' + (current ? ' open' : '') + '><summary>Type Switch Card · one spellbook, five question types</summary><p class="tiny">Read the instruction sentence, find its row, and give the slots the job that row names. Your sentences do not change.</p><div style="overflow-x:auto"><table class="switch-t"><thead><tr>' +
      th.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) { return '<tr' + (r.id === current ? ' class="on"' : '') + '>' + [r.name, r.a, r.na, r.b, r.nb, r.pos, r.trap].map(function (c, k) { return '<td>' + (k ? '' : '<b>') + esc(c) + (k ? '' : '</b>') + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table></div></details>';
  }
  function paragraphs(tier, type) {
    var t = TIERS[tier] || TIERS.B2, pb = PLAYBOOKS[type] || {};
    var over = tier === 'C1' && pb.frames && pb.frames[tier];
    return t.paragraphs.map(function (p) {
      var frames = p.frames.slice();
      if (over && over[p.key]) frames.push({ id: tier.toLowerCase() + '-' + type.toLowerCase() + '-' + p.key, name: (C.TYPES[type] || {}).name + ' playbook', text: over[p.key] });
      return { key: p.key, name: p.name, target: p.target, frames: frames, slots: tokens(frames[0].text) };
    });
  }
  /* choice: { intro:'b2-i1', bodyA:'…', … } · custom: { intro:'edited frame text', … } */
  function compose(tier, type, vars, choice, custom) {
    choice = choice || {}; custom = custom || {};
    return paragraphs(tier, type).map(function (p) {
      var fr = p.frames.filter(function (f) { return f.id === choice[p.key]; })[0] || p.frames[0];
      var text = custom[p.key] || fr.text;
      return tidy(fill(text, vars));
    }).join('\n\n');
  }
  /* How much of an essay is unchanged frame text. Every run of 4+ words in
     any frame (between slots) is looked up in the essay; matched words are
     summed. Tier-blind: both tiers are searched, plus the playbooks. */
  function normWords(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean); }
  function frameRuns() {
    if (frameRuns._c) return frameRuns._c;
    var runs = [];
    function add(text) {
      String(text).split(/\{\w+\}/).forEach(function (seg) {
        var w = normWords(seg); if (w.length >= 4) runs.push(w);
      });
    }
    Object.keys(TIERS).forEach(function (t) { TIERS[t].paragraphs.forEach(function (p) { p.frames.forEach(function (f) { add(f.text); }); }); });
    Object.keys(PLAYBOOKS).forEach(function (k) { var fr = PLAYBOOKS[k].frames; if (fr) Object.keys(fr).forEach(function (t) { Object.keys(fr[t]).forEach(function (p) { add(fr[t][p]); }); }); });
    SWAPS.forEach(function (s) { add(s.base); s.variants.forEach(add); });
    frameRuns._c = runs; return runs;
  }
  function ratio(essay) {
    var w = normWords(essay); if (!w.length) return 0;
    var hit = new Array(w.length);
    frameRuns().forEach(function (run) {
      for (var i = 0; i + run.length <= w.length; i++) {
        var ok = true;
        for (var j = 0; j < run.length; j++) if (w[i + j] !== run[j]) { ok = false; break; }
        if (ok) for (var k = 0; k < run.length; k++) hit[i + k] = 1;
      }
    });
    var n = 0; for (var q = 0; q < hit.length; q++) if (hit[q]) n++;
    return n / w.length;
  }

  /* Every word used in any frame (for the "new idea in the conclusion" check). */
  function frameWords() {
    if (frameWords._c) return frameWords._c;
    var set = {};
    frameRuns().forEach(function (run) { run.forEach(function (w) { set[w] = 1; }); });
    Object.keys(TIERS).forEach(function (t) { TIERS[t].paragraphs.forEach(function (p) { p.frames.forEach(function (f) { normWords(f.text.replace(/\{\w+\}/g, ' ')).forEach(function (w) { set[w] = 1; }); }); }); });
    Object.keys(PLAYBOOKS).forEach(function (k) { var fr = PLAYBOOKS[k].frames; if (fr) Object.keys(fr).forEach(function (t) { Object.keys(fr[t]).forEach(function (p) { normWords(fr[t][p].replace(/\{\w+\}/g, ' ')).forEach(function (w) { set[w] = 1; }); }); }); });
    frameWords._c = set; return set;
  }

  /* ----------------------------------------------------- my template
     My Spellbook: { tier, choice:{para:frameId}, custom:{para:text}, at,
     fromLab, fromLabName, fromLabAt, edited, prev, share, shareAt }.
     Kept on this device (pc.template.<id>) AND on the progress object
     (p.spellbook), which syncs to the class sheet with api.save, so it
     follows the student to another device and the Staff Room can read it.
     The newer copy (by `at`) wins; the template share (by `shareAt`) is
     compared on its own, because the Workshop sets it separately.
     `prev` is the version a "Use in the Scriptorium" or a reset replaced,
     so it can be brought back.                                          */
  function key(studentId) { return 'pc.template.' + String(studentId || 'anon').toLowerCase(); }
  function shareKey(studentId) { return 'pc.share.' + studentId; }
  function blank() { return { tier: 'B2', choice: {}, custom: {} }; }
  function nowIso() { return new Date().toISOString(); }
  function copy(o) { return o ? JSON.parse(JSON.stringify(o)) : o; }
  function sameId(a, b) { return String(a || '').toLowerCase() === String(b || '').toLowerCase(); }
  function hostP(studentId) {
    var h = global.PCHost, p = null;
    try { p = h && h.p; } catch (e) { p = null; }
    return p && sameId(p.studentId, studentId) ? p : null;
  }
  function readLocal(studentId) { try { return JSON.parse(localStorage.getItem(key(studentId))) || null; } catch (e) { return null; } }
  function writeLocal(studentId, obj) { try { localStorage.setItem(key(studentId), JSON.stringify(obj)); } catch (e) {} }
  function hasContent(o) { return !!o && (Object.keys(o.choice || {}).length > 0 || Object.keys(o.custom || {}).length > 0 || !!o.fromLab); }
  /* Copy onto the progress object and ask the app to sync it soon. */
  function mirror(studentId, obj) {
    var p = hostP(studentId); if (!p) return;
    var c = copy(obj);
    if (c.prev) delete c.prev.prev;
    p.spellbook = c;
    try { if (global.PCHost.syncSoon) global.PCHost.syncSoon(); } catch (e) {}
  }
  function load(studentId) {
    var local = readLocal(studentId), p = hostP(studentId), remote = p && p.spellbook ? p.spellbook : null, changed = false;
    if (remote && remote.at && (!local || String(remote.at) > String(local.at || ''))) {
      var keepShare = local && local.shareAt ? { share: local.share, shareAt: local.shareAt } : null;
      local = copy(remote);
      if (keepShare && String(keepShare.shareAt) > String(local.shareAt || '')) { local.share = keepShare.share; local.shareAt = keepShare.shareAt; }
      changed = true;
    } else if (remote && local && remote.shareAt && String(remote.shareAt) > String(local.shareAt || '')) {
      local.share = remote.share; local.shareAt = remote.shareAt; changed = true;
    }
    if (changed) {
      writeLocal(studentId, local);
      if (local.share) { try { localStorage.setItem(shareKey(studentId), String(local.share)); } catch (e) {} }
    }
    /* A spellbook made on this device before it was saved to the sheet. */
    if (local && p && !(remote && remote.at) && hasContent(local)) {
      if (!local.at) { local.at = nowIso(); writeLocal(studentId, local); }
      mirror(studentId, local);
    }
    local = local || blank();
    if (!local.choice) local.choice = {};
    if (!local.custom) local.custom = {};
    return local;
  }
  function save(studentId, obj) {
    obj = obj || blank();
    var old = readLocal(studentId) || {};
    if (obj.prev === undefined && old.prev) obj.prev = old.prev;
    if (obj.prev === null) delete obj.prev;
    if (obj.share === undefined && old.share != null) { obj.share = old.share; obj.shareAt = old.shareAt; }
    obj.at = nowIso();
    writeLocal(studentId, obj);
    mirror(studentId, obj);
  }
  /* The template share (%) of the student's latest complete Workshop design. */
  function setShare(studentId, pct) {
    pct = Number(pct); if (!pct) return;
    var at = nowIso(), obj = readLocal(studentId) || blank();
    obj.share = pct; obj.shareAt = at;
    writeLocal(studentId, obj);
    try { localStorage.setItem(shareKey(studentId), String(pct)); } catch (e) {}
    var p = hostP(studentId);
    if (p) {
      if (!p.spellbook) { p.spellbook = copy(obj); if (p.spellbook.prev) delete p.spellbook.prev.prev; }
      p.spellbook.share = pct; p.spellbook.shareAt = at;
      try { if (global.PCHost.syncSoon) global.PCHost.syncSoon(); } catch (e) {}
    }
  }
  function share(studentId) {
    var my = load(studentId), legacy = null;
    try { legacy = Number(localStorage.getItem(shareKey(studentId))) || null; } catch (e) {}
    var v = Number(my.share) || legacy;
    var p = hostP(studentId);
    if (v && p && !(p.spellbook && p.spellbook.share)) setShare(studentId, v);
    return v || null;
  }
  /* Which spellbook the Scriptorium is using, in words for the student. */
  function inUse(studentId) {
    var my = load(studentId), custom = Object.keys(my.custom || {}).filter(function (k) { return String(my.custom[k] || '').trim(); }).length;
    var chosen = Object.keys(my.choice || {}).length;
    var d = { kind: 'standard', name: my.fromLabName || '', edits: custom, prev: !!my.prev, share: my.share || null };
    if (my.fromLab) d.kind = my.edited ? 'lab-edited' : 'lab';
    else if (custom || chosen) d.kind = 'own';
    d.text = d.kind === 'lab' ? 'The Scriptorium is using your Workshop design' + (d.name ? ' "' + d.name + '"' : '') + ', copied into My Spellbook.'
      : d.kind === 'lab-edited' ? 'The Scriptorium is using My Spellbook: your Workshop design' + (d.name ? ' "' + d.name + '"' : '') + ', with your later edits in My Spellbook.'
      : d.kind === 'own' ? 'The Scriptorium is using My Spellbook: the frames you chose' + (custom ? ' and edited (' + custom + ' of 4)' : '') + ' here.'
      : 'The Scriptorium is using the standard frames in My Spellbook. Nothing has been edited yet.';
    return d;
  }

  global.Template = { switchCard: switchCard, TIERS: TIERS, PLAYBOOKS: PLAYBOOKS, SWAPS: SWAPS, FADE: FADE, LABEL: LABEL,
    labels: labels, tokens: tokens, fill: fill, tidy: tidy, paragraphs: paragraphs, compose: compose, ratio: ratio, frameWords: frameWords, load: load, save: save, setShare: setShare, share: share, inUse: inUse, esc: esc };
})(window);
