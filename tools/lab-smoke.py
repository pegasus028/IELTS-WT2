#!/usr/bin/env python3
"""End-to-end test of the Template Lab (Playwright + Chromium).

  python3 tools/lab-smoke.py          demo mode (no server): quick checks only
  python3 tools/lab-smoke.py --mock   cloud mode against a mocked Apps Script that
                                      answers lab.* with canned AI coaching

Builds a 14-line blueprint, saves it, fills all eleven variables for one prompt,
finishes the run, opens the Scorecard, then repeats a 2-minute run to check the
timer and a revision. Screenshots land in tools/shots/lab-*.png.
"""
import os, sys, json, http.server, threading, socketserver, functools, re
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = 8766
MOCK = '--mock' in sys.argv

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
Handler = functools.partial(Quiet, directory=ROOT)
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT
MOCK_URL = 'https://mock.lab.test/exec'

LINES = {
    'i-open': 'Few questions divide policymakers as sharply as [Core Topic].',
    'i-sides': 'Supporters stress [Facet A], yet opponents warn about [Facet B].',
    'i-position': 'I would argue that [Position].',
    'a-topic': 'The case for one side rests largely on [Facet A].',
    'a-mech': 'This happens through [Mechanism A].',
    'a-example': 'A telling case is [Example A].',
    'a-nuance': 'Even so, this argument has a blind spot: [Nuance A].',
    'b-topic': 'Weighing just as heavily is [Facet B].',
    'b-mech': 'The logic here is that [Mechanism B].',
    'b-example': '[Example B] shows this in practice.',
    'b-nuance': 'Yet this view also has limits, because [Nuance B].',
    'c-open': 'Overall, [Core Topic] cannot be settled by looking at one side.',
    'c-position': 'The sounder view, then, is that [Position].',
    'c-rationale': 'The reason is simple: [Rationale].',
}
VARS = {
    'core': ('the question of banning private cars from city centres', 'limiting cars in urban cores'),
    'facetA': ('the need to cut the pollution that cars bring into crowded streets', 'cleaner urban air'),
    'facetB': ('the freedom of individuals to travel as they choose', 'personal mobility'),
    'position': ('cities should restrict private cars in their busiest districts while keeping them available elsewhere', 'targeted limits on cars in the busiest districts are the fairest answer'),
    'mechA': ('removing thousands of exhaust pipes from the places where people walk, shop and breathe', ''),
    'exA': ("the car-free zones that several European capitals have introduced around their historic centres", ''),
    'nuanceA': ('a ban can simply push traffic and pollution into the surrounding neighbourhoods', ''),
    'mechB': ('people who live far from public transport depend on a car to reach work, school and hospitals', ''),
    'exB': ('In my own city, Bangkok, the many families who live beyond the reach of the BTS and MRT', ''),
    'nuanceB': ('this freedom has a cost that everyone else pays in dirty air and blocked roads', ''),
    'rationale': ('a policy should protect public health without cutting people off from essential journeys', ''),
}

errors = []
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, 'lab-' + name + '.png'), full_page=True)
def step(msg): print('·', msg, flush=True)

def mock_handler(route):
    req = route.request
    try: body = json.loads(req.post_data or '{}')
    except Exception: body = {}
    a, p = body.get('action'), body.get('payload') or {}
    out = {'ok': True}
    if a in ('register', 'login'):
        out.update({'token': 'tok123', 'progress': {'studentId': p.get('id'), 'displayName': p.get('name') or p.get('id'), 'xp': 0, 'tier': 'C1'}})
    elif a == 'assignments': out['assignments'] = []
    elif a == 'lab.status': out.update({'ai': True, 'models': {'coach': 'mock', 'rate': 'mock'}})
    elif a == 'lab.list': out.update({'templates': [], 'attempts': []})
    elif a == 'lab.coach':
        assert p.get('token') == 'tok123', 'token missing on lab.coach'
        if p.get('kind') == 'frame':
            line = p.get('line', '')
            errs = [{'original': 'policymakers', 'correction': 'policy-makers', 'type': 'spelling', 'explain': 'Mock error to test the list.'}] if 'policymakers' in line else []
            out['coach'] = {'errors': errs, 'fn': {'verdict': 'meets', 'comment': 'The line does its job.'}, 'generic': {'ok': True, 'note': ''},
                            'slotForm': 'Mechanism A must be a noun phrase after "through".' if 'Mechanism A' in line else '', 'cefr': 'C1', 'band': 7.5,
                            'tip': 'Keep it this short.', 'praise': 'Neutral and reusable.'}
        else:
            out['coach'] = {'errors': [], 'fn': {'verdict': 'meets' if len(p.get('value', '')) > 25 else 'partly', 'comment': 'Relevant to the prompt.'},
                            'relevance': {'ok': True, 'note': ''}, 'fit': {'ok': True, 'note': ''}, 'cefr': 'C1', 'band': 7.0, 'tip': 'Add one precise detail.', 'praise': 'Clear.'}
    elif a == 'lab.rate':
        assert len(p.get('essay', '')) > 200, 'essay too short in lab.rate'
        out['rating'] = {'tr': 7, 'cc': 7.5, 'lr': 7, 'gra': 7, 'cefr': 'C1', 'summary': 'A clear, balanced essay with a visible frame.',
                         'strengths': ['Position stated early', 'Specific Bangkok example'], 'priorities': [{'crit': 'LR', 'text': 'Vary the frame phrases.'}], 'frameNote': 'The frame is noticeable in the introduction.'}
    route.fulfill(status=200, content_type='application/json', body=json.dumps(out))

