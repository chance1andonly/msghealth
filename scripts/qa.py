#!/usr/bin/env python3
"""Pre-post check for a reel built from scripts/vo/NAME.json and assets/audio/NAME/.

  python3 scripts/qa.py NAME [queue/FILE.mp4]

Prints timing, what the voice actually says (speech recognition, when sherpa-onnx and a model are available), and wording flags
(AI-sounding patterns, rhythm, long lines). It never approves anything: read the output, fix the script, then approve with
  node posting/ig.mjs approve FILE.mp4 "note"
Exit code 1 means a blocking problem. ASR model: $ASR_DIR (default /home/claude/work/ref/sherpa-onnx-whisper-base.en).
"""
import glob, json, os, re, subprocess, sys, wave

name = sys.argv[1]
spec = json.load(open(f'scripts/vo/{name}.json'))
lines = spec['lines']
flags, blocks = [], []
say = lambda s: print(s)

# ---- timing -----------------------------------------------------------------------------------------------------------
durs = []
for i in range(len(lines)):
    f = f'assets/audio/{name}/vo-{i:02d}.wav'
    if not os.path.exists(f):
        blocks.append(f'missing voice clip {f}'); continue
    w = wave.open(f); durs.append(w.getnframes() / w.getframerate())
t = spec.get('start', 0.3); starts = []
for i, d in enumerate(durs):
    starts.append(round(t, 2)); t += d + lines[i].get('gap', 0.22)
total = t - lines[-1].get('gap', 0.22) if durs else 0
say(f'voice: {len(durs)} lines, ends at {total:.1f}s (finale adds about 3s)')
for i, ln in enumerate(lines[:len(durs)]):
    words = len(re.findall(r"[A-Za-z0-9']+", ln['say']))
    say(f'  {i} @{starts[i]:5.1f}s {durs[i]:4.1f}s {words:2d}w  gap {ln.get("gap", 0.22):.2f} speed {ln.get("speed", spec["speed"])}  {ln["say"]}')
    if words > 18: flags.append(f'line {i} is {words} words; too long to say in one breath')
    if i < len(lines) - 1 and ln.get('gap', 0.22) > 0.8: flags.append(f'line {i}: gap {ln.get("gap")}s after it feels like dead air')
if durs and durs[0] > 4.5: flags.append(f'hook line is {durs[0]:.1f}s; the first line should land in under 4.5s')
if durs and len(re.findall(r"[A-Za-z0-9']+", lines[0]['say'])) > 14: flags.append('hook line is over 14 words')
if durs and not 14 <= total + 3 <= 60: flags.append(f'total length about {total + 3:.0f}s; aim for 15-50s')
if not re.search(r'keep', lines[-1]['say'], re.I): blocks.append('last line is not the KEEP call to action')

# ---- wording ----------------------------------------------------------------------------------------------------------
CLICHE = r"game.?changer|here'?s the thing|let that sink in|at the end of the day|in a world|imagine this|the secret|the truth is|here'?s why|and that'?s why|let'?s dive|delve|unlock|elevate|leverage|seamless|robust|crucial|vital|pivotal|landscape|tapestry|journey|ever-evolving|in today'?s|worth noting|remarkably|ultimately|simply put|plain and simple|full stop|buckle up|spoiler|stop scrolling|you won'?t believe|nobody talks about|what if i told you"
APHORISM = r"\bevery (single )?time\b|\bis the (whole )?(business|game|secret|point)\b|\bthat'?s the whole\b|\bbeats guessing\b|\bnothing more\b"
NEG = r"\b(isn'?t|aren'?t|wasn'?t|weren'?t|don'?t|doesn'?t|didn'?t|never|nobody|no one|not)\b"
sents = []
for i, ln in enumerate(lines[:-1]):
    for s in re.split(r'(?<=[.!?])\s+', ln['say'].strip()):
        if s: sents.append((i, s))
