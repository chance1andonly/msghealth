// MsgHealth · penney (J.C. Penney drops coupons, 2012-2013) · black/white story reel for src/hist.js (drawings use src/doc.js). Plain drawings only, no logos.
(() => {
  const store = (x, y, s = 1, lit = true) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    fillRR(-400, -520, 800, 520, 14, '#2a2a2a'); fillRR(-430, -560, 860, 60, 10, D_G); fillRR(-340, -465, 680, 130, 16, '#fff'); text('J.C. PENNEY', 0, -398, 82, 900, '#000', 'center', 0.03);
    [-290, 70].forEach((d) => { fillRR(d, -290, 220, 190, 8, lit ? '#d8d8d8' : '#111'); strokeRR(d, -290, 220, 190, 8, D_G, 8); });
    fillRR(-52, -230, 104, 230, 6, '#000'); strokeRR(-52, -230, 104, 230, 6, D_G, 8); ctx.restore(); };
  const bill = (x, y, rot, a = 1) => withFade(a, () => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-70, -36, 140, 72, 8, D_L); ring(0, 0, 22, '#000', 5); text('$', 0, 2, 34, 900, '#000', 'center', 0); ctx.restore(); });
  const coupon = (x, y, label, rot = 0) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-190, -105, 380, 210, 16, D_W); ctx.setLineDash([20, 14]); strokeRR(-170, -86, 340, 172, 10, '#000', 6); ctx.setLineDash([]); text(label, 0, -10, 84, 900, '#000', 'center', 0); text('COUPON', 0, 56, 34, 800, '#555', 'center', 0.2); ctx.restore(); };
  const cross = (x, y, s, k) => { if (k <= 0) return; line(x - s, y - s, x - s + 2 * s * clamp(k * 2), y - s + 2 * s * clamp(k * 2), D_W, 34); if (k > 0.5) line(x + s, y - s, x + s - 2 * s * clamp(k * 2 - 1), y - s + 2 * s * clamp(k * 2 - 1), D_W, 34); };
  const S = [
    { type: 'art', sfx: [[1, 'whoosh', 0.22], [2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('ONE BRIGHT IDEA'); line(0, 1180, W, 1180, D_D, 8);
      store(CX, 1180, 1);
      for (let i = 0; i < 16; i++) { const p = (t * 0.6 + hash(i)) % 1; bill(120 + hash(i + 20) * 840 + Math.sin(t * 2 + i) * 30, 575 - p * 180, Math.sin(t * 3 + i) * 0.5, 1 - p); }
      dStamp('−$4 BILLION', CX, 1300, t, ch(L, 2) - 0.1, 96, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dding', 0.2]], draw(t, a, c, L) {
      dHead('THE NEW BOSS'); line(0, 1250, W, 1250, D_D, 8);
      fillRR(330, 1070, 420, 180, 12, '#333'); text('CEO', CX, 1162, 84, 900, D_W, 'center', 0.12);
      dMan(CX, 1070, 520, D_L, { arms: 'up', run: t * 2 }); poly([[CX - 13, 775], [CX + 13, 775], [CX + 22, 848], [CX, 878], [CX - 22, 848]], '#000');
      [[230, 560], [850, 500], [190, 860], [900, 840]].forEach(([x, y], i) => { const e = pop(t, a + 0.3 + i * 0.22, 0.3); if (e > 0) xf(x, y, clamp(e), 0, () => star(x, y, 46 + Math.sin(t * 6 + i) * 8, D_W)); });
      dStamp('HOTSHOT', CX, 415, t, ch(L, 1), 90, -0.05);
      dStamp('APPLE STORES', CX, 1325, t, ch(L, 2), 70, 0.03, true);
    } },
    { type: 'art', sfx: [[1, 'dtype', 0.18], [3, 'dimpact', 0.28]], draw(t, a, c, L) {
      dHead('2012');
      [['20% OFF', 310, 520, -0.12], ['$10 OFF', 770, 560, 0.1], ['30% OFF', 330, 860, 0.08], ['$5 OFF', 760, 900, -0.09]].forEach(([s, x, y, r], i) => { const e = pop(t, a + 0.05 + i * 0.12, 0.3), die = seg(t, ch(L, 1) + i * 0.18, ch(L, 1) + 0.35 + i * 0.18); if (e > 0) xf(x, y, clamp(e), 0, () => { withFade(1 - die * 0.6, () => coupon(x, y, s, r)); cross(x, y, 110, die); }); });
      dStamp('COUPONS: DEAD', CX, 1180, t, ch(L, 1) + 0.75, 84, -0.05);
      dStamp('SALES TOO', CX, 1320, t, ch(L, 3) - 0.1, 66, 0.04, true);
    } },
    { type: 'art', sfx: [[2, 'dthud', 0.22], [3, 'punch', 0.24]], draw(t, a, c, L) {
      dHead('THE NEW PLAN');
      ctx.save(); ctx.translate(CX, 690); ctx.rotate(-0.04 + Math.sin(t * 1.8) * 0.015); poly([[-400, -230], [230, -230], [420, 0], [230, 230], [-400, 230]], D_W); circle(270, 0, 34, '#000'); text('EVERYDAY', -90, -80, 100, 900, '#000', 'center', 0.02); text('LOW', -90, 40, 100, 900, '#000', 'center', 0.02); text('PRICES', -90, 150, 84, 900, '#000', 'center', 0.02); ctx.restore();
      dStamp('NO CLIPPING', CX, 1060, t, ch(L, 2), 62, -0.04, true); dStamp('NO WAITING', CX, 1175, t, ch(L, 2) + 0.55, 62, 0.04, true);
      dStamp('NO B.S.', CX, 1305, t, ch(L, 3), 78, -0.05);
    } },
    { type: 'art', sfx: [[1, 'dwhooshsoft', 0.24]], draw(t, a, c, L) {
      dHead('THE REGULARS'); line(0, 1180, W, 1180, D_D, 8);
      store(330, 1180, 0.74, t < ch(L, 2));
      for (let i = 0; i < 5; i++) { const k = seg(t, a + 0.1 + i * 0.3, a + 2.2 + i * 0.3), x = lerp(330, 1180, ease.inOut(k)); if (k > 0 && k < 1) withFade(clamp(k * 6) * (1 - seg(k, 0.82, 1)), () => dMan(x, 1180, 330 - (i % 2) * 40, i % 2 ? D_G : D_L, { run: t * 8 + i * 2 })); }
      dStamp('QUIETLY', CX, 500, t, ch(L, 1), 96, -0.05, true); dStamp('GONE', CX, 1305, t, ch(L, 2) + 0.2, 120, 0.04);
    } },
    { type: 'art', sfx: [[1, 'dcount', 0.18], [2, 'dimpact', 0.3]], draw(t, a, c, L) {
      dHead('ONE YEAR LATER'); line(120, 1170, 960, 1170, D_G, 8);
      const g = ease.out(seg(t, a + 0.1, a + 0.7)), f = ease.inOut(seg(t, ch(L, 1) - 0.1, ch(L, 2) + 0.25));
      fillRR(200, 1170 - 640 * g, 280, 640 * g, 12, D_G); const h2 = lerp(640, 482, f) * g; fillRR(600, 1170 - h2, 280, h2, 12, D_W);
      withFade(dIn(t, a + 0.4), () => { text('$17.3B', 340, 475, 70, 900, D_G, 'center', 0); text('$13.0B', 740, 1170 - h2 - 55, 70, 900, D_W, 'center', 0); text('2011', 340, 1228, 52, 800, D_G, 'center', 0.1); text('2012', 740, 1228, 52, 800, D_W, 'center', 0.1); });
      dStamp('ALMOST −25%', CX, 1330, t, ch(L, 2) + 0.15, 76, -0.04);
    } },
    { type: 'art', sfx: [[1, 'dcount', 0.2]], draw(t, a, c, L) {
      dHead('THE DAMAGE');
      const k = ease.out(seg(t, a + 0.1, ch(L, 1) + 0.9)), v = k >= 1 ? 985 : Math.round(985 * k / 5) * 5;
      dNum('−$' + v, 700, 270); withFade(dIn(t, a + 0.3), () => text('MILLION', CX, 920, 140, 900, D_L, 'center', 0.06));
      for (let i = 0; i < 12; i++) { const p = (t * 0.5 + hash(i)) % 1; bill(100 + hash(i + 40) * 880, 1080 + p * 240, p * 5 + i, 1 - p); }
      dStamp('LOST IN 2012', CX, 440, t, ch(L, 0) + 0.2, 62, -0.04, true);
    } },
    { type: 'art', sfx: [[2, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('APRIL 2013'); line(0, 1200, W, 1200, D_D, 8);
      fillRR(620, 450, 340, 750, 12, '#2c2c2c'); fillRR(665, 500, 250, 700, 8, '#000'); strokeRR(665, 500, 250, 700, 8, D_G, 10); text('EXIT', 790, 405, 64, 900, D_W, 'center', 0.1);
      const k = ease.inOut(seg(t, ch(L, 1) - 0.15, VO_AT[L + 1] - 0.1)); const x = lerp(230, 760, k); withFade(1 - seg(k, 0.85, 1), () => { dMan(x, 1200, 520, D_L, { run: k > 0 && k < 1 ? t * 8 : 0 }); fillRR(x - 170, 960, 120, 90, 8, D_G); fillRR(x - 150, 930, 30, 34, 4, D_W); });
      dStamp('OUT', 330, 560, t, ch(L, 2) + 0.05, 170, -0.1);
    } },
    { type: 'art', sfx: [[2, 'dding', 0.2], [3, 'dding', 0.16]], draw(t, a, c, L) {
      dHead('MAY 2013');
      line(360, 420, 500, 540, D_G, 14); line(720, 420, 580, 540, D_G, 14);
      fillRR(90, 530, 900, 640, 50, D_L); fillRR(130, 570, 820, 560, 30, '#0c0c0c'); line(280, 1170, 230, 1260, D_G, 22); line(800, 1170, 850, 1260, D_G, 22);
      const p = seg(t, a + 0.15, a + 0.5); withFade(p * (1 - seg(t, ch(L, 3) - 0.05, ch(L, 3) + 0.05)), () => { text('NEW', CX, 790, 90, 900, D_G, 'center', 0.12); text('COMMERCIAL', CX, 915, 90, 900, D_G, 'center', 0.06); });
      const k1 = pop(t, ch(L, 3) - 0.05, 0.25); if (k1 > 0) xf(CX, 760, clamp(k1), 0, () => text('COME BACK.', CX, 760, 124, 900, D_W, 'center', -0.02));
      const k2 = pop(t, ch(L, 4), 0.35); if (k2 > 0) xf(CX, 940, clamp(k2), 0, () => text('WE HEARD YOU.', CX, 940, 96, 900, D_W, 'center', -0.02));
      dStamp('PLEASE', CX, 1320, t, ch(L, 4) + 0.5, 70, -0.05);
    } },
    { type: 'art', sfx: [[1, 'dthud', 0.22], [2, 'whoosh', 0.16]], draw(t, a, c, L) {
      dHead('YOUR CHAIR'); line(0, 1300, W, 1300, D_D, 8);
      fillRR(150, 900, 260, 60, 20, D_L); fillRR(150, 700, 70, 230, 22, D_L); fillRR(268, 955, 40, 250, 8, D_G); fillRR(178, 1195, 220, 36, 14, D_G); line(340, 960, 430, 1110, D_G, 26);
      const k = ease.inOut(seg(t, ch(L, 2) - 0.3, VO_AT[L + 1])); withFade(1 - seg(k, 0.82, 1), () => dMan(lerp(520, 1010, k), 1300, 440, D_W, { run: k > 0 && k < 1 ? t * 8 : 0 }));
      dStamp('NO TV AD', 360, 520, t, ch(L, 1) - 0.05, 82, -0.06); dStamp('NOT A WORD', 640, 660, t, ch(L, 3) + 0.05, 70, 0.05, true);
    } },
    { type: 'art', sfx: [[3, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'penney', who: 'Marcus', scenes: S };
})();
