# How MsgHealth reels should sound

The viewer is one barber or stylist in Atlanta scrolling at 11pm. The voice should sound like a person who cuts hair (or knows the business) telling them something they just found out, not like a brand reading a script. If a line could appear in any LinkedIn post, cut it.

## Write it to be spoken
- Read every line out loud. If you'd never say it to a friend, rewrite it.
- Contractions always (it's, don't, you'll). Plain words. No "utilize", "leverage", "crucial", "journey", "game changer", "here's the thing", "let that sink in", "in today's world".
- Vary the rhythm: short, then longer, then short. A run of 3+ clipped fragments sounds like AI ("Same chair. Same cut. Same time."). So does a pattern of "It's not X. It's Y." or "They don't X. They just Y." Use it at most once per reel, and never twice in a row.
- No tidy aphorism to close every line ("X beats Y, every time"). Let one line land as a fact or a question.
- Specific beats general: a number, a name, a day ("Thursday at four thirty"), the actual text you'd send.
- One idea per reel. Hook line = a surprising true fact with a number, in under 14 words. Value by line 2. No throat-clearing.
- Add the small human things: a "look,", a "honestly", a question, a half-joke, a thing barbers actually say. One per reel is plenty. Don't overdo it.
- Never open two lines the same way. Never use more than one rhetorical question per reel.
- Every fact must be true and checked. If sources disagree, round it or leave it out.

## Making the voice stress the right words (Kokoro has no markup, so use the writing)
- English puts the stress on the last important word of a phrase: end the line on the word that matters ("...and he never came back").
- Commas make small pauses: "It was, honestly, the best cut he'd had." Use them before the word you want to land.
- To hit a number or reveal, give it its own beat: "He sold over thirteen thousand cars." then a short next line.
- In scripts/vo/NAME.json, set `"speed"` per line: 1.0-1.05 for the line that should land, 1.15-1.2 for quick setup lines. Use `"gap"` (seconds before the next line): 0.5-0.7 before a turn, 0.15-0.25 when two lines belong together.
- Questions end on a rise: write them as real questions.
- Spell hard words the way they sound in `say` (the on-screen `caps` stay normal). Avoid proper names you can't verify the engine says right; put them on screen instead.

## Before anything posts
`python3 scripts/qa.py NAME` (timing, transcript, wording flags), then read the script and caption once more, then `node posting/ig.mjs approve QUEUEFILE "note"`. Posting refuses any reel without a matching approval.
