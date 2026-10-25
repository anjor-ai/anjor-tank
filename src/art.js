/* ==========================================================================
   ART — every illustration is generated here as inline SVG, so it themes with
   the page (currentColor + CSS variables) and can be drawn on with DrawSVG.
   Classes:  .ln stroke  ·  .ac accent stroke  ·  .fl surface fill  ·  .af accent fill  ·  .dm dim stroke  ·  .tx text
   ========================================================================== */

const s = (n) => Math.round(n * 100) / 100;
const R = (x, y, w, h, r = 3, c = 'ln') => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
const L = (x1, y1, x2, y2, c = 'ln') => `<path class="${c}" d="M${x1} ${y1}L${x2} ${y2}"/>`;
const P = (d, c = 'ln') => `<path class="${c}" d="${d}"/>`;
const C = (x, y, r, c = 'ln') => `<circle class="${c}" cx="${x}" cy="${y}" r="${r}"/>`;
const T = (x, y, t, c = 'tx', a = 'start') => `<text class="${c}" x="${x}" y="${y}" text-anchor="${a}">${t}</text>`;

/* ───────────── 1. Exploded isometric stack (the product architect, drawn) ───────────── */
const A = 78, TH = 12, SX = 0.866, SP = 118;

function plate(i, cx, cy, inner, accent) {
  const w = A * 1.732;
  const top = `M${cx} ${cy - A}L${s(cx + w)} ${cy}L${cx} ${cy + A}L${s(cx - w)} ${cy}Z`;
  const lf = `M${s(cx - w)} ${cy}L${cx} ${cy + A}L${cx} ${cy + A + TH}L${s(cx - w)} ${cy + TH}Z`;
  const rf = `M${cx} ${cy + A}L${s(cx + w)} ${cy}L${s(cx + w)} ${cy + TH}L${cx} ${cy + A + TH}Z`;
  return `<g class="pl pl-${i}" data-i="${i}">
    <path class="fl side" d="${lf}"/><path class="fl side2" d="${rf}"/>
    <path class="fl top ${accent ? 'on' : ''}" d="${top}"/>
    <g transform="translate(${cx} ${cy}) matrix(${SX} .5 ${-SX} .5 0 0) scale(.78)" class="inner">${inner}</g>
  </g>`;
}

const IN_EXP = [
  R(-84, -80, 168, 160, 6), L(-84, -58, 84, -58),
  C(-72, -69, 3, 'ln'), C(-62, -69, 3, 'ln'), C(-52, -69, 3, 'ln'),
  R(-70, -44, 80, 9, 2, 'ac'), R(-70, -29, 56, 6, 2, 'dm'), R(-70, -18, 36, 14, 4, 'af'),
  R(26, -46, 46, 42, 4, 'ln'), P('M32 -12 46 -30 54 -20 62 -34 68 -12', 'dm'),
  R(-70, 12, 42, 52, 4, 'ln'), R(-20, 12, 42, 52, 4, 'ln'), R(30, 12, 42, 52, 4, 'ln'),
  R(-64, 18, 30, 16, 2, 'dm'), R(-14, 18, 30, 16, 2, 'dm'), R(36, 18, 30, 16, 2, 'dm'),
  L(-64, 44, -40, 44, 'dm'), L(-14, 44, 10, 44, 'dm'), L(36, 44, 60, 44, 'dm'),
].join('');
const IN_LOGIC = [
  C(-62, -4, 8, 'ln'), P('M-54 -4H-24', 'ln'), P('M-24 -4 -4 -24 16 -4 -4 16Z', 'ac'),
  P('M16 -4C34 -4 34 -44 54 -44', 'ln'), P('M16 -4C34 -4 34 36 54 36', 'ac'),
  R(54, -56, 28, 24, 4, 'ln'), R(54, 24, 28, 24, 4, 'af'),
  L(60, -48, 76, -48, 'dm'), L(60, -40, 70, -40, 'dm'), P('M60 36 66 42 78 30', 'ln'),
  T(-4, 2, '?', 'tx tiny', 'middle'),
].join('');
const IN_DATA = (() => {
  let d = '';
  for (let y = 0; y < 7; y++) for (let x = 0; x < 9; x++) d += C(-64 + x * 16, -60 + y * 10, 1.6, (x * 7 + y * 3) % 5 === 0 ? 'af' : 'dm');
  return d + P('M-64 62C-40 40 -30 56 -8 34S24 46 40 20 56 28 64 10', 'ac') + L(-64, 66, 64, 66, 'ln');
})();
const IN_OPS = [
  R(-76, -66, 44, 30, 4, 'ln'), R(-22, -66, 44, 30, 4, 'ln'), R(32, -66, 44, 30, 4, 'ln'),
  L(-70, -56, -46, -56, 'dm'), L(-16, -56, 8, -56, 'dm'), L(38, -56, 62, -56, 'dm'),
  P('M-54 -36V-12H0V6', 'ln'), P('M0 -36V6', 'ln'), P('M54 -36V-12H0', 'ln'),
  R(-22, 6, 44, 28, 4, 'af'), P('M0 34V52', 'ac'), C(0, 62, 10, 'ac'), P('M0 56V62L5 64', 'ac'),
  R(-76, 36, 44, 8, 2, 'dm'), R(-76, 50, 32, 8, 2, 'dm'), R(40, 36, 36, 8, 2, 'dm'),
].join('');

