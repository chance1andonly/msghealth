// MsgHealth · twinkie · toy-world reel config for src/toy.js
window.TOY = { name: 'twinkie', who: 'Marcus', scenes: [
  { set: 'street', shops: [{ x: 0, name: 'CORNER STORE', col: '#c84b3a', sign: '#f6b800', w: 12 }],
    cam: { p: [[0, 0, 3.2, 10], [4.4, 0.6, 3.0, 8.8]], look: [[0, 0, 2.2, 0]] },
    actors: [{ id: 'g', who: 'guy', x: 0, z: 0.5, ry: 0, pose: [[0, 'idle'], [2.3, 'shock']] }],
    tags: [{ a: 'g', text: 'TWINKIES: $5', col: '#2f6bff', at: 0.5 }],
    big: [{ text: '3 BOXES: $300', at: 2.1, y: 560, col: '#ff3b3b', fg: '#fff', size: 100, rot: 0.03 }], sfx: [{ at: 2.1, kind: 'pop' }] },
  { set: 'street', shops: [{ x: 0, name: 'HOSTESS', col: '#2b55c8', sign: '#f3f3f6', w: 12 }],
    cam: { p: [[0, 0, 3.2, 10], [3.6, 0.5, 3.0, 8.8]], look: [[0, 0, 2.2, 0]] },
    actors: [{ id: 'g', who: 'guy', x: 0, z: 0.5, ry: 0, pose: [[0, 'phone'], [1.6, 'shock']] }],
    big: [{ text: 'CLOSING FOR GOOD', at: 1.6, y: 560, col: '#f6b800', size: 96, rot: -0.03 }], sfx: [{ at: 1.6, kind: 'pop' }] },
  { set: 'street', shops: [{ x: 0, name: 'WALGREENS', col: '#d8323c', sign: '#f3f3f6', w: 12 }],
    cam: { p: [[0, 0, 3.4, 11], [4.5, 0, 3.2, 10]], look: [[0, 0, 2.2, 0]] },
    actors: [{ id: 'g', who: 'guy', path: [[0, -1.8, 1], [2.2, 1.8, 1], [4.6, 1.8, 1]], ry: 1.5, pose: [[0, 'run'], [2.4, 'idle']] }],
    tags: [{ a: 'g', text: 'FRI NIGHT', col: '#ec407a', at: 0.4 }],
    big: [{ text: 'THEN TARGET', at: 2.6, y: 560, col: '#f6b800', size: 104, rot: 0.03 }], sfx: [{ at: 0.3, kind: 'whoosh' }, { at: 2.6, kind: 'pop' }] },
  { set: 'shop', cam: { p: [[0, 0, 3.4, 9.5], [4.1, 0, 3.1, 8]], look: [[0, 0, 2.5, 0]] }, chairs: [-1.8, 1.8],
    actors: [{ id: 'm', who: 'marcus', x: -1.8, z: 0.6, ry: 0, pose: [[0, 'sitphone'], [2.4, 'shock']] }, { id: 'b', who: 'barber', x: 1.8, z: 1.4, ry: 0, pose: 'idle' }],
    tags: [{ a: 'm', text: 'REGULAR', col: '#ec407a', at: 0.4 }],
    big: [{ text: 'JUST NOTICED', at: 2.4, y: 560, col: '#f6b800', size: 100, rot: -0.03 }], sfx: [{ at: 2.4, kind: 'pop' }] },
  { chatOnly: true, chat: [{ y: 170, out: true, lines: ["Hey Marcus, been a minute.", "Want your usual Thursday?"], at: 0.3 }, { y: 440, out: false, lines: ["Ha, yes. Booking now."], at: 2.0 }] }
] };
