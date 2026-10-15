// Sound design for the 47 s product demo (demo.html): restrained UI sound effects only.
// No music and no voice; the voiceover (VOICEOVER.md) is recorded separately and laid on top.
//   node scripts/demo-audio.mjs dist/demo-sfx.wav
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000, DUR = 47, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

function add(t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); L[i] += v * gl; R[i] += v * gr; }
}
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
// ── sources ──────────────────────────────────────────────────────────────────
const thud = (f = 70, d = 14) => (t) => env(t, 0.002, d) * Math.sin(2 * Math.PI * (f + 60 * Math.exp(-t * 40)) * t);
const pluck = (f) => (t) => env(t, 0.003, 10) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.exp(-t * 30) * Math.sin(2 * Math.PI * f * 2 * t));
const bell = (f, d = 4) => (t) => env(t, 0.002, d) * (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.exp(-t * 3) * Math.sin(2 * Math.PI * f * 2.76 * t) + 0.15 * Math.exp(-t * 6) * Math.sin(2 * Math.PI * f * 5.4 * t));
const tick = (f = 2000) => (t) => Math.exp(-t * 110) * Math.sin(2 * Math.PI * f * t);
const tap = () => (t) => Math.exp(-t * 200) * rnd();
const glide = (f0, f1, d) => { let ph = 0; return (t) => { const f = f0 + (f1 - f0) * Math.min(1, t / d); ph += 2 * Math.PI * f / SR; return Math.sin(ph) * Math.sin(Math.PI * Math.min(1, t / d)); }; };
function whoosh(t0, d, g = 0.08, up = true, pan = 0) {
  let y1 = 0, y2 = 0;
  add(t0, d, (t) => {
    const k = t / d, fc = up ? 300 + 2600 * k : 2900 - 2600 * k, w = 2 * Math.PI * fc / SR, a = Math.sin(w) / 4;
    const x = rnd(), y = (a * x + 2 * Math.cos(w) * y1 - (1 - a) * y2) / (1 + a); y2 = y1; y1 = y;
    return y * Math.sin(Math.PI * k) ** 2 * 3;
  }, g, pan);
}
const chord = (t, notes, g, d = 3, spread = 0.03) => notes.forEach((m, i) => add(t + i * spread, 2.5, bell(mtof(m), d), g, -0.3 + 0.6 * (i / Math.max(1, notes.length - 1))));

