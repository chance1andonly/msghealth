// MsgHealth · heater (made-up story: the closed sign nobody flipped) · black/white illustrated story reel for src/hist.js (drawings use src/doc.js)
(() => {
  const GLASS = '#101010';
  const flame = (x, y, s, t, i = 0) => { const f = 1 + 0.18 * Math.sin(t * 13 + i * 2.1), w = Math.sin(t * 9 + i) * 12; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    [[1, '#6a6a6a'], [0.68, D_L], [0.38, D_W]].forEach(([k, col]) => { ctx.beginPath(); ctx.moveTo(-60 * k, 0); ctx.quadraticCurveTo(-75 * k, -80 * k * f, w * k, -180 * k * f); ctx.quadraticCurveTo(10 * k, -90 * k, 40 * k, -112 * k * f); ctx.quadraticCurveTo(85 * k, -46 * k, 60 * k, 0); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }); ctx.restore(); };
  // a floor heater: on = flames behind the grille, off = dark and frosted
  const heater = (x, y, s, t, on) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    if (on) glow(0, -110, 260, '#ffffff', 0.28);
    fillRR(-130, -220, 260, 200, 26, '#5a5a5a'); strokeRR(-130, -220, 260, 200, 26, D_W, 6); fillRR(-104, -194, 208, 148, 14, '#0b0b0b');
    if (on) [-62, 0, 62].forEach((fx, i) => flame(fx, -52, 0.52, t, i));
    for (let i = -80; i <= 80; i += 40) line(i, -190, i, -52, 'rgba(255,255,255,0.28)', 6);
    fillRR(-104, -22, 36, 34, 8, D_L); fillRR(68, -22, 36, 34, 8, D_L); ctx.restore(); };
  // the hanging CLOSED / OPEN sign
  const sign = (x, y, s, word = 'CLOSED', rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    line(-150, 0, 0, -130, D_G, 7); line(150, 0, 0, -130, D_G, 7); circle(0, -132, 12, D_W);
    fillRR(-230, -6, 460, 190, 22, D_W); strokeRR(-212, 12, 424, 154, 14, '#000', 6); text(word, 0, 92, word.length > 4 ? 92 : 120, 900, '#000', 'center', 0.04); ctx.restore(); };
  const pole = (x, y, h, t) => { fillRR(x - 24, y - h, 48, h, 24, D_L); ctx.save(); rr(x - 24, y - h, 48, h, 24); ctx.clip(); for (let i = -2; i < h / 60 + 2; i++) { const yy = y - h + i * 60 + (t * 40) % 60; line(x - 40, yy + 30, x + 40, yy - 20, '#222', 18, 'butt'); } ctx.restore(); fillRR(x - 34, y - h - 20, 68, 26, 12, D_G); fillRR(x - 34, y - 6, 68, 26, 12, D_G); };
  const shopFront = (t, open = false) => {
    fillRR(130, 700, 820, 590, 12, '#2b2b2b'); strokeRR(130, 700, 820, 590, 12, D_L, 6);
    fillRR(105, 640, 870, 96, 14, D_L); text('BARBER', CX, 690, 62, 900, '#000', 'center', 0.2);
    fillRR(185, 790, 350, 350, 10, GLASS); strokeRR(185, 790, 350, 350, 10, D_G, 5); line(360, 790, 360, 1140, D_G, 5);
    fillRR(620, 790, 270, 500, 10, GLASS); strokeRR(620, 790, 270, 500, 10, D_W, 6); circle(655, 1060, 12, D_W);
    sign(755, 900, 0.48, open ? 'OPEN' : 'CLOSED', Math.sin(t * 1.7) * 0.05);
    pole(80, 1220, 330, t); fillRR(40, 1286, 1000, 12, 6, D_W);
  };
  const iceCicles = (x, y, w, n) => { for (let i = 0; i < n; i++) { const px = x + (i + 0.5) * w / n, h = 30 + hash(i + 4) * 60; poly([[px - 14, y], [px + 14, y], [px, y + h]], D_W); } };
  const chair = (x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fillRR(-95, -330, 190, 210, 40, D_L); fillRR(-130, -170, 260, 70, 30, D_W); fillRR(-170, -210, 60, 44, 20, D_G); fillRR(110, -210, 60, 44, 20, D_G); fillRR(-26, -104, 52, 74, 10, D_G); fillRR(-120, -34, 240, 34, 17, D_L); fillRR(-60, -380, 120, 56, 24, D_G); ctx.restore(); };

  const S = [
    // 0 · hook: forty regulars gone, heater already fixed
    { type: 'art', sfx: [[2, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('ORIGINAL STORY · MADE UP');
      text('40', CX, 470, 230, 900, D_W, 'center', -0.04); text('REGULARS GONE', CX, 615, 66, 900, D_W, 'center', 0.04);
      const gone = seg(t, a + 0.15, ch(L, 2) - 0.2);
      for (let i = 0; i < 40; i++) { const r = Math.floor(i / 10), q = i % 10, x = 135 + q * 90, y = 740 + r * 84, off = hash(i + 11) < gone;
        withFade(off ? 0.16 : 1, () => dotPerson(x, y, 70, off ? D_G : D_W)); }
      const k = dIn(t, ch(L, 2), 0.3); heater(300, 1300, 1.05, t, true);
      if (k > 0) dStamp('ALREADY FIXED', 700, 1200, t, ch(L, 2), 58, -0.06);
    } },
    // 1 · town of 311, heater dies, shut six days
    { type: 'art', sfx: [[2, 'transitionHit', 0.2]], draw(t, a, c, L) {
      const dead = t >= ch(L, 2), shut = t >= ch(L, 3);
      dHead('JANUARY');
      dDust(t, 60, 380, 960, 700, 46, 0.7, 70);
      [[110, 700, 150], [290, 660, 170], [800, 690, 160]].forEach(([x, y, w]) => { fillRR(x, y, w, 860 - y, 6, '#3a3a3a'); poly([[x - 14, y], [x + w / 2, y - 80], [x + w + 14, y]], D_G); fillRR(x + w / 2 - 22, y + 50, 44, 48, 6, D_L); });
      fillRR(480, 610, 290, 250, 8, '#8c8c8c'); poly([[462, 610], [625, 515], [788, 610]], D_W); pole(515, 850, 150, t); fillRR(575, 700, 150, 150, 8, GLASS); line(60, 862, 1020, 862, D_W, 8);
      withFade(1 - dIn(t, ch(L, 2) - 0.15, 0.2), () => { fillRR(280, 920, 520, 150, 18, D_W); text('POPULATION', CX, 963, 40, 800, '#000', 'center', 0.16); text('311', CX, 1032, 74, 900, '#000', 'center'); });
      if (dead) { withFade(dIn(t, ch(L, 2)) * (1 - dIn(t, ch(L, 3) - 0.1, 0.2)), () => { heater(CX, 1250, 1.45, t, false); iceCicles(350, 930, 380, 7); dStamp('DEAD', CX, 1115, t, ch(L, 2) + 0.4, 96, -0.1, true); }); }
      if (shut) { text('SHUT 6 DAYS', CX, 970, 88, 900, D_W, 'center', 0.02);
        for (let i = 0; i < 6; i++) { const x = 95 + i * 152, at = ch(L, 3) + 0.05 + i * 0.1, k = pop(t, at, 0.25); if (k <= 0) continue; xf(x + 65, 1150, clamp(k), 0, () => { fillRR(x, 1060, 130, 180, 16, D_W); text(String(i + 1), x + 65, 1105, 44, 800, '#555', 'center'); line(x + 30, 1140, x + 100, 1215, '#000', 14); line(x + 100, 1140, x + 30, 1215, '#000', 14); }); } }
    } },
    // 2 · day three, the gas station guy's cold garage
    { type: 'art', sfx: [[3, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('DAY THREE');
      dDust(t, 60, 380, 960, 880, 40, 0.6, 60);
      fillRR(90, 430, 420, 120, 16, D_W); text('GAS', 300, 492, 80, 900, '#000', 'center', 0.2); line(150, 550, 150, 1250, D_G, 16);
      fillRR(95, 1000, 150, 250, 18, D_L); fillRR(118, 1025, 104, 80, 10, '#000'); line(245, 1070, 300, 1180, D_G, 12);
      const g = dIn(t, a, 0.2);
      withFade(g, () => { fillRR(370, 640, 660, 610, 10, '#3c3c3c'); fillRR(420, 740, 560, 510, 8, GLASS); strokeRR(420, 740, 560, 510, 8, D_W, 7); for (let i = 0; i < 4; i++) line(425, 752 + i * 22, 975, 752 + i * 22, D_D, 12);
        text('GARAGE', 700, 695, 54, 900, D_W, 'center', 0.2); iceCicles(430, 845, 540, 10);
        chair(590, 1240, 0.72); dMan(590, 1170, 190, D_G); dMan(720, 1240, 320, D_W, { arms: 'wave' }); });
      for (let i = 0; i < 4; i++) { const k = pop(t, ch(L, 1) + i * 0.18, 0.3); if (k <= 0) continue; const x = 330 + i * 60 + (i > 1 ? 480 : 0); withFade(clamp(k), () => dMan(x + Math.sin(t * 24 + i) * 3, 1262, 170, D_L)); }
      dStamp('COLD AS HELL', CX, 1330, t, ch(L, 3), 60, -0.04);
    } },
    // 3 · fixed on day seven, told nobody, five weeks
    { type: 'art', sfx: [[2, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('DAY SEVEN');
      const wk = clamp(1 + Math.floor(seg(t, ch(L, 2), ch(L, 2) + 1.1) * 4.999), 1, 5);
      withFade(dIn(t, ch(L, 2) - 0.1, 0.2), () => { fillRR(300, 420, 480, 250, 24, D_W); text('WEEK', CX, 475, 46, 800, '#444', 'center', 0.2); text(String(wk), CX, 585, 160, 900, '#000', 'center'); });
      withFade(1 - dIn(t, ch(L, 2) - 0.25, 0.2), () => { text('HEATER:', CX, 480, 64, 800, D_G, 'center', 0.16); text('FIXED', CX, 590, 150, 900, D_W, 'center', 0.02); });
      heater(230, 1240, 1.25, t, true); chair(560, 1240, 1.0); chair(870, 1240, 1.0);
      dMan(560, 1170, 330, '#5c5c5c');
      const q = dIn(t, ch(L, 1), 0.3); if (q > 0) withFade(q, () => { fillRR(620, 760, 330, 110, 30, '#2e2e2e'); strokeRR(620, 760, 330, 110, 30, D_G, 4); text('told no one', 785, 817, 46, 700, D_L, 'center'); });
      fillRR(40, 1250, 1000, 12, 6, D_W);
      dStamp('NOBODY.', CX, 1330, t, ch(L, 2) + 0.9, 64, -0.04);
    } },
    // 4 · forty clients all think it is still shut and freezing
    { type: 'art', sfx: [[2, 'transitionHit', 0.2]], draw(t, a, c, L) {
      dHead('WHAT 40 CLIENTS THOUGHT');
      const k = dIn(t, a, 0.2);
      withFade(k, () => { fillRR(150, 400, 780, 480, 90, '#1c1c1c'); strokeRR(150, 400, 780, 480, 90, D_W, 7); circle(430, 915, 28, D_W); circle(395, 962, 16, D_W);
        fillRR(350, 510, 380, 300, 10, '#4a4a4a'); poly([[325, 510], [540, 430], [755, 510]], D_L); fillRR(480, 650, 120, 160, 6, GLASS); iceCicles(350, 510, 380, 9); sign(540, 575, 0.42, 'CLOSED'); dDust(t, 190, 430, 700, 380, 30, 0.8, 55); });
      for (let i = 0; i < 40; i++) { const r = Math.floor(i / 10), q = i % 10, x = 135 + q * 90, y = 1030 + r * 76, e = pop(t, a + 0.05 + i * 0.012, 0.25); if (e > 0) xf(x, y, clamp(e), 0, () => dotPerson(x + (t > ch(L, 2) ? Math.sin(t * 26 + i) * 2.5 : 0), y, 62, r % 2 ? D_G : D_L)); }
      dStamp('DAMN.', 800, 880, t, ch(L, 2) + 0.8, 76, -0.09, true);
    } },
    // 5 · a kid asks about the sign
    { type: 'art', sfx: [[1, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('MARCH');
      fillRR(300, 420, 640, 860, 14, '#262626'); strokeRR(300, 420, 640, 860, 14, D_L, 8); fillRR(350, 470, 540, 560, 8, GLASS); circle(360, 1090, 18, D_W);
      sign(620, 720, 1.05, 'CLOSED', Math.sin(t * 3) * 0.06 * (t > ch(L, 1) ? 1.8 : 1));
      dMan(170, 1280, 330, D_W, { arms: 'wave' });
      const k = pop(t, a + 0.7, 0.35); if (k > 0) xf(190, 840, clamp(k), 0, () => { fillRR(60, 770, 260, 140, 40, D_W); poly([[150, 905], [200, 905], [165, 950]], D_W); text('why?', 190, 842, 72, 800, '#000', 'center'); });
      fillRR(40, 1286, 1000, 12, 6, D_W);
      dStamp('NEVER FLIPPED', 620, 1150, t, ch(L, 1) + 1.0, 66, -0.07, true);
    } },
    // 6 · the tally
    { type: 'art', sfx: [[0, 'punch', 0.25], [1, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('THE DAMAGE');
      const row = (y, n, word, at) => { const k = pop(t, at, 0.3); if (k > 0) xf(CX, y, clamp(k), 0, () => { text(n, 300, y, 190, 900, D_W, 'center', -0.04); text(word, 440, y + 8, 84, 900, D_W, 'left', 0.02); }); };
      row(500, '5', 'WEEKS', a + 0.05); row(720, '40', 'CLIENTS', a + 0.75); row(940, '1', 'SIGN', ch(L, 1));
      const k = pop(t, ch(L, 1), 0.4); if (k > 0) xf(CX, 1180, clamp(k), 0, () => sign(CX, 1130, 0.95, 'CLOSED', -0.08));
    } },
    // 7 · your quiet clients don't know the chair is open
    { type: 'art', sfx: [[1, 'whoosh', 0.2]], draw(t, a, c, L) {
      dHead('YOUR QUIET CLIENTS');
      glow(CX, 760, 360, '#ffffff', 0.22); chair(CX, 960, 1.25); line(180, 962, 900, 962, D_W, 8);
      const k = pop(t, ch(L, 1), 0.35); if (k > 0) xf(CX, 450, clamp(k), 0, () => sign(CX, 450, 0.72, 'OPEN', Math.sin(t * 2) * 0.04));
      for (let i = 0; i < 6; i++) { const x = 150 + i * 156, e = pop(t, a + 0.15 + i * 0.1, 0.3); if (e <= 0) continue; xf(x, 1200, clamp(e), 0, () => { dotPerson(x, 1200, 150, D_G); text('?', x, 1085 + Math.sin(t * 3 + i) * 8, 62, 900, D_W, 'center'); }); }
      withFade(dIn(t, ch(L, 1) + 1.1), () => text('nobody told them', CX, 1335, 48, 800, D_L, 'center'));
    } },
    // 8 · product beat
    { type: 'art', sfx: [[2, 'notification', 0.22]], draw: dHealth, rows: [['Ava', 94], ['Sam', 81], ['Marcus', 38], ['Priya', 24]], msg: ['Chair’s open Thursday.', 'Come see me.'] },
  ];
  window.REEL = { name: 'heater', who: 'Marcus', scenes: S };
})();
