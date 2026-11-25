// MsgHealth · headless · black/white documentary story reel for src/hist.js (drawings use src/doc.js)
(() => {
  // a rooster with no head (clean, cartoon neck end), feet at (x, y). s = scale, w = walk phase
  const bird = (x, y, s = 1, w = 0, rot = 0, head = false) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    [[-45, 0], [55, Math.PI]].forEach(([dx, p]) => { const sw = Math.sin(w + p) * 34, lift = Math.max(0, Math.sin(w + p + 1.4)) * (w ? 24 : 0); line(dx, -150, dx + sw, -8 - lift, '#a8a8a8', 20); [-30, 4, 36].forEach((tx) => line(dx + sw, -8 - lift, dx + sw + tx - 8, 2 - lift, '#a8a8a8', 13)); });
    const bob = Math.sin(w * 2) * (w ? 7 : 0); ctx.translate(0, bob);
    [[-0.95, 250], [-0.62, 285], [-0.3, 255]].forEach(([an, len], i) => { ctx.beginPath(); ctx.moveTo(110, -250); ctx.quadraticCurveTo(150 + Math.cos(an) * len * 0.5, -250 + Math.sin(an) * len, 110 + Math.cos(an) * len, -250 + Math.sin(an) * len * 0.75); ctx.quadraticCurveTo(190 + i * 8, -240, 130, -190); ctx.closePath(); ctx.fillStyle = i % 2 ? '#bdbdbd' : '#dedede'; ctx.fill(); });
    ellipse(0, -240, 185, 122, D_W, -0.12);
    ctx.beginPath(); ctx.moveTo(-175, -262); ctx.quadraticCurveTo(-205, -345, -188, -415); ctx.lineTo(-108, -420); ctx.quadraticCurveTo(-105, -350, -55, -330); ctx.closePath(); ctx.fillStyle = D_W; ctx.fill();
    if (head) { circle(-160, -455, 62, D_W); [[-190, -515, 20], [-160, -528, 24], [-128, -515, 20]].forEach(([cx, cy, r]) => circle(cx, cy, r, '#8f8f8f')); poly([[-214, -468], [-282, -446], [-212, -432]], '#bdbdbd'); circle(-180, -466, 9, '#000'); ellipse(-196, -398, 15, 30, '#8f8f8f', 0.15); }
    else ellipse(-148, -418, 42, 15, '#6a6a6a', -0.05);
    ctx.beginPath(); ctx.moveTo(-80, -270); ctx.quadraticCurveTo(40, -300, 140, -225); ctx.quadraticCurveTo(40, -150, -70, -200); ctx.closePath(); ctx.fillStyle = '#c9c9c9'; ctx.fill();
    [[-40, -235, 100, -222], [-45, -210, 75, -196]].forEach((p) => line(...p, '#8f8f8f', 6));
    ctx.restore();
  };
  const spot = (x = CX, y = 1250) => { ctx.beginPath(); ctx.moveTo(x - 90, 380); ctx.lineTo(x + 90, 380); ctx.lineTo(x + 420, y); ctx.lineTo(x - 420, y); ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill(); ellipse(x, y, 420, 62, 'rgba(255,255,255,0.14)'); };
  const tent = (a = 1) => withFade(a, () => { for (let i = 0; i < 8; i++) poly([[CX, 380], [i * 135, 620], [(i + 1) * 135, 620]], i % 2 ? '#2b2b2b' : '#151515'); for (let i = 0; i < 8; i++) { circle(i * 135 + 67, 620, 66, i % 2 ? '#2b2b2b' : '#151515'); } });
  const S = [
    { type: 'art', sfx: [[1, 'punch', 0.5]], draw(t, a, c, L) {
      dHead('FRUITA, COLORADO'); spot(); const x = CX + 10 + Math.sin(t * 1.1) * 90; bird(x, 1240, 1.25, t * 6);
      const m = Math.round(18 * ease.inOut(seg(t, ch(L, 1) - 0.1, ch(L, 2) + 0.4)));
      withFade(dIn(t, ch(L, 1) - 0.2), () => { text(String(m), CX - 150, 500, 220, 900, D_W, 'center', -0.04); text('MONTHS', CX + 190, 520, 76, 900, D_W, 'center', 0.04); });
      dStamp('NO HEAD', 780, 700, t, ch(L, 2), 74, 0.08);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.25]], draw(t, a, c, L) {
      dHead('SEPTEMBER 10, 1945'); spot();
      const hit = ch(L, 1) - 0.1, sw = ease.in(seg(t, hit - 0.45, hit)), gone = dIn(t, hit + 0.35, 0.4);
      const up = ease.back(seg(t, ch(L, 2) - 0.1, ch(L, 2) + 0.5)), w = seg(t, ch(L, 2) + 0.5, ch(L, 2) + 0.6) > 0 ? (t - ch(L, 2)) * 6 : 0;
      if (t < hit) bird(CX + 60, 1240, 1.0, 0, 0, true); else bird(CX + 60 + Math.max(0, t - ch(L, 2) - 0.5) * 55, 1240 - (1 - up) * 20, 1.0, w, -1.15 * (1 - up));
      withFade(1 - gone, () => { ctx.save(); ctx.translate(930, 880); ctx.rotate(lerp(1.15, 0.08, sw)); line(0, 0, -440, 0, '#9a9a9a', 30); poly([[-505, -40], [-420, -55], [-420, 20], [-455, 95], [-520, 70]], D_L); ctx.restore(); });
      dStamp('HE GOT UP', CX, 540, t, ch(L, 2) + 0.15, 100, -0.05);
    } },
    { type: 'art', sfx: [[1, 'pop', 0.2], [2, 'ding', 0.2]], draw(t, a, c, L) {
      dHead('WHY HE LIVED'); bird(CX + 40, 880, 0.9, 0); ring(CX - 93, 504, 62 + Math.sin(t * 4) * 5, D_W, 6);
      [['JUGULAR VEIN', 'MISSED', ch(L, 0)], ['BRAIN STEM', 'MOSTLY THERE', ch(L, 1)], ['BLOOD CLOT', 'PLUGGED IT', ch(L, 2)]].forEach(([n, v, at], i) => {
        const k = dIn(t, at, 0.35), y = 930 + i * 150; if (k <= 0) return;
        ctx.save(); ctx.globalAlpha *= k; ctx.translate((1 - k) * 140, 0); fillRR(90, y, 900, 124, 20, 'rgba(255,255,255,0.08)'); strokeRR(90, y, 900, 124, 20, D_G, 3); fillRR(116, y + 26, 72, 72, 14, D_W); check(152, y + 62, 40, '#000', 9); text(n, 220, y + 66, 40, 800, D_W, 'left', 0.04); text(v, 960, y + 66, 38, 900, D_L, 'right', 0.02); ctx.restore(); });
    } },
    { type: 'art', sfx: [[0, 'pop', 0.5], [1, 'swoosh', 0.5], [2, 'ding', 0.6]], draw(t, a, c, L) {
      dHead('ON TOUR'); const tour = dIn(t, ch(L, 1), 0.5); tent(tour); spot(); bird(CX, 1250, 1.05, t < ch(L, 1) ? 0 : t * 4);
      withFade(dIn(t, a) * (1 - dIn(t, ch(L, 1) + 0.2)), () => { ctx.save(); ctx.translate(CX - 155, 690); ctx.rotate(0.05); fillRR(-34, -230, 68, 200, 20, 'rgba(255,255,255,0.25)'); strokeRR(-34, -230, 68, 200, 20, D_W, 7); ellipse(0, -250, 54, 46, D_W); poly([[-26, -30], [26, -30], [8, 60], [-8, 60]], D_W); ctx.restore(); const d = ((t - a) * 1.5) % 1; circle(CX - 158, 770 + d * 60, 14 * (1 - d * 0.4), `rgba(255,255,255,${1 - d})`); });
      const k = pop(t, ch(L, 2), 0.4); if (k > 0) xf(CX, 760, clamp(k), 0, () => { ctx.save(); ctx.translate(CX, 760); ctx.rotate(-0.06); fillRR(-330, -115, 660, 230, 16, D_W); ctx.save(); ctx.setLineDash([14, 12]); strokeRR(-305, -92, 610, 184, 8, '#000', 5); ctx.restore(); circle(-330, 0, 34, '#000'); circle(330, 0, 34, '#000'); text('ADMIT ONE', 0, -40, 52, 900, '#000', 'center', 0.14); text('25¢', 0, 48, 96, 900, '#000', 'center'); ctx.restore(); });
    } },
    { type: 'art', sfx: [[2, 'punch', 0.7]], draw(t, a, c, L) {
      dHead('AT HIS PEAK'); spot();
      const m = dIn(t, ch(L, 1), 0.6); for (let i = 0; i < 20; i++) { const y = 380 + ((hash(i + 4) * 900 + (t - a) * (150 + hash(i) * 120)) % 900), x = 70 + hash(i + 9) * 940; withFade(m * 0.75 * (1 - seg(y, 1180, 1278)), () => { ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2 + i) * 0.5); fillRR(-46, -25, 92, 50, 6, '#6e6e6e'); strokeRR(-36, -17, 72, 34, 4, D_L, 2); text('$', 0, 2, 30, 900, D_W, 'center'); ctx.restore(); }); }
      bird(CX, 1260, 1.05, t * 3);
      dBig('$4,500', 540, t, ch(L, 2), 270); withFade(dIn(t, ch(L, 2) + 0.2), () => { fillRR(CX - 220, 660, 440, 100, 14, D_W); text('A MONTH', CX, 713, 66, 900, '#000', 'center', 0.06); });
    } },
    { type: 'art', sfx: [[2, 'transitionHit', 0.35]], draw(t, a, c, L) {
      dHead('PHOENIX · MARCH 1947');
      for (let i = 0; i < 46; i++) circle(hash(i) * W, 390 + hash(i + 13) * 420, 2 + hash(i + 2) * 2.4, `rgba(255,255,255,${0.35 + 0.25 * Math.sin(t * 2 + i)})`);
      circle(890, 470, 58, D_L); circle(866, 452, 54, '#050505');
      line(200, 560, 200, 1250, D_G, 16); fillRR(90, 520, 400, 190, 20, '#000'); strokeRR(90, 520, 400, 190, 20, D_W, 9); text('MOTEL', 290, 620, 92, 900, D_W, 'center', 0.08);
      fillRR(300, 860, 680, 390, 8, '#242424'); poly([[270, 868], [640, 750], [1010, 868]], '#3c3c3c');
      for (let i = 0; i < 4; i++) { const x = 340 + i * 160, on = i === 2; fillRR(x, 930, 100, 110, 6, on ? D_W : '#0c0c0c'); if (on) { glow(x + 50, 985, 200, '#ffffff', 0.18 + 0.05 * Math.sin(t * 3)); bird(x + 52, 1036, 0.17, 0); } fillRR(x + 10, 1100, 80, 150, 6, '#0c0c0c'); }
      line(40, 1252, 1040, 1252, D_G, 6);
      dStamp('CHOKING', CX, 1330, t, ch(L, 2), 66, -0.04);
    } },
    { type: 'art', sfx: [[1, 'punch', 0.6], [2, 'transitionHit', 0.4]], draw(t, a, c, L) {
      dHead('THE LAST SIDESHOW'); tent(dIn(t, a)); spot(CX, 1150);
      fillRR(220, 990, 640, 36, 8, D_G); line(290, 1030, 260, 1240, D_D, 22); line(790, 1030, 820, 1240, D_D, 22);
      withFade(dIn(t, a + 0.15), () => { ctx.save(); ctx.translate(CX, 930); ctx.rotate(-0.06); line(-290, 0, -190, 0, D_L, 18); line(-290, -48, -290, 48, D_L, 18); fillRR(-190, -50, 330, 100, 16, 'rgba(255,255,255,0.28)'); strokeRR(-190, -50, 330, 100, 16, D_W, 7); for (let i = 0; i < 7; i++) line(-150 + i * 40, -50, -150 + i * 40, -18, D_W, 5); poly([[140, -26], [200, -14], [200, 14], [140, 26]], D_W); line(200, 0, 305, 0, D_W, 8); ctx.restore(); });
      dStamp('LEFT BEHIND', CX, 700, t, ch(L, 1), 96, -0.06);
      const k = dIn(t, ch(L, 2), 0.4); withFade(k, () => { fillRR(CX - 300, 1190, 600, 150, 16, '#000'); strokeRR(CX - 300, 1190, 600, 150, 16, D_W, 5); text('MIKE', CX, 1235, 56, 900, D_W, 'center', 0.2); text('1945 – 1947', CX, 1300, 44, 700, D_L, 'center', 0.1); });
    } },
    { type: 'art', sfx: [[1, 'pop', 0.5], [2, 'whoosh', 0.7]], draw(t, a, c, L) {
      dHead('YOUR REGULARS');
      const go = ease.inOut(seg(t, ch(L, 2) - 0.1, ch(L, 2) + 1.6));
      withFade(dIn(t, a), () => { line(80, 760, 1000, 760, D_D, 6); [190, 360].forEach((x) => dotPerson(x, 650, 190, D_G)); withFade(1 - 0.85 * seg(go, 0.4, 1), () => dotPerson(560 + 400 * go, 650, 230, D_W)); });
      const fall = ease.in(seg(t, ch(L, 1) + 0.35, ch(L, 2) + 0.7)), k = pop(t, ch(L, 1) - 0.15, 0.35);
      if (k > 0) { ctx.save(); ctx.translate(CX, 990 + fall * 60); ctx.rotate(-0.03 + fall * 0.16); ctx.scale(clamp(k), clamp(k)); fillRR(-390, -150, 780, 300, 24, D_W); text('TO DO', -330, -88, 34, 900, '#555', 'left', 0.2); strokeRR(-330, -26, 90, 90, 14, '#000', 9); text('Follow up', -200, -6, 70, 900, '#000', 'left'); text('with Marcus', -200, 78, 70, 900, '#000', 'left'); ctx.restore(); }
      dStamp('FORGOTTEN', CX, 1320, t, ch(L, 2) + 0.2, 80, -0.05, true);
    } },
    { type: 'art', sfx: [[2, 'notification', 0.25]], draw: dHealth, rows: [['Ava', 93], ['Priya', 82], ['Sam', 44], ['Marcus', 29]], msg: ['Marcus, you good?', 'Your chair is open.'] },
  ];
  window.REEL = { name: 'headless', who: 'Marcus', scenes: S };
})();
