// Motion-graphics helpers for the retention explainer reels (second, lookgood, shift). Loaded after kit.js and the reel's *-vo.js.
// No characters: just type, dots, calendars and a phone. Everything draws on the shared `ctx` from kit.js.
'use strict';
const INK = '#f3f3f7', OK = '#6fe3a0';
const wordAt = (l, k) => VO_AT[l] + VO_CLIPS[l].chunks[k][1];
const lineEnd = (l) => VO_AT[l] + VO_CLIPS[l].dur;
// A client dot: head + shoulders, centred at (x, y), s = overall height.
function dotPerson(x, y, s, col, a = 1) {
  ctx.save(); ctx.globalAlpha *= clamp(a); circle(x, y - s * 0.22, s * 0.2, col);
  ctx.beginPath(); ctx.moveTo(x - s * 0.34, y + s * 0.42); ctx.quadraticCurveTo(x - s * 0.34, y + s * 0.08, x, y + s * 0.08); ctx.quadraticCurveTo(x + s * 0.34, y + s * 0.08, x + s * 0.34, y + s * 0.42); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore();
}
// A chat bubble whose text types in (p 0..1). Sized for the full text so it doesn't jump. Returns its height.
function msg(x, y, maxW, lines, out, a = 1, p = 1) {
  if (a <= 0) return 0;
  const size = 30, lh = 42, w = Math.max(...lines.map((l) => tw(l, size, 500))) + 52, h = lines.length * lh + 34, x0 = out ? x + maxW - w : x;
  let left = Math.round(lines.join('').length * clamp(p));
  ctx.save(); ctx.globalAlpha *= clamp(a);
  fillRR(x0, y, w, h, 28, out ? C.primary : 'rgba(255,255,255,0.12)');
  lines.forEach((l, i) => { const s = l.slice(0, Math.max(0, left)); left -= l.length; text(s, x0 + 26, y + 17 + lh / 2 + i * lh, size, 500, '#fff'); });
  ctx.restore(); return h;
}
function phoneChat(t, at, until, fn, y = 330) {
  const k = ease.quint(seg(t, at, at + 0.5)) * (1 - seg(t, until - 0.25, until));
  if (k <= 0.01) return;
  ctx.save(); ctx.globalAlpha = k; xf(CX, y + 480, 0.92 + 0.08 * k, 0, () => phone(220, y, 640, 960, '#0d0d14', () => { fillRR(0, 0, 640, 110, 0, '#14141e'); circle(60, 74, 24, '#3b3b55'); text('Marcus', 100, 74, 30, 700, '#fff'); fn(); })); ctx.restore();
}
function chip(s, x, y, col, a = 1, size = 24) { const w = tw(s, size, 800, 0.08) + 44, h = size * 2; ctx.save(); ctx.globalAlpha *= clamp(a); fillRR(x - w / 2, y - h / 2, w, h, h / 2, rgba(col, 0.16)); strokeRR(x - w / 2, y - h / 2, w, h, h / 2, rgba(col, 0.6), 2); text(s, x, y + 1, size, 800, col, 'center', 0.08); ctx.restore(); }
function headline(s, y, a, size = 120, col = INK) { withFade(a, () => text(s, CX, y, size, 800, col, 'center', -0.04)); }
// closing frame shared by the three reels
function finale(t, at) {
  endCard(t, at, at + 1.25, at + 0.2);
  withFade(seg(t, at + 0.9, at + 1.2), () => { chip('COMMENT  KEEP', CX, 1190, ACCENT, 1, 34); text('and we text you the list', CX, 1270, 28, 600, MUTED, 'center'); });
}
