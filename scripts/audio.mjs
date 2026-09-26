// Generates the original score + sound design as a 48 kHz stereo WAV.
// Pure synthesis (no samples), so the soundtrack is fully owned and reproducible.
//   node scripts/audio.mjs dist/score.wav
import fs from 'node:fs';
import path from 'node:path';

const SR = 48000, DUR = 94, N = SR * DUR;
const L = new Float32Array(N), R = new Float32Array(N);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

function add(t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); L[i] += v * gl; R[i] += v * gr; }
}
// ── instruments ──────────────────────────────────────────────────────────────
const pad = (f, d) => (t) => {
  const env = Math.min(1, t / 0.9) * Math.min(1, (d - t) / 1.1);
  const vib = 1 + 0.002 * Math.sin(t * 5.1);
  return env * (Math.sin(2 * Math.PI * f * vib * t) + 0.3 * Math.sin(4 * Math.PI * f * t + 0.3) + 0.12 * Math.sin(6 * Math.PI * f * 1.001 * t));
};
const marimba = (f) => (t) => Math.exp(-t * 7) * Math.min(1, t / 0.004) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.exp(-t * 20) * Math.sin(2 * Math.PI * f * 4 * t));
const piano = (f) => (t) => Math.exp(-t * 1.6) * Math.min(1, t / 0.006) * (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.exp(-t * 2) * Math.sin(4 * Math.PI * f * t) + 0.15 * Math.exp(-t * 3) * Math.sin(6 * Math.PI * f * t));
const bell = (f) => (t) => Math.exp(-t * 2.2) * Math.min(1, t / 0.003) * (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 4) + 0.25 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * 7));
const bass = (f, d) => (t) => Math.min(1, t / 0.02) * Math.min(1, (d - t) / 0.3) * Math.exp(-t * 0.4) * (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t));
// sfx
const pop = (f = 700) => (t) => Math.exp(-t * 30) * Math.sin(2 * Math.PI * (f * (1 + 1.2 * Math.exp(-t * 40))) * t);
const thump = (f = 90) => (t) => Math.exp(-t * 18) * Math.sin(2 * Math.PI * f * (1 + Math.exp(-t * 30)) * t);
const click = () => (t) => Math.exp(-t * 300) * (rnd() * 2 - 1);
function whoosh(t0, d, gain = 0.25, up = true) { // band-passed noise sweep
  let y1 = 0, y2 = 0;
  add(t0, d, (t) => {
    const k = t / d, fc = up ? 300 + 3000 * k : 3300 - 3000 * k;
    const w = 2 * Math.PI * fc / SR, q = 2.5, alpha = Math.sin(w) / (2 * q);
    const x = rnd() * 2 - 1;
    const y = (alpha * x + 2 * Math.cos(w) * y1 - (1 - alpha) * y2) / (1 + alpha);
    y2 = y1; y1 = y;
    return y * Math.sin(Math.PI * k) * 3;
  }, gain);
}

// ── score ────────────────────────────────────────────────────────────────────
const CH = {
  C: [48, 55, 60, 64, 67], Am: [45, 52, 57, 60, 64], F: [41, 53, 57, 60, 65], G: [43, 55, 59, 62, 67],
  Dm: [38, 50, 57, 62, 65], E: [40, 52, 56, 59, 64], Em: [40, 52, 55, 59, 64],
};
const BAR = 2.5; // 96 bpm, 4/4
const bars = [
  // A · the busy, happy studio
  ['C', 'arp'], ['Am', 'arp'], ['F', 'arp'], ['G', 'arp'], ['C', 'arp'], ['Am', 'arp'], ['F', 'soft'],
  // B · the quiet leak (minor, sparse)
  ['Am', 'sparse'], ['F', 'sparse'], ['Dm', 'sparse'], ['Am', 'sparse'], ['F', 'sparse'], ['E', 'sparse'],
  // reveal
  ['C', 'reveal'], ['G', 'reveal'],
  // C · MsgHealth at work
  ['C', 'full'], ['G', 'full'], ['Am', 'full'], ['F', 'full'], ['C', 'full'], ['G', 'full'], ['Am', 'full'], ['F', 'full'],
  // toolkit shelf
  ['F', 'play'], ['G', 'play'], ['C', 'play'], ['Am', 'play'], ['F', 'play'],
  // result + help
  ['C', 'full'], ['G', 'full'], ['Am', 'arp'], ['F', 'arp'], ['C', 'soft'], ['G', 'soft'],
  // ending
  ['F', 'end'], ['G', 'end'], ['C', 'hold'], ['C', 'hold'],
];
bars.forEach(([ch, style], b) => {
  const t0 = b * BAR, notes = CH[ch];
  if (t0 >= DUR) return;
  const minor = style === 'sparse';
  const pg = { arp: 0.05, soft: 0.05, sparse: 0.045, reveal: 0.06, full: 0.055, play: 0.05, end: 0.06, hold: 0.06 }[style];
  for (const m of notes.slice(1)) add(t0, BAR + 1.2, pad(mtof(m), BAR + 1.2), pg, (m % 5 - 2) * 0.2);
  add(t0, BAR + 0.5, bass(mtof(notes[0] - 12), BAR + 0.5), minor ? 0.13 : 0.16);
  const up = notes.slice(2).concat(notes.slice(2, 4).map((n) => n + 12));
  if (style === 'arp' || style === 'full' || style === 'play') {
    const pat = style === 'play' ? [0, 2, 1, 3, 2, 4, 3, 1] : [0, 1, 2, 3, 4, 3, 2, 1];
    for (let i = 0; i < 8; i++) add(t0 + i * BAR / 8, 0.8, marimba(mtof(up[pat[i]] + 12)), style === 'full' ? 0.1 : 0.085, i % 2 ? 0.35 : -0.35);
    if (style === 'full' && b % 2 === 0) add(t0, 2.5, bell(mtof(up[3] + 24)), 0.03, 0.2);
  }
  if (style === 'soft') for (let i = 0; i < 4; i++) add(t0 + i * BAR / 4, 1.2, marimba(mtof(up[i] + 12)), 0.07, i % 2 ? 0.3 : -0.3);
  if (style === 'sparse') { add(t0, 3, piano(mtof(up[2] + 12)), 0.11, -0.2); add(t0 + BAR * 0.5, 3, piano(mtof(up[1] + 12)), 0.08, 0.2); }
  if (style === 'reveal') for (let i = 0; i < 12; i++) add(t0 + i * 0.12, 1.2, bell(mtof(up[i % 5] + 24)), 0.035 * (1 - i / 14), (i % 3 - 1) * 0.5);
  if (style === 'end') for (let i = 0; i < 4; i++) add(t0 + i * BAR / 4, 2, piano(mtof(up[i] + 12)), 0.08, 0);
});
// final chime on the logo
[72, 76, 79, 84].forEach((m, i) => add(89.6 + i * 0.09, 3.5, bell(mtof(m)), 0.07, (i - 1.5) * 0.3));

