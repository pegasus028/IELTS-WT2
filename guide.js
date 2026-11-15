/* ===========================================================================
   QUILLMOOR ACADEMY · THE SCRIPTORIUM — guide.js  (15 Nov 2026)
   High and Medium guidance for IELTS Writing Task 2: one question per decision
   (triage, introduction, body A, body B, conclusion), and the essay is built in
   four panes as she answers. Ported from the Task 1 app (IELTS-WT1 guide.js,
   12–13 Nov 2026). Scripts: guide/<promptId>.js, listed in guide-index.js.
   Contract: docs/GUIDANCE-LEVELS.md. Standard: docs/GUIDE-AUTHORING-T2.md.

   HIGH    every step is multiple choice with one right answer. A wrong option
           is greyed out and its hint appears (never the answer); she chooses
           again until she is right.
   MEDIUM  the same steps as free text with a Commit button. A rule check runs
           first, then the AI check (cfg.check → the lab.guideCheck action). A
           "revise" verdict shows a hint; she edits and commits again, or keeps
           her answer unchanged (an override).

   Guide.has(promptId)            → is there a script for this prompt?
   Guide.ready(promptId)          → is it loaded?   Guide.load(promptId, done)
   Guide.script(promptId)         → the script
   Guide.steps(script)            → flat [{ step, section, first, n, of }] in order
   Guide.essay(script, answers)   → { panes:[4], text }   answers = { stepId: text }
   Guide.key(script)              → { stepId: the right option } (tests, High)
   Guide.options(step)            → the four options in a fixed shuffled order
   Guide.localCheck(step, entry, script) → { verdict:'accept'|'revise'|'unsure', hint }
   Guide.mount(host, cfg)         → { stop, text }
        cfg = { prompt, level:'high'|'medium', tier, studentId, check(payload)→Promise, onSubmit(res), onQuit(info), onResume(i, n) }
   ES5 only (old iPads).
   =========================================================================== */
