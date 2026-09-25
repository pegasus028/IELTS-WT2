/* ===========================================================================
   POSITION CONTROL — Lab.gs
   Back end of the Template Lab (lab.js). Add this as a SECOND script file in
   the same Apps Script project as Code.gs (File → + → Script → "Lab").

   SET-UP (once)
   1. Paste this file as Lab.gs.
   2. In Code.gs, inside doPost, add ONE line straight after the JSON parse
      (before the lock) — see LAB-HOOK in Code.gs. It sends every action that
      starts with "lab." here, outside the global lock, so a class of thirty
      waiting for AI coaching does not queue the rest of the app.
   3. Project Settings → Script properties:
        ANTHROPIC_API_KEY     your Claude API key (required for AI coaching)
        LAB_COACH_MODELS      optional, default claude-haiku-4-5-20251001,claude-sonnet-4-6
        LAB_RATE_MODELS       optional, default claude-sonnet-4-6,claude-haiku-4-5-20251001
        LAB_STUDENT_DAILY     optional, AI calls per student per day, default 250
        LAB_DAILY             optional, AI calls for the whole class per day, default 4000
      Models are tried left to right; if one is unavailable the next is used.
   4. Deploy → Manage deployments → pencil → New version → Deploy.
      Saving alone does not update the live /exec endpoint.

   Sheets created on first use: LabTemplates, LabAttempts (one row per saved
   blueprint version / Assembly run version, full JSON in the last column).
   Coaching and rating are returned as JSON through Claude's tool use, so the
   answer always has the fields lab.js expects.
   =========================================================================== */

var LAB_SHEETS = {
  LabTemplates: ['id', 'studentId', 'ts', 'name', 'version', 'pct', 'level', 'status', 'score', 'frameWords', 'json'],
  LabAttempts: ['id', 'studentId', 'ts', 'templateId', 'pct', 'level', 'promptId', 'timing', 'version', 'words', 'share', 'overall', 'points', 'seconds', 'status', 'json']
};
var LAB_DEFAULTS = {
  LAB_COACH_MODELS: 'claude-haiku-4-5-20251001,claude-sonnet-4-6',
  LAB_RATE_MODELS: 'claude-sonnet-4-6,claude-haiku-4-5-20251001',
  LAB_STUDENT_DAILY: '250',
  LAB_DAILY: '4000'
};
var LAB_CELL_MAX = 48000;

/* ------------------------------------------------------------- router */
function LAB_handle(action, p) {
  try {
    if (action === 'lab.status') return { ok: true, ai: !!LAB_key_(), models: { coach: LAB_prop_('LAB_COACH_MODELS'), rate: LAB_prop_('LAB_RATE_MODELS') } };
    var s = LAB_auth_(p);
    if (!s) return { ok: false, error: 'Not signed in. Log out and in again.' };
    var sid = String(s.id).toLowerCase();
    switch (action) {
      case 'lab.list': return LAB_list_(sid);
      case 'lab.saveTemplate': return LAB_save_('LabTemplates', sid, p.template);
      case 'lab.saveAttempt': return LAB_save_('LabAttempts', sid, p.attempt);
      case 'lab.deleteTemplate': return LAB_delete_('LabTemplates', sid, p.id);
      case 'lab.deleteAttempt': return LAB_delete_('LabAttempts', sid, p.id);
      case 'lab.coach': LAB_quota_(sid); return { ok: true, coach: p.kind === 'variable' ? LAB_coachVariable_(p) : LAB_coachFrame_(p) };
      case 'lab.rate': LAB_quota_(sid); return { ok: true, rating: LAB_rate_(p) };
    }
    return { ok: false, error: 'Unknown action ' + action };
  } catch (err) {
    try { log('LAB ' + action + ' ' + err); } catch (e) {}
    return { ok: false, error: String(err && err.message || err) };
  }
}

