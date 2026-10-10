# Quillmoor Academy — IELTS Academic Writing Task 2

*Formerly Position Control.* Quillmoor Academy is an original wizarding school on a windy moor that teaches *argument-craft* (motto *Verba vincunt*, "words win"). It is the same Task 2 self-study app, re-themed and given a story layer, for T.Chris's five private IELTS tutees (cohort `Tutoring`). It is *inspired by* school-of-magic stories but uses no names, crests or spell words from any existing series.

What the app teaches has not changed: fourteen modules (shown as **Classes**), five question types, thirty-seven prompts with the eleven variables of the Matrix template at two tiers, a customisable template (**My Spellbook**) with three fade levels, the **Duelling Hall** (was Bootcamp) that walks the whole plan on one prompt, nine model essays in the **Exemplar Archive**, a forty-minute **Scriptorium** (was Writer) with a rule-based structural check (**the Ten Wards**, was the pre-flight check), a one-tap hand-off to **LevelUp English** for AI marking ("Send to the examiners"), and the **Spellbook Workshop** (was Template Lab), where each student builds her own template line by line and tests it on real prompts with AI coaching. The teacher console is the **Staff Room** (was Flight Deck). Sibling of Chart Control (Task 1): same architecture, offline-first API client and mastery/Fault-List engine.

### Old name → Quillmoor name

| Code / old label | Shown to students as |
|---|---|
| Flight plan (`plan`) · Modules (`map`) | Map Room · Classes |
| Bootcamp · Writer · Template · Template Lab | Duelling Hall · Scriptorium · My Spellbook · Spellbook Workshop |
| Blueprint Studio · Assembly Line · Scorecard | Design · Cast it on a prompt · Spellbook record |
| Models · Videos · Podcasts · Fault list · Record · Settings · Live mission | Exemplar Archive · Memory Basin · Castle Wireless · Mending Room · Report Card · Your Trunk · Assembly |
| Systems check · XP · streak · badges · assignments | examiner's gate · Merits · candles · keepsakes · owl post |
| Pre-flight check · "Mark in LevelUp" · partner apps · Flight Deck | the Ten Wards · "Send to the examiners" · Elective classes · Staff Room |
| Ranks Ground Crew → Mission Director | Newcomer, First-year, Second-year, Third-year, Fourth-year, Fifth-year, Prefect, Graduate (same thresholds) |
| Bootcamp ranks Recruit → Ace | Novice, Apprentice, Duellist, Adept, Master Duellist, Champion (same thresholds) |

Ids, `pc.*` localStorage keys, API action names, sheet columns and item/level ids are unchanged, so existing progress carries over.

Live LevelUp: `https://pegasus028.github.io/LevelUp/` (set in `window.PC_LEVELUP_URL` in both HTML files).

## Files

