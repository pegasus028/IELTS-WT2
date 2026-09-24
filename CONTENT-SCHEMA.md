# Position Control — content authoring schema

Position Control is a self-study web app for IELTS Academic Writing **Task 2** (the 250-word argument essay). Students are Thai teenagers aged 12–17 at CEFR B1–C1 at Satriwithaya School EP, Bangkok; the class track aims at Band 7, the tutoring track at Band 8. Read `content.js` for the tag dictionary (`REMEDIATION`), the question types (`TYPES`), the eleven variables (`VARIABLES`); `template.js` for the frames and playbooks; and `prompts.js` / `prompts-2.js` for the prompt bank before writing anything. `docs/01-IELTS-Task2-Research-and-Method.md` is the method the modules teach.

## File you write

`topic-XX.js` (XX = two-digit module number). Plain ES5, no template literals, no arrow functions, no trailing commas. The file pushes exactly one module object onto `window.CONTENT.TOPICS`:

```js
/* POSITION CONTROL — topic-02.js · Module 02 Position */
(function () {
  var T = window.CONTENT.TOPICS;
  T.push({
    id: 'm02', n: 2, code: 'Module 02', name: 'Position', art: 'signal', cefr: 'B1–C1',
    blurb: 'One sentence the examiner can quote back.',
    levels: [{
      id: 'm02l1', n: 1, name: 'Position', cefr: 'B1–C1', blurb: 'Same as module blurb or shorter.',
      subs: [
        { id: 'm02s1', name: 'What a position is', cefr: 'B1',
          theory: {
            key: 'One sentence that is the whole idea.',
            body: ['<p-worth of HTML, may use <em>, <strong>, <u>>', '…2–4 paragraphs…'],
            simple: ['Same idea in plainer B1 English, 2–3 short paragraphs'],
            examples: [{ s: 'An example sentence (may use <s>struck</s> for wrong bits)', g: 'gloss: what it shows' }]
          },
          items: [ /* 7 items */ ] },
        { id: 'm02s2', /* … */ },
        { id: 'm02s3', /* … */ }
      ],
      check: { id: 'm02ck', name: 'Systems Check', items: [ /* 8 items */ ] }
    }]
  });
})();
```

`art` is one of: chip, layers, stack, clock, signal, grid, lexicon, scope, sim (decorative; pick any).

## Item shapes (engine.js renders and marks these)

