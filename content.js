/* ===========================================================================
   POSITION CONTROL — content.js  (core)
   IELTS Academic Writing Task 2 · Satriwithaya School EP (M4.1) and tutoring
   ---------------------------------------------------------------------------
   Sibling of Chart Control (Task 1). This file holds everything that is NOT
   question content: the question-type registry, the rank ladder, the awards,
   and the error-tag dictionary that drives hints, the pre-flight checker and
   the teacher report.

   The questions live in the topic files, loaded after this one, which push
   onto CONTENT.TOPICS:

     topic-00.js   Module 00  The Test
     topic-01.js   Module 01  Decode the Prompt
     topic-02.js   Module 02  Position
     topic-03.js   Module 03  Matrix I — Core Topic and Facets
     topic-04.js   Module 04  Matrix II — Mechanism, Example, Nuance
     topic-05.js   Module 05  The Template
     topic-06.js   Module 06  Synthesis
     topic-07.js   Module 07  Cohesion
     topic-08.js   Module 08  Nominalisation
     topic-09.js   Module 09  Structural Swaps
     topic-10.js   Module 10  Collocation and Register
     topic-11.js   Module 11  Accuracy
     topic-12.js   Module 12  Playbooks
     topic-13.js   Module 13  Exam Day
     prompts.js    The Task 2 prompt bank (with the 11 variables at two tiers)
     template.js   The customisable Matrix template (frames, tiers, swaps)
     models.js     Model essays with dissect labels
     mocks.js      Three timed mocks (exam mode)

   ---------------------------------------------------------------------------
   SHAPE OF A MODULE (one topic, one level, three sub-levels, one check)

   {
     id:'m02', n:2, code:'Module 02', name:'Position', art:'signal',
     cefr:'B1–C1',
     blurb:'One sentence a student reads before opening it.',
     levels:[{ id:'m02l1', n:1, name:'Position', cefr:'B1–C1', blurb:'…',
       subs:[
         { id:'m02s1', name:'…', cefr:'B1',
           theory:{ key:'One sentence that is the whole idea.',
                    body:['<p-worth of html>', …],
                    simple:['same idea, plainer English', …],
                    examples:[{s:'…', g:'…'}] },
           items:[ … ] }, …three subs…
       ],
       check:{ id:'m02ck', name:'Systems Check', items:[ … ] } }]
   }

   ITEM TYPES  (engine.js renders and marks these)
     choose    {stem, options[], answer}                 multiple choice
     judge     {given, stem, answer}                     True / False / Can't tell (0/1/2)
     spot      {stem, words[], answer, fix}              tap the wrong chunk
     sort      {stem, bins[{key,label,hint}], items[{text,bin}]}   drop into boxes
     build     {stem, tiles[], solution, alt[]}          assemble a sentence
     order     {stem, items[] IN CORRECT ORDER}          reorder (shuffled)
     select    {stem, options[], answers[], k}           tick exactly k options
     thesis    {stem, prompt, must[], minWords, maxWords}   write a one-sentence position (rule-checked)
     bodypara  {stem, prompt, side:'A'|'B', minWords, maxWords}  write one body paragraph (rule-checked)
     rewrite   {stem, given, must[], ban[], minWords, maxWords}  rewrite a sentence (e.g. nominalise, detox)

   Any item may carry `prompt:'<prompt id>'` (from prompts.js) and the prompt
   card is shown above the question.

   Every item carries: id · type · tag (must exist in REMEDIATION) · level
   (B1 | B2 | C1) · why (the diagnosis a student reads after answering).

   Nothing in this app may reproduce a real past IELTS paper or a published
   model essay. Prompts are original. See VERIFY.md.
   =========================================================================== */

var CEFR = ['B1', 'B2', 'C1'];

/* The five question types. Everything the Decode module and the playbooks
   do hangs off one of these. `demand` is the Task Response requirement. */
