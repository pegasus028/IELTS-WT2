/* POSITION CONTROL — topic-03.js · Module 03 Matrix I — Core Topic and Facets */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm03', n: 3, code: 'Module 03', name: 'Matrix I — Core Topic and Facets', art: 'grid', cefr: 'B1–C1',
    blurb: 'The first three decisions of the matrix: the issue as a noun phrase, and the two aspects that will each carry a body paragraph.',
    levels: [{
      id: 'm03l1', n: 1, name: 'Core Topic and Facets', cefr: 'B1–C1', blurb: 'Nominalise the issue, choose two facets that are neither too broad nor too narrow, and use a lens to find them fast.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm03s1', name: 'The Core Topic is a noun phrase', cefr: 'B1',
          theory: {
            key: 'The Core Topic is the whole issue in one noun phrase: "the regulation of private cars in city centres", not "banning cars" and not "whether cars should be banned".',
            body: [
              '<p>The Core Topic is the first of the eleven variables and the one every other variable hangs from. It names the issue the prompt is about, in a form the essay can refer back to: it opens the introduction (<em>"People often discuss the topic of…"</em>), it returns in the conclusion (<em>"reducing … to a single consequence"</em>), and every body paragraph connects to it in its first sentence. That last job is why it matters for Task Response: a paragraph that cannot be tied back to the Core Topic is the beginning of an off-topic essay.</p>',
              '<p>It must be a <strong>noun phrase</strong>, not a verb and not a clause. The prompt gives you verbs: <em>ban</em>, <em>fund</em>, <em>restrict</em>, <em>replace</em>. Turn the verb into its noun and add <em>of</em> and the setting: <em>the banning of private cars from city centres</em>, <em>the funding of university degrees by the state</em>, <em>the replacement of printed textbooks with tablets in secondary schools</em>. A clause such as <em>"whether governments should ban cars"</em> is grammatical, but it does not slot into the frames and it reads like the prompt copied out. Dense noun phrases are also the grammar the Band 8 descriptor rewards, so the Core Topic is the first piece of Band 8 grammar in the essay.</p>',
              '<p>It must cover <strong>both views and nothing more</strong>. <em>"Banning cars"</em> is view A alone: it leaves the freedom to drive with nowhere to sit, and half the prompt goes unanswered. <em>"The removal of all fossil fuel use from the world economy"</em> covers both views and a hundred other debates besides; an essay built on it drifts off the prompt within a paragraph. Test the phrase both ways: does view A fit inside it? Does view B? Does anything else fit that the prompt never mentioned? The right size is usually eight to fifteen words.</p>',
              '<p>Build it in thirty seconds. Underline the two or three key nouns of the prompt. Choose the noun for the action: <em>regulation, provision, replacement, participation, funding</em>. Add <em>of</em>, the thing, and the setting. Then choose words you control: <em>control</em> is safer than <em>curtailment</em>, <em>access</em> is not <em>admission</em>, and a rare word used slightly wrongly lowers the Lexical Resource mark instead of raising it. Precision beats display, here and everywhere in the essay.</p>'
            ],
            simple: [
              '<p>The Core Topic is the whole issue in one noun phrase. Verb → noun: ban → the banning of; fund → the funding of; replace → the replacement of.</p>',
              '<p>Not one side only ("banning cars" is view A). Not too big ("all fossil fuel in the world"). Both views must fit inside it, and nothing else.</p>',
              '<p>Use the key nouns of the prompt and words you are sure of. "Control" is better than a rare word you are not sure of.</p>'
            ],
            examples: [
              { s: 'Government control over the use of privately owned cars in city centres.', g: 'Noun phrase; both views fit (the ban and the freedom to drive); nothing else does.' },
              { s: '<s>Banning cars from city centres.</s>', g: 'View A only. The freedom to drive has nowhere to sit.' },
              { s: '<s>Whether governments should ban private cars in city centres.</s>', g: 'A clause. It reads like the prompt and does not slot into the frames.' },
              { s: 'The participation of secondary school students in part-time employment.', g: 'From "students should gain work experience": the verb has become a noun, and the setting is named.' }
            ]
          },
          items: [
            { id: 'm03s1q1', type: 'choose', tag: 'lr-nominal', level: 'B1', prompt: 'p-cars-city',
              stem: 'Which noun phrase is the Core Topic of this prompt?',
              options: ['Government control over the use of privately owned cars in city centres.', 'The removal of all fossil fuel use from the whole world economy.', 'The comparison between public transport and the privately owned motor car.', 'The redesign of crowded cities to remove their daily traffic jams.'], answer: 0,
              hint: 'Test each phrase two ways: do both views of the prompt fit inside it, and does anything the prompt never mentions fit too?',
              why: 'Both views fit inside the first phrase: the ban and the right to drive. Fossil fuel across the world economy is far too broad; the comparison with public transport and the redesign of cities are neighbouring debates the prompt never raises.' },
            { id: 'm03s1q2', type: 'sort', tag: 'lr-nominal', level: 'B1',
              stem: 'Sort: a noun phrase that could be a Core Topic, or a clause that still needs rewriting?',
              bins: [{ key: 'np', label: 'Noun phrase', hint: 'the + noun + of …' }, { key: 'cl', label: 'Clause', hint: 'has a subject and a verb' }],
              items: [
                { text: 'The regulation of children\'s screen time by their parents', bin: 'np' },
                { text: 'Parents should limit how long their children use screens', bin: 'cl' },
                { text: 'The public funding of arts degrees at university', bin: 'np' },
                { text: 'Whether governments should fund only science degrees', bin: 'cl' },
                { text: 'The participation of school students in part-time work', bin: 'np' },
                { text: 'Students work part-time while they are still at school', bin: 'cl' }
              ],
              why: 'A noun phrase has no main verb: the regulation of, the funding of, the participation of. "Should limit", "should fund" and "work" are verbs, so those lines are clauses, and "whether" is the sign of a question copied from the prompt.' },
            { id: 'm03s1q3', type: 'choose', tag: 'lr-nominal', level: 'B1', prompt: 'p-science-funding',
              stem: 'Which noun phrase best turns this prompt into a Core Topic?',
              options: ['Whether governments should fund only science degrees', 'The way the state divides its funding between university subjects', 'Funding only science degrees at university', 'The total amount of money that governments spend on their education systems'], answer: 1,
              hint: 'Two tests: is it a phrase with no main verb, and do both views of the prompt fit inside it?',
              why: 'The second phrase is a noun phrase and both views fit inside it: science only, or the arts as well. "Whether…" is a clause; "funding only science degrees" is view A alone; the total education budget is a different, much larger question.' },
            { id: 'm03s1q4', type: 'rewrite', tag: 'lr-nominal', level: 'B2', prompt: 'p-cars-city',
              stem: 'Rewrite this sentence as a Core Topic: one noun phrase, no verb clause, no "should".',
              given: 'Governments should ban private cars from city centres to reduce pollution.',
              must: [['banning', 'ban', 'regulation', 'control', 'restriction', 'removal', 'exclusion', 'prohibition'], ['car', 'cars', 'vehicle', 'vehicles', 'traffic', 'motoring']],
              ban: ['should'], noClause: true, minWords: 5, maxWords: 16,
              praise: 'A noun phrase the whole essay can refer back to.',
              _good: 'The banning of private cars from city centres to cut pollution.',
              _bad: 'Governments should ban cars because they cause pollution.',
              why: 'Verb to noun: ban → the banning of (or the regulation of, the restriction of). Drop "should" and "because", keep the thing and the setting, and the sentence becomes a phrase that slots into every frame.' },
            { id: 'm03s1q5', type: 'judge', tag: 'tr-partial', level: 'B2', prompt: 'p-prisons',
              given: 'Core Topic: "The basic purpose that the modern prison system is meant to serve."',
              stem: 'Is this a good Core Topic for this prompt?', answer: 0,
              hint: 'Check the shape (a phrase, not a clause) and the size: does each of the two views have a place inside it?',
              why: 'True. It is a noun phrase, and both views fit inside "purpose": punishment and reform. "The punishment of criminals in prison" would name view A only, and half a Core Topic leads to half an answer.' },
            { id: 'm03s1q6', type: 'choose', tag: 'lr-nominal', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Which is the Core Topic of this prompt?',
              options: ['The minimum wage paid to workers under the age of eighteen.', 'The balance between homework and free time in secondary school.', 'Part-time work for students who are still at secondary school.', 'The job prospects of young people who are entering the labour market.'], answer: 2,
              hint: 'Underline the key nouns of the prompt: who is it about, and at what stage of their lives?',
              why: 'The prompt is about students working while still at school. Job prospects after school is the near-miss: it sounds close, but it is about leavers, not students. Wages and homework are details that might appear inside a paragraph, not the issue itself.' },
            { id: 'm03s1q7', type: 'spot', tag: 'lr-precision', level: 'C1', prompt: 'p-screen-time',
              stem: 'Tap the word used imprecisely in this Core Topic.',
              words: ['The restriction', 'of children\'s', 'admission', 'to digital devices', 'by their parents.'], answer: 2,
              fix: 'access',
              why: '"Admission" is entry to a place or an institution (admission to university). The right to use something is "access". A rare word slightly wrong lowers the Lexical Resource mark; the plain word you control is the safer choice.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm03s2', name: 'Facet A and Facet B', cefr: 'B2',
          theory: {
            key: 'A facet is one major aspect of the issue, big enough to carry a whole body paragraph and small enough to be explained, shown and limited inside it.',
            body: [
              '<p>Facet A and Facet B are the topic sentences of the two body paragraphs. In a discuss-both-views essay each facet is the heart of one view: not the view restated (<em>"the view that cars should be banned"</em>) but the reason the view matters (<em>"the urgent need to reduce the pollution that city traffic creates"</em>). In an opinion essay the facets are your two reasons; in an outweigh essay they are the main advantage and the main disadvantage; in a problem / solution essay they are the cause and the solution that answers it. In every case a facet is an <strong>aspect</strong>: a noun phrase that says what part of the issue this paragraph is about.</p>',
              '<p>A facet is <strong>not an example and not a mechanism</strong>. Ask two questions of the phrase. <em>How does it work?</em> If the answer is already in the phrase (<em>"cutting the exhaust fumes people breathe in crowded districts"</em>), that is the mechanism, which comes second in the paragraph. <em>Where can I see it?</em> If the phrase is already a place or a policy (<em>"the ban on petrol engines in one Bangkok district"</em>), that is the example, which comes third. The facet is the claim above them both, the thing the mechanism explains and the example shows.</p>',
              '<p>A facet can be the wrong size. <strong>Too broad</strong>: <em>"the removal of every source of pollution from all cities"</em> is an absolute, and an absolute cannot be developed honestly; the nuance sentence would have to contradict it. Band 7 Task Response is capped by <em>"a tendency to over-generalise"</em>, and over-generalisation usually starts here. <strong>Too narrow</strong>: <em>"the building of wider roads to ease congestion"</em> is a detail from a different debate, and a paragraph built on it answers a question nobody asked. The right size is a phrase you could explain, illustrate and limit in ninety words.</p>',
              '<p>Two more rules. The two facets must be <strong>distinct</strong>: a paragraph that opens with <em>"the pollution cars cause and the freedom people lose"</em> has two ideas, which is two paragraphs, and Coherence at Band 7 requires <em>"a clear central topic within each paragraph"</em>. And the two facets must <strong>cover what the prompt names</strong>: if the prompt sets money against culture and both your facets are about money, the second view is unanswered however good the paragraphs are. Precision helps at every step: <em>"the urgent need"</em> can be doubted and therefore developed; <em>"the complete removal"</em> cannot.</p>'
            ],
            simple: [
              '<p>A facet is the main idea of one body paragraph: one aspect of the issue, as a noun phrase. Facet A for view A, Facet B for view B.</p>',
              '<p>Not the mechanism (how it works) and not the example (where you see it). Those come after the facet, inside the paragraph.</p>',
              '<p>Not too big ("every source of pollution in all cities") and not too small ("wider roads"). Two different facets, one per paragraph, covering both views the prompt names.</p>'
            ],
            examples: [
              { s: 'Facet A: the urgent need to reduce the pollution that city traffic creates.', g: 'One aspect of view A. It can be explained, shown and limited in ninety words.' },
              { s: '<s>Facet A: cutting the exhaust fumes that people breathe in crowded city districts.</s>', g: 'That is how the facet works: the mechanism, not the facet.' },
              { s: '<s>Facet A: the removal of every single source of pollution from all cities.</s>', g: 'Too broad. An absolute claim that no nuance sentence could survive.' },
              { s: '<s>One important part of this issue is the pollution cars cause and the freedom people lose.</s>', g: 'Two facets in one topic sentence. Two ideas, two paragraphs.' }
            ]
          },
          items: [
            { id: 'm03s2q1', type: 'choose', tag: 'tr-partial', level: 'B2', prompt: 'p-cars-city',
              stem: 'Which phrase is Facet A, the heart of the first view (the ban)?',
              options: ['The building of wider main roads to ease the heavy congestion.', 'The urgent need to reduce the pollution that city traffic creates.', 'The removal of every single source of pollution from all cities.', 'The creation of safer routes for people who walk or cycle.'], answer: 1,
              why: 'The first view wants a ban to cut pollution, so Facet A is the need to reduce that pollution. "Every source from all cities" is the same idea made absolute, which is too broad to develop; roads and cycle routes belong to other debates.' },
            { id: 'm03s2q2', type: 'sort', tag: 'cc-one-idea', level: 'B2', prompt: 'p-tourism',
              stem: 'Sort these parts of a tourism essay: facet, mechanism or example?',
              bins: [{ key: 'f', label: 'Facet', hint: 'the aspect' }, { key: 'm', label: 'Mechanism', hint: 'how it works' }, { key: 'e', label: 'Example', hint: 'where you see it' }],
              items: [
                { text: 'The new money that foreign visitors bring into the local economy', bin: 'f' },
                { text: 'bringing outside money into local businesses and paying for roads and schools', bin: 'm' },
                { text: 'Coastal towns paying for clinics and schools with a small tourist tax', bin: 'e' },
                { text: 'The damage that visitors do to local traditions and fragile natural places', bin: 'f' },
                { text: 'turning real traditions into shows for sale and using up scarce water and land', bin: 'm' },
                { text: 'Dying coral reefs and old quarters turned into rows of souvenir shops', bin: 'e' }
              ],
              why: 'The facet is the aspect ("the new money", "the damage"). The mechanism says how it works, usually with an -ing verb. The example is something you could point at: a town, a reef, a street of shops.' },
            { id: 'm03s2q3', type: 'judge', tag: 'tr-off-topic', level: 'B2', prompt: 'p-prisons',
              given: 'Facet B: "The prevention of crime through investment in the poorest communities."',
              stem: 'Is this a good Facet B for the second view, reform?', answer: 1,
              hint: 'Ask where this idea takes place: inside the prison system the prompt is about, or somewhere else?',
              why: 'False. It is a real idea, but it belongs to a different debate: preventing crime before it happens. The second view is about reforming people who have already offended, so Facet B must stay inside the prison: rehabilitation and changing how offenders think.' },
            { id: 'm03s2q4', type: 'choose', tag: 'cc-one-idea', level: 'B2', prompt: 'p-cars-city',
              stem: 'A body paragraph opens: "One important part is the pollution cars cause and the freedom people lose." What is the fault?',
              options: ['The facet names an example rather than an aspect', 'The facet is too narrow to fill ninety words', 'Two facets in one paragraph, one from each view', 'The facet is off the topic of the prompt'], answer: 2,
              hint: 'Look at the word "and" in the topic sentence, and ask which view each half of the sentence belongs to.',
              why: 'Pollution is view A; freedom is view B. Putting both in one topic sentence gives the paragraph two central ideas, and Band 7 Coherence asks for "a clear central topic within each paragraph". Split them: one facet, one paragraph.' },
            { id: 'm03s2q5', type: 'select', tag: 'tr-partial', level: 'B2', prompt: 'p-online-learning',
              stem: 'Tick the two facets: one main advantage and one main disadvantage of online lessons.',
              options: ['The freedom to learn from any place and at any speed', 'removing the daily journey so that lessons fit around the student\'s own pace', 'The loss of the social contact and discipline that a classroom provides', 'A student in Chiang Mai following a Bangkok lesson by video', 'The use of digital technology in every part of modern education', 'The novelty of learning from video rather than from a printed book'], answers: [0, 2], k: 2,
              why: 'A facet is an aspect big enough for a paragraph. "Removing the daily journey…" is a mechanism, the Chiang Mai student is an example, technology in all of education is far too broad, and novelty is too small to explain, show and limit.' },
            { id: 'm03s2q6', type: 'choose', tag: 'lr-precision', level: 'C1', prompt: 'p-tourism',
              stem: 'Which Facet B names the second view precisely: not too broad, not too narrow?',
              options: ['The worldwide decline of traditional ways of life throughout the modern era.', 'The strain that seasonal crowding places upon local municipal services and roads.', 'The dependence of host regions upon a single volatile industry.', 'The erosion of indigenous culture and the degradation of fragile ecosystems.'], answer: 3,
              why: 'The second view names culture and the environment, and the last phrase holds both at the right size. Traditional life "throughout the modern era" is too broad and no longer about tourism; crowded services is one narrow effect; dependence on one industry is an economic facet, not a cultural one.' },
            { id: 'm03s2q7', type: 'spot', tag: 'lr-precision', level: 'C1',
              stem: 'Tap the chunk that makes this facet too broad to develop honestly.',
              words: ['The urgent need', 'to remove', 'every single', 'source of pollution', 'from city centres.'], answer: 2,
              fix: 'the worst',
              why: '"Every single" makes the facet an absolute. No mechanism can explain it, no example can show it, and the nuance sentence would have to contradict it. "The worst source" is a claim the paragraph can actually support.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm03s3', name: 'The Lens method', cefr: 'B2',
          theory: {
            key: 'Ask the Core Topic one fixed question at a time: what does it cost? what does it do to people and communities? what does it do to bodies and minds? Each lens gives a different facet.',
            body: [
              '<p>Ideas come faster through a fixed lens than through free brainstorming, and the ideas that come are more precise. A lens is a question you put to the Core Topic. The <strong>economic lens</strong> asks about money, jobs, prices, revenue and who pays. The <strong>socio-cultural lens</strong> asks about families, communities, tradition, fairness and identity. The <strong>public-health lens</strong> asks about bodies and minds: sleep, diet, safety, stress, wellbeing. Two more are useful for some domains: the environmental lens (air, water, land, climate) and the political lens (freedom, regulation, the duty of the state).</p>',
              '<p>Put the lenses to one Core Topic. <em>Part-time work for students at secondary school.</em> Economic: the financial independence a wage gives a teenager. Socio-cultural: the responsibility and adult contact a workplace teaches. Public-health: the sleep lost by students who work late on school nights. Three legitimate facets from one issue, in under a minute, and each one arrives with its own vocabulary: <em>revenue, incentive, expenditure</em> from the first lens; <em>identity, community, tradition</em> from the second; <em>sedentary, wellbeing, fatigue</em> from the third. That vocabulary is the precise, domain-specific collocation that lifts Lexical Resource from 7 to 8.</p>',
              '<p>The lens changes the facet, never the Core Topic. An economic facet for the car-ban prompt might be the cost to shops in the centre when customers can no longer drive in; that is economic and it is inside the prompt. <em>"The profit of the national car manufacturing industry"</em> is also economic, and it is outside the prompt, which asked about city centres and the right to drive there. After every lens, check the facet against the Core Topic: does it still describe this issue in this setting? If not, the lens has led you off topic, however good the idea.</p>',
              '<p>Then choose. A discuss-both-views essay needs one facet for each view, so give each view the lens that makes it strongest: pollution is strongest through the public-health lens, freedom through the socio-cultural or political one. Use one lens per paragraph; a topic sentence that mixes the health cost and the economic cost is two ideas. Different students choose different lenses for the same prompt, and that is the point: two essays built from the same frames read as two different essays, and nothing in either reads as memorised.</p>'
            ],
            simple: [
              '<p>A lens is a question you ask the Core Topic. Economic: money, jobs, cost. Socio-cultural: families, communities, tradition, fairness. Public-health: bodies and minds.</p>',
              '<p>Each lens gives a different facet and its own vocabulary. Part-time work: money (economic), responsibility (socio-cultural), lost sleep (health).</p>',
              '<p>The lens must stay inside the prompt. One lens per paragraph. Choose the lens that makes each view strongest.</p>'
            ],
            examples: [
              { s: 'Economic lens on part-time work: the financial independence that a wage gives a teenager.', g: 'Money, earnings, independence: the economic kit.' },
              { s: 'Public-health lens on the same topic: the sleep lost by students who work late on school nights.', g: 'Same Core Topic, different facet, different vocabulary.' },
              { s: '<s>Economic lens on the car ban: the profit of the national car manufacturing industry.</s>', g: 'Economic, but outside the prompt, which is about city centres and the right to drive there.' },
              { s: '<s>Facet A: the pollution that city traffic creates and the cost to shops when customers cannot drive in.</s>', g: 'Two lenses in one topic sentence: health and economic. Two ideas.' }
            ]
          },
          items: [
            { id: 'm03s3q1', type: 'sort', tag: 'lr-precision', level: 'B2', prompt: 'p-teen-jobs',
              stem: 'Sort these facets about part-time work for students by the lens that produced them.',
              bins: [{ key: 'ec', label: 'Economic', hint: 'money, cost, earnings' }, { key: 'sc', label: 'Socio-cultural', hint: 'family, community, responsibility' }, { key: 'ph', label: 'Public-health', hint: 'bodies and minds' }],
              items: [
                { text: 'The financial independence that a wage gives a teenager', bin: 'ec' },
                { text: 'The saving to parents who no longer fund all of a student\'s spending', bin: 'ec' },
                { text: 'The responsibility and adult contact that a workplace teaches', bin: 'sc' },
                { text: 'The tension between paid work and a family\'s expectations of study', bin: 'sc' },
                { text: 'The sleep lost by students who work late on school nights', bin: 'ph' },
                { text: 'The strain of long shifts on a body that is still growing', bin: 'ph' }
              ],
              why: 'Wages and savings are the economic lens; responsibility and family expectations are the socio-cultural one; sleep and physical strain are public health. Each lens brings its own nouns, and those nouns are the paragraph\'s vocabulary.' },
            { id: 'm03s3q2', type: 'choose', tag: 'lr-precision', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Which facet comes from the public-health lens?',
              options: ['The extra cost that a tax adds to a low-income family\'s weekly shopping', 'The freedom of adults to choose what they eat', 'The income that the tax raises for the treasury', 'The fall in diet-related illness when sugary products cost more'], answer: 3,
              why: 'Illness and diet are the public-health kit. Shopping costs and treasury income are the economic lens, and the freedom to choose is the political one. All four are inside the prompt; only one answers the health question.' },
            { id: 'm03s3q3', type: 'sort', tag: 'tr-off-topic', level: 'C1', prompt: 'p-cars-city',
              stem: 'Same lens, different results. Sort these economic-lens facets for the car-ban prompt: inside the prompt, or outside it?',
              bins: [{ key: 'in', label: 'Inside the prompt', hint: 'city centres, cars, the right to drive' }, { key: 'out', label: 'Outside the prompt', hint: 'economic, but a different issue' }],
              items: [
                { text: 'The cost to shops in the centre when customers can no longer drive in', bin: 'in' },
                { text: 'The saving in health spending when city air becomes cleaner', bin: 'in' },
                { text: 'The profit of the national car manufacturing industry', bin: 'out' },
                { text: 'The price of petrol on world markets', bin: 'out' },
                { text: 'The fares commuters pay when they switch from cars to trains', bin: 'in' },
                { text: 'The cost of building new motorways between cities', bin: 'out' }
              ],
              why: 'The lens changes the facet, not the Core Topic. Shops in the centre, city air and commuter fares are about cars in city centres; car factories, world petrol prices and motorways between cities are economic, but they answer a different prompt.' },
            { id: 'm03s3q4', type: 'judge', tag: 'cc-one-idea', level: 'B2', prompt: 'p-cars-city',
              given: 'Facet A: "The pollution that city traffic creates and the cost to shops when customers cannot drive in."',
              stem: 'Does this facet need to be split into two body paragraphs?', answer: 0,
              hint: 'Count the lenses at work in this sentence, then remember how many lenses one paragraph should use.',
              why: 'True. Two lenses, health and economic, have produced two facets, and one topic sentence is holding both. The mechanism, example and nuance would have to be written twice. One lens per paragraph.' },
            { id: 'm03s3q5', type: 'select', tag: 'lr-precision', level: 'C1',
              stem: 'Tick the three words that belong to the economic lens.',
              options: ['revenue', 'sedentary', 'incentive', 'identity', 'expenditure', 'wellbeing', 'tradition', 'transmission'], answers: [0, 2, 4], k: 3,
              why: 'Revenue, incentive and expenditure are the economic kit. Sedentary and wellbeing belong to public health; identity, tradition and transmission (of customs between generations) belong to the socio-cultural lens.' },
            { id: 'm03s3q6', type: 'choose', tag: 'tr-off-topic', level: 'C1', prompt: 'p-screen-time',
              stem: 'Through the socio-cultural lens, which facet stays inside this prompt?',
              options: ['The influence of social media on the behaviour of teenagers', 'The exclusion from friendships of a child who has no device', 'The cost to a family of buying a separate tablet for every child', 'The damage that long hours on a screen do to eyesight'], answer: 1,
              why: 'Friendship and belonging are the socio-cultural lens, and a child excluded because of a screen rule is inside the prompt about restricting children\'s screen time. Social media is the near-miss: it is social, but it is a different debate. Cost is economic; eyesight is health.' },
            { id: 'm03s3q7', type: 'build', tag: 'lr-nominal', level: 'C1', prompt: 'p-teen-sleep',
              stem: 'Build the main-cause facet for this prompt as one noun phrase.',
              tiles: ['The clash', 'between', 'early school start times', 'and', 'the late body clock', 'of teenagers'],
              solution: 'The clash between early school start times and the late body clock of teenagers', alt: ['The clash between the late body clock of teenagers and early school start times'],
              why: 'A noun phrase with no main verb: "the clash between X and Y". In a problem / solution essay the cause is Facet A, and the solution that answers it (a later start to the school day) becomes Facet B.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm03ck', name: 'Systems Check', items: [
        { id: 'm03ckq1', type: 'choose', tag: 'lr-nominal', level: 'B1', prompt: 'p-screen-time',
          stem: 'Which is the Core Topic of this prompt?',
          options: ['The control of how much digital technology children are exposed to.', 'The effect that digital technology has upon the population as a whole.', 'The age at which a child ought to be given their first smartphone.', 'The influence of social media upon the behaviour of teenagers.'], answer: 0,
          hint: 'Both views of the prompt must fit inside the phrase, and nothing the prompt never mentions should fit.',
          why: 'Both views fit the first phrase: restricting screens and leaving them free. Technology and the whole population is too broad; the age for a first phone and social media are neighbouring debates.' },
        { id: 'm03ckq2', type: 'sort', tag: 'lr-nominal', level: 'B2',
          stem: 'Sort: a noun phrase ready to be a Core Topic, or a clause that needs rewriting?',
          bins: [{ key: 'np', label: 'Noun phrase', hint: 'no main verb' }, { key: 'cl', label: 'Clause', hint: 'subject + verb' }],
          items: [
            { text: 'The effects of foreign tourism on local economies and the environment', bin: 'np' },
            { text: 'Tourists spend money but they damage the environment', bin: 'cl' },
            { text: 'The value of spending public money on space exploration', bin: 'np' },
            { text: 'Governments spend too much money on space', bin: 'cl' },
            { text: 'The role that public libraries still play in an age of online information', bin: 'np' },
            { text: 'Whether libraries are needed now that information is online', bin: 'cl' }
          ],
          why: '"The effects of", "the value of", "the role that" are noun phrases the frames can hold. "Spend", "damage" and "are needed" are main verbs, and "whether" copies the prompt\'s question instead of naming its topic.' },
        { id: 'm03ckq3', type: 'choose', tag: 'tr-partial', level: 'B2', prompt: 'p-space',
          stem: 'Which is Facet B: the heart of the second view in this prompt?',
          options: ['The chance to find new minerals on the Moon and on nearby asteroids.', 'The national pride that a successful space mission brings to a country.', 'The profits that private firms earn by launching satellites for other countries.', 'The useful technology that long-term research into space produces.'], answer: 3,
          why: 'The second view says space research "delivers vital technological progress", so Facet B is that technology. Pride is the near-miss, a real benefit the prompt never mentions; minerals and private profits are narrower ideas from other debates.' },
        { id: 'm03ckq4', type: 'judge', tag: 'tr-partial', level: 'B2', prompt: 'p-tourism',
          given: 'Facet A: "The money tourists spend in local shops." Facet B: "The jobs tourists create in local hotels."',
          stem: 'Do these two facets cover the prompt?', answer: 1,
          why: 'False. Both are the economic view: visitor spending in the local economy. The prompt sets that against damage to culture and the environment, and neither facet touches it, so the second view is unanswered and Task Response stops at "some parts more fully covered than others".' },
        { id: 'm03ckq5', type: 'choose', tag: 'lr-precision', level: 'B2', prompt: 'p-prisons',
          stem: 'Which facet about prisons comes from the public-health lens?',
          options: ['The cost to taxpayers of keeping offenders in prison for many years', 'The shame a family feels when a relative is imprisoned', 'The untreated mental illness and addiction inside harsh prisons', 'The loss of the deterrent that a soft sentence causes'], answer: 2,
          why: 'Mental illness and addiction are the health kit. Taxpayer cost is economic, family shame is socio-cultural, and the deterrent is the political lens on crime. Each lens yields a different, precise facet from the same Core Topic.' },
        { id: 'm03ckq6', type: 'spot', tag: 'lr-nominal', level: 'C1', prompt: 'p-screen-time',
          stem: 'Tap the chunk that stops this Core Topic being a noun phrase.',
          words: ['The restriction', 'of children\'s', 'screen time', 'because it protects', 'healthy development.'], answer: 3,
          fix: 'to protect',
          why: '"Because it protects" opens a clause with its own subject and verb, and the Core Topic turns back into a sentence. "To protect" keeps the reason inside the noun phrase, which is the phrasal density the Band 8 grammar descriptor rewards.' },
        { id: 'm03ckq7', type: 'select', tag: 'tr-off-topic', level: 'C1', prompt: 'p-elderly-care',
          stem: 'Tick the two facets that sit inside this prompt, one for each view.',
          options: ['The treatment of care for older people as a duty of the whole society', 'The payment of a state pension to everyone above the official retirement age', 'The shortage of trained nurses working in residential homes', 'The placing of the duty of care entirely on the older person\'s own family', 'The age at which older workers should be expected to retire', 'The rising cost of hospital treatment for patients of every age'], answers: [0, 3], k: 2,
          why: 'The prompt sets the state against the family as carers, and only those two phrases name that. Pensions, nurse shortages, retirement age and hospital costs are all about older people, and all outside this prompt.' },
        { id: 'm03ckq8', type: 'choose', tag: 'lr-nominal', level: 'C1', prompt: 'p-minimum-wage',
          stem: 'Which Core Topic is a noun phrase that covers both views of this prompt?',
          options: ['The effects on the whole economy of raising the legal minimum wage.', 'The gap between the pay of company directors and that of their lowest paid staff.', 'Raising the minimum wage to cut poverty and strengthen the economy.', 'Whether businesses should be forced to pay their lowest paid staff more.'], answer: 0,
          hint: 'Rule out anything with a main verb or a "whether", then check that the second view still has a place inside the phrase.',
          why: 'Poverty falling and prices rising both fit inside "the effects on the whole economy". The pay gap is a neighbouring debate, "raising the minimum wage to cut poverty" is view A alone, and "whether…" is the question, not its topic.' }
      ] }
    }]
  });
})();
