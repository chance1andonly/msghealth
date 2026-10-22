// MsgHealth · "While you cut" · 24s film (1920 × 1080 or 1080 × 1920, 60 fps), cut to Pharrell Williams, "Freedom".
// One Tuesday at a barbershop, told by the clock: the hook is the day's result, then the clock rolls
// back to 9:02 AM and walks through what MsgHealth did while the barber was cutting. Brand indigo on
// black, every change of hour a 3D roll on the downbeat. The hook is readable on the first frame and
// the product is on screen by 3s. Nothing pulses.
'use strict';

const W = 1920, H = 1080, FPS = 60; // scenes are laid out on this 16:9 stage
// Output frame: 16:9 (promo.html) or 9:16 (promo-vertical.html sets window.FORMAT.vertical). In 9:16 each
// scene gets its own framing (see FRAMING) and a few scenes switch to stacked layouts.
const VERT = !!(window.FORMAT && window.FORMAT.vertical);
const OUT = VERT ? { w: 1080, h: 1920 } : { w: W, h: H };
const DURATION = 24.2; // the end card (beat 32, 20.6s) holds, then fades before the recording's TikTok outro
const C = BRAND.colors;
const FONT = 'Inter';
const MUTED = '#6b6b85', FAINT = '#9a9ab0', LINE = '#ececf3';
const SOFT = 'rgba(235,235,245,0.62)'; // secondary text on the black stage
// The brand indigo (#4F46E5), with lighter tints that read on the black stage.
const IN = { hi: '#dcd9ff', mid: '#a49dff', deep: '#7268ff', glow: C.primary };

// Beat grid of assets/audio/promo-track.m4a (27.78s–52.18s of the supplied recording): 94.7 BPM (0.6335s a
// beat), beat 0 at 0.30s. The bass comes in on beat 4 and the chorus drops on beat 20. Every entrance is
// snapped onto a real hit (src/promo-onsets.js).
const BEAT = 0.6335, B0 = 0.30;
function hit(t) { // nearest hit within 60 ms, else t unchanged
  let best = t, d = 0.06;
  for (const o of window.ONSETS || []) { const e = Math.abs(o - t); if (e < d) { d = e; best = o; } }
  return best;
}
const b = (k) => hit(B0 + k * BEAT); // beat k; k may be fractional
// The next n hits from `from`: for things that land one after another, each on its own hit.
function hits(from, n) {
  const O = (window.ONSETS || []).filter((o) => o >= from - 0.02);
  return Array.from({ length: n }, (_, i) => O[i] ?? from + i * 0.12);
}

let ctx = null, MAIN = null, LOGO = null;

// ── maths ────────────────────────────────────────────────────────────────────
const clamp = (v, a = 0, c = 1) => Math.max(a, Math.min(c, v));
const lerp = (a, c, t) => a + (c - a) * t;
const seg = (t, a, c) => clamp((t - a) / (c - a));
const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  quint: (t) => 1 - Math.pow(1 - t, 5),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
};
function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }

// UI elements land with a short, soft settle; headlines use the slower riseIn below.
const SNAP = 0.3;
const snapP = (t, at) => ease.quint(seg(t, at, at + SNAP));

// ── drawing primitives ───────────────────────────────────────────────────────
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function fillRR(x, y, w, h, r, col) { rr(x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); }
function font(size, weight = 600, track = -0.03) { ctx.font = `${weight} ${size}px ${FONT}`; ctx.letterSpacing = `${(size * track).toFixed(2)}px`; }
function text(s, x, y, size, weight, color, align = 'left', track) {
  font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005));
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.fillText(s, x, y);
}
function tw(s, size, weight = 600, track) { font(size, weight, track ?? (size >= 40 ? -0.03 : -0.005)); return ctx.measureText(s).width; }
function avatar(x, y, r, initials, color) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(color, 0.16); ctx.fill();
  text(initials, x, y + 1, r * 0.8, 700, color, 'center');
}
function pill(x, y, label, color, size = 22, align = 'left') {
  const w = tw(label, size, 600) + size * 1.3, h = size * 1.7;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  fillRR(x0, y - h / 2, w, h, h / 2, rgba(color, 0.14));
  text(label, x0 + w / 2, y + 1, size, 600, color, 'center');
  return w;
}
function check(x, y, s, col = '#fff', lw = 4) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x - s * 0.45, y); ctx.lineTo(x - s * 0.12, y + s * 0.34); ctx.lineTo(x + s * 0.5, y - s * 0.36); ctx.stroke();
}
function logoMark(x, y, s, img = LOGO) { if (img) ctx.drawImage(img, x - s / 2, y - s / 2, s, s); }

// Draw `fn` snapping in at time `at`, scaled around (cx, cy).
function snapIn(t, at, cx, cy, fn, o = {}) {
  at = hit(at);
  if (t < at) return;
  const p = snapP(t, at);
  ctx.save();
  ctx.globalAlpha *= p;
  const bl = (1 - p) * (o.blur ?? 12);
  if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  ctx.translate(cx, cy + (1 - p) * (o.dy ?? 22)); const s = lerp(o.from ?? 0.94, 1, p); ctx.scale(s, s); ctx.translate(-cx, -cy);
  fn();
  ctx.restore();
}

