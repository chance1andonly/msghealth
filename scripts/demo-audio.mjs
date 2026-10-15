// Sound design for the 47 s product demo (demo.html): restrained UI sound effects only.
// No music and no voice; the voiceover (VOICEOVER.md) is recorded separately and laid on top.
//   node scripts/demo-audio.mjs dist/demo-sfx.wav
import { mixer, mtof } from './sfx-lib.mjs';

const { add, rnd, thud, pluck, bell, tick, tap, glide, whoosh, chord, write } = mixer(47);

// ── 01 the silence ───────────────────────────────────────────────────────────
[[1.0, 0.5], [1.55, 0.34], [1.98, 0.2], [2.28, 0.11], [2.48, 0.05]].forEach(([t, g]) => { add(t, 0.4, thud(), g); add(t, 0.03, tap(), g * 0.15); });
add(2.6, 0.5, pluck(mtof(84)), 0.08);                      // ball becomes a message
add(3.0, 0.08, tick(2400), 0.05, 0.3);                     // delivered
for (let t = 3.2; t < 3.75; t += 0.16) add(t, 0.04, tick(1500), 0.018, -0.3); // typing…
add(3.95, 1.4, bell(mtof(76), 3), 0.05); add(4.05, 1.4, bell(mtof(71), 3), 0.045); // …no reply
add(4.15, 0.5, glide(520, 140, 0.5), 0.05);                // falls through the floor
// ── 02 the problem ───────────────────────────────────────────────────────────
whoosh(5.3, 0.45, 0.07);
add(5.75, 0.4, pluck(mtof(79)), 0.07);
whoosh(5.85, 0.3, 0.04, true, 0.2);
[7.25, 7.37, 7.49, 7.61, 7.73].forEach((t, i) => add(t + 0.25, 0.3, thud(55 + i * 4, 18), 0.07));
// ── 03 churn ─────────────────────────────────────────────────────────────────
whoosh(9.0, 0.6, 0.04);
for (let k = 0; k < 27; k++) add(10.05 + k * 0.074, 0.06, tick(1700 - k * 22), 0.02 + 0.008 * Math.abs(rnd()), -0.4 + 0.8 * Math.abs(rnd()));
// ── 04 meet MsgHealth ────────────────────────────────────────────────────────
whoosh(13.15, 0.65, 0.07, true);
add(13.75, 0.5, thud(60, 10), 0.3);
chord(14.35, [72, 76, 79], 0.055);
whoosh(15.2, 0.4, 0.035);
add(15.7, 0.4, pluck(mtof(88)), 0.05);
whoosh(16.6, 0.42, 0.07);
// ── 05 client health ─────────────────────────────────────────────────────────
whoosh(17.0, 0.4, 0.035);
add(17.78, 0.06, tick(2200), 0.05);
add(18.35, 1.5, glide(660, 330, 1.5), 0.018);
add(18.95, 0.06, tick(1800), 0.04);
add(19.62, 1.2, bell(mtof(81), 4), 0.065); add(19.74, 1.2, bell(mtof(77), 4), 0.055);
[20.05, 20.41, 20.77].forEach((t) => add(t, 0.06, tick(1900), 0.04));
whoosh(22.58, 0.42, 0.07);
// ── 06 automations ───────────────────────────────────────────────────────────
[23.45, 23.81, 24.17, 24.53].forEach((t, i) => add(t, 0.3, pluck(mtof(76 + [0, 3, 7, 12][i])), 0.045));
add(25.0, 0.05, tap(), 0.14); add(25.02, 0.08, tick(1300), 0.05);
add(25.3, 0.4, glide(900, 1800, 0.4), 0.02);
whoosh(25.95, 0.55, 0.06);
add(26.85, 1.2, bell(mtof(86), 5), 0.065, -0.2); add(26.95, 1.2, bell(mtof(91), 5), 0.05, -0.2);
whoosh(27.55, 0.3, 0.05, true, 0.25);
chord(28.1, [84, 88, 91], 0.05, 4, 0.07);
add(28.45, 0.9, glide(330, 660, 0.9), 0.016);
add(29.25, 0.4, pluck(mtof(91)), 0.05);
// ── 07 toolkit slams ─────────────────────────────────────────────────────────
for (let i = 0; i < 6; i++) { const t = 29.6 + i * 0.9; add(t, 0.5, thud(52, 9), 0.26); add(t, 0.05, tap(), 0.05); whoosh(t - 0.12, 0.2, 0.03, true, i % 2 ? 0.3 : -0.3); }
// ── 08 overview ──────────────────────────────────────────────────────────────
whoosh(35.1, 1.1, 0.04);
add(36.4, 1.5, glide(400, 800, 1.5), 0.012);
whoosh(39.2, 0.45, 0.07);
// ── 09 call to action ────────────────────────────────────────────────────────
add(39.7, 0.5, thud(55, 9), 0.22); add(39.95, 0.5, thud(60, 9), 0.18);
add(40.45, 0.4, pluck(mtof(86)), 0.06);
add(41.55, 0.6, thud(50, 7), 0.2); chord(41.6, [72, 76, 79, 84], 0.05, 2.2, 0.05);
add(42.6, 0.4, pluck(mtof(84)), 0.05);
add(43.95, 0.04, tap(), 0.16); add(43.96, 0.08, tick(1400), 0.06);
add(44.2, 1.6, bell(mtof(96), 3.5), 0.022);

write(process.argv[2] ?? 'dist/demo-sfx.wav');
