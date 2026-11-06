// ch08.js: chapter 8, Last of Men. It draws script/boards/ch08.yaml; its times are cues against the voice
// (src/gen/ch08.js). Inside the dome (dark, the screens and the violet canopy); Roal's vision as a science plate; and
// outside on the twisted rock, from clear sunlight to a crescent moon, where F-2 builds the power plant.
(() => {
  const { D, INK, ez, win, steps, path, talk, clauses, gesture, nod, listen, ground, cam, withCam, ruled, dreamCurl, page, stander, thoughtRings, planet } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const VIOLET = NRG.support, FORCE = '#CFE0FF', G = 1000, FS = 26, PALE = '#EFE6D2', BG = '#2E2620';

  // ---------- B to D, H to J: inside the dome ----------
  const ROALX = 820, TRESTX = 1000, F2P = [1240, 760];
  const ROALC = clauses('roal'), TRESTC = clauses('trest'), F2C = clauses('f2'), TO_ROAL = [...TRESTC, ...F2C], TO_TREST = [...ROALC, ...F2C];
  function dome(t) {
    HALFTONE = .2;
    const tJ = T0('J'), go = ez(t, C('p111.2') - .5, T1('J') - .3);
    const c = cam(t, [[0, tt => [930, lerp(700, 760, ez(tt, T0('B'), T0('C'))), lerp(1.2, 1.7, ez(tt, T0('B'), T0('C')))]], [T0('C'), [TRESTX, 760, 2.4], 2], [T0('D'), tt => [ROALX, 770, lerp(2.3, 2.8, ez(tt, T0('D'), T0('E')))], 2.5],
      [T0('H') - .5, [ROALX + 40, 770, 2.6], .01], [T0('I'), tt => [lerp(1040, 1120, ez(tt, T0('I'), tJ)), 740, 1.6], 2.5], [tJ, tt => [lerp(1200, 1700, go), 720, 1.8], 2]]);
    camBegin(...c);
    const f2x = lerp(F2P[0], 1900, go * go), f2y = F2P[1] - 40 * go;
    // each gestures on his own clauses (Roal's smaller while his eyes dream) and nods as the other, or F-2, speaks to him
    const dream = Math.max(win(t, T0('D'), T0('E'), 1, 1), win(t, T0('H'), T0('I'), 1, 1));
    const rp = {}, rh = listen(t, rp, TO_ROAL, 1), rl = rh + gesture(t, rp, ROALC); if (rp.up) { rp.up = lerp(rp.up, .12 + (rp.up - .12) * .55, dream); rp.fore = lerp(rp.fore, .3 + (rp.fore - .3) * .6, dream); }
    // the six that made the dome, dim at the back of it, and the machine F-2 built there, its violet beam holding up the crown
    for (let i = 0; i < 6; i++) { const sd = i < 3 ? -1 : 1, k = i % 3; DES.machine(910 + sd * (520 + k * 120), G - 40, 16, t, { arms: 3, d: 3, hover: 1.4, face: -sd * .5, lit: .25, label: null }); }
    boilSeed('vm8'); wash(rrPts(1290, G - 100, 110, 96, 10), 2, { ink: true, sw: .6 });
    const roal = stander(t, ROALX, G, 44, [], { who: 'roal', key: 'roal', seed: 3, flip: false, look: steps(t, [[0, .5], [T0('C'), .1], [T0('D'), .2], [T0('I'), 0]]) + rl + nod(t, TO_ROAL), pose: rp, talk: talk(t, 'roal'), lid: dream * .45 });
    const tp = {}, th = listen(t, tp, TO_TREST, 2), tl = th + gesture(t, tp, TRESTC);
    const trest = stander(t, TRESTX, G + 10, 46, [], { who: 'trest', key: 'trest', seed: 7, flip: t < T0('I'), look: .1 + tl + nod(t, TO_TREST), pose: tp, talk: talk(t, 'trest') });
    camEnd();
    shade(-100, H + 100, .62, .78, PULP.black);
    camBegin(...c);
    // over the shade: F-2 (silver, as in the hall) and the two faces in the screens' light
    push(); translate(f2x, f2y); scale(go > .02 ? 1 : -1, 1); translate(-f2x, -f2y); DES.f2(f2x, f2y + 2.4 * FS, FS, t, { view: 'side' }); pop();
    for (const p of [roal, trest]) p.redrawHead();
    // the light: the violet canopy overhead, the screens' glow, F-2's own
    for (let i = 0; i < 9; i++) { const a = Math.PI + (.15 + i / 8 * .7) * Math.PI; glow(1000 + Math.cos(a) * 900, 1100 + Math.sin(a) * 800, 260, VIOLET, .3); }
    beam(1345, G - 100, 1345, -300, 10, 26, VIOLET, 1, { splash: false, washOp: 50, a: .5 }); glow(1345, G - 100, 70, VIOLET, .5);
    for (let c2 = 0; c2 < 5; c2++) { const x = 440 + c2 * 240, y = 420; boilSeed('ds' + c2); paint(rectPts(x, y, 180, 120), { wash: '#BFC8D2', washOp: 140 + 50 * hash(c2 + Math.floor(t * 3)), ink: INK, sw: .6 }); glow(x + 90, y + 60, 120, '#DDE6F0', .3); }   // five screens, as in chapter 7
    glow(f2x, f2y, 90, '#E6EEFF', .25 + .3 * talk(t, 'f2'));
    for (const p of [roal, trest]) glow(...p.head, 70, '#DDE6F0', .2);
    dreamCurl(roal.head[0] + 20, roal.head[1] - 40, K(t, 'p103.1', 'p103.1$'), t, .5 * (1 - ez(t, T0('E') - 1.5, T0('E'))), 'rc');
    thoughtRings(f2x, f2y, t, T0('I'), C('p111.1$'), { r1: 420 });
    camEnd();
  }

  // ---------- E to G: the ladder ----------
  const LAD = 960;
  function ladder(t) {
    HALFTONE = .3;
    const tE = T0('E'), tF = T0('F'), tG = T0('G'), tLife = C('p104.1:man was the product of life'), tMach = C('p104.1:Man built the machine'), tForce = C('p104.1:but of pure, living force');
    const c = cam(t, [[0, [LAD, 820, 1.3]], [tMach - 1, [LAD, 560, 1.3], 3], [tForce - 1, [LAD, 330, 1.3], 2.5], [tF, tt => [lerp(LAD - 200, LAD + 300, ez(tt, tF, tG)), 600, 1], 3], [tG, [LAD, 600, 1.05], 2.5]]);
    camBegin(...c);
    stillSeed('lplate'); paint(rectPts(-800, -800, 3600, 2600), { wash: BG, washOp: 255, fill: '#3B322B', fillOp: 120, bleed: .25, tex: .5, ink: null });
    // the ladder's rails and rungs
    ruled([[LAD - 140, 1000], [LAD - 140, 120]], seg(t, tE - 1, tE + 3), D[1], 1); ruled([[LAD + 140, 1000], [LAD + 140, 120]], seg(t, tE - 1, tE + 3), D[1], 1);
    for (let i = 0; i < 4; i++) ruled([[LAD - 140, 920 - i * 230], [LAD + 140, 920 - i * 230]], seg(t, tE + i * .4, tE + 1 + i * .4), D[1], .8);
    // a cell and a plant; a man (fading when nature removes him); a machine; pure force
    const a1 = ez(t, tE, tLife), a2 = ez(t, tLife, tLife + 1.5), a3 = ez(t, tMach, tMach + 1.5), a4 = ez(t, tForce, tForce + 2), gone = ez(t, C('p106.1:has removed the parasite'), C('p106.1:has removed the parasite') + 3);
    if (a1 > .03) { boilSeed('cell'); wash(ellPts(LAD - 60, 880, 30 * a1, 26 * a1, 16), 0, { ink: true, sw: .5, op: .8 }); inkLine([[LAD + 60, 900], [LAD + 60, 900 - 70 * a1]], .8, PALE); wash(ellPts(LAD + 40, 870 - 40 * a1, 20 * a1, 10 * a1, 10), 0, { op: .7 }); wash(ellPts(LAD + 80, 860 - 50 * a1, 20 * a1, 10 * a1, 10), 0, { op: .7 }); }
    if (a2 > .03 && gone < 1) { boilSeed('lman'); push(); translate(LAD, 680); scale(1, 1); translate(-LAD, -680); DES.person(LAD, 680, 22 * a2, t, { who: 'citizen' }); pop(); if (gone > 0) { boilSeed('lmanf'); paint(rectPts(LAD - 80, 520, 160, 170), { wash: BG, washOp: 255 * gone, ink: null }); } }
    if (a3 > .03) DES.machine(LAD, 460, 22 * a3, t, { arms: 3, d: 1, label: null, lit: .4 });
    if (a4 > 0) { glow(LAD, 180, 120 * a4, NRG.white, .6); glow(LAD, 180, 50 * a4, '#FFFDF6', .8); }
    // F: chemicals drifting and joining by chance; F-2 making its duplicate
    const fk = win(t, tF - .5, tG + .5, 1, 1);
    if (fk > 0) { const tCh = C('p105.1:Chemicals might mix');
      for (let i = 0; i < 12; i++) { const j = t > tCh + 2 && i % 3 === 0, x = 300 + 200 * hash(i) + 40 * Math.sin(t * .5 + i) + (j ? 20 : 0), y = 380 + 300 * hash(i * 3) + 30 * Math.cos(t * .4 + i); boilSeed('chem' + i); wash(ellPts(x, y, 14, 14, 10), i % 3, { ink: true, sw: .4, op: fk }); }
      const tDup = C('p105.1:as is F-2 here'), dup = ez(t, tDup - 2, tDup + 2);
      DES.f2(LAD + 520, 640, 20, t, { view: 'side', hover: 1.5 }); if (dup > 0) { boilSeed('dup'); for (let i = 0; i < 5; i++) ruled([[LAD + 560, 600], [LAD + 700, 600 - 30 + i * 15]], dup, FORCE, .6); DES.f2(LAD + 740, 640, 20 * dup, t, { view: 'side', hover: 1.5 }); } }
    camEnd();
  }

  // ---------- K to N: outside, from noon to night ----------
  const RG = 900, PX = 1100;
  function outside(t) {
    HALFTONE = .25;
    const tK = T0('K'), tPlane = C('p112.1:he laid a plane of force'), tL = T0('L'), tM = T0('M'), tN = T0('N'), tLivid = C('p114.1:Suddenly, a livid beam');
    const grow = ez(t, tL, tM - 1), night = ez(t, tL + (tM - tL) * .5, tM + 1), smooth = ez(t, tPlane, tPlane + 3);
    const c = cam(t, [[0, tt => [lerp(500, 900, ez(tt, tK, tPlane)), 640, 1.2]], [tL, tt => [PX, lerp(600, 100, ez(tt, tL, tM)), lerp(1.1, .55, ez(tt, tL, tM))], 3],
      [tM, tt => [PX, lerp(250, -150, ez(tt, tM, tN)), .6], 3], [tN, [PX - 200, 560, .85], 2.5]]);
    camBegin(...c);
    // the sky: clear day going to night
    stillSeed('dsky8'); paint(rectPts(-2000, -2600, 6000, 3600), { wash: mixCol(D[0], '#1E1A16', night), washOp: 255, fill: mixCol(D[1], '#2A231D', night), fillOp: 70, ink: null });
    if (night < .5) glow(lerp(-200, 3000, grow), lerp(-900, 300, grow * grow), 140, '#FFF6E8', .9 * (1 - night * 2));
    if (night > 0) { for (let i = 0; i < 120; i++) glow(-1600 + hash(i * 3.1) * 5000, -2400 + hash(i * 7.7) * 3000, 5, '#F4EEDC', .5 * night * hash(i)); stillSeed('moon');
      glow(1900, -900, 90, '#F4EEDC', .5 * night); wash([...Array(17)].map((_, i) => { const a = -Math.PI / 2 + i / 16 * Math.PI; return [1900 + Math.cos(a) * 60, -900 + Math.sin(a) * 60]; }).concat([...Array(17)].map((_, i) => { const a = Math.PI / 2 - i / 16 * Math.PI; return [1900 + Math.cos(a) * 30, -900 + Math.sin(a) * 60]; })), 0, { op: night }); }
    // the twisted, massed rocks; smoothed flat under the plane of force round the plant's place
    stillSeed('rocks'); wash([[-2000, RG + 40], [6000, RG + 40], [6000, RG + 1600], [-2000, RG + 1600]], 3, { op: 1 });
    for (let i = 0; i < 40; i++) { const x = -1600 + i * 130 + 60 * hash(i), flat = Math.abs(x - PX) < 700 ? smooth : 0, h = (60 + 120 * hash(i * 3)) * (1 - flat);
      if (h > 4) { stillSeed('rk' + i); wash([[x - 70, RG + 50], [x - 30 + 20 * hash(i), RG + 50 - h], [x + 40, RG + 50 - h * .7], [x + 80, RG + 50]], 2 + (i % 2), { ink: true, sw: .5 }); } }
    if (smooth > 0 && smooth < 1) { glow(PX, RG + 40, 700, FORCE, .3 * Math.sin(Math.PI * smooth)); }
    if (smooth > .5) { stillSeed('plane'); wash(rectPts(PX - 700, RG + 30, 1400, 30), 1, { ink: true, sw: .5 }); }
    // the dome, behind at the left
    DES.blackDome(-300, RG + 60, 320, t);
    // the plant, rising ring by ring as F-2's forces arc round it; finished at night
    if (grow > 0) { const s = 1.8 * Math.max(.05, grow), lum = .14 * ez(t, tM - 1, tM + 2); DES.plant(PX, RG + 60, s, t, { lum });
      if (t < tM) for (let i = 0; i < 4; i++) { const y = RG + 60 - 400 * s * 1.6 * (.7 + .3 * hash(Math.floor(t * 4) + i)), q = hash(Math.floor(t * 6) + i); if (q > .4) { boilSeed('arc' + i + Math.floor(t * 12)); lightning(PX - 80 * s * 1.2, y, PX + 80 * s * 1.2 * (q - .5) * 2, y - 60, FORCE, { amp: .2 }); } } }
    // F-2: out through the dome's black wall, over the rocks, to the plant's foot
    const fp = path(t, [[0, [-150, 700]], [tK, [500, 640], 4], [tPlane - 1, [PX - 300, 700], 3], [tL, [PX - 520, 600], 3], [tM, [PX - 360, RG - 40], 3]]);
    DES.f2(fp[0], fp[1] + 2.4 * FS, FS, t, { view: 'side' });
    // 'the deadly logic of the machine, inspired by the leaping intuition of man': chapter 1's two minds together, the
    // machine's stepped ruled line from F-2 to the plant and the man's curl of wash rising beside it
    const tLogic = C('p112.1:the deadly logic'), tLeap8 = C('p112.1:the leaping intuition'), both = 1 - ez(t, tM - .5, tM + 1);
    if (t > tLogic && both > 0) { const a = [fp[0] + 60, fp[1] - 20], b = [PX - 60, RG + 60 - 1150 * Math.max(.3, grow)]; ruled([a, [a[0], lerp(a[1], b[1], .33)], [lerp(a[0], b[0], .5), lerp(a[1], b[1], .33)], [lerp(a[0], b[0], .5), lerp(a[1], b[1], .66)], [b[0], lerp(a[1], b[1], .66)], b], ez(t, tLogic, tLogic + 2.2), PALE, 5 * both);
      if (t > tLeap8) { push(); translate(PX - 380, RG - 40); scale(2.4); translate(-(PX - 380), -(RG - 40)); dreamCurl(PX - 380, RG - 40, ez(t, tLeap8, tLeap8 + 2.2), t, .85 * both, 'leap8', 0); pop(); } }
    const lv = ez(t, tLivid - .2, tLivid + .4);
    if (lv > 0) { beam(fp[0] + 50, fp[1], PX - 60, RG - 120, 14, 50, NRG.livid, lv, { washOp: 90, a: .9 }); glow(PX, RG - 150, 260, NRG.livid, .5 * lv); }
    camEnd();
  }

  function film(t) {
    const tB = T0('B'), tE = T0('E'), tH = T0('H'), tK = T0('K');
    if (t < tB) return page(t, 'Last of Men', '"We are alone, Trest," said Roal.', tB, { soak: '#141110' });
    if (t < tE - 1) return dome(t);
    if (t < tE + .8) return dissolve(seg(t, tE - 1, tE + .8), () => dome(t), () => ladder(t));
    if (t < tH - .8) return ladder(t);
    if (t < tH + .6) return dissolve(seg(t, tH - .8, tH + .6), () => ladder(t), () => dome(t));
    if (t < tK - .6) return dome(t);
    if (t < tK + .8) return dissolve(seg(t, tK - .6, tK + .8), () => dome(t), () => outside(t));
    outside(t);
    if (t > DUR - .6) brushWipe(seg(t, DUR - .6, DUR + .6), [PULP.w[3], PULP.w[2]]);
  }
  shots([[0, film]]);
})();
