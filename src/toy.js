// MsgHealth · "toy world" reels (1080 x 1920, 30 fps): low-poly 3D cartoon scenes (three.js) + the kit's captions, voice and end card.
// Config: window.TOY = { name, who, scenes:[shot, ...] } : one shot per spoken line 0..N-1, then the CTA line N (kit end card).
// shot = {
//   set: 'shop' | 'street' | 'road' | 'night' | 'lot',           the world (shop = barbershop interior)
//   cam: { p: [[t,x,y,z],...], look: [[t,x,y,z],...], fov: 42 }, camera keyframes in seconds from the start of the shot (1 key = fixed)
//   shops: [{ x, name, col, sign, w, pole }],                    buildings along the far side (street, night, lot)
//   actors: [{ id, k:'p'|'car'|'crowd', who:'marcus'|{skin,shirt,pants,hair,hat,apron}, path:[[t,x,z],...] or x,z, ry, pose, big, col, siren, n }],
//   tags: [{ a:'id', text, col, at }],                           name tag pinned to an actor's head
//   big: ['WORD'] optional giant 2D title { text, at, col }
//   sfx: [{ at, kind, gain }]  kinds: swoosh swish transition key ding notification tap pop whoosh click
// }
// cam.lin:true uses linear camera moves (to track a car moving linearly).
// extra actors: k:'truck' (monster truck, col), k:'goat', k:'building' {name,col,w,crush:t} (squashes flat at t seconds), k:'panel' {text:[lines], w,h,col,fg} floating screen at x,z,y,
//   k:'crowd' {n}; person fields: tool:3 scales clippers, run:true.
// poses: idle walk run sit phone wave shock point cut (clippers) sleep.   Units: 1 = about half a person width; person is 2 tall.
// Characters are original blocky toy figures. Everything is a pure function of the time t.
'use strict';
const R = window.TOY; window.CHAT_WHO = R.who || 'Marcus';
const N = R.scenes.length, END = VO_AT[N] - 0.1, DURATION = +Math.max(END + 2.4, lineEnd(N) + 1.1).toFixed(2);
window.CUES = { end: END }; window.SFX = []; const cue = (t, kind, gain) => window.SFX.push({ t, kind, gain });
window.MUSIC = { bpm: 100, root: 43, brandAt: END, mood: 'quirky' };
const hsh = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const eio = (x) => { x = Math.min(1, Math.max(0, x)); return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; };
const kfv = (keys, t) => { if (keys.length === 1 || t <= keys[0][0]) return keys[0].slice(1); for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const u = eio((t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0])); return keys[i].slice(1).map((v, j) => keys[i - 1][j + 1] + (v - keys[i - 1][j + 1]) * u); } return keys.at(-1).slice(1); };
const lin = (keys, t) => { if (t <= keys[0][0]) return keys[0].slice(1); for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const u = (t - keys[i - 1][0]) / (keys[i][0] - keys[i - 1][0] || 1); return keys[i].slice(1).map((v, j) => keys[i - 1][j + 1] + (v - keys[i - 1][j + 1]) * u); } return keys.at(-1).slice(1); };

