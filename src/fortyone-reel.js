// MsgHealth · fortyone · black/white illustrated original story (made up, labelled) for src/hist.js (drawings use src/doc.js)
(() => {
  const road = (t, y, speed = 260) => {
    fillRR(-40, y, W + 80, 150, 0, '#232323'); line(-40, y, W + 40, y, D_G, 6, 'butt'); line(-40, y + 150, W + 40, y + 150, D_G, 6, 'butt');
    for (let i = -1; i < 8; i++) { const x = i * 190 - ((t * speed) % 190); fillRR(x, y + 69, 100, 12, 4, D_L); }
  };
  const car = (x, base, s, t) => { // side view, wheels sit on base, drives right
    ctx.save(); ctx.translate(x, base); ctx.scale(s, s);
    poly([[-95, -86], [-55, -150], [55, -150], [105, -86]], D_L); poly([[-70, -92], [-44, -134], [-6, -134], [-6, -92]], '#161616'); poly([[12, -92], [12, -134], [48, -134], [78, -92]], '#161616');
    fillRR(-160, -92, 320, 66, 24, D_W); circle(150, -62, 11, '#8c8c8c');
    [-95, 95].forEach((d) => { circle(d, -26, 36, '#000'); circle(d, -26, 36 * 0.55, D_G); line(d, -26, d + Math.cos(t * 14) * 18, -26 + Math.sin(t * 14) * 18, '#000', 6); });
    ctx.restore();
  };
  const pole = (x, y, h, t) => { fillRR(x - 17, y, 34, h, 14, D_W); ctx.save(); rr(x - 17, y, 34, h, 14); ctx.clip(); for (let k = -2; k < h / 44 + 2; k++) { const py = y + k * 44 + (t * 40) % 44; poly([[x - 20, py], [x + 20, py - 24], [x + 20, py - 4], [x - 20, py + 20]], '#4a4a4a'); } ctx.restore(); circle(x, y - 8, 14, D_L); };
  const shop = (x, base, w, h, label, t) => {
    fillRR(x - w / 2, base - h, w, h, 10, '#3c3c3c'); strokeRR(x - w / 2, base - h, w, h, 10, D_G, 4);
    fillRR(x - w / 2 - 12, base - h - 10, w + 24, 76, 10, D_W); text(label, x, base - h + 30, fit(label, 40, w - 20, 900), 900, '#000', 'center', 0.02);
    const dh = Math.min(130, h - 80); fillRR(x - 42, base - dh, 84, dh, 6, '#161616'); if (h > 200) { fillRR(x - w / 2 + 26, base - 150, 62, 74, 4, D_L); pole(x + w / 2 - 40, base - 160, 120, t); }
  };
  const digits = (s, cx, y, size, col) => { // fixed slots, so a counting number never jitters
    const dw = size * 0.64, cw = size * 0.3, widths = [...s].map((ch0) => (ch0 === ',' ? cw : dw)), tot = widths.reduce((a, b) => a + b, 0);
    let x = cx - tot / 2; [...s].forEach((g, i) => { text(g, x + widths[i] / 2, y, size, 900, col, 'center', 0); x += widths[i]; });
  };
  const S = [
    { type: 'art', draw(t, a, c, L) {
      dHead('ORIGINAL STORY · MADE UP');
      dBig('41 MILES', 490, t, -0.4, 250); text('TO DODGE HIS BARBER', CX, 672, 56, 800, D_L, 'center', 0.05);
      shop(240, 1120, 330, 290, 'HIS BARBER', t); shop(900, 1120, 190, 170, 'NEW GUY', t);
      road(0, 1130, 0);
      car(lerp(250, 770, ease.inOut(seg(t, 0.15, 3.5))), 1250, 0.9, t);
      withFade(dIn(t, 0.1), () => text('41 MI', 900, 885, 56, 900, D_W, 'center', 0.02));
      dStamp('10 MIN AWAY', 240, 770, t, ch(L, 1) + 0.1, 54, -0.07);
    } },
    { type: 'art', draw(t, a, c, L) {
      dHead('EVERY TWO WEEKS');
      const f = Math.floor(234 * seg(t, a + 0.1, ch(L, 2)));
      for (let i = 0; i < 234; i++) { const q = i % 26, r = Math.floor(i / 26); fillRR(104 + q * 33.6, 390 + r * 40, 27, 31, 5, i < f ? D_W : '#2a2a2a'); }
      withFade(dIn(t, ch(L, 1) - 0.05), () => text('9 YEARS · 234 TRIPS', CX, 790, 50, 800, D_L, 'center', 0.06));
      const k = Math.round(seg(t, ch(L, 2) - 0.05, ch(L, 2) + 0.75) * 12) / 12;
      if (t >= ch(L, 2) - 0.05) { digits(Math.round(19188 * k).toLocaleString('en-US'), CX, 960, 230, D_W); text('MILES', CX, 1130, 80, 900, D_G, 'center', 0.2); }
      else { road(t, 880); car(CX, 1000, 1.25, t); }
      dStamp('FOR A HAIRCUT', CX, 1285, t, ch(L, 3) + 0.05, 84, -0.05);
    } },
    { type: 'art', draw(t, a, c, L) {
      dHead('THE REASON');
      line(330, 380, 420, 450, D_G, 8); line(750, 380, 660, 450, D_G, 8); circle(CX, 380, 2, D_G);
      fillRR(230, 445, 620, 420, 24, D_W); strokeRR(250, 465, 580, 380, 16, '#000', 6); text('HAIRCUTS', CX, 545, 76, 900, '#000', 'center', 0.1);
      const k = pop(t, ch(L, 1), 0.35);
      if (k > 0) xf(CX, 720, clamp(k), 0, () => text('+$5', CX, 720, 230, 900, '#000', 'center', -0.03));
      else text('SAME PRICE', CX, 720, 66, 800, '#4a4a4a', 'center', 0.04);
      line(60, 1330, 1020, 1330, D_D, 8); dMan(200, 1330, 390, D_L); dMan(900, 1330, 350, D_G);
      const q = dIn(t, ch(L, 2), 0.25); withFade(q, () => { fillRR(290, 900, 250, 120, 50, D_W); poly([[330, 1000], [250, 1050], [390, 1018]], D_W); [0, 1, 2].forEach((i) => circle(360 + i * 55, 960, 15, '#000')); });
      dStamp('SAID NOTHING', 790, 922, t, ch(L, 2) + 0.35, 48, -0.04, true);
    } },
    { type: 'art', draw(t, a, c, L) {
      dHead('THE ANNOUNCEMENT');
      fillRR(100, 420, 410, 760, 62, '#161616'); strokeRR(100, 420, 410, 760, 62, D_L, 8); fillRR(235, 448, 140, 34, 17, '#000');
      text('NO NEW', 305, 730, 62, 900, D_W, 'center', 0.04); text('MESSAGES', 305, 810, 62, 900, D_W, 'center', 0.04);
      dStamp('NO HEADS UP', 305, 1010, t, a + 0.55, 46, -0.07);
      const k = dIn(t, ch(L, 1) - 0.1, 0.3);
      withFade(0.25 + 0.75 * k, () => { fillRR(580, 420, 400, 760, 14, '#2a2a2a'); strokeRR(580, 420, 400, 760, 14, D_G, 6); line(780, 430, 780, 1170, D_G, 5); fillRR(742, 780, 14, 80, 6, D_L); });
      const p = pop(t, ch(L, 1) + 0.05, 0.4);
      if (p > 0) xf(780, 690, clamp(p), 0, () => { fillRR(620, 560, 320, 260, 18, D_W); strokeRR(636, 576, 288, 228, 12, '#000', 5); text('NEW', 780, 640, 68, 900, '#000', 'center', 0.08); text('PRICE', 780, 722, 68, 900, '#000', 'center', 0.08); text('+$5', 780, 775, 40, 800, '#4a4a4a', 'center'); });
      dStamp('JUST A SIGN', CX, 1295, t, ch(L, 1) + 0.55, 66, 0.04, true);
    } },
    { type: 'art', draw(t, a, c, L) {
      dHead('HE LEFT');
      line(40, 1330, 1040, 1330, D_D, 8);
      const w = ease.in(seg(t, a + 0.1, ch(L, 1) + 0.2));
      if (w < 1) dMan(lerp(520, 1180, w), 1330, 420, D_W, { run: t * 9 });
      withFade(1 - dIn(t, ch(L, 1) - 0.15, 0.2), () => { dStamp('NO GOODBYE', CX, 620, t, a + 0.35, 90, -0.06); });
      dMan(200, 1330, 440, D_L, { arms: t > ch(L, 1) ? 'up' : '' });
      [[640, 330], [780, 360], [920, 320]].forEach(([x, h], i) => withFade(dIn(t, ch(L, 1) + 0.15 + i * 0.15), () => dMan(x, 1330, h, D_G)));
      const b = pop(t, ch(L, 1), 0.35);
      if (b > 0) xf(540, 640, clamp(b), 0, () => {
        fillRR(110, 420, 860, 420, 60, D_W); poly([[240, 820], [215, 920], [370, 830]], D_W);
        text('THAT GUY?', CX, 510, 70, 800, '#4a4a4a', 'center', 0.02);
        if (t >= ch(L, 2) - 0.05) { text('A FLAKY SON', CX, 640, 104, 900, '#000', 'center', -0.01); text('OF A BITCH.', CX, 755, 104, 900, '#000', 'center', -0.01); }
        else [0, 1, 2].forEach((i) => circle(470 + i * 70, 690, 18 + Math.sin(t * 9 - i) * 5, '#000'));
      });
    } },
    { type: 'art', draw(t, a, c, L) {
      dHead('MEANWHILE');
      const n = Math.round(91 * seg(t, a + 0.1, ch(L, 1) + 0.5));
      digits(String(n), CX, 480, 250, D_W); text('PEOPLE TOLD', CX, 650, 54, 800, D_L, 'center', 0.12);
      for (let i = 0; i < 91; i++) { const q = i % 13, r = Math.floor(i / 13); dotPerson(144 + q * 66, 745 + r * 64, 52, i < n ? D_W : '#303030'); }
      dStamp('“THAT BARBER’S A PRICK”', CX, 1220, t, ch(L, 1) + 0.2, 58, -0.03);
      dStamp('HE COUNTED.', CX, 1325, t, ch(L, 2) + 0.55, 58, 0.04, true);
    } },
    { type: 'art', draw(t, a, c, L) {
      const sw = ch(L, 1) - 0.1, one = 1 - dIn(t, sw, 0.2);
      withFade(one, () => { dHead('ABOUT THAT GUY'); line(200, 1250, 880, 1250, D_D, 8); dMan(CX, 1250, 640, D_L); dStamp('MADE UP', CX, 820, t, a + 0.4, 150, -0.12); });
      withFade(dIn(t, sw, 0.25), () => {
        dHead('YOUR BOOKS RIGHT NOW');
        for (let i = 0; i < 10; i++) { const q = i % 5, r = Math.floor(i / 5), x = 190 + q * 175, y = 600 + r * 260, on = i < 3 && t >= sw + 0.35 + i * 0.2; dotPerson(x, y, 150, on ? D_W : '#444444'); if (on) text('?', x, y - 112, 70, 900, D_W, 'center'); }
        dStamp('THREE OF HIM', CX, 1170, t, ch(L, 2) + 0.05, 100, -0.04);
      });
    } },
    { type: 'art', draw: dHealth, rows: [['Ava', 91], ['Jordan', 84], ['Marcus', 38], ['Priya', 29]], msg: ['Sorry about the price', 'jump. Come back in?'] },
  ];
  window.REEL = { name: 'fortyone', who: 'Marcus', scenes: S };
})();