var TYPES = {
  OPINION:   { name: 'Opinion',                 short: 'OPINION',   signal: 'To what extent do you agree or disagree?',            demand: 'One position, stated in paragraph one, held to the end, with two developed reasons (or one reason and one conceded counter-argument).', trap: 'Sitting on the fence: "partly agree" without saying which part.' },
  DISCUSS:   { name: 'Discuss both views',      short: 'DISCUSS',   signal: 'Discuss both views and give your own opinion.',        demand: 'Both views treated fairly, each with a mechanism and an example, then a stated verdict that appears in the introduction AND the conclusion.', trap: 'The opinion appears only in the conclusion, or never.' },
  ADVANTAGE: { name: 'Advantages / disadvantages', short: 'ADVANTAGE', signal: 'Do the advantages outweigh the disadvantages?',     demand: 'A weighing: this is an opinion question in disguise. Say which side is heavier and why, not just what is on each side.', trap: 'A list of pros and cons with no verdict.' },
  PROBLEM:   { name: 'Problem / solution',      short: 'PROBLEM',   signal: 'What are the causes? What can be done?',              demand: 'Causes named with their mechanism; each solution answers a named cause.', trap: 'Solutions that do not match the causes given.' },
  TWOPART:   { name: 'Two-part question',       short: 'TWOPART',   signal: 'Two separate direct questions.',                       demand: 'Both questions answered with equal weight, one body paragraph each.', trap: 'One question answered in a single sentence.' }
};

/* The eight thematic domains. Prompts carry one; collocation drills use them. */
var DOMAINS = {
  education: 'Education', environment: 'Environment', technology: 'Technology', health: 'Health',
  crime: 'Crime and punishment', government: 'Government and society', work: 'Work', culture: 'Globalisation and culture'
};

/* The five argument schemas that recur in every domain. */
var SCHEMAS = [
  { id: 'individual-collective', name: 'Individual vs collective responsibility' },
  { id: 'short-long', name: 'Short-term cost vs long-term benefit' },
  { id: 'freedom-regulation', name: 'Freedom vs regulation' },
  { id: 'tradition-progress', name: 'Tradition vs progress' },
  { id: 'prevention-cure', name: 'Prevention vs cure' }
];

/* The eleven variables of the Matrix, in template order. */
var VARIABLES = [
  { key: 'core', n: 1, name: 'Core Topic', para: 1, hint: 'A nominalised noun phrase for the whole issue — "the regulation of private cars in city centres", not "banning cars".' },
  { key: 'facetA', n: 2, name: 'Facet A', para: 2, hint: 'The first major aspect, view or effect.' },
  { key: 'mechA', n: 3, name: 'Mechanism A', para: 2, hint: 'How Facet A actually works: the cause-and-effect inside it.' },
  { key: 'exA', n: 4, name: 'Example A', para: 2, hint: 'Where Facet A can be seen in the real world — a place, a policy, a practice.' },
  { key: 'nuanceA', n: 5, name: 'Nuance A', para: 2, hint: 'The limit that proves Facet A is not an absolute rule.' },
  { key: 'facetB', n: 6, name: 'Facet B', para: 3, hint: 'The second major aspect, view or effect.' },
  { key: 'mechB', n: 7, name: 'Mechanism B', para: 3, hint: 'How Facet B works.' },
  { key: 'exB', n: 8, name: 'Example B', para: 3, hint: 'Where Facet B can be seen.' },
  { key: 'nuanceB', n: 9, name: 'Nuance B', para: 3, hint: 'The limit of Facet B.' },
  { key: 'position', n: 10, name: 'Synthesized Position', para: 4, hint: 'Your verdict: the position that takes the best of both facets, or chooses one and says why.' },
  { key: 'rationale', n: 11, name: 'Rationale', para: 4, hint: 'The one logical reason your position is the right one.' }
];

/* --------------------------------------------------------------------------
   RANKS — one rung per band of module checks cleared (14 in total).
   -------------------------------------------------------------------------- */
var RANKS = [
  { min: 0,  name: 'Ground Crew',       note: 'Powered up. Nothing checked yet.' },
  { min: 1,  name: 'Cadet',             note: 'First module online.' },
  { min: 3,  name: 'Decoder',           note: 'You can read a prompt and say what it demands.' },
  { min: 5,  name: 'Advocate',          note: 'Position, facets, mechanism — the matrix holds.' },
  { min: 7,  name: 'Navigator',         note: 'The template is yours to bend.' },
  { min: 9,  name: 'Flight Controller', note: 'Cohesion without linkers, complexity without errors.' },
  { min: 11, name: 'Deputy Director',   note: 'Precise, accurate, adaptable.' },
  { min: 14, name: 'Mission Director',  note: 'Every module green. Go for launch.' }
];

