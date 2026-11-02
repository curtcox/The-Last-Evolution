// designs.js: the film's designs (PLAN.md §5), each built from the text and drawn in the pulp medium (src/pulp.js): the
// people of 2538, the machines, F-1, F-2, C-R-U-1, the Outsiders, their ships, the investigators, the tiny machine-
// ships, and the places. The model sheets (src/scenes/models.js) show each one; the chapters draw from the same calls.
// Every call draws at (x, ground), the point on the ground under its centre, at s pixels to the foot.
//
// One family of machines. The text gives every machine "the usual driving and lifting units", a "dome-case", "force-beam
// controls" and "tentacles... built on the framework" (p048), and calls F-1 "the shining cylinder" (p058): so every
// machine of 2538 is a cylinder capped with a dome, carried on a lifting disc, with its tentacles hung from the
// framework between them. The power plant (p113) is the same form at five hundred feet, and C-R-U-1 the same form with
// no tentacles at all, since it works by force alone.
const DES = {};
(() => {
  const D = PULP.w, INK = PULP.ink;
  const dk = d => clamp(Math.round(d), 0, 4);

  // ---------- the family form ----------
  // The dome-case: a cylinder r wide, h tall, from its bottom centre (x, yb) up, with a dome dh high on top. Painted in
  // bands across its width, with a streak of bare paper where metal shines (o.shine), and seams at the heights in o.rings.
  function dcase(x, yb, r, h, dh, d, o = {}) {
    const ry = r * .2, edge = u => Math.sqrt(Math.max(0, 1 - u * u));
    const band = (u0, u1, dd, op = 1, top = 1) => { const P = [];
      for (let i = 0; i <= 10; i++) { const u = lerp(u0, u1, i / 10); P.push([x + u * r, yb + ry * edge(u)]); }
      for (let i = 10; i >= 0; i--) { const u = lerp(u0, u1, i / 10); P.push([x + u * r, yb - h - dh * edge(u) * top]); }
      wash(P, dd, { op }); };
    boilSeed('dc' + x + yb);
    const S = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; S.push([x + Math.cos(a) * r, yb + Math.sin(a) * ry]); }
    for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; S.push([x + Math.cos(a) * r, yb - h + Math.sin(a) * dh]); }
    paint(S, { wash: D[0], washOp: 255, ink: null });                 // an opaque ground, so the washes over it don't show the room through
    const g = o.shine ? .22 : 0;
    band(-1, -.62, d + 1, .9); band(-.62 + g, .45, d, 1); band(.45, .8, d + 1, .9); band(.8, 1, Math.min(4, d + 2), .9);
    if (o.shine) band(-.62, -.62 + g, 0, .25);
    const P = [];
    for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; P.push([x + Math.cos(a) * r, yb + Math.sin(a) * ry]); }
    for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; P.push([x + Math.cos(a) * r, yb - h + Math.sin(a) * dh]); }
    paint(P, { ink: INK, sw: o.sw ?? .9, br: 'inkfine' });
    for (const k of o.rings || []) arcLine(x, yb - h * k, r, ry, .5);
    arcLine(x, yb - h, r, ry, .55);                                   // where the dome meets the case
  }
  // the front half of a ring around a cylinder at height y
  function arcLine(x, y, r, ry, sw = .5, col = INK) { const P = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * Math.PI; P.push([x + Math.cos(a) * r, y + Math.sin(a) * ry]); } inkLine(P, sw, col, 'inkfine', 0); }
  // the lifting disc: a broad saucer R wide with its rim at y, t thick
  function disc(x, y, R, t, d) {
    boilSeed('disc' + x + y);
    const ry = R * .2, P = [];
    for (let i = 0; i <= 18; i++) { const a = Math.PI + i / 18 * Math.PI; P.push([x + Math.cos(a) * R, y + Math.sin(a) * ry]); }
    for (let i = 0; i <= 18; i++) { const a = i / 18 * Math.PI; P.push([x + Math.cos(a) * R * .8, y + t + Math.sin(a) * ry * .8]); }
    wash(P.reverse(), d + 1, { ink: true, sw: .7 });
    wash(ellPts(x, y, R, ry, 24), d, { ink: true, sw: .6 });
    for (let i = 0; i < 7; i++) { const u = -.75 + i * .25; inkLine([[x + u * R * .88, y + ry * .9 * Math.sqrt(1 - u * u)], [x + u * R * .74, y + t * .8 + ry * .7 * Math.sqrt(1 - u * u)]], .4, D[4]); }   // the vents
  }
  // a tentacle along P (rubber-covered metal, p058): a dark ribbon w0 tapering to w1, ringed, with a two-fingered grip
  function tentacle(P, w0, w1, d = 4, o = {}) {
    boilSeed('tn' + P[0][0] + P[0][1]);
    wash(ribbon(P, w0, w1), d, { ink: true, sw: .5, op: o.op ?? 1 });
    const C = through(P);
    for (let i = 2; i < C.length - 1; i += 2) { const [a, b] = [C[i - 1], C[i + 1]], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, w = lerp(w0, w1, i / C.length) * .5;
      inkLine([[C[i][0] - dy / L * w, C[i][1] + dx / L * w], [C[i][0] + dy / L * w, C[i][1] - dx / L * w]], .3, D[1]); }
    const [ex, ey] = C[C.length - 1], [px, py] = C[C.length - 3], a = Math.atan2(ey - py, ex - px), f = w1 * 1.8;
    if (o.grip !== false) for (const s of [-.5, .5]) inkLine([[ex, ey], [ex + Math.cos(a + s) * f, ey + Math.sin(a + s) * f], [ex + Math.cos(a + s * .2) * f * 1.6, ey + Math.sin(a + s * .2) * f * 1.6]], .6, INK);
  }
  // a sense-receptor: a lens in a ringed mount, r across, with a glint of reflected light
  // o.lit 0..1: light in the glass (a machine speaking, or awake); o.dark: dead, no glint
  function lens(x, y, r, o = {}) {
    boilSeed('ln' + x + y);
    wash(ellPts(x, y, r, r * (o.sq ?? 1), 18), 1, { ink: true, sw: .6 });
    wash(ellPts(x, y, r * .66, r * .66 * (o.sq ?? 1), 16), 4, { ink: true, sw: .4 });
    if (o.dark) return;
    glow(x - r * .22, y - r * .22, r * .5, NRG.white, .55);
    if (o.lit) { glow(x, y, r * 1.1, NRG.white, .5 * o.lit); glow(x, y, r * .5, NRG.white, .5 * o.lit); }
  }
  DES.tentacle = tentacle; DES.lens = lens; DES.disc = disc; DES.dcase = dcase;

  // A machine of 2538: the family form, sized and dressed by o (in feet unless noted):
  //   r, h, dh   the dome-case's radius, height and dome; hover  how high its disc floats; d  its wash
  //   arms, reach  how many tentacles and how long; receptor  'one' | 'crown' | 'great' | 'probe'; shine  bright metal
  //   label  its designation, stencilled on its band; face  -1..1, where its receptor turns (0 = towards us)
  DES.machine = (x, ground, s, t = 0, o = {}) => {
    const r = (o.r ?? 1.6) * s, h = (o.h ?? 3.2) * s, dh = (o.dh ?? 1.1) * s, d = o.d ?? 1, hov = (o.hover ?? 1.5) * s, face = o.face ?? 0;
    const dy = ground - hov, R = r * 1.2, fh = .7 * s, yb = dy - fh;
    boilSeed('msh' + x); paint(ellPts(x, ground, R * 1.1, R * .14, 20), { fill: D[3], fillOp: 70, bleed: .3, ink: null });   // its shadow on the ground
    const n = o.arms ?? 4, L = (o.reach ?? 4) * s, arm = (i, front) => {
      const th = (i + .5) / n * TAU + face * .5, u = Math.sin(th), z = Math.cos(th); if ((z > 0) !== front) return;
      // hanging slack from the framework, out and down, the tip curled up short of the ground
      const sx = x + u * r * .85, sy = dy - fh * .45, sw = wob(t, .35, i * .31), drop = Math.min(L * .8, ground - sy - .6 * s), out = L * .32;
      const P = [[sx, sy], [sx + u * out * .35, sy + drop * .4], [sx + u * out * (.6 + .08 * sw), sy + drop * .8], [sx + u * out * (.8 + .1 * sw), sy + drop], [sx + u * out * (1 + .1 * sw), sy + drop * .82]];
      tentacle(P, .34 * s, .16 * s, front ? 4 : 3, { op: front ? 1 : .8 });
    };
    for (let i = 0; i < n; i++) arm(i, false);
    disc(x, dy, R, .5 * s, d);
    for (let i = 0; i < 6; i++) { const u = -.8 + i * .32; inkLine([[x + u * r * .75, dy - 2], [x + u * r * .8, yb + 4]], .6, INK); }   // the framework
    arcLine(x, dy - fh * .45, r * .88, r * .17, .6);
    dcase(x, yb, r, h, dh, d, { shine: o.shine, rings: o.rings || [.32, .72] });
    for (let i = 0; i < n; i++) arm(i, true);
    // the band, lettered with its designation where it faces us
    if (o.label) letter(o.label, x - face * r * .3, yb - h * .52, Math.min(r * .32, 30), INK, { ink: false, font: `700 ${Math.min(r * .32, 30)}px ${SERIF}`, spacing: 2 });
    const rx = x + Math.sin(face) * r * .55, top = yb - h - dh, lo = { lit: o.lit, dark: o.dark };
    if (o.receptor === 'crown') for (let i = -2; i <= 2; i++) lens(x + i * r * .36, yb - h - dh * .45 * (1 - Math.abs(i) * .25), r * .13, lo);
    else if (o.receptor === 'great') { lens(rx, yb - h - dh * .42, r * .3, lo); lens(rx - r * .5, yb - h - dh * .2, r * .13, lo); lens(rx + r * .5, yb - h - dh * .2, r * .13, lo); }
    else if (o.receptor === 'probe') { wash(ribbon([[rx, yb - h - dh * .5], [rx + r * .6, yb - h - dh * .7], [rx + r * 1.0, yb - h - dh * .6]], r * .16, r * .07), d + 2, { ink: true, sw: .5 }); lens(rx - r * .05, yb - h - dh * .45, r * .16, lo); }
    else lens(rx, yb - h - dh * .45, r * .2, lo);
    if (o.nozzles) for (let i = -2; i <= 2; i++) { const u = i * .38; wash(rrPts(x + u * r - r * .06, yb - h * .2, r * .12, r * .3, r * .05), 3, { ink: true, sw: .4 }); }
    return { top, yb, dy, r, h, dh, eye: [rx, yb - h - dh * .42], arm: dy - fh * .45 };
  };
  // the machines who speak in the council (p037–p046) and the one who thinks: each a member of the family
  DES.x5638 = (x, g, s, t, o = {}) => DES.machine(x, g, s, t, { r: 1.3, h: 3.4, dh: 1.5, d: 0, arms: 3, reach: 4.2, label: 'X-5638', ...o });   // the newest: slim, light
  DES.x6349 = (x, g, s, t, o = {}) => DES.machine(x, g, s, t, { r: 1.75, h: 2.8, dh: .9, d: 2, arms: 4, receptor: 'probe', label: 'X-6349', ...o });
  DES.x6621 = (x, g, s, t, o = {}) => DES.machine(x, g, s, t, { r: 1.7, h: 3.2, dh: 1.1, d: 1, arms: 6, reach: 3.6, nozzles: true, label: 'X-6621', ...o });   // the chemist
  DES.cr21 = (x, g, s, t, o = {}) => DES.machine(x, g, s, t, { r: 2.1, h: 5.2, dh: 1.4, d: 2, arms: 4, receptor: 'crown', rings: [.2, .5, .8], label: 'C-R-21', hover: 2, ...o });   // the chief ruler
  // F-1: "a vastly greater dome-case, far more powerful energy-generators, far greater force-beam controls... more
  // tentacles" (p048), "a greater sense-receptor" (p049), "the shining cylinder" (p058), on its anti-gravity drive
  DES.f1 = (x, g, s, t, o = {}) => DES.machine(x, g, s, t, { r: 3.4, h: 7.5, dh: 2.6, d: 0, arms: 8, reach: 6, receptor: 'great', shine: true, rings: [.15, .5, .85], hover: 3, ...o });

  // C-R-U-1: "a small cylinder, smaller even than its creator" (p066), its name "in dully glowing golden light" (p069).
  // The family form with no disc and no tentacles: it floats, and works by force.
  DES.cru1 = (x, ground, s, t = 0, o = {}) => {
    const r = .75 * s, h = 1.7 * s, dh = .55 * s, yb = ground - (o.hover ?? 2.2) * s + 4 * wob(t, .3);
    boilSeed('crush'); paint(ellPts(x, ground, r * 1.2, r * .16, 16), { fill: D[3], fillOp: 60, bleed: .3, ink: null });
    dcase(x, yb, r, h, dh, 1, { shine: true, rings: [.15, .85] });
    lens(x, yb - h - dh * .45, r * .22, { lit: o.lit });
    // its name, glowing on (o.glowK 0..1; o.unlit: not yet, p069)
    const L = yb - h * .5, sz = r * .42, k = o.unlit ? 0 : o.glowK ?? 1;
    if (k <= 0) return;
    glow(x, L, r * 1.2, NRG.gold, .3 * k);
    letter('C-R-U-1', x, L, sz, NRG.gold, { ink: false, font: `700 ${sz}px ${SERIF}`, spacing: 1, stroke: '#6B4A14', alpha: k });
  };

  // F-2: "the small torpedo of metal", "glowing, bluish metal", "three thin tentacles of the same bluish metal" (p060).
  // Bluish is the one colour in the world that isn't energy: F-2's metal, faint, and gone grey-brown with age.
  //   view  'side' | 'front' | 'top'; o.age 0 new … 1 the old narrator, oxidised (p137); o.newborn  the birth's aura
  DES.f2 = (x, ground, s, t = 0, o = {}) => {
    const len = 4.2 * s, rad = .65 * s, age = o.age ?? 0, view = o.view || 'side', y = ground - (o.hover ?? 2.4) * s + 3 * wob(t, .25);
    const metal = mixCol(mixCol(D[1], '#7F9BD0', .38), '#8A6A50', age), dark = mixCol(metal, INK, .45);
    if (o.newborn) { aura(x, y, len * .75, NRG.white, .9, t); glow(x, y, len * 1.6, NRG.lightning, .4); }
    boilSeed('f2sh'); if (o.hover !== 0 && !o.newborn) paint(ellPts(x, ground, len * .45, len * .05, 16), { fill: D[3], fillOp: 60, bleed: .3, ink: null });
    // a thin tentacle curling from (sx, sy) out along dir (a unit vector), its tip turned back in a hook
    // a thin tentacle trailing from (sx, sy) along dir (a unit vector) in a slow S, its tip curling softly
    const tent = (sx, sy, dx, dy, i) => { const sw = wob(t, .5, i * .29), L = (view === 'side' ? 1.6 : 1.05) * s, nx = -dy, ny = dx, at = (a, b) => [sx + dx * L * a + nx * L * b, sy + dy * L * a + ny * L * b];
      inkLine(through([[sx, sy], at(.3, .1 + .05 * sw), at(.62, -.06 + .08 * sw), at(.88, .04 + .07 * sw), at(1, .16 + .05 * sw)]), 1.1, dark, 'inkfine'); };
    boilSeed('f2' + view);
    if (view === 'front') {
      for (let i = 0; i < 3; i++) { const a = Math.PI / 2 + (i - 1) * 2.1; tent(x + Math.cos(a) * rad * .7, y + Math.sin(a) * rad * .7, Math.cos(a), Math.sin(a), i); }
      paint(ellPts(x, y, rad, rad, 22), { wash: metal, washOp: 230, fill: metal, fillOp: 90, bleed: .05, ink: INK, sw: .7, br: 'inkfine' });
      lens(x, y, rad * .42);
      arcLine(x, y, rad * .82, rad * .82, .4); return;
    }
    // side: blunt rounded nose to the right, tapering to a narrow tail; top: the same, with the tentacles to both sides
    const P = [], w = view === 'top' ? rad * .95 : rad;
    for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + i / 16 * Math.PI; P.push([x + len * .3 + Math.cos(a) * len * .2, y + Math.sin(a) * w]); }
    P.push([x - len * .3, y + w * .7], [x - len * .5, y + w * .25], [x - len * .5, y - w * .25], [x - len * .3, y - w * .7]);
    // the three tentacles grow from the underside behind the nose: seen from above, two to one side and one to the other
    if (view === 'top') [[.12, 1], [-.04, -1], [-.12, 1]].forEach(([k, sd], i) => tent(x + len * k, y + sd * w * .8, -.35, sd * .94, i));
    else [[.14, -.7], [0, -.95], [-.14, -1.2]].forEach(([k, a], i) => tent(x + len * k, y + w * .8, Math.sin(a), Math.cos(a), i));   // trailing back and down
    paint(P, { wash: metal, washOp: 230, fill: metal, fillOp: 90, bleed: .05, ink: INK, sw: .8, br: 'inkfine' });
    paint([[x - len * .45, y - w * .5], [x + len * .28, y - w * .8], [x + len * .38, y - w * .55], [x - len * .45, y - w * .32]], { wash: mixCol(metal, '#FFFFFF', .45), washOp: 160, ink: null });   // the sheen
    paint([[x - len * .45, y + w * .4], [x + len * .3, y + w * .7], [x + len * .44, y + w * .3], [x + len * .3, y + w], [x - len * .3, y + w * .75]], { wash: dark, washOp: 120, ink: null });
    inkLine([[x + len * .1, y - w * .98], [x + len * .1, y + w * .98]], .4, dark); inkLine([[x - len * .3, y - w * .72], [x - len * .3, y + w * .72]], .4, dark);
    if (view === 'side') lens(x + len * .4, y - w * .1, w * .32);
    if (age > 0) { boilSeed('rust'); for (let i = 0; i < 16 * age; i++) paint(ellPts(x + (hash(i) - .5) * len * .8, y + (hash(i * 3) - .5) * w * 1.4, (5 + 9 * hash(i * 5)) * s / 30, (3 + 5 * hash(i * 7)) * s / 30, 8), { wash: '#7B4A2A', washOp: 150 * age, ink: null }); }
  };

  // ---------- people of 2538: drawn as the pulps drew the future, tunics and high collars (§5) ----------
  // A standing figure, front view, s px to the foot (six feet tall). o: who: 'roal' | 'trest' | 'kahsh' | 'citizen';
  // shield: an arm raised across the face; flip
  DES.person = (x, ground, s, t = 0, o = {}) => {
    const who = o.who || 'citizen', f = o.flip ? -1 : 1, u = s * 6 / 7.4;   // u: one head of a 7.4-head figure
    const stoop = who === 'roal' ? .14 : 0, X = (v, y = 0) => x + (v + stoop * Math.max(0, y - 4) / 3.4) * u * f, Y = v => ground - v * u;
    const pt = (v, y) => [X(v, y), Y(y)], sym = (pts) => [...pts.map(([v, y]) => pt(-v, y)), ...pts.slice().reverse().map(([v, y]) => pt(v, y))];
    const cloth = { roal: 1, trest: 2, kahsh: 3, citizen: 1 }[who], robe = who === 'roal', hem = robe ? .55 : who === 'citizen' ? 2.9 : 3.15;
    boilSeed('pp' + who + x);
    paint(ellPts(x, ground, 1.1 * u, .16 * u, 14), { fill: D[3], fillOp: 70, bleed: .3, ink: null });
    // the standing collar, behind the head: a stiff band flaring to the jaw (Kahsh's a tall fan, his office)
    const fan = who === 'kahsh';
    for (const sd of [-1, 1]) wash([pt(sd * .16, 6.12), pt(sd * (fan ? .86 : .5), fan ? 7.3 : 6.85), pt(sd * (fan ? .66 : .36), fan ? 7.32 : 6.86), pt(sd * .12, 6.32)], dk(cloth + 1), { ink: true, sw: .45 });
    inkLine([pt(-.3, 6.15), pt(0, 6.08), pt(.3, 6.15)], .5, INK);
    // legs, below the hem, and boots
    for (const sd of [-1, 1]) {
      if (!robe) wash(ribbon([pt(sd * .34, hem + .1), pt(sd * .35, 2.0), pt(sd * .33, .95)], .46 * u, .36 * u), dk(cloth + 1), { ink: true, sw: .4 });
      const bt = robe ? .5 : 1.05;   // under the robe, only the toes of the boots
      wash([pt(sd * .15, bt), pt(sd * .53, bt), pt(sd * .55, .18), pt(sd * .66, .02), pt(sd * .1, 0), pt(sd * .12, .2)], 4, { ink: true, sw: .4, curv: .3 });
    }
    // the tunic (Roal: a long robe), close at the waist and flaring to the hem, with its shadow side
    const T = sym([[.3, 6.18], [.95, 5.9], [.84, 5.25], [.66, 4.45], [.8, 3.7], [robe ? 1.02 : .9, hem]]);
    wash(T, cloth, { ink: true, sw: .55, curv: .15 });
    wash([pt(.35, 6.1), pt(.5, 5.2), pt(.42, 4.45), pt(.55, 3.7), pt(robe ? .7 : .62, hem), pt(robe ? 1.02 : .9, hem), pt(.8, 3.7), pt(.66, 4.45), pt(.84, 5.25), pt(.95, 5.9)], dk(cloth + 1), { op: .55 });
    inkLine([pt(-.68, 4.48), pt(0, 4.4), pt(.68, 4.48)], 1.1, INK);                                             // the belt
    wash(rrPts(X(-.13, 4.48), Y(4.58), .26 * u, .2 * u, .05 * u), 0, { ink: true, sw: .4 });
    if (!robe) inkLine([pt(0, 6.15), pt(.03, 4.55)], .4, D[4]);
    else for (const v of [-.45, 0, .45]) inkLine([pt(v * .6, 4.3), pt(v * 1.15, hem + .25)], .35, D[3]);
    if (fan) {   // the Man-ruler's mantle over the shoulders, and his disc of office
      wash(sym([[.3, 6.2], [1.05, 5.92], [1.12, 4.95], [.5, 5.15], [0, 5.02]]), 4, { ink: true, sw: .5, curv: .15 });
      wash(ellPts(X(0, 5.55), Y(5.55), .2 * u, .2 * u, 14), 0, { ink: true, sw: .5 }); inkLine([pt(-.09, 5.55), pt(.09, 5.55)], .4, INK);
    }
    // sleeves from the shoulder, hands; or one arm raised across the face
    for (const sd of [-1, 1]) {
      const raise = o.shield && sd === 1;
      const P = raise ? [pt(.88, 5.85), pt(1.4, 6.2), pt(.55, 7.0)] : [pt(sd * .86, 5.86), pt(sd * 1.02, 4.85), pt(sd * 1.06, 3.8)];
      wash(ribbon(P, .4 * u, .3 * u), cloth, { ink: true, sw: .45 });
      const [hx, hy] = P[2]; wash(ellPts(hx, hy + (raise ? 0 : .2 * u), .14 * u, .2 * u, 12), 0, { ink: true, sw: .4 });
    }
    inkLine([pt(-.13, 6.15), pt(-.13, 6.55)], .4, INK); inkLine([pt(.13, 6.15), pt(.13, 6.55)], .4, INK);   // the neck
    DES.head(X(0, 7.0), Y(7.0), u, who, { hide: o.shield });
  };
  // A head, front view, u px to the head's height. who sets the hair and the years.
  DES.head = (x, y, u, who = 'citizen', o = {}) => {
    const rx = .36 * u, ry = .5 * u, old = who === 'roal', E = (a, b) => [x + a * rx, y + b * ry];
    boilSeed('hd' + who + x);
    for (const sd of [-1, 1]) wash([E(sd * .9, -.1), E(sd * 1.12, -.14), E(sd * 1.12, .16), E(sd * .9, .22)], 0, { ink: true, sw: .35, curv: .5 });   // ears
    const face = []; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU, k = Math.sin(a) > 0 ? 1 - .22 * Math.sin(a) ** 2 : 1; face.push([x + Math.cos(a) * rx * k, y + Math.sin(a) * ry]); }   // narrowing to the chin
    wash(face, 0, { ink: true, sw: .5, op: .8 });
    wash([E(.15, -.6), E(.75, -.45), E(.85, .2), E(.4, .85), E(.55, .2)], 1, { op: .4, curv: .5 });   // the shadow side
    if (o.hide) return;
    for (const sd of [-1, 1]) {   // brows, eyes, the crease of the lid
      inkLine([E(sd * .18, -.2), E(sd * .45, old ? -.18 : -.26), E(sd * .68, old ? -.1 : -.19)], old ? .75 : .6, old ? D[2] : INK, 'inkfine');
      inkLine([E(sd * .26, -.04), E(sd * .44, -.09), E(sd * .62, -.03)], .55, INK, 'inkfine');
      paint(ellPts(...E(sd * .44, -.03), rx * .06, ry * .045, 8), { fill: INK, fillOp: 200, bleed: 0, ink: null });
      if (old) inkLine([E(sd * .64, .02), E(sd * .74, .1)], .3, D[3]);
    }
    inkLine([E(.03, -.04), E(.1, .26), E(-.08, .3)], .45, INK, 'inkfine');                                       // nose
    inkLine([E(-.22, .5), E(0, .53), E(.22, .49)], .5, INK, 'inkfine');                                         // mouth
    if (old) {   // Roal: a high brow, thin white hair swept back to tufts over the ears, and a short white beard
      for (const sd of [-1, 1]) wash([E(sd * .68, -.6), E(sd * 1.06, -.32), E(sd * 1.02, .05), E(sd * .9, -.12)], 0, { ink: true, sw: .35, curv: .5 });
      for (let i = 0; i < 5; i++) inkLine([E((i - 2) * .2, -.8), E((i - 2) * .26, -1.0)], .3, D[2]);
      inkLine([E(-.3, .2), E(-.36, .46)], .3, D[3]); inkLine([E(.3, .2), E(.36, .46)], .3, D[3]);
      wash([E(-.72, .25), E(-.55, .7), E(-.2, 1.08), E(0, 1.14), E(.2, 1.08), E(.55, .7), E(.72, .25), E(.4, .62), E(0, .64), E(-.4, .62)], 0, { ink: true, sw: .35, curv: .5 });
      inkLine([E(-.22, .5), E(0, .53), E(.22, .49)], .5, INK, 'inkfine');
    } else {     // dark and close (Trest), under a band (Kahsh), or swept up (a citizen)
      const top = who === 'citizen' ? 1.25 : 1.05, d = who === 'trest' ? 4 : who === 'kahsh' ? 3 : 2;
      wash([E(-1, .05), E(-1.04, -.5), E(-.55, -top), E(.15, -top - .04), E(.85, -.82), E(1.03, -.15), E(.9, -.38), E(.25, -.6), E(-.45, -.56), E(-.86, -.3)], d, { ink: true, sw: .45, curv: .45 });
      if (who === 'trest') inkLine([E(-.3, -.6), E(-.4, -1.02)], .4, PULP.w[2]);                                // the parting
      if (who === 'kahsh') wash([E(-1.02, -.5), E(1.02, -.5), E(.99, -.32), E(-.99, -.32)], 4, { ink: true, sw: .4 });
    }
  };

  // ---------- the Outsiders (p010) ----------
  // "Short, and squat, four-limbed and evidently powerful", a "thick, durable exoskeleton, horny, brownish", three eyes
  // that "projected slightly, protected by horny protruding walls... capable of movement in every direction... set at
  // equal distances apart", in "flexible, transparent suits". About four feet tall and nearly as broad. Their eyes
  // stand around the crown of the head at a third of a turn apart, so one always looks behind.
  //   view 'front' | 'side' (facing right); o.suit  the transparent suit (default on); o.turn  the head's turn, in turns
  DES.outsider = (x, ground, s, t = 0, o = {}) => {
    const u = s, side = o.view === 'side', B = 3, Bd = 4, turn = (o.turn ?? 0) * TAU, G = v => ground - v * u;
    boilSeed('os' + x + o.view);
    paint(ellPts(x, ground, 1.8 * u, .22 * u, 14), { fill: D[3], fillOp: 70, bleed: .3, ink: null });
    const plate = (P, d = B, o2 = {}) => wash(P, d, { ink: true, sw: .6, curv: .3, ...o2 });
    // legs: short, bowed, armoured, on broad three-clawed feet
    for (const sd of side ? [1] : [-1, 1]) {
      const lx = x + (side ? -.1 : sd * .72) * u, kx = lx + (side ? .35 : sd * .28) * u;
      plate(ribbon([[lx, G(1.85)], [kx, G(1.0)]], .8 * u, .68 * u)); plate(ribbon([[kx, G(1.0)], [lx + (side ? .1 : sd * .05) * u, G(.28)]], .66 * u, .54 * u));
      plate(ellPts(kx, G(1.0), .4 * u, .3 * u, 12), Bd);                                                                   // the knee's plate
      const fx = lx + (side ? .25 : sd * .05) * u;
      plate([[fx - (side ? .35 : .5) * u, G(.32)], [fx + (side ? .6 : .5) * u, G(.32)], [fx + (side ? .75 : .6) * u, G(0)], [fx - (side ? .45 : .6) * u, G(0)]], Bd);
      for (let k = -1; k <= 1; k++) inkLine([[fx + (side ? .55 + k * .1 : k * .4) * u, G(.08)], [fx + (side ? .9 + k * .08 : k * .5) * u, G(-.02)]], 1.2, INK);
    }
    // the body: a broad, armoured barrel in overlapping bands, a keel down the front
    const bw = side ? 1.1 : 1.5, bc = G(2.6);
    plate(ellPts(x, bc, bw * u, 1.0 * u, 26));
    for (let k = -1; k <= 1; k++) { const yy = bc + k * .42 * u, ww = bw * u * Math.sqrt(1 - (k * .42) ** 2) * .97;
      inkLine([[x - ww, yy], [x - ww * .3, yy + .03 * u], [x, yy + .12 * u], [x + ww * .3, yy + .03 * u], [x + ww, yy]], .55, D[4], 'inkfine', 0); }
    if (!side) inkLine([[x, bc - .9 * u], [x, bc + .95 * u]], .5, D[4]);
    else for (let k = 0; k < 3; k++) plate(ellPts(x - bw * u * .82, bc - .55 * u + k * .5 * u, .3 * u, .26 * u, 10), Bd);   // the dorsal plates
    plate([[x + bw * u * .35, bc - .85 * u], [x + bw * u * .97, bc], [x + bw * u * .35, bc + .85 * u], [x + bw * u * .75, bc]], Bd, { op: .7 });
    // arms: heavy, jointed, spurred at the elbow, three thick digits
    for (const sd of side ? [1] : [-1, 1]) {
      const ax = x + (side ? .15 : sd * 1.3) * u, ay = G(3.25), ex = ax + (side ? .45 : sd * .5) * u, ey = G(2.4), hx = ax + (side ? .85 : sd * .3) * u, hy = G(1.6);
      plate(ellPts(ax, ay, .5 * u, .38 * u, 12), Bd);                                                                     // the shoulder plate
      plate(ribbon([[ax, ay], [ex, ey]], .58 * u, .5 * u)); plate(ribbon([[ex, ey], [hx, hy]], .5 * u, .42 * u));
      plate(ellPts(ex, ey, .32 * u, .27 * u, 12), Bd);                                                                     // the elbow's plate
      for (let k = -1; k <= 1; k++) inkLine([[hx, hy], [hx + k * .16 * u, hy + .32 * u], [hx + k * .1 * u, hy + .48 * u]], 1.5, INK);
    }
    // the head: a low carapace sunk between the shoulders, mandibles beneath, the three eye-turrets standing around its
    // crown a third of a turn apart (front: two forward and one behind; side: one forward, one near and one far)
    const hy = G(3.6), hw = side ? .8 : 1.0;
    const eyes = [0, 1, 2].map(i => { const a = (side ? 0 : Math.PI) + i * TAU / 3 + turn; return side ? { x: Math.cos(a), z: Math.sin(a) } : { x: Math.sin(a), z: Math.cos(a) }; });
    const turret = (e, front) => {
      if ((e.z > -.3) !== front) return;
      const bx = x + e.x * hw * .62 * u, by = hy - .3 * u, tx = bx + e.x * .32 * u, ty = by - .38 * u + Math.max(0, -e.z) * .05 * u;
      plate([[bx - .2 * u, by], [tx - .17 * u, ty], [tx + .17 * u, ty], [bx + .2 * u, by]], Bd);                          // the horny wall
      plate(ellPts(tx, ty, .2 * u, .1 * u + .08 * u * Math.max(0, e.z), 12), Bd);
      if (e.z > -.3) { const k = .4 + .6 * Math.max(0, e.z);
        wash(ellPts(tx + e.x * .04 * u, ty, .13 * u, .1 * u * k + .02 * u, 12), 0, { ink: true, sw: .5 });
        paint(ellPts(tx + e.x * .07 * u, ty, .06 * u, .06 * u * k + .01 * u, 8), { fill: INK, fillOp: 220, bleed: 0, ink: null }); glow(tx, ty - .04 * u, .1 * u, NRG.white, .4); }
    };
    for (const e of eyes) turret(e, false);
    const fx = side ? .35 : 0;   // where the face is
    plate([[x - hw * u, hy + .3 * u], [x - hw * u * .92, hy - .2 * u], [x - hw * u * .45, hy - .5 * u], [x + hw * u * .45, hy - .5 * u], [x + hw * u * .92, hy - .2 * u], [x + hw * u, hy + .3 * u], [x + (fx + .2) * u, hy + .45 * u], [x + (fx - .2) * u, hy + .45 * u]]);
    inkLine([[x - hw * u * .45, hy - .5 * u], [x + (side ? .1 : 0) * u, hy - .58 * u], [x + hw * u * .45, hy - .5 * u]], .6, D[4]);       // the ridge
    for (const sd of side ? [1] : [-1, 1]) {   // mandibles: two hooked plates under the face
      const mx = x + (fx + sd * .16) * u;
      plate([[mx - sd * .06 * u, hy + .35 * u], [mx + sd * .14 * u, hy + .45 * u], [mx + sd * .06 * u, hy + .75 * u], [mx - sd * .1 * u, hy + .8 * u], [mx - sd * .02 * u, hy + .62 * u]], Bd);
    }
    for (const e of eyes) turret(e, true);
    // the suit: a clear envelope, a few strokes of reflected light, its cuffs at the ankles
    if (o.suit !== false) {
      boilSeed('suit' + x + o.view);
      const S = []; for (let i = 0; i < 30; i++) { const a = i / 30 * TAU; S.push([x + Math.cos(a) * (side ? 1.65 : 2.05) * u, G(2.15) + Math.sin(a) * 2.35 * u]); }
      paint(S, { wash: '#FFFFFF', washOp: 26, ink: D[2], sw: .55, br: 'inkfine' });
      for (const k of [0, 1]) inkLine([[x - (1.25 - k * .25) * u, G(3.9 - k * .4)], [x - (1.6 - k * .2) * u, G(3.15 - k * .4)], [x - (1.72 - k * .15) * u, G(2.4 - k * .4)]], .7, '#FFFFFF', 'inkfine');
      for (const sd of side ? [1] : [-1, 1]) arcLine(x + (side ? .05 : sd * .74) * u, G(.45), .5 * u, .1 * u, .45, D[2]);
    }
  };
  // the crown of an Outsider's head from above: the three eyes a third of a turn apart
  DES.outsiderCrown = (x, y, r) => {
    boilSeed('crown');
    wash(ellPts(x, y, r, r, 24), 3, { ink: true, sw: .6 });
    wash(ellPts(x, y, r * .5, r * .5, 16), 4, { ink: true, sw: .4 });
    for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + Math.PI / 3 + i * TAU / 3, ex = x + Math.cos(a) * r * .8, ey = y + Math.sin(a) * r * .8;
      wash(ellPts(ex, ey, r * .28, r * .28, 12), 4, { ink: true, sw: .5 }); wash(ellPts(ex + Math.cos(a) * r * .05, ey + Math.sin(a) * r * .05, r * .16, r * .16, 10), 0, { ink: true, sw: .4 });
      inkLine([[ex + Math.cos(a) * r * .3, ey + Math.sin(a) * r * .3], [ex + Math.cos(a) * r * .55, ey + Math.sin(a) * r * .55]], .5, D[3]); }
  };

  // ---------- ships ----------
  // A torpedo of the void (p007): "a thousand kilads in length", "shining dully" (p075). A long hull of riveted plates with
  // a blunt nose, a spine of projector turrets for the beams, ports along its flank, and drive bells astern. len px.
  DES.oShip = (x, y, len, t = 0, o = {}) => {
    const h = len * .11, d = o.d ?? 3; boilSeed('oship' + x + y);
    // the hull's half-height along its length, k from -.46 (stern) to .5 (nose)
    const hh = k => k > .36 ? h * Math.sqrt(Math.max(0, 1 - ((k - .36) / .14) ** 2)) : k < -.42 ? h * lerp(.5, .78, (k + .46) / .04) : h * lerp(.78, 1, (k + .42) / .78);
    const N = 40, ks = Array.from({ length: N + 1 }, (_, i) => lerp(-.46, .5, i / N));
    const band = (f0, f1, dd, op = 1) => wash([...ks.map(k => [x + k * len, y + hh(k) * f0]), ...ks.slice().reverse().map(k => [x + k * len, y + hh(k) * f1])], dd, { op });
    for (let k = 0; k < 4; k++) { const kk = -.3 + k * .17, bx = x + kk * len, by = y - hh(kk);   // the projector turrets, seated on the hull
      wash([[bx - len * .025, by + 4], [bx - len * .02, by - h * .32], [bx + len * .02, by - h * .32], [bx + len * .025, by + 4]], d + 1, { ink: true, sw: .5 });
      wash(ellPts(bx, by - h * .32, len * .02, h * .08, 12), d, { ink: true, sw: .4 });
      wash(ribbon([[bx, by - h * .22], [bx + len * .05, by - h * .26]], h * .07, h * .05), 4, { ink: true, sw: .4 }); }
    for (const sd of [-1, 1]) { const by = y + sd * h * .3;   // the drive bells astern
      wash([[x - len * .45, by - sd * h * .06], [x - len * .45, by + sd * h * .1], [x - len * .52, by + sd * h * .3], [x - len * .53, by - sd * h * .2]], 4, { ink: true, sw: .6, curv: .3 }); }
    band(-1, -.55, Math.max(0, d - 2), .9); band(-.55, .35, d); band(.35, 1, d + 1);
    paint([...ks.map(k => [x + k * len, y - hh(k)]), ...ks.slice().reverse().map(k => [x + k * len, y + hh(k)])], { ink: INK, sw: 1, br: 'inkfine' });
    inkLine(ks.filter(k => k > -.4 && k < .38).map(k => [x + k * len, y - hh(k) * .55]), .4, D[2], 'inkfine', 0);                        // the dull shine's edge
    for (let k = 1; k < 10; k++) { const kk = -.42 + k * .08, X0 = x + kk * len; inkLine([[X0, y - hh(kk) * .98], [X0 + len * .004, y], [X0, y + hh(kk) * .98]], .45, D[4], 'inkfine'); }   // the plates
    inkLine([[x + .36 * len, y - h * .98], [x + .345 * len, y], [x + .36 * len, y + h * .98]], .6, INK, 'inkfine');                          // the nose cap's seam
    for (let k = 0; k < 24; k++) { const kk = -.38 + k * .03; paint(ellPts(x + kk * len, y + hh(kk) * .1, len * .0045, len * .0045, 6), { fill: PULP.w[4], fillOp: 220, bleed: 0, ink: null }); }   // ports
    if (o.drive) for (const sd of [-1, 1]) glow(x - len * .53, y + sd * h * .3, h * .6, NRG.white, .35);
  };
  // the ship from ahead: a disc of plates with its turrets above
  DES.oShipFront = (x, y, r) => { boilSeed('osf'); wash(ellPts(x, y, r, r, 26), 3, { ink: true, sw: .9 }); wash(ellPts(x, y, r * .62, r * .62, 20), 2, { ink: true, sw: .5 });
    for (let k = 0; k < 8; k++) { const a = k / 8 * TAU; inkLine([[x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62], [x + Math.cos(a) * r, y + Math.sin(a) * r]], .45, D[4]); }
    wash(rrPts(x - r * .15, y - r * 1.4, r * .3, r * .42, r * .06), 4, { ink: true, sw: .5 }); };
  // an investigator: "scarcely three inches in diameter" (p009), a polished sphere that crept and wormed where nothing
  // else could reach: a ring of sense-receptors at its equator, one great lens, and three short feelers. r px.
  DES.investigator = (x, y, r, t = 0) => {
    boilSeed('inv' + x);
    wash(ellPts(x, y, r, r, 24), 1, { ink: true, sw: .8 });
    wash(ellPts(x + r * .35, y + r * .3, r * .6, r * .6, 18), 3, { op: .6 });
    wash(ellPts(x - r * .35, y - r * .4, r * .25, r * .16, 12, 0, -.6), 0, { op: .6 });
    arcLine(x, y, r, r * .3, .6);
    for (let k = -2; k <= 2; k++) lens(x + k * r * .38, y + r * .3 * Math.sqrt(1 - (k * .38) ** 2), r * .08);
    lens(x + r * .1, y - r * .25, r * .26);
    for (let k = 0; k < 3; k++) { const a = Math.PI * .65 + k * .35 + .1 * wob(t, .6, k * .3); inkLine(through([[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * r * 1.35, y + Math.sin(a) * r * 1.4], [x + Math.cos(a + .2) * r * 1.6, y + Math.sin(a + .2) * r * 1.6]]), .8, INK, 'inkfine'); }
  };
  // one of the "ten thousand tiny, darting motes" (p074–p076): the family form laid on its side, a capsule domed at both
  // ends, "each a living thing unto itself". len px.
  DES.mote = (x, y, len, t = 0, o = {}) => {
    const r = len * .2, ang = o.ang || 0; push(); translate(x, y); rotate(ang); boilSeed('mote' + x + y);
    const P = []; for (let i = 0; i <= 12; i++) { const a = -Math.PI / 2 + i / 12 * Math.PI; P.push([len * .3 + Math.cos(a) * len * .2, Math.sin(a) * r]); }
    for (let i = 0; i <= 12; i++) { const a = Math.PI / 2 + i / 12 * Math.PI; P.push([-len * .3 + Math.cos(a) * len * .2, Math.sin(a) * r]); }
    wash(P, 1, { ink: true, sw: .7 });
    wash([[-len * .45, r * .3], [len * .45, r * .3], [len * .3, r], [-len * .3, r]], 3, { op: .7 });
    inkLine([[-len * .05, -r], [-len * .05, r]], .5, INK); inkLine([[len * .05, -r], [len * .05, r]], .5, INK);
    pop();
    lens(x + Math.cos(ang) * len * .38, y + Math.sin(ang) * len * .38 - r * .15, r * .28);
    if (o.drive) glow(x - Math.cos(ang) * len * .5, y - Math.sin(ang) * len * .5, r * 1.6, NRG.white, .35);
  };

  // ---------- places ----------
  // The power plant (p113): "nearly five hundred feet in height, a mighty, bluntly rounded dome at its top, the cylinder
  // stood, covered over with smoothly gleaming metal, slightly luminescent in itself." The family form at its largest.
  DES.plant = (x, ground, s, t = 0, o = {}) => {
    const r = 75 * s, h = 400 * s, dh = 90 * s;
    boilSeed('plsh'); paint(ellPts(x, ground, r * 1.4, r * .2, 20), { fill: D[3], fillOp: 80, bleed: .3, ink: null });
    dcase(x, ground, r, h, dh, 2, { shine: true, rings: [.04, .25, .5, .75] });
    glow(x, ground - h * .55, r * 2.6, NRG.livid, o.lum ?? .14);   // slightly luminescent in itself
  };
  // The dome (p092–p095): a cloudiness that "arched over them... a solid, black dome that reached over them and curved
  // down to the ground", held up from within by "a strange violet beam". r px; o.cut  a cut-away, to show inside.
  DES.blackDome = (x, ground, r, t = 0, o = {}) => {
    boilSeed('bdome');
    const P = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; P.push([x + Math.cos(a) * r, ground + Math.sin(a) * r * .8]); }
    if (!o.cut) { paint(P, { wash: PULP.black, washOp: 255, fill: PULP.black, fillOp: 230, bleed: .02, tex: .2, ink: INK, sw: 1 }); return; }
    // cut away: the shell's section, black, and inside, the violet support beam from the machine to the crown
    const Q = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; Q.push([x + Math.cos(a) * r * .95, ground + Math.sin(a) * r * .8 * .94]); }
    wash(Q.slice(), 4, { op: .9 });                                                     // within, near dark
    paint([...P, ...Q.reverse()], { wash: PULP.black, washOp: 255, fill: PULP.black, fillOp: 230, bleed: .02, ink: INK, sw: .8 });
    // F-2's machine on the ground, its violet beam up to the crown and spreading across the canopy (p095, p097)
    boilSeed('dmach'); wash(rrPts(x - r * .06, ground - r * .1, r * .12, r * .1, r * .02), 2, { ink: true, sw: .6 });
    beam(x, ground - r * .1, x, ground - r * .72, r * .04, r * .1, NRG.support, 1, { splash: false, washOp: 70, a: .7 });
    for (let i = 0; i <= 16; i++) { const a = Math.PI + (.12 + i / 16 * .76) * Math.PI; glow(x + Math.cos(a) * r * .9, ground + Math.sin(a) * r * .8 * .9, r * .12, NRG.support, .35 * (1 - Math.abs(i - 8) / 10)); }
    glow(x, ground - r * .74, r * .35, NRG.support, .6);
  };
  // The Denver laboratory (p030, p047, p083): the great hall where the science-investigators sat watching "the flashing,
  // changing screens": tall fluted piers, a gallery, a wall of screens, and the floor where the machines are built.
  DES.lab = (x0, y0, w, h, t = 0, o = {}) => {
    boilSeed('lab');
    wash(rectPts(x0, y0, w, h), 3, { op: .9 });
    const fy = y0 + h * .78;
    wash([[x0, fy], [x0 + w, fy], [x0 + w, y0 + h], [x0, y0 + h]], 2, { op: 1.1 });
    for (let k = 0; k < 9; k++) inkLine([[x0 + w / 2 + (k - 4) * w * .06, fy], [x0 + w / 2 + (k - 4) * w * .16, y0 + h]], .4, D[3]);   // the floor's lines run to us
    inkLine([[x0, fy], [x0 + w, fy]], .8, INK);
    // the wall of screens, each a pale rectangle of light: some flashing, one dark
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const sx = x0 + w * .16 + c * w * .1, sy = y0 + h * .2 + r * h * .16, k = hash(c * 7 + r * 3 + Math.floor(t * 2));
      wash(rectPts(sx, sy, w * .085, h * .13), 4, { ink: true, sw: .5 }); if (k > .15) paint(rectPts(sx + 4, sy + 4, w * .085 - 8, h * .13 - 8), { wash: '#F1E9D3', washOp: 120 + 100 * k, ink: null }); }
    // the piers, fluted, and the gallery across them
    for (let k = 0; k < 6; k++) { const px = x0 + w * (.04 + k * .19); wash(rectPts(px, y0, w * .05, fy - y0), 3, { ink: true, sw: .6 });
      for (let f = 1; f < 4; f++) inkLine([[px + f * w * .0125, y0 + 10], [px + f * w * .0125, fy - 10]], .35, D[4]); wash(rectPts(px - w * .01, fy - h * .03, w * .07, h * .03), 4, { ink: true, sw: .5 }); }
    wash(rectPts(x0, y0 + h * .08, w, h * .05), 4, { ink: true, sw: .6 });
    // Roal's couch (p051), to the left of the floor
    if (o.couch !== false) { const cx = x0 + w * .2, cy = fy + h * .1; wash([[cx - w * .07, cy], [cx + w * .07, cy], [cx + w * .07, cy + h * .05], [cx - w * .07, cy + h * .05]], 3, { ink: true, sw: .6 }); wash([[cx - w * .07, cy], [cx - w * .08, cy - h * .06], [cx - w * .05, cy - h * .06], [cx - w * .045, cy]], 3, { ink: true, sw: .5 }); }
  };

  // ---------- people in profile, acting (the pilot's poses) ----------
  // A figure seen from the side, facing right (o.flip: left), drawn from its hip (hx, hy), s px to the foot. Its pose is
  // a set of angles (radians): torso from upright (+ leans forward, -π/2 lies back), thigh and shin from hanging straight
  // down (+ forward), and the near arm's upper and fore arm from hanging (+ forward and up). Standing, the hip is
  // DES.HIP feet above the ground. o.lid 0..1 closes the eye; o.look tilts the head (+ up); o.talk 0..1 opens the mouth.
  // Walking adds the far leg (farThigh, farShin), whose boot steps under the hem. Roal's robe to the ankle.
  DES.HIP = 3.1;
  DES.POSE = {
    stand: { torso: 0, thigh: 0, shin: 0, up: .12, fore: .3, farUp: .05, farFore: .15 },
    sit: { torso: .1, thigh: 1.45, shin: .12, up: .4, fore: 1.25, farUp: .3, farFore: 1.1 },
    lie: { torso: -1.5, thigh: 1.5, shin: 1.5, up: .1, fore: 2.6, farUp: .02, farFore: .1 },
    sitUp: { torso: -.05, thigh: 1.5, shin: 1.5, up: .35, fore: 1.5, farUp: .25, farFore: 1.3 },   // sitting up on the couch, legs along it
    shield: { torso: -.16, thigh: -.08, shin: .06, up: 2.1, fore: 4.5, farUp: 1.5, farFore: 2.2 },
  };
  DES.personSide = (hx, hy, s, t = 0, o = {}) => {
    const who = o.who || 'roal', u = s * 6 / 7.4, f = o.flip ? -1 : 1, P = { ...DES.POSE.stand, ...o.pose };
    const cloth = { roal: 1, trest: 2, kahsh: 3, citizen: 1 }[who];
    const dir = a => [Math.sin(a) * f, -Math.cos(a)];                       // a unit vector at angle a from up
    const add = (p, a, L) => { const d = dir(a); return [p[0] + d[0] * L * u, p[1] + d[1] * L * u]; };
    const hip = [hx, hy], waist = add(hip, P.torso, 1.0), sh = add(hip, P.torso, 2.45), neck = add(sh, P.torso, .32);
    const knee = add(hip, Math.PI - P.thigh, 1.6), ank = add(knee, Math.PI - P.shin, 1.5);
    boilSeed('ps' + who + (o.key || ''));
    const arm = (up, fore, d, op, back) => { const sa = add(sh, P.torso + Math.PI, .3), el = add(sa, P.torso + Math.PI - up, 1.2), hd = add(el, P.torso + Math.PI - fore, 1.05);
      const R = ribbon([sa, el, hd], .5 * u, .42 * u); paint(R, { wash: D[0], washOp: 255, ink: null }); wash(R, d, { ink: true, sw: .45, op });
      const hp = add(hd, P.torso + Math.PI - fore, .12); paint(ellPts(...hp, .16 * u, .19 * u, 10), { wash: D[0], washOp: 255, ink: null }); wash(ellPts(...hp, .16 * u, .19 * u, 10), back ? 1 : 0, { ink: true, sw: .4, op }); return hd; };
    arm(P.farUp, P.farFore, dk(cloth + 1), .9, true);
    // walking (P.farThigh, P.farShin): the far boot, stepping under the hem
    if (P.farThigh != null) { const fk = add(hip, Math.PI - P.farThigh, 1.6), fa = add(fk, Math.PI - P.farShin, 1.5), fA = Math.PI / 2 - P.farShin, ft = add(fa, fA, .5);
      wash([add(fa, fA + Math.PI, .2), add(add(fa, Math.PI - P.farShin, -.25), fA, .1), ft, add(ft, Math.PI - P.farShin, .2), add(fa, Math.PI - P.farShin, .22)], 4, { ink: true, sw: .4, curv: .3, op: .9 }); }
    // the boot's toe, before the hem covers its heel
    const footA = Math.PI / 2 - P.shin, toe = add(ank, footA, .5);
    wash([add(ank, footA + Math.PI, .2), add(add(ank, Math.PI - P.shin, -.25), footA, .1), toe, add(toe, Math.PI - P.shin, .2), add(ank, Math.PI - P.shin, .22)], 4, { ink: true, sw: .4, curv: .3 });
    // the body as one shape: a spine from the neck to the hem, offset to its front and its back by the robe's depth
    const spine = [neck, sh, waist, hip, knee, ank], fw = [.2, .5, .44, .5, .42, .58], bw = [.24, .52, .44, .62, .46, .52];
    const N = spine.map((p, i) => { const a = spine[Math.max(0, i - 1)], b = spine[Math.min(spine.length - 1, i + 1)], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const tx = (b[0] - a[0]) / L, ty = (b[1] - a[1]) / L; return [ty * f, -tx * f]; });
    const miter = i => { if (i === 0 || i === spine.length - 1) return 1; const a = spine[i - 1], b = spine[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, n0 = [(b[1] - a[1]) / L * f, -(b[0] - a[0]) / L * f]; return 1 / Math.max(.55, n0[0] * N[i][0] + n0[1] * N[i][1]); };
    const front = spine.map((p, i) => [p[0] + N[i][0] * fw[i] * u * miter(i), p[1] + N[i][1] * fw[i] * u * miter(i)]);
    const back = spine.map((p, i) => [p[0] - N[i][0] * bw[i] * u * miter(i), p[1] - N[i][1] * bw[i] * u * miter(i)]);
    paint([...front, ...back.slice().reverse()], { wash: D[0], washOp: 255, ink: null, curv: .25 });
    wash([...front, ...back.reverse()], cloth, { ink: true, sw: .6, curv: .25 });
    back.reverse();
    wash([...spine.slice(1, 4).map((p, i) => [lerp(p[0], back[i + 1][0], .45), lerp(p[1], back[i + 1][1], .45)]), ...back.slice(1, 4).reverse()], dk(cloth + 1), { op: .5, curv: .3 });   // the shadow down the back
    for (const k of [.3, .65]) inkLine([[lerp(knee[0], ank[0], k) + N[5][0] * .3 * u, lerp(knee[1], ank[1], k) + N[5][1] * .3 * u], [lerp(knee[0], ank[0], k + .3) + N[5][0] * .4 * u, lerp(knee[1], ank[1], k + .3) + N[5][1] * .4 * u]], .4, D[3]);   // the robe's folds
    inkLine([front[2], back[2]], 1.1, INK);                                                                               // the belt
    // the standing collar, rising behind the head
    wash([add(neck, P.torso - Math.PI / 2, .22), add(add(neck, P.torso, .78), P.torso - Math.PI / 2, .45), add(add(neck, P.torso, .82), P.torso - Math.PI / 2, .26), add(neck, P.torso + Math.PI / 2, .14)], dk(cloth + 1), { ink: true, sw: .45 });
    const hc = add(neck, P.torso + (o.look || 0) * .3, .52);
    DES.headSide(hc[0], hc[1], u, who, { rot: (P.torso - (o.look || 0) * .5) * f, flip: o.flip, lid: o.lid, hide: o.shieldFace, smile: o.smile, talk: o.talk });
    const hand = arm(P.up, P.fore, cloth, 1);
    return { hip, sh, knee, ank, hand, head: hc };
  };
  // A head in profile facing right, u px to the head's height, rotated by o.rot about its centre.
  DES.headSide = (x, y, u, who = 'roal', o = {}) => {
    const f = o.flip ? -1 : 1, c = Math.cos(o.rot || 0), sn = Math.sin(o.rot || 0), old = who === 'roal';
    const E = (a, b) => { const X = a * u * f, Y = b * u; return [x + X * c - Y * sn, y + X * sn + Y * c]; };
    boilSeed('hs' + who);
    const face = [[0, -.6], [.27, -.5], [.36, -.26], [.34, -.13], [.36, -.08], [.49, .07], [.37, .12], [.39, .2], [.35, .25], [.36, .37], [.2, .46], [-.04, .33], [-.18, .4], [-.4, .06], [-.38, -.33], [-.2, -.56]];
    paint(face.map(p => E(...p)), { wash: D[0], washOp: 255, ink: null, curv: .45 });
    wash(face.map(p => E(...p)), 0, { ink: true, sw: .5, curv: .45, op: .85 });
    wash([[-.1, -.5], [-.38, -.3], [-.4, .05], [-.2, .38], [-.04, .3], [-.12, -.1]].map(p => E(...p)), 1, { op: .4, curv: .5 });   // the shadow at the back of the skull
    wash([[-.1, -.06], [.0, -.12], [.02, .08], [-.08, .12]].map(p => E(...p)), 0, { ink: true, sw: .35, curv: .6 });               // the ear
    if (!o.hide) {
      const lid = o.lid ?? 0;
      inkLine([E(.14, -.2), E(.25, -.24), E(.33, -.2)], old ? .75 : .6, old ? D[2] : INK, 'inkfine');                          // the brow
      if (lid > .8) inkLine([E(.17, -.1), E(.24, -.07), E(.3, -.1)], .5, INK, 'inkfine');
      else { inkLine([E(.17, -.11), E(.25, -.14 + lid * .05), E(.31, -.1)], .5, INK, 'inkfine'); paint(ellPts(...E(.27, -.1 + lid * .02), u * .03, u * .03 * (1 - lid), 8), { fill: INK, fillOp: 210, bleed: 0, ink: null }); }
      inkLine([E(.3, .21), E(.37, .21)], .4, INK, 'inkfine');                                                               // the mouth
      if (o.talk > .05) paint(ellPts(...E(.335, .225), u * .035, u * .04 * o.talk, 8), { fill: INK, fillOp: 200, bleed: 0, ink: null });   // open, speaking
    }
    if (old) {   // thin white hair at the back, a high bare crown, a short white beard
      wash([[-.15, -.5], [-.38, -.32], [-.44, -.02], [-.32, .08], [-.3, -.2]].map(p => E(...p)), 0, { ink: true, sw: .35, curv: .5 });
      wash([[.34, .22], [.4, .4], [.3, .6], [.08, .58], [-.06, .36], [.12, .3], [.3, .28]].map(p => E(...p)), 0, { ink: true, sw: .35, curv: .5 });
      inkLine([E(.1, -.06), E(.18, .14)], .3, D[3]);
    } else wash([[-.42, -.1], [-.4, -.42], [-.1, -.64], [.24, -.54], [.3, -.42], [.0, -.44], [-.2, -.25], [-.3, .02]].map(p => E(...p)), who === 'trest' ? 4 : 2, { ink: true, sw: .45, curv: .45 });
  };
  // Roal's couch (p051), from the side: a long low couch with a raised head at the left. Returns where its seat is.
  DES.couch = (x, ground, s) => {
    const L = 6.6 * s, sh = 1.4 * s; boilSeed('couch');
    paint(ellPts(x, ground, L * .55, s * .2, 16), { fill: D[3], fillOp: 70, bleed: .3, ink: null });
    for (const k of [-.44, .44]) wash(rrPts(x + k * L - s * .15, ground - sh * .45, s * .3, sh * .45, s * .08), 4, { ink: true, sw: .5 });
    wash(rrPts(x - L / 2, ground - sh, L, sh * .58, s * .18), 3, { ink: true, sw: .6 });
    wash(rrPts(x - L / 2 + s * .1, ground - sh - s * .32, L - s * .2, s * .4, s * .18), 2, { ink: true, sw: .5 });
    wash([[x - L / 2, ground - sh * .6], [x - L / 2 - s * .2, ground - sh - s * 1.3], [x - L / 2 + s * .5, ground - sh - s * 1.35], [x - L / 2 + s * .7, ground - sh - s * .2]], 3, { ink: true, sw: .6, curv: .4 });
    return { seat: ground - sh - s * .32, x0: x - L / 2, x1: x + L / 2 };
  };
  // A pair of human eyes, very close (p055: "In human eyes there was always the expression of thought"). w px across
  // both; o.old for Roal's lids and lines; o.look -1..1 where they look; o.lid 0..1; o.far: the soft, dreaming gaze.
  DES.eyes = (x, y, w, t = 0, o = {}) => {
    const e = w * .19, lk = (o.look ?? 0) * e * .25, lid = o.lid ?? .15;
    boilSeed('eyes');
    wash(rectPts(x - w * .7, y - w * .35, w * 1.4, w * .7), 0, { op: .7 });
    wash([[x - w * .1, y - w * .3], [x + w * .1, y - w * .3], [x + w * .06, y + w * .3], [x - w * .06, y + w * .3]], 1, { op: .45, curv: .4 });   // the bridge of the nose
    for (const sd of [-1, 1]) {
      const cx = x + sd * w * .27, cy = y;
      const almond = []; for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, k = Math.sin(a) < 0 ? 1 : .8; almond.push([cx + Math.cos(a) * e, cy + Math.sin(a) * e * .42 * k]); }
      paint(almond, { wash: '#EFE6D2', washOp: 235, ink: null });
      const ir = e * .42; wash(ellPts(cx + lk, cy, ir, ir, 22), 2, { ink: true, sw: .6 });
      paint(ellPts(cx + lk, cy, ir * .45, ir * .45, 16), { fill: INK, fillOp: 230, bleed: 0, ink: null });
      glow(cx + lk - ir * .3, cy - ir * .35, ir * .3, NRG.white, .5);
      if (o.far) glow(cx + lk, cy, ir * 1.2, '#F4EEDC', .12);
      // the upper lid, closing over the eye, and its crease; the lower lid
      const top = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i / 16 * Math.PI; top.push([cx + Math.cos(a) * e * 1.05, cy + Math.sin(a) * e * .45 * (1 - 2 * lid)]); }
      for (let i = 16; i >= 0; i--) { const a = Math.PI + i / 16 * Math.PI; top.push([cx + Math.cos(a) * e * 1.1, cy + Math.sin(a) * e * .62]); }
      wash(top, 1, { ink: false });
      inkLine(top.slice(0, 17), 1.4, INK, 'inkfine');
      inkLine(Array.from({ length: 13 }, (_, i) => { const a = Math.PI + (.1 + i / 12 * .8) * Math.PI; return [cx + Math.cos(a) * e * 1.15, cy + Math.sin(a) * e * .75]; }), .6, D[3], 'inkfine');
      inkLine(Array.from({ length: 13 }, (_, i) => { const a = (.08 + i / 12 * .84) * Math.PI; return [cx + Math.cos(a) * e, cy + Math.sin(a) * e * .4]; }), .6, D[3], 'inkfine');
      // the brow: white and wild for Roal
      inkLine([[cx - sd * e * 1.1, cy - e * .95], [cx, cy - e * 1.2], [cx + sd * e * 1.25, cy - e * .9]], o.old ? 2.2 : 1.6, o.old ? D[1] : INK, 'dry');
      if (o.old) for (let k = 0; k < 3; k++) inkLine([[cx + sd * e * (1.2 + k * .05), cy + e * (.05 + k * .18)], [cx + sd * e * (1.55 + k * .05), cy + e * (.1 + k * .25)]], .5, D[3], 'inkfine');   // crow's feet
    }
    return [[x - w * .27 + lk, y], [x + w * .27 + lk, y]];
  };
  // a small cage (p071) and the guinea pig in it; o.dead lays it on its side
  DES.cage = (x, ground, s, t = 0, o = {}) => {
    const w = 1.2 * s, h = .9 * s; boilSeed('cage');
    paint(ellPts(x, ground, w * .6, s * .06, 12), { fill: D[3], fillOp: 70, bleed: .3, ink: null });
    wash(rectPts(x - w / 2, ground - s * .08, w, s * .08), 3, { ink: true, sw: .5 });
    // the guinea pig: a round brown body, a blunt head, a small ear and a dark eye
    const px = x - w * .05, py = ground - s * .08, b = s * .32, dead = o.dead || 0;
    push(); translate(px, py); rotate(dead * Math.PI * .5 * .9); translate(-px, -py);
    wash(ellPts(px, py - b * .55, b, b * .55, 18), 2, { ink: true, sw: .5 });
    wash(ellPts(px + b * .75, py - b * .6, b * .45, b * .4, 14), 2, { ink: true, sw: .5 });
    wash([[px - b * .6, py - b * .9], [px - b * .1, py - b * 1.05], [px + b * .3, py - b * .85], [px - b * .2, py - b * .75]], 0, { op: .7, curv: .5 });   // a pale patch
    wash(ellPts(px + b * .62, py - b * .95, b * .14, b * .1, 8), 3, { ink: true, sw: .35 });
    if (dead < .5) paint(ellPts(px + b * .95, py - b * .66, b * .06, b * .06, 8), { fill: INK, fillOp: 220, bleed: 0, ink: null });
    else inkLine([[px + b * .9, py - b * .66], [px + b * 1.0, py - b * .66]], .5, INK);
    inkLine([[px + b * 1.18, py - b * .5], [px + b * 1.12, py - b * .52]], .4, INK);
    pop();
    // the bars, over it
    for (let k = 0; k <= 7; k++) inkLine([[x - w / 2 + k * w / 7, ground - s * .08], [x - w / 2 + k * w / 7, ground - h]], .6, D[4], 'inkfine', 0);
    wash(rectPts(x - w / 2 - s * .03, ground - h - s * .06, w + s * .06, s * .08), 3, { ink: true, sw: .5 });
    inkLine(through([[x - w * .15, ground - h - s * .06], [x, ground - h - s * .3], [x + w * .15, ground - h - s * .06]]), .8, INK, 'inkfine');   // the handle
    return [x, ground - h - s * .3];
  };
  // the settings hold still: only what moves in front of them boils (core.js, steady)
  for (const k of ['lab', 'blackDome', 'plant']) { const f = DES[k]; DES[k] = (...a) => steady(() => f(...a)); }
})();
