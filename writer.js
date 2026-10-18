/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — writer.js  (the Scriptorium)
   The timed Task 2 editor and the rule-based structural check ("pre-flight" in
   the code; shown to students as "the Ten Wards").

   Prompts.get(id) / Prompts.card(p, opts)      the prompt bank and its card
   Writer.preflight(text, promptOrId)           → { rows:[{id,tag,status,label,note}], words, paras, bad, warn, summary, ratio }
   Writer.checkThesis(text, item)               → { ok, notes[] }        (module items)
   Writer.checkBody(text, item)                 → { ok, notes[] }
   Writer.checkRewrite(text, item)              → { ok, notes[] }
   Writer.mount(host, { prompt, mode:'guided'|'skeleton'|'exam', tier, minutes, studentId, onSubmit, onQuit,
                        revisionOf, reviseRow, reviseText, reviseVars })   revise mode when revisionOf + reviseText
   Writer.lastMeta()                            → { ownShare, ownSentences, fillUsed, landTaps, landAgree, revisionOf, reviseRow }
   Writer.markingPrompt(prompt, text, pre)      → the text a teacher can paste into an AI marker
   Writer.shapeCheck(key, value, promptText, type) → { ok, soft, tip, fix }   (matrix box shapes)
   Writer.shapeExamples(key, level, prompt)     → examples in the right shape from OTHER prompts
   Writer.nextStep(row, pre, level)             → { text, sub, link } for a red / amber Ward row

   These are checks, not marks: every rule is a tolerant heuristic and is
   labelled as such on screen.
   =========================================================================== */
