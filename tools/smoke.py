#!/usr/bin/env python3
"""Headless end-to-end smoke test for Position Control (offline/demo mode).
Usage: python3 tools/smoke.py   (needs Playwright + Chromium). Screenshots land in tools/shots/."""
import os, sys, http.server, threading, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = 8765

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
Handler = functools.partial(Quiet, directory=ROOT)
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT

errors = []
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, name + '.png'), full_page=True)
def step(msg): print('·', msg)

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium/chrome' if os.path.exists('/opt/pw-browsers/chromium/chrome') else None)
    ctx = b.new_context(viewport={'width': 1100, 'height': 900})
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))

    step('student: create account')
    page.goto(BASE + 'index.html'); page.wait_for_timeout(600)
    page.evaluate("localStorage.setItem('pc.apiUrl','off')"); page.reload(); page.wait_for_timeout(600)
    page.click('#tab-new'); page.fill('#f-id', 'smoke-01'); page.fill('#f-name', 'Ploy'); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000); shot(page, '01-plan')
    assert page.inner_text('#hdr-name') == 'Ploy'
    n = page.evaluate("window.CONTENT.TOPICS.length"); assert n == 14, n
    items = page.evaluate("Object.keys(window.Engine.Bank.all()).length"); print('  items in bank:', items)

    step('modules: open m01 s1 and answer every question')
    page.click('.nav button[data-view=map]'); page.wait_for_timeout(300); shot(page, '02-modules')
    page.evaluate("document.querySelector('[data-sys=m01]').click()"); page.wait_for_timeout(200)
    page.click('#view-map [data-sub=m01s1]'); page.wait_for_timeout(300); shot(page, '03-theory')
    page.click('#p-start'); page.wait_for_timeout(300)
    for i in range(7):
        t = page.get_attribute('#qhost', 'data-type')
        if t in ('choose', 'judge', 'select'):
            opts = page.query_selector_all('#qhost .opt'); opts[0].click()
            if t == 'select':
                for o in opts[1:]:
                    if page.is_enabled('#p-check'): break
                    o.click()
        elif t == 'spot': page.query_selector_all('#qhost .seg')[0].click()
        elif t == 'sort':
            chips = page.query_selector_all('#qhost .chip-i'); bins = page.query_selector_all('#qhost .sort-bin')
            for c in chips: c.click(); bins[0].query_selector('.sort-h').click()
        elif t == 'build':
            for tile in page.query_selector_all('#qhost .tiles .tile'): tile.click()
        elif t == 'order':
            for r in page.query_selector_all('#qhost .rank-pool .rank'): r.click()
        elif t in ('thesis', 'bodypara', 'rewrite'):
            page.fill('#qhost textarea', 'I believe that governments should act because this policy works by reducing costs, for example in Bangkok, although it has limits. ' * 2)
        page.wait_for_timeout(100)
        assert page.is_enabled('#p-check'), 'check button not enabled for type ' + str(t)
        page.click('#p-check'); page.wait_for_timeout(150); page.click('#p-check'); page.wait_for_timeout(150)
    page.wait_for_selector('.result', timeout=5000); shot(page, '04-result')

    step('bootcamp: run a mission to the end')
    page.click('.nav button[data-view=bootcamp]'); page.wait_for_timeout(300); shot(page, '05-bootcamp')
    page.click('[data-bc=p-cars-city]'); page.wait_for_timeout(300)
    for s in range(8):
        qids = [q.get_attribute('data-q') for q in page.query_selector_all('.bc-q')]
        for qid in qids:
            for oi in range(8):
                q = page.query_selector('[data-q="%s"]' % qid)
                if q.query_selector('.bc-why'): break
                sel = q.query_selector('.bc-sel')
                if sel.is_disabled(): break
                if oi >= len(q.query_selector_all('option')) - 1: break
                try: sel.select_option(str(oi))
                except Exception: continue
                btn = q.query_selector('[data-check]')
                if btn: btn.click(); page.wait_for_timeout(60)
        assert page.is_enabled('#bc-next'), 'bootcamp step %d not complete' % s
        if s == 3: shot(page, '06-bootcamp-matrix')
        page.click('#bc-next'); page.wait_for_timeout(200)
        if page.query_selector('#bc-back'): break
    page.wait_for_selector('#bc-back', timeout=3000); shot(page, '07-bootcamp-done')

    step('writer: guided essay with the matrix, fill frames, pre-flight, submit')
    page.click('.nav button[data-view=writer]'); page.wait_for_timeout(300); shot(page, '08-writer-home')
    page.click('[data-p=p-tourism]'); page.wait_for_timeout(400)
    vars_ = page.evaluate("(function(){var p=window.Prompts.get('p-tourism'),o={};Object.keys(p.vars.B2).forEach(function(k){o[k]=p.vars.B2[k].ok});return o;})()")
    for k, v in vars_.items(): page.fill('#wr-v-' + k, v)
    page.once('dialog', lambda d: d.accept())
    page.click('#wr-fill'); page.wait_for_timeout(300); shot(page, '09-writer-filled')
    wc = page.inner_text('#wr-words'); print('  words after fill:', wc)
    page.click('#wr-check'); page.wait_for_selector('#wr-submit', timeout=4000); shot(page, '10-preflight')
    page.click('#wr-submit'); page.wait_for_selector('#w-levelup', timeout=4000); shot(page, '11-submitted')
    reps = page.evaluate("JSON.parse(localStorage.getItem('pc.local.v1')).reports.length"); assert reps == 1, reps

    step('template workshop and models')
    page.click('.nav button[data-view=template]'); page.wait_for_timeout(300); shot(page, '12-template')
    page.click('.nav button[data-view=models]'); page.wait_for_timeout(300)
    page.click('[data-m=m-cars-city]'); page.wait_for_timeout(300); shot(page, '13-model')
    page.click('[data-mm=dissect]'); page.wait_for_timeout(200)
    page.click('[data-role=intro][data-i="0"]'); page.wait_for_timeout(100)
    assert '1 of 4' in page.inner_text('#m-score')
    page.click('[data-mm=contrast]'); page.wait_for_timeout(200); shot(page, '14-contrast')

    step('record and settings')
    page.click('.nav button[data-view=record]'); page.wait_for_timeout(500); shot(page, '15-record')
    page.click('.nav button[data-view=settings]'); page.wait_for_timeout(200)
    page.evaluate("document.getElementById('modal-slot').innerHTML=''")
    page.click('[data-tier-set=C1]'); page.wait_for_timeout(300)
    print('  rank line:', page.inner_text('#hdr-rank'))
    assert 'BAND 8' in page.inner_text('#hdr-rank').upper()

    step('mobile viewport: writer usable at 375px')
    m = ctx.new_page(); m.set_viewport_size({'width': 375, 'height': 800})
    m.on('pageerror', lambda e: errors.append('mobile ' + str(e)))
    m.goto(BASE + 'index.html#writer'); m.wait_for_timeout(500)
    m.click('#tab-in'); m.fill('#f-id', 'smoke-01'); m.fill('#f-pw', 'test1234'); m.click('#btn-go'); m.wait_for_selector('#screen-app:not(.hidden)', timeout=8000)
    m.click('.nav button[data-view=writer]'); m.wait_for_timeout(300); m.click('[data-p=p-teen-jobs]'); m.wait_for_timeout(400); shot(m, '16-mobile-writer')
    sw = m.evaluate("document.documentElement.scrollWidth"); assert sw <= 380, 'horizontal overflow: %d' % sw
    m.close()

    step('teacher: sign in, roster, marking queue, mark and release, assignment')
    t = ctx.new_page()
    t.on('console', lambda mm: errors.append('teacher ' + mm.text) if mm.type == 'error' else None)
    t.on('pageerror', lambda e: errors.append('teacher ' + str(e)))
    t.goto(BASE + 'teacher.html'); t.wait_for_timeout(500)
    t.fill('#pin', '1234'); t.fill('#url', ''); t.click('#gate-go'); t.wait_for_selector('#app:not(.hidden)', timeout=6000); t.wait_for_timeout(600); shot(t, '20-flightdeck')
    assert 'Ploy' in t.inner_text('#roster')
    t.click('tr.r'); t.wait_for_timeout(500); shot(t, '21-student')
    t.click('.tnav button[data-view=marking]'); t.wait_for_timeout(400)
    t.click('[data-mk]'); t.wait_for_timeout(400); shot(t, '22-marking')
    for k in ('tr', 'cc', 'lr', 'gra'): t.select_option('#mk-' + k, '7')
    t.fill('#mk-comment', 'Ploy, a clear position from the first line! Your writing is around B2 level.')
    t.click('#mk-release'); t.wait_for_timeout(400)
    assert '7.0' in t.inner_text('#mk-detail')
    t.click('.tnav button[data-view=assign]'); t.wait_for_timeout(300)
    t.fill('#a-title', 'Week 8 — discuss both views'); t.click('#a-set'); t.wait_for_timeout(300); shot(t, '23-assign')
    assert 'Week 8' in t.inner_text('#a-list')
    t.click('.tnav button[data-view=projector]'); t.wait_for_timeout(300); t.click('#pj-go'); t.wait_for_timeout(500); shot(t, '24-projector')
    code = t.inner_text('.projcode').strip(); print('  projector round', code)

    step('student sees the released band and the assignment; joins the live round')
    page.click('.nav button[data-view=record]'); page.wait_for_timeout(600)
    assert '7.0' in page.inner_text('#rec-list'); shot(page, '17-record-marked')
    page.click('.nav button[data-view=plan]'); page.wait_for_timeout(900)
    assert 'Week 8' in page.inner_text('#view-plan')
    page.click('.nav button[data-view=writer]'); page.wait_for_timeout(200); page.click('#w-live'); page.wait_for_timeout(200)
    page.fill('#lv-code', code); page.fill('#lv-team', 'Team Blue'); page.click('#lv-join'); page.wait_for_timeout(400)
    page.fill('#lv-text', 'I believe that visitor fees should fund local conservation.'); page.click('#lv-post'); page.wait_for_timeout(400)
    t.wait_for_timeout(4500); shot(t, '25-projector-posts')
    assert 'visitor fees' in t.inner_text('#pj-posts')

    b.close()
httpd.shutdown()
print('console errors:', len(errors))
for e in errors: print('  ', e[:200])
sys.exit(1 if errors else 0)
