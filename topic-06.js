/* POSITION CONTROL — topic-06.js · Module 06 Synthesis */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm06', n: 6, code: 'Module 06', name: 'Synthesis', art: 'scope', cefr: 'B1–C1',
    blurb: 'The verdict and the one reason it is right: how the last paragraph evaluates instead of repeating.',
    levels: [{
      id: 'm06l1', n: 1, name: 'Synthesis', cefr: 'B1–C1', blurb: 'Variables 10 and 11 of the matrix: the Synthesized Position and its Rationale, and the conclusion that carries them.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm06s1', name: 'Synthesized Position', cefr: 'B1',
          theory: {
            key: 'The Synthesized Position is your verdict: the position that takes the best of both facets, or chooses one and says why. "It depends" is not a verdict.',
            body: [
              '<p>After two body paragraphs the reader knows Facet A, Facet B, and the limit of each. Variable 10 is what you make of that. The Task Response descriptor asks for <em>"a clear and developed position"</em>, and at Band 6 it warns that <em>"the conclusions drawn may be unclear, unjustified or repetitive"</em>. A <strong>synthesized</strong> position is neither. It is one sentence the examiner can quote, and it is built from the two nuances: because Facet A has a limit and Facet B has a limit, the right answer is usually the version of one side that respects the other. <em>"Councils should invest in public transport while phasing out the dirtiest vehicles"</em> keeps the clean air of Facet A and the freedom to travel of Facet B.</p>',
              '<p>There are two honest shapes. The first <strong>takes the best of both</strong>: a main clause for the side you lean to, and a <em>while</em>, <em>as long as</em> or <em>provided that</em> clause that carries what the other side got right. The second <strong>picks one side and says why</strong>: <em>"the disadvantages outweigh the advantages for most secondary students, so online lessons should add to the classroom rather than replace it"</em>. Both are verdicts. What decides between them is your two nuances, not a rule: if one side\'s limit is small and the other\'s is large, pick a side.</p>',
              '<p>Three sentences look like a verdict and are not. <strong>Fence-sitting</strong>: <em>"it depends on the situation"</em>, <em>"both sides have strong points"</em>. This describes the debate; it does not enter it, and the examiner cannot say what you think. <strong>One side repeated as an absolute</strong>: <em>"every country must ban the private car outright"</em>. That ignores the nuance you wrote in Body A, so the essay now argues with itself, and an absolute claim is exactly the <em>"tendency to over-generalise"</em> that caps Task Response at 7. <strong>The near-miss</strong>: a sentence that sounds balanced but quietly drops one side, such as <em>"governments should ban private cars and leave citizens to make their own arrangements"</em>; the freedom facet has been mentioned, not respected.</p>',
              '<p>For the other question types the verdict changes its clothes, not its job. An opinion essay states it as agreement with a condition; an advantages essay must contain the word of the question, <em>outweigh</em>, or a clear scale: <em>"the advantages outweigh the disadvantages, as long as footage is kept only briefly"</em>. A two-part question with <em>positive or negative development</em> needs the adjective in the sentence. Write the verdict once in the introduction and once, in fresh words, in the conclusion: the same position, held from the first paragraph to the last.</p>'
            ],
            simple: [
              '<p>Variable 10 is your verdict, in one sentence. It comes from your two nuances: each side has a limit, so the best answer is usually one side with a condition that respects the other. "Councils should invest in public transport while phasing out the dirtiest vehicles."</p>',
              '<p>Two shapes: take the best of both ("A, while B"), or pick one side and say why. Not a verdict: "it depends", "both sides have good points", or one side as an absolute rule ("every country must ban…").</p>',
              '<p>For an "outweigh" question the verdict must say which side is heavier. For "positive or negative" it must say which. Write it in the introduction and again in the conclusion.</p>'
            ],
            examples: [
              { s: 'Councils should invest in public transport while phasing out the dirtiest vehicles.', g: 'Takes the best of both: cleaner air (Facet A) and the ability to travel (Facet B), joined by "while".' },
              { s: 'The disadvantages outweigh the advantages for most secondary students, so online lessons should add to the classroom rather than replace it.', g: 'Picks a side and says why. "Outweigh" answers the question that was asked.' },
              { s: '<s>Whether cars should be banned really depends on the city and on the people who live there.</s>', g: 'Fence-sitting. It describes the debate; the examiner still cannot say what the writer thinks.' },
              { s: '<s>Every country must ban the private motor car outright if urban air quality is to improve.</s>', g: 'One side as an absolute. It forgets the nuance of Body A and over-generalises.' }
            ]
          },
          items: [
            { id: 'm06s1q1', type: 'choose', tag: 'tr-no-position', level: 'B1', prompt: 'p-cars-city',
              stem: 'Which sentence is a synthesized position for this prompt: a verdict that takes the best of both views?',
              options: ['Every country must ban the private motor car outright if urban air quality is to improve.', 'Councils should invest in public transport while phasing out the dirtiest vehicles.', 'There are strong arguments on both sides, and the right answer depends on each city.', 'Governments should ban private cars and leave citizens to make their own arrangements.'], answer: 1,
              why: 'A synthesized position keeps what each side got right: cleaner air and the ability to travel. The first option is one side as an absolute, the third is fence-sitting, and the last mentions citizens only to abandon them. The examiner must be able to quote one sentence that says what you think.' },
            { id: 'm06s1q2', type: 'judge', tag: 'tr-listing', level: 'B1', prompt: 'p-cctv-everywhere',
              given: 'The advantages of cameras outweigh the disadvantages, provided that footage is kept only briefly and access to it is tightly controlled.',
              stem: 'Does this sentence answer the question "Do the advantages outweigh the disadvantages?"', answer: 0,
              hint: 'An outweigh question is an opinion question: read the sentence as the examiner and ask whether you can tell which way the writer leans.',
              why: 'True. It says which side is heavier, using the word of the question, and adds the condition that respects the other side. Compare "cameras bring safety and risk in equal measure, and each community must weigh them for itself": that hands the question back to the reader and gives the examiner nothing to quote.' },
            { id: 'm06s1q3', type: 'sort', tag: 'tr-no-position', level: 'B2',
              stem: 'Sort each verdict: a synthesized position, one side repeated as an absolute, or fence-sitting?',
              bins: [{ key: 'syn', label: 'Synthesized position', hint: 'a verdict with a condition' }, { key: 'side', label: 'One side, absolute', hint: 'ignores the nuance' }, { key: 'fence', label: 'Fence-sitting', hint: 'no verdict at all' }],
              items: [
                { text: 'Schools should keep competition in sport but build it around personal improvement rather than ranking.', bin: 'syn' },
                { text: 'Competitive sport should be removed from schools until children reach sixteen.', bin: 'side' },
                { text: 'Whether competition helps or harms a child really depends on the child.', bin: 'fence' },
                { text: 'Regulators should require proven alternatives and use animals only where nothing else works.', bin: 'syn' },
                { text: 'Animal testing should continue freely because human life matters more than animal life.', bin: 'side' },
                { text: 'Both views on animal testing deserve respect, and it is hard to say which is right.', bin: 'fence' }
              ],
              why: 'A synthesized position has a main clause and a condition that respects the other side ("but", "only where"). One side as an absolute ("removed", "freely") forgets the nuance the body admitted. Fence-sitting ("depends", "hard to say") never enters the debate, so there is no position to mark.' },
            { id: 'm06s1q4', type: 'choose', tag: 'tr-listing', level: 'B2', prompt: 'p-online-learning',
              stem: '"Do the advantages outweigh the disadvantages?" Which position answers that question?',
              options: ['Online lessons have clear advantages and clear disadvantages for secondary students.', 'The right balance between online and classroom learning depends on the individual student.', 'Secondary schools should stop all online teaching completely and return every lesson to the classroom in full.', 'The disadvantages outweigh the advantages, so online lessons should add to the classroom, not replace it.'], answer: 3,
              hint: 'Three of these avoid the scales in three different ways; only one actually puts something on them.',
              why: 'The question asks for a weighing, and only one option weighs: the disadvantages are heavier, so online lessons add to class rather than replace it. The first option lists, the second hands the decision to the student, and the third is one side as an absolute, which ignores the freedom that Facet A described.' },
            { id: 'm06s1q5', type: 'spot', tag: 'tr-no-position', level: 'B2', prompt: 'p-cars-city',
              stem: 'Tap the chunk that turns this verdict back into fence-sitting.',
              words: ['In my view,', 'councils should invest', 'in public transport', 'while phasing out', 'the dirtiest vehicles,', 'although it really depends', 'on each city.'], answer: 5,
              fix: 'because good policy must protect the air and keep people moving.',
              why: 'The sentence had a verdict with a condition until "although it really depends" took it back. A nuance limits a facet; it does not cancel the position. Replace the escape clause with the reason, and the verdict stands.' },
            { id: 'm06s1q6', type: 'build', tag: 'tr-no-position', level: 'B1', prompt: 'p-competitive-sport',
              stem: 'Build the synthesized position: keep one side, add the condition that respects the other.',
              tiles: ['Schools should keep', 'competition in sport', 'but build it', 'around personal improvement', 'rather than ranking.'],
              solution: 'Schools should keep competition in sport but build it around personal improvement rather than ranking.', alt: [],
              why: 'The main clause keeps Facet A (competition teaches discipline); "but build it around personal improvement" carries what Facet B got right (ranking creates stress). One sentence, one verdict, both sides respected.' },
            { id: 'm06s1q7', type: 'thesis', tag: 'tr-no-position', level: 'B2', prompt: 'p-tourism',
              stem: 'Write the synthesized position for this prompt in one sentence: the income is real, the damage is real, so what should happen?',
              must: [['touris', 'visitor']], minWords: 12, maxWords: 45,
              _good: 'I believe that governments should limit visitor numbers and spend the income from tourism on protecting local culture and nature.',
              _bad: 'It depends on the country, because tourism has both good and bad sides.',
              why: 'A verdict with a condition: limit the numbers (Facet B respected), keep the income and aim it at culture and nature (Facet A respected). "It depends" and "both good and bad sides" describe the debate and give the examiner nothing to quote.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm06s2', name: 'Rationale', cefr: 'B2',
          theory: {
            key: 'The Rationale is the one logical reason your position is right. It is not the position said again, and it is not a new facet.',
            body: [
              '<p>Variable 11 answers a question the reader is now asking: <em>why that verdict and not another?</em> The Band 6 descriptor names conclusions that are <em>"unjustified"</em>; the Rationale is the justification. It is one sentence, it begins with <em>because</em> or <em>since</em> in the frames, and it states the principle that made you choose: <em>"good city policy has to protect the environment and keep people able to travel"</em>. Notice that it is more general than the position. The position says what should happen; the rationale says what any good answer to this prompt must do, and shows that yours does it.</p>',
              '<p>The most common fault is the <strong>restatement</strong>: <em>"This view makes the most sense because employers should combine home working with days in the office"</em>. That is the position again in different words, so the essay ends with a circle: X is right because X. Test it by putting the two sentences side by side. If the "because" sentence could be deleted and the position would lose nothing, it was a restatement. A real rationale adds a new level: <em>"because a hybrid arrangement raises efficiency while protecting the wellbeing of staff"</em> names the two things at stake and says the verdict serves both.</p>',
              '<p>The second fault is the <strong>new idea</strong>: a "because" that brings in a facet the body never developed, such as <em>"because cooking lessons in primary schools would also improve the national diet"</em> in an essay about taxing fast food. It may be true, but the reader has no mechanism or example for it, so it is an undeveloped claim in the last paragraph, and it costs Task Response and Coherence at once. The rationale must be built from the two facets and their nuances, because those are the only materials the essay has put on the table.</p>',
              '<p>A rationale is also not a slogan. <em>"Cleaner air is the single most important aim of government policy everywhere"</em> is the near-miss: it sounds like a principle, but it is an absolute claim with nothing behind it, and it supports one side only. Compare <em>"the result depends on setting the right level for local conditions, not on the policy"</em>: that explains exactly why the verdict on the minimum wage was "let independent experts set it by region". The test for a good rationale is that it points back to both nuances and forward to the verdict in one line.</p>'
            ],
            simple: [
              '<p>Variable 11 is the one reason your verdict is right. "Because good city policy has to protect the environment AND keep people able to travel" explains why the verdict kept both sides.</p>',
              '<p>Not a rationale: the position said again ("because councils should put money into buses"), or a new idea the body never explained ("because cooking lessons would help too").</p>',
              '<p>Test: put the position and the "because" sentence together. Does the second add a new level, a principle? If you could delete it and lose nothing, rewrite it.</p>'
            ],
            examples: [
              { s: 'This view makes the most sense because good city policy has to protect the environment and keep people able to travel.', g: 'A principle: any good answer must do two things, and the verdict does both.' },
              { s: '<s>This view makes the most sense because councils should invest in buses and trains and remove the most polluting cars.</s>', g: 'A restatement. The position in other words; the circle closes and nothing is explained.' },
              { s: '<s>This view makes the most sense because the car industry also provides thousands of jobs.</s>', g: 'A new idea. No paragraph developed it, so it is a claim with no support, and it is not even about the verdict.' },
              { s: 'This view makes the most sense because the cause is a clash between biology and the timetable, and only the timetable can be changed.', g: 'Points back to the cause named in Body A and forward to the solution: the reason the later start is the right answer.' }
            ]
          },
          items: [
            { id: 'm06s2q1', type: 'choose', tag: 'tr-generalised', level: 'B1', prompt: 'p-cars-city',
              stem: 'The position: councils should invest in public transport while phasing out the dirtiest vehicles. Which sentence is its rationale?',
              options: ['Good city policy has to protect the environment and keep people able to travel.', 'Councils should put money into buses and trains and remove the most polluting cars.', 'Cleaner air is the single most important aim of government policy everywhere.', 'The car industry also provides thousands of jobs across the whole country.'], answer: 0,
              why: 'The rationale is the principle behind the verdict: policy must do two things, and this verdict does both. The second option is the position again in other words, the third is an absolute slogan that supports one side only, and the fourth is a new facet the body never developed.' },
            { id: 'm06s2q2', type: 'sort', tag: 'tr-generalised', level: 'B2',
              stem: 'Sort each "because" sentence: a rationale, a restatement of the position, or a new idea?',
              bins: [{ key: 'rat', label: 'Rationale', hint: 'the principle behind the verdict' }, { key: 'rest', label: 'Restatement', hint: 'the position again' }, { key: 'new', label: 'New idea', hint: 'never developed in the body' }],
              items: [
                { text: 'because choice only means something when a cheap, healthy option is actually available nearby', bin: 'rat' },
                { text: 'because the government should tax harmful ingredients and lower the price of healthy food', bin: 'rest' },
                { text: 'because cooking lessons in primary schools would also improve the national diet', bin: 'new' },
                { text: 'because a hybrid arrangement raises efficiency while protecting the wellbeing of staff', bin: 'rat' },
                { text: 'because firms should combine home working with days set aside for meeting in the office', bin: 'rest' },
                { text: 'because city-centre cafés are losing the office workers they depend on', bin: 'new' }
              ],
              why: 'A rationale names the principle the verdict serves (choice needs a real option; a hybrid serves efficiency and wellbeing). A restatement is the verdict in other words, so it explains nothing. A new idea brings in a facet with no mechanism or example behind it, which the conclusion is not allowed to do.' },
            { id: 'm06s2q3', type: 'judge', tag: 'tr-generalised', level: 'B2', prompt: 'p-remote-work',
              given: 'This view makes the most sense because a hybrid week raises efficiency while protecting the wellbeing of staff.',
              stem: 'The position is "firms should adopt hybrid models". Is the "because" clause a rationale?', answer: 0,
              hint: 'Test it: delete the "because" clause and ask whether the position has lost its reason or lost nothing.',
              why: 'True. The clause adds a level the position did not have: it names the two things at stake, efficiency and wellbeing, and says the verdict serves both. Delete it and the verdict is unjustified. Compare "because employers should combine home working with days in the office": that is the position again, and deleting it loses nothing.' },
            { id: 'm06s2q4', type: 'choose', tag: 'tr-new-idea', level: 'B2', prompt: 'p-elderly-care',
              stem: 'The position: the state guarantees the medical and financial basis of care, and families give the rest. Which rationale fits?',
              options: ['No government has enough money on its own to care for all of its older citizens.', 'Older people should be free to choose who will look after them in their final years.', 'Ageing well needs both the security that shared funding gives and the closeness that families give.', 'Retirement villages with nursing included are becoming popular among wealthier pensioners in many countries.'], answer: 2,
              why: 'The verdict keeps both sides, so the rationale must say why both are needed: security from shared funding, closeness from the family. The first option supports one side only, the second is a different principle that the body never argued, and the last is a new example that appears nowhere else in the essay.' },
            { id: 'm06s2q5', type: 'spot', tag: 'tr-new-idea', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Tap the chunk where the rationale stops explaining the verdict and starts a new idea.',
              words: ['This view makes the most sense', 'because habits formed at school', 'last for decades,', 'and school is the one place', 'where everyone\'s habits', 'can change at once,', 'and healthy food is also cheaper for parents.'], answer: 6,
              fix: 'Stop at "at once." The rationale is complete.',
              why: 'Up to "at once" the sentence explains why a school ban is the right answer: habits last, and school reaches everyone. "Healthy food is also cheaper for parents" is a new claim with no mechanism or example behind it. A conclusion that adds ideas costs Task Response and Coherence together.' },
            { id: 'm06s2q6', type: 'build', tag: 'tr-generalised', level: 'B2', prompt: 'p-teen-sleep',
              stem: 'Build the rationale for a later school start: name the cause, then say why only one side of it can change.',
              tiles: ['This view makes the most sense', 'because the cause is', 'a clash between biology', 'and the timetable,', 'and only the timetable', 'can be changed.'],
              solution: 'This view makes the most sense because the cause is a clash between biology and the timetable, and only the timetable can be changed.', alt: [],
              why: 'The rationale points back to the cause in Body A (biology against the timetable) and forward to the verdict (change the timetable). It explains the choice rather than repeating it: that is what "justified" means in the descriptor.' },
            { id: 'm06s2q7', type: 'choose', tag: 'tr-no-position', level: 'C1', prompt: 'p-private-tutoring',
              stem: 'The verdict: tutoring is a negative development that governments should limit. Which sentence is the rationale for that verdict?',
              options: ['Tutoring lets every hard-working student improve their results, whichever school they happen to attend.', 'Teachers in state schools are not paid enough to cover every topic in the syllabus.', 'An education system that rewards what families can pay defeats the purpose of a public exam.', 'Governments should limit tutoring by improving school teaching and reforming entrance exams.'], answer: 2,
              why: 'A rationale must hold the verdict up, not pull against it. The public-exam sentence explains why paid tutoring is a negative development. The first option argues the opposite side, the second explains why tutoring exists rather than why it is bad, and the last is the verdict restated.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm06s3', name: 'The conclusion evaluates', cefr: 'B2',
          theory: {
            key: 'A conclusion evaluates: it restates the verdict in fresh words and gives the reason. It does not summarise the body, and it never adds an idea.',
            body: [
              '<p>There are two kinds of last paragraph. A <strong>summary</strong> tells the reader what they have just read: <em>"The first paragraph showed the benefits of home working and the second showed its dangers."</em> An <strong>evaluation</strong> tells the reader what it adds up to: <em>"Set against each other, the benefits win only when the week keeps some days in the office."</em> The summary is a Band 6 conclusion, and the descriptor names it: conclusions that are <em>"repetitive"</em>. The evaluation is where variables 10 and 11 live. Forty-five words is enough: the Core Topic named once, the Synthesized Position in fresh words, the Rationale.</p>',
              '<p>The conclusion has a fixed shape, and the frames give it: a sentence that says one side alone is not enough, the verdict, the reason. <em>"To sum up, simply looking at [Core Topic] from one side is not enough. A better way to look at it is that [position]. This view makes the most sense because [rationale]."</em> The order matters: the verdict before the reason, because the reader needs to know what is being justified. Restate the verdict rather than copy it: if the introduction said <em>"councils should invest in public transport while phasing out the dirtiest vehicles"</em>, the conclusion can say <em>"the answer is better buses and trains first, and the dirtiest cars gone after"</em>. Same position, new words.</p>',
              '<p>The one absolute rule is <strong>no new idea</strong>. A conclusion that says <em>"and they should also build cycle lanes across the city"</em> has just introduced a solution that has no mechanism, no example and no nuance behind it. The examiner reads an undeveloped idea, which costs Task Response, and a paragraph that goes somewhere new instead of closing, which costs Coherence. The audit is mechanical: every content noun in the conclusion should appear somewhere earlier in the essay. If a good idea arrives while you write the last paragraph, it belongs in a body paragraph or in no paragraph.</p>',
              '<p>Two further traps. For an advantages essay, a conclusion that names both sides without the scale (<em>"online lessons give freedom, but they take away contact"</em>) has listed, not weighed; the verdict must contain <em>outweigh</em> or an equivalent. And a conclusion is a paragraph of its own: four paragraphs, a blank line before the last one, never a final sentence tacked onto Body B. The pre-flight check in this app looks for exactly these things: a position marker in the last paragraph, no nouns that appear nowhere else, and four or five paragraphs on the page.</p>'
            ],
            simple: [
              '<p>A summary repeats what the body said. An evaluation says what it adds up to: the verdict in new words, then the reason. Write the evaluation. About 45 words.</p>',
              '<p>Shape: "one side alone is not enough" → the verdict → "because" + the rationale. The verdict comes before the reason.</p>',
              '<p>No new idea in the conclusion, ever. Check every noun: if it is not in the essay already, cut it. For an "outweigh" question, the conclusion must say which side is heavier.</p>'
            ],
            examples: [
              { s: 'Overall, neither side of the tourism debate can stand alone. Visitor numbers should be limited and the income aimed at culture and nature, because a place that sells its character loses the very thing visitors come for.', g: 'Issue, verdict, rationale. Every noun appeared earlier in the essay.' },
              { s: '<s>In conclusion, this essay has discussed both the money that tourism brings and the damage it does to culture and nature.</s>', g: 'A summary. True, and the examiner already knew it. No position, no reason.' },
              { s: '<s>To sum up, visitor numbers should be limited, and airlines should also pay a carbon tax on every flight.</s>', g: 'A new idea. Nothing in the body explained the carbon tax; it is an undeveloped claim in the last paragraph.' },
              { s: '<s>In conclusion, online lessons give students freedom to learn anywhere, but they also take away the discipline of a classroom.</s>', g: 'Listed, not weighed. The prompt asked "outweigh"; the conclusion never says which side is heavier.' }
            ]
          },
          items: [
            { id: 'm06s3q1', type: 'choose', tag: 'tr-new-idea', level: 'B1',
              stem: 'What is the job of the conclusion in a Task 2 essay?',
              options: ['To give the verdict and the one reason it is right, in fresh words.', 'To summarise each body paragraph in one sentence so that nothing is forgotten.', 'To add one last example that the body paragraphs did not have space for.', 'To show the reader that both sides of the debate deserve respect.'], answer: 0,
              hint: 'Ask what the examiner still needs from you after reading two body paragraphs.',
              why: 'The conclusion evaluates: the Synthesized Position restated, then the Rationale. A summary is what the Band 6 descriptor calls "repetitive", a last example is a new idea with no development, and respect for both sides is fence-sitting with better manners.' },
            { id: 'm06s3q2', type: 'judge', tag: 'tr-new-idea', level: 'B2', prompt: 'p-cars-city',
              given: 'In conclusion, councils should invest in public transport while phasing out the dirtiest vehicles, and they should also build cycle lanes across the whole city.',
              stem: 'The body paragraphs discussed pollution and the freedom to drive. Is this conclusion acceptable?', answer: 1,
              hint: 'Check every noun in the sentence against what the stem says the body paragraphs covered.',
              why: 'False. Cycle lanes appear nowhere in the body, so the conclusion has introduced a solution with no mechanism, no example and no nuance. An undeveloped idea in the last paragraph costs Task Response and Coherence at once. Cut it, or move it into a body paragraph.' },
            { id: 'm06s3q3', type: 'sort', tag: 'tr-no-position', level: 'B2',
              stem: 'Sort each closing sentence: does it summarise the body, or evaluate it?',
              bins: [{ key: 'sum', label: 'Summarises', hint: 'repeats what was said' }, { key: 'eval', label: 'Evaluates', hint: 'says what it adds up to' }],
              items: [
                { text: 'The first paragraph showed the benefits of home working and the second showed its dangers.', bin: 'sum' },
                { text: 'Set against each other, the benefits win only when the week keeps some days in the office.', bin: 'eval' },
                { text: 'This essay has discussed both the money tourism brings and the damage it does.', bin: 'sum' },
                { text: 'The income is real, but a place that sells its character loses the very thing visitors pay for.', bin: 'eval' },
                { text: 'Advantages and disadvantages of cameras have both been described above.', bin: 'sum' },
                { text: 'The misuse of recordings can be controlled, while the safety a camera gives cannot be gained another way.', bin: 'eval' }
              ],
              why: 'A summary tells the reader what the essay contained; the examiner already knows. An evaluation weighs the two sides and reaches a verdict with a reason, which is the "clear and developed position" the descriptor rewards. Only the second kind carries variables 10 and 11.' },
            { id: 'm06s3q4', type: 'spot', tag: 'tr-new-idea', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Tap the chunk that brings a new idea into this conclusion.',
              words: ['To sum up,', 'schools should stop selling', 'sugary drinks and snacks', 'and offer cheap healthy food instead,', 'and should also ban energy drinks near the school gate,', 'since the habits formed at school', 'last for decades.'], answer: 4,
              fix: '(delete) The body never developed energy drinks or the shops outside.',
              why: 'Shops near the gate appeared in the body only as a nuance, and energy drinks never appeared at all. A conclusion may restate and evaluate what the body developed; a ban that has no paragraph behind it is an undeveloped idea. The audit: every noun here should already be in the essay.' },
            { id: 'm06s3q5', type: 'build', tag: 'tr-no-position', level: 'B2', prompt: 'p-libraries',
              stem: 'Build the closing sentence: the verdict first, then the reason.',
              tiles: ['Overall,', 'the most reasonable position is that', 'libraries should be funded', 'as public and digital services,', 'since information is useless', 'without the help and space', 'to use it.'],
              solution: 'Overall, the most reasonable position is that libraries should be funded as public and digital services, since information is useless without the help and space to use it.', alt: [],
              why: 'Verdict, then rationale: the reader must know what is being justified before the "since". The position keeps both sides (the building and the online service) and the reason explains why the building still matters. That is an evaluation, not a summary.' },
            { id: 'm06s3q6', type: 'judge', tag: 'tr-listing', level: 'B2', prompt: 'p-online-learning',
              given: 'In conclusion, online lessons give students the freedom to learn anywhere, but they also take away the contact and discipline of a classroom.',
              stem: 'Does this conclusion answer "Do the advantages outweigh the disadvantages?"', answer: 1,
              hint: 'Read it as the examiner: could you quote a phrase that says which side is heavier?',
              why: 'False. It names an advantage and a disadvantage and stops; that is a list with a "but" in the middle. The prompt asked which side is heavier, so the conclusion must say so: the disadvantages outweigh the advantages for most secondary students, and online lessons should add to the classroom rather than replace it.' },
            { id: 'm06s3q7', type: 'order', tag: 'cc-paragraphing', level: 'C1', prompt: 'p-prisons',
              stem: 'Put the three sentences of this conclusion in order.',
              items: ['In conclusion, neither punishment nor reform alone can be the whole purpose of a prison.', 'The more defensible position is that prisons should combine the loss of freedom with compulsory programmes that reform offenders.', 'This combination makes sense because protecting the public needs both the containment of danger and a fall in reoffending.'],
              why: 'The issue, the verdict, the reason. "This combination" can only follow the sentence that named it, and "because" can only justify a verdict the reader has already seen. The conclusion is a paragraph with its own shape, not a sentence added to Body B.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm06ck', name: 'Systems Check', items: [
        { id: 'm06ckq1', type: 'choose', tag: 'tr-no-position', level: 'B1', prompt: 'p-space',
          stem: 'Which sentence is the synthesized position for this prompt?',
          options: ['Governments should keep funding space research in full, since the problems on Earth will still be there later.', 'All space funding should stop until every country has solved its social problems.', 'Governments should keep a small, carefully aimed space programme while most money meets social needs.', 'Both views deserve to be taken seriously, and in the end the right balance depends on each country\'s situation.'], answer: 2,
          why: 'A verdict with a condition: a small programme (Facet B respected) while most money goes to needs on Earth (Facet A respected). The first option mentions the problems on Earth only to wave them away, the second is one side as an absolute, and the last is fence-sitting dressed as fairness: the examiner still cannot say what the writer thinks.' },
        { id: 'm06ckq2', type: 'judge', tag: 'tr-generalised', level: 'B2', prompt: 'p-tourism',
          given: 'This view makes the most sense because governments should limit visitor numbers and use the money to protect culture and nature.',
          stem: 'The position is "governments should limit visitor numbers and spend tourist money on culture and nature". Is this a rationale?', answer: 1,
          hint: 'Put the position and the "because" clause side by side and ask what the second one adds.',
          why: 'False. The "because" clause is the position in other words, so the essay ends in a circle. A rationale gives the principle behind the verdict: a place that sells its character loses the very thing visitors come for.' },
        { id: 'm06ckq3', type: 'sort', tag: 'tr-new-idea', level: 'B2', prompt: 'p-remote-work',
          stem: 'The body discussed efficiency at home and the harm to teamwork. Sort each conclusion sentence: keep it, or cut it as a new idea?',
          bins: [{ key: 'keep', label: 'Keep', hint: 'restates or evaluates the body' }, { key: 'cut', label: 'Cut', hint: 'an idea the body never developed' }],
          items: [
            { text: 'Hybrid working keeps the efficiency of home while protecting the wellbeing of staff.', bin: 'keep' },
            { text: 'Companies should also pay for a desk and a chair in every employee\'s home.', bin: 'cut' },
            { text: 'The verdict, then, is a week that mixes days at home with purposeful days together.', bin: 'keep' },
            { text: 'Governments could offer tax relief to firms that let staff work remotely.', bin: 'cut' },
            { text: 'Neither full-time home working nor five days in the office serves both sides.', bin: 'keep' },
            { text: 'City-centre shops are losing trade as fewer people commute.', bin: 'cut' }
          ],
          why: 'The conclusion may only use what the body put on the table: efficiency, wellbeing, teamwork, the hybrid week. Desks, tax relief and city-centre shops have no mechanism or example behind them, so each one is an undeveloped idea in the last paragraph.' },
        { id: 'm06ckq4', type: 'spot', tag: 'tr-no-position', level: 'B2', prompt: 'p-minimum-wage',
          stem: 'Tap the chunk that takes the verdict away from this conclusion.',
          words: ['Overall,', 'the wage floor should be set', 'by independent experts', 'who study each region,', 'though nobody can really say whether this is right,', 'since the result depends on', 'the level chosen for local conditions.'], answer: 4,
          fix: '(delete) Hold the verdict; the "since" clause is the reason.',
          why: 'The verdict was clear and the rationale followed it. "Nobody can really say whether this is right" cancels both, and the reader is left with no position in the paragraph where the descriptor most expects one. Nuance belongs in the body; the conclusion holds the line.' },
        { id: 'm06ckq5', type: 'build', tag: 'tr-generalised', level: 'B2', prompt: 'p-climate-action',
          stem: 'Build the verdict and its rationale: which side does most of the work, and why.',
          tiles: ['Government rules', 'must do most of the work,', 'while personal action', 'provides public support,', 'because emissions are decided', 'by the systems around us', 'rather than by good intentions.'],
          solution: 'Government rules must do most of the work, while personal action provides public support, because emissions are decided by the systems around us rather than by good intentions.', alt: [],
          why: 'The verdict picks a side and keeps a role for the other ("while"); the rationale explains the choice with a principle, not a repetition: systems decide emissions, so the side that changes systems must lead. Verdict before reason, every time.' },
        { id: 'm06ckq6', type: 'choose', tag: 'tr-listing', level: 'C1', prompt: 'p-cashless',
          stem: 'The second question asks whether this change is positive or negative. Which sentence gives a verdict?',
          options: ['The change has advantages and disadvantages in roughly equal measure, and its effect cannot yet be judged.', 'The change is positive on balance, as long as cash is still accepted and those left out are helped.', 'Paying by phone is quick, but people without a bank account are shut out of many shops.', 'Digital records make tax evasion and corruption far harder to hide from the authorities.'], answer: 1,
          hint: 'Which sentence would let the examiner write down the writer\'s answer to the second question?',
          why: 'A "positive or negative" question needs the adjective in the answer, with a condition if the writer wants one. The first option refuses to judge, the third lists one gain and one loss, and the last is a reason without a verdict attached to it.' },
        { id: 'm06ckq7', type: 'thesis', tag: 'tr-listing', level: 'B2', prompt: 'p-cctv-everywhere',
          stem: 'Write the verdict for this prompt in one sentence. It must say which side is heavier and under what condition.',
          must: [['camera', 'surveillance', 'cctv'], ['outweigh', 'heavier', 'greater', 'more important']], minWords: 12, maxWords: 45,
          _good: 'In my view the advantages of cameras outweigh the disadvantages, provided that recordings are kept briefly and access to them is tightly controlled.',
          _bad: 'Cameras have advantages and disadvantages and both sides have good points.',
          why: 'The word of the question, "outweigh", plus the condition that respects the other side: kept briefly, access controlled. A sentence that says both sides have good points is a list, and a list is the trap this question type is built to catch.' },
        { id: 'm06ckq8', type: 'choose', tag: 'tr-new-idea', level: 'B2', prompt: 'p-history-teaching',
          stem: 'The body discussed national pride and global understanding. Which sentence must NOT appear in the conclusion?',
          options: ['Schools should teach the national past as one case inside wider world processes.', 'Causes in history cross borders, so a course split by country misrepresents the past.', 'Neither national pride nor global understanding alone justifies a whole history course.', 'History teachers should also be given more hours of training in modern languages.'], answer: 3,
          hint: 'Compare the nouns in each sentence with the two things the stem says the body developed.',
          why: 'Language training for teachers appears nowhere in the body, so it would be a new, undeveloped idea in the last paragraph. The other three are the verdict, the rationale and the evaluation of the two sides: exactly what a conclusion is for.' }
      ] }
    }]
  });
})();