// ── the stage: black, with an optional soft glow behind the subject ──────────
function stage(glow = 0, col = IN.glow, gy = 0.55, R = 950) {
  ctx.fillStyle = '#000'; ctx.fillRect(-2 * W, -3 * H, 5 * W, 7 * H);
  if (glow <= 0) return;
  const g = ctx.createRadialGradient(W / 2, H * gy, 0, W / 2, H * gy, R);
  g.addColorStop(0, rgba(col, glow)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.fillRect(-2 * W, -3 * H, 5 * W, 7 * H);
}
function glass(x, y, w, h, r, o = {}) {
  fillRR(x, y, w, h, r, o.fill ?? 'rgba(255,255,255,0.065)');
  rr(x, y, w, h, r); ctx.strokeStyle = o.stroke ?? 'rgba(255,255,255,0.13)'; ctx.lineWidth = o.lw ?? 1.5; ctx.stroke();
}
const silver = (y, size) => { const g = ctx.createLinearGradient(0, y - size * 0.55, 0, y + size * 0.55); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#b4b4c2'); return g; };
const brandGrad = (x0, x1) => { const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, IN.hi); g.addColorStop(0.5, IN.mid); g.addColorStop(1, IN.deep); return g; };

// Headline entrance: fades up out of a soft blur, starting on a hit.
function riseIn(t, at, fn, o = {}) {
  at = hit(at);
  if (t < at) return;
  const p = ease.quint(seg(t, at, at + (o.d ?? 0.65)));
  ctx.save();
  ctx.globalAlpha *= p;
  const bl = (1 - p) * (o.blur ?? 16);
  if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
  ctx.translate(0, (1 - p) * (o.dy ?? 40));
  fn();
  ctx.restore();
}
// A line of large type; chunks: [text, time, accent?, colour?]. Accent chunks take the brand gradient.
function headline(t, chunks, x, y, size, o = {}) {
  const weight = o.weight ?? 700, tr = -0.035;
  const gap = tw(' ', size, weight, tr), ws = chunks.map(([s]) => tw(s, size, weight, tr));
  const total = ws.reduce((p, w) => p + w, 0) + gap * (chunks.length - 1);
  let cx = o.align === 'left' ? x : x - total / 2;
  chunks.forEach(([s, at, acc, col], i) => {
    const x0 = cx, w = ws[i];
    riseIn(t, at, () => {
      font(size, weight, tr); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      ctx.fillStyle = acc ? brandGrad(x0, x0 + w) : (col ?? o.color ?? silver(y, size));
      ctx.fillText(s, x0, y);
    }, { dy: size * 0.32 });
    cx += w + gap;
  });
  return total;
}
function sentBubble(x1, y, lines, size, tail, extra = 0) { // right-aligned blue iMessage bubble; x1 = right edge
  const lh = size * 1.28, padX = 22, padY = 13;
  const w = Math.max(...lines.map((l) => tw(l, size, 400, 0))) + extra + padX * 2, h = lines.length * lh + padY * 2;
  const x = x1 - w;
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#2b93ff'); g.addColorStop(1, '#0a7cff');
  fillRR(x, y, w, h, Math.min(26, h / 2), g);
  if (tail) {
    ctx.beginPath();
    ctx.moveTo(x1 - 6, y + h - 30);
    ctx.bezierCurveTo(x1 - 6, y + h - 8, x1 + 2, y + h + 1, x1 + 12, y + h + 3);
    ctx.bezierCurveTo(x1 - 6, y + h + 6, x1 - 20, y + h, x1 - 30, y + h - 8);
    ctx.closePath(); ctx.fill();
  }
  lines.forEach((l, i) => text(l, x + padX, y + padY + lh * (i + 0.5) + 1, size, 400, '#ffffff', 'left', 0));
  return { x, w, h };
}
function recvBubble(x, y, lines, size, tail, dark) { // left-aligned grey bubble
  const lh = size * 1.28, padX = 22, padY = 13;
  const w = Math.max(...lines.map((l) => tw(l, size, 400, 0))) + padX * 2, h = lines.length * lh + padY * 2;
  const col = dark ? '#26262b' : '#e9e9eb';
  fillRR(x, y, w, h, Math.min(26, h / 2), col);
  if (tail) {
    ctx.beginPath();
    ctx.moveTo(x + 6, y + h - 30);
    ctx.bezierCurveTo(x + 6, y + h - 8, x - 2, y + h + 1, x - 12, y + h + 3);
    ctx.bezierCurveTo(x + 6, y + h + 6, x + 20, y + h, x + 30, y + h - 8);
    ctx.closePath(); ctx.fillStyle = col; ctx.fill();
  }
  lines.forEach((l, i) => text(l, x + padX, y + padY + lh * (i + 0.5) + 1, size, 400, dark ? '#f2f2f7' : '#000', 'left', 0));
  return { w, h };
}

// ── MacBook ──────────────────────────────────────────────────────────────────
// The product UIs are drawn at 1920 × 1080 "content" size and shown on the laptop screen at LAP.s.
const LAP = { x: 300, y: 150, w: 1320, h: 742.5, s: 0.6875 };
let LIDC = null; // offscreen lid, used only while the lid is opening
function laptopShadow() {
  const by = LAP.y + LAP.h + 26;
  const g = ctx.createRadialGradient(W / 2, by + 30, 0, W / 2, by + 30, 900);
  g.addColorStop(0, 'rgba(120,110,255,0.10)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, by - 200, W, 500);
  ctx.save(); ctx.scale(1, 0.08); const s = ctx.createRadialGradient(W / 2, (by + 26) / 0.08, 0, W / 2, (by + 26) / 0.08, 760);
  s.addColorStop(0, 'rgba(0,0,0,0.9)'); s.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = s; ctx.fillRect(0, (by - 40) / 0.08, W, 160 / 0.08); ctx.restore();
}
function laptopBase() {
  const { x, w } = LAP, by = LAP.y + LAP.h + 26;
  const g = ctx.createLinearGradient(0, by, 0, by + 24);
  g.addColorStop(0, '#ececf0'); g.addColorStop(0.35, '#c2c2c9'); g.addColorStop(1, '#6a6a72');
  fillRR(x - 130, by, w + 260, 24, [3, 3, 16, 16], g);
  fillRR(x + w / 2 - 120, by, 240, 10, [0, 0, 10, 10], '#a3a3ab');
}
function lid(content, zEff) { // bezel + screen, drawn in output space
  const { x, y, w, h, s } = LAP;
  fillRR(x - 18, y - 18, w + 36, h + 44, 30, '#111113');
  rr(x - 18, y - 18, w + 36, h + 44, 30); ctx.strokeStyle = '#3b3b41'; ctx.lineWidth = 2.5; ctx.stroke();
  fillRR(x + w / 2 - 72, y - 18, 144, 24, [0, 0, 12, 12], '#111113');
  ctx.save(); rr(x, y, w, h, 8); ctx.clip();
  ctx.translate(x, y); ctx.scale(s, s); content(zEff); ctx.restore();
  const sheen = ctx.createLinearGradient(x, y, x + w * 0.6, y + h); // faint glass reflection
  sheen.addColorStop(0, 'rgba(255,255,255,0.05)'); sheen.addColorStop(0.5, 'rgba(255,255,255,0)'); ctx.fillStyle = sheen; ctx.fillRect(x, y, w, h);
}
// cam: [cx, cy, z] focus point in content coordinates and zoom (1 = whole laptop in view).
function laptop(t, cam, content, o = {}) {
  const [cx, cy, z] = cam;
  const fx = LAP.x + cx * LAP.s, fy = LAP.y + cy * LAP.s;
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-fx, -fy + (o.lift ?? 0));
  laptopShadow(); laptopBase();
  const open = o.open ?? 1;
  if (open >= 0.999) lid(content, z * LAP.s);
  else lidOpening(open, content);
  ctx.restore();
}
// The lid swings up: drawn as horizontal strips that grow taller and wider as it opens.
function lidOpening(p, content) {
  const { x, y, w, h } = LAP, ow = w + 36, oh = h + 44;
  if (!LIDC) { LIDC = document.createElement('canvas'); LIDC.width = ow; LIDC.height = oh; }
  const prev = ctx; ctx = LIDC.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ow, oh); ctx.translate(18 - x, 18 - y);
  lid(content, LAP.s);
  ctx.fillStyle = `rgba(0,0,0,${0.85 * (1 - p)})`; ctx.fillRect(x, y, w, h); // screen wakes as it opens
  ctx = prev;
  const hinge = y + h + 26, step = 3;
  for (let sy = 0; sy < oh; sy += step) {
    const v = sy / oh, wf = lerp(1 - 0.16 * (1 - p), 1, v);
    const dy = hinge - (oh - sy) * p, dw = ow * wf;
    ctx.drawImage(LIDC, 0, sy, ow, step, W / 2 - dw / 2, dy, dw, step * p + 0.8);
  }
}

