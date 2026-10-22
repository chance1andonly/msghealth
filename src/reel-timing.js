// Cue sheet for the 15.7 s reel, shared by the picture (src/reel.js) and the soundtrack (scripts/reel-audio.mjs).
// The track runs at ~125 BPM: off-beat hi-hats from 1.53 s, the drop (first kick) at 3.21 s, then six 4-beat bars.
// at(n) is beat n counted from the drop; the intro's hats sit on the half beats before it (at(-3.5) … at(-0.5)).
globalThis.TIMING = (() => {
  const E = 0.24018, B = 2 * E, D = 1.525 + 7 * E; // eighth note, beat, the drop
  const at = (n) => D + n * B;
  const T = { E, B, D, at, PUSH: 0.36 };
  T.hats = [-3.5, -2.5, -1.5, -0.5].map(at); // 1.53 · 2.01 · 2.49 · 2.97
  T.scene = [0, at(4), at(8), at(12), at(16), at(20)]; // hook+flag · text · rebook · every client · features · logo
  // the song only runs to bar 7's downbeat in the source; the soundtrack repeats two beats of bar 6 under the end card
  T.MUSIC_END = at(24); T.REPEAT_FROM = at(20); T.DURATION = at(26);
  return T;
})();
