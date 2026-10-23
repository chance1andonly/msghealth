// Builds the "Every touch" soundtrack: the supplied instrumental (assets/audio/screen-track.m4a, cut from 16 s
// into the supplied clip, where the drop hits) with sound effects cut from the supplied "sound effects you need
// as an editor" reel (assets/audio/fx-*.wav), each placed so its anchor (attack or peak) lands on its cue. Cues come from the film itself (window.SFX in src/screen.js).
//   node scripts/screen-audio.mjs dist/screen-audio.wav
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/screen-audio.wav');
const SR = 48000;
const FADE = 0.6; // the track carries on past the film; fade it out over the last beat
// file, where its anchor sits inside the file (s), gain
const SOUNDS = {
  tap: { file: 'fx-tap.wav', anchor: 0.046, gain: 1 },                       // anchor = attack
  key: { file: 'fx-key.wav', anchor: 0.036, gain: 1 },
  swoosh: { file: 'fx-swoosh.wav', anchor: 0.057, gain: 1 },                 // anchor = peak
  swish: { file: 'fx-swish.wav', anchor: 0.159, gain: 1 },
  transition: { file: 'fx-transition.wav', anchor: 0.242, gain: 1 },
  transitionHit: { file: 'fx-transition-hit.wav', anchor: 0.62, gain: 1 },   // anchor = the hit at the end of the build
  ding: { file: 'fx-ding.wav', anchor: 0.058, gain: 1 },
  cash: { file: 'fx-cash.wav', anchor: 0.037, gain: 1 },
  notification: { file: 'fx-notification.wav', anchor: 0.043, gain: 1 },
  bang: { file: 'fx-bang.wav', anchor: 0.083, gain: 1 },
};

const film = await openFilm('screen.html');
const { sfx, duration } = await film.page.evaluate(() => ({ sfx: window.SFX, duration: DURATION }));
await film.close();

const kinds = Object.keys(SOUNDS).filter((k) => sfx.some((c) => c.kind === k));
const unknown = [...new Set(sfx.map((c) => c.kind))].filter((k) => !SOUNDS[k]);
if (unknown.length) throw new Error(`no sound for cue kind(s): ${unknown.join(', ')}`);
const inputs = ['-i', path.join(ROOT, 'assets/audio/screen-track.m4a')];
kinds.forEach((k) => inputs.push('-i', path.join(ROOT, 'assets/audio', SOUNDS[k].file)));
// The track is mastered loud (about -9.6 LUFS) and the effects came from a quiet reel: the music drops ~7 dB and every
// effect comes up ~8 dB so they sit on top of the beat; the limiter catches the peaks and the mix lands near -14 LUFS.
// MUSIC_GAIN=0 renders the effects alone, for checking levels.
const MUSIC_GAIN = +(process.env.MUSIC_GAIN ?? 0.45), FX_GAIN = 2.5;
const graph = [`[0:a]aresample=${SR},volume=${MUSIC_GAIN}[music]`], mixIn = ['[music]'];
kinds.forEach((k, ki) => {
  const cues = sfx.filter((c) => c.kind === k);
  graph.push(`[${ki + 1}:a]aresample=${SR},asplit=${cues.length}${cues.map((_, i) => `[${k}${i}]`).join('')}`);
  cues.forEach((c, i) => {
    const start = c.t - SOUNDS[k].anchor, ms = Math.max(0, Math.round(start * 1000));
    const skip = start < 0 ? `,atrim=start=${(-start).toFixed(3)},asetpts=PTS-STARTPTS` : '';
    graph.push(`[${k}${i}]volume=${(FX_GAIN * SOUNDS[k].gain * (c.gain ?? 1)).toFixed(3)}${skip},adelay=${ms}|${ms}[${k}d${i}]`);
    mixIn.push(`[${k}d${i}]`);
  });
});
graph.push(`${mixIn.join('')}amix=inputs=${mixIn.length}:normalize=0:duration=first,alimiter=limit=0.9:level=disabled,` +
  `afade=t=out:st=${(duration - FADE).toFixed(3)}:d=${FADE},atrim=0:${duration.toFixed(3)}[out]`);
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', ...inputs, '-filter_complex', graph.join(';'), '-map', '[out]', '-ac', '2', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
console.log(`audio → ${out}  (${kinds.map((k) => `${sfx.filter((c) => c.kind === k).length} ${k}`).join(', ')})`);
