# Quillmoor Academy — build contract (read fully before writing anything)

Position Control (this repo, IELTS Academic Writing Task 2 self-study app) is being fully re-themed as
**Quillmoor Academy**, an original wizarding school *inspired by* Harry Potter. Audience: T.Chris's **5 private
IELTS tutees** (Thai girls aged 13–17, CEFR B1/B2, target Band 7.5). Cohort name in the app: `Tutoring`.
The 5 tutees: **Aeh, Mikii, Donut, JingJing, Pear** (roster ids `tut-aeh`, `tut-mikii`, `tut-donut`, `tut-jingjing`, `tut-pear`).
First tester: Aeh, Monday 12 Oct 2026. M4.1 no longer uses this app (they moved to Task 1): remove the M4.1 fast-access group.

Full design doc (human-facing): "Quillmoor Academy — Build Spec" (Claude Docs project 5de01623-d9c0-40f5-8215-c99f9da26bd5).
This file is the binding contract between the parallel builders.

## Hard rules (all builders)
1. **IP:** no Harry Potter names anywhere in the app: no Hogwarts, Gryffindor/Hufflepuff/Ravenclaw/Slytherin, Quidditch,
   Muggle, Horcrux, Patronus, Platform 9¾, Diagon Alley, Hogsmeade, Dumbledore, Snape, etc.; no canon spell words
   (Expelliarmus, Lumos, Accio, Wingardium…); no Sorting *Hat*; no floating candles; no red steam train.
2. **What the app teaches does not change**: the 406 module items, 37 prompts, 9 models, 11-Variable Matrix,
   Template Lab, LevelUp hand-off. Only labels, colours, messages and the new story layer change.
3. **Do not change** `pc.*` localStorage keys, API action names/payloads, sheet columns, item/sub/level ids.
4. UK spelling. Story text at B1: average ≤15 words per sentence, present tense, second person ("you").
   Spoken lines use spoken connectors (so, but, because, anyway, after all). Formal connectors (moreover,
   consequently, nevertheless…) only inside written things in the story (letters, newspaper articles, exam papers),
   and every connector must fit the logical relation (cause/result/contrast/concession/addition/example/restatement).
5. Mixed cast is fine (girls, boys, women, men). The heroine is the student herself ("you"), a Thai girl of about 15.
6. Do not `git commit` or `git push`. The orchestrator commits. Edit only the files you own (ownership table below).

## World (fixed names)
- **Quillmoor Academy**: castle-school on a windy moor above a black lake; teaches *argument-craft*. Motto *Verba vincunt* ("words win").
  Year ends with the **Grand Examination**: one essay, 40 minutes, four examiners; a pass at Band 7.5 standard earns the **Quillmoor seal**.
- **Houses** (sorted by strength = highest criterion on the Sorting):

| id | name | criterion | values | main | accent | emblem | head & examiner |
|---|---|---|---|---|---|---|---|
| compass | Compass | TR (Task Response) | direction, a clear position | #1F3A5F | #C0C7D1 | compass rose | Professor Rhea North |
| bridge | Bridge | CC (Coherence & Cohesion) | order, links that carry meaning | #1F6F6B | #B8733A | stone arch | Professor Tomás Brigg |
| lexicon | Lexicon | LR (Lexical Resource) | precision, the right word | #5B2A5E | #C9A227 | open book with a key | Professor Wen Liang |
| loom | Loom | GRA (Grammar) | control, sentences without flaws | #8E1B2C | #F1E6CC | weaver's shuttle | Professor Ada Weaver |

- **Cast**: Professor Marisol Penhallow (Head of Examinations; strict, fair, dry humour; speaks the band descriptors in plain words);
  Juno Marlowe (best friend, Bridge, sees two sides = nuance); Felix Okafor (photographer on the school paper; asks "where's the example?");
  Celeste Ashby (rival; recites memorised essays; fails until she builds her own spellbook in ch6);
  **the Gossip Quill** (charmed quill that writes *The Whisper*, an anonymous gossip sheet: clichés, vague claims, missing examples,
  linker soup — "Firstly… Moreover… In today's modern world…"; it feeds on copied, careless sentences and fades as students write their own words);
  Priya Desai (7th-year editor of *The Quillmoor Lantern*, the school paper); Mr Alder Fenwick (librarian, Locked Stacks); Dr Osric Hale (headmaster).
- **Places**: Hall of Lanterns (floating paper lanterns; sorting), Debating Chamber, Map Room (home screen), Brewing Cellars,
  Long Library + Locked Stacks, the Lantern office (tower with printing presses), Mending Room, Examination Hall. Travel: an old wooden tram with brass lamps up the moor road.
- **The Sorting Lantern**: tall brass lantern on a stand; glows in four colour bands; it asks 12 questions and glows in her house's colours.