// ── transitions (3D, each starts on its scene's first beat) ──────────────────
let BUF = [];
function buffer(i) {
  if (!BUF[i]) { const c = document.createElement('canvas'); c.width = OUT.w; c.height = OUT.h; BUF[i] = c.getContext('2d'); }
  return BUF[i];
}
// Draw a scene into the current context, framed for the output (identity in 16:9).
function shoot(fn, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, OUT.w, OUT.h);
  if (VERT) { const [fx, fy, s] = FRAMING.get(fn)(t); ctx.translate(OUT.w / 2, OUT.h / 2); ctx.scale(s, s); ctx.translate(-fx, -fy); }
  fn(t);
}
function renderInto(i, fn, t) {
  const prev = ctx; ctx = buffer(i);
  shoot(fn, t);
  ctx = prev;
  return buffer(i).canvas;
}
// Scene changes are moves in a real 3D scene (WebGL): both shots are textured planes, and every frame is
// motion-blurred by averaging sub-frames across a short shutter. Moves only ever travel toward their
// resting place: no overshoot, no snap-back. The cut onto the end card is a straight cut.
const FOV = 0.7, CAM_D = (OUT.h / 2) / Math.tan(FOV / 2); // at z = 0 a plane the size of the output frame fills it exactly
const M4 = {
  mul(a, b) { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; },
  t: (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1],
  s: (x, y, z) => [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1],
  rx: (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; },
  ry: (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; },
  rz: (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]; },
  persp(f, asp, n, fa) { const k = 1 / Math.tan(f / 2); return [k / asp, 0, 0, 0, 0, k, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0]; },
  apply: (m, [x, y, z]) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]],
};
let GL = null;
function initGL() {
  const c = document.createElement('canvas'); c.width = OUT.w; c.height = OUT.h;
  const gl = c.getContext('webgl', { preserveDrawingBuffer: true, antialias: true, premultipliedAlpha: false });
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a; uniform mat4 m; uniform vec4 r; varying vec2 v; void main(){ v = r.xy + (a + 0.5) * r.zw; gl_Position = m * vec4(a, 0.0, 1.0); }'));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, 'precision mediump float; uniform sampler2D tex; uniform float shade, alpha, lift; varying vec2 v; void main(){ vec3 c = texture2D(tex, v).rgb * shade + lift; gl_FragColor = vec4(c, alpha); }'));
  gl.linkProgram(prog); gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const tex = [0, 1].map(() => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach((f) => gl.texParameteri(gl.TEXTURE_2D, f, gl.LINEAR)); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((f) => gl.texParameteri(gl.TEXTURE_2D, f, gl.CLAMP_TO_EDGE)); return t; });
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  const u = (n) => gl.getUniformLocation(prog, n);
  const ftex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, ftex); // one sub-frame renders here before it is averaged in
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, OUT.w, OUT.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach((f) => gl.texParameteri(gl.TEXTURE_2D, f, gl.NEAREST)); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((f) => gl.texParameteri(gl.TEXTURE_2D, f, gl.CLAMP_TO_EDGE));
  const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ftex, 0); gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  GL = { gl, canvas: c, tex, fbo, ftex, m: u('m'), r: u('r'), shade: u('shade'), alpha: u('alpha'), lift: u('lift') };
}
// Upload both shots once per frame; `defocus` blurs a shot first (a focus pull).
function uploadShots(A, B, defocus = [0, 0]) {
  if (!GL) initGL();
  const { gl } = GL;
  [A, B].forEach((img, i) => {
    let src = img;
    if (defocus[i] > 0.5) { const c = buffer(3 + i); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = `blur(${defocus[i].toFixed(1)}px)`; c.drawImage(img, 0, 0); c.filter = 'none'; src = c.canvas; }
    gl.bindTexture(gl.TEXTURE_2D, GL.tex[i]); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
  });
}
// A plane: w × h pixels centred at (x, y, z) (y up, z toward the viewer), rotated about a pivot given
// relative to its centre; sx/sy stretch it. uv: [left, top, width, height] of the source shot in pixels.
function plane(tex, o) {
  const { w = OUT.w, h = OUT.h, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, px = 0, py = 0, pz = 0, a = 1, sx = 1, sy = 1, lift = 0 } = o;
  const R = M4.mul(M4.rz(rz), M4.mul(M4.ry(ry), M4.rx(rx)));
  const M = M4.mul(M4.t(x, y, z), M4.mul(M4.t(px, py, pz), M4.mul(R, M4.mul(M4.t(-px, -py, -pz), M4.s(w * sx, h * sy, 1)))));
  const uv = o.uv ?? [0, 0, OUT.w, OUT.h];
  return { tex, M, R, a, lift, layer: o.layer ?? 0, uv: [uv[0] / OUT.w, 1 - (uv[1] + uv[3]) / OUT.h, uv[2] / OUT.w, uv[3] / OUT.h] };
}
const LIGHT = (() => { const l = [-0.28, 0.36, 1], n = Math.hypot(...l); return l.map((v) => v / n); })();
// cam: x, y, z (offsets from the default position), yaw, pitch, roll (radians).
function glScene({ planes, cam = {} }) {
  const { gl } = GL;
  const eye = [cam.x ?? 0, cam.y ?? 0, CAM_D + (cam.z ?? 0)];
  const V = M4.mul(M4.rz(-(cam.roll ?? 0)), M4.mul(M4.rx(-(cam.pitch ?? 0)), M4.mul(M4.ry(-(cam.yaw ?? 0)), M4.t(-eye[0], -eye[1], -eye[2]))));
  const PV = M4.mul(M4.persp(FOV, OUT.w / OUT.h, 4, 30000), V);
  planes.filter((q) => q && q.a > 0.003).map((q) => {
    const c = M4.apply(q.M, [0, 0, 0]), n = M4.apply(q.R, [0, 0, 1]);
    return { ...q, n, facing: n[0] * (eye[0] - c[0]) + n[1] * (eye[1] - c[1]) + n[2] * (eye[2] - c[2]), d: Math.hypot(eye[0] - c[0], eye[1] - c[1], eye[2] - c[2]) };
  }).filter((q) => q.facing > 0).sort((p1, p2) => p1.layer - p2.layer || p2.d - p1.d).forEach((q) => { // painter's order (layers first), back faces hidden
    const lit = (q.n[0] * LIGHT[0] + q.n[1] * LIGHT[1] + q.n[2] * LIGHT[2]) / LIGHT[2];
    gl.bindTexture(gl.TEXTURE_2D, GL.tex[q.tex === 'A' ? 0 : 1]);
    gl.uniformMatrix4fv(GL.m, false, new Float32Array(M4.mul(PV, q.M)));
    gl.uniform4fv(GL.r, q.uv);
    gl.uniform1f(GL.shade, clamp(0.3 + 0.7 * lit, 0, 1));
    gl.uniform1f(GL.lift, q.lift);
    gl.uniform1f(GL.alpha, q.a);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
}
const xio = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2); // fast through the middle
const qn = ease.quint;
// Each entry: scene(p) → { planes, cam } for time p; optional defocus(p) → [blurA, blurB]. Every move travels one way and lands.
const one = (planes, cam) => ({ planes, cam });
const TRANSITIONS = {
  // the clock rolls: both shots are faces of one cube that turns a quarter, upward, like a digit on a
  // flip clock. The old hour rolls up and over the top as the next one comes up from below.
  drum: { scene(p) {
    const e = xio(p), R = OUT.h / 2, th = Math.PI / 2;
    const face = (tex, phi) => plane(tex, { y: R * Math.sin(phi), z: R * Math.cos(phi) - R, rx: -phi });
    return one([face('A', th * e), face('B', th * (e - 1))]);
  } },
  // → tagline: the laptop falls back into the dark as the words drop in from above
  fall: { scene(p) {
    const e = xio(p), k = qn(clamp((p - 0.25) / 0.75));
    return one([plane('A', { rx: -0.9 * e, z: -2600 * e * e, y: -150 * e, a: 1 - clamp((p - 0.55) / 0.35) }), plane('B', { y: OUT.h * 0.85 * (1 - k), rx: -0.4 * (1 - k), a: clamp(k * 1.6) })]);
  } },
};

const SHUTTER = 0.045, SAMPLES = 32;
function transition(type, p, A, B, dur) {
  const T = TRANSITIONS[type];
  uploadShots(A, B, T.defocus ? T.defocus(clamp(p)) : [0, 0]);
  const { gl } = GL, ID = [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  gl.viewport(0, 0, OUT.w, OUT.h);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
  for (let s = 0; s < SAMPLES; s++) {
    const ps = clamp(p + (s / (SAMPLES - 1) - 0.5) * SHUTTER / dur);
    gl.bindFramebuffer(gl.FRAMEBUFFER, GL.fbo); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    glScene(T.scene(ps));
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); // fold this sub-frame into the running average
    gl.blendColor(0, 0, 0, 1 / (s + 1)); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA);
    gl.bindTexture(gl.TEXTURE_2D, GL.ftex);
    gl.uniformMatrix4fv(GL.m, false, new Float32Array(ID)); gl.uniform4fv(GL.r, [0, 0, 1, 1]);
    gl.uniform1f(GL.shade, 1); gl.uniform1f(GL.lift, 0); gl.uniform1f(GL.alpha, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, OUT.w, OUT.h);
  ctx.drawImage(GL.canvas, 0, 0);
}

// ── shared product UI (rebuilt from the screen recordings) ───────────────────

const box = (x, y, w, h, r = 10) => { fillRR(x, y, w, h, r, '#fff'); rr(x, y, w, h, r); ctx.strokeStyle = '#e6e6ee'; ctx.lineWidth = 1.2; ctx.stroke(); };

// Home: KPI tiles, the October calendar and the Today panel.
// Tuesday 20 October 2026 is "today"; 1 October 2026 falls on a Thursday.
const CAL = { x: 330, w: 1225, gx: 345, gw: 1195, top: 440, rh: 97 };
const cellOf = (d) => { const i = d + 3; return [CAL.gx + (i % 7) * (CAL.gw / 7), CAL.top + Math.floor(i / 7) * CAL.rh]; };
const BASE_EVENTS = [
  [1, '10a', 'Melissa Grant', 'Beard Trim'], [2, '2:30p', 'Isabella Rossi', 'Skin Fade'], [6, '11a', 'Drew Bianchi', 'Cut & Beard'],
  [8, '10:30a', 'Jordan Ellis', 'Signature Cut'], [9, '1:30p', 'Maya Sandoval', 'Signature Cut'], [13, '12p', 'Theo Park', 'Signature Cut'],
  [15, '2p', 'Jordan Ellis', 'Lineup'], [16, '3:30p', 'Avery Whitfield', 'Hot Towel Shave'], [17, '11a', 'Simone Archer', 'Skin Fade'],
  [20, '9a', 'Kai Moreno', 'Skin Fade'], [20, '1p', 'Jay Ortiz', 'Signature Cut'], [20, '5:30p', 'Leo Grant', 'Lineup'], [29, '11a', 'Jordan Ellis', 'Signature Cut'],
];
function homeWorld(t, o = {}) {
  const added = (o.added ?? []).filter((e) => t >= e[4]);
  ctx.fillStyle = '#fafafc'; ctx.fillRect(0, 0, W, H);
  appSidebar(74, 'Dashboard');
  appTopBar('Home', 'Tuesday, October 20, 2026 · What needs your attention right now, nothing to dig for.');
  const kx = LAYOUT.x0, kw = (1890 - kx) / 4;
  box(kx, 92, 1890 - kx, 112, 10);
  [['Booked this week', String(added.length), added.length ? `${added.length} new since this morning` : 'None today'],
    ['Revenue, last 7 days', '$1,284', 'Up 12% on the week before'], ['Avg health score', '74', 'Out of 100'], ['Revenue at risk', '$1,315', 'Down $278 over 30 days']].forEach(([l, v, sub], i) => {
    const x = kx + i * kw + 20;
    if (i) { ctx.fillStyle = '#ececf2'; ctx.fillRect(kx + i * kw, 92, 1, 112); }
    text(l, x, 118, 12, 500, '#3a3a55');
    if (i === 0 && added.length) snapIn(t, added[added.length - 1][4], x + 10, 148, () => text(v, x, 148, 24, 700, C.primary), { dy: 0, from: 0.7 });
    else text(v, x, 148, 24, 700, '#16162a');
    text(sub, x, 178, 12, 400, i === 0 && added.length ? '#1f9d5c' : MUTED);
  });
  // calendar
  box(CAL.x, 222, CAL.w, 50, 10);
  text('Calendar', CAL.x + 44, 247, 14, 600, '#16162a'); fillRR(CAL.x + 18, 239, 14, 16, 3, rgba(C.primary, 0.25));
  [['Status', 1], ['Pipeline', 0], ['Waitlist', 0], ['Scheduling', 0]].forEach(([s, on], i) => {
    const bx = CAL.x + 840 + i * 92;
    if (on) fillRR(bx, 233, 80, 28, 5, C.primary); else { rr(bx, 233, 80, 28, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); }
    text(s, bx + 40, 248, 12, 600, on ? '#fff' : '#3a3a55', 'center');
  });
  box(CAL.x, 286, CAL.w, 660, 10);
  [['‹', 0], ['›', 1]].forEach(([s, i]) => { rr(CAL.x + 16 + i * 34, 302, 34, 30, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text(s, CAL.x + 33 + i * 34, 316, 16, 600, '#3a3a55', 'center'); });
  rr(CAL.x + 92, 302, 60, 30, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text('Today', CAL.x + 122, 317, 12, 500, '#55556f', 'center');
  text('October 2026', CAL.x + CAL.w / 2, 317, 17, 700, '#16162a', 'center');
  ['Month', 'Week', 'Day', 'Agenda'].forEach((s, i) => {
    const bx = CAL.x + CAL.w - 290 + i * 70;
    if (!i) fillRR(bx, 302, 66, 30, 5, C.primary);
    text(s, bx + 33, 317, 12, 600, i ? '#3a3a55' : '#fff', 'center');
  });
  const cw = CAL.gw / 7;
  ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].forEach((d, i) => text(d, CAL.gx + i * cw + cw / 2, 424, 11, 600, '#55556f', 'center'));
  ctx.strokeStyle = '#ececf2'; ctx.lineWidth = 1;
  for (let i = 0; i <= 7; i++) { ctx.beginPath(); ctx.moveTo(CAL.gx + i * cw, 408); ctx.lineTo(CAL.gx + i * cw, CAL.top + 5 * CAL.rh); ctx.stroke(); }
  for (let j = 0; j <= 5; j++) { ctx.beginPath(); ctx.moveTo(CAL.gx, CAL.top + j * CAL.rh); ctx.lineTo(CAL.gx + CAL.gw, CAL.top + j * CAL.rh); ctx.stroke(); }
  for (let i = 0; i < 35; i++) {
    const d = i - 3, x = CAL.gx + (i % 7) * cw, y = CAL.top + Math.floor(i / 7) * CAL.rh;
    const label = d < 1 ? [27, 28, 29, 30][i] : d; // Sep 27–30 lead into the month
    if (d === 20) { ctx.fillStyle = rgba(C.primary, 0.07); ctx.fillRect(x + 1, y + 1, cw - 2, CAL.rh - 2); }
    text(String(label), x + cw - 12, y + 16, 12, 600, d < 1 ? '#b5b5c8' : '#22223a', 'right');
  }
  const events = BASE_EVENTS.map((e) => [...e, -1]).concat(added);
  const perDay = {};
  events.forEach((e) => {
    const [d, tm, n, svc, at] = e, [x, y] = cellOf(d), k = (perDay[d] = (perDay[d] ?? 0) + 1) - 1;
    const draw = () => {
      ctx.save(); ctx.beginPath(); ctx.rect(x + 4, y, cw - 8, CAL.rh); ctx.clip();
      if (at > 0) fillRR(x + 5, y + 30 + k * 20, cw - 10, 19, 4, rgba(C.primary, 0.12));
      ctx.beginPath(); ctx.arc(x + 14, y + 40 + k * 20, 3.5, 0, 7); ctx.fillStyle = at > 0 ? C.primary : '#8b83ff'; ctx.fill();
      text(tm, x + 22, y + 40 + k * 20, 11, 500, '#6b6b85');
      text(`${n} · ${svc}`, x + 24 + tw(tm, 11, 500), y + 40 + k * 20, 11, at > 0 ? 600 : 500, '#22223a');
      ctx.restore();
    };
    if (at > 0) snapIn(t, at, x + cw / 2, y + 40, draw, { dy: 0, from: 0.85 }); else draw();
  });
  // Today + Needs attention
  box(1573, 222, 315, 190, 10);
  text('Today', 1591, 246, 14, 600, '#16162a'); text('Tuesday, Oct 20', 1591, 266, 12, 400, MUTED);
  text('8 cuts today', 1730, 330, 13, 600, '#16162a', 'center');
  const next = added.find((e) => e[0] === 21) ? 'Next: Wed, Oct 21 at 4:00 PM, Chris Okafor' : 'Next: Thu, Oct 22 at 10:00 AM, Kai Moreno';
  text(next, 1730, 356, 11.5, 400, MUTED, 'center');
  box(1573, 426, 315, 520, 10);
  text('Needs attention', 1591, 452, 14, 600, '#16162a'); text('5 open items, most urgent first', 1591, 472, 11.5, 400, MUTED);
  [['Camille Duval', 'Invoice INV-0011 is 12 days overdue', '$75.78'], ['Melissa Grant', 'Invoice INV-0009 is 9 days overdue', '$108.25'],
    ['Jordan Marsh', 'Overdue for a repeat visit, 43 days', ''], ['Riley Delgado', 'No booking in 69 days', '']].forEach(([n, s2, v], i) => {
    const y = 510 + i * 92;
    ctx.beginPath(); ctx.arc(1595, y, 4, 0, 7); ctx.fillStyle = i < 2 ? C.risk : '#b5b5c8'; ctx.fill();
    text(n, 1607, y, 13, 600, '#16162a'); if (v) text(v, 1872, y, 13, 600, '#16162a', 'right');
    text(s2, 1607, y + 20, 11, 400, MUTED);
    rr(1607, y + 36, 110, 26, 5); ctx.strokeStyle = '#e3e3ec'; ctx.stroke(); text(i < 2 ? 'Resend invoice' : 'Text client', 1662, y + 49, 11.5, 500, '#22223a', 'center');
  });
}

const LAYOUT = { side: 300, x0: 330 }; // world coordinates of the app pages (1920 × 1080)
// The product chrome, shared by every screen rebuilt from the recordings.
function appSidebar(bh, active) {
  const L = LAYOUT;
  ctx.fillStyle = '#fbfbfd'; ctx.fillRect(0, 0, L.side, H);
  ctx.fillStyle = '#ececf2'; ctx.fillRect(L.side, 0, 1, H);
  logoMark(36, 34, 30); text(BRAND.name, 52, 35, 19, 700, '#1a1a33');
  text('Business health', 18, 80, 13, 500, MUTED);
  text(`${bh}`, 236, 80, 13, 700, '#16162a', 'right'); text('/100', 266, 80, 13, 500, FAINT, 'right');
  fillRR(18, 94, 264, 5, 3, LINE); fillRR(18, 94, (264 * bh) / 100, 5, 3, bh > 70 ? '#22c55e' : bh > 50 ? C.attention : C.risk);
  fillRR(14, 114, 272, 34, 6, '#fff'); rr(14, 114, 272, 34, 6); ctx.strokeStyle = '#e6e6ee'; ctx.lineWidth = 1.2; ctx.stroke();
  text('Ask AI Analyst', 46, 131, 13, 500, '#3a3a55');
  const nav = [['Dashboard', 0], ['Dashboard', 1], ['Action Center', 1], ['Analytics & Predictions', 1], ['At-Risk Clients', 1], ['Custom Reports', 1],
    ['Finance', 0], ['Customers', 0], ['Messages', 0], ['Calls & Video', 0], ['Marketing', 0], ['Reviews', 1], ['Campaigns', 1], ['Scheduling & Jobs', 0], ['Team & Tools', 0]];
  let y = 180;
  nav.forEach(([n, sub], i) => {
    const on = sub && n === active && !(n === 'Dashboard' && i === 0);
    if (on) fillRR(34, y - 13, 248, 27, 5, rgba(C.primary, 0.09));
    if (!sub) fillRR(20, y - 7, 14, 14, 3, '#c5c5d6');
    text(n, sub ? 42 : 44, y + 1, 13.5, on || !sub ? 600 : 500, on ? C.primary : sub ? '#4a4a66' : '#22223a');
    y += sub ? 29 : 34;
  });
  avatar(30, H - 34, 14, 'S', '#16162a');
  text('Support', 54, H - 41, 13, 600, '#22223a'); text('Owner', 54, H - 25, 11, 500, FAINT);
}
function appTopBar(title, sub) {
  const x = LAYOUT.x0;
  text(title, x, 32, 19, 700, '#16162a');
  text(sub, x, 54, 12, 400, MUTED);
  [['AI Analyst', 1290, 100], ['Search anything…', 1404, 190], ['My Dashboard', 1608, 128]].forEach(([s, bx, bw]) => {
    rr(bx, 20, bw, 32, 6); ctx.strokeStyle = '#e3e3ec'; ctx.lineWidth = 1.2; ctx.stroke(); text(s, bx + 14, 36, 12, 500, '#3a3a55');
  });
  fillRR(1750, 20, 140, 32, 6, C.primary); text('+ Add Client', 1820, 36, 12.5, 600, '#fff', 'center');
}
function camAt(t, keys) {
  let c = keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const [at, ...to] = keys[i];
    const p = ease.inOut(seg(t, at, at + 0.42));
    if (p <= 0) break;
    // interpolate in log-zoom so the push feels even
    c = [lerp(c[0], to[0], p), lerp(c[1], to[1], p), Math.exp(lerp(Math.log(c[2]), Math.log(to[2]), p))];
  }
  return c;
}

// ═════════════════════════════════════════════════════════════════════════════
// The film: one Tuesday at the shop, told by the clock. Scenes start on downbeats, and every change
// of hour is the clock rolling over.
// ═════════════════════════════════════════════════════════════════════════════

// The clock: h:mm in fixed-width digit slots, so a digit that changes rolls in place (the old one up
// and out, the new one up from below). keys: [[time, 'h:mm', 'AM' | 'PM'], …], each key the same length.
function clock(t, keys, x, y, size, align = 'left') {
  let cur = keys[0], prev = null, at = -1;
  keys.slice(1).forEach((k) => { if (t >= hit(k[0])) { prev = cur; cur = k; at = hit(k[0]); } });
  const tr = -0.02, p = at < 0 ? 1 : ease.inOut(seg(t, at, at + 0.42));
  const digits = cur[1].split(''), olds = digits.map((ch, i) => (prev && prev[1][i] !== ch ? prev[1][i] : null));
  // each digit takes its own width (no gaps around a 1); a rolling digit's slot eases from the old width to the new
  const slot = (ch, i) => (olds[i] && p < 1 ? lerp(tw(olds[i], size, 700, tr), tw(ch, size, 700, tr), p) : tw(ch, size, 700, tr));
  const ms = size * 0.36, gap = size * 0.16, mw = tw(cur[2], ms, 700, 0.02);
  const total = digits.reduce((s, ch, i) => s + slot(ch, i), 0) + gap + mw;
  let cx = align === 'center' ? x - total / 2 : x;
  const by = y + size * 0.36;
  digits.forEach((ch, i) => {
    const w = slot(ch, i), old = olds[i], x0 = cx;
    const draw = (c, dy, a) => {
      if (a <= 0.003) return;
      ctx.save(); ctx.globalAlpha *= a;
      const bl = old ? 7 * Math.sin(Math.PI * p) : 0; if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
      font(size, 700, tr); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = silver(y + dy, size);
      ctx.fillText(c, x0 + w / 2, by + dy); ctx.restore();
    };
    if (old && p < 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(x0 - 10, y - size * 0.55, w + 20, size); ctx.clip();
      draw(old, -size * 0.95 * p, 1 - p); draw(ch, size * 0.95 * (1 - p), p);
      ctx.restore();
    } else draw(ch, 0, 1);
    cx += w;
  });
  font(ms, 700, 0.02); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = IN.mid;
  ctx.fillText(cur[2], cx + gap, by);
}
// A line under the clock; each new line replaces the one before, both moving up. The old line is
// gone before the new one comes up, so they never overlap.
function subline(t, keys, x, y, size, align) {
  keys = keys.map(([at, s]) => [hit(at), s]);
  keys.forEach(([at, s], i) => {
    const next = keys[i + 1]?.[0] ?? Infinity, out = ease.inOut(seg(t, next, next + 0.22));
    if (t < at || out >= 1) return;
    ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(0, -out * size * 0.6);
    riseIn(t, at + (i ? 0.2 : 0), () => text(s, x, y, size, 600, 'rgba(235,235,245,0.78)', align, -0.015), { dy: size * 0.5, blur: 10 });
    ctx.restore();
  });
}
// Every scene of the day: the time, and what MsgHealth did then. 16:9: left of the content; 9:16: above it.
// Layout grid. 16:9: two columns, the time on the left and the moment on the right, both centred on the
// frame's middle line. 9:16: one column, the time on top and the moment a fixed gap below it.
const HEAD = VERT ? { x: W / 2, y: 30, sy: 170, size: 170, sub: 46, align: 'center' } : { x: 150, y: 492, sy: 622, size: 150, sub: 42, align: 'left' };
const COL = { x: VERT ? W / 2 - 390 : 1000, w: 780 }; // the content column
const PAD = 40; // inner padding of every card
const cardY = (h) => (VERT ? 280 : H / 2 - h / 2); // top of a card of height h
function head(t, clockKeys, subKeys) {
  clock(t, clockKeys, HEAD.x, HEAD.y, HEAD.size, HEAD.align);
  subline(t, subKeys, HEAD.x, HEAD.sy, HEAD.sub, HEAD.align);
}

// ── A · beats 0–4 · the hook, readable from the very first frame ────────────
// The day's result, already on screen at 0:00 (nothing fades up), so the first frame works as the
// cover. Three bookings land as notifications while the intro plays muffled; on the drop the clock
// rolls back to the morning.
window.SFX = [];
window.MUFFLE = [0, b(4)]; // the intro plays underwater and the music opens up as the bass comes in
const NOTES = [['11:47 AM', 'Marcus Bell booked Thursday, 2:00 PM'], ['12:20 PM', 'Devon Price booked Friday, 11:30 AM'], ['4:05 PM', 'Andre Silva booked Saturday, 10:00 AM']];
const NOTE_AT = [b(1), b(2), b(3)];
NOTE_AT.forEach((t, i) => window.SFX.push({ t: t + 0.11, kind: 'sent', gain: [1, 0.7, 0.7][i] }));
function notice(x, y, w, time, body) { // a banner from the MsgHealth app
  const h = 100;
  glass(x, y, w, h, 30, { fill: 'rgba(255,255,255,0.08)' });
  fillRR(x + 22, y + 22, 56, 56, 15, '#ffffff'); logoMark(x + 50, y + 50, 40);
  text('MSGHEALTH', x + 98, y + 35, 17, 600, SOFT, 'left', 0.06);
  text(time, x + w - 28, y + 35, 17, 500, 'rgba(235,235,245,0.45)', 'right', 0);
  text(body, x + 98, y + 67, 26, 600, '#ffffff');
}
const OPEN = VERT // stacked for the phone
  ? { eyebrow: -40, lines: [[['6 regulars', -1]], [['rebooked.', -1]], [['You sent', -1]], [['0 texts.', -1, true]]], ys: [90, 220, 390, 520], size: 124, notes: 680, nw: 820 }
  : { eyebrow: 192, lines: [[['6 regulars rebooked.', -1]], [['You sent', -1], ['0 texts.', -1, true]]], ys: [304, 426], size: 104, notes: 562, nw: 780 };
function sOpen(t) {
  stage(0.16, IN.glow, 0.42);
  text('TUESDAY, OCTOBER 20', W / 2, OPEN.eyebrow, 30, 700, IN.mid, 'center', 0.22);
  OPEN.lines.forEach((chunks, i) => headline(t, chunks, W / 2, OPEN.ys[i], OPEN.size)); // -1: already in place at 0:00
  NOTES.forEach(([time, body], i) => {
    const y = OPEN.notes + i * 118;
    snapIn(t, NOTE_AT[i], W / 2, y + 50, () => notice(W / 2 - OPEN.nw / 2, y, OPEN.nw, time, body), { dy: -26 });
  });
}

// ── B · beats 4–10 · 9:02 AM: who's due, and a text to each ────────────────
const DUE = [
  ['Marcus Bell', 'MB', '#d97706', 'Every 3 weeks · last cut 23 days ago', 'Due', '#fbbf24'],
  ['Devon Price', 'DP', '#0891b2', 'Every 2 weeks · last cut 16 days ago', 'Due', '#fbbf24'],
  ['Andre Silva', 'AS', '#7c3aed', 'Every 4 weeks · last cut 33 days ago', 'Overdue', '#ff7a6b'],
  ['Chris Okafor', 'CO', '#db2777', 'Every 3 weeks · last cut 21 days ago', 'Due', '#fbbf24'],
];
const TEXTED = [8.81, 9.31, 9.6, 9.81].map(b); // each on a hit in the bar after the tick
window.SFX.push({ t: b(8), kind: 'click' }, { t: TEXTED[0] + 0.11, kind: 'sent', gain: 0.7 });
// A person's row inside a card: avatar, name and a detail line, all on the card's padding.
function person(x, cy, ini, col, name, detail) {
  ctx.beginPath(); ctx.arc(x + PAD + 30, cy, 30, 0, 7); ctx.fillStyle = rgba(col, 0.3); ctx.fill();
  text(ini, x + PAD + 30, cy + 1, 21, 700, '#ffffff', 'center');
  text(name, x + PAD + 76, cy - 15, 28, 600, '#ffffff');
  text(detail, x + PAD + 76, cy + 20, 20, 500, SOFT);
}
function sDue(t) {
  stage(0.14);
  head(t, [[-1, '9:02', 'AM'], [b(8), '9:03', 'AM']], [[b(5), 'MsgHealth spots who’s due back.'], [b(8), '…and texts each one for you.']]);
  const { x, w } = COL, rh = 112, h = rh * 4 + 2 * (PAD - 14), y0 = cardY(h), land = [5.33, 5.82, 6.33, 6.99].map(b);
  snapIn(t, b(5.33), x + w / 2, y0 + h / 2, () => glass(x, y0, w, h, 34), { dy: 20 });
  DUE.forEach(([n, ini, c, sub, st, sc], i) => {
    const ry = y0 + PAD - 14 + rh / 2 + i * rh;
    snapIn(t, land[i], x + w / 2, ry, () => {
      if (i) { ctx.fillStyle = 'rgba(255,255,255,0.07)'; ctx.fillRect(x + PAD + 76, ry - rh / 2, w - 2 * PAD - 76, 1.5); }
      person(x, ry, ini, c, n, sub);
      if (t < TEXTED[i]) pill(x + w - PAD, ry, st, sc, 20, 'right');
      else snapIn(t, TEXTED[i], x + w - PAD - 60, ry, () => pill(x + w - PAD, ry, 'Text sent', IN.mid, 20, 'right'), { from: 0.6, dy: 0 });
    }, { dy: 16 });
  });
}

// ── C · beats 10–16 · 11:47 AM: Marcus books himself in ─────────────────────
const REPLY = { at: b(12), booked: b(14) };
window.SFX.push({ t: REPLY.at + 0.11, kind: 'sent', gain: 0.8 }, { t: REPLY.booked, kind: 'click' });
function sReply(t) { // the conversation, as a card: who it's with, the morning's text, his reply, the booking
  stage(0.14);
  head(t, [[-1, '11:47', 'AM']], [[b(11), 'Marcus books himself in.']]);
  const { x, w } = COL, h = 576, y = cardY(h), size = 28, cx = x + w / 2, stamp = 'rgba(235,235,245,0.45)';
  glass(x, y, w, h, 34);
  person(x, y + PAD + 30, 'MB', '#d97706', 'Marcus Bell', 'Text message');
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x, y + 140, w, 1.5);
  text('Today 9:03 AM', cx, y + 176, 18, 500, stamp, 'center', 0);
  sentBubble(x + w - PAD, y + 200, ['Hey Marcus, it’s been 3 weeks.', 'Want your usual, Thursday at 2?'], size, true); // sent this morning
  snapIn(t, REPLY.at, x + PAD + 140, y + 370, () => {
    text('11:47 AM', cx, y + 324, 18, 500, stamp, 'center', 0);
    recvBubble(x + PAD, y + 348, ['Bet. See you Thursday.'], size, true, true);
  }, { from: 0.6, dy: 30, blur: 0 });
  const by = y + h - PAD - 38;
  snapIn(t, REPLY.booked, cx, by, () => {
    glass(x + PAD, by - 38, w - 2 * PAD, 76, 38, { fill: 'rgba(74,222,128,0.12)', stroke: 'rgba(74,222,128,0.4)' });
    const s = 'Booked · Thu, Oct 22 · 2:00 PM', sw = tw(s, 26, 700) + 54, sx = cx - sw / 2;
    ctx.beginPath(); ctx.arc(sx + 17, by, 17, 0, 7); ctx.fillStyle = '#4ade80'; ctx.fill(); check(sx + 17, by, 17, '#0b2e17', 4);
    text(s, sx + 54, by + 1, 26, 700, '#bbf7d0');
  }, { from: 0.85 });
}

