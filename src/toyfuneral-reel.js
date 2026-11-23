const CH = (x = 0) => ({ x, name: "ST. MARK'S CHURCH", house: true, col: '#e9e4d8', roof: '#5a4a6a', signBg: '#fff', signFg: '#2a2438', pole: false, w: 6 });
const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const BLK = { k: 'p' };
window.TOY = { name: 'toyfuneral', who: 'Terrell', emph: ['keep', 'msghealth'], scenes: [
  SH({ stat: [[0.2, 'CLIENTS: 1 MISSING']], tags: [{ a: 'y', text: 'YOU', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [0, 2.3], set: 'shop', f: [0, 1.2], d: 5.4, h: 2.8, ly: 2.4, chairs: [-2.6, 2.6], stat: [[0.2, 'ASSUMED: DEAD']],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'cry' }], tags: [{ a: 'y', text: 'NOT PROUD', at: 0.6 }] },
  { at: [1, 0], set: 'street', f: [0, -2.6], d: 9.5, h: 3.4, ly: 2.2, stat: [[0.2, 'FLOWERS: 0'], [0.9, 'FLOWERS: 40']], shops: [CH()],
    actors: [{ id: 'y', who: 'stylist', path: [[0, -4, -1.2], [1.2, -1.8, -1.2]], pose: 'walk' }] },
  { at: [1, 2.6], set: 'street', f: [0, -2.6], d: 9.5, h: 3.4, ly: 2.2, stat: [[0.1, 'ORGAN GUYS: 1']], shops: [CH()],
    actors: [{ id: 'o', who: 'barber', x: 0, z: -2.6, ry: 0, pose: 'cheer' }], tags: [{ a: 'o', text: 'ORGAN GUY', at: 0.4 }] },
  { at: [2, 0], set: 'street', f: [0, -3.4], d: 16, h: 4.6, ly: 2.2, stat: [[0.1, 'MOURNERS: 200']], shops: [CH()],
    actors: [{ id: 'c', k: 'crowd', n: 14, x: 0, z: -1.6, ry: 0, pose: 'shock' }] },
  { at: [2, 2.2], set: 'street', f: [0, -2.6], d: 8, h: 3.2, ly: 2.2, stat: [[0.1, 'KIDS FAINTED: 1']], shops: [CH()],
    actors: [{ id: 'y', who: 'stylist', x: -1.2, z: -2.6, ry: 0.5, pose: 'cry' }, { id: 'k', who: 'kid', x: 1.6, z: -2.6, ry: -0.3, pose: 'faint', sitY: 0.05 }], tags: [{ a: 'y', text: 'EULOGY', at: 0.4 }] },
  SH({ at: [3, 0], stat: [[0, 'CLIENTS: 1 MISSING']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  { at: [4, 0], set: 'street', f: [0, -2.6], d: 9.5, h: 3.4, ly: 2.2, stat: [[0.1, 'SERVICE: STARTING']], shops: [CH()],
    actors: [{ id: 't', who: 'marcus', path: [[0, 0, 0.5], [1.6, 0, -2.4]], pose: 'walk' }], tags: [{ a: 't', text: 'TERRELL', at: 0.7 }] },
  { at: [4, 2.6], set: 'street', f: [0, -2.6], d: 7, h: 3.0, ly: 2.2, stat: [[0.1, 'TERRELL: ALIVE']], shops: [CH()],
    actors: [{ id: 't', who: 'marcus', x: 1.0, z: -2.6, ry: -Math.PI / 2, pose: 'wave' }, { id: 'y', who: 'stylist', x: -1.0, z: -2.6, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 't', text: 'SANDWICH', at: 0.5 }] },
  { at: [5, 0], set: 'street', f: [0, -2.6], d: 7, h: 3.0, ly: 2.2, shops: [CH()],
    actors: [{ id: 't', who: 'marcus', x: 1.0, z: -2.6, ry: -Math.PI / 2, pose: 'point' }, { id: 'y', who: 'stylist', x: -1.0, z: -2.6, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 't', text: 'WHO DIED?', at: 0.4 }] },
  SH({ at: [5, 2.0], f: [-1.0, 1.2], d: 7.5, tags: [{ a: 't', text: 'LINEUP?', at: 0.5 }] }, [{ id: 't', who: 'marcus', x: -2.6, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }, { id: 'y', who: 'stylist', x: 0.6, z: 1.4, ry: -0.3, pose: 'shock' }]),
  { at: [6, 0], set: 'street', f: [0, -1.5], d: 9, h: 3.4, ly: 2.2, stat: [[0.3, 'OTHER BARBER: 2 MONTHS']], shops: [{ x: 0, name: 'FRESH CUTS', col: '#3a4a8a', signBg: '#fff', signFg: '#1c2448', w: 6, pole: false }],
    actors: [{ id: 't', who: 'marcus', x: 0, z: -1.4, ry: 0, pose: 'idle' }], tags: [{ a: 't', text: 'NOBODY TEXTED', at: 0.8 }] },
  { at: [7, 0], set: 'street', f: [0, -2.4], d: 11, h: 3.8, ly: 2.2, stat: [[0.1, 'MOURNERS: 200'], [0.8, 'FLOWERS: 40'], [1.5, 'TEXTS SENT: 0']], shops: [CH()],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: -1, ry: 0, pose: 'slump' }] },
  { at: [8, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1205,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Terrell — 3 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [8, 3.4], chatOnly: true, chat: [{ out: true, lines: ["Hey Terrell! It's been", '3 weeks since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.4 }] },
  SH({ at: [9, 0], f: [-0.7, 1.2], d: 7.4, stat: [[0.1, 'CASKETS: 0'], [0.9, 'ORGAN GUYS: 0'], [1.7, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 't', who: 'marcus', x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
