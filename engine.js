/* ===========================================================================
   POSITION CONTROL — engine.js
   Item rendering and checking, the progress model, mastery and unlock rules,
   the Fault List (spaced review), XP, streaks, awards, the essay record and
   the teacher-report analysis. Inherited from Position Control and re-targeted
   at Task 2: prompt cards on items instead of charts, the free-text item
   types (thesis, bodypara, rewrite), four gate-readiness bars (TR/CC/LR/GRA)
   and essay tracking.
   Depends on: window.CONTENT (content.js + topic files + prompts + models),
               window.Prompts, window.Writer, window.Template
   =========================================================================== */
(function (global) {
  'use strict';
  var C = global.CONTENT;

  /* ---------------------------------------------------------------- utils */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function shuffle(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }
  function norm(s) {
    return String(s || '').toLowerCase().replace(/[’']/g, "'")
      .replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ').trim();
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function today() { return new Date().toISOString().slice(0, 10); }
  function daysBetween(a, b) {
    return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  }

  /* ----------------------------------------------------------------- bank
     One flat index of every item in the app, plus the maps that let a single
     item id answer "which topic, which level, which sub-topic?" */
  var BANK = {}, SUBS = {}, LEVELS = {}, TOPIC_OF = {}, LEVEL_OF = {}, MOCK_OF = {};
  var ALL_LEVELS = [];

  C.TOPICS.forEach(function (t) {
    t.levels.forEach(function (lv) {
      lv.topicId = t.id;
      LEVELS[lv.id] = lv;
      ALL_LEVELS.push(lv);
      lv.subs.forEach(function (s) {
        s.levelId = lv.id; s.topicId = t.id;
        SUBS[s.id] = s;
        s.items.forEach(function (it) {
          BANK[it.id] = it; TOPIC_OF[it.id] = t.id; LEVEL_OF[it.id] = lv.id;
        });
      });
      lv.check.levelId = lv.id; lv.check.topicId = t.id;
      lv.check.items.forEach(function (it) {
        BANK[it.id] = it; TOPIC_OF[it.id] = t.id; LEVEL_OF[it.id] = lv.id;
      });
    });
  });
  (C.MOCKS || []).forEach(function (m) {
    (m.sections || []).forEach(function (sec) {
      sec.mockId = m.id;
      sec.items.forEach(function (it) {
        BANK[it.id] = it; MOCK_OF[it.id] = m.id; it._section = sec.code; it._points = sec.points;
      });
    });
  });

  function mockItems(m) {
    var out = [];
    (m.sections || []).forEach(function (s) { s.items.forEach(function (i) { out.push(i); }); });
    return out;
  }

  /* Which module teaches a given tag? The one that spends the most questions
     on it. This is what turns a wrong answer on a mock paper into a place to
     go and work, which is the whole point of the checklist. */
  var TAG_HOME = {};
  (function () {
    var count = {};
    C.TOPICS.forEach(function (t) {
      t.levels.forEach(function (lv) {
        lv.subs.forEach(function (sb) {
          sb.items.forEach(function (it) {
            if (!it.tag) return;
            var k = it.tag + '|' + sb.id;
            count[k] = (count[k] || 0) + 1;
          });
        });
      });
    });
    var best = {};
    Object.keys(count).forEach(function (k) {
      var parts = k.split('|'), tag = parts[0], subId = parts[1];
      if (!best[tag] || count[k] > best[tag].n) best[tag] = { subId: subId, n: count[k] };
    });
    Object.keys(best).forEach(function (tag) { TAG_HOME[tag] = best[tag].subId; });
  })();

  /* ------------------------------------------------------ the daily drill
     Ten questions, mixed. Three things make it worth more than ten questions
     from one module: they are RETRIEVED rather than recognised in context,
     they are INTERLEAVED so no two in a row test the same rule, and they are
     SPACED, because the review queue feeds it first. Blocked practice — five
     items of one tag, then five of the next — feels far more effective than
     it is, because getting the fifth right proves only that the fourth is
     still in mind.

     The pool, in order of priority:
       1. questions actually due for review today
       2. questions from the tags this student gets wrong most
       3. questions from whatever their exam-plan checklist still holds
       4. anything unseen, to top up
     No mock items: those belong to the papers. */
  /* How much of the paper's ground this student has actually stood on: the
     count of distinct rules they have answered at least one question about.
     With a day and a half left this is the number that matters, far more than
     any score \u2014 a rule never met is a rule that cannot be recognised. */
  function tagsCovered(p) {
    var seen = 0, total = 0;
    Object.keys(C.REMEDIATION).forEach(function (tag) {
      total++;
      var st = p.stats && p.stats.byTag && p.stats.byTag[tag];
      if (st && st.a) seen++;
    });
    return { seen: seen, total: total };
  }

  /* The speed round: questions chosen to cover NEW ground first. Rules never
     met come before rules met and missed, which come before everything else,
     and no two questions in a row test the same rule. */
  function speedSet(p, n) {
    n = n || 20;
    var byTag = (p.stats && p.stats.byTag) || {};
    var fresh = [], shaky = [], rest = [];
    Object.keys(BANK).forEach(function (id) {
      if (MOCK_OF[id]) return;
      var it = BANK[id], st = byTag[it.tag];
      if (!st || !st.a) fresh.push(id);
      else if (st.c / st.a < 0.7) shaky.push(id);
      else rest.push(id);
    });
    var picked = [], seen = {};
    function take(ids) {
      shuffle(ids).forEach(function (id) {
        if (picked.length >= n || seen[id]) return;
        seen[id] = 1; picked.push(id);
      });
    }
    take(fresh); take(shaky); take(rest);

    var out = [], pool = picked.slice(), lastTag = null;
    while (pool.length) {
      var k = 0;
      for (var j = 0; j < pool.length; j++) {
        if (BANK[pool[j]].tag !== lastTag) { k = j; break; }
      }
      lastTag = BANK[pool[k]].tag;
      out.push(pool.splice(k, 1)[0]);
    }
    return out;
  }

  function dailySet(p, n) {
    n = n || 10;
    var picked = [], seen = {};
    function take(ids) {
      shuffle(ids).forEach(function (id) {
        if (picked.length >= n || seen[id] || !BANK[id] || MOCK_OF[id]) return;
        seen[id] = 1; picked.push(id);
      });
    }

    take(Progress.dueReview(p));

    var weak = Progress.weakTags(p, 6).map(function (w) { return w.tag; });
    if (picked.length < n && weak.length) {
      var byWeak = [];
      Object.keys(BANK).forEach(function (id) {
        if (MOCK_OF[id]) return;
        if (weak.indexOf(BANK[id].tag) >= 0) byWeak.push(id);
      });
      take(byWeak);
    }

    if (picked.length < n) {
      var fromPlan = [];
      Object.keys(p.plans || {}).forEach(function (mockId) {
        (p.plans[mockId].subs || []).forEach(function (subId) {
          var sb = SUBS[subId];
          if (!sb) return;
          var rec = p.subs[subId];
          if (rec && rec.best >= PASS_SUB) return;
          sb.items.forEach(function (it) { fromPlan.push(it.id); });
        });
      });
      take(fromPlan);
    }

    if (picked.length < n) {
      var rest = Object.keys(BANK).filter(function (id) { return !MOCK_OF[id]; });
      take(rest);
    }

    /* Interleave: never two questions in a row on the same rule, so the
       student has to work out WHICH rule applies before applying it. That
       choice is most of what the exam actually asks for. */
    var out = [], pool = picked.slice(), lastTag = null;
    while (pool.length) {
      var k = 0;
      for (var j = 0; j < pool.length; j++) {
        if (BANK[pool[j]].tag !== lastTag) { k = j; break; }
      }
      lastTag = BANK[pool[k]].tag;
      out.push(pool.splice(k, 1)[0]);
    }
    return out;
  }

  var Bank = {
    item: function (id) { return BANK[id]; },
    moduleForTag: function (tag) { return TAG_HOME[tag] ? SUBS[TAG_HOME[tag]] : null; },
    sub: function (id) { return SUBS[id]; },
    level: function (id) { return LEVELS[id]; },
    topic: function (id) {
      for (var i = 0; i < C.TOPICS.length; i++) if (C.TOPICS[i].id === id) return C.TOPICS[i];
      return null;
    },
    mock: function (id) {
      for (var i = 0; i < (C.MOCKS || []).length; i++) if (C.MOCKS[i].id === id) return C.MOCKS[i];
      return null;
    },
    mockItems: mockItems,
    dailySet: function (p, n) { return dailySet(p, n); },
    speedSet: function (p, n) { return speedSet(p, n); },
    topicOf: function (id) { return TOPIC_OF[id]; },
    levelOf: function (id) { return LEVEL_OF[id]; },
    allLevels: function () { return ALL_LEVELS; },
    all: function () { return BANK; },

    /* A revision paper the teacher can set: pulled from the systems checks,
       weighted towards the tags this student is actually getting wrong, so a
       set paper is a diagnosis rather than a lottery. */
    revisionPaper: function (progress, n, topicId) {
      n = n || 12;
      var weak = {}, w = Progress.weakTags(progress, 6);
      w.forEach(function (r, i) { weak[r.tag] = 6 - i; });
      var pool = [];
      ALL_LEVELS.forEach(function (lv) {
        if (topicId && lv.topicId !== topicId) return;
        lv.check.items.forEach(function (it) { pool.push(it); });
      });
      pool = shuffle(pool);
      pool.sort(function (a, b) { return (weak[b.tag] || 0) - (weak[a.tag] || 0); });
      return pool.slice(0, n);
    }
  };

  /* ------------------------------------------------------------------ art
     Eight scene banners, one per system. Inline SVG so they need no network,
     never pixelate, and re-colour themselves in dark mode. */
  var ART = {
    chip:
      '<rect x="112" y="24" width="96" height="52" rx="8" fill="var(--accent)"/>' +
      '<rect x="128" y="40" width="64" height="20" rx="4" fill="var(--accent-soft)"/>' +
      '<g stroke="var(--accent)" stroke-width="3" stroke-linecap="round">' +
      '<line x1="112" y1="36" x2="84" y2="36"/><line x1="112" y1="50" x2="84" y2="50"/><line x1="112" y1="64" x2="84" y2="64"/>' +
      '<line x1="208" y1="36" x2="236" y2="36"/><line x1="208" y1="50" x2="236" y2="50"/><line x1="208" y1="64" x2="236" y2="64"/></g>' +
      '<g fill="var(--gold)"><circle cx="78" cy="36" r="4"/><circle cx="78" cy="64" r="4"/><circle cx="242" cy="50" r="4"/></g>' +
      '<g stroke="var(--accent-line)" stroke-width="2"><line x1="20" y1="50" x2="74" y2="50"/><line x1="246" y1="36" x2="300" y2="36"/><line x1="246" y1="64" x2="300" y2="64"/></g>',
    layers:
      '<path d="M160 14 L262 44 L160 74 L58 44 Z" fill="var(--gold)" opacity=".85"/>' +
      '<path d="M160 44 L262 66 L160 92 L58 66 Z" fill="var(--accent)" opacity=".5"/>' +
      '<path d="M160 60 L246 78 L160 96 L74 78 Z" fill="var(--accent)"/>' +
      '<g stroke="var(--accent-line)" stroke-width="1.5" opacity=".7"><line x1="160" y1="14" x2="160" y2="96"/></g>',
    stack:
      '<g fill="var(--accent)"><rect x="60" y="66" width="200" height="16" rx="4"/>' +
      '<rect x="82" y="44" width="156" height="16" rx="4" opacity=".7"/>' +
      '<rect x="104" y="22" width="112" height="16" rx="4" opacity=".45"/></g>' +
      '<g stroke="var(--gold)" stroke-width="2.5" stroke-linecap="round">' +
      '<line x1="160" y1="40" x2="160" y2="20"/><path d="M152 27 L160 18 L168 27" fill="none"/></g>' +
      '<g fill="var(--gold)"><circle cx="46" cy="74" r="5"/><circle cx="274" cy="74" r="5"/></g>',
    clock:
      '<circle cx="160" cy="50" r="34" fill="none" stroke="var(--accent)" stroke-width="4"/>' +
      '<line x1="160" y1="50" x2="160" y2="28" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="160" y1="50" x2="180" y2="60" stroke="var(--gold)" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="160" cy="50" r="4" fill="var(--gold)"/>' +
      '<g stroke="var(--accent-line)" stroke-width="3" stroke-linecap="round">' +
      '<line x1="26" y1="30" x2="96" y2="30"/><line x1="26" y1="50" x2="78" y2="50"/><line x1="26" y1="70" x2="96" y2="70"/>' +
      '<line x1="224" y1="30" x2="294" y2="30"/><line x1="242" y1="50" x2="294" y2="50"/><line x1="224" y1="70" x2="294" y2="70"/></g>',
    signal:
      '<g fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round">' +
      '<path d="M108 74 a58 58 0 0 1 0 -52"/><path d="M86 84 a86 86 0 0 1 0 -72"/>' +
      '<path d="M212 74 a58 58 0 0 0 0 -52"/><path d="M234 84 a86 86 0 0 0 0 -72"/></g>' +
      '<circle cx="160" cy="48" r="13" fill="var(--gold)"/>' +
      '<rect x="152" y="58" width="16" height="34" rx="4" fill="var(--accent)"/>' +
      '<rect x="134" y="88" width="52" height="8" rx="4" fill="var(--accent)" opacity=".6"/>',
    grid:
      '<g fill="var(--accent)">' +
      '<rect x="36" y="18" width="80" height="12" rx="3"/><rect x="128" y="18" width="156" height="12" rx="3" opacity=".35"/>' +
      '<rect x="36" y="40" width="112" height="12" rx="3" opacity=".7"/><rect x="160" y="40" width="124" height="12" rx="3" opacity=".35"/>' +
      '<rect x="36" y="62" width="64" height="12" rx="3" opacity=".5"/><rect x="112" y="62" width="172" height="12" rx="3" opacity=".35"/></g>' +
      '<rect x="36" y="84" width="140" height="12" rx="3" fill="var(--gold)"/>' +
      '<g stroke="var(--gold)" stroke-width="2" opacity=".8"><path d="M20 24 L28 24 L28 46 L20 46" fill="none"/></g>',
    lexicon:
      '<rect x="52" y="16" width="102" height="72" rx="5" fill="var(--surface)" stroke="var(--accent-line)" stroke-width="2"/>' +
      '<rect x="166" y="16" width="102" height="72" rx="5" fill="var(--surface)" stroke="var(--accent-line)" stroke-width="2"/>' +
      '<g fill="var(--accent)" opacity=".55">' +
      '<rect x="64" y="30" width="60" height="6" rx="3"/><rect x="64" y="44" width="76" height="6" rx="3"/><rect x="64" y="58" width="48" height="6" rx="3"/>' +
      '<rect x="178" y="30" width="72" height="6" rx="3"/><rect x="178" y="44" width="54" height="6" rx="3"/><rect x="178" y="58" width="68" height="6" rx="3"/></g>' +
      '<rect x="64" y="72" width="36" height="6" rx="3" fill="var(--gold)"/>' +
      '<rect x="178" y="72" width="44" height="6" rx="3" fill="var(--gold)"/>' +
      '<path d="M154 52 L166 52" stroke="var(--gold)" stroke-width="3"/>',
    scope:
      '<circle cx="132" cy="48" r="32" fill="none" stroke="var(--accent)" stroke-width="4"/>' +
      '<circle cx="132" cy="48" r="32" fill="var(--accent-soft)"/>' +
      '<line x1="155" y1="71" x2="188" y2="96" stroke="var(--accent)" stroke-width="7" stroke-linecap="round"/>' +
      '<g fill="var(--gold)" opacity=".85"><rect x="112" y="36" width="40" height="5" rx="2.5"/>' +
      '<rect x="112" y="47" width="30" height="5" rx="2.5"/><rect x="112" y="58" width="36" height="5" rx="2.5"/></g>' +
      '<g stroke="var(--accent-line)" stroke-width="3" stroke-linecap="round">' +
      '<line x1="204" y1="26" x2="292" y2="26"/><line x1="204" y1="44" x2="270" y2="44"/><line x1="204" y1="62" x2="292" y2="62"/></g>',
    sim:
      '<rect x="44" y="14" width="232" height="74" rx="8" fill="var(--surface)" stroke="var(--accent-line)" stroke-width="2"/>' +
      '<rect x="44" y="14" width="232" height="16" rx="8" fill="var(--accent)"/>' +
      '<g fill="var(--accent)" opacity=".45">' +
      '<rect x="60" y="42" width="84" height="6" rx="3"/><rect x="60" y="56" width="120" height="6" rx="3"/><rect x="60" y="70" width="64" height="6" rx="3"/></g>' +
      '<g fill="var(--gold)"><circle cx="228" cy="58" r="20" opacity=".2"/><circle cx="228" cy="58" r="20" fill="none" stroke="var(--gold)" stroke-width="3"/>' +
      '<line x1="228" y1="58" x2="228" y2="46" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="228" y1="58" x2="237" y2="64" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/></g>'
  };
  function artSvg(name) {
    var d = ART[name];
    if (!d) return '';
    return '<svg class="art" viewBox="0 0 320 110" preserveAspectRatio="xMidYMid meet" ' +
      'role="presentation" aria-hidden="true">' + d + '</svg>';
  }
  function artBand(name, cls) {
    if (!ART[name]) return '';
    return '<div class="artband' + (cls ? ' ' + cls : '') + '">' + artSvg(name) + '</div>';
  }

  /* ------------------------------------------------------------ rendering */
  /* Every renderer returns { response, hasResponse, check, lock } */

  function mcqView(host, options, answerIdx) {
    var chosen = -1, btns = [];
    var wrap = el('div', 'opts');
    options.forEach(function (opt, i) {
      var b = el('button', 'opt');
      b.type = 'button';
      b.innerHTML = '<span class="opt-k">' + (i + 1) + '</span><span class="opt-t">' + opt + '</span>';
      b.addEventListener('click', function () {
        if (wrap.dataset.locked) return;
        chosen = i;
        btns.forEach(function (x, j) { x.classList.toggle('sel', j === i); });
        host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
      });
      btns.push(b); wrap.appendChild(b);
    });
    host.appendChild(wrap);
    return {
      response: function () { return chosen; },
      hasResponse: function () { return chosen >= 0; },
      check: function () {
        return {
          correct: chosen === answerIdx,
          givenText: chosen >= 0 ? stripTags(options[chosen]) : '(no answer)',
          expectedText: stripTags(options[answerIdx])
        };
      },
      lock: function () {
        wrap.dataset.locked = '1';
        btns.forEach(function (b, i) {
          b.disabled = true;
          if (i === answerIdx) b.classList.add('right');
          else if (i === chosen) b.classList.add('wrong');
        });
      }
    };
  }

  function stripTags(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, ''); }

  /* One numbered blank, drawn so it reads as a blank rather than as a number
     dropped into the sentence: ___[7]___, with the gap being asked about lit
     up. Used by the gapped text and by the dialogue alike, so a student moving
     through either one always sees where they are. */
  function gapSpan(n, isThis) {
    /* The underscores go in as entities: the dialogue renderer replaces any
       remaining literal ___ with a plain blank marker, and would eat these. */
    var u = '&#95;&#95;&#95;';
    return '<span class="gapno' + (isThis ? ' on' : '') + '">' +
      '<i>' + u + '</i>[' + n + ']<i>' + u + '</i></span>';
  }

  /* Highlight the gap this item is asking about inside a shared passage, and
     leave the other gap numbers visible exactly as the paper shows them. */
  function markPassage(text, blank) {
    var html = esc(text).replace(/___\((\d+)\)___/g, function (m, n) {
      return gapSpan(n, blank && ('(' + n + ')') === blank);
    });
    /* A passage is escaped before it is inserted, so a literal <br> written
       into the content would be shown to the student as text. Treat it as the
       paragraph break it was meant to be. */
    html = html.replace(/(&lt;br\s*\/?&gt;\s*){2,}/gi, '\n\n').replace(/&lt;br\s*\/?&gt;/gi, '\n');
    return html.replace(/\n\s*\n/g, '</p><p>').replace(/\n/g, ' ');
  }

  function renderStem(host, item) {
    if (item.prompt) {
      var ch = el('div', 'qprompt');
      var pr = typeof item.prompt === 'string' ? global.Prompts.get(item.prompt) : item.prompt;
      ch.innerHTML = pr ? global.Prompts.card(pr, { compact: true }) : '';
      host.appendChild(ch);
    }
    if (item.passage) {
      var box = el('div', 'passage' + (item.type === 'read' ? ' read' : ''));
      box.innerHTML = '<p>' + markPassage(item.passage, item.blank) + '</p>' +
        (item.source ? '<p class="psource">' + esc(item.source) + '</p>' : '');
      host.appendChild(box);
    }
    if (item.given) {
      var g = el('div', 'given');
      g.innerHTML = '<span class="given-k">Given</span><span class="given-t">' + item.given + '</span>';
      host.appendChild(g);
    }
    if (item.lines) {
      var d = el('div', 'dialogue');
      item.lines.forEach(function (l) {
        var row = el('div', 'dline');
        row.appendChild(el('span', 'who', esc(l.who)));
        /* The dialogue tracks the current gap the same way the gapped text
           does, so advancing through questions 6 to 10 moves the highlight
           down the conversation instead of leaving the student to count. */
        var said = esc(String(l.text))
          .replace(/___\((\d+)\)___/g, function (m, n) {
            return gapSpan(n, item.blank && ('(' + n + ')') === item.blank);
          })
          .replace(/___/g, '<span class="blank">?</span>');
        row.appendChild(el('span', 'said', said));
        d.appendChild(row);
      });
      host.appendChild(d);
    }
    if (item.table) {
      var sc = el('div', 'tbl-scroll');
      var t = el('table', 'tbl');
      var thead = el('thead'), hr = el('tr');
      item.table.cols.forEach(function (c) { hr.appendChild(el('th', null, esc(c))); });
      thead.appendChild(hr); t.appendChild(thead);
      var tb = el('tbody');
      item.table.rows.forEach(function (row) {
        var tr = el('tr');
        row.forEach(function (cell, i) { tr.appendChild(el('td', i ? 'num' : null, esc(cell))); });
        tb.appendChild(tr);
      });
      t.appendChild(tb); sc.appendChild(t); host.appendChild(sc);
    }
    if (item.stem) host.appendChild(el('p', 'stem', item.stem));
  }

  var RENDER = {
    choose: function (host, item) { renderStem(host, item); return mcqView(host, item.options, item.answer); },
    equiv: function (host, item) { renderStem(host, item); return mcqView(host, item.options, item.answer); },
    cloze: function (host, item) { renderStem(host, item); return mcqView(host, item.options, item.answer); },
    read: function (host, item) { renderStem(host, item); return mcqView(host, item.options, item.answer); },
    table: function (host, item) { renderStem(host, item); return mcqView(host, item.options, item.answer); },
    gap: function (host, item) { renderStem(host, item); return mcqView(host, item.options, item.answer); },

    judge: function (host, item) {
      renderStem(host, item);
      return mcqView(host, ['True', 'False', 'Can\'t tell'], item.answer);
    },

    spot: function (host, item) {
      renderStem(host, item);
      var chosen = -1, toks = [];
      var line = el('div', 'segs');
      item.words.forEach(function (w, i) {
        var b = el('button', 'seg');
        b.type = 'button';
        b.innerHTML = '<span class="seg-n">' + (i + 1) + '</span>' + esc(w);
        b.addEventListener('click', function () {
          if (line.dataset.locked) return;
          chosen = i;
          toks.forEach(function (x, j) { x.classList.toggle('sel', j === i); });
          host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
        });
        toks.push(b); line.appendChild(b);
      });
      host.appendChild(line);
      return {
        response: function () { return chosen; },
        hasResponse: function () { return chosen >= 0; },
        check: function () {
          return {
            correct: chosen === item.answer,
            givenText: chosen >= 0 ? '(' + (chosen + 1) + ') ' + item.words[chosen] : '(no answer)',
            expectedText: '(' + (item.answer + 1) + ') ' + item.words[item.answer] + ' → ' + item.fix
          };
        },
        lock: function () {
          line.dataset.locked = '1';
          toks.forEach(function (b, i) {
            b.disabled = true;
            if (i === item.answer) b.classList.add('right');
            else if (i === chosen) b.classList.add('wrong');
          });
          host.appendChild(el('div', 'fixnote',
            '<strong>(' + (item.answer + 1) + ')</strong> ' + esc(item.words[item.answer]) +
            ' &nbsp;→&nbsp; ' + esc(item.fix)));
        }
      };
    },

    sort: function (host, item) {
      renderStem(host, item);
      var placed = {};
      var pool = el('div', 'sort-pool');
      var bins = el('div', 'sort-bins');
      bins.style.setProperty('--cols', String(item.bins.length));
      var chips = [], binEls = {}, locked = false, picked = -1;

      function paint() {
        item.bins.forEach(function (b) {
          var drop = binEls[b.key].querySelector('.sort-drop');
          drop.innerHTML = '';
          var any = false;
          item.items.forEach(function (it, i) {
            if (placed[i] !== b.key) return;
            any = true;
            var c = el('button', 'chip-i in');
            c.type = 'button';
            c.innerHTML = it.text;
            if (locked) c.classList.add(it.bin === b.key ? 'right' : 'wrong');
            c.disabled = locked;
            c.addEventListener('click', function () {
              if (locked) return;
              delete placed[i]; paint();
              host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
            });
            drop.appendChild(c);
          });
          if (!any) drop.appendChild(el('span', 'sort-empty', 'tap a card, then this box'));
        });
        chips.forEach(function (c, i) {
          c.classList.toggle('gone', placed[i] != null);
          c.disabled = placed[i] != null || locked;
        });
        var all = Object.keys(placed).length === item.items.length;
        pool.classList.toggle('spent', all);
        var done = pool.querySelector('.sort-done');
        if (all && !done) pool.appendChild(el('span', 'sort-done', 'All placed — press Check'));
        if (!all && done) pool.removeChild(done);
      }
      function selectChip(i) {
        picked = picked === i ? -1 : i;
        chips.forEach(function (c, j) { c.classList.toggle('armed', j === picked); });
        Object.keys(binEls).forEach(function (k) { binEls[k].classList.toggle('ready', picked >= 0); });
      }
      /* The cards are authored bin by bin, which lays them out alternating
         left, right, left, right. A student who spots that can sort the whole
         thing without reading a word of it, which is the opposite of the
         exercise. So shuffle the display order — and throw a shuffle away if
         it still reads as a pattern, either perfectly alternating or with all
         of one bin bunched together.

         Only the ORDER ON SCREEN moves. Each card keeps its own index, so the
         answer key and the marking are untouched. */
      function readsAsAPattern(ord) {
        if (ord.length < 4) return false;
        var seq = ord.map(function (k) { return item.items[k].bin; });
        var kinds = {};
        seq.forEach(function (b) { kinds[b] = 1; });
        var n = Object.keys(kinds).length;
        if (n < 2) return false;
        var alternating = true;
        for (var a = 1; a < seq.length; a++) {
          if (seq[a] === seq[a - 1]) { alternating = false; break; }
        }
        if (alternating) return true;
        var runs = 1;
        for (var b2 = 1; b2 < seq.length; b2++) if (seq[b2] !== seq[b2 - 1]) runs++;
        return runs === n;   /* every bin in one unbroken block */
      }
      var indices = item.items.map(function (t, i) { return i; });
      var shown = shuffle(indices.slice());
      for (var tries = 0; tries < 24 && readsAsAPattern(shown); tries++) {
        shown = shuffle(indices.slice());
      }

      item.items.forEach(function (it, i) {
        var c = el('button', 'chip-i');
        c.type = 'button'; c.innerHTML = it.text;
        c.addEventListener('click', function () { if (!locked) selectChip(i); });
        chips[i] = c;
      });
      shown.forEach(function (i) { pool.appendChild(chips[i]); });
      item.bins.forEach(function (b) {
        var box = el('div', 'sort-bin');
        box.innerHTML = '<div class="sort-h"><b>' + b.label + '</b>' +
          (b.hint ? '<span>' + esc(b.hint) + '</span>' : '') + '</div><div class="sort-drop"></div>';
        box.addEventListener('click', function () {
          if (locked || picked < 0) return;
          placed[picked] = b.key;
          selectChip(picked);
          paint();
          host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
        });
        binEls[b.key] = box; bins.appendChild(box);
      });
      host.appendChild(pool); host.appendChild(bins); paint();

      return {
        response: function () { return JSON.stringify(placed); },
        hasResponse: function () { return Object.keys(placed).length === item.items.length; },
        check: function () {
          var wrong = item.items.filter(function (it, i) { return placed[i] !== it.bin; });
          var label = {};
          item.bins.forEach(function (b) { label[b.key] = b.label; });
          return {
            correct: wrong.length === 0,
            givenText: item.items.map(function (it, i) {
              return stripTags(it.text) + '→' + (label[placed[i]] || '?');
            }).join('; '),
            expectedText: item.bins.map(function (b) {
              return b.label + ': ' + item.items.filter(function (x) { return x.bin === b.key; })
                .map(function (x) { return stripTags(x.text); }).join(', ');
            }).join(' | ')
          };
        },
        lock: function () { locked = true; selectChip(-1); paint(); }
      };
    },

    build: function (host, item) {
      renderStem(host, item);
      var picked = [];
      var slot = el('div', 'slot');
      var pool = el('div', 'tiles');
      var order = shuffle(item.tiles.map(function (t, i) { return i; }));

      function paint() {
        slot.innerHTML = '';
        if (!picked.length) slot.appendChild(el('span', 'slot-hint', 'Tap the parts in order'));
        picked.forEach(function (idx, pos) {
          var b = el('button', 'tile in');
          b.type = 'button'; b.textContent = item.tiles[idx];
          b.addEventListener('click', function () {
            if (slot.dataset.locked) return;
            picked.splice(pos, 1); paint();
            host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
          });
          slot.appendChild(b);
        });
        Array.prototype.forEach.call(pool.children, function (b, i) {
          b.disabled = picked.indexOf(order[i]) >= 0 || !!slot.dataset.locked;
          b.classList.toggle('used', picked.indexOf(order[i]) >= 0);
        });
      }
      order.forEach(function (idx) {
        var b = el('button', 'tile');
        b.type = 'button'; b.textContent = item.tiles[idx];
        b.addEventListener('click', function () {
          if (slot.dataset.locked || picked.indexOf(idx) >= 0) return;
          picked.push(idx); paint();
          host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
        });
        pool.appendChild(b);
      });
      host.appendChild(slot); host.appendChild(pool); paint();

      return {
        response: function () { return picked.map(function (i) { return item.tiles[i]; }).join(' '); },
        hasResponse: function () { return picked.length === item.tiles.length; },
        check: function () {
          var got = picked.map(function (i) { return item.tiles[i]; }).join(' ');
          var oks = [item.solution].concat(item.alt || []);
          return {
            correct: oks.some(function (s) { return norm(s) === norm(got); }),
            givenText: got || '(no answer)',
            expectedText: item.solution
          };
        },
        lock: function () {
          slot.dataset.locked = '1'; paint();
          Array.prototype.forEach.call(slot.children, function (b) { b.disabled = true; });
        }
      };
    },

    order: function (host, item) {
      renderStem(host, item);
      var picked = [];
      var display = shuffle(item.items.map(function (t, i) { return i; }));
      var slot = el('div', 'rank-slot');
      var pool = el('div', 'rank-pool');

      function paint() {
        slot.innerHTML = '';
        if (!picked.length) slot.appendChild(el('span', 'slot-hint', 'Tap the sentences in order'));
        picked.forEach(function (idx, pos) {
          var b = el('button', 'rank in');
          b.type = 'button';
          b.innerHTML = '<span class="rank-n">' + (pos + 1) + '</span>' + esc(item.items[idx]);
          b.addEventListener('click', function () {
            if (slot.dataset.locked) return;
            picked.splice(pos, 1); paint();
            host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
          });
          slot.appendChild(b);
        });
        Array.prototype.forEach.call(pool.children, function (b, i) {
          b.disabled = picked.indexOf(display[i]) >= 0 || !!slot.dataset.locked;
          b.classList.toggle('used', picked.indexOf(display[i]) >= 0);
        });
      }
      display.forEach(function (idx) {
        var b = el('button', 'rank');
        b.type = 'button'; b.textContent = item.items[idx];
        b.addEventListener('click', function () {
          if (slot.dataset.locked || picked.indexOf(idx) >= 0) return;
          picked.push(idx); paint();
          host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
        });
        pool.appendChild(b);
      });
      host.appendChild(slot); host.appendChild(pool); paint();

      return {
        response: function () { return picked.join(','); },
        hasResponse: function () { return picked.length === item.items.length; },
        check: function () {
          var ok = picked.length === item.items.length &&
            picked.every(function (v, i) { return v === i; });
          return {
            correct: ok,
            givenText: picked.map(function (i) { return 'ABCD'[i] || (i + 1); }).join('-') || '(no answer)',
            expectedText: item.items.map(function (x, i) { return 'ABCD'[i] || (i + 1); }).join('-')
          };
        },
        lock: function () {
          slot.dataset.locked = '1'; paint();
          Array.prototype.forEach.call(slot.children, function (b, i) {
            b.disabled = true;
            b.classList.add(picked[i] === i ? 'right' : 'wrong');
          });
        }
      };
    }
  };


  /* Free text, marked by rules (see writer.js). The student sees the notes,
     never a key, because there is no single right answer. */
  function textView(host, item, kind) {
    var ta = el('textarea', 'ftext');
    ta.rows = kind === 'bodypara' ? 7 : kind === 'thesis' ? 2 : 3;
    ta.spellcheck = false;
    ta.placeholder = kind === 'thesis' ? 'One sentence: your position …' : kind === 'bodypara' ? 'Facet → mechanism → example → nuance …' : 'Rewrite it …';
    ta.addEventListener('input', function () { host.dispatchEvent(new CustomEvent('respond', { bubbles: true })); });
    host.appendChild(ta);
    var wc = el('div', 'tiny', '0 words');
    host.appendChild(wc);
    ta.addEventListener('input', function () { wc.textContent = global.Writer.words(ta.value) + ' words'; });
    var last = null;
    return {
      response: function () { return ta.value; },
      hasResponse: function () { return global.Writer.words(ta.value) >= (kind === 'rewrite' ? 3 : kind === 'thesis' ? 6 : 25); },
      check: function () {
        var W = global.Writer;
        last = kind === 'thesis' ? W.checkThesis(ta.value, item) : kind === 'bodypara' ? W.checkBody(ta.value, item) : W.checkRewrite(ta.value, item);
        return { correct: last.ok, givenText: ta.value, expectedText: last.notes.join(' ') };
      },
      lock: function () {
        ta.disabled = true;
        if (last) host.appendChild(el('ul', 'ftnotes ' + (last.ok ? 'ok' : 'no'), last.notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('')));
      }
    };
  }
  RENDER.thesis = function (host, item) { renderStem(host, item); return textView(host, item, 'thesis'); };
  RENDER.bodypara = function (host, item) { renderStem(host, item); return textView(host, item, 'bodypara'); };
  RENDER.rewrite = function (host, item) { renderStem(host, item); return textView(host, item, 'rewrite'); };

  /* Tick exactly k of the options. */
  RENDER.select = function (host, item) {
    renderStem(host, item);
    var chosen = {}, btns = [];
    var wrap = el('div', 'opts');
    var note = el('div', 'tiny', 'Choose ' + item.k + '.');
    item.options.forEach(function (opt, i) {
      var b = el('button', 'opt');
      b.type = 'button';
      b.innerHTML = '<span class="opt-k">' + (i + 1) + '</span><span class="opt-t">' + opt + '</span>';
      b.addEventListener('click', function () {
        if (wrap.dataset.locked) return;
        if (chosen[i]) delete chosen[i]; else if (Object.keys(chosen).length < item.k) chosen[i] = 1;
        btns.forEach(function (x, j) { x.classList.toggle('sel', !!chosen[j]); });
        note.textContent = Object.keys(chosen).length + ' of ' + item.k + ' chosen.';
        host.dispatchEvent(new CustomEvent('respond', { bubbles: true }));
      });
      btns.push(b); wrap.appendChild(b);
    });
    host.appendChild(wrap); host.appendChild(note);
    return {
      response: function () { return Object.keys(chosen).join(','); },
      hasResponse: function () { return Object.keys(chosen).length === item.k; },
      check: function () {
        var ok = item.answers.every(function (a) { return chosen[a]; }) && Object.keys(chosen).length === item.answers.length;
        return {
          correct: ok,
          givenText: Object.keys(chosen).map(function (i) { return stripTags(item.options[i]); }).join('; '),
          expectedText: item.answers.map(function (i) { return stripTags(item.options[i]); }).join('; ')
        };
      },
      lock: function () {
        wrap.dataset.locked = '1';
        btns.forEach(function (b, i) {
          b.disabled = true;
          if (item.answers.indexOf(i) >= 0) b.classList.add('right');
          else if (chosen[i]) b.classList.add('wrong');
        });
      }
    };
  };

  function mount(item, host) {
    host.innerHTML = '';
    host.dataset.type = item.type;
    var fn = RENDER[item.type] || RENDER.choose;
    return fn(host, item);
  }

  var TYPE_LABEL = {
    choose: 'Choose the best option',
    equiv: 'Choose the closest meaning',
    cloze: 'Fill the gap in the text',
    read: 'Reading comprehension',
    gap: 'Fill the gap in the conversation',
    judge: 'True / False / Can\'t tell',
    table: 'Read the table',
    spot: 'Identify the error',
    sort: 'Put each one in the right box',
    build: 'Build the sentence',
    order: 'Put them in order',
    select: 'Tick the right ones',
    thesis: 'Write the thesis sentence',
    bodypara: 'Write the body paragraph',
    rewrite: 'Rewrite the sentence'
  };

  /* ------------------------------------------------------------- progress */
  var XP_CORRECT = 10, XP_HINT_PENALTY = 4, XP_SUB = 40, XP_CHECK = 120, XP_MOCK = 250;
  var XP_SPEED = 6, SPEED_MS = 7000;
  var PASS_SUB = 0.6, PASS_CHECK = 0.75;

  function blank(id, name) {
    return {
      studentId: id, displayName: name || id,
      xp: 0, streak: 0, longestStreak: 0, lastActiveDate: null,
      sessions: 0, runBest: 0, run: 0, reclaimed: 0, speedBonuses: 0,
      subs: {}, checks: {}, mocks: {}, plans: {}, badges: [], review: {},
      stats: { seen: 0, correct: 0, byTag: {} },
      reports: [], types: {}, thesesPassed: 0, bestBand: 0, preflightPerfect: 0, examPassed: 0, tier: 'B2',
      assignment: null, created: new Date().toISOString()
    };
  }

  function checksCleared(p) {
    var n = 0;
    ALL_LEVELS.forEach(function (lv) {
      var r = p.checks[lv.check.id];
      if (r && r.best >= PASS_CHECK) n++;
    });
    return n;
  }
  function rank(p) {
    var n = checksCleared(p), out = C.RANKS[0];
    for (var i = 0; i < C.RANKS.length; i++) if (n >= C.RANKS[i].min) out = C.RANKS[i];
    return out;
  }
  function rankIndex(p) {
    var n = checksCleared(p), idx = 0;
    for (var i = 0; i < C.RANKS.length; i++) if (n >= C.RANKS[i].min) idx = i;
    return idx;
  }

  function subsDone(p, lv) {
    return lv.subs.filter(function (s) {
      var r = p.subs[s.id]; return r && r.best >= PASS_SUB;
    }).length;
  }
  function checkUnlocked(p, lv) { return subsDone(p, lv) === lv.subs.length; }

  /* Every system and every level is open from the first day. A level's own
     systems check still waits for its three modules, because that is a check
     on the level's material, not a lock on where a student may work. */
  function levelPct(p, lv) {
    var sm = 0;
    lv.subs.forEach(function (s) { sm += Math.min(1, (p.subs[s.id] || {}).best || 0); });
    sm = sm / lv.subs.length;
    var cm = Math.min(1, (p.checks[lv.check.id] || {}).best || 0);
    return Math.round((sm * 0.6 + cm * 0.4) * 100);
  }
  function topicPct(p, t) {
    var sum = 0;
    t.levels.forEach(function (lv) { sum += levelPct(p, lv); });
    return Math.round(sum / t.levels.length);
  }
  function readiness(p) {
    var sum = 0;
    ALL_LEVELS.forEach(function (lv) { sum += levelPct(p, lv); });
    return Math.round(sum / ALL_LEVELS.length);
  }
  /* Four bars, one per criterion: module mastery weighted by the gates each
     module serves, blended with the last three report estimates. */
  function gateReadiness(p) {
    var sum = { TR: 0, CC: 0, LR: 0, GRA: 0 }, cnt = { TR: 0, CC: 0, LR: 0, GRA: 0 };
    C.TOPICS.forEach(function (t) {
      var gates = C.MODULE_GATES[t.id] || ['TR'];
      var pct = topicPct(p, t);
      gates.forEach(function (g) { sum[g] += pct; cnt[g]++; });
    });
    var out = {};
    Object.keys(sum).forEach(function (g) { out[g] = cnt[g] ? Math.round(sum[g] / cnt[g]) : 0; });
    var recent = (p.reports || []).filter(function (r) { return r.bands; }).slice(-3);
    if (recent.length) {
      var avg = { TR: 0, CC: 0, LR: 0, GRA: 0 };
      recent.forEach(function (r) { avg.TR += (r.bands.tr || r.bands.ta || 0); avg.CC += r.bands.cc; avg.LR += r.bands.lr; avg.GRA += r.bands.gra; });
      Object.keys(avg).forEach(function (g) {
        var bandPct = Math.round(Math.max(0, Math.min(100, (avg[g] / recent.length - 4) / 4 * 100)));  /* band 4 → 0, band 8 → 100 */
        out[g] = Math.round(out[g] * 0.6 + bandPct * 0.4);
      });
    }
    return out;
  }

  /* A finished report (from the Writer). Keeps the last 40 summaries on the
     progress object; the full text travels to the sheet separately. */
  function recordReport(p, rep) {
    if (!p.reports) p.reports = [];
    if (!p.types) p.types = {};
    var prompt = global.Prompts.get(rep.promptId) || {};
    var summary = { id: rep.id, ts: rep.ts || new Date().toISOString(), promptId: rep.promptId, mode: rep.uiMode || '', type: prompt.type || '',
      words: rep.words, seconds: rep.seconds, bad: rep.preflight ? rep.preflight.bad : 0, warn: rep.preflight ? rep.preflight.warn : 0,
      timedOut: !!rep.timedOut, kind: rep.kind || 'practice', bands: rep.bands || null };
    p.reports.push(summary);
    if (p.reports.length > 40) p.reports = p.reports.slice(-40);
    var passing = summary.bad === 0 && rep.words >= 250;
    if (passing && prompt.type) p.types[prompt.type] = (p.types[prompt.type] || 0) + 1;
    if (passing && rep.uiMode === 'exam') p.examPassed = (p.examPassed || 0) + 1;
    if (summary.bad === 0 && summary.warn === 0) p.preflightPerfect = (p.preflightPerfect || 0) + 1;
    if (rep.seconds <= 2400 && rep.words >= 250) p.onTime = (p.onTime || 0) + 1;
    if (rep.kind === 'mock') { if (!p.mocks) p.mocks = {}; p.mocks[rep.mockId || rep.promptId] = { best: passing ? 1 : 0.5, at: summary.ts }; }
    p.xp += rep.kind === 'mock' ? XP_MOCK : 80;
    return summary;
  }
  /* The AI or the teacher marks later; the band arrives by id. */
  function applyBands(p, reportId, bands) {
    var hit = null;
    (p.reports || []).forEach(function (r) { if (r.id === reportId) { r.bands = bands; hit = r; } });
    if (hit && bands && bands.overall) {
      if (bands.overall >= (p.bestBand || 0) + 0.5 && p.bestBand) p.bandUp = true;
      p.bestBand = Math.max(p.bestBand || 0, bands.overall);
    }
    return hit;
  }

  function accuracy(p) {
    return p.stats.seen ? Math.round(100 * p.stats.correct / p.stats.seen) : 0;
  }

  /* ------------------------------------------------ Fault List (Leitner) */
  /* Spacing runs on DAYS, not on sessions. It used to count sessions, which
     meant a student working through four modules in one evening had every
     missed question come back within the hour — the opposite of spacing, and
     the thing that makes revision feel productive while teaching nothing.
     A question missed today returns tomorrow; got right, three days later;
     right again and it is retired. */
  var BOX_DAYS = { 1: 1, 2: 3 };
  function addDays(iso, n) {
    var d = iso ? new Date(iso + 'T00:00:00') : new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }
  function scheduleReview(p, itemId, correct) {
    var r = p.review[itemId];
    if (!correct) {
      p.review[itemId] = { box: 1, dueDate: addDays(today(), BOX_DAYS[1]),
                           misses: ((r && r.misses) || 0) + 1 };
    } else if (r) {
      var box = Math.min(3, (r.box || 1) + 1);
      if (box >= 3) { delete p.review[itemId]; p.reclaimed++; }
      else { r.box = box; r.dueDate = addDays(today(), BOX_DAYS[box] || 3); delete r.due; }
    }
  }
  function dueReview(p) {
    var now = today();
    return Object.keys(p.review).filter(function (id) {
      if (!BANK[id] || MOCK_OF[id]) return false;
      var r = p.review[id];
      /* Records written before spacing moved to days carry a session number.
         Treat those as due now: they have all waited long enough. */
      return r.dueDate ? r.dueDate <= now : true;
    });
  }
  /* What is waiting but not yet ripe, so the fault list can say so rather
     than looking empty when there is work queued. */
  function laterReview(p) {
    var now = today();
    return Object.keys(p.review).filter(function (id) {
      var r = p.review[id];
      return BANK[id] && !MOCK_OF[id] && r.dueDate && r.dueDate > now;
    });
  }

  /* ------------------------------------------------------------- recording */
  function recordAttempt(p, item, correct, ms, hinted, fast) {
    p.stats.seen++;
    if (correct) { p.stats.correct++; p.run++; p.runBest = Math.max(p.runBest, p.run); }
    else { p.run = 0; }
    var t = p.stats.byTag[item.tag] || (p.stats.byTag[item.tag] = { a: 0, c: 0 });
    t.a++; if (correct) t.c++;
    var gain = 0;
    if (correct) {
      gain = hinted ? XP_CORRECT - XP_HINT_PENALTY : XP_CORRECT;
      if (fast) { gain += XP_SPEED; p.speedBonuses = (p.speedBonuses || 0) + 1; }
    }
    p.xp += gain;
    p.lastGain = gain;
    if (correct && item.type === 'thesis') p.thesesPassed = (p.thesesPassed || 0) + 1;
    scheduleReview(p, item.id, correct);
    return {
      ts: new Date().toISOString(), studentId: p.studentId, itemId: item.id,
      topic: TOPIC_OF[item.id] || MOCK_OF[item.id] || '', level: LEVEL_OF[item.id] || item._section || '',
      type: item.type, tag: item.tag, cefr: item.level,
      correct: correct ? 1 : 0, ms: ms || 0, hinted: hinted ? 1 : 0, fast: fast ? 1 : 0
    };
  }

  function finishSub(p, subId, score) {
    var r = p.subs[subId] || (p.subs[subId] = { best: 0, attempts: 0 });
    r.attempts++;
    if (score > r.best) r.best = score;
    r.last = score; r.at = new Date().toISOString();
    if (score >= PASS_SUB) p.xp += XP_SUB;
  }

  function finishCheck(p, checkId, score, usedHint) {
    var r = p.checks[checkId] || (p.checks[checkId] = { best: 0, attempts: 0, failedOnce: false });
    r.attempts++;
    if (score < PASS_CHECK && r.best < PASS_CHECK) r.failedOnce = true;
    if (score >= PASS_CHECK && r.failedOnce) r.comeback = true;
    if (score >= 1) r.perfect = true;
    if (!usedHint && score >= PASS_CHECK) r.noHint = true;
    if (score > r.best) r.best = score;
    r.last = score; r.at = new Date().toISOString();
    if (score >= PASS_CHECK) p.xp += XP_CHECK;
  }

  /* A mock is marked the way the real paper is: by points, not by item count,
     because Part C is worth twice what Part B is. */
  function scoreMock(mock, results) {
    var got = 0, total = 0, bySection = {};
    results.forEach(function (r) {
      var pts = r.item._points || 1;
      var sec = r.item._section || '?';
      var b = bySection[sec] || (bySection[sec] = { got: 0, total: 0, right: 0, n: 0 });
      total += pts; b.total += pts; b.n++;
      if (r.correct) { got += pts; b.got += pts; b.right++; }
    });
    return { got: Math.round(got * 100) / 100, total: Math.round(total * 100) / 100,
             pct: total ? got / total : 0, bySection: bySection };
  }

  function finishMock(p, mockId, scored) {
    if (!p.mocks) p.mocks = {};
    var r = p.mocks[mockId] || (p.mocks[mockId] = { best: 0, attempts: 0 });
    r.attempts++;
    if (scored.pct > r.best) r.best = scored.pct;
    r.last = scored.pct;
    r.marks = scored.got; r.total = scored.total;
    r.bySection = scored.bySection;
    r.at = new Date().toISOString();
    p.xp += XP_MOCK;
  }

  function touchDay(p) {
    var d = today();
    if (p.lastActiveDate === d) return false;
    if (p.lastActiveDate && daysBetween(p.lastActiveDate, d) === 1) p.streak++;
    else p.streak = 1;
    p.longestStreak = Math.max(p.longestStreak || 0, p.streak);
    p.lastActiveDate = d;
    p.sessions++;
    return true;
  }

  /* ---------------------------------------------------------------- awards */
  var BADGE_TESTS = {
    poweron: function (p) { return Object.keys(p.subs).length >= 1; },
    streak3: function (p) { return p.streak >= 3 || p.longestStreak >= 3; },
    streak7: function (p) { return p.streak >= 7 || p.longestStreak >= 7; },
    allgreen: function (p) { return Object.keys(p.checks).some(function (k) { return p.checks[k].perfect; }); },
    nohelp: function (p) { return Object.keys(p.checks).some(function (k) { return p.checks[k].noHint; }); },
    recovered: function (p) { return p.reclaimed >= 5; },
    run10: function (p) { return p.runBest >= 10; },
    thesis: function (p) { return (p.thesesPassed || 0) >= 10; },
    preflight: function (p) { return (p.preflightPerfect || 0) >= 1; },
    fivetypes: function (p) { var m = p.types || {}; return m.OPINION && m.DISCUSS && m.ADVANTAGE && m.PROBLEM && m.TWOPART; },
    forty: function (p) { return (p.onTime || 0) >= 1; },
    unplugged: function (p) { return (p.examPassed || 0) >= 1; },
    bandup: function (p) { return !!p.bandUp; },
    mock1: function (p) { return Object.keys(p.mocks || {}).length >= 1; },
    bootcamp: function (p) { var m = (p.bootcamp || {}).missions || {}; return Object.keys(m).filter(function (k) { return m[k].passed; }).length >= 3; },
    director: function (p) { return checksCleared(p) >= ALL_LEVELS.length; }
  };
  function checkBadges(p) {
    var earned = [];
    C.BADGES.forEach(function (b) {
      if (p.badges.indexOf(b.id) >= 0) return;
      var t = BADGE_TESTS[b.id] || b.test; /* modules such as the Template Lab bring their own test */
      if (t && t(p)) { p.badges.push(b.id); earned.push(b); }
    });
    return earned;
  }

  /* ------------------------------------------------- teacher-side analysis */
  function weakTags(p, limit) {
    var rows = Object.keys(p.stats.byTag).map(function (tag) {
      var t = p.stats.byTag[tag];
      var rate = t.a ? 1 - t.c / t.a : 0;
      return {
        tag: tag, attempts: t.a, correct: t.c, wrong: t.a - t.c,
        rate: rate, weight: rate * Math.log(1 + t.a),
        info: C.REMEDIATION[tag] || { name: tag }
      };
    }).filter(function (r) { return r.wrong > 0; });
    rows.sort(function (a, b) { return b.weight - a.weight; });
    return limit ? rows.slice(0, limit) : rows;
  }
  function strongTags(p, limit) {
    var rows = Object.keys(p.stats.byTag).map(function (tag) {
      var t = p.stats.byTag[tag];
      return { tag: tag, attempts: t.a, rate: t.a ? t.c / t.a : 0, info: C.REMEDIATION[tag] || { name: tag } };
    }).filter(function (r) { return r.attempts >= 3 && r.rate >= 0.85; });
    rows.sort(function (a, b) { return b.rate - a.rate || b.attempts - a.attempts; });
    return limit ? rows.slice(0, limit) : rows;
  }
  /* Which of the eight systems is costing this student the most? */
  function systemScores(p) {
    return C.TOPICS.map(function (t) {
      return { id: t.id, code: t.code, name: t.name, pct: topicPct(p, t) };
    });
  }

  var Progress = {
    blank: blank, rank: rank, rankIndex: rankIndex, checksCleared: checksCleared,
    subsDone: subsDone, checkUnlocked: checkUnlocked,
    levelPct: levelPct, topicPct: topicPct, readiness: readiness, accuracy: accuracy,
    recordAttempt: recordAttempt, finishSub: finishSub, finishCheck: finishCheck,
    scoreMock: scoreMock, finishMock: finishMock,
    touchDay: touchDay, checkBadges: checkBadges,
    dueReview: dueReview, laterReview: laterReview, tagsCovered: tagsCovered, weakTags: weakTags, strongTags: strongTags, systemScores: systemScores,
    gateReadiness: gateReadiness, recordReport: recordReport, applyBands: applyBands
  };

  global.Engine = {
    el: el, esc: esc, shuffle: shuffle, norm: norm, today: today, daysBetween: daysBetween,
    stripTags: stripTags,
    mount: mount, TYPE_LABEL: TYPE_LABEL, Bank: Bank, art: artSvg, artBand: artBand, ART: ART,
    PASS_SUB: PASS_SUB, PASS_CHECK: PASS_CHECK, SPEED_MS: SPEED_MS, XP_SPEED: XP_SPEED,
    Progress: Progress
  };
})(window);