// ── 01 the silence ───────────────────────────────────────────────────────────
[[1.0, 0.5], [1.55, 0.34], [1.98, 0.2], [2.28, 0.11], [2.48, 0.05]].forEach(([t, g]) => { add(t, 0.4, thud(), g); add(t, 0.03, tap(), g * 0.15); });
add(2.6, 0.5, pluck(mtof(84)), 0.08);                      // ball becomes a message
add(3.0, 0.08, tick(2400), 0.05, 0.3);                     // delivered
for (let t = 3.2; t < 3.75; t += 0.16) add(t, 0.04, tick(1500), 0.018, -0.3); // typing…
add(3.95, 1.4, bell(mtof(76), 3), 0.05); add(4.05, 1.4, bell(mtof(71), 3), 0.045); // …no reply
add(4.15, 0.5, glide(520, 140, 0.5), 0.05);                // falls through the floor
// ── 02 the problem ───────────────────────────────────────────────────────────
whoosh(5.3, 0.45, 0.07);
add(5.75, 0.4, pluck(mtof(79)), 0.07);
whoosh(5.85, 0.3, 0.04, true, 0.2);
[7.25, 7.37, 7.49, 7.61, 7.73].forEach((t, i) => add(t + 0.25, 0.3, thud(55 + i * 4, 18), 0.07));
// ── 03 churn ─────────────────────────────────────────────────────────────────
whoosh(9.0, 0.6, 0.04);
for (let k = 0; k < 27; k++) add(10.05 + k * 0.074, 0.06, tick(1700 - k * 22), 0.02 + 0.008 * Math.abs(rnd()), -0.4 + 0.8 * Math.abs(rnd()));
// ── 04 meet MsgHealth ────────────────────────────────────────────────────────
whoosh(13.15, 0.65, 0.07, true);
add(13.75, 0.5, thud(60, 10), 0.3);
chord(14.35, [72, 76, 79], 0.055);
whoosh(15.2, 0.4, 0.035);
add(15.7, 0.4, pluck(mtof(88)), 0.05);
whoosh(16.6, 0.42, 0.07);
// ── 05 client health ─────────────────────────────────────────────────────────
whoosh(17.0, 0.4, 0.035);
add(17.78, 0.06, tick(2200), 0.05);
add(18.35, 1.5, glide(660, 330, 1.5), 0.018);
add(18.95, 0.06, tick(1800), 0.04);
add(19.62, 1.2, bell(mtof(81), 4), 0.065); add(19.74, 1.2, bell(mtof(77), 4), 0.055);
[20.05, 20.41, 20.77].forEach((t) => add(t, 0.06, tick(1900), 0.04));
whoosh(22.58, 0.42, 0.07);
// ── 06 automations ───────────────────────────────────────────────────────────
[23.45, 23.81, 24.17, 24.53].forEach((t, i) => add(t, 0.3, pluck(mtof(76 + [0, 3, 7, 12][i])), 0.045));
add(25.0, 0.05, tap(), 0.14); add(25.02, 0.08, tick(1300), 0.05);
add(25.3, 0.4, glide(900, 1800, 0.4), 0.02);
whoosh(25.95, 0.55, 0.06);
add(26.85, 1.2, bell(mtof(86), 5), 0.065, -0.2); add(26.95, 1.2, bell(mtof(91), 5), 0.05, -0.2);
whoosh(27.55, 0.3, 0.05, true, 0.25);
chord(28.1, [84, 88, 91], 0.05, 4, 0.07);
add(28.45, 0.9, glide(330, 660, 0.9), 0.016);
add(29.25, 0.4, pluck(mtof(91)), 0.05);
// ── 07 toolkit slams ─────────────────────────────────────────────────────────
for (let i = 0; i < 6; i++) { const t = 29.6 + i * 0.9; add(t, 0.5, thud(52, 9), 0.26); add(t, 0.05, tap(), 0.05); whoosh(t - 0.12, 0.2, 0.03, true, i % 2 ? 0.3 : -0.3); }
// ── 08 overview ──────────────────────────────────────────────────────────────
whoosh(35.1, 1.1, 0.04);
add(36.4, 1.5, glide(400, 800, 1.5), 0.012);
whoosh(39.2, 0.45, 0.07);
// ── 09 call to action ────────────────────────────────────────────────────────
add(39.7, 0.5, thud(55, 9), 0.22); add(39.95, 0.5, thud(60, 9), 0.18);
add(40.45, 0.4, pluck(mtof(86)), 0.06);
add(41.55, 0.6, thud(50, 7), 0.2); chord(41.6, [72, 76, 79, 84], 0.05, 2.2, 0.05);
add(42.6, 0.4, pluck(mtof(84)), 0.05);
add(43.95, 0.04, tap(), 0.16); add(43.96, 0.08, tick(1400), 0.06);
add(44.2, 1.6, bell(mtof(96), 3.5), 0.022);

// ── mix: light room reverb, gentle limiter, short tail fade ──────────────────
function reverb(x, mix) {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const out = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = x[n] + y * 0.8; c.i = (c.i + 1) % c.d; s += y; }
    s *= 0.25;
    for (const a of aps) { const y = a.b[a.i]; const v = -s + y; a.b[a.i] = s + y * 0.5; a.i = (a.i + 1) % a.d; s = v; }
    out[n] = x[n] * (1 - mix) + s * mix * 1.6;
  }
  return out;
}
const XL = reverb(L, 0.14), XR = reverb(R, 0.14);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  const tail = Math.min(1, (DUR - n / SR) / 0.5);
  buf.writeInt16LE(Math.round(Math.tanh(XL[n] * 1.6 * tail) * 30000), 44 + n * 4);
  buf.writeInt16LE(Math.round(Math.tanh(XR[n] * 1.6 * tail) * 30000), 46 + n * 4);
}
const out = process.argv[2] ?? 'dist/demo-sfx.wav';
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buf);
console.log('wrote', out);