/* ------------------------------------------------------------ helpers */
function LAB_prop_(k) { return PropertiesService.getScriptProperties().getProperty(k) || LAB_DEFAULTS[k] || ''; }
function LAB_key_() { var sp = PropertiesService.getScriptProperties(); return sp.getProperty('ANTHROPIC_API_KEY') || sp.getProperty('CLAUDE_API_KEY') || ''; }
/* Same rule as Code.gs auth(): the student must exist and, when both sides
   hold a token, the tokens must match. */
function LAB_auth_(p) {
  if (!p || !p.studentId) return null;
  var s = findStudent(p.studentId);
  if (!s) return null;
  if (p.token && s.token && String(p.token) !== String(s.token)) return null;
  return s;
}
function LAB_sheet_(name) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(LAB_SHEETS[name]); sh.setFrozenRows(1); }
  return sh;
}
function LAB_findRow_(sh, id) {
  if (sh.getLastRow() < 2) return 0;
  var hit = sh.getRange(2, 1, sh.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}
function LAB_round_(x) { var n = Number(x); return isNaN(n) ? '' : Math.round(n * 1000) / 1000; }

/* Keep a row's JSON under the 50,000-character cell limit by shedding the
   bulkiest coaching detail first. */
function LAB_fit_(obj) {
  var j = JSON.stringify(obj);
  if (j.length <= LAB_CELL_MAX) return j;
  var o = JSON.parse(j);
  function strip(fb) { if (fb) { delete fb.rows; delete fb.issues; if (fb.errorList) fb.errorList = fb.errorList.slice(0, 2); } }
  Object.keys(o.lines || {}).forEach(function (k) { strip(o.lines[k].last); });
  Object.keys(o.vars || {}).forEach(function (k) { strip(o.vars[k].last); });
  j = JSON.stringify(o);
  if (j.length <= LAB_CELL_MAX) return j;
  delete o.parasHtml;
  Object.keys(o.lines || {}).forEach(function (k) { if (o.lines[k].last) o.lines[k].last = { points: o.lines[k].last.points, errors: o.lines[k].last.errors, cefr: o.lines[k].last.cefr, fnv: o.lines[k].last.fnv }; });
  Object.keys(o.vars || {}).forEach(function (k) { if (o.vars[k].last) o.vars[k].last = { points: o.vars[k].last.points, errors: o.vars[k].last.errors, cefr: o.vars[k].last.cefr, fnv: o.vars[k].last.fnv }; });
  j = JSON.stringify(o);
  if (j.length <= LAB_CELL_MAX) return j;
  /* Last resort: keep the record and the essay, drop the per-slot detail. */
  var keep = {};
  ['id', 'studentId', 'name', 'templateId', 'templateName', 'templateVersion', 'pct', 'level', 'promptId', 'promptTitle', 'type', 'timing', 'version', 'parentId', 'rootId',
   'status', 'words', 'frameWords', 'share', 'rating', 'points', 'compare', 'seconds', 'createdAt', 'updatedAt', 'completedAt'].forEach(function (k) { if (o[k] !== undefined) keep[k] = o[k]; });
  keep.essay = String(o.essay || '').slice(0, 20000); keep.vars = {}; keep.lines = {}; keep.truncated = true;
  return JSON.stringify(keep);
}

/* --------------------------------------------------------------- store */
function LAB_rowFor_(name, sid, o) {
  var ts = o.updatedAt || new Date().toISOString();
  if (name === 'LabTemplates') return { id: o.id, studentId: sid, ts: ts, name: String(o.name || '').slice(0, 80), version: o.version || 1, pct: o.pct, level: o.level, status: o.status, score: o.score || '', frameWords: o.frameWords || '', json: LAB_fit_(o) };
  return { id: o.id, studentId: sid, ts: ts, templateId: o.templateId, pct: o.pct, level: o.level, promptId: o.promptId, timing: o.timing, version: o.version || 1, words: o.words || '',
    share: LAB_round_(o.share), overall: o.rating && o.rating.overall != null ? o.rating.overall : '', points: o.points ? o.points.total : '', seconds: o.seconds || '', status: o.status, json: LAB_fit_(o) };
}
function LAB_save_(name, sid, o) {
  if (!o || !o.id) return { ok: false, error: 'Nothing to save' };
  o.studentId = sid;
  var head = LAB_SHEETS[name], row = LAB_rowFor_(name, sid, o), vals = head.map(function (h) { return row[h] == null ? '' : row[h]; });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = LAB_sheet_(name), r = LAB_findRow_(sh, o.id);
    if (r) {
      var owner = String(sh.getRange(r, 2).getValue()).toLowerCase();
      if (owner !== sid) return { ok: false, error: 'That item belongs to another student.' };
      sh.getRange(r, 1, 1, head.length).setValues([vals]);
    } else sh.appendRow(vals);
  } finally { lock.releaseLock(); }
  return { ok: true, id: o.id };
}
function LAB_delete_(name, sid, id) {
  if (!id) return { ok: false, error: 'No id' };
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sh = LAB_sheet_(name), r = LAB_findRow_(sh, id);
    if (!r) return { ok: true };
    if (String(sh.getRange(r, 2).getValue()).toLowerCase() !== sid) return { ok: false, error: 'That item belongs to another student.' };
    sh.deleteRow(r);
  } finally { lock.releaseLock(); }
  return { ok: true };
}
function LAB_list_(sid) {
  function pull(name, limit) {
    var sh = LAB_sheet_(name), n = sh.getLastRow(), head = LAB_SHEETS[name];
    if (n < 2) return [];
    var data = sh.getRange(2, 1, n - 1, head.length).getValues(), iSid = head.indexOf('studentId'), iJson = head.indexOf('json'), out = [];
    data.forEach(function (r) { if (String(r[iSid]).toLowerCase() === sid) { try { out.push(JSON.parse(r[iJson])); } catch (e) {} } });
    return out.slice(-limit);
  }
  return { ok: true, templates: pull('LabTemplates', 60), attempts: pull('LabAttempts', 200) };
}

