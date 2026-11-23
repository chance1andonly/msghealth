// MsgHealth · toysaturn · Saturn Homecoming 1994 · toy-world reel config for src/toy.js
window.TOY = { name: 'toysaturn', who: 'Jay', scenes: [
  { set: 'lot', trees: 6, cam: { p: [[0, 0, 3.8, 17], [5.0, 0, 3.4, 15.5]], look: [[0, 0, 2.2, 0]] },
    shops: [{ x: 0, name: 'SATURN FACTORY', w: 16, col: '#9fb6d9', signBg: '#2b55c8', signFg: '#fff', pole: false }],
    actors: [{ id: 'a', k: 'car', col: '#3a7fd9', path: [[0, -14, 6.2], [5, 24, 6.2]] }, { id: 'b', k: 'car', col: '#d9453a', path: [[0, -24, 6.2], [5, 14, 6.2]] }, { id: 'c', k: 'car', col: '#f6b800', path: [[0, -34, 6.2], [5, 4, 6.2]] }],
    big: [{ text: '44,000 OWNERS', at: 0.4, y: 520, col: '#f6b800', size: 104, rot: -0.03 }], sfx: [{ at: 0.4, kind: 'whoosh' }] },
  { set: 'lot', trees: 6, cam: { p: [[0, 0, 3.6, 16], [5.5, 0, 3.2, 14]], look: [[0, 0, 2.2, 0]] },
    shops: [{ x: 0, name: 'SPRING HILL, TENNESSEE', w: 16, col: '#9fb6d9', signBg: '#2b55c8', signFg: '#fff', pole: false }],
    actors: [{ id: 'c', k: 'crowd', n: 18, pose: 'wave', x: 0, z: 0.5, ry: 0 }],
    big: [{ text: '3-DAY PARTY', at: 0.6, y: 520, col: '#f6b800', size: 108, rot: 0.03 }], sfx: [{ at: 0.6, kind: 'pop' }] },
  { set: 'street', trees: 4, cam: { p: [[0, 0, 3.4, 9.5], [3.2, 0, 3.0, 8.2]], look: [[0, 0, 2.4, 0]] },
    shops: [{ x: 0, name: 'SATURN', w: 10, col: '#9fb6d9', signBg: '#2b55c8', signFg: '#fff', pole: false }],
    actors: [{ id: 'f', who: 'guy', x: 0, z: 1, ry: 0, pose: 'point' }],
    tags: [{ a: 'f', text: 'OWNER', col: '#2f6bff', at: 0.6 }], big: [{ text: 'KEEP THE OWNERS', at: 1.6, y: 560, col: '#f6b800', size: 92, rot: -0.03 }], sfx: [{ at: 1.6, kind: 'pop' }] },
  { set: 'shop', chairs: [-7, 7], cam: { p: [[0, 0, 4.2, 15], [4.0, 0, 3.8, 12.6]], look: [[0, 0, 2.2, 0]] },
    actors: [{ id: 'c', k: 'crowd', n: 12, pose: 'wave', x: 0, z: 1, ry: 0 }],
    big: [{ text: 'YOUR CLIENT LIST', at: 0.6, y: 520, col: '#f6b800', size: 92, rot: -0.03 }], sfx: [{ at: 0.6, kind: 'pop' }] },
  { chatOnly: true, chat: [{ y: 170, out: true, lines: ["Hey Jay, we miss you,", "your chair's open Thursday."], at: 2.2 }, { y: 440, out: false, lines: ["Ha, I'll be there."], at: 4.0 }] }
] };
