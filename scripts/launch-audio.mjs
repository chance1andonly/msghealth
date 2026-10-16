// Synthesised score + sound design for the 33 s launch film, synced to src/launch.js cue times.
//   node scripts/launch-audio.mjs dist/launch-score.wav
// 120 BPM, A♭ major. Heartbeat motif in the hook, true silence before the drop at 6.0 s,
// everything pitched is in key. No samples.
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000, DUR = 33, N = SR * DUR;
const M = [new Float32Array(N), new Float32Array(N)]; // music bus
const X = [new Float32Array(N), new Float32Array(N)]; // fx bus
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
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
const kick = (g = 1) => (t) => g * Math.exp(-t * 7) * Math.sin(2 * Math.PI * (48 + 90 * Math.exp(-t * 28)) * t) * Math.min(1, t / 0.002);
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

// ── hook 0–6 s: a heartbeat that fades out, slam, silence ────────────────────
[1.0, 2.0, 3.0].forEach((t, i) => lubdub(t, 1 - i * 0.28));
add(X, 4.0, 1.2, (t) => Math.exp(-t * 4) * Math.sin(2 * Math.PI * (44 + 60 * Math.exp(-t * 20)) * t) * 1.1, 0.55);
add(X, 4.0, 0.25, (t) => Math.exp(-t * 30) * rnd(), 0.3);
whoosh(X, 4.9, 0.75, 0.0, false);

// message "delivered" ticks accelerating
for (let k = 0; k < 42; k++) { const ta = 1.1 + 3.4 * Math.pow(k / 42, 1.5); add(X, ta, 0.08, tick(2400 - k * 15), 0.05, ((k * 37) % 20) / 10 - 1); }

// ── drop 1 at 6.0 s ──────────────────────────────────────────────────────────
add(X, 6.0, 2.5, (t) => Math.exp(-t * 2.5) * Math.sin(2 * Math.PI * (36 + 70 * Math.exp(-t * 15)) * t), 0.9);
whoosh(X, 6.0, 0.7, 0.35, false);
[80, 84, 87].forEach((m, i) => add(X, 6.12 + i * 0.05, 2.5, bell(mtof(m), 2.2), 0.09));
add(X, 7.35, 0.4, tick(2000), 0.06);
// wordmark reveal sparkle
for (let i = 0; i < 6; i++) add(X, 6.45 + i * 0.08, 0.3, pluck(mtof(84 + [0, 2, 4, 7, 9, 12][i])), 0.05);

// ── harmony ──────────────────────────────────────────────────────────────────
const DB = { n: [61, 65, 68], b: 37 }, ABC = { n: [60, 63, 68], b: 36 }, FM9 = { n: [65, 68, 72, 75], b: 41 }, EB = { n: [63, 67, 70], b: 39 }, AB = { n: [68, 72, 75], b: 44 };
const prog = [DB, ABC, FM9, EB];
function chord(ch, t0, d, g = 0.05) {
  ch.n.forEach((m, i) => [-0.07, 0.07].forEach((dt) => add(M, t0, d + 0.4, (t) => {
    const e = Math.min(1, t / 0.5) * Math.min(1, Math.max(0, (d + 0.4 - t) / 0.4)), f = mtof(m) * (1 + dt * 0.01);
    return e * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) + 0.12 * Math.sin(6 * Math.PI * f * t));
  }, g, (i - 1) * 0.3)));
  add(M, t0, d, (t) => Math.min(1, t / 0.02) * Math.min(1, Math.max(0, (d - t) / 0.1)) * Math.sin(2 * Math.PI * mtof(ch.b) * t), 0.2);
}
for (let bar = 0; bar < 9; bar++) chord(prog[bar % 4], 6 + bar * 2, 2 - 0.08);   // 6–24
chord(DB, 24.5, 1.5, 0.04); chord(EB, 26, 1.0 - 0.08, 0.04);                      // breakdown, V
chord(AB, 27.0, 4, 0.06); chord(DB, 31, 2, 0.04);                                  // resolution on the period

// ── drums: kick on beats, hats on off-beats, thinned under typing ────────────
for (let t = 6; t < 24.5 - 1e-6; t += 0.5) {
  const beat = Math.round((t - 6) / 0.5);
  let g = 0.7;
  if (t >= 10 && t < 13.5) g = beat % 2 === 0 ? 0.38 : 0;
  else if (t >= 13.5 && t < 14.0) g = 0;
  if (t === 14.0) g = 1.0;
  if (g > 0) add(M, t, 0.5, kick(g), 0.5);
  if (t >= 8 && !(t >= 10.5 && t < 14.0)) add(M, t + 0.25, 0.05, (tt) => Math.exp(-tt * 140) * rnd(), 0.05, 0.25);
}
add(M, 14.0, 2.0, (t) => Math.exp(-t * 3) * Math.sin(2 * Math.PI * (38 + 80 * Math.exp(-t * 18)) * t), 0.7); // drop 2
whoosh(X, 13.55, 0.55, 0.3, true);
// end: hit on "customers", soft kick under the lockup
add(X, 26.3, 1.4, (t) => Math.exp(-t * 3.5) * Math.sin(2 * Math.PI * (44 + 70 * Math.exp(-t * 18)) * t), 0.7);
add(X, 25.3, 0.4, tick(1500), 0.05);
for (let t = 27.0; t < 31; t += 0.5) add(M, t, 0.5, kick(0.45), 0.4);

