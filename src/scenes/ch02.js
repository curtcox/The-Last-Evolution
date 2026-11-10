// ch02.js: chapter 2, The Outsiders. It draws script/boards/ch02.yaml; its times are cues against the voice
// (src/gen/ch02.js). Two places: space (the fleet, the transport, the investigators) and the inside of an Outsider
// ship, tracked from its broken hull to its power room; after the scene break, the second ship, darker.
(() => {
  const { D, INK, ez, win, steps, path, ground, cam, withCam, ruled, page, closing, planet } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const K = (t, a, b) => seg(t, C(a), C(b));
  const HEAT = '#FFB070', FORCE = '#CFE0FF';
  const stars = (ox, oy, n = 140, seed = 1, sp = 1) => { for (let i = 0; i < n; i++) { const b = hash(i * 1.3 + seed); glow(((hash(i * 3.1 + seed) * 2600 - ox * sp) % 2600 + 2600) % 2600 - 340, ((hash(i * 7.7 + seed) * 1500 - oy * sp) % 1500 + 1500) % 1500 - 210, 3 + 8 * b * b, '#F4EEDC', .2 + .45 * b); } };
  const dark = (key = 'sp') => ground('#1C1814', 255, key, { fill: '#2A231D', fillOp: 90 });
  // a ship of the void facing left (dir -1) or right (1), turning through a squash
  const ship = (x, y, len, t, dir = -1, o = {}) => { push(); translate(x, y); scale(dir, 1); translate(-x, -y); DES.oShip(x, y, len, t, o); pop(); };

  // ---------- B: from beyond the outermost planet ----------
  function approach(t) {
    HALFTONE = .2;
    const t0 = T0('B'), z = lerp(1, 1.5, ez(t, t0, T1('B')));
    dark('spB'); stars(0, 0, 160, 3, 1);
    camBegin(1300, 480, z);
    glow(2300, 300, 60, '#F4EEDC', .9); glow(2300, 300, 200, '#F4EEDC', .2);   // some other sun
    planet(560, 880, 140, 3, { key: 'outer' });
    const tLine = C('p007.1:First a thin scoutline');
    for (let i = 0; i < 24; i++) { const st = t0 + 2 + i * .45, q = clamp((t - st) / 14); if (q <= 0) continue;
      const x = lerp(2250, 400 + 40 * i, q), y = lerp(310, 520 + 20 * Math.sin(i), q), len = lerp(6, 70 + 30 * hash(i), q * q);
      if (len < 14 || t < tLine - 3) glow(x, y, 6 + len * .2, '#F4EEDC', .7); else ship(x, y, len, t, -1, { d: 3 }); }
    camEnd();
  }
  // ---------- C: torpedoes of the void ----------
  function passing(t) {
    HALFTONE = .25;
    const t0 = T0('C'), q = seg(t, t0 - 1, T1('C') + 1);
    dark('spC'); stars(q * 300, 0, 140, 5, 1);
    for (let i = 0; i < 4; i++) ship(2400 - q * (1700 + i * 200) + i * 500, 300 + i * 90, 300 - i * 50, t, -1, { d: 3 });
    ship(lerp(3000, -1200, q), 640, 2600, t, -1, { d: 2 });
  }
  // ---------- D, E, K, O: the transport, Deimos, the wreck, the swarm ----------
  const TR = [900, 560], DEIMOS = [-1900, 300];
  const tDead = C('p008.1:ceased to radiate'), tGo = C('p008.1:An investigation machine'), tSight = C('p008.1:They sighted ten huge ships'), tBlast = C('p008.1:The entire fore-section');
  function transport(t, o = {}) {
    const alive = 1 - seg(t, tDead, tDead + .6), x = TR[0] - 30 * seg(t, T0('D') - 5, tDead) * (alive > 0 ? 1 : 0);
    DES.mote(x, TR[1], 520, t, { ang: Math.PI, drive: alive > .5 });
    if (alive > 0) glow(x - 230, TR[1] - 10, 30, NRG.white, .6 * alive);
    // the fore-section blasted away: a torn black hole where its nose was, the edges still hot
    const torn = ez(t, tDead - .3, tDead + .3);
    if (torn > 0) { boilSeed('torn'); const P = []; for (let i = 0; i <= 14; i++) { const a = i / 14 * TAU; P.push([x - 210 + Math.cos(a) * (70 + 30 * hash(i)) * torn, TR[1] + Math.sin(a) * (62 + 20 * hash(i * 3)) * torn]); }
      paint(P, { wash: '#1C1814', washOp: 255, ink: INK, sw: .6 }); for (let i = 0; i < 6; i++) glow(P[i * 2][0], P[i * 2][1], 18, HEAT, .5 * (1 - seg(t, tDead, tDead + 30))); }
    if (t > tDead && t < tDead + .5) glow(x - 210, TR[1], 260, NRG.white, 1 - seg(t, tDead, tDead + .5));
    return x;
  }
  function voidWorld(t) {
    HALFTONE = .2;
    const tK = T0('K');
    const c = cam(t, [[0, tt => [lerp(1100, 950, ez(tt, T0('D'), tDead)), 560, 1.15]], [tGo - .5, [DEIMOS[0] + 300, DEIMOS[1] + 100, 1], 1.4],
      [tGo + 2.2, tt => [lerp(DEIMOS[0] + 300, TR[0] + 300, ez(tt, tGo + 2.2, tSight)), lerp(400, 520, ez(tt, tGo + 2.2, tSight)), .9], .01], [tSight, [TR[0] + 500, 480, .75], 2.5],
      [tOut, [TR[0] + 400, 520, .8], .01], [C('p013.1:The Outsider\'s ship nearest'), [TR[0] + 900, 460, 1.3], 4], [T0('O') - 1, tt => [1700, 520, lerp(1, .65, ez(tt, T0('O'), T1('O')))], .01]]);
    dark('void');
    stars(c[0] * .3, c[1] * .3, 160, 7, 1);
    withCam(c, () => {
      if (t < T0('O') - 1) {
        // Earth, far off to the left; the transport's thought running back to it, until it breaks
        glow(-2600, 700, 40, '#F4EEDC', .8);
        if (t < tOut) {
          const tx = transport(t), br = seg(t, tDead, tDead + .3);
          if (t > T0('D') - 1) { const P = []; for (let i = 0; i <= 12; i++) P.push([tx - 260 - i * 260, TR[1] - 10 + (i % 2) * 18]); ruled(P, seg(t, T0('D') - 1, T0('D') + 2), FORCE, .8, br); }
          // the ships: one closing on the transport and grappling it, the others hanging beyond. They come while the camera
          // is at Deimos, so they're first seen when they're sighted: the transport dies to 'some unperceived body' (one
          // was plainly beside it as it died)
          const seen = t > tGo + 1, close = ez(t, tGo + 1, tGo + 2.2);
          if (seen) ship(lerp(2600, TR[0] + 640, close), lerp(300, 420, close), 900, t, -1, { d: 2 });
          if (t > tSight - 6) for (let k = 0; k < 3; k++) { boilSeed('grap' + k); inkLine([[TR[0] + 300 + k * 120, 470], [TR[0] + 80 + k * 70, TR[1] - 30 + k * 18]], .9, INK, 'ink', .3); }
          if (seen) for (let i = 0; i < 9; i++) ship(1700 + i * 260 + 60 * hash(i), 140 + 120 * (i % 3) + 300 * hash(i * 3), 220 + 120 * hash(i * 5), t, -1, { d: 3 });
          // Deimos, and the investigator's streak at a thousand gravities
          planet(DEIMOS[0], DEIMOS[1], 90, 2, { key: 'deimos' });
          const g = seg(t, tGo, tGo + 3.5), gx = lerp(DEIMOS[0] + 90, TR[0] - 200, g * g), gy = lerp(DEIMOS[1] + 20, TR[1] - 20, g * g);
          if (g > 0 && g < 1) { inkLine([[lerp(DEIMOS[0] + 90, gx, .6), lerp(DEIMOS[1] + 20, gy, .6)], [gx, gy]], 1.2, FORCE, 'inkfine', 0); glow(gx, gy, 16, NRG.white, .9); }
          if (g >= 1 && t < T0('F')) glow(TR[0] - 200, TR[1] - 20, 10, NRG.white, .8);
        } else {
          // K: the wreck spreading where the transport was; the nearest ship holed; the second investigator going in
          const age = t - tOut;
          for (let i = 0; i < 40; i++) { const a = hash(i) * TAU, r = (60 + 400 * hash(i * 3)) * Math.min(1, age / 12 + .2), x = TR[0] + 300 + Math.cos(a) * r * 1.4, y = TR[1] + Math.sin(a) * r * .8;
            boilSeed('deb' + i); push(); translate(x, y); rotate(age * (hash(i * 5) - .5)); wash(rectPts(-10 - 20 * hash(i), -6, 20 + 40 * hash(i), 12 + 10 * hash(i * 7)), 2 + (i % 3), { ink: true, sw: .4 }); pop(); }
          glow(TR[0] + 300, TR[1], 300, NRG.white, .3 * (1 - seg(age, 0, 6)));
          const hx = TR[0] + 1100, hy = 380; ship(hx, hy, 1100, t, -1, { d: 2 });
          boilSeed('hole'); paint(ellPts(hx - 60, hy + 40, 90, 60, 16, 14), { wash: '#1C1814', washOp: 255, ink: INK, sw: .6 }); glow(hx - 60, hy + 40, 60, HEAT, .3);
          const tIn = C('p013.1:entered the broken side'), g = ez(t, tIn - 4, tIn + .5), gx = lerp(-200, hx - 60, g), gy = lerp(900, hy + 40, g);
          if (g > 0 && g < 1) glow(gx, gy, 14, NRG.white, .9);
          for (let i = 0; i < 6; i++) ship(2300 + i * 300, 100 + 150 * (i % 3), 260, t, -1, { d: 3 });
        }
      } else {
        // O: the fleet in a swarm of thousands, turning for Earth
        const turn = ez(t, C('p017.1:they started at once for Earth') - 1, C('p017.1:they started at once for Earth') + 3);
        for (let i = 0; i < 10; i++) { const x = 700 + (i % 5) * 560 + 80 * hash(i), y = 250 + Math.floor(i / 5) * 420 + 60 * hash(i * 3), d = Math.cos(Math.PI * turn) * -1;
          ship(x - 300 * turn, y, 480, t, Math.abs(d) < .15 ? .15 * Math.sign(d || 1) : d, { d: 3 }); }
        // the swarm: the far ones flecks, darting round faster than anything in the sky; the near ones drawn as the tiny
        // machines they are, each with its drive lit (as still white flecks alone they read as more stars)
        for (let i = 0; i < 300; i++) { const a = hash(i * 1.7) * TAU + t * (.15 + .25 * hash(i)), r = 300 + 1500 * hash(i * 2.3); glow(1700 + Math.cos(a) * r * 1.3, 520 + Math.sin(a) * r * .55, 7, NRG.white, .5); }
        for (let i = 0; i < 70; i++) { const sp = (.2 + .25 * hash(i * 5.3)) * (i % 2 ? 1 : -1), a = hash(i * 3.9) * TAU + t * sp, r = 350 + 1300 * hash(i * 6.1), x = 1700 + Math.cos(a) * r * 1.3, y = 520 + Math.sin(a) * r * .55;
          DES.investigator(x, y, 13 + 9 * hash(i * 8.3), t); glow(x, y, 26, NRG.white, .55); }   // the spheres we followed through the ship (drawn as capsules, they read as the wreck's debris)
      }
    });
  }

  // ---------- F to N: inside the ships ----------
  const FL = 880, CEIL = 200;
  function hull(second) {
    stillSeed(second ? 'hull2' : 'hull1'); paint(rectPts(-800, -700, 6000, 2600), { wash: second ? '#2A231D' : D[3], washOp: 255, fill: '#1C1814', fillOp: 120, bleed: .2, tex: .4, ink: null });
    stillSeed('walls' + second);
    wash([[-400, CEIL - 300], [4600, CEIL - 300], [4600, CEIL], [-400, CEIL]], 4, { op: 1 });
    wash([[-400, FL], [4600, FL], [4600, 1400], [-400, 1400]], second ? 4 : 3, { op: 1 });
    for (let x = -300; x < 4600; x += 420) { stillSeed('rib' + x + second); wash([[x - 40, CEIL], [x + 40, CEIL], [x + 60, FL], [x - 60, FL]], second ? 4 : 3, { ink: true, sw: .5, op: .9 }); inkLine([[x - 40, CEIL + 40], [x + 40, CEIL + 40]], .5, INK); }
    for (let k = 0; k < 3; k++) inkLine([[-400, CEIL + 180 + k * 220], [4600, CEIL + 190 + k * 220]], .4, D[4]);
    inkLine([[-400, 760], [4600, 760]], 1.2, INK);   // the girder the investigator creeps along
  }
  // a pool of light from the hull's lamps, behind and under the Outsiders so their grey wash reads against it
  function lamp(x, r, k = 1) { glow(x, FL - 260, r, '#E8DCC4', .3 * k); glow(x, FL - 40, r * .6, '#E8DCC4', .25 * k); stillSeed('pool' + x); paint(ellPts(x, FL + 10, r * .9, r * .12, 20), { wash: '#C9BCA4', washOp: 70 * k, ink: null, bleed: .3 }); }
  // the investigator, its lens dark once it's blanked
  function inv(x, y, t, blank = 0) { DES.investigator(x, y, 20, t); if (blank < 1) glow(x + 2, y - 5, 18, NRG.white, .5 * (1 - blank)); }
  function crawler(x, t, i, o = {}) { const g = o.g ?? FL, bob = 4 * Math.abs(Math.sin(t * 3 + i)); push(); translate(x, g - bob); rotate(o.rot || 0); translate(-x, -(g - bob)); DES.outsider(x, g - bob, (o.s || 34) * 1.6, t, { view: o.view || 'side', turn: o.turn ?? .08 * Math.sin(t * .7 + i) }); pop(); }
  const tJ = T0('J'), tLast = C('p013.1:the last plunger snapped shut'), tBoom = C('p013.1:Instantly the vast energies');
  // out of the white, outside: the transport blowing apart while the narrator says so (the white held 8 s when it
  // waited for K)
  const tOut = tBoom + 1.2;
  function ship1(t) {
    HALFTONE = .3;
    const tH = T0('H'), tHit = C('p011.1:crashing against'), tTumble = C('p011.1:he fell end over end'), tI = T0('I');
    // the investigator's path: in at the torn fore, along the girder, at the Outsider, then off to the power room
    const ip = path(t, [[0, [180, 760]], [T0('F'), [900, 760], 8], [tH, [1180, 700], 1.4], [tHit - .4, [1340, 760], .5], [tI, [2950, 640], 5], [C('p013.1:relayed the control signals'), [3050, 560], 2]]);
    const c = cam(t, [[0, tt => [lerp(300, 820, ez(tt, T0('F'), T0('G'))), 700, 1.8]], [T0('G'), tt => [lerp(1100, 1300, ez(tt, T0('G'), tH)), 720, lerp(1.3, 2.3, ez(tt, C('p010.1:Their eyes projected') - 1, tH))], 2.5],
      [tH, [1350, 700, 1.4], 1.2], [tTumble, tt => [lerp(1400, 1800, ez(tt, tTumble, tI)), 640, 1.2], 2], [tI, tt => [lerp(1900, 2900, ez(tt, tI, tJ)), 640, 1.4], 1.5], [tJ, tt => [3250, 600, lerp(1.1, 1.6, ez(tt, tLast - 2, tBoom))], 2]]);
    withCam(c, () => {
      hull(false);
      // the torn fore, its plates' edges still hot from the fusing ray
      boilSeed('fore'); const P = [[-400, CEIL - 100], [120, CEIL - 100], [60, 380], [160, 520], [40, 700], [140, FL + 80], [-400, FL + 80]]; paint(P, { wash: '#1C1814', washOp: 255, ink: INK, sw: 1 });
      P.slice(1, 6).forEach(([x, y], i) => glow(x, y, 40, HEAT, .4 + .2 * Math.sin(t * 2 + i)));
      for (let i = 0; i < 40; i++) glow(-300 + hash(i) * 380, CEIL + hash(i * 3) * 700, 4, '#F4EEDC', .5);
      // the Outsiders crawling through (G), one close; the one struck tumbling end over end (H), unhurt; spaced so each
      // reads on its own, in the lamps' light (the third, swaying to 1230, walked into the close one's arm at 1400)
      lamp(950, 520); lamp(1650, 620);
      // depth: the three on the far floor, the close one on the near, so his size reads as nearness, not as a giant
      const FAR = FL - 50, NEAR = FL + 50;
      // they crawl in on 'Strange life-forms were crawling about the ship' (in full view 12 s before, the reveal was lost)
      const tLife = C('p010.1:Strange life-forms'), inK = ez(t, tLife - 1, tLife + 3), off = 1100 * (1 - inK);
      // each about its own business: one scuttling along the floor and back, one up a rib of the hull, one along a pipe overhead
      if (t > tLife - 1) { crawler(1015 + 115 * Math.sin((t - tLife) * .45) + off, t, 0, { s: 34, g: FAR, turn: Math.cos((t - tLife) * .45) > 0 ? 0 : .5 });
        const rib = frac((t - tLife) * .05), ry = lerp(FAR, 330, rib); crawler(650 + off * 1.15, t, 1, { s: 26, g: ry, rot: -Math.PI / 2 });
        crawler(1170 - 280 * frac((t - tLife) * .06) + off * 1.3, t, 2, { s: 20, g: 500, turn: .5 }); }
      const tum = seg(t, tTumble - .6, tTumble + 4), struck = t > tHit;
      const sx = (struck ? lerp(1400, 1820, ease(tum)) : 1400) + off * 1.4, rot = struck ? -TAU * easeOut(tum) : 0, lift = struck ? 160 * Math.sin(Math.PI * tum) : 0;   // a whole turn: he lands on his feet, unhurt (a turn and a half left him upside down)
      if (t > tLife - 1) { push(); translate(sx, NEAR - 80 - lift); rotate(rot); translate(-sx, -(NEAR - 80 - lift));
      DES.outsider(sx, NEAR - lift, 66, t, { view: struck && tum < 1 ? 'side' : 'front', turn: steps(t, [[0, 0], [C('p010.1:Their eyes projected'), .33, 1.2], [C('p010.1:capable of movement'), .66, 1.2], [C('p010.1:and there were three'), 1, 1.2]]) });
      pop(); }
      if (t > tHit && t < tHit + .3) glow(1360, 720, 120, NRG.white, 1 - seg(t, tHit, tHit + .3));
      // the others clustering round him (I)
      for (let i = 0; i < 2; i++) if (t > tI - 1) crawler(lerp(1100, i ? 2080 : 1560, ez(t, tI - 1, tI + 4)), t, 5 + i, { s: 32, g: NEAR - 25 });
      // J: the power room: the plungers over their sockets, the ship-brain shattered; the signals; the plungers shutting
      boilSeed('brain'); wash(ellPts(3720, 520, 120, 90, 18, 30), 3, { ink: true, sw: .7 }); for (let k = 0; k < 6; k++) inkLine([[3720, 520], [3720 + Math.cos(k) * 120, 520 + Math.sin(k) * 90]], .6, INK);
      const tSig = C('p013.1:relayed the control signals');
      const tSnap = C('p013.1:snapped shut') - .08;   // the last plunger snaps on its word; the first five shut from 'Quickly' up to 'the last plunger'
      for (let i = 0; i < 6; i++) { const x = 2950 + i * 120, s0 = i === 5 ? tSnap : lerp(C('p013.1:Quickly they were'), tLast - .3, i / 4), shut = ez(t, s0, s0 + (i === 5 ? .15 : .5));
        boilSeed('pl' + i); wash(rrPts(x - 26, FL - 90, 52, 90, 6), 4, { ink: true, sw: .6 }); wash(rrPts(x - 14, lerp(380, FL - 330, shut), 28, 240, 6), 1, { ink: true, sw: .6, op: 1 });
        wash(rrPts(x - 30, lerp(360, FL - 350, shut), 60, 26, 6), 2, { ink: true, sw: .6 });
        if (t > tSig) ruled([[ip[0], ip[1]], [x, ip[1]], [x, lerp(370, FL - 345, shut)]], seg(t, tSig + i * .3, tSig + i * .3 + .8), FORCE, .6); }
      inv(ip[0], ip[1], t);
    });
    if (t > tBoom - .2) flash(seg(t, tBoom - .2, tBoom + .4), '#FFF6E8');
  }
  function ship2(t) {
    HALFTONE = .3;
    const tL = T0('L'), tM = T0('M'), tN = T0('N'), tBeam = C('p016.1:A bluish beam'), tBlank = C('p016.1:went blank'), HIDE = [2520, 472], FOUND = [2520, 548];   // in among the overhead pipes, then just under them
    const ip = path(t, [[0, [-200, 700]], [tL, [1900, 700], 3.5], [C('p014.1:It was soon seen') - 1, [2150, 640], 2], [tM, HIDE, 2], [tN - 1.5, FOUND, 1.2]]);
    const c = cam(t, [[0, tt => [lerp(0, 1900, ez(tt, tL, tL + 3.5)), 640, 1.3]], [C('p014.1:It was soon seen') - 1.5, [2150, 620, 1.2], 2], [tM, tt => [lerp(2350, 2900, ez(tt, C('p015.1:And in the meantime'), C('p015.1:disintegrating') + 1)), 620, 1.15], 2.5],
      [tN, tt => [lerp(2700, 2560, ez(tt, tN, tBeam)), 620, lerp(1.6, 2.6, ez(tt, tBeam, tBlank))], 2]]);
    withCam(c, () => {
      hull(true);
      // speed lines in the corridor as it flashes along
      if (t < tL + 4) for (let i = 0; i < 8; i++) { boilSeed('spd' + i); const y = 300 + i * 70; inkLine([[ip[0] - 300 - 200 * hash(i), y], [ip[0] - 60, y]], .5, D[1], 'inkfine', 0); }
      // the apparatus room: a few dim, simple machines
      for (let i = 0; i < 4; i++) { const x = 1950 + i * 150; boilSeed('app' + i); wash(rrPts(x - 50, FL - 160, 100, 160, 8), 3, { ink: true, sw: .6 }); glow(x, FL - 120, 10, '#F4EEDC', .25 + .15 * Math.sin(t + i)); }
      // pipes, where it hides: a bundle of overhead conduits, drawn over it (below) so it's hidden till it's found
      const pipes = () => { for (let k = 0; k < 4; k++) { stillSeed('pipe' + k); const P = rrPts(2280, 436 + k * 19, 560, 19, 8); paint(P, { wash: D[0], washOp: 255, ink: null }); wash(P, 3 + (k % 2), { ink: true, sw: .6 }); } };   // an opaque base: a wash alone let it show through
      // the heart of the ship: a block of matter wasting away into light
      const melt = .2 + .7 * seg(t, tM - 10, DUR);
      boilSeed('heart'); wash(rrPts(3150, 380, 300, 460, 20), 4, { ink: true, sw: .8 });
      const bh = 200 * (1 - melt * .5); wash(rectPts(3240, 620 - bh / 2, 120, bh), 2, { ink: true, sw: .5 });
      glow(3300, 620, 200, NRG.white, .4 + .1 * Math.sin(t * 5)); for (let i = 0; i < 10; i++) { const q = frac(t * .5 + i / 10); glow(3300 + (hash(i) - .5) * 120, 620 - bh / 2 - q * 180, 12 * (1 - q), NRG.white, .8 * (1 - q)); }
      // the searchers (M); the one with the projector (N)
      lamp(2560, 560); lamp(2720, 420, .6);
      const tSearch = C('p015.1:They searched');
      // three searching, each swaying ±25 round its own spot, with a gap at 2750 where the one with the projector comes
      // (swaying wider round closer spots, they walked through each other and read as one drawn twice)
      const SPOT = [2240, 2540, 2990];
      // searching: each hurries between spots, turning as it goes, stopping to look (they faced the camera, still, for a minute)
      // he comes in on 'appeared armed', carrying it (he stood there holding it from the start of the shot); the searchers
      // stand aside to the left for him and watch, so the one who fires stands clear of them (the third stepped right,
      // into his path, and he walked through it), making way before he gets there
      const tArmed = C('p016.1:appeared armed'), aside = ez(t, tArmed - 3.4, tArmed - .6), ASIDE = [1960, 2220, 2480];
      for (let i = 0; i < 3; i++) if (t > tL + 5) { const ph = (t - tSearch) * .35 + i * 2.1, dx = (70 * Math.sin(ph) + 25 * Math.sin(ph * 2.7)) * (1 - aside), moving = aside < .5 && Math.abs(Math.cos(ph)) > .35;
        crawler(lerp(SPOT[i], ASIDE[i], aside) + dx, t, 10 + i, { s: 34, view: moving ? 'side' : 'front', turn: aside > .5 ? .4 : .25 * Math.sin(t * .9 + i) }); }
      if (t > tArmed - 1.6) { const ox = lerp(3250, 2750, ez(t, tArmed - 1.6, tArmed + .6)), aim = ez(t, tArmed + .6, tBeam - .3);
        // the projector swings up to the investigator, and the beam runs from its tip (it pointed down, away, and the
        // beam was a run of near-white dots from his chest)
        const pa = lerp(-.3, Math.atan2(FL - 110 - FOUND[1], ox - 40 - FOUND[0]), aim), tip = [ox - 40 - 70 * Math.cos(pa), FL - 110 - 70 * Math.sin(pa)];
        DES.outsider(ox, FL, 66, t, { view: 'side', turn: .5 }); boilSeed('proj'); push(); translate(ox - 40, FL - 110); rotate(pa); wash(rrPts(-70, -10, 80, 20, 6), 4, { ink: true, sw: .6 }); pop();
        const bk = seg(t, tBeam, tBeam + .25) * (1 - seg(t, tBlank + 1, tBlank + 1.5));
        if (bk > 0) { beam(tip[0], tip[1], ip[0] + 20, ip[1], 10, 24, NRG.projector, bk, { washOp: 160, a: .9 }); glow(...tip, 40, NRG.projector, .8 * bk); glow(ip[0] + 10, ip[1], 70, NRG.projector, .7 * bk); } }
      inv(ip[0], ip[1], t, seg(t, tBlank - .2, tBlank + .2));
      pipes();
    });
  }

  function scenes(t) {
    const tB = T0('B'), tC = T0('C'), tD = T0('D'), tF = T0('F'), tK = T0('K'), tL = T0('L'), tO = T0('O');
    if (t < tB) return page(t, 'The Outsiders', 'Then came the Outsiders. Whence they came, neither machine nor man ever learned...', tB, { soak: '#1C1814' });
    if (t < tC - .6) return approach(t);
    if (t < tC + .6) return dissolve(seg(t, tC - .6, tC + .6), () => approach(t), () => passing(t));
    if (t < tD - .6) return passing(t);
    if (t < tD + .6) return dissolve(seg(t, tD - .6, tD + .6), () => passing(t), () => voidWorld(t));
    if (t < tF - .6) return voidWorld(t);
    if (t < tF + .6) return dissolve(seg(t, tF - .6, tF + .6), () => voidWorld(t), () => ship1(t));
    if (t < tOut) return ship1(t);
    if (t < tOut + 1.5) { voidWorld(t); flash(1 - seg(t, tOut, tOut + 1.5), '#FFF6E8'); return; }
    if (t < tL - .3) { voidWorld(t); if (t > tL - .6) brushWipe((t - (tL - .6)) / .6, [PULP.w[4], PULP.w[3]]); return; }
    if (t < tO - .6) { ship2(t); if (t < tL + .3) brushWipe(.5 + (t - (tL - .3)) / .6, [PULP.w[4], PULP.w[3]]); return; }
    if (t < tO + .6) return dissolve(seg(t, tO - .6, tO + .6), () => ship2(t), () => voidWorld(t));
    voidWorld(t); closing(t);
  }
  // the story's own footnotes (PLAN.md §5), lettered at the foot of the frame for 5 s from the word that carries the mark
  const NOTES = [['p007.1:kill-ads', '1', ['Kilad\u2014unit introduced by the machines. Based on the', 'duodecimal system, similarly introduced, as more', 'logical, and more readily used. Thus we would have',
    'said 1728 kilads, about 1/2 mile.']],
    ['p008.1:thousand units', '2', ['One unit was equal to one earth-gravity.']]];
  function footnotes(t) {
    for (const [at, n, lines] of NOTES) { const t0 = C(at) + .5, a = win(t, t0, t0 + 1.8 + .22 * lines.join(' ').split(' ').length, .4, .6); if (a <= 0) continue;   // long enough to read: ~9 s for footnote 1's 33 words
      const y = H - 40 - 62 * lines.length;   // 52 px: read in a phone-width player (at 40 it was ~5 px tall at 375 px wide)
      stillSeed('fnband' + n); paint(rectPts(90, y - 60, 1400, 62 * lines.length + 50), { wash: '#141110', washOp: 190 * a, ink: null, bleed: .05 });   // a dark band, so the note reads over a pale hull
      rule(120, y - 36, 260, '#EFE6D2', 1.4);
      letter(n, 126, y - 10, 26, '#EFE6D2', { screen: true, align: 'left', font: `700 26px ${SERIF}`, alpha: a });
      lines.forEach((l, i) => letter(l, 152, y + i * 62, 52, '#EFE6D2', { screen: true, align: 'left', font: `52px ${SERIF}`, alpha: a })); }
  }
  function film(t) { scenes(t); footnotes(t); }
  shots([[0, film]]);
})();
