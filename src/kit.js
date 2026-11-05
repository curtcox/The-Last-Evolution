// kit.js: what the chapters' scenes share, lifted from the pilot (src/scenes/ch05.js) so each chapter draws only its
// own story. Everything is still a pure function of t. Loaded after designs.js; a scene takes what it needs:
//   const { win, steps, talk, page, space } = KIT;
const KIT = (() => {
  const D = PULP.w, INK = PULP.ink;
  const ez = (t, a, b) => ease(seg(t, a, b));
  const win = (t, a, b, fi = .5, fo = fi) => clamp(Math.min((t - a) / fi, (b - t) / fo));    // 1 inside [a, b], faded at both ends
  const lerpP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  // a setting that steps from key to key, easing over d seconds (or the key's own third value) after each key's time
  function steps(t, keys, d = 1.2) { let v = keys[0][1]; for (let i = 1; i < keys.length && t >= keys[i][0]; i++) v = lerp(v, keys[i][1], ease((t - keys[i][0]) / (keys[i][2] ?? d))); return v; }
  // a point that moves from mark to mark: keys [[t, [x, y]], ...], easing over d seconds after each key's time
  function path(t, keys, d = 2) { let p = keys[0][1]; for (let i = 1; i < keys.length && t >= keys[i][0]; i++) p = lerpP(p, keys[i][1], ease((t - keys[i][0]) / (keys[i][2] ?? d))); return p; }

  // acting from the voice: how open a speaker's mouth (or how lit its lens) is now, 0..1, from its words' timing
  const SAID = {}; for (const l of (window.CHAPTER ? CHAPTER.lines : [])) (SAID[l.who] ||= []).push(l);
  function talk(t, who) {
    for (const l of SAID[who] || []) { if (t < l.t0 - .1 || t > l.t1 + .1) continue;
      for (const w of l.words) if (t >= w[1] && t <= w[2]) return Math.pow(Math.sin(Math.PI * Math.min(1, (t - w[1]) / Math.max(.1, w[2] - w[1]) * 1.6)), .7) * (.55 + .45 * Math.abs(Math.sin(t * 19))); }
    return 0;
  }
  const blink = (t, seed) => { const p = frac(t / 3.9 + hash(seed)); return p < .04 ? Math.sin(Math.PI * p / .04) : 0; };
  // acting on the words (the pilot's acting pass): a speaker's clauses, [start, end] from one stop (. ; ? ! or a dash)
  // to the next, for a who or a list of line ids
  function clauses(sel) { const out = [];
    for (const l of (window.CHAPTER ? CHAPTER.lines : [])) { if (Array.isArray(sel) ? !sel.includes(l.id) : l.who !== sel) continue; let a = null;
      for (const w of l.words) { a ??= w[1]; if (/([.;?!—]|--)["”]?$/.test(w[0]) || w === l.words.at(-1)) { out.push([a, w[2]]); a = null; } } }
    return out;
  }
  // each clause longer than .6 s carries a gesture of the near hand, laid over the pose; returns a small movement of the
  // head to add to its look
  const GEST = [[.8, 1.9], [1.1, 2.4], [.6, 1.6]];   // the near arm (up, fore): an open hand forward, a lift, a small turn
  function gesture(t, pose, cl) {
    for (let i = 0; i < cl.length; i++) { const [a, b] = cl[i]; if (b - a < .6 || t < a - .3 || t > b + .9) continue;
      const k = win(t, a - .2, b + .3, .5, .6), g = GEST[i % 3]; pose.up = lerp(pose.up ?? .12, g[0], k); pose.fore = lerp(pose.fore ?? .3, g[1], k); return .05 * k * Math.sin((t - a) * 1.7); }
    return 0;
  }
  // a listener's small nod as each clause said to it ends: add to its look
  const nod = (t, cl) => -.1 * cl.reduce((n, [, b]) => Math.max(n, Math.sin(Math.PI * clamp((t - b - .1) / .7))), 0);
  // a listener through a long speech said to it (a run of clauses 6 s or more): it leans in, and every 7 s shifts how it
  // stands (arms at rest, the near hand to the chin, hands behind, hands clasped at the chest), laid over the pose; returns
  // a slow turn of the head to add to its look
  const LISTEN = [{}, { up: .5, fore: 2.8 }, { up: -.35, fore: .05, farUp: -.3, farFore: .05 }, { up: .15, fore: 2.3, farUp: .2, farFore: 2.2 }];   // the last folded in to the chest (held out, it met the speaker's hand)
  function listen(t, pose, cl, seed = 0) {
    let run = null;
    for (const [a, b] of [...cl].sort((x, y) => x[0] - y[0])) { if (run && a - run[1] < 1.5) { run[1] = b; continue; } if (run && t < run[1] + 2) break; run = [a, b]; }
    if (!run || run[1] - run[0] < 6 || t < run[0] - 1 || t > run[1] + 2) return 0;
    const k = win(t, run[0], run[1], 1.5, 1.5), n = Math.floor((t - run[0]) / 7), q = ez(t - run[0] - n * 7, 0, 1.2);
    const at = i => ({ ...DES.POSE.stand, ...LISTEN[(i + seed) % LISTEN.length] }), A = n ? at(n - 1) : DES.POSE.stand, B = at(n);
    for (const f of ['up', 'fore', 'farUp', 'farFore']) pose[f] = lerp(pose[f] ?? DES.POSE.stand[f], lerp(A[f], B[f], q), k);
    pose.torso = (pose.torso ?? 0) + .07 * k;
    return .06 * k * Math.sin((t - run[0]) * .4 + seed);
  }
  const mixPose = (a, b, k) => { const p = {}; for (const f in a) p[f] = lerp(a[f], b[f] ?? a[f], k); return p; };
  // a walk laid over a standing pose: q 0..1 through the walk, d the distance covered so far, ru the figure's head unit
  function walking(pose, hip, q, d, ru) {
    const ph = Math.PI * Math.abs(d) / (1.25 * ru) * Math.sign(d || 1), m = clamp(Math.min(q, 1 - q) * 7), sn = Math.sin(ph), cs = Math.cos(ph);
    pose.thigh = .32 * sn * m; pose.shin = (.32 * sn - .35 * Math.max(0, cs)) * m; pose.farThigh = -.32 * sn * m; pose.farShin = (-.32 * sn - .35 * Math.max(0, -cs)) * m;
    pose.up = .12 - .28 * sn * m; pose.farUp = .05 + .28 * sn * m; pose.torso += .06 * m; hip[1] -= 3 * Math.abs(cs) * m;
  }
  // a person in profile who stands, walks between marks and talks: walks [[t0, t1, x0, x1], ...]; o.pose overrides
  function stander(t, x0, g, s, walks, o = {}) {
    let x = x0, walk = null;
    for (const w of walks) { if (t < w[0]) break; const q = seg(t, w[0], w[1]); x = lerp(w[2], w[3], ease(q)); if (q < 1) walk = { q, d: x - w[2] }; }
    const pose = { ...DES.POSE.stand, ...(o.pose || {}) }, hip = [x, g - DES.HIP * s];
    pose.torso += .015 * wob(t, .22, o.seed || 0) + .02 * wob(t, .05, .3 + (o.seed || 0)); hip[1] += 1.5 * wob(t, .22, o.seed || 0);
    if (walk) walking(pose, hip, walk.q, walk.d, s * 6 / 7.4);
    const flip = walk ? walk.d < 0 : !!o.flip;
    return DES.personSide(hip[0], hip[1], s, t, { pose, flip, look: o.look || 0, lid: Math.max(o.lid || 0, blink(t, o.seed || 1)), key: o.key || 'p' + x0, talk: o.talk || 0, who: o.who || 'citizen' });
  }

  // thought, drawn two ways: a man's as a loose curl of pale wash, a machine's as ruled ink
  function dreamCurl(x, y, k, t, op = .6, key = 'curl', d = 0) {   // d: the wash's tone; the palest (0) vanishes on light paper
    if (k <= 0 || op <= 0) return;
    const P = []; for (let i = 0; i <= 14 * k; i++) { const u = i / 14; P.push([x + u * 160 + 70 * Math.sin(u * 7 + t * .6), y - (u * 300 + 30 * Math.sin(u * 5 + t * .4))]); }
    if (P.length > 2) { boilSeed(key); wash(ribbon(P, 26, 6), d, { op }); }
  }
  function ruled(P, k, col = '#EFE6D2', sw = 1, k0 = 0) {   // a ruled ink path, drawn from fraction k0 to k of its length
    if (k <= k0) return;
    const L = []; for (let i = 1; i < P.length; i++) L.push(Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    const tot = L.reduce((a, b) => a + b, 0), at = d => { for (let i = 1; i < P.length; i++) { if (d <= L[i - 1]) return lerpP(P[i - 1], P[i], d / L[i - 1]); d -= L[i - 1]; } return P.at(-1); };
    let acc = 0; const Q = [at(k0 * tot)];
    for (let i = 1; i < P.length; i++) { acc += L[i - 1]; if (acc > k0 * tot && acc < k * tot) Q.push(P[i]); }
    Q.push(at(k * tot));
    if (Q.length > 1) inkLine(Q, sw, col, 'inkfine', 0);
  }
  // thought-speech (PLAN.md §4): rings of light going out from the thinker, one per beat of the words
  function thoughtRings(x, y, t, t0, t1, o = {}) {
    if (t < t0) return;
    const per = o.per ?? 1.1, fade = clamp((t1 + per * 2 - t) / (per * 2));
    for (let n = 0; n < 4; n++) { const age = (t - t0) / per - n; if (age < 0) continue; const k = frac(age), r = (o.r0 ?? 40) + k * (o.r1 ?? 520), a = (1 - k) * .35 * fade;
      if ((t - t0) - n * per > t1 - t0 + per) continue;
      for (let i = 0; i < 26; i++) { const q = i / 26 * TAU; glow(x + Math.cos(q) * r, y + Math.sin(q) * r * (o.sq ?? .55), 22, o.col || '#E6EEFF', a); } }
  }

  // ---------- grounds ----------
  // a ground of wash over the whole frame (in screen space or under a camera, with a margin)
  function ground(col, op = 255, key = 'ground', o = {}) { steady(() => { stillSeed(key); paint(rectPts(-800, -800, W + 1600, H + 1600), { wash: col, washOp: op, fill: o.fill || col, fillOp: o.fillOp ?? 60, bleed: .2, tex: .4, ink: null }); }); }
  // space: near-black wash with the paper showing through as stars; steady (hash), twinkling a little; n stars over a
  // field w x h centred on (cx, cy)
  function space(t, o = {}) {
    const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, w = o.w ?? 4000, h = o.h ?? 2600, n = o.n ?? 160, seed = o.seed ?? 1;
    ground(o.col || '#221C17', 255, 'space' + seed, { fill: '#2E2620', fillOp: 90 });
    for (let i = 0; i < n; i++) { const x = cx + (hash(i * 3.1 + seed) - .5) * w, y = cy + (hash(i * 7.7 + seed) - .5) * h, b = hash(i * 1.3 + seed);
      glow(x, y, 4 + 10 * b * b, o.star || '#F4EEDC', (.25 + .5 * b) * (.75 + .25 * Math.sin(t * (1 + 2 * hash(i)) + i))); }
  }
  // a planet or sun as a lit disc: d the wash, light from the upper left; o.glow a colour of light around it
  function planet(x, y, r, d = 2, o = {}) { steady(() => {
    stillSeed('pl' + (o.key || x));
    if (o.glow) glow(x, y, r * 1.8, o.glow, o.ga ?? .5);
    wash(ellPts(x, y, r, r, 40), d, { ink: true, sw: .7 });
    wash([...Array(20)].map((_, i) => { const a = -.3 + i / 19 * Math.PI; return [x + Math.cos(a) * r, y + Math.sin(a) * r]; }).concat([[x - r * .2, y + r * .4]]), Math.min(4, d + 2), { op: .7 });   // the night side
    if (o.bands) for (let i = -2; i <= 2; i++) inkLine([[x - r * .9 * Math.cos(i * .35), y + i * r * .3], [x + r * .9 * Math.cos(i * .35), y + i * r * .3 + 3]], .4, D[Math.min(4, d + 1)], 'inkfine');
  }); }

  // ---------- a chapter's page: the magazine's header, the drop cap and the opening words ----------
  // From bare paper, a slow push; at its end the paper soaks dark with wash (o.soak, a colour) into the next space.
  function page(t, title, text, t1, o = {}) {
    HALFTONE = 0;
    const k = ease(seg(t, 0, t1)), x = 460, wd = 1000;
    camBegin(W / 2 + 40 * k, H / 2 + 40 * k, 1 + .06 * k);
    pageHeader(title, x, 250, wd, { screen: false });
    dropCapPara(text, x, 470, wd, { size: o.size ?? 44, lines: o.lines ?? 8, screen: false });
    rule(x + wd * .35, 800, wd * .3, INK, 1);
    camEnd();
    flushLetters();
    if (t < 1.2) flash(1 - easeOut(t / 1.2), PULP.paper);
    if (t > t1 - 1.2 && o.soak !== false) { const s = ease(seg(t, t1 - 1.2, t1)); boilSeed('soak'); paint(ellPts(W / 2, H / 2, 1400 * s, 900 * s, 30, 40), { wash: o.soak || '#3B322B', washOp: 255 * s, fill: o.soak || '#3B322B', fillOp: 160, bleed: .3, ink: null }); }
  }
  // the chapter's last moments: a fade to the paper the next chapter's page opens on
  const closing = (t, dur = DUR) => { if (t > dur - 1.5) flash(seg(t, dur - 1.5, dur), PULP.paper); };

  // ---------- a camera that eases between framings ----------
  // cam(t, keys): keys [[t, [cx, cy, zoom], mv?], ...]; the move into each framing starts at its t and takes mv
  // seconds (default 2.5). Framings may be functions of t, so a framing can drift while it's held.
  function cam(t, keys) {
    const at = (f, tt) => typeof f === 'function' ? f(tt) : f;
    let c = at(keys[0][1], t);
    for (let i = 1; i < keys.length && t >= keys[i][0]; i++) c = camMix(c, at(keys[i][1], t), ease((t - keys[i][0]) / (keys[i][2] ?? 2.5)), keys[i][3] ?? 0);
    return c;
  }
  const withCam = (c, draw) => { camBegin(c[0], c[1], c[2]); draw(); camEnd(); };

  return { D, INK, ez, win, lerpP, steps, path, talk, blink, clauses, gesture, nod, listen, mixPose, walking, stander, dreamCurl, ruled, thoughtRings, ground, space, planet, page, closing, cam, withCam };
})();
