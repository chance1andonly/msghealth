const TH = { x: 0, name: "TERRENCE'S HOUSE", house: true, col: '#d4e4f4', roof: '#4a5a7a', signBg: '#4a8fd9', signFg: '#fff', pole: false, w: 6 };
const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const LR = (c, a) => ({ set: 'shop', wall: '#e8d4a8', chairs: [-3.4, 3.4], f: [0, 1.0], d: 7.6, h: 3.2, ly: 2.2, ...c, actors: a });
window.TOY = { name: 'toymove', who: 'Terrence', emph: ['keep', 'msghealth'], scenes: [
  SH({ stat: [[0.2, 'CLIENTS GONE: 1']], tags: [{ a: 'y', text: 'YOU', at: 0.3 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [0, 2.2], set: 'street', f: [0, -1.5], d: 11, h: 3.6, ly: 2.2, stat: [[0.2, 'BARBERSHOPS MOVED: 1']], shops: [TH],
    actors: [{ id: 't', k: 'truck', col: '#d9453a', path: [[0, -9, 2], [2.0, 0, -2.6]] }] },
  { at: [1, 0], set: 'street', f: [0, -1.5], d: 11, h: 3.6, ly: 2.2, stat: [[0.2, 'WALLS: 1'], [1.3, 'WALLS: 0']], shops: [{ ...TH, crush: 0.6 }],
    actors: [{ id: 'b', k: 'building', name: "TERRENCE'S HOUSE", col: '#d4e4f4', signBg: '#4a8fd9', signFg: '#fff', w: 6, x: 0, z: -5.5, crush: 0.7 }, { id: 't', k: 'truck', col: '#d9453a', path: [[0, -4, 1], [0.8, 0, -3.6]] }] },
  LR({ at: [1, 2.3], stat: [[0.2, 'LIVING ROOMS: 1']], tags: [{ a: 'y', text: 'NEW SHOP', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.0, ry: 0, pose: 'cheer' }]),
  LR({ at: [2, 0], f: [0, 1.2], d: 7.4, stat: [[0.2, 'COFFEES: 1'], [1.6, 'GOATS FADED: 1']], tags: [{ a: 'g', text: 'HIS GOAT', at: 1.6 }] }, [{ id: 'y', who: 'stylist', x: -1.2, z: 1.2, ry: 0.3, pose: 'cut', tool: 3 }, { id: 'g', k: 'goat', x: 1.4, z: 1.4, ry: -0.4 }]),
  { at: [2, 3.4], set: 'street', f: [0, -2], d: 16, h: 4.8, ly: 2.0, stat: [[0.1, 'NEIGHBORS IN LINE: 40']], shops: [TH], actors: [{ id: 'c', k: 'crowd', n: 14, x: 0, z: -2, ry: 0, pose: 'wave' }] },
  SH({ at: [3, 0], stat: [[0, 'TEXTS SENT: 0']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [4, 0], set: 'street', f: [0, -2.4], d: 10, h: 3.6, ly: 2.2, stat: [[0.1, 'COPS: 1']], shops: [TH],
    actors: [{ id: 'c', who: 'cop', path: [[0, 5, -2.4], [1.4, 1.4, -2.4]], pose: 'walk' }, { id: 'y', who: 'stylist', x: -1.4, z: -2.4, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'c', text: 'THE LAW', at: 0.8 }] },
  LR({ at: [4, 2.6], f: [0, 1.0], d: 8, stat: [[0.2, 'ARRESTS: 0'], [1.2, 'TAPERS: 1']], tags: [{ a: 'c', text: 'ONE TAPER PLEASE', at: 0.4 }] }, [{ id: 'c', who: 'cop', x: -0.2, z: 1.4, ry: 0, pose: 'sit', sitY: 0.95 }, { id: 'y', who: 'stylist', x: 1.4, z: 1.2, ry: -0.6, pose: 'cut', tool: 3 }]),
  { at: [5, 0], set: 'street', f: [0, -1.5], d: 9, h: 3.4, ly: 2.2, stat: [[0.3, 'TERRENCE: HOME']], shops: [TH],
    actors: [{ id: 'm', who: 'marcus', path: [[0, 1.8, -0.2], [2.4, 0.4, -4.2]], pose: 'walk' }, { id: 'y', who: 'stylist', x: -1.0, z: -1.6, ry: 0.6, pose: 'idle' }], tags: [{ a: 'm', text: 'TERRENCE', at: 0.5 }] },
  { at: [5, 2.8], set: 'shop', wall: '#e8d4a8', chairs: [-3.4, 3.4], f: [0, 1.0], d: 7.8, h: 3.0, ly: 2.2, stat: [[0.1, 'GROCERIES: 1']],
    actors: [{ id: 'm', who: 'marcus', x: 1.2, z: 1.4, ry: -0.6, pose: 'shock' }, { id: 'y', who: 'stylist', x: -1.2, z: 1.2, ry: 0.5, pose: 'idle' }, { id: 'g', k: 'goat', x: -3.2, z: 2.0, ry: 0.5 }] },
  { at: [6, 0], set: 'shop', wall: '#e8d4a8', chairs: [-3.4, 3.4], f: [0, 1.0], d: 7.0, h: 3.0, ly: 2.4,
    actors: [{ id: 'm', who: 'marcus', x: 1.0, z: 1.2, ry: -0.5, pose: 'wave' }, { id: 'y', who: 'stylist', x: -1.0, z: 1.2, ry: 0.5, pose: 'shock' }], tags: [{ a: 'm', text: 'WEEK 8 GOT WEIRD', at: 0.6 }] },
  SH({ at: [7, 0], d: 4.6, h: 2.9, ly: 2.4, stat: [[0.2, 'REASON: IT GOT WEIRD']] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'shock' }]),
  SH({ at: [7, 2.6], d: 6.4, stat: [[0.1, 'TEXTS SENT: 0']], tags: [{ a: 'y', text: 'one text', at: 0.5 }] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [8, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1205,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Terrence — 3 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [8, 3.3], chatOnly: true, chat: [{ out: true, lines: ['Hey Terrence! It\'s been', '3 weeks since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.4 }] },
  SH({ at: [9, 0], f: [-0.7, 1.2], d: 7.4, stat: [[0.1, 'TRUCKS: 0'], [0.9, 'WALLS: 0'], [1.7, 'GOATS FADED: 0'], [2.3, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'm', who: 'marcus', x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
