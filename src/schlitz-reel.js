// MsgHealth · schlitz (Milwaukee, 1976: America's number two beer, flakes, a 10 million can recall) · black/white story reel for src/hist.js (drawings use src/doc.js). Plain drawings only, no logos.
(() => {
  // a beer can centred on (x, y), about 150 x 260 at s = 1
  const can = (x, y, s = 1, rot = 0, label = '') => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    fillRR(-75, -120, 150, 240, 22, D_L); fillRR(-62, -134, 124, 22, 10, D_G); fillRR(-62, 112, 124, 22, 10, D_G);
    fillRR(-75, -48, 150, 96, 0, '#222'); line(-48, -104, -48, -64, '#fff', 8); line(-48, 64, -48, 100, '#fff', 8);
    if (label) text(label, 0, 2, Math.min(34, fit(label, 34, 138, 900)), 900, '#fff', 'center', 0.02); else { circle(0, 0, 24, D_L); }
    ctx.restore(); };
  // a beer glass, base centred on (x, y)
  const glass = (x, y, w, h, t, flakes = 0) => { const top = y - h;
    poly([[x - w * 0.4, y], [x + w * 0.4, y], [x + w / 2, top], [x - w / 2, top]], '#2b2b2b');
    poly([[x - w * 0.385, y - 14], [x + w * 0.385, y - 14], [x + w * 0.465, top + h * 0.2], [x - w * 0.465, top + h * 0.2]], '#7d7d7d');
    for (let i = 0; i < 26; i++) circle(x - w * 0.5 + 40 + hash(i) * (w - 80), top + h * 0.2 - 8 - hash(i + 5) * 54, 20 + hash(i + 9) * 24, D_W);
    for (let i = 0; i < flakes; i++) { const fx = x - w * 0.34 + hash(i + 21) * w * 0.68 + Math.sin(t * 1.4 + i) * 16, fy = top + h * 0.27 + ((hash(i + 40) * h * 0.66 + t * (14 + hash(i) * 26)) % (h * 0.66)); ctx.save(); ctx.translate(fx, fy); ctx.rotate(hash(i + 3) * 6 + t * (hash(i + 4) - 0.5)); const r = 9 + hash(i + 7) * 17; poly([[-r, -r * 0.3], [-r * 0.3, -r * 0.8], [r * 0.9, -r * 0.4], [r * 0.5, r * 0.6], [-r * 0.5, r * 0.7]], D_W); ctx.restore(); }
    line(x - w * 0.4, y, x - w / 2, top, D_W, 9); line(x + w * 0.4, y, x + w / 2, top, D_W, 9); line(x - w * 0.4, y, x + w * 0.4, y, D_W, 14); };
  const tv = (fn) => { line(450, 420, 395, 374, D_G, 10); line(630, 420, 685, 374, D_G, 10); fillRR(80, 420, 920, 760, 60, '#333'); strokeRR(80, 420, 920, 760, 60, D_L, 8);
    fillRR(130, 470, 820, 620, 40, '#0c0c0c'); ctx.save(); rr(130, 470, 820, 620, 40); ctx.clip(); fn(); ctx.restore();
    [250, 330].forEach((x) => circle(x, 1137, 24, D_G)); for (let i = 0; i < 8; i++) fillRR(600 + i * 38, 1115, 16, 46, 6, D_D); line(200, 1180, 160, 1260, D_G, 16); line(880, 1180, 920, 1260, D_G, 16); };
  const boxer = (x, y, h) => { dMan(x, y, h, D_W); const u = h / 100; circle(x - 29 * u, y - 52 * u, 10 * u, D_G); circle(x + 29 * u, y - 52 * u, 10 * u, D_G); fillRR(x - 15 * u, y - 46 * u, 30 * u, 14 * u, 3 * u, D_D); };
  const jack = (x, y, h) => { dMan(x, y, h, D_L); const u = h / 100; line(x + 28 * u, y - 38 * u, x + 36 * u, y - 88 * u, D_G, 4 * u); poly([[x + 34 * u, y - 92 * u], [x + 50 * u, y - 100 * u], [x + 52 * u, y - 76 * u], [x + 37 * u, y - 80 * u]], D_W); poly([[x - 14 * u, y - 96 * u], [x + 14 * u, y - 96 * u], [x + 10 * u, y - 108 * u], [x - 10 * u, y - 108 * u]], D_G); };
  const cougar = (x, y, s, t) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(0, -62, 100, 48, D_G); [-66, -30, 34, 70].forEach((d) => fillRR(d - 12, -46, 24, 48, 10, D_G)); circle(-104, -108, 44, D_G); poly([[-142, -128], [-134, -170], [-110, -142]], D_G); poly([[-98, -146], [-78, -174], [-66, -126]], D_G); circle(-120, -114, 7, '#fff'); circle(-90, -114, 7, '#fff'); line(-122, -86, -90, -86, '#000', 6); ctx.beginPath(); ctx.moveTo(94, -70); ctx.quadraticCurveTo(170, -70, 150 + Math.sin(t * 4) * 18, -150); ctx.strokeStyle = D_G; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); };
  const chair = (x, y) => { fillRR(x - 130, y - 400, 260, 60, 20, D_L); fillRR(x - 130, y - 600, 70, 230, 22, D_L); fillRR(x - 12, y - 345, 40, 250, 8, D_G); fillRR(x - 102, y - 105, 220, 36, 14, D_G); line(x + 60, y - 340, x + 150, y - 190, D_G, 26); };
  const S = [
    { type: 'art', sfx: [[1, 'dimpact', 0.28], [2, 'punch', 0.24]], draw(t, a, c, L) {
      dHead('AMERICA · 1976');
      dBig('10 MILLION', 500, t, -0.4, 200);
      for (let row = 0; row < 5; row++) for (let i = 0; i < 6 - row; i++) { const x = CX - (5 - row) * 80 + i * 160, y = 1190 - row * 128; can(x, y + Math.sin(t * 3 + i + row) * 3, 0.5 + 0.012 * row, (hash(i + row * 7) - 0.5) * 0.12); }
      dStamp('RECALLED', CX, 760, t, ch(L, 1) - 0.1, 130, -0.08, true);
      dStamp('CANS + BOTTLES', CX, 1315, t, ch(L, 2) + 0.05, 62, -0.03);
    } },
    { type: 'art', sfx: [[1, 'dthud', 0.22]], draw(t, a, c, L) {
      dHead('THE BIG TIME'); line(0, 1220, W, 1220, D_D, 8);
      [[200, 360, '3'], [540, 470, '2'], [880, 590, '1']].forEach(([x, h, n], i) => { const hh = n === '1' ? 560 : n === '2' ? 440 : 300; const k = ease.out(seg(t, a - 0.2 + i * 0.1, a + 0.35 + i * 0.1)); fillRR(x - 150, 1220 - hh * k, 300, hh * k, 12, n === '2' ? D_W : D_D); if (k > 0.8) text(n, x, 1220 - hh * 0.45, 150, 900, n === '2' ? '#000' : D_G, 'center', 0); });
      const k = pop(t, ch(L, 0), 0.4); if (k > 0) xf(540, 620, clamp(k), 0, () => can(540, 620 + Math.sin(t * 2.4) * 8, 1.15, 0, 'SCHLITZ'));
      dStamp('NO. 2 IN AMERICA', CX, 1315, t, ch(L, 1), 70, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.26], [3, 'dcount', 0.16], [4, 'whoosh', 0.2]], draw(t, a, c, L) {
      dHead('THE COST CUT'); line(80, 1100, 1000, 1100, D_D, 8);
      const down = ease.inOut(seg(t, ch(L, 2) - 0.1, ch(L, 2) + 0.6)), up = ease.inOut(seg(t, ch(L, 3) - 0.1, ch(L, 3) + 0.7));
      [[240, lerp(520, 200, down), 'MALT', D_W], [600, lerp(140, 520, up), 'CORN SYRUP', D_G]].forEach(([x, h, s, col]) => { fillRR(x - 110, 1100 - h, 220, h, 14, col); text(s, x, 1160, 46, 900, D_W, 'center', 0.04); });
      if (down > 0.4) { line(240, 560, 240, 740, D_W, 18); poly([[200, 730], [280, 730], [240, 795]], D_W); }
      if (up > 0.4) { line(600, 520, 600, 400, D_G, 18); poly([[560, 415], [640, 415], [600, 350]], D_G); }
      const k = pop(t, ch(L, 4) - 0.15, 0.35); if (k > 0) xf(890, 740, clamp(k), 0, () => { circle(890, 740, 120, D_W); ring(890, 740, 100, '#000', 8); const r = (t - ch(L, 4)) * 9; line(890, 740, 890 + Math.sin(r) * 80, 740 - Math.cos(r) * 80, '#000', 12); line(890, 740, 890 + Math.sin(r / 6) * 52, 740 - Math.cos(r / 6) * 52, '#000', 16); });
      dStamp('RUSHED', 890, 930, t, ch(L, 4) + 0.2, 52, 0.05, true);
      dStamp('CHEAP AS HELL', CX, 1300, t, ch(L, 1), 86, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dglitch', 0.18]], draw(t, a, c, L) {
      dHead('1976');
      can(CX, 920, 2.6);
      const r = ease.inOut(seg(t, ch(L, 2) - 0.1, ch(L, 3) + 0.4));
      if (r > 0) withFade(clamp(r * 5), () => { fillRR(CX - 150, 800, 300, 240, 20, '#000'); strokeRR(CX - 150, 800, 300, 240, 20, D_W, 6); });
      for (let i = 0; i < Math.round(18 * r); i++) circle(CX - 120 + hash(i) * 240 + Math.sin(t * 5 + i) * 8, 830 + hash(i + 30) * 180, 8 + hash(i + 2) * 18 * r, D_W);
      // dropper
      ctx.save(); ctx.translate(CX + 190, 430); ctx.rotate(0.65); fillRR(-34, -170, 68, 100, 30, D_G); fillRR(-22, -80, 44, 150, 12, D_L); poly([[-22, 66], [22, 66], [0, 120]], D_L); ctx.restore();
      if (t > ch(L, 1)) for (let i = 0; i < 3; i++) { const p = ((t - ch(L, 1)) * 1.5 + i / 3) % 1; circle(lerp(CX + 118, CX + 30, p), lerp(525, 640, p), 17 * (1 - p * 0.3), D_W); }
      dStamp('NEW ADDITIVE', CX, 1300, t, ch(L, 1), 76, -0.04);
    } },
    { type: 'art', sfx: [[0, 'dthud', 0.18], [2, 'punch', 0.24]], draw(t, a, c, L) {
      dHead('IN THE BEER');
      glass(CX, 1230, 600, 800, t, 46);
      dStamp('FLAKES', CX, 760, t, a - 0.05, 150, -0.07, true);
      dStamp('IN YOUR BEER', CX, 1320, t, ch(L, 2), 68, 0.03);
    } },
    { type: 'art', sfx: [[1, 'dimpact', 0.24], [3, 'dwhoosh', 0.2]], draw(t, a, c, L) {
      dHead('THE BILL');
      const k = ease.out(seg(t, a + 0.1, ch(L, 1) + 0.45)), v = k >= 1 ? 1400000 : Math.round(1400000 * k / 50000) * 50000;
      dNum('$' + v.toLocaleString(), 540, 150);
      withFade(dIn(t, ch(L, 1)), () => text('RECALL COST', CX, 690, 52, 900, D_G, 'center', 0.16));
      line(0, 1220, W, 1220, D_D, 8);
      const go = seg(t, ch(L, 2) - 0.15, VO_AT[L + 1] + 0.3);
      for (let i = 0; i < 4; i++) { const x = 140 + i * 220 + ease.in(clamp(go * 1.25 - i * 0.06)) * 560, run = go > 0 ? t * 8 + i : 0; dMan(x, 1220, 330, i % 2 ? D_L : D_W, { run }); can(x + 90, 1060, 0.34, 0.15, ''); }
      dStamp('SWITCHING', CX, 800, t, ch(L, 3), 96, -0.05);
    } },
    { type: 'art', sfx: [[0, 'dshutter', 0.16], [3, 'punch', 0.24], [5, 'dknock', 0.2]], draw(t, a, c, L) {
      dHead('THE TV ADS · 1977');
      tv(() => {
        line(130, 1030, 950, 1030, D_D, 8);
        const b = pop(t, ch(L, 3) - 0.1, 0.35), j = pop(t, ch(L, 4) - 0.1, 0.35), g = pop(t, ch(L, 5) - 0.1, 0.35);
        if (b <= 0) { const w = ease.out(seg(t, ch(L, 1) - 0.1, ch(L, 2) + 0.2)); if (w <= 0) { text('A NEW', CX, 710, 100, 900, D_W, 'center', 0.1); text('AD CAMPAIGN', CX, 830, 84, 900, D_G, 'center', 0.06); } else { text('COME BACK?', CX, 600, 88, 900, D_W, 'center', 0.06); for (let i = 0; i < 4; i++) { const x = 250 + i * 190 + (t - ch(L, 1)) * 70; dMan(x, 1030, 270, i % 2 ? D_G : D_L, { run: t * 7 + i }); } } }
        if (b > 0) xf(290, 1030, clamp(b), 0, () => boxer(290 + (j > 0 ? 0 : 250), 1030, 400));
        if (j > 0) xf(640, 1030, clamp(j), 0, () => jack(620, 1030, 420));
        if (g > 0) xf(840, 1030, clamp(g), 0, () => cougar(820, 1030, 0.95, t));
      });
      dStamp('A PET COUGAR', CX, 1330, t, ch(L, 5), 66, -0.04, true);
    } },
    { type: 'art', sfx: [[0, 'dhit', 0.22], [2, 'dthud', 0.2]], draw(t, a, c, L) {
      dHead('THE PITCH');
      tv(() => {
        line(130, 1030, 950, 1030, D_D, 8);
        const lean = ease.out(seg(t, a, a + 0.9)) * 40;
        boxer(250 + lean, 1030, 370); jack(450 + lean, 1030, 390);
        const sh = shake(t, ch(L, 2), 18, 0.5); dMan(820 + sh, 1030, 260, D_G, { arms: 'up' });
        const e = pop(t, ch(L, 1), 0.3); if (e > 0) xf(790, 630, clamp(e), 0, () => { fillRR(650, 560, 280, 130, 40, '#fff'); poly([[770, 685], [830, 685], [820, 735]], '#fff'); text('switch?', 790, 628, 62, 800, '#000', 'center', 0); });
        [0, 1, 2].forEach((i) => { const q = pop(t, a + 0.25 + i * 0.25, 0.25); if (q > 0) xf(240 + i * 130, 528, clamp(q), 0, () => text('!', 240 + i * 130 + Math.sin(t * 16 + i) * 6, 528, 96, 900, D_W, 'center', 0)); });
      });
      dStamp('THREATS', CX, 1330, t, ch(L, 0) + 0.1, 88, -0.05, true);
    } },
    { type: 'art', sfx: [[3, 'dhit', 0.14, 0.3]], draw(t, a, c, L) {
      dHead('THE NICKNAME');
      fillRR(90, 430, 900, 790, 20, '#ededed'); strokeRR(120, 460, 840, 730, 12, '#000', 10);
      const k = pop(t, ch(L, 1) - 0.08, 0.3), j = pop(t, ch(L, 2) - 0.08, 0.3);
      if (k <= 0) { text('THE ADS', CX, 740, 120, 900, '#000', 'center', 0.06); text('GOT A NAME', CX, 890, 100, 900, '#777', 'center', 0.04); }
      if (k > 0) xf(CX, 610, clamp(k), 0, () => { text('DRINK', CX, 560, 130, 900, '#000', 'center', 0.04); text('SCHLITZ', CX, 700, 150, 900, '#000', 'center', 0.02); });
      if (j > 0) xf(CX, 980, clamp(j), 0, () => { fillRR(150, 810, 780, 340, 10, '#000'); text('OR I WILL', CX, 905, 104, 900, '#fff', 'center', 0.02); text('KILL YOU', CX, 1045, 128, 900, '#fff', 'center', 0.02); });
      dStamp('REAL NICKNAME', CX, 1315, t, ch(L, 2) + 0.45, 58, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'dglitch', 0.18], [2, 'dthud', 0.2], [4, 'dimpact', 0.26]], draw(t, a, c, L) {
      if (t < ch(L, 2) - 0.1) {
        dHead('OFF THE AIR');
        tv(() => { const off = ease.out(seg(t, a, a + 0.5)); for (let i = 0; i < 150; i++) fillRR(130 + hash(i + Math.floor(t * 14)) * 800, 470 + hash(i * 3 + Math.floor(t * 14)) * 610, 30, 7, 2, `rgba(255,255,255,${0.35 * off})`); dStamp('10 WEEKS', CX, 770, t, ch(L, 1) - 0.1, 120, -0.05); });
      } else {
        dHead('1982'); line(0, 1200, W, 1200, D_D, 8);
        fillRR(160, 720, 760, 480, 10, D_G); [[200, 300], [360, 420], [760, 360]].forEach(([x, h]) => fillRR(x, 720 - h, 90, h, 8, D_D));
        for (let i = 0; i < 12; i++) fillRR(215 + (i % 6) * 118, 790 + Math.floor(i / 6) * 150, 66, 90, 6, '#111');
        text('SCHLITZ BREWING', CX, 1135, 66, 900, '#000', 'center', 0.04);
        dDust(t, 150, 300, 700, 420, 24, 0.7, -30);
        dStamp('SOLD', CX, 880, t, ch(L, 4) - 0.15, 210, -0.12);
        dStamp('THE WHOLE COMPANY', CX, 1315, t, ch(L, 4) + 0.2, 60, -0.03, true);
      }
    } },
    { type: 'art', sfx: [[1, 'dthud', 0.2], [3, 'dknock', 0.18]], draw(t, a, c, L) {
      dHead('YOUR CHAIR'); line(0, 1220, W, 1220, D_D, 8);
      chair(360, 1218);
      const gone = ease.inOut(seg(t, ch(L, 2) - 0.2, ch(L, 3) + 0.6)); withFade(1 - gone, () => dMan(lerp(600, 970, gone), 1218, 440, D_L, { run: gone > 0 && gone < 1 ? t * 8 : 0 }));
      const k = pop(t, ch(L, 1) - 0.1, 0.35); if (k > 0) xf(CX, 480, clamp(k), 0, () => { fillRR(250, 375, 580, 210, 18, '#ededed'); text('RECALL NOTICE', CX, 430, 54, 900, '#000', 'center', 0.06); [490, 525, 560].forEach((y) => fillRR(320, y, 440, 10, 5, '#bbb')); const x = dIn(t, ch(L, 1) + 0.35, 0.25); if (x > 0) { line(290, 395, lerp(290, 790, x), lerp(395, 565, x), '#000', 20); line(790, 395, lerp(790, 290, x), lerp(395, 565, x), '#000', 20); } });
      dStamp('JUST GONE', CX, 1315, t, ch(L, 3) + 0.05, 88, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'schlitz', who: 'Marcus', scenes: S };
})();
