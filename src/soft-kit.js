// Helpers for the "soft pivot" story ads (ducks, pigeon, bottle, eliza, wowsig). Loaded after src/kit.js, the ad's *-vo.js and
// src/story-kit.js. These ads keep the viewer inside the story: there is no logo flash, no dark purple product screens and no
// giant offer card. The product appears as a phone sliding up over the story's own artwork (light UI, the brand only as a small
// header inside the phone), and the offer is a slim strip at the bottom of the closing story frame.
'use strict';

const INK = '#1e1b4b', LMUTED = '#6b6a80', LLINE = 'rgba(30,27,75,0.10)';
// A phone sliding up over the story art. fn(t) draws the screen in local coordinates: (0, 0) is just under the app header,
// the usable area is 620 × 890.
function phoneOver(t, at, until, fn) {
  const k = ease.out(seg(t, at, at + 0.5)), out = ease.in(seg(t, until - 0.35, until));
  if (k <= 0 || out >= 1) return;
  ctx.fillStyle = `rgba(10,12,24,${0.4 * k * (1 - out)})`; ctx.fillRect(0, 0, W, H);
  const w = 620, h = 1010, x = CX - w / 2, y = 300 + (1 - k) * 1400 + out * 1400;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20; fillRR(x - 14, y - 14, w + 28, h + 28, 64, '#16161e'); ctx.restore();
  strokeRR(x - 14, y - 14, w + 28, h + 28, 64, 'rgba(255,255,255,0.18)', 3);
  ctx.save(); rr(x, y, w, h, 50); ctx.clip(); ctx.fillStyle = '#f6f4ef'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#fff'; ctx.fillRect(x, y, w, 118); ctx.fillStyle = LLINE; ctx.fillRect(x, y + 118, w, 2);
  if (LOGO) ctx.drawImage(LOGO, x + 34, y + 64, 38, 38); text(BRAND.name, x + 84, y + 84, 28, 800, INK, 'left', -0.03);
  ctx.translate(x, y + 120); fn(t); ctx.restore();
  fillRR(x + w / 2 - 70, y + 14, 140, 34, 17, '#0b0b10');
}
// Light-theme UI bits (local phone coordinates)
function lcard(x, y, w, h, r = 22) { fillRR(x, y, w, h, r, '#fff'); strokeRR(x, y, w, h, r, LLINE, 2); }
function ltext(s, x, y, size, weight = 700, col = INK, align = 'left') { text(s, x, y, size, weight, col, align, -0.005); }
function ltag(x, y, label, col, size = 17) { // right-aligned pill ending at x
  const w = tw(label, size, 800, 0.08) + size * 1.4, h = size * 1.9; fillRR(x - w, y - h / 2, w, h, h / 2, rgba(col, 0.16)); text(label, x - w / 2, y + 1, size, 800, col, 'center', 0.08); return w;
}
const LGREEN = '#1f9d55', LAMBER = '#c98a12', LRED = '#d6402f';
function lcheck(x, y, r, col = LGREEN) { circle(x, y, r, col); check(x, y + 1, r, '#fff', Math.max(3, r * 0.22)); }
// The offer: a slim strip along the bottom of the closing story frame (below the caption band).
function offerStrip(t, at) {
  const k = pop(t, at, 0.4); if (k <= 0) return;
  xf(CX, 1710, clamp(k), 0, () => {
    fillRR(60, 1560, 960, 300, 36, 'rgba(14,16,28,0.92)'); text('50% off your first month', CX, 1618, 46, 800, '#fff', 'center', -0.02);
    [['Starter', '$25'], ['Pro', '$54.50'], ['Enterprise', '$139.50']].forEach(([n, p], i) => { const x = 110 + i * 292; fillRR(x, 1664, 266, 96, 22, 'rgba(255,255,255,0.08)'); text(n, x + 133, 1690, 22, 700, MUTED, 'center'); text(p, x + 133, 1730, 38, 800, '#9ff0c0', 'center', -0.01); });
    text('Monthly plans only · Pay-Per-Use Wallet not included', CX, 1796, 22, 600, MUTED, 'center', 0.02); text(BRAND.url, CX, 1832, 26, 700, SOFT, 'center', 0.04);
  });
}
function duck(x, y, s = 1, o = {}) { // rubber duck, waterline at (x, y)
  const d = o.dir ?? 1, bob = o.bob ?? 0; ctx.save(); ctx.translate(x, y + bob); ctx.scale(d * s, s);
  ellipse(0, 4, 74, 12, 'rgba(255,255,255,0.35)'); ellipse(-6, -34, 70, 44, '#ffd23f'); poly([[-70, -44], [-98, -74], [-62, -62]], '#ffd23f'); ellipse(-14, -32, 36, 22, '#f2b705'); circle(40, -82, 36, '#ffd23f'); poly([[66, -84], [100, -76], [66, -66]], '#ff8a1f'); circle(48, -92, 6, '#1b1f27');
  ctx.restore();
}
function ocean(t, hz = 760, o = {}) { // sky above the horizon hz, sea below it, drifting wave marks
  backdrop(hz, o.sky0 ?? '#8fd6f2', o.sky1 ?? '#e6f6f2', o.s0 ?? '#2fa6c4', o.s1 ?? '#0d5a7a'); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(0, hz - 2, W, 6);
  for (let i = 0; i < 14; i++) { const y = hz + 50 + i * ((H - hz) / 14), x = ((i * 310 + t * (24 + i * 5)) % 1500) - 200; ellipse(x, y, 90 + i * 9, 6 + i * 0.6, 'rgba(255,255,255,0.2)'); }
}
