/* ===========================================================================
   POSITION CONTROL — lab.js
   The Template Lab: a student builds her own Task 2 template line by line
   (Blueprint Studio), fills its eleven variables for real prompts against
   the clock (Assembly Line), and compares template shares over time
   (Scorecard). Every submission is coached: errors, word budget, whether the
   line does its job, CEFR level and band estimate, and points.

   Coaching and rating come from Lab.gs (Claude through Apps Script). When the
   server or the AI is unreachable, a quick rule-based check runs instead and
   the work is kept on this device until the class sheet is back.

   Mounted by student.js:  Lab.mount(sectionElement, window.PCHost)
   Plain ES5, like the rest of the app.
   =========================================================================== */
(function (global) {
  'use strict';

  var L = global.LabContent, C = global.CONTENT, T = global.Template, W = global.Writer, PR = global.Prompts;
  var host = null, root = null;

  /* Register the Lab awards with the app's badge list once. */
  L.BADGES.forEach(function (b) {
    if (!C.BADGES.some(function (x) { return x.id === b.id; })) C.BADGES.push(b);
  });

  var COMP = {}; L.COMPONENTS.forEach(function (c, i) { c.n = i + 1; COMP[c.id] = c; });
  var VAR_KEYS = C.VARIABLES.map(function (v) { return v.key; });
  var MAX_TRIES = 3;
  var TIMEOUT_COACH = 45000, TIMEOUT_RATE = 60000, TIMEOUT_SAVE = 20000;

  /* ================================================================ state */
  var st = {
    tab: 'studio', view: 'home',
    sid: null, data: null, synced: false,
    ai: null, aiNote: '',
    setup: null, build: null, run: null, review: null,
    filters: { type: 'all' }, asmTemplate: null, asmTiming: 'none', asmPrompt: null,
    showOtherTier: false, pending: false, highlightFrame: true
  };

  /* ============================================================== helpers */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel) { return root ? root.querySelector(sel) : null; }
  function $$(sel) { return root ? Array.prototype.slice.call(root.querySelectorAll(sel)) : []; }
  function uid(pre) { return pre + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function nowIso() { return new Date().toISOString(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function extend(a, b) { Object.keys(b || {}).forEach(function (k) { a[k] = b[k]; }); return a; }
  function fmtDate(iso) { try { var d = new Date(iso); return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtBand(b) { return (b == null || isNaN(b)) ? '—' : (Math.round(b * 2) / 2).toFixed(1); }
  function pctStr(x) { return Math.round((x || 0) * 100) + '%'; }
  function levelInfo(id) { return L.LEVELS.filter(function (l) { return l.id === id; })[0] || L.LEVELS[1]; }
  function tierOf(levelId) { return levelInfo(levelId).tier; }
  function cefrIdx(c) { return L.CEFR_ORDER.indexOf(String(c || '').toUpperCase().replace(/[^ABC12]/g, '').slice(0, 2)); }
  function typeName(t) { return (C.TYPES[t] || {}).name || t; }
  function sign(n, digits) { var v = digits ? n.toFixed(digits) : String(Math.round(n)); return (n > 0 ? '+' : n < 0 ? '−' : '±') + v.replace('-', ''); }
  /* IELTS rounding: the mean of the four criteria to the nearest half band, .25 and .75 rounding up. */
  function overallBand(b) {
    var v = [b.tr, b.cc, b.lr, b.gra].map(Number);
    if (v.some(function (x) { return isNaN(x); })) return null;
    var m = (v[0] + v[1] + v[2] + v[3]) / 4;
    return Math.floor(m * 2 + 0.5 + 1e-9) / 2;
  }

  /* ---------------------------------------------------------- word maths */
  function words(s) { var m = String(s || '').match(/[A-Za-z0-9À-ɏ]+(?:['’\-][A-Za-z0-9À-ɏ]+)*/g); return m ? m.length : 0; }
  function frameText(line) { return String(line || '').replace(/\{\w+\}/g, ' '); }
  function frameWords(line) { return words(frameText(line)); }
  function normWords(s) { return String(s || '').toLowerCase().replace(/’/g, "'").replace(/[^a-z0-9' ]+/g, ' ').split(/\s+/).filter(Boolean); }
  function zeros(n) { var a = []; for (var i = 0; i < n; i++) a.push(0); return a; }
  /* Longest run of consecutive words two texts share. */
  function longestRun(a, b) {
    var x = normWords(a), y = normWords(b), best = 0, prev = zeros(y.length + 1);
    for (var i = 1; i <= x.length; i++) {
      var cur = zeros(y.length + 1);
      for (var j = 1; j <= y.length; j++) if (x[i - 1] === y[j - 1]) { cur[j] = prev[j - 1] + 1; if (cur[j] > best) best = cur[j]; }
      prev = cur;
    }
    return best;
  }
  function trigramOverlap(a, b) {
    function grams(s) { var w = normWords(s), g = {}; for (var i = 0; i + 2 < w.length; i++) g[w[i] + ' ' + w[i + 1] + ' ' + w[i + 2]] = 1; return g; }
    var ga = grams(a), gb = grams(b), ka = Object.keys(ga); if (!ka.length) return 0;
    var hit = ka.filter(function (k) { return gb[k]; }).length;
    return hit / ka.length;
  }
  function similarity(a, b) {
    var x = normWords(a), y = normWords(b); if (!x.length || !y.length) return 0;
    var sy = {}; y.forEach(function (w) { sy[w] = 1; });
    var hit = x.filter(function (w) { return sy[w]; }).length;
    return hit / Math.max(x.length, y.length);
  }

  /* -------------------------------------------- [Slot Label] <-> {token} */
  function toTokens(text) {
    var unknown = [];
    var out = String(text || '').replace(/\[([^\]\n]{1,40})\]/g, function (m, name) {
      var k = L.SLOT_ALIASES[name.trim().toLowerCase().replace(/\s+/g, ' ')];
      if (k) return '{' + k + '}';
      unknown.push(name); return m;
    });
    out = out.replace(/\{(\w+)\}/g, function (m, k) { return VAR_KEYS.indexOf(k) >= 0 ? m : (unknown.push(k), m); });
    return { text: out, unknown: unknown };
  }
  function toLabels(tokText) { return String(tokText || '').replace(/\{(\w+)\}/g, function (m, k) { return L.SLOT_LABEL[k] ? '[' + L.SLOT_LABEL[k] + ']' : m; }); }
  function tokensIn(tokText) { var m = String(tokText || '').match(/\{(\w+)\}/g) || []; return m.map(function (x) { return x.slice(1, -1); }); }
  function slotChips(tokText, labels) {
    labels = labels || L.SLOT_LABEL;
    return esc(tokText).replace(/\{(\w+)\}/g, function (m, k) { return '<span class="slot">[' + esc(labels[k] || k) + ']</span>'; });
  }

  /* Fill a value into a frame position: trim end punctuation, fix the case
     of the first letter for the position in the sentence. */
  var LOWER_OK = /^(the|a|an|this|these|that|those|its|their|our|his|her|many|most|some|such|every|each|all|both|more|less|fewer|people|governments?|it|they|we|there|when|if|by|through|in|on|at|for|with|without|while|although|because|since|as|parents|children|students|schools|teachers|citizens|individuals|society|companies|employers|workers|young|older|public|private|local|national|international|economic|social|cultural|environmental|financial|strict|greater|higher|lower|better|worse|no|not|only|even|just|almost|also|one|two|three|several|few|much|any|what|how|whether|which|who)$/i;
  function fitValue(v, startsSentence) {
    v = String(v || '').trim().replace(/[.;:,]+$/, '').replace(/^["“]|["”]$/g, '');
    if (!v) return v;
    var first = v.split(/\s+/)[0].replace(/[^A-Za-z'’-]/g, '');
    if (startsSentence) return v.charAt(0).toUpperCase() + v.slice(1);
    if (/^[A-Z][a-z]/.test(first) && (LOWER_OK.test(first) || /(ing|ly|ed)$/.test(first))) return v.charAt(0).toLowerCase() + v.slice(1);
    return v;
  }
  function tidy(s) { return T.tidy(s).replace(/\s+'s\b/g, "'s"); }

  /* Assemble the essay: first mention of a slot uses the main value, later
     mentions use the reworded one when the student wrote it. `mark` wraps
     student words in <b class="lab-own"> for the highlighted view. */
  function assemble(tpl, vars, opts) {
    opts = opts || {};
    var seen = {}, paras = [], frameCount = 0, ownCount = 0;
    L.PARAS.forEach(function (pg) {
      var lines = L.COMPONENTS.filter(function (c) { return c.para === pg.key; }).map(function (c) { return (tpl.lines[c.id] || {}).text || ''; }).filter(Boolean);
      var text = lines.join(' ');
      var plain = '', html = '';
      var re = /\{(\w+)\}/g, last = 0, m;
      while ((m = re.exec(text))) {
        var before = text.slice(last, m.index);
        plain += before; html += esc(before);
        frameCount += words(before);
        var k = m[1], n = seen[k] || 0; seen[k] = n + 1;
        var v = vars[k] || {}, val = (n > 0 && v.text2 && v.text2.trim()) ? v.text2 : (v.text || '');
        var sofar = plain.replace(/\s+$/, '');
        var startsSentence = !sofar || /[.!?]$/.test(sofar);
        var filled = val ? fitValue(val, startsSentence) : '';
        if (filled) {
          ownCount += words(filled);
          plain += filled;
          html += opts.mark ? '<b class="lab-own">' + esc(filled) + '</b>' : esc(filled);
        } else {
          var lab = '[' + (opts.labels ? opts.labels[k] : L.SLOT_LABEL[k]) + ']';
          plain += lab; html += '<span class="slot">' + esc(lab) + '</span>';
        }
        last = re.lastIndex;
      }
      var tail = text.slice(last); plain += tail; html += esc(tail); frameCount += words(tail);
      paras.push({ key: pg.key, text: tidy(plain), html: html.replace(/\s+/g, ' ').trim() });
    });
    var essay = paras.map(function (p) { return p.text; }).join('\n\n');
    var total = words(essay);
    return { paras: paras, essay: essay, words: total, frameWords: frameCount, ownWords: ownCount, share: total ? frameCount / total : 0 };
  }

  /* ------------------------------------------------------------- budgets */
  function frameBudget(pct) { return Math.round(L.ESSAY_WORDS * pct / 100); }
  function compBudget(pct, compId) {
    var total = L.COMPONENTS.reduce(function (s, c) { return s + c.weight; }, 0);
    var t = Math.max(2, Math.round(frameBudget(pct) * COMP[compId].weight / total));
    return { target: t, lo: Math.max(1, Math.round(t * 0.7)), hi: Math.round(t * 1.3) + 1 };
  }
  /* Slot occurrences in the finished template decide each variable's share. */
  function occurrences(tpl) {
    var occ = {};
    L.COMPONENTS.forEach(function (c) { tokensIn((tpl.lines[c.id] || {}).text || '').forEach(function (k) { occ[k] = (occ[k] || 0) + 1; }); });
    return occ;
  }
  function varBudget(tpl, key) {
    var occ = occurrences(tpl), fw = templateFrameWords(tpl);
    var left = Math.max(60, L.ESSAY_WORDS - fw);
    var units = 0; Object.keys(occ).forEach(function (k) { units += (L.VAR_GUIDE[k] ? L.VAR_GUIDE[k].weight : 1) * occ[k]; });
    var t = Math.max(3, Math.round(left * (L.VAR_GUIDE[key] ? L.VAR_GUIDE[key].weight : 1) / (units || 1)));
    return { target: t, lo: Math.max(2, Math.round(t * 0.6)), hi: Math.round(t * 1.6) + 2 };
  }
  function templateFrameWords(tpl) { return L.COMPONENTS.reduce(function (s, c) { return s + frameWords((tpl.lines[c.id] || {}).text || ''); }, 0); }

  /* What grammar the slot needs, read off the words just before it. */
  function slotFormHint(tpl, key) {
    var hints = [];
    L.COMPONENTS.forEach(function (c) {
      var t = (tpl.lines[c.id] || {}).text || '', re = new RegExp('([A-Za-z\']+)[\\s,;:]*\\{' + key + '\\}', 'g'), m;
      while ((m = re.exec(t))) {
        var w = m[1].toLowerCase();
        if (w === 'by' || w === 'through' || w === 'from' && key.indexOf('mech') === 0) hints.push('After "' + w + '", start with an -ing verb (e.g. "reducing…", "giving…").');
        else if (/^(that|because|since|when|while|although|if|whereas)$/.test(w)) hints.push('After "' + w + '", write a full clause with its own subject and verb.');
        else if (/^(as|like|of|is|are|to|toward|towards|on|and|between|surrounding|about|in)$/.test(w)) hints.push('After "' + w + '", a noun phrase fits best.');
      }
      if (t.trim().indexOf('{' + key + '}') === 0) hints.push('This slot opens a sentence, so it must work as the subject of that sentence.');
    });
    var coached = (tpl.slotNotes || {})[key];
    if (coached) hints.unshift(coached);
    return hints.filter(function (h, i) { return hints.indexOf(h) === i; }).slice(0, 2);
  }

  /* ============================================================== storage
     One local store per student; the class sheet is the long-term copy.
     `dirty` lists ids saved locally but not yet acknowledged by the server. */
  function storeKey() { return 'pc.lab.v1.' + String(st.sid || 'anon').toLowerCase(); }
  function loadLocal() {
    try { var d = JSON.parse(localStorage.getItem(storeKey())); if (d && d.templates) return d; } catch (e) {}
    return { templates: [], attempts: [], dirty: {} };
  }
  function persist() { try { localStorage.setItem(storeKey(), JSON.stringify(st.data)); } catch (e) { toast('This device is full: older Lab runs may not be kept offline.'); } }
  function upsert(list, obj) {
    for (var i = 0; i < list.length; i++) if (list[i].id === obj.id) { list[i] = obj; return; }
    list.push(obj);
  }
  function mergeServer(r) {
    var changed = false;
    [['templates', r.templates || []], ['attempts', r.attempts || []]].forEach(function (pair) {
      var list = st.data[pair[0]];
      pair[1].forEach(function (s) {
        if (!s || !s.id) return;
        var mine = list.filter(function (x) { return x.id === s.id; })[0];
        if (!mine || (String(s.updatedAt || '') > String(mine.updatedAt || '') && !st.data.dirty[s.id])) { upsert(list, s); changed = true; }
      });
    });
    if (changed) persist();
    return changed;
  }
  function saveItem(kind, obj) {
    obj.updatedAt = nowIso();
    upsert(st.data[kind === 'template' ? 'templates' : 'attempts'], obj);
    /* No class server configured (demo mode): this device is the store. */
    if (!(global.API && global.API.url)) { persist(); return Promise.resolve(true); }
    st.data.dirty[obj.id] = kind;
    persist();
    return pushItem(kind, obj);
  }
  function pushItem(kind, obj) {
    return server(kind === 'template' ? 'lab.saveTemplate' : 'lab.saveAttempt', kind === 'template' ? { template: obj } : { attempt: obj }, TIMEOUT_SAVE)
      .then(function () { delete st.data.dirty[obj.id]; persist(); return true; })
      .catch(function () { return false; });
  }
  function savedMsg(ok, what) {
    if (!(global.API && global.API.url)) return what + ' on this device (offline mode).';
    return ok ? what + ' to your ID.' : what + ' on this device; it will reach your ID when the class server is back.';
  }
  function pushDirty() {
    Object.keys(st.data.dirty || {}).forEach(function (id) {
      var kind = st.data.dirty[id], list = kind === 'template' ? st.data.templates : st.data.attempts;
      var obj = list.filter(function (x) { return x.id === id; })[0];
      if (obj) pushItem(kind, obj); else delete st.data.dirty[id];
    });
  }

  /* =============================================================== server */
  function online() { var api = global.API; return !!(api && api.url && api.mode === 'cloud'); }
  function server(action, payload, ms) {
    var api = global.API;
    if (!api || !api.url) return Promise.reject(new Error('offline'));
    if (api.mode !== 'cloud' && api.retryCloud) api.retryCloud();
    if (api.mode !== 'cloud') return Promise.reject(new Error('offline'));
    payload = payload || {};
    payload.studentId = st.sid;
    try { payload.token = localStorage.getItem('pc.token') || ''; } catch (e) {}
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null, timer;
    var req = fetch(api.url, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, payload: payload }), redirect: 'follow', signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
    var guard = new Promise(function (_, reject) { timer = setTimeout(function () { if (ctrl) { try { ctrl.abort(); } catch (e) {} } reject(new Error('The coach took too long to answer.')); }, ms || TIMEOUT_COACH); });
    return Promise.race([req, guard]).then(function (j) {
      clearTimeout(timer);
      if (!j || !j.ok) throw new Error((j && j.error) || 'Server error');
      return j;
    }, function (e) { clearTimeout(timer); throw e; });
  }
  function checkStatus() {
    if (!online()) { st.ai = false; st.aiNote = 'Offline: quick checks only. Your work is kept on this device.'; return Promise.resolve(); }
    return server('lab.status', {}, 15000).then(function (r) {
      st.ai = !!r.ai; st.aiNote = r.ai ? 'AI coach online' : 'The class server has no AI key yet: quick checks only.';
    }).catch(function (e) {
      st.ai = false;
      st.aiNote = /Unknown action/.test(String(e.message)) ? 'The class server has not been updated for the Lab yet: quick checks only.' : 'Could not reach the AI coach: quick checks only.';
    });
  }

  /* ========================================================= quick checks */
  var EXTRA_CLICHE = [/\bnowadays\b/i, /\bin this essay,? i will\b/i, /\bi will discuss\b/i, /\bfirst and foremost\b/i, /\bboth sides of the coin\b/i, /\bpros and cons\b/i];
  var CONTRACTION = /\b(\w+n't|it's|there's|that's|they're|we're|i'm|you're|let's)\b/i;
  var INFORMAL = /\b(kids?|stuff|a lot of|lots of|gonna|wanna|okay|ok|super|awesome|guys)\b/i;
  function spellErrors(text) {
    var out = [];
    normWords(text).forEach(function (w) {
      if (L.MISSPELL[w]) out.push({ original: w, correction: L.MISSPELL[w], type: 'spelling', explain: 'Spelling.' });
      else if (L.UNCOUNTABLE[w]) out.push({ original: w, correction: L.UNCOUNTABLE[w], type: 'grammar', explain: 'Usually uncountable: no -s.' });
    });
    var m = String(text).match(/\b(\w+)\s+\1\b/i);
    if (m && !/^(that|had)$/i.test(m[1])) out.push({ original: m[0], correction: m[1], type: 'grammar', explain: 'The same word twice.' });
    var an = String(text).match(/\b[aA]\s+([aeiouAEIOU]\w+)/);
    if (an && !/^(uni|use|usu|eu|one|once)/i.test(an[1])) out.push({ original: an[0], correction: 'an ' + an[1], type: 'grammar', explain: 'Use "an" before a vowel sound.' });
    if (/(^|[.!?]\s+|\s)i\s/.test(' ' + text)) out.push({ original: 'i', correction: 'I', type: 'spelling', explain: 'The pronoun I is always a capital letter.' });
    return out;
  }
  function styleIssues(text, isTopicLine) {
    var out = [];
    (W && W.LEX ? W.LEX.CLICHE : []).concat(EXTRA_CLICHE).forEach(function (re) { var m = String(text).match(re); if (m) out.push({ kind: 'warn', msg: '"' + m[0] + '" reads as memorised: examiners spot it at once. Say it your own way.' }); });
    if (CONTRACTION.test(text)) out.push({ kind: 'warn', msg: 'Contraction: write the full form (it is, do not) in an academic essay.' });
    if (INFORMAL.test(text)) out.push({ kind: 'warn', msg: 'Informal word: "' + String(text).match(INFORMAL)[0] + '". Choose a formal one.' });
    if (isTopicLine && W && W.LEX && W.LEX.LINKER_HEAD.test(String(text).trim())) out.push({ kind: 'warn', msg: 'Starts with a robotic linker ("' + String(text).trim().match(W.LEX.LINKER_HEAD)[0].replace(/,$/, '') + '"). Connect the paragraphs through meaning instead.' });
    if (/\s{2,}/.test(text)) out.push({ kind: 'tip', msg: 'Double space.' });
    return out;
  }

  /* One template line. */
  function quickFrame(comp, rawText, pct) {
    var conv = toTokens(rawText), text = conv.text.trim(), res = { text: text, blocking: [], issues: [], errors: [], budget: compBudget(pct, comp.id) };
    if (!text) { res.blocking.push('Write the line first.'); return res; }
    conv.unknown.forEach(function (u) { res.blocking.push('[' + u + '] is not a slot name. Use the slot buttons above the box.'); });
    var toks = tokensIn(text);
    comp.slots.forEach(function (k) {
      var n = toks.filter(function (x) { return x === k; }).length;
      if (n === 0) res.blocking.push('This line must contain [' + L.SLOT_LABEL[k] + '].');
      if (n > 1) res.blocking.push('[' + L.SLOT_LABEL[k] + '] appears ' + n + ' times; use it once.');
    });
    toks.forEach(function (k) { if (comp.slots.indexOf(k) < 0) res.issues.push({ kind: 'warn', msg: '[' + L.SLOT_LABEL[k] + '] belongs to another line. Keep each line to its own slot so the essay stays in order.' }); });
    res.words = frameWords(text);
    res.budget.ok = res.words >= res.budget.lo && res.words <= res.budget.hi;
    if (res.words > res.budget.hi) res.issues.push({ kind: 'warn', msg: res.words + ' template words: over the ' + res.budget.lo + '–' + res.budget.hi + ' budget for a ' + pct + '% template. Trim words that carry no meaning.' });
    if (res.words < res.budget.lo) res.issues.push({ kind: 'tip', msg: res.words + ' template words: under the ' + res.budget.lo + '–' + res.budget.hi + ' budget. Fine if the line still does its job.' });
    var ex = comp.examples.B2.concat(comp.examples.C1), worst = 0, worstEx = '';
    ex.forEach(function (e) {
      var a = text.replace(/\{\w+\}/g, ' slotx '), b = e.replace(/\{\w+\}/g, ' slotx ');
      var run = longestRun(a, b), tri = trigramOverlap(a, b), score = Math.max(run >= 5 ? 1 : 0, tri);
      if (score > worst) { worst = score; worstEx = e; }
    });
    res.copied = worst >= 0.6;
    if (res.copied) res.issues.push({ kind: 'warn', msg: 'Too close to an example ("' + toLabels(worstEx) + '"). Condition 1: the template must be in your own words.' });
    var first = text.replace(/^\s*\{\w+\}\s*/, '');
    if (text && !/^\{/.test(text) && /^[a-z]/.test(text)) res.errors.push({ original: text.split(/\s+/)[0], correction: text.charAt(0).toUpperCase() + text.split(/\s+/)[0].slice(1), type: 'punctuation', explain: 'A sentence starts with a capital letter.' });
    if (!/[.!?:;]$/.test(text) && !/\}$/.test(text)) res.errors.push({ original: text.slice(-12), correction: text.slice(-12) + '.', type: 'punctuation', explain: 'End the line with a full stop.' });
    if (/\}$/.test(text)) res.issues.push({ kind: 'tip', msg: 'Add the full stop after the slot: "…[' + L.SLOT_LABEL[toks[toks.length - 1]] + ']."' });
    res.errors = res.errors.concat(spellErrors(frameText(text)));
    res.issues = res.issues.concat(styleIssues(first || text, comp.id === 'a-topic' || comp.id === 'b-topic'));
    return res;
  }

  /* One variable, in the context of its prompt. */
  function quickVar(key, value, value2, ctx) {
    var res = { blocking: [], issues: [], errors: [], budget: varBudget(ctx.tpl, key) };
    value = String(value || '').trim();
    if (!value) { res.blocking.push('Write something in the slot first.'); return res; }
    if (/\[[^\]]+\]|\{\w+\}/.test(value)) res.blocking.push('Remove the brackets: write the words that go into the slot.');
    res.words = words(value);
    res.budget.ok = res.words >= res.budget.lo && res.words <= res.budget.hi;
    if (res.words > res.budget.hi) res.issues.push({ kind: 'warn', msg: res.words + ' words: longer than the ' + res.budget.lo + '–' + res.budget.hi + ' this slot needs. One idea, said precisely.' });
    if (res.words < res.budget.lo) res.issues.push({ kind: 'warn', msg: res.words + ' words: shorter than the ' + res.budget.lo + '–' + res.budget.hi + ' this slot needs. Your ideas carry the essay: extend it.' });
    var pr = ctx.prompt, run = longestRun(value, pr.text);
    res.copied = run >= 5 || (run >= 4 && run >= res.words * 0.6);
    if (res.copied) res.issues.push({ kind: 'warn', msg: 'Copied from the prompt (' + run + ' words in a row). Examiners discount copied wording: say it in your own words.' });
    var model = ((pr.vars || {})[ctx.tier] || {})[key];
    if (model && similarity(value, model.ok) > 0.85) { res.copied = true; res.issues.push({ kind: 'warn', msg: 'This is the model answer from the bank. Use your own idea.' }); }
    if (key === 'core' && pr.keyNouns && pr.keyNouns.length) {
      var low = value.toLowerCase(), hit = pr.keyNouns.some(function (n) { return low.indexOf(String(n).toLowerCase()) >= 0; });
      if (!hit) res.issues.push({ kind: 'warn', msg: 'None of the prompt\'s key words (' + pr.keyNouns.slice(0, 4).join(', ') + ') is here. Keep the Core Topic anchored to the prompt, or the essay may drift off topic.' });
    }
    slotFormHint(ctx.tpl, key).forEach(function (h) {
      if (/-ing verb/.test(h) && !/^\S*ing\b/i.test(value)) res.issues.push({ kind: 'warn', msg: h });
    });
    if (ctx.needs2) {
      value2 = String(value2 || '').trim();
      if (!value2) res.issues.push({ kind: 'tip', msg: 'Add the reworded second mention for +' + L.POINTS.reworded + ' points (otherwise the same words appear twice).' });
      else if (similarity(value, value2) > 0.7) res.issues.push({ kind: 'warn', msg: 'The second mention repeats most of the same words. Reword it: a synonym, a shell noun ("this policy"), or your Concept Swap alternative.' });
      res.hasSecond = !!value2;
      res.reworded = !!value2 && similarity(value, value2) <= 0.7;
    }
    res.errors = spellErrors(value + (value2 ? ' ' + value2 : ''));
    res.issues = res.issues.concat(styleIssues(value));
    return res;
  }

  /* ============================================================== scoring */
  function scoreOf(q, ai, opts) {
    opts = opts || {};
    var P = L.POINTS, rows = [];
    rows.push(['Submitted', P.submit]);
    var fn = ai && ai.fn ? ai.fn.verdict : null;
    if (fn === 'meets') rows.push(['Does its job', P.functionMet]);
    else if (fn === 'partly') rows.push(['Partly does its job', P.functionPartly]);
    else if (!ai) rows.push(['Job not checked (offline)', q.issues.some(function (i) { return i.kind === 'warn'; }) ? 0 : P.functionPartly]);
    else rows.push(['Does not do its job yet', 0]);
    var errs = mergedErrors(q, ai).length;
    if (ai) rows.push([errs === 0 ? 'No errors' : errs === 1 ? 'One error' : errs + ' errors', errs === 0 ? P.errorFree : errs === 1 ? P.oneError : 0]);
    else rows.push([errs === 0 ? 'No errors found (quick check)' : errs + ' error(s) found', errs === 0 ? Math.round(P.errorFree / 2) : 0]);
    rows.push([q.budget.ok ? 'On word budget' : 'Off word budget', q.budget.ok ? P.budget : 0]);
    rows.push([q.copied ? 'Copied wording' : 'Your own words', q.copied ? 0 : P.ownWords]);
    if (ai && ai.cefr) {
      var ok = cefrIdx(ai.cefr) >= cefrIdx(opts.level);
      rows.push([ok ? 'At your target level (' + ai.cefr + ')' : 'Below target level (' + ai.cefr + ')', ok ? P.level : 0]);
    }
    if (opts.needs2) { var rw = ai && ai.reword ? (ai.reword.ok && q.reworded !== false && q.hasSecond) : q.reworded; rows.push([rw ? 'Second mention reworded' : 'Second mention not reworded', rw ? P.reworded : 0]); }
    if (opts.speed) rows.push(['Speed bonus', opts.speed]);
    var total = rows.reduce(function (s, r) { return s + r[1]; }, 0);
    return { rows: rows, total: total };
  }
  function mergedErrors(q, ai) {
    var list = (ai && ai.errors ? ai.errors : []).slice();
    (q.errors || []).forEach(function (e) {
      var dup = list.some(function (x) { return String(x.original || '').toLowerCase().indexOf(String(e.original).toLowerCase()) >= 0; });
      if (!dup && (!ai || e.type === 'spelling')) list.push(e);
    });
    return list;
  }

  /* ======================================================== lab summary
     A small summary lives on the progress object (synced with everything
     else) so awards and the teacher's roster can see the Lab. */
  function labSummary() {
    var p = host.p; if (!p.lab) p.lab = { points: 0 };
    return p.lab;
  }
  function recompute() {
    var s = labSummary(), pcts = {}, full = {};
    s.templatesComplete = st.data.templates.filter(function (t) { return t.status === 'complete'; }).length;
    s.cleanTemplates = st.data.templates.filter(function (t) { return t.status === 'complete' && L.COMPONENTS.every(function (c) { var b = (t.lines[c.id] || {}).last; return b && b.errors === 0 && b.ai; }); }).length;
    st.data.attempts.forEach(function (a) {
      if (a.status !== 'complete') return;
      var k = String(a.pct), x = pcts[k] || (pcts[k] = { n: 0, best: null, sum: 0, rated: 0 });
      x.n++;
      if (a.full) full[k] = (full[k] || 0) + 1;
      if (a.rating && a.rating.overall != null) { x.rated++; x.sum += a.rating.overall; if (x.best == null || a.rating.overall > x.best) x.best = a.rating.overall; }
    });
    s.pcts = pcts; s.fullPcts = full;
    s.maxVersion = st.data.attempts.reduce(function (m, a) { return Math.max(m, a.version || 1); }, 0);
    s.runs = st.data.attempts.filter(function (a) { return a.status === 'complete'; }).length;
    var best = null; Object.keys(pcts).forEach(function (k) { if (pcts[k].best != null && (best == null || pcts[k].best > best)) best = pcts[k].best; });
    s.bestBand = best;
    return s;
  }
  function labRank(points) {
    var r = L.RANKS[0], next = null;
    L.RANKS.forEach(function (x, i) { if (points >= x.min) { r = x; next = L.RANKS[i + 1] || null; } });
    return { rank: r, next: next };
  }
  /* Points go to the Lab tally and a quarter of them to the app's XP. */
  function award(points) {
    if (!points) return;
    var s = labSummary(), p = host.p;
    s.points = (s.points || 0) + points;
    p.xp = (p.xp || 0) + Math.round(points / 4);
    floatPoints(points);
    paintChip();
    if (host.paintHeader) host.paintHeader();
    if (host.syncSoon) host.syncSoon();
  }
  function afterMilestone() {
    recompute();
    var earned = global.Engine.Progress.checkBadges(host.p);
    if (host.sync) host.sync();
    if (earned.length && host.celebrate) setTimeout(function () { host.celebrate(earned[0], earned.slice(1)); }, 700);
  }
  function toast(msg) { if (host && host.toast) host.toast(msg); }
  function floatPoints(n) {
    var chip = $('#lab-chip-pts'); if (!chip) return;
    var f = document.createElement('span'); f.className = 'lab-float'; f.textContent = '+' + n;
    chip.parentNode.appendChild(f); setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 1300);
  }
  function paintChip() {
    var s = labSummary(), r = labRank(s.points || 0);
    var a = $('#lab-chip-pts'), b = $('#lab-chip-rank');
    if (a) a.textContent = s.points || 0;
    if (b) b.textContent = r.rank.name;
  }

  /* ================================================================ shell */
  function paint() {
    if (!root) return;
    var s = labSummary(), r = labRank(s.points || 0);
    var aiCls = st.ai == null ? '' : st.ai ? ' good' : ' bad';
    var aiTxt = st.ai == null ? 'Checking the coach…' : st.aiNote;
    root.innerHTML =
      '<div class="lab">' +
      '<div class="sect-h"><div><h2>Template Lab</h2><p>Build a Task 2 template in your own words, one line at a time, then test it on real prompts. Every line and every variable is coached, scored and saved to your ID.</p></div></div>' +
      '<div class="lab-top"><div class="tabs lab-tabs">' +
        [['studio', 'Blueprint Studio'], ['assembly', 'Assembly Line'], ['score', 'Scorecard']].map(function (t) { return '<button class="tab' + (st.tab === t[0] ? ' on' : '') + '" data-ltab="' + t[0] + '">' + t[1] + '</button>'; }).join('') +
      '</div><div class="lab-chips"><div class="chip lab-chipwrap"><b id="lab-chip-pts" class="lab-num">' + (s.points || 0) + '</b><span>Lab points</span></div><div class="chip"><b id="lab-chip-rank">' + esc(r.rank.name) + '</b><span>Lab rank</span></div></div></div>' +
      '<p class="lab-ai"><span class="pill' + aiCls + '">' + esc(aiTxt) + '</span>' + (Object.keys(st.data.dirty || {}).length ? ' <span class="pill gold">' + Object.keys(st.data.dirty).length + ' waiting to sync</span>' : '') + '</p>' +
      '<div id="lab-body"></div></div>';
    $$('[data-ltab]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (st.run && !st.run.done) pauseClock();
        st.tab = b.dataset.ltab;
        if (st.tab === 'studio' && st.view !== 'build' && st.view !== 'setup' && st.view !== 'summary') st.view = 'home';
        if (st.tab === 'score') { st.view = 'home'; st.review = null; }
        paint();
      });
    });
    paintBody();
  }
  function body() { return $('#lab-body'); }
  function paintBody() {
    var el = body(); if (!el) return;
    if (st.tab === 'studio') {
      if (st.view === 'setup') return paintSetup(el);
      if (st.view === 'build' && st.build) return paintBuild(el);
      if (st.view === 'summary' && st.build) return paintSummary(el);
      return paintStudio(el);
    }
    if (st.tab === 'assembly') {
      if (st.run && !st.run.done) return paintRun(el);
      if (st.run && st.run.done) return paintFinish(el);
      return paintAsmHome(el);
    }
    if (st.review) return paintReview(el);
    return paintScore(el);
  }
  function scrollTop() { try { root.scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); } catch (e) {} }

  /* ======================================================= BLUEPRINT STUDIO */
  function tplScore(t) { return L.COMPONENTS.reduce(function (s, c) { var ln = t.lines[c.id]; return s + (ln && ln.last ? ln.last.points : 0); }, 0); }
  function tplDone(t) { return L.COMPONENTS.filter(function (c) { var ln = t.lines[c.id]; return ln && ln.text && ln.last; }).length; }
  function completeTemplates() { return st.data.templates.filter(function (t) { return t.status === 'complete'; }).sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); }); }

  function paintStudio(el) {
    var list = st.data.templates.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    var html = '<div class="lab-hero card"><div><p class="kicker">Blueprint Studio</p><h3>Your template, in your words</h3>' +
      '<ol class="lab-steps"><li><b>Choose the share</b> of the essay your template will carry: 60, 50, 40 or 30%.</li><li><b>Choose your target</b> level and band.</li><li><b>Rewrite 14 lines</b>, each with a job to do. Study the examples, then write your own, and the coach checks each one.</li><li><b>Save it</b>, then take it to the Assembly Line.</li></ol></div>' +
      '<button class="btn primary" id="lab-new">New blueprint →</button></div>';
    if (!list.length) html += '<p class="tiny lab-empty">No blueprints yet. Your first one takes about 30–40 minutes: fourteen short lines, each coached.</p>';
    else html += '<div class="lab-grid">' + list.map(function (t) {
      var lv = levelInfo(t.level), done = tplDone(t), score = tplScore(t);
      return '<div class="card lab-tcard' + (t.status === 'complete' ? ' done' : '') + '">' +
        '<div class="lab-tcard-h"><b>' + esc(t.name) + '</b><span class="pill">v' + (t.version || 1) + '</span></div>' +
        '<div class="lab-pills"><span class="pill gold">' + t.pct + '% template</span><span class="pill">' + esc(lv.name) + '</span>' +
        (t.status === 'complete' ? '<span class="pill good">Complete · ' + Math.round(score / (L.COMPONENTS.length * L.POINTS.lineMax) * 100) + '% blueprint score</span>' : '<span class="pill">Draft · ' + done + '/14 lines</span>') + '</div>' +
        '<p class="tiny">' + templateFrameWords(t) + ' template words · updated ' + esc(fmtDate(t.updatedAt)) + '</p>' +
        '<div class="lab-acts">' + (t.status === 'complete'
          ? '<button class="btn sm" data-topen="' + t.id + '">View</button><button class="btn sm" data-tver="' + t.id + '">New version</button><button class="btn sm" data-tuse="' + t.id + '">Use on a prompt →</button><button class="btn sm ghost" data-twriter="' + t.id + '">Use in Writer</button>'
          : '<button class="btn sm primary" data-tcont="' + t.id + '">Continue</button><button class="btn sm ghost" data-tdel="' + t.id + '">Delete draft</button>') + '</div></div>';
    }).join('') + '</div>';
    el.innerHTML = html;
    $('#lab-new').addEventListener('click', function () { st.setup = { pct: 40, level: host.tier ? (host.tier() === 'C1' ? 'C1' : 'B2') : 'B2', name: '' }; st.view = 'setup'; paintBody(); scrollTop(); });
    $$('[data-tcont]').forEach(function (b) { b.addEventListener('click', function () { openBuild(getTpl(b.dataset.tcont)); }); });
    $$('[data-topen]').forEach(function (b) { b.addEventListener('click', function () { st.build = { tpl: getTpl(b.dataset.topen), idx: 0, readOnly: true }; st.view = 'summary'; paintBody(); scrollTop(); }); });
    $$('[data-tver]').forEach(function (b) { b.addEventListener('click', function () { newVersion(getTpl(b.dataset.tver)); }); });
    $$('[data-tuse]').forEach(function (b) { b.addEventListener('click', function () { st.asmTemplate = b.dataset.tuse; st.tab = 'assembly'; st.run = null; paint(); scrollTop(); }); });
    $$('[data-twriter]').forEach(function (b) { b.addEventListener('click', function () { useInWriter(getTpl(b.dataset.twriter)); }); });
    $$('[data-tdel]').forEach(function (b) { b.addEventListener('click', function () {
      if (!confirm('Delete this draft blueprint? This cannot be undone.')) return;
      st.data.templates = st.data.templates.filter(function (t) { return t.id !== b.dataset.tdel; });
      delete st.data.dirty[b.dataset.tdel]; persist();
      server('lab.deleteTemplate', { id: b.dataset.tdel }, TIMEOUT_SAVE).catch(function () {});
      paintBody();
    }); });
  }
  function getTpl(id) { return st.data.templates.filter(function (t) { return t.id === id; })[0]; }

  function paintSetup(el) {
    var s = st.setup, lv = levelInfo(s.level);
    var fw = frameBudget(s.pct), own = L.ESSAY_WORDS - fw;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-cancel">← Blueprints</button></div>' +
      '<div class="card lab-pad"><p class="kicker">Step 1 · Template share</p><h3>How much of the essay should your template carry?</h3>' +
      '<div class="lab-pcts">' + L.PCTS.map(function (o) {
        return '<label class="lab-pct' + (s.pct === o.pct ? ' on' : '') + '"><input type="radio" name="lab-pct" value="' + o.pct + '"' + (s.pct === o.pct ? ' checked' : '') + '>' +
          '<span class="lab-pct-n">' + o.pct + '%</span><span class="lab-pct-t"><b>' + esc(o.name) + '</b><span>' + esc(o.blurb) + '</span><span class="tiny">' + esc(o.research) + '</span><span class="pill">' + esc(o.suits) + '</span></span></label>';
      }).join('') + '</div>' +
      '<div class="lab-split"><div class="lab-split-bar"><span class="f" style="width:' + s.pct + '%"></span><span class="o" style="width:' + (100 - s.pct) + '%"></span></div>' +
      '<p class="tiny"><b>' + fw + '</b> template words + <b>' + own + '</b> words of your own ideas ≈ a ' + L.ESSAY_WORDS + '-word essay. Research on memorised IELTS scripts proposes at least 50% self-written language for Band 7 and 59% for Band 8 (Wray &amp; Pegg, 2009).</p></div></div>' +
      '<div class="card lab-pad"><p class="kicker">Step 2 · Target level</p><h3>Which level are you writing at?</h3><p class="tiny">Your template and your variables should be at the same level. A C1 frame around B1 ideas is the exact pattern examiners notice.</p>' +
      '<div class="filters lab-levels">' + L.LEVELS.map(function (l) { return '<button data-lv="' + l.id + '"' + (s.level === l.id ? ' class="on"' : '') + '>' + esc(l.name) + '</button>'; }).join('') + '</div><p class="tiny">' + esc(lv.note) + '</p></div>' +
      '<div class="card lab-pad"><p class="kicker">Step 3 · Name</p><div class="field"><label for="lab-name">Blueprint name</label><input type="text" id="lab-name" maxlength="48" value="' + esc(s.name || (lv.id + ' frame · ' + s.pct + '%')) + '"></div></div>' +
      '<p class="lab-cta"><button class="btn primary" id="lab-startbuild">Start building: 14 lines →</button></p>';
    el.innerHTML = html;
    $('#lab-cancel').addEventListener('click', function () { st.view = 'home'; paintBody(); });
    $$('input[name=lab-pct]').forEach(function (r) { r.addEventListener('change', function () { s.pct = +r.value; s.name = ''; paintSetup(el); }); });
    $$('[data-lv]').forEach(function (b) { b.addEventListener('click', function () { s.level = b.dataset.lv; s.name = ''; paintSetup(el); }); });
    $('#lab-name').addEventListener('input', function () { s.name = this.value; });
    $('#lab-startbuild').addEventListener('click', function () {
      var t = { id: uid('T'), studentId: st.sid, name: (s.name || $('#lab-name').value || 'My blueprint').trim(), version: 1, parentId: '', rootId: '',
        pct: s.pct, level: s.level, status: 'draft', lines: {}, slotNotes: {}, createdAt: nowIso(), updatedAt: nowIso() };
      t.rootId = t.id;
      saveItem('template', t);
      openBuild(t);
    });
  }

  function openBuild(t, idx) {
    if (idx == null) { idx = 0; for (var i = 0; i < L.COMPONENTS.length; i++) { var ln = t.lines[L.COMPONENTS[i].id]; if (!ln || !ln.last) { idx = i; break; } if (i === L.COMPONENTS.length - 1) idx = i; } }
    st.build = { tpl: t, idx: idx, fb: null, busy: false };
    st.tab = 'studio'; st.view = 'build';
    paint(); scrollTop();
  }
  function newVersion(src) {
    var t = clone(src);
    t.id = uid('T'); t.version = (src.version || 1) + 1; t.parentId = src.id; t.rootId = src.rootId || src.id;
    t.status = 'draft'; t.createdAt = nowIso(); t.updatedAt = nowIso(); t.completedAt = '';
    L.COMPONENTS.forEach(function (c) { var ln = t.lines[c.id]; if (ln) { ln.base = ln.last ? ln.last.points : 0; ln.tries = 0; ln.bestPts = ln.base; } });
    saveItem('template', t);
    toast('Version ' + t.version + ' started. Points come from improving on version ' + src.version + '.');
    openBuild(t, 0);
  }
  function useInWriter(t) {
    var custom = {};
    L.PARAS.forEach(function (pg) {
      custom[pg.key] = L.COMPONENTS.filter(function (c) { return c.para === pg.key; }).map(function (c) { return (t.lines[c.id] || {}).text || ''; }).join(' ').trim();
    });
    T.save(st.sid, { tier: tierOf(t.level), choice: {}, custom: custom, fromLab: t.id });
    if (host.p) host.p.tier = tierOf(t.level);
    toast('"' + t.name + '" is now your template in the Writer (' + tierOf(t.level) + ' track).');
  }

  /* ------------------------------------------------------------- builder */
  function paintBuild(el) {
    var b = st.build, t = b.tpl, comp = L.COMPONENTS[b.idx], ln = t.lines[comp.id] || {}, lv = levelInfo(t.level), tier = lv.tier;
    var budget = compBudget(t.pct, comp.id), para = L.PARAS.filter(function (p) { return p.key === comp.para; })[0];
    var draft = ln.draft != null ? ln.draft : toLabels(ln.text || '');
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-bhome">← Blueprints</button><span class="tiny">' + esc(t.name) + ' · v' + (t.version || 1) + ' · ' + t.pct + '% · ' + esc(lv.name) + '</span></div>';
    html += '<div class="lab-rail">' + L.PARAS.map(function (pg) {
      return '<div class="lab-rail-g"><span class="kicker">' + esc(pg.name.replace('Body paragraph', 'Body')) + '</span><div>' + L.COMPONENTS.filter(function (c) { return c.para === pg.key; }).map(function (c) {
        var l = t.lines[c.id], cls = c.n - 1 === b.idx ? ' cur' : (l && l.last ? (l.last.errors === 0 && l.last.fnv === 'meets' ? ' ok' : ' done') : '');
        return '<button class="lab-dot' + cls + '" data-go="' + (c.n - 1) + '" title="' + esc(c.n + '. ' + c.name) + '">' + c.n + '</button>';
      }).join('') + '</div></div>';
    }).join('') + '</div>';
    html += '<div class="card lab-comp">' +
      '<p class="kicker">' + esc(para.name) + ' · line ' + comp.n + ' of ' + L.COMPONENTS.length + '</p>' +
      '<h3>' + esc(comp.name) + '</h3>' +
      '<p class="lab-fn">' + esc(comp.fn) + '</p>' +
      '<div class="lab-why"><div class="lab-pills">' + comp.crit.map(function (k) { return '<span class="pill on">' + k + '</span>'; }).join('') + '<span class="pill gold">≈ ' + budget.target + ' template words (' + budget.lo + '–' + budget.hi + ')</span></div><p>' + esc(comp.why) + '</p><p class="tiny"><b>Watch out:</b> ' + esc(comp.tip) + '</p></div>' +
      '<div class="lab-ex"><div class="lab-ex-h"><b>Study these, then write your own</b><button class="linky" id="lab-othertier">' + (st.showOtherTier ? 'Hide' : 'Show') + ' the ' + (tier === 'C1' ? 'B2' : 'C1') + ' versions</button></div>' +
        comp.examples[tier].map(function (e) { return '<div class="lab-exrow">' + slotChips(e) + '</div>'; }).join('') +
        (st.showOtherTier ? '<p class="kicker" style="margin-top:8px">' + (tier === 'C1' ? 'B2' : 'C1') + '</p>' + comp.examples[tier === 'C1' ? 'B2' : 'C1'].map(function (e) { return '<div class="lab-exrow alt">' + slotChips(e) + '</div>'; }).join('') : '') +
      '</div>' +
      '<div class="lab-write"><div class="lab-slotbtns"><span class="tiny">Insert:</span>' + comp.slots.map(function (k) { return '<button class="lab-slotbtn" data-ins="' + k + '">[' + esc(L.SLOT_LABEL[k]) + ']</button>'; }).join('') + '</div>' +
        '<label class="sr" for="lab-line">Your line</label><textarea id="lab-line" rows="3" spellcheck="true" placeholder="Write the line in your own words and include ' + comp.slots.map(function (k) { return '[' + L.SLOT_LABEL[k] + ']'; }).join(' and ') + '">' + esc(draft) + '</textarea>' +
        '<div class="lab-meter"><span id="lab-wc" class="lab-num">0 words</span><div class="bar-line thin"><span id="lab-wbar"></span></div></div>' +
        '<div class="lab-preview" id="lab-preview"></div>' +
      '</div>' +
      '<div class="lab-acts"><button class="btn primary" id="lab-coach"' + (b.busy ? ' disabled' : '') + '>' + (ln.tries ? 'Coach me again' : 'Coach me') + '</button><span class="tiny" id="lab-tries">' + (ln.tries ? 'Try ' + (ln.tries + 1) + ' · best so far ' + (ln.bestPts || 0) + ' pts' : '') + '</span></div>' +
      '<div id="lab-fb">' + (b.fb ? renderFeedback(b.fb, { kind: 'frame' }) : (ln.last ? '<p class="kicker">Last coaching</p>' + renderFeedback(ln.last, { kind: 'frame', stored: true }) : '')) + '</div>' +
    '</div>';
    html += '<div class="lab-nav"><button class="btn" id="lab-prev"' + (b.idx === 0 ? ' disabled' : '') + '>← Previous line</button><button class="btn ghost" id="lab-savedraft">Save draft</button>' +
      (b.idx < L.COMPONENTS.length - 1 ? '<button class="btn primary" id="lab-next"' + (ln.last ? '' : ' disabled title="Get coaching on this line first"') + '>Next line →</button>'
        : '<button class="btn primary" id="lab-finishbp"' + (tplDone(t) === L.COMPONENTS.length ? '' : ' disabled title="Every line needs coaching first"') + '>Review the blueprint →</button>') + '</div>';
    el.innerHTML = html;

    var ta = $('#lab-line');
    function live() {
      var conv = toTokens(ta.value), n = frameWords(conv.text);
      $('#lab-wc').textContent = n + ' template word' + (n === 1 ? '' : 's') + ' · target ' + budget.lo + '–' + budget.hi;
      var pctW = Math.min(100, Math.round(n / budget.hi * 100));
      $('#lab-wbar').style.width = pctW + '%';
      $('#lab-wbar').parentNode.className = 'bar-line thin' + (n > budget.hi ? ' over' : n >= budget.lo ? '' : ' gold');
      $('#lab-preview').innerHTML = ta.value.trim() ? slotChips(conv.text) : '<span class="tiny">Your line will appear here with its slots highlighted.</span>';
      ln.draft = ta.value;
    }
    ta.addEventListener('input', live); live();
    $$('[data-ins]').forEach(function (btn) { btn.addEventListener('click', function () { insertAtCursor(ta, '[' + L.SLOT_LABEL[btn.dataset.ins] + ']'); live(); }); });
    $('#lab-othertier').addEventListener('click', function () { st.showOtherTier = !st.showOtherTier; paintBuild(el); });
    $('#lab-bhome').addEventListener('click', function () { keepDraft(); st.view = 'home'; st.build = null; paintBody(); });
    $$('[data-go]').forEach(function (d) { d.addEventListener('click', function () { keepDraft(); b.idx = +d.dataset.go; b.fb = null; paintBuild(el); }); });
    $('#lab-prev').addEventListener('click', function () { keepDraft(); b.idx--; b.fb = null; paintBuild(el); scrollTop(); });
    var nx = $('#lab-next'); if (nx) nx.addEventListener('click', function () { keepDraft(); b.idx++; b.fb = null; paintBuild(el); scrollTop(); });
    var fin = $('#lab-finishbp'); if (fin) fin.addEventListener('click', function () { keepDraft(); st.view = 'summary'; paintBody(); scrollTop(); });
    $('#lab-savedraft').addEventListener('click', function () { keepDraft(); saveItem('template', t).then(function (ok) { toast(savedMsg(ok, 'Draft saved')); }); });
    $('#lab-coach').addEventListener('click', function () { coachLine(); });
    function keepDraft() { ln.draft = ta.value; t.lines[comp.id] = ln; persist(); }
  }
  function insertAtCursor(ta, txt) {
    var s = ta.selectionStart || 0, e = ta.selectionEnd || 0, v = ta.value;
    var pre = v.slice(0, s), post = v.slice(e);
    if (pre && !/\s$/.test(pre)) txt = ' ' + txt;
    if (post && !/^[\s.,;:]/.test(post)) txt = txt + ' ';
    ta.value = pre + txt + post;
    var pos = (pre + txt).length; ta.focus(); try { ta.setSelectionRange(pos, pos); } catch (err) {}
  }

  function coachLine() {
    var b = st.build, t = b.tpl, comp = L.COMPONENTS[b.idx], ln = t.lines[comp.id] || (t.lines[comp.id] = {});
    var raw = $('#lab-line').value, q = quickFrame(comp, raw, t.pct);
    if (q.blocking.length) { b.fb = { blocking: q.blocking }; $('#lab-fb').innerHTML = renderFeedback(b.fb, { kind: 'frame' }); return; }
    b.busy = true; $('#lab-coach').disabled = true; $('#lab-fb').innerHTML = coachWaiting();
    var lv = levelInfo(t.level);
    var ask = st.ai === false ? Promise.reject(new Error('offline')) : server('lab.coach', {
      kind: 'frame', level: lv.id, band: lv.band, pct: t.pct,
      component: { id: comp.id, name: comp.name, fn: comp.fn, why: comp.why, slots: comp.slots.map(function (k) { return L.SLOT_LABEL[k]; }), paragraph: comp.para },
      line: toLabels(q.text), words: q.words, budget: { lo: q.budget.lo, hi: q.budget.hi },
      context: L.COMPONENTS.filter(function (c) { return c.para === comp.para && c.id !== comp.id && t.lines[c.id] && t.lines[c.id].text; }).map(function (c) { return toLabels(t.lines[c.id].text); })
    }, TIMEOUT_COACH).then(function (r) { return r.coach; });
    ask.catch(function (e) { st.lastAiError = String(e && e.message || e); return null; }).then(function (ai) {
      b.busy = false;
      var sc = scoreOf(q, ai, { level: lv.id });
      var fb = compactFb(q, ai, sc);
      ln.text = q.text; ln.draft = toLabels(q.text); ln.tries = (ln.tries || 0) + 1; ln.last = fb;
      var floor = Math.max(ln.bestPts || 0, ln.base || 0);
      var gain = Math.max(0, sc.total - floor);
      fb.gain = gain; fb.improved = ln.tries > 1 && sc.total > (ln.bestPts || 0);
      ln.bestPts = Math.max(ln.bestPts || 0, sc.total);
      if (ai && ai.slotForm && comp.slots.length === 1) t.slotNotes[comp.slots[0]] = String(ai.slotForm).slice(0, 180);
      t.lines[comp.id] = ln;
      b.fb = fb;
      saveItem('template', t);
      award(gain);
      paintBuild(body());
      var fbEl = $('#lab-fb'); if (fbEl) try { fbEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e2) {}
    });
  }
  function coachWaiting() { return '<div class="lab-wait"><span class="lab-spin"></span> The coach is reading your line…</div>'; }

  /* Keep feedback small enough to store with the template / attempt. */
  function compactFb(q, ai, sc) {
    var errs = mergedErrors(q, ai).slice(0, 8).map(function (e) { return { original: String(e.original || '').slice(0, 80), correction: String(e.correction || '').slice(0, 80), type: e.type || '', explain: String(e.explain || '').slice(0, 160) }; });
    return {
      ai: !!ai, points: sc.total, rows: sc.rows, errors: errs.length, errorList: errs,
      fnv: ai && ai.fn ? ai.fn.verdict : '', fnc: ai && ai.fn ? String(ai.fn.comment || '').slice(0, 300) : '',
      cefr: ai ? ai.cefr || '' : '', band: ai && ai.band != null ? ai.band : null,
      tip: ai ? String(ai.tip || '').slice(0, 300) : '', praise: ai ? String(ai.praise || '').slice(0, 240) : '',
      generic: ai && ai.generic ? { ok: !!ai.generic.ok, note: String(ai.generic.note || '').slice(0, 200) } : null,
      relevance: ai && ai.relevance ? { ok: !!ai.relevance.ok, note: String(ai.relevance.note || '').slice(0, 200) } : null,
      fit: ai && ai.fit ? { ok: !!ai.fit.ok, note: String(ai.fit.note || '').slice(0, 200) } : null,
      reword: ai && ai.reword ? { ok: !!ai.reword.ok, note: String(ai.reword.note || '').slice(0, 200) } : null,
      slotForm: ai && ai.slotForm ? String(ai.slotForm).slice(0, 180) : '',
      words: q.words, budget: { lo: q.budget.lo, hi: q.budget.hi, ok: q.budget.ok }, copied: !!q.copied,
      issues: (q.issues || []).map(function (i) { return { kind: i.kind, msg: String(i.msg).slice(0, 240) }; }).slice(0, 8),
      offlineWhy: ai ? '' : (st.ai === false ? st.aiNote : 'The coach could not be reached this time, so only the quick check ran.'),
      ts: nowIso()
    };
  }

  function renderFeedback(fb, opts) {
    opts = opts || {};
    if (fb.blocking) return '<div class="lab-fb bad"><b>Fix this first</b><ul>' + fb.blocking.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul></div>';
    var target = opts.level ? cefrIdx(opts.level) : -1;
    var html = '<div class="lab-fb">';
    html += '<div class="lab-fb-top"><div class="lab-score"><b class="lab-num">' + fb.points + '</b><span>pts</span></div><div class="lab-fb-rows">' +
      (fb.rows || []).map(function (r) { return '<span class="lab-row' + (r[1] > 0 ? ' plus' : '') + '">' + esc(r[0]) + ' <i>' + (r[1] > 0 ? '+' + r[1] : '0') + '</i></span>'; }).join('') + '</div></div>';
    if (!opts.stored && fb.gain != null) html += '<p class="lab-gain">' + (fb.gain > 0 ? '+' + fb.gain + ' Lab points' + (fb.improved ? ': better than your last try' : '') : 'No new points: beat your best on this ' + (opts.kind === 'frame' ? 'line' : 'slot') + ' to earn more.') + '</p>';
    if (!fb.ai) html += '<p class="lab-offline">Quick check only. ' + esc(fb.offlineWhy || '') + '</p>';
    var chips = [];
    if (fb.cefr) chips.push('<span class="pill ' + (target >= 0 && cefrIdx(fb.cefr) < target ? 'bad' : 'good') + '">CEFR ' + esc(fb.cefr) + '</span>');
    if (fb.band != null) chips.push('<span class="pill">≈ Band ' + fmtBand(fb.band) + ' language</span>');
    chips.push('<span class="pill ' + (fb.budget && fb.budget.ok ? 'good' : 'gold') + '">' + fb.words + ' ' + (opts.kind === 'frame' ? 'template ' : '') + 'words · target ' + (fb.budget ? fb.budget.lo + '–' + fb.budget.hi : '') + '</span>');
    if (fb.fnv) chips.push('<span class="pill ' + (fb.fnv === 'meets' ? 'good' : fb.fnv === 'partly' ? 'gold' : 'bad') + '">' + (opts.kind === 'frame' ? 'Job' : 'Concept') + ': ' + (fb.fnv === 'meets' ? 'covered' : fb.fnv === 'partly' ? 'partly covered' : 'not yet') + '</span>');
    html += '<div class="lab-pills">' + chips.join('') + '</div>';
    if (fb.fnc) html += '<p class="lab-fn-c"><b>' + (opts.kind === 'frame' ? 'Does the line do its job?' : 'Does it do its job for this prompt?') + '</b> ' + esc(fb.fnc) + '</p>';
    if (fb.errorList && fb.errorList.length) html += '<div class="lab-errs"><b>' + fb.errorList.length + ' to fix</b>' + fb.errorList.map(function (e) {
      return '<div class="lab-err"><span class="pill bad">' + esc(e.type || 'error') + '</span> <s>' + esc(e.original) + '</s> → <b>' + esc(e.correction) + '</b>' + (e.explain ? '<span class="tiny"> ' + esc(e.explain) + '</span>' : '') + '</div>';
    }).join('') + '</div>';
    else html += '<p class="lab-ok">' + (fb.ai ? 'No spelling, grammar or punctuation errors.' : 'No errors found by the quick check.') + '</p>';
    var notes = [];
    if (fb.generic && !fb.generic.ok) notes.push({ kind: 'warn', msg: 'Not reusable yet: ' + fb.generic.note });
    if (fb.relevance && !fb.relevance.ok) notes.push({ kind: 'warn', msg: 'Relevance: ' + fb.relevance.note });
    if (fb.fit && !fb.fit.ok) notes.push({ kind: 'warn', msg: 'Fit with your frame: ' + fb.fit.note });
    if (fb.reword && !fb.reword.ok && fb.reword.note) notes.push({ kind: 'warn', msg: 'Second mention: ' + fb.reword.note });
    notes = notes.concat(fb.issues || []);
    if (fb.slotForm) notes.push({ kind: 'tip', msg: (opts.kind === 'frame' ? 'When you fill it: ' : '') + fb.slotForm });
    if (notes.length) html += '<ul class="lab-notes">' + notes.map(function (n) { return '<li class="' + n.kind + '">' + esc(n.msg) + '</li>'; }).join('') + '</ul>';
    if (fb.praise) html += '<p class="lab-praise"><b>Well done:</b> ' + esc(fb.praise) + '</p>';
    if (fb.tip) html += '<p class="lab-tip"><b>Next step:</b> ' + esc(fb.tip) + '</p>';
    html += '</div>';
    return html;
  }

  /* ------------------------------------------------------------ summary */
  function paintSummary(el) {
    var b = st.build, t = b.tpl, lv = levelInfo(t.level), score = tplScore(t), max = L.COMPONENTS.length * L.POINTS.lineMax;
    var fw = templateFrameWords(t), clean = L.COMPONENTS.filter(function (c) { var l = t.lines[c.id]; return l && l.last && l.last.errors === 0; }).length;
    var predicted = fw / L.ESSAY_WORDS;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-shome">← Blueprints</button></div>';
    html += '<div class="card lab-pad"><p class="kicker">' + (t.status === 'complete' ? 'Blueprint' : 'Review before saving') + ' · v' + (t.version || 1) + '</p><h3>' + esc(t.name) + '</h3>' +
      '<div class="lab-kpis">' +
        kpi(Math.round(score / max * 100) + '%', 'Blueprint score', score + ' / ' + max + ' pts') +
        kpi(fw, 'Template words', 'budget ≈ ' + frameBudget(t.pct)) +
        kpi(pctStr(predicted), 'Predicted template share', 'in a ' + L.ESSAY_WORDS + '-word essay (target ' + t.pct + '%)') +
        kpi(clean + '/14', 'Error-free lines', esc(lv.name)) +
      '</div></div>';
    html += L.PARAS.map(function (pg) {
      return '<div class="card lab-para"><p class="kicker">' + esc(pg.name) + '</p>' + L.COMPONENTS.filter(function (c) { return c.para === pg.key; }).map(function (c) {
        var l = t.lines[c.id] || {}, f = l.last;
        return '<div class="lab-sline"><div class="lab-sline-t">' + (l.text ? slotChips(l.text) : '<span class="tiny">(empty)</span>') + '</div><div class="lab-sline-m"><span class="tiny">' + c.n + '. ' + esc(c.name) + '</span>' +
          (f ? '<span class="pill ' + (f.errors === 0 ? 'good' : 'bad') + '">' + (f.errors === 0 ? 'no errors' : f.errors + ' error' + (f.errors > 1 ? 's' : '')) + '</span>' + (f.cefr ? '<span class="pill">' + esc(f.cefr) + '</span>' : '') + '<span class="pill gold">' + f.points + ' pts</span>' : '') +
          (!b.readOnly ? '<button class="linky" data-edit="' + (c.n - 1) + '">edit</button>' : '') + '</div></div>';
      }).join('') + '</div>';
    }).join('');
    if (t.status === 'complete') {
      html += '<div class="lab-nav"><button class="btn" id="lab-sver">New version</button><button class="btn ghost" id="lab-swriter">Use in Writer</button><button class="btn primary" id="lab-suse">Use on a prompt →</button></div>';
    } else {
      html += '<div class="lab-nav"><button class="btn" id="lab-sback">← Back to line 14</button><button class="btn primary" id="lab-save"' + (tplDone(t) === 14 ? '' : ' disabled') + '>Save blueprint (+' + L.POINTS.blueprint + ')</button></div>';
    }
    el.innerHTML = html;
    $('#lab-shome').addEventListener('click', function () { st.view = 'home'; st.build = null; paintBody(); });
    $$('[data-edit]').forEach(function (x) { x.addEventListener('click', function () { openBuild(t, +x.dataset.edit); }); });
    var sv = $('#lab-save');
    if (sv) sv.addEventListener('click', function () {
      t.status = 'complete'; t.completedAt = nowIso(); t.score = tplScore(t); t.frameWords = templateFrameWords(t);
      var parent = t.parentId ? getTpl(t.parentId) : null;
      var bonus = !parent || t.score > (parent.score || tplScore(parent)) ? L.POINTS.blueprint : 0;
      saveItem('template', t).then(function (ok) { toast(savedMsg(ok, 'Blueprint saved')); });
      award(bonus);
      if (parent && !bonus) toast('Saved. No bonus this time: a new version earns it by scoring higher than version ' + parent.version + '.');
      afterMilestone();
      st.build.readOnly = true;
      paintSummary(el);
    });
    var sb = $('#lab-sback'); if (sb) sb.addEventListener('click', function () { openBuild(t, 13); });
    var vr = $('#lab-sver'); if (vr) vr.addEventListener('click', function () { newVersion(t); });
    var wr = $('#lab-swriter'); if (wr) wr.addEventListener('click', function () { useInWriter(t); });
    var us = $('#lab-suse'); if (us) us.addEventListener('click', function () { st.asmTemplate = t.id; st.tab = 'assembly'; st.run = null; paint(); scrollTop(); });
  }
  function kpi(v, label, sub) { return '<div class="lab-kpi"><b class="lab-num">' + v + '</b><span>' + esc(label) + '</span>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>'; }

  /* ========================================================= ASSEMBLY LINE */
  function slotOrder(tpl) {
    var order = [];
    L.COMPONENTS.forEach(function (c) { tokensIn((tpl.lines[c.id] || {}).text || '').forEach(function (k) { if (order.indexOf(k) < 0) order.push(k); }); });
    return order;
  }
  function labelsFor(type) {
    var lab = extend({}, L.SLOT_LABEL), pb = (T.PLAYBOOKS[type] || {}).labels || {};
    Object.keys(pb).forEach(function (k) { lab[k] = pb[k]; });
    return lab;
  }
  function fitPill(type) {
    var f = L.TYPE_FIT[type];
    return f === 'good' ? '<span class="pill good">fits the frame</span>' : f === 'ok' ? '<span class="pill">needs a clear stance</span>' : '<span class="pill bad">harder fit: relabelled slots</span>';
  }

  function paintAsmHome(el) {
    var tpls = completeTemplates();
    if (!tpls.length) {
      el.innerHTML = '<div class="card lab-pad lab-emptycard"><p class="kicker">Assembly Line</p><h3>Build a blueprint first</h3><p>The Assembly Line fills your own template with ideas for a real prompt. Save a complete blueprint in the Blueprint Studio, then come back.</p><button class="btn primary" id="lab-gostudio">Open Blueprint Studio →</button></div>' + draftRunsHtml();
      $('#lab-gostudio').addEventListener('click', function () { st.tab = 'studio'; st.view = 'home'; paint(); });
      bindDraftRuns();
      return;
    }
    if (!st.asmTemplate || !getTpl(st.asmTemplate) || getTpl(st.asmTemplate).status !== 'complete') st.asmTemplate = tpls[0].id;
    var t = getTpl(st.asmTemplate), lv = levelInfo(t.level);
    var done = {}; st.data.attempts.forEach(function (a) { if (a.status === 'complete') done[a.promptId] = (done[a.promptId] || 0) + 1; });
    var types = ['all'].concat(Object.keys(C.TYPES));
    var list = C.PROMPTS.filter(function (pr) { return st.filters.type === 'all' || pr.type === st.filters.type; });
    var html = draftRunsHtml();
    html += '<div class="card lab-pad"><p class="kicker">Step 1 · Your blueprint</p><div class="lab-row2"><select id="lab-tsel" class="lab-select">' + tpls.map(function (x) {
      return '<option value="' + x.id + '"' + (x.id === t.id ? ' selected' : '') + '>' + esc(x.name) + ' · v' + (x.version || 1) + ' · ' + x.pct + '% · ' + esc(levelInfo(x.level).id) + '</option>';
    }).join('') + '</select><span class="pill gold">' + t.pct + '% template</span><span class="pill">' + esc(lv.name) + '</span></div>' +
      '<p class="tiny">Your target is built into the blueprint: the coach checks every variable against ' + esc(lv.name) + '.</p></div>';
    html += '<div class="card lab-pad"><p class="kicker">Step 2 · Timing</p><div class="lab-timings">' + L.TIMINGS.map(function (o) {
      return '<label class="lab-timing' + (st.asmTiming === o.id ? ' on' : '') + '"><input type="radio" name="lab-timing" value="' + o.id + '"' + (st.asmTiming === o.id ? ' checked' : '') + '><b>' + esc(o.name) + '</b><span class="tiny">' + esc(o.blurb) + '</span></label>';
    }).join('') + '</div><p class="tiny">The clock pauses while the coach is reading and while you read its feedback.</p></div>';
    html += '<div class="card lab-pad"><p class="kicker">Step 3 · Prompt</p><div class="filters" id="lab-ftype">' + types.map(function (ty) {
      return '<button data-ft="' + ty + '"' + (st.filters.type === ty ? ' class="on"' : '') + '>' + (ty === 'all' ? 'All types' : esc(typeName(ty))) + '</button>';
    }).join('') + '</div><p class="lab-cta" style="margin:0 0 10px"><button class="btn sm" id="lab-random">Random prompt</button></p>' +
      '<div class="promptgrid lab-prompts">' + list.map(function (pr) {
        return '<button class="pcard' + (done[pr.id] ? ' done' : '') + (st.asmPrompt === pr.id ? ' lab-picked' : '') + '" data-pp="' + pr.id + '"><span class="pcard-t">' + esc(pr.title) + '</span><span class="pcard-m"><span class="pill gold">' + esc(typeName(pr.type)) + '</span>' + fitPill(pr.type) + (done[pr.id] ? '<span class="pill good">done ' + done[pr.id] + '×</span>' : '') + '</span><span class="pcard-r">' + esc(pr.text) + '</span></button>';
      }).join('') + '</div></div>';
    el.innerHTML = html;
    bindDraftRuns();
    $('#lab-tsel').addEventListener('change', function () { st.asmTemplate = this.value; paintAsmHome(el); });
    $$('input[name=lab-timing]').forEach(function (r) { r.addEventListener('change', function () { st.asmTiming = r.value; $$('.lab-timing').forEach(function (x) { x.classList.toggle('on', x.querySelector('input').checked); }); }); });
    $$('[data-ft]').forEach(function (b) { b.addEventListener('click', function () { st.filters.type = b.dataset.ft; paintAsmHome(el); }); });
    $('#lab-random').addEventListener('click', function () { var pool = list.length ? list : C.PROMPTS; startRun(t, pool[Math.floor(Math.random() * pool.length)], st.asmTiming); });
    $$('[data-pp]').forEach(function (b) { b.addEventListener('click', function () { startRun(t, PR.get(b.dataset.pp), st.asmTiming); }); });
  }
  function draftRunsHtml() {
    var drafts = st.data.attempts.filter(function (a) { return a.status === 'draft'; });
    if (!drafts.length) return '';
    return '<div class="card lab-pad lab-drafts"><p class="kicker">Unfinished runs</p>' + drafts.map(function (a) {
      var filled = Object.keys(a.vars || {}).filter(function (k) { return a.vars[k].last; }).length;
      return '<div class="lab-draftrow"><span><b>' + esc(a.promptTitle) + '</b> <span class="tiny">' + a.pct + '% · ' + filled + ' variables done · ' + esc(fmtDate(a.updatedAt)) + '</span></span><span><button class="btn sm" data-resume="' + a.id + '">Continue</button> <button class="btn sm ghost" data-drop="' + a.id + '">Discard</button></span></div>';
    }).join('') + '</div>';
  }
  function bindDraftRuns() {
    $$('[data-resume]').forEach(function (b) { b.addEventListener('click', function () { resumeRun(st.data.attempts.filter(function (a) { return a.id === b.dataset.resume; })[0]); }); });
    $$('[data-drop]').forEach(function (b) { b.addEventListener('click', function () {
      if (!confirm('Discard this unfinished run?')) return;
      st.data.attempts = st.data.attempts.filter(function (a) { return a.id !== b.dataset.drop; });
      delete st.data.dirty[b.dataset.drop]; persist();
      server('lab.deleteAttempt', { id: b.dataset.drop }, TIMEOUT_SAVE).catch(function () {});
      paintBody();
    }); });
  }

  /* ------------------------------------------------------------ run state */
  function startRun(tpl, pr, timing, parent) {
    if (!pr) return;
    var a = {
      id: uid('A'), studentId: st.sid, templateId: tpl.id, templateName: tpl.name, templateVersion: tpl.version || 1,
      pct: tpl.pct, level: tpl.level, promptId: pr.id, promptTitle: pr.title, type: pr.type, timing: parent ? 'none' : timing,
      version: parent ? (maxVersion(parent.rootId || parent.id) + 1) : 1, parentId: parent ? parent.id : '', rootId: parent ? (parent.rootId || parent.id) : '',
      status: 'draft', vars: {}, clock: { elapsed: 0 }, createdAt: nowIso(), updatedAt: nowIso()
    };
    if (!a.rootId) a.rootId = a.id;
    if (parent) Object.keys(parent.vars || {}).forEach(function (k) { var v = parent.vars[k]; a.vars[k] = { text: v.text || '', text2: v.text2 || '', base: v.last ? v.last.points : 0 }; });
    saveItem('attempt', a);
    resumeRun(a, tpl, pr);
  }
  function maxVersion(rootId) { return st.data.attempts.reduce(function (m, x) { return (x.rootId === rootId || x.id === rootId) ? Math.max(m, x.version || 1) : m; }, 1); }
  function resumeRun(a, tpl, pr) {
    tpl = tpl || getTpl(a.templateId); pr = pr || PR.get(a.promptId);
    if (!tpl || !pr) { toast('That run\'s blueprint or prompt is no longer available.'); return; }
    var order = slotOrder(tpl), occ = occurrences(tpl), idx = 0;
    for (var i = 0; i < order.length; i++) { if (!(a.vars[order[i]] && a.vars[order[i]].last)) { idx = i; break; } if (i === order.length - 1) idx = i; }
    st.run = { a: a, tpl: tpl, pr: pr, order: order, occ: occ, idx: idx, tier: tierOf(a.level), labels: labelsFor(pr.type),
      elapsed: (a.clock && a.clock.elapsed) || 0, cardElapsed: 0, running: false, last: 0, phase: 'edit', fb: null, busy: false, done: false, showModel: false, autos: 0, overtime: false };
    st.tab = 'assembly';
    paint(); scrollTop();
  }

  /* --------------------------------------------------------------- clock */
  function clockLimit() { var r = st.run; return r.a.timing === '40' ? 2400 : r.a.timing === '2min' ? 120 : 0; }
  function startClock() { var r = st.run; if (!r || r.running || r.done) return; r.running = true; r.last = Date.now(); ensureTick(); }
  function pauseClock() {
    var r = st.run; if (!r || !r.running) return;
    var d = (Date.now() - r.last) / 1000; r.elapsed += d; r.cardElapsed += d; r.running = false;
    r.a.clock = { elapsed: Math.round(r.elapsed) };
  }
  function ensureTick() {
    if (st.tick) return;
    st.tick = setInterval(function () {
      var r = st.run;
      if (!r || r.done) { clearInterval(st.tick); st.tick = null; return; }
      if (!root || !document.body.contains(root) || root.closest('.hidden')) { pauseClock(); return; }
      if (!r.running) return;
      var now = Date.now(), d = (now - r.last) / 1000; r.last = now; r.elapsed += d; r.cardElapsed += d;
      paintClock();
      if (r.a.timing === '40' && !r.overtime && r.elapsed >= 2400) timeUp();
      if (r.a.timing === '2min' && r.cardElapsed >= 120 && r.phase === 'edit' && !r.busy) { r.busy = true; coachVar(true); }
    }, 250);
  }
  function paintClock() {
    var r = st.run, el = $('#lab-clock'); if (!el || !r) return;
    var t;
    if (r.a.timing === '40' && r.elapsed > 2400) { el.textContent = '+' + mmss(r.elapsed - 2400); el.classList.add('low'); return; }
    if (r.a.timing === '40') t = 2400 - r.elapsed;
    else if (r.a.timing === '2min') t = 120 - r.cardElapsed;
    else t = r.elapsed;
    el.textContent = (r.a.timing === 'none' ? '' : '') + mmss(Math.max(0, t));
    el.classList.toggle('low', r.a.timing !== 'none' && t <= (r.a.timing === '40' ? 300 : 20));
    var ring = $('#lab-ring'); if (ring && r.a.timing === '2min') ring.style.setProperty('--p', Math.max(0, Math.min(100, (120 - r.cardElapsed) / 120 * 100)));
  }
  function timeUp() {
    var r = st.run; pauseClock(); r.overtime = true;
    if (host.modal) {
      host.modal('<div class="seal">⏱</div><p class="kicker">40 minutes</p><h3>Time is up</h3><p style="color:var(--ink-2)">In the exam you would stop here. Finish now to see your rating, or keep going without the on-time bonus.</p><button class="btn primary wide" id="lab-tu-finish">Finish now</button><button class="btn wide" data-close>Keep going</button>');
      var f = document.getElementById('lab-tu-finish');
      if (f) f.addEventListener('click', function () { document.getElementById('modal-slot').innerHTML = ''; finishRun(); });
      var k = document.querySelector('#modal-slot [data-close]');
      if (k) k.addEventListener('click', function () { if (st.run === r && r.phase === 'edit') startClock(); });
    }
  }

  /* ----------------------------------------------------------- run card */
  function paintRun(el) {
    var r = st.run, a = r.a, key = r.order[r.idx], g = L.VAR_GUIDE[key] || {}, v = a.vars[key] || (a.vars[key] = { text: '', text2: '' });
    var pr = r.pr, lab = r.labels, needs2 = (r.occ[key] || 0) > 1, budget = varBudget(r.tpl, key);
    var tries = v.tries || 0, maxT = a.timing === '2min' ? 1 : MAX_TRIES, canRetry = tries < maxT;
    var runPts = Object.keys(a.vars).reduce(function (s, k) { return s + (a.vars[k].gained || 0); }, 0);
    var html = '<div class="lab-runbar"><div class="lab-runbar-l"><button class="linky" id="lab-pshow">' + esc(pr.title) + ' ▾</button><span class="tiny">' + esc(typeName(pr.type)) + ' · ' + a.pct + '% · ' + esc(levelInfo(a.level).id) + (a.version > 1 ? ' · version ' + a.version : '') + '</span></div>' +
      '<div class="lab-runbar-r"><span class="tiny">' + (r.idx + 1) + '/' + r.order.length + '</span><span class="combo">' + runPts + ' pts</span>' +
      (a.timing === '2min' ? '<span class="lab-ring" id="lab-ring"><b id="lab-clock" class="wr-clock">2:00</b></span>' : '<b id="lab-clock" class="wr-clock">' + (a.timing === '40' ? '40:00' : '0:00') + '</b>') + '</div></div>';
    html += '<div class="lab-prompt' + (r.promptOpen ? '' : ' hidden') + '" id="lab-prompt">' + PR.card(pr, { demand: true }) + '<p class="tiny">' + esc(L.TYPE_NOTES[pr.type] || '') + '</p></div>';
    html += '<div class="lab-prog">' + r.order.map(function (k, i) { var x = a.vars[k]; return '<span class="lab-pdot' + (i === r.idx ? ' cur' : x && x.last ? (x.last.errors === 0 && x.last.fnv === 'meets' ? ' ok' : ' done') : '') + '" title="' + esc(lab[k]) + '"></span>'; }).join('') + '</div>';
    html += '<div class="card lab-comp">' +
      '<p class="kicker">Variable ' + (r.idx + 1) + ' of ' + r.order.length + (r.idx === 0 ? ' · ' + esc(typeName(pr.type)) : '') + '</p>' +
      '<h3>' + esc(lab[key] || L.SLOT_LABEL[key]) + '</h3>' +
      '<p class="lab-fn">' + esc(g.does || '') + '</p>' +
      (r.idx === 0 ? '<p class="lab-typenote">' + esc(L.TYPE_NOTES[pr.type] || '') + '</p>' : '') +
      '<div class="lab-why"><div class="lab-pills"><span class="pill gold">≈ ' + budget.target + ' words (' + budget.lo + '–' + budget.hi + ')</span>' + (needs2 ? '<span class="pill">appears ' + r.occ[key] + '×</span>' : '') + '</div>' +
        '<p><b>Form:</b> ' + esc(slotFormHint(r.tpl, key)[0] || g.form || '') + '</p><p class="tiny"><b>Tip:</b> ' + esc(g.tip || '') + '</p></div>' +
      '<div class="lab-where"><b>Where it goes in your essay</b>' + whereLines(key, true) + '</div>' +
      '<div class="lab-write"><label class="lab-lbl" for="lab-val">' + esc(lab[key] || L.SLOT_LABEL[key]) + (needs2 ? ' · first mention' : '') + '</label>' +
        '<textarea id="lab-val" rows="2" spellcheck="true"' + (r.phase !== 'edit' ? ' readonly' : '') + ' placeholder="Words that go into the slot">' + esc(v.text || '') + '</textarea>' +
        (needs2 ? '<label class="lab-lbl" for="lab-val2">Second mention, reworded (+' + L.POINTS.reworded + ')</label><textarea id="lab-val2" rows="2" spellcheck="true"' + (r.phase !== 'edit' ? ' readonly' : '') + ' placeholder="Same idea, new words: a synonym, a shell noun (&quot;this policy&quot;), or your Concept Swap alternative">' + esc(v.text2 || '') + '</textarea>' : '') +
        '<div class="lab-meter"><span id="lab-wc" class="lab-num"></span><div class="bar-line thin"><span id="lab-wbar"></span></div></div>' +
      '</div>';
    if (r.phase === 'edit') html += '<div class="lab-acts"><button class="btn primary" id="lab-vcoach"' + (r.busy ? ' disabled' : '') + '>' + (tries ? 'Coach me again' : 'Coach me') + '</button><span class="tiny">' + (a.timing === '2min' ? 'One try: the card submits itself at 0:00.' : 'Try ' + (tries + 1) + ' of ' + maxT + '.') + '</span></div>';
    html += '<div id="lab-fb">' + (r.busy ? coachWaiting() : r.fb ? renderFeedback(r.fb, { kind: 'var', level: a.level }) : '') + '</div>';
    if (r.phase === 'feedback') {
      var model = ((pr.vars || {})[r.tier] || {})[key];
      html += (model ? '<div class="lab-model"><button class="linky" id="lab-model">' + (r.showModel ? 'Hide' : 'Compare with a') + ' model ' + esc(r.tier) + ' answer</button>' + (r.showModel ? '<p>' + esc(model.ok) + '</p>' : '') + '</div>' : '') +
        '<div class="lab-acts">' + (canRetry && !v.auto ? '<button class="btn" id="lab-vretry">Revise and coach again</button>' : '') +
        (r.idx < r.order.length - 1 ? '<button class="btn primary" id="lab-vnext">Next variable →</button>' : '<button class="btn primary" id="lab-vfinish">Assemble and rate my essay →</button>') + '</div>';
    }
    html += '</div>';
    html += '<div class="lab-nav lab-runwrap"><button class="btn ghost" id="lab-rquit">Save and leave</button>' + (r.idx > 0 ? '<button class="btn ghost" id="lab-rprev">← Previous variable</button>' : '') + '</div>';
    el.innerHTML = html;

    var ta = $('#lab-val'), ta2 = $('#lab-val2');
    function live() {
      v.text = ta.value; if (ta2) v.text2 = ta2.value;
      var n = words(ta.value);
      $('#lab-wc').textContent = n + ' word' + (n === 1 ? '' : 's') + ' · target ' + budget.lo + '–' + budget.hi;
      $('#lab-wbar').style.width = Math.min(100, Math.round(n / budget.hi * 100)) + '%';
      $('#lab-wbar').parentNode.className = 'bar-line thin' + (n > budget.hi ? ' over' : n >= budget.lo ? '' : ' gold');
      var wl = $('#lab-wherelines'); if (wl) wl.innerHTML = whereLines(key, false);
    }
    ta.addEventListener('input', live); if (ta2) ta2.addEventListener('input', live); live();
    $('#lab-pshow').addEventListener('click', function () { r.promptOpen = !r.promptOpen; $('#lab-prompt').classList.toggle('hidden', !r.promptOpen); });
    var c = $('#lab-vcoach'); if (c) c.addEventListener('click', function () { coachVar(false); });
    var rt = $('#lab-vretry'); if (rt) rt.addEventListener('click', function () { r.phase = 'edit'; r.fb = null; r.showModel = false; r.cardElapsed = a.timing === '2min' ? r.cardElapsed : 0; paintRun(el); startClock(); ta = $('#lab-val'); if (ta) ta.focus(); });
    var nx = $('#lab-vnext'); if (nx) nx.addEventListener('click', function () { gotoVar(r.idx + 1); });
    var fi = $('#lab-vfinish'); if (fi) fi.addEventListener('click', function () { finishRun(); });
    var md = $('#lab-model'); if (md) md.addEventListener('click', function () { r.showModel = !r.showModel; paintRun(el); });
    var pv = $('#lab-rprev'); if (pv) pv.addEventListener('click', function () { gotoVar(r.idx - 1); });
    $('#lab-rquit').addEventListener('click', function () { pauseClock(); saveItem('attempt', a); st.run = null; toast('Run saved. Continue it from the Assembly Line.'); paintBody(); });
    stickRunbar();
    paintClock();
    if (r.phase === 'edit' && !r.busy) { startClock(); if (!ta.value) try { ta.focus({ preventScroll: true }); } catch (e) {} }
  }
  /* Keep the clock bar visible just under the app's sticky header. */
  function stickRunbar() {
    var bar = document.querySelector('.bar'), rb = $('.lab-runbar'); if (!bar || !rb) return;
    var rh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ribbon-h')) || 0;
    rb.style.top = (rh + bar.offsetHeight + 6) + 'px';
  }
  function gotoVar(i) {
    var r = st.run; pauseClock();
    r.idx = Math.max(0, Math.min(r.order.length - 1, i)); r.cardElapsed = 0; r.fb = null; r.showModel = false;
    var v = r.a.vars[r.order[r.idx]];
    r.phase = v && v.last && ((v.tries || 0) >= (r.a.timing === '2min' ? 1 : MAX_TRIES) || v.auto) ? 'feedback' : 'edit';
    if (r.phase === 'feedback') r.fb = v.last;
    else if (v && v.last) { r.phase = 'feedback'; r.fb = v.last; }
    saveItem('attempt', r.a);
    paintRun(body()); scrollTop();
  }
  /* Every template line that holds the slot, filled with what is written so far. */
  function whereLines(key, wrap) {
    var r = st.run, a = r.a, out = [], seen = 0;
    L.COMPONENTS.forEach(function (c) {
      var t = (r.tpl.lines[c.id] || {}).text || ''; if (t.indexOf('{' + key + '}') < 0) return;
      var html = esc(t).replace(/\{(\w+)\}/g, function (m, k) {
        var v = a.vars[k] || {}, val;
        if (k === key) { val = seen > 0 && v.text2 ? v.text2 : v.text; seen++; return '<span class="slot' + (val ? ' filled' : '') + ' lab-cur">' + esc(val ? fitValue(val, false) : '[' + (r.labels[k] || L.SLOT_LABEL[k]) + ']') + '</span>'; }
        val = v.text; return val ? '<span class="slot filled">' + esc(fitValue(val, false)) + '</span>' : '<span class="slot">[' + esc(r.labels[k] || L.SLOT_LABEL[k]) + ']</span>';
      });
      out.push('<div class="lab-whereline"><span class="tiny">' + esc(c.name) + '</span><p>' + html + '</p></div>');
    });
    return wrap ? '<div id="lab-wherelines">' + out.join('') + '</div>' : out.join('');
  }

  function coachVar(auto) {
    var r = st.run, a = r.a, key = r.order[r.idx], v = a.vars[key] || (a.vars[key] = {});
    var ta = $('#lab-val'), ta2 = $('#lab-val2');
    if (ta) v.text = ta.value; if (ta2) v.text2 = ta2.value;
    pauseClock();
    var needs2 = (r.occ[key] || 0) > 1, lv = levelInfo(a.level);
    if (auto && !String(v.text || '').trim()) {
      v.auto = true; v.tries = (v.tries || 0) + 1; r.autos++;
      v.last = { ai: false, points: 0, rows: [['Timed out: empty', 0]], errors: 0, errorList: [], words: 0, budget: varBudget(r.tpl, key), issues: [{ kind: 'warn', msg: 'Time ran out before anything was written.' }], ts: nowIso() };
      r.fb = v.last; r.phase = 'feedback'; r.busy = false; saveItem('attempt', a); paintRun(body()); return;
    }
    var q = quickVar(key, v.text, v.text2, { tpl: r.tpl, prompt: r.pr, tier: r.tier, needs2: needs2 });
    if (q.blocking.length && !auto) { r.busy = false; r.fb = { blocking: q.blocking }; $('#lab-fb').innerHTML = renderFeedback(r.fb, {}); startClock(); return; }
    if (auto) { v.auto = true; r.autos++; }
    r.busy = true; r.phase = 'wait';
    var fbEl = $('#lab-fb'); if (fbEl) fbEl.innerHTML = coachWaiting();
    var vc = $('#lab-vcoach'); if (vc) vc.disabled = true;
    var speed = a.timing === '2min' && !auto ? Math.min(L.POINTS.speedMax, Math.floor(Math.max(0, 120 - r.cardElapsed) / 15) * L.POINTS.speedPer15s) : 0;
    var sentence = assemble(r.tpl, a.vars, { labels: r.labels });
    var ctxLines = [];
    L.COMPONENTS.forEach(function (c) { if (((r.tpl.lines[c.id] || {}).text || '').indexOf('{' + key + '}') >= 0) ctxLines.push(c.id); });
    var paraKeys = ctxLines.map(function (id) { return COMP[id].para; });
    var paraText = sentence.paras.filter(function (p) { return paraKeys.indexOf(p.key) >= 0; }).map(function (p) { return p.text; });
    var ask = st.ai === false ? Promise.reject(new Error('offline')) : server('lab.coach', {
      kind: 'variable', level: lv.id, band: lv.band, pct: a.pct,
      prompt: { text: r.pr.text, type: typeName(r.pr.type), demand: (C.TYPES[r.pr.type] || {}).demand || '' },
      variable: { key: key, label: r.labels[key] || L.SLOT_LABEL[key], does: (L.VAR_GUIDE[key] || {}).does, form: slotFormHint(r.tpl, key)[0] || (L.VAR_GUIDE[key] || {}).form },
      value: v.text, value2: needs2 ? (v.text2 || '') : null, words: q.words, budget: { lo: q.budget.lo, hi: q.budget.hi },
      inContext: paraText,
      filled: r.order.filter(function (k) { return k !== key && a.vars[k] && a.vars[k].text; }).map(function (k) { return (r.labels[k] || L.SLOT_LABEL[k]) + ': ' + a.vars[k].text; })
    }, TIMEOUT_COACH).then(function (res) { return res.coach; });
    ask.catch(function () { return null; }).then(function (ai) {
      var sc = scoreOf(q, ai, { level: lv.id, needs2: needs2, speed: speed });
      var fb = compactFb(q, ai, sc);
      v.tries = (v.tries || 0) + 1; v.last = fb; v.secs = Math.round((v.secs || 0) + r.cardElapsed);
      var floor = Math.max(v.best || 0, v.base || 0), gain = Math.max(0, sc.total - floor);
      fb.gain = gain; fb.improved = v.tries > 1 && sc.total > (v.best || 0);
      v.best = Math.max(v.best || 0, sc.total); v.gained = (v.gained || 0) + gain;
      r.fb = fb; r.phase = 'feedback'; r.busy = false; r.cardElapsed = a.timing === '2min' ? r.cardElapsed : 0;
      a.clock = { elapsed: Math.round(r.elapsed) };
      saveItem('attempt', a);
      award(gain);
      if (st.tab === 'assembly' && st.run === r) { paintRun(body()); var f2 = $('#lab-fb'); if (f2) try { f2.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) {} }
    });
  }

  /* ------------------------------------------------------------- finish */
  function finishRun() {
    var r = st.run, a = r.a; pauseClock();
    var built = assemble(r.tpl, a.vars, {}), marked = assemble(r.tpl, a.vars, { mark: true, labels: r.labels });
    a.essay = built.essay; a.words = built.words; a.frameWords = built.frameWords; a.share = Math.round(built.share * 1000) / 1000;
    a.seconds = Math.round(r.elapsed); a.autos = r.autos; a.overtime = !!r.overtime;
    a.full = r.order.every(function (k) { return a.vars[k] && String(a.vars[k].text || '').trim(); });
    a.parasHtml = marked.paras.map(function (p) { return p.html; });
    r.done = true; r.rating = 'wait';
    st.tab = 'assembly'; paint(); scrollTop();
    rateAttempt(a, r.tpl, r.pr).then(function () { settleRun(a, r); });
  }
  function rateAttempt(a, tpl, pr) {
    var lv = levelInfo(a.level);
    if (st.ai === false) return Promise.resolve(null);
    return server('lab.rate', {
      level: lv.id, band: lv.band, pct: a.pct,
      prompt: { text: pr.text, type: typeName(pr.type), demand: (C.TYPES[pr.type] || {}).demand || '' },
      essay: a.essay, words: a.words, share: a.share,
      frame: L.PARAS.map(function (pg) { return L.COMPONENTS.filter(function (c) { return c.para === pg.key; }).map(function (c) { return toLabels((tpl.lines[c.id] || {}).text || ''); }).join(' '); })
    }, TIMEOUT_RATE).then(function (res) {
      var g = res.rating || {};
      var bands = { tr: +g.tr, cc: +g.cc, lr: +g.lr, gra: +g.gra };
      a.rating = { tr: bands.tr, cc: bands.cc, lr: bands.lr, gra: bands.gra, overall: overallBand(bands), cefr: g.cefr || '', summary: String(g.summary || '').slice(0, 600),
        strengths: (g.strengths || []).slice(0, 3).map(function (x) { return String(x).slice(0, 240); }),
        priorities: (g.priorities || []).slice(0, 3).map(function (x) { return { crit: String(x.crit || x.criterion || '').slice(0, 8), text: String(x.text || x.action || x).slice(0, 280) }; }),
        frameNote: String(g.frameNote || '').slice(0, 300), ts: nowIso() };
      return a.rating;
    }).catch(function (e) { st.lastAiError = String(e && e.message || e); return null; });
  }
  /* Points, comparisons, awards and the save — once per finished run. */
  function settleRun(a, r) {
    var P = L.POINTS, s = labSummary(), pts = { vars: 0, onTime: 0, complete: 0, band: 0, beat: 0, revision: 0 };
    Object.keys(a.vars).forEach(function (k) { pts.vars += a.vars[k].gained || 0; });
    var prev = st.data.attempts.filter(function (x) { return x.id !== a.id && x.status === 'complete' && x.pct === a.pct && x.rating && x.rating.overall != null; });
    var bestPrev = prev.reduce(function (m, x) { return Math.max(m, x.rating.overall); }, -1);
    var parent = a.parentId ? st.data.attempts.filter(function (x) { return x.id === a.parentId; })[0] : null;
    if (parent) {
      pts.complete = P.revisionComplete;
      if (a.rating && parent.rating && a.rating.overall > parent.rating.overall) pts.revision = Math.round((a.rating.overall - parent.rating.overall) * 2) * P.revisionBandPerHalf;
    } else {
      pts.complete = P.complete;
      if (a.timing === '40' && !a.overtime) pts.onTime = P.onTime40;
      if (a.rating && a.rating.overall != null) pts.band = Math.round(a.rating.overall * P.bandMultiplier);
    }
    if (a.rating && a.rating.overall != null && bestPrev >= 0 && a.rating.overall > bestPrev) { pts.beat = P.beatBest; s.beatBest = (s.beatBest || 0) + 1; a.beatBest = true; }
    if (a.timing === '2min' && !a.autos && a.full) s.clockClean = (s.clockClean || 0) + 1;
    var extra = pts.onTime + pts.complete + pts.band + pts.beat + pts.revision;
    pts.total = pts.vars + extra;
    a.points = pts; a.status = 'complete'; a.completedAt = nowIso();
    a.compare = { prevBand: prev.length ? prev.sort(function (x, y) { return String(y.completedAt || y.updatedAt).localeCompare(String(x.completedAt || x.updatedAt)); })[0].rating.overall : null, bestBand: bestPrev >= 0 ? bestPrev : null,
      prevPoints: prevPointsFor(a), parentBand: parent && parent.rating ? parent.rating.overall : null };
    saveItem('attempt', a).then(function (ok) { if (!ok) toast(savedMsg(false, 'Run saved')); });
    award(extra);
    afterMilestone();
    if (st.run === r) { r.rating = a.rating ? 'done' : 'none'; if (st.tab === 'assembly') paintBody(); }
  }
  function prevPointsFor(a) {
    var list = st.data.attempts.filter(function (x) { return x.id !== a.id && x.status === 'complete' && x.pct === a.pct && x.points; });
    if (!list.length) return null;
    list.sort(function (x, y) { return String(y.completedAt || y.updatedAt).localeCompare(String(x.completedAt || x.updatedAt)); });
    return list[0].points.total;
  }

  function paintFinish(el) {
    var r = st.run, a = r.a;
    el.innerHTML = attemptReportHtml(a, { live: true, waiting: r.rating === 'wait' });
    bindReport(a, el, true);
  }
  function attemptReportHtml(a, opts) {
    opts = opts || {};
    var lv = levelInfo(a.level), pr = PR.get(a.promptId) || { title: a.promptTitle, text: '' }, rt = a.rating;
    var html = '<div class="lab-back"><button class="btn sm ghost" id="lab-rback">' + (opts.live ? '← Assembly Line' : '← Scorecard') + '</button><span class="tiny">' + esc(a.templateName) + ' v' + (a.templateVersion || 1) + ' · ' + a.pct + '% · ' + esc(lv.name) + ' · ' + esc(timingName(a.timing)) + (a.version > 1 ? ' · version ' + a.version : '') + '</span></div>';
    html += '<div class="card lab-pad lab-result">';
    if (opts.waiting) html += '<div class="lab-wait big"><span class="lab-spin"></span> The examiner-coach is rating your essay…</div>';
    else if (rt) {
      html += '<div class="lab-rating"><div class="score-ring" style="--p:' + Math.round((rt.overall || 0) / 9 * 100) + '"><i>' + fmtBand(rt.overall) + '</i></div><div><p class="kicker">Estimated band · not an official IELTS score</p><h3>Band ' + fmtBand(rt.overall) + (rt.cefr ? ' · ' + esc(rt.cefr) : '') + '</h3>' +
        '<div class="lab-crit">' + [['TR', 'tr', 'Task Response'], ['CC', 'cc', 'Coherence & Cohesion'], ['LR', 'lr', 'Lexical Resource'], ['GRA', 'gra', 'Grammar']].map(function (c) {
          return '<div class="lab-critrow"><span title="' + c[2] + '">' + c[0] + '</span><div class="bar-line"><span style="width:' + Math.round((rt[c[1]] || 0) / 9 * 100) + '%"></span></div><b class="lab-num">' + fmtBand(rt[c[1]]) + '</b></div>';
        }).join('') + '</div></div></div>';
      if (rt.summary) html += '<p class="lab-sum">' + esc(rt.summary) + '</p>';
      if (rt.strengths && rt.strengths.length) html += '<div class="lab-list ok"><b>What worked</b><ul>' + rt.strengths.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      if (rt.priorities && rt.priorities.length) html += '<div class="lab-list"><b>To reach the next half band</b><ul>' + rt.priorities.map(function (x) { return '<li>' + (x.crit ? '<span class="pill on">' + esc(x.crit) + '</span> ' : '') + esc(x.text) + '</li>'; }).join('') + '</ul></div>';
      if (rt.frameNote) html += '<p class="tiny lab-framenote"><b>Your template:</b> ' + esc(rt.frameNote) + '</p>';
    } else html += '<div class="lab-offline">No band rating yet: ' + esc(st.ai === false ? st.aiNote : 'the coach could not be reached.') + ' Your essay and every variable are saved.' + (online() ? ' <button class="btn sm" id="lab-ratenow">Rate it now</button>' : '') + '</div>';
    html += '<div class="lab-kpis">' +
      kpi(a.words, 'Words', a.words >= 250 ? 'at least 250 ✓' : 'under 250') +
      kpi(pctStr(a.share), 'Template share', 'target ' + a.pct + '% · yours ' + pctStr(1 - a.share)) +
      kpi(mmss(a.seconds || 0), 'Writing time', a.timing === '40' ? (a.overtime ? 'over 40 min' : 'inside 40 min') : timingName(a.timing)) +
      kpi(a.points ? a.points.total : '…', 'Points', a.points ? pointsLine(a.points) : '') +
    '</div>';
    if (a.compare && !opts.waiting) html += compareHtml(a);
    html += '</div>';
    html += '<div class="card lab-pad"><div class="lab-ex-h"><p class="kicker">Your essay</p><label class="tiny"><input type="checkbox" id="lab-hl"' + (st.highlightFrame ? ' checked' : '') + '> highlight your own words</label></div><div class="lab-essay' + (st.highlightFrame ? ' hl' : '') + '" id="lab-essay">' + (a.parasHtml || []).map(function (h) { return '<p>' + h + '</p>'; }).join('') + '</div>' +
      '<p class="tiny">' + esc(pr.text) + '</p></div>';
    html += '<details class="card lab-pad lab-varlist"><summary><b>Coaching for each variable</b></summary>' + Object.keys(a.vars).map(function (k) {
      var v = a.vars[k]; if (!v.last) return '';
      return '<div class="lab-varrow"><div class="lab-varrow-h"><b>' + esc((labelsFor(a.type) || {})[k] || L.SLOT_LABEL[k]) + '</b><span class="pill gold">' + v.last.points + ' pts</span>' + (v.last.cefr ? '<span class="pill">' + esc(v.last.cefr) + '</span>' : '') + (v.auto ? '<span class="pill bad">timed out</span>' : '') + '</div><p class="lab-varval">' + esc(v.text || '') + (v.text2 ? '<br><span class="tiny">2nd: </span>' + esc(v.text2) : '') + '</p>' + renderFeedback(v.last, { kind: 'var', level: a.level, stored: true }) + '</div>';
    }).join('') + '</details>';
    html += '<div class="lab-nav">' + (a.status === 'complete' ? '<button class="btn" id="lab-revise">Revise as version ' + (maxVersion(a.rootId || a.id) + 1) + '</button>' : '') +
      '<button class="btn ghost" id="lab-copy">Copy essay</button><button class="btn ghost" id="lab-levelup">Send to LevelUp</button>' +
      (opts.live ? '<button class="btn primary" id="lab-again">New run →</button>' : '') + '</div>';
    return html;
  }
  function pointsLine(p) {
    var parts = ['variables ' + p.vars];
    if (p.onTime) parts.push('on time +' + p.onTime);
    if (p.complete) parts.push('complete +' + p.complete);
    if (p.band) parts.push('band +' + p.band);
    if (p.beat) parts.push('best +' + p.beat);
    if (p.revision) parts.push('revision +' + p.revision);
    return parts.join(' · ');
  }
  function compareHtml(a) {
    var c = a.compare, rows = [], ov = a.rating ? a.rating.overall : null;
    if (a.parentId && c.parentBand != null && ov != null) rows.push(['vs version ' + (a.version - 1), sign(ov - c.parentBand, 1) + ' band']);
    if (c.prevBand != null && ov != null) rows.push(['vs your last ' + a.pct + '% run', sign(ov - c.prevBand, 1) + ' band']);
    if (c.bestBand != null && ov != null) rows.push([a.beatBest ? 'New personal best at ' + a.pct + '%' : 'vs your best at ' + a.pct + '%', sign(ov - c.bestBand, 1) + ' band']);
    if (c.prevPoints != null && a.points) rows.push(['Points vs last ' + a.pct + '% run', sign(a.points.total - c.prevPoints)]);
    if (!rows.length) return '<p class="tiny lab-firstrun">Your first ' + a.pct + '% run: it sets the record your next runs will be compared with.</p>';
    return '<div class="lab-compare">' + rows.map(function (x) { var up = /^\+/.test(x[1]), down = /^−/.test(x[1]); return '<div class="lab-cmp' + (up ? ' up' : down ? ' down' : '') + '"><span>' + esc(x[0]) + '</span><b class="lab-num">' + esc(x[1]) + '</b></div>'; }).join('') + '</div>';
  }
  function timingName(id) { return (L.TIMINGS.filter(function (t) { return t.id === id; })[0] || {}).name || ''; }
  function bindReport(a, el, live) {
    var back = $('#lab-rback'); if (back) back.addEventListener('click', function () { if (live) { st.run = null; } else { st.review = null; } paintBody(); scrollTop(); });
    var hl = $('#lab-hl'); if (hl) hl.addEventListener('change', function () { st.highlightFrame = hl.checked; $('#lab-essay').classList.toggle('hl', hl.checked); });
    var cp = $('#lab-copy'); if (cp) cp.addEventListener('click', function () { try { navigator.clipboard.writeText(a.essay || ''); toast('Essay copied.'); } catch (e) { global.prompt('Copy your essay', a.essay || ''); } });
    var lu = $('#lab-levelup'); if (lu) lu.addEventListener('click', function () { sendToLevelUp(a); });
    var ag = $('#lab-again'); if (ag) ag.addEventListener('click', function () { st.run = null; paintBody(); scrollTop(); });
    var rv = $('#lab-revise'); if (rv) rv.addEventListener('click', function () {
      var tpl = getTpl(a.templateId), pr = PR.get(a.promptId);
      if (!tpl || !pr) { toast('The blueprint for this run is not on this device.'); return; }
      st.review = null; startRun(tpl, pr, 'none', a);
    });
    var rn = $('#lab-ratenow'); if (rn) rn.addEventListener('click', function () {
      rn.disabled = true; rn.textContent = 'Rating…';
      var tpl = getTpl(a.templateId), pr = PR.get(a.promptId);
      rateAttempt(a, tpl || { lines: {} }, pr).then(function (rt) {
        if (!rt) { toast('The coach could not be reached. Try again later.'); rn.disabled = false; rn.textContent = 'Rate it now'; return; }
        if (!a.points) a.points = { vars: 0, total: 0 };
        var bonus = Math.round(rt.overall * L.POINTS.bandMultiplier); a.points.band = (a.points.band || 0) + bonus; a.points.total += bonus;
        saveItem('attempt', a); award(bonus); afterMilestone(); paintBody();
      });
    });
  }
  function sendToLevelUp(a) {
    var p = host.p, pr = PR.get(a.promptId) || { text: '' };
    var url0 = global.PC_LEVELUP_URL || 'https://pegasus028.github.io/LevelUp/';
    var payload = { source: 'position-control-lab', ts: nowIso(), studentId: p.studentId, name: p.displayName, cohort: p.cohort || '', promptId: a.promptId, prompt: pr.text, essay: a.essay, reportId: a.id };
    try { localStorage.setItem('lue_handoff', JSON.stringify(payload)); } catch (e) {}
    var packed = ''; try { packed = btoa(unescape(encodeURIComponent(JSON.stringify({ prompt: pr.text, essay: a.essay, name: p.displayName })))); } catch (e) {}
    var w = global.open(url0 + (url0.indexOf('?') >= 0 ? '&' : '?') + 'from=pc' + (packed ? '#pc=' + packed : ''), '_blank');
    if (!w) toast('Pop-up blocked: allow pop-ups for this site, or copy the essay into LevelUp.');
  }

  /* ============================================================ SCORECARD */
  var SERIES = [
    { pct: 60, color: 'var(--lab-s60)', shape: 'circle' },
    { pct: 50, color: 'var(--lab-s50)', shape: 'square' },
    { pct: 40, color: 'var(--lab-s40)', shape: 'triangle' },
    { pct: 30, color: 'var(--lab-s30)', shape: 'diamond' }
  ];
  function doneRuns() {
    return st.data.attempts.filter(function (a) { return a.status === 'complete'; })
      .sort(function (x, y) { return String(x.completedAt || x.updatedAt).localeCompare(String(y.completedAt || y.updatedAt)); });
  }
  function paintScore(el) {
    var s = recompute(), rk = labRank(s.points || 0), runs = doneRuns(), rated = runs.filter(function (a) { return a.rating && a.rating.overall != null; });
    var last3 = rated.slice(-3), avg3 = last3.length ? last3.reduce(function (m, a) { return m + a.rating.overall; }, 0) / last3.length : null;
    var toNext = rk.next ? Math.round(((s.points || 0) - rk.rank.min) / (rk.next.min - rk.rank.min) * 100) : 100;
    var html = '<div class="lab-kpis lab-kpis-top">' +
      '<div class="lab-kpi"><b class="lab-num">' + (s.points || 0) + '</b><span>Lab points</span><small>' + esc(rk.rank.name) + (rk.next ? ' · ' + (rk.next.min - (s.points || 0)) + ' to ' + esc(rk.next.name) : ' · top rank') + '</small><div class="bar-line thin gold"><span style="width:' + toNext + '%"></span></div></div>' +
      kpi(runs.length, 'Assembly runs', rated.length + ' rated') +
      kpi(fmtBand(s.bestBand), 'Best band', 'estimated by the coach') +
      kpi(avg3 == null ? '—' : fmtBand(avg3), 'Last 3 runs', 'average band') +
      kpi(completeTemplates().length, 'Blueprints', st.data.templates.length - completeTemplates().length + ' in draft') +
      '</div>';
    /* per-share comparison */
    var rowsByPct = L.PCTS.map(function (o) {
      var list = runs.filter(function (a) { return a.pct === o.pct; }), rt = list.filter(function (a) { return a.rating && a.rating.overall != null; });
      function avg(arr, f) { return arr.length ? arr.reduce(function (m, a) { return m + f(a); }, 0) / arr.length : null; }
      return { o: o, n: list.length, rated: rt.length, avgBand: avg(rt, function (a) { return a.rating.overall; }), best: rt.length ? Math.max.apply(null, rt.map(function (a) { return a.rating.overall; })) : null,
        avgPts: avg(list, function (a) { return a.points ? a.points.total : 0; }), avgShare: avg(list, function (a) { return a.share || 0; }), avgSec: avg(list, function (a) { return a.seconds || 0; }) };
    });
    var strongest = null; rowsByPct.forEach(function (r) { if (r.avgBand != null && (strongest == null || r.avgBand > strongest.avgBand)) strongest = r; });
    html += '<div class="card lab-pad"><p class="kicker">Template share vs your results</p><h3>Which share works for you?</h3>' +
      '<div class="tbl-scroll"><table class="tbl lab-tbl"><thead><tr><th>Template</th><th>Runs</th><th>Average band</th><th>Best band</th><th>Average points</th><th>Actual template share</th><th>Average time</th></tr></thead><tbody>' +
      rowsByPct.map(function (r) {
        return '<tr' + (strongest === r ? ' class="best"' : '') + '><td><span class="lab-key" style="--c:' + SERIES.filter(function (x) { return x.pct === r.o.pct; })[0].color + '"></span><b>' + r.o.pct + '%</b> <span class="tiny">' + esc(r.o.name) + '</span>' + (strongest === r ? ' <span class="pill good">strongest</span>' : '') + '</td>' +
          '<td class="lab-num">' + r.n + '</td><td class="lab-num">' + fmtBand(r.avgBand) + '</td><td class="lab-num">' + fmtBand(r.best) + '</td><td class="lab-num">' + (r.avgPts == null ? '—' : Math.round(r.avgPts)) + '</td><td class="lab-num">' + (r.avgShare == null ? '—' : pctStr(r.avgShare)) + '</td><td class="lab-num">' + (r.avgSec == null ? '—' : mmss(r.avgSec)) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p class="tiny">Your own words make up 40%, 50%, 60% or 70% of the essay. A 2009 IELTS research report proposed at least 50% for a Band 7 script and 59% for Band 8.</p></div>';
    html += '<div class="card lab-pad"><p class="kicker">Band by run, for each template share</p>' + chartHtml(rated) + '</div>';
    /* run history */
    html += '<div class="card lab-pad"><p class="kicker">Run history</p>' + (runs.length ? '<div class="lab-hist">' + runs.slice().reverse().map(function (a) {
      var prev = rated.filter(function (x) { return x.pct === a.pct && String(x.completedAt || x.updatedAt) < String(a.completedAt || a.updatedAt); }).pop();
      var d = a.rating && prev ? a.rating.overall - prev.rating.overall : null;
      return '<button class="lab-histrow" data-rev="' + a.id + '"><span class="lab-hist-d tiny">' + esc(fmtDate(a.completedAt || a.updatedAt)) + '</span><span class="lab-hist-t"><b>' + esc(a.promptTitle) + '</b><span class="lab-pills"><span class="pill gold">' + a.pct + '%</span><span class="pill">' + esc(timingName(a.timing)) + '</span>' + (a.version > 1 ? '<span class="pill">v' + a.version + '</span>' : '') + '</span></span>' +
        '<span class="lab-hist-b lab-num">' + (a.rating ? 'Band ' + fmtBand(a.rating.overall) : 'not rated') + (d != null ? ' <i class="' + (d > 0 ? 'up' : d < 0 ? 'down' : '') + '">' + sign(d, 1) + '</i>' : '') + '</span><span class="lab-hist-p lab-num">' + (a.points ? a.points.total : 0) + ' pts</span></button>';
    }).join('') + '</div>' : '<p class="tiny">No finished runs yet. Take a blueprint to the Assembly Line.</p>') + '</div>';
    /* blueprints */
    var tpls = st.data.templates.slice().sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    if (tpls.length) html += '<div class="card lab-pad"><p class="kicker">Blueprints</p><div class="tbl-scroll"><table class="tbl lab-tbl"><thead><tr><th>Blueprint</th><th>Share</th><th>Level</th><th>Blueprint score</th><th>Runs</th><th>Average band</th></tr></thead><tbody>' + tpls.map(function (t) {
      var rs = runs.filter(function (a) { return a.templateId === t.id; }), rt = rs.filter(function (a) { return a.rating && a.rating.overall != null; });
      var ab = rt.length ? rt.reduce(function (m, a) { return m + a.rating.overall; }, 0) / rt.length : null;
      return '<tr><td><b>' + esc(t.name) + '</b> <span class="tiny">v' + (t.version || 1) + (t.status !== 'complete' ? ' · draft' : '') + '</span></td><td class="lab-num">' + t.pct + '%</td><td>' + esc(t.level) + '</td><td class="lab-num">' + Math.round(tplScore(t) / (L.COMPONENTS.length * L.POINTS.lineMax) * 100) + '%</td><td class="lab-num">' + rs.length + '</td><td class="lab-num">' + fmtBand(ab) + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
    el.innerHTML = html;
    $$('[data-rev]').forEach(function (b) { b.addEventListener('click', function () { st.review = b.dataset.rev; paintBody(); scrollTop(); }); });
    bindChart();
  }

  function chartHtml(rated) {
    if (rated.length < 2) return '<p class="tiny">Finish two rated runs to see your trend. Each line follows one template share, run by run.</p>';
    var series = SERIES.map(function (sr) {
      var pts = rated.filter(function (a) { return a.pct === sr.pct; }).map(function (a, i) { return { x: i + 1, y: a.rating.overall, a: a }; });
      return extend({ pts: pts }, sr);
    }).filter(function (sr) { return sr.pts.length; });
    var W0 = 760, H0 = 250, ml = 40, mr = 64, mt = 14, mb = 34;
    var xMax = Math.max(2, Math.max.apply(null, series.map(function (s) { return s.pts.length; })));
    var yMin = Math.min(4, Math.floor(Math.min.apply(null, rated.map(function (a) { return a.rating.overall; })))), yMax = 9;
    function X(x) { return ml + (x - 1) / (xMax - 1) * (W0 - ml - mr); }
    function Y(y) { return mt + (yMax - y) / (yMax - yMin) * (H0 - mt - mb); }
    var g = '';
    for (var yv = yMin; yv <= yMax; yv++) g += '<line class="lab-gridline" x1="' + ml + '" x2="' + (W0 - mr) + '" y1="' + Y(yv) + '" y2="' + Y(yv) + '"/><text class="lab-axis" x="' + (ml - 8) + '" y="' + (Y(yv) + 4) + '" text-anchor="end">' + yv + '</text>';
    var step = xMax > 12 ? Math.ceil(xMax / 10) : 1;
    for (var xv = 1; xv <= xMax; xv += step) g += '<text class="lab-axis" x="' + X(xv) + '" y="' + (H0 - mb + 18) + '" text-anchor="middle">' + xv + '</text>';
    g += '<text class="lab-axis" x="' + ((ml + W0 - mr) / 2) + '" y="' + (H0 - 4) + '" text-anchor="middle">Run number at that share</text>';
    var marks = '', hits = '', labels = [];
    series.forEach(function (sr) {
      if (sr.pts.length > 1) marks += '<polyline class="lab-line" style="stroke:' + sr.color + '" points="' + sr.pts.map(function (p) { return X(p.x) + ',' + Y(p.y); }).join(' ') + '"/>';
      sr.pts.forEach(function (p) {
        marks += shape(sr.shape, X(p.x), Y(p.y), sr.color);
        hits += '<circle class="lab-hit" cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="13" data-tip="' + esc(sr.pct + '% template · run ' + p.x + ' · Band ' + fmtBand(p.y) + ' · ' + p.a.promptTitle + ' · ' + fmtDate(p.a.completedAt || p.a.updatedAt)) + '" data-rev="' + p.a.id + '"/>';
      });
      var lp = sr.pts[sr.pts.length - 1];
      labels.push({ y: Y(lp.y), x: X(lp.x), text: sr.pct + '%', color: sr.color, shape: sr.shape });
    });
    labels.sort(function (a, b) { return a.y - b.y; });
    for (var i = 1; i < labels.length; i++) if (labels[i].y - labels[i - 1].y < 14) labels[i].ly = (labels[i - 1].ly || labels[i - 1].y) + 14;
    var lab = labels.map(function (l) {
      var ly = l.ly || l.y, lx = W0 - mr + 12;
      return (Math.abs(ly - l.y) > 1 || lx - l.x > 20 ? '<line class="lab-leader" x1="' + (l.x + 7) + '" y1="' + l.y + '" x2="' + (lx - 3) + '" y2="' + ly + '"/>' : '') + '<text class="lab-dlabel" x="' + lx + '" y="' + (ly + 4) + '">' + l.text + '</text>';
    }).join('');
    var legend = '<div class="lab-legend">' + series.map(function (sr) { return '<span><svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">' + shape(sr.shape, 7, 7, sr.color) + '</svg>' + sr.pct + '% template</span>'; }).join('') + '</div>';
    return legend + '<div class="lab-chart"><svg viewBox="0 0 ' + W0 + ' ' + H0 + '" role="img" aria-label="Estimated band for each run, one line per template share">' + g + marks + lab + hits + '</svg><div class="lab-tipbox hidden" id="lab-tipbox"></div></div>';
  }
  function shape(kind, x, y, color) {
    var st0 = 'fill:' + color;
    if (kind === 'square') return '<rect class="lab-mark" x="' + (x - 4.5) + '" y="' + (y - 4.5) + '" width="9" height="9" rx="1.5" style="' + st0 + '"/>';
    if (kind === 'triangle') return '<path class="lab-mark" d="M' + x + ' ' + (y - 5.5) + ' L' + (x + 5.5) + ' ' + (y + 4.5) + ' L' + (x - 5.5) + ' ' + (y + 4.5) + ' Z" style="' + st0 + '"/>';
    if (kind === 'diamond') return '<path class="lab-mark" d="M' + x + ' ' + (y - 6) + ' L' + (x + 6) + ' ' + y + ' L' + x + ' ' + (y + 6) + ' L' + (x - 6) + ' ' + y + ' Z" style="' + st0 + '"/>';
    return '<circle class="lab-mark" cx="' + x + '" cy="' + y + '" r="5" style="' + st0 + '"/>';
  }
  function bindChart() {
    var box = $('#lab-tipbox'), wrap = box ? box.parentNode : null; if (!box) return;
    $$('.lab-hit').forEach(function (h) {
      function showTip() {
        box.textContent = h.getAttribute('data-tip'); box.classList.remove('hidden');
        var rb = wrap.getBoundingClientRect(), hb = h.getBoundingClientRect();
        var left = hb.left - rb.left + hb.width / 2, top = hb.top - rb.top;
        box.style.left = Math.max(4, Math.min(rb.width - box.offsetWidth - 4, left - box.offsetWidth / 2)) + 'px';
        box.style.top = Math.max(0, top - box.offsetHeight - 6) + 'px';
      }
      h.addEventListener('mouseenter', showTip); h.addEventListener('focus', showTip);
      h.addEventListener('mouseleave', function () { box.classList.add('hidden'); });
      h.addEventListener('click', function () { st.review = h.getAttribute('data-rev'); paintBody(); scrollTop(); });
    });
  }
  function paintReview(el) {
    var a = st.data.attempts.filter(function (x) { return x.id === st.review; })[0];
    if (!a) { st.review = null; return paintScore(el); }
    if (!a.parasHtml && a.essay) a.parasHtml = String(a.essay).split(/\n\n/).map(function (p) { return esc(p); });
    el.innerHTML = attemptReportHtml(a, {});
    bindReport(a, el, false);
  }

  /* ============================================================== mount */
  function mount(el, h) {
    host = h; root = el;
    var p = host.p; if (!p) return;
    if (st.sid !== p.studentId) {
      st.sid = p.studentId; st.data = loadLocal(); st.synced = false; st.ai = null;
      st.build = null; st.run = null; st.review = null; st.view = 'home'; st.tab = 'studio';
    }
    recompute();
    paint();
    if (!st.synced) {
      st.synced = true;
      pushDirty();
      server('lab.list', {}, 20000).then(function (r) {
        if (mergeServer(r) && root && !st.run && !st.build) { recompute(); paint(); }
      }).catch(function () {});
    }
    if (st.ai !== true) checkStatus().then(function () { if (root && document.body.contains(root)) { var pill = root.querySelector('.lab-ai .pill'); if (pill) { pill.className = 'pill ' + (st.ai ? 'good' : 'bad'); pill.textContent = st.aiNote; } } });
  }
  function leave() {
    if (st.run && !st.run.done) { pauseClock(); saveItem('attempt', st.run.a); }
    if (st.build && st.view === 'build') { var ta = root && root.querySelector('#lab-line'); var comp = L.COMPONENTS[st.build.idx]; if (ta && comp) { var ln = st.build.tpl.lines[comp.id] || (st.build.tpl.lines[comp.id] = {}); ln.draft = ta.value; persist(); } }
  }
  global.addEventListener('pagehide', function () { try { leave(); } catch (e) {} });
  global.addEventListener('resize', function () { if (st.run && !st.run.done && root) stickRunbar(); });

  global.Lab = {
    mount: mount, leave: leave,
    busy: function () { return !!(st.run && !st.run.done && st.run.busy); },
    /* for tests and the teacher console */
    _state: st, _quickFrame: quickFrame, _quickVar: quickVar, _assemble: assemble, _overallBand: overallBand, _toTokens: toTokens, _compBudget: compBudget
  };
})(window);
