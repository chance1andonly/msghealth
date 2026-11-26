// MsgHealth · bullshit (Black Friday) · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  const box = (x, y, w, h, label, size = 0) => {
    poly([[x - w / 2, y - h / 2], [x - w / 2 + w * 0.1, y - h / 2 - h * 0.16], [x + w / 2 + w * 0.1, y - h / 2 - h * 0.16], [x + w / 2, y - h / 2]], '#6a6a6a');
    poly([[x + w / 2, y - h / 2], [x + w / 2 + w * 0.1, y - h / 2 - h * 0.16], [x + w / 2 + w * 0.1, y + h / 2 - h * 0.16], [x + w / 2, y + h / 2]], '#4a4a4a');
    fillRR(x - w / 2, y - h / 2, w, h, 6, D_L); strokeRR(x - w / 2, y - h / 2, w, h, 6, '#000', 4);
    if (label) { fillRR(x - w * 0.42, y - h * 0.2, w * 0.84, h * 0.4, 8, '#000'); text(label, x, y + 4, size || h * 0.24, 900, D_W, 'center', 0.02); }
  };
  const pile = (x, y, s, t) => { // cartoon pile, base centred at (x, y)
    ellipse(x, y - 30 * s, 170 * s, 48 * s, D_G); ellipse(x - 4 * s, y - 84 * s, 126 * s, 42 * s, '#b4b4b4'); ellipse(x + 6 * s, y - 130 * s, 82 * s, 36 * s, D_G); poly([[x - 32 * s, y - 148 * s], [x + 38 * s, y - 198 * s], [x + 34 * s, y - 142 * s]], D_G);
    [-90, 0, 90].forEach((d, i) => { ctx.beginPath(); for (let k = 0; k <= 11; k++) { const px = x + d * s + Math.sin(k * 0.6 + t * 5 + i) * 14, py = y - 200 * s - k * 6; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = 6; ctx.stroke(); });
  };
  const fly = (x, y, t, i) => { const fx = x + Math.cos(t * 4.2 + i * 2.1) * (260 + i * 22) , fy = y + Math.sin(t * 6.1 + i * 1.7) * (70 + i * 10); ellipse(fx - 12, fy - 9, 13, 7, 'rgba(255,255,255,0.75)', -0.5); ellipse(fx + 12, fy - 9, 13, 7, 'rgba(255,255,255,0.75)', 0.5); circle(fx, fy, 9, D_W); };
  const bill = (x, y, w, label, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-w / 2, -w * 0.27, w, w * 0.54, 10, D_L); strokeRR(-w / 2 + 12, -w * 0.27 + 12, w - 24, w * 0.54 - 24, 6, '#000', 4); circle(0, 0, w * 0.17, D_W); text(label, 0, 3, w * 0.17, 900, '#000', 'center'); ctx.restore(); };
  const bag = (x, y, s) => { ctx.beginPath(); ctx.arc(x, y - 62 * s, 26 * s, Math.PI, 0); ctx.strokeStyle = D_W; ctx.lineWidth = 8 * s; ctx.stroke(); fillRR(x - 55 * s, y - 62 * s, 110 * s, 124 * s, 10 * s, D_L); text('$', x, y + 6, 64 * s, 900, '#000', 'center'); };
  const digger = (x, y, t) => { // excavator, tracks sit on y, arm reaches left
    fillRR(x - 150, y - 70, 330, 70, 35, '#2f2f2f'); strokeRR(x - 150, y - 70, 330, 70, 35, D_W, 6); [-100, -20, 60, 130].forEach((d) => circle(x + d, y - 35, 20, D_G));
    fillRR(x - 70, y - 200, 220, 130, 18, D_L); fillRR(x - 50, y - 182, 90, 70, 8, '#222');
    const a = Math.sin(t * 3.4) * 0.5 + 0.5, ex = x - 210, ey = y - 280 + a * 60, bx = x - 315 + a * 30, by = y - 110 + a * 120;
    line(x - 60, y - 170, ex, ey, D_W, 34); line(ex, ey, bx, by, D_L, 26); circle(ex, ey, 18, D_G); poly([[bx - 55, by - 6], [bx + 35, by - 10], [bx + 15, by + 55], [bx - 35, by + 45]], D_W);
  };
  const S = [
    { type: 'art', sfx: [[1, 'punch', 0.26]], draw(t) {
      dHead('A REAL SALE'); dBig('30,000', 475, t, -0.3, 240); text('BOXES SOLD', CX, 668, 50, 800, D_G, 'center', 0.14);
      pile(CX, 990, 1.15, t); box(CX - 24, 1175, 560, 310, 'BULLSHIT', 92); for (let i = 0; i < 4; i++) fly(CX, 900, t, i);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.22], [4, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('NOVEMBER 28, 2014');
      const sw = Math.sin(t * 2.6) * 0.07; ctx.save(); ctx.translate(CX, 420); ctx.rotate(sw); line(0, -30, 0, 60, D_G, 8); poly([[-90, 50], [90, 50], [230, 170], [230, 440], [-230, 440], [-230, 170]], D_W); circle(0, 110, 24, '#000'); text('$6', 0, 290, 220, 900, '#000', 'center'); ctx.restore();
      const gone = Math.round(10 * seg(t, ch(L, 3) - 0.05, ch(L, 4) + 0.25));
      for (let i = 0; i < 10; i++) { const q = i % 5, r = Math.floor(i / 5), x = 175 + q * 180, y = 1010 + r * 175; if (i < 10 - gone) box(x, y, 130, 105, 'BS', 34); else { ctx.save(); ctx.setLineDash([14, 12]); strokeRR(x - 65, y - 52, 130, 105, 6, '#555', 4); ctx.restore(); } }
      dStamp('SOLD OUT', CX, 1095, t, ch(L, 4) + 0.1, 112, -0.07);
    } },
    { type: 'art', sfx: [[2, 'whoosh', 0.26]], draw(t, a, c, L) {
      dHead('BLACK FRIDAY 2013');
      fillRR(200, 430, 680, 250, 20, D_W); text('SALE!', CX, 560, 170, 900, '#000', 'center'); line(300, 430, 380, 370, D_G, 6); line(780, 430, 700, 370, D_G, 6);
      const k = ease.out(seg(t, ch(L, 1) - 0.2, ch(L, 2) + 0.3)), top = lerp(1230, 790, k); fillRR(215, top + 150, 150, 1310 - top - 150, 10, D_G); poly([[130, top + 170], [290, top], [450, top + 170]], D_G);
      withFade(dIn(t, ch(L, 2) - 0.1), () => { text('+$5', 760, 940, 200, 900, D_W, 'center', -0.03); text('MORE', 760, 1100, 76, 900, D_G, 'center', 0.12); });
      dStamp('ON PURPOSE', 730, 1265, t, ch(L, 3), 66, -0.05, true);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.26], [3, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('BLACK FRIDAY 2015');
      const d = ease.inOut(seg(t, ch(L, 2) - 0.1, ch(L, 3))); withFade(1 - seg(t, ch(L, 3) - 0.2, ch(L, 3) + 0.05), () => bill(CX, lerp(520, 830, d), 400, '$5', Math.sin(t * 3) * 0.06));
      poly([[250, 930], [140, 840], [330, 840], [440, 930]], '#6a6a6a'); poly([[830, 930], [940, 840], [750, 840], [640, 930]], '#6a6a6a');
      fillRR(250, 930, 580, 350, 8, D_L); fillRR(290, 930, 500, 80, 0, '#000');
      text('NOTHING', CX, 1140, 108, 900, '#000', 'center', 0.04);
      dStamp('JACK SHIT', CX, 620, t, ch(L, 3), 124, -0.07);
    } },
    { type: 'art', sfx: [[1, 'ding', 0.24]], draw(t, a, c, L) {
      dHead('THEY PAID ANYWAY'); dBig('11,000+', 480, t, a, 230); text('PEOPLE', CX, 625, 52, 800, D_G, 'center', 0.16);
      for (let i = 0; i < 27; i++) { const q = i % 9, r = Math.floor(i / 9), k = pop(t, a + 0.2 + i * 0.035, 0.3); if (k > 0) xf(140 + q * 100, 750 + r * 110, clamp(k), 0, () => dotPerson(140 + q * 100, 750 + r * 110, 86, r % 2 ? D_G : D_L)); }
      dBig('$71,145', 1150, t, ch(L, 1), 210);
      dStamp('FOR NOTHING', CX, 1325, t, ch(L, 2), 62, -0.04);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.25], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('WHERE IT WENT');
      for (let i = 0; i < 9; i++) { const y = ((hash(i) * 600 + t * (170 + hash(i + 4) * 90)) % 440) + 800; bill(100 + i * 110, y - 80, 100, '$', Math.sin(t * 3 + i) * 0.5); }
      line(0, 1290, W, 1290, D_D, 8);
      [180, 420, 660, 900].forEach((x, i) => { dMan(x, 1290, 330, i % 2 ? D_G : D_W, { arms: 'up', run: t * 6 + i }); const k = pop(t, ch(L, 1) + i * 0.12, 0.35); if (k > 0) xf(x, 880, clamp(k), 0, () => bag(x, 880, 0.95)); });
      dStamp('THE STAFF SPLIT IT', CX, 480, t, ch(L, 0) + 0.2, 68, -0.04);
      dStamp('NOT KIDDING', CX, 640, t, ch(L, 3), 66, 0.05, true);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.22], [4, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('BLACK FRIDAY 2016'); dBig('$100,573', 480, t, ch(L, 1), 210);
      fillRR(0, 1080, W, 270, 0, '#242424'); line(0, 1080, W, 1080, D_W, 8); ellipse(250, 1130, 210, 62, '#000'); ring(250, 1130, 0, D_W, 1); ctx.beginPath(); ctx.ellipse(250, 1130, 210, 62, 0, 0, Math.PI * 2); ctx.strokeStyle = D_G; ctx.lineWidth = 8; ctx.stroke();
      digger(740, 1080, t);
      for (let i = 0; i < 14; i++) { const p = (t * 1.1 + i / 14) % 1; circle(330 + p * (hash(i) * 260 - 60), 1070 - Math.sin(p * Math.PI) * (110 + hash(i + 2) * 120), 9 + hash(i + 5) * 11, D_G); }
      dStamp('A FUCKING HOLE', CX, 660, t, ch(L, 4), 86, -0.05);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.28], [2, 'pop', 0.25]], draw(t, a, c, L) {
      dHead('THE PAYOFF');
      ellipse(CX, 1100, 440, 220, D_G); ellipse(CX, 1100, 405, 194, '#000'); for (let i = 1; i < 4; i++) { ctx.beginPath(); ctx.ellipse(CX, 1100 + i * 18, 405 - i * 90, 194 - i * 46, 0, 0, Math.PI * 2); ctx.strokeStyle = `rgba(255,255,255,${0.2 - i * 0.045})`; ctx.lineWidth = 5; ctx.stroke(); }
      dMan(150, 930, 210, D_W, { rot: 0.18 + Math.sin(t * 2) * 0.04 });
      withFade(dIn(t, ch(L, 1)), () => text('?', CX, 1080 + Math.sin(t * 3) * 16, 190, 900, D_W, 'center'));
      dStamp('NO PRIZE', 360, 490, t, a + 0.15, 86, -0.06); dStamp('NO REASON', 700, 660, t, ch(L, 0) + 0.65, 80, 0.06);
      dStamp('JUST A HOLE', CX, 1320, t, ch(L, 1) + 0.15, 56, -0.02, true);
    } },
    { type: 'art', sfx: [[1, 'ding', 0.22], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('SOMEBODY ASKED');
      withFade(dIn(t, a), () => { fillRR(100, 420, 760, 130, 44, D_W); poly([[150, 545], [150, 600], [220, 545]], D_W); text('BUY SOME BULLSHIT?', 480, 488, 56, 900, '#000', 'center'); });
      const y = pop(t, ch(L, 1), 0.35); if (y > 0) xf(700, 670, clamp(y), 0, () => { fillRR(420, 610, 560, 120, 44, '#4a4a4a'); text('TAKE MY MONEY', 700, 673, 52, 900, D_W, 'center'); });
      const k = dIn(t, ch(L, 2) - 0.05, 0.35); withFade(k, () => { fillRR(100, 850, 880, 270, 30, 'rgba(255,255,255,0.07)'); strokeRR(100, 850, 880, 270, 30, D_D, 4); dotPerson(220, 975, 150, D_W); text('Marcus', 340, 925, 68, 800, D_W, 'left'); text('YOUR CLIENT', 340, 995, 34, 800, D_G, 'left', 0.12); text('last visit: a while ago', 340, 1058, 38, 600, D_G, 'left', 0); });
      dStamp('NOBODY ASKED', CX, 1250, t, ch(L, 3), 90, -0.04);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Ava', 92], ['Jordan', 85], ['Marcus', 38], ['Priya', 29]], msg: ['Marcus, it’s been a while.', 'Want your usual spot?'] },
  ];
  window.REEL = { name: 'bullshit', who: 'Marcus', scenes: S };
})();
