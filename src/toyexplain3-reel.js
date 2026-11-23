const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const PANEL = (text, rows, o = {}) => ({ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.6, h: o.h || 3.4, col: '#4f46e5', pop: 0.15, text, rows });
const PS = (c, text, rows, more = []) => ({ set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 10, h: 3.4, ly: 3.9, wy: 1205, ...c, actors: [PANEL(text, rows, { h: text.length > 4 ? 3.9 : 3.2 }), ...more] });
const CUT = [{ id: 'd', who: 'dre', x: -1.0, z: 0.8, ry: 0, pose: 'sit', sitY: 0.95 }, { id: 'y', who: 'stylist', x: 1.4, z: 1.4, ry: -0.4, pose: 'cut' }];
window.TOY = { name: 'toyexplain3', who: 'Dre', emph: ['keep', 'msghealth'], scenes: [
  SH({ stat: [[0.2, 'YOU: CUTTING HAIR']], d: 8.5 }, CUT),
  { at: [0, 2.3], set: 'street', f: [0, 3], d: 7, h: 3.0, ly: 2.0, stat: [[0.1, 'CLIENTS GONE QUIET: 1']], shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 6, pole: false }],
    actors: [{ id: 'd', who: 'dre', path: [[0, 3, 3], [1.4, 0.6, 3]], pose: 'phone' }], tags: [{ a: 'd', text: 'NOT BOOKED', at: 0.5 }] },
  PS({ at: [1, 0] }, ['MsgHealth', 'For Atlanta barbers', 'and stylists'], { 1: '#e6f6ea' }),
  SH({ at: [1, 2.6], d: 8.5, tags: [{ a: 'b', text: 'BARBER', at: 0.3 }, { a: 'y', text: 'STYLIST', at: 0.8 }] }, [{ id: 'b', who: 'barber', x: -1.6, z: 1.2, ry: 0.2, pose: 'cut' }, { id: 'y', who: 'stylist', x: 1.6, z: 1.2, ry: -0.2, pose: 'cut' }]),
  PS({ at: [2, 0], stat: [[0.1, 'STEP 1: SCORE']] }, ['Client health', 'Marcus — active ✓', 'Ava — drifting', 'Dre — 7 weeks quiet', 'Tasha — 11 weeks quiet'], { 1: '#e6f6ea', 2: '#fff1d6', 3: '#fdecec', 4: '#fdecec' }),
  PS({ at: [3, 0], stat: [[0.1, 'STEP 2: TEXT']] }, ['Win-back text', 'Dre — 7 weeks quiet', 'Text sent ✓', 'You did nothing'], { 1: '#fdecec', 2: '#e6f6ea', 3: '#fdfdfb' }, [{ id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'cut' }]),
  { at: [4, 0], chatOnly: true, chat: [{ out: true, lines: ['Hey Dre, it\'s been 7 weeks', 'since your fade.', 'Want Thursday at 4?'], at: -1, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 0.2 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 1.2 }] },
  SH({ at: [4, 2.8], d: 8.5, stat: [[0.1, 'STEP 3: BOOKED']], tags: [{ a: 'd', text: 'BOOKED', at: 0.4 }] }, CUT),
  PS({ at: [5, 0], stat: [[0.1, 'KEEP = YOUR LIST']] }, ['Gone quiet', 'Dre — 7 weeks', 'Tasha — 11 weeks', 'Marcus — 9 weeks'], { 1: '#fdecec', 2: '#fdecec', 3: '#fdecec' }),
  PS({ at: [6, 0], stat: [[0.1, 'ALSO INSIDE']] }, ['Also in the app', 'Review requests ✓', 'Payments ✓', 'One shared inbox ✓'], { 1: '#e6f6ea', 2: '#e6f6ea', 3: '#e6f6ea' }),
  SH({ at: [6, 3.0], d: 6.5, stat: [[0.1, 'REVIEW: 5 STARS']] }, [{ id: 'd', who: 'dre', x: 0, z: 1.2, ry: 0, pose: 'cheer' }]),
  SH({ at: [7, 0], d: 8.5, stat: [[0.1, 'YOU: CUTTING HAIR']] }, CUT),
  SH({ at: [7, 2.4], d: 6.4, stat: [[0.1, 'TEXTS YOU SENT: 0']], tags: [{ a: 'y', text: 'just cutting hair', at: 0.5 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'cheer' }])
] };
