/* POSITION CONTROL — topic-04.js · Module 04 Matrix II — Mechanism, Example, Nuance */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm04', n: 4, code: 'Module 04', name: 'Matrix II — Mechanism, Example, Nuance', art: 'layers', cefr: 'B1–C1',
    blurb: 'De-generalise every claim: say how it works, show where it happens, admit its limit.',
    levels: [{
      id: 'm04l1', n: 1, name: 'Mechanism, Example, Nuance', cefr: 'B1–C1', blurb: 'The three moves that turn a facet into a Band 8 body paragraph: the mechanism, the example and the nuance.',
      subs: [
        /* ------------------------------------------------------------ s1 */
        { id: 'm04s1', name: 'Mechanism: how it works', cefr: 'B1',
          theory: {
            key: 'A claim says that something is true; a mechanism says how it becomes true. "X reduces Y because …, which in turn …" is the sentence that lifts Task Response from 7 to 8.',
            body: [
              '<p>Band 7 Task Response is capped by one phrase: <em>"there may be a tendency to over-generalise"</em>. Band 8 asks for ideas that are <em>"well extended and supported"</em>. The difference is a single sentence in each body paragraph. <em>"Cameras reduce crime"</em> is a <strong>claim</strong>: it says that something happens. <em>"A camera raises the chance that an offender is identified, which makes theft less worth trying"</em> is a <strong>mechanism</strong>: it says how it happens. The facet names the idea; the mechanism opens it up and shows the cause-and-effect inside.</p>',
              '<p>The easiest way to write one is the <strong>because-chain</strong>. Start with the facet, add <em>because</em>, then add <em>which in turn</em>: <em>"Lessons start before eight, which cuts the night short, which in turn leaves students unable to concentrate."</em> Three links is enough. The test is simple: after your sentence, ask <em>"and why does that happen?"</em>. If the sentence already answers, it is a mechanism. If the only answer is <em>"because it does"</em>, it is still a claim.</p>',
              '<p>Three things are often put in the mechanism slot by mistake. The <strong>example</strong>: <em>"This idea works by schools that replaced their vending machines"</em> names a place you can point at, not a process; a mechanism is general (any school), an example is particular (that school). The <strong>restated facet</strong>: <em>"it works by reducing pollution"</em> is the facet again in other words. The <strong>policy</strong>: <em>"it works by banning cars"</em> says what is done, not how it changes anything. The mechanism is the step in between: cars leave, so the fumes people breathe fall.</p>',
              '<p>The mechanism is sentence two of every body paragraph, straight after the topic sentence, and the frames give it a fixed home: <em>"This idea works by …"</em>, <em>"Its influence stems from …"</em>. Its verbs are verbs of change: <em>reduces, raises, removes, allows, forces, shifts</em>, joined by <em>because</em>, <em>so</em> and <em>which in turn</em>. Keep it attached to the prompt: a mechanism about advertising in a tax essay is a well-explained way of going off topic.</p>'
            ],
            simple: [
              '<p>A claim: "Cameras reduce crime." A mechanism: "Cameras raise the chance a thief is caught, so stealing is less worth trying." The mechanism says HOW.</p>',
              '<p>Write it as a chain: facet + because + which in turn. Test it: ask "and why does that happen?" If the sentence already answers, it is a mechanism.</p>',
              '<p>Not a mechanism: an example (a place you can point at), the facet said again, or the policy itself. The mechanism is the step in between.</p>'
            ],
            examples: [
              { s: 'A tax raises the price of fast food, so people buy less of it, which in turn improves their diet.', g: 'Three links: price → purchases → diet. Each link answers "and why does that happen?".' },
              { s: '<s>A tax on fast food would improve the health of the whole population.</s>', g: 'A claim. True or not, it does not say how.' },
              { s: '<s>This idea works by the sugar tax on fizzy drinks that several countries have introduced.</s>', g: 'An example in the mechanism slot: a policy you can point at, not the process inside it.' },
              { s: 'Working from home removes travel time and office costs, which in turn raises both freedom and efficiency.', g: 'The mechanism of Facet A in the remote-work prompt: what is removed, and what that removal produces.' }
            ]
          },
          items: [
            { id: 'm04s1q1', type: 'choose', tag: 'tr-generalised', level: 'B1', prompt: 'p-cars-city',
              stem: 'Facet A is the need to cut traffic pollution. Which sentence gives the mechanism: how a ban actually works?',
              hint: 'Ask "and why does that happen?" after each sentence; only one of them already answers it.',
              options: ['Pollution from traffic is a serious problem in many large cities today.', 'Bans on petrol and diesel engines already exist in several marked central districts.', 'Keeping cars out cuts the exhaust fumes that people breathe in crowded districts.', 'Governments should ban all petrol and diesel engines inside the city centre.'], answer: 2,
              why: 'A mechanism says how: cars leave, the fumes fall, the air people breathe is cleaner. The first option is the claim, the second is an example you could point at, and the last is the policy itself. Band 7 is capped by "a tendency to over-generalise"; the mechanism is the cure.' },
            { id: 'm04s1q2', type: 'sort', tag: 'tr-generalised', level: 'B1',
              stem: 'Sort each sentence: a claim, or a mechanism that explains how something works?',
              bins: [{ key: 'claim', label: 'Claim', hint: 'says that it happens' }, { key: 'mech', label: 'Mechanism', hint: 'says how it happens' }],
              items: [
                { text: 'Part-time work is good for teenagers.', bin: 'claim' },
                { text: 'A weekend job puts a teenager in front of customers and deadlines, which builds responsibility.', bin: 'mech' },
                { text: 'Tourism harms local culture.', bin: 'claim' },
                { text: 'When traditions are performed for visitors, they become shows for sale and lose their meaning.', bin: 'mech' },
                { text: 'Free buses attract people who already walk, so car traffic hardly changes.', bin: 'mech' },
                { text: 'Free public transport does not reduce congestion.', bin: 'claim' }
              ],
              why: 'A claim can be agreed with or denied, but it cannot be followed. A mechanism has a chain inside it: job → customers and deadlines → responsibility. Ask "and why does that happen?" after each sentence; the claims have no answer.' },
            { id: 'm04s1q3', type: 'judge', tag: 'tr-generalised', level: 'B2', prompt: 'p-school-snacks',
              given: 'This idea works by schools that have replaced vending machines with water fountains and fruit stalls.',
              stem: 'Is the mechanism slot filled with a mechanism?', answer: 1,
              why: 'False. Those schools are an example: a place the reader can point at. The mechanism is the process any school would go through: taking sweet options out of the place where daily eating routines are formed. Example and mechanism are different moves and need different sentences.' },
            { id: 'm04s1q4', type: 'build', tag: 'cc-progression', level: 'B2', prompt: 'p-teen-sleep',
              stem: 'Build the because-chain: the cause, its effect, and the effect of that effect.',
              tiles: ['Lessons start', 'before eight,', 'which cuts', 'the night short,', 'which in turn', 'leaves students', 'unable to concentrate.'],
              solution: 'Lessons start before eight, which cuts the night short, which in turn leaves students unable to concentrate.', alt: [],
              why: 'Three links: early start → short night → poor concentration. "Which in turn" is the joint that turns two facts into a chain, and a chain is what "extended and supported" looks like on the page.' },
            { id: 'm04s1q5', type: 'choose', tag: 'tr-generalised', level: 'B2', prompt: 'p-cctv-everywhere',
              stem: 'Facet A: cameras prevent crime. Which sentence explains how?',
              hint: 'Look for a chain of cause and effect inside the sentence, not a case, a fact or a trend.',
              options: ['A camera raises the chance an offender is identified, which makes theft less worth trying.', 'In station car parks and school corridors, theft and bullying fell sharply after cameras arrived.', 'Security guards can watch several buildings at once from a single control room.', 'Face recognition software is becoming more powerful every year in many countries.'], answer: 0,
              why: 'The mechanism is the chain inside the facet: camera → higher chance of being caught → crime less worth trying. The car parks are an example of the result, the control room is a different mechanism (saving money, not preventing crime), and the software sentence is a trend with no chain.' },
            { id: 'm04s1q6', type: 'spot', tag: 'cc-progression', level: 'B2', prompt: 'p-tourism',
              stem: 'Tap the chunk that breaks the because-chain.',
              words: ['Foreign visitors spend money', 'in local shops and hotels,', 'which raises local incomes,', 'which in turn', 'pays for roads and schools', 'through tax,', 'and the beaches are beautiful.'], answer: 6,
              fix: 'that the region could not otherwise afford.',
              why: 'Each link of a chain follows from the last: spending → incomes → tax → roads and schools. "The beaches are beautiful" is a new fact that follows from nothing before it, so the progression stops and the paragraph becomes a list.' },
            { id: 'm04s1q7', type: 'choose', tag: 'tr-generalised', level: 'B2', prompt: 'p-remote-work',
              stem: 'A student wrote: "Working from home benefits companies." Which addition turns the claim into a mechanism?',
              hint: 'A mechanism opens the claim and shows the steps inside it; a fact, a case or a second claim does not.',
              options: ['…, and many large firms now allow it on three days of every week.', '…, because it removes office costs, which in turn raises efficiency.', '…, for example the scattered firms that now report lower property costs.', '…, and it benefits employees just as much.'], answer: 1,
              why: 'Only "because …, which in turn …" opens the claim and shows the chain inside it. The first addition is a fact about how common the practice is, the third is an example, and the last is a second claim stacked on the first.' }
          ] },

        /* ------------------------------------------------------------ s2 */
        { id: 'm04s2', name: 'Example: something you can point at', cefr: 'B2',
          theory: {
            key: 'An example is something the reader can point at: a place, a policy, a school, a practice. It shows the mechanism happening. "Research shows" is not an example.',
            body: [
              '<p>The descriptors reward ideas that are <em>"supported"</em> and punish <em>"a lack of focus and precision in supporting ideas/material"</em>. The mechanism explains how the facet works; the example shows it working somewhere. The test is whether the examiner could <strong>picture it</strong>. <em>"Coastal towns paying for clinics and schools with a small tourist tax"</em> can be pictured. <em>"Tourism helps many communities in many ways"</em> cannot; it is the claim again, wearing the word <em>many</em>.</p>',
              '<p>The most common fake example is <strong>"research shows"</strong>: <em>"a recent survey found that 85 per cent of employees are more productive at home"</em>. The examiner cannot check it, and invented statistics read as memorised language. Examiner guidance is explicit: ground the example in <strong>your own country, school or family</strong>. A Bangkok school that replaced its vending machines, the BTS at eight in the morning, the floods of 2011, a street stall outside the school gate: all of these are closer to you, more credible to the reader, and easier to describe precisely than a number you would have to invent.</p>',
              '<p>The example must show <strong>this</strong> mechanism, not a neighbouring one. If the mechanism is <em>"a lesson can be paused and followed from anywhere"</em>, then students in remote provinces taking a course from the capital shows it; students in the capital adding evening online tutoring does not, even though it is also online. Two other near-misses: an example from the other side of the debate, which belongs in the other paragraph, and an example from a neighbouring topic, such as hillside landslides in an essay about city flooding. Check the example against the prompt\'s key nouns before you keep it.</p>',
              '<p>One example is enough, and it takes one sentence, sometimes two. Mark it so the reader sees the move: <em>for example</em>, <em>such as</em>, <em>we can see this when …</em>, <em>a clear case is …</em>, <em>in Thailand, …</em>. The frames give it a home: <em>"We can see this happening in the real world when …"</em>. Then go straight to the nuance. One example that shows the mechanism beats three that only decorate the claim.</p>'
            ],
            simple: [
              '<p>An example is something the reader can picture: a school, a city, a policy, a habit. Test: could the examiner point at it?</p>',
              '<p>"Research shows" and "a survey found 85%" are not examples. The examiner cannot check them. Use your own country or school instead: Bangkok, your school, the BTS.</p>',
              '<p>The example must show YOUR mechanism, not a nearby one and not the other side. Mark it: "for example", "such as", "we can see this when".</p>'
            ],
            examples: [
              { s: 'For example, several Bangkok schools have replaced their vending machines with water fountains and fruit stalls.', g: 'A place, a practice, a change the reader can picture. Own country, no invented number.' },
              { s: '<s>Research shows that students who work part-time develop much better time management.</s>', g: 'Unverifiable. Whose research? The examiner reads it as a memorised move.' },
              { s: 'We can see this in the low-lying districts of Bangkok built on former rice fields, which flood after a single afternoon storm.', g: 'The example shows the mechanism (sealed soil, overloaded drains) happening in one named place.' },
              { s: '<s>A clear case is the hillside villages that suffer landslides after weeks of rain.</s>', g: 'Concrete, but a neighbouring topic. The prompt asked about city flooding.' }
            ]
          },
          items: [
            { id: 'm04s2q1', type: 'judge', tag: 'tr-no-example', level: 'B2',
              given: 'Research shows that students who work part-time develop much better time management than those who do not.',
              stem: 'Does this sentence give a concrete example?', answer: 1,
              hint: 'Ask whether the examiner could picture what this sentence describes, or check it.',
              why: 'False. "Research shows" cannot be checked by the examiner and reads as a memorised move. A concrete example is something you can point at: students who take weekend shifts in a family shop and have to plan their homework around them.' },
            { id: 'm04s2q2', type: 'choose', tag: 'tr-no-example', level: 'B2', prompt: 'p-city-flooding',
              stem: 'Cause A: land that once soaked up rain is now covered with concrete. Which example shows this cause?',
              options: ['The yearly monsoon that brings months of heavy rain to South-East Asia.', 'Hillside villages that suffer landslides after long periods of rain.', 'Many studies have confirmed that concrete surfaces increase run-off.', 'Low-lying districts built on former rice fields and wetlands.'], answer: 3,
              why: 'The example must show this cause: fields that soaked up rain are now districts that cannot. The monsoon is a different cause, landslides are a neighbouring topic, and "many studies have confirmed" is a claim the examiner cannot verify.' },
            { id: 'm04s2q3', type: 'sort', tag: 'tr-no-example', level: 'B2',
              stem: 'Sort: a concrete example the examiner can picture, or an unverifiable claim?',
              bins: [{ key: 'ex', label: 'Concrete example', hint: 'a place, a policy, a practice' }, { key: 'un', label: 'Unverifiable claim', hint: 'research, surveys, experts' }],
              items: [
                { text: 'Bangkok schools that have replaced their vending machines with water fountains.', bin: 'ex' },
                { text: 'Surveys show that most teenagers prefer water when it is available.', bin: 'un' },
                { text: 'Experts agree that cameras cut crime by a large amount.', bin: 'un' },
                { text: 'Station car parks where theft fell after cameras were installed.', bin: 'ex' },
                { text: 'Households where adult children give daily care while holding a full-time job.', bin: 'ex' },
                { text: 'Statistics prove that families provide better care than institutions.', bin: 'un' }
              ],
              why: 'The examiner can picture a school, a car park or a household; the examiner cannot check a survey, an expert or a statistic you do not name. A named case from your own country is worth more than "research shows".' },
            { id: 'm04s2q4', type: 'choose', tag: 'tr-off-topic', level: 'B2', prompt: 'p-tourism',
              stem: 'Facet B is the damage visitors do to traditions and nature. Which example belongs in this paragraph?',
              options: ['Coastal towns paying for clinics and schools with a small tourist tax.', 'Old quarters turned into rows of souvenir shops.', 'Historic quarters where rents rise as new offices replace old family homes.', 'Every survey of visitors finds that they respect local customs.'], answer: 1,
              why: 'An old quarter turned into souvenir shops shows a tradition becoming a product, which is the mechanism of Facet B. The tourist tax belongs to Facet A, the rising rents come from office building, not from visitors, and the survey is unverifiable.' },
            { id: 'm04s2q5', type: 'judge', tag: 'tr-no-example', level: 'B2', prompt: 'p-school-snacks',
              given: 'In Bangkok, many schools still have a stall by the gate selling iced tea and fried snacks, and students queue there every break.',
              stem: 'Is this an acceptable example for an IELTS essay?', answer: 0,
              why: 'True. It names a place, a practice and a habit the reader can picture, and it comes from the writer\'s own city. No invented number, nothing the examiner needs to verify. This is exactly what "support" means.' },
            { id: 'm04s2q6', type: 'spot', tag: 'tr-no-example', level: 'B2', prompt: 'p-fast-food-tax',
              stem: 'Tap the chunk that makes this example unverifiable.',
              hint: 'Which chunk asks the reader to trust something they cannot see for themselves?',
              words: ['Sugar taxes on fizzy drinks,', 'such as the one in Thailand,', 'have pushed producers', 'to cut the sugar in their recipes,', 'as many studies have proved.'], answer: 4,
              fix: 'as the low-sugar versions now on every shelf show.',
              why: 'The example was concrete until the last chunk: a named policy, a visible change. "As many studies have proved" adds nothing the examiner can check and makes the sentence sound memorised. Point at the shelf instead.' },
            { id: 'm04s2q7', type: 'choose', tag: 'cc-progression', level: 'C1', prompt: 'p-online-learning',
              stem: 'Mechanism A: a lesson can be paused, replayed and followed from anywhere. Which example shows that mechanism happening?',
              options: ['Students in remote provinces following the same specialist courses as those in the capital.', 'Students in the capital who attend normal classes by day and online tutoring in the evening.', 'The fast growth of educational video channels aimed at teenagers around the world.', 'The wide loss of learning and motivation reported when schools were closed.'], answer: 0,
              why: 'Facet → mechanism → example is a progression: the example must show the mechanism just described. Remote students taking a course from the capital shows "from anywhere". Evening tutoring in the capital is online but not about place, the video channels are a trend, and the lost learning belongs to the other side.' }
          ] },

        /* ------------------------------------------------------------ s3 */
        { id: 'm04s3', name: 'Nuance: the limit that keeps the position', cefr: 'B2',
          theory: {
            key: 'Nuance is the limit of the facet: "However, this overlooks …; in reality, …". It admits the limit and keeps the position. A contradiction abandons the position; a new facet starts a new paragraph.',
            body: [
              '<p>A body paragraph that ends on its example is a Band 7 paragraph: extended and supported. One that then admits the limit of its own idea, and keeps the position anyway, is what the Band 8 descriptor means by <em>"well-developed"</em>. Nuance proves that you can think about your own argument from the outside: you know where its edge is. It is the fourth move of every body paragraph, and it is a fixed sentence you can drill until it is automatic.</p>',
              '<p>Three tests separate a nuance from its two look-alikes. <strong>Nuance</strong> is about this facet, limits it, and leaves the position standing: <em>"a full ban creates problems for workers with no good bus or train service"</em>; the ban still reduces pollution, but not for free. <strong>Contradiction</strong> cancels the facet: <em>"so a ban would make no difference to the air"</em>; if that is true, the paragraph just argued against itself, and the examiner reads two positions, which is no position. <strong>New facet</strong> changes the subject: <em>"moreover, cars are also a source of jobs"</em> is a different aspect, not a limit of this one; it belongs in Body B or nowhere. Watch for the over-generalised nuance too: <em>always</em>, <em>never</em> and <em>nobody</em> turn a limit into a slogan.</p>',
              '<p>Nuance is written in the grammar of concession. Concede the limit in the subordinate clause, keep the position in the main clause: <em>"Although the same snacks are sold outside the gate, the school day itself no longer teaches the habit."</em> The markers are <em>however</em>, <em>admittedly</em>, <em>although</em>, <em>even so</em>, <em>this overlooks</em>, <em>in reality</em>. The frames give it a shape: <em>"However, looking only at this side misses an important point; in reality, {nuance}, which shows that this is not a perfect solution."</em> Notice the ending: the limit is named, the idea survives.</p>',
              '<p>Put the four moves together and a body paragraph is a progression, not a list: the facet ends with what the mechanism explains, the mechanism ends with what the example shows, the example ends with what the nuance limits. Eighty to a hundred and ten words, one idea. The checker in this app looks for exactly this: a mechanism marker (<em>because</em>, <em>which in turn</em>, <em>works by</em>), an example marker (<em>for example</em>, <em>such as</em>, a named place), a nuance marker (<em>however</em>, <em>although</em>, <em>admittedly</em>), sixty to a hundred and thirty words, no contractions, and the key nouns of the prompt.</p>'
            ],
            simple: [
              '<p>Nuance = the limit of your idea, said honestly, while the position stays. "However, this overlooks…; in reality, …". It is the Band 8 move.</p>',
              '<p>Not nuance: a contradiction ("so it makes no difference") cancels the idea; a new facet ("moreover, cars create jobs") changes the subject. Avoid "always" and "never".</p>',
              '<p>Grammar: "Although [limit], [position still holds]." The paragraph: facet → mechanism → example → nuance, 80–110 words, one idea.</p>'
            ],
            examples: [
              { s: 'However, a full ban creates problems for workers with no good bus or train service, so the ban must come with better transport.', g: 'Nuance: the limit is named, and the position (cars should leave the centre) survives with a condition.' },
              { s: '<s>However, a ban would make no real difference to the air, so cars should stay.</s>', g: 'Contradiction. The paragraph has just argued against itself.' },
              { s: '<s>Moreover, the car industry provides thousands of jobs across the country.</s>', g: 'A new facet, not a limit of this one. It belongs in another paragraph or in no paragraph.' },
              { s: 'Admittedly, students can still buy the same snacks outside the gate; even so, the school day itself no longer teaches the habit.', g: 'Concede in the first clause, keep the position in the second.' }
            ]
          },
          items: [
            { id: 'm04s3q1', type: 'sort', tag: 'tr-no-nuance', level: 'B2', prompt: 'p-cars-city',
              stem: 'Facet A: cars must leave the centre to cut pollution. Sort each follow-up sentence.',
              bins: [{ key: 'nu', label: 'Nuance', hint: 'a limit; position kept' }, { key: 'con', label: 'Contradiction', hint: 'position abandoned' }, { key: 'new', label: 'New facet', hint: 'a different idea' }],
              items: [
                { text: 'However, a full ban creates problems for workers with no good bus or train service.', bin: 'nu' },
                { text: 'However, pollution is not really a problem, so cars should stay in the centre.', bin: 'con' },
                { text: 'However, cars are also a large source of jobs in the car industry.', bin: 'new' },
                { text: 'Admittedly, some traffic simply moves to the roads just outside the banned zone.', bin: 'nu' },
                { text: 'In fact, a ban would make no difference at all to the air.', bin: 'con' },
                { text: 'Moreover, driving lessons are very expensive for young people.', bin: 'new' }
              ],
              why: 'A nuance limits the facet and leaves the position standing. A contradiction cancels the facet, so the essay now has two positions. A new facet is a different aspect of the topic: it may be true, but it is not a limit of this idea, and it belongs in another paragraph.' },
            { id: 'm04s3q2', type: 'choose', tag: 'tr-no-nuance', level: 'B2', prompt: 'p-remote-work',
              stem: 'Facet A: remote work benefits staff and companies. Which sentence is a nuance, a limit that keeps the position?',
              options: ['However, staff left at home will always neglect their duties.', 'However, remote work has also emptied the cafés near city-centre offices.', 'However, without structure it blurs work and home and leads to burnout.', 'However, in the end working from home benefits nobody at all.'], answer: 2,
              why: 'Burnout without structure is a real limit, and the benefit survives it: add structure. "Always neglect" is an over-generalised claim, "benefits nobody" is a contradiction, and the empty cafés are a new facet about city centres, not a limit of this one.' },
            { id: 'm04s3q3', type: 'judge', tag: 'tr-no-nuance', level: 'B2', prompt: 'p-school-snacks',
              given: 'Admittedly, students can still buy the same snacks outside the gate; even so, the school day itself no longer teaches the habit.',
              stem: 'Does this sentence admit a limit while keeping the position that schools should stop selling sugary snacks?', answer: 0,
              hint: 'Check both halves: does the first name a limit, and does the second leave the idea standing?',
              why: 'True. The first clause admits that the ban has a limit, which is honest and expected at Band 8, and the second keeps the position: the school day itself no longer teaches the habit. A nuance abandons the position only when it says the idea makes no difference at all.' },
            { id: 'm04s3q4', type: 'spot', tag: 'tr-no-nuance', level: 'C1', prompt: 'p-cctv-everywhere',
              stem: 'Tap the chunk that turns a nuance into a contradiction.',
              words: ['Admittedly,', 'a determined offender', 'simply moves', 'to the nearest street without a camera,', 'which proves that cameras', 'are completely useless.'], answer: 5,
              fix: 'move crime rather than end it.',
              why: '"Completely useless" cancels the facet: if cameras do nothing, the paragraph has just argued against itself. "Move crime rather than end it" keeps the limit and the position: cameras help, but not everywhere at once.' },
            { id: 'm04s3q5', type: 'bodypara', tag: 'tr-no-nuance', level: 'B2', prompt: 'p-remote-work', side: 'A',
              stem: 'Write Body A for this prompt: the benefit of working from home, with a mechanism, an example and a nuance.',
              keyNouns: ['home', 'employee', 'company', 'productiv'], nuance: true, minWords: 60, maxWords: 130,
              _good: 'One clear benefit of working from home is the time and money it saves for both employees and companies. Removing the daily journey gives staff back two or three hours a day, which in turn raises their energy and their output, while the company pays for less office space. We can see this in Bangkok, where firms that let staff work at home three days a week have moved into smaller offices without losing productivity. However, this only works when the day has a structure; in reality, staff who are left alone at home often work late into the night and burn out, so the saving in travel time can be lost again.',
              _bad: 'Working from home is good for employees and companies. It is very good because everyone likes it and research shows that people work better at home. Studies prove it, so companies should allow it.',
              why: 'Facet, mechanism ("removing the journey … which in turn raises"), example (a Bangkok case the reader can picture), nuance ("however … in reality …") with the position kept. Sixty to a hundred and thirty words, no contractions, and the prompt\'s nouns.' },
            { id: 'm04s3q6', type: 'bodypara', tag: 'tr-generalised', level: 'B2', prompt: 'p-school-snacks', side: 'A',
              stem: 'Write Body A: the first reason to agree, the eating habits formed at school, with mechanism, example and nuance.',
              keyNouns: ['school', 'sugar', 'snack', 'health'], nuance: true, minWords: 60, maxWords: 130,
              _good: 'The first reason is the eating habits that young people form while they are at school. A school canteen is where a student eats the same thing at the same time every day for six years, so taking sweet drinks out of it changes a daily routine, which in turn changes what that person reaches for as an adult. For example, some Bangkok schools have replaced their vending machines with water fountains and fruit stalls, and students there now treat fizzy drinks as a weekend treat rather than a daily habit. Admittedly, students can still buy the same snacks from the shops outside the gate; even so, the school day itself no longer teaches the habit, and that is the point of the ban.',
              _bad: 'Schools should stop selling sugary snacks because it is unhealthy. Sugar is bad for students and everyone knows this. In conclusion, schools must ban it and students will be healthier.',
              why: 'The mechanism is the chain (routine → habit → adult choices), the example is a school the reader can picture, and the nuance concedes the shops outside the gate while keeping the position. A claim repeated three times is not a paragraph.' },
            { id: 'm04s3q7', type: 'choose', tag: 'tr-no-nuance', level: 'C1', prompt: 'p-teen-sleep',
              stem: 'The solution is a later start for older students. Which sentence admits a limit without dropping the solution?',
              options: ['A later start is impossible, because the syllabus could never be finished in time.', 'Students who sleep well do better in their exams and fall ill less often.', 'Older students also need more help choosing their university courses.', 'A later start achieves little if students simply stay up later on their phones.'], answer: 3,
              why: 'A limit with a condition: the later start works only if screen time is also managed, which is why the position pairs the two. "Impossible" abandons the solution, the exam sentence supports it without limiting it, and university choice is a new facet.' }
          ] }
      ],

      /* ------------------------------------------------------------ check */
      check: { id: 'm04ck', name: 'Systems Check', items: [
        { id: 'm04ckq1', type: 'choose', tag: 'tr-generalised', level: 'B1', prompt: 'p-fast-food-tax',
          stem: 'Which sentence explains how a tax on fast food improves health, rather than just claiming it does?',
          hint: 'Ask "and why does that happen?" after each sentence; a claim, a case and a fact leave it unanswered.',
          options: ['A tax on fast food would improve the health of the whole population.', 'A tax raises the price, so people buy less, which in turn improves their diet.', 'Several countries have already taxed fizzy drinks, and producers changed their recipes.', 'Fast food contains far too much fat, salt and sugar for a healthy diet.'], answer: 1,
          why: 'The chain is the mechanism: price → purchases → diet. The first sentence is the claim, the third is an example of the result, and the last is a fact about the food that explains nothing about the tax.' },
        { id: 'm04ckq2', type: 'judge', tag: 'tr-no-example', level: 'B2', prompt: 'p-remote-work',
          given: 'According to a recent survey, 85 per cent of employees are more productive at home.',
          stem: 'Would an examiner accept this as support for the mechanism?', answer: 1,
          hint: 'Could the examiner picture this case, or check this number?',
          why: 'False. The examiner cannot verify the survey or the number, and invented statistics read as memorised language. Replace it with a case: firms in Bangkok that moved into smaller offices after letting staff work at home three days a week.' },
        { id: 'm04ckq3', type: 'sort', tag: 'cc-progression', level: 'B2', prompt: 'p-prisons',
          stem: 'Sort the sentences of a paragraph about punishment into their moves.',
          bins: [{ key: 'm', label: 'Mechanism', hint: 'how it works' }, { key: 'e', label: 'Example', hint: 'where you see it' }, { key: 'n', label: 'Nuance', hint: 'the limit' }],
          items: [
            { text: 'Losing freedom is the direct result of the offender\'s own actions, which is what makes it a punishment.', bin: 'm' },
            { text: 'Fixed sentences for serious or repeated offences show this idea in practice.', bin: 'e' },
            { text: 'However, a purely punitive system leads to high reoffending once prisoners are released.', bin: 'n' },
            { text: 'The threat of a locked door makes the crime cost more than it gains, so fewer people try it.', bin: 'm' },
            { text: 'Courts that add years for every repeat offence are a clear case.', bin: 'e' },
            { text: 'Admittedly, some offenders leave prison angrier than they entered it.', bin: 'n' }
          ],
          why: 'A mechanism has a chain inside it (action → loss of freedom; threat → cost → fewer attempts). An example is a practice you can point at. A nuance concedes the limit with "however" or "admittedly" and leaves the facet standing.' },
        { id: 'm04ckq4', type: 'spot', tag: 'tr-no-nuance', level: 'B2', prompt: 'p-tourism',
          stem: 'Tap the chunk where this nuance abandons the position that visitor numbers should be limited.',
          words: ['Admittedly,', 'visitor money', 'often pays for the very parks', 'that need protecting;', 'this means that', 'limits are unnecessary.'], answer: 5,
          fix: 'any limit must protect that income.',
          why: 'The concession was fine: visitor money does fund conservation. "Limits are unnecessary" then reverses the essay\'s position. A nuance keeps the position with a condition: limit numbers, but keep the income that pays for the parks.' },
        { id: 'm04ckq5', type: 'choose', tag: 'tr-no-example', level: 'B2', prompt: 'p-elderly-care',
          stem: 'Facet A: care for older people is a duty of the whole society. Which example belongs here?',
          options: ['Households where adult children give daily care while holding a full-time job.', 'Research proves that shared care systems are more efficient than family care.', 'National care insurance paid for by contributions from everyone, as in Japan.', 'Retirement villages where wealthy pensioners buy a flat with nursing included.'], answer: 2,
          why: 'A national insurance scheme shows the mechanism of Facet A: the cost shared across society. The households belong to Facet B, "research proves" is unverifiable, and private retirement villages show the opposite of a shared duty.' },
        { id: 'm04ckq6', type: 'select', tag: 'tr-generalised', level: 'C1', prompt: 'p-libraries',
          stem: 'Tick the two sentences that give a mechanism rather than a claim or an example.',
          hint: 'A mechanism has steps inside it; a claim can only be agreed with, and an example is a thing you can point at.',
          options: ['Libraries are still needed in every town.', 'A library offers free space and trained staff, so people without equipment at home can still search well.', 'Branches used for job searches, language classes and free internet access.', 'Online archives let people find reference works without travelling or checking opening hours.', 'Free online archives that researchers use without ever entering a reading room.', 'Library buildings are no longer necessary in the internet age.'], answers: [1, 3], k: 2,
          why: 'A mechanism has a chain: free space and staff → people without equipment can search; online archives → no travel, no opening hours. The two short sentences are claims, and the two noun phrases are examples you can point at.' },
        { id: 'm04ckq7', type: 'bodypara', tag: 'tr-no-example', level: 'B2', prompt: 'p-teen-jobs', side: 'A',
          stem: 'Write Body A: the skills and independence that paid work builds, with a mechanism, a concrete example and a nuance.',
          keyNouns: ['student', 'work', 'job', 'school'], nuance: true, minWords: 60, maxWords: 130,
          _good: 'The strongest reason for work experience is the practical skills and independence that paid work builds. A weekend job puts a teenager in front of real customers, real deadlines and real money, which in turn teaches responsibility in a way that a classroom exercise can only imitate. In Thailand, for example, students who help in a family shop or take Saturday shifts in a café learn to count change, deal with complaints and arrive on time. However, this benefit has a limit: a demanding job can leave a student too tired to study in the evenings, so the hours must be kept short. The skill is real, but it must not cost the student their school results.',
          _bad: 'Work experience is very important for students. Research shows that students with jobs are more successful and everyone agrees that it is good. Therefore all students should get a job before they finish school.',
          why: 'Mechanism ("puts a teenager in front of … which in turn teaches"), a Thai example the reader can picture, and a nuance that limits the hours without dropping the position. "Research shows" and "everyone agrees" are not support.' },
        { id: 'm04ckq8', type: 'order', tag: 'cc-progression', level: 'C1', prompt: 'p-city-flooding',
          stem: 'Put the four moves of this body paragraph in order.',
          items: ['The root of the problem is the covering of land that once soaked up rain with concrete and asphalt.', 'Sealed soil sends every drop straight into drains that were built for a much smaller city, which in turn overloads them within minutes.', 'We can see the effect in the low-lying districts of Bangkok built on former rice fields.', 'Unfortunately, that land has already been built on and cannot easily be turned back into fields.'],
          why: 'Facet, mechanism, example, nuance: each sentence ends with what the next one is about. The facet names the cause, the mechanism explains the chain, the example shows it in one place, and the nuance admits why it is hard to fix.' }
      ] }
    }]
  });
})();
