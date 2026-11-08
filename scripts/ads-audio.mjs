// Builds the soundtrack for the kit ads (qr.html, jet.html, shed.html): a small synthesised bed (pad, bass, plucks; mood
// and tempo come from window.MUSIC), sound effects from assets/audio/fx-*.wav, and the voiceover clips. The bed ducks
// under the voice and drops to a quiet level once the MsgHealth logo lands.
//   ENTRY=qr.html node scripts/ads-audio.mjs dist/qr-audio.wav
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const entry = process.env.ENTRY || 'qr.html';
const out = process.argv[2] || path.join(ROOT, `dist/${entry.replace('.html', '')}-audio.wav`);
const film = await openFilm(entry);
const { sfx, vo, DUR, M } = await film.page.evaluate(() => ({ sfx: window.SFX, vo: window.VO, DUR: DURATION, M: window.MUSIC }));
await film.close();

const SR = 48000, N = Math.ceil(SR * DUR);
const MUS = [new Float32Array(N), new Float32Array(N)];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
function add(t0, dur, fn, gain = 1, pan = 0) {
  const s0 = Math.max(0, Math.floor(t0 * SR)), s1 = Math.min(N, Math.floor((t0 + dur) * SR));
  const gl = gain * Math.cos((pan + 1) * Math.PI / 4), gr = gain * Math.sin((pan + 1) * Math.PI / 4);
  for (let i = s0; i < s1; i++) { const v = fn((i - s0) / SR); MUS[0][i] += v * gl; MUS[1][i] += v * gr; }
}
const env = (t, a, d) => Math.min(1, t / a) * Math.exp(-t * d);
const pluck = (f, d = 7) => (t) => env(t, 0.004, d) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.exp(-t * 20) * Math.sin(2 * Math.PI * f * 2 * t));
const sub = (f, d = 5) => (t) => env(t, 0.008, d) * Math.sin(2 * Math.PI * f * t);
const tri = (p) => 2 * Math.abs(2 * (p - Math.floor(p + 0.5))) - 1;
const beat = 60 / M.bpm, root = M.root;
const MOODS = { // scale degrees (semitones) for the chord roots and the pluck pattern
  sneaky: { chords: [0, -2, -4, -2], scale: [0, 3, 5, 7, 10], swing: 0 }, bouncy: { chords: [0, 5, 7, 5], scale: [0, 4, 7, 9, 12], swing: 0.08 }, quirky: { chords: [0, 7, 5, 3], scale: [0, 2, 5, 7, 9], swing: 0.05 },
};
const mood = MOODS[M.mood] ?? MOODS.sneaky;
for (let b = 0; b * beat * 4 < DUR; b++) {
  const t0 = b * beat * 4, r = root + mood.chords[b % 4];
  add(t0, beat * 4 + 0.3, (t) => { const e = Math.min(1, t / 0.4) * Math.min(1, (beat * 4 + 0.3 - t) / 0.4); return e * [0, 7, 12].reduce((s, d) => s + tri(mtof(r + 12 + d) * t) + tri(mtof(r + 12 + d) * 1.004 * t), 0) / 6; }, 0.05);
  for (let k = 0; k < 8; k++) {
    const t = t0 + k * beat / 2 + (k % 2 ? mood.swing * beat : 0);
    if (k % 2 === 0) add(t, 0.4, sub(mtof(r - 12), 6), 0.3);
    const n = mood.scale[Math.floor(hash(b * 8 + k) * mood.scale.length)];
    if (k % 3 !== 1) add(t, 0.5, pluck(mtof(r + 12 + n), 8), 0.06, k % 2 ? 0.4 : -0.4);
  }
}
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
for (let n = 0; n < N; n++) { const t = n / SR, g = t < M.brandAt ? 1 : Math.max(0.35, 1 - (t - M.brandAt) / 0.25); MUS[0][n] *= g; MUS[1][n] *= g; }

