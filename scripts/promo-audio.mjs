// Builds the promo soundtrack: the music track (muffled across one bar, faded at the end) plus the
// sound effects, each placed so its "anchor" (attack or peak) lands exactly on its cue.
// Cues come from the film itself (window.SFX, window.MUFFLE in src/promo.js).
//   node scripts/promo-audio.mjs dist/promo-audio.wav
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/promo-audio.wav');
const SR = 48000;
// file, where its anchor sits inside the file (s), gain
const SOUNDS = {
  sent: { file: 'message-sent.wav', anchor: 0.203, gain: 0.9 },   // anchor = the swoosh's peak
  click: { file: 'mouse-click.wav', anchor: 0.01, gain: 0.85 },   // anchor = the click's attack
  flash: { file: 'camera-flash.wav', anchor: 0.01, gain: 0.9 },   // anchor = the shutter's attack
  snap: { file: 'snap.wav', anchor: 0.01, gain: 0.9 },            // anchor = the snap's attack
  whoosh: { file: 'whoosh.wav', anchor: 0.339, gain: 0.7 },       // anchor = the whoosh's peak (trimmed to its core)
};

const film = await openFilm('promo.html');
const { sfx, muffle, duration } = await film.page.evaluate(() => ({ sfx: window.SFX, muffle: window.MUFFLE, duration: DURATION }));
await film.close();

const kinds = Object.keys(SOUNDS);
const inputs = ['-i', path.join(ROOT, 'assets/audio/promo-track.m4a')];
kinds.forEach((k) => inputs.push('-i', path.join(ROOT, 'assets/audio', SOUNDS[k].file)));
const [a, b] = muffle;
const m = `min(clip((t-${a.toFixed(3)})/0.08,0,1),clip((${b.toFixed(3)}-t)/0.06,0,1))`;
const graph = [
  `[0:a]aresample=${SR},asplit=2[d][w]`,
  `[w]lowpass=f=420,lowpass=f=420,volume=1.35,volume='${m}':eval=frame[wm]`,
  `[d]volume='1-${m}':eval=frame[dm]`,
];
const mixIn = ['[dm]', '[wm]'];
kinds.forEach((k, ki) => {
  const cues = sfx.filter((c) => c.kind === k);
  if (!cues.length) return;
  graph.push(`[${ki + 1}:a]aresample=${SR},asplit=${cues.length}${cues.map((_, i) => `[${k}${i}]`).join('')}`);
  cues.forEach((c, i) => {
    const start = c.t - SOUNDS[k].anchor, ms = Math.max(0, Math.round(start * 1000));
    const skip = start < 0 ? `,atrim=start=${(-start).toFixed(3)},asetpts=PTS-STARTPTS` : '';
    graph.push(`[${k}${i}]volume=${SOUNDS[k].gain}${skip},adelay=${ms}|${ms}[${k}d${i}]`);
    mixIn.push(`[${k}d${i}]`);
  });
});
graph.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0:duration=first,` +
  `afade=t=out:st=${(duration - 1.9).toFixed(3)}:d=1.9,atrim=0:${duration.toFixed(3)}[out]`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph.join(';'), '-map', '[out]', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
console.log(`audio → ${out}  (${kinds.map((k) => `${sfx.filter((c) => c.kind === k).length} ${k}`).join(', ')}; muffled ${a.toFixed(2)}–${b.toFixed(2)}s)`);
