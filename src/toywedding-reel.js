const PI = Math.PI;
const WH = { x: 0, name: 'WEDDING', house: true, col: '#f2e6f0', roof: '#8a4a6a', signBg: '#fff', signFg: '#8a4a6a', w: 6, pole: false };
const GROOM = { skin: '#8d5a3b', shirt: '#1a1a22', pants: '#1a1a22', hair: '#141010' }, BRIDE = { skin: '#c98b62', shirt: '#f6f3ee', pants: '#f6f3ee', hair: '#2a1b12' }, UNCLE = { skin: '#a86d48', shirt: '#7a3b3b', pants: '#2a2c38', hair: '#bdbdc4' }, COP = { skin: '#f1c9a5', shirt: '#2a3f7a', pants: '#1a2440', hair: '#3a2a1a', hat: '#1a2440' };
const SH = (c, a) => ({ set: 'shop', f: [0, 1.2], d: 6.2, chairs: [-2.6, 2.6], ...c, actors: a });
const STR = (c, a) => ({ set: 'street', f: [0, -2.4], d: 10, h: 3.4, ly: 2.2, shops: [WH], ...c, actors: a });
window.TOY = { name: 'toywedding', who: 'Jamal', emph: ['keep', 'msghealth', 'helicopter'], scenes: [
  SH({ stat: [[0.2, 'CLIENTS GONE: 1']], tags: [{ a: 'y', text: 'YOU', at: 0.3 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  STR({ at: [0, 2.2], f: [0, -2], d: 15, h: 1.8, ly: 4.2, stat: [[0.2, 'HELICOPTERS: 1']] }, [{ id: 'h', k: 'heli', x: 0, z: -2, y: 6.5 }]),
  STR({ at: [1, 0], f: [0, -2.4], d: 14, h: 4.4, stat: [[0.2, 'GUESTS SCREAMING: 40']], tags: [{ a: 'b', text: 'BRIDE', at: 0.4 }] },
    [{ id: 'c', k: 'crowd', n: 12, x: 0, z: -3.6, ry: 0, pose: 'shock' }, { id: 'b', who: BRIDE, x: 0.4, z: -1.0, ry: 0, pose: 'shock' }]),
  STR({ at: [1, 4.0], f: [0, -1.2], d: 6.8, h: 3.0, ly: 2.0, shops: [], stat: [[0.2, 'CLIPPERS: 1']], tags: [{ a: 'y', text: 'YOU (IN APRON)', at: 0.4 }] },
    [{ id: 'y', who: 'stylist', x: 0, z: -1.2, ry: 0, pose: 'cut', tool: 3 }]),
  STR({ at: [2, 0], f: [0, -2.2], d: 9, h: 3.4, ly: 2.0, stat: [[0.2, 'UNCLES: 1'], [2.0, 'CAKES RUINED: 1']], tags: [{ a: 'u', text: 'HIS UNCLE', at: 0.4 }] },
    [{ id: 'u', who: UNCLE, x: -1.2, z: -2.2, ry: PI / 2, pose: 'punch' }, { id: 'y', who: 'stylist', x: 0.5, z: -2.2, ry: -PI / 2, pose: [[0, 'shock'], [1.9, 'faint']], sitY: 0.05 }]),
  SH({ at: [3, 0], stat: [[0, 'TEXTS SENT: 0']], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }]),
  STR({ at: [4, 0], f: [0, 3], d: 11, h: 3.4, ly: 2.0, stat: [[0.8, 'COP CARS: 3']] },
    [0, 1, 2].map((i) => ({ id: 'c' + i, k: 'car', siren: true, col: '#f2f2f6', path: [[0, -10 - i * 3, 3.2], [1.4 + i * 0.1, -3 + i * 3, 3.2]] }))),
  STR({ at: [4, 3.0], f: [0, -2.2], d: 8, h: 3.2, ly: 2.0, stat: [[0.2, 'FADES MISSED: 2']], tags: [{ a: 'o', text: 'OFFICER', at: 0.3 }, { a: 'y', text: 'YOU', at: 0.9 }] },
    [{ id: 'o', who: COP, x: 1.0, z: -2.2, ry: -PI / 2, pose: 'point' }, { id: 'y', who: 'stylist', x: -1.0, z: -2.2, ry: PI / 2, pose: 'idle' }]),
  STR({ at: [5, 0], f: [0, -2.2], d: 8, h: 3.2, ly: 2.0, stat: [[0.2, 'REASON: GETTING MARRIED']], tags: [{ a: 'g', text: 'THE GROOM (CLIENT)', at: 0.5, size: 40 }] },
    [{ id: 'g', who: GROOM, path: [[0, 4, -2.2], [1.2, 1.0, -2.2]], pose: 'walk' }, { id: 'y', who: 'stylist', x: -1.0, z: -2.2, ry: PI / 2, pose: 'shock' }]),
  STR({ at: [5, 3.6], f: [0, -2.2], d: 6.6, h: 3.0, ly: 2.0, shops: [], stat: [[0.2, 'TEXTS RECEIVED: 0']] },
    [{ id: 'g', who: GROOM, x: 0.8, z: -2.2, ry: -PI / 2, pose: 'cry' }, { id: 'y', who: 'stylist', x: -0.8, z: -2.2, ry: PI / 2, pose: 'slump' }]),
  SH({ at: [6, 0], stat: [[0.2, 'VENUES BANNED FROM: ALL']], d: 5.4, h: 2.9 }, [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'cry' }]),
  { at: [7, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1205,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Jamal — 3 weeks quiet', 'Text sent ✓', 'Booked: Fri 4pm ✓'], rows: { 1: '#fff1d6', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [7, 3.4], chatOnly: true, chat: [{ out: true, lines: ["Hey Jamal! It's been", '3 weeks since your fade.', 'Want Friday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you friday'], at: 1.4 }, { card: ['BOOKED', 'Fri · 4:00 PM'], at: 2.3 }] },
  SH({ at: [8, 0], f: [-0.7, 1.2], d: 7.4, stat: [[0.1, 'HELICOPTERS: 0'], [0.8, 'CAKES RUINED: 0'], [1.5, 'COP CARS: 0'], [2.2, 'TEXTS SENT: 1']] }, [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'm', who: GROOM, x: -1.7, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }])
] };
