# MsgHealth product demo — voiceover script (ElevenLabs)

For `dist/msghealth-product-demo.mp4` (47 s, 16:9). The video ships with sound effects only
and leaves room for this read. Every line has a window, and each window is timed to the beat
it describes, so the voice and the picture land together.

## Voice direction

- **Tone:** warm, confident and conversational, like one business owner talking to another.
  Keep it friendly; this isn't a movie-trailer read.
- **Pace:** relaxed but purposeful, about 150 words per minute. Let the short lines breathe.
- **Suggested ElevenLabs settings** (Multilingual v2): Stability 45–55 %, Similarity 75 %,
  Style 15–25 %, Speaker Boost on. Pick a natural, mid-range narrator voice.
- **Pronunciation:** the TTS text below spells the brand as **"Message Health"** so it isn't read
  as "M-S-G Health". If the brand is said differently, change it in lines 4, 5 and 9.
  On screen it stays **MsgHealth** / **msghealth.net**.

## Line-by-line (recommended: generate each line as its own clip)

| # | Window | On screen | Line (as spoken) |
|---|---|---|---|
| 1 | 0:00.4 – 0:03.8 | A message drops in, gets delivered… no reply | "Your customers almost never tell you they're leaving." |
| 2 | 0:04.7 – 0:08.3 | *they don't complain. they just* **LEAVE.** | "They don't complain. They just… stop coming back." |
| 3 | 0:09.3 – 0:12.8 | The client list: regulars go quiet one by one | "And by the time you notice, it's too late." |
| 4 | 0:13.6 – 0:16.5 | The dots pull together into the logo | "Meet MsgHealth. Client health, made visible." |
| 5 | 0:17.3 – 0:22.4 | Jordan's score falls 78 → 38 and the **At risk** flag goes up | "It scores every client's health, and flags who's at risk — before they're gone." |
| 6 | 0:23.3 – 0:29.2 | Win-back automation → text → reply → booked; score back to 86 | "Then it reaches out for you — a friendly text, a follow-up email — and books them right back in." |
| 7 | 0:29.7 – 0:34.7 | Feature slams, one every 0.9 s | "Your inbox, bookings, reviews, loyalty, payments and reports — all in one place." |
| 8 | 0:35.3 – 0:38.9 | Overview: Healthy / Needs attention / At risk | "So you always know where you stand — and who needs you next." |
| 9 | 0:39.7 – 0:45.6 | **Stop guessing.** → logo → **Get started** button | "Stop guessing when your customers are planning to leave. Get started today at msghealth dot net." |

Timing notes:

- **Line 2:** the pause in "They just… stop" should land as **LEAVE** rises (about 0:05.4).
- **Line 5:** try to land "at risk" near **0:19.6**, when the red flag pops.
- **Line 7:** each feature name lines up with its slam: Inbox 0:29.6 · Bookings 0:30.5 · Reviews 0:31.4 ·
  Loyalty 0:32.3 · Payments 0:33.2 · Reports 0:34.1. Read it as a list with a slight lift on each word.
- **Line 9:** "Stop guessing" lands with the headline at **0:39.7**, and "Get started" lands with the
  button at about **0:42.6**. The end card holds until 0:47.0.

## Paste-in text for ElevenLabs

**Per-line clips (copy one line at a time):**

```
Your customers almost never tell you they're leaving.
```
```
They don't complain. They just... stop coming back.
```
```
And by the time you notice, it's too late.
```
```
Meet Message Health. Client health, made visible.
```
```
It scores every client's health, and flags who's at risk — before they're gone.
```
```
Then it reaches out for you — a friendly text, a follow-up email — and books them right back in.
```
```
Your inbox, bookings, reviews, loyalty, payments and reports — all in one place.
```
```
So you always know where you stand — and who needs you next.
```
```
Stop guessing when your customers are planning to leave. Get started today at message health dot net.
```

**Single take (Multilingual v2 / Turbo, which support `<break>` tags).** Generate it in one pass,
then nudge each sentence onto its window in your editor. The breaks get each line close to its window:

```
Your customers almost never tell you they're leaving. <break time="0.8s" />
They don't complain. They just... stop coming back. <break time="1.0s" />
And by the time you notice, it's too late. <break time="0.8s" />
Meet Message Health. <break time="0.4s" /> Client health, made visible. <break time="0.8s" />
It scores every client's health, and flags who's at risk — before they're gone. <break time="0.9s" />
Then it reaches out for you — a friendly text, a follow-up email — and books them right back in. <break time="0.5s" />
Your inbox, bookings, reviews, loyalty, payments and reports — all in one place. <break time="0.6s" />
So you always know where you stand — and who needs you next. <break time="0.8s" />
Stop guessing when your customers are planning to leave. <break time="0.6s" /> Get started today at message health dot net.
```

(Eleven v3 doesn't read `<break>` tags. If you use v3, generate per-line clips, or swap each
break for an ellipsis.)

## Mixing

- The sound-effects bed (`dist/demo-sfx.wav`, also inside the MP4) sits at about −27 LUFS with
  peaks around −7 dBFS. Bring the voice in around −16 LUFS (−14 for social) and it will sit
  clearly on top without any ducking.
- If you add music, keep it under the voice by about 18–20 dB. The SFX are sparse on purpose
  so music can go underneath.
