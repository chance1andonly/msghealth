// Voiceover clips (assets/audio/uranus/vo-NN.wav, Kokoro TTS, voice am_michael, speed 1.1): each clip's length and when
// each caption chunk starts inside it (seconds). Found by spreading syllables over the voiced part of each clip and
// snapping every boundary to the quietest nearby frame.
window.VO_CLIPS = [
  { dur: 3.179, chunks: [["What *if* eight billion", 0.0], ["*people* aimed lasers", 1.19], ["at *Uranus?*", 2.49]] }, // 00
  { dur: 0.725, chunks: [["*Three.*", 0.0]] }, // 01
  { dur: 0.64, chunks: [["*Two.*", 0.0]] }, // 02
  { dur: 0.64, chunks: [["*One.*", 0.0]] }, // 03
  { dur: 0.768, chunks: [["*FIRE!*", 0.0]] }, // 04
  { dur: 2.155, chunks: [["*Billions* of beams", 0.0], ["shoot *into* space.", 1.14]] }, // 05
  { dur: 3.52, chunks: [["*But* it could take", 0.0], ["almost *three hours*", 1.09], ["*just* to reach Uranus.", 2.07]] }, // 06
  { dur: 1.6, chunks: [["*And* the beams keep", 0.0], ["*spreading.*", 1.08]] }, // 07
  { dur: 3.755, chunks: [["By then, *one* laser", 0.0], ["could make a spot", 1.25], ["twice as *wide*", 2.01], ["as *the Sun.*", 2.66]] }, // 08
  { dur: 3.392, chunks: [["Uranus *is* just", 0.0], ["*fifty-one* thousand", 1.2], ["*kilometers* wide.", 2.26]] }, // 09
  { dur: 2.112, chunks: [["*So* almost all", 0.0], ["that light *misses.*", 1.04]] }, // 10
  { dur: 1.621, chunks: [["But here's *the weird part.*", 0.0]] }, // 11
  { dur: 4.544, chunks: [["Even if *Uranus* lit up,", 0.0], ["the light coming *back*", 1.84], ["would need *another*", 2.82], ["three *hours.*", 3.94]] }, // 12
  { dur: 1.643, chunks: [["*Six hours* round trip…", 0.0]] }, // 13
  { dur: 4.523, chunks: [["which is *still* faster", 0.0], ["than *most* businesses", 0.98], ["notice a regular", 2.26], ["has stopped *coming.*", 3.32]] }, // 14
  { dur: 3.84, chunks: [["By the time *they* do,", 0.0], ["that customer is *already*", 1.15], ["booked *somewhere else.*", 2.74]] }, // 15
  { dur: 5.397, chunks: [["*MsgHealth* scores", 0.0], ["every customer's *health*,", 1.24], ["and flags who's *at risk*", 2.66], ["the moment they *slip.*", 4.16]] }, // 16
  { dur: 2.432, chunks: [["Then it *texts* them for you,", 0.0], ["so they *book again.*", 1.37]] }, // 17
  { dur: 3.029, chunks: [["*Stop guessing*", 0.0], ["when your customers", 0.87], ["are planning *to leave.*", 1.55]] }, // 18
  { dur: 1.579, chunks: [["*msghealth.net*", 0.0]] }, // 19
];
// What each clip says (the TTS input). "Uranus" is spelled "your anus" so it's read as two words ("your AY-nus") while the
// captions still say Uranus; "MsgHealth" is spelled out so it's read "Message Health".
window.VO_TEXT = [
  'What if eight billion people aimed lasers at your anus?', 'Three.', 'Two.', 'One.', 'Fire!',
  'Billions of beams shoot into space.', 'But it could take almost three hours, just to reach your anus.',
  'And the beams keep spreading.', 'By then, one laser could make a spot twice as wide as the Sun.',
  'Your anus is just fifty-one thousand kilometers wide.', 'So almost all that light misses.', "But here's the weird part.",
  'Even if your anus lit up, the light coming back would need another three hours.', 'Six hours, round trip.',
  'Which is still faster than most businesses notice a regular has stopped coming.',
  'By the time they do, that customer is already booked somewhere else.',
  "Message Health scores every customer's health, and flags who's at risk the moment they slip.",
  'Then it texts them for you, so they book again.', 'Stop guessing when your customers are planning to leave.',
  'Message Health dot net.',
];