// ── typing, UI ───────────────────────────────────────────────────────────────
const PROMPT = 'Win back clients who’ve gone quiet.';
const typeT = (i) => 11.0 + 2.0 * (i / (PROMPT.length - 1)) + 0.03 * Math.sin(i * 12.9898);
for (let i = 0; i < PROMPT.length; i++) {
  const word = i === 0 || PROMPT[i - 1] === ' ';
  add(X, typeT(i), 0.05, tap(), word ? 0.2 : 0.1, 0.1);
  if (word) add(X, typeT(i), 0.12, pluck(mtof(79 + [0, 2, 4, 7, 9, 12][i % 6])), 0.035);
}
add(X, 13.5, 0.05, tap(), 0.25);                                              // click
add(X, 10.2, 0.3, tick(1800), 0.05);
for (let i = 0; i < 7; i++) add(X, 14.9 + i * 0.07, 0.06, tick(1800 + i * 90), 0.06, -0.4 + i * 0.13); // rows
[16.0, 16.2, 16.4].forEach((t, i) => add(X, t, 1.2, bell(mtof([80, 84, 87][i]), 5), 0.08));            // outreach
[16.6, 16.9, 17.2].forEach((t, i) => { add(X, t, 1.4, bell(mtof([84, 87, 91][i]), 4), 0.1); add(X, t + 0.06, 1.4, bell(mtof([91, 94, 99][i]), 4), 0.05); });
add(X, 17.4, 1.6, bell(mtof(96), 3.5), 0.09); add(X, 17.4, 1.6, bell(mtof(91), 3.5), 0.07);
// features
FEATS_T().forEach((t) => { add(X, t, 0.2, tick(1200), 0.12); whoosh(X, t - 0.15, 0.3, 0.1, true); });
function FEATS_T() { return [18.5, 20.5, 22.5]; }
add(X, 18.95, 0.9, (t) => Math.sin(2 * Math.PI * (900 - 520 * (t / 0.9) ** 0.8) * t) * Math.sin(Math.PI * t / 0.9) * 0.5, 0.08);   // score falls
add(X, 19.75, 1.0, bell(mtof(77), 4), 0.09);                                  // At risk chip
[20.8, 21.02, 21.24, 21.46].forEach((t, i) => add(X, t, 0.4, pluck(mtof(84 + i * 3)), 0.07));
add(X, 22.0, 0.05, tap(), 0.2); add(X, 22.0, 1.5, bell(mtof(91), 3), 0.09);   // toggle
add(X, 23.4, 0.3, pluck(mtof(88)), 0.08); add(X, 23.45, 1.2, bell(mtof(84), 3), 0.08);   // slot fills
add(X, 23.9, 1.5, bell(mtof(91), 3), 0.09); add(X, 23.9, 1.5, bell(mtof(95), 3), 0.07);  // booked
// end
add(X, 24.5, 0.2, tick(1500), 0.1);
add(X, 26.9, 0.35, (t) => Math.sin(2 * Math.PI * (400 + 800 * t / 0.35) * t) * Math.sin(Math.PI * t / 0.35) * 0.3, 0.08); // hop
[80, 84, 87, 92].forEach((m, i) => add(X, 27.4 + i * 0.04, 3, bell(mtof(m), 1.8), 0.1));             // period lands
whoosh(X, 28.6, 0.5, 0.15, true);
[80, 87, 92, 96].forEach((m, i) => add(X, 29.05 + i * 0.07, 2.5, bell(mtof(m), 2.2), 0.08));          // lockup
add(X, 30.4, 0.2, tick(2200), 0.1);
lubdub(32.45, 0.9); lubdub(32.65, 0.0);

// ── mix ──────────────────────────────────────────────────────────────────────
// true silence 5.0–6.0 (music gated, fx not yet written); everything fades to digital zero at the tail
const gate = (t) => (t < 4.95 ? 1 : t < 5.0 ? (5.0 - t) / 0.05 : t < 6.0 ? 0 : 1);
const duck = (t) => (t >= 10.9 && t < 13.5 ? 0.78 : 1);
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
const mix = [0, 1].map((c) => { const o = new Float32Array(N); for (let n = 0; n < N; n++) { const t = n / SR; o[n] = M[c][n] * duck(t) + X[c][n]; } return o; });
const L = reverb(mix[0], 0.16), R = reverb(mix[1], 0.16);
let peak = 0;
const out = [new Float32Array(N), new Float32Array(N)];
for (let n = 0; n < N; n++) {
  const t = n / SR, g = gate(t) * Math.min(1, (DUR - t) / 0.25) * Math.min(1, t / 0.01);
  out[0][n] = Math.tanh(L[n] * 1.5) * g; out[1][n] = Math.tanh(R[n] * 1.5) * g;
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
