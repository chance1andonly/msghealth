// "The shepherd who never texted": a dad reads a bedtime story; the page becomes the scene (book page = the next scene's first frame).
const PI = Math.PI;
const DAD = { skin: '#a86d48', shirt: '#5a6078', pants: '#2a2c38', hair: '#141010' }, K1 = { skin: '#a86d48', shirt: '#e8a43a', pants: '#3a4a8a', hair: '#141010' }, K2 = { skin: '#f1c9a5', shirt: '#d8638a', pants: '#3a3a5a', hair: '#e8c35a' };
const FARMER = { skin: '#c98b62', shirt: '#b3362d', pants: '#3b3f55', hair: '#2a1b12', hat: '#d8b45a' }, BUYER = { skin: '#8d5a3b', shirt: '#2a6f4a', pants: '#2f3445', hair: '#141010' }, SHEPB = { skin: '#a86d48', shirt: '#f3f3f6', pants: '#23252e', hair: '#141010', hat: '#3a2a1a' };
const FARM = { set: 'street', noRoad: true, grass: '#6cc060', fence: -5.5, shops: [{ x: -6.5, name: 'FARM', house: true, col: '#a8362e', roof: '#5a2a22', signBg: '#f4f1ea', signFg: '#17181f', pole: false, w: 6 }] };
const HOUSE = { set: 'street', noRoad: true, grass: '#6cc060', shops: [{ x: 0, name: ' ', house: true, col: '#e8d4a8', roof: '#7a3b2e', signBg: '#e8d4a8', signFg: '#e8d4a8', pole: false, w: 6 }] };
const flock = (n, seed = 0) => Array.from({ length: n }, (_, i) => ({ k: 'sheep', x: -6.5 + (i % 7) * 2.1 + ((i * 37 + seed) % 5) * 0.2, z: -1.8 - Math.floor(i / 7) * 1.7, ry: ((i * 53 + seed) % 7 - 3) * 0.15, ph: i * 1.3 }));
const ROOM = { set: 'room', sky: '#1a2250' };
const bed = { k: 'bed', sx: 2.3, x: 0, z: 0 };
const roomCast = (bookPage, kidPose = 'sit', dadPose = 'hold') => [bed, { id: 'dad', who: DAD, x: 0, z: -1.0, ry: 0, pose: dadPose, sitY: 0.95 }, { id: 'k1', who: K1, x: -1.55, z: -1.0, ry: 0.1, pose: kidPose, sitY: 1.25, big: 0.6 }, { id: 'k2', who: K2, x: 1.55, z: -1.0, ry: -0.1, pose: kidPose, sitY: 1.25, big: 0.6 }, { k: 'book', x: 0, z: 1.0, y: 2.0, tilt: 0.75, sc: 0.6, page: bookPage }];
const FINAL = [0, 3.1806, -0.2673], CTR = [0, 2.0, 1.0];
const behind = [0, 7.8, -3.6];
window.TOY = { name: 'toysheep', who: 'Marcus', emph: ['keep', 'fuck', 'msghealth', 'bitch', 'retention'], scenes: [
  // L0: dad in bed, "it's gonna be a little crazy"; camera orbits to behind them, book in view
  { ...ROOM, cam: { fov: 58, p: [[0, 0.5, 3.5, 7.2], [2.2, 0.5, 3.5, 6.8], [3.6, 7, 5, 3.5], [5.9, ...behind]], look: [[0, 0, 2.6, 0], [3.6, 0, 2.6, 0.4], [5.9, ...CTR]] }, actors: roomCast(2), tags: [{ a: 'dad', text: 'DAD', at: 0.4 }] },
  // zoom into the page (ends exactly on the next scene's first frame)
  { at: [1, 0], ...ROOM, cam: { fov: 58, still: true, p: [[0, ...behind], [1.8, ...FINAL]], look: [[0, ...CTR], [1.8, ...CTR]] }, actors: roomCast(2) },
  // L1: the farm (same picture as the page): farmer + buyer
  { at: [1, 1.8], ...FARM, f: [0, -0.6], d: 8.5, h: 3.4, ly: 1.9, stat: [[1.0, 'SHEEP SOLD: 1']], tags: [{ a: 'f', text: 'FARMER', at: 0.6 }, { a: 'b', text: 'REGULAR', at: 1.0 }],
    actors: [{ id: 'f', who: FARMER, x: -1.7, z: -0.5, ry: PI / 2, pose: 'crook' }, { id: 'b', who: BUYER, x: 1.7, z: -0.5, ry: -PI / 2, pose: 'idle' }, { k: 'sheep', x: 0, z: -0.5, ry: 0.4 }, ...flock(10)] },
  // L2: every month, then 2, then 3, then nothing
  { at: [2, 0], ...FARM, f: [0, -0.6], d: 8.5, h: 3.4, ly: 1.9, stat: [[0.1, 'EVERY 1 MONTH'], [1.2, 'EVERY 2 MONTHS'], [2.4, 'EVERY 3 MONTHS'], [3.6, 'SHEEP SOLD: 0']],
    actors: [{ id: 'f', who: FARMER, x: -1.7, z: -0.5, ry: PI / 2, pose: [[0, 'crook'], [3.6, 'slump']] }, { id: 'b', who: BUYER, path: [[0, 6.5, -0.5], [0.5, 1.7, -0.5], [0.9, 1.7, -0.5], [1.4, 6.5, -0.5], [2.1, 6.5, -0.5], [2.7, 1.7, -0.5], [3.1, 1.7, -0.5], [3.6, 6.5, -0.5], [4.6, 6.5, -0.5]], ry: -PI / 2 }, ...flock(10)] },
  // L3: nah, fuck this
  { at: [3, 0], ...FARM, f: [0, 0], d: 5.2, h: 2.6, ly: 2.0, stat: [[0.2, 'PATIENCE: 0']], tags: [{ a: 'f', text: 'FARMER', at: 0.3 }],
    actors: [{ id: 'f', who: FARMER, x: 0, z: 0, ry: 0, pose: 'crookrage' }, ...flock(6, 3)] },
  // L4: hooked by the neck
  { at: [4, 0], ...HOUSE, f: [0, 0], d: 8.5, h: 3.2, ly: 1.9, stat: [[0.3, 'NECKS HOOKED: 1']], tags: [{ a: 'b', text: 'HOOKED', at: 0.5 }],
    actors: [{ id: 'f', who: FARMER, x: -2.0, z: 0, ry: PI / 2, pose: 'pull' }, { id: 'b', who: BUYER, x: 1.4, z: 0, ry: -PI / 2, pose: 'choke' }] },
  // L5: how dare you
  { at: [5, 0], ...HOUSE, f: [0, 0], d: 7.8, h: 3.0, ly: 1.9, stat: [[0.2, 'ARGUMENT: HEATED'], [3.2, 'ARGUMENT: VERY HEATED']], tags: [{ a: 'f', text: 'BEST SHEEP IN THE PASTURE', at: 1.5, size: 38 }],
    actors: [{ id: 'f', who: FARMER, x: -0.7, z: 0, ry: PI / 2, pose: 'crookrage' }, { id: 'b', who: BUYER, x: 0.7, z: 0, ry: -PI / 2, pose: 'point' }] },
  // L6: a different sheep walks out
  { at: [6, 0], ...HOUSE, f: [0, 0], d: 8.5, h: 3.0, ly: 1.9, stat: [[0.8, 'CHEATED ON: 1']], tags: [{ a: 's', text: 'DIFFERENT SHEEP', at: 0.8 }],
    actors: [{ id: 'f', who: FARMER, x: -1.8, z: 0, ry: PI / 2, pose: 'crookrage' }, { id: 'b', who: BUYER, x: 0.7, z: 0, ry: -PI / 2, pose: 'shock' }, { id: 's', k: 'sheep', col: '#e8c33a', path: [[0, 6, 0.4], [1.4, 2.4, 0.4], [3.4, 2.4, 0.4]], ry: -PI / 2 }] },
  { at: [6, 3.4], ...HOUSE, f: [0, 0], d: 5.8, h: 2.6, ly: 2.0, stat: [[0.2, 'BETRAYED: YES']], tags: [{ a: 'f', text: "I CAN'T BELIEVE YOU", at: 0.3, size: 38 }],
    actors: [{ id: 'f', who: FARMER, x: 0, z: 0, ry: 0.2, pose: 'cry' }] },
  // L7: Glock with a switch
  { at: [7, 0], ...HOUSE, f: [0, 0], d: 9, h: 3.0, ly: 1.9, stat: [[1.0, 'BULLETS: 0'], [1.4, 'BULLETS: 8'], [1.8, 'BULLETS: 17'], [2.2, 'BULLETS: 25'], [2.6, 'BULLETS: 30']], tags: [{ a: 'f', text: 'GLOCK + SWITCH', at: 0.8 }],
    sfx: [1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5].map((at) => ({ at, kind: 'pop', gain: 0.1 })),
    actors: [{ id: 'f', who: FARMER, x: -2.4, z: 0, ry: PI / 2, pose: [[0, 'crookrage'], [1.0, 'shoot']] }, { id: 'b', who: BUYER, x: 2.4, z: 0, ry: -PI / 2, pose: [[0, 'shock'], [1.1, 'dodge']] }, { k: 'bullets', from: [-1.5, 1.9, 0], to: [4, 3.4, 0], t0: 1.1, t1: 3.4, rate: 5, spread: 0.3 }] },
  // L8a: dodged every single one
  { at: [8, 0], ...HOUSE, f: [0, 0], d: 9, h: 3.0, ly: 1.9, stat: [[0.1, 'BULLETS HIT: 0'], [1.4, 'BULLETS DODGED: 30']], tags: [{ a: 'b', text: 'DODGED', at: 1.0 }],
    sfx: [0.1, 0.3, 0.5, 0.7, 0.9, 1.1].map((at) => ({ at, kind: 'pop', gain: 0.08 })),
    actors: [{ id: 'f', who: FARMER, x: -2.4, z: 0, ry: PI / 2, pose: 'shoot' }, { id: 'b', who: BUYER, x: 1.4, z: 0, ry: -PI / 2, pose: 'dodge' }, { k: 'bullets', from: [-1.5, 2.4, 0], to: [4, 3.2, 0], t0: 0, t1: 1.5, rate: 5, spread: 0.4 }] },
  // L8b: because you never noticed me
  { at: [8, 3.6], ...HOUSE, f: [0, 0], d: 7.2, h: 2.8, ly: 1.9, stat: [[0.2, 'TEXTS RECEIVED: 0'], [3.0, 'FEELING APPRECIATED: 0%']], tags: [{ a: 'b', text: 'THE ONE WHO LEFT', at: 0.5, size: 40 }],
    actors: [{ id: 'f', who: FARMER, x: -0.9, z: 0, ry: PI / 2, pose: 'slump' }, { id: 'b', who: BUYER, x: 0.8, z: 0, ry: -PI / 2, pose: 'point' }] },
  // L9: back to the room; camera orbits behind, zooms into the page (next scene)
  { at: [9, 0], ...ROOM, cam: { fov: 58, still: true, p: [[0, 0.5, 3.5, 7.2], [0.9, 0.5, 3.5, 6.9], [1.8, 7, 5, 3.5], [2.3, ...behind], [3.15, ...FINAL]], look: [[0, 0, 2.6, 0], [1.8, 0, 2.6, 0.4], [2.3, ...CTR], [3.15, ...CTR]] }, actors: roomCast(13, 'shock', 'hold') },
  // L10: the other shepherd uses Message Health
  { at: [10, 0], ...FARM, f: [0, -0.4], d: 8.5, h: 3.4, ly: 1.9, stat: [[0.8, 'TEXTS SENT: 1'], [1.8, 'TEXTS SENT: 12'], [3.0, 'TEXTS SENT: 40'], [4.2, 'CLIENTS KEPT: ALL']], tags: [{ a: 'f', text: 'OTHER SHEPHERD', at: 0.5, size: 40 }],
    actors: [{ id: 'f', who: SHEPB, x: -0.6, z: 0, ry: 0, pose: 'phone' }, { k: 'panel', x: 1.9, z: -1.8, y: 3.0, ry: -0.3, w: 2.6, h: 1.9, pop: 0.6, text: ['MsgHealth', 'Marcus — texted ✓', 'Rick — texted ✓', 'Dre — texted ✓'], col: '#111111' },
      ...[[-3.2, 0.2], [-2.2, -1.4], [2.0, -1.6], [-4.6, -1.0]].map(([x, z], i) => ({ who: [K1, K2, DAD, BUYER][i], x, z, ry: 0.2 * (i - 1), pose: 'idle' })), ...flock(5, 5).map((a) => ({ ...a, z: a.z - 1.5 }))] },
  // L11: they all came back, even the man who left
  { at: [11, 0], ...FARM, f: [0, -0.4], d: 8.5, h: 3.4, ly: 1.9, stat: [[0.3, 'SHEEP SOLD: 1'], [1.3, 'SHEEP SOLD: 2'], [2.4, 'SHEEP SOLD: 3']], tags: [{ a: 'b', text: 'THE MAN WHO LEFT', at: 0.8, size: 40 }],
    actors: [{ id: 'f', who: SHEPB, x: -1.0, z: -0.4, ry: PI / 2, pose: 'idle' }, { id: 'b', who: BUYER, path: [[0, 6, -0.4], [1.0, 1.1, -0.4], [4, 1.1, -0.4]], ry: -PI / 2 }, ...[[-3.4, -1.2], [-2.2, -2.0], [3.6, -1.8]].map(([x, z], i) => ({ who: [K1, DAD, K2][i], x, z, ry: 0, pose: 'cheer' })), { k: 'sheep', x: 0.2, z: -0.4, ry: 0.5, hop: true }, ...flock(4, 9).map((a) => ({ ...a, z: a.z - 1.5 }))] },
  // L12: happily ever after
  { at: [12, 0], ...FARM, sky: '#ffa56a', f: [0, -0.4], d: 8.5, h: 3.0, ly: 1.9, stat: [[0.5, 'THE END']],
    actors: [{ who: SHEPB, x: -1.0, z: 0, ry: 0, pose: 'cheer' }, { who: BUYER, x: 1.0, z: 0, ry: 0, pose: 'cheer' }, { who: K1, x: -2.6, z: -0.8, ry: 0, pose: 'cheer' }, { who: DAD, x: 2.6, z: -0.8, ry: 0, pose: 'cheer' }, ...flock(5, 2).map((a) => ({ ...a, z: a.z - 1.2, hop: true }))] },
] };
