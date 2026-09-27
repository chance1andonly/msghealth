// Sound design for the 30s vertical ad: sound effects only, no music (voiceover is recorded separately).
//   node scripts/ad-audio.mjs dist/ad-music-sfx.wav
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000, DUR = 30, N = SR * DUR;
const X = [new Float32Array(N), new Float32Array(N)]; // sound-effects bus
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 11; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

// Voiceover windows (seconds), for reference when recording.
export const VO = [[1.95, 3.4], [3.55, 6.3], [8.95, 11.3], [13.05, 15.5], [24.35, 25.45], [27.15, 29.85]];

function add(bus, t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); bus[0][i] += v * gl; bus[1][i] += v * gr; }
}
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
// sound sources
const pluck = (f) => (t) => env(t, 0.004, 9) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.exp(-t * 25) * Math.sin(2 * Math.PI * f * 3 * t));
const bell = (f, d = 3) => (t) => env(t, 0.002, d) * (Math.sin(2 * Math.PI * f * t) + 0.45 * Math.exp(-t * 3) * Math.sin(2 * Math.PI * f * 2.76 * t) + 0.2 * Math.exp(-t * 6) * Math.sin(2 * Math.PI * f * 5.4 * t));
function whoosh(bus, t0, d, g = 0.2, up = true) {
  let y1 = 0, y2 = 0;
  add(bus, t0, d, (t) => {
    const k = t / d, fc = up ? 400 + 3200 * k : 3600 - 3200 * k, w = 2 * Math.PI * fc / SR, a = Math.sin(w) / 5;
    const x = rnd(), y = (a * x + 2 * Math.cos(w) * y1 - (1 - a) * y2) / (1 + a); y2 = y1; y1 = y;
    return y * Math.sin(Math.PI * k) * 3;
  }, g);
}
const tick = (f = 1800) => (t) => Math.exp(-t * 90) * Math.sin(2 * Math.PI * f * t) * (1 + 0.3 * rnd());
const tap = () => (t) => Math.exp(-t * 180) * rnd();
const buzz = () => (t) => Math.min(1, t / 0.01) * Math.min(1, (0.14 - t) / 0.02) * Math.sign(Math.sin(2 * Math.PI * 170 * t)) * 0.5 * (1 + Math.sin(2 * Math.PI * 23 * t)) / 2;

// ── 0:00–0:02 · notifications, countdown, silence ────────────────────────────
[[0.10, 88, 95]].forEach(([t, a, b]) => { // the cancellation
  add(X, t, 0.2, buzz(), 0.10);
  add(X, t, 1.0, bell(mtof(a), 5), 0.12, 0.1); add(X, t + 0.09, 1.0, bell(mtof(b), 5), 0.10, 0.1);
});
[[1.25, 1500], [1.45, 1250], [1.65, 1000]].forEach(([t, f]) => add(X, t, 0.12, tick(f), 0.22));
add(X, 1.77, 0.11, (t) => Math.min(1, (0.11 - t) / 0.03) * Math.exp(-t * 7) * Math.sin(2 * Math.PI * (240 * Math.exp(-t * 4) + 40) * t), 0.4); // the last one drops
// (1.85 – 2.0: silence)

// ── UI sound design ──────────────────────────────────────────────────────────
add(X, 7.35, 0.3, tick(2200), 0.08);                                       // row selected
add(X, 8.45, 1.2, bell(mtof(81), 4), 0.09); add(X, 8.58, 1.2, bell(mtof(77), 4), 0.08); // at-risk flag
[11.15, 11.5, 11.85].forEach((t) => add(X, t, 0.1, tick(1700), 0.07));    // signals appear
for (let t = 13.35; t < 14.2; t += 0.055) add(X, t, 0.03, tap(), 0.035 + 0.01 * Math.abs(rnd())); // message prepared
add(X, 14.62, 0.05, tap(), 0.16);                                          // click
whoosh(X, 14.68, 0.45, 0.22);                                              // message sent
add(X, 15.15, 1.2, bell(mtof(86), 5), 0.10, 0.2); add(X, 15.25, 1.2, bell(mtof(91), 5), 0.08, 0.2); // Sarah's phone
for (let t = 15.6; t < 16.25; t += 0.05) add(X, t, 0.03, tap(), 0.03);     // she types
whoosh(X, 16.28, 0.3, 0.14);                                               // reply sent
[84, 88, 91].forEach((m, i) => add(X, 16.72 + i * 0.07, 1.4, bell(mtof(m), 4), 0.075)); // booked
add(X, 17.03, 0.2, buzz(), 0.12); add(X, 17.06, 1.2, bell(mtof(88), 4.5), 0.1); add(X, 17.16, 1.2, bell(mtof(93), 4.5), 0.08); // new booking
add(X, 17.6, 1.6, bell(mtof(79), 2.5), 0.05);                              // relief
[19.6, 19.95].forEach((t) => add(X, t, 0.25, pluck(mtof(91)), 0.07));      // check-ins
[20.0, 20.33, 20.66].forEach((t, i) => add(X, t, 0.25, pluck(mtof(88 + i * 2)), 0.06));
for (let i = 0; i < 5; i++) add(X, 21.2 + i * 0.16, 0.25, pluck(mtof(84 + [0, 2, 4, 7, 9][i])), 0.06, -0.3 + i * 0.15); // bookings
[21.7, 21.9, 22.1].forEach((t, i) => { add(X, t, 0.6, bell(mtof(96 - i * 3), 6), 0.04); }); // paid
for (let i = 0; i < 5; i++) add(X, 22.9 + i * 0.08, 0.9, bell(mtof(91 + i * 2), 4), 0.03);  // new review
whoosh(X, 23.2, 0.7, 0.06);                                                // chart updates
[[24.02, 79], [24.1, 84]].forEach(([t, m]) => add(X, t, 2.2, bell(mtof(m), 1.8), 0.08, -0.3)); // shop door bell
add(X, 25.95, 0.6, (t) => env(t, 0.01, 4) * Math.sin(2 * Math.PI * (600 + 500 * t) * t), 0.05); // health back up
add(X, 29.1, 0.08, tap(), 0.08);

// ── mix: light room reverb, limiter ──────────────────────────────────────────
// true silence after the last customer disappears (the voice carries 2–7 s)
const gate = (t) => (t < 1.86 ? 1 : t < 1.9 ? (1.9 - t) / 0.04 : t < 7.0 ? 0 : 1); // nothing else sounds until 7.0; this also stops the reverb tail returning
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
const XL = reverb(X[0], 0.1), XR = reverb(X[1], 0.1);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  const t = n / SR, tail = Math.min(1, (DUR - t) / 0.35) * gate(t);
  const l = Math.tanh(XL[n] * 1.7 * tail), r = Math.tanh(XR[n] * 1.7 * tail);
  buf.writeInt16LE(Math.round(l * 32000), 44 + n * 4); buf.writeInt16LE(Math.round(r * 32000), 46 + n * 4);
}
const out = process.argv[2] ?? 'dist/ad-music-sfx.wav';
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buf);
console.log('wrote', out);