| File | Role |
|---|---|
| `index.html` · `student.js` | Student console: sign-in, Map Room, Classes, Duelling Hall, Scriptorium, My Spellbook, Exemplar Archive, Mending Room, Report Card, Your Trunk, Assembly, and the story screens |
| `story-content.js` | `window.STORY`: the four houses, the seven chapters (pages, keywords, missions, gates, endings), the events (campaign, Midwinter Tournament) and the finale. All story text lives here |
| `sorting.js` | `window.SORTING`: the Sorting Lantern's twelve questions (three per criterion) that place a student in her house |
| `story.js` · `story.css` | The story engine: chapter pages, the Sorting, gates, keepsakes, house points (`Story.housePoints(p)`), teacher unlocks and re-sorts |
| `story/` | Chapter pictures, `story/chN-01.webp` … `story/chN-end.webp` (a placeholder shows until a picture exists) |
| `docs/READING-ROOM.md` | Teacher notes for class discussion of the stories that inspired the setting |
| `teacher.html` · `teacher.js` | Staff Room: class stats, the House Cup per cohort, roster by cohort (with Chapter and House columns), heat maps, student diagnosis (with the matrix the student planned) and a Quillmoor story panel (unlock up to chapter N, re-sort), marking queue with "Send to the examiners →", assignments (owl post) and story orders, projector games, CSV/Blooket export, printable report card |
| `theme.css` | Shared design tokens (Quillmoor colours) |
| `api.js` | Apps Script client with localStorage outbox and offline fallback (`pc.*` keys) |
| `engine.js` | Item renderer and marking, progress, Fault List, XP, badges, gate readiness (TR/CC/LR/GRA), essay record |
| `lab-content.js` · `lab.js` · `lab.css` | **Spellbook Workshop** (Template Lab): Design (Blueprint Studio: build a personal template, 14 coached lines, at a 60 / 50 / 40 / 30% template share and a target CEFR/band), Cast it on a prompt (Assembly Line: fill the eleven variables for a prompt: untimed, 40 minutes, or 2 minutes per variable), Spellbook record (Scorecard: results by template share, trend chart, run history, versions). Points, Workshop ranks and seven keepsakes |
| `lab-examples.js` | Generated (`tools/build-examples.js`): the worked examples behind the Lab's **Examples** tab |
| `lab-scenario.js` | The **Test Drive** scenario for Design (Blueprint Studio): the Bangkok floods of September 2026, five original prompts (one per question type) and the eleven variables for each at Band 6, 7 and 8, with every mechanism and example in the grammatical shapes a frame may ask for |
| `Lab.gs` | Apps Script back end for the Lab: AI coaching and band rating through Claude (tool use, JSON out), saves to the `LabTemplates` / `LabAttempts` tabs, per-student and class daily limits |
| `template.js` | The customisable Matrix template: frames at two tiers, several openers per paragraph, playbooks for the five question types, structural swaps, fade levels, "my template" per student, the template-ratio measure |
| `writer.js` | Prompt cards; the Scriptorium, the timed editor (guided / skeleton / exam) with the eleven-variable planning strip and "Fill the frames"; the Ten Wards (`Writer.preflight`); rule checkers for thesis / body-paragraph / rewrite items; the AI marking prompt |
| `bootcamp.js` | Duelling Hall (Bootcamp): 8 steps, ~25 drop-down questions built from the prompt's own variables; hints, second choices, ranks Novice → Champion; the Ten Wards checklist |
| `content.js` | Question types, domains, schemas, the eleven variables, ranks (Newcomer → Graduate), badges (keepsakes), the error-tag dictionary (`REMEDIATION`) |
| `topic-00.js … topic-13.js` | The fourteen modules: theory, 406 items, systems checks |
| `prompts.js` · `prompts-2.js` | 37 original prompts (23 from the Matrix Arena bank + 14 new across all five types) with eleven variables × two tiers × near-miss distractors |
| `media.js` | The podcast (Castle Wireless) and YouTube video (Memory Basin) for each module. Podcasts are wired to `audio/module-00.mp3` … `module-13.mp3`; paste a YouTube link into a module's `video: ''` to add its video (instructions at the top of the file) |
| `podcasts.html` | Castle Wireless: all fourteen episodes on one page, no sign-in (linked from the Castle Wireless tab) |
| `audio/` | The fourteen podcast MP3s |
| `models.js` | Exemplar Archive: 9 model essays (Band 7 at B2, Band 8 at C1) with the variables behind them, dissect labels and 3 Band 6 contrast versions |
| `mocks.js` | Three exam-mode mocks |
| `partners.js` | Elective classes: T.Chris's grammar and vocabulary apps, linked from the Mending Room and the band ladder |
| `roster.js` | Fast-access class list: the five Quillmoor tutees (Aeh, Mikii, Donut, JingJing, Pear; cohort `Tutoring`). M4.1 moved to the Task 1 app in Oct 2026 |
| `Code.gs` | Apps Script backend: Students, Attempts, Sessions, Reports, Assignments, Projector sheets, plus the House Cup totals (`houses`). No AI calls — marking is LevelUp's job |
| `CONTENT-SCHEMA.md` | How to write more modules, prompts and models |
| `docs/01-IELTS-Task2-Research-and-Method.md` | The research report and the method the app teaches |
| `docs/LEVELUP-HANDOFF-PATCH.md` | The snippet to paste into LevelUp so it receives the essay and prompt |
| `tools/validate.js` | Content validator (`node tools/validate.js`) |
| `tools/test-free.js` | Runs the rule checkers over every free-text item's samples and the pre-flight over every model |
| `tools/smoke.py` | Headless end-to-end test with screenshots (Playwright) |
| `tools/lab-smoke.py` | Template Lab end-to-end test: `python3 tools/lab-smoke.py` (offline) and `--mock` (cloud mode against a mocked server with canned AI replies) |
| `tools/lab-validate.js` · `tools/gs-test.js` | Lab content check; `Code.gs` + `Lab.gs` run in Node against an in-memory sheet and a fake Claude API (includes the House Cup and story-order checks) |
| `tools/story-validate.js` | Story content check (chapters, keywords, missions and gates against the topic files) |

