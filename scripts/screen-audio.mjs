// Builds the "6 hours of this" soundtrack: an original synthesised bed (curious through the science,
// tense on the hours, lifting when MsgHealth arrives) plus the sound effects, each placed so its anchor
// (attack or peak) lands on its cue. Cues come from the film itself (window.SFX in src/screen.js).
//   node scripts/screen-audio.mjs dist/screen-audio.wav
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/screen-audio.wav');
const SOUNDS = {
  sent: { file: 'message-sent.wav', anchor: 0.203, gain: 0.8 },
  click: { file: 'mouse-click.wav', anchor: 0.01, gain: 0.8 },
  snap: { file: 'snap.wav', anchor: 0.01, gain: 0.9 },
  whoosh: { file: 'whoosh.wav', anchor: 0.339, gain: 0.6 },
  riser: { file: 'riser.wav', anchor: 1.665, gain: 0.7 },
};

const film = await openFilm('screen.html');
const { sfx, DUR } = await film.page.evaluate(() => ({ sfx: window.SFX, DUR: DURATION }));
await film.close();

// ── the bed ──────────────────────────────────────────────────────────────────
const SR = 48000, N = Math.ceil(SR * DUR);
const L = new Float32Array(N), R = new Float32Array(N);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function add(t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); L[i] += v * gl; R[i] += v * gr; }
}
const pad = (f, d) => (t) => {
  const env = Math.min(1, t / 0.9) * Math.min(1, (d - t) / 1.1);
  return env * (Math.sin(2 * Math.PI * f * (1 + 0.002 * Math.sin(t * 5.1)) * t) + 0.3 * Math.sin(4 * Math.PI * f * t + 0.3) + 0.12 * Math.sin(6 * Math.PI * f * 1.001 * t));
};
const pluck = (f) => (t) => Math.exp(-t * 6) * Math.min(1, t / 0.004) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.exp(-t * 20) * Math.sin(2 * Math.PI * f * 4 * t));
const bell = (f) => (t) => Math.exp(-t * 2.2) * Math.min(1, t / 0.003) * (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * 4));
const bass = (f, d) => (t) => Math.min(1, t / 0.02) * Math.min(1, (d - t) / 0.3) * Math.exp(-t * 0.5) * (Math.sin(2 * Math.PI * f * t) + 0.2 * Math.sin(4 * Math.PI * f * t));
const kick = (t) => Math.exp(-t * 16) * Math.sin(2 * Math.PI * 55 * (1 + 1.5 * Math.exp(-t * 35)) * t);

const CH = { Am: [45, 57, 60, 64], F: [41, 57, 60, 65], C: [48, 55, 60, 64], G: [43, 55, 59, 62], Dm: [38, 57, 62, 65], E: [40, 56, 59, 64], Em: [40, 55, 59, 64] };
const BAR = 2.4; // 100 bpm, 4/4
// [start, chord, style]: hook · science · the hours · MsgHealth · end
const plan = [];
const run = (t0, t1, seq, style) => { for (let t = t0, i = 0; t < t1 - 0.01; t += BAR, i++) plan.push([t, Math.min(BAR, t1 - t), seq[i % seq.length], style]); };
run(0, 7.0, ['Am', 'F', 'C'], 'hook');
run(7.0, 30.6, ['Am', 'F', 'C', 'G'], 'science');
run(30.6, 44.6, ['Dm', 'Am', 'E', 'Am', 'Dm', 'E'], 'hours');
run(44.6, 57.8, ['C', 'G', 'Am', 'F'], 'lift');
plan.push([57.8, 5.2, 'C', 'end']);
for (const [t0, d, ch, style] of plan) {
  const notes = CH[ch];
  const pg = style === 'lift' ? 0.06 : style === 'end' ? 0.07 : 0.045;
  notes.slice(1).forEach((m, i) => add(t0, d + 0.6, pad(mtof(m), d + 0.6), pg, -0.4 + i * 0.4));
  if (style !== 'hook') add(t0, d, bass(mtof(notes[0]), d), style === 'lift' ? 0.16 : 0.1);
  const arp = [notes[1], notes[2], notes[3], notes[2] + 12, notes[3], notes[2], notes[1] + 12, notes[3]];
  const step = style === 'lift' || style === 'hours' ? BAR / 8 : BAR / 4;
  const g = { hook: 0.05, science: 0.06, hours: 0.05, lift: 0.08, end: 0 }[style];
  for (let k = 0; k * step < d - 0.01 && g; k++) add(t0 + k * step, 1.2, (style === 'science' ? bell : pluck)(mtof(arp[k % 8] + 12)), g, k % 2 ? 0.35 : -0.35);
  if (style === 'lift') for (let k = 0; k < 4; k++) add(t0 + k * BAR / 4, 0.4, kick, 0.22);
  if (style === 'hours') for (let k = 0; k < 4; k++) add(t0 + k * BAR / 4, 0.4, kick, 0.12);
}
add(57.8, 4.5, bell(mtof(84)), 0.09); add(57.8, 4.5, bell(mtof(79)), 0.07, 0.3);
// a soft electric hum under the field, swelling while the finger is down
add(17.6, 13.0, (t) => Math.min(1, t / 1.2) * Math.min(1, (13.0 - t) / 0.8) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 3 * t)) * (Math.sin(2 * Math.PI * 110 * t) + 0.3 * Math.sin(2 * Math.PI * 220 * t)), 0.035);

