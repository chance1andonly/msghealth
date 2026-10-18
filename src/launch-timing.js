// Single source of truth for every cue in the launch film, shared by the picture (src/launch.js) and the
// soundtrack (scripts/launch-audio.mjs). Seconds into the film; the film runs the song's length.
//
// The song (144.7 BPM) is built in two-bar phrases, each opened by an 808: 4.93, 8.24, 11.57, 14.88, 18.20 s;
// the outro then puts an 808 every beat and a half (18.20, 18.83, 19.45, 20.08, 20.70). Every scene change lands on
// one of those 808s or a bar line, and everything inside a scene lands on a beat or an eighth note of that grid.
globalThis.TIMING = (() => {
  const D = 4.93, B = (18.2 - D) / 32, SONG_START = 0; // B: one beat, fitted to the 808s
  const at = (n) => D + n * B;                          // beat n after the drop (bar k starts at beat 4k)
  const T = { B, D, SONG_START, at, DURATION: 20.9 };
  // the opening plays over the intro: [real time, time on the hook's original 6 s design clock]
  T.hookMap = [[0, 0], [0.75, 0.3], [1.6, 1.5], [2.985, 4.0], [3.35, 4.9], [4.5, 5.8], [D, 6.0]];
  T.hookWarp = (t) => { const m = T.hookMap; for (let i = 1; i < m.length; i++) if (t <= m[i][0]) return m[i - 1][1] + (m[i][1] - m[i - 1][1]) * (t - m[i - 1][0]) / (m[i][0] - m[i - 1][0]); return m[m.length - 1][1]; };
  // bar 1 (808): logo — wordmark on beat 2, tagline on the eighths after it
  T.logo = { word: at(1), tag: [at(1.5), at(2), at(2.5), at(2.75), at(3)] };
  T.iris = [at(3.4), at(4)];
  // bar 2: the request is typed a word per eighth note; the click lands on beat 4 and the flood fills by the 808
  T.prompt = { t0: at(4), words: [4.5, 5, 5.5, 6, 6.25, 6.5].map(at), click: at(7), end: at(8) };
  // bars 3–4 (808): Client Health — cards on beat 2, outreach on the eighths of beat 3–4, replies the same in bar 4
  T.app = { t0: at(8), rows: at(9), sms: [10, 10.5, 11, 11.5].map(at), replies: [12, 12.5, 13, 13.5].map(at), toast: at(14), out: at(15.3), end: at(16) };
  // bar 5 (808): at-risk card · bars 6–7: win-backs, switched on by the 808 at 14.88 · then bookings
  T.feat = [at(16), at(20), at(26)];
  T.featEnd = [at(20), at(26), at(29)];
  T.featCues = [[1, 1.5, 2.5, 3], [1, 2, 3, 4], [1, 1.75]].map((ks) => ks.map((n) => n * B)); // beats after each feature starts
  // "Keep your customers." then the logo, on the outro's 808s
  T.end = {
    t0: at(29), hopLine: [at(29), at(29.5)], line: [at(29.2), at(30)],
    keep: at(29.5), customers: at(30.25), hop: [at(30.75), at(31.25)], ring: at(31.25),
    exit: at(31.4),                    // headline leaves; the dot glides to where the mark starts
    draw: [at(32), at(33.5)],          // 808 → 808: the dot draws the mark
    right: [at(33.5), at(34.2)],       // 808: the finished mark slides right
    left: [at(35), at(36)],            // 808: back left, wiping the wordmark in
    url: at(36.5),                     // 808: the URL
  };
  return T;
})();