/* --------------------------------------------------------------------------
   AWARDS
   -------------------------------------------------------------------------- */
var BADGES = [
  { id: 'poweron',   name: 'Power On',           perk: 'The console is yours.',                   how: 'Finish your first module.' },
  { id: 'streak3',   name: 'Three-Day Burn',     perk: 'Momentum is a skill.',                    how: 'Study 3 days in a row.' },
  { id: 'streak7',   name: 'Week in Orbit',      perk: 'Seven days, no drift.',                   how: 'Study 7 days in a row.' },
  { id: 'allgreen',  name: 'All Green',          perk: 'A perfect module check.',                 how: 'Score 100% on any systems check.' },
  { id: 'nohelp',    name: 'Manual Flight',      perk: 'No hints, no help.',                      how: 'Clear a systems check without using a hint.' },
  { id: 'recovered', name: 'Fault Cleared',      perk: 'You fixed what you broke.',               how: 'Fix 5 questions on your Fault List.' },
  { id: 'run10',     name: 'Clean Run',          perk: 'Ten in a row.',                           how: 'Answer 10 questions correctly in a row.' },
  { id: 'thesis',    name: 'Thesis Sniper',      perk: 'One sentence, one position.',             how: 'Write 10 thesis sentences that pass every rule.' },
  { id: 'preflight', name: 'Pre-flight Perfect', perk: 'Nothing red on the panel.',               how: 'Submit an essay with zero red rows on the pre-flight check.' },
  { id: 'fivetypes', name: 'Five Types',         perk: 'Opinion, discuss, weigh, solve, two-part.', how: 'Submit a passing essay of each of the five question types.' },
  { id: 'forty',     name: 'Forty Minutes',      perk: 'On the clock and on time.',               how: 'Submit a timed essay inside 40 minutes with 250+ words.' },
  { id: 'unplugged', name: 'Unplugged',          perk: 'No frames, no cards — your own words.',   how: 'Submit a passing essay in exam mode (blank page).' },
  { id: 'bandup',    name: 'Band Up',            perk: 'Half a band higher than your best.',      how: 'Get a band half a band above your previous best.' },
  { id: 'mock1',     name: 'First Mock',         perk: 'You have seen the whole task.',           how: 'Finish any timed mock.' },
  { id: 'bootcamp',  name: 'Bootcamp Graduate',  perk: 'The whole matrix, three times over.',     how: 'Clear three Bootcamp missions.' },
  { id: 'director',  name: 'Mission Director',   perk: 'Every module green.',                     how: 'Clear all 14 systems checks.' }
];

/* --------------------------------------------------------------------------
   ERROR TAGS
   Every item and every pre-flight rule names one. `principle` is what a
   student sees if they press Hint (and beside a red row on the panel).
   `reteach` and `activities` appear only in the teacher console.
   Prefix = the criterion it costs: tr / cc / lr / gra / (kn = knowledge).
   -------------------------------------------------------------------------- */
