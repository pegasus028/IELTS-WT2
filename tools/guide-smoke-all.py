#!/usr/bin/env python3
"""Every script in guide-index.js, in the browser at High guidance (15 Nov 2026). Usage: python3 tools/guide-smoke-all.py [promptId ...]
For each prompt: open it from the Scriptorium at High; the step-by-step guide loads on demand; answer every step with its
right option (the first wrong option on every fourth step first: it greys out and its hint does not contain the answer);
the four panes equal Guide.essay; the Ten Wards are all green; the run is not sent (nothing is written). Fails on any page
or console error. The detailed flow (Medium, resume, fallbacks) is tools/guide-smoke.py on p-cars-city."""
import os, sys, http.server, threading, socketserver, functools, glob, json
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PORT = int(os.environ.get('PORT', '8795'))
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT
errors = []
def chrome():
    for exe in [os.environ.get('CHROME'), '/opt/pw-browsers/chromium/chrome']:
        if exe and os.path.exists(exe): return exe
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome'))
    return hits[-1] if hits else None
with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome())
    page = b.new_page(viewport={'width': 1100, 'height': 900})
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('pc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    page.click('#tab-new'); page.fill('#f-id', 'gd-all'); page.fill('#f-name', 'Ploy'); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000)
    page.evaluate("window.Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader()")
    ids = sys.argv[1:] or page.evaluate('window.GUIDE_INDEX')
    for pid in ids:
        page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(200)
        page.check('input[name=uim][value=high]'); page.wait_for_timeout(150)
        assert page.locator('[data-p="%s"] .gd-pill' % pid).count() == 1, (pid, 'no step-by-step pill')
        page.evaluate("document.querySelector('[data-p=\"%s\"]').click()" % pid)
        page.wait_for_selector('#gd-q .gd-opt', timeout=8000)
        steps = page.evaluate("window.Guide.steps(window.Guide.script('%s')).map(function(x){return {id:x.step.id, ok:x.step.ok, w:x.step.wrong[0][0]}})" % pid)
        for i, s in enumerate(steps):
            def click(t):
                n = page.evaluate("(function(t){var b=Array.prototype.filter.call(document.querySelectorAll('#gd-q .gd-opt'),function(x){return x.textContent===t&&!x.disabled})[0];if(b){b.click();return 1}return 0})(%s)" % json.dumps(t))
                assert n == 1, (pid, s['id'], 'option not found', t)
            if i % 4 == 0:
                click(s['w']); page.wait_for_timeout(40)
                h = page.inner_text('#gd-hint'); assert s['ok'].lower() not in h.lower(), (pid, s['id'], h)
            click(s['ok']); page.wait_for_timeout(430)
        want = page.evaluate("window.Guide.essay(window.Guide.script('%s'), window.Guide.key(window.Guide.script('%s'))).panes" % (pid, pid))
        got = [page.inner_text('#gd-p%d' % i) for i in range(4)]
        assert got == want, (pid, got, want)
        page.click('#gd-wards'); page.wait_for_timeout(250)
        rows = page.evaluate("Array.from(document.querySelectorAll('#wr-panel .pf-row')).map(function(r){return r.className})")
        assert rows and all(r.endswith(' ok') for r in rows), (pid, rows)
        print('·', pid, len(steps), 'steps, panes = essay, every Ward green')
        page.click('#wr-quit'); page.wait_for_timeout(250)
        page.evaluate("Object.keys(localStorage).filter(function(k){return k.indexOf('pc.guide.')===0}).forEach(function(k){localStorage.removeItem(k)})")
    print('console errors:', len(errors))
    for e in errors: print('  ', e)
    assert not errors
    print('guide-smoke-all: %d prompt(s) passed' % len(ids))
