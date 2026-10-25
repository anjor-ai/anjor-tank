/* ==========================================================================
   ISO — an isometric diorama of voxel letters with small props on and around them.
   Pure functions that return an SVG string (used at build time and at run time).
   Projection: x runs right-and-down, y runs left-and-down, z runs up. Faces: top, left (+y), right (+x).
   Colours come from CSS classes, so the colour-scheme picker and the light/dark themes restyle it with no JS.
   ========================================================================== */
const S = 20, C30 = 0.866;
const px = (x, y) => (x - y) * C30 * S;
const py = (x, y, z) => (x + y) * 0.5 * S - z * S;
const P = (x, y, z) => `${px(x, y).toFixed(1)},${py(x, y, z).toFixed(1)}`;
const f2 = (n) => n.toFixed(1);

const FONT = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
};

/** A box with three faces. Which faces show is decided by the caller (a letter cell hides the faces it shares). */
function box(b) {
  const { x, y, z, w, d, h, cls = '', f = 'tlr', id = '' } = b;
  const top = `<polygon class="t" points="${P(x, y, z + h)} ${P(x + w, y, z + h)} ${P(x + w, y + d, z + h)} ${P(x, y + d, z + h)}"/>`;
  const left = `<polygon class="l" points="${P(x, y + d, z)} ${P(x + w, y + d, z)} ${P(x + w, y + d, z + h)} ${P(x, y + d, z + h)}"/>`;
  const right = `<polygon class="r" points="${P(x + w, y, z)} ${P(x + w, y + d, z)} ${P(x + w, y + d, z + h)} ${P(x + w, y, z + h)}"/>`;
  return `<g class="bx ${cls}"${id}>${f.includes('l') ? left : ''}${f.includes('r') ? right : ''}${f.includes('t') ? top : ''}</g>`;
}
/** A line drawn on the left (+y) face of a box: u along x, v along z, from the face's lower-left corner. */
const faceL = (x, y, z, u0, v0, u1, v1, cls = 'sc') => `<path class="${cls}" d="M${P(x + u0, y, z + v0)}L${P(x + u1, y, z + v1)}"/>`;

