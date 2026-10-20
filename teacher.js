/* ===========================================================================
   QUILLMOOR ACADEMY (was Position Control) — teacher.js  (the Staff Room,
   formerly the Flight Deck)
   Class view (stats, House Cup, roster by cohort with chapter and house,
   heat map, module bars, student detail with diagnosis, reports and story
   controls), the marking queue, assignments (owl post) and projector mode.

   Story orders (Oct 2026). "Unlock up to chapter N", "Unlock all chapters"
   and "Re-sort" are stored as ordinary assignment rows through the existing
   `assignments` action, so the back end needed no change:
     { id, ts, kind:'unlock', studentId | cohort, chapter }
     { id, ts, kind:'resort', studentId }
   The student console applies them and never lists them as owl post; this
   console keeps them in their own list, apart from the essays it sets.

   Your five (19 Oct 2026). The five prompts a student works (one per question
   type) ride the same path: { id, ts, kind:'coreset', studentId | cohort,
   prompts:[5 ids] }. Her own latest row wins over her cohort's; with no row
   the app's default five apply (student.js CORE_DEFAULT, mirrored below).
   The class table and her panel flag essays that are mostly frame (own words
   under 30%), the Landing Check agreement and revisions.

   Version check (19 Oct 2026). ping returns the backend's APP_VERSION; when it
   is missing or older than EXPECTED_BACKEND a banner asks for a redeploy.
   =========================================================================== */