## Re-theme map (view ids are the existing `data-view` values)
| view id | old label | new label |
|---|---|---|
| plan | Flight plan | Map Room |
| map | Modules | Classes |
| bootcamp | Bootcamp | Duelling Hall |
| writer | Writer | Scriptorium |
| template | Template | My Spellbook |
| lab | Template Lab | Spellbook Workshop |
| models | Models | Exemplar Archive |
| vids | Videos | Memory Basin |
| pods | Podcasts | Castle Wireless |
| faults | Fault list | Mending Room |
| record | Record | Report Card |
| settings | Settings | Your Trunk |
| live | Live mission | Assembly |
Other terms: Systems check → examiner's gate; XP → Merits; streak → Candles; badges → Keepsakes; assignments → Owl post;
pre-flight check → the Ten Wards; Blueprint Studio / Assembly Line / Scorecard → Design / Cast it on a prompt / Spellbook record;
"Mark in LevelUp" → "Send to the examiners"; Flight Deck (teacher) → Staff Room; partner apps → Elective classes;
gate readiness TR/CC/LR/GRA → the four examiners' verdicts (North, Brigg, Liang, Weaver).
Ranks (8, same thresholds): Newcomer, First-year, Second-year, Third-year, Fourth-year, Fifth-year, Prefect, Graduate.
Bootcamp ranks Recruit→Ace → Novice→Champion (same count, same thresholds).
Module names (Decode the Prompt, Cohesion…) stay unchanged.

## The seven chapters
| ch | title | place | missions (existing ids) | gate | opens views | keepsake |
|---|---|---|---|---|---|---|
| 1 | The Letter | Hall of Lanterns | Sorting; m00 subs; m01 subs | checks m00l1 + m01l1 | plan, map, pods, vids, record, settings | seal (the letter's wax seal) |
| 2 | The First Duel | Debating Chamber | m02 subs (incl. Thesis Sniper); event: campaign | check m02l1 | writer | ribbon (duelling ribbon) |
| 3 | The Living Map | Map Room | m03, m04 subs; Duelling Hall steps 1–4 | checks m03l1 + m04l1 | bootcamp | mapfrag (map fragment) |
| 4 | The Spellbook | Spellbook Workshop | m05, m06 subs; Workshop design; full Duelling Hall; the Ten Wards | checks m05l1 + m06l1 + a saved spellbook design + one essay sent to the examiners | template, lab | clasp (spellbook clasp) |
| 5 | The Potions Lab | Brewing Cellars | m07, m08, m09 subs; electives | checks m07l1 + m08l1 + m09l1 | faults | vial (brewing vial) |
| — | Midwinter Tournament (optional event after ch5) | Examination Hall | timed Duelling Hall run; one prompt cast at 2 min/variable; a 40-min essay | — | — | token |
| 6 | The Library and the Newsroom | Long Library | m10, m11 subs | checks m10l1 + m11l1 + fewer than 5 faults due | — | press (press badge) |
| 7 | The Grand Examination | Examination Hall | m12, m13 subs; Exemplar Archive; 3 mocks | checks m12l1 + m13l1 + a LevelUp-marked essay ≥ 7.5 (p.bestBand) | models | seal7 (the Quillmoor seal) |
Owl post (assignments) and Assembly are always available. The Mending Room is also shown whenever ≥5 faults are due.
Verify the level/check ids against topic-XX.js (level id is `mXXl1`, its check id is `levels[0].check.id`).

## Data contracts

### `story-content.js` (owner: Fable A)
```js
window.STORY = {
  version: '2026-10-11',
  houses: [ { id:'compass', name:'Compass', crit:'TR', critName:'Task Response', values:'…', main:'#1F3A5F', accent:'#C0C7D1',
              emblem:'compass rose', head:'Professor Rhea North', motto:'…', welcome:'2–3 B1 sentences said by the head on sorting',
              challengeLine:'one sentence used when this house is her WEAKEST criterion' }, … ],
  chapters: [ {
    id:'ch1', n:1, title:'The Letter', place:'Hall of Lanterns', blurb:'one-line teaser for the Map',
    keepsake:{ id:'seal', name:'The letter\'s wax seal', desc:'one sentence' },
    opens:['plan','map','pods','vids','record','settings'],
    pages:[ { img:'story/ch1-01.webp', alt:'…', text:'B1 paragraph(s), 40–90 words, keywords as [[word|English gloss|คำแปลไทย]]' ,
              choice:{ q:'…', options:[{label:'…', flag:'…'},{label:'…', flag:'…'}] } /*optional*/,
              event:'sorting' /*optional: sorting|campaign|tournament*/ } ],
    missions:[ { kind:'sub', id:'m00s1' }, { kind:'check', id:'m00l1' },
               { kind:'view', view:'bootcamp', label:'Duelling Hall: steps 1–4', note:'…' },
               { kind:'writing', label:'…', note:'what to write in the Scriptorium' } ],
    gate:{ checks:['m00l1','m01l1'], extra:[], intro:'Penhallow line before the gate', pass:'line after passing' },
    ending:{ img:'story/ch1-06.webp', alt:'…', text:'B1 paragraph; ends with a hook to the next chapter' },
    newsroom:'one sentence: the paper/Quill beat in this chapter'
  }, … ],
  events:{ campaign:{ title, pages:[…] }, tournament:{ title, pages:[…], tasks:[{id,label,view,note}] } },
  mapIntro:'2 sentences for the Map Room header', finale:{ text:'…' }
};
```
- 5–6 pages per chapter + ending. Every chapter: 6–10 keywords total (Task 2 vocabulary useful for that chapter's skill, B1–B2), each with a
  short English gloss and a Thai gloss. Chapter 1's page with `event:'sorting'` must come before the missions start (page 5).
- Image paths: `story/chN-01.webp` … `story/chN-0K.webp` and `story/chN-end.webp`; images may not exist yet — the engine shows a placeholder.
- Story must teach *with* the app's method, never against it: positions are clear, the 11 variables (Core Topic, Facet A/B,
  Mechanism, Example, Nuance, Position…) are named as the map's keys in ch3, templates are personal (Celeste's copied spellbook fails),
  cohesion = reference and substitution before linkers (the Quill's linker soup is the villain's trick).