## The story layer

The story wraps the existing modules; it never replaces them. Each chapter's missions are the app's own lessons (`m02s1` …) and its gate is the existing examiner's gate (`m02l1` …), so a student who passes the gates moves through the story. The heroine is the student herself ("you"); every chapter has 5–6 illustrated pages, 6–10 Task 2 keywords with English and Thai glosses, a short list of missions, a gate and an ending that leads into the next chapter.

| Ch | Title | Gate | Opens |
|---|---|---|---|
| 1 | The Letter (the Sorting) | m00l1 + m01l1 | Map Room, Classes, Castle Wireless, Memory Basin, Report Card, Your Trunk |
| 2 | The First Duel | m02l1 | Scriptorium |
| 3 | The Living Map | m03l1 + m04l1 | Duelling Hall |
| 4 | The Spellbook | m05l1 + m06l1 + a saved spellbook design + one essay sent to the examiners | My Spellbook, Spellbook Workshop |
| 5 | The Potions Lab | m07l1 + m08l1 + m09l1 | Mending Room |
| — | Midwinter Tournament (optional) | — | — |
| 6 | The Library and the Newsroom | m10l1 + m11l1 + fewer than 5 faults due | — |
| 7 | The Grand Examination | m12l1 + m13l1 + a LevelUp-marked essay ≥ 7.5 | Exemplar Archive |

Owl post and Assembly are always open; the Mending Room also opens whenever five or more faults are due. Returning students land in the first chapter whose gate they have not passed.

**Files.** `story-content.js` holds all the words (houses, chapters, events, finale); `sorting.js` holds the twelve Sorting questions; `story.js` (with `story.css`) is the engine; `story/` holds the pictures. The story state is saved on the progress object as `p.story` (`house`, `sort`, `chapter`, `unlockedTo`, `seen`, `flags`, `keepsakes`, `hp`, `tournament`) and travels to the class sheet with the rest of the progress, so no sheet column was added.

**To swap a picture.** Save a square image (1024 × 1024 works well) as WebP with the exact file name the chapter uses, e.g. `story/ch3-02.webp`, and push it. No code change is needed; until a file exists the page shows a placeholder. Keep text out of the pictures (the app prints the text, so keywords stay tappable), show the heroine from behind or at a distance, and keep the school original: no crests, castles or costumes copied from a film.

**To edit the text.** Edit the chapter in `story-content.js`. A page's `text` is plain B1 English (present tense, "you", short sentences); a keyword is written `[[word|English gloss|คำแปลไทย]]`. Spoken lines use spoken connectors (so, but, because, anyway); formal connectors belong only in written things in the story (letters, the school paper, exam papers). Run `node tools/story-validate.js`, then bump `story-content.js?v=` in `index.html` (and `teacher.html`).

**Teacher unlock.** In the Staff Room, open a student and use *Unlock up to chapter N*, or press *Unlock all chapters* on a cohort in the House Cup panel. *Re-sort* sends her back to the Sorting Lantern on her next visit. These are stored as assignment rows through the existing `assignments` action — `{ id, ts, kind:'unlock', studentId | cohort, chapter }` and `{ id, ts, kind:'resort', studentId }` — and the student console applies them quietly (`unlockedTo = max(...)`); they never appear as owl post. The Staff Room lists them under *Story orders*, where they can be removed. An unlock opens chapters early; it never locks one. Entering the teacher PIN in Your Trunk unlocks every chapter on that account (for demonstrations).

