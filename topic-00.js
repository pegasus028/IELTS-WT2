/* POSITION CONTROL — topic-00.js · Module 00 The Test */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm00', n: 0, code: 'Module 00', name: 'The Test', art: 'chip', cefr: 'B1–C1',
    blurb: 'Forty minutes, 250 words, four criteria: the numbers and the gates before you write a word.',
    levels: [{
      id: 'm00l1', n: 1, name: 'The Test', cefr: 'B1–C1', blurb: 'What Task 2 is, how it is marked, and what the examiner punishes.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm00s1', name: 'The facts', cefr: 'B1',
          theory: {
            key: 'Task 2: 40 minutes, at least 250 words, two-thirds of your Writing score, as one connected essay.',
            body: [
              '<p>The Writing test lasts <strong>60 minutes</strong> and has two tasks. Task 1 (the chart or letter) is worth one third of the Writing score; <strong>Task 2 is worth two thirds</strong>, twice as much as Task 1. So the sensible split is <strong>20 minutes for Task 1 and 40 for Task 2</strong>. Students who give 30 minutes to the chart and 30 to the essay are spending half their time on the task that pays the least.</p>',
              '<p>The essay must be <strong>at least 250 words</strong>. There is no fixed deduction for 240 words, but the official rule is that a short answer may not give <em>"enough evidence of the language features needed in order to award higher bands"</em>. Too few words means too little to mark. The target is <strong>260–290</strong>: safely over the line, but not so long that errors multiply and checking time disappears.</p>',
              '<p>Inside the 40 minutes the plan is <strong>5 / 30 / 5</strong>: five minutes to decode the prompt and fill the matrix, thirty to write, five to check. Your position sentence should be on the page inside the first ten minutes. At minute 40 you stop, whatever is unfinished, because Task 2 has no extra time.</p>',
              '<p>Three format rules. The answer must be <strong>a whole piece of connected text</strong>: no bullet points, no notes, no headings. It must answer the prompt in front of you: an off-topic essay is penalised however good its English. And it must be your own: copied or memorised text is penalised <em>"severely"</em>, and a fully memorised essay can score Band 0.</p>'
            ],
            simple: [
              '<p>Task 2 = 40 minutes and at least 250 words. It is worth twice as much as Task 1, so give it twice the time.</p>',
              '<p>Plan 5 minutes, write 30, check 5. Aim for 260–290 words.</p>',
              '<p>Write one connected essay in paragraphs. No bullet points, no notes, no memorised text, and stay on the topic you were given.</p>'
            ],
            examples: [
              { s: 'Task 1: 20 minutes, 150+ words, one third of the score. Task 2: 40 minutes, 250+ words, two thirds of the score.', g: 'The arithmetic of the Writing test. Learn it cold.' },
              { s: '5 minutes decode and plan · 30 minutes write · 5 minutes check. Position on the page by minute 10.', g: 'The 5 / 30 / 5 protocol every timed essay in this app follows.' },
              { s: '<s>Advantages: · cheaper · faster · greener</s>', g: 'Bullet points are notes, not an essay. This costs marks in Coherence and Cohesion and gives the examiner nothing to assess.' },
              { s: '<s>In the modern world, technology plays an important role in our lives, and…</s> (for a prompt about school uniforms)', g: 'A memorised essay on the wrong topic: off topic and memorised at once. The examiner cannot score what does not answer the question.' }
            ]
          },
          items: [
            { id: 'm00s1q1', type: 'choose', tag: 'kn-test-facts', level: 'B1',
              stem: 'How long should you give Task 2 inside the 60-minute Writing test?',
              options: ['20 minutes', '30 minutes', '40 minutes', '60 minutes'], answer: 2,
              hint: 'Remember which of the two tasks carries the heavier weight, and give it the larger share.',
              why: 'Forty minutes. Task 2 is worth twice as much as Task 1, so it gets twice the time: 20 for the chart, 40 for the essay.' },
            { id: 'm00s1q2', type: 'choose', tag: 'kn-test-facts', level: 'B1',
              stem: 'How much of the Writing score comes from Task 2?',
              options: ['Half, the same as Task 1', 'One third, less than Task 1', 'Three quarters, since it is the longer task', 'Two thirds, twice Task 1'], answer: 3,
              hint: 'The two tasks are not weighted equally; ask which one demands more words and more argument.',
              why: 'Two thirds. The official format page says Task 2 "contributes twice as much as Task 1". A weak Task 2 cannot be rescued by a strong chart report.' },
            { id: 'm00s1q3', type: 'judge', tag: 'struct-length', level: 'B1',
              given: 'An essay of 230 words loses a fixed number of marks for being short.',
              stem: 'True or false?', answer: 1,
              why: 'False. There is no fixed deduction. The real cost is that 230 words may not give "enough evidence of the language features needed" for the higher bands, so the examiner has less to reward. Write 260–290.' },
            { id: 'm00s1q4', type: 'choose', tag: 'struct-time', level: 'B2',
              stem: 'What does the 5 / 30 / 5 protocol mean?',
              options: ['5 minutes to read, 30 to plan, 5 to write', '5 minutes to plan, 30 to write, 5 to check', '5 minutes to plan, 30 to write both tasks, 5 to check', '5 minutes to check, 30 to write, 5 to plan'], answer: 1,
              hint: 'The three numbers are minutes inside Task 2, in the order a careful writer works through the essay.',
              why: 'Plan first, write in the middle, check at the end, all inside the 40 minutes of Task 2. Five minutes on the matrix before writing produces a faster, clearer essay than starting to write at minute one.' },
            { id: 'm00s1q5', type: 'sort', tag: 'kn-test-facts', level: 'B1',
              stem: 'Sort: is each of these allowed in a Task 2 answer?',
              bins: [{ key: 'ok', label: 'Allowed', hint: 'connected text, your own words' }, { key: 'no', label: 'Not allowed', hint: 'notes, headings, memorised text' }],
              items: [
                { text: 'Bullet points listing your three reasons', bin: 'no' },
                { text: 'Four paragraphs with a blank line between them', bin: 'ok' },
                { text: 'A memorised essay on a similar topic', bin: 'no' },
                { text: 'An example from your own school', bin: 'ok' },
                { text: 'A heading such as "Advantages" above a paragraph', bin: 'no' },
                { text: 'Your own opinion in the first paragraph', bin: 'ok' }
              ],
              why: 'The answer must be a whole piece of connected text in your own words. Paragraphs, examples from your own life and a stated opinion are exactly what the examiner wants; bullets, headings and memorised text are penalised.' },
            { id: 'm00s1q6', type: 'choose', tag: 'struct-length', level: 'B2',
              stem: 'Which word count is the best target for a Task 2 essay?',
              options: ['About 260 to 290', 'Exactly 250, no more', 'As many as possible in 40 minutes', 'At least 350 to show your range'], answer: 0,
              hint: 'You want a margin above the minimum, but not so many words that errors grow and checking time disappears.',
              why: 'Safely over 250, but not far over. Exactly 250 leaves no margin for a miscount; beyond 320 the errors multiply and the five checking minutes vanish.' },
            { id: 'm00s1q7', type: 'judge', tag: 'kn-test-facts', level: 'B2',
              given: 'Copying the question sentence word for word into your introduction is a safe way to start.',
              stem: 'True or false?', answer: 1,
              why: 'False. Copied text is not credited and can be penalised as plagiarism. Restate the Core Topic in your own words: "the regulation of private cars in city centres", not the prompt\'s sentence.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm00s2', name: 'The four criteria and their gates', cefr: 'B2',
          theory: {
            key: 'Four criteria at 25% each, and each band names one thing the essay must do: the gate.',
            body: [
              '<p>The essay is marked on four criteria of equal weight: <strong>Task Response (TR)</strong>, did you answer every part with one clear, developed position? <strong>Coherence and Cohesion (CC)</strong>, is there one idea per paragraph, progression, and cohesion that does not attract attention? <strong>Lexical Resource (LR)</strong>, precise words in their usual partner phrases? <strong>Grammatical Range and Accuracy (GRA)</strong>, a variety of structures with frequent error-free sentences? The band is the average of the four.</p>',
              '<p><strong>Task Response.</strong> Band 6: a position is presented "although the conclusions drawn may be unclear". Band 7: "a clear and developed position", but "a tendency to over-generalise". Band 8: ideas "well extended and supported". So the 6→7 gate is <em>one clear position from the first paragraph to the last</em>; the 7→8 gate is <em>no over-generalising</em>: every idea carries a mechanism (how it works) and something concrete.</p>',
              '<p><strong>Coherence and Cohesion.</strong> Band 6: cohesion "mechanical" through "overuse". Band 7: "clear progression", "a clear central topic within each paragraph", reference and substitution "used flexibly". Band 8: "the message can be followed with ease". The 6→7 gate is one idea per paragraph; the 7→8 gate is cohesion you cannot see: "this policy", "doing so", one sentence leading into the next, instead of Firstly, Moreover, In addition.</p>',
              '<p><strong>Lexical Resource and Grammar.</strong> LR Band 7: "an awareness of style and collocation is evident, though inappropriacies occur"; Band 8: "precise meanings". The gate is <em>collocation, not rarity</em>: "make a decision" beats a rare word used slightly wrongly. GRA Band 6: complex sentences less accurate than simple ones; Band 7: "error-free sentences are frequent"; Band 8: "the majority of sentences are error-free". The gate is <em>accuracy</em>: three or four structures you control beat ten you do not.</p>'
            ],
            simple: [
              '<p>Four marks, each 25%: TR (did you answer with a clear position?), CC (one idea per paragraph, easy to follow), LR (the right words together), GRA (correct sentences, some variety).</p>',
              '<p>Each band asks for one new thing. TR: a clear position, then no vague claims. CC: one idea per paragraph, then fewer "Firstly / Moreover". LR: correct word partners. GRA: most sentences with no error.</p>',
              '<p>The criterion names the fix. "No opinion" is TR. "Too many linking words" is CC. "Wrong word partner" is LR. "Verb does not match subject" is GRA.</p>'
            ],
            examples: [
              { s: '"The writer never says which view they hold." → Task Response, the 6→7 gate.', g: 'No clear position caps TR at 6.' },
              { s: '"Firstly… Secondly… Moreover… In conclusion…" → Coherence and Cohesion, Band 6: "mechanical".', g: 'Visible, mechanical cohesion. Band 7 wants reference and progression instead.' },
              { s: '"<s>Make a solution</s>" → "find a solution": Lexical Resource, the collocation gate.', g: 'Not a rare word; the usual partner word.' },
              { s: '"<s>The number of cars have risen</s>" → "has risen": Grammatical Range and Accuracy.', g: 'One error in a complex sentence. Band 8 needs the majority error-free.' }
            ]
          },
          items: [
            { id: 'm00s2q1', type: 'choose', tag: 'kn-test-facts', level: 'B1',
              stem: 'How is the Task 2 band produced from the four criteria?',
              options: ['The lowest of the four is used', 'Task Response counts double', 'The examiner gives one overall impression mark', 'The average of the four, each worth 25%'], answer: 3,
              hint: 'Ask whether a very strong grammar mark could hide a weak Task Response mark, and what that says about how the four combine.',
              why: 'Equal weight, averaged. A Band 8 in grammar cannot hide a Band 5 in Task Response; every criterion moves the final band by the same amount.' },
            { id: 'm00s2q2', type: 'sort', tag: 'kn-criteria', level: 'B2',
              stem: 'Sort each examiner comment into the criterion it belongs to.',
              bins: [{ key: 'tr', label: 'Task Response', hint: 'position, parts, development' }, { key: 'cc', label: 'Coherence and Cohesion', hint: 'paragraphs, linking, flow' }, { key: 'lr', label: 'Lexical Resource', hint: 'word choice, collocation' }],
              items: [
                { text: 'The writer never says which view they hold', bin: 'tr' },
                { text: 'Every sentence begins with Firstly, Moreover or However', bin: 'cc' },
                { text: '"Make a solution" should be "find a solution"', bin: 'lr' },
                { text: 'The second question is answered in a single sentence', bin: 'tr' },
                { text: 'Two different ideas are mixed in one paragraph', bin: 'cc' },
                { text: '"Paramount" is used where "important" was meant', bin: 'lr' }
              ],
              why: 'The criterion names the fix. Position and parts are TR; linking words and one idea per paragraph are CC; word partners and precision are LR. Map every comment you receive onto one of the four.' },
            { id: 'm00s2q3', type: 'choose', tag: 'kn-criteria', level: 'B2',
              stem: 'Which change most often lifts Task Response from Band 6 to Band 7?',
              options: ['A third body paragraph that introduces a new idea', 'A clear position held from the start to the end', 'Rarer vocabulary in every paragraph', 'Extra length, well above three hundred words'], answer: 1,
              hint: 'Look at what the Band 6 descriptor for Task Response still permits and Band 7 no longer allows.',
              why: 'Band 6 TR allows a position whose "conclusions may be unclear"; Band 7 demands "a clear and developed position". Vocabulary is LR, and length and a third paragraph add nothing if the position is unclear.' },
            { id: 'm00s2q4', type: 'judge', tag: 'kn-criteria', level: 'B2',
              given: 'The examiner marks Lexical Resource by counting how many rare words the essay contains.',
              stem: 'True or false?', answer: 1,
              why: 'False. LR rewards precision and collocation: Band 8 is "precise meanings", Band 7 "awareness of style and collocation". A rare word used slightly wrongly is an "inappropriacy" and lowers the mark.' },
            { id: 'm00s2q5', type: 'choose', tag: 'kn-criteria', level: 'B2',
              stem: 'Band 7 grammar says error-free sentences are "frequent". What does Band 8 require?',
              options: ['No errors anywhere in the essay', 'A wide range of tenses in every paragraph', 'The majority of sentences error-free', 'More complex sentences than simple ones'], answer: 2,
              hint: 'Band 8 asks for more than Band 7 but stops short of perfection; think in terms of a share of the essay.',
              why: '"The majority of sentences are error-free." Not perfection, but more correct than faulty. This is why three or four structures you control beat a wider range you do not.' },
            { id: 'm00s2q6', type: 'choose', tag: 'kn-criteria', level: 'C1',
              stem: 'Which fault stops Coherence and Cohesion reaching Band 7?',
              options: ['Two ideas developed inside one body paragraph', 'An essay of exactly four paragraphs', 'A conclusion that restates the position in fresh words', 'Reference words such as "this policy" and "doing so"'], answer: 0,
              hint: 'Three of these are things a Band 7 essay does; find the one that makes a paragraph harder to follow.',
              why: 'Band 7 CC requires "a clear central topic within each paragraph". Four paragraphs, a restated conclusion and reference words are all Band 7 features, not faults.' },
            { id: 'm00s2q7', type: 'judge', tag: 'kn-criteria', level: 'B2',
              given: 'At Band 8, "well extended and supported" means a paragraph states an idea, explains how it works and gives a concrete case.',
              stem: 'True or false?', answer: 0,
              why: 'True. Band 7 is capped by "a tendency to over-generalise"; Band 8 ideas are "well extended and supported". The mechanism and the concrete case are what remove the generalisation.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm00s3', name: 'What the examiner punishes', cefr: 'B2',
          theory: {
            key: 'Five things cost bands before the examiner even judges your ideas: off topic, memorised, under length, no clear position, informal.',
            body: [
              '<p><strong>Off topic.</strong> The prompt you were given is the only prompt that counts. A prepared essay about technology, written for a prompt about school uniforms, scores as if it had not answered at all. Underline the two or three key nouns of the prompt and use them in every topic sentence; if a paragraph would survive a change of prompt, it is off topic.</p>',
              '<p><strong>Memorised.</strong> The descriptors name "over-dependence on memorised language", and a fully memorised essay is Band 0. Examiners recognise the stock phrases, the introductions that fit any topic and the frames ten students from one school all use. A template is a scaffold: the words that carry marks are inside the slots, in your own language.</p>',
              '<p><strong>Under length and no position.</strong> Under 250 words there is too little evidence for the higher bands. And an essay where the examiner cannot say in one sentence what you think has no "clear position": TR stays at 6 however elegant the sentences. Length and position are the two cheapest bands in the test.</p>',
              '<p><strong>Informal.</strong> Task 2 is a formal essay. No contractions (<em>don\'t, isn\'t</em>), no <em>you</em>, no rhetorical questions, no exclamation marks, no <em>kids, stuff, a lot of</em>. "I believe" is fine in the thesis and the conclusion; in every sentence it becomes a habit the examiner notices. Register faults are cheap to fix and impossible to hide.</p>'
            ],
            simple: [
              '<p>Answer the prompt you were given, in your own words. A prepared essay on a different topic scores almost nothing.</p>',
              '<p>Memorised phrases are marked down. Write at least 250 words and say clearly what you think in paragraph one.</p>',
              '<p>Formal English only: no don\'t or isn\'t, no "you", no questions, no "kids" or "a lot of".</p>'
            ],
            examples: [
              { s: '<s>Kids these days use their phones a lot, don\'t they?</s>', g: 'Four register faults in one sentence: kids, a lot, a contraction, a rhetorical question.' },
              { s: 'Children now use their phones for several hours a day.', g: 'The same idea in the register of the essay.' },
              { s: '<s>This essay will discuss the advantages and disadvantages of this topic.</s>', g: 'Fits any prompt, so it says nothing about this one. Name the topic and state the position.' },
              { s: 'I believe that schools should stop selling sugary snacks, because the school day is the one place where a healthy choice can be made the easy one.', g: '"I believe" in the thesis is exactly where it belongs.' }
            ]
          },
          items: [
            { id: 'm00s3q1', type: 'spot', tag: 'lr-register', level: 'B2',
              stem: 'Tap the chunk that breaks the formal register.',
              words: ['Many parents', 'in Bangkok', "don't", 'allow their children', 'to use phones', 'during dinner.'], answer: 2,
              fix: 'do not',
              why: 'A contraction is spoken English. Write the full form: do not, cannot, it is. The examiner sees a contraction in the first line and marks LR down from the start.' },
            { id: 'm00s3q2', type: 'choose', tag: 'kn-test-facts', level: 'B2',
              stem: 'A student answers a prompt about school uniforms with a prepared essay about technology in schools. What happens?',
              options: ['It scores well because the grammar is accurate', 'The examiner marks only the grammar and vocabulary', 'It is accepted if it has more than 250 words', 'It is marked as off topic and scores very low'], answer: 3,
              why: 'Off topic. The official rules say candidates are penalised for not answering the question set, and a memorised essay is discounted as well. Good grammar cannot rescue an answer to a different prompt.' },
            { id: 'm00s3q3', type: 'select', tag: 'lr-register', level: 'B2',
              stem: 'Tick the three things that break the formal register of an essay.',
              options: ['Contractions such as "isn\'t"', 'The phrase "I believe" in the thesis', 'Addressing the reader as "you"', 'A concrete example from Thailand', 'Rhetorical questions', 'The passive voice', 'A position stated in paragraph one'], answers: [0, 2, 4], k: 3,
              hint: 'Ask which of these you would hear in conversation but never read in a formal report.',
              why: 'Contractions, "you" and rhetorical questions belong to speech. "I believe" in the thesis, a Thai example, the passive and an early position are all features of a good essay.' },
            { id: 'm00s3q4', type: 'judge', tag: 'struct-length', level: 'B2',
              given: 'Under 250 words there is no fixed deduction, but the examiner may have too little evidence to award the higher bands.',
              stem: 'True or false?', answer: 0,
              hint: 'Think about what the examiner actually uses the word count for.',
              why: 'True. There is no automatic deduction, but the official rule is that a short answer may not give "enough evidence of the language features needed" for the higher bands. So never be under: 260–290 words.' },
            { id: 'm00s3q5', type: 'choose', tag: 'kn-criteria', level: 'C1',
              stem: 'Which fault costs Task Response and Coherence at the same time?',
              options: ['A new idea introduced in the conclusion', 'A comma splice in the second body paragraph', 'A rare word used slightly wrongly', '"Firstly, Secondly, Finally" in every paragraph'], answer: 0,
              hint: 'One of these faults is about ideas and about the shape of the essay at the same time; the others each belong to a single criterion.',
              why: 'A new idea in the conclusion is undeveloped (TR) and breaks the shape of the essay (CC). The comma splice is GRA, the rare word is LR, and mechanical "Firstly, Secondly" is CC alone.' },
            { id: 'm00s3q6', type: 'spot', tag: 'lr-register', level: 'C1',
              stem: 'Tap the chunk the examiner would mark as informal.',
              words: ['Governments', 'should tax', 'sugary drinks', 'because', 'kids', 'buy them', 'every day', 'after school.'], answer: 4,
              fix: 'children',
              why: '"Kids" is conversational. The essay word is "children" or "young people". Everything else in the sentence is formal and precise.' },
            { id: 'm00s3q7', type: 'choose', tag: 'kn-test-facts', level: 'B2',
              stem: 'Which of these does the examiner punish most severely?',
              options: ['An essay with several small errors with articles', 'An essay copied from a memorised model', 'An essay of 240 words', 'An essay with only one linking word'], answer: 1,
              hint: 'Three of these cost part of one criterion; one of them can bring the whole essay down to Band 0.',
              why: 'Copied or memorised text is penalised "severely", and a fully memorised essay is Band 0. Article errors, a slightly short essay and few linkers each cost part of one criterion, not the whole mark.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm00ck', name: 'Systems Check', items: [
        { id: 'm00ckq1', type: 'choose', tag: 'kn-test-facts', level: 'B1',
          stem: 'What is the minimum word count for a Task 2 essay?',
          options: ['150', '200', '250', '300'], answer: 2,
          hint: 'The essay carries two thirds of the score, so it asks for more words than the Task 1 report does.',
          why: 'At least 250. Task 1 is 150. Aim for 260–290 so that a miscount cannot put you under the line.' },
        { id: 'm00ckq2', type: 'choose', tag: 'struct-time', level: 'B2',
          stem: 'Within the 40 minutes, when should the position sentence be on the page?',
          options: ['In the last five minutes, once both sides are clear', 'After both body paragraphs are written', 'Whenever the ideas feel ready', 'Within the first ten minutes'], answer: 3,
          hint: 'Think about which paragraph carries the position, and where that paragraph sits in the 5 / 30 / 5 plan.',
          why: 'Five minutes to plan, then the introduction with its position in the first minutes of writing. A position written last is often not written at all, and TR stays at Band 6.' },
        { id: 'm00ckq3', type: 'judge', tag: 'kn-criteria', level: 'B2',
          given: 'This writer states a clear position in paragraph one, so Task Response will be Band 7.',
          stem: 'True, false, or can\'t tell?', answer: 2,
          why: 'Can\'t tell. A clear position is the 6→7 gate, but Band 7 also needs main ideas "extended and supported". One sentence cannot show whether the body paragraphs do that.' },
        { id: 'm00ckq4', type: 'sort', tag: 'kn-criteria', level: 'B2',
          stem: 'Sort each examiner comment: is it Lexical Resource or Grammatical Range and Accuracy?',
          bins: [{ key: 'lr', label: 'Lexical Resource', hint: 'words, partners, spelling' }, { key: 'gra', label: 'Grammar', hint: 'sentences, agreement, articles' }],
          items: [
            { text: '"Do a mistake" should be "make a mistake"', bin: 'lr' },
            { text: '"The number of cars have risen"', bin: 'gra' },
            { text: '"Curtail" used where "reduce" was meant', bin: 'lr' },
            { text: 'Two full sentences joined by only a comma', bin: 'gra' },
            { text: 'Missing "the" before "government"', bin: 'gra' },
            { text: 'Spelling: "goverment", "enviroment"', bin: 'lr' }
          ],
          why: 'Word choice, collocation and spelling are Lexical Resource. Agreement, punctuation and articles are Grammatical Range and Accuracy. Knowing which is which tells you which module to open.' },
        { id: 'm00ckq5', type: 'choose', tag: 'kn-test-facts', level: 'B2',
          stem: 'Which format costs marks because the answer is not "connected text"?',
          options: ['Notes and bullet points under each heading', 'A blank line left between each of the paragraphs','An introduction of only two sentences', 'A conclusion beginning "In conclusion"'], answer: 0,
          hint: 'The rule is about the shape of the answer on the page: it must read as one continuous essay.',
          why: 'The rules say you "must not use notes or bullet points". Blank lines between paragraphs, a short introduction and a plain conclusion are all part of the expected shape.' },
        { id: 'm00ckq6', type: 'spot', tag: 'lr-register', level: 'B2',
          stem: 'Tap the informal chunk.',
          words: ['Online learning', 'gives students', 'more freedom,', 'but', 'it is', 'a lot of', 'work', 'for teachers.'], answer: 5,
          fix: 'a great deal of',
          why: '"A lot of" is conversational. In the essay use "a great deal of", "considerable" or "much". The rest of the sentence is already formal.' },
        { id: 'm00ckq7', type: 'choose', tag: 'kn-criteria', level: 'C1',
          stem: 'Which improvement targets the 7 to 8 gate in Lexical Resource?',
          options: ['Replacing every common word with a rarer synonym', 'Adding an idiom to every paragraph', 'Using each word in its usual partner phrase', 'Repeating the key noun for clarity'], answer: 2,
          hint: 'Band 8 rewards "precise meanings"; ask which option makes a word more precise rather than more impressive.',
          why: 'Band 8 LR is "precise meanings" and the Band 7 fault is collocation "inappropriacies". The gate is the right partner word, not a rarer one; idioms and repetition move the mark down.' },
        { id: 'm00ckq8', type: 'judge', tag: 'struct-length', level: 'B2',
          given: 'Writing 350 words is safer than writing 280, because a longer essay shows more language.',
          stem: 'True or false?', answer: 1,
          why: 'False. Beyond about 320 words the errors multiply, the five checking minutes disappear, and the extra sentences are usually the weakest. 260–290 is the safe band.' }
      ] }
    }]
  });
})();
