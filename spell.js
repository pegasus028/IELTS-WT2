/* ===========================================================================
   QUILLMOOR ACADEMY — spell.js  (the five-minute daily spell, WP10f, 20 Oct 2026)
   One variable on a fresh prompt, every day, coached: one AI call through the
   Workshop's coach (Lab.spellCoach → lab.coach), or the Scriptorium's offline
   shape check (Writer.shapeCheck) when the coach is off. A daily streak task
   for the days when a full essay is impossible.

   DailySpell.paint(el, host)   paints the card into #spell-slot on the Map Room
   State on the progress object (saved whole): p.spell = { date, promptId, key, text,
     done, streak, lastDate, total }. Merits: 15 for a spell that passes the shape
     check (once a day). Attempts row: itemId 'spell-<prompt>-<key>', mode 'spell'.
   =========================================================================== */
(function (global) {
  'use strict';
  var SPELL_XP = 15;
  var BUDGET = { core: [3, 8], facet: [2, 8], mech: [4, 14], ex: [2, 10], nuance: [5, 18], position: [6, 22], rationale: [4, 16] };
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function C() { return global.CONTENT; }
  function E() { return global.Engine; }
  function W() { return global.Writer; }
  function kindOf(key) { return /^facet/.test(key) ? 'facet' : /^mech/.test(key) ? 'mech' : /^ex/.test(key) ? 'ex' : /^nuance/.test(key) ? 'nuance' : key; }
  function today() { return E() && E().today ? E().today() : new Date().toISOString().slice(0, 10); }
  function dayIndex(iso) { return Math.round((Date.parse(iso + 'T00:00:00Z') - Date.parse('2026-10-01T00:00:00Z')) / 86400000); }
  function yesterday(iso) { return new Date(Date.parse(iso + 'T00:00:00Z') - 86400000).toISOString().slice(0, 10); }
  function words(t) { return W() ? W().words(t) : String(t || '').split(/\s+/).filter(Boolean).length; }
  function level(host) { var v = host.explainLevel ? host.explainLevel() : 'B2'; return v === 'A1' ? 'A2' : v === 'C2' ? 'C1' : v; }

  /* today's prompt and variable: deterministic for the day and the student; never her five, never written */
  function pick(host, p) {
    var d = today(), n = dayIndex(d), five = host.coreSet ? host.coreSet() : [], written = {};
    (p.reports || []).forEach(function (r) { written[r.promptId] = 1; });
    var all = host.practicePrompts ? host.practicePrompts() : (C().PROMPTS || []).filter(function (x) { return !x.mockOnly; });
    var pool = all.filter(function (x) { return five.indexOf(x.id) < 0 && !written[x.id]; });
    if (!pool.length) pool = all.filter(function (x) { return five.indexOf(x.id) < 0; });
    if (!pool.length) pool = all;
    var keys = C().VARIABLES.map(function (v) { return v.key; });
    var pr = pool[(n + String(p.studentId || '').length) % pool.length];
    return { date: d, promptId: pr.id, key: keys[((n % keys.length) + keys.length) % keys.length] };
  }
  function state(host) {
    var p = host.p, s = p.spell || (p.spell = { streak: 0, total: 0, lastDate: '' });
    var d = today();
    if (s.date !== d) { var t = pick(host, p); s.date = t.date; s.promptId = t.promptId; s.key = t.key; s.text = ''; s.done = false; s.verdict = ''; }
    if (s.lastDate && s.lastDate !== d && s.lastDate !== yesterday(d)) s.streak = 0;
    return s;
  }
  function labelFor(key, type) { var T = global.Template, lab = T && T.labels ? T.labels(type) : {}; var v = C().VARIABLES.filter(function (x) { return x.key === key; })[0] || {}; return { name: lab[key] || v.name || key, hint: v.hint || '' }; }
  function guide(key) { var L = global.LabContent; return (L && L.VAR_GUIDE && L.VAR_GUIDE[key]) || {}; }
  /* the job of this slot in this question type, from the Type Switch Card (lab-content.js) */
  function roleFor(key, type) {
    var L = global.LabContent, row = (L && L.TYPE_SWITCH || []).filter(function (r) { return r.id === type; })[0];
    var f = { facetA: 'a', nuanceA: 'na', facetB: 'b', nuanceB: 'nb', position: 'pos' }[key];
    return row && f && row[f] ? row[f] : '';
  }

  function paint(el, host) {
    if (!el || !host || !host.p || !global.Prompts) return;
    var p = host.p, s = state(host), pr = global.Prompts.get(s.promptId);
    if (!pr) { el.innerHTML = ''; return; }
    var lab = labelFor(s.key, pr.type), g = guide(s.key), lv = level(host), role = roleFor(s.key, pr.type);
    var ex = W() && W().shapeExamples ? W().shapeExamples(s.key, lv, pr)[0] : null;
    var html = '<div class="card spell" id="spell" data-spell="' + esc(s.key) + '" data-spell-prompt="' + esc(pr.id) + '"><div class="sect-h" style="margin-bottom:6px"><div><p class="kicker">Today\'s spell · five minutes</p><h3>' + esc(lab.name) + ' for "' + esc(pr.title) + '"</h3></div><span class="pill' + (s.done ? ' good' : ' on') + '" id="spell-streak">' + (s.streak || 0) + ' day' + (s.streak === 1 ? '' : 's') + '</span></div>' +
      '<p class="tiny spell-prompt">' + esc(pr.text) + '</p>' +
      '<p class="spell-ask"><b>' + esc(lab.name) + ':</b> ' + (role ? 'in a ' + esc(String((C().TYPES[pr.type] || {}).name || pr.type).replace(/ question$/, '')).toLowerCase() + ' essay, ' + esc(role.charAt(0).toLowerCase() + role.slice(1)) + '. ' : '') + esc(g.does || lab.hint) + (g.tip ? ' ' + esc(g.tip) : '') + '</p>' +
      (ex ? '<p class="tiny spell-ex">The shape, from another prompt: <i>' + esc(ex.text) + '</i> (' + esc(ex.from) + ')</p>' : '');
    if (s.done) {
      html += '<p class="spell-done">✓ Cast today: <i>' + esc(s.text) + '</i></p>' + (s.verdict ? '<p class="tiny">' + esc(s.verdict) + '</p>' : '') + '<p class="tiny">One variable a day keeps the candles lit. Tomorrow brings a new prompt and a new key.</p>';
    } else {
      html += '<textarea id="spell-text" class="ftext" rows="2" spellcheck="true" placeholder="' + esc(lab.name) + ' for this prompt …">' + esc(s.text || '') + '</textarea>' +
        '<div class="camp-row"><span class="tiny" id="spell-wc">' + words(s.text) + ' words</span><button class="btn primary" id="spell-cast" type="button">Cast it</button></div><div id="spell-out" role="status" aria-live="polite"></div>';
    }
    el.innerHTML = html + '</div>';
    var ta = el.querySelector('#spell-text'), btn = el.querySelector('#spell-cast'), out = el.querySelector('#spell-out');
    if (!ta || !btn) return;
    ta.addEventListener('input', function () { el.querySelector('#spell-wc').textContent = words(ta.value) + ' words'; });
    btn.addEventListener('click', function () { cast(el, host, s, pr, lab, lv, ta, btn, out); });
  }

  function finish(host, s, text, verdict, ok, mode) {
    var p = host.p, d = today();
    s.text = text; s.verdict = verdict;
    try { if (global.API && global.API.enqueue) global.API.enqueue([{ ts: new Date().toISOString(), studentId: p.studentId, itemId: 'spell-' + s.promptId + '-' + s.key, topic: 'spell', level: '', type: 'spell', tag: 'tr-generalised', cefr: level(host), correct: ok ? 1 : 0, ms: 0, hinted: 0, fast: 0, mode: mode, given: String(text).slice(0, 400), expected: String(verdict).slice(0, 300) }]); } catch (e) {}
    if (ok && !s.done) {
      s.done = true; s.total = (s.total || 0) + 1;
      s.streak = s.lastDate === yesterday(d) ? (s.streak || 0) + 1 : 1; s.lastDate = d;
      p.xp = (p.xp || 0) + SPELL_XP;
      if (host.toast) host.toast('Spell cast. +' + SPELL_XP + ' merits · ' + s.streak + ' day' + (s.streak === 1 ? '' : 's') + ' in a row.');
    }
    if (host.paintHeader) host.paintHeader();
    if (host.sync) host.sync();
  }
  function cast(el, host, s, pr, lab, lv, ta, btn, out) {
    var text = String(ta.value || '').trim();
    if (!text) { out.innerHTML = '<ul class="ftnotes no"><li>Write the ' + esc(lab.name.toLowerCase()) + ' first.</li></ul>'; return; }
    var sc = W() && W().shapeCheck ? W().shapeCheck(s.key, text, pr.text, pr.type) : { ok: true, soft: false, tip: '', fix: '' };
    if (!sc.ok) {
      out.innerHTML = '<ul class="ftnotes no"><li>' + esc(sc.tip) + '</li>' + (sc.fix ? '<li>In the shape: <i>' + esc(sc.fix) + '</i> <button class="linky" type="button" id="spell-fix">Use this</button></li>' : '') + '</ul>';
      var fx = el.querySelector('#spell-fix'); if (fx) fx.addEventListener('click', function () { ta.value = sc.fix; el.querySelector('#spell-wc').textContent = words(sc.fix) + ' words'; });
      try { if (global.API && global.API.enqueue) global.API.enqueue([{ ts: new Date().toISOString(), studentId: host.p.studentId, itemId: 'spell-' + s.promptId + '-' + s.key, topic: 'spell', level: '', type: 'spell', tag: 'tr-generalised', cefr: lv, correct: 0, ms: 0, hinted: 0, fast: 0, mode: 'spell-shape', given: text.slice(0, 400), expected: String(sc.tip).slice(0, 300) }]); } catch (e) {}
      return;
    }
    btn.disabled = true; out.innerHTML = '<div class="lab-wait"><span class="lab-spin"></span> The coach is reading your line…</div>';
    var Lab = global.Lab, L = global.LabContent, li = Lab && Lab.levelInfo ? Lab.levelInfo(lv) : { id: lv, band: '', pct: 40 };
    var k = kindOf(s.key), b = BUDGET[k] || [3, 14], g = guide(s.key);
    var payload = { kind: 'variable', level: li.id, band: li.band, pct: li.pct || 40,
      prompt: { text: pr.text, type: (C().TYPES[pr.type] || {}).name || pr.type, demand: (C().TYPES[pr.type] || {}).demand || '' },
      variable: { key: s.key, label: lab.name, does: g.does || lab.hint, form: g.form || '' },
      value: text, value2: null, words: words(text), budget: { lo: b[0], hi: b[1] }, inContext: [], filled: [] };
    var offline = function () {
      var v = sc.soft ? 'Shape: fine. ' + sc.tip : 'Shape: right for ' + lab.name.toLowerCase() + '. The coach is off today, so this is the Ward check only.';
      out.innerHTML = '<ul class="ftnotes ok"><li>' + esc(v) + '</li></ul>';
      finish(host, s, text, v, true, 'spell-offline');
      setTimeout(function () { paint(el, host); }, 900);
    };
    if (!Lab || !Lab.spellCoach || !L) { offline(); return; }
    Lab.spellCoach(host.p.studentId, payload).then(function (coach) {
      var fn = coach && coach.fn ? coach.fn : {}, good = fn.verdict === 'meets' || fn.verdict === 'partly';
      var lines = [];
      if (fn.verdict) lines.push((fn.verdict === 'meets' ? 'Does its job. ' : fn.verdict === 'partly' ? 'Partly does its job. ' : 'Not yet. ') + (fn.comment || ''));
      if (coach && coach.relevance && coach.relevance.ok === false) lines.push('Relevance: ' + (coach.relevance.note || 'keep it on the prompt.'));
      if (coach && coach.fit && coach.fit.ok === false) lines.push('Fit: ' + (coach.fit.note || 'check the grammar of the lead-in.'));
      (coach && coach.errors || []).slice(0, 3).forEach(function (e) { if (e && e.original && e.correction && e.original !== e.correction) lines.push('"' + e.original + '" → "' + e.correction + '"' + (e.explain ? ': ' + e.explain : '')); });
      if (coach && coach.tip) lines.push(coach.tip);
      var v = lines.join(' ');
      out.innerHTML = '<ul class="ftnotes ' + (good ? 'ok' : 'no') + '">' + lines.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
      finish(host, s, text, v, true, 'spell-coach');
      setTimeout(function () { paint(el, host); }, 1800);
    }).catch(function () { offline(); });
  }

  global.DailySpell = { paint: paint, today: today, SPELL_XP: SPELL_XP };
})(window);
