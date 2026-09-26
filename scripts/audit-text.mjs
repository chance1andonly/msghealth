// Text audit: samples the film and reports strings that are cropped by the frame
// (or the letterbox) and strings that overlap other strings.
//   node scripts/audit-text.mjs [step=0.25]
import { openFilm } from './lib.mjs';

const step = +(process.argv[2] ?? 0.25);
const film = await openFilm();
const TOP = 62, BOT = 1080 - 62, W = 1920;
const issues = new Map();
const note = (key, t) => { const v = issues.get(key); if (v) v.push(t); else issues.set(key, [t]); };
for (let t = 0; t < film.duration; t += step) {
  const log = await film.page.evaluate((t) => { window.TEXT_LOG = []; window.renderFrame(t); const l = window.TEXT_LOG; window.TEXT_LOG = null; return l; }, t);
  const vis = log.filter((b) => b.a > 0.25 && (b.layer === 'main' || b.layer === 4) && b.x1 - b.x0 > 3);
  const on = vis.filter((b) => b.x1 > 0 && b.x0 < W && b.y1 > TOP && b.y0 < BOT);
  for (const b of on) {
    if (b.x0 < -1 || b.x1 > W + 1 || b.y0 < TOP - 1 || b.y1 > BOT + 1) note(`CROPPED  "${b.str}"`, t);
  }
  for (let i = 0; i < on.length; i++) for (let j = i + 1; j < on.length; j++) {
    const a = on[i], b = on[j];
    const ix = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), iy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
    if (ix <= 2 || iy <= 2) continue;
    const small = Math.min((a.x1 - a.x0) * (a.y1 - a.y0), (b.x1 - b.x0) * (b.y1 - b.y0));
    if ((ix * iy) / small > 0.08) note(`OVERLAP  "${a.str}"  ×  "${b.str}"`, t);
  }
}
await film.close();
const fmt = (ts) => { const r = []; let s = ts[0], p = ts[0]; for (const x of ts.slice(1).concat(Infinity)) { if (x - p > step * 1.5) { r.push(s === p ? s.toFixed(2) : `${s.toFixed(2)}–${p.toFixed(2)}`); s = x; } p = x; } return r.join(', '); };
for (const [k, ts] of [...issues].sort((a, b) => a[1][0] - b[1][0])) console.log(`${k}   @ ${fmt(ts)}s`);
console.log(`\n${issues.size} issue(s)`);
