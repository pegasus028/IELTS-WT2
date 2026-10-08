# Position Control — IELTS Academic Writing Task 2

Self-study portal for students and a Flight Deck for the teacher. Sibling of Chart Control (Task 1) and Mission Control: same architecture, theme, offline-first API client, mastery/XP/Fault-List engine and Flight Deck patterns, re-targeted at Task 2. Fourteen modules, five question types, thirty-seven prompts with the eleven variables of the Matrix template at two tiers, a customisable template with three fade levels, a Bootcamp that walks the whole plan on one prompt, nine model essays with dissect/rebuild modes, a forty-minute Writer with a rule-based pre-flight check, a one-tap hand-off to **LevelUp English** for AI marking, and the **Template Lab**, where each student builds her own template line by line and tests it on real prompts with AI coaching.

Live LevelUp: `https://pegasus028.github.io/LevelUp/` (set in `window.PC_LEVELUP_URL` in both HTML files).

## Files

| File | Role |
|---|---|
| `index.html` · `student.js` | Student console: sign-in, Flight plan, Modules, Bootcamp, Writer, Template, Models, Fault list, Record, Settings, Live mission |
| `teacher.html` · `teacher.js` | Flight Deck: class stats, roster by cohort, heat maps, student diagnosis (with the matrix the student planned), marking queue with "Mark in LevelUp →", assignments (type/domain/mode/timer), projector games, CSV/Blooket export, printable report card |
| `theme.css` | Shared design tokens (verbatim from Chart Control) |
| `api.js` | Apps Script client with localStorage outbox and offline fallback (`pc.*` keys) |
| `engine.js` | Item renderer and marking, progress, Fault List, XP, badges, gate readiness (TR/CC/LR/GRA), essay record |
| `lab-content.js` · `lab.js` · `lab.css` | **Template Lab**: Blueprint Studio (build a personal template, 14 coached lines, at a 60 / 50 / 40 / 30% template share and a target CEFR/band), Assembly Line (fill the eleven variables for a prompt: untimed, 40 minutes, or 2 minutes per variable), Scorecard (results by template share, trend chart, run history, versions). Points, Lab ranks and seven awards |
| `lab-examples.js` | Generated (`tools/build-examples.js`): the worked examples behind the Lab's **Examples** tab |
| `lab-scenario.js` | The **Test Drive** scenario for the Blueprint Studio: the Bangkok floods of September 2026, five original prompts (one per question type) and the eleven variables for each at Band 6, 7 and 8, with every mechanism and example in the grammatical shapes a frame may ask for |
| `Lab.gs` | Apps Script back end for the Lab: AI coaching and band rating through Claude (tool use, JSON out), saves to the `LabTemplates` / `LabAttempts` tabs, per-student and class daily limits |
| `template.js` | The customisable Matrix template: frames at two tiers, several openers per paragraph, playbooks for the five question types, structural swaps, fade levels, "my template" per student, the template-ratio measure |
| `writer.js` | Prompt cards; the timed editor (guided / skeleton / exam) with the eleven-variable planning strip and "Fill the frames"; the pre-flight check; rule checkers for thesis / body-paragraph / rewrite items; the AI marking prompt |
| `bootcamp.js` | Bootcamp: 8 steps, ~25 drop-down questions built from the prompt's own variables; hints, second choices, ranks Recruit → Ace; the 10-point pre-flight checklist |
| `content.js` | Question types, domains, schemas, the eleven variables, ranks, badges, the error-tag dictionary (`REMEDIATION`) |
| `topic-00.js … topic-13.js` | The fourteen modules: theory, 406 items, systems checks |
| `prompts.js` · `prompts-2.js` | 37 original prompts (23 from the Matrix Arena bank + 14 new across all five types) with eleven variables × two tiers × near-miss distractors |
| `media.js` | The podcast and YouTube video for each module. Podcasts are wired to `audio/module-00.mp3` … `module-13.mp3`; paste a YouTube link into a module's `video: ''` to add its video (instructions at the top of the file) |
| `podcasts.html` | All fourteen episodes on one page, no sign-in (linked from the Podcasts tab) |
| `audio/` | The fourteen podcast MP3s |
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
| `tools/lab-smoke.py` | Template Lab end-to-end test: `python3 tools/lab-smoke.py` (offline) and `--mock` (cloud mode against a mocked server with canned AI replies) |
| `tools/lab-validate.js` · `tools/gs-test.js` | Lab content check; `Code.gs` + `Lab.gs` run in Node against an in-memory sheet and a fake Claude API |

## October 2026 upgrade: one blueprint per question type, and worked examples

