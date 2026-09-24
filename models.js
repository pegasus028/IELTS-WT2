/* POSITION CONTROL — models.js · Nine model essays with dissect labels
   Each model is written for one prompt in the bank and uses that prompt's own
   eleven variables (C1 tier for the Band 8 models, B2 tier for the Band 7
   models), so the essays demonstrate the Matrix method exactly. Three carry a
   realistic Band 6 contrast essay for the same prompt. All essays are
   original; none reproduces a published model. */
(function () {
  var M = window.CONTENT.MODELS;

  /* ------------------------------------------------------------ 1 */
  M.push({
    id: 'm-cars-city', promptId: 'p-cars-city', band: '8', tier: 'C1', words: 293, title: 'Private cars in city centres',
    vars: {
      core: 'The systemic regulation of private automotive access within urban centres.',
      facetA: 'The urgent necessity of mitigating vehicle-induced environmental degradation.',
      mechA: 'sharply reducing localised tailpipe emissions in densely populated districts',
      exA: 'Comprehensive bans on combustion engines in designated downtown districts.',
      nuanceA: 'an outright ban abandons commuters for whom no transit alternative exists',
      facetB: 'The preservation of individual freedom of movement and choice.',
      mechB: 'safeguarding the autonomy of citizens to traverse urban space unimpeded by the state',
      exB: 'Unrestricted access to central districts by way of the public road network.',
      nuanceB: 'unchecked vehicular freedom generates compounding gridlock and toxic air',
      position: 'municipalities must invest in mass transit while phasing out high-emission vehicles',
      rationale: 'sound urban policy must reconcile ecological protection with essential public mobility'
    },
    paragraphs: [
      { role: 'intro', text: 'The systemic regulation of private automotive access within urban centres is now one of the sharpest disputes in city planning. Advocates of a ban stress the urgent necessity of mitigating vehicle-induced environmental degradation, whereas opponents defend the preservation of individual freedom of movement and choice. This essay argues that municipalities must invest in mass transit while phasing out high-emission vehicles.' },
      { role: 'bodyA', text: 'The environmental case rests on a simple mechanism: removing combustion engines from densely populated districts sharply reduces localised tailpipe emissions, which in turn lowers the pollution that residents breathe at street level. Bans on combustion engines in designated downtown districts are a clear illustration of this dynamic, since air quality improves within months. Seldom, though, do such measures consider the commuter for whom no transit alternative exists; an outright ban abandons the nurse on a night shift whose route has no bus.' },
      { role: 'bodyB', text: 'The libertarian objection is equally coherent. Freedom of movement operates by safeguarding the autonomy of citizens to traverse urban space unimpeded by the state, and its everyday form is unrestricted access to central districts by road, such as the routes into central Bangkok on which a delivery driver depends. It is precisely this freedom, however, that undermines itself when everyone exercises it at once: unchecked vehicular freedom generates compounding gridlock and toxic air, so the motorist who insists on the right to drive spends it idling in a queue. Liberty in this reading is self-defeating.' },
      { role: 'conclusion', text: 'In conclusion, the regulation of private cars in city centres is not a choice between clean air and freedom. The more defensible position is that cities must build the mass transit first and retire the most polluting vehicles second, because sound urban policy has to protect the environment without abandoning the commuter who has no alternative.' }
    ],
    patterns: ['nominalised Core Topic', 'position in intro and conclusion', 'inversion in Body A', 'cleft in Body B', 'known-to-new chaining', 'reference by "such measures" / "this dynamic" / "this reading"'],
    notes: [
      'Task Response at the 7 to 8 gate: the position (transit first, then phase-out) is stated in sentence three of the introduction and returned to in the conclusion in fresh words, so the examiner can quote it twice.',
      'Each body paragraph carries the four moves: mechanism ("removing combustion engines ... sharply reduces ... which in turn"), a pointable example (downtown bans; the routes into central Bangkok a delivery driver depends on), and a nuance that limits the facet without abandoning the position.',
      'Cohesion by reference rather than by linkers: "this dynamic", "such measures", "this freedom", "this reading". Only the conclusion opens with a linker.',
      'Two structural swaps, one per body: the inversion "Seldom, though, do such measures consider" carries Nuance A, and the cleft "It is precisely this freedom, however, that undermines itself" carries the turn in Body B.',
      'Collocation is precise and domain-specific: tailpipe emissions, densely populated districts, freedom of movement, compounding gridlock, mass transit, phase out. No cliché, no unverifiable statistic, no contraction.'
    ],
    contrast: {
      band: '6', words: 263,
      paragraphs: [
        { role: 'intro', text: 'Nowadays, in this modern era, pollution is a big problem in many cities around the world. Some people want to ban private cars in the city centre to stop pollution. However, other people think that everyone has the right to drive their car anywhere they like. This essay will discuss both views.' },
        { role: 'bodyA', text: 'Firstly, banning cars is good for the environment. Moreover, research shows that cars cause a lot of pollution in the city. Furthermore, if there are no cars, the air will be cleaner and people will be healthier. In addition, there will be fewer traffic jams, so people can go to work faster. Therefore, many people support this idea.' },
        { role: 'bodyB', text: 'On the other hand, some people think driving is a human right. Firstly, people buy cars with their own money, so they can use them as they want. Secondly, some people live far away from the city centre and there is no bus or train for them. Moreover, banning cars is bad for shops in the city centre because customers cannot come. Also, taxi drivers will lose their jobs.' },
        { role: 'bodyB', text: 'However, there are some solutions. For example, the government can build more train lines like the BTS in Bangkok. Also, the government can make electric cars cheaper. Then, people can still drive but there is no pollution.' },
        { role: 'conclusion', text: 'In conclusion, this is a controversial issue and every coin has two sides. In my opinion, I think the government should not ban cars completely but the government should limit the number of cars and improve public transport. Also, the government should educate people about the environment.' }
      ],
      faults: [
        { tag: 'tr-position-late', note: 'The introduction only promises to "discuss both views". The writer\'s opinion appears for the first time in the conclusion, so it reads as an afterthought.' },
        { tag: 'tr-generalised', note: 'Every idea is a claim without a mechanism: "the air will be cleaner", "taxi drivers will lose their jobs". Nothing explains how a ban produces these results or under what conditions.' },
        { tag: 'cc-linker-overuse', note: 'Firstly, Moreover, Furthermore, In addition, Therefore, Also open sixteen of the twenty-one sentences. The linkers replace real progression; the ideas could be shuffled without loss.' },
        { tag: 'lr-memorised', note: '"Nowadays, in this modern era", "controversial issue" and "every coin has two sides" are memorised phrases the examiner discounts.' },
        { tag: 'tr-no-example', note: '"Research shows that cars cause a lot of pollution" cannot be checked and is not an example. The BTS is the one concrete thing in the essay, and it arrives in a third body paragraph of new material.' },
        { tag: 'tr-new-idea', note: 'The conclusion adds "educate people about the environment", an idea no body paragraph developed.' }
      ]
    }
  });

  /* ------------------------------------------------------------ 2 */
  M.push({
    id: 'm-tourism', promptId: 'p-tourism', band: '7', tier: 'B2', words: 295, title: 'International tourism',
    vars: {
      core: 'The effects of foreign tourism on local economies and the environment.',
      facetA: 'The new money that foreign visitors bring into the local economy.',
      mechA: 'bringing outside money into local businesses and paying for roads and schools',
      exA: 'Coastal towns paying for clinics and schools with a small tourist tax.',
      nuanceA: 'most of the profit returns to the foreign firms that own the hotels and airlines',
      facetB: 'The damage that visitors do to local traditions and to fragile natural places.',
      mechB: 'turning real traditions into shows for sale and using up scarce water and land',
      exB: 'Dying coral reefs and old quarters turned into rows of souvenir shops.',
      nuanceB: 'visitor money often pays for the very parks and buildings that need protecting',
      position: 'governments should limit visitor numbers and spend tourist money on culture and nature',
      rationale: 'a place that sells its character will lose the very thing visitors come for'
    },
    paragraphs: [
      { role: 'intro', text: 'The effects of foreign tourism on local economies and the environment divide opinion everywhere. Supporters point to the new money that foreign visitors bring into the local economy; critics describe the damage visitors do to local traditions and fragile natural places. I believe that governments should limit visitor numbers and spend tourist money on culture and nature.' },
      { role: 'bodyA', text: 'The economic argument is easier to see. Tourism works by bringing outside money into local businesses and paying for roads and schools, because every hotel bed is taxed and every visitor employs a guide or a cook. Coastal towns in southern Thailand, for example, pay for clinics and schools with a small tourist tax. This benefit is smaller than it looks, however, since most of the profit returns to the foreign firms that own the hotels and airlines; the island keeps the wages and the litter while the dividend flies home.' },
      { role: 'bodyB', text: 'The cultural and environmental cost is harder to measure. Mass tourism damages a place by turning real traditions into shows for sale and using up scarce water and land, so a temple dance becomes a show for cameras and a village well runs dry for hotels. The visible end of this process is damage such as dying coral reefs and old quarters turned into rows of souvenir shops. Even here the picture is mixed, though, because visitor money often pays for the very parks and buildings that need protecting; a park without entrance fees usually has no rangers.' },
      { role: 'conclusion', text: 'In conclusion, foreign tourism pays a local economy and damages its culture and environment at once. The most reasonable position is that governments should limit visitor numbers and spend tourist money on culture and nature, since a place that sells its character loses the very thing visitors come for.' }
    ],
    patterns: ['position in intro and conclusion', 'mechanism, example, nuance in each body', 'concession in Body A ("however, since")', 'concession in Body B ("Even here ... though")', 'reference by "this benefit" / "this process"'],
    notes: [
      'A Band 7 essay in plain B2 English: the position ("limit numbers, reinvest the money") is stated with "I believe that" in the introduction and echoed as "the most reasonable position" in the conclusion.',
      'Body A moves facet, mechanism ("works by bringing outside money ... because every hotel bed ... is taxed"), example (coastal towns in southern Thailand) and nuance (profit repatriated to foreign firms) in that order, and the nuance keeps the position rather than reversing it.',
      'Body B mirrors the shape with a mechanism ("by turning real traditions into shows for sale"), pointable examples (coral reefs, souvenir quarters) and a nuance that visitor money funds the parks.',
      'Fewer swaps than a Band 8 model, but the concessions are grammatical, not just "However": "This benefit is smaller than it looks, however, since ..." and "Even here the picture is mixed, though, because ...". Each body ends on a concrete image (the dividend that flies home; the park with no rangers).',
      'Reference words do the linking: "this benefit", "this process", "the gain", "the damage". No sentence begins with Firstly or Moreover.'
    ],
    contrast: {
      band: '6', words: 264,
      paragraphs: [
        { role: 'intro', text: 'Tourism is a hot topic in the world today. Some people think that international tourism is good for the economy. However, others think that it destroys local culture and the environment. This essay will discuss both sides of this argument.' },
        { role: 'bodyA', text: 'Firstly, tourism brings a lot of money to a country. Moreover, tourists spend money in hotels, restaurants and shops, so local people can earn money. Furthermore, many people can get jobs, such as tour guides and hotel staff. In addition, the government gets money from tax and can use it to build roads and schools. Also, tourists buy souvenirs and local food, so small businesses can grow. Therefore, tourism is very important for the economy of Thailand.' },
        { role: 'bodyB', text: 'On the other hand, tourism also has disadvantages. Firstly, tourists do not respect local culture and they wear inappropriate clothes at temples. Secondly, research shows that many beaches and coral reefs are damaged by tourists. Moreover, local people change their traditions to make money from tourists. Furthermore, there is more rubbish and traffic in tourist areas. Also, prices of food and houses go up, so local people cannot afford them.' },
        { role: 'bodyB', text: 'However, I think there are ways to solve these problems. For example, the government can limit the number of tourists in some places like Maya Bay. Also, tourists must learn about local culture before they visit.' },
        { role: 'conclusion', text: 'In conclusion, tourism has both advantages and disadvantages. In my opinion, I believe that tourism is good for the economy but the government should protect the culture and environment. Also, schools should teach students to be good tourists in the future.' }
      ],
      faults: [
        { tag: 'tr-position-late', note: 'The introduction says only that the essay "will discuss both sides". The first opinion is "I think there are ways" in a late paragraph and the verdict arrives in the conclusion.' },
        { tag: 'tr-generalised', note: '"Tourism brings a lot of money", "prices go up": true but unexplained. There is no mechanism linking the visitor to the tax revenue or the price rise.' },
        { tag: 'cc-linker-overuse', note: 'Seventeen of the twenty-two sentences begin with Firstly, Moreover, Furthermore, In addition, Therefore or Also. The paragraphs are lists, not arguments.' },
        { tag: 'lr-memorised', note: '"Hot topic" is a memorised phrase; "a lot of" is informal. Both cost marks under Lexical Resource.' },
        { tag: 'tr-no-example', note: '"Research shows that many beaches ... are damaged" is unverifiable. Maya Bay would have been a strong example, but it appears only in a solutions paragraph the question did not ask for.' },
        { tag: 'tr-new-idea', note: '"Schools should teach students to be good tourists" is new material in the conclusion.' }
      ]
    }
  });

  /* ------------------------------------------------------------ 3 */
  M.push({
    id: 'm-remote-work', promptId: 'p-remote-work', band: '8', tier: 'C1', words: 294, title: 'Working from home',
    vars: {
      core: 'The organisational shift toward decentralised, remote working models.',
      facetA: 'The mutual benefit of remote work for employee and organisation alike.',
      mechA: 'eliminating commuting time and overhead cost, thus raising autonomy and efficiency',
      exA: 'Distributed firms reporting reduced property costs and improved retention.',
      nuanceA: 'unstructured remote work dissolves the work-life boundary and invites burnout',
      facetB: 'The damage done to collaborative capacity and psychological wellbeing.',
      mechB: 'eroding spontaneous contact and fragmenting the cohesion of working teams',
      exB: 'Delayed projects arising from asynchronous communication and staff isolation.',
      nuanceB: 'falling output usually reflects poor digital management rather than remote work itself',
      position: 'firms should adopt hybrid models pairing remote flexibility with purposeful in-person collaboration',
      rationale: 'a hybrid arrangement maximises efficiency while protecting the wellbeing and creativity of staff'
    },
    paragraphs: [
      { role: 'intro', text: 'The organisational shift toward decentralised, remote working models has divided employers as sharply as their staff. Supporters describe the mutual benefit of remote work for employee and company alike; critics point to the damage done to collaborative capacity and psychological wellbeing. This essay contends that firms should adopt hybrid models pairing remote flexibility with purposeful in-person collaboration.' },
      { role: 'bodyA', text: 'The case for remote work is about waste. Working from home operates by eliminating commuting time and overhead cost, thus raising autonomy and efficiency: the hours a Bangkok employee once spent on the expressway become finished work, and the empty desk is no longer rented. Distributed firms reporting reduced property costs and improved retention are a clear illustration of this dynamic, since trusted staff seldom hunt for another employer. Left unstructured, however, remote work dissolves the boundary between office and home and invites burnout, eroding the productivity it promised.' },
      { role: 'bodyB', text: 'What the critics see is the cost of that distance. Isolation operates through eroding spontaneous contact and fragmenting the cohesion of working teams, because the corridor conversation that catches a problem early has no digital equivalent. Delayed projects arising from asynchronous communication and staff isolation are the visible result of this process; a message answered nine hours later, for instance, holds up work a desk neighbour would settle at once. Rarely, though, does such a delay prove that remote work itself is at fault: falling output usually reflects poor digital management rather than distance, since teams with clear deadlines deliver wherever they sit.' },
      { role: 'conclusion', text: 'In conclusion, the debate goes wrong when it treats productivity as a matter of location rather than management. The more defensible position is that companies should pair remote flexibility with purposeful in-person collaboration, because a hybrid model raises efficiency while protecting the wellbeing of staff.' }
    ],
    patterns: ['nominalised Core Topic', 'position in intro and conclusion', 'participle phrase in Body A', 'inversion in Body B', 'cleft opener in Body B', 'known-to-new chaining'],
    notes: [
      'The position is a synthesis, not a fence: hybrid models, stated with "This essay contends that" in the introduction and as "the more defensible position" in the conclusion, with the rationale attached by "because".',
      'Body A explains the mechanism concretely (expressway hours converted into finished work; the empty desk no longer rented), points at distributed firms with lower property costs and better retention, and concedes burnout without dropping the facet.',
      'Body B answers the critics on their own ground: the mechanism of isolation (the lost corridor conversation), the example of delayed projects, and the nuance that the fault lies in management, which is exactly what makes the hybrid verdict follow.',
      'Swaps: the fronted participle "Left entirely unstructured, however, remote work ..." carries Nuance A; the inversion "Rarely, though, does such a delay prove" carries Nuance B; "What the critics see is ..." opens Body B as a cleft, and "eroding the productivity it promised" closes Body A with a participle.',
      'Every prompt noun is used (home, employee, company, productivity) and reference words ("this dynamic", "this process", "such a delay") carry the reader from sentence to sentence without Firstly or Moreover.'
    ]
  });

  /* ------------------------------------------------------------ 4 */
  M.push({
    id: 'm-elderly-care', promptId: 'p-elderly-care', band: '7', tier: 'B2', words: 293, title: 'Caring for the elderly',
    vars: {
      core: 'The sharing of responsibility for the care of older people between the state and families.',
      facetA: 'The treatment of care for older people as a duty of the whole society.',
      mechA: 'sharing the cost across society so that no family is ruined by a long illness',
      exA: 'National care insurance paid for by contributions from everyone, as in Japan.',
      nuanceA: 'care given only by institutions provides safety but leaves older people lonely',
      facetB: 'The placing of the duty of care entirely on the older person\'s own family.',
      mechB: 'keeping close relationships and mutual duty alive between the generations',
      exB: 'Households where adult children give daily care while holding a full-time job.',
      nuanceB: 'leaving care to families alone puts most of the burden on women and deepens inequality',
      position: 'the state should guarantee the medical and financial basis of care while families give the rest',
      rationale: 'ageing well needs both the security that shared funding gives and the closeness that families give'
    },
    paragraphs: [
      { role: 'intro', text: 'As people live longer, the sharing of responsibility for the care of older people between the state and families is a question every government faces. Some regard care for the elderly as a duty of the whole society; others place it entirely on the family. In my view, the state should guarantee the medical and financial basis of care while families give the rest.' },
      { role: 'bodyA', text: 'State provision is about risk. Public care works by sharing the cost across society so that no family is ruined by a long illness, because contributions from millions of healthy workers cover the few who need years of nursing. National care insurance, as in Japan, shows that this works on a large scale. Care given only by institutions, however, provides safety but leaves older people lonely; a well-run home can supply a nurse at every hour but not a grandchild at the table.' },
      { role: 'bodyB', text: 'The family argument answers exactly that gap. Care by relatives works by keeping close relationships and mutual duty alive between the generations; in this way the parent who once fed a child is fed in turn by that child. Households in Thailand where adult children give daily care while holding a full-time job are the ordinary form of this system. Leaving care to families alone, though, puts most of the burden on women and deepens inequality, since it is usually a daughter who gives up her job to do it.' },
      { role: 'conclusion', text: 'To conclude, neither the government nor the family can carry the care of the elderly alone. The most sensible position is that the state should pay for the medical and financial floor of care while families provide the daily closeness, since ageing well needs both the security of shared funding and the closeness only families give.' }
    ],
    patterns: ['position in intro and conclusion', 'mechanism, example, nuance in each body', 'concession in Body A ("however")', 'concession in Body B ("though")', 'short verdict sentence closing each body', 'reference by "that gap" / "this system"'],
    notes: [
      'The position is a synthesis (state pays the floor, families give the closeness) and it is written twice: "In my view" in the introduction and "The most sensible position is that" in the conclusion.',
      'Body A gives the mechanism of pooled risk in plain words ("contributions from millions of healthy workers cover the few"), a real-world example (national care insurance in Japan) and the nuance of loneliness, made concrete by the nurse and the grandchild.',
      'Body B opens by referring back ("answers exactly that gap") and links its mechanism to its image with "in this way": known-to-new progression, so the reader always knows why the next sentence is there.',
      'Both nuances are grammatical concessions inside the sentence ("Care given only by institutions, however, provides ... but ..."; "Leaving care to families alone, though, puts ...") rather than a bare "However" at the front.',
      'Plain B2 lexis used precisely: state provision, shared funding, long illness, full-time job, burden, inequality. No cliché, no statistic, no contraction.'
    ]
  });

  /* ------------------------------------------------------------ 5 */
  M.push({
    id: 'm-teen-jobs', promptId: 'p-teen-jobs', band: '7', tier: 'B2', words: 292, title: 'Part-time work for students',
    vars: {
      core: 'Part-time work for students who are still at secondary school.',
      facetA: 'The practical skills and independence that paid work builds.',
      mechA: 'putting teenagers in front of deadlines, customers and cash that a classroom can only imitate',
      exA: 'Students who take weekend shifts in cafés, shops or family businesses.',
      nuanceA: 'a demanding job can leave a student too tired to study in the evenings',
      facetB: 'The advantage that a work record gives a graduate looking for a first full-time job.',
      mechB: 'giving young applicants references and a knowledge of workplace behaviour that others lack',
      exB: 'Employers who prefer graduates with any work history to those with none.',
      nuanceB: 'a few weekend shifts add little to a career if the work has nothing to do with the student\'s field',
      position: 'every student should do some part-time work before leaving school, with a limit on hours to protect their studies',
      rationale: 'the skills learned at work cannot be taught in a classroom, and a weekly limit removes the risk to grades'
    },
    paragraphs: [
      { role: 'intro', text: 'In some countries a part-time job is a normal part of secondary school life; in others students are expected only to study. I agree that every student should do some part-time work before leaving school, with a limit on hours to protect their studies, because work builds skills and a work record helps a graduate.' },
      { role: 'bodyA', text: 'The first reason is that paid work teaches what a classroom can only imitate. A job works by putting teenagers in front of deadlines, customers and cash, so that a mistake costs money rather than a mark; doing so fixes the lesson in memory. Students who take weekend shifts in cafés or family businesses, for example, learn punctuality and patience before any teacher examines them. Admittedly, a demanding job can leave a student too tired to study in the evenings, which is why hours must be limited; this qualification, though, argues for control, not abstention.' },
      { role: 'bodyB', text: 'The second reason is the head start a work record gives a graduate. Employment history works through giving young applicants references and a knowledge of workplace behaviour others lack, since an employer facing two identical certificates takes the one already trusted with a shift. Employers who prefer graduates with any work history to those with none show this in practice. It is true that a few weekend shifts add little to a career if the work is unrelated to the student\'s later field; even so, habits of courtesy transfer to every job.' },
      { role: 'conclusion', text: 'In conclusion, I believe that students should gain work experience before they finish school, provided a weekly limit keeps their studies first. Taken together, the skills only work can teach and the head start a work record gives make this the most sensible position, since the limit protects grades.' }
    ],
    patterns: ['opinion playbook: one position, two reasons', 'position in intro and conclusion', 'concession in Body A ("Admittedly ... though")', 'concession in Body B ("It is true that ... even so")', 'reference by "this limit" / "this matters"'],
    notes: [
      'The Opinion playbook done cleanly: one position ("every student should do some part-time work ... with a limit on hours"), stated with "I agree that" in the introduction and repeated as "students should gain some work experience" in the conclusion, with both reasons named up front.',
      'Body A explains why work teaches (a mistake costs money rather than a mark), gives a pointable example (weekend shifts in cafés, shops or family businesses) and concedes tiredness, then turns the concession into support for the hours limit ("this qualification, though, argues for control, not abstention").',
      'Body B carries a second mechanism (references and workplace behaviour that a certificate cannot show) and an example (employers who prefer any work history), and its nuance is real: unrelated shifts add little, but the habits transfer.',
      'Cohesion comes from the reasons being announced in the introduction and then picked up as "The first reason" / "The second reason", plus reference words: "doing so", "this qualification", "taken together".',
      'The register is formal but not inflated: head start, trusted with a shift, punctuality, courtesy. The conclusion evaluates and adds nothing new.'
    ],
    contrast: {
      band: '6', words: 264,
      paragraphs: [
        { role: 'intro', text: 'Nowadays, in this modern era, many students have part-time jobs in the evening or at the weekend. In some countries this is normal but in other countries it is rare. Some people say all students need to have work experience before they finish school. This essay will discuss the advantages and disadvantages of this idea.' },
        { role: 'bodyA', text: 'Firstly, part-time jobs give students a lot of experience. Moreover, students can learn how to work with other people and how to be responsible. Furthermore, they can earn their own money and do not need to ask their parents for everything. Also, they can make new friends and improve their communication skills. In addition, research shows that students with jobs have more confidence than students without jobs. Therefore, part-time jobs are useful for students.' },
        { role: 'bodyB', text: 'On the other hand, part-time jobs have some disadvantages. Firstly, students will be very tired and they cannot concentrate in class the next day. Secondly, some students may get bad grades because they do not have time to do their homework. Moreover, some employers pay students a very low salary. Furthermore, some students may be too young to work safely. Also, students in Thailand already have tutoring classes after school, so they have no free time for a job.' },
        { role: 'conclusion', text: 'In conclusion, there are advantages and disadvantages of students having part-time jobs, and every coin has two sides. In my opinion, I agree that students need to have work experience, but they cannot work too many hours. Also, parents should check that the job is safe and the government should make new laws about student workers.' }
      ],
      faults: [
        { tag: 'tr-position-late', note: 'An opinion question, but the introduction only promises "advantages and disadvantages". "I agree" first appears in the conclusion, so the essay reads as a list until its last paragraph.' },
        { tag: 'tr-generalised', note: '"Students can learn how to be responsible" and "students will be very tired" are claims without a mechanism. Nothing explains how a job teaches responsibility or why the tiredness follows.' },
        { tag: 'cc-linker-overuse', note: 'Firstly, Moreover, Furthermore, In addition, Therefore, Secondly, Also: fourteen of the nineteen sentences open with a linker, and the ideas inside are interchangeable.' },
        { tag: 'lr-memorised', note: '"Nowadays, in this modern era" and "every coin has two sides" are memorised phrases; "a lot of" is informal.' },
        { tag: 'tr-no-example', note: '"Research shows that students with jobs have more confidence" is unverifiable. The tutoring detail is the only concrete thing in the essay, and it is left as an assertion.' },
        { tag: 'tr-new-idea', note: 'Parents checking safety and the government making laws are new ideas that appear only in the conclusion.' }
      ]
    }
  });

  /* ------------------------------------------------------------ 6 */
  M.push({
    id: 'm-early-languages', promptId: 'p-early-languages', band: '8', tier: 'C1', words: 294, title: 'Foreign languages from the earliest grades',
    vars: {
      core: 'The mandating of foreign language acquisition in early childhood education.',
      facetA: 'The necessity of preserving foundational native language skills.',
      mechA: 'ensuring young learners establish robust cognitive frameworks in a single language before additional systems are layered upon them',
      exA: 'Educational models that delay intensive foreign language instruction until native literacy benchmarks are secured.',
      nuanceA: 'postponing bilingualism actively guarantees missing the period of highest natural phonetic absorption',
      facetB: 'The exploitation of the critical window of childhood neuroplasticity.',
      mechB: 'capitalising on the brain\'s innate capacity for effortless phonological and grammatical acquisition before that faculty diminishes',
      exB: 'Bilingual immersion programmes in which infants acquire a second language through ordinary play and instruction.',
      nuanceB: 'poorly designed early language programmes can induce academic anxiety and produce superficial competence in both languages',
      position: 'policymakers must introduce foreign languages in the earliest grades through play-based immersion while safeguarding intensive native-language literacy',
      rationale: 'optimal cognitive development requires the neurological benefits of early bilingualism without sacrificing the grounding of a mother tongue'
    },
    paragraphs: [
      { role: 'intro', text: 'The mandating of foreign language acquisition in early childhood education is proposed in many school systems and fiercely opposed. This essay argues that policymakers must introduce foreign languages in the earliest grades through play-based immersion while safeguarding native literacy, after conceding the strongest objection.' },
      { role: 'bodyA', text: 'Those who would delay a second tongue stress the necessity of preserving foundational native skills, reasoning that a young learner must establish a robust cognitive framework in one language before another is added, since a child who cannot yet read Thai gains little from decoding English. Curricula that postpone foreign instruction until native literacy benchmarks are secured, such as schools that begin English only in the fourth grade, embody this view. What this argument overlooks, however, is the price of waiting: postponing bilingualism guarantees missing the period of highest phonetic absorption, so the caution that protects reading sacrifices pronunciation for life.' },
      { role: 'bodyB', text: 'The stronger consideration is the exploitation of the critical window of childhood neuroplasticity. Early instruction works by capitalising on the brain\'s capacity for effortless phonological acquisition before that faculty diminishes, which is why a six-year-old absorbs a tone an adult must drill for months. This dynamic is visible in bilingual immersion programmes in which infants acquire a second language through ordinary play; such children seldom know they are studying. Not even the danger that poorly designed programmes induce anxiety and superficial competence in both languages undermines the case; it merely means the method must be play.' },
      { role: 'conclusion', text: 'In conclusion, children should begin a foreign language in the first grades, through play and alongside reading in their mother tongue. Taken together, the cost of waiting and the ease of early acquisition make this the only defensible reading, because a child gains most from early bilingualism when a first language is protected.' }
    ],
    patterns: ['opinion playbook: conceded counter-argument then the stronger reason', 'nominalised Core Topic', 'position in intro and conclusion', 'cleft in Body A', 'negative fronting in Body B', 'reference by "this view" / "this argument" / "this dynamic"'],
    notes: [
      'A qualified agreement done without fence-sitting: the position (early languages, through play, with native literacy protected) is stated in full in the introduction with "This essay argues that" and restated as "the only defensible reading" in the conclusion.',
      'Body A is the conceded counter-argument (Facet A as the Opinion playbook allows): mechanism ("a robust cognitive framework in one language before additional systems are layered upon it"), a pointable example (curricula that begin English in the fourth grade) and the turn, which is the nuance that makes the objection lose.',
      'Body B carries the decisive reason with its mechanism (the brain\'s capacity before that faculty diminishes, made concrete by the tone and the verb ending), the immersion example and a nuance (anxiety, superficial competence) that is absorbed into the method ("play") rather than allowed to weaken the position.',
      'Swaps: the cleft "What this argument overlooks, however, is the price of waiting" and the negative fronting "Not even the real danger that ... undermines the case", each on a nuance sentence.',
      'Precise academic collocation throughout: literacy benchmarks, phonetic absorption, immersion programmes, superficial competence, mother tongue; and the prompt nouns (language, child, school, grade) all appear.'
    ]
  });

  /* ------------------------------------------------------------ 7 */
  M.push({
    id: 'm-online-learning', promptId: 'p-online-learning', band: '8', tier: 'C1', words: 295, title: 'Online lessons for schools',
    vars: {
      core: 'The shift of secondary school instruction from the classroom to online delivery.',
      facetA: 'The flexibility of access to instruction regardless of location and pace.',
      mechA: 'allowing a lesson to be paused, replayed and followed from any location with a connection',
      exA: 'Students in remote provinces following the same specialist courses as those in the capital.',
      nuanceA: 'a lesson that can be watched at any time is easily postponed indefinitely',
      facetB: 'The erosion of the social and disciplinary structure that a classroom provides.',
      mechB: 'removing the immediate presence of a teacher who notices confusion and the peers who sustain motivation',
      exB: 'The widespread loss of learning and engagement reported during periods of school closure.',
      nuanceB: 'well-designed live sessions with small groups can restore much of the interaction a classroom offers',
      position: 'the disadvantages outweigh the advantages for most secondary students, so online lessons should supplement rather than replace the classroom',
      rationale: 'adolescents depend on structure and human presence to learn, and no degree of flexibility replaces them'
    },
    paragraphs: [
      { role: 'intro', text: 'The shift of secondary school instruction from the classroom to online delivery divides opinion. Its principal advantage is flexible access regardless of location and pace; its most serious drawback is the loss of the social and disciplinary structure a classroom provides. On balance, this essay argues that the disadvantages outweigh the advantages for most secondary students, so online lessons should supplement rather than replace the classroom.' },
      { role: 'bodyA', text: 'Online delivery works by allowing a lesson to be paused, replayed and followed from anywhere with a connection, which in turn frees a student from a single building\'s timetable. Students in remote provinces following the same physics course as those in Bangkok are a clear illustration of this gain; the recorded teacher does not care where the viewer sits. Admittedly, a lesson that can be watched at any time is easily postponed indefinitely; the freedom that opens the course to a village also lets a fifteen-year-old ignore it, so the benefit depends on adolescent self-discipline.' },
      { role: 'bodyB', text: 'Set against this is what the screen removes. A classroom operates through the immediate presence of a teacher who notices confusion and peers who sustain motivation, so that a puzzled face is answered before it becomes a failed test. It is in the loss of learning and engagement reported when schools closed that this cost is most clearly seen. Well-designed live sessions with small groups, however, restore much of the interaction a classroom offers, which makes the drawback a reason to keep such teaching as a supplement, not to reject it.' },
      { role: 'conclusion', text: 'In conclusion, once flexible access is weighed against the loss of classroom structure, the disadvantages outweigh the advantages for most secondary students, because adolescents depend on structure and human presence to learn, and no degree of flexibility replaces a teacher in the room.' }
    ],
    patterns: ['advantage playbook: weigh, do not list', '"outweigh" in intro and conclusion', 'nominalised Core Topic', 'concession in Body A ("Admittedly")', 'cleft in Body B', 'reference by "this gain" / "this structure" / "such teaching"'],
    notes: [
      'An advantages/disadvantages question is an opinion question in disguise, and the verdict word appears where the examiner looks for it: "the disadvantages outweigh the advantages" in the introduction and again in the conclusion, each time with the consequence ("supplement rather than replace").',
      'Body A treats the advantage fairly: mechanism ("allowing a lesson to be paused ... which in turn frees a student"), a Thai example (remote provinces following the same physics course as Bangkok) and a nuance that already points toward the verdict, since the benefit depends on adolescent self-discipline.',
      'Body B names the mechanism of a classroom (a teacher who notices confusion, peers who sustain motivation, made concrete by the puzzled face and the bored one), points at the loss of learning when schools closed, and concedes that small live groups recover some of it.',
      'Swaps: the concession "Admittedly, ..." carries Nuance A; the cleft "It is in the widespread loss of learning ... that the cost ... is most clearly seen" carries Example B; "Set against this is ..." opens Body B with inversion of subject and complement; "Online delivery works by ..." opens Body A without any linker.',
      'The conclusion weighs rather than repeats ("once flexible access is weighed against the loss ..."), and the rationale is a single reason: adolescents depend on structure and human presence.'
    ]
  });

  /* ------------------------------------------------------------ 8 */
  M.push({
    id: 'm-teen-sleep', promptId: 'p-teen-sleep', band: '7', tier: 'B2', words: 294, title: 'Teenagers and sleep',
    vars: {
      core: 'The lack of sleep among secondary school students.',
      facetA: 'The clash between early school start times and the late body clock of teenagers.',
      mechA: 'moving the teenage body clock later while lessons still start before eight, which cuts the night short at both ends',
      exA: 'Students who travel an hour across a jammed city to reach a half-past-seven assembly.',
      nuanceA: 'start times are tied to parents\' working hours and to bus timetables that are hard to change',
      facetB: 'The move to a later start to the school day for older students.',
      mechB: 'matching the first lesson to the hours when teenagers are physically able to wake up and pay attention',
      exB: 'Secondary schools that moved the first bell later and saw better attendance and alertness.',
      nuanceB: 'a later start achieves little if students just stay up later on their phones',
      position: 'schools should start the day later for older students while parents and schools together set limits on late-night screen use',
      rationale: 'the cause is a clash between biology and the timetable, and only the timetable can be changed'
    },
    paragraphs: [
      { role: 'intro', text: 'The lack of sleep among secondary school students is reported by doctors in many countries. Its main cause is the clash between early school start times and the late body clock of teenagers. This essay argues that schools should start later for older students while parents and schools together limit late-night screen use.' },
      { role: 'bodyA', text: 'During adolescence the body clock moves later, so a sixteen-year-old is not sleepy until midnight while lessons still start before eight; the night is therefore cut short at both ends. Students who travel an hour across a jammed city to a half-past-seven assembly, for example, are awake at five, asleep after midnight and dozing through the first period. Unfortunately, start times are tied to parents\' working hours and bus timetables that are hard to change, since a school that opens at nine strands a working parent at eight.' },
      { role: 'bodyB', text: 'The most effective solution is a later first bell for older students, because it answers that cause directly. A delayed start works by matching the first lesson to the hours when teenagers can physically wake and attend, so the body clock the early timetable fights is instead accommodated. Secondary schools that moved the first bell back saw better attendance and alertness. Admittedly, this change achieves little if students stay up later on their phones; the timetable can give back an hour, but only a household rule agreed between parents and the school ensures it is spent asleep.' },
      { role: 'conclusion', text: 'In conclusion, because teenage sleep loss stems from a timetable that ignores the adolescent body clock, a later start is the logical response. Schools should start later for older students and, with parents, limit late-night screen use, since the cause is a clash between biology and the timetable, and only the timetable can be changed.' }
    ],
    patterns: ['problem playbook: cause with mechanism, then the solution that answers it', 'position in intro and conclusion', 'the solution visibly answers the named cause', 'concession in Body A ("Unfortunately")', 'concession in Body B ("Admittedly")', 'reference by "that cause" / "the change"'],
    notes: [
      'The solution answers the cause by name: Body A ends on a timetable that fights the body clock, and Body B opens "because it answers the cause directly" and explains that the same body clock "is instead accommodated". This is what tr-solution-mismatch looks like when it is avoided.',
      'The cause carries a real mechanism ("the body clock moves later ... while lessons still start before eight; the night is therefore cut short at both ends"), a Bangkok example (an hour across a jammed city for a half-past-seven assembly) and a nuance that explains why the cause persists.',
      'The solution paragraph has its own mechanism ("matching the first lesson to the hours when teenagers are physically able to wake"), an example (secondary schools that moved the first bell back) and a nuance (phones) that is converted into the second half of the position.',
      'The position is stated in the introduction with "arguing that schools should" and restated in the conclusion with the rationale attached by "since". Both halves of the question (causes; what schools, parents and governments can do) are answered.',
      'Cohesion is by reference and by echo: "that cause", "this change", "the timetable", "the body clock the early timetable fights"; only the conclusion opens with a linker.'
    ]
  });

  /* ------------------------------------------------------------ 9 */
  M.push({
    id: 'm-cashless', promptId: 'p-cashless', band: '8', tier: 'C1', words: 294, title: 'The cashless society',
    vars: {
      core: 'The transition from cash to digital payment in everyday transactions.',
      facetA: 'The speed and convenience of a payment that requires nothing but a phone.',
      mechA: 'removing the need to carry, count and return change, which saves time for both buyer and seller',
      exA: 'Street food stalls and motorcycle taxis that display a code to scan instead of keeping a cash box.',
      nuanceA: 'the change was driven as much by banks and governments promoting the apps as by shoppers choosing them',
      facetB: 'The exclusion of those without a smartphone, a bank account or a reliable signal.',
      mechB: 'making every purchase depend on a device, an account and a network that the elderly and the poor are least likely to possess',
      exB: 'Elderly customers unable to buy a bus ticket from a machine that accepts only cards.',
      nuanceB: 'governments can oblige shops to accept cash and provide basic accounts to every citizen',
      position: 'the shift is a positive development on balance, provided that cash remains accepted and the excluded are helped to join',
      rationale: 'the gains in convenience and transparency are real, whereas the exclusion is a design failure that can be corrected'
    },
    paragraphs: [
      { role: 'intro', text: 'The transition from cash to digital payment in everyday transactions raises two questions: why it was so rapid, and whether it is welcome. This essay attributes the speed to the convenience of a payment that requires nothing but a phone, weighs that gain against the exclusion of those without a smartphone or bank account, and argues that the shift is positive on balance.' },
      { role: 'bodyA', text: 'Convenience answers the first question. A digital payment operates by removing the need to carry, count and return change, which saves time for buyer and seller. It is at the street food stall and the motorcycle taxi, where a printed code has replaced the cash box, that the change is most visible; the vendor, for instance, keeps no float. Granted, the change was driven as much by banks and governments promoting the apps as by shoppers choosing them; such schemes explain why people started, though, not why they stayed.' },
      { role: 'bodyB', text: 'The second question turns on who is left out. Cashless systems exclude by making every purchase depend on a device, an account and a network that the elderly and the poor are least likely to possess, so the majority\'s convenience becomes the minority\'s barrier. Elderly customers unable to buy a bus ticket from a machine that accepts only cards, for example, are common where ticket offices have closed. Seldom, however, is this exclusion inevitable: governments can oblige shops to accept cash and give every citizen a basic bank account, and where such measures exist the harm shrinks.' },
      { role: 'conclusion', text: 'In conclusion, convenience explains the speed of the move from cash, and exclusion is its main cost. Considered together, the shift is positive on balance provided cash stays accepted, since the gains are real whereas the exclusion is a design failure that can be corrected.' }
    ],
    patterns: ['two-part playbook: one body paragraph per question', 'nominalised Core Topic', 'position in intro and conclusion', 'cleft in Body A', 'inversion in Body B', 'reference by "such schemes" / "such measures" / "this exclusion"'],
    notes: [
      'Two questions, two body paragraphs of equal weight, and the introduction announces which answer goes where ("attributes the speed to ... weighs that gain against ... and argues that"). The verdict ("positive on balance, provided that") appears in the introduction and the conclusion.',
      'Body A answers "why so quickly" with a mechanism (no change to carry, count or return, so time is saved on both sides of the counter), a Bangkok example (the code at the street food stall and on the motorcycle taxi) and a nuance that credits banks and governments without surrendering the answer.',
      'Body B answers "positive or negative" with the mechanism of exclusion (device, account, network), a pointable example (the ticket machine that takes only cards) and a nuance that turns into the condition on the verdict: cash must stay accepted.',
      'Swaps: the cleft "It is at the street food stall ... that the change is most visible" carries Example A; the inversion "Seldom, however, is this exclusion inevitable" carries Nuance B.',
      'The prompt nouns (cash, phone, pay, bank) all appear; the conclusion evaluates in one sentence and gives one rationale, contrasting "a design failure that can be corrected" with gains that are "real".'
    ]
  });
})();
