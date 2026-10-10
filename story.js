/* ===========================================================================
   QUILLMOOR ACADEMY — story.js
   The story layer over Position Control: the chapter state machine, the Map
   Room (home screen), the story viewer, the Sorting, events, keepsakes and
   house points. Content lives in story-content.js (window.STORY) and
   sorting.js (window.SORTING); this file only reads them.

   Exported as window.Story. The student console (student.js) hands it a host
   object (window.PCHost) with the progress object, show(), openSub(),
   startCheck(), startAssignment(), sync(), toast(), modal() and esc().

   Progress contract (QUILLMOOR-SPEC.md):
     p.story = { house, sort:{TR,CC,LR,GRA,at}, chapter, unlockedTo, seen:{},
                 flags:{}, keepsakes:[], hp, tournament:{}, visited:{}, words:{} }
   =========================================================================== */
(function (global) {
  'use strict';

  var host = null;
  var st = { screen: null, ch: 1, page: 0, ev: null, evPage: 0, sort: null, cup: null, cupFor: '' };
  var CRITS = ['TR', 'CC', 'LR', 'GRA'];
  var KEEPSAKE_XP = 100, WORD_XP = 2, SORT_XP = 60;
  var TARGET_BAND = 7.5;   /* the Grand Examination standard (the tutees' target) */

  function STORY() { return global.STORY || { houses: [], chapters: [], events: {}, mapIntro: '', finale: { text: '' } }; }
  function SORT() { return global.SORTING || null; }
  function E() { return global.Engine; }
  function P() { return global.Engine.Progress; }
  function C() { return global.CONTENT; }
  function esc(s) { return host && host.esc ? host.esc(s) : String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function p() { return host ? host.p : null; }
  function nowIso() { return new Date().toISOString(); }
  function reducedMotion() { try { return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }

  /* ====================================================== progress state */
  function ensure(pr) {
    if (!pr) return null;
    if (!pr.story) pr.story = {};
    var s = pr.story;
    if (!('house' in s)) s.house = null;
    if (!s.sort) s.sort = null;
    if (!s.chapter) s.chapter = 1;
    if (!s.unlockedTo) s.unlockedTo = 0;
    if (!s.seen) s.seen = {};
    if (!s.flags) s.flags = {};
    if (!s.keepsakes) s.keepsakes = [];
    if (!s.tournament) s.tournament = {};
    if (!s.visited) s.visited = {};
    if (!s.words) s.words = {};
    if (s.hp == null) s.hp = 0;
    return s;
  }
  function chapters() { return STORY().chapters || []; }
  function chapterN(n) { return chapters().filter(function (c) { return c.n === n; })[0] || null; }
  function houseOf(id) { return (STORY().houses || []).filter(function (h) { return h.id === id; })[0] || null; }
  function house(pr) { var s = ensure(pr); return s && s.house ? houseOf(s.house) : null; }

  /* ------------------------------------------------------------ gates */
  function subPassed(pr, subId) { var r = pr.subs && pr.subs[subId]; return !!(r && r.best >= E().PASS_SUB); }
  function levelOf(levelId) { return E().Bank.level(levelId) || null; }
  function checkPassed(pr, levelId) {
    var lv = levelOf(levelId); if (!lv) return false;
    var r = pr.checks && pr.checks[lv.check.id];
    return !!(r && r.best >= E().PASS_CHECK);
  }
  /* A saved Spellbook Workshop design. lab.js keeps a summary on p.lab (synced)
     and the full store under pc.lab.v1.<id>; the share dial under pc.share.<id>. */
  function labDesigned(pr) {
    if (pr.lab && pr.lab.templatesComplete > 0) return true;
    try {
      var sid = String(pr.studentId || '').toLowerCase();
      var d = JSON.parse(localStorage.getItem('pc.lab.v1.' + sid) || 'null');
      if (d && d.templates && d.templates.some(function (t) { return t.status === 'complete'; })) return true;
      if (Number(localStorage.getItem('pc.share.' + pr.studentId))) return true;
    } catch (e) {}
    return false;
  }
  /* An essay handed to the examiners: a submitted report, or a LevelUp hand-off. */
  function essaysSent(pr) {
    var n = (pr.reports || []).length;
    var s = ensure(pr);
    return Math.max(n, (s && s.handoffs) || 0);
  }
  function essaysMarked(pr, min) {
    return (pr.reports || []).filter(function (r) { return r.bands && r.bands.overall >= min; }).length;
  }
  function extraOk(pr, x) {
    if (!x) return true;
    switch (x.id) {
      case 'lab-design': return labDesigned(pr);
      case 'essay-sent': return essaysSent(pr) >= 1;
      case 'faults-under-5': return P().dueReview(pr).length < 5;
      case 'best-band': return (Number(pr[x.field || 'bestBand']) || 0) >= (x.min || TARGET_BAND);
      default: return !!(ensure(pr).flags[x.id]);
    }
  }
  function extraNote(pr, x) {
    switch (x.id) {
      case 'faults-under-5': return P().dueReview(pr).length + ' due now';
      case 'best-band': return pr.bestBand ? 'best so far: Band ' + pr.bestBand : 'no marked essay yet';
      case 'essay-sent': return essaysSent(pr) ? essaysSent(pr) + ' sent' : 'none yet';
      default: return '';
    }
  }
  function gateStatus(pr, ch) {
    var items = [];
    (ch.gate.checks || []).forEach(function (id) {
      var lv = levelOf(id), t = lv ? E().Bank.topic(lv.topicId) : null;
      var name = lv ? (lv.name || id) : id;
      items.push({ kind: 'check', id: id, label: name + ': the examiner\'s gate', ok: checkPassed(pr, id), note: lv ? (t ? t.code : '') : 'unknown gate' });
    });
    (ch.gate.extra || []).forEach(function (x) { items.push({ kind: 'extra', id: x.id, label: x.label, ok: extraOk(pr, x), note: x.note || '', detail: extraNote(pr, x) }); });
    return { ok: items.every(function (i) { return i.ok; }), items: items };
  }
  function cleared(pr, n) { var ch = chapterN(n); return !!(ch && gateStatus(pr, ch).ok); }
  function firstUnmet(pr) {
    var list = chapters();
    for (var i = 0; i < list.length; i++) if (!gateStatus(pr, list[i]).ok) return list[i].n;
    return list.length ? list[list.length - 1].n : 1;
  }
  function chapter(pr) {
    var s = ensure(pr); if (!s) return 1;
    var cur = firstUnmet(pr);
    s.chapter = cur;
    return cur;
  }
  function reachedTo(pr) { var s = ensure(pr); return Math.max(chapter(pr), Math.min(Number(s.unlockedTo) || 0, chapters().length)); }
  function reached(pr, n) { return n <= reachedTo(pr); }
  function allDone(pr) { return chapters().length > 0 && chapters().every(function (c) { return gateStatus(pr, c).ok && hasKeepsake(pr, c.keepsake.id); }); }
  function hasKeepsake(pr, id) { return ensure(pr).keepsakes.indexOf(id) >= 0; }

  /* --------------------------------------------------------- missions */
  function missionInfo(pr, m) {
    var B = E().Bank;
    if (m.kind === 'sub') {
      var sb = B.sub(m.id), t = sb ? B.topic(sb.topicId) : null;
      return { label: sb ? sb.name : m.id, sub: t ? t.code + ' · ' + t.name + ' · ' + sb.items.length + ' questions' : '', done: subPassed(pr, m.id), ok: !!sb };
    }
    if (m.kind === 'check') {
      var lv = levelOf(m.id);
      return { label: lv ? lv.name + ': the examiner\'s gate' : m.id, sub: lv ? lv.check.items.length + ' questions · pass at 75%' + (P().checkUnlocked(pr, lv) ? '' : ' · finish the three lessons first') : '', done: checkPassed(pr, m.id), ok: !!lv, locked: lv ? !P().checkUnlocked(pr, lv) : true };
    }
    if (m.kind === 'view') return { label: m.label, sub: m.note || '', done: viewMissionDone(pr, m), ok: true };
    if (m.kind === 'writing') return { label: m.label, sub: m.note || '', done: writingMissionDone(pr, m), ok: true };
    if (m.kind === 'event') return { label: m.label, sub: m.note || '', done: eventDone(pr, m.event), ok: true };
    return { label: m.label || m.kind, sub: '', done: false, ok: false };
  }
  function vkey(ch, i) { return ch.id + ':' + i; }
  function viewMissionDone(pr, m) {
    var s = ensure(pr);
    if (s.visited[m._key]) return true;
    switch (m.view) {
      case 'bootcamp': return Object.keys((pr.bootcamp || {}).missions || {}).length > 0;
      case 'lab': return labDesigned(pr);
      case 'faults': return /fewer/i.test(m.label || '') ? P().dueReview(pr).length < 5 : (pr.reclaimed || 0) > 0;
      default: return false;
    }
  }
  function writingMissionDone(pr, m) {
    var s = ensure(pr);
    var need = /three/i.test(m.label || '') ? 3 : 1;
    return s.visited[m._key] === 'done' || (pr.reports || []).length >= need;
  }
  function eventDone(pr, ev) {
    var s = ensure(pr);
    if (ev === 'sorting') return !!s.house;
    if (ev === 'campaign') return !!s.flags.campaignDone;
    if (ev === 'tournament') return tournamentDone(pr) === 3;
    return false;
  }
  function missions(pr, ch) {
    return (ch.missions || []).map(function (m, i) { var mm = Object.create(m); mm._key = vkey(ch, i); mm._i = i; mm._info = missionInfo(pr, mm); return mm; });
  }
  function nextMission(pr) {
    var ch = chapterN(chapter(pr)); if (!ch) return null;
    var list = missions(pr, ch);
    for (var i = 0; i < list.length; i++) if (!list[i]._info.done && list[i]._info.ok) return { chapter: ch, mission: list[i] };
    var g = gateStatus(pr, ch);
    if (g.ok && !hasKeepsake(pr, ch.keepsake.id)) return { chapter: ch, gate: true };
    var miss = g.items.filter(function (x) { return !x.ok; })[0];
    if (miss) return { chapter: ch, gateItem: miss };
    return null;
  }

  /* ------------------------------------------------------ tournament */
  function tournamentDone(pr) {
    var s = ensure(pr), t = s.tournament || {};
    if (!t.started) return 0;
    var started = t.started, done = t.done || (t.done = {});
    var bm = (pr.bootcamp || {}).missions || {};
    if (!done['tour-duel'] && Object.keys(bm).some(function (k) { return bm[k].at && bm[k].at > started; })) done['tour-duel'] = nowIso();
    if (!done['tour-cast']) {
      try {
        var d = JSON.parse(localStorage.getItem('pc.lab.v1.' + String(pr.studentId || '').toLowerCase()) || 'null');
        if (d && d.attempts && d.attempts.some(function (a) { return a.status === 'complete' && a.completedAt > started; })) done['tour-cast'] = nowIso();
      } catch (e) {}
    }
    if (!done['tour-essay'] && (pr.reports || []).some(function (r) { return r.ts > started && (r.words || 0) >= 250; })) done['tour-essay'] = nowIso();
    return Object.keys(done).length;
  }

  /* ---------------------------------------------------- house points */
  function housePoints(pr) {
    if (!pr) return 0;
    var B = E().Bank, subs = 0;
    Object.keys(pr.subs || {}).forEach(function (id) { if (B.sub(id) && pr.subs[id].best >= E().PASS_SUB) subs++; });
    var checks = P().checksCleared(pr);
    var mended = Math.min(100, 2 * (pr.reclaimed || 0));
    var sent = essaysSent(pr);
    var marked = essaysMarked(pr, TARGET_BAND);
    var tour = tournamentDone(pr);
    var hp = 5 * subs + 20 * checks + mended + 15 * sent + 25 * marked + 10 * tour;
    var s = ensure(pr); if (s) s.hp = hp;
    return hp;
  }

  /* -------------------------------------------------- tab visibility */
  var ALWAYS = ['plan', 'settings', 'live'];
  function visibleViews(pr, openAssignments) {
    var out = {}, s = ensure(pr);
    ALWAYS.forEach(function (v) { out[v] = 1; });
    var to = reachedTo(pr);
    chapters().forEach(function (ch) { if (ch.n <= to) (ch.opens || []).forEach(function (v) { out[v] = 1; }); });
    /* what her progress already earned, whatever chapter the story says */
    if ((pr.reports || []).length) out.writer = 1;
    if (labDesigned(pr) || (pr.lab && pr.lab.points)) { out.lab = 1; out.template = 1; }
    if (Object.keys((pr.bootcamp || {}).missions || {}).length) out.bootcamp = 1;
    if (s.visited.models) out.models = 1;
    if (P().dueReview(pr).length >= 5) out.faults = 1;
    if (openAssignments && openAssignments.length) out.writer = 1;
    return Object.keys(out);
  }
  function isUnlockRow(a) { return !!(a && (a.kind === 'unlock' || a.kind === 'resort')); }
  function applyUnlocks(pr, rows) {
    var s = ensure(pr), before = s.unlockedTo || 0, max = before, changed = false;
    (rows || []).forEach(function (a) {
      if (!isUnlockRow(a)) return;
      if (a.studentId && a.studentId !== pr.studentId) return;
      if (a.kind === 'resort') {
        /* A re-sort order from the Staff Room: clear the house once, then the Map sends her back to the Lantern. */
        s.flags = s.flags || {};
        if (a.studentId === pr.studentId && !s.flags['resort-' + a.id]) { s.flags['resort-' + a.id] = nowIso(); s.house = null; s.sort = null; changed = true; }
        return;
      }
      if (!a.studentId && a.cohort && a.cohort !== 'all' && a.cohort !== (pr.cohort || '')) return;
      max = Math.max(max, Number(a.chapter) || 0);
    });
    s.unlockedTo = Math.min(max, chapters().length);
    if (changed) applyHouseAttr(pr);
    return changed || s.unlockedTo !== before;
  }
  function unlockAll(pr) { var s = ensure(pr); s.unlockedTo = chapters().length; s.flags.teacherKey = nowIso(); }
  function markVisited(view) {
    var pr = p(); if (!pr) return;
    var s = ensure(pr); if (!s.visited[view]) { s.visited[view] = nowIso(); }
  }
  function applyHouseAttr(pr) {
    var s = pr ? ensure(pr) : null;
    if (s && s.house) document.documentElement.setAttribute('data-house', s.house);
    else document.documentElement.removeAttribute('data-house');
  }

  /* ============================================================= SVG */
  function crestSvg(id, size) {
    size = size || 28;
    var h = houseOf(id), main = h ? h.main : '#1F2A44', acc = h ? h.accent : '#B08A3E';
    var inner = '';
    if (id === 'compass') inner = '<circle cx="20" cy="20" r="13" fill="none" stroke="' + acc + '" stroke-width="1.6"/><path d="M20 7l3 10-3 16-3-16z" fill="' + acc + '"/><path d="M7 20l10-3 16 3-16 3z" fill="' + acc + '" opacity=".7"/>';
    else if (id === 'bridge') inner = '<path d="M8 30V18a12 12 0 0 1 24 0v12" fill="none" stroke="' + acc + '" stroke-width="3"/><path d="M14 30v-8a6 6 0 0 1 12 0v8" fill="none" stroke="' + acc + '" stroke-width="2"/><path d="M6 30h28" stroke="' + acc + '" stroke-width="2"/>';
    else if (id === 'lexicon') inner = '<path d="M8 11c4-2 8-2 12 1 4-3 8-3 12-1v18c-4-2-8-2-12 1-4-3-8-3-12-1z" fill="none" stroke="' + acc + '" stroke-width="2"/><path d="M20 12v18" stroke="' + acc + '" stroke-width="1.4"/><circle cx="26" cy="19" r="2.3" fill="none" stroke="' + acc + '" stroke-width="1.4"/><path d="M28 21l4 4m-1.5-1.5l1.5-1.5" stroke="' + acc + '" stroke-width="1.4"/>';
    else if (id === 'loom') inner = '<path d="M20 6c6 6 6 22 0 28-6-6-6-22 0-28z" fill="none" stroke="' + acc + '" stroke-width="2"/><path d="M20 12v16" stroke="' + acc + '" stroke-width="1.4"/><path d="M9 20h22" stroke="' + acc + '" stroke-width="1.2" stroke-dasharray="2 2"/>';
    else inner = '<circle cx="20" cy="20" r="9" fill="none" stroke="' + acc + '" stroke-width="2"/>';
    return '<svg class="crest" width="' + size + '" height="' + size + '" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="' + main + '"/>' + inner + '</svg>';
  }
  /* The Sorting Lantern: four glass bands. `glow` is 0..1 per criterion. */
  function lanternSvg(glow, winner) {
    glow = glow || {};
    var bands = [['TR', '#1F3A5F'], ['CC', '#1F6F6B'], ['LR', '#5B2A5E'], ['GRA', '#8E1B2C']];
    var y0 = 44, h = 28, winCol = null;
    var g = bands.map(function (b, i) {
      var k = Math.max(0, Math.min(1, glow[b[0]] || 0)), y = y0 + i * h, win = winner === b[0];
      if (win) winCol = b[1];
      var op = winner ? (win ? 1 : 0.55) : (0.45 + 0.55 * k);
      return '<rect x="36" y="' + y + '" width="48" height="' + (h - 2) + '" rx="3" fill="' + b[1] + '" opacity="' + op.toFixed(2) + '"/>' +
        (winner ? (win ? '<rect x="38" y="' + (y + 2) + '" width="44" height="' + (h - 6) + '" rx="2" fill="none" stroke="#FFF3C8" stroke-width="2"/>' : '')
                : '<rect x="36" y="' + y + '" width="48" height="' + (h - 2) + '" rx="3" fill="#FFF3C8" opacity="' + (0.35 * k).toFixed(2) + '"/>');
    }).join('');
    var halo = winCol ? '<ellipse cx="60" cy="100" rx="58" ry="78" fill="' + winCol + '" opacity=".13"/><ellipse cx="60" cy="100" rx="40" ry="60" fill="#FFF3C8" opacity=".35"/>' : '';
    return '<svg class="lantern" viewBox="0 0 120 200" width="150" height="250" aria-hidden="true">' + halo +
      '<path d="M44 20h32l6 20H38z" fill="#B08A3E"/><rect x="58" y="6" width="4" height="14" fill="#B08A3E"/><circle cx="60" cy="6" r="4" fill="none" stroke="#B08A3E" stroke-width="2"/>' +
      '<rect x="34" y="40" width="52" height="118" rx="4" fill="#5A4420"/>' + g +
      '<rect x="34" y="40" width="52" height="118" rx="4" fill="none" stroke="#B08A3E" stroke-width="3"/>' +
      '<path d="M36 158h48l4 10H32z" fill="#B08A3E"/><rect x="56" y="168" width="8" height="22" fill="#B08A3E"/><rect x="40" y="188" width="40" height="6" rx="2" fill="#B08A3E"/></svg>';
  }
  function sealSvg(label) {
    return '<svg class="seal-svg" viewBox="0 0 80 80" width="74" height="74" aria-hidden="true"><path d="M40 4l6 7 9-2 3 9 9 3-2 9 7 6-7 6 2 9-9 3-3 9-9-2-6 7-6-7-9 2-3-9-9-3 2-9-7-6 7-6-2-9 9-3 3-9 9 2z" fill="var(--brass)"/><circle cx="40" cy="40" r="22" fill="none" stroke="var(--ground)" stroke-width="2" opacity=".7"/><text x="40" y="47" text-anchor="middle" font-family="Cormorant Garamond, serif" font-weight="700" font-size="20" fill="var(--ground)">' + esc(label || 'Q') + '</text></svg>';
  }
  /* A square parchment placeholder for a page whose illustration is not there yet. */
  function placeholderHtml(ch, label) {
    return '<div class="story-ph" aria-hidden="true"><div class="story-ph-ring">' + sealSvg(ch ? String(ch.n) : 'Q') + '</div><div class="story-ph-t">' + esc(label || (ch ? ch.place : 'Quillmoor')) + '</div></div>';
  }

  /* -------------------------------------------------------- the map */
  function mapSvg(pr) {
    var list = chapters(), cur = chapter(pr), to = reachedTo(pr);
    var W = 400, step = 78, top = 46, H = top + step * (list.length - 1) + 50;
    var pts = list.map(function (c, i) { return { x: i % 2 === 0 ? 92 : 308, y: top + i * step, c: c }; });
    var d = '';
    pts.forEach(function (q, i) {
      if (!i) { d += 'M' + q.x + ' ' + q.y; return; }
      var a = pts[i - 1];
      d += ' C' + a.x + ' ' + (a.y + step * .55) + ' ' + q.x + ' ' + (q.y - step * .55) + ' ' + q.x + ' ' + q.y;
    });
    var done = Math.max(0, cur - 1);
    var html = '<svg class="castle-map" viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="The map of Quillmoor">';
    html += '<path class="map-trail" d="' + d + '"/>';
    var L = list.length - 1;
    if (done > 0) html += '<path class="map-trail lit" d="' + d + '" pathLength="' + L + '" style="stroke-dasharray:' + L + ' ' + L + ';stroke-dashoffset:' + (L - done) + '"/>';
    pts.forEach(function (q, i) {
      var n = q.c.n, isCur = n === cur, isDone = gateStatus(pr, q.c).ok, isOpen = n <= to, keep = hasKeepsake(pr, q.c.keepsake.id);
      var cls = 'mnode' + (isDone ? ' done' : '') + (isCur ? ' cur' : '') + (isOpen ? ' open' : ' fog');
      var left = i % 2 === 0, lx = left ? q.x + 36 : q.x - 36, anchor = left ? 'start' : 'end';
      html += '<g class="' + cls + '" data-ch="' + n + '"' + (isOpen ? ' role="button" tabindex="0"' : '') + '>';
      if (isCur) html += '<circle class="halo" cx="' + q.x + '" cy="' + q.y + '" r="34"/>';
      html += '<circle class="node" cx="' + q.x + '" cy="' + q.y + '" r="23"/>';
      html += '<text class="node-n" x="' + q.x + '" y="' + (q.y + 7) + '" text-anchor="middle">' + n + '</text>';
      if (keep) html += '<circle class="node-keep" cx="' + (q.x + 17) + '" cy="' + (q.y + 17) + '" r="6"/>';
      html += '<text class="node-t" x="' + lx + '" y="' + (q.y - 2) + '" text-anchor="' + anchor + '">' + esc(q.c.title) + '</text>';
      html += '<text class="node-p" x="' + lx + '" y="' + (q.y + 16) + '" text-anchor="' + anchor + '">' + esc(isOpen ? q.c.place : 'Not yet on the map') + '</text>';
      html += '</g>';
    });
    return html + '</svg>';
  }

  /* -------------------------------------------------- the House Cup */
  function cupHtml(pr, cup) {
    var mine = ensure(pr).house, hs = STORY().houses || [];
    if (!cup || !cup.totals) return '<p class="tiny">The House Cup totals arrive when the class server answers.</p>';
    var max = 1; hs.forEach(function (h) { max = Math.max(max, Number(cup.totals[h.id]) || 0); });
    return '<div class="cup">' + hs.slice().sort(function (a, b) { return (cup.totals[b.id] || 0) - (cup.totals[a.id] || 0); }).map(function (h) {
      var v = Number(cup.totals[h.id]) || 0, n = (cup.members || {})[h.id] || 0;
      return '<div class="cup-row' + (h.id === mine ? ' mine' : '') + '"><span class="cup-n">' + crestSvg(h.id, 18) + esc(h.name) + '</span><span class="cup-bar"><i style="width:' + Math.round(100 * v / max) + '%;background:' + h.main + '"></i></span><b>' + v + '</b><span class="tiny">' + (n ? n + (n === 1 ? ' student' : ' students') : '') + '</span></div>';
    }).join('') + '</div>';
  }
  function fetchCup(pr) {
    var api = global.API;
    if (!api || typeof api.houses !== 'function') return;
    var cohort = pr.cohort || '';
    api.houses(cohort).then(function (r) {
      if (!r || !r.ok) return;
      st.cup = r; st.cupFor = cohort;
      var slot = $('#cup-slot'); if (slot) slot.innerHTML = cupHtml(pr, r);
    }).catch(function () {});
  }

  /* ==================================================== THE MAP ROOM */
  function paintMap(el, opts) {
    var pr = p(); if (!pr || !el) return;
    opts = opts || {};
    var s = ensure(pr), cur = chapter(pr), ch = chapterN(cur), hp = housePoints(pr), h = house(pr);
    var html = '';

    /* the slim bar: house, points, candles, merits, keepsakes */
    html += '<div class="housebar card">' +
      '<div class="hb-house">' + (h ? crestSvg(h.id, 40) + '<span><b>' + esc(h.name) + '</b><span class="tiny">' + esc(h.critName) + ' · ' + esc(h.head) + '</span></span>' : '<span class="hb-unsorted" id="hb-sort" role="button" tabindex="0" style="cursor:pointer">' + sealSvg('?') + '<span><b>Not yet sorted</b><span class="tiny">Tap to stand before the Sorting Lantern.</span></span></span>') + '</div>' +
      '<div class="hb-stats"><span class="hb-stat"><b>' + hp + '</b>house points</span><span class="hb-stat"><b>' + (pr.streak || 0) + '</b>candles</span><span class="hb-stat"><b>' + (pr.xp || 0) + '</b>merits</span><span class="hb-stat"><b>' + s.keepsakes.length + '</b>keepsakes</span></div>' +
      '<details class="hb-cup"><summary>The House Cup</summary><div id="cup-slot">' + cupHtml(pr, st.cupFor === (pr.cohort || '') ? st.cup : null) + '</div></details>' +
      '</div>';

    html += '<div class="map-head"><h2>The Map Room</h2><p>' + esc(STORY().mapIntro || '') + '</p></div>';
    html += '<div class="map-wrap card">' + mapSvg(pr) + '</div>';

    /* owl post */
    var owl = opts.assignments || [];
    if (owl.length) {
      html += '<div class="owlpost"><h3>Owl post</h3>' + owl.map(function (a) {
        var pr2 = global.Prompts.get(a.promptId);
        return '<div class="letter card"><div class="letter-seal">' + sealSvg('T') + '</div><div class="letter-t"><p class="kicker">From T.Chris' + (a.due ? ' · due ' + esc(a.due) : '') + '</p><h4>' + esc(a.title || (pr2 ? pr2.title : 'An essay')) + '</h4><p class="tiny">' + esc(a.note || (pr2 ? pr2.text : '')) + '</p></div><button class="btn primary sm" data-assign="' + esc(a.id) + '">Open →</button></div>';
      }).join('') + '</div>';
    }

    /* the current chapter card (or the finale) */
    if (allDone(pr)) {
      html += '<div class="chcard card done"><p class="kicker">The year is over</p><h3>Verba vincunt</h3><p class="chcard-blurb">' + esc(STORY().finale.text) + '</p>' +
        '<div class="chcard-acts"><button class="btn" data-open-ch="' + cur + '">Read the last chapter again</button></div></div>';
    } else if (ch) {
      var list = missions(pr, ch), doneN = list.filter(function (m) { return m._info.done; }).length;
      var g = gateStatus(pr, ch), seen = (s.seen[ch.id] || []).length, pagesN = (ch.pages || []).length, readAll = seen >= pagesN;
      var next = opts.next;
      html += '<div class="chcard card"><div class="chcard-top"><div><p class="kicker">Chapter ' + ch.n + ' · ' + esc(ch.place) + '</p><h3>' + esc(ch.title) + '</h3><p class="chcard-blurb">' + esc(ch.blurb) + '</p></div><div class="chcard-ring" style="--p:' + Math.round(100 * doneN / Math.max(1, list.length)) + '"><i>' + doneN + '/' + list.length + '</i></div></div>';
      if (!readAll) html += '<button class="btn primary wide chcard-read" data-read-ch="' + ch.n + '">' + (seen ? 'Continue reading chapter ' + ch.n + ' →' : 'Read chapter ' + ch.n + ' →') + '</button>';
      if (next) {
        html += '<button class="resume" id="resume"><span class="resume-t"><span class="kicker">' + esc(next.kicker || 'Next') + '</span><span class="resume-n">' + esc(next.label) + '</span><span class="resume-s">' + esc(next.sub || '') + '</span></span><span class="resume-go">' + esc(next.go || 'Go →') + '</span></button>';
      }
      html += '<div class="gatebox"><p class="kicker">The gate</p><p class="gate-intro">' + esc(ch.gate.intro || '') + '</p><ul class="gate-list">' + g.items.map(function (it) {
        return '<li class="' + (it.ok ? 'ok' : '') + '"><span class="gate-pip">' + (it.ok ? '✓' : '') + '</span><span>' + esc(it.label) + (it.detail && !it.ok ? ' <span class="tiny">· ' + esc(it.detail) + '</span>' : '') + '</span></li>';
      }).join('') + '</ul>' + (g.ok && !hasKeepsake(pr, ch.keepsake.id) ? '<button class="btn primary" data-gate-ch="' + ch.n + '">Pass the gate →</button>' : '') + '</div>';
      html += '<div class="chcard-acts"><button class="btn sm" data-open-ch="' + ch.n + '">Chapter ' + ch.n + ': missions and pages</button>' + (readAll ? '<button class="btn sm ghost" data-read-ch="' + ch.n + '">Read the pages again</button>' : '') + '</div>';
      if (opts.ladderHtml) html += '<details class="ladder-box"><summary>Your band ladder</summary>' + opts.ladderHtml + '</details>';
      html += '</div>';
    }

    /* the four examiners */
    var gr = P().gateReadiness(pr);
    var HEADS = { TR: 'North', CC: 'Brigg', LR: 'Liang', GRA: 'Weaver' };
    var NOTE = { TR: 'position, parts, mechanism, example, nuance', CC: 'one idea per paragraph, reference before linkers', LR: 'precise collocation, no clichés, formal', GRA: 'noun phrases, controlled swaps, error-free' };
    html += '<div class="examiners"><h3>The four examiners</h3><div class="gates">' + CRITS.map(function (k) {
      var hh = STORY().houses.filter(function (x) { return x.crit === k; })[0];
      return '<div class="gate exam"><span>' + (hh ? crestSvg(hh.id, 18) : '') + 'Professor ' + HEADS[k] + '</span><b>' + gr[k] + '%</b><div class="bar-line' + (k === 'TR' ? ' gold' : '') + '"><span style="width:' + gr[k] + '%"></span></div><small>' + esc((hh ? hh.critName : k) + ': ' + NOTE[k]) + '</small></div>';
    }).join('') + '</div></div>';

    /* the tournament, once the cellars are cleared */
    if (cleared(pr, 5) && STORY().events && STORY().events.tournament) {
      var td = tournamentDone(pr);
      html += '<div class="card evcard"><div><p class="kicker">Optional event · Examination Hall</p><h3>' + esc(STORY().events.tournament.title) + '</h3><p class="tiny">' + (td === 3 ? 'All three tasks done. The token is in your trunk.' : td + ' of 3 tasks done. A timed run, one prompt cast against the clock, one forty-minute essay.') + '</p></div><button class="btn sm" data-open-ev="tournament">' + (s.tournament.started ? 'Open' : 'Enter') + ' →</button></div>';
    }

    /* keepsakes */
    html += '<div class="keepsakes"><h3>Keepsakes</h3>' + keepsakesHtml(pr) + '</div>';

    /* the Ten Wards once the Spellbook chapter is reached; electives once the cellars are */
    if (reached(pr, 4) && global.Bootcamp && global.Bootcamp.CHECKLIST) {
      html += '<div class="card wards"><div class="sect-h" style="margin-bottom:6px"><div><h3>The Ten Wards</h3><p class="tiny">Check them in the same order before you send any essay. The Duelling Hall drills them; the Scriptorium runs them for you.</p></div><button class="btn sm" data-view-go="bootcamp">Duelling Hall →</button></div><ol class="bc-list">' + global.Bootcamp.CHECKLIST.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ol></div>';
    }
    if (reached(pr, 5) && opts.electivesHtml) html += opts.electivesHtml;

    el.innerHTML = html;

    /* wiring */
    $$('.mnode.open', el).forEach(function (g) {
      var go = function () { open(Number(g.getAttribute('data-ch'))); };
      g.addEventListener('click', go);
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    var hbs = el.querySelector('#hb-sort');
    if (hbs) { var goSort = function () { openSorting(1, null); }; hbs.addEventListener('click', goSort); hbs.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goSort(); } }); }
    $$('[data-open-ch]', el).forEach(function (b) { b.addEventListener('click', function () { open(Number(b.dataset.openCh), 'chapter'); }); });
    $$('[data-read-ch]', el).forEach(function (b) { b.addEventListener('click', function () { open(Number(b.dataset.readCh), 'read'); }); });
    $$('[data-gate-ch]', el).forEach(function (b) { b.addEventListener('click', function () { open(Number(b.dataset.gateCh), 'ending'); }); });
    $$('[data-open-ev]', el).forEach(function (b) { b.addEventListener('click', function () { openEvent(b.dataset.openEv, chapter(pr)); }); });
    $$('[data-assign]', el).forEach(function (b) { b.addEventListener('click', function () { if (host.startAssignment) host.startAssignment(b.dataset.assign); }); });
    $$('[data-view-go]', el).forEach(function (b) { b.addEventListener('click', function () { host.show(b.dataset.viewGo); }); });
    var res = $('#resume', el);
    if (res && opts.onResume) res.addEventListener('click', function () { opts.onResume(opts.next); });
    if (!st.cup || st.cupFor !== (pr.cohort || '')) fetchCup(pr);
  }
  function keepsakesHtml(pr) {
    var s = ensure(pr), list = chapters().map(function (c) { return c.keepsake; });
    if (STORY().events && STORY().events.tournament) list = list.concat([{ id: 'token', name: 'Tournament token', desc: 'Proof that your own words come under a clock.' }]);
    return '<div class="keep-grid">' + list.map(function (k) {
      var got = s.keepsakes.indexOf(k.id) >= 0;
      return '<div class="keep' + (got ? ' got' : '') + '"><span class="keep-i">' + sealSvg(got ? '✓' : '·') + '</span><span><b>' + esc(k.name) + '</b><span class="tiny">' + esc(got ? k.desc : 'Not yet earned.') + '</span></span></div>';
    }).join('') + '</div>';
  }

  /* ================================================== STORY VIEWER */
  function open(n, what) {
    var pr = p(); if (!pr) return;
    var ch = chapterN(n); if (!ch) return;
    if (!reached(pr, n)) { if (host.toast) host.toast('That room is not on your map yet.'); return; }
    var s = ensure(pr), seen = s.seen[ch.id] || [];
    st.ch = n;
    if (what === 'chapter') st.screen = 'chapter';
    else if (what === 'ending') st.screen = 'ending';
    else if (what === 'read') { st.screen = 'page'; st.page = 0; }
    else {
      /* first unseen page, else the chapter page */
      var first = -1; for (var i = 0; i < ch.pages.length; i++) if (seen.indexOf(i) < 0) { first = i; break; }
      if (first >= 0) { st.screen = 'page'; st.page = first; } else st.screen = 'chapter';
    }
    host.show('story');
  }
  function resume() {
    var el = $('#view-story'); if (!el) return;
    var pr = p(); if (!pr) return;
    if (!st.screen) { st.screen = 'chapter'; st.ch = chapter(pr); }
    if (st.screen === 'page') paintPage(el);
    else if (st.screen === 'chapter') paintChapter(el);
    else if (st.screen === 'ending') paintEnding(el);
    else if (st.screen === 'sorting') paintSorting(el);
    else if (st.screen === 'event') paintEvent(el);
    else paintChapter(el);
    window.scrollTo({ top: 0 });
  }
  function topBar(ch, right, backLabel, backFn) {
    return '<div class="story-top"><button class="btn ghost sm" id="st-back">← ' + esc(backLabel || 'Map Room') + '</button><span class="story-crumb">' + (ch ? 'Chapter ' + ch.n + ' · ' + esc(ch.place) : '') + '</span><span class="story-right">' + (right || '') + '</span></div>';
  }
  function wireBack(el, fn) { var b = $('#st-back', el); if (b) b.addEventListener('click', fn || function () { host.show('plan'); }); }
  function renderText(text) {
    return String(text || '').split(/\n\n+/).map(function (para) {
      var out = '', re = /\[\[([^\[\]|]+)\|([^\[\]|]+)\|([^\[\]|]+)\]\]/g, last = 0, m;
      while ((m = re.exec(para))) {
        out += esc(para.slice(last, m.index));
        out += '<button class="kw" type="button" data-w="' + esc(m[1].trim()) + '" data-g="' + esc(m[2].trim()) + '" data-t="' + esc(m[3].trim()) + '">' + esc(m[1].trim()) + '</button>';
        last = m.index + m[0].length;
      }
      out += esc(para.slice(last));
      return '<p>' + out.replace(/\n/g, '<br>') + '</p>';
    }).join('');
  }
  function wireWords(el) {
    $$('.kw', el).forEach(function (b) {
      b.addEventListener('click', function () {
        var pr = p(), s = ensure(pr), w = b.dataset.w.toLowerCase();
        var fresh = !s.words[w];
        if (fresh) { s.words[w] = nowIso(); pr.xp = (pr.xp || 0) + WORD_XP; if (host.paintHeader) host.paintHeader(); if (host.syncSoon) host.syncSoon(); }
        host.modal('<p class="kicker">Keyword</p><h3 class="kw-word">' + esc(b.dataset.w) + '</h3><p class="kw-gloss">' + esc(b.dataset.g) + '</p><p class="kw-thai" lang="th">' + esc(b.dataset.t) + '</p>' + (fresh ? '<p class="tiny">+' + WORD_XP + ' merits for a new word</p>' : '') + '<button class="btn primary wide" data-close>Close</button>');
      });
    });
  }
  function artHtml(ch, pg, label) {
    return '<figure class="story-art">' + (pg.img ? '<img src="' + esc(pg.img) + '" alt="' + esc(pg.alt || '') + '" loading="lazy" decoding="async">' : '') + placeholderHtml(ch, label) + '</figure>';
  }
  function wireArt(el) {
    $$('.story-art img', el).forEach(function (img) {
      var ph = img.parentNode.querySelector('.story-ph');
      function miss() { img.style.display = 'none'; if (ph) ph.classList.add('show'); }
      function hit() { if (ph) ph.classList.remove('show'); }
      if (img.complete) { if (img.naturalWidth === 0) miss(); else hit(); }
      img.addEventListener('error', miss); img.addEventListener('load', hit);
    });
  }
  function markSeen(ch, i) {
    var pr = p(), s = ensure(pr), list = s.seen[ch.id] || (s.seen[ch.id] = []);
    if (list.indexOf(i) < 0) { list.push(i); list.sort(function (a, b) { return a - b; }); if (host.syncSoon) host.syncSoon(); }
  }
  function paintPage(el) {
    var pr = p(), s = ensure(pr), ch = chapterN(st.ch), pg = ch.pages[st.page], n = ch.pages.length;
    markSeen(ch, st.page);
    var dots = ch.pages.map(function (x, i) { return '<button class="dot' + (i === st.page ? ' on' : '') + ((s.seen[ch.id] || []).indexOf(i) >= 0 ? ' seen' : '') + '" data-pg="' + i + '" aria-label="Page ' + (i + 1) + '"></button>'; }).join('');
    var html = topBar(ch, (st.page + 1) + ' / ' + n);
    html += '<div class="story-page card">' + artHtml(ch, pg) + '<div class="story-text">' + renderText(pg.text) + '</div>';
    if (pg.choice) {
      var chosen = pg.choice.options.filter(function (o) { return s.flags[o.flag]; })[0];
      html += '<div class="story-choice"><p class="kicker">' + esc(pg.choice.q) + '</p>' + (chosen ? '<p class="choice-made">You chose: <b>' + esc(chosen.label) + '</b></p>' : pg.choice.options.map(function (o) { return '<button class="btn wide choice" data-flag="' + esc(o.flag) + '">' + esc(o.label) + '</button>'; }).join('')) + '</div>';
    }
    if (pg.event) {
      var EV = { sorting: s.house ? 'You stand before the Lantern again' : 'Stand before the Sorting Lantern', campaign: 'Open the Chamber Campaign', tournament: 'Enter the Midwinter Tournament' };
      var done = eventDone(pr, pg.event);
      html += '<div class="story-event"><button class="btn primary wide" data-ev="' + esc(pg.event) + '"' + (pg.event === 'sorting' && s.house ? ' disabled' : '') + '>' + esc(EV[pg.event] || pg.event) + (done ? ' ✓' : ' →') + '</button>' + (pg.event === 'sorting' && s.house ? '<p class="tiny">The Lantern has spoken: you are in ' + esc(house(pr).name) + '.</p>' : '') + '</div>';
    }
    html += '</div>';
    html += '<div class="story-nav"><button class="btn sm" id="pg-prev"' + (st.page ? '' : ' disabled') + '>← Back</button><div class="dots">' + dots + '</div><button class="btn sm primary" id="pg-next">' + (st.page + 1 < n ? 'Next →' : 'The missions →') + '</button></div>';
    el.innerHTML = html;
    wireBack(el); wireWords(el); wireArt(el);
    $$('.dot', el).forEach(function (d) { d.addEventListener('click', function () { st.page = Number(d.dataset.pg); resume(); }); });
    $('#pg-prev', el).addEventListener('click', function () { if (st.page) { st.page--; resume(); } });
    $('#pg-next', el).addEventListener('click', function () { if (st.page + 1 < n) { st.page++; resume(); } else { st.screen = 'chapter'; resume(); } });
    $$('.choice', el).forEach(function (b) { b.addEventListener('click', function () { s.flags[b.dataset.flag] = nowIso(); if (host.syncSoon) host.syncSoon(); resume(); }); });
    $$('[data-ev]', el).forEach(function (b) { b.addEventListener('click', function () {
      if (b.dataset.ev === 'sorting') openSorting(ch.n, st.page);
      else openEvent(b.dataset.ev, ch.n, st.page);
    }); });
  }
  function paintChapter(el) {
    var pr = p(), s = ensure(pr), ch = chapterN(st.ch);
    var list = missions(pr, ch), g = gateStatus(pr, ch), got = hasKeepsake(pr, ch.keepsake.id);
    var html = topBar(ch, (s.seen[ch.id] || []).length + ' / ' + ch.pages.length + ' pages read');
    html += '<div class="chapter-head"><p class="kicker">Chapter ' + ch.n + ' · ' + esc(ch.place) + '</p><h2>' + esc(ch.title) + '</h2><p class="chcard-blurb">' + esc(ch.blurb) + '</p><div class="chapter-acts"><button class="btn sm" id="ch-read">' + ((s.seen[ch.id] || []).length ? 'Read the pages again' : 'Read the pages') + '</button></div></div>';
    html += '<div class="card missions"><h3>Missions</h3><p class="tiny">Each one opens the class, the gate or the room it names. Come back here when you are done.</p><div class="ckstack">' + list.map(function (m) {
      var i = m._info, dis = !i.ok || i.locked;
      return '<button class="ckrow' + (i.done ? ' done' : '') + '" data-mi="' + m._i + '"' + (dis ? ' disabled' : '') + '><span class="ck-box">' + (i.done ? '✓' : '') + '</span><span class="ck-txt"><span class="ck-name">' + esc(i.label) + '</span><span class="ck-sub">' + esc(i.sub) + '</span></span><span class="ck-go">' + (dis ? 'locked' : (i.done ? 'again' : 'open') + ' →') + '</span></button>';
    }).join('') + '</div></div>';
    html += '<div class="card gatebox big"><p class="kicker">The gate</p><p class="gate-intro">' + esc(ch.gate.intro || '') + '</p><ul class="gate-list">' + g.items.map(function (it) {
      return '<li class="' + (it.ok ? 'ok' : '') + '"><span class="gate-pip">' + (it.ok ? '✓' : '') + '</span><span>' + esc(it.label) + (it.note ? '<span class="tiny"> — ' + esc(it.note) + '</span>' : '') + (it.detail && !it.ok ? ' <span class="tiny">· ' + esc(it.detail) + '</span>' : '') + '</span></li>';
    }).join('') + '</ul>' + (g.ok ? '<button class="btn primary" id="ch-gate">' + (got ? 'Read the ending again' : 'Pass the gate →') + '</button>' : '<p class="tiny">The gate opens when every line above is ticked.</p>') + '</div>';
    html += '<p class="tiny newsroom"><b>The newsroom:</b> ' + esc(ch.newsroom || '') + '</p>';
    el.innerHTML = html;
    wireBack(el);
    $('#ch-read', el).addEventListener('click', function () { st.screen = 'page'; st.page = 0; resume(); });
    var gb = $('#ch-gate', el); if (gb) gb.addEventListener('click', function () { st.screen = 'ending'; resume(); });
    $$('[data-mi]', el).forEach(function (b) { b.addEventListener('click', function () { launch(ch, list[Number(b.dataset.mi)]); }); });
  }
  function launch(ch, m) {
    var pr = p(), s = ensure(pr);
    if (host.setReturn) host.setReturn('story');
    st.screen = 'chapter'; st.ch = ch.n;
    if (m.kind === 'sub') return host.openSub(m.id);
    if (m.kind === 'check') return host.startCheck(m.id);
    if (m.kind === 'event') {
      if (m.event === 'sorting') return openSorting(ch.n, null);
      return openEvent(m.event, ch.n, null);
    }
    if (m.kind === 'view') { s.visited[m._key] = nowIso(); if (m.view === 'models') s.visited.models = nowIso(); if (host.syncSoon) host.syncSoon(); if (host.toast) host.toast('Back to the Map Room when you are done.'); return host.show(m.view); }
    if (m.kind === 'writing') { s.visited[m._key] = s.visited[m._key] || nowIso(); if (host.syncSoon) host.syncSoon(); if (host.toast) host.toast(m.note || 'Write it in the Scriptorium.', 3600); return host.show('writer'); }
  }
  function paintEnding(el) {
    var pr = p(), ch = chapterN(st.ch), g = gateStatus(pr, ch), got = hasKeepsake(pr, ch.keepsake.id);
    if (!g.ok) { st.screen = 'chapter'; return resume(); }
    var html = topBar(ch, 'Ending', 'Chapter ' + ch.n, null);
    html += '<div class="story-page card"><p class="gate-pass">' + esc(ch.gate.pass || '') + '</p>' + artHtml(ch, ch.ending, ch.keepsake.name) + '<div class="story-text">' + renderText(ch.ending.text) + '</div></div>';
    html += '<div class="story-nav end"><button class="btn primary" id="end-claim">' + (got ? 'Back to the Map Room' : 'Take the keepsake: ' + esc(ch.keepsake.name) + ' →') + '</button></div>';
    el.innerHTML = html;
    wireBack(el, function () { st.screen = 'chapter'; resume(); }); wireWords(el); wireArt(el);
    $('#end-claim', el).addEventListener('click', function () {
      if (got) { host.show('plan'); return; }
      award(ch.keepsake, KEEPSAKE_XP, function () { st.screen = null; host.show('plan'); });
    });
  }
  function award(keep, xp, after) {
    var pr = p(), s = ensure(pr);
    if (s.keepsakes.indexOf(keep.id) < 0) { s.keepsakes.push(keep.id); pr.xp = (pr.xp || 0) + (xp || 0); }
    housePoints(pr);
    if (host.paintHeader) host.paintHeader();
    if (host.sync) host.sync();
    host.modal('<div class="seal-wrap">' + sealSvg('✓') + '</div><p class="kicker">Keepsake</p><h3 style="font-size:1.5rem">' + esc(keep.name) + '</h3><p style="color:var(--ink-2)">' + esc(keep.desc) + '</p>' + (xp ? '<p class="tiny">+' + xp + ' merits</p>' : '') + '<button class="btn primary wide" data-close>Keep it</button>');
    var b = $('#modal-slot [data-close]'); if (b && after) b.addEventListener('click', after);
  }

  /* ============================================================ EVENTS */
  function openEvent(id, chN, backPage) {
    var ev = STORY().events && STORY().events[id]; if (!ev) return;
    var pr = p(), s = ensure(pr);
    st.ev = id; st.evPage = 0; st.evBack = { ch: chN, page: backPage }; st.screen = 'event';
    if (id === 'tournament' && !s.tournament.started) { s.tournament.started = nowIso(); s.tournament.done = {}; if (host.syncSoon) host.syncSoon(); }
    host.show('story');
  }
  function paintEvent(el) {
    var pr = p(), s = ensure(pr), ev = STORY().events[st.ev], ch = chapterN(st.evBack.ch) || chapterN(chapter(pr));
    var pages = ev.pages || [], n = pages.length, last = st.evPage >= n;
    var html = '<div class="story-top"><button class="btn ghost sm" id="st-back">← Chapter ' + ch.n + '</button><span class="story-crumb">' + esc(ev.title) + '</span><span class="story-right">' + (last ? '' : (st.evPage + 1) + ' / ' + n) + '</span></div>';
    if (!last) {
      var pg = pages[st.evPage];
      html += '<div class="story-page card">' + artHtml(ch, pg, ev.title) + '<div class="story-text">' + renderText(pg.text) + '</div></div>';
      html += '<div class="story-nav"><button class="btn sm" id="pg-prev"' + (st.evPage ? '' : ' disabled') + '>← Back</button><div class="dots">' + pages.map(function (x, i) { return '<span class="dot' + (i === st.evPage ? ' on' : '') + '"></span>'; }).join('') + '</div><button class="btn sm primary" id="pg-next">' + (st.evPage + 1 < n ? 'Next →' : (st.ev === 'tournament' ? 'The three tasks →' : 'Done →')) + '</button></div>';
    } else if (st.ev === 'tournament') {
      tournamentDone(pr);
      var done = s.tournament.done || {};
      html += '<div class="card missions"><h3>The three tasks</h3><p class="tiny">Each task counts when it is finished after you entered the Hall. Ten house points each.</p><div class="ckstack">' + (ev.tasks || []).map(function (t) {
        return '<button class="ckrow' + (done[t.id] ? ' done' : '') + '" data-task="' + esc(t.view) + '"><span class="ck-box">' + (done[t.id] ? '✓' : '') + '</span><span class="ck-txt"><span class="ck-name">' + esc(t.label) + '</span><span class="ck-sub">' + esc(t.note || '') + '</span></span><span class="ck-go">open →</span></button>';
      }).join('') + '</div>' + (Object.keys(done).length === 3 ? '<button class="btn primary" id="tour-claim">' + (hasKeepsake(pr, 'token') ? 'Token kept' : 'Take the token →') + '</button>' : '') + '</div>';
    } else {
      s.flags.campaignDone = s.flags.campaignDone || nowIso(); if (host.syncSoon) host.syncSoon();
      html += '<div class="card story-page"><p class="gate-pass">The campaign is over. Your sentence is still the one on the board.</p></div><div class="story-nav end"><button class="btn primary" id="ev-done">Back to the chapter →</button></div>';
    }
    el.innerHTML = html;
    wireWords(el); wireArt(el);
    function back() { st.screen = st.evBack.page == null ? 'chapter' : 'page'; st.ch = ch.n; if (st.evBack.page != null) st.page = st.evBack.page; resume(); }
    wireBack(el, back);
    var pv = $('#pg-prev', el); if (pv) pv.addEventListener('click', function () { if (st.evPage) { st.evPage--; resume(); } });
    var nx = $('#pg-next', el); if (nx) nx.addEventListener('click', function () { st.evPage++; resume(); });
    var dn = $('#ev-done', el); if (dn) dn.addEventListener('click', back);
    $$('[data-task]', el).forEach(function (b) { b.addEventListener('click', function () { if (host.setReturn) host.setReturn('story'); host.show(b.dataset.task); }); });
    var tc = $('#tour-claim', el); if (tc) tc.addEventListener('click', function () { if (hasKeepsake(pr, 'token')) return back(); award({ id: 'token', name: 'Tournament token', desc: 'Proof that your own words come under a clock.' }, 50, back); });
  }

  /* ======================================================== THE SORTING */
  function openSorting(chN, backPage) {
    var pr = p(), s = ensure(pr);
    st.sortBack = { ch: chN, page: backPage };
    st.sort = { i: 0, answers: [], tally: { TR: 0, CC: 0, LR: 0, GRA: 0 }, t0: 0, items: [], stage: s.house ? 'result' : 'intro', tie: null };
    var so = SORT();
    if (so && so.items) st.sort.items = so.items.slice();
    st.screen = 'sorting';
    host.show('story');
  }
  function paintSorting(el) {
    var pr = p(), s = ensure(pr), so = SORT(), S_ = st.sort, ch = chapterN(st.sortBack.ch) || chapterN(1);
    function back() { st.screen = st.sortBack.page == null ? 'chapter' : 'page'; st.ch = ch.n; if (st.sortBack.page != null) { st.page = st.sortBack.page; } resume(); }
    var html = '<div class="story-top"><button class="btn ghost sm" id="st-back">← Chapter ' + ch.n + '</button><span class="story-crumb">The Sorting Lantern</span><span class="story-right">' + (S_.stage === 'item' ? (S_.i + 1) + ' / ' + S_.items.length : '') + '</span></div>';
    if (!so || !so.items || !so.items.length) {
      html += '<div class="card sorting"><div class="lantern-wrap">' + lanternSvg({}) + '</div><p class="sort-line">The Lantern is being polished. Come back when the brass is bright.</p></div>';
      el.innerHTML = html; wireBack(el, back); return;
    }
    var n = S_.items.length, glow = {};
    CRITS.forEach(function (k) { glow[k] = Math.min(1, 0.15 + 0.85 * S_.i / n); });
    if (S_.stage === 'intro') {
      html += '<div class="card sorting"><div class="lantern-wrap">' + lanternSvg(glow) + '</div><div class="story-text">' + renderText(so.intro || '') + '</div><p class="tiny">Twelve questions. The Lantern shows no marks, only light. It finds your strongest key: direction, order, the right word, or control.</p><button class="btn primary wide" id="sort-go">Walk up to the light →</button></div>';
      el.innerHTML = html; wireBack(el, back); wireWords(el);
      $('#sort-go', el).addEventListener('click', function () { S_.stage = 'item'; S_.i = 0; S_.t0 = Date.now(); resume(); });
      return;
    }
    if (S_.stage === 'item') {
      var it = S_.items[S_.i];
      html += '<div class="card sorting"><div class="lantern-wrap small">' + lanternSvg(glow) + '</div><div class="qcard"><p class="kicker">Question ' + (S_.i + 1) + '</p><p class="stem">' + esc(it.stem) + '</p><div class="opts">' + it.options.map(function (o, k) {
        return '<button class="opt" data-k="' + k + '"><span class="opt-k">' + 'ABCD'.charAt(k) + '</span><span class="opt-t">' + esc(o) + '</span></button>';
      }).join('') + '</div></div></div>';
      el.innerHTML = html; wireBack(el, back);
      var locked = false;
      $$('.opt', el).forEach(function (b) { b.addEventListener('click', function () {
        if (locked) return; locked = true;
        var k = Number(b.dataset.k), ms = Date.now() - S_.t0, correct = k === it.answer;
        $$('.opt', el).forEach(function (o) { o.disabled = true; }); b.classList.add('sel');
        S_.answers.push({ id: it.id, crit: it.crit, k: k, correct: correct, ms: ms });
        if (correct) S_.tally[it.crit]++;
        try { if (global.API && global.API.enqueue) global.API.enqueue([{ ts: nowIso(), studentId: pr.studentId, itemId: 'sort-' + it.id, topic: 'sorting', level: '', type: 'choose', tag: 'sort-' + it.crit, cefr: it.cefr || '', correct: correct ? 1 : 0, ms: ms, hinted: 0, fast: 0, mode: 'sorting', given: String(it.options[k]).slice(0, 200), expected: String(it.options[it.answer]).slice(0, 200) }]); } catch (e) {}
        var lantern = $('.lantern-wrap', el); if (lantern) lantern.classList.add('pulse');
        setTimeout(function () { S_.i++; S_.t0 = Date.now(); if (S_.i >= n) finishSorting(); else resume(); }, reducedMotion() ? 120 : 420);
      }); });
      return;
    }
    if (S_.stage === 'tie') {
      html += '<div class="card sorting"><div class="lantern-wrap">' + lanternSvg({ TR: 1, CC: 1, LR: 1, GRA: 1 }) + '</div><div class="story-text">' + renderText(so.tieLine || 'The Lantern glows in two colours at once. It is yours to choose.') + '</div><div class="tie-pick">' + S_.tie.map(function (k) { var h = STORY().houses.filter(function (x) { return x.crit === k; })[0]; return '<button class="btn wide tie" data-house="' + h.id + '" data-crit="' + k + '">' + crestSvg(h.id, 26) + '<span><b>' + esc(h.name) + '</b> · ' + esc(h.values) + '</span></button>'; }).join('') + '</div></div>';
      el.innerHTML = html; wireBack(el, back);
      $$('.tie', el).forEach(function (b) { b.addEventListener('click', function () { settleHouse(b.dataset.crit); }); });
      return;
    }
    /* result */
    var h = house(pr), weak = weakestCrit(pr), wh = weak ? STORY().houses.filter(function (x) { return x.crit === weak; })[0] : null;
    var t = s.sort || {};
    html += '<div class="card sorting result"><div class="lantern-wrap">' + lanternSvg({ TR: 1, CC: 1, LR: 1, GRA: 1 }, h ? h.crit : null) + '</div>' +
      '<p class="kicker">' + esc(h && so.results && so.results[h.id] ? so.results[h.id] : 'The Lantern glows ' + (h ? h.name.toLowerCase() : '')) + '</p><h2 class="house-name">' + (h ? crestSvg(h.id, 44) + ' ' + esc(h.name) : '') + '</h2>' +
      (h ? '<p class="house-motto">' + esc(h.motto) + '</p><div class="story-text"><p>' + esc(h.welcome) + '</p><p class="tiny">' + esc(h.head) + ', head of ' + esc(h.name) + '</p></div>' : '') +
      '<div class="sort-bars">' + CRITS.map(function (k) { var hh = STORY().houses.filter(function (x) { return x.crit === k; })[0]; var v = Number(t[k]) || 0; return '<div class="sort-bar"><span>' + esc(hh ? hh.name : k) + ' · ' + v + ' of 3</span><span class="sort-track"><i style="--w:' + Math.round(100 * v / 3) + '%;background:' + (hh ? hh.main : '') + '"></i></span></div>'; }).join('') + '</div>' +
      (wh ? '<div class="challenge"><p class="kicker">Your challenge</p><p>' + esc(wh.challengeLine) + '</p></div>' : '') +
      '<button class="btn primary wide" id="sort-done">Continue the story →</button></div>';
    el.innerHTML = html; wireBack(el, back);
    $('#sort-done', el).addEventListener('click', back);
  }
  function finishSorting() {
    var S_ = st.sort, best = -1, top = [];
    CRITS.forEach(function (k) { var v = S_.tally[k]; if (v > best) { best = v; top = [k]; } else if (v === best) top.push(k); });
    if (top.length > 1) { S_.tie = top; S_.stage = 'tie'; resume(); return; }
    settleHouse(top[0]);
  }
  function settleHouse(crit) {
    var pr = p(), s = ensure(pr), S_ = st.sort, h = STORY().houses.filter(function (x) { return x.crit === crit; })[0];
    s.sort = { TR: S_.tally.TR, CC: S_.tally.CC, LR: S_.tally.LR, GRA: S_.tally.GRA, at: nowIso(), answers: S_.answers.map(function (a) { return a.id + ':' + a.k; }).join(' ') };
    s.house = h ? h.id : null;
    pr.xp = (pr.xp || 0) + SORT_XP;
    applyHouseAttr(pr);
    housePoints(pr);
    if (host.paintHeader) host.paintHeader();
    if (host.sync) host.sync();
    S_.stage = 'result';
    resume();
  }
  function weakestCrit(pr) {
    var s = ensure(pr), t = s.sort; if (!t) return null;
    var min = 99, weak = null;
    CRITS.forEach(function (k) { if (s.house && houseOf(s.house) && houseOf(s.house).crit === k) return; var v = Number(t[k]) || 0; if (v < min) { min = v; weak = k; } });
    return weak;
  }

  /* ============================================================= host */
  function init(h) {
    host = h;
    applyHouseAttr(p());
  }

  global.Story = {
    init: init, ensure: ensure, chapter: chapter, reachedTo: reachedTo, reached: reached, cleared: cleared,
    gateStatus: gateStatus, chapterN: chapterN, chapters: chapters, house: house, houseOf: houseOf,
    nextMission: nextMission, missions: missions, housePoints: housePoints, essaysSent: essaysSent,
    visibleViews: visibleViews, applyUnlocks: applyUnlocks, isUnlockRow: isUnlockRow, unlockAll: unlockAll,
    markVisited: markVisited, applyHouseAttr: applyHouseAttr,
    paintMap: paintMap, keepsakesHtml: keepsakesHtml, crestSvg: crestSvg, sealSvg: sealSvg,
    open: open, resume: resume, openSorting: openSorting, openEvent: openEvent, labDesigned: labDesigned,
    reset: function () { st.screen = null; st.cup = null; st.cupFor = ''; }
  };
})(window);