// ── renderer ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const TC = document.createElement('canvas'); TC.width = 1080; TC.height = 1920;
const RD = new THREE.WebGLRenderer({ canvas: TC, antialias: true, preserveDrawingBuffer: true });
RD.setPixelRatio(1); RD.setSize(1080, 1920, false); RD.shadowMap.enabled = true; RD.shadowMap.type = THREE.PCFShadowMap; RD.outputColorSpace = THREE.SRGBColorSpace;
const CAM = new THREE.PerspectiveCamera(42, 1080 / 1920, 0.1, 300);
const M = {}; const mat = (c) => M[c] || (M[c] = new THREE.MeshLambertMaterial({ color: c, flatShading: true }));
const emi = (c, i = 1) => new THREE.MeshBasicMaterial({ color: c });
function box(w, h, d, c, x = 0, y = 0, z = 0, parent) { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'string' ? mat(c) : c); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; if (parent) parent.add(m); return m; }
function cyl(rt, rb, h, c, x = 0, y = 0, z = 0, seg = 10, parent) { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), typeof c === 'string' ? mat(c) : c); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; if (parent) parent.add(m); return m; }
function ball(r, c, x = 0, y = 0, z = 0, parent) { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), typeof c === 'string' ? mat(c) : c); m.position.set(x, y, z); m.castShadow = true; if (parent) parent.add(m); return m; }
function label(text, w, h, bg, fg, font = 700, pad = 0.12) { // text plane
  const cv = document.createElement('canvas'); cv.width = 512; cv.height = Math.round(512 * h / w); const g = cv.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  let s = cv.height * 0.62; g.font = `${font} ${s}px Inter, sans-serif`; while (g.measureText(text).width > cv.width * (1 - pad) && s > 8) { s -= 2; g.font = `${font} ${s}px Inter, sans-serif`; }
  g.fillText(text, cv.width / 2, cv.height / 2 + 2); const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tx })); return m;
}
const CHECK = (() => { const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d'); for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = (i + j) % 2 ? '#1c1c22' : '#f1f1f4'; g.fillRect(i * 32, j * 32, 32, 32); } const t = new THREE.CanvasTexture(cv); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10); t.colorSpace = THREE.SRGBColorSpace; return t; })();
const POLE = (() => { const cv = document.createElement('canvas'); cv.width = 64; cv.height = 256; const g = cv.getContext('2d'); for (let i = -4; i < 12; i++) { g.fillStyle = ['#e8e8ee', '#d8323c', '#e8e8ee', '#2b55c8'][((i % 4) + 4) % 4]; g.beginPath(); g.moveTo(0, i * 32 + 32); g.lineTo(64, i * 32); g.lineTo(64, i * 32 + 32); g.lineTo(0, i * 32 + 64); g.fill(); } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; })();

// ── cast ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const WHO = {
  marcus: { skin: '#8d5a3b', shirt: '#2b2e3a', pants: '#3a3f55', hair: '#141010' }, stylist: { skin: '#c98b62', shirt: '#f3ecdf', pants: '#2f3445', hair: '#2a1b12', apron: '#3d3a4a' },
  barber: { skin: '#a86d48', shirt: '#f3f3f6', pants: '#23252e', hair: '#141010', apron: '#c0483a' }, karen: { skin: '#f1c9a5', shirt: '#f29cb8', pants: '#2b2d3d', hair: '#e8c35a' },
  tony: { skin: '#c98b62', shirt: '#d9453a', pants: '#2d2f3a', hair: '#1a1210', apron: '#222' }, mama: { skin: '#8d5a3b', shirt: '#6aa38a', pants: '#3b3f4d', hair: '#cfcfd6' },
  cop: { skin: '#e8b48f', shirt: '#25356b', pants: '#1c2448', hair: '#3a2519', hat: '#1c2448' }, kid: { skin: '#e8b48f', shirt: '#e8a43a', pants: '#3b4a6b', hair: '#5a3a22' },
  ava: { skin: '#a86d48', shirt: '#7a62d9', pants: '#2b2d3d', hair: '#141010' }, dre: { skin: '#8d5a3b', shirt: '#4a8fd9', pants: '#2c3340', hair: '#141010' }, guy: { skin: '#e8b48f', shirt: '#7f93a8', pants: '#3b3f4d', hair: '#8b5a2b' },
};
function makePerson(w, seed) {
  const o = typeof w === 'string' ? WHO[w] : Object.assign({}, WHO.guy, w); const g = new THREE.Group(), s = 1;
  const legs = [-0.2, 0.2].map((x) => { const p = new THREE.Group(); p.position.set(x, 0.95, 0); box(0.3, 0.95, 0.34, o.pants, 0, -0.47, 0, p); box(0.34, 0.14, 0.46, '#20202a', 0, -0.9, 0.06, p); g.add(p); return p; });
  const torso = new THREE.Group(); torso.position.y = 0.95; g.add(torso); box(0.86, 0.95, 0.46, o.shirt, 0, 0.48, 0, torso); if (o.apron) box(0.7, 0.75, 0.06, o.apron, 0, 0.42, 0.25, torso);
  const arms = [-1, 1].map((sd) => { const p = new THREE.Group(); p.position.set(sd * 0.54, 0.86, 0); box(0.24, 0.8, 0.26, o.shirt, 0, -0.34, 0, p); ball(0.14, o.skin, 0, -0.78, 0, p); torso.add(p); return p; });
  const head = new THREE.Group(); head.position.y = 0.98; torso.add(head); const hb = ball(0.42, o.skin, 0, 0.42, 0, head); hb.scale.set(1, 1.05, 0.98);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.45, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.52), mat(o.hair)); cap.position.set(0, 0.44, -0.02); cap.castShadow = true; head.add(cap);
  if (o.hat) { box(0.96, 0.12, 0.96, o.hat, 0, 0.74, 0, head); box(0.6, 0.22, 0.6, o.hat, 0, 0.86, 0, head); }
  const eyes = [-0.16, 0.16].map((x) => { const e = ball(0.065, '#15121a', x, 0.46, 0.38, head); e.scale.set(1, 1.3, 0.6); return e; });
  const mouth = box(0.18, 0.04, 0.04, '#5a2b2b', 0, 0.24, 0.4, head);
  const phone = box(0.2, 0.34, 0.04, '#17181f', 0, -0.9, 0.12, arms[1]); phone.visible = false; box(0.17, 0.28, 0.01, '#9fa0ff', 0, 0, 0.025, phone);
  const tool = new THREE.Group(); tool.visible = false; tool.position.set(0, -0.92, 0.12); arms[1].add(tool); box(0.12, 0.34, 0.08, '#c8c8d2', 0, 0.12, 0, tool); box(0.16, 0.12, 0.1, '#1a1a22', 0, -0.08, 0, tool);
  g.userData = { legs, torso, arms, head, eyes, mouth, phone, tool, seed, base: g.position.clone() }; g.scale.setScalar(s);
  return g;
}
function pose(g, name, t, moving) {
  const U = g.userData, L = U.legs, A = U.arms, k = t * (name === 'run' ? 11 : 7), sw = Math.sin(k), bob = Math.sin(t * 2 + U.seed);
  L[0].rotation.x = L[1].rotation.x = 0; A[0].rotation.set(0, 0, 0); A[1].rotation.set(0, 0, 0); U.torso.rotation.set(0, 0, 0); U.head.rotation.set(0, 0, 0); U.phone.visible = false; U.tool.visible = false; g.position.y = 0;
  U.mouth.scale.set(1, 1, 1); U.eyes.forEach((e) => e.scale.set(1, 1.3, 0.6));
  if (name === 'walk' || name === 'run') { const a = name === 'run' ? 1.0 : 0.65; L[0].rotation.x = sw * a; L[1].rotation.x = -sw * a; A[0].rotation.x = -sw * a * 0.9; A[1].rotation.x = sw * a * 0.9; g.position.y = Math.abs(Math.cos(k)) * 0.09; if (name === 'run') U.torso.rotation.x = 0.2; }
  else if (name === 'sit') { L[0].rotation.x = L[1].rotation.x = -1.45; g.position.y = -0.38; A[0].rotation.x = A[1].rotation.x = -0.5; U.torso.rotation.z = bob * 0.01; }
  else if (name === 'phone') { A[1].rotation.x = -1.35; A[1].rotation.z = -0.15; U.phone.visible = true; U.head.rotation.x = 0.35; U.torso.rotation.z = bob * 0.015; }
  else if (name === 'sitphone') { L[0].rotation.x = L[1].rotation.x = -1.45; g.position.y = -0.38; A[1].rotation.x = -1.35; U.phone.visible = true; U.head.rotation.x = 0.35; A[0].rotation.x = -0.6; }
  else if (name === 'wave') { A[1].rotation.z = -2.6 + Math.sin(t * 9) * 0.35; A[1].rotation.x = 0; }
  else if (name === 'shock') { A[0].rotation.z = 2.3 + Math.sin(t * 20) * 0.1; A[1].rotation.z = -2.3 - Math.sin(t * 20) * 0.1; U.eyes.forEach((e) => e.scale.set(1.5, 1.9, 0.7)); U.mouth.scale.set(0.7, 5, 1); g.position.y = Math.abs(Math.sin(t * 9)) * 0.12; }
  else if (name === 'point') { A[1].rotation.x = -1.57; U.torso.rotation.y = 0.15; }
  else if (name === 'cut') { A[1].rotation.x = -1.2 + Math.sin(t * 8) * 0.12; A[1].rotation.z = -0.2; U.tool.visible = true; A[0].rotation.x = -0.7; U.head.rotation.x = 0.2; }
  else if (name === 'sleep') { U.head.rotation.x = 0.5; U.eyes.forEach((e) => e.scale.set(1.2, 0.2, 0.6)); }
  else { A[0].rotation.z = 0.05 + bob * 0.02; A[1].rotation.z = -0.05 - bob * 0.02; U.torso.rotation.z = bob * 0.012; }
  if (U.blink) U.eyes.forEach((e) => e.scale.y = 0.2);
}
function makeCar(c = '#d9453a', siren = false, plants = false) {
  const g = new THREE.Group(); box(2.1, 0.7, 4.2, c, 0, 0.7, 0, g); box(1.8, 0.62, 2.1, c, 0, 1.3, -0.1, g); box(1.6, 0.45, 0.04, '#9fd3f2', 0, 1.34, 0.96, g); box(1.6, 0.45, 0.04, '#9fd3f2', 0, 1.34, -1.16, g);
  [[-1, 1.3], [1, 1.3], [-1, -1.3], [1, -1.3]].forEach(([x, z]) => { const w = cyl(0.42, 0.42, 0.3, '#17171c', x * 1.05, 0.42, z, 12, g); w.rotation.z = Math.PI / 2; g.userData.wheels = (g.userData.wheels || []).concat(w); });
  box(0.4, 0.2, 0.05, '#fff7c2', -0.65, 0.78, 2.12, g); box(0.4, 0.2, 0.05, '#fff7c2', 0.65, 0.78, 2.12, g); box(0.4, 0.2, 0.05, '#ff4040', -0.65, 0.78, -2.12, g); box(0.4, 0.2, 0.05, '#ff4040', 0.65, 0.78, -2.12, g);
  if (siren) { const a = box(0.5, 0.2, 0.5, '#ff2d2d', -0.4, 1.7, -0.1, g), b = box(0.5, 0.2, 0.5, '#2d6bff', 0.4, 1.7, -0.1, g); g.userData.siren = [a, b]; box(2.12, 0.2, 2.2, '#f2f2f6', 0, 0.7, 0, g); }
  if (plants) for (let i = 0; i < 9; i++) { const x = (hsh(i) - 0.5) * 1.5, z = -1.1 + hsh(i + 3) * 2.2, y = i < 4 ? 1.6 : 1.1, k = 0.5 + hsh(i + 7) * 0.4; cyl(0, 0.35 * k, 0.9 * k, '#2f9a52', x, y + 0.2 + 0.45 * k, z, 6, g); cyl(0.07, 0.07, 0.3, '#6b4a2f', x, y + 0.1, z, 5, g); }
  return g;
}
function makeTruck(c = '#e8a43a') { const g = makeCar(c, false); g.children.forEach((m) => { m.position.y += 1.1; }); (g.userData.wheels || []).forEach((w) => { w.scale.set(1.9, 1, 1.9); w.position.y = 0.8; }); return g; }
function makeGoat() { const g = new THREE.Group(); box(1.6, 0.9, 0.8, '#e9e4d8', 0, 1.1, 0, g); box(0.6, 0.6, 0.6, '#e9e4d8', 0.95, 1.7, 0, g); box(0.12, 0.5, 0.12, '#3a3340', 1.0, 2.2, 0.18, g); box(0.12, 0.5, 0.12, '#3a3340', 1.0, 2.2, -0.18, g); box(0.2, 0.2, 0.08, '#d8a8a0', 1.3, 1.6, 0, g); [[-0.6, 0.3], [-0.6, -0.3], [0.6, 0.3], [0.6, -0.3]].forEach(([x, z]) => box(0.18, 0.8, 0.18, '#cfc8b8', x, 0.4, z, g)); box(0.2, 0.2, 0.1, '#17151c', 1.28, 1.8, 0.2, g); g.userData.leg = true; return g; }
function makePanel(a) { const g = new THREE.Group(), w = a.w || 4.4, h = a.h || 2.8; box(w + 0.3, h + 0.3, 0.2, '#17181f', 0, 0, 0, g); const lines = a.text || []; lines.forEach((t, i) => { const bg = i === 0 ? (a.col || '#4f46e5') : (a.rows && a.rows[i] ? a.rows[i] : '#fdfdfb'); const fg = i === 0 ? '#fff' : (a.fg && a.fg[i]) || '#16161d'; const m = label(t, w, h / lines.length, bg, fg, 800); m.position.set(0, h / 2 - (i + 0.5) * h / lines.length, 0.12); g.add(m); }); return g; }
function makeShop(s) {
  const g = new THREE.Group(), w = s.w || 8, h = s.h || 5, d = 6, col = s.col || '#c9763a';
  box(w, h, d, col, 0, h / 2, 0, g); box(w + 0.4, 0.3, d + 0.4, '#2a2d3a', 0, h + 0.15, 0, g);
  const sign = label(s.name, w * 0.8, 1.3, s.signBg || '#f6b800', s.signFg || '#1c1c22', 800); sign.position.set(0, h - 0.8, d / 2 + 0.07); g.add(sign);
  box(1.8, 3.1, 0.12, '#1d2030', -w * 0.18, 1.55, d / 2 + 0.03, g); box(1.5, 1.9, 0.1, '#9fd3f2', w * 0.22, 2.0, d / 2 + 0.03, g); box(1.5, 1.9, 0.1, '#9fd3f2', w * 0.38 - 0.0, 2.0, d / 2 + 0.03, g);
  if (s.pole !== false) { const p = cyl(0.22, 0.22, 1.6, new THREE.MeshLambertMaterial({ map: POLE }), -w * 0.18 - 1.5, 2.3, d / 2 + 0.3, 12, g); g.userData.pole = p; ball(0.25, '#d8d8e0', -w * 0.18 - 1.5, 3.2, d / 2 + 0.3, g); }
  const open = label('OPEN', 0.9, 0.38, '#14161f', '#47e08a', 800); open.position.set(-w * 0.18 + 1.2, 2.2, d / 2 + 0.1); g.add(open);
  g.userData.win = [];
  return g;
}
function shopInterior(set) {
  const g = new THREE.Group(); box(40, 0.2, 40, '#2a2c38', 0, -0.1, 10, g);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshLambertMaterial({ map: CHECK })); fl.position.z = 10; fl.rotation.x = -Math.PI / 2; fl.receiveShadow = true; g.add(fl);
  box(40, 20, 0.4, set.wall || '#1f8f7f', 0, 10, -5, g); box(40, 0.2, 14, set.wall || '#1f8f7f', 0, 14, 2, g); box(20, 0.3, 0.5, '#e8e8ee', 0, 3.6, -4.8, g); box(20, 1.2, 0.5, '#e2e2e8', 0, 0.6, -4.8, g);
  for (let i = 0; i < 3; i++) { const x = -5.5 + i * 5.5; box(3.4, 3.4, 0.14, '#cfe5f2', x, 5.5, -4.78, g); box(3.8, 3.8, 0.1, '#e8e8ee', x, 5.5, -4.82, g); }
  [-6, -3.6, 4, 6].forEach((x, i) => { cyl(0.18, 0.18, 0.6, ['#e8683a', '#47b5d6', '#e8c33a', '#7a62d9'][i % 4], x, 1.6, -4.5, 8, g); });
  const clock = cyl(0.8, 0.8, 0.1, '#f4f4f8', 7, 7, -4.7, 18, g); clock.rotation.x = Math.PI / 2; box(0.08, 0.6, 0.06, '#222', 7, 7.15, -4.62, g);
  g.userData.chairs = [];
  return g;
}
function chair(x, z, col = '#c0392b') { const g = new THREE.Group(); g.position.set(x, 0, z); cyl(0.8, 0.9, 0.4, '#bfc3cc', 0, 0.2, 0, 14, g); cyl(0.2, 0.2, 0.7, '#9aa0aa', 0, 0.7, 0, 8, g); box(1.9, 0.4, 1.8, col, 0, 1.15, 0, g); box(1.9, 2.2, 0.4, col, 0, 2.3, -0.85, g); box(0.8, 0.5, 0.4, col, 0, 3.5, -0.85, g); box(0.25, 0.25, 1.4, '#9aa0aa', -1.05, 1.7, 0.1, g); box(0.25, 0.25, 1.4, '#9aa0aa', 1.05, 1.7, 0.1, g); box(1.2, 0.2, 0.8, '#bfc3cc', 0, 0.3, 1.2, g); return g; }