export function isoStack() {
  const W = 760, cx = 380, y0 = 96;
  const plates = [IN_EXP, IN_LOGIC, IN_DATA, IN_OPS];
  const info = [['04', 'Experience', 'Web and app'], ['03', 'Logic', 'Rules and pricing'], ['02', 'Data', 'Events and catalogue'], ['01', 'Operations', 'Portals and CRM']];
  const w = A * 1.732;
  let out = `<svg class="iso" viewBox="0 0 ${W} 580" role="img" aria-labelledby="iso-t"><title id="iso-t">An exploded stack of four layers: experience, logic, data and operations</title>`;
  // vertical guides (dashed) between plates, at the four corners
  out += `<g class="guides">`;
  [[-w, 0], [w, 0], [0, -A], [0, A]].forEach(([dx, dy], k) => { out += L(cx + dx, y0 + dy + 8, cx + dx, y0 + dy + 3 * SP + 8, 'dm gd'); });
  out += `</g>`;
  // plates, bottom first so upper plates overlap correctly
  for (let i = 3; i >= 0; i--) out += plate(i, cx, y0 + i * SP, plates[i], i === 0);
  // callouts: left for 04 and 02, right for 03 and 01
  out += `<g class="callouts">`;
  info.forEach(([n, t, sub], i) => {
    const cy = y0 + i * SP, left = i % 2 === 0, vx = left ? cx - w : cx + w, tx = left ? 196 : W - 196;
    const ly = cy + (left ? -10 : 8);
    out += `<g class="co co-${i}" data-i="${i}">${L(vx, cy, tx + (left ? 12 : -12), ly, 'dm cl')}${C(vx, cy, 3.5, 'af')}
      ${T(tx, ly - 20, `LAYER ${n}`, 'tx mono', left ? 'end' : 'start')}${T(tx, ly, t, 'tx big', left ? 'end' : 'start')}${T(tx, ly + 18, sub, 'tx sub', left ? 'end' : 'start')}</g>`;
  });
  return out + `</g></svg>`;
}

