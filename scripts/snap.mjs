// Save still frames for review:  node scripts/snap.mjs out/dir 3.5 12 40 ...
import fs from 'node:fs';
import path from 'node:path';
import { openFilm } from './lib.mjs';

const [dir, ...times] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const film = await openFilm();
for (const t of times) {
  const t0 = Date.now();
  const buf = await film.frame(+t);
  fs.writeFileSync(path.join(dir, `t${String(t).padStart(5, '0')}.jpg`), buf);
  console.log(`t=${t}s  ${Date.now() - t0}ms`);
}
await film.close();