function reverb(x, mix = 0.22) {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const o = new Float32Array(x.length);
  for (let n = 0; n < x.length; n++) {
    let s = 0;
    for (const c of combs) { const y = c.b[c.i]; c.b[c.i] = x[n] + y * 0.8; c.i = (c.i + 1) % c.d; s += y; }
    s *= 0.25;
    for (const a of aps) { const y = a.b[a.i]; const v = -s + y; a.b[a.i] = s + y * 0.5; a.i = (a.i + 1) % a.d; s = v; }
    o[n] = x[n] * (1 - mix) + s * mix * 1.8;
  }
  return o;
}
const Lr = reverb(L), Rr = reverb(R, 0.24);
const buf = Buffer.alloc(44 + N * 4);
buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8);
buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  const t = n / SR, g = Math.min(1, t / 0.6) * Math.min(1, (DUR - t) / 1.0) * 1.5;
  buf.writeInt16LE(Math.round(Math.tanh(Lr[n] * g) * 32000), 44 + n * 4);
  buf.writeInt16LE(Math.round(Math.tanh(Rr[n] * g) * 32000), 46 + n * 4);
}
const bed = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'msgh-bed-')), 'bed.wav');
fs.writeFileSync(bed, buf);

// ── mix the effects over the bed ─────────────────────────────────────────────
const kinds = Object.keys(SOUNDS).filter((k) => sfx.some((c) => c.kind === k));
const inputs = ['-i', bed];
kinds.forEach((k) => inputs.push('-i', path.join(ROOT, 'assets/audio', SOUNDS[k].file)));
const graph = [`[0:a]aresample=${SR}[bed]`], mixIn = ['[bed]'];
kinds.forEach((k, ki) => {
  const cues = sfx.filter((c) => c.kind === k);
  graph.push(`[${ki + 1}:a]aresample=${SR},asplit=${cues.length}${cues.map((_, i) => `[${k}${i}]`).join('')}`);
  cues.forEach((c, i) => {
    const start = c.t - SOUNDS[k].anchor, ms = Math.max(0, Math.round(start * 1000));
    const skip = start < 0 ? `,atrim=start=${(-start).toFixed(3)},asetpts=PTS-STARTPTS` : '';
    graph.push(`[${k}${i}]volume=${(SOUNDS[k].gain * (c.gain ?? 1)).toFixed(3)}${skip},adelay=${ms}|${ms}[${k}d${i}]`);
    mixIn.push(`[${k}d${i}]`);
  });
});
graph.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0:duration=first,atrim=0:${DUR.toFixed(3)}[out]`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph.join(';'), '-map', '[out]', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
fs.rmSync(path.dirname(bed), { recursive: true, force: true });
console.log(`audio → ${out}  (${kinds.map((k) => `${sfx.filter((c) => c.kind === k).length} ${k}`).join(', ')})`);
