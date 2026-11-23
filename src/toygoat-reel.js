// MsgHealth · toygoat · viral toy-world reel
window.TOY = { name: 'toygoat', who: 'Dre', scenes: [
  { set: 'shop', cam: { p: [[0, 0, 3.8, 14], [5, 0, 3.2, 11.5]], look: [[0, 0, 2.3, 0]] }, chairs: [-3.2, 3.2],
    actors: [{ id: 'y', who: 'stylist', x: 3.2, z: 0.6, ry: 0, pose: [[0, 'phone'], [2.6, 'shock']] }],
    tags: [{ a: 'y', text: 'YOU', col: '#2f6bff', at: 0.5 }], big: [{ text: '6 WEEKS QUIET', at: 0.5, y: 520, col: '#ff3b3b', fg: '#fff', size: 96, rot: -0.03 }], sfx: [{ at: 0.5, kind: 'pop' }] },
  { set: 'street', cam: { p: [[0, -6, 3.5, 17], [4, 2, 3.5, 15]], look: [[0, -6, 2, 4], [4, 2, 2, 4]] },
    actors: [{ id: 't', k: 'truck', col: '#e8a43a', path: [[0, -10, 6], [4, 4, 6]] }, { id: 'g', k: 'goat', path: [[0, -6, 3], [4, 8, 3]] }],
    big: [{ text: 'MONSTER TRUCK + GOAT', at: 0.6, y: 520, col: '#f6b800', size: 78, rot: 0.03 }], sfx: [{ at: 0.5, kind: 'whoosh' }] },
  { set: 'street', cam: { p: [[0, -4, 4, 18], [3.5, 4, 4, 16]], look: [[0, 0, 2.5, 3], [3.5, 3, 2.5, 3]] },
    actors: [{ id: 'b', k: 'building', name: 'FADE KING', col: '#7b3fa0', signBg: '#f6b800', signFg: '#111', w: 7, x: 3, z: 3, crush: 2.4 }, { id: 't', k: 'truck', col: '#e8a43a', path: [[0, -9, 8], [2.3, 3, 4], [3, 3, 3.5]], yaw: 0 }],
    big: [{ text: 'FLATTENED', at: 2.5, y: 560, col: '#ff3b3b', fg: '#fff', size: 120, rot: -0.04 }], sfx: [{ at: 2.4, kind: 'pop' }] },
  { set: 'shop', wall: '#8c1f2a', chairCol: '#2b55c8', cam: { p: [[0, -0.5, 3.6, 10], [4, 0, 3.2, 8.6]], look: [[0, -0.2, 2.3, 0]] }, chairs: [-1.7, 1.7],
    actors: [{ id: 'd', who: 'dre', path: [[0, -1.7, 0.5], [3, 1.5, 3]], pose: [[0, 'sitphone'], [1.4, 'wave']] }],
    tags: [{ a: 'd', text: 'DRE', col: '#ec407a', at: 0.5 }], big: [{ text: 'I JUST FORGOT', at: 1.6, y: 540, col: '#f6b800', size: 96, rot: 0.03 }], sfx: [{ at: 1.6, kind: 'pop' }] },
  { set: 'street', cam: { p: [[0, 0, 3.6, 13], [4.5, 0, 3.2, 11]], look: [[0, 0, 1.8, 3]] },
    actors: [{ id: 'c', k: 'car', col: '#f2f2f2', siren: true, path: [[0, -13, 5], [1.2, -1.5, 5]] }, { id: 'y', who: 'stylist', x: 1.5, z: 2.6, ry: 3.1, pose: 'shock' }, { id: 'p', who: 'cop', x: -1.2, z: 2.2, ry: 0.6, pose: 'point' }],
    big: [{ text: 'WEEK THREE', at: 1.2, y: 520, col: '#2f6bff', fg: '#fff', size: 110, rot: -0.03 }], sfx: [{ at: 1.2, kind: 'pop' }] },
  { set: 'shop', cam: { p: [[0, 0, 3.4, 11], [3.5, 0, 3.2, 9.5]], look: [[0, 0, 2.4, 0]] }, chairs: [-4, 4],
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 4.4, w: 5.2, h: 3, col: '#4f46e5', pop: 0.5, text: ['MsgHealth', 'Dre — 7 weeks quiet', 'Text sent ✓', 'Booked: Thu 4pm ✓'], rows: { 1: '#fdecec', 2: '#e6f6ea', 3: '#e6f6ea' } }, { id: 'y', who: 'stylist', x: -3.5, z: 1.5, ry: 0.4, pose: 'point' }],
    big: [{ text: 'NO TRUCK NEEDED', at: 2.8, y: 1240, col: '#f6b800', size: 84, rot: 0.02 }], sfx: [{ at: 0.5, kind: 'ding' }, { at: 2.8, kind: 'pop' }] }
] };
