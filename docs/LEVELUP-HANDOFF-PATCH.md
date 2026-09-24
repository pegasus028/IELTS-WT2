# LevelUp hand-off patch (one snippet, both consoles)

Position Control sends an essay to LevelUp English in two ways at once, because both apps live on `pegasus028.github.io`:

1. `localStorage.lue_handoff` — a JSON object `{ source:'position-control', ts, studentId, name, cohort, promptId, prompt, essay, reportId, teacher? }` written just before LevelUp opens (same origin, so LevelUp can read it).
2. The URL — `…/LevelUp/?from=pc#pc=<base64 JSON {prompt, essay, name}>` as a fallback (e.g. if the student opens LevelUp on another device from a shared link).

LevelUp currently reads only `?key=` from the URL. Paste the snippet below into **`index.html` and `teacher.html` of the LevelUp repo**, immediately after the existing `boot();` call near the end of the `<script>` (the block that begins `/* ---------------- startup ---------------- */`). It fills `#prompt-text`, `#essay-text` (and `#student-name` when the field exists), fires the word-count update, and clears the hand-off so it is not reused. It does nothing when no hand-off is present, so it is safe on every load.

```js
/* ---- Position Control hand-off (IELTS Task 2 app) --------------------- */
(function () {
  function readHandoff() {
    var h = null;
    try { var m = String(location.hash || '').match(/#pc=([A-Za-z0-9+/=_-]+)/); if (m) h = JSON.parse(decodeURIComponent(escape(atob(m[1].replace(/-/g, '+').replace(/_/g, '/'))))); } catch (e) {}
    if (!h) { try { var raw = localStorage.getItem('lue_handoff'); if (raw) h = JSON.parse(raw); } catch (e) {} }
    return h;
  }
  function apply(h) {
    var p = document.getElementById('prompt-text'), t = document.getElementById('essay-text'), n = document.getElementById('student-name');
    if (!p || !t) return false;
    if (h.prompt) p.value = h.prompt;
    if (h.essay) t.value = h.essay;
    if (n && h.name && !n.value) n.value = h.name + (h.cohort ? ' (' + h.cohort + ')' : '');
    try { t.dispatchEvent(new Event('input', { bubbles: true })); if (typeof updateWC === 'function') updateWC(); } catch (e) {}
    try { localStorage.removeItem('lue_handoff'); } catch (e) {}
    try { history.replaceState({}, document.title, location.pathname + (location.search ? location.search.replace(/[?&]from=pc/, '').replace(/^&/, '?') : '')); } catch (e) {}
    return true;
  }
  var h = readHandoff();
  if (!h || !h.essay) return;
  /* the fields exist only once the assess screen is on; retry for a few seconds */
  var tries = 0, timer = setInterval(function () { if (apply(h) || ++tries > 40) clearInterval(timer); }, 250);
})();
```

Notes

- The essay lands in the same boxes a student or teacher would paste into, so the existing LevelUp flow (level estimate, uplift, batch marking) is unchanged.
- If LevelUp shows the login screen first, the snippet keeps retrying for ten seconds, so the boxes fill as soon as the assess screen appears after sign-in.
- Position Control's Flight Deck opens `teacher.html` for the teacher and `index.html` for students; both get the same snippet.
- The `reportId` in the localStorage payload is the essay's id in Position Control's Reports sheet, in case you later want to write a LevelUp band back into it (the `markReport` action in Code.gs accepts `{ ai: { bands:{tr,cc,lr,gra,overall}, cefr, comment, errors } }`).
