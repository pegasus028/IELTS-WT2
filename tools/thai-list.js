#!/usr/bin/env node
/* Rebuilds docs/THAI-GLOSS-CHECK.md (the native-check list for T.Chris) from lesson-thai.js
   and lesson-levels.js, and checks that every A1/A2 key sentence has a Thai line.
   node tools/thai-list.js                                                           */
var fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
global.window = {};
require(path.join(root, 'lesson-levels.js')); require(path.join(root, 'lesson-thai.js')); require(path.join(root, 'content.js'));
fs.readdirSync(root).filter(function (f) { return /^topic-\d\d\.js$/.test(f); }).sort().forEach(function (f) { require(path.join(root, f)); });
var L = window.QM_LESSON_LEVELS, T = window.QM_LESSON_THAI, C = window.CONTENT, name = {}, missing = 0, n = 0;
C.TOPICS.forEach(function (t) { t.levels.forEach(function (lv) { lv.subs.forEach(function (s) { name[s.id] = t.code + ' · ' + s.name; }); }); });
var out = ['# Thai glosses on the lesson key sentences: check list for T.Chris', '',
  'Built 20 Oct 2026 (WP6 remainder). Every Thai line below is a **draft written by Claude, not by a native speaker**. Please have a Thai speaker read each one before the toggle goes live. The lines live in lesson-thai.js (window.QM_LESSON_THAI); when a line is corrected there, re-run `node tools/thai-list.js` to rebuild this file.', '',
  'How it shows: on a lesson page at the A1 or A2 explanation level, a ไทย button under the level bar turns the gloss on (off by default; kept as qm.thai on the device and p.thaiGloss on the profile). The gloss sits under the key sentence only; lesson bodies are not translated.', '',
  '| Lesson | Level | English key sentence | Thai gloss (draft — native check needed) | OK? |', '|---|---|---|---|---|'];
Object.keys(L).forEach(function (id) {
  ['A1', 'A2'].forEach(function (lv) {
    var en = String(L[id][lv].key).replace(/<[^>]+>/g, '').replace(/\|/g, '\\|'), th = (T[id] || {})[lv];
    if (!th) { missing++; th = '(missing)'; }
    if (th && !/[฀-๿]/.test(th)) missing++;
    n++;
    out.push('| ' + id + ' ' + (name[id] || '') + ' | ' + lv + ' | ' + en + ' | ' + th.replace(/\|/g, '\\|') + ' | draft — native check needed |');
  });
});
/* the story keywords ([[word|English gloss|Thai gloss]]) in the term-project scenes (story-content.js, WP10a) */
require(path.join(root, 'story-content.js'));
var KW = /\[\[([^\]]+)\]\]/g, S = window.STORY || {}, sk = 0;
out.push('', '## Story keywords in the five term-project scenes (story-content.js `projects`)', '', '| Project | Word | English gloss | Thai gloss (draft — native check needed) | OK? |', '|---|---|---|---|---|');
(S.projects || []).forEach(function (pj) {
  var m; KW.lastIndex = 0;
  while ((m = KW.exec(String(pj.scene && pj.scene.text || '')))) { var parts = m[1].split('|'); sk++; if (!parts[2] || !/[฀-๿]/.test(parts[2])) missing++; out.push('| ' + pj.n + ' ' + pj.title + ' | ' + parts[0] + ' | ' + (parts[1] || '') + ' | ' + (parts[2] || '(missing)') + ' | draft — native check needed |'); }
});
out.push('', n + ' lesson lines and ' + sk + ' story keywords in all.');
fs.writeFileSync(path.join(root, 'docs/THAI-GLOSS-CHECK.md'), out.join('\n') + '\n');
console.log('thai-list: ' + n + ' lesson lines, ' + sk + ' story keywords, ' + missing + ' missing');
process.exit(missing ? 1 : 0);
