#!/usr/bin/env python3
"""Builds every worked example THROUGH THE APP'S OWN SCREENS (Playwright + Chromium).

  python3 tools/lab-walkthrough.py            all 10 sets (both students, 40 blueprints, 40 runs)
  python3 tools/lab-walkthrough.py B1-PROBLEM one set only
  python3 tools/lab-walkthrough.py --shots    also save the user-manual screenshots

For each student (Nam, B1 · Fah, B2) it signs in, and for each question type:
  1. Blueprint Studio: New blueprint → question type → 60% → level → writes and
     coaches the 14 lines (typing each first draft from the set's coaching record,
     reading the coach's feedback, then the final line) → saves the blueprint;
  2. "Copy at another share" → 50%, then 40%, then 30%: rewrites each copied
     line to the new budget and coaches it again;
  3. Assembly Line: each blueprint on the set's prompt, untimed, all eleven
     variables coached, the essay assembled.
It checks that the essay the app assembles equals the one in examples/*.json,
then exports each student's Lab store to examples/store/<id>.json (the app's
own save format, which can be loaded back into the Lab on any device).
Runs in demo mode (no class server), as the Lab does when the AI coach is off.
"""
import os, sys, json, re, http.server, threading, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
EX = os.path.join(ROOT, 'examples'); STORE = os.path.join(EX, 'store'); os.makedirs(STORE, exist_ok=True)
SHOTS = os.path.join(ROOT, 'docs', 'manual-shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = 8771
WANT = [a for a in sys.argv[1:] if not a.startswith('--')]
TAKE = '--shots' in sys.argv

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT

STUDENTS = {'B1': ('demo-b1-nam', 'Nam (B1 example)'), 'B2': ('demo-b2-fah', 'Fah (B2 example)')}
ORDER = ['DISCUSS', 'OPINION', 'ADVANTAGE', 'PROBLEM', 'TWOPART']
LINE_IDS = ['i-open', 'i-sides', 'i-position', 'a-topic', 'a-mech', 'a-example', 'a-nuance', 'b-topic', 'b-mech', 'b-example', 'b-nuance', 'c-open', 'c-position', 'c-rationale']
errors, shots_taken = [], set()

def step(m): print('·', m, flush=True)
def shot(page, name, sel=None, offset=170):
    """Viewport screenshot (1280×720) with `sel` scrolled to just under the sticky header."""
    if not TAKE or name in shots_taken: return
    shots_taken.add(name)
    if sel:
        page.evaluate("([s,o]) => { var e=document.querySelector(s); if(e){ var y=e.getBoundingClientRect().top+window.scrollY-o; window.scrollTo(0,Math.max(0,y)); } }", [sel, offset])
    page.evaluate("document.getElementById('toast-slot').innerHTML=''")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(SHOTS, name + '.png'))

def close_modal(page):
    page.evaluate("var m=document.getElementById('modal-slot'); if(m) m.innerHTML=''")

def sign_in(page, sid, name):
    page.goto(BASE + 'index.html'); page.wait_for_timeout(400)
    page.evaluate("localStorage.clear(); localStorage.setItem('pc.apiUrl','off')"); page.reload(); page.wait_for_timeout(500)
    page.click('#tab-new'); page.fill('#f-id', sid); page.fill('#f-name', name); page.fill('#f-pw', 'example123'); page.click('#btn-go')
    page.wait_for_selector('#screen-app:not(.hidden)', timeout=10000); close_modal(page)
    # award pop-ups arrive on a timer; clear them as they appear so they never block a click
    page.evaluate("(function(){var m=document.getElementById('modal-slot'); new MutationObserver(function(){ if(m.innerHTML) m.innerHTML=''; }).observe(m,{childList:true});})()")
    page.click('.nav button[data-view=lab]'); page.wait_for_selector('#view-lab .lab', timeout=5000); page.wait_for_timeout(300)

def coach_line(page, text):
    page.fill('#lab-line', text); page.click('#lab-coach'); page.wait_for_selector('#lab-fb .lab-fb', timeout=15000)
    return page.inner_text('#lab-fb')