// ── D · beats 16–20 · 3:15 PM: Jay leaves five stars ───────────────────────
const STARS = [17.03, 17.29, 17.83, 18.21, 18.36].map(b); // a star on each hit
STARS.forEach((t) => window.SFX.push({ t, kind: 'click', gain: 0.5 }));
function star(x, y, R) {
  ctx.beginPath();
  for (let k = 0; k < 10; k++) { const rk = k % 2 ? R * 0.43 : R, a = -Math.PI / 2 + (k * Math.PI) / 5; ctx.lineTo(x + rk * Math.cos(a), y + rk * Math.sin(a)); }
  ctx.closePath();
}
function sReview(t) {
  stage(0.14);
  head(t, [[-1, '3:15', 'PM']], [[b(16.79), 'Jay leaves you five stars.']]);
  const { x, w } = COL, h = 400, y = cardY(h);
  glass(x, y, w, h, 34);
  person(x, y + PAD + 30, 'JO', '#0ea5e9', 'Jay Ortiz', 'Signature Cut · today, 1:00 PM');
  STARS.forEach((at, i) => {
    const sx = x + PAD + 28 + i * 70, sy = y + 176;
    star(sx, sy, 28); ctx.fillStyle = 'rgba(255,255,255,0.13)'; ctx.fill();
    snapIn(t, at, sx, sy, () => { star(sx, sy, 28); ctx.fillStyle = '#fbbf24'; ctx.fill(); }, { from: 0.5, dy: 0, blur: 6 });
  });
  riseIn(t, b(18.5), () => text('“Cleanest fade I’ve had in years.”', x + PAD - 6, y + 256, 36, 600, '#ffffff', 'left', -0.015), { dy: 18, blur: 10 });
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(x, y + h - 80, w, 1.5);
  text('Review request sent automatically after his cut.', x + PAD, y + h - 40, 20, 500, SOFT, 'left', 0);
}

