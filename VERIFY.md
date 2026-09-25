# VERIFY — checks before every deployment

1. `node tools/validate.js` prints `OK — no errors` (ids unique, tags valid, answers in range, prompts exist, build tiles match solutions, every prompt has eleven variables at both tiers).
2. `node tools/test-free.js` prints `0 failure(s)`: every free-text item's `_good` sample passes and `_bad` fails; every model essay is 0 red on the pre-flight; each Band 6 contrast shows 3+ red rows.
3. `python3 tools/smoke.py` (needs Playwright + Chromium): creates an account, clears a module, runs a Bootcamp mission to the end, fills the matrix and the frames in the Writer, runs the pre-flight, submits, dissects a model, switches track, checks the Writer at 375 px, marks and releases on the Flight Deck, sets an assignment, runs a projector round and posts to it as a student. Prints `console errors: 0`. Screenshots land in `tools/shots/`.
4. Toggle dark theme in Settings: prompt cards, slots and the pre-flight panel remain legible.
5. `Code.gs`: after any change, deploy a **new version**; open the Flight Deck and confirm the toast says "Connected to <sheet name>".
6. LevelUp: after pasting the hand-off snippet, submit a practice essay, press "Send to LevelUp for marking" and confirm the prompt and essay boxes are filled.
7. Content rule: no item, prompt or model may reproduce a real IELTS paper or a published model essay. Prompts are original.
8. Students see their own bands only — never a class rank. Teacher marks stay hidden until released.
9. Template Lab: `node tools/lab-validate.js` prints `OK`; `node tools/gs-test.js` prints `all Lab.gs checks passed`; `python3 tools/lab-smoke.py` and `python3 tools/lab-smoke.py --mock` print `console errors: 0` with no horizontal overflow at 375 px.
10. Template Lab live check after deploying `Lab.gs`: the Lab's status pill reads "AI coach online". Coach one line and one variable, finish a run and confirm a band appears and a row lands in `LabTemplates` and `LabAttempts`.
