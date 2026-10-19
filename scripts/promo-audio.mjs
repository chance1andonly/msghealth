// Builds the promo soundtrack: the music track, muffled across one bar, plus the iPhone
// "message sent" sound for each hook bubble, faded out at the end.
// Cues come from the film itself (window.SFX, window.MUFFLE in src/promo.js).
//   node scripts/promo-audio.mjs dist/promo-audio.wav
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const out = process.argv[2] || path.join(ROOT, 'dist/promo-audio.wav');
const SR = 48000;
const SENT_PEAK = 0.203; // where the swoosh peaks inside assets/audio/message-sent.wav; lands on the cue

const film = await openFilm('promo.html');
const { sfx, muffle, duration } = await film.page.evaluate(() => ({ sfx: window.SFX, muffle: window.MUFFLE, duration: DURATION }));
await film.close();

const [a, b] = muffle;
const m = `min(clip((t-${a.toFixed(3)})/0.08,0,1),clip((${b.toFixed(3)}-t)/0.06,0,1))`;
const sent = sfx.filter((c) => c.kind === 'sent');
const graph = [
  `[0:a]aresample=${SR},asplit=2[d][w]`,
  `[w]lowpass=f=420,lowpass=f=420,volume=1.35,volume='${m}':eval=frame[wm]`,
  `[d]volume='1-${m}':eval=frame[dm]`,
  `[1:a]aresample=${SR},asplit=${sent.length}${sent.map((_, i) => `[s${i}]`).join('')}`,
  ...sent.map((c, i) => { const ms = Math.max(0, Math.round((c.t - SENT_PEAK) * 1000)); return `[s${i}]adelay=${ms}|${ms},volume=0.9[d${i}]`; }),
  `[dm][wm]${sent.map((_, i) => `[d${i}]`).join('')}amix=inputs=${2 + sent.length}:normalize=0:duration=first,` +
    `afade=t=out:st=${(duration - 1.9).toFixed(3)}:d=1.9,atrim=0:${duration.toFixed(3)}[out]`,
].join(';');
execFileSync(FFMPEG, ['-loglevel', 'error', '-y', '-i', path.join(ROOT, 'assets/audio/promo-track.m4a'), '-i', path.join(ROOT, 'assets/audio/message-sent.wav'),
  '-filter_complex', graph, '-map', '[out]', '-c:a', 'pcm_s16le', out], { stdio: 'inherit' });
console.log(`audio → ${out}  (${sent.length} sent sounds, muffled ${a.toFixed(2)}–${b.toFixed(2)}s)`);