(function (global) {
  'use strict';

  var C = global.CONTENT, T = global.Template;
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function words(t) { var m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }
  /* No regex lookbehind anywhere (B2, 18 Oct 2026): Safari before 16.4 cannot parse it, and one
     lookbehind stops the whole app. Split after . ! ? followed by white space, as before. */
  function sentences(t) { return String(t || '').replace(/\n+/g, ' ').replace(/([.!?])\s+/g, '$1\u0001').split('\u0001').map(function (s) { return s.trim(); }).filter(Boolean); }
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

  /* ------------------------------------------- tolerant reading (16 Oct 2026)
     The free-text checks judge MEANING, so a typo, a curly apostrophe from an
     iPad keyboard or American spelling must not hide a correct answer.
       plain(t)  straight quotes and hyphens (register checks run on this)
       read(t)   plain + repaired typos → { text, fixes } (the detectors run on this)
       canon(t)  lower case, British spelling: what keyword lists are matched against
     The student's own words are never changed on screen; a repaired typo is
     reported in a note, and register bans still look at what she typed. */
  function plain(t) {
    return String(t == null ? '' : t).replace(/[‘’‛ʼ`´′]/g, "'").replace(/[“”„″]/g, '"')
      .replace(/[‐‑‒]/g, '-').replace(/[   ]/g, ' ');
  }
  function ukify(t) {
    return t.replace(/\bcenter(s|ed)?\b/g, 'centre$1').replace(/\b(\w{3,})yz(e|es|ed|ing)\b/g, '$1ys$2')
      .replace(/\b(\w{3,})iz(e|es|ed|ing|ation|ations)\b/g, '$1is$2')
      .replace(/\b(behavi|col|fav|lab|neighb|hon|hum|harb|flav|endeav|vig|rum)or(s|ed|ing|ite|ites|al|hood|hoods|ful|less)?\b/g, '$1our$2')
      .replace(/\btravel(ing|ed|er|ers)\b/g, 'travell$1').replace(/\b(defen|offen|licen)se\b/g, '$1ce').replace(/\bprogram(s)?\b/g, 'programme$1')
      .replace(/\bgray\b/g, 'grey').replace(/\bmold\b/g, 'mould');
  }
  function canon(t) { return ukify(plain(t).toLowerCase()).replace(/\s+/g, ' '); }
  /* Typos: a word one edit (insert, delete, swap, change) from one of these
     words is read as that word, unless it is a real word itself (the list
     below was built from an English frequency list, Oct 2026). Words under
     five letters are never touched. */
  var SPELL_T = ('admittedly adolescence adolescents advantage advantages advertising although attention banning because believe believes beneficial benefits cameras children concentration condition consequently considerable consumption convenient definitely disadvantage disadvantages disagree drawbacks education environment especially example excessive experience freedom government governments habits harmful however important increase increases independent information instance insufficient language languages necessary nevertheless online opinion oppose outweigh outweighed outweighs parents people pollution private provided providing reduces regulation removal responsibility restriction schools security seldom serious should significant student students substantial sugary support surveillance teachers technology teenager teenagers therefore tourism tourists traffic transport unless valuable vehicles visitors whereas').split(' ');
  var SPELL_REAL = {};
  ('adolescent advantaged affect attentions banding banging banking believed believer believers benefit benning camera canning concentrations conditions considerably disadvantaged disagreed disagrees drawback effect environments examples experienced experiences fanning freedoms habit increased independents inline instances manning opinions opposed opposes panning parent patents peoples pinion primate privates provide provider provides reduce reduced regulations relieve relieves removals restrictions school seduces shoulda specially sugar sugars supports tanning teacher teaches teenage teenaged tourist transports valuables vehicle vesicles visitor wherefore wheres')
    .split(' ').forEach(function (w) { SPELL_REAL[w] = 1; });
  var SPELL_SET = {}; SPELL_T.forEach(function (w) { SPELL_SET[w] = 1; });
  /* Spellings two or more edits away, and chat forms, that students use. */
  var SPELL_MAP = { becoz: 'because', bcoz: 'because', bcuz: 'because', becuz: 'because', bcz: 'because', bcos: 'because', becos: 'because', cuz: 'because', coz: 'because',
    beacause: 'because', becauze: 'because', becuse: 'because', advantagees: 'advantages', disadvantagees: 'disadvantages', enviroment: 'environment', goverment: 'government', govermment: 'government', goverments: 'governments',
    belive: 'believe', beleive: 'believe', belived: 'believed', beleived: 'believed', outweight: 'outweigh', outweights: 'outweighs', outwiegh: 'outweigh', outwieghs: 'outweighs', polution: 'pollution', studens: 'students' };
  function dl1(a, b) {
    var la = a.length, lb = b.length, i = 0;
    if (a === b || Math.abs(la - lb) > 1) return false;
    if (la === lb) {
      var d = []; for (i = 0; i < la; i++) if (a[i] !== b[i]) { d.push(i); if (d.length > 2) return false; }
      return d.length === 1 || (d.length === 2 && d[1] === d[0] + 1 && a[d[0]] === b[d[1]] && a[d[1]] === b[d[0]]);
    }
    if (la > lb) { var x = a; a = b; b = x; }
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(i) === b.slice(i + 1);
  }
  function fixWord(lw) {
    if (SPELL_MAP[lw]) return SPELL_MAP[lw];
    if (lw.length < 5 || SPELL_SET[lw] || SPELL_REAL[lw]) return null;
    var hit = null;
    for (var i = 0; i < SPELL_T.length; i++) if (dl1(lw, SPELL_T[i])) { if (hit) return null; hit = SPELL_T[i]; }
    return hit;
  }
  function read(t, noSpell) {
    var fixes = [], s = plain(t);
    function note(a, b) { if (fixes.length < 6) fixes.push([a, b]); }
    s = s.replace(/\bout\s+weigh(s|ed|ing)?\b/gi, function (m, e) { var r = 'outweigh' + (e || ''); note(m, r); return r; });
    s = s.replace(/\boverweigh(t|ts|s|ed)?\b(?=\s+(the|its|their|any|all|those|these|every|each|her|his|our|them)\b)/gi, function (m, e) { var r = 'outweigh' + (e === 's' || e === 'ts' ? 's' : e === 'ed' ? 'ed' : ''); note(m, r); return r; });
    if (!noSpell) s = s.replace(/[A-Za-z]+/g, function (w) {
      var f = fixWord(w.toLowerCase()); if (!f) return w;
      note(w, f); return /^[A-Z]/.test(w) ? f.charAt(0).toUpperCase() + f.slice(1) : f;
    });
    s = s.replace(MORE_AND_MORE, function (m) { return /^M/.test(m) ? 'Increasingly' : 'increasingly'; });
    return { text: s, fixes: fixes };
  }
  function fixNote(fixes) {
    if (!fixes.length) return '';
    return 'Read as: ' + fixes.slice(0, 3).map(function (f) { return '"' + f[0] + '" → "' + f[1] + '"'; }).join(', ') + '. Check the spelling before you copy this into an essay.';
  }
  /* "more and more serious" describes a trend; it is not a verdict (see VERDICT_WIDE). */
  var VERDICT_ADJ = 'serious|important|significant|substantial|beneficial|harmful|damaging|valuable|weighty|compelling|powerful|convincing|considerable|numerous|positive|negative|useful|dangerous|costly|worrying|pressing|helpful|real|lasting|severe';
  var MORE_AND_MORE = new RegExp('\\bmore and more(?= (far |much |considerably |clearly |slightly |a lot |significantly )?(' + VERDICT_ADJ + ')\\b)', 'gi');
  /* Keyword lists. An entry is a phrase ("young people"), a stem ending in *
     ("pollut*"), or a regular expression written "/…/". Phrases match whole
     words with any plural ("car" finds cars, car's), hyphen or space
     ("part-time" finds part time), and British or American spelling.
     SYN widens a list with words that say the same thing, so a student who
     writes "e-learning" or "teenagers" is not told she missed "online" or
     "student". Keys are the words used in the item lists. */
  var SYN_STUDENT = ['student*', 'pupil*', 'learner*', 'teen*', 'young people', 'young person', 'youngster*', 'adolescen*', 'child*', 'kids', 'school-age', 'schoolchild*', 'schoolgirl*', 'schoolboy*', 'school leaver*', 'youth*', 'minors', 'the young', 'young adults', 'secondary school*'];
  var SYN_CLASS = ['class*', 'school*', 'educat*', 'study*', 'studies', 'learn*', 'lesson*', 'face-to-face', 'in person', 'in-person', 'teacher*', 'tutor*', 'campus*'];
  var SYN_CAR = ['car*', 'vehicle*', 'traffic', 'motor*', 'automobile*', 'driv*', 'commut*', 'congestion'];
  var SYN_FOOD = ['sugar*', 'snack*', 'drink*', 'sweet*', 'junk food', 'fizzy', 'soda*', 'soft drink*', 'cand*', 'chocolate*', 'unhealthy food*', 'unhealthy snack*', 'dessert*', 'crisps', 'chips', 'cola', 'fast food', 'bubble tea', 'iced tea', 'vending'];
  var SYN_TOUR = ['touris*', 'visitor*', 'traveller*', 'holidaymaker*', 'sightseer*', 'tour*', 'backpacker*', 'foreign arrivals'];
  var SYN_CAM = ['camera*', 'cctv', 'surveillance', 'monitoring', 'recording*', 'footage', 'video record*'];
  var SYN_WORK = ['work*', 'job*', 'employ*', 'part-time', 'shift*', 'internship*', 'earn*', 'wage*', 'paid', 'labour', 'career*'];
  var SYN_MOVE = ['mov*', 'travel*', 'driv*', 'commut*', 'get around', 'go where*', 'go anywhere', 'come and go', 'journey*', 'mobility', 'transport*', 'access', 'get from', 'get to', 'from place to place', 'one place to another', 'go wherever', 'getting around'];
  var SYN = {
    online: ['online', 'e-learning', 'elearning', 'remote*', 'virtual*', 'distance learning', 'distance education', 'internet', 'digital*', 'web-based', 'zoom', 'screen*', 'from home', 'at home', 'home learning', 'home-based', 'video lesson*', 'recorded lesson*'],
    student: SYN_STUDENT, students: SYN_STUDENT, teenagers: SYN_STUDENT, teenager: SYN_STUDENT, children: SYN_STUDENT, 'young people': SYN_STUDENT, adolescents: SYN_STUDENT,
    classroom: SYN_CLASS, teacher: SYN_CLASS,
    car: SYN_CAR, cars: SYN_CAR, drive: SYN_CAR, traffic: SYN_CAR, vehicles: SYN_CAR,
    city: ['cit*', 'urban', 'town*', 'downtown', 'metropol*', 'centre*', 'central', 'street*', 'road*', 'inner-city'],
    pollution: ['pollut*', 'emission*', 'smog', 'exhaust*', 'fumes', 'air quality', 'dirty air', 'clean air', 'cleaner air', 'pm2.5', 'pm 2.5', 'carbon', 'dust'],
    work: SYN_WORK, job: SYN_WORK, employ: SYN_WORK,
    school: ['school*', 'canteen*', 'cafeteria*', 'campus*', 'classroom*', 'vending'],
    sugar: SYN_FOOD, snack: SYN_FOOD, drink: SYN_FOOD,
    touris: SYN_TOUR, visitor: SYN_TOUR,
    camera: SYN_CAM, surveillance: SYN_CAM, cctv: SYN_CAM,
    sleep: ['sleep*', 'bed*', 'rest', 'tired*', 'start*', 'begin*', 'timetable*', 'schedule*', 'bell*', 'school day', 'morning*', 'at night', 'night*', 'midnight', 'early', 'later', 'late'],
    language: ['languag*', 'english', 'chinese', 'mandarin', 'japanese', 'french', 'spanish', 'korean', 'german', 'arabic', 'bilingual*', 'lingu*', 'second tongue', 'foreign tongue', 'mother tongue'],
    habit: ['habit*', 'routine*', 'pattern*', 'behaviour*', 'preference*', 'taste*', 'diet*', 'eating', 'lifelong', 'for life', 'rest of their lives', 'into adulthood', 'adult life'], habits: null,
    freedom: ['freedom*', 'free*', 'liberty', 'liberties', 'right*', 'choice*', 'choose', 'autonomy', 'independen*'],
    move: SYN_MOVE, travel: SYN_MOVE,
    consumption: ['consum*', 'intake', 'purchas*', 'sale*', 'demand', 'buying', 'spending', 'drinking', 'eating', 'use', 'shopping', 'amount*', 'quantit*', 'volume'],
    concentration: ['concentrat*', 'focus*', 'attenti*', 'alertness', 'performance', 'learning', 'attention span']
  };
  SYN.habits = SYN.habit;
  function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  var RE_CACHE = {};
  function termRe(k, whole) {
    if (k instanceof RegExp) return k;
    var key = (whole ? 'w:' : 'p:') + k;
    if (RE_CACHE[key]) return RE_CACHE[key];
    var m = /^\/(.+)\/([a-z]*)$/.exec(k), re;
    if (m) re = new RegExp(m[1], m[2] || 'i');
    else {
      var c = canon(k).trim(), pre = /\*$/.test(c); c = c.replace(/\*$/, '');
      var join = function (s) { return s.split(/[\s-]+/).map(reEsc).join('[\\s-]*'); };
      if (pre || !whole) re = new RegExp('\\b' + join(c), 'i');
      else {
        var base = c, suf = "(?:s|es|'s)?";
        if (whole === 'exact') { /* bans: the word as listed, plus a plural; "informations" never shrinks to "information" */ }
        else if (/[^aeiou]y$/.test(c)) { base = c.slice(0, -1); suf = "(?:y|ies|y's)"; }
        else if (/[^aeiou]ies$/.test(c)) { base = c.slice(0, -3); suf = "(?:y|ies|y's)"; }
        else if (/[^su]s$/.test(c) && c.length > 3) base = c.slice(0, -1);
        re = new RegExp('\\b' + join(base) + suf + '(?![\\w])', 'i');
      }
    }
    return (RE_CACHE[key] = re);
  }
  function expand(group) {
    var out = group.slice();
    group.forEach(function (k) {
      if (typeof k !== 'string') return;
      var c = canon(k).replace(/\*$/, '').trim();
      if (SYN[c]) out = out.concat(SYN[c]);
      if (/^outweigh/.test(c)) out.push(VERDICT_WIDE);
    });
    return out;
  }
  /* Does canonical text t contain any entry of the group? whole = rewrite
     items (whole words); otherwise word-start matching, as the thesis lists
     use stems such as "touris". syn = false for spelling items. */
  function hasAny(t, group, whole, syn) {
    var list = syn === false ? group : expand(group);
    return list.some(function (k) { return termRe(k, whole).test(t); });
  }
  /* Comparative verdict wording for "outweigh" prompts. "more and more serious" is not a verdict:
     read() turns it into "increasingly serious" before the detectors run (this replaced a lookbehind). */
  var VERDICT_WIDE = new RegExp('\\b(outweigh\\w*|on balance|on the whole|tip(s|ped)? the (balance|scales)|(the )?(balance|scales) (tips|tilts)' +
    '|(far |much |considerably |clearly |slightly |a lot |significantly )?(more|less) (' + VERDICT_ADJ + ')\\b(?! and more)' +
    '|(greater|bigger|larger|heavier|stronger|weightier|weaker|smaller|lighter|fewer|lesser|better|worse) (than|in (number|weight|importance|value|scale))' +
    '|(more|greater|bigger|larger|fewer|stronger|heavier) (\\w+ ){1,3}than' +
    '|exceed\\w*|surpass\\w*|overshadow\\w*|outnumber\\w*|outstrip\\w*|override\\w*|overrid\\w*|eclipse\\w*|dwarf\\w*|weigh\\w* (more|less|heavier|far more|much more)|weighs? heavier' +
    '|net (gain|benefit|loss|positive|negative|cost)s?|(a )?price worth paying|worth the (cost|price|risk)s?|(more|less) (good|harm|benefits?|advantages?|problems?|risks?|costs?|gains?|drawbacks?|disadvantages?) than|win(s)? out|carr(y|ies) more weight|matter\\w* more|count\\w* for more|more weight)\\b', 'i');

  /* ------------------------------------------------------------ lexicons */
  var POSITION = /\b(i (strongly |firmly |personally )?(believe|think|agree|disagree|argue|would argue|contend|maintain|am convinced)|in my (view|opinion)|my (own |final |overall )?(view|position|opinion|answer|verdict) (is|remains)|i (would |therefore )?conclude that|this essay (argues|contends|will argue|maintains)|(i|we) (should|must)|(should|must|ought to|need to) (be|not)|it is (clear|evident) that|on balance|outweigh|the (benefits|advantages|drawbacks|disadvantages) (clearly |far |easily )?(outweigh|exceed)|(more|less) (important|significant|beneficial|harmful) than|the (best|most (effective|sensible|reasonable|defensible)) (way|approach|position|response|reading) is|position is that|way to (look at|see) it is that|for (this|these) reasons?|supports the view that|this judgement|the (only|most) defensible|(logical|sensible) response|argues? that|contends? that|arguing that|contending that|conclud(?:es|ing) that|the view that|the position that|this essay (has )?(argued|shown|maintained)|(governments?|schools?|parents?|societ(?:y|ies)|the state|policymakers|cities|councils|individuals|families|companies|employers|universities|authorities|teachers|we) (should|must|ought to|need to|cannot))\b/i;
  var VERDICT = /\b(outweigh|on balance|more (significant|important|beneficial|serious) than|greater than|exceed|the (benefits|advantages|drawbacks|disadvantages|costs|gains) (are|remain) (greater|larger|more|heavier))\b/i;
  var MECH = /\b(because|since|as a result|leads? to|led to|results? in|means that|which in turn|in turn|so that|thereby|thus|therefore|causes?|caus(?:ing|ed)|by \w+ing|through \w+ing|enabl(?:es|ing)|allows?|reduc(?:es|ing)|increas(?:es|ing)|creat(?:es|ing)|generat(?:es|ing)|operates? by|works? by|stems? from|derives? from|arises? from|operates? through|functions? through|works? through|rests on|based on|driven by|relies on|depends on|its influence|the mechanism|the underlying process|the reason it matters|the reason is|so|helps?|help(?:ing|ed)|mak(?:es|ing) (?:it|them|people|students|staff|workers|children|teenagers|families|the|her|him|their)|prevent(?:s|ing)?|encourag(?:es|ing)|discourag(?:es|ing)|lower(?:s|ing)|rais(?:es|ing)|improv(?:es|ing)|protect(?:s|ing)|sav(?:es|ing)|cuts?|cutting|boost(?:s|ing)|consequently|this means|which means|meaning that|as a consequence|contribut(?:es|ing) to|turns? into|becomes?|becoming|forc(?:es|ing)|gives?|giving|shapes?|builds?|teach(?:es|ing)|deprives?|leads?|leading|in this way|the process|the chain|works? through|carr(?:y|ies) over|once)\b/i;
  var EXAMPLE = /\b(for (example|instance)|such as|e\.g\.|an? ([a-z-]+ ){0,2}(example|case|illustration) (of|is|from|can)|(example|case) (of this|from real life)|in (thailand|bangkok|japan|singapore|korea|finland|europe|asia|my (country|school|city|family))|cities (that|which|where)|schools (that|which|where)|countries (that|which|where)|(we|one) can see|illustrat(?:es|ed|ion)|evidenced by|as (seen|shown) (in|by)|a clear (example|case|illustration)|the case of|consider the|results? (like|such as)|demonstrates?|is a good illustration|in practice|(we|one) sees? this in|visible in|can be seen in|observable in|offers evidence|shows that this|cases? (such as|like|where)|(when|where) (schools|cities|governments|companies|families|students|parents|councils|hospitals|countries|towns|firms|employers|teachers|universities|people) |which leads to|manifest(?:s|ed|ing)? in|exemplified by|as seen|(shows|demonstrates|illustrates|reveals)\b|witness|a case in point|to illustrate|take the (case|example) of|imagine|picture (a|an|the)|(a|an|one|my|our|her|his) ([a-z-]+ ){0,2}(school|city|family|student|company|firm|worker|teenager|government|hospital|town|village|shop|cafe|café|factory|country|parent|teacher|council|district|province|programmer|designer|business|canteen|office|friend|cousin|sister|brother|classmate|neighbour|girl|boy|bus|train|station|market|restaurant|bank|app|website|programme|policy|scheme|law|rule|project) (that|which|who|where|in|at|on|from|near|with|whose|named|called)|at (a|one|my|our) ([a-z-]+ ){0,2}(school|company|firm|hospital|cafe|café|shop|office|station|market|university)|a good example|one example|one case|for one thing|grade \d+|year \d+)\b/i;
  var NUANCE = /\b(however|although|though|while|whereas|yet|admittedly|nevertheless|nonetheless|even so|still|but|overlook(?:s|ed)?|ignor(?:es|ed)|in reality|it (is|should be) (true|noted|conceded|admitted)|granted|that said|this (view|argument|approach) (has|fails)|not (a )?perfect|limit(?:s|ed|ation)?|seldom|rarely|not even|undermine[sd]?|qualif(?:ies|ication|ied)|despite|in spite of|concede[sd]?|caveat|temper(?:s|ed)|does not (weaken|negate|overturn)|far from|unfortunately|hard to|difficult|compounding|resistant|necessary rather than sufficient|neither inevitable nor|on the other hand|at the same time|the downside|drawbacks?|risks?|only (if|when|works|helps)|unless|as long as|not always|not every|not all|may not|might not|does not mean|to be fair|of course|it must be admitted|critics|a weakness|the problem is|even though|even if|except|true,|it is true|cannot|has a limit|have limits|this benefit has)\b/i;
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
  var SHARES = [0.6, 0.5, 0.4, 0.3];
  function preflight(text, promptOrId, opts) {
    opts = opts || {};
    var p = promptOf(promptOrId) || {};
    var type = p.type || 'DISCUSS';
    var rows = [];
    function add(id, tag, status, label, note) { rows.push({ id: id, tag: tag, status: status, label: label, note: note }); }

    /* ps / all: what she typed (quotes straightened) — register, hints, quotes in rows.
       fps / fall: the same text with typos repaired — what the structural detectors read. */
    var ps = paragraphs(plain(text)), n = words(text), all = plain(text);
    var fall = read(all).text, fps = paragraphs(fall);

    /* length */
    add('length', 'struct-length', n < 250 ? 'bad' : n <= 320 ? 'ok' : 'warn', 'Length: ' + n + ' words',
      n < 250 ? 'Under 250 words: too little evidence for the higher bands. Develop the nuance or the example in a body paragraph.' : n <= 320 ? 'At least 250 words. The method aims at 260–290; up to 320 is fine.' : 'Over 320 words costs checking time and multiplies errors. Cut the weakest sentence in each body paragraph.');

    /* format */
    var bullets = ps.filter(function (q) { return /^(\s*[-•*]|\s*\d+[.)]\s)/.test(q); }).length;
    if (bullets) add('bullets', 'cc-paragraphing', 'bad', 'Bullet points or numbered lines: ' + bullets, 'The answer must be a whole piece of connected text. No lists, no notes, no headings.');

    /* paragraphs */
    add('paras', 'cc-paragraphing', ps.length >= 4 && ps.length <= 5 ? 'ok' : 'bad', 'Paragraphs: ' + ps.length,
      ps.length >= 4 && ps.length <= 5 ? 'Introduction, two body paragraphs, conclusion — the shape the examiner expects.' : ps.length < 4 ? 'Split into four paragraphs: introduction, body A, body B, conclusion. Leave a blank line between them.' : 'Too many paragraphs — merge to two or three body paragraphs, one idea each.');

    var intro = fps[0] || '', concl = fps.length > 1 ? fps[fps.length - 1] : '';
    var body = fps.slice(1, Math.max(1, fps.length - 1));

    /* position */
    var posIntro = POSITION.test(intro), posConcl = POSITION.test(concl), posAny = POSITION.test(fall);
    if (type === 'ADVANTAGE') {
      var verdict = VERDICT.test(intro) || VERDICT.test(concl) || VERDICT_WIDE.test(intro) || VERDICT_WIDE.test(concl);
      add('verdict', 'tr-listing', verdict ? 'ok' : (POSITION.test(intro) || POSITION.test(concl)) ? 'warn' : 'bad', verdict ? 'A verdict is stated' : 'No verdict: which side outweighs?', verdict ? '"Outweigh" is answered.' : '"Do the advantages outweigh the disadvantages?" is an opinion question. Say which side is heavier — "the benefits clearly outweigh the drawbacks" — in the introduction and the conclusion.');
    }
    /* type-aware (Oct 2026): "to what extent" wants an extent word; a two-part prompt wants both questions answered */
    if (type === 'OPINION' && /to what extent/i.test(p.text || '')) {
      var extent = /\b(largely|partly|partially|entirely|completely|wholly|to some extent|to a large extent|to a limited extent|mostly|mainly|strongly|firmly|only (if|when|as long as)|provided( that)?|as long as|on condition)\b/i.test(intro + ' ' + concl);
      add('extent', 'tr-partial', extent ? 'ok' : 'warn', extent ? 'The extent of agreement is stated' : 'How far do you agree?', extent ? '"To what extent" is answered.' : '"To what extent" asks for a degree: "I largely agree …", "I agree only if …", "partly".');
    }
    if (type === 'TWOPART') {
      var qs2 = (String(p.text || '').match(/\?/g) || []).length, bodyN = body.length;
      add('twopart', 'tr-partial', bodyN >= 2 ? 'ok' : 'bad', bodyN >= 2 ? 'Each question has its own paragraph' : 'Two questions, ' + bodyN + ' body paragraph' + (bodyN === 1 ? '' : 's'), qs2 >= 2 ? 'The prompt asks two questions: answer the first in Body A and the second in Body B, each with a mechanism and an example.' : 'Answer each question in its own paragraph.');
    }
    if (!posAny) add('position', 'tr-no-position', 'bad', 'No clear position found', 'The examiner must be able to say what you think. Add one sentence in paragraph one: "I believe that …" / "This essay argues that …".');
    else if (!posIntro && posConcl) add('position', 'tr-position-late', type === 'DISCUSS' || type === 'OPINION' || type === 'ADVANTAGE' ? 'bad' : 'warn', 'Position appears only at the end', 'State the position in the introduction as well. An opinion that first appears in the conclusion reads as an afterthought.');
    else if (posIntro && !posConcl && ps.length >= 3) add('position', 'tr-no-position', 'warn', 'Position not restated in the conclusion', 'Echo the thesis in the last paragraph in fresh words: "For these reasons, …".');
    else add('position', 'tr-no-position', 'ok', 'Position in the introduction and the conclusion', 'Clear position, held to the end.');

    /* coverage of the prompt */
    if (p.keyNouns && p.keyNouns.length) {
      var lt = canon(fall), missing = p.keyNouns.filter(function (k) { return !hasAny(lt, [k], false); });
      add('coverage', 'tr-off-topic', missing.length === 0 ? 'ok' : 'warn', missing.length ? 'Prompt words not used: ' + missing.join(', ') : 'The essay stays on the prompt', missing.length ? 'Every body paragraph should connect back to the key nouns of the prompt. A paraphrase is fine (urban for city); a paragraph that never touches the prompt is the first sign of an off-topic essay.' : 'The key nouns of the prompt appear in the essay.');
    }
    if (type === 'PROBLEM') {
      var hasCause = /\b(cause[sd]?|because|due to|stems? from|result of|reason|root|driven by|arises? from)\b/i.test(fall), hasSol = /\b(solution|solve|tackle|address|measure|should|could|must|govern\w+ (should|could|must)|introduce|invest|ban|tax|subsidi[sz]e|provide|require)\b/i.test(fall);
      /* plurals: "causes" and "measures" ask for at least two of each. Amber only: the rule looks for an explicit second one. */
      var ptxt = lower(p.text || '');
      var two = function (re) { return re.test(fall); };
      if (/\b(causes|reasons)\b/.test(ptxt) && !two(/\b(second|another|a further|an additional|also)\s+(main\s+)?(cause|factor|reason|driver)\b|\b(causes|factors|reasons) (are|include)\b/i)) add('plural-c', 'tr-partial', 'warn', 'The prompt asks for causes (plural): no second cause found', 'Name a second cause, for example in Nuance A: "A second cause is …".');
      if (/\b(measures|solutions|steps)\b/.test(ptxt) && !two(/\b(second|another|a further|an additional)\s+(measure|step|solution|remedy|response|answer)\b|\b(measures|steps|solutions) (are|include|such as)\b/i)) add('plural-s', 'tr-partial', 'warn', 'The prompt asks for measures (plural): no second measure found', 'Add a second measure, for example in Nuance B: "… so a second step is …".');
      add('parts', 'tr-partial', hasCause && hasSol ? 'ok' : 'bad', hasCause && hasSol ? 'Causes and solutions both present' : (hasCause ? 'No solutions found' : 'No causes found'), 'A problem/solution prompt has two parts. Name the cause with its mechanism, then a solution that answers that cause.');
    }

    /* body paragraphs: the four moves */
    body.forEach(function (q, i) {
      var label = 'Body ' + (i + 1);
      var m = MECH.test(q), e = EXAMPLE.test(q) || PROPER.test(q), nu = NUANCE.test(q), w = words(q);
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

    /* language hints (Oct 2026): a light screen for the errors B1/B2 Thai writers make most.
       Labelled as hints: the rules cannot see every case, and an unflagged essay is not error-free. */
    var hints = [];
    var PLUR = 'students|people|children|parents|teachers|governments|companies|cities|countries|schools|workers|citizens|teenagers|families|supporters|critics|employers|employees|authorities|residents|consumers|tourists|visitors|adults|individuals';
    var m1 = all.match(/\b(the number|the amount|the level|the rate|the proportion) of \w+ (have|are|were)\b/i); if (m1) hints.push('"' + m1[0] + '": the head noun is singular (the number … is / has)');
    var m3 = all.match(/\b(a|an) (information|advice|research|equipment|furniture|traffic|homework|evidence|progress|news|pollution|money|accommodation|transport)\b/i); if (m3) hints.push('"' + m3[0] + '": uncountable noun, no a / an');
    var m4 = all.match(/(^|[.;:]\s+)(government|economy|environment|majority|minority|internet) (of|is|has|should|must|can|will|does)\b/i); if (m4) hints.push('"' + m4[2] + ' ' + m4[3] + '": singular countable noun with no article (the ' + m4[2].toLowerCase() + ' …)');
    var m5 = all.match(/\b(each|every) (\w+[a-rt-z]s)\b/i); if (m5 && !/\b(each|every) (\w*(ss|us|is|ics|ews|eans|hs))\b/i.test(m5[0])) hints.push('"' + m5[0] + '": each / every take a singular noun');
    var re6 = new RegExp('(^|[.;,]\\s+|\\b(the|many|most|some|these|those|all|few|young|thai|local|older|other|such)\\s+(\\w+\\s+)?)(' + PLUR + ')\\s+(is|was|has|does|argues|believes|thinks|wants|needs|uses|says|prefers|tends|spends|gets|makes|goes|takes)\\b', 'i'), m6 = all.match(re6);
    if (m6 && !/\b(of|between|among|for|with|in|to|by|from)\s+[^.;,]{0,40}$/i.test(all.slice(Math.max(0, m6.index - 40), m6.index))) hints.push('"' + (m6[4] + ' ' + m6[5]) + '": plural subject, singular verb');
    var m6b = all.match(new RegExp('\\b(' + PLUR + ')\\s+of\\s+\\w+\\s+(argues|believes|thinks|wants|needs|uses|says|prefers|tends|spends|gets|makes|goes|takes|is|has)\\b', 'i')); if (m6b) hints.push('"' + m6b[0] + '": the subject is plural (' + m6b[1].toLowerCase() + ' …), so the verb has no -s');
    var m7 = all.match(/\b(he|she|it)\s+(have|do|were)\b(?!\s+(been|to|not))/i); if (m7) hints.push('"' + m7[0] + '": singular subject, plural verb');
    var m7b = all.match(/\b(a|an|one|this|that) (student|school|child|parent|teacher|government|company|city|country|worker|teenager|family|canteen|shop|person|camera|phone)\s+(have|do|were|are)\b(?!\s+(been|to|not))/i); if (m7b) hints.push('"' + m7b[0] + '": singular subject, plural verb');
    var m8 = all.match(/\b(a lot of|lots of|kids|stuff|really|gonna|wanna|okay|OK)\b/); if (m8) hints.push('"' + m8[0] + '": informal; use many / a great deal of, children, …');
    var m9 = all.match(/\b(fry|bake|grill|boil|freeze|cook) (snack|food|chicken|fish|rice)s?\b/i); if (m9) hints.push('"' + m9[0] + '": past participle as adjective (fried, baked, grilled …)');
    if (hints.length) add('lang', 'gra-agreement', 'warn', 'Language hints: ' + hints.length + ' possible slip' + (hints.length > 1 ? 's' : ''), hints.slice(0, 5).join(' · ') + ' — hints only: the Wards cannot see every error, and no hint does not mean no errors.');

    /* template ratio */
    /* One standard (Oct 2026): the template share the student chose in the
       Template Lab — 60, 50, 40 or 30%. Green at or under it, amber up to 5
       points over, red beyond that or above 60%. Without a choice: 40%
       (B2 track) or 30% (C1 track) under exam conditions. */
    var tr = T ? T.ratio(all) : 0, share = SHARES.indexOf(Number(opts.share)) >= 0 ? Number(opts.share) : 0.4, sh = Math.round(share * 100);
    var trS = tr <= share + 0.005 ? 'ok' : tr <= share + 0.05 && tr <= 0.6 ? 'warn' : 'bad';
    /* WP6 (18 Oct 2026): the share she got sits next to the share she chose. Over it, longer
       variables in her own words come first; lowering the spellbook share comes after. */
    var got = Math.round(tr * 100), chosen = SHARES.indexOf(Number(opts.chosen)) >= 0 ? Math.round(Number(opts.chosen) * 100) : 0;
    var shLbl = opts.practice ? 'practice limit ' + sh + '%' + (chosen && chosen !== sh ? ' (your spellbook: ' + chosen + '%)' : '') : 'you chose ' + sh + '%';
    add('template', 'struct-template', trS, 'Frame share: you got ' + got + '% · ' + shLbl,
      trS === 'ok' ? 'Unchanged frame text is within your spellbook (template) share. The marks are inside the variables.'
        : 'Unchanged frame text is ' + got + '%, above the ' + sh + '% share. Longer variables in your own words lower it: write who, where and how much inside each key, and edit the openers. Lower your spellbook share only after that.');

    /* new idea in conclusion: a noun in the conclusion that appears nowhere else */
    if (concl && ps.length >= 4) {
      var before = lower(ps.slice(0, -1).join(' ')), newNouns = [], fw = T ? T.frameWords() : {};
      lower(concl).replace(/[^a-z ]+/g, ' ').split(/\s+/).forEach(function (w3) { if (w3.length > 6 && !fw[w3] && before.indexOf(w3.slice(0, 5)) < 0 && newNouns.indexOf(w3) < 0) newNouns.push(w3); });
      if (newNouns.length >= 4) add('newidea', 'tr-new-idea', 'warn', 'Possible new material in the conclusion: ' + newNouns.slice(0, 3).join(', '), 'The conclusion evaluates and restates; it does not introduce ideas the body did not develop.');
    }

    var bad = rows.filter(function (r) { return r.status === 'bad'; }).length;
    var warn = rows.filter(function (r) { return r.status === 'warn'; }).length;
    return { rows: rows, words: n, paras: ps.length, bad: bad, warn: warn, ratio: tr, share: share, bodyWords: body.map(words),
      summary: bad === 0 && warn === 0 ? 'Every ward holds. Nothing red (structure only: the Wards do not mark grammar).' : bad === 0 ? 'No red rows — ' + warn + ' to look at.' : bad + ' red row' + (bad > 1 ? 's' : '') + ' to fix before you submit.' };
  }

  /* ------------------------------------------------ module free-text items */
  function cliches(t) { return CLICHE.filter(function (re) { return re.test(t); }).length; }
  /* ------------------------------------------------ the Plan Wards (Oct 2026)
     Eight planning checks before the essay. Where the app can judge a slot's
     shape it ticks the line itself; the rest are the student's own ticks. */
  var PLAN_WARDS = [
    { id: 'type', text: 'I named the question type from the instruction sentence and read its row on the Type Switch Card.', manual: true },
    { id: 'parts', text: 'I counted the parts and circled every plural (causes, measures, reasons, both views).', manual: true },
    { id: 'core', text: 'My Core Topic is one noun phrase that covers every part: it names the issue (no "cars should …"), and it is not a copy of the prompt.' },
    { id: 'facets', text: 'Facet A and Facet B are two obvious ideas I can develop.' },
    { id: 'mech', text: 'Each facet has a mechanism (an -ing phrase) and an example I can picture or check.' },
    { id: 'nuance', text: 'Each facet has a nuance that limits it without changing my position.' },
    { id: 'position', text: 'My position is a full clause with a stance word that fits the type (outweigh, how far, which view, what must happen).' },
    { id: 'budget', text: 'I know the budget (50 / 95 / 95 / 45), chose at most one structural swap per body paragraph, and listed two words not to repeat.', manual: true }
  ];
  function planWards(vars, promptText) {
    var v = vars || {}, out = {};
    var has = function (k, min) { return String(v[k] || '').trim().split(/\s+/).filter(Boolean).length >= (min || 2); };
    out.core = coreOk(v.core, promptText);
    out.facets = has('facetA') && has('facetB');
    out.mech = /^\s*(by |through )?\w+ing\b/i.test(v.mechA || '') && /^\s*(by |through )?\w+ing\b/i.test(v.mechB || '') && has('exA') && has('exB');
    out.nuance = has('nuanceA', 5) && has('nuanceB', 5);
    out.position = positionOk(v.position);
    return out;
  }
  /* The Landing Check: ten lines before submitting, ordered by marks per minute.
     `auto` lines are ticked from the Ten Wards rows; the others are hers. */
  var LANDING = [
    { id: 'position', text: 'Position clear in paragraph one and restated in new words in paragraph four, with no new idea.', rows: ['position', 'newidea'] },
    { id: 'parts', text: 'Every part and every plural answered; each solution answers a named cause.', rows: ['parts', 'plural-c', 'plural-s', 'coverage'] },
    { id: 'moves', text: 'In each body paragraph I can underline the mechanism, the example and the nuance.', rows: ['b0mech', 'b0ex', 'b0nu', 'b1mech', 'b1ex', 'b1nu'] },
    { id: 'length', text: 'The essay is 250 words or more (aim 260–290).', rows: ['length'] },
    { id: 'faults', text: 'I checked the top five faults on my own Mending Room list, one at a time.', manual: true },
    { id: 'articles', text: 'Every noun phrase has its article or plural right.', manual: true },
    { id: 'agreement', text: 'Every subject agrees with its verb, and the tense fits the sentence\'s job.', manual: true },
    { id: 'linkers', text: 'No more than a third of my sentences start with a linker, and no sentence runs on with a comma.', rows: ['linkers'] },
    { id: 'register', text: 'No contractions, no "you", no "I think" more than once, no rhetorical question.', rows: ['rhetorical', 'ipron'] },
    { id: 'spelling', text: 'Capital letters, full stops and spellings checked on a last slow read.', manual: true }
  ];
  function landingAuto(pre) {
    var byId = {}; (pre.rows || []).forEach(function (r) { byId[r.id] = r.status; });
    var out = {};
    LANDING.forEach(function (l) { if (l.rows) out[l.id] = l.rows.every(function (id) { return !byId[id] || byId[id] === 'ok'; }); });
    return out;
  }
  function wardList(cls, items, state, auto) {
    return '<ul class="wards ' + cls + '">' + items.map(function (w) {
      var ok = w.manual ? !!state[w.id] : !!auto[w.id];
      return '<li class="' + (ok ? 'ok' : '') + (w.manual ? ' manual' : ' auto') + '"><label><input type="checkbox" data-ward="' + w.id + '"' + (ok ? ' checked' : '') + (w.manual ? '' : ' disabled') + '><span>' + esc(w.text) + '</span></label></li>';
    }).join('') + '</ul>';
  }

  /* Free-text gates (Oct 2026; widened 16 Oct 2026 so that every fair way of
     saying the answer passes). A position needs a stance word, not just "is";
     a sentence that only describes the topic or reports the debate is refused;
     generic filler is counted. These are still heuristics and are labelled as
     such on screen. All detectors run on read(t): typos repaired, quotes straight. */
  var STANCE = new RegExp('\\b(should|must|ought to|need(s)? to|ha(s|ve) to|outweigh\\w*|on balance|heavier|greater than|agree|disagree|support|oppose|in favou?r of|(am|is|are|be|stand|remain) (firmly |strongly |completely )?against|better|worse|wisest|benefit(s)? .{0,30} more|positive development|negative development' +
    '|(is|are|was|were|would be|will be|remains?|seems?) (a |an |the )?(very |clearly |far |entirely |largely |mostly |definitely |certainly |strongly |highly |more |less |much |deeply |genuinely |truly )?(good|bad|positive|negative|beneficial|harmful|damaging|wise|unwise|sensible|right|wrong|fair|unfair|justified|unjustified|essential|necessary|unnecessary|vital|crucial|mistake|good idea|bad idea|step forward|welcome|worthwhile|worth|preferable|desirable|undesirable|dangerous|useful|valuable|effective|ineffective|the answer|the solution)' +
    '|the (best|right|wisest|most sensible|most effective|most reasonable|only|fairest) (choice|option|approach|way|solution|answer|policy|course|response|decision|path|plan)' +
    '|(it is|it would be) (essential|necessary|vital|crucial|important|time|wise|sensible|better|best|right|fair) (that|to|for)|do(es)? more (harm|good) than|(more|less) (good|harm) than|cannot be justified|is worth keeping|worth (it|keeping|the cost))\\b|' + VERDICT_WIDE.source, 'i');
  /* A reason: a cause, a purpose or a consequence that explains the position. */
  var CAUSE = new RegExp('\\b(because|since|as (it|they|this|these|that|there|we|people|students|children|teenagers|schools|governments|cities|the|a|an|many|most|their|its|our|such|online|cameras|tourism|families|parents|teachers|workers|employees|cars|drivers|young|habits|early|lessons|classes)' +
    '|for the (simple )?reason|the (main |key |real |chief |root |underlying )?(reason|cause) (is|being|for|of)|(is|are|that is|which is|this is) why|due to|owing to|thanks to|on account of|as a result of|because of|in (view|light) of|given (that|the|how|its|their)|considering|seeing that|now that|on the grounds|in that|caused by|stems? from|results? from|arises? from|so that|so as to|in order to|meaning (that)?|this means|which means|leading to|resulting in|thereby|otherwise|or else' +
    '|which (gives|saves|allows|lets|helps|makes|leads|protects|reduces|improves|creates|keeps|prevents|cuts|raises|lowers|damages|harms|hurts|costs|puts|forces|removes|brings|offers|provides|wastes|takes|matters|deprives|weakens|builds|teaches|encourages|discourages)' +
    '|so (they|it|we|students|schools|governments|cities|that|people|children|teenagers|families|parents|the|this|these|online|cars|tourism|young|lessons|classes|habits|councils|employers|workers))\\b' +
    '|;\\s*[a-z]|[,;:\\u2014]\\s*(so|which|since|thus|therefore|hence|as(?! well\\b| much\\b| many\\b| far\\b| soon\\b| such\\b| for\\b| part\\b))\\b|\\band so\\b|[:\\u2014]\\s*[a-z]|\\s[-\\u2013]\\s+[a-z]' +
    '|,\\s*(?!including|during|nothing|something|anything|everything|according|regarding|concerning|being|morning|evening)(thereby |thus )?[a-z]{3,}ing\\b|\\b(by|through) [a-z]+ing\\b' +
    '', 'i');
  /* A purpose "to protect …" counts as a reason, unless "to" follows need / have / want … (then it
     is part of the verb: "people need to protect"). Checked in code, not with a lookbehind (B2). */
  var PURPOSE_TO = /\bto (protect|keep|ensure|reduce|avoid|prevent|help|improve|save|allow|give|stop|cut|limit|raise|support|encourage|lower|fight|tackle|ease|free|create|boost|promote|preserve|guard|shield|balance|meet|serve|respect|gain|attract|clean|calm|make sure|safeguard|benefit)\b/gi;
  var TO_VERB_BEFORE = /\b(need|needs|have|has|had|ought|going|want|wants|try|tries|able|used|likely|decide|decided|plan|plans|seem|seems|tend|fail|fails|refuse|is|are|be|was|were|begin|start|continue|choose|learn) $/i;
  function hasCause(t) {
    if (CAUSE.test(t)) return true;
    var m; PURPOSE_TO.lastIndex = 0;
    while ((m = PURPOSE_TO.exec(t))) { if (!TO_VERB_BEFORE.test(t.slice(Math.max(0, m.index - 40), m.index))) { PURPOSE_TO.lastIndex = 0; return true; } }
    return false;
  }
  /* A condition: when, how far or on what terms the position holds. */
  var CONDITION = /\b(if|unless|provided|providing|as long as|so long as|only (if|when|where|as|for|to|in|with|after|once|until|during|on)|on (the |one |a |this |that )?condition|one condition|on the understanding|assuming|subject to|in (cases|situations|places|schools|areas|countries|districts) where|where (the|there|it|they|access|schools|recordings|footage|data|rules|hours|students|families)|when (the|it|they|there|access|schools|recordings|footage|data|rules|hours|used|combined|kept|limited|properly|strict|students|families|good)|once|until|except (when|where|if|for)|with (strict|clear|careful|proper|tight|limited|fair|strong|firm|good|sensible|reasonable|enough|adequate|independent|legal|safe|some|a few|certain|appropriate|controlled|short|reliable)\b|under (strict|clear|careful|proper|tight|firm|independent|controlled)\b|within (strict|clear|reasonable|safe|legal|certain|limited)\b|rather than|instead of|but (only|not|should|must|with|within|limited|never)|as (a|an) (supplement|addition|complement|extra|support|add-on)|alongside|complement\w*|in addition to|together with|limit\w* (to|on|the)|capped|no more than|at most|up to|for (a )?(limited|short)|kept (briefly|short|for)|restricted to|(not|never) \w+( \w+)? (more|longer) than|(fewer|less) than|a (maximum|limit|cap) of|limited|restricted|but (they|it|this|students|schools|the|teenagers|cameras|footage) (should|must|need|only|may))\b/i;
  var EXPLICIT = /\b((i|we) (strongly |firmly |personally |would |still |therefore |do |also |partly |largely |fully |completely )?(believe|think|agree|disagree|argue|feel|maintain|contend|support|oppose|prefer|conclude|am convinced|am in favou?r|am against|am sure|would say)|in my (view|opinion|judgement|judgment)|to my mind|from my (point of view|perspective)|my (own |overall |final )?(view|position|opinion|verdict|answer)|this essay (argues|will argue|contends|maintains)|personally)\b/i;
  var DEBATE = /\b((some|many|other|most) people (think|believe|say|argue|feel|claim)|others (think|believe|say|argue|feel|claim)|both sides|both views|(has|have) (both )?(good|bad|advantages|pros|benefits) and (bad|good|disadvantages|cons|drawbacks))\b/i;
  var HEDGE = /\b(it (all )?depends|depends on (the|each|every|individual|how|what|who|their|its)|hard to say|difficult to (say|decide|choose)|no (clear|right|single) answer)\b/i;
  var EMPTY = /\b(there is a lot to (say|talk)|(is|are) (a |an )?(very |really |quite )?(interesting|important|big|hot|popular|good) (topic|issue|subject|question|thing)|the topic is|many people have (different )?(ideas|opinions|views)|in the world today|people have different opinions)\b/i;
  var VAGUE = [/\bmany ways\b/i, /\bmany people\b/i, /\b(some|many) (small )?problems\b/i, /\bother places\b/i, /\beverywhere\b/i, /\bdaily life\b/i, /\bthings\b/i, /\bthe big thing\b/i, /\ba lot of things\b/i, /\bin the world\b/i];
  /* A capitalised name inside a sentence (Bangkok, Maya Bay, Thai, Tallinn) counts as a concrete example. */
  var PROPER = /[a-z0-9,;:)'] +(?:the )?[A-Z][a-z]{2,}/;
  function vague(t) { return VAGUE.filter(function (re) { return re.test(t); }).length; }
  function bans(t) { return BANNED.filter(function (b) { return b.re.test(t); }); }
  function label(group) { return group.filter(function (k) { return typeof k === 'string' && k.charAt(0) !== '/'; }).map(function (k) { return k.replace(/\*$/, '…'); }); }
  function isVerdictGroup(group) { return group.some(function (k) { return typeof k === 'string' && /^outweigh/i.test(k); }); }
  function agreementHint(t) {
    var m = t.match(/\b(advantages|disadvantages|benefits|drawbacks|costs|risks|gains|positives|negatives|pros|cons|problems|dangers)\b(\s+of\s+[^,.;]{1,50}?)?\s+(outweighs|exceeds)\b/i);
    return m ? 'Grammar: "' + m[1] + ' … ' + m[3] + '": the subject is plural, so the verb has no -s ("' + m[3].replace(/s$/, '') + '").' : '';
  }
  function checkThesis(text, item) {
    var notes = [], ok = true, raw = plain(text).trim(), r = read(raw), t = r.text, ct = canon(t), n = words(raw);
    var min = item.minWords || 12, max = item.maxWords || 45, stem = String(item.stem || '');
    if (sentences(raw).length > 2) { ok = false; notes.push('One sentence (two at most). A thesis is a single clear claim.'); }
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words. Name the position and the reason.'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words. A thesis is one claim, not the whole essay.'); }
    var stance = POSITION.test(t) || STANCE.test(t);
    if (!stance && EMPTY.test(t)) { ok = false; notes.push('That describes the topic. A thesis takes a side: say what should happen, or which side is heavier.'); }
    else if (!stance) { ok = false; notes.push('No position word. Try "I believe that …", "This essay argues that …", "… should …", "… outweigh …".'); }
    /* What the stem asks for: a condition ("under what condition"), or a reason ("why", "a reason", "the cause"). */
    var needCond = item.need ? item.need === 'condition' : /\bcondition\b/i.test(stem);
    var needWhy = item.need ? item.need === 'reason' : /\b(why|reason|because|cause)\b/i.test(stem);
    if (needCond && !CONDITION.test(t)) { ok = false; notes.push('Add the condition: "… provided that …", "… as long as …", "… only if …", "… with strict limits on …".'); }
    else if (!needCond && needWhy && !hasCause(t) && !CONDITION.test(t)) { ok = false; notes.push('Add the reason or the condition: "… because …", "… since …", "… provided that …", "… as long as …".'); }
    /* Reporting the debate is not a position, unless the writer then says where she stands. */
    if (HEDGE.test(t) && !EXPLICIT.test(t)) { ok = false; notes.push('"It depends" is not a position. Say what YOU think, and put the "depends" into a condition: "… only if …".'); }
    else if (DEBATE.test(t) && !EXPLICIT.test(t)) {
      var rest = t.replace(/\b((some|many|other|most) people|others)\s+(think|believe|say|argue|feel|claim)\b[^,;.]*/gi, ' ');
      if (!POSITION.test(rest) && !STANCE.test(rest)) { ok = false; notes.push('That is a description of the debate, not a position. Say what YOU think.'); }
    }
    if (/\b(partly|partially|to (some|a certain|a limited) extent|in part)\b/i.test(t) && !/\b(but|however|although|though|while|whereas|only|except|not|rather than|unless|provided|as long as|if)\b/i.test(t)) { ok = false; notes.push('"Partly" must name both parts: what you accept AND what you reject ("… but not …", "… only if …").'); }
    (item.must || []).forEach(function (group, gi) {
      if (hasAny(ct, group, false)) return;
      ok = false;
      notes.push(item.mustNotes && item.mustNotes[gi] ? item.mustNotes[gi] : isVerdictGroup(group) ? 'Say which side is heavier: "… outweigh …", "… more serious than …", "… do more harm than good".' : 'Mention ' + label(group)[0] + ' (or a word that means the same) — the thesis must name the topic.');
    });
    if (cliches(t)) { ok = false; notes.push('Drop the memorised phrase; say it plainly.'); }
    var b = bans(raw); if (b.length) { ok = false; notes.push(b[0].note); }
    if (ok) notes.push('One sentence, one clear position, on the topic. That is a thesis.');
    var ag = agreementHint(t); if (ag) notes.push(ag);
    if (r.fixes.length) notes.push(fixNote(r.fixes));
    return { ok: ok, notes: notes };
  }
  function checkBody(text, item) {
    var notes = [], ok = true, raw = plain(text).trim(), r = read(raw), t = r.text, n = words(raw);
    var min = item.minWords || 60, max = item.maxWords || 130;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words (aim ' + min + '–' + max + '). Add the example or the nuance.'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words (aim ' + min + '–' + max + '). One idea per paragraph.'); }
    if (!MECH.test(t)) { ok = false; notes.push('No mechanism: say how the idea works ("… because …, which in turn …" / "operates by …").'); }
    if (!EXAMPLE.test(t) && !PROPER.test(raw)) { ok = false; notes.push('No concrete example: "for example, …" / "such as …" / a named place or practice.'); }
    if (item.nuance !== false && !NUANCE.test(t)) { ok = false; notes.push('No nuance: admit the limit ("However, this overlooks …") and keep the position.'); }
    var ss = sentences(t), lk = ss.filter(function (s) { return LINKER_HEAD.test(s); }).length;
    if (ss.length >= 3 && lk / ss.length > 0.5) { ok = false; notes.push('Too many sentences start with a linker. Link with reference words instead.'); }
    if (/^(in conclusion|to conclude|to sum up|overall)\b/i.test(t)) { ok = false; notes.push('This is a body paragraph, not the conclusion.'); }
    var uv = t.match(UNVERIFIABLE); if (uv) { ok = false; notes.push('"' + uv[0] + '" cannot be checked by the examiner. Replace it with a case you can describe: a school, a city, a policy.'); }
    if (cliches(t)) { ok = false; notes.push('Drop the memorised phrase; say it plainly.'); }
    var b = bans(raw); if (b.length) { ok = false; notes.push(b[0].note); }
    if (vague(t) >= 4) { ok = false; notes.push('Too general: name the people, the place and the result instead of "many people", "many ways", "everywhere".'); }
    if (item.keyNouns && !hasAny(canon(t), item.keyNouns, false)) { ok = false; notes.push('Connect the paragraph to the prompt: mention ' + label(item.keyNouns).slice(0, 2).join(' or ') + '.'); }
    if (ok) notes.push('Facet, mechanism, example, nuance — a developed body paragraph.');
    if (r.fixes.length) notes.push(fixNote(r.fixes));
    return { ok: ok, notes: notes };
  }
  function checkRewrite(text, item) {
    var notes = [], ok = true, raw = plain(text).trim(), n = words(raw);
    /* A spelling item is marked on the spelling, so its typos are not repaired. */
    var spelling = item.tag === 'lr-spelling', r = read(raw, spelling), t = r.text, ct = canon(t), craw = canon(raw);
    var min = item.minWords || 5, max = item.maxWords || 60;
    if (n < min) { ok = false; notes.push('Too short: ' + n + ' words.'); }
    if (n > max) { ok = false; notes.push('Too long: ' + n + ' words.'); }
    if (item.maxSentences && sentences(raw).length > item.maxSentences) { ok = false; notes.push('Join the sentences: ' + sentences(raw).length + ' sentences here, ' + item.maxSentences + ' at most.'); }
    (item.must || []).forEach(function (group) { if (!hasAny(ct, group, true)) { ok = false; notes.push(item.mustNote && group === item.must[0] ? item.mustNote : 'Use ' + label(group).slice(0, 3).join(' / ') + (label(group).length > 3 ? ', or a word that means the same' : '') + '.'); } });
    (item.ban || []).forEach(function (k) { if (hasAny(craw, [k], 'exact', false)) { ok = false; notes.push('Do not use "' + k + '".'); } });
    if (item.noClause && /\b(because|since|when|although|which|that|so)\b/i.test(t)) { ok = false; notes.push('No subordinate clause — pack the idea into a noun phrase.'); }
    if (item.noSplice && /,\s*(it|this|that|they|these|there)\s+(is|are|was|were|will|would|has|have|can|must|should)\b/i.test(raw)) { ok = false; notes.push('Comma splice: two sentences are joined by a comma. Use a full stop, a semicolon, or a linking word.'); }
    if (item.tag === 'lr-nominal' && /\b(governments?|cities|councils|authorities|states?|they|we|people|drivers)\s+((should|must|can|will|could|would|do|does)\s+(not\s+)?)?(ban|bans|banned|restrict|restricts|restricted|limit|limits|limited|remove|removes|removed|prohibit|prohibits|prohibited|control|controls|controlled|regulate|regulates|regulated|stop|stops|keep|keeps|are|is)\s+(?!on\b|of\b|in\b|for\b)/i.test(t)) { ok = false; notes.push('That is a clause (subject + verb). A Core Topic is one noun phrase: "the restriction of private cars in city centres".'); }
    if (item.tag === 'lr-nominal' && /^\s*[a-z]+ing\b/i.test(raw) && !/^\s*(during|nothing|something|anything|everything|king)\b/i.test(raw)) { ok = false; notes.push('Start with a noun, not an -ing verb: "the regulation of …", "the restriction of …".'); }
    if (vague(t) >= 2) { ok = false; notes.push('Too general: keep the real nouns from the sentence.'); }
    if (cliches(t)) { ok = false; notes.push('Drop the memorised phrase.'); }
    var b = bans(raw); if (b.length) { ok = false; notes.push(b[0].note); }
    if (ok) notes.push(item.praise || 'That is the target structure.');
    if (r.fixes.length) notes.push(fixNote(r.fixes));
    return { ok: ok, notes: notes };
  }

  /* ------------------------------------------------------- AI marking */
  function markingPrompt(p, text, pre) {
    var gates = [
      'Task Response gates: 5→6 a position is presented and the main parts addressed; 6→7 a clear and developed position throughout, ideas extended and supported; 7→8 no over-generalisation — every main idea carries a mechanism and a concrete example; 8→9 fully developed, explored in depth.',
      'Coherence and Cohesion: 5→6 clear overall progression; 6→7 logical organisation, clear progression, one central topic per paragraph, reference and substitution used; 7→8 message followed with ease, cohesion well managed; 9 cohesion very rarely attracts attention.',
      'Lexical Resource: 5→6 adequate range; 6→7 some flexibility and precision, less common items, awareness of style and collocation; 7→8 wide resource used fluently and flexibly for precise meaning, skilful uncommon items; memorised language and clichés are discounted.',
      'Grammatical Range and Accuracy: 5→6 mix of simple and complex forms; 6→7 a variety of complex structures, error-free sentences frequent; 7→8 wide range flexibly and accurately used, the majority of sentences error-free.',
      'Length and penalties, as the public descriptors and ielts.org state them: there is NO fixed deduction for writing under 250 words; a short essay is judged on the evidence it gives ("if your answer is too short, there may not be enough evidence of the language features needed in order to award higher bands"), and a significantly under-length script may meet the Band 3 lines for LR ("significantly underlength") and GRA ("length may be insufficient to provide evidence of control"). 20 words or fewer = Band 1. Copied rubric is discounted before judging. Notes or bullet points and off-topic writing are penalised under Task Response; memorised phrases count against LR (Band 3 "over-dependence on … memorised language", Band 4 "inappropriate use of lexical chunks"), and Band 0 is only for proof that the whole answer was memorised. A personalised template whose slots are filled for this prompt is not a memorised answer.'
    ];
    return 'You are an IELTS Academic Writing Task 2 examiner and a warm English teacher (T.Chris) at a Thai secondary school. ' +
      'Mark the student essay below against the public band descriptors. Walk each criterion up its gates and stop at the first unmet gate.\n\n' +
      gates.join('\n') + '\n\nTHE TASK (' + (C.TYPES[p.type] || {}).name + ')\n' + p.text + '\n\nSTRUCTURAL CHECK (rule-based, for reference)\n' +
      (pre ? pre.rows.map(function (r) { return '- [' + r.status + '] ' + r.label; }).join('\n') : '') +
      '\n\nSTUDENT ESSAY (' + words(text) + ' words)\n' + text +
      '\n\nReturn ONLY JSON: {"tr":6.0,"cc":6.0,"lr":6.0,"gra":6.0,"overall":6.0,"cefr":"B2","errors":[{"quote":"…","tag":"gra-agreement","fix":"…"}],"comment":"…"}. ' +
      'Rate tr, cc, lr and gra in WHOLE bands, as examiners do; overall = their mean rounded to the nearest half band (.25 and .75 round up). "errors": up to five, each quoting the student\'s words, a tag from this list [' + Object.keys(C.REMEDIATION).join(', ') + '] and a concrete fix. ' +
      '"comment": 100–150 words in T.Chris\'s voice: open with the student\'s nickname, a comma, then one specific praise ending with an exclamation mark; quote the student\'s own words in single quotes; state the level plainly ("Your writing is around B2 level"); name error types by grammatical label; give replacement words; pivot with "However," / "Just ensure" / "Also look at" / "Finally,"; frame improvement as the next gate; close warmly. No markdown.';
  }

  /* ---------------------------------------------- slot shapes (18 Oct 2026, WP6)
     Help under each of the eleven matrix boxes, so that a student whose first
     try is "car smoke" learns the shape instead of waiting out the ten minutes.
       shapeCheck(key, value, promptText, type) → { ok, soft, tip, fix }
         ok    the Plan Wards' own rule for that box (core, mechanism, nuance …)
         soft  true when the box passes but a softer rule is not met (tip only)
         fix   a rule-based rewrite of HER words into the shape, or '' (no AI)
       shapeExamples(key, level, prompt) → [{ text, from, level }] taken from
         OTHER prompts' Duelling Hall answer sets (p.vars[A2|B1|B2|C1]), never
         this prompt's, so the example shows the shape without the answer. */
  var SHAPE_SAY = {
    core: ['a noun phrase', 'Three or more words that name the issue, like a title. No "should", no "because", and do not start with an -ing verb.'],
    facet: ['a noun phrase', 'Two or more words: one idea you can explain in a paragraph.'],
    mech: ['an -ing phrase', 'Start with an -ing verb ("cutting …", "giving …") or with by + -ing ("by giving …"). It says HOW the idea works.'],
    ex: ['a concrete example', 'Two or more words about something real you can picture: a place, a rule, a school, a practice.'],
    nuance: ['a limiting idea', 'Five or more words that limit the idea: who it does not help, when it does not work, or what it costs.'],
    position: ['a full clause', 'A full sentence of five or more words with a stance word: "should", "outweigh", "I believe that …", "I agree …".'],
    rationale: ['one reason', 'One reason why your position is right. It often starts with "because".']
  };
  function shapeKind(key) { return /^facet/.test(key) ? 'facet' : /^mech/.test(key) ? 'mech' : /^ex/.test(key) ? 'ex' : /^nuance/.test(key) ? 'nuance' : key; }
  function nWords(s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; }
  function clip(s) { return String(s || '').trim().replace(/\s+/g, ' ').replace(/[.;:,!?]+$/, ''); }
  function lowFirst(s) { return /^(The|A|An|This|That|These|Those|It|They|We|Some|Many|Most|No|Less|More|Our|Their|Its|Every|Each|All|Too|Fewer|Cars|Students|Schools|People|Children|Teenagers|Parents|Families|Governments|Cities|Lessons|Online|Free|Better|Cheaper|Cleaner|Using|Making|Giving|Cutting|Keeping|Letting|Helping|Stopping|Banning)\b/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  var MECH_OK = /^\s*(by |through )?\w+ing\b/i;
  /* The Core Topic rule. "Cars should be banned" is a clause (an answer), so it fails. A noun phrase
     that carries a relative clause after its head ("The role that competition should play in sport",
     the Duelling Hall's own A2–C1 answers) is still a noun phrase, so it passes (18 Oct 2026). */
  function coreClauseOk(core) {
    var m = /\b(should|must|which|that|when)\b/i.exec(core);
    if (!m) return true;
    if (/^(how|which|what|whether|why|who)\b/i.test(core)) return true;           /* "How much competition there should be …": a noun clause */
    var before = core.slice(0, m.index);
    if (nWords(before) < 2 || /^(i|we|they|it|he|she|you|there)\b/i.test(core) || /\b(is|are|was|were|will|can|should|must|do|does)\b/i.test(before)) return false;
    var md = /\b(should|must)\b/i.exec(core);
    return !md || /\b(that|which|who|where|when)\b/i.test(core.slice(0, md.index)); /* "should" only inside the relative clause */
  }
  function coreOk(core, promptText) {
    core = String(core || '').trim();
    return nWords(core) >= 3 && !/^\s*\w+ing\b/i.test(core) && !/\bbecause\b(?! of)/i.test(core) && coreClauseOk(core) && !(promptText && lower(promptText).indexOf(lower(core).replace(/[.]$/, '')) >= 0 && core.split(/\s+/).length > 5);
  }
  function positionOk(v) { var pos = read(v || '').text; return nWords(v) >= 5 && (POSITION.test(pos) || STANCE.test(pos)); }
  var SH_VERBS = {};
  ('add allow ban block boost bring build buy calm carry cause change charge check choose clean close connect control cool cost create cut damage decide drive earn ease eat encourage end fill find fix force free fund get give go come see feel grow harm heat help hold hurt improve increase invest join keep kill learn leave let limit live lose lower make meet move offer open pay plan prevent protect provide pull push put raise read reduce remove repair rest ride run save sell send share show sleep spend start stay stop study support take tax teach tell think train travel use visit walk waste watch work write').split(' ').forEach(function (w) { SH_VERBS[w] = 1; });
  var ING_SPECIAL = { travel: 'travelling', control: 'controlling', patrol: 'patrolling', cancel: 'cancelling', label: 'labelling', fuel: 'fuelling', model: 'modelling', level: 'levelling', admit: 'admitting', commit: 'committing', permit: 'permitting', forget: 'forgetting', begin: 'beginning', refer: 'referring', prefer: 'preferring', occur: 'occurring' };
  function ingOf(v) {
    v = v.toLowerCase();
    if (ING_SPECIAL[v]) return ING_SPECIAL[v];
    if (/ie$/.test(v)) return v.slice(0, -2) + 'ying';
    if (/(ee|ye|oe)$/.test(v)) return v + 'ing';
    if (/[^aeiou]e$/.test(v)) return v.slice(0, -1) + 'ing';
    if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(v)) return v + v.slice(-1) + 'ing';
    return v + 'ing';
  }
  function verbBase(w) {
    w = String(w || '').toLowerCase();
    if (SH_VERBS[w]) return w;
    var c = [/ies$/.test(w) ? w.slice(0, -3) + 'y' : '', /(ches|shes|sses|xes|zes|oes)$/.test(w) ? w.slice(0, -2) : '', /s$/.test(w) ? w.slice(0, -1) : ''];
    for (var i = 0; i < c.length; i++) if (c[i] && SH_VERBS[c[i]]) return c[i];
    return '';
  }
  var SH_SUBJ = /^(it|this|that|they|these|those|which|we|people|he|she|(the|this) (rule|ban|law|policy|plan|idea|change|tax|scheme))\s+/i;
  var SH_AUX = /^(can|will|would|could|may|might|should|must|does|do|did)\s+/i;
  /* her mechanism → an -ing phrase: "it cuts smoke" → "cutting smoke"; "less car smoke" → "leading to less car smoke" */
  function mechFix(v) {
    var s0 = clip(v).replace(/^(by|through)\s+/i, '').replace(/^to\s+/i, ''), s = s0.replace(SH_SUBJ, '').replace(SH_AUX, ''), hadSubj = s !== s0;
    if (/^(not|never|no longer)\b/i.test(s) || /^(is|are|was|were|has|have|had|be|been)\b/i.test(s)) return '';
    var m = /^([A-Za-z]+)\b(.*)$/.exec(s); if (!m) return '';
    var b = verbBase(m[1]);
    if (b) return ingOf(b) + m[2];
    /* after a subject ("people go …") the next word is a verb, even one not on the list */
    if (hadSubj && m[1].length > 1) { var w = m[1].toLowerCase(); return ingOf(/[^s]s$/.test(w) && w.length > 3 ? w.slice(0, -1) : w) + m[2]; }
    return 'leading to ' + lowFirst(clip(v));
  }
  var SH_NOM = { ban: 'a ban on', restrict: 'limits on', limit: 'limits on', reduce: 'the reduction of', use: 'the use of', allow: 'permission for', tax: 'a tax on', charge: 'charges for', remove: 'the removal of', close: 'the closure of', protect: 'the protection of', control: 'control of', teach: 'the teaching of', build: 'the building of', fund: 'funding for', support: 'support for', invest: 'investment in', introduce: 'the introduction of', provide: 'the provision of' };
  var SH_PP = { banned: 'ban', restricted: 'restrict', limited: 'limit', reduced: 'reduce', used: 'use', allowed: 'allow', taxed: 'tax', charged: 'charge', removed: 'remove', closed: 'close', protected: 'protect', controlled: 'control', taught: 'teach', built: 'build', funded: 'fund', supported: 'support', introduced: 'introduce', provided: 'provide' };
  /* one repair at a time, until the Core Topic passes (or no rule applies) */
  function coreStep(v) {
    var m, s = clip(v);
    if (!coreClauseOk(s) && (m = /^(.*?)\s*\b(should|must)\s+(not\s+)?(be\s+)?([A-Za-z]+)\b\s*(.*)$/i.exec(s))) {
      var subj = clip(m[1]), verb = m[5].toLowerCase(), rest = clip(m[6]);
      if (m[3]) return '';
      if (m[4] && SH_PP[verb] && SH_NOM[SH_PP[verb]] && subj) return SH_NOM[SH_PP[verb]] + ' ' + lowFirst(subj) + (rest ? ' ' + rest : '');
      if (!m[4] && SH_NOM[verb] && rest) return SH_NOM[verb] + ' ' + rest;
      if (!m[4] && SH_VERBS[verb] && subj) return lowFirst(subj) + ' ' + ingOf(verb) + (rest ? ' ' + rest : '');
      return '';
    }
    if ((m = /^(\w+)ing\b\s*(.*)$/i.exec(s)) && m[1].length > 1) {
      var nb = verbBase(m[1]) || verbBase(m[1] + 'e') || verbBase(m[1].replace(/(.)\1$/, '$1'));
      if (nb && SH_NOM[nb] && m[2]) return SH_NOM[nb] + ' ' + m[2];
      return 'the practice of ' + lowFirst(s);
    }
    if ((m = /\b(because|which|that|when)\b/i.exec(s)) && m.index > 0 && !coreClauseOk(s)) return clip(s.slice(0, m.index));
    if (nWords(s) < 3) return 'the issue of ' + lowFirst(s);
    return '';
  }
  function coreFix(v, promptText) {
    var s = clip(v);
    for (var i = 0; i < 4; i++) { if (coreOk(s, promptText)) return s; s = coreStep(s); if (!s) return ''; }
    return coreOk(s, promptText) ? s : '';
  }
  var LIMIT = /\b(leaves? out|neglect\w*|den(y|ies|ied)|erod\w*|puts? (most|all|the)|goes back|took away|takes? away|fake|most|often|unlimited|constant\w*|purely|strictly|exclusive\w*|narrow|leads? to|produces?|builds? up|no|not|only|some|few|fewer|less|least|hurts?|harms?|costs?|costly|expensive|cheap\w*|problems?|difficult|hard|risks?|may|might|can|could|lose|loses|losing|without|too|never|cannot|unless|if|when|still|but|lacks?|fails?|miss\w*|unfair|weak\w*|limit\w*|small|little|poor\w*|slow\w*|danger\w*|depends?|except|while|although|though|however|rather|instead|second|another|also|other)\b|n't\b/i;
  function shapeCheck(key, value, promptText, type) {
    var v = String(value || '').trim(), k = shapeKind(key), n = nWords(v), out = { ok: true, soft: false, tip: '', fix: '' };
    if (!v) return out;
    function fail(tip, fix) { out.ok = false; out.tip = tip; out.fix = fix && clip(fix) !== clip(v) ? fix : ''; return out; }
    function soft(tip, fix) { out.soft = true; out.tip = tip; out.fix = fix || ''; return out; }
    if (k === 'core') {
      if (coreOk(v, promptText)) return out;
      var cw = v.match(/\b(because|which|that|when)\b/i);
      return fail(/^\s*\w+ing\b/i.test(v) ? 'Start with a noun, not an -ing verb: "the ban on …", "the use of …".'
        : /\b(should|must)\b/i.test(v) && !coreClauseOk(v) ? 'Take out "should" / "must": the Core Topic names the issue. Your answer goes in the Position box.'
        : cw ? 'Cut the "' + cw[0].toLowerCase() + ' …" part: a Core Topic is one noun phrase, with no clause.'
        : n < 3 ? 'Too short: a Core Topic needs three or more words.' : 'Do not copy the prompt: name the issue in your own short noun phrase.', coreFix(v, promptText));
    }
    if (k === 'facet') return n >= 2 ? out : fail('Too short: use two or more words, like "the cost of …" or "the health of …".', 'the issue of ' + lowFirst(clip(v)));
    if (k === 'mech') {
      if (MECH_OK.test(v)) return out;
      var mf = mechFix(v);
      return fail('Start with an -ing verb ("cutting …", "making …") or with by + -ing ("by giving …"). Say HOW it works.', mf && MECH_OK.test(mf) ? mf : '');
    }
    if (k === 'ex') return n >= 2 ? out : fail('Too short: name something real in two or more words, like "bus lanes in Seoul" or "a school canteen in Bangkok".', /^[A-Z]/.test(v) ? '' : clip(v) + ' in Bangkok');
    if (k === 'nuance') {
      if (n < 5) return fail('Too short: use five or more words that limit the idea (who it does not help, when it does not work, what it costs).', 'this does not always work: ' + lowFirst(clip(v)));
      if (!LIMIT.test(v) && !NUANCE.test(v) && !(type === 'PROBLEM' && key === 'nuanceA')) return soft('Five words: good. Now make it a limit: who it does not help, or when it does not work ("… but only if …", "it does not help …").');
      return out;
    }
    if (k === 'position') {
      if (positionOk(v)) return out;
      var s = clip(v), first = (s.match(/^[A-Za-z]+/) || [''])[0].toLowerCase(), pf = '';
      if (/^(should|must|need to|have to)\b/i.test(s)) pf = 'I believe that we ' + s.charAt(0).toLowerCase() + s.slice(1);
      else if (SH_VERBS[first]) pf = 'I believe that we should ' + lowFirst(s);
      else if (nWords(s) >= 3 && !/^(i|in my|this essay)\b/i.test(s)) pf = 'I believe that ' + lowFirst(s);
      return fail('Make it a full sentence with your stance: "I believe that …", "… should …", "… outweigh …".', pf && positionOk(pf) ? pf : '');
    }
    if (k === 'rationale') {
      if (n < 3) return soft('Give one full reason in three or more words. It often starts with "because …".', /^because\b/i.test(v) ? '' : 'because ' + lowFirst(clip(v)));
      return out;
    }
    return out;
  }
  function exLevel(l) { return l === 'A1' || l === 'A2' ? 'A2' : l === 'B1' || l === 'B2' || l === 'C1' ? l : 'B2'; }
  function shapeExamples(key, level, p) {
    var lv = exLevel(level), mine = {}, out = [];
    p = p || {};
    ['A2', 'B1', 'B2', 'C1'].forEach(function (l) { var x = p.vars && p.vars[l] && p.vars[l][key]; if (x && x.ok) mine[lower(clip(x.ok))] = 1; });
    var all = (C.PROMPTS || []).filter(function (q) { return q.id !== p.id && q.vars && q.vars[lv] && q.vars[lv][key] && q.vars[lv][key].ok; });
    all.filter(function (q) { return q.type === p.type; }).concat(all.filter(function (q) { return q.type !== p.type; })).forEach(function (q) {
      var t = clip(q.vars[lv][key].ok), c = shapeCheck(key, t, q.text, q.type);
      if (mine[lower(t)] || !c.ok || c.soft) return;
      out.push({ text: t, from: q.title, level: lv });
    });
    return out;
  }

  /* -------------------------------------- one next step per red row (WP7)
     nextStep(row, pre, level) → { text, sub, link } | null. One concrete action
     at her level and, where a lesson teaches it, the lesson to open. */
  var STEP_LESSON = { m01s3: 'M01 · Parts of the question', m02s1: 'M02 · What a position is', m02s2: 'M02 · Position at both ends', m04s1: 'M04 · Mechanism', m04s2: 'M04 · Example', m04s3: 'M04 · Nuance',
    m05s1: 'M05 · Four frames', m05s3: 'M05 · Own the frame', m06s3: 'M06 · The conclusion', m07s1: 'M07 · Reference words', m07s2: 'M07 · Linker Detox', m10s3: 'M10 · Register', m11s2: 'M11 · Agreement', m12s2: 'M12 · Weigh, do not list', m12s3: 'M12 · Problem and two-part' };
  function nextStep(r, pre, level) {
    if (!r || r.status === 'ok') return null;
    pre = pre || {};
    var easy = level !== 'B2' && level !== 'C1', id = r.id, bw = pre.bodyWords || [], m = /^b(\d)(mech|ex|nu|len)$/.exec(id);
    var body = m ? 'Body ' + (Number(m[1]) + 1) : '';
    function st(e, f, sub) { return { text: easy || !f ? e : f, sub: sub || '', link: sub ? 'Lesson ' + STEP_LESSON[sub] : '' }; }
    if (id === 'length') {
      if (r.status === 'warn') return st('Cut the weakest sentence in your longest body paragraph.', 'Cut the weakest sentence in each body paragraph; keep the mechanism, the example and the nuance.');
      var need = Math.max(1, 250 - (pre.words || 0));
      if (!bw.length) return st('Write all four paragraphs first: introduction, two body paragraphs, conclusion.', '', 'm05s1');
      var si = 0; bw.forEach(function (w, i) { if (w < bw[si]) si = i; });
      var nm = 'Body ' + (si + 1) + ' (' + bw[si] + ' words)';
      return need <= 45
        ? st('Add one example sentence to your shorter body paragraph, ' + nm + '. Start it with "For example, in …" and name a real place. You need about ' + need + ' more words.', 'Develop your shorter body paragraph, ' + nm + ': add one concrete example sentence (a named place, school or policy). About ' + need + ' more words are needed.', 'm04s2')
        : st('Add two sentences to each body paragraph: one example ("For example, in …") and one limit ("However, …"). You need about ' + need + ' more words.', 'Each body paragraph needs about ' + Math.ceil(need / 2) + ' more words: add a concrete example and a nuance sentence to each.', 'm04s2');
    }
    if (id === 'bullets') return st('Turn each line into a full sentence, and join the sentences into paragraphs.', '', 'm05s1');
    if (id === 'paras') return (pre.paras || 0) < 4
      ? st('Make four paragraphs: introduction, Body 1, Body 2, conclusion. Write in every box, or leave an empty line between paragraphs.', '', 'm05s1')
      : st('Join the extra paragraphs: keep two body paragraphs, one idea in each.', '', 'm05s1');
    if (id === 'verdict') return st('Add this to your first and your last paragraph: "the benefits outweigh the drawbacks" (or the other way round).', 'State the verdict in the introduction and again in the conclusion: "… clearly outweigh …".', 'm12s2');
    if (id === 'extent') return st('Say how far you agree in paragraph one: "I largely agree that …" or "I agree only if …".', '', 'm02s1');
    if (id === 'twopart') return st('Answer question 1 in Body 1 and question 2 in Body 2.', '', 'm12s3');
    if (id === 'position') return /^No clear/.test(r.label)
      ? st('Add one sentence to paragraph one: "I believe that …" or "This essay argues that …".', '', 'm02s1')
      : /only at the end/.test(r.label) ? st('Put your view in paragraph one too, in new words: "This essay argues that …".', '', 'm02s2')
      : st('Add one sentence to the conclusion: "For these reasons, I believe that …".', '', 'm02s2');
    if (id === 'coverage') { var miss = String(r.label).split(': ')[1] || ''; return st('Use the word "' + miss.split(', ')[0] + '" (or a word that means the same) in each body paragraph.', '', 'm01s3'); }
    if (id === 'plural-c') return st('Add a second cause, for example in Nuance A: "A second cause is …".', '', 'm01s3');
    if (id === 'plural-s') return st('Add a second measure, for example in Nuance B: "A second step is …".', '', 'm01s3');
    if (id === 'parts') return st('Write both parts: the cause in Body 1, and a solution that answers it in Body 2.', '', 'm12s3');
    if (m && m[2] === 'mech') return st('In ' + body + ', after your first sentence, say how it works: "This is because …" or "… by + -ing …".', '', 'm04s1');
    if (m && m[2] === 'ex') return st('In ' + body + ', add one sentence: "For example, in Bangkok, …". Name a real place, school or rule.', '', 'm04s2');
    if (m && m[2] === 'nu') return st('In ' + body + ', add one sentence: "However, this does not help …".', '', 'm04s3');
    if (m && m[2] === 'len') return /only/.test(r.label) ? st('Add one example sentence to ' + body + '.', '', 'm04s2') : st('Keep one idea in ' + body + ': cut the weakest sentence.', '');
    if (id === 'linkers') return st('Start two sentences without Firstly / Moreover / However. Begin with "This …" instead.', '', 'm07s2');
    if (id === 'reference') return st('Change one repeated noun to "this …" or "such …": "This rule …", "Such measures …".', '', 'm07s1');
    if (id === 'cliche') return st('Delete the phrase and say the idea in your own simple words.', '', 'm10s3');
    if (id === 'unverifiable') return st('Change "research shows" to a real case: "In Bangkok, …".', '', 'm04s2');
    if (id === 'ban0') return st('Write the full form: "do not", "it is", "cannot".', '', 'm10s3');
    if (id === 'ban1') return st('Change the informal word: "children", "many", "a great deal of".', '', 'm10s3');
    if (id === 'ban2') return st('Change "!" to a full stop.', '');
    if (id === 'ban3') return st('Change "you" to "people", "students" or "families".', '', 'm10s3');
    if (id === 'rhetorical') return st('Change the question into a statement.', '');
    if (id === 'repeat') return st('Change some of the repeated words to "this …" or another word with the same meaning.', '', 'm07s1');
    if (id === 'ipron') return st('Keep "I" for paragraphs one and four. In the body, use "people", "students" or "governments".', '');
    if (id === 'lang') return st('Read each hint, find the words in your essay, and fix one slip at a time.', '', 'm11s2');
    if (id === 'template') return st('First make your eleven variables longer, in your own words: add who, where or how much to each one. Longer variables lower the share. Lower your spellbook share only after that.',
      'Lengthen the variables in your own words (who, where, how much) before you lower the spellbook share: the share falls as your own words grow.', 'm05s3');
    if (id === 'newidea') return st('Delete the new idea from the conclusion, or move it into a body paragraph.', '', 'm06s3');
    return null;
  }

  /* ---------------------------------------------------------------- UI */
  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }

  function pctOf(a, b) { return b ? Math.round(100 * a / b) : 0; }
  function hashStr(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 9973; return h; }
  /* The Type Switch Card (B15, 18 Oct 2026). On a phone the full five-row table pushed the essay
     boxes far down the page, so a phone shows only this prompt's row, with a tap for the rest. */
  function switchBlock(type) {
    var full = T.switchCard(type); if (!full) return '';
    var L = global.LabContent, r = ((L && L.TYPE_SWITCH) || []).filter(function (x) { return x.id === type; })[0];
    if (!r) return full;
    var lb = [['Facet A', r.a], ['Nuance A', r.na], ['Facet B', r.b], ['Nuance B', r.nb], ['Position says', r.pos], ['Easy to miss', r.trap]];
    return '<div class="wr-switch"><div class="card wr-switch-mini" id="wr-switch-mini"><p class="kicker">Type Switch Card · this prompt</p><b class="wr-switch-name">' + esc(r.name) + '</b>' +
      '<dl class="wr-switch-dl">' + lb.map(function (x) { return '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<button type="button" class="btn sm ghost wr-switch-more" id="wr-switch-more" aria-expanded="false" aria-controls="wr-switch-full">Show all five types</button></div>' +
      '<div class="wr-switch-full" id="wr-switch-full">' + full + '</div></div>';
  }
  /* Frame words in a paragraph: runs of 3+ words copied from the frame (between its slots). */
  function frameMarks(text, frameTexts) {
    var toks = String(text || '').split(/(\s+)/), idx = [], norm = [];
    toks.forEach(function (t, i) { if (/\S/.test(t)) { idx.push(i); norm.push(t.toLowerCase().replace(/[^a-z0-9']+/g, '')); } });
    var mark = new Array(norm.length), segs = [];
    frameTexts.forEach(function (ft) { String(ft || '').split(/\{\w+\}/).forEach(function (sg) { var w = sg.toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean); if (w.length >= 3) segs.push(w); }); });
    segs.forEach(function (sw) {
      for (var i = 0; i < norm.length; i++) for (var j = 0; j < sw.length; j++) {
        var k = 0; while (i + k < norm.length && j + k < sw.length && norm[i + k] && norm[i + k] === sw[j + k]) k++;
        if (k >= 3) for (var q = 0; q < k; q++) mark[i + q] = 1;
      }
    });
    var n = 0; for (var z = 0; z < mark.length; z++) if (mark[z]) n++;
    return { toks: toks, idx: idx, mark: mark, frame: n, total: norm.length };
  }
  /* ------------------------------------------- her own sentence (WP11a, 19 Oct 2026)
     In guided mode Submit waits for one sentence of her own in every paragraph. The old test
     (three words changed) let "This is my own sentence about this part of the essay." through,
     so a sentence now counts as hers only if it passes all five tests:
       1 six words or more ('short');
       2 not filler ('filler'): not a stock line, no talk about the writing itself ("my own
         sentence", "this part of the essay"), and at least two words that carry meaning
         (not "is", "very", "important", "people", "today" …);
       3 not the frame ('frame'): at most half of its content words come from any one frame
         sentence of that paragraph, and it is not a filled frame sentence with a word or two
         changed;
       4 at least one word of her own plan for that paragraph ('plan'): her matrix boxes for the
         paragraph's slots and the Core Topic (in a revision also the words of her first essay
         that were not frame words);
       5 not a near-copy of another of her own sentences ('dup').
     ownTest(s, ctx, mine) → { ok, why:[…], c:{stem:1}, old } — tolerant word matching: plurals,
     -ing / -ed and the first five letters ("tourists" meets "tourism"). */
  var OWN_FUNC = {}, OWN_VAGUE = {};
  ('a an the and or but nor so yet for of to in on at by with from into onto over under about after before during than then as if when while because since although though this that these those it its they them their theirs there here we us our ours you your yours i me my mine myself he she him her his hers is isn are aren was wasn were be been being am do does doesn did didn done doing have has had having can cannot could will would shall should may might must not no yes very also too just only more most much many some any all each every such own same other others another one ones which who whom whose what where how why whether up down out off again still even ever never always often well really quite rather etc get gets got getting make makes made making go goes went going let lets put puts take takes took everyone everybody someone something anything everything nothing somebody anyone way ways lot lots kind sort thing things like').split(' ').forEach(function (w) { OWN_FUNC[w] = 1; });
  ('people person part parts essay sentence paragraph idea ideas point points word words frame box topic issue issues problem problems question today nowadays world life society good bad big great important true agree disagree think believe feel opinion view views side sides reason reasons example examples matter time day days interesting necessary different number many thing everyone sure clear').split(' ').forEach(function (w) { OWN_VAGUE[w] = 1; });
  var OWN_META = /\b(my own (sentence|sentences|words|idea|ideas|writing|paragraph|essay)|(this|that|my) (sentence|paragraph|box|frame)\b|this part|part of (the|this|my) essay|own words|in my words|i (wrote|have written|changed|write)\b)/i;
  var OWN_STOCK = ['this is my own sentence about this part of the essay', 'this is my own sentence', 'this sentence is in my own words', 'i wrote this sentence myself',
    'this is a very important topic for everyone', 'there are many good and bad points about this', 'many people have different opinions about this topic', 'this is a good idea for many people'];
  function ownToks(s) { return lower(plain(s)).replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).map(function (w) { return w.replace(/^'+|'+$/g, '').replace(/'s$/, ''); }).filter(Boolean); }
  function ownStem(w) {
    w = w.replace(/'/g, '');
    if (w.length > 4 && /ies$/.test(w)) w = w.slice(0, -3) + 'y';
    else if (w.length > 4 && /(ss|x|ch|sh)es$/.test(w)) w = w.slice(0, -2);
    else if (w.length > 3 && /[^s]s$/.test(w)) w = w.slice(0, -1);
    if (w.length > 5 && /ing$/.test(w)) { w = w.slice(0, -3); if (/([^aeiou])\1$/.test(w)) w = w.slice(0, -1); }
    else if (w.length > 5 && /ed$/.test(w)) w = w.slice(0, -2);
    return w.length > 5 ? w.slice(0, 5) : w;
  }
  /* c: every content word (stems); sub: the ones that carry meaning (not vague) */
  function ownContent(s) {
    var c = {}, sub = {};
    ownToks(s).forEach(function (w) {
      if (OWN_FUNC[w]) return;
      var st = ownStem(w); if (!st) return;
      c[st] = 1; if (!OWN_VAGUE[w] && !OWN_VAGUE[st]) sub[st] = 1;
    });
    return { c: c, sub: sub };
  }
  function nKeys(o) { return Object.keys(o).length; }
  function overlap(a, b) { return Object.keys(a).filter(function (k) { return b[k]; }).length; }
  function jaccard(a, b) { var i = overlap(a, b), u = nKeys(a) + nKeys(b) - i; return u ? i / u : 0; }
  function symDiff(a, b) { return nKeys(a) + nKeys(b) - 2 * overlap(a, b); }
  var STOCK_C = null;
  function hasSeq(tk, sg) {
    for (var i = 0; i + sg.length <= tk.length; i++) { var j = 0; while (j < sg.length && tk[i + j] === sg[j]) j++; if (j === sg.length) return true; }
    return false;
  }
  /* a frame sentence for ownTest: its content words, and its runs of 2+ frame words between slots */
  function frameSent(s) {
    var o = ownContent(s.replace(/\{\w+\}/g, ' ')), segs = s.split(/\{\w+\}/).map(ownToks).filter(function (x) { return x.length >= 2; });
    o.segs = segs.reduce(function (n, x) { return n + x.length; }, 0) >= 3 ? segs : [];
    return o;
  }
  function isStock(s) {
    if (!STOCK_C) STOCK_C = OWN_STOCK.map(function (x) { var o = {}; ownToks(x).forEach(function (w) { o[w] = 1; }); return o; });
    var me = {}; ownToks(s).forEach(function (w) { me[w] = 1; });
    return STOCK_C.some(function (x) { return jaccard(me, x) >= 0.75; });
  }
  /* ctx: { raw:[{c}] frame sentences without their slots, filled:[{c}] the frame filled with her
     plan, plan:{stem:1}|null (null = no plan rule, e.g. exam mode), old:[{c}]|null (revision) } */
  function ownTest(s, ctx, mine) {
    var why = [], k = ownContent(s), c = k.c, nc = nKeys(c);
    if (words(s) < 6) why.push('short');
    if (isStock(s) || OWN_META.test(plain(s)) || nKeys(k.sub) < 2) why.push('filler');
    var fr = (ctx.raw || []).some(function (f) { return nc && overlap(c, f.c) / nc > 0.5; }) || (ctx.filled || []).some(function (f) { return symDiff(c, f.c) < 3; });
    /* without her plan (exam mode, or a revision opened without it) a filled frame sentence is
       found by its frame words: every frame segment of one frame sentence, in order */
    if (!fr && !(ctx.filled && ctx.filled.length)) {
      var tk = ownToks(s);
      fr = (ctx.raw || []).some(function (f) { return f.segs && f.segs.length && f.segs.every(function (sg) { return hasSeq(tk, sg); }); });
    }
    if (fr) why.push('frame');
    if (ctx.plan && !Object.keys(k.sub).some(function (x) { return ctx.plan[x]; })) why.push('plan');
    if ((mine || []).some(function (m) { return jaccard(c, m) >= 0.7; })) why.push('dup');
    var old = !!(ctx.old && ctx.old.some(function (o) { return jaccard(c, o.c) >= 0.7 || symDiff(c, o.c) < 3; }));
    return { ok: !why.length, why: why, c: c, old: old, s: s };
  }

  /* ------------------------------------------------ what the report carries (19 Oct 2026)
     Writer.lastMeta() → for the essay just submitted (reset when an essay starts):
       { ownShare 0..1 (share of words that are hers, not frame), ownSentences n, fillUsed,
         landTaps { wardKey: 1 | 0 } (1 = the app agreed with her first tap), landAgree 0..1 | null,
         revisionOf (report id | ''), reviseRow (row key | '') } */
  var LAST = null;
  function blankMeta(cfg) { return { ownShare: 0, ownSentences: 0, fillUsed: false, landTaps: {}, landAgree: null, revisionOf: (cfg && cfg.revisionOf) || '', reviseRow: (cfg && cfg.reviseRow) || '' }; }
  function lastMeta() { return JSON.parse(JSON.stringify(LAST || blankMeta())); }
  /* Which paragraph a weak Ward row belongs to (-1: any paragraph). ps = her paragraphs. */
  function reviseTarget(id, row, pre, ps) {
    var n = ps.length; if (!n) return -1;
    var lastI = n - 1, b1 = Math.min(1, lastI), b2 = Math.min(2, Math.max(0, n - 2)), m = /^b(\d)(mech|ex|nu|len)$/.exec(id || ''), lb = row ? String(row.label) : '';
    if (m) return Math.min(Math.max(0, n - 2), 1 + Number(m[1]));
    if (id === 'position') return /not restated/i.test(lb) ? lastI : 0;
    if (id === 'verdict' || id === 'extent') return 0;
    if (id === 'newidea') return lastI;
    if (id === 'plural-c' || id === 'coverage') return b1;
    if (id === 'twopart' || id === 'plural-s') return b2;
    if (id === 'parts') return /No causes/i.test(lb) ? b1 : b2;
    /* too short: the shorter body paragraph grows; too long: the longer one is cut */
    if (id === 'length' && pre && pre.bodyWords && pre.bodyWords.length) { var long = row && row.status === 'warn', si = 0; pre.bodyWords.forEach(function (w, i) { if (long ? w > pre.bodyWords[si] : w < pre.bodyWords[si]) si = i; }); return Math.min(lastI, 1 + si); }
    var q = /"([^"]{3,})"/.exec(lb);
    if (q) { for (var i = 0; i < n; i++) if (lower(plain(ps[i])).indexOf(lower(q[1])) >= 0) return i; }
    return -1;
  }
  /* ------------------------------------------- the Landing Check you can check (WP13)
     In guided and skeleton modes a Ward that can be judged on one sentence asks her to tap that
     sentence; the app checks the tap with a one-sentence version of the Ward's own test. */
  function sentPosition(s) {
    var t = read(s).text;
    if (!(POSITION.test(t) || STANCE.test(t))) return false;
    if (HEDGE.test(t) && !EXPLICIT.test(t)) return false;
    if (DEBATE.test(t) && !EXPLICIT.test(t)) {
      var rest = t.replace(/\b((some|many|other|most) people|others)\s+(think|believe|say|argue|feel|claim)\b[^,;.]*/gi, ' ');
      return POSITION.test(rest) || STANCE.test(rest);
    }
    return true;
  }
  function sentExample(s) { return EXAMPLE.test(read(s).text) || PROPER.test(plain(s)); }
  var TAPS = {
    position: { q: 'Which sentence in paragraph one gives your position?', inScope: function (j) { return j === 0; }, test: sentPosition,
      yes: 'Yes — that\'s your position.', no: 'Not quite: a position says what you think. Try again.', none: 'The app cannot find a position in paragraph one either. Add one: "I believe that …".' },
    moves: { q: 'Which sentence in a body paragraph is an example?', inScope: function (j, n) { return j > 0 && j < n - 1; }, test: sentExample,
      yes: 'Yes — that\'s an example.', no: 'Not quite: an example names something real, like a place, a school or a rule. Try again.', none: 'The app cannot find an example either. Add one: "For example, in Bangkok, …".' }
  };

  function mount(host, cfg) {
    var p = promptOf(cfg.prompt);
    var mode = cfg.mode || 'guided', guided = mode === 'guided', skeleton = mode === 'skeleton', exam = mode === 'exam';
    var tier = cfg.tier || 'B2', type = p.type || 'DISCUSS';
    /* guided mode is practice (60%); skeleton and exam use the chosen share or the track default */
    var share = guided ? 0.6 : (SHARES.indexOf(Number(cfg.share)) >= 0 ? Number(cfg.share) : tier === 'C1' ? 0.3 : 0.4);
    var shareOpts = { share: share, chosen: cfg.share, practice: guided };
    var level = cfg.level || tier;
    var minutes = cfg.minutes || 40, total = minutes * 60;
    var my = T.load(cfg.studentId); if (!my.choice) my.choice = {}; if (!my.custom) my.custom = {};
    /* Revise mode (19 Oct 2026): the result screen's "Revise your weakest row" passes the first
       essay back; only its weak paragraph has to gain a new sentence of her own. */
    var rt = cfg.reviseText, revise = !!(cfg.revisionOf && rt && (typeof rt === 'string' ? rt.trim() : rt.length));
    LAST = blankMeta(cfg);
    var state = { t0: Date.now(), left: total, done: false, revision: revise ? 1 : 0, tick: null, vars: {}, choice: {}, custom: {}, planTicks: {}, landTicks: {}, planOpen: !guided || revise, planOpenedAt: null,
      exLvl: exLevel(level), exIdx: {}, exCache: {}, fixes: {}, shapeT: {}, fillBase: {}, prevOpen: {}, relock: null, helped: {}, taps: {}, fillUsed: false, prefill: null };
    var paras = T.paragraphs(tier, type), labels = T.labels(type);
    paras.forEach(function (pg) { state.choice[pg.key] = my.choice[pg.key] || pg.frames[0].id; if (my.custom[pg.key]) state.custom[pg.key] = my.custom[pg.key]; });
    var PHASES = [['Decode', 0], ['Matrix', 90], ['Write', 300], ['Check', total - 300]];

    function frameOf(pg) { return pg.frames.filter(function (f) { return f.id === state.choice[pg.key]; })[0] || pg.frames[0]; }
    function frameText(pg) { return state.custom[pg.key] || frameOf(pg).text; }

    /* her first essay, by paragraph, and where it goes in the boxes */
    var old = { paras: [], boxes: [], text: '', sents: null, plan: {}, target: -1, row: null, step: null, pre: null };
    if (revise) {
      old.paras = (typeof rt === 'string' ? paragraphs(rt) : rt).map(function (x) { return String(x == null ? '' : x).trim(); }).filter(Boolean);
      old.text = old.paras.join('\n\n');
      old.boxes = exam ? [old.text] : old.paras.length <= paras.length ? old.paras.slice() : [old.paras[0], old.paras[1], old.paras.slice(2, -1).join('\n\n'), old.paras[old.paras.length - 1]];
      old.sents = sentences(old.text).map(function (s) { return ownContent(s); });
      var fset = {}; paras.forEach(function (pg) { var fc = ownContent(frameText(pg).replace(/\{\w+\}/g, ' ')).c; Object.keys(fc).forEach(function (k) { fset[k] = 1; }); });
      Object.keys(ownContent(old.text).sub).forEach(function (k) { if (!fset[k]) old.plan[k] = 1; });
      old.pre = preflight(old.text, p, shareOpts);
      old.row = (old.pre.rows || []).filter(function (r) { return r.id === cfg.reviseRow; })[0] || null;
      old.step = old.row ? nextStep(old.row, old.pre, level) : null;
      var ti = reviseTarget(cfg.reviseRow, old.row, old.pre, old.paras);
      /* an essay paragraph → its box (a five-paragraph essay puts body 2 and 3 into the second body box) */
      old.target = ti < 0 || exam ? ti : old.paras.length <= paras.length ? ti : ti === 0 ? 0 : ti === old.paras.length - 1 ? 3 : ti === 1 ? 1 : 2;
    }
    function boxName(i) { return exam ? 'paragraph ' + (i + 1) : (paras[i] || {}).name || 'paragraph ' + (i + 1); }
    function reviseStep() { return old.step && old.step.text ? old.step.text : 'Write one new sentence of your own: your reason, your example or your place.'; }
    function reviseNoteHtml() { return '<b>Revise this paragraph.</b> ' + esc(reviseStep()); }
    function reviseBanner() {
      var lb = old.row ? old.row.label : String(cfg.reviseRow || ''), where = old.target < 0 ? 'any paragraph' : exam ? 'paragraph ' + (old.target + 1) : 'the highlighted paragraph (' + boxName(old.target) + ')';
      return '<div class="card wr-revise-banner" id="wr-revise-banner"><p class="kicker">Revision · your first essay is in the boxes</p>' +
        (lb ? '<p><b>Your weakest row:</b> ' + esc(lb) + '</p>' : '') +
        (old.target < 0 || exam ? '<p class="wr-revise-step"><span class="pf-next-h">Next step:</span> ' + esc(reviseStep()) + '</p>' : '') +
        '<p class="tiny">Change ' + esc(where) + '. Submit opens when it has one new sentence of your own: write a new one, or rewrite an old one. Nothing else is locked.</p>' +
        '<p class="wr-revise-status" id="wr-revise-status" role="status" aria-live="polite"></p></div>';
    }

    var html = '<div class="wr' + (revise ? ' wr-revising' : '') + '"' + (revise ? ' data-revise-target="' + old.target + '"' : '') + '>' +
      '<div class="wr-top">' +
        '<button class="btn ghost sm" id="wr-quit">✕</button>' +
        '<div class="wr-phases" id="wr-phases">' + PHASES.map(function (ph, i) { return '<span data-i="' + i + '">' + ph[0] + '</span>'; }).join('') + '</div>' +
        '<span class="wr-words" id="wr-words">0 words</span>' +
        '<span class="wr-clock" id="wr-clock">' + mmss(total) + '</span>' +
      '</div>' +
      '<div class="wr-grid">' +
        '<div class="wr-left">' + Prompts.card(p, { demand: !exam }) +
          (!exam ? switchBlock(type) : '') +
          (!exam ? '<div class="card wr-plan"><div class="wr-boxh"><b>The matrix</b><span class="tiny">plan — not counted</span>' + (guided ? '<button class="btn sm" id="wr-fill">Fill the frames →</button>' : '') + '</div>' +
            '<p class="wr-fromcast hidden" id="wr-fromcast" role="status"></p>' +
            '<p class="tiny wr-plan-help">Not sure what a box wants? Tap <b>Show an example</b> under it. The examples come from other prompts, so the ideas for this one stay yours.</p>' +
            C.VARIABLES.map(function (v) { return '<div class="wr-planrow" data-row="' + v.key + '"><label for="wr-v-' + v.key + '" title="' + esc(v.hint) + '">' + v.n + ' · ' + esc(labels[v.key]) + '</label><input id="wr-v-' + v.key + '" data-var="' + v.key + '" placeholder="' + esc(v.hint) + '" autocomplete="off">' +
              '<div class="wr-help"><button type="button" class="wr-exbtn" data-ex="' + v.key + '" aria-expanded="false" aria-controls="wr-ex-' + v.key + '">Show an example</button><div class="wr-shape" id="wr-sh-' + v.key + '" aria-live="polite"></div></div>' +
              '<div class="wr-ex hidden" id="wr-ex-' + v.key + '"></div></div>'; }).join('') + '</div>' : '') +
          (!exam ? '<div class="card wr-wards" id="wr-planwards"><div class="wr-boxh"><b>The Plan Wards</b><span class="tiny" id="wr-planscore"></span></div><p class="tiny">Grey lines tick themselves from the eleven keys. The others are yours to tick honestly.</p><div id="wr-planlist"></div>' + (guided ? '<p class="tiny" id="wr-plannote">The paragraph boxes open when the Plan Wards are green, or after ten minutes. A red box in the matrix shows a "Fix my shape" tip: use it, and the Ward turns green.</p>' : '') + '</div>' : '') +
        '</div>' +
        '<div class="wr-right">' + (revise ? reviseBanner() : '') +
          (exam
            ? '<div class="wr-box"><textarea id="wr-t0" rows="22" spellcheck="false" placeholder="Write your essay here. Leave a blank line between paragraphs. At least 250 words."></textarea></div>'
            : paras.map(function (pg, i) {
                var fr = frameOf(pg);
                return '<div class="wr-box' + (revise && old.target === i ? ' wr-revise-target' : '') + '" data-para="' + pg.key + '"><div class="wr-boxh"><b>' + esc(pg.name) + '</b><span class="tiny">~' + pg.target + ' words · <i id="wr-w' + i + '">0</i></span>' +
                  (guided ? '<select class="wr-frame-pick" data-pick="' + pg.key + '">' + pg.frames.map(function (f) { return '<option value="' + f.id + '"' + (f.id === fr.id ? ' selected' : '') + '>' + esc(f.name) + '</option>'; }).join('') + '</select><button class="linky" data-card="' + i + '">frame</button>' : '') + '</div>' +
                  (guided ? '<div class="wr-card hidden" id="wr-card' + i + '"><b>Frame · edit it into your own words</b><textarea class="wr-frame" data-frame="' + pg.key + '" rows="4" spellcheck="false">' + esc(frameText(pg)) + '</textarea><p class="tiny">Slots: ' + T.tokens(frameText(pg)).map(function (k) { return '{' + esc(labels[k] || k) + '}'; }).join(' · ') + '</p></div>' : '') +
                  (skeleton ? '<p class="tiny wr-skel">' + pg.slots.map(function (k) { return '[' + esc(labels[k] || k) + ']'; }).join(' → ') + '</p>' : '') +
                  (revise && old.target === i ? '<p class="wr-revise-note" id="wr-revise-note">' + reviseNoteHtml() + '</p>' : '') +
                  '<textarea id="wr-t' + i + '" rows="' + (i === 0 || i === 3 ? 4 : 6) + '" spellcheck="false" placeholder="' + esc(pg.name) + ' …"></textarea>' +
                  (guided ? '<div class="wr-meter" id="wr-m' + i + '" aria-live="polite"></div><div class="wr-prev hidden" id="wr-prev' + i + '"></div>' : '') + '</div>';
              }).join('')) +
          '<div class="qfoot"><span class="tiny" id="wr-note">Checks, not marks: the panel looks at structure only.</span><span class="grow"></span>' +
          '<button class="btn primary" id="wr-check">Check the Ten Wards →</button></div>' +
          (!exam ? '<p class="tiny wr-share" id="wr-share" aria-live="polite"></p>' : '') +
          '<div id="wr-panel"></div>' +
        '</div>' +
      '</div></div>';
    host.innerHTML = html;

    var areas = Array.prototype.slice.call(host.querySelectorAll('textarea[id^=wr-t]'));
    function text() { return exam ? areas[0].value : areas.map(function (a) { return a.value.trim(); }).filter(Boolean).join('\n\n'); }

    if (revise) areas.forEach(function (a, i) { a.value = old.boxes[i] || ''; });

    /* --- "Fill the frames" → her own sentences (WP7, WP11a). Frame words show grey under each box;
       in guided mode Submit waits until every paragraph has a sentence of her own (ownTest). */
    function paraTexts() { return exam ? paragraphs(areas[0].value) : areas.map(function (a) { return a.value.trim(); }); }
    /* an essay paragraph → the frame it was written from (exam: by position) */
    function frameIdx(j, n) { return !exam ? j : j === 0 ? 0 : j === n - 1 ? 3 : j === 1 ? 1 : 2; }
    function hasVars() { return Object.keys(state.vars).some(function (k) { return state.vars[k]; }); }
    function rawFrame(k) { return sentences(frameText(paras[k])).map(frameSent); }
    function filledFrame(k, j) {
      var out = exam ? [] : (state.fillBase[j] || []).slice();
      if (hasVars()) sentences(T.tidy(T.fill(frameText(paras[k]), state.vars))).forEach(function (s) { out.push(s); });
      return out.map(ownContent);
    }
    function planKeys(k) { var ks = T.tokens(frameText(paras[k])).concat(paras[k].slots, ['core']), seen = {}; return ks.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; }); }
    function planStems(k) {
      var out = {};
      planKeys(k).forEach(function (key) { Object.keys(ownContent(state.vars[key] || '').sub).forEach(function (x) { out[x] = 1; }); });
      if (revise) Object.keys(old.plan).forEach(function (x) { out[x] = 1; });
      return out;
    }
    /* one of her ideas for this paragraph, to name in the message: the shortest filled box */
    function planIdea(k) {
      var best = '', ks = planKeys(k), pick = ks.filter(function (key) { return key !== 'core' && clip(state.vars[key] || ''); });
      (pick.length ? pick : ks).forEach(function (key) { var v = clip(state.vars[key] || ''); if (v && (!best || nWords(v) < nWords(best))) best = v; });
      var w = best.split(/\s+/); return w.length > 6 ? w.slice(0, 6).join(' ') + ' …' : best;
    }
    function needMsg(res, k, noPlan) {
      if (noPlan) return 'Write your ideas for this paragraph in the matrix first, then use one of them in a sentence of your own.';
      var idea = planIdea(k), use = 'Use one of your own ideas' + (idea ? ', like “' + idea + '”,' : '') + ' in a sentence of your own.';
      function only(w) { return res.some(function (r) { return r.why.length === 1 && r.why[0] === w; }); }
      if (only('short')) return 'Your sentence is too short: use six words or more.';
      if (only('dup')) return 'Each paragraph needs its own new sentence: do not copy one from another paragraph.';
      var fl = res.filter(function (r) { return r.why.indexOf('filler') >= 0 && r.why.indexOf('frame') < 0; })[0];
      if (fl) { var fw = fl.s.split(/\s+/); return '“' + fw.slice(0, 5).join(' ') + (fw.length > 5 ? ' …' : '') + '” could go in any essay. ' + use; }
      return use;
    }
    /* the whole essay, paragraph by paragraph (order matters: a copy of an earlier own sentence is not new) */
    function ownReport() {
      var texts = paraTexts(), n = texts.length, mine = [], planReq = guided || revise;
      return texts.map(function (t, j) {
        if (!t) return null;
        var k = frameIdx(j, n), plan = planStems(k), noPlan = planReq && !nKeys(plan);
        var ctx = { raw: rawFrame(k), filled: filledFrame(k, j), plan: planReq || nKeys(plan) ? plan : null, old: revise ? old.sents : null };
        var ss = sentences(t), res = ss.map(function (s) { var r = ownTest(s, ctx, mine); if (r.ok) mine.push(r.c); return r; });
        var own = res.filter(function (r) { return r.ok; }).length, fresh = res.filter(function (r) { return r.ok && !r.old; }).length;
        var fm = frameMarks(t, [frameText(paras[k])]);
        var msg = own ? '' : needMsg(res, k, noPlan);
        var newMsg = fresh ? '' : own ? 'The sentences of your own here are from your first essay. Write one new sentence of your own here (you can rewrite an old one).' : msg;
        return { words: fm.total, frame: fm.frame, own: own, fresh: fresh, sents: ss, res: res, fm: fm, msg: msg, newMsg: newMsg };
      });
    }
    function paraState(i) { return ownReport()[i] || null; }
    function lockList() {
      if (!guided || revise) return [];
      var rep = ownReport(), out = [];
      rep.forEach(function (st, i) { if (st && st.own === 0) out.push({ name: boxName(i), msg: st.msg }); });
      return out;
    }
    /* revise mode: the one lock — a new sentence of her own in the weak paragraph (or in any) */
    function reviseLock() {
      if (!revise) return null;
      var rep = ownReport(), idx = old.target >= 0 ? [old.target] : rep.map(function (x, i) { return i; });
      if (idx.some(function (i) { return rep[i] && rep[i].fresh > 0; })) return null;
      var st = rep[idx[0]];
      return (old.target >= 0 ? boxName(old.target).charAt(0).toUpperCase() + boxName(old.target).slice(1) + ': ' : 'Any paragraph: ') + (st ? st.newMsg : 'Write in the paragraph first.');
    }
    function paintRevise() {
      var el = host.querySelector('#wr-revise-status'); if (!el) return;
      var why = reviseLock();
      el.className = 'wr-revise-status ' + (why ? 'need' : 'good');
      el.textContent = why ? why : '✓ A new sentence of your own is there. Check the Ten Wards, then submit.';
    }
    function paintMeter(i) {
      var el = host.querySelector('#wr-m' + i), pv = host.querySelector('#wr-prev' + i); if (!el) return;
      var st = paraState(i);
      if (!st) { el.className = 'wr-meter'; el.innerHTML = ''; if (pv) { pv.innerHTML = ''; pv.classList.add('hidden'); } return; }
      var need = st.own === 0 && !revise, open = !!state.prevOpen[i];
      el.className = 'wr-meter ' + (need ? 'need' : 'good');
      el.innerHTML = '<span class="wr-mbar" aria-hidden="true"><i style="width:' + pctOf(st.frame, st.words) + '%"></i></span>' +
        '<span class="wr-mtext"><b>' + st.frame + '</b> frame words · <b>' + (st.words - st.frame) + '</b> your words · ' + st.own + ' of ' + st.sents.length + ' sentence' + (st.sents.length === 1 ? '' : 's') + ' in your own words</span>' +
        (need ? '<span class="wr-mneed">' + esc(st.msg) + ' Submit stays locked until you do.</span>' : '') +
        (st.frame ? '<button type="button" class="linky wr-prevbtn" data-prev="' + i + '" aria-expanded="' + open + '" aria-controls="wr-prev' + i + '">' + (open ? 'Hide' : 'Show') + ' the frame words</button>' : '');
      if (pv) {
        pv.classList.toggle('hidden', !open || !st.frame);
        if (open) {
          var fm = st.fm, k = 0;
          pv.innerHTML = '<p class="tiny">Grey = still the frame. Dark = your words.</p><p class="wr-prev-t">' + fm.toks.map(function (t) { if (!/\S/.test(t)) return t; var m = fm.mark[k++]; return m ? '<span class="fw">' + esc(t) + '</span>' : esc(t); }).join('') + '</p>';
        }
      }
    }
    function paintMeters() { if (guided) paras.forEach(function (pg, i) { paintMeter(i); }); }
    var shareT = null;
    function paintShare() {
      var el = host.querySelector('#wr-share'); if (!el) return;
      var t = text(); if (words(t) < 20) { el.textContent = ''; el.className = 'tiny wr-share'; return; }
      var got = Math.round((T.ratio(t) || 0) * 100), sh = Math.round(share * 100), over = got > sh;
      var ch = SHARES.indexOf(Number(cfg.share)) >= 0 ? Math.round(Number(cfg.share) * 100) : 0;
      el.className = 'tiny wr-share' + (over ? ' over' : '');
      el.innerHTML = 'Frame share now: <b>' + got + '%</b> · ' + (guided ? 'practice limit ' + sh + '%' + (ch && ch !== sh ? ' (your spellbook: ' + ch + '%)' : '') : 'you chose ' + sh + '%') +
        (over ? '. To lower it, make your variables longer in your own words first.' : '.');
    }
    function countW() {
      var n = words(text());
      host.querySelector('#wr-words').textContent = n + ' words';
      if (!exam) areas.forEach(function (a, i) { var el = host.querySelector('#wr-w' + i); if (el) el.textContent = words(a.value); });
    }
    areas.forEach(function (a, i) { a.addEventListener('input', function () {
      countW(); paintMeters(); paintRevise(); if (state.relock) state.relock();
      clearTimeout(shareT); shareT = setTimeout(paintShare, 400);
    }); });
    host.querySelectorAll('[data-card]').forEach(function (b) { b.addEventListener('click', function () { host.querySelector('#wr-card' + b.dataset.card).classList.toggle('hidden'); }); });

    /* --- slot-shape help under each matrix box (WP6) */
    function exList(key) {
      var ck = key + ':' + state.exLvl;
      if (!state.exCache[ck]) state.exCache[ck] = shapeExamples(key, state.exLvl, p);
      return state.exCache[ck];
    }
    function exHtml(key, t) {
      var h = esc(t);
      if (shapeKind(key) === 'mech') h = h.replace(/^((by |through )?\w+ing)\b/i, '<b class="wr-ex-head">$1</b>');
      return '“' + h + '”';
    }
    function paintEx(key) {
      var box = host.querySelector('#wr-ex-' + key); if (!box) return;
      var list = exList(key), say = SHAPE_SAY[shapeKind(key)] || ['', ''];
      if (state.exIdx[key] == null) state.exIdx[key] = list.length ? hashStr(p.id + key) % list.length : 0;
      var i = list.length ? state.exIdx[key] % list.length : 0, e = list[i];
      box.innerHTML = '<p class="wr-ex-shape"><b>Shape: ' + esc(say[0]) + '.</b> ' + esc(say[1]) + '</p>' +
        (e ? '<p class="wr-ex-line">' + exHtml(key, e.text) + '</p><p class="tiny wr-ex-from">From another prompt, not this one: <i>' + esc(e.from) + '</i> · ' + e.level + ' · ' + (i + 1) + ' of ' + list.length + '. Copy the shape, not the words.</p>'
          : '<p class="tiny">No example at this level yet. Try another level.</p>') +
        '<div class="wr-ex-ctl">' + (list.length > 1 ? '<button type="button" class="btn sm" data-exnext="' + key + '">Another example</button>' : '') +
        '<span class="wr-ex-lv" role="group" aria-label="Level of the example">' + ['A2', 'B1', 'B2', 'C1'].map(function (l) { return '<button type="button" class="lvl-btn' + (l === state.exLvl ? ' on' : '') + '" data-exlvl="' + l + '" data-exkey="' + key + '" aria-pressed="' + (l === state.exLvl) + '">' + l + '</button>'; }).join('') + '</span></div>';
    }
    function paintShape(key, live) {
      var el = host.querySelector('#wr-sh-' + key), inp = host.querySelector('#wr-v-' + key); if (!el || !inp) return;
      var v = inp.value.trim(), c = shapeCheck(key, v, p.text, type), k = shapeKind(key);
      state.fixes[key] = '';
      if (!v) { el.className = 'wr-shape'; el.innerHTML = ''; inp.classList.remove('bad'); return; }
      if (c.ok && !c.soft) { el.className = 'wr-shape ok'; el.innerHTML = '✓ Right shape: ' + esc((SHAPE_SAY[k] || [''])[0]) + '.'; inp.classList.remove('bad'); return; }
      /* while she is typing, a new red tip waits for a pause or for her to leave the box */
      if (live && !/\b(bad|soft)\b/.test(el.className)) { el.className = 'wr-shape'; el.innerHTML = ''; return; }
      state.fixes[key] = c.fix;
      el.className = 'wr-shape ' + (c.ok ? 'soft' : 'bad'); inp.classList.toggle('bad', !c.ok);
      el.innerHTML = '<b>' + (c.ok ? 'Tip' : 'Fix my shape') + ':</b> ' + esc(c.tip) +
        (c.fix ? ' <span class="wr-try">Try: “' + esc(c.fix) + '”</span> <button type="button" class="btn sm wr-usefix" data-usefix="' + key + '">Use this</button><span class="tiny wr-try-note"> You can edit it after.</span>' : '');
    }
    host.querySelectorAll('[data-var]').forEach(function (inp) {
      var key = inp.dataset['var'];
      inp.addEventListener('input', function () {
        state.vars[key] = inp.value.trim(); paintPlanWards(); paintShape(key, true);
        clearTimeout(state.shapeT[key]); state.shapeT[key] = setTimeout(function () { paintShape(key, false); }, 1500);
      });
      inp.addEventListener('change', function () { clearTimeout(state.shapeT[key]); paintShape(key, false); });
    });
    /* one delegated listener on this essay's own root (the host outlives the essay) */
    var root = host.querySelector('.wr');
    root.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('button') : null; if (!b || !root.contains(b)) return;
      var d = b.dataset;
      if (d.ex) {
        var box = host.querySelector('#wr-ex-' + d.ex), show = box.classList.contains('hidden');
        if (show) { paintEx(d.ex); state.helped[d.ex] = (state.helped[d.ex] || 0) + 1; }
        box.classList.toggle('hidden', !show); b.setAttribute('aria-expanded', String(show)); b.textContent = show ? 'Hide the example' : 'Show an example';
      } else if (d.exnext) { state.exIdx[d.exnext] = (state.exIdx[d.exnext] || 0) + 1; paintEx(d.exnext); }
      else if (d.exlvl) { state.exLvl = d.exlvl; paintEx(d.exkey); }
      else if (d.usefix) {
        var inp = host.querySelector('#wr-v-' + d.usefix), fx = state.fixes[d.usefix]; if (!inp || !fx) return;
        inp.value = fx; state.vars[d.usefix] = fx; state.helped[d.usefix + ':fix'] = 1;
        paintPlanWards(); paintShape(d.usefix, false); inp.focus();
      } else if (d.prev) { var ix = Number(d.prev); state.prevOpen[ix] = !state.prevOpen[ix]; paintMeter(ix); }
      else if (d.openSub) {
        var H = global.PCHost; if (!H || !H.openSub) return;
        if (H.setReturn) H.setReturn('write');
        H.openSub(d.openSub);
      }
    });
    function planGreen() { var a = planWards(state.vars, p.text); return PLAN_WARDS.every(function (w) { return w.manual ? !!state.planTicks[w.id] : !!a[w.id]; }); }
    function openBoxes(why) {
      if (state.planOpen) return;
      state.planOpen = true; state.planOpenedAt = Math.round((Date.now() - state.t0) / 1000); state.planHow = why;
      host.querySelectorAll('.wr-box[data-para]').forEach(function (b) { b.classList.remove('wr-locked'); });
      var note = host.querySelector('#wr-plannote'); if (note) note.textContent = why === 'green' ? 'Plan Wards green: the boxes are open. Fill the frames, then write one sentence of your own in every paragraph, with one of your own ideas.' : 'Ten minutes are up: the boxes are open. Finish the plan as you write.';
    }
    function paintPlanWards() {
      var box = host.querySelector('#wr-planlist'); if (!box) return;
      var a = planWards(state.vars, p.text), n = PLAN_WARDS.filter(function (w) { return w.manual ? !!state.planTicks[w.id] : !!a[w.id]; }).length;
      box.innerHTML = wardList('plan', PLAN_WARDS, state.planTicks, a);
      host.querySelector('#wr-planscore').textContent = n + ' of ' + PLAN_WARDS.length;
      box.querySelectorAll('[data-ward]').forEach(function (cb) { cb.addEventListener('change', function () { state.planTicks[cb.dataset.ward] = cb.checked; paintPlanWards(); }); });
      if (guided && n === PLAN_WARDS.length) openBoxes('green');
    }
    if (guided && !revise) { host.querySelectorAll('.wr-box[data-para]').forEach(function (b) { b.classList.add('wr-locked'); }); }
    if (revise) { var pnote = host.querySelector('#wr-plannote'); if (pnote) pnote.textContent = 'Revision: the boxes are open. Your plan can still change.'; }
    /* E3 (19 Oct 2026): plan once. Her cast of this prompt in the Spellbook Workshop fills the
       matrix (in a revision, the plan of her first essay comes first). Every box stays editable. */
    if (!exam) {
      var pf = null;
      if (cfg.reviseVars && typeof cfg.reviseVars === 'object' && nKeys(cfg.reviseVars)) pf = { vars: cfg.reviseVars, from: 'revise' };
      else if (global.Lab && global.Lab.castVars) {
        try { var cv = global.Lab.castVars(cfg.studentId, p.id); if (cv && cv.vars && nKeys(cv.vars)) pf = { vars: cv.vars, from: 'cast', at: cv.at || '', status: cv.status || '' }; } catch (e) { pf = null; }
      }
      if (pf) {
        var nf = 0;
        C.VARIABLES.forEach(function (v) {
          var x = String(pf.vars[v.key] == null ? '' : pf.vars[v.key]).trim(), inp = host.querySelector('#wr-v-' + v.key);
          if (!x || !inp) return;
          inp.value = x; state.vars[v.key] = x; nf++;
        });
        if (nf) {
          state.prefill = { from: pf.from, n: nf, at: pf.at || '' };
          C.VARIABLES.forEach(function (v) { if (state.vars[v.key]) paintShape(v.key, false); });
          var fc = host.querySelector('#wr-fromcast'), when = '';
          if (pf.at) { try { var dt = new Date(pf.at); if (!isNaN(dt.getTime())) when = ' (' + dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ')'; } catch (e) { when = ''; } }
          if (fc) {
            fc.classList.remove('hidden');
            fc.innerHTML = pf.from === 'revise' ? '<b>Your plan from your first essay is filled in.</b> Change any box you like.'
              : '<b>Your plan is filled in from your Workshop cast of this prompt' + esc(when) + (pf.status && pf.status !== 'complete' ? ', which you have not finished' : '') + '.</b> You planned it once: change any box you like.';
          }
        }
      }
    }
    paintPlanWards();
    var swMore = host.querySelector('#wr-switch-more');
    if (swMore) swMore.addEventListener('click', function () {
      var full = host.querySelector('#wr-switch-full'), open = !full.classList.contains('open');
      full.classList.toggle('open', open); swMore.setAttribute('aria-expanded', String(open)); swMore.textContent = open ? 'Hide the other types' : 'Show all five types';
      if (open) { var d0 = full.querySelector('details'); if (d0) d0.open = true; }
    });
    host.querySelectorAll('[data-pick]').forEach(function (sel) { sel.addEventListener('change', function () {
      var key = sel.dataset.pick; state.choice[key] = sel.value; delete state.custom[key];
      var pg = paras.filter(function (x) { return x.key === key; })[0], ta = host.querySelector('[data-frame="' + key + '"]'); if (ta) ta.value = frameOf(pg).text;
      my.choice[key] = sel.value; delete my.custom[key]; T.save(cfg.studentId, my);
      paintMeters();
    }); });
    host.querySelectorAll('[data-frame]').forEach(function (ta) { ta.addEventListener('input', function () { var key = ta.dataset.frame; state.custom[key] = ta.value; my.custom[key] = ta.value; T.save(cfg.studentId, my); }); });
    var fillBtn = host.querySelector('#wr-fill');
    if (fillBtn) fillBtn.addEventListener('click', function () {
      var filled = Object.keys(state.vars).filter(function (k) { return state.vars[k]; }).length;
      if (filled < 6 && !confirm('Only ' + filled + ' of 11 variables are filled. Fill the frames anyway?')) return;
      state.fillUsed = true;
      paras.forEach(function (pg, i) {
        if (!areas[i].value.trim() || confirm('Replace the ' + pg.name + ' box?')) {
          areas[i].value = T.tidy(T.fill(frameText(pg), state.vars));
          state.fillBase[i] = sentences(areas[i].value);
          if (state.prevOpen[i] == null) state.prevOpen[i] = true;
        }
      });
      countW(); paintMeters(); paintShare(); if (state.relock) state.relock();
      host.querySelector('#wr-note').textContent = 'Frames filled. Grey words under each box are still the frame. In every paragraph, write one sentence of your own with one of your own ideas: Submit stays locked until you do.';
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
      if (guided && !state.planOpen && total - state.left >= 600) openBoxes('time');
      if (state.left === 0 && !state.done) finish(true);
    }, 500);
    function stop() { clearInterval(state.tick); }
    host.querySelector('#wr-quit').addEventListener('click', function () {
      if (words(text()) > 30 && !confirm('Leave now? This essay will not be saved.')) return;
      stop(); if (cfg.onQuit) cfg.onQuit();
    });

    function showPanel(pre, canRevise) {
      var pn = host.querySelector('#wr-panel'), canOpen = !exam && global.PCHost && global.PCHost.openSub;
      pn.innerHTML = '<div class="card preflight"><div class="pf-h"><b>The Ten Wards</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        (canOpen && (pre.bad || pre.warn) ? '<p class="tiny">Each red or amber row ends with one next step. A lesson link opens the lesson; "← my essay" brings you back here. The clock keeps running.</p>' : '') +
        pre.rows.map(function (r) {
          var ns = r.status !== 'ok' ? nextStep(r, pre, level) : null;
          return '<div class="pf-row ' + r.status + '" data-row-id="' + esc(r.id) + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p>' +
            (ns ? '<p class="pf-next"><span class="pf-next-h">Next step:</span> ' + esc(ns.text) + (ns.sub ? (canOpen ? ' <button type="button" class="pf-link" data-open-sub="' + esc(ns.sub) + '">' + esc(ns.link) + ' →</button>' : ' <span class="tiny">(' + esc(ns.link) + ')</span>') : '') + '</p>' : '') +
            '</div></div>';
        }).join('') +
        '<div class="wr-wards" style="margin-top:14px"><div class="wr-boxh"><b>The Landing Check</b><span class="tiny" id="wr-landscore"></span></div><p class="tiny">' + (exam ? 'Which of these did you do in the last five minutes? Tick honestly: the app compares your ticks with the Wards.'
          : 'Answer each question by tapping the sentence it asks for: the app checks your tap. Lines marked “whole essay” come from the Wards; lines marked “tick” are yours to tick honestly' + (cfg.faultTags && cfg.faultTags.length ? ' (your top faults: ' + esc(cfg.faultTags.slice(0, 5).join(', ')) + ')' : '') + '.' + (revise ? ' In a revision the Landing Check is optional.' : '')) + '</p><div id="wr-landlist"></div></div>' +
        (!exam || revise ? '<p class="wr-lockmsg hidden" id="wr-lockmsg" role="status"></p>' : '') +
        '<div class="qfoot" style="margin-top:12px">' + (canRevise ? '<button class="btn" id="wr-revise">Revise once</button>' : '') + '<span class="grow"></span><button class="btn primary" id="wr-submit">Submit essay</button></div></div>';
      var auto = landingAuto(pre), items = exam ? LANDING.map(function (l) { return { id: l.id, text: l.text, manual: true }; }) : LANDING;
      /* WP13: tap rows (guided and skeleton). Sentences are numbered across the essay as it was at Check. */
      var tapMode = !exam, sents = [], nBox = exam ? 1 : areas.length;
      if (tapMode) { var gi = 0; paraTexts().forEach(function (t, j) { sentences(t).forEach(function (s) { sents.push({ i: gi++, p: j, s: s }); }); }); }
      function tapOf(id) { return tapMode && TAPS[id] ? TAPS[id] : null; }
      function inScope(id) { var d = TAPS[id]; return sents.filter(function (x) { return d.inScope(x.p, nBox); }); }
      function tapLanded(id) { return !!(state.taps[id] && state.taps[id].landed); }
      function tapRow(l) {
        var d = TAPS[l.id], ts = state.taps[l.id] || {}, sc = inScope(l.id), res = '';
        if (ts.result) res = '<p class="wr-tapres ' + ts.result.cls + '" role="status">' + esc(ts.result.text) + (ts.result.sent ? ' <span class="wr-tapquote">“' + esc(ts.result.sent) + '”</span>' : '') + '</p>';
        var list = ts.landed ? '' : '<div class="wr-taplist" role="group" aria-label="' + esc(d.q) + '">' + (sc.length ? sc.map(function (x, k) {
          var lastP = k > 0 && sc[k - 1].p === x.p;
          return (lastP ? '' : '<p class="tiny wr-tappara">' + esc(boxName(x.p)) + '</p>') + '<button type="button" class="wr-tapsent' + (ts.wrong && ts.wrong[x.i] ? ' wrong' : '') + '" data-tap-sent="' + x.i + '" data-tap-ward="' + l.id + '">' + esc(x.s) + '</button>';
        }).join('') : '<p class="tiny">No sentences here yet. Write this paragraph, then press Check again.</p>') + '</div>';
        return '<li class="tap' + (ts.landed ? ' landed ok' : '') + '" data-ward-row="' + l.id + '"><div class="wr-tapq"><b>' + esc(d.q) + '</b><span class="tiny">' + esc(l.text) + '</span></div>' + list + res + '</li>';
      }
      function landHtml() {
        return '<ul class="wards landing' + (tapMode ? ' tapmode' : '') + '">' + items.map(function (l) {
          if (tapOf(l.id)) return tapRow(l);
          var ok = l.manual ? !!state.landTicks[l.id] : !!auto[l.id];
          return '<li class="' + (ok ? 'ok' : '') + (l.manual ? ' manual' : ' auto') + '"><label><input type="checkbox" data-ward="' + l.id + '"' + (ok ? ' checked' : '') + (l.manual ? '' : ' disabled') + '><span>' + esc(l.text) +
            (tapMode ? ' <i class="wr-tickonly">' + (l.manual ? 'tick: the app cannot check this on one sentence' : 'whole essay: from the Wards') + '</i>' : '') + '</span></label></li>';
        }).join('') + '</ul>';
      }
      function tap(id, si) {
        var d = TAPS[id], ts = state.taps[id] || (state.taps[id] = { tries: 0, wrong: {} }), x = sents.filter(function (q) { return q.i === si; })[0];
        if (!d || !x || ts.landed) return;
        var ok = d.inScope(x.p, nBox) && d.test(x.s);
        ts.tries++; if (ts.first == null) ts.first = ok ? 1 : 0;
        if (ok) { ts.landed = true; ts.chosen = x.i; ts.result = { cls: 'yes', text: d.yes, sent: '' }; return; }
        ts.wrong[x.i] = 1;
        if (ts.tries < 2) { ts.result = { cls: 'no', text: d.no, sent: '' }; return; }
        var pick = inScope(id).filter(function (q) { return d.test(q.s); })[0];
        ts.landed = true; ts.pick = pick ? pick.i : null;
        ts.result = pick ? { cls: 'pick', text: 'Not quite. The app would pick this one:', sent: pick.s } : { cls: 'pick', text: d.none, sent: '' };
      }
      function relock() {
        var sub = pn.querySelector('#wr-submit'); if (!sub || (exam && !revise)) return;
        var why = [];
        if (revise) { var rl = reviseLock(); if (rl) why.push(rl); }
        else {
          var tapsLeft = items.filter(function (l) { return tapOf(l.id) && !tapLanded(l.id); }).length;
          var manualDone = items.every(function (l) { return tapOf(l.id) || !l.manual || !!state.landTicks[l.id]; }), lk = lockList();
          if (tapsLeft) why.push('Answer ' + (tapsLeft === 1 ? 'the tap question' : 'the ' + tapsLeft + ' tap questions') + ' in the Landing Check: tap the sentence it asks for.');
          if (!manualDone) why.push('Tick every line of the Landing Check.');
          lk.forEach(function (x) { why.push(x.name + ': ' + x.msg); });
        }
        sub.disabled = why.length > 0; sub.title = why.join(' ');
        var lm = pn.querySelector('#wr-lockmsg');
        if (lm) { lm.classList.toggle('hidden', !why.length); lm.innerHTML = why.length ? '<b>Submit is locked.</b> ' + why.map(function (w) { return '<span class="wr-lockline">' + esc(w) + '</span>'; }).join(' ') : ''; }
      }
      function paintLanding() {
        var box = pn.querySelector('#wr-landlist'), n = items.filter(function (l) { return tapOf(l.id) ? tapLanded(l.id) : l.manual ? !!state.landTicks[l.id] : !!auto[l.id]; }).length;
        box.innerHTML = landHtml();
        pn.querySelector('#wr-landscore').textContent = n + ' of ' + items.length;
        box.querySelectorAll('input[data-ward]').forEach(function (cb) { cb.addEventListener('change', function () { state.landTicks[cb.dataset.ward] = cb.checked; paintLanding(); }); });
        box.querySelectorAll('[data-tap-sent]').forEach(function (b) { b.addEventListener('click', function () { tap(b.dataset.tapWard, Number(b.dataset.tapSent)); paintLanding(); }); });
        relock();
      }
      state.relock = relock;
      paintLanding();
      pn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var rv = pn.querySelector('#wr-revise');
      if (rv) rv.addEventListener('click', function () { state.revision = 1; state.firstText = text(); state.firstPre = pre; state.relock = null; pn.innerHTML = ''; areas[0].focus(); });
      pn.querySelector('#wr-submit').addEventListener('click', function () { if (this.disabled) return; finish(false, pre); });
    }
    host.querySelector('#wr-check').addEventListener('click', function () {
      var t = text();
      if (words(t) < 40) { host.querySelector('#wr-note').textContent = 'Write at least a few sentences first.'; return; }
      showPanel(preflight(t, p, shareOpts), state.revision === 0);
      paintShare();
    });
    function finish(timedOut, pre) {
      if (state.done) return;
      state.done = true; stop();
      var t = text(); pre = pre || preflight(t, p, shareOpts);
      areas.forEach(function (a) { a.disabled = true; });
      var secs = Math.min(total, Math.round((Date.now() - state.t0) / 1000));
      var rep = ownReport();
      var own = guided ? paras.map(function (pg, i) { var st = rep[i]; return st ? { frame: st.frame, words: st.words, own: st.own, sents: st.sents.length } : null; }) : null;
      /* lastMeta (contract with student.js): final at submit */
      var fw = 0, tw = 0, os = 0; rep.forEach(function (st) { if (st) { fw += st.frame; tw += st.words; os += st.own; } });
      var lt = {}; Object.keys(state.taps).forEach(function (k) { if (state.taps[k].first != null) lt[k] = state.taps[k].first; });
      var lk = Object.keys(lt);
      LAST = { ownShare: tw ? Math.round(1000 * (tw - fw) / tw) / 1000 : 0, ownSentences: os, fillUsed: !!state.fillUsed, landTaps: lt,
        landAgree: lk.length ? Math.round(1000 * lk.filter(function (k) { return lt[k] === 1; }).length / lk.length) / 1000 : null,
        revisionOf: String(cfg.revisionOf || ''), reviseRow: String(cfg.reviseRow || '') };
      if (cfg.onSubmit) cfg.onSubmit({ promptId: p.id, mode: mode, tier: tier, text: t, words: words(t), seconds: secs, timedOut: !!timedOut,
        preflight: pre, revision: state.revision, firstText: state.firstText || (revise ? old.text : ''), firstPreflight: state.firstPre || (revise ? old.pre : null),
        meta: lastMeta(), revisionOf: LAST.revisionOf, reviseRow: LAST.reviseRow,
        plan: exam ? { landing: state.landTicks, calibration: calibration(pre), share: share } : { vars: state.vars, choice: state.choice, custom: state.custom, planWards: state.planTicks, planOpenedAt: state.planOpenedAt, planHow: state.planHow || null, landing: state.landTicks, calibration: calibration(pre), share: share, shapeHelp: state.helped, ownWords: own } });
      /* how well her own ticks match the Wards: agreements over the lines the app can judge */
      function calibration(pre0) {
        var auto = landingAuto(pre0), keys = Object.keys(auto); if (!keys.length) return null;
        var agree = keys.filter(function (k) { return !!state.landTicks[k] === !!auto[k]; }).length;
        return { agree: agree, of: keys.length };
      }
    }
    if (revise) { countW(); paintMeters(); paintRevise(); paintShare(); }
    return { stop: stop, text: text, meta: lastMeta, revise: revise ? { target: old.target, row: cfg.reviseRow || '' } : null };
  }

  global.Prompts = Prompts;
  /* Shared with lab.js: does this text mention any word of the list (or a word that means the same)? */
  function mentions(t, list) { return hasAny(canon(read(t).text), list, false); }
  global.Writer = { preflight: preflight, checkThesis: checkThesis, checkBody: checkBody, checkRewrite: checkRewrite, markingPrompt: markingPrompt, mount: mount, plain: plain, read: read, mentions: mentions, words: words, sentences: sentences, paragraphs: paragraphs,
    shapeCheck: shapeCheck, shapeExamples: shapeExamples, nextStep: nextStep, planWards: planWards, lastMeta: lastMeta,
    _own: { test: ownTest, content: ownContent, stem: ownStem, frameSent: frameSent }, _tap: { position: sentPosition, example: sentExample }, _reviseTarget: reviseTarget,
    LEX: { POSITION: POSITION, MECH: MECH, EXAMPLE: EXAMPLE, NUANCE: NUANCE, LINKER_HEAD: LINKER_HEAD, REFERENCE: REFERENCE, CLICHE: CLICHE } };
})(window);
