// MsgHealth · bigmac (Wisconsin, 1972 to 2025: one regular, 35,000 Big Macs) · black/white story reel for src/hist.js (drawings use src/doc.js). Plain drawings only, no logos.
(() => {
  // a double-decker burger centred on (x, y), about 400 wide at s = 1
  const burger = (x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const bun = '#cfcfcf', meat = '#585858';
    const lettuce = (py) => { const p = []; for (let i = 0; i <= 14; i++) p.push([-204 + i * 29.1, py + (i % 2 ? 22 : 0)]); p.push([204, py - 14], [-204, py - 14]); poly(p, D_W); };
    ctx.beginPath(); ctx.ellipse(0, -66, 196, 116, 0, Math.PI, Math.PI * 2); ctx.closePath(); ctx.fillStyle = bun; ctx.fill();
    [[-110, -118], [-52, -150], [20, -130], [86, -152], [128, -108], [-8, -167], [-142, -92], [56, -100], [-70, -98]].forEach(([a, b]) => ellipse(a, b, 12, 6, D_W, a * 0.01));
    lettuce(-52); fillRR(-190, -34, 380, 40, 20, meat);
    fillRR(-188, 8, 376, 42, 18, bun);
    lettuce(66); fillRR(-190, 84, 380, 40, 20, meat); poly([[-150, 118], [-60, 118], [-108, 160]], '#eee'); poly([[60, 118], [150, 118], [112, 150]], '#eee');
    fillRR(-196, 128, 392, 64, 30, bun);
    ctx.restore(); };
  const box = (x, y, w, h) => { fillRR(x, y, w, h, 14, '#e4e4e4'); strokeRR(x, y, w, h, 14, '#000', 5); line(x + 12, y + h * 0.36, x + w - 12, y + h * 0.36, '#999', 5); text('1 BURGER', x + w / 2, y + h * 0.68, 30, 900, '#000', 'center', 0.06); };
  const receipt = (x, y, h, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-75, 0, 150, h, 6, D_W); for (let i = 0; i * 34 < h - 60; i++) fillRR(-52, 30 + i * 34, i % 3 === 2 ? 60 : 104, 10, 5, '#888'); ctx.restore(); };
  const car = (x, y) => { ctx.save(); ctx.translate(x, y); poly([[-190, -130], [-110, -240], [110, -240], [200, -130]], D_L); poly([[-150, -135], [-95, -215], [-10, -215], [-10, -135]], '#000'); poly([[15, -215], [95, -215], [160, -135], [15, -135]], '#000'); fillRR(-290, -145, 580, 120, 40, D_L); [-170, 170].forEach((d) => { circle(d, -20, 66, '#000'); ring(d, -20, 56, D_W, 12); circle(d, -20, 14, D_W); }); circle(262, -100, 16, '#000'); ctx.restore(); };
  const chair = (x, y) => { fillRR(x - 130, y - 400, 260, 60, 20, D_L); fillRR(x - 130, y - 600, 70, 230, 22, D_L); fillRR(x - 12, y - 345, 40, 250, 8, D_G); fillRR(x - 102, y - 105, 220, 36, 14, D_G); line(x + 60, y - 340, x + 150, y - 190, D_G, 26); };
  const S = [
    { type: 'art', sfx: [[1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('ONE MAN · ONE ORDER');
      dBig('35,000', 520, t, -0.4, 270);
      burger(CX, 975 + Math.sin(t * 2.6) * 10, 1.12);
      dStamp('BIG MACS', CX, 1305, t, ch(L, 1) - 0.05, 96, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dthud', 0.22], [2, 'whoosh', 0.22]], draw(t, a, c, L) {
      dHead('WISCONSIN · 1972');
      const k = pop(t, a + 0.08, 0.35); if (k > 0) xf(CX, 640, clamp(k), 0, () => { fillRR(270, 420, 540, 470, 30, '#fff'); fillRR(270, 420, 540, 130, 30, D_G); text('MAY 1972', CX, 488, 66, 900, '#000', 'center', 0.1); text('17', CX, 730, 280, 900, '#000', 'center', -0.02); });
      line(0, 1250, W, 1250, D_D, 8);
      const d = ease.out(seg(t, ch(L, 2) - 0.5, ch(L, 2) + 0.35)); car(lerp(-420, 540, d), 1245);
      dStamp('FIRST CAR', 540, 1350, t, ch(L, 2) + 0.3, 62, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'dcount', 0.18], [2, 'dimpact', 0.28]], draw(t, a, c, L) {
      dHead('THE EARLY DAYS');
      const end = ch(L, 2) + 0.25;
      for (let i = 0; i < 9; i++) { const x = 220 + (i % 3) * 320, y = 520 + Math.floor(i / 3) * 255, at = a + 0.15 + i * ((end - a - 0.3) / 9), e = pop(t, at, 0.25); if (e > 0) xf(x, y, clamp(e), 0, () => burger(x, y, 0.58)); }
      dStamp('9 A DAY', CX, 1285, t, end, 106, -0.05, true);
    } },
    { type: 'art', sfx: [[2, 'pop', 0.22]], draw(t, a, c, L) {
      dHead('THESE DAYS');
      [[300, 'LUNCH', a + 0.12], [780, 'DINNER', ch(L, 2) + 0.1]].forEach(([x, s, at], i) => { const e = pop(t, i ? a + 0.35 : at, 0.35); if (e > 0) xf(x, 720, clamp(e), 0, () => burger(x, 720, 0.98)); dStamp(s, x, 1010, t, ch(L, 2) + i * 0.4, 66, i ? 0.05 : -0.05); });
      dBig('2', 1230, t, ch(L, 1) + 0.05, 250); withFade(dIn(t, ch(L, 1) + 0.2), () => text('A DAY', 760, 1240, 58, 900, D_G, 'center', 0.12));
    } },
    { type: 'art', sfx: [[1, 'pop', 0.2], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('HE KEEPS THIS STUFF'); line(0, 1240, W, 1240, D_D, 8);
      for (let i = 0; i < 12; i++) { const col = i % 3, row = Math.floor(i / 3), x = 110 + col * 190 + (row % 2) * 14, y = 1118 - row * 124, k = i < 6 ? 1 : ease.out(seg(t, a + 0.1 + (i - 6) * 0.14, a + 0.55 + (i - 6) * 0.14)); if (k > 0) withFade(k, () => box(x, lerp(y - 160, y, k), 172, 116)); }
      const r = ease.out(seg(t, ch(L, 1) - 0.1, ch(L, 1) + 0.9)); if (r > 0) { receipt(790, 420, 780 * r, -0.04); receipt(930, 480, 640 * r, 0.07); }
      dStamp('RECEIPTS', 820, 880, t, ch(L, 1) + 0.25, 66, 0.06, true);
      dStamp('OF COURSE', CX, 450, t, ch(L, 2), 88, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dwhoosh', 0.2], [3, 'dknock', 0.18]], draw(t, a, c, L) {
      dHead('EMERGENCY PLAN');
      fillRR(250, 400, 580, 880, 44, D_L); fillRR(290, 440, 500, 800, 20, '#141414');
      [700, 960].forEach((y) => line(290, y + 20, 790, y + 20, D_G, 10));
      [[420, 640], [660, 640], [420, 900], [660, 900], [420, 1160], [660, 1160]].forEach(([x, y], i) => { const e = pop(t, a + 0.2 + i * 0.16, 0.25); if (e > 0) xf(x, y, clamp(e), 0, () => burger(x, y - 20, 0.5)); });
      fillRR(830, 400, 70, 880, 24, D_G); fillRR(850, 740, 16, 200, 8, '#000');
      const sn = dIn(t, ch(L, 2) - 0.1, 0.4); if (sn > 0) dDust(t, 0, 370, W, 990, 90, sn, 150);
      dStamp('BLIZZARD STASH', CX, 1320, t, ch(L, 2) + 0.2, 72, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'dding', 0.2], [3, 'dimpact', 0.26]], draw(t, a, c, L) {
      dHead('THE PROPOSAL'); line(0, 1200, W, 1200, D_D, 8);
      fillRR(150, 420, 780, 200, 30, '#fff'); text('McDONALD’S', CX, 524, 96, 900, '#000', 'center', 0.02);
      dMan(760, 1200, 460, D_L, { arms: t > ch(L, 3) ? 'up' : undefined, run: t * 3 });
      // him, down on one knee
      circle(330, 855, 56, D_W); fillRR(270, 915, 124, 160, 48, D_W); line(300, 1060, 232, 1130, D_W, 44); line(232, 1130, 232, 1196, D_W, 44); line(370, 1060, 470, 1095, D_W, 44); line(470, 1095, 470, 1196, D_W, 44); line(380, 950, 520, 910, D_W, 36);
      const k = pop(t, ch(L, 1), 0.35); if (k > 0) xf(560, 880, clamp(k), 0, () => { ring(560, 895, 34, D_W, 12); poly([[560, 830], [584, 857], [560, 878], [536, 857]], D_W); });
      dStamp('SHE SAID YES', CX, 1310, t, ch(L, 3) + 0.05, 78, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dding', 0.24]], draw(t, a, c, L) {
      dHead('MARCH 2025');
      ctx.save(); ctx.translate(CX, 780); ctx.rotate(-0.02); fillRR(-400, -390, 800, 780, 18, '#ededed'); strokeRR(-366, -356, 732, 712, 10, '#000', 8); text('OFFICIAL COUNT', 0, -270, 58, 900, '#000', 'center', 0.1);
      const k = ease.out(seg(t, a + 0.2, ch(L, 2) + 0.35)), v = k >= 1 ? 35000 : Math.round(35000 * k / 500) * 500; dNum(v.toLocaleString(), -40, 180, '#000', 0); text('BIG MACS', 0, 130, 76, 900, '#444', 'center', 0.14);
      circle(0, 270, 62, '#000'); star(0, 270, 38, '#fff'); ctx.restore();
      dStamp('GUINNESS', CX, 1290, t, ch(L, 1) + 0.1, 80, -0.04);
    } },
    { type: 'art', sfx: [[0, 'dthud', 0.26], [3, 'dding', 0.16]], draw(t, a, c, L) {
      dHead('YOUR CHAIR'); line(0, 1220, W, 1220, D_D, 8);
      chair(360, 1218);
      const gone = ease.inOut(seg(t, ch(L, 2) - 0.2, ch(L, 3) + 0.4)); withFade(1 - gone, () => dMan(lerp(600, 960, gone), 1218, 440, D_L, { run: gone > 0 && gone < 1 ? t * 8 : 0 }));
      [0, 1, 2, 3, 4, 5].forEach((i) => { const x = 130 + i * 142, e = pop(t, a + 0.15 + i * 0.07, 0.25), on = t > ch(L, 2) + i * 0.2; if (e > 0) xf(x + 55, 480, clamp(e), 0, () => { fillRR(x, 400, 118, 160, 20, on ? '#fff' : 'rgba(255,255,255,0.1)'); text('WK', x + 59, 440, 28, 800, on ? '#000' : '#999', 'center', 0.1); text(String(i + 3), x + 59, 510, 66, 900, on ? '#000' : '#999', 'center', 0); }); });
      dStamp('NOTICE?', CX, 1315, t, ch(L, 3) + 0.05, 92, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'bigmac', who: 'Marcus', scenes: S };
})();
