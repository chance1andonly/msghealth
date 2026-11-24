const DET = { skin: '#c98b62', shirt: '#8a7a5e', pants: '#4a4030', hair: '#2a1b12', hat: '#6b5a40' };
const GRO = { x: 0, name: 'GROCERY', col: '#5a9a5a', signBg: '#fff', signFg: '#2a5a2a', w: 7, pole: false };
const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const STR = (c, a) => ({ set: 'street', f: [0, 0], d: 10, h: 3.4, ly: 2.2, shops: [], ...c, actors: a });
window.TOY = { name: 'toydetective', who: 'Terrence', emph: ['keep', 'msghealth'], scenes: [
  SH({ stat: [[0.2, 'CLIENTS GONE: 1']], tags: [{ a: 'y', text: 'YOU', at: 0.3 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  STR({ at: [0, 2.2], f: [0, -2.6], d: 9, stat: [[0.2, 'DETECTIVES HIRED: 1']], shops: [{ x: 0, name: 'PRIVATE EYE', col: '#3a3a4a', signBg: '#111', signFg: '#f6b800', w: 6, pole: false }] },
    [{ id: 'd', who: DET, x: 0.9, z: -2.6, ry: -Math.PI / 2, pose: 'idle' }, { id: 'y', who: 'stylist', x: -0.9, z: -2.6, ry: Math.PI / 2, pose: 'point' }], ),
  STR({ at: [1, 0], f: [0, 1], d: 10, stat: [[0.2, 'DAYS FOLLOWED: 9']], shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 8 }] },
    [{ id: 'm', who: 'marcus', path: [[0, 5, 1], [3.5, -5, 1]], pose: 'walk' }, { id: 'd', who: DET, path: [[0, 8, 1], [3.5, -2, 1]], pose: 'walk' }], ),
  STR({ at: [1, 2.6], f: [0, 1.5], d: 6.6, h: 3.0, stat: [[0.2, 'TRENCH COATS: 1']], tags: [{ a: 'd', text: 'IN AUGUST', at: 0.4 }] },
    [{ id: 'd', who: DET, x: 0, z: 1.5, ry: 0, pose: 'point' }]),
  STR({ at: [2, 0], f: [0, 3.5], d: 9, stat: [[0.8, 'TRACKERS: 1']], shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 8 }] },
    [{ id: 'c', k: 'car', col: '#4a8fd9', path: [[0, -9, 3.5], [1.0, 0, 3.5]] }], ),
  STR({ at: [2, 2.0], f: [0, -2], d: 15, h: 1.8, ly: 4.2, stat: [[0.2, 'DRONES: 1']], shops: [{ x: 0, name: "TERRENCE'S HOUSE", house: true, col: '#d4e4f4', roof: '#4a5a7a', signBg: '#4a8fd9', signFg: '#fff', pole: false, w: 6 }] },
    [{ id: 'h', k: 'heli', x: 0, z: -2, y: 6.5 }]),
  STR({ at: [2, 3.6], f: [0, 1], d: 10, stat: [[0.2, 'DETECTIVES: 2']], shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 8 }] },
    [{ id: 'm', who: 'marcus', path: [[0, 5, 1], [3.2, -5, 1]], pose: 'walk' }, { id: 'd', who: DET, path: [[0, 7, 1], [3.2, -3, 1]], pose: 'walk' }, { id: 'e', who: DET, path: [[0, 9, 1], [3.2, -1, 1]], pose: 'walk' }], ),
  SH({ at: [3, 0], stat: [[0, 'TEXTS SENT: 0']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [4, 0], set: 'shop', f: [0, 0], d: 8, h: 3.4, ly: 3.9, chairs: [-4.5, 4.5], wy: 1205, stat: [[0.2, 'INVOICE: $4,000']],
    actors: [{ id: 'p', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#3a3a4a', pop: 0.2, text: ['INVOICE', 'Detective x2', 'Drone x1', 'Total: $4,000'], rows: { 1: '#fff1d6', 2: '#fff1d6', 3: '#fdecec' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'shock' }] },
  SH({ at: [4, 2.6], d: 6.2, stat: [[0.1, 'HIS GROCERY LIST: ALL OF IT']] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'faint', sitY: 0.05 }]),
  STR({ at: [5, 0], f: [0, -1.5], d: 9, stat: [[0.3, 'GROCERY STORE']], shops: [GRO] },
    [{ id: 'm', who: 'marcus', x: 0.8, z: -1.4, ry: -0.4, pose: 'idle' }, { id: 'y', who: 'stylist', path: [[0, -5, 1], [1.4, -1.4, -1.0]], pose: 'run' }], ),
  STR({ at: [5, 2.8], f: [0, -2.6], d: 14, h: 4.4, stat: [[0.2, 'WITNESSES: 40']], shops: [GRO] },
    [{ id: 'c', k: 'crowd', n: 10, x: 0, z: -2.4, ry: 0, pose: 'shock' }]),
  STR({ at: [6, 0], f: [0, 0], d: 7.4, h: 3.0, shops: [GRO] },
    [{ id: 'm', who: 'marcus', x: 0.9, z: -0.8, ry: -Math.PI / 2, pose: 'wave' }, { id: 'y', who: 'stylist', x: -0.9, z: -0.8, ry: Math.PI / 2, pose: 'shock' }], ),
  SH({ at: [7, 0], d: 4.6, h: 2.9, ly: 2.4, stat: [[0.2, 'DETECTIVES: 2'], [0.9, 'DRONES: 1'], [1.6, 'TEXTS: 0']] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'shock' }]),
  { at: [8, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1205,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Terrence — 3 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [8, 3.3], chatOnly: true, chat: [{ out: true, lines: ['Hey Terrence! It\'s been', '3 weeks since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['yes! see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.4 }] },
  SH({ at: [9, 0], f: [-0.7, 1.2], d: 7.4, stat: [[0.1, 'DETECTIVES: 0'], [0.9, 'DRONES: 0'], [1.7, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'm', who: 'marcus', x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
