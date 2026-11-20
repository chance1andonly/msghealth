// Quiet SFX mix for motion films. cues: [time_of_visual_moment, sfx_id, gain_dB]. start = time - sync (from assets/sfx/manifest.json)
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [name, out] = process.argv.slice(2);
const M = JSON.parse(fs.readFileSync('assets/sfx/manifest.json'));
const CUES = { sting: (() => {
  const c = [[0.12, 'whoosh-medium-soft', -14], [0.45, 'pop-small-in', -22], [1.5, 'swish-soft', -20], [1.95, 'click-hover-soft', -18], [2.2, 'click-mouse-soft', -12],
    [2.4, 'pop-medium-in', -16], [2.4, 'whoosh-fast-soft', -16], [2.6, 'pop-small-in', -22], [2.7, 'pop-small-in', -23], [2.8, 'pop-small-in', -24], [2.9, 'pop-small-in', -25],
    [3.05, 'swish-soft', -20], [3.4, 'whoosh-fast-soft', -16], [3.7, 'click-mouse-soft', -14], [3.75, 'whoosh-medium-soft', -18], [4.05, 'pop-large-in', -18],
    [5.15, 'click-button-soft', -16], [5.2, 'whoosh-medium-soft', -15], [5.3, 'notification-message-out-soft', -22], [6.0, 'swipe-medium-soft', -22],
    [6.9, 'whoosh-fast-soft', -16], [7.0, 'swipe-medium-soft', -20], [7.5, 'notification-message-in-soft', -20], [8.2, 'whoosh-medium-soft', -16], [8.6, 'pop-medium-in', -22], [8.75, 'pop-medium-in', -24],
    [10.0, 'whoosh-fast-soft', -16], [10.0, 'pop-medium-in', -20], [10.9, 'shimmer-short-soft', -16], [10.9, 'pop-large-in', -22]];
  for (let i = 0; i < 33; i++) c.push([4.2 + i * 0.027 + (i % 3 ? 0 : 0.01), 'keyboard-letter-soft', -32 - (i % 4)]);
  return c; })() };
const cues = CUES[name]; const args = ['-loglevel', 'error', '-y']; const fl = []; const labels = [];
cues.forEach(([t, id, db], i) => { args.push('-i', `assets/sfx/${id}.wav`); const ms = Math.max(0, Math.round((t - M[id].sync) * 1000)); fl.push(`[${i}:a]volume=${db}dB,adelay=${ms}|${ms}[c${i}]`); labels.push(`[c${i}]`); });
// soft bed: A2 + E3 + A3 + C#4, slow swell, ducked to near nothing
const n = cues.length, DUR = 12.05;
args.push('-f', 'lavfi', '-i', `aevalsrc=0.5*(sin(2*PI*110*t)+0.7*sin(2*PI*164.81*t)+0.5*sin(2*PI*220*t)+0.35*sin(2*PI*277.18*t)*(0.6+0.4*sin(2*PI*0.25*t))):d=${DUR}:s=48000`);
fl.push(`[${n}:a]volume=-34dB,afade=t=in:d=1.2,afade=t=out:st=${DUR - 0.6}:d=0.6[bed]`);
fl.push(`${labels.join('')}[bed]amix=inputs=${n + 1}:normalize=0,loudnorm=I=-18:TP=-2:LRA=7,atrim=0:${DUR},apad=whole_dur=${DUR}[o]`);
args.push('-filter_complex', fl.join(';'), '-map', '[o]', '-ac', '2', '-ar', '48000', out);
execFileSync('ffmpeg', args); console.log('audio ok', cues.length, 'cues');
