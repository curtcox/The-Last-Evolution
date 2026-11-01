// pulp.js: the world's medium (PLAN.md §5): ink wash on aged pulp paper, in warm greys and sepia, with the paper's
// grain and a slight halftone, and the magazine's lettering. Loaded after core.js, it replaces core's paper, grain and
// compositing with the pulp versions; everything else in the kit is unchanged.
const PULP = {
  paper: '#E6D8B8', paperDk: '#CDBB94', ink: '#2A221B',
  // the wash, light to dark: five dilutions of one sepia ink
  w: ['#D3C3A2', '#B4A283', '#8D7C63', '#62554A', '#3B322B'],
  black: '#1B1612',             // the dome's "absolute black", and space at its deepest
};
PAL.paper = PULP.paper; PAL.ink = PULP.ink;

// One shape of ink wash: a dilution (0 lightest … 4 darkest), soft-edged, with pigment pooling at its rim as a wash
// dries. o.op scales its strength; o.ink adds an outline (a pen line, PULP.ink, o.sw wide); o.dry adds dry-brush texture.
function wash(pts, d = 2, o = {}) {
  const col = PULP.w[clamp(Math.round(d), 0, 4)], op = o.op ?? 1;
  paint(pts, { wash: col, washOp: 150 * op, fill: col, fillOp: 110 * op, bleed: o.bleed ?? .08, tex: .35, border: .45,
    ink: o.ink ? PULP.ink : null, sw: o.sw ?? .8, br: o.br || 'inkfine', curv: o.curv,
    hatch: o.dry ? { d: o.dry, a: o.dryA ?? .7, o: { rand: .4, continuous: false }, b: 'dry', c: PULP.w[clamp(Math.round(d) + 1, 0, 4)], w: .7 } : null });
}
// A graded wash, laid wet and let run: from y0 to y1 the ground darkens from k0 to k1 of the way to col (multiplied in,
// so it deepens what's under it, as another layer of wash would). For skies, night and shadowed rooms; paint wash()
// blooms over it for texture.
function shade(y0, y1, k0, k1, col = PULP.w[4]) {
  flushBrush();
  const g = shade.g || (shade.g = createGraphics(1, 256)), c = g.drawingContext, gr = c.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, mixCol('#FFFFFF', col, k0)); gr.addColorStop(1, mixCol('#FFFFFF', col, k1));
  c.fillStyle = gr; c.fillRect(0, 0, 1, 256);
  push(); blendMode(MULTIPLY); image(g, -60, y0, W + 120, y1 - y0); blendMode(BLEND); pop();
}
// soft blooms of wash across a band, where the wash pooled as it dried: texture over shade()
function blooms(y0, y1, n, d, seed = 1, op = .5) {
  for (let i = 0; i < n; i++) { boilSeed('bl' + seed + i); const x = hash(i * 1.7 + seed) * W, y = lerp(y0, y1, hash(i * 2.9 + seed)), r = 140 + 260 * hash(i * 4.1 + seed);
    paint(ellPts(x, y, r, r * .45, 20, r * .08), { fill: PULP.w[d], fillOp: 70 * op, bleed: .35, tex: .25, border: .15, ink: null }); }
}