// ── E · beats 20–28 · 7:00 PM: the week, on the MacBook (the chorus drops on beat 20) ──────────
// Wide, the MacBook sits in the content column beside the clock like every other moment; as the camera
// moves in on the week it grows to fill the frame and the clock steps aside. Six bookings land, then
// the camera settles on "Booked this week: 6 new since this morning" and holds there.
const WEEK_AT = [22.84, 23.19, 23.48, 23.95, 24.28, 24.71].map(b);
const ADDED = [[21, '4p', 'Chris Okafor', 'Skin Fade'], [22, '2p', 'Marcus Bell', 'Signature Cut'], [23, '11:30a', 'Devon Price', 'Skin Fade'],
  [23, '3p', 'Sam Rivera', 'Beard Trim'], [24, '10a', 'Andre Silva', 'Cut & Beard'], [24, '1p', 'Nico Alvarez', 'Signature Cut']].map((e, i) => [...e, WEEK_AT[i]]);
WEEK_AT.forEach((t) => window.SFX.push({ t, kind: 'click', gain: 0.35 }));
const KPI = VERT ? [525, 385, 3.6] : [537, 292, 2.6]; // the tile fills the width, high in the frame, with the screen's top edge just out of shot
const WEEK_CAM = [[b(20), 960, 540, 1], [b(22), 1110, 770, 1.9], [b(25.26), ...KPI]];
// The MacBook, wide: its scale and where its centre sits. (Drawn at scale 1 it centres 29px below the frame's middle.)
const LAPW = VERT ? { s: 0.52, x: W / 2, y: 280 + 0.52 * 418 - 0.52 * 29 } : { s: 0.52, x: COL.x + COL.w / 2, y: H / 2 - 0.52 * 29 };
const weekIn = (t) => clamp((camAt(t, WEEK_CAM)[2] - 1) / 0.5); // 0 wide, 1 once the camera is in
function sWeek(t) {
  stage(0.12, IN.glow, 0.6);
  const cam = camAt(t, WEEK_CAM), k = ease.inOut(weekIn(t));
  if (k < 1) { ctx.save(); ctx.globalAlpha *= 1 - k; head(t, [[-1, '7:00', 'PM']], [[b(20.75), 'Your week, booked while you worked.']]); ctx.restore(); }
  ctx.save();
  const s = lerp(LAPW.s, 1, k);
  ctx.translate(lerp(LAPW.x, W / 2, k), lerp(LAPW.y, H / 2, k)); ctx.scale(s, s); ctx.translate(-W / 2, -H / 2);
  laptop(t, cam, () => homeWorld(t, { added: ADDED }));
  ctx.restore();
}