- **Blueprints by question type.** Blueprint Studio now asks which of the five question types a blueprint is for (Step 1). Each line keeps its slots, but its name, job, tip and examples follow that type's playbook (`LabContent.TYPE_COMPONENTS` in `lab-content.js`): in a Problem/solution blueprint body A is the cause, body B the solution that answers it, and Nuance A carries the second cause; in an Opinion blueprint the two facets are reasons and Nuance B can be the rebuttal. The builder shows what each slot means for the type (e.g. "[Facet A] = the main cause"), the AI coach is told the type (`Lab.gs`), the Assembly Line filters prompts to the blueprint's type and marks prompts of another type. Blueprints made before the upgrade have no type and behave as before (all-purpose).
- **Copy at another share.** A saved blueprint can be copied to another share (60 → 50 → 40 → 30). Its lines arrive as drafts; the student trims each to the new budget and coaches it again.
- **Pre-flight on every run.** The Assembly Line report runs the ten-point pre-flight on the assembled essay, so students get feedback even when the AI rating is unavailable. The pre-flight now also recognises "A good example of this…", "my final answer is that…" and "I conclude that…".
- **Examples tab.** Twenty blueprints by "Nam" (B1) and twenty by "Fah" (B2): one per question type at 60, 50, 40 and 30%, each used on a real prompt from the bank, with the coaching moments, the assembled essay (her words highlighted), an independent band estimate, the proofreading fixes, a table of estimates by share and a side-by-side comparison of one paragraph at the four shares. Sources: `examples/*.json` (one file per student × type), ratings in `examples/ratings/`, built into `lab-examples.js` by `node tools/build-examples.js`. The same data in the Lab's own save format is in `examples/store/`; an account whose ID starts with `demo-` gets a button to load it, for demonstrating the Assembly Line and the Scorecard. Screenshots of every step: `docs/manual-shots/`.
- **Tools.** `node tools/lab-examples-check.js --all` runs every example through the Lab's own quick checks, budgets, share and pre-flight; `--line TYPE PCT LINE "text"` checks one line. `python3 tools/lab-walkthrough.py --shots` rebuilds all 40 blueprints and runs through the app's screens and retakes the manual screenshots. `examples/BRIEF.md` is the brief used to write the sets.
- **Status message.** When the class server answers with an Apps Script error page (Lab.gs missing), the Lab now says so ("The class server is missing the Lab script (Lab.gs)") instead of "Could not reach the AI coach".

## Podcasts and videos

Each module's introduction (podcast now, YouTube video when it exists) can be opened from four places: the pill strip under each module header on **Modules**, the Podcast/Video buttons beside each module's checklist on the **Flight plan**, the **Lessons to go back to** list on the **Fault list** (built from the questions the student missed, grouped by module, costliest first), and the **Videos** and **Podcasts** tabs. Plays, minutes heard, finished episodes and video opens are kept on the progress object (`p.media`) and shown on the Flight Deck under *Podcasts & videos* in each student's panel.

To add a video: upload it to YouTube as Unlisted or Public (not Private) with embedding allowed, copy the Share link, paste it into that module's `video: ''` in `media.js`, commit, and bump `media.js?v=` in `index.html`, `teacher.html` and `podcasts.html`.

## Deploy

1. Push the folder to a GitHub Pages repo (e.g. `pegasus028/IELTS-WT2` → `https://pegasus028.github.io/IELTS-WT2/`). No build step.
2. Create a Google Sheet → Extensions → Apps Script → paste `Code.gs`. Set Script property `TEACHER_PIN`. Deploy as a Web app, *Execute as: Me*, *Access: Anyone*.
3. Paste the `/exec` URL into `window.PC_API_URL` in **both** `index.html` and `teacher.html` (or enter it on the Flight Deck sign-in / student Settings).
4. After every edit to `Code.gs`: Deploy → Manage deployments → pencil → **New version** → Deploy. Saving alone does not update the live endpoint.
5. **Template Lab.** In the same Apps Script project add a second file named `Lab` and paste `Lab.gs`. `Code.gs` already carries the one-line `LAB-HOOK` in `doPost` (if you keep your own `Code.gs`, copy that line in, straight after the JSON parse and before the lock). Script properties: `ANTHROPIC_API_KEY` (required for AI coaching; without it the Lab runs its quick checks only). Optional: `LAB_COACH_MODELS` (default `claude-haiku-4-5-20251001,claude-sonnet-4-6`), `LAB_RATE_MODELS` (default `claude-sonnet-4-6,claude-haiku-4-5-20251001`), `LAB_STUDENT_DAILY` (AI calls per student per day, default 250), `LAB_DAILY` (whole class, default 4000). Then deploy a **new version**.
6. Paste the snippet in `docs/LEVELUP-HANDOFF-PATCH.md` into LevelUp's `index.html` and `teacher.html` so "Send to LevelUp" pre-fills the prompt and essay.
7. Edit `roster.js` with the real class lists.

With `PC_API_URL` empty, both consoles run entirely in the browser (demo/offline mode; teacher PIN 1234).

## How it fits the teaching plan

