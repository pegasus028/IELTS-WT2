/* ===========================================================================
   POSITION CONTROL — teacher.js  (Flight Deck)
   Class view (stats, roster by cohort, heat map, module bars, student
   detail with diagnosis and reports), the marking queue, assignments and
   projector mode for the classroom games.
   =========================================================================== */
(function () {
  'use strict';
  var C = window.CONTENT, E = window.Engine, P = E.Progress, api = window.API, W = window.Writer, PR = window.Prompts;
  var LEVELUP = window.PC_LEVELUP_URL || 'https://pegasus028.github.io/LevelUp/';
  var $ = function (s) { return document.querySelector(s); };
  var esc = E.esc;
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
  function cefrOf(b) { return b >= 8.5 ? 'C2' : b >= 7.5 ? 'C1' : b >= 6.5 ? 'B2+' : b >= 6 ? 'B2' : b >= 5.5 ? 'B1+' : b >= 4.5 ? 'B1' : 'A2'; }

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
      if (r.ok) { $('#top-sub').textContent = 'Connected · ' + (r.sheet || 'class sheet'); toast('Connected to ' + (r.sheet || 'the class sheet') + '.'); }
      else {
        $('#top-sub').textContent = 'Server not answering — showing local data';
        $('#modebar-slot').innerHTML = '<div class="wrap"><div class="modebar"><span><b>Not connected</b> &nbsp;The class server did not answer, so this is local data only. Check the Apps Script deployment is <em>Execute as: Me</em> and <em>Access: Anyone</em>, and that you deployed a <em>new version</em> after your last edit.' + (r.error ? ' &nbsp;(' + esc(r.error) + ')' : '') + '</span></div></div>';
      }
    });
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
      paintStats(); paintCohorts(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems();
      var q = T.reports.filter(function (x) { return !x.released; }).length;
      $('#nav-queue').textContent = q ? ' (' + q + ')' : '';
      if (T.sel) openStudent(T.sel);
      if (T.view === 'marking') paintMarking();
      if (T.view === 'assign') paintAssign();
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
    $('#cohorts').querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { T.cohort = b.dataset.c; paintStats(); paintCohorts(); paintRoster(); paintHeat(); paintHeatmap(); paintSystems(); }); });
  }
  var COLS = [{ k: 'name', t: 'Student' }, { k: 'rank', t: 'Modules' }, { k: 'ready', t: 'TR · CC · LR · GRA' }, { k: 'band', t: 'Last band' }, { k: 'reps', t: 'Reports' }, { k: 'faults', t: 'Faults' }, { k: 'streak', t: 'Streak' }, { k: 'seen2', t: 'Last seen' }, { k: null, t: '' }];
  function paintRoster() {
    var list = visible();
    $('#roster-n').textContent = list.length + ' enrolled';
    if (!list.length) { $('#roster').innerHTML = '<tbody><tr><td><div class="empty">No students yet. They appear here as soon as they create an account.</div></td></tr></tbody>'; return; }
    var rows = list.map(function (s) {
      var p = s.progress || P.blank(s.id, s.name), g = P.gateReadiness(p);
      var stale = p.lastActiveDate ? E.daysBetween(p.lastActiveDate, E.today()) : 999, cleared = P.checksCleared(p);
      var flag = (!p.stats || p.stats.seen < 5) ? '<span class="flag new">new</span>' : stale > 7 ? '<span class="flag stall">stalled</span>' : cleared >= 11 ? '<span class="flag fly">flying</span>' : '';
      return { s: s, p: p, g: g, ready: Math.round((g.TR + g.CC + g.LR + g.GRA) / 4), rank: cleared, band: lastBand(s.id) || 0, reps: reportsOf(s.id).length, faults: P.dueReview(p).length, flag: flag, stale: stale };
    });
    if (T.q) { var q = T.q.toLowerCase(); rows = rows.filter(function (r) { return (r.p.displayName || '').toLowerCase().indexOf(q) >= 0 || r.s.id.toLowerCase().indexOf(q) >= 0; }); }
    var key = T.sort, dir = T.dir;
    rows.sort(function (a, b) {
      if (key === 'name') { var x = (a.p.displayName || a.s.id).toLowerCase(), y = (b.p.displayName || b.s.id).toLowerCase(); return x < y ? -dir : x > y ? dir : 0; }
      var xv = key === 'seen2' ? -a.stale : key === 'streak' ? (a.p.streak || 0) : a[key] || 0, yv = key === 'seen2' ? -b.stale : key === 'streak' ? (b.p.streak || 0) : b[key] || 0;
      return (xv - yv) * dir;
    });
    var html = '<thead><tr>' + COLS.map(function (c) { if (!c.k) return '<th></th>'; var on = T.sort === c.k; return '<th class="' + (on ? 'on' : '') + '" data-sort="' + c.k + '">' + esc(c.t) + (on ? (dir < 0 ? ' ↓' : ' ↑') : '') + '</th>'; }).join('') + '</tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr class="r' + (T.sel === r.s.id ? ' sel' : '') + '" data-id="' + esc(r.s.id) + '"><td><div class="who2"><b>' + esc(r.p.displayName || r.s.name) + '</b><span>' + esc(r.s.id) + ' · ' + esc(cohortOf(r.s)) + '</span></div></td>' +
        '<td>' + r.rank + '/' + C.TOPICS.length + ' <span style="color:var(--ink-3);font-family:var(--f-mono);font-size:.75rem">' + esc(P.rank(r.p).name) + '</span></td>' +
        '<td>' + ['TR', 'CC', 'LR', 'GRA'].map(function (k) { return '<span class="mini' + (k === 'TR' ? ' gold' : '') + '" title="' + k + ' ' + r.g[k] + '%"><i style="width:' + r.g[k] + '%"></i></span>'; }).join('') + ' <span style="font-family:var(--f-mono);font-size:.78rem">' + r.ready + '%</span></td>' +
        '<td class="num">' + (r.band ? fmtBand(r.band) : '—') + '</td><td class="num">' + r.reps + '</td><td class="num">' + r.faults + '</td><td class="num">' + (r.p.streak || 0) + '</td><td>' + esc(ago(r.p.lastActiveDate ? r.p.lastActiveDate + 'T12:00:00' : null)) + '</td><td>' + r.flag + '</td></tr>';
    });
    $('#roster').innerHTML = html + '</tbody>';
    $('#roster').querySelectorAll('tr.r').forEach(function (tr) { tr.addEventListener('click', function () { T.sel = tr.dataset.id; paintRoster(); openStudent(tr.dataset.id); }); });
    $('#roster').querySelectorAll('th[data-sort]').forEach(function (th) { th.addEventListener('click', function () { var k = th.dataset.sort; if (T.sort === k) T.dir = -T.dir; else { T.sort = k; T.dir = k === 'name' ? 1 : -1; } paintRoster(); }); });
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
    $('#heat').innerHTML = rows.map(function (r) { return '<div class="heat-row"><span>' + esc(r.name) + '</span><span class="heat-bar"><i style="width:' + Math.round(r.rate * 100) + '%"></i></span><span class="heat-n">' + Math.round(r.rate * 100) + '%</span></div>'; }).join('') + '<p class="tiny" style="margin-top:8px">Error rate across the cohort (module answers plus red pre-flight rows), tags with three or more attempts. The top row is the candidate for Monday\'s whole-class lesson.</p>';
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
  function openStudent(id) {
    api.detail(id).then(function (d) {
      if (!d || !d.ok) { $('#detail').innerHTML = '<div class="empty">Could not load that student.</div>'; return; }
      T.detail = d;
      var p = d.progress || P.blank(id), g = P.gateReadiness(p), weak = P.weakTags(p, 4), strong = P.strongTags(p, 4);
      var reps = reportsOf(id);
      var h = '<div class="panel-h"><div><h2>' + esc(p.displayName || id) + '</h2><span class="kicker">' + esc(id) + ' · ' + esc(P.rank(p).name) + ' · ' + P.checksCleared(p) + '/' + C.TOPICS.length + ' modules · ' + esc(p.cohort || cohortOf({ id: id })) + '</span></div><span class="pill' + (P.accuracy(p) >= 80 ? ' good' : P.accuracy(p) >= 60 ? '' : ' bad') + '">' + P.accuracy(p) + '% accurate</span></div>';
      h += '<div class="gates">' + ['TR', 'CC', 'LR', 'GRA'].map(function (k) { return '<div class="gate"><span>' + k + '</span><b>' + g[k] + '%</b></div>'; }).join('') + '</div>';
      /* reports */
      h += '<details class="disc" open><summary>Reports<span class="count">' + reps.length + ' written · ' + reps.filter(function (r) { return !r.released; }).length + ' unreleased</span></summary><div class="disc-body" style="padding-top:10px">';
      h += reps.length ? '<div class="replist">' + reps.map(function (r) { var pr = PR.get(r.promptId) || {}, b = bandsOf(r); return '<button class="rep" data-open="' + esc(r.id) + '"><span class="rep-t"><span class="rep-n">' + esc(pr.title || r.promptId) + '</span><span class="rep-s">' + esc(String(r.ts).slice(0, 10) + ' · ' + typeName(r.type) + ' · ' + r.words + ' w · ' + mmss(r.seconds || 0) + ' · ' + (r.uiMode || '') + ' · ' + (r.kind || 'practice') + ' · ' + ((r.preflight || {}).bad || 0) + ' red · ' + (r.released ? 'released' : r.teacher ? 'marked, not released' : r.ai ? 'AI estimate' : 'unmarked')) + '</span></span><span class="rep-b">' + (b ? fmtBand(b.overall) : '—') + '</span></button>'; }).join('') + '</div>' : '<p class="tiny">No reports yet.</p>';
      h += '<div style="margin-top:10px"><button class="btn sm" id="d-assign">Set an essay for ' + esc(p.displayName || id) + '</button> <button class="btn sm" id="d-print">Print report card</button></div></div></details>';
      /* Template Lab: lab.js keeps a summary on the progress object; the full
         blueprints, essays and coaching are in the LabTemplates / LabAttempts tabs. */
      var lab = p.lab;
      if (lab && (lab.points || lab.runs || lab.templatesComplete)) {
        var pcs = lab.pcts || {};
        h += '<details class="disc"><summary>Template Lab<span class="count">' + (lab.points || 0) + ' pts · ' + (lab.runs || 0) + ' runs · best band ' + (lab.bestBand != null ? fmtBand(lab.bestBand) : '—') + '</span></summary><div class="disc-body" style="padding-top:10px">' +
          '<table class="roster" style="min-width:0"><thead><tr><th>Template share</th><th>Runs</th><th>Average band</th><th>Best band</th></tr></thead><tbody>' +
          ['60', '50', '40', '30'].map(function (k) { var x = pcs[k] || {}; return '<tr><td>' + k + '%</td><td>' + (x.n || 0) + '</td><td>' + (x.rated ? fmtBand(x.sum / x.rated) : '—') + '</td><td>' + (x.best != null ? fmtBand(x.best) : '—') + '</td></tr>'; }).join('') +
          '</tbody></table><p class="tiny" style="margin-top:8px">' + (lab.templatesComplete || 0) + ' blueprint(s) saved. Every line, essay and piece of coaching is in the LabTemplates and LabAttempts tabs of the class sheet.</p></div></details>';
      }
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
      h += '<details class="disc"><summary>Modules<span class="count">' + P.checksCleared(p) + ' green</span></summary><div class="disc-body" style="padding-top:10px"><div class="sysbars">' + P.systemScores(p).map(function (r) { return '<div class="sysbar"><span>' + esc(r.code) + ' · ' + esc(r.name) + '</span><span class="sysbar-b"><i style="width:' + r.pct + '%"></i></span><span class="sysbar-n">' + r.pct + '%</span></div>'; }).join('') + '</div></div></details>';
      /* log */
      var attempts = (d.attempts || []).filter(function (a) { return a && a.itemId; }).slice().reverse().slice(0, 60);
      h += '<details class="disc"><summary>Answer log<span class="count">' + (d.attempts || []).length + '</span></summary><div class="disc-body" style="padding-top:10px;max-height:340px;overflow:auto"><table class="roster" style="min-width:0"><thead><tr><th>When</th><th>Item</th><th>Tag</th><th>Result</th></tr></thead><tbody>' + attempts.map(function (a) { return '<tr' + (a.correct ? '' : ' style="background:var(--no-soft)"') + '><td>' + esc(String(a.ts).slice(0, 16).replace('T', ' ')) + '</td><td>' + esc(a.itemId) + '</td><td>' + esc((C.REMEDIATION[a.tag] || {}).name || a.tag) + '</td><td>' + (a.correct ? '✓' : '✕ ' + esc(String(a.given || '').slice(0, 60))) + '</td></tr>'; }).join('') + '</tbody></table></div></details>';
      $('#detail').innerHTML = h;
      $('#detail').querySelectorAll('[data-open]').forEach(function (b) { b.addEventListener('click', function () { T.markSel = b.dataset.open; showView('marking'); }); });
      $('#d-assign').addEventListener('click', function () { showView('assign'); $('#a-student').value = id; });
      $('#d-print').addEventListener('click', function () { printCard(id); });
    });
  }

  /* ------------------------------------------------------------- marking */
  function paintMarking() {
    var list = T.reports.filter(function (r) { return T.markFilter === 'all' || (T.markFilter === 'queue' ? !r.released : r.released); });
    if (T.cohort !== 'all') { var ids = {}; visible().forEach(function (s) { ids[s.id] = 1; }); list = list.filter(function (r) { return ids[r.studentId]; }); }
    var html = '<div class="panel-h"><h2>Marking</h2><div class="filters" style="margin:0">' + ['queue', 'released', 'all'].map(function (k) { return '<button data-mf="' + k + '"' + (T.markFilter === k ? ' class="on"' : '') + '>' + k + '</button>'; }).join('') + '</div></div>';
    html += '<div class="mark"><div class="card panel"><div class="replist">' + (list.length ? list.map(function (r) { var pr = PR.get(r.promptId) || {}, b = bandsOf(r); return '<button class="rep' + (T.markSel === r.id ? ' sel' : '') + '" data-mk="' + esc(r.id) + '"><span class="rep-t"><span class="rep-n">' + esc(r.name || r.studentId) + ' — ' + esc(pr.title || r.promptId) + '</span><span class="rep-s">' + esc(String(r.ts).slice(0, 10) + ' · ' + typeName(r.type) + ' · ' + r.words + ' w · ' + ((r.preflight || {}).bad || 0) + ' red · ' + (r.kind || 'practice') + ' · ' + (r.released ? 'released' : r.teacher ? 'marked' : r.ai ? 'AI estimate' : 'unmarked')) + '</span></span><span class="rep-b">' + (b ? fmtBand(b.overall) : '—') + '</span></button>'; }).join('') : '<div class="empty">Nothing here.</div>') + '</div></div><div class="card panel" id="mk-detail"><div class="empty">Pick a report.</div></div></div>';
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
    h += PR.card(pr, { compact: true });
    h += W.paragraphs(r.text).map(function (t) { return '<div class="mpara">' + esc(t).replace(new RegExp(W.LEX.NUANCE.source, 'gi'), '<span class="cmp">$&</span>') + '</div>'; }).join('');
    if (r.firstText) h += '<details class="disc"><summary>First draft (before revision)</summary><div class="disc-body" style="padding-top:10px">' + W.paragraphs(r.firstText).map(function (t) { return '<div class="mpara">' + esc(t) + '</div>'; }).join('') + '</div></details>';
    h += '<details class="disc"><summary>Pre-flight rows<span class="count">' + ((pre.rows || []).length) + '</span></summary><div class="disc-body" style="padding-top:10px">' + (pre.rows || []).map(function (row) { return '<div class="pf-row ' + row.status + '">' + esc(row.label) + '</div>'; }).join('') + '</div></details>';
    if (r.plan && r.plan.vars) { var vv = r.plan.vars, keys = Object.keys(vv).filter(function (k) { return vv[k]; }); if (keys.length) h += '<details class="disc"><summary>The matrix the student planned<span class="count">' + keys.length + ' of 11</span></summary><div class="disc-body" style="padding-top:10px"><ol class="bc-list">' + C.VARIABLES.map(function (v) { return vv[v.key] ? '<li><b>' + esc(v.name) + '</b> — ' + esc(vv[v.key]) + '</li>' : ''; }).join('') + '</ol></div></details>'; }
    if (r.ai) h += '<details class="disc" open><summary>AI estimate<span class="count">' + (r.ai.bands ? fmtBand(r.ai.bands.overall) : '—') + (r.ai.second ? ' · second pass ' + fmtBand(r.ai.second.overall) + (Math.abs(r.ai.second.overall - r.ai.bands.overall) > 0.5 ? ' ⚠ divergent' : '') : '') + '</span></summary><div class="disc-body" style="padding-top:10px">' + (r.ai.comment ? '<div class="aibox">' + esc(r.ai.comment) + '</div>' : '') + (r.ai.errors ? '<div class="errs">' + r.ai.errors.map(function (e) { var rem = C.REMEDIATION[e.tag] || {}; return '<div class="err"><b>' + esc(rem.name || e.tag) + '</b><q>' + esc(e.quote) + '</q> → ' + esc(e.fix) + '</div>'; }).join('') + '</div>' : '') + '<p class="tiny" style="margin-top:8px"><label><input type="checkbox" id="mk-aivis"' + (r.aiVisible ? ' checked' : '') + '> Let the student see this estimate before I release my mark</label></p></div></details>';
    h += '<div class="panel-h" style="margin-top:14px"><h2>Your mark</h2><span class="tiny">Half bands. Overall = average of the four.</span></div><div class="bands">' + ['tr', 'cc', 'lr', 'gra'].map(function (k) { return '<div class="band"><select id="mk-' + k + '">' + opts(bandKey(tb, k)) + '</select><span>' + k.toUpperCase() + '</span></div>'; }).join('') + '<div class="band"><b id="mk-overall">' + (tb.overall ? fmtBand(tb.overall) : '—') + '</b><span>Overall · <i id="mk-cefr">' + (tb.overall ? cefrOf(tb.overall) : '') + '</i></span></div></div>';
    h += '<textarea class="comment" id="mk-comment" placeholder="Nickname, then one specific praise! Quote their words in single quotes. State the level plainly. Name the error types. However, … Just ensure … Finally, … Warm close.">' + esc((r.teacher && r.teacher.comment) || (r.ai && r.ai.comment) || '') + '</textarea>';
    h += '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn" id="mk-save">Save mark</button><button class="btn primary" id="mk-release">Save and release to student</button>' + (r.released ? '<button class="btn ghost" id="mk-unrelease">Withdraw</button>' : '') + '<button class="btn" id="mk-levelup" title="Open LevelUp with this essay and prompt filled in">Mark in LevelUp →</button><button class="btn ghost" id="mk-copyprompt" title="Copy the marking prompt to paste into Claude">Copy AI prompt</button></div>';
    host.innerHTML = h;
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
        toast(release ? 'Released. The student will see it in their Record.' : 'Saved.'); paintMarking(); paintStats();
      });
    }
    $('#mk-save').addEventListener('click', function () { save(false); });
    $('#mk-release').addEventListener('click', function () { save(true); });
    var un = $('#mk-unrelease'); if (un) un.addEventListener('click', function () { api.markReport(id, { released: false, status: 'marked' }).then(function () { r.released = false; toast('Withdrawn.'); paintMarking(); }); });
    $('#mk-levelup').addEventListener('click', function () {
      var payload = { source: 'position-control', ts: new Date().toISOString(), studentId: r.studentId, name: r.name, cohort: r.cohort || '', promptId: r.promptId, prompt: pr.text || r.promptDesc || '', essay: r.text, reportId: r.id, teacher: true };
      try { localStorage.setItem('lue_handoff', JSON.stringify(payload)); } catch (e) {}
      var packed = ''; try { packed = btoa(unescape(encodeURIComponent(JSON.stringify({ prompt: payload.prompt, essay: r.text, name: r.name })))); } catch (e) {}
      window.open(LEVELUP.replace(/index\.html$/, '') + 'teacher.html?from=pc' + (packed ? '#pc=' + packed : ''), '_blank');
    });
    $('#mk-copyprompt').addEventListener('click', function () {
      var txt = W.markingPrompt(pr, r.text, { rows: (pre.rows || []).map(function (x) { return { status: x.status, label: x.label }; }) });
      try { navigator.clipboard.writeText(txt); toast('Marking prompt copied — paste it into Claude.'); } catch (e) { prompt('Copy this prompt', txt); }
    });
    var vis2 = $('#mk-aivis'); if (vis2) vis2.addEventListener('change', function () { api.markReport(id, { aiVisible: vis2.checked }).then(function () { r.aiVisible = vis2.checked; toast(vis2.checked ? 'Estimate visible to the student.' : 'Estimate hidden.'); }); });
  }

  /* --------------------------------------------------------- assignments */
  function paintAssign() {
    var cohorts = {}; T.roster.forEach(function (s) { cohorts[cohortOf(s)] = 1; });
    var h = '<div class="panel-h"><h2>Assignments</h2></div><div class="grid"><div class="card panel form">' +
      '<div class="row"><div><label>Who</label><select id="a-cohort"><option value="all">Everyone</option>' + Object.keys(cohorts).sort().map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('') + '</select></div><div><label>Or one student</label><select id="a-student"><option value="">—</option>' + T.roster.map(function (s) { return '<option value="' + esc(s.id) + '">' + esc((s.progress || {}).displayName || s.name || s.id) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="row"><div><label>Prompt</label><select id="a-prompt"><option value="random">Random of the type below</option>' + C.PROMPTS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.title) + ' · ' + typeName(p.type) + ' · ' + esc(C.DOMAINS[p.domain] || p.domain) + '</option>'; }).join('') + '</select></div><div><label>Type (for random)</label><select id="a-type"><option value="any">Any</option>' + Object.keys(C.TYPES).map(function (t) { return '<option value="' + t + '">' + typeName(t) + '</option>'; }).join('') + '</select></div><div><label>Domain (for random)</label><select id="a-level"><option value="any">Any</option>' + Object.keys(C.DOMAINS).map(function (d) { return '<option value="' + d + '">' + esc(C.DOMAINS[d]) + '</option>'; }).join('') + '</select></div></div>' +
      '<div class="row"><div><label>Mode</label><select id="a-ui"><option value="guided">Guided (frames + matrix)</option><option value="skeleton">Skeleton (slot labels only)</option><option value="exam">Exam (blank page)</option></select></div><div><label>Timer</label><select id="a-timed"><option value="40">40 minutes</option><option value="45">45 minutes</option><option value="60">60 minutes</option><option value="0">Untimed</option></select></div><div><label>Due</label><input type="date" id="a-due"></div></div>' +
      '<div><label>Title</label><input type="text" id="a-title" placeholder="e.g. Week 8 — discuss both views, exam mode" style="width:100%"></div><div><label>Note to the student</label><input type="text" id="a-note" placeholder="Optional" style="width:100%"></div>' +
      '<div><button class="btn primary" id="a-set">Set assignment</button></div></div>' +
      '<div class="card panel"><div class="panel-h"><h2>Open assignments</h2></div><div id="a-list">' + (T.assignments.length ? T.assignments.slice().reverse().map(function (a) {
        var pr = PR.get(a.promptId) || {}; var done = T.reports.filter(function (r) { return r.assignmentId === a.id; }).length;
        return '<div class="assignrow"><div class="grow"><b>' + esc(a.title || pr.title || a.id) + '</b><div class="tiny">' + esc((a.studentId ? 'for ' + a.studentId : a.cohort === 'all' ? 'everyone' : a.cohort) + ' · ' + (pr.title || '') + ' · ' + (a.uiMode || 'guided') + ' · ' + (a.timed === false ? 'untimed' : (a.minutes || 40) + ' min') + (a.due ? ' · due ' + a.due : '') + ' · ' + done + ' submitted') + '</div></div><button class="btn sm" data-rm="' + esc(a.id) + '">Remove</button></div>';
      }).join('') : '<p class="tiny">None yet.</p>') + '</div></div></div>';
    $('#view-assign').innerHTML = h;
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
    $('#view-assign').querySelectorAll('[data-rm]').forEach(function (b) { b.addEventListener('click', function () { api.assignments('remove', { id: b.dataset.rm }).then(function (r) { T.assignments = (r && r.assignments) || T.assignments.filter(function (a) { return a.id !== b.dataset.rm; }); paintAssign(); }); }); });
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
    var rows = [['Student ID', 'Name', 'Cohort', 'Modules green', 'TA', 'CC', 'LR', 'GRA', 'Accuracy %', 'Reports', 'Last band', 'Best band', 'Streak', 'Last active']];
    T.roster.forEach(function (s) { var p = s.progress || P.blank(s.id), g = P.gateReadiness(p); rows.push([s.id, p.displayName || s.name, cohortOf(s), P.checksCleared(p), g.TR, g.CC, g.LR, g.GRA, P.accuracy(p), reportsOf(s.id).length, lastBand(s.id) || '', p.bestBand || '', p.streak || 0, p.lastActiveDate || '']); });
    rows.push([]); rows.push(['Essay ID', 'Student', 'Date', 'Prompt', 'Type', 'Mode', 'Kind', 'Words', 'Seconds', 'Red', 'Amber', 'Template %', 'TR', 'CC', 'LR', 'GRA', 'Overall', 'CEFR', 'Released', 'Comment']);
    T.reports.forEach(function (r) { var b = bandsOf(r) || {}, m = markOf(r) || {}; rows.push([r.id, r.studentId, String(r.ts).slice(0, 10), r.promptId, r.type, r.uiMode || '', r.kind, r.words, r.seconds, (r.preflight || {}).bad, (r.preflight || {}).warn, Math.round(((r.preflight || {}).ratio || 0) * 100), bandKey(b, 'tr'), b.cc, b.lr, b.gra, b.overall, m.cefr, r.released ? 'yes' : 'no', m.comment || '']); });
    download('position-control-' + E.today() + '.csv', csv(rows));
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
    download('position-control-blooket.csv', csv(rows));
    toast(rows.length - 1 + ' questions exported for Blooket import.');
  });
  function printCard(id) {
    var s = T.roster.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    var p = s.progress || P.blank(id), g = P.gateReadiness(p), reps = reportsOf(id).filter(function (r) { return r.released && r.teacher; });
    var h = '<div class="pg"><h2>Position Control — IELTS Writing Task 2 report card</h2><div class="meta">' + esc(p.displayName || id) + ' · ' + esc(id) + ' · ' + esc(cohortOf(s)) + ' · ' + E.today() + '</div>' +
      '<table><tr><th>Modules green</th><th>TR</th><th>CC</th><th>LR</th><th>GRA</th><th>Best band</th></tr><tr><td>' + P.checksCleared(p) + '/' + C.TOPICS.length + '</td><td>' + g.TR + '%</td><td>' + g.CC + '%</td><td>' + g.LR + '%</td><td>' + g.GRA + '%</td><td>' + (p.bestBand ? fmtBand(p.bestBand) : '—') + '</td></tr></table>';
    reps.forEach(function (r) { var pr = PR.get(r.promptId) || {}, b = r.teacher.bands; h += '<h2 style="font-size:13pt">' + esc(pr.title) + ' · ' + esc(String(r.ts).slice(0, 10)) + '</h2><table><tr><th>TR</th><th>CC</th><th>LR</th><th>GRA</th><th>Overall</th><th>CEFR</th></tr><tr><td>' + fmtBand(bandKey(b, 'tr')) + '</td><td>' + fmtBand(b.cc) + '</td><td>' + fmtBand(b.lr) + '</td><td>' + fmtBand(b.gra) + '</td><td>' + fmtBand(b.overall) + '</td><td>' + esc(r.teacher.cefr || '') + '</td></tr></table><p>' + esc(r.teacher.comment || '') + '</p>'; });
    $('#printable').innerHTML = h + '</div>';
    window.print();
  }
})();
