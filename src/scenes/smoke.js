// smoke.js: Phase 0's toolchain test, not a design. It proves the kit paints, letters, glows and renders here, using the
// plan's one rule in miniature (PLAN.md §5): the world in grey ink wash, colour only for energy. An Outsider ship
// lowers a pale green beam over Denver's grey ridge line. Look development (Phase 4) replaces all of it.
(() => {
  const INKW = { lt: '#B9AE9A', md: '#8A8070', dk: '#4E463D' };   // three greys of ink wash
  const GREEN = '#9BE8A0';

  function ridge(y, amp, seed, col, op) {
    const pts = [[-80, H + 80]];
    for (let x = -80; x <= W + 80; x += 60) pts.push([x, y - amp * (.5 + .5 * Math.sin(x * .004 + seed)) - amp * .4 * hash(Math.floor(x / 60) + seed * 10)]);
    pts.push([W + 80, H + 80]);
    paint(pts, { wash: col, washOp: op, fill: col, fillOp: 60, bleed: .15, ink: null });
  }

  function ship(x, y, s) {
    boilSeed('ship');
    paint(ellPts(x, y, 260 * s, 46 * s, 36), { wash: INKW.dk, washOp: 235, ink: PAL.ink, sw: 1.2 });
    paint(ellPts(x - 40 * s, y - 22 * s, 90 * s, 24 * s, 24), { wash: INKW.md, washOp: 220, ink: PAL.ink, sw: .9 });
  }

  function beam(x, y0, y1, k) {
    if (k <= 0) return;
    const w0 = 40, w1 = 40 + 320 * k, yb = lerp(y0, y1, k);
    boilSeed('beam');
    paint([[x - w0, y0], [x + w0, y0], [x + w1, yb], [x - w1, yb]], { wash: GREEN, washOp: 70 * k, ink: null });
    glow(x, yb, 220 * k, GREEN, .5 * k);
  }

  shots([[0, (t, lt) => {
    boilSeed('sky');
    paint(rectPts(-60, -60, W + 120, 760), { wash: INKW.lt, washOp: 120, fill: INKW.md, fillOp: 30, bleed: .2, ink: null });
    ridge(700, 160, 1, INKW.md, 150);
    const sx = lerp(1500, 1050, ease(seg(lt, 0, 4))), sy = 250 + 10 * wob(lt, .25);
    ship(sx, sy, 1);
    beam(sx, sy + 40, 900, ease(seg(lt, 3, 6)));
    ridge(860, 90, 7, INKW.dk, 210);
    letter('THE LAST EVOLUTION', 120, 120, 64, '#2B2233', { align: 'left', ink: false, font: '64px "Old Standard TT"' });
    letter('toolchain smoke test · not a design', 120, 180, 26, '#4E463D', { align: 'left', ink: false, font: 'italic 26px "Old Standard TT"' });
  }]]);
})();