export function isoScene({ word = 'AT', depth = 1.6, scene = 'hero' } = {}) {
  const items = [];
  const add = (x, y, z, w, d, h, cls, f = 'tlr', extra = '') => items.push({ x, y, z, w, d, h, cls, f, extra });

  /* floor island */
  const lw = word.length * 7 - 2;
  const fx0 = -2.4, fx1 = lw + 2.4, fy0 = -2.6, fy1 = 6.2;
  add(fx0, fy0, -0.7, fx1 - fx0, fy1 - fy0, 0.7, 'floor', 'tlr');
  /* a few floor tiles, drawn as hairlines on the floor top */
  let tiles = '';
  for (let x = Math.ceil(fx0); x < fx1; x += 2) tiles += `<path class="tl" d="M${P(x, fy0, 0)}L${P(x, fy1, 0)}"/>`;
  for (let y = Math.ceil(fy0); y < fy1; y += 2) tiles += `<path class="tl" d="M${P(fx0, y, 0)}L${P(fx1, y, 0)}"/>`;

  /* voxel letters */
  let n = 0;
  [...word].forEach((ch, li) => {
    const g = FONT[ch] || FONT.A, ox = li * 7;
    g.forEach((row, r) => [...row].forEach((c, col) => {
      if (c !== '#') return;
      const z = 6 - r, has = (cc, rr) => g[rr] && g[rr][cc] === '#';
      const f = 'l' + (has(col + 1, r) ? '' : 'r') + (has(col, r - 1) ? '' : 't');
      add(ox + col, 0, z, 1, depth, 1, 'kx', f, ` data-n="${n++}"`);
    }));
  });

  /* props */
  const person = () => { add(5.5, 3.6, 0, 0.55, 0.45, 0.8, 'p-k'); add(5.45, 3.55, 0.8, 0.65, 0.55, 0.9, 'p-b'); add(5.55, 3.65, 1.7, 0.45, 0.45, 0.42, 'p-s'); add(5.55, 3.65, 2.12, 0.45, 0.45, 0.12, 'p-k'); };
  const laptop = () => { add(8.2, 0.25, 7, 1.7, 1.2, 0.14, 'p-k'); add(8.2, 0.25, 7.14, 1.7, 0.12, 1.1, 'p-scr'); };
  const keycap = () => { add(-1.3, 0.6, 0, 1.5, 1.5, 0.7, 'p-k'); add(-1.2, 0.7, 0.7, 1.3, 1.3, 0.14, 'p-w'); };
  const parcels = () => { add(11.9, 3.2, 0, 1.3, 1.3, 0.9, 'p-t'); add(12.2, 3.4, 0.9, 0.9, 0.9, 0.7, 'p-t'); add(12.5, 3.35, 0.9, 0.2, 1.0, 0.04, 'p-w'); };
  const funnel = () => { add(12.6, -1.8, 0, 1.8, 1.8, 0.45, 'p-b'); add(12.85, -1.55, 0.45, 1.3, 1.3, 0.45, 'p-b'); add(13.1, -1.3, 0.9, 0.8, 0.8, 0.45, 'p-b'); add(13.35, -1.05, 1.35, 0.3, 0.3, 0.7, 'p-a'); };
  const plantA = () => { add(-1.0, 3.8, 0, 0.6, 0.6, 0.45, 'p-o'); add(-1.1, 3.7, 0.45, 0.8, 0.8, 0.7, 'p-g'); add(-0.95, 3.85, 1.15, 0.5, 0.5, 0.45, 'p-g'); };
  const plantB = () => { add(13.4, 0.8, 0, 0.55, 0.55, 0.4, 'p-o'); add(13.3, 0.7, 0.4, 0.75, 0.75, 0.6, 'p-g'); };
  const flag = () => { add(-1.7, -1.7, 0, 0.14, 0.14, 3.2, 'p-w'); add(-1.56, -1.8, 2.3, 0.08, 1.2, 0.8, 'p-a'); };
  const bars = () => { add(1.15, 0.3, 4, 0.55, 0.9, 0.7, 'p-b', 'tlr', ' data-grow'); add(1.95, 0.3, 4, 0.55, 0.9, 1.3, 'p-b', 'tlr', ' data-grow'); add(2.75, 0.3, 4, 0.55, 0.9, 2.0, 'p-a', 'tlr', ' data-grow'); };
  const rocket = () => { add(1.4, 0.3, 7, 0.9, 0.9, 0.2, 'p-k'); add(1.55, 0.45, 7.2, 0.6, 0.6, 2.2, 'p-w'); add(1.65, 0.55, 9.4, 0.4, 0.4, 0.55, 'p-r'); add(1.35, 0.4, 7.2, 0.2, 0.7, 0.7, 'p-r'); add(2.15, 0.4, 7.2, 0.2, 0.7, 0.7, 'p-r'); };
  const plantTop = () => { add(10.2, 0.5, 7, 0.7, 0.7, 0.5, 'p-o'); add(10.1, 0.4, 7.5, 0.9, 0.9, 0.55, 'p-g'); add(10.3, 0.6, 8.05, 0.5, 0.5, 0.45, 'p-g'); };
  const cart = () => { add(6.6, 5.0, 0, 1.6, 1.0, 0.25, 'p-k'); add(6.65, 5.05, 0.25, 1.5, 0.9, 0.5, 'p-w'); add(6.9, 5.15, 0.75, 0.5, 0.5, 0.4, 'p-t'); add(7.6, 5.15, 0.75, 0.4, 0.5, 0.3, 'p-a'); };
  const set = {
    hero: () => { laptop(); plantTop(); rocket(); bars(); person(); keycap(); parcels(); funnel(); plantA(); plantB(); flag(); cart(); },
    hire: () => { person(); laptop(); plantTop(); keycap(); parcels(); plantB(); flag(); cart(); },
    consult: () => { bars(); funnel(); person(); plantA(); laptop(); parcels(); rocket(); },
  };
  (set[scene] || set.hero)();

  /* painter's order: far to near */
  items.forEach((b, i) => { b.i = i; b.k = b.cls === 'floor' ? -1e6 : b.x + b.w / 2 + b.y + b.d / 2; });
  items.sort((a, b) => (a.k - b.k) || (a.z - b.z) || (a.i - b.i));
  let body = '', lo = [1e9, 1e9], hi = [-1e9, -1e9];
  const grow = (x, y, z) => { const X = px(x, y), Y = py(x, y, z); lo = [Math.min(lo[0], X), Math.min(lo[1], Y)]; hi = [Math.max(hi[0], X), Math.max(hi[1], Y)]; };
  let tilesDone = false;
  items.forEach((b) => {
    body += box({ ...b, id: b.extra });
    [[b.x, b.y, b.z], [b.x + b.w, b.y, b.z + b.h], [b.x, b.y + b.d, b.z], [b.x + b.w, b.y + b.d, b.z + b.h], [b.x + b.w, b.y, b.z], [b.x, b.y + b.d, b.z + b.h]].forEach(([x, y, z]) => grow(x, y, z));
    if (!tilesDone && b.cls === 'floor') { body += `<g class="tiles">${tiles}</g>`; tilesDone = true; }
    if (b.cls === 'p-scr') {
      for (let k = 0; k < 4; k++) body += faceL(b.x, b.y + b.d, b.z, 0.2, 0.2 + k * 0.22, 0.55 + (k % 2) * 0.5 + (k === 0 ? 0.4 : 0), 0.2 + k * 0.22);
    }
  });
  const pad = 14;
  const vb = `${f2(lo[0] - pad)} ${f2(lo[1] - pad)} ${f2(hi[0] - lo[0] + pad * 2)} ${f2(hi[1] - lo[1] + pad * 2)}`;
  return `<svg class="isoS" viewBox="${vb}" role="img" aria-label="An isometric diorama: the letters ${word} as blocks, with a laptop, a rocket, growth bars, a funnel and a person standing among them" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
}

export const SCHEMES = [['blue', 'Blue'], ['orange', 'Orange'], ['mint', 'Mint'], ['pink', 'Pink'], ['mono', 'Mono']];
