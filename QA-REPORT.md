# Position Control / Quillmoor Academy — QA report

## Free-text checker: every fair answer passes — 16 October 2026 (Claude Opus 5.5)

Trigger: a student's thesis for m01s2q7, "The advantages of online lessons outweighs the disadvantages becuase it saves travel time.", was refused with "Add the reason" because of the typo.

**Measured before the fix.** Two independent teacher-written answer sets for the 30 typed items (11 theses, 15 rewrites, 4 body paragraphs), written without seeing the checker: the old rules refused 83 of 280 valid answers in the first set and 64 of 168 in the second (about one in three).

**What changed** (`writer.js`, item lists in `topic-03/06/07/08/09/10/11.js`):
- Tolerant reading: curly apostrophes and quotes from iPad keyboards straightened; American spelling matched as British; one-letter typos repaired for ~95 key words (because, outweigh, believe, government, pollution …) unless the typo is itself a real word (list built from an English frequency list); chat forms (coz, bcoz) and "out weigh" / "overweigh(t) the" read as their word. A repaired typo still passes but adds a note ("Read as: becuase → because. Check the spelling."). The spelling item m11ckq8 is never repaired, and register bans (contractions, kids, a lot of) still look at what she typed, now including curly apostrophes, which used to slip through.
- Synonyms: item keyword lists widen to words that mean the same (online → e-learning, remote, virtual, distance learning; student → pupil, teenager, young people, adolescent; car → vehicle, traffic, driving; outweigh → more serious than, exceed, do more harm than good, greater advantages than, net gain …). Plurals and hyphen/space variants match.
- Reasons and conditions are now two lists: a stem that asks for a condition ("under what condition", "with the condition") needs a condition (provided that, as long as, only if, rather than, with strict limits, no more than …); "why / a reason / the cause" accepts either. Reasons now include since, as, given that, due to, so, a semicolon or dash explanation, a purpose ("to protect …"), "by + -ing" and ", saving …".
- Position words: more stance phrasings (is a mistake, is worth keeping, the best way, in favour of, net gain …). "Some people think … others think …" and "it depends" still fail unless she then says what she thinks; "partly agree" must name both parts.
- Rewrites: m08s2q2 / m08ckq3 accept any nominalised cause (price increases, inflation, lessons beginning before eight); m09s1q5 accepts every negative-adverb inversion (At no point does, Little does, Nowhere does …) at the start of the sentence only; m09ckq7 accepts any ", -ing" participle after the comma (and no longer accepts a dangling one at the front); m10 items accept every formal quantifier and now also require the sleep (s3q7) and the phones (ckq8) to stay; m07 detox items accept "so" (s2q4, as the stem says) and pronoun reference, require the chain's content, and m07s2q4 must join the sentences; m03s1q4 refuses a purpose clause ("to reduce pollution") and a subject + verb clause; m11ckq8 refuses the comma splice; m06s1q7 must respect both the income and the damage.
- Body paragraphs: wider mechanism / example / nuance wording, a capitalised place name counts as an example, "research shows" is refused.
- The Ten Wards, the Plan Wards and the Spellbook Workshop's keyword check read the repaired text too; the Workshop's contraction check catches curly apostrophes.

**After the fix.** First set: 276 of 280 valid answers pass (the 4 still refused break a house rule: a contraction, "kids", a gerund Core Topic); second set: 168 of 168. Invalid answers refused: 202. Known gaps (12, recorded in the bank): the body-paragraph checker cannot tell which side a paragraph argues or whether a Bangkok example is on the prompt's topic, and two theses whose reason is weak but present.

**Tests.** `tools/free-text-bank.json` holds both sets; `tools/test-free.js` now runs them (764 checks). All suites pass: validate, test-free, audit, lab-validate, template-test, story-validate and smoke.py (0 console errors).

---

## Word cards, Chapter 1 text and lesson audio — 11 October 2026 (Claude Opus 5.5)

