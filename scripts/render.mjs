// Renders the film to MP4 (1920×1080, 24 fps, H.264 + AAC).
//   npm run render            → dist/msghealth-demo.mp4
// Env: FFMPEG (path to an ffmpeg with libx264), WORKERS (parallel browser pages, default 3)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const FPS = 24;
const WORKERS = +(process.env.WORKERS || Math.max(1, Math.min(3, os.cpus().length - 1)));
const DIST = path.join(ROOT, 'dist');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'msgh-'));
fs.mkdirSync(DIST, { recursive: true });

const probe = await openFilm();
const duration = probe.duration;
await probe.close();
const total = Math.round(duration * FPS);
console.log(`rendering ${total} frames with ${WORKERS} workers…`);

const t0 = Date.now();
let done = 0;
async function worker(k, from, to) {
  const film = await openFilm();
  const out = path.join(TMP, `part${k}.mp4`);
  const ff = spawn(FFMPEG, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-tune', 'animation', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = from; f < to; f++) {
    const buf = await film.frame(f / FPS, 'image/jpeg', 0.96);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (++done % 48 === 0) {
      const el = (Date.now() - t0) / 1000;
      console.log(`${done}/${total} frames  ${el.toFixed(0)}s elapsed  ~${((el / done) * (total - done)).toFixed(0)}s left`);
    }
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on('close', (c) => (c === 0 ? r() : j(new Error(`ffmpeg exit ${c}`)))));
  await film.close();
  return out;
}
const per = Math.ceil(total / WORKERS);
const parts = await Promise.all(Array.from({ length: WORKERS }, (_, k) => worker(k, k * per, Math.min(total, (k + 1) * per))));

const list = path.join(TMP, 'list.txt');
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
const wav = path.join(DIST, 'score.wav');
execFileSync('node', [path.join(ROOT, 'scripts/audio.mjs'), wav], { stdio: 'inherit' });
const mp4 = path.join(DIST, 'msghealth-demo.mp4');
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-i', wav,
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`done → ${mp4}  (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
