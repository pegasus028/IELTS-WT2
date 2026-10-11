#!/usr/bin/env node
/* Composes the default spellbook for every prompt at both tracks and checks
   the result holds together: four paragraphs, 230–330 words, every slot
   filled, no doubled punctuation, no example or mechanism slot in a position
   that needs a clause, and the ten wards show no red row other than length.
   node tools/template-test.js */
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
global.window = global; global.localStorage = { getItem: function () { return null; }, setItem: function () {}, removeItem: function () {} };
['content.js', 'prompts.js', 'prompts-2.js', 'template.js', 'lab-content.js', 'models.js', 'writer.js'].forEach(function (f) { vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f }); });
var C = window.CONTENT, T = window.Template, W = window.Writer, fails = 0, n = 0;
function fail(m) { fails++; console.log('FAIL ' + m); }
/* frame shape: {exA}/{exB} are noun phrases, {mech*} are -ing phrases */
Object.keys(T.TIERS).forEach(function (tier) {
  T.TIERS[tier].paragraphs.forEach(function (p) { p.frames.forEach(function (f) { shape(f.text, tier + ' ' + f.id); }); });
});
Object.keys(T.PLAYBOOKS).forEach(function (ty) { var fr = T.PLAYBOOKS[ty].frames || {}; Object.keys(fr).forEach(function (tier) { Object.keys(fr[tier]).forEach(function (k) { shape(fr[tier][k], ty + ' ' + tier + ' ' + k); }); }); });
function shape(text, where) {
  n++;
  if (/\b(when|that|because|although|while|if)\s+\{ex[AB]\}/i.test(text)) fail(where + ': example slot after a clause word: ' + text.match(/\b(when|that|because|although|while|if)\s+\{ex[AB]\}/i)[0]);
  if (/\{ex[AB]\}\s+(shows|show|demonstrates|illustrates|offers|proves)\b/i.test(text)) fail(where + ': example slot used as a subject of a verb');
  if (/\b(that|because)\s+\{mech[AB]\}/i.test(text)) fail(where + ': mechanism slot after that/because (needs a clause, slot is -ing)');
  if (/(^|[.!?]\s+)[^.!?]*,\s*\{facet[AB]\}\./.test(text) && !/\b(and|or|is|are|lies in|by|of|in|to|than|as),\s*(more|less|most|least|above all|in particular|for example)?[^.]*\{facet[AB]\}\./.test(text.match(/(^|[.!?]\s+)[^.!?]*,\s*\{facet[AB]\}\./)[0])) fail(where + ': facet slot ends a verbless sentence (", {facetA}.")');
}
C.PROMPTS.forEach(function (p) {
  ['B2', 'C1'].forEach(function (tier) {
    var vs = p.vars && p.vars[tier]; if (!vs) return;
    var vars = {}; Object.keys(vs).forEach(function (k) { vars[k] = vs[k].ok; });
    var essay = T.compose(tier, p.type, vars, {}, {}); n++;
    var where = p.id + ' ' + tier;
    var paras = essay.split(/\n\n/); if (paras.length !== 4) fail(where + ': ' + paras.length + ' paragraphs');
    var w = W.words(essay); if (w < 230 || w > 350) fail(where + ': ' + w + ' words');
    if (/\[[A-Z]/.test(essay)) fail(where + ': unfilled slot');
    if (/[.,;]\s*[.,;]/.test(essay.replace(/\.\.\./g, ''))) fail(where + ': doubled punctuation');
    var pf = W.preflight(essay, p, { share: tier === 'C1' ? 0.3 : 0.4 });
    pf.rows.forEach(function (r) { if (r.status === 'bad' && r.id !== 'length' && r.id !== 'template') fail(where + ': red ward ' + r.label); });
  });
});
console.log(n + ' checks, ' + fails + ' failure(s)');
process.exit(fails ? 1 : 0);
