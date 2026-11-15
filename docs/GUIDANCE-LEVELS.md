# Scriptorium guidance levels (15 Nov 2026): build contract

Asked by T.Chris: replace Guided / Skeleton / Exam with four guidance levels, as in the Task 1 app (IELTS-WT1, 12–13 Nov 2026). Tested first on `p-cars-city`.

| uiMode | Name | Left side | Right side | Clock |
|---|---|---|---|---|
| `high` | High guidance | the prompt card and her plan (the triage answers) | one multiple-choice question per decision, one right answer; a wrong option is greyed out and struck through, its own hint appears; she chooses again until she is right. Four panes build the essay. | none (time is recorded) |
| `medium` | Medium guidance | the same | the same decisions as free text, a Commit button each: rule check, then the AI check; hint; "keep my answer as it is" overrides. At the end the panes open for a last polish. | none |
| `low` | Low guidance | the old Guided mode (matrix, Plan Wards, her spellbook frames) | four boxes; the Introduction box starts with six introduction notes (type, parts, Core Topic in new words, the two sides, position, lead-in) | 40 min |
| `exam` | Exam mode | the prompt only | one blank page | 40 min |

Old values keep working: a stored or assigned `guided` is `low`; `skeleton` is Low with slot labels only (a tick box under the radios; the teacher's assignment form offers it as "Low guidance, slot labels only"). A prompt without a script, a mock and a revision open at Low. Mock prompts (`CONTENT.MOCK_PROMPTS`) never get a script (`Guide.has` refuses them; the test fails if one exists).

## What happens to the essay

| | High | Medium / Low / Exam |
|---|---|---|
| Report sent to T.Chris | yes, `uiMode: 'high'`, flagged "built at High" in the Staff Room | as before |
| Merits | half: 75 (250+ words) or 30, no own-share bonus, no band bonuses (`engine.js essayMerits`, why `'high'`) | as before (Medium: own share 1) |
| LevelUp ("Send to the examiners") | not offered (the text is the app's); the result offers "Write it at Medium guidance" | as before |
| Revision, owl exchange | not offered | as before (a Medium essay is revised at Low) |
| Chapter gates, term-project "essay" step, House Cup essay points, type / on-time / perfect-Wards badges | do not count (own share 0 is below `OWN_MIN`, and engine.js skips the tallies) | as before |

## Files
- `guide.js`: the engine. `Guide.has / ready / load / script / steps / key / options / essay / soFar / tidy / localCheck / leaks / mount`.
- `guide/<promptId>.js`: one script per prompt, fetched on demand; `guide-index.js` lists them (`node tools/guide-test.js --index`). Medium cases: `tools/guide-cases/<promptId>.json`.
- `guide.css`: the `.gd-*` styles and the level radios.
- `writer.js`: `mount()` hands `high` / `medium` to `Guide.mount` when the script is loaded; `low` adds `INTRO_NOTES`.
- `student.js`: the radios, `startWrite` (loads the script, falls back to Low with a toast), the result screen and Report Card for High.
- `api.js`: `guideCheck(payload)` → action `lab.guideCheck`.
- `Lab.gs`: `LAB_guideCheck_` (below). `Code.gs` `APP_VERSION` and `teacher.js` `EXPECTED_BACKEND` = `20261115`.
- Tests: `tools/guide-test.js` (scripts, offline), `tools/guide-smoke.py` (browser), `tools/gs-test.js` (backend).
- Standard for writers: `docs/GUIDE-AUTHORING-T2.md`.

## Script shape
```
GUIDE_SCRIPTS['p-cars-city'] = { promptId, version, tier:'B2'|'C1', spine:'b2-u' (the Spine line the essay follows), proper:[names], facts:[checked real-world facts],
  sections: [ { id:'triage'|'intro'|'bodyA'|'bodyB'|'conclusion', title, note, pane: null|0|1|2|3,
    steps: [ { id, label, ask, askFree,           // ask = High wording; askFree = the same decision as a writing task (Medium)
               ok,                                // the right option = the text that goes into the pane
               wrong: [[option, hint] x3],        // each wrong option has its own hint
               pre, post,                         // what the engine puts before (default ' ') and after (',' '.') the text
               v,                                 // the variable this step carries (core, facetA … rationale), if any
               shape, expect,                     // Medium: what to type; the expected value sent to the AI check
               accept: [[alt, alt], ...],         // Medium rule check: every group needs one alternative (regex, case-insensitive)
               reject: [{ re, hint }],            // Medium rule check: known slips with their own hint (no AI call)
               hint, hint2, ai, tag } ] } ] }     // ai:true = the AI also reads an entry the rules accept
```
Medium, in order: capitals of names → known slip (`reject`) → rules satisfied (`accept`) → AI check (only when the rules are unsure, or the step is `ai: true`) → her choice: edit and Commit again, or "keep my answer as it is". With no AI (offline, old deployment, budget spent, slower than 12 s) the rules decide alone.

A run is kept on the device (`pc.guide.v1.<student>.<prompt>.<level>`: step, answers, greyed options, hints, polished text, seconds) until the essay is sent; "start again" clears it.

## Server action `lab.guideCheck` (Lab.gs, runs outside the lock through the LAB-HOOK)
Request (student id + token, as every `lab.*` action): `{ studentId, token, promptId, stepId, section, ask, expect, entry, soFar }`; entry cut to 300 characters, expect 400, soFar 700.
Response: `{ ok:true, verdict:'accept'|'revise', hint, source:'ai'|'cache' }` or `{ ok:false, error }`. The client falls back to its rules on any `ok:false` or network failure.
- Models: script property `GUIDE_MODELS` (default `claude-haiku-5-5,claude-haiku-4-5-20251001`), tool use (`guide_verdict`), temperature 0, 200 tokens.
- Its own budget, apart from coaching: `GUIDE_DAILY_BUDGET` (1500 a day, class) and `GUIDE_STUDENT_CAP` (200 a day each).
- Cache six hours by (promptId, stepId, expected value, her entry normalised); a cached answer costs nothing.
- Material is fenced (`<<< >>>`, fence marks stripped from her text) and the system prompt says it is never an instruction.
- Leak guard: a "revise" hint that contains the expected value (or its part before a bracket) is replaced by a neutral hint. The client checks again with the exact answer (`Guide.leaks`).