**House points.** Worked out afresh from progress each time (`Story.housePoints(p)`), so they cannot drift: 5 per lesson passed + 20 per examiner's gate passed + 2 per fault mended (max 100) + 15 per essay sent to LevelUp + 25 per essay marked at or above her target band + 10 per tournament task. The House Cup adds them up per house for a cohort. The backend action `houses` (no sign-in needed) returns only `{ totals:{compass,bridge,lexicon,loom}, members:{…} }` for the requested cohort — never a name or an id — and `API.houses(cohort)` computes the same from the browser's data when offline. Houses cooperate inside and compete between houses; there is no public individual leaderboard.

**Houses.** A student is sorted by her strongest criterion on the Sorting: Compass (Task Response, navy and silver, Professor Rhea North), Bridge (Coherence & Cohesion, teal and copper, Professor Tomás Brigg), Lexicon (Lexical Resource, plum and gold, Professor Wen Liang), Loom (Grammar, crimson and cream, Professor Ada Weaver).

**After changing `Code.gs`** (the `houses` action is new in Oct 2026): in Apps Script, Deploy → Manage deployments → pencil → **New version** → Deploy. Saving alone does not update the live `/exec` endpoint, and until you redeploy the House Cup falls back to the browser's own data.

## October 2026 upgrade: one blueprint per question type, and worked examples

*(Blueprint Studio, Assembly Line and Scorecard are shown to students as Design, Cast it on a prompt and Spellbook record; a blueprint is a "spellbook design"; the pre-flight check is the Ten Wards.)*

- **Blueprints by question type.** Blueprint Studio now asks which of the five question types a blueprint is for (Step 1). Each line keeps its slots, but its name, job, tip and examples follow that type's playbook (`LabContent.TYPE_COMPONENTS` in `lab-content.js`): in a Problem/solution blueprint body A is the cause, body B the solution that answers it, and Nuance A carries the second cause; in an Opinion blueprint the two facets are reasons and Nuance B can be the rebuttal. The builder shows what each slot means for the type (e.g. "[Facet A] = the main cause"), the AI coach is told the type (`Lab.gs`), the Assembly Line filters prompts to the blueprint's type and marks prompts of another type. Blueprints made before the upgrade have no type and behave as before (all-purpose).
- **Copy at another share.** A saved blueprint can be copied to another share (60 → 50 → 40 → 30). Its lines arrive as drafts; the student trims each to the new budget and coaches it again.
- **Pre-flight on every run.** The Assembly Line report runs the ten-point pre-flight on the assembled essay, so students get feedback even when the AI rating is unavailable. The pre-flight now also recognises "A good example of this…", "my final answer is that…" and "I conclude that…".
- **Examples tab.** Twenty blueprints by "Nam" (B1) and twenty by "Fah" (B2): one per question type at 60, 50, 40 and 30%, each used on a real prompt from the bank, with the coaching moments, the assembled essay (her words highlighted), an independent band estimate, the proofreading fixes, a table of estimates by share and a side-by-side comparison of one paragraph at the four shares. Sources: `examples/*.json` (one file per student × type), ratings in `examples/ratings/`, built into `lab-examples.js` by `node tools/build-examples.js`. The same data in the Lab's own save format is in `examples/store/`; an account whose ID starts with `demo-` gets a button to load it, for demonstrating the Assembly Line and the Scorecard. Screenshots of every step: `docs/manual-shots/`.
- **Tools.** `node tools/lab-examples-check.js --all` runs every example through the Lab's own quick checks, budgets, share and pre-flight; `--line TYPE PCT LINE "text"` checks one line. `python3 tools/lab-walkthrough.py --shots` rebuilds all 40 blueprints and runs through the app's screens and retakes the manual screenshots. `examples/BRIEF.md` is the brief used to write the sets.
- **Status message.** When the class server answers with an Apps Script error page (Lab.gs missing), the Lab now says so ("The class server is missing the Lab script (Lab.gs)") instead of "Could not reach the AI coach".

## Castle Wireless and Memory Basin (podcasts and videos)

