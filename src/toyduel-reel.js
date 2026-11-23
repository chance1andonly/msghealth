const DAWN = { sky: '#f2a86e' };
const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const LOT = (c, a) => ({ set: 'lot', ...DAWN, f: [0, -1], d: 10, h: 3.4, ly: 2.2, ...c, actors: a });
const FC = { x: 0, name: 'FRESH CUTS', col: '#3a4a8a', signBg: '#fff', signFg: '#1c2448', w: 6, pole: false };
window.TOY = { name: 'toyduel', who: 'Jaylen', emph: ['keep', 'msghealth'], scenes: [
  { set: 'street', f: [-0.6, -1.5], d: 9, h: 3.2, ly: 2.2, stat: [[0.3, 'HAIRCUTS ELSEWHERE: 1']], shops: [FC],
    actors: [{ id: 'j', who: 'marcus', x: 0.6, z: -1.4, ry: 0.3, pose: 'idle' }, { id: 'y', who: 'stylist', x: -2.0, z: 0.4, ry: 0.5, pose: 'shock' }], tags: [{ a: 'j', text: 'JAYLEN', at: 0.4 }] },
  { at: [0, 2.6], set: 'street', f: [0, -2.6], d: 8, h: 3.2, ly: 2.2, stat: [[0.1, 'DUELS: 1']], shops: [FC],
    actors: [{ id: 'y', who: 'stylist', x: -1.0, z: -2.6, ry: Math.PI / 2, pose: 'point' }, { id: 'b', who: 'barber', x: 1.0, z: -2.6, ry: -Math.PI / 2, pose: 'shock' }], tags: [{ a: 'b', text: 'THE OTHER BARBER', at: 0.5 }] },
  LOT({ at: [1, 0], stat: [[0.1, 'TIME: 5:58 AM']], f: [0, 0], d: 9 }, [{ id: 'y', who: 'stylist', x: -2.0, z: 0, ry: Math.PI / 2, pose: 'idle', tool: 3 }, { id: 'b', who: 'barber', x: 2.0, z: 0, ry: -Math.PI / 2, pose: 'idle', tool: 3 }]),
  LOT({ at: [1, 2.6], stat: [[0.1, 'PACES: 10']], f: [0, 0], d: 8, h: 2.8 }, [{ id: 'y', who: 'stylist', x: -1.4, z: 0, ry: Math.PI / 2, pose: 'cut', tool: 3 }, { id: 'b', who: 'barber', x: 1.4, z: 0, ry: -Math.PI / 2, pose: 'cut', tool: 3 }]),
  LOT({ at: [2, 0], stat: [[0.1, 'SPECTATORS: 300']], f: [0, -3], d: 16, h: 4.8 }, [{ id: 'c', k: 'crowd', n: 14, x: 0, z: -2, ry: 0, pose: 'wave' }]),
  LOT({ at: [2, 2.4], stat: [[0.1, 'HELICOPTERS: 1']], f: [0, -2], d: 15, h: 1.8, ly: 4.2 }, [{ id: 'h', k: 'heli', x: 0, z: -2, y: 6.5 }]),
  SH({ at: [3, 0], stat: [[0, 'DUELS: 1']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  LOT({ at: [4, 0], stat: [[0.1, 'FIRE!']], f: [0, 0], d: 9 }, [{ id: 'y', who: 'stylist', x: -2.0, z: 0, ry: Math.PI / 2, pose: 'point' }, { id: 'b', who: 'barber', x: 2.0, z: 0, ry: -Math.PI / 2, pose: 'point' }]),
  LOT({ at: [4, 2.6], stat: [[0.1, 'HOT TOWEL: DIRECT HIT']], f: [-0.3, 0], d: 8.5 }, [{ id: 'y', who: 'stylist', x: -0.6, z: 0.6, ry: 0.5, pose: 'faint', sitY: 0.05 }, { id: 'b', who: 'barber', x: 1.6, z: 0, ry: -Math.PI / 2, pose: 'cheer' }]),
  LOT({ at: [5, 0], f: [0, -1], d: 8 }, [{ id: 'j', who: 'marcus', path: [[0, 0, -6], [1.8, 0, -1.2]], pose: 'run' }, { id: 'y', who: 'stylist', x: -2.0, z: 0, ry: Math.PI / 2, pose: 'slump' }], ),
  { at: [5, 2.6], set: 'lot', ...DAWN, f: [0, 0], d: 7.4, h: 3.0, ly: 2.2, stat: [[0.1, 'STOP: 3']], actors: [{ id: 'j', who: 'marcus', x: 0.9, z: 0, ry: -Math.PI / 2, pose: 'wave' }, { id: 'y', who: 'stylist', x: -0.9, z: 0, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'j', text: 'STOP STOP STOP', at: 0.4 }] },
  { at: [6, 0], set: 'lot', ...DAWN, f: [0, 0], d: 7.4, h: 3.0, ly: 2.2, stat: [[0.1, 'TEXTS RECEIVED: 0']], actors: [{ id: 'j', who: 'marcus', x: 0.9, z: 0, ry: -Math.PI / 2, pose: 'point' }, { id: 'y', who: 'stylist', x: -0.9, z: 0, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'j', text: 'YOU NEVER TEXTED', at: 0.5 }] },
  LOT({ at: [7, 0], stat: [[0.1, 'HAIRCUTS ELSEWHERE: 1'], [0.8, 'TEXTS SENT: 0']], f: [0, -2], d: 14 }, [{ id: 'c', k: 'crowd', n: 10, x: 0, z: -2.4, ry: 0, pose: 'shock' }, { id: 'y', who: 'stylist', x: 0, z: 0.4, ry: 0, pose: 'slump' }]),
  { at: [8, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1205,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Jaylen — 3 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [8, 3.4], chatOnly: true, chat: [{ out: true, lines: ['Hey Jaylen! It\'s been', '3 weeks since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.4 }] },
  SH({ at: [9, 0], f: [-0.7, 1.2], d: 7.4, stat: [[0.1, 'CAPES: 0'], [0.9, 'HELICOPTERS: 0'], [1.7, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'j', who: 'marcus', x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
