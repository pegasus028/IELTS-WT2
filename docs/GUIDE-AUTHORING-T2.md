# Writing a High / Medium guidance script for one Task 2 prompt

Standard for `guide/<promptId>.js` and `tools/guide-cases/<promptId>.json` (15 Nov 2026). The model to copy is `guide/p-cars-city.js` with `tools/guide-cases/p-cars-city.json`: read both in full before you write anything. Engine: `guide.js`. Contract: `docs/GUIDANCE-LEVELS.md`. Method: the skill `ielts-writing-task-2` (it wins on Task 2 method). Test: `node tools/guide-test.js <promptId> --essay`.

## 1. What the script is for

Students: T.Chris's private tutees, Thai, 13–17, CEFR B1/B2, target Band 7.5. Girls and one boy: student-facing text stays gender-neutral ("they", "the student", "you"), even though the code comments say "she".

In the Scriptorium a student opens a prompt at **High guidance** (every decision is a multiple-choice question with exactly one right answer; a wrong option is greyed out and its hint appears; she chooses again) or **Medium guidance** (the same decisions as free text; a rule check, then an AI check; hints; she may keep her own answer). Each right answer adds a piece of text to one of four panes (introduction, Body A, Body B, conclusion). When every step is done, the panes hold a complete essay.

So a script is **one model essay cut into its decisions**. Write the essay first, then cut it.

## 2. T.Chris's decisions for these scripts (15 Nov 2026)