var REMEDIATION = {

  /* ---------------------------------------- knowledge of the test */
  'kn-test-facts': {
    name: 'The facts of the task', gate: 'TR',
    principle: 'Task 2: 40 minutes, at least 250 words, two-thirds of the Writing score. Four criteria at 25% each. One position, held from the first paragraph to the last. No bullet points, no notes, no memorised essays.',
    reteach: 'Students who do not know the weighting spend 30 minutes on Task 1 and lose Task 2. Ten minutes on the numbers saves a band.',
    activities: ['Quiz race on the numbers: 40, 250, 4, 25, twice.', 'Rubric autopsy: underline the instruction words in five prompts.']
  },
  'kn-criteria': {
    name: 'What each criterion rewards', gate: 'TR',
    principle: 'TR = did you answer every part with one clear, developed position? CC = one idea per paragraph, progression, cohesion that does not attract attention. LR = precise collocation, not rare words. GRA = a variety of complex structures with frequent error-free sentences.',
    reteach: 'Map every piece of feedback onto one of the four criteria so students see that "no opinion" is a TR problem and "Firstly, Secondly, Thirdly" is CC. The criterion names the fix.',
    activities: ['Sort feedback comments into the four criteria.', 'Band ladder walk: read Band 6, 7, 8 for one criterion and name the gate.']
  },
  'kn-question-type': {
    name: 'Reading the question type', gate: 'TR',
    principle: '"Agree or disagree" → one position. "Discuss both views" → both views, then your verdict in the intro and the conclusion. "Outweigh" → a weighing, not a list. "Causes / solutions" → each solution answers a cause. Two questions → two body paragraphs.',
    reteach: 'Misreading the type is the top cause of a TR ceiling at 6. Flash prompts for ten seconds and demand the type and its demand before any idea is discussed.',
    activities: ['Type Sort with five coloured cards, 20 prompts in 4 minutes.', 'Trap round: "outweigh" prompts answered as lists — find the missing verdict.']
  },

  /* ---------------------------------------- Task Response */
  'tr-no-position': {
    name: 'No clear position', gate: 'TR',
    principle: 'The examiner must be able to say in one sentence what you think. Write that sentence in paragraph one — "I believe that…", "This essay argues that…" — and hold it to the end.',
    reteach: 'Band 6 TR: "a position is presented … although the conclusions drawn may be unclear". Band 7 needs "a clear and developed position". The thesis sentence is the cheapest half-band in the test.',
    activities: ['Thesis Sniper: write the one-sentence position for a prompt in 60 seconds.', 'Cover the conclusion: can a reader still say what the writer thinks?']
  },
  'tr-position-late': {
    name: 'Position only in the conclusion', gate: 'TR',
    principle: 'In a discuss-both-views essay your opinion must appear in the introduction AND the conclusion. An opinion that first appears in the last paragraph reads as an afterthought.',
    reteach: 'The classic Band 6 discuss essay: two neutral body paragraphs and a surprise verdict at the end. Make the thesis sentence part of the introduction frame.',
    activities: ['Move the verdict: rewrite a Band 6 intro so it carries the opinion.', 'Intro–conclusion echo: pair the two sentences and check they say the same thing.']
  },
  'tr-partial': {
    name: 'Part of the question not answered', gate: 'TR',
    principle: 'Count the parts of the prompt: two views? two questions? causes AND solutions? Each part needs its own developed paragraph. A part answered in one sentence is a part not answered.',
    reteach: 'Band 6: "the main parts are addressed (though some may be more fully covered than others)". Band 8: "sufficiently addressed". Make students number the parts before planning.',
    activities: ['Part count: read ten prompts, write the number of parts in each.', 'Balance check: count the words given to each part of a model essay.']
  },
  'tr-generalised': {
    name: 'Over-generalised claim', gate: 'TR',
    principle: 'A claim without a mechanism is an opinion. After every facet, say HOW it works: "X reduces Y because …, which in turn …". That is the 7→8 gate.',
    reteach: 'Band 7 TR is explicitly capped by "a tendency to over-generalise". De-generalise It: take a vague Band 6 sentence and add the mechanism and a concrete case.',
    activities: ['De-generalise It: five vague sentences, add a mechanism to each.', 'Because-chains: extend a claim three links with "which in turn".']
  },
  'tr-no-example': {
    name: 'No concrete example', gate: 'TR',
    principle: 'Support the mechanism with something you can point at: a city, a policy, a school, a practice. Your own country, school or family is a better source than "research shows".',
    reteach: 'Examiners cannot verify invented statistics and they read as memorised. A Bangkok example is worth more than "a recent survey found".',
    activities: ['Example bank: one real-world example per domain, from Thailand where possible.', 'Replace "studies show" in a paragraph with a named case.']
  },
  'tr-no-nuance': {
    name: 'No nuance', gate: 'TR',
    principle: 'Show the limit of each facet: "However, this overlooks …; in reality, …". Nuance proves you can think, and it is what "well-developed" means at Band 8.',
    reteach: 'A body paragraph that ends on its example is Band 7; one that admits the limit and keeps the position is Band 8. Drill the nuance sentence as a fixed move.',
    activities: ['Steel-man: write the strongest objection to your own facet in one sentence.', 'Nuance or contradiction? Sort sentences that limit the idea from ones that abandon the position.']
  },
  'tr-off-topic': {
    name: 'Off the topic', gate: 'TR',
    principle: 'Answer the prompt in front of you, not the prompt you prepared for. Every body paragraph must connect back to the Core Topic in its first sentence.',
    reteach: 'Memorised topic essays drift off the actual question. Make students underline the two or three key nouns of the prompt and use them in every topic sentence.',
    activities: ['Key-noun audit: circle the prompt nouns in each topic sentence.', 'Prompt swap: which paragraphs of a model would survive a change of prompt? Those are the off-topic ones.']
  },
  'tr-new-idea': {
    name: 'New idea in the conclusion', gate: 'TR',
    principle: 'The conclusion evaluates and restates; it never introduces a facet, an example or a solution that the body did not develop.',
    reteach: 'A new idea in the conclusion is an undeveloped idea, which costs TR and CC at once. If it is good, move it into a body paragraph.',
    activities: ['Conclusion audit: strike any noun that does not appear earlier in the essay.', 'Rewrite a conclusion so it evaluates rather than summarises.']
  },
  'tr-listing': {
    name: 'Listing instead of weighing', gate: 'TR',
    principle: '"Do the advantages outweigh the disadvantages?" asks for a verdict. Say which side is heavier and why — "the benefits clearly outweigh the drawbacks because …" — in the introduction and the conclusion.',
    reteach: 'The outweigh trap: two balanced paragraphs and no scale. Teach the verdict sentence as part of the introduction frame for this type.',
    activities: ['Verdict first: write the outweigh sentence before anything else.', 'Scale drawing: weight each side, then write the sentence the scale shows.']
  },
  'tr-solution-mismatch': {
    name: 'Solution does not answer the cause', gate: 'TR',
    principle: 'In a problem/solution essay, each solution must answer a cause you named. Cause: "cheap fast food is everywhere" → solution: "tax it", not "build more gyms".',
    reteach: 'Causal alignment is the top-band differentiator for this type. Draw arrows from each cause to its solution before writing.',
    activities: ['Arrow match: causes on the left, solutions on the right, draw the arrows.', 'Orphan hunt: find the solution with no cause.']
  },

  /* ---------------------------------------- Coherence and Cohesion */
  'cc-paragraphing': {
    name: 'Paragraphing', gate: 'CC',
    principle: 'Four paragraphs (five for some types): introduction, body A, body B, conclusion. A blank line between each. Never one long block, never bullet points.',
    reteach: 'Paragraphing is the visible half of planning. If the matrix was filled before writing, the paragraphs write themselves.',
    activities: ['Cut the block: divide a one-paragraph essay into four.', 'Skeleton race: label the four paragraphs of a model in 30 seconds.']
  },
  'cc-one-idea': {
    name: 'More than one idea in a paragraph', gate: 'CC',
    principle: 'One central idea per body paragraph: the facet, its mechanism, its example, its nuance. A second facet in the same paragraph is a second paragraph.',
    reteach: 'Band 7 CC names "a clear central topic within each paragraph". Students who fear running short pile ideas up; show them a single idea can carry 90 words.',
    activities: ['Idea count: how many facets are in this paragraph? Split it.', 'One idea, ninety words: develop a single facet to length.']
  },
  'cc-linker-overuse': {
    name: 'Linking words overused or mechanical', gate: 'CC',
    principle: 'Not every sentence needs "Firstly", "Moreover", "In addition". Link with meaning: "this trend", "such measures", "doing so", "the former", and by ending one sentence with what the next one is about.',
    reteach: 'Band 6 CC: cohesion "mechanical due to … overuse". The Linker Detox: rewrite a paragraph with no Firstly / Moreover / In conclusion, using reference and substitution only.',
    activities: ['Linker Detox: one paragraph, zero listed linkers.', 'Count the connectors in a Band 6 and a Band 8 paragraph — the 8 has fewer.']
  },
  'cc-reference': {
    name: 'Reference and substitution', gate: 'CC',
    principle: 'Refer back instead of repeating: "this policy", "such a ban", "doing so", "the former / the latter", "these developments". Band 7 CC rewards reference and substitution used flexibly.',
    reteach: 'Repetition of the full noun phrase in every sentence is the Band 6 signature. Teach five reference tools and require three per essay.',
    activities: ['Repeat hunt: circle every repeated noun phrase, replace half with a reference.', 'The former / the latter drill on two-view prompts.']
  },
  'cc-progression': {
    name: 'No progression between sentences', gate: 'CC',
    principle: 'End a sentence with the information the next sentence is about (known → new). Facet → mechanism → example → nuance is a progression; four unrelated claims is a list.',
    reteach: 'Thematic progression is what "the message can be followed with ease" means. Chain the sentences: the object of one becomes the subject of the next.',
    activities: ['Chain building: rewrite four sentences so each begins with the previous one\'s end.', 'Order the paragraph: sentences shuffled, restore the chain.']
  },

  /* ---------------------------------------- Lexical Resource */
  'lr-memorised': {
    name: 'Memorised phrase or cliché', gate: 'LR',
    principle: 'No "double-edged sword", "in a nutshell", "hot topic", "since the dawn of time", "every coin has two sides". Examiners discount memorised language; the template frames must be edited into your own words.',
    reteach: 'The descriptors name "over-dependence on … memorised language". A frame used verbatim in ten scripts from one school is spotted. Require each student to own their openers.',
    activities: ['Cliché bingo: find and replace five memorised phrases in a paragraph.', 'Own the frame: rewrite a template opener three ways.']
  },
  'lr-register': {
    name: 'Informal or personal language', gate: 'LR',
    principle: 'No contractions, no "you", no rhetorical questions, no exclamation marks, no "a lot of" / "kids" / "stuff". "I believe" is fine in the thesis; not in every sentence.',
    reteach: 'Register lapses are cheap to fix and visible. Give students a banned list and let them police each other.',
    activities: ['Register police: find the informal items in a paragraph.', 'Formalise: rewrite "kids these days use their phones a lot".']
  },
  'lr-collocation': {
    name: 'Collocation', gate: 'LR',
    principle: 'Words travel with partners: make a mistake, heavy rain, act as a deterrent, mitigate climate change, allocate funds, foster critical thinking. The right partner beats a rarer word.',
    reteach: 'LR 7→8 is collocation precision, not word rarity. Collocation Autopsy: collect the class\'s miscollocations and drill the correct pairs.',
    activities: ['Collocation Autopsy on last week\'s essays.', 'Completion buzzers: "___ a deterrent", "mitigate ___".']
  },
  'lr-precision': {
    name: 'Rare word used imprecisely', gate: 'LR',
    principle: 'A big word used slightly wrongly lowers the mark. Choose the mid-frequency academic word you control: "significant" over "paramount", "reduce" over "curtail" unless you are sure.',
    reteach: 'Thesaurus-swapping is the most common self-inflicted LR wound. Reward precision over display.',
    activities: ['Odd one out: three sentences, one has a misused rare word.', 'Downgrade drill: replace each misused rare word with the precise plain one.']
  },
  'lr-nominal': {
    name: 'Core Topic not a noun phrase', gate: 'LR',
    principle: 'The Core Topic is a nominalised noun phrase: "the regulation of private cars in city centres", "early foreign-language instruction" — not "banning cars" or "learning languages young".',
    reteach: 'The nominalised Core Topic is the seed of every academic sentence in the essay. Drill verb → noun: regulate → regulation, adopt → adoption.',
    activities: ['Nominalise the topic: ten prompts, ten noun phrases.', 'Verb–noun family table for the eight domains.']
  },
  'lr-domain': {
    name: 'Domain vocabulary', gate: 'LR',
    principle: 'Each domain has a small kit: education (curriculum, rote learning, vocational), environment (emissions, degradation, sustainable), crime (deterrent, rehabilitate, recidivism), health (sedentary, preventive, life expectancy) …',
    reteach: 'Eight domains, ten collocations each, is a term\'s work and covers most prompts. Teach the kit with the schema, not as a word list.',
    activities: ['Domain deck: ten collocations per domain in NotebookLM.', 'Swap the domain: rewrite a paragraph about health as one about crime.']
  },
  'lr-spelling': {
    name: 'Spelling and word formation', gate: 'LR',
    principle: 'Spell the kit correctly: government, environment, benefit, argument, necessary, separate, definitely, which, their. Watch word forms: economy / economic / economical.',
    reteach: 'Computer-delivered IELTS has no spell-check. Keep a personal list of ten.',
    activities: ['Dictation of ten kit words.', 'Word-family table: benefit / beneficial / beneficiary.']
  },
  'lr-repetition': {
    name: 'Repetition of the same word', gate: 'LR',
    principle: 'Do not use the prompt\'s key noun in every sentence. Vary with a synonym chain (cars → private vehicles → motoring) or a reference word (this practice, such measures).',
    reteach: 'Band 5 LR: "frequent simplifications and/or repetitions". A synonym chain of three per key noun is enough.',
    activities: ['Synonym chain: three alternatives for each prompt noun.', 'Repeat count on a Band 6 paragraph.']
  },

  /* ---------------------------------------- Grammar */
  'gra-nominalisation': {
    name: 'Nominalisation and noun phrases', gate: 'GRA',
    principle: 'Turn clauses into noun phrases: "Because prices rose, people bought less" → "Rising prices reduced consumption". Dense noun phrases are the Band 8 grammar driver.',
    reteach: 'Corpus research (Biber, Gray & Poonpon 2011): advanced academic complexity is phrasal, not clausal. Nominalisation Gym beats "use more subordinate clauses".',
    activities: ['Nominalisation Gym: ten clauses into noun phrases.', 'Count the nouns per verb in a Band 8 model.']
  },
  'gra-complex': {
    name: 'Complex sentence control', gate: 'GRA',
    principle: 'Master three or four structures to near-perfect accuracy before adding a fifth. A faulty complex sentence scores below a correct simple one.',
    reteach: 'Band 6: "complex structures are not marked by the same level of accuracy". Range before accuracy is the most common way students lower GRA.',
    activities: ['Accuracy audit: which of your complex sentences are error-free?', 'One upgrade per paragraph, no more.']
  },
  'gra-inversion': {
    name: 'Inversion', gate: 'GRA',
    principle: '"Seldom does this approach account for …", "Not only does this reduce costs, but it also …", "Rarely can such a policy succeed without …". Negative adverb + auxiliary + subject.',
    reteach: 'The structural swap for the nuance sentence. Drill the auxiliary: does / did / can / has.',
    activities: ['Swap drill: ten plain sentences into inversions.', 'Spot the broken inversion.']
  },
  'gra-cleft': {
    name: 'Cleft sentences', gate: 'GRA',
    principle: '"It is within real-world frameworks, such as …, that this trajectory most clearly manifests." "What drives obesity is not a lack of knowledge but a lack of access." It is … that / What … is.',
    reteach: 'The structural swap for the example sentence: isolates the example for emphasis and breaks the declarative rhythm.',
    activities: ['Cleft the example: rewrite each example sentence as "It is … that".', 'What-cleft the thesis.']
  },
  'gra-participle': {
    name: 'Participle phrases', gate: 'GRA',
    principle: '"… operates primarily by …, subsequently triggering …", "Faced with rising costs, many firms relocate." Attach an -ing / -ed phrase instead of writing another compound sentence.',
    reteach: 'The structural swap for the mechanism sentence. Watch the dangling participle: the subject of the phrase must be the subject of the sentence.',
    activities: ['Join with a participle: ten pairs of sentences.', 'Dangler hunt.']
  },
  'gra-concession': {
    name: 'Concession', gate: 'GRA',
    principle: '"While regulation is costly, the alternative is more costly still." "Although …, …". "Admittedly, …; however, …". Concession is how nuance is written.',
    reteach: 'Concessive subordination gives TR nuance and GRA range at once. Teach it as the grammar of the nuance sentence.',
    activities: ['Although-drill: pair each facet with its limit.', 'Fix the fragment: "Although it is cheap." needs a main clause.']
  },
  'gra-conditional': {
    name: 'Conditionals', gate: 'GRA',
    principle: '"If governments taxed sugar, consumption would fall." "Had cities invested earlier, congestion would be lower today." Second and third conditionals for hypothetical reasoning.',
    reteach: 'Conditionals carry solutions and predictions. Drill the verb forms; mixed conditionals only for C1.',
    activities: ['If-chain for solutions.', 'Tense check: match the condition to the result.']
  },
  'gra-article': {
    name: 'Articles', gate: 'GRA',
    principle: 'THE government of a country, THE environment, A ban (first mention) → THE ban. No article before plural or uncountable nouns in general: cars, pollution, education.',
    reteach: 'Article errors rarely impede meaning but cap GRA at 6 when frequent. Focus on the fixed phrases of the kit.',
    activities: ['Article gaps in a model paragraph.', 'The or nothing: 15 essay nouns.']
  },
  'gra-agreement': {
    name: 'Subject–verb agreement', gate: 'GRA',
    principle: '"The number of cars HAS risen." "Governments HAVE". "Everyone IS". Find the head noun of the subject and match the verb to it.',
    reteach: 'The head-noun rule fixes most agreement errors in long noun-phrase subjects — which is exactly what nominalisation produces, so teach them together.',
    activities: ['Find the head noun, choose the verb.', 'Agreement audit on nominalised sentences.']
  },
  'gra-plural': {
    name: 'Plurals and countability', gate: 'GRA',
    principle: 'Plural -s on countable plurals (many benefits, several countries). No -s on uncountables: advice, research, information, equipment, knowledge.',
    reteach: 'A Thai-learner classic. Keep a list of the uncountables that appear in essays.',
    activities: ['Countable or not: 20 essay nouns.', 'Spot the missing -s.']
  },
  'gra-punctuation': {
    name: 'Punctuation', gate: 'GRA',
    principle: 'Comma after an opening phrase (In Thailand, …; However, …). No comma splice: two full sentences need a full stop, a semicolon or a linking word. Capital letters for countries and languages.',
    reteach: 'Comma splices and missing commas after openers are the two visible faults. Long complex sentences need comma discipline.',
    activities: ['Punctuate a stripped model paragraph.', 'Splice hunt.']
  },
  'gra-word-form': {
    name: 'Word form', gate: 'GRA',
    principle: 'Choose the right member of the family: economy (noun) / economic (adjective) / economically (adverb); benefit / beneficial; succeed / success / successful.',
    reteach: 'Word-form errors cost LR and GRA together. Teach the family with the nominalisation drill.',
    activities: ['Family table for ten essay words.', 'Fix the form: "the economical growth".']
  },

  /* ---------------------------------------- structure (pre-flight only) */
  'struct-length': {
    name: 'Length', gate: 'TR',
    principle: 'At least 250 words; aim for 260–290. Under 250 gives the examiner too little evidence for the higher bands; over 320 multiplies errors and steals checking time.',
    reteach: 'Length is evidence. Too short and there is nothing to mark; too long and errors multiply.',
    activities: ['Word budget: 50 / 95 / 95 / 45.', 'Cut a 340-word essay to 280 without losing a variable.']
  },
  'struct-time': {
    name: 'Time management', gate: 'TR',
    principle: '5 minutes decode and fill the matrix · 30 minutes write · 5 minutes check. Position on the page in the first five minutes of writing. Hard stop at 40.',
    reteach: 'Students who plan for five minutes write better and faster than students who start writing immediately.',
    activities: ['Timed planning only: five minutes, eleven variables, no writing.', 'Full timed essay with the phase timer.']
  },
  'struct-template': {
    name: 'Template used verbatim', gate: 'LR',
    principle: 'The frames are scaffolding. Edit every opener into your own words and put the weight of the essay inside the variables. An essay that is mostly frame text reads as memorised.',
    reteach: 'The pre-flight check measures how much of the essay is unchanged frame text. Above a third is a warning; above half is red. Fade the scaffold: guided → skeleton → blank.',
    activities: ['Own the frame: rewrite each opener in three ways.', 'Skeleton mode essay: slot labels only.']
  }
};

