// Builds the soundtrack for "Uranus" (uranus.html): a synthesised score (a tense drone and countdown, a spacey pad,
// a ticking clock, then the MsgHealth groove), laser zaps, sound effects from assets/audio/fx-*.wav, and the voiceover
// clips (assets/audio/uranus/vo-NN.wav).
// Everything is timed from the film itself: window.CUES (story beats), window.SFX (effects), window.VO (clips).
// The score ducks under the voice.
//   node scripts/uranus-audio.mjs dist/uranus-audio.wav
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/uranus-audio.wav');
const film = await openFilm('uranus.html');
const { T, sfx, vo, DUR } = await film.page.evaluate(() => ({ T: window.CUES, sfx: window.SFX, vo: window.VO, DUR: DURATION }));
await film.close();

// ── synthesis ────────────────────────────────────────────────────────────────
const SR = 48000, N = Math.ceil(SR * DUR);
const MUS = [new Float32Array(N), new Float32Array(N)], AMB = [new Float32Array(N), new Float32Array(N)];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seed = 13; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
function add(bus, t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); bus[0][i] += v * gl; bus[1][i] += v * gr; }
}
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
const pluck = (f, d = 7) => (t) => env(t, 0.004, d) * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.exp(-t * 20) * Math.sin(2 * Math.PI * f * 2 * t) + 0.12 * Math.exp(-t * 30) * Math.sin(2 * Math.PI * f * 3 * t));
const bell = (f, d = 3) => (t) => env(t, 0.002, d) * (Math.sin(2 * Math.PI * f * t) + 0.4 * Math.exp(-t * 3) * Math.sin(2 * Math.PI * f * 2.76 * t));
const sub = (f, d = 3) => (t) => env(t, 0.01, d) * Math.sin(2 * Math.PI * f * t);
const kick = () => (t) => Math.exp(-t * 9) * Math.sin(2 * Math.PI * (48 + 110 * Math.exp(-t * 32)) * t);
function noise(bus, t0, d, gain, decay, hp = 0.6, pan = 0) { let y = 0; add(bus, t0, d, (t) => { const x = rnd(); const v = x - y * hp; y = x; return v * Math.exp(-t * decay); }, gain, pan); }
function pad(bus, t0, d, notes, gain) { // soft detuned triangle chord with slow attack
  const tri = (p) => 2 * Math.abs(2 * (p - Math.floor(p + 0.5))) - 1;
  add(bus, t0, d, (t) => { const e = Math.min(1, t / 0.8) * Math.min(1, (d - t) / 0.6); let v = 0; notes.forEach((m) => { const f = mtof(m); v += tri(f * t) + tri(f * 1.004 * t); }); return v * e / notes.length; }, gain);
}

