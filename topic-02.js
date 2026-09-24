/* POSITION CONTROL — topic-02.js · Module 02 Position */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm02', n: 2, code: 'Module 02', name: 'Position', art: 'signal', cefr: 'B1–C1',
    blurb: 'One sentence the examiner can quote back: what you think, stated in paragraph one and held to the end.',
    levels: [{
      id: 'm02l1', n: 1, name: 'Position', cefr: 'B1–C1', blurb: 'What a position is, where it must appear, and how to write the thesis sentence in sixty seconds.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm02s1', name: 'What a position is', cefr: 'B1',
          theory: {
            key: 'A position is one sentence the examiner could quote back: what you think about the question, said so clearly that someone could disagree with it.',
            body: [
              '<p>Task Response at Band 6 says <em>"a position is presented that is directly relevant to the prompt, although the conclusions drawn may be unclear"</em>. Band 7 says <em>"a clear and developed position"</em>. The difference is the first thing the examiner looks for, and it is decided by a single sentence. Cover your essay with your hand except paragraph one: can a reader say, in one sentence, what you think? If yes, you have a position. If they can only say what the topic is, you do not.</p>',
              '<p>A position has three properties. It is a <strong>claim</strong>, not a fact and not a description: <em>"Fast food is unhealthy"</em> is a fact everyone accepts; <em>"a heavy tax on fast food is justified"</em> is a claim someone could reject. It is <strong>about the question asked</strong>: an opinion prompt wants agree or disagree with the statement, a discuss prompt wants your verdict on the issue, an "outweigh" prompt wants the heavier side. And it is <strong>marked</strong>, so the examiner can find it in seconds: <em>I believe that…</em>, <em>This essay argues that…</em>, <em>… should …</em>, <em>… outweigh …</em>, <em>… is more serious than …</em>.</p>',
              '<p>The opposite of a position is the <strong>fence</strong>. <em>"It depends on the situation"</em>, <em>"both sides have a point"</em>, <em>"some people think X while others think Y"</em> and <em>"this essay will discuss both views"</em> are all true of every topic ever set, so they tell the examiner nothing about you. They describe the debate; they do not enter it. Be careful with one distinction: a position <u>with a limit</u> is still a position. <em>"Students should work part-time, but no more than eight hours a week"</em> takes a side and adds a condition. <em>"Part-time work is good for some students and bad for others"</em> takes no side at all.</p>',
              '<p>Keep the sentence short, fifteen to thirty words, and put it at the end of the introduction, where the examiner expects it. Give one position, not two: an essay that argues for a ban in paragraph two and against it in paragraph three has no position, however good each paragraph is. And keep it inside the prompt: a confident claim about a neighbouring question (advertising, when the prompt asked about tax) is a confident way to go off topic.</p>'
            ],
            simple: [
              '<p>A position is one sentence that says what YOU think. Someone must be able to disagree with it. Put it at the end of paragraph one.</p>',
              '<p>Mark it so the examiner can find it: "I believe that…", "This essay argues that…", "should", "outweigh".</p>',
              '<p>"It depends", "both sides have a point" and "some people think… others think…" are not positions. A position with a limit ("yes, but only at weekends") is fine.</p>'
            ],
            examples: [
              { s: 'I believe schools should stop selling sugary drinks, because the eating habits formed at school tend to last for life.', g: 'Marker, claim, reason. Twenty words the examiner can quote and disagree with.' },
              { s: '<s>Some people think schools should stop selling sugary drinks, while others believe students should be free to choose.</s>', g: 'A description of the debate. True of the topic, silent about the writer.' },
              { s: 'Students should gain work experience before leaving school, but only in jobs limited to weekends.', g: 'A position with a limit. Still a side; still quotable.' },
              { s: '<s>Whether students should work part-time depends on the student and the family.</s>', g: 'The fence. No side, nothing to quote.' }
            ]
          },
          items: [
            { id: 'm02s1q1', type: 'choose', tag: 'tr-no-position', level: 'B1', prompt: 'p-teen-jobs',
              stem: 'Which sentence states a position on this prompt?',
              options: ['Students should do paid work before leaving school, because it builds independence.', 'Part-time work is common in some countries and rare in others.', 'This essay will look at both the good and the bad sides of part-time work for students.', 'Some students want a job, while others prefer to spend their free time studying.'], answer: 0,
              hint: 'Ask of each sentence: could a reader disagree with it, or is it simply true of the topic?',
              why: 'A position is a claim the examiner could quote and someone could disagree with. The second sentence repeats the background, the third announces a plan, and the fourth describes what students want. Only the first says what the writer thinks.' },
            { id: 'm02s1q2', type: 'judge', tag: 'tr-no-position', level: 'B1', prompt: 'p-fast-food-tax',
              given: 'Whether fast food should be taxed depends on the situation, because every country is different.',
              stem: 'Is this a clear position?', answer: 1,
              why: 'False. "It depends" gives the reader nothing to quote. A position with a limit is fine ("a tax is justified, but only on the unhealthiest products"); a limit with no claim is a fence.' },
            { id: 'm02s1q3', type: 'sort', tag: 'tr-no-position', level: 'B1',
              stem: 'Sort each sentence: a position, or a description of the debate?',
              bins: [{ key: 'pos', label: 'A position', hint: 'what the writer thinks' }, { key: 'desc', label: 'A description of the debate', hint: 'what people think' }],
              items: [
                { text: 'Governments should not ban cars, but they should charge drivers who enter the centre.', bin: 'pos' },
                { text: 'Some people support a car ban, while others want the freedom to drive.', bin: 'desc' },
                { text: 'I believe schools should stop selling sugary drinks, because habits formed at school last.', bin: 'pos' },
                { text: 'There are strong arguments on both sides of the snack debate.', bin: 'desc' },
                { text: 'The damage tourism does to local culture is more serious than the money it brings.', bin: 'pos' },
                { text: 'Tourism is a subject that many people have opinions about.', bin: 'desc' }
              ],
              why: 'A position can be disagreed with; a description cannot. "Some people… others…" and "there are arguments on both sides" are true of every topic, so they tell the examiner nothing about you.' },
            { id: 'm02s1q4', type: 'choose', tag: 'kn-question-type', level: 'B2',
              stem: 'Which phrase is a position marker, telling the examiner that the writer\'s own view has arrived?',
              options: ['In recent years,', 'It is sometimes claimed that', 'On the other hand,', 'This essay argues that'], answer: 3,
              hint: 'A marker introduces what the writer thinks, not what other people claim and not the time or the contrast.',
              why: '"This essay argues that", "I believe that", "should" and "outweigh" mark a position. "It is sometimes claimed that" introduces someone else\'s view, and the other two phrases only organise time or contrast.' },
            { id: 'm02s1q5', type: 'spot', tag: 'tr-no-position', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Tap the chunk that turns this position into a fence.',
              words: ['I believe that', 'part-time work', 'builds independence,', 'so schools', 'should encourage it,', 'though it is hard to say.'], answer: 5,
              fix: 'though only at weekends.',
              why: 'The sentence had a position until the last chunk took it back. A limit ("only at weekends") keeps the stance; "it is hard to say" cancels it, and the examiner is left with nothing to quote.' },
            { id: 'm02s1q6', type: 'choose', tag: 'tr-off-topic', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Which sentence gives a position on this prompt, not on a nearby topic?',
              options: ['Fast food should not be advertised to young children, because they cannot judge what is healthy.', 'A heavy tax on fast food is justified, because price changes habits faster than advice does.', 'Fast food contains too much sugar and fat, which causes serious health problems.', 'Schools should stop selling sugary snacks so that students eat better.'], answer: 1,
              why: 'The prompt asks about a tax on fast food. Advertising bans and school snack rules are real positions on neighbouring questions, and the third sentence is a fact with no claim. Answer the prompt in front of you.' },
            { id: 'm02s1q7', type: 'judge', tag: 'tr-no-position', level: 'B2', prompt: 'p-teen-jobs',
              given: 'All students should gain work experience before leaving school, but only in jobs limited to weekends.',
              stem: 'Does this sentence still take a clear position?', answer: 0,
              hint: 'Ask whether the sentence takes a side, and whether the second half cancels that side or only limits it.',
              why: 'True. A limit is not a fence. The writer agrees and says under what condition; the examiner can quote it and disagree with it, which is the test of a position. Fence-sitting would be "it is good for some and bad for others".' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm02s2', name: 'Position in the introduction AND the conclusion', cefr: 'B2',
          theory: {
            key: 'The position appears twice: stated at the end of the introduction, restated in fresh words in the conclusion. First seen in the last paragraph, it reads as an afterthought.',
            body: [
              '<p>The most common Band 6 essay in a discuss-both-views task has a recognisable shape: a neutral introduction (<em>"this essay will discuss both views"</em>), a fair paragraph on view A, a fair paragraph on view B, and then, in the last three lines, an opinion the reader has never seen before. Every part of the prompt is touched, but the position is <em>"unclear"</em> for three-quarters of the essay. The examiner has already decided the band before reaching the verdict.</p>',
              '<p>The fix is a shape, not a talent. The introduction has three moves and about fifty words: the background in one sentence, the two views in one sentence, and <strong>your position as the last sentence</strong>. In an opinion essay the same shape holds: background, the statement under debate, your position with its main reason. The body paragraphs can still be fair to both views, because the reader already knows which way you lean and what the paragraphs are for.</p>',
              '<p>The conclusion <strong>restates</strong> the position; it does not merely repeat it and it never replaces it. Restate means the same claim in different words, with the reason attached: <em>"For these reasons, better buses and trains, with the dirtiest cars removed first, remain the most sensible path"</em>. Use the <strong>echo test</strong>: put the last sentence of the introduction beside the first sentence of the conclusion. If they make the same claim, the position is held. If the conclusion is stronger, weaker, or on the other side, the examiner reads it as a change of mind, which is the same as no position.</p>',
              '<p>Three things must not happen in the conclusion. No fence: <em>"both sides have good points"</em> after two body paragraphs undoes the introduction. No reversal: a conclusion that moves the burden from the state to the family is a second position. No new idea: a congestion charge that the body never developed is an undeveloped idea, and it costs Task Response and Coherence together. The conclusion evaluates what the body showed and says, once more, what you think.</p>'
            ],
            simple: [
              '<p>Band 6 pattern: two neutral paragraphs and a surprise opinion at the end. Do not do this. Put the position at the end of paragraph one.</p>',
              '<p>Introduction: background → the two views → your position. About fifty words.</p>',
              '<p>Conclusion: say the same position again in new words, with the reason. No fence, no change of side, no new idea. Test: does the conclusion make the same claim as the introduction?</p>'
            ],
            examples: [
              { s: 'Introduction, last sentence: "This essay looks at both views before arguing that a mix of home and office days serves everyone best."', g: 'The verdict is in paragraph one. The body paragraphs now have a purpose.' },
              { s: 'Conclusion, first sentence: "For these reasons, a hybrid week, with fixed days in the office, is the arrangement that protects both output and wellbeing."', g: 'The echo: same claim, fresh words, reason attached.' },
              { s: '<s>Introduction: "This essay will discuss both views." Conclusion: "In my opinion, working from home is better."</s>', g: 'The Band 6 shape. The position appears for the first time in the last paragraph.' },
              { s: '<s>Introduction: "the state should carry the main cost." Conclusion: "families should carry the main cost."</s>', g: 'A reversal. Two positions is no position.' }
            ]
          },
          items: [
            { id: 'm02s2q1', type: 'judge', tag: 'tr-position-late', level: 'B2', prompt: 'p-prisons',
              given: 'Introduction: "Prisons are a topic many people discuss. Some believe they should punish, while others think they should reform offenders. This essay will discuss both views."',
              stem: 'Does this introduction do everything a discuss-both-views prompt asks for?', answer: 1,
              hint: 'Count the parts a discuss-both-views question asks for, then count what this introduction contains.',
              why: 'False. Both views are named, but the writer\'s verdict is missing. "Discuss both views and give your own opinion" needs that opinion in the introduction; an essay that saves it for the conclusion is the Band 6 pattern.' },
            { id: 'm02s2q2', type: 'order', tag: 'tr-position-late', level: 'B2', prompt: 'p-remote-work',
              stem: 'Put the sentences of this introduction in order.',
              items: ['Working from home was rare before 2020.', 'Since then, many companies have allowed staff to work at home for part of the week.', 'Supporters say this benefits both workers and employers, while critics believe it isolates staff and lowers output.', 'This essay looks at both views before arguing that a mix of home and office days serves everyone best.'],
              why: 'Background first, then the two views, then your position as the last sentence of the introduction. The verdict at the end of paragraph one tells the examiner what the body paragraphs are for.' },
            { id: 'm02s2q3', type: 'choose', tag: 'tr-position-late', level: 'B2',
              stem: 'A discuss-both-views essay gives the writer\'s verdict only in the final paragraph. What does the examiner conclude?',
              options: ['The position is perfectly clear, because the conclusion is the natural place for an opinion', 'The position is unclear until the end, so Task Response stays around Band 6', 'The essay is off topic, because the verdict came too late', 'The essay has no position at all, so Task Response cannot rise above Band 5'], answer: 1,
              hint: 'Think about what the examiner knows of the writer\'s view while reading the two body paragraphs, and which criterion that affects.',
              why: 'Band 6 TR: "a position is presented… although the conclusions drawn may be unclear". Two neutral body paragraphs and a late verdict read as an afterthought. Band 7 needs the position to be clear throughout, so it must appear in the introduction too.' },
            { id: 'm02s2q4', type: 'judge', tag: 'tr-no-position', level: 'B2', prompt: 'p-tourism',
              given: 'Introduction, last sentence: "Although visitors bring money, I believe the damage to local culture and nature is the more serious effect, so visitor numbers should be limited."',
              stem: 'Does this introduction carry a clear position?', answer: 0,
              why: 'True. "I believe" marks it, "more serious" weighs the two views, and "should be limited" says what follows. The concession ("although visitors bring money") shows fairness to view A without weakening the verdict.' },
            { id: 'm02s2q5', type: 'select', tag: 'tr-no-position', level: 'B2', prompt: 'p-cars-city',
              stem: 'The thesis was: councils should invest in public transport while phasing out the dirtiest vehicles. Tick the two conclusion sentences that keep this position.',
              options: ['In short, every private car should be banned from the centre as soon as possible.', 'For these reasons, better buses and trains, with the dirtiest cars removed first, remain the most sensible path.', 'Both a ban and complete freedom have strong points, and the choice is a hard one.', 'Overall, a gradual switch to public transport, starting with the most polluting vehicles, is the right answer.', 'A congestion charge on every car entering the centre would also solve the problem.', 'To conclude, drivers should be free to use their cars wherever they wish.'], answers: [1, 3], k: 2,
              why: 'A conclusion restates the thesis in fresh words: same claim, different sentence. A total ban and total freedom are different positions, "the choice is hard" is a fence, and a congestion charge is a new idea the body never developed.' },
            { id: 'm02s2q6', type: 'order', tag: 'kn-question-type', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Put the sentences of this opinion-essay introduction in order.',
              items: ['Obesity and diabetes among teenagers are rising in many countries, including Thailand.', 'One response is for schools to stop selling sugary drinks and snacks on their premises.', 'I agree with this measure, because the eating habits formed at school tend to last for life.', 'This essay explains that reason and then answers the objection that students should be free to choose.'],
              why: 'Background, the proposal, your position, then the plan. In an opinion essay the position comes early and names its reason; the last sentence tells the reader which two paragraphs follow.' },
            { id: 'm02s2q7', type: 'choose', tag: 'tr-no-position', level: 'C1', prompt: 'p-elderly-care',
              stem: 'The introduction argued that the state should carry the main cost of elderly care. Which conclusion sentence keeps that position?',
              options: ['For these reasons, the main burden belongs with the state, and families should support it.', 'In conclusion, families should carry the main cost of care, with the state helping only the poorest.', 'Ultimately, both the state and families have a part to play in caring for the old.', 'To conclude, the state should also build many more residential homes for the elderly.'], answer: 0,
              why: 'The echo test: pair the thesis with the conclusion sentence and check they make the same claim. Moving the burden to families reverses it, "both have a part" dissolves it, and new care homes is an idea the body never developed.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm02s3', name: 'Thesis Sniper', cefr: 'B2',
          theory: {
            key: 'Marker + claim about the prompt\'s key nouns + reason or limit. One sentence, fifteen to thirty words, written in the first minute of planning.',
            body: [
              '<p>The thesis is the cheapest half-band in the test, and it can be built from three parts in under a minute. The <strong>marker</strong>: <em>I believe that</em>, <em>This essay argues that</em>, or a modal such as <em>should</em>. The <strong>claim</strong>: what you think, using the key nouns of the prompt so the sentence is visibly about this task and no other. The <strong>reason or limit</strong>: <em>because…</em>, or <em>but only…</em>. <em>"I believe private cars should be phased out of city centres only as public transport improves, because a ban with no alternative punishes commuters."</em></p>',
              '<p>The shape changes slightly with the question type. <strong>Opinion</strong>: agree or disagree, then the reason; <em>"partly agree"</em> is allowed only if you say which part. <strong>Discuss both views</strong>: your verdict on the issue, often with a concession that shows fairness: <em>"Although visitors bring money, the damage to culture is the more serious effect, so numbers should be limited."</em> <strong>Outweigh</strong>: name the heavier side with a weighing word, <em>outweigh</em>, <em>more serious than</em>, <em>on balance</em>, and then the reason. A thesis for an outweigh prompt without a weighing word is a list.</p>',
              '<p>Four faults account for almost every failed thesis. <strong>Restating the prompt</strong>: <em>"Some argue governments should ban cars while others want freedom to drive"</em> is the question, not an answer. <strong>Announcing</strong>: <em>"This essay will examine whether…"</em> promises a discussion and takes no side; change <em>will examine</em> to <em>argues that</em> and the same sentence becomes a position. <strong>The fence</strong>: <em>it depends</em>, <em>hard to say</em>, <em>good for some and bad for others</em>. <strong>The neighbour</strong>: a confident claim about which language to teach, when the prompt asked at what age to start.</p>',
              '<p>Length matters both ways. Under twelve words there is usually no reason; over forty-five the thesis has become the essay. Aim for one sentence, two at most, and check it against the prompt one last time: does it name the topic, does it take a side, could someone disagree? Then write it at the end of paragraph one and plan the body paragraphs to prove it.</p>'
            ],
            simple: [
              '<p>Thesis = marker + claim + reason. "I believe that [claim about the prompt] because [reason]." One sentence, 15–30 words.</p>',
              '<p>Opinion: agree or disagree and why. Discuss: your verdict and why. Outweigh: which side is heavier ("outweigh", "more serious than") and why.</p>',
              '<p>Do not: repeat the prompt, announce ("this essay will examine"), sit on the fence ("it depends"), or answer a nearby question.</p>'
            ],
            examples: [
              { s: 'This essay argues that students should not be required to work before finishing school, because study time matters more than early experience.', g: 'Opinion thesis: disagree, and the reason. Twenty-two words.' },
              { s: 'On balance, the disadvantages of online lessons outweigh the advantages for most secondary students, because a teacher in the room notices confusion that a screen cannot.', g: 'Outweigh thesis: the heavier side, the weighing word, the reason.' },
              { s: '<s>This essay will examine the effects of free public transport on congestion in large cities.</s>', g: 'An announcement. Replace "will examine" with "argues that" and choose a side.' },
              { s: '<s>Whether students should work part-time depends on the student, and it is hard to say.</s>', g: 'The fence, twice in one sentence.' }
            ]
          },
          items: [
            { id: 'm02s3q1', type: 'choose', tag: 'tr-no-position', level: 'B2', prompt: 'p-cars-city',
              stem: 'Which sentence is the strongest thesis for this prompt?',
              options: ['Numerous considerations exist both supporting and opposing restrictions on private automobiles in city centres, which this essay examines.', 'City pollution is a serious problem that governments around the world are trying to solve.', 'I believe that whether cars belong in city centres depends on the size and layout of each city.', 'Cars should leave city centres only as public transport improves, because a ban without an alternative punishes commuters.'], answer: 3,
              hint: 'A marker alone is not enough: look for the sentence that takes a side someone could reject and gives a reason.',
              why: 'A thesis names a claim, a limit and a reason in one sentence. The first sentence announces a list, the second states a problem without a position, and the third has a marker but sits on the fence: "it depends" is not a side.' },
            { id: 'm02s3q2', type: 'build', tag: 'tr-no-position', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Build a thesis sentence for this prompt.',
              tiles: ['I believe', 'all students', 'should gain', 'some work experience', 'before leaving school,', 'because', 'paid work builds', 'independence.'],
              solution: 'I believe all students should gain some work experience before leaving school, because paid work builds independence.', alt: [],
              why: 'Marker ("I believe"), claim ("all students should gain some work experience before leaving school"), reason ("because paid work builds independence"). Nineteen words, one sentence, and the examiner can quote it.' },
            { id: 'm02s3q3', type: 'thesis', tag: 'tr-no-position', level: 'B2', prompt: 'p-cars-city',
              stem: 'Write a one-sentence position on this prompt: a marker, the cars and the city, and a reason.',
              must: [['car', 'drive'], ['city', 'pollution']],
              minWords: 12, maxWords: 45,
              _good: 'I believe private cars should be phased out of city centres only as public transport improves, because a ban with no alternative punishes commuters.',
              _bad: 'Some people think cars should be banned in the city and other people think they should not be banned.',
              why: 'One sentence, one marker, the key nouns of the prompt, and a reason. If the sentence could be true of any prompt, it is not a thesis for this one.' },
            { id: 'm02s3q4', type: 'thesis', tag: 'tr-no-position', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Write your thesis: agree or disagree that all students should gain work experience, and say why.',
              must: [['student'], ['work', 'job']],
              minWords: 12, maxWords: 45,
              _good: 'This essay argues that students should not be required to work before finishing school, because study time matters more than early experience.',
              _bad: 'Whether students should work part-time depends on the student and it is hard to say.',
              why: 'Agree or disagree, then the reason. "Partly agree" is allowed only if you say which part: "students should work, but no more than eight hours a week".' },
            { id: 'm02s3q5', type: 'spot', tag: 'tr-no-position', level: 'C1', prompt: 'p-free-transport',
              stem: 'Tap the chunk that makes this sentence an announcement instead of a position.',
              words: ['This essay', 'will examine', 'the claim that', 'free transport', 'reduces congestion', 'in large cities.'], answer: 1,
              fix: 'argues against',
              why: '"Will examine" promises a discussion and takes no side; the examiner still does not know what you think. "Argues against" (or "argues that") turns the same sentence into a position.' },
            { id: 'm02s3q6', type: 'thesis', tag: 'kn-question-type', level: 'C1', prompt: 'p-online-learning',
              stem: 'Write a one-sentence verdict for this "outweigh" prompt: which side is heavier, and why.',
              must: [['online'], ['student', 'classroom', 'teacher'], ['outweigh', 'on balance', 'more serious', 'more important', 'greater', 'heavier']],
              minWords: 12, maxWords: 45,
              _good: 'On balance, the disadvantages of online lessons outweigh the advantages for most secondary students, because a teacher in the room notices confusion that a screen cannot.',
              _bad: 'Online lessons have both advantages and disadvantages for students, and both sides deserve careful attention.',
              why: '"Outweigh" is an opinion question in disguise. The thesis must name the heavier side and the reason; a sentence that says both sides exist is a list, and the examiner cannot quote a position from it.' },
            { id: 'm02s3q7', type: 'judge', tag: 'tr-off-topic', level: 'C1', prompt: 'p-early-languages',
              given: 'Thesis: "I believe English should be the only foreign language taught in Thai schools, because it is the language of global business."',
              stem: 'Does this thesis answer the prompt?', answer: 1,
              hint: 'Find the exact question the prompt asks, then check whether the thesis takes a side on that question.',
              why: 'False. The prompt asks whether all children should study a foreign language from the earliest grades. Which language to teach is a neighbouring question; the thesis never says when children should start, so it answers a prompt the writer prepared for.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm02ck', name: 'Systems Check', items: [
        { id: 'm02ckq1', type: 'choose', tag: 'tr-no-position', level: 'B1', prompt: 'p-screen-time',
          stem: 'Which sentence could the examiner quote as this writer\'s position?',
          options: ['Some parents strictly limit screen time, while others believe digital devices are essential for modern learning.', 'Screen time is a topic that causes many arguments in modern families.', 'Parents should guide what children watch rather than count the hours, since content matters more.', 'This essay will consider both views on children\'s screen time.'], answer: 2,
          why: 'Only the third sentence makes a claim someone could reject. The first repeats the prompt, the second names the topic, and the fourth announces a plan. None of those tells the examiner what the writer thinks.' },
        { id: 'm02ckq2', type: 'judge', tag: 'tr-position-late', level: 'B2', prompt: 'p-minimum-wage',
          given: 'Body A explains how higher pay cuts poverty; Body B explains how it raises prices; the last paragraph says, for the first time, that the benefits are greater.',
          stem: 'Is the position clear throughout this essay?', answer: 1,
          hint: 'Ask what the examiner can say about the writer\'s view after paragraph one, and again after Body B.',
          why: 'False. The verdict exists, but it arrives in the last paragraph. For three-quarters of the essay the examiner cannot say what the writer thinks, and that is the Band 6 pattern: "the conclusions drawn may be unclear".' },
        { id: 'm02ckq3', type: 'sort', tag: 'tr-no-position', level: 'B2',
          stem: 'Sort each sentence: a position, a fence, or an announcement.',
          bins: [{ key: 'pos', label: 'Position', hint: 'takes a side' }, { key: 'fence', label: 'Fence', hint: 'refuses to choose' }, { key: 'ann', label: 'Announcement', hint: 'promises a discussion' }],
          items: [
            { text: 'I believe animal testing is justified only where no alternative exists.', bin: 'pos' },
            { text: 'Whether animal testing is right depends on the situation.', bin: 'fence' },
            { text: 'This essay will discuss both sides of the animal testing debate.', bin: 'ann' },
            { text: 'The damage tourism does to culture is more serious than the money it brings.', bin: 'pos' },
            { text: 'Tourism has good points and bad points, so it is hard to judge.', bin: 'fence' },
            { text: 'The following paragraphs examine the effects of tourism on the economy and the environment.', bin: 'ann' }
          ],
          why: 'A position takes a side (even with a limit: "only where no alternative exists"). A fence refuses to choose. An announcement describes what the essay will do and says nothing about what the writer thinks.' },
        { id: 'm02ckq4', type: 'order', tag: 'tr-position-late', level: 'B2', prompt: 'p-science-funding',
          stem: 'Put the sentences of this introduction in order.',
          items: ['Universities teach both science and the arts, and public money pays for much of both.', 'Some argue that only science degrees deserve funding, while others want the arts supported too.', 'In my view, science should receive the larger share, but the arts must keep targeted support.', 'This essay explains why a country needs both the ability to invent and the judgement to use inventions well.'],
          why: 'Background, the two views, the position, then the plan. The verdict sits in paragraph one, so the body paragraphs on science and on the arts are read as evidence for it, not as a neutral survey.' },
        { id: 'm02ckq5', type: 'choose', tag: 'tr-off-topic', level: 'B2', prompt: 'p-libraries',
          stem: 'Which thesis answers this prompt rather than a neighbouring one?',
          options: ['Printed books remain better than screens for deep reading, so schools should keep using them.', 'Every citizen should have free internet at home, because information is now online.', 'Libraries remain necessary, because they give a free shared space that the internet cannot.', 'Bookshops are closing because people buy online, which is a loss for every town.'], answer: 2,
          why: 'The prompt asks whether public libraries are still needed. Print versus screen, free home internet and bookshops are neighbouring questions; a confident thesis on any of them is a confident way to go off topic.' },
        { id: 'm02ckq6', type: 'thesis', tag: 'tr-no-position', level: 'B2', prompt: 'p-school-snacks',
          stem: 'Write a one-sentence thesis: agree or disagree that schools should stop selling sugary snacks, and why.',
          must: [['school'], ['sugar', 'snack', 'drink']],
          minWords: 12, maxWords: 45,
          _good: 'I agree that schools should stop selling sugary drinks and snacks, because the habits students form at school tend to last for life.',
          _bad: 'Some people believe schools should stop selling sugary snacks and some people believe students should choose.',
          why: 'Marker, claim, reason. Agree or disagree with the statement in the prompt, name the schools and the snacks, and give the one reason the body paragraphs will develop.' },
        { id: 'm02ckq7', type: 'select', tag: 'tr-partial', level: 'C1',
          stem: 'Tick the two things a discuss-both-views introduction must contain.',
          options: ['Both views, named fairly', 'A full example for each view', 'The writer\'s own verdict', 'The mechanism behind view A', 'Every argument on both sides, listed', 'A new idea saved for the conclusion'], answers: [0, 2], k: 2,
          why: '"Discuss both views and give your own opinion" is three parts, and the introduction names all three in fifty words: view A, view B, your verdict. Mechanisms and examples belong to the body paragraphs; lists and saved ideas belong nowhere.' },
        { id: 'm02ckq8', type: 'choose', tag: 'tr-position-late', level: 'C1', prompt: 'p-history-teaching',
          stem: 'The introduction argued for world history, with the national past as its starting point. Which conclusion sentence keeps that position?',
          options: ['To conclude, children should study only their own country\'s past, since pride comes first.', 'In the end, both national and world history matter, and schools must decide for themselves.', 'Overall, history teaching should also include more lessons on local buildings and records.', 'For these reasons, world history should lead, with the national story as its first chapter.'], answer: 3,
          why: 'Same claim, fresh words: world history leads, the national past comes first. The first option reverses the position, the second dissolves it into a fence, and the third adds an idea the body never developed.' }
      ] }
    }]
  });
})();