// ── worlds ───────────────────────────────────────────────────────────────────────────────────────────────────────────────
const SKY = { shop: '#17192b', street: '#8fd3ff', road: '#8fd3ff', lot: '#8fd3ff', night: '#0b1030', dusk: '#f2a86e' };
const worlds = new Map();
function buildWorld(si) {
  const c = R.scenes[si], sc = new THREE.Scene(), set = c.set || 'street', night = set === 'night' || c.night, inside = set === 'shop';
  sc.background = new THREE.Color(c.sky || (night ? SKY.night : SKY[set]));
  if (!inside) sc.fog = new THREE.Fog(sc.background, 60, 170);
  sc.add(new THREE.HemisphereLight(night ? '#6f7fd8' : '#ffffff', night ? '#0a0c1c' : '#8a9a70', night ? 0.75 : 1.05));
  const sun = new THREE.DirectionalLight(night ? '#8fa4ff' : '#fff2dc', night ? 0.8 : 1.25); sun.position.set(-14, 26, 18); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 90 }); sc.add(sun);
  const W = { sc, actors: {}, anim: [], tags: c.tags || [] };
  if (inside) {
    sc.add(shopInterior(c)); (c.chairs || [-3.2, 3.2]).forEach((x) => sc.add(chair(x, 0.5, c.chairCol)));
    if (c.sceneProps) c.sceneProps.forEach((p) => { if (p === 'lights') { const l = new THREE.PointLight('#ffd9a8', 0.8, 30); l.position.set(0, 7, 3); sc.add(l); } });
  } else {
    const gr = box(260, 0.2, 200, c.grass || (night ? '#12301f' : '#58b45a'), 0, -0.12, -40); gr.receiveShadow = true; sc.add(gr);
    const road = box(260, 0.22, c.roadW || 9, night ? '#1a1b24' : '#3a3d48', 0, -0.05, c.roadZ ?? 6); road.receiveShadow = true; sc.add(road);
    for (let x = -120; x < 120; x += 6) box(2.4, 0.24, 0.16, '#f0e6a0', x, -0.03, c.roadZ ?? 6, sc);
    if (set === 'lot' || c.lot) { const lot = box(70, 0.22, 16, night ? '#22232d' : '#4a4d58', 0, -0.06, -1.5); sc.add(lot); for (let x = -26; x <= 26; x += 5.5) box(0.25, 0.24, 7, '#f4f4f8', x, -0.03, -2.5, sc); }
    (c.shops || []).forEach((s, i) => { const sh = makeShop(s); sh.position.set(s.x, 0, -9); sc.add(sh); W.anim.push((t) => { if (sh.userData.pole) sh.userData.pole.material.map.offset.y = -t * 0.4; }); if (night) box(s.w ? s.w * 0.3 : 2.4, 1.1, 0.06, '#ffe08a', s.x + (s.w || 8) * 0.28, 2.0, -5.9, sc); });
    for (let i = 0; i < (c.trees ?? 14); i++) { const x = -70 + hsh(i * 3 + si) * 140, z = -22 - hsh(i * 5 + 1) * 45, s = 1.6 + hsh(i) * 1.6; if (Math.abs(x) < 4) continue; const g = new THREE.Group(); g.position.set(x, 0, z); cyl(0.3 * s, 0.4 * s, 1.6 * s, '#6b4a2f', 0, 0.8 * s, 0, 6, g); cyl(0, 1.5 * s, 2.8 * s, night ? '#1d5a3a' : '#2f9a52', 0, 2.8 * s, 0, 7, g); cyl(0, 1.2 * s, 2.2 * s, night ? '#226b44' : '#3bb35f', 0, 4.0 * s, 0, 7, g); sc.add(g); }
    if (night) { const m = ball(3, '#fff6d8', -40, 55, -120); m.material = emi('#fff6d8'); m.castShadow = false; sc.add(m); for (let i = 0; i < 70; i++) { const s = ball(0.25, emi('#ffffff'), -90 + hsh(i) * 180, 20 + hsh(i + 9) * 70, -140); s.castShadow = false; sc.add(s); } }
    else for (let i = 0; i < 5; i++) { const cl = new THREE.Group(); cl.position.set(-60 + i * 32 + hsh(i) * 10, 38 + hsh(i + 4) * 14, -110); [[0, 0, 5], [5, 1, 4], [-5, 0.5, 4]].forEach(([x, y, r]) => { const b = ball(r, emi('#ffffff'), x, y, 0, cl); b.castShadow = false; }); sc.add(cl); }
  }
  (c.actors || []).forEach((a, i) => {
    let o;
    if (a.k === 'car') { o = makeCar(a.col, a.siren, a.plants); }
    else if (a.k === 'truck') { o = makeTruck(a.col); }
    else if (a.k === 'goat') { o = makeGoat(); }
    else if (a.k === 'panel') { o = makePanel(a); }
    else if (a.k === 'building') { o = makeShop(a); if (!a.crushY) a.crushY = 0; }
    else if (a.k === 'crowd') { o = new THREE.Group(); const n = a.n || 12; for (let j = 0; j < n; j++) { const p = makePerson({ skin: ['#e8b48f', '#c98b62', '#8d5a3b', '#f1c9a5'][j % 4], shirt: ['#3a4a8a', '#8a3a3a', '#3a8a5a', '#8a7a3a', '#6a3a8a'][j % 5], pants: '#25283a', hair: '#1a1210' }, j); p.position.set(-4 + (j % 6) * 1.6 + hsh(j) * 0.4, 0, Math.floor(j / 6) * 1.5); p.userData.crowd = true; p.userData.phase = hsh(j + 2) * 6; o.add(p); } }
    else { o = makePerson(a.who || 'guy', i + 1); if (a.big) o.scale.setScalar(a.big); }
    sc.add(o); W.actors[a.id || 'a' + i] = { o, c: a };
  });
  worlds.set(si, W); return W;
}

