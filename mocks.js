/* ===========================================================================
   POSITION CONTROL — mocks.js
   Three timed mocks in exam mode: one plain text box, 40 minutes, no frames,
   no matrix strip. Each is one UNSEEN Task 2 prompt from prompts-mock.js
   (CONTENT.MOCK_PROMPTS): it is never in the practice bank, the Duelling
   Hall, the Spellbook Workshop, a model or a lesson item, so a mock band
   measures readiness, not familiarity (WP12, 19 Oct 2026). Before that the
   mocks used p-tourism, p-teen-jobs and p-teen-sleep, which stay in the bank
   as ordinary practice prompts. Add more by pushing rows (and a prompt to
   prompts-mock.js); tools/validate.js checks the isolation.
   =========================================================================== */
(function () {
  var M = window.CONTENT.MOCKS;
  M.push({ id: 'mock1', n: 1, name: 'Mock 1 · Discuss both views', promptId: 'p-mock-degree-choice', minutes: 40, level: 'B2',
    blurb: 'Two views, your verdict in the introduction and the conclusion. Four paragraphs, blank page.' });
  M.push({ id: 'mock2', n: 2, name: 'Mock 2 · Agree or disagree', promptId: 'p-mock-star-pay', minutes: 40, level: 'B2',
    blurb: 'One position, two developed reasons or one reason and a conceded counter-argument. No fence-sitting.' });
  M.push({ id: 'mock3', n: 3, name: 'Mock 3 · Problem and solution', promptId: 'p-mock-food-waste', minutes: 40, level: 'B2',
    blurb: 'Name the cause with its mechanism, then a solution that answers that cause. Draw the arrow before you write.' });
})();
