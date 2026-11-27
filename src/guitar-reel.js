// MsgHealth · guitar (Dave Carroll, "United Breaks Guitars", 2008-2009) · black/white story reel for src/hist.js (drawings use src/doc.js)
(() => {
  const guitar = (x, y, s, rot, o = {}) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); const col = o.col || D_L;
    fillRR(-22, -300, 44, 250, 8, D_G); fillRR(-40, -360, 80, 78, 14, col); [-1, 1].forEach((d) => [0, 1, 2].forEach((i) => circle(d * 52, -345 + i * 26, 9, D_G)));
    circle(0, -35, 92, col); circle(0, 100, 130, col); circle(0, 20, 42, '#000'); fillRR(-55, 135, 110, 20, 6, '#000'); [-9, 0, 9].forEach((d) => line(d, -300, d, 140, '#555', 3));
    if (o.crack) { const Z = [[-145, 150], [-85, 118], [-45, 178], [0, 108], [45, 182], [90, 122], [145, 160]]; ctx.save(); ctx.beginPath(); Z.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.lineTo(160, 260); ctx.lineTo(-160, 260); ctx.closePath(); ctx.fillStyle = '#000'; ctx.fill(); ctx.translate(26, 62); ctx.rotate(0.1); ctx.beginPath(); Z.forEach(([px, py], i) => (i ? ctx.lineTo(px * 0.86, py) : ctx.moveTo(px * 0.86, py))); ctx.quadraticCurveTo(70, 262, 0, 262); ctx.quadraticCurveTo(-90, 262, -125, 150); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); line(-45, 150, -95, 30, '#000', 9); line(45, 150, 62, 40, '#000', 9); [[-175, 215], [180, 190], [-120, 285]].forEach(([px, py]) => poly([[px, py], [px + 34, py + 8], [px + 8, py + 30]], col)); }
    ctx.restore(); };
  const note = (x, y, s) => { ellipse(x, y, 22 * s, 16 * s, D_W, -0.4); line(x + 19 * s, y - 4 * s, x + 19 * s, y - 78 * s, D_W, 8 * s); line(x + 19 * s, y - 78 * s, x + 48 * s, y - 60 * s, D_W, 10 * s); };
  const desk = (x, y) => { fillRR(x - 150, y, 300, 220, 12, '#262626'); fillRR(x - 168, y - 18, 336, 34, 8, D_G); };
  const S = [
    { type: 'art', sfx: [[2, 'whoosh', 0.24], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('CHICAGO · 2008');
      fillRR(110, 400, 860, 880, 330, '#101010'); line(130, 1140, 950, 1140, D_D, 10);
      dMan(270, 1140, 380, D_G, { arms: 'up', run: t * 4 }); dMan(830, 1140, 380, D_G, { arms: 'up', run: t * 4 + 2 });
      const p = (t * 0.85 + 0.42) % 1, x = lerp(300, 790, p), y = 870 - Math.sin(p * Math.PI) * 150; guitar(x, y, 0.62, p * 6.8);
      strokeRR(110, 400, 860, 880, 330, D_W, 22);
      dStamp('NOT FOOTBALLS', CX, 1300, t, ch(L, 3) + 0.05, 70, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dding', 0.2], [3, 'dimpact', 0.3]], draw(t, a, c, L) {
      dHead('ONE WAS DAVE’S');
      const hit = ch(L, 3), j = t > hit ? shake(t, hit, 24, 0.4) : 0;
      guitar(340 + j, 860, 1.2, -0.18, { crack: t > hit });
      const k = pop(t, ch(L, 1) - 0.05, 0.4); if (k > 0) xf(760, 640, clamp(k), 0, () => { text('$3,500', 760, 640, 140, 900, D_W, 'center', -0.03); text('GUITAR', 760, 755, 52, 800, D_G, 'center', 0.16); });
      dStamp('SMASHED', 760, 1000, t, hit + 0.04, 92, -0.08);
    } },
    { type: 'art', sfx: [[2, 'dthud', 0.26]], draw(t, a, c, L) {
      dHead('AT THE AIRPORT');
      [220, 540, 860].forEach((x, i) => { dMan(x, 1160, 430, i === 1 ? D_L : D_G); desk(x, 1040); const k = pop(t, ch(L, 2) + i * 0.22, 0.3); if (k > 0) xf(x, 590, clamp(k), 0, () => { fillRR(x - 105, 520, 210, 140, 36, '#fff'); poly([[x - 20, 655], [x + 30, 655], [x - 5, 705]], '#fff'); text('NOPE', x, 592, 58, 900, '#000', 'center', 0.02); }); withFade(dIn(t, ch(L, 0) + i * 0.3), () => text(String(i + 1), x, 1150, 90, 900, D_W, 'center', 0)); });
      dStamp('0 FOR 3', CX, 440 + 880, t, ch(L, 2) + 0.7, 84, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'dcount', 0.2], [2, 'pop', 0.24]], draw(t, a, c, L) {
      dHead('THE RUNAROUND');
      const k = seg(t, a + 0.2, ch(L, 2) - 0.1), n = Math.max(1, Math.ceil(9 * k));
      for (let i = 0; i < 9; i++) { const x = 150 + (i % 3) * 270, y = 420 + Math.floor(i / 3) * 215, on = i < n && t > a + 0.2; fillRR(x, y, 240, 190, 24, on ? '#fff' : 'rgba(255,255,255,0.07)'); text('MONTH', x + 120, y + 48, 30, 800, on ? '#000' : '#777', 'center', 0.12); text(String(i + 1), x + 120, y + 124, 90, 900, on ? '#000' : '#777', 'center', 0); }
      dStamp('$1,200 REPAIR', CX, 1215, t, ch(L, 2) + 0.02, 90, -0.04, true);
    } },
    { type: 'art', sfx: [[0, 'dthud', 0.3], [2, 'dding', 0.18]], draw(t, a, c, L) {
      dHead('THE ANSWER');
      ctx.save(); ctx.translate(CX, 690); ctx.rotate(-0.025); fillRR(-340, -300, 680, 600, 16, '#ececec'); text('DAMAGE CLAIM', 0, -225, 54, 900, '#000', 'center', 0.1); for (let i = 0; i < 6; i++) fillRR(-280, -145 + i * 66, i % 2 ? 400 : 560, 16, 8, '#aaa'); ctx.restore();
      dStamp('NO.', CX, 700, t, ch(L, 0) + 0.45, 220, -0.14, true);
      const k = pop(t, ch(L, 1), 0.35); if (k > 0) xf(CX, 1180, clamp(k), 0, () => { ring(250, 1180, 105, D_W, 14); line(250, 1180, 250 + Math.sin(t * 7) * 70, 1180 - Math.cos(t * 7) * 70, D_W, 12); line(250, 1180, 295, 1180, D_W, 14); text('24 HOURS', 660, 1150, 104, 900, D_W, 'center', -0.02); text('TOO LATE', 660, 1250, 54, 800, D_G, 'center', 0.16); });
    } },
    { type: 'art', sfx: [[2, 'dimpact', 0.28]], draw(t, a, c, L) {
      dHead('SO HE WROTE ONE'); line(0, 1140, W, 1140, D_D, 8);
      dMan(430, 1140, 560, D_L, { rot: Math.sin(t * 4) * 0.05 }); guitar(480, 850 + Math.sin(t * 8) * 6, 0.72, 0.95, { col: D_W });
      for (let i = 0; i < 6; i++) { const p = (t * 0.55 + i / 6) % 1; withFade(1 - p, () => note(660 + p * 280 + Math.sin(p * 9 + i) * 40, 760 - p * 330 + (i % 3) * 60, 1.1)); }
      dStamp('“UNITED BREAKS GUITARS”', CX, 1280, t, ch(L, 2) + 0.02, 56, -0.03);
    } },
    { type: 'art', sfx: [[2, 'driser', 0.16]], draw(t, a, c, L) {
      dHead('JULY 2009');
      fillRR(100, 420, 880, 560, 30, '#161616'); strokeRR(100, 420, 880, 560, 30, D_W, 8);
      dMan(330, 900, 320, D_G); guitar(360, 735, 0.4, 0.95);
      circle(CX + 90, 690, 100, 'rgba(255,255,255,0.92)'); poly([[CX + 60, 630], [CX + 60, 750], [CX + 160, 690]], '#000');
      const bar = ease.out(seg(t, a, VO_AT[L + 1])); fillRR(140, 925, 800, 16, 8, '#444'); fillRR(140, 925, 800 * bar, 16, 8, D_W);
      const k = ease.in(seg(t, ch(L, 0), ch(L, 2) + 0.4)), v = Math.round(3000000 * k / 1000) * 1000;
      text(v.toLocaleString() + (k >= 1 ? '+' : ''), CX, 1115, 160, 900, D_W, 'center', -0.03); text('VIEWS', CX, 1240, 56, 800, D_G, 'center', 0.2);
    } },
    { type: 'art', sfx: [[0, 'dding', 0.24], [3, 'pop', 0.22]], draw(t, a, c, L) {
      dHead('NOW THEY CALL');
      const go = ch(L, 2) - 0.1;
      withFade(1 - dIn(t, go, 0.25), () => { const j = Math.sin(t * 13) * 4; fillRR(300 + j, 400, 480, 840, 60, '#161616'); strokeRR(300 + j, 400, 480, 840, 60, D_W, 8); text('UNITED', CX + j, 560, 88, 900, D_W, 'center', 0.04); text('calling…', CX + j, 650, 46, 600, D_G, 'center', 0); circle(CX + j, 880, 120, D_W); text('SORRY', CX + j, 882, 52, 900, '#000', 'center', 0.04); });
      withFade(dIn(t, go), () => { fillRR(150, 420, 780, 500, 20, '#fff'); fillRR(190, 460, 700, 420, 12, '#161616'); dMan(390, 850, 260, D_G); guitar(420, 715, 0.32, 0.95); poly([[610, 590], [610, 750], [740, 670]], D_W); [170, 360, 560, 750, 920].forEach((x, i) => { circle(x, 1120 + (i % 2) * 45, 52, i % 2 ? D_G : D_L); fillRR(x - 75, 1175 + (i % 2) * 45, 150, 130, 50, i % 2 ? D_G : D_L); }); });
      dStamp('STAFF TRAINING', CX, 975, t, ch(L, 3) + 0.05, 80, -0.04, true);
    } },
    { type: 'art', sfx: [[2, 'whoosh', 0.18]], draw(t, a, c, L) {
      dHead('YOUR CHAIR'); line(0, 1300, W, 1300, D_D, 8);
      fillRR(150, 900, 260, 60, 20, D_L); fillRR(150, 700, 70, 230, 22, D_L); fillRR(268, 955, 40, 250, 8, D_G); fillRR(178, 1195, 220, 36, 14, D_G); line(340, 960, 430, 1110, D_G, 26);
      fillRR(760, 640, 270, 660, 10, '#262626'); fillRR(805, 780, 180, 520, 8, '#000'); strokeRR(805, 780, 180, 520, 8, D_G, 8); text('OTHER SHOP', 895, 710, 38, 900, D_W, 'center', 0.02);
      const k = ease.inOut(seg(t, ch(L, 2) - 0.3, VO_AT[L + 1])); withFade(1 - seg(k, 0.82, 1), () => dMan(lerp(480, 890, k), 1300, 440, D_W, { run: k > 0 && k < 1 ? t * 8 : 0 }));
      dStamp('NO SONG', 330, 520, t, ch(L, 1) - 0.05, 82, -0.06); dStamp('JUST GONE', 390, 635, t, ch(L, 3) + 0.05, 74, 0.05, true);
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'guitar', who: 'Marcus', scenes: S };
})();
