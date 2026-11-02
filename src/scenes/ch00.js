// ch00.js: chapter 0, The Record: the title page and the preamble. It draws script/boards/ch00.yaml; its times are
// cues against the voice (src/gen/ch00.js). The frame of the film: F-2, the narrator, a hundred and twenty-five
// thousand years on, among the beings of force (the only full colour, PLAN.md §5), remembering 2538 in grey.
(() => {
  const { D, INK, ez, win, steps, talk, ground, cam, withCam, ruled, closing } = KIT;
  const S = CHAPTER.shots, C = cue, T0 = id => S[id][0], T1 = id => S[id][1];
  const F2 = [960, 560], FS = 40;
  // the beings of force: soft lights in every colour, drifting on slow orbits; each a core, a halo and filaments
  const HUES = ['#B48CFF', '#FFC766', '#FF8FA8', '#7FE0D0', '#9CC8FF', '#FFE08A', '#D6A0FF'];
  function being(x, y, r, col, t, i, a = 1) {
    glow(x, y, r * 3, col, .35 * a); glow(x, y, r * 1.4, col, .7 * a); glow(x, y, r * .5, '#FFFDF6', .8 * a);
    for (let k = 0; k < 3; k++) { const P = []; for (let j = 0; j <= 8; j++) { const q = j / 8, ang = k * 2.1 + t * .3 + i + q * 2.4; P.push([x + Math.cos(ang) * r * (1 + q * 2.2), y + Math.sin(ang) * r * (1 + q * 2.2) * .7]); }
      boilSeed('fil' + i + k); inkLine(P, .5, mixCol(col, '#FFFDF6', .3), 'inkfine', .5); }
  }
  const beingAt = (t, i) => { const a = hash(i * 5) * TAU + t * (.02 + .03 * hash(i)), R = 380 + 900 * hash(i * 3); return [F2[0] + Math.cos(a) * R * 1.4, F2[1] + Math.sin(a) * R * .6, 18 + 34 * hash(i * 7)]; };

  // the memories: the Denver hall's piers, a ring of machines, the chief ruler, Roal and Trest, in grey wash
  function memories(k, t) {
    if (k <= 0) return;
    boilSeed('memhall');
    for (let i = 0; i < 6; i++) { const x = 300 + i * 270; wash(rectPts(x - 26, 120, 52, 760), 1, { op: .55 * k }); for (let f = -1; f <= 1; f++) inkLine([[x + f * 12, 130], [x + f * 12, 870]], .4, D[2]); }
    wash(rectPts(200, 100, 1520, 40), 2, { op: .5 * k });
    for (let i = 0; i < 5; i++) { const x = 420 + i * 270, s = 20 + (i % 2) * 4; if (i !== 2) DES.machine(x, 900, s, t, { arms: 3, d: 2, label: null, hover: 1.5 + .2 * wob(t, .2, i) }); }
    DES.cr21(960, 900, 26, t, { label: null });
    DES.person(640, 960, 110, t, { who: 'roal' }); DES.person(1280, 960, 110, t, { who: 'trest' });
  }
  // the mentatype's sheets, and the lines F-2's beam rules on the nearest
  const SHEET = [1180, 470, 300, 380];
  function mentatype(t, k) {
    if (k <= 0) return;
    for (let i = 2; i >= 0; i--) { const [x, y, w, h] = SHEET, dx = i * 46, dy = -i * 30 + 4 * wob(t, .1, i);
      boilSeed('sheet' + i); paint(rectPts(x + dx, y + dy, w, h), { wash: mixCol(D[0], '#C9C2B4', .5), washOp: 230 * k, fill: D[1], fillOp: 50 * k, bleed: .05, ink: INK, sw: .6 }); }
    const w0 = C('p002.1:So I am') + .4, wk = seg(t, w0, w0 + 7);
    for (let r = 0; r < 12; r++) { const y = SHEET[1] + 40 + r * 27, rk = clamp(wk * 12 - r); if (rk <= 0) break;
      const P = [[SHEET[0] + 30, y]]; for (let j = 1; j <= 8; j++) P.push([SHEET[0] + 30 + j * 30, y + (hash(r * 9 + j) > .6 ? -5 : 0)]);
      boilSeed('row' + r); ruled(P, rk, INK, .7); }
    if (wk > 0 && wk < 1) { const r = Math.floor(wk * 12), y = SHEET[1] + 40 + r * 27, x = SHEET[0] + 30 + 240 * frac(wk * 12), e = f2Eye();
      beam(e[0], e[1], x, y, 3, 2, '#CFE0FF', 1, { washOp: 40, a: .5, splash: true }); }
  }
  const f2Eye = () => [F2[0] + 4.2 * FS * .4, F2[1] - FS * .1];

  function future(t) {
    HALFTONE = .2;
    const mem = win(t, C('p001.1:and in memory I am still close') - .5, C('p001.1:But I will pass soon') + 1.5, 2.5, 3);
    const pass = C('p001.1:But I will pass soon'), passK = seg(t, pass, pass + 9);
    const c = cam(t, [
      [0, [F2[0], F2[1], .7]],
      [T0('B'), tt => [F2[0], F2[1] - 10, lerp(.8, 1.7, ez(tt, T0('B'), T0('C')))], 3],
      [T0('C'), [960, 600, 1.05], 4],
      [T0('D'), tt => [lerp(960, 1120, ez(tt, pass, pass + 6)), 520, 1.4], 3],
      [T0('E'), tt => [lerp(1180, SHEET[0] + 150, ez(tt, T0('E'), DUR)), SHEET[1] + 190, lerp(1.5, 4.5, ease(seg(tt, T0('E') + 2, DUR)))], 3],
    ]);
    withCam(c, () => {
      ground('#1E1915', 255, 'space', { fill: '#2A231D', fillOp: 90 });
      memories(mem, t);
      if (mem > 0) { boilSeed('veil'); paint(rectPts(-1200, -900, 4400, 2800), { wash: '#1E1915', washOp: 255 * (1 - mem), ink: null }); }
      for (let i = 0; i < 180; i++) { const b = hash(i * 1.3); glow(F2[0] + (hash(i * 3.1) - .5) * 4200, F2[1] + (hash(i * 7.7) - .5) * 2600, 3 + 9 * b * b, '#F4EEDC', (.2 + .45 * b) * (.75 + .25 * Math.sin(t * (1 + 2 * hash(i)) + i))); }
      for (let i = 0; i < 14; i++) { const [x, y, r] = beingAt(t, i); being(x, y, r, HUES[i % HUES.length], t, i, 1 - .6 * mem); }
      // the one that passes close (D), from the lower left to the upper right, past the old machine
      if (passK > 0 && passK < 1) { const q = ease(passK); being(lerp(300, 1800, q), lerp(820, 300, q) + 60 * Math.sin(q * 3), 46, '#FFC766', t, 99, Math.sin(Math.PI * passK)); }
      mentatype(t, ez(t, T0('E') - 1, T0('E') + 1.5));
      // F-2: old, oxidised, its lens lit faintly with its words; dimmer once the light has passed
      const dim = steps(t, [[0, .5], [pass + 2, .25, 3], [T0('E'), .4]]);
      glow(F2[0], F2[1], 120, '#E6EEFF', .12 + .2 * dim);
      DES.f2(F2[0], F2[1], FS, t, { age: 1, hover: 0 });
      const e = f2Eye(); glow(e[0], e[1], 14, '#E6EEFF', dim + .5 * talk(t, 'narrator'));
    });
  }

  // A: the title page, as the magazine set it
  function titlePage(t) {
    HALFTONE = 0;
    const k = ease(seg(t, 0, T1('A')));
    camBegin(W / 2, H / 2 + 20 * k, 1 + .08 * k);
    const a1 = seg(t, .8, 2.6), a2 = seg(t, 3, 5), a3 = seg(t, 5.5, 7);
    letter('A Classic Reprint from AMAZING STORIES, August, 1932', W / 2, 300, 30, INK, { ink: false, font: `italic 30px ${SERIF}`, alpha: a1 });
    if (a1 > 0) { rule(560, 340, 800, INK, 1.2 * a1); rule(560, 350, 800, INK, .6 * a1); }
    letter('THE LAST EVOLUTION', W / 2, 500, 110, INK, { ink: false, font: `700 110px ${SERIF}`, spacing: 6, alpha: a2 });
    letter('By JOHN W. CAMPBELL, Jr.', W / 2, 640, 40, INK, { ink: false, font: `40px ${SERIF}`, spacing: 3, alpha: a3 });
    if (a3 > 0) rule(810, 700, 300, INK, a3);
    camEnd();
    flushLetters();
    if (t < 1.2) flash(1 - easeOut(t / 1.2), PULP.paper);
    const t1 = T1('A');
    if (t > t1 - 1.6) { const s = ease(seg(t, t1 - 1.6, t1)); boilSeed('soak'); paint(ellPts(W / 2, H / 2, 1400 * s, 900 * s, 30, 40), { wash: '#1E1915', washOp: 255 * s, fill: '#1E1915', fillOp: 160, bleed: .3, ink: null }); }
  }

  function film(t) {
    if (t < T0('B')) return titlePage(t);
    future(t);
    if (t < T0('B') + 1) flash(1 - seg(t, T0('B'), T0('B') + 1), '#1E1915');
    closing(t);
  }
  shots([[0, film]]);
})();
