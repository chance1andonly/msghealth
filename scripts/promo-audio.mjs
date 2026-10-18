// Builds the promo soundtrack: the music track, muffled during the dark slide, plus message
// chimes for the hook. Cues come from the film itself (window.SFX, window.MUFFLE in src/promo.js).
//   node scripts/promo-audio.mjs dist/promo-audio.wav
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/promo-audio.wav');
const SR = 48000;

const film = await openFilm('promo.html');
const { sfx, muffle, duration } = await film.page.evaluate(() => ({ sfx: window.SFX, muffle: window.MUFFLE, duration: DURATION }));
await film.close();

// An incoming-message chime: two quick bell notes, rising a fifth (synthesised, not a sampled system sound).
const buf = new Float32Array(Math.ceil((duration + 1) * SR));
function bell(t0, freq, gain) {
  const n0 = Math.round(t0 * SR), len = Math.round(0.6 * SR);
  for (let i = 0; i < len && n0 + i < buf.length; i++) {
    const t = i / SR, env = Math.min(1, t / 0.003) * Math.exp(-t / 0.11);
    const s = Math.sin(2 * Math.PI * freq * t) + 0.22 * Math.sin(2 * Math.PI * freq * 2 * t) + 0.06 * Math.sin(2 * Math.PI * freq * 3.01 * t);
    buf[n0 + i] += gain * env * s;
  }
}
for (const { t, kind } of sfx) if (kind === 'message') { bell(t, 1396.9, 0.22); bell(t + 0.075, 2093.0, 0.2); }

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'msgh-sfx-'));
const sfxWav = path.join(tmp, 'sfx.wav');
const pcm = Buffer.alloc(buf.length * 2);
buf.forEach((v, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2));
const header = Buffer.alloc(44);
header.write('RIFF', 0); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVE', 8); header.write('fmt ', 12);
header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(SR, 24);
header.writeUInt32LE(SR * 2, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
fs.writeFileSync(sfxWav, Buffer.concat([header, pcm]));

// Crossfade (80 ms) between the dry track and a low-passed copy across the muffled span.
const [a, b] = muffle;
const m = `min(clip((t-${a.toFixed(3)})/0.08,0,1),clip((${b.toFixed(3)}-t)/0.08,0,1))`;
const graph = [
  `[0:a]aresample=${SR},asplit=2[d][w]`,
  `[w]lowpass=f=420,lowpass=f=420,volume=1.35,volume='${m}':eval=frame[wm]`,
  `[d]volume='1-${m}':eval=frame[dm]`,
  `[1:a]aresample=${SR},pan=stereo|c0=c0|c1=c0[fx]`,
  `[dm][wm][fx]amix=inputs=3:normalize=0:duration=first[out]`,
].join(';');
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', '-i', path.join(ROOT, 'assets/audio/promo-track.m4a'), '-i', sfxWav,
  '-filter_complex', graph, '-map', '[out]', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`audio → ${out}  (${sfx.length} chimes, muffled ${a.toFixed(2)}–${b.toFixed(2)}s)`);