Every item has: `id` (module + sub + q, e.g. `m02s1q4`, checks `m02ckq4`), `type`, `tag` (a key of `REMEDIATION` in content.js — no other values), `level` ('B1' | 'B2' | 'C1'), `why` (the one- or two-sentence diagnosis shown after answering, in B1 English, HTML allowed). Optional `hint`: a one-sentence nudge shown when the student presses Hint — it must point at the principle or the place to look WITHOUT containing the answer (if absent, the tag's `principle` is shown, which for a fact question may give the answer away — so fact questions must carry their own `hint`). Optional `prompt`: a prompt id string from the bank (e.g. `'p-cars-city'`) — the prompt card is drawn above the question. Use a prompt wherever the question is about a specific essay task.

| type | fields | notes |
|---|---|---|
| `choose` | `stem`, `options[]` (3–4), `answer` (index) | Standard MCQ. Options may contain HTML. |
| `judge` | `given`, `stem`, `answer` (0 True, 1 False, 2 Can't tell) | Given is a sentence/claim; stem asks whether it is true, acceptable, etc. |
| `spot` | `stem`, `words[]`, `answer` (index of the wrong chunk), `fix` (the correction) | Tap the wrong chunk. Split the sentence into 5–9 chunks. |
| `sort` | `stem`, `bins[{key,label,hint}]` (2–3 bins), `items[{text,bin}]` (4–8 cards) | Drop cards into boxes. |
| `build` | `stem`, `tiles[]` (5–9 tiles), `solution` (tiles joined by single spaces, exact), `alt[]` (other acceptable orders) | Assemble a sentence. Tiles are words or short chunks. |
| `order` | `stem`, `items[]` IN CORRECT ORDER (3–5) | Shuffled on screen. |
| `select` | `stem`, `options[]` (6–8), `answers[]` (indices), `k` (= answers.length) | Tick exactly k. |
| `thesis` | `stem`, `prompt`, `must[]` (1–3 groups of lowercase synonyms; one from each group must appear), `minWords` (12), `maxWords` (45) | Free-text one-sentence position, rule-checked: one or two sentences, a position marker (I believe / this essay argues / should / outweigh …), on topic, no cliché. |
| `bodypara` | `stem`, `prompt`, `keyNouns[]` (optional lowercase stems), `nuance` (default true), `minWords` (60), `maxWords` (130) | Free-text body paragraph: checked for a mechanism marker, an example marker, a nuance marker, linker density, length, register. |
| `rewrite` | `stem`, `given`, `must[]` (groups of lowercase words/phrases, one per group must appear), `ban[]` (words that must not appear), `noClause` (true = no because/which/that/when), `minWords`, `maxWords`, `praise` | Free-text rewrite of one sentence (nominalise it, detox the linkers, add a mechanism …). |

Free-text items (`thesis`, `bodypara`, `rewrite`) are marked by rules, not by a key, so put at most 1–2 per sub-level and 1 per check; the rest are objective.

## Item-writing rules (non-negotiable)

1. Exactly one defensible answer. Distractors are grammatically correct but wrong for the context, same part of speech, plausible — never absurd or childish. For MCQs on the matrix variables, one distractor is a near-miss (too broad, too narrow, the other side, a different variable). For vocabulary MCQs, one distractor is drawn from the taught list.
2. Stems ≤ 25 words. Options ≤ 18 words. B1/B2 English in stems; the target language may be higher.
3. Do not make the correct option the longest more than ~25% of the time. Spread the correct index across positions 0–3 evenly across the file.
4. Original material only. Never reproduce a real IELTS past paper, a Cambridge-book task or a published model essay. Sentences about a prompt must be consistent with that prompt's text and its variables in prompts.js (read them).
5. `why` explains the principle, not just "the answer is B". It may quote the relevant band-descriptor idea in plain words (the descriptor wording is in docs/01 §2).
6. Tags: use the most specific tag; each sub-level should use 2–4 different tags across its items, all listed under the module's focus below. Check items mix the module's tags.
7. Levels: in each sub-level, mix levels — sub 1 mostly B1/B2, sub 2 B2, sub 3 B2/C1. Checks mirror the module.
8. Register: neutral, encouraging, never condescending. Students are intellectually serious learners. Examples may draw on Thailand and Bangkok (schools, BTS, floods, street food, tutoring centres) — concrete, never invented statistics.
9. Counts: 3 sub-levels × 7 items + check of 8 items = 29 items per module.
10. Every `thesis` / `bodypara` item must name a `prompt` from the bank; every `rewrite` item gives a `given` sentence of 10–30 words.
11. No memorised clichés anywhere, even as correct answers: never "double-edged sword", "in a nutshell", "hot topic", "every coin has two sides", "since the dawn of time", "nowadays in this modern era".

## Module outlines (write the module(s) assigned to you)

**m00 The Test** (tags: kn-test-facts, kn-criteria, struct-length, struct-time, lr-register) · s1 "The facts" (40 min, 250+, twice Task 1, 5/30/5, no bullet points, no notes, plagiarism) · s2 "The four criteria and their gates" (TR/CC/LR/GRA at 25%; what 6→7→8 requires for each, in plain words) · s3 "What the examiner punishes" (off topic, memorised, under length, unclear position, informal) · check.

**m01 Decode the Prompt** (tags: kn-question-type, tr-partial, tr-listing, tr-solution-mismatch, tr-position-late) · s1 "The five types" (signal wording → type; `choose`/`sort` with prompt cards from the bank across all five types) · s2 "What each type demands" (parts to answer, where the opinion goes; the "outweigh" trap; solutions must answer causes) · s3 "Instruction words and parts" (count the parts; both views + own opinion = three; two-part questions; `select` the parts) · check.

**m02 Position** (tags: tr-no-position, tr-position-late, tr-partial, kn-question-type, tr-off-topic) · s1 "What a position is" (one sentence the examiner can quote; position markers; fence-sitting vs a real stance) · s2 "Position in the introduction AND the conclusion" (discuss-both-views; judge sample intros; `order` items) · s3 "Thesis Sniper" (write the thesis for a prompt; `thesis` items on p-cars-city, p-teen-jobs, p-online-learning; must groups from the prompt's keyNouns) · check.

**m03 Matrix I — Core Topic and Facets** (tags: lr-nominal, tr-off-topic, tr-partial, cc-one-idea, lr-precision) · s1 "The Core Topic is a noun phrase" (verb → nominalised noun phrase; choose the Core Topic among near-misses; use `prompt` and the `core` variable of several prompts) · s2 "Facet A and Facet B" (a facet is one major aspect, not the whole side; not an example, not a mechanism; too broad / too narrow) · s3 "The Lens method" (economic / socio-cultural / public-health lenses produce different facets for the same prompt; sort items) · check.

**m04 Matrix II — Mechanism, Example, Nuance** (tags: tr-generalised, tr-no-example, tr-no-nuance, cc-progression, tr-off-topic) · s1 "Mechanism: how it works" (claim vs mechanism; "which in turn"; sort claims from mechanisms; near-miss = an example offered as a mechanism) · s2 "Example: something you can point at" (concrete case vs "research shows"; own country; judge items) · s3 "Nuance: the limit that keeps the position" (nuance vs contradiction vs new facet; `bodypara` items on p-remote-work and p-school-snacks) · check.

**m05 The Template** (tags: cc-paragraphing, cc-one-idea, struct-template, lr-memorised, tr-no-position) · s1 "Four frames, eleven slots" (which variable goes in which paragraph; `sort` variables into paragraphs; word budget 50/95/95/45) · s2 "Choosing and filling an opener" (`build` items assembling a filled frame sentence from tiles; which option suits a causality-heavy facet) · s3 "Own the frame" (memorised language; edit the opener into your own words; template ratio; `rewrite` items: rewrite a frame sentence keeping the slot content, `ban` the frame's own key words) · check.

**m06 Synthesis** (tags: tr-no-position, tr-new-idea, tr-generalised, tr-listing, cc-paragraphing) · s1 "Synthesized Position" (a verdict that takes the best of both, or picks one and says why; not "it depends") · s2 "Rationale" (the one logical reason; not a restatement, not a new facet) · s3 "The conclusion evaluates" (summarise vs evaluate; no new idea; judge sample conclusions; `build`) · check.

**m07 Cohesion** (tags: cc-linker-overuse, cc-reference, cc-progression, cc-one-idea, cc-paragraphing) · s1 "Reference and substitution" (this policy, such measures, doing so, the former/the latter; choose/build) · s2 "Linker Detox" (spot the mechanical linker; choose the natural link; `rewrite` a Firstly/Moreover paragraph opener with `ban`: ['firstly','secondly','moreover','furthermore','in addition']) · s3 "Known to new" (end a sentence with what the next is about; `order` shuffled sentences of a body paragraph) · check.

**m08 Nominalisation** (tags: gra-nominalisation, lr-nominal, gra-agreement, gra-word-form, gra-complex) · s1 "Verb to noun" (regulate → regulation, adopt → adoption; word families; choose) · s2 "Clause to noun phrase" ("Because prices rose, people bought less" → "Rising prices reduced consumption"; `rewrite` items with `noClause: true` and `must` groups) · s3 "Agreement with long subjects" (head-noun rule: "The widespread adoption of remote working HAS…"; spot items) · check.

**m09 Structural Swaps** (tags: gra-inversion, gra-cleft, gra-participle, gra-concession, gra-conditional, gra-complex) · s1 "Inversion and cleft" (Seldom does…; It is … that …; build/spot; dangling and broken forms) · s2 "Participle and concession" (subsequently triggering …; While/Although …; spot the fragment; build) · s3 "Accuracy first" (3–4 swaps to 90%; one per body paragraph; judge which version is error-free; conditionals for solutions) · check.

**m10 Collocation and Register** (tags: lr-collocation, lr-precision, lr-domain, lr-register, lr-memorised) · s1 "Collocation beats rarity" (make/do, heavy/strong, act as a deterrent, mitigate; choose the partner; odd one out) · s2 "Domain kits" (education, environment, technology, health, crime, government, work, culture — ten collocations each in theory, drilled with choose/sort) · s3 "Register and the cliché ban" (contractions, you, kids, rhetorical questions; spot the informal chunk; memorised phrases) · check.

**m11 Accuracy** (tags: gra-article, gra-agreement, gra-plural, gra-punctuation, gra-word-form, lr-spelling) · s1 "Articles and plurals" (spot items; uncountables: advice, research, information) · s2 "Agreement, punctuation, word form" (comma after openers, comma splice, economic/economical; spot) · s3 "Error auction" (mixed spot items: find the single error among the six families) · check.

**m12 Playbooks** (tags: kn-question-type, tr-listing, tr-solution-mismatch, tr-partial, tr-no-position) · s1 "Opinion: one position, two reasons" (facet = reason; conceded counter-argument; use OPINION prompts p-early-languages, p-tablets-textbooks, p-teen-jobs) · s2 "Advantages/disadvantages: weigh, don't list" (verdict sentence; p-online-learning, p-cctv-everywhere; `thesis` item with a verdict) · s3 "Problem/solution and two-part" (cause → solution arrows; p-city-flooding, p-teen-sleep, p-cashless; sort causes/solutions; `select`) · check.

**m13 Exam Day** (tags: struct-time, struct-length, kn-test-facts, lr-register, tr-new-idea, cc-paragraphing) · s1 "The 40-minute protocol" (order the phases; timings; what to do at minute 35) · s2 "The pre-flight check" (the 10-point list in bootcamp.js; judge sample paragraphs against it) · s3 "On paper and on computer" (word count, no spell-check, proofreading your own top three errors, what to do if time runs out; a final `bodypara` on p-free-transport) · check.

## Prompt ids available for `prompt:` (see prompts.js and prompts-2.js)

DISCUSS: p-cars-city · p-science-funding · p-prisons · p-remote-work · p-screen-time · p-tourism · p-space · p-fast-food-tax · p-newspapers · p-animal-testing · p-competitive-sport · p-child-advertising · p-minority-languages · p-history-teaching · p-elderly-care · p-gm-crops · p-libraries · p-climate-action · p-architecture · p-minimum-wage
OPINION: p-early-languages · p-open-university · p-tablets-textbooks · p-school-snacks · p-teen-jobs · p-free-transport
ADVANTAGE: p-children-tv · p-online-learning · p-foreign-pop-culture · p-cctv-everywhere
PROBLEM: p-city-flooding · p-teen-sleep · p-youth-unemployment · p-online-scams
TWOPART: p-private-tutoring · p-cashless · p-rural-youth

Read the prompt text and its `vars` (both tiers) and make every claim consistent with them.
