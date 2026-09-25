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
console.log(errors ? errors + ' problem(s)' : 'OK — Template Lab content is consistent');
process.exit(errors ? 1 : 0);