def build_blueprint(page, s, pct, src_id, coaching, first_ever):
    lines = s['blueprints'][pct]['lines']
    page.click('[data-ltab=studio]'); page.wait_for_timeout(150)
    if src_id is None:
        page.click('#lab-new'); page.wait_for_selector('.lab-types')
        page.click('[data-lv=%s]' % s['level'])
        # Oct 2026: typed blueprints open only at the C1/C2 target; below that the example is rebuilt on the Universal Spine
        if page.is_enabled('[data-bt=%s]' % s['type']): page.click('[data-bt=%s]' % s['type'])
        else: page.click('[data-bt=""]')
        page.click('label.lab-pct:has(input[value="%s"])' % pct)
        if first_ever: shot(page, '02-setup-type', '.lab-types', 260); shot(page, '03-setup-share', '.lab-pcts', 250); shot(page, '03b-setup-level', '.lab-levels', 300)
    else:
        page.click('[data-tcopy="%s"]' % src_id); page.wait_for_selector('.lab-copynote')
        page.click('label.lab-pct:has(input[value="%s"])' % pct)
        if first_ever: shot(page, '08-copy-at-share', '.lab-copynote', 190)
    page.click('#lab-startbuild'); page.wait_for_selector('#lab-line')
    for i, lid in enumerate(LINE_IDS):
        for c in [c for c in coaching if c['share'] == pct and c['line'] == lid]:
            fb = coach_line(page, c['first'])
            if first_ever or pct == '30': shot(page, '04-line-flagged' if pct == '60' else '09-line-flagged-30', '#lab-fb', 250)
        fb = coach_line(page, lines[lid])
        if 'Fix this first' in fb: raise SystemExit('BLOCKED %s %s %s: %s' % (s['id'], pct, lid, fb))
        if first_ever and lid == 'a-mech': shot(page, '05a-line-card', '.lab-comp'); shot(page, '05b-test-drive', '#lab-drive', 175); shot(page, '05c-line-coached', '#lab-fb', 300)
        if i < 13: page.click('#lab-next'); page.wait_for_timeout(60)
    page.click('#lab-finishbp'); page.wait_for_selector('#lab-save')
    if first_ever: shot(page, '06-blueprint-summary', '.lab-kpis', 260); shot(page, '06b-blueprint-essay', '#lab-drivefull', 175)
    page.click('#lab-save'); page.wait_for_timeout(500); close_modal(page)
    page.click('#lab-shome'); page.wait_for_selector('#lab-new')
    return page.evaluate("(function(){var l=window.Lab._state.data.templates;return l[l.length-1].id})()")

def run_blueprint(page, s, pct, tpl_id, first_ever):
    vars_ = s['runs'][pct]['vars']
    page.click('[data-ltab=assembly]'); page.wait_for_timeout(150)
    if page.query_selector('#lab-again'): page.click('#lab-again')
    page.wait_for_selector('#lab-tsel')
    page.select_option('#lab-tsel', tpl_id); page.wait_for_timeout(150)
    page.click('label.lab-timing:has(input[value="none"])')
    if first_ever: shot(page, '10-assembly-home', '#lab-tsel', 260); shot(page, '10b-prompt-cards', '#lab-ftype', 220)
    page.click('[data-pp="%s"]' % s['promptId']); page.wait_for_selector('#lab-val')
    order = page.evaluate("window.Lab._state.run.order")
    for i, k in enumerate(order):
        page.fill('#lab-val', vars_[k]['text'])
        if page.query_selector('#lab-val2'): page.fill('#lab-val2', vars_[k].get('text2', ''))
        if first_ever and k == 'mechA': shot(page, '11-variable-card', '.lab-comp', 230)
        page.click('#lab-vcoach'); page.wait_for_selector('#lab-fb .lab-fb', timeout=15000)
        if first_ever and k == 'mechA': shot(page, '12-variable-feedback', '#lab-fb', 300)
        if i < len(order) - 1: page.click('#lab-vnext'); page.wait_for_timeout(60)
    page.click('#lab-vfinish'); page.wait_for_selector('.lab-result .lab-kpis', timeout=20000); page.wait_for_timeout(400); close_modal(page)
    if first_ever: shot(page, '13-run-report', '.lab-result', 175); shot(page, '13b-run-essay', '#lab-essay', 240); shot(page, '13c-run-preflight', '.preflight', 175)
    return page.evaluate("(function(){var l=window.Lab._state.data.attempts;var a=l[l.length-1];return {essay:a.essay,words:a.words,share:a.share,status:a.status}})()")

