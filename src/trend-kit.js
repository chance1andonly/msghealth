// Helpers for the trend-based follower-growth videos (bicep, itstime, smalltext). Loaded after kit.js, the *-vo.js file and story-kit.js.
// These are not product ads: the brand is only a small watermark, there is no pitch, and the call to action is "follow".
'use strict';
function heartShape(x, y, s, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y + s * 0.42); ctx.bezierCurveTo(x - s * 0.95, y - s * 0.25, x - s * 0.45, y - s * 0.95, x, y - s * 0.32); ctx.bezierCurveTo(x + s * 0.45, y - s * 0.95, x + s * 0.95, y - s * 0.25, x, y + s * 0.42); ctx.fill(); }
function watermark(a = 0.8) { // small creator-style mark, top left (inside Instagram's safe area)
  ctx.save(); ctx.globalAlpha *= a; fillRR(44, 112, 270, 58, 29, 'rgba(10,12,24,0.45)'); if (LOGO) ctx.drawImage(LOGO, 58, 122, 38, 38); text(BRAND.name, 108, 142, 26, 800, '#fff', 'left', -0.02); ctx.restore();
}
// A character with a flexible near arm: o.flex 0..1 flexes the arm into a bicep pose. Same proportions as person() (feet at (x, y), h tall).
// Returns where the bicep is so a heart can sit on it.
function buddy(x, y, h, seed, o = {}) {
  const w = h * 0.3, skin = o.skin ?? SKIN[Math.floor(hash(seed) * SKIN.length)], shirt = o.shirt ?? SHIRT[Math.floor(hash(seed + 1) * SHIRT.length)], pants = o.pants ?? PANTS[Math.floor(hash(seed + 2) * PANTS.length)], hair = o.hair ?? HAIR[Math.floor(hash(seed + 3) * HAIR.length)];
  const hr = h * 0.095, hy = y - h + hr, sy = y - h * 0.76, shx = x + w * 0.38, shy = sy + h * 0.03, k = clamp(o.flex ?? 0);
  if (!o.noShadow) shadow(x, y, w * 0.95);
  fillRR(x - w * 0.36, y - h * 0.46, w * 0.32, h * 0.46, w * 0.06, pants); fillRR(x + w * 0.04, y - h * 0.46, w * 0.32, h * 0.46, w * 0.06, pants); fillRR(x - w * 0.42, y - h * 0.035, w * 0.4, h * 0.035, h * 0.015, '#2b2b30'); fillRR(x + w * 0.02, y - h * 0.035, w * 0.4, h * 0.035, h * 0.015, '#2b2b30');
  fillRR(x - w * 0.58, sy, w * 0.18, h * 0.34, w * 0.09, shirt); circle(x - w * 0.5, sy + h * 0.35, w * 0.09, skin);
  fillRR(x - w / 2, sy - h * 0.02, w, h * 0.35, w * 0.22, shirt);
  const E = [lerp(x + w * 0.5, shx + h * 0.17, k), lerp(shy + h * 0.17, shy + h * 0.02, k)], Hd = [lerp(x + w * 0.58, E[0] + h * 0.015, k), lerp(y - h * 0.41, E[1] - h * 0.17, k)];
  line(shx, shy, E[0], E[1], shirt, w * 0.2); line(E[0], E[1], Hd[0], Hd[1], skin, w * 0.17); circle(Hd[0], Hd[1], w * 0.115, skin); const bx = lerp(shx, E[0], 0.55), by = lerp(shy, E[1], 0.55);
  if (k > 0.3) circle(bx, by - h * 0.03 * k, h * 0.05 * k, shirt);
  fillRR(x - w * 0.09, hy + hr * 0.6, w * 0.18, h * 0.06, 2, skin); circle(x, hy, hr, skin); ctx.beginPath(); ctx.arc(x, hy - hr * 0.1, hr * 1.05, Math.PI * 1.02, Math.PI * 1.98); ctx.closePath(); ctx.fillStyle = hair; ctx.fill();
  const ex = o.eyes === 'wide' ? 1.5 : 1; circle(x + hr * 0.36, hy + hr * 0.08, hr * 0.1 * ex, '#1b1410'); circle(x - hr * 0.2, hy + hr * 0.08, hr * 0.1 * ex, '#1b1410');
  if (o.smile) { ctx.strokeStyle = '#6b3f28'; ctx.lineWidth = Math.max(3, hr * 0.07); ctx.beginPath(); ctx.arc(x + hr * 0.08, hy + hr * 0.38, hr * 0.28, 0.15, Math.PI - 0.15); ctx.stroke(); } else if (o.mouth === 'open') ellipse(x + hr * 0.08, hy + hr * 0.5, hr * 0.17, hr * 0.2, '#6b2a2a'); else line(x - hr * 0.1, hy + hr * 0.5, x + hr * 0.3, hy + hr * 0.5, '#6b3f28', Math.max(2, hr * 0.06));
  return { bx, by: by - h * 0.1, skin };
}
function sparkles(x, y, t, at, n = 8, r = 120) { const k = seg(t, at, at + 0.7); if (k <= 0 || k >= 1) return; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + hash(i) , d = r * ease.out(k); star(x + Math.cos(a) * d, y + Math.sin(a) * d, 14 * (1 - k) + 4, i % 2 ? '#fff6a8' : '#ffd1dc'); } }