if (M.bed === false) { MUS[0].fill(0); MUS[1].fill(0); } // ads whose music is added later
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kitads-'));
{ const buf = Buffer.alloc(44 + N * 4); buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let n = 0; n < N; n++) { buf.writeInt16LE(Math.round(Math.tanh(MUS[0][n]) * 32000), 44 + n * 4); buf.writeInt16LE(Math.round(Math.tanh(MUS[1][n]) * 32000), 46 + n * 4); }
  fs.writeFileSync(path.join(TMP, 'music.wav'), buf); }

const SOUNDS = {
  swoosh: { file: 'fx-swoosh.wav', anchor: 0.057 }, swish: { file: 'fx-swish.wav', anchor: 0.159 }, transition: { file: 'fx-transition.wav', anchor: 0.242 },
  transitionHit: { file: 'fx-transition-hit.wav', anchor: 0.62, skip: 0.36 }, key: { file: 'fx-key.wav', anchor: 0.036 }, ding: { file: 'fx-ding.wav', anchor: 0.058 },
  notification: { file: 'fx-notification.wav', anchor: 0.043 }, punch: { file: 'fx-punch.wav', anchor: 0.052 }, tap: { file: 'fx-tap.wav', anchor: 0.046 },
};
const unknown = [...new Set(sfx.map((c) => c.kind))].filter((k) => !SOUNDS[k]);
if (unknown.length) throw new Error(`no sound for cue kind(s): ${unknown.join(', ')}`);
const kinds = Object.keys(SOUNDS).filter((k) => sfx.some((c) => c.kind === k));
const inputs = ['-i', path.join(TMP, 'music.wav')];
vo.forEach((v) => inputs.push('-i', path.join(ROOT, v.file)));
kinds.forEach((k) => inputs.push('-i', path.join(ROOT, 'assets/audio', SOUNDS[k].file)));
const FX_GAIN = 2.0 * (M.fx ?? 1), VO_GAIN = 1.5, graph = [], voIn = [], fxIn = [];
vo.forEach((v, i) => { const ms = Math.round(v.at * 1000); graph.push(`[${i + 1}:a]aresample=${SR},pan=stereo|c0=c0|c1=c0,volume=${VO_GAIN},adelay=${ms}|${ms}[vo${i}]`); voIn.push(`[vo${i}]`); });
kinds.forEach((k, ki) => {
  const cues = sfx.filter((c) => c.kind === k), idx = ki + 1 + vo.length;
  graph.push(`[${idx}:a]aresample=${SR},asplit=${cues.length}${cues.map((_, i) => `[${k}${i}]`).join('')}`);
  cues.forEach((c, i) => {
    const lead = SOUNDS[k].skip ?? 0, start = c.t - SOUNDS[k].anchor + lead, ms = Math.max(0, Math.round(start * 1000)), cut = lead + Math.max(0, -start);
    graph.push(`[${k}${i}]volume=${(FX_GAIN * (c.gain ?? 1)).toFixed(3)}${cut > 0 ? `,atrim=start=${cut.toFixed(3)},asetpts=PTS-STARTPTS` : ''},adelay=${ms}|${ms}[${k}d${i}]`);
    fxIn.push(`[${k}d${i}]`);
  });
});
graph.push(`${voIn.join('')}amix=inputs=${voIn.length}:normalize=0:duration=longest,apad=whole_dur=${DUR},asplit=2[voice][key]`);
graph.push(`[0:a][key]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=280:makeup=1[duck]`);
graph.push(`[duck][voice]${fxIn.join('')}amix=inputs=${2 + fxIn.length}:normalize=0:duration=first,alimiter=limit=0.89:level=disabled,afade=t=out:st=${(DUR - 0.6).toFixed(3)}:d=0.6,atrim=0:${DUR.toFixed(3)}[out]`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
fs.rmSync(TMP, { recursive: true, force: true });
console.log(`audio → ${out}  (${vo.length} voice clips, ${sfx.length} effects)`);
