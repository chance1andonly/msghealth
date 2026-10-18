// Single source of truth for every cue in the launch film, shared by the picture (src/launch.js), the
// soundtrack (scripts/launch-audio.mjs) and the beat analysis (scripts/analyse-song.mjs). Seconds into the film.
//
// The song is cut so its first kick (song time 10.345 s) lands on the drop at 4.5 s. It runs at 76.2 BPM:
// one beat is 0.787 s and every act below starts on a beat. Inside each act, things appear on the song's
// actual percussion hits (src/launch-music.js), so the screen builds along with the music.
globalThis.TIMING = (() => {
  const B = 0.787, D = 4.5, SONG_START = 10.345 - D;
  const at = (n) => D + n * B; // time of beat n after the drop
  const T = { B, D, SONG_START, at, DURATION: 33, HOOK: 6.0 / D }; // the hook plays 1.33× faster than it was designed
  T.iris = [at(3.4), at(4)]; // logo → prompt
  T.prompt = { t0: at(4), end: at(8) };
  T.app = { t0: at(8), out: at(16.55), end: at(17) };
  T.feat = [at(17), at(20), at(23)]; T.featDur = 3 * B;
  const E0 = at(26);
  T.end = {
    t0: E0, hopLine: [E0, E0 + 0.5], line: [E0 + 0.3, E0 + 1.1],
    keep: at(27), customers: at(28), hop: [at(29.2), at(30)], ring: at(30),
    exit: at(31), logo: at(32), url: at(33.3), urlOut: at(34.4), fold: at(34.8),
  };
  T.end.foldEnd = T.end.fold + 0.55;
  T.end.loop = { dot: [T.end.foldEnd - 0.25, T.end.foldEnd - 0.05], stub: [T.end.foldEnd - 0.2, T.end.foldEnd], beat: T.end.foldEnd };
  return T;
})();
