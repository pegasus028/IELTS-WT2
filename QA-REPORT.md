# Position Control — QA report

## Review and fixes — 11 October 2026 (Claude Opus 5.5)

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
