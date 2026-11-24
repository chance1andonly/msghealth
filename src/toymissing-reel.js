const GAS = { x: 0, name: 'GAS + HOT DOGS', col: '#d9a43a', signBg: '#d8323c', signFg: '#fff', w: 6, pole: false };
const MH = { x: 0, name: "MARCUS'S HOUSE", house: true, col: '#d4e4f4', roof: '#4a5a7a', signBg: '#4a8fd9', signFg: '#fff', pole: false, w: 6 };
const POL = { x: 0, name: 'POLICE', col: '#3a4a8a', signBg: '#fff', signFg: '#1c2448', w: 6, pole: false };
const MISSING = (x) => ({ x, name: 'MISSING: MARCUS', col: '#f4f4f0', signBg: '#d8323c', signFg: '#fff', w: 5, pole: false });
const SHOPS = (c, a, x) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
window.TOY = { name: 'toymissing', who: 'Marcus', emph: ['keep', 'msghealth'], scenes: [
  SHOPS({ stat: [[0.2, 'CLIENTS MISSING: 1']], tags: [{ a: 'y', text: 'YOU', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [0, 2.0], set: 'street', f: [0, -2.6], d: 9, h: 3.6, ly: 2.2, stat: [[0.2, 'REPORTS FILED: 1']], shops: [POL],
    actors: [{ id: 'c', who: 'cop', x: 0.9, z: -2.6, ry: -Math.PI / 2, pose: 'idle' }, { id: 'y', who: 'stylist', x: -0.9, z: -2.6, ry: Math.PI / 2, pose: 'point' }], tags: [{ a: 'c', text: 'OFFICER', at: 0.4 }] },
  { at: [1, 0], set: 'street', f: [0, -2.6], d: 9, h: 3.6, ly: 2.2, shops: [POL], stat: [[0, 'REPORTS FILED: 1']],
    actors: [{ id: 'c', who: 'cop', x: 0.9, z: -2.6, ry: -Math.PI / 2, pose: 'point' }, { id: 'y', who: 'stylist', x: -0.9, z: -2.6, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'c', text: "HE'S AN ADULT", at: 0.5 }] },
  { at: [1, 2.3], set: 'street', f: [0, -2.4], d: 11, h: 3.8, ly: 2.2, stat: [[0, 'POSTERS: 0'], [0.3, 'POSTERS: 400'], [0.9, 'POSTERS: 4,000']], shops: [MISSING(-5), MISSING(0), MISSING(5)],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: -1, ry: 0, pose: 'cheer' }] },
  { at: [2, 0], set: 'street', f: [0, 0], d: 10, h: 3.0, ly: 3.2, stat: [[0.1, 'MILK CARTONS: 1']], shops: [],
    actors: [{ id: 'p', k: 'panel', x: 0, z: 0, y: 3.2, w: 3.0, h: 3.8, col: '#4a8fd9', pop: 0.1, text: ['MILK', 'MISSING', 'MARCUS'], rows: { 1: '#fff1f1', 2: '#fff1f1' } }] },
  { at: [2, 1.6], set: 'street', f: [0, 0], d: 13, h: 3.0, ly: 4.3, stat: [[0.1, 'BILLBOARDS: 1']],
    actors: [{ id: 'p', k: 'panel', x: 0, z: 0, y: 4.4, w: 6.6, h: 4.0, col: '#d8323c', pop: 0.1, text: ['MISSING', 'MARCUS', '9 WEEKS'], rows: { 1: '#fdecec', 2: '#fdecec' } }] },
  { at: [2, 3.2], set: 'street', f: [0, -3], d: 15, h: 1.8, ly: 4.2, stat: [[0.1, 'HELICOPTERS: 1']], shops: [MH],
    actors: [{ id: 'h', k: 'heli', x: 0, z: -2, y: 6.5 }], tags: [{ a: 'h', text: 'LOUDSPEAKER', at: 0.5, dy: 5 }] },
  SHOPS({ at: [3, 0], stat: [[0, 'CLIENTS FOUND: 0']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [4, 0], set: 'street', f: [0, 2.5], d: 10, h: 3.4, ly: 2.0, stat: [[0.1, 'NATIONAL GUARD: 1']], shops: [],
    actors: [{ id: 's1', who: 'soldier', path: [[0, -6, 3], [1.6, -2, 3], [1.7, -2, 3]], pose: [[0, 'run'], [1.6, 'point']] }, { id: 's2', who: 'soldier', path: [[0, 6, 3], [1.6, 2, 3], [1.7, 2, 3]], pose: [[0, 'run'], [1.6, 'point']] }, { id: 's3', who: 'soldier', path: [[0, 0, -4], [1.6, 0, 2.4]], pose: 'run' }], tags: [{ a: 's3', text: 'NATIONAL GUARD', at: 0.6 }] },
  { at: [4, 2.3], set: 'street', f: [0, 2.5], d: 6.8, h: 3.2, ly: 2.2, stat: [[0.1, 'WHO CALLED THEM: ???']],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: 2.5, ry: 0, pose: 'shock' }, { id: 's1', who: 'soldier', x: -2.2, z: 2.2, ry: 0.4, pose: 'point' }, { id: 's2', who: 'soldier', x: 2.2, z: 2.2, ry: -0.4, pose: 'point' }] },
  { at: [5, 0], set: 'street', f: [0, -1.5], d: 9.5, h: 3.4, ly: 2.2, stat: [[0.3, 'HOT DOGS: 1']], shops: [GAS],
    actors: [{ id: 'm', who: 'marcus', path: [[0, -1.6, -5.0], [3.2, 0, -0.6]], pose: 'walk' }], tags: [{ a: 'm', text: 'MARCUS', at: 0.6 }] },
  { at: [6, 0], set: 'street', f: [0, 0], d: 7.5, h: 3.2, ly: 2.2, shops: [GAS],
    actors: [{ id: 'm', who: 'marcus', x: 0.9, z: 0, ry: -Math.PI / 2, pose: 'wave' }, { id: 'y', who: 'stylist', x: -0.9, z: 0, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'm', text: 'I THOUGHT YOU MOVED', at: 1.0 }] },
  SHOPS({ at: [7, 0], d: 4.6, h: 2.9, ly: 2.4, stat: [[0.2, 'MINUTES AWAY: 10']] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'shock' }]),
  { at: [8, 0], set: 'street', f: [0, -2.4], d: 11, h: 3.8, ly: 2.2, stat: [[0.1, 'POSTERS USED: 4,000']], shops: [MISSING(-5), MISSING(0), MISSING(5)],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: -1, ry: 0, pose: 'slump' }] },
  SHOPS({ at: [8, 2.2], d: 6.5, tags: [{ a: 'm', text: "WOULD'VE COME BACK", at: 0.5 }] }, [{ id: 'm', who: 'marcus', x: -2.6, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }, { id: 'y', who: 'stylist', x: 0.6, z: 1.4, ry: -0.3, pose: 'wave' }]),
  { at: [9, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1500,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Marcus — 3 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [9, 3.0], chatOnly: true, chat: [{ out: true, lines: ['Hey Marcus! It\'s been', '3 weeks since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.4 }] },
  SHOPS({ at: [10, 0], d: 6.4, stat: [[0.1, 'POSTERS: 0'], [0.9, 'HELICOPTERS: 0'], [1.7, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'm', who: 'marcus', x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
