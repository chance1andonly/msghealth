// Builds the "Every touch" soundtrack: the supplied instrumental (assets/audio/screen-track.m4a) with the
// sound effects cut from the supplied effects reel (assets/audio/fx-*.wav), each placed so its anchor
// (attack or peak) lands on its cue. Cues come from the film itself (window.SFX in src/screen.js).
//   node scripts/screen-audio.mjs dist/screen-audio.wav
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/screen-audio.wav');
const SR = 48000;
const FADE = 0.35; // the track's last bar ends right after the film; a short fade keeps the cut clean
// The supplied track sits around -23 LUFS; the mix is lifted ~7 dB into a limiter to land near the -14 LUFS social platforms play at.
// file, where its anchor sits inside the file (s), gain
const SOUNDS = {
  click: { file: 'fx-click.wav', anchor: 0.057, gain: 1 },         // anchor = attack
  shutter: { file: 'fx-shutter.wav', anchor: 0.37, gain: 1 },      // the shutter's main snap
  wrong: { file: 'fx-wrong.wav', anchor: 0.054, gain: 1 },
  ff: { file: 'fx-fast-forward.wav', anchor: 0.042, gain: 1 },
  coin: { file: 'fx-coin.wav', anchor: 0.046, gain: 1 },
  idea: { file: 'fx-good-idea.wav', anchor: 0.042, gain: 1 },
  riser: { file: 'fx-riser.wav', anchor: 2.489, gain: 1 },         // anchor = the top of the build
  notify: { file: 'fx-notify.wav', anchor: 0.049, gain: 1 },
  punch: { file: 'fx-punch.wav', anchor: 0.052, gain: 1 },
  whoosh: { file: 'fx-whoosh.wav', anchor: 0.283, gain: 1 },       // anchor = peak
  swoosh: { file: 'fx-swoosh.wav', anchor: 0.55, gain: 1 },        // anchor = peak
};

const film = await openFilm('screen.html');
const { sfx, duration } = await film.page.evaluate(() => ({ sfx: window.SFX, duration: DURATION }));
await film.close();

const kinds = Object.keys(SOUNDS).filter((k) => sfx.some((c) => c.kind === k));
const unknown = [...new Set(sfx.map((c) => c.kind))].filter((k) => !SOUNDS[k]);
if (unknown.length) throw new Error(`no sound for cue kind(s): ${unknown.join(', ')}`);
const inputs = ['-i', path.join(ROOT, 'assets/audio/screen-track.m4a')];
kinds.forEach((k) => inputs.push('-i', path.join(ROOT, 'assets/audio', SOUNDS[k].file)));
const graph = [`[0:a]aresample=${SR},volume=0.9[music]`], mixIn = ['[music]'];
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
graph.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0:duration=first,volume=2.2,alimiter=limit=0.9:level=disabled,` +
  `afade=t=out:st=${(duration - FADE).toFixed(3)}:d=${FADE},atrim=0:${duration.toFixed(3)}[out]`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
console.log(`audio → ${out}  (${kinds.map((k) => `${sfx.filter((c) => c.kind === k).length} ${k}`).join(', ')})`);
