# Handover: guidance levels for the Quillmoor Academy Scriptorium (IELTS-WT2)

Written 15 Nov 2026 in the IELTS-WT1 chat, for a new chat that will build the same feature in the Task 2 app. Read this file in full before anything else.

- Task 2 app (to change): https://pegasus028.github.io/IELTS-WT2/ · repo `pegasus028/ielts-wt2` (main = production, at `486f5a4` when this was written).
- Task 1 app (the finished reference): https://pegasus028.github.io/IELTS-WT1/ · repo `pegasus028/ielts-wt1` (public; main `804849f`).
- Students: T.Chris's private tutees (Thai, 13–17, CEFR B1/B2, target Band 7.5). Girls and one boy (Soda): keep student-facing text gender-neutral.

## 1. What T.Chris wants (his words, condensed, from the Task 1 request of 12–13 Nov 2026)

Replace the Scriptorium's mode choice with four guidance levels:

| Level | What the student does |
|---|---|
| **High guidance** | Every decision point is a separate multiple-choice question with exactly one right answer. A wrong option is greyed out and a hint appears that guides without giving the answer; she chooses again until she is right, even if only one option is left. Each right answer adds its words to the essay, which builds live in the panes on the right. All right answers together make a coherent, high-scoring essay (Band 7–8) with no jarring joins. |
| **Medium guidance** | The same decisions as free text. Each field has a **Commit** button that runs an AI check against the expected response. Right: the text goes to its pane. Not right: a hint, and she may edit and commit again, or commit her entry unchanged and override the AI. |
| **Low guidance** | The present Guided mode, with prompts added for the introduction. |
| **Exam mode** | No guidance, free text, the clock. |

Further decisions he made on Task 1, which this build should copy unless he says otherwise:
- Test everything on **one prompt first**, show him, and only after his review write the other prompts.
- After the test, "apply the enhancement to all prompts".
- **A High-guidance essay earns half merits.**
- Work is co-ordinated between Claude Fable 5.2 and Claude Opus 5.5 and pushed to GitHub; the Apps Script redeploy is done by Claude in the built-in browser (his request to update and push is his yes for that).
- "Feel free to add or enhance any aspect which you deem beneficial."

## 2. Read first, in this order

1. The skills `quillmoor-app-notes` (app facts, rules, deploy, tests) and `ielts-writing-task-2` (the method: the 11-Variable Matrix, the Universal Spine and Type Switch Card, gates, the Ten Wards). If a skill and this file disagree on Task 2 method, the skill wins; on how the guidance feature works, this file wins.
2. The Task 1 implementation (clone `pegasus028/ielts-wt1` read-only into a separate folder; do **not** push to it):
   - `docs/GUIDANCE-LEVELS.md` — the contract (levels, files, script shape, the server action).
   - `docs/GUIDE-AUTHORING.md` — the standard every script followed (the Task 2 version of it is your first deliverable).
   - `guide.js` — the engine: `Guide.mount`, `essay()` / `tidy()` (how pieces join: `pre` / `post`), `localCheck()` (Medium rule check: capitals of names → `reject` → `accept`), `leaks()`, on-demand loading (`has` / `ready` / `load`, `guide-index.js`), the run kept on the device until sent.
   - `guide/p-line-museums.js` + `tools/guide-cases/p-line-museums.json` — the approved model script and its Medium cases.
   - `tools/guide-test.js` (the per-script test; run `node tools/guide-test.js p-line-museums --essay`) and `tools/guide-smoke.py` (browser test).
   - `Code.gs`: the `GUIDE-CHECK` block in `doPost` (answered before the lock) and the `guide*` functions from `var GUIDE_SYSTEM` onwards; `submitReport` for `uiMode === 'high'` (stored, `aiSkip`, never sent to the AI panel).
   - `writer.js` `mount()` (hands `high` / `medium` to `Guide.mount`; `low` adds the introduction notes `INTRO_NOTES`), `student.js` `startWrite` and the Scriptorium radios, `engine.js` `recordReport` (half merits), `writer.css` (the `.gd-*` styles), `api.js` `guideCheck`.
   - `QA-REPORT.md`, the two top sections (12–13 Nov 2026): what was built, what the reviews caught, the decisions left to T.Chris.
3. In the Task 2 repo: `writer.js` (`mount`, the modes `guided` / `skeleton` / `exam`, `preflight`, `checkThesis`, `checkBody`), `template.js` (`FADE`, the B2 Universal Spine `b2-u-*`), `student.js` (Scriptorium painter around line 1267, `startWrite` around 1300, `CORE_DEFAULT`), `engine.js` (merits: `OWN_MIN = 0.3`, essay 150 / 60), `prompts.js` + `prompts-2.js` (37 prompts, each with the eleven variables at C1 and B2 as `{ok, d:[near-miss, …]}`), `prompts-mock.js`, `models.js` (9 models), `Lab.gs` (the existing Claude calls, `LAB_quota_`), `Code.gs` (`APP_VERSION`), `teacher.js` (`EXPECTED_BACKEND`), `QA-REPORT.md` (top section).

