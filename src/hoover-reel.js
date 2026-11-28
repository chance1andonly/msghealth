// MsgHealth · hoover (Britain, 1992: buy a vacuum, get two flights to America) · black/white story reel for src/hist.js (drawings use src/doc.js). Plain drawings only, no logos.
(() => {
  // an upright vacuum cleaner, floor at (x, y), about 620 tall at s = 1
  const vac = (x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    line(0, -330, 70, -590, D_L, 30); line(70, -590, 150, -600, D_W, 36); fillRR(-120, -430, 220, 330, 90, D_G); fillRR(-90, -390, 160, 220, 60, '#2c2c2c'); ring(-10, -280, 42, D_W, 10);
    fillRR(-190, -125, 370, 110, 40, D_W); circle(-140, -18, 34, D_D); circle(130, -18, 34, D_D); fillRR(-175, -80, 340, 18, 9, '#999'); ctx.restore(); };
  const plane = (x, y, s = 1, rot = 0, col = D_W) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    fillRR(-170, -26, 340, 52, 26, col); poly([[-20, -20], [-95, -150], [-45, -150], [60, -20]], col); poly([[-20, 20], [-95, 150], [-45, 150], [60, 20]], col); poly([[-140, -18], [-185, -80], [-155, -80], [-100, -18]], col);
    for (let i = 0; i < 6; i++) circle(-70 + i * 34, 0, 6, '#000'); ctx.restore(); };
  const ticket = (x, y, s, rot, label = 'USA') => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); fillRR(-210, -100, 420, 200, 22, D_W); line(80, -84, 80, 84, '#999', 5); text('BOARDING PASS', -60, -52, 28, 900, '#555', 'center', 0.1); text(label, -60, 26, 96, 900, '#000', 'center', 0.04); plane(145, 0, 0.28, -0.5, '#000'); ctx.restore(); };
  const van = (x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fillRR(-250, -300, 360, 250, 24, D_W); poly([[110, -230], [200, -230], [270, -150], [270, -50], [110, -50]], D_W); poly([[135, -210], [192, -210], [244, -148], [135, -148]], '#000'); text('HOOVER', -72, -178, 70, 900, '#000', 'center', 0.04); [-150, 175].forEach((d) => { circle(d, -40, 52, '#000'); ring(d, -40, 44, D_W, 10); circle(d, -40, 12, D_W); }); ctx.restore(); };
  const truck = (x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); poly([[-270, -50], [-270, -150], [-200, -240], [-90, -240], [-90, -50]], D_G); poly([[-248, -148], [-192, -218], [-112, -218], [-112, -148]], '#000'); fillRR(-70, -330, 360, 280, 12, D_D); for (let i = 0; i < 5; i++) line(-30 + i * 70, -310, -30 + i * 70, -80, D_G, 8); [-180, 20, 200].forEach((d) => { circle(d, -40, 56, '#000'); ring(d, -40, 48, D_L, 12); circle(d, -40, 14, D_L); }); ctx.restore(); };
  const crowd = (t, a, n, y, spread) => { for (let i = 0; i < n; i++) { const k = ease.out(seg(t, a - 0.5 + i * 0.06, a + 0.3 + i * 0.06)); if (k <= 0) continue; const tx = 100 + (i % 8) * 120 + (Math.floor(i / 8) % 2) * 36, ty = y - Math.floor(i / 8) * spread; dMan(lerp(tx - 700, tx, k), ty, 230 - Math.floor(i / 8) * 18, [D_W, D_L, D_G][i % 3], { run: k < 1 ? t * 9 + i : Math.sin(t * 3 + i) * 0.25, arms: i % 4 === 0 ? 'up' : undefined }); } };
  const tongue = (x, y, w, h, f, col) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - w * 0.9, y - h * 0.05, x - w * 0.5, y - h * 0.55, x + f, y - h); ctx.bezierCurveTo(x + w * 0.05, y - h * 0.6, x + w * 0.95, y - h * 0.4, x, y); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  const flame = (x, y, h, t, i) => { const w = h * 0.5, f = Math.sin(t * 11 + i * 2) * w * 0.35; tongue(x, y, w, h, f, i % 2 ? '#b4b4b4' : '#e6e6e6'); tongue(x, y, w * 0.5, h * 0.55, -f * 0.5, '#fff'); };
  const bill = (x, y, rot, w = 250) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); fillRR(-w / 2, -w * 0.25, w, w * 0.5, 10, D_L); strokeRR(-w / 2 + 10, -w * 0.25 + 10, w - 20, w * 0.5 - 20, 6, '#000', 4); circle(0, 0, w * 0.15, '#000'); text('£', 0, 2, w * 0.18, 900, '#fff', 'center', 0); ctx.restore(); };
  const seal = (x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); circle(0, 0, 150, D_W); ring(0, 0, 122, '#000', 8); poly([[-80, 40], [-95, -55], [-42, -5], [0, -78], [42, -5], [95, -55], [80, 40]], '#000'); fillRR(-80, 54, 160, 22, 6, '#000'); ctx.restore(); };
  const heart = (x, y, s, col) => { ctx.beginPath(); ctx.moveTo(x, y + s * 0.8); ctx.bezierCurveTo(x - s * 1.4, y - s * 0.2, x - s * 0.6, y - s * 1.1, x, y - s * 0.35); ctx.bezierCurveTo(x + s * 0.6, y - s * 1.1, x + s * 1.4, y - s * 0.2, x, y + s * 0.8); ctx.closePath(); ctx.fillStyle = col; ctx.fill(); };
  const S = [
    { type: 'art', sfx: [[1, 'dimpact', 0.28], [2, 'dwhoosh', 0.22]], draw(t, a, c, L) {
      dHead('BRITAIN · 1992'); line(0, 1220, W, 1220, D_D, 8);
      dBig('2 FLIGHTS', 490, t, -0.4, 210);
      vac(270, 1218, 0.95);
      const bob = Math.sin(t * 3) * 8; ticket(745, 740 + bob, 1.0, -0.08); ticket(765, 1055 - bob, 1.0, 0.06);
      dStamp('FREE', 760, 897, t, ch(L, 1) - 0.1, 66, -0.06, true);
      dStamp('WITH A VACUUM', CX, 1320, t, ch(L, 0) + 0.25, 76, -0.05);
    } },
    { type: 'art', sfx: [[3, 'dcheck', 0.24], [4, 'whoosh', 0.22]], draw(t, a, c, L) {
      dHead('THE OFFER');
      fillRR(130, 420, 820, 800, 26, '#ededed'); strokeRR(160, 450, 760, 740, 14, '#000', 9);
      text('HOOVER', CX, 560, 130, 900, '#000', 'center', 0.06);
      const k = pop(t, ch(L, 3) - 0.1, 0.35); if (k > 0) xf(CX, 760, clamp(k), 0, () => { text('SPEND', CX, 670, 56, 900, '#555', 'center', 0.2); text('£100', CX, 810, 230, 900, '#000', 'center', -0.02); });
      else plane(CX, 800, 1.2, -0.12, '#000');
      const j = pop(t, ch(L, 4) - 0.1, 0.35); if (j > 0) xf(CX, 1040, clamp(j), 0, () => { fillRR(190, 950, 700, 180, 14, '#000'); text('FLY FREE', CX, 1044, 120, 900, '#fff', 'center', 0.04); });
      dStamp('1992', CX, 1320, t, ch(L, 1) + 0.15, 84, -0.04, true);
    } },
    { type: 'art', sfx: [[1, 'dimpact', 0.26], [2, 'dthud', 0.22]], draw(t, a, c, L) {
      dHead('DO THE MATH');
      const k = ease.back(seg(t, ch(L, 1) - 0.1, ch(L, 1) + 0.5)), tilt = 0.2 * k;
      poly([[CX - 90, 1220], [CX, 760], [CX + 90, 1220]], D_D);
      ctx.save(); ctx.translate(CX, 760); ctx.rotate(tilt); line(-380, 0, 380, 0, D_W, 22); ctx.restore(); circle(CX, 760, 28, D_W);
      [[-1, '£100', 'YOU SPEND'], [1, '£600', 'THE FLIGHTS']].forEach(([s, v, lab]) => { const px = CX + s * 330 * Math.cos(tilt), py = 760 + s * 330 * Math.sin(tilt); if (s > 0 && t < ch(L, 1) - 0.1) return; line(px, py, px - 130, py + 150, D_G, 5); line(px, py, px + 130, py + 150, D_G, 5); fillRR(px - 160, py + 150, 320, 190, 18, s > 0 ? D_W : '#2c2c2c'); strokeRR(px - 160, py + 150, 320, 190, 18, D_W, 5); text(v, px, py + 232, 108, 900, s > 0 ? '#000' : '#fff', 'center', 0); text(lab, px, py + 307, 30, 900, s > 0 ? '#444' : D_L, 'center', 0.1); });
      dStamp('DAMN MATH', CX, 480, t, ch(L, 2), 104, -0.06);
    } },
    { type: 'art', sfx: [[0, 'driser', 0.14], [1, 'dcount', 0.18], [2, 'dimpact', 0.26]], draw(t, a, c, L) {
      dHead('EVERYONE WANTED IN');
      crowd(t, a, 24, 1330, 215);
      const n = ease.out(seg(t, ch(L, 1) - 0.1, ch(L, 2) + 0.4)), v = n >= 1 ? 300000 : Math.round(300000 * n / 10000) * 10000;
      if (n > 0) { fillRR(140, 372, 800, 220, 30, '#000'); strokeRR(140, 372, 800, 220, 30, D_W, 6); dNum(v.toLocaleString(), 482, 160); }
      dStamp('BUYERS', CX, 650, t, ch(L, 2) + 0.15, 58, -0.04);
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.2], [2, 'dthud', 0.18], [4, 'dknock', 0.2]], draw(t, a, c, L) {
      dHead('THE HOOPS');
      if (t < ch(L, 2) - 0.1) {
        line(0, 1200, W, 1200, D_D, 8);
        [270, 560, 850].forEach((x, i) => { ring(x, 820, 150, D_W, 22); line(x, 972, x, 1196, D_G, 14); });
        const p = seg(t, a, ch(L, 2) - 0.1), x = lerp(60, 960, p); dMan(x, 900 - Math.abs(Math.sin(p * Math.PI * 3)) * 80, 220, D_L, { arms: 'up', rot: 0.25, run: t * 7 });
        dStamp('HOOPS', CX, 480, t, ch(L, 1), 110, -0.06);
      } else if (t < ch(L, 3) - 0.1) {
        for (let i = 0; i < 9; i++) { const k = pop(t, ch(L, 2) - 0.1 + i * 0.05, 0.25); if (k > 0) { ctx.save(); ctx.translate(330 + (i % 3) * 200 + hash(i) * 60, 560 + Math.floor(i / 3) * 220); ctx.rotate((hash(i + 3) - 0.5) * 0.5); ctx.scale(clamp(k), clamp(k)); fillRR(-120, -150, 240, 300, 10, D_L); text('FORM', 0, -100, 46, 900, '#000', 'center', 0.1); for (let j = 0; j < 5; j++) fillRR(-85, -45 + j * 36, j === 4 ? 90 : 170, 10, 5, '#888'); ctx.restore(); } }
        dStamp('14 DAYS OR ELSE', CX, 1290, t, ch(L, 2) + 0.25, 72, -0.05, true);
      } else {
        // a map: home bottom left, the offered airport far away
        fillRR(100, 400, 880, 800, 30, '#1c1c1c'); strokeRR(100, 400, 880, 800, 30, D_G, 5);
        for (let i = 1; i < 5; i++) { line(100 + i * 176, 410, 100 + i * 176, 1190, '#2c2c2c', 3); line(110, 400 + i * 160, 970, 400 + i * 160, '#2c2c2c', 3); }
        const p = ease.inOut(seg(t, ch(L, 3) - 0.05, ch(L, 4) + 0.3));
        for (let i = 0; i < 26; i++) if (i / 26 < p) circle(lerp(260, 800, i / 26) + Math.sin(i / 26 * 3.14) * 90, lerp(1050, 560, i / 26), 10, D_W);
        circle(260, 1050, 34, D_W); text('HOME', 260, 1130, 50, 900, D_W, 'center', 0.1);
        if (p > 0.95) { plane(800, 540, 0.65, -0.5); text('YOUR AIRPORT', 400, 480, 46, 900, D_W, 'center', 0.08); }
        dStamp('NOWHERE NEAR HOME', CX, 1295, t, ch(L, 4), 62, -0.04);
      }
    } },
    { type: 'art', sfx: [[0, 'dthud', 0.16], [3, 'punch', 0.28]], draw(t, a, c, L) {
      dHead('HE SAYS'); line(0, 1220, W, 1220, D_D, 8);
      const j = Math.sin(t * 38) * 7;
      ctx.save(); ctx.translate(j, 0); fillRR(90, 830, 360, 388, 30, D_W); ring(270, 1050, 110, '#000', 20); circle(270, 1050, 80, '#555'); fillRR(130, 860, 280, 50, 10, '#999'); circle(170, 885, 14, '#000'); ctx.restore();
      dDust(t, 120, 520, 300, 320, 20, 0.7, -70);
      dMan(800, 1218, 480, D_G); fillRR(875, 1000, 130, 90, 14, D_L); strokeRR(915, 975, 50, 28, 8, D_L, 8);
      const k = pop(t, ch(L, 3) - 0.1, 0.35); if (k > 0) xf(770, 580, clamp(k), 0, () => { fillRR(530, 460, 500, 220, 70, '#fff'); poly([[770, 674], [870, 674], [845, 750]], '#fff'); text('IDIOT.', 780, 572, 130, 900, '#000', 'center', 0.02); });
      dStamp('DAVE DIXON', 300, 430, t, ch(L, 1) - 0.1, 58, -0.06, true);
      withFade(1 - seg(t, ch(L, 3) - 0.3, ch(L, 3) - 0.1), () => dStamp('REPAIR GUY', 760, 640, t, ch(L, 2), 54, 0.04));
      dStamp('FOR WANTING TICKETS', CX, 1320, t, ch(L, 4), 54, -0.03);
    } },
    { type: 'art', sfx: [[0, 'dwhoosh', 0.2], [2, 'dhit', 0.24], [4, 'dimpact', 0.26]], draw(t, a, c, L) {
      dHead('THE DRIVEWAY'); line(0, 1190, W, 1190, D_D, 8);
      van(285, 1188, 1.0);
      const d = ease.in(seg(t, a + 0.35, ch(L, 2) + 0.35)); truck(lerp(1500, 778, d), 1188 + shake(t, ch(L, 2) + 0.35, 14, 0.4), 0.9);
      const q = seg(t, ch(L, 3), ch(L, 4) + 0.7), day = Math.max(1, Math.min(13, 1 + Math.floor(q * 13)));
      if (t > ch(L, 3) - 0.1) { const k = pop(t, ch(L, 3) - 0.1, 0.35); xf(CX, 600, clamp(k), 0, () => { fillRR(330, 410, 420, 400, 30, D_W); fillRR(330, 410, 420, 110, 30, D_G); text('DAY', CX, 468, 64, 900, '#000', 'center', 0.2); dNum(String(day), 665, 220, '#000'); }); }
      else dStamp('BLOCKED', CX, 640, t, ch(L, 2) + 0.4, 110, -0.07);
      dStamp('HELD HOSTAGE', CX, 1310, t, ch(L, 4) + 0.25, 76, -0.05, true);
    } },
    { type: 'art', sfx: [[1, 'dimpact', 0.26], [3, 'dthud', 0.22], [4, 'punch', 0.26]], draw(t, a, c, L) {
      dHead('THE DAMAGE');
      if (t < ch(L, 3) - 0.1) {
        for (let i = 0; i < 5; i++) bill(220 + i * 160, 1050 - (i % 2) * 70, (hash(i) - 0.5) * 0.7, 240);
        for (let i = 0; i < 9; i++) flame(150 + i * 98, 1180, 180 + hash(i) * 150, t, i);
        const k = pop(t, ch(L, 1) - 0.1, 0.35); if (k > 0) xf(CX, 560, clamp(k), 0, () => { text('£50,000,000', CX, 530, fit('£50,000,000', 180, 940, 900), 900, D_W, 'center', -0.02); text('UP IN SMOKE', CX, 660, 56, 900, D_G, 'center', 0.16); });
        else dBig('£ ???', 560, t, a - 0.3, 190);
      } else {
        line(0, 1200, W, 1200, D_D, 8);
        const go = ease.in(seg(t, ch(L, 4), VO_AT[L + 1] + 0.4));
        [0, 1, 2].forEach((i) => { const x = 220 + i * 280 + go * 420; dMan(x, 1200, 450, [D_W, D_L, D_G][i], { run: go > 0 ? t * 6 + i : 0 }); fillRR(x - 80, 950, 160, 100, 10, '#555'); strokeRR(x - 80, 950, 160, 100, 10, D_W, 4); });
        dStamp('3 BOSSES', CX, 520, t, ch(L, 3), 120, -0.05, true);
        dStamp('FIRED', CX, 1310, t, ch(L, 4), 130, -0.07);
      }
    } },
    { type: 'art', sfx: [[2, 'dknock', 0.22], [5, 'dhit', 0.24]], draw(t, a, c, L) {
      if (t < ch(L, 3) - 0.1) {
        dHead('1995'); line(0, 1200, W, 1200, D_D, 8);
        fillRR(180, 720, 720, 480, 10, D_G); [[230, 280], [380, 380]].forEach(([x, h]) => fillRR(x, 720 - h, 90, h, 8, D_D));
        for (let i = 0; i < 10; i++) fillRR(235 + (i % 5) * 130, 790 + Math.floor(i / 5) * 140, 76, 86, 6, '#111');
        text('HOOVER EUROPE', CX, 1135, 64, 900, '#000', 'center', 0.04);
        dStamp('SOLD', 660, 640, t, ch(L, 2) - 0.1, 170, -0.12);
      } else {
        dHead('LATER ON');
        const f = ease.in(seg(t, ch(L, 5) - 0.05, ch(L, 5) + 0.8));
        ctx.save(); ctx.translate(CX, 780 + f * 190); ctx.rotate(f * 0.7); seal(0, 0, 1.45); ctx.restore();
        withFade(1 - f, () => text('BY ROYAL APPOINTMENT', CX, 1120, 52, 900, D_L, 'center', 0.1));
        dStamp('REVOKED', CX, 640, t, ch(L, 5), 150, -0.14, true);
        dStamp('ROYAL SEAL', CX, 1320, t, ch(L, 4), 70, -0.03);
      }
    } },
    { type: 'art', sfx: [[1, 'whoosh', 0.2], [4, 'dding', 0.22]], draw(t, a, c, L) {
      dHead('YOUR SHOP');
      for (let i = 0; i < 4; i++) { const x = 140 + i * 265; withFade(dIn(t, a + i * 0.08), () => { dMan(x, 760, 300, D_D); text('?', x, 420, 90, 900, D_G, 'center', 0); }); }
      for (let i = 0; i < 10; i++) { const p = ((t * 0.7 + hash(i)) % 1); bill(lerp(CX, 100 + hash(i + 4) * 880, p), 900 - p * 360 - Math.sin(p * 3.14) * 80, p * 5 + i, 100); }
      dStamp('STRANGERS', CX, 860, t, ch(L, 1), 60, -0.04, true);
      line(80, 940, 1000, 940, D_D, 6);
      const k = dIn(t, ch(L, 3) - 0.15, 0.4); for (let i = 0; i < 5; i++) { const x = 130 + i * 205; dMan(x, 1330, 270, k > 0 ? D_W : D_G, { arms: t > ch(L, 4) ? 'up' : undefined, run: Math.sin(t * 3 + i) * 0.2 }); const h = pop(t, ch(L, 4) - 0.1 + i * 0.1, 0.3); if (h > 0) xf(x, 1015, clamp(h), 0, () => heart(x, 1015, 38, D_W)); }
    } },
    { type: 'art', sfx: [[2, 'dmsg', 0.22]], msg: ['Been a while.', 'Want your usual spot?'], draw(t, a, c, L) { dHealth(t, a, c, L); } },
  ];
  window.REEL = { name: 'hoover', who: 'Marcus', scenes: S };
})();
