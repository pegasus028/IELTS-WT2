/* ===========================================================================
   POSITION CONTROL — mocks.js
   Three timed mocks in exam mode: one plain text box, 40 minutes, no frames,
   no matrix strip. Each is one Task 2 prompt from the bank. Add more by
   pushing rows.
   =========================================================================== */
(function () {
  var M = window.CONTENT.MOCKS;
  M.push({ id: 'mock1', n: 1, name: 'Mock 1 · Discuss both views', promptId: 'p-tourism', minutes: 40, level: 'B2',
    blurb: 'Two views, your verdict in the introduction and the conclusion. Four paragraphs, blank page.' });
  M.push({ id: 'mock2', n: 2, name: 'Mock 2 · Agree or disagree', promptId: 'p-teen-jobs', minutes: 40, level: 'B2',
    blurb: 'One position, two developed reasons or one reason and a conceded counter-argument. No fence-sitting.' });
  M.push({ id: 'mock3', n: 3, name: 'Mock 3 · Problem and solution', promptId: 'p-teen-sleep', minutes: 40, level: 'B2',
    blurb: 'Name the cause with its mechanism, then a solution that answers that cause. Draw the arrow before you write.' });
})();
