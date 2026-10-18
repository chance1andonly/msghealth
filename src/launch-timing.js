// Single source of truth for every cue in the launch film, shared by the picture (src/launch.js)
// and the soundtrack (scripts/launch-audio.mjs). All times are seconds into the 33 s film.
//
// The song is cut so its first kick (song time 10.345 s) lands at 6.0 s. It runs at 76.2 BPM, so one
// beat is 0.787 s and a bar (4 beats) is 3.148 s; every act below starts on a beat.
globalThis.TIMING = (() => {
  const B = 0.787, D = 6.0, SONG_START = 10.345 - 6.0;
  const at = (n) => D + n * B; // time of beat n after the drop
  const T = { B, D, SONG_START, at, DURATION: 33 };
  T.iris = [at(3.25), at(4)]; // logo → prompt
  T.prompt = { t0: at(4), typeStart: at(5.1), typeDur: 1.55, click: at(7.2) };
  T.prompt.flood = T.prompt.click + 0.1; T.prompt.end = at(8);
  T.app = { t0: at(8), stats: at(8) + 0.7, rows: at(8) + 0.92, hl: at(10), sms: at(10.5), replies: [at(11.5), at(12), at(12.5)], toast: at(13.25), out: at(14.55), end: at(15) };
  T.feat = [at(15), at(18), at(21)]; T.featDur = 3 * B;
  const E0 = at(24);
  T.end = {
    t0: E0, hopLine: [E0, E0 + 0.5], line: [E0 + 0.3, E0 + 1.1],
    keep: at(25), customers: at(26), hop: [at(27.2), at(28)], ring: at(28),
    exit: at(29), logo: at(30), url: at(31.5), urlOut: at(32.8), fold: at(33),
  };
  T.end.foldEnd = T.end.fold + 0.55;
  T.end.loop = { dot: [T.end.foldEnd - 0.25, T.end.foldEnd - 0.05], stub: [T.end.foldEnd - 0.2, T.end.foldEnd], beat: T.end.foldEnd };
  return T;
})();
