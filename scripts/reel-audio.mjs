// Soundtrack for the 15.7 s reel: the track alone (no sound effects), cut to src/reel-timing.js.
// The source runs out at bar 7's downbeat, so the last two beats repeat bar 6's opening beats (a clean
// downbeat-to-downbeat splice) and fade out under the end card.
//   node scripts/reel-audio.mjs dist/reel-score.wav
// Env: TRACK (default assets/audio/reel-track.wav — not committed), FFMPEG.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import '../src/reel-timing.js';

const TM = globalThis.TIMING;
const SR = 48000, N = Math.round(SR * TM.DURATION);
const TRACK = process.env.TRACK || 'assets/audio/reel-track.wav';
const raw = execFileSync(process.env.FFMPEG || 'ffmpeg', ['-v', 'error', '-i', TRACK, '-ar', String(SR), '-ac', '2', '-f', 'f32le', '-'], { maxBuffer: 1 << 29 });
const pcm = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4));
const src = (ch, n) => (n >= 0 && 2 * n + ch < pcm.length ? pcm[2 * n + ch] : 0);

const END = Math.round(TM.MUSIC_END * SR), REP = Math.round(TM.REPEAT_FROM * SR), XF = Math.round(0.012 * SR);
const out = [new Float32Array(N), new Float32Array(N)];
for (let ch = 0; ch < 2; ch++) for (let n = 0; n < N; n++) {
  const a = src(ch, n), b = src(ch, REP + (n - END));
  const k = clamp((n - END) / XF); // a 12 ms crossfade at the splice
  out[ch][n] = n < END ? a : n < END + XF ? a * (1 - k) + b * k : b;
}
function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
// fade out over the last 0.7 s, and a 10 ms fade-in so the first sample doesn't click
for (let n = 0; n < N; n++) {
  const g = Math.min(1, n / (SR * 0.01)) * Math.pow(clamp((TM.DURATION - n / SR) / 0.7), 2);
  out[0][n] *= g; out[1][n] *= g;
}
let peak = 0; for (const c of out) for (const v of c) peak = Math.max(peak, Math.abs(v));
const norm = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) { buf.writeInt16LE(Math.round(out[0][n] * norm * 32000), 44 + n * 4); buf.writeInt16LE(Math.round(out[1][n] * norm * 32000), 46 + n * 4); }
const file = process.argv[2] ?? 'dist/reel-score.wav';
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, buf);
console.log('wrote', file);
