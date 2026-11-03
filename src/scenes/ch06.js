// ch06.js: chapter 6, Ten Thousand Motes. It draws script/boards/ch06.yaml; its times are cues against the voice
// (src/gen/ch06.js). The motes rise from Denver at dawn; one battle set under a far blue-white sun, where the giants'
// screens run violet, blue, orange, red; a glimpse inside a giant; the Earth swept with green from pole to pole.
(() => {
  const { D, INK, ez, win, steps, path, ground, cam, withCam, ruled, page, planet } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const GREEN = NRG.death, SUN = '#E8F0FF', HEAT = '#FFB070';
  const stars = (n, seed, cx = 960, cy = 540, w = 4000, h = 2400) => { for (let i = 0; i < n; i++) { const b = hash(i * 1.3 + seed); glow(cx + (hash(i * 3.1 + seed) - .5) * w, cy + (hash(i * 7.7 + seed) - .5) * h, 3 + 8 * b * b, '#F4EEDC', .2 + .45 * b); } };
  const ship = (x, y, len, t, dir = -1, o = {}) => { push(); translate(x, y); scale(dir, 1); translate(-x, -y); DES.oShip(x, y, len, t, o); pop(); };

  // ---------- B: dawn over Denver ----------
  function dawn(t) {
    HALFTONE = .3;
    const t0 = T0('B'), up = ez(t, C('p074.1:nearly ten thousand') - 2, T1('B'));
    camBegin(W / 2, lerp(H / 2, -150, up), 1);
    stillSeed('dsky'); paint(rectPts(-200, -900, W + 400, 1800), { wash: mixCol(D[2], D[0], .3 + .5 * seg(t, 0, T1('B'))), washOp: 255, fill: D[1], fillOp: 80, bleed: .3, ink: null });
    blooms(-900, 500, 6, 1, 73, .4); shade(-900, 700, .55, .05, '#2A231D');
    stillSeed('mtn'); wash([[-200, 700], [200, 520], [420, 600], [700, 470], [980, 590], [1300, 500], [1600, 610], [2100, 540], [2100, 760], [-200, 760]], 2, { ink: true, sw: .5 });
    stillSeed('rock'); wash([[-200, 720], [2100, 700], [2100, 1300], [-200, 1300]], 3, { op: 1.1 });
    // the great machine, finished, and the stream of motes rising from it
    for (let i = 0; i < 6; i++) { boilSeed('gm' + i); const s = 22, w = (9 - i) * s, y = 860 - i * s * 1.6; wash(rrPts(960 - w, y - s * 1.6, w * 2, s * 1.6, s * .3), 2 + (i % 2), { ink: true, sw: .6 }); }
    for (let i = 0; i < 160; i++) { const st = t0 - 3 + i * (T1('B') - t0) / 150, q = (t - st) / 7; if (q <= 0) continue;
      const x = 960 + (hash(i) - .5) * 1600 * q, y = 560 - q * (1200 + 600 * hash(i * 3)), sz = 30 * (1 - q * .4);
      if (y < -900) continue; if (sz > 5) DES.mote(x, y, sz, t, { ang: -Math.PI / 2 + (hash(i) - .5) * .8, drive: true }); else glow(x, y, 6, NRG.white, .5); }
    camEnd();
  }

  // ---------- C to K: the battle ----------
  // the giants in ranks; one, HERO, is the ship the camera stays with
  const RANKS = []; for (let r = 0; r < 4; r++) for (let i = 0; i < 5; i++) RANKS.push({ x: 300 + i * 620 + r * 140 + 80 * hash(i + r * 9), y: 200 + r * 260 + 40 * hash(i * 3 + r), len: 320 + r * 60, i: RANKS.length });
  const HERO = { x: 1500, y: 640, len: 700 };
  const tE = T0('E'), tV = C('p075.1:flamed gradually violet'), tRed = C('p075.1:red'), tDie = C('p077.1:Gradually the flaming orange'), tBlack = C('p077.1:flecks and spots');
  const tGreen = C('p079.1:a new ray reached out'), tCurtain = C('p079.1:a strange curtain'), tJ = T0('J'), tDart = C('p080.1:they darted suddenly'), tVanish = C('p080.1:disappear'), tK = T0('K');
  // a giant's screen: an ellipse of force round it, its colour the heat along the text's sequence; dying to dull red-black
  const SCREEN = ['#A27BEA', '#6F8FF0', '#FF9A3C', '#FF4A3A', '#5A1810'];
  const heatAt = t => t < tV ? 0 : t < tDie ? .75 * ez(t, tV, tRed + 1) : lerp(.75, 1, ez(t, tDie, tBlack + 3));
  function screen(x, y, len, heat, t, hits, key) {
    if (heat <= 0) return;
    const col = ramp(SCREEN, heat), rx = len * .62, ry = len * .2;
    boilSeed('scr' + key); inkLine([...Array(41)].map((_, i) => { const a = i / 40 * TAU; return [x + Math.cos(a) * rx, y + Math.sin(a) * ry * (1 + .04 * Math.sin(t * 5 + i))]; }), 1.5, col, 'inkfine', .5);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; glow(x + Math.cos(a) * rx, y + Math.sin(a) * ry, len * .2, col, heat > .9 ? .25 : .45); }
    for (const [hx, hy] of hits) { glow(hx, hy, len * .3, col, .6); glow(hx, hy, len * .1, NRG.white, .5); }
    if (t > tBlack + .1) for (let i = 0; i < 7; i++) { const a = hash(i * 1.7 + (typeof key === 'number' ? key : 99)) * TAU; boilSeed('fleck' + key + i); wash(ellPts(x + Math.cos(a) * rx * .95, y + Math.sin(a) * ry * .95, 16, 10, 12), 4, { op: ez(t, tBlack, tBlack + 4) }); }
  }
  function battle(t) {
    HALFTONE = .2;
    const tC = T0('C'), tD = T0('D'), tF = T0('F'), tH = T0('H'), tI = T0('I');
    const c = cam(t, [[0, tt => [lerp(900, 1200, ez(tt, tC, tD)), 560, lerp(.6, .75, ez(tt, tC, tD))]], [tD, [HERO.x - 100, HERO.y, 1.1], 3], [tE, tt => [HERO.x, HERO.y, lerp(1.2, 1.35, ez(tt, tE, tF))], 2],
      [tF, [HERO.x - 300, HERO.y - 40, 1.6], 2.5], [T0('G'), [HERO.x - 100, HERO.y, 1.1], 2.5], [tH, tt => [lerp(1200, 900, ez(tt, tH, tI)), 560, .8], 2.5],
      [tI, tt => [1100, 560, lerp(.9, .65, ez(tt, tCurtain, tJ))], 2], [tJ, tt => [HERO.x - 200, HERO.y, lerp(.9, 1.4, ez(tt, tJ, tVanish))], 1.5], [tK, tt => [lerp(1000, 1600, ez(tt, tK, T1('K'))), 560, .7], 2]]);
    ground('#1A1612', 255, 'bat', { fill: '#262019', fillOp: 90 });
    stars(160, 4);
    withCam(c, () => {
      glow(2900, -200, 120, SUN, .9); glow(2900, -200, 420, SUN, .2);   // the far blue-white sun
      const heat = heatAt(t), dead = (i) => t > tGreen && i % 3 === 0 && t > tGreen + (i % 7) * .4;
      // the motes: in among the ranks, each beside its giant; dying in puffs (H); the charge (J)
      const motePos = (s, k) => [s.x - s.len * .7 - 30 * Math.sin(k), s.y - s.len * .1 + 20 * Math.cos(k * 1.3)];
      for (const s of RANKS) {
        const isDead = dead(s.i), drift = isDead ? (t - tGreen) * 6 : 0;
        if (t < tVanish + .3 || hash(s.i * 7) > .4) { push(); translate(s.x, s.y + drift); rotate(isDead ? (t - tGreen) * .01 : 0); translate(-s.x, -(s.y + drift)); ship(s.x, s.y + drift, s.len, t, -1, { d: isDead ? 4 : 3 }); pop(); }
        if (!isDead) screen(s.x, s.y, s.len, heat * (.8 + .2 * hash(s.i)), t, [], s.i);
        if (t > tCurtain) { const v = ez(t, tCurtain, tCurtain + 4) * (1 - ez(t, tK + 2, tK + 8)); boilSeed('veil' + s.i); paint([...Array(21)].map((_, i) => { const a = i / 20 * TAU; return [s.x + Math.cos(a) * s.len * .8 * (1 + .1 * Math.sin(t * 2 + i)), s.y + Math.sin(a) * s.len * .35]; }), { wash: '#0E0B09', washOp: 150 * v, ink: null }); }
        // its mote
        const arrive = ez(t, tC + hash(s.i) * 4, tC + 3 + hash(s.i) * 4), puff = T0('H') + 1 + hash(s.i * 3) * 8, gone = (hash(s.i * 5) < .35 && t > puff) || t > tVanish;
        const [mx, my] = motePos(s, t * .3 + s.i), dartK = ez(t, tDart, tVanish), x = lerp(lerp(-400, mx, arrive), s.x - s.len * .45, dartK), y = lerp(lerp(1400, my, arrive), s.y, dartK);
        if (!gone && arrive > 0) { DES.mote(x, y, 34, t, { ang: 0, drive: true });
          if (t > T0('D') && t < tGreen && hash(Math.floor(t * 4) + s.i) > .5) beam(x + 14, y, s.x - s.len * .55, s.y, 2, 8, NRG.white, 1, { washOp: 30, a: .5 });
          if (t > tGreen && t < tCurtain + 1) beam(x + 14, y, s.x - s.len * .3, s.y, 2, 10, GREEN, ez(t, tGreen, tGreen + .5), { washOp: 40, a: .5 });
          if (t > tJ - 1) glow(x, y, 50, ramp(SCREEN, .5 + .3 * Math.sin(t * 6)), .5); }
        if (gone && t < (t > tVanish ? tVanish + .8 : puff + .8)) { const pk = seg(t, t > tVanish ? tVanish : puff, (t > tVanish ? tVanish : puff) + .8); glow(x, y, 30 + 80 * pk, NRG.white, 1 - pk); glow(x, y, 20 + 40 * pk, HEAT, .6 * (1 - pk)); }
      }
      // the hero giant, close: its screen under fire through every colour
      const hits = t > T0('D') ? [[HERO.x - HERO.len * .55, HERO.y - 40], [HERO.x - HERO.len * .2, HERO.y + 110], [HERO.x + HERO.len * .2, HERO.y - 120]].filter((_, i) => hash(Math.floor(t * 3) + i) > .3) : [];
      ship(HERO.x, HERO.y, HERO.len, t, -1, { d: 2 });
      if (t > T0('D') && t < tGreen + 2) { screen(HERO.x, HERO.y, HERO.len, Math.max(.05, heat), t, hits, 'hero');
        for (let i = 0; i < 3; i++) if (t < tV) { const sx = 200 + i * 180, sy = 300 + i * 260, k = win(t, T0('D') + i * .5, tV, .3, .5); beam(sx, sy, HERO.x - HERO.len * .62, HERO.y - 60 + i * 60, 4, 20, i ? NRG.white : HEAT, k, { washOp: 40, a: .5 }); }
        if (t > tV) for (const [hx, hy] of hits) beam(hx - 500, hy + 200 * (hash(hx) - .5), hx, hy, 6, 30, NRG.livid, 1, { washOp: 40, a: .55, splash: false }); }
      // G: the greenish beam on the mote beside it, harmless
      if (t > T0('G') + 1 && t < tH) { const mx = HERO.x - HERO.len * .78, my = HERO.y + 60; DES.mote(mx, my, 60, t, { ang: 0, drive: true }); beam(HERO.x - HERO.len * .3, HERO.y + 30, mx + 20, my, 4, 16, GREEN, win(t, C('p077.1:The greenish beams'), tH, .4, .5), { washOp: 40, a: .45 }); }
    });
  }
  // F: inside the giant: the men at the generator
  function inside(t) {
    HALFTONE = .3;
    const tIn = C('p076.1:within them'), hot = ez(t, tIn - 2, T1('F'));
    ground('#2A231D', 255, 'ins', { fill: '#1C1814', fillOp: 120 });
    camBegin(960, 560, lerp(1.1, 1.25, seg(t, tIn - 2, T1('F'))));
    boilSeed('gen'); wash(rrPts(760, 220, 420, 640, 30), 3, { ink: true, sw: .9 }); for (let k = 0; k < 6; k++) inkLine([[780, 300 + k * 90], [1160, 300 + k * 90]], .6, INK);
    glow(970, 540, 260, mixCol(HEAT, '#FF4A3A', hot), .3 + .5 * hot); glow(970, 540, 100, NRG.white, .3);
    // four feeding the generators, two each side, a body's width and more apart (at 140, each pair read as one drawn twice)
    const FEED = [320, 570, 1370, 1620];
    for (let i = 0; i < 4; i++) { const x = FEED[i], bob = Math.abs(Math.sin(t * 2.5 + i)) * 20;
      push(); translate(x, 900); rotate((i < 2 ? .25 : -.25) * Math.abs(Math.sin(t * 2.5 + i))); translate(-x, -900); DES.outsider(x, 900 - bob, 56, t, { view: 'side', turn: .1 * Math.sin(t + i) }); pop(); }
    for (let i = 0; i < 6; i++) { const q = frac(t * .4 + i / 6); glow(800 + 340 * hash(i), 860 - q * 600, 30, HEAT, .3 * (1 - q) * hot); }
    camEnd();
  }
  // J: the Denver hall's screens, blank
  function blank(t) {
    HALFTONE = .3;
    camBegin(800, 330, 1.6);
    DES.lab(-300, -150, 2520, 1300, t, { couch: false });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = 103 + c * 252, y = 110 + r * 208; boilSeed('bl' + c + r); paint(rectPts(x + 6, y + 6, 202, 157), { wash: '#1C1814', washOp: 235, ink: null }); }
    stillSeed('night'); paint(rectPts(-500, -400, 3000, 1900), { wash: PULP.black, washOp: 120, ink: null });
    camEnd();
  }
  // L: the Earth, a line of ships across it from pole to pole, the green sweeping behind
  function earth(t) {
    HALFTONE = .2;
    ground('#1A1612', 255, 'earthsp', { fill: '#262019', fillOp: 90 }); stars(140, 8);
    const sw = ez(t, T0('L'), DUR - .5), lx = lerp(1360, 560, sw);
    camBegin(960, 540, lerp(1.1, 1, ez(t, T0('L'), DUR)));
    planet(960, 540, 420, 1, { key: 'earthL', glow: '#F4EEDC', ga: .2, bands: true });
    // the swept side, green
    boilSeed('sweep'); const P = []; for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + i / 24 * Math.PI, y = 540 + Math.sin(a) * 420, half = Math.cos(a) * 420; P.push([Math.min(960 + half, Math.max(960 - half, lx)), y]); }
    for (let i = 24; i >= 0; i--) { const a = -Math.PI / 2 + i / 24 * Math.PI; P.push([960 + Math.cos(a) * 420, 540 + Math.sin(a) * 420]); }
    paint(P, { wash: GREEN, washOp: 70, ink: null }); glow(lx + 160, 540, 380, GREEN, .25);
    for (let i = 0; i < 13; i++) { const a = -Math.PI / 2 + (i + .5) / 13 * Math.PI, y = 540 + Math.sin(a) * 440, x = Math.max(960 - Math.cos(a) * 440, Math.min(960 + Math.cos(a) * 440, lx));
      ship(x, y, 70, t, -1, { d: 3 }); beam(x, y + 6, x + 30, y + 30, 6, 30, GREEN, 1, { washOp: 40, a: .5, splash: false }); }
    camEnd();
  }

  function film(t) {
    const tB = T0('B'), tC = T0('C'), tF = T0('F'), tG = T0('G'), tL = T0('L'), tIn = C('p076.1:within them');
    if (t < tB) return page(t, 'Ten Thousand Motes', 'Dawn was breaking again over Denver where this work had been done, when the main force of the enemy drew near Earth.', tB, { soak: D[2] });
    if (t < tC - .8) return dawn(t);
    if (t < tC + .8) return dissolve(seg(t, tC - .8, tC + .8), () => dawn(t), () => battle(t));
    if (t < tIn - 1.5) return battle(t);
    if (t < tIn) return dissolve(seg(t, tIn - 1.5, tIn), () => battle(t), () => inside(t));
    if (t < tG - .6) return inside(t);
    if (t < tG + .6) return dissolve(seg(t, tG - .6, tG + .6), () => inside(t), () => battle(t));
    const tBl = C('p080.1:the screens back on Earth');
    if (t < tBl - .5) return battle(t);
    if (t < tBl + .3) return dissolve(seg(t, tBl - .5, tBl + .3), () => battle(t), () => blank(t));
    if (t < T0('K') - .5) return blank(t);
    if (t < T0('K') + .5) return dissolve(seg(t, T0('K') - .5, T0('K') + .5), () => blank(t), () => battle(t));
    if (t < tL - .8) return battle(t);
    if (t < tL + .6) return dissolve(seg(t, tL - .8, tL + .6), () => battle(t), () => earth(t));
    earth(t);
    if (t > DUR - .6) brushWipe(seg(t, DUR - .6, DUR + .6), [PULP.w[3], PULP.w[2]]);
  }
  shots([[0, film]]);
})();
