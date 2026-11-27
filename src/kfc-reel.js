// MsgHealth · kfc (Britain, February 2018: the chicken ran out) · black/white story reel for src/hist.js (drawings use src/doc.js). Plain drawings only, no logos.
(() => {
  const bucket = (x, y, s) => { poly([[x - 220 * s, y - 230 * s], [x + 220 * s, y - 230 * s], [x + 160 * s, y + 250 * s], [x - 160 * s, y + 250 * s]], D_L); ellipse(x, y + 250 * s, 160 * s, 30 * s, D_L); ellipse(x, y - 230 * s, 232 * s, 52 * s, D_W); ellipse(x, y - 230 * s, 200 * s, 38 * s, '#000'); };
  const truck = (x, y, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-250, -210, 340, 190, 16, D_L); fillRR(100, -150, 150, 130, 22, D_G); fillRR(150, -130, 75, 55, 8, '#000'); [-160, 10, 170].forEach((d) => { circle(d, 0, 48, '#000'); ring(d, 0, 40, D_W, 10); }); text('DELIVERY', -80, -112, 52, 900, '#000', 'center', 0.06); ctx.restore(); };
  const crate = (x, y, s, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-s / 2, -s / 2, s, s, 8, D_G); strokeRR(-s / 2, -s / 2, s, s, 8, D_W, 5); line(-s / 2, -s / 2, s / 2, s / 2, D_W, 4); ctx.restore(); };
  const tile = (x, y, s, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-130, -150, 260, 300, 30, D_W); text(s, 0, 8, 210, 900, '#000', 'center', 0); ctx.restore(); };
  const paper = (x, y, w, h, rot, fn) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-w / 2, -h / 2, w, h, 8, '#ececec'); text('NEWSPAPER', 0, -h / 2 + 52, 48, 900, '#000', 'center', 0.12); line(-w / 2 + 30, -h / 2 + 92, w / 2 - 30, -h / 2 + 92, '#000', 6); if (fn) fn(); else { for (let i = 0; i < 9; i++) fillRR(-w / 2 + 50, -h / 2 + 140 + i * 56, (w - 100) * (i % 3 === 2 ? 0.6 : 1), 18, 9, '#bbb'); } ctx.restore(); };
  const S = [
    { type: 'art', sfx: [[2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('BRITAIN · 2018');
      bucket(CX, 700 + Math.sin(t * 2.4) * 10, 1.0);
      dStamp('EMPTY', CX, 710, t, -0.3, 130, -0.1, true);
      dBig('0', 1190, t, ch(L, 1), 260); withFade(dIn(t, ch(L, 1) + 0.15), () => text('CHICKEN', CX, 1345, 62, 900, D_L, 'center', 0.14));
    } },
    { type: 'art', sfx: [[2, 'dthud', 0.26]], draw(t, a, c, L) {
      dHead('ABOUT 900 SHOPS');
      const shut = ease.inOut(seg(t, ch(L, 2) - 0.05, ch(L, 2) + 0.9));
      for (let i = 0; i < 45; i++) { const x = 125 + (i % 9) * 104, y = 430 + Math.floor(i / 9) * 140, e = pop(t, a + 0.02 + i * 0.012, 0.25); if (e <= 0) continue; const dead = (i * 17) % 45 < 26 * shut; // 26 of 45: more than half
        fillRR(x - 40, y, 80, 92, 6, dead ? '#222' : D_W); poly([[x - 50, y], [x, y - 38], [x + 50, y]], dead ? '#444' : D_L);
        if (dead) { line(x - 28, y + 18, x + 28, y + 74, D_W, 9); line(x + 28, y + 18, x - 28, y + 74, D_W, 9); } else fillRR(x - 14, y + 44, 28, 48, 4, '#000'); }
      dStamp('MORE THAN HALF SHUT', CX, 1220, t, ch(L, 2) + 0.15, 66, -0.04);
    } },
    { type: 'art', sfx: [[2, 'whoosh', 0.2], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE NEW DELIVERY PLAN'); line(0, 1160, W, 1160, D_D, 8);
      const tip = ease.in(seg(t, ch(L, 2), ch(L, 3) + 0.1)), dx = ease.out(seg(t, a, a + 0.8));
      truck(lerp(-260, 480, dx), 1105 - tip * 30, tip * 0.42);
      for (let i = 0; i < 7; i++) { const k = seg(t, ch(L, 3) - 0.1 + i * 0.05, ch(L, 3) + 0.6 + i * 0.05); if (k > 0) crate(640 + k * (80 + hash(i) * 300), 850 - Math.sin(k * Math.PI) * (160 + hash(i + 2) * 260) + k * k * 260, 96, k * 5 * (hash(i + 4) - 0.5)); }
      dStamp('NEW COMPANY', CX, 520, t, ch(L, 1), 80, -0.05, true);
      dStamp('FACEPLANT', CX, 1300, t, ch(L, 3) + 0.05, 92, 0.04);
    } },
    { type: 'art', sfx: [[2, 'dding', 0.2]], draw(t, a, c, L) {
      dHead('THE PUBLIC REACTS'); line(0, 1300, W, 1300, D_D, 8);
      [[150, 330], [330, 390], [530, 350], [730, 400], [920, 340]].forEach(([x, h], i) => dMan(x, 1300 - Math.abs(Math.sin(t * 8 + i * 1.7)) * 24, h, i % 2 ? D_G : D_L, { arms: 'up', run: t * 9 + i }));
      ['!!', '?!', '!!!'].forEach((s, i) => { const k = pop(t, a + 0.2 + i * 0.3, 0.3); if (k > 0) xf(260 + i * 280, 720 + (i % 2) * 60, clamp(k), 0, () => text(s, 260 + i * 280, 720 + (i % 2) * 60, 120, 900, D_W, 'center', 0)); });
      const p = pop(t, ch(L, 2) - 0.05, 0.35); if (p > 0) xf(CX, 520, clamp(p), Math.sin(t * 40) * 9, () => { fillRR(180, 400, 720, 240, 40, '#fff'); text('CALLING', CX, 468, 54, 800, '#000', 'center', 0.12); text('POLICE', CX, 560, 112, 900, '#000', 'center', 0.02); });
    } },
    { type: 'art', sfx: [[2, 'dknock', 0.2]], draw(t, a, c, L) {
      dHead('LONDON POLICE'); line(0, 1300, W, 1300, D_D, 8);
      dMan(300, 1300, 560, D_L); fillRR(246, 730, 108, 56, 14, D_G); fillRR(230, 775, 140, 20, 8, '#555'); circle(300, 755, 14, D_W);
      line(360, 920, 480, 830, D_L, 34); circle(500, 810, 42, D_L);
      dStamp('PLEASE STOP', 740, 600, t, ch(L, 1) + 0.05, 70, 0.05);
      dStamp('NOT A', 760, 900, t, ch(L, 2) + 0.02, 78, -0.05, true); dStamp('POLICE MATTER', 735, 1040, t, ch(L, 2) + 0.18, 54, -0.05, true);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.22]], draw(t, a, c, L) {
      dHead('THEN, IN THE PAPERS');
      [[-0.18, 330, 0], [0.14, 760, 0.12]].forEach(([r, x, d]) => { const k = ease.out(seg(t, a + d, a + d + 0.5)); paper(lerp(x < CX ? -400 : 1500, x, k), 800, 520, 720, r); });
      const k = ease.back(seg(t, ch(L, 1) - 0.1, ch(L, 1) + 0.35)); if (k > 0) paper(CX, 850, 760, 900 * clamp(k, 0, 1.05), -0.02, () => { if (t <= ch(L, 2) - 0.1) { for (let i = 0; i < 9; i++) fillRR(-330, -290 + i * 70, i % 3 === 2 ? 400 : 660, 22, 11, '#bbb'); } else { ctx.save(); ctx.translate(0, 60); poly([[-190, -180], [190, -180], [135, 220], [-135, 220]], '#222'); ellipse(0, -180, 200, 46, '#222'); ellipse(0, -180, 168, 30, '#ececec'); ctx.restore(); } });
      dStamp('EMPTY', CX, 1290, t, ch(L, 2) + 0.1, 92, -0.05, true);
    } },
    { type: 'art', sfx: [[2, 'dimpact', 0.3]], draw(t, a, c, L) {
      dHead('THEIR OWN LETTERS');
      const k = ease.inOut(seg(t, ch(L, 2) - 1.15, ch(L, 2) + 0.05));
      const X = [250, 540, 830]; // K F C  →  F C K
      tile(lerp(X[0], X[2], k), 800 - Math.sin(k * Math.PI) * 330, 'K');
      tile(lerp(X[1], X[0], k), 800 + Math.sin(k * Math.PI) * 120, 'F'); tile(lerp(X[2], X[1], k), 800 + Math.sin(k * Math.PI) * 170, 'C');
      dStamp('OH. MY. GOD.', CX, 1180, t, ch(L, 2) + 0.35, 82, -0.05);
    } },
    { type: 'art', sfx: [[1, 'dtype', 0.18]], draw(t, a, c, L) {
      dHead('THE APOLOGY');
      paper(CX, 820, 900, 960, -0.015, () => {
        withFade(dIn(t, a + 0.1), () => text('WE’RE SORRY.', 0, -245, 96, 900, '#000', 'center', 0.01));
        [['“A chicken restaurant', ch(L, 1), -80], ['without any chicken.', ch(L, 2), 10], ['It’s not ideal.”', ch(L, 3), 170]].forEach(([s, at, y], i) => withFade(dIn(t, at, 0.25), () => text(s, 0, y, i === 2 ? 92 : 68, i === 2 ? 900 : 700, '#000', 'center', 0)));
        for (let i = 0; i < 4; i++) fillRR(-370, 270 + i * 44, i === 3 ? 480 : 740, 14, 7, '#bbb');
      });
    } },
    { type: 'art', sfx: [[2, 'dcash', 0.2]], draw(t, a, c, L) {
      dHead('THE RESULT');
      const k = pop(t, a + 0.05, 0.45); xf(CX, 800, clamp(k), 0, () => { ellipse(CX, 560, 220, 40, D_W); poly([[CX - 220, 560], [CX + 220, 560], [CX + 130, 830], [CX - 130, 830]], D_L); ring(CX - 235, 650, 80, D_L, 26); ring(CX + 235, 650, 80, D_L, 26); fillRR(CX - 36, 820, 72, 160, 10, D_G); fillRR(CX - 170, 970, 340, 90, 14, D_L); star(CX, 680, 70, '#000'); });
      for (let i = 0; i < 16; i++) { const an = i / 16 * Math.PI * 2 + t * 0.5, r = 390 + Math.sin(t * 4 + i) * 24; circle(CX + Math.cos(an) * r, 760 + Math.sin(an) * r * 0.8, 9, D_W); }
      dStamp('GOLD', CX, 1215, t, ch(L, 2) + 0.05, 130, -0.06);
    } },
    { type: 'art', sfx: [[1, 'dmsg', 0.22]], draw(t, a, c, L) {
      dHead('YOUR REGULARS'); line(0, 1300, W, 1300, D_D, 8);
      const away = ease.inOut(seg(t, a + 0.3, ch(L, 1))), back = ease.inOut(seg(t, ch(L, 2), ch(L, 2) + 0.9));
      [[330, 0], [540, 1], [750, 2]].forEach(([x, i]) => { const d = (i === 1 ? 0.35 : 1) * away * (1 - back); dMan(x + (i - 0.8) * 330 * d, 1300, 390 - 40 * d, i === 1 || d < 0.3 ? D_W : D_G, { run: (away < 1 || back > 0) && back < 1 ? t * 8 + i : 0 }); });
      const p = pop(t, ch(L, 1), 0.35); if (p > 0) xf(CX, 560, clamp(p), 0, () => { fillRR(190, 450, 700, 220, 48, '#fff'); poly([[300, 660], [380, 660], [290, 730]], '#fff'); text('Been a minute.', CX, 522, 58, 700, '#000', 'center', 0); text('We miss you.', CX, 600, 58, 700, '#000', 'center', 0); });
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['It’s been a minute.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'kfc', who: 'Marcus', scenes: S };
})();