### `sorting.js` (owner: Fable B)
```js
window.SORTING = {
  intro:'Lantern/Penhallow lines, B1', tieLine:'…',
  items:[ { id:'s01', crit:'TR'|'CC'|'LR'|'GRA', cefr:'B1'|'B2', stem:'…', options:['…','…','…','…'], answer:0..3, why:'≤35 words' } ] // 12 items, 3 per crit
};
```
T.Chris's six-point check: natural stem; one unambiguous answer; (no hints here); key is the longest option only ~25%;
each answer position ~25% (3 each across 12); one near-miss distractor per item. Items are diagnostic of each criterion
(TR: does a thesis answer the prompt/position; CC: reference/substitution, paragraph logic; LR: collocation/precision/register;
GRA: accuracy of complex structures). Mixed B1/B2. Wizard-flavoured contexts are fine but the English must be real IELTS-relevant English.

### Story state in progress (owner: Fable C; read by Opus D in the Staff Room)
`p.story = { house:'compass'|…|null, sort:{TR,CC,LR,GRA,at}, chapter:1..7, unlockedTo:0..7, seen:{ 'ch1':[0,1,2] }, flags:{},
            keepsakes:['seal',…], hp:Number, tournament:{…} }`
- `hp` (house points) is **derived** from progress each time (no accumulation drift):
  5 × lessons (subs) passed + 20 × gates (checks) passed + 2 × faults mended (max 100) + 15 × essays sent to LevelUp
  + 25 × essays marked at/above her target band + 10 × tournament tasks. Function `Story.housePoints(p)` exported on `window.Story`.
- Existing students: chapter = the first chapter whose gate is not yet passed (so returning tutees land where their progress is).
- Teacher unlock: assignment rows with `{ kind:'unlock', studentId?:'…', cohort?:'Tutoring', chapter:N, id, ts }` (stored by the existing
  `assignments` action; no backend change). The student console must NOT list these as owl post; it applies them: `unlockedTo = max(...)`.
- Teacher key in Your Trunk: enter the teacher PIN → `API.teacherLogin(pin)`; if ok, unlock all chapters on this account.

### House Cup API (owner: Opus D)
`API.houses(cohort)` → `Promise<{ ok:true, cohort, totals:{compass:N,bridge:N,lexicon:N,loom:N}, members:{compass:n,…} }>`; backend action `houses`
aggregates `progress.story.house` / `progress.story.hp` over Students rows with that cohort (no names returned). Local/offline fallback computes from the local db.

## File ownership
| owner | files |
|---|---|
| Fable A | `story-content.js` |
| Fable B | `sorting.js`, `docs/READING-ROOM.md` |
| Fable C | `story.js`, `story.css`, `theme.css`, `index.html`, `student.js`, `tools/story-validate.js`, `story/` placeholders |
| Opus D | `content.js`, `writer.js`, `bootcamp.js`, `template.js`, `lab.js`, `lab-content.js`, `lab.css`, `models.js`, `media.js`, `podcasts.html`, `partners.js`, `teacher.html`, `teacher.js`, `api.js`, `Code.gs`, `tools/gs-test.js`, `README.md`, `roster.js` |
Script load order in index.html (Fable C): existing scripts …, then `story-content.js`, `sorting.js`, `story.js` before `student.js`.
