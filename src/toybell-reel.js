// MsgHealth · toybell · Blue Bell 2015 return · toy-world reel config for src/toy.js
window.TOY = { name: 'toybell', who: 'Jay', scenes: [
  { set: 'street', sky: '#f2a86e', trees: 4, cam: { p: [[0, 0, 3.6, 17], [4.6, 0, 3.2, 15]], look: [[0, 0, 2.2, 0]] },
    shops: [{ x: 0, name: 'TEXAS GROCERY', w: 14, col: '#c94a3a', signBg: '#fff4d6' }],
    actors: [{ id: 'c', k: 'crowd', n: 12, pose: 'idle', x: 0, z: 1, ry: 0 }],
    big: [{ text: 'LINE AT 6 A.M.', at: 0.5, y: 520, col: '#f6b800', size: 100, rot: -0.03 }], sfx: [{ at: 0.5, kind: 'pop' }] },
  { set: 'street', trees: 4, cam: { p: [[0, 0, 3.4, 10], [3.9, 0, 3.0, 8.8]], look: [[0, 0, 2.4, 0]] },
    shops: [{ x: 0, name: 'ICE CREAM', w: 10, col: '#3a7fd9', signBg: '#fff' }],
    actors: [{ id: 'f', who: 'guy', x: 0, z: 1, ry: 0, pose: [[0, 'idle'], [1.6, 'shock']] }],
    tags: [{ a: 'f', text: 'ALL PULLED', col: '#d8323c', at: 1.0 }], big: [{ text: 'ALL GONE', at: 1.8, y: 560, col: '#ff3b3b', fg: '#fff', size: 80, rot: 0.03 }], sfx: [{ at: 1.8, kind: 'pop' }] },
  { set: 'street', trees: 4, cam: { p: [[0, 0, 3.4, 9.5], [3.8, 0, 3.0, 8.2]], look: [[0, 0, 2.4, 0]] },
    shops: [{ x: 0, name: 'ICE CREAM', w: 10, col: '#3a7fd9', signBg: '#fff' }],
    actors: [{ id: 'f', who: 'dre', x: 0, z: 1, ry: 0, pose: 'phone' }],
    tags: [{ a: 'f', text: 'INSTAGRAM', col: '#ec407a', at: 0.8 }], big: [{ text: '4 FLAVORS', at: 1.8, y: 560, col: '#f6b800', size: 110, rot: -0.03 }], sfx: [{ at: 1.8, kind: 'ding' }] },
  { set: 'street', sky: '#f2a86e', trees: 4, cam: { p: [[0, 0, 3.6, 16], [5.2, 0, 3.2, 14]], look: [[0, 0, 2.2, 0]] },
    shops: [{ x: 0, name: 'TEXAS GROCERY', w: 14, col: '#c94a3a', signBg: '#fff4d6' }],
    actors: [{ id: 'c', k: 'crowd', n: 12, pose: 'wave', x: 0, z: 1, ry: 0 }],
    big: [{ text: 'HALF GONE BY 7', at: 2.6, y: 520, col: '#ff3b3b', fg: '#fff', size: 96, rot: 0.03 }], sfx: [{ at: 2.6, kind: 'pop' }] },
  { chatOnly: true, chat: [{ y: 170, out: true, lines: ["Hey Jay, your chair's open Thursday."], at: 1.8 }, { y: 400, out: false, lines: ["Say less. Booking now."], at: 4.4 }] }
] };
