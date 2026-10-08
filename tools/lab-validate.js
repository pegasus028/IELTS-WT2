/* Checks lab-content.js: every example carries its component's slots exactly
   once and no others, budgets add up, ids are unique.   node tools/lab-validate.js */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'lab-content.js'), 'utf8'), ctx);
const L = ctx.window.LabContent;
let errors = 0; function bad(m) { console.log('  ✕ ' + m); errors++; }
const KEYS = Object.keys(L.SLOT_LABEL), ids = {};
L.COMPONENTS.forEach(function (c) {
  if (ids[c.id]) bad('duplicate component id ' + c.id); ids[c.id] = 1;
  if (!L.PARAS.some(function (p) { return p.key === c.para; })) bad(c.id + ': unknown paragraph ' + c.para);
  c.slots.forEach(function (k) { if (KEYS.indexOf(k) < 0) bad(c.id + ': unknown slot ' + k); });
  ['B2', 'C1'].forEach(function (t) {
    if (!c.examples[t] || c.examples[t].length < 3) bad(c.id + ': needs 3 ' + t + ' examples');
    (c.examples[t] || []).forEach(function (e) {
      const toks = (e.match(/\{(\w+)\}/g) || []).map(function (x) { return x.slice(1, -1); });
      c.slots.forEach(function (k) { const n = toks.filter(function (x) { return x === k; }).length; if (n !== 1) bad(c.id + ' ' + t + ': {' + k + '} appears ' + n + '× in "' + e + '"'); });
      toks.forEach(function (k) { if (c.slots.indexOf(k) < 0) bad(c.id + ' ' + t + ': stray {' + k + '} in "' + e + '"'); });
      if (!/[.:;]$/.test(e.trim())) bad(c.id + ' ' + t + ': example should end with punctuation: "' + e + '"');
    });
  });
});
/* every variable is carried by at least one component */
KEYS.forEach(function (k) { if (!L.COMPONENTS.some(function (c) { return c.slots.indexOf(k) >= 0; })) bad('no component carries ' + k); if (!L.VAR_GUIDE[k]) bad('no VAR_GUIDE for ' + k); });
const bid = {}; L.BADGES.forEach(function (b) { if (bid[b.id]) bad('duplicate badge ' + b.id); bid[b.id] = 1; if (typeof b.test !== 'function') bad(b.id + ': no test'); });
const W = L.COMPONENTS.reduce(function (s, c) { return s + c.weight; }, 0);
L.PCTS.forEach(function (o) {
  const F = Math.round(L.ESSAY_WORDS * o.pct / 100), per = L.COMPONENTS.map(function (c) { return Math.max(2, Math.round(F * c.weight / W)); });
  const sum = per.reduce(function (a, b) { return a + b; }, 0);
  console.log('  ' + o.pct + '%: frame ≈ ' + F + ' words, component targets sum to ' + sum + ' (' + per.join(' ') + ')');
  if (Math.abs(sum - F) > 8) bad(o.pct + '%: component targets drift from the frame budget');
});
Object.keys(L.MISSPELL).forEach(function (k) { if (k === L.MISSPELL[k]) bad('misspelling maps to itself: ' + k); });
/* lab-scenario.js: the Blueprint Studio test drive (five prompts × Band 6/7/8) */
vm.runInContext(fs.readFileSync(path.join(ROOT, 'lab-scenario.js'), 'utf8'), ctx);
const S = ctx.window.LabScenario;
if (!S) bad('lab-scenario.js did not load');
else {
  const TYPES = ['OPINION', 'DISCUSS', 'ADVANTAGE', 'PROBLEM', 'TWOPART'];
  TYPES.forEach(function (t) {
    if (S.order.indexOf(t) < 0) bad('scenario order is missing ' + t);
    const p = S.prompts[t]; if (!p) { bad('scenario has no ' + t + ' prompt'); return; }
    if (!p.text || !p.title) bad(t + ': prompt needs text and title');
    S.bands.forEach(function (b) {
      const set = p.sets[b.band]; if (!set) { bad(t + ' Band ' + b.band + ': no variables'); return; }
      KEYS.forEach(function (k) {
        const v = set[k];
        if (!v) return bad(t + ' ' + b.band + ': no ' + k);
        if (/^mech/.test(k) && !(v.ing && v.clause && /^[a-z]+ing\b/.test(v.ing))) bad(t + ' ' + b.band + ' ' + k + ': needs { ing, clause } and ing must start with an -ing verb');
        if (/^ex/.test(k) && !(v.np && v.clause)) bad(t + ' ' + b.band + ' ' + k + ': needs { np, clause }');
        [].concat(typeof v === 'object' ? [v.ing, v.clause, v.np] : [v]).filter(Boolean).forEach(function (x) {
          if (/[.;]$/.test(x.trim())) bad(t + ' ' + b.band + ' ' + k + ': drop the final punctuation (the frame supplies it)');
          if (/\b(research shows|nowadays|double-edged)\b/i.test(x)) bad(t + ' ' + b.band + ' ' + k + ': cliché in "' + x + '"');
        });
      });
      ['core2', 'facetA2', 'facetB2', 'position2'].forEach(function (k) { if (!set[k]) bad(t + ' ' + b.band + ': no reworded ' + k); });
    });
  });
  Object.keys(S.bandFor).forEach(function (lv) { if (!L.LEVELS.some(function (l) { return l.id === lv; })) bad('scenario bandFor: unknown level ' + lv); });
  L.LEVELS.forEach(function (l) { if (!S.bandFor[l.id]) bad('scenario bandFor: no band for level ' + l.id); });
  console.log('  test drive: ' + TYPES.length + ' prompts × ' + S.bands.length + ' bands checked');
}
console.log(errors ? errors + ' problem(s)' : 'OK — Template Lab content is consistent');
process.exit(errors ? 1 : 0);
