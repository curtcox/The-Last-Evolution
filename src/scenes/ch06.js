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
    // 'Dawn was breaking': the light warming along the range and the sun's rim coming up behind it (the plain was an
    // even grey, with nothing to say what hour it was)
    const sunUp = ez(t, t0 - 2, T1('B')), sy = lerp(600, 470, sunUp);
    glow(1250, 560, 1100, '#E0A868', .35 + .2 * sunUp); glow(1250, 540, 520, '#F0C080', .3 + .25 * sunUp);
    stillSeed('dsun'); paint(ellPts(1250, sy, 70, 70, 24), { wash: '#F4CC86', washOp: 240, fill: '#F8DCA0', fillOp: 160, bleed: .1, ink: null }); glow(1250, sy, 160, '#FFE2A8', .5);
    stillSeed('mtn'); wash([[-200, 700], [200, 520], [420, 600], [700, 470], [980, 590], [1300, 500], [1600, 610], [2100, 540], [2100, 760], [-200, 760]], 2, { ink: true, sw: .5 });
    stillSeed('rock'); wash([[-200, 720], [2100, 700], [2100, 1300], [-200, 1300]], 3, { op: 1.1 });
    // the great machine, finished, and the stream of motes rising from it
    for (let i = 0; i < 6; i++) { boilSeed('gm' + i); const s = 22, w = (9 - i) * s, y = 860 - i * s * 1.6; wash(rrPts(960 - w, y - s * 1.6, w * 2, s * 1.6, s * .3), 2 + (i % 2), { ink: true, sw: .6 }); }
    boilSeed('gmtop'); DES.dcase(960, 860 - 6 * 22 * 1.6, 3 * 22, 2.5 * 22, 1.5 * 22, 1, { shine: true, rings: [.5] });   // its dome, and C-R-U-1 beside it, as chapter 5 left them
    DES.cru1(1400, 640, 30, t, { hover: 2.5, glowK: 1 });
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
  function screen(x, y, len, heat, t, hits, key, calm = 0) {
    if (heat <= 0 || calm >= 1) return;
    const col = heat < .06 ? '#C9C6BE' : ramp(SCREEN, heat), rx = len * .62, ry = len * .2;   // not yet struck: a colourless shimmer (it was violet before 'flamed gradually violet')
    boilSeed('scr' + key); inkLine([...Array(41)].map((_, i) => { const a = i / 40 * TAU; return [x + Math.cos(a) * rx, y + Math.sin(a) * ry * (1 + .04 * Math.sin(t * 5 + i))]; }), 1.5 * (1 - calm), col, 'inkfine', .5);
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; glow(x + Math.cos(a) * rx, y + Math.sin(a) * ry, len * .2, col, (heat > .9 ? .25 : .45) * (1 - calm)); }
    for (const [hx, hy] of hits) { glow(hx, hy, len * .3, col, .6); glow(hx, hy, len * .1, NRG.white, .5); }
    if (t > tBlack + .1) for (let i = 0; i < 7; i++) { const a = hash(i * 1.7 + (typeof key === 'number' ? key : 99)) * TAU; boilSeed('fleck' + key + i); wash(ellPts(x + Math.cos(a) * rx * .95, y + Math.sin(a) * ry * .95, 16, 10, 12), 4, { op: ez(t, tBlack, tBlack + 4) * (1 - calm) }); }
  }
  // 'some few free ships had turned to the help of their attacked sister-ships': three with no mote on them, coming down
  // over the top rank; their fire is what makes the puffs
  const tFree = C('p078.1:some few free ships'), FREE = [[640, -560, 40], [1260, -640, 20], [1880, -600, 50]], freeAt = (f, t) => [f[0], lerp(f[1], f[2], ez(t, tFree - .3, tFree + 3.5))];
  function battle(t) {
    HALFTONE = .2;
    const tC = T0('C'), tD = T0('D'), tF = T0('F'), tH = T0('H'), tI = T0('I');
    const c = cam(t, [[0, tt => [lerp(900, 1200, ez(tt, tC, tD)), 560, lerp(.6, .75, ez(tt, tC, tD))]], [tD, [HERO.x - 100, HERO.y, 1.1], 3], [tE, tt => [HERO.x, HERO.y, lerp(1.2, 1.35, ez(tt, tE, tF))], 2],
      [tF, [HERO.x - 300, HERO.y - 40, 1.6], 2.5], [T0('G'), [HERO.x - 100, HERO.y, 1.1], 2.5], [tH, tt => [lerp(1200, 900, ez(tt, tH, tI)), 560, .8], 2.5],
      [tI, tt => [lerp(1000, 1100, ez(tt, tGreen + 1, tCurtain)), 560, lerp(lerp(.9, 1.05, ez(tt, tI + 1, tGreen)), .65, ez(tt, tGreen + 3, tJ))], 2], [tJ, tt => [lerp(HERO.x - 380, HERO.x - 330, ez(tt, tDart, tVanish)), HERO.y, lerp(1.0, 2.2, ez(tt, tDart - .5, tVanish))], 1.2], [tK, tt => [lerp(1000, 1600, ez(tt, tK, T1('K'))), 560, .7], 2]]);   // rushing in with them
    ground('#1A1612', 255, 'bat', { fill: '#262019', fillOp: 90 });
    stars(160, 4);
    withCam(c, () => {
      glow(2900, -200, 120, SUN, .9); glow(2900, -200, 420, SUN, .2);   // the far blue-white sun
      const heat = heatAt(t), dead = (i) => i % 3 === 0 && t > tGreen + 3 * hash(i * 2.3) + 1;   // a second after its mote's ray reaches it
      // the motes: in among the ranks, each beside its giant; dying in puffs (H); the charge (J)
      // (for the green ray they draw off up and away from their giants: hard against a giant's end, a mote read as its gun,
      // and the green rays as the giants firing)
      const off = ez(t, tGreen - 3, tGreen - .5) * (1 - ez(t, tJ - 1, tJ)), motePos = (s, k) => [s.x - s.len * (.7 + .15 * off) - 30 * Math.sin(k), s.y - s.len * (.1 + .3 * off) + 20 * Math.cos(k * 1.3)];
      for (const s of RANKS) {
        const isDead = dead(s.i), drift = isDead ? (t - tGreen) * 6 : 0, lost = t > tVanish + .3 && hash(s.i * 7) <= .12;   // few are gone: 9,633 of the ten thousand move on
        if (!lost) { push(); translate(s.x, s.y + drift); rotate(isDead ? (t - tGreen) * .01 : 0); translate(-s.x, -(s.y + drift)); ship(s.x, s.y + drift, s.len, t, -1, { d: isDead ? 4 : 3 }); pop(); }
        if (!isDead && !lost) screen(s.x, s.y, s.len, heat * (.8 + .2 * hash(s.i)), t, [], s.i, ez(t, tK - 1, tK + 2.5));   // the fight over, their screens die down (still flaring red as the fleet moved on, they looked under fire)
        if (t > tCurtain && !isDead && !lost) { const v = ez(t, tCurtain, tCurtain + 4) * (1 - ez(t, tK + 2, tK + 8)), V = [...Array(21)].map((_, i) => { const a = i / 20 * TAU; return [s.x + Math.cos(a) * s.len * .8 * (1 + .1 * Math.sin(t * 2 + i)), s.y + Math.sin(a) * s.len * .35 * (1 + .15 * Math.sin(t * 3 + i * 1.7))]; });
          // the curtain of waving blankness: a black veil with a pale, waving edge (a dark wash alone showed only as faint ovals on dark space)
          boilSeed('veil' + s.i); paint(V, { wash: '#0E0B09', washOp: 190 * v, ink: null }); inkLine(V, 1.4, '#8A8070', 'inkfine', .4 * v); }
        // its mote
        const arrive = ez(t, tC + hash(s.i) * 4, tC + 3 + hash(s.i) * 4), puff = C('p078.1:And one after another') + hash(s.i * 3) * 5.5, gone = (hash(s.i * 5) < .35 && t > puff) || t > tVanish;
        const [mx, my] = motePos(s, t * .3 + s.i), back = ez(t, tJ, tDart - .2) * 260, dartK = ez(t, tDart, tVanish), x = lerp(lerp(-400, mx, arrive) - back, s.x - s.len * .45, dartK * dartK), y = lerp(lerp(1400, my, arrive), s.y, dartK * dartK);   // the last charge: they draw off, then dart in (from beside the giants the dart barely moved)
        const big = 34 * (1 + 1.2 * off + .6 * ez(t, tJ - 1, tJ + 1));
        if (!gone && arrive > 0) { DES.mote(x, y, big, t, { ang: 0, drive: true });
          if (hash(s.i * 5) < .35 && t > puff - 1.2) { const [fx, fy] = freeAt(FREE[s.i % 3], t); beam(fx - 80, fy + 24, x, y, 4, 14, HEAT, ez(t, puff - 1.2, puff - .9), { washOp: 70, a: .75, splash: false }); }
          if (t > T0('D') && t < tGreen && hash(Math.floor(t * 4) + s.i) > .5) beam(x + 14, y, s.x - s.len * .55, s.y, 2, 8, NRG.white, 1, { washOp: 30, a: .5 });
          // the death ray turned on the giants: the chapter's turn, so wide and green enough to read (at 2-10 px and 40 it
          // showed as a faint grey thread)
          const tg = tGreen + 3 * hash(s.i * 2.3);   // 'from one after another of the Earth-ships, in quick succession'
          if (t > tg && t < tCurtain + 1) { const gk = ez(t, tg, tg + .5); glow(x + big * .5, y, 60, GREEN, .8 * gk); beam(x + big * .5, y, s.x - s.len * .3, s.y, 5, 20, GREEN, gk, { washOp: 110, a: .85, splash: false }); if (gk >= 1) glow(s.x - s.len * .3, s.y, 45, GREEN, .3); }
          // their own screens flaming now: a ring of fire round each
          if (t > tJ - 1) { const fc = ramp(SCREEN, .55 + .3 * Math.sin(t * 6 + s.i)), fk = ez(t, tJ - 1, tJ); boilSeed('ms' + s.i + Math.floor(t * 12)); inkLine([...Array(25)].map((_, i) => { const a = i / 24 * TAU; return [x + Math.cos(a) * big * 1.1, y + Math.sin(a) * big * .55]; }), 1.6 * fk, fc, 'inkfine', .5); glow(x, y, big * 2.2, fc, .6 * fk); } }
        if (gone && t < (t > tVanish ? tVanish + .8 : puff + 1.4)) { const pk = t > tVanish ? seg(t, tVanish, tVanish + .8) : seg(t, puff, puff + 1.4); glow(x, y, 40 + 150 * pk, NRG.white, 1 - pk); glow(x, y, 30 + 100 * pk, HEAT, .85 * (1 - pk));
          for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + s.i, r = 130 * pk; glow(x + Math.cos(a) * r, y + Math.sin(a) * r * .8, 26 * (1 - pk) + 8, '#FFD9A0', .7 * (1 - pk)); } }   // incandescent vapor
      }
      if (t > tFree - .3) for (const f of FREE) { const [fx, fy] = freeAt(f, t); ship(fx, fy, 340, t, -1, { d: 3 }); screen(fx, fy, 340, heat * .85, t, [], 'free' + f[0], ez(t, tK - 1, tK + 2.5));
        if (t > tCurtain) { const v = ez(t, tCurtain, tCurtain + 4) * (1 - ez(t, tK + 2, tK + 8)), V = [...Array(21)].map((_, i) => { const a = i / 20 * TAU; return [fx + Math.cos(a) * 272 * (1 + .1 * Math.sin(t * 2 + i)), fy + Math.sin(a) * 119 * (1 + .15 * Math.sin(t * 3 + i * 1.7))]; }); boilSeed('veilf' + f[0]); paint(V, { wash: '#0E0B09', washOp: 190 * v, ink: null }); inkLine(V, 1.4, '#8A8070', 'inkfine', .4 * v); } }
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
    // 'they worked and slaved, as they fed giant machines': two each side carry blocks from the piles at the edges to the
    // generator's mouth, feed them in, and go back for more, half a round apart and at two depths (they rocked in place,
    // two with their backs to it, none touching it)
    for (const sd of [-1, 1]) { const pile = 960 + sd * 760; boilSeed('pile' + sd); for (let k = 0; k < 5; k++) wash(rrPts(pile - 70 + (k % 3) * 46, 880 - Math.floor(k / 3) * 34, 42, 30, 4), 1, { ink: true, sw: .6 }); }
    for (let i = 0; i < 4; i++) { const sd = i < 2 ? -1 : 1, q = frac((t - tIn) / 5.5 + (i % 2) * .5 + (sd > 0 ? .2 : 0)), xo = 960 + sd * 700, xi = 960 + sd * 270, far = i % 2 === 0, g = far ? 862 : 915, sz = far ? 46 : 58;   // the far one smaller and higher: crossing, they read as two
      const go = q < .42, at = q >= .42 && q < .56, x = go ? lerp(xo, xi, ease(q / .42)) : at ? xi : lerp(xi, xo, ease((q - .56) / .44)), toward = go || at, face = toward ? -sd : sd;
      const step = (go || q >= .56) ? Math.abs(Math.sin(t * 7 + i)) * 10 : 0, lift = at ? Math.sin(Math.PI * (q - .42) / .14) : 0;
      push(); translate(x, g); scale(face, 1); translate(-x, -g); DES.outsider(x, g - step, sz, t, { view: 'side', turn: .1 * Math.sin(t + i) }); pop();
      if (toward && q < .5) { const bx = x - sd * sz * 1.05, by = g - sz * 2.6 - 60 * lift; boilSeed('blk' + i); wash(rrPts(bx - 22, by - 16, 44, 32, 4), 1, { ink: true, sw: .6 }); glow(bx, by, 30, HEAT, .35); }   // a pale block of fuel, carried before it
      if (at) { glow(960 + sd * 200, 760, 160, mixCol(HEAT, '#FF4A3A', hot), .9 * lift); glow(970, 540, 200, HEAT, .35 * lift); } }   // fed: the mouth flares and the generator glows up
    for (let i = 0; i < 6; i++) { const q = frac(t * .4 + i / 6); glow(800 + 340 * hash(i), 860 - q * 600, 30, HEAT, .3 * (1 - q) * hot); }
    camEnd();
  }
  // J: the Denver hall's screens, blank
  function blank(t) {
    HALFTONE = .3;
    camBegin(800, 330, 1.6);
    DES.lab(-300, -150, 2520, 1300, t, { couch: false, ext: 1200 });
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
