// lookdev.js: Phase 4's style frames (Round 4). One still per step of the colour arc in PLAN.md §5, each a short loop so
// the boil and the energy move: studio.html?loop=look1 … look6, and the chapter-title page, ?loop=lookTitle.
// tools/look_sampler.mjs renders them for the review page. These test the medium, not the designs: the ships, machines
// and people here are placeholders until their model sheets.
(() => {
  const D = PULP.w;
  const stars = (n, y1, seed = 1, a = .7) => { for (let i = 0; i < n; i++) glow(hash(i * 3.1 + seed) * W, hash(i * 7.7 + seed) * y1, 6 + 10 * hash(i + seed), NRG.white, a * (.5 + .5 * hash(i * 1.3))); };
  const sky = (k0, k1, h = H, seed = 1) => { shade(-60, h, k0, k1); blooms(0, h, 9, 1, seed, .6); };
  const night = (k0 = .82, k1 = .62, seed = 1) => { shade(-60, H + 60, k0, k1, PULP.black); blooms(0, H, 10, 3, seed, .5); };
  const ground = (y0, y1, d, seed) => { boilSeed('gr' + seed); wash([[-60, y0], [W + 60, y1], [W + 60, H + 60], [-60, H + 60]], d, { op: 1.2 });
    for (let i = 0; i < 26; i++) { const x = hash(i * 3 + seed) * W, y = lerp(y0, H, hash(i * 5 + seed)) + 10, l = 40 + 120 * hash(i * 7 + seed); inkLine([[x, y], [x + l, y + jit(2)]], .35, PULP.w[4]); } };

  // a tower of 2538: a tall shaft with a rounded crown and a ring of balconies
  function tower(x, base, w, h, d, seed) {
    boilSeed('tw' + seed);
    wash([[x - w / 2, base], [x - w * .42, base - h], [x + w * .42, base - h], [x + w / 2, base]], d, { ink: true, sw: .5 });
    wash(ellPts(x, base - h, w * .46, w * .3, 18), d + 1, { ink: true, sw: .5 });
    for (let k = 1; k < 4; k++) { const y = base - h * k / 4, rw = w * (.75 - .1 * k); wash(rectPts(x - rw, y - 6, rw * 2, 12), d + 1, { op: .8 }); }
    for (let k = 0; k < h / 26; k++) if (hash(k + seed * 13) > .45) inkLine([[x - w * .2, base - 14 - k * 26], [x + w * .2, base - 14 - k * 26]], .35, D[4]);
  }
  function city(base, n, d, seed, sc = 1) {
    for (let i = 0; i < n; i++) { const x = (i + .3 + hash(i + seed) * .5) / n * (W + 200) - 100; tower(x, base, (50 + 40 * hash(i * 2 + seed)) * sc, (180 + 320 * hash(i * 5 + seed)) * sc, d, seed * 100 + i); }
    boilSeed('cityb' + seed); wash(rectPts(-60, base - 4, W + 120, H - base + 80), d + 1, {});
  }
  // a torpedo of the void: a long cigar with a blunt nose and a finned tail
  function ship(x, y, len, d = 4, ang = 0) {
    push(); translate(x, y); rotate(ang);
    boilSeed('ship' + x);
    const h = len * .14, P = [];
    for (let i = 0; i <= 20; i++) { const a = -Math.PI / 2 + i / 20 * Math.PI; P.push([len * .38 + Math.cos(a) * len * .12, Math.sin(a) * h]); }
    P.push([-len * .45, h * .55], [-len * .5, 0], [-len * .45, -h * .55]);
    wash(P, d, { ink: true, sw: .9 });
    wash([[-len * .36, -h * .5], [-len * .52, -h * 1.5], [-len * .5, -h * .3]], d, { ink: true, sw: .6 });
    wash([[-len * .36, h * .5], [-len * .52, h * 1.5], [-len * .5, h * .3]], d, { ink: true, sw: .6 });
    inkLine([[-len * .3, -h * .15], [len * .3, -h * .3]], .4, D[1]);
    pop();
  }
  // a person of 2538: high collar, belted tunic to the knee, boots; o.shield raises an arm across the face
  function person(x, base, s, d = 4, seed = 0, o = {}) {
    boilSeed('p' + seed);
    const f = o.flip ? -1 : 1, X = v => x + v * s * f, Y = v => base - v * s;
    wash([[X(-1.6), Y(0)], [X(-1.2), Y(8)], [X(-.3), Y(8)], [X(-.4), Y(0)]], d + 1 > 4 ? 4 : d + 1, { ink: true, sw: .35 });          // legs
    wash([[X(.4), Y(0)], [X(.4), Y(8)], [X(1.3), Y(8)], [X(1.6), Y(0)]], d + 1 > 4 ? 4 : d + 1, { ink: true, sw: .35 });
    wash([[X(-2.4), Y(7.5)], [X(-1.9), Y(15.5)], [X(-1.2), Y(16.6)], [X(1.2), Y(16.6)], [X(1.9), Y(15.5)], [X(2.4), Y(7.5)]], d, { ink: true, sw: .45 });   // tunic
    inkLine([[X(-2), Y(11.6)], [X(2), Y(11.6)]], .5, PULP.ink);                                                                   // belt
    wash([[X(-1.5), Y(16.4)], [X(-1.1), Y(18.6)], [X(1.1), Y(18.6)], [X(1.5), Y(16.4)]], d, { ink: true, sw: .4 });                // the high collar
    wash(ellPts(X(.15), Y(20.3), 1.45 * s, 1.75 * s, 14), Math.max(0, d - 2), { ink: true, sw: .4 });                               // head
    if (o.shield) wash(ribbon([[X(1.7), Y(15.6)], [X(3.4), Y(17.6)], [X(1.2), Y(20.8)]], .9 * s, .7 * s), d, { ink: true, sw: .4 });
    else wash(ribbon([[X(1.8), Y(15.4)], [X(2.3), Y(12)], [X(2.2), Y(9)]], .9 * s, .7 * s), d, { ink: true, sw: .4 });
  }

  // 1. 2538: the world in grey. A terrace above the city of the machines; Roal and Trest at the rail.
  LOOPS.look1 = t => {
    HALFTONE = .3; sky(.1, .3, 860);
    city(780, 9, 1, 3, .9);
    city(900, 6, 2, 8, 1.4);
    for (let i = 0; i < 4; i++) { const x = (300 + i * 420 + 60 * t * (i % 2 ? 1 : -.6)) % (W + 200) - 100, y = 180 + 70 * i; boilSeed('fl' + i); wash(ellPts(x, y, 26, 7, 12), 3, { ink: true, sw: .4 }); }
    ground(930, 900, 3, 1);
    inkLine([[-60, 880], [W + 60, 852]], .9, PULP.ink);
    for (let x = 0; x < W; x += 90) inkLine([[x, 880 - x * .0146], [x, 930 - x * .0156]], .6, PULP.ink);
    person(1420, 902, 7.5, 3, 1); person(1500, 900, 7, 2, 2, { flip: true });
  };

  // 2. The Outsiders: green death spreading across the grey.
  LOOPS.look2 = t => {
    HALFTONE = .3; sky(.45, .75, 900, 2); night(.35, .1, 2);
    stars(60, 500, 2, .4);
    city(820, 10, 2, 5, 1);
    const sh = [[520, 210, 520, .05], [1350, 140, 380, -.04], [1700, 320, 240, .08]];
    sh.forEach(([x, y, l, a], i) => ship(x + 14 * wob(t, .2, i * .3), y + 6 * wob(t, .3, i), l, 4, a));
    beam(560, 250, 700, 800, 24, 120, NRG.death, 1, { washOp: 50 });
    beam(1330, 175, 1180, 780, 20, 100, NRG.death, ease(seg(t, 0, 1.2)), { washOp: 50 });
    beam(1690, 345, 1780, 820, 14, 80, NRG.death, 1, { washOp: 45 });
    glow(700, 820, 380, NRG.death, .45); glow(1780, 830, 220, NRG.death, .35);
    ground(900, 940, 4, 2);
  };

  // 3. The screens under fire: violet, then blue, orange, red.
  LOOPS.look3 = t => {
    HALFTONE = .3; night(.7, .45, 3);
    stars(80, 600, 3, .5);
    city(860, 8, 2, 11, .8);
    const heat = .55 + .35 * ease(seg(t, 0, 2)), hits = [[760, 520], [1210, 470]];
    forceScreen(980, 860, 640, heat, hits, t);
    beam(300, 60, 760, 520, 16, 40, NRG.death, 1, { splash: false }); beam(1650, 90, 1210, 470, 16, 40, NRG.death, 1, { splash: false });
    ship(260, 70, 300, 4, .5); ship(1700, 100, 260, 4, -.5);
    ground(940, 920, 4, 3);
  };

  // F-1: a shining cylinder on its anti-gravity drive, with rubber-covered tentacles
  function f1(x, y, s, t, reach = []) {
    boilSeed('f1');
    const P = rrPts(x - 120 * s, y - 50 * s, 240 * s, 100 * s, 48 * s);
    wash(P, 2, { ink: true, sw: 1 });
    wash(rrPts(x - 104 * s, y - 40 * s, 208 * s, 26 * s, 13 * s), 0, { op: .9 });          // the shine along its top
    inkLine([[x - 60 * s, y - 50 * s], [x - 60 * s, y + 50 * s]], .5, D[4]); inkLine([[x + 60 * s, y - 50 * s], [x + 60 * s, y + 50 * s]], .5, D[4]);
    reach.forEach(([tx, ty], i) => {
      const sx = x + (i - (reach.length - 1) / 2) * 60 * s, sy = y + 40 * s, mx = lerp(sx, tx, .5) + 60 * s * wob(t, .9, i * .37), my = lerp(sy, ty, .5) + 40 * s * wob(t, .7, i * .21);
      boilSeed('tent' + i); wash(ribbon([[sx, sy], [lerp(sx, mx, .5), lerp(sy, my, .6) + 30 * s], [mx, my], [tx, ty]], 22 * s, 7 * s), 4, { ink: true, sw: .6 });
    });
  }
  // F-2 newborn: a small torpedo of glowing bluish metal with three thin tentacles
  function f2(x, y, s, t, o = {}) {
    boilSeed('f2');
    const P = []; for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + i / 16 * Math.PI; P.push([x + 40 * s + Math.cos(a) * 30 * s, y + Math.sin(a) * 22 * s]); }
    P.push([x - 60 * s, y + 12 * s], [x - 66 * s, y], [x - 60 * s, y - 12 * s]);
    paint(P, { wash: o.col || '#6E86B8', washOp: 230, ink: PULP.ink, sw: .7, br: 'inkfine' });
    for (let i = 0; i < 3; i++) { boilSeed('f2t' + i); const a = 1.9 + i * .5 + .2 * wob(t, .8, i * .3); inkLine(through([[x - 20 * s, y + 14 * s], [x - 20 * s + Math.cos(a) * 30 * s, y + 14 * s + Math.sin(a) * 30 * s], [x - 20 * s + Math.cos(a + .6) * 55 * s, y + 14 * s + Math.sin(a + .6) * 50 * s]]), .7, '#4F638C'); }
  }

  // 4. F-1 gives birth to F-2: blue lightning in the dark laboratory.
  LOOPS.look4 = t => {
    HALFTONE = .3; night(.6, .78, 4);
    for (let i = 0; i < 6; i++) { boilSeed('col' + i); wash(rectPts(80 + i * 330, -60, 70, 900), 3, { ink: true, sw: .5 }); }
    ground(830, 830, 3, 4);
    const fx = 1220, fy = 470;
    f1(1380, 300, 1.15, t, [[fx + 40, fy - 40], [fx + 90, fy + 10], [fx + 30, fy + 50]]);
    aura(fx, fy, 260, NRG.white, .9, t);
    f2(fx, fy, 1.4, t);
    boilSeed('bolt' + Math.floor(t * 12));
    lightning(fx - 40, fy, fx - 360, 830, NRG.lightning, { amp: .15 });
    lightning(fx + 60, fy + 20, fx + 280, 830, NRG.lightning, { amp: .12 });
    lightning(fx - 80, fy - 20, 560, 640, NRG.lightning, { amp: .1, br: 1 });
    glow(fx, fy, 620, NRG.lightning, .45);
    // a science-machine too close, and a man shielding his face
    boilSeed('sm'); wash(rrPts(470, 600, 150, 110, 30), 3, { ink: true, sw: .8 });
    person(250, 840, 13, 2, 9, { shield: true });
  };

  // the power plant: nearly five hundred feet, a bluntly rounded dome at its top, faintly luminescent
  function plant(x, base, h, w) {
    boilSeed('plant');
    const P = [[x - w / 2, base], [x - w / 2, base - h + w / 2]];
    for (let i = 1; i < 12; i++) { const a = Math.PI + i / 12 * Math.PI; P.push([x + Math.cos(a) * w / 2, base - h + w / 2 + Math.sin(a) * w * .42]); }
    P.push([x + w / 2, base - h + w / 2], [x + w / 2, base]);
    wash(P, 3, { ink: true, sw: 1 });
    wash(rectPts(x - w * .32, base - h + w * .5, w * .1, h - w * .6), 2, { op: .7 });
    glow(x, base - h * .5, w * 1.2, '#CFC9E8', .2);
  }

  // 5. Pure force: the golden sphere over the machine, the first warm colour that isn't a weapon.
  LOOPS.look5 = t => {
    HALFTONE = .3; night(.9, .7, 5);
    stars(140, 760, 5, .6);
    glow(1640, 170, 60, '#F4EEDC', .4);                                   // a crescent moon's light
    ground(900, 880, 4, 5);
    plant(960, 900, 690, 330);
    const gx = 960, gy = 170 + 8 * wob(t, .4), pulse = .5 + .5 * Math.sin(t * Math.PI);
    glow(gx, gy, 300, NRG.violet, .7); glow(gx, gy, 200, NRG.violet, .5);
    boilSeed('gold'); paint(ellPts(gx, gy, 92, 84, 24, 10), { wash: NRG.gold, washOp: 150, fill: NRG.gold, fillOp: 120, bleed: .3, ink: null });
    glow(gx, gy, 170, NRG.gold, .9); glow(gx, gy, 80, NRG.white, .6);
    glow(gx + 6, gy + 4, 18 + 22 * pulse, NRG.ruby, .6 + .4 * pulse);
    person(800, 905, 4.2, 2, 5); person(850, 903, 4, 2, 6, { flip: true });
  };

  // 6. The frame, 125,000 years on: the only full-colour scene. A System of beings of pure force.
  LOOPS.look6 = t => {
    HALFTONE = .2; boilSeed('cs'); paint(rectPts(-60, -60, W + 120, H + 120), { wash: PAL.night, washOp: 255, fill: PAL.indigo, fillOp: 120, bleed: .3, tex: .3, ink: null });
    [[400, 300, PAL.violet], [1500, 260, PAL.teal], [1000, 520, PAL.rose]].forEach(([x, y, c], i) => { boilSeed('neb' + i); paint(ellPts(x, y, 520, 260, 24, 40, i), { fill: c, fillOp: 60, bleed: .4, tex: .3, border: .05, ink: null }); });
    stars(220, H, 6, .7);
    const beings = [[300, 220, PAL.ochre], [760, 380, PAL.sky], [1180, 180, PAL.rose], [1600, 420, NRG.gold], [1380, 640, PAL.teal], [560, 640, PAL.violet], [1800, 160, PAL.clayLt]];
    for (let i = 0; i < 90; i++) glow(hash(i * 9.1) * W, hash(i * 4.3) * 800, 14 + 20 * hash(i * 2.2), [PAL.ochre, PAL.sky, PAL.rose, PAL.teal, NRG.gold][i % 5], .7);   // in their countless millions
    beings.forEach(([x, y, c], i) => { const bx = x + 30 * wob(t, .1, i * .17), by = y + 20 * wob(t, .13, i * .29); aura(bx, by, 70 + 30 * hash(i), c, .9, t + i); });
    boilSeed('planet'); paint([[-60, 860], [W * .5, 800], [W + 60, 860], [W + 60, H + 60], [-60, H + 60]], { wash: '#5A4A3E', washOp: 255, fill: PAL.clayDk, fillOp: 90, bleed: .2, ink: PULP.ink, sw: .8 });
    // F-2, old: oxidation has attacked it
    f2(860, 780, 3, t, { col: '#7A6A5A' });
    boilSeed('rust'); for (let i = 0; i < 12; i++) paint(ellPts(730 + hash(i) * 220, 770 + hash(i * 3) * 30, 6 + 8 * hash(i * 5), 4 + 4 * hash(i * 7), 8), { wash: PAL.clayDk, washOp: 160, ink: null });
  };

  // The chapter-title page: chapter 1 opens as the magazine page would, with its header and a drop cap.
  LOOPS.lookTitle = t => {
    HALFTONE = 0; const x = 460, wd = 1000;
    pageHeader('2538', x, 110, wd);
    dropCapPara('It was 2538 years After the Year of the Son of Man. For six centuries mankind had been developing machines. The Ear-apparatus was discovered as early as seven hundred years before. The Eye came later, the Brain came much later. But by 2500, the machines had been developed to think, and act and work with perfect independence. Man lived on the products of the machine, and the machines lived to themselves very happily, and contentedly.',
      x, 300, wd, { size: 34, lines: 11 });
    rule(x + wd * .35, 900, wd * .3, PULP.ink, 1);
  };
  for (const k of ['look1', 'look2', 'look3', 'look4', 'look5', 'look6', 'lookTitle']) LOOPS[k].len = 2;
})();
// the halftone at three strengths, on the Outsiders' frame: none, the frames' own (.3), and strong
LOOPS.look2ht0 = t => { LOOPS.look2(t); HALFTONE = 0; };
LOOPS.look2ht6 = t => { LOOPS.look2(t); HALFTONE = .6; };
LOOPS.look2ht0.len = LOOPS.look2ht6.len = 2;
