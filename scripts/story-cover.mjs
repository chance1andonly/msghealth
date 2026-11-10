// Saves the cover image for the "Our story" post:  node scripts/story-cover.mjs  →  dist/msghealth-story-cover.jpg
import fs from 'node:fs';
import path from 'node:path';
import { openFilm, ROOT } from './lib.mjs';
const film = await openFilm('story-captions.html');
const b64 = await film.page.evaluate(() => { window.renderCover(); return document.getElementById('c').toDataURL('image/jpeg', 0.95).split(',')[1]; });
const out = path.join(ROOT, 'dist/msghealth-story-cover.jpg');
fs.writeFileSync(out, Buffer.from(b64, 'base64')); console.log('cover →', out);
await film.close();
