// Renders a film to MP4 (H.264 + AAC, at the frame rate the page declares).
//   npm run render            → dist/msghealth-demo.mp4          (16:9 paper film, index.html, 24 fps)
//   npm run render:ad         → dist/msghealth-ad-9x16.mp4       (9:16 social ad, ad.html, 24 fps)
//   npm run render:demo       → dist/msghealth-product-demo.mp4  (16:9 motion-graphics demo, demo.html, 60 fps)
//   npm run render:fast       → dist/msghealth-product-demo-fast.mp4  (20.5 s fast cut, demo-fast.html, 60 fps)
// Env: FFMPEG (path to an ffmpeg with libx264), WORKERS (parallel browser pages, default 3)
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const ENTRY = process.env.ENTRY || 'index.html';
const TARGETS = {
  'index.html': { out: 'msghealth-demo', audio: 'scripts/audio.mjs', wav: 'score.wav' },
  'ad.html': { out: 'msghealth-ad-9x16', audio: 'scripts/ad-audio.mjs', wav: 'ad-music-sfx.wav' },
  'demo.html': { out: 'msghealth-product-demo', audio: 'scripts/demo-audio.mjs', wav: 'demo-sfx.wav' },
  'demo-fast.html': { out: 'msghealth-product-demo-fast', audio: 'scripts/demo-fast-audio.mjs', wav: 'demo-fast-sfx.wav' },
};
const TARGET = TARGETS[ENTRY];
const WORKERS = +(process.env.WORKERS || Math.max(1, Math.min(3, os.cpus().length - 1)));
const DIST = path.join(ROOT, 'dist');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'msgh-'));
fs.mkdirSync(DIST, { recursive: true });

const probe = await openFilm(ENTRY);
const duration = probe.duration;
const FPS = probe.fps;
await probe.close();
const total = Math.round(duration * FPS);
console.log(`rendering ${total} frames with ${WORKERS} workers…`);

const t0 = Date.now();
let done = 0;
async function worker(k, from, to) {
  const film = await openFilm(ENTRY);
  const out = path.join(TMP, `part${k}.mp4`);
  const ff = spawn(FFMPEG, ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-tune', 'animation', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = from; f < to; f++) {
    const buf = await film.frame(f / FPS, 'image/jpeg', 0.96);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (++done % (FPS * 2) === 0) {
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
const wav = path.join(DIST, TARGET.wav);
execFileSync('node', [path.join(ROOT, TARGET.audio), wav], { stdio: 'inherit' });
const mp4 = path.join(DIST, `${TARGET.out}.mp4`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-i', wav,
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`done → ${mp4}  (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