with sync_playwright() as pw:
    exe = '/opt/pw-browsers/chromium/chrome' if os.path.exists('/opt/pw-browsers/chromium/chrome') else None
    b = pw.chromium.launch(executable_path=exe) if exe else pw.chromium.launch()
    ctx = b.new_context(viewport={'width': 1100, 'height': 900})
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    if MOCK: page.route(re.compile(r'https://mock\.lab\.test/.*'), mock_handler)

    step('sign in (%s)' % ('mocked cloud' if MOCK else 'demo'))
    page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
    page.evaluate("localStorage.clear(); localStorage.setItem('pc.apiUrl', %s)" % json.dumps(MOCK_URL if MOCK else 'off')); page.reload(); page.wait_for_timeout(600)
    page.click('#tab-new'); page.fill('#f-id', 'lab-01'); page.fill('#f-name', 'Ploy'); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=10000)
    page.evaluate("document.getElementById('modal-slot').innerHTML=''")

    step('open the Template Lab')
    page.click('.nav button[data-view=lab]'); page.wait_for_selector('#view-lab .lab', timeout=5000); page.wait_for_timeout(600)
    pill = page.inner_text('.lab-ai .pill'); print('  coach status:', pill)
    assert ('online' in pill) == MOCK, pill
    shot(page, '01-studio')

    step('set up a 40% C1 blueprint')
    page.click('#lab-new'); page.wait_for_selector('.lab-pcts')
    page.click('label.lab-pct:has(input[value="40"])'); page.click('[data-lv=C1]'); shot(page, '02-setup')
    page.click('#lab-startbuild'); page.wait_for_selector('#lab-line')

    step('write and coach all 14 lines')
    for i, (cid, line) in enumerate(LINES.items()):
        page.fill('#lab-line', line)
        page.click('#lab-coach'); page.wait_for_selector('#lab-fb .lab-fb', timeout=15000)
        if i == 0: shot(page, '03-line-feedback')
        txt = page.inner_text('#lab-fb')
        if 'Fix this first' in txt: print('  BLOCKED', cid, txt); raise SystemExit(1)
        if i == 4: print('  line 5 feedback:', txt.replace('\n', ' | ')[:300])
        if i < 13: page.click('#lab-next'); page.wait_for_timeout(120)
    page.click('#lab-finishbp'); page.wait_for_selector('#lab-save'); shot(page, '04-summary')
    page.click('#lab-save'); page.wait_for_timeout(1200)
    modal = page.query_selector('#modal-slot .modal-card')
    if modal: print('  award:', modal.inner_text().split('\n')[1:3]); page.evaluate("document.getElementById('modal-slot').innerHTML=''")
    st = page.evaluate("(function(){var s=window.Lab._state;return {n:s.data.templates.length,status:s.data.templates[0].status,pts:window.PCHost.p.lab.points}})()")
    print('  template saved:', st); assert st['status'] == 'complete'

    step('assembly: untimed run on the city-cars prompt')
    page.click('#lab-suse'); page.wait_for_selector('#lab-tsel')
    page.click('label.lab-timing:has(input[value="none"])')
    page.click('[data-pp="p-cars-city"]'); page.wait_for_selector('#lab-val')
    order = page.evaluate("window.Lab._state.run.order"); print('  slot order:', order)
    for i, k in enumerate(order):
        v1, v2 = VARS[k]
        page.fill('#lab-val', v1)
        if page.query_selector('#lab-val2'): page.fill('#lab-val2', v2)
        page.click('#lab-vcoach'); page.wait_for_selector('#lab-fb .lab-fb', timeout=15000)
        if i == 0: shot(page, '05-var-feedback')
        if i == 3:
            page.click('#lab-model'); page.wait_for_timeout(100)
        if i < len(order) - 1: page.click('#lab-vnext'); page.wait_for_timeout(120)
    page.click('#lab-vfinish'); page.wait_for_selector('.lab-result .lab-kpis', timeout=20000); page.wait_for_timeout(800)
    shot(page, '06-finish')
    a = page.evaluate("(function(){var a=window.Lab._state.data.attempts[0];return {status:a.status,words:a.words,share:a.share,rating:a.rating,points:a.points,essay:a.essay}})()")
    print('  run:', {k: a[k] for k in ('status', 'words', 'share', 'points')}); print('  rating:', a['rating'])
    print('  ---\n' + a['essay'] + '\n  ---')
    assert a['status'] == 'complete' and a['words'] > 200
    assert '[' not in a['essay'], 'unfilled slot left in essay'
    if MOCK: assert a['rating'] and a['rating']['overall'] == 7.0, a['rating']

    step('revise as version 2')
    page.click('#lab-revise'); page.wait_for_selector('#lab-val')
    order = page.evaluate("window.Lab._state.run.order")
    for i, k in enumerate(order):
        page.click('#lab-vcoach'); page.wait_for_selector('#lab-fb .lab-fb', timeout=15000)
        if i < len(order) - 1: page.click('#lab-vnext'); page.wait_for_timeout(80)
    page.click('#lab-vfinish'); page.wait_for_selector('.lab-result .lab-kpis', timeout=20000); page.wait_for_timeout(800)
    v2 = page.evaluate("(function(){var l=window.Lab._state.data.attempts;return l.map(function(a){return [a.version,a.status,a.points&&a.points.total]})})()"); print('  versions:', v2)
    assert any(x[0] == 2 and x[1] == 'complete' for x in v2)

    step('2-minute run: let one card time out')
    page.click('#lab-again'); page.wait_for_selector('#lab-tsel')
    page.click('label.lab-timing:has(input[value="2min"])')
    page.click('[data-pp="p-screen-time"]') if page.query_selector('[data-pp="p-screen-time"]') else page.query_selector_all('[data-pp]')[1].click()
    page.wait_for_selector('#lab-val')
    page.evaluate("window.Lab._state.run.cardElapsed = 119")
    page.wait_for_selector('#lab-fb .lab-fb', timeout=8000)
    t = page.inner_text('#lab-fb'); assert 'Timed out' in t or 'Time ran out' in t, t
    shot(page, '07-timeout')
    page.click('#lab-rquit'); page.wait_for_timeout(300)

    step('scorecard')
    page.click('[data-ltab=score]'); page.wait_for_selector('.lab-tbl'); page.wait_for_timeout(300); shot(page, '08-scorecard')
    rows = page.evaluate("Array.prototype.map.call(document.querySelectorAll('.lab-tbl')[0].querySelectorAll('tbody tr'), function(r){return r.innerText.replace(/\\s+/g,' ')})"); print('  per-share:', rows)
    page.click('.lab-histrow'); page.wait_for_selector('.lab-result'); shot(page, '09-review')

    step('phone width + dark theme')
    page.set_viewport_size({'width': 375, 'height': 800}); page.click('#lab-rback'); page.wait_for_timeout(200); shot(page, '10-scorecard-375')
    over = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"); print('  horizontal overflow at 375px:', over)
    page.click('[data-ltab=studio]'); page.wait_for_timeout(200)
    page.click('[data-tver]'); page.wait_for_selector('#lab-line'); shot(page, '11-builder-375')
    over2 = page.evaluate("document.documentElement.scrollWidth > window.innerWidth + 1"); print('  horizontal overflow (builder):', over2)
    page.evaluate("document.documentElement.setAttribute('data-theme','dark')"); page.set_viewport_size({'width': 1100, 'height': 900})
    page.click('[data-ltab=score]'); page.wait_for_timeout(300); shot(page, '12-scorecard-dark')
    b.close()

httpd.shutdown()
print('console errors:', len(errors))
for e in errors[:10]: print('  !', e)
sys.exit(1 if errors else 0)
