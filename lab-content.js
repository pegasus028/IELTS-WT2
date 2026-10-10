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
    { id: 'B1', band: '5.5–6', bandLo: 5.5, bandHi: 6, tier: 'B2', name: 'From B1 · aim for Band 5.5–6', note: 'Clear, accurate sentences with everyday academic words.' },
    { id: 'B2', band: '6.5–7', bandLo: 6.5, bandHi: 7, tier: 'B2', name: 'From B2 · aim for Band 6.5–7', note: 'The Band 7 track: plain frames, precise ideas, few errors.' },
    { id: 'C1', band: '7.5–8', bandLo: 7.5, bandHi: 8, tier: 'C1', name: 'From C1 · aim for Band 7.5–8', note: 'The Band 8 track: nominalised noun phrases, flexible structures, rare errors.' },
    { id: 'C2', band: '8.5–9', bandLo: 8.5, bandHi: 9, tier: 'C1', name: 'From C2 · aim for Band 8.5–9', note: 'Natural, precise, effortless to follow. Cohesion the examiner does not notice.' }
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
        B2: ['This idea works by {mechA}.', 'It works by {mechA}.', 'This happens through {mechA}.'],
        C1: ['This dynamic operates primarily by {mechA}.', 'Its influence stems from {mechA}.', 'The argument rests on {mechA}.']
      } },
    { id: 'a-example', para: 'bodyA', name: 'Example A lead-in', slots: ['exA'], weight: 0.8, crit: ['TR'],
      fn: 'Leads into a specific, real example that proves Facet A.',
      why: 'The Band 7 limit is "a tendency to over-generalise". A named, concrete example is the cure.',
      tip: 'Avoid a bare "For example,". Choose a lead-in that fits a noun phrase or a clause, and remember which one it needs.',
      examples: {
        B2: ['We can see this happening in the real world in {exA}.', 'A clear example is {exA}.', 'This is easy to see in {exA}.'],
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
        B2: ['This side is based on {mechB}.', 'It works through {mechB}.', 'Supporters point to {mechB}.'],
        C1: ['This dimension functions through {mechB}.', 'The underlying process is {mechB}.', 'Its force derives from {mechB}.']
      } },
    { id: 'b-example', para: 'bodyB', name: 'Example B lead-in', slots: ['exB'], weight: 0.8, crit: ['TR'],
      fn: 'Leads into a specific, real example for Facet B.',
      why: 'Support at Band 8 is specific: a place, a policy, a figure you know is true, or your own experience.',
      tip: 'Make it a different structure from Example A so the paragraphs do not read like a copy.',
      examples: {
        B2: ['This usually leads to results like {exB}.', 'A good example of this is {exB}.', 'We see this in {exB}.'],
        C1: ['This is evidenced by {exB}.', 'The point is clearly illustrated by {exB}.', 'The effect is visible in {exB}.']
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
  /* The Type Switch Card (Oct 2026): what each slot of the Universal Spine
     means in each type. The student's sentences stay the same; only the job
     of the slots changes. */
  LAB.TYPE_SWITCH = [
    { id: 'DISCUSS', name: 'Discuss both views', a: 'View A', na: 'Limit of view A', b: 'View B', nb: 'Limit of view B', pos: 'Your view: one side favoured, or the terms on which you combine them', trap: 'Both views get a full paragraph' },
    { id: 'OPINION', name: 'Opinion (agree / disagree)', a: 'Reason 1, or the part you accept', na: 'Limit of reason 1', b: 'Reason 2, or the part you reject', nb: 'Its limit, or your rebuttal', pos: 'Agree, disagree or partly agree, and how far', trap: '"Partly" must name both parts' },
    { id: 'ADVANTAGE', name: 'Advantages / disadvantages', a: 'The main advantage', na: 'Limit of the advantage', b: 'The main disadvantage', nb: 'How far it can be managed', pos: 'Which side outweighs', trap: 'A verdict even when the prompt does not say "outweigh"' },
    { id: 'PROBLEM', name: 'Problem / solution', a: 'The main cause', na: 'A second cause', b: 'The solution that answers it', nb: 'Its limit, plus a second measure', pos: 'What must happen first', trap: 'Two causes and two measures when the prompt is plural' },
    { id: 'TWOPART', name: 'Two-part question', a: 'Answer to question 1', na: 'Limit of that answer', b: 'Answer to question 2', nb: 'Limit of that answer', pos: 'The direct answer to the evaluative question', trap: 'Each question in its own paragraph' }
  ];
  LAB.TYPE_FIT = { DISCUSS: 'good', ADVANTAGE: 'good', OPINION: 'ok', PROBLEM: 'hard', TWOPART: 'hard' };

  /* ------------------------------------------- blueprints for one type
     A blueprint can be built for one question type. Its lines then follow
     that type's playbook: the components keep their slots ([Facet A] is
     still [Facet A]), but the job of each line, its tip and its examples
     change, e.g. in a Problem/solution blueprint Facet A is the main cause
     and Facet B the solution that answers it. A blueprint with no type
     (built before October 2026) is an all-purpose frame and keeps the
     TYPE_FIT advice above. Only the fields that differ are listed;
     everything else comes from LAB.COMPONENTS.                         */
  LAB.BP_TYPES = [
    { id: 'DISCUSS', name: 'Discuss both views', signal: 'Discuss both views and give your own opinion.', blurb: 'Two views, then your verdict.' },
    { id: 'OPINION', name: 'Opinion (agree / disagree)', signal: 'To what extent do you agree or disagree?', blurb: 'Two reasons (or a reason and the counter-argument), then how far you agree.' },
    { id: 'ADVANTAGE', name: 'Advantages / disadvantages', signal: 'Do the advantages outweigh the disadvantages?', blurb: 'The main advantage, the main disadvantage, then which is heavier.' },
    { id: 'PROBLEM', name: 'Problem / solution', signal: 'What are the causes? What can be done?', blurb: 'The main cause, the solution that answers it, then what must happen.' },
    { id: 'TWOPART', name: 'Two-part question', signal: 'Why is this happening? Is it positive or negative?', blurb: 'One body paragraph for each question, then your overall view.' }
  ];
  LAB.TYPE_COMPONENTS = {
    OPINION: {
      'i-open': { fn: 'Introduces the statement the prompt asks you to judge, as the Core Topic.',
        examples: { B2: ['It is sometimes claimed that {core} is the right approach.', 'Many people now ask whether {core} is a good idea.', 'The idea of {core} divides opinion in many countries.'],
          C1: ['The proposition that {core} is desirable has gained considerable currency.', 'Calls for {core} have grown louder in recent years.', 'Few proposals provoke as much debate as {core}.'] } },
      'i-sides': { name: 'Your two reasons', fn: 'Names the two reasons behind your view: two reasons for it, or one reason and the counter-argument you will answer.',
        tip: 'Decide your stance before you write this line: agree, disagree or partly agree. The two slots are your reasons, not "both sides".',
        examples: { B2: ['I agree with this view because of {facetA} and {facetB}.', 'Two reasons support this: {facetA} and {facetB}.', 'The main reasons are {facetA} and {facetB}.'],
          C1: ['This view is persuasive on the grounds of {facetA} and, more decisively, {facetB}.', 'Two considerations justify it: {facetA} and {facetB}.', 'The case rests on {facetA} and on {facetB}.'] } },
      'i-position': { name: 'How far you agree', fn: 'Says exactly how far you agree, in paragraph one.',
        tip: 'Agree, disagree or partly agree, and with what. "Partly" must name the part you accept and the part you reject.',
        examples: { B2: ['This essay explains both reasons and concludes that {position}.', 'Overall, I believe that {position}.', 'In short, {position}.'],
          C1: ['This essay argues that {position}.', 'The position defended here is that {position}.', 'It will be argued that {position}.'] } },
      'a-topic': { name: 'Reason 1 topic sentence', fn: 'Opens body paragraph A with your first reason.',
        examples: { B2: ['The first reason is {facetA}.', 'My main reason is {facetA}.', 'The strongest point in favour is {facetA}.'],
          C1: ['The first justification concerns {facetA}.', 'The most immediate case rests on {facetA}.', 'Foremost among the reasons is {facetA}.'] } },
      'a-nuance': { name: 'Concession A', fn: 'Admits a limit of reason 1 and shows that it does not change your view.',
        tip: 'Concede in the first half, then come back to your view in the second half.',
        examples: { B2: ['Admittedly, {nuanceA}, but this does not weaken the main point.', 'It is true that {nuanceA}; even so, the reason still holds.', 'This is not always the case, as {nuanceA}.'],
          C1: ['While it is true that {nuanceA}, this qualification limits rather than negates the argument.', 'Granted, {nuanceA}; the central point nevertheless stands.', 'The point holds even though {nuanceA}.'] } },
      'b-topic': { name: 'Reason 2 (or the counter-argument)', fn: 'Opens body paragraph B with your second reason, or with the strongest argument against your view.',
        tip: 'If Facet B is the counter-argument, say clearly that it is what others think, then answer it in Nuance B.',
        examples: { B2: ['The second reason is {facetB}.', 'Some people would point instead to {facetB}.', 'A further reason is {facetB}.'],
          C1: ['A second, arguably stronger, consideration is {facetB}.', 'Opponents of this view point to {facetB}.', 'Equally persuasive is {facetB}.'] } },
      'b-nuance': { name: 'Concession B or rebuttal', fn: 'Admits a limit of reason 2, or answers the counter-argument, so the essay comes back to your view.',
        tip: 'If paragraph B was the counter-argument, this line is your rebuttal: say why it does not change your answer.',
        examples: { B2: ['It is true that {nuanceB}; even so, the overall benefit remains.', 'However, {nuanceB}, so this objection is not decisive.', 'Yet {nuanceB}, which is why my view does not change.'],
          C1: ['Not even the fact that {nuanceB} substantially undermines its weight.', 'This objection loses much of its force, however, once we recognise that {nuanceB}.', 'The objection fails, since {nuanceB}.'] } },
      'c-open': { examples: { B2: ['In conclusion, {core} has to be judged by its effects on real people.', 'To conclude, the debate over {core} comes down to two clear reasons.', 'Overall, {core} is a question with a clear answer.'],
          C1: ['In conclusion, the merits of {core} rest on two distinct grounds.', 'Ultimately, any verdict on {core} must weigh both reasons together.', 'Taken together, the arguments over {core} point one way.'] } },
      'c-position': { name: 'How far you agree (restated)', examples: { B2: ['For these reasons, {position}.', 'I therefore believe that {position}.', 'My answer is that {position}.'],
          C1: ['It follows that {position}.', 'On balance, {position}.', 'The defensible position is therefore that {position}.'] } }
    },
    ADVANTAGE: {
      'i-open': { examples: { B2: ['The topic of {core} has both benefits and drawbacks.', 'The rise of {core} brings clear gains and some real costs.', 'People disagree about whether {core} is good or bad.'],
          C1: ['The emergence of {core} has generated both considerable benefits and genuine costs.', 'The spread of {core} carries gains that are easy to see and costs that are easy to miss.', 'Assessments of {core} vary sharply.'] } },
      'i-sides': { name: 'Main advantage and disadvantage', fn: 'Names the main advantage (Facet A) and the main disadvantage (Facet B).',
        examples: { B2: ['The main advantage is {facetA}, while the main disadvantage is {facetB}.', 'It offers {facetA}, but it also brings {facetB}.', 'On the plus side there is {facetA}; on the minus side there is {facetB}.'],
          C1: ['Its principal advantage lies in {facetA}, whereas its most significant drawback is {facetB}.', 'The gains centre on {facetA}; the costs centre on {facetB}.', 'Set against {facetA} is {facetB}.'] } },
      'i-position': { name: 'Which outweighs (preview)', fn: 'Tells the examiner which side is heavier, in paragraph one.',
        tip: 'Even "Describe the advantages and disadvantages" needs a verdict. Say which side weighs more.',
        examples: { B2: ['In my opinion, {position}.', 'Overall, I think that {position}.', 'I would argue that {position}.'],
          C1: ['On balance, this essay argues that {position}.', 'This essay maintains that {position}.', 'The verdict reached here is that {position}.'] } },
      'a-topic': { name: 'Advantage topic sentence', fn: 'Opens body paragraph A with the main advantage.',
        examples: { B2: ['The clearest benefit is {facetA}.', 'The biggest advantage is {facetA}.', 'On the positive side, there is {facetA}.'],
          C1: ['The foremost benefit is {facetA}.', 'Chief among the gains is {facetA}.', 'The most compelling advantage is {facetA}.'] } },
      'a-mech': { examples: { B2: ['This comes about by {mechA}.', 'This benefit appears by {mechA}.', 'It helps by {mechA}.'],
          C1: ['This advantage arises from {mechA}.', 'The gain stems from {mechA}.', 'It operates by {mechA}.'] } },
      'a-nuance': { name: 'Limit of the advantage', examples: { B2: ['Of course, {nuanceA}, but the advantage is still real.', 'This is not always true, because {nuanceA}.', 'Still, {nuanceA}.'],
          C1: ['Admittedly, {nuanceA}; nonetheless, the gain is substantial.', 'The benefit is not universal, since {nuanceA}.', 'It would be naive to ignore that {nuanceA}.'] } },
      'b-topic': { name: 'Disadvantage topic sentence', fn: 'Opens body paragraph B with the main disadvantage.',
        examples: { B2: ['The most serious drawback is {facetB}.', 'On the negative side, there is {facetB}.', 'The main problem is {facetB}.'],
          C1: ['Set against this is {facetB}.', 'The principal cost, however, is {facetB}.', 'Less visible, but no less real, is {facetB}.'] } },
      'b-mech': { examples: { B2: ['The problem arises from {mechB}.', 'This happens through {mechB}.', 'It does harm by {mechB}.'],
          C1: ['The difficulty stems from {mechB}.', 'The harm operates through {mechB}.', 'This cost accrues through {mechB}.'] } },
      'b-nuance': { name: 'Limit of the disadvantage', fn: 'Shows how far the disadvantage can be managed, which prepares your verdict.',
        examples: { B2: ['However, {nuanceB}, so this drawback can be managed.', 'Still, {nuanceB}, which makes the problem smaller.', 'Even so, {nuanceB}.'],
          C1: ['It should be noted, however, that {nuanceB}, which means the cost is neither inevitable nor unmanageable.', 'Yet {nuanceB}, so the cost can be contained.', 'This cost is real but limited, because {nuanceB}.'] } },
      'c-open': { examples: { B2: ['To conclude, {core} has a good side and a bad side.', 'In conclusion, the effects of {core} are mixed.', 'Overall, {core} brings gains and losses.'],
          C1: ['In conclusion, the effects of {core} are mixed rather than uniform.', 'Taken together, the evidence on {core} points in two directions.', 'Ultimately, {core} cannot be judged by its gains alone.'] } },
      'c-position': { name: 'The verdict (which outweighs)', fn: 'Says which side is heavier, in new words.',
        examples: { B2: ['When the two are weighed, {position}.', 'On balance, {position}.', 'Looking at both, {position}.'],
          C1: ['Once the two are weighed against each other, {position}.', 'The balance of evidence suggests that {position}.', 'Weighed carefully, {position}.'] } }
    },
    PROBLEM: {
      'i-open': { fn: 'Introduces the problem the prompt describes, as the Core Topic.',
        examples: { B2: ['The problem of {core} is a serious one in many countries.', '{core} is now a common problem in many places.', 'Many cities and families now face {core}.'],
          C1: ['The issue of {core} has become increasingly pressing.', 'Few problems affect daily life as directly as {core}.', 'The persistence of {core} demands explanation.'] } },
      'i-sides': { name: 'The cause and the solution', fn: 'Names the main cause (Facet A) and the solution that answers it (Facet B).',
        tip: 'The solution must answer the cause you name. If the cause is "late-night phone use", the solution cannot be "more school buses".',
        examples: { B2: ['Its main cause is {facetA}, and the best response is {facetB}.', 'This problem comes mainly from {facetA}, and the answer is {facetB}.', 'It is driven by {facetA}, so the remedy is {facetB}.'],
          C1: ['Its primary cause is {facetA}, and the most promising remedy is {facetB}.', 'The problem is rooted in {facetA}; the remedy lies in {facetB}.', 'Behind it lies {facetA}, and against it the strongest measure is {facetB}.'] } },
      'i-position': { name: 'What must happen (preview)', fn: 'Tells the examiner in paragraph one what must happen, and by whom.',
        tip: 'If the prompt names actors (schools, parents, governments), your position says who does what.',
        examples: { B2: ['This essay explains the cause and then the solution, arguing that {position}.', 'I believe that {position}.', 'The answer, I would argue, is that {position}.'],
          C1: ['This essay examines the cause before evaluating the remedy, concluding that {position}.', 'It argues that {position}.', 'The argument here is that {position}.'] } },
      'a-topic': { name: 'Cause topic sentence', fn: 'Opens body paragraph A with the main cause.',
        examples: { B2: ['The root of the problem is {facetA}.', 'The main cause is {facetA}.', 'The problem starts with {facetA}.'],
          C1: ['At the root of the problem lies {facetA}.', 'The principal driver of this problem is {facetA}.', 'The problem originates in {facetA}.'] } },
      'a-mech': { name: 'How the cause works', fn: 'Leads into how the cause creates the problem: the chain from cause to effect.',
        examples: { B2: ['It creates the problem by {mechA}.', 'This cause works by {mechA}.', 'This leads to the problem by {mechA}.'],
          C1: ['The cause operates by {mechA}.', 'Its effect comes about through {mechA}.', 'The damage is done by {mechA}.'] } },
      'a-example': { name: 'Where the problem is seen', examples: { B2: ['We can see the effect in {exA}.', 'This is clear in {exA}.', 'One place where this happens is {exA}.'],
          C1: ['The consequences are visible in {exA}.', 'Nowhere is this clearer than in {exA}.', 'A telling case is {exA}.'] } },
      'a-nuance': { name: 'Second cause / why it is hard to fix', fn: 'Adds a second cause, or explains why the problem is hard to solve. A prompt that says "causes" needs at least two.',
        tip: 'A second cause belongs here, so the plural in the prompt is answered.',
        examples: { B2: ['Unfortunately, {nuanceA}, which makes the problem hard to solve.', 'On top of this, {nuanceA}.', 'A second cause is that {nuanceA}.'],
          C1: ['Compounding the difficulty, {nuanceA}, which renders the problem resistant to simple intervention.', 'A second factor makes matters worse: {nuanceA}.', 'The problem is aggravated by the fact that {nuanceA}.'] } },
      'b-topic': { name: 'Solution topic sentence', fn: 'Opens body paragraph B with the solution that answers the cause in paragraph A.',
        examples: { B2: ['The most effective solution is {facetB}.', 'The best way to tackle this is {facetB}.', 'One clear answer is {facetB}.'],
          C1: ['The remedy that most directly addresses this cause is {facetB}.', 'The most promising response is {facetB}.', 'The logical counter-measure is {facetB}.'] } },
      'b-mech': { name: 'How the solution answers the cause', fn: 'Leads into how the solution works against the cause you named.',
        examples: { B2: ['It works by {mechB}, which answers the cause above.', 'This helps by {mechB}.', 'This would work by {mechB}.'],
          C1: ['It succeeds by {mechB}, thereby targeting the source rather than the symptom.', 'Its value lies in {mechB}.', 'The measure works by {mechB}.'] } },
      'b-example': { name: 'Where it has worked', examples: { B2: ['Success can already be seen in {exB}.', 'This has already worked in {exB}.', 'A good model is {exB}.'],
          C1: ['The evidence of its effect lies in {exB}.', 'Its effect can already be seen in {exB}.', 'Instructive here is {exB}.'] } },
      'b-nuance': { name: 'Its limit (and a second measure)', fn: 'Admits the limit of the solution and adds a second measure or a second actor.',
        tip: 'Plural "measures" in the prompt: the second one fits here.',
        examples: { B2: ['Admittedly, {nuanceB}, so it is not a complete answer.', 'This will not solve everything, because {nuanceB}.', 'It also needs support, since {nuanceB}.'],
          C1: ['It must be conceded that {nuanceB}, so the measure is necessary rather than sufficient.', 'On its own, however, it falls short: {nuanceB}.', 'Its reach is limited, since {nuanceB}.'] } },
      'c-open': { examples: { B2: ['In conclusion, {core} has a clear cause and a clear solution.', 'To sum up, {core} can be reduced if we act on its cause.', 'Overall, {core} is a problem we can solve.'],
          C1: ['In conclusion, since {core} stems from an identifiable cause, it is far from inevitable.', 'Ultimately, {core} is a problem with a traceable cause.', 'Taken together, the causes of {core} point to their own remedy.'] } },
      'c-position': { name: 'What must happen', fn: 'Says what must happen, and by whom, in new words.',
        examples: { B2: ['The most important step is that {position}.', 'For this reason, {position}.', 'What we need is for {position}.'],
          C1: ['The logical response is therefore that {position}.', 'What is needed, then, is that {position}.', 'It follows that {position}.'] } }
    },
    TWOPART: {
      'i-open': { fn: 'Introduces the situation both questions are about, as the Core Topic.',
        examples: { B2: ['The issue of {core} raises two questions.', 'The trend of {core} leads to two important questions.', 'There are two things to ask about {core}.'],
          C1: ['The question of {core} invites two distinct enquiries.', 'The spread of {core} raises two separate questions.', 'Two questions follow from {core}.'] } },
      'i-sides': { name: 'Your two answers', fn: 'Gives your answer to question 1 (Facet A) and to question 2 (Facet B).',
        tip: 'Read the two questions again. Facet A answers the first one, Facet B the second, in the same order.',
        examples: { B2: ['The first is answered by {facetA}, and the second by {facetB}.', 'My answer to the first is {facetA}; my answer to the second is {facetB}.', 'In short, the answers are {facetA} and {facetB}.'],
          C1: ['This essay responds to the first with {facetA} and to the second with {facetB}.', 'The answers lie in {facetA} and in {facetB} respectively.', 'The first turns on {facetA}, the second on {facetB}.'] } },
      'i-position': { name: 'Your overall view (preview)', examples: { B2: ['Overall, I believe that {position}.', 'This essay deals with each in turn and argues that {position}.', 'My view is that {position}.'],
          C1: ['Taken together, these answers suggest that {position}.', 'This essay argues that {position}.', 'The overall judgement here is that {position}.'] } },
      'a-topic': { name: 'Answer to question 1', fn: 'Opens body paragraph A with your answer to the first question.',
        tip: 'Echo the first question so the examiner sees which one you are answering, without copying it.',
        examples: { B2: ['In answer to the first question, the main reason is {facetA}.', 'The first question is best answered by {facetA}.', 'The first answer is {facetA}.'],
          C1: ['With regard to the first question, the answer lies in {facetA}.', 'The first question turns on {facetA}.', 'The first enquiry is answered by {facetA}.'] } },
      'a-nuance': { examples: { B2: ['It should be said that {nuanceA}, but the main answer stands.', 'Not everyone fits this pattern, because {nuanceA}.', 'Of course, {nuanceA}.'],
          C1: ['Granted, {nuanceA}; the central answer nevertheless holds.', 'This answer needs one qualification: {nuanceA}.', 'The picture is less uniform than it seems, since {nuanceA}.'] } },
      'b-topic': { name: 'Answer to question 2', fn: 'Opens body paragraph B with your answer to the second question.',
        examples: { B2: ['As for the second question, my answer is {facetB}.', 'The second question is answered by {facetB}.', 'On the second question, the key point is {facetB}.'],
          C1: ['As for the second question, {facetB} is the decisive factor.', 'On the second question, the answer turns on {facetB}.', 'The second enquiry is settled by {facetB}.'] } },
      'b-nuance': { examples: { B2: ['Even so, {nuanceB}, which is worth remembering.', 'However, {nuanceB}.', 'Still, this is not the whole story, because {nuanceB}.'],
          C1: ['That said, {nuanceB}, which qualifies but does not overturn this answer.', 'This answer must be tempered, however: {nuanceB}.', 'Yet {nuanceB}.'] } },
      'c-open': { examples: { B2: ['In conclusion, both questions about {core} have clear answers.', 'To conclude, {core} has a clear cause and a clear effect.', 'Overall, {core} can be explained and judged.'],
          C1: ['In conclusion, the two questions raised by {core} have connected answers.', 'Ultimately, {core} is best understood by its causes and its effects together.', 'Taken together, the answers about {core} are linked.'] } },
      'c-position': { name: 'Your overall view', examples: { B2: ['Taken together, {position}.', 'All in all, {position}.', 'My overall view is that {position}.'],
          C1: ['Considered together, {position}.', 'The overall judgement must be that {position}.', 'On balance, {position}.'] } }
    }
  };

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