text_all = ' '.join(s for _, s in sents)
for m in re.finditer(CLICHE, text_all, re.I): flags.append(f'cliche: "{m.group(0)}"')
for m in re.finditer(APHORISM, text_all, re.I): flags.append(f'tidy-aphorism closer: "{m.group(0)}"')
if '—' in text_all or ' - ' in text_all: flags.append('dash used in spoken text')
# "not X. It's Y." reversals
rev = 0
for (i, a), (j, b) in zip(sents, sents[1:]):
    if re.search(NEG, a, re.I) and re.match(r"(it'?s|that'?s|they|he|she|you|the|but|instead|just)\b", b, re.I) and len(a.split()) < 14: rev += 1; flags.append(f'"not X, it\'s Y" reversal: "{a}" / "{b}"')
if rev > 1: flags.append(f'{rev} reversal pairs; use at most one per reel')
# runs of very short fragments
run = 0
for _, s in sents:
    run = run + 1 if len(s.split()) <= 4 else 0
    if run == 3: flags.append(f'3+ clipped fragments in a row near: "{s}"')
short = sum(1 for _, s in sents if len(s.split()) <= 6)
if len(sents) >= 6 and short / len(sents) > 0.7: flags.append(f'staccato: {short} of {len(sents)} sentences are 6 words or fewer; mix in a longer one')
starts_ = [s.split()[0].lower() for _, s in sents]
for a, b in zip(starts_, starts_[1:]):
    if a == b and a not in ('the', 'a', 'i'): flags.append(f'two sentences in a row start with "{a}"')
caps_txt = ' '.join(c for ln in lines for c in ln['caps'])
if '—' in caps_txt: flags.append('em dash in on-screen text')
cap = sys.argv[2].replace('.mp4', '.txt') if len(sys.argv) > 2 else None
if cap and os.path.exists(cap):
    ct = open(cap).read()
    for m in re.finditer(CLICHE + '|—', ct, re.I): flags.append(f'caption cliche/dash: "{m.group(0)}"')
    if '#' not in ct: flags.append('caption has no hashtags')
    say('caption: ' + ct.split('\n\n')[0])

# ---- what the voice actually says -------------------------------------------------------------------------------------------
asr_dir = os.environ.get('ASR_DIR', '/home/claude/work/ref/sherpa-onnx-whisper-base.en/')
try:
    import numpy as np, sherpa_onnx as so
    g = lambda p: glob.glob(os.path.join(asr_dir, p))[0]
    r = so.OfflineRecognizer.from_whisper(encoder=g('*encoder.int8.onnx'), decoder=g('*decoder.int8.onnx'), tokens=g('*tokens.txt'), language='en')
    norm = lambda s: re.findall(r"[a-z']+", s.lower().replace('-', ' '))
    say('heard (numbers and respelled names are not compared; listen to those):')
    for i in range(len(durs)):
        w = wave.open(f'assets/audio/{name}/vo-{i:02d}.wav'); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        _e = os.dup(2); _n = os.open(os.devnull, os.O_WRONLY); os.dup2(_n, 2)
        s = r.create_stream(); s.accept_waveform(w.getframerate(), a); r.decode_stream(s); heard = s.result.text.strip()
        os.dup2(_e, 2); os.close(_n); os.close(_e)
        NUMW = set('zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million oh and a half percent'.split())
        want, got = [x for x in norm(lines[i]['say']) if x not in NUMW], norm(heard)
        miss = [x for x in want if x not in got]
        say(f'  {i} {heard}' + (f'   <-- check: {", ".join(miss[:6])}' if len(miss) > max(1, len(want) // 5) else ''))
        if len(miss) > max(1, len(want) // 5): flags.append(f'line {i}: recognizer did not hear {miss[:6]} (mispronounced or unclear? listen/respell)')
except Exception as e:
    say(f'(speech check unavailable: {type(e).__name__}; read each line aloud instead)')

say('')
for b in blocks: say('BLOCK: ' + b)
for f in dict.fromkeys(flags): say('flag: ' + f)
if not blocks and not flags: say('no flags')
sys.exit(1 if blocks else 0)
