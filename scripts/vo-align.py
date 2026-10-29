# Usage: python3 scripts/vo-align.py chunks.json assets/audio/uranus  (chunks.json: one list of caption chunks per clip)
# Finds when each caption chunk starts inside its voiceover clip: syllables spread over the voiced span,
# each boundary snapped to the quietest nearby frame.
import sys, json, re, numpy as np, soundfile as sf
chunks = json.load(open(sys.argv[1])); vodir = sys.argv[2]
NUM = {'fifty-one': 'fif ty one', 'msghealth.net': 'mes sage health dot net', 'msghealth': 'mes sage health'}
def syl(s):
    s = s.lower().replace('*', '')
    for k, v in NUM.items(): s = s.replace(k, v)
    n = 0
    for w in re.findall(r"[a-z']+", s):
        g = len(re.findall(r'[aeiouy]+', w))
        if w.endswith('e') and not w.endswith(('le', 'ee')) and g > 1: g -= 1
        n += max(1, g)
    return n
out = []
for i, ch in enumerate(chunks):
    x, sr = sf.read(f'{vodir}/vo-{i:02d}.wav')
    if x.ndim > 1: x = x.mean(1)
    hop = int(sr * 0.01); e = np.array([np.sqrt((x[k:k + hop] ** 2).mean()) for k in range(0, len(x) - hop, hop)])
    th = e.max() * 0.06; v = np.where(e > th)[0]; a, b = v[0], v[-1]
    syls = [syl(c) for c in ch]; tot = sum(syls); acc = 0; starts = [0.0]
    sm = np.convolve(e, np.ones(5) / 5, 'same')
    for s in syls[:-1]:
        acc += s; f = int(a + (b - a) * acc / tot); lo, hi = max(a, f - 18), min(b, f + 18)
        k = lo + int(np.argmin(sm[lo:hi])); starts.append(round(k * 0.01 + 0.03, 2))
    out.append({'dur': round(len(x) / sr, 3), 'chunks': [[c, s] for c, s in zip(ch, starts)]})
lines = ['  ' + json.dumps(o, ensure_ascii=False).replace('{"dur"', '{ dur').replace('"chunks"', 'chunks').replace('}', ' }') + f', // {i:02d}' for i, o in enumerate(out)]
print('\n'.join(lines))
