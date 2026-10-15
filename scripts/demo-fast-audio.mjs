// Sound design for the 20.5 s fast cut (demo-fast.html): restrained UI sound effects only.
// No music and no voice; the voiceover (VOICEOVER-FAST.md) is recorded separately.
// Cues from the 47 s film are placed through the same time remap as the picture (src/demo/fast.js).
//   node scripts/demo-fast-audio.mjs dist/demo-fast-sfx.wav
import { mixer, mtof } from './sfx-lib.mjs';

const { add, thud, pluck, bell, tick, tap, glide, whoosh, chord, write } = mixer(20.5);

// [fast t0, fast t1, film src0, film src1], mirroring the FAST cut list
const CUTS = {
  churn: [2.4, 4.2, 9.0, 13.2], meet: [4.2, 5.8, 13.2, 17.0], health: [5.8, 8.8, 17.0, 23.0],
  auto: [8.8, 11.8, 23.0, 29.6], toolkit: [11.8, 14.8, 29.6, 35.0], overview: [14.8, 16.3, 35.0, 39.6],
  cta: [16.3, 20.5, 39.6, 39.6 + 4.2 * 1.7],
};
const at = (cut, x) => { const [a, b, s0, s1] = CUTS[cut]; return a + ((x - s0) / (s1 - s0)) * (b - a); };

// ── hook slams ───────────────────────────────────────────────────────────────
[0, 0.35, 0.7, 1.05].forEach((t, i) => { add(t, 0.45, thud(50 + i * 3, 9), i === 3 ? 0.3 : 0.24); add(t, 0.05, tap(), 0.06); });
add(1.13, 0.4, pluck(mtof(86)), 0.06);                       // the full stop
// ── the silence ──────────────────────────────────────────────────────────────
add(1.4, 0.5, pluck(mtof(84)), 0.07);
add(1.56, 0.08, tick(2400), 0.04, 0.3);
for (let t = 1.62; t < 1.9; t += 0.09) add(t, 0.04, tick(1500), 0.016, -0.3);
add(2.0, 1.0, bell(mtof(76), 4), 0.045); add(2.08, 1.0, bell(mtof(71), 4), 0.04);
// ── churn ────────────────────────────────────────────────────────────────────
whoosh(2.38, 0.35, 0.04);
for (let k = 0; k < 27; k += 2) add(at('churn', 10.05 + k * 0.074), 0.05, tick(1700 - k * 22), 0.02, k % 4 ? 0.3 : -0.3);
// ── meet MsgHealth ───────────────────────────────────────────────────────────
whoosh(at('meet', 13.2), 0.3, 0.06);
add(at('meet', 13.75), 0.5, thud(60, 10), 0.28);
chord(at('meet', 14.35), [72, 76, 79], 0.05, 3.5, 0.02);
add(at('meet', 15.7), 0.3, pluck(mtof(88)), 0.045);
whoosh(at('meet', 16.62), 0.2, 0.06);
// ── client health ────────────────────────────────────────────────────────────
add(at('health', 17.78), 0.06, tick(2200), 0.045);
add(at('health', 18.35), 0.75, glide(660, 330, 0.75), 0.016);
add(at('health', 19.62), 1.0, bell(mtof(81), 5), 0.06); add(at('health', 19.68), 1.0, bell(mtof(77), 5), 0.05);
[20.05, 20.41, 20.77].forEach((x) => add(at('health', x), 0.05, tick(1900), 0.035));
whoosh(at('health', 22.58), 0.22, 0.06);
// ── automations ──────────────────────────────────────────────────────────────
[23.45, 23.81, 24.17, 24.53].forEach((x, i) => add(at('auto', x), 0.25, pluck(mtof(76 + [0, 3, 7, 12][i])), 0.04));
add(at('auto', 25.0), 0.05, tap(), 0.12);
whoosh(at('auto', 25.95), 0.3, 0.05);
add(at('auto', 26.85), 1.0, bell(mtof(86), 5), 0.06, -0.2); add(at('auto', 26.85) + 0.06, 1.0, bell(mtof(91), 5), 0.045, -0.2);
whoosh(at('auto', 27.55), 0.18, 0.045, true, 0.25);
chord(at('auto', 28.1), [84, 88, 91], 0.045, 4, 0.04);
add(at('auto', 28.45), 0.4, glide(330, 660, 0.4), 0.014);
// ── toolkit slams ────────────────────────────────────────────────────────────
for (let i = 0; i < 6; i++) { const t = 11.8 + i * 0.5; add(t, 0.4, thud(52, 10), 0.22); add(t, 0.04, tap(), 0.045); }
// ── overview ─────────────────────────────────────────────────────────────────
whoosh(14.78, 0.45, 0.04);
whoosh(at('overview', 39.25), 0.15, 0.06);
// ── call to action ───────────────────────────────────────────────────────────
add(at('cta', 39.7), 0.5, thud(55, 9), 0.2); add(at('cta', 39.95), 0.5, thud(60, 9), 0.16);
add(at('cta', 40.45), 0.4, pluck(mtof(86)), 0.055);
add(at('cta', 41.55), 0.6, thud(50, 7), 0.18); chord(at('cta', 41.6), [72, 76, 79, 84], 0.045, 2.6, 0.03);
add(at('cta', 42.6), 0.4, pluck(mtof(84)), 0.045);
add(at('cta', 43.95), 0.04, tap(), 0.15); add(at('cta', 43.96), 0.08, tick(1400), 0.055);
add(at('cta', 44.2), 1.6, bell(mtof(96), 3.5), 0.02);

write(process.argv[2] ?? 'dist/demo-fast-sfx.wav');