/* --------------------------------------------------------------- quota */
function LAB_quota_(sid) {
  if (!LAB_key_()) throw new Error('No AI key on the class server');
  var cache = CacheService.getScriptCache(), day = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMdd');
  var ks = 'labq:' + day + ':' + sid, kc = 'labq:' + day + ':all';
  var ns = Number(cache.get(ks) || 0), nc = Number(cache.get(kc) || 0);
  if (ns >= Number(LAB_prop_('LAB_STUDENT_DAILY'))) throw new Error('You have used today\'s AI coaching. Quick checks still work; the coach is back tomorrow.');
  if (nc >= Number(LAB_prop_('LAB_DAILY'))) throw new Error('The class has used today\'s AI coaching. Quick checks still work.');
  cache.put(ks, String(ns + 1), 21600); cache.put(kc, String(nc + 1), 21600);
}

/* ------------------------------------------------------------- Claude */
var LAB_SYSTEM = 'You are an experienced IELTS Writing examiner and a warm, exact writing coach for Thai secondary-school students (CEFR B1 to C1) ' +
  'who are building and using their own reusable template for IELTS Academic Writing Task 2. You judge against the public IELTS Writing Task 2 band ' +
  'descriptors (updated May 2023). You never write the student\'s answer for her: you point to the exact problem and give one concrete next step. ' +
  'Write every comment in plain B1-level English, in short sentences, addressed to the student as "you". Be honest: do not inflate levels or bands, ' +
  'and do not invent errors or list style preferences as errors. Report only by calling the tool.';

