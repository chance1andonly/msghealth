window.TOY = { name: 'toydoor', who: 'Dre', emph: ['keep', 'fucking', 'msghealth'], scenes: [
  // L0 hook: my client stopped coming in -> I kicked his door down
  { set: 'shop', f: [0, 1.2], d: 6.5, stat: [[0.15, 'TEXTS SENT: 0']], chairs: [-2.6, 2.6],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }], tags: [{ a: 'y', text: 'YOU', at: 0.3 }] },
  { at: [0, 2.1], set: 'street', f: [-1.6, -3.6], d: 10.5, h: 3.8, ly: 2.3, stat: [[0.9, 'DOORS KICKED: 1']], shops: [{ x: 0, name: "DRE'S HOUSE", house: true, col: '#e8d4a8', roof: '#7a3b2e', signBg: '#4a8fd9', signFg: '#fff', pole: false, w: 6 }],
    actors: [{ id: 'd', k: 'door', x: -1.62, z: -5.85, fall: 0.9 }, { id: 'y', who: 'stylist', x: -1.6, z: -4.2, ry: Math.PI, pose: 'kick' }], sfx: [{ at: 0.9, kind: 'pop', gain: 0.35 }] },
  // L1 his mom
  { at: [1, 0], set: 'street', f: [0, -3], d: 10.5, h: 3.8, ly: 2.3, stat: [[0, 'MOMS FOUGHT: 0']], shops: [{ x: 0, name: "DRE'S MOM", house: true, col: '#f2c9d8', roof: '#8a4a6a', signBg: '#d8323c', signFg: '#fff', pole: false, w: 6 }],
    actors: [{ id: 'm', who: 'mama', path: [[0, -1.6, -5.6], [1.8, 0.9, -2.6]], pose: 'punch' }, { id: 'y', who: 'stylist', x: -1.4, z: -2.6, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'm', text: 'HIS MOM', at: 0.5 }] },
  { at: [1, 2.3], set: 'street', f: [0, -2.6], d: 9, h: 3.6, ly: 2.2, stat: [[0.2, 'MOMS FOUGHT: 1']], shops: [{ x: 0, name: "DRE'S MOM", house: true, col: '#f2c9d8', roof: '#8a4a6a', signBg: '#d8323c', signFg: '#fff', pole: false, w: 6 }],
    actors: [{ id: 'm', who: 'mama', x: 0.9, z: -2.6, ry: -Math.PI / 2, pose: 'punch' }, { id: 'y', who: 'stylist', x: -0.9, z: -2.6, ry: Math.PI / 2, pose: 'punch' }], tags: [{ a: 'y', text: 'IN MY APRON', at: 0.6 }] },
  // L2 grandma
  { at: [2, 0], set: 'street', f: [0, 4], d: 10, h: 3.6, stat: [[0.2, 'GRANDMAS: NEXT']], shops: [{ x: 0, name: "GRANDMA'S", house: true, col: '#cfe0c2', roof: '#5a6a8a', signBg: '#e9a8c8', signFg: '#2a1a2a', pole: false, w: 6 }],
    actors: [{ id: 'c', k: 'car', col: '#d9453a', path: [[0, -9, 6], [1.3, 0, 6]] }] },
  { at: [2, 2.4], set: 'street', f: [0, -2.6], d: 9, h: 3.6, ly: 2.2, stat: [[0.2, 'GRANDMAS FOUGHT: 1']], shops: [{ x: 0, name: "GRANDMA'S", house: true, col: '#cfe0c2', roof: '#5a6a8a', signBg: '#e9a8c8', signFg: '#2a1a2a', pole: false, w: 6 }],
    actors: [{ id: 'g', who: 'mama', big: 0.85, x: 0.9, z: -2.6, ry: -Math.PI / 2, pose: 'swing' }, { id: 'y', who: 'stylist', x: -0.9, z: -2.6, ry: Math.PI / 2, pose: 'shock' }], tags: [{ a: 'g', text: 'GRANDMA (81)', at: 0.4 }] },
  { at: [2, 4.4], set: 'street', f: [-0.4, -2.2], d: 9, h: 3.6, ly: 1.6, stat: [[0.3, 'LOSSES: 2']], shops: [{ x: 0, name: "GRANDMA'S", house: true, col: '#cfe0c2', roof: '#5a6a8a', signBg: '#e9a8c8', signFg: '#2a1a2a', pole: false, w: 6 }],
    actors: [{ id: 'g', who: 'mama', big: 0.85, x: 1.2, z: -2.2, ry: -Math.PI / 2, pose: 'swing' }, { id: 'y', who: 'stylist', x: -1.0, z: -2.2, ry: Math.PI / 2, pose: 'faint', sitY: 0.05 }] },
  // L3 mid CTA
  { at: [3, 0], set: 'shop', f: [0, 1.2], d: 6.2, stat: [[0, 'TEXTS SENT: 0']], chairs: [-2.6, 2.6],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: 'slump' }], tags: [{ a: 'y', text: 'you, right now', at: 0.4 }] },
  // L4 Dre wasn't home, fainted
  { at: [4, 0], set: 'street', f: [0, 3], d: 8, h: 3.2, shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 8 }],
    actors: [{ id: 'd', who: 'dre', path: [[0, 4, 3], [2.8, -3.2, 3]], pose: 'walk' }], tags: [{ a: 'd', text: 'DRE (NOT HOME)', at: 0.5 }] },
  { at: [4, 2.7], set: 'street', f: [0, 3], d: 6.5, h: 3.2, shops: [{ x: -2, name: 'COFFEE', col: '#8a5a3b', signBg: '#fff', signFg: '#3a2a1a', w: 8 }],
    actors: [{ id: 'd', who: 'dre', x: 0, z: 3, ry: 0, pose: [[0, 'phone'], [1.0, 'shock'], [1.9, 'faint']] }], stat: [[1.9, 'DRE: FAINTED']] },
  // L5 soup
  { at: [5, 0], set: 'shop', bare: true, wall: '#dfe9f2', chairs: [], f: [0, 0.8], d: 6.8, h: 3.4, ly: 1.9,
    actors: [{ id: 'b', k: 'bed', x: 0, z: 0.5 }, { id: 'd', who: 'dre', x: 0, z: 0.9, ry: 0, pose: 'faint', sitY: 1.38 }, { id: 'y', who: 'stylist', x: -1.8, z: 1.6, ry: 0.5, pose: 'hold' }, { id: 'o', k: 'bowl', x: -1.3, z: 2.5, y: 1.35 }], tags: [{ a: 'd', text: 'DRE (HOSPITAL)', at: 0.5, dy: 0.3 }] },
  { at: [5, 2.3], set: 'shop', bare: true, wall: '#dfe9f2', chairs: [], f: [-1.3, 2.5], d: 5.2, h: 2.6, ly: 1.7, push: 0.5, stat: [[0.1, 'BONES IN SOUP: 6']],
    actors: [{ id: 'o', k: 'bowl', x: -1.3, z: 2.5, y: 1.0, spin: 0.6 }, { id: 'y', who: 'stylist', x: -1.8, z: 1.6, ry: 0.5, pose: 'hold' }] },
  // L6 choke
  { at: [6, 0], set: 'shop', bare: true, wall: '#dfe9f2', chairs: [], f: [0, 0.6], d: 6.0, h: 3.0, ly: 2.8, stat: [[0.1, 'HEART RATE: 72'], [1.2, 'HEART RATE: 0']],
    actors: [{ id: 'b', k: 'bed', x: 0, z: 0.5 }, { id: 'd', who: 'dre', x: 0, z: 0.6, ry: 0, pose: 'chokesit', sitY: 1.45 }], sfx: [{ at: 1.2, kind: 'ding', gain: 0.2 }] },
  { at: [6, 2.3], set: 'shop', bare: true, wall: '#dfe9f2', chairs: [], f: [0, 1.4], d: 8.0, h: 3.2, ly: 2.5,
    actors: [{ id: 'b', k: 'bed', x: 0, z: 0.5 }, { id: 'd', who: 'dre', x: 0, z: 0.6, ry: 0, pose: 'chokesit', sitY: 1.45 }, { id: 'n1', who: 'nurse', path: [[0, -6, 3], [1.1, -1.9, 2.4], [1.2, -1.9, 2.4]], pose: [[0, 'run'], [1.1, 'shock']] }, { id: 'n2', who: 'nurse', path: [[0, 6, 3], [1.1, 1.9, 2.4], [1.2, 1.9, 2.4]], pose: [[0, 'run'], [1.1, 'shock']] }], tags: [{ a: 'n1', text: 'NURSES (SCREAMING)', at: 1.0, dx: 0 }] },
  { at: [6, 4.2], set: 'shop', bare: true, wall: '#dfe9f2', chairs: [], f: [-0.6, 0.6], d: 7.0, h: 3.0, ly: 2.7,
    actors: [{ id: 'b', k: 'bed', x: 0, z: 0.5 }, { id: 'd', who: 'dre', x: 0.5, z: 0.6, ry: -0.5, pose: 'sit', sitY: 1.45 }, { id: 'y', who: 'stylist', x: -1.8, z: 1.0, ry: Math.PI / 2, pose: 'cry' }], tags: [{ a: 'd', text: 'LAST WORDS', at: 0.4 }] },
  // L7 I just forgot
  { at: [7, 0], set: 'shop', bare: true, wall: '#dfe9f2', chairs: [], f: [0, 0.6], d: 3.6, h: 3.3, ly: 3.2, push: 0.6,
    actors: [{ id: 'b', k: 'bed', x: 0, z: 0.5 }, { id: 'd', who: 'dre', x: 0, z: 0.6, ry: 0, pose: 'sit', sitY: 1.45 }] },
  // L8 the reason
  { at: [8, 0], set: 'shop', f: [0, 1.0], d: 4.4, h: 2.9, ly: 2.4, stat: [[0.2, 'REASON: HE FORGOT']], chairs: [-2.6, 2.6],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: 1.0, ry: 0, pose: 'shock' }] },
  { at: [8, 2.4], set: 'shop', f: [0, 1.2], d: 6.4, stat: [[0.1, 'TEXTS SENT: 0']], chairs: [-2.6, 2.6],
    actors: [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'slump' }], tags: [{ a: 'y', text: 'nobody told him', at: 0.5 }] },
  // L9 the product
  { at: [9, 0], set: 'shop', chairs: [-4.5, 4.5], f: [0, 0], d: 8, h: 3.4, ly: 3.9, wy: 1500,
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 5.0, w: 5.4, h: 3.1, col: '#4f46e5', pop: 0.2, text: ['MsgHealth', 'Marcus — active ✓', 'Dre — 3 weeks quiet', 'Text sent ✓'], rows: { 1: '#e6f6ea', 2: '#fff1d6', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.2, z: 1.6, ry: 0.5, pose: 'point' }], sfx: [{ at: 0.2, kind: 'ding', gain: 0.2 }] },
  { at: [9, 2.5], chatOnly: true, chat: [{ out: true, lines: ['Hey Dre! It\'s been 3 weeks', 'since your fade.', 'Want Thursday at 4?'], at: 0.2, note: 'Sent automatically by MsgHealth ✓' }, { out: false, lines: ['bet. see you thursday'], at: 1.4 }, { card: ['BOOKED', 'Thu · 4:00 PM'], at: 2.2 }] },
  // L10 callback
  { at: [10, 0], set: 'shop', f: [0, 1.2], d: 6.4, chairs: [-2.6, 2.6], stat: [[0.1, 'DOORS KICKED: 0'], [0.9, 'GRANDMAS FOUGHT: 0'], [1.7, 'SOUP: 0'], [2.2, 'TEXTS SENT: 1']],
    actors: [{ id: 'y', who: 'stylist', x: 0.4, z: 1.2, ry: 0, pose: 'cheer' }, { id: 'd', who: 'dre', x: -2.6, z: 0.5, ry: 0, pose: 'sit', sitY: 0.95 }] }
] };
