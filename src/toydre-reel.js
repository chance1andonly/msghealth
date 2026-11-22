// MsgHealth · toydre · toy-world reel config for src/toy.js
window.TOY = { name: 'toydre', who: 'Dre', scenes: [
  { set: 'shop', cam: { p: [[0, 0, 3.8, 15], [5.5, 0, 3.2, 12.6]], look: [[0, 0, 2.3, 0]] }, chairs: [-3.2, 3.2],
    actors: [{ id: 'y', who: 'stylist', x: 3.2, z: 0.6, ry: 0, pose: 'sleep', sitY: 0 }],
    tags: [{ a: 'y', text: 'YOU, WAITING', col: '#2f6bff', at: 0.6, dx: 0 }], big: [{ text: "DRE'S CHAIR: EMPTY", at: 0.5, y: 520, col: '#f6b800', size: 96, rot: -0.03 }], sfx: [{ at: 0.5, kind: 'pop' }] },
  { set: 'shop', cam: { p: [[0, 0, 3.4, 8.2], [3.4, 0, 3.1, 6.8]], look: [[0, 0, 2.6, 0]] }, chairs: [-6, 6],
    actors: [{ id: 'y', who: 'stylist', x: 0, z: 1.2, ry: 0, pose: [[0, 'phone'], [3.2, 'shock']] }],
    big: [{ text: 'FRESH FADE. NOT YOURS.', at: 3.2, y: 560, col: '#ff3b3b', fg: '#fff', size: 88, rot: 0.03 }], sfx: [{ at: 3.2, kind: 'pop' }] },
  { set: 'road', roadZ: 6, cam: { lin: true, p: [[0, -12, 3.0, 16], [4.6, 14, 3.0, 16]], look: [[0, -12, 1.4, 6], [4.6, 14, 1.4, 6]] },
    actors: [{ id: 'c', k: 'car', col: '#3a7fd9', plants: true, path: [[0, -12, 6.2], [4.6, 14, 6.2]], hop: true }],
    big: [{ text: 'ACROSS ATLANTA', at: 0.4, y: 520, col: '#f6b800', size: 104, rot: -0.03 }], sfx: [{ at: 0.3, kind: 'whoosh' }] },
  { set: 'shop', wall: '#8c1f2a', chairCol: '#2b55c8', cam: { p: [[0, -0.6, 3.6, 10.2], [5.2, 0, 3.2, 8.6]], look: [[0, -0.2, 2.3, 0]] }, chairs: [-1.7, 1.7],
    actors: [{ id: 'd', who: 'dre', x: -1.7, z: 0.5, ry: 0, pose: [[0, 'sitphone'], [3.6, 'wave']] }, { id: 't', who: 'tony', x: 0.9, z: 2.0, ry: -0.5, pose: 'cut' }],
    tags: [{ a: 'd', text: 'DRE', col: '#ec407a', at: 0.6 }, { a: 't', text: "TONY'S", col: '#f6b800', at: 1.0 }], big: [{ text: 'I MEANT TO BOOK', at: 3.6, y: 560, col: '#f6b800', size: 96, rot: 0.03 }], sfx: [{ at: 3.6, kind: 'pop' }] },
  { chatOnly: true, chat: [{ y: 170, out: true, lines: ["Hey Dre, been a minute.", "Want your usual Thursday?"], at: 0.3 }, { y: 440, out: false, lines: ["Ha, yes. Booking now."], at: 2.0 }] }
] };
