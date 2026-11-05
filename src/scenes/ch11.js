// ch11.js: chapter 11, Five Great Years: the closing frame. It draws script/boards/ch11.yaml; its times are cues against
// the voice (src/gen/ch11.js). It closes what chapter 0 opens: F-2 among the beings of force (the only full colour),
// its record carried back through the past, and the magazine's page, ending.
(() => {
  const { D, INK, ez, win, steps, talk, ground, cam, page, planet, ruled } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const F2 = [960, 560], FS = 40, SHEET = [1180, 470, 300, 380];
  const HUES = ['#B48CFF', '#FFC766', '#FF8FA8', '#7FE0D0', '#9CC8FF', '#FFE08A', '#D6A0FF'];
  // a being of force, as in chapter 0: a core, a halo and filaments, in its own colour
  function being(x, y, r, col, t, i, a = 1) {
    glow(x, y, r * 3, col, .35 * a); glow(x, y, r * 1.4, col, .7 * a); glow(x, y, r * .5, '#FFFDF6', .8 * a);
    for (let k = 0; k < 3; k++) { const P = []; for (let j = 0; j <= 8; j++) { const q = j / 8, ang = k * 2.1 + t * .3 + i + q * 2.4; P.push([x + Math.cos(ang) * r * (1 + q * 2.2), y + Math.sin(ang) * r * (1 + q * 2.2) * .7]); }
      boilSeed('fil' + i + k); inkLine(P, .5, mixCol(col, '#FFFDF6', .3), 'inkfine', .5); }
  }
  const stars = (n, seed, ox = 0, oy = 0) => { for (let i = 0; i < n; i++) { const b = hash(i * 1.3 + seed); glow(960 + (hash(i * 3.1 + seed) - .5) * 4200 - ox, 540 + (hash(i * 7.7 + seed) - .5) * 2600 - oy, 3 + 8 * b * b, '#F4EEDC', .2 + .45 * b); } };
  const dark = key => ground('#1A1612', 255, key, { fill: '#262019', fillOp: 90 });

  // B: the fleet going; C: the years; D: the system of force
  function system(t) {
    HALFTONE = .2;
    const tB = T0('B'), tC = T0('C'), tD = T0('D'), years = ez(t, tC, tD + 2);
    dark('sys'); stars(160, 11);
    if (t < tC + 1) { const q = ez(t, tB, tC + 1); for (let i = 0; i < 9; i++) { const x = lerp(700 + (i % 3) * 90, 1700, q) + (i % 3) * 10 * (1 - q), y = lerp(420 + Math.floor(i / 3) * 70, 300, q); if (q < .95) DES.oShip(x, y, 300 * (1 - q * .9), t, { d: 3 }); else glow(1700, 300, 4, '#F4EEDC', .6); } return; }
    const z = lerp(1, .8, years) * lerp(1, 1.6, ez(t, tD, T1('D')));
    camBegin(960, 540, z);
    glow(960, 540, 90, '#FFF6E8', .9); glow(960, 540, 260, '#FFF6E8', .25);   // the sun
    const spin = (t - tC) * (.2 + 3 * years);
    [[140, 10], [220, 16], [310, 18], [400, 14], [560, 50], [720, 42], [860, 30], [980, 28]].forEach(([R, r], i) => {
      const a = spin / (1 + i * .6) + i, x = 960 + Math.cos(a) * R, y = 540 + Math.sin(a) * R * .45;
      boilSeed('orb' + i); inkLine([...Array(49)].map((_, k) => [960 + Math.cos(k / 48 * TAU) * R, 540 + Math.sin(k / 48 * TAU) * R * .45]), .4, D[3], 'inkfine', .5);
      planet(x, y, r, 2, { key: 'p11' + i });
      // the beings of force round every world (D on)
      const n = Math.floor(6 * ez(t, tD - 1, tD + 3)); for (let k = 0; k < n; k++) { const b = k * 1.7 + t * (.5 + hash(k + i)), rr = r * 2 + 20 + 30 * hash(k * 3 + i); being(x + Math.cos(b) * rr, y + Math.sin(b) * rr * .7, 6 + 6 * hash(k + i * 7), HUES[(k + i) % HUES.length], t, i * 10 + k, .9); } });
    camEnd();
  }
  // E to G: F-2 old among the beings; the record; carried back; oblivion
  function frame(t) {
    HALFTONE = .2;
    const tE = T0('E'), tF = T0('F'), tCarry = C('p136.1:carried back through the past'), tG = T0('G'), tDim = C('p137.1:Time has worn me');
    const take = ez(t, tF, tCarry), out = ez(t, tCarry, tCarry + 3);
    const c = cam(t, [[0, [F2[0] + 100, F2[1] - 20, 1.3]], [tF, [F2[0] + 200, F2[1] - 40, 1.5], 2.5], [tG, tt => [F2[0], F2[1], lerp(1.6, .9, ez(tt, tG, T1('G')))], 2.5]]);
    dark('frame11');
    camBegin(...c);
    stars(180, 2);
    for (let i = 0; i < 18; i++) { const a = hash(i * 5) * TAU + t * (.02 + .03 * hash(i)), R = 380 + 900 * hash(i * 3); being(F2[0] + Math.cos(a) * R * 1.4, F2[1] + Math.sin(a) * R * .6, 18 + 34 * hash(i * 7), HUES[i % HUES.length], t, i); }
    // the sheets, written full; taken into the being that carries them
    const shk = 1 - take;
    if (shk > 0) for (let i = 2; i >= 0; i--) { const [x, y, w, h] = SHEET, dx = i * 46, dy = -i * 30;
      boilSeed('sheet' + i); paint(rectPts(x + dx, y + dy, w * shk, h * shk), { wash: mixCol(D[0], '#C9C2B4', .5), washOp: 230, fill: D[1], fillOp: 50, bleed: .05, ink: INK, sw: .6 });
      if (i === 0) for (let r = 0; r < 12; r++) ruled([[x + 30, y + 40 + r * 27], [x + 30 + 240 * shk, y + 40 + r * 27]], 1, INK, .7); }
    if (t > tF - 2 && out < 1) { const k = ez(t, tF - 2, tF + 1), bx = lerp(1900, SHEET[0] + 150, k) + 1600 * out * out, by = lerp(200, SHEET[1] + 190, k) - 900 * out * out; being(bx, by, 40 + 20 * take, '#FFE08A', t, 77, 1); }
    // F-2 dimming into oblivion
    const dim = 1 - ez(t, tDim, C('p137.1$') + 1.5);
    glow(F2[0], F2[1], 120, '#E6EEFF', .2 * dim);
    DES.f2(F2[0], F2[1], FS, t, { age: 1, hover: 0 });
    glow(F2[0] + 4.2 * FS * .4, F2[1] - FS * .1, 14, '#E6EEFF', (.3 + .5 * talk(t, 'narrator')) * dim);
    camEnd();
  }
  // F: the tunnel of light back through the past, to a small Earth
  function tunnel(t) {
    HALFTONE = .15;
    const tCarry = C('p136.1:carried back through the past'), q = seg(t, tCarry, T0('G'));
    dark('tun');
    for (let i = 0; i < 40; i++) { const d = frac(i / 40 + q * 2), r = 40 + 1400 * d * d, a = i * 2.4 + q * 6; boilSeed('ring' + i); inkLine([...Array(33)].map((_, k) => [960 + Math.cos(k / 32 * TAU + a) * r, 540 + Math.sin(k / 32 * TAU + a) * r * .6]), .6 + d, mixCol('#1A1612', '#EFE6D2', d), 'inkfine', .5); }
    planet(960, 540, 30 + 60 * q, 1, { key: 'oldearth', glow: '#F4EEDC', ga: .3 });
    glow(960, 540 - 300 * (1 - q), 30, '#FFE08A', .9); glow(960, 540 - 300 * (1 - q), 100, '#FFE08A', .4);
  }
  // H to J: the page, and THE END. Its paragraph is the one being read: p138, then p139 (which it used to sit through
  // still showing p138), then the last
  const PARAS = ['This I have treated as fictitious. Better so—for man is an animal to whom hope is as necessary as food and air. Yet this which is made of excerpts from certain records on thin sheets of metal is no fiction, and it seems I must so say.',
    'It seems now, when I know this that is to be, that it must be so, for machines are indeed better than man, whether being of Metal, or being of Force.',
    'So, you who have read, believe as you will. Then think—and maybe, you will change your belief.'];
  function pageEnd(t, para = 2) {
    HALFTONE = 0;
    const tH = T0('H'), tJ = T0('J'), k = seg(t, tH, DUR);
    camBegin(W / 2, lerp(H / 2 - 40, H / 2 + 10, ease(k)), lerp(1, 1.08, ease(k)));   // the push keeps the running head in frame
    const fade = 1 - ez(t, tJ - 1, tJ + .5);
    letter('THE LAST EVOLUTION', W / 2, 150, 28, INK, { ink: false, font: `700 28px ${SERIF}`, spacing: 4, alpha: .8 * fade });
    if (fade > 0) rule(560, 180, 800, INK, fade);   // the head's rule goes with it, not left orphaned
    dropCapPara(PARAS[para], 460, 380, 1000, { size: 44, lines: 6, screen: false });
    const e = ez(t, tJ, tJ + 2);
    letter('THE END', W / 2, 760, 90, INK, { ink: false, font: `700 90px ${SERIF}`, spacing: 10, alpha: e });
    if (e > 0) rule(810, 830, 300, INK, e);
    camEnd();
    flushLetters();
  }

  function film(t) {
    const tB = T0('B'), tE = T0('E'), tF = T0('F'), tCarry = C('p136.1:carried back through the past'), tG = T0('G'), tH = T0('H');
    if (t < tB) return page(t, 'Five Great Years', 'The Outsiders left, going out across the void, and they have not returned.', tB, { soak: '#1A1612' });
    if (t < tE - .8) return system(t);
    if (t < tE + .6) return dissolve(seg(t, tE - .8, tE + .6), () => system(t), () => frame(t));
    if (t < tCarry + .5) return frame(t);
    if (t < tCarry + 1.5) return dissolve(seg(t, tCarry + .5, tCarry + 1.5), () => frame(t), () => tunnel(t));
    if (t < tG - .5) return tunnel(t);
    if (t < tG + .5) return dissolve(seg(t, tG - .5, tG + .5), () => tunnel(t), () => frame(t));
    if (t < tH - 1.5) return frame(t);
    if (t < tH + .5) return dissolve(seg(t, tH - 1.5, tH + .5), () => frame(t), () => pageEnd(t, 0));
    const tI = T0('I'), tP = C('p139.1');
    if (t < tP - .8) return pageEnd(t, 0);
    if (t < tP + .4) return dissolve(seg(t, tP - .8, tP + .4), () => pageEnd(t, 0), () => pageEnd(t, 1));
    if (t < tI - .8) return pageEnd(t, 1);
    if (t < tI + .4) return dissolve(seg(t, tI - .8, tI + .4), () => pageEnd(t, 1), () => pageEnd(t));
    pageEnd(t);
    if (t > DUR - 2) flash(seg(t, DUR - 2, DUR), PULP.paper);
  }
  shots([[0, film]]);
})();
