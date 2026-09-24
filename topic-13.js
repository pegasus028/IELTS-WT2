/* POSITION CONTROL — topic-13.js · Module 13 Exam Day */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm13', n: 13, code: 'Module 13', name: 'Exam Day', art: 'clock', cefr: 'B1–C1',
    blurb: 'The forty minutes, the ten-point check, and the paper or the screen in front of you.',
    levels: [{
      id: 'm13l1', n: 1, name: 'Exam Day', cefr: 'B1–C1', blurb: 'Everything the other modules taught, run against the clock: the protocol, the pre-flight check and the two formats of the test.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm13s1', name: 'The 40-minute protocol', cefr: 'B1',
          theory: {
            key: 'Five minutes to decode and fill the matrix, thirty to write, five to check. The position is on the page by minute ten. Hard stop at forty.',
            body: [
              '<p>Task 2 gets forty of the sixty minutes because it is worth twice as much as Task 1. Inside those forty minutes the protocol is <strong>5 / 30 / 5</strong>, and the first five have two halves. <strong>Decode</strong> (about a minute): name the type from the last sentence of the prompt, count the parts, decide where the opinion goes. <strong>Matrix</strong> (the next four): the eleven variables in note form, on the question paper or the screen\'s note area, never in the answer itself. Then <strong>write</strong> until minute 35, and <strong>check</strong> until minute 40. Students who plan for five minutes write faster and better than students who start at minute one, because the paragraphs are already decided and the pen only has to follow them.</p>',
              '<p>The thirty writing minutes carry a word budget of 50 / 95 / 95 / 45, and the budget converts into a clock. The introduction, with the position in it, is on the page by <strong>minute 10</strong>; Body A by about minute 20; Body B by about minute 30; the conclusion by minute 35. The check at minute 20 is the useful one: if Body A is not finished, the paragraph is running long, and the place to save time is the example of Body B, kept to one sentence, or its nuance kept short. It is never the conclusion, because the conclusion carries the restated position, and a position that appears only once is half a position.</p>',
              '<p>At <strong>minute 35</strong> the pen changes job. Whatever is on the page is now checked, not extended: the word count, the paragraphs, the position in the introduction and again in the conclusion, and then your own top three errors. If the conclusion is not written at minute 35, that is the one exception: write a two-sentence conclusion first, verdict and reason, and then check. At <strong>minute 38 with 230 words</strong> the cheapest safe words are an example or a nuance inside the thinner body paragraph: one sentence beginning <em>for example</em> or <em>however</em> adds twenty words and Task Response credit at once. A fifth paragraph adds a new idea with no development, and <em>"In conclusion, it depends"</em> adds a fence.</p>',
              '<p><strong>Minute 40 is a hard stop</strong>, and the stop belongs to you, not to the invigilator: the Writing paper ends at sixty minutes, so a Task 2 that runs to minute 45 is a Task 1 that lost five. If the essay is unfinished at minute 38, the position sentence goes on the page as the last paragraph before anything else. An essay with an introduction, two bodies and a one-line conclusion is a complete piece of connected text; an essay with a beautiful Body B and no conclusion has lost check 2 of the ten. Practise the clock as a skill of its own: the Writer in this app shows the four phases on the timer, and every timed essay you write here should end at forty, not at forty-two.</p>'
            ],
            simple: [
              '<p>40 minutes = 5 plan + 30 write + 5 check. Plan: the type, the parts, the eleven variables in notes. Position on the page by minute 10.</p>',
              '<p>Budget: introduction by 10, Body A by 20, Body B by 30, conclusion by 35. Running late? Shorten the example of Body B, never the conclusion.</p>',
              '<p>Minute 35: stop writing and check. Minute 38 with 230 words: add one "for example" or "however" sentence to the thinner body paragraph. Minute 40: hands off.</p>'
            ],
            examples: [
              { s: '0–1 decode · 1–5 matrix · 5–35 write · 35–40 check.', g: 'The protocol, as the Writer shows it on the timer.' },
              { s: 'Introduction by 10 · Body A by 20 · Body B by 30 · conclusion by 35.', g: 'The word budget 50 / 95 / 95 / 45 turned into a clock.' },
              { s: 'For example, in Bangkok the free buses filled with people who used to walk, while the traffic on Sukhumvit barely moved.', g: 'Minute 38, 230 words: one example sentence in the thinner paragraph. Twenty words, and Task Response credit with them.' },
              { s: '<s>In conclusion, there are many opinions about this and it depends on the situation.</s>', g: 'The twenty words a tired writer adds at minute 38. They add a fence and remove the position.' }
            ]
          },
          items: [
            { id: 'm13s1q1', type: 'order', tag: 'struct-time', level: 'B1',
              stem: 'Put the four phases of the forty minutes in order.',
              hint: 'Each phase needs the one before it: you cannot check what is not written, or write what is not planned.',
              items: ['Decode: name the type, count the parts, decide where the opinion goes.', 'Matrix: fill the eleven variables in note form.', 'Write: introduction with the position, Body A, Body B, conclusion.', 'Check: word count, paragraphs, position in both places, your top three errors.'],
              why: 'Decode before you plan, plan before you write, write before you check. The decode decides how many parts the matrix needs; the matrix decides what the paragraphs say; the check protects what the writing produced.' },
            { id: 'm13s1q2', type: 'choose', tag: 'struct-time', level: 'B1',
              stem: 'By which minute of the forty should the position sentence be on the page?',
              hint: 'Add the planning time to the time the introduction takes, since the position sits inside the introduction.',
              options: ['Minute 5', 'Minute 20', 'Minute 35', 'Minute 10'], answer: 3,
              why: 'Five minutes of planning, then the introduction is the first thing written, and the position sits inside it. Minute 5 is still the matrix; minute 20 means Body A was written before the thesis; minute 35 is the check.' },
            { id: 'm13s1q3', type: 'choose', tag: 'struct-time', level: 'B2',
              stem: 'It is minute 35. Body B is finished, the conclusion is not written. What now?',
              hint: 'The check needs something complete to check; ask which paragraph carries the restated position.',
              options: ['Add the nuance sentence that Body B is missing, then write the conclusion if time is left.', 'Re-read the whole essay from the start to fix errors, then write the conclusion.', 'Stop writing: at minute 35 the checking phase begins, whatever is unfinished.', 'Write a two-sentence conclusion with the verdict and its reason, then check.'], answer: 3,
              why: 'The conclusion carries the restated position, which is check 2 of the ten and the cheapest half-band in the test. Two sentences, verdict and reason, take ninety seconds. Then the check. The protocol serves the essay; a missing conclusion is the one thing worth breaking it for.' },
            { id: 'm13s1q4', type: 'choose', tag: 'struct-length', level: 'B1',
              stem: 'Minute 38, 230 words, four paragraphs. Which twenty words should you add?',
              hint: 'Look for the twenty words that earn Task Response credit as well as length, without adding anything undeveloped.',
              options: ['A fifth paragraph with a new idea the body has not discussed.', 'Two more sentences in the introduction repeating the words of the prompt.', 'An example or a nuance inside the thinner body paragraph.', 'A final sentence: "In conclusion, it depends on the situation."'], answer: 2,
              why: 'Under 250 gives the examiner too little evidence, so the words must be added, and the safe ones sit inside a body paragraph: "for example …" or "however …" adds length and Task Response credit together. A new paragraph adds an undeveloped idea, copied prompt words are not counted as yours, and "it depends" removes the position.' },
            { id: 'm13s1q5', type: 'judge', tag: 'kn-test-facts', level: 'B1',
              given: 'The five planning minutes are wasted, because only the essay is marked and the notes are not.',
              stem: 'Is this claim correct?', answer: 1,
              hint: 'Ask what the five planning minutes buy for the thirty writing minutes that follow.',
              why: 'False. The notes are indeed not marked, but that is why they are free: five minutes on the matrix produces paragraphs that are already decided, so the thirty writing minutes go faster and the essay holds one idea per paragraph. Students who plan finish sooner than students who start writing at minute one.' },
            { id: 'm13s1q6', type: 'sort', tag: 'struct-time', level: 'B1',
              stem: 'Sort each action: it belongs in the first five minutes, or in the last five?',
              hint: 'Decisions belong before the writing; checks belong after it.',
              bins: [{ key: 'first', label: 'First five', hint: 'decode and matrix' }, { key: 'last', label: 'Last five', hint: 'the check' }],
              items: [
                { text: 'Name the question type and count the parts.', bin: 'first' },
                { text: 'Write the eleven variables in note form.', bin: 'first' },
                { text: 'Count the words paragraph by paragraph.', bin: 'last' },
                { text: 'Check that the position in the conclusion matches the introduction.', bin: 'last' },
                { text: 'Decide which side is heavier before writing a word.', bin: 'first' },
                { text: 'Hunt for your own top three errors.', bin: 'last' }
              ],
              why: 'Decisions come first: type, parts, variables, verdict. Checks come last: count, paragraphs, position echo, your error families. An action in the wrong five minutes costs twice: deciding the verdict at minute 37 means rewriting two paragraphs, and counting words at minute 4 means nothing to count.' },
            { id: 'm13s1q7', type: 'spot', tag: 'struct-time', level: 'B2',
              stem: 'Tap the chunk of this plan that breaks the protocol.',
              hint: 'Compare each step with the 5 / 30 / 5 budget and ask what must still happen after it.',
              words: ['Read the prompt twice,', 'fill the matrix in five minutes,', 'write the introduction with the position,', 'write both bodies,', 'write the conclusion at minute 40 if there is time,', 'then check.'], answer: 4,
              fix: 'write the conclusion by minute 35,',
              why: 'A conclusion at minute 40 is a conclusion with no check after it, and "if there is time" makes it optional, which it never is. The budget puts the conclusion at 35 so that five minutes remain for the ten-point check. Everything else in the plan is the protocol.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm13s2', name: 'The pre-flight check', cefr: 'B2',
          theory: {
            key: 'Ten checks, in the same order, every time. At minute 35 a tired writer should not have to decide what to look for.',
            body: [
              '<p>The last five minutes are a checklist, not a re-read. A re-read finds whatever the eye happens to land on; a checklist finds the same ten things every time, and the order matters because the expensive faults come first. This is the list the Writer\'s pre-flight panel runs, and it is the list to run in your head in the exam:</p><ol><li>Four or five paragraphs, and the position is stated clearly in paragraph one</li><li>The position is restated in fresh words in the last paragraph, with no new idea</li><li>Every part of the question is answered; both views appear if the prompt names two</li><li>Each body paragraph has one central idea, a mechanism and a concrete example</li><li>Each body paragraph admits a limit (nuance) without changing the overall position</li><li>Cohesion by reference and substitution, not a visible linker on every sentence</li><li>No memorised clichés, no "research shows", and no "I think" on every sentence</li><li>Formal register: no contractions, no "you", no rhetorical questions, no bullet points</li><li>Only complex structures you control; one deliberate swap per body paragraph at most</li><li>Between 260 and 290 words, counted before the final five-minute check begins</li></ol>',
              '<p>Checks <strong>1 to 5 are Task Response</strong>, and they are the ones that cost a whole band. A position that appears only in the conclusion (fails 1), a conclusion that adds a solution the body never developed (fails 2), a two-part prompt with one question answered in a sentence (fails 3), a body paragraph of three claims and no mechanism (fails 4), a nuance that switches sides (fails 5). Run these first because they are also the cheapest to fix in the time available: a missing position sentence is fifteen words; a new idea in the conclusion is one line struck through.</p>',
              '<p>Checks <strong>6 to 9 are the surface</strong>: cohesion, lexis, register, grammar. A paragraph that opens <em>Firstly … Secondly … Moreover … Finally</em> fails 6, and the repair is to strike all but one and let the reference words carry the link. <em>"Research shows"</em> and <em>"I think"</em> in every sentence fail 7. <em>Don\'t</em>, <em>you</em>, a question mark and a bullet point fail 8, and each of them takes two seconds to fix, which is why they are checked at all. Check 9 asks whether the inversion or the cleft you wrote is actually correct; if you are not sure, the plain version is worth more. Check 10 is the count, and both directions matter: under 250 is too little evidence, over 320 is multiplied errors.</p>',
              '<p>Use the list in two passes. Read the essay once for structure, checks 1 to 5, looking only at the first and last sentence of each paragraph and the moves inside the bodies. Read it once more for the surface, checks 6 to 10, hunting the visible faults. Do not rewrite a paragraph at minute 37: a sentence changed is a sentence that must be checked again, and the check is what you are short of. On the Writer\'s panel a red row means fix now, an amber row means fix if there is time, and the badge for zero red rows is called Pre-flight Perfect for a reason.</p>'
            ],
            simple: [
              '<p>The last five minutes: ten checks, always in the same order. 1–5 are Task Response: position in paragraph one, restated at the end with no new idea, every part answered, mechanism and example in each body, nuance that keeps the position.</p>',
              '<p>6–10 are the surface: reference words instead of a linker on every sentence, no clichés or "research shows", no contractions or "you" or questions or bullet points, only grammar you control, 260–290 words.</p>',
              '<p>Two passes: structure first, surface second. Fix, do not rewrite. Red = now; amber = if there is time.</p>'
            ],
            examples: [
              { s: '<s>Firstly, cameras stop crime. Secondly, they give evidence. Thirdly, they make people feel safe. Moreover, they are cheap.</s>', g: 'Fails check 6 (a linker on every sentence) and check 4 (four claims, no mechanism, no example).' },
              { s: '<s>In a nutshell, it\'s clear that you can\'t stop kids using phones.</s>', g: 'Fails check 7 (a memorised phrase) and check 8 (contractions, "you", "kids").' },
              { s: 'In conclusion, the answer is better buses first and the dirtiest cars gone after, because a city must protect its air and keep people moving.', g: 'Passes checks 1 and 2: the position restated in fresh words, the reason, nothing new.' },
              { s: '<s>In conclusion, councils should invest in buses, and they should also build cycle lanes across the whole city.</s>', g: 'Fails check 2: cycle lanes appear nowhere in the body.' }
            ]
          },
          items: [
            { id: 'm13s2q1', type: 'choose', tag: 'tr-new-idea', level: 'B2', prompt: 'p-free-transport',
              stem: 'This conclusion fails which check? "In conclusion, fares should stay low and the service improve; councils should also build more cycle lanes."',
              hint: 'Ask whether every solution in this conclusion has a body paragraph behind it.',
              options: ['Every part of the question is answered; both views appear if the prompt names two', 'The position is restated in fresh words in the last paragraph, with no new idea', 'Cohesion by reference and substitution, not a visible linker on every sentence', 'Between 260 and 290 words, counted before the final five-minute check begins'], answer: 1,
              why: 'Cycle lanes appear in no body paragraph, so the conclusion has introduced a solution with no mechanism, no example and no nuance behind it. Check 2 is the one that catches it, and the repair is a single line struck through.' },
            { id: 'm13s2q2', type: 'judge', tag: 'lr-register', level: 'B2', prompt: 'p-teen-jobs',
              given: 'Admittedly, a job can leave a student too tired to study; even so, a weekly limit on hours removes that risk.',
              stem: 'Check 8, formal register. Does this sentence pass?', answer: 0,
              why: 'True. No contraction, no "you", no question, no exclamation, no informal noun. "Admittedly … even so" is the grammar of a nuance in formal register. Check 8 is passed by what is absent, so a sentence with nothing on the banned list is clean.' },
            { id: 'm13s2q3', type: 'choose', tag: 'lr-register', level: 'B2', prompt: 'p-school-snacks',
              stem: 'This sentence fails which check? "Don\'t you think kids should be protected from sugary snacks at school?"',
              hint: 'Look at the punctuation and the pronouns before you look at the idea.',
              options: ['Formal register: no contractions, no "you", no rhetorical questions, no bullet points', 'Each body paragraph has one central idea, a mechanism and a concrete example', 'Each body paragraph admits a limit (nuance) without changing the overall position', 'Only complex structures you control; one deliberate swap per body paragraph at most'], answer: 0,
              why: 'A contraction, "you", "kids" and a question mark in one line: four register faults, and check 8 catches all of them. The repair is a statement with an impersonal subject: schools should protect students from sugary snacks during the school day.' },
            { id: 'm13s2q4', type: 'judge', tag: 'cc-paragraphing', level: 'B2',
              given: 'An essay written as one block of 270 words, with the position in the first sentence and again in the last.',
              stem: 'Check 1: four or five paragraphs, position in paragraph one. Does it pass?', answer: 1,
              hint: 'Check 1 has two halves; test the essay against each half separately.',
              why: 'False. The position is there, but one block is not paragraphs, and Coherence at Band 7 requires "a clear central topic within each paragraph", which a block cannot show. Check 1 has two halves; this essay passes one. A blank line before each body and before the conclusion repairs it in ten seconds.' },
            { id: 'm13s2q5', type: 'sort', tag: 'struct-length', level: 'B2',
              stem: 'Sort each fault by the check it fails: position (1–2), register (8), or length (10)?',
              bins: [{ key: 'pos', label: 'Position, checks 1–2', hint: 'paragraph one and the last' }, { key: 'reg', label: 'Register, check 8', hint: 'the banned list' }, { key: 'len', label: 'Length, check 10', hint: '260–290' }],
              items: [
                { text: 'The opinion appears for the first time in the last paragraph.', bin: 'pos' },
                { text: 'The essay ends with a question to the reader.', bin: 'reg' },
                { text: '238 words in four paragraphs.', bin: 'len' },
                { text: '"It\'s" and "don\'t" in Body A.', bin: 'reg' },
                { text: 'The introduction describes the debate but never says what the writer thinks.', bin: 'pos' },
                { text: '340 words in five paragraphs.', bin: 'len' }
              ],
              why: 'Naming the check names the fix. Position faults need a sentence added to paragraph one; register faults need one word changed; length faults need a sentence added to, or cut from, a body paragraph. Over 320 is a length fault too: the errors multiply and the check time disappears.' },
            { id: 'm13s2q6', type: 'spot', tag: 'tr-new-idea', level: 'B2', prompt: 'p-teen-sleep',
              stem: 'Tap the chunk that fails check 2 in this conclusion.',
              words: ['In conclusion,', 'schools should start the day later', 'for older students,', 'since only the timetable can change;', 'governments should also ban energy drinks for under-sixteens.'], answer: 4,
              fix: '(delete) The body never discussed energy drinks; end at "change".',
              why: 'Up to "change" the conclusion restates the position and gives its reason. "Governments should also ban" opens a new solution with no paragraph behind it, so the essay ends on an undeveloped idea. Check 2 exists to catch exactly this line, and the fix is to strike it.' },
            { id: 'm13s2q7', type: 'choose', tag: 'cc-paragraphing', level: 'B2',
              stem: 'Five minutes left. The essay has no conclusion and a contraction in Body A. Which fault matters more?',
              options: ['The contraction, since register errors are counted against every sentence they appear in.', 'Both equally, since each is one red row on the panel.', 'The missing conclusion, since the position must be restated at the end.', 'Neither: with five minutes left, the time belongs to the ten-point check instead.'], answer: 2,
              hint: 'Ask which fault costs a whole band and which costs one word.',
              why: 'A contraction is one word and one register fault. A missing conclusion fails check 2 and leaves the position stated once, which the descriptor reads as a position not held throughout. Fix the expensive fault first, then the two-second one; the check comes after both, because a missing conclusion is the one thing worth breaking the protocol for.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm13s3', name: 'On paper and on computer', cefr: 'B2',
          theory: {
            key: 'On paper, count words by the line; on screen, ignore the counter until minute 35. Neither format checks your spelling. Proofread for your own top three errors, and never write bullet points.',
            body: [
              '<p><strong>On paper</strong> there is no counter, so you make one. Before the exam, write a full line in your normal handwriting on the answer booklet\'s lines and count the words; most students write eight to ten. In the exam, count the lines and multiply: nine words a line and thirty lines is about 270. Leave a blank line between paragraphs so that check 1 is visible at a glance. A mistake gets one neat line through it, which costs nothing; a paragraph rewritten on a fresh page costs the five checking minutes. Planning notes go on the question paper, never in the booklet. Handwriting is part of the format: a word the examiner cannot read is a word that was not written.</p>',
              '<p><strong>On computer</strong> the counter is on the screen, and it is a distraction until minute 35 and a tool after it. Cut and paste lets you move a sentence to the paragraph it belongs in, which is useful at minute 36 when the nuance of Body A turns out to be in Body B. The screen shows paragraphs only if you press Enter twice, so the blank line is your job. Typing is faster than writing, and the real risk on screen is 330 words, not 230: the counter is a ceiling as well as a floor. There is <strong>no spell-check</strong> and no red underline in either format. Spell the kit words before you need them: <em>government, environment, benefit, argument, necessary, which, their</em>.</p>',
              '<p><strong>Proofreading</strong> for "any mistake" finds almost nothing, because the eye reads what it expects. Proofreading for one error family at a time finds most of them. Your Fault List in this app, or your teacher\'s last three comments, gives you the families: for many students at this school they are articles, subject–verb agreement and the plural <em>-s</em>; for others, the comma after an opening phrase, or <em>their / there</em>. Take the three, and make three short passes through the essay, hunting one thing on each pass. It is faster than one slow pass, and it is the only kind of proofreading that works at minute 37.</p>',
              '<p><strong>If time runs out</strong>, the rule is connected text to the last second. Three minutes and no conclusion: two sentences, verdict and reason. One minute: one sentence with the position. Never bullet points, never a list of the points you would have made, and never a note to the examiner: the official format penalises notes and bullet points, and a note explains nothing that the examiner can mark. If you discover at minute 30 that you misread the type, the repair is in the two places the examiner looks for the position: add the verdict sentence to the introduction and write it into the conclusion, and let the body paragraphs stand. An imperfect essay that is complete outscores a perfect one that stops.</p>'
            ],
            simple: [
              '<p>Paper: count the words in one full line of your handwriting, then multiply by the lines. Blank line between paragraphs. One neat line through mistakes. Notes on the question paper only.</p>',
              '<p>Computer: the counter is useful at minute 35, not before. Press Enter twice between paragraphs. Typing is fast, so watch the ceiling of 320. No spell-check in either format.</p>',
              '<p>Proofread for your own top three error families, one pass each. Out of time: one sentence with the position, never bullet points or a note to the examiner.</p>'
            ],
            examples: [
              { s: 'Nine words a line, thirty lines: about 270 words.', g: 'The paper count. Learn your own words-per-line before the exam.' },
              { s: '<s>• cheaper travel • cleaner air • fewer cars on the road</s>', g: 'Bullet points are notes, not an essay, and the whole answer is penalised for them.' },
              { s: 'In conclusion, fares should stay low and the service improve, because commuters leave their cars when the bus is fast and reliable.', g: 'The three-minute conclusion: verdict and reason in one sentence. Complete beats unfinished.' },
              { s: '<s>The goverment should protect the enviroment.</s>', g: 'Two kit words misspelt, and neither format will underline them.' }
            ]
          },
          items: [
            { id: 'm13s3q1', type: 'choose', tag: 'struct-length', level: 'B1',
              stem: 'On paper, how do you know the essay is over 250 words without a counter?',
              hint: 'Think about what you can measure before the exam and reuse on the day in thirty seconds.',
              options: ['Assume that four paragraphs of six sentences each is always enough.', 'Count the words of one full line and multiply by the number of lines.', 'Count every single word one by one at minute 38, starting from the first line of the introduction.', 'Write to the bottom of the second page, which is usually about 250 words.'], answer: 1,
              why: 'Your own words-per-line, measured before the exam, times the lines used: thirty seconds, accurate to about ten words. Counting every word takes the five minutes the check needs, and sentence counts or page counts say nothing reliable about length, because handwriting sizes differ.' },
            { id: 'm13s3q2', type: 'judge', tag: 'kn-test-facts', level: 'B1',
              given: 'On the computer-delivered test, the screen underlines spelling mistakes as a word processor does.',
              stem: 'Is this claim about the test correct?', answer: 1,
              hint: 'Think about which tools the test gives you on screen and which it deliberately leaves out.',
              why: 'False. Neither format checks spelling or grammar; the screen shows a word counter and nothing else. Spelling is part of Lexical Resource, so the kit words are learned before the exam: government, environment, benefit, argument, necessary, which, their.' },
            { id: 'm13s3q3', type: 'choose', tag: 'cc-paragraphing', level: 'B2',
              stem: 'Two minutes left, Body B unfinished, no conclusion. What goes on the page?',
              hint: 'The rule is connected text to the last second; which option obeys it and still helps Task Response?',
              options: ['One sentence that states the position, as a final paragraph.', 'Bullet points listing the ideas the conclusion would have made.', 'Nothing: an unfinished essay is marked on what is there.', 'A note to the examiner explaining that time ran out.'], answer: 0,
              why: 'Connected text to the last second. One sentence with the position restates it at the end and passes check 2. Bullet points are penalised as notes, a note to the examiner is not marked, and stopping leaves the position stated once instead of twice.' },
            { id: 'm13s3q4', type: 'sort', tag: 'kn-test-facts', level: 'B2',
              stem: 'Sort each fact: true of the paper test, true of the computer test, or true of both?',
              hint: 'The format changes the tools you hold, not the rules of the essay.',
              bins: [{ key: 'paper', label: 'Paper', hint: 'booklet and pen' }, { key: 'screen', label: 'Computer', hint: 'screen and keyboard' }, { key: 'both', label: 'Both', hint: 'either format' }],
              items: [
                { text: 'A word counter is on the screen.', bin: 'screen' },
                { text: 'You count words by the line.', bin: 'paper' },
                { text: 'There is no spell-check.', bin: 'both' },
                { text: 'A sentence can be cut and pasted into another paragraph.', bin: 'screen' },
                { text: 'Notes and bullet points in the answer are penalised.', bin: 'both' },
                { text: 'One neat line through a mistake.', bin: 'paper' }
              ],
              why: 'The format changes the tools, not the rules. Counting, moving text and correcting differ; spelling, the ban on notes and bullet points, and the forty minutes do not. Decide your format early and practise the count that goes with it.' },
            { id: 'm13s3q5', type: 'choose', tag: 'struct-time', level: 'C1',
              stem: 'Your Fault List says: articles, plural -s, "their/there". How do you proofread in the last five minutes?',
              options: ['Read the essay once slowly, looking for any mistake of any kind.', 'Rewrite the two longest sentences, since long sentences hold most errors.', 'Read it three times, hunting one error family on each pass.', 'Check spelling first, since the computer will not, then stop.'], answer: 2,
              why: 'The eye reads what it expects, so a general read finds little. One family per pass, three fast passes, finds most of what you actually make. Rewriting creates new sentences that need checking again, and spelling is one family among the three you were given.' },
            { id: 'm13s3q6', type: 'spot', tag: 'lr-register', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Tap the chunk that a proofread for register would change.',
              words: ['Admittedly,', 'a demanding job', 'can leave a student', 'too tired to study;', 'even so,', 'it\'s the weekly limit on hours', 'that removes that risk.'], answer: 5,
              fix: 'it is the weekly limit on hours',
              why: 'A cleft sentence, correctly built, with one contraction inside it. Contractions are the most common register fault in this cohort and the fastest to repair: one pass through the essay for the apostrophe finds every one.' },
            { id: 'm13s3q7', type: 'bodypara', tag: 'struct-time', level: 'C1', prompt: 'p-free-transport',
              stem: 'Eight minutes on the clock. Write Body A: the reason, its mechanism, an example and the nuance, in 80–110 words.',
              keyNouns: ['transport', 'free', 'city', 'tax'], minWords: 60, maxWords: 130,
              _good: 'The first reason is that price alone has little effect on regular car users. Free transport works by attracting people who already walk or cycle, while drivers, who care more about time than money, stay in their cars. We can see this in cities where free buses filled with former pedestrians while car traffic hardly changed. Admittedly, for commuters on low incomes the fare is a real barrier that free travel removes; even so, the congestion the policy claims to solve remains largely untouched.',
              _bad: 'Free transport is a good idea. It helps many people. I think it is good for the city. Many people agree with this idea. It is very important for everyone in the city.',
              why: 'Reason, "works by" mechanism, "we can see this in" example, "admittedly … even so" nuance: the four moves in about ninety words, which is the budget for eight minutes. A paragraph of claims with no mechanism or example is over-generalised, and short of the sixty words that four moves need.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm13ck', name: 'Systems Check', items: [
        { id: 'm13ckq1', type: 'order', tag: 'struct-time', level: 'B1',
          stem: 'Put these moments of the forty minutes in order.',
          hint: 'Follow the clock: ask what must already exist before each later moment can happen.',
          items: ['The type is named and the parts are counted.', 'The eleven variables are on the question paper in note form.', 'The introduction, with the position, is on the page.', 'The conclusion is written and the ten-point check begins.', 'Hands off: the forty minutes are over.'],
          why: 'Minute 1, minute 5, minute 10, minute 35, minute 40. The decode feeds the matrix, the matrix feeds the introduction, and the check needs a finished conclusion to check. The clock is a skill, and this is its shape.' },
        { id: 'm13ckq2', type: 'choose', tag: 'struct-length', level: 'B2',
          stem: 'On the computer, the counter says 335 words at minute 34. What should you do?',
          hint: 'The counter is a ceiling as well as a floor; decide what can go without losing a slot of the matrix.',
          options: ['Nothing: more words always give the examiner more evidence.', 'Cut the weakest sentence in each body paragraph, then check.', 'Delete the conclusion to bring the count under 320.', 'Cut the nuance sentence from each body paragraph, since the position stands without it.'], answer: 1,
          why: 'Over 320 the errors multiply and the checking time disappears, so the extra words cost more than they earn. The weakest sentence in each body is usually a repeated claim; cutting two of them loses no variable. The nuance is a variable, and the conclusion carries the restated position, so neither is ever the cut.' },
        { id: 'm13ckq3', type: 'judge', tag: 'kn-test-facts', level: 'B1',
          given: 'Planning notes on the question paper are not marked, but bullet points inside the answer are penalised.',
          stem: 'Is this claim about the test correct?', answer: 0,
          hint: 'Ask where the notes live and where the essay lives.',
          why: 'True. The matrix on the question paper is free; the same notes inside the answer break the rule that the essay must be "a whole piece of connected text". Plan in notes, write in sentences.' },
        { id: 'm13ckq4', type: 'choose', tag: 'lr-register', level: 'B2', prompt: 'p-cctv-everywhere',
          stem: 'This passage fails which check? "I think cameras are good. I think they stop crime. I think privacy matters less."',
          hint: 'Look at how each of the three sentences begins.',
          options: ['Four or five paragraphs, and the position is stated clearly in paragraph one', 'Every part of the question is answered; both views appear if the prompt names two', 'Each body paragraph admits a limit (nuance) without changing the overall position', 'No memorised clichés, no "research shows", and no "I think" on every sentence'], answer: 3,
          why: '"I believe" belongs in the thesis and the conclusion; body paragraphs argue with impersonal subjects, and "I think" on every line is what check 7 names. Strike two of the three and the sentences become claims, which then need a mechanism, but that is a different check.' },
        { id: 'm13ckq5', type: 'sort', tag: 'cc-paragraphing', level: 'B2',
          stem: 'Sort each item: allowed in the answer, or penalised?',
          hint: 'The answer must be a whole piece of connected text; ask whether each item is text or a note.',
          bins: [{ key: 'ok', label: 'Allowed', hint: 'connected text' }, { key: 'no', label: 'Penalised', hint: 'notes, not an essay' }],
          items: [
            { text: 'A blank line between paragraphs.', bin: 'ok' },
            { text: 'Bullet points for the two reasons.', bin: 'no' },
            { text: 'A neat line through a wrong word.', bin: 'ok' },
            { text: 'The paragraph plan copied into the answer above the introduction.', bin: 'no' },
            { text: 'A numbered list of the solutions.', bin: 'no' },
            { text: 'A one-sentence conclusion when time is short.', bin: 'ok' }
          ],
          why: 'The answer must be a whole piece of connected text: paragraphs, sentences, corrections. Bullets, numbered lists and a copied plan are the format of notes, and the official rules penalise notes inside the answer. A short conclusion is still connected text; a list of points is not.' },
        { id: 'm13ckq6', type: 'spot', tag: 'lr-register', level: 'B2', prompt: 'p-tablets-textbooks',
          stem: 'Tap the chunk that your final proofread must change.',
          words: ['However,', 'this overlooks', 'an important limit:', 'you can\'t expect', 'every family', 'to replace', 'a broken tablet.'], answer: 3,
          fix: 'not every family can be expected',
          why: 'Two register faults in one chunk: "you" addresses the reader, and "can\'t" is a contraction. Check 8 catches both, and the repair is an impersonal subject with the full form. The nuance itself is good; only its register was wrong.' },
        { id: 'm13ckq7', type: 'choose', tag: 'struct-time', level: 'C1', prompt: 'p-online-learning',
          stem: 'At minute 30 you realise this prompt asks "outweigh" and your essay has no verdict. What now?',
          options: ['Add a verdict sentence to the introduction and write it into the conclusion.', 'Start again on a fresh page with the correct type.', 'Leave it as it is: the examiner will infer the verdict from the two balanced body paragraphs.', 'Write a third body paragraph that weighs the two sides.'], answer: 0,
          why: 'The examiner looks for the position in paragraph one and the last paragraph. A verdict sentence in each, fifteen words apiece, turns a list into a weighing; the bodies, advantage and disadvantage, already fit. Starting again cannot finish in ten minutes, a third body has no time, and an examiner never infers a verdict.' },
        { id: 'm13ckq8', type: 'thesis', tag: 'struct-time', level: 'B2', prompt: 'p-early-languages',
          stem: 'Minute 8: write the position sentence for this prompt now, in one sentence, before Body A.',
          must: [['language']], minWords: 12, maxWords: 45,
          _good: 'I believe that schools should start a foreign language in the earliest grades through play, as long as reading in the first language is protected.',
          _bad: 'Some people think languages should start early and some people think later, so it depends on the child.',
          why: 'By minute 10 the examiner can quote what you think: agree, with the condition that protects the first language. That condition is the nuance of Body A already planned. "Some people think … it depends" describes the debate and puts nothing on the page that can be marked as a position.' }
      ] }
    }]
  });
})();