function LAB_claude_(modelsProp, user, tool, maxTokens) {
  var key = LAB_key_(); if (!key) throw new Error('No AI key on the class server');
  var models = LAB_prop_(modelsProp).split(',').map(function (m) { return m.trim(); }).filter(String), last = '';
  for (var i = 0; i < models.length; i++) {
    for (var attempt = 0; attempt < 2; attempt++) {
      var res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        payload: JSON.stringify({ model: models[i], max_tokens: maxTokens, system: LAB_SYSTEM, tools: [tool], tool_choice: { type: 'tool', name: tool.name },
          messages: [{ role: 'user', content: user }] })
      });
      var code = res.getResponseCode(), text = res.getContentText();
      if (code === 200) {
        var j = JSON.parse(text), blk = (j.content || []).filter(function (c) { return c.type === 'tool_use'; })[0];
        if (blk && blk.input) return blk.input;
        last = 'no tool output'; break;
      }
      last = 'HTTP ' + code + ' ' + text.slice(0, 180);
      if (code === 429 || code === 529 || code >= 500) { Utilities.sleep(1200 * (attempt + 1)); continue; }
      break;
    }
  }
  throw new Error('The AI coach is unavailable (' + last + ')');
}

/* Shared pieces of the tool schemas. */
var LAB_ERR = { type: 'array', description: 'Every real error. Empty if none.', items: { type: 'object', properties: {
  original: { type: 'string', description: 'the exact words as written' }, correction: { type: 'string' },
  type: { type: 'string', enum: ['spelling', 'grammar', 'punctuation', 'word choice', 'collocation', 'register'] },
  explain: { type: 'string', description: 'one short sentence' } }, required: ['original', 'correction', 'type', 'explain'] } };
var LAB_FN = { type: 'object', properties: { verdict: { type: 'string', enum: ['meets', 'partly', 'missing'] }, comment: { type: 'string', description: 'one or two sentences' } }, required: ['verdict', 'comment'] };
var LAB_OKNOTE = { type: 'object', properties: { ok: { type: 'boolean' }, note: { type: 'string', description: 'one sentence; empty if ok' } }, required: ['ok', 'note'] };
var LAB_LEVEL = { cefr: { type: 'string', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] }, band: { type: 'number', description: 'IELTS band this language typically corresponds to, 4 to 9 in steps of 0.5' },
  praise: { type: 'string', description: 'one specific thing done well, quoting the words' }, tip: { type: 'string', description: 'the single most useful next step, one sentence' } };

function LAB_clean_(o) {
  o = o || {};
  var errs = (o.errors || []).filter(function (e) { return e && e.original && e.correction && String(e.original).trim() !== String(e.correction).trim(); }).slice(0, 10);
  var band = Number(o.band); band = isNaN(band) ? null : Math.max(1, Math.min(9, Math.round(band * 2) / 2));
  var fn = o.fn && /^(meets|partly|missing)$/.test(o.fn.verdict) ? o.fn : { verdict: 'partly', comment: '' };
  var out = { errors: errs, fn: fn, cefr: /^(A1|A2|B1|B2|C1|C2)$/.test(o.cefr) ? o.cefr : '', band: band, praise: String(o.praise || ''), tip: String(o.tip || '') };
  ['generic', 'relevance', 'fit', 'reword'].forEach(function (k) { if (o[k] && typeof o[k].ok === 'boolean') out[k] = { ok: o[k].ok, note: String(o[k].note || '') }; });
  if (o.slotForm) out.slotForm = String(o.slotForm);
  return out;
}

