// MsgHealth · black/white documentary illustration helpers for 'art' scenes in src/hist.js (load before hist.js).
// Everything is drawn on kit.js's shared ctx, above the caption strip (keep art between y 240 and 1380).
'use strict';
const D_W = '#ffffff', D_L = '#d8d8d8', D_G = '#8c8c8c', D_D = '#4a4a4a', D_K = '#161616';
const dIn = (t, at, d = 0.35) => ease.out(seg(t, at, at + d));
// header: place and date, with short rules (documentary lower-third, kept at the top)
function dHead(s, a = 1) {
  withFade(a, () => { const w = tw(s, 38, 800, 0.14); text(s, CX, 300, 38, 800, D_W, 'center', 0.14); fillRR(CX - w / 2, 342, w, 4, 2, 'rgba(255,255,255,0.55)'); });
}
// a stamped label: white box, black words, slight tilt, slams in once
function dStamp(s, x, y, t, at, size = 62, rot = -0.05, inv = false) {
  const k = ease.back(seg(t, at, at + 0.3)); if (t < at) return;
  const w = tw(s, size, 900, 0.01) + size * 0.9, h = size * 1.5, sc = 1.35 - 0.35 * k;
  ctx.save(); ctx.globalAlpha *= clamp((t - at) / 0.12); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  fillRR(-w / 2, -h / 2, w, h, 10, inv ? '#000' : '#fff'); strokeRR(-w / 2, -h / 2, w, h, 10, inv ? '#fff' : '#000', 5);
  text(s, 0, 3, size, 900, inv ? '#fff' : '#000', 'center', 0.01); ctx.restore();
}
function dBig(s, y, t, at, size = 300, col = D_W) {
  const k = pop(t, at, 0.4); if (k <= 0) return;
  xf(CX, y, clamp(k), 0, () => text(s, CX, y, Math.min(size, size * 940 / tw(s, size, 900)), 900, col, 'center', -0.04));
}
// simple person, feet at (x, y), height h. o: { crown, arms: 'up'|'down'|'wave', rot, run }
function dMan(x, y, h, col = D_W, o = {}) {
  ctx.save(); ctx.translate(x, y - h / 2); ctx.rotate(o.rot || 0); ctx.translate(0, h / 2);
  const u = h / 100, ph = o.run || 0;
  line(-2 * u, -42 * u, (-14 - 12 * Math.sin(ph)) * u, -2 * u, col, 10 * u); line(2 * u, -42 * u, (14 + 12 * Math.sin(ph)) * u, -2 * u, col, 10 * u);
  fillRR(-14 * u, -74 * u, 28 * u, 38 * u, 11 * u, col);
  const up = o.arms === 'up' ? -1 : 1, wob = o.arms === 'up' ? Math.sin(ph * 1.3 + x) * 6 : 0;
  line(-11 * u, -68 * u, (-27 - wob) * u, (-68 + 26 * up) * u, col, 8 * u); line(11 * u, -68 * u, (27 + wob) * u, (-68 + 26 * up) * u, col, 8 * u);
  circle(0, -87 * u, 12.5 * u, col);
  if (o.crown) poly([[-12 * u, -97 * u], [-14 * u, -116 * u], [-6 * u, -107 * u], [0, -119 * u], [6 * u, -107 * u], [14 * u, -116 * u], [12 * u, -97 * u]], o.crownCol || D_W);
  ctx.restore();
}
// a counting number: every digit sits in a fixed slot so it does not jitter while it ticks
function dNum(s, y, size, col = D_W, x = CX) {
  const w = [...s].map((ch) => (/\d/.test(ch) ? size * 0.64 : /[,.]/.test(ch) ? size * 0.28 : tw(ch, size, 900, 0)));
  let px = x - w.reduce((p, v) => p + v, 0) / 2;
  [...s].forEach((ch, i) => { text(ch, px + w[i] / 2, y, size, 900, col, 'center', 0); px += w[i]; });
}
// drifting dust / debris specks
function dDust(t, x, y, w, h, n = 30, a = 0.5, vy = -18) {
  for (let i = 0; i < n; i++) { const px = x + hash(i) * w + Math.sin(t * 0.8 + i) * 14, py = y + ((hash(i + 50) * h + t * vy * (0.5 + hash(i + 9))) % h + h) % h; circle(px, py, 2 + hash(i + 3) * 4, `rgba(255,255,255,${a * (0.25 + hash(i + 7) * 0.5)})`); }
}
// client health list: the product beat shared by the reels. Rows slide in, two drift, a win-back text goes out.
function dHealth(t, a, c, L) {
  const rows = c.rows || [['Ava', 91], ['Marcus', 84], ['Priya', 46], ['Jordan', 31]];
  withFade(dIn(t, a), () => text('CLIENT HEALTH', CX, 300, 38, 800, D_W, 'center', 0.14));
  rows.forEach(([n, s], i) => {
    const k = dIn(t, a + 0.1 + i * 0.12), y = 380 + i * 142, low = s < 60, on = low ? dIn(t, ch(L, 1) + (i - 2) * 0.18, 0.3) : 0; if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * 120, 0);
    fillRR(110, y, 860, 122, 26, on > 0 ? `rgba(255,255,255,${0.06 + 0.88 * on})` : 'rgba(255,255,255,0.06)'); strokeRR(110, y, 860, 122, 26, 'rgba(255,255,255,0.22)', 2);
    const ink = on > 0.5 ? '#000' : '#fff';
    dotPerson(190, y + 58, 80, ink);
    text(n, 270, y + (low ? 46 : 63), 46, 800, ink, 'left', 0);
    if (low) text(on > 0.5 ? 'GOING QUIET' : '', 270, y + 91, 28, 800, ink, 'left', 0.1);
    const sc = Math.round(s * dIn(t, a + 0.25 + i * 0.12, 0.7));
    ring(900, y + 61, 40, on > 0.5 ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)', 9);
    ctx.beginPath(); ctx.arc(900, y + 61, 40, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sc / 100); ctx.strokeStyle = ink; ctx.lineWidth = 9; ctx.stroke();
    text(String(sc), 900, y + 63, 32, 800, ink, 'center', 0);
    ctx.restore();
  });
  const at = ch(L, 2);
  const k = dIn(t, at, 0.3); if (k > 0) withFade(k, () => {
    text('AUTOMATIC WIN-BACK TEXT', 970, 1010, 28, 800, D_G, 'right', 0.12);
    fillRR(250, 1040 + (1 - k) * 40, 720, 190, 40, '#fff');
    const msgLines = c.msg || ['Been a while.', 'Want your usual spot?']; const p = seg(t, at + 0.05, at + 0.75); let left = Math.round(msgLines.join('').length * p);
    msgLines.forEach((l, i) => { const s = l.slice(0, Math.max(0, left)); left -= l.length; text(s, 296, 1104 + i * 62 + (1 - k) * 40, 46, 700, '#000', 'left', 0); });
  });
}
