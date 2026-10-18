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
  T.app = { t0: at(8), out: at(14.55), end: at(15) };   // ends one beat after the toast
  T.feat = [at(15), at(18), at(22)];                       // "Win-backs sent for you" gets 4 beats
  const E0 = at(25);
  T.featEnd = [T.feat[1], T.feat[2], E0];
  T.end = {
    t0: E0, hopLine: [E0, E0 + 0.5], line: [E0 + 0.3, E0 + 1.1],
    keep: at(26), customers: at(27), hop: [at(27.5), at(28)], ring: at(28),
    exit: at(29),                      // headline leaves; the dot glides to the centre
    draw: [at(30), at(31.5)],          // the dot draws the mark along its strokes
    right: [at(31.5) + 0.05, at(32)],  // the finished mark slides right, to where the wordmark ends
    left: [at(32.25), at(33)],         // …then back left to its place, wiping the wordmark in behind it
    url: at(33.25), urlOut: at(34.5), fold: at(34.85),
  };
  T.end.foldEnd = T.end.fold + 0.55;
  T.end.loop = { dot: [T.end.foldEnd - 0.25, T.end.foldEnd - 0.05], stub: [T.end.foldEnd - 0.2, T.end.foldEnd], beat: T.end.foldEnd };
  return T;
})();
