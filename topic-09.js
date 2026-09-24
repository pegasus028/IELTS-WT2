/* POSITION CONTROL — topic-09.js · Module 09 Structural Swaps */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm09', n: 9, code: 'Module 09', name: 'Structural Swaps', art: 'grid', cefr: 'B1–C1',
    blurb: 'Four structures, one per body paragraph, each at ninety per cent accuracy: inversion, cleft, participle, concession.',
    levels: [{
      id: 'm09l1', n: 1, name: 'Structural Swaps', cefr: 'B1–C1', blurb: 'The four swaps that give a body paragraph its range, the errors that break each one, and the rule that accuracy comes first.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm09s1', name: 'Inversion and cleft', cefr: 'B1',
          theory: {
            key: '"Seldom does this approach account for the cost." "It is in the shops outside the gate that the trend is most visible." Two swaps that break the plain rhythm: one for the nuance sentence, one for the example.',
            body: [
              '<p>Band 7 Grammatical Range asks for "a variety of complex structures"; Band 8 asks for "a wide range flexibly and accurately used". A body paragraph of four plain declarative sentences meets neither. A <strong>structural swap</strong> is a rewrite of one sentence in the paragraph into a different shape, chosen because it fits that sentence\'s job. The template offers four; this sub-level teaches the two that change word order. <strong>Inversion</strong> belongs to the nuance sentence, because it opens with a negative word and so announces a limit. <strong>Cleft</strong> belongs to the example sentence, because it isolates the example and puts a spotlight on it.</p>',
              '<p><strong>Inversion</strong> starts with a negative or restrictive adverb, then the auxiliary verb, then the subject, then the main verb: <em>Seldom <u>does</u> this approach account for the cost.</em> The order is the order of a question: <em>Does this approach account …?</em> with <em>Seldom</em> in front. The openers are <em>seldom, rarely, never, not only, only when, under no circumstances</em>. The auxiliary carries the tense and the agreement, so the main verb goes back to its base form: <em>does account</em>, not <em>does accounts</em>; <em>did succeed</em>, not <em>did succeeded</em>. <em>Not only</em> needs its partner: <em>Not only does this reduce costs, but it also raises morale.</em> Three ways to break it: forget the auxiliary (<em><s>Seldom this approach accounts</s></em>), put the subject before the auxiliary (<em><s>Seldom this approach does account</s></em>), or double the tense (<em><s>Seldom does it accounts</s></em>).</p>',
              '<p>A <strong>cleft</strong> sentence splits one plain sentence in two so that one part is emphasised. <em>It is … that …</em> puts the spotlight on whatever follows <em>it is</em>: <em>It is in the shops outside the school gate that this trend is most visible.</em> Start from the plain sentence, lift out the phrase you want to stress, put it after <em>it is</em>, and write the rest after <em>that</em>. The <em>what</em>-cleft does the same job with a noun clause as subject: <em>What drives obesity is not a lack of knowledge but a lack of access.</em> Because <em>what drives obesity</em> is one thing, the verb is singular, <em>is</em>, even when the noun after it is plural.</p>',
              '<p>Two rules keep both swaps safe. First, the rest of the sentence must still be complete: <em><s>It is the poorest households that such levies fall most heavily</s></em> has lost its preposition; put <em>on the poorest households</em> after <em>it is</em> and the sentence closes. Second, use each swap once. One inversion on the nuance sentence and one cleft on the example are range; three inversions in a paragraph are a tic the examiner will notice, and every extra one is another place for the auxiliary to go wrong. Range is a variety of shapes, not a repetition of the same unusual one.</p>'
            ],
            simple: [
              '<p>Inversion: negative word first, then the auxiliary, then the subject. "Seldom DOES this approach account for the cost." Like a question with "Seldom" in front. Main verb stays in the base form.</p>',
              '<p>Cleft: "It is [the part you stress] that [the rest]." "It is in the shops outside the gate that the trend is most visible." What-cleft: "What drives obesity IS a lack of access."</p>',
              '<p>Use inversion on the nuance sentence and a cleft on the example, once each. Check the rest of the sentence is still complete.</p>'
            ],
            examples: [
              { s: 'Seldom does a ban on cars account for commuters who have no alternative.', g: 'Seldom + does + subject + base verb. The nuance sentence in inverted form.' },
              { s: '<s>Not only this approach reduces costs, but it also raises staff morale.</s>', g: 'The auxiliary is missing. "Not only does this approach reduce costs …".' },
              { s: 'It is in the shops just outside the school gate that this trend is most visible.', g: 'The example phrase sits after "it is"; the rest of the sentence follows "that" and is still complete.' },
              { s: 'What drives obesity is not a lack of knowledge but a lack of access to affordable food.', g: 'A what-clause is a singular subject, so "is". "Not … but" balances the two halves.' }
            ]
          },
          items: [
            { id: 'm09s1q1', type: 'choose', tag: 'gra-inversion', level: 'B1', prompt: 'p-climate-action',
              stem: 'Which sentence is a correct inversion of "This policy rarely succeeds without public support"?',
              hint: 'Check two things: is there an auxiliary before the subject, and has the main verb gone back to its base form?',
              options: ['Rarely this policy succeeds without public support.', 'Rarely does this policy succeed without public support.', 'Rarely does this policy succeeds without public support.', 'Rarely this policy does succeed without public support.'], answer: 1,
              why: 'Negative adverb, auxiliary, subject, base verb: "Rarely does this policy succeed". The first version has no auxiliary, the third doubles the tense on "succeeds", and the fourth puts the subject before "does". Think of the question "Does this policy succeed?" with "Rarely" in front.' },
            { id: 'm09s1q2', type: 'build', tag: 'gra-inversion', level: 'B1', prompt: 'p-cars-city',
              stem: 'Build the inverted nuance sentence: negative adverb, auxiliary, subject, then the rest.',
              hint: 'The order is that of a question with the negative word in front; everything after the verb stays in plain order.',
              tiles: ['Seldom', 'does', 'such a ban', 'account for', 'commuters', 'who have', 'no alternative.'],
              solution: 'Seldom does such a ban account for commuters who have no alternative.', alt: [],
              why: '"Seldom" first, then the auxiliary "does", then the subject "such a ban", then the main verb in its base form. The order is that of a question with the negative word in front; everything after the verb stays where it would be in a plain sentence.' },
            { id: 'm09s1q3', type: 'spot', tag: 'gra-inversion', level: 'B2', prompt: 'p-remote-work',
              stem: 'Tap the chunk where the inversion breaks.',
              hint: 'A negative opener needs an auxiliary before the subject; find the chunk where it should have been.',
              words: ['Not only', 'this approach reduces', 'office costs,', 'but it also', 'raises', 'staff morale.'], answer: 1,
              fix: 'does this approach reduce',
              why: '"Not only" is a negative opener, so the auxiliary must come before the subject: "Not only does this approach reduce". Without "does" the sentence is a plain statement with a stray adverb in front, and the examiner marks it as a faulty complex structure.' },
            { id: 'm09s1q4', type: 'choose', tag: 'gra-cleft', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Plain: "This trend is most visible in the shops outside the school gate." Which cleft puts the spotlight on the example, the shops?',
              hint: 'Whatever sits between "it is" and "that" gets the spotlight; then check the rest of the sentence is still complete.',
              options: ['It is in the shops outside the school gate that this trend is most visible.', 'It is this trend that is most visible in the shops just outside the school gate.', 'This trend it is most visible in the shops outside the school gate.', 'It is the shops outside the school gate that this trend is most visible.'], answer: 0,
              why: 'The phrase after "it is" is the one under the spotlight, so the example, "in the shops outside the school gate", goes there and the rest follows "that". The second cleft is correct but stresses the trend, the third has no cleft at all, and the fourth has lost the preposition "in", so its second half is incomplete.' },
            { id: 'm09s1q5', type: 'rewrite', tag: 'gra-inversion', level: 'B2',
              stem: 'Rewrite as an inversion: start with a negative adverb and the auxiliary. No "however".',
              hint: 'Move the negative meaning of "fails" into an adverb, then let an auxiliary carry the tense before the subject.',
              given: 'However, this approach fails to account for the cost.',
              must: [['seldom does', 'rarely does', 'not only does', 'never does']], ban: ['however'],
              minWords: 6, maxWords: 20, praise: 'Negative adverb, auxiliary, subject, base verb. A clean inversion on the nuance sentence.',
              _good: 'Seldom does this approach account for the cost.',
              _bad: 'Seldom this approach accounts for the cost.',
              why: '"Fails to account for" becomes "seldom does … account for": the negative meaning moves into the adverb, the auxiliary "does" carries the tense, and the main verb returns to its base form. The linker "however" is no longer needed because the inversion itself signals the limit.' },
            { id: 'm09s1q6', type: 'judge', tag: 'gra-cleft', level: 'B2', prompt: 'p-fast-food-tax',
              given: 'What makes a sugar tax effective is not the revenue it raises but the price signal it sends.',
              stem: 'Is this what-cleft grammatically correct?', answer: 0,
              hint: 'Find the subject of the main verb, decide whether it counts as one thing or two, and check the verb against it.',
              why: 'True. "What makes a sugar tax effective" is a noun clause acting as one singular subject, so "is" is right even though two things follow. "Not … but" balances the two halves. The what-cleft is a strong shape for a thesis or a mechanism.' },
            { id: 'm09s1q7', type: 'choose', tag: 'gra-complex', level: 'C1', prompt: 'p-fast-food-tax',
              stem: 'Which sentence is error-free?',
              options: ['Seldom such levies do fall equally on rich and poor households.', 'It is the poorest households that such levies fall most heavily.', 'Seldom do such levies fall equally on rich and poor households.', 'Rarely does such levies fall equally on rich and poor households.'], answer: 2,
              why: '"Seldom do such levies fall": auxiliary before subject, plural "do" for "levies", base verb. The first puts the subject before "do", the second cleft has lost the preposition "on", and the fourth uses singular "does" with a plural subject. A swap earns nothing unless every part of it is right.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm09s2', name: 'Participle and concession', cefr: 'B2',
          theory: {
            key: 'A participle phrase adds the result to the mechanism: "…, subsequently triggering …". Concession writes the nuance: "While regulation is costly, the alternative is more costly still." Both are broken by the same thing: a subject that is missing.',
            body: [
              '<p>The <strong>participle phrase</strong> is the swap for the mechanism sentence. Instead of a second clause with <em>which</em> or <em>and this</em>, attach an <em>-ing</em> phrase: <em>A camera raises the chance that an offender is identified, <u>subsequently making</u> theft less worth attempting.</em> The phrase has no subject of its own; it borrows the subject of the main clause. That is why it is shorter and why the chain reads as one movement. A past participle does the same job for a cause: <em>Faced with rising rents, small shops leave the centre.</em> The shops are faced with the rents, and the shops leave.</p>',
              '<p>The borrowed subject is also where the phrase breaks. In <em><s>Having removed the vending machines, sugary drinks are now a weekend treat</s></em>, the grammar says that the sugary drinks removed the machines. The participle is <strong>dangling</strong>: its real subject, the school, is not in the sentence. The test is mechanical. Find the subject of the main clause, put it in front of the participle, and ask whether it makes sense: <em>the school, having removed the machines</em> works; <em>the sugary drinks, having removed the machines</em> does not. When the test fails, either change the main subject (<em>the school now sells sugary drinks only …</em>) or give the phrase its own subject with a conjunction (<em>Since the school removed the machines, …</em>).</p>',
              '<p><strong>Concession</strong> is the grammar of the nuance sentence: the limit goes in a subordinate clause, the position stays in the main clause. <em>While regulation is costly, the alternative is more costly still.</em> <em>Although the same snacks are sold outside the gate, the school day no longer teaches the habit.</em> The openers are <em>although, while, even though, though</em>; <em>despite</em> and <em>in spite of</em> take a noun or an <em>-ing</em> form, never a clause: <em>despite the cost</em>, <em>despite costing more</em>, not <em><s>despite it costs more</s></em>. A two-sentence version uses <em>Admittedly, …; even so / nevertheless, …</em>.</p>',
              '<p>Concession breaks in two ways, and both are about the main clause. The <strong>fragment</strong>: <em><s>Although it is cheap.</s></em> is a subordinate clause with a full stop where its main clause should be; the examiner reads it as an incomplete sentence, one of the most visible errors a script can carry. Join it: <em>Although it is cheap, drivers who value time stay in their cars.</em> The <strong>double marker</strong>: <em><s>Although cameras deter theft, but they cannot stop a determined offender.</s></em> uses <em>although</em> and <em>but</em> for the same job; one of them must go. Use each swap once per paragraph, and read the whole sentence aloud before you move on: a participle without a subject and a concession without a main clause both sound wrong when spoken.</p>'
            ],
            simple: [
              '<p>Participle phrase: "A camera raises the chance a thief is caught, making theft less worth trying." The -ing phrase borrows the subject of the main clause. If that subject cannot do the action, the participle is dangling: "Having removed the machines, sugary drinks are…" (drinks did not remove anything).</p>',
              '<p>Concession: "Although [limit], [position]." "While regulation is costly, the alternative is more costly still." Despite + noun, never despite + clause.</p>',
              '<p>Two errors: a fragment ("Although it is cheap." with no main clause) and a double marker ("Although …, but …"). One swap per paragraph; read it aloud.</p>'
            ],
            examples: [
              { s: 'A camera raises the chance that an offender is identified, subsequently making theft less worth attempting.', g: 'The participle phrase borrows the subject "a camera". Mechanism and result in one sentence, no "which".' },
              { s: '<s>Having removed the vending machines, sugary drinks are now a weekend treat.</s>', g: 'Dangling: the drinks did not remove the machines. "Since the school removed the vending machines, …".' },
              { s: 'While regulation is costly, the alternative is more costly still.', g: 'The limit in the subordinate clause, the position in the main clause.' },
              { s: '<s>Free transport attracts people who already walk. Although it is cheap.</s>', g: 'A fragment: "Although it is cheap" has no main clause. Attach it with a comma to the sentence that follows.' }
            ]
          },
          items: [
            { id: 'm09s2q1', type: 'spot', tag: 'gra-participle', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Tap the chunk that dangles: its real subject is not in the sentence.',
              words: ['Having removed', 'the vending machines,', 'sugary drinks', 'are now', 'a weekend treat', 'for most students.'], answer: 0,
              fix: 'Since the school removed',
              why: 'A participle borrows the subject of the main clause, and here that subject is "sugary drinks", which removed nothing. Put the real subject in with a conjunction, "since the school removed", or change the main clause to "the school now sells …".' },
            { id: 'm09s2q2', type: 'build', tag: 'gra-participle', level: 'B2', prompt: 'p-cctv-everywhere',
              stem: 'Build the mechanism with a participle phrase for its result instead of "which makes".',
              tiles: ['A camera', 'raises', 'the chance', 'that an offender is identified,', 'subsequently making', 'theft', 'less worth attempting.'],
              solution: 'A camera raises the chance that an offender is identified, subsequently making theft less worth attempting.', alt: [],
              why: 'The main clause is complete at the comma; "subsequently making" then borrows its subject, the camera, and adds the result. This is the mechanism swap: one sentence carries the chain without "which" or "and this".' },
            { id: 'm09s2q3', type: 'choose', tag: 'gra-concession', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Which sentence concedes the limit correctly and keeps the position in the main clause?',
              options: ['Although the same snacks are sold outside the gate, but the school day no longer teaches the habit.', 'Despite the same snacks are sold outside the gate, the school day no longer teaches the habit.', 'The same snacks are sold outside the gate, although the school day no longer teaches the habit.', 'Although the same snacks are sold outside the gate, the school day no longer teaches the habit.'], answer: 3,
              why: 'Limit in the "although" clause, position in the main clause, joined by a comma. The first doubles the marker with "but", the second puts a full clause after "despite", which only takes a noun or -ing form, and the third is grammatical but concedes the wrong half: it treats the position as the limit.' },
            { id: 'm09s2q4', type: 'spot', tag: 'gra-concession', level: 'B2', prompt: 'p-free-transport',
              stem: 'Tap the chunk that is a fragment: a subordinate clause with no main clause.',
              words: ['Free transport attracts', 'people who already walk.', 'Although it is cheap.', 'Drivers who value time', 'stay in their cars.'], answer: 2,
              fix: 'Although it is cheap,',
              why: '"Although it is cheap" is a subordinate clause; the full stop cuts it off from the main clause it needs. Replace the stop with a comma and the next sentence becomes its main clause: "Although it is cheap, drivers who value time stay in their cars."' },
            { id: 'm09s2q5', type: 'judge', tag: 'gra-participle', level: 'B2', prompt: 'p-school-snacks',
              given: 'Operating primarily by removing sweet options from the canteen, the ban changes the routine that students follow every day.',
              stem: 'Is the participle phrase attached to the right subject?', answer: 0,
              why: 'True. Put the main subject in front of the participle and test it: "the ban, operating by removing sweet options" makes sense, because it is the ban that operates. The phrase is not dangling. This is the template\'s "Operating primarily by …" swap used correctly.' },
            { id: 'm09s2q6', type: 'choose', tag: 'gra-participle', level: 'C1', prompt: 'p-remote-work',
              stem: 'Which sentence has no dangling participle?',
              options: ['Working from home, the commute disappears and staff gain two hours a day.', 'Working from home, staff gain the two hours a day that commuting once took.', 'Working from home, two hours a day are gained by staff who no longer commute.', 'Working from home, it is possible for staff to gain two hours a day.'], answer: 1,
              why: 'Only "staff" can work from home, so only the second sentence gives the participle a subject that makes sense. "The commute", "two hours" and "it" cannot work from home; each of those participles is dangling, and a dangler is a grammar error however elegant the sentence looks.' },
            { id: 'm09s2q7', type: 'build', tag: 'gra-concession', level: 'C1', prompt: 'p-cars-city',
              stem: 'Build the two-part concession: admit the limit, then keep the position after the semicolon.',
              tiles: ['Admittedly,', 'some traffic', 'simply moves', 'to the roads', 'outside the zone;', 'even so,', 'the air inside it', 'is cleaner.'],
              solution: 'Admittedly, some traffic simply moves to the roads outside the zone; even so, the air inside it is cleaner.', alt: [],
              why: '"Admittedly" opens the concession, the semicolon closes it, and "even so" turns back to the position. Two complete clauses, each with its own subject and verb, so there is no fragment and no double marker.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm09s3', name: 'Accuracy first', cefr: 'B2',
          theory: {
            key: 'Three or four structures at ninety per cent accuracy beat six at sixty. One swap per body paragraph. A correct simple sentence outscores a faulty complex one, every time.',
            body: [
              '<p>The Band 6 descriptor for grammar contains the sentence that costs this cohort most: <em>"complex structures are not marked by the same level of accuracy as simple structures"</em>. It describes a writer who has learned six shapes and controls two. Band 7 needs <em>"error-free sentences frequent"</em>; Band 8 needs <em>"the majority of sentences error-free"</em>. The examiner is counting sentences that contain no error at all, and every failed swap is a sentence removed from that count. So the strategy is <strong>accuracy first</strong>: choose three or four structures, drill each until you can produce it correctly nine times out of ten, and only then add a fifth.</p>',
              '<p>The working rule is <strong>one swap per body paragraph</strong>. Four sentences, one of them swapped: the inversion on the nuance, or the cleft on the example, or the participle on the mechanism, or the concession on the nuance. The other three sentences stay plain and dense, carried by nominalised subjects and live verbs. Across two body paragraphs that gives two different swaps, plus the nominalisation everywhere, which is already "a variety of complex structures". A paragraph with an inversion, a cleft, a participle and a concession, two of them faulty, scores below a paragraph with one correct concession, because the examiner counts the errors, not the attempts.</p>',
              '<p>The <strong>audit</strong> is the habit that makes this work. After writing, underline every sentence that contains a swap, and check the one thing that breaks it: for inversion, is the auxiliary before the subject and the main verb in its base form? For a cleft, is the rest of the sentence still complete? For a participle, can the main subject do the action in the phrase? For concession, is there a main clause, and only one marker? If a sentence fails the check and you cannot see the fix, rewrite it as a plain sentence. <em>Such measures seldom reach the poorest households</em> is worth more than <em><s>Seldom such measures do reach the poorest households</s></em>.</p>',
              '<p>The fourth structure to control is the <strong>conditional</strong>, because solutions and predictions need it. The second conditional reasons about a hypothetical present: <em>If governments <u>taxed</u> sugar, consumption <u>would fall</u>.</em> The third reasons about a past that did not happen: <em>If cities <u>had invested</u> earlier, the floods of 2011 <u>would have been</u> less severe.</em> The mixed form joins a past condition to a present result: <em>Had cities invested earlier, congestion <u>would be</u> lower today.</em> The errors are always in the verb pair: <em><s>if governments would tax</s></em>, <em><s>would have be</s></em>, <em><s>had invested … will be</s></em>. Match the condition to the result before you write either half.</p>'
            ],
            simple: [
              '<p>Band 6: complex sentences with errors. Band 8: most sentences error-free. So learn three or four shapes to 90% accuracy before adding more. One swap per body paragraph; the other sentences stay plain and dense.</p>',
              '<p>After writing, check each swap: inversion has the auxiliary before the subject; a cleft is still complete; a participle has a subject that can do the action; a concession has a main clause. If you cannot fix it, write it plainly.</p>',
              '<p>Conditionals for solutions: "If governments taxed sugar, consumption would fall." Past: "If cities had invested, the floods would have been less severe." Mixed: "Had cities invested earlier, congestion would be lower today."</p>'
            ],
            examples: [
              { s: 'Such measures seldom reach the poorest households.', g: 'Plain and error-free. Worth more than any broken inversion of the same idea.' },
              { s: 'If governments taxed sugar, consumption would fall.', g: 'Second conditional: past simple in the condition, would + base verb in the result.' },
              { s: 'Had the city invested in drains a decade ago, the district would not flood every monsoon now.', g: 'Mixed conditional: a past condition (inverted "had") with a present result.' },
              { s: '<s>If cities had invested in drains earlier, the floods would have be less severe.</s>', g: 'Third conditional broken in the result: "would have been".' }
            ]
          },
          items: [
            { id: 'm09s3q1', type: 'judge', tag: 'gra-complex', level: 'B2', prompt: 'p-teen-sleep',
              given: 'Not only does a later start improve attendance, but it also raises alertness in the first lesson.',
              stem: 'Is this sentence error-free?', answer: 0,
              why: 'True. "Not only" + auxiliary "does" + subject + base verb "improve", then the partner "but it also". Run the audit on every swap you write: this one passes, so it counts towards the error-free sentences Band 8 requires.' },
            { id: 'm09s3q2', type: 'choose', tag: 'gra-conditional', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Complete the second conditional: "If governments ___ fast food more heavily, sales would fall."',
              hint: 'Look at the verb in the result half and ask which tense in the if-clause pairs with it.',
              options: ['tax', 'would tax', 'will tax', 'taxed'], answer: 3,
              why: 'A hypothetical present takes the past simple in the condition and "would" in the result: "if governments taxed …, sales would fall". "Would" never goes in the if-clause, and "will" belongs to the first conditional, which pairs with "will fall", not "would fall".' },
            { id: 'm09s3q3', type: 'choose', tag: 'gra-complex', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Which version would the examiner count as an error-free sentence?',
              hint: 'Read each one as a proofreader: only one of the four has nothing at all to correct.',
              options: ['Seldom such measures do reach the poorest households.', 'It is the poorest households which such measures seldom reach them.', 'Such measures seldom reach the poorest households.', 'Although such measures seldom reach the poorest households.'], answer: 2,
              why: 'The plain sentence is the only one with no error. The inversion has the subject before "do", the cleft repeats the object with "them", and the "although" version is a fragment with no main clause. A correct simple sentence outscores a faulty complex one.' },
            { id: 'm09s3q4', type: 'spot', tag: 'gra-conditional', level: 'C1', prompt: 'p-city-flooding',
              stem: 'Tap the chunk where the third conditional breaks.',
              words: ['If cities', 'had invested', 'in drains earlier,', 'the floods of 2011', 'would have be', 'less severe.'], answer: 4,
              fix: 'would have been',
              why: 'The result half of a third conditional is "would have" + past participle: "would have been". The condition half, "had invested", is correct. Check the verb pair together: had + past participle in the if-clause, would have + past participle in the result.' },
            { id: 'm09s3q5', type: 'select', tag: 'gra-complex', level: 'C1',
              stem: 'Run the audit. Tick the two sentences that are error-free.',
              options: ['Rarely can such a policy succeed without public support.', 'Rarely such a policy can succeed without public support.', 'Had the city invested earlier, congestion will be lower today.', 'Had the city invested earlier, congestion would be lower today.', 'Although the tax is unpopular. It works.', 'Being unpopular, the tax it still works.'], answers: [0, 3], k: 2,
              why: '"Rarely can such a policy succeed" has the auxiliary before the subject; "Had the city invested …, congestion would be lower" pairs a past condition with "would". The others have a subject before the auxiliary, "will" after a past condition, a fragment, and a doubled subject "the tax it".' },
            { id: 'm09s3q6', type: 'choose', tag: 'gra-conditional', level: 'C1', prompt: 'p-online-scams',
              stem: 'A solution as a hypothesis: "If schools ___ fraud recognition, fewer students ___ money to scams." Choose the pair.',
              hint: 'Both halves must belong to the same conditional; decide first which conditional a hypothesis needs.',
              options: ['taught / would lose', 'would teach / lose', 'taught / will lose', 'teach / would lose'], answer: 0,
              why: 'The two halves must match: past simple in the condition, "would" in the result. "Would teach" puts "would" in the if-clause, and the other two pairs mix a first-conditional half with a second-conditional half. Match the pair before you write either verb.' },
            { id: 'm09s3q7', type: 'judge', tag: 'gra-complex', level: 'C1',
              given: 'A body paragraph contains an inversion, a cleft, a participle phrase and a concession, and two of the four have errors.',
              stem: 'Will this paragraph score higher for grammar than one with a single correct concession and three plain sentences?', answer: 1,
              hint: 'Recall the Band 6 descriptor line quoted in the theory and ask what the examiner is actually counting.',
              why: 'False. The examiner counts error-free sentences, not attempted structures. Two faulty swaps are two sentences removed from the count, which is exactly the Band 6 description: "complex structures are not marked by the same level of accuracy". One correct swap plus three correct plain sentences is the safer route to Band 7 and 8.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm09ck', name: 'Systems Check', items: [
        { id: 'm09ckq1', type: 'choose', tag: 'gra-inversion', level: 'B1', prompt: 'p-space',
          stem: 'Which sentence is a correct inversion of "This view never accounts for the cost"?',
          hint: 'Say the yes/no question for this sentence, then put the negative word in front of it.',
          options: ['Never this view accounts for the cost.', 'Never does this view account for the cost.', 'Never does this view accounts for the cost.', 'Never accounts this view for the cost.'], answer: 1,
          why: 'Negative adverb, auxiliary, subject, base verb: "Never does this view account". The first has no auxiliary, the third keeps the tense on the main verb as well, and the fourth inverts the main verb instead of adding "does".' },
        { id: 'm09ckq2', type: 'spot', tag: 'gra-participle', level: 'B2', prompt: 'p-tablets-textbooks',
          stem: 'Tap the participle that dangles.',
          words: ['Having replaced', 'textbooks with tablets,', 'lessons now stop', 'whenever', 'the power fails', 'in rural schools.'], answer: 0,
          fix: 'Since schools replaced',
          why: 'The main subject is "lessons", and lessons did not replace anything. The participle needs a subject that can do the replacing: "since schools replaced textbooks with tablets, lessons now stop …". Test every -ing opener against the subject that follows the comma.' },
        { id: 'm09ckq3', type: 'build', tag: 'gra-cleft', level: 'B2', prompt: 'p-city-flooding',
          stem: 'Build a cleft sentence that puts the spotlight on the example, the districts.',
          tiles: ['It is', 'in the low-lying districts', 'built on former rice fields', 'that', 'the effect', 'is', 'most visible.'],
          solution: 'It is in the low-lying districts built on former rice fields that the effect is most visible.', alt: [],
          why: 'The phrase after "it is" carries the emphasis, so the example, "in the low-lying districts built on former rice fields", goes there and the rest of the plain sentence follows "that". Clefting the other half is grammatical, but it stresses the effect rather than the example, which is not what the sentence asked for.' },
        { id: 'm09ckq4', type: 'choose', tag: 'gra-concession', level: 'B2', prompt: 'p-cctv-everywhere',
          stem: 'Which concession is error-free?',
          options: ['Although cameras deter theft, but they cannot stop a determined offender.', 'Despite cameras deter theft, they cannot stop a determined offender.', 'Cameras deter theft; although, they cannot stop a determined offender.', 'Although cameras deter theft, they cannot stop a determined offender.'], answer: 3,
          why: 'One marker, one subordinate clause, one main clause. The first doubles the marker with "but", "despite" cannot take a clause, and "although" cannot be used like "however" after a semicolon. Concession is the grammar of the nuance sentence, so it must be exact.' },
        { id: 'm09ckq5', type: 'judge', tag: 'gra-cleft', level: 'C1', prompt: 'p-free-transport',
          given: 'What makes the fare a real barrier for low-income commuters are the daily cost over a month.',
          stem: 'Is this what-cleft error-free?', answer: 1,
          hint: 'Find the subject of "are" and ask whether the verb has been matched to it or to the nearest noun.',
          why: 'False. A what-clause is a single subject and takes a singular verb: "what makes the fare a barrier is the daily cost". The writer matched the verb to "commuters", the nearest plural noun. The head-noun rule from the nominalisation module applies to clefts too.' },
        { id: 'm09ckq6', type: 'choose', tag: 'gra-conditional', level: 'C1', prompt: 'p-city-flooding',
          stem: 'Complete the mixed conditional: "Had the council invested in drains a decade ago, the district ___ every monsoon now."',
          hint: '"Now" tells you when the result happens; choose the verb form that belongs to that time, not to the condition.',
          options: ['would not flood', 'will not flood', 'would not have flooded', 'did not flood'], answer: 0,
          why: 'The condition is past ("had invested"), but "now" makes the result present, so the result takes "would" + base verb: "would not flood". "Would not have flooded" describes a past result and clashes with "now"; "will" and "did" do not pair with a hypothetical past condition.' },
        { id: 'm09ckq7', type: 'rewrite', tag: 'gra-participle', level: 'C1', prompt: 'p-cctv-everywhere',
          stem: 'Join the result with a participle phrase instead of "which": keep the first clause, then "…, making …".',
          given: 'A camera raises the chance that a thief is caught, which makes theft less worth trying.',
          must: [['making', 'leaving', 'rendering', 'reducing']], ban: ['which'],
          minWords: 10, maxWords: 25, praise: 'The participle borrows the subject "a camera" and carries the result. That is the mechanism swap.',
          _good: 'A camera raises the chance that a thief is caught, making theft less worth trying.',
          _bad: 'A camera raises the chance that a thief is caught, which makes theft less worth trying.',
          why: '"Which makes" becomes "making": the relative clause turns into a participle phrase that borrows the subject "a camera". The test is that the camera can do the making. One sentence, one movement from mechanism to result.' },
        { id: 'm09ckq8', type: 'choose', tag: 'gra-complex', level: 'C1', prompt: 'p-minimum-wage',
          stem: 'Which "not only" sentence is error-free?',
          hint: 'Check both halves: the auxiliary and verb form after "not only", and whether the "but" clause still has its subject in place.',
          options: ['Not only a higher wage raises incomes, but also it cuts reliance on state subsidy.', 'Not only does a higher wage raises incomes, but it also cuts reliance on state subsidy.', 'Not only does a higher wage raise incomes, but it also cuts reliance on state subsidy.', 'Not only does a higher wage raise incomes, but also cuts it reliance on state subsidy.'], answer: 2,
          why: 'Auxiliary before the subject, base verb "raise", and a complete second clause "but it also cuts". The first has no auxiliary, the second doubles the tense on "raises", and the fourth scrambles the second clause. Audit every part of a swap; one slip removes the sentence from the error-free count.' }
      ] }
    }]
  });
})();