(function () {
  'use strict';
  var C = window.CONTENT, E = window.Engine, P = E.Progress, api = window.API, W = window.Writer, PR = window.Prompts;
  var LEVELUP = window.PC_LEVELUP_URL || 'https://pegasus028.github.io/LevelUp/';
  var $ = function (s) { return document.querySelector(s); };
  var esc = E.esc;
  /* WP1: the Code.gs build this front end needs (Code.gs APP_VERSION). One constant: change both together. */
  var EXPECTED_BACKEND = '20261020';
  /* Your five: the same default and teaching order as student.js (Discuss → Advantages → Opinion → Problem → Two-part). */
  var CORE_TYPES = ['DISCUSS', 'ADVANTAGE', 'OPINION', 'PROBLEM', 'TWOPART'];
  var CORE_DEFAULT = { DISCUSS: 'p-fast-food-tax', ADVANTAGE: 'p-cctv-everywhere', OPINION: 'p-free-transport', PROBLEM: 'p-youth-unemployment', TWOPART: 'p-rural-youth' };
  var CORE_AVOID = { 'p-tourism': 1, 'p-teen-jobs': 1, 'p-teen-sleep': 1 };
  var OWN_MIN = 0.3;
  var BOX = { intro: 'Introduction', bodyA: 'Body A', bodyB: 'Body B', conclusion: 'Conclusion' };
  var T = { roster: [], reports: [], assignments: [], sel: null, detail: null, q: '', sort: 'ready', dir: -1, cohort: 'all', view: 'class', markSel: null, markFilter: 'queue', proj: null };

  function toast(m) {
    $('#toast-slot').innerHTML = '<div style="position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:100;background:var(--ink);color:var(--ground);padding:11px 18px;border-radius:99px;font-size:.9rem;font-weight:600;box-shadow:var(--shadow-l)">' + esc(m) + '</div>';
    clearTimeout(toast._t); toast._t = setTimeout(function () { $('#toast-slot').innerHTML = ''; }, 2600);
  }
  function pct(x) { return Math.round((x || 0) * 100); }
  function ago(iso) { if (!iso) return '—'; var d = Math.floor((Date.now() - new Date(iso)) / 86400000); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d < 30 ? d + 'd ago' : new Date(iso).toLocaleDateString(); }
  function mmss(sec) { var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtBand(b) { return b == null ? '—' : (Math.round(b * 2) / 2).toFixed(1); }
  function typeName(t) { return (C.TYPES[t] || {}).name || t; }
  function bandKey(b, k) { return b[k] != null ? b[k] : (k === 'tr' ? b.ta : undefined); }
  function markOf(r) { return r.released && r.teacher && r.teacher.bands ? r.teacher : (r.ai && r.ai.bands ? r.ai : null); }
  function bandsOf(r) { var m = markOf(r); return m ? m.bands : null; }
  /* ielts.org CEFR alignment: 4–5 ≈ B1, 5.5–6.5 ≈ B2, 7–8 ≈ C1, 8.5+ ≈ C2 ("around", never "is"). */
  function cefrOf(b) { return b >= 8.5 ? 'C2' : b >= 7 ? 'C1' : b >= 5.5 ? 'B2' : b >= 4 ? 'B1' : 'A2'; }

  /* ------------------------------------------------------------ story layer
     House names and colours come from story-content.js when it is loaded;
     the fallback keeps the console working without it. */
  var HOUSES0 = [
    { id: 'compass', name: 'Compass', crit: 'TR', main: '#1F3A5F', accent: '#C0C7D1' },
    { id: 'bridge', name: 'Bridge', crit: 'CC', main: '#1F6F6B', accent: '#B8733A' },
    { id: 'lexicon', name: 'Lexicon', crit: 'LR', main: '#5B2A5E', accent: '#C9A227' },
    { id: 'loom', name: 'Loom', crit: 'GRA', main: '#8E1B2C', accent: '#F1E6CC' }
  ];
  var CHAPTERS0 = ['The Letter', 'The First Duel', 'The Living Map', 'The Spellbook', 'The Potions Lab', 'The Library and the Newsroom', 'The Grand Examination'];
  var NCH = 7;
  function houses() { return (window.STORY && window.STORY.houses && window.STORY.houses.length) ? window.STORY.houses : HOUSES0; }
  function houseOf(id) { return houses().filter(function (h) { return h.id === id; })[0] || null; }
  function chapterTitle(n) { var c = window.STORY && window.STORY.chapters ? window.STORY.chapters.filter(function (x) { return x.n === n; })[0] : null; return c ? c.title : (CHAPTERS0[n - 1] || ''); }
  function storyOf(p) { return (p && p.story) || {}; }
  function houseChip(id) {
    var h = houseOf(id);
    if (!h) return '<span class="hchip none">unsorted</span>';
    return '<span class="hchip" style="background:' + esc(h.main) + ';border-color:' + esc(h.accent) + '">' + esc(h.name) + '</span>';
  }
  function isOrder(a) { return !!a && (a.kind === 'unlock' || a.kind === 'resort' || a.kind === 'coreset' || a.kind === 'challenge'); }
  /* WP10c (20 Oct 2026): the weekly house challenge, set here as a { kind:'challenge' } row. */
  var METRICS = [['essays', 'Essays sent'], ['revisions', 'Revisions sent'], ['words', 'Words written in essays'], ['duels', 'Duels won'], ['merits', 'Merits earned'], ['mended', 'Faults mended']];
  function metricName(k) { var m = METRICS.filter(function (x) { return x[0] === k; })[0]; return m ? m[1] : k; }
  function bkkDate(offsetDays) { return new Date(Date.now() + 7 * 3600000 + (offsetDays || 0) * 86400000).toISOString().slice(0, 10); }
  function orderLabel(a) {
    var who = a.studentId ? 'for ' + a.studentId : a.cohort && a.cohort !== 'all' ? 'for the whole ' + a.cohort + ' cohort' : 'for everyone';
    if (a.kind === 'challenge') return 'House challenge · ' + who + ' · ' + (a.title || metricName(a.metric)) + ' (' + metricName(a.metric) + ') · ' + (a.from || '') + ' to ' + (a.to || '');
    if (a.kind === 'coreset') return 'Five prompts · ' + who + ' · ' + (a.prompts || []).map(function (id) { return (PR.get(id) || {}).title || id; }).join(', ');
    if (a.kind === 'resort') return 'Re-sort · ' + who + ' · she meets the Sorting Lantern again on her next visit';
    var n = Number(a.chapter) || 0;
    return 'Chapter unlock · up to chapter ' + n + (chapterTitle(n) ? ' (' + chapterTitle(n) + ')' : '') + ' · ' + who;
  }
  function uidO() { return 'U' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
  /* Store a story order through the assignments API (same path as an essay). */
  function sendOrder(row, msg) {
    api.assignments('set', row).then(function (r) {
      if (!r || !r.ok) { toast('Could not save: ' + ((r && r.error) || 'try again')); return; }
      T.assignments = (r && r.assignments) || T.assignments.concat([row]);
      toast(msg);
      paintHouseCup(); paintRoster();
      if (T.view === 'assign') paintAssign();
      if (T.sel && row.studentId && row.studentId === T.sel) openStudent(T.sel);
    });
  }
  /* House Cup: house points (story.hp) summed by house, and members, for one cohort. Same sums as the `houses` action. */
  function cupFor(list) {
    var out = { totals: {}, members: {}, unsorted: 0 };
    houses().forEach(function (h) { out.totals[h.id] = 0; out.members[h.id] = 0; });
    list.forEach(function (s) {
      var st = storyOf(s.progress), h = st.house;
      if (!h || out.totals[h] == null) { out.unsorted++; return; }
      var hp = Number(st.hp); if (!isFinite(hp) || hp < 0) hp = 0;
      out.totals[h] += Math.round(hp); out.members[h] += 1;
    });
    return out;
  }

  /* ------------------------------------------------------------ your five */
  function lc(x) { return String(x == null ? '' : x).toLowerCase().trim(); }
  function practicePrompts() { return C.PROMPTS.filter(function (pr) { return !pr.mockOnly; }); }
  function defaultCore() {
    return CORE_TYPES.map(function (t) {
      var want = PR.get(CORE_DEFAULT[t]);
      if (want && want.type === t) return want.id;
      var alt = practicePrompts().filter(function (pr) { return pr.type === t && !CORE_AVOID[pr.id] && pr.vars && pr.vars.A2 && pr.vars.B1; })[0];
      return alt ? alt.id : null;
    }).filter(Boolean);
  }
  /* The row that decides her five: her own latest, else her cohort's (or everyone's) latest. */
  function coreRowFor(id, cohort) {
    var mine = null, cls = null, sid = lc(id), coh = lc(cohort);
    T.assignments.forEach(function (a) {
      if (!a || a.kind !== 'coreset' || !a.prompts || !a.prompts.length) return;
      if (a.studentId) { if (lc(a.studentId) === sid && (!mine || String(a.ts || '') >= String(mine.ts || ''))) mine = a; return; }
      if (!a.cohort || a.cohort === 'all' || lc(a.cohort) === coh) { if (!cls || String(a.ts || '') >= String(cls.ts || '')) cls = a; }
    });
    return mine || cls;
  }
  /* What she works on: the teacher's row (pending until her next visit if her progress has not picked it up),
     else the five her progress carries, else the default. */
  function coreOf(s) {
    var p = s.progress || {}, row = coreRowFor(s.id, cohortOf(s)), cs = p.coreSet;
    if (row) return { prompts: row.prompts.slice(0, 5), by: 'teacher', row: row, pending: !(cs && cs.by === 'teacher' && cs.row === row.id), own: !!row.studentId };
    if (cs && cs.prompts && cs.prompts.length) return { prompts: cs.prompts.slice(), by: cs.by || 'app', pending: cs.by === 'teacher' };
    return { prompts: defaultCore(), by: 'app', pending: false };
  }
  function frameOnly(r) { return r.meritWhy === 'frame' || (typeof r.ownShare === 'number' && r.ownShare < OWN_MIN); }
  /* duel (won) · essay (not mostly frame) · revised · cast (Workshop; from p.lab.castPrompts when lab.js keeps it) */
  function coreSteps(s, id) {
    var p = s.progress || {}, bm = ((p.bootcamp || {}).missions || {})[id], reps = reportsOf(s.id).concat(p.reports || []);
    var seen = {}; reps = reps.filter(function (r) { if (seen[r.id]) return false; seen[r.id] = 1; return true; });
    var lab = p.lab || {};
    return { duel: !!(bm && bm.passed), essay: reps.some(function (r) { return r.promptId === id && r.kind !== 'mock' && !frameOnly(r); }),
      revised: reps.some(function (r) { return r.promptId === id && !!r.revisionOf; }), cast: lab.castPrompts ? !!lab.castPrompts[id] : null };
  }
  function coreProg(s) {
    var c = coreOf(s), steps = c.prompts.map(function (id) { return coreSteps(s, id); });
    return { core: c, steps: steps, done: steps.filter(function (x) { return x.essay && x.revised; }).length, essays: steps.filter(function (x) { return x.essay; }).length };
  }
  function stepsHtml(st) {
    return [['duel', 'duel'], ['essay', 'essay'], ['revised', 'revised'], ['cast', 'cast']].map(function (k) {
      var v = st[k[0]]; return '<span class="c5-step' + (v ? ' on' : '') + '"' + (v == null ? ' title="Not reported yet by the Workshop"' : '') + '>' + k[1] + (v ? ' ✓' : v == null ? ' ?' : '') + '</span>';
    }).join(' · ');
  }
  function promptOptions(type, sel) {
    return practicePrompts().filter(function (pr) { return pr.type === type; }).map(function (pr) {
      return '<option value="' + esc(pr.id) + '"' + (pr.id === sel ? ' selected' : '') + '>' + esc(pr.title) + (CORE_DEFAULT[type] === pr.id ? ' (default)' : '') + (CORE_AVOID[pr.id] ? ' · mock prompt' : '') + '</option>';
    }).join('');
  }
  /* One select per question type, in teaching order; ids from the five go to the slot of their type. */
  function fiveSelects(attr, prompts) {
    var byType = {}; (prompts || []).forEach(function (id) { var pr = PR.get(id); if (pr && !byType[pr.type]) byType[pr.type] = id; });
    return CORE_TYPES.map(function (t, i) { return '<div class="c5-row"><label>' + (i + 1) + ' · ' + esc(typeName(t)) + '</label><select ' + attr + '="' + t + '">' + promptOptions(t, byType[t] || CORE_DEFAULT[t]) + '</select></div>'; }).join('');
  }
  function readFive(root, attr) { return CORE_TYPES.map(function (t) { var el = root.querySelector('[' + attr + '="' + t + '"]'); return el ? el.value : ''; }).filter(Boolean); }
  /* Landing Check agreement: the share of the lines the app can judge where her tick matched the Wards */
  function agreeOf(r) {
    if (typeof r.landAgree === 'number') return r.landAgree;
    var c = r.plan && r.plan.calibration; return c && c.of ? c.agree / c.of : null;
  }
  function pctOrDash(x) { return x == null ? '—' : Math.round(x * 100) + '%'; }
  function essayFlags(r, all) {
    var out = [];
    if (frameOnly(r)) out.push('<span class="flag frame" title="Under 30% of the essay is her own words: no merits">mostly frame' + (typeof r.ownShare === 'number' ? ' · ' + Math.round(r.ownShare * 100) + '% own' : '') + '</span>');
    else if (typeof r.ownShare === 'number') out.push('<span class="tiny">' + Math.round(r.ownShare * 100) + '% own</span>');
    var ag = agreeOf(r); if (ag != null) out.push('<span class="tiny" title="Landing Check: her ticks agreed with the Wards">landing ' + Math.round(ag * 100) + '%</span>');
    if (r.fillUsed) out.push('<span class="tiny">Fill used</span>');
    if (r.revisionOf) { var o = (all || T.reports).filter(function (x) { return x.id === r.revisionOf; })[0]; out.push('<span class="flag rev">revision of ' + (o ? esc(String(o.ts).slice(0, 10)) : 'an earlier essay') + (r.reviseBox || r.reviseRow ? ' · ' + esc(BOX[r.reviseBox] || r.reviseRow) : '') + '</span>'); }
    var n = (all || T.reports).filter(function (x) { return x.revisionOf === r.id; }).length; if (n) out.push('<span class="flag rev">revised ' + n + '×</span>');
    return out.join(' ');
  }

  /* ------------------------------------------------------------- sign in */
  try { $('#url').value = api.url || ''; } catch (e) {}
  function enter() {
    var pin = $('#pin').value.trim(), url = $('#url').value.trim();
    if (url !== (api.url || '')) api.setUrl(url);
    api.teacherLogin(pin).then(function (r) {
      if (!r || !r.ok) { var m = $('#gate-msg'); m.classList.remove('hidden'); m.textContent = (r && r.error) || 'Wrong PIN.'; return; }
      $('#gate').classList.add('hidden'); $('#app').classList.remove('hidden');
      paintMode(); load(); checkLink();
    });
  }
  $('#gate-go').addEventListener('click', enter);
  /* Oct 2026: the server asks for the PIN again when the teacher token has expired. */
  api.onTeacherAuth = function () {
    $('#app').classList.add('hidden'); $('#gate').classList.remove('hidden');
    var m = $('#gate-msg'); m.classList.remove('hidden'); m.textContent = 'Your session has ended. Enter the PIN again.';
  };
  $('#pin').addEventListener('keydown', function (e) { if (e.key === 'Enter') enter(); });
  $('#t-out').addEventListener('click', function () { location.reload(); });
  $('#t-refresh').addEventListener('click', function () { load(); toast('Refreshed.'); });
  $('#q').addEventListener('input', function () { T.q = $('#q').value.trim(); paintRoster(); });
  document.querySelectorAll('.tnav button').forEach(function (b) { b.addEventListener('click', function () { showView(b.dataset.view); }); });
  function showView(v) {
    T.view = v;
    ['class', 'marking', 'assign', 'projector'].forEach(function (x) { $('#view-' + x).classList.toggle('hidden', x !== v); });
    document.querySelectorAll('.tnav button').forEach(function (b) { b.classList.toggle('on', b.dataset.view === v); });
    if (v === 'marking') paintMarking();
    if (v === 'assign') paintAssign();
    if (v === 'projector') paintProjectorHome();
  }
  function checkLink() {
    if (!api.url) return;
    api.ping().then(function (r) {
      if (r.ok) { $('#top-sub').textContent = 'Connected · ' + (r.sheet || 'class sheet'); toast('Connected to ' + (r.sheet || 'the class sheet') + '.'); versionBanner(r.version); }
      else {
        $('#top-sub').textContent = 'Server not answering — showing local data';
        $('#modebar-slot').innerHTML = '<div class="wrap"><div class="modebar"><span><b>Not connected</b> &nbsp;The class server did not answer, so this is local data only. Check the Apps Script deployment is <em>Execute as: Me</em> and <em>Access: Anyone</em>, and that you deployed a <em>new version</em> after your last edit.' + (r.error ? ' &nbsp;(' + esc(r.error) + ')' : '') + '</span></div></div>';
      }
    });
  }
  /* WP1: a quiet banner when the live Apps Script is older than this front end (or reports no version). */
  function versionBanner(v) {
    var have = String(v || '');
    if (have && have >= EXPECTED_BACKEND) return;
    $('#modebar-slot').innerHTML = '<div class="wrap"><div class="modebar" id="ver-banner"><span><b>Redeploy the class server</b> &nbsp;The Apps Script is ' + (have ? 'version ' + esc(have) : 'an older version (it reports no version number)') + '; this Staff Room expects ' + esc(EXPECTED_BACKEND) + ' or later. In Apps Script, paste the current Code.gs and Lab.gs, then Deploy → Manage deployments → pencil → New version → Deploy. Until then, new report columns and the House Cup may be missing.</span></div></div>';
  }
  function paintMode() {
    $('#top-sub').textContent = api.mode === 'cloud' ? 'Connected to the class sheet' : 'Local data, this browser only';
    $('#modebar-slot').innerHTML = api.mode === 'cloud' ? '' : '<div class="wrap"><div class="modebar"><span><b>Offline</b> &nbsp;Showing data saved in this browser. Add your Apps Script URL on the sign-in screen to read the real class sheet.</span></div></div>';
  }

  /* ---------------------------------------------------------------- load */
  function load() {
    api.roster().then(function (r) {
      T.roster = (r && r.students) || [];
      return api.reports('');
    }).then(function (r) {
      T.reports = ((r && r.reports) || []).slice().sort(function (a, b) { return a.ts < b.ts ? 1 : -1; });
      return api.assignments('list');
    }).then(function (r) {
      T.assignments = (r && r.assignments) || [];
      T.loaded = true;
      paintStats(); paintCohorts(); paintHouseCup(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems();
      var q = T.reports.filter(function (x) { return !x.released; }).length;
      $('#nav-queue').textContent = q ? ' (' + q + ')' : '';
      if (T.sel) openStudent(T.sel);
      if (T.view === 'marking') paintMarking();
      if (T.view === 'assign') paintAssign();
      drainLevelUp();
    });
  }
  function cohortOf(s) { return (s.progress && s.progress.cohort) || s.cohort || (function () { var r = (typeof ROSTER !== 'undefined' ? ROSTER : []).filter(function (x) { return String(x.id).toLowerCase() === String(s.id).toLowerCase(); })[0]; return r ? r.cohort : ''; })() || 'Other'; }
  function visible() { return T.roster.filter(function (s) { return T.cohort === 'all' || cohortOf(s) === T.cohort; }); }
  function reportsOf(id) { return T.reports.filter(function (r) { return r.studentId === id; }); }
  function lastBand(id) { var rs = reportsOf(id).filter(function (r) { return bandsOf(r); }); return rs.length ? bandsOf(rs[0]).overall : null; }

  function paintStats() {
    var list = visible(), n = list.length;
    var active = list.filter(function (s) { return s.progress && s.progress.lastActiveDate && E.daysBetween(s.progress.lastActiveDate, E.today()) <= 7; }).length;
    var ready = n ? Math.round(list.reduce(function (a, s) { var g = P.gateReadiness(s.progress || P.blank(s.id)); return a + (g.TR + g.CC + g.LR + g.GRA) / 4; }, 0) / n) : 0;
    var ids = {}; list.forEach(function (s) { ids[s.id] = 1; });
    var reps = T.reports.filter(function (r) { return ids[r.studentId]; });
    var marked = reps.filter(function (r) { return bandsOf(r); });
    var mean = marked.length ? marked.reduce(function (a, r) { return a + bandsOf(r).overall; }, 0) / marked.length : 0;
    var queue = reps.filter(function (r) { return !r.released; }).length;
    $('#stats').innerHTML = '<div class="stat"><b>' + n + '</b><span>Students</span></div><div class="stat"><b>' + active + '</b><span>Active this week</span></div><div class="stat"><b>' + ready + '%</b><span>Mean gate readiness</span></div><div class="stat"><b>' + reps.length + '</b><span>Reports written</span></div><div class="stat"><b>' + (marked.length ? fmtBand(mean) : '—') + '</b><span>Mean band' + (queue ? ' · ' + queue + ' to mark' : '') + '</span></div>';
  }
  function paintCohorts() {
    var set = {}; T.roster.forEach(function (s) { set[cohortOf(s)] = 1; });
    var keys = ['all'].concat(Object.keys(set).sort());
    $('#cohorts').innerHTML = keys.map(function (k) { return '<button data-c="' + esc(k) + '"' + (T.cohort === k ? ' class="on"' : '') + '>' + (k === 'all' ? 'All cohorts' : esc(k)) + '</button>'; }).join('');
    $('#cohorts').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { T.cohort = b.dataset.c; paintStats(); paintCohorts(); paintHouseCup(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems(); }); });
  }
  function paintHouseCup() {
    var host = $('#housecup'); if (!host) return;
    var by = {}; T.roster.forEach(function (s) { var c = cohortOf(s); (by[c] || (by[c] = [])).push(s); });
    var keys = T.cohort === 'all' ? Object.keys(by).sort() : [T.cohort];
    if (!keys.length || !T.roster.length) { host.innerHTML = '<p class="tiny">No students yet.</p>'; return; }
    host.innerHTML = keys.map(function (c) {
      var list = by[c] || [], cup = cupFor(list), max = 1;
      houses().forEach(function (h) { max = Math.max(max, cup.totals[h.id]); });
      var order = houses().slice().sort(function (a, b) { return cup.totals[b.id] - cup.totals[a.id]; });
      var canUnlock = c !== 'Other';
      return '<div class="cup"><div class="cup-h"><b>' + esc(c) + '</b><span class="tiny">' + list.length + ' student' + (list.length === 1 ? '' : 's') + (cup.unsorted ? ' · ' + cup.unsorted + ' not sorted yet' : '') + '</span>' +
        (canUnlock ? '<button class="btn sm" data-unlockall="' + esc(c) + '" title="Opens all seven chapters for every student in this cohort">Unlock all chapters</button>' : '<span class="tiny">No cohort set: unlock these students one at a time.</span>') + '</div>' +
        order.map(function (h) {
          return '<div class="cup-row"><span class="cup-n">' + houseChip(h.id) + '</span><span class="cup-bar"><i style="width:' + Math.round(cup.totals[h.id] / max * 100) + '%;background:' + esc(h.main) + '"></i></span><span class="cup-pts">' + cup.totals[h.id] + ' pts</span><span class="cup-m">' + cup.members[h.id] + ' member' + (cup.members[h.id] === 1 ? '' : 's') + '</span></div>';
        }).join('') + '</div>';
    }).join('') + challengeCupHtml() + '<p class="tiny" style="margin-top:6px">House points are worked out from each student\'s progress: 5 per lesson passed, 20 per examiner\'s gate, 2 per fault mended (max 100), 15 per essay sent to the examiners, 25 per essay marked at or above her target, 10 per tournament task. Students see only these totals, never names.</p>';
    host.querySelectorAll('[data-unlockall]').forEach(function (b) { b.addEventListener('click', function () {
      var c = b.dataset.unlockall;
      if (!confirm('Unlock all ' + NCH + ' chapters for every student in ' + c + '? The story can then be read in any order.')) return;
      sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'unlock', cohort: c, chapter: NCH }, 'All chapters unlocked for ' + c + '.');
    }); });
  }
  /* the live house challenge, summed from the roster's story.challenge (same sums as `houses` with a challenge id) */
  function challengeCupHtml() {
    var today = bkkDate(0), rows = T.assignments.filter(function (a) { return a.kind === 'challenge' && (!a.to || a.to >= today) && (!a.from || a.from <= today); });
    if (!rows.length) return '';
    return rows.map(function (a) {
      var tot = {}, mem = {}; houses().forEach(function (h) { tot[h.id] = 0; mem[h.id] = 0; });
      T.roster.forEach(function (s) { var st = storyOf(s.progress), c = st.challenge; if (!c || c.id !== a.id || !st.house || tot[st.house] == null) return; tot[st.house] += Math.max(0, Math.round(Number(c.score) || 0)); mem[st.house] += 1; });
      return '<div class="cup" style="margin-top:10px"><div class="cup-h"><b>Challenge: ' + esc(a.title || metricName(a.metric)) + '</b><span class="tiny">' + esc(metricName(a.metric)) + ' · ' + esc(a.from || '') + ' to ' + esc(a.to || '') + ' · ' + (a.cohort === 'all' || !a.cohort ? 'everyone' : esc(a.cohort)) + '</span></div>' +
        houses().map(function (h) { return '<div class="cup-row"><span class="cup-n">' + houseChip(h.id) + '</span><span class="cup-pts">' + tot[h.id] + '</span><span class="cup-m">' + mem[h.id] + ' counted</span></div>'; }).join('') + '</div>';
    }).join('');
  }
  var COLS = [{ k: 'name', t: 'Student' }, { k: 'rank', t: 'Classes' }, { k: 'ready', t: 'TR · CC · LR · GRA' }, { k: 'chapter', t: 'Chapter' }, { k: 'house', t: 'House' }, { k: 'band', t: 'Last band' }, { k: 'reps', t: 'Reports' }, { k: 'five', t: 'Her five' }, { k: 'frame', t: 'Mostly frame' }, { k: 'land', t: 'Landing agree' }, { k: 'revs', t: 'Revisions' }, { k: 'faults', t: 'Faults' }, { k: 'streak', t: 'Candles' }, { k: 'seen2', t: 'Last seen' }, { k: null, t: '' }];
  function paintRoster() {
    var list = visible();
    $('#roster-n').textContent = list.length + ' enrolled';
    if (!list.length) { $('#roster').innerHTML = '<tbody><tr><td><div class="empty">No students yet. They appear here as soon as they create an account.</div></td></tr></tbody>'; return; }
    var rows = list.map(function (s) {
      var p = s.progress || P.blank(s.id, s.name), g = P.gateReadiness(p);
      var stale = p.lastActiveDate ? E.daysBetween(p.lastActiveDate, E.today()) : 999, cleared = P.checksCleared(p);
      var flag = (!p.stats || p.stats.seen < 5) ? '<span class="flag new">new</span>' : stale > 7 ? '<span class="flag stall">stalled</span>' : cleared >= 11 ? '<span class="flag fly">soaring</span>' : '';
      var st = storyOf(p), mine = reportsOf(s.id), cp = coreProg(s);
      var ags = mine.map(agreeOf).filter(function (x) { return x != null; });
      var land = ags.length ? ags.reduce(function (a, b) { return a + b; }, 0) / ags.length : null;
      return { s: s, p: p, g: g, five: cp.done * 10 + cp.essays, cp: cp, frame: mine.filter(frameOnly).length, land: land == null ? -1 : land, revs: mine.filter(function (r) { return r.revisionOf; }).length, ready: Math.round((g.TR + g.CC + g.LR + g.GRA) / 4), rank: cleared, chapter: Number(st.chapter) || 0, unlockedTo: Number(st.unlockedTo) || 0, house: st.house || '', hp: Number(st.hp) || 0, band: lastBand(s.id) || 0, reps: reportsOf(s.id).length, faults: P.dueReview(p).length, flag: flag, stale: stale };
    });
    if (T.q) { var q = T.q.toLowerCase(); rows = rows.filter(function (r) { return (r.p.displayName || '').toLowerCase().indexOf(q) >= 0 || r.s.id.toLowerCase().indexOf(q) >= 0; }); }
    var key = T.sort, dir = T.dir;
    rows.sort(function (a, b) {
      if (key === 'name') { var x = (a.p.displayName || a.s.id).toLowerCase(), y = (b.p.displayName || b.s.id).toLowerCase(); return x < y ? -dir : x > y ? dir : 0; }
      if (key === 'house') { var hx = a.house || '~', hy = b.house || '~'; return hx < hy ? -dir : hx > hy ? dir : (a.hp - b.hp) * dir; }
      var xv = key === 'seen2' ? -a.stale : key === 'streak' ? (a.p.streak || 0) : a[key] || 0, yv = key === 'seen2' ? -b.stale : key === 'streak' ? (b.p.streak || 0) : b[key] || 0;
      return (xv - yv) * dir;
    });
    var html = '<thead><tr>' + COLS.map(function (c) { if (!c.k) return '<th></th>'; var on = T.sort === c.k; return '<th class="' + (on ? 'on' : '') + '" data-sort="' + c.k + '">' + esc(c.t) + (on ? (dir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr class="r' + (T.sel === r.s.id ? ' sel' : '') + '" data-id="' + esc(r.s.id) + '"><td><div class="who2"><b>' + esc(r.p.displayName || r.s.name) + '</b><span>' + esc(r.s.id) + ' · ' + esc(cohortOf(r.s)) + '</span></div></td>' +
        '<td>' + r.rank + '/' + C.TOPICS.length + ' <span style="color:var(--ink-3);font-family:var(--f-mono);font-size:.75rem">' + esc(P.rank(r.p).name) + '</span></td>' +
        '<td>' + ['TR', 'CC', 'LR', 'GRA'].map(function (k) { return '<span class="mini' + (k === 'TR' ? ' gold' : '') + '" title="' + k + ' ' + r.g[k] + '%"><i style="width:' + r.g[k] + '%"></i></span>'; }).join('') + ' <span style="font-family:var(--f-mono);font-size:.78rem">' + r.ready + '%</span></td>' +
        '<td>' + (r.chapter ? '<span title="' + esc(chapterTitle(r.chapter)) + '">Ch ' + r.chapter + '</span>' + (r.unlockedTo > r.chapter ? ' <span class="tiny">· open to ' + r.unlockedTo + '</span>' : '') : '<span class="tiny">not started</span>') + '</td>' +
        '<td>' + houseChip(r.house) + (r.house ? ' <span class="tiny">' + r.hp + ' pts</span>' : '') + '</td>' +
        '<td class="num">' + (r.band ? fmtBand(r.band) : '—') + '</td><td class="num">' + r.reps + '</td>' +
        '<td class="c5-cell" title="Essays written of her five · written and revised' + (r.cp.core.by === 'teacher' ? ' · set by you' : ' · the default five') + '">' + r.cp.essays + '/' + r.cp.core.prompts.length + ' <span class="tiny">· ' + r.cp.done + ' revised' + (r.cp.core.by === 'teacher' ? ' · yours' : '') + (r.cp.core.pending ? ' · pending' : '') + '</span></td>' +
        '<td class="num">' + (r.frame ? '<span class="flag frame" title="Essays under 30% her own words">' + r.frame + '</span>' : '0') + '</td>' +
        '<td class="num">' + (r.land >= 0 ? Math.round(r.land * 100) + '%' : '—') + '</td><td class="num">' + r.revs + '</td><td class="num">' + r.faults + '</td><td class="num">' + (r.p.streak || 0) + '</td><td>' + esc(ago(r.p.lastActiveDate ? r.p.lastActiveDate + 'T12:00:00' : null)) + '</td><td>' + r.flag + '</td></tr>';
    });
    $('#roster').innerHTML = html + '</tbody>';
    $('#roster').querySelectorAll('tr.r').forEach(function (tr) { tr.addEventListener('click', function () { T.sel = tr.dataset.id; paintRoster(); openStudent(tr.dataset.id); }); });
    $('#roster').querySelectorAll('th[data-sort]').forEach(function (th) { th.addEventListener('click', function () { var k = th.dataset.sort; if (T.sort === k) T.dir = -T.dir; else { T.sort = k; T.dir = k === 'name' || k === 'house' ? 1 : -1; } paintRoster(); }); });
  }
  function tagAgg(list) {
    var agg = {};
    list.forEach(function (s) {
      var by = ((s.progress || {}).stats || {}).byTag || {};
      Object.keys(by).forEach(function (t) { var a = agg[t] || (agg[t] = { a: 0, c: 0 }); a.a += by[t].a; a.c += by[t].c; });
      /* pre-flight reds from reports count as errors too */
      reportsOf(s.id).forEach(function (r) { ((r.preflight || {}).rows || []).forEach(function (row) { if (row.status === 'bad' && row.tag) { var a2 = agg[row.tag] || (agg[row.tag] = { a: 0, c: 0 }); a2.a += 1; } }); });
    });
    return agg;
  }
  function paintHeat() {
    var agg = tagAgg(visible());
    var rows = Object.keys(agg).map(function (t) { var x = agg[t]; return { tag: t, attempts: x.a, rate: x.a ? 1 - x.c / x.a : 0, name: (C.REMEDIATION[t] || {}).name || t }; }).filter(function (r) { return r.attempts >= 3; });
    rows.sort(function (a, b) { return b.rate - a.rate; }); rows = rows.slice(0, 8);
    if (!rows.length) { $('#heat').innerHTML = '<p class="tiny">Not enough answers yet to show a pattern.</p>'; return; }
    $('#heat').innerHTML = rows.map(function (r) { return '<div class="heat-row"><span>' + esc(r.name) + '</span><span class="heat-bar"><i style="width:' + Math.round(r.rate * 100) + '%"></i></span><span class="heat-n">' + Math.round(r.rate * 100) + '%</span></div>'; }).join('') + '<p class="tiny" style="margin-top:8px">Error rate across the cohort (class answers plus red rows in the Ten Wards), tags with three or more attempts. The top row is the candidate for Monday\'s whole-class lesson.</p>';
  }
  function paintHeatmap() {
    var list = visible().slice(0, 40);
    if (!list.length) { $('#heatmap').innerHTML = ''; return; }
    var tags = Object.keys(C.REMEDIATION).filter(function (t) { return list.some(function (s) { return (((s.progress || {}).stats || {}).byTag || {})[t]; }); });
    if (!tags.length) { $('#heatmap').innerHTML = '<p class="tiny">No answers yet.</p>'; return; }
    var html = '<table><thead><tr><th></th>' + tags.map(function (t) { return '<th class="rot" title="' + esc((C.REMEDIATION[t] || {}).name || t) + '">' + esc((C.REMEDIATION[t] || {}).name || t).slice(0, 26) + '</th>'; }).join('') + '</tr></thead><tbody>';
    list.forEach(function (s) {
      var by = ((s.progress || {}).stats || {}).byTag || {};
      html += '<tr><td class="n">' + esc((s.progress || {}).displayName || s.name || s.id) + '</td>' + tags.map(function (t) {
        var x = by[t]; if (!x || !x.a) return '<td style="background:var(--surface-2)"></td>';
        var rate = 1 - x.c / x.a, a = Math.min(0.85, rate).toFixed(2);
        return '<td style="background:rgba(174,58,34,' + a + ');color:' + (rate > 0.5 ? '#fff' : 'var(--ink)') + '" title="' + esc((C.REMEDIATION[t] || {}).name || t) + ': ' + (x.a - x.c) + ' wrong of ' + x.a + '">' + Math.round(rate * 100) + '</td>';
      }).join('') + '</tr>';
    });
    $('#heatmap').innerHTML = html + '</tbody></table><p class="tiny" style="margin-top:6px">Each cell is that student\'s error rate on that tag. Darker is worse. Empty means not yet attempted.</p>';
  }
  function paintSystems() {
    var list = visible();
    if (!list.length) { $('#sysbars').innerHTML = '<p class="tiny">No data yet.</p>'; return; }
    var rows = C.TOPICS.map(function (t) { return { name: t.code + ' · ' + t.name, pct: Math.round(list.reduce(function (a, s) { return a + P.topicPct(s.progress || P.blank(s.id), t); }, 0) / list.length) }; });
    $('#sysbars').innerHTML = rows.map(function (r) { return '<div class="sysbar"><span>' + esc(r.name) + '</span><span class="sysbar-b"><i style="width:' + r.pct + '%"></i></span><span class="sysbar-n">' + r.pct + '%</span></div>'; }).join('');
  }

  /* ------------------------------------------------------------- student */
  /* My Spellbook (template.js keeps a copy on the progress object, p.spellbook):
     the four frames the Scriptorium uses, where they came from and the share. */
  function sbFrame(tier, id) {
    var TT = window.Template; if (!TT || !id) return null;
    var out = null;
    Object.keys(C.TYPES).forEach(function (ty) { if (out) return; TT.paragraphs(tier, ty).forEach(function (pg) { pg.frames.forEach(function (f) { if (!out && f.id === id) out = f; }); }); });
    return out;
  }
  function sbText(text) {
    var TT = window.Template, lab = (TT && TT.LABEL) || {};
    return esc(text).replace(/\{(\w+)\}/g, function (m, k) { return '<span class="sb-slot">[' + esc(lab[k] || k) + ']</span>'; });
  }
  function spellbookHtml(p) {
    var TT = window.Template; if (!TT) return '';
    var sb = p.spellbook || null, tier = (sb && sb.tier === 'C1') || (!sb && p.tier === 'C1') ? 'C1' : 'B2';
    var paras = TT.paragraphs(tier, 'DISCUSS'), choice = (sb && sb.choice) || {}, custom = (sb && sb.custom) || {};
    var edits = Object.keys(custom).filter(function (k) { return String(custom[k] || '').trim(); }).length;
    var src = !sb ? 'not saved to the sheet yet' : sb.fromLab ? 'Workshop design' + (sb.fromLabName ? ' "' + sb.fromLabName + '"' : '') + (sb.edited ? ', edited in My Spellbook since' : '') : edits || Object.keys(choice).length ? 'her own frames in My Spellbook' : 'the standard frames';
    var share = sb && sb.share ? sb.share + '%' : '—';
    var h = '<details class="disc"><summary>My Spellbook (what the Scriptorium uses)<span class="count">' + esc(src) + ' · share ' + esc(share) + '</span></summary><div class="disc-body" style="padding-top:10px">';
    if (!sb) {
      h += '<p class="tiny">This student\'s spellbook has not reached the class sheet yet. It is saved with her progress the next time she opens My Spellbook, the Scriptorium or the Spellbook Workshop on the device where she edited it.</p></div></details>';
      return h;
    }
    h += '<p class="tiny">Source: ' + esc(src) + ' · ' + tier + ' track · template share for skeleton and exam essays: ' + esc(share) + ' · ' + edits + ' of 4 frames edited · updated ' + esc(ago(sb.at)) + (sb.prev ? ' · an earlier version is kept' : '') + '.</p><div class="sb-frames">';
    paras.forEach(function (pg) {
      var own = String(custom[pg.key] || '').trim(), fr = sbFrame(tier, choice[pg.key]) || pg.frames[0];
      h += '<div class="sb-frame"><b>' + esc(pg.name) + ' · ' + (own ? 'her own wording' : 'standard: ' + esc(fr.name)) + '</b><p>' + sbText(own || fr.text) + '</p></div>';
    });
    h += '</div></div></details>';
    return h;
  }
  /* Duelling Hall (student.js keeps p.bootcamp = { points, missions:{ promptId:{ best, attempts, passed, level, won, at } } }). */
  function duelHtml(p) {
    var bc = p.bootcamp || {}, ms = bc.missions || {}, ids = Object.keys(ms);
    if (!ids.length) return '';
    var won = ids.filter(function (k) { return ms[k].passed; }).length, lv = {};
    ids.forEach(function (k) { var l = ms[k].level || '—'; lv[l] = (lv[l] || 0) + 1; });
    var lvTxt = Object.keys(lv).sort().map(function (l) { return l + ' ×' + lv[l]; }).join(', ');
    ids.sort(function (a, b) { return String(ms[b].at || '').localeCompare(String(ms[a].at || '')); });
    return '<details class="disc"><summary>Duelling Hall<span class="count">' + won + ' won of ' + ids.length + ' duelled · ' + (bc.points || 0) + ' pts · at ' + esc(lvTxt) + '</span></summary><div class="disc-body" style="padding-top:10px;max-height:340px;overflow:auto">' +
      '<table class="roster" style="min-width:0"><thead><tr><th>Prompt</th><th>Best</th><th>Duels</th><th>Level</th><th>Won at</th><th>Last</th></tr></thead><tbody>' +
      ids.map(function (k) {
        var m = ms[k], pr = PR.get(k) || {};
        return '<tr' + (m.passed ? '' : ' style="background:var(--no-soft)"') + '><td>' + esc(pr.title || k) + (pr.type ? ' <span class="tiny">' + esc(typeName(pr.type)) + '</span>' : '') + '</td><td class="num">' + (m.best != null ? m.best + '%' : '—') + '</td><td class="num">' + (m.attempts || 0) + '</td><td>' + esc(m.level || '—') + '</td><td>' + esc(Object.keys(m.won || {}).join(', ') || (m.passed ? 'yes' : '—')) + '</td><td>' + esc(ago(m.at)) + '</td></tr>';
      }).join('') + '</tbody></table><p class="tiny" style="margin-top:8px">Best % per prompt and the level of the answer options she duelled at. Rows in red are not won yet. The choices themselves are in the Answer log.</p></div></details>';
  }
  function openStudent(id) {
    api.detail(id).then(function (d) {
      if (!d || !d.ok) { $('#detail').innerHTML = '<div class="empty">Could not load that student.</div>'; return; }
      T.detail = d;
      var p = d.progress || P.blank(id), g = P.gateReadiness(p), weak = P.weakTags(p, 4), strong = P.strongTags(p, 4);
      var reps = reportsOf(id);
      var h = '<div class="panel-h"><div><h2>' + esc(p.displayName || id) + '</h2><span class="kicker">' + esc(id) + ' · ' + esc(P.rank(p).name) + ' · ' + P.checksCleared(p) + '/' + C.TOPICS.length + ' classes · ' + esc(p.cohort || cohortOf({ id: id })) + ' · lessons read at ' + esc(p.explainLevel || 'C1') + ' · duels at ' + esc(p.duelTier || p.tier || 'B2') + '</span></div><span class="pill' + (P.accuracy(p) >= 80 ? ' good' : P.accuracy(p) >= 60 ? '' : ' bad') + '">' + P.accuracy(p) + '% accurate</span></div>';
      h += '<div class="gates">' + ['TR', 'CC', 'LR', 'GRA'].map(function (k) { return '<div class="gate"><span>' + k + '</span><b>' + g[k] + '%</b></div>'; }).join('') + '</div>';
      /* Quillmoor story: house, chapter, keepsakes, and the teacher's story orders */
      var sto = storyOf(p), chN = Number(sto.chapter) || 0, unl = Number(sto.unlockedTo) || 0, srt = sto.sort || {};
      var myOrders = T.assignments.filter(function (a) { return isOrder(a) && a.studentId && String(a.studentId).toLowerCase() === String(id).toLowerCase(); });
      var ordered = myOrders.reduce(function (m, a) { return a.kind === 'unlock' ? Math.max(m, Number(a.chapter) || 0) : m; }, 0);
      var defN = Math.min(NCH, Math.max(chN + 1, unl + 1, ordered + 1, 2));
      h += '<details class="disc" open><summary>Quillmoor story<span class="count">' + (sto.house ? esc((houseOf(sto.house) || {}).name || sto.house) + ' · ' : 'unsorted · ') + (chN ? 'chapter ' + chN : 'not started') + ' · ' + (Number(sto.hp) || 0) + ' house pts</span></summary><div class="disc-body" style="padding-top:10px">' +
        '<p class="tiny" style="margin-bottom:8px">' + houseChip(sto.house) + ' &nbsp;' + (chN ? 'Chapter ' + chN + ': ' + esc(chapterTitle(chN)) : 'Has not opened the story yet') + (unl > chN ? ' · unlocked up to chapter ' + unl : '') +
        (srt.TR != null ? ' · Sorting: TR ' + srt.TR + ' · CC ' + srt.CC + ' · LR ' + srt.LR + ' · GRA ' + srt.GRA : '') + ((sto.keepsakes || []).length ? ' · keepsakes: ' + esc(sto.keepsakes.join(', ')) : '') + '</p>' +
        '<div class="story-acts"><select id="d-unl-n">' + [1, 2, 3, 4, 5, 6, 7].map(function (n) { return '<option value="' + n + '"' + (n === defN ? ' selected' : '') + '>' + n + ' · ' + esc(chapterTitle(n)) + '</option>'; }).join('') + '</select>' +
        '<button class="btn sm" id="d-unl">Unlock up to chapter ' + defN + '</button><button class="btn sm ghost" id="d-resort" title="She meets the Sorting Lantern again on her next visit">Re-sort</button></div>' +
        (myOrders.length ? '<div style="margin-top:8px">' + myOrders.map(function (a) { return '<div class="assignrow order"><div class="grow tiny">' + esc(orderLabel(a)) + ' · set ' + esc(String(a.ts || '').slice(0, 10)) + '</div><button class="btn sm ghost" data-orm="' + esc(a.id) + '">Remove</button></div>'; }).join('') + '</div>' : '') +
        '<p class="tiny" style="margin-top:8px">Unlocks open chapters early; they never lock one. Her progress still decides which gates she has passed.</p></div></details>';
      /* Your five (E4): her five prompts, her steps on each, and the selects to change them */
      var sRec = { id: id, progress: p, cohort: (T.roster.filter(function (x) { return x.id === id; })[0] || {}).cohort };
      var cpg = coreProg(sRec), c5 = cpg.core;
      h += '<details class="disc" open id="d-five"><summary>Her five<span class="count">' + cpg.essays + ' of ' + c5.prompts.length + ' written · ' + cpg.done + ' revised · ' + (c5.by === 'teacher' ? (c5.own ? 'set by you for her' : 'set by you for the class') : 'the default five') + (c5.pending ? ' · she sees it on her next visit' : '') + '</span></summary><div class="disc-body" style="padding-top:10px">' +
        '<div style="overflow-x:auto"><table class="roster c5-tab" style="min-width:0"><thead><tr><th>#</th><th>Prompt</th><th>Steps</th></tr></thead><tbody>' + c5.prompts.map(function (pid, i) {
          var pr = PR.get(pid) || {};
          return '<tr><td class="num">' + (i + 1) + '</td><td>' + esc(pr.title || pid) + ' <span class="tiny">' + esc(typeName(pr.type)) + '</span></td><td class="tiny">' + stepsHtml(cpg.steps[i]) + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<p class="tiny" style="margin:10px 0 6px">Change her five: one prompt per type, worked in this order. She sees the change the next time she opens the app. The other prompts stay open to her as extra practice.</p>' +
        '<div class="c5-form">' + fiveSelects('data-d5', c5.prompts) + '</div>' +
        '<div class="story-acts" style="margin-top:8px"><button class="btn sm primary" id="d-five-save">Save her five</button>' + (c5.by === 'teacher' && c5.own ? '<button class="btn sm ghost" id="d-five-reset" title="Removes the five you set for her; the class five or the default applies">Back to the ' + (coreRowFor('', cohortOf(sRec)) ? 'class' : 'default') + ' five</button>' : '') + '</div></div></details>';
      /* reports */
      h += '<details class="disc" open><summary>Reports<span class="count">' + reps.length + ' written · ' + reps.filter(function (r) { return !r.released; }).length + ' unreleased</span></summary><div class="disc-body" style="padding-top:10px">';
      h += reps.length ? '<div class="replist">' + reps.map(function (r) { var pr = PR.get(r.promptId) || {}, b = bandsOf(r); return '<button class="rep' + (frameOnly(r) ? ' frame' : '') + '" data-open="' + esc(r.id) + '"' + (r.revisionOf ? ' style="margin-left:18px"' : '') + '><span class="rep-t"><span class="rep-n">' + (r.revisionOf ? '↳ ' : '') + esc(pr.title || r.promptId) + '</span><span class="rep-s">' + esc(String(r.ts).slice(0, 10) + ' · ' + typeName(r.type) + ' · ' + r.words + ' w · ' + mmss(r.seconds || 0) + ' · ' + (r.uiMode || '') + ' · ' + (r.kind || 'practice') + ' · ' + ((r.preflight || {}).bad || 0) + ' red · ' + (r.released ? 'released' : r.teacher ? 'marked, not released' : r.ai ? 'AI estimate' : 'unmarked')) + '</span><span class="rep-f">' + essayFlags(r, reps) + '</span></span><span class="rep-b">' + (b ? fmtBand(b.overall) : '—') + '</span></button>'; }).join('') + '</div>' : '<p class="tiny">No reports yet.</p>';
      h += '<div style="margin-top:10px"><button class="btn sm" id="d-assign">Set an essay for ' + esc(p.displayName || id) + '</button> <button class="btn sm" id="d-print">Print report card</button></div></div></details>';
      /* Template Lab: lab.js keeps a summary on the progress object; the full
         blueprints, essays and coaching are in the LabTemplates / LabAttempts tabs. */
      var lab = p.lab;
      if (lab && (lab.points || lab.runs || lab.templatesComplete)) {
        var pcs = lab.pcts || {};
        h += '<details class="disc"><summary>Spellbook Workshop (Template Lab)<span class="count">' + (lab.points || 0) + ' pts · ' + (lab.runs || 0) + ' runs · best band ' + (lab.bestBand != null ? fmtBand(lab.bestBand) : '—') + '</span></summary><div class="disc-body" style="padding-top:10px">' +
          '<table class="roster" style="min-width:0"><thead><tr><th>Template share</th><th>Runs</th><th>Average band</th><th>Best band</th></tr></thead><tbody>' +
          ['60', '50', '40', '30'].map(function (k) { var x = pcs[k] || {}; return '<tr><td>' + k + '%</td><td>' + (x.n || 0) + '</td><td>' + (x.rated ? fmtBand(x.sum / x.rated) : '—') + '</td><td>' + (x.best != null ? fmtBand(x.best) : '—') + '</td></tr>'; }).join('') +
          '</tbody></table><p class="tiny" style="margin-top:8px">' + (lab.templatesComplete || 0) + ' spellbook design(s) saved. Every line, essay and piece of coaching is in the LabTemplates and LabAttempts tabs of the class sheet.</p></div></details>';
      }
      h += spellbookHtml(p) + duelHtml(p);
      /* diagnosis */
      h += '<details class="disc" open><summary>Teaching focus<span class="count">' + weak.length + ' areas</span></summary><div class="disc-body">';
      if (!weak.length) h += '<p class="tiny" style="padding-top:10px">No error pattern yet. Once this student has answered twenty or so questions, the weak areas appear here with reteach notes and activities.</p>';
      else {
        h += '<p class="tiny" style="padding:10px 0 14px">Ranked by how much trouble each is actually causing — error rate weighted by frequency.</p>';
        weak.forEach(function (w, i) { var info = w.info; h += '<div class="rep-block"><div class="rep-h"><h4>' + (i + 1) + '. ' + esc(info.name || w.tag) + '</h4><span class="rep-rate">' + w.wrong + ' wrong of ' + w.attempts + ' · ' + Math.round(w.rate * 100) + '% error · gate ' + esc(info.gate || '') + '</span></div><p class="rep-p">' + esc(info.principle || '') + '</p>' + (info.reteach ? '<div class="rep-teach"><b>Say this at the board</b>' + esc(info.reteach) + '</div>' : '') + (info.activities ? '<ul class="rep-acts">' + info.activities.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' : '') + '</div>'; });
      }
      if (strong.length) h += '<div class="rep-block good"><div class="rep-h"><h4>Secure</h4></div><p class="rep-p">' + strong.map(function (s) { return esc(s.info.name || s.tag) + ' (' + Math.round(s.rate * 100) + '%)'; }).join(' · ') + '</p></div>';
      h += '</div></details>';
      /* modules */
      /* Podcasts and videos: who has listened to or watched what (media.js). */
      var withMedia = C.TOPICS.filter(function (x) { return x.podcast || x.video; });
      if (withMedia.length) {
        var md = p.media || {};
        var heard = withMedia.filter(function (x) { var r = md[x.id]; return r && (r.plays || r.videoOpens); }).length;
        h += '<details class="disc"><summary>Castle Wireless &amp; Memory Basin (podcasts and videos)<span class="count">' + heard + ' of ' + withMedia.length + ' opened</span></summary><div class="disc-body" style="padding-top:10px;overflow:auto"><table class="roster" style="min-width:0"><thead><tr><th>Module</th><th>Podcast</th><th>Listened</th><th>Video</th><th>Last</th></tr></thead><tbody>' +
          withMedia.map(function (x) {
            var r = md[x.id] || {}, none = !r.plays && !r.videoOpens;
            return '<tr' + (none ? ' style="background:var(--no-soft)"' : '') + '><td>' + esc(x.code) + ' · ' + esc(x.name) + '</td>' +
              '<td>' + (x.podcast ? (r.done ? '✓ finished' : (r.plays || 0) + ' play' + (r.plays === 1 ? '' : 's')) : '—') + '</td>' +
              '<td>' + (r.seconds ? Math.round(r.seconds / 60) + ' min' : '—') + '</td>' +
              '<td>' + (x.video ? (r.videoOpens ? r.videoOpens + ' open' + (r.videoOpens === 1 ? '' : 's') : '0') : '—') + '</td>' +
              '<td>' + (r.last ? esc(String(r.last).slice(0, 10)) : '—') + '</td></tr>';
          }).join('') + '</tbody></table><p class="tiny" style="margin-top:8px">Rows in red have never been opened. A student stuck on a module who never played its introduction is a different teaching problem from one who did.</p></div></details>';
      }
      h += '<details class="disc"><summary>Classes (modules)<span class="count">' + P.checksCleared(p) + ' passed</span></summary><div class="disc-body" style="padding-top:10px"><div class="sysbars">' + P.systemScores(p).map(function (r) { return '<div class="sysbar"><span>' + esc(r.code) + ' · ' + esc(r.name) + '</span><span class="sysbar-b"><i style="width:' + r.pct + '%"></i></span><span class="sysbar-n">' + r.pct + '%</span></div>'; }).join('') + '</div></div></details>';
      /* log */
      var attempts = (d.attempts || []).filter(function (a) { return a && a.itemId; }).slice().reverse().slice(0, 60);
      h += '<details class="disc"><summary>Answer log<span class="count">' + (d.attempts || []).length + '</span></summary><div class="disc-body" style="padding-top:10px;max-height:340px;overflow:auto"><table class="roster" style="min-width:0"><thead><tr><th>When</th><th>Item</th><th>Tag</th><th>Result</th></tr></thead><tbody>' + attempts.map(function (a) { return '<tr' + (a.correct ? '' : ' style="background:var(--no-soft)"') + '><td>' + esc(String(a.ts).slice(0, 16).replace('T', ' ')) + '</td><td>' + esc(a.itemId) + '</td><td>' + esc((C.REMEDIATION[a.tag] || {}).name || a.tag) + '</td><td>' + (a.correct ? '✓' : '✕ ' + esc(String(a.given || '').slice(0, 60))) + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
      $('#detail').innerHTML = h;
      $('#detail').querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { T.markSel = b.dataset.open; showView('marking'); }); });
      $('#d-assign').addEventListener('click', function () { showView('assign'); $('#a-student').value = id; });
      $('#d-print').addEventListener('click', function () { printCard(id); });
      $('#d-five-save').addEventListener('click', function () {
        var five = readFive($('#detail'), 'data-d5');
        if (five.length !== CORE_TYPES.length) { toast('Choose one prompt for each type.'); return; }
        sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'coreset', studentId: id, prompts: five }, 'Her five saved. ' + (p.displayName || id) + ' sees them on her next visit.');
      });
      var r5 = $('#d-five-reset'); if (r5) r5.addEventListener('click', function () {
        var mineRows = T.assignments.filter(function (a) { return a.kind === 'coreset' && a.studentId && lc(a.studentId) === lc(id); });
        if (!mineRows.length) return;
        var n = mineRows.length;
        mineRows.forEach(function (a) { api.assignments('remove', { id: a.id }).then(function (r) { T.assignments = (r && r.assignments) || T.assignments.filter(function (x) { return x.id !== a.id; }); if (--n === 0) { toast('Her own five removed.'); paintRoster(); openStudent(id); } }); });
      });
      var nameOf = p.displayName || id;
      $('#d-unl-n').addEventListener('change', function () { $('#d-unl').textContent = 'Unlock up to chapter ' + $('#d-unl-n').value; });
      $('#d-unl').addEventListener('click', function () {
        var n = parseInt($('#d-unl-n').value, 10) || 1;
        sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'unlock', studentId: id, chapter: n }, 'Chapters up to ' + n + ' unlocked for ' + nameOf + '.');
      });
      $('#d-resort').addEventListener('click', function () {
        if (!confirm('Re-sort ' + nameOf + '? She will take the Sorting again on her next visit and may join a different house.')) return;
        sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'resort', studentId: id }, nameOf + ' will be re-sorted on her next visit.');
      });
      $('#detail').querySelectorAll('[data-orm]').forEach(function (b) { b.addEventListener('click', function () { removeOrder(b.dataset.orm); }); });
    });
  }

  /* ------------------------------------------------------------- marking */
  function paintMarking() {
    var list = T.reports.filter(function (r) { return T.markFilter === 'all' || (T.markFilter === 'queue' ? !r.released : r.released); });
    if (T.cohort !== 'all') { var ids = {}; visible().forEach(function (s) { ids[s.id] = 1; }); list = list.filter(function (r) { return ids[r.studentId]; }); }
    var html = '<div class="panel-h"><h2>Marking</h2><div class="filters" style="margin:0">' + ['queue', 'released', 'all'].map(function (k) { return '<button data-mf="' + k + '"' + (T.markFilter === k ? ' class="on"' : '') + '>' + k + '</button>'; }).join('') + '</div></div>';
    html += '<div class="mark"><div class="card panel"><div class="replist">' + (list.length ? list.map(function (r) { var pr = PR.get(r.promptId) || {}, b = bandsOf(r); return '<button class="rep' + (T.markSel === r.id ? ' sel' : '') + '" data-mk="' + esc(r.id) + '"><span class="rep-t"><span class="rep-n">' + esc(r.name || r.studentId) + ' — ' + esc(pr.title || r.promptId) + '</span><span class="rep-s">' + esc(String(r.ts).slice(0, 10) + ' · ' + typeName(r.type) + ' · ' + r.words + ' w · ' + ((r.preflight || {}).bad || 0) + ' red · ' + (r.kind || 'practice') + ' · ' + (r.released ? 'released' : r.teacher ? 'marked' : r.ai ? 'AI estimate' : 'unmarked')) + '</span><span class="rep-f">' + essayFlags(r) + '</span></span><span class="rep-b">' + (b ? fmtBand(b.overall) : (r.ai && r.ai.cefr ? esc(r.ai.cefr) : (LV.pending[r.id] ? '⏳' : '—'))) + '</span></button>'; }).join('') : '<div class="empty">Nothing here.</div>') + '</div></div><div class="card panel" id="mk-detail"><div class="empty">Pick a report.</div></div></div>';
    $('#view-marking').innerHTML = html;
    $('#view-marking').querySelectorAll('[data-mf]').forEach(function (b) { b.addEventListener('click', function () { T.markFilter = b.dataset.mf; paintMarking(); }); });
    $('#view-marking').querySelectorAll('[data-mk]').forEach(function (b) { b.addEventListener('click', function () { T.markSel = b.dataset.mk; paintMarking(); }); });
    if (T.markSel) paintMarkDetail(T.markSel);
  }
  function paintMarkDetail(id) {
    var r = T.reports.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var pr = PR.get(r.promptId) || {}, host = $('#mk-detail');
    var pre = r.preflight || {};
    var tb = (r.teacher && r.teacher.bands) || (r.ai && r.ai.bands) || {};
    var opts = function (v) { var o = ''; for (var b = 4; b <= 9; b += 0.5) o += '<option value="' + b + '"' + (Math.abs((v || 0) - b) < 0.01 ? ' selected' : '') + '>' + b.toFixed(1) + '</option>'; return '<option value="">—</option>' + o; };
    var h = '<div class="panel-h"><div><h2>' + esc(r.name || r.studentId) + '</h2><span class="kicker">' + esc(pr.title || r.promptId) + ' · ' + esc(String(r.ts).slice(0, 16).replace('T', ' ')) + ' · ' + r.words + ' words in ' + mmss(r.seconds || 0) + (r.timedOut ? ' (time out)' : '') + ' · ' + (r.uiMode || '') + (r.revision ? ' · revised once' : '') + '</span></div><span class="pill ' + (pre.bad ? 'bad' : 'good') + '">' + (pre.bad || 0) + ' red · ' + (pre.warn || 0) + ' amber</span></div>';
    /* 19 Oct 2026: how much is hers, the Landing Check agreement, and the revision links */
    var orig = r.revisionOf ? T.reports.filter(function (x) { return x.id === r.revisionOf; })[0] : null, later = T.reports.filter(function (x) { return x.revisionOf === r.id; });
    h += '<div class="mk-meta" id="mk-meta"><span>Own words: <b>' + (typeof r.ownShare === 'number' ? Math.round(r.ownShare * 100) + '%' : '—') + '</b>' + (frameOnly(r) ? ' <span class="flag frame">mostly frame · no merits</span>' : '') + '</span>' +
      '<span>Own sentences: <b>' + (r.ownSentences == null ? '—' : r.ownSentences) + '</b></span><span>Fill used: <b>' + (r.fillUsed == null ? '—' : r.fillUsed ? 'yes' : 'no') + '</b></span>' +
      '<span>Landing Check agreement: <b>' + pctOrDash(agreeOf(r)) + '</b></span>' + (r.merits != null ? '<span>Merits: <b>' + r.merits + '</b></span>' : '') + '</div>';
    if (orig || r.revisionOf) h += '<p class="tiny" id="mk-revof">A revision' + (r.reviseBox ? ' of the ' + esc(BOX[r.reviseBox] || r.reviseBox) + ' paragraph' : '') + (r.reviseRow ? ' (weak row: ' + esc(r.reviseRow) + ')' : '') + ' of ' + (orig ? '<button class="linky" data-mk-go="' + esc(orig.id) + '">the essay of ' + esc(String(orig.ts).slice(0, 16).replace('T', ' ')) + ' →</button>' : 'an essay not in this list') + '</p>';
    if (later.length) h += '<p class="tiny" id="mk-revised">Revised later: ' + later.map(function (x) { return '<button class="linky" data-mk-go="' + esc(x.id) + '">' + esc(String(x.ts).slice(0, 16).replace('T', ' ')) + (x.reviseBox ? ' (' + esc(BOX[x.reviseBox] || x.reviseBox) + ')' : '') + ' →</button>'; }).join(' ') + '</p>';
    h += PR.card(pr, { compact: true });
    h += W.paragraphs(r.text).map(function (t) { return '<div class="mpara">' + esc(t).replace(new RegExp(W.LEX.NUANCE.source, 'gi'), '<span class="cmp">$&</span>') + '</div>'; }).join('');
    if (r.firstText) h += '<details class="disc"><summary>First draft (before revision)</summary><div class="disc-body" style="padding-top:10px">' + W.paragraphs(r.firstText).map(function (t) { return '<div class="mpara">' + esc(t) + '</div>'; }).join('') + '</div></details>';
    h += '<details class="disc"><summary>The Ten Wards (structure rows)<span class="count">' + ((pre.rows || []).length) + '</span></summary><div class="disc-body" style="padding-top:10px">' + (pre.rows || []).map(function (row) { return '<div class="pf-row ' + row.status + '">' + esc(row.label) + '</div>'; }).join('') + '</div></details>';
    if (r.plan && r.plan.vars) { var vv = r.plan.vars, keys = Object.keys(vv).filter(function (k) { return vv[k]; }); if (keys.length) h += '<details class="disc"><summary>The matrix the student planned<span class="count">' + keys.length + ' of 11</span></summary><div class="disc-body" style="padding-top:10px"><ol class="bc-list">' + C.VARIABLES.map(function (v) { return vv[v.key] ? '<li><b>' + esc(v.name) + '</b> — ' + esc(vv[v.key]) + '</li>' : ''; }).join('') + '</ol></div></details>'; }
    if (LV.pending[r.id]) h += '<p class="tiny" style="margin:10px 0">⏳ With the examiners in LevelUp since ' + esc(bkkStamp(new Date(LV.pending[r.id]).toISOString()).slice(11)) + ' — the Overall CEFR and examiner feedback will appear here by themselves.</p>';
    if (r.ai) h += '<details class="disc" open><summary>AI estimate<span class="count">' + (r.ai.bands ? fmtBand(r.ai.bands.overall) : (r.ai.cefr ? 'CEFR ' + esc(r.ai.cefr) : '—')) + (r.ai.second ? ' · second pass ' + fmtBand(r.ai.second.overall) + (Math.abs(r.ai.second.overall - r.ai.bands.overall) > 0.5 ? ' ⚠ divergent' : '') : '') + '</span></summary><div class="disc-body" style="padding-top:10px">' + (r.ai.source === 'levelup' ? '<p style="margin:0 0 8px"><b>Overall CEFR (LevelUp): ' + esc(r.ai.cefr || '—') + '</b><span class="tiny"> · Respondent ID ' + esc(r.ai.respondentId || '') + (r.ai.at ? ' · marked ' + esc(bkkStamp(r.ai.at)) : '') + '</span></p><div class="tiny" style="margin-bottom:4px">Examiner feedback</div>' : '') + (r.ai.comment ? '<div class="aibox">' + esc(r.ai.comment) + '</div>' : '') + (r.ai.errors ? '<div class="errs">' + r.ai.errors.map(function (e) { var rem = C.REMEDIATION[e.tag] || {}; return '<div class="err"><b>' + esc(rem.name || e.tag) + '</b><q>' + esc(e.quote) + '</q> → ' + esc(e.fix) + '</div>'; }).join('') + '</div>' : '') + '<p class="tiny" style="margin-top:8px"><label><input type="checkbox" id="mk-aivis"' + (r.aiVisible ? ' checked' : '') + '> Let the student see this estimate before I release my mark</label></p></div></details>';
    h += '<div class="panel-h" style="margin-top:14px"><h2>Your mark</h2><span class="tiny">Half bands. Overall = average of the four.</span></div><div class="bands">' + ['tr', 'cc', 'lr', 'gra'].map(function (k) { return '<div class="band"><select id="mk-' + k + '">' + opts(bandKey(tb, k)) + '</select><span>' + k.toUpperCase() + '</span></div>'; }).join('') + '<div class="band"><b id="mk-overall">' + (tb.overall ? fmtBand(tb.overall) : '—') + '</b><span>Overall · <i id="mk-cefr">' + (tb.overall ? cefrOf(tb.overall) : '') + '</i></span></div></div>';
    h += '<textarea class="comment" id="mk-comment" placeholder="Nickname, then one specific praise! Quote their words in single quotes. State the level plainly. Name the error types. However, … Just ensure … Finally, … Warm close.">' + esc((r.teacher && r.teacher.comment) || (r.ai && r.ai.comment) || '') + '</textarea>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn" id="mk-save">Save mark</button><button class="btn primary" id="mk-release">Save and release to student</button>' + (r.released ? '<button class="btn ghost" id="mk-unrelease">Withdraw</button>' : '') + '<button class="btn" id="mk-levelup" title="Open LevelUp with this essay and prompt filled in">Send to the examiners →</button><button class="btn ghost" id="mk-copyprompt" title="Copy the marking prompt to paste into Claude">Copy AI prompt</button></div>';
    host.innerHTML = h;
    host.querySelectorAll('[data-mk-go]').forEach(function (b) { b.addEventListener('click', function () { T.markSel = b.dataset.mkGo; if (T.markFilter !== 'all') T.markFilter = 'all'; paintMarking(); }); });
    function bands() {
      var out = {}, sum = 0, n = 0;
      ['tr', 'cc', 'lr', 'gra'].forEach(function (k) { var v = parseFloat($('#mk-' + k).value); if (!isNaN(v)) { out[k] = v; sum += v; n++; } });
      if (n === 4) { out.overall = Math.round(sum / 4 * 2) / 2; $('#mk-overall').textContent = fmtBand(out.overall); $('#mk-cefr').textContent = cefrOf(out.overall); }
      return n === 4 ? out : null;
    }
    ['tr', 'cc', 'lr', 'gra'].forEach(function (k) { $('#mk-' + k).addEventListener('change', bands); });
    function save(release) {
      var b = bands();
      if (!b) { toast('Set all four bands first.'); return; }
      var mark = { teacher: { bands: b, cefr: cefrOf(b.overall), comment: $('#mk-comment').value.trim(), at: new Date().toISOString() }, released: !!release, status: release ? 'released' : 'marked' };
      var vis = $('#mk-aivis'); if (vis) mark.aiVisible = vis.checked;
      api.markReport(id, mark).then(function (res) {
        if (!res || !res.ok) { toast('Could not save.'); return; }
        Object.keys(mark).forEach(function (k) { r[k] = mark[k]; });
        toast(release ? 'Released. The student will see it in her Report Card.' : 'Saved.'); paintMarking(); paintStats();
      });
    }
    $('#mk-save').addEventListener('click', function () { save(false); });
    $('#mk-release').addEventListener('click', function () { save(true); });
    var un = $('#mk-unrelease'); if (un) un.addEventListener('click', function () { api.markReport(id, { released: false, status: 'marked' }).then(function (res) { if (!res || !res.ok) { toast('Could not withdraw: ' + ((res && res.error) || 'try again')); return; } r.released = false; toast('Withdrawn.'); paintMarking(); }); });
    $('#mk-levelup').addEventListener('click', function () { sendToLevelUp(r, pr); });
    $('#mk-copyprompt').addEventListener('click', function () {
      var txt = W.markingPrompt(pr, r.text, { rows: (pre.rows || []).map(function (x) { return { status: x.status, label: x.label }; }) });
      try { navigator.clipboard.writeText(txt); toast('Marking prompt copied — paste it into Claude.'); } catch (e) { prompt('Copy this prompt', txt); }
    });
    var vis2 = $('#mk-aivis'); if (vis2) vis2.addEventListener('change', function () { api.markReport(id, { aiVisible: vis2.checked }).then(function (res) { if (!res || !res.ok) { toast('Could not save: ' + ((res && res.error) || 'try again')); vis2.checked = !vis2.checked; return; } r.aiVisible = vis2.checked; toast(vis2.checked ? 'Estimate visible to the student.' : 'Estimate hidden.'); }); });
  }

  /* ---------------------------------------------------- LevelUp round trip
     "Send to the examiners" opens LevelUp's teacher console with the
     Respondent's ID (name + Bangkok date and time of submission), the prompt
     and the essay filled in, and LevelUp submits it for analysis by itself.
     LevelUp puts its Overall CEFR and examiner feedback in a queue in
     localStorage (both apps are on pegasus028.github.io, so they share it) and
     nudges this tab; each result is saved into its report as `ai` through
     markReport, then taken off the queue. A result that arrives while the
     Staff Room is closed waits there for the next load. */
  var LV = { key: 'lue_results', pending: {}, busy: false };
  function bkkStamp(iso) {
    var d = new Date(iso); if (isNaN(d)) return String(iso || '');
    var t = new Date(d.getTime() + 7 * 3600000).toISOString(); /* Asia/Bangkok is UTC+7 all year */
    return t.slice(0, 10) + ' ' + t.slice(11, 16);
  }
  function respondentId(r) { return String(r.name || r.studentId || 'Student').trim() + ' ' + bkkStamp(r.ts); }
  function sendToLevelUp(r, pr) {
    var payload = { v: 2, source: 'position-control', auto: true, ts: new Date().toISOString(), reportId: r.id, studentId: r.studentId, name: r.name, respondentId: respondentId(r), promptId: r.promptId, prompt: pr.text || r.promptDesc || '', essay: r.text, targetWords: 250 };
    try { localStorage.setItem('lue_handoff', JSON.stringify(payload)); } catch (e) {}
    var packed = ''; try { packed = btoa(unescape(encodeURIComponent(JSON.stringify(payload)))); } catch (e) {}
    var w = window.open(LEVELUP.replace(/index\.html$/, '') + 'teacher.html?from=pc&auto=1' + (packed ? '#pc=' + packed : ''), '_blank');
    if (!w) { toast('Pop-up blocked: allow pop-ups for this site, then press the button again.'); return; }
    LV.pending[r.id] = Date.now();
    toast('Sent to LevelUp. The CEFR result and feedback will come back here.');
    if (T.view === 'marking') paintMarking();
  }
  function lvQueue() { try { var q = JSON.parse(localStorage.getItem(LV.key) || '[]'); return Array.isArray(q) ? q : []; } catch (e) { return []; } }
  function lvDrop(key) { try { localStorage.setItem(LV.key, JSON.stringify(lvQueue().filter(function (x) { return x.key !== key; }))); } catch (e) {} }
  function drainLevelUp() {
    if (LV.busy || !T.loaded) return;
    var q = lvQueue(), item = null, r = null;
    for (var i = 0; i < q.length && !item; i++) {
      var hit = T.reports.filter(function (x) { return x.id === q[i].reportId; })[0];
      if (hit) { item = q[i]; r = hit; }
      else if (Date.now() - Date.parse(q[i].at || 0) > 14 * 86400000) lvDrop(q[i].key); /* no such report for two weeks: give up */
    }
    if (!item) return;
    var ai = { source: 'levelup', cefr: String(item.cefr || ''), comment: String(item.feedback || ''), respondentId: item.respondentId || '', levelupId: item.savedId || '', at: item.at || new Date().toISOString() };
    LV.busy = true;
    api.markReport(r.id, { ai: ai }).then(function (res) {
      LV.busy = false;
      if (!res || !res.ok) { toast('LevelUp result for ' + (r.name || r.studentId) + ' could not be saved yet: ' + ((res && res.error) || 'try again') + ' It stays queued.'); return; }
      r.ai = ai; delete LV.pending[r.id]; lvDrop(item.key);
      toast('LevelUp result saved for ' + (r.name || r.studentId) + ': CEFR ' + (ai.cefr || '—') + '.');
      if (T.view === 'marking') paintMarking();
      drainLevelUp();
    }, function (err) { LV.busy = false; toast('LevelUp result could not be saved yet: ' + ((err && err.message) || err) + ' It stays queued.'); });
  }
  window.addEventListener('storage', function (e) { if (e.key === LV.key) drainLevelUp(); });
  window.addEventListener('focus', drainLevelUp);
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (!d || d.type !== 'levelup-result') return;
    var lvOrigin = ''; try { lvOrigin = new URL(LEVELUP, location.href).origin; } catch (x) {}
    if (e.origin !== location.origin && e.origin !== lvOrigin) return;
    /* A LevelUp on another origin cannot reach this queue, so it sends the result itself. */
    if (d.item && d.item.key && d.item.reportId && !lvQueue().some(function (x) { return x.key === d.item.key; })) {
      try { var q = lvQueue(); q.push(d.item); localStorage.setItem(LV.key, JSON.stringify(q)); } catch (x) {}
    }
    drainLevelUp();
  });

  /* --------------------------------------------------------- assignments */
  function paintAssign() {
    var cohorts = {}; T.roster.forEach(function (s) { cohorts[cohortOf(s)] = 1; });
    var essays = T.assignments.filter(function (a) { return !isOrder(a); }), orders = T.assignments.filter(isOrder);
    var h = '<div class="panel-h"><h2>Assignments (owl post)</h2></div><div class="grid"><div class="card panel form">' +
      '<div class="row"><div><label>Who</label><select id="a-cohort"><option value="all">Everyone</option>' + Object.keys(cohorts).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select></div><div><label>Or one student</label><select id="a-student"><option value="">—</option>' + T.roster.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc((s.progress || {}).displayName || s.name || s.id) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="row"><div><label>Prompt</label><select id="a-prompt"><option value="random">Random of the type below</option>' + C.PROMPTS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.title) + ' · ' + typeName(p.type) + ' · ' + esc(C.DOMAINS[p.domain] || p.domain) + '</option>'; }).join('') + '</select></div><div><label>Type (for random)</label><select id="a-type"><option value="any">Any</option>' + Object.keys(C.TYPES).map(function (t) { return '<option value="' + t + '">' + typeName(t) + '</option>'; }).join('') + '</select></div><div><label>Domain (for random)</label><select id="a-level"><option value="any">Any</option>' + Object.keys(C.DOMAINS).map(function (d) { return '<option value="' + d + '">' + esc(C.DOMAINS[d]) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="row"><div><label>Mode</label><select id="a-ui"><option value="guided">Guided (frames + matrix)</option><option value="skeleton">Skeleton (slot labels only)</option><option value="exam">Exam (blank page)</option></select></div><div><label>Timer</label><select id="a-timed"><option value="40">40 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="0">Untimed</option></select></div><div><label>Due</label><input type="date" id="a-due"></div></div>' +
      '<div><label>Title</label><input type="text" id="a-title" placeholder="e.g. Week 8 — discuss both views, exam mode" style="width:100%"></div><div><label>Note to the student</label><input type="text" id="a-note" placeholder="Optional" style="width:100%"></div>' +
      '<div><button class="btn primary" id="a-set">Set assignment</button></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Open assignments</h2><span class="tiny">students see these as owl post</span></div><div id="a-list">' + (essays.length ? essays.slice().reverse().map(function (a) {
        var pr = PR.get(a.promptId) || {}; var done = T.reports.filter(function (r) { return r.assignmentId === a.id; }).length;
        return '<div class="assignrow"><div class="grow"><b>' + esc(a.title || pr.title || a.id) + '</b><div class="tiny">' + esc((a.studentId ? 'for ' + a.studentId : a.cohort === 'all' ? 'everyone' : a.cohort) + ' · ' + (pr.title || '') + ' · ' + (a.uiMode || 'guided') + ' · ' + (a.timed === false ? 'untimed' : (a.minutes || 40) + ' min') + (a.due ? ' · due ' + a.due : '') + ' · ' + done + ' submitted') + '</div></div><button class="btn sm" data-rm="' + esc(a.id) + '">Remove</button></div>';
      }).join('') : '<p class="tiny">None yet.</p>') + '</div>' +
      '<div class="panel-h" style="margin-top:16px"><h2>Story orders</h2><span class="tiny">chapter unlocks and re-sorts · applied quietly, never shown as owl post</span></div><div id="o-list">' + (orders.length ? orders.slice().reverse().map(function (a) {
        return '<div class="assignrow order"><div class="grow"><b>' + (a.kind === 'resort' ? 'Re-sort' : a.kind === 'coreset' ? 'Five prompts' : a.kind === 'challenge' ? 'House challenge' : 'Chapter unlock') + '</b><div class="tiny">' + esc(orderLabel(a)) + ' · set ' + esc(String(a.ts || '').slice(0, 10)) + '</div></div><button class="btn sm" data-orm="' + esc(a.id) + '">Remove</button></div>';
      }).join('') : '<p class="tiny">None. Use the Quillmoor story panel of a student, or "Unlock all chapters" in the House Cup.</p>') + '</div></div></div>';
    /* Your five for a whole class (E4). A student's own five (her panel) wins over the class five. */
    h += '<div class="card panel form" id="c5-card" style="margin-top:16px"><div class="panel-h"><h2>Five prompts for a class</h2><span class="tiny">one per question type, worked in this order · the other prompts stay open as extra practice</span></div>' +
      '<div class="row"><div><label>Class</label><select id="c5-cohort"><option value="all">Everyone</option>' + Object.keys(cohorts).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="c5-form">' + fiveSelects('data-c5', defaultCore()) + '</div>' +
      '<div><button class="btn primary" id="c5-save">Set these five</button> <span class="tiny">Students see them on their next visit. A five you set in a student\'s own panel stays hers.</span></div></div>';
    /* the weekly house challenge (WP10c): totals only on the students' side */
    var today = bkkDate(0), live = T.assignments.filter(function (a) { return a.kind === 'challenge' && (!a.to || a.to >= today); });
    h += '<div class="card panel form" id="chal-card" style="margin-top:16px"><div class="panel-h"><h2>Weekly house challenge</h2><span class="tiny">students see house totals only, never names · totals need the redeployed class server (version ' + EXPECTED_BACKEND + ')</span></div>' +
      '<div class="row"><div><label>Class</label><select id="chal-cohort"><option value="all">Everyone</option>' + Object.keys(cohorts).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select></div>' +
      '<div><label>What counts</label><select id="chal-metric">' + METRICS.map(function (m) { return '<option value="' + m[0] + '">' + esc(m[1]) + '</option>'; }).join('') + '</select></div>' +
      '<div><label>From</label><input type="date" id="chal-from" value="' + today + '"></div><div><label>To</label><input type="date" id="chal-to" value="' + bkkDate(6) + '"></div></div>' +
      '<div><label>Title (what the students see)</label><input type="text" id="chal-title" placeholder="e.g. Most essays sent this week" style="width:100%"></div>' +
      '<div><button class="btn primary" id="chal-save">Set the challenge</button> <span class="tiny">Each student scores her own part from her progress; the server adds the parts up by house.</span></div>' +
      (live.length ? '<div class="tiny" style="margin-top:8px"><b>Live now:</b> ' + live.map(function (a) { return esc(orderLabel(a)); }).join(' · ') + '</div>' : '') + '</div>';
    $('#view-assign').innerHTML = h;
    $('#chal-save').addEventListener('click', function () {
      var from = $('#chal-from').value, to = $('#chal-to').value, metric = $('#chal-metric').value, coh = $('#chal-cohort').value;
      if (!from || !to || to < from) { toast('Choose the week: from and to.'); return; }
      sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'challenge', cohort: coh, title: $('#chal-title').value.trim() || metricName(metric), metric: metric, from: from, to: to }, 'House challenge set for ' + (coh === 'all' ? 'everyone' : coh) + '.');
    });
    $('#c5-save').addEventListener('click', function () {
      var five = readFive($('#c5-card'), 'data-c5'), coh = $('#c5-cohort').value;
      if (five.length !== CORE_TYPES.length) { toast('Choose one prompt for each type.'); return; }
      sendOrder({ id: uidO(), ts: new Date().toISOString(), kind: 'coreset', cohort: coh, prompts: five }, 'Five prompts set for ' + (coh === 'all' ? 'everyone' : coh) + '.');
    });
    $('#a-set').addEventListener('click', function () {
      var pid = $('#a-prompt').value;
      if (pid === 'random') {
        var pool = C.PROMPTS.filter(function (p) { return ($('#a-type').value === 'any' || p.type === $('#a-type').value) && ($('#a-level').value === 'any' || p.domain === $('#a-level').value); });
        if (!pool.length) { toast('No prompt matches.'); return; }
        pid = pool[Math.floor(Math.random() * pool.length)].id;
      }
      var mins = parseInt($('#a-timed').value, 10);
      var row = { id: 'A' + Date.now().toString(36), ts: new Date().toISOString(), cohort: $('#a-cohort').value, studentId: $('#a-student').value, promptId: pid, uiMode: $('#a-ui').value, timed: mins > 0, minutes: mins || 0, due: $('#a-due').value, title: $('#a-title').value.trim(), note: $('#a-note').value.trim() };
      api.assignments('set', row).then(function (r) { T.assignments = (r && r.assignments) || T.assignments.concat([row]); toast('Assignment set.'); paintAssign(); });
    });
    $('#view-assign').querySelectorAll('[data-orm]').forEach(function (b) { b.addEventListener('click', function () { removeOrder(b.dataset.orm); }); });
    $('#view-assign').querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { api.assignments('remove', { id: b.dataset.rm }).then(function (r) { T.assignments = (r && r.assignments) || T.assignments.filter(function (a) { return a.id !== b.dataset.rm; }); paintAssign(); }); }); });
  }

  /* A removed unlock stops applying to students who have not yet opened the
     app since it was set; one already applied stays applied on their side. */
  function removeOrder(oid) {
    api.assignments('remove', { id: oid }).then(function (r) {
      T.assignments = (r && r.assignments) || T.assignments.filter(function (a) { return a.id !== oid; });
      toast('Order removed.');
      paintHouseCup(); if (T.view === 'assign') paintAssign(); if (T.sel) openStudent(T.sel);
    });
  }

  /* ----------------------------------------------------------- projector */
  var GAMES = [
    { id: 'thesis', name: 'Thesis Sniper', blurb: 'Sixty seconds: teams post the one-sentence position for the prompt. Judge: one sentence, one clear side, on topic.' },
    { id: 'degeneralise', name: 'De-generalise It', blurb: 'Show a vague Band 6 claim; teams post it with a mechanism and a concrete example added.' },
    { id: 'nuance', name: 'Nuance Duel', blurb: 'Teams post the nuance sentence for a facet: admit the limit, keep the position. No contradictions, no new facets.' },
    { id: 'detox', name: 'Linker Detox', blurb: 'Teams rewrite a linker-heavy paragraph with no Firstly / Moreover / In conclusion — reference and substitution only.' },
    { id: 'nominal', name: 'Nominalisation Gym', blurb: 'A clause goes up; teams post it as a dense noun phrase. "Because prices rose, people bought less" → "Rising prices reduced consumption".' },
    { id: 'fix', name: 'Fix the Band 6', blurb: 'Show the Band 6 contrast essay; teams post the upgraded introduction, then an upgraded body paragraph.' }
  ];
  function paintProjectorHome() {
    $('#view-projector').innerHTML = '<div class="panel-h"><h2>Projector mode</h2><span class="tiny">Full screen for the classroom. Students post from their console at <b>index.html#live</b> with the round code.</span></div>' +
      '<div class="card panel form"><div class="row"><div><label>Game</label><select id="pj-game">' + GAMES.map(function (g) { return '<option value="' + g.id + '">' + esc(g.name) + '</option>'; }).join('') + '</select></div><div><label>Prompt</label><select id="pj-prompt">' + C.PROMPTS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.title) + ' · ' + typeName(p.type) + '</option>'; }).join('') + '</select></div><div><label>Minutes</label><input type="number" id="pj-min" value="3" min="1" max="20" style="width:80px"></div></div><div><button class="btn primary" id="pj-go">Open projector</button></div>' +
      '<div style="margin-top:10px">' + GAMES.map(function (g) { return '<div class="tiny"><b>' + esc(g.name) + '</b> — ' + esc(g.blurb) + '</div>'; }).join('') + '</div></div>';
    $('#pj-go').addEventListener('click', function () { openProjector($('#pj-game').value, $('#pj-prompt').value, parseInt($('#pj-min').value, 10) || 3); });
  }
  function openProjector(gameId, promptId, minutes) {
    var g = GAMES.filter(function (x) { return x.id === gameId; })[0], pr = PR.get(promptId);
    var round = { round: 'L' + Math.random().toString(36).slice(2, 6).toUpperCase(), game: gameId, promptId: promptId, t0: Date.now(), minutes: minutes };
    T.proj = { round: round, posts: [], scores: {}, tick: null };
    api.projector('clear', {}).then(function () { api.projector('post', { kind: 'round', round: round.round, game: gameId, promptId: promptId, minutes: minutes, ts: new Date().toISOString() }); });
    var host = $('#projector'); host.classList.remove('hidden');
    host.innerHTML = '<div class="proj-top"><h1>' + esc(g.name) + '</h1><span class="projcode" title="Students enter this code">' + round.round + '</span><span class="tiny">' + esc(g.blurb) + '</span><span class="proj-clock" id="pj-clock">' + mmss(minutes * 60) + '</span><button class="btn" id="pj-close">Close</button></div>' +
      '<div class="proj-grid"><div><div id="pj-chart"></div>' + (gameId === 'fix' ? '<div class="card panel" id="pj-script"></div>' : '') + '<div class="card panel"><h2 style="font-size:1rem;margin-bottom:8px">Scoreboard</h2><ul class="board" id="pj-board"><li class="tiny">No points yet.</li></ul></div></div><div><h2 style="font-size:1rem;margin-bottom:8px">Posts <span class="tiny" id="pj-n"></span></h2><div class="proj-posts" id="pj-posts"><div class="empty">Waiting for teams…</div></div></div></div>';
    $('#pj-chart').innerHTML = PR.card(pr, { demand: true });
    if (gameId === 'fix') { var m = C.MODELS.filter(function (x) { return x.contrast && x.promptId === promptId; })[0] || C.MODELS.filter(function (x) { return x.contrast; })[0]; if (m) $('#pj-script').innerHTML = '<p class="kicker">The Band ' + esc(m.contrast.band) + ' script</p>' + m.contrast.paragraphs.map(function (pg) { return '<div class="mpara">' + esc(pg.text) + '</div>'; }).join(''); }
    $('#pj-close').addEventListener('click', function () { clearInterval(T.proj.tick); host.classList.add('hidden'); T.proj = null; });
    var end = Date.now() + minutes * 60000;
    T.proj.tick = setInterval(function () {
      var left = Math.max(0, Math.round((end - Date.now()) / 1000));
      var c = $('#pj-clock'); if (c) { c.textContent = mmss(left); c.classList.toggle('low', left <= 30); }
      if (Date.now() % 4000 < 1000) pollPosts();
    }, 1000);
    pollPosts();
  }
  function pollPosts() {
    if (!T.proj) return;
    api.projector('list', { round: T.proj.round.round }).then(function (r) {
      if (!T.proj) return;
      var posts = ((r && r.posts) || []).filter(function (p) { return p.kind === 'post' && p.round === T.proj.round.round; });
      var seen = {}; T.proj.posts.forEach(function (p) { seen[p.id] = 1; });
      posts.forEach(function (p) { if (!seen[p.id]) T.proj.posts.push(p); });
      paintPosts();
    });
  }
  function paintPosts() {
    var host = $('#pj-posts'); if (!host) return;
    var posts = T.proj.posts;
    $('#pj-n').textContent = posts.length ? posts.length + ' posted' : '';
    host.innerHTML = posts.length ? posts.slice().reverse().map(function (p, i) {
      return '<div class="post' + (p.win ? ' win' : '') + '" data-id="' + esc(p.id) + '"><span class="pn">#' + (posts.length - i) + (p.revealed ? ' ' + esc(p.team) : '') + '</span><span class="grow">' + esc(p.text) + '</span><span class="vote"><button class="btn sm" data-pt="' + esc(p.id) + '" data-v="1">+1</button><button class="btn sm ghost" data-pt="' + esc(p.id) + '" data-v="-1">−1</button><button class="btn sm ghost" data-rv="' + esc(p.id) + '">who?</button></span></div>';
    }).join('') : '<div class="empty">Waiting for teams…</div>';
    host.querySelectorAll('[data-pt]').forEach(function (b) { b.addEventListener('click', function () {
      var p = posts.filter(function (x) { return x.id === b.dataset.pt; })[0]; if (!p) return;
      T.proj.scores[p.team] = (T.proj.scores[p.team] || 0) + parseInt(b.dataset.v, 10); if (b.dataset.v === '1') p.win = true; paintBoard(); paintPosts();
    }); });
    host.querySelectorAll('[data-rv]').forEach(function (b) { b.addEventListener('click', function () { var p = posts.filter(function (x) { return x.id === b.dataset.rv; })[0]; if (p) { p.revealed = true; paintPosts(); } }); });
  }
  function paintBoard() {
    var s = T.proj.scores, keys = Object.keys(s).sort(function (a, b) { return s[b] - s[a]; });
    $('#pj-board').innerHTML = keys.length ? keys.map(function (k, i) { return '<li><span>' + (i + 1) + '. ' + esc(k) + '</span><b>' + s[k] + '</b></li>'; }).join('') : '<li class="tiny">No points yet.</li>';
  }

  /* ------------------------------------------------------------ exports */
  function csv(rows) { return rows.map(function (r) { return r.map(function (c) { var s = String(c == null ? '' : c); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(','); }).join('\n'); }
  function download(name, text) { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' })); a.download = name; a.click(); }
  $('#t-csv').addEventListener('click', function () {
    var rows = [['Student ID', 'Name', 'Cohort', 'Classes passed', 'TA', 'CC', 'LR', 'GRA', 'Accuracy %', 'Reports', 'Last band', 'Best band', 'Candles (streak)', 'Last active', 'House', 'Chapter', 'House points', 'Lessons read at', 'Duel level', 'Her five', 'Five set by', 'Five written', 'Five revised', 'Mostly-frame essays', 'Revisions']];
    T.roster.forEach(function (s) { var p = s.progress || P.blank(s.id), g = P.gateReadiness(p), st = storyOf(p), cp = coreProg(s), mine = reportsOf(s.id); rows.push([s.id, p.displayName || s.name, cohortOf(s), P.checksCleared(p), g.TR, g.CC, g.LR, g.GRA, P.accuracy(p), mine.length, lastBand(s.id) || '', p.bestBand || '', p.streak || 0, p.lastActiveDate || '', st.house || '', st.chapter || '', st.hp || 0, p.explainLevel || 'C1', p.duelTier || p.tier || 'B2',
      cp.core.prompts.join(' '), cp.core.by + (cp.core.pending ? ' (pending)' : ''), cp.essays, cp.done, mine.filter(frameOnly).length, mine.filter(function (r) { return r.revisionOf; }).length]); });
    rows.push([]); rows.push(['Essay ID', 'Student', 'Date', 'Prompt', 'Type', 'Mode', 'Kind', 'Words', 'Seconds', 'Red', 'Amber', 'Template %', 'TR', 'CC', 'LR', 'GRA', 'Overall', 'CEFR', 'Released', 'Comment', 'Own words %', 'Own sentences', 'Fill used', 'Landing agree %', 'Revision of', 'Revised row', 'Mostly frame', 'Merits', 'Revised paragraph']);
    T.reports.forEach(function (r) { var b = bandsOf(r) || {}, m = markOf(r) || {}, ag = agreeOf(r); rows.push([r.id, r.studentId, String(r.ts).slice(0, 10), r.promptId, r.type, r.uiMode || '', r.kind, r.words, r.seconds, (r.preflight || {}).bad, (r.preflight || {}).warn, Math.round(((r.preflight || {}).ratio || 0) * 100), bandKey(b, 'tr'), b.cc, b.lr, b.gra, b.overall, m.cefr, r.released ? 'yes' : 'no', m.comment || '',
      typeof r.ownShare === 'number' ? Math.round(r.ownShare * 100) : '', r.ownSentences == null ? '' : r.ownSentences, r.fillUsed == null ? '' : (r.fillUsed ? 'yes' : 'no'), ag == null ? '' : Math.round(ag * 100), r.revisionOf || '', r.reviseRow || '', frameOnly(r) ? 'yes' : 'no', r.merits == null ? '' : r.merits, r.reviseBox || '']); });
    download('quillmoor-' + E.today() + '.csv', csv(rows));
  });
  /* Blooket import: Question, Answer 1-4, Time, Correct answers */
  $('#t-blooket').addEventListener('click', function () {
    var rows = [['Question Text', 'Answer 1', 'Answer 2', 'Answer 3', 'Answer 4', 'Time Limit (sec) (Max: 300 seconds)', 'Correct Answer(s) (Only include Answer #)']];
    C.TOPICS.forEach(function (t) { t.levels[0].subs.forEach(function (s) { s.items.forEach(function (it) {
      if (it.type !== 'choose' || it.prompt || !it.options || it.options.length < 3) return;
      var opts = it.options.map(function (o) { return E.stripTags(o); }).slice(0, 4);
      while (opts.length < 4) opts.push('');
      rows.push([E.stripTags(it.stem), opts[0], opts[1], opts[2], opts[3], 20, it.answer + 1]);
    }); }); });
    download('quillmoor-blooket.csv', csv(rows));
    toast(rows.length - 1 + ' questions exported for Blooket import.');
  });
  function printCard(id) {
    var s = T.roster.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var p = s.progress || P.blank(id), g = P.gateReadiness(p), reps = reportsOf(id).filter(function (r) { return r.released && r.teacher; });
    var h = '<div class="pg"><h2>Quillmoor Academy — IELTS Writing Task 2 report card</h2><div class="meta">' + esc(p.displayName || id) + ' · ' + esc(id) + ' · ' + esc(cohortOf(s)) + ' · ' + E.today() + '</div>' +
      '<table><tr><th>Classes passed</th><th>TR</th><th>CC</th><th>LR</th><th>GRA</th><th>Best band</th></tr><tr><td>' + P.checksCleared(p) + '/' + C.TOPICS.length + '</td><td>' + g.TR + '%</td><td>' + g.CC + '%</td><td>' + g.LR + '%</td><td>' + g.GRA + '%</td><td>' + (p.bestBand ? fmtBand(p.bestBand) : '—') + '</td></tr></table>';
    reps.forEach(function (r) { var pr = PR.get(r.promptId) || {}, b = r.teacher.bands; h += '<h2 style="font-size:13pt">' + esc(pr.title) + ' · ' + esc(String(r.ts).slice(0, 10)) + '</h2><table><tr><th>TR</th><th>CC</th><th>LR</th><th>GRA</th><th>Overall</th><th>CEFR</th></tr><tr><td>' + fmtBand(bandKey(b, 'tr')) + '</td><td>' + fmtBand(b.cc) + '</td><td>' + fmtBand(b.lr) + '</td><td>' + fmtBand(b.gra) + '</td><td>' + fmtBand(b.overall) + '</td><td>' + esc(r.teacher.cefr || '') + '</td></tr></table><p>' + esc(r.teacher.comment || '') + '</p>'; });
    $('#printable').innerHTML = h + '</div>';
    window.print();
  }
})();
