/* ===========================================================================
   POSITION CONTROL — writer.js
   The timed Task 2 editor and the rule-based "pre-flight" structural check.

   Prompts.get(id) / Prompts.card(p, opts)      the prompt bank and its card
   Writer.preflight(text, promptOrId)           → { rows:[{id,tag,status,label,note}], words, paras, bad, warn, summary, ratio }
   Writer.checkThesis(text, item)               → { ok, notes[] }        (module items)
   Writer.checkBody(text, item)                 → { ok, notes[] }
   Writer.checkRewrite(text, item)              → { ok, notes[] }
   Writer.mount(host, { prompt, mode:'guided'|'skeleton'|'exam', tier, minutes, studentId, onSubmit, onQuit })
   Writer.markingPrompt(prompt, text, pre)      → the text a teacher can paste into an AI marker

   These are checks, not marks: every rule is a tolerant heuristic and is
   labelled as such on screen.
   =========================================================================== */
(function (global) {
  'use strict';

  var C = global.CONTENT, T = global.Template;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function words(t) { var m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }
  function sentences(t) { return String(t || '').replace(/\n+/g, ' ').split(/(?<=[.!?])\s+/).map(function (s) { return s.trim(); }).filter(Boolean); }
  function paragraphs(t) {
    var ps = String(t || '').replace(/\r/g, '').split(/\n\s*\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    if (ps.length === 1) ps = String(t || '').split(/\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    return ps;
  }
  function lower(t) { return String(t || '').toLowerCase(); }
  function count(re, t) { var m = String(t || '').match(re); return m ? m.length : 0; }

  /* --------------------------------------------------------------- bank */
  var Prompts = {
    get: function (id) { for (var i = 0; i < C.PROMPTS.length; i++) if (C.PROMPTS[i].id === id) return C.PROMPTS[i]; return null; },
    all: function () { return C.PROMPTS; },
    typeName: function (t) { return (C.TYPES[t] || {}).name || t; },
    domainName: function (d) { return C.DOMAINS[d] || d; },
    card: function (p, opts) {
      opts = opts || {};
      if (!p) return '';
      var ty = C.TYPES[p.type] || {};
      return '<div class="prompt-card' + (opts.compact ? ' compact' : '') + '"><div class="prompt-meta"><span class="pill gold">' + esc(ty.name || p.type) + '</span><span class="pill">' + esc(Prompts.domainName(p.domain)) + '</span>' + (opts.showTitle !== false ? '<span class="prompt-title">' + esc(p.title) + '</span>' : '') + '</div>' +
        '<p class="prompt-text">' + esc(p.text) + '</p>' + (opts.demand ? '<p class="prompt-demand"><b>What it demands:</b> ' + esc(ty.demand || '') + '</p>' : '') + '</div>';
    }
  };
  function promptOf(x) { return typeof x === 'string' ? Prompts.get(x) : x; }

  /* ------------------------------------------------------------ lexicons */
  var POSITION = /\b(i (strongly |firmly |personally )?(believe|think|agree|disagree|argue|would argue|contend|maintain|am convinced)|in my (view|opinion)|my (own )?(view|position|opinion) is|this essay (argues|contends|will argue|maintains)|(i|we) (should|must)|(should|must|ought to|need to) (be|not)|it is (clear|evident) that|on balance|outweigh|the (benefits|advantages|drawbacks|disadvantages) (clearly |far |easily )?(outweigh|exceed)|(more|less) (important|significant|beneficial|harmful) than|the (best|most (effective|sensible|reasonable|defensible)) (way|approach|position|response|reading) is|position is that|way to (look at|see) it is that|for (this|these) reasons?|supports the view that|this judgement|the (only|most) defensible|(logical|sensible) response|argues? that|contends? that|arguing that|contending that|conclud(?:es|ing) that|the view that|the position that|this essay (has )?(argued|shown|maintained)|(governments?|schools?|parents?|societ(?:y|ies)|the state|policymakers|cities|councils|individuals|families|companies|employers|universities|authorities|teachers|we) (should|must|ought to|need to|cannot))\b/i;
  var VERDICT = /\b(outweigh|on balance|more (significant|important|beneficial|serious) than|greater than|exceed|the (benefits|advantages|drawbacks|disadvantages|costs|gains) (are|remain) (greater|larger|more|heavier))\b/i;
  var MECH = /\b(because|since|as a result|leads? to|led to|results? in|means that|which in turn|in turn|so that|thereby|thus|therefore|causes?|caus(?:ing|ed)|by \w+ing|through \w+ing|enabl(?:es|ing)|allows?|reduc(?:es|ing)|increas(?:es|ing)|creat(?:es|ing)|generat(?:es|ing)|operates? by|works? by|stems? from|derives? from|arises? from|operates? through|functions? through|works? through|rests on|based on|driven by|relies on|depends on|its influence|the mechanism|the underlying process|the reason it matters|the reason is)\b/i;
  var EXAMPLE = /\b(for (example|instance)|such as|e\.g\.|in (thailand|bangkok|japan|singapore|korea|finland|europe|asia|my (country|school|city|family))|cities (that|which|where)|schools (that|which|where)|countries (that|which|where)|(we|one) can see|illustrat(?:es|ed|ion)|evidenced by|as (seen|shown) (in|by)|a clear (example|case|illustration)|the case of|consider the|results? (like|such as)|demonstrates?|is a good illustration|in practice|(we|one) sees? this in|visible in|can be seen in|observable in|offers evidence|shows that this|cases? (such as|like|where)|(when|where) (schools|cities|governments|companies|families|students|parents|councils|hospitals|countries|towns|firms|employers|teachers|universities|people) |which leads to|manifest(?:s|ed|ing)? in|exemplified by|as seen|(shows|demonstrates|illustrates|reveals)\b|witness)\b/i;
  var NUANCE = /\b(however|although|though|while|whereas|yet|admittedly|nevertheless|nonetheless|even so|still|but|overlook(?:s|ed)?|ignor(?:es|ed)|in reality|it (is|should be) (true|noted|conceded|admitted)|granted|that said|this (view|argument|approach) (has|fails)|not (a )?perfect|limit(?:s|ed|ation)?|seldom|rarely|not even|undermine[sd]?|qualif(?:ies|ication|ied)|despite|in spite of|concede[sd]?|caveat|temper(?:s|ed)|does not (weaken|negate|overturn)|far from|unfortunately|hard to|difficult|compounding|resistant|necessary rather than sufficient|neither inevitable nor)\b/i;
  var LINKER_HEAD = /^(firstly|secondly|thirdly|fourthly|first of all|moreover|furthermore|in addition|additionally|also|besides|in conclusion|to conclude|to sum up|on the other hand|on the one hand|however|therefore|finally|last but not least|last(?:ly)?|next|then|as a result|consequently|in contrast|nevertheless|nonetheless)\b[,]?/i;
  var REFERENCE = /\b((this|these|such|that|those) (a |an )?(trend|policy|policies|measure|measures|approach|practice|practices|view|views|argument|arguments|dynamic|development|developments|phenomenon|problem|solution|solutions|ban|scheme|schemes|change|changes|idea|shift|process|system|systems|issue|debate|question|benefit|drawback|cause|remedy|answer|factor|reading|judgement|consideration|dimension|element|perspective|side|reality|advantage|disadvantage|difficulty|qualification|gain|cost|point|reason|justification|effect|element|landscape|trajectory)|doing so|the former|the latter|both (of these|sides|views)|the same|likewise|in this way|this is (why|because)|as such|it follows|taken together|set against this|compounding the difficulty|this follows)\b/i;
  var CLICHE = [/\bdouble[- ]edged sword\b/i, /\bin a nutshell\b/i, /\bhot (topic|issue|debate)\b/i, /\bsince the dawn of (time|civili[sz]ation)\b/i, /\bevery coin has two sides\b/i, /\btwo sides of the same coin\b/i, /\bin this (modern|day and age|fast-paced)\b/i, /\bnowadays,? in this modern (era|world)\b/i, /\bit goes without saying\b/i, /\bat the end of the day\b/i, /\blast but not least\b/i, /\bburning (issue|question)\b/i, /\bcontroversial (topic|issue)\b/i, /\ba blessing in disguise\b/i, /\bwith the development of (science and technology|society)\b/i];
  var UNVERIFIABLE = /\b((recent |a |many |numerous )?(research|studies|surveys?|statistics|experts?) (shows?|has shown|have shown|found|prove[sd]?|suggests?|reveal(?:s|ed)?|say|agree|indicate[sd]?)|according to (a |recent |many )?(survey|study|research|statistics|experts))\b/i;
  var BANNED = [
    { re: /\b(\w+n't|it's|there's|that's|they're|we're|isn't|aren't|doesn't|didn't|can't|won't|i'm|you're)\b/i, tag: 'lr-register', label: 'Contraction', note: 'Write the full form: it is, do not, cannot.' },
    { re: /\b(kids?|stuff|a lot of|lots of|guys|awesome|super|really really|gonna|wanna|okay|ok)\b/i, tag: 'lr-register', label: 'Informal word', note: 'Formal register: children, many, a great deal of, considerable.' },
    { re: /!/, tag: 'lr-register', label: 'Exclamation mark', note: 'No exclamation marks in an academic essay.' },
    { re: /\byou (should|can|will|need|must|have to)\b|\byour\b/i, tag: 'lr-register', label: 'Addressing the reader as "you"', note: 'Use impersonal subjects: people, individuals, governments, society.' }
  ];

  /* ----------------------------------------------------------- preflight */
  function preflight(text, promptOrId, opts) {
    opts = opts || {};
    var p = promptOf(promptOrId) || {};
    var type = p.type || 'DISCUSS';
    var rows = [];
    function add(id, tag, status, label, note) { rows.push({ id: id, tag: tag, status: status, label: label, note: note }); }

    var ps = paragraphs(text), n = words(text), all = String(text || '');

    /* length */
    add('length', 'struct-length', n < 250 ? 'bad' : n <= 320 ? 'ok' : 'warn', 'Length: ' + n + ' words',
      n < 250 ? 'Under 250 words: too little evidence for the higher bands. Develop the nuance or the example in a body paragraph.' : n <= 320 ? 'In the 250–320 target.' : 'Over 320 words costs checking time and multiplies errors. Cut the weakest sentence in each body paragraph.');

    /* format */
    var bullets = ps.filter(function (q) { return /^(\s*[-•*]|\s*\d+[.)]\s)/.test(q); }).length;
    if (bullets) add('bullets', 'cc-paragraphing', 'bad', 'Bullet points or numbered lines: ' + bullets, 'The answer must be a whole piece of connected text. No lists, no notes, no headings.');

    /* paragraphs */
    add('paras', 'cc-paragraphing', ps.length >= 4 && ps.length <= 5 ? 'ok' : 'bad', 'Paragraphs: ' + ps.length,
      ps.length >= 4 && ps.length <= 5 ? 'Introduction, two body paragraphs, conclusion — the shape the examiner expects.' : ps.length < 4 ? 'Split into four paragraphs: introduction, body A, body B, conclusion. Leave a blank line between them.' : 'Too many paragraphs — merge to two or three body paragraphs, one idea each.');

    var intro = ps[0] || '', concl = ps.length > 1 ? ps[ps.length - 1] : '';
    var body = ps.slice(1, Math.max(1, ps.length - 1));

    /* position */
    var posIntro = POSITION.test(intro), posConcl = POSITION.test(concl), posAny = POSITION.test(all);
    if (type === 'ADVANTAGE') {
      var verdict = VERDICT.test(intro) || VERDICT.test(concl);
      add('verdict', 'tr-listing', verdict ? 'ok' : (POSITION.test(intro) || POSITION.test(concl)) ? 'warn' : 'bad', verdict ? 'A verdict is stated' : 'No verdict: which side outweighs?', verdict ? '"Outweigh" is answered.' : '"Do the advantages outweigh the disadvantages?" is an opinion question. Say which side is heavier — "the benefits clearly outweigh the drawbacks" — in the introduction and the conclusion.');
    }
    if (!posAny) add('position', 'tr-no-position', 'bad', 'No clear position found', 'The examiner must be able to say what you think. Add one sentence in paragraph one: "I believe that …" / "This essay argues that …".');
    else if (!posIntro && posConcl) add('position', 'tr-position-late', type === 'DISCUSS' || type === 'OPINION' || type === 'ADVANTAGE' ? 'bad' : 'warn', 'Position appears only at the end', 'State the position in the introduction as well. An opinion that first appears in the conclusion reads as an afterthought.');
    else if (posIntro && !posConcl && ps.length >= 3) add('position', 'tr-no-position', 'warn', 'Position not restated in the conclusion', 'Echo the thesis in the last paragraph in fresh words: "For these reasons, …".');
    else add('position', 'tr-no-position', 'ok', 'Position in the introduction and the conclusion', 'Clear position, held to the end.');

    /* coverage of the prompt */
    if (p.keyNouns && p.keyNouns.length) {
      var lt = lower(all), missing = p.keyNouns.filter(function (k) { return lt.indexOf(String(k).toLowerCase()) < 0; });
      add('coverage', 'tr-off-topic', missing.length === 0 ? 'ok' : missing.length < p.keyNouns.length ? 'warn' : 'bad', missing.length ? 'Prompt words not used: ' + missing.join(', ') : 'The essay stays on the prompt', missing.length ? 'Every body paragraph should connect back to the key nouns of the prompt. Missing them is the first sign of an off-topic essay.' : 'The key nouns of the prompt appear in the essay.');
    }
    if (type === 'PROBLEM') {
      var hasCause = /\b(cause[sd]?|because|due to|stems? from|result of|reason|root|driven by|arises? from)\b/i.test(all), hasSol = /\b(solution|solve|tackle|address|measure|should|could|must|govern\w+ (should|could|must)|introduce|invest|ban|tax|subsidi[sz]e|provide|require)\b/i.test(all);
      add('parts', 'tr-partial', hasCause && hasSol ? 'ok' : 'bad', hasCause && hasSol ? 'Causes and solutions both present' : (hasCause ? 'No solutions found' : 'No causes found'), 'A problem/solution prompt has two parts. Name the cause with its mechanism, then a solution that answers that cause.');
    }

    /* body paragraphs: the four moves */
    body.forEach(function (q, i) {
      var label = 'Body ' + (i + 1);
      var m = MECH.test(q), e = EXAMPLE.test(q), nu = NUANCE.test(q), w = words(q);
      add('b' + i + 'mech', 'tr-generalised', m ? 'ok' : 'warn', label + (m ? ': mechanism present' : ': no mechanism'), m ? 'The idea is explained, not just stated.' : 'Say HOW the idea works: "… because …, which in turn …" / "operates by …". A claim without a mechanism is over-generalised.');
      add('b' + i + 'ex', 'tr-no-example', e ? 'ok' : 'warn', label + (e ? ': example present' : ': no concrete example'), e ? 'Something the reader can point at.' : 'Add a concrete case: a city, a policy, a school, a practice. "For example, …" / "such as …".');
      add('b' + i + 'nu', 'tr-no-nuance', nu ? 'ok' : 'warn', label + (nu ? ': nuance present' : ': no nuance'), nu ? 'The limit is admitted; the position holds.' : 'Admit the limit: "However, this overlooks …; in reality, …". Nuance is what "well-developed" means.');
      if (w < 60) add('b' + i + 'len', 'cc-one-idea', 'warn', label + ': only ' + w + ' words', 'A body paragraph carries facet, mechanism, example and nuance — usually 80–110 words.');
      if (w > 140) add('b' + i + 'len', 'cc-one-idea', 'warn', label + ': ' + w + ' words', 'Long for one idea. If there are two facets here, split them.');
    });

    /* cohesion */
    var ss = sentences(all), linkers = ss.filter(function (s) { return LINKER_HEAD.test(s); }).length, ratioL = ss.length ? linkers / ss.length : 0;
    add('linkers', 'cc-linker-overuse', ratioL <= 0.3 ? 'ok' : ratioL <= 0.5 ? 'warn' : 'bad', 'Sentences starting with a linker: ' + linkers + ' of ' + ss.length, ratioL <= 0.3 ? 'Linkers are used sparingly.' : 'Too many sentences begin with Firstly / Moreover / However. Link with reference words and by ending one sentence with what the next is about.');
    var refs = count(new RegExp(REFERENCE.source, 'gi'), all);
    add('reference', 'cc-reference', refs >= 2 ? 'ok' : 'warn', 'Reference and substitution: ' + refs, refs >= 3 ? 'The essay refers back instead of repeating.' : 'Use "this policy", "such measures", "doing so", "the former / the latter" to refer back. Band 7 CC rewards reference and substitution.');

    /* lexis and register */
    var cl = []; CLICHE.forEach(function (re) { var m2 = all.match(re); if (m2) cl.push(m2[0]); });
    if (cl.length) add('cliche', 'lr-memorised', 'bad', 'Memorised phrase: "' + cl[0] + '"' + (cl.length > 1 ? ' (+' + (cl.length - 1) + ')' : ''), 'Examiners discount memorised language. Say it plainly in your own words.');
    var uv = all.match(UNVERIFIABLE);
    if (uv) add('unverifiable', 'tr-no-example', 'warn', 'Unverifiable evidence: "' + uv[0] + '"', 'The examiner cannot check "research shows". Use a concrete case you can describe — your country, city or school.');
    BANNED.forEach(function (b, i) { var m3 = all.match(b.re); if (m3) add('ban' + i, b.tag, 'bad', b.label + ': "' + m3[0] + '"', b.note); });
    var qs = count(/\?/g, all);
    if (qs) add('rhetorical', 'lr-register', 'warn', 'Question marks: ' + qs, 'Avoid rhetorical questions in a formal essay; make the statement instead.');
    /* repetition of one content word */
    var freq = {}; lower(all).replace(/[^a-z' ]+/g, ' ').split(/\s+/).forEach(function (w2) { if (w2.length > 4) freq[w2] = (freq[w2] || 0) + 1; });
    var top = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; })[0];
    if (top && freq[top] >= 8) add('repeat', 'lr-repetition', 'warn', '"' + top + '" appears ' + freq[top] + ' times', 'Vary it with a synonym chain or a reference word (this practice, such measures).');
    var iCount = count(/\bI\b/g, all);
    if (iCount >= 6) add('ipron', 'lr-register', 'warn', '"I" appears ' + iCount + ' times', '"I believe" belongs in the thesis and the conclusion. Body paragraphs argue with impersonal subjects.');

    /* template ratio */
    var tr = T ? T.ratio(all) : 0;
    add('template', 'struct-template', tr > 0.5 ? 'bad' : tr > 0.33 ? 'warn' : 'ok', 'Unchanged frame text: ' + Math.round(tr * 100) + '%', tr > 0.33 ? 'Too much of the essay is the template word for word. Edit the openers into your own words and put the weight inside the variables.' : 'The frames have been made your own.');

    /* new idea in conclusion: a noun in the conclusion that appears nowhere else */
    if (concl && ps.length >= 4) {
      var before = lower(ps.slice(0, -1).join(' ')), newNouns = [], fw = T ? T.frameWords() : {};
      lower(concl).replace(/[^a-z ]+/g, ' ').split(/\s+/).forEach(function (w3) { if (w3.length > 6 && !fw[w3] && before.indexOf(w3.slice(0, 5)) < 0 && newNouns.indexOf(w3) < 0) newNouns.push(w3); });
      if (newNouns.length >= 4) add('newidea', 'tr-new-idea', 'warn', 'Possible new material in the conclusion: ' + newNouns.slice(0, 3).join(', '), 'The conclusion evaluates and restates; it does not introduce ideas the body did not develop.');
    }

    var bad = rows.filter(function (r) { return r.status === 'bad'; }).length;
    var warn = rows.filter(function (r) { return r.status === 'warn'; }).length;
    return { rows: rows, words: n, paras: ps.length, bad: bad, warn: warn, ratio: tr,
      summary: bad === 0 && warn === 0 ? 'All green. Pre-flight perfect.' : bad === 0 ? 'No red rows — ' + warn + ' to look at.' : bad + ' red row' + (bad > 1 ? 's' : '') + ' to fix before you submit.' };
  }

  /* ------------------------------------------------ module free-text items */
  function cliches(t) { return CLICHE.filter(function (re) { return re.test(t); }).length; }
  function bans(t) { return BANNED.filter(function (b) { return b.re.test(t); }); }
  function checkThesis(text, item) {
    var notes = [], ok = true, t = String(text || '').trim(), n = words(t), lt = lower(t);
    var min = item.minWords || 12, max = item.maxWords || 45;
    if (sentences(t).length > 2) { ok = false; notes.push('One sentence (two at most). A thesis is a single clear claim.'); }
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words. Name the position and the reason.'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words. A thesis is one claim, not the whole essay.'); }
    if (!POSITION.test(t) && !/\b(should|must|ought|is|are|outweigh)\b/i.test(t)) { ok = false; notes.push('No position word. Try "I believe that …", "This essay argues that …", "… should …".'); }
    if (/\b(some people (think|believe|say)|it depends|both sides|hard to say|difficult to decide)\b/i.test(t) && !/\b(but|however|although|while)\b/i.test(t)) { ok = false; notes.push('That is a description of the debate, not a position. Say what YOU think.'); }
    (item.must || []).forEach(function (group) { if (!group.some(function (k) { return lt.indexOf(k.toLowerCase()) >= 0; })) { ok = false; notes.push('Mention ' + group[0] + ' — the thesis must name the topic.'); } });
    if (cliches(t)) { ok = false; notes.push('Drop the memorised phrase; say it plainly.'); }
    var b = bans(t); if (b.length) { ok = false; notes.push(b[0].note); }
    if (ok) notes.push('One sentence, one clear position, on the topic. That is a thesis.');
    return { ok: ok, notes: notes };
  }
  function checkBody(text, item) {
    var notes = [], ok = true, t = String(text || '').trim(), n = words(t);
    var min = item.minWords || 60, max = item.maxWords || 130;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words (aim ' + min + '–' + max + '). Add the example or the nuance.'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words (aim ' + min + '–' + max + '). One idea per paragraph.'); }
    if (!MECH.test(t)) { ok = false; notes.push('No mechanism: say how the idea works ("… because …, which in turn …" / "operates by …").'); }
    if (!EXAMPLE.test(t)) { ok = false; notes.push('No concrete example: "for example, …" / "such as …" / a named place or practice.'); }
    if (item.nuance !== false && !NUANCE.test(t)) { ok = false; notes.push('No nuance: admit the limit ("However, this overlooks …") and keep the position.'); }
    var ss = sentences(t), lk = ss.filter(function (s) { return LINKER_HEAD.test(s); }).length;
    if (ss.length >= 3 && lk / ss.length > 0.5) { ok = false; notes.push('Too many sentences start with a linker. Link with reference words instead.'); }
    if (/^(in conclusion|to conclude|to sum up|overall)\b/i.test(t)) { ok = false; notes.push('This is a body paragraph, not the conclusion.'); }
    if (cliches(t)) { ok = false; notes.push('Drop the memorised phrase; say it plainly.'); }
    var b = bans(t); if (b.length) { ok = false; notes.push(b[0].note); }
    if (item.keyNouns) { var lt = lower(t), miss = item.keyNouns.filter(function (k) { return lt.indexOf(k.toLowerCase()) < 0; }); if (miss.length === item.keyNouns.length) { ok = false; notes.push('Connect the paragraph to the prompt: mention ' + item.keyNouns.slice(0, 2).join(' or ') + '.'); } }
    if (ok) notes.push('Facet, mechanism, example, nuance — a developed body paragraph.');
    return { ok: ok, notes: notes };
  }
  function checkRewrite(text, item) {
    var notes = [], ok = true, t = String(text || '').trim(), n = words(t), lt = lower(t);
    var min = item.minWords || 5, max = item.maxWords || 60;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words.'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words.'); }
    (item.must || []).forEach(function (group) { if (!group.some(function (k) { return new RegExp('\\b' + k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(lt); })) { ok = false; notes.push('Use ' + group.slice(0, 3).join(' / ') + '.'); } });
    (item.ban || []).forEach(function (k) { if (new RegExp('\\b' + k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(lt)) { ok = false; notes.push('Do not use "' + k + '".'); } });
    if (item.noClause && /\b(because|since|when|although|which|that|so)\b/i.test(t)) { ok = false; notes.push('No subordinate clause — pack the idea into a noun phrase.'); }
    if (cliches(t)) { ok = false; notes.push('Drop the memorised phrase.'); }
    var b = bans(t); if (b.length) { ok = false; notes.push(b[0].note); }
    if (ok) notes.push(item.praise || 'That is the target structure.');
    return { ok: ok, notes: notes };
  }

  /* ------------------------------------------------------- AI marking */
  function markingPrompt(p, text, pre) {
    var gates = [
      'Task Response gates: 5→6 a position is presented and the main parts addressed; 6→7 a clear and developed position throughout, ideas extended and supported; 7→8 no over-generalisation — every main idea carries a mechanism and a concrete example; 8→9 fully developed, explored in depth.',
      'Coherence and Cohesion: 5→6 clear overall progression; 6→7 logical organisation, clear progression, one central topic per paragraph, reference and substitution used; 7→8 message followed with ease, cohesion well managed; 9 cohesion very rarely attracts attention.',
      'Lexical Resource: 5→6 adequate range; 6→7 some flexibility and precision, less common items, awareness of style and collocation; 7→8 wide resource used fluently and flexibly for precise meaning, skilful uncommon items; memorised language and clichés are discounted.',
      'Grammatical Range and Accuracy: 5→6 mix of simple and complex forms; 6→7 a variety of complex structures, error-free sentences frequent; 7→8 wide range flexibly and accurately used, the majority of sentences error-free.',
      'Deductions: under 250 words → cap TR at 5; bullet points or notes → cap TR at 5; off-topic → TR 4–5; memorised essay → TR 0–3.'
    ];
    return 'You are an IELTS Academic Writing Task 2 examiner and a warm English teacher (T.Chris) at a Thai secondary school. ' +
      'Mark the student essay below against the public band descriptors. Walk each criterion up its gates and stop at the first unmet gate.\n\n' +
      gates.join('\n') + '\n\nTHE TASK (' + (C.TYPES[p.type] || {}).name + ')\n' + p.text + '\n\nSTRUCTURAL CHECK (rule-based, for reference)\n' +
      (pre ? pre.rows.map(function (r) { return '- [' + r.status + '] ' + r.label; }).join('\n') : '') +
      '\n\nSTUDENT ESSAY (' + words(text) + ' words)\n' + text +
      '\n\nReturn ONLY JSON: {"tr":6.0,"cc":6.0,"lr":6.0,"gra":6.0,"overall":6.0,"cefr":"B2","errors":[{"quote":"…","tag":"gra-agreement","fix":"…"}],"comment":"…"}. ' +
      'Bands in half steps. "errors": up to five, each quoting the student\'s words, a tag from this list [' + Object.keys(C.REMEDIATION).join(', ') + '] and a concrete fix. ' +
      '"comment": 100–150 words in T.Chris\'s voice: open with the student\'s nickname, a comma, then one specific praise ending with an exclamation mark; quote the student\'s own words in single quotes; state the level plainly ("Your writing is around B2 level"); name error types by grammatical label; give replacement words; pivot with "However," / "Just ensure" / "Also look at" / "Finally,"; frame improvement as the next gate; close warmly. No markdown.';
  }

  /* ---------------------------------------------------------------- UI */
  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }

  function mount(host, cfg) {
    var p = promptOf(cfg.prompt);
    var mode = cfg.mode || 'guided', guided = mode === 'guided', skeleton = mode === 'skeleton', exam = mode === 'exam';
    var tier = cfg.tier || 'B2', type = p.type || 'DISCUSS';
    var minutes = cfg.minutes || 40, total = minutes * 60;
    var my = T.load(cfg.studentId); if (!my.choice) my.choice = {}; if (!my.custom) my.custom = {};
    var state = { t0: Date.now(), left: total, done: false, revision: 0, tick: null, vars: {}, choice: {}, custom: {} };
    var paras = T.paragraphs(tier, type), labels = T.labels(type);
    paras.forEach(function (pg) { state.choice[pg.key] = my.choice[pg.key] || pg.frames[0].id; if (my.custom[pg.key]) state.custom[pg.key] = my.custom[pg.key]; });
    var PHASES = [['Decode', 0], ['Matrix', 90], ['Write', 300], ['Check', total - 300]];

    function frameOf(pg) { return pg.frames.filter(function (f) { return f.id === state.choice[pg.key]; })[0] || pg.frames[0]; }
    function frameText(pg) { return state.custom[pg.key] || frameOf(pg).text; }

    var html = '<div class="wr">' +
      '<div class="wr-top">' +
        '<button class="btn ghost sm" id="wr-quit">✕</button>' +
        '<div class="wr-phases" id="wr-phases">' + PHASES.map(function (ph, i) { return '<span data-i="' + i + '">' + ph[0] + '</span>'; }).join('') + '</div>' +
        '<span class="wr-words" id="wr-words">0 words</span>' +
        '<span class="wr-clock" id="wr-clock">' + mmss(total) + '</span>' +
      '</div>' +
      '<div class="wr-grid">' +
        '<div class="wr-left">' + Prompts.card(p, { demand: !exam }) +
          (!exam ? '<div class="card wr-plan"><div class="wr-boxh"><b>The matrix</b><span class="tiny">plan — not counted</span>' + (guided ? '<button class="btn sm" id="wr-fill">Fill the frames →</button>' : '') + '</div>' +
            C.VARIABLES.map(function (v) { return '<div class="wr-planrow"><label for="wr-v-' + v.key + '" title="' + esc(v.hint) + '">' + v.n + ' · ' + esc(labels[v.key]) + '</label><input id="wr-v-' + v.key + '" data-var="' + v.key + '" placeholder="' + esc(v.hint) + '"></div>'; }).join('') + '</div>' : '') +
        '</div>' +
        '<div class="wr-right">' +
          (exam
            ? '<div class="wr-box"><textarea id="wr-t0" rows="22" spellcheck="false" placeholder="Write your essay here. Leave a blank line between paragraphs. At least 250 words."></textarea></div>'
            : paras.map(function (pg, i) {
                var fr = frameOf(pg);
                return '<div class="wr-box" data-para="' + pg.key + '"><div class="wr-boxh"><b>' + esc(pg.name) + '</b><span class="tiny">~' + pg.target + ' words · <i id="wr-w' + i + '">0</i></span>' +
                  (guided ? '<select class="wr-frame-pick" data-pick="' + pg.key + '">' + pg.frames.map(function (f) { return '<option value="' + f.id + '"' + (f.id === fr.id ? ' selected' : '') + '>' + esc(f.name) + '</option>'; }).join('') + '</select><button class="linky" data-card="' + i + '">frame</button>' : '') + '</div>' +
                  (guided ? '<div class="wr-card hidden" id="wr-card' + i + '"><b>Frame · edit it into your own words</b><textarea class="wr-frame" data-frame="' + pg.key + '" rows="4" spellcheck="false">' + esc(frameText(pg)) + '</textarea><p class="tiny">Slots: ' + T.tokens(frameText(pg)).map(function (k) { return '{' + esc(labels[k] || k) + '}'; }).join(' · ') + '</p></div>' : '') +
                  (skeleton ? '<p class="tiny wr-skel">' + pg.slots.map(function (k) { return '[' + esc(labels[k] || k) + ']'; }).join(' → ') + '</p>' : '') +
                  '<textarea id="wr-t' + i + '" rows="' + (i === 0 || i === 3 ? 4 : 6) + '" spellcheck="false" placeholder="' + esc(pg.name) + ' …"></textarea></div>';
              }).join('')) +
          '<div class="qfoot"><span class="tiny" id="wr-note">Checks, not marks: the panel looks at structure only.</span><span class="grow"></span>' +
          '<button class="btn primary" id="wr-check">Pre-flight check →</button></div>' +
          '<div id="wr-panel"></div>' +
        '</div>' +
      '</div></div>';
    host.innerHTML = html;

    var areas = Array.prototype.slice.call(host.querySelectorAll('textarea[id^=wr-t]'));
    function text() { return exam ? areas[0].value : areas.map(function (a) { return a.value.trim(); }).filter(Boolean).join('\n\n'); }
    function countW() {
      var n = words(text());
      host.querySelector('#wr-words').textContent = n + ' words';
      if (!exam) areas.forEach(function (a, i) { var el = host.querySelector('#wr-w' + i); if (el) el.textContent = words(a.value); });
    }
    areas.forEach(function (a) { a.addEventListener('input', countW); });
    host.querySelectorAll('[data-card]').forEach(function (b) { b.addEventListener('click', function () { host.querySelector('#wr-card' + b.dataset.card).classList.toggle('hidden'); }); });
    host.querySelectorAll('[data-var]').forEach(function (inp) { inp.addEventListener('input', function () { state.vars[inp.dataset['var']] = inp.value.trim(); }); });
    host.querySelectorAll('[data-pick]').forEach(function (sel) { sel.addEventListener('change', function () {
      var key = sel.dataset.pick; state.choice[key] = sel.value; delete state.custom[key];
      var pg = paras.filter(function (x) { return x.key === key; })[0], ta = host.querySelector('[data-frame="' + key + '"]'); if (ta) ta.value = frameOf(pg).text;
      my.choice[key] = sel.value; delete my.custom[key]; T.save(cfg.studentId, my);
    }); });
    host.querySelectorAll('[data-frame]').forEach(function (ta) { ta.addEventListener('input', function () { var key = ta.dataset.frame; state.custom[key] = ta.value; my.custom[key] = ta.value; T.save(cfg.studentId, my); }); });
    var fillBtn = host.querySelector('#wr-fill');
    if (fillBtn) fillBtn.addEventListener('click', function () {
      var filled = Object.keys(state.vars).filter(function (k) { return state.vars[k]; }).length;
      if (filled < 6 && !confirm('Only ' + filled + ' of 11 variables are filled. Fill the frames anyway?')) return;
      paras.forEach(function (pg, i) { if (!areas[i].value.trim() || confirm('Replace the ' + pg.name + ' box?')) areas[i].value = T.tidy(T.fill(frameText(pg), state.vars)); });
      countW(); host.querySelector('#wr-note').textContent = 'Frames filled. Now edit every sentence into your own words — the pre-flight check measures how much is still template.';
    });

    function paintPhase() {
      var el = total - state.left, idx = 0;
      PHASES.forEach(function (ph, i) { if (el >= ph[1]) idx = i; });
      host.querySelectorAll('#wr-phases span').forEach(function (s, i) { s.classList.toggle('on', i === idx); s.classList.toggle('past', i < idx); });
    }
    state.tick = setInterval(function () {
      state.left = Math.max(0, total - Math.round((Date.now() - state.t0) / 1000));
      var c = host.querySelector('#wr-clock'); if (!c) { clearInterval(state.tick); return; }
      c.textContent = mmss(state.left);
      c.classList.toggle('low', state.left <= 300);
      paintPhase();
      if (state.left === 0 && !state.done) finish(true);
    }, 500);
    function stop() { clearInterval(state.tick); }
    host.querySelector('#wr-quit').addEventListener('click', function () {
      if (words(text()) > 30 && !confirm('Leave now? This essay will not be saved.')) return;
      stop(); if (cfg.onQuit) cfg.onQuit();
    });

    function showPanel(pre, canRevise) {
      var pn = host.querySelector('#wr-panel');
      pn.innerHTML = '<div class="card preflight"><div class="pf-h"><b>Pre-flight check</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        pre.rows.map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') +
        '<div class="qfoot" style="margin-top:12px">' + (canRevise ? '<button class="btn" id="wr-revise">Revise once</button>' : '') + '<span class="grow"></span><button class="btn primary" id="wr-submit">Submit essay</button></div></div>';
      pn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var rv = pn.querySelector('#wr-revise');
      if (rv) rv.addEventListener('click', function () { state.revision = 1; state.firstText = text(); state.firstPre = pre; pn.innerHTML = ''; areas[0].focus(); });
      pn.querySelector('#wr-submit').addEventListener('click', function () { finish(false, pre); });
    }
    host.querySelector('#wr-check').addEventListener('click', function () {
      var t = text();
      if (words(t) < 40) { host.querySelector('#wr-note').textContent = 'Write at least a few sentences first.'; return; }
      showPanel(preflight(t, p), state.revision === 0);
    });
    function finish(timedOut, pre) {
      if (state.done) return;
      state.done = true; stop();
      var t = text(); pre = pre || preflight(t, p);
      areas.forEach(function (a) { a.disabled = true; });
      var secs = Math.min(total, Math.round((Date.now() - state.t0) / 1000));
      if (cfg.onSubmit) cfg.onSubmit({ promptId: p.id, mode: mode, tier: tier, text: t, words: words(t), seconds: secs, timedOut: !!timedOut,
        preflight: pre, revision: state.revision, firstText: state.firstText || '', firstPreflight: state.firstPre || null,
        plan: exam ? null : { vars: state.vars, choice: state.choice, custom: state.custom } });
    }
    return { stop: stop, text: text };
  }

  global.Prompts = Prompts;
  global.Writer = { preflight: preflight, checkThesis: checkThesis, checkBody: checkBody, checkRewrite: checkRewrite, markingPrompt: markingPrompt, mount: mount, words: words, sentences: sentences, paragraphs: paragraphs,
    LEX: { POSITION: POSITION, MECH: MECH, EXAMPLE: EXAMPLE, NUANCE: NUANCE, LINKER_HEAD: LINKER_HEAD, REFERENCE: REFERENCE, CLICHE: CLICHE } };
})(window);
