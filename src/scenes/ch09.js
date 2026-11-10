// ch09.js: chapter 9, Pure Force. It draws script/boards/ch09.yaml; its times are cues against the voice
// (src/gen/ch09.js). One place, the rock round the power plant, through one night into a red dawn: the storm, the
// white globe killed by the red beam, and the golden sphere.
(() => {
  const { D, INK, ez, win, lerpP, steps, path, talk, ground, cam, page, closing, stander, thoughtRings, ruled, farPlain, haze } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  // the plant stands far off on the plain beyond the near rock, as in chapter 8 (HZ its horizon, PB its foot): it is five
  // hundred feet high and F-2 half a man's size
  // the spheres sized by F-2 beside them (half a man, 4.2 * FS long, about 3 ft): the white 'scarcely a foot', the golden
  // half F-2's length and then 'twice its former size--easily three feet' (at 40 and 60 they were several times the words)
  const GR = 28, FORCE = '#CFE0FF', RG = 900, PX = 1100, HZ = RG - 230, PB = HZ + 12, PS = 2.2, FS = 26;
  const TOP = PB - 400 * PS - 90 * PS * .6, ORB = [PX, TOP - 260], LENS = [PX + 40, PB - 540];   // the crown, where the spheres float, and the lens
  const tD = T0('D'), tDark = C('p117.1:The sky darkened'), tF = T0('F'), tI = T0('I'), tCharge = C('p121.4:A stabbing beam'), tStab = C('p121.4:flashed out'), tStabEnd = C('p121.4:an enormously greater beam') + .3, tRed = C('p121.4:an enormously greater beam');
  const tOrange = C('p121.4:orange'), tGreen = C('p121.4:green'),   // on the colour words themselves (the phrase starts ~1 s early)
    tGone = C('p121.4:Then the sphere had vanished'), tJ = T0('J'), tK = T0('K');
  const tGold = C('p123.1:an irregular globe'), tRuby = C('p126.1:a tiny ruby flame'), tN = T0('N'), tVanish = C('p129.1:fast as light');

  // the storm: 0..1; up from D, gone at F; up again at J, gone at K
  const storm = t => Math.max(win(t, tDark - 1, tF, 3, 2), win(t, tJ, tK + 1, 3, 2));
  // the dome parts once the men are out of it (they walk from inside, hidden, from 'appeared')
  const domePart = t => ez(t, C('p123.1:Roal and Trest appeared') - .3, C('p123.1:Roal and Trest appeared') + 2.2);
  const dawn = t => ez(t, C('p122.1:red glory of the sun') - 3, tK + 6);
  function world(t) {
    const st = storm(t), dw = dawn(t);
    // the sky: night, storm-black, then a red dawn
    const skyCol = mixCol(mixCol('#1E1A16', '#100D0B', st), mixCol('#2A1E1A', '#7A3E2E', .45), dw);
    stillSeed('sky9'); paint(rectPts(-2000, -3200, 6000, 5600), { wash: skyCol, washOp: 255, fill: '#2A231D', fillOp: 70, ink: null });
    if (st < .8) for (let i = 0; i < 100; i++) glow(-1600 + hash(i * 3.1) * 5000, -2400 + hash(i * 7.7) * 3000, 5, '#F4EEDC', .5 * (1 - st) * (1 - dw) * hash(i));
    if (dw > 0) { glow(2300, HZ, 300, '#FF6A3A', .7 * dw); glow(2300, HZ, 900, '#FF9A6A', .35 * dw); }   // the sun rising on the far horizon
    // 'heavy clouds' rolling in, low enough to be seen, their edges catching what light there is (at y -1400, dark on dark, no
    // shot ever showed them)
    if (st > 0) for (let i = 0; i < 18; i++) { stillSeed('cloud' + i); const x = -1200 + (i % 9) * 560 + 90 * t * .3 + 240 * Math.sin(t * .2 + i), y = (i < 9 ? -760 : -240) + 180 * hash(i); boilSeed('cl' + i); paint(ellPts(x, y, 420 + 120 * hash(i * 3), 170 + 50 * hash(i * 5), 18, 34), { wash: '#2A2420', washOp: 230 * st, fill: '#141110', fillOp: 120 * st, bleed: .3, ink: mixCol('#141110', '#6E6458', st), sw: .7 }); }
    // the far plain, the plane of force laid at the plant's foot, the plant, the air between, then the near rock
    farPlain(HZ, RG + 40, 'far9', { x: PX, r: 260, col: mixCol(D[1], skyCol, .4 + .45 * (1 - dw)) });
    stillSeed('plane9'); wash(rectPts(PX - 260, PB - 4, 520, 8), 1, { ink: true, sw: .4 });
    const beat = t > T0('B') ? Math.max(0, Math.sin((t - T0('B')) * (2 + 6 * seg(t, T0('B'), T0('B') + 5)) )) * win(t, T0('B'), C('p115.1:Then it quieted') + 1, .2, 1) : 0;   // its beat (B)
    DES.plant(PX, PB, PS, t, { lum: .14 + .3 * beat });
    const lens = LENS; DES.lens(lens[0], lens[1], 22, { lit: .2 + .8 * talk(t, 'plant') });   // its lens (C)
    haze(PB - 490 * PS, PB + 10, skyCol, .4);
    // the night's coat on the ground, lifted by the dawn, as in chapter 8
    const dim = (P, ink = true) => { if (dw < 1) paint(P, { wash: '#141110', washOp: 225 * (1 - dw), ink: ink ? mixCol('#141110', '#8A8070', 1 - dw) : null, sw: .5 }); };
    { const P = [[-2000, RG + 40], [6000, RG + 40], [6000, RG + 1600], [-2000, RG + 1600]]; stillSeed('rock9'); wash(P, 3, { op: 1 }); dim(P, false); }
    // what's left of the hall round the dome, as chapter 7 left it
    // (bunched by the dome, clear of where the men, C-R-U-1 and F-2 end up: at 170 apart they stood in Trest and C-R-U-1)
    for (let i = 4; i < 8; i++) { const k = i % 4, x = -20 + k * 120, h = 140 + 360 * hash(i * 7.3), w = 70, P = [[x - w / 2, RG + 50], [x - w / 2, RG + 50 - h], [x - w / 6, RG + 50 - h - 40 * hash(i)], [x + w / 6, RG + 80 - h], [x + w / 2, RG + 50 - h - 20 * hash(i * 3)], [x + w / 2, RG + 50]]; stillSeed('opier9' + i); wash(P, 3, { ink: true, sw: .6 }); stillSeed('opier9' + i); wash(P, 3, { ink: true, sw: .6 }); dim(P); }   // two coats: solid rock, not glass
    for (let i = 0; i < 16; i++) { if (i === 7) continue;   // (Trest ends up standing where it was)
      const x = -1600 + i * 300 + 60 * hash(i); stillSeed('rk9' + i); const h = 60 + 120 * hash(i * 3), P = [[x - 70, RG + 50], [x - 30, RG + 50 - h], [x + 40, RG + 50 - h * .7], [x + 80, RG + 50]]; for (let coat = 0; coat < 2; coat++) { stillSeed('rk9' + i); wash(P, 2 + (i % 2), { ink: true, sw: .5 }); } dim(P); }
    // the dome at the left; it parts for the men at K
    const part = domePart(t);
    if (part < 1) DES.blackDome(-300, RG + 60, 320 * (1 - part * .9), t);
    // the rain, driven
    // the wind first, in long driven streaks across the frame; the rain comes on its own words
    const rainK = st * Math.max(ez(t, C('p118.1:The swirl') - .5, C('p118.1:The swirl') + 1.5), ez(t, tJ, tJ + 2)), windK = win(t, C('p117.1:a howling wind') - .3, T0('E') + 2, .8, 2);
    if (windK > 0) for (let i = 0; i < 26; i++) { const n = Math.floor(t * 12), x = -700 + hash(i * 3 + n) * 3000, y = -300 + hash(i * 7 + n) * 1300, l = 160 + 240 * hash(i + n); inkLine([[x, y], [x + l * .5, y - 14 + 20 * hash(i * 9 + n)], [x + l, y + 6]], .6 * windK, '#B8AE98', 'inkfine', .3); }
    if (rainK > .05) { boilSeed('rain' + Math.floor(t * 12)); for (let i = 0; i < 110; i++) { const x = -1200 + hash(i * 3 + Math.floor(t * 12)) * 4400, y = -1600 + hash(i * 7 + Math.floor(t * 12)) * 2600; inkLine([[x, y], [x + 35, y + 60], [x + 70, y + 130]], .7 * rainK, mixCol('#EFE6D2', '#141110', .25), 'inkfine', 0); } }
    return { st, lens };
  }
  function f2At(t) {
    const st = storm(t), wind = win(t, C('p117.1:a howling wind') - .3, T0('E'), .8, 2), gust = st * (30 + 45 * wind) * Math.sin(t * 7) + st * (20 + 30 * wind) * Math.sin(t * 13.3);   // torn at: it held its place only just
    let p = path(t, [[0, [PX - 360, RG - 40]], [tD, [PX - 420, RG - 200], 3], [T0('G'), [PX - 300, ORB[1] + 60], 2.5], [tStab - .1, [PX - 560, ORB[1] + 250], .35], [tJ, [PX - 420, RG - 160], 3], [tK + 2, [PX - 260, RG - 120], 3]]);
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
    const c = cam(t, [[0, tt => [PX - 100, lerp(560, 420, ez(tt, T0('B'), tC)), lerp(.75, .85, ez(tt, T0('B'), tC))]], [tC, [...LENS, 2.2], 2], [tD, tt => [PX - 200, lerp(500, 200, ez(tt, tD, tDark)), lerp(1.2, .7, ez(tt, tD, tDark))], 3],
      [C('p117.1:a howling wind') - .5, tt => [PX - 380, 640, 1.5], 2.5],   // in on the 'tiny rounded hull' the wind tears at; at the wide it was too small to see it held
      [tE, [PX, ORB[1] + 120, 1.1], 3], [tF, [PX - 100, ORB[1] + 200, .9], 3], [tG, [PX - 160, ORB[1] + 60, 1.5], 2.5], [tH, [PX, ORB[1], 2.2], 2.5], [tI, tt => [lerp(PX - 220, PX + 60, ez(tt, tStabEnd, tStabEnd + 2.5)), lerp(ORB[1] + 160, ORB[1] + 100, ez(tt, tStabEnd, tStabEnd + 2.5)), lerp(1.35, 1, ez(tt, tStabEnd, tStabEnd + 2.5))], 2],   // in on the globe and F-2 for the stab and the dodge; then out to hold the plant, the beam and the sphere together through the duel (it went wide 0.5 s after the stab, F-2 cut by the edge)
      [tJ, tt => [lerp(PX - 100, PX + 60, ez(tt, tJ, tJ + 10)), 80, .72], 3],   // J: the storm on the plant again, wide enough for the lightning
      [C('p122.1:C-R-U-1 joined him') - 2, [PX - 490, RG - 110, 1.7], 2.5],   // in on C-R-U-1 floating in beside F-2, its gold name readable
      [C('p122.1:red glory of the sun') - .5, tt => [lerp(PX - 300, PX + 350, ez(tt, C('p122.1:red glory of the sun') - .5, tK)), lerp(760, 680, ez(tt, C('p122.1:red glory of the sun'), tK)), lerp(1.3, .95, ez(tt, C('p122.1:red glory of the sun') - .5, tK))], 3],   // round, so the red sun rises behind them
      // K: in on the dome as it parts and the two men walk out of it, held while they come; then up to the globe above the
      // plant, wide, so the glow shows
      [tK, tt => { const tApp = C('p123.1:Roal and Trest appeared'), up = ez(tt, tApp + 3.5, tGold + 2);
        return [lerp(lerp(350, 215, ez(tt, tK, tApp)), PX, up),   // (at 150 F-2's nose was cut by the right edge as they came out)
           lerp(800, ORB[1] + 260, up), lerp(lerp(1, 1.3, ez(tt, tK, tApp)), .75, up) * lerp(1, 1.5, ez(tt, tGold + 3, tL))]; }, 3],
      [tL, tt => [PX, ORB[1], lerp(2.6, 3.4, ez(tt, tL, tM))], 2.5], [tM, tt => [PX - 100 * ez(tt, tRuby + 2, tN), lerp(ORB[1], 300, ez(tt, tRuby + 2, tN)), lerp(3.4, .7, ez(tt, tRuby + 2, lerp(tRuby + 2, tN, .5)))], 3],   // close on the sphere, now sized to the words, so its violet halo and the ruby flame read
      // in close on the two men as the warmth shoots through them, their last time on screen (at 25 px they were specks)
      [C('p126.1:there shot through') - .4, tt => [lerp(470, 500, ez(tt, C('p126.1:there shot through'), tN)), 800, lerp(2.2, 2.4, ez(tt, C('p126.1:there shot through'), tN))], 1.6],
      // 'twice its former size': held on the sphere as it grows; then out over the whole plant, sphere and men in frame, for
      // its speech (at y 160 the sphere was cut by the top of the frame)
      [tN, [PX, ORB[1] + 60, 1.4], 2.5], [T0('O') - 2, [PX, 40, .58], 3], [tP, [PX, -300, .7], 2]]);
    camBegin(...c);
    const { st } = world(t);
    // E: the ball of white force at the storm's centre, jerking at the lightning's touch
    if (st > 0 && t > tE - 2 && t < tF + 1) { const n = Math.floor(t * 3), jx = 30 * (hash(n) - .5), jy = 30 * (hash(n * 3) - .5), b = [ORB[0] + jx, ORB[1] + jy];
      glow(...b, 90 + 30 * Math.sin(t * 9), NRG.white, .9); glow(...b, 260, FORCE, .3 * st);
      if (t > C('p118.1:the lightnings') - .3 && hash(Math.floor(t * 6)) > .45) { boilSeed('lt' + Math.floor(t * 12)); lightning(b[0] + 600 * (hash(n * 7) - .5), -1300, b[0], b[1], NRG.lightning, { amp: .18, r: 60 }); }
      beam(PX, TOP + 10, b[0], b[1], 30, 20, FORCE, 1, { washOp: 30, a: .5 * st, splash: false }); }
    // F to I: the white globe; F-2's probing; the stab; the red beam, shrinking it through orange and green
    // after its stab the globe draws back, up and away; the red beam reaches for where it was, and on 'The sphere leaped
    // forward' it leaps back into the beam, which catches it (the beam had it 4 s early, sitting on the plant)
    const tLeap = C('p121.4:The sphere leaped'), back = ez(t, tStabEnd, tStabEnd + 1.3) * (1 - ez(t, tLeap - .1, tLeap + .35)), orb = [ORB[0] + 330 * back, ORB[1] - 150 * back];
    const g1 = t > tF - 1 && t < tGone + .3, shrink = 1 - .9 * ez(t, tLeap, tGone);
    if (g1) { const r = 20 * shrink * (t < tF ? seg(t, tF - 1, tF) : 1); glow(...orb, r * 3, NRG.white, .6); glow(...orb, r * 1.4, '#FFFDF6', .9);
      if (t > tLeap) for (let i = 0; i < 6; i++) { const a = hash(Math.floor(t * 8) + i) * TAU; boilSeed('spray' + i + Math.floor(t * 12)); lightning(...orb, orb[0] + Math.cos(a) * 300, orb[1] + Math.sin(a) * 300, '#FFE2B0', { amp: .2, r: 30 }); } }
    if (t > tH && t < tStab + .5) thoughtRings(...ORB, t, tH, C('p121.3$'), { r1: 400, col: '#FFFDF6' });
    const f2 = f2At(t);
    if (t > C('p120.1') && t < tH) for (let i = 0; i < 5; i++) { const k = seg(t, C('p120.1') + i * .8, C('p120.1') + i * .8 + 1.2), d = [ORB[0] - 80, ORB[1] + 40 * (i - 2)], turn = t > C('p120.1:seemed baffled') ? 1 : 0;
      ruled([[f2[0] + 50, f2[1]], [lerp(f2[0] + 50, d[0], .5), f2[1]], [lerp(f2[0] + 50, d[0], .5), d[1]], [d[0], d[1] + turn * (i - 2) * 80]], k, FORCE, .6); }
    // the stab: the globe gathers blue-white on 'A stabbing beam', fires on 'flashed out' at where F-2 hung, and F-2 darts
    // clear as it fires; the beam burns on through empty air until the red beam comes (it was on screen for 5 frames)
    if (t > tCharge && t < tStabEnd + .4) { const ch = ez(t, tCharge, tStab) * (1 - ez(t, tStabEnd, tStabEnd + .4)); glow(...ORB, 90 + 60 * ch, '#9DBBFF', .55 * ch); }
    if (t > tStab && t < tStabEnd + .4) { const k = ez(t, tStab, tStab + .12) * (1 - ez(t, tStabEnd, tStabEnd + .4)), fl = .85 + .15 * Math.sin(t * 40), end = [PX - 300 - 520, ORB[1] + 60 + 170];
      beam(...ORB, ...end, 50, 80, '#8FB2FF', k, { washOp: 130, a: .85 * fl }); beam(...ORB, ...end, 18, 30, '#F4F8FF', k, { washOp: 150, a: .8 * fl, splash: false }); }
    if (t > tRed - .2 && t < tGone + .4) { const col = t < tOrange ? '#B23A2A' : t < tGreen ? mixCol('#E8641E', NRG.death, ez(t, tGreen - .35, tGreen)) : NRG.death;   // a true orange, held until 'green'
      // the beam reaches out from the plant toward the sphere where it hangs, and has it once it leaps
      const reach = ez(t, tRed - .2, tRed + 3), end = t < tLeap ? lerpP([PX, TOP], [orb[0] - 40, orb[1] + 30], .25 + .6 * reach) : orb;
      beam(PX, TOP + 20, ...end, 90, 40 * shrink + 24, col, ez(t, tRed - .2, tRed + .3), { washOp: 110, a: .85 }); glow(...end, 60, col, .5); }
    // F-2; C-R-U-1 joining it at dawn
    DES.f2(f2[0], f2[1] + 2.4 * FS, FS, t, { view: 'side' });
    if (t > C('p122.1:C-R-U-1 joined him') - 3) { const k = ez(t, C('p122.1:C-R-U-1 joined him') - 3, C('p122.1:C-R-U-1 joined him') + 1); DES.cru1(lerp(-600, f2[0] - 140, k), f2[1] + 60 + 2.2 * 30, 30, t, { glowK: 1 }); }
    // J: again the lightnings crash on the plant's crown, and titanic forces work and play about it
    if (t > tJ + 1 && t < tK) for (let i = 0; i < 4; i++) glow(ORB[0] + 200 * Math.sin(t * 2 + i), ORB[1] + 120 * Math.cos(t * 1.7 + i), 80, [FORCE, NRG.gold, NRG.violet, FORCE][i], .4 * storm(t));
    const crash = win(t, C('p122.1:the lightnings crashed') - .2, C('p122.1:C-R-U-1 joined him') + 1, .2, 1), play = win(t, C('p122.1:while titanic forces') - .3, C('p122.1:red glory of the sun'), .5, 1.5);
    if (crash > 0 && hash(Math.floor(t * 6) + 50) > .3) { const n = Math.floor(t * 3); boilSeed('lj' + Math.floor(t * 12)); lightning(PX + 900 * (hash(n * 5) - .5), -700, PX + 30 * (hash(n) - .5), TOP + 20, NRG.lightning, { amp: .2, r: 70 }); glow(PX, TOP + 20, 220, NRG.white, .55 * crash); }   // down on the plant's crown
    if (play > 0) for (let i = 0; i < 3; i++) { const a = t * (.9 + .3 * i) + i * 2.1, e = [ORB[0] + 620 * Math.cos(a), ORB[1] - 60 + 320 * Math.sin(a * 1.3)]; beam(PX, TOP + 10, ...e, 20, 40, [FORCE, NRG.violet, NRG.gold][i], play, { washOp: 40, a: .45 * play, splash: false }); glow(...e, 60, [FORCE, NRG.violet, NRG.gold][i], .4 * play); }
    // K on: the golden sphere; Roal and Trest out of the dome; the warmth of the ruby flame
    const gk = ez(t, tGold - 2.2, tGold + .5) * (t < tVanish ? 1 : 0), tTwice = C('p127.1:twice'), grow = .25 * ez(t, C('p126.1') + 2, tTwice - .3) + .75 * ez(t, tTwice - .3, tTwice + 1);   // most of it on 'twice its former size'
    // they stand looking up at the sphere; when the ruby flame warms them, their hands lift toward it, open
    const warm = win(t, tRuby + .5, tN - .5, 1.5, 1), wp = k => ({ up: lerp(.12, .9, k), fore: lerp(.3, 1.7, k) });
    // two coats on each man, so the ruins' rock doesn't show through them as they walk past it (one read as glass)
    if (t > tK) for (let coat = 0; coat < 2; coat++) { stander(t, -260, RG + 40, 30, [[C('p123.1:Roal and Trest appeared'), C('p123.1:Roal and Trest appeared') + 5, -260, 420]], { who: 'roal', key: 'roal9', seed: 3, look: .6, pose: wp(warm) });
      stander(t, -340, RG + 46, 31, [[C('p123.1:Roal and Trest appeared') + .4, C('p123.1:Roal and Trest appeared') + 5.6, -340, 540]], { who: 'trest', key: 'trest9', seed: 7, look: .55, pose: wp(.8 * win(t, tRuby + 1.2, tN - .5, 1.5, 1)) }); }
    if (t > tK) {
      // the dome again, in front: the men are inside it until they walk out
      if (domePart(t) < 1) for (let i = 0; i < 2; i++) DES.blackDome(-300, RG + 60, 320 * (1 - domePart(t) * .9), t); }   // twice: one coat lets the figures show through
    if (gk > 0) { sphereGold(t, GR * gk * (1 + grow)); thoughtRings(...ORB, t, T0('L'), C('p125.1$'), { r1: 600, col: NRG.gold }); thoughtRings(...ORB, t, T0('O'), C('p128.1$'), { r1: 600, col: NRG.gold });
      const ruby = t > tRuby ? Math.max(0, Math.sin((t - tRuby) * 2.2)) * (1 - ez(t, tN - 1, tN)) : 0; if (ruby > 0 || (t > tRuby && t < tN)) { rubyFlame(t, GR * gk * (1 + grow), ruby); glow(...ORB, 900, '#FFC780', .3 * ruby); glow(480, RG - 120, 260, '#FFC780', .35 * ruby); } }   // and its warmth on the men
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
