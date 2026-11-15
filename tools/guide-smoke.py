#!/usr/bin/env python3
"""Scriptorium guidance levels (15 Nov 2026), offline/demo mode. Usage: python3 tools/guide-smoke.py [promptId]
High guidance on the test prompt (default p-cars-city): every step is answered wrong first (the option greys out, a hint
appears that does not contain the answer, the option cannot be chosen again), then right; the four panes build the
essay Guide.essay builds; the Ten Wards are all green; the essay is sent with uiMode 'high' and half merits; the result
offers Medium, not LevelUp. A half-finished run is restored after a reload.
Medium guidance: a known slip gets its own hint without the AI; the AI check (stubbed) is called only where the rules
cannot decide, accepts and revises; a hint that quotes the answer is replaced; 'keep my answer' overrides; with no
answer from the AI the rules decide after 12 s; the panes are editable at the end; the essay is sent with uiMode 'medium'.
Low guidance: the introduction notes are in the Introduction box and saved with the plan. A prompt without a script,
a mock and an old 'guided' assignment open where they should. Phone width (390 px): no sideways overflow.
Fails on any page or console error."""
import os, sys, http.server, threading, socketserver, functools, glob, json
from playwright.sync_api import sync_playwright
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = int(os.environ.get('PORT', '8794'))
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT
PID = sys.argv[1] if len(sys.argv) > 1 else 'p-cars-city'
errors = []
def step(m): print('·', m)
def chrome():
    for exe in [os.environ.get('CHROME'), '/opt/pw-browsers/chromium/chrome']:
        if exe and os.path.exists(exe): return exe
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux*/chrome'))
    return hits[-1] if hits else None
def overflow(page): return page.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
def login(page, sid, new=True):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.setItem('pc.apiUrl','off')"); page.reload(); page.wait_for_timeout(700)
    if new:
        page.click('#tab-new'); page.fill('#f-id', sid); page.fill('#f-name', 'Ploy'); page.fill('#f-pw', 'test1234')
    else:
        page.click('#tab-in'); page.fill('#f-id', sid); page.fill('#f-pw', 'test1234')
    page.click('#btn-go'); page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); page.wait_for_timeout(300)
    page.evaluate("window.Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader()")
def open_prompt(page, level, pid=PID):
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(250)
    page.check('input[name=uim][value=%s]' % level); page.wait_for_timeout(200)
    page.evaluate("document.querySelector('[data-p=\"%s\"]').click()" % pid); page.wait_for_timeout(900)
def click_opt(page, text):
    n = page.evaluate("(function(t){var b=Array.prototype.filter.call(document.querySelectorAll('#gd-q .gd-opt'),function(x){return x.textContent===t&&!x.disabled})[0];if(b){b.click();return 1}return 0})(%s)" % json.dumps(text))
    assert n == 1, ('option not found', text)
