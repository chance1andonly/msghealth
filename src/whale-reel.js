// MsgHealth · whale · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // sperm-whale silhouette, belly resting at y, nose on the left, about len wide
  const whale = (cx, y, len, col = '#bcbcbc') => {
    const u = len / 800; ctx.save(); ctx.translate(cx, y); ctx.scale(u, u);
    ctx.beginPath(); ctx.moveTo(-400, -40); ctx.bezierCurveTo(-410, -200, -330, -230, -180, -225); ctx.bezierCurveTo(40, -230, 170, -150, 270, -80); ctx.quadraticCurveTo(320, -52, 350, -80); ctx.quadraticCurveTo(372, -150, 430, -170); ctx.quadraticCurveTo(405, -105, 408, -70); ctx.quadraticCurveTo(440, -40, 450, -5); ctx.quadraticCurveTo(390, -5, 350, -40); ctx.quadraticCurveTo(260, 4, 80, 8); ctx.lineTo(-240, 8); ctx.bezierCurveTo(-330, 4, -396, 0, -400, -40); ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    line(-392, -42, -190, -34, '#222', 8); circle(-175, -62, 11, '#111'); ctx.beginPath(); ctx.moveTo(-90, -30); ctx.quadraticCurveTo(-60, 40, 10, 30); ctx.quadraticCurveTo(-30, 0, -30, -36); ctx.closePath(); ctx.fillStyle = '#8a8a8a'; ctx.fill();
    [60, 100, 140].forEach((x) => line(x, -120 + (x - 60) * 0.5, x + 14, -40, 'rgba(0,0,0,0.18)', 6));
    ctx.restore();
  };
  const beach = (t, y = 1130) => {
    for (let r = 0; r < 5; r++) { const yy = y - 330 + r * 56; ctx.beginPath(); for (let x = 0; x <= W; x += 20) { const v = yy + Math.sin(x * 0.02 + t * 1.6 + r) * 7; x ? ctx.lineTo(x, v) : ctx.moveTo(x, v); } ctx.strokeStyle = `rgba(255,255,255,${0.12 + r * 0.03})`; ctx.lineWidth = 4; ctx.stroke(); }
    fillRR(0, y - 40, W, 1380 - y + 40, 0, '#1b1b1b'); line(0, y - 40, W, y - 40, D_D, 4); for (let i = 0; i < 70; i++) circle(hash(i) * W, y + hash(i + 31) * (1360 - y), 3, 'rgba(255,255,255,0.18)');
  };
  const crate = (x, y, w = 150, h = 100) => { fillRR(x, y, w, h, 8, '#e8e8e8'); strokeRR(x, y, w, h, 8, '#000', 5); line(x + 8, y + 22, x + w - 8, y + 22, '#000', 4); line(x + 8, y + h - 22, x + w - 8, y + h - 22, '#000', 4); text('TNT', x + w / 2, y + h / 2 + 3, h * 0.34, 900, '#000', 'center', 0.12); };
  const spark = (t, x, y) => { circle(x, y, 12 + Math.sin(t * 9) * 3, D_W); for (let i = 0; i < 8; i++) { const an = i * Math.PI / 4 + t * 2.4, r = 34 + Math.sin(t * 7 + i) * 10; line(x + Math.cos(an) * 18, y + Math.sin(an) * 18, x + Math.cos(an) * r, y + Math.sin(an) * r, D_L, 4); } };
  const lump = (x, y, r, seed, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); poly(Array.from({ length: 7 }, (_, i) => { const an = i / 7 * Math.PI * 2, k = r * (0.65 + hash(seed + i) * 0.6); return [Math.cos(an) * k, Math.sin(an) * k]; }), hash(seed) > 0.5 ? '#c8c8c8' : '#8f8f8f'); ctx.restore(); };
  // long 1970s sedan, wheels on y; cr = 0..1 crushed roof
  const car = (x, y, cr) => {
    const roof = lerp(-250, -165, cr), dip = lerp(-250, -118, cr);
    ctx.beginPath(); ctx.moveTo(x - 400, y - 60); ctx.lineTo(x - 395, y - 140); ctx.lineTo(x - 210, y - 150); ctx.lineTo(x - 120, y + roof); ctx.lineTo(x + 10, y + dip); ctx.lineTo(x + 130, y + roof + 10 * cr); ctx.lineTo(x + 230, y - 148); ctx.lineTo(x + 400, y - 138); ctx.lineTo(x + 410, y - 60); ctx.closePath(); ctx.fillStyle = D_W; ctx.fill();
    if (cr < 0.5) { poly([[x - 178, y - 154], [x - 108, y - 232], [x - 6, y - 232], [x - 6, y - 154]], '#222'); poly([[x + 14, y - 154], [x + 14, y - 232], [x + 118, y - 232], [x + 196, y - 154]], '#222'); }
    else { line(x - 150, y - 150, x - 70, y - 160, '#222', 14); line(x + 70, y - 150, x + 160, y - 158, '#222', 14); }
    line(x - 380, y - 110, x + 390, y - 108, '#9a9a9a', 6);
    [-255, 265].forEach((dx) => { circle(x + dx, y - 55, 72, '#000'); circle(x + dx, y - 55, 56, '#555'); circle(x + dx, y - 55, 22, D_L); });
  };
  const S = [
    { type: 'art', sfx: [[2, 'transitionHit', 0.35]], draw(t, a, c, L) {
      dHead('FLORENCE, OREGON · 1970'); beach(t); whale(CX + 30, 1090, 840);
      [[130, 1190], [290, 1190], [210, 1092]].forEach(([x, y]) => crate(x, y));
      line(285, 1092, 330, 1030, D_G, 7); spark(t, 340, 1015);
      dStamp('BLOW IT UP', CX, 620, t, ch(L, 1), 104, -0.05);
    } },
    { type: 'art', sfx: [[0, 'pop', 0.5], [1, 'punch', 0.45]], draw(t, a, c, L) {
      dHead('THE PROBLEM'); beach(t); whale(CX, 1090, 880);
      const k = ease.out(seg(t, ch(L, 0), ch(L, 0) + 0.6));
      if (k > 0) { line(90, 760, 90 + 900 * k, 760, D_W, 8); line(90, 725, 90, 795, D_W, 8); line(90 + 900 * k, 725, 90 + 900 * k, 795, D_W, 8); }
      dBig('45 FT', 640, t, ch(L, 0), 150); dStamp('8 TONS', CX, 1240, t, ch(L, 1), 100, 0.04);
      const s = dIn(t, ch(L, 2), 0.5); if (s > 0) [250, 430, 620, 800].forEach((x, i) => { ctx.beginPath(); for (let j = 0; j <= 20; j++) { const y = 860 - j * 6 * s, v = x + Math.sin(j * 0.6 - t * 5 + i) * 16; j ? ctx.lineTo(v, y) : ctx.moveTo(v, y); } ctx.strokeStyle = `rgba(255,255,255,${0.6 * s})`; ctx.lineWidth = 6; ctx.stroke(); });
    } },
    { type: 'art', sfx: [[1, 'pop', 0.4], [2, 'punch', 0.6]], draw(t, a, c, L) {
      dHead('OREGON HIGHWAY DEPT.');
      withFade(dIn(t, a), () => { ctx.save(); ctx.translate(CX, 520); ctx.rotate(Math.PI / 4); fillRR(-92, -92, 184, 184, 16, D_W); strokeRR(-76, -76, 152, 152, 10, '#000', 7); ctx.restore(); text('!', CX, 526, 130, 900, '#000', 'center'); });
      for (let i = 0; i < 20; i++) { const r = Math.floor(i / 5), q = i % 5, k = ease.out(seg(t, ch(L, 1) + i * 0.055, ch(L, 1) + i * 0.055 + 0.3)); if (k <= 0) continue; withFade(k, () => crate(130 + q * 168, 1230 - r * 118 - (1 - k) * 220, 150, 106)); }
      withFade(dIn(t, a + 0.2) * (1 - dIn(t, ch(L, 1) + 0.6)), () => text('THE ANSWER?', CX, 760, 80, 900, D_W, 'center', 0.04));
      dStamp('HALF A TON', CX, 730, t, ch(L, 2), 116, -0.05);
    } },
    { type: 'art', sfx: [[0, 'pop', 0.4], [1, 'swoosh', 0.6]], draw(t, a, c, L) {
      dHead('THE PLAN');
      ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 2; for (let i = 0; i < 11; i++) { line(80, 400 + i * 96, 1000, 400 + i * 96, 'rgba(255,255,255,0.1)', 2); line(80 + i * 92, 400, 80 + i * 92, 1360, 'rgba(255,255,255,0.1)', 2); }
      whale(420, 1100, 460, D_L); withFade(dIn(t, a), () => crate(370, 1120, 100, 70));
      for (let r = 0; r < 5; r++) { ctx.beginPath(); for (let y = 420; y <= 1340; y += 20) { const v = 790 + r * 48 + Math.sin(y * 0.03 + t * 2 + r) * 9; y > 420 ? ctx.lineTo(v, y) : ctx.moveTo(v, y); } ctx.strokeStyle = D_D; ctx.lineWidth = 5; ctx.stroke(); }
      [[-230, 0], [-90, 0.15], [60, 0.3]].forEach(([dy, d]) => { const k = ease.out(seg(t, ch(L, 1) + d, ch(L, 1) + d + 0.8)); if (k <= 0) return; const p = (f) => [lerp(480, 900, f), 940 + dy * f - Math.sin(Math.PI * f) * 260]; ctx.save(); ctx.setLineDash([26, 18]); ctx.beginPath(); for (let f = 0; f <= k; f += 0.02) (f ? ctx.lineTo(...p(f)) : ctx.moveTo(...p(f))); ctx.strokeStyle = D_W; ctx.lineWidth = 9; ctx.stroke(); ctx.restore(); const [x, y] = p(k), [bx, by] = p(Math.max(0, k - 0.04)), an = Math.atan2(y - by, x - bx); poly([[x + Math.cos(an) * 34, y + Math.sin(an) * 34], [x + Math.cos(an + 2.4) * 34, y + Math.sin(an + 2.4) * 34], [x + Math.cos(an - 2.4) * 34, y + Math.sin(an - 2.4) * 34]], D_W); });
      dStamp('OCEAN', 870, 1240, t, ch(L, 2), 64, 0.05);
      withFade(dIn(t, a + 0.3), () => { [130, 190].forEach((x, i) => dMan(x, 1280, 110 - i * 8, D_G)); text('CROWD', 160, 1330, 28, 800, D_G, 'center', 0.1); });
    } },
    { type: 'art', sfx: [[0, 'transitionHit', 0.8], [1, 'punch', 0.5], [2, 'whoosh', 0.7]], draw(t, a, c, L) {
      dHead('A QUARTER MILE BACK'); beach(t); const b = a + 0.15, u = Math.max(0, t - b);
      ctx.save(); ctx.beginPath(); ctx.rect(-60, 385, W + 120, 995); ctx.clip();
      if (t >= b) {
        const f = 1 - seg(t, b, b + 1.0); glow(820, 1030, 200 + 520 * ease.out(seg(t, b, b + 0.8)), '#ffffff', 0.55 * f);
        ring(820, 1030, 60 + 900 * ease.out(seg(t, b, b + 1.1)), `rgba(255,255,255,${0.7 * (1 - seg(t, b, b + 1.1))})`, 10);
        for (let k = 0; k < 9; k++) circle(760 + hash(k) * 200, 1050 - hash(k + 3) * 190 * clamp(u * 2) - u * 18, (40 + hash(k + 6) * 60) * clamp(u * 2.5), 'rgba(200,200,200,0.16)');
        for (let i = 0; i < 26; i++) { const vx = -90 - hash(i + 11) * 620 + (i % 5 === 0 ? 420 : 0), vy = -520 - hash(i + 21) * 640, g = 560, y = 1030 + vy * u + g * u * u / 2, floor = 1110 + hash(i + 40) * 230, end = (-vy + Math.sqrt(vy * vy + 2 * g * (floor - 1030))) / g, uu = Math.min(u, end);
          lump(820 + vx * uu, Math.min(y, u >= end ? floor : y), 24 + hash(i + 2) * 34, i, uu * (hash(i) - 0.5) * 9); }
        for (let i = 0; i < 12; i++) { const u2 = u - 1.0 - i * 0.2; if (u2 <= 0) continue; const x = 90 + hash(i + 61) * 760, y = Math.min(1150 + hash(i + 71) * 180, 340 + u2 * u2 * 560); lump(x, y, 20 + hash(i + 5) * 24, i + 90, Math.min(u2, 1.4) * 4); }
      }
      const run = Math.max(0, t - ch(L, 1) + 0.5);
      [[520, 270, 0], [385, 235, 1.9], [260, 205, 4]].forEach(([x, h, p], i) => dMan(x - Math.min(110, run * (30 + i * 5)), 1300, h, D_W, { arms: 'up', run: run > 0 ? t * 11 + p : p, rot: run > 0 ? -0.12 : 0 }));
      ctx.restore();
    } },
    { type: 'art', sfx: [[1, 'punch', 0.9, 0.35]], draw(t, a, c, L) {
      dHead('THE CAR');
      const hit = ch(L, 1) + 0.35, cr = ease.out(seg(t, hit, hit + 0.22)), fall = seg(t, a + 0.2, hit);
      line(60, 1224, 1020, 1224, D_G, 6); car(CX, 1220, cr);
      const ly = lerp(360, 940, fall * fall) + 100 * cr; lump(CX + 10, ly, 150, 207, fall * 1.8);
      dStamp('BRAND NEW', CX, 520, t, a + 0.15, 82, -0.05); dStamp('CRUSHED', CX, 1320, t, hit + 0.05, 78, 0.04);
      if (t > hit) dDust(t, 200, 900, 680, 340, 30, 0.8 * (1 - seg(t, hit + 0.4, hit + 1.4)), -40);
    } },
    { type: 'art', sfx: [[2, 'ding', 0.6], [3, 'punch', 0.55]], draw(t, a, c, L) {
      dHead('THE CAR DEALER\'S SLOGAN');
      const k = pop(t, ch(L, 2), 0.4);
      withFade(dIn(t, a), () => { line(250, 780, 250, 900, D_G, 16); line(830, 780, 830, 900, D_G, 16); strokeRR(120, 420, 840, 370, 18, D_G, 6); });
      if (k <= 0) withFade(dIn(t, a), () => text('?', CX, 610, 190, 900, D_G, 'center'));
      else xf(CX, 605, clamp(k), 0, () => { fillRR(120, 420, 840, 370, 18, D_W); text('"A WHALE', CX, 540, 128, 900, '#000', 'center', -0.02); text('OF A DEAL"', CX, 690, 118, 900, '#000', 'center', -0.02); });
      line(60, 1280, 1020, 1280, D_G, 6); car(CX, 1276, 1); lump(CX + 10, 1092, 118, 207, 1.8);
      dStamp('NO SHIT.', 720, 905, t, ch(L, 3), 92, -0.09, true);
    } },
    { type: 'art', sfx: [[2, 'punch', 0.45]], draw(t, a, c, L) {
      dHead('YOUR CLIENT LIST');
      for (let i = 0; i < 6; i++) { const q = i % 2, r = Math.floor(i / 2), x = 100 + q * 460, y = 420 + r * 220, k = pop(t, a + 0.1 + i * 0.09, 0.3); if (k <= 0) continue;
        xf(x + 210, y + 90, clamp(k), 0, () => { dotPerson(x + 55, y + 90, 100, D_L); fillRR(x + 120, y + 40, 300, 108, 28, '#e8e8e8'); text('20% OFF!!', x + 270, y + 77, 40, 900, '#000', 'center', 0.02); text('(everybody)', x + 270, y + 119, 27, 600, '#333', 'center'); }); }
      withFade(dIn(t, ch(L, 0)), () => { for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(455 + i * 85, 1210); ctx.rotate((i - 1) * 0.1); fillRR(-34, -95, 68, 190, 14, D_W); text('TNT', 0, 0, 30, 900, '#000', 'center', 0.05); ctx.restore(); } line(540, 1115, 600, 1070, D_G, 7); spark(t, 612, 1058); });
      const k = ease.out(seg(t, ch(L, 2), ch(L, 2) + 0.35)); if (k > 0) { line(140, 430, 140 + 800 * k, 430 + 880 * k, '#fff', 30); line(940, 430, 940 - 800 * k, 430 + 880 * k, '#fff', 30); }
      dStamp('NOPE', CX, 860, t, ch(L, 2) + 0.3, 140, -0.07);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.25]], draw: dHealth, msg: ['Hey, it\'s been a minute.', 'Want your spot back?'] },
  ];
  window.REEL = { name: 'whale', who: 'Marcus', scenes: S };
})();