## 3. How Task 2 differs from Task 1 (design notes)

| Task 1 (built) | Task 2 (to design) |
|---|---|
| ~185 words, 4 paragraphs; 46 steps on the model script | 260–290 words, 4 paragraphs (budget 50 / 95 / 95 / 45). Expect 45–60 steps with **larger pieces** (a clause or a whole sentence per step in the body), or the run becomes too long for a tutee. Aim for a High run of about 25–35 minutes; measure it in the test. |
| Sections: triage, intro, overview, detail A, detail B | Suggested: **triage** (type from the instruction sentence, parts and plurals, the trap, the position direction, the two facets) · **introduction** (paraphrase of the Core Topic, the two facets / views, the Position slot with the lead-in for the type) · **body A** (facet → mechanism → example → nuance, plus reference words and one complex structure) · **body B** (same) · **conclusion** (the position restated in fresh words, the rationale). Map T.Chris's Task 1 decision points (mode / tense / groups / visual / verb / what / where / when / general claim / contrasting claim / categorisation / subject / metric / meaning / verbs / prepositions) onto the Task 2 ones and show him the mapping before writing the test script. |
| Facts = the chart's figures; the test checks every number | Facts = the prompt's eleven variables at the chosen tier (`vars.B2` / `vars.C1`, already reviewed content) and any real-world example. Test: every variable of the tier appears in meaning; the position is in paragraph 1 and restated in paragraph 4; `Writer.checkThesis` and `checkBody` pass; every Ward of the Task 2 `preflight` is green; no run of 8+ words copied from the prompt; 260–290 words. Any real-world fact in an example must be checked or phrased as a hypothetical (skill rule). |
| Wrong options: wrong figure, tense, preposition, trend verb, opinion | Wrong options: wrong type / stance word, a position that does not answer every part, a nuance that abandons the position, a mechanism that is a second claim, a cliché, a connector that does not fit the logical relation (name the relation first; see the skill's connector traps), register slips, agreement and article slips, slot-shape errors (NP / -ing / clause). The prompt bank's `d[0]` near-miss for each variable is a ready-made, reviewed wrong option for the variable steps. |
| The Duelling Hall is separate | **Overlap:** the Duelling Hall already asks the eleven variables as multiple choice from the same `vars`. High guidance must go beyond the duel (sentence-level decisions, joins, frames, grammar), and may reuse the duel's options for the variable steps. Do not let a duel answer and a High step disagree. |
| No template in the essay | The method is the student's own **Universal Spine**. Decide with T.Chris whether the High essay follows the Spine's moves only (recommended: natural Band 7–7.5 wording, template share well under 40%) or the Spine's B2 starter wording (teaches the template, but a high share and the "This essay looks at both" problem the skill flags for Problem / Two-part). |
| AI marking in-app; High reports kept away from the panel | Marking is the **LevelUp hand-off** ("Send to the examiners"). A High essay should not be offered for LevelUp marking (its text is the app's); decide what the result screen offers instead. |
| Merits: 150 / 60; High = half | Task 2 merits: an essay with `ownShare < 0.3` earns **0** (`engine.js` `OWN_MIN`), so a High essay (own share ≈ 0) would earn nothing under today's rule. T.Chris's Task 1 decision was "half merits": confirm that it overrides `OWN_MIN` here (75 / 30), and whether a High essay counts for the story gates (chapter 4 "one essay sent"), the term projects of her five, the "better band per type" bonus and the House Cup. |
| Mock prompts: none in Task 1 practice | `CONTENT.MOCK_PROMPTS` (3 unseen prompts) must **never** get a script; `validate.js` already keeps them out of practice. |
| Modes: spellbook / guided / exam | Modes: `guided` (her Spellbook frames with slots) / `skeleton` (slot labels and word targets) / `exam`. Ask T.Chris where Skeleton goes (a fifth level, folded into Low as a toggle, or removed). Keep the old values working: a stored `uiMode` of `guided` / `skeleton` and teacher assignments that name them must still open. |

## 4. Questions to ask T.Chris before building (one message; recommendations first)

1. **Test prompt.** Recommended `p-cars-city` (Discuss, the most common type, 20 of 37; it has the checked model `m-cars-city`; every tutee has written it; the five-type teaching set in the skill is built on it). Alternative: the first of her five, `p-fast-food-tax` (no model in `models.js`).
2. **Tier of the built essay.** Recommended B2 tier (`vars.B2`, Band 7–7.5) for every script first; C1 later as a second script per prompt if he wants it.
3. **Spine or free wording** in the High essay (see §3).
4. **Skeleton**: fifth level, folded into Low, or removed.
5. **Merits and gates** for a High essay (see §3): half merits overriding `OWN_MIN`? Counts for gates / term projects / House Cup?
6. **Low guidance "prompts for the introduction"**: in Task 1 these were six notes in the plan (visual, verb, what, units, where, when). For Task 2, propose: type, parts, Core Topic paraphrase, the two facets, the position, the lead-in. Confirm.
7. Is there Task 2 slide guidance (like the Task 1 WS-A decks in `C:\Users\Chris\OneDrive\Desktop\262-Variety-of-Writing-2\Claude-VoW2-Project-folder\WS-A-slide-decks`) that the decision points should follow? If not, the skill's method is the source.
8. After the test script: all 37 practice prompts, or only her five first?

Do not stop the work while waiting: start on the engine port (§6, steps 1–3), which does not depend on the answers.

## 5. Decisions already made (carry over; do not re-ask)

- Four levels as in §1; Exam unchanged; a chart without a script opens at Low with a short note.
- High: one right option of four; a wrong option is greyed out and struck through, its own hint appears, she chooses again; the right option's text is added to its pane and highlighted; the next question shows "your … so far" with the gap.
- Medium: the same decisions, `askFree` wording; Commit → names' capitals → known slip (`reject`, its own hint, no AI) → rules satisfied (`accept`) → AI check where the rules cannot judge (`ai: true` steps) → hint, then "edit and Commit again" or "keep my answer as it is". With no AI (offline, old backend, budget spent, slower than 12 s) the rules decide. At the end the panes open for a last polish.
- A run is kept on the device (answers, greyed options, hints, polished text) until sent; "start again" clears it.
- One script file per prompt, fetched on demand (`guide/<promptId>.js`, `guide-index.js`), so the app's start does not slow down.
- Backend action for the AI check: request `{token, promptId, stepId, section, ask, expect, entry, soFar}`, response `{ok, verdict:'accept'|'revise', hint, source}`; no lock around the model call; its own daily budget and per-student cap, separate from other AI budgets; cache six hours; a leak guard on the hint. In Task 2 the Claude key and quota already live in `Lab.gs`: put the action where it fits best (a `lab.guideCheck` beside `lab.coach`, or `Code.gs` as in Task 1), and bump `APP_VERSION` + `EXPECTED_BACKEND` together.

## 6. Order of work and who does it

Nothing is reviewed by the model that made it. Fable takes the parts where a subtle misjudgement spoils the result; Opus takes well-specified build work that can run in parallel.

| # | Work | Builds | Reviews | Depends on |
|---|---|---|---|---|
| 1 | Port the engine: `guide.js`, `guide-index.js`, writer/student/engine/api/css integration, the four radios, old `uiMode` values mapped, Low guidance introduction notes | Opus | Fable | — |
| 2 | Backend `guideCheck` (+ High essays kept out of LevelUp marking) and its tests in `tools/gs-test.js` | Opus | Fable | — |
| 3 | `docs/GUIDE-AUTHORING-T2.md` (the Task 2 standard: §3 above + §7 lessons) and `tools/guide-test.js` for Task 2 (every acceptance check in the test **before** any writer starts) | Fable | Opus | answers 2, 3 |
| 4 | The **test script** for the chosen prompt + its cases file; built essay read as an examiner | Fable | Opus (adversarial review, as in Task 1) | 1, 3, answer 1 |
| 5 | Push to a side branch, merge to main after tests; deploy the backend; show T.Chris the test prompt live; **wait for his review** | Fable | — | 2, 4 |
| 6 | Scripts for the remaining prompts: Opus writers, 3–4 prompts each, in parallel | Opus | Fable reviewers, one per batch | 5 + his OK |
| 7 | Full test run, QA-REPORT section, findings list for T.Chris, merge, live check | Fable | — | 6 |

## 7. Lessons from the Task 1 build (apply them; they cost time there)

1. **Every requirement goes into the test before writers start.** A rule only in the brief gets missed (one batch shipped with no `ai: true` steps because that check was added mid-run).
2. **Give each writer a test command scoped to its own prompts.** `guide-test.js --index && guide-test.js <id>` failed for everyone because the index run also tested other writers' half-written files. Make `--index` only rebuild the index, or tell writers to use `;`.
3. **Check each prompt's facts before writing per-batch notes** (type, parts, plurals, tier): one Task 1 batch was told the wrong chart had a projection.
4. **Hand each reviewer the writer's own doubts plus anything you spot in the printed essay.** About 20 defensible "wrong" options and several misleading essay sentences were caught that way. Reviews changed about half of all steps, mostly Medium rules, so the review step cannot be skipped.
5. **Anchor `accept` patterns (`^…$`) on steps without `ai: true`.** Loose patterns let sentence-breaking entries through (the most common review fix). Use word boundaries, and guard numbers (`\b100\b` matched inside "1,100"; "rose" matched "rosed").
6. **No regex lookbehind `(?<…)`** anywhere (old iPad Safari cannot compile it; the rule is silently skipped). The test should reject it.
7. **The test only catches hints that contain the answer word for word.** Reviewers must also read for indirect give-aways: "starts with O", "an adverb made from final", "rhymes with voted", "two dots, one above the other", a shape that spells the frame ("and + is + predicted to + verb").
8. **Proper names are matched as whole words** in the capitals check ("US" caught "much"), and the hint is general ("Check the capital letters: names keep them").
9. **A wrong option must be wrong for one clear reason in the sentence built so far.** Check each against "could a careful teacher accept this here?"; the reviewers found ones that were correct English.
10. **Joins:** an option never ends with punctuation that `post` supplies and never starts with the word the step before ended on ("to to"). The test builds the essay from the right options and from lower-case answers with stray punctuation; both must match.
11. **Collect errors found in the existing models and prompts in one findings file** for T.Chris instead of fixing them unasked (Task 1: about 30, e.g. a model breaking the house rules, "by far" for a small lead).
12. **Today's date matters for tense** (November 2026: 2025 is past). Less relevant to Task 2, but check any dated example.
13. **Git:** commit work in progress to a side branch whenever the stop hook asks; if it reports "no remote branch" on a shallow clone, run `git remote set-branches --add origin <branch> && git fetch origin <branch>`.

## 8. Working rules (Task 2 app)

- ES5 only in browser files; keep item ids, `pc.*` storage keys, API actions and the DOM ids the harness uses (list in `quillmoor-app-notes`); new `?v=` on every changed script in `index.html` and `teacher.html`.
- All test suites in `quillmoor-app-notes` must pass before a push, plus the new guide tests and a Playwright pass at 390 px.
- Push to main only after the tests pass (his request counts as the OK for the feature push and the redeploy it needs); unfinished work goes to a side branch.
- Redeploy the Apps Script yourself in the built-in browser (`apps-script-deploy` skill; WT2 specifics in `quillmoor-app-notes`), as a **new version of the existing deployment**, then check `ping` returns the new `APP_VERSION` from the live page. Never write to the live Sheet to test.
- Delivery: a short reply with what changed, what to try, the decisions left to him, and the QA-REPORT section.

## 9. Acceptance checks

- [ ] The Scriptorium offers High / Medium / Low / Exam; old `uiMode` values and teacher assignments still open; mocks unaffected.
- [ ] High on the test prompt: every step wrong-first then right in the browser test; panes match the built essay; every Ward green; the essay passes the thesis and body checkers; 260–290 words; no 8-word run copied from the prompt.
- [ ] Medium: known slips get their own hint without the AI; the AI check is called only where expected; "keep my answer" works; a hint that quotes the answer is replaced; the 12-second fallback works; panes editable at the end.
- [ ] Merits and gates behave as T.Chris decided; a High essay is not offered for LevelUp marking.
- [ ] Backend redeployed as a new version; `ping` shows the new version; the Staff Room shows no version banner.
- [ ] All existing suites green; new guide tests green; 390 px with no sideways scroll.

## 10. Status

| Item | Status (15 Nov 2026) |
|---|---|
| Task 1 feature (reference) | Live on IELTS-WT1, all 48 charts, Version 15 backend |
| This handover | Written; on branch `handover/scriptorium-guidance` of `pegasus028/ielts-wt2` |
| Questions in §4 | Not yet asked |
| Everything in §6 | Not started |

## 11. Opening message to paste into the new chat

> Please redesign the Scriptorium of my IELTS Writing Task 2 app (https://pegasus028.github.io/IELTS-WT2/, repo pegasus028/ielts-wt2) with the same four guidance levels I had built for the Task 1 app (https://pegasus028.github.io/IELTS-WT1/, repo pegasus028/ielts-wt1): High, Medium, Low and Exam. Co-ordinate with Opus 5.5 and push to GitHub.
>
> Start by reading the handover: clone pegasus028/ielts-wt2 and read `docs/HANDOVER-SCRIPTORIUM-GUIDANCE.md` from the branch `handover/scriptorium-guidance` (`git fetch origin handover/scriptorium-guidance && git show origin/handover/scriptorium-guidance:docs/HANDOVER-SCRIPTORIUM-GUIDANCE.md`). Then load the skills it names and the Task 1 files it lists.
>
> Ask me the questions in its §4 in one message before you write any test-script content, and start on the engine port meanwhile. Test everything on one prompt first and wait for my review before you do the other prompts.
