// node motion/render.mjs sting   -> dist/msghealth-sting-9x16.mp4 (frames + quiet SFX mix)
import { chromium } from 'playwright';
import path from 'node:path'; import fs from 'node:fs'; import os from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
const name = process.argv[2], FPS = 30, WORKERS = +(process.env.WORKERS || 3);
const DIST = path.resolve('dist'); fs.mkdirSync(DIST, { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'mot-'));
const url = 'file://' + path.resolve('motion', name + '.html');
const exe = process.env.CHROMIUM_PATH || '/usr/bin/google-chrome';
async function open() { const b = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] }); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } }); await p.goto(url); await p.waitForFunction('window.READY'); return { b, p }; }
const probe = await open(); const dur = await probe.p.evaluate('DURATION'); await probe.b.close();
const total = Math.round(dur * FPS), per = Math.ceil(total / WORKERS);
async function worker(k) {
  const { b, p } = await open(); const out = path.join(TMP, `p${k}.mp4`);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = k * per; f < Math.min(total, (k + 1) * per); f++) { await p.evaluate((t) => seek(t), f / FPS); const buf = await p.screenshot({ type: 'jpeg', quality: 95 }); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); }
  ff.stdin.end(); await new Promise((r, j) => ff.on('close', (c) => (c ? j(new Error('ffmpeg ' + c)) : r()))); await b.close(); return out;
}
const parts = await Promise.all(Array.from({ length: WORKERS }, (_, k) => worker(k)));
fs.writeFileSync(path.join(TMP, 'l.txt'), parts.map((p) => `file '${p}'`).join('\n'));
const silent = path.join(TMP, 'v.mp4');
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(TMP, 'l.txt'), '-c', 'copy', silent]);
const audio = path.join(TMP, 'a.wav');
execFileSync('node', ['motion/audio.mjs', name, audio], { stdio: 'inherit' });
const tmpOut = path.join(DIST, `.msghealth-${name}-9x16.tmp.mp4`);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', '-shortest', tmpOut]);
fs.renameSync(tmpOut, path.join(DIST, `msghealth-${name}-9x16.mp4`)); console.log('done');
