// Soundtrack for the 33 s launch film: a licensed instrumental as the music bed (cut so its first kick
// lands on the drop at 6.0 s), plus synthesised sound design timed to the same cue table as the picture.
//   node scripts/launch-audio.mjs dist/launch-score.wav
// Env: SONG (path to the mp3, default assets/audio/song.mp3 — not committed), FFMPEG.
// The song is in F♯ minor, so every pitched effect uses F♯ minor pentatonic (F♯ A B C♯ E).
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
const PENT = [78, 81, 83, 85, 88, 90, 93, 95, 97, 100]; // F♯5 A5 B5 C♯6 E6 F♯6 A6 B6 C♯7 E7
let seed = 5; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
function add(bus, t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); bus[0][i] += v * gl; bus[1][i] += v * gr; }
}
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
const bell = (f, d = 3) => (t) => env(t, 0.002, d) * (Math.sin(2 * Math.PI * f * t) + 0.45 * Math.exp(-t * 3) * Math.sin(2 * Math.PI * f * 2.76 * t) + 0.2 * Math.exp(-t * 6) * Math.sin(2 * Math.PI * f * 5.4 * t));
const pluck = (f) => (t) => env(t, 0.004, 9) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.exp(-t * 25) * Math.sin(2 * Math.PI * f * 3 * t));
const tick = (f = 1800) => (t) => Math.exp(-t * 90) * Math.sin(2 * Math.PI * f * t) * (1 + 0.3 * rnd());
const tap = () => (t) => Math.exp(-t * 180) * rnd();
const thud = (f) => (t) => Math.exp(-t * 14) * Math.sin(2 * Math.PI * f * t) * Math.min(1, t / 0.006);
function whoosh(bus, t0, d, g = 0.2, up = true) {
  let y1 = 0, y2 = 0;
  add(bus, t0, d, (t) => {
    const k = t / d, fc = up ? 300 + 3600 * k : 3900 - 3600 * k, w = 2 * Math.PI * fc / SR, a = Math.sin(w) / 5;
    const x = rnd(), y = (a * x + 2 * Math.cos(w) * y1 - (1 - a) * y2) / (1 + a); y2 = y1; y1 = y;
    return y * Math.sin(Math.PI * k) * 3;
  }, g);
}
const lubdub = (t, g = 1) => { add(X, t, 0.35, thud(58), 0.5 * g); add(X, t + 0.2, 0.35, thud(50), 0.36 * g); };
const note = (t, i, d = 3, g = 0.08, pan = 0) => add(X, t, 2.5, bell(mtof(PENT[i]), d), g, pan);

// hook 0–6 s: a heartbeat that fades out, the slam, then the song's own silence
[1.0, 2.0, 3.0].forEach((t, i) => lubdub(t, 1 - i * 0.28));
add(X, 4.0, 1.2, (t) => Math.exp(-t * 4) * Math.sin(2 * Math.PI * (44 + 60 * Math.exp(-t * 20)) * t) * 1.1, 0.55);
add(X, 4.0, 0.25, (t) => Math.exp(-t * 30) * rnd(), 0.3);
for (let k = 0; k < 42; k++) { const ta = 1.1 + 3.4 * Math.pow(k / 42, 1.5); add(X, ta, 0.08, tick(2400 - k * 15), 0.05, ((k * 37) % 20) / 10 - 1); }

// drop at 6.0 — the song's kick lands here
whoosh(X, 5.85, 0.2, 0.0, true);
whoosh(X, TM.D, 0.7, 0.3, false);
[0, 2, 3].forEach((n, i) => note(TM.D + 0.12 + i * 0.05, n, 2.2, 0.07));
for (let i = 0; i < 6; i++) add(X, 6.45 + i * 0.08, 0.3, pluck(mtof(PENT[i])), 0.045);
add(X, 7.35, 0.4, tick(2000), 0.06);
TM.punches.forEach((t) => add(X, t, 0.15, tick(900), 0.05));

// prompt
const PROMPT = 'Win back clients who’ve gone quiet.';
const typeT = (i) => TM.prompt.typeStart + TM.prompt.typeDur * (i / (PROMPT.length - 1)) + 0.03 * Math.sin(i * 12.9898);
add(X, TM.prompt.t0 + 0.1, 0.3, tick(1800), 0.05);
for (let i = 0; i < PROMPT.length; i++) {
  const word = i === 0 || PROMPT[i - 1] === ' ';
  add(X, typeT(i), 0.05, tap(), word ? 0.2 : 0.1, 0.1);
  if (word) add(X, typeT(i), 0.12, pluck(mtof(PENT[(i * 3) % 6])), 0.035);
}
add(X, TM.prompt.click, 0.05, tap(), 0.25);
whoosh(X, TM.prompt.flood - 0.1, 0.55, 0.3, true);

// product
for (let i = 0; i < 7; i++) add(X, TM.app.rows + i * 0.07, 0.06, tick(1800 + i * 90), 0.06, -0.4 + i * 0.13);
[0, 1, 2].forEach((i) => note(TM.app.sms + i * 0.2, [0, 1, 3][i], 5, 0.07));
TM.app.replies.forEach((t, i) => { note(t, [1, 3, 4][i], 4, 0.1); note(t + 0.06, [4, 5, 6][i], 4, 0.05); });
note(TM.app.toast, 7, 3.5, 0.09); note(TM.app.toast, 4, 3.5, 0.07);

// features
TM.feat.forEach((t) => { add(X, t, 0.2, tick(1200), 0.12); whoosh(X, t - 0.15, 0.3, 0.1, true); });
add(X, TM.feat[0] + 0.45, 0.9, (t) => Math.sin(2 * Math.PI * (900 - 520 * (t / 0.9) ** 0.8) * t) * Math.sin(Math.PI * t / 0.9) * 0.5, 0.08);
note(TM.feat[0] + 1.25, 0, 4, 0.09);
[0, 1, 2, 3].forEach((i) => add(X, TM.feat[1] + 0.3 + i * 0.22, 0.4, pluck(mtof(PENT[1 + i])), 0.07));
add(X, TM.feat[1] + 1.5, 0.05, tap(), 0.2); note(TM.feat[1] + 1.5, 4, 3, 0.09);
add(X, TM.feat[2] + 0.9, 0.3, pluck(mtof(PENT[4])), 0.08); note(TM.feat[2] + 0.95, 2, 3, 0.08);
note(TM.feat[2] + 1.4, 4, 3, 0.09); note(TM.feat[2] + 1.4, 6, 3, 0.07);

// finale
const E = TM.end;
add(X, E.t0, 0.2, tick(1500), 0.1);
add(X, E.keep, 0.4, tick(1500), 0.05);
add(X, E.customers, 1.4, (t) => Math.exp(-t * 3.5) * Math.sin(2 * Math.PI * (44 + 70 * Math.exp(-t * 18)) * t), 0.7);
add(X, E.hop[0], 0.35, (t) => Math.sin(2 * Math.PI * (400 + 800 * t / 0.35) * t) * Math.sin(Math.PI * t / 0.35) * 0.3, 0.08);
[0, 2, 4, 6].forEach((n, i) => note(E.hop[1] + i * 0.04, n, 1.8, 0.1));
whoosh(X, E.exit - 0.1, 0.5, 0.15, true);
[0, 4, 6, 8].forEach((n, i) => note(E.logo + i * 0.07, n, 2.2, 0.08));
add(X, E.url, 0.2, tick(2200), 0.1);
lubdub(E.loop.beat, 0.9); // the closing beat — and the silence that follows is the loop point

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
