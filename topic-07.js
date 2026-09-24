/* POSITION CONTROL — topic-07.js · Module 07 Cohesion */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm07', n: 7, code: 'Module 07', name: 'Cohesion', art: 'signal', cefr: 'B1–C1',
    blurb: 'Cohesion the examiner does not notice: reference words instead of linkers, and sentences that hand the reader from known to new.',
    levels: [{
      id: 'm07l1', n: 1, name: 'Cohesion', cefr: 'B1–C1', blurb: 'Reference and substitution, the linker detox, and known-to-new progression: the three moves that lift Coherence and Cohesion from 6 to 8.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm07s1', name: 'Reference and substitution', cefr: 'B1',
          theory: {
            key: 'Refer back instead of repeating: this policy, such a ban, doing so, the former / the latter. Band 7 rewards reference and substitution used flexibly.',
            body: [
              '<p>Band 7 Coherence and Cohesion names its own test: <em>"a range of cohesive devices including reference and substitution is used flexibly"</em>. Reference means pointing back at something already said instead of saying it again. A Band 6 paragraph repeats the full noun phrase in every sentence: <em>"A ban on cars would cut pollution. A ban on cars would also cause problems for workers. A ban on cars…"</em>. A Band 7 paragraph names the ban once and then points at it: <em>"Such a ban would cut pollution. Doing so, however, strands workers…"</em>. The reader is carried from sentence to sentence by the pointing, and no linking word is needed.</p>',
              '<p>Five tools cover most essays. <strong>This / these + a summarising noun</strong>: <em>this policy</em>, <em>this trend</em>, <em>these developments</em>. The noun does the work: it names what kind of thing the last sentence was, so the reader knows how to hold it. <strong>Such + noun</strong>: <em>such measures</em>, <em>such a ban</em>; it points back and adds "of that kind". <strong>Doing so</strong> replaces a whole action: <em>"Councils could raise parking charges. Doing so would…"</em>. <strong>The former / the latter</strong> pick one of two things just named, in order. <strong>Both</strong> and <strong>neither</strong> gather two things into one. Three uses of any of these per essay is enough to show the examiner the range.</p>',
              '<p>Two rules keep reference accurate rather than flexible-but-wrong, which the descriptor also notices (<em>"some inaccuracies"</em>). First, the summarising noun must fit: a proposal is not <em>this trend</em>, two actions are not <em>this policy</em>, and <em>the latter</em> is meaningless unless exactly two things were named. Second, the reference must point at one clear thing. <em>"It"</em> after a sentence with three nouns in it is a guess; <em>"this higher risk"</em> is not. If you are not sure the reader can find the referent, repeat the noun in a shorter form instead: <em>the ban</em>, <em>the scheme</em>.</p>',
              '<p>Reference is the natural grammar of the four-move paragraph. The facet is named in full once; the mechanism refers to it (<em>this idea works by…</em>); the example points at the mechanism (<em>we see this when…</em>); the nuance points at the whole (<em>such a ban, however…</em>). Repeating the prompt noun in every sentence is also a Lexical Resource fault, so the same fix earns twice. The checker in this app counts reference phrases and wants at least two in an essay; a Band 8 script usually has six or more, and none of them attracts attention.</p>'
            ],
            simple: [
              '<p>Do not repeat the whole noun phrase in every sentence. Name it once, then point back: "this policy", "such a ban", "doing so", "the former / the latter".</p>',
              '<p>The noun after "this" or "such" must fit: a plan is not a trend; "the latter" needs exactly two things before it. If the reader might not find what "it" means, use a short noun instead.</p>',
              '<p>Three reference words per essay show the examiner the Band 7 range. They also stop you repeating the prompt word, which helps vocabulary too.</p>'
            ],
            examples: [
              { s: 'Several councils have banned petrol cars from the centre and added bus lanes. <strong>Such measures</strong> have cut the fumes people breathe.', g: '"Such measures" gathers two actions into one and points back at both.' },
              { s: 'Cameras prevent some crime and provide evidence after the rest. <strong>The latter</strong> matters more to the police.', g: 'Two things named, in order; "the latter" picks the second. It would be meaningless after a single noun.' },
              { s: '<s>Schools should stop selling sugary drinks. Stopping the sale of sugary drinks in schools would change a daily routine.</s>', g: 'The whole noun phrase repeated. "Such a ban would change…" says the same in three words.' },
              { s: '<s>A later start would let students sleep longer. This trend only works if phones are managed.</s>', g: 'The wrong summarising noun: a proposal is not a trend. "Such a change" fits.' }
            ]
          },
          items: [
            { id: 'm07s1q1', type: 'choose', tag: 'cc-reference', level: 'B1', prompt: 'p-cars-city',
              stem: '"Several councils have banned petrol cars from the centre and added bus lanes. ___ have cut the fumes people breathe." Which fits?',
              options: ['This trend', 'The latter', 'These residents', 'Such measures'], answer: 3,
              hint: 'Count how many actions the first sentence names, then find the phrase that points at all of them.',
              why: 'Two actions were named, so the reference must gather both: "such measures". "The latter" would point at the bus lanes alone, a ban is a decision rather than a trend, and residents were never mentioned. The summarising noun must fit what it points at.' },
            { id: 'm07s1q2', type: 'choose', tag: 'cc-reference', level: 'B1', prompt: 'p-newspapers',
              stem: '"Print costs money to deliver while online news costs almost nothing, so ___ reaches far more readers." Which fits?',
              options: ['the former', 'the latter', 'doing so', 'such papers'], answer: 1,
              why: 'Two things were named in order, print and online, and the sentence is about the second, so "the latter". "The former" would say print reaches more readers, "doing so" needs an action to replace, and "such papers" points at printed papers, the wrong side.' },
            { id: 'm07s1q3', type: 'build', tag: 'cc-reference', level: 'B2', prompt: 'p-cars-city',
              stem: 'Build the sentence: the ban is pointed at twice, once with "such" and once with "doing so".',
              tiles: ['Such a ban', 'would cut the fumes', 'that people breathe', 'in the centre,', 'but doing so', 'also strands commuters', 'who have no bus service.'],
              solution: 'Such a ban would cut the fumes that people breathe in the centre, but doing so also strands commuters who have no bus service.', alt: [],
              why: '"Such a ban" points back at the policy named in the sentence before; "doing so" replaces the whole action of banning. Two references, no repeated noun phrase, and the nuance arrives without "however".' },
            { id: 'm07s1q4', type: 'spot', tag: 'cc-reference', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Tap the chunk that repeats the whole noun phrase instead of referring back.',
              words: ['Schools should stop selling', 'sugary drinks and snacks.', 'Stopping the sale of sugary drinks and snacks in schools', 'would change a daily routine', 'that lasts six years.'], answer: 2,
              fix: 'Such a ban',
              why: 'The second sentence repeats every word of the first before it says anything new. "Such a ban would change a daily routine" points back in three words and lets the new information arrive sooner. Repetition of the full noun phrase is the Band 6 signature.' },
            { id: 'm07s1q5', type: 'judge', tag: 'cc-reference', level: 'B2', prompt: 'p-cctv-everywhere',
              given: 'Cameras prevent some crime and provide evidence after the rest. The latter matters more to the police, since a recording can be shown in court.',
              stem: 'Is "the latter" used correctly here?', answer: 0,
              hint: 'Count the things named before "the latter", then check which of them the court sentence is about.',
              why: 'True. Exactly two things were named, prevention and evidence, in that order, and "the latter" picks the second; the court sentence confirms that evidence is meant. The device fails only when there are not two things, or when the reader cannot tell which is which.' },
            { id: 'm07s1q6', type: 'sort', tag: 'cc-linker-overuse', level: 'B1',
              stem: 'Sort each word: does it refer back to something already said, or does it count and add?',
              bins: [{ key: 'ref', label: 'Reference', hint: 'points back' }, { key: 'link', label: 'Listed linker', hint: 'counts or adds' }],
              items: [
                { text: 'this policy', bin: 'ref' },
                { text: 'Moreover', bin: 'link' },
                { text: 'doing so', bin: 'ref' },
                { text: 'Firstly', bin: 'link' },
                { text: 'such measures', bin: 'ref' },
                { text: 'In addition', bin: 'link' },
                { text: 'the latter', bin: 'ref' },
                { text: 'Secondly', bin: 'link' }
              ],
              why: 'A reference word carries meaning from the last sentence into this one. A listed linker only announces that another sentence is coming. The descriptor calls the second kind "mechanical" when it is overused; the first kind is what "flexibly" means.' },
            { id: 'm07s1q7', type: 'choose', tag: 'cc-reference', level: 'C1', prompt: 'p-teen-sleep',
              stem: '"A later start would let older students sleep until their body clocks wake them. ___, however, only works if phones are managed." Which fits?',
              options: ['This trend', 'The former', 'Such a change', 'These students'], answer: 2,
              hint: 'Ask what kind of thing "a later start" is, and whether two things were named before it.',
              why: 'The sentence is about the proposal, so the summarising noun must name a proposal: "such a change". A later start is not a trend, "the former" needs a pair, and "these students" would make the students the thing that "only works", which is not the meaning.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm07s2', name: 'Linker Detox', cefr: 'B2',
          theory: {
            key: 'Not every sentence needs Firstly, Moreover, In addition. A listed linker is a sign; a reference word is a link. Cut the sign, keep the link.',
            body: [
              '<p>The Band 6 descriptor says cohesion may be <em>"mechanical due to misuse, overuse or omission"</em>, and the classic overuse is the numbered paragraph: <em>Firstly… Secondly… Moreover… In addition… Finally…</em> Each of those words tells the reader that another sentence is coming, which the reader can already see. None of them says how the new sentence relates to the last. Worse, they hide a Task Response fault: a paragraph of five numbered claims is a list of five ideas, none developed, when the descriptor wants one idea <em>"extended and supported"</em>. A Band 8 body paragraph usually has one visible linker or none.</p>',
              '<p>The detox has three steps. <strong>Delete</strong> every sentence-opening linker in the paragraph and read it again; most of the time nothing is lost, because the sentences already followed each other. <strong>Replace</strong> where a join is still needed, using the reference tools of the last sub-level: <em>this higher price</em>, <em>such a change</em>, <em>doing so</em>. <strong>Rejoin</strong> where two short sentences were really one idea: <em>"A tax raises the price. Moreover, people buy less."</em> becomes <em>"A tax raises the price, so people buy less."</em> The result reads as connected, and the connectors attract no attention, which is the Band 9 phrase.</p>',
              '<p>Some linkers are worth keeping because they carry meaning. <em>However</em> and <em>although</em> signal the nuance; <em>for example</em> signals the example; <em>so</em>, <em>because</em> and <em>which in turn</em> build the mechanism. The ones to cut are the counters and adders: <em>firstly, secondly, thirdly, moreover, furthermore, in addition, additionally, also, besides</em>. Watch especially for the <strong>wrong signal</strong>: <em>"A job puts a teenager in front of customers. Moreover, these customers do not accept excuses."</em> The second sentence explains the first; it does not add to it, so <em>moreover</em> tells the reader the wrong thing. Delete it; <em>these customers</em> already joins the sentences.</p>',
              '<p>The pre-flight check in this app counts the sentences that begin with a listed linker and turns amber above thirty per cent and red above half. That is a proxy for the real test, which is the reader\'s: cover the linkers with your thumb and see whether the paragraph still flows. If it does, the cohesion was in the sentences all along and the linkers were decoration. If it falls apart, the sentences were never connected, and the fix is progression (the next sub-level), not another <em>moreover</em>.</p>'
            ],
            simple: [
              '<p>"Firstly, Secondly, Moreover, In addition" tell the reader that another sentence is coming. The reader can see that. They do not say how the sentences connect.</p>',
              '<p>Detox: delete the linker; if the join is still needed, use a reference word ("this higher price", "doing so"); or join two short sentences with "so" or "which in turn".</p>',
              '<p>Keep the linkers that carry meaning: "however", "although", "for example", "because". Cut the counters and adders. One visible linker per paragraph is plenty.</p>'
            ],
            examples: [
              { s: '<s>Firstly, a tax raises the price of fast food. Moreover, people buy less of it. In addition, their diet improves.</s>', g: 'Three announcements, no joins. The sentences are a chain, but the linkers hide it.' },
              { s: 'A tax raises the price of fast food, and this higher price means that people buy less of it, so their diet slowly improves.', g: 'Detoxed: the reference ("this higher price") and "so" carry the chain. No linker attracts attention.' },
              { s: '<s>A weekend job puts a teenager in front of real customers. Moreover, these customers do not accept excuses.</s>', g: 'The wrong signal: the second sentence explains, it does not add. "These customers" already joins them; "moreover" should go.' },
              { s: 'A camera raises the chance that an offender is identified. This higher risk makes theft less worth trying.', g: 'The link is a noun that summarises the last sentence. Nothing to cut.' }
            ]
          },
          items: [
            { id: 'm07s2q1', type: 'spot', tag: 'cc-linker-overuse', level: 'B1', prompt: 'p-teen-jobs',
              stem: 'Tap the linker that gives the wrong signal: the sentence explains, it does not add.',
              words: ['A weekend job', 'puts a teenager', 'in front of real customers.', 'Moreover,', 'these customers do not accept excuses,', 'so the student learns', 'to arrive on time.'], answer: 3,
              fix: 'Delete it: "these customers" already links back.',
              why: '"Moreover" announces an addition, but the sentence that follows explains the one before: customers → no excuses → punctuality. The reference phrase "these customers" was already doing the joining. A linker that sends the wrong signal is the "misuse" the descriptor names.' },
            { id: 'm07s2q2', type: 'choose', tag: 'cc-reference', level: 'B2', prompt: 'p-cctv-everywhere',
              stem: '"A camera raises the chance that an offender is identified. ___ makes theft less worth trying." Which link is natural?',
              options: ['Moreover, this', 'This higher risk', 'Secondly, it', 'In addition, a camera'], answer: 1,
              why: 'A summarising noun ("this higher risk") names what the last sentence established and carries it forward; the reader feels no join at all. "Moreover" and "in addition" claim an addition where there is a consequence, and "Secondly, it" counts and then points at nothing clear.' },
            { id: 'm07s2q3', type: 'judge', tag: 'cc-progression', level: 'B2', prompt: 'p-remote-work',
              given: 'Firstly, remote work saves travel time. Secondly, it cuts office costs. Thirdly, it raises efficiency.',
              stem: 'Does this show the "clear progression" that Band 7 Coherence asks for?', answer: 1,
              hint: 'Try to say how the second sentence grows out of the first, and the third out of the second.',
              why: 'False. Three numbered claims stand side by side; none grows out of the last, and none is developed. Progression means the end of one sentence becomes the start of the next: saved travel time gives staff back energy, which shows in their output. Counting is not connecting.' },
            { id: 'm07s2q4', type: 'rewrite', tag: 'cc-linker-overuse', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Detox this opener: no listed linkers. Join the three sentences with a reference word or "so".',
              given: 'Firstly, a tax on fast food raises its price. Moreover, this means that people buy less of it. In addition, their diet improves.',
              must: [['this', 'these', 'such', 'doing so', 'the former', 'the latter']], ban: ['firstly', 'secondly', 'thirdly', 'moreover', 'furthermore', 'in addition'],
              minWords: 12, maxWords: 40, praise: 'The chain shows; the linkers are gone.',
              _good: 'A tax on fast food raises its price, and this higher price means that people buy less of it, so their diet slowly improves.',
              _bad: 'Firstly, a tax on fast food raises its price. In addition, this means that people buy less of it, so their diet improves.',
              why: 'The three sentences were already a chain: price → purchases → diet. A reference ("this higher price") and "so" let the reader follow it; "firstly" and "in addition" only announced that more sentences were coming.' },
            { id: 'm07s2q5', type: 'rewrite', tag: 'cc-linker-overuse', level: 'C1', prompt: 'p-cctv-everywhere',
              stem: 'Detox this paragraph opener: no listed linkers, and point back with a reference word at least once.',
              given: 'Firstly, cameras make people feel safer in stations. Secondly, they provide evidence after a crime. Furthermore, this evidence can be used in court.',
              must: [['this', 'these', 'such', 'doing so', 'the former', 'the latter']], ban: ['firstly', 'secondly', 'thirdly', 'moreover', 'furthermore', 'in addition'],
              minWords: 12, maxWords: 45, praise: 'Connected, and no connector attracts attention.',
              _good: 'Cameras make people feel safer in stations, and when a crime does occur, the recordings provide evidence; such footage can then be used in court.',
              _bad: 'Cameras make people feel safer in stations. Secondly, they provide evidence after a crime, and this evidence can be used in court.',
              why: 'Two ideas, one sentence each, joined by what they share: the recording. "Such footage" points back at the evidence without repeating it, and the counters disappear. Cohesion that the examiner does not notice is the Band 8 kind.' },
            { id: 'm07s2q6', type: 'choose', tag: 'cc-linker-overuse', level: 'B2', prompt: 'p-teen-sleep',
              stem: 'Which paragraph opening is joined by meaning, not by counting words or by repetition?',
              options: ['Firstly, a later start helps teenagers. Secondly, it cuts tiredness. Thirdly, it raises their marks.', 'Moreover, a later start helps teenagers to rest. In addition, they sleep for longer. Furthermore, they concentrate far better.', 'A later start helps teenagers. A later start lets teenagers sleep. A later start raises marks.', 'A later start lets teenagers sleep until their body clocks wake them; that extra hour shows in class.'], answer: 3,
              why: 'The last option chains: the start → sleep → that extra hour → class, with a reference phrase as the only join. The first two count and add, and the third repeats the full noun phrase three times, which is the fault reference words exist to fix.' },
            { id: 'm07s2q7', type: 'select', tag: 'cc-linker-overuse', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Tick the three sentences that link back by reference rather than by a listed linker.',
              options: ['Moreover, a tax on fast food raises its price.', 'This higher price pushes shoppers towards cheaper, healthier options.', 'In addition, healthy food should be made cheaper.', 'Such a change only works when a cheap, healthy option exists nearby.', 'Furthermore, people should be free to choose what they eat.', 'Doing so protects choice while removing the worst ingredients.'], answers: [1, 3, 5], k: 3,
              hint: 'A reference phrase cannot be understood without the sentence before it; a counter or adder can.',
              why: '"This higher price", "such a change" and "doing so" each carry the last sentence into this one. "Moreover", "in addition" and "furthermore" announce a new sentence and connect nothing; a paragraph built on them reads as mechanical.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm07s3', name: 'Known to new', cefr: 'B2',
          theory: {
            key: 'End a sentence with the information the next one is about. Known first, new last; the new becomes the next sentence\'s known.',
            body: [
              '<p>Band 8 Coherence says <em>"the message can be followed with ease"</em>. What makes a paragraph easy to follow is not the linkers but the order of information inside each sentence. Readers expect a sentence to begin with something they already know and end with something new. If the next sentence then begins with that new thing, the reader is handed along a chain and never has to stop. <em>"Sealed soil sends every drop into drains built for a smaller city. Those drains overflow within minutes, and the water backs up into the streets."</em> Drains ends one sentence and opens the next; streets ends the second and can open the third.</p>',
              '<p>The four-move paragraph is already a chain if you let it be. The facet ends with the thing the mechanism will explain; the mechanism ends with the result the example will show; the example ends with the case the nuance will limit. <em>"…the independence that a part-time job builds. This independence comes from real deadlines. Deadlines set by an employer cannot be moved, so the student learns to plan…"</em> Each sentence picks up the last word of the one before. When a sentence starts with information from nowhere, the reader stops, and a paragraph of such sentences is a list, however many linkers it wears.</p>',
              '<p>Most repairs are a matter of word order, not new words. If the known information is at the end of your sentence, move it to the front: <em>"Within minutes a much smaller city\'s drains overflow"</em> puts the new fact first and the known drains last, so the reader meets the surprise before the anchor; <em>"The drains, built for a much smaller city, overflow within minutes"</em> anchors first and surprises last. Passive voice, cleft sentences and reference nouns are all tools for this one job: getting the known thing to the front. That is why the Band 8 structural swaps and the reference words of this module serve the same purpose.</p>',
              '<p>The chain also polices the paragraph. If a sentence cannot be attached to the end of the one before, it is either out of order or it belongs somewhere else. <em>"Staff also lose the chance to learn from colleagues"</em> inside a paragraph about the efficiency of home working is not a nuance of efficiency; it is Facet B, and it needs its own paragraph. One central idea per paragraph is the Band 7 requirement, and a blank line between paragraphs is how the examiner sees it. The exercises here shuffle real body paragraphs: only one order chains, and finding it is the same skill as writing it.</p>'
            ],
            simple: [
              '<p>Start a sentence with what the reader already knows; end it with what is new. Then start the next sentence with that new thing. The reader is handed along a chain.</p>',
              '<p>Facet → mechanism → example → nuance is a chain if each sentence picks up the end of the last one. If a sentence starts with something from nowhere, move it or cut it.</p>',
              '<p>Fix by word order: put the known thing first. "The drains, built for a smaller city, overflow within minutes." If a sentence cannot attach to the chain, it may belong in another paragraph.</p>'
            ],
            examples: [
              { s: 'Sealed soil sends every drop straight into <strong>drains</strong> built for a much smaller city. <strong>Those drains</strong> overflow within minutes, and the water backs up into the <strong>streets</strong>.', g: 'Drains ends the first sentence and opens the second; streets is ready to open the third.' },
              { s: '<s>Sealed soil sends every drop straight into drains built for a smaller city. Within minutes a much smaller city\'s drains overflow.</s>', g: 'Same facts, wrong order: the new fact comes first and the known drains last, so the reader stops.' },
              { s: 'A weekend job puts a teenager in front of real <strong>customers</strong>. <strong>Real customers</strong> do not accept excuses, so the student learns to arrive on time.', g: 'The object of one sentence becomes the subject of the next. No linker needed.' },
              { s: '<s>Working from home gives staff back two hours a day. Staff also lose the chance to learn from colleagues.</s>', g: 'The second sentence is not a limit of the first; it is the other facet, and it belongs in Body B.' }
            ]
          },
          items: [
            { id: 'm07s3q1', type: 'order', tag: 'cc-progression', level: 'B2', prompt: 'p-cars-city',
              stem: 'Restore the chain: each sentence begins with what the one before it ended on.',
              items: ['The strongest argument for a ban is the pollution that city traffic pumps into the air of the centre every day.', 'That air is breathed by the people who live, work and study there, so keeping cars out lowers the fumes that reach their lungs.', 'Such a ban already operates in several central districts, where petrol and diesel engines are no longer allowed.', 'However, these districts also show the limit of the policy: workers with no bus or train service are simply left behind.'],
              why: 'Pollution in the air → that air → keeping cars out → such a ban → central districts → these districts. Facet, mechanism, example, nuance, and every join is a reference to the sentence before. That is what "followed with ease" looks like.' },
            { id: 'm07s3q2', type: 'choose', tag: 'cc-progression', level: 'B2', prompt: 'p-city-flooding',
              stem: '"Sealed soil sends every drop straight into drains built for a much smaller city." Which sentence should come next?',
              options: ['Those drains overflow within minutes, and the water backs up into the streets.', 'The low-lying districts of Bangkok built on former rice fields flood after a single afternoon storm.', 'Concrete and asphalt now cover land that once soaked up the rain.', 'Unfortunately, that land cannot easily be turned back into fields.'], answer: 0,
              why: 'The sentence ended on the drains, so the next one should begin with them. The Bangkok example jumps ahead of the mechanism, the concrete sentence goes back to information the reader already has, and the nuance about fields arrives before there is anything to limit.' },
            { id: 'm07s3q3', type: 'spot', tag: 'cc-one-idea', level: 'B2', prompt: 'p-remote-work',
              stem: 'Tap the chunk that starts a second idea and belongs in another paragraph.',
              words: ['Working from home removes the daily journey,', 'which gives staff back two hours a day;', 'this time shows in their energy and output.', 'Firms in Bangkok that allow three home days', 'have moved into smaller offices.', 'Staff also lose the chance to learn from colleagues, which weakens teamwork.'], answer: 5,
              fix: 'Move it to Body B: it is Facet B, not a limit of Facet A.',
              why: 'Up to the smaller offices, every chunk chains from the last: journey → time → output → firms. Lost contact with colleagues does not limit the efficiency argument; it is the other side\'s facet. One central idea per paragraph is the Band 7 requirement, so a second facet is a second paragraph.' },
            { id: 'm07s3q4', type: 'order', tag: 'cc-progression', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Restore the chain of this body paragraph.',
              items: ['The first reason is the independence that a part-time job builds in a student.', 'This independence comes from being trusted with real money and real deadlines.', 'Deadlines set by an employer cannot be moved, so the student learns to plan the week around them.', 'That planning is visible in Thailand, where students with Saturday shifts in a family shop soon manage their own homework timetable.', 'Admittedly, such shifts can leave a student too tired to study, which is why the hours must be limited.'],
              why: 'Independence → this independence → deadlines → deadlines → planning → that planning → shifts → such shifts. Each sentence opens with the end of the last one, so the paragraph can be followed without a single counting linker.' },
            { id: 'm07s3q5', type: 'choose', tag: 'cc-progression', level: 'C1', prompt: 'p-city-flooding',
              stem: '"Sealed soil sends the rain straight into the drains." Which next sentence starts with the known information and ends with something new?',
              options: ['Within minutes a much smaller city\'s drains overflow into the streets.', 'Overflowing is what the drains, built for a smaller city, soon do.', 'The drains, built for a much smaller city, overflow within minutes.', 'A much smaller city is what the drains were built for, so they overflow.'], answer: 2,
              why: 'The drains are known, so they go first; the overflow is new, so it goes last. The first option opens with the surprise and buries the anchor, and the other two use awkward clefts that put the new fact at the front. Word order, not new words, is the repair.' },
            { id: 'm07s3q6', type: 'choose', tag: 'cc-paragraphing', level: 'B2',
              stem: 'A body paragraph gives Facet A, its mechanism and its example, then continues "Another benefit is…". What should the writer do?',
              options: ['Start a new paragraph: a second facet is a second paragraph.', 'Add "Moreover" so that the reader sees a second point is coming.', 'Delete the second benefit and write the nuance of the first instead.', 'Move the second benefit into the conclusion as a final supporting point.'], answer: 0,
              hint: 'Remember what Band 7 Coherence says about the central topic of each paragraph.',
              why: 'One central idea per paragraph is the Band 7 requirement. A second benefit is Facet B, and it needs its own paragraph with its own mechanism, example and nuance. A linker would only label the fault, and the conclusion may not introduce anything the body did not develop.' },
            { id: 'm07s3q7', type: 'order', tag: 'cc-progression', level: 'C1', prompt: 'p-elderly-care',
              stem: 'Restore the chain of this Body B paragraph.',
              items: ['Set against this is the view that care for an older relative belongs entirely to the family.', 'Supporters of this view point to the closeness that only a daughter or son can give: a familiar voice, a shared history.', 'That closeness is visible in the many Thai households where three generations still share a home.', 'Yet the same households show the cost: an adult child who works full-time and gives daily care is soon exhausted.'],
              why: 'The view → this view → closeness → that closeness → households → the same households. The paragraph opens with a reference to Body A ("set against this") and every later sentence picks up the end of the one before, including the nuance.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm07ck', name: 'Systems Check', items: [
        { id: 'm07ckq1', type: 'choose', tag: 'cc-reference', level: 'B1', prompt: 'p-school-snacks',
          stem: '"Some schools have stopped selling sugary drinks. ___ has changed what students reach for at break." Which fits?',
          options: ['This trend', 'Such a ban', 'The former', 'These students'], answer: 1,
          hint: 'What kind of thing did the first sentence describe: a decision, a trend, or a group of people?',
          why: 'The sentence is about the decision to stop selling, so the summarising noun must name a decision: "such a ban". A school policy is not a trend, "the former" needs two things named, and the students are the people affected, not the thing that changed their choices.' },
        { id: 'm07ckq2', type: 'spot', tag: 'cc-linker-overuse', level: 'B2', prompt: 'p-tourism',
          stem: 'Tap the linker that adds nothing, because the join is already made.',
          words: ['Foreign visitors spend money', 'in local shops and hotels,', 'and this spending', 'raises local incomes.', 'Furthermore,', 'these incomes pay for roads', 'through tax.'], answer: 4,
          fix: 'Delete it: "these incomes" already links back.',
          why: 'The chain is spending → incomes → tax → roads, and "these incomes" carries the reader across the join. "Furthermore" announces an addition that is really a consequence, and it is the kind of overuse the Band 6 descriptor calls mechanical.' },
        { id: 'm07ckq3', type: 'rewrite', tag: 'cc-linker-overuse', level: 'B2', prompt: 'p-private-tutoring',
          stem: 'Detox this opener: no listed linkers, at least one reference word.',
          given: 'Firstly, tutoring centres let students repeat the lessons they did not understand at school. Secondly, this extra practice raises their exam results. Moreover, parents feel reassured.',
          must: [['this', 'these', 'such', 'doing so', 'the former', 'the latter']], ban: ['firstly', 'secondly', 'thirdly', 'moreover', 'furthermore', 'in addition'],
          minWords: 12, maxWords: 45, praise: 'One chain, no counters.',
          _good: 'Tutoring centres let students repeat the lessons they did not understand at school, and this extra practice raises their exam results, which in turn reassures parents.',
          _bad: 'Firstly, tutoring centres let students repeat lessons they did not understand. In addition, this extra practice raises exam results and reassures parents.',
          why: 'Repeated lessons → this extra practice → results → parents: one chain, held together by a reference phrase and "which in turn". The counting linkers were never joining anything; they only announced that another sentence was coming.' },
        { id: 'm07ckq4', type: 'order', tag: 'cc-progression', level: 'B2', prompt: 'p-libraries',
          stem: 'Restore the chain of this body paragraph.',
          items: ['The case against libraries rests on the idea that a building is unnecessary once information is online.', 'Online information, however, is only useful to people who have a device, a connection and the skill to search well.', 'Those three things are exactly what a library branch provides free of charge, with trained staff to help.', 'Such help is why the branches in poorer districts of Bangkok are still full after school every afternoon.'],
          why: 'Online → online information → three things → those three things → staff to help → such help. Each sentence opens with the end of the one before, so the argument can be followed without a counting linker anywhere.' },
        { id: 'm07ckq5', type: 'judge', tag: 'cc-one-idea', level: 'B2', prompt: 'p-teen-sleep',
          given: 'One benefit of a later start is more sleep, which improves concentration; a second benefit is that buses are less crowded at nine.',
          stem: 'Is this acceptable inside one body paragraph?', answer: 1,
          hint: 'Count the ideas in the sentence, then ask how much development each one gets.',
          why: 'False. Two benefits are two facets, and the second has no mechanism, example or nuance behind it. Band 7 Coherence asks for "a clear central topic within each paragraph": develop the sleep idea fully here, and give the buses their own paragraph or leave them out.' },
        { id: 'm07ckq6', type: 'select', tag: 'cc-reference', level: 'B2',
          stem: 'Tick the three phrases that stand for a thing or an action named in the sentence before.',
          options: ['this policy', 'in conclusion', 'doing so', 'on the other hand', 'the latter', 'firstly', 'nevertheless'], answers: [0, 2, 4], k: 3,
          hint: 'A reference phrase means nothing on its own; try reading each phrase with no sentence before it.',
          why: '"This policy", "doing so" and "the latter" cannot be understood without the sentence before them, which is what makes them cohesive. The other four are signposts: they tell the reader where the essay is going without carrying any meaning across the join.' },
        { id: 'm07ckq7', type: 'choose', tag: 'cc-progression', level: 'B2', prompt: 'p-space',
          stem: '"Research for satellites has given us weather forecasting and GPS." Which sentence continues the chain?',
          options: ['These two tools now guide farmers, pilots and delivery drivers every day.', 'Hospitals, housing and clean water deserve the money far more.', 'Space missions bring national pride to the country that succeeds in launching them.', 'Governments spend large sums on space research every year.'], answer: 0,
          why: 'The sentence ended on two tools, so the next one picks them up with "these two tools" and adds something new. The hospitals sentence belongs to the other side, national pride is a different facet, and the spending sentence goes back to what the reader already knows.' },
        { id: 'm07ckq8', type: 'choose', tag: 'cc-paragraphing', level: 'C1',
          stem: 'An essay is one block of text: introduction, both facets and conclusion with no blank lines. What does the examiner see?',
          options: ['A Band 7 essay, since paragraphing is not part of the descriptors.', 'Cohesion that is mechanical, because far too many linking words were used.', 'No clear central topic per paragraph, which holds Coherence at Band 6.', 'A Task Response problem, because the position is hard to find.'], answer: 2,
          hint: 'Paragraphing belongs to one of the four criteria: which one, and what does its Band 7 line ask for?',
          why: 'Band 7 Coherence requires "a clear central topic within each paragraph", and without paragraphs there is nothing to show it. Paragraphing is the visible half of planning: four blocks with a blank line between them, one idea in each.' }
      ] }
    }]
  });
})();
