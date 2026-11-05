// ch03.js: chapter 3, Life Alone Can Understand Life. It draws script/boards/ch03.yaml; its times are cues against the
// voice (src/gen/ch03.js). Three places: the Denver hall (Roal, Trest and the machines, the screens), space beyond the
// Moon for the battle, and the Colorado settlement, where the green comes; the screens join them.
(() => {
  const { D, INK, ez, win, steps, path, talk, clauses, gesture, nod, listen, ground, cam, withCam, ruled, dreamCurl, page, closing, planet, stander, thoughtRings } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const HEAT = '#FFB070', GREEN = NRG.death, VIOLET = NRG.support;
  const stars = (n = 140, seed = 1, w = 3000, h = 1800) => { for (let i = 0; i < n; i++) { const b = hash(i * 1.3 + seed); glow(960 + (hash(i * 3.1 + seed) - .5) * w, 540 + (hash(i * 7.7 + seed) - .5) * h, 3 + 8 * b * b, '#F4EEDC', .2 + .45 * b); } };
  const dark = key => ground('#1C1814', 255, key, { fill: '#2A231D', fillOp: 90 });
  const ship = (x, y, len, t, dir = -1, o = {}) => { push(); translate(x, y); scale(dir, 1); translate(-x, -y); DES.oShip(x, y, len, t, o); pop(); };

  // ---------- the hall ----------
  const G = 1000, ROAL = 760, TREST = 1020, SCR = (c, r) => [103 + c * 252, 110 + r * 208, 214, 169];
  // the part of a screen [x, x + w] that the hall's piers (DES.lab's, x -199 + 479k, 126 wide) leave in view
  const SEEN = (x, w) => { let a = x + 8, b = x + w - 8; for (let k = 0; k < 6; k++) { const p0 = -199.2 + 478.8 * k, p1 = p0 + 126; if (p1 > a && p0 < b) { if (p0 - a > b - p1) b = p0 - 8; else a = p1 + 8; } } return [a, b]; };
  const tGreenOn = C('p024.1:Enormous, diffused beams');
  // what the screens show: the fleet; then green; then the bodies carried off
  function screens(t) {
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) { const [x, y, w, h] = SCR(c, r), mid = [x + w / 2, y + h / 2];
      if (t > tGreenOn && t < T0('P')) { paint(rectPts(x + 6, y + 6, w - 12, h - 12), { wash: mixCol('#F1E9D3', GREEN, .5), washOp: 200, ink: null }); glow(...mid, 90, GREEN, .5); continue; }
      if ((c + r) % 3 === 0 && t < tGreenOn) { const [a, b] = SEEN(x, w), len = Math.min(110, (b - a) * .62); boilSeed('scr' + c + r); ship((a + b) / 2 + .1 * (b - a) * wob(t, .03, c), mid[1], len, t, -1, { d: 3 }); }   // on the screen, clear of the piers
      if (t > T0('R') - 1 && r === 1 && c > 1 && c < 5) { boilSeed('bod' + c); const q = frac((t - T0('R')) * .08 + c * .3); DES.machine(lerp(x + 20, x + w - 20, q), y + h - 20, 7, t, { arms: 2, label: null, hover: 1.2 }); wash(ellPts(lerp(x + 20, x + w - 20, q), y + h - 60, 24, 10, 10), 2, { ink: true, sw: .4 }); }
    }
  }
  // the machines in the hall: floating in tiers at first; gathered in a ring round Roal when he speaks (S), the near
  // half wider so none stands in front of Roal or Trest, the ring centred between them (1060) so none of the far half
  // stands just behind either (centred at 1000, one stood at Trest's back through the whole speech)
  function hallMachines(t, near) {
    const ring = ez(t, T0('S') - 2, T0('S') + 3), flare = Math.max(win(t, C('p018.1:so Roal was believed'), C('p018.1:so Roal was believed') + 3, .3, 2), win(t, T0('V'), T0('V') + 2.5, .2, 2));
    for (let i = 0; i < 10; i++) { const z = Math.sin(i / 10 * TAU), isNear = z > 0; if (isNear !== near) continue;
      const tx = 1000 + Math.cos(i / 10 * TAU) * 900, ty = 420 + z * 60, rx = 1060 + Math.cos(i / 10 * TAU) * (near ? 1000 : 620), ry = G - 40 + z * 60;
      const x = lerp(tx, rx, ring) + 8 * wob(t, .07, i), g = lerp(ty + 160, ry, ring), s = (near ? 22 : 15) + 3 * hash(i), look = clamp((ROAL - x) / 600, -1, 1);
      const m = DES.machine(x, g, s, t, { arms: 3, d: 1 + (i % 3), hover: lerp(3, 1.6, ring), face: look * .9, lit: .3 + .7 * flare, label: null });
      if (flare > 0) glow(m.eye[0], m.eye[1], s * 2.5, NRG.white, .5 * flare); }
  }
  // Roal: walks to the middle of the floor when he speaks; Trest beside him
  const ROALW = [[T0('S') - 2, T0('S') + 1.5, ROAL, 960]], TRESTW = [[T0('S') - 1.5, T0('S') + 2, TREST, 1160]];
  const SPEECH = clauses(['p033.1', 'p033.3', 'p033.5', 'p034.1']);   // his speech to the machines: a gesture to each clause; Trest nods

  function people(t) {
    const tPoint = C('p018.1:Roal had quickly assured us'), out = win(t, tPoint, C('p018.1:But--life alone'), .6, 1), arm = win(t, T0('V') - .2, T0('W') + .5, .25, 1);
    const pose = { up: lerp(.12, 1.5, Math.max(out, arm)), fore: lerp(.3, arm ? 2.6 : 1.6, Math.max(out, arm)) };
    const gl = arm ? 0 : gesture(t, pose, SPEECH);
    // 'that little chuckle': his head goes back a little, a smile, the shoulders bobbing
    const ch = win(t, C('p033.4'), C('p033.4') + 2.2, .3, .6); if (ch > 0) pose.torso = (pose.torso ?? 0) - .05 * ch * Math.abs(Math.sin(t * 15));
    const roal = stander(t, ROAL, G, 44, ROALW, { who: 'roal', key: 'roal', seed: 3, look: (t < T0('S') ? .5 : .15) + gl - .15 * ch, pose, talk: talk(t, 'roal'), smile: ch, flip: false });
    const point = win(t, T0('Q'), T1('Q'), .5, .5), tp = {}, tl = t > T0('S') + 2 ? listen(t, tp, SPEECH, 2) : 0;   // through the speech Trest listens
    stander(t, TREST, G + 10, 46, TRESTW, { who: 'trest', key: 'trest', seed: 7, look: .45 + tl + nod(t, SPEECH), flip: t < T0('S') + 2 || t > T0('W'), pose: point > 0 ? { up: lerp(.12, 1.7, point), fore: lerp(.3, 1.2, point) } : tp });
    return roal;
  }
  function hall(t) {
    HALFTONE = .3;
    const tB = T0('B'), tE = T0('E');
    const c = cam(t, [[0, tt => [lerp(960, 900, ez(tt, tB, tB + 8)), lerp(560, 720, ez(tt, tB, tB + 8)), lerp(.95, 1.3, ez(tt, tB, C('p018.1:Trest, 35429') + 1))]],
      [T0('C'), tt => [lerp(800, 1250, ez(tt, T0('C') + 1, T0('D'))), 760, 1.4], 2.5], [T0('D'), tt => [ROAL + 40, 760, lerp(2.4, 2.9, ez(tt, T0('D'), tE))], 2.5],
      [tE - .5, tt => [lerp(500, 1500, ez(tt, tE, T1('E'))), 820, 1.6], 2.5], [T0('L') - 1, tt => [lerp(900, 880, ez(tt, T0('L'), T1('L'))), lerp(400, 700, ez(tt, T0('L') - 1, T0('L') + 3)), lerp(2.2, 1.15, ez(tt, T0('L') - 1, T0('L') + 3))], .01],
      [T0('Q') - 1, [900, 740, 1.3], .01], [T0('R'), tt => [lerp(900, 800, ez(tt, T0('R'), T1('R'))), lerp(560, 330, ez(tt, T0('R'), T1('R'))), lerp(1.2, 2, ez(tt, T0('R'), T1('R')))], 2.5],
      [T0('S'), tt => [lerp(1000, 1060, ez(tt, T0('S') + 2, T0('S') + 12)), lerp(720, 770, ez(tt, T0('S') + 2, T0('S') + 12)), lerp(1.2, 2.4, ez(tt, T0('S') + 2, T0('S') + 12))], 3],   // in close enough to read the faces
      [C('p034.1:And--most dangerous') - .6, [1060, 770, 2.3], .01],
      [T0('V') - .3, [980, 760, 2.2], .6], [T0('W'), tt => [lerp(980, 960, ez(tt, T0('W'), DUR)), 600, lerp(2.2, 1.1, ez(tt, T0('W'), DUR))], 2]]);
    withCam(c, () => {
      DES.lab(-300, -150, 2520, 1300, t, { couch: false, ext: 1200 });
      screens(t);
      hallMachines(t, false);
      // E: the weapons taking shape on the floor
      const ew = win(t, tE - 1, T1('E') + .5, 1, 1);
      if (ew > 0) { for (let i = 0; i < 6; i++) { const x = 400 + i * 220, made = ez(t, tE + i * .8, tE + i * .8 + 2), up = ez(t, tE + 6 + i * .5, tE + 9 + i * .5);
          if (made > 0) { glow(x, G - 80, 60, '#CFE0FF', .4 * (1 - made)); DES.mote(x, G - 70 - 200 * up, 150 * made, t, { ang: -Math.PI / 2 * up, drive: up > .1 }); } }
        const hot = K(t, 'p019.1:a highly effective induction-heat ray', 'p019.1:in some small machines');
        DES.machine(1450, G, 18, t, { arms: 2, nozzles: true, d: 2, label: null }); if (hot > 0) glow(1450, G - 60, 40 + 40 * hot, HEAT, .7 * Math.sin(Math.PI * hot)); }
      const roal = people(t);
      // D: his thought, the curl, in the darkest tone (the palest and mid washes vanished against the hall's light wall); S: rings as he speaks
      dreamCurl(roal.head[0] + 20, roal.head[1] - 40, K(t, 'p018.1:But--life alone', 'p018.1:so Roal was believed'), t, .8 * (1 - ez(t, T0('E') - 1, T0('E'))), 'roalcurl', 4);
      hallMachines(t, true);
    });
  }

  // ---------- F to J: space ----------
  function approach(t) {
    HALFTONE = .2;
    dark('appr'); stars(160, 3);
    camBegin(960, 540, lerp(1, 1.08, ez(t, T0('F'), T1('F'))));
    planet(560, 640, 230, 1, { key: 'earth', glow: '#F4EEDC', ga: .2, bands: true }); planet(860, 470, 50, 2, { key: 'luna' });
    for (let i = 0; i < 50; i++) { const q = seg(t, T0('F') - 3, T1('F') + 3); glow(1800 - 80 * q - (i % 10) * 18, 260 + Math.floor(i / 10) * 22 + 6 * hash(i), 5, '#F4EEDC', .7); }
    camEnd();
  }
  // a ship with its force-screen: the screen flares violet where the induction beams land
  function screened(x, y, len, t, k) {
    ship(x, y, len, t, -1, { d: 2 });
    if (k > 0) { boilSeed('fsc' + x); inkLine([...Array(33)].map((_, i) => { const a = i / 32 * TAU; return [x + Math.cos(a) * len * .62, y + Math.sin(a) * len * .2]; }), 1.2 * k, mixCol('#1C1814', VIOLET, .8), 'inkfine', .5); glow(x, y, len * .5, VIOLET, .35 * k); }
  }
  function battle(t) {
    HALFTONE = .2;
    const tG = T0('G'), tThrow = C('p021.1:They were thrown aside'), tVol = C('p021.1:some beams reached out'), tHalf = C('p021.1:fully half the fleet was destroyed');
    const tH = T0('H'), tI = T0('I'), tJ = T0('J');
    const c = cam(t, [[0, tt => [lerp(900, 1150, ez(tt, tG, tH)), 520, 1]], [tH, [1250, 520, 1.6], 2.5], [tI, tt => [lerp(1250, 1300, ez(tt, tI, tJ)), 520, lerp(1.6, 2.2, ez(tt, tI, tJ))], 2], [tJ, tt => [lerp(1300, 2600, ez(tt, tJ + 1, T1('J'))), 480, lerp(1.4, .9, ez(tt, tJ, T1('J')))], 2.5]]);
    dark('battle');
    stars(160, 9);
    withCam(c, () => {
      planet(-200, 900, 300, 2, { key: 'luna2' });
      // the hundred: ten shown; half broken by the torpedoes
      for (let i = 0; i < 10; i++) { const x = 900 + (i % 5) * 230 + 40 * hash(i), y = 300 + Math.floor(i / 5) * 300 + 50 * hash(i * 3), dies = i % 2 === 1, br = dies ? ez(t, tHalf - 1 + i * .3, tHalf + 1.5 + i * .3) : 0;
        if (br >= 1) { for (let k = 0; k < 6; k++) { boilSeed('fr' + i + k); const q = t - (tHalf + 1.5 + i * .3); push(); translate(x + (hash(k) - .5) * 60 * (1 + q), y + (hash(k * 3) - .5) * 40 * (1 + q)); rotate(q * (hash(k * 5) - .5)); wash(rectPts(-18, -6, 36, 12), 3, { ink: true, sw: .4 }); pop(); } continue; }
        if (br > 0) glow(x, y, 160 * br, NRG.white, 1 - br);
        if (i === 4 && t > tH - 2) continue;   // the one under the induction beams, drawn larger below
        screened(x, y, 200, t, t > tH ? win(t, tH, tI + 6, .5, 2) * (.5 + .5 * hash(Math.floor(t * 6) + i)) : 0); }
      // G: the torpedoes: in at the ships, thrown aside by the field, back again; some volatilized in white
      if (t < tH) for (let i = 0; i < 18; i++) { const st = tG + i * .5, q = clamp((t - st) / 8); if (q <= 0 || q >= 1) continue;
        const tgt = [900 + ((i * 3) % 10 % 5) * 230, 300 + Math.floor(((i * 3) % 10) / 5) * 300], sx = -200, sy = 300 + 700 * hash(i);
        let x = lerp(sx, tgt[0], q), y = lerp(sy, tgt[1], q); if (t > tThrow && q > .4) { const w = Math.sin(Math.PI * seg(q, .4, .8)); y += (hash(i) > .5 ? 1 : -1) * 220 * w; }
        const vol = t > tVol && i % 4 === 0 && q > .55;
        if (vol) { if (q < .62) glow(x, y, 60, NRG.white, 1 - seg(q, .55, .62)); const sh = [900 + 230 * (i % 5), 300]; if (q < .58) beam(sh[0], sh[1], x, y, 3, 2, NRG.white, 1, { washOp: 30, a: .6 }); continue; }
        push(); translate(x, y); rotate(Math.atan2(tgt[1] - sy, tgt[0] - sx)); translate(-x, -y); DES.mote(x, y, 46, t, { ang: 0, drive: true }); pop(); }
      // H: the one ship under the induction beams; its screen swallowing them
      if (t > tH - 2) { const sx = 1250, sy = 520, k = win(t, tH - 1, tJ + 1, 1, 1);
        screened(sx, sy, 420, t, k * (.6 + .4 * Math.sin(t * 7)));
        if (t < tI + 2) for (let i = 0; i < 3; i++) { const bx = 500 + i * 80, by = 300 + i * 220, hk = win(t, tH + i * .7, tI + 2, .4, .6); if (hk > 0) beam(bx, by, sx - 240 + i * 40, sy - 60 + i * 50, 4, 20, HEAT, hk, { washOp: 40, a: .6 }); }
        // I: investigators diving at the screen, flaring out; their signals back to the last
        if (t > tI) for (let i = 0; i < 5; i++) { const st = tI + 1 + i * 1.3, q = seg(t, st, st + 1.4); if (q <= 0) continue; const x = lerp(700 + 50 * i, sx - 200 + 60 * i, q), y = lerp(150 + 60 * i, sy - 70 + 20 * i, q);
          if (q < 1) { glow(x, y, 12, NRG.white, .9); ruled([[700 + 50 * i, 150 + 60 * i], [x, y]], 1, '#CFE0FF', .5); } else if (t < st + 2) glow(x, y, 50, VIOLET, 1 - seg(t, st + 1.4, st + 2)); }
        // J: the signal beam out of the fifty, and investigators racing along it
        if (t > tJ) { const bk = ez(t, tJ, tJ + 2); beam(sx + 200, sy, sx + 3000, sy - 300, 6, 30, '#CFE0FF', bk, { washOp: 20, a: .3, splash: false });
          for (let i = 0; i < 6; i++) { const q = frac((t - tJ) * .25 + i / 6); glow(sx + 200 + 2800 * q, sy - 300 * q, 10, NRG.white, .9 * bk); } }
      }
    });
  }

  // ---------- K, M, O, P: the Colorado settlement ----------
  const LG = 900;
  function land(t) {
    HALFTONE = .3;
    const tK = T0('K'), tKill = C('p024.1:were being killed instantly'), tM = T0('M'), tTrees = C('p025.1:Trees, grass'), tO = T0('O'), tP = T0('P');
    const green = Math.max(ez(t, tGreenOn - .5, tGreenOn + 2) * (1 - ez(t, tO - 2, tO + 2) * .6), 0), wither = ez(t, tTrees - 1, tTrees + 6) + (t > T0('L') ? ez(t, tKill, tKill + 6) * .3 : 0);
    const c = cam(t, [[0, tt => [960, lerp(300, 560, ez(tt, tK, tK + 6)), lerp(.8, 1.05, ez(tt, tK, tK + 6))]], [tM - .5, tt => [lerp(800, 1400, ez(tt, tM, T1('M'))), 600, 1.2], 2],
      [tO - .5, [1000, 420, .85], 2.5], [tP - .5, tt => [lerp(900, 1200, ez(tt, tP, T1('P'))), 640, lerp(1.1, 1.3, ez(tt, tP, T1('P')))], 3]]);
    withCam(c, () => {
      ground(mixCol(D[0], '#DDE8D0', .3 * (1 - wither)), 255, 'landsky', { fill: '#FFFFFF', fillOp: 30 });
      stillSeed('hills'); wash([[-800, LG - 140], [200, LG - 260], [900, LG - 180], [1700, LG - 300], [2600, LG - 160], [3400, LG - 240], [3400, LG + 900], [-800, LG + 900]], 1, { op: .8 });
      paint(rectPts(-800, LG - 20, 4200, 1000), { wash: mixCol(D[1], '#9DB08A', .45 * (1 - wither)), washOp: 220, fill: D[2], fillOp: 50, bleed: .2, ink: null });
      // trees: their crowns full, then thinning and grey; grass tufts
      for (let i = 0; i < 26; i++) { const x = -500 + i * 150 + 60 * hash(i), y = LG + 20 + 200 * hash(i * 3), s = 30 + 30 * hash(i * 5), drop = clamp(wither * 1.6 - hash(i * 7) * .6);
        stillSeed('trunk' + i); wash([[x - 4, y], [x + 4, y], [x + 2, y - s * 2], [x - 2, y - s * 2]], 4, { ink: true, sw: .4 });
        if (drop < 1) { stillSeed('crown' + i); paint(ellPts(x, y - s * 2.4, s * (1 - .7 * drop), s * .9 * (1 - .7 * drop), 14, 8), { wash: mixCol(D[2], '#7E9A6A', .5 * (1 - wither)), washOp: 220, ink: INK, sw: .4 }); }
        for (let k = 0; k < 3 && drop > .1; k++) { const q = frac(t * .3 + hash(i * 9 + k)); glow(x + (hash(k + i) - .5) * 60, y - s * 2.4 + q * s * 2.4, 4, mixCol('#F4EEDC', GREEN, .3), .4 * (1 - q) * drop); } }
      // the colony's domes
      for (let i = 0; i < 5; i++) { const x = 500 + i * 260, s = 70 + 20 * hash(i); stillSeed('cdome' + i); wash([...Array(17)].map((_, k) => { const a = Math.PI + k / 16 * Math.PI; return [x + Math.cos(a) * s, LG + 60 + Math.sin(a) * s * .8]; }), 1, { ink: true, sw: .6 }); }
      // the people: standing, then falling in the green
      for (let i = 0; i < 9; i++) { const x = 380 + i * 160 + 50 * hash(i), y = LG + 120 + 60 * hash(i * 3), fall = ez(t, tKill - .3 + i * .12, tKill + .2 + i * .12);   // all down within 1.3 s of 'killed instantly' (spread .25 apart, the last fell 2.6 s on)
        if (fall < 1) { push(); translate(x, y); rotate(fall * Math.PI / 2 * (i % 2 ? 1 : -1)); translate(-x, -y); DES.person(x, y, 18, t, { who: 'citizen', flip: i % 2 }); pop(); }
        else { boilSeed('fallen' + i); wash(rrPts(x - 54 * (i % 2 ? -1 : 1) - 50, y - 14, 100, 20, 8), 2, { ink: true, sw: .4 }); } }
      // P: the transports come down on the far ground between the downed ships, behind them (at 600-1600 one landed on the
      // wreck and each sat on a standing machine's head, reading as one thing)
      // 'scores of great transports': two near, three smaller on the farther ground, coming down one after another
      if (t >= tP) for (const [i, x, sz, y] of [[0, 790, 150, LG - 205], [1, 1330, 150, LG - 205], [2, 260, 90, LG - 245], [3, 1060, 90, LG - 250], [4, 1780, 90, LG - 240]]) {
        const k = ez(t, tP + i * 1.5, tP + 4 + i * 1.5); if (k > 0) DES.mote(x, lerp(-300, y, k), sz, t, { ang: Math.PI, drive: k < 1 }); }
      // the ships overhead and their great diffused beams
      const settle = ez(t, tK, tK + 6), tDown = C('p029.1:The last of the Outsiders was down');
      const fall2 = i => { const a = lerp(tO + 2, tDown - 1.4, i / 2); return t > tO ? ez(t, a, a + 1.5) : 0; };   // the last lands on its line
      for (let i = 0; i < 3; i++) { const sx = 500 + i * 560, sy = lerp(-400, 120 + 40 * i, settle) + fall2(i) * (LG - 60 - 120 - 40 * i), rot = fall2(i) * (i % 2 ? .4 : -.3);
        push(); translate(sx, sy); rotate(rot); translate(-sx, -sy); ship(sx, sy, 520, t, -1, { d: 2 }); pop();
        if (fall2(i) >= 1) for (let k = 0; k < 4; k++) { const q = frac(t * .12 + k / 4 + hash(i)); boilSeed('smoke' + i + k); paint(ellPts(sx + 60 * Math.sin(k + t * .2) + q * 80, sy - 40 - q * 420, 50 + 90 * q, 30 + 50 * q, 12, 20), { wash: D[4], washOp: 170 * (1 - q) * Math.min(1, q * 6), ink: null, bleed: .3 }); }   // the wrecks smoulder
        if (green > 0 && fall2(i) < .1) { boilSeed('gb' + i); paint([[sx - 60, sy + 50], [sx + 60, sy + 50], [sx + 420, LG + 400], [sx - 420, LG + 400]], { wash: GREEN, washOp: 60 * green, ink: null }); glow(sx, LG + 100, 500, GREEN, .35 * green); } }
      if (green > 0) shade(-200, 1400, .0, .18 * green, GREEN);
      // the machines, untouched, standing nearer than the downed ships (drawn first, the hulls covered them)
      for (let i = 0; i < 3; i++) DES.machine(600 + i * 520, LG + 160, 22, t, { arms: 3, d: 1, label: null, face: .3 * Math.sin(t * .3 + i) });
      // O: torpedoes driving in from every side
      if (t > tO && t < tP) for (let i = 0; i < 12; i++) { const st = tO + i * .55, q = seg(t, st, st + 2.2); if (q <= 0 || q >= 1) continue; const tg = 500 + (i % 3) * 560, sx = i % 2 ? -400 : 2400, x = lerp(sx, tg, q), y = lerp(100 + 300 * hash(i), 140, q);
        push(); translate(x, y); rotate(i % 2 ? 0 : Math.PI); translate(-x, -y); DES.mote(x, y, 50, t, { ang: 0, drive: true }); pop(); if (q > .9) glow(tg, 140, 120, NRG.white, (q - .9) * 8); }
      // P: the downed ships stay where they fell, the middle one the wreck the machines study (a separate wreck was drawn
      // over them, and two of them vanished at P without a cut); the tiny spheres worm into it
      const tSph = C('p030.1:Tiny investigator spheres');
      if (t >= tSph) for (let i = 0; i < 14; i++) { const q = frac((t - tSph) * .3 + i / 14); glow(lerp(600 + 60 * i, 1060, q), lerp(LG + 60, LG - 60, q), 7, NRG.white, .8 * (1 - q)); }
    });
  }
  // N: Earth from above, the green spreading
  function globe(t) {
    HALFTONE = .2;
    dark('globe'); stars(120, 21);
    const z = lerp(1.3, 1, ez(t, T0('N'), T1('N')));
    camBegin(960, 540, z);
    planet(960, 560, 380, 1, { key: 'earth2', glow: '#F4EEDC', ga: .2, bands: true });
    const SP = [[820, 470], [1120, 520], [1240, 400], [700, 620], [980, 700], [1080, 640]];
    SP.forEach(([x, y], i) => { const k = i < 3 ? 1 : ez(t, C('p027.1:three more colonies') + (i - 3) * .7, C('p027.1:three more colonies') + (i - 3) * .7 + 1.5); if (k > 0) { glow(x, y, 60 * k, GREEN, .8); glow(x, y, 20 * k, '#FFFDF6', .5); } });
    camEnd();
  }
  // U: the planets, a machine on each
  function worlds(t) {
    HALFTONE = .3;
    ground('#2E2620', 255, 'worlds', { fill: '#3B322B', fillOp: 120 });
    const t0 = T0('U'), c = [lerp(600, 2300, ez(t, t0, T1('U'))), 540, 1];
    withCam(c, () => {
      // spaced by their sizes, 90 apart edge to edge (evenly spaced, Jupiter and Saturn overlapped and showed through each other)
      let x = 260;
      [['mercury', 60], ['venus', 90], ['earth', 95], ['mars', 70], ['jupiter', 220], ['saturn', 180], ['uranus', 120], ['neptune', 115], ['pluto', 40]].forEach(([k, r], i, all) => {
        if (i) x += all[i - 1][1] + 90 + r;
        const y = 600; planet(x, y, r, 1 + (i % 3), { key: 'w' + k, bands: r > 150 });
        const on = ez(t, t0 + i * 1.2, t0 + i * 1.2 + 1); if (on > 0) DES.machine(x, y - r + 4, 16 * on, t, { arms: 3, d: 1, label: null }); });
    });
  }

  function film(t) {
    const tB = T0('B'), tF = T0('F'), tK = T0('K'), tL = T0('L'), tM = T0('M'), tN = T0('N'), tO = T0('O'), tQ = T0('Q'), tU = T0('U'), tV = T0('V');
    if (t < tB) return page(t, 'Life Alone Can Understand Life', 'The science-investigators had been present toward the last, and I am there now, in memory with my two friends.', tB);
    if (t < tF - .8) return hall(t);
    if (t < tF + .6) return dissolve(seg(t, tF - .8, tF + .6), () => hall(t), () => approach(t));
    if (t < T0('G') - .6) return approach(t);
    if (t < T0('G') + .6) return dissolve(seg(t, T0('G') - .6, T0('G') + .6), () => approach(t), () => battle(t));
    if (t < tK - .8) return battle(t);
    if (t < tK + .6) return dissolve(seg(t, tK - .8, tK + .6), () => battle(t), () => land(t));
    if (t < tL - .6) return land(t);
    if (t < tL + .6) return dissolve(seg(t, tL - .6, tL + .6), () => land(t), () => hall(t));
    if (t < tM - .6) return hall(t);
    if (t < tM + .6) return dissolve(seg(t, tM - .6, tM + .6), () => hall(t), () => land(t));
    if (t < tN - .6) return land(t);
    if (t < tN + .6) return dissolve(seg(t, tN - .6, tN + .6), () => land(t), () => globe(t));
    if (t < tO - .6) return globe(t);
    if (t < tO + .6) return dissolve(seg(t, tO - .6, tO + .6), () => globe(t), () => land(t));
    if (t < tQ - .8) return land(t);
    if (t < tQ + .6) return dissolve(seg(t, tQ - .8, tQ + .6), () => land(t), () => hall(t));
    if (t < tU - .6) return hall(t);
    if (t < tU + .6) return dissolve(seg(t, tU - .6, tU + .6), () => hall(t), () => worlds(t));
    // the planets while he names the worlds; back to him for the rest (49 s of planets dragged)
    const tBack = C('p034.1:And--most dangerous');
    if (t < tBack - .6) return worlds(t);
    if (t < tBack + .6) return dissolve(seg(t, tBack - .6, tBack + .6), () => worlds(t), () => hall(t));
    hall(t);
    if (t > DUR - .6) brushWipe(seg(t, DUR - .6, DUR + .6), [PULP.w[3], PULP.w[2]]);
  }
  shots([[0, film]]);
})();
