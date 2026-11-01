// energy.js: the only colour in the world (PLAN.md §5). Energy is light, so it's laid with glow() (added light) over a
// thin wash of its colour, never mixed into the ink. Each colour is the one the text names.
const NRG = {
  death: '#9BE8A0',        // the Outsiders' beams: "faintly greenish", "pale green"
  projector: '#8FB8F0',    // "a bluish beam"
  support: '#A27BEA',      // "a strange violet beam"
  lightning: '#7FA8FF',    // "crackling streamers of blue lightning"
  white: '#FFF6E8',        // "an enormous aura of white light"
  livid: '#F2F0FF',        // the power plant's "livid flame"
  gold: '#FFC75A', violet: '#7A4FD0', ruby: '#FF3B4E',   // the golden sphere
  // screens under fire: "flamed gradually violet, then blue, orange—red"
  screen: ['#A27BEA', '#6F8FF0', '#FF9A3C', '#FF4A3A'],
};
// a colour along a list of colours, k 0..1
const ramp = (cols, k) => { k = clamp(k) * (cols.length - 1); const i = Math.min(cols.length - 2, Math.floor(k)); return mixCol(cols[i], cols[i + 1], k - i); };

// A beam from (x0, y0) to (x1, y1), w0 wide at its source and w1 where it lands; k 0..1 is how far it has reached.
// A thin wash of its colour, a hot core of light along it, and a splash of light where it lands.
function beam(x0, y0, x1, y1, w0, w1, col, k = 1, o = {}) {
  if (k <= 0) return;
  const xe = lerp(x0, x1, k), ye = lerp(y0, y1, k), we = lerp(w0, w1, k), a = Math.atan2(ye - y0, xe - x0), nx = -Math.sin(a), ny = Math.cos(a);
  boilSeed('beam' + x0 + y0);
  paint([[x0 + nx * w0 / 2, y0 + ny * w0 / 2], [xe + nx * we / 2, ye + ny * we / 2], [xe - nx * we / 2, ye - ny * we / 2], [x0 - nx * w0 / 2, y0 - ny * w0 / 2]],
    { wash: col, washOp: o.washOp ?? 60, ink: null });
  const L = Math.hypot(xe - x0, ye - y0), n = Math.max(2, Math.ceil(L / 40)), fl = o.flicker ?? .15;
  for (let i = 0; i <= n; i++) { const u = i / n; glow(lerp(x0, xe, u), lerp(y0, ye, u), lerp(w0, we, u) * (o.core ?? 1.1) * (1 + jit(fl)), col, (o.a ?? .5)); }
  if (k >= 1 && o.splash !== false) { glow(x1, y1, w1 * 2.6, col, .8); glow(x1, y1, w1 * 1.2, NRG.white, .5); }
}
// Lightning: a jagged streamer from p0 to p1, re-forked on every boil; br = branches.
function lightning(x0, y0, x1, y1, col = NRG.lightning, o = {}) {
  const segs = o.segs || 10, P = [[x0, y0]], L = Math.hypot(x1 - x0, y1 - y0), amp = (o.amp ?? .12) * L;
  for (let i = 1; i < segs; i++) { const u = i / segs; P.push([lerp(x0, x1, u) + jit(amp), lerp(y0, y1, u) + jit(amp)]); }
  P.push([x1, y1]);
  inkLine(P, o.sw ?? 1.6, NRG.white, 'inkfine', 0);
  for (const p of P) glow(p[0], p[1], o.r ?? 70, col, o.a ?? .55);
  if ((o.br ?? 2) > 0) for (let b = 0; b < (o.br ?? 2); b++) {
    const i = 2 + Math.floor(random() * (segs - 3)), [px, py] = P[i], ang = Math.atan2(y1 - y0, x1 - x0) + jit(1.2), len = L * (.15 + random() * .2);
    lightning(px, py, px + Math.cos(ang) * len, py + Math.sin(ang) * len, col, { ...o, segs: 4, br: 0, sw: (o.sw ?? 1.6) * .6, r: (o.r ?? 70) * .6 });
  }
}
// An aura: layered light around (x, y), radius r, breathing a little with t.
function aura(x, y, r, col, a = 1, t = 0) {
  const b = 1 + .04 * wob(t, .7);
  glow(x, y, r * 1.6 * b, col, .35 * a); glow(x, y, r * b, col, .6 * a); glow(x, y, r * .45, NRG.white, .5 * a);
}
// A force-screen: a dome of force over (cx, base), radius r, under fire where beams land (hits, [x, y] points on it).
// Around each hit it runs the text's sequence outward from where the heat is: red, orange, blue, violet; heat 0..1
// is how far the fire has pushed it (at 0 the whole screen is still violet).
function forceScreen(cx, base, r, heat, hits = [], t = 0) {
  const P = [], at = (x, y) => { const d = Math.min(...hits.map(([hx, hy]) => Math.hypot(x - hx, y - hy)), 1e9); return ramp(NRG.screen, clamp(heat * (1.15 - d / (r * 1.2)))); };
  for (let i = 0; i <= 32; i++) { const a = Math.PI + i / 32 * Math.PI; P.push([cx + Math.cos(a) * r, base + Math.sin(a) * r * .8]); }
  boilSeed('screen' + cx);
  paint(P, { wash: NRG.screen[0], washOp: 45, ink: null });
  for (let i = 0; i <= 40; i++) { const a = Math.PI + i / 40 * Math.PI, x = cx + Math.cos(a) * r, y = base + Math.sin(a) * r * .8; glow(x, y, 70, at(x, y), .55); }
  for (const [x, y] of hits) { glow(x, y, 220, at(x, y), .5); glow(x, y, 110, ramp(NRG.screen, heat), .9); glow(x, y, 50, NRG.white, .6); }
}