Each module's introduction (podcast now, YouTube video when it exists) can be opened from four places: the pill strip under each module header on **Classes**, the Podcast/Video buttons beside each module's checklist in the **Map Room**, the **Lessons to go back to** list in the **Mending Room** (built from the questions the student missed, grouped by module, costliest first), and the **Memory Basin** and **Castle Wireless** tabs. Plays, minutes heard, finished episodes and video opens are kept on the progress object (`p.media`) and shown in the Staff Room under *Castle Wireless & Memory Basin* in each student's panel.

To add a video: upload it to YouTube as Unlisted or Public (not Private) with embedding allowed, copy the Share link, paste it into that module's `video: ''` in `media.js`, commit, and bump `media.js?v=` in `index.html`, `teacher.html` and `podcasts.html`.

## Deploy

1. Push the folder to a GitHub Pages repo (e.g. `pegasus028/IELTS-WT2` → `https://pegasus028.github.io/IELTS-WT2/`). No build step.
2. Create a Google Sheet → Extensions → Apps Script → paste `Code.gs`. Set Script property `TEACHER_PIN`. Deploy as a Web app, *Execute as: Me*, *Access: Anyone*.
3. Paste the `/exec` URL into `window.PC_API_URL` in **both** `index.html` and `teacher.html` (or enter it on the Staff Room sign-in / in Your Trunk).
4. After every edit to `Code.gs`: Deploy → Manage deployments → pencil → **New version** → Deploy. Saving alone does not update the live endpoint. (The Oct 2026 Quillmoor release added the `houses` action, so redeploy once.)
5. **Spellbook Workshop (Template Lab).** In the same Apps Script project add a second file named `Lab` and paste `Lab.gs`. `Code.gs` already carries the one-line `LAB-HOOK` in `doPost` (if you keep your own `Code.gs`, copy that line in, straight after the JSON parse and before the lock). Script properties: `ANTHROPIC_API_KEY` (required for AI coaching; without it the Lab runs its quick checks only). Optional: `LAB_COACH_MODELS` and `LAB_RATE_MODELS` (comma lists tried in order; defaults in `LAB_DEFAULTS`), `LAB_STUDENT_DAILY` (AI calls per student per day, default 250), `LAB_DAILY` (whole class, default 4000). Then deploy a **new version**.
6. Paste the snippet in `docs/LEVELUP-HANDOFF-PATCH.md` into LevelUp's `index.html` and `teacher.html` so "Send to the examiners" pre-fills the prompt and essay.
7. Edit `roster.js` if the tutee list changes.

With `PC_API_URL` empty, both consoles run entirely in the browser (demo/offline mode; teacher PIN 1234).

## How it fits the teaching plan

Modules 00–07 are the method in order (the test → decode → position → the matrix → the template → synthesis → cohesion); 08–11 raise the linguistic ceiling (nominalisation, structural swaps, collocation and register, accuracy); 12–13 adapt the template to the other question types and rehearse exam day. The Ten Wards (the pre-flight check) enforce the ten-point checklist (position in the introduction and conclusion, every part answered, mechanism + example + nuance in each body paragraph, reference over linkers, no memorised language, formal register, 250+ words) and measure how much of an essay is unchanged frame text, so the template fades: guided → skeleton → exam. Each student picks a track in Your Trunk (Band 7 / B2 or Band 8 / C1), which selects the tier of the variables, the frames and the Duelling Hall options. Error tags are shared between module items, the Ten Wards rows and the teacher heat map.

## Customising the template

Edit `template.js`: `TIERS` holds the four paragraph frames per tier (any number of openers per paragraph; the first is the default), `PLAYBOOKS` re-maps the slot labels and frames for opinion / advantages / problem / two-part prompts, `SWAPS` holds the structural variations. Frames use `{core}`, `{facetA}` … `{rationale}` tokens (see `CONTENT.VARIABLES`). Students choose an opener and edit it in My Spellbook; their version is stored per student and used by the Scriptorium. The pre-flight "template ratio" is computed against every frame in the file, so edited frames still count as template text until the student rewrites them.

## Spellbook Workshop (Template Lab)

