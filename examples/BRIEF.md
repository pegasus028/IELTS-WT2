# Brief: worked-example blueprints for the Template Lab

You are writing worked examples for **Position Control** (repo at `/home/claude/ielts-wt2`), an IELTS Academic Writing Task 2 self-study app for Thai girls at Satriwithaya School, Bangkok. Its **Template Lab** lets a student build her own template ("blueprint") of **14 lines** with slots, at a chosen **template share** (60, 50, 40 or 30% of a ~280-word essay), then fill the **11 variables** for a real prompt (the "Assembly Line"). The teacher, T.Chris, will show these examples to his students, so they must be excellent teaching models: correct English, natural, honest, never padded.

Read first, in this order:
1. `examples/B1-DISCUSS.json` — a finished set that passes every check. Copy its JSON shape exactly.
2. `lab-content.js` — `LAB.COMPONENTS` (the 14 lines: id, job, slots, tips) and `LAB.TYPE_COMPONENTS[<your type>]` (how each line's job changes for your question type). Also `LAB.VAR_GUIDE` (how to fill each variable).
3. The prompt you are given, in `prompts.js` / `prompts-2.js` (search for its id).

## Your output

ONE file: `examples/<LEVEL>-<TYPE>.json` with four blueprints (`"60"`, `"50"`, `"40"`, `"30"`), four runs (one per blueprint, all on the same prompt), and a `"coaching"` array (below). Do not edit any other file.

## The student

- **B1 student ("Nam")**: a 14-year-old Thai girl, CEFR B1, target IELTS Band 5.5–6. Short, clear, correct sentences; everyday academic words; ideas a 14-year-old really has. No showy vocabulary she would not know. Her lines must still be correct English.
- **B2 student ("Fah")**: a 14-year-old Thai girl, CEFR B2, target Band 6.5–7. Plain but precise frames, some less common collocations, nominalised Core Topics, a clear, qualified position. Still not C1 showing-off.

Both write their template **in their own words** (the app flags lines too close to its own examples, and the checker below enforces that). Lines must be reusable for any prompt of the type (no topic words in the template lines). No clichés ("Nowadays", "hot topic", "double-edged sword", "In this essay I will", "Firstly", "pros and cons"), no contractions, no "you", no informal words ("a lot of", "kids", "stuff", "OK"), no invented statistics, no "research shows".

## The type matters (this is the point of the exercise)

Each set is ONE question type. Every line must do that type's job (read `LAB.TYPE_COMPONENTS[TYPE]` and the notes here), not a generic "discuss both views" job:
- **OPINION** (agree/disagree): pick a stance (agree, disagree, or partly agree naming what is accepted and what is rejected). Facet A = reason 1; Facet B = reason 2 OR the counter-argument; Nuance A = a concession that does not change the view; Nuance B = a concession or, if B is the counter-argument, the rebuttal. Position states how far she agrees, in the introduction and again (reworded) in the conclusion.
- **ADVANTAGE**: Facet A = main advantage, Facet B = main disadvantage, Position = which side is heavier. A verdict is required even when the prompt only says "describe"; the pre-flight looks for words such as "outweigh", "on balance", "more significant than".
- **PROBLEM** (causes + solutions): Facet A = the main cause; Mechanism A = how the cause creates the problem; Nuance A = a SECOND cause (the prompt says "causes"); Facet B = the solution that answers cause A; Mechanism B = how it answers that cause; Example B = where it has worked or could work; Nuance B = its limit plus a SECOND measure (the prompt says "measures"/"what could X do"). If the prompt names actors (schools, parents, governments), the Position says who does what.
- **TWOPART**: Facet A answers question 1, Facet B answers question 2 (same order); Position = her overall view.

## The four shares

Build the **60% blueprint first** (the fullest), then make the 50, 40 and 30% blueprints by trimming and rewording HER OWN lines (same voice, same moves, fewer words). The variables for the same prompt grow as the share falls: at 60% the slots are short (the frame carries six words in ten); at 30% her own ideas carry seven words in ten, so mechanisms and examples become fuller, more specific sentences. Keep the same core ideas across the four runs so a student can compare them.

Budgets the checker enforces, in **template words** per line (slot labels do not count):

| line | 60% | 50% | 40% | 30% |
|---|---|---|---|---|
| i-open | 12–23 | 10–19 | 8–15 | 6–13 |
| i-sides | 11–22 | 9–18 | 8–15 | 6–11 |
| i-position | 6–11 | 5–10 | 4–8 | 3–6 |
| a-topic | 9–18 | 8–15 | 6–13 | 5–10 |
| a-mech | 6–11 | 5–10 | 4–8 | 3–6 |
| a-example | 8–15 | 6–13 | 5–10 | 4–8 |
| a-nuance | 11–22 | 9–18 | 8–15 | 6–11 |
| b-topic | 9–18 | 8–15 | 6–13 | 5–10 |
| b-mech | 6–11 | 5–10 | 4–8 | 3–6 |
| b-example | 8–15 | 6–13 | 5–10 | 4–8 |
| b-nuance | 11–22 | 9–18 | 8–15 | 6–11 |
| c-open | 11–22 | 9–18 | 8–15 | 6–11 |
| c-position | 6–13 | 6–11 | 4–9 | 4–8 |
| c-rationale | 6–11 | 5–10 | 4–8 | 3–6 |

Aim for the middle-to-top of each range: total frame words ≈ 165 (60%), 138 (50%), 113 (40%), 82 (30%). Then the assembled essay must be **255–300 words (aim 270–290)** and its measured template share within **±5 points** of the target. The variable texts decide this: if the share is too high, the variables are too short; if the essay is too long, trim the variables.

## Slots and grammar (the most common failure)

Write slots as `[Core Topic]`, `[Facet A]`, `[Mechanism A]`, `[Example A]`, `[Nuance A]`, `[Facet B]`, `[Mechanism B]`, `[Example B]`, `[Nuance B]`, `[Position]`, `[Rationale]`. Each line carries exactly its own slot(s) once (see `slots` in `LAB.COMPONENTS`). End every line with a full stop.

The words before a slot decide what must go in it, and the variable text must fit: after "by"/"through"/"from" → an -ing phrase ("keeping…"); after "that"/"because"/"since"/":" → a full clause with a subject and verb; after "is"/"in"/"of"/"such as" → a noun phrase. A slot that opens a sentence must work as its subject. Read each assembled sentence aloud (run with `--essays`) and fix anything ungrammatical. Variable texts have no final punctuation and start lower-case unless they start with a proper noun.

Variables that appear twice (Core Topic, Facet A, Facet B, Position) need a reworded second mention in `text2` (a synonym, a shorter noun phrase, or a shell noun) — not the same words.

Examples must be specific and checkable or clearly hypothetical: Bangkok, Thai schools, a named policy or practice, the student's own experience. Never invent numbers. Do not copy five or more words in a row from the prompt. Use the prompt's key nouns somewhere in the essay (the pre-flight checks them).

## The coaching record

Add `"coaching"`: three items showing her real process, each `{ "share": "60", "line": "<line id>", "first": "<her first draft of that line>", "flagged": "<what the quick check said>", "fixed": "<the final line, identical to the blueprint>" }`. Get "flagged" by actually running the first draft: `node tools/lab-examples-check.js --line <TYPE> <SHARE> <line-id> "<draft>"`. Choose believable first drafts for a 14-year-old at that level (e.g. starting with "Firstly,", copying an app example, over budget, a missing slot, a contraction, a wrong slot grammar). At least one must be at 30%.

## Done means

`node tools/lab-examples-check.js examples/<LEVEL>-<TYPE>.json` prints `OK — 0 red` (aim for 0 amber too), and you have read all four essays with `--essays` and they are grammatical, natural, on the prompt, with the position in the introduction and the conclusion. Reply with: the four summary lines the checker prints, and any amber you could not remove with the reason. Keep the reply short.
