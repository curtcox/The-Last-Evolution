// ch10.js: chapter 10, Go, and Do Not Return. It draws script/boards/ch10.yaml; its times are cues against the voice
// (src/gen/ch10.js). One set: the Outsiders' fleet wheeling round the golden sphere near Mars; the flagship twisted,
// and locked so still that even its linework stops boiling.
(() => {
  const { D, INK, ez, win, steps, ground, cam, page, planet, thoughtRings } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const MID = [960, 540], FLAG = [1500, 760];
  const tFound = C('p130.1:the golden sphere found the Outsiders'), tShower = C('p131.1:showering it'), tUnmoved = C('p131.1:Unmoved');
  const tTwist = C('p134.1:it twisted and bent'), tInside = C('p134.1:the ship turned inside out'), tRestored = C('p134.1:They saw the ship restored'), tScreen = C('p134.1:and its great screen');
  const tCurves = C('p134.1:The ship twisted, and what they knew'), tBeam = C('p134.1:a beam of blue-white radiance'), tLock = C('p134.1:all energies within it'), tG = T0('G');
  const ship = (x, y, len, t, dir = -1, o = {}) => { push(); translate(x, y); scale(dir, 1); translate(-x, -y); DES.oShip(x, y, len, t, o); pop(); };
  const ring = t => { const r = []; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * .03, R = 520 + 60 * Math.sin(i * 1.7); r.push({ x: MID[0] + Math.cos(a) * R * 1.3, y: MID[1] + Math.sin(a) * R * .55, i, a }); } return r; };
  function sphere(t, r) {
    glow(...MID, r * 2.2, NRG.violet, .35); glow(...MID, r * 1.6, '#9A6AE0', .25);
    boilSeed('gold10'); paint(ellPts(...MID, r * .8, r * .72, 20, r * .12), { wash: '#E0A030', washOp: 160, ink: null });
    glow(...MID, r * 1.5, '#FFB830', .6); glow(...MID, r * .9, NRG.gold, .7); glow(MID[0] + r * .1 * Math.sin(t), MID[1], r * .35, '#FFE6A0', .5);
  }
  // the flagship, twisted: bent along its length, flipped inside out, its curves straightened; and locked
  function flagship(t, x, y) {
    const tw = win(t, tTwist, tRestored, .6, 1), inside = win(t, tInside - .3, tRestored, .8, .8), straight = win(t, tCurves, tBeam + 1, .6, .6), locked = t > tLock;
    const len = 900;
    if (locked) BOILN = 7;   // all things immovable and unchangeable: the drawing itself stops boiling
    push(); translate(x, y);
    rotate(.25 * Math.sin(t * 2.3) * tw); scale(lerp(1, -1, inside) * (1 - .15 * tw * Math.abs(Math.sin(t * 3))), 1 + .4 * tw * Math.sin(t * 1.7)); shearX(.6 * Math.sin(t * 1.9) * tw);
    translate(-x, -y);
    ship(x, y, len, t, -1, { d: 2 });
    pop();
    if (straight > 0) for (let i = 0; i < 8; i++) { boilSeed('sl' + i); inkLine([[x - len * .5, y - 60 + i * 16], [x + len * .5, y - 60 + i * 16 + 40 * Math.sin(i) * (1 - straight)]], .8 * straight, '#EFE6D2', 'inkfine', 0); }
    const scr = ez(t, tScreen, tScreen + 1.5);
    if (scr > 0) { boilSeed('fscr'); paint([...Array(25)].map((_, i) => { const a = i / 24 * TAU; return [x + Math.cos(a) * len * .62, y + Math.sin(a) * len * .2]; }), { wash: '#0E0B09', washOp: 120 * scr, ink: '#3A3A44', sw: .8 }); }
    if (locked) BOILN = Math.floor(T * BOIL);
  }
  function scene(t) {
    HALFTONE = .2;
    const tB = T0('B'), tC = T0('C'), tD = T0('D'), tE = T0('E'), tF = T0('F');
    const c = cam(t, [[0, tt => [MID[0], MID[1], lerp(.55, .75, ez(tt, tB, tFound + 3))]], [tC, [MID[0], MID[1], .8], 2], [tD, tt => [MID[0], MID[1], lerp(1.6, 1.9, ez(tt, tD, tE))], 3],
      [tE, [FLAG[0] - 100, FLAG[1] - 40, 1.2], 3], [tF, tt => [FLAG[0], FLAG[1], lerp(1.15, 1.35, ez(tt, tF, tG))], 2.5], [tG, tt => [lerp(FLAG[0], MID[0], ez(tt, tG, tG + 4)), MID[1], lerp(1, .45, ez(tt, tG + 1, DUR))], 3]]);
    ground('#1A1612', 255, 'sp10', { fill: '#262019', fillOp: 90 });
    for (let i = 0; i < 160; i++) { const b = hash(i * 1.3); glow((hash(i * 3.1) - .5) * 4200 + 960 - (c[0] - 960) * .3, (hash(i * 7.7) - .5) * 2600 + 540 - (c[1] - 540) * .3, 3 + 8 * b * b, '#F4EEDC', .2 + .45 * b); }
    camBegin(...c);
    planet(-900, 200, 160, 2, { key: 'mars10' });
    // the fleet: wheeling; turning its weapons on the sphere; then turning for home
    const leave = ez(t, tG + 2, DUR + 2), rays = win(t, tShower, tD + 1, .4, 1.5);
    const R = ring(t);
    R.forEach(s => { const x = s.x + 2600 * leave * Math.cos(s.a * .2 + 2.5), y = s.y - 900 * leave;
      if (s.i === 0) return; ship(x, y, 380, t, Math.cos(s.a) > 0 ? -1 : 1, { d: 3 });
      if (rays > 0) { const col = [NRG.death, '#FFB070', NRG.white, NRG.projector][s.i % 4]; beam(x, y, MID[0], MID[1], 6, 20, col, rays, { washOp: 40, a: .55 }); } });
    // the flagship: in the ring's near side
    const fx = FLAG[0] + 2600 * leave * .6, fy = FLAG[1] - 900 * leave;
    flagship(t, fx, fy);
    if (t > tBeam - .1 && t < tLock + 1) beam(...MID, fx, fy, 8, 20, '#E8F0FF', ez(t, tBeam - .1, tBeam + .4), { washOp: 70, a: .9 });
    if (t > tTwist && t < tRestored + 2) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t; glow(fx + Math.cos(a) * 500, fy + Math.sin(a) * 160, 60, NRG.gold, .35); }
    // the sphere: a spark arriving, then steady at the centre
    const arr = ez(t, tFound - 4, tFound + .5), sx = lerp(-1400, MID[0], arr), sy = lerp(-400, MID[1], arr);
    if (arr < 1) { glow(sx, sy, 40, NRG.gold, .9); glow(sx, sy, 120, NRG.gold, .3); } else sphere(t, 70 * (1 - leave * 0));
    thoughtRings(...MID, t, tD, C('p133.1$'), { r1: 700, col: NRG.gold });
    thoughtRings(...MID, t, tG, C('p135.1$'), { r1: 900, col: NRG.gold });
    if (rays > 0) glow(...MID, 200, NRG.gold, .5 * rays);
    camEnd();
  }
  function film(t) {
    if (t < T0('B')) return page(t, 'Go, and Do Not Return', 'Far in space, headed now for Mars, that they might destroy all life there, the golden sphere found the Outsiders.', T0('B'), { soak: '#1A1612' });
    scene(t);
    if (t < T0('B') + .8) flash(1 - seg(t, T0('B'), T0('B') + .8), '#1A1612');
    if (t > DUR - .6) brushWipe(seg(t, DUR - .6, DUR + .6), [PULP.w[3], PULP.w[2]]);
  }
  shots([[0, film]]);
})();
