/* QUILLMOOR ACADEMY — story-content.js
   The story layer of Position Control (IELTS Academic Writing Task 2).
   Original world, inspired by school-of-magic stories (IP level B: no
   Harry Potter names, spells, objects or crests anywhere).
   Audience: T.Chris's private tutees (Thai girls 13–17, B1/B2, target Band 7.5).
   Story text is B1: present tense, "you", short sentences, UK spelling.
   Keywords: [[word|short English gloss|Thai gloss]].
   Schema: see QUILLMOOR-SPEC.md. Owner: Fable A. */
(function () {
  window.STORY = {
    version: '2026-10-11',

    /* ------------------------------------------------------------ houses */
    houses: [
      {
        id: 'compass', name: 'Compass', crit: 'TR', critName: 'Task Response',
        values: 'direction, a clear position', main: '#1F3A5F', accent: '#C0C7D1',
        emblem: 'compass rose', head: 'Professor Rhea North', motto: 'Know where you stand.',
        welcome: "Welcome to Compass, where we value direction. You say what you think in the first paragraph, and you still think it in the last. An examiner looks for that before anything else.",
        challengeLine: "Direction is your weakest key for now, so Professor North will read your first and last paragraphs very closely."
      },
      {
        id: 'bridge', name: 'Bridge', crit: 'CC', critName: 'Coherence and Cohesion',
        values: 'order, links that carry meaning', main: '#1F6F6B', accent: '#B8733A',
        emblem: 'stone arch', head: 'Professor Tomás Brigg', motto: 'Every stone carries the next.',
        welcome: "Welcome to Bridge, where we value order. One idea per paragraph, and each sentence hands the reader to the next. A good bridge is one the reader never notices.",
        challengeLine: "Order is your weakest key for now, so Professor Brigg will watch how each sentence leads to the next."
      },
      {
        id: 'lexicon', name: 'Lexicon', crit: 'LR', critName: 'Lexical Resource',
        values: 'precision, the right word', main: '#5B2A5E', accent: '#C9A227',
        emblem: 'open book with a key', head: 'Professor Wen Liang', motto: 'The right word, not the rare word.',
        welcome: "Welcome to Lexicon, where we value precision. The right word with its right partner beats a rare word used slightly wrongly. You will learn words in pairs, never alone.",
        challengeLine: "Precision is your weakest key for now, so Professor Liang will check every word against its partner."
      },
      {
        id: 'loom', name: 'Loom', crit: 'GRA', critName: 'Grammatical Range and Accuracy',
        values: 'control, sentences without flaws', main: '#8E1B2C', accent: '#F1E6CC',
        emblem: "weaver's shuttle", head: 'Professor Ada Weaver', motto: 'No loose threads.',
        welcome: "Welcome to Loom, where we value control. A correct simple sentence beats a faulty clever one, every time. You will learn three or four structures and get them right nearly every time.",
        challengeLine: "Control is your weakest key for now, so Professor Weaver will count your error-free sentences one by one."
      }
    ],

    /* ---------------------------------------------------------- chapters */
    chapters: [

      /* ================================================== CHAPTER 1 */
      {
        id: 'ch1', n: 1, title: 'The Letter', place: 'Hall of Lanterns',
        blurb: 'An owl in the rain, a tram up the moor, and a lantern that reads you.',
        keepsake: { id: 'seal', name: "The letter's wax seal", desc: 'The dark blue seal that opened the door to Quillmoor.' },
        opens: ['plan', 'map', 'pods', 'vids', 'record', 'settings'],
        pages: [
          {
            img: 'story/ch1-01.webp',
            alt: 'A wet grey owl on a Bangkok balcony in heavy rain, holding a letter with a dark blue wax seal.',
            text: "It is August in Bangkok, and the rain has not stopped for three days. You sit by the window with your homework. Then a grey owl lands on the balcony. She is wet and a little grumpy. In her beak is a letter with a dark blue [[seal|a wax stamp that closes a letter|ตราประทับ]]. The letter has your name on it. Your mother says, 'Owls do not deliver letters.' This one does."
          },
          {
            img: 'story/ch1-02.webp',
            alt: 'An open letter on a desk, written in dark ink, with the seal broken beside it.',
            text: "The letter says:\n\n'Dear Student,\n\nQuillmoor Academy teaches argument-craft: the art of holding a [[position|what you think, said clearly|จุดยืน]] and defending it with reasons. You have been chosen for one year of study. Term begins on 1 September.\n\nThe year ends with the Grand Examination: one essay, forty minutes, four [[examiners|the people who mark an exam|ผู้ตรวจข้อสอบ]]. A pass at the Band 7.5 standard earns the Quillmoor seal.\n\nWe look forward to meeting you.\n\nProfessor Marisol Penhallow, Head of Examinations\n\nP.S. The owl is called Nutmeg. Please dry her.'"
          },
          {
            img: 'story/ch1-03.webp',
            alt: 'An old wooden tram with brass lamps climbing a road across a windy moor, a black lake below and a castle above.',
            text: "Two weeks later you stand on a windy moor. An old wooden tram waits at the bottom of the hill. Brass lamps hang from its roof. A girl with short hair jumps on after you. 'I'm Juno,' she says. 'Juno Marlowe. Are you nervous? I am. But nervous is fine, because it means you care.' The tram climbs the moor road. Below you, a black lake shines like ink. Above you, a castle grows out of the rock."
          },
          {
            img: 'story/ch1-04.webp',
            alt: 'A great hall filled with hundreds of floating paper lanterns; a tall woman in a grey robe addresses the new students.',
            text: "The Hall of Lanterns is full of floating paper lanterns. Hundreds of them. A tall woman in a grey robe steps forward. 'I am Professor Penhallow,' she says. 'Here we teach one thing: how to win with words. Not loud words. Clear ones.' A boy with a camera takes your photo. 'Felix Okafor, school paper,' he whispers. 'Where's your [[evidence|facts or examples that show something is true|หลักฐาน]] that you belong here?' He grins. 'Joke. The Lantern decides.'"
          },
          {
            img: 'story/ch1-05.webp',
            alt: 'A tall brass lantern on a stand glowing in four bands of colour: navy, teal, plum and crimson.',
            event: 'sorting',
            text: "A brass lantern stands on a tall stand at the front. It glows in four bands of colour: navy, teal, plum and crimson. 'The Sorting Lantern asks twelve questions,' Penhallow says. 'It finds your strongest [[criterion|a standard used to judge something|เกณฑ์]]. Compass for direction. Bridge for order. Lexicon for the right word. Loom for control. Every house is a strength, and nobody is only one.' Juno squeezes your hand. 'Go on. It doesn't bite. Probably.' You walk up to the light."
          },
          {
            img: 'story/ch1-06.webp',
            alt: 'Long breakfast tables with toast and timetables; a thin grey newspaper sheet lies on every plate.',
            text: "Next morning the long tables are covered with toast and timetables. Juno is in Bridge, and she is already drawing arrows on hers. Your first classes are The Test and Decode the Prompt. 'Numbers first,' Penhallow says. 'Forty minutes. At least 250 words. Four examiners, and each one counts the same. Then learn to read the [[instruction|the sentence that tells you what to do|คำสั่ง]].' A thin grey sheet lands on every plate: The Whisper. 'Firstly, the new students are weak. Moreover, nobody knows why.' No name. No example. Felix frowns. 'Who writes this thing?'"
          }
        ],
        missions: [
          { kind: 'event', event: 'sorting', label: 'Stand before the Sorting Lantern', note: 'Twelve questions. The Lantern finds your strongest key and your house.' },
          { kind: 'sub', id: 'm00s1' }, { kind: 'sub', id: 'm00s2' }, { kind: 'sub', id: 'm00s3' },
          { kind: 'check', id: 'm00l1' },
          { kind: 'sub', id: 'm01s1' }, { kind: 'sub', id: 'm01s2' }, { kind: 'sub', id: 'm01s3' },
          { kind: 'check', id: 'm01l1' }
        ],
        gate: {
          checks: ['m00l1', 'm01l1'], checkIds: ['m00ck', 'm01ck'], extra: [],
          intro: "Penhallow closes her book. 'Two gates. The numbers of the test, and the five kinds of instruction. Nobody writes a word here until she knows what she is being asked.'",
          pass: "'Good,' says Penhallow. 'You know the numbers, and you can name the question. Keep the seal. You have earned it.'"
        },
        ending: {
          img: 'story/ch1-end.webp',
          alt: 'A small dormitory at night, a trunk at the foot of the bed and the blue wax seal on the desk.',
          text: "That night you lie in bed and listen to the wind. Your trunk is at the foot of the bed. The seal from the letter sits on the desk. Juno talks in her sleep about toast. You think about the Lantern, the four colours, and the thin grey sheet with no name. Tomorrow the real work starts: the numbers, the five question types, the parts you must count. And next week, Penhallow says, there is a duel."
        },
        newsroom: 'The Whisper appears on every breakfast plate: no name, no example, and Felix wants to know who writes it.'
      },

      /* ================================================== CHAPTER 2 */
      {
        id: 'ch2', n: 2, title: 'The First Duel', place: 'Debating Chamber',
        blurb: 'One sentence the examiner can quote back. Say it first, hold it to the end.',
        keepsake: { id: 'ribbon', name: 'Duelling ribbon', desc: 'A navy ribbon for a position stated clearly and held to the end.' },
        opens: ['writer'],
        pages: [
          {
            img: 'story/ch2-01.webp',
            alt: 'A round stone chamber with two wooden lecterns and lanterns hanging on chains.',
            text: "The Debating Chamber is a round stone room. Two wooden stands face each other. Lanterns hang on chains above them. 'A duel here has no spells,' says Penhallow. 'It has a position. One sentence that I can [[quote|repeat the exact words someone said|อ้างคำพูด]] back to you. If I cannot quote it, you have not got one.' Juno whispers, 'Say what you think. Then say why. Then stop.'"
          },
          {
            img: 'story/ch2-02.webp',
            alt: 'A confident girl in plum and gold reciting at a lectern while the professor listens with one eyebrow raised.',
            text: "Celeste Ashby duels first. She is in Lexicon, and she has a beautiful voice. 'In today's modern world,' she says, 'this topic is a double-edged sword. Every coin has two sides.' It sounds like music. Penhallow waits. 'Lovely. What do you think?' Celeste blinks. 'Both sides have merit.' 'So, nothing,' says Penhallow. 'You are [[sitting on the fence|refusing to choose a side|ไม่ยอมเลือกข้าง]]. The fence is not a position.'"
          },
          {
            img: 'story/ch2-03.webp',
            alt: 'The heroine, seen from behind, speaking at the lectern; the professor writes a sentence on a slate.',
            text: "Your turn. The question is about school uniforms. You take a breath. 'Schools should keep uniforms, mainly because they remove daily pressure about clothes, although they limit personal expression.' Penhallow writes it on a slate, word for word. 'That I can quote. A marker, a [[claim|a statement that something is true|ข้อกล่าวอ้าง]], a reason, a limit. Fifteen to thirty words. That is a position.' Your hands are shaking. It does not matter."
          },
          {
            img: 'story/ch2-04.webp',
            alt: 'A girl in navy robes pushes back from the other lectern; the heroine holds her ground.',
            text: "Your opponent is Mina Sato from Compass. 'But uniforms are boring!' she says. You feel the pull to change sides. Juno shakes her head. 'Admit the limit. Don't abandon the position.' So you say, 'Yes, they can be boring. That is the limit. But the daily pressure matters more.' Penhallow nods. 'Same position, held to the end. Rule two: say it first, and say it again at the end in fresh words. The examiner must never find it only in the last paragraph.'"
          },
          {
            img: 'story/ch2-05.webp',
            alt: "Felix and a tall seventh-year girl with an editor's badge reading the grey Whisper sheet at breakfast.",
            text: "Next morning The Whisper reports the duel. 'Some say the new girl won. Others say she lost. In conclusion, time will tell.' Felix reads it twice. 'Which some? Which others? And \"in conclusion\" after two sentences?' A tall seventh-year girl sits down. 'Priya Desai, editor of The Lantern. We print what happened, with names and a photo. The Whisper prints fog.' She looks at you. 'You [[persuade|make someone agree with you|โน้มน้าว]] well. Want to help us?'"
          },
          {
            img: 'story/ch2-06.webp',
            alt: 'A notice pinned to the chamber door: THE CHAMBER CAMPAIGN; students crowd around it.',
            event: 'campaign',
            text: "Penhallow pins a notice to the chamber door. 'The Chamber Campaign. Question: should Quillmoor ban The Whisper? Every student pins her position on Monday and holds it until the vote on Friday.' Juno reads it slowly. 'I see two sides. A ban stops the gossip. But a ban also makes it famous.' That is Juno: she always sees the limit. Now you must choose, and stay [[consistent|the same all the way through|คงเส้นคงวา]] for five days.",
            choice: {
              q: 'Your position for the campaign:',
              options: [
                { label: 'Ban The Whisper. Gossip without names harms people.', flag: 'camp-ban' },
                { label: 'Do not ban it. Answer it with better writing, and let it fade.', flag: 'camp-fade' }
              ]
            }
          }
        ],
        missions: [
          { kind: 'sub', id: 'm02s1' }, { kind: 'sub', id: 'm02s2' }, { kind: 'sub', id: 'm02s3' },
          { kind: 'writing', label: 'Your campaign position', note: 'In the Scriptorium, write your position on the campaign question in one sentence: a marker, a claim, then a reason or a limit. Fifteen to thirty words.' },
          { kind: 'check', id: 'm02l1' }
        ],
        gate: {
          checks: ['m02l1'], checkIds: ['m02ck'], extra: [],
          intro: "'One gate,' says Penhallow. 'Show me that you know what a position is, where it goes, and how to write one in a minute. Then the ribbon is yours.'",
          pass: "Penhallow ties a navy ribbon to your sleeve. 'Stated in paragraph one. Held to the end. You may disagree with the whole school, as long as you do it clearly.'"
        },
        ending: {
          img: 'story/ch2-end.webp',
          alt: "The heroine and Juno on the castle steps at dusk, a navy ribbon on the heroine's sleeve.",
          text: "The campaign week ends. The vote is close, and the school decides not to ban The Whisper. Instead, The Lantern will answer it. You and Juno sit on the castle steps. 'You never changed your sentence,' she says. 'Not once. Half the school chose to [[disagree|have a different opinion|ไม่เห็นด้วย]] with you, and you still held it.' You feel the ribbon on your sleeve. Then Penhallow passes. 'Tomorrow, the Map Room,' she says. 'The castle map is alive. It shows a room only when you name its key. There are eleven keys.'"
        },
        newsroom: 'The Whisper reports the duel in fog ("some say… others say"); Priya Desai invites you to The Lantern.'
      },

      /* ================================================== CHAPTER 3 */
      {
        id: 'ch3', n: 3, title: 'The Living Map', place: 'Map Room',
        blurb: 'Eleven brass keys. Name the right one, and a room appears on the map.',
        keepsake: { id: 'mapfrag', name: 'Map fragment', desc: 'A corner of the living map, showing the eleven keys on their hooks.' },
        opens: ['bootcamp'],
        pages: [
          {
            img: 'story/ch3-01.webp',
            alt: 'A huge, mostly blank parchment map on a round table; eleven brass keys hang on hooks on the wall.',
            text: "The Map Room has one round table and one huge map. Most of the map is blank. On the wall hang eleven brass keys, each with a label. Dr Osric Hale, the headmaster, taps the table. 'The castle is an argument,' he says. 'Every room is a part of it. The map shows a room only when you name its key.' You read the labels: Core Topic. Facet A. Mechanism A. Example A. Nuance A. Facet B, Mechanism B, Example B, Nuance B. Position. Rationale."
          },
          {
            img: 'story/ch3-02.webp',
            alt: 'The heroine holds the first brass key over the map; a corridor begins to draw itself in ink.',
            text: "Your prompt is about cars in city centres. You lift the first key and say, 'Banning cars.' Nothing happens. Hale smiles. 'The Core Topic is the whole [[issue|a subject that people argue about|ประเด็น]], as a noun phrase. Not an action.' You try again. 'The regulation of private cars in city centres.' A corridor draws itself across the map. Juno laughs. 'So the map wants the issue, not the verb.'"
          },
          {
            img: 'story/ch3-03.webp',
            alt: 'Two rooms appear on the map, each seen through a different coloured glass lens.',
            text: "Hale hands you three glass lenses. 'Ask the issue one question at a time. What does it cost? What does it do to people? What does it do to health?' Each lens shows a different room. Through the green lens: cleaner air near schools. Through the copper lens: the cost to shop owners. 'Those are your two facets,' says Hale. 'Each [[aspect|one side or part of something|แง่มุม]] carries one body paragraph. Big enough to fill it, small enough to finish it.'"
          },
          {
            img: 'story/ch3-04.webp',
            alt: 'Felix photographs a lit room on the map labelled with a real city street.',
            text: "The first room stays dark. 'A room needs a [[mechanism|how something works, step by step|กลไก]],' Hale says. 'How does it happen?' You think. 'Fewer cars produce fewer exhaust fumes, so the air near schools gets cleaner.' The room glows. 'Now show me where.' 'The low-emission zone in central London.' A street appears, with a sign. Felix lifts his camera. 'There's the example. I can point at it.' A claim says something is true. A mechanism says how it becomes true."
          },
          {
            img: 'story/ch3-05.webp',
            alt: 'Juno holds up the last brass key as a small side room appears next to the lit room.',
            text: "Juno picks up the Nuance key. 'But cleaner air near a school doesn't help a shop owner who loses customers.' A small side room appears. 'Good,' says Hale. 'That is a limit. You admit it, and you keep your position. A limit that changes your position is a contradiction. A limit that starts a new idea is a new paragraph.' Juno looks pleased. Seeing the limit is her gift. The [[consequence|the result of an action|ผลที่ตามมา]] of a good limit is a paragraph the examiner can trust."
          },
          {
            img: 'story/ch3-06.webp',
            alt: 'The grey Whisper sheet on the table beside the map; the heroine and Felix compare it with the lit rooms.',
            text: "The Whisper has an opinion about the map. 'Everyone knows the old map is broken. Research shows this clearly.' Felix taps the page. 'Which research? Where can I point my camera?' He is right. 'Research shows' is not an example. An example is [[concrete|real, something you can see or touch|เป็นรูปธรรม]]: a place, a policy, a school. Penhallow appears at the door. 'Tomorrow, the Duelling Hall. Take one prompt through the first four steps: time, decode, Core Topic, Side A.'"
          }
        ],
        missions: [
          { kind: 'sub', id: 'm03s1' }, { kind: 'sub', id: 'm03s2' }, { kind: 'sub', id: 'm03s3' },
          { kind: 'check', id: 'm03l1' },
          { kind: 'sub', id: 'm04s1' }, { kind: 'sub', id: 'm04s2' }, { kind: 'sub', id: 'm04s3' },
          { kind: 'check', id: 'm04l1' },
          { kind: 'view', view: 'bootcamp', label: 'Duelling Hall: steps 1–4', note: 'Open the Duelling Hall and take one prompt through the first four steps: time, decode, Core Topic and Side A.' }
        ],
        gate: {
          checks: ['m03l1', 'm04l1'], checkIds: ['m03ck', 'm04ck'], extra: [],
          intro: "Hale locks the Map Room. 'Two gates. The first three keys, and the next three. Name an issue, split it into two facets, then say how, where and what the limit is.'",
          pass: "The map rolls itself up and tears off one corner for you. 'Keep it,' says Hale. 'You can read the keys now. Never write a claim without a how and a where again.'"
        },
        ending: {
          img: 'story/ch3-end.webp',
          alt: 'On the map, a new door appears labelled Spellbook Workshop; across the courtyard Celeste takes a grey envelope from an owl.',
          text: "On the map a new door appears: the Spellbook Workshop. From the window you see the courtyard. Celeste stands under the arch. A grey owl drops an envelope into her hands. On the envelope, in thin grey ink: 'A Perfect Essay for Every Student.' She hides it in her robe and looks around. Juno frowns. 'That's the Whisper's ink.' You have a new [[perspective|a way of seeing something|มุมมอง]] on your rival now. She is not lazy. She is scared, and a scared writer will [[generalise|say something is always true, without proof|เหมารวม]] rather than think."
        },
        newsroom: 'The Whisper claims "research shows" the map is broken; Felix asks where the example is, and Celeste receives a grey envelope.'
      },

      /* ================================================== CHAPTER 4 */
      {
        id: 'ch4', n: 4, title: 'The Spellbook', place: 'Spellbook Workshop',
        blurb: 'Fourteen lines, eleven slots, and the rule that the lines must be yours.',
        keepsake: { id: 'clasp', name: 'Spellbook clasp', desc: 'A brass clasp for a spellbook written in your own words.' },
        opens: ['template', 'lab'],
        pages: [
          {
            img: 'story/ch4-01.webp',
            alt: 'A long workshop with wooden benches, blank leather books, inkwells and a teal-robed professor.',
            text: "The Spellbook Workshop smells of leather and ink. Professor Tomás Brigg of Bridge puts a blank book in front of you. 'This is your [[template|a fixed pattern you fill in each time|แม่แบบ]],' he says. 'Four paragraphs, fourteen lines, eleven slots, about 285 words. The lines are your own sentences. The slots change for every prompt.' He writes the budget on the wall. Introduction 50 words. Body A 95. Body B 95. Conclusion 45."
          },
          {
            img: 'story/ch4-02.webp',
            alt: 'Celeste reads from a grey printed page; the ink in her book runs grey and fades as she copies it.',
            text: "Celeste opens her book and copies from the grey envelope. 'In today's modern world, this topic is a hot topic.' The ink in her book turns grey and fades. She tries again. It fades again. Brigg does not laugh. 'Why does it fail?' Juno answers quietly. 'Because it isn't hers. Thirty students got the same page.' 'And the examiner has read it thirty times,' says Brigg. 'A [[memorised|learned by heart, word for word|ท่องจำ]] page is not your English. It does not count.'"
          },
          {
            img: 'story/ch4-03.webp',
            alt: 'The heroine writes her first frame line while a dial on the bench shows 60, 50, 40 and 30.',
            text: "A dial on the bench shows four numbers: 60, 50, 40, 30. 'The share,' says Brigg. 'How much of the essay your spellbook carries. A smaller share is a more advanced book.' You turn it to 50 for now. Then you write fourteen lines, each with a job. Your first [[frame|a sentence shape with a gap to fill|โครงประโยค]]: 'The question of ___ divides opinion in my city.' Brigg listens. 'Read it aloud. If it sounds like you, keep it.' It does."
          },
          {
            img: 'story/ch4-04.webp',
            alt: 'Juno stares at a blank last page; the heroine points at the Position and Rationale slots.',
            text: "Juno is stuck on the last paragraph. 'I see both sides,' she says. 'Seeing both sides is the start,' says Brigg. 'The [[verdict|a final decision|คำตัดสิน]] is the end. And \"it depends\" is not a verdict.' You help her. 'What do you actually think?' 'Cleaner air matters more, because children cannot choose where they breathe.' Brigg nods. 'Verdict, then the one reason. That is your [[rationale|the one reason your verdict is right|เหตุผลหลัก]]. The conclusion evaluates. It never adds a new idea.'"
          },
          {
            img: 'story/ch4-05.webp',
            alt: 'Ten small lanterns in a row above the workshop door, each with a short rule painted on it.',
            text: "Above the door hang ten small lanterns: the Ten Wards. Penhallow reads them. 'Position in paragraph one. Restated in fresh words at the end. Every part answered. Mechanism and example in every body paragraph. A limit that keeps the position. Links by reference, not a linker on every sentence. No clichés. Formal language. Only structures you control. At least 250 words, in your own lines.' She turns to you. 'Check them in the same order, every time. Then send your essay by owl to the examiners.'"
          },
          {
            img: 'story/ch4-06.webp',
            alt: 'An owl carries a sealed essay out of the tower window at dusk; the heroine watches with her spellbook closed under her arm.',
            text: "You take your spellbook into the Duelling Hall and cast it on a real prompt. All eight steps this time. Then you write the full essay in the Scriptorium, check the Ten Wards, and seal it. Nutmeg takes it out of the window. Your first essay is on its way to the examiners. Behind you Celeste is still copying. The grey page is almost blank now. Fewer students use it, and the ink is fading. 'It will come back,' says Felix. 'It always does. Until it can't.'"
          }
        ],
        missions: [
          { kind: 'sub', id: 'm05s1' }, { kind: 'sub', id: 'm05s2' }, { kind: 'sub', id: 'm05s3' },
          { kind: 'check', id: 'm05l1' },
          { kind: 'sub', id: 'm06s1' }, { kind: 'sub', id: 'm06s2' }, { kind: 'sub', id: 'm06s3' },
          { kind: 'check', id: 'm06l1' },
          { kind: 'view', view: 'lab', label: 'Spellbook Workshop: design and save a spellbook', note: 'In Design, choose a share and a target, write your fourteen lines in your own words, and save the spellbook.' },
          { kind: 'view', view: 'bootcamp', label: 'Duelling Hall: all eight steps', note: 'Take one prompt through every step, from time to the Ten Wards.' },
          { kind: 'writing', label: 'Your first full essay', note: 'In the Scriptorium, write a full essay with your spellbook, run the Ten Wards, and send it to the examiners.' }
        ],
        gate: {
          checks: ['m05l1', 'm06l1'], checkIds: ['m05ck', 'm06ck'],
          extra: [
            { id: 'lab-design', label: 'A saved spellbook design', note: 'One spellbook saved in the Spellbook Workshop.' },
            { id: 'essay-sent', label: 'One essay sent to the examiners', note: 'One full essay sent from the Scriptorium.' }
          ],
          intro: "'Four things,' says Brigg. 'Two gates, one saved spellbook, and one essay already flying. A template nobody has used is only a drawing.'",
          pass: "Brigg fits a brass clasp to your book. 'Your lines. Your slots. The examiners will read your words, not somebody else's.'"
        },
        ending: {
          img: 'story/ch4-end.webp',
          alt: 'Night in the courtyard; Celeste sits alone on the steps with the fading grey page, and the heroine pauses nearby.',
          text: "That night Celeste sits alone on the courtyard steps. The grey page in her lap is almost empty. 'Everyone has their own book,' she says. 'And I have this.' You sit down, not too close. 'You have a good voice,' you say. 'Use it on your own sentences. The frames are only [[scaffolding|a frame that helps while you build, then comes down|นั่งร้าน]]. The words inside are the building.' She says nothing. But she does not throw your words away. Tomorrow, the Brewing Cellars, where the Whisper's ink will be boiled. You want to see what it is made of."
        },
        newsroom: 'The Whisper sells "A Perfect Essay for Every Student"; Celeste copies it and her ink fades, while your own essay flies to the examiners.'
      },

      /* ================================================== CHAPTER 5 */
      {
        id: 'ch5', n: 5, title: 'The Potions Lab', place: 'Brewing Cellars',
        blurb: 'Boil the Whisper and the linkers float to the top. Underneath, nothing.',
        keepsake: { id: 'vial', name: 'Brewing vial', desc: 'A small glass vial of clear ink: reference words, no soup.' },
        opens: ['faults'],
        pages: [
          {
            img: 'story/ch5-01.webp',
            alt: 'Stone cellars with copper cauldrons and shelves of labelled bottles: "this policy", "such a ban", "doing so".',
            text: "The Brewing Cellars are cool and quiet. Copper cauldrons sit on low fires. On the shelves are bottles with strange labels: 'this policy', 'such a ban', 'doing so', 'the former', 'the latter'. 'Reference words,' says Brigg. 'They point back without repeating. That is [[cohesion|how sentences hold together|ความเชื่อมโยงของข้อความ]] the examiner does not notice. The descriptors say it plainly: Band 7 uses [[reference|a word that points back to something already said|การอ้างถึง]] and [[substitution|using a short word in place of a longer phrase|การแทนที่]] flexibly.'"
          },
          {
            img: 'story/ch5-02.webp',
            alt: 'A copy of The Whisper dropped into a cauldron; words like Firstly, Moreover and Furthermore float to the top like oil.',
            text: "Felix brings a copy of The Whisper. Brigg drops it into the cauldron. The water turns grey. Then words float to the top like oil: Firstly. Moreover. Furthermore. In addition. In conclusion. 'Linker soup,' says Brigg. 'A listed [[linker|a word that joins ideas, like moreover|คำเชื่อม]] is a sign. A reference word is a link. Cut the sign, keep the link.' You scoop the linkers off. Underneath there is nothing. No claim, no example, no reason. Just water."
          },
          {
            img: 'story/ch5-03.webp',
            alt: 'Juno pours two sentences from one bottle to another; a thin thread of light joins them.',
            text: "Juno pours two sentences into one bottle. 'Known first, new last,' she says. 'Cities have started to charge drivers. This charge pays for buses.' A thread of light joins the end of one sentence to the start of the next. 'The new idea becomes the next sentence's known,' says Brigg. 'That is how a reader walks across a bridge without seeing it.' The potion is clear and [[coherent|clear and logical, easy to follow|ชัดเจนและเป็นเหตุเป็นผล]]. No oil on top."
          },
          {
            img: 'story/ch5-04.webp',
            alt: 'A crimson-robed professor turns a clause into a thick noun phrase in a small glass flask.',
            text: "Professor Ada Weaver of Loom takes the next bench. 'Watch,' she says. She pours in 'Because prices rose, people bought less.' Two clauses, thin and watery. She stirs once. 'Rising prices reduced consumption.' One verb, two noun phrases, and the potion turns thick and gold. '[[Nominalisation|turning a verb or clause into a noun|การเปลี่ยนกริยาเป็นคำนาม]],' she says. 'Regulate becomes regulation. Adopt becomes adoption. Learn the family, not the word. And find the head noun, because the verb must agree with it.'"
          },
          {
            img: 'story/ch5-05.webp',
            alt: "Four labelled bottles on a shelf: inversion, cleft, participle, concession; purple smoke rises from Celeste's bench.",
            text: "Four bottles stand on the top shelf: inversion, cleft, participle, [[concession|admitting the other side is partly right|การยอมรับอีกฝ่ายบางส่วน]]. 'Swaps,' says Weaver. 'One per body paragraph. Three or four structures at ninety per cent beat six at sixty.' Celeste pours all four into one sentence. There is a soft pop and purple smoke. Weaver waves it away. 'And that is why. A correct simple sentence beats a faulty complex one, every time. [[Accuracy|being correct, without errors|ความถูกต้อง]] first.'"
          },
          {
            img: 'story/ch5-06.webp',
            alt: 'A small side room with a workbench and jars labelled with error families; a notice board lists elective classes.',
            text: "At the back of the cellars is the Mending Room. Every wrong answer you give in the castle goes there, and you fix the [[structure|the way the parts of a sentence are built|โครงสร้างประโยค]] with your own hands. A board lists the elective classes too: tenses, the passive, modals, conditionals. Brigg holds up the vial of grey Whisper ink. 'Copied sentences,' he says. 'Careless ones. That is all it is made of. When students write their own words, it has nothing to feed on.' Felix writes that down. Priya will want it."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm07s1' }, { kind: 'sub', id: 'm07s2' }, { kind: 'sub', id: 'm07s3' },
          { kind: 'check', id: 'm07l1' },
          { kind: 'sub', id: 'm08s1' }, { kind: 'sub', id: 'm08s2' }, { kind: 'sub', id: 'm08s3' },
          { kind: 'check', id: 'm08l1' },
          { kind: 'sub', id: 'm09s1' }, { kind: 'sub', id: 'm09s2' }, { kind: 'sub', id: 'm09s3' },
          { kind: 'check', id: 'm09l1' },
          { kind: 'view', view: 'faults', label: 'Mending Room: fix what you broke', note: 'Open the Mending Room and mend the faults waiting there.' }
        ],
        gate: {
          checks: ['m07l1', 'm08l1', 'm09l1'], checkIds: ['m07ck', 'm08ck', 'm09ck'], extra: [],
          intro: "Weaver wipes her hands. 'Three gates. Links the reader cannot see, nouns that carry the action, and one swap per paragraph without smoke.'",
          pass: "Brigg gives you a vial of clear ink. 'No soup. The reader crosses, and never sees the stones underneath. That is the point.'"
        },
        ending: {
          img: 'story/ch5-end.webp',
          alt: 'Snow on the moor; a notice in the hall announces the Midwinter Tournament in the Examination Hall.',
          text: "Snow falls on the moor. In the hall a notice goes up: the Midwinter Tournament, in the Examination Hall. It is open to anyone with a clasp on her spellbook. A timed run, a prompt cast against the clock, and a full forty-minute essay. Juno is already signing her name. Then Mr Fenwick, the librarian, walks past with a bunch of iron keys. 'When you are done playing,' he says, 'the Long Library has a question for you. About the Locked Stacks. And about ink.'"
        },
        newsroom: 'The Whisper is boiled in a cauldron: linker soup on top, nothing underneath; Brigg finds the ink is made of copied sentences.'
      },

      /* ================================================== CHAPTER 6 */
      {
        id: 'ch6', n: 6, title: 'The Library and the Newsroom', place: 'Long Library',
        blurb: 'Words shelved with their partners, six error families, and a quill caught in the act.',
        keepsake: { id: 'press', name: 'Press badge', desc: 'A Lantern press badge, for the story that named the Quill.' },
        opens: [],
        pages: [
          {
            img: 'story/ch6-01.webp',
            alt: 'A long library where every book is chained to a partner book; a plum-robed professor reads two titles together.',
            text: "In the Long Library the books are shelved in pairs. 'Make' sits next to 'a mistake'. 'Heavy' sits next to 'rain'. 'Mitigate' is chained to 'climate change', and 'act as' to 'a deterrent'. Professor Wen Liang of Lexicon runs a finger along the chain. 'A [[collocation|two or more words that usually go together|คำที่มักใช้คู่กัน]] is a word and its partner. The right partner for an ordinary word beats a rare word used slightly wrongly. Rarity is not the goal. Being [[precise|exact and accurate|แม่นยำ]] is.'"
          },
          {
            img: 'story/ch6-02.webp',
            alt: 'An iron gate to the Locked Stacks; behind it, shelves of books labelled "kids", "a lot of", "in a nutshell".',
            text: "Mr Alder Fenwick unlocks an iron gate. Behind it are the Locked Stacks. Contractions. 'You'. 'Kids'. 'A lot of'. Questions with no answer. Exclamation marks. And a whole shelf of [[clichés|phrases used so often they mean nothing|สำนวนซ้ำซาก]]: 'double-edged sword', 'in a nutshell', 'every coin has two sides'. 'They are not evil,' says Fenwick. 'Most are just not [[formal|suitable for serious writing|เป็นทางการ]] enough for an essay. Wrong [[register|the level of formality in language|ระดับภาษา]]. And a cliché is worse, because it is somebody else's sentence.' Celeste reads the shelf for a long time. Then she walks away without a word."
          },
          {
            img: 'story/ch6-03.webp',
            alt: 'Professor Weaver auctions sentences from a lectern; students hold up cards naming an error family.',
            text: "Professor Weaver runs the error auction. She reads a sentence, and you name the family. 'Government should give advices.' You hold up two cards: [[article|a, an or the|คำนำหน้านาม]] and plural. 'The government. Advice never takes -s.' Six families: article, plural, [[agreement|the verb matching its subject|ความสอดคล้องของประธานและกริยา]], punctuation, word form, spelling. 'Name the family,' says Weaver, 'and the fix stays fixed.' Then she points at the Mending Room door. 'Fewer than five faults waiting. That is my gate.'"
          },
          {
            img: 'story/ch6-04.webp',
            alt: 'Celeste alone at a library table at dusk, writing in a new book; the grey page lies torn in the bin.',
            text: "You find Celeste at a table by the window. The grey page is torn up in the bin. She is writing in a new book, slowly. 'It wasn't mine,' she says. 'It was never mine.' Her first line reads: 'The debate over ___ matters to my family because ___.' She reads it aloud, like you did. The ink stays black. 'That sounds like you,' you say. She almost smiles. 'It had better. I'm the only one who can write it.'"
          },
          {
            img: 'story/ch6-05.webp',
            alt: 'The Lantern office at night: printing presses, Priya with a lamp, Felix with his camera, the heroine with a notebook.',
            text: "The Lantern office is a tower full of printing presses. Priya spreads twelve issues of The Whisper on the floor. 'Same twelve phrases, every time,' she says. 'No names, no [[sources|where information comes from|แหล่งที่มา]]. It cannot answer a question, because nobody wrote it.' At midnight you follow the smell of ink to the Locked Stacks. There, on a long grey roll, a quill writes by itself. Torn copied essays lie around it like food. Felix's camera flashes. 'There's the example.'"
          },
          {
            img: 'story/ch6-06.webp',
            alt: 'The front page of The Quillmoor Lantern with the photograph of the quill; students read it in the hall.',
            text: "The Lantern prints it the next morning:\n\n'THE WHISPER IS A QUILL. Our photographer found the charmed quill in the Locked Stacks at midnight. It copies careless sentences and signs nothing. It has no sources; consequently, it has no answers. Readers are advised to write their own.'\n\nThe article has names, a photo and a time. The grey sheets stop. Priya pins a press badge on your robe. 'That,' she says, 'is how you [[expose|show the truth about something hidden|เปิดโปง]] a rumour. With an example.'"
          }
        ],
        missions: [
          { kind: 'sub', id: 'm10s1' }, { kind: 'sub', id: 'm10s2' }, { kind: 'sub', id: 'm10s3' },
          { kind: 'check', id: 'm10l1' },
          { kind: 'sub', id: 'm11s1' }, { kind: 'sub', id: 'm11s2' }, { kind: 'sub', id: 'm11s3' },
          { kind: 'check', id: 'm11l1' },
          { kind: 'view', view: 'faults', label: 'Mending Room: fewer than five faults due', note: 'Mend your faults until fewer than five are waiting.' }
        ],
        gate: {
          checks: ['m10l1', 'm11l1'], checkIds: ['m10ck', 'm11ck'],
          extra: [{ id: 'faults-under-5', label: 'Fewer than five faults due', note: 'The Mending Room has fewer than five faults waiting.' }],
          intro: "Liang and Weaver stand together. 'Two gates and a tidy Mending Room. The right partner for every word, and the six families named on sight.'",
          pass: "Fenwick locks the Stacks behind you. 'Precise words, formal words, and almost no loose threads. You can leave the library now. The Examination Hall is waiting.'"
        },
        ending: {
          img: 'story/ch6-end.webp',
          alt: 'The heroine, Juno, Felix and Celeste walking together towards the tall doors of the Examination Hall.',
          text: "Spring comes to the moor. The Whisper does not come back. Celeste walks to class with you now, her own book under her arm. 'Four examiners,' says Juno on the stairs. 'One essay. Forty minutes.' Felix pats his camera. 'And I'm not allowed to take photos in there.' Penhallow waits at the top. 'The Grand Examination is in four weeks,' she says. 'Before that, I will tell you exactly what each examiner is looking for. In plain words. No fog.'"
        },
        newsroom: 'The Lantern investigates: twelve phrases, no sources; at midnight Felix photographs the Gossip Quill in the Locked Stacks, and the front page names it.'
      },

      /* ================================================== CHAPTER 7 */
      {
        id: 'ch7', n: 7, title: 'The Grand Examination', place: 'Examination Hall',
        blurb: 'Four examiners, four gates, one essay in forty minutes. In plain words.',
        keepsake: { id: 'seal7', name: 'The Quillmoor seal', desc: 'The seal of the Academy, for an essay at the Band 7.5 standard.' },
        opens: ['models'],
        pages: [
          {
            img: 'story/ch7-01.webp',
            alt: 'Four professors seated at a long table in a high hall: navy, teal, plum and crimson robes; Penhallow stands before them.',
            text: "Four examiners sit at a long table: North, Brigg, Liang, Weaver. Penhallow stands in front. 'Each one gives a whole band for one thing. I will say what, in plain words.' She points at North. 'Task Response. A clear position held from first paragraph to last, and every idea extended with a how and a where. Ideas that stay general cannot pass seven.' Then Brigg. 'Coherence and Cohesion. One idea per paragraph, clear progress, links by reference. If he can follow with ease, that is eight.'"
          },
          {
            img: 'story/ch7-02.webp',
            alt: 'Professor Liang holds up a pair of chained words; Professor Weaver holds up a row of flawless sentences.',
            text: "'Lexical Resource,' says Penhallow, pointing at Liang. 'Precise words with their partners, some less common ones used well, and the right register. Precision, not rarity.' Then Weaver. 'Grammatical [[Range|the variety of things you can do|ความหลากหลาย]] and Accuracy. A variety of complex structures with frequent error-free sentences is seven. Most sentences error-free is eight.' She looks at the room. 'Four whole bands. The seal needs their average at 7.5: two eights and two sevens, for example. The real test marks Task 2 on the same four things, at the same [[standard|the level you must reach|มาตรฐาน]]. Then it adds your Task 1 report, which counts half as much, and reports one Writing band.'"
          },
          {
            img: 'story/ch7-03.webp',
            alt: 'The living map laid out with four coloured overlays: opinion, advantages, problem and solution, two-part.',
            text: "Hale lays four coloured sheets over the map. 'The same eleven keys, moved for other questions,' he says. 'Opinion: two reasons for one position. Advantages: weigh, do not list. Problem and solution: draw the arrow from each [[cause|the reason something happens|สาเหตุ]] to its [[solution|a way to fix a problem|ทางแก้ไข]]. Two-part: one body paragraph per question.' Mina raises a hand. 'And if it asks whether the advantages [[outweigh|be more important than|มีน้ำหนักมากกว่า]] the disadvantages?' 'Then it is an opinion question in disguise. Say which side is heavier, and why.'"
          },
          {
            img: 'story/ch7-04.webp',
            alt: 'The Exemplar Archive: nine framed essays on a wall, students reading them for shape, a large clock set to forty minutes.',
            text: "In the Exemplar Archive nine essays by past Graduates hang on the wall. 'Read them for the shape,' says Penhallow. 'Not to copy. Copying is what the Quill did.' Then she sets the big clock. 'The [[protocol|the fixed steps you follow every time|ขั้นตอนปฏิบัติ]]: five minutes to decode and fill the keys, thirty to write, five to check. Position on the page by minute ten. Hard stop at forty.' You take three mock exams that month. On paper you count words by the line. Nobody checks your spelling for you."
          },
          {
            img: 'story/ch7-05.webp',
            alt: 'Exam papers on desks; thin grey words appear in the margins and students cross them out with black ink.',
            text: "On the morning of the Grand Examination, thin grey words appear in the margins of the papers. 'In today's modern world.' 'A double-edged sword.' 'Research shows.' The Quill's last trick. Celeste sees it first and laughs out loud. 'Nice try.' One by one, students cross the grey words out. The ink has nothing to feed on. It fades to nothing. Penhallow does not even look up. 'A cliché is a phrase somebody else wrote first,' she says. 'We only mark what you wrote. Begin.'"
          },
          {
            img: 'story/ch7-06.webp',
            alt: 'The heroine, seen from behind, writing at a desk in the silent hall; the clock shows thirty-five minutes.',
            text: "Forty minutes. You open your spellbook in your head and fill the keys. Your position is on the page by minute ten. Body A: facet, mechanism, example, limit. Body B the same. At minute thirty-five you stop and check the Ten Wards in order. You [[proofread|read carefully to find and fix mistakes|ตรวจทาน]] for your own top three errors. Then you put your pen down. Juno is still writing her last line. Celeste is already done, and smiling. Nutmeg carries the essays to the examiners."
          }
        ],
        missions: [
          { kind: 'sub', id: 'm12s1' }, { kind: 'sub', id: 'm12s2' }, { kind: 'sub', id: 'm12s3' },
          { kind: 'check', id: 'm12l1' },
          { kind: 'sub', id: 'm13s1' }, { kind: 'sub', id: 'm13s2' }, { kind: 'sub', id: 'm13s3' },
          { kind: 'check', id: 'm13l1' },
          { kind: 'view', view: 'models', label: 'Exemplar Archive: read the nine model essays', note: 'Read them for the shape of a Band 8 paragraph, not to copy.' },
          { kind: 'writing', label: 'Three mock examinations', note: 'Three full essays in the Scriptorium at forty minutes each, then send each one to the examiners.' }
        ],
        gate: {
          checks: ['m12l1', 'm13l1'], checkIds: ['m12ck', 'm13ck'],
          extra: [{ id: 'best-band', label: 'An essay marked at 7.5 or above', note: 'One essay sent to the examiners and marked at Band 7.5 or higher (your best band).', min: 7.5, field: 'bestBand' }],
          intro: "Penhallow stands alone before the table. 'Two gates, and then the only thing that matters: one essay, marked by the four examiners at the 7.5 standard. Everything else was practice for this.'",
          pass: "Four verdicts come back by owl. The average is 7.5 or above. Penhallow presses the Quillmoor seal into warm wax. 'Clear, flexible, precise, controlled. Your own words. Verba vincunt.'"
        },
        ending: {
          img: 'story/ch7-end.webp',
          alt: 'The Hall of Lanterns at night, lanterns lit in all four colours; the heroine holds a sealed letter and looks out over the black lake.',
          text: "The Hall of Lanterns is lit in all four colours tonight. Your house cheers when your name is read. Juno hugs you so hard your badge bends. Celeste shakes your hand, and then, after a moment, hugs you too. Felix takes one photo, with permission. Outside, the black lake is still. The real test has the same four criteria and the same forty minutes. The difference is that now you are [[flexible|able to change and adapt easily|ยืดหยุ่น]] enough to meet any prompt, and you know where you stand."
        },
        newsroom: 'The Quill makes one last attempt, writing clichés in the exam margins; the students cross them out and it fades for good.'
      }
    ],

    /* ------------------------------------------------------------ events */
    events: {
      campaign: {
        title: 'The Chamber Campaign',
        pages: [
          {
            img: 'story/ev-campaign-01.webp',
            alt: 'Students pinning position sentences to a board in the Debating Chamber.',
            text: "Monday. Every student pins one sentence to the chamber board: her position on the question. Penhallow reads them all. 'A marker, a claim about the question, a reason or a limit. Fifteen to thirty words. If I cannot quote it, take it down and try again.' You write yours in the Scriptorium first, then pin it. Felix photographs the board. 'This,' he says, 'is a record. You can't change it later.'"
          },
          {
            img: 'story/ev-campaign-02.webp',
            alt: 'Celeste speaking in the chamber while students look confused; a lantern above her flickers.',
            text: "Wednesday. Celeste speaks first. She begins for the ban. Then, halfway through, she is against it. Then she is for it again. The lantern above her flickers. 'Which is it?' asks Penhallow. Celeste looks at her notes. 'Both have merit.' A few people laugh, not kindly. Juno does not laugh. 'She's not stupid,' Juno says to you. 'She just has nothing of her own to hold on to.'"
          },
          {
            img: 'story/ev-campaign-03.webp',
            alt: 'Mina challenges the heroine across the chamber; the heroine answers calmly from her stand.',
            text: "Thursday. Mina attacks your position hard. Whichever side you chose, she has the other one ready. You feel the pull again. So you do what you did in the duel: you admit the limit, and you keep the sentence. 'Yes, that is a real cost. But my position stands, because…' Penhallow writes nothing down. She does not need to. Your sentence is still the one on the board."
          },
          {
            img: 'story/ev-campaign-04.webp',
            alt: 'Friday: the vote; ribbons are tied to the sleeves of students whose sentence never changed.',
            text: "Friday. The vote is close, and your side may win or lose. Penhallow ties ribbons to sleeves, and the vote does not decide who gets one. 'A held position that loses the vote still earns the ribbon,' she says. 'A position that changes earns nothing, even if it wins. Examiners do not mark your opinion. They mark whether you have one, and whether you keep it.' The school decides to answer The Whisper, not ban it. The Lantern gets to work."
          }
        ]
      },
      tournament: {
        title: 'The Midwinter Tournament',
        pages: [
          {
            img: 'story/ev-tournament-01.webp',
            alt: 'The Examination Hall decorated for midwinter; a great clock, rows of desks, students in four house colours.',
            text: "The Examination Hall is cold and bright. A great clock hangs over the door. Dr Hale reads the rules. 'Three tasks. A timed run through the Duelling Hall. One prompt cast with your spellbook, two minutes per key. And one full essay in forty minutes.' Penhallow adds one line. 'Nobody loses house points here. You only find out how fast your own words come when the clock is running.'"
          },
          {
            img: 'story/ev-tournament-02.webp',
            alt: 'Students at desks with hourglasses; the heroine fills the eleven keys on a slate against the clock.',
            text: "The first two tasks are about speed, not beauty. Decode the instruction sentence. Name the type. Fill the eleven keys on a slate, two minutes each. Juno finishes the keys with time to spare, then spends it all on the nuance. Celeste runs out of time on the example. 'I had no place to point at,' she says afterwards. 'Next time I will think of one first.'"
          },
          {
            img: 'story/ev-tournament-03.webp',
            alt: 'The hall in silence as the clock reaches forty minutes; a token on a ribbon is handed to each student who finished all three tasks.',
            text: "Then the essay. Forty minutes, blank page, your own spellbook in your head. At minute thirty-five you stop and check the Ten Wards. At minute forty you put your pen down, finished or not. Hale hands a small brass token to everyone who completes all three tasks. 'It is not a band,' he says. 'It is proof that you can do it under a clock. Keep it in your trunk.'"
          }
        ],
        tasks: [
          { id: 'tour-duel', label: 'A timed Duelling Hall run', view: 'bootcamp', note: 'Take one prompt through all eight steps against the clock.' },
          { id: 'tour-cast', label: 'Cast one prompt at two minutes per key', view: 'lab', note: 'In the Spellbook Workshop, cast your spellbook on one prompt and fill every variable in two minutes each.' },
          { id: 'tour-essay', label: 'A forty-minute essay', view: 'writer', note: 'A full essay in the Scriptorium at forty minutes, then send it to the examiners.' }
        ]
      }
    },

    /* ------------------------------------------------------- map and end */
    mapIntro: "This is the living map of Quillmoor. A room appears when you earn its key, so finish each chapter and the castle grows.",
    finale: {
      text: "You came to Quillmoor with a wet owl and a letter. You leave with a seal, a spellbook in your own words, and four examiners who could follow every line. The Gossip Quill is gone, because nobody feeds it any more. Juno still sees two sides, and now she can choose one. Celeste writes in black ink. Felix is still asking where the example is. The real test waits in Bangkok: same four criteria, same forty minutes, same you. Verba vincunt. Words win."
    }
  };
})();