/* ---------------------------------------------------------- one frame line */
function LAB_coachFrame_(p) {
  var c = p.component || {};
  var user = [
    'TASK: Coach ONE line of a student\'s personal IELTS Task 2 template.',
    'The template is reusable scaffolding. Words in [square brackets] are slots the student will fill later with content for ANY prompt. The slots are not errors; do not judge what might go in them.',
    '',
    'Target level: ' + p.level + ' (IELTS Band ' + p.band + '). Template share chosen: ' + p.pct + '% of a 280-word essay.',
    'Component: "' + c.name + '" (paragraph: ' + c.paragraph + ')',
    'Its job: ' + c.fn,
    'Why it scores: ' + c.why,
    'Required slot(s): ' + (c.slots || []).map(function (s) { return '[' + s + ']'; }).join(', '),
    'Word budget for the fixed words: ' + (p.budget || {}).lo + ' to ' + (p.budget || {}).hi + ' (the student wrote ' + p.words + ').',
    (p.context && p.context.length ? 'Other lines already written in this paragraph (context only):\n- ' + p.context.join('\n- ') : ''),
    '',
    'STUDENT\'S LINE:',
    '"""' + String(p.line || '').slice(0, 600) + '"""',
    '',
    'Report:',
    '1. errors: every real spelling, grammar, punctuation, word-choice, collocation or register error in the fixed words (ignore the slot labels).',
    '2. fn: does the line do its job? meets / partly / missing, with a short comment.',
    '3. generic: is the fixed wording reusable for any Task 2 prompt, with no topic-specific words? Memorised-sounding cliches ("Nowadays", "hot topic", "double-edged sword") or robotic linkers ("Firstly", "On the other hand") count against it: say so in the note.',
    '4. slotForm: one short sentence on the grammatical form the slot filler must take for the finished sentence to be correct, with a two-word example (e.g. "After by, start Mechanism A with an -ing verb: reducing traffic").',
    '5. cefr and band: the level of the fixed wording.',
    '6. praise and tip.'
  ].join('\n');
  var tool = { name: 'coach_line', description: 'Coaching for one template line', input_schema: { type: 'object', properties: {
    errors: LAB_ERR, fn: LAB_FN, generic: LAB_OKNOTE, slotForm: { type: 'string' },
    cefr: LAB_LEVEL.cefr, band: LAB_LEVEL.band, praise: LAB_LEVEL.praise, tip: LAB_LEVEL.tip }, required: ['errors', 'fn', 'generic', 'slotForm', 'cefr', 'band', 'praise', 'tip'] } };
  return LAB_clean_(LAB_claude_('LAB_COACH_MODELS', user, tool, 900));
}

/* ------------------------------------------------------- one variable */
function LAB_coachVariable_(p) {
  var v = p.variable || {}, pr = p.prompt || {};
  var user = [
    'TASK: Coach ONE variable. The student has written the words that fill one slot of her own template, for the prompt below.',
    '',
    'PROMPT (IELTS Academic Task 2, type: ' + pr.type + '):',
    '"""' + String(pr.text || '').slice(0, 900) + '"""',
    'What this question type demands: ' + (pr.demand || ''),
    '',
    'Target level: ' + p.level + ' (IELTS Band ' + p.band + ').',
    'Variable: "' + v.label + '". Its job: ' + (v.does || '') + ' Expected form: ' + (v.form || ''),
    'Word budget: ' + (p.budget || {}).lo + ' to ' + (p.budget || {}).hi + ' (the student wrote ' + p.words + ').',
    '',
    'STUDENT\'S WORDS FOR THE SLOT:',
    '"""' + String(p.value || '').slice(0, 600) + '"""',
    (p.value2 != null ? 'SECOND MENTION (the same idea reworded, used later in the essay):\n"""' + String(p.value2 || '(left empty)').slice(0, 400) + '"""' : ''),
    '',
    'WHERE THE WORDS APPEAR (her template with this slot filled; slots not yet written are in [brackets]):',
    '"""' + (p.inContext || []).join('\n\n').slice(0, 2400) + '"""',
    (p.filled && p.filled.length ? 'Other variables already written (context only):\n- ' + p.filled.join('\n- ').slice(0, 1600) : ''),
    '',
    'Report:',
    '1. errors: real errors in the student\'s words, AND any grammar error created where her words join the template sentence (agreement, a missing -ing after "by", a clause where a noun phrase is needed).',
    '2. fn: does this variable do its job for THIS prompt? Consider precision and development: Band 7 is capped by over-generalising, Band 8 needs ideas that are relevant, well extended and supported. meets / partly / missing.',
    '3. relevance: does it stay on the prompt\'s topic without drifting (for example "children" becoming "adolescents", or a new topic)?',
    '4. fit: does the filled sentence read naturally and grammatically?',
    (p.value2 != null ? '5. reword: is the second mention a genuine rewording with the same meaning (not the same words, not a new idea)?' : '5. reword: not applicable; return ok true and an empty note.'),
    '6. cefr and band: the level of the student\'s own words.',
    '7. praise and tip. Never write a full model answer for the slot.'
  ].join('\n');
  var tool = { name: 'coach_variable', description: 'Coaching for one filled variable', input_schema: { type: 'object', properties: {
    errors: LAB_ERR, fn: LAB_FN, relevance: LAB_OKNOTE, fit: LAB_OKNOTE, reword: LAB_OKNOTE,
    cefr: LAB_LEVEL.cefr, band: LAB_LEVEL.band, praise: LAB_LEVEL.praise, tip: LAB_LEVEL.tip }, required: ['errors', 'fn', 'relevance', 'fit', 'reword', 'cefr', 'band', 'praise', 'tip'] } };
  var out = LAB_clean_(LAB_claude_('LAB_COACH_MODELS', user, tool, 900));
  if (p.value2 == null) delete out.reword;
  return out;
}

