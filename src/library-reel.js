// MsgHealth · library (San Francisco, 2017: a book comes back 100 years late) · black/white story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // closed book, centred, about 440 x 600 at s = 1
  const book = (x, y, s, rot = 0, fn) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    fillRR(-205, -285, 440, 600, 18, D_W); [262, 280, 298].forEach((d) => line(-170, d, 215, d, '#999', 5));
    fillRR(-230, -310, 440, 580, 18, '#4a4a4a'); strokeRR(-230, -310, 440, 580, 18, D_L, 6); fillRR(-230, -310, 64, 580, 18, '#2e2e2e'); strokeRR(-135, -275, 310, 510, 8, D_G, 4);
    if (fn) fn(); ctx.restore(); };
  const small = (x, y, w, rot, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-w / 2, -w * 0.65, w, w * 1.3, 6, col); fillRR(-w / 2 + w * 0.14, -w * 0.65, w * 0.08, w * 1.3, 2, '#000'); fillRR(-w * 0.12, -w * 0.35, w * 0.48, w * 0.1, 3, '#000'); ctx.restore(); };
  const woman = (x, y, h, col) => { dMan(x, y, h, col); const u = h / 100; poly([[x - 13 * u, y - 66 * u], [x + 13 * u, y - 66 * u], [x + 27 * u, y - 10 * u], [x - 27 * u, y - 10 * u]], col); circle(x, y - 99 * u, 8 * u, col); };
  const S = [
    { type: 'art', sfx: [[2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('SAN FRANCISCO');
      book(CX, 740 + Math.sin(t * 2.2) * 10, 1.12, -0.06, () => { text('LIBRARY', 20, -150, 62, 900, D_W, 'center', 0.14); text('BOOK', 20, -60, 62, 900, D_W, 'center', 0.14); });
      dDust(t, 150, 360, 780, 760, 34, 0.7, -26);
      dStamp('100 YEARS LATE', CX, 1265, t, ch(L, 2) - 0.15, 82, -0.05);
    } },
    { type: 'art', sfx: [[1, 'dimpact', 0.28]], draw(t, a, c, L) {
      dHead('THE ACTUAL TITLE');
      const k = pop(t, ch(L, 1) - 0.05, 0.4);
      book(CX, 800, 1.45, 0.03, () => { if (k <= 0) { text('?', 20, -20, 220, 900, D_G, 'center', 0); return; } ctx.save(); ctx.scale(clamp(k), clamp(k)); ['FORTY', 'MINUTES', 'LATE'].forEach((s, i) => text(s, 20, -140 + i * 130, i === 2 ? 104 : 68, 900, D_W, 'center', 0.02)); ctx.restore(); });
      dStamp('NOT A JOKE', CX, 1325, t, ch(L, 2) + 0.05, 66, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dknock', 0.2]], draw(t, a, c, L) {
      dHead('AROUND 1917'); line(0, 1200, W, 1200, D_D, 8);
      woman(300, 1200, 540, D_L);
      for (let i = 0; i < 4; i++) { fillRR(640, 450 + i * 150, 360, 24, 6, D_D); for (let j = 0; j < 7; j++) fillRR(655 + j * 48, 450 + i * 150 - 104 + hash(i * 7 + j) * 18, 40, 104 - hash(i * 7 + j) * 18, 4, j % 3 ? D_G : D_D); }
      fillRR(430, 960, 560, 240, 14, '#262626'); fillRR(410, 940, 600, 36, 8, D_G);
      const k = ease.out(seg(t, ch(L, 1) - 0.2, ch(L, 1) + 0.35)); small(lerp(780, 450, k), 880, 100, -0.15, D_W);
      dStamp('CHECKED OUT', 700, 1075, t, ch(L, 1) + 0.35, 54, -0.07);
      dStamp('1917', CX, 1320, t, ch(L, 2), 110, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'dthud', 0.18]], draw(t, a, c, L) {
      dHead('BEFORE THE DUE DATE');
      fillRR(280, 420, 520, 500, 20, '#e8e8e8'); fillRR(280, 420, 520, 120, 20, D_G); text('DUE', CX, 482, 70, 900, '#000', 'center', 0.2);
      for (let i = 0; i < 15; i++) { const x = 340 + (i % 5) * 100, y = 625 + Math.floor(i / 5) * 105; text(String(i + 1), x, y, 44, 800, '#444', 'center', 0); }
      const d = dIn(t, a + 0.35, 0.35); if (d > 0) ring(640, 730, 50 + (1 - d) * 40, '#000', 10);
      const k = dIn(t, ch(L, 0) + 0.45, 0.5); if (k > 0) withFade(k, () => { fillRR(410, 970, 260, 340, 130, '#1c1c1c'); strokeRR(410, 970, 260, 340, 130, D_L, 10); woman(CX, 1275, 240, D_L); });
    } },
    { type: 'art', sfx: [[0, 'dknock', 0.2], [2, 'dcount', 0.18]], draw(t, a, c, L) {
      dHead('IN THE FAMILY'); line(0, 1160, W, 1160, D_D, 8);
      const shut = ease.in(seg(t, a + 0.25, a + 0.95));
      fillRR(190, 820, 700, 340, 24, '#333'); strokeRR(190, 820, 700, 340, 24, D_L, 8); [330, 750].forEach((x) => fillRR(x - 22, 820, 44, 340, 4, D_G)); fillRR(505, 850, 70, 80, 10, D_W);
      if (shut < 1) small(CX, 700 + shut * 190, 120, 0.12, D_W);
      ctx.save(); ctx.translate(190, 820); ctx.rotate(lerp(-0.26, 0, shut)); fillRR(0, -110, 700, 110, 50, '#444'); strokeRR(0, -110, 700, 110, 50, D_L, 8); ctx.restore();
      const k = seg(t, ch(L, 1) - 0.2, ch(L, 2) + 0.35), yr = k >= 1 ? 2017 : 1917 + Math.round(k * 20) * 5; dNum(String(yr), 470, 190);
      dDust(t, 190, 600, 700, 520, 28, 0.8, -14);
      dStamp('OLD TRUNK', CX, 1290, t, ch(L, 1) - 0.05, 80, -0.04, true);
    } },
    { type: 'art', sfx: [[2, 'dding', 0.2], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('THE DEAL · 2017');
      line(300, 400, CX, 330 + 60, D_G, 8); line(780, 400, CX, 390, D_G, 8);
      fillRR(140, 440, 800, 760, 34, D_W); strokeRR(168, 468, 744, 704, 22, '#000', 8);
      text('RETURN IT', CX, 560, 80, 900, '#000', 'center', 0.08);
      if (t < ch(L, 2) - 0.05) text('A DEAL', CX, 790, 120, 900, '#999', 'center', 0.1);
      const k = pop(t, ch(L, 2) - 0.05, 0.35); if (k > 0) xf(CX, 780, clamp(k), 0, () => { text('6 WEEKS', CX, 760, 146, 900, '#000', 'center', -0.02); text('JAN 3 TO FEB 14', CX, 880, 50, 800, '#555', 'center', 0.08); });
      dStamp('NO LATE FEES', CX, 1045, t, ch(L, 3), 84, -0.05, true);
    } },
    { type: 'art', sfx: [[2, 'dshutter', 0.16], [3, 'dimpact', 0.26]], draw(t, a, c, L) {
      dHead('JANUARY 2017'); line(0, 1220, W, 1220, D_D, 8);
      dMan(860, 1060, 380, D_G); fillRR(640, 920, 380, 300, 14, '#262626'); fillRR(620, 898, 420, 38, 8, D_G); text('RETURNS', 830, 1070, 56, 900, D_W, 'center', 0.1);
      const w = ease.inOut(seg(t, a, ch(L, 3) + 0.1)), x = lerp(90, 430, w), put = ease.out(seg(t, ch(L, 3), ch(L, 3) + 0.35));
      dMan(x, 1220, 540, D_W, { run: w < 1 ? t * 7 : 0 }); small(lerp(x + 130, 690, put), lerp(930, 850, put), 92, -0.2 + put * 0.2, D_L);
      dStamp('WEBB JOHNSON', 450, 500, t, ch(L, 1), 66, -0.05);
      dStamp('GREAT GRANDSON', 460, 625, t, ch(L, 1) + 0.3, 50, 0.03, true);
    } },
    { type: 'art', sfx: [[1, 'driser', 0.14], [3, 'dwhoosh', 0.24]], draw(t, a, c, L) {
      dHead('NOT JUST HIM');
      for (let i = 0; i < 90; i++) { const k = ease.out(seg(t, a - 0.6 + i * 0.026, a - 0.15 + i * 0.026)); if (k <= 0) continue; const col = i % 9, row = Math.floor(i / 9), tx = 100 + col * 110 + (row % 2) * 24 - 12, ty = 1300 - row * 62; small(lerp(-200 - hash(i) * 500, tx, k), lerp(ty - 300 - hash(i + 1) * 500, ty, k), 82, (1 - k) * 6 + (hash(i + 2) - 0.5) * 0.7, [D_W, D_L, D_G][i % 3]); }
      const n = ease.out(seg(t, ch(L, 1) - 0.1, ch(L, 2) + 0.5)), v = n >= 1 ? 700000 : Math.round(700000 * n / 25000) * 25000;
      if (n > 0) { fillRR(90, 380, 900, 300, 30, '#000'); strokeRR(90, 380, 900, 300, 30, D_W, 6); if (n >= 1) text('NEARLY', CX, 440, 52, 900, D_G, 'center', 0.2); dNum(v.toLocaleString(), 570, 165); }
      dStamp('ITEMS BACK', CX, 790, t, ch(L, 3), 66, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dding', 0.22]], draw(t, a, c, L) {
      dHead('WELCOME BACK');
      for (let i = 0; i < 12; i++) { const x = 130 + (i % 3) * 290, y = 410 + Math.floor(i / 3) * 175, e = pop(t, a - 0.12 + i * 0.1, 0.3); if (e > 0) xf(x + 120, y + 70, clamp(e), 0, () => { fillRR(x, y, 240, 145, 18, D_W); text('LIBRARY', x + 120, y + 34, 30, 900, '#000', 'center', 0.12); dotPerson(x + 55, y + 88, 62, '#000'); fillRR(x + 100, y + 70, 110, 14, 7, '#999'); fillRR(x + 100, y + 104, 74, 14, 7, '#999'); }); }
      dStamp('5,000+ PEOPLE', CX, 1200, t, ch(L, 1) - 0.1, 90, -0.05, true);
      dStamp('BACK IN', CX, 1320, t, ch(L, 2) + 0.05, 66, 0.04);
    } },
    { type: 'art', sfx: [[1, 'dthud', 0.2]], draw(t, a, c, L) {
      dHead('YOUR DOOR'); line(0, 1260, W, 1260, D_D, 8);
      fillRR(580, 420, 400, 840, 14, '#2c2c2c'); fillRR(630, 480, 300, 780, 8, '#e8e8e8'); circle(672, 880, 18, '#000'); text('SHOP', 780, 630, 70, 900, '#000', 'center', 0.12);
      const sway = Math.sin(t * 2.2) * 40; dMan(320 + sway, 1260, 520, D_L, { run: Math.cos(t * 2.2) * 1.2 });
      dStamp('SO LONG GONE', 360, 470, t, ch(L, 1), 62, -0.06, true);
      const k = pop(t, ch(L, 2), 0.35); if (k > 0) xf(330, 620, clamp(k), 0, () => { fillRR(90, 560, 480, 130, 50, '#fff'); poly([[300, 685], [360, 685], [340, 735]], '#fff'); text('is it weird?', 330, 628, 62, 800, '#000', 'center', 0); });
      dStamp('FEELS WEIRD', 330, 1335, t, ch(L, 3), 56, -0.04);
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'library', who: 'Marcus', scenes: S };
})();