// Act 1 · the crowd: a low drone and a pulse that tightens through the countdown.
{
  pad(MUS, 0, T.space, [33, 40, 45], 0.05);
  for (let t = 0.2, k = 0; t < T.three - 0.1; t += 60 / 92, k++) { add(MUS, t, 0.4, sub(mtof(33), 6), 0.35); if (k % 2) noise(MUS, t, 0.05, 0.04, 80, 0.95, 0.2); }
  // a rising noise swell under the pull-back
  { let y = 0; add(AMB, T.on, T.fire - T.on, (x) => { y = y * 0.9 + rnd() * 0.1; return y * Math.pow(x / (T.fire - T.on), 2); }, 0.9); }
  // the countdown: a low hit and a bright tick on each number
  [T.three, T.two, T.one].forEach((t, i) => { add(MUS, t, 0.6, kick(), 0.55); add(MUS, t, 0.25, bell(mtof(81 + i * 2), 14), 0.12); });
  // "FIRE!": a boom and a spray of laser zaps
  add(MUS, T.fire, 1.2, kick(), 0.9); noise(AMB, T.fire, 1.0, 0.35, 4, 0.3);
  for (let i = 0; i < 18; i++) { const t0 = T.fire + hash01(i) * 0.6, f0 = 2400 + hash01(i + 9) * 1800; add(AMB, t0, 0.35, (x) => Math.sin(2 * Math.PI * (f0 * x - 2600 * x * x)) * Math.exp(-x * 9), 0.05, hash01(i + 3) * 1.6 - 0.8); }
  // the hero's pointer clicking on
  add(AMB, T.on, 0.5, (x) => Math.sin(2 * Math.PI * (1800 * x - 1200 * x * x)) * Math.exp(-x * 10), 0.06);
}
function hash01(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
// Space: a wide pad and a slow, sparse bell arpeggio (A minor), until the pivot.
{
  const chords = [[45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59], [40, 47, 52, 56]], bar = 60 / 84 * 4;
  for (let b = 0; T.space + b * bar < T.pivot; b++) {
    const t = T.space + b * bar, ch = chords[b % 4], d = Math.min(bar, T.pivot - t);
    pad(MUS, t, d + 0.4, ch, 0.05);
    add(MUS, t, d, sub(mtof(ch[0] - 12), 0.5), 0.18);
    for (let k = 0; k < 8; k++) { const tt = t + k * bar / 8; if (tt < T.pivot - 0.1 && (k % 3 !== 2)) add(MUS, tt, 1.6, bell(mtof(ch[[3, 2, 1, 2, 3, 1, 2, 0][k]] + 24), 3.5), 0.03, k % 2 ? 0.4 : -0.4); }
  }
  add(MUS, T.space, 2, kick(), 0.6);
}
// The clock: ticks through the six hours, then faster as it counts weeks; a low heartbeat under the lost customer.
for (let t = T.six, i = 0; t < T.brand - 0.35; i++) {
  add(AMB, t, 0.05, (x) => Math.exp(-x * 120) * Math.sin(2 * Math.PI * (i % 2 ? 2600 : 3100) * x), 0.08, i % 2 ? 0.2 : -0.2);
  t += t < T.pivot ? 0.25 : 0.16;
}
for (let t = T.pivot + 0.2; t < T.brand - 0.4; t += 0.85) { add(MUS, t, 0.3, kick(), 0.32); add(MUS, t + 0.22, 0.3, kick(), 0.2); }
pad(MUS, T.pivot, T.brand - T.pivot - 0.2, [38, 45, 50, 53], 0.045);
// Act 2 · MsgHealth: an upbeat groove (112 BPM) from the logo until the end card, which has no music.
{
  const beat = 60 / 112, chords = [[60, 64, 67, 72], [55, 59, 62, 67], [57, 60, 64, 69], [53, 57, 60, 65]];
  for (let k = 0; ; k++) {
    const t = T.brand + k * beat / 2; if (t >= T.end) break;
    const bar = Math.floor(k / 8), ch = chords[bar % 4], drop = false;
    if (!drop && k % 2 === 0) add(MUS, t, 0.45, kick(), 0.5);
    if (!drop && k % 4 === 2) noise(MUS, t, 0.25, 0.16, 18, 0.2);
    if (!drop) noise(MUS, t + (k % 2 ? 0.02 : 0), 0.06, 0.05, 70, 0.95, k % 2 ? 0.3 : -0.3);
    add(MUS, t, 0.7, pluck(mtof(ch[[0, 1, 2, 3, 2, 1, 2, 3][k % 8]] + 12), 5), 0.085, k % 2 ? 0.3 : -0.3);
    if (k % 8 === 0) add(MUS, t, beat * 4, sub(mtof(ch[0] - 24), 0.6), drop ? 0.12 : 0.3);
    if (k % 8 === 0) pad(MUS, t, beat * 4, ch, drop ? 0.06 : 0.035);
  }
}
// The booking: a bright little chord.
[84, 88, 91].forEach((m, i) => add(MUS, T.again + 0.42 + i * 0.06, 1.4, bell(mtof(m), 4), 0.06));

// The end card is music-free: whatever still rings at T.end fades out over 0.3 s.
for (let n = Math.floor(T.end * SR); n < N; n++) { const g = Math.max(0, 1 - (n / SR - T.end) / 0.3); MUS[0][n] *= g; MUS[1][n] *= g; }

// ── write the synth stems, then mix with ffmpeg ──────────────────────────────
function wav(file, L, R) {
  const buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let n = 0; n < N; n++) { buf.writeInt16LE(Math.round(Math.tanh(L[n]) * 32000), 44 + n * 4); buf.writeInt16LE(Math.round(Math.tanh(R[n]) * 32000), 46 + n * 4); }
  fs.writeFileSync(file, buf);
}
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'uranus-'));
wav(path.join(TMP, 'music.wav'), ...MUS); wav(path.join(TMP, 'amb.wav'), ...AMB);

