/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — partners.js
   T.Chris's grammar and vocabulary apps that Quillmoor points to, shown to
   students as "Elective classes". The app names are the real names of the
   sites they open, so they are not re-themed.
   Edit this file to change a link or what an app is used for; no code change
   is needed. `tags` are REMEDIATION tags: when a student's Fault list holds
   one of them, the app offers the partner next to it. `step` places the app
   on the band ladder (Plan tab).
   =========================================================================== */
(function (global) {
  'use strict';
  var C = global.CONTENT = global.CONTENT || {};

  C.PARTNERS = [
    { id: 'matrix', name: 'The 11-Variable Matrix', topic: 'Template variables', format: 'Game',
      url: 'https://pegasus028.github.io/IELTS-T2-W-P2/',
      use: 'Fill the eleven variables for real prompts against the clock, solo or as a class.',
      tags: ['kn-question-type', 'lr-nominal', 'tr-no-position', 'tr-listing', 'tr-partial', 'tr-no-nuance', 'tr-no-example'], step: '6-7' },
    { id: 'tenses', name: 'Postcards & Plans', topic: 'Tenses', format: 'Self-study',
      url: 'https://pegasus028.github.io/TensesPortal/',
      use: 'Present perfect for change, past simple for examples, one tense system across an essay.',
      tags: ['gra-tense', 'gra-agreement'], step: '5-6' },
    { id: 'passive', name: 'Voice Control', topic: 'Passive voice', format: 'Self-study',
      url: 'https://pegasus028.github.io/Passive-Voice/',
      use: '"It is argued that …", "… should be required": impersonal, formal sentences.',
      tags: ['gra-passive', 'gra-complex', 'lr-register'], step: '6-7' },
    { id: 'conditionals', name: 'Conditional Sentences Arena', topic: 'Conditionals', format: 'Pair game',
      url: 'https://pegasus028.github.io/Conditionals-arena3/',
      use: 'If-clauses for solutions and predictions: "If cities taxed congestion, traffic would fall."',
      tags: ['gra-conditional', 'tr-solution-mismatch'], step: '6-7' },
    { id: 'modals', name: 'Fine Tuning', topic: 'Modal verbs', format: 'Self-study',
      url: 'https://pegasus028.github.io/Modals/',
      use: 'Hedged claims ("may", "tend to") instead of over-general ones; "should" and "must" in solutions.',
      tags: ['tr-generalised', 'gra-concession'], step: '6-7' },
    { id: 'comparatives', name: 'Departure Board', topic: 'Comparatives and superlatives', format: 'Self-study',
      url: 'https://pegasus028.github.io/Comp-Superlatives/',
      use: 'Weighing language: "far more likely", "the more … the more", "outweigh".',
      tags: ['tr-listing', 'lr-precision'], step: '6-7' },
    { id: 'nominal', name: 'Nominalization Arena', topic: 'Nominalisation', format: 'Game',
      url: 'https://pegasus028.github.io/Nominalization/',
      use: 'Combine two simple sentences into one through a noun phrase: the Core Topic skill and Band 8 density.',
      tags: ['gra-nominalisation', 'lr-nominal', 'lr-paraphrase'], step: '7-8' }
  ];

  /* The band ladder (Plan tab). Bands and CEFR as ielts.org aligns them:
     4–5 ≈ B1, 5.5–6.5 ≈ B2, 7–8 ≈ C1, 8.5+ ≈ C2. A half band is an average
     of four whole-band criteria (7.5 = for example TR 8, CC 7, LR 8, GRA 7). */
  C.LADDER = [
    { band: '5', cefr: 'B1', gate: 'A position is there and the main parts are attempted, but ideas are thin and errors are frequent.', lang: 'Sentence boundaries, articles, plurals, subject-verb agreement.', apps: ['tenses'] },
    { band: '5.5–6', cefr: 'B2', gate: 'Every part is addressed and the position is clear; a mix of simple and complex sentences with errors that rarely block meaning.', lang: 'Tense choice, articles with singular nouns, because / although / while clauses.', apps: ['tenses', 'modals'] },
    { band: '6.5', cefr: 'B2', gate: 'Ideas are extended, paragraphs are logical, some less common words, error-free sentences start to appear.', lang: 'Passive and reporting verbs, second conditionals, hedging with may / tend to.', apps: ['passive', 'conditionals', 'modals'] },
    { band: '7', cefr: 'C1', gate: '"A clear and developed position"; "clear progression throughout"; "awareness of style and collocation"; "error-free sentences are frequent".', lang: 'Relative and participle clauses, comparison and weighing language, topic collocations.', apps: ['matrix', 'comparatives', 'passive'] },
    { band: '7.5', cefr: 'C1', gate: 'An average: two criteria at Band 8 and two at Band 7. Every main idea has a mechanism and a concrete example, so nothing is over-generalised.', lang: 'Nominalisation, precise verbs, one controlled structural swap per body paragraph.', apps: ['nominal', 'matrix'] },
    { band: '8', cefr: 'C1', gate: 'Ideas "well extended and supported"; "followed with ease"; "a wide resource … to convey precise meanings"; "the majority of sentences are error-free".', lang: 'Precision over rarity; three or four structures controlled to about 90% before adding a fifth.', apps: ['nominal'] },
    { band: '8.5–9', cefr: 'C2', gate: 'Fully developed and natural; cohesion the reader does not notice; rare, slip-like errors.', lang: 'Wide, natural, precise English built over years of reading and writing.', apps: [] }
  ];

  C.partnerFor = function (tag) {
    return (C.PARTNERS || []).filter(function (p) { return p.tags.indexOf(tag) >= 0; });
  };
  C.partner = function (id) { return (C.PARTNERS || []).filter(function (p) { return p.id === id; })[0] || null; };
})(typeof window !== 'undefined' ? window : this);
