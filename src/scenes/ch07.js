// ch07.js: chapter 7, The Dome. It draws script/boards/ch07.yaml; its times are cues against the voice (src/gen/ch07.js).
// The Denver hall at night; the dome raised on its floor round Roal and Trest; a cut-away of it with F-2's violet
// beam; and outside, the dead plain under the green.
(() => {
  const { D, INK, ez, win, steps, path, talk, clauses, gesture, nod, ground, cam, withCam, dreamCurl, page, stander } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const GREEN = NRG.death, VIOLET = NRG.support, G = 1000, MID = 1000, FS = 30;
  const ship = (x, y, len, t, dir = -1, o = {}) => { push(); translate(x, y); scale(dir, 1); translate(-x, -y); DES.oShip(x, y, len, t, o); pop(); };
  const tCloud = C('p089.1:Gradually a cloud'), tArch = C('p092.1:it arched over them'), tSolid = C('p092.1:a solid, black dome');
  const tF = T0('F'), tSix = C('p087.1:as six large machines');

  // ---------- the hall at night ----------
  // the screens: ships falling (B), the machines (D); flickering
  function screens(t) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = 103 + c * 252, y = 110 + r * 208, k = .6 + .4 * hash(c * 7 + r * 3 + Math.floor(t * 3)), mid = [x + 107, y + 85];
      glow(...mid, 160, '#DDE6F0', .25 * k);
      if ((c + r) % 2 === 0) { const q = frac((t - T0('B')) * .15 + hash(c + r * 7)); boilSeed('fs' + c + r); push(); translate(mid[0], y + 30 + q * 120); rotate(q * .6); translate(-mid[0], -(y + 30 + q * 120)); ship(mid[0], y + 30 + q * 120, 110, t, -1, { d: 3 }); pop(); } }
  }
  // the six machines: in after F-2, then ranged round the men
  // they close round the two men three to a side, clear of them (a half-ring put the middle two in front of Roal and Trest)
  const sixAt = (t, i) => { const ring = ez(t, T0('H') - .5, T0('H') + 3), enter = ez(t, tSix - 1 + i * .3, tSix + 5 + i * .3), k = i < 3 ? 2 - i : i - 3, side = i < 3 ? -1 : 1;
    return [lerp(lerp(2500, 1700 + i * 60, enter), MID + side * (230 + k * 150), ring), lerp(lerp(600, 760, enter), G + 30 - 15 * k, ring)]; };
  function inHall(t, o = {}) {
    DES.lab(-300, -150, 2520, 1300, t, { couch: false });
    stillSeed('night'); paint(rectPts(-500, -400, 3000, 1900), { wash: PULP.black, washOp: 175, fill: '#1C2028', fillOp: 60, ink: null });
    screens(t);
    // F-2 floats in and stops before the men
    const f2k = ez(t, tF - .5, tF + 5), fx = lerp(2300, MID + 260, f2k), fy = lerp(560, 780, f2k);
    if (t > tF - 1) { push(); translate(fx, fy); scale(-1, 1); translate(-fx, -fy); DES.f2(fx, fy + 2.4 * FS, FS, t, { view: 'side' }); pop(); glow(fx - 50, fy, 30, '#E6EEFF', .3 + .5 * talk(t, 'f2')); }
    for (let i = 0; i < 6; i++) if (t > tSix - 1) { const [x, g] = sixAt(t, i); const m = DES.machine(x, g, 22, t, { arms: 3, d: 1 + (i % 2), hover: 1.5 + .1 * wob(t, .3, i), face: clamp((MID - x) / 300, -1, 1), lit: .3, label: null });
      if (t > tCloud - 1) glow(m.eye[0], m.eye[1], 30, '#E6EEFF', .4); }
    // Roal and Trest before the screens; Roal turns when the machines come. Each gestures on his own clauses (Roal's
    // smaller while his eyes dream) and nods as the other, or F-2, speaks to him
    const turn = t > tF + .3, dream = win(t, C('p085.2'), T1('D'), 1, 1);
    const rp = {}, rl = gesture(t, rp, ROALC); if (rp.up) { rp.up = lerp(rp.up, .12 + (rp.up - .12) * .55, dream); rp.fore = lerp(rp.fore, .3 + (rp.fore - .3) * .6, dream); }
    const roal = stander(t, MID - 70, G, 44, [], { who: 'roal', key: 'roal', seed: 3, flip: !turn && t > T0('C') && t < T0('E') ? false : !turn, look: (turn ? .05 : .45) + rl + nod(t, TO_ROAL), pose: rp, talk: talk(t, 'roal'), lid: dream * .45 });
    const tp = {}, tl = gesture(t, tp, TRESTC);
    stander(t, MID + 70, G + 10, 46, [], { who: 'trest', key: 'trest', seed: 7, flip: t < tF,   // toward Roal, at his left, until F-2 comes from the right
      look: .1 + tl + nod(t, TO_TREST), pose: tp, talk: talk(t, 'trest') });
    dreamCurl(roal.head[0] - 20, roal.head[1] - 40, K(t, 'p085.2', 'p085.3:I have lived'), t, .5 * (1 - ez(t, C('p085.3:I have lived'), C('p085.3:I have lived') + 2)), 'rc');
    // the cloud of blankness, thickening; then the canopy arching and closing into the dome
    const cloud = ez(t, tCloud, tArch), arch = ez(t, tArch - 1, tSolid + 1);
    if (cloud > 0) for (let i = 0; i < 14; i++) { const a = i / 14 * TAU + t * .1, r = 260 + 60 * Math.sin(t * .7 + i); boilSeed('cl' + i); paint(ellPts(MID + Math.cos(a) * r, G - 160 + Math.sin(a) * r * .5, 140 * cloud, 90 * cloud, 14, 20), { fill: '#0E0B09', fillOp: 120 * cloud * (1 - arch * .5), bleed: .4, ink: null }); }
    if (arch > 0) { const r = 560, P = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI * Math.min(1, arch * 1.2), w = 1 + .05 * Math.sin(t * 4 + i) * (1 - arch); P.push([MID + Math.cos(a) * r * w, G + Math.sin(a) * r * .8 * w]); }
      if (arch < 1) P.push([MID, G]); stillSeed('dome'); paint(P, { wash: PULP.black, washOp: 255 * Math.min(1, arch * 1.4), fill: PULP.black, fillOp: 200 * arch, bleed: .05, ink: INK, sw: 1 }); }
  }
  const ROALC = clauses('roal'), TRESTC = clauses('trest'), F2C = clauses('f2'), TO_ROAL = [...TRESTC, ...F2C], TO_TREST = [...ROALC, ...F2C];
  function hall(t) {
    HALFTONE = .3;
    const c = cam(t, [[0, tt => [lerp(900, MID, ez(tt, T0('B'), T0('C'))), lerp(560, 760, ez(tt, T0('B'), T0('C'))), lerp(.95, 1.4, ez(tt, T0('B'), T0('C')))]], [T0('C'), [MID + 60, 780, 2.2], 2],
      [T0('D'), tt => [MID - 80, 760, lerp(2.4, 3, ez(tt, T0('D'), T0('E')))], 2.5], [T0('E'), tt => [MID, lerp(700, 560, ez(tt, T0('E'), tF)), lerp(1.6, 1.05, ez(tt, T0('E'), tF))], 3],
      [tF, tt => [lerp(MID + 200, MID + 500, ez(tt, tF, T0('G'))), 760, 1.3], 2], [T0('G'), [MID + 150, 780, 1.9], 2.5], [T0('H'), tt => [MID, lerp(780, 700, ez(tt, T0('H'), T0('I'))), lerp(1.7, 1.2, ez(tt, T0('H'), T0('I')))], 2.5],
      [T0('I'), [MID + 80, 780, 2.2], 2], [T0('J'), tt => [MID, lerp(760, 660, ez(tt, T0('J'), T0('K'))), lerp(1.8, .95, ez(tt, T0('J'), T0('K')))], 3]]);
    withCam(c, () => inHall(t));
  }
  // K: within: black, the screens glowing, two faces in their light
  function within(t) {
    HALFTONE = .2;
    const z = lerp(1.4, 1.5, seg(t, T0('K'), T1('K')));
    camBegin(960, 560, z);
    stander(t, 860, G, 44, [], { who: 'roal', key: 'roalw', seed: 3, flip: true, look: .35 });
    stander(t, 1060, G + 10, 46, [], { who: 'trest', key: 'trestw', seed: 7, flip: true, look: .3 });
    camEnd();
    shade(-100, H + 100, .82, .9, PULP.black);   // black all round; only the screens give light
    camBegin(960, 560, z);
    for (let c = 0; c < 5; c++) { const x = 420 + c * 230, y = 240; boilSeed('ws' + c); paint(rectPts(x, y, 190, 140), { wash: '#BFC8D2', washOp: 150 + 60 * hash(c + Math.floor(t * 3)), ink: INK, sw: .6 }); glow(x + 95, y + 70, 120, '#DDE6F0', .35); }
    glow(860, G - 250, 60, '#DDE6F0', .2); glow(1060, G - 250, 60, '#DDE6F0', .2);
    camEnd();
  }

  // ---------- L to Q: outside, and the cut-away ----------
  const OG = 860, DOME = [960, OG], DR = 300;
  function outside(t) {
    HALFTONE = .25;
    const tL = T0('L'), tStruck = C('p094.1:They struck'), tN = T0('N'), tP = T0('P'), tProj = C('p098.1:Great ray projectors'), tOff = C('p098.1:as light illumines'), tQ = T0('Q');
    const c = cam(t, [[0, tt => [960, lerp(500, 640, ez(tt, tL, tStruck)), lerp(.8, 1.4, ez(tt, tL, tStruck))]], [tN, tt => [960, 560, lerp(1.1, .8, ez(tt, tN, T1('N')))], 2.5],
      [tP, tt => [960, lerp(640, 300, ez(tt, tProj, tOff + 2)), lerp(1, .8, ez(tt, tP, T1('P')))], 2.5], [tQ, tt => [960, 620, lerp(.9, .35, ez(tt, tQ, DUR))], 3]]);
    withCam(c, () => {
      stillSeed('osky'); paint(rectPts(-3000, -2400, 7000, 3300), { wash: '#1E1A16', washOp: 255, fill: '#2A231D', fillOp: 80, ink: null });
      for (let i = 0; i < 120; i++) glow(-2600 + hash(i * 3.1) * 7000, -2200 + hash(i * 7.7) * 3000, 5, '#F4EEDC', .3 + .3 * hash(i));
      stillSeed('oground'); paint(rectPts(-3000, OG - 20, 7000, 2600), { wash: D[3], washOp: 255, fill: '#1C1814', fillOp: 90, ink: null });
      for (let i = 0; i < 30; i++) { stillSeed('dead' + i); const x = -2500 + hash(i * 3) * 6000, y = OG + 30 + hash(i * 5) * 500; inkLine([[x, y], [x + 4, y - 40 - 40 * hash(i)], [x + 16, y - 60 - 40 * hash(i)]], .6, INK); }   // the bare dead trees
      // the beams: in, striking, more of them; the dome pressed in under them
      const n = t < tN ? 4 : Math.min(12, 4 + Math.floor((t - tN) * 1.5)), bk = ez(t, tL, tStruck) * (1 - ez(t, tOff, tOff + 3)), press = (t > tStruck ? .1 + .06 * Math.sin(t * 3) : 0) * (1 - ez(t, tOff, tOff + 3));
      const rise = ez(t, tOff - 1, tOff + 6);
      for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) * .22, sx = DOME[0] + Math.cos(a) * 1500, sy = -600 - 200 * hash(i) - 1500 * rise;
        ship(sx, sy, 300, t, -1, { d: 3 }); boilSeed('curt' + i); paint(ellPts(sx, sy, 260, 90, 16, 20), { wash: '#0E0B09', washOp: 100, ink: null });
        if (bk > 0) beam(sx, sy + 40, DOME[0] + (i - n / 2) * 30, DOME[1] - DR * .78, 10, 60, GREEN, bk, { washOp: 50, a: .5 }); }
      // the dome, bellied in at its crown under the beams
      const P = []; for (let i = 0; i <= 32; i++) { const a = Math.PI + i / 32 * Math.PI, dent = press * Math.exp(-Math.pow((i - 16) / 6, 2)); P.push([DOME[0] + Math.cos(a) * DR, DOME[1] + Math.sin(a) * DR * .8 * (1 - dent)]); }
      stillSeed('odome'); paint(P, { wash: PULP.black, washOp: 255, fill: PULP.black, fillOp: 230, bleed: .02, tex: .2, ink: INK, sw: 1 });
      if (bk > 0) glow(DOME[0], DOME[1] - DR * .7, 200, GREEN, .5 * bk);
      // P: the ground projectors driving white light up through the curtains
      if (t > tProj - 1) for (let i = 0; i < 5; i++) { const px = DOME[0] - 1400 + i * 700 + (i >= 2 ? 200 : 0), k = ez(t, tProj + i * .3, tProj + i * .3 + .6) * (1 - ez(t, tQ, tQ + 2));
        DES.machine(px, OG + 60, 26, t, { arms: 0, nozzles: true, d: 2, label: null }); if (k > 0) beam(px, OG - 100, DOME[0] + (i - 2) * 500, -700 - 1500 * rise, 10, 40, NRG.livid, k, { washOp: 40, a: .6 }); }
    });
  }
  // M, O: the cut-away: F-2 making the machine, its violet beam to the crown, spreading across the canopy
  function cutaway(t) {
    HALFTONE = .25;
    const tM = T0('M'), tVio = C('p095.1:a strange violet beam'), tO = T0('O'), r = 520, X = 960, Y = 960;
    ground('#1E1A16', 255, 'cut', { fill: '#2A231D', fillOp: 80 });
    camBegin(960, 640, lerp(1, 1.08, seg(t, tM, T1('O'))));
    const P = [], Q = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; P.push([X + Math.cos(a) * r, Y + Math.sin(a) * r * .8]); Q.push([X + Math.cos(a) * r * .94, Y + Math.sin(a) * r * .8 * .93]); }
    boilSeed('cutin'); paint(Q.slice(), { wash: '#141110', washOp: 255, ink: null });
    boilSeed('cutsh'); paint([...P, ...Q.slice().reverse()], { wash: PULP.black, washOp: 255, fill: PULP.black, fillOp: 230, bleed: .02, ink: INK, sw: .8 });
    // the men, small, in the screens' light; F-2 and its new machine
    stander(t, X - 220, Y, 22, [], { who: 'roal', key: 'roalc', seed: 3, flip: false, look: .4 });
    stander(t, X - 150, Y + 4, 23, [], { who: 'trest', key: 'trestc', seed: 7, flip: false, look: .35 });
    const made = ez(t, tM, tVio), fx = X + 160, fy = Y - 120;
    DES.f2(fx, fy + 2.4 * 16, 16, t, { view: 'side' });
    if (made < 1) { boilSeed('bolts' + Math.floor(t * 12)); lightning(fx - 30, fy, X, Y - 60, NRG.lightning, { amp: .2 }); lightning(fx - 30, fy + 10, X + 30, Y - 30, NRG.lightning, { amp: .2, br: 1 }); }
    if (made > 0) { boilSeed('vm'); wash(rrPts(X - 40 * made, Y - 70 * made, 80 * made, 70 * made, 8), 2, { ink: true, sw: .6 }); }
    const vk = ez(t, tVio - .3, tVio + .8), spread = ez(t, tO, tO + 4);
    if (vk > 0) { beam(X, Y - 70, X, Y - r * .72, 12, 30, VIOLET, vk, { splash: false, washOp: 70, a: .7 }); glow(X, Y - r * .74, 160, VIOLET, .6 * vk);
      for (let i = 0; i <= 16; i++) { const a = Math.PI + (.12 + i / 16 * .76) * Math.PI, d = Math.abs(i - 8) / 8; if (d > spread * 1.05 + .1) continue; glow(X + Math.cos(a) * r * .9, Y + Math.sin(a) * r * .8 * .9, 80, VIOLET, .45 * (1 - d * .4)); } }
    // the green, pressing from outside on the crown
    for (let i = 0; i < 5; i++) beam(X - 600 + i * 300, -200, X + (i - 2) * 40, Y - r * .8, 6, 30, GREEN, 1, { washOp: 40, a: .4 });
    camEnd();
  }

  function film(t) {
    const tB = T0('B'), tK = T0('K'), tL = T0('L'), tM = T0('M'), tN = T0('N'), tO = T0('O'), tP = T0('P');
    if (t < tB) return page(t, 'The Dome', 'In Denver, two humans watched the screens that showed the movement of the death and instant destruction.', tB, { soak: '#1E1A16' });
    if (t < tK - .8) return hall(t);
    if (t < tK + .6) return dissolve(seg(t, tK - .8, tK + .6), () => hall(t), () => within(t));
    if (t < tL - .6) return within(t);
    if (t < tL + .6) return dissolve(seg(t, tL - .6, tL + .6), () => within(t), () => outside(t));
    if (t < tM - .6) return outside(t);
    if (t < tM + .6) return dissolve(seg(t, tM - .6, tM + .6), () => outside(t), () => cutaway(t));
    if (t < tN - .6) return cutaway(t);
    if (t < tN + .6) return dissolve(seg(t, tN - .6, tN + .6), () => cutaway(t), () => outside(t));
    if (t < tO - .6) return outside(t);
    if (t < tO + .6) return dissolve(seg(t, tO - .6, tO + .6), () => outside(t), () => cutaway(t));
    if (t < tP - .6) return cutaway(t);
    if (t < tP + .6) return dissolve(seg(t, tP - .6, tP + .6), () => cutaway(t), () => outside(t));
    outside(t);
    if (t > DUR - .6) brushWipe(seg(t, DUR - .6, DUR + .6), [PULP.w[3], PULP.w[2]]);
  }
  shots([[0, film]]);
})();
