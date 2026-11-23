// MsgHealth · toycfa · Chick-fil-A Birmingham snow 2014 · toy-world reel config for src/toy.js
window.TOY = { name: 'toycfa', who: 'Jay', scenes: [
  { set: 'road', sky: '#c9d3dd', grass: '#eef3f8', trees: 3, roadZ: 6, cam: { p: [[0, 0, 3.8, 17], [4.0, 0, 3.4, 15.5]], look: [[0, 0, 1.6, 6]] },
    actors: [{ id: 'a', k: 'car', col: '#3a7fd9', x: -4.8, z: 6.2, ry: 1.57 }, { id: 'b', k: 'car', col: '#d9453a', x: 0, z: 6.2, ry: 1.57 }, { id: 'c', k: 'car', col: '#f6b800', x: 4.8, z: 6.2, ry: 1.57 }],
    tags: [{ a: 'b', text: 'STUCK 7 HOURS', col: '#d8323c', at: 0.8, dy: 0 }], big: [{ text: 'NO FOOD. NO WATER.', at: 2.4, y: 520, col: '#f6b800', size: 84, rot: -0.03 }], sfx: [{ at: 2.4, kind: 'pop' }] },
  { set: 'street', sky: '#c9d3dd', grass: '#eef3f8', trees: 3, cam: { p: [[0, 0, 3.4, 10], [3.8, 0, 3.0, 8.8]], look: [[0, 0, 2.4, 0]] },
    shops: [{ x: 0, name: 'CHICK-FIL-A', w: 10, col: '#e8e8ee', signBg: '#d8323c', signFg: '#fff', pole: false }],
    actors: [{ id: 'f', who: 'tony', x: 0, z: 1, ry: 0, pose: [[0, 'shock'], [1.6, 'wave']] }],
    tags: [{ a: 'f', text: 'STAFF', col: '#d8323c', at: 0.6 }], big: [{ text: 'SNOWED IN TOO', at: 1.0, y: 560, col: '#f6b800', size: 100, rot: 0.03 }], sfx: [{ at: 1.0, kind: 'pop' }] },
  { set: 'street', sky: '#c9d3dd', grass: '#eef3f8', trees: 3, cam: { p: [[0, 0, 3.6, 14], [4.2, 0, 3.2, 12.5]], look: [[0, 0, 2.2, 0]] },
    shops: [{ x: 0, name: 'CHICK-FIL-A', w: 12, col: '#e8e8ee', signBg: '#d8323c', signFg: '#fff', pole: false }],
    actors: [{ id: 'f', who: 'tony', x: -1.5, z: 1, ry: 0.3, pose: 'point' }, { id: 'c', k: 'crowd', n: 6, pose: 'idle', x: 3, z: 2.5, ry: 0 }],
    big: [{ text: 'SEVERAL HUNDRED. FREE.', at: 0.5, y: 520, col: '#f6b800', size: 80, rot: -0.03 }], sfx: [{ at: 0.5, kind: 'pop' }] },
  { set: 'street', sky: '#c9d3dd', grass: '#eef3f8', trees: 3, cam: { p: [[0, 0, 3.4, 9.5], [4.8, 0, 3.0, 8.2]], look: [[0, 0, 2.4, 0]] },
    shops: [{ x: 0, name: 'CHICK-FIL-A', w: 10, col: '#e8e8ee', signBg: '#d8323c', signFg: '#fff', pole: false }],
    actors: [{ id: 'f', who: 'guy', x: 0, z: 1, ry: 0, pose: [[0, 'idle'], [1.2, 'shock']] }],
    tags: [{ a: 'f', text: 'DRIVER', col: '#2f6bff', at: 0.5 }], big: [{ text: 'WAIT, FREE?', at: 1.6, y: 560, col: '#ff3b3b', fg: '#fff', size: 112, rot: 0.03 }], sfx: [{ at: 1.6, kind: 'pop' }] },
  { chatOnly: true, chat: [{ y: 170, out: true, lines: ["Hey Jay, got you a spot Thursday."], at: 4.0 }, { y: 400, out: false, lines: ["You're the best. Booking now."], at: 5.4 }] }
] };
