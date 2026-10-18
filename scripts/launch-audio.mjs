// Soundtrack for the 33 s launch film: a licensed instrumental as the music bed (cut so its first kick
// lands on the drop at 6.0 s). Synthesised sound design only plays where the song is silent: the 6 s hook and
// the closing heartbeat.
//   node scripts/launch-audio.mjs dist/launch-score.wav
// Env: SONG (path to the mp3, default assets/audio/song.mp3 — not committed), FFMPEG.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import '../src/launch-timing.js';

const TM = globalThis.TIMING;
const SR = 48000, DUR = TM.DURATION, N = SR * DUR;
const SONG = process.env.SONG || 'assets/audio/song.mp3';
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

// ── music bed ────────────────────────────────────────────────────────────────
const raw = execFileSync(FFMPEG, ['-v', 'error', '-i', SONG, '-ss', String(TM.SONG_START), '-t', String(DUR), '-ar', String(SR), '-ac', '2', '-f', 'f32le', '-'], { maxBuffer: 1 << 29 });
const pcm = new Float32Array(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / 4));
const M = [new Float32Array(N), new Float32Array(N)];
for (let n = 0; n < N && 2 * n + 1 < pcm.length; n++) { M[0][n] = pcm[2 * n]; M[1][n] = pcm[2 * n + 1]; }
// level the song to a fixed RMS over the part that plays (after the drop), so the effects sit at a known distance
{ let e = 0, c = 0; for (let n = Math.floor(TM.D * SR); n < N; n++) { e += M[0][n] ** 2 + M[1][n] ** 2; c += 2; } const g = 0.13 / Math.sqrt(e / c); for (const ch of M) for (let n = 0; n < N; n++) ch[n] *= g; }
// the song fades out under the logo fold so the film ends in silence and loops cleanly into its silent opening
const fadeStart = TM.end.urlOut, fadeEnd = TM.end.foldEnd - 0.05;
for (let n = 0; n < N; n++) { const t = n / SR; if (t > fadeStart) { const k = Math.min(1, (t - fadeStart) / (fadeEnd - fadeStart)); const g = Math.pow(1 - k, 2); M[0][n] *= g; M[1][n] *= g; } }

// ── sound design ─────────────────────────────────────────────────────────────
const X = [new Float32Array(N), new Float32Array(N)];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
function add(bus, t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); bus[0][i] += v * gl; bus[1][i] += v * gr; }
}
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
const tick = (f = 1800) => (t) => Math.exp(-t * 90) * Math.sin(2 * Math.PI * f * t) * (1 + 0.3 * rnd());
const thud = (f) => (t) => Math.exp(-t * 14) * Math.sin(2 * Math.PI * f * t) * Math.min(1, t / 0.006);
const lubdub = (t, g = 1) => { add(X, t, 0.35, thud(58), 0.5 * g); add(X, t + 0.2, 0.35, thud(50), 0.36 * g); };

// hook (0 → drop): a heartbeat that fades out, the slam, then the song's own silence.
// Designed on a 6 s clock and played TM.HOOK× faster, exactly like the picture.
const hk = (x) => x / TM.HOOK;
[1.0, 2.0, 3.0].forEach((t, i) => lubdub(hk(t), 1 - i * 0.28));
add(X, hk(4.0), 1.2, (t) => Math.exp(-t * 4) * Math.sin(2 * Math.PI * (44 + 60 * Math.exp(-t * 20)) * t) * 1.1, 0.55);
add(X, hk(4.0), 0.25, (t) => Math.exp(-t * 30) * rnd(), 0.3);
for (let k = 0; k < 42; k++) { const ta = hk(1.1 + 3.4 * Math.pow(k / 42, 1.5)); add(X, ta, 0.08, tick(2400 - k * 15), 0.05, ((k * 37) % 20) / 10 - 1); }

// From the drop on, the song carries everything: no sound effects while it plays.
// The only one left is the closing heartbeat, after the song has faded — the loop point.
lubdub(TM.end.loop.beat, 0.9);

// ── mix ──────────────────────────────────────────────────────────────────────
function reverb(x, mix) {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const out = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = x[n] + y * 0.78; c.i = (c.i + 1) % c.d; s += y; }
    s *= 0.25;
    for (const a of aps) { const y = a.b[a.i]; const v = -s + y; a.b[a.i] = s + y * 0.5; a.i = (a.i + 1) % a.d; s = v; }
    out[n] = x[n] * (1 - mix) + s * mix * 1.6;
  }
  return out;
}
const XL = reverb(X[0], 0.16), XR = reverb(X[1], 0.16);
let peak = 0;
const out = [new Float32Array(N), new Float32Array(N)];
for (let n = 0; n < N; n++) {
  const g = Math.min(1, n / (SR * 0.01)) * Math.min(1, (N - n) / (SR * 0.02));
  out[0][n] = Math.tanh((M[0][n] + XL[n]) * 1.3) * g; out[1][n] = Math.tanh((M[1][n] + XR[n]) * 1.3) * g;
  peak = Math.max(peak, Math.abs(out[0][n]), Math.abs(out[1][n]));
}
const norm = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) { buf.writeInt16LE(Math.round(out[0][n] * norm * 32000), 44 + n * 4); buf.writeInt16LE(Math.round(out[1][n] * norm * 32000), 46 + n * 4); }
const file = process.argv[2] ?? 'dist/launch-score.wav';
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, buf);
console.log('wrote', file);
