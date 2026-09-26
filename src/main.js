// Boot, frame dispatch and the in-browser player.
'use strict';

let LOGO = null; // official logo image if assets/logo.png exists

function renderFrame(t) {
  POSE = Math.floor(t * POSE_FPS + 1e-6);
  CALL = 0;
  ctx = MAIN;
  screenSpace();
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.filter = 'none';
  ctx.fillStyle = '#0b0906'; ctx.fillRect(0, 0, W, H);
  drawFilm(t);
  // finishing pass: richer contrast & colour, like a graded film print
  const L = layer(7);
  L.setTransform(1, 0, 0, 1, 0, 0); L.globalCompositeOperation = 'copy'; L.drawImage(MAIN.canvas, 0, 0); L.globalCompositeOperation = 'source-over';
  MAIN.save(); MAIN.setTransform(1, 0, 0, 1, 0, 0);
  MAIN.filter = 'contrast(1.14) saturate(1.22) brightness(0.99)';
  MAIN.globalCompositeOperation = 'copy'; MAIN.drawImage(L.canvas, 0, 0);
  MAIN.restore();
}

window.ready = (async () => {
  MAIN = document.getElementById('c').getContext('2d');
  ctx = MAIN;
  makeTextures();
  TEXPAT = MAIN.createPattern(TEX, 'repeat');
  await Promise.all(['400', '700', '800', '900'].map((w) => document.fonts.load(`${w} 40px Nunito`)).concat(
    ['600', '700'].map((w) => document.fonts.load(`${w} 40px Fraunces`))));
  LOGO = await new Promise((res) => {
    const im = new Image();
    im.onload = () => res(im); im.onerror = () => res(null);
    im.src = BRAND.logoFile;
  });
  if (location.search.includes('render')) document.body.classList.add('render');
  renderFrame(0);
  return true;
})();
window.renderFrame = renderFrame;

// ── player ───────────────────────────────────────────────────────────────────
(() => {
  const btn = document.getElementById('play'), seek = document.getElementById('seek'), tm = document.getElementById('time');
  let playing = false, t0 = 0, start = 0, cur = 0;
  const show = (t) => { cur = t; renderFrame(t); seek.value = (t / DURATION) * 1000; tm.textContent = `${t.toFixed(1)}s / ${DURATION}s`; };
  const loop = (now) => {
    if (!playing) return;
    let t = t0 + (now - start) / 1000;
    if (t >= DURATION) { t = DURATION; playing = false; btn.textContent = 'Replay'; }
    // lock to the film's frame grid so playback matches the render
    show(Math.floor(t * FPS) / FPS);
    if (playing) requestAnimationFrame(loop);
  };
  btn.onclick = () => {
    if (playing) { playing = false; btn.textContent = 'Play'; return; }
    if (cur >= DURATION) cur = 0;
    playing = true; t0 = cur; start = performance.now(); btn.textContent = 'Pause'; requestAnimationFrame(loop);
  };
  seek.oninput = () => { playing = false; btn.textContent = 'Play'; show((seek.value / 1000) * DURATION); };
  window.ready.then(() => { const q = new URLSearchParams(location.search).get('t'); if (q) show(+q); });
})();
