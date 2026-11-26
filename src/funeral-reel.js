// MsgHealth · funeral (Timothy Dexter, Small Business Saturday) · black/white story reel for src/hist.js (drawings use src/doc.js)
(() => {
  const hat = (x, y, s, col = D_G) => { poly([[x - 62 * s, y], [x - 30 * s, y - 40 * s], [x, y - 22 * s], [x + 30 * s, y - 40 * s], [x + 62 * s, y], [x, y - 8 * s]], col); };
  const gent = (x, y, h, col = D_W, o = {}) => { dMan(x, y, h, col, o); hat(x, y - h * 0.95, h / 220, o.hatCol || D_G); };
  const coffin = (x, y, w, h, col = D_L) => { // lying coffin centred at (x, y)
    const P = [[x - w / 2, y - h * 0.28], [x - w * 0.24, y - h / 2], [x + w / 2, y - h * 0.3], [x + w / 2, y + h * 0.3], [x - w * 0.24, y + h / 2], [x - w / 2, y + h * 0.28]];
    poly(P, '#5a5a5a'); poly(P.map(([px, py]) => [x + (px - x) * 0.88, y + (py - y) * 0.76]), col); line(x - w * 0.3, y, x + w * 0.36, y, '#000', 8); line(x - w * 0.12, y - h * 0.2, x - w * 0.12, y + h * 0.2, '#000', 8);
  };
  const candle = (x, y, t, i) => { fillRR(x - 18, y - 150, 36, 150, 8, D_L); fillRR(x - 36, y, 72, 22, 8, D_G); const f = Math.sin(t * 9 + i * 3) * 5; glow(x, y - 185, 90, '#ffffff', 0.2); ellipse(x + f * 0.4, y - 184 - Math.abs(f), 15, 30 + f, D_W); };
  const pan = (x, y, s, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); line(90, 0, 370, 0, D_G, 24); circle(380, 0, 20, D_G); circle(0, 0, 118, D_L); ring(0, 0, 92, '#000', 7); for (let i = 0; i < 7; i++) { const an = i * Math.PI * 2 / 6; circle(i === 6 ? 0 : Math.cos(an) * 48, i === 6 ? 0 : Math.sin(an) * 48, 12, '#000'); } ctx.restore(); };
  const ship = (x, y, t) => { ctx.save(); ctx.translate(x, y + Math.sin(t * 2.4) * 10); ctx.rotate(Math.sin(t * 1.9) * 0.03); poly([[-250, -40], [250, -40], [180, 70], [-180, 70]], D_L); line(0, -40, 0, -300, D_G, 14); poly([[14, -290], [200, -150], [14, -90]], D_W); poly([[-14, -270], [-170, -110], [-14, -90]], D_G); poly([[0, -300], [70, -282], [0, -262]], D_G); ctx.restore(); };
  const waves = (t, y) => { for (let r = 0; r < 3; r++) { ctx.beginPath(); for (let x = 0; x <= W; x += 24) { const py = y + r * 36 + Math.sin(x / 70 + t * 3 + r) * 12; x ? ctx.lineTo(x, py) : ctx.moveTo(x, py); } ctx.strokeStyle = `rgba(255,255,255,${0.6 - r * 0.17})`; ctx.lineWidth = 7; ctx.stroke(); } };
  const palm = (x, y) => { line(x, y, x - 26, y - 250, D_G, 24); [[-120, 20], [-95, -55], [0, -90], [85, -50], [100, 30]].forEach(([dx, dy]) => line(x - 26, y - 252, x - 26 + dx, y - 252 + dy, D_G, 20)); };
  const coins = (x, y, n, t) => { for (let i = 0; i < n; i++) { const r = Math.floor(i / 4), q = i % 4, px = x + q * 62 + (r % 2) * 20, py = y - r * 30; ellipse(px, py, 36, 17, D_W); ellipse(px, py - 4, 24, 9, D_G); } };
  const sign = (x, y, label, t, i) => { const r = Math.sin(t * 3 + i * 2) * 0.07; ctx.save(); ctx.translate(x, y); ctx.rotate(r); line(0, 40, 0, 230, D_G, 14); fillRR(-155, -60, 310, 120, 12, D_W); text(label, 0, 4, 54, 900, '#000', 'center'); ctx.restore(); };
  const S = [
    { type: 'art', sfx: [[2, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('A TRUE STORY');
      candle(130, 1000, t, 1); candle(950, 1000, t, 2);
      const up = ease.back(seg(t, 0.35, 1.0)); const hy = lerp(1060, 885, up);
      fillRR(465, hy + 40, 150, 1090 - hy - 40, 40, D_G); circle(540, hy, 88, D_W); hat(540, hy - 70, 2.0, D_G); circle(508, hy - 8, 11, '#000'); circle(572, hy - 8, 11, '#000'); ctx.beginPath(); ctx.arc(540, hy + 20, 42, 0.15, Math.PI - 0.15); ctx.strokeStyle = '#000'; ctx.lineWidth = 9; ctx.stroke();
      line(470, hy + 90, 330, hy - 10 + Math.sin(t * 7) * 28, D_G, 30);
      coffin(CX, 1190, 860, 290);
      dStamp('HIS OWN FUNERAL', CX, 460, t, a + 0.15, 80, -0.04);
      dStamp('STILL ALIVE', CX, 628, t, ch(L, 2), 92, 0.05, true);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.22], [5, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('TIMOTHY DEXTER · 1747–1806');
      for (let i = 0; i < 7; i++) { const k = pop(t, a + 0.1 + i * 0.1, 0.3); if (k <= 0) continue; const ang = (i - 3) * 0.2, px = CX + Math.sin(ang) * 420, py = 865 - Math.cos(ang) * 150; xf(px, py, clamp(k), 0, () => { ctx.save(); ctx.translate(px, py); ctx.rotate(ang); fillRR(-62, -105, 124, 210, 10, i % 2 ? D_L : '#bdbdbd'); strokeRR(-48, -90, 96, 180, 6, '#000', 3); text('$', 0, -30, 66, 900, '#000', 'center'); [20, 45, 68].forEach((yy) => line(-30, yy, 30, yy, '#555', 6)); ctx.restore(); }); }
      line(0, 1300, W, 1300, D_D, 8); gent(CX, 1300, 380, D_W, { arms: 'up', run: t * 4 });
      coins(110, 1280, Math.round(16 * seg(t, ch(L, 5) - 0.4, ch(L, 5) + 0.7)), t); coins(740, 1280, Math.round(16 * seg(t, ch(L, 5) - 0.2, ch(L, 5) + 0.9)), t);
      if (t < ch(L, 5)) dStamp('OLD WAR MONEY', CX, 470, t, ch(L, 3), 74, -0.04); else dStamp('“WORTHLESS”', CX, 470, t, ch(L, 5), 90, 0.05, true);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.25], [4, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('SO THE STORY GOES');
      const sx = 860, sy = 520; for (let i = 0; i < 10; i++) { const an = i * Math.PI / 5 + t * 0.6; line(sx + Math.cos(an) * 105, sy + Math.sin(an) * 105, sx + Math.cos(an) * 145, sy + Math.sin(an) * 145, D_L, 12); } circle(sx, sy, 82, D_W);
      const k = pop(t, ch(L, 2) - 0.1, 0.4); if (k > 0) xf(330, 580, clamp(k), 0, () => pan(250, 540, 0.95, 0.32 + Math.sin(t * 2) * 0.05));
      palm(960, 1190); ship(430 + seg(t, a, a + 5) * 90, 1190, t); waves(t, 1260);
      if (t < ch(L, 4)) dStamp('BED WARMERS', 560, 790, t, ch(L, 2), 70, -0.05); else dStamp('TO THE CARIBBEAN?!', CX, 790, t, ch(L, 4), 66, 0.05, true);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.25], [3, 'ding', 0.24]], draw(t, a, c, L) {
      dHead('THE CAPTAIN');
      const dip = Math.sin(t * 2.6) * 0.5 + 0.5, px = 330, py = 710 + dip * 36;
      line(px + 40, py + 70, px + 40, 900, D_G, 26 * (1 - dip * 0.5));
      pan(px, py, 1.0, -0.42);
      fillRR(150, 890, 440, 400, 70, '#5a5a5a'); strokeRR(150, 890, 440, 400, 70, D_W, 8); [960, 1220].forEach((y) => line(160, y, 580, y, D_W, 14)); ellipse(370, 895, 200, 34, '#000'); text('MOLASSES', 370, 1092, 66, 900, D_W, 'center', 0.04);
      coins(690, 1275, Math.round(32 * seg(t, ch(L, 2) - 0.3, ch(L, 3) + 0.5)), t);
      if (t < ch(L, 3)) dStamp('NEW USE: LADLE', 640, 445, t, ch(L, 1), 66, 0.05); else dStamp('CASHED IN', 690, 440, t, ch(L, 3), 84, -0.06, true);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.25], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('NEWCASTLE, ENGLAND');
      [[70, 220, 200], [250, 300, 160], [720, 260, 180], [880, 330, 140]].forEach(([x, h, w], i) => { fillRR(x, 1000 - h, w, h, 4, '#303030'); fillRR(x + 30, 1000 - h - 90, 40, 90, 4, '#4a4a4a'); for (let j = 0; j < 3; j++) { const p = (t * 0.35 + j / 3 + i * 0.2) % 1; circle(x + 50 + p * 50, 1000 - h - 100 - p * 80, 14 + p * 28, `rgba(255,255,255,${0.2 * (1 - p)})`); } });
      line(0, 1290, W, 1290, D_D, 8);
      const px = CX, grow = ease.out(seg(t, a + 0.2, ch(L, 1) + 0.6)); for (let i = 0; i < Math.round(30 * grow); i++) { const r = i < 11 ? 0 : i < 20 ? 1 : i < 26 ? 2 : 3, q = i - [0, 11, 20, 26][r], n = [11, 9, 6, 4][r], x = px + (q - (n - 1) / 2) * 50, y = 1260 - r * 52; poly([[x - 38, y + 18], [x - 26, y - 28], [x + 12, y - 38], [x + 40, y - 6], [x + 24, y + 28]], i % 3 ? '#4f4f4f' : '#6e6e6e'); line(x - 24, y - 25, x + 10, y - 34, D_L, 4); }
      const k = pop(t, ch(L, 2), 0.35); if (k > 0) { xf(180, 1000, clamp(k), 0, () => sign(180, 1000, 'ON STRIKE', t, 0)); xf(900, 1000, clamp(k), 0, () => sign(900, 1000, 'NO WORK', t, 1)); }
      if (t < ch(L, 3)) dStamp('COAL TO A COAL TOWN', CX, 480, t, ch(L, 1), 60, -0.04); else dStamp('PAID AGAIN', CX, 480, t, ch(L, 3), 96, 0.05, true);
    } },
    { type: 'art', sfx: [[2, 'whoosh', 0.26], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('HE WROTE A BOOK');
      const page2 = t >= ch(L, 2) + 0.15;
      fillRR(90, 600, 900, 600, 20, '#4a4a4a'); fillRR(110, 580, 425, 600, 10, D_L); fillRR(545, 580, 425, 600, 10, D_W); line(540, 580, 540, 1180, '#000', 8);
      const words = (x, seed) => { for (let r = 0; r < 12; r++) { let cx = x + 28; for (let k = 0; k < 6 && cx < x + 390; k++) { const w = Math.min(40 + hash(seed + r * 7 + k) * 70, x + 396 - cx); fillRR(cx, 622 + r * 45, w, 16, 6, '#555'); cx += w + 14; } } };
      words(110, 2);
      if (!page2) words(545, 40); else { const m = [',', ';', ':', '!', '?', '.', '—', '”', '(', ')']; for (let i = 0; i < 35; i++) { const k = pop(t, ch(L, 2) + 0.15 + i * 0.025, 0.25); if (k <= 0) continue; const x = 592 + (i % 5) * 82, y = 625 + Math.floor(i / 5) * 82; xf(x, y, clamp(k), 0, () => text(m[(i * 3 + Math.floor(i / 5)) % m.length], x, y, 76, 900, '#000', 'center')); } }
      dStamp('ZERO PUNCTUATION', CX, 470, t, ch(L, 1), 62, -0.04);
      dStamp('2ND EDITION: A PAGE OF IT', CX, 1305, t, ch(L, 3), 48, 0.03, true);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.25], [3, 'ding', 0.26]], draw(t, a, c, L) {
      dHead('HIS FRONT YARD');
      poly([[455, 700], [625, 700], [690, 900], [390, 900]], D_G); gent(CX, 900, 450, D_W, { arms: 'down', hatCol: D_L });
      for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + t * 0.5, r = 280 + Math.sin(t * 3 + i) * 20; if (Math.sin(an) < 0.55) star(CX + Math.cos(an) * r * 1.3, 650 + Math.sin(an) * r * 0.8, 20 + (i % 3) * 8, D_L); }
      fillRR(200, 900, 680, 46, 8, D_L); fillRR(240, 946, 600, 350, 6, '#6a6a6a'); fillRR(180, 1296, 720, 44, 8, D_L);
      const k = dIn(t, ch(L, 3) - 0.15, 0.3); withFade(k, () => { fillRR(280, 985, 520, 280, 10, D_W); ['THE GREATEST', 'PHILOSOPHER', 'IN THE', 'WESTERN WORLD'].forEach((s, i) => text(s, CX, 1030 + i * 63, 52, 900, '#000', 'center', 0.01)); });
    } },
    { type: 'art', sfx: [[1, 'ding', 0.22], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE FUNERAL'); dBig('3,000', 465, t, ch(L, 1) - 0.1, 230); withFade(dIn(t, ch(L, 1)), () => text('MOURNERS', CX, 655, 50, 800, D_G, 'center', 0.16));
      for (let r = 0; r < 3; r++) for (let i = 0; i < 11 - (r % 2); i++) dMan(80 + i * 92 + (r % 2) * 46, 820 + r * 100, 130, ['#4a4a4a', '#6a6a6a', '#9a9a9a'][r]);
      const up = ease.back(seg(t, ch(L, 3), ch(L, 3) + 0.45));
      if (up > 0) { const x = 830, hy = lerp(1230, 1100, up); fillRR(x - 55, hy + 20, 110, 1230 - hy, 30, D_L); circle(x, hy, 52, D_W); hat(x, hy - 42, 1.15, D_G); circle(x - 18, hy - 4, 7, '#000'); circle(x + 18, hy - 4, 7, '#000'); ctx.beginPath(); ctx.arc(x, hy + 12, 24, 0.15, Math.PI - 0.15); ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.stroke(); line(x + 50, hy + 40, x + 150, hy - 40 + Math.sin(t * 9) * 26, D_L, 22); }
      coffin(CX, 1255, 820, 170);
      dStamp('HE WAS FINE', 360, 1120, t, ch(L, 4), 72, -0.06);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.2], [3, 'punch', 0.24]], draw(t, a, c, L) {
      dHead(t < ch(L, 2) ? 'THE POINT' : 'SMALL BUSINESS SATURDAY');
      ctx.save(); ctx.translate(280, 800); ctx.rotate(Math.PI / 2); coffin(0, 0, 620, 300, '#bdbdbd'); ctx.restore();
      const x = ease.out(seg(t, ch(L, 3), ch(L, 3) + 0.3)); if (x > 0) { line(110, 520, 110 + 340 * x, 520 + 560 * x, D_W, 34); line(450, 520, 450 - 340 * x, 520 + 560 * x, D_W, 34); line(110, 520, 110 + 340 * x, 520 + 560 * x, '#000', 8); line(450, 520, 450 - 340 * x, 520 + 560 * x, '#000', 8); }
      fillRR(560, 470, 440, 660, 56, '#1c1c1c'); strokeRR(560, 470, 440, 660, 56, D_W, 8); fillRR(715, 495, 130, 26, 13, '#000'); text('Marcus', 780, 580, 42, 800, D_W, 'center'); line(600, 625, 960, 625, D_D, 4);
      const m = pop(t, ch(L, 1), 0.35); if (m > 0) xf(780, 760, clamp(m), 0, () => { fillRR(600, 680, 360, 170, 34, D_W); text('Miss you, man.', 632, 735, 38, 700, '#000', 'left', 0); text('Saturday?', 632, 795, 38, 700, '#000', 'left', 0); });
      const r = pop(t, ch(L, 1) + 0.7, 0.35); if (r > 0) xf(860, 940, clamp(r), 0, () => { fillRR(730, 890, 230, 100, 34, '#4a4a4a'); text('Book it.', 845, 942, 38, 700, D_W, 'center', 0); });
      dStamp('NO CASKET NEEDED', CX, 1275, t, ch(L, 3), 68, -0.03);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Jordan', 93], ['Ava', 86], ['Marcus', 41], ['Priya', 26]], msg: ['Marcus, miss you.', 'Saturday work for you?'] },
  ];
  window.REEL = { name: 'funeral', who: 'Marcus', scenes: S };
})();
