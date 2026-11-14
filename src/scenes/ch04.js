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
  const XS = [-515, -400, -280, -116, 116, 280, 400, 515];   // the builders' ring across the frame, none hiding another
  const BUILD = [2, 0, 5, 7];   // which place in the builders' ring each of the four takes: C-R-21, X-5638, X-6349, X-6621
  // where everyone's lens or face is, for the camera
  const FACE = { cr21: [P.cr21, 780, 1.7], x5638: [P.x5638, 840, 2], roal: [P.roal, 800, 2.1], trest: [P.trest + 30, 800, 2.1], kahsh: [P.kahsh, 800, 2.1], x6349: [P.x6349, 860, 2], x6621: [P.x6621, 850, 2] };
  const tShift = T0('M');   // from here the floor is the works
  const FX = 1000;          // where F-1 is built

  function council(t) {
    const on = 1 - ez(t, tShift - 1, tShift + 3), fan = ez(t, tShift - 1, tShift + 4);
    // the ring breaks up into the three groups: the machines to the middle, Roal and Trest to their benches
    const look = who => clamp(((K_SPEAK(t) ?? 1000) - P[who]) / 600, -1, 1);
    const crt = ez(t, T0('K') - .5, T0('K') + 1), said = cl => cl.reduce((m, [a, b]) => Math.max(m, win(t, a - .3, b + .5, .4, .7)), 0), crg = said(CR21C), x66 = said(X6621C);
    // the council breaks up: each machine rises and flies across to its place in the builders' ring (they vanished, 5 s on)
    const fly = (i, s) => { const k = ez(t, tShift + .5 + i * .3, tShift + 5 + i * .3), a = Math.PI + BUILD[i] / 7 * Math.PI; return { x: FX + XS[BUILD[i]], by: G - 300 - 160 * Math.sin(a + Math.PI) + 10 * (BUILD[i] % 2), s: lerp(s, 12, k), k }; };
    const F = [fly(0, 30), fly(1, 26), fly(2, 26), fly(3, 26)], hov = (f, h) => lerp(h, (G - f.by) / f.s, f.k);
    if (F[0].k < 1) DES.cr21(lerp(P.cr21, F[0].x, F[0].k), G, F[0].s, t, { lit: lit(t, 'cr21'), hover: hov(F[0], 2 + .6 * crt + .1 * wob(t, .2) + .5 * crg), reach: 4 + 1.2 * crg, weave: .7 * crg, face: look('cr21') * .6 + .35 * crg * Math.sin(t * .9) });
    const x56 = DES.x5638(lerp(P.x5638, F[1].x, F[1].k), G, F[1].s, t, { lit: lit(t, 'x5638'), hover: hov(F[1], 1.5 + .8 * win(t, T0('B'), T0('D'), 1, 1.5)), face: look('x5638') * .8, reach: 4.2 + 1.2 * win(t, C('p039.1:I noticed'), T0('E'), .5, 1), weave: win(t, C('p039.1:weaving tentacles') - .4, T0('E'), .4, 1) });
    // 'and your force-beams': a pale beam plays out from it
    { const fb = win(t, C('p039.1:force-beams') - .2, T0('E'), .3, .8); if (fb > 0) beam(x56.eye[0] - 10, x56.eye[1] - 10, x56.eye[0] - 120 + 60 * Math.sin(t * 2), x56.eye[1] - 320, 4, 16, FORCE, fb, { washOp: 90, a: .7, splash: false }); }
    if (F[2].k < 1) DES.x6349(lerp(P.x6349, F[2].x, F[2].k), G, F[2].s, t, { lit: lit(t, 'x6349'), hover: hov(F[2], 1.5 + .3 * x66), face: clamp(look('x6349') * .8, -.5, .5) });   // turned no further than its stencil reads whole (at .8 it showed 'X-634')
    // the chemist on its long speech: it lifts on its clauses, tentacles out and weaving, its nozzles lit
    if (F[3].k < 1) DES.x6621(lerp(P.x6621, F[3].x, F[3].k), G, F[3].s, t, { lit: lit(t, 'x6621'), hover: hov(F[3], 1.5 + .7 * x66), reach: 3.6 + 1.3 * x66, weave: .8 * x66, face: look('x6621') * .8 + .3 * x66 * Math.sin(t * 1.1) });
    if (talk(t, 'x6621') > 0 && t > C('p045.1') && t < C('p045.3')) glow(P.x6621 + look('x6621') * 20, G - 26 * 6.5, 30, NRG.death, .3);
    return x56;
  }
  // who is speaking now, as an x on the floor (the others' lenses turn to it)
  const SPEAK = [['x5638', 'p037.1'], ['roal', 'p038.1'], ['x5638', 'p040.1'], ['roal', 'p041.1'], ['x6349', 'p042.1'], ['trest', 'p043.1'], ['kahsh', 'p044.1'], ['x6621', 'p045.1'], ['cr21', 'p046.1']];
  // acting on the words: Roal's hand on his clauses; he nods to X-5638, who speaks to him; Trest nods to Roal; Kahsh's
  // hand lifts as he speaks
  const ROALC = clauses('roal'), TO_ROAL = clauses('x5638'), TRESTC = clauses('trest'), KAHSH = clauses('kahsh'), CR21C = clauses('cr21'), X6621C = clauses('x6621');
  const K_SPEAK = t => { let x = null; for (const [w, c] of SPEAK) if (t >= C(c) - .3) x = P[w]; return t > T0('L') ? null : x; };
  function men(t) {
    const fan = ez(t, tShift - 1, tShift + 4), sp = K_SPEAK(t) ?? 1000;
    const pt = win(t, C('p039.1:I noticed'), T0('E'), .5, .8);
    const rp = { up: lerp(.12, 1.4, pt), fore: lerp(.3, 1.6, pt) }, gl = pt > .1 ? 0 : gesture(t, rp, ROALC);
    // X-5638's demonstration: they look up as the ray-machine rises, flinch back, a hand half up, as the deadly beam is
    // trained, then lean in to watch it fall harmless (they held one pose, arms down, for 22 s)
    const up = win(t, C('p037.3:rose') - .3, C('p037.3:trained') - .5, .8, 1), react = win(t, C('p037.3:trained'), C('p037.3:trained') + 3, .35, 1.4), watch = win(t, C('p037.3:trained') + 2.6, C('p037.3:harmless') + 1.2, 1, 1.2);
    const flinch = (q, a) => { q.up = (q.up ?? DES.POSE.stand.up) + a * .45 * react; q.fore = (q.fore ?? DES.POSE.stand.fore) + a * 2 * react; q.torso = (q.torso ?? 0) - .08 * a * react + .05 * watch; };
    flinch(rp, 1);
    stander(t, P.roal, G, 44, [[tShift, tShift + 4, P.roal, 380]], { who: 'roal', key: 'roal', seed: 3, flip: pt > .1 || sp < P.roal || (t > tShift + 4 && t < T0('N') + 1), look: .1 + gl + nod(t, TO_ROAL) + .5 * up + .15 * react, talk: talk(t, 'roal'), pose: rp });
    const step = ez(t, T0('H'), T0('H') + 1) * (1 - ez(t, T0('I'), T0('I') + 1)), tp = {}, tl = gesture(t, tp, TRESTC);
    if (tp.up) { tp.up = .12 + (tp.up - .12) * .5; tp.fore = .3 + (tp.fore - .3) * .55; }   // he's stepped up close to Kahsh: a small gesture, in his own space
    flinch(tp, .8);
    stander(t, P.trest, G + 10, 46, [[T0('H'), T0('H') + 1, P.trest, P.trest + 50], [T0('I'), T0('I') + 1, P.trest + 50, P.trest], [tShift + .5, tShift + 5, P.trest, 1640]], { who: 'trest', key: 'trest', seed: 7, flip: (sp < P.trest && t < tShift) || t > T0('N') + 1, look: .05 + tl + nod(t, ROALC) + .5 * up + .15 * react, talk: talk(t, 'trest'), pose: tp });
    // Kahsh, when the council breaks up, walks off to the right (he vanished)
    { const k = win(t, C('p044.2') + .3, C('p044.2') + 5.4, .3, .5); if (k > 0) letter('Kahsh-256799', P.kahsh, 690, 26, INK, { ink: false, align: 'center', font: '700 26px ' + SERIF, spacing: 1, alpha: k }); }   // lettered as he's named, over his own head (to his right, it sat on X-6349)
    // in profile like the men, turned to whoever speaks, his hand on his own clauses (he stood front-on, as on his
    // model sheet, through the whole council)
    const kp = {}, kl = gesture(t, kp, KAHSH);
    flinch(kp, .8);
    if (t < tShift + 8) { const kf = sp < P.kahsh && t < tShift, kh = stander(t, P.kahsh, G + 20, 44, [[tShift, tShift + 8, P.kahsh, 2500]], { who: 'kahsh', key: 'kahsh', seed: 5, flip: kf, look: .05 + kl + .5 * up + .15 * react, talk: talk(t, 'kahsh'), pose: kp });
      // the Man-ruler's marks, as on his model sheet (the side view drew him a plain tunic like Trest's): the tall fan of
      // his collar behind the head, the mantle over his shoulders, and his disc of office
      if (kh && kh.sh) { const f = kf ? -1 : 1, u = 44 * 6 / 7.4, [sx, sy] = kh.sh, [hx, hy] = kh.head, at = (x, y, a, b) => [x + a * u * f, y + b * u];
        boilSeed('kmant'); wash([at(hx, hy, -.02, .46), at(hx, hy, -.72, -.3), at(hx, hy, -.58, -.7), at(hx, hy, -.22, -.62), at(hx, hy, .06, .3)], 4, { ink: true, sw: .5, curv: .2 });
        wash([at(sx, sy, .28, -.32), at(sx, sy, -.6, -.28), at(sx, sy, -.78, 1.05), at(sx, sy, -.1, .78), at(sx, sy, .34, .3)], 4, { ink: true, sw: .5, curv: .2 });
        paint(ellPts(...at(sx, sy, .3, .5), .16 * u, .16 * u, 12), { wash: '#E8DFC8', washOp: 240, ink: INK, sw: .6 });
        kh.redrawHead(); } }
  }
  // the council's seats and the hall's floor; the screens, and the ten thousand on them (L)
  function screens(t) {
    const k = ez(t, T0('L') - .5, T0('L') + 2) * (1 - ez(t, tShift, tShift + 2));
    if (k <= 0) return;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = 103 + c * 252, y = 110 + r * 208; boilSeed('ten' + c + r); paint(rectPts(x + 6, y + 6, 202, 157), { wash: '#2A231D', washOp: 230 * k, ink: null });
      for (let i = 0; i < 70; i++) { const px = x + 14 + hash(i * 3 + c) * 186, py = y + 14 + hash(i * 7 + r) * 140; glow(px, py, 5, '#F4EEDC', .9 * k); if (i % 3 === 0) inkLine([[px - 7, py], [px + 7, py]], 1.6 * k, '#F4EEDC', 'inkfine', 0); } }   // ten thousand: more of them, brighter, the near ones tiny hulls
  }

  // ---------- M to S: the works ----------
  function groups(t) {
    const k = ez(t, tShift, tShift + 3); if (k <= 0) return;
    // Roal's group, round an atom plate; Trest's, round a beam on a bench
    // (its plate a lit atom and two machines at it, the bench's beam bright, so each reads as a group at work)
    boilSeed('plateR'); wash(rrPts(160, G - 260, 180, 130, 8), 4, { ink: true, sw: .6 }); for (let i = 1; i < 4; i++) inkLine([...Array(25)].map((_, j) => [250 + Math.cos(j / 24 * TAU + t * (.6 + .3 * i)) * i * 18, G - 195 + Math.sin(j / 24 * TAU + t * (.6 + .3 * i)) * i * 10]), .8, '#EFE6D2', 'inkfine');
    glow(250, G - 195, 34, NRG.white, .5 + .2 * Math.sin(t * 3)); glow(250, G - 195, 10, '#FFFFFF', .9); inkLine([[250, G - 130], [250, G]], 1.2, INK);
    DES.machine(110, G, 16, t, { arms: 3, d: 2, label: null, face: .6 }); DES.machine(-30, G + 20, 15, t, { arms: 2, d: 1, label: null, face: .8 });
    boilSeed('benchT'); wash(rrPts(1700, G - 90, 260, 30, 6), 3, { ink: true, sw: .6 }); beam(1720, G - 120, 1940, G - 120, 8, 10, NRG.death, 1, { washOp: 90, a: .8, splash: false }); glow(1720, G - 120, 30, NRG.death, .6);
    DES.machine(1990, G, 16, t, { arms: 3, d: 2, label: null, face: -.6 }); DES.machine(2130, G + 20, 15, t, { arms: 2, d: 1, label: null, face: -.8 });
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
    const m = DES.machine(FX, G, 50, t, { r: 3.4, h: Math.max(.3, 7.5 * dome), dh: 2.6 * dome, d: 0, arms, reach: 6, receptor: lens > .02 ? 'great' : 'one', shine: dome > .5, rings: dome > .9 ? [.15, .5, .85] : [], hover: lerp(lerp(.2, 1.9, ez(t, tTent - 1, tTent + 1.5)), 3, ez(t, tQ + 1, tQ + 4)), lit: F1LIT(t), dark: lens < .02, face: F1FACE(t), label: null });
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
    for (let i = 0; i < 8; i++) { const a = Math.PI + i / 7 * Math.PI, x = FX + XS[i], g = G - 20 + Math.sin(a) * -40, y = G - 300 - 160 * Math.sin(a + Math.PI);
      const mm = DES.machine(x, G + 10 * (i % 2), 18, t, { arms: 3, d: 1 + (i % 2), hover: (G - y) / 18, face: clamp((FX - x) / 500, -1, 1) * .9, label: null, lit: .3 + .4 * busy });
      // MX-3401, lettered as it's named, under its hull (on it, the seven letters were tiny and wider than the case)
      if (i === 1) { const k = win(t, C('p048.1:under the direction') - .1, C('p048.1:under the direction') + 6, .3, .6); if (k > 0) letter('MX-3401', x, y + 96, 30, INK, { ink: false, font: '700 30px ' + SERIF, spacing: 1, alpha: k }); }
      if (busy > 0 && hash(Math.floor(t * 3) + i) > .4) beam(mm.eye[0], mm.eye[1], FX + (hash(i) - .5) * 200, G - 200 - 400 * ez(t, tN, tQ), 3, 8, FORCE, 1, { washOp: 30 * busy, a: .4 * busy, splash: true }); }
    const m = f1Build(t);   // (lettering isn't faded by closing(), so its name goes before the fade)
    // O: the memory-units borne in; the ruled lines from every science-machine converging on the dome-case
    const mk = win(t, tMem - .5, T0('P') + .5, 1, 1);
    if (m && mk > 0) { const top = [FX, m.yb - m.h * .6];
      for (let i = 0; i < 10; i++) { const q = frac((t - tMem) * .4 + i / 10), x = lerp(FX + (i % 2 ? 1 : -1) * (300 + 40 * i), top[0], q), y = lerp(G - 100 - 30 * i, top[1], q);
        boilSeed('mu' + i); wash(rrPts(x - 12, y - 8, 24, 16, 3), 2, { ink: true, sw: .4, op: mk }); }
      if (t > tFeed) for (let i = 0; i < 12; i++) { const sx = FX + (i - 5.5) * 170, sy = 260 + 30 * (i % 3); ruled([[sx, sy], [sx, (sy + top[1]) / 2], [top[0] + (i - 5.5) * 6, (sy + top[1]) / 2], [top[0] + (i - 5.5) * 6, top[1]]], seg(t, tFeed + i * .2, tFeed + i * .2 + 1.5), '#EFE6D2', .6); } }
    // P: the great lens lowered in on force-beams
    if (m && t > T0('P') && t < T0('P') + 5) { const q = ez(t, T0('P'), T0('P') + 4); if (q < 1) { DES.lens(m.eye[0], lerp(m.eye[1] - 260, m.eye[1], q), 50 * .2 * 3.4); beam(m.eye[0], m.eye[1] - 600, m.eye[0], lerp(m.eye[1] - 260, m.eye[1], q), 6, 30, FORCE, 1, { washOp: 30, a: .3, splash: false }); } }
    // P: all the knowledge of six centuries going in: the science-machines' lines lit again, and on each 'all ...'
    // named, a pulse down one bundle of them into the dome-case, its crown flaring as each arrives
    const tWk = C('p049.1:working with all'), FEEDS = [C('p049.1:all physics'), C('p049.1:all chemistry'), C('p049.1:all life-knowledge'), C('p049.1:all science')];
    const along = (P, k) => { const L = P.slice(1).map((q, j) => Math.hypot(q[0] - P[j][0], q[1] - P[j][1])); let d = k * L.reduce((a, b) => a + b, 0);
      for (let j = 0; j < L.length; j++) { if (d <= L[j]) return [lerp(P[j][0], P[j + 1][0], d / L[j]), lerp(P[j][1], P[j + 1][1], d / L[j])]; d -= L[j]; } return P[P.length - 1]; };
    if (m && t > tWk - .5 && t < tQ + 1) { const top = [m.eye[0], m.eye[1] - 34], on = win(t, tWk - .5, tQ + .5, 1.5, 1);
      for (let i = 0; i < 12; i++) { const b = Math.floor(i / 3), sx = FX + (i - 5.5) * 170, sy = 200 + 30 * (i % 3), mid = (sy + top[1]) / 2 - 20, path = [[sx, sy], [sx, mid], [top[0] + (i - 5.5) * 5, mid], [top[0] + (i - 5.5) * 5, top[1]]];
        ruled(path, on, '#EFE6D2', 1.1); const hit = seg(t, FEEDS[b] + (i % 3) * .12, FEEDS[b] + (i % 3) * .12 + 1.4);
        if (hit > 0 && hit < 1) { ruled(path, hit, FORCE, 4, Math.max(0, hit - .3)); glow(...along(path, hit), 26, FORCE, .8); } }
      FEEDS.forEach(f => { const k = win(t, f + 1.2, f + 2.6, .2, 1); if (k > 0) { glow(...top, 120, FORCE, .55 * k); glow(...top, 50, '#FFFFFF', .4 * k); } }); }
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
      [T0('G'), at('x6349'), 2], [T0('H'), [P.trest + 80, 800, 2.1], 1.6], [T0('I'), at('kahsh'), 1.4], [T0('J'), at('x6621'), 1.6], [T0('K'), at('cr21'), 2.2], [C('p046.3'), [P.cr21 + 300, 800, 1.4], 3],   // H: Trest, Kahsh, and X-6349 whole beside them (on Trest alone, X-6349 was cut by the right edge and X-5638 left a sliver at the left)
      [T0('L'), tt => [960, lerp(560, 470, ez(tt, T0('L'), tShift)), lerp(1.1, 1.3, ez(tt, T0('L'), tShift))], 2.5], [tShift, [1000, 650, .78], 2.5],   // the screens and the council under them (it was cropped to heads)
      // M: wide on the floor for 'two small, and one large group', then in on each small group as it's named (one pan
      // across the floor reached Roal's group after its words were over, and the groups read as men standing alone)
      [C('p047.1:One small group') - .3, [330, 840, 1.6], 2.2], [C('p047.1:another investigated') - .3, [1800, 840, 1.6], 2.2],
      [T0('N'), tt => [FX, lerp(820, 600, ez(tt, T0('N'), C('p048.1:more tentacles') - 2)), lerp(1.3, 1.5, ez(tt, T0('N'), C('p048.1:more tentacles') - 2))], 3], [C('p048.1:more tentacles') - 1.5, [FX, 770, 1.15], 2],   // down to the framework's foot as the tentacles go on, one by one
      [C('p048.1:there were stacked the memory-units') - 2.5, [FX, 560, 1.75], 2.5], [T0('P'), [FX, 480, 2.2], 2.5], [C('p049.1:working with all') - 1, tt => [FX, lerp(480, 470, ez(tt, C('p049.1:working with all') - 1, C('p049.1:all physics'))), lerp(2.2, 1.6, ez(tt, C('p049.1:working with all') - 1, C('p049.1:all physics')))], 3],   // back from the lens, slowly, as all man's knowledge goes in (it held still 30 s); in on the memory-units going in, Roal and Trest out of frame (at 1.5 the edges sliced them); then the lens and the dome's crown in the middle of the frame, the lens lowered in from above
      [T0('Q'), tt => [FX, lerp(500, 560, ez(tt, T0('Q'), tR)), lerp(1.8, 1.05, ez(tt, T0('Q'), tR))], 3], [tR, tt => [FX, lerp(620, 480, ez(tt, tR, T0('S'))), lerp(1.4, 2.2, ez(tt, tR, T0('S')))], 3],
      [T0('S'), tt => [FX, lerp(480, 600, ez(tt, T0('S'), DUR)), lerp(2.2, 1.2, ez(tt, T0('S'), DUR))], 2]]);
    withCam(c, () => {
      DES.lab(-300, -150, 2520, 1300, t, { couch: false, ext: 1200 });
      screens(t);
      { const x0 = -300, y0 = -150, w = 2520, h = 1300, fy = y0 + h * .78;   // the lab's piers again, solid: its washes let the screens' frames show through them
          for (let k = 0; k < 6; k++) { const px = x0 + w * (.04 + k * .19); stillSeed('spier' + k); paint(rectPts(px, y0, w * .05, fy - y0), { wash: '#8C8170', washOp: 255, fill: '#7C7262', fillOp: 110, bleed: .02, tex: .3, ink: INK, sw: .6 });
            for (let f = 1; f < 4; f++) inkLine([[px + f * w * .0125, y0 + 10], [px + f * w * .0125, fy - 10]], .35, D[4]); wash(rectPts(px - w * .01, fy - h * .03, w * .07, h * .03), 4, { ink: true, sw: .5 }); } }
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
      // Roal and Trest walk to their groups and stay at them
      men(t);
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