// ── the MsgHealth lockup (end card) ──────────────────────────────────────────
// The logo lands in the middle, steps right, then sweeps left as the name wipes in behind it.
function lockup(t, at, y, ls, size, o = {}) {
  const ww = tw(BRAND.name, size, 700, -0.035), gap = -0.06 * ls, full = ls + gap + ww;
  const lockX = W / 2 - full / 2 + ls / 2, textX = lockX + ls / 2 + gap;
  const right = o.static ? 1 : ease.inOut(seg(t, at + BEAT, at + BEAT + 0.4));
  const left = o.static ? 1 : ease.inOut(seg(t, at + 2 * BEAT, at + 2 * BEAT + 0.5));
  const lx = lerp(lerp(W / 2, W / 2 + 150, right), lockX, left);
  const wipeAt = o.static ? at : at + 2 * BEAT + 0.08;
  const wipe = lerp(textX - 40, textX + ww + 30, ease.out(seg(t, wipeAt, wipeAt + (o.static ? 0.22 : 0.5)))); // static: lands with the snap
  if (t >= wipeAt) {
    ctx.save();
    const edge = o.static ? textX - 40 : Math.max(lx + ls * 0.34, textX - 24); // trails the logo's visible edge
    ctx.beginPath(); ctx.rect(edge, 0, Math.max(0, wipe - edge), H); ctx.clip();
    font(size, 700, -0.035); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    const sweep = seg(t, at + 3 * BEAT, at + 3 * BEAT + 0.9); // one soft light sweep across the name
    const g = ctx.createLinearGradient(textX, 0, textX + ww, 0);
    const c0 = lerp(-0.3, 1.3, sweep);
    g.addColorStop(0, '#c9c9d4'); g.addColorStop(clamp(c0 - 0.15), '#c9c9d4'); g.addColorStop(clamp(c0), sweep > 0 && sweep < 1 ? '#ffffff' : '#c9c9d4'); g.addColorStop(clamp(c0 + 0.15), '#c9c9d4'); g.addColorStop(1, '#c9c9d4');
    ctx.fillStyle = g; ctx.fillText(BRAND.name, textX, y + size * 0.04);
    ctx.restore();
  }
  riseIn(t, at, () => {
    const gl = ctx.createRadialGradient(lx, y, 0, lx, y, ls * 0.8); // a tight glow, just behind the mark
    gl.addColorStop(0, 'rgba(99,102,241,0.34)'); gl.addColorStop(1, 'rgba(99,102,241,0)');
    ctx.fillStyle = gl; ctx.fillRect(lx - ls, y - ls, ls * 2, ls * 2);
    logoMark(lx, y, ls);
  }, o.static ? { dy: 0, d: 0.2, blur: 6 } : { dy: 0, d: 0.8, blur: 20 });
}