// ---------- the paper: cheap pulp stock, yellowed, fibrous, foxed at the edges ----------
makePaper = function () {
  const g = createGraphics(W, H); g.pixelDensity(1); const c = g.drawingContext, rnd = lcg(19);
  c.fillStyle = PULP.paper; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * H, r = 80 + rnd() * 420, gr = c.createRadialGradient(x, y, 0, x, y, r), a = .06 * rnd(); gr.addColorStop(0, `rgba(150,110,60,${a})`); gr.addColorStop(1, 'rgba(150,110,60,0)'); c.fillStyle = gr; c.fillRect(x - r, y - r, 2 * r, 2 * r); }
  for (let i = 0; i < 40; i++) { const x = rnd() * W, y = rnd() * H, r = 2 + rnd() * 7; c.fillStyle = `rgba(140,95,50,${.08 + rnd() * .12})`; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); }   // foxing
  c.lineWidth = 1;
  for (let i = 0; i < 2600; i++) { const x = rnd() * W, y = rnd() * H, l = 4 + rnd() * 18, a = rnd() * TAU; c.strokeStyle = `rgba(95,72,45,${.04 + rnd() * .07})`; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a + .7) * l * .5, y + Math.sin(a + .7) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
  return g;
};
makeGrain = function () {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), rnd = lcg(7);
  const id = c.createImageData(W, H), d = id.data;
  for (let i = 0; i < d.length; i += 4) { const v = 255 - (rnd() < .6 ? rnd() * rnd() * 46 : 0); d[i] = v; d[i + 1] = v - 2; d[i + 2] = v - 6; d[i + 3] = 255; }
  c.putImageData(id, 0, 0);
  const g = c.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, H * 1.0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(130,95,55,.42)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  return cv;
};
// The halftone: the magazine printed its washes through a coarse screen. Each 6 px cell of the frame becomes a dot
// sized by its darkness, laid over the paint at HALFTONE strength (0 = off), so it shows in the mid-tones and darks
// and leaves the paper clean. Energy is excluded: anything saturated (light, not ink) keeps its colour.
let HALFTONE = .35;
const HT = 6;
function halftone(c) {
  if (HALFTONE <= 0) return;
  const w = Math.ceil(W / HT), h = Math.ceil(H / HT), sm = halftone.sm || (halftone.sm = Object.assign(document.createElement('canvas'), { width: w, height: h }));
  const sx = sm.getContext('2d', { willReadFrequently: true }); sx.drawImage(c.canvas, 0, 0, w, h);
  const px = sx.getImageData(0, 0, w, h).data;
  c.save(); c.globalAlpha = HALFTONE; c.globalCompositeOperation = 'multiply'; c.fillStyle = PULP.ink;
  c.beginPath();
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const k = (j * w + i) * 4, r = px[k], g = px[k + 1], b = px[k + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    if (mx - mn > 70) continue;                                         // saturated: energy, leave it be
    const dark = 1 - (r * .3 + g * .59 + b * .11) / 225; if (dark < .18) continue;
    const rad = HT * .62 * Math.sqrt(clamp(dark)), x = i * HT + (j % 2) * HT / 2, y = j * HT;
    c.moveTo(x + rad, y); c.arc(x, y, rad, 0, TAU);
  }
  c.fill(); c.restore();
}
composite = function (t) {
  const c = outX;
  c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
  c.drawImage(drawingContext.canvas, 0, 0, W, H);
  halftone(c);
  drawLetters(c);
  c.globalCompositeOperation = 'multiply'; c.drawImage(grainC, 0, 0);
  c.globalCompositeOperation = 'source-over';
};

// ---------- lettering: the magazine's ----------
// A pulp page header: the story's running title in small capitals over a rule, then the chapter's title, set as the
// magazine set them. x, y is the top left; wd the column's width.
const SERIF = '"Old Standard TT", Georgia, serif';
function pageHeader(title, x, y, wd, o = {}) {
  const col = o.col || PULP.ink;
  letter('THE LAST EVOLUTION', x + wd / 2, y, 30, col, { ink: false, screen: true, font: `700 30px ${SERIF}`, spacing: 6 });
  rule(x, y + 30, wd, col, 3); rule(x, y + 40, wd, col, 1);
  letter(title, x + wd / 2, y + 100, 64, col, { ink: false, screen: true, font: `italic 64px ${SERIF}` });
}
function rule(x, y, wd, col = PULP.ink, sw = 1) { inkLine([[x, y], [x + wd * .5, y + jit(.6)], [x + wd, y]], sw * .45, col, 'inkfine', 0); }
// A drop cap and the lines that run beside and under it: the opening of a chapter's text as the page shows it.
function dropCapPara(text, x, y, wd, o = {}) {
  const size = o.size || 30, lh = size * 1.32, col = o.col || PULP.ink, capLines = 3, capH = lh * capLines;
  letter(text[0], x, y + capH / 2 - size * .1, capH * 1.12, col, { ink: false, screen: true, align: 'left', font: `700 ${capH * 1.12}px ${SERIF}` });
  const c = letG.drawingContext; c.font = `700 ${capH * 1.12}px ${SERIF}`; const capW = c.measureText(text[0]).width + size * .5; c.font = `${size}px ${SERIF}`;
  const words = text.slice(1).split(' '); let line = '', ln = 0;
  const width = () => ln < capLines ? wd - capW : wd, place = s => letter(s, ln < capLines ? x + capW : x, y + ln * lh + lh / 2, size, col, { ink: false, screen: true, align: 'left', font: `${size}px ${SERIF}` });
  for (const w of words) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > width()) { place(line); ln++; line = w; if (ln >= (o.lines || 9)) return; } else line = t; }
  if (line) place(line);
}