Modules 00–07 are the method in order (the test → decode → position → the matrix → the template → synthesis → cohesion); 08–11 raise the linguistic ceiling (nominalisation, structural swaps, collocation and register, accuracy); 12–13 adapt the template to the other question types and rehearse exam day. The pre-flight check enforces the ten-point checklist (position in the introduction and conclusion, every part answered, mechanism + example + nuance in each body paragraph, reference over linkers, no memorised language, formal register, 250+ words) and measures how much of an essay is unchanged frame text, so the template fades: guided → skeleton → exam. Each student picks a track in Settings (Band 7 / B2 or Band 8 / C1), which selects the tier of the variables, the frames and the Bootcamp options. Error tags are shared between module items, the pre-flight rows and the teacher heat map.

## Customising the template

Edit `template.js`: `TIERS` holds the four paragraph frames per tier (any number of openers per paragraph; the first is the default), `PLAYBOOKS` re-maps the slot labels and frames for opinion / advantages / problem / two-part prompts, `SWAPS` holds the structural variations. Frames use `{core}`, `{facetA}` … `{rationale}` tokens (see `CONTENT.VARIABLES`). Students choose an opener and edit it in the Template tab; their version is stored per student and used by the Writer. The pre-flight "template ratio" is computed against every frame in the file, so edited frames still count as template text until the student rewrites them.

## Template Lab

**Blueprint Studio.** The student chooses a template share and a target level, then rewrites fourteen template lines (topic opener, the two sides, position preview, then topic sentence / mechanism / example / nuance for each body paragraph, and conclusion opener / synthesised position / rationale). Each line shows its job, the criterion it serves, a word budget derived from the share, and three examples at her tier (the other tier on request). She writes her own version with slot buttons ([Core Topic], [Facet A] …) and presses *Coach me*. The quick check runs at once: required slots, word budget, copied-from-example, clichés and robotic linkers, contractions, common misspellings. The AI coach then returns errors with corrections, whether the line does its job, whether it is reusable for any prompt, the grammar the slot will need, a CEFR level and band estimate, one piece of praise and one next step. Every save is a version; a new version earns points only for improvement.

**Test Drive.** While she writes each line, the Studio drops it into a real essay on the Bangkok floods of September 2026 (`lab-scenario.js`), so she can see her own frame carrying real ideas before she ever opens the Assembly Line. The frame is always hers; the scenario only fills the slots. She can switch between the five question types (Discuss, Opinion, Advantage, Problem, Two-part) and the level of the ideas (Band 6 / 7 / 8; the default follows her blueprint: B1 → 6, B2 → 7, C1 and C2 → 8). Her lead-in decides the grammar of each slot, so the scenario keeps every mechanism as an -ing phrase and a clause and every example as a noun phrase and a clause, and the matching shape is used ("works by" → *diverting floodwater…*, "because" → *tunnels divert floodwater…*). Notes under the paragraph explain the shape the slot needed, show the reworded second mention, flag slot labels that change with the question type, warn when an example is the subject of her verb (plural examples break "shows"), and warn when the ideas are at a different band from her blueprint. On the blueprint summary the whole essay is assembled with the ideas highlighted, its word count and actual template share measured against her chosen share. No server or AI is used, so it works offline and costs nothing.

**Assembly Line.** She picks a saved blueprint (its share and level come with it), a timing mode and a prompt from the bank (fit badges show which question types suit the frame; playbook labels rename the slots for opinion, advantage, problem and two-part prompts). Each variable card shows its job, the form its slot needs (read from her own frame and from the coach), a word target, and the sentences it will appear in, filled live. Slots that appear twice (Core Topic, Facets, Position) ask for a reworded second mention. After coaching she can compare with the bank's model answer. The finished essay is assembled with her words highlighted, its actual template share measured, and rated TR / CC / LR / GRA with an overall band (IELTS rounding), strengths, and priorities for the next half band. Every run is saved; *Revise* starts version 2, 3 … of the same run.

**Scorecard.** Lab points and rank, runs, best band, average of the last three; a table comparing the four template shares (runs, average and best band, points, actual share, time); a band-by-run chart per share; run history with change against the previous run at the same share; the blueprints and how they perform.

**Points.** Per line or variable: submitted 5, does its job 10 (partly 5), no errors 10 (one error 4), on budget 5, own words 5, at target level 5, reworded second mention 5, speed bonus up to 6 (2-minute mode). Per run: complete 20, inside 40 minutes 30, band × 10, beating your best at that share 25. A quarter of Lab points also goes to the app's XP. Ranks: Apprentice → Draughtsman (400) → Engineer (1,200) → Architect (2,500) → Chief Engineer (5,000).

**The template shares.** Wray & Pegg (2009, IELTS Research Reports 9) proposed that a Band 7 script contains at least 50% self-generated language and a Band 8 script at least 59%. A 60% template leaves 40% (the Band 6 floor), 50% leaves 50%, 40% leaves 60% and 30% leaves 70%, so the Scorecard lets students see for themselves which share works.

**Data.** The progress object carries a small `lab` summary (points, runs by share, best band) that the Flight Deck shows on each student's panel. Full blueprints, essays and coaching are in the `LabTemplates` and `LabAttempts` tabs (one row per version, JSON in the last column, trimmed below the 50,000-character cell limit). Offline, or with no class server, the Lab keeps everything on the device and syncs when the server is back.