// ── F · beats 28–38 · close ──────────────────────────────────────────────────
function sTagline(t) {
  stage(0.12);
  if (VERT) {
    headline(t, [['You cut hair.', b(28)]], W / 2, 360, 118);
    headline(t, [['MsgHealth', b(30)]], W / 2, 540, 118);
    headline(t, [['fills the chair.', b(30), true]], W / 2, 670, 118);
  } else {
    headline(t, [['You cut hair.', b(28)]], W / 2, H / 2 - 76, 116);
    headline(t, [['MsgHealth', b(30)], ['fills the chair.', b(30), true]], W / 2, H / 2 + 76, 116);
  }
}
window.SFX.push({ t: b(32), kind: 'snap' }, { t: b(32), kind: 'riser' }); // the riser peaks as MsgHealth lands on the end card, with the snap
function sEnd(t) {
  stage(0.18, IN.glow, 0.45, 580);
  lockup(t, b(32), H / 2 - 70, 190, 150, { static: true });
  headline(t, [[BRAND.url, b(33)]], W / 2, H / 2 + 80, 44, { color: SOFT, weight: 500 });
  riseIn(t, b(34.21), () => {
    const s = 'Start now · 50% off your first month', w = tw(s, 28, 600) + 72;
    fillRR(W / 2 - w / 2, H / 2 + 160, w, 66, 33, '#ffffff');
    text(s, W / 2, H / 2 + 194, 28, 600, '#000', 'center');
  }, { dy: 20 });
  const out = seg(t, DURATION - 0.7, DURATION);
  if (out > 0) { ctx.fillStyle = `rgba(0,0,0,${out})`; ctx.fillRect(0, 0, W, H); }
}