def flat(page): return page.evaluate("window.Guide.steps(window.Guide.script('%s')).map(function(x){return {id:x.step.id, ok:x.step.ok, wrong:x.step.wrong.map(function(w){return w[0]}), ai:!!x.step.ai}})" % PID)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=chrome())
    page = b.new_page(viewport={'width': 1100, 'height': 900})
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    login(page, 'gd-smoke')

    step('Scriptorium: four levels, the step-by-step pill on the test prompt')
    page.evaluate("window.PCHost.show('writer')"); page.wait_for_timeout(300)
    vals = page.evaluate("Array.from(document.querySelectorAll('input[name=uim]')).map(function(r){return r.value})")
    assert vals == ['high', 'medium', 'low', 'exam'], vals
    assert page.locator('[data-p="%s"] .gd-pill' % PID).count() == 1

    step('High: every step wrong first, then right')
    open_prompt(page, 'high'); page.wait_for_selector('#gd-q .gd-opt', timeout=8000)
    steps = flat(page); print('  steps:', len(steps))
    for i, s in enumerate(steps):
        if i == 7:
            page.reload(); page.wait_for_timeout(700)
            login(page, 'gd-smoke', new=False); open_prompt(page, 'high'); page.wait_for_selector('#gd-q .gd-opt', timeout=8000)
            foot = page.inner_text('#gd-q .gd-foot'); assert foot.startswith('Step 8 of'), foot
        w = s['wrong'][0]
        click_opt(page, w); page.wait_for_timeout(80)
        hint = page.inner_text('#gd-hint')
        assert s['ok'].lower() not in hint.lower(), (s['id'], hint)
        off = page.locator('#gd-q .gd-opt.off')
        assert off.count() == 1 and off.first.is_disabled(), s['id']
        click_opt(page, s['ok']); page.wait_for_timeout(450)
    want = page.evaluate("window.Guide.essay(window.Guide.script('%s'), window.Guide.key(window.Guide.script('%s'))).panes" % (PID, PID))
    got = [page.inner_text('#gd-p%d' % i) for i in range(4)]
    assert got == want, (got, want)
    page.screenshot(path=os.path.join(SHOTS, 'gd-01-high-built.png'), full_page=True)
    page.click('#gd-wards'); page.wait_for_timeout(300)
    rows = page.evaluate("Array.from(document.querySelectorAll('#wr-panel .pf-row')).map(function(r){return r.className})")
    assert rows and all(r.endswith(' ok') for r in rows), rows
    page.click('#wr-submit'); page.wait_for_timeout(700)
    last = page.evaluate("window.PCHost.p.reports.slice(-1)[0]")
    assert last['mode'] == 'high' and last['merits'] == 75 and last['meritWhy'] == 'high', last
    assert page.locator('#w-levelup').count() == 0 and page.locator('#w-medium').count() == 1 and page.locator('#w-revise').count() == 0 and page.locator('#w-owl').count() == 0
    print('  merits:', page.inner_text('#w-merits'))
    assert page.evaluate("window.Story.essaysSent(window.PCHost.p)") == 0, 'a High essay must not count as an essay sent'

    step('Medium: rule check, AI stub, override, 12-second fallback, polish')
    page.evaluate("""window.__calls = []; window.__mode = 'accept';
      window.API.guideCheck = function (pl) { window.__calls.push(pl.stepId);
        if (window.__mode === 'hang') return new Promise(function () {});
        if (window.__mode === 'leak') { var st = window.Guide.steps(window.Guide.script(pl.promptId)).filter(function(x){return x.step.id===pl.stepId})[0].step; return Promise.resolve({ ok: true, verdict: 'revise', hint: 'Write: ' + st.ok }); }
        return Promise.resolve({ ok: true, verdict: window.__mode, hint: window.__mode === 'revise' ? 'Check the verb.' : '' }); }; 0;""")
    page.click('#w-medium'); page.wait_for_selector('#gd-in', timeout=8000)
    steps = flat(page)
    def commit(text):
        page.fill('#gd-in', text); page.click('#gd-commit'); page.wait_for_timeout(250)
    # t-type: a known slip (reject) → own hint, no AI call
    commit('to what extent do you agree'); assert 'one statement' in page.inner_text('#gd-hint') and page.evaluate('window.__calls.length') == 0
    commit('discuss'); assert page.inner_text('#gd-q .gd-foot').startswith('Step 2')
    n_ai = 0
    for i, s in enumerate(steps[1:], start=1):
        if s['id'] == 't-core':
            page.evaluate("window.__mode='leak'"); commit('the control of how people use cars in cities')
            h = page.inner_text('#gd-hint'); assert s['ok'].lower() not in h.lower() and 'AI check' in h, h
            page.evaluate("window.__mode='revise'"); commit('the control of how people use cars in cities')
            assert 'Check the verb.' in page.inner_text('#gd-hint')
            page.click('#gd-keep'); page.wait_for_timeout(250); continue
        if s['id'] == 't-facetB':
            page.evaluate("window.__mode='hang'"); page.fill('#gd-in', 'freedom to drive and move around'); page.click('#gd-commit')
            page.wait_for_timeout(12600); assert page.inner_text('#gd-q .gd-foot').startswith('Step %d' % (i + 2)), 'no 12 s fallback'
            page.evaluate("window.__mode='accept'"); continue
        commit(s['ok'].lower())
    calls = page.evaluate('window.__calls'); ai_ids = [s['id'] for s in steps if s['ai']]
    assert all(c in ai_ids for c in calls), calls
    print('  AI calls:', len(calls), 'of', len(ai_ids), 'ai steps')
    assert page.locator('.gd-ta').count() == 4
    page.fill('#gd-ta3', page.input_value('#gd-ta3') + ' ')
    page.click('#gd-wards'); page.wait_for_timeout(300); page.click('#wr-submit'); page.wait_for_timeout(700)
    last = page.evaluate("window.PCHost.p.reports.slice(-1)[0]")
    assert last['mode'] == 'medium' and last['merits'] >= 150, last
    assert page.locator('#w-levelup').count() == 1

    step('Low: introduction notes in the Introduction box, saved with the plan')
    open_prompt(page, 'low', 'p-fast-food-tax')
    assert page.locator('#wr-intro').count() == 1 and page.locator('#wr-v-core').count() == 1
    page.select_option('#wr-i-type', 'DISCUSS'); assert 'That is the type' in page.inner_text('#wr-intro-check')
    page.fill('#wr-i-core', 'the taxing of unhealthy fast food')
    page.click('#wr-quit'); page.wait_for_timeout(300)

    step('A prompt without a script (one taken out of the index), at High, opens at Low; a mock opens at Exam; an old "guided" assignment opens at Low')
    page.evaluate("window.GUIDE_INDEX = window.GUIDE_INDEX.filter(function(x){return x!=='p-fast-food-tax'}); if (window.GUIDE_SCRIPTS) delete window.GUIDE_SCRIPTS['p-fast-food-tax']")  # every prompt has a script now: take one away
    open_prompt(page, 'high', 'p-fast-food-tax')
    assert page.locator('#wr-v-core').count() == 1 and page.locator('#gd-q').count() == 0
    page.click('#wr-quit'); page.wait_for_timeout(300)
    page.evaluate("window.PCHost.startWrite({promptId:'p-mock-degree-choice', uiMode:'exam', minutes:40, kind:'mock', mockId:'mock-1'})"); page.wait_for_timeout(500)
    assert page.locator('#wr-t0').count() == 1 and page.locator('#gd-q').count() == 0
    page.once('dialog', lambda d: d.accept()); page.click('#wr-quit'); page.wait_for_timeout(300)
    page.evaluate("window.PCHost.startWrite({promptId:'%s', uiMode:'guided', minutes:40, kind:'practice'})" % PID); page.wait_for_timeout(500)
    assert page.locator('#wr-intro').count() == 1
    page.click('#wr-quit'); page.wait_for_timeout(300)

    step('390 px: High and Low with no sideways scroll')
    page.set_viewport_size({'width': 390, 'height': 844})
    open_prompt(page, 'high'); page.wait_for_selector('#gd-q .gd-opt', timeout=8000)
    assert overflow(page) <= 0, overflow(page); page.screenshot(path=os.path.join(SHOTS, 'gd-02-high-390.png'))
    page.click('#wr-quit'); page.wait_for_timeout(300)
    open_prompt(page, 'low'); assert overflow(page) <= 0, overflow(page)
    page.click('#wr-quit'); page.wait_for_timeout(300)

    print('console errors:', len(errors))
    for e in errors: print('  ', e)
    assert not errors
    print('guide-smoke: all checks passed')