/* ───────────── 2. Product wireframes, 240 × 160 ───────────── */
const WF = {
  checkout: () => [
    R(82, 8, 76, 144, 11), L(82, 28, 158, 28, 'dm'), R(90, 36, 60, 22, 4, 'ln'), R(94, 40, 14, 14, 2, 'dm'), L(114, 43, 146, 43, 'dm'), L(114, 50, 134, 50, 'dm'),
    R(90, 62, 60, 22, 4, 'ln'), R(94, 66, 14, 14, 2, 'dm'), L(114, 69, 146, 69, 'dm'), L(114, 76, 134, 76, 'dm'),
    L(90, 94, 150, 94, 'dm'), L(90, 102, 124, 102, 'dm'), T(150, 104, '₹412', 'tx sm', 'end'),
    R(90, 116, 60, 20, 10, 'af'), T(120, 130, 'Pay now', 'tx sm inv', 'middle'),
    R(14, 36, 56, 28, 8, 'ln'), C(28, 50, 5, 'dm'), L(38, 46, 62, 46, 'dm'), L(38, 54, 54, 54, 'dm'),
    R(172, 70, 56, 28, 8, 'ln'), C(186, 84, 5, 'ac'), L(196, 80, 220, 80, 'dm'), L(196, 88, 212, 88, 'dm'),
    R(14, 100, 56, 24, 12, 'ac'), P('M26 112 31 117 42 106', 'ac'),
  ].join(''),
  lock: () => [
    R(98, 62, 44, 38, 7, 'af'), P('M106 62V52a14 14 0 0 1 28 0V62', 'ac'), C(120, 80, 4, 'fl'), L(120, 83, 120, 90, 'fl'),
    R(10, 40, 62, 26, 6, 'ln'), T(41, 57, '+₹18', 'tx sm', 'middle'), L(72, 53, 98, 70, 'dm'),
    R(168, 40, 62, 26, 6, 'ln'), T(199, 57, '−₹6', 'tx sm', 'middle'), L(168, 53, 142, 70, 'dm'),
    R(10, 100, 62, 26, 6, 'ln'), T(41, 117, 'absorbed', 'tx sm', 'middle'), L(72, 113, 98, 94, 'dm'),
    R(168, 100, 62, 26, 6, 'ln'), T(199, 117, 'refunded', 'tx sm', 'middle'), L(168, 113, 142, 94, 'dm'),
    T(120, 24, 'PRICE LOCKED', 'tx mono', 'middle'), L(60, 30, 180, 30, 'dm'),
  ].join(''),
  coupon: () => [
    P('M20 30H200a8 8 0 0 0 0 16V84a8 8 0 0 0 0 16H20a8 8 0 0 0 0-16V46a8 8 0 0 0 0-16Z', 'ln'), L(150, 30, 150, 100, 'dm gd'),
    T(34, 54, 'SAVE', 'tx mono'), T(34, 76, '₹120', 'tx big2'), L(34, 86, 100, 86, 'dm'), R(160, 52, 32, 14, 7, 'af'), L(160, 78, 192, 78, 'dm'), L(160, 86, 180, 86, 'dm'),
    R(20, 116, 200, 10, 5, 'ln'), R(20, 116, 128, 10, 5, 'af'), T(20, 146, 'Add ₹180 to unlock ₹150 off', 'tx sm'),
  ].join(''),
  ledger: () => [
    ...[0, 1, 2].map((i) => R(14 + i * 76, 24, 64, 84, 6) + L(22 + i * 76, 38, 56 + i * 76, 38, 'dm') + L(22 + i * 76, 48, 46 + i * 76, 48, 'dm') + R(22 + i * 76, 62, 48, 14, 7, i === 2 ? 'af' : 'ac') + L(22 + i * 76, 90, 62 + i * 76, 90, 'dm')),
    L(78, 66, 90, 66, 'ac'), L(154, 66, 166, 66, 'ac'),
    P('M14 130H226', 'dm'), C(14, 130, 3, 'af'), C(120, 130, 3, 'ln'), C(226, 130, 3, 'ln'), T(14, 148, 'Cart', 'tx sm'), T(120, 148, 'Summary', 'tx sm', 'middle'), T(226, 148, '60 days', 'tx sm', 'end'),
  ].join(''),
  progress: () => [
    R(20, 24, 200, 112, 10), L(34, 44, 120, 44, 'dm'), L(34, 54, 90, 54, 'dm'),
    R(34, 72, 172, 12, 6, 'ln'), R(34, 72, 112, 12, 6, 'af'), C(146, 78, 9, 'fl'), C(146, 78, 9, 'ac'),
    T(34, 108, 'Add ₹180 to unlock', 'tx sm'), R(150, 98, 56, 22, 11, 'ac'), T(178, 113, 'Save ₹150', 'tx sm', 'middle'),
  ].join(''),
  swap: () => [
    R(16, 36, 72, 88, 8, 'dm'), L(26, 52, 78, 52, 'dm'), L(26, 62, 62, 62, 'dm'), T(52, 100, 'OUT OF STOCK', 'tx tiny', 'middle'), L(24, 44, 80, 116, 'ac'),
    R(152, 36, 72, 88, 8, 'ln'), L(162, 52, 214, 52, 'dm'), L(162, 62, 198, 62, 'dm'), P('M174 94 184 104 202 84', 'ac'), T(188, 116, 'IN STOCK', 'tx tiny', 'middle'),
    P('M92 70C106 52 134 52 148 70', 'ac'), P('M142 64 148 70 140 74', 'ac'), P('M148 90C134 108 106 108 92 90', 'ln'), P('M98 96 92 90 100 86', 'ln'),
    R(104, 70, 32, 20, 10, 'af'), T(120, 84, '1 : 1', 'tx sm inv', 'middle'),
  ].join(''),
  ops: () => [
    R(10, 16, 60, 30, 6), R(10, 64, 60, 30, 6), R(10, 112, 60, 30, 6), T(40, 35, 'Warehouse', 'tx sm', 'middle'), T(40, 83, 'Finance', 'tx sm', 'middle'), T(40, 131, 'Engineering', 'tx sm', 'middle'),
    P('M70 31H96V79', 'dm'), P('M70 79H96', 'dm'), P('M70 127H96V79', 'dm'), R(96, 60, 48, 38, 8, 'af'), T(120, 83, 'CRM', 'tx sm inv', 'middle'),
    P('M144 79H170', 'ac'), C(196, 79, 24, 'ac'), P('M196 64V79L206 85', 'ac'), T(196, 124, 'SLA 4h', 'tx sm', 'middle'),
  ].join(''),
  loop: () => [
    C(120, 80, 54, 'dm gd'), C(120, 26, 14, 'af'), C(167, 107, 14, 'ln'), C(73, 107, 14, 'ln'),
    P('M133 34A54 54 0 0 1 172 90', 'ac'), P('M155 118A54 54 0 0 1 90 120', 'ac'), P('M62 96A54 54 0 0 1 108 30', 'ac'),
    T(120, 31, '1', 'tx sm inv', 'middle'), T(167, 112, '2', 'tx sm', 'middle'), T(73, 112, '3', 'tx sm', 'middle'), T(120, 84, '+', 'tx big2', 'middle'),
    T(120, 8, 'REFER', 'tx tiny', 'middle'), T(214, 126, 'REWARD', 'tx tiny', 'end'), T(26, 126, 'REPEAT', 'tx tiny'),
  ].join(''),
  search: () => [
    R(20, 18, 200, 28, 14, 'ln'), C(40, 32, 6, 'ac'), L(45, 37, 51, 43, 'ac'), L(62, 32, 120, 32, 'dm'), L(120, 25, 120, 39, 'af'),
    R(20, 54, 200, 24, 6, 'af'), L(34, 66, 110, 66, 'fl'), R(20, 82, 200, 24, 6, 'ln'), L(34, 94, 96, 94, 'dm'), R(20, 110, 200, 24, 6, 'ln'), L(34, 122, 124, 122, 'dm'),
    T(212, 70, '↵', 'tx sm inv', 'end'),
  ].join(''),
  voice: () => [
    ...Array.from({ length: 21 }, (_, i) => { const h = 6 + Math.abs(Math.sin(i * 0.9) * 26) + (i % 3) * 3; return L(30 + i * 9, 40 - h / 2 + 10, 30 + i * 9, 40 + h / 2 + 10, i > 7 && i < 14 ? 'ac' : 'ln'); }),
    R(20, 86, 120, 24, 12, 'ln'), L(34, 98, 120, 98, 'dm'), R(100, 116, 120, 24, 12, 'af'), L(114, 128, 200, 128, 'fl'),
  ].join(''),
};

