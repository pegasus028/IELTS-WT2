#!/usr/bin/env python3
"""Build the read-aloud audio for every lesson explanation in the Classes.

For each of the 42 lessons (subs) it records one text per explanation level, in the
same voice as the story narration (Microsoft neural en-GB-SoniaNeural via edge-tts,
rate -8%):
  C1          = lesson name + key sentence + the full explanation from the topic file
  A1 A2 B1 B2 = lesson name + that level's key + body from lesson-levels.js
and writes audio/lessons/<fnv1a>.mp3 plus audio/lessons/index.js. The hash is taken
over the exact text student.js builds (lessonSpeech), so an edited lesson simply has
no recording (and falls back to the browser voice) until this is re-run. Unchanged
texts are skipped. --prune deletes recordings no lesson uses any more.
Usage: pip install edge-tts && python3 tools/build-lesson-audio.py [--prune]
"""
import json, os, subprocess, sys, asyncio
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'lessons')
VOICE, RATE = 'en-GB-SoniaNeural', '-8%'
CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    import certifi; certifi.where = lambda: CA
import edge_tts

# plain() / lessonText() / lessonSpeech() below must stay identical to plainSpeech(),
# lessonText() and lessonSpeech() in student.js.
NODE = r"""
global.window=global; require('./content.js');
for (let i=0;i<14;i++) require('./topic-'+String(i).padStart(2,'0')+'.js');
require('./lesson-levels.js');
function plain(h){ return String(h||'').replace(/<s>[\s\S]*?<\/s>/g,'').replace(/<br\s*\/?>/g,' ').replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/→/g,' to ').replace(/\s+/g,' ').trim(); }
function lessonText(s, lvl){ var L=(window.QM_LESSON_LEVELS||{})[s.id], x=lvl!=='C1'&&L&&L[lvl]; if (x&&x.body&&x.body.length) return {key:x.key||s.theory.key, body:x.body}; return {key:s.theory.key, body:s.theory.body}; }
function lessonSpeech(s, lvl){ var t=lessonText(s,lvl); return [plain(s.name)+'.', plain(t.key)].concat(t.body.map(plain)).join('\n'); }
const out=[];
for (const t of CONTENT.TOPICS) for (const lv of t.levels) for (const s of lv.subs)
  for (const l of ['A1','A2','B1','B2','C1']) out.push({id:s.id+'-'+l, text:lessonSpeech(s,l)});
process.stdout.write(JSON.stringify(out));
"""
def fnv(s):  # FNV-1a over UTF-16 code units, identical to lfnv() in student.js
    h = 0x811c9dc5
    for ch in s:
        c = ord(ch); units = [c] if c <= 0xFFFF else [0xD800 + ((c - 0x10000) >> 10), 0xDC00 + ((c - 0x10000) & 0x3FF)]
        for u in units:
            h ^= u; h = (h * 0x01000193) & 0xFFFFFFFF
    return '%08x' % h
def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())

async def main():
    items = json.loads(subprocess.check_output(['node', '-e', NODE], cwd=ROOT).decode())
    os.makedirs(OUT, exist_ok=True)
    sem = asyncio.Semaphore(4); files = {}; failed = []
    async def one(it):
        h = fnv(it['text']); f = os.path.join(OUT, h + '.mp3'); files[h] = 1
        for attempt in range(4):
            if os.path.exists(f) and os.path.getsize(f) > 1000 and 8 < len(it['text']) / dur(f) < 24:
                return
            async with sem:
                try: await edge_tts.Communicate(it['text'], VOICE, rate=RATE).save(f)
                except Exception as e: print('retry', it['id'], e)
        print('FAILED', h, it['id']); failed.append(h)
    await asyncio.gather(*[one(it) for it in items])
    for h in failed: files.pop(h, None)
    with open(os.path.join(OUT, 'index.js'), 'w') as fh:
        fh.write("/* Lesson read-aloud manifest: FNV-1a hash of each lesson's spoken text -> audio/lessons/<hash>.mp3.\n   One recording per lesson per explanation level (A1, A2, B1, B2, C1).\n   Voice: Microsoft neural en-GB-SoniaNeural, rate -8%. Rebuild with tools/build-lesson-audio.py when lesson text changes. */\n")
        fh.write("window.QM_LESSON_AUDIO = { voice: '%s', base: 'audio/lessons/', files: %s };\n" % (VOICE, json.dumps(dict(sorted(files.items())), separators=(',', ':'))))
    if '--prune' in sys.argv:
        for n in os.listdir(OUT):
            if n.endswith('.mp3') and n[:-4] not in files: os.remove(os.path.join(OUT, n)); print('pruned', n)
    print(len(files), 'lesson texts recorded,', len(failed), 'failed')
asyncio.run(main())
