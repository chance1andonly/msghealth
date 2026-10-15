// Shared synth palette for the product-demo sound beds (demo-audio.mjs, demo-fast-audio.mjs):
// soft UI sounds, a light room reverb and a gentle limiter, written as 48 kHz stereo WAV.
import fs from 'node:fs';
import path from 'node:path';

export const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

export function mixer(DUR) {
  const SR = 48000, N = SR * DUR;
  const L = new Float32Array(N), R = new Float32Array(N);
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;

  function add(t0, dur, fn, gain = 1, pan = 0) {
    const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
    const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
    for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); L[i] += v * gl; R[i] += v * gr; }
  }
  const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
  // ── sources ────────────────────────────────────────────────────────────────
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

  // ── mix: light room reverb, gentle limiter, short tail fade ────────────────
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
  function write(out) {
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
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buf);
    console.log('wrote', out);
  }

  return { add, rnd, thud, pluck, bell, tick, tap, glide, whoosh, chord, write };
}