const SOUNDS = { // file, where its anchor (attack or peak) sits inside the file, gain
  swoosh: { file: 'fx-swoosh.wav', anchor: 0.057, gain: 1 }, swish: { file: 'fx-swish.wav', anchor: 0.159, gain: 1 },
  transition: { file: 'fx-transition.wav', anchor: 0.242, gain: 1 }, transitionHit: { file: 'fx-transition-hit.wav', anchor: 0.62, gain: 1, skip: 0.36 }, // skip: the reel's narrator says "two" before the hit
  key: { file: 'fx-key.wav', anchor: 0.036, gain: 1 }, ding: { file: 'fx-ding.wav', anchor: 0.058, gain: 1 },
  notification: { file: 'fx-notification.wav', anchor: 0.043, gain: 1 }, punch: { file: 'fx-punch.wav', anchor: 0.052, gain: 1 },
  tap: { file: 'fx-tap.wav', anchor: 0.046, gain: 1 },
};
const unknown = [...new Set(sfx.map((c) => c.kind))].filter((k) => !SOUNDS[k]);
if (unknown.length) throw new Error(`no sound for cue kind(s): ${unknown.join(', ')}`);
const kinds = Object.keys(SOUNDS).filter((k) => sfx.some((c) => c.kind === k));
const inputs = ['-i', path.join(TMP, 'music.wav'), '-i', path.join(TMP, 'amb.wav')];
vo.forEach((v) => inputs.push('-i', path.join(ROOT, v.file)));
kinds.forEach((k) => inputs.push('-i', path.join(ROOT, 'assets/audio', SOUNDS[k].file)));
const FX_GAIN = 2.2, VO_GAIN = 1.5;
const graph = [], voIn = [], fxIn = [];
vo.forEach((v, i) => { const ms = Math.round(v.at * 1000); graph.push(`[${i + 2}:a]aresample=${SR},pan=stereo|c0=c0|c1=c0,volume=${VO_GAIN},adelay=${ms}|${ms}[vo${i}]`); voIn.push(`[vo${i}]`); });
kinds.forEach((k, ki) => {
  const cues = sfx.filter((c) => c.kind === k), idx = ki + 2 + vo.length;
  graph.push(`[${idx}:a]aresample=${SR},asplit=${cues.length}${cues.map((_, i) => `[${k}${i}]`).join('')}`);
  cues.forEach((c, i) => {
    const lead = SOUNDS[k].skip ?? 0, start = c.t - SOUNDS[k].anchor + lead, ms = Math.max(0, Math.round(start * 1000));
    const cut = lead + Math.max(0, -start), skip = cut > 0 ? `,atrim=start=${cut.toFixed(3)},asetpts=PTS-STARTPTS` : '';
    graph.push(`[${k}${i}]volume=${(FX_GAIN * SOUNDS[k].gain * (c.gain ?? 1)).toFixed(3)}${skip},adelay=${ms}|${ms}[${k}d${i}]`);
    fxIn.push(`[${k}d${i}]`);
  });
});
graph.push(`${voIn.join('')}amix=inputs=${voIn.length}:normalize=0:duration=longest,apad=whole_dur=${DUR},asplit=2[voice][key]`);
// the score ducks ~8 dB while the voice talks
graph.push(`[0:a][key]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=280:makeup=1[duck]`);
graph.push(`[duck][1:a][voice]${fxIn.join('')}amix=inputs=${3 + fxIn.length}:normalize=0:duration=first,alimiter=limit=0.89:level=disabled,` +
  `afade=t=out:st=${(DUR - 0.6).toFixed(3)}:d=0.6,atrim=0:${DUR.toFixed(3)}[out]`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`audio → ${out}  (${vo.length} voice clips, ${sfx.length} effects)`);
