#!/usr/bin/env python3
"""Headless check of the Oct 2026 additions: keyword word cards (picture, synonyms,
antonyms that open their own cards, back trail), the Chapter 1 text, podcast rows in
the chapter missions and the Classes list, the lesson Listen button and the
"Back to the map" result button. Usage: python3 tools/words-smoke.py (Playwright).
Screenshots land in tools/shots/words-*.png."""
import os, http.server, threading, socketserver, functools
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SHOTS = os.path.join(ROOT, 'tools', 'shots'); os.makedirs(SHOTS, exist_ok=True)
PORT = 8767
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=httpd.serve_forever, daemon=True).start()
BASE = 'http://127.0.0.1:%d/' % PORT
errors = []
def shot(page, name): page.screenshot(path=os.path.join(SHOTS, 'words-' + name + '.png'), full_page=False)
def step(m): print('·', m)

with sync_playwright() as p:
    exe = '/opt/pw-browsers/chromium/chrome' if os.path.exists('/opt/pw-browsers/chromium/chrome') else None
    b = p.chromium.launch(executable_path=exe)
    for vw, tag in ((1100, 'desk'), (390, 'phone')):
        ctx = b.new_context(viewport={'width': vw, 'height': 860})
        page = ctx.new_page()
        page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(BASE + 'index.html'); page.wait_for_timeout(500)
        page.evaluate("localStorage.setItem('pc.apiUrl','off')"); page.reload(); page.wait_for_timeout(500)
        page.click('#tab-new'); page.fill('#f-id', 'words-' + tag); page.fill('#f-name', 'Ploy'); page.fill('#f-pw', 'test1234'); page.click('#btn-go')
        page.wait_for_selector('#screen-app:not(.hidden)', timeout=8000)
        page.evaluate("window.Story.unlockAll(window.PCHost.p); window.PCHost.paintHeader()")

        step(tag + ': chapter 1 pages')
        page.evaluate("window.Story.open(1,'read')"); page.wait_for_timeout(400)
        txt = page.inner_text('.story-text'); assert 'It is October in Bangkok' in txt, txt[:80]
        assert page.query_selector('.story-text .say-btn'), 'page 1 narration missing'
        page.click('#pg-next'); page.wait_for_timeout(200); assert 'Term begins on 29 October' in page.inner_text('.story-text')
        page.click('#pg-next'); page.wait_for_timeout(200); assert page.inner_text('.story-text').startswith('The following week') or 'The following week you stand' in page.inner_text('.story-text')
        page.click('#pg-next'); page.wait_for_timeout(200); assert 'After arriving at the school, everyone is guided to a big hall.' in page.inner_text('.story-text')
        step(tag + ': word card for "evidence"')
        page.click('.story-text .kw[data-w="evidence"]'); page.wait_for_timeout(250)
        assert page.query_selector('#modal-slot .wcard-art'), 'no picture'
        syn = page.query_selector_all('#modal-slot .wrow[data-rel^="Synonym"] .wchip'); ant = page.query_selector_all('#modal-slot .wrow[data-rel^="Antonym"] .wchip')
        assert len(syn) == 3 and len(ant) == 3, (len(syn), len(ant))
        levels = [c.query_selector('.wchip-lv').inner_text() for c in syn]; print('  synonyms', [c.inner_text().replace('\n', ' ') for c in syn])
        assert all(c.evaluate("e => e.tagName") == 'BUTTON' for c in syn + ant), 'a first-level chip is not clickable'
        shot(page, tag + '-card-evidence')
        first = syn[0].query_selector('.wchip-w').inner_text()
        syn[0].click(); page.wait_for_timeout(250)
        assert page.inner_text('#modal-slot .kw-word').strip().lower() == first.lower(), 'linked card did not open'
        assert 'Synonym of evidence' in page.inner_text('#modal-slot .kicker')
        assert len(page.query_selector_all('#modal-slot .wrow .wchip')) == 6
        shot(page, tag + '-card-linked')
        page.click('#modal-slot [data-wback]'); page.wait_for_timeout(250)
        assert page.inner_text('#modal-slot .kw-word').strip() == 'evidence'
        page.click('#modal-slot [data-close]'); page.wait_for_timeout(150)
        page.click('#pg-next'); page.wait_for_timeout(200); page.click('#pg-next'); page.wait_for_timeout(200)
        t6 = page.inner_text('.story-text'); assert 'Juno grabs your timetable' in t6 and 'Who writes like this?' in t6, t6
        shot(page, tag + '-page6')

        step(tag + ': podcast rows in the chapter missions')
        page.evaluate("window.Story.open(1,'chapter')"); page.wait_for_timeout(300)
        rows = page.query_selector_all('[data-mpod]'); assert [r.get_attribute('data-mpod') for r in rows] == ['m00', 'm01'], [r.get_attribute('data-mpod') for r in rows]
        names = [x.inner_text() for x in page.query_selector_all('.missions .ck-name')]
        assert names.index('Podcast: The Test') == names.index('The facts') - 1, names
        rows[0].click(); page.wait_for_timeout(250); assert page.query_selector('#drop-mpod-m00 audio'), 'no player'
        shot(page, tag + '-missions')

        step(tag + ': podcast row in the Classes list')
        page.click('.nav button[data-view=map]') if tag == 'desk' else page.evaluate("document.querySelector('.nav button[data-view=map]').click()")
        page.wait_for_timeout(300)
        if not page.query_selector('#view-map .sys.exp'): page.evaluate("document.querySelector('[data-sys=m00]').click()"); page.wait_for_timeout(200)
        body = page.query_selector('#view-map .sys.exp .sys-body'); first_row = body.query_selector('button')
        assert 'Podcast:' in first_row.inner_text(), first_row.inner_text()
        shot(page, tag + '-classes')

        step(tag + ': lesson Listen button and Back to the map')
        sid = body.query_selector('[data-sub]').get_attribute('data-sub')
        page.click('#view-map [data-sub="%s"]' % sid); page.wait_for_timeout(300)
        assert page.query_selector('#p-say'), 'no listen button'
        assert 'Map Room' in page.inner_text('#p-back')
        has = page.evaluate("(function(){var s=Engine.Bank.sub('%s');return !!(window.QM_LESSON_AUDIO && Object.keys(QM_LESSON_AUDIO.files).length)})()" % sid)
        print('  recorded lesson audio present:', has)
        page.click('#p-say'); page.wait_for_timeout(400)
        assert 'playing' in page.get_attribute('#p-say', 'class')
        shot(page, tag + '-lesson')
        page.click('#p-start'); page.wait_for_timeout(200)
        page.evaluate("PCHost.p; (function(){})()")
        # finish the run quickly through the engine
        for i in range(12):
            if page.query_selector('.result'): break
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
            page.wait_for_timeout(80)
            page.click('#p-check'); page.wait_for_timeout(120); page.click('#p-check'); page.wait_for_timeout(120)
        page.wait_for_selector('.result', timeout=5000)
        assert page.inner_text('#r-map').strip() == 'Back to the map', page.inner_text('#r-map')
        page.click('#r-map'); page.wait_for_timeout(300)
        assert not page.query_selector('#view-plan').evaluate("e => e.classList.contains('hidden')"), 'did not return to the Map Room'
        shot(page, tag + '-back-map')
        ctx.close()
    b.close()
httpd.shutdown()
errors = [e for e in errors if 'favicon' not in e and 'ERR_' not in e]
print('console errors:', errors)
assert not errors
print('OK')