/* ---------------------------------------------------------- the essay */
function LAB_rate_(p) {
  var pr = p.prompt || {};
  var user = [
    'TASK: Rate this IELTS Academic Writing Task 2 essay against the public band descriptors (updated May 2023): one band per criterion, 1 to 9 in steps of 0.5.',
    'The student assembled it from her own template (fixed wording listed below) plus her own ideas. Do not penalise the template for existing. Judge the essay as an examiner would: does the frame read as memorised or mechanical, does it fit this prompt, are the ideas developed and precise, is the position clear from the introduction to the conclusion?',
    'Essays under 250 words lose Task Response marks. Be honest; do not inflate.',
    '',
    'Student target: ' + p.level + ' (Band ' + p.band + '). Template share: ' + Math.round((Number(p.share) || 0) * 100) + '% of the words (chosen target ' + p.pct + '%).',
    '',
    'PROMPT (type: ' + pr.type + '):',
    '"""' + String(pr.text || '').slice(0, 900) + '"""',
    'What this question type demands: ' + (pr.demand || ''),
    '',
    'ESSAY (' + p.words + ' words):',
    '"""' + String(p.essay || '').slice(0, 5000) + '"""',
    '',
    'HER TEMPLATE, paragraph by paragraph ([slots] were filled by her):',
    (p.frame || []).map(function (f, i) { return (i + 1) + '. ' + f; }).join('\n').slice(0, 2400),
    '',
    'Report tr, cc, lr, gra; cefr for the essay as a whole; summary (two sentences to the student); strengths (two, each quoting the essay); priorities (two or three, each with the criterion TR, CC, LR or GRA and one concrete action that would raise it by half a band); frameNote (one sentence on how her template helps or shows).'
  ].join('\n');
  var band = { type: 'number', description: '1 to 9 in steps of 0.5' };
  var tool = { name: 'rate_essay', description: 'Band estimate for one Task 2 essay', input_schema: { type: 'object', properties: {
    tr: band, cc: band, lr: band, gra: band, cefr: LAB_LEVEL.cefr, summary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    priorities: { type: 'array', items: { type: 'object', properties: { crit: { type: 'string', enum: ['TR', 'CC', 'LR', 'GRA'] }, text: { type: 'string' } }, required: ['crit', 'text'] } },
    frameNote: { type: 'string' } }, required: ['tr', 'cc', 'lr', 'gra', 'cefr', 'summary', 'strengths', 'priorities', 'frameNote'] } };
  var r = LAB_claude_('LAB_RATE_MODELS', user, tool, 1400);
  ['tr', 'cc', 'lr', 'gra'].forEach(function (k) { var n = Number(r[k]); r[k] = isNaN(n) ? null : Math.max(1, Math.min(9, Math.round(n * 2) / 2)); });
  if (!/^(A1|A2|B1|B2|C1|C2)$/.test(r.cefr)) r.cefr = '';
  r.strengths = (r.strengths || []).slice(0, 3); r.priorities = (r.priorities || []).slice(0, 3);
  return r;
}