/* --------------------------------------------------------------------------
   The registry the topic files push into. The order here is the order on the
   Modules screen and in the Flight plan.
   -------------------------------------------------------------------------- */
var TOPICS = [];
var MOCKS = [];
var PROMPTS = [];
var MODELS = [];

/* --------------------------------------------------------------------------
   Which gate each module mainly serves — used for the four readiness bars.
   -------------------------------------------------------------------------- */
var MODULE_GATES = {
  m00: ['TR'], m01: ['TR'], m02: ['TR'], m03: ['TR', 'LR'], m04: ['TR'],
  m05: ['CC', 'TR'], m06: ['TR', 'CC'], m07: ['CC'], m08: ['GRA', 'LR'], m09: ['GRA'],
  m10: ['LR'], m11: ['GRA', 'LR'], m12: ['TR', 'CC'], m13: ['TR', 'CC', 'LR', 'GRA']
};

window.CONTENT = {
  CEFR: CEFR, TYPES: TYPES, DOMAINS: DOMAINS, SCHEMAS: SCHEMAS, VARIABLES: VARIABLES,
  RANKS: RANKS, BADGES: BADGES, REMEDIATION: REMEDIATION,
  TOPICS: TOPICS, MOCKS: MOCKS, PROMPTS: PROMPTS, MODELS: MODELS, MODULE_GATES: MODULE_GATES
};
