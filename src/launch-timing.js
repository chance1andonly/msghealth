// Single source of truth for every cue in the launch film, shared by the picture (src/launch.js), the
// soundtrack (scripts/launch-audio.mjs) and the beat analysis (scripts/analyse-song.mjs). Seconds into the film.
//
// The film is cut to the song: it runs the song's length, the opening plays over its intro, and the logo flood
// lands on its first 808 (4.93 s). The song is 145 BPM, so a beat is 0.414 s; every act starts on a beat, and
// inside each act things appear on the song's actual hi-hat/percussion hits (src/launch-music.js).
globalThis.TIMING = (() => {
  const B = 60 / 145, D = 4.93, SONG_START = 0;
  const at = (n) => D + n * B; // time of beat n after the drop
  const T = { B, D, SONG_START, at, DURATION: 20.9, HOOK: 6.0 / D }; // the hook was designed on a 6 s clock
  T.iris = [at(3.4), at(4)];                               // logo → prompt
  T.prompt = { t0: at(4), end: at(9) };
  T.app = { t0: at(9), out: at(16.15), end: at(17) };
  T.feat = [at(17), at(21), at(26)];                       // "Win-backs sent for you" gets the longest slot
  const E0 = at(29);
  T.featEnd = [T.feat[1], T.feat[2], E0];
  const e = (n) => E0 + n * B;
  T.end = {
    t0: E0, hopLine: [E0, e(0.5)], line: [e(0.25), e(1.25)],
    keep: e(0.5), customers: e(1.25), hop: [e(1.75), e(2.25)], ring: e(2.25),
    exit: e(2.5),                      // headline leaves (0.3 s); the dot glides to where the mark will start
    draw: [e(3.25), e(5)],             // the dot draws the mark along its strokes
    right: [e(5) + 0.03, e(5.5)],      // the finished mark slides right, to where the wordmark ends
    left: [e(5.75), e(6.75)],          // …then back left into place, wiping the wordmark in behind it
    url: e(7),                         // then the lockup and URL hold to the end
  };
  return T;
})();