export function wf(name, cls = '') {
  const f = WF[name] || WF.checkout;
  return `<svg class="wf ${cls}" viewBox="0 0 240 160" aria-hidden="true" focusable="false">${f()}</svg>`;
}

/* ───────────── 3. Product mockup: laptop + phone with floating UI (Architect page and Home teaser) ───────────── */
export function mockup() {
  const lap = [
    P('M70 24H430a10 10 0 0 1 10 10V222H60V34a10 10 0 0 1 10-10Z', 'ln fl'), R(76, 32, 358, 182, 4, 'ln'), P('M34 222H466L452 238H48Z', 'ln fl'), L(210, 230, 290, 230, 'dm'),
    L(76, 52, 434, 52, 'dm'), C(88, 42, 2.5, 'ln'), C(97, 42, 2.5, 'ln'), C(106, 42, 2.5, 'ln'), R(146, 36, 160, 10, 5, 'dm'),
    R(96, 76, 140, 12, 3, 'ac'), R(96, 96, 104, 8, 3, 'dm'), R(96, 110, 86, 8, 3, 'dm'), R(96, 130, 54, 18, 9, 'af'),
    R(262, 70, 154, 90, 6, 'ln'), P('M270 150 300 118 322 134 350 100 380 126 408 94', 'ac'),
    R(96, 168, 98, 36, 5), R(204, 168, 98, 36, 5), R(312, 168, 104, 36, 5), L(104, 180, 150, 180, 'dm'), L(212, 180, 258, 180, 'dm'), L(320, 180, 372, 180, 'dm'), L(104, 192, 130, 192, 'dm'), L(212, 192, 236, 192, 'dm'), L(320, 192, 346, 192, 'dm'),
  ].join('');
  const ph = [
    R(388, 78, 90, 176, 16, 'ln fl'), R(394, 86, 78, 160, 11, 'ln'), R(418, 90, 30, 5, 2.5, 'dm'),
    R(402, 108, 62, 12, 3, 'ac'), L(402, 130, 454, 130, 'dm'), L(402, 138, 440, 138, 'dm'), R(402, 152, 62, 34, 6, 'ln'), R(402, 192, 62, 18, 9, 'af'), L(408, 226, 458, 226, 'dm'),
  ].join('');
  const fl = [
    `<g class="fc fc-0">${R(10, 150, 118, 50, 10, 'ln fl')}${C(30, 175, 9, 'af')}${P('M26 175 29 178 35 171', 'fl')}${T(48, 172, 'Shipped', 'tx sm')}${T(48, 188, 'phased A/B · 1 month', 'tx tiny')}</g>`,
    `<g class="fc fc-1">${R(330, 14, 130, 46, 10, 'ln fl')}${T(344, 34, 'PREPAID', 'tx tiny')}${T(344, 52, '89.7%', 'tx big2')}${P('M416 52 426 40 436 46 448 30', 'ac')}</g>`,
    `<g class="fc fc-2">${R(250, 238, 128, 40, 10, 'ln fl')}${R(260, 250, 36, 16, 8, 'af')}${T(306, 262, 'Price locked', 'tx sm')}</g>`,
  ].join('');
  return `<svg class="mock" viewBox="0 0 500 290" role="img" aria-label="Wireframes of a web page and an app screen">${lap}${ph}${fl}</svg>`;
}

