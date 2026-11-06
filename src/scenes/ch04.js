// ch04.js: chapter 4, The Council. It draws script/boards/ch04.yaml; its times are cues against the voice
// (src/gen/ch04.js). One place: the Denver hall, the council in a half-ring on its floor, then the floor as the works
// where F-1 is built and wakes.
(() => {
  const { D, INK, ez, win, steps, path, talk, clauses, gesture, nod, ground, cam, withCam, ruled, page, closing, stander, thoughtRings } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const HEAT = '#FFB070', VIOLET = NRG.support, FORCE = '#CFE0FF', G = 1000;
  // the council's places on the floor, left to right
  const P = { cr21: 300, x5638: 560, roal: 820, trest: 1010, kahsh: 1180, x6349: 1420, x6621: 1680 };
  const lit = (t, who) => .25 + .75 * talk(t, who);
  // where everyone's lens or face is, for the camera
  const FACE = { cr21: [P.cr21, 780, 1.7], x5638: [P.x5638, 840, 2], roal: [P.roal, 800, 2.1], trest: [P.trest + 30, 800, 2.1], kahsh: [P.kahsh, 800, 2.1], x6349: [P.x6349, 860, 2], x6621: [P.x6621, 850, 2] };
  const tShift = T0('M');   // from here the floor is the works
  const FX = 1000;          // where F-1 is built

  function council(t) {
    const on = 1 - ez(t, tShift - 1, tShift + 3), fan = ez(t, tShift - 1, tShift + 4);
    // the ring breaks up into the three groups: the machines to the middle, Roal and Trest to their benches
    const look = who => clamp(((K_SPEAK(t) ?? 1000) - P[who]) / 600, -1, 1);
    const crt = ez(t, T0('K') - .5, T0('K') + 1);
    DES.cr21(lerp(P.cr21, 300, fan), G, 30, t, { lit: lit(t, 'cr21'), hover: 2 + .6 * crt + .1 * wob(t, .2), face: look('cr21') * .6 });
    const x56 = DES.x5638(lerp(P.x5638, 620, fan), G, 26, t, { lit: lit(t, 'x5638'), hover: 1.5 + .8 * win(t, T0('B'), T0('D'), 1, 1.5), face: look('x5638') * .8, reach: 4.2 + 1.2 * win(t, C('p039.1:I noticed'), T0('E'), .5, 1) });
    DES.x6349(lerp(P.x6349, 1500, fan), G, 26, t, { lit: lit(t, 'x6349'), face: look('x6349') * .8 });
    DES.x6621(lerp(P.x6621, 1750, fan), G, 26, t, { lit: lit(t, 'x6621'), face: look('x6621') * .8 });
    if (talk(t, 'x6621') > 0 && t > C('p045.1') && t < C('p045.3')) glow(P.x6621 + look('x6621') * 20, G - 26 * 6.5, 30, NRG.death, .3);
    return x56;
  }
  // who is speaking now, as an x on the floor (the others' lenses turn to it)
  const SPEAK = [['x5638', 'p037.1'], ['roal', 'p038.1'], ['x5638', 'p040.1'], ['roal', 'p041.1'], ['x6349', 'p042.1'], ['trest', 'p043.1'], ['kahsh', 'p044.1'], ['x6621', 'p045.1'], ['cr21', 'p046.1']];
  // acting on the words: Roal's hand on his clauses; he nods to X-5638, who speaks to him; Trest nods to Roal; Kahsh's
  // hand lifts as he speaks
  const ROALC = clauses('roal'), TO_ROAL = clauses('x5638'), TRESTC = clauses('trest'), KAHSH = clauses('kahsh');
  const K_SPEAK = t => { let x = null; for (const [w, c] of SPEAK) if (t >= C(c) - .3) x = P[w]; return t > T0('L') ? null : x; };
  function men(t) {
    const fan = ez(t, tShift - 1, tShift + 4), sp = K_SPEAK(t) ?? 1000;
    const pt = win(t, C('p039.1:I noticed'), T0('E'), .5, .8);
    const rp = { up: lerp(.12, 1.4, pt), fore: lerp(.3, 1.6, pt) }, gl = pt > .1 ? 0 : gesture(t, rp, ROALC);
    stander(t, P.roal, G, 44, [[tShift, tShift + 4, P.roal, 380]], { who: 'roal', key: 'roal', seed: 3, flip: sp < P.roal || t > tShift + 4, look: .1 + gl + nod(t, TO_ROAL), talk: talk(t, 'roal'), pose: rp });
    const step = ez(t, T0('H'), T0('H') + 1) * (1 - ez(t, T0('I'), T0('I') + 1)), tp = {}, tl = gesture(t, tp, TRESTC);
    if (tp.up) { tp.up = .12 + (tp.up - .12) * .5; tp.fore = .3 + (tp.fore - .3) * .55; }   // he's stepped up close to Kahsh: a small gesture, in his own space
    stander(t, P.trest, G + 10, 46, [[T0('H'), T0('H') + 1, P.trest, P.trest + 50], [T0('I'), T0('I') + 1, P.trest + 50, P.trest], [tShift + .5, tShift + 5, P.trest, 1640]], { who: 'trest', key: 'trest', seed: 7, flip: sp < P.trest && t < tShift, look: .05 + tl + nod(t, ROALC), talk: talk(t, 'trest'), pose: tp });
    if (fan < 1) { push(); translate(P.kahsh, G + 20); scale(1, 1); translate(-P.kahsh, -(G + 20)); DES.person(P.kahsh, G + 20, 44, t, { who: 'kahsh', gest: KAHSH.reduce((m, [a, b]) => Math.max(m, win(t, a - .4, b + .8, .4, .7)), 0) }); pop(); }
  }
  // the council's seats and the hall's floor; the screens, and the ten thousand on them (L)
  function screens(t) {
    const k = ez(t, T0('L') - .5, T0('L') + 2) * (1 - ez(t, tShift, tShift + 2));
    if (k <= 0) return;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = 103 + c * 252, y = 110 + r * 208; boilSeed('ten' + c + r); paint(rectPts(x + 6, y + 6, 202, 157), { wash: '#2A231D', washOp: 230 * k, ink: null });
      for (let i = 0; i < 40; i++) glow(x + 14 + hash(i * 3 + c) * 186, y + 14 + hash(i * 7 + r) * 140, 3, '#F4EEDC', .7 * k); }
  }

  // ---------- M to S: the works ----------
  function groups(t) {
    const k = ez(t, tShift, tShift + 3); if (k <= 0) return;
    // Roal's group, round an atom plate; Trest's, round a beam on a bench
    boilSeed('plateR'); wash(rrPts(160, G - 260, 180, 130, 8), 4, { ink: true, sw: .6 }); for (let i = 1; i < 4; i++) inkLine([...Array(25)].map((_, j) => [250 + Math.cos(j / 24 * TAU) * i * 18, G - 195 + Math.sin(j / 24 * TAU) * i * 10]), .4, '#EFE6D2', 'inkfine');
    glow(250, G - 195, 12, NRG.white, .6); DES.machine(120, G, 16, t, { arms: 3, d: 2, label: null, face: .6 });
    boilSeed('benchT'); wash(rrPts(1700, G - 90, 260, 30, 6), 3, { ink: true, sw: .6 }); beam(1720, G - 110, 1940, G - 110, 4, 4, NRG.death, 1, { washOp: 40, a: .4, splash: false });
    DES.machine(1960, G, 16, t, { arms: 3, d: 2, label: null, face: -.6 });
  }
  function f1Build(t) {
    const tN = T0('N'), tDome = C('p048.1:a vastly greater dome-case'), tTent = C('p048.1:more tentacles'), tMem = C('p048.1:there were stacked the memory-units'), tP = T0('P'), tQ = T0('Q');
    if (t < tN - 1) return null;
    const frame = ez(t, tN - 1, tN + 2), base = ez(t, tN + 1, tN + 4), dome = ez(t, tDome - .5, tDome + 4), arms = Math.floor(8 * ez(t, tTent - .5, tTent + 4)), lens = ez(t, tP + 1, tP + 4);
    // the framework: ruled uprights round the place it stands
    const fh = 680 * frame, fade = 1 - ez(t, tQ, tQ + 3);
    for (let i = -2; i <= 2; i++) if (fade > 0) { ruled([[FX + i * 120, G], [FX + i * 120, G - 40 - fh]], 1, mixCol(D[2], INK, .5), .8 * fade); }
    if (fade > 0) for (let k2 = 1; k2 < 5; k2++) ruled([[FX - 240, G - k2 * 150], [FX + 240, G - k2 * 150]], frame, mixCol(D[2], INK, .5), .5 * fade);
    if (base <= 0) return null;
    const m = DES.machine(FX, G, 50, t, { r: 3.4, h: Math.max(.3, 7.5 * dome), dh: 2.6 * dome, d: 0, arms, reach: 6, receptor: lens > .02 ? 'great' : 'one', shine: dome > .5, rings: dome > .9 ? [.15, .5, .85] : [], hover: lerp(.2, 3, ez(t, tQ + 1, tQ + 4)), lit: F1LIT(t), dark: lens < .02, face: F1FACE(t), label: null });
    return m;
  }
  const tQuiv = () => C('p050.1:the slight quiver'), tDrum = () => C('p050.1:the beating drum'), tCease = () => C('p050.1:the radiation ceased'), tGaze = () => C('p050.1:It gazed about');
  const F1LIT = t => t < tQuiv() ? 0 : Math.min(1, .15 * (1 + Math.sin(t * 30)) * seg(t, tQuiv(), tQuiv() + 1) + .6 * ez(t, tDrum(), tCease()) + .2 * ez(t, tGaze() - .5, tGaze() + .5));
  const F1FACE = t => t < tGaze() ? 0 : .7 * Math.sin((t - tGaze()) * .8) * ez(t, tGaze(), tGaze() + 1);
  function works(t) {
    groups(t);
    // the builders: in a ring round the frame, their force-beams on the work
    const tN = T0('N'), tMem = C('p048.1:there were stacked the memory-units'), tFeed = C('p048.1:all the sensation-ideas'), tQ = T0('Q');
    const busy = win(t, tN, tQ + 1, 1.5, 2);
    for (let i = 0; i < 8; i++) { const a = Math.PI + i / 7 * Math.PI, x = FX + Math.cos(a) * 520, g = G - 20 + Math.sin(a) * -40, y = G - 300 - 160 * Math.sin(a + Math.PI);
      const mm = DES.machine(x, G + 10 * (i % 2), 18, t, { arms: 3, d: 1 + (i % 2), hover: (G - y) / 18, face: clamp((FX - x) / 500, -1, 1) * .9, label: i === 1 ? 'MX-3401' : null, lit: .3 + .4 * busy });
      if (busy > 0 && hash(Math.floor(t * 3) + i) > .4) beam(mm.eye[0], mm.eye[1], FX + (hash(i) - .5) * 200, G - 200 - 400 * ez(t, tN, tQ), 3, 8, FORCE, 1, { washOp: 30 * busy, a: .4 * busy, splash: true }); }
    const m = f1Build(t);
    // O: the memory-units borne in; the ruled lines from every science-machine converging on the dome-case
    const mk = win(t, tMem - .5, T0('P') + .5, 1, 1);
    if (m && mk > 0) { const top = [FX, m.yb - m.h * .6];
      for (let i = 0; i < 10; i++) { const q = frac((t - tMem) * .4 + i / 10), x = lerp(FX + (i % 2 ? 1 : -1) * (300 + 40 * i), top[0], q), y = lerp(G - 100 - 30 * i, top[1], q);
        boilSeed('mu' + i); wash(rrPts(x - 12, y - 8, 24, 16, 3), 2, { ink: true, sw: .4, op: mk }); }
      if (t > tFeed) for (let i = 0; i < 12; i++) { const sx = FX + (i - 5.5) * 170, sy = 260 + 30 * (i % 3); ruled([[sx, sy], [sx, (sy + top[1]) / 2], [top[0] + (i - 5.5) * 6, (sy + top[1]) / 2], [top[0] + (i - 5.5) * 6, top[1]]], seg(t, tFeed + i * .2, tFeed + i * .2 + 1.5), '#EFE6D2', .6); } }
    // P: the great lens lowered in on force-beams
    if (m && t > T0('P') && t < T0('P') + 5) { const q = ez(t, T0('P'), T0('P') + 4); if (q < 1) { DES.lens(m.eye[0], lerp(m.eye[1] - 260, m.eye[1], q), 50 * .2 * 3.4); beam(m.eye[0], m.eye[1] - 600, m.eye[0], lerp(m.eye[1] - 260, m.eye[1], q), 6, 30, FORCE, 1, { washOp: 30, a: .3, splash: false }); } }
    // R: the beating drum of intelligence: rings out from the lens, quicker and quicker, then still
    if (m && t > tDrum()) { const t0 = tDrum(), t1 = tCease(); for (let n = 0; n < 8; n++) { const at = t0 + (t1 - t0) * (1 - Math.pow(1 - n / 8, 1.6)), age = t - at; if (age < 0 || age > 1.6 || at > t1) continue;
      const r = 40 + age * 400, a = .5 * (1 - age / 1.6); for (let i = 0; i < 24; i++) { const q = i / 24 * TAU; glow(m.eye[0] + Math.cos(q) * r, m.eye[1] + Math.sin(q) * r * .6, 18, '#E6EEFF', a); } } }
    return m;
  }

  function hall(t) {
    HALFTONE = .3;
    const tB = T0('B'), tC = T0('C'), tRay = C('p037.3:rose into the air'), tTrain = C('p037.3:trained upon it'), tHarm = C('p037.3:for the ray fell harmless');
    const at = id => FACE[id], tR = T0('R');
    const c = cam(t, [[0, [1000, 800, 1.1]], [C('p037.2') - .5, at('x5638'), 2.5], [tC, [P.x5638 + 120, 820, 1.6], 2], [T0('D'), [P.roal - 60, 800, 2], 2], [T0('E'), at('x5638'), 1.2], [T0('F'), [P.roal + 60, 800, 1.3], 2.2],
      [T0('G'), at('x6349'), 2], [T0('H'), at('trest'), 1.6], [T0('I'), at('kahsh'), 1.4], [T0('J'), at('x6621'), 1.6], [T0('K'), at('cr21'), 2.2], [C('p046.3'), [P.cr21 + 300, 800, 1.4], 3],
      [T0('L'), tt => [960, lerp(500, 400, ez(tt, T0('L'), tShift)), lerp(1.2, 1.5, ez(tt, T0('L'), tShift))], 2.5], [tShift, tt => [lerp(600, 1400, ez(tt, tShift, T0('N'))), 760, 1.15], 2.5],
      [T0('N'), tt => [FX, lerp(820, 600, ez(tt, T0('N'), T0('O'))), lerp(1.3, 1.5, ez(tt, T0('N'), T0('O')))], 3], [T0('O'), [FX, 560, 1.5], 2.5], [T0('P'), [FX, 330, 2.2], 2.5],
      [T0('Q'), tt => [FX, lerp(420, 560, ez(tt, T0('Q'), tR)), lerp(1.8, 1.05, ez(tt, T0('Q'), tR))], 3], [tR, tt => [FX, lerp(620, 480, ez(tt, tR, T0('S'))), lerp(1.4, 2.2, ez(tt, tR, T0('S')))], 3],
      [T0('S'), tt => [FX, lerp(480, 600, ez(tt, T0('S'), DUR)), lerp(2.2, 1.2, ez(tt, T0('S'), DUR))], 2]]);
    withCam(c, () => {
      DES.lab(-300, -150, 2520, 1300, t, { couch: false, ext: 1200 });
      screens(t);
      // Q: a day: the hall darkens to night and comes back
      const night = Math.sin(Math.PI * seg(t, T0('Q'), tR)) * .75;
      if (night > 0) { stillSeed('day'); paint(rectPts(-400, -300, 2800, 1600), { wash: PULP.black, washOp: 200 * night, ink: null }); }
      if (t < tShift + 5) {
        const x56 = council(t);
        // C: the ray-machine rises and trains its beam; X-5638's screen swallows it
        const up = ez(t, tRay - .5, tRay + 1.5), rx = P.x5638 + 170, ry = G - 330 * up;   // in the gap before Roal, above the heads, so the ray is plainly its own
        if (t < T0('D') + 2) { DES.machine(rx, G, 12, t, { arms: 0, nozzles: true, d: 3, hover: 1 + 330 * up / 12, face: -.8, label: null });
          const bk = win(t, tTrain, T0('D'), .3, .5);
          if (bk > 0) { beam(rx - 20, ry - 50, x56.eye[0] + 40, x56.eye[1] + 60, 7, 22, HEAT, bk, { washOp: 90, splash: false });
            const sc = ez(t, tHarm - 1, tHarm); boilSeed('x56scr'); inkLine([...Array(33)].map((_, i) => { const a = i / 32 * TAU; return [P.x5638 + Math.cos(a) * 90, G - 120 + Math.sin(a) * 150]; }), 1.2 * bk, mixCol(D[3], VIOLET, .8), 'inkfine', .5); glow(P.x5638 + 70, G - 150, 80, VIOLET, .5 * bk * (.6 + .4 * sc)); } }
      }
      // Roal and Trest walk to their groups and work there through M (drawn only until they arrived, they vanished)
      if (t < T0('N')) men(t);
      if (t > tShift - 1) works(t);
    });
  }

  function film(t) {
    if (t < T0('B')) return page(t, 'The Council', 'He was interrupted. One of the newest science-machines was speaking.', T0('B'));
    hall(t);
    if (t < T0('B') + .8) flash(1 - seg(t, T0('B'), T0('B') + .8), '#3B322B');
    closing(t);
  }
  shots([[0, film]]);
})();