- **Tier B2, Band 7–7.5**: use the prompt's `vars.B2` (already reviewed). `tier: 'B2'`.
- **The B2 Universal Spine starter wording** (`template.js` ids `b2-u-i`, `b2-u-a`, `b2-u-b`, `b2-u-c`), populated with the prompt's B2 variables. `spine: 'b2-u'`. The test checks every Spine line word for word around its slots, in order. You may add whole sentences after a Spine sentence (a development sentence, a reference sentence, a short case) to reach the word count, but never change the Spine words.
  - Two of T.Chris's Spine sentences name the facets twice ("The first key point is …" in the introduction and again at the start of Body A). In the introduction use a **short form** of each facet (3–8 words, same meaning), in the body the full B2 facet. The conclusion's "Taking {facetA} together with {facetB}" uses the short forms again.
  - The position in the conclusion is restated **in fresh words** (the skill's rule and the `position` Ward), but the `position` Ward only sees a position when the sentence contains one of the wordings in `writer.js` `POSITION`. The ones that fit a Spine conclusion: a subject from this list + should / must / ought to / need to / cannot (`governments`, `government` does NOT count, `schools`, `parents`, `society`, `societies`, `the state`, `policymakers`, `cities`, `councils`, `individuals`, `families`, `companies`, `employers`, `universities`, `authorities`, `teachers`, `we`); "should / must / ought to / need to + be / not"; "outweigh"; "on balance"; "I believe / I think / I agree / I disagree / I argue"; "in my view / opinion"; "the most sensible / reasonable / effective approach is"; "the view that". Paragraph 1 is covered by the Spine's "argues that". Check with `--essay`: the Ward row must be green.
- **All 37 practice prompts**, after T.Chris has reviewed `p-cars-city`. Mock prompts (`CONTENT.MOCK_PROMPTS`) never get a script.

## 3. Files and limits

- You write exactly two files per prompt: `guide/<promptId>.js` and `tools/guide-cases/<promptId>.json`. Do not edit any other file (not `guide.js`, not the tests, not the prompts, not `guide-index.js` by hand). Do not run git commands that change anything.
- After creating your files run `node tools/guide-test.js --index` (it only rewrites the index and stops), then **your own test**: `node tools/guide-test.js <promptId> --essay`. Use `;` or separate commands, never `&&` after `--index` with a full run, so another writer's half-written file does not stop you.
- ES5 only: `var`, `function`, string concatenation. No arrow functions, `let` / `const`, template literals, regex lookbehind `(?<`. Strings in single quotes; a string with an apostrophe in double quotes or with `\'`.
- The file wrapper is the model's. Put `askFree`, `ai: true` and `v` inside each step.

## 4. Sources of truth

- The prompt: `prompts.js` / `prompts-2.js` (find your id): `type`, `text`, `vars.B2` (eleven `{ok, d:[near-miss, near-miss, near-miss]}`), `modelId`.
- The prompt's model in `models.js`, if it has one (9 prompts do): a checked Band 8 essay at C1 tier. Use it for ideas and facts, not wording (your essay is B2 Spine).
- The Type Switch Card (`lab-content.js LAB.TYPE_SWITCH`, also in the skill): what Facet A / B, Nuance A / B and the Position mean for the type.
- **Check the type, parts and plurals of your prompt before you start** (Task 1 lesson: one batch was told the wrong thing about its charts). A two-part prompt answers each question in its own body; "causes" / "measures" are plural (two each, the second can sit in the nuance); "to what extent" needs an extent word in the position; "advantages and disadvantages" needs a verdict even without "outweigh".

## 5. House rules for the essay

- **Four paragraphs, 260–290 words** (budget about 50 / 95 / 95 / 45). The test fails outside 260–290.
- Paragraph 1: the Spine introduction with the Core Topic, the two facets (short forms) and the position at the end.
- Bodies: facet → mechanism → example → nuance on the Spine, plus at most two added sentences each (a development, a reference sentence, a short case a reader can picture). The nuance limits the facet but **never abandons the position**.
- Conclusion: the Spine conclusion; position in fresh words; the rationale; **no new idea** (the `newidea` Ward flags four or more long words that appear nowhere earlier).
- **Every Ward green** with share 40% (practice): position in paragraph 1 and restated in 4, mechanism / example / nuance in both bodies, at most a third of sentences starting with a linker, **at least two reference phrases** from the `REFERENCE` list in `writer.js` ("this point" in the Spine counts once; add "such a ban", "this policy", "doing so", "the same", "the former / the latter"), register, template share.
- `Writer.checkThesis` passes on the last sentence of paragraph 1; `Writer.checkBody` on both bodies.
- **No run of 8+ words from the prompt.**
- **No invented facts.** No "research shows", no statistic, no named city's policy unless you checked it (then list it in `facts: [{ text, source }]`); the test fails on any digit not in `facts`. A hypothetical is fine ("a nurse on a night shift").
- Formal register: no contractions, no "you", no rhetorical questions, no exclamation marks, no clichés ("hot topic", "double-edged sword", "in a nutshell", "nowadays in this modern era").
- Every connector fits its logical relation: name the relation first (cause, result, contrast, concession, addition, example, restatement, sequence).

## 6. How to cut the essay into steps

Five sections, in this order, with these ids and panes:

| section id | pane | what its steps decide |
|---|---|---|
| `triage` | `null` (her plan; adds nothing to the essay) | **required:** `t-type`, `t-parts`, `t-trap`, `t-core`, `t-facetA`, `t-facetB`, `t-position`; the model adds `t-limits`, `t-example`, `t-budget`, `t-paras` |
| `intro` | `0` | the Spine introduction, piece by piece |
| `bodyA` | `1` | Body A |
| `bodyB` | `2` | Body B |
| `conclusion` | `3` | the conclusion |

- **45–60 steps** (the model has 45; its High run is estimated at 30 minutes; the test fails over 40). Ids start with the section letter: `t-`, `i-`, `a-`, `b-`, `c-`. Labels ≤ 24 characters.
- **Larger pieces than Task 1:** a variable, a frame phrase, a connector, a whole development sentence. Do not chop a Spine frame into single words.
- **The variables.** In triage, `t-core`, `t-facetA`, `t-facetB` and `t-position` ask the *meaning* with the Duelling Hall's options: `ok` = `vars.B2.<key>.ok` exactly, wrong = its three `d` near-misses (they are reviewed). Give each a `v`. In the essay, the same variable is then tested for its **form** (agreement, word form, slot shape: noun phrase / -ing / clause) with your own wrong options. The variables not asked in triage (`mechA`, `exA`, `nuanceA`, `mechB`, `exB`, `nuanceB`, `rationale`) are asked for meaning in the essay with the duel's options. Every one of the eleven needs an essay step with `v` whose right option carries at least half of the variable's content words (lower-case it, drop the final full stop, keep the words).
- **If a step's wrong options come from `d`, its right option must be the duel's `ok`** (the test checks: the duel and High must never disagree).
- Joins: the engine builds each pane as `pre` + text + `post` for every step. `pre` defaults to one space; use `''` for the first step of a pane, `', '` when a comma must come first, `'. '` only when the step before has **no** `post: '.'`. `post` is `','`, `'.'`, `':'`, `';'` or nothing. An option never ends with punctuation that `post` supplies, and never begins with the word the step before ended on.
- The engine capitalises the first letter of a pane and after a full stop: write a sentence-initial option with its capital.

## 7. Options and hints (High)

- Exactly **one** option is defensible in the sentence built so far. Check each wrong option: "could a careful teacher accept this here?" If yes, change it. A wrong option is wrong for **one clear reason**:
  - meaning: the wrong type, a position that does not answer every part, a position that changes side or is absolute, a nuance that abandons the position (or that strengthens the facet instead of limiting it), a mechanism that is really a second claim or the example, an example that is national / invented / off the facet, a rationale that is a fact or a guess instead of a principle;
  - logic: a connector whose relation does not fit (name the relation in the hint);
  - grammar: agreement ("the question matter"), word form after a modal or "while", -ing vs base form, articles ("such ban"), plurals after "each" / "many", adjective for adverb, "worth to", "will" after "if", a double negative, a fragment, a resumptive pronoun ("which … creates it"), spelling pairs (effect / affect, through / though);
  - house rule: a cliché, "research shows", an invented figure, an overgeneralisation ("every", "always", "in the world"), register.
- The three wrong options are in the **same form** as the right one. The right option is the longest in at most a third of the steps (the test checks), and its position is spread over the four places (fixed by the engine's shuffle).
- Each wrong option has **its own hint**: one or two short B1 sentences that say what kind of thing is wrong and where to look. A hint must be true of its option.
- **A hint never gives the answer**: not the right option's words, not its first letter, and **not the Spine line with a gap** ("Your Spine: 'It … by'" leaves one word to guess). Point to My Spellbook instead ("Open My Spellbook: the second sentence of your Spine Body A line"). The test only catches a hint that quotes the answer word for word; reviewers read for the rest.
- `ask`: B1 English, one or two sentences. For a variable step, say "Variable N." first.
- `tag`: one of the 45 REMEDIATION tags in `content.js` (the test checks).

## 8. The Medium fields

- `askFree`: the same decision as a writing task ("Write the linker that starts the limit sentence (a contrast)."). For a Spine frame step, say it is her Spine's words.
- `shape`: what to type, never the answer.
- `expect`: the right option, then in brackets what else is acceptable and anything the AI must know ("(also accepted: however, yet, nevertheless)").
- `accept`: an array of groups; every group must match one alternative (regex source, lower case, no final punctuation; the entry is lower-cased, spaces collapsed, final `. , ; !` removed).
  - **On a step without `ai: true`, every alternative is anchored `^…$`** (the test checks). Loose patterns let broken sentences through: this was the most common review fix on Task 1.
  - Use word boundaries (`\\bban\\b`); a verb alternative must not match a wrong form inside it.
- `reject`: known slips `{ re, hint }`, checked before `accept`; never match the right option or an accepted alternative. Cover the slips in your wrong options plus the usual Thai-learner ones: missing -s, -ing after a modal, base form after "while", "such" + no article, "many" + singular, "will" after "if / when", "worth to", "affect" for "effect", "As a conclusion", clichés, "research shows", figures.
- `ai: true` on every step where she writes a clause or phrase of her own (the variables, positions, development sentences, triage answers in her words). The test wants at least 6 and at most 60% of steps. For those steps add **meaning rejects** too (the duel's near-misses by their key words), so a wrong idea is sent back even when the AI is off.
- `hint`, `hint2`: neither gives the answer (see §7).
- `proper`: names that keep their capitals (Bangkok, Thailand); the capitals check matches whole words.

## 9. The cases file

`tools/guide-cases/<promptId>.json`: a JSON array of `["step-id", "what a student might type", "accept" | "revise" | "not-accept"]`. At least three rows per step: an accepted wording that is not the right option (when `expect` lists one), the typical slips (`revise`), and a wrong idea. Realistic entries only (the model has 235 rows for 45 steps).

## 10. Check, then check again

1. `node tools/guide-test.js --index`, then `node tools/guide-test.js <promptId> --essay` until it prints "all … checks passed".
2. Read the printed essay aloud once as an examiner. Natural? Any join that jars? A pronoun pointing at the wrong noun? A word three times? A nuance that gives up the position? Fix the steps, not the test.
3. Read every step once more as a student who knows the prompt but not the answer: is exactly one option right? Does any hint give it away?

## 11. What to report back

For each prompt: the step count, the word count, the estimated High run, the printed essay, your own doubts (steps where a wrong option might be defensible, hints that might give too much), anything in the prompt, its `vars` or its model that looked wrong (it goes to the findings file for T.Chris, not into a fix), and any rule here you could not follow, with the reason.