(function (global) {
  'use strict';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function scripts() { return global.GUIDE_SCRIPTS || {}; }
  /* A script lives in guide/<promptId>.js and is fetched the first time it is needed, so the app's start
     does not slow down. guide-index.js lists the prompts that have one. has() = there is a script; ready() = it is loaded. */
  function index() { return global.GUIDE_INDEX || []; }
  function ready(id) { return !!(id && scripts()[id]); }
  /* Mock prompts never get a script (CONTENT.MOCK_PROMPTS stay unseen until the mock). */
  function isMock(id) { var m = (global.CONTENT && global.CONTENT.MOCK_PROMPTS) || []; for (var i = 0; i < m.length; i++) if (m[i] && m[i].id === id) return true; return false; }
  function has(id) { return !isMock(id) && (ready(id) || index().indexOf(id) >= 0); }
  var loading = {};
  function load(id, done) {
    if (ready(id)) { done(true); return; }
    if (!has(id) || !global.document) { done(false); return; }
    if (loading[id]) { loading[id].push(done); return; }
    loading[id] = [done];
    var s = global.document.createElement('script'), fin = function (ok) { var q = loading[id] || []; delete loading[id]; q.forEach(function (f) { try { f(ok && ready(id)); } catch (e) {} }); };
    s.src = 'guide/' + id + '.js?v=' + (global.GUIDE_VERSION || '1'); s.async = true;
    s.onload = function () { fin(true); }; s.onerror = function () { fin(false); };
    global.document.head.appendChild(s);
  }
  function script(id) { return isMock(id) ? null : scripts()[id] || null; }
  function hashStr(x) { var h = 7; x = String(x); for (var i = 0; i < x.length; i++) h = (h * 31 + x.charCodeAt(i)) % 1000003; return h; }
  function mmss(s) { var m = Math.floor(s / 60), x = s % 60; return m + ':' + (x < 10 ? '0' : '') + x; }
  function wordsOf(t) { var m = String(t || '').trim().match(/[A-Za-z0-9][A-Za-z0-9'’.,%$-]*/g); return m ? m.length : 0; }

  function steps(sc) {
    var out = [];
    (sc.sections || []).forEach(function (sec) {
      (sec.steps || []).forEach(function (st, i) { out.push({ step: st, section: sec, first: i === 0, n: i + 1, of: sec.steps.length }); });
    });
    return out;
  }
  function key(sc) { var k = {}; steps(sc).forEach(function (x) { k[x.step.id] = x.step.ok; }); return k; }

  /* The four options in an order that is fixed for the step (so a reload does not move them) and spread over the positions. */
  function options(st) {
    var opts = [{ t: st.ok, ok: true }].concat((st.wrong || []).map(function (w) { return { t: w[0], hint: w[1] }; }));
    var h = hashStr(st.id + '·order'), out = [];
    while (opts.length) { var i = h % opts.length; out.push(opts.splice(i, 1)[0]); h = Math.floor(h / 4) + hashStr(st.id + out.length); }
    return out;
  }

  /* ----------------------------------------------------------- the essay */
  function cap(t) { return t.replace(/^(\s*[:;.,]?\s*)([a-z])/, function (m, a, b) { return a + b.toUpperCase(); }); }
  /* What she typed, made ready for its place: no doubled punctuation, no stray spaces. */
  function tidy(st, raw) {
    var t = String(raw == null ? '' : raw).replace(/\s+/g, ' ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").trim();
    var pre = st.pre == null ? ' ' : st.pre, post = st.post || '';
    if (/,/.test(pre)) t = t.replace(/^[,;]\s*/, '');
    if (/\./.test(pre)) t = t.replace(/^\.\s*/, '');
    /* the engine supplies every sentence end (post '.', or the next step's pre '. '), so her own closing marks go */
    if (post) { while (t && '.,;:!?'.indexOf(t.charAt(t.length - 1)) >= 0) t = t.slice(0, -1).trim(); }
    else t = t.replace(/[,;.!?]+$/, '').trim();
    t = t.replace(/^([.:;])\s*/, '$1 ');
    return t;
  }
  function essay(sc, answers) {
    var panes = ['', '', '', ''];
    (sc.sections || []).forEach(function (sec) {
      if (sec.pane == null) return;
      var out = panes[sec.pane] || '';
      (sec.steps || []).forEach(function (st) {
        var a = answers[st.id]; if (a == null || a === '') return;
        var t = tidy(st, a), pre = st.pre == null ? ' ' : st.pre;
        if (!out) pre = '';
        /* she typed her own full stop (". This means"): no space before it */
        if (/^[.:;,]/.test(t)) pre = '';
        if (!out || /[.!?]\s*$/.test(out + pre) || /^[.]\s*/.test(t)) t = cap(t);
        out += pre + t + (st.post || '');
      });
      panes[sec.pane] = out.replace(/\s+([,.;:])/g, '$1').replace(/([,.;:])\1+/g, '$1').replace(/,\./g, '.').replace(/\s{2,}/g, ' ').trim();
    });
    return { panes: panes, text: panes.filter(Boolean).join('\n\n') };
  }
  /* The pane as it stands before this step (the sentence so far). */
  function soFar(sc, answers, stepId) {
    var cut = {}, hit = false, pane = null;
    steps(sc).forEach(function (x) { if (x.step.id === stepId) { hit = true; pane = x.section.pane; } if (!hit && answers[x.step.id] != null) cut[x.step.id] = answers[x.step.id]; });
    return pane == null ? '' : essay(sc, cut).panes[pane];
  }

  /* --------------------------------------------- Medium: the rule check */
  function norm(t) { return String(t || '').toLowerCase().replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').replace(/^\s+|\s+$/g, '').replace(/[.,;!]+$/, '').trim(); }
  function rx(src) { try { return new RegExp(src, 'i'); } catch (e) { return null; } }
  var NOT_YET = 'Not yet. Read the question again and compare your answer with the prompt and your plan.';
  /* accept: every rule passes and no known slip → 'accept' (st.ai asks the AI for a second opinion);
     a known slip → 'revise' with its own hint; anything else → 'unsure' (the AI decides, or the step hint is shown). */
  function localCheck(st, entry, sc) {
    var t = norm(entry);
    if (!t) return { verdict: 'revise', hint: 'Write your answer first.', empty: true };
    /* a name typed without its capitals */
    var proper = (sc && sc.proper) || [], raw = String(entry || '');
    for (var pi = 0; pi < proper.length; pi++) {
      /* whole words only: "US" must not catch "much" or "bus" */
      var pq = proper[pi].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp('(^|[^a-z0-9])' + pq.toLowerCase() + '([^a-z0-9]|$)').test(t) && !new RegExp('(^|[^A-Za-z0-9])' + pq + '([^A-Za-z0-9]|$)').test(raw)) return { verdict: 'revise', hint: 'Check the capital letters: names keep them.', known: true };
    }
    if (t === norm(st.ok)) return { verdict: 'accept', exact: true };
    var rj = st.reject || [];
    for (var i = 0; i < rj.length; i++) { var r = rx(rj[i].re); if (r && r.test(t)) return { verdict: 'revise', hint: rj[i].hint, known: true }; }
    var groups = st.accept || [];
    var all = groups.length > 0 && groups.every(function (g) { return g.some(function (alt) { var r2 = rx(alt); return r2 && r2.test(t); }); });
    return all ? { verdict: 'accept' } : { verdict: 'unsure', hint: st.hint || NOT_YET };
  }
  /* A hint must not hand over the answer: used on what the AI sends back. */
  function leaks(st, hint) {
    var a = norm(st.ok).replace(/^[:;.,]\s*/, ''), h = norm(hint);
    if (!a) return false;
    if (a.length >= 4) return h.indexOf(a) >= 0;
    /* a short answer (a connector, a preposition): only when the hint quotes it or it is a number */
    var q = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return /^\d+$/.test(a) ? new RegExp('(^|[^0-9])' + q + '([^0-9]|$)').test(h) : new RegExp('["\'“‘]' + q + '["\'”’]').test(h);
  }

  /* ---------------------------------------------------------------- UI */
  var LEVEL_NAME = { high: 'High guidance', medium: 'Medium guidance' };
  var PANE_NAME = ['Introduction', 'Body A', 'Body B', 'Conclusion'], PANE_TARGET = [50, 95, 95, 45];
  var PANE_EMPTY = ['Your introduction appears here.', 'Your first body paragraph appears here.', 'Your second body paragraph appears here.', 'Your conclusion appears here.'];

  function mount(host, cfg) {
    var W = global.Writer, PR = global.Prompts, p = typeof cfg.prompt === 'string' ? PR.get(cfg.prompt) : cfg.prompt, sc = script(p.id), level = cfg.level === 'medium' ? 'medium' : 'high';
    var flat = steps(sc), high = level === 'high', tier = sc.tier || cfg.tier || 'B2';
    var saveKey = 'pc.guide.v1.' + String(cfg.studentId || 'me').toLowerCase() + '.' + p.id + '.' + level;
    var state = { i: 0, answers: {}, tries: {}, hints: {}, over: {}, ai: {}, off: {}, t0: Date.now(), carried: 0, done: false, tick: null, busy: false, last: null, polished: false, lastHint: {}, lastEntry: {}, draft: {} };

    /* a run that was left half-way (a reload, a closed tab) comes back */
    try {
      var sv = JSON.parse(global.localStorage.getItem(saveKey) || 'null');
      if (sv && sv.version === (sc.version || 1) && sv.i > 0 && sv.i <= flat.length) {
        state.i = sv.i; state.answers = sv.answers || {}; state.tries = sv.tries || {}; state.hints = sv.hints || {}; state.over = sv.over || {}; state.ai = sv.ai || {}; state.off = sv.off || {}; state.lastHint = sv.lastHint || {}; state.polishText = sv.polish || null; state.carried = sv.seconds || 0; state.resumed = true;
      }
    } catch (e) {}
    function seconds() { return state.carried + Math.round((Date.now() - state.t0) / 1000); }
    function persist() {
      try { global.localStorage.setItem(saveKey, JSON.stringify({ version: sc.version || 1, i: state.i, answers: state.answers, tries: state.tries, hints: state.hints, over: state.over, ai: state.ai, off: state.off, lastHint: state.lastHint, polish: state.polished ? paneTexts() : null, seconds: seconds() })); } catch (e) {}
    }
    function forget() { try { global.localStorage.removeItem(saveKey); } catch (e) {} }

    host.innerHTML = '<div class="wr gd gd-' + level + '">' +
      '<div class="wr-top">' +
        '<button class="btn ghost sm" id="wr-quit" aria-label="Leave">✕</button>' +
        '<div class="wr-phases" id="gd-secs">' + sc.sections.map(function (s, i) { return '<span data-s="' + i + '">' + esc(s.title.split(' · ')[0]) + '</span>'; }).join('') + '</div>' +
        '<span class="wr-words" id="wr-words">0 words</span>' +
        '<span class="wr-clock" id="wr-clock" title="Time spent. No time limit at this level.">0:00</span>' +
      '</div>' +
      '<div class="gd-bar" aria-hidden="true"><i id="gd-bar"></i></div>' +
      '<div class="wr-grid">' +
        '<div class="wr-left gd-left">' + PR.card(p, { demand: true }) +
          '<div class="card gd-triage" id="gd-triage"><div class="wr-boxh"><b>Your plan</b><span class="tiny">not counted as words</span></div><ul id="gd-tlist"></ul></div></div>' +
        '<div class="wr-right">' +
          '<p class="tiny gd-lead"><b>' + LEVEL_NAME[level] + '.</b> ' + (high
            ? 'One decision at a time. Each right choice writes the next piece of your essay in the boxes below. A wrong choice is greyed out and you get a hint, then you choose again.'
            : 'One decision at a time, in your own words. Press Commit and your answer is checked. If the check asks you to look again, you can change your answer or keep it as it is.') + ' No clock: take the time you need.</p>' +
          '<div class="card gd-q" id="gd-q" aria-live="polite"></div>' +
          [0, 1, 2, 3].map(function (i) {
            return '<div class="wr-box gd-pane" id="gd-box' + i + '"><div class="wr-boxh"><b>' + PANE_NAME[i] + '</b><span class="tiny">~' + PANE_TARGET[i] + ' words · <i id="gd-w' + i + '">0</i></span></div><div class="gd-text" id="gd-p' + i + '"></div></div>';
          }).join('') +
          '<div id="wr-panel"></div>' +
        '</div>' +
      '</div></div>';

    var q = host.querySelector('#gd-q');

    function paneTexts() {
      if (state.polished) return [0, 1, 2, 3].map(function (i) { var ta = host.querySelector('#gd-ta' + i); return ta ? ta.value.trim() : ''; });
      return essay(sc, state.answers).panes;
    }
    function text() { return paneTexts().filter(Boolean).join('\n\n'); }

    function paintPanes() {
      if (state.polished) { paintCount(); return; }
      var panes = essay(sc, state.answers).panes, before = state.last ? soFar(sc, state.answers, state.last) : null, lastPane = null;
      if (state.last) flat.forEach(function (x) { if (x.step.id === state.last) lastPane = x.section.pane; });
      [0, 1, 2, 3].forEach(function (i) {
        var el = host.querySelector('#gd-p' + i), t = panes[i];
        if (!t) el.innerHTML = '<span class="gd-empty">' + PANE_EMPTY[i] + '</span>';
        else if (i === lastPane && before != null && t.indexOf(before) === 0 && before.length < t.length) el.innerHTML = esc(before) + '<mark class="gd-new">' + esc(t.slice(before.length)) + '</mark>';
        else el.innerHTML = esc(t);
        host.querySelector('#gd-box' + i).classList.toggle('on', !state.done && !!flat[state.i] && flat[state.i].section.pane === i);
      });
      /* the plan: the triage answers */
      var tl = host.querySelector('#gd-tlist'), rows = [];
      flat.forEach(function (x) { if (x.section.pane == null && state.answers[x.step.id] != null) rows.push('<li><span>' + esc(x.step.label) + '</span><b>' + esc(state.answers[x.step.id]) + '</b></li>'); });
      tl.innerHTML = rows.join('') || '<li class="gd-empty">The type, its parts, the trap and your two sides appear here.</li>';
      paintCount();
    }
    function paintCount() {
      var ps = paneTexts();
      ps.forEach(function (t, i) { var w = host.querySelector('#gd-w' + i); if (w) w.textContent = wordsOf(t); });
      host.querySelector('#wr-words').textContent = wordsOf(ps.join(' ')) + ' words';
      host.querySelector('#gd-bar').style.width = Math.round(100 * Math.min(state.i, flat.length) / flat.length) + '%';
      var cur = state.done ? sc.sections.length : sc.sections.indexOf((flat[state.i] || {}).section);
      Array.prototype.forEach.call(host.querySelectorAll('#gd-secs span'), function (s, i) { s.classList.toggle('on', i === cur); s.classList.toggle('past', i < cur); });
    }

    function contextLine(x) {
      if (x.section.pane == null) return '';
      var sf = soFar(sc, state.answers, x.step.id), pre = x.step.pre == null ? ' ' : x.step.pre;
      if (!sf) pre = '';
      var tail = sf.length > 180 ? '… ' + sf.slice(sf.length - 180).replace(/^\S*\s/, '') : sf;
      return '<p class="gd-ctx"><span class="tiny">Your ' + esc(PANE_NAME[x.section.pane].toLowerCase()) + ' so far</span>' + esc(tail) + esc(pre) + '<span class="gd-gap">' + (high ? '?' : 'your words') + '</span>' + esc(x.step.post || '') + '</p>';
    }

    function paintStep() {
      var x = flat[state.i];
      if (!x) { finishCard(); return; }
      var st = x.step, off = state.off[st.id] || {};
      var h = '<p class="kicker">' + esc(x.section.title) + ' · step ' + x.n + ' of ' + x.of + ' · ' + esc(st.label) + '</p>' +
        (x.first && x.section.note ? '<p class="gd-note">' + esc(x.section.note) + '</p>' : '') +
        contextLine(x) + '<h3 class="gd-ask">' + esc(high ? st.ask : (st.askFree || st.ask)) + '</h3>';
      if (high) {
        h += '<div class="gd-opts" role="group" aria-label="Choose one">' + options(st).map(function (o, i) {
          return '<button type="button" class="gd-opt' + (off[o.t] ? ' off' : '') + '" data-o="' + i + '"' + (off[o.t] ? ' disabled aria-disabled="true"' : '') + '>' + esc(o.t) + '</button>';
        }).join('') + '</div>';
      } else {
        var long = (st.shape && /clause|sentence/i.test(st.shape)) || String(st.ok || '').length > 60;
        h += '<p class="tiny gd-shape">Type: ' + esc(st.shape || 'your answer') + '</p>' +
          '<div class="gd-free">' + (long
            ? '<textarea id="gd-in" rows="3" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="300" aria-label="' + esc(st.label) + '">' + esc(state.draft[st.id] || '') + '</textarea>'
            : '<input type="text" id="gd-in" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="300" value="' + esc(state.draft[st.id] || '') + '" aria-label="' + esc(st.label) + '">') +
          '<button type="button" class="btn primary" id="gd-commit">Commit</button></div>';
      }
      h += '<div class="gd-hint hidden" id="gd-hint" role="status"></div>' +
        '<p class="tiny gd-foot">Step ' + (state.i + 1) + ' of ' + flat.length + (state.i > 0 ? ' · <button type="button" class="linky" id="gd-restart">start again</button>' : '') + '</p>';
      q.innerHTML = h;
      if (state.lastHint[st.id]) showHint(st, state.lastHint[st.id], !high);
      if (!high) { var inp = q.querySelector('#gd-in'); if (inp && !state.resumedPaint) { try { inp.focus({ preventScroll: true }); } catch (e) { } } }
      state.resumedPaint = false;
    }

    function showHint(st, hint, withKeep, note) {
      var hb = q.querySelector('#gd-hint'); if (!hb) return;
      state.lastHint[st.id] = hint;
      hb.classList.remove('hidden');
      hb.innerHTML = '<b>Hint</b><span>' + esc(hint) + '</span>' + (note ? '<em class="tiny">' + esc(note) + '</em>' : '') +
        (withKeep ? '<div class="gd-keep"><span class="tiny">Change your answer and press Commit again, or</span> <button type="button" class="linky" id="gd-keep">keep my answer as it is</button></div>' : '');
    }

    function accept(st, value, how) {
      state.answers[st.id] = value; state.last = st.id;
      if (how === 'override') state.over[st.id] = 1;
      delete state.lastHint[st.id]; delete state.draft[st.id];
      state.i++; persist(); paintPanes();
      paintStep();
      /* keep the question in view: on a phone the panes sit below it */
      try {
        if (global.innerWidth < 860) q.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        else if (global.scrollY > 0 && q.getBoundingClientRect().top < 0) q.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {}
      var fo = q.querySelector(high ? '.gd-opt:not([disabled])' : '#gd-in'); if (fo && high) { try { fo.focus({ preventScroll: true }); } catch (e2) {} }
    }

    /* ------------------------------------------------ High: the options */
    q.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('button') : null; if (!b || state.busy) return;
      var x = flat[state.i]; if (!x) return; var st = x.step;
      if (b.getAttribute('data-o') != null && high) {
        var o = options(st)[parseInt(b.getAttribute('data-o'), 10)]; if (!o) return;
        state.tries[st.id] = (state.tries[st.id] || 0) + 1;
        if (o.ok) {
          b.classList.add('right'); state.busy = true;
          setTimeout(function () { state.busy = false; accept(st, st.ok, 'choice'); }, 380);
        } else {
          (state.off[st.id] = state.off[st.id] || {})[o.t] = 1; state.hints[st.id] = (state.hints[st.id] || 0) + 1;
          b.classList.add('off'); b.disabled = true; b.setAttribute('aria-disabled', 'true');
          showHint(st, o.hint || 'Not this one. Read the prompt again.');
          persist();
        }
      } else if (b.id === 'gd-commit') { commit(st, false); }
      else if (b.id === 'gd-keep') { commit(st, true); }
      else if (b.id === 'gd-restart') {
        if (!global.confirm('Start this essay again from the first step? Your answers so far will be cleared.')) return;
        forget(); state.polishText = null; state.i = 0; state.answers = {}; state.tries = {}; state.hints = {}; state.over = {}; state.ai = {}; state.off = {}; state.lastHint = {}; state.draft = {}; state.last = null; state.carried = 0; state.t0 = Date.now();
        paintPanes(); paintStep();
      }
    });
    q.addEventListener('keydown', function (ev) {
      /* Enter commits from the one-line box; in the bigger box Enter commits too (a line break is never wanted in a piece) */
      if (ev.key === 'Enter' && ev.target && ev.target.id === 'gd-in') { ev.preventDefault(); var x = flat[state.i]; if (x && !state.busy) commit(x.step, false); }
    });
    q.addEventListener('input', function (ev) { if (ev.target && ev.target.id === 'gd-in') { var x = flat[state.i]; if (x) state.draft[x.step.id] = ev.target.value; } });

    /* ---------------------------------------------- Medium: the commit */
    function commit(st, keep) {
      var inp = q.querySelector('#gd-in'); if (!inp) return;
      var entry = inp.value.replace(/\s+/g, ' ').trim();
      if (!entry) { showHint(st, 'Write your answer first.'); return; }
      if (keep) { accept(st, entry, 'override'); return; }
      state.tries[st.id] = (state.tries[st.id] || 0) + 1;
      var lc = localCheck(st, entry, sc), nth = state.tries[st.id];
      function revise(hint, note) {
        state.hints[st.id] = (state.hints[st.id] || 0) + 1; state.lastEntry[st.id] = entry;
        showHint(st, hint || st.hint || NOT_YET, true, note); persist();
      }
      if (lc.verdict === 'revise') { revise(nth >= 3 && st.hint2 ? st.hint2 : lc.hint); return; }
      if (lc.verdict === 'accept' && (lc.exact || !st.ai || !cfg.check)) { accept(st, entry, 'rule'); return; }
      if (!cfg.check) { revise(nth >= 2 && st.hint2 ? st.hint2 : lc.hint); return; }
      /* the AI check: a second reader for wording the rules do not know */
      var btn = q.querySelector('#gd-commit'), was = state.i;
      state.busy = true; btn.disabled = true; btn.textContent = 'Checking…'; inp.readOnly = true;
      var payload = { promptId: p.id, stepId: st.id, section: (flat[state.i].section.title || '').split(' · ')[0], ask: st.askFree || st.ask, expect: st.expect || st.ok, entry: entry, soFar: soFar(sc, state.answers, st.id) };
      var settled = false;
      var settle = function (r) {
        if (settled || state.quit) return; settled = true;
        if (state.i !== was || state.done || !q.querySelector('#gd-in')) return;
        state.busy = false; btn.disabled = false; btn.textContent = 'Commit'; inp.readOnly = false;
        if (r && r.ok && r.verdict === 'accept') { state.ai[st.id] = 'accept'; accept(st, entry, 'ai'); return; }
        if (r && r.ok && r.verdict === 'revise') {
          state.ai[st.id] = 'revise';
          var hint = r.hint && !leaks(st, r.hint) ? r.hint : (nth >= 2 && st.hint2 ? st.hint2 : st.hint);
          revise(hint, 'From the AI check. If you are sure of your answer, you may keep it.'); return;
        }
        /* no AI (offline, old server, budget spent, too slow): the rules decide */
        if (lc.verdict === 'accept') { accept(st, entry, 'rule'); return; }
        revise(nth >= 2 && st.hint2 ? st.hint2 : lc.hint);
      };
      var pr;
      try { pr = cfg.check(payload); } catch (e) { pr = null; }
      if (!pr || typeof pr.then !== 'function') { settle(null); return; }
      /* a slow server must not hold her up: after twelve seconds the rules decide */
      setTimeout(function () { settle(null); }, 12000);
      pr.then(settle, function () { settle(null); });
    }

    /* ------------------------------------------------------ the finish */
    function tally() {
      var first = 0, missTags = {}, over = Object.keys(state.over).length;
      flat.forEach(function (x) {
        var id = x.step.id;
        if ((state.tries[id] || 0) <= 1 && !state.over[id] && !state.hints[id]) first++;
        else if (x.step.tag) missTags[x.step.tag] = (missTags[x.step.tag] || 0) + 1;
      });
      return { level: level, steps: flat.length, firstTry: first, overrides: over, overridden: Object.keys(state.over), missTags: missTags, version: sc.version || 1,
        tries: state.tries, ai: state.ai };
    }
    function finishCard() {
      state.done = true; state.last = null;
      var t = tally();
      /* Medium: the four panes open for a last polish */
      if (!high && !state.polished) {
        var panes = state.polishText && state.polishText.length === 4 ? state.polishText : essay(sc, state.answers).panes;
        [0, 1, 2, 3].forEach(function (i) {
          var el = host.querySelector('#gd-p' + i);
          el.outerHTML = '<textarea class="gd-ta" id="gd-ta' + i + '" rows="' + (i === 0 || i === 3 ? 4 : 7) + '" spellcheck="false" aria-label="' + PANE_NAME[i] + '">' + esc(panes[i]) + '</textarea>';
        });
        state.polished = true;
        Array.prototype.forEach.call(host.querySelectorAll('.gd-ta'), function (ta) { ta.addEventListener('input', function () { paintCount(); persist(); }); });
      }
      paintPanes();
      Array.prototype.forEach.call(host.querySelectorAll('.gd-pane'), function (b) { b.classList.remove('on'); });
      q.innerHTML = '<p class="kicker">' + LEVEL_NAME[level] + ' · finished</p><h3 class="gd-ask">Your essay is built.</h3>' +
        '<p class="gd-note"><b>' + t.firstTry + ' of ' + t.steps + '</b> decisions right the first time' + (t.overrides ? ', and you kept your own answer ' + t.overrides + ' time' + (t.overrides > 1 ? 's' : '') : '') + '.</p>' +
        (high ? '<p class="tiny">Read the four paragraphs as one essay. Find your position at the end of the introduction and again, in new words, in the conclusion. In each body paragraph, find the idea, how it works, the example and the limit.</p>'
          : '<p class="tiny">The four paragraphs are yours to polish now: read them aloud once, fix any join that sounds wrong, then run the Wards.</p>') +
        '<button type="button" class="btn primary wide" id="gd-wards">The Ten Wards →</button>';
      q.querySelector('#gd-wards').addEventListener('click', wards);
      persist();
    }
    function wardOpts() { return { share: tier === 'C1' ? 0.3 : 0.4, practice: true }; }
    function wards() {
      var t = text(), pre = W.preflight(t, p, wardOpts()), pn = host.querySelector('#wr-panel');
      pn.innerHTML = '<div class="card preflight"><div class="pf-h"><b>The Ten Wards</b><span class="pill ' + (pre.bad ? 'bad' : pre.warn ? 'gold' : 'good') + '">' + esc(pre.summary) + '</span></div>' +
        pre.rows.map(function (r) { return '<div class="pf-row ' + r.status + '"><span class="pf-dot"></span><div><b>' + esc(r.label) + '</b><p>' + esc(r.note) + '</p></div></div>'; }).join('') +
        '<p class="tiny" style="margin-top:10px">' + (high ? 'This essay was built from your choices, so it goes to T.Chris but not to the examiners for a band. Next, write this prompt at Medium guidance, in your own words.' : 'Checks, not marks: the Wards look at structure only.') + '</p>' +
        '<div class="qfoot" style="margin-top:12px"><span class="grow"></span><button class="btn primary" id="wr-submit">Send the essay</button></div></div>';
      try { pn.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
      pn.querySelector('#wr-submit').addEventListener('click', function () { send(); });
    }
    function send() {
      if (state.sent) return; state.sent = true; stop();
      var t = text(), g = tally(), pre = W.preflight(t, p, wardOpts());
      var vars = {}; flat.forEach(function (x) { if (x.step.v && state.answers[x.step.id] != null) vars[x.step.v] = (vars[x.step.v] ? vars[x.step.v] + ' ' : '') + state.answers[x.step.id]; });
      var plan = { vars: vars, triage: {}, guide: g };
      flat.forEach(function (x) { if (x.section.pane == null && state.answers[x.step.id] != null) plan.triage[x.step.id] = state.answers[x.step.id]; });
      /* Writer.lastMeta() contract: High = the app's text (own share 0, half merits in engine.js); Medium = her own words */
      var meta = { ownShare: high ? 0 : 1, ownSentences: high ? 0 : W.sentences(t).length, fillUsed: false, landTaps: null, landAgree: null, revisionOf: '', reviseRow: '' };
      forget();
      if (cfg.onSubmit) cfg.onSubmit({ promptId: p.id, mode: level, tier: tier, text: t, words: W.words(t), seconds: seconds(), timedOut: false,
        preflight: pre, revision: 0, firstText: '', firstPreflight: null, meta: meta, revisionOf: '', reviseRow: '', plan: plan, guide: g });
    }

    state.tick = setInterval(function () {
      var c = host.querySelector('#wr-clock'); if (!c) { clearInterval(state.tick); return; }
      c.textContent = mmss(seconds());
    }, 1000);
    function stop() { clearInterval(state.tick); }
    host.querySelector('#wr-quit').addEventListener('click', function () {
      state.quit = true; persist(); stop();
      if (cfg.onQuit) cfg.onQuit(state.i > 0 && !state.sent ? { saved: true, step: state.i, of: flat.length } : null);
    });

    state.resumedPaint = true;
    paintPanes(); paintStep();
    if (state.resumed && cfg.onResume) cfg.onResume(state.i, flat.length);
    return { stop: stop, text: text, restart: function () { forget(); } };
  }

  global.Guide = { has: has, ready: ready, load: load, script: script, steps: steps, key: key, options: options, essay: essay, soFar: soFar, tidy: tidy, localCheck: localCheck, leaks: leaks, mount: mount, LEVEL_NAME: LEVEL_NAME, PANE_NAME: PANE_NAME, PANE_TARGET: PANE_TARGET };
})(typeof window !== 'undefined' ? window : this);
