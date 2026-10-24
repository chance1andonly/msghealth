// Synthesises the "Every touch" voiceover with Kokoro TTS (Apache-2.0), one file per line, into assets/audio/vo/
// plus vo.json (each line's file and start time). Lines and their timing windows come from window.VO in
// src/screen.js; a line that runs longer than its window is sped up to fit (pitch kept). The render only needs the
// generated files.
//   KOKORO_DIR=/path/to/model-files node scripts/screen-vo.mjs          (VOICE=am_michael, SPEED=1.08 by default)
// Needs `pip install kokoro-onnx soundfile` and kokoro-v1.0.onnx + voices-v1.0.bin in KOKORO_DIR.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { openFilm, ROOT } from './lib.mjs';

const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const KOKORO = process.env.KOKORO_DIR, VOICE = process.env.VOICE || 'am_michael', SPEED = process.env.SPEED || '1.08';
if (!KOKORO) throw new Error('set KOKORO_DIR to the folder holding kokoro-v1.0.onnx and voices-v1.0.bin');
const DIR = path.join(ROOT, 'assets/audio/vo');
const MAX_TEMPO = 1.2; // faster than this starts to sound rushed

const film = await openFilm('screen.html');
const lines = await film.page.evaluate(() => window.VO);
await film.close();
fs.mkdirSync(DIR, { recursive: true });
const dur = (f) => +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString();
let prevEnd = 0;
const out = lines.map((l, i) => {
  const raw = path.join(DIR, `raw-${i}.wav`), file = `vo-${String(i + 1).padStart(2, '0')}.wav`;
  execFileSync('python3', [path.join(ROOT, 'scripts/tts-kokoro.py'), path.join(KOKORO, 'kokoro-v1.0.onnx'), path.join(KOKORO, 'voices-v1.0.bin'), VOICE, SPEED, raw], { input: l.text });
  const d = dur(raw), room = l.until - l.at, tempo = Math.min(MAX_TEMPO, Math.max(1, d / room));
  if (d / tempo > room + 0.05) console.warn(`line ${i + 1} runs ${(d / tempo - room).toFixed(2)} s past its window: "${l.text}"`);
  const at = Math.max(l.at, prevEnd + 0.12); // a line that overran pushes the next one back, so lines never overlap
  // trim leading/trailing silence, fit the window, level each line to the same loudness
  execFileSync(FFMPEG, ['-v', 'error', '-y', '-i', raw, '-af',
    `silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,atempo=${tempo.toFixed(3)},loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000`,
    '-ac', '1', '-c:a', 'pcm_s16le', path.join(DIR, file)]);
  fs.rmSync(raw);
  const d2 = dur(path.join(DIR, file)); prevEnd = at + d2;
  console.log(`${file}  ${at.toFixed(2)}s  ${d2.toFixed(2)}/${room.toFixed(2)}s${tempo > 1 ? `  ×${tempo.toFixed(2)}` : ''}${at > l.at ? `  (+${(at - l.at).toFixed(2)} s)` : ''}  ${l.text}`);
  return { file, at: +at.toFixed(3), text: l.text };
});
fs.writeFileSync(path.join(DIR, 'vo.json'), JSON.stringify(out, null, 2) + '\n');
