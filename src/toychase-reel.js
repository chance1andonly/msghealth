const PI = Math.PI;
const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const STR = (c, a) => ({ set: 'street', f: [0, 1], d: 10.5, h: 3.4, ly: 2.2, shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 8, pole: false }], ...c, actors: a });
const PILOT = { skin: '#f1c9a5', shirt: '#4a5a6a', pants: '#2a2c38', hair: '#3a2a1a', hat: '#2a2c38' }, DRV = { skin: '#8d5a3b', shirt: '#2a6f4a', pants: '#2f3445', hair: '#141010' };
window.TOY = { name: 'toychase', who: 'Marcus', emph: ['keep', 'msghealth', 'helicopter', 'parade'], scenes: [
  SH({ stat: [[0.2, 'CLIENTS GONE: 1']], tags: [{ a: 'y', text: 'YOU', at: 0.3 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  STR({ at: [0, 2.0], d: 9.5, stat: [[0.2, 'MILES RUN: 0'], [1.8, 'MILES RUN: 1']], tags: [{ a: 'c', text: 'HIS CAR', at: 0.4 }] },
    [{ id: 'c', k: 'car', col: '#4a8fd9', path: [[0, -3, 1.8], [3.0, 10, 1.8]] }, { id: 'y', who: 'stylist', path: [[0, -6, 0.2], [3.0, 5, 0.2]], pose: 'run' }]),
  STR({ at: [1, 0], d: 10.5, stat: [[0.1, 'MILES RUN: 4']], tags: [{ a: 'y', text: 'ON FOOT', at: 0.3 }] },
    [{ id: 'y', who: 'stylist', path: [[0, -8, 1.6], [2.4, 5, 1.6]], pose: 'run' }, { id: 'c', k: 'car', col: '#4a8fd9', path: [[0, -2, 3.2], [2.4, 14, 3.2]] }]),
  STR({ at: [1, 2.3], f: [0, 2], d: 11, h: 3.2, stat: [[0.2, 'MONSTER TRUCKS: 1']], tags: [{ a: 't', text: 'STOLEN', at: 0.5 }] },
    [{ id: 't', k: 'truck', col: '#d9453a', path: [[0, -6, 2], [1.5, 6, 2]] }]),
  STR({ at: [2, 0], f: [0, -2], d: 15, h: 1.8, ly: 4.2, stat: [[0.2, 'HELICOPTERS: 1']], shops: [] }, [{ id: 'h', k: 'heli', x: 0, z: -2, y: 6.5 }]),
  STR({ at: [2, 2.6], f: [0, 0], d: 5.8, h: 2.8, ly: 2.0, stat: [[0.2, 'PILOT: STILL POLITE']], tags: [{ a: 'p', text: 'PILOT (CRYING)', at: 0.4 }], shops: [] }, [{ id: 'p', who: PILOT, x: 0, z: 0, ry: 0.2, pose: 'cry' }]),
  SH({ at: [3, 0], stat: [[0, 'TEXTS SENT: 0']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  STR({ at: [4, 0], f: [0, 3], d: 11, h: 3.4, stat: [[0.8, 'COP CARS: 11']] },
    [0, 1, 2, 3].map((i) => ({ id: 'c' + i, k: 'car', siren: true, col: '#f2f2f6', path: [[0, -10 - i * 3, 3.2], [1.5, -3 + i * 3, 3.2]] }))),
  STR({ at: [4, 2.6], f: [0, -1.6], d: 15, h: 4.4, stat: [[0.2, 'REPORTERS: 3'], [1.4, 'PARADES: 1']], shops: [] },
    [{ id: 'c', k: 'crowd', n: 12, x: 0, z: -2.4, ry: 0, pose: 'wave' }]),
  STR({ at: [5, 0], f: [0, -2.2], d: 9, h: 3.0, stat: [[0.2, 'WINDOW: DOWN']], tags: [{ a: 'm', text: 'MARCUS (CLIENT)', at: 0.5, size: 40 }], shops: [] },
    [{ id: 'k', k: 'car', col: '#4a8fd9', x: 0, z: -3.8, ry: PI / 2 }, { id: 'm', who: DRV, x: 1.6, z: -2.2, ry: -0.4, pose: 'point' }, { id: 'y', who: 'stylist', x: -1.6, z: -2.2, ry: 0.5, pose: 'slump' }]),
  STR({ at: [5, 4.4], f: [0, -1.6], d: 6.4, h: 3.0, ly: 2.0, stat: [[0.2, 'TEXTS RECEIVED: 0']], shops: [] },
    [{ id: 'm', who: DRV, x: 0.9, z: -1.6, ry: -PI / 2, pose: 'point' }, { id: 'y', who: 'stylist', x: -0.9, z: -1.6, ry: PI / 2, pose: 'shock' }]),
  SH({ at: [6, 0], stat: [[0.2, 'REASON: HE WAS BUSY']], d: 5.4, h: 2.9 }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'faint', sitY: 0.05 }]),
  { at: [7, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1205,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Marcus — 3 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [7, 3.4], chatOnly: true, chat: [{ out: true, lines: ["Hey Marcus! It's been", '3 weeks since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.3 }] },
  SH({ at: [8, 0], f: [-0.7, 1.2], d: 7.4, stat: [[0.1, 'MILES RUN: 0'], [0.8, 'HELICOPTERS: 0'], [1.5, 'PARADES: 0'], [2.2, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'm', who: DRV, x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
