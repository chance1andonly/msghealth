window.TOY = { name: 'toyinbox', who: 'MsgHealth', scenes: [
  { set: 'shop', cam: { p: [[0, 0, 3.6, 12], [3, 0, 3.2, 10.5]], look: [[0, 0, 2.4, 0]] }, chairs: [-3, 3],
    actors: [{ id: 'y', who: 'barber', x: 0, z: 1.2, ry: 0, pose: 'idle' }],
    big: [{ text: 'NOBODY TEXTED THEM', at: 0.6, y: 520, col: '#f6b800', size: 72, rot: -0.03 }], sfx: [{ at: 0.5, kind: 'pop' }] },
  { set: 'shop', cam: { p: [[0, 0, 3.4, 11], [3, 0, 3.2, 9.5]], look: [[0, 0, 2.6, 0]] }, chairs: [-6, 6],
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 4, w: 6, h: 3.4, col: '#4f46e5', pop: 0.3, text: ['Client health', 'Marcus — active ✓', 'Dre — 7 weeks quiet', 'Tasha — 11 weeks quiet'], rows: { 1: '#e6f6ea', 2: '#fff1d6', 3: '#fdecec' } }],
    big: [{ text: 'WHO WENT QUIET', at: 0.4, y: 1240, col: '#f6b800', size: 90, rot: -0.02 }], sfx: [{ at: 0.3, kind: 'ding' }] },
  { chatOnly: true, chat: [{ y: 170, out: true, lines: ["Hey Dre, been a minute.", "Want your usual Thursday?"], at: 0.3 }, { y: 440, out: false, lines: ["Yes! Thursday 4pm."], at: 1.6 }, { y: 640, out: true, lines: ["Booked. See you then."], at: 3.0 }] },
  { set: 'shop', cam: { p: [[0, 0, 3.4, 11], [3, 0, 3.2, 9.5]], look: [[0, 0, 2.6, 0]] }, chairs: [-6, 6],
    actors: [{ id: 'panel', k: 'panel', x: 0, z: -1, y: 4, w: 6, h: 3.4, col: '#4f46e5', pop: 0.3, text: ['One inbox', 'Review request sent ✓', 'Payment received ✓', 'Next visit booked ✓'], rows: { 1: '#e6f6ea', 2: '#e6f6ea', 3: '#e6f6ea' } }],
    big: [{ text: 'REVIEWS + PAYMENTS', at: 0.4, y: 1240, col: '#f6b800', size: 80, rot: -0.02 }], sfx: [{ at: 0.3, kind: 'ding' }] },
  { set: 'shop', wall: '#8c1f2a', chairCol: '#2b55c8', cam: { p: [[0, 0, 3.4, 10], [3, 0, 3.2, 8.6]], look: [[0, 0, 2.3, 0]] }, chairs: [-1.7, 1.7],
    actors: [{ id: 'b', who: 'barber', x: 1.2, z: 1.5, ry: -0.4, pose: 'cut' }, { id: 'd', who: 'dre', x: -1.7, z: 0.5, ry: 0, pose: 'sit' }],
    big: [{ text: 'YOU CUT. IT CHASES.', at: 1.2, y: 520, col: '#f6b800', size: 84, rot: 0.03 }], sfx: [{ at: 1.2, kind: 'pop' }] }
] };
