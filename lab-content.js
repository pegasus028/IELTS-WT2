/* ===========================================================================
   POSITION CONTROL — lab-content.js
   Content for the Template Lab: the fourteen template components a student
   rewrites in her own words, the four template shares, the target levels,
   the guidance for filling each variable, the Lab ranks and awards, and the
   quick-check word lists used when the AI coach is offline.

   Plain ES5. Frames use the same {key} tokens as template.js
   (core · facetA · mechA · exA · nuanceA · facetB · mechB · exB · nuanceB ·
   position · rationale). On screen the tokens appear as [Core Topic] etc.
   =========================================================================== */
(function (global) {
  'use strict';

  var LAB = {};

  /* The essay length every budget is calculated against. */
  LAB.ESSAY_WORDS = 280;

  /* ---------------------------------------------------- template shares
     `floor` is the share of self-generated language Wray & Pegg (2009,
     IELTS Research Reports 9) proposed as the minimum for a band: 40% for
     Band 6, 50% for Band 7, 59% for Band 8. The student-written share is
     100 − pct, so each option says where it sits against those floors. */
  LAB.PCTS = [
    { pct: 60, name: 'Training frame', short: '60%',
      blurb: 'Six words in ten come from your template. Quickest to build and to use.',
      research: 'Leaves 40% for your own ideas, which is only the research floor for a Band 6 script. Use it to learn the moves, not for the exam.',
      suits: 'First drafts, B1–B2' },
    { pct: 50, name: 'Guided frame', short: '50%',
      blurb: 'Half template, half your own ideas.',
      research: 'Leaves 50% for your own ideas: the research floor for Band 7.',
      suits: 'Band 6.5–7 practice' },
    { pct: 40, name: 'Lean frame', short: '40%',
      blurb: 'Short signposts; your ideas carry the essay.',
      research: 'Leaves 60% for your own ideas, just above the Band 8 floor (59%).',
      suits: 'Band 7–7.5' },
    { pct: 30, name: 'Exam-ready frame', short: '30%',
      blurb: 'One short signpost per move. Almost everything the examiner reads is yours.',
      research: 'Leaves 70% for your own ideas, clear of every floor. The share recommended for a Band 8 target.',
      suits: 'Band 7.5–8+' }
  ];

  /* ------------------------------------------------------ target levels */
  LAB.LEVELS = [
    { id: 'B1', band: '5.5–6', bandLo: 5.5, bandHi: 6, tier: 'B2', name: 'B1 · Band 5.5–6', note: 'Clear, accurate sentences with everyday academic words.' },
    { id: 'B2', band: '6.5–7', bandLo: 6.5, bandHi: 7, tier: 'B2', name: 'B2 · Band 6.5–7', note: 'The Band 7 track: plain frames, precise ideas, few errors.' },
    { id: 'C1', band: '7.5–8', bandLo: 7.5, bandHi: 8, tier: 'C1', name: 'C1 · Band 7.5–8', note: 'The Band 8 track: nominalised noun phrases, flexible structures, rare errors.' },
    { id: 'C2', band: '8.5–9', bandLo: 8.5, bandHi: 9, tier: 'C1', name: 'C2 · Band 8.5–9', note: 'Natural, precise, effortless to follow. Cohesion the examiner does not notice.' }
  ];
  LAB.CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  /* ---------------------------------------------------------- slot names */
  LAB.SLOT_LABEL = {
    core: 'Core Topic', facetA: 'Facet A', mechA: 'Mechanism A', exA: 'Example A', nuanceA: 'Nuance A',
    facetB: 'Facet B', mechB: 'Mechanism B', exB: 'Example B', nuanceB: 'Nuance B',
    position: 'Position', rationale: 'Rationale'
  };
  /* Extra spellings a student may type inside the brackets. */
  LAB.SLOT_ALIASES = {
    'core topic': 'core', 'core': 'core', 'topic': 'core',
    'facet a': 'facetA', 'view a': 'facetA', 'reason 1': 'facetA',
    'mechanism a': 'mechA', 'mech a': 'mechA',
    'example a': 'exA', 'ex a': 'exA', 'specific evidence a': 'exA', 'evidence a': 'exA',
    'nuance a': 'nuanceA',
    'facet b': 'facetB', 'view b': 'facetB', 'reason 2': 'facetB',
    'mechanism b': 'mechB', 'mech b': 'mechB',
    'example b': 'exB', 'ex b': 'exB', 'specific evidence b': 'exB', 'evidence b': 'exB',
    'nuance b': 'nuanceB',
    'position': 'position', 'synthesized position': 'position', 'synthesised position': 'position', 'your position': 'position', 'verdict': 'position',
    'rationale': 'rationale'
  };

  LAB.PARAS = [
    { key: 'intro', name: 'Introduction' },
    { key: 'bodyA', name: 'Body paragraph A' },
    { key: 'bodyB', name: 'Body paragraph B' },
    { key: 'conclusion', name: 'Conclusion' }
  ];

  /* ------------------------------------------------------ the components
     One component = one sentence (or sentence part) of the template.
     fn      what the line does for the reader
     why     what it earns, in plain words, tied to a criterion
     slots   the tokens the line must contain, exactly once each
     weight  its share of the template word budget
     tip     the one thing students most often get wrong
     examples[tier] three versions to study, never to copy               */
  LAB.COMPONENTS = [
    { id: 'i-open', para: 'intro', name: 'Topic opener', slots: ['core'], weight: 1.3, crit: ['TR', 'LR'],
      fn: 'Introduces the main topic, the Core Topic, in a calm academic voice.',
      why: 'Task Response starts here: the examiner checks that you are answering THIS prompt. A neutral opener also sets a formal register (Lexical Resource).',
      tip: 'No "Nowadays", no "In this modern era", no "hot topic". The line must still make sense when the Core Topic is about cars, schools or prisons.',
      examples: {
        B2: ['People often discuss the topic of {core} because it has many different effects.', 'The question of {core} is one that many people feel strongly about.', 'In recent years, {core} has become an important public debate.'],
        C1: ['The ongoing discourse surrounding {core} frequently highlights its multifaceted implications.', 'A defining characteristic of the modern debate on {core} is its inherent complexity.', 'Few policy questions have generated as much sustained discussion as {core}.']
      } },
    { id: 'i-sides', para: 'intro', name: 'The two sides', slots: ['facetA', 'facetB'], weight: 1.2, crit: ['TR', 'CC'],
      fn: 'Shows the reader that the issue has two sides, Facet A and Facet B, and sets up body paragraphs A and B.',
      why: 'This is the plan of the essay. Naming both facets here lets the body paragraphs follow a clear progression (Coherence and Cohesion).',
      tip: 'Use one sentence with a contrast (while, whereas, yet). Do not write "I will discuss both sides".',
      examples: {
        B2: ['While many people focus on {facetA}, it is also important to consider {facetB}.', 'Some point to {facetA}, while others are more concerned with {facetB}.', 'On one side there is {facetA}; on the other there is {facetB}.'],
        C1: ['While considerable attention is paid to {facetA}, the significance of {facetB} is equally difficult to ignore.', 'The debate is typically framed as a contest between {facetA} and {facetB}.', 'Proponents emphasise {facetA}, whereas critics point to {facetB}.']
      } },
    { id: 'i-position', para: 'intro', name: 'Position preview', slots: ['position'], weight: 0.6, crit: ['TR'],
      fn: 'Tells the examiner your answer in paragraph one, so your position is clear from the start.',
      why: 'A clear position presented throughout is a Band 7 requirement. IELTS guidance says to state it in the introduction, not only at the end.',
      tip: 'Short and direct. "This essay argues that [Position]." is enough.',
      examples: {
        B2: ['In my view, {position}.', 'This essay looks at both sides before arguing that {position}.', 'I believe that {position}, and this essay explains why.'],
        C1: ['This essay contends that {position}.', 'On balance, this essay maintains that {position}.', 'The argument advanced here is that {position}.']
      } },
    { id: 'a-topic', para: 'bodyA', name: 'Facet A topic sentence', slots: ['facetA'], weight: 1.0, crit: ['CC'],
      fn: 'Opens body paragraph A by naming Facet A: one central idea for the whole paragraph.',
      why: 'One clear central topic per paragraph is a Band 7 Coherence and Cohesion requirement.',
      tip: 'Avoid "Firstly". Name the facet as the subject or the focus of the sentence.',
      examples: {
        B2: ['One important part of this issue is {facetA}.', 'The first side of the debate is {facetA}.', 'A strong argument on one side is {facetA}.'],
        C1: ['A fundamental dimension of this issue is its relationship to {facetA}.', 'At the heart of the first view lies {facetA}.', 'The primary justification often cited within this context is {facetA}.']
      } },
    { id: 'a-mech', para: 'bodyA', name: 'Mechanism A lead-in', slots: ['mechA'], weight: 0.6, crit: ['TR', 'GRA'],
      fn: 'Leads into how Facet A actually works: the cause and its effect.',
      why: 'Band 6–7 essays make general claims. Explaining the mechanism is what "well extended and supported" ideas look like (Task Response).',
      tip: 'Your lead-in decides the grammar of the slot. After "by" or "through", Mechanism A must start with an -ing verb.',
      examples: {
        B2: ['This idea works by {mechA}.', 'It works by {mechA}.', 'This happens because {mechA}.'],
        C1: ['This dynamic operates primarily by {mechA}.', 'Its influence stems from {mechA}.', 'The argument rests on the fact that {mechA}.']
      } },
    { id: 'a-example', para: 'bodyA', name: 'Example A lead-in', slots: ['exA'], weight: 0.8, crit: ['TR'],
      fn: 'Leads into a specific, real example that proves Facet A.',
      why: 'The Band 7 limit is "a tendency to over-generalise". A named, concrete example is the cure.',
      tip: 'Avoid a bare "For example,". Choose a lead-in that fits a noun phrase or a clause, and remember which one it needs.',
      examples: {
        B2: ['We can see this happening in the real world when {exA}.', 'A clear example is {exA}.', 'This is easy to see in {exA}.'],
        C1: ['Such a trajectory frequently manifests in real-world scenarios, such as {exA}.', 'It is within cases like {exA} that this dynamic is most visible.', 'The clearest evidence of this is {exA}.']
      } },
    { id: 'a-nuance', para: 'bodyA', name: 'Nuance A pivot', slots: ['nuanceA'], weight: 1.2, crit: ['TR', 'GRA'],
      fn: 'Turns to a limit of Facet A: when or why it does not fully work.',
      why: 'Showing the limits of a view proves a developed position (Task Response) and is the natural place for a concession or inversion (Grammatical Range).',
      tip: 'The nuance stays inside side A. If it starts arguing side B, paragraph B will repeat it.',
      examples: {
        B2: ['However, looking only at this side misses an important point; in reality, {nuanceA}.', 'Even so, {nuanceA}, so this argument has its limits.', 'It would be a mistake, though, to stop here: {nuanceA}.'],
        C1: ['Yet viewing this element in a vacuum overlooks critical context; indeed, {nuanceA}.', 'Notwithstanding this, an overreliance on this perspective ignores the fact that {nuanceA}.', 'Seldom, however, is this the whole story: {nuanceA}.']
      } },
    { id: 'b-topic', para: 'bodyB', name: 'Facet B transition', slots: ['facetB'], weight: 1.0, crit: ['CC'],
      fn: 'Moves the reader to Facet B without robotic linkers such as "On the other hand" or "Secondly".',
      why: 'At Band 9, cohesion "very rarely attracts attention". A meaningful transition connects the paragraphs through ideas, not signposts.',
      tip: 'Link back to paragraph A through meaning: "Equally significant…", "Just as important…".',
      examples: {
        B2: ['Another very important part of the debate is {facetB}.', 'Just as important is {facetB}.', 'The other side of the question is {facetB}.'],
        C1: ['Equally significant is the relationship between this issue and {facetB}.', 'Parallel to this dynamic is {facetB}.', 'This picture is complicated, however, by {facetB}.']
      } },
    { id: 'b-mech', para: 'bodyB', name: 'Mechanism B lead-in', slots: ['mechB'], weight: 0.6, crit: ['TR', 'GRA'],
      fn: 'Leads into how Facet B works.',
      why: 'Same job as Mechanism A: an idea is only "extended" when the reader sees how it works.',
      tip: 'Vary it from Mechanism A. If A used "by + -ing", try "through + -ing" or "because + clause" here.',
      examples: {
        B2: ['This side is based on {mechB}.', 'It works through {mechB}.', 'Supporters point out that {mechB}.'],
        C1: ['This dimension functions through {mechB}.', 'The underlying process is {mechB}.', 'Its force derives from {mechB}.']
      } },
    { id: 'b-example', para: 'bodyB', name: 'Example B lead-in', slots: ['exB'], weight: 0.8, crit: ['TR'],
      fn: 'Leads into a specific, real example for Facet B.',
      why: 'Support at Band 8 is specific: a place, a policy, a figure you know is true, or your own experience.',
      tip: 'Make it a different structure from Example A so the paragraphs do not read like a copy.',
      examples: {
        B2: ['This usually leads to results like {exB}.', '{exB} is a good example of this.', 'We see this in {exB}.'],
        C1: ['This is evidenced by {exB}.', '{exB} illustrates the point clearly.', 'The effect is visible in {exB}.']
      } },
    { id: 'b-nuance', para: 'bodyB', name: 'Nuance B pivot', slots: ['nuanceB'], weight: 1.2, crit: ['TR', 'GRA'],
      fn: 'Turns to a limit of Facet B, keeping the essay balanced before the conclusion.',
      why: 'Balance and a qualified view show a well-developed position (Task Response). In an agree/disagree essay this line can be your rebuttal.',
      tip: 'Vary the structure from Nuance A: if A used "Yet…", try "While…" or an inversion here.',
      examples: {
        B2: ['Still, we must be careful with this view, because {nuanceB}.', 'Yet {nuanceB}, which means this view cannot be accepted without question.', 'At the same time, {nuanceB}.'],
        C1: ['Nevertheless, {nuanceB}, a consideration that tempers any uncritical endorsement of this view.', 'It would be simplistic, however, to accept this without qualification: {nuanceB}.', 'While the impact of this dynamic is profound, it must be weighed against the reality that {nuanceB}.']
      } },
    { id: 'c-open', para: 'conclusion', name: 'Conclusion opener', slots: ['core'], weight: 1.2, crit: ['CC'],
      fn: 'Signals the conclusion and reminds the reader that the Core Topic has more than one side, without copying the introduction.',
      why: 'Lower bands copy their introduction. A fresh opener shows control of paragraphing and progression (Coherence and Cohesion).',
      tip: 'This is the second mention of the Core Topic. When you fill it, reword it.',
      examples: {
        B2: ['To sum up, looking at {core} from only one side is not enough.', 'In conclusion, both sides of {core} have real strengths and real limits.', 'Overall, {core} cannot be judged from one side alone.'],
        C1: ['In conclusion, reducing {core} to a single consequence fails to capture its full complexity.', 'Ultimately, viewing {core} through a single lens is too narrow.', 'Taken together, the arguments show that {core} resists a simple verdict.']
      } },
    { id: 'c-position', para: 'conclusion', name: 'Synthesized position', slots: ['position'], weight: 0.7, crit: ['TR'],
      fn: 'Delivers your final answer: the position that combines the strongest parts of both sides, or chooses one and says on what terms.',
      why: 'The conclusion must match the position in the introduction, fully developed (Task Response).',
      tip: 'The second mention of your Position. Same idea as the introduction, new words.',
      examples: {
        B2: ['A better way to look at it is that {position}.', 'My own position is that {position}.', 'The most reasonable view is that {position}.'],
        C1: ['A more accurate evaluation recognises that {position}.', 'The evidence considered here supports the view that {position}.', 'A sustainable resolution demands that {position}.']
      } },
    { id: 'c-rationale', para: 'conclusion', name: 'Rationale', slots: ['rationale'], weight: 0.6, crit: ['TR'],
      fn: 'Gives the one logical reason your position is the right one.',
      why: 'A justified conclusion; an unjustified one is a Band 6 description ("conclusions may be unclear, unjustified or repetitive").',
      tip: 'A principle, not a new example. No new ideas in the conclusion.',
      examples: {
        B2: ['This view makes the most sense because {rationale}.', 'This is mainly because {rationale}.', 'This matters because {rationale}.'],
        C1: ['This perspective is ultimately the most valid because {rationale}.', 'Such an approach is not merely preferable but necessary, since {rationale}.', 'The case rests on a simple principle: {rationale}.']
      } }
  ];

  /* ----------------------------------------- how to fill each variable */
  LAB.VAR_GUIDE = {
    core: { order: 1, weight: 1.0, does: 'Names the whole issue the prompt is about.', form: 'A noun phrase, e.g. "the regulation of private cars in city centres", not a full sentence.',
      tip: 'Keep the prompt\'s key nouns (if the prompt says children, write children). Change the grammar, not the meaning.' },
    facetA: { order: 2, weight: 0.9, does: 'The first side, view or aspect: one big idea.', form: 'Usually a noun phrase or an -ing phrase.',
      tip: 'One idea only: not the whole argument, not an example.' },
    facetB: { order: 3, weight: 0.9, does: 'The second side, view or aspect.', form: 'Usually a noun phrase or an -ing phrase, parallel to Facet A.',
      tip: 'Make it a genuine second side, not a repeat of Facet A in new words.' },
    position: { order: 4, weight: 1.2, does: 'Your answer to the question: how far you agree, or which view wins and on what terms.', form: 'A full clause (subject + verb) after "that".',
      tip: 'Answer the question as it is asked. The idea appears twice, so reword it for the conclusion.' },
    mechA: { order: 5, weight: 1.4, does: 'How Facet A works: the cause and what it leads to.', form: 'Check your lead-in: after "by" or "through" it is an -ing phrase; after "that" or "because" it is a full clause.',
      tip: 'Show a chain: what happens, then what that causes.' },
    exA: { order: 6, weight: 1.4, does: 'A specific, real example of Facet A.', form: 'Check your lead-in: a noun phrase after "such as" or "is", a clause after "when".',
      tip: 'Specific beats general: "Bangkok\'s new MRT lines" beats "public transport in big cities". Never invent statistics.' },
    nuanceA: { order: 7, weight: 1.4, does: 'A limit of Facet A: when or why it does not fully work.', form: 'Usually a full clause.',
      tip: 'Stay inside side A. Do not start arguing side B yet.' },
    mechB: { order: 8, weight: 1.4, does: 'How Facet B works.', form: 'Check your lead-in, as for Mechanism A.', tip: 'A different causal chain from Mechanism A.' },
    exB: { order: 9, weight: 1.4, does: 'A specific, real example of Facet B.', form: 'Check your lead-in.', tip: 'A different kind of example from Example A: a policy if A was a place, your own experience if A was a policy.' },
    nuanceB: { order: 10, weight: 1.4, does: 'A limit of Facet B (in an agree/disagree essay: your rebuttal).', form: 'Usually a full clause.', tip: 'It should prepare the ground for your final position.' },
    rationale: { order: 11, weight: 1.2, does: 'The one logical reason your position is right.', form: 'A full clause after "because" or "since".', tip: 'A principle, not a new example or a new idea.' }
  };

  /* Short notes that change how the variables are used by question type.
     Slot labels themselves come from Template.labels(type). */
  LAB.TYPE_NOTES = {
    DISCUSS: 'Treat both views fairly. Your Position says which view you support, or on what terms you combine them, and it must appear in the introduction and the conclusion.',
    OPINION: 'Agree or disagree: say how far you agree in the introduction. Facet A and Facet B can be two reasons, or a reason and the counter-argument; if B is the counter-argument, Nuance B is your rebuttal.',
    ADVANTAGE: 'If the prompt asks whether the advantages outweigh the disadvantages, it is an opinion question: your Position must say which side is heavier.',
    PROBLEM: 'Facet A becomes the main cause and Facet B the solution that answers it. Your frame lines were written for two sides, so check that every sentence still makes sense.',
    TWOPART: 'Two direct questions: Facet A answers question 1 and Facet B answers question 2, with equal weight.'
  };
  LAB.TYPE_FIT = { DISCUSS: 'good', ADVANTAGE: 'good', OPINION: 'ok', PROBLEM: 'hard', TWOPART: 'hard' };

  /* ------------------------------------------------------------- timing */
  LAB.TIMINGS = [
    { id: 'none', name: 'No time limit', blurb: 'Take as long as you need. Up to three tries per variable.' },
    { id: '40', name: '40 minutes total', blurb: 'The exam clock for the whole plan. Up to three tries per variable; finish in time for +30.' },
    { id: '2min', name: '2 minutes per variable', blurb: 'One try each. The card submits itself at 0:00. Time left earns a speed bonus.' }
  ];

  /* ------------------------------------------------------------- points */
  LAB.POINTS = {
    submit: 5, functionMet: 10, functionPartly: 5, errorFree: 10, oneError: 4, budget: 5, ownWords: 5, level: 5,
    reworded: 5, speedPer15s: 1, speedMax: 6, onTime40: 30, complete: 20, bandMultiplier: 10, beatBest: 25,
    lineMax: 40, blueprint: 50, revisionComplete: 10, revisionBandPerHalf: 20
  };

  /* -------------------------------------------------------------- ranks */
  LAB.RANKS = [
    { min: 0, name: 'Apprentice' },
    { min: 400, name: 'Draughtsman' },
    { min: 1200, name: 'Engineer' },
    { min: 2500, name: 'Architect' },
    { min: 5000, name: 'Chief Engineer' }
  ];

  /* ------------------------------------------------------------- awards
     Added to CONTENT.BADGES by lab.js; each carries its own test on the
     progress object's `lab` summary. */
  function lab(p) { return p.lab || {}; }
  LAB.BADGES = [
    { id: 'lab-first', name: 'First Blueprint', perk: 'A template in your own words.', how: 'Save your first complete template in the Template Lab.',
      test: function (p) { return (lab(p).templatesComplete || 0) >= 1; } },
    { id: 'lab-clean', name: 'Clean Blueprint', perk: 'Fourteen lines, zero errors.', how: 'Finish a template with every line coached error-free.',
      test: function (p) { return (lab(p).cleanTemplates || 0) >= 1; } },
    { id: 'lab-lean', name: 'Lean Frame', perk: 'Seventy per cent of it is you.', how: 'Finish an Assembly run with a 30% template, every variable filled.',
      test: function (p) { return ((lab(p).fullPcts || {})['30'] || 0) >= 1; } },
    { id: 'lab-spectrum', name: 'Full Spectrum', perk: 'You know which share suits you.', how: 'Finish an Assembly run at 60%, 50%, 40% and 30%, every variable filled.',
      test: function (p) { var s = lab(p).fullPcts || {}; return ['60', '50', '40', '30'].every(function (k) { return (s[k] || 0) >= 1; }); } },
    { id: 'lab-beat', name: 'Beat Your Best', perk: 'Your own record, broken.', how: 'Beat your best band at the same template share.',
      test: function (p) { return (lab(p).beatBest || 0) >= 1; } },
    { id: 'lab-clock', name: 'Beat the Clock', perk: 'Eleven cards, no timeouts.', how: 'Finish a 2-minutes-per-variable run without a card timing out.',
      test: function (p) { return (lab(p).clockClean || 0) >= 1; } },
    { id: 'lab-draft3', name: 'Third Draft', perk: 'Writers revise.', how: 'Save version 3 of an Assembly run.',
      test: function (p) { return (lab(p).maxVersion || 0) >= 3; } }
  ];

  /* ------------------------------------------------- offline quick check
     Frequent misspellings in Thai students' academic writing. The AI coach
     does the real proofreading; this list only runs when it is offline. */
  LAB.MISSPELL = {
    accomodate: 'accommodate', acheive: 'achieve', achivement: 'achievement', adress: 'address', advertisment: 'advertisement', agressive: 'aggressive',
    alot: 'a lot', aparent: 'apparent', arguement: 'argument', basicly: 'basically', begining: 'beginning', beleive: 'believe', belive: 'believe',
    benifit: 'benefit', benifits: 'benefits', buisness: 'business', calender: 'calendar', carreer: 'career', catagory: 'category', comittee: 'committee',
    commited: 'committed', comunity: 'community', concious: 'conscious', convinient: 'convenient', definately: 'definitely', definitly: 'definitely',
    dependant: 'dependent', desicion: 'decision', developement: 'development', develope: 'develop', diffrent: 'different', dissapear: 'disappear',
    econimic: 'economic', enviroment: 'environment', enviromental: 'environmental', environmant: 'environment', embarass: 'embarrass', exagerate: 'exaggerate',
    excercise: 'exercise', existance: 'existence', experiance: 'experience', familar: 'familiar', finaly: 'finally', foriegn: 'foreign', foward: 'forward',
    fourty: 'forty', freind: 'friend', goverment: 'government', govenment: 'government', goverments: 'governments', grammer: 'grammar', gaurantee: 'guarantee',
    happend: 'happened', hygeine: 'hygiene', immediatly: 'immediately', importent: 'important', independant: 'independent', infomation: 'information',
    knowlege: 'knowledge', langauge: 'language', libary: 'library', lisence: 'licence', maintainance: 'maintenance', neccessary: 'necessary', necesary: 'necessary',
    noticable: 'noticeable', occassion: 'occasion', occured: 'occurred', occurence: 'occurrence', oppinion: 'opinion', oportunity: 'opportunity',
    opportunitys: 'opportunities', paralel: 'parallel', peice: 'piece', perfomance: 'performance', persue: 'pursue', posession: 'possession', prefered: 'preferred',
    priviledge: 'privilege', probaly: 'probably', proffesional: 'professional', publically: 'publicly', recieve: 'receive', recomend: 'recommend',
    reccomend: 'recommend', refered: 'referred', relevent: 'relevant', religous: 'religious', resourse: 'resource', responsability: 'responsibility',
    responsibilty: 'responsibility', resturant: 'restaurant', seperate: 'separate', sieze: 'seize', similiar: 'similar', sincerly: 'sincerely',
    succesful: 'successful', successfull: 'successful', suprise: 'surprise', teh: 'the', tommorow: 'tomorrow', tounge: 'tongue', truely: 'truly',
    untill: 'until', usefull: 'useful', vehical: 'vehicle', wich: 'which', wether: 'whether', writting: 'writing'
  };
  /* Uncountable nouns that must not take -s (a frequent grammar slip). */
  LAB.UNCOUNTABLE = {
    childrens: 'children', informations: 'information', advices: 'advice', knowledges: 'knowledge', equipments: 'equipment',
    researches: 'research', evidences: 'evidence', furnitures: 'furniture', homeworks: 'homework', traffics: 'traffic', pollutions: 'pollution'
  };

  global.LabContent = LAB;
})(window);
