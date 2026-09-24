/* POSITION CONTROL — topic-05.js · Module 05 The Template */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm05', n: 5, code: 'Module 05', name: 'The Template', art: 'stack', cefr: 'B1–C1',
    blurb: 'Four frames, eleven slots, a word budget, and the rule that the frames are yours to bend.',
    levels: [{
      id: 'm05l1', n: 1, name: 'The Template', cefr: 'B1–C1', blurb: 'Which variable goes where, how to choose and fill an opener, and how to make the frame your own.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm05s1', name: 'Four frames, eleven slots', cefr: 'B1',
          theory: {
            key: 'Four paragraphs, eleven variables, about 285 words: introduction 50 (Core Topic, both facets, position), Body A 95, Body B 95, conclusion 45 (Core Topic, position, rationale).',
            body: [
              '<p>The template is a scaffold. It guarantees, before you write a word, the three things Coherence and Cohesion asks for at Band 7: paragraphing, <em>"a clear central topic within each paragraph"</em>, and progression. It comes in two tiers. The <strong>B2 tier</strong> (the Band 7 track) uses plain frames: <em>"People often discuss the topic of {Core Topic} because it has many different effects. While many people focus on {Facet A}, it is also important to consider {Facet B}. To fully understand this issue, we need to look at both sides carefully. Personally, I believe that {Position}."</em> The <strong>C1 tier</strong> (the Band 8 track) says the same thing in nominalised academic English. Each paragraph has three openers to choose from, and every slot is named after one of the eleven variables.</p>',
              '<p>The map is fixed, so learn it once. The <strong>introduction</strong> carries the Core Topic, Facet A, Facet B and the Synthesized Position. <strong>Body A</strong> carries Facet A, Mechanism A, Example A and Nuance A, in that order: <em>"One important part of this issue is {Facet A}. This idea works by {Mechanism A}. We can see this happening in the real world when {Example A}. However, looking only at this side misses an important point; in reality, {Nuance A}, which shows that this is not a perfect solution."</em> <strong>Body B</strong> carries the same four moves for Facet B. The <strong>conclusion</strong> carries the Core Topic, the Synthesized Position again, and the Rationale. Notice that the position appears twice, at the end of the introduction and again in the conclusion, which is what Module 02 demanded.</p>',
              '<p>The word budget is <strong>50 / 95 / 95 / 45</strong>, about 285 words in total. The body paragraphs carry the weight because the variables inside them carry the marks: a mechanism, an example and a nuance need room. A ninety-word introduction steals that room from the body; a thirty-word Body B is <em>"a part not answered"</em>. Inside a body paragraph, think of the split as roughly fifteen words for the facet, twenty-five for the mechanism, twenty-five for the example and twenty-five for the nuance.</p>',
              '<p>One central idea per body paragraph is the rule the frames enforce. A sentence about Facet B at the end of Body A is not extra development; it is a second paragraph that has wandered into the first, and it costs Coherence. The four sentences of a body frame are in a fixed order because facet → mechanism → example → nuance is a progression, each sentence ending with what the next explains. For the other question types the same eleven slots are simply renamed: an opinion essay calls Facet A and Facet B <em>Reason 1</em> and <em>Reason 2</em>; an advantages essay calls them <em>the main advantage</em> and <em>the main disadvantage</em>; a problem essay calls them <em>the main cause</em> and <em>the solution</em>.</p>'
            ],
            simple: [
              '<p>Four paragraphs. Introduction: Core Topic, Facet A, Facet B, Position. Body A: Facet A, Mechanism A, Example A, Nuance A. Body B: the same for B. Conclusion: Core Topic, Position again, Rationale.</p>',
              '<p>Word budget: 50 / 95 / 95 / 45. The body paragraphs are long because the mechanism, example and nuance carry the marks.</p>',
              '<p>One idea per body paragraph. If Facet B appears in Body A, move it. The four sentences of a body paragraph stay in order.</p>'
            ],
            examples: [
              { s: 'Introduction, B2 Standard: "People often discuss the topic of [Core Topic] … While many people focus on [Facet A], it is also important to consider [Facet B] … Personally, I believe that [Position]."', g: 'Four slots in fifty words, and the position is the last sentence.' },
              { s: 'Body A, B2 Standard: "One important part of this issue is [Facet A]. This idea works by [Mechanism A]. We can see this happening in the real world when [Example A]. However … in reality, [Nuance A] …"', g: 'Four moves, four sentences, one idea. About 95 words once the slots are filled.' },
              { s: 'Conclusion, B2 Standard: "To sum up, simply looking at [Core Topic] from one side is not enough … A better way to look at it is that [Position]. This view makes the most sense because [Rationale]."', g: 'The position returns, with the one reason it is right.' },
              { s: '<s>Introduction 90 words, Body A 60, Body B 60, conclusion 50.</s>', g: '260 words, but the wrong shape: the introduction has eaten the room the mechanisms and examples needed.' }
            ]
          },
          items: [
            { id: 'm05s1q1', type: 'sort', tag: 'cc-paragraphing', level: 'B1',
              stem: 'Sort the variables into the paragraph that carries them.',
              bins: [{ key: 'a', label: 'Body A', hint: 'paragraph 2' }, { key: 'b', label: 'Body B', hint: 'paragraph 3' }, { key: 'c', label: 'Conclusion', hint: 'paragraph 4' }],
              items: [
                { text: 'Facet A', bin: 'a' },
                { text: 'Mechanism A', bin: 'a' },
                { text: 'Nuance A', bin: 'a' },
                { text: 'Facet B', bin: 'b' },
                { text: 'Example B', bin: 'b' },
                { text: 'Nuance B', bin: 'b' },
                { text: 'Synthesized Position', bin: 'c' },
                { text: 'Rationale', bin: 'c' }
              ],
              why: 'Body A holds the four A variables, Body B the four B variables, and the conclusion holds the Synthesized Position and the Rationale. The position also appears at the end of the introduction, which is why the reader knows what the body paragraphs are for.' },
            { id: 'm05s1q2', type: 'choose', tag: 'cc-paragraphing', level: 'B1',
              stem: 'What is the word budget for the four paragraphs, from introduction to conclusion?',
              hint: 'The body paragraphs carry the mechanism, the example and the nuance, so they need most of the room.',
              options: ['50 / 95 / 95 / 45', '70 / 70 / 70 / 70', '30 / 110 / 110 / 30', '50 / 120 / 60 / 50'], answer: 0,
              why: 'The body paragraphs carry the mechanism, the example and the nuance, so they get the words: about 95 each. Fifty words is enough for an introduction with four slots, and forty-five for a conclusion with three. Equal paragraphs starve the body; unequal bodies leave one facet undeveloped.' },
            { id: 'm05s1q3', type: 'judge', tag: 'cc-one-idea', level: 'B2',
              given: 'Body A: Facet A, its mechanism and its example, then Facet B and its mechanism. 140 words, no nuance.',
              stem: 'Does this paragraph follow the Body A frame?', answer: 1,
              why: 'False. Two facets in one paragraph is two paragraphs, and the frame has no slot for Facet B in Body A. The words spent on Facet B were the words the nuance needed. Band 7 CC asks for "a clear central topic within each paragraph".' },
            { id: 'm05s1q4', type: 'choose', tag: 'cc-one-idea', level: 'B1',
              stem: 'In the B2 Body A frame, "This idea works by …" opens which slot?',
              hint: 'Each of the four moves answers a different question; ask which question "works by" is asking.',
              options: ['Facet A', 'Mechanism A', 'Example A', 'Nuance A'], answer: 1,
              why: '"Works by" asks how, and how is the mechanism. The facet was the sentence before ("One important part of this issue is …"), the example follows ("We can see this happening in the real world when …"), and the nuance comes last ("However … in reality …").' },
            { id: 'm05s1q5', type: 'select', tag: 'tr-no-position', level: 'B2',
              stem: 'Tick the two variables that appear in both the introduction frame and the conclusion frame.',
              hint: 'Read the introduction frame and the conclusion frame in the theory and compare their slot names.',
              options: ['Facet A', 'Core Topic', 'Mechanism A', 'Rationale', 'Synthesized Position', 'Example B'], answers: [1, 4], k: 2,
              why: 'The Core Topic names the issue at both ends of the essay, and the Synthesized Position must appear at the end of the introduction and again in the conclusion. The facets are named in the introduction only, the rationale lives in the conclusion only, and mechanisms and examples never leave the body.' },
            { id: 'm05s1q6', type: 'order', tag: 'cc-one-idea', level: 'B2', prompt: 'p-tourism',
              stem: 'Put the four sentences of this filled Body B frame in order.',
              items: ['Another very important part of the debate is the damage that visitors do to local traditions and to fragile natural places.', 'This side is based on turning real traditions into shows for sale and using up scarce water and land, which usually leads to results like dying coral reefs and old quarters turned into rows of souvenir shops.', 'Still, we must also be careful with this view.', 'Even though it has a big impact, we must remember that visitor money often pays for the very parks and buildings that need protecting.'],
              why: 'Facet B, then the mechanism with its example, then the turn ("Still, we must also be careful"), then the nuance. The frame\'s order is the progression of the paragraph; the reader can follow it because each sentence ends where the next begins.' },
            { id: 'm05s1q7', type: 'choose', tag: 'cc-one-idea', level: 'B2',
              stem: 'A student\'s Body A ends with a sentence about Facet B. What is the right move?',
              options: ['Delete Facet B from the essay entirely, since Body A is already long enough.', 'Add Mechanism B to Body A so that the second idea is complete.', 'Move the sentence to the end of the introduction as a preview.', 'Move it to Body B, where it opens the paragraph as the topic sentence.'], answer: 3,
              why: 'Facet B is the topic sentence of Body B; it has a paragraph of its own waiting for it. Deleting it loses a required part, completing it inside Body A makes a two-idea paragraph, and the introduction already names both facets in one sentence.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm05s2', name: 'Choosing and filling an opener', cefr: 'B2',
          theory: {
            key: 'Each paragraph has at least three openers. Choose the one whose shape matches your variable, fill the slot in the form the frame expects, and read the sentence aloud before you keep it.',
            body: [
              '<p>The B2 tier gives Body A three openers. <strong>Standard</strong>: <em>"One important part of this issue is {Facet A}. This idea works by {Mechanism A} …"</em>. <strong>Cause first</strong>: <em>"The first side of the debate is {Facet A}. It works by {Mechanism A}. A clear example is {Example A}. Even so, {Nuance A}, so this argument has its limits."</em> <strong>Example first</strong>: <em>"Consider {Example A}. This shows the importance of {Facet A}, which works by {Mechanism A}. It would be a mistake, though, to stop here: {Nuance A}."</em> Body B offers Standard, <strong>Contrast</strong> (<em>"On the other side of the argument is {Facet B} …"</em>) and <strong>Equally</strong> (<em>"Just as important is {Facet B} …"</em>). Contrast is for a Facet B that opposes Facet A; Equally is for one that adds to it.</p>',
              '<p>The C1 tier does the same with nominalised language. Body A: <strong>The Standard</strong>, <em>"A fundamental dimension of this issue is its relationship to {Facet A}. This dynamic operates primarily by {Mechanism A}, which leads to {Example A} …"</em>; <strong>Causality focus</strong>, <em>"At the core of this phenomenon lies the undeniable impact of {Facet A}. Its influence stems from {Mechanism A}, and this trajectory frequently manifests in real-world scenarios such as {Example A} …"</em>; <strong>Argumentative</strong>, <em>"The primary justification often cited within this context is {Facet A}. The argument rests on {Mechanism A}; {Example A} illustrates the point."</em> Choose by shape: a facet whose whole point is a cause-and-effect chain (a tax raises prices, so purchases fall) takes the causality opener, because <em>"its influence stems from"</em> is built to carry a chain. A facet that is a reason people give takes the argumentative opener. A striking, named example takes the example-first frame, because your strongest material should come first.</p>',
              '<p>Filling is a grammar job. Each slot expects a form: after <em>is</em>, a noun phrase (the facet: <em>the urgent need to reduce the pollution that city traffic creates</em>); after <em>works by</em> or <em>stems from</em>, an <em>-ing</em> phrase (the mechanism: <em>cutting the exhaust fumes that people breathe</em>); after <em>when</em> or <em>such as</em>, a clause or a case (the example); after <em>in reality,</em> a full clause (the nuance). The app lower-cases the first letter of a slot inside a sentence, but it cannot fix a mismatch: <em>"This idea works by schools that replaced their vending machines"</em> is an example in a mechanism slot, and it reads wrongly because the form is wrong too.</p>',
              '<p>Read every filled sentence aloud. If it does not sound like a sentence a person would say, the slot content and the frame do not fit: change the opener, or reshape the content. The playbooks do this for you where the discuss-both-views shape would be wrong: the opinion frame for Body A is <em>"The first reason is {Facet A}. It works by {Mechanism A}. We can see this when {Example A}. Admittedly, {Nuance A}, but this does not weaken the main point."</em> Choosing and filling is the first step towards owning the frame; the next sub-level takes the frame words away.</p>'
            ],
            simple: [
              '<p>Body A has three openers at each tier. Match the opener to your variable: a cause-and-effect facet takes "Causality focus"; a striking example takes "Example first"; a Facet B that opposes Facet A takes "Contrast".</p>',
              '<p>Fill the slot in the right form: after "is", a noun phrase; after "works by", an -ing phrase; after "when", a clause.</p>',
              '<p>Read it aloud. If it sounds wrong, the slot and the frame do not fit. Change one of them.</p>'
            ],
            examples: [
              { s: 'One important part of this issue is the urgent need to reduce the pollution that city traffic creates.', g: 'B2 Standard opener + Facet A of the cars prompt. Noun phrase after "is".' },
              { s: 'At the core of this phenomenon lies the undeniable impact of the imposition of punitive duties in order to improve population health. Its influence stems from raising the marginal cost of nutritionally deficient products until consumption measurably shifts.', g: 'Causality focus with the C1 variables of the fast-food tax prompt: the frame was built for a chain, and the mechanism is a chain.' },
              { s: 'Consider national care insurance paid for by contributions from everyone, as in Japan. This shows the importance of treating care for older people as a duty of the whole society.', g: 'Example first: the named case leads, the facet follows.' },
              { s: '<s>This idea works by scattered firms reporting lower property costs and better staff retention.</s>', g: 'Example A in the Mechanism A slot. Wrong variable, and the sentence sounds wrong when read aloud.' }
            ]
          },
          items: [
            { id: 'm05s2q1', type: 'build', tag: 'struct-template', level: 'B2', prompt: 'p-cars-city',
              stem: 'Build the first sentence of Body A: the B2 Standard opener with Facet A.',
              tiles: ['One important part', 'of this issue is', 'the urgent need', 'to reduce', 'the pollution', 'that city traffic', 'creates.'],
              solution: 'One important part of this issue is the urgent need to reduce the pollution that city traffic creates.', alt: [],
              why: 'Frame, then slot: "One important part of this issue is" + a noun phrase. The facet is the whole aspect (the need to reduce pollution), not the policy (banning cars) and not the mechanism (cutting fumes).' },
            { id: 'm05s2q2', type: 'choose', tag: 'struct-template', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Facet A is a heavy tax on fast food, and its whole point is a chain of effects. Which C1 Body A opener fits best?',
              options: ['The Standard: "A fundamental dimension of this issue is its relationship to …"', 'Causality focus: "At the core of this phenomenon lies the undeniable impact of …"', 'Argumentative: "The primary justification often cited within this context is …"', 'Complication: "Furthermore, this developmental landscape is profoundly complicated by …"'], answer: 1,
              why: 'The causality frame continues "Its influence stems from {Mechanism A}, and this trajectory frequently manifests in …", which is built to carry a chain: tax → price → purchases → health. The Standard is neutral, Argumentative suits a reason people cite, and Complication is a Body B opener.' },
            { id: 'm05s2q3', type: 'build', tag: 'cc-one-idea', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Build the topic sentence of Body A using the opinion playbook opener and Facet A.',
              tiles: ['The first reason is', 'the eating habits', 'that young people', 'form for life', 'while they are', 'at school.'],
              solution: 'The first reason is the eating habits that young people form for life while they are at school.', alt: [],
              why: 'In an opinion essay Facet A is Reason 1, and the playbook opener says so: "The first reason is" + the facet as a noun phrase. The next sentence of the frame, "It works by …", is where the mechanism goes.' },
            { id: 'm05s2q4', type: 'judge', tag: 'cc-one-idea', level: 'B2', prompt: 'p-remote-work',
              given: 'This idea works by scattered firms reporting lower property costs and better staff retention.',
              stem: 'Is the right variable in this slot?', answer: 1,
              why: 'False. "Works by" wants the mechanism: removing travel time and office costs, which raises both freedom and efficiency. The firms reporting lower costs are Example A, and they belong one sentence later: "We can see this happening in the real world when …".' },
            { id: 'm05s2q5', type: 'build', tag: 'tr-no-position', level: 'B2', prompt: 'p-cars-city',
              stem: 'Build the last sentence of the "Question first" introduction, which carries the position.',
              tiles: ['This essay looks at', 'both sides', 'before arguing that', 'councils should invest', 'in public transport', 'while phasing out', 'the dirtiest vehicles.'],
              solution: 'This essay looks at both sides before arguing that councils should invest in public transport while phasing out the dirtiest vehicles.', alt: [],
              why: 'The introduction frame ends with the position, so the examiner knows the verdict before the body begins. "Before arguing that" is the marker; the slot takes a full clause with a modal: "councils should …".' },
            { id: 'm05s2q6', type: 'choose', tag: 'struct-template', level: 'B2', prompt: 'p-elderly-care',
              stem: 'Example A is a strong named case: national care insurance, as in Japan. Which B2 Body A opener uses it best?',
              options: ['Standard: "One important part of this issue is …"', 'Cause first: "The first side of the debate is …"', 'Example first: "Consider …"', 'Contrast: "On the other side of the argument is …"'], answer: 2,
              why: 'When the example is your strongest material, lead with it: "Consider national care insurance … This shows the importance of {Facet A}, which works by {Mechanism A}." Standard and Cause first bury the case in sentence three; Contrast is a Body B opener.' },
            { id: 'm05s2q7', type: 'build', tag: 'struct-template', level: 'C1', prompt: 'p-tourism',
              stem: 'Fill the C1 Standard opener of Body A with Facet A at the C1 tier.',
              tiles: ['A fundamental dimension', 'of this issue', 'is its relationship to', 'the economic revitalisation', 'generated by', 'foreign visitor expenditure.'],
              solution: 'A fundamental dimension of this issue is its relationship to the economic revitalisation generated by foreign visitor expenditure.', alt: [],
              why: 'The C1 frame ends in "its relationship to", which takes a nominalised noun phrase: "the economic revitalisation generated by foreign visitor expenditure". A clause ("tourism brings money") would not fit the slot.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm05s3', name: 'Own the frame', cefr: 'B2',
          theory: {
            key: 'The frames are scaffolding, and the examiner has seen them. Edit every opener into your own words, keep the slot content, and keep unchanged frame text under a third of the essay.',
            body: [
              '<p>The descriptors name the danger directly: Bands 3 and 4 mention <em>"over-dependence on … memorised language"</em>, and a fully memorised essay is Band 0. An examiner who reads <em>"A fundamental dimension of this issue is its relationship to"</em> in ten scripts from one school will discount it in all ten. The same rule applies to the classic clichés: examiners have read <em>"it goes without saying"</em>, <em>"at the end of the day"</em> and <em>"two sides of the same coin"</em> thousands of times, and each one lowers the Lexical Resource mark instead of raising it. Memorised language is not judged by whether it is correct but by whether it is <strong>yours</strong>.</p>',
              '<p>This app measures it. The pre-flight check computes a <strong>template ratio</strong>: every run of four or more words that appears in any frame is looked up in your essay, and the matched words are counted. Above a third of the essay is a warning; above a half is red. The ratio falls in two ways. Put more inside the slots: a rich mechanism and a real example are your words, not the frame\'s. And rewrite the frame words themselves, so that the runs no longer match.</p>',
              '<p>Owning an opener means keeping its job and changing its words. The job of <em>"One important part of this issue is X"</em> is to introduce the facet. So: <em>"The strongest argument for a ban is X"</em>, <em>"X is the first thing to weigh"</em>, <em>"Supporters of the ban begin with X"</em>. Three moves do most of the work: change the subject, change the verb, change the order. Do the same to the joins: <em>"This idea works by"</em> becomes <em>"It does this by"</em> or <em>"The reason is simple:"</em>; <em>"However, looking only at this side misses an important point"</em> becomes <em>"This is not the whole story:"</em>. Never replace a frame with a cliché; that is trading one memorised phrase for a worse one.</p>',
              '<p>What stays is the structure: the four moves in order, the position in the introduction and the conclusion, and the slot content, which is your argument. What changes is everything that could have been written before you saw the prompt. The scaffold fades as you go: Guided mode shows the full frames, Skeleton mode shows only the slot labels and word targets, Exam mode is a blank page, and every mock is a blank page. The rewrite tasks in this sub-level check exactly this: the slot nouns must survive, the frame\'s own words must not.</p>'
            ],
            simple: [
              '<p>The examiner has seen the frames. Memorised language is marked down, and a fully memorised essay scores zero. Clichés count as memorised language too.</p>',
              '<p>The pre-flight check counts unchanged frame words. Over a third: warning. Over a half: red. Fix it by writing more inside the slots and by changing the frame words.</p>',
              '<p>Keep the job of the sentence, change the words: "One important part of this issue is X" → "The strongest argument for a ban is X". Change the subject, the verb or the order.</p>'
            ],
            examples: [
              { s: 'The strongest argument for a ban is the pollution that city traffic pumps into the air every day.', g: 'Same job as "One important part of this issue is …", none of its words. The slot content survives.' },
              { s: '<s>One important part of this issue is the urgent need to reduce the pollution that city traffic creates.</s>', g: 'The frame verbatim. Correct, and worth less each time the examiner sees it.' },
              { s: '<s>It goes without saying that pollution is the first side of this burning issue.</s>', g: 'The frame replaced with two clichés. Worse than the frame.' },
              { s: 'What matters most here is the eating habits that teenagers form and then keep for the rest of their lives.', g: 'The C1 Standard opener rewritten: "fundamental dimension", "relationship" and "issue" are gone; the habits and the teenagers remain.' }
            ]
          },
          items: [
            { id: 'm05s3q1', type: 'choose', tag: 'lr-memorised', level: 'B2', prompt: 'p-cars-city',
              stem: 'Which Body A opener would an examiner mark on its merits, not as memorised language?',
              hint: 'Ask which sentence the examiner has not already read a hundred times in other scripts.',
              options: ['It goes without saying that the first side is the cost of a ban.', 'One important part of this issue is the cost of a ban.', 'The first thing to weigh is what a ban would cost.', 'There are two sides of the same coin, and the first is cost.'], answer: 2,
              why: 'The third sentence does the frame\'s job in the writer\'s own words. The frame verbatim is correct but recognisable; "it goes without saying" and "two sides of the same coin" are clichés, and the descriptors discount memorised language wherever it comes from.' },
            { id: 'm05s3q2', type: 'judge', tag: 'struct-template', level: 'B2',
              given: 'Pre-flight row: "Unchanged frame text: 25%".',
              stem: 'Is this essay inside the safe range for frame text?', answer: 0,
              hint: 'Recall the two threshold lines of the template ratio before you decide.',
              why: 'True. Above a third of the essay in unchanged frame words is a warning; above a half is red. A quarter is below both lines: most of this essay lives inside the slots, which is where the marks are.' },
            { id: 'm05s3q3', type: 'rewrite', tag: 'struct-template', level: 'B2', prompt: 'p-cars-city',
              stem: 'Rewrite this Body A opener in your own words. Keep the pollution and the traffic; drop the frame\'s words.',
              given: 'One important part of this issue is the urgent need to reduce the pollution that city traffic creates.',
              must: [['pollution'], ['traffic', 'cars', 'vehicles']], ban: ['important', 'part', 'issue'],
              minWords: 8, maxWords: 30, praise: 'Same job, your words, the slot content intact.',
              _good: 'The strongest argument for a ban is the pollution that city traffic pumps into the air every day.',
              _bad: 'One important part of this issue is the urgent need to reduce the pollution that city traffic creates.',
              why: 'The sentence still introduces Facet A, and the facet\'s nouns (pollution, traffic) are still there. "Important", "part" and "issue" were the frame\'s words, not yours; the examiner has seen them.' },
            { id: 'm05s3q4', type: 'spot', tag: 'lr-memorised', level: 'C1', prompt: 'p-cars-city',
              stem: 'Tap the chunk that is a memorised cliché.',
              words: ['Admittedly,', 'the cost of a full ban', 'is high,', 'but at the end of the day', 'cleaner air', 'is worth the price.'], answer: 3,
              fix: 'but on balance',
              why: '"At the end of the day" is spoken, informal and memorised; it adds no meaning. "On balance" does the same job (a weighing) in formal register and in two words the examiner does not discount.' },
            { id: 'm05s3q5', type: 'choose', tag: 'lr-memorised', level: 'C1', prompt: 'p-school-snacks',
              stem: 'Which rewrite of the C1 opener keeps the slot content but makes the frame the writer\'s own?',
              hint: 'Two tests: are the frame\'s words gone, and is Facet A still the content of the sentence?',
              options: ['A fundamental dimension of this issue is its relationship to lifelong eating habits.', 'It is a truth universally acknowledged that eating habits are formed early in life.', 'The first thing at stake is the commercial pressure that teenagers face from advertising.', 'The first thing at stake is the eating habits that teenagers carry into adult life.'], answer: 3,
              why: 'The last sentence introduces the facet in fresh words and keeps the habits and the teenagers. The first is the frame verbatim, the second borrows a famous line (memorised in a different way), and the third is the writer\'s own words but with Facet B in the slot.' },
            { id: 'm05s3q6', type: 'rewrite', tag: 'lr-memorised', level: 'C1', prompt: 'p-school-snacks',
              stem: 'Rewrite the C1 Standard opener in your own words. Keep the habits and the teenagers; drop the frame\'s words.',
              given: 'A fundamental dimension of this issue is its relationship to the formation of lifelong dietary habits during adolescence.',
              must: [['habits', 'habit'], ['teenagers', 'teenager', 'adolescents', 'adolescence', 'adolescent', 'young people', 'students', 'student']], ban: ['fundamental', 'dimension', 'relationship', 'issue'],
              minWords: 8, maxWords: 30, praise: 'The frame is gone; the facet remains.',
              _good: 'What matters most here is the eating habits that teenagers form and then keep for the rest of their lives.',
              _bad: 'A fundamental dimension of this issue is its relationship to the eating habits of teenagers.',
              why: '"Fundamental dimension" and "relationship to" are the frame\'s signature; ten scripts with the same signature are discounted together. The facet itself, habits formed in adolescence, is the content the examiner marks.' },
            { id: 'm05s3q7', type: 'choose', tag: 'struct-template', level: 'B2',
              stem: 'The pre-flight check measures unchanged frame text. Above what share of the essay does the row turn red?',
              hint: 'There are two lines: a warning at the lower one and red at the higher one.',
              options: ['A tenth', 'A third', 'A half', 'Three quarters'], answer: 2,
              why: 'Above a third is a warning; above a half is red. The frames should be scaffolding around your words, not the building itself. Most of a Band 8 essay lives inside the slots.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm05ck', name: 'Systems Check', items: [
        { id: 'm05ckq1', type: 'sort', tag: 'cc-paragraphing', level: 'B1',
          stem: 'Sort each frame sentence into the paragraph it comes from.',
          bins: [{ key: 'i', label: 'Introduction', hint: 'paragraph 1' }, { key: 'b', label: 'Body', hint: 'paragraphs 2 and 3' }, { key: 'c', label: 'Conclusion', hint: 'paragraph 4' }],
          items: [
            { text: 'People often discuss the topic of … because it has many different effects.', bin: 'i' },
            { text: 'This idea works by …', bin: 'b' },
            { text: 'To sum up, simply looking at … from one side is not enough.', bin: 'c' },
            { text: 'We can see this happening in the real world when …', bin: 'b' },
            { text: 'This view makes the most sense because …', bin: 'c' },
            { text: 'While many people focus on …, it is also important to consider …', bin: 'i' }
          ],
          why: 'The introduction names the topic and the two facets; the body frames carry the mechanism and the example; the conclusion returns to the topic and gives the rationale. Knowing the map is what lets you fill the frames in five minutes.' },
        { id: 'm05ckq2', type: 'choose', tag: 'cc-paragraphing', level: 'B2',
          stem: 'An essay runs 90 / 60 / 60 / 50 words. What is the best fix?',
          options: ['Trim the introduction and give each body paragraph an example and a nuance.', 'Add a third body paragraph with a new facet so that the essay reaches 250 words.', 'Lengthen the conclusion with a new idea that the body did not cover.', 'Leave it, since 260 words is already inside the target range.'], answer: 0,
          why: 'The budget is 50 / 95 / 95 / 45. The introduction has taken the words the body needed, and sixty-word body paragraphs cannot hold a mechanism, an example and a nuance. A third facet or a new idea in the conclusion adds undeveloped material, which costs more marks.' },
        { id: 'm05ckq3', type: 'judge', tag: 'tr-no-position', level: 'B2', prompt: 'p-cars-city',
          given: 'This essay looks at both sides before arguing that councils should invest in public transport while phasing out the dirtiest vehicles.',
          stem: 'Does this frame sentence put the position in the introduction?', answer: 0,
          why: 'True. "Before arguing that" is the marker, and the slot holds a full position with a modal. The examiner knows the verdict before Body A begins, which is what a discuss-both-views essay must do.' },
        { id: 'm05ckq4', type: 'build', tag: 'tr-no-position', level: 'B2', prompt: 'p-tourism',
          stem: 'Build the verdict sentence of the "Verdict" conclusion frame.',
          tiles: ['My own position is that', 'governments should', 'limit visitor numbers', 'and spend', 'tourist money', 'on culture and nature.'],
          solution: 'My own position is that governments should limit visitor numbers and spend tourist money on culture and nature.', alt: [],
          why: 'The conclusion restates the position: "My own position is that" + the same claim the introduction made, in a fresh sentence. The frame then adds "mainly because {Rationale}".' },
        { id: 'm05ckq5', type: 'choose', tag: 'struct-template', level: 'B2',
          stem: 'The pre-flight row says "Unchanged frame text: 40%". What should the student do?',
          hint: 'Compare forty per cent with the two threshold lines, then ask what makes the ratio fall.',
          options: ['Nothing, because anything under half is safe.', 'Edit the openers into their own words and put more inside the slots.', 'Delete the nuance sentences so that the frames are shorter.', 'Switch to the C1 tier, whose frames are longer and sound more academic.'], answer: 1,
          why: 'Forty per cent is above the one-third warning line. The ratio falls when the frame words change and when the slots hold more of your own words. Deleting the nuance loses a Band 8 move, and the C1 frames are just as memorised as the B2 ones.' },
        { id: 'm05ckq6', type: 'spot', tag: 'lr-memorised', level: 'C1', prompt: 'p-fast-food-tax',
          stem: 'Tap the chunk that is a memorised cliché in this conclusion.',
          words: ['In conclusion,', 'both sides', 'of this burning issue', 'have real strengths,', 'but the state', 'should tax the most harmful ingredients.'], answer: 2,
          fix: 'of this debate',
          why: '"Burning issue" is a stock phrase examiners have read thousands of times; it says nothing about this prompt. "This debate" is plain, formal and yours. The rest of the sentence keeps the position, which is what a conclusion must do.' },
        { id: 'm05ckq7', type: 'select', tag: 'struct-template', level: 'C1',
          stem: 'Tick the two items that carry the marks in an essay built on the template.',
          hint: 'Ask which of these could only have been written after reading the prompt.',
          options: ['Mechanism A', 'The opener "A fundamental dimension of this issue"', 'Nuance B', 'The linker "Furthermore"', 'The phrase "To sum up"', 'The phrase "in the real world"'], answers: [0, 2], k: 2,
          why: 'The variables carry the marks, not the frames. A mechanism and a nuance are the Band 8 Task Response requirements made visible; the openers, linkers and joins are scaffolding, and the examiner has seen them before.' },
        { id: 'm05ckq8', type: 'rewrite', tag: 'lr-memorised', level: 'C1', prompt: 'p-cars-city',
          stem: 'Rewrite this Body B opener in your own words. Keep the freedom to travel; drop the frame\'s words.',
          given: 'Another very important part of the debate is the freedom of each person to move around and travel as they choose.',
          must: [['freedom', 'free', 'right'], ['move', 'travel', 'drive']], ban: ['important', 'part', 'debate'],
          minWords: 8, maxWords: 30, praise: 'Facet B introduced in your own words.',
          _good: 'Set against this is the right of every citizen to travel across the city however they wish.',
          _bad: 'Another very important part of the debate is the freedom of each person to move around and travel as they choose.',
          why: 'The sentence still opens Body B with Facet B (freedom of movement), but "important", "part" and "debate" are gone. A frame that ten students copy is discounted ten times; a sentence only you wrote is marked on its merits.' }
      ] }
    }]
  });
})();
