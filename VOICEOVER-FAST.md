# MsgHealth fast cut — voiceover script (ElevenLabs)

For `dist/msghealth-product-demo-fast.mp4` (20.5 s, 16:9, 60 fps). It's the same story as the
47 s demo, cut for attention, and the video ships with sound effects only. There are about
45 words in total, so the read stays punchy without being rushed.

## Voice direction

- **Tone:** confident and upbeat, with a little more energy than the long version, but still
  natural, like one owner talking to another. Not a shouty promo read.
- **Pace:** about 160–170 words per minute. Short lines, crisp endings, no trailing off.
- **Suggested ElevenLabs settings** (Multilingual v2): Stability 40–50 %, Similarity 75 %,
  Style 25–35 %, Speaker Boost on. Use the same voice as the long cut.
- **Pronunciation:** the TTS text spells the brand as **"Message Health"**. Change it in
  lines 4 and 9 if it's said differently.

## Line-by-line (recommended: one clip per line)

| # | Window | On screen | Line (as spoken) |
|---|---|---|---|
| 1 | 0:00.05 – 0:01.35 | **Your / customers / are / leaving.** (one word per cut) | "Your customers are leaving…" |
| 2 | 0:01.45 – 0:02.35 | Message read, typing dots give up | "…without a word." |
| 3 | 0:02.45 – 0:04.10 | Regulars go quiet one by one | "And you won't see it coming." |
| 4 | 0:04.30 – 0:05.70 | Dots pull together into the logo | "Meet MsgHealth." |
| 5 | 0:05.90 – 0:08.70 | Score falls 78 → 38, **At risk** flag | "It flags who's at risk — before they're gone." |
| 6 | 0:08.90 – 0:11.70 | Automation → text → reply → booked | "Then reaches out, and books them back in. Automatically." |
| 7 | 0:11.85 – 0:14.70 | Feature slams, one every 0.5 s | "Inbox. Bookings. Reviews. Loyalty. Payments. Reports." |
| 8 | 0:14.85 – 0:16.20 | Overview donut | "All in one place." |
| 9 | 0:16.35 – 0:20.30 | **Stop guessing.** → logo → **Get started →** | "Stop guessing. Get started at msghealth dot net." |

Sync points:

- **Line 1:** one word per slam: Your 0:00.00 · customers 0:00.35 · are 0:00.70 · leaving 0:01.05.
- **Line 5:** "at risk" lands on the red flag at about **0:07.1**.
- **Line 7:** Inbox 0:11.8 · Bookings 0:12.3 · Reviews 0:12.8 · Loyalty 0:13.3 · Payments 0:13.8 · Reports 0:14.3.
- **Line 9:** "Stop guessing" lands with the headline at **0:16.4**, and "Get started" lands as the button
  pops at about **0:18.1**.

## Paste-in text for ElevenLabs

**Per-line clips:**

```
Your customers are leaving...
```
```
...without a word.
```
```
And you won't see it coming.
```
```
Meet Message Health.
```
```
It flags who's at risk — before they're gone.
```
```
Then reaches out, and books them back in. Automatically.
```
```
Inbox. Bookings. Reviews. Loyalty. Payments. Reports.
```
```
All in one place.
```
```
Stop guessing. Get started at message health dot net.
```

**Single take (Multilingual v2 / Turbo; v3 ignores `<break>` tags):**

```
Your customers are leaving... <break time="0.1s" /> without a word. <break time="0.1s" />
And you won't see it coming. <break time="0.3s" />
Meet Message Health. <break time="0.3s" />
It flags who's at risk — before they're gone. <break time="0.3s" />
Then reaches out, and books them back in. Automatically. <break time="0.2s" />
Inbox. Bookings. Reviews. Loyalty. Payments. Reports. <break time="0.2s" />
All in one place. <break time="0.3s" />
Stop guessing. <break time="0.8s" /> Get started at message health dot net.
```

At this pace a single take will drift. Generating per-line clips and placing each one at its
window is much more reliable.

## Mixing

The SFX bed (`dist/demo-fast-sfx.wav`, also in the MP4) sits at about −28 LUFS with peaks
near −11 dBFS. Put the voice at around −14 LUFS for social or −16 LUFS for web, and it sits
on top with no ducking needed.
