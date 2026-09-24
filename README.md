# Position Control — IELTS Academic Writing Task 2

Self-study portal for students and a Flight Deck for the teacher. Sibling of Chart Control (Task 1) and Mission Control: same architecture, theme, offline-first API client, mastery/XP/Fault-List engine and Flight Deck patterns, re-targeted at Task 2. Fourteen modules, five question types, thirty-seven prompts with the eleven variables of the Matrix template at two tiers, a customisable template with three fade levels, a Bootcamp that walks the whole plan on one prompt, nine model essays with dissect/rebuild modes, a forty-minute Writer with a rule-based pre-flight check, and a one-tap hand-off to **LevelUp English** for AI marking.

Live LevelUp: `https://pegasus028.github.io/LevelUp/` (set in `window.PC_LEVELUP_URL` in both HTML files).

## Files

| File | Role |
|---|---|
| `index.html` · `student.js` | Student console: sign-in, Flight plan, Modules, Bootcamp, Writer, Template, Models, Fault list, Record, Settings, Live mission |
| `teacher.html` · `teacher.js` | Flight Deck: class stats, roster by cohort, heat maps, student diagnosis (with the matrix the student planned), marking queue with "Mark in LevelUp →", assignments (type/domain/mode/timer), projector games, CSV/Blooket export, printable report card |
| `theme.css` | Shared design tokens (verbatim from Chart Control) |
| `api.js` | Apps Script client with localStorage outbox and offline fallback (`pc.*` keys) |
| `engine.js` | Item renderer and marking, progress, Fault List, XP, badges, gate readiness (TR/CC/LR/GRA), essay record |
| `template.js` | The customisable Matrix template: frames at two tiers, several openers per paragraph, playbooks for the five question types, structural swaps, fade levels, "my template" per student, the template-ratio measure |
| `writer.js` | Prompt cards; the timed editor (guided / skeleton / exam) with the eleven-variable planning strip and "Fill the frames"; the pre-flight check; rule checkers for thesis / body-paragraph / rewrite items; the AI marking prompt |
| `bootcamp.js` | Bootcamp: 8 steps, ~25 drop-down questions built from the prompt's own variables; hints, second choices, ranks Recruit → Ace; the 10-point pre-flight checklist |
| `content.js` | Question types, domains, schemas, the eleven variables, ranks, badges, the error-tag dictionary (`REMEDIATION`) |
| `topic-00.js … topic-13.js` | The fourteen modules: theory, 406 items, systems checks |
| `prompts.js` · `prompts-2.js` | 37 original prompts (23 from the Matrix Arena bank + 14 new across all five types) with eleven variables × two tiers × near-miss distractors |
| `models.js` | 9 model essays (Band 7 at B2, Band 8 at C1) with the variables behind them, dissect labels and 3 Band 6 contrast versions |
| `mocks.js` | Three exam-mode mocks |
| `roster.js` | Fast-access class lists (edit for M4.1 and the tutees) |
| `Code.gs` | Apps Script backend: Students, Attempts, Sessions, Reports, Assignments, Projector sheets (no AI calls — marking is LevelUp's job) |
| `CONTENT-SCHEMA.md` | How to write more modules, prompts and models |
| `docs/01-IELTS-Task2-Research-and-Method.md` | The research report and the method the app teaches |
| `docs/LEVELUP-HANDOFF-PATCH.md` | The snippet to paste into LevelUp so it receives the essay and prompt |
| `tools/validate.js` | Content validator (`node tools/validate.js`) |
| `tools/test-free.js` | Runs the rule checkers over every free-text item's samples and the pre-flight over every model |
| `tools/smoke.py` | Headless end-to-end test with screenshots (Playwright) |

## Deploy

1. Push the folder to a GitHub Pages repo (e.g. `pegasus028/IELTS-WT2` → `https://pegasus028.github.io/IELTS-WT2/`). No build step.
2. Create a Google Sheet → Extensions → Apps Script → paste `Code.gs`. Set Script property `TEACHER_PIN`. Deploy as a Web app, *Execute as: Me*, *Access: Anyone*.
3. Paste the `/exec` URL into `window.PC_API_URL` in **both** `index.html` and `teacher.html` (or enter it on the Flight Deck sign-in / student Settings).
4. After every edit to `Code.gs`: Deploy → Manage deployments → pencil → **New version** → Deploy. Saving alone does not update the live endpoint.
5. Paste the snippet in `docs/LEVELUP-HANDOFF-PATCH.md` into LevelUp's `index.html` and `teacher.html` so "Send to LevelUp" pre-fills the prompt and essay.
6. Edit `roster.js` with the real class lists.

With `PC_API_URL` empty, both consoles run entirely in the browser (demo/offline mode; teacher PIN 1234).

## How it fits the teaching plan

Modules 00–07 are the method in order (the test → decode → position → the matrix → the template → synthesis → cohesion); 08–11 raise the linguistic ceiling (nominalisation, structural swaps, collocation and register, accuracy); 12–13 adapt the template to the other question types and rehearse exam day. The pre-flight check enforces the ten-point checklist (position in the introduction and conclusion, every part answered, mechanism + example + nuance in each body paragraph, reference over linkers, no memorised language, formal register, 250+ words) and measures how much of an essay is unchanged frame text, so the template fades: guided → skeleton → exam. Each student picks a track in Settings (Band 7 / B2 or Band 8 / C1), which selects the tier of the variables, the frames and the Bootcamp options. Error tags are shared between module items, the pre-flight rows and the teacher heat map.

## Customising the template

Edit `template.js`: `TIERS` holds the four paragraph frames per tier (any number of openers per paragraph; the first is the default), `PLAYBOOKS` re-maps the slot labels and frames for opinion / advantages / problem / two-part prompts, `SWAPS` holds the structural variations. Frames use `{core}`, `{facetA}` … `{rationale}` tokens (see `CONTENT.VARIABLES`). Students choose an opener and edit it in the Template tab; their version is stored per student and used by the Writer. The pre-flight "template ratio" is computed against every frame in the file, so edited frames still count as template text until the student rewrites them.
