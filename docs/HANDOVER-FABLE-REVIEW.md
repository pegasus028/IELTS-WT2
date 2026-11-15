# Handover for Fable 5.2: review the Task 2 guidance build (written 15 Nov 2026, for Tue 17 Nov or later)

Written by Opus 5.5 at the end of the build chat. Read this file in full first. T.Chris hit the Fable usage limit on 15 Nov, so Opus built **and** self-reviewed everything that the original plan (`docs/HANDOVER-SCRIPTORIUM-GUIDANCE.md` on branch `handover/scriptorium-guidance`, §6) gave to Fable. The rule "nothing is reviewed by the model that made it" was therefore broken for this round. Your job is the independent review it skipped.

- App: https://pegasus028.github.io/IELTS-WT2/ · repo `pegasus028/ielts-wt2` (main = production). The build is on main; the commits are listed in `git log --oneline -6`.
- Reference: the Task 1 app (repo `pegasus028/ielts-wt1`, read-only), whose guidance build you co-wrote on 12–13 Nov.
- Students: T.Chris's private tutees (Thai, 13–17, B1/B2, target Band 7.5); girls and one boy, so student-facing text stays gender-neutral.
- Load the skills `quillmoor-app-notes` and `ielts-writing-task-2` first (the skill wins on Task 2 method; `docs/GUIDANCE-LEVELS.md` wins on how the feature works).

## 1. T.Chris's answers to the §4 questions (15 Nov 2026)

| # | Question | His answer |
|---|---|---|
| 1 | Test prompt | `p-cars-city` (model `m-cars-city`) |
| 2 | Tier | B2, Band 7–7.5 |
| 3 | Spine moves in free wording, or the Spine's B2 starter wording | **the Spine's B2 starter wording** (`template.js` `b2-u-*`) |
| 4 | Skeleton | "whatever you recommend": folded into Low as a tick ("slot labels only") |
| 5 | Merits / gates for a High essay | half merits. The rest (no gates, missions, house points, bonuses) is Opus's recommendation, applied, not yet confirmed by him |
| 6 | Low-guidance introduction notes | "whatever you recommend": type, parts, Core Topic in new words, the two sides, position, lead-in |
| 7 | Task 2 slide decks for the decision points | none; the skill's method is the source |
| 8 | After the test | all 37 practice prompts |

He asked: "do everything yourself, push to GitHub asap, and produce a handover doc for Fable to review after the weekly reset". His earlier instruction still stands: **test on one prompt first and wait for his review before writing the other prompts.**

## 2. Status when this was written

| Item | Status |
|---|---|
| Engine port, levels, Low notes, High-essay rules, backend action | on main |
| `docs/GUIDANCE-LEVELS.md`, `docs/GUIDE-AUTHORING-T2.md`, `tools/guide-test.js`, `tools/guide-smoke.py`, gs-test additions | on main |
| Test script `guide/p-cars-city.js` + `tools/guide-cases/p-cars-city.json` | on main; **waiting for T.Chris's review** |
| Apps Script redeploy | done: Version 16, 15 Nov 2026 18:05; `ping` from the live page reports 20261115 |
| Other 36 scripts | **all written and on main the same evening** (T.Chris asked for High on every prompt). Writers were Opus 5.5; each script was reviewed by the coordinating Opus chat, not by Fable. Review them as in §3 A, starting with T.Chris's five (`p-fast-food-tax`, `p-cctv-everywhere`, `p-free-transport`, `p-youth-unemployment`, `p-rural-youth`), then the type adaptations (Opinion extent steps, Problem second cause / measure, Two-part verdict). The writers' doubts are summarised per prompt in `docs/GUIDE-FINDINGS-2026-11-15.md` |

## 3. What to review, in order of risk