Requested by T.Chris (11 Oct 2026, evening):
- **Keyword pop-ups** now show a picture, gloss, Thai, example, and three synonyms and three antonyms (B1, B2, C1). Each synonym/antonym of a keyword opens its own full card (325 cards: 51 keywords + 274 linked words). Drafted in seven batches, then four independent adversarial review passes fixed 111 cards (wrong-sense synonyms such as *witnesses* for *sources*, *referees* for *examiners*; dishonest levels; Thai in the wrong sense such as นั่งร้าน for *scaffolding*; examples that said "four examiners read one essay"). Pictures are Lucide icons (ISC), not Gemini. Third-level words (on linked cards) open a card only where one exists (1,402 of 1,950 chips); the rest show in a dashed box.
- **Chapter 1 text:** p1 "It is October…", p2 "Term begins on 29 October.", p3 "The following week you stand on a windy moor.", p4 bridging sentence before the Hall of Lanterns, p6 rewritten as given (two small edits: "my timetable" → "your timetable" to keep the second-person story voice, and the class names put in double quotes inside the spoken line with Penhallow's speech closed). Narration re-recorded for the five pages.
- **Lessons:** *Listen to this lesson* button (recorded, 84 texts), podcast row before the lessons in Classes and in each chapter's missions, and *Back to the map* (Map Room) instead of *Back to the classes*.
- Checks: `tools/story-validate.js` OK; `tools/words-smoke.py` passes at 1100 px and 390 px (cards, linked cards, back trail, page text, podcast rows, Listen, Back to the map).

## Audit for the one-month tutoring run — 11 October 2026 (Claude Fable 5.1)

Audited at commit 5c417e7 (Quillmoor story, narration, Map Room backdrop) against the goal: five Thai tutees aged 13–17 at B1/B2, one month of 2-hour online lessons plus 1–2 hours of homework a week, aiming at Band 7.5 over one to two years.

### Load and run

- Every `.js` and `.gs` file parses (acorn, ES2022). No Harry Potter names anywhere in the app.
- Suites: validate, story-validate (7 chapters, 12 sorting items), test-free (108), audit, lab-validate, lab-examples-check, gs-test, date-test all pass. smoke.py and lab-smoke.py pass on a copy with the server address blanked.
- First-run walk as `tut-aeh` at 390 px: roster sign-in → Map Room → six pages of chapter 1 → the Sorting (tie → house choice) → the gate list. No page-width overflow.
- **One 404 on every view: `story/map-bg.webp`.** `story.js` and the 5c417e7 commit message reference it, but the file is not in the repository. The Map Room shows fog instead; nothing breaks. The art session owns that file.

### Feasibility (the one-month question)

Estimated in-app time by chapter (now shown on each chapter card): ch1 80 min, ch2 50, ch3 90, ch4 175, ch5 120, ch6 90, ch7 225; about 13.8 hours in all, plus roughly 20% for re-running lessons that miss the 60% pass mark. Four weeks of lesson plus homework give 12–16 hours, so chapters 1–6 fit a month if lesson time is spent in the app; chapter 7's three mocks and the Band 7.5 mark belong to the months after.

### Work packages shipped later the same day (Fable 5.1)

| WP | Commit | What changed |
| --- | --- | --- |
| 3 One spellbook everywhere | bfaa116 | Universal Spine frames are the B2 default in My Spellbook and the Scriptorium; typed playbook frames only on the C1 track; Type Switch Card in both; `tools/template-test.js` composes all 37 prompts at both tracks |
| 9 Phone layout | eeccd28 | Bottom bar of up to five rooms plus More on phones; 44 px targets; 11 px minimum text; Memory Basin hidden until a module has a video; speed bonus only on short recall items; lab-smoke unlocks rooms |
| 5 Checklists | 883fc4b | The Plan Wards (eight planning checks; shape lines tick themselves; guided boxes open when green or after ten minutes) and the Landing Check (ten lines, submit waits for her own ticks, calibration recorded; exam mode asks afterwards); top fault families shown |
| 4 Type-aware Wards | 26580b4 | Extent word for "to what extent"; two paragraphs for two-part prompts; a language-hints row (agreement, articles, uncountables, each/every, informal words) with zero hits on the nine model essays; honest all-green line |
| 6 Path after the chapters | this commit | One timed examination a week (Bangkok week) on an unwritten prompt once only the 7.5 mark is missing or every chapter is done; a full essay earns 150 merits (short 60, mock 250) and a marked essay at the track's target band 200 more |

Pass marks were left as they are (lesson 60%, examiner's gate 75%, Duelling Hall 70%): they read as a ladder, not an inconsistency. Judgement call for T.Chris.

### Changes made

| Change | Why |
| --- | --- |
| Chapter 7 gate now lists "Three mock examinations sent to the examiners" (3 of 3 progress) before the 7.5 mark, and the 7.5 line says it can take months after the classes end | A B1/B2 tutee cannot reach 7.5 in a month; the gate should read as the long-term standard, not a failed month |
| `Story.estimateMinutes`: "About N minutes of work in this chapter" on the Map Room card and the chapter page | Lets the tutees and T.Chris plan the week's homework |

No narrated story text changed, so the narration was not rebuilt. No item, key, action or storage name changed.

### For T.Chris

1. Commit `story/map-bg.webp` (or remove the reference) when the art session finishes.
2. The ch7 7.5 gate stays a real gate: after the month, keep setting one timed essay every two or three weeks by owl post and mark it in the Staff Room; the seal arrives when a mark reaches 7.5.

---

## Earlier review — 11 October 2026 (Claude Opus 5.5)

Follows the student-eye evaluation by Claude Sonnet 5.5 (10 October 2026) and T.Chris's five decisions. Item ids, localStorage keys, Sheet columns and Apps Script action names are unchanged, so progress, review queues and reports are safe. New actions were added (`logout`, `unlock`); none was renamed.

### Headline

| Area | Before | After |
| --- | --- | --- |
| Teacher data (roster, detail, all reports, marking, assignments, projector) | Open to anyone holding the /exec address | Needs a 6-hour teacher token from `teacherLogin` |
| Student data | Token optional; any id could be written | Own token required; only own rows |
| Default teacher PIN | `1234` if `TEACHER_PIN` unset | No default: the console refuses until it is set |
| Passwords | One global salt, one SHA-256 round | Per-student salt, 200 rounds (`v2$`); old hashes upgrade at next login |
| Wrong PIN / password | Unlimited tries | PIN: 5 tries then 1 minute; password: 5 tries then 5 minutes; teacher `unlock` |
| Second device | Each login signed the other device out | One token per student; `logout` retires it |
| Spaced review in Bangkok | Due dates one day early; two morning sessions counted as two days | Bangkok calendar dates in any device time zone |
| Thesis checker | 11 / 11 items accepted "There is a lot to say about …" | Needs a stance, and a reason when the stem asks for one |
| Body checker | 4 / 4 accepted generic filler | Filler with four or more vague phrases refused |
| Rewrite checker | 10 / 15 accepted a keyword salad | Salad refused; Core Topic must start with a noun (Chris's method) |
| Frame + slot grammar | 8 / 10 composed essays had a verbless sentence or agreement error | Example and mechanism slots now sit only in noun-phrase / -ing positions |
| Template-share row | Fixed 33% amber / 50% red | Keyed to the chosen Lab share (60/50/40/30): green at or under, amber up to +5 points, red beyond or above 60% |
| Under-length rule | Item said "no fixed deduction"; AI marking prompt said "cap TR at 5" | Both follow the public descriptors: no fixed deduction, judged on evidence |
| CEFR shown to the teacher | 7.5 = C1, 6.5 = "B2+" | ielts.org alignment: 4–5 B1, 5.5–6.5 B2, 7–8 C1, 8.5+ C2 |

### Decisions applied (T.Chris, 11 Oct 2026)

1. **One standard: the Lab shares 60 / 50 / 40 / 30%.** The Writer's pre-flight now compares unchanged frame text with the student's chosen share (from her latest Lab blueprint; guided mode = 60% practice; otherwise 40% B2 track / 30% C1 track).
2. **Deductions follow the most likely examiner method.** Sources: ielts.org Academic Writing format page ("If your answer is too short, there may not be enough evidence of the language features needed in order to award higher bands"; penalties for off-topic, notes/bullets and plagiarism) and the May 2023 public descriptors (Band 3 LR "significantly underlength", Band 3 GRA "Length may be insufficient…", 20 words or fewer = Band 1, copied rubric discounted, Band 0 only with proof of total memorisation). The older unofficial "under 250 → TR 5" rule is reported by practitioners as withdrawn and was never published. Applied to `Writer.markingPrompt` and `Lab.gs` rating; criteria are now rated in whole bands, as examiners do.
3. **Universal Spine by default; typed blueprints for advanced writers only.** Lab Step 1 offers the Universal Spine first, with a Type Switch Card (`LAB.TYPE_SWITCH`); typed blueprints unlock at the C1 or C2 target level.
4. **AI-simulated essays kept and labelled.** "AI-simulated" on the Examples tab and in its note; "AI-written" on Model essays.
5. **Band ladder mapped to CEFR** on the Plan tab (`partners.js`, `C.LADDER`), with the descriptor gate and the language to build at each step.

### Partner apps

`partners.js` lists the seven apps (11-Variable Matrix, Postcards & Plans, Voice Control, Conditional Sentences Arena, Fine Tuning, Departure Board, Nominalization Arena) with the REMEDIATION tags each serves. The Plan tab shows them; the Fault list links each fault family to its partner. Four tags were added for faults the partners cover: `gra-tense`, `gra-passive`, `gra-relative`, `lr-paraphrase`.

### Item fixes

| Item | Problem | Fix |
| --- | --- | --- |
| m00s2q1 | Hint and explanation implied the weakest mark rules ("cannot hide") | Equal weight, averaged; hint asks about weighting |
| m02s3q2 | "Nineteen words"; the sentence has 17 | "Seventeen" |
| m03s1q4 | Good answer kept "to cut pollution" (view A only), contradicting m03ckq8 | Good answer "The regulation of private cars in city centres."; nominal forms added |
| m07ckq1 | "This trend" fitted as well as "Such a ban" | Stem now names one school's decision |
| m10ckq1, m10s1q1 | B1 labels on "recidivism", "deterrent" | Relabelled C1 |
| m10ckq2 | Hint ("a minister, a historian or a doctor") pointed away from the keyed bin for "brain drain" | Neutral hint |
| m11s1q1, m11s3q1 | "A noun followed by 'of' nearly always needs 'the'" (false: billions of baht) | Rule restated: the of-phrase makes the noun specific |
| m12s3q1 | Sorted pumps as a solution, then said they "answer nothing" | Explanation corrected |

Kept as Chris's framing (not changed): m08s1q2 (Core Topic must be a noun phrase). Reviewer flags not yet actioned are listed in the evaluation doc for Fable 5.1.

### New and extended checks

- `tools/test-free.js`: filler answers must fail on every free-text item; sound alternates must pass; a gerund Core Topic must fail (108 checks).
- `tools/gs-test.js`: teacher token, student token, field whitelist, lockouts, unlock, logout, salted and legacy passwords, join code, projector limits.
- `tools/date-test.js`: Bangkok dates in three device time zones.
- `tools/lab-walkthrough.py` chooses the level before the type. Known: B1-PROBLEM 60% and 50% now replay differently, because those example lines were written for a Problem blueprint that B1 students can no longer build. The examples need rebuilding on the Universal Spine.

All suites pass: validate, test-free, audit, lab-validate, lab-examples-check, gs-test, date-test, smoke.py and lab-smoke.py (0 console errors, no overflow at 375 px), run on a copy with the API address blanked.

### What T.Chris must do

1. Paste the new `Code.gs` and `Lab.gs` into the Apps Script project, then Deploy → Manage deployments → pencil → New version → Deploy. Do this after the GitHub Pages update is live (the new pages work with the old back end; the old pages would not send the teacher token).
2. Keep `TEACHER_PIN` set in Script properties (the console no longer falls back to 1234).
3. Optional: set `JOIN_CODE` to require a class code when students create accounts.
4. Students stay signed in: their existing tokens still work, and old passwords upgrade at their next login.

---

## Earlier review — September 2026

See the commit history for the September 2026 question review (per-item hints, Bootcamp answer placement).
