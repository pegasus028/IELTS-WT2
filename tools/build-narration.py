#!/usr/bin/env python3
"""Build the story narration for Quillmoor Academy.

Extracts every narratable story text (pages, endings, events, gate intros, house
welcomes, map intro, finale, Sorting intro/tie line) from story-content.js and
sorting.js with node, records each with Microsoft's neural voice en-GB-SoniaNeural
(edge-tts, rate -8%), and writes audio/story/<fnv1a>.mp3 plus audio/story/index.js.
Unchanged texts are skipped, so re-running after an edit records only what changed.
Usage: pip install edge-tts && python3 tools/build-narration.py [--prune]
"""
import json, os, re, subprocess, sys, asyncio
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'audio', 'story')
VOICE, RATE = 'en-GB-SoniaNeural', '-8%'
CA = '/root/.ccr/ca-bundle.crt'
if os.path.exists(CA):
    import certifi; certifi.where = lambda: CA
import edge_tts

NODE = r"""
global.window=global; require('./story-content.js'); require('./sorting.js');
const out=[], seen=new Set(), KEYS=['text','intro','tieLine','welcome','mapIntro'];
function walk(o,p){ if(Array.isArray(o)) return o.forEach((x,i)=>walk(x,p+'['+i+']'));
  if(o&&typeof o==='object') for(const k in o){ const v=o[k];
    if(typeof v==='string'&&KEYS.includes(k)&&v.length>30){ if(!seen.has(v)){seen.add(v);out.push({path:p+'.'+k,text:v});} }
    else walk(v,p+'.'+k); } }
walk(window.STORY,'STORY'); walk(window.SORTING,'SORTING'); process.stdout.write(JSON.stringify(out));
"""
def fnv(s):  # FNV-1a over UTF-16 code units, identical to fnv() in story.js
    h = 0x811c9dc5
    for ch in s:
        c = ord(ch); units = [c] if c <= 0xFFFF else [0xD800 + ((c - 0x10000) >> 10), 0xDC00 + ((c - 0x10000) & 0x3FF)]
        for u in units:
            h ^= u; h = (h * 0x01000193) & 0xFFFFFFFF
    return '%08x' % h
def clean(t):
    t = re.sub(r'\[\[([^\[\]|]+)\|[^\[\]|]+\|[^\[\]|]+\]\]', r'\1', t)
    return t.replace('\n\n', '\n')
def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())

async def main():
    items = json.loads(subprocess.check_output(['node', '-e', NODE], cwd=ROOT).decode())
    os.makedirs(OUT, exist_ok=True)
    sem = asyncio.Semaphore(4); files = {}
    async def one(it):
        h = fnv(it['text']); f = os.path.join(OUT, h + '.mp3'); files[h] = 1
        for attempt in range(4):
            if os.path.exists(f) and os.path.getsize(f) > 1000 and 8 < len(it['text']) / dur(f) < 22:
                return
            async with sem:
                try: await edge_tts.Communicate(clean(it['text']), VOICE, rate=RATE).save(f)
                except Exception as e: print('retry', h, e)
        print('FAILED', h, it['path'])
    await asyncio.gather(*[one(it) for it in items])
    with open(os.path.join(OUT, 'index.js'), 'w') as fh:
        fh.write("/* Narration manifest: FNV-1a hash of each story text -> audio/story/<hash>.mp3.\n   Voice: Microsoft neural en-GB-SoniaNeural, rate -8%. Rebuild with tools/build-narration.py when story text changes. */\n")
        fh.write("window.QM_AUDIO = { voice: '%s', base: 'audio/story/', files: %s };\n" % (VOICE, json.dumps(dict(sorted(files.items())), separators=(',', ':'))))
    if '--prune' in sys.argv:
        for n in os.listdir(OUT):
            if n.endswith('.mp3') and n[:-4] not in files: os.remove(os.path.join(OUT, n)); print('pruned', n)
    print(len(files), 'texts narrated')
asyncio.run(main())
