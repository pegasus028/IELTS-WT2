/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — writer.js  (the Scriptorium)
   The timed Task 2 editor and the rule-based structural check ("pre-flight" in
   the code; shown to students as "the Ten Wards").

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
    return { text: s, fixes: fixes };
  }
  function fixNote(fixes) {
    if (!fixes.length) return '';
    return 'Read as: ' + fixes.slice(0, 3).map(function (f) { return '"' + f[0] + '" → "' + f[1] + '"'; }).join(', ') + '. Check the spelling before you copy this into an essay.';
  }
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
  /* Comparative verdict wording for "outweigh" prompts. */
  var VERDICT_WIDE = new RegExp('\\b(outweigh\\w*|on balance|on the whole|tip(s|ped)? the (balance|scales)|(the )?(balance|scales) (tips|tilts)' +
    '|(?<!more and )(far |much |considerably |clearly |slightly |a lot |significantly )?(more|less) (serious|important|significant|substantial|beneficial|harmful|damaging|valuable|weighty|compelling|powerful|convincing|considerable|numerous|positive|negative|useful|dangerous|costly|worrying|pressing|helpful|real|lasting|severe)\\b(?! and more)' +
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
    add('template', 'struct-template', trS, 'Unchanged frame text: ' + Math.round(tr * 100) + '% (your spellbook share: ' + sh + '%)', trS === 'ok' ? 'Within your spellbook (template) share. The marks are inside the variables.' : 'Above your ' + sh + '% spellbook (template) share. Edit the openers into your own words and put the weight inside the variables.');

    /* new idea in conclusion: a noun in the conclusion that appears nowhere else */
    if (concl && ps.length >= 4) {
      var before = lower(ps.slice(0, -1).join(' ')), newNouns = [], fw = T ? T.frameWords() : {};
      lower(concl).replace(/[^a-z ]+/g, ' ').split(/\s+/).forEach(function (w3) { if (w3.length > 6 && !fw[w3] && before.indexOf(w3.slice(0, 5)) < 0 && newNouns.indexOf(w3) < 0) newNouns.push(w3); });
      if (newNouns.length >= 4) add('newidea', 'tr-new-idea', 'warn', 'Possible new material in the conclusion: ' + newNouns.slice(0, 3).join(', '), 'The conclusion evaluates and restates; it does not introduce ideas the body did not develop.');
    }

    var bad = rows.filter(function (r) { return r.status === 'bad'; }).length;
    var warn = rows.filter(function (r) { return r.status === 'warn'; }).length;
    return { rows: rows, words: n, paras: ps.length, bad: bad, warn: warn, ratio: tr,
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
    { id: 'core', text: 'My Core Topic is one noun phrase that covers every part: no clause, no "should", not a copy of the prompt.' },
    { id: 'facets', text: 'Facet A and Facet B are two obvious ideas I can develop.' },
    { id: 'mech', text: 'Each facet has a mechanism (an -ing phrase) and an example I can picture or check.' },
    { id: 'nuance', text: 'Each facet has a nuance that limits it without changing my position.' },
    { id: 'position', text: 'My position is a full clause with a stance word that fits the type (outweigh, how far, which view, what must happen).' },
    { id: 'budget', text: 'I know the budget (50 / 95 / 95 / 45), chose at most one structural swap per body paragraph, and listed two words not to repeat.', manual: true }
  ];
  function planWards(vars, promptText) {
    var v = vars || {}, out = {};
    var has = function (k, min) { return String(v[k] || '').trim().split(/\s+/).filter(Boolean).length >= (min || 2); };
    var core = String(v.core || '').trim();
    out.core = has('core', 3) && !/^\s*\w+ing\b/i.test(core) && !/\b(should|must|because|which|that|when)\b/i.test(core) && !(promptText && lower(promptText).indexOf(lower(core).replace(/[.]$/, '')) >= 0 && core.split(/\s+/).length > 5);
    out.facets = has('facetA') && has('facetB');
    out.mech = /^\s*(by |through )?\w+ing\b/i.test(v.mechA || '') && /^\s*(by |through )?\w+ing\b/i.test(v.mechB || '') && has('exA') && has('exB');
    out.nuance = has('nuanceA', 5) && has('nuanceB', 5);
    var pos = read(v.position || '').text;
    out.position = has('position', 5) && (POSITION.test(pos) || STANCE.test(pos));
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
    '|(?<!\\b(need|needs|have|has|had|ought|going|want|wants|try|tries|able|used|likely|decide|decided|plan|plans|seem|seems|tend|fail|fails|refuse|is|are|be|was|were|begin|start|continue|choose|learn) )\\bto (protect|keep|ensure|reduce|avoid|prevent|help|improve|save|allow|give|stop|cut|limit|raise|support|encourage|lower|fight|tackle|ease|free|create|boost|promote|preserve|guard|shield|balance|meet|serve|respect|gain|attract|clean|calm|make sure|safeguard|benefit)\\b', 'i');
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
    else if (!needCond && needWhy && !CAUSE.test(t) && !CONDITION.test(t)) { ok = false; notes.push('Add the reason or the condition: "… because …", "… since …", "… provided that …", "… as long as …".'); }
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

  /* ---------------------------------------------------------------- UI */
  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }

  function mount(host, cfg) {
    var p = promptOf(cfg.prompt);
    var mode = cfg.mode || 'guided', guided = mode === 'guided', skeleton = mode === 'skeleton', exam = mode === 'exam';
    var tier = cfg.tier || 'B2', type = p.type || 'DISCUSS';
    /* guided mode is practice (60%); skeleton and exam use the chosen share or the track default */
    var share = guided ? 0.6 : (SHARES.indexOf(Number(cfg.share)) >= 0 ? Number(cfg.share) : tier === 'C1' ? 0.3 : 0.4);
    var minutes = cfg.minutes || 40, total = minutes * 60;
    var my = T.load(cfg.studentId); if (!my.choice) my.choice = {}; if (!my.custom) my.custom = {};
    var state = { t0: Date.now(), left: total, done: false, revision: 0, tick: null, vars: {}, choice: {}, custom: {}, planTicks: {}, landTicks: {}, planOpen: !guided, planOpenedAt: null };
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
          (!exam ? T.switchCard(type) : '') +
          (!exam ? '<div class="card wr-plan"><div class="wr-boxh"><b>The matrix</b><span class="tiny">plan — not counted</span>' + (guided ? '<button class="btn sm" id="wr-fill">Fill the frames →</button>' : '') + '</div>' +
            C.VARIABLES.map(function (v) { return '<div class="wr-planrow"><label for="wr-v-' + v.key + '" title="' + esc(v.hint) + '">' + v.n + ' · ' + esc(labels[v.key]) + '</label><input id="wr-v-' + v.key + '" data-var="' + v.key + '" placeholder="' + esc(v.hint) + '"></div>'; }).join('') + '</div>' : '') +
          (!exam ? '<div class="card wr-wards" id="wr-planwards"><div class="wr-boxh"><b>The Plan Wards</b><span class="tiny" id="wr-planscore"></span></div><p class="tiny">Grey lines tick themselves from the eleven keys. The others are yours to tick honestly.</p><div id="wr-planlist"></div>' + (guided ? '<p class="tiny" id="wr-plannote">The paragraph boxes open when the Plan Wards are green, or after ten minutes.</p>' : '') + '</div>' : '') +
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
          '<button class="btn primary" id="wr-check">Check the Ten Wards →</button></div>' +
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
    host.querySelectorAll('[data-var]').forEach(function (inp) { inp.addEventListener('input', function () { state.vars[inp.dataset['var']] = inp.value.trim(); paintPlanWards(); }); });
    function planGreen() { var a = planWards(state.vars, p.text); return PLAN_WARDS.every(function (w) { return w.manual ? !!state.planTicks[w.id] : !!a[w.id]; }); }
    function openBoxes(why) {
      if (state.planOpen) return;
      state.planOpen = true; state.planOpenedAt = Math.round((Date.now() - state.t0) / 1000); state.planHow = why;
      host.querySelectorAll('.wr-box[data-para]').forEach(function (b) { b.classList.remove('wr-locked'); });
      var note = host.querySelector('#wr-plannote'); if (note) note.textContent = why === 'green' ? 'Plan Wards green: the boxes are open. Fill the frames, then edit every sentence into your own words.' : 'Ten minutes are up: the boxes are open. Finish the plan as you write.';
    }
    function paintPlanWards() {
      var box = host.querySelector('#wr-planlist'); if (!box) return;
      var a = planWards(state.vars, p.text), n = PLAN_WARDS.filter(function (w) { return w.manual ? !!state.planTicks[w.id] : !!a[w.id]; }).length;
      box.innerHTML = wardList('plan', PLAN_WARDS, state.planTicks, a);
      host.querySelector('#wr-planscore').textContent = n + ' of ' + PLAN_WARDS.length;
      box.querySelectorAll('[data-ward]').forEach(function (cb) { cb.addEventListener('change', function () { state.planTicks[cb.dataset.ward] = cb.checked; paintPlanWards(); }); });
      if (guided && n === PLAN_WARDS.length) openBoxes('green');
    }
    if (guided) { host.querySelectorAll('.wr-box[data-para]').forEach(function (b) { b.classList.add('wr-locked'); }); }
    paintPlanWards();
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
      countW(); host.querySelector('#wr-note').textContent = 'Frames filled. Now edit every sentence into your own words. The Ten Wards measure how much is still spellbook frame.';
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
      var pn = host.querySelector('#wr-panel');
      pn.innerHTML = '<div class="card preflight"><div class="pf-h"><b>The Ten Wards</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        pre.rows.map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') +
        '<div class="wr-wards" style="margin-top:14px"><div class="wr-boxh"><b>The Landing Check</b><span class="tiny" id="wr-landscore"></span></div><p class="tiny">' + (exam ? 'Which of these did you do in the last five minutes? Tick honestly: the app compares your ticks with the Wards.' : 'Grey lines come from the Wards. Tick the rest yourself before you submit' + (cfg.faultTags && cfg.faultTags.length ? ' (your top faults: ' + esc(cfg.faultTags.slice(0, 5).join(', ')) + ')' : '') + '.') + '</p><div id="wr-landlist"></div></div>' +
        '<div class="qfoot" style="margin-top:12px">' + (canRevise ? '<button class="btn" id="wr-revise">Revise once</button>' : '') + '<span class="grow"></span><button class="btn primary" id="wr-submit">Submit essay</button></div></div>';
      var auto = landingAuto(pre), items = exam ? LANDING.map(function (l) { return { id: l.id, text: l.text, manual: true }; }) : LANDING;
      function paintLanding() {
        var box = pn.querySelector('#wr-landlist'), n = items.filter(function (l) { return l.manual ? !!state.landTicks[l.id] : !!auto[l.id]; }).length;
        box.innerHTML = wardList('landing', items, state.landTicks, auto);
        pn.querySelector('#wr-landscore').textContent = n + ' of ' + items.length;
        box.querySelectorAll('[data-ward]').forEach(function (cb) { cb.addEventListener('change', function () { state.landTicks[cb.dataset.ward] = cb.checked; paintLanding(); }); });
        var sub = pn.querySelector('#wr-submit'), manualDone = items.every(function (l) { return !l.manual || !!state.landTicks[l.id]; });
        if (!exam) { sub.disabled = !manualDone; sub.title = manualDone ? '' : 'Tick every line of the Landing Check first.'; }
      }
      paintLanding();
      pn.scrollIntoView({ behavior: 'smooth', block: 'start' });
      var rv = pn.querySelector('#wr-revise');
      if (rv) rv.addEventListener('click', function () { state.revision = 1; state.firstText = text(); state.firstPre = pre; pn.innerHTML = ''; areas[0].focus(); });
      pn.querySelector('#wr-submit').addEventListener('click', function () { finish(false, pre); });
    }
    host.querySelector('#wr-check').addEventListener('click', function () {
      var t = text();
      if (words(t) < 40) { host.querySelector('#wr-note').textContent = 'Write at least a few sentences first.'; return; }
      showPanel(preflight(t, p, { share: share }), state.revision === 0);
    });
    function finish(timedOut, pre) {
      if (state.done) return;
      state.done = true; stop();
      var t = text(); pre = pre || preflight(t, p, { share: share });
      areas.forEach(function (a) { a.disabled = true; });
      var secs = Math.min(total, Math.round((Date.now() - state.t0) / 1000));
      if (cfg.onSubmit) cfg.onSubmit({ promptId: p.id, mode: mode, tier: tier, text: t, words: words(t), seconds: secs, timedOut: !!timedOut,
        preflight: pre, revision: state.revision, firstText: state.firstText || '', firstPreflight: state.firstPre || null,
        plan: exam ? { landing: state.landTicks, calibration: calibration(pre) } : { vars: state.vars, choice: state.choice, custom: state.custom, planWards: state.planTicks, planOpenedAt: state.planOpenedAt, planHow: state.planHow || null, landing: state.landTicks, calibration: calibration(pre) } });
      /* how well her own ticks match the Wards: agreements over the lines the app can judge */
      function calibration(pre0) {
        var auto = landingAuto(pre0), keys = Object.keys(auto); if (!keys.length) return null;
        var agree = keys.filter(function (k) { return !!state.landTicks[k] === !!auto[k]; }).length;
        return { agree: agree, of: keys.length };
      }
    }
    return { stop: stop, text: text };
  }

  global.Prompts = Prompts;
  /* Shared with lab.js: does this text mention any word of the list (or a word that means the same)? */
  function mentions(t, list) { return hasAny(canon(read(t).text), list, false); }
  global.Writer = { preflight: preflight, checkThesis: checkThesis, checkBody: checkBody, checkRewrite: checkRewrite, markingPrompt: markingPrompt, mount: mount, plain: plain, read: read, mentions: mentions, words: words, sentences: sentences, paragraphs: paragraphs,
    LEX: { POSITION: POSITION, MECH: MECH, EXAMPLE: EXAMPLE, NUANCE: NUANCE, LINKER_HEAD: LINKER_HEAD, REFERENCE: REFERENCE, CLICHE: CLICHE } };
})(window);
