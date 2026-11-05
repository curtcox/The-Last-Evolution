// ch09.js: chapter 9, Pure Force. It draws script/boards/ch09.yaml; its times are cues against the voice
// (src/gen/ch09.js). One place, the rock round the power plant, through one night into a red dawn: the storm, the
// white globe killed by the red beam, and the golden sphere.
(() => {
  const { D, INK, ez, win, steps, path, talk, ground, cam, page, closing, stander, thoughtRings, ruled } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const FORCE = '#CFE0FF', RG = 900, PX = 1100, PS = 1.8, FS = 26;
  const TOP = RG + 60 - 400 * PS - 90 * PS * .6, ORB = [PX, TOP - 260];   // the plant's crown, and where the spheres float
  const tD = T0('D'), tDark = C('p117.1:The sky darkened'), tF = T0('F'), tI = T0('I'), tStab = C('p121.4:A stabbing beam'), tRed = C('p121.4:an enormously greater beam');
  const tOrange = C('p121.4:the beam became orange'), tGreen = C('p121.4:and finally green'), tGone = C('p121.4:Then the sphere had vanished'), tJ = T0('J'), tK = T0('K');
  const tGold = C('p123.1:an irregular globe'), tRuby = C('p126.1:a tiny ruby flame'), tN = T0('N'), tVanish = C('p129.1:fast as light');

  // the storm: 0..1; up from D, gone at F; up again at J, gone at K
  const storm = t => Math.max(win(t, tDark - 1, tF, 3, 2), win(t, tJ, tK + 1, 3, 2));
  // the dome parts once the men are out of it (they walk from inside, hidden, from 'appeared')
  const domePart = t => ez(t, C('p123.1:Roal and Trest appeared') + 1.5, C('p123.1:Roal and Trest appeared') + 4.5);
  const dawn = t => ez(t, C('p122.1:red glory of the sun') - 3, tK + 6);
  function world(t) {
    const st = storm(t), dw = dawn(t);
    // the sky: night, storm-black, then a red dawn
    stillSeed('sky9'); paint(rectPts(-2000, -2600, 6000, 3600), { wash: mixCol(mixCol('#1E1A16', '#100D0B', st), mixCol('#2A1E1A', '#7A3E2E', .45), dw), washOp: 255, fill: '#2A231D', fillOp: 70, ink: null });
    if (st < .8) for (let i = 0; i < 100; i++) glow(-1600 + hash(i * 3.1) * 5000, -2400 + hash(i * 7.7) * 3000, 5, '#F4EEDC', .5 * (1 - st) * (1 - dw) * hash(i));
    if (dw > 0) { glow(2300, RG - 40, 300, '#FF6A3A', .7 * dw); glow(2300, RG - 40, 900, '#FF9A6A', .35 * dw); }
    if (st > 0) for (let i = 0; i < 9; i++) { stillSeed('cloud' + i); const x = -800 + i * 450 + 200 * Math.sin(t * .3 + i), y = -1400 + 200 * hash(i); paint(ellPts(x, y, 600, 260, 20, 40), { wash: '#141110', washOp: 200 * st, fill: '#0E0B09', fillOp: 120 * st, bleed: .4, ink: null }); }
    stillSeed('rock9'); wash([[-2000, RG + 40], [6000, RG + 40], [6000, RG + 1600], [-2000, RG + 1600]], 3, { op: 1 });
    stillSeed('plane9'); wash(rectPts(PX - 700, RG + 30, 1400, 30), 1, { ink: true, sw: .5 });
    for (let i = 0; i < 16; i++) { const x = -1600 + i * 300 + 60 * hash(i); if (Math.abs(x - PX) < 750) continue; stillSeed('rk9' + i); const h = 60 + 120 * hash(i * 3); wash([[x - 70, RG + 50], [x - 30, RG + 50 - h], [x + 40, RG + 50 - h * .7], [x + 80, RG + 50]], 2 + (i % 2), { ink: true, sw: .5 }); }
    // the dome at the left; it parts for the men at K
    const part = domePart(t);
    if (part < 1) DES.blackDome(-300, RG + 60, 320 * (1 - part * .9), t);
    // the plant: its beat (B), its lens (C)
    const beat = t > T0('B') ? Math.max(0, Math.sin((t - T0('B')) * (2 + 6 * seg(t, T0('B'), T0('B') + 5)) )) * win(t, T0('B'), C('p115.1:Then it quieted') + 1, .2, 1) : 0;
    DES.plant(PX, RG + 60, PS, t, { lum: .14 + .3 * beat });
    const lens = [PX + 40, RG - 380]; DES.lens(lens[0], lens[1], 22, { lit: .2 + .8 * talk(t, 'plant') });
    // the rain, driven
    if (st > .2) { boilSeed('rain' + Math.floor(t * 12)); for (let i = 0; i < 60; i++) { const x = -1200 + hash(i * 3 + Math.floor(t * 12)) * 4400, y = -1600 + hash(i * 7 + Math.floor(t * 12)) * 2600; inkLine([[x, y], [x + 50, y + 120]], .4, mixCol('#EFE6D2', '#141110', .3), 'inkfine', 0); } }
    return { st, lens };
  }
  function f2At(t) {
    const st = storm(t), gust = st * (30 * Math.sin(t * 7) + 20 * Math.sin(t * 13.3));
    let p = path(t, [[0, [PX - 360, RG - 40]], [tD, [PX - 420, RG - 200], 3], [T0('G'), [PX - 300, ORB[1] + 60], 2.5], [tStab - .2, [PX - 700, ORB[1] + 220], .4], [tJ, [PX - 420, RG - 160], 3], [tK + 2, [PX - 260, RG - 120], 3]]);
    return [p[0] + gust, p[1] + gust * .4];
  }
  function sphereGold(t, r) {   // irregular, golden, a deep violet halo; the ruby flame within
    glow(...ORB, r * 2.6, NRG.violet, .55); glow(...ORB, r * 1.9, '#9A6AE0', .4);   // the halo, wide of the gold so it shows
    for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + t * .4, rr = r * (.5 + .25 * Math.sin(t * 1.3 + i * 2)); glow(ORB[0] + Math.cos(a) * rr * .9, ORB[1] + Math.sin(a) * rr * .7, r * 1.1, NRG.violet, .16); }
    boilSeed('gold'); paint(ellPts(...ORB, r * .8, r * .72, 20, r * .12), { wash: '#E0A030', washOp: 160, ink: null }); glow(...ORB, r * 1.15, '#FFB830', .55); glow(...ORB, r * .9, NRG.gold, .7); glow(ORB[0] + r * .1 * Math.sin(t), ORB[1], r * .35, '#FFE6A0', .5);
    for (let i = 0; i < 5; i++) { const a = i * 1.3 + t * .7; glow(ORB[0] + Math.cos(a) * r * .55, ORB[1] + Math.sin(a) * r * .45, r * .55, NRG.gold, .4); }
  }
  // the ruby flame within the sphere: a teardrop of deep red, flickering, waxing and waning with k (0..1)
  function rubyFlame(t, r, k) {
    const h = r * (.3 + .25 * k), w = h * .45, P = [];
    for (let i = 0; i <= 24; i++) { const q = i / 24 * TAU, tip = (1 - Math.cos(q)) / 2; P.push([ORB[0] + w * Math.sin(q) * Math.sin(q / 2) + .3 * w * Math.sin(t * 9) * (1 - tip), ORB[1] + h * .35 - h * Math.cos(q)]); }
    glow(ORB[0], ORB[1] + h * .1, h * 1.6, NRG.ruby, .35 + .35 * k);
    boilSeed('ruby' + Math.floor(t * 12)); paint(P, { wash: '#B01828', washOp: 150 + 90 * k, fill: '#D02436', fillOp: 120 + 80 * k, bleed: .05, ink: null });
    glow(ORB[0], ORB[1] + h * .3, h * .45, '#FF7A6A', .4 + .4 * k);
  }
  function scene(t) {
    HALFTONE = .25;
    const tC = T0('C'), tE = T0('E'), tG = T0('G'), tH = T0('H'), tL = T0('L'), tM = T0('M'), tP = T0('P');
    const c = cam(t, [[0, tt => [PX - 100, lerp(560, 420, ez(tt, T0('B'), tC)), lerp(.75, .85, ez(tt, T0('B'), tC))]], [tC, [PX + 40, RG - 380, 2.2], 2], [tD, tt => [PX - 200, lerp(500, 200, ez(tt, tD, tE)), lerp(1.2, .7, ez(tt, tD, tE))], 3],
      [tE, [PX, ORB[1] + 120, 1.1], 3], [tF, [PX - 100, ORB[1] + 200, .9], 3], [tG, [PX - 160, ORB[1] + 60, 1.5], 2.5], [tH, [PX, ORB[1], 2.2], 2.5], [tI, tt => [PX - 200, lerp(ORB[1] + 200, 300, ez(tt, tI, tGone)), lerp(1.4, .6, ez(tt, tStab, tRed + 2))], 2],
      [tJ, tt => [lerp(PX, PX + 400, ez(tt, tJ, tK)), 400, .65], 3], [tK, tt => [lerp(350, PX, ez(tt, C('p123.1:Roal and Trest appeared') + 2, tGold + 2)), lerp(800, ORB[1] + 260, ez(tt, tGold - 2.5, tGold + 1)), lerp(1.2, .75, ez(tt, tK, tGold + .5)) * lerp(1, 1.5, ez(tt, tGold + 3, tL))], 3],   // up and wide, so the globe is in frame as it's named; then a slow push in
      [tL, tt => [PX, ORB[1], lerp(1.5, 1.9, ez(tt, tL, tM))], 2.5], [tM, tt => [PX - 100, lerp(ORB[1], 300, ez(tt, tRuby + 2, tN)), lerp(1.9, .7, ez(tt, tRuby + 2, lerp(tRuby + 2, tN, .5)))], 3], [tN, [PX, 200, .7], 2.5], [tP, [PX, -100, .7], 2]]);
    camBegin(...c);
    const { st } = world(t);
    // E: the ball of white force at the storm's centre, jerking at the lightning's touch
    if (st > 0 && t > tE - 2 && t < tF + 1) { const n = Math.floor(t * 3), jx = 30 * (hash(n) - .5), jy = 30 * (hash(n * 3) - .5), b = [ORB[0] + jx, ORB[1] + jy];
      glow(...b, 90 + 30 * Math.sin(t * 9), NRG.white, .9); glow(...b, 260, FORCE, .3 * st);
      if (hash(Math.floor(t * 6)) > .45) { boilSeed('lt' + Math.floor(t * 12)); lightning(b[0] + 600 * (hash(n * 7) - .5), -1300, b[0], b[1], NRG.lightning, { amp: .18, r: 60 }); }
      beam(PX, TOP + 10, b[0], b[1], 30, 20, FORCE, 1, { washOp: 30, a: .5 * st, splash: false }); }
    // F to I: the white globe; F-2's probing; the stab; the red beam, shrinking it through orange and green
    const g1 = t > tF - 1 && t < tGone + .3, shrink = 1 - .9 * ez(t, tRed, tGone);
    if (g1) { const r = 40 * shrink * (t < tF ? seg(t, tF - 1, tF) : 1); glow(...ORB, r * 3, NRG.white, .6); glow(...ORB, r * 1.4, '#FFFDF6', .9);
      if (t > tRed) for (let i = 0; i < 6; i++) { const a = hash(Math.floor(t * 8) + i) * TAU; boilSeed('spray' + i + Math.floor(t * 12)); lightning(...ORB, ORB[0] + Math.cos(a) * 300, ORB[1] + Math.sin(a) * 300, '#FFE2B0', { amp: .2, r: 30 }); } }
    if (t > tH && t < tStab + .5) thoughtRings(...ORB, t, tH, C('p121.3$'), { r1: 400, col: '#FFFDF6' });
    const f2 = f2At(t);
    if (t > C('p120.1') && t < tH) for (let i = 0; i < 5; i++) { const k = seg(t, C('p120.1') + i * .8, C('p120.1') + i * .8 + 1.2), d = [ORB[0] - 80, ORB[1] + 40 * (i - 2)], turn = t > C('p120.1:seemed baffled') ? 1 : 0;
      ruled([[f2[0] + 50, f2[1]], [lerp(f2[0] + 50, d[0], .5), f2[1]], [lerp(f2[0] + 50, d[0], .5), d[1]], [d[0], d[1] + turn * (i - 2) * 80]], k, FORCE, .6); }
    if (t > tStab && t < tStab + .5) beam(...ORB, PX - 300, ORB[1] + 60, 6, 20, '#E8F0FF', 1, { washOp: 60, a: .9 });
    if (t > tRed - .2 && t < tGone + .4) { const col = t < tOrange ? '#B23A2A' : t < tGreen ? mixCol('#FF8A3A', NRG.death, ez(t, tOrange, tGreen)) : NRG.death;
      beam(PX, TOP + 20, ...ORB, 80, 40 * shrink + 20, col, ez(t, tRed - .2, tRed + .3), { washOp: 90, a: .8 }); }
    // F-2; C-R-U-1 joining it at dawn
    DES.f2(f2[0], f2[1] + 2.4 * FS, FS, t, { view: 'side' });
    if (t > C('p122.1:C-R-U-1 joined him') - 3) { const k = ez(t, C('p122.1:C-R-U-1 joined him') - 3, C('p122.1:C-R-U-1 joined him') + 1); DES.cru1(lerp(-600, f2[0] - 140, k), f2[1] + 60 + 2.2 * 30, 30, t, { glowK: 1 }); }
    // J: the forces at play again
    if (t > tJ + 1 && t < tK) for (let i = 0; i < 4; i++) glow(ORB[0] + 200 * Math.sin(t * 2 + i), ORB[1] + 120 * Math.cos(t * 1.7 + i), 80, [FORCE, NRG.gold, NRG.violet, FORCE][i], .4 * storm(t));
    // K on: the golden sphere; Roal and Trest out of the dome; the warmth of the ruby flame
    const gk = ez(t, tGold - 2.2, tGold + .5) * (t < tVanish ? 1 : 0), grow = ez(t, C('p126.1') + 2, tN + 1);
    // they stand looking up at the sphere; when the ruby flame warms them, their hands lift toward it, open
    const warm = win(t, tRuby + .5, tN - .5, 1.5, 1), wp = k => ({ up: lerp(.12, .9, k), fore: lerp(.3, 1.7, k) });
    if (t > tK) { stander(t, -260, RG + 40, 30, [[C('p123.1:Roal and Trest appeared'), C('p123.1:Roal and Trest appeared') + 5, -260, 420]], { who: 'roal', key: 'roal9', seed: 3, look: .6, pose: wp(warm) });
      stander(t, -340, RG + 46, 31, [[C('p123.1:Roal and Trest appeared') + .4, C('p123.1:Roal and Trest appeared') + 5.6, -340, 540]], { who: 'trest', key: 'trest9', seed: 7, look: .55, pose: wp(.8 * win(t, tRuby + 1.2, tN - .5, 1.5, 1)) });
      // the dome again, in front: the men are inside it until they walk out
      if (domePart(t) < 1) for (let i = 0; i < 2; i++) DES.blackDome(-300, RG + 60, 320 * (1 - domePart(t) * .9), t); }   // twice: one coat lets the figures show through
    if (gk > 0) { sphereGold(t, 90 * gk * (1 + grow)); thoughtRings(...ORB, t, T0('L'), C('p125.1$'), { r1: 600, col: NRG.gold }); thoughtRings(...ORB, t, T0('O'), C('p128.1$'), { r1: 600, col: NRG.gold });
      const ruby = t > tRuby ? Math.max(0, Math.sin((t - tRuby) * 2.2)) * (1 - ez(t, tN - 1, tN)) : 0; if (ruby > 0 || (t > tRuby && t < tN)) { rubyFlame(t, 90 * gk * (1 + grow), ruby); glow(...ORB, 900, '#FFC780', .3 * ruby); } }
    if (t > tVanish - .1 && t < tVanish + .6) { const q = seg(t, tVanish - .1, tVanish + .6); beam(ORB[0], ORB[1], ORB[0] + 400, -3000, 60 * (1 - q), 10, NRG.gold, 1, { washOp: 60 * (1 - q), a: 1 - q, splash: false }); }
    camEnd();
  }

  function film(t) {
    if (t < T0('B')) return page(t, 'Pure Force', 'There was a dull, drumming beat, a beat that rose, and became a low-pitched hum.', T0('B'), { soak: '#1E1A16' });
    scene(t);
    if (t < T0('B') + .8) flash(1 - seg(t, T0('B'), T0('B') + .8), '#1E1A16');
    closing(t);
  }
  shots([[0, film]]);
})();