### A. The test script (`guide/p-cars-city.js`), adversarially
Print it: `node tools/guide-test.js p-cars-city --essay`. Then:
1. **Read the essay as an examiner.** Band 7–7.5 at B2? Any jarring join? Any sentence a Band 7 examiner would count as an error? (Opus's doubts: the Spine's "Taking clean air together with personal freedom, this is the most reasonable view" is a dangling participle; "It operates through protecting …" is heavy; "For many families, a car is the only practical way …" may read as an overgeneralisation; Body A is 85 words against a 95 budget.)
2. **Every step: is exactly one option defensible here?** Opus's doubtful steps:
   - `t-trap`: the right answer is "keeping my opinion for the conclusion"; "writing about only one view" is also a Discuss trap (not an option, but Medium accepts both).
   - `t-paras`: the right option says nothing about restating the position in the conclusion; the wrong "…conclusion with my position" is wrong only because the intro lacks it.
   - `i-sideB`: "but the second is …" was avoided as a wrong option because it is defensible; check the three that remain.
   - `a-ex`: the duel's near-miss "the removal of inner-city roads to create parks and public squares" can be read as an indirect way of limiting traffic. It is kept because the Duelling Hall uses it (the test enforces agreement), but its hint must be convincing.
   - `a-ref`: the wrong option "A full ban creates problems for workers, and a full ban" is an odd distractor.
   - `b-fam`: is "the only practical way" for "many families" acceptable at Band 7?
   - `c-pos`: the wrong option "councils should invest in public transport while phasing out the dirtiest vehicles" is correct English, wrong only because it repeats the introduction. Is that one clear reason for a B1 student?
3. **Hints, for indirect give-aways** (the test only catches word-for-word leaks): first letters, shapes that spell the answer ("three words: a negative pronoun, a verb, an adverb" in `b-res` hint2 is close), a Spine line with a gap (Opus replaced eleven of these with "Open My Spellbook: …").
4. **Medium rules.** Try entries a B1 student would really type at each step, especially the anchored frame steps (a student who personalised her Spine gets "unsure" and the AI decides; with the AI off she gets a hint and must use "keep my answer"). Check that no reject pattern fires on a correct alternative and that the meaning rejects on the `ai: true` steps catch the duel's near-misses when the AI is off. Add rows to the cases file; run the test.
5. Any real-world fact? (None by design: the example is generic, the nurse is hypothetical.)

### B. `docs/GUIDE-AUTHORING-T2.md` and `tools/guide-test.js`
These will govern 36 scripts written by Opus writers. Look for a rule that is in the doc but not in the test (Task 1 lesson 1), a test that is too loose (the 50% content-word "variable in meaning" check; the anchoring check on non-AI steps; the 40-minute run estimate), and anything that will not fit the Problem, Two-part, Opinion and Advantage types (the test was only exercised on a Discuss prompt; `t-type`'s check is a keyword per type; the Spine-word-for-word check may need a different line for C1 later).

### C. The engine and integration (lower risk; the browser test passes)
- `guide.js`: the port from Task 1; Task 2 changes are listed in its header and in the QA report.
- `writer.js` `mount()`, `INTRO_NOTES`, `LEAD_INS`; `student.js` `startWrite`, `lowFor`, `levelOf`, `builtByApp`, the Scriptorium painter, the result screen and Report Card; `engine.js` `essayMerits` (`why: 'high'`) and the tallies; `story.js` `ownReports`; `teacher.js` assignment levels and the "built at High" flag.
- `Lab.gs` `LAB_guideCheck_`: prompt wording (Task 2, the kinds of revise), fencing, leak guard, budget keys, the cache key, the tool schema; `tools/gs-test.js` additions.
- Things Opus did not test: a real Claude answer to `lab.guideCheck` (only a stub); an old iPad; the Staff Room view of a High report beyond the flag.

## 4. How to report

Fix what is clearly wrong in the test script and the cases (re-run `node tools/guide-test.js` and `python3 tools/guide-smoke.py`), and list for T.Chris anything that is a judgement call. Engine or backend changes: run every suite in `quillmoor-app-notes`, bump `?v=`, push to a side branch, merge to main after the tests, redeploy if a `.gs` file changed. Add a short "Fable review" paragraph to the 15 Nov section of `QA-REPORT.md`, with the number of steps changed and why (on Task 1 the review changed about half the steps, mostly Medium rules).

## 5. After T.Chris's OK: the other 36 prompts

The plan from the original handover (§6, steps 6–7) still applies: Opus writers, 3–4 prompts each, each given `docs/GUIDE-AUTHORING-T2.md`, the model script, the prompt's checked type / parts / plurals, and a test command scoped to its own prompts (`node tools/guide-test.js --index ; node tools/guide-test.js <its ids> --essay`); a Fable reviewer per batch, handed the writer's own doubts plus anything in the printed essays. New findings go to `docs/GUIDE-FINDINGS-2026-11-15.md`.