// [start, end, scene, 3D transition into it, its length in seconds]. No transition means a straight cut.
const SCENES = [
  [0, b(4), sOpen],
  [b(4), b(10), sDue, 'drum', 0.7],       // as the bass comes in: the clock rolls back to the morning
  [b(10), b(16), sReply, 'drum', 0.7],
  [b(16), b(20), sReview, 'drum', 0.7],
  [b(20), b(28), sWeek, 'drum', 0.75],    // on the chorus drop
  [b(28), b(32), sTagline, 'fall', 0.7],
  [b(32), DURATION + 1, sEnd],            // straight cut to the end card
];
// 9:16 framing: [focus x, focus y, scale] of the 16:9 stage, per scene. The moments of the day share one
// framing; the MacBook pushes closer while the camera is in on the calendar, so the UI fills the phone.
const fixed = (fx, fy, sc) => () => [fx, fy, sc];
const DAY = fixed(960, 420, 1.08);
const FRAMING = new Map([
  [sOpen, fixed(960, 470, 1.0)], [sDue, DAY], [sReply, DAY], [sReview, DAY],
  [sWeek, (t) => { const k = ease.inOut(weekIn(t)); return [960, lerp(420, 540, k), lerp(1.08, 0.95, k)]; }], [sTagline, fixed(960, 510, 1.0)], [sEnd, fixed(960, 560, 0.9)],
]);
// A whoosh peaks at the fastest point of every roll; the two on the bass entry and the chorus drop sit louder.
SCENES.filter(([, , , type]) => type === 'drum').forEach(([st, , , , dur], i) => window.SFX.push({ t: st + dur / 2, kind: 'whoosh', gain: i === 0 || i === 3 ? 1 : 0.6 }));

function renderFrame(t) {
  ctx = MAIN;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, OUT.w, OUT.h);
  const i = Math.max(0, SCENES.findIndex(([s, e]) => t >= s && t < e));
  const [start, , fn, type, dur] = SCENES[i];
  if (i > 0 && type && t < start + dur) {
    const A = renderInto(0, SCENES[i - 1][2], t), B = renderInto(1, fn, t);
    ctx = MAIN; transition(type, (t - start) / dur, A, B, dur);
  } else shoot(fn, t);
}

window.DURATION = DURATION;
window.renderFrame = renderFrame;
window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  await Promise.all(['400', '500', '600', '700', '800'].map((w) => document.fonts.load(`${w} 40px ${FONT}`)));
  const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = src; });
  LOGO = await load(BRAND.logoFile);
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();

// ── player (plays the track in sync) ─────────────────────────────────────────
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time'), au = document.getElementById('track');
  let playing = false, cur = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const loop = () => {
    if (!playing) return;
    const t = au.currentTime;
    if (t >= DURATION || au.ended) { playing = false; btn.textContent = 'Replay'; show(DURATION); return; }
    show(t);
    requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    if (playing) { playing = false; au.pause(); btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    au.currentTime = cur; au.play(); playing = true; btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; au.pause(); btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();