sets = []
for f in sorted(os.listdir(EX)):
    m = re.match(r'^(B1|B2)-([A-Z]+)\.json$', f)
    if m and (not WANT or f[:-5] in WANT):
        d = json.load(open(os.path.join(EX, f))); d['id'] = f[:-5]; sets.append(d)
sets.sort(key=lambda d: (d['level'], ORDER.index(d['type'])))

# the essays the checker builds, to compare with what the app assembles
expected = {}
import subprocess
for d in sets:
    out = subprocess.run(['node', os.path.join(ROOT, 'tools', 'lab-examples-check.js'), '--essays', os.path.join(EX, d['id'] + '.json')], capture_output=True, text=True).stdout
    for pct in ['60', '50', '40', '30']:
        mm = re.search(r'--- %s %s %s%% ---\n(.*?)\n\n(?=\n---|  \d\d%%:)' % (d['level'], d['type'], pct), out, re.S)
        if mm: expected[(d['id'], pct)] = mm.group(1).strip()

with sync_playwright() as pw:
    exe = '/opt/pw-browsers/chromium/chrome' if os.path.exists('/opt/pw-browsers/chromium/chrome') else None
    b = pw.chromium.launch(executable_path=exe) if exe else pw.chromium.launch()
    ctx = b.new_context(viewport={'width': 1280, 'height': 720}, device_scale_factor=1)
    page = ctx.new_page()
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))
    for level in ['B1', 'B2']:
        mine = [d for d in sets if d['level'] == level]
        if not mine: continue
        sid, name = STUDENTS[level]
        step('sign in as %s' % name); sign_in(page, sid, name)
        if level == 'B1': shot(page, '01-lab-home', '#view-lab .lab', 175)
        for d in mine:
            first = TAKE and level == 'B1' and d is mine[0]
            step('%s: build 60%% then copy to 50, 40, 30%%' % d['id'])
            ids, src = {}, None
            for pct in ['60', '50', '40', '30']:
                src = build_blueprint(page, d, pct, src, d.get('coaching', []), first and pct in ('60', '50'))
                ids[pct] = src
                if first and pct == '30': shot(page, '07-studio-four-shares', '.lab-grid', 240)
            step('%s: four Assembly runs on %s' % (d['id'], d['promptId']))
            for pct in ['60', '50', '40', '30']:
                r = run_blueprint(page, d, pct, ids[pct], first and pct == '60')
                exp = expected.get((d['id'], pct))
                same = exp is not None and re.sub(r'\s+', ' ', exp) == re.sub(r'\s+', ' ', r['essay'])
                print('   %s%%: %d words, share %d%%, %s' % (pct, r['words'], round(r['share'] * 100), 'matches the example file' if same else 'DIFFERS from the example file'))
                if not same: errors.append('essay differs: %s %s' % (d['id'], pct))
        if TAKE and level == 'B1':
            page.click('[data-ltab=score]'); page.wait_for_timeout(400); shot(page, '14-scorecard', '.lab-tabs', 175)
            page.click('[data-ltab=examples]'); page.wait_for_timeout(400); shot(page, '15-examples-top', '.lab-exhero', 175); shot(page, '15b-examples-table', '.lab-table', 260)
            page.click('[data-extype=PROBLEM]'); page.click('[data-expct="30"]'); page.wait_for_timeout(300)
            shot(page, '16-examples-rating', '.lab-result', 175); shot(page, '16b-examples-blueprint', '.lab-para', 230); shot(page, '16c-examples-coaching', '.lab-coachstory', 260); shot(page, '16d-examples-essay', '#lab-exessay', 240)
            page.click('[data-exview=compare]'); page.wait_for_timeout(300)
            shot(page, '17-examples-compare', '.lab-excmp', 240)
        store = page.evaluate("localStorage.getItem('pc.lab.v1.%s')" % sid)
        json.dump(json.loads(store), open(os.path.join(STORE, sid + '.json'), 'w'), indent=1, ensure_ascii=False)
        print('  saved the Lab store of %s → examples/store/%s.json' % (name, sid))
    b.close()
httpd.shutdown()
print('console errors / mismatches:', len(errors))
for e in errors[:15]: print('  !', e)
sys.exit(1 if errors else 0)
