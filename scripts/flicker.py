# python3 scripts/flicker.py VIDEO.mp4 : frame-to-frame change detector. Lists hard cuts and sudden isolated spikes (flicker).
import sys, subprocess, numpy as np
w, h = 108, 192
p = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', sys.argv[1], '-vf', f'scale={w}:{h},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
a = np.frombuffer(p, np.uint8).reshape(-1, h, w).astype(np.float32)
# ignore the caption word band, the stat line and the comment chip: they change on purpose
mask = np.ones((h, w), bool); mask[int(h*0.40):int(h*0.66)] = False; mask[:int(h*0.24)] = False; mask[int(h*0.70):int(h*0.78)] = False
a = a * mask
d = np.abs(np.diff(a, axis=0)).sum(axis=(1, 2)) / mask.sum(); fps = 30
cuts = [i for i in range(len(d)) if d[i] > 18]
print(f'{len(a)} frames, {len(cuts)} hard cuts (>18): ', ', '.join(f'{c / fps:.2f}s' for c in cuts))
# flicker = frame differs a lot from both neighbours but those neighbours are similar to each other (A B A pattern)
fl = [i for i in range(1, len(a) - 1) if np.abs(a[i + 1] - a[i - 1]).sum() / mask.sum() < 0.35 * min(d[i - 1], d[i]) and min(d[i - 1], d[i]) > 4]
print('flicker frames (A-B-A):', ', '.join(f'{f / fps:.2f}s' for f in fl) or 'none')
big = [i for i in range(len(d)) if 8 < d[i] <= 18 and i not in cuts]
print('large non-cut jumps (8-18):', ', '.join(f'{b / fps:.2f}s' for b in big) or 'none')