// ── frame ────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const V = new THREE.Vector3();
function frame3d(si, t0, t) {
  const c = R.scenes[si], W = worlds.get(si) || buildWorld(si), lt = Math.max(0, t - t0);
  W.anim.forEach((f) => f(lt));
  Object.values(W.actors).forEach(({ o, c: a }) => {
    let p = a.path ? lin(a.path, lt) : [a.x ?? 0, a.z ?? 0], prev = a.path ? lin(a.path, Math.max(0, lt - 0.1)) : p;
    const mv = Math.hypot(p[0] - prev[0], p[1] - prev[1]) > 0.0005;
    o.position.x = p[0]; o.position.z = p[1]; o.rotation.y = mv ? Math.atan2(p[0] - prev[0], p[1] - prev[1]) : (a.ry ?? 0);
    if (a.yFrom != null) o.position.y = a.yFrom;
    if (a.k === 'panel') { o.position.y = a.y ?? 3; o.rotation.y = a.ry ?? 0; o.position.y += Math.sin(lt * 1.6) * 0.1; if (a.pop != null) o.scale.setScalar(Math.max(0.001, ease.out(seg(lt, a.pop, a.pop + 0.35)))); }
    else if (a.k === 'goat') { o.position.y = Math.abs(Math.sin(lt * 9)) * (mv ? 0.15 : 0.02); }
    else if (a.k === 'building') { o.position.y = 0; const cr = a.crush != null ? ease.out(seg(lt, a.crush, a.crush + 0.35)) : 0; o.scale.set(1 + cr * 0.15, 1 - cr * 0.88, 1 + cr * 0.15); o.position.x += cr > 0 && cr < 1 ? Math.sin(lt * 60) * 0.1 : 0; o.rotation.y = a.ry ?? 0; }
    else if (a.k === 'truck') { (o.userData.wheels || []).forEach((w) => w.rotation.x = lt * 7); o.position.y = Math.abs(Math.sin(lt * 6)) * 0.12; o.rotation.y += a.yaw || 0; }
    else if (a.k === 'car') { (o.userData.wheels || []).forEach((w) => w.rotation.x = lt * 9); if (o.userData.siren) { const f = Math.sin(lt * 14) > 0; o.userData.siren[0].material = mat(f ? '#ff2d2d' : '#5a1010'); o.userData.siren[1].material = mat(f ? '#102a5a' : '#2d6bff'); } if (a.hop) o.position.y = Math.abs(Math.sin(lt * 7)) * 0.1; o.rotation.y += a.yaw || 0; }
    else if (a.k === 'crowd') o.children.forEach((q) => { pose(q, a.pose || 'idle', lt + q.userData.phase, false); });
    else { const pn = typeof a.pose === 'function' ? a.pose(lt) : a.pose ? (Array.isArray(a.pose) ? lin1(a.pose, lt) : a.pose) : mv ? (a.run ? 'run' : 'walk') : 'idle'; pose(o, pn, lt, mv); if (a.tool) o.userData.tool.scale.setScalar(a.tool); const y0 = o.position.y; o.position.y = y0 + (a.sitY ?? 0); }
  });
  const cam = c.cam || { p: [[0, 0, 4, 12]], look: [[0, 0, 1.5, 0]] };
  const kk = cam.lin ? lin : kfv, cp = kk(cam.p, lt), cl = kk(cam.look, lt); CAM.fov = cam.fov || 58; CAM.updateProjectionMatrix(); CAM.position.set(...cp);
  CAM.position.x += Math.sin(lt * 0.9) * 0.05; CAM.position.y += Math.sin(lt * 1.3) * 0.04; CAM.lookAt(...cl); CAM.updateMatrixWorld();
  RD.render(W.sc, CAM); return W;
}
const lin1 = (keys, t) => { let cur = keys[0][1]; for (const [at, n] of keys) if (t >= at) cur = n; return cur; }; // pose keys: [[0,'walk'],[1.4,'shock']]
function drawTags(W, lt, a0) {
  (W.tags || []).forEach((tg) => {
    const e = ease.out(seg(lt, tg.at ?? 0.3, (tg.at ?? 0.3) + 0.35)); if (e <= 0) return; const ac = W.actors[tg.a]; if (!ac) return;
    ac.o.updateMatrixWorld(); V.set(0, (ac.c.big || 1) * 2.7 + (tg.dy || 0), 0).applyMatrix4(ac.o.matrixWorld).project(CAM);
    const x = (V.x * 0.5 + 0.5) * 1080, y = (-V.y * 0.5 + 0.5) * 1920; const sz = tg.size || 38, w = tw(tg.text, sz, 800, 0.02) + sz * 1.6, h = sz * 1.9, col = tg.col || '#ec407a';
    const tx = Math.max(w / 2 + 30, Math.min(1080 - w / 2 - 30, x + (tg.dx || 0))), ty = Math.max(h / 2 + 260, y - 130 * 0 - 120 + (tg.dy2 || 0));
    ctx.save(); ctx.globalAlpha *= e; line(x, y - 20, tx, ty + h / 2, '#fff', 4); circle(x, y - 20, 9, '#fff');
    fillRR(tx - w / 2 + 5, ty - h / 2 + 7, w, h, 16, 'rgba(0,0,0,0.28)'); fillRR(tx - w / 2, ty - h / 2, w, h, 16, col); text(tg.text, tx, ty + 2, sz, 800, '#fff', 'center', 0.02); ctx.restore();
  });
}
function bigWord(b, lt) { const e = pop(lt, b.at ?? 0.3, 0.35); if (e <= 0) return; xf(540, b.y || 520, clamp(e), (b.rot ?? -0.04), () => { const s = fit2(b.text, b.size || 130, 940); fillRR(540 - tw(b.text, s, 800) / 2 - 40, (b.y || 520) - s * 0.75, tw(b.text, s, 800) + 80, s * 1.5, 28, b.col || '#f6b800'); text(b.text, 540, (b.y || 520) + 4, s, 800, b.fg || '#16161d', 'center', -0.02); }); }
const fit2 = (s, size, maxW) => Math.min(size, size * maxW / tw(s, size, 800));

