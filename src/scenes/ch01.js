// ch01.js: chapter 1, 2538. It draws script/boards/ch01.yaml; its times are cues against the voice (src/gen/ch01.js).
// Three places: the science plate (the history, the numbers, the mind), the city of 2538 (one set, panned), and space.
(() => {
  const { D, INK, ez, win, steps, path, talk, ground, cam, withCam, ruled, dreamCurl, page, closing, planet, stander } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const BG = '#2E2620', PALE = '#EFE6D2', FORCE = '#CFE0FF';
  const plateGround = (key = 'plate') => { ground(BG, 255, key, { fill: '#3B322B', fillOp: 120 }); };

  // ---------- B: six centuries of machines, along a ruled line ----------
  const LY = 640, EAR = 700, EYE = 1300, BRAIN = 1900, JOIN = 2500;
  function ear(x, y, k) { if (k <= 0) return; boilSeed('ear');
    for (let i = 0; i < 3; i++) { const r = (40 + i * 34) * k; wash([[x - 10, y - 12], [x - 10 - r * 1.4, y - r], [x - 10 - r * 1.4, y + r], [x - 10, y + 12]], 1 + i, { ink: true, sw: .6, op: .9 }); }
    wash(ellPts(x, y, 26 * k, 26 * k, 14), 0, { ink: true, sw: .6 }); }
  function eye(x, y, k) { if (k <= 0) return; DES.lens(x, y, 70 * k); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; inkLine([[x + Math.cos(a) * 80 * k, y + Math.sin(a) * 80 * k], [x + Math.cos(a) * 100 * k, y + Math.sin(a) * 100 * k]], .6, PALE); } }
  function brain(x, y, k) { if (k <= 0) return; boilSeed('brain'); DES.dcase(x, y + 90 * k, 60 * k, 90 * k, 50 * k, 1, { shine: true, rings: [.3, .7] }); }
  function history(t) {
    HALFTONE = .3;
    const tEar = C('p003.1:The Ear-apparatus'), tEye = C('p003.1:The Eye came later'), tBrain = C('p003.1:the Brain'), tJoin = C('p003.1:But by twenty-five hundred'), tUp = C('p003.1:to think, and act');
    const j = ez(t, tJoin, tJoin + 3), up = ez(t, tUp - 1, tUp + 2);
    const c = cam(t, [[0, [EAR - 300, LY - 40, 1]], [tEar - 1, [EAR, LY - 40, 1.15], 2], [tEye - .8, [EYE, LY - 40, 1.15], 2], [tBrain - .5, [BRAIN, LY - 40, 1.15], 2], [tJoin, [JOIN - 200, LY - 60, 1.1], 3], [tUp - 1, [JOIN, LY - 120, 2.2], 3]]);
    withCam(c, () => {
      plateGround();
      ruled([[0, LY + 120], [JOIN + 600, LY + 120]], seg(t, T0('B') - 1, T0('B') + 4), D[1], 1.1);
      for (let i = 0; i < 7; i++) { const x = 200 + i * 400; ruled([[x, LY + 105], [x, LY + 135]], seg(t, T0('B') + i * .5, T0('B') + i * .5 + .4), D[1], .8); }
      if (j < 1) { ear(lerp(EAR, JOIN - 90, j), LY - 20, backOut(seg(t, tEar, tEar + .8)) * (1 - j * .6)); eye(lerp(EYE, JOIN, j), LY - 40, backOut(seg(t, tEye, tEye + .8)) * (1 - j * .6)); brain(lerp(BRAIN, JOIN, j), LY - 180 + 60 * j, backOut(seg(t, tBrain, tBrain + .8)) * (1 - j * .4)); }
      if (j > .6) { const a = seg(j, .6, 1); glow(JOIN, LY - 80, 200 * (1 - a), NRG.white, .6 * (1 - a));
        DES.machine(JOIN, LY + 110, 34, t, { arms: 3, d: 1, hover: 1 + 2.5 * up, face: .2 * wob(t, .2), lit: .4 + .4 * up, label: null }); }
    });
  }

  // ---------- C, D, K: the city of 2538 ----------
  const G = 980;
  const TOWERS = [[-300, .55, 3], [250, .9, 2], [700, .6, 3], [1250, 1.1, 2], [1900, .75, 3], [2450, 1.2, 2], [3000, .65, 3], [3550, 1, 2], [4100, .8, 3], [4700, 1.15, 2]];
  function towers(t) {
    for (const [x, s, d] of TOWERS) { stillSeed('tw' + x); const r = 75 * s * .9, h = 400 * s * 1.6, dh = 90 * s;
      DES.dcase(x, G - 40, r, h, dh, d, { shine: d < 3, rings: [.1, .35, .6, .85] });
      for (let k = 0; k < 6; k++) glow(x - r * .5 + (k % 3) * r * .5, G - 40 - h * (.2 + .13 * Math.floor(k / 3) + .3 * hash(x + k)), 10, '#F4EEDC', .25); }
  }
  // the machines at work: each carries a crate along its own loop above the city
  function workers(t) {
    for (let i = 0; i < 9; i++) { const ph = t * (.05 + .02 * hash(i)) + hash(i * 3), x = -200 + frac(ph) * 5200, y = 380 + 200 * hash(i * 5) + 30 * Math.sin(t * .6 + i), s = 16 + 8 * hash(i * 7);
      const m = DES.machine(x, y + 2.5 * s, s, t, { arms: 2, d: 1 + (i % 2), hover: 2.5, face: .6, label: null });
      boilSeed('crate' + i); wash(rrPts(x - s * 1.2, m.dy + s * .8, s * 2.4, s * 1.6, s * .2), 2, { ink: true, sw: .5 }); inkLine([[x - s * .6, m.arm], [x - s * .6, m.dy + s * .8]], .5, INK); inkLine([[x + s * .6, m.arm], [x + s * .6, m.dy + s * .8]], .5, INK); }
  }
  function cityWorld(t) {
    ground(D[0], 255, 'citysky', { fill: '#FFFFFF', fillOp: 40 });
    stillSeed('hills'); wash([[-800, G - 120], [0, G - 220], [900, G - 150], [1800, G - 240], [2900, G - 160], [3900, G - 230], [5200, G - 140], [5200, G], [-800, G]], 1, { op: .6 });
    steady(() => towers(t));
    stillSeed('plaza'); wash(rectPts(-800, G - 30, 6000, 600), 1, { ink: false, op: .9 }); inkLine([[-800, G - 30], [5200, G - 30]], .6, D[3]);
    for (let k = 0; k < 24; k++) inkLine([[-800 + k * 260, G - 30], [-1500 + k * 340, G + 600]], .35, D[2]);
    workers(t);
    // C: a machine hands a man a crate; he walks on with it
    const tHand = C('p003.1:Man lived on the products'), hk = ez(t, tHand - 1, tHand + 1.5), walkOff = [[tHand + 1.8, tHand + 7, 1500, 2300]];
    DES.machine(1650, G - 10 - 20 * hk, 18, t, { arms: 3, d: 1, hover: 2, face: -.6, label: null });
    const man = stander(t, 1450, G, 26, walkOff, { seed: 2, key: 'cman', pose: hk > .5 ? { up: .9, fore: 1.6 } : {} });
    boilSeed('hcrate'); const cx = hk < 1 ? lerp(1610, 1470, hk) : man.hand[0], cy = hk < 1 ? lerp(G - 120, G - 95, hk) : man.hand[1];
    wash(rrPts(cx - 22, cy - 18, 44, 34, 4), 2, { ink: true, sw: .5 });
    // people at ease: pairs in talk, the talking passing back and forth (the speaker's hand works, the other listens and
    // nods), and strollers crossing the plaza
    for (let i = 0; i < 7; i++) { const x = 300 + i * 330 + 40 * hash(i), y = G + 20 + 30 * hash(i * 3), s = 22 + 5 * hash(i * 5); if (Math.abs(x - 1500) < 200) continue;
      if (i % 3 === 2) { stander(t, x - 200, y, s, [[26 + 4 * i, 52 + 4 * i, x - 200, x + 260]], { seed: 40 + i, key: 'st' + i, look: .05, flip: i % 2 > 0 }); continue; }
      const turn = Math.floor((t + 8 * hash(i * 9)) / 4.5) % 2;
      for (const sd of [0, 1]) { const g = (turn === sd) * (.5 + .5 * Math.sin(t * (1.6 + .3 * hash(i)) + i));
        stander(t, x + (sd ? 30 : -30) * s / 24, y, s, [], { seed: 50 + i * 2 + sd, key: 'pr' + i + sd, flip: sd > 0, look: turn === sd ? .05 : -.06 * Math.max(0, Math.sin(t * .8 + i)),
          pose: { up: lerp(.12, .8, g), fore: lerp(.3, 1.8, g) }, talk: turn === sd ? .3 * Math.max(0, Math.sin(t * 6 + i)) : 0 }); } }
    // D: the runners cross the plaza; the mock battle beyond them
    const tRun = C('p003.1:But games');
    for (let i = 0; i < 3; i++) stander(t, 2500, G + 40 + i * 30, 27 + i * 2, [[tRun + i * .3, tRun + 5 + i * .4, 2500 - i * 60, 3900 - i * 120]], { seed: 10 + i, key: 'run' + i, pose: { torso: .15 } });
    const tMock = C('p003.1:mock battles') - 3;
    for (let sd = -1; sd <= 1; sd += 2) for (let i = 0; i < 3; i++) { const x = 3550 + sd * (260 + i * 60), y = G + 10 + i * 40;
      stander(t, x, y, 27, [], { seed: 20 + i + sd, key: 'mb' + sd + i, flip: sd > 0, pose: { up: 1.4, fore: 1.6, torso: .08 } }); }
    if (t > tMock) for (let k = 0; k < 3; k++) { const n = Math.floor((t - tMock) * 3 + k * 7.3); if (hash(n) < .45) continue; const i = n % 3, sd = hash(n * 3) > .5 ? 1 : -1;
      const a = [3550 - sd * (260 + i * 60) + sd * 40, G + 10 + i * 40 - 90], b = [3550 + sd * (260 + ((i + 1) % 3) * 60) - sd * 40, G + 10 + ((i + 1) % 3) * 40 - 90];
      beam(a[0], a[1], b[0], b[1], 4, 10, FORCE, 1, { washOp: 30, a: .6 }); }
  }
  // K: a man and a machine walking side by side toward the towers
  function together(t) {
    const t0 = T0('K'), x = lerp(900, 2400, ease(seg(t, t0 - .5, DUR + 2) * .9));
    stander(t, x - 20, G + 60, 30, [[t0 - 1, DUR + 3, 900, 2300]], { seed: 31, key: 'walker', look: .2 });
    DES.machine(lerp(1050, 2450, ease(seg(t, t0 - .5, DUR + 2) * .9)) + 120, G + 50, 18, t, { arms: 3, d: 1, hover: 2 + .2 * wob(t, .9), face: -.3, label: null });
  }
  function city(t) {
    HALFTONE = .3;
    const c = cam(t, [[0, tt => [lerp(900, 1700, ez(tt, T0('C') - 2, T1('C'))), 600, .85]], [T0('D') - .5, tt => [lerp(2800, 3500, ez(tt, T0('D'), T1('D'))), 680, 1], 3],
      [T0('K') - 2, tt => [lerp(1100, 2300, ez(tt, T0('K'), DUR + 1)), 850, 1.6], .01]]);
    withCam(c, () => { cityWorld(t); if (t > T0('K') - 2) together(t); });
  }

  // ---------- E: the numbers ----------
  function numbers(t) {
    HALFTONE = .3;
    plateGround('numbers');
    const t0 = T0('E'), tPeak = C('p004.1:but from that time on'), tFew = C('p004.1:a scant two millions'), tEnd = T1('E');
    // how many of the lights are lit: climbing to the peak, then going out to a scatter
    const n = 320, lit = t < tPeak ? lerp(.15, 1, ease(seg(t, t0, tPeak))) : lerp(1, .012, Math.pow(seg(t, tPeak + .5, tFew + 1.5), .6));
    const z = 1 + .5 * ez(t, tFew, tEnd);
    camBegin(W / 2, H / 2 + 60, z);
    for (let i = 0; i < n; i++) { if (hash(i * 9.1) > lit) continue; const x = 240 + hash(i * 3.3) * 1440, y = 360 + hash(i * 5.7) * 560, b = .5 + .5 * Math.sin(t * 2 + i);
      glow(x, y, 9, '#F4EEDC', .5 + .3 * b); }
    // the years: a ruled curve rising to its peak and falling, drawn as the voice says them
    const P = []; for (let k = 0; k <= 30; k++) { const u = k / 30; P.push([240 + u * 1440, 300 - 180 * Math.sin(Math.PI * Math.min(1, u * 1.6)) * (u < .62 ? 1 : 1 - (u - .62) * 2.4)]); }
    ruled(P, seg(t, t0, tFew + 1), D[1], 1);
    camEnd();
  }

  // ---------- F: other worlds ----------
  function worlds(t) {
    HALFTONE = .25;
    const t0 = T0('F'), k = ez(t, t0, T1('F') - 1);
    const sx = lerp(860, 1560, k), sy = lerp(720, 320, k) - 120 * Math.sin(Math.PI * k);
    const c = cam(t, [[0, [880, 620, 1]], [t0 + 1, tt => [lerp(900, 1350, ez(tt, t0 + 1, T1('F'))), lerp(600, 420, ez(tt, t0 + 1, T1('F'))), 1.1], 3]]);
    withCam(c, () => {
      ground('#221C17', 255, 'sp1', { fill: '#2E2620', fillOp: 90 });
      for (let i = 0; i < 120; i++) { const b = hash(i * 1.3); glow(960 + (hash(i * 3.1) - .5) * 3200, 540 + (hash(i * 7.7) - .5) * 2000, 3 + 8 * b * b, '#F4EEDC', .2 + .4 * b); }
      planet(1700, 300, 70, 2, { key: 'mars' });
      planet(480, 1350, 760, 1, { key: 'earth', glow: '#F4EEDC', ga: .25, bands: true });
      // the ship, and its drive's thread behind it
      const P = []; for (let q = 0; q <= k; q += .04) P.push([lerp(860, 1560, q), lerp(720, 320, q) - 120 * Math.sin(Math.PI * q)]);
      if (P.length > 1) inkLine(P, .5, FORCE, 'inkfine', .5);
      push(); translate(sx, sy); rotate(-.6); translate(-sx, -sy); DES.mote(sx, sy, 60, t, { ang: 0, drive: true }); pop();
    });
  }

  // ---------- G to J: the mind ----------
  const HEAD = [420, 380], LENS = [420, 780], GOAL = [1560, 560];
  function mind(t) {
    HALFTONE = .3;
    const tH = T0('H'), tI = T0('I'), tJ = T0('J'), tMach = C('p005.1:Machines');
    const c = cam(t, [[0, [900, 560, 1]], [tH, tt => [960, 540, lerp(1.6, .9, ez(tt, tH, tI))], 2], [tI - .5, [990, 580, 1], 2.5], [tJ, tt => [lerp(1000, 2900, ez(tt, tJ, T1('J'))), 580, 1], 2]]);
    withCam(c, () => {
      plateGround('mind');
      const show = 1 - win(t, tH - .5, tI - .5, 1, 1);
      if (show > 0) {
        boilSeed('headbg'); DES.headSide(HEAD[0], HEAD[1], 240, 'citizen', { lid: blinkK(t) });
        DES.lens(LENS[0] + 40, LENS[1], 80, { lit: .4 + .3 * Math.sin(t * 3) });
        // G: each thought as it's named
        dreamCurl(HEAD[0] + 120, HEAD[1] - 40, K(t, 'p005.1:the unseen places', 'p005.1:of the mind+1') * (1 - ez(t, tH - 1, tH)), t, .6 * show, 'g');
        const steps0 = [[LENS[0] + 130, LENS[1]]]; for (let i = 0; i < 8; i++) { const [x, y] = steps0.at(-1); steps0.push([x + 70, y], [x + 70, y - 40]); }
        ruled(steps0, seg(t, tMach, tMach + 5) * (1 - ez(t, tH - 1, tH)), PALE, 1);
      }
      // H: three facts, and the whole built from them
      const hk = win(t, tH - .3, tI - .5, .5, 1);
      if (hk > 0) {
        const F3 = [[900, 520], [1020, 500], [960, 600]], grow = ez(t, tH + 1, C('p005.1:built in mind all the Universe') + 1.5);
        F3.forEach(([x, y], i) => glow(x, y, 16, NRG.white, hk * backOut(seg(t, tH + i * .4, tH + i * .4 + .5))));
        for (let i = 0; i < 90 * grow; i++) { const a = hash(i) * TAU, r = 40 + 520 * Math.pow(hash(i * 3), .7) * grow, p0 = F3[i % 3], p1 = [960 + Math.cos(a) * r * 1.3, 550 + Math.sin(a) * r * .8];
          boilSeed('lat' + i); inkLine([p0, [lerp(p0[0], p1[0], .5), p0[1]], [lerp(p0[0], p1[0], .5), p1[1]], p1], .5, mixCol(BG, PALE, .7 * hk), 'inkfine', 0); }
      }
      // I: the leap and the march to the same conclusion
      const ik = win(t, tI - .5, DUR, 1, .5) * (t < T0('K') ? 1 : 0);
      if (ik > 0) {
        if (t > tI) { boilSeed('headI'); DES.headSide(HEAD[0], HEAD[1], 240, 'citizen'); DES.lens(LENS[0] + 40, LENS[1], 80, { lit: .5 }); glow(...GOAL, 30, NRG.white, .8 * ik); }
        const tLeap = C('p005.1:sees the future result vaguely'), leap = ez(t, tLeap - .5, tLeap + 1.2), tMarch = C('p005.1:but the machine always reached');
        if (leap > 0) { const P = []; for (let q = 0; q <= leap; q += .05) P.push([lerp(HEAD[0] + 130, GOAL[0] - 60, q), lerp(HEAD[1] - 60, GOAL[1] - 90, q) - 260 * Math.sin(Math.PI * q)]);
          if (P.length > 2) { boilSeed('leap'); wash(ribbon(P, 18, 30), 0, { op: .6 }); } if (leap >= 1) { boilSeed('blur'); wash(ellPts(GOAL[0] - 60, GOAL[1] - 90, 70, 50, 20, 10), 0, { op: .5 }); } }
        const march = [[LENS[0] + 130, LENS[1]]]; for (let i = 0; i < 10; i++) { const [x, y] = march.at(-1); march.push([x + (GOAL[0] - LENS[0] - 130) / 10, y], [x + (GOAL[0] - LENS[0] - 130) / 10, y - (LENS[1] - GOAL[1]) / 10]); }
        ruled(march, seg(t, tI + 2, tMarch + 1.5), PALE, 1.1);
        if (t > tMarch + 1.5) glow(...GOAL, 60, NRG.white, .7 * (1 - seg(t, tMarch + 1.5, tMarch + 3)));
        // J: on across the plate, the curl in arcs above, the ruled line in steps below
        const jk = seg(t, tJ, T1('J'));
        if (jk > 0) { const lx = GOAL[0] + 2000 * jk, A = [], B = [[GOAL[0], GOAL[1]]];
          for (let x = GOAL[0]; x < lx; x += 30) A.push([x, GOAL[1] - 90 - 200 * Math.abs(Math.sin((x - GOAL[0]) / 380 * Math.PI))]);
          for (let x = GOAL[0]; x < lx - 100; x += 100) { const [, y] = B.at(-1); B.push([x + 100, y], [x + 100, y]); }
          if (A.length > 2) { boilSeed('arcs'); wash(ribbon(A, 16, 16), 0, { op: .55 }); }
          ruled([[GOAL[0], GOAL[1] + 60], [lx - 100, GOAL[1] + 60]], 1, PALE, 1);
          for (let x = GOAL[0]; x < lx - 100; x += 100) ruled([[x, GOAL[1] + 48], [x, GOAL[1] + 72]], 1, PALE, .8); }
      }
    });
  }
  const blinkK = t => KIT.blink(t, 5);

  function film(t) {
    const tB = T0('B'), tC = T0('C'), tE = T0('E'), tF = T0('F'), tG = T0('G'), tK = T0('K');
    if (t < tB) return page(t, '2538', 'It was 2538 years After the Year of the Son of Man. For six centuries mankind had been developing machines.', tB, { soak: BG });
    if (t < tC - .8) return history(t);
    if (t < tC + .6) return dissolve(seg(t, tC - .8, tC + .6), () => history(t), () => city(t));
    if (t < tE - .6) return city(t);
    if (t < tE + .6) return dissolve(seg(t, tE - .6, tE + .6), () => city(t), () => numbers(t));
    if (t < tF - .6) return numbers(t);
    if (t < tF + .6) return dissolve(seg(t, tF - .6, tF + .6), () => numbers(t), () => worlds(t));
    if (t < tG - .8) return worlds(t);
    if (t < tG + .6) return dissolve(seg(t, tG - .8, tG + .6), () => worlds(t), () => mind(t));
    if (t < tK - .8) return mind(t);
    if (t < tK + .8) return dissolve(seg(t, tK - .8, tK + .8), () => mind(t), () => city(t));
    city(t); closing(t);
  }
  shots([[0, film]]);
})();
