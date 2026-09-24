/* POSITION CONTROL — topic-01.js · Module 01 Decode the Prompt */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm01', n: 1, code: 'Module 01', name: 'Decode the Prompt', art: 'scope', cefr: 'B1–C1',
    blurb: 'Five question types, one instruction sentence each: name the type, count the parts, then plan.',
    levels: [{
      id: 'm01l1', n: 1, name: 'Decode the Prompt', cefr: 'B1–C1', blurb: 'The signal words, what each type demands, and how to count the parts before you plan.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm01s1', name: 'The five types', cefr: 'B1',
          theory: {
            key: 'The last sentence of the prompt is the instruction. Its wording tells you which of five types you are writing.',
            body: [
              '<p>Every Task 2 prompt has two parts: some background (<em>"In many countries, secondary school students…"</em>) and an <strong>instruction sentence</strong>, almost always the last one. The background gives you the topic; the instruction gives you the type. Read the instruction first. Misreading the type is the most common reason a Task Response mark stops at Band 6, because the essay answers a question that was not asked.</p>',
              '<p>There are five types. <strong>Opinion</strong>: <em>"To what extent do you agree or disagree?"</em> <strong>Discuss both views</strong>: <em>"Discuss both views and give your own opinion."</em> <strong>Advantages / disadvantages</strong>: <em>"Do the advantages outweigh the disadvantages?"</em> or <em>"describe the advantages and disadvantages"</em>. <strong>Problem / solution</strong>: <em>"What are the causes? What can be done?"</em> <strong>Two-part</strong>: two separate direct questions, usually <em>"Why has this happened? Is it a positive or negative development?"</em></p>',
              '<p>The background can mislead you. A prompt that says <em>"Supporters say this makes everyone safer, while critics see a threat to freedom"</em> looks like a discuss-both-views task, but if it ends <em>"Do the advantages outweigh the disadvantages?"</em> it is an advantages / disadvantages task and needs a verdict. Two <em>why</em>-questions look alike, but <em>"What can be done?"</em> asks for solutions (problem / solution) while <em>"Is it positive or negative?"</em> asks for a judgement (two-part).</p>',
              '<p>Naming the type is the first five seconds of the five planning minutes, and it decides everything after: how many parts you answer, where the opinion goes, and what the body paragraphs are for. The next two sub-levels cover those decisions. This one is only about reading the signal correctly, every time.</p>'
            ],
            simple: [
              '<p>The last sentence of the prompt is the instruction. Read it first. It tells you the type.</p>',
              '<p>Five types: agree or disagree (Opinion) · discuss both views · advantages and disadvantages · causes and solutions · two direct questions.</p>',
              '<p>Do not trust the background sentences. "Some say… others say…" can end with "outweigh" or "agree or disagree". Only the instruction counts.</p>'
            ],
            examples: [
              { s: '"All children should study a foreign language from the earliest grades. To what extent do you agree or disagree?"', g: 'Opinion. One position, held from the first paragraph to the last.' },
              { s: '"Some argue governments should ban private cars in city centres… Others believe… Discuss both views and give your own opinion."', g: 'Discuss both views. Two views plus your verdict: three parts.' },
              { s: '"…Supporters say this makes everyone safer, while critics see a threat to personal freedom. Do the advantages outweigh the disadvantages?"', g: 'Advantages / disadvantages, not discuss both views. The instruction sentence wins; a verdict is required.' },
              { s: '"Why has this change happened so quickly? Do you think it is a positive or a negative development?"', g: 'Two-part: two direct questions, one body paragraph each.' }
            ]
          },
          items: [
            { id: 'm01s1q1', type: 'choose', tag: 'kn-question-type', level: 'B1', prompt: 'p-early-languages',
              stem: 'Which type is this prompt?',
              options: ['Opinion (agree or disagree)', 'Discuss both views', 'Advantages and disadvantages', 'Two-part question'], answer: 0,
              hint: 'Find the instruction sentence at the end of the prompt and ignore the background before it.',
              why: '"To what extent do you agree or disagree?" is the Opinion signal. One position, with reasons, held from paragraph one to the end. No second view is offered for you to discuss.' },
            { id: 'm01s1q2', type: 'choose', tag: 'kn-question-type', level: 'B1', prompt: 'p-cctv-everywhere',
              stem: 'Which type is this prompt?',
              options: ['Discuss both views', 'Problem and solution', 'Advantages / disadvantages', 'Opinion (agree or disagree)'], answer: 2,
              hint: 'The background sentence and the instruction sentence can point to different types; only one of them counts.',
              why: '"Supporters say… critics see…" is background that looks like two views, but the instruction is "Do the advantages outweigh the disadvantages?". That is a weighing, and it needs a verdict.' },
            { id: 'm01s1q3', type: 'sort', tag: 'kn-question-type', level: 'B1',
              stem: 'Sort these instruction sentences by question type.',
              bins: [{ key: 'op', label: 'Opinion', hint: 'agree or disagree' }, { key: 'di', label: 'Discuss both views', hint: 'two views + your opinion' }, { key: 'pr', label: 'Problem / solution', hint: 'causes and measures' }],
              items: [
                { text: 'To what extent do you agree or disagree?', bin: 'op' },
                { text: 'Discuss both views and give your own opinion.', bin: 'di' },
                { text: 'What are the causes of this problem? What measures could reduce it?', bin: 'pr' },
                { text: 'Some believe this change should be made in all schools. Do you agree?', bin: 'op' },
                { text: 'Why is this happening? What can be done to protect young people?', bin: 'pr' },
                { text: 'Others argue the opposite. Discuss both sides and state your own view.', bin: 'di' }
              ],
              why: '"Agree" is Opinion; "both views" or "both sides" is Discuss; "causes" and "what can be done" is Problem / solution. The wording varies, but each type has its own key word.' },
            { id: 'm01s1q4', type: 'choose', tag: 'kn-question-type', level: 'B2', prompt: 'p-cashless',
              stem: 'Which type is this prompt?',
              options: ['Problem and solution', 'Two-part question', 'Discuss both views', 'Opinion (agree or disagree)'], answer: 1,
              hint: 'Look at the two direct questions and check whether either of them asks for measures.',
              why: 'Two separate direct questions: why it happened, and whether it is positive or negative. "Why" looks like a cause question, but nothing asks for solutions, so this is Two-part, not Problem / solution.' },
            { id: 'm01s1q5', type: 'judge', tag: 'kn-question-type', level: 'B1', prompt: 'p-city-flooding',
              given: 'This prompt asks the writer to say whether flooding is a positive or a negative development.',
              stem: 'True or false?', answer: 1,
              why: 'False. The two questions are "What are the main causes?" and "What measures could reduce it?". That is Problem / solution: causes, then solutions that answer them. No positive-or-negative judgement is asked for.' },
            { id: 'm01s1q6', type: 'choose', tag: 'tr-listing', level: 'B2',
              stem: 'Which instruction sentence asks you to weigh two sides against each other and say which is heavier?',
              options: ['Discuss both of these views and give your own opinion.', 'Is this a positive or a negative development?', 'What can be done to solve this problem?', 'Do the advantages outweigh the disadvantages?'], answer: 3,
              hint: 'Look for the one verb that describes putting two things on a scale.',
              why: '"Outweigh" is a weighing word: it asks which side is heavier and why. Discuss asks for two views and a verdict on the issue; positive-or-negative asks for a judgement; "what can be done" asks for solutions.' },
            { id: 'm01s1q7', type: 'sort', tag: 'kn-question-type', level: 'B2',
              stem: 'Sort these instruction sentences by question type.',
              bins: [{ key: 'ad', label: 'Advantages / disadvantages', hint: 'weigh the two sides' }, { key: 'tw', label: 'Two-part', hint: 'two direct questions' }, { key: 'pr', label: 'Problem / solution', hint: 'causes and measures' }],
              items: [
                { text: 'Do the advantages of this development outweigh the disadvantages?', bin: 'ad' },
                { text: 'Why has this happened? Is it a positive or a negative change?', bin: 'tw' },
                { text: 'What are the causes? What could governments do about it?', bin: 'pr' },
                { text: 'Describe some advantages and disadvantages of this for children.', bin: 'ad' },
                { text: 'What are the reasons for this? Is it good or bad for the country?', bin: 'tw' },
                { text: 'Why does this happen, and how can young people be protected?', bin: 'pr' }
              ],
              why: 'The near-miss is "why". Followed by "what can be done" or "how can they be protected", it is Problem / solution; followed by "positive or negative", it is Two-part. "Advantages and disadvantages", with or without "outweigh", is the weighing type.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm01s2', name: 'What each type demands', cefr: 'B2',
          theory: {
            key: 'Each type demands a set of parts and a place for the opinion. Answer the parts, put the opinion where it belongs.',
            body: [
              '<p><strong>Opinion.</strong> One position, stated in paragraph one and held to the end, with two developed reasons (or one reason and one counter-argument you concede and answer). The trap is the fence: <em>"I partly agree"</em> without saying which part. If you agree with a limit, say the limit: <em>"students should work part-time, but with a cap on hours"</em>.</p>',
              '<p><strong>Discuss both views.</strong> Both views treated fairly, each with a mechanism and an example, and your own verdict stated in the <strong>introduction and the conclusion</strong>. The Band 6 pattern is two neutral body paragraphs and a surprise opinion in the last line. An opinion that first appears in the conclusion reads as an afterthought; the examiner has already decided the position was unclear.</p>',
              '<p><strong>Advantages / disadvantages: the outweigh trap.</strong> <em>"Do the advantages outweigh the disadvantages?"</em> is an opinion question in disguise. Two balanced paragraphs and no scale is a list, and a list has no position. Write the verdict sentence in the introduction: <em>"the drawbacks outweigh the benefits for most students, because…"</em>, then again in the conclusion.</p>',
              '<p><strong>Problem / solution and Two-part.</strong> In a problem / solution essay each solution must answer a cause you named. Cause: concrete now covers the land that soaked up rain. Solution: require green space that absorbs rain, not a text-message flood warning, which is a real measure but answers nothing you said. In a two-part essay both questions get equal weight, one body paragraph each; a question answered in one sentence is a question not answered.</p>'
            ],
            simple: [
              '<p>Opinion: say clearly what you think in paragraph one, and keep saying it. Not "I partly agree" with no detail.</p>',
              '<p>Discuss both views: two fair paragraphs, and your opinion in the introduction AND the conclusion, not only at the end.</p>',
              '<p>Outweigh: say which side is heavier and why. Causes and solutions: each solution must fix a cause you named. Two questions: one paragraph each.</p>'
            ],
            examples: [
              { s: 'On balance, the disadvantages of online lessons outweigh the advantages for most secondary students, so they should support the classroom rather than replace it.', g: 'A verdict: which side is heavier, and a hint of why. This is what "outweigh" asks for.' },
              { s: '<s>Online lessons have several advantages and several disadvantages, which this essay will discuss.</s>', g: 'A list announced, no scale. The outweigh trap.' },
              { s: 'Cause: concrete and asphalt cover the land that once soaked up rain. → Solution: require parks and absorbent surfaces in every new development.', g: 'The arrow from cause to solution. The solution answers the named cause.' },
              { s: '<s>Cause: concrete covers the land. → Solution: send flood warnings to every phone.</s>', g: 'A real measure that answers a different problem. Solution mismatch.' }
            ]
          },
          items: [
            { id: 'm01s2q1', type: 'choose', tag: 'tr-listing', level: 'B2', prompt: 'p-online-learning',
              stem: 'Which sentence answers what this prompt actually asks?',
              options: ['Online lessons offer flexibility and lower costs, but they remove the teacher and classmates who keep students motivated.', 'Online lessons have several advantages and several disadvantages for secondary students.', 'The advantages are flexibility and lower cost; the disadvantages are isolation and distraction.', 'The drawbacks outweigh the benefits for most students, so online lessons should support the classroom.'], answer: 3,
              hint: 'Read the instruction sentence again and ask what kind of sentence a question with "outweigh" needs.',
              why: '"Outweigh" asks which side is heavier. Only the last sentence weighs; the other three describe both sides without deciding, which is the list that keeps TR at Band 6.' },
            { id: 'm01s2q2', type: 'choose', tag: 'tr-position-late', level: 'B2', prompt: 'p-remote-work',
              stem: 'In a discuss-both-views essay, where must your own opinion appear?',
              options: ['Only in the conclusion, after both views are shown', 'In the introduction and again in the conclusion', 'In every paragraph, including both body paragraphs', 'Only in the introduction, so the body stays neutral'], answer: 1,
              hint: 'Ask when the examiner first needs to know your view, and whether saying it once is enough.',
              why: 'Introduction and conclusion. The body paragraphs treat each view fairly; the verdict frames them from the start and returns at the end. First seen in the conclusion, it reads as an afterthought.' },
            { id: 'm01s2q3', type: 'choose', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-city-flooding',
              stem: 'The named cause: concrete and asphalt now cover land that once soaked up rain. Which solution answers it?',
              options: ['Sending text-message flood warnings to every phone', 'Building higher concrete walls along the main river through the city', 'Requiring green space that absorbs rain in new developments', 'Compensating families whose homes are flooded'], answer: 2,
              why: 'The cause is lost absorbent ground, so the solution gives the ground back its ability to hold water. River walls, warnings and compensation are real measures, but none of them answers that cause.' },
            { id: 'm01s2q4', type: 'judge', tag: 'tr-partial', level: 'B2', prompt: 'p-teen-sleep',
              given: 'A full answer to this prompt needs the causes, and then what schools, parents and governments could each do.',
              stem: 'True or false?', answer: 0,
              why: 'True. The second question names three actors. An essay that gives causes and then one thing schools could do has left two of the named parts untouched, and TR reads that as partly answered.' },
            { id: 'm01s2q5', type: 'choose', tag: 'tr-position-late', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'What does this prompt demand?',
              options: ['One position on work experience, held from the first paragraph to the last', 'A fair description of countries where students work and countries where they do not', 'Both sides of the debate, with the verdict saved for the conclusion', 'A list of the causes of part-time work and their solutions'], answer: 0,
              hint: 'Start from the instruction sentence, then decide what the background about different countries is for.',
              why: '"To what extent do you agree or disagree?" asks for one position from the start. The background about different countries is context, not a second view to discuss, and a verdict saved for the end is the Band 6 pattern.' },
            { id: 'm01s2q6', type: 'select', tag: 'tr-listing', level: 'B2', prompt: 'p-cctv-everywhere',
              stem: 'Tick the two sentences that give a verdict rather than a list.',
              options: ['Cameras have benefits for safety and drawbacks for privacy.', 'The gain in safety clearly outweighs the loss of privacy, provided footage is deleted quickly.', 'There are many advantages and many disadvantages to surveillance.', 'On balance, the threat to privacy is more serious than the small gain in safety.', 'Supporters point to safety while critics point to freedom.', 'Both sides of the camera debate deserve careful attention.'], answers: [1, 3], k: 2,
              hint: 'Look for a comparison word that puts one side above the other.',
              why: 'A verdict names the heavier side: "outweighs", "more serious than". The two verdicts here reach opposite conclusions, and either can score well; the other four sentences describe the debate and decide nothing.' },
            { id: 'm01s2q7', type: 'thesis', tag: 'tr-listing', level: 'B2', prompt: 'p-online-learning',
              stem: 'Write a one-sentence thesis for this prompt that says which side is heavier and why.',
              must: [['online'], ['outweigh', 'on balance', 'more serious', 'more important', 'greater', 'heavier']],
              minWords: 12, maxWords: 45,
              _good: 'On balance, the disadvantages of online lessons outweigh the advantages for most secondary students, because a screen cannot replace a teacher who notices confusion at once.',
              _bad: 'Some people think online lessons are good for students and other people think they are bad for students.',
              why: 'The outweigh sentence: name the heavier side with "outweigh" or "more serious than", then the reason. A sentence that only says both sides exist is a list, and the examiner cannot quote a position from it.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm01s3', name: 'Instruction words and parts', cefr: 'B2',
          theory: {
            key: 'Count the parts before you plan. Each part gets its own developed paragraph; a part answered in one sentence is a part not answered.',
            body: [
              '<p>Band 6 Task Response says <em>"the main parts of the prompt are addressed (though some may be more fully covered than others)"</em>. Band 8 says the prompt is <em>"sufficiently addressed"</em>. The difference is arithmetic: number the parts, then check that each one has a developed paragraph. Underline the instruction words and count what they ask for.</p>',
              '<p><strong>Discuss both views and give your own opinion</strong> is three parts: view A, view B, your verdict. <strong>Two direct questions</strong> is two parts, plus your view if the second question asks for it (<em>positive or negative?</em>). <strong>Causes and measures</strong> is two parts, and the second must connect to the first. <strong>Agree or disagree</strong> is one position, but it needs two developed reasons to count as "developed".</p>',
              '<p>Watch for parts hidden inside a part. <em>"What could schools, parents and governments do?"</em> names three actors. <em>"Some measures"</em> means more than one. <em>"For the country as a whole"</em> tells you the judgement must be about the country, not the young person who moves. The instruction words carry these demands, and the examiner checks each of them.</p>',
              '<p>The plan follows from the count. Name the type from the instruction sentence; count the parts; decide one position that covers every part; give each part its own body paragraph. Then read the prompt once more against the plan. Five minutes spent this way is the cheapest Task Response gain in the test, because an essay cannot score above 6 for a part it never reaches.</p>'
            ],
            simple: [
              '<p>Count the parts. Discuss both views + opinion = 3. Two questions = 2. Causes + solutions = 2. Agree or disagree = 1 position, 2 reasons.</p>',
              '<p>One part, one paragraph. A part answered in one sentence is not answered.</p>',
              '<p>Look for hidden parts: "schools, parents and governments" is three things; "for the country as a whole" says who the answer is about.</p>'
            ],
            examples: [
              { s: '"Discuss both views and give your own opinion." → (1) view A · (2) view B · (3) my verdict, in the introduction and the conclusion.', g: 'Three parts. Miss the third and TR stops at 6.' },
              { s: '"Why has this become so common? Is it a positive or a negative development?" → (1) the reasons · (2) my judgement.', g: 'Two parts, one paragraph each, equal weight.' },
              { s: '<s>Body A: three reasons students go to tutoring centres. Body B: more reasons. Conclusion: "Overall it is positive."</s>', g: 'The second question answered in four words. A part not answered.' },
              { s: '"What could schools, parents and governments do?" → three actors, each with a measure that answers a cause.', g: 'A part hidden inside a part.' }
            ]
          },
          items: [
            { id: 'm01s3q1', type: 'select', tag: 'tr-partial', level: 'B2', prompt: 'p-cars-city',
              stem: 'Tick the three parts this prompt requires.',
              options: ['The view that cars should be banned from city centres', 'The view that people should be free to drive where they wish', 'Your own opinion on the issue', 'The causes of city pollution', 'Solutions to traffic congestion', 'A description of public transport in Bangkok'], answers: [0, 1, 2], k: 3,
              why: '"Discuss both views and give your own opinion" is three parts: view A, view B, your verdict. Causes, solutions and a description of transport belong to other question types.' },
            { id: 'm01s3q2', type: 'choose', tag: 'tr-partial', level: 'B2', prompt: 'p-private-tutoring',
              stem: 'How many parts must this essay answer?',
              options: ['One: whether tutoring is good or bad', 'Two: why it is common, and whether it is good or bad', 'Three: the causes, the effects and the possible solutions', 'Four: two views, an opinion and a solution'], answer: 1,
              hint: 'Use the instruction sentence, not the background, and ask what each direct question wants from you.',
              why: 'Two direct questions, two parts: the reasons it has become common, and your judgement on whether it is positive or negative. Nothing asks for effects or solutions.' },
            { id: 'm01s3q3', type: 'order', tag: 'tr-partial', level: 'B2',
              stem: 'Put the steps of decoding a prompt in order.',
              items: ['Read the instruction sentence and name the type', 'Count the parts that must be answered', 'Decide one position that covers every part', 'Give each part its own body paragraph'],
              why: 'Type first, because it tells you how many parts there are. Then the parts, then a position that covers all of them, then a paragraph for each. Planning in this order takes five minutes and protects Task Response.' },
            { id: 'm01s3q4', type: 'judge', tag: 'tr-partial', level: 'C1', prompt: 'p-cashless',
              given: 'An essay with one full paragraph on why cash is disappearing and one sentence saying the change is positive has answered this prompt fully.',
              stem: 'True or false?', answer: 1,
              why: 'False. Two-part questions need equal weight: one body paragraph each. A judgement in a single sentence is a part not answered, and Band 6 TR ("some parts more fully covered than others") is the ceiling.' },
            { id: 'm01s3q5', type: 'choose', tag: 'tr-solution-mismatch', level: 'C1', prompt: 'p-online-scams',
              stem: 'The named cause: most young users cannot tell a fake shop or message from a real one. Which solution answers it?',
              options: ['A daily limit on how much money a teenager can transfer', 'Faster refunds for victims from the banks', 'Much harsher prison sentences for every convicted fraudster', 'Compulsory scam-recognition lessons in secondary school'], answer: 3,
              why: 'The cause is that young users cannot recognise a scam, so the solution teaches them to recognise one. Transfer limits and refunds reduce the loss after it happens, and harsher sentences answer a different cause (weak deterrence), not this one.' },
            { id: 'm01s3q6', type: 'spot', tag: 'tr-listing', level: 'C1',
              stem: 'Tap the chunk that shows this writer has misread an "outweigh" prompt.',
              words: ['This essay', 'will present', 'both the advantages', 'and the disadvantages', 'of online lessons', 'without deciding', 'which is greater.'], answer: 5,
              fix: 'and then decide',
              why: '"Outweigh" asks for exactly that judgement. Refusing to say which side is greater turns the essay into a list and leaves Task Response without a position.' },
            { id: 'm01s3q7', type: 'choose', tag: 'kn-question-type', level: 'C1', prompt: 'p-rural-youth',
              stem: 'Which plan matches the parts of this prompt?',
              options: ['Body A: why the young leave; Body B: whether this helps or harms the country', 'Body A: the reasons young people leave; Body B: measures villages could take to keep them', 'Body A: advantages of city life; Body B: disadvantages of city life', 'Body A: the view of the young; Body B: the view of their parents'], answer: 0,
              hint: 'Match each body paragraph to one direct question in the instruction, and note who the second question is about.',
              why: 'Two questions, two paragraphs: the reasons, then a judgement "for the country as a whole". Measures to keep them are a solution nobody asked for; advantages and two views belong to other types.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm01ck', name: 'Systems Check', items: [
        { id: 'm01ckq1', type: 'choose', tag: 'kn-question-type', level: 'B1', prompt: 'p-school-snacks',
          stem: 'Which type is this prompt?',
          options: ['Problem and solution', 'Advantages and disadvantages', 'Discuss both views', 'Opinion (agree or disagree)'], answer: 3,
          hint: 'The background describes a situation, but the type comes from the final sentence only.',
          why: 'The background describes a problem (rising obesity), but the instruction is "To what extent do you agree or disagree?". Opinion: one position on the snack ban, held to the end.' },
        { id: 'm01ckq2', type: 'choose', tag: 'tr-listing', level: 'B2', prompt: 'p-foreign-pop-culture',
          stem: 'Which introduction sentence answers the instruction?',
          options: ['Young people now follow foreign trends far more closely than their own traditions.', 'This essay will examine the main advantages and disadvantages of this development for young people.', 'Although some local identity is lost, the benefits of openness outweigh that cost.', 'Some people welcome this change while others fear it.'], answer: 2,
          hint: 'Check the instruction sentence for the word that asks you to compare the two sides.',
          why: 'Only the third sentence weighs the two sides and names the heavier one. The others repeat the background or announce a list, and neither gives the examiner a position to quote.' },
        { id: 'm01ckq3', type: 'sort', tag: 'kn-question-type', level: 'B2',
          stem: 'Sort each instruction: does it ask for your verdict, or for causes and measures?',
          bins: [{ key: 'v', label: 'Asks for your verdict', hint: 'opinion, weighing, judgement' }, { key: 'c', label: 'Asks for causes and measures', hint: 'problem / solution' }],
          items: [
            { text: 'Discuss both views and give your own opinion.', bin: 'v' },
            { text: 'What are the causes of this problem? What measures could reduce it?', bin: 'c' },
            { text: 'Do the advantages outweigh the disadvantages?', bin: 'v' },
            { text: 'Why has this happened? What can be done about it?', bin: 'c' },
            { text: 'To what extent do you agree or disagree?', bin: 'v' },
            { text: 'Why has this become common? Is it a positive or a negative development?', bin: 'v' }
          ],
          why: 'Opinion, Discuss, Advantages and the second half of a Two-part question all want a verdict. Only the Problem / solution type asks for causes and measures instead, and its "why" is followed by "what can be done".' },
        { id: 'm01ckq4', type: 'judge', tag: 'tr-position-late', level: 'B2', prompt: 'p-prisons',
          given: 'For this prompt, the writer must say in the introduction whether they favour punishment or reform, not only in the conclusion.',
          stem: 'True or false?', answer: 0,
          hint: 'Think about when the examiner should first learn which view the writer holds.',
          why: 'True. Discuss both views needs the verdict in the introduction as well as the conclusion. An opinion that first appears in the last paragraph is the Band 6 pattern: two neutral paragraphs and an afterthought.' },
        { id: 'm01ckq5', type: 'choose', tag: 'tr-solution-mismatch', level: 'B2', prompt: 'p-teen-sleep',
          stem: 'The named cause: early school start times clash with the teenage body clock. Which solution matches?',
          options: ['Banning phones from bedrooms after ten o\'clock', 'Starting the school day later for older students', 'More physical education lessons to tire students out', 'Free breakfast at school for tired students'], answer: 1,
          why: 'The cause is the timetable, so the solution moves the timetable. A phone ban answers a different cause (late-night screens); exercise and breakfast treat the tiredness, not its source.' },
        { id: 'm01ckq6', type: 'select', tag: 'tr-partial', level: 'C1', prompt: 'p-science-funding',
          stem: 'Tick the three parts this prompt requires.',
          options: ['The case for funding only science degrees', 'The case for keeping public money in arts subjects', 'Your own view on how funding should be divided', 'The causes of rising tuition fees', 'A solution to the shortage of science graduates', 'A comparison of Thai and British universities'], answers: [0, 1, 2], k: 3,
          why: 'Discuss both views: view A (science only), view B (keep funding the arts), and your verdict. Tuition fees, graduate shortages and a country comparison are not in the prompt.' },
        { id: 'm01ckq7', type: 'choose', tag: 'kn-question-type', level: 'C1', prompt: 'p-children-tv',
          stem: 'This prompt says "describe some advantages and disadvantages". What is the safest way to answer it?',
          options: ['A main advantage, a main drawback, and a clear verdict', 'The longest possible list of advantages and disadvantages', 'The causes of heavy viewing and what parents can do', 'Only the disadvantages, since they are more serious'], answer: 0,
          hint: 'Ask which plan covers everything the instruction names and still gives the examiner a position to quote.',
          why: 'Even without the word "outweigh", this is the weighing type. One developed advantage, one developed drawback and a verdict give the examiner a position; a long list gives nothing to quote, and causes are a different type.' },
        { id: 'm01ckq8', type: 'choose', tag: 'tr-partial', level: 'B2', prompt: 'p-youth-unemployment',
          stem: 'Which plan answers both questions in this prompt?',
          options: ['Body A: why graduates struggle; Body B: why employers struggle', 'Body A: advantages of university; Body B: disadvantages', 'Body A: the causes; Body B: measures that answer those causes', 'Body A: causes and measures; Body B: your opinion of universities'], answer: 2,
          hint: 'Check that the plan reaches both direct questions in the prompt and gives each one its own paragraph.',
          why: 'Causes, then measures that answer them: two parts, one paragraph each. The first plan gives two paragraphs of causes and no measures; the others answer questions the prompt never asked.' }
      ] }
    }]
  });
})();