const SC = R.scenes.map((c, i) => {
  const a = i ? VO_AT[i] : 0, b = VO_AT[i + 1];
  (c.sfx || []).forEach((s) => cue(a + s.at, s.kind, s.gain ?? 0.25));
  cue(a + 0.02, c.enter || 'swish', 0.22);
  return [a, b, (t) => { if (c.chatOnly) { stage(t, 0.14); chatScene(t, a, c, i); return; } const W = frame3d(i, a, t); ctx.drawImage(TC, 0, 0); drawTags(W, t - a, a); (c.big || []).forEach((bw) => bigWord(bw, t - a)); if (c.chat) chatScene(t, a, c, i); }];
});
SC.push([END, 999, (t) => finale(t, END)]);
function chatScene(t, a, c, i) { phoneChat(t, a - 0.1, VO_AT[i + 1] + 0.2, () => c.chat.forEach((m, j) => msg(m.out ? 40 : 60, m.y, 520, m.lines, m.out, seg(t, a + m.at, a + m.at + 0.2), m.out ? seg(t, a + m.at + 0.1, a + m.at + 1.5) : 1))); }
cue(END + 1.25, 'tap', 0.3);
boot({ duration: DURATION, scenes: SC, brandAt: END, hideCaption: (t) => t >= END + 0.6 }, R.name);
