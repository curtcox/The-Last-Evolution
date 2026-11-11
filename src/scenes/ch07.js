// ch07.js: chapter 7, The Dome. It draws script/boards/ch07.yaml; its times are cues against the voice (src/gen/ch07.js).
// The Denver hall at night; the dome raised on its floor round Roal and Trest; a cut-away of it with F-2's violet
// beam; and outside, the dead plain under the green.
(() => {
  const { D, INK, ez, win, steps, path, talk, clauses, gesture, nod, listen, ground, cam, withCam, dreamCurl, page, stander } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const GREEN = NRG.death, VIOLET = NRG.support, G = 1000, MID = 1000, FS = 30;
  const ship = (x, y, len, t, dir = -1, o = {}) => { push(); translate(x, y); scale(dir, 1); translate(-x, -y); DES.oShip(x, y, len, t, o); pop(); };
  const tCloud = C('p089.1:Gradually a cloud'), tArch = C('p092.1:it arched over them'), tSolid = C('p092.1:a solid, black dome');
  const tF = T0('F'), tSix = C('p087.1:as six large machines');

  // ---------- the hall at night ----------
  // the screens: ships falling (B), the machines (D); flickering
  // the part of a screen [x, x + w] that the hall's piers (DES.lab's, x -199 + 479k, 126 wide) leave in view
  const SEEN = (x, w) => { let a = x + 8, b = x + w - 8; for (let k = 0; k < 6; k++) { const p0 = -199.2 + 478.8 * k, p1 = p0 + 126; if (p1 > a && p0 < b) { if (p0 - a > b - p1) b = p0 - 8; else a = p1 + 8; } } return [a, b]; };
  function screens(t) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const x = 103 + c * 252, y = 110 + r * 208, k = .6 + .4 * hash(c * 7 + r * 3 + Math.floor(t * 3)), mid = [x + 107, y + 85];
      glow(...mid, 160, '#DDE6F0', .25 * k);
      // a ship falling on the screen, kept to the part of it no pier hides, and inside its frame (it slid over frames and
      // piers, flying in the room rather than on the screen)
      if ((c + r) % 2 === 0) { const [a, b] = SEEN(x, 214), cx = (a + b) / 2, len = Math.min(90, (b - a) * .62), q = frac((t - T0('B')) * .15 + hash(c + r * 7)), fy = y + 40 + q * 85;
        boilSeed('fs' + c + r); push(); translate(cx, fy); rotate(q * .35); translate(-cx, -fy); ship(cx, fy, len, t, -1, { d: 3 }); pop(); } }
  }
  // the six machines: in after F-2, then ranged round the men
  // they close round the two men three to a side, clear of them (a half-ring put the middle two in front of Roal and Trest),
  // and inside the dome's edge (at 150 apart the end ones stood half out of it)
  const sixAt = (t, i) => { const ring = ez(t, T0('H') - .5, T0('H') + 3), enter = ez(t, tSix - 1 + i * .3, tSix + 5 + i * .3), k = i < 3 ? 2 - i : i - 3, side = i < 3 ? -1 : 1;
    return [lerp(lerp(2500, 1700 + i * 60, enter), MID + side * (230 + k * 110), ring), lerp(lerp(600, 760, enter), G + 30 - 15 * k, ring)]; };
  function inHall(t, o = {}) {
    DES.lab(-300, -150, 2520, 1300, t, { couch: false, ext: 1200 });
    { const x0 = -300, y0 = -150, w = 2520, h = 1300, fy = y0 + h * .78;   // the lab's piers again, solid: its washes let the screens' frames show through them
      for (let k = 0; k < 6; k++) { const px = x0 + w * (.04 + k * .19); stillSeed('spier' + k); paint(rectPts(px, y0, w * .05, fy - y0), { wash: '#8C8170', washOp: 255, fill: '#7C7262', fillOp: 110, bleed: .02, tex: .3, ink: INK, sw: .6 });
        for (let f = 1; f < 4; f++) inkLine([[px + f * w * .0125, y0 + 10], [px + f * w * .0125, fy - 10]], .35, D[4]); wash(rectPts(px - w * .01, fy - h * .03, w * .07, h * .03), 4, { ink: true, sw: .5 }); } }
    stillSeed('night'); paint(rectPts(-500, -400, 3000, 1900), { wash: PULP.black, washOp: 175, fill: '#1C2028', fillOp: 60, ink: null });
    screens(t);
    let cloud, arch;
    // the cloud of blankness, thickening (the canopy arching and closing into the dome comes after the figures)
    // the cloud of blankness: smoke round them, swiftly thickening, wavering as it solidifies (a near-black fill alone was
    // lost on the dark hall, and the two stood in clear air for 35 s). Drawn behind them, with only a low drift at their
    // feet in front: drawn over them, its washes and lines ran through the men and machines as they spoke, like ghosts
    cloud = .55 * ez(t, tCloud, tCloud + 8) + .45 * ez(t, C('p089.1:Swiftly it intensified') - .3, C('p089.1:Swiftly it intensified') + 5), arch = ez(t, tArch - 1, tSolid + 1); const waver = 1 - .25 * Math.max(0, Math.sin(t * 1.6)) * ez(t, T0('I'), tArch);
    // (paler smoke, wider and rising as it grows: even at 115 its dark grey barely showed on the dim hall)
    if (cloud > 0) for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + t * .12, r = lerp(170, 560, cloud) + 70 * Math.sin(t * .7 + i), cx = MID + Math.cos(a) * r, cy = G - 150 - 170 * cloud + Math.sin(a) * r * .55, k = cloud * waver * (1 - arch * .6);
      boilSeed('cl' + i + Math.floor(t * 4)); paint(ellPts(cx, cy, 110 + 160 * cloud, 70 + 110 * cloud, 14, 26), { wash: mixCol('#7E766A', '#2E2A26', arch), washOp: (60 + 150 * cloud) * Math.min(1, k * 2), fill: '#2A2520', fillOp: 70 * k, bleed: .45, ink: null }); }   // no edges: thin, they drew a web, and thick, it read as rock
    // F-2 floats in and stops before the men
    const f2k = ez(t, tF - .5, tF + 5), fx = lerp(2300, MID + 260, f2k), fy = lerp(560, 780, f2k);
    for (let i = 0; i < 6; i++) if (t > tSix - 1) { const [x, g] = sixAt(t, i); const m = DES.machine(x, g, 22, t, { arms: 3, d: 1 + (i % 2), hover: 1.5 + .1 * wob(t, .3, i), face: clamp((MID - x) / 300, -1, 1), lit: .3, label: null });
      if (t > tCloud - 1) glow(m.eye[0], m.eye[1], 30, '#E6EEFF', .4); }
    // F-2 in front of the six (drawn before them, one passed over it as they came in)
    if (t > tF - 1) { push(); translate(fx, fy); scale(-1, 1); translate(-fx, -fy); DES.f2(fx, fy + 2.4 * FS, FS, t, { view: 'side' }); pop(); glow(fx - 50, fy, 30, '#E6EEFF', .3 + .5 * talk(t, 'f2')); }
    // Roal and Trest before the screens; Roal turns when the machines come. Each gestures on his own clauses (Roal's
    // smaller while his eyes dream) and nods as the other, or F-2, speaks to him
    const turn = t > tF + .3, dream = win(t, C('p085.2'), T1('D'), 1, 1);
    const rp = {}, rh = listen(t, rp, TO_ROAL, 1), rl = rh + gesture(t, rp, ROALG) + staged(t, rp); if (rp.up) { rp.up = lerp(rp.up, .12 + (rp.up - .12) * .55, dream); rp.fore = lerp(rp.fore, .3 + (rp.fore - .3) * .6, dream); }
    const roal = stander(t, MID - 90, G, 44, [[tF + .3, tF + 1.4, MID - 90, MID - 50]], {   // 'Roal turned': a half-step round, toward the room
      who: 'roal', key: 'roal', seed: 3, flip: !turn && t > T0('C') && t < T0('E') ? false : !turn, look: (turn ? .05 : .45) + rl + nod(t, TO_ROAL), pose: rp, talk: talk(t, 'roal'), lid: dream * .45 });
    const tp = {}, th = listen(t, tp, merge(TO_TREST, 3), 2), tl = th + gesture(t, tp, TRESTC);
    stander(t, MID + 90, G + 10, 46, [], { who: 'trest', key: 'trest', seed: 7, flip: t < tF,   // toward Roal, at his left, until F-2 comes from the right
      look: .1 + tl + nod(t, TO_TREST), pose: tp, talk: talk(t, 'trest') });
    dreamCurl(roal.head[0] - 20, roal.head[1] - 40, K(t, 'p085.2', 'p085.3:I have lived'), t, .5 * (1 - ez(t, C('p085.3:I have lived'), C('p085.3:I have lived') + 2)), 'rc');
    if (cloud > 0) for (let i = 0; i < 7; i++) { const cx = MID - 480 + i * 160 + 30 * Math.sin(t * .5 + i), k = cloud * (1 - arch * .6);
      boilSeed('cf' + i + Math.floor(t * 4)); paint(ellPts(cx, G + 40, 150 * cloud, 34 * cloud, 12, 26), { wash: '#6A625A', washOp: 110 * k, bleed: .45, ink: null }); }
    // (the whole arch at once, spreading across and rising from a low canopy to the dome; swept round from one side as a
    // slice pinned to the floor, its first seconds drew a thin wedge, like a stray triangle)
    if (arch > 0) { const r = 560, wide = .55 + .45 * easeOut(Math.min(1, arch * 1.3)), high = easeOut(arch), P = [];
      for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI, w = 1 + .05 * Math.sin(t * 4 + i) * (1 - arch); P.push([MID + Math.cos(a) * r * wide * w, G + Math.sin(a) * r * .8 * high * w]); }
      stillSeed('dome'); paint(P, { wash: PULP.black, washOp: 255 * Math.min(1, arch * 1.4), fill: PULP.black, fillOp: 200 * arch, bleed: .05, ink: INK, sw: 1 }); if (arch > .6) paint(P, { wash: PULP.black, washOp: 255 * seg(arch, .6, 1), ink: null, bleed: .05 }); }   // a second coat as it solidifies: one lets the figures show through
  }
  const ROALC = clauses('roal'), TRESTC = clauses('trest'), F2C = clauses('f2'), TO_ROAL = [...TRESTC, ...F2C], TO_TREST = [...ROALC, ...F2C];
  // Roal's long speech, 'But not the end of evolution', staged on its sentences: the hand opens on 'evolution', sweeps out
  // to the machines that will go on, comes to his chest for man's flesh, rests, goes to his chin, rises high on 'leaps
  // ahead', hands behind him for last night, opens at 'baffled', back to his chest for himself, folds for his own life.
  // Trest's listening runs on across the breaths between clauses, so it goes through all its stances. (Roal opened the
  // same hand every 4-5 s, eight times in 44 s, and Trest swapped two poses.)
  const merge = (cl, gap) => { const out = []; for (const [a, b] of [...cl].sort((x, y) => x[0] - y[0])) { const l = out[out.length - 1]; if (l && a - l[1] < gap) l[1] = Math.max(l[1], b); else out.push([a, b]); } return out; };
  const SPEECH = [C('p085.3'), C('p085.3$')], ROALG = ROALC.filter(([a]) => a < SPEECH[0] - .2 || a > SPEECH[1]);
  const STAGE = [['', 'The children', { up: .8, fore: 1.9 }], ['The children', 'Not of', { up: 1.3, fore: .5 }], ['Not of', 'a flesh that knows', { up: .35, fore: 2.7 }],
    ['a flesh that spends', 'but overnight', { up: .5, fore: 2.8 }], ['but overnight', 'Last night', { up: 1.6, fore: 1.1 }], ['Last night', 'baffled', { up: -.35, fore: .05, farUp: -.3, farFore: .05 }],
    ['baffled', 'and me', { up: .6, fore: 1.6 }], ['and me', 'I have lived', { up: .35, fore: 2.7 }], ['Surely', 'We will go', { up: .15, fore: 2.3, farUp: .2, farFore: 2.2 }], ['We will go', '$', { up: .5, fore: 1.4 }]]
    .map(([a, b, p]) => [C('p085.3' + (a ? ':' + a : '')), b === '$' ? C('p085.3$') : C('p085.3:' + b), p]);
  function staged(t, pose) {
    let m = 0;
    for (const [a, b, p] of STAGE) { const k = win(t, a - .2, b - .1, .5, .6); if (k <= 0) continue; m = Math.max(m, k); for (const f in p) pose[f] = lerp(pose[f] ?? DES.POSE.stand[f], p[f], k); }
    return .04 * m * Math.sin(t * 1.3);
  }
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
    const faces = [stander(t, 860, G, 44, [], { who: 'roal', key: 'roalw', seed: 3, flip: true, look: .35 }),
      stander(t, 1060, G + 10, 46, [], { who: 'trest', key: 'trestw', seed: 7, flip: true, look: .3 })];
    // F-2 and the six that made the dome, still with them in the dark (gone, they seemed to have left until 3:16): under
    // the shade, dim shapes with the glint of an eye
    const eyes = [[0, 1, 2, 3, 4, 5].map(i => DES.machine([420, 520, 620, 1400, 1500, 1600][i], G - 110, 15, t, { arms: 3, d: 1 + (i % 2), hover: 1.5 + .1 * wob(t, .3, i), face: i < 3 ? 1 : -1, lit: .3, label: null }).eye)];
    const fx = 1290, fy = 780; push(); translate(fx, fy); scale(-1, 1); translate(-fx, -fy); DES.f2(fx, fy + 2.4 * FS, FS, t, { view: 'side' }); pop();
    camEnd();
    shade(-100, H + 100, .82, .9, PULP.black);   // black all round; only the screens give light
    camBegin(960, 560, z);
    for (let c = 0; c < 5; c++) { const x = 420 + c * 230, y = 240; boilSeed('ws' + c); paint(rectPts(x, y, 190, 140), { wash: '#BFC8D2', washOp: 150 + 60 * hash(c + Math.floor(t * 3)), ink: INK, sw: .6 }); glow(x + 95, y + 70, 120, '#DDE6F0', .35); }
    // the faces in the screens' light: drawn again over the dark (under the shade, with glows of .2 at a guessed height,
    // they were dark grey)
    for (const p of faces) { p.redrawHead(); glow(...p.head, 70, '#DDE6F0', .2); }
    for (const e of eyes[0]) glow(e[0], e[1], 26, '#E6EEFF', .35); glow(fx - 50, fy, 40, '#E6EEFF', .3 + .5 * talk(t, 'f2'));
    camEnd();
  }

  // ---------- L to Q: outside, and the cut-away ----------
  const OG = 860, DOME = [960, OG], DR = 300;
  function outside(t) {
    HALFTONE = .25;
    const tL = T0('L'), tStruck = C('p094.1:They struck'), tN = T0('N'), tP = T0('P'), tProj = C('p098.1:Great ray projectors'), tOff = C('p098.1:as light illumines'), tQ = T0('Q');
    const c = cam(t, [[0, tt => [960, lerp(100, 640, ez(tt, tStruck - .6, tStruck + 1.6)), lerp(.6, 1.4, ez(tt, tStruck - .6, tStruck + 1.6))]],   // wide on the hall as the beams draw in, then in as it goes
      [tN, tt => [960, 560, lerp(1.1, .8, ez(tt, tN, T1('N')))], 2.5],
      [tP, tt => [960, lerp(640, -160, ez(tt, tProj, tOff + 2)), lerp(1, .62, ez(tt, tP, T1('P')))], 2.5], [tQ, tt => [960, 640, lerp(.95, .55, ez(tt, tQ, DUR))], 3]]);   // up to the fleet as it's driven off; then out, but not so far the dome is lost
    withCam(c, () => {
      // day, dimmed by the smoke of the battle: 'Dawn was breaking' in chapter 6, 'Last night we saw it leap ahead' here, and
      // F-2 goes out into 'the clear sunlight' in chapter 8 (under a night sky the three didn't join)
      stillSeed('osky'); paint(rectPts(-3000, -2400, 7000, 3300), { wash: '#8A7E6C', washOp: 255, fill: '#6E6354', fillOp: 90, ink: null });
      glow(DOME[0], OG - 120, 1500, '#D8CCB0', .4);
      stillSeed('oground'); paint(rectPts(-3000, OG - 20, 7000, 2600), { wash: D[2], washOp: 255, fill: '#5A5044', fillOp: 110, ink: null });
      // what's left of the hall round the dome: its floor and its broken piers (the dome was made inside it, 2:45)
      stillSeed('ofloor'); wash(rectPts(DOME[0] - DR - 700, OG - 10, 2 * DR + 1400, 40), 2, { ink: true, sw: .5 });
      // the hall stands whole round the dome as the beams come in, and goes as they strike: its piers break down from
      // the roof to their stumps, from the crown outward (the dome was made inside it, then stood alone on the plain)
      const HALLY = OG - 720, gone = (x, y) => tStruck + .1 + 1.1 * Math.min(1, Math.hypot((x - DOME[0]) / 1000, (y - HALLY) / 720)) + .25 * hash(x * .37 + y * .11);
      for (let i = 0; i < 8; i++) { const side = i < 4 ? -1 : 1, k = i % 4, x = DOME[0] + side * (DR + 160 + k * 170), w = 70, bkp = ez(t, gone(x, HALLY), gone(x, HALLY) + .5), h = lerp(720, 140 + 360 * hash(i * 7.3), bkp);
        stillSeed('opier' + i); wash([[x - w / 2, OG], [x - w / 2, OG - h], [x - w / 6, OG - h - 40 * hash(i) * bkp], [x + w / 6, OG - h + 30 * bkp], [x + w / 2, OG - h - 20 * hash(i * 3) * bkp], [x + w / 2, OG]], 3, { ink: true, sw: .6 }); }   // square-topped until it breaks
      for (let i = 0; i < 30; i++) { stillSeed('dead' + i); const x = -2500 + hash(i * 3) * 6000, y = OG + 30 + hash(i * 5) * 500; inkLine([[x, y], [x + 4, y - 40 - 40 * hash(i)], [x + 16, y - 60 - 40 * hash(i)]], .6, INK); }   // the bare dead trees
      // the beams: in, striking, more of them; the dome pressed in under them
      const n = t < tN ? 4 : Math.min(12, 4 + Math.floor((t - tN) * 1.5)), bk = ez(t, tL, tStruck) * (1 - ez(t, tOff, tOff + 3)), tQuiv = C('p094.1:quivered'), tBelly = C('p094.1:bellied'), quiv = win(t, tQuiv - .1, tBelly + .2, .1, .3), belly = ez(t, tBelly - .1, C('p094.1:inward') + .5),
        press = (t > tStruck ? .1 + .06 * Math.sin(t * 3) + .3 * belly : 0) * (1 - ez(t, tOff, tOff + 3));   // pressed; quivering; then bellied well in
      const rise = ez(t, tOff - 1, tOff + 6);
      const near = 300 - 500 * ez(t, tL, tStruck), onHall = [];   // 'swiftly they drew closer': the ships come down into the frame, and stay lower
      for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) * .22, sx = DOME[0] + Math.cos(a) * 1500, sy = -600 - 200 * hash(i) - 1500 * rise - near;
        ship(sx, sy, 300, t, -1, { d: 3 }); boilSeed('curt' + i); paint(ellPts(sx, sy, 260, 90, 16, 20), { wash: '#0E0B09', washOp: 100, ink: null });
        if (bk > 0) { if (t < tStruck) onHall.push([sx, sy + 40, DOME[0] + (i - n / 2) * 30]); else beam(sx, sy + 40, DOME[0] + (i - n / 2) * 30, DOME[1] - DR * .78, 10, 60, GREEN, bk, { washOp: 50, a: .5 }); } }
      // the dome, bellied in at its crown under the beams
      const P = []; for (let i = 0; i <= 32; i++) { const a = Math.PI + i / 32 * Math.PI, dent = press * Math.exp(-Math.pow((i - 16) / 6, 2)), sh = quiv * 7 * Math.sin(t * 38) * (1 + .3 * Math.sin(i * .7)); P.push([DOME[0] + Math.cos(a) * (DR + sh), DOME[1] + Math.sin(a) * (DR * .8 * (1 - dent) + sh)]); }
      stillSeed('odome'); paint(P, { wash: PULP.black, washOp: 255, fill: PULP.black, fillOp: 230, bleed: .02, tex: .2, ink: INK, sw: 1 });
      // the hall's walls and roof before the strike, block by block; each block breaks up in the green as it goes
      if (t < tStruck + 2) for (let r = 0; r < 5; r++) for (let q = 0; q < 10; q++) { const bx = DOME[0] - 1000 + q * 200, by = HALLY + r * 144, tg = gone(bx + 100, by), k = ez(t, tg, tg + .35);
        if (k >= 1) continue;
        const cx = bx + 100, cy = by + 72 + 60 * k, sc = 1 - k;
        stillSeed('ohall' + r + q); { const col = r === 0 ? '#5E5648' : '#6E6656'; paint(rectPts(cx - 100 * sc, cy - 72 * sc, 200 * sc, 144 * sc), { wash: col, washOp: 255, fill: col, fillOp: 200, bleed: .04, tex: .3, ink: INK, sw: .5 }); }
        if (r > 0 && r < 4 && q % 2 === 0 && k === 0) { stillSeed('owin' + r + q); paint(rectPts(bx + 40, by + 30, 120, 84), { wash: '#3A352E', washOp: 220, ink: INK, sw: .4 }); }
        if (k > 0) glow(cx, cy, 120 * (1 - k * .5), GREEN, .6 * (1 - k)); }
      // before the strike the beams come down on the hall's roof, over it
      onHall.forEach(([sx, sy, ex]) => beam(sx, sy, ex, HALLY, 10, 60, GREEN, bk, { washOp: 50, a: .5 })); if (onHall.length) glow(DOME[0], HALLY, 260, GREEN, .5 * bk);
      // the bellied crown picked out in pale ink, so the dent reads through the beams' glow
      const bl = belly * (1 - ez(t, tOff, tOff + 3)); if (bl > 0) { boilSeed('obelly'); inkLine(P.slice(8, 25), 2.4 * bl, '#D8E8C8', 'inkfine', .5); }
      // a pale rim on the dome once the beams are off, so 'the only life was under that dark shroud' finds it on the dead plain
      const rim = ez(t, tOff, tOff + 3); if (rim > 0) { boilSeed('orim'); inkLine(P, 2.2 * rim, '#B8AE98', 'inkfine', .5); for (let i = 2; i < 31; i += 4) glow(...P[i], 70, '#C8BEA8', .22 * rim); }
      if (bk > 0 && t >= tStruck) glow(DOME[0], DOME[1] - DR * .7, 200, GREEN, .5 * bk);
      // P: the ground projectors driving white light up through the curtains
      if (t > tProj - 1) for (let i = 0; i < 5; i++) { const px = DOME[0] - 1400 + i * 700 + (i >= 2 ? 340 : 0), k = ez(t, tProj + i * .3, tProj + i * .3 + .6) * (1 - ez(t, tQ, tQ + 2));
        DES.machine(px, OG + 60, 26, t, { arms: 0, nozzles: true, d: 2, label: null }); if (k > 0) { beam(px, OG - 100, DOME[0] + (i - 2) * 500, -700 - 1500 * rise, 18, 60, NRG.livid, k, { washOp: 110, a: .85 }); glow(px, OG - 100, 80, NRG.livid, .6 * k); } }
    });
  }
  // M, O: the cut-away: F-2 making the machine, its violet beam to the crown, spreading across the canopy
  function cutaway(t) {
    HALFTONE = .25;
    const tM = T0('M'), tVio = C('p095.1:a strange violet beam'), tO = T0('O'), r = 520, X = 960, Y = 960;
    ground('#1E1A16', 255, 'cut', { fill: '#2A231D', fillOp: 80 });
    // in on F-2 and the new machine 'appearing under his lightning force-beams', the men beside; back out as its violet
    // beam goes up to the roof; O: the canopy spreading, whole
    camBegin(...cam(t, [[0, [960, 640, 1]], [tM + .3, [X + 60, Y - 110, 1.8], 2.5], [tVio - 1, [960, 680, 1.02], 3], [tO, tt => [960, 640, lerp(1, 1.08, seg(tt, tO, T1('O')))], 1]]));
    const P = [], Q = []; for (let i = 0; i <= 24; i++) { const a = Math.PI + i / 24 * Math.PI; P.push([X + Math.cos(a) * r, Y + Math.sin(a) * r * .8]); Q.push([X + Math.cos(a) * r * .94, Y + Math.sin(a) * r * .8 * .93]); }
    boilSeed('cutin'); paint(Q.slice(), { wash: '#141110', washOp: 255, ink: null });
    boilSeed('cutsh'); paint([...P, ...Q.slice().reverse()], { wash: PULP.black, washOp: 255, fill: PULP.black, fillOp: 230, bleed: .02, ink: INK, sw: .8 });
    // the men, small, in the screens' light; F-2 and its new machine
    // the six that made the dome, ranged along its inner wall (they were there as it closed, and then gone)
    for (let i = 0; i < 6; i++) { const sd = i < 3 ? -1 : 1, k = i % 3; DES.machine(X + sd * (300 + k * 55), Y - 4 * k, 9, t, { arms: 3, d: 2, hover: 1.2, face: -sd * .6, lit: .3, label: null }); }
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
