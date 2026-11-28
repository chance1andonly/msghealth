// MsgHealth · pudding (California, 1999: 12,150 cups of pudding for 1.25 million airline miles) · black/white story reel for src/hist.js (drawings use src/doc.js). Plain drawings only, no logos.
(() => {
  // a pudding cup, base centred on (x, y), about 200 wide at s = 1
  const cup = (x, y, s = 1, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); poly([[-72, 0], [72, 0], [100, -170], [-100, -170]], D_L); poly([[-86, -50], [86, -50], [95, -118], [-95, -118]], '#222'); text('PUDDING', 0, -83, 34, 900, '#fff', 'center', 0.04); fillRR(-112, -192, 224, 28, 10, D_W); line(-82, -178, 82, -178, '#aaa', 4); ctx.restore(); };
  const barcode = (x, y, w, h, seed = 0) => { fillRR(x - w / 2, y - h / 2, w, h, 8, D_W); let px = x - w / 2 + w * 0.1, i = 0; while (px < x + w / 2 - w * 0.12) { const bw = w * (0.012 + hash(seed * 31 + i) * 0.035); fillRR(px, y - h * 0.34, bw, h * 0.68, 0, '#000'); px += bw + w * (0.014 + hash(seed * 13 + i + 7) * 0.025); i++; } };
  const plane = (x, y, s = 1, rot = 0, col = D_W) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    fillRR(-170, -26, 340, 52, 26, col); poly([[-20, -20], [-95, -150], [-45, -150], [60, -20]], col); poly([[-20, 20], [-95, 150], [-45, 150], [60, 20]], col); poly([[-140, -18], [-185, -80], [-155, -80], [-100, -18]], col); ctx.restore(); };
  const pile = (rows, baseY, s, t, drop = 0) => { for (let r = 0; r < rows; r++) for (let i = 0; i < rows + 1 - r; i++) { const x = CX - (rows - r) * 120 * s + i * 240 * s, y = baseY - r * 188 * s; const k = drop ? ease.out(seg(t, drop + (r * 7 + i) * 0.025 - 0.3, drop + (r * 7 + i) * 0.025 + 0.15)) : 1; if (k > 0) cup(x, lerp(y - 500, y, k), s, (hash(r * 9 + i) - 0.5) * 0.08); } };
  const cart = (x, y) => { poly([[x - 220, y - 330], [x + 250, y - 330], [x + 180, y - 100], [x - 160, y - 100]], '#2c2c2c'); line(x - 220, y - 330, x + 250, y - 330, D_W, 12); line(x - 220, y - 330, x - 160, y - 100, D_W, 12); line(x + 250, y - 330, x + 180, y - 100, D_W, 12); line(x - 160, y - 100, x + 180, y - 100, D_W, 12); line(x - 220, y - 330, x - 300, y - 400, D_W, 14); for (let i = 1; i < 5; i++) line(x - 220 + i * 94, y - 330, x - 160 + i * 68, y - 100, D_G, 5); [-120, 140].forEach((d) => { circle(x + d, y - 35, 36, '#000'); ring(x + d, y - 35, 30, D_W, 10); }); };
  const bubble2 = (x, y, w, lines, size, tailX) => { const h = lines.length * size * 1.25 + 60; fillRR(x - w / 2, y - h / 2, w, h, 50, '#fff'); poly([[tailX - 34, y + h / 2 - 4], [tailX + 34, y + h / 2 - 4], [tailX + 10, y + h / 2 + 62]], '#fff'); lines.forEach((l, i) => text(l, x, y - (lines.length - 1) * size * 0.625 + i * size * 1.25 + 2, size, 900, '#000', 'center', 0)); };
  const S = [
    { type: 'art', sfx: [[1, 'dimpact', 0.28], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('ONE MAN · ONE PLAN'); line(0, 1230, W, 1230, D_D, 8);
      dBig('12,000', 500, t, -0.4, 270);
      pile(4, 1228, 0.82, t);
      dStamp('PUDDING CUPS', CX, 718, t, ch(L, 1) - 0.05, 80, -0.05, true);
      dStamp('ON PURPOSE', CX, 1320, t, ch(L, 3) - 0.05, 90, -0.04);
    } },
    { type: 'art', sfx: [[2, 'dshutter', 0.16], [5, 'dding', 0.22]], draw(t, a, c, L) {
      dHead('THE LOOPHOLE · 1999');
      const send = ease.inOut(seg(t, ch(L, 4) - 0.1, ch(L, 4) + 0.45));
      for (let i = 0; i < 10; i++) { const x = 300 + (i % 2) * 480, y = 600 + Math.floor(i / 2) * 118, e = pop(t, ch(L, 2) - 0.2 + i * 0.07, 0.25); if (e > 0 && send < 1) withFade(1 - send, () => xf(x, y, clamp(e), (CX - x) * send, () => barcode(x, y, 340, 92, i), (840 - y) * send)); }
      if (send > 0) { const k = pop(t, ch(L, 4), 0.35); if (k > 0) xf(CX, 760, clamp(k), 0, () => { fillRR(190, 480, 700, 560, 30, D_W); plane(CX, 640, 0.75, -0.25, '#000'); text('1,000', CX, 850, 200, 900, '#000', 'center', -0.02); text('AIRLINE MILES', CX, 975, 62, 900, '#444', 'center', 0.1); }); }
      const early = 1 - seg(t, ch(L, 2) - 0.35, ch(L, 2) - 0.15); withFade(early, () => { line(0, 1220, W, 1220, D_D, 8); dMan(360, 1218, 600, D_W); cup(790, 1218, 1.7); barcode(790, 760 + Math.sin(t * 5) * 10, 300, 130, 3); });
      dStamp('DAVID PHILLIPS', CX, 418, t, ch(L, 0), 68, -0.04, true);
      withFade(1 - send, () => dStamp('10 BARCODES', CX, 1315, t, ch(L, 3), 76, -0.04));
      dStamp('EARLY BIRD DOUBLE', CX, 1315, t, ch(L, 4) + 0.4, 62, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dcash', 0.2]], draw(t, a, c, L) {
      dHead('THE PRICE'); line(0, 1200, W, 1200, D_D, 8);
      cup(360, 1198, 2.2);
      const k = pop(t, ch(L, 1) - 0.1, 0.35); if (k > 0) xf(760, 700, clamp(k), 0, () => { ctx.save(); ctx.translate(760, 700); ctx.rotate(0.14); poly([[-230, 0], [-130, -140], [220, -140], [220, 140], [-130, 140]], D_W); circle(-140, 0, 22, '#000'); text('25¢', 50, 6, 160, 900, '#000', 'center', -0.02); ctx.restore(); });
      dStamp('EACH', 770, 960, t, ch(L, 1) + 0.25, 80, 0.06, true);
      dStamp('JACKPOT', CX, 1315, t, ch(L, 1) + 0.55, 80, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dimpact', 0.24], [4, 'dglitch', 0.18]], draw(t, a, c, L) {
      dHead('THE SHOPPING TRIP'); line(0, 1220, W, 1220, D_D, 8);
      const roll = ease.out(seg(t, a - 0.3, a + 0.5)), x = lerp(-300, 510, roll);
      for (let i = 0; i < 18; i++) cup(x - 150 + (i % 6) * 70 + (Math.floor(i / 6) % 2) * 22, 930 - Math.floor(i / 6) * 76, 0.42, (hash(i) - 0.5) * 0.3);
      cart(x, 1218); dMan(x - 355, 1218, 420, D_L, { run: roll < 1 ? t * 8 : 0 });
      const k = pop(t, ch(L, 1) - 0.1, 0.35); if (k > 0 && t < ch(L, 2) - 0.1) xf(700, 540, clamp(k), 0, () => { fillRR(450, 420, 500, 250, 20, D_W); text('RECEIPT', 700, 480, 46, 900, '#555', 'center', 0.2); text('$3,000+', 700, 585, fit('$3,000+', 110, 420, 900), 900, '#000', 'center', 0); });
      const b = pop(t, ch(L, 3) - 0.15, 0.35); if (b > 0) xf(600, 560, clamp(b), 0, () => bubble2(600, 540, 720, ['“Just stocking', 'up for Y2K.”'], 74, 300));
      dStamp('COVER STORY', CX, 1320, t, ch(L, 4), 78, -0.05);
    } },
    { type: 'art', sfx: [[1, 'dcount', 0.14], [4, 'dknock', 0.18]], draw(t, a, c, L) {
      dHead('ONE PROBLEM');
      if (t < ch(L, 3) - 0.1) {
        const r = (t - a) * 7; circle(CX, 560, 150, D_W); ring(CX, 560, 128, '#000', 8); line(CX, 560, CX + Math.sin(r) * 105, 560 - Math.cos(r) * 105, '#000', 14); line(CX, 560, CX + Math.sin(r / 5) * 70, 560 - Math.cos(r / 5) * 70, '#000', 20);
        for (let i = 0; i < 9; i++) barcode(190 + (i % 3) * 350 + (hash(i) - 0.5) * 60, 850 + Math.floor(i / 3) * 140, 270, 96, i + 20);
        dStamp('12,000 BARCODES', CX, 1315, t, a + 0.3, 70, -0.04, true);
      } else {
        line(0, 1200, W, 1200, D_D, 8);
        dMan(280, 1198, 520, D_W);
        ctx.save(); ctx.translate(360, 800); ctx.rotate(-0.5); fillRR(-26, -80, 52, 160, 24, D_G); ctx.restore();
        if (t > ch(L, 3) + 0.1) for (let i = 0; i < 3; i++) { const p = ((t * 1.3 + i / 3) % 1); ctx.beginPath(); ctx.arc(390, 790, 60 + p * 260, -0.7, 0.7); ctx.strokeStyle = `rgba(255,255,255,${1 - p})`; ctx.lineWidth = 12; ctx.stroke(); }
        const k = pop(t, ch(L, 4) - 0.1, 0.35); if (k > 0) xf(720, 760, clamp(k), 0, () => { fillRR(540, 610, 440, 340, 26, D_W); text('THE', 760, 690, 60, 900, '#555', 'center', 0.16); text('SALVATION', 760, 780, 70, 900, '#000', 'center', 0.02); text('ARMY', 760, 865, 90, 900, '#000', 'center', 0.1); });
        dStamp('SEND HELP', CX, 460, t, ch(L, 3), 100, -0.05);
      }
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.18], [2, 'dthud', 0.2], [4, 'dcash', 0.2]], draw(t, a, c, L) {
      dHead('THE DEAL');
      if (t < ch(L, 3) - 0.1) {
        line(0, 1000, W, 1000, D_D, 8);
        [200, 540, 880].forEach((x, i) => { dMan(x, 998, 400, [D_W, D_L, D_G][i], { run: Math.sin(t * 5 + i) * 0.15 }); const p = ((t * 1.6 + i * 0.33) % 1); barcode(x + 80 + p * 40, 760 - p * 190, 120, 48, i + 40); });
        fillRR(60, 900, 960, 60, 12, '#555');
        for (let i = 0; i < 7; i++) { const go = ease.inOut(seg(t, ch(L, 2) - 0.1 + i * 0.06, ch(L, 2) + 0.7 + i * 0.06)); cup(lerp(110 + i * 143, 180 + i * 120, go), lerp(898, 1330 - (i % 2) * 60, go), 0.55); }
        dStamp('THEY PEEL', CX, 440, t, ch(L, 0), 84, -0.05, true);
        dStamp('THEY KEEP IT', CX, 1090, t, ch(L, 2) + 0.15, 66, 0.04);
      } else {
        const k = pop(t, ch(L, 3) - 0.1, 0.35); if (k > 0) xf(CX, 810, clamp(k), 0, () => { ctx.save(); ctx.translate(CX, 810); ctx.rotate(-0.025); fillRR(-380, -420, 760, 840, 18, '#ededed'); text('TAX RETURN', 0, -325, 78, 900, '#000', 'center', 0.08); for (let i = 0; i < 4; i++) fillRR(-300, -225 + i * 62, i % 2 ? 440 : 600, 16, 8, '#bbb'); strokeRR(-300, 60, 600, 270, 14, '#000', 8); text('DEDUCTION', 0, 125, 48, 900, '#555', 'center', 0.14); const n = ease.out(seg(t, ch(L, 4) - 0.2, ch(L, 4) + 0.4)); if (n <= 0.02) text('$ ?', 0, 235, 150, 900, '#999', 'center', 0); else dNum('$' + (n >= 1 ? 815 : Math.max(25, Math.round(815 * n / 25) * 25)), 235, 150, '#000', 0); ctx.restore(); });
        dStamp('WRITE-OFF', CX, 1315, t, ch(L, 4) + 0.35, 96, -0.07, true);
      }
    } },
    { type: 'art', sfx: [[1, 'dcount', 0.18], [2, 'dimpact', 0.28]], draw(t, a, c, L) {
      dHead('TOTAL HAUL');
      for (let i = 0; i < 7; i++) { const ang = t * 0.8 + i * 0.9, rx = 420, ry = 400; plane(CX + Math.cos(ang) * rx, 830 + Math.sin(ang) * ry, 0.34, ang + Math.PI / 2, i % 2 ? D_G : D_L); }
      const n = ease.out(seg(t, a + 0.1, ch(L, 2) + 0.2)), v = n >= 1 ? 1253000 : Math.round(1253000 * n / 50000) * 50000;
      fillRR(70, 650, 940, 330, 40, '#000'); strokeRR(70, 650, 940, 330, 40, D_W, 7); dNum(v.toLocaleString(), 785, 170);
      withFade(dIn(t, ch(L, 2) - 0.1), () => text('AIRLINE MILES', CX, 915, 60, 900, D_L, 'center', 0.12));
      dStamp('FROM PUDDING', CX, 1320, t, ch(L, 2) + 0.45, 74, -0.05);
    } },
    { type: 'art', sfx: [[1, 'dding', 0.22], [2, 'dimpact', 0.24], [3, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('THE BONUS'); line(0, 1240, W, 1240, D_D, 8);
      const k = pop(t, ch(L, 1) - 0.1, 0.4); if (k > 0) xf(CX, 620, clamp(k), 0, () => { ctx.save(); ctx.translate(CX, 620); ctx.rotate(-0.06); fillRR(-340, -210, 680, 420, 40, D_W); plane(0, -138, 0.36, -0.2, '#000'); text('GOLD', 0, 20, 170, 900, '#000', 'center', 0.1); text(t > ch(L, 2) - 0.05 ? 'STATUS · FOR LIFE' : 'STATUS', 0, 145, 48, 900, '#444', 'center', 0.12); ctx.restore(); });
      else plane(CX, 640, 1.5, -0.2);
      dMan(CX, 1238, 360, D_L, { arms: t > ch(L, 1) ? 'up' : undefined, run: Math.sin(t * 6) * 0.2 });
      [[170, 1130], [910, 1130]].forEach(([x, y]) => cup(x, 1238, 0.8, 0));
      dStamp('CRAZY BASTARD', CX, 1325, t, ch(L, 3), 74, -0.05);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.2], [2, 'dimpact', 0.24]], draw(t, a, c, L) {
      dHead('THE LESSON'); line(0, 1220, W, 1220, D_D, 8);
      fillRR(650, 480, 360, 740, 14, '#2c2c2c'); fillRR(700, 540, 260, 680, 8, '#e8e8e8'); text('SHOP', 830, 660, 70, 900, '#000', 'center', 0.12);
      for (let i = 0; i < 5; i++) { const p = ((t - a) * 0.55 + i * 0.2) % 1, x = lerp(-80, 800, p); withFade(1 - seg(p, 0.85, 1), () => dMan(x, 1218, 360, [D_W, D_L, D_G][i % 3], { run: t * 9 + i, arms: i % 2 ? 'up' : undefined })); }
      dStamp('A REASON', 340, 520, t, ch(L, 0) + 0.15, 86, -0.06, true);
      dStamp('TO COME BACK', 345, 660, t, ch(L, 1), 66, 0.03);
      dStamp('WILD SHIT', CX, 1320, t, ch(L, 2) + 0.05, 90, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dmsg', 0.2], [2, 'dthud', 0.2]], draw(t, a, c, L) {
      dHead('YOUR REGULARS');
      const k = pop(t, ch(L, 1) - 0.15, 0.35);
      fillRR(130, 430, 480, 800, 60, '#1c1c1c'); strokeRR(130, 430, 480, 800, 60, D_W, 8); fillRR(300, 460, 140, 26, 13, '#000');
      [0, 1, 2, 3].forEach((i) => { dotPerson(215, 600 + i * 150, 100, i < 2 ? D_W : D_D); fillRR(300, 575 + i * 150, 250, 22, 11, i < 2 ? D_G : D_D); fillRR(300, 620 + i * 150, 160, 22, 11, D_D); });
      if (k > 0) xf(440, 880, clamp(k), 0, () => { fillRR(150, 800, 620, 170, 60, '#fff'); poly([[220, 960], [290, 960], [200, 1020]], '#fff'); text('miss you. thursday?', 460, 888, 54, 800, '#000', 'center', 0); });
      cup(860, 800, 1.15, 0.08);
      const x = dIn(t, ch(L, 2) - 0.05, 0.25); if (x > 0) { line(730, 540, lerp(730, 1000, x), lerp(540, 830, x), D_W, 28); line(1000, 540, lerp(1000, 730, x), lerp(540, 830, x), D_W, 28); }
      dStamp('NO PUDDING', CX, 1320, t, ch(L, 2) + 0.15, 84, -0.05);
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'pudding', who: 'Marcus', scenes: S };
})();
