// Extra helpers for the five "story hook" ads (yap, pigwar, norton, railway, petrock). Loaded after src/kit.js and the ad's
// own *-vo.js, before the ad script. Everything here draws on the shared `ctx` (see kit.js) and is global to the ad.
'use strict';

// Contact shadow under a standing figure or prop (feet / base at (x, y), half-width rx).
function shadow(x, y, rx, col = 'rgba(30,30,30,0.28)') { ellipse(x, y, rx, rx * 0.12, col); }
// Full-canvas backdrop: sky to the ground line GR, then ground to the bottom edge, plus a soft band where they meet.
function backdrop(GR, sky0, sky1, g0, g1) {
  ctx.fillStyle = vgrad(0, GR, sky0, sky1); ctx.fillRect(0, 0, W, GR);
  ctx.fillStyle = vgrad(GR, H, g0, g1); ctx.fillRect(0, GR, W, H - GR);
  ctx.fillStyle = 'rgba(0,0,0,0.07)'; ctx.fillRect(0, GR, W, 70);
}
// White speech bubble with its top at `top`, centred on cx, tail pointing at `tail` = [x, y]. Returns the bubble's bottom y.
function speech(cx, top, lines, o = {}) {
  const size = o.size ?? 48, lh = size * 1.2, wt = o.weight ?? 800;
  const w = Math.max(...lines.map((l) => tw(l, size, wt))) + 70, h = lines.length * lh + 40, x0 = clamp(cx - w / 2, 24, W - 24 - w);
  const a = o.a ?? 1;
  ctx.save(); ctx.globalAlpha *= clamp(a);
  if (o.tail) { const [tx, ty] = o.tail, bx = clamp(tx, x0 + 50, x0 + w - 50); poly([[bx - 24, top + h - 4], [bx + 24, top + h - 4], [tx, ty]], o.bg ?? '#fff'); }
  fillRR(x0, top, w, h, 34, o.bg ?? '#fff');
  lines.forEach((l, i) => text(l, x0 + w / 2, top + 20 + lh * (i + 0.5) + 2, size, wt, o.fg ?? '#1b1f27', 'center', 0));
  ctx.restore(); return top + h;
}
// Thought cloud centred on (cx, cy) with a trail of bubbles down to `tail` = [x, y].
function thought(cx, cy, rx, ry, tail, col = '#fff') {
  ctx.fillStyle = col; ctx.beginPath();
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; ctx.moveTo(cx + Math.cos(a) * rx * 0.82 + ry * 0.42, cy + Math.sin(a) * ry * 0.82); ctx.arc(cx + Math.cos(a) * rx * 0.82, cy + Math.sin(a) * ry * 0.82, ry * 0.42, 0, 7); }
  ctx.ellipse(cx, cy, rx * 0.85, ry * 0.85, 0, 0, 7); ctx.fill();
  if (tail) [0.25, 0.55, 0.82].forEach((k, i) => circle(lerp(cx, tail[0], 0.55 + k * 0.45), lerp(cy + ry * 0.8, tail[1], 0.15 + k * 0.85), 20 - i * 5, col));
}
// A pill banner centred on (cx, cy).
function banner(s, cx, cy, size, bg, fg = '#fff', rot = 0, wt = 800) {
  const w = tw(s, size, wt) + size * 1.2, h = size * 1.7;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); fillRR(-w / 2, -h / 2, w, h, h * 0.3, bg); text(s, 0, 3, size, wt, fg, 'center', 0); ctx.restore();
}
function postit(x, y, w, lines, rot = 0, col = '#ffe27a', fg = '#3a2a1a', size = 30) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  fillRR(-w / 2, -w / 2, w, w, 6, col); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  lines.forEach((l, i) => text(l, 0, (i - (lines.length - 1) / 2) * size * 1.15, size, 800, fg, 'center', 0)); ctx.restore();
}
function clockFace(x, y, r, h, m, o = {}) { // h, m in hours (0-12) and minutes (0-60)
  circle(x, y, r + 8, o.rim ?? '#2a2f3a'); circle(x, y, r, o.face ?? '#fbf7ec');
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 - Math.PI / 2; line(x + Math.cos(a) * r * 0.82, y + Math.sin(a) * r * 0.82, x + Math.cos(a) * r * 0.94, y + Math.sin(a) * r * 0.94, '#2a2f3a', Math.max(2, r * 0.04)); }
  const ha = ((h % 12) / 12 + m / 720) * Math.PI * 2 - Math.PI / 2, ma = (m / 60) * Math.PI * 2 - Math.PI / 2;
  line(x, y, x + Math.cos(ha) * r * 0.5, y + Math.sin(ha) * r * 0.5, '#1b1f27', Math.max(3, r * 0.09)); line(x, y, x + Math.cos(ma) * r * 0.76, y + Math.sin(ma) * r * 0.76, '#1b1f27', Math.max(2, r * 0.055)); circle(x, y, r * 0.07, o.pin ?? '#b3261e');
}
function crossOut(x, y, s, col = '#e0392d', lw = 14) { line(x - s, y - s, x + s, y + s, col, lw); line(x + s, y - s, x - s, y + s, col, lw); }
function arrowH(x0, x1, y, col, lw = 8) { line(x0, y, x1, y, col, lw); [[x0, 1], [x1, -1]].forEach(([x, d]) => { line(x, y, x + 30 * d, y - 22, col, lw); line(x, y, x + 30 * d, y + 22, col, lw); }); line(x0, y - 26, x0, y + 26, col, lw); line(x1, y - 26, x1, y + 26, col, lw); }
function palm(x, y, h, t = 0, lean = 0.12) { // trunk base at (x, y)
  shadow(x, y, h * 0.2); ctx.strokeStyle = '#7a5a3a'; ctx.lineWidth = h * 0.06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + h * lean * 0.3, y - h * 0.5, x + h * lean, y - h); ctx.stroke();
  const tx = x + h * lean, ty = y - h;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.55 + Math.sin(t * 1.5 + i) * 0.04, L = h * 0.5;
    ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - L * 0.25, tx + Math.cos(a) * L, ty + Math.sin(a) * L + L * 0.25); ctx.quadraticCurveTo(tx + Math.cos(a) * L * 0.6, ty + Math.sin(a) * L * 0.6 - L * 0.1, tx, ty); ctx.fillStyle = i % 2 ? '#2f8a4a' : '#3da35a'; ctx.fill(); }
  circle(tx, ty + 8, h * 0.03, '#5a3a1f'); circle(tx + h * 0.04, ty + 14, h * 0.03, '#5a3a1f');
}
// Slightly tired eyes drawn over a person() head: dir 1, same maths as person(). o.shut 0..1 closes the eyes.
function tiredEyes(x, y, h, skin, shut = 0.5) {
  const hr = h * 0.095, hy = y - h + hr;
  [[x + hr * 0.36], [x - hr * 0.2]].forEach(([ex]) => {
    circle(ex, hy + hr * 0.08, hr * 0.16, skin);
    if (shut > 0.85) line(ex - hr * 0.16, hy + hr * 0.08, ex + hr * 0.16, hy + hr * 0.1, '#1b1410', Math.max(2, hr * 0.07)); else { circle(ex, hy + hr * 0.12, hr * 0.09, '#1b1410'); ctx.fillStyle = skin; ctx.fillRect(ex - hr * 0.18, hy - hr * 0.1, hr * 0.36, hr * (0.2 + 0.1 * shut)); line(ex - hr * 0.16, hy + hr * 0.1, ex + hr * 0.16, hy + hr * 0.1, '#6b3f28', Math.max(2, hr * 0.06)); }
    ellipse(ex, hy + hr * 0.3, hr * 0.2, hr * 0.07, 'rgba(90,40,110,0.5)');
  });
}
const appear = (t, at, d = 0.3) => clamp(pop(t, at, d));
const sine = (t, f, a) => Math.sin(t * f) * a;
