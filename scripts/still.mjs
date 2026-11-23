// Render still frames of a reel at given times (seconds) for quick checks: ENTRY=x.html node scripts/still.mjs OUTDIR t1 t2 ...
import fs from 'node:fs'; import path from 'node:path';
import { openFilm } from './lib.mjs';
const [out, ...ts] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const film = await openFilm(process.env.ENTRY);
for (const t of ts) fs.writeFileSync(path.join(out, `t${(+t).toFixed(2).padStart(6, '0')}.jpg`), await film.frame(+t, 'image/jpeg', 0.9));
await film.close();
