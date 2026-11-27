// MsgHealth · gelt (Hanukkah gelt began as a thank-you to teachers) · black/white story reel for src/hist.js (drawings use src/doc.js). Respectful: no swearing.
(() => {
  const coin = (x, y, r, tone = D_L, a = 1) => { ctx.save(); ctx.globalAlpha *= a; circle(x, y, r, tone); ring(x, y, r * 0.74, '#000', Math.max(3, r * 0.07)); const s = r * 0.42; [1, -1].forEach((d) => { ctx.beginPath(); ctx.moveTo(x, y - d * s); ctx.lineTo(x + s * 0.87, y + d * s * 0.5); ctx.lineTo(x - s * 0.87, y + d * s * 0.5); ctx.closePath(); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = Math.max(3, r * 0.06); ctx.stroke(); }); ctx.restore(); };
  const flame = (x, y, t, i) => { ellipse(x, y - 26 + Math.sin(t * 9 + i * 2) * 3, 11, 24, D_W); circle(x, y - 26, 38, 'rgba(255,255,255,0.12)'); };
  const menorah = (x, y, s, t) => { // nine branches: four each side and a taller middle one
    for (let i = 1; i <= 4; i++) { ctx.beginPath(); ctx.arc(x, y - 150 * s, i * 70 * s, 0, Math.PI); ctx.strokeStyle = D_G; ctx.lineWidth = 12 * s; ctx.lineCap = 'round'; ctx.stroke(); }
    line(x, y - 190 * s, x, y + 175 * s, D_G, 16 * s); fillRR(x - 110 * s, y + 170 * s, 220 * s, 26 * s, 10, D_G);
    for (let i = -4; i <= 4; i++) { const px = x + i * 70 * s, py = i === 0 ? y - 190 * s : y - 150 * s; fillRR(px - 9 * s, py - 50 * s, 18 * s, 50 * s, 4, D_L); flame(px, py - 50 * s, t, i + 4); }
  };
  const teacher = (x, y, h, t = 0, walk = false) => { const u = h / 100; dMan(x, y, h, D_L, { run: walk ? t * 7 : 0 }); fillRR(x - 17 * u, y - 100 * u, 34 * u, 6 * u, 3, '#555'); fillRR(x - 10 * u, y - 113 * u, 20 * u, 15 * u, 4, '#555'); poly([[x - 8 * u, y - 82 * u], [x + 8 * u, y - 82 * u], [x, y - 62 * u]], '#8c8c8c'); fillRR(x + 20 * u, y - 52 * u, 18 * u, 23 * u, 3, '#fff'); line(x + 29 * u, y - 52 * u, x + 29 * u, y - 29 * u, '#000', 3); };
  const house = (x, base, w, h) => { fillRR(x - w / 2, base - h, w, h, 4, '#333'); poly([[x - w / 2 - 18, base - h], [x, base - h - w * 0.45], [x + w / 2 + 18, base - h]], '#666'); fillRR(x - 20, base - h * 0.55, 40, h * 0.55, 4, '#111'); [-0.28, 0.28].forEach((f) => fillRR(x + f * w - 17, base - h * 0.78, 34, 34, 4, D_L)); };
  const tile = (x, y, label, t, at, icon) => { const k = pop(t, at, 0.35); if (k <= 0) return; xf(x, y, clamp(k), 0, () => { card(x - 210, y - 215, 420, 430, { r: 34, fill: 'rgba(255,255,255,0.06)', stroke: 'rgba(255,255,255,0.35)' }); icon(x, y - 40); text(label, x, y + 150, 52, 900, D_W, 'center', 0.05); }); };

  const S = [
    { type: 'art', sfx: [[2, 'pop', 0.22]], draw(t, a, c, L) {
      dHead('A TRUE HOLIDAY STORY'); dBig('1700s', 505, t, -0.4, 260);
      menorah(CX, 960, 1, t);
      [[200, 1260], [360, 1300], [720, 1300], [880, 1260], [540, 1290]].forEach(([x, y], i) => coin(x, y + Math.sin(t * 2.5 + i) * 7, 74, i % 2 ? D_G : D_L));
      dStamp('NOT JUST FOR KIDS', CX, 1135, t, ch(L, 2), 66, -0.04);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.22]], draw(t, a, c, L) {
      dHead('EASTERN EUROPE');
      line(0, 1300, W, 1300, D_D, 8);
      dMan(215, 1300, 480, D_G); teacher(800, 1300, 600);
      const k = ease.inOut(seg(t, a + 0.3, ch(L, 2))); coin(lerp(350, 690, k), 900 - Math.sin(k * Math.PI) * 330, 82);
      text('TEACHER', 800, 555, 52, 900, D_W, 'center', 0.1);
      dStamp('THANK YOU', 380, 480, t, ch(L, 2) + 0.02, 90, -0.07);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.18]], draw(t, a, c, L) {
      dHead('ON THE ROAD');
      [[190, 760], [560, 1010], [880, 760]].forEach(([x, y], i) => { house(x - 55, y, 150, 150); house(x + 85, y + 10, 120, 110); });
      ctx.save(); ctx.setLineDash([22, 24]); ctx.beginPath(); ctx.moveTo(80, 860); ctx.quadraticCurveTo(330, 760, 480, 1120); ctx.quadraticCurveTo(720, 1330, 970, 860); ctx.strokeStyle = D_G; ctx.lineWidth = 9; ctx.stroke(); ctx.restore();
      const k = seg(t, a + 0.1, VO_AT[L + 1]); teacher(lerp(110, 930, k), 1280 - Math.sin(k * Math.PI) * 40, 320, t, true);
      dStamp('VILLAGE TO VILLAGE', CX, 460, t, ch(L, 1) + 0.02, 62, -0.03, true);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.22], [3, 'pop', 0.24]], draw(t, a, c, L) {
      dHead('PAID WITH WHAT THEY HAD');
      tile(300, 635, 'COINS', t, a + 0.08, (x, y) => { coin(x - 70, y + 30, 70, D_G); coin(x + 70, y + 20, 70, D_G); coin(x, y - 40, 82); });
      tile(780, 635, 'FOOD', t, ch(L, 1) - 0.05, (x, y) => { ellipse(x, y + 10, 140, 82, D_L); [-60, 0, 60].forEach((d) => line(x + d - 18, y - 40, x + d + 18, y + 20, '#555', 12)); });
      tile(300, 1105, 'HONEY', t, ch(L, 2) + 0.45, (x, y) => { fillRR(x - 80, y - 50, 160, 150, 40, D_L); fillRR(x - 62, y - 90, 124, 40, 10, D_G); fillRR(x - 55, y + 0, 110, 52, 8, '#000'); text('HONEY', x, y + 27, 28, 900, '#fff', 'center', 0.06); });
      tile(780, 1105, 'WHISKEY', t, ch(L, 3) + 0.02, (x, y) => { fillRR(x - 62, y - 30, 124, 135, 20, D_G); fillRR(x - 24, y - 112, 48, 90, 8, D_G); fillRR(x - 30, y - 128, 60, 22, 6, D_W); fillRR(x - 46, y + 12, 92, 56, 6, D_W); });
    } },
    { type: 'art', sfx: [[2, 'ding', 0.22]], draw(t, a, c, L) {
      dHead('A CENTURY LATER'); dBig('1800s', 505, t, a + 0.02, 260);
      line(0, 1300, W, 1300, D_D, 8);
      teacher(170, 1300, 430);
      const hop = (i) => Math.abs(Math.sin(t * 5 + i)) * 26 * dIn(t, ch(L, 2));
      dMan(720, 1300 - hop(0), 300, D_W, { arms: t > ch(L, 2) ? 'up' : 'down', run: t * 5 }); dMan(920, 1300 - hop(2), 250, D_L, { arms: t > ch(L, 2) ? 'up' : 'down', run: t * 5 + 1 });
      for (let i = 0; i < 5; i++) { const k = ease.inOut(seg(t, ch(L, 1) + i * 0.16, ch(L, 1) + 0.9 + i * 0.16)); if (k > 0) coin(lerp(270, 700 + (i % 3) * 95, k), lerp(1000, 900 - (i % 2) * 70, k) - Math.sin(k * Math.PI) * (250 - i * 20), 46, i % 2 ? D_G : D_L); }
    } },
    { type: 'art', sfx: [[3, 'dding', 0.2]], draw(t, a, c, L) {
      dHead('AMERICA · 1920s');
      const k = ease.inOut(seg(t, ch(L, 2) - 0.1, ch(L, 3) + 0.2)), x = CX, y = 720;
      circle(x, y, 270, '#3a3a3a'); ring(x, y, 205, '#222', 18); text('CHOCOLATE', x, y + 4, 62, 900, '#bbb', 'center', 0.06);
      if (k > 0) { ctx.save(); ctx.beginPath(); ctx.rect(x - 290, y - 290, 580 * k, 580); ctx.clip(); coin(x, y, 274, D_L); for (let i = 0; i < 14; i++) line(x - 240 + hash(i) * 440, y - 220 + hash(i + 3) * 420, x - 200 + hash(i) * 440, y - 255 + hash(i + 3) * 420, 'rgba(255,255,255,0.9)', 7); ctx.restore(); }
      for (let i = 0; i < 7; i++) { const e = pop(t, a + 0.25 + i * 0.07, 0.3); if (e > 0) coin(150 + i * 130, 1120 + (i % 2) * 55, 66 * clamp(e), i % 2 ? D_G : D_L); }
      dStamp('GOLD FOIL', CX, 1305, t, ch(L, 3) + 0.02, 84, -0.04);
    } },
    { type: 'art', draw(t, a, c, L) {
      dHead('TODAY');
      [[260, 640, 110], [500, 600, 130], [770, 650, 115], [380, 820, 105], [650, 830, 120]].forEach(([x, y, r], i) => coin(x, y + Math.sin(t * 2 + i) * 8, r, i % 2 ? D_G : D_L));
      const fade = 1 - 0.86 * ease.inOut(seg(t, ch(L, 2) + 0.3, ch(L, 3) + 0.9));
      withFade(dIn(t, ch(L, 2) - 0.05) * fade, () => { ctx.save(); ctx.translate(CX, 1150); ctx.rotate(-0.04); fillRR(-360, -140, 720, 280, 18, '#fff'); text('THANK YOU', 0, -20, 108, 900, '#000', 'center', 0.01); text('for showing up', 0, 78, 48, 600, '#333', 'center', 0); ctx.restore(); });
    } },
    { type: 'art', sfx: [[2, 'pop', 0.2]], draw(t, a, c, L) {
      dHead('YOUR REGULARS');
      const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      M.forEach((m, i) => { const x = 110 + (i % 4) * 220, y = 420 + Math.floor(i / 4) * 200, on = t > a + 0.15 + i * 0.12; fillRR(x, y, 200, 175, 22, on ? '#fff' : 'rgba(255,255,255,0.07)'); text(m, x + 100, y + 45, 36, 800, on ? '#000' : '#777', 'center', 0.08); if (on) check(x + 100, y + 110, 54, '#000', 12); });
      const k = pop(t, ch(L, 2) - 0.05, 0.35); if (k > 0) xf(CX, 1195, clamp(k), 0, () => { fillRR(190, 1090, 700, 210, 44, '#161616'); strokeRR(190, 1090, 700, 210, 44, D_G, 5); text('your reply:', CX, 1145, 36, 600, D_G, 'center', 0); [-70, 0, 70].forEach((d, i) => circle(CX + d, 1225, 18, Math.sin(t * 6 - i) > 0 ? D_W : '#555')); });
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Thank you for this year.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'gelt', who: 'Marcus', scenes: S };
})();
