/* POSITION CONTROL — topic-08.js · Module 08 Nominalisation */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm08', n: 8, code: 'Module 08', name: 'Nominalisation', art: 'stack', cefr: 'B1–C1',
    blurb: 'Pack the action into a noun: "Rising prices reduced consumption" is the Band 8 grammar driver.',
    levels: [{
      id: 'm08l1', n: 1, name: 'Nominalisation', cefr: 'B1–C1', blurb: 'Verb to noun, clause to noun phrase, and the head-noun rule that keeps the long subject grammatical.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm08s1', name: 'Verb to noun', cefr: 'B1',
          theory: {
            key: 'Academic English carries the action in nouns. Regulate becomes regulation, adopt becomes adoption, and "ban cars" becomes "the regulation of private cars". Learn the family, not the word.',
            body: [
              '<p>Every essay word belongs to a <strong>family</strong>: <em>regulate</em> (verb), <em>regulation</em> (noun), <em>regulatory</em> (adjective). Spoken English lives on the verb: <em>the government should regulate cars</em>. Written academic English lives on the noun: <em>the regulation of private cars</em>. The move from the first to the second is called <strong>nominalisation</strong>, and it is the single grammar habit that separates a Band 6 script from a Band 8 one. Corpus research on academic writing shows that advanced complexity is <em>phrasal</em>, built from dense noun phrases, rather than <em>clausal</em>, built from stacked <em>because</em> and <em>which</em> clauses. The Band 8 descriptor asks for "a wide range of structures flexibly and accurately used"; a well-made noun phrase is the safest structure in that range.</p>',
              '<p>Most nouns are made with a small set of endings. <strong>-tion / -sion</strong>: <em>adopt → adoption, introduce → introduction, decide → decision</em>. <strong>-ment</strong>: <em>improve → improvement, replace → replacement</em>. <strong>-ance / -ence</strong>: <em>resist → resistance, depend → dependence</em>. <strong>-al</strong>: <em>remove → removal, approve → approval</em>. <strong>-th / -ure</strong>: <em>grow → growth, fail → failure</em>. Some words change nothing: <em>increase, decrease, rise, fall, ban, tax</em> are both verb and noun, so <em>the rise in prices</em> and <em>a ban on cars</em> need no ending at all. Learn the noun with its partner preposition: <em>the regulation <u>of</u> cars, a ban <u>on</u> cars, the rise <u>in</u> prices, dependence <u>on</u> tutoring</em>.</p>',
              '<p>The trap is the wrong member of the family. <em>The <s>economical</s> growth of Bangkok</em> is a word-form error: <em>economical</em> means cheap to run, <em>economic</em> means to do with the economy. <em>The rapid <s>grow</s> of tutoring centres</em> puts a verb where a noun must go. <em>Health</em> is the noun, <em>healthy</em> the adjective; <em>succeed</em>, <em>success</em>, <em>successful</em>; <em>benefit</em>, <em>beneficial</em>. Word-form errors cost Lexical Resource and Grammatical Accuracy at the same time, because the examiner cannot tell whether you chose the wrong word or built the wrong form. The cure is to write the family in a column before you use the word: verb, noun, adjective.</p>',
              '<p>The reason to master this now is that the <strong>Core Topic</strong> of every essay is a nominalised noun phrase. <em>Banning cars in the centre</em> is a verb phrase with <em>-ing</em>; <em>the regulation of private cars in city centres</em> is a noun phrase, with <em>regulation</em> as its head. The noun phrase can be the subject of a sentence, can take an adjective in front (<em>the strict regulation</em>) and a prepositional phrase behind (<em>of private cars in city centres</em>), and can be referred back to as <em>this policy</em> or <em>such regulation</em>. The verb phrase can do none of those things well. Start from the noun and the rest of the sentence organises itself around it.</p>'
            ],
            simple: [
              '<p>Every word has a family: regulate (verb), regulation (noun), regulatory (adjective). Academic writing uses the noun: "the regulation of cars", not "the government regulates cars".</p>',
              '<p>Common endings: -tion (adoption), -ment (improvement), -ance (resistance), -al (removal), -th (growth). Some words do not change: a rise, a ban, a tax, an increase.</p>',
              '<p>Use the right member of the family: economic growth (not economical), the growth of tutoring (not the grow). The Core Topic of your essay is always a noun phrase.</p>'
            ],
            examples: [
              { s: 'The adoption of remote working by large firms has emptied many city-centre offices.', g: 'adopt → adoption. The noun phrase is the subject, and "by large firms" hangs from it.' },
              { s: '<s>The economical growth of Bangkok has increased the number of cars.</s>', g: 'Wrong family member. Economical means cheap to run; the adjective for the economy is economic.' },
              { s: 'A ban on private cars in the centre would cut the fumes that people breathe.', g: 'Ban is verb and noun with no change of form; its partner preposition is "on".' },
              { s: '<s>Learning languages young</s> → early foreign-language instruction', g: 'The Core Topic moves from a verb phrase (learning) to a noun phrase (instruction).' }
            ]
          },
          items: [
            { id: 'm08s1q1', type: 'choose', tag: 'gra-word-form', level: 'B1', prompt: 'p-remote-work',
              stem: 'Which word completes the noun phrase: "The ___ of remote working by many firms has changed city centres"?',
              options: ['adoptive', 'adopt', 'adoption', 'adopted'], answer: 2,
              why: '"The ___ of" needs a noun as its head: adopt → adoption. "Adopt" is the verb, "adopted" its past participle and "adoptive" an adjective. The whole phrase "the adoption of remote working by many firms" is then a subject the sentence can build on.' },
            { id: 'm08s1q2', type: 'sort', tag: 'lr-nominal', level: 'B1',
              stem: 'Sort each Core Topic: a verb phrase, or a nominalised noun phrase with a noun as its head?',
              bins: [{ key: 'v', label: 'Verb phrase', hint: 'an -ing verb leads it' }, { key: 'n', label: 'Noun phrase', hint: 'a noun leads it' }],
              items: [
                { text: 'banning cars in the city centre', bin: 'v' },
                { text: 'the regulation of private cars in city centres', bin: 'n' },
                { text: 'learning a foreign language young', bin: 'v' },
                { text: 'early foreign-language instruction in primary schools', bin: 'n' },
                { text: 'the provision of fare-free public transport', bin: 'n' },
                { text: 'making buses and trains free for everyone', bin: 'v' }
              ],
              why: 'A verb phrase starts with an -ing verb: banning, learning, making. A noun phrase starts with a noun: regulation, instruction, provision. The Core Topic must be the second kind, because only a noun phrase can be the subject of a sentence and be referred back to as "this policy".' },
            { id: 'm08s1q3', type: 'choose', tag: 'gra-word-form', level: 'B1', prompt: 'p-fast-food-tax',
              stem: 'Choose the right family member: "A tax would improve public health, and this ___ justifies the cost."',
              options: ['improvement', 'improve', 'improved', 'improving'], answer: 0,
              why: 'After "this" the sentence needs a noun: improve → improvement. The noun lets the writer refer back to the whole idea of the last clause in one word, which is the cohesion move Band 7 rewards.' },
            { id: 'm08s1q4', type: 'spot', tag: 'gra-word-form', level: 'B2',
              stem: 'Tap the chunk with the wrong member of the word family.',
              words: ['The economical growth', 'of Bangkok', 'has increased', 'the number of cars', 'in the centre', 'over the last decade.'], answer: 0,
              fix: 'The economic growth',
              why: '"Economical" means cheap to run, as in an economical car. The adjective for the economy is "economic". Word-form slips cost Lexical Resource and Grammatical Accuracy together, so check the family before you write the word.' },
            { id: 'm08s1q5', type: 'choose', tag: 'lr-nominal', level: 'B2', prompt: 'p-early-languages',
              stem: 'Which option states the Core Topic of this prompt as a nominalised noun phrase?',
              hint: 'Find the first word of each option and ask whether it is a noun, an -ing verb or the start of a full sentence.',
              options: ['Learning a foreign language from the first grade of school.', 'Foreign-language instruction in the earliest grades.', 'Schools should teach foreign languages from the first grade onwards.', 'Teaching a foreign language early is very useful for young children.'], answer: 1,
              why: 'The head of the phrase is the noun "instruction", with no subject and no verb around it, so the whole thing can be a subject: "Foreign-language instruction in the earliest grades divides parents." The others are a verb phrase led by -ing, a full sentence with "should", and a claim with "is".' },
            { id: 'm08s1q6', type: 'choose', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-space',
              stem: 'Which option packs "the government spends money on space research" into a noun phrase with a noun as its head?',
              options: ['Public expenditure on space research', 'Spending public money on space research', 'The government spends money on space research', 'To spend public money on space research'], answer: 0,
              why: 'Spend → expenditure. The noun is the head, and "on space research" hangs from it: "Public expenditure on space research is a small share of the budget." The second option is still led by the -ing verb, the third is a full sentence, and the fourth is an infinitive, which cannot take "this" or an adjective.' },
            { id: 'm08s1q7', type: 'choose', tag: 'gra-word-form', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Choose the right form: "The ___ of a sugar tax depends on the price rise being large enough to change habits."',
              options: ['successful', 'succeed', 'successfully', 'success'], answer: 3,
              why: 'succeed → success → successful → successfully. "The ___ of" is a noun slot, so only "success" fits. Keep the four forms in a column when you learn an essay word; the examiner reads "the successful of" as a grammar error, not a spelling slip.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm08s2', name: 'Clause to noun phrase', cefr: 'B2',
          theory: {
            key: '"Because prices rose, people bought less" has two clauses. "Rising prices reduced consumption" has one verb and two noun phrases. Same idea, half the words, and the Band 8 grammar driver.',
            body: [
              '<p>A clause has a subject and a verb: <em>because prices rose</em>, <em>people bought less</em>. Nominalisation turns each clause into a <strong>noun phrase</strong> and joins the two with a single <strong>verb of change</strong>: <em>Rising prices reduced consumption.</em> The cause becomes the subject, the effect becomes the object, and the verb in the middle says what the cause did to the effect. The sentence is shorter, denser and easier to keep accurate, because there is only one verb to get right instead of two. This is what the research behind the app means when it says advanced academic complexity is phrasal rather than clausal.</p>',
              '<p>The move has three steps. <strong>One</strong>: find the verb of the cause clause and make it a noun: <em>prices rose → rising prices / the rise in prices</em>; <em>schools removed the machines → the removal of the machines</em>. <strong>Two</strong>: find the verb of the effect clause and make it a noun too: <em>people bought less → consumption</em>; <em>students concentrate poorly → concentration</em>. <strong>Three</strong>: choose the verb of change that links them: <em>reduce, raise, lower, increase, weaken, strengthen, drive, prompt, produce, cut</em>. <em>The removal of vending machines reduced the consumption of sugary drinks.</em> Notice that <em>because</em>, <em>when</em>, <em>so</em> and <em>which</em> have all disappeared; their meaning now sits inside the verb.</p>',
              '<p>Nominalisation can be overdone. <em>The improvement of attendance was the result of the introduction of a later start</em> has three nouns made from verbs and only <em>was</em> to hold them up: a zombie sentence, all nouns and no action. The rule is <strong>one nominalised subject, one live verb</strong>: <em>The introduction of a later start improved attendance.</em> The subject is dense, the verb still does something. If you find yourself writing <em>was the result of</em>, <em>is the cause of</em> or <em>there was a</em>, you have nominalised the verb of change as well, and the sentence has lost its engine.</p>',
              '<p>Use the move on the sentences that carry the argument: the topic sentence of each body paragraph and the mechanism. A mechanism written as <em>Sealed soil sends every drop straight into the drains</em> has the cause as its subject and the effect as its object, so it reads as a chain without a single linking word. The checker in this app looks for exactly this in the rewrite items: no <em>because</em>, <em>since</em>, <em>when</em>, <em>although</em>, <em>which</em>, <em>that</em> or <em>so</em>, the cause as a noun phrase, the effect as a noun phrase, and a verb of change between them.</p>'
            ],
            simple: [
              '<p>Two clauses: "Because prices rose, people bought less." One sentence: "Rising prices reduced consumption." Cause = subject, effect = object, one verb of change in the middle.</p>',
              '<p>Three steps: make the cause a noun (the rise in prices), make the effect a noun (consumption), choose a verb of change (reduce, raise, cut, weaken, drive).</p>',
              '<p>Do not overdo it. "The improvement of attendance was the result of the introduction of a later start" has no action. Keep one dense subject and one live verb: "The introduction of a later start improved attendance."</p>'
            ],
            examples: [
              { s: 'Because prices rose, people bought less. → Rising prices reduced consumption.', g: 'Cause clause → subject noun phrase; effect clause → object noun phrase; "reduced" is the verb of change.' },
              { s: 'When the fare was removed, more people used the buses. → The removal of the fare raised bus use.', g: '"Removed" becomes "removal"; "more people used" becomes "raised … use". No "when", no "so".' },
              { s: '<s>The improvement of attendance was the result of the introduction of a later start.</s>', g: 'Over-nominalised: three verb-nouns and only "was". The action has been buried.' },
              { s: 'The introduction of a later start improved attendance at several schools.', g: 'One nominalised subject, one live verb. Dense and readable.' }
            ]
          },
          items: [
            { id: 'm08s2q1', type: 'choose', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-free-transport',
              stem: '"Because the fare was removed, more people used the buses." Which version turns both clauses into noun phrases joined by one verb?',
              options: ['Because of the removal of the fare, more people used the buses.', 'The fare was removed, so bus use rose.', 'The removal of the fare meant that more people used the buses.', 'The removal of the fare raised bus use.'], answer: 3,
              why: 'Cause as a noun phrase (the removal of the fare), effect as a noun phrase (bus use), one verb of change (raised). The first keeps the effect as a clause, the second keeps two clauses with "so", and the third reintroduces a "that" clause.' },
            { id: 'm08s2q2', type: 'rewrite', tag: 'gra-nominalisation', level: 'B2',
              stem: 'Rewrite as one sentence with no because, when, which, that or so: cause as a noun phrase, a verb of change, then the effect.',
              given: 'Because prices rose, people bought less.',
              must: [['rising prices', 'price rises', 'the rise in prices', 'higher prices', 'the increase in prices', 'increasing prices'], ['consumption', 'spending', 'purchases', 'demand']],
              noClause: true, minWords: 4, maxWords: 14, praise: 'Cause as subject, effect as object, one verb of change. That is nominalisation.',
              _good: 'Rising prices reduced consumption.',
              _bad: 'Because prices rose, people bought less.',
              why: 'Step one: prices rose → rising prices. Step two: people bought less → consumption. Step three: a verb of change between them: reduced, cut, lowered. "Rising prices reduced consumption" says the same thing in four words and one verb.' },
            { id: 'm08s2q3', type: 'rewrite', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-school-snacks',
              stem: 'Nominalise: no when, because, which, that or so. Start with "The removal of …" and use a verb of change.',
              given: 'When schools removed vending machines, students drank fewer sugary drinks.',
              must: [['removal', 'removing'], ['consumption', 'intake', 'purchases', 'sales']],
              noClause: true, minWords: 6, maxWords: 20, praise: 'A dense subject, a live verb and a nominalised object. The examiner reads this as Band 8 grammar.',
              _good: 'The removal of vending machines reduced the consumption of sugary drinks among students.',
              _bad: 'When schools removed vending machines, students drank fewer sugary drinks.',
              why: '"Removed" becomes "the removal of vending machines"; "students drank fewer" becomes "the consumption of sugary drinks"; the verb of change is "reduced" or "cut". The clause markers vanish because their meaning now lives in the verb.' },
            { id: 'm08s2q4', type: 'spot', tag: 'gra-word-form', level: 'B2', prompt: 'p-private-tutoring',
              stem: 'The sentence is nominalised, but one chunk uses the wrong word form. Tap it.',
              words: ['The rapid grow', 'of tutoring centres', 'in Bangkok', 'reflects', 'the competition', 'for university places.'], answer: 0,
              fix: 'The rapid growth',
              why: 'The head of a noun phrase must be a noun: grow → growth. Nominalisation only earns marks when the form is right; "the rapid grow" turns a Band 8 subject into a Band 6 error.' },
            { id: 'm08s2q5', type: 'choose', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-teen-sleep',
              stem: 'Which sentence is nominalised without losing the verb that carries the action?',
              options: ['The improvement of attendance was the result of the introduction of a later start.', 'There was an improvement in attendance after the introduction of a later start.', 'The introduction of a later start improved attendance.', 'The implementation of a later start was the cause of attendance improvement.'], answer: 2,
              why: 'One dense subject, one live verb: "improved". The other three have nominalised the verb of change as well, so "was", "there was" and "was the cause of" are all that is left to hold the nouns up. Dense is good; lifeless is not.' },
            { id: 'm08s2q6', type: 'build', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-city-flooding',
              stem: 'Build the nominalised mechanism: the cause as a noun phrase, then the verb of change, then the effect.',
              tiles: ['The replacement', 'of absorbent land', 'with concrete', 'sends rainfall', 'straight into drains', 'built for', 'a smaller city.'],
              solution: 'The replacement of absorbent land with concrete sends rainfall straight into drains built for a smaller city.', alt: [],
              why: '"Cities replaced absorbent land with concrete" becomes the subject "the replacement of absorbent land with concrete". The verb "sends" is the change, and "drains built for a smaller city" packs a whole relative clause into a participle. No "because", no "which".' },
            { id: 'm08s2q7', type: 'choose', tag: 'gra-complex', level: 'C1', prompt: 'p-remote-work',
              stem: '"Because staff no longer commute, they have more energy, so they produce more." Which version nominalises the cause and keeps a live verb of change?',
              options: ['Staff who no longer commute have more energy and produce more.', 'The end of commuting gives staff more energy and raises their output.', 'Since commuting has ended, staff energy and output have both risen.', 'The elimination of commuting is the reason why staff have more energy.'], answer: 1,
              why: 'Cause as subject (the end of commuting), two verbs of change (gives, raises), effects as noun phrases (energy, output). The first keeps a relative clause, the third keeps "since", and the fourth buries the action in "is the reason why". Three or four structures used accurately beat a fifth used badly.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm08s3', name: 'Agreement with long subjects', cefr: 'B2',
          theory: {
            key: 'Nominalisation makes long subjects, and long subjects hide the head noun. "The widespread adoption of remote working by large companies HAS changed …": find the head, match the verb to it.',
            body: [
              '<p>The price of a dense noun phrase is a long subject, and a long subject is where agreement errors live. <em>The widespread adoption of remote working by large companies <s>have</s> changed the centre of Bangkok.</em> The writer saw <em>companies</em> just before the verb and made the verb plural. But <em>companies</em> is not the subject; it is the last word of a phrase that hangs from the subject. The subject is <em>adoption</em>, singular, so the verb is <em>has</em>. The <strong>head-noun rule</strong>: strip away every <em>of</em>, <em>by</em>, <em>in</em>, <em>for</em> phrase and every relative clause, find the one noun that is left, and match the verb to that noun.</p>',
              '<p>Practise the stripping. <em>The rising cost [of housing, transport and school places] [in the capital] <strong>is</strong> pushing young families out.</em> Three plural nouns sit inside the brackets; the head is <em>cost</em>. <em>Each [of the measures] [proposed by the council] <strong>requires</strong> money.</em> The head is <em>each</em>, which is always singular, like <em>every</em>, <em>everyone</em>, <em>neither</em> and <em>nobody</em>. <em>The removal of sugary drinks, [together with a cap on fried snacks], <strong>has</strong> changed what students eat.</em> <em>Together with</em>, <em>as well as</em> and <em>along with</em> do not add to the subject the way <em>and</em> does, so the head stays singular.</p>',
              '<p>Two families of subject need a rule of their own. <em>The number of</em> is singular, because the head is <em>number</em>: <em>the number of cars <strong>has</strong> risen</em>. <em>A number of</em> means <em>many</em>, and the verb agrees with the plural noun after it: <em>a number of schools <strong>have</strong> replaced their vending machines</em>. The same pair works for <em>the majority of</em>. With <em>neither … nor</em> and <em>either … or</em>, the verb agrees with the noun nearest to it: <em>neither the tax nor the labels <strong>are</strong> enough</em>. Inside a relative clause, the verb agrees with the noun the clause describes: <em>Bangkok is one of the cities that <strong>suffer</strong> most</em>, because it is the cities, not Bangkok, that suffer.</p>',
              '<p>Band 7 Grammatical Range and Accuracy asks for "frequent error-free sentences"; Band 8 asks for "the majority of sentences error-free". A single agreement slip in a beautifully nominalised topic sentence costs both. So audit the pairing: every time you write a subject longer than five words, put a finger on its head noun before you write the verb. If the subject has grown past twenty words and you can no longer find the head, do not guess a plural to be safe: split the sentence into two, each with a subject you can see. A correct simple sentence outscores a faulty complex one every time.</p>'
            ],
            simple: [
              '<p>Long subjects hide the head noun. "The adoption of remote working by large companies HAS changed …": the subject is "adoption", not "companies". Strip away the of/by/in phrases, find the one noun left, match the verb to it.</p>',
              '<p>Always singular: each, every, everyone, neither, the number of. Plural: a number of + plural noun. "Together with" and "as well as" do not make the subject plural.</p>',
              '<p>If the subject is so long that you cannot find the head, split the sentence. A correct simple sentence scores higher than a complex one with an error.</p>'
            ],
            examples: [
              { s: 'The widespread adoption of remote working by large companies <u>has</u> changed the centre of Bangkok.', g: 'Head noun: adoption. "Companies" is inside a "by" phrase and does not count.' },
              { s: 'The number of students at tutoring centres <u>rises</u> every year.', g: '"The number of" is singular: the head is "number".' },
              { s: 'A number of Bangkok schools <u>have</u> already replaced their vending machines.', g: '"A number of" means many; the verb agrees with "schools".' },
              { s: '<s>Each of the measures proposed by the council require money.</s>', g: 'Head: each, always singular. The verb must be "requires".' }
            ]
          },
          items: [
            { id: 'm08s3q1', type: 'spot', tag: 'gra-agreement', level: 'B2', prompt: 'p-remote-work',
              stem: 'Tap the chunk that does not agree with the head noun of the subject.',
              words: ['The widespread adoption', 'of remote working', 'by large companies', 'have changed', 'the centre of Bangkok', 'since 2020.'], answer: 3,
              fix: 'has changed',
              why: 'Strip the "of" and "by" phrases and the subject is "adoption", singular. "Companies" sits inside a phrase that hangs from the head; it does not decide the verb. A nominalised subject is only worth marks if the verb agrees with its head.' },
            { id: 'm08s3q2', type: 'choose', tag: 'gra-agreement', level: 'B2', prompt: 'p-private-tutoring',
              stem: 'Choose the verb: "The number of students at tutoring centres ___ every year."',
              hint: 'Strip away the "of" and "at" phrases first, then see which noun is left to decide the verb.',
              options: ['rises', 'rise', 'are rising', 'have risen'], answer: 0,
              why: '"The number of" is a singular subject: its head is "number", and "of students at tutoring centres" hangs from it. Only "rises" is singular. Compare "a number of students", which means "many students" and takes a plural verb.' },
            { id: 'm08s3q3', type: 'spot', tag: 'gra-agreement', level: 'B2', prompt: 'p-city-flooding',
              stem: 'Tap the chunk with the agreement error.',
              words: ['Each of the measures', 'proposed by the council', 'require money', 'that the city', 'does not have.'], answer: 2,
              fix: 'requires money',
              why: 'The head is "each", which is always singular, however many measures follow it. "Proposed by the council" is a participle phrase hanging from "measures", not part of the subject. Each, every, everyone, neither and nobody all take a singular verb.' },
            { id: 'm08s3q4', type: 'judge', tag: 'gra-agreement', level: 'C1', prompt: 'p-school-snacks',
              given: 'The removal of sugary drinks, together with a cap on fried snacks, has changed what students eat at school.',
              stem: 'Is the verb "has" correct here?', answer: 0,
              why: 'True. "Together with" adds information but does not add to the subject the way "and" does, so the head noun is still "removal", singular. The same is true of "as well as" and "along with". "The removal and the cap have changed" would need the plural.' },
            { id: 'm08s3q5', type: 'choose', tag: 'gra-agreement', level: 'C1', prompt: 'p-fast-food-tax',
              stem: 'Choose the verb: "Neither the tax nor the warning labels ___ enough on their own."',
              options: ['is', 'has been', 'are', 'was'], answer: 2,
              why: 'With "neither … nor" the verb agrees with the noun nearest to it: "labels", plural, so "are". Reverse the order, "neither the labels nor the tax", and the verb becomes "is". The rule is nearest noun, not first noun.' },
            { id: 'm08s3q6', type: 'spot', tag: 'gra-agreement', level: 'C1', prompt: 'p-rural-youth',
              stem: 'Three plural nouns sit inside this subject. Tap the chunk that agrees with the wrong one.',
              words: ['The rising cost', 'of housing, transport', 'and school places', 'in the capital', 'are pushing', 'young families', 'to the outer districts.'], answer: 4,
              fix: 'is pushing',
              why: 'Strip the "of" phrase and the "in" phrase and the subject is "cost", singular. Housing, transport and school places are what the cost is of, not what is doing the pushing. The longer the nominalised subject, the more important it is to find the head before the verb.' },
            { id: 'm08s3q7', type: 'choose', tag: 'gra-complex', level: 'C1',
              stem: 'A student\'s nominalised subject has reached thirty words and she cannot find its head noun. What is the safest fix?',
              hint: 'Ask which option leaves her certain that every verb agrees, rather than which sounds most advanced.',
              options: ['Add a relative clause after the subject to make the structure richer.', 'Keep the subject and choose a plural verb, since most of its nouns are plural.', 'Turn the verb into a noun as well, so that the whole sentence is one noun phrase.', 'Split it into two sentences, each with a subject whose head she can see.'], answer: 3,
              why: 'A correct simple sentence outscores a faulty complex one. Adding a clause makes the head harder to find, guessing a plural is a coin toss, and nominalising the verb leaves a sentence with no action. Two clear subjects, two verbs that agree: that is what "error-free sentences" means.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm08ck', name: 'Systems Check', items: [
        { id: 'm08ckq1', type: 'choose', tag: 'gra-word-form', level: 'B1', prompt: 'p-prisons',
          stem: 'Choose the right form: "The ___ of offenders should be the main aim of the prison system."',
          options: ['rehabilitate', 'rehabilitative', 'rehabilitation', 'rehabilitated'], answer: 2,
          why: 'rehabilitate → rehabilitation. "The ___ of offenders" is a noun slot, and the noun then becomes a subject the essay can refer back to as "this aim". The verb, the adjective and the participle cannot do that.' },
        { id: 'm08ckq2', type: 'sort', tag: 'lr-nominal', level: 'B1',
          stem: 'Sort each Core Topic: a verb phrase, or a nominalised noun phrase?',
          bins: [{ key: 'v', label: 'Verb phrase', hint: 'led by an -ing verb' }, { key: 'n', label: 'Noun phrase', hint: 'led by a noun' }],
          items: [
            { text: 'testing new medicines on animals', bin: 'v' },
            { text: 'the use of animals in medical testing', bin: 'n' },
            { text: 'the shift from cash to digital payment', bin: 'n' },
            { text: 'paying with a phone instead of cash', bin: 'v' },
            { text: 'protecting children from advertising', bin: 'v' },
            { text: 'the regulation of advertising aimed at children', bin: 'n' }
          ],
          why: 'Testing, paying and protecting are -ing verbs with objects; use, shift and regulation are nouns with prepositional phrases hanging from them. The Core Topic must be a noun phrase so that it can head a sentence and be referred back to.' },
        { id: 'm08ckq3', type: 'rewrite', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-teen-sleep',
          stem: 'Nominalise into one sentence with no because, when, which, that or so: the early start as the subject, then a verb of change.',
          given: 'Because lessons start before eight, students sleep less, so they cannot concentrate.',
          must: [['early start', 'early starts', 'early lessons', 'start times', 'the early start', 'early school start'], ['concentration', 'attention', 'focus']],
          noClause: true, minWords: 6, maxWords: 20, praise: 'Cause as a noun phrase, effects as noun phrases, verbs of change between them. Dense and accurate.',
          _good: 'Early start times cut students\' sleep and weaken their concentration in class.',
          _bad: 'Because lessons start before eight, students sleep less, so they cannot concentrate.',
          why: '"Lessons start before eight" becomes "early start times"; "sleep less" becomes "cut … sleep"; "cannot concentrate" becomes "weaken their concentration". Two verbs of change carry the whole chain, and "because" and "so" are no longer needed.' },
        { id: 'm08ckq4', type: 'spot', tag: 'gra-agreement', level: 'B2', prompt: 'p-cctv-everywhere',
          stem: 'Tap the chunk that does not agree with the head noun of the subject.',
          words: ['The introduction of cameras', 'in stations', 'and school corridors', 'have reduced', 'theft and bullying', 'in both.'], answer: 3,
          fix: 'has reduced',
          why: 'The head is "introduction", singular. "Cameras", "stations" and "corridors" are all inside phrases that hang from it. Find the head, then choose the verb; the nouns nearest the verb are the ones most likely to mislead you.' },
        { id: 'm08ckq5', type: 'choose', tag: 'gra-nominalisation', level: 'B2', prompt: 'p-tourism',
          stem: '"Because visitors spend money, local incomes rise." Which version is nominalised: cause as subject, one verb of change, effect as object?',
          options: ['Since visitors spend money, local incomes are raised by them.', 'Visitors spend money, and this raises local incomes.', 'Local incomes rise when visitors spend money there.', 'Visitor spending raises local incomes.'], answer: 3,
          why: '"Visitors spend money" becomes the noun phrase "visitor spending"; "incomes rise" becomes the object "local incomes"; "raises" is the verb of change. The other three all keep two clauses, joined by "since", "and this" or "when".' },
        { id: 'm08ckq6', type: 'judge', tag: 'gra-agreement', level: 'C1', prompt: 'p-school-snacks',
          given: 'A number of Bangkok schools has already replaced their vending machines with water fountains.',
          stem: 'Is the verb "has" correct here?', answer: 1,
          hint: 'Ask what "a number of" means in plain words, then decide which noun the verb should agree with.',
          why: 'False. "A number of" means "many", so the verb agrees with the plural noun after it: "a number of schools have replaced". It is "the number of" that is singular, because there the head is "number": "the number of schools has grown".' },
        { id: 'm08ckq7', type: 'choose', tag: 'gra-complex', level: 'C1', prompt: 'p-cctv-everywhere',
          stem: 'Which sentence uses a nominalised subject and still keeps a live verb of change?',
          options: ['The retention of footage for a short period is the removal of most of the danger.', 'Short retention periods for footage remove most of the danger.', 'The danger is removed through the retention of footage for a short period of time.', 'There is a removal of most of the danger through short retention of footage.'], answer: 1,
          why: 'One dense subject, "short retention periods for footage", and one live verb, "remove". The others have turned the verb of change into a noun as well, leaving "is", "is removed through" and "there is" to carry the sentence. Nominalise the subject, not the action.' },
        { id: 'm08ckq8', type: 'spot', tag: 'gra-word-form', level: 'C1', prompt: 'p-tourism',
          stem: 'Tap the chunk with the wrong member of the word family.',
          words: ['The economy benefits', 'of tourism', 'are clear,', 'but the environmental costs', 'are often ignored', 'by local councils.'], answer: 0,
          fix: 'The economic benefits',
          why: '"Economy" is the noun; the adjective that describes benefits is "economic". Note that "environmental costs" in the same sentence is correct: environment (noun) → environmental (adjective). Learn each family as a set.' }
      ] }
    }]
  });
})();
