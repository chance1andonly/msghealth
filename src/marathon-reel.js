// MsgHealth · marathon · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // runner / person with jointed legs, feet at (x, y), height h. o: { run, hat, bag, long, lean, col }
  const runner = (x, y, h, o = {}) => {
    const u = h / 100, ph = o.run || 0, col = o.col || D_W;
    ctx.save(); ctx.translate(x, y - Math.abs(Math.sin(ph)) * 4 * u); ctx.rotate(o.lean || 0);
    [[1, D_G], [-1, col]].forEach(([d, c]) => {
      const a = Math.sin(ph) * 0.75 * d, kx = Math.sin(a) * 24 * u, ky = -46 * u + Math.cos(a) * 24 * u, b = a - (ph ? 0.35 + 0.35 * Math.max(0, Math.cos(ph) * d) : 0);
      line(0, -46 * u, kx, ky, o.long ? '#9a9a9a' : c, 10 * u); line(kx, ky, kx + Math.sin(b) * 23 * u, ky + Math.cos(b) * 23 * u, o.long ? '#9a9a9a' : c, 9 * u);
    });
    fillRR(-12 * u, -78 * u, 24 * u, 36 * u, 10 * u, col);
    [[1, D_G], [-1, col]].forEach(([d, c]) => { const a = -Math.sin(ph) * 0.9 * d + (o.arms === 'up' ? 2.6 * d : 0.15 * d), ex = Math.sin(a) * 17 * u, ey = -72 * u + Math.cos(a) * 17 * u; line(0, -72 * u, ex, ey, c, 7 * u); line(ex, ey, ex + Math.sin(a + (ph ? 1.2 : 0.2)) * 15 * u, ey + Math.cos(a + (ph ? 1.2 : 0.2)) * 15 * u, c, 6 * u); });
    circle(2 * u, -90 * u, 12 * u, col);
    if (o.hat) { ellipse(0, -100 * u, 17 * u, 7 * u, D_G, -0.15); circle(2 * u, -107 * u, 3 * u, D_G); }
    if (o.bag) { line(-10 * u, -74 * u, 14 * u, -46 * u, '#555', 4 * u); fillRR(6 * u, -52 * u, 20 * u, 17 * u, 4 * u, '#6a6a6a'); }
    ctx.restore();
  };
  const road = (t, y = 1250, speed = 420) => { line(0, y, W, y, D_D, 8); for (let i = 0; i < 9; i++) { const x = ((i * 150 - t * speed) % 1350 + 1350) % 1350 - 120; fillRR(x, y + 46, 80, 12, 6, '#333'); } };
  const skull = (x, y, s) => {
    line(x - s, y + s * 0.55, x + s, y + s * 1.15, '#000', s * 0.2); line(x + s, y + s * 0.55, x - s, y + s * 1.15, '#000', s * 0.2);
    circle(x, y - s * 0.12, s * 0.72, '#000'); fillRR(x - s * 0.4, y + s * 0.3, s * 0.8, s * 0.48, s * 0.14, '#000');
    circle(x - s * 0.28, y - s * 0.1, s * 0.2, '#fff'); circle(x + s * 0.28, y - s * 0.1, s * 0.2, '#fff'); poly([[x, y + s * 0.08], [x - s * 0.1, y + s * 0.28], [x + s * 0.1, y + s * 0.28]], '#fff');
    [-0.2, 0, 0.2].forEach((d) => line(x + d * s, y + s * 0.5, x + d * s, y + s * 0.76, '#fff', s * 0.05));
  };
  const poison = (x, y, s, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    fillRR(-62, -330, 124, 70, 12, '#8c8c8c'); fillRR(-80, -272, 160, 90, 26, '#4a4a4a'); fillRR(-170, -210, 340, 430, 56, '#2f2f2f'); strokeRR(-170, -210, 340, 430, 56, D_W, 8);
    fillRR(-140, -130, 280, 300, 16, D_W); skull(0, -50, 62); text('RAT', 0, 78, 58, 900, '#000', 'center', 0.06); text('POISON', 0, 136, 58, 900, '#000', 'center', 0.04); ctx.restore(); };
  const medal = (x, y, r, label = '1ST', fs = 0.62) => { poly([[x - r * 0.9, y - r * 2.1], [x - r * 0.3, y - r * 2.1], [x + r * 0.2, y - r * 0.6], [x - r * 0.4, y - r * 0.5]], D_G); poly([[x + r * 0.9, y - r * 2.1], [x + r * 0.3, y - r * 2.1], [x - r * 0.2, y - r * 0.6], [x + r * 0.4, y - r * 0.5]], '#b0b0b0'); circle(x, y, r, D_W); ring(x, y, r * 0.76, '#000', r * 0.08); text(label, x, y + 3, r * fs, 900, '#000', 'center'); };
  const dog = (x, y, s, ph) => { ctx.save(); ctx.translate(x, y - Math.abs(Math.sin(ph)) * 18 * s); ctx.scale(s, s);
    [[-70, 0], [-40, 1.7], [55, 3.1], [85, 4.6]].forEach(([lx, p], i) => { const a = Math.sin(ph + p) * 0.7; line(lx, -70, lx + Math.sin(a) * 70, -70 + Math.cos(a) * 70, i % 2 ? D_L : '#8c8c8c', 22); });
    ellipse(0, -88, 112, 52, D_L, -0.05); line(-98, -105, -160, -150 + Math.sin(ph * 2) * 14, D_L, 20);
    circle(118, -142, 46, D_L); poly([[92, -172], [90, -232], [126, -184]], D_L); poly([[120, -180], [150, -230], [154, -166]], '#8c8c8c');
    poly([[140, -165], [210, -140], [145, -134]], D_L); poly([[140, -124], [200, -108], [140, -102]], D_L); [150, 168, 186].forEach((tx) => poly([[tx, -134], [tx + 8, -117], [tx + 14, -134]], '#fff'));
    circle(134, -152, 7, '#000'); ctx.restore(); };
  const tree = (x, y) => { fillRR(x - 28, y - 260, 56, 260, 10, '#555'); [[0, -340, 130], [-110, -280, 90], [110, -280, 90], [-55, -400, 85], [65, -400, 85]].forEach(([dx, dy, r]) => circle(x + dx, y + dy, r, '#2e2e2e')); };
  const apple = (x, y, r) => { circle(x, y, r, '#9a9a9a'); circle(x + r * 0.35, y + r * 0.2, r * 0.4, '#333'); line(x, y - r, x + 6, y - r - 16, D_W, 5); };
  const car = (x, y, t) => { ctx.save(); ctx.translate(x, y + Math.sin(t * 22) * 3);
    fillRR(-230, -190, 420, 110, 22, D_G); fillRR(150, -150, 110, 70, 18, '#6a6a6a'); line(-210, -190, -240, -260, D_G, 18); fillRR(-262, -285, 80, 30, 12, D_G);
    [[-150, 0], [180, 0]].forEach(([wx]) => { circle(wx, -58, 66, '#111'); ring(wx, -58, 66, D_W, 11); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + t * 11; line(wx, -58, wx + Math.cos(a) * 58, -58 + Math.sin(a) * 58, D_W, 5); } circle(wx, -58, 14, D_W); });
    line(120, -190, 100, -265, D_W, 9); circle(96, -272, 26, 'rgba(0,0,0,0)'); ring(96, -272, 26, D_W, 8); ctx.restore(); };
  const crowd = (t, y, a = 1) => withFade(a, () => { for (let i = 0; i < 11; i++) dMan(70 + i * 94, y + (i % 2) * 18, 150, i % 2 ? D_D : '#6a6a6a', { arms: 'up', run: t * 9 + i }); });
  const spiral = (x, y, r, t) => { ctx.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 5 + t * 6, q = r * i / 60; i ? ctx.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q) : ctx.moveTo(x, y); } ctx.strokeStyle = D_W; ctx.lineWidth = 6; ctx.stroke(); };
  const S = [
    { type: 'art', sfx: [[2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('ST. LOUIS · AUGUST 30, 1904'); road(t);
      runner(300, 1250, 470, { run: t * 11 });
      poison(775, 960, 1.02, Math.sin(t * 2.4) * 0.08 + 0.06);
      const m = pop(t, a + 0.15, 0.4); if (m > 0) xf(330, 560, clamp(m), 0, () => medal(330, 600, 105));
      dStamp('HE WON', 700, 480, t, ch(L, 1), 88, 0.07);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('THE CONDITIONS');
      const sx = 300, sy = 640; for (let i = 0; i < 12; i++) { const an = i * Math.PI / 6 + t * 0.5; line(sx + Math.cos(an) * 150, sy + Math.sin(an) * 150, sx + Math.cos(an) * (205 + Math.sin(t * 4 + i) * 14), sy + Math.sin(an) * (205 + Math.sin(t * 4 + i) * 14), D_L, 16); } circle(sx, sy, 120, D_W);
      const k = ease.out(seg(t, a, a + 1.2)); fillRR(740, 430, 110, 480, 55, 'rgba(255,255,255,0.12)'); strokeRR(740, 430, 110, 480, 55, D_W, 7); fillRR(770, 880 - 400 * k, 50, 400 * k, 25, D_W); circle(795, 930, 84, D_W);
      dBig(Math.round(lerp(60, 90, k)) + '°F', 1160, t, a, 210);
      dStamp('LESS WATER, FOR SCIENCE', CX, 1315, t, ch(L, 2), 54, -0.04);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE COURSE'); dBig('24', 520, t, a, 260); withFade(dIn(t, a + 0.2), () => text('MILES OF DUST ROADS', CX, 695, 46, 800, D_G, 'center', 0.1));
      const P = [[90, 1290], [300, 1120], [180, 960], [520, 880], [800, 1010], [700, 1180], [990, 1290]];
      const path = (col, lw) => { ctx.beginPath(); ctx.moveTo(...P[0]); for (let i = 1; i < P.length; i++) ctx.lineTo(...P[i]); ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };
      path('#3a3a3a', 54); ctx.save(); ctx.setLineDash([22, 22]); ctx.lineDashOffset = -t * 90; path(D_G, 6); ctx.restore();
      const k = pop(t, ch(L, 1), 0.4); if (k > 0) xf(520, 880, clamp(k), 0, () => { glow(520, 850, 210, '#ffffff', 0.25); fillRR(440, 770, 160, 180, 26, D_W); poly([[466, 800], [574, 800], [558, 925], [482, 925]], '#000'); const wy = 850 + Math.sin(t * 5) * 5; poly([[473, wy], [567, wy], [558, 918], [482, 918]], '#bdbdbd'); });
      dStamp('ONE STOP', 790, 800, t, ch(L, 1) + 0.15, 66, 0.07);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.28], [2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('MILE... WHO KNOWS'); road(t, 1250, -520);
      const go = ease.in(seg(t, ch(L, 1), ch(L, 2) + 1.4));
      ctx.save(); ctx.translate(CX * 2, 0); ctx.scale(-1, 1); runner(760 + go * 120, 1250, 380, { run: t * 16, arms: 'up' }); const k = dIn(t, a + 0.2, 0.7); dog(-200 + 540 * k + go * 140, 1250, 1.25, t * 15); ctx.restore();
      withFade(dIn(t, ch(L, 1)), () => { ctx.save(); ctx.setLineDash([26, 20]); ctx.beginPath(); ctx.moveTo(980, 820); ctx.bezierCurveTo(700, 820, 520, 720, 170, 520); ctx.strokeStyle = D_G; ctx.lineWidth = 10; ctx.stroke(); ctx.restore(); poly([[120, 492], [215, 500], [175, 575]], D_W); text('FINISH', 880, 780, 40, 800, D_G, 'center', 0.14); });
      dStamp('1 MILE OFF COURSE', 610, 480, t, ch(L, 1), 54, 0.04); dStamp('WILD DOG', CX, 1340, t, ch(L, 2), 62, -0.05, true);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.25], [4, 'ding', 0.25]], draw(t, a, c, L) {
      dHead('THE CUBAN MAILMAN');
      const nap = dIn(t, ch(L, 3) - 0.1, 0.4), up = dIn(t, ch(L, 4) - 0.1, 0.35);
      withFade(dIn(t, ch(L, 2) - 0.2) * (1 - up), () => tree(810, 1250));
      line(0, 1250, W, 1250, D_D, 8);
      if (up > 0) { runner(CX, 1250, 430, { run: t * 12, long: true, hat: true }); }
      else if (nap > 0.5) { runner(640, 1200, 420, { lean: -1.5, long: true, hat: true }); [0, 1, 2].forEach((i) => { const p = ((t * 0.7 + i / 3) % 1); text('Z', 250 + p * 130, 1050 - p * 260, 50 + p * 60, 900, `rgba(255,255,255,${1 - p})`, 'center'); }); }
      else runner(340, 1250, 430, { run: t < ch(L, 2) ? t * 11 : 0, long: true, hat: true, bag: true });
      const ap = dIn(t, ch(L, 2), 0.3) * (1 - up); withFade(ap, () => { [[760, 900], [870, 830], [700, 780], [900, 960], [790, 720]].forEach(([x, y]) => apple(x, y, 30)); apple(620, 1215, 34); apple(700, 1222, 34); for (let i = 0; i < 6; i++) circle(660 + Math.cos(t * 7 + i) * (70 + i * 9), 1150 + Math.sin(t * 9 + i * 2) * 40, 6, D_W); });
      if (t < ch(L, 2)) dStamp('IN STREET CLOTHES', CX, 520, t, ch(L, 1), 62, -0.04);
      else if (t < ch(L, 3)) dStamp('ROTTEN APPLES', CX, 520, t, ch(L, 2), 76, 0.05);
      else if (t < ch(L, 4)) dStamp('NAP TIME', CX, 520, t, ch(L, 3), 90, -0.05);
      else { medal(CX, 640, 120, '4TH'); }
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.28], [3, 'pop', 0.25]], draw(t, a, c, L) {
      const fin = t >= ch(L, 2) - 0.12;
      if (!fin) { dHead('MEANWHILE'); road(t, 1250, 900); const x = lerp(-160, 560, ease.out(seg(t, a, a + 1.0))); runner(x - 70, 1062, 300, { arms: 'up' }); car(x, 1250, t); for (let i = 0; i < 6; i++) circle(x - 330 - ((t * 600 + i * 90) % 300), 1180 + Math.sin(i * 3) * 40, 20 + i * 5, 'rgba(255,255,255,0.12)');
        const n = Math.round(10 * seg(t, ch(L, 1) - 0.1, ch(L, 2) - 0.3)); withFade(dIn(t, ch(L, 1) - 0.2), () => { text(String(n), CX, 500, 240, 900, D_W, 'center', -0.04); text('MILES BY CAR', CX, 655, 50, 800, D_G, 'center', 0.12); }); }
      else { dHead('THE FINISH'); crowd(t, 1010, 1); line(0, 1250, W, 1250, D_D, 8); const x = lerp(80, 760, ease.out(seg(t, ch(L, 2) - 0.12, ch(L, 3) + 0.5))); line(560, 1250, 560, 900, D_G, 14); if (x < 560) { line(540, 1040, 600, 1040, D_W, 16); } runner(x, 1250, 420, { run: t * 10, arms: 'up' }); dStamp('FIRST?!', CX, 520, t, ch(L, 2), 110, -0.05); dStamp('THEY CHEERED', CX, 690, t, ch(L, 3), 66, 0.05, true); }
    } },
    { type: 'art', sfx: [[2, 'punch', 0.28], [3, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('THOMAS HICKS · THE REAL WINNER');
      const solo = 1 - dIn(t, ch(L, 1) - 0.1, 0.3); withFade(solo, () => { runner(CX, 1250, 600, { run: t * 6 }); });
      withFade(1 - solo, () => { runner(250, 1280, 360, { run: t * 4 }); dMan(850, 1280, 360, D_G); const r = Math.sin(t * 5) * 14; line(800, 1062, 650 + r, 1010, D_G, 22); line(650 + r, 1010, 560 + r, 990, D_L, 10); ellipse(535 + r, 986, 38, 24, D_W, -0.2); });
      const rp = pop(t, ch(L, 2), 0.4); if (rp > 0) xf(540, 760, clamp(rp), 0, () => poison(540, 790, 0.92, -0.1));
      const bk = pop(t, ch(L, 3), 0.4); if (bk > 0) xf(860, 620, clamp(bk), 0, () => { fillRR(820, 420, 80, 110, 14, D_W); fillRR(770, 520, 180, 300, 40, '#6a6a6a'); strokeRR(770, 520, 180, 300, 40, D_W, 7); fillRR(790, 600, 140, 130, 10, D_W); text('BRANDY', 860, 667, 30, 900, '#000', 'center', 0.04); });
      if (t < ch(L, 2)) dStamp('HIS OWN TRAINERS', CX, 480, t, ch(L, 1), 66, -0.04);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.28], [3, 'ding', 0.28]], draw(t, a, c, L) {
      dHead('THE FINAL STRETCH'); line(0, 1250, W, 1250, D_D, 8);
      const w = Math.sin(t * 3.2) * 0.13, carried = dIn(t, ch(L, 2) - 0.1, 0.4);
      runner(CX + Math.sin(t * 1.9) * 40, 1250 - carried * 70, 470, { lean: w, run: t * 3 });
      withFade(carried, () => { dMan(CX - 215 + Math.sin(t * 1.9) * 40, 1250, 400, D_G, { run: t * 4 }); dMan(CX + 215 + Math.sin(t * 1.9) * 40, 1250, 400, D_G, { run: t * 4 + 2 }); line(CX - 170, 970, CX - 40, 930, D_G, 20); line(CX + 170, 970, CX + 40, 930, D_G, 20); });
      withFade(dIn(t, ch(L, 1)), () => { spiral(330, 700, 80, t); spiral(760, 640, 100, -t); for (let i = 0; i < 6; i++) star(CX + Math.cos(t * 3 + i) * 190, 700 + Math.sin(t * 3 + i) * 70, 22, D_W); });
      const g = pop(t, ch(L, 3), 0.4); if (g > 0) xf(CX, 545, clamp(g), 0, () => medal(CX, 568, 90, 'GOLD', 0.46));
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.25]], draw(t, a, c, L) {
      dHead('YOUR REGULARS');
      [['Ava', 520], ['Marcus', 760], ['Priya', 1000]].forEach(([n, y], i) => { const k = dIn(t, a + 0.1 + i * 0.12); withFade(k, () => { dotPerson(150, y - 10, 110, D_W); text(n, 150, y + 78, 34, 800, D_G, 'center'); line(260, y, 940, y, D_D, 8); [260, 940].forEach((x) => { circle(x, y, 20, D_W); }); text('LAST CUT', 260, y + 55, 28, 800, D_G, 'left', 0.08); text('NEXT?', 940, y + 55, 28, 800, D_G, 'right', 0.08); const z = pop(t, ch(L, 2) + i * 0.12, 0.35); if (z > 0) xf(600, y, clamp(z), 0, () => { fillRR(470, y - 52, 260, 104, 14, D_W); text('NOTHING', 600, y + 3, 44, 900, '#000', 'center', 0.06); }); }); });
      dStamp('0 CHECK-INS', CX, 1260, t, ch(L, 2) + 0.2, 86, -0.04, true);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Ava', 92], ['Jordan', 85], ['Marcus', 42], ['Priya', 27]], msg: ['Marcus, it’s been a while.', 'Want your usual spot?'] },
  ];
  window.REEL = { name: 'marathon', who: 'Marcus', scenes: S };
})();
