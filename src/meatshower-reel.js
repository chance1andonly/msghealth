// MsgHealth · meatshower (Bath County, Kentucky, 1876) · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // a lumpy chunk of meat with white marbling (cartoon, grey)
  const meat = (x, y, r, rot = 0, seed = 1) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); for (let i = 0; i <= 11; i++) { const a = (i % 11) / 11 * Math.PI * 2, q = r * (0.74 + hash(seed * 13 + (i % 11)) * 0.45); i ? ctx.lineTo(Math.cos(a) * q * 1.15, Math.sin(a) * q * 0.85) : ctx.moveTo(Math.cos(a) * q * 1.15, Math.sin(a) * q * 0.85); } ctx.closePath(); ctx.fillStyle = '#9c9c9c'; ctx.fill(); ctx.strokeStyle = D_W; ctx.lineWidth = Math.max(2, r * 0.07); ctx.lineJoin = 'round'; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r * 0.6, -r * 0.1); ctx.bezierCurveTo(-r * 0.2, -r * 0.5, r * 0.1, r * 0.3, r * 0.65, -r * 0.05); ctx.strokeStyle = D_W; ctx.lineWidth = r * 0.14; ctx.lineCap = 'round'; ctx.stroke(); line(-r * 0.25, r * 0.35, r * 0.15, r * 0.3, '#e8e8e8', r * 0.08); ctx.restore(); };
  const rain = (t, a, n, y0, y1, size = 30) => { for (let i = 0; i < n; i++) { const sp = 330 + hash(i + 5) * 300, span = y1 - y0, d = hash(i + 31) * span + (t - a) * sp, y = y0 + (d % span), x = 60 + hash(i + 2) * 960; meat(x, y, size * (0.5 + hash(i + 8) * 0.8), t * (hash(i) - 0.5) * 5, i + 1); } };
  const house = (x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fillRR(-130, -170, 260, 170, 6, '#3a3a3a'); poly([[-160, -165], [0, -285], [160, -165]], '#6a6a6a'); fillRR(60, -280, 36, 70, 4, '#555'); fillRR(-35, -95, 70, 95, 6, '#0d0d0d'); [-95, 55].forEach((wx) => fillRR(wx, -130, 42, 42, 4, D_L)); ctx.restore(); };
  const woman = (x, y, h, stir) => { const u = h / 100; line(-4 * u + x, y - 30 * u, x - 8 * u, y, D_L, 8 * u); line(x + 6 * u, y - 30 * u, x + 10 * u, y, D_L, 8 * u); poly([[x - 9 * u, y - 70 * u], [x + 9 * u, y - 70 * u], [x + 24 * u, y - 18 * u], [x - 24 * u, y - 18 * u]], D_W); circle(x, y - 83 * u, 12 * u, D_W); circle(x - 11 * u, y - 87 * u, 7 * u, D_G); const hx = x + 34 * u + Math.sin(stir) * 9 * u, hy = y - 52 * u + Math.cos(stir) * 4 * u; line(x + 6 * u, y - 64 * u, hx, hy, D_W, 7 * u); line(hx - 4 * u, hy - 12 * u, hx + 22 * u + Math.sin(stir) * 8 * u, y - 22 * u, D_G, 5 * u); };
  const pot = (x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (let i = 0; i < 7; i++) { const p = (t * 0.6 + i / 7) % 1; circle(-70 + hash(i) * 140, -170 - p * 190, 14 + p * 20, `rgba(255,255,255,${0.35 * (1 - p)})`); } ctx.beginPath(); ctx.moveTo(-120, -150); ctx.quadraticCurveTo(-150, 0, 0, 0); ctx.quadraticCurveTo(150, 0, 120, -150); ctx.closePath(); ctx.fillStyle = '#555'; ctx.fill(); fillRR(-135, -168, 270, 30, 14, D_G); [-26, 0, 26].forEach((d, i) => flame(d * 3, 62, 24 + i % 2 * 10, t, i)); ctx.restore(); };
  const flame = (x, y, r, t, i) => { const f = 1 + 0.2 * Math.sin(t * 12 + i); poly([[x - r, y], [x, y - r * 2.2 * f], [x + r, y]], D_L); };
  const vulture = (x, y, s, ph, flip = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s * flip, s); const w = Math.sin(ph) * 45;
    [-1, 1].forEach((d) => { ctx.beginPath(); ctx.moveTo(d * 30, -10); ctx.quadraticCurveTo(d * 120, -60 - w, d * 235, -35 - w * 1.5); for (let i = 0; i < 4; i++) { ctx.lineTo(d * (228 - i * 46), 12 - w * (1.4 - i * 0.35)); ctx.lineTo(d * (205 - i * 46), -8 - w * (1.3 - i * 0.35)); } ctx.lineTo(d * 30, 30); ctx.closePath(); ctx.fillStyle = '#7a7a7a'; ctx.fill(); });
    ellipse(0, 10, 55, 40, '#b8b8b8'); line(35, 0, 78, -22, D_L, 20); circle(88, -28, 24, D_W); poly([[104, -40], [140, -24], [122, -8], [112, -22]], D_G); circle(92, -34, 5, '#000'); ctx.restore(); };
  const face = (x, y, r, mood, t) => { circle(x, y, r, D_W); if (mood === 'sick') { [-0.36, 0.36].forEach((d) => { ctx.beginPath(); for (let i = 0; i <= 30; i++) { const a = i / 30 * Math.PI * 4 + t * 5, q = r * 0.2 * i / 30; const px = x + d * r + Math.cos(a) * q, py = y - r * 0.18 + Math.sin(a) * q; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = '#000'; ctx.lineWidth = r * 0.05; ctx.stroke(); }); ctx.beginPath(); for (let i = 0; i <= 20; i++) { const px = x - r * 0.45 + i / 20 * r * 0.9, py = y + r * 0.45 + Math.sin(i * 1.3 + t * 8) * r * 0.07; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = '#000'; ctx.lineWidth = r * 0.08; ctx.stroke(); }
    else { [-0.34, 0.34].forEach((d) => circle(x + d * r, y - r * 0.2, r * 0.1, '#000')); ellipse(x, y + r * 0.4, r * 0.28, r * (0.14 + 0.1 * Math.abs(Math.sin(t * 8))), '#000'); } fillRR(x - r * 0.95, y - r * 1.08, r * 1.9, r * 0.28, r * 0.1, D_D); fillRR(x - r * 0.6, y - r * 1.55, r * 1.2, r * 0.55, r * 0.2, D_D); };
  const card2 = (s, x, y, t, at) => { const k = pop(t, at, 0.4); if (k > 0) xf(x, y, clamp(k), 0, () => { fillRR(x - 200, y - 70, 400, 140, 22, D_W); text(s, x, y + 4, 66, 900, '#000', 'center', 0.02); }); };
  const S = [
    { type: 'art', sfx: [[1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('BATH COUNTY, KENTUCKY · 1876'); line(0, 1250, W, 1250, D_D, 8); house(250, 1250, 1.2); dMan(760, 1250, 300, D_L, { arms: 'up', run: t * 8 }); rain(t, a - 2, 20, 380, 1235, 42);
      meat(CX, 700 + Math.sin(t * 3) * 14, 170, Math.sin(t * 1.7) * 0.25, 7);
      dStamp('RAW MEAT', CX, 480, t, ch(L, 2), 118, -0.06);
    } },
    { type: 'art', sfx: [[3, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('MARCH 3 · CLEAR SKY');
      const sx = 830, sy = 530; for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6 + t * 0.4; line(sx + Math.cos(an) * 105, sy + Math.sin(an) * 105, sx + Math.cos(an) * 145, sy + Math.sin(an) * 145, D_G, 12); } circle(sx, sy, 82, D_W);
      line(0, 1250, W, 1250, D_D, 8); woman(330, 1250, 480, t * 4.5); pot(660, 1235, 1.15, t);
      const m = dIn(t, ch(L, 3), 0.25); withFade(m, () => rain(t, ch(L, 3) - 0.9, 16, 380, 1230, 38));
      withFade(dIn(t, ch(L, 2)) * (1 - m), () => { fillRR(200, 560, 340, 96, 18, 'rgba(255,255,255,0.12)'); text('making soap', 370, 611, 44, 800, D_W, 'center'); });
    } },
    { type: 'art', sfx: [[3, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('SEVERAL MINUTES');
      fillRR(90, 440, 900, 520, 12, '#161616'); strokeRR(90, 440, 900, 520, 12, D_W, 7); fillRR(94, 444, 92, 512, 8, '#2e2e2e'); fillRR(894, 444, 92, 512, 8, '#2e2e2e');
      for (let i = 1; i < 10; i++) { const x = 90 + i * 90; line(x, 446, x, 954, 'rgba(255,255,255,0.28)', 3, 'butt'); for (let y = 480; y < 940; y += 46) line(x + 45, y, x + 45, y + 14, 'rgba(255,255,255,0.22)', 3); }
      const n = Math.floor(seg(t, a, ch(L, 3) + 0.5) * 70); for (let i = 0; i < n; i++) meat(130 + hash(i + 61) * 820, 480 + hash(i + 17) * 440, 14 + hash(i) * 14, hash(i + 4) * 6, i + 2);
      const k = pop(t, ch(L, 3), 0.4); if (k > 0) xf(CX, 1150, clamp(k), 0, () => { text('≈ 1 FOOTBALL FIELD', CX, 1100, 70, 900, D_W, 'center', 0.01); text('OF MEAT', CX, 1200, 70, 900, D_G, 'center', 0.1); });
    } },
    { type: 'art', sfx: [[1, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('THE PIECES'); const k = pop(t, a, 0.4); xf(CX, 720, clamp(k), 0, () => meat(CX, 720, 270, Math.sin(t * 1.5) * 0.12, 4));
      withFade(dIn(t, ch(L, 1) - 0.1), () => { fillRR(160, 1050, 760, 120, 12, D_W); for (let i = 0; i <= 24; i++) line(190 + i * 29.2, 1052, 190 + i * 29.2, 1052 + (i % 8 ? 30 : 55), '#000', i % 8 ? 3 : 6); ['0', '1', '2', '3'].forEach((s, i) => text(s, 190 + i * 233.6, 1135, 38, 900, '#000', 'center')); });
      withFade(dIn(t, ch(L, 1)), () => text('UP TO 3 INCHES', CX, 1270, 66, 900, D_W, 'center', 0.04));
      dStamp('HOLY HELL', CX, 440, t, ch(L, 2), 86, -0.07);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('QUALITY CONTROL'); line(0, 1280, W, 1280, D_D, 8);
      const lift = ease.inOut(seg(t, a + 0.2, ch(L, 1) + 0.4)), chew = t > ch(L, 1) + 0.4;
      [[300, 1], [780, -1]].forEach(([x, d], i) => { fillRR(x - 115, 900, 230, 390, 80, i ? '#6a6a6a' : D_G); face(x, 790, 130, 'chew', chew ? t + i : 0); const hx = x + d * lerp(210, 95, lift), hy = lerp(1130, 850, lift); line(x + d * 80, 1000, hx, hy, D_L, 44); meat(hx - d * 10, hy - 20, 54, i, i + 9); });
      if (t >= ch(L, 2) && t < ch(L, 3)) dStamp('MUTTON?', 330, 520, t, ch(L, 2), 76, -0.08);
      if (t >= ch(L, 3)) { dStamp('MUTTON?', 330, 520, t, ch(L, 2), 76, -0.08); dStamp('DEER?', 760, 520, t, ch(L, 3) + 0.15, 86, 0.08); }
      if (t < ch(L, 2)) dStamp('THEY ATE IT', CX, 480, t, ch(L, 1), 94, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.25], [2, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('THE LAB'); ring(CX, 640, 230, D_W, 22); ctx.save(); ctx.beginPath(); ctx.arc(CX, 640, 218, 0, Math.PI * 2); ctx.clip(); fillRR(300, 400, 480, 480, 0, '#222'); for (let i = 0; i < 16; i++) { const x = 350 + hash(i) * 380 + Math.sin(t * 2 + i) * 14, y = 450 + hash(i + 40) * 380 + Math.cos(t * 1.7 + i) * 14; ring(x, y, 26 + hash(i + 3) * 30, D_G, 7); circle(x, y, 8, D_W); } ctx.restore(); line(700, 810, 840, 950, D_W, 54);
      card2('LUNG', 300, 1060, t, ch(L, 1)); card2('MUSCLE', 780, 1060, t, ch(L, 2)); card2('CARTILAGE', CX, 1240, t, ch(L, 2) + 0.55);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.25], [2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE LEADING THEORY');
      const k = ease.out(seg(t, a, a + 0.9)); [[330, 600, 1.25, 0, 1], [820, 470, 0.7, 2, -1], [770, 820, 0.85, 4, -1]].forEach(([x, y, s, p, f]) => vulture(x - f * 520 * (1 - k) + Math.sin(t * 1.3 + p) * 24, y + Math.sin(t * 2 + p) * 18, s, t * 6 + p, f));
      const spew = dIn(t, ch(L, 1), 0.2); withFade(spew, () => { for (let i = 0; i < 24; i++) { const p = ((t - ch(L, 1)) * 0.9 + i / 24) % 1, src = i % 2 ? [455, 580] : [700, 815]; meat(src[0] + (i % 2 ? 1 : -1) * p * 220 + (hash(i) - 0.5) * 70 * p, src[1] + p * p * 480 + p * 60, 14 + hash(i + 6) * 16, t * 4 + i, i); } });
      line(0, 1290, W, 1290, D_D, 8); dStamp('VULTURE PUKE', CX, 1150, t, ch(L, 2) - 0.25, 90, -0.06, true);
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.22]], draw(t, a, c, L) {
      dHead('THOSE TWO IDIOTS'); [[300, 0], [780, 1]].forEach(([x, i]) => { const w = Math.sin(t * 6 + i * 2) * 12 * dIn(t, ch(L, 2) - 0.2); fillRR(x - 115 + w, 900, 230, 390, 80, i ? '#6a6a6a' : D_G); face(x + w, 790, 140, 'sick', t + i); });
      line(0, 1290, W, 1290, D_D, 8); dStamp('ATE VULTURE VOMIT?', CX, 500, t, ch(L, 2), 74, -0.05);
    } },
    { type: 'art', sfx: [[1, 'ding', 0.22], [2, 'punch', 0.22]], draw(t, a, c, L) {
      dHead('STILL ON THE SHELF'); glow(CX, 800, 520, '#ffffff', 0.18);
      fillRR(370, 470, 340, 74, 16, D_G); fillRR(320, 540, 440, 590, 70, 'rgba(255,255,255,0.12)'); meat(CX + Math.sin(t * 1.2) * 14, 760 + Math.sin(t * 1.7) * 18, 130, Math.sin(t * 0.9) * 0.4, 12); strokeRR(320, 540, 440, 590, 70, D_W, 9); line(370, 620, 370, 1040, 'rgba(255,255,255,0.45)', 14);
      fillRR(390, 930, 300, 110, 8, D_W); text('OLYMPIA SPRINGS', CX, 965, 27, 900, '#000', 'center', 0.04); text('1876', CX, 1008, 40, 900, '#000', 'center', 0.1);
      fillRR(120, 1150, 840, 30, 8, D_G);
      withFade(dIn(t, ch(L, 1)), () => { text('TRANSYLVANIA UNIVERSITY', CX, 1250, 54, 900, D_W, 'center', 0.04); text('LEXINGTON, KENTUCKY', CX, 1325, 34, 800, D_G, 'center', 0.14); });
      dStamp('NO SHIT', 850, 480, t, ch(L, 2), 62, 0.12, true);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.22]], draw(t, a, c, L) {
      dHead('YOUR CLIENT LIST');
      for (let i = 0; i < 12; i++) { const r = Math.floor(i / 4), q = i % 4, x = 180 + q * 240, y = 560 + r * 260, hi = [2, 5, 11].includes(i), e = pop(t, a + i * 0.03, 0.3); if (e <= 0) continue; const on = hi && t > ch(L, 1); xf(x, y, clamp(e), 0, () => { if (on) { circle(x, y, 108, D_W); dotPerson(x, y - 6, 130, '#000'); } else { dotPerson(x, y - 6, 130, hi ? D_G : D_L); if (hi) text('?', x + 78, y - 66, 74, 900, D_W, 'center'); } }); }
      dStamp('NO GUESSING', CX, 1300, t, ch(L, 1) + 0.1, 70, -0.04, true);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Ava', 90], ['Priya', 83], ['Marcus', 40], ['Sam', 22]], msg: ['Marcus, you disappeared.', 'Want a spot this week?'] },
  ];
  window.REEL = { name: 'meatshower', who: 'Marcus', scenes: S };
})();