// ── sound design (synced to the picture) ─────────────────────────────────────
const P = (t, f, g = 0.12, pan = 0) => add(t, 0.3, pop(f), g, pan);
[10.5, 10.8, 11.1].forEach((t, i) => P(t, 900 + i * 120, 0.08, 0.3));
add(12.0, 0.2, click(), 0.12); P(12.02, 1400, 0.07); // card tap + paid
[0, 1, 2, 3].forEach((i) => P(16.1 + i * 0.35, 500 + i * 40, 0.08, -0.5 + i * 0.33));
P(19.8, 850, 0.09);
[26.7, 27.1, 27.5].forEach((t, i) => { add(t + 0.35, 0.4, thump(70 - i * 6), 0.2); });
P(30.4, 420, 0.06); P(30.8, 380, 0.06);
whoosh(32.6, 1.2, 0.12); add(33.0, 0.5, thump(110), 0.22); P(33.05, 620, 0.1);
P(40.2, 560, 0.1); P(40.8, 760, 0.08); P(41.05, 820, 0.08);
[45.3, 45.8, 46.3, 46.8].forEach((t, i) => P(t, 600 + i * 90, 0.08));
add(47.4, 0.2, click(), 0.15);
whoosh(48.1, 0.8, 0.18); whoosh(48.8, 0.5, 0.25); whoosh(53.3, 0.5, 0.25, false);
add(49.9, 1.2, bell(mtof(88)), 0.07, 0.3); add(50.05, 1.2, bell(mtof(93)), 0.07, 0.3); // text arrives
P(51.3, 800, 0.1);
P(54.0, 760, 0.08); P(54.8, 980, 0.1); add(54.85, 1.5, bell(mtof(91)), 0.05);
for (let i = 0; i < 5; i++) add(58.3 + i * 0.16, 0.9, bell(mtof(84 + [0, 2, 4, 7, 9][i])), 0.045, -0.6 + i * 0.3);
for (let j = 0; j < 4; j++) add(60.15 + 0.3 + j * 0.35 + 0.17, 0.4, thump(140), 0.18);
P(62.05, 900, 0.1); add(62.1, 1.5, bell(mtof(96)), 0.04);
add(64.0, 0.5, thump(80), 0.3); add(64.0, 0.08, click(), 0.12);
for (let i = 0; i < 6; i++) P(65.85 + i * 0.15, 500 + i * 110, 0.07, -0.5 + i * 0.2);
P(67.05, 1300, 0.08);
[68.9, 69.15, 69.65].forEach((t, i) => P(t, 700 + i * 100, 0.08));
for (let i = 0; i < 5; i++) P(72.2 + i * 0.4, 680 + i * 60, 0.07, 0.4);
add(77.5, 0.2, click(), 0.14); add(78.3, 0.2, click(), 0.14);
whoosh(78.55, 0.5, 0.08); P(79.0, 820, 0.08); P(81.0, 760, 0.08); P(82.3, 840, 0.09);
add(89.6, 0.6, thump(95), 0.25);

// ── mix: gentle reverb, master fades, soft limiter ───────────────────────────
function reverb(x, mix = 0.22) {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const out = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = x[n] + y * 0.8; c.i = (c.i + 1) % c.d; s += y; }
    s *= 0.25;
    for (const a of aps) { const y = a.b[a.i]; const v = -s + y; a.b[a.i] = s + y * 0.5; a.i = (a.i + 1) % a.d; s = v; }
    out[n] = x[n] * (1 - mix) + s * mix * 1.8;
  }
  return out;
}
const Lr = reverb(L), Rr = reverb(R, 0.24);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  const t = n / SR;
  const g = Math.min(1, t / 1.5) * Math.min(1, (DUR - t) / 1.2) * 1.6;
  const lim = (v) => Math.tanh(v * g);
  buf.writeInt16LE(Math.round(lim(Lr[n]) * 32000), 44 + n * 4);
  buf.writeInt16LE(Math.round(lim(Rr[n]) * 32000), 46 + n * 4);
}
const out = process.argv[2] ?? 'dist/score.wav';
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, buf);
console.log('wrote', out);