**Design (Blueprint Studio).** The student chooses a template share and a target level, then rewrites fourteen template lines (topic opener, the two sides, position preview, then topic sentence / mechanism / example / nuance for each body paragraph, and conclusion opener / synthesised position / rationale). Each line shows its job, the criterion it serves, a word budget derived from the share, and three examples at her tier (the other tier on request). She writes her own version with slot buttons ([Core Topic], [Facet A] …) and presses *Coach me*. The quick check runs at once: required slots, word budget, copied-from-example, clichés and robotic linkers, contractions, common misspellings. The AI coach then returns errors with corrections, whether the line does its job, whether it is reusable for any prompt, the grammar the slot will need, a CEFR level and band estimate, one piece of praise and one next step. Every save is a version; a new version earns points only for improvement.

**Test Drive.** While she writes each line, the Studio drops it into a real essay on the Bangkok floods of September 2026 (`lab-scenario.js`), so she can see her own frame carrying real ideas before she ever opens the Assembly Line. The frame is always hers; the scenario only fills the slots. She can switch between the five question types (Discuss, Opinion, Advantage, Problem, Two-part) and the level of the ideas (Band 6 / 7 / 8; the default follows her blueprint: B1 → 6, B2 → 7, C1 and C2 → 8). Her lead-in decides the grammar of each slot, so the scenario keeps every mechanism as an -ing phrase and a clause and every example as a noun phrase and a clause, and the matching shape is used ("works by" → *diverting floodwater…*, "because" → *tunnels divert floodwater…*). Notes under the paragraph explain the shape the slot needed, show the reworded second mention, flag slot labels that change with the question type, warn when an example is the subject of her verb (plural examples break "shows"), and warn when the ideas are at a different band from her blueprint. On the blueprint summary the whole essay is assembled with the ideas highlighted, its word count and actual template share measured against her chosen share. No server or AI is used, so it works offline and costs nothing.

**Cast it on a prompt (Assembly Line).** She picks a saved blueprint (its share and level come with it), a timing mode and a prompt from the bank (fit badges show which question types suit the frame; playbook labels rename the slots for opinion, advantage, problem and two-part prompts). Each variable card shows its job, the form its slot needs (read from her own frame and from the coach), a word target, and the sentences it will appear in, filled live. Slots that appear twice (Core Topic, Facets, Position) ask for a reworded second mention. After coaching she can compare with the bank's model answer. The finished essay is assembled with her words highlighted, its actual template share measured, and rated TR / CC / LR / GRA with an overall band (IELTS rounding), strengths, and priorities for the next half band. Every run is saved; *Revise* starts version 2, 3 … of the same run.

**Spellbook record (Scorecard).** Lab points and rank, runs, best band, average of the last three; a table comparing the four template shares (runs, average and best band, points, actual share, time); a band-by-run chart per share; run history with change against the previous run at the same share; the blueprints and how they perform.

**Points.** Per line or variable: submitted 5, does its job 10 (partly 5), no errors 10 (one error 4), on budget 5, own words 5, at target level 5, reworded second mention 5, speed bonus up to 6 (2-minute mode). Per run: complete 20, inside 40 minutes 30, band × 10, beating your best at that share 25. A quarter of Lab points also goes to the app's Merits (XP). Ranks: Apprentice Scribe → Scribe (400) → Spellwright (1,200) → Enchanter (2,500) → Master Spellwright (5,000).

**The template shares.** Wray & Pegg (2009, IELTS Research Reports 9) proposed that a Band 7 script contains at least 50% self-generated language and a Band 8 script at least 59%. A 60% template leaves 40% (the Band 6 floor), 50% leaves 50%, 40% leaves 60% and 30% leaves 70%, so the Scorecard lets students see for themselves which share works.

**Data.** The progress object carries a small `lab` summary (points, runs by share, best band) that the Staff Room shows on each student's panel. Full blueprints, essays and coaching are in the `LabTemplates` and `LabAttempts` tabs (one row per version, JSON in the last column, trimmed below the 50,000-character cell limit). Offline, or with no class server, the Lab keeps everything on the device and syncs when the server is back.
