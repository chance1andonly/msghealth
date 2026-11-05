// Contact sheet for review:  ENTRY=yap.html node scripts/sheet.mjs out.png COLS 3.5 12 40 ...
// Renders each time as a still and tiles them (scaled to 360 px wide) into one PNG, left→right, top→bottom.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm } from './lib.mjs';

const [out, cols, ...times] = process.argv.slice(2);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sheet-'));
const film = await openFilm();
for (const [i, t] of times.entries()) fs.writeFileSync(path.join(dir, `f${String(i).padStart(3, '0')}.jpg`), await film.frame(+t));
if (process.env.CUES) console.log(JSON.stringify(await film.page.evaluate(() => window.CUES), (k, v) => (typeof v === 'number' ? +v.toFixed(2) : v)));
await film.close();
const rows = Math.ceil(times.length / +cols);
execFileSync(process.env.FFMPEG || 'ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(dir, 'f%03d.jpg'), '-vf', `scale=360:-1,tile=${cols}x${rows}:padding=6:color=0x222222`, '-frames:v', '1', out]);
fs.rmSync(dir, { recursive: true, force: true });
console.log('sheet →', out, times.join(' '));
