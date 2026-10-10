/* QUILLMOOR ACADEMY — sorting.js
   The Sorting Lantern: twelve questions, three per examiner's criterion
   (TR Compass, CC Bridge, LR Lexicon, GRA Loom). Each item tests real
   IELTS Task 2 English; the wizarding frame is only in the stem.
   Mixed B1/B2 (six each). UK spelling. Schema: QUILLMOOR-SPEC.md.
   Key positions scripted before writing: 0,2,1,3 / 3,1,0,2 / 1,3,2,0.
   Owner: Fable B. */
(function () {
  window.SORTING = {
    intro: "The Lantern asks twelve questions. Each one tests one of four keys: direction, order, the right word, or control. Answer honestly, because the Lantern only wants to know where you are strong.",
    tieLine: "Two bands glow equally bright. The Lantern cannot choose, so the choice is yours. Whichever you pick, you carry both strengths.",
    results: {
      compass: "The navy band burns brightest, so Compass it is: you know where you stand.",
      bridge: "The teal band burns brightest, so Bridge it is: your sentences carry the reader across.",
      lexicon: "The plum band burns brightest, so Lexicon it is: you reach for the right word.",
      loom: "The crimson band burns brightest, so Loom it is: your sentences have no loose threads."
    },
    items: [
      /* ---------------------------------------------------- s01 TR B1 */
      {
        id: 's01', crit: 'TR', cefr: 'B1',
        stem: "The Lantern shows this prompt: 'Secondary schools should start later. To what extent do you agree or disagree?' Which sentence is a clear position?",
        options: [
          "I agree that schools should start later, mainly because tired students learn less, although parents' work hours limit this.",
          "There are strong advantages and also clear disadvantages to starting the school day later, and each side has good arguments.",
          "Students are tired in the morning because they use phones late at night and have too much homework.",
          "Schools should give students less homework, since this is the real reason they arrive at school tired."
        ],
        answer: 0,
        why: "A position says what you think, gives a reason and admits a limit. Sitting on the fence, explaining causes or changing the topic does not answer the question."
      },
      /* ---------------------------------------------------- s02 CC B2 */
      {
        id: 's02', crit: 'CC', cefr: 'B2',
        stem: "Fill the gap with a link that points back without repeating: 'Some cities charge drivers who enter the centre. ___ pays for better buses.'",
        options: [
          "It",
          "Charging drivers who enter the centre",
          "Such a charge",
          "The former"
        ],
        answer: 2,
        why: "A noun phrase that points back, such as 'such a charge', links without repeating. 'It' has no clear noun to point to, and 'the former' needs two named things."
      },
      /* ---------------------------------------------------- s03 LR B1 */
      {
        id: 's03', crit: 'LR', cefr: 'B1',
        stem: "Choose the verb that goes with this noun: 'Heavy traffic ___ serious air pollution in Bangkok.'",
        options: [
          "makes",
          "causes",
          "does",
          "gives"
        ],
        answer: 1,
        why: "'Cause' is the partner of 'pollution', 'damage' and 'problems'. 'Make' is the common mistake: we make a decision or a mistake, but we cause pollution."
      },
      /* --------------------------------------------------- s04 GRA B2 */
      {
        id: 's04', crit: 'GRA', cefr: 'B2',
        stem: "Professor Weaver reads four sentences about online lessons. Which one has no grammar error?",
        options: [
          "Although online lessons are cheap, but they need a reliable connection.",
          "Despite online lessons are cheap, they need a reliable connection.",
          "Online lessons are cheap, however they need a reliable connection.",
          "Although online lessons are cheap, they need a reliable connection."
        ],
        answer: 3,
        why: "'Although' already shows the contrast, so 'but' is not needed. 'Despite' takes a noun or -ing form, not a clause, and 'however' cannot join two clauses with only a comma."
      },
      /* ---------------------------------------------------- s05 TR B2 */
      {
        id: 's05', crit: 'TR', cefr: 'B2',
        stem: "The prompt has two questions: 'Why do young people now watch short videos instead of reading? Is this positive or negative?' Which position answers both?",
        options: [
          "Short videos are popular because they are free, fast and easy to watch on a phone at any time.",
          "This essay will first explain why young people prefer short videos and then discuss whether the change is positive or negative.",
          "This change is mostly negative, since short videos weaken young people's attention and the habit of reading.",
          "Short videos appeal because they fit into short breaks, and this is mainly negative, as the habit of reading fades."
        ],
        answer: 3,
        why: "A two-part prompt needs both answers in the position: the reason and the verdict. Announcing the essay, answering only one question, or giving no verdict leaves a part unanswered."
      },
      /* ---------------------------------------------------- s06 CC B1 */
      {
        id: 's06', crit: 'CC', cefr: 'B1',
        stem: "Which sentence continues this paragraph logically? 'Working from home saves the time people spend travelling. This time can go to family or rest.'",
        options: [
          "Moreover, many people enjoy the journey to work.",
          "As a result, rested workers make fewer mistakes.",
          "However, rested workers make fewer mistakes.",
          "In addition, offices are expensive for companies to rent."
        ],
        answer: 1,
        why: "The new idea in one sentence becomes the known idea in the next: rest leads to fewer mistakes, a result. 'However' signals contrast, and the other sentences change the subject."
      },
      /* ---------------------------------------------------- s07 LR B2 */
      {
        id: 's07', crit: 'LR', cefr: 'B2',
        stem: "Which phrase can open a formal essay without a cliché? 'The role of smartphones in the classroom ___.'",
        options: [
          "divides teachers and parents",
          "is a double-edged sword",
          "is a really big deal for schools",
          "is a hot topic in today's modern world"
        ],
        answer: 0,
        why: "'Divides teachers and parents' says something precise. 'Double-edged sword' and 'hot topic' are clichés examiners have read a thousand times, and 'a really big deal' is too informal."
      },
      /* --------------------------------------------------- s08 GRA B1 */
      {
        id: 's08', crit: 'GRA', cefr: 'B1',
        stem: "Find the head noun, then choose the verb: 'The number of students who use tutoring centres ___ every year.'",
        options: [
          "are rising",
          "have risen",
          "is rising",
          "rising"
        ],
        answer: 2,
        why: "The head noun is 'number', which is singular, so the verb is 'is rising'. The plural 'students' sits closer to the gap but is not the subject."
      },
      /* ---------------------------------------------------- s09 TR B1 */
      {
        id: 's09', crit: 'TR', cefr: 'B1',
        stem: "Your introduction says: 'Schools should keep uniforms, mainly because they remove daily pressure about clothes.' Which conclusion keeps the same position in fresh words?",
        options: [
          "In conclusion, uniforms have advantages and disadvantages, so each school should decide for itself.",
          "Overall, a uniform rule is worth keeping, because it frees students from daily worry about clothes.",
          "In conclusion, schools should keep uniforms, mainly because they remove daily pressure about clothes.",
          "Overall, uniforms should stay, and schools should also ban expensive phones, because phones cause even more pressure."
        ],
        answer: 1,
        why: "The conclusion restates the position in new words and adds nothing new. Copying the sentence, turning it into a fence, or adding a new idea all weaken Task Response."
      },
      /* ---------------------------------------------------- s10 CC B2 */
      {
        id: 's10', crit: 'CC', cefr: 'B2',
        stem: "These four sentences make one body paragraph about online lessons. Which one should come first?",
        options: [
          "For example, a student in a rural province can follow a lesson from a teacher in Bangkok.",
          "This happens because a recorded lesson removes the cost of travel and of a classroom.",
          "Admittedly, this only works where the internet connection is reliable.",
          "The main advantage of online lessons is that they reach students far from good schools."
        ],
        answer: 3,
        why: "A body paragraph opens with its central idea. 'This happens' and 'For example' both point back to something already said, so they cannot open, and a limit comes last."
      },
      /* ---------------------------------------------------- s11 LR B1 */
      {
        id: 's11', crit: 'LR', cefr: 'B1',
        stem: "Replace 'a lot of' with a formal phrase: 'Governments spend a lot of money on roads.'",
        options: [
          "lots of",
          "tons of",
          "a great deal of",
          "a large number of"
        ],
        answer: 2,
        why: "'A great deal of' is formal and goes with an uncountable noun like money. 'Lots of' and 'tons of' are spoken English, and 'a large number of' needs a plural noun."
      },
      /* --------------------------------------------------- s12 GRA B2 */
      {
        id: 's12', crit: 'GRA', cefr: 'B2',
        stem: "Complete the sentence with the correct conditional: 'If governments ___ sugary drinks more heavily, fewer children ___ obese.'",
        options: [
          "taxed … would become",
          "will tax … would become",
          "taxed … will become",
          "would tax … would become"
        ],
        answer: 0,
        why: "An unreal or unlikely situation uses a past form in the if-clause and 'would' in the result. 'Will' and 'would' do not normally go inside the if-clause."
      }
    ]
  };
})();
