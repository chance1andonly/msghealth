# python3 scripts/sheet.py OUT.png W file1 file2 ... : horizontal contact sheet
import sys, subprocess
out, w, *fs = sys.argv[1:]
cmd = ['ffmpeg', '-loglevel', 'error', '-y']
for f in fs: cmd += ['-i', f]
fl = ''.join(f'[{i}:v]scale={w}:-1[a{i}];' for i in range(len(fs))) + ''.join(f'[a{i}]' for i in range(len(fs))) + f'hstack={len(fs)}'
subprocess.run(cmd + ['-filter_complex', fl, out], check=True)
