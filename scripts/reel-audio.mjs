// Soundtrack for the 15.7 s reel: the track, plus UI sound effects on the cues in src/reel-timing.js (TIMING.sfx).
// The source runs out at bar 7's downbeat, so the last two beats repeat bar 6's opening beats (a clean
// downbeat-to-downbeat splice) and fade out under the end card.
//   node scripts/reel-audio.mjs dist/reel-score.wav
// Env: TRACK (default assets/audio/reel-track.wav), SFX (default assets/audio/sfx-pack.wav), FFMPEG. Neither file is committed.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import '../src/reel-timing.js';

const TM = globalThis.TIMING;
const SR = 48000, N = Math.round(SR * TM.DURATION);
const TRACK = process.env.TRACK || 'assets/audio/reel-track.wav';
const decode = (file, ch) => { const raw = execFileSync(process.env.FFMPEG || 'ffmpeg', ['-v', 'error', '-i', file, '-ar', String(SR), '-ac', String(ch), '-f', 'f32le', '-'], { maxBuffer: 1 << 29 });
  return new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4)); };
const pcm = decode(TRACK, 2);
const src = (ch, n) => (n >= 0 && 2 * n + ch < pcm.length ? pcm[2 * n + ch] : 0);

const END = Math.round(TM.MUSIC_END * SR), REP = Math.round(TM.REPEAT_FROM * SR), XF = Math.round(0.012 * SR);
const out = [new Float32Array(N), new Float32Array(N)];
for (let ch = 0; ch < 2; ch++) for (let n = 0; n < N; n++) {
  const a = src(ch, n), b = src(ch, REP + (n - END));
  const k = clamp((n - END) / XF); // a 12 ms crossfade at the splice
  out[ch][n] = n < END ? a : n < END + XF ? a * (1 - k) + b * k : b;
}
function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
{ let pk = 0; for (const c of out) for (const v of c) pk = Math.max(pk, Math.abs(v)); for (const c of out) for (let n = 0; n < N; n++) c[n] *= 0.62 / pk; }

// ── sound effects ────────────────────────────────────────────────────────────
// Where each effect sits in the pack (seconds): [start, end]. The six keystrokes are single key presses.
const PACK = decode(process.env.SFX || 'assets/audio/sfx-pack.wav', 1);
const SLICES = {
  switch: [0.44, 1.30], zap: [1.43, 1.62], loading: [2.04, 3.56], reverb: [3.60, 4.96], glitchT: [4.96, 6.79],
  gears: [6.80, 8.56], open: [8.70, 9.43], success: [9.68, 10.73], glitch1: [10.74, 11.56], glitch2: [11.62, 12.34], glitch3: [12.40, 13.56],
  ...Object.fromEntries([13.605, 13.985, 14.305, 14.530, 15.035, 15.500].map((t, i) => ['key' + i, [t - 0.004, t + 0.09]])),
};
const SFX_GAIN = 0.75;
for (const [name, time, gain] of TM.sfx) {
  const [a, b] = SLICES[name], s0 = Math.round(a * SR), len = Math.round((b - a) * SR), at0 = Math.round(time * SR);
  const fi = Math.round(0.003 * SR), fo = Math.round(0.012 * SR);
  for (let k = 0; k < len; k++) {
    const n = at0 + k; if (n < 0 || n >= N) continue;
    const env = Math.min(1, k / fi, (len - k) / fo), v = PACK[s0 + k] * env * gain * SFX_GAIN;
    out[0][n] += v; out[1][n] += v;
  }
}
// fade out over the last 0.7 s, and a 10 ms fade-in so the first sample doesn't click
for (let n = 0; n < N; n++) {
  const g = Math.min(1, n / (SR * 0.01)) * Math.pow(clamp((TM.DURATION - n / SR) / 0.7), 2);
  out[0][n] *= g; out[1][n] *= g;
}
for (const c of out) for (let n = 0; n < N; n++) c[n] = Math.tanh(c[n] * 1.2) / 1.2;
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
