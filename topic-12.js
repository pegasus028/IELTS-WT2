/* POSITION CONTROL — topic-12.js · Module 12 Playbooks */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm12', n: 12, code: 'Module 12', name: 'Playbooks', art: 'grid', cefr: 'B1–C1',
    blurb: 'The same eleven variables, re-mapped for opinion, advantages, problem/solution and two-part questions.',
    levels: [{
      id: 'm12l1', n: 1, name: 'Playbooks', cefr: 'B1–C1', blurb: 'One matrix, four more question types. What each slot means when the prompt is not "discuss both views".',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm12s1', name: 'Opinion: one position, two reasons', cefr: 'B1',
          theory: {
            key: 'In an opinion essay the two facets are two reasons for one position, or one reason and a counter-argument that you concede and then answer.',
            body: [
              '<p>"To what extent do you agree or disagree?" asks for <strong>one position, stated in paragraph one and held to the end</strong>. The matrix does not change; the labels do. Facet A becomes <em>Reason 1</em>, Facet B becomes <em>Reason 2 (or the counter-argument)</em>, and the Synthesized Position is simply <em>your position</em>. The playbook introduction shows the shape: <em>"It is sometimes claimed that [Core Topic] is the right approach. I strongly agree with this view, because of [Reason 1] and [Reason 2]."</em> The reader knows what you think and why before the first body paragraph begins. "To what extent" is an invitation to say <em>how far</em> and <em>with what condition</em>, not an invitation to sit in the middle: <em>"I agree, provided that the hours are limited"</em> is a position; <em>"I partly agree"</em> with no part named is the fence, and the fence is the trap this type is built to catch.</p>',
              '<p>A reason is a facet: one major aspect, with its own mechanism, example and nuance. The test is the sentence <em>"I agree because [facet]"</em>. For part-time work it reads: <em>I agree because paid work builds practical skills and independence.</em> Three things fail that test and each is a common near-miss. The <strong>position restated</strong> (<em>because every student should gain some experience</em>) goes round in a circle. An <strong>example</strong> (<em>because my cousin works in a café at weekends</em>) is something you point at, not a reason. The <strong>other side\'s reason</strong> (<em>because a job takes time away from study</em>) argues against your own thesis in your own paragraph.</p>',
              '<p>The second body paragraph may carry a reason of its own or a <strong>conceded counter-argument</strong>. Concession is a two-move sentence: admit the strongest objection, then answer it. <em>"Admittedly, a demanding job can leave a student too tired to study; even so, a weekly limit on hours removes that risk."</em> The concession must be answered. If the paragraph admits the objection and stops, or ends with <em>"therefore every school should…"</em> on the other side, the position has slid and the examiner can no longer say what you think. The nuance of a reason is its limit; the nuance of a counter-argument is why it does not win.</p>',
              '<p>Everything else is the ordinary matrix. Each body paragraph still needs the mechanism, the example and the nuance, because Task Response at Band 7 is capped by <em>"a tendency to over-generalise"</em>, and an opinion essay is where students generalise most: they believe the position, so they forget to prove it. The conclusion restates the position in fresh words and gives the rationale: <em>"the skills learned at work cannot be taught in a classroom, and a weekly limit removes the risk to grades"</em>. Same position, first paragraph to last.</p>'
            ],
            simple: [
              '<p>Opinion essay: one position, in paragraph one, held to the end. Facet A = Reason 1. Facet B = Reason 2, or a counter-argument you admit and then answer.</p>',
              '<p>A reason must fit the sentence "I agree because …". Not a reason: the position said again, an example, or the other side\'s argument.</p>',
              '<p>"I partly agree" with no part named is sitting on the fence. "I agree, provided that the hours are limited" is a position with a condition. Say which.</p>'
            ],
            examples: [
              { s: 'I agree that all students should gain work experience, provided that the hours are limited to protect their studies.', g: 'A position with a condition. The examiner can quote it; it is not a fence.' },
              { s: 'The first reason is the practical skills and independence that paid work builds.', g: 'Facet A as a reason. "I agree because paid work builds skills" makes sense.' },
              { s: '<s>I partly agree with this statement because both sides have their own strong points.</s>', g: 'The fence. Which part? The examiner cannot say what the writer thinks.' },
              { s: 'Admittedly, a demanding job can leave a student too tired to study; even so, a weekly limit on hours removes that risk.', g: 'A conceded counter-argument, answered. The position survives the objection.' }
            ]
          },
          items: [
            { id: 'm12s1q1', type: 'choose', tag: 'kn-question-type', level: 'B1', prompt: 'p-early-languages',
              stem: 'In an opinion essay like this one, what do Facet A and Facet B become?',
              hint: 'Think about what has to follow "I agree because …" in each body paragraph.',
              options: ['Two reasons for one position, or a reason and an answered counter-argument.', 'The view of the supporters and the view of the critics, each treated with equal weight.', 'The main advantage and the main disadvantage of the proposal.', 'A cause of the problem and the solution that answers it.'], answer: 0,
              why: 'The playbook renames the slots: Reason 1, Reason 2 or the counter-argument, your position. Two views with equal weight is the discuss-both-views shape, which would leave this essay with no side. Advantage and disadvantage belong to "outweigh", and cause and solution to a problem prompt.' },
            { id: 'm12s1q2', type: 'judge', tag: 'tr-no-position', level: 'B1', prompt: 'p-tablets-textbooks',
              given: 'I partly agree with this view, because tablets have some advantages and some disadvantages.',
              stem: 'Is this an acceptable position sentence for an opinion essay?', answer: 1,
              why: 'False. "Partly agree" is only a position if the sentence says which part: printed textbooks should stay at the centre of lessons, with devices as an extra. "Some advantages and some disadvantages" describes the debate and gives the examiner nothing to quote.' },
            { id: 'm12s1q3', type: 'choose', tag: 'tr-partial', level: 'B1', prompt: 'p-teen-jobs',
              stem: 'The position: every student should do some part-time work, with a limit on hours. Which sentence is a reason for it?',
              hint: 'Put each option after "I agree because …" and ask whether it explains, repeats, illustrates or argues back.',
              options: ['Students who take weekend shifts in cafés, shops or family businesses.', 'The loss of study time that a job always causes.', 'The practical skills and independence that paid work builds.', 'Every student should gain some experience of work before graduation.'], answer: 2,
              why: 'A reason fits "I agree because …": because paid work builds skills and independence. The first option is an example, something to point at inside the paragraph. The second is the other side\'s argument, and the last is the position said again.' },
            { id: 'm12s1q4', type: 'sort', tag: 'tr-no-position', level: 'B1',
              stem: 'Sort each opening sentence: a clear position, or sitting on the fence?',
              bins: [{ key: 'pos', label: 'Clear position', hint: 'the examiner can quote it' }, { key: 'fence', label: 'Fence-sitting', hint: 'no side taken' }],
              items: [
                { text: 'Schools should stop selling sugary snacks and offer cheap healthy food instead.', bin: 'pos' },
                { text: 'Sugary snacks in schools have both good and bad sides, so it is hard to decide.', bin: 'fence' },
                { text: 'I agree that languages should start early, provided that reading in the first language is protected.', bin: 'pos' },
                { text: 'To some extent I agree and to some extent I disagree with early language lessons.', bin: 'fence' },
                { text: 'Governments should keep fares low and improve the service rather than make transport free.', bin: 'pos' },
                { text: 'Whether transport should be free really depends on the city and its budget.', bin: 'fence' }
              ],
              why: 'A position can be quoted: it says what should happen, with a condition if the writer wants one. "Hard to decide", "to some extent … to some extent", "depends on the city" describe the debate without entering it. Band 6 Task Response is "a position is presented"; the fence is not one.' },
            { id: 'm12s1q5', type: 'spot', tag: 'tr-no-position', level: 'B2', prompt: 'p-free-transport',
              stem: 'Tap the chunk that turns this thesis into a fence-sitter.',
              words: ['I disagree that', 'transport should be completely free:', 'governments should keep fares low', 'and improve the service instead,', 'although both views are equally valid in the end.'], answer: 4,
              fix: '(delete) The position and its reason were complete at "instead"; end the sentence there.',
              why: 'The sentence had a position and a reason until "both views are equally valid" cancelled them. A nuance limits a facet inside a body paragraph; it never cancels the thesis. Replace the escape clause with the rationale and the position stands.' },
            { id: 'm12s1q6', type: 'choose', tag: 'tr-partial', level: 'B2', prompt: 'p-tablets-textbooks',
              stem: 'Body B concedes: "Admittedly, digital books can be updated straight away." Which sentence must come next?',
              hint: 'A concession is a two-move sentence; look for the option that makes the second move without changing the position.',
              options: ['Therefore, every secondary school should move to tablets as soon as it can afford to do so.', 'However, an update is worth little when a flat battery or a weak signal stops the lesson.', 'In addition, tablets are lighter than five printed textbooks in a school bag.', 'Many teachers prefer printed books because they were trained with them.'], answer: 1,
              why: 'A conceded counter-argument is a two-move sentence: admit it, then answer it. Only "However …" answers. "Therefore …" lets the position slide to the other side, "In addition …" piles up a second concession with no answer, and the last option changes the subject without answering anything.' },
            { id: 'm12s1q7', type: 'thesis', tag: 'tr-no-position', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Write the position for this prompt in one sentence: agree or disagree, with the condition that makes it yours.',
              must: [['work', 'job', 'employ']], minWords: 12, maxWords: 45,
              _good: 'I agree that every student should do some part-time work before leaving school, provided that the hours are limited to protect their studies.',
              _bad: 'Some people think students should work and some people think they should study, so it depends.',
              why: 'Agree or disagree, then the condition: work, yes, with a limit on hours. That is one sentence the examiner can quote, and the limit is already the nuance of Body A. "Some people think … so it depends" is a description of the debate with no writer inside it.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm12s2', name: 'Advantages/disadvantages: weigh, don\'t list', cefr: 'B2',
          theory: {
            key: '"Do the advantages outweigh the disadvantages?" is an opinion question in disguise. Facet A is the main advantage, Facet B the main disadvantage, and the position says which is heavier and why.',
            body: [
              '<p>The wording looks neutral, so students write a neutral essay: one paragraph of benefits, one of drawbacks, and a conclusion that says both matter. That is <strong>the list</strong>, and it is the trap of this type: <em>"a list of pros and cons with no verdict"</em>. The question contains a verb, <em>outweigh</em>, and a verb needs an answer. The playbook renames the slots: Facet A is <em>the main advantage</em>, Facet B <em>the main disadvantage</em>, and the Synthesized Position is <em>which outweighs which</em>. The B2 frame puts the verdict at the end of the introduction (<em>"In my opinion, [position]"</em>) and again in the conclusion: <em>"To conclude, when [advantage] is weighed against [disadvantage], [position]."</em></p>',
              '<p>A <strong>verdict sentence</strong> has a scale in it. The word of the question, <em>outweigh</em>, is the safest; <em>greater than</em>, <em>more significant than</em>, <em>on balance</em> also work. Usually it carries a condition that respects the lighter side: <em>"the advantages outweigh the disadvantages, as long as footage is kept only briefly and access to it is tightly controlled"</em>. Three sentences look like verdicts and are not. <em>"Both sides have real strengths"</em> is a list with a polite face. <em>"Each community must weigh them for itself"</em> hands the question back to the reader. <em>"Cameras make streets safer, but they record innocent people"</em> names the two pans of the scale and never says which is lower.</p>',
              '<p>One advantage and one disadvantage, each developed with a mechanism, an example and a nuance, beat three of each listed in a sentence apiece. Read the last sentence of the prompt before deciding. If it says <em>outweigh</em>, you must weigh. Some prompts say instead <em>"Describe some of the advantages and disadvantages"</em>, as the television prompt does; there the demand is both sides described properly, and no scale word is required, but the Task Response descriptor still rewards <em>"a clear position"</em>, so one sentence that says what it adds up to helps: <em>"television can teach children a great deal, but parents must set firm limits on viewing"</em>.</p>',
              '<p>Where does the weighing come from? From the nuances. The nuance of the disadvantage is usually the reason it is lighter: <em>"strict limits on how long footage is kept and who may see it remove much of the danger"</em>, so the frame closes Body B with <em>"this drawback can be managed"</em>. The rationale then explains the scale: <em>"the harm of a camera lies in the misuse of its recordings, which can be controlled, while its safety benefit cannot be gained any other way"</em>. If the nuance of the advantage is the larger one, the verdict tips the other way, as it does for online lessons, where <em>"the disadvantages outweigh the advantages for most secondary students"</em>. The scale is built in the body and read out in the introduction and the conclusion.</p>'
            ],
            simple: [
              '<p>"Outweigh" is a question with a verb in it. You must answer it: which side is heavier? Facet A = the main advantage, Facet B = the main disadvantage, position = the verdict.</p>',
              '<p>A verdict sentence has a scale word: outweigh, greater than, more significant than, on balance. Usually it adds a condition: "the advantages outweigh the disadvantages, as long as …".</p>',
              '<p>Not a verdict: "both sides matter", "each community must decide", "cameras help, but they also record people". Those are lists. Write the verdict in the introduction and again in the conclusion.</p>'
            ],
            examples: [
              { s: 'The advantages outweigh the disadvantages, as long as footage is kept only briefly and access to it is tightly controlled.', g: 'A verdict: the scale word and a condition that respects the lighter side.' },
              { s: '<s>Cameras have many advantages, but they also have some disadvantages.</s>', g: 'A list. Two pans named, no scale.' },
              { s: 'To conclude, when the freedom to learn anywhere is weighed against the loss of classroom contact, the disadvantages are heavier for most teenagers.', g: 'The conclusion weighs again, in fresh words.' },
              { s: 'Television can teach children a great deal, but parents must set firm limits on viewing.', g: 'For "describe the advantages and disadvantages", no scale word is required, but one clear sentence still says what it adds up to.' }
            ]
          },
          items: [
            { id: 'm12s2q1', type: 'choose', tag: 'kn-question-type', level: 'B2', prompt: 'p-online-learning',
              stem: 'Which sentence answers the question this prompt actually asks?',
              hint: 'Find the verb in the last sentence of the prompt; only one option answers that verb.',
              options: ['Online lessons have important advantages and serious disadvantages for secondary students.', 'Some students prefer online lessons, while others prefer the classroom.', 'Each school should decide for itself whether online lessons suit its students.', 'For most secondary students the disadvantages outweigh the advantages.'], answer: 3,
              why: 'The prompt asks "outweigh", and only one option weighs. The first names both pans and no scale, the second reports what people prefer, and the third hands the question to the schools. An opinion question in disguise still needs an opinion.' },
            { id: 'm12s2q2', type: 'judge', tag: 'tr-listing', level: 'B2', prompt: 'p-cctv-everywhere',
              given: 'On balance, cameras do more good than harm, as long as footage is deleted quickly and access to it is controlled.',
              stem: 'Does this sentence give the verdict that an "outweigh" question needs?', answer: 0,
              hint: 'A verdict has a scale in it; check whether this sentence says which side is heavier, in any words.',
              why: 'True. "More good than harm" is a reading of the scale and "on balance" signals the weighing; the condition respects the lighter side. The verdict does not need the word "outweigh" itself, only a sentence that says which side is heavier. "Cameras make streets safer, but they record innocent people" would name the two pans and never read the scale.' },
            { id: 'm12s2q3', type: 'sort', tag: 'tr-listing', level: 'B2',
              stem: 'Sort each sentence: a verdict that weighs, or a list of the two sides?',
              bins: [{ key: 'weigh', label: 'Weighs', hint: 'says which side is heavier' }, { key: 'list', label: 'Lists', hint: 'names both, decides nothing' }],
              items: [
                { text: 'On balance, the benefits of online lessons are smaller than the loss of classroom contact.', bin: 'weigh' },
                { text: 'Online lessons give freedom, and they also take away contact with a teacher.', bin: 'list' },
                { text: 'The advantages of cameras outweigh the disadvantages, provided that footage is deleted quickly.', bin: 'weigh' },
                { text: 'Cameras have both good points and bad points for the people who are filmed.', bin: 'list' },
                { text: 'The gain in language skills matters more than the risk to tradition, as long as schools keep that tradition alive.', bin: 'weigh' },
                { text: 'Foreign culture brings new ideas but weakens local festivals and crafts.', bin: 'list' }
              ],
              why: 'A verdict has a scale in it: smaller than, outweigh, matters more than. A list joins the two sides with "and" or "but" and stops. The descriptor asks for "a clear position"; for this type the position is the reading on the scale.' },
            { id: 'm12s2q4', type: 'spot', tag: 'tr-listing', level: 'B2', prompt: 'p-foreign-pop-culture',
              stem: 'Tap the chunk that stops this introduction from weighing.',
              words: ['The main advantage is', 'the wider view of the world', 'that foreign media give,', 'while the main disadvantage is', 'the break in local traditions;', 'in my opinion,', 'both of these matter a great deal.'], answer: 6,
              fix: 'the advantages outweigh the disadvantages, as long as schools and families keep local traditions alive.',
              why: 'Everything up to "in my opinion" is the frame doing its job: advantage, disadvantage, and a slot for the verdict. "Both of these matter a great deal" fills the slot with a list. The verdict needs a scale word and, ideally, the condition that respects the lighter side.' },
            { id: 'm12s2q5', type: 'choose', tag: 'tr-no-position', level: 'B2', prompt: 'p-children-tv',
              stem: 'This prompt does not say "outweigh". What does that change?',
              options: ['Nothing: the essay must still say which side is heavier in the introduction and the conclusion.', 'The essay needs no position at all, because the prompt only asks for a description.', 'Both sides must be described, and one clear overall view still helps the examiner.', 'Only the advantages need a mechanism and an example; the disadvantages can be listed.'], answer: 2,
              why: '"Describe some of the advantages and disadvantages" demands both sides developed; no scale word is required. But Task Response still rewards "a clear position", so one sentence that says what it adds up to, such as "television can teach a great deal, but parents must set firm limits", costs nothing and earns. A fully neutral essay reads as no position.' },
            { id: 'm12s2q6', type: 'build', tag: 'tr-listing', level: 'B2', prompt: 'p-cctv-everywhere',
              stem: 'Build the conclusion sentence that weighs: name the two sides, then the verdict and its condition.',
              tiles: ['To conclude,', 'when the prevention of crime', 'is weighed against', 'the loss of privacy,', 'the advantages are greater,', 'provided that footage', 'is kept only briefly.'],
              solution: 'To conclude, when the prevention of crime is weighed against the loss of privacy, the advantages are greater, provided that footage is kept only briefly.', alt: [],
              why: 'The two pans first, then the reading: "the advantages are greater". The condition keeps the nuance of Body B, which is exactly why the disadvantage is lighter. This is the playbook conclusion frame in your own words.' },
            { id: 'm12s2q7', type: 'thesis', tag: 'tr-listing', level: 'B2', prompt: 'p-online-learning',
              stem: 'Write the verdict for this prompt in one sentence: which side is heavier, and with what condition?',
              must: [['outweigh', 'greater than', 'more significant than', 'on balance', 'heavier']], minWords: 12, maxWords: 45,
              _good: 'In my view the disadvantages of online lessons outweigh the advantages for most teenagers, so they should add to the classroom rather than replace it.',
              _bad: 'Online lessons have some advantages and some disadvantages for students in secondary schools.',
              why: 'The word of the question, "outweigh", and the condition that respects the lighter side: online lessons add to the classroom rather than replace it. "Some advantages and some disadvantages" is the list that this question type is designed to punish.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm12s3', name: 'Problem/solution and two-part', cefr: 'B2',
          theory: {
            key: 'A solution must answer a cause you named: draw the arrow before you write. A two-part question gets one body paragraph per question, with equal weight.',
            body: [
              '<p>The problem/solution playbook turns the matrix into a chain. Facet A is <strong>the main cause</strong>, its mechanism is <em>how the cause works</em>, its example <em>where it is seen</em>, and its nuance <em>why it is hard to fix</em>. Facet B is <strong>the solution</strong>, its mechanism is <em>how the solution answers the cause</em>, its example <em>where it has worked</em>, and its nuance <em>its limit</em>. For city flooding: concrete seals the soil, so rain runs straight into drains built for a smaller city; the solution is parks, ponds and surfaces that let rain soak in, because water that never reaches the drain cannot overload it. The frame says it aloud: <em>"It works by [mechanism], which directly answers the cause above."</em></p>',
              '<p>The trap of the type is the <strong>orphan solution</strong>: a measure that answers a cause the essay never named. The test is one sentence: <em>"Because [cause], [solution]."</em> <em>Because concrete seals the soil, the city needs surfaces that absorb rain</em> is true. <em>Because concrete seals the soil, the world must cut carbon emissions</em> is not: emissions may matter, but they answer a different cause. Bigger pumps are the near-miss: they treat the symptom, moving the same water downstream faster. Draw the arrow from cause to solution on the question paper before the first sentence. One cause developed with its answering solution beats three causes and three solutions listed in a sentence each.</p>',
              '<p>The two-part playbook is simpler and is failed more often. Two direct questions: <em>"Why has this happened? Is it a positive or a negative development?"</em> Body A answers the first, Body B the second, each with the four moves. The frames open with the question they are answering: <em>"In answer to the first question, …"</em>, <em>"Turning to the second question, …"</em>. The trap is <em>"one question answered in a single sentence"</em>: a Body B that says <em>"As for the second question, it is a positive development"</em> and moves to the conclusion has answered nothing. A <em>positive or negative</em> question needs the adjective in the verdict, with a condition if you want one.</p>',
              '<p>Both types still take a position, in the introduction and the conclusion. For a problem prompt it is <em>what must happen</em>: <em>"city authorities must require green space that absorbs rain in every new development"</em>. For a two-part prompt it is the overall view: <em>"the change is a positive development on balance, as long as cash is still accepted"</em>. Both still take nuance. A solution with an admitted limit, <em>"a park can soak up one storm, but a week of monsoon rain defeats any absorbent surface"</em>, is what the C1 frame calls <em>necessary rather than sufficient</em>, and that admission is the difference between a Band 7 and a Band 8 paragraph.</p>'
            ],
            simple: [
              '<p>Problem/solution: Facet A = the cause and how it works. Facet B = the solution and how it answers that cause. Test: "Because [cause], [solution]." If the sentence is not true, the solution is an orphan.</p>',
              '<p>Two-part: two questions, two body paragraphs, equal weight. "In answer to the first question, …" / "Turning to the second question, …". One sentence is not an answer.</p>',
              '<p>Both types need a position in the introduction and the conclusion: what must happen, or positive / negative. Both still need a nuance in each body paragraph.</p>'
            ],
            examples: [
              { s: 'Because concrete seals the soil and sends rain straight into old drains, the answer is parks and surfaces that let rain soak in.', g: 'Cause → solution. The arrow is inside the sentence.' },
              { s: '<s>The main cause is concrete covering the soil; the solution is for the world to cut carbon emissions.</s>', g: 'An orphan solution. It answers a cause the essay never named.' },
              { s: 'In answer to the first question, the concentration of universities and skilled jobs in a few big cities pulls every ambitious school leaver away.', g: 'Body A of a two-part essay: it names the question and answers it with a facet.' },
              { s: '<s>As for the second question, it is a positive development. In conclusion, …</s>', g: 'Question two answered in one sentence. Half the prompt is missing.' }
            ]
          },
          items: [
            { id: 'm12s3q1', type: 'sort', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-city-flooding',
              stem: 'Sort each idea: a cause of the flooding, or a solution to it?',
              bins: [{ key: 'cause', label: 'Cause', hint: 'why the water rises' }, { key: 'sol', label: 'Solution', hint: 'what could be done' }],
              items: [
                { text: 'The covering of land that once soaked up rain with concrete and asphalt.', bin: 'cause' },
                { text: 'Heavier and more sudden rain produced by a warming climate.', bin: 'cause' },
                { text: 'The building of new housing on former rice fields and wetlands.', bin: 'cause' },
                { text: 'Parks and ponds that let rain soak into the ground inside the city.', bin: 'sol' },
                { text: 'Bigger drains and more powerful pumping stations across the city.', bin: 'sol' },
                { text: 'Rules that require green space in every new development.', bin: 'sol' }
              ],
              why: 'The prompt has two parts, causes and measures, and each needs its own paragraph. Sorting first shows which solution answers which cause: absorbent surfaces and green-space rules answer the concrete; bigger pumps answer nothing, they only move the same water faster.' },
            { id: 'm12s3q2', type: 'select', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-teen-sleep',
              stem: 'The cause named in Body A: early start times clash with the teenage body clock. Tick the 2 solutions that answer it.',
              options: ['Move the first lesson later for older students.', 'Take phones away from students at bedtime.', 'Set less homework on weekday evenings.', 'Start assembly later and run the school buses on a later timetable.', 'Fit air conditioning in every classroom.', 'Teach the importance of sleep in health lessons.'], answers: [0, 3], k: 2,
              why: 'Test each one with "Because the start time clashes with the body clock, …". Only a later first lesson and a later assembly with later buses complete that sentence. Phones, homework, heat and lessons about sleep answer causes this essay never named.' },
            { id: 'm12s3q3', type: 'choose', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-online-scams',
              stem: 'The cause: criminals send thousands of messages, so even a tiny response rate makes a profit. Which solution answers it?',
              hint: 'Test each option with "Because a tiny response rate makes a profit, …" and ask which one stops the profit.',
              options: ['Police should investigate every case of fraud and try to get the money back.', 'Banks should refund every victim in full so that nobody loses money.', 'Schools should teach every student to recognise a scam before any money is sent.', 'Courts should give much longer prison sentences to the few scammers who are actually caught.'], answer: 2,
              why: 'The mechanism of the cause is profit from a tiny response rate. A student who recognises the scam does not respond, so the mass message earns nothing: the solution cuts the mechanism. Investigation, refunds and sentences all act after the money has gone, and a sentence falls only on the few who are caught, while the mass message keeps earning.' },
            { id: 'm12s3q4', type: 'judge', tag: 'tr-partial', level: 'B2', prompt: 'p-cashless',
              given: 'As for the second question, the change is a positive development. In conclusion, …',
              stem: 'Body B of a two-part essay ends like this after one sentence on question two. Is the second question answered?', answer: 1,
              why: 'False. A two-part prompt demands "both questions answered with equal weight, one body paragraph each". One sentence with the adjective is a claim, not a paragraph: no mechanism, no example, no nuance. The descriptor calls this "some parts more fully covered than others", which is Band 6.' },
            { id: 'm12s3q5', type: 'order', tag: 'tr-partial', level: 'C1', prompt: 'p-rural-youth',
              stem: 'Put the four paragraphs of this two-part essay in order.',
              items: [
                'The movement of young people from country areas to big cities raises two questions: why it happens, and whether it helps the country. This essay argues that it is a negative development overall.',
                'In answer to the first question, the concentration of universities and skilled jobs in a few big cities pulls every ambitious school leaver to the capital, where the courses and careers they want actually exist.',
                'Turning to the second question, the movement empties country communities and overloads the cities that take them in, as provincial towns with a closed school and a capital full of new tower blocks show.',
                'In conclusion, the pull of the capital explains the movement, and its cost to both village and city makes it negative: a country that puts all its opportunity in one city wastes the talent of every region outside it.'
              ],
              why: 'Introduction with both questions and the overall view; Body A answers question one; Body B answers question two; the conclusion joins the two answers and gives the rationale. "Turning to the second question" can only follow a paragraph that answered the first.' },
            { id: 'm12s3q6', type: 'choose', tag: 'kn-question-type', level: 'B2', prompt: 'p-private-tutoring',
              stem: 'How many body paragraphs does this prompt need, and what does each one do?',
              hint: 'Count the question marks in the prompt and read what each question actually asks for.',
              options: ['Two: one answering why tutoring is common, one judging whether it is positive or negative.', 'Two: one giving the advantages of tutoring, one giving the disadvantages.', 'Two: one naming the cause of tutoring, one proposing the solution to it.', 'Three: the view of parents, the view of teachers, and the writer\'s own opinion in a third paragraph.'], answer: 0,
              why: 'Two direct questions, "why" and "positive or negative", so two body paragraphs, one each. The advantages reading turns a two-part prompt into an outweigh essay and drops the "why"; the cause and solution reading invents a solution the prompt never asked for; the three-paragraph shape belongs to discuss-both-views.' },
            { id: 'm12s3q7', type: 'build', tag: 'tr-solution-mismatch', level: 'C1', prompt: 'p-youth-unemployment',
              stem: 'Build the sentence that draws the arrow from the cause to its solution.',
              tiles: ['Because students are pushed', 'into popular courses', 'rather than the vacancies that exist,', 'funding and places', 'must be directed', 'towards the fields', 'with jobs.'],
              solution: 'Because students are pushed into popular courses rather than the vacancies that exist, funding and places must be directed towards the fields with jobs.', alt: [],
              why: 'The cause in the "because" clause, the solution in the main clause, and the second is the mirror of the first: students go where prestige points, so money and places must point where the jobs are. That is the arrow. A solution that could not sit in this sentence is an orphan.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm12ck', name: 'Systems Check', items: [
        { id: 'm12ckq1', type: 'choose', tag: 'kn-question-type', level: 'B1', prompt: 'p-school-snacks',
          stem: 'What does Task Response demand for this prompt?',
          hint: 'Name the type from the last sentence of the prompt first; the demand follows from the type.',
          options: ['Both views treated fairly with a mechanism each, then a verdict in the introduction and the conclusion.', 'One position, stated in paragraph one and held to the end, with two developed reasons.', 'A weighing: say which side is heavier and why, not just what is on each side.', 'Causes named with their mechanism, and each solution answering a named cause.'], answer: 1,
          why: '"To what extent do you agree or disagree?" is the opinion type: one position from the first paragraph to the last, with two reasons or a reason and an answered counter-argument. The other three are the demands of discuss, outweigh and problem/solution prompts.' },
        { id: 'm12ckq2', type: 'judge', tag: 'tr-listing', level: 'B2', prompt: 'p-foreign-pop-culture',
          given: 'In conclusion, foreign culture widens the horizons of young people, but it also weakens the passing on of local traditions.',
          stem: 'Is this conclusion complete for an "outweigh" prompt?', answer: 1,
          why: 'False. Advantage, "but", disadvantage: the two pans are named and the scale is never read. The conclusion must say which side is heavier, in fresh words: the advantages outweigh the disadvantages, as long as schools and families keep local traditions alive.' },
        { id: 'm12ckq3', type: 'sort', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-youth-unemployment',
          stem: 'The cause named: degrees do not match the skills employers need. Sort each measure: it answers this cause, or it is an orphan?',
          bins: [{ key: 'ans', label: 'Answers the cause', hint: '"Because degrees do not match skills, …"' }, { key: 'orph', label: 'Orphan', hint: 'answers a cause nobody named' }],
          items: [
            { text: 'Fund university places according to where the vacancies are.', bin: 'ans' },
            { text: 'Build a work placement into every degree course.', bin: 'ans' },
            { text: 'Pay unemployment benefit to recent graduates.', bin: 'orph' },
            { text: 'Require employers to hire a fixed share of young people.', bin: 'orph' },
            { text: 'Design courses together with the companies that will hire the graduates.', bin: 'ans' },
            { text: 'Cut the number of university places so that graduates are rarer.', bin: 'orph' }
          ],
          why: 'The cause is a mismatch between what is taught and what is needed, so a solution must change what is taught or where the places go. Benefit, hiring quotas and fewer places leave the mismatch exactly as it was; fewer graduates with the wrong skills are still graduates with the wrong skills.' },
        { id: 'm12ckq4', type: 'spot', tag: 'tr-no-position', level: 'B2', prompt: 'p-early-languages',
          stem: 'Tap the chunk where this opinion thesis stops taking a position.',
          words: ['I agree that', 'schools should start languages early', 'through play,', 'while protecting reading', 'in the first language,', 'but of course it depends on the child.'], answer: 5,
          fix: '(delete) "While protecting reading in the first language" is already the condition; end there.',
          why: 'A position with a condition was complete at "first language". "It depends on the child" takes the position back and leaves the examiner with nothing to quote. The condition is your nuance; "it depends" is the fence.' },
        { id: 'm12ckq5', type: 'select', tag: 'tr-partial', level: 'B2', prompt: 'p-cashless',
          stem: 'Tick the 2 parts that this prompt asks the essay to answer.',
          options: ['Whether the advantages of cashless payment outweigh the disadvantages.', 'Why the change to phone and card payment happened so quickly.', 'What governments should do to protect people who still use cash.', 'Both views on cashless payment, and then the writer\'s own opinion.', 'Whether the change is a positive or a negative development.', 'The causes of the decline of cash and the solutions to it.'], answers: [1, 4], k: 2,
          why: 'Two direct questions: why so quickly, and positive or negative. Each gets a body paragraph. "Outweigh", "both views" and "solutions" are the demands of other types; an essay that answers them has answered a prompt that was not set.' },
        { id: 'm12ckq6', type: 'choose', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-city-flooding',
          stem: 'Body A developed this cause: concrete seals the soil, so rain runs straight into old drains. Which Body B solution answers it?',
          options: ['Insurance schemes that pay families back after each flood.', 'International agreements to cut carbon emissions so that storms become less severe.', 'Phone apps that warn residents when a storm is on the way.', 'Parks and permeable surfaces that let rain soak into the ground.'], answer: 3,
          why: 'The mechanism of the cause is water reaching the drain too fast. Absorbent ground stops it reaching the drain: the arrow is straight. Insurance and warnings act after the water has risen, and emissions answer a cause about rainfall that Body A never made.' },
        { id: 'm12ckq7', type: 'thesis', tag: 'tr-no-position', level: 'B2', prompt: 'p-teen-sleep',
          stem: 'Write the position for this problem prompt in one sentence: what must happen, and the cause it answers.',
          must: [['sleep', 'start', 'timetable', 'bell']], minWords: 12, maxWords: 45,
          _good: 'I believe that schools should start the day later for older students, because the cause is a clash between biology and the timetable, and only the timetable can be changed.',
          _bad: 'Some people think schools should start later and some people think parents should set bedtimes, so it depends on the family.',
          why: 'A problem essay still has a position: what must happen. The best version names the cause it answers, so the arrow is already drawn in the introduction. "Some people think … it depends" reports the debate and answers neither question.' },
        { id: 'm12ckq8', type: 'judge', tag: 'tr-partial', level: 'C1', prompt: 'p-private-tutoring',
          given: 'Plan: Body A explains the competition for university places; Body B argues that the gap between families who can pay and those who cannot makes tutoring a negative development.',
          stem: 'Does this plan answer both questions in the prompt?', answer: 0,
          hint: 'Match each body paragraph to one of the two questions and see whether either question is left over.',
          why: 'True. Body A answers "why has this become so common" with a cause, and Body B answers "positive or negative" with the adjective and a reason for it. One body per question is the two-part shape. Had Body B given a second reason for the growth of tutoring, the second question would have no paragraph at all.' }
      ] }
    }]
  });
})();