/* Dot-matrix glyph scenes used by the MESHHETU reel (9 columns, up to 12 rows) */
export const SCENES = [
  ['#########', '#########', '.#######.', '..#####..', '...###...', '...###...', '...###...', '...###...', '...###...', '...###...'],
  ['.......##', '.......##', '....##.##', '....##.##', '.##.##.##', '.##.##.##', '.##.##.##', '.##.##.##', '.##.##.##', '#########'],
  ['....#....', '...###...', '....#....', '....#....', '....#....', '.###.###.', '.#.....#.', '.#.....#.', '###...###', '###...###'],
  ['.....###.', '....###..', '...###...', '..###....', '.#######.', '....###..', '...###...', '..###....', '..##.....', '.##......', '.#.......'],
  ['##.......', '.##......', '..#######', '..#.....#', '..#.....#', '..#######', '..#.....#', '...#...#.', '...#####.', '..##...##', '..##...##'],
  ['..#####..', '.#######.', '##.###.##', '##.###.##', '#########', '#.......#', '#.......#', '#.......#', '#.......#', '#########'],
  ['....#....', '...###...', '..#####..', '..#####..', '..#####..', '.#######.', '.#######.', '#########', '#########', '.........', '....#....', '...###...'],
  ['....#....', '....#....', '...#.#...', '...#.#...', '##.#.#.##', '..#...#..', '..#...#..'],
  ['.#####...', '#.....#..', '#.....#..', '#.....#..', '#.....#..', '.#####...', '......##.', '.......##', '........#'],
];
