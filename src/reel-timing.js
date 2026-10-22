// Cue sheet for the 15.7 s reel, shared by the picture (src/reel.js) and the soundtrack (scripts/reel-audio.mjs).
// The track runs at ~125 BPM: off-beat hi-hats from 1.53 s, the drop (first kick) at 3.21 s, then six 4-beat bars.
// at(n) is beat n counted from the drop; the intro's hats sit on the half beats before it (at(-3.5) … at(-0.5)).
globalThis.TIMING = (() => {
  const E = 0.24018, B = 2 * E, D = 1.525 + 7 * E; // eighth note, beat, the drop
  const at = (n) => D + n * B;
  const T = { E, B, D, at, PUSH: 0.4 };
  T.hats = [-3.5, -2.5, -1.5, -0.5].map(at); // 1.53 · 2.01 · 2.49 · 2.97
  T.scene = [0, at(4), at(8), at(12), at(16), at(19.5)]; // hook+flag · text · rebook · every client · features · end card
  // the end card: "msghealth.net" is typed into a search bar, Enter on the "and", the app icon on beat 3, the line on bar 7
  T.type = { t0: at(20) + 0.18, enter: at(22.5) };
  T.type.step = (T.type.enter - 0.1 - T.type.t0) / 12; // 13 characters
  T.icon = at(23); T.tag = at(24);
  T.click = at(12.5); // the cursor switches on auto win-backs
  // the song only runs to bar 7's downbeat in the source; the soundtrack repeats two beats of bar 6 under the end card
  T.MUSIC_END = at(24); T.REPEAT_FROM = at(20); T.DURATION = at(26);
  // sound effects (names from assets/audio/sfx-pack.wav, see scripts/reel-audio.mjs): [name, time, gain]
  T.sfx = [
    ['loading', 0.0, 0.32], ['gears', T.hats[0], 0.3],                 // the counter climbing
    ['switch', T.hats[0], 0.5], ['switch', T.hats[1], 0.4], ['switch', T.hats[2], 0.4],
    ['glitch1', T.hats[3], 0.55],                                         // she tips into "At risk"
    ['reverb', D, 0.7],                                                   // the drop: card → dashboard
    ['glitch2', at(1), 0.45], ['glitch3', at(2), 0.45], ['glitch1', at(3), 0.4], // three more flagged
    ['zap', at(4) - 0.04, 0.45], ['open', at(5), 0.55], ['switch', at(6), 0.35], ['open', at(7), 0.45],
    ['zap', at(8) - 0.04, 0.45], ['open', at(9), 0.5], ['success', at(10), 0.6], ['switch', at(11), 0.4],
    ['zap', at(12) - 0.04, 0.45], ['switch', T.click, 0.6], ['switch', at(13), 0.35], ['switch', at(14), 0.35], ['success', at(15), 0.5],
    ['glitchT', at(16) - 0.55, 0.5], ['zap', at(17), 0.35], ['zap', at(18), 0.35], ['zap', at(19), 0.35],
    ...Array.from({ length: 13 }, (_, i) => ['key' + (i % 6), T.type.t0 + i * T.type.step, 0.55]),
    ['open', T.type.enter, 0.6], ['reverb', T.icon, 0.6], ['success', T.tag, 0.45],
  ];
  return T;
})();
