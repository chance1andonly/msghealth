const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const PANEL = (text, rows, o = {}) => ({ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.6, h: o.h || 3.4, col: '#4f46e5', pop: 0.15, text, rows });
const PS = (c, text, rows, more = []) => ({ set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 10, h: 3.4, ly: 3.9, wy: 1500, ...c, actors: [PANEL(text, rows, { h: text.length > 4 ? 3.9 : 3.2 }), ...more] });
const LIST = ['Client health', 'Marcus — active ✓', 'Ava — drifting', 'Dre — 7 weeks quiet', 'Tasha — 11 weeks quiet'], LR = { 1: '#e6f6ea', 2: '#fff1d6', 3: '#fdecec', 4: '#fdecec' };
const MSG = ["Hey Tasha, it's been 11 weeks", 'since your twist-out.', 'Want Thursday at 4?'];
window.TOY = { name: 'toyexplain4', who: 'Tasha', emph: ['keep', 'msghealth'], scenes: [
  SH({ stat: [[0.2, 'CLIENTS GONE QUIET: ?'], [2.6, 'NAMES YOU KNOW: 2']], tags: [{ a: 'y', text: 'YOU', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'shock' }]),
  PS({ at: [1, 0], stat: [[0.1, 'STEP 1: SCORE']] }, LIST, LR, [{ id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }]),
  PS({ at: [1, 3.4], stat: [[0, 'STEP 1: SCORE']], d: 8.5, ly: 4.0 }, LIST, LR),
  PS({ at: [2, 0], stat: [[0.1, 'SORTED: ACTIVE / DRIFTING / QUIET']], d: 8.5, ly: 4.0 }, LIST, LR),
  PS({ at: [3, 0], stat: [[0.1, 'STEP 2: TEXT']] }, ['Auto text', 'Hey Tasha, been a minute.', 'Want Thursday at 4?', 'Sent in your voice ✓'], { 1: '#fdfdfb', 2: '#fdfdfb', 3: '#e6f6ea' }, [{ id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'phone' }]),
  { at: [3, 2.4], chatOnly: true, chat: [{ out: true, lines: MSG, at: 0.2, note: 'Sent automatically by MsgHealth ✓' }] },
  PS({ at: [4, 0], stat: [[0.1, 'KEEP = YOUR LIST']] }, ['Gone quiet', 'Tasha — 11 weeks', 'Dre — 7 weeks', 'Marcus — 9 weeks'], { 1: '#fdecec', 2: '#fdecec', 3: '#fdecec' }, [{ id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }]),
  { at: [5, 0], chatOnly: true, stat: [[0.1, 'STEP 3: BOOK']], chat: [{ out: true, lines: MSG, at: -1, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 0.2 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 1.2 }] },
  SH({ at: [5, 2.6], d: 8.5, stat: [[0.1, 'STEP 3: BOOKED']], tags: [{ a: 't', text: 'TASHA', at: 0.4 }] }, [{ id: 't', who: 'dre', x: -1.0, z: 0.8, ry: 0, pose: 'sit', sitY: 0.95 }, { id: 'y', who: 'stylist', x: 1.4, z: 1.4, ry: -0.4, pose: 'cut' }]),
  PS({ at: [6, 0] }, ['One inbox', 'Review request sent ✓', 'Payment received ✓', 'Next visit booked ✓'], { 1: '#e6f6ea', 2: '#e6f6ea', 3: '#e6f6ea' }),
  SH({ at: [6, 3.8], d: 6.5, stat: [[0.1, 'REVIEW: 5 STARS']] }, [{ id: 't', who: 'dre', x: 0, z: 1.2, ry: 0, pose: 'cheer' }]),
  SH({ at: [7, 0], d: 8.5, stat: [[0.1, 'YOU: CUTTING HAIR']] }, [{ id: 't', who: 'dre', x: -1.0, z: 0.8, ry: 0, pose: 'sit', sitY: 0.95 }, { id: 'y', who: 'stylist', x: 1.4, z: 1.4, ry: -0.4, pose: 'cut' }]),
  SH({ at: [7, 2.2], d: 6.5, stat: [[0.1, 'TEXTS SENT: 1']], tags: [{ a: 'y', text: 'before they forget', at: 0.5 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'phone' }])
] };
