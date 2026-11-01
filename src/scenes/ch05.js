// ch05.js: chapter 5, The Hydrogen Wall: the pilot (PLAN.md §6). It draws script/boards/ch05.yaml shot by shot; every
// time in it is a cue against the voice (src/gen/ch05.js, from tools/timeline.mjs), so it holds when a line is voiced
// again. studio.html?chapter=5. This is the blocking pass: each shot's key poses and its event, with simple motion
// between them, for the storyboard (tools/storyboard.mjs) and the first draft.
(() => {
  const D = PULP.w, INK = PULP.ink, S = CHAPTER.shots;
  const C = cue, K = (t, a, b) => seg(t, C(a), C(b));
  const FORCE = '#CFE0FF';                       // F-1's force shafts: the text gives them no colour, so a cold white

  // ---------- the hall: one set, framed by the camera ----------
  // world layout (px): the floor's line at 864, figures stand at G; Roal's couch at the left, F-1 at the right, the
  // working point between them, the tiers of science-machines floating behind
  const G = 1000, F1 = { x: 1420, g: 975, s: 50 }, WORK = [1000, 790], COUCH = { x: 420, s: 44 }, RS = 44, RU = RS * 6 / 7.4, FS = 30;
  const f2At = (t, o = {}) => DES.f2(WORK[0], WORK[1] + 2.4 * FS, FS, t, { hover: 2.4, ...o });
  const night = (op = .85) => { boilSeed('night'); paint(rectPts(-500, -400, 3000, 1900), { wash: PULP.black, washOp: 215 * op, fill: '#3B322B', fillOp: 60, bleed: .2, tex: .4, ink: null }); };
  function hallBack(t, o = {}) {
    DES.lab(-300, -150, 2520, 1300, o.screens ?? t, { couch: false });
    night(o.dark ?? .85);
  }
  // a science-machine far off on its tier: the family form in silhouette, its lens lit by whatever light there is
  function farMachine(x, y, s, d, lit = 0, i = 0) {
    boilSeed('fm' + i);
    wash(ellPts(x, y, s * 2, s * .4, 14), d + 1, { ink: true, sw: .4 });
    wash([[x - s * 1.5, y - s * .6], [x - s * 1.5, y - s * 3.4], [x - s * 1.1, y - s * 4.3], [x + s * 1.1, y - s * 4.3], [x + s * 1.5, y - s * 3.4], [x + s * 1.5, y - s * .6]], d, { ink: true, sw: .45, curv: .3 });
    glow(x, y - s * 3.6, s * (.6 + 1.4 * lit), NRG.white, .25 + .6 * lit);
  }
  function tiers(t, lit = 0, o = {}) {
    for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) {
      const x = 80 + i * 225 + r * 110 + 14 * wob(t, .07, i * .3 + r), y = 600 + r * 120 + 6 * wob(t, .11, i * .7);
      if (o.skip && Math.abs(x - o.skip) < 220 && r === 1) continue;
      farMachine(x, y, 10 + r * 2, 2 + r, lit * (.5 + .5 * hash(i + r * 9 + Math.floor(t * 6))), r * 9 + i);
    }
  }
  // F-1, with its tentacles hanging or reaching for points; o.hum 0..1 lights its bands; o.fall 0..1 drops it
  function f1(t, o = {}) {
    const { x, g, s } = F1, fall = o.fall || 0, tilt = fall * .22;
    if (o.gone >= 1) return;
    push(); translate(x, g); rotate(tilt); if (o.gone) scale(1, 1 - o.gone); translate(-x, -g);
    const m = DES.f1(x, g, s, t, { arms: o.reach ? 0 : 8, hover: lerp(3, .35, easeIn(fall)), lit: o.lit, dark: o.dark });
    if (o.reach) o.reach.forEach((p, i) => { const sx = x + (i - (o.reach.length - 1) / 2) * s * 1.1, sy = m.arm, w = o.writhe || 0;
      const mx = lerp(sx, p[0], .5) + s * 2.2 * wob(t, .9 + .4 * w, i * .37) * (.3 + w), my = lerp(sy, p[1], .5) + s * 1.5 * wob(t, .7 + .5 * w, i * .21) * (.3 + w);
      DES.tentacle([[sx, sy], [lerp(sx, mx, .5), lerp(sy, my, .6) + s], [mx, my], [lerp(mx, p[0], .6), lerp(my, p[1], .6)], p], .34 * s, .16 * s, 4); });
    if (o.hum) for (let k = 0; k < 5; k++) glow(x, m.yb - m.h * (.1 + k * .2), m.r * 1.1, NRG.white, .22 * o.hum);
    pop();
    return m;
  }
  // Roal in profile: on the couch (k 0 lying … 1 sitting up), or standing at x
  function roalCouch(t, k = 0, o = {}) {
    const c = DES.couch(COUCH.x, G, COUCH.s);
    const pose = {}; for (const f of ['torso', 'thigh', 'shin', 'up', 'fore', 'farUp', 'farFore']) pose[f] = lerp(DES.POSE.lie[f], DES.POSE.sitUp[f], k);
    const breath = .012 * wob(t, .22);
    return DES.personSide(COUCH.x - 30 + k * 12, c.seat - .38 * RU, RS, t, { pose: { ...pose, torso: pose.torso + breath }, look: o.look ?? k * .35, lid: o.lid, key: 'r' });
  }
  const roalStand = (t, x, o = {}) => DES.personSide(x, G - DES.HIP * RS, RS, t, { pose: o.pose || DES.POSE.stand, flip: o.flip, look: o.look, key: 'rs' });
  // thought, drawn two ways: Roal's as a loose curl of pale wash, the machines' as ruled ink
  function dreamCurl(x, y, k, t, sc = 1) {
    if (k <= 0) return;
    const P = []; for (let i = 0; i <= 14 * k; i++) { const u = i / 14; P.push([x + sc * (u * 160 + 70 * Math.sin(u * 7 + t * .6)), y - sc * (u * 300 + 30 * Math.sin(u * 5 + t * .4))]); }
    if (P.length > 2) { boilSeed('curl'); wash(ribbon(P, 26 * sc, 6 * sc), 0, { op: .6 }); }
  }
  function ruled(P, k, col = '#EFE6D2', sw = 1) {   // a ruled ink path drawn on to fraction k of its length
    if (k <= 0) return;
    const L = []; for (let i = 1; i < P.length; i++) L.push(Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    let left = k * L.reduce((a, b) => a + b, 0); const Q = [P[0]];
    for (let i = 1; i < P.length && left > 0; i++) { const f = Math.min(1, left / L[i - 1]); Q.push([lerp(P[i - 1][0], P[i][0], f), lerp(P[i - 1][1], P[i][1], f)]); left -= L[i - 1]; }
    if (Q.length > 1) inkLine(Q, sw, col, 'inkfine', 0);
  }
  // the dark field of Roal's science plates
  const plate = () => { boilSeed('plate'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: '#2E2620', washOp: 255, fill: '#3B322B', fillOp: 120, bleed: .25, tex: .5, ink: null }); blooms(0, H, 8, 4, 55, .5); };
  const dotted = (cx, cy, rx, ry, col = '#B4A283', n = 60) => { for (let i = 0; i < n; i += 2) { const a0 = i / n * TAU, a1 = (i + 1) / n * TAU; inkLine([[cx + Math.cos(a0) * rx, cy + Math.sin(a0) * ry], [cx + Math.cos(a1) * rx, cy + Math.sin(a1) * ry]], .7, col, 'inkfine', 0); } };
  const proton = (x, y, r) => { boilSeed('proton'); wash(ellPts(x, y, r, r, 24), 2, { ink: true, sw: .8 }); wash(ellPts(x - r * .3, y - r * .3, r * .35, r * .3, 12), 0, { op: .6 }); };
  const electron = (x, y, r) => { boilSeed('el' + Math.round(x) + Math.round(y)); paint(ellPts(x, y, r, r, 14), { wash: '#EFE6D2', washOp: 240, ink: '#B4A283', sw: .5 }); };
  const flashRing = (x, y, r, a) => { for (let i = 0; i < 28; i++) { const q = i / 28 * TAU; glow(x + Math.cos(q) * r, y + Math.sin(q) * r, 26, NRG.white, a); } };
  // thought-speech's signature (PLAN.md §4): rings of light going out from the thinker, one per beat of the words
  function thoughtRings(x, y, t, t0, t1, o = {}) {
    if (t < t0) return;
    const per = o.per ?? 1.1, fade = clamp((t1 + per * 2 - t) / (per * 2));
    for (let n = 0; n < 4; n++) { const age = (t - t0) / per - n; if (age < 0) continue; const k = frac(age), r = (o.r0 ?? 40) + k * (o.r1 ?? 520), a = (1 - k) * .35 * fade;
      if ((t - t0) - n * per > t1 - t0 + per) continue;
      for (let i = 0; i < 26; i++) { const q = i / 26 * TAU; glow(x + Math.cos(q) * r, y + Math.sin(q) * r * (o.sq ?? .55), 22, o.col || '#E6EEFF', a); } }
  }
  const fadeFrom = (k, col = PULP.black) => flash(1 - clamp(k), col);
  const out = (lt, dur, d = .5, col = PULP.black) => { if (lt > dur - d) flash(seg(lt, dur - d, dur), col); };
  const inn = (lt, d = .5, col = PULP.black) => { if (lt < d) flash(1 - seg(lt, 0, d), col); };

  // ---------- A: the chapter's page ----------
  function A(t, lt, dur) {
    HALFTONE = 0;
    const x = 460, wd = 1000;
    pageHeader('The Hydrogen Wall', x, 250, wd);
    dropCapPara('Roal was lying quietly on a couch. He was thinking deeply, and yet not with the logical trains of thought that machines must follow.', x, 470, wd, { size: 44, lines: 8 });
    rule(x + wd * .35, 800, wd * .3, INK, 1);
    flushLetters();
    if (lt < 1.2) flash(1 - easeOut(lt / 1.2), PULP.paper);
    if (lt > dur - 1.2) { const k = ease(seg(lt, dur - 1.2, dur)); boilSeed('soak'); paint(ellPts(W / 2, H / 2, 1400 * k, 900 * k, 30, 40), { wash: '#3B322B', washOp: 255 * k, fill: '#3B322B', fillOp: 160, bleed: .3, ink: null }); }
  }

  // ---------- B: the hall at night ----------
  function B(t, lt, dur) {
    HALFTONE = .3;
    camBegin(lerp(860, 760, ease(lt / dur)), 700, 1.05);
    hallBack(t); tiers(t); f1(t, { lit: .15 });
    const r = roalCouch(t, 0, { lid: .3 });
    const k = K(t, 'p051.1:not with', 'p051.1$');
    dreamCurl(r.head[0] + 20, r.head[1] - 30, k, t);
    ruled([[F1.x - 30, 560], [1080, 560], [1080, 470], [860, 470], [860, 400], [700, 400]], seg(t, C('p051.1:not with') + 1, C('p051.1$') + .5) * .9, D[0], .9);
    camEnd();
    inn(lt, .8, '#3B322B');
  }

  // ---------- C: F-1 speaks ----------
  function C_(t, lt, dur) {
    HALFTONE = .3;
    const k = ease(lt / dur);
    camBegin(F1.x - 40, lerp(800, 560, k), 1.7);
    hallBack(t); f1(t, { lit: .3 + .7 * K(t, 'p052.1', 'p052.1$') * (1 - K(t, 'p052.2', 'p052.2$') * .5) });
    camEnd();
  }

  // ---------- D: Roal sits up ----------
  function D_(t, lt, dur) {
    HALFTONE = .3;
    const k = backOut(K(t, 'p053.1', 'p053.1+1.3'));
    camBegin(COUCH.x + 30, 850, 2.6 + .15 * K(t, 'p053.2', 'p053.2$'));
    hallBack(t); roalCouch(t, k, { look: .2 + .45 * k, lid: lerp(.3, 0, k) });
    camEnd();
  }

  // ---------- E: F-1 has followed him (over his shoulder) ----------
  function E(t, lt, dur) {
    HALFTONE = .3;
    const k = ease(K(t, 'p054.1', 'p054.1:What is your thought'));
    camBegin(lerp(1080, 1000, k), 720, 1.25);
    hallBack(t); tiers(t);
    push(); translate(lerp(0, -170, k), lerp(0, 130, k)); f1(t, { lit: .5 + .5 * Math.abs(wob(t, 2.3)) * (t < C('p054.1$') ? 1 : 0) }); pop();
    camEnd();
    // Roal's head and shoulder dark in the foreground, left
    boilSeed('ots'); DES.personSide(260, 1400, 260, t, { pose: DES.POSE.sitUp, look: .6, key: 'ots' }); boilSeed('otsd'); wash(ellPts(260, 760, 380, 520, 24), 4, { op: .45 });
  }

  // ---------- F, G: Roal's eyes, then the lens ----------
  function F(t, lt, dur) {
    HALFTONE = .25;
    camBegin(W / 2, H / 2, 1 + .04 * lt / dur);
    boilSeed('skin'); paint(rectPts(-100, -100, W + 200, H + 200), { wash: D[0], washOp: 255, fill: D[1], fillOp: 60, bleed: .2, ink: null });
    DES.eyes(W / 2, H / 2 + 40, 1500, t, { old: true, far: true, lid: .2 + .08 * K(t, 'p055.1', 'p055.1+3'), look: -.15 });
    camEnd();
    inn(lt, .4);
  }
  function G_(t, lt, dur) {
    HALFTONE = .25;
    boilSeed('lensbg'); paint(rectPts(-100, -100, W + 200, H + 200), { wash: D[2], washOp: 255, ink: null });
    camBegin(W / 2, H / 2, 1 + .02 * lt / dur);
    boilSeed('biglens'); wash(ellPts(W / 2, H / 2 + 40, 560, 560, 48), 1, { ink: true, sw: 1.4 });
    wash(ellPts(W / 2, H / 2 + 40, 420, 420, 40), 4, { ink: true, sw: 1 });
    // the hall, small and bent in the glass
    for (let i = 0; i < 6; i++) { const a = -2.4 + i * .3; inkLine([[W / 2 + Math.cos(a) * 380, H / 2 + 40 + Math.sin(a) * 380], [W / 2 + Math.cos(a) * 150, H / 2 + 40 + Math.sin(a) * 150]], .6, D[2]); }
    glow(W / 2 - 120, H / 2 - 80, 120, NRG.white, .5);
    camEnd();
    out(lt, dur, .4);
  }

  // ---------- H: into the atom ----------
  function H_(t, lt, dur) {
    HALFTONE = .3;
    const up = ease(K(t, 'p056.1', 'p056.1:but a single proton'));
    camBegin(COUCH.x + 60, lerp(860, 560, up), lerp(2, 1.3, up));
    hallBack(t, { dark: .80 + .35 * up }); roalCouch(t, 1, { look: .6, lid: .1 });
    camEnd();
    const k = K(t, 'p056.1:but a single proton', 'p056.1:Yet never');
    if (k > 0) { boilSeed('fall'); paint(rectPts(-100, -100, W + 200, H + 200), { wash: '#2E2620', washOp: 255 * ease(k * 2), ink: null }); }
    if (t > C('p056.1:but a single proton')) proton(W / 2, H / 2, 70 * backOut(K(t, 'p056.1:but a single proton', 'p056.1:but a single proton+.6')));
    if (t > C('p056.1:but a single electron')) { const a = (t - C('p056.1:but a single electron')) * 1.2; electron(W / 2 + Math.cos(a) * 420, H / 2 + Math.sin(a) * 220, 16); }
    out(lt, dur, .3, '#2E2620');
  }

  // ---------- I: the plate of the atom ----------
  function I_(t, lt, dur) {
    HALFTONE = .3; plate();
    dotted(W / 2, H / 2, 420, 220);
    proton(W / 2, H / 2, 70);
    const a = (t - C('p056.1:but a single electron')) * 1.2; electron(W / 2 + Math.cos(a) * 420, H / 2 + Math.sin(a) * 220, 16);
  }

  // ---------- J: the bombardment ----------
  function J(t, lt, dur) {
    HALFTONE = .3; plate();
    const t0 = C('p056.1:the awful expelling force'), k = clamp((t - t0) / 3);
    camBegin(lerp(700, 1100, ease(K(t, 'p056.1:Never in all science', 'p056.1:bombard atoms'))), H / 2, 1);
    const bx = 120, by = 520;
    if (t > t0 - .3) { const b = backOut(seg(t, t0 - .3, t0 + .4)); glow(bx, by, 260 * b, NRG.white, .8 * (1 - k * .6)); boilSeed('burst'); paint(starPts(bx, by, 120 * b, .35, 9), { wash: '#EFE6D2', washOp: 160, ink: null }); }
    const ax = 1400, ay = 520;
    dotted(ax, ay, 300, 160); proton(ax, ay, 55);
    const ea = t * 1.2; electron(ax + Math.cos(ea) * 300, ay + Math.sin(ea) * 160, 13);
    for (let i = 0; i < 9; i++) {   // the bombarding electrons: each swerves off before it reaches the proton
      const s0 = t0 + i * .35, q = clamp((t - s0) / 2.2); if (q <= 0) continue;
      const aim = (i - 4) * 26, mx = lerp(bx, ax - 150, Math.min(1, q * 1.6)), my = lerp(by, ay + aim, Math.min(1, q * 1.6));
      const sw = Math.max(0, q * 1.6 - 1) / .6, dir = aim >= 0 ? 1 : -1;
      const x = q * 1.6 < 1 ? mx : ax - 150 + sw * 260, y = q * 1.6 < 1 ? my : ay + aim + dir * sw * sw * 380;
      electron(x, y, 9);
    }
    camEnd();
  }

  // ---------- K: falling in, to the wall ----------
  function K_(t, lt, dur) {
    HALFTONE = .3; plate();
    const rings = [460, 330, 230, 150], flashes = ['p056.1:there goes a flash', 'p056.1:Another flash', 'p056.1:Always falling nearer', 'p056.1:that one state'];
    let ring = 0; flashes.forEach((c, i) => { if (t > C(c)) ring = i + 1; });
    const push = 1 + .5 * ease(K(t, 'p056.1:the proton is positive', 'p056.1:What is that wall'));
    camBegin(W / 2, H / 2, push);
    rings.forEach((r, i) => dotted(W / 2, H / 2, r, r * .55, i === 3 && t > C('p056.1:Blocked') ? '#EFE6D2' : '#8D7C63', 50 + i * 10));
    if (t > C('p056.1:Blocked')) { boilSeed('wall'); const k = K(t, 'p056.1:Blocked', 'p056.1:What is that wall'); paint(ellPts(W / 2, H / 2, 150, 82, 40), { ink: '#EFE6D2', sw: 1.2 + 2.5 * k, br: 'dry' }); glow(W / 2, H / 2, 180 + 40 * k, '#F4EEDC', .1 + .15 * k); }
    proton(W / 2, H / 2, 60);
    // the electron: on its ring, falling to the next at each flash (a quick drop, eased)
    const rr = i => rings[Math.min(3, i)], from = ring === 0 ? 0 : ring - 1, dk = ring === 0 ? 1 : easeOut(clamp((t - C(flashes[ring - 1])) / .5));
    const R = ring === 0 ? rings[0] : lerp(rr(from), rr(ring), dk), a = t * (2.4 - R / 300);
    electron(W / 2 + Math.cos(a) * R, H / 2 + Math.sin(a) * R * .55, 14);
    flashes.forEach(c => { const age = t - C(c); if (age > 0 && age < 1.2) flashRing(W / 2 + Math.cos(a) * R, H / 2 + Math.sin(a) * R * .55, 30 + age * 500, .5 * (1 - age / 1.2)); });
    camEnd();
  }

  // ---------- L: space curves ----------
  function L_(t, lt, dur) {
    HALFTONE = .3; plate();
    const bend = .15 + .85 * ease(K(t, 'p057.1', 'p057.1:beyond all bounds')), fold = ease(K(t, 'p057.1:beyond all bounds', 'p057.1:and are in a new space+1'));
    camBegin(W / 2, H / 2, 1 + 1.5 * ease(K(t, 'p057.1:and are in a new space', 'p057.1$+1.5')));
    const cx = W / 2, cy = H / 2, warp = (x, y) => { const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy) || 1, d = bend * 260 * Math.exp(-r / 380) * (1 + 1.5 * fold), r2 = Math.max(3, r - d); return [cx + dx * r2 / r, cy + dy * r2 / r]; };
    for (let i = -10; i <= 10; i++) { const P = [], Q = []; for (let j = -14; j <= 14; j++) { P.push(warp(cx + i * 70, cy + j * 50)); Q.push(warp(cx + j * 70, cy + i * 50)); } inkLine(P, .6, '#8D7C63', 'inkfine', .3); inkLine(Q, .6, '#8D7C63', 'inkfine', .3); }
    proton(cx, cy, 40 * (1 - fold * .7));
    const er = lerp(260, 30, ease(K(t, 'p057.1:As the two come nearer', 'p057.1:beyond all bounds'))), ea = t * 3;
    if (fold < .9) electron(cx + Math.cos(ea) * er, cy + Math.sin(ea) * er * .55, 12);
    if (fold > 0) { glow(cx, cy, 30 + 400 * fold, NRG.white, .8 * fold); glow(cx, cy, 20 + 120 * fold, '#F4EEDC', fold); }
    camEnd();
    if (lt > dur - 1) flash(seg(lt, dur - 1, dur), '#F4EEDC');
  }

  // ---------- M: his voice drops ----------
  function M(t, lt, dur) {
    HALFTONE = .3;
    camBegin(COUCH.x - 10, 790, 4.2 + .15 * lt / dur);
    hallBack(t, { dark: .89 }); roalCouch(t, 1, { look: .55, lid: lerp(.1, .45, K(t, 'p057.2', 'p057.2$')) });
    camEnd();
    for (let i = 0; i < 5; i++) { const a = (1 - K(t, 'p057.2', 'p057.2+3')) * .5; if (a > 0) inkLine([[1200 + i * 60, 200], [1200 + i * 60, 900]], .5, '#8D7C63', 'inkfine', 0); }
    if (lt < 1) flash(1 - seg(lt, 0, 1), '#F4EEDC');
  }

  // ---------- N: F-1 hums; the step no logic can ascend ----------
  function N_(t, lt, dur) {
    HALFTONE = .3;
    camBegin(1150, 640, 1.2);
    hallBack(t, { dark: .84 }); tiers(t);
    f1(t, { hum: .4 + .3 * Math.abs(wob(t, 1.7)), lit: .4 });
    camEnd();
    // the steps: ruled lines climbing from its lens, stopping at the gap; then a line from the far side coming back down
    const x0 = 1180, y0 = 560, st = 6, sw = 90, sh = 60, steps = [[x0, y0]];
    for (let i = 0; i < st; i++) { const [x, y] = steps.at(-1); steps.push([x - sw, y], [x - sw, y - sh]); }
    const gapEnd = steps.at(-1), far = [gapEnd[0] - 240, gapEnd[1] - 140];
    ruled(steps, K(t, 'p058.2', 'p058.2:no logic can'), '#EFE6D2', 1.1);
    if (t > C('p058.2:working backwards')) {
      const back = [far, [far[0], far[1] + 70], [far[0] + 120, far[1] + 70], [far[0] + 120, gapEnd[1]], gapEnd];
      ruled(back, K(t, 'p058.2:working backwards', 'p058.2$'), '#EFE6D2', 1.1);
      if (t > C('p058.2$')) glow(gapEnd[0], gapEnd[1], 50, NRG.white, .6 * (1 - seg(t, C('p058.2$'), C('p058.2$') + 1.2)));
    }
    if (t > C('p058.2:a step')) { boilSeed('far'); paint(ellPts(...far, 14, 14, 12), { wash: '#EFE6D2', washOp: 220, ink: null }); glow(...far, 40, NRG.white, .4); }
  }

  // ---------- O: force shafts ----------
  function O(t, lt, dur) {
    HALFTONE = .3;
    const go = C('p058.3:Suddenly'), [sx, sy] = shakeXY(t, t > go && t < go + .4 ? 8 : 0);
    camBegin(1080 + sx, 640 + sy, 1.05);
    hallBack(t, { dark: .84 }); tiers(t, t > go ? .4 : 0);
    const w = K(t, 'p058.3:tentacles became', 'p058.3:writhing masses+1');
    const pts = [[WORK[0] - 60, WORK[1] - 40], [WORK[0] + 40, WORK[1] - 70], [WORK[0] + 70, WORK[1] + 20], [WORK[0] - 30, WORK[1] + 50], [WORK[0] - 90, WORK[1] + 10], [WORK[0] + 10, WORK[1] - 10]];
    f1(t, { reach: w > 0 ? pts.map(p => [p[0] + 30 * wob(t, 3, p[0]), p[1] + 30 * wob(t, 2.6, p[1])]) : null, writhe: w, lit: .5, hum: t > go ? .5 : .1 });
    if (t > go) { const k = ease(seg(t, go, go + .5)); [[-60, 0], [0, 0], [60, 0]].forEach(([dx], i) => beam(F1.x + dx, 640, WORK[0] + dx * .3, WORK[1], 18, 8, FORCE, k, { washOp: 50 })); }
    camEnd();
  }

  // ---------- P: the transmutation field ----------
  function P_(t, lt, dur) {
    HALFTONE = .3;
    camBegin(WORK[0] + 60, WORK[1] - 40, 2 + .5 * ease(lt / dur));
    hallBack(t, { dark: .86 });
    const pulse = .5 + .5 * Math.sin(t * 2.2);
    f1(t, { reach: [[WORK[0] - 50, WORK[1] - 30], [WORK[0] + 30, WORK[1] - 55], [WORK[0] + 55, WORK[1] + 15], [WORK[0] - 25, WORK[1] + 40], [WORK[0] - 70, WORK[1] + 10], [WORK[0] + 5, WORK[1] - 5]].map((p, i) => [p[0] + 40 * wob(t, 3.3, i * .2), p[1] + 40 * wob(t, 2.9, i * .4)]), writhe: 1, hum: K(t, 'p058.3:the hum', 'p058.3:waxed') * pulse + .3, lit: .6 });
    // the air, pulled in spirals into the field
    for (let i = 0; i < 12; i++) { const a0 = i / 12 * TAU + t * 2, P = []; for (let k = 0; k <= 10; k++) { const r = 260 - k * 22, a = a0 + k * .35; P.push([WORK[0] + Math.cos(a) * r, WORK[1] + Math.sin(a) * r * .6]); } boilSeed('air' + i); inkLine(P, .5, D[0], 'inkfine', .5); }
    const m = K(t, 'p058.3:Fierce beams', 'p058.3$');
    glow(...WORK, 120 + 60 * m, NRG.white, .4 + .4 * m); glow(...WORK, 220, FORCE, .3);
    if (m > 0) { boilSeed('something'); paint(ellPts(...WORK, 60 * m, 18 * m, 14, 12), { wash: mixCol(D[1], '#7F9BD0', .38), washOp: 160 * m, ink: null }); }
    camEnd();
    if (lt > dur - .3) brushWipe((lt - (dur - .3)) / .6, [PULP.w[4], PULP.w[3]]);
  }

  // ---------- Q: a weird symphony ----------
  function Q_(t, lt, dur) {
    HALFTONE = .3;
    const fl = hash(Math.floor(t * 5)), lit = fl > .35 ? fl : .15, [sx, sy] = shakeXY(t, fl > .8 ? 5 : 0);
    camBegin(1000 + sx, 660 + sy, 1.3);
    hallBack(t, { dark: .93 - .4 * lit }); tiers(t, lit);
    f1(t, { reach: [[WORK[0] - 50, WORK[1] - 30], [WORK[0] + 30, WORK[1] - 55], [WORK[0] + 55, WORK[1] + 15], [WORK[0] - 25, WORK[1] + 40]].map((p, i) => [p[0] + 30 * wob(t, 3.3, i * .2), p[1] + 30 * wob(t, 2.9, i * .4)]), writhe: 1, hum: lit, lit: .5 + .5 * lit });
    boilSeed('arc' + Math.floor(t * 12));
    if (fl > .35) { lightning(WORK[0] + 40, WORK[1] - 20, WORK[0] + 260 * (hash(Math.floor(t * 5) + 3) - .5) * 2, G - 20, NRG.lightning, { amp: .15, r: 50 }); lightning(WORK[0] - 30, WORK[1], WORK[0] - 240 - 200 * hash(Math.floor(t * 5) + 7), 560 + 200 * hash(Math.floor(t * 5) + 9), NRG.lightning, { amp: .14, r: 40, br: 1 }); }
    const hot = K(t, 'p059.1:glimpses of white-hot metal', 'p059.1:The sputter');
    glow(...WORK, 90, '#FFE2B0', .5 + .4 * hot); glow(...WORK, 40, NRG.white, .7);
    [[F1.x - 40, 640], [F1.x + 40, 640]].forEach(([x, y]) => beam(x, y, WORK[0], WORK[1], 14, 8, FORCE, 1, { washOp: 40, splash: false }));
    camEnd();
    inn(lt, .3, PULP.w[4]);
  }

  // ---------- R: the tiers ----------
  function R_(t, lt, dur) {
    HALFTONE = .3;
    const fl = hash(Math.floor(t * 4)), lit = fl > .5 ? fl : .2;
    camBegin(980, 640, lerp(1.1, .92, ease(lt / dur)));
    hallBack(t, { dark: .91 - .3 * lit }); tiers(t, lit);
    f1(t, { reach: [[WORK[0] - 40, WORK[1] - 30], [WORK[0] + 30, WORK[1] - 45], [WORK[0] + 45, WORK[1] + 15]], writhe: .8, hum: lit, lit: .6 });
    glow(...WORK, 110, '#FFE2B0', .6);
    roalStand(t, 330, { look: .4 });
    camEnd();
  }

  // ---------- S: the thing revealed ----------
  function S_(t, lt, dur) {
    HALFTONE = .3;
    camBegin(WORK[0] + 80, WORK[1] - 60, 1.8);
    hallBack(t, { dark: .89 });
    const roll = ease(K(t, 'p060.1:straightened', 'p060.1:rolled back+1'));
    const reach = [[WORK[0] - 50, WORK[1] - 30], [WORK[0] + 30, WORK[1] - 55], [WORK[0] + 55, WORK[1] + 15]].map(([x, y], i) => [lerp(x, F1.x - 160 + i * 40, roll), lerp(y, 700 + i * 30, roll)]);
    f1(t, { reach, writhe: 1 - roll, hum: .4 * (1 - K(t, 'p060.1:softened', 'p060.1:sigh')) + .15, lit: .5 });
    const three = K(t, 'p060.1:but three beams', 'p060.1:but three beams+.8');
    if (three > 0) [-50, 0, 50].forEach(dx => beam(F1.x + dx, 660, WORK[0] + dx * .2, WORK[1], 10, 6, FORCE, three, { washOp: 40, splash: false }));
    const whole = K(t, 'p060.1:held the structure', 'p060.1:It was a small thing');
    glow(...WORK, 120, NRG.white, .3 + .3 * (1 - whole));
    f2At(t);
    if (whole < 1) { boilSeed('unf'); wash(ellPts(WORK[0] - 20, WORK[1], 70 * (1 - whole), 26, 14), 0, { op: .8 * (1 - whole) }); }
    camEnd();
  }

  // ---------- T: half the size of Roal ----------
  function T_(t, lt, dur) {
    HALFTONE = .3;
    camBegin(WORK[0] - 60, 820, 2.2);
    hallBack(t, { dark: .89 });
    [-50, 0, 50].forEach(dx => beam(WORK[0] + 200 + dx, 500, WORK[0] + dx * .2, WORK[1], 10, 6, FORCE, 1, { washOp: 40, splash: false }));
    glow(...WORK, 100, NRG.white, .3);
    f2At(t);
    roalStand(t, WORK[0] - 170, { look: -.1 });
    camEnd();
  }

  // ---------- U: the birth (our painting of Morey's moment) ----------
  function U_(t, lt, dur) {
    HALFTONE = .3;
    const roar = ease(K(t, 'p060.1:Suddenly the generators', 'p060.1:An enormous aura')), bolt = K(t, 'p060.1:shot through', 'p060.1:shot through+.5');
    const shield = K(t, 'p060.1:An enormous aura', 'p060.1:An enormous aura+.5');
    const [sx, sy] = shakeXY(t, 4 * roar);
    camBegin(WORK[0] + 170 + sx, lerp(640, 600, ease(lt / dur)) + sy, 1.55 + .1 * ease(lt / dur));
    hallBack(t, { dark: .9 - .3 * roar }); tiers(t, roar);
    f1(t, { reach: [[WORK[0] + 40, WORK[1] - 20], [WORK[0] + 70, WORK[1] + 15]], writhe: .2, hum: roar, lit: roar });
    aura(...WORK, 120 + 220 * roar, NRG.white, .4 + .6 * roar, t);
    push(); translate(...WORK); rotate(.45); translate(-WORK[0], -WORK[1]); f2At(t, { newborn: roar > .3 }); pop();   // tilted in the aura, nose down, as Morey has it
    if (bolt > 0) { boilSeed('bolt' + Math.floor(t * 12)); lightning(WORK[0] - 40, WORK[1], WORK[0] - 300, G - 10, NRG.lightning, { amp: .15 }); lightning(WORK[0] + 60, WORK[1] + 20, WORK[0] + 260, G, NRG.lightning, { amp: .12 }); lightning(WORK[0], WORK[1] - 40, WORK[0] - 120, 420, NRG.lightning, { amp: .12, br: 1 }); glow(...WORK, 520, NRG.lightning, .4 * bolt); }
    camEnd();
    // Roal, close in the foreground at the left, lit by it, his arm thrown up across his face
    const r = DES.personSide(260, 1150, 130, t, { pose: shield > 0 ? DES.POSE.shield : DES.POSE.stand, look: .35, key: 'ufg' });
    glow(r.head[0] + 40, r.head[1], 260, NRG.white, .25 * roar);
  }
  // ---------- V: Morey's page ----------
  const MOREY = Object.assign(new Image(), { src: 'assets/ref/morey_1932_p415.jpg' });
  let moreyG = null;
  function V_(t, lt, dur) {
    HALFTONE = 0;
    U_(t, lt + (C('p060.1:blue lightning+0.8') - S.U[0]), dur);   // our painting, under the dissolve
    if (!moreyG && MOREY.complete && MOREY.naturalWidth) { moreyG = createGraphics(MOREY.naturalWidth / 2, MOREY.naturalHeight / 2); moreyG.drawingContext.drawImage(MOREY, 0, 0, moreyG.width, moreyG.height); }
    if (!moreyG) return;
    const a = clamp(lt / 1.2) * (1 - seg(lt, dur - .8, dur)), h = 1040 * (1 + .02 * lt / dur), w = h * moreyG.width / moreyG.height;
    flushBrush();
    push(); tint(255, 255 * a); paint(rectPts(-60, -60, W + 120, H + 120), { wash: PULP.paper, washOp: 255 * a, ink: null }); flushBrush();
    blendMode(MULTIPLY); tint(255, 255 * a); image(moreyG, W / 2 - w / 2, H / 2 - h / 2, w, h); blendMode(BLEND); noTint(); pop();
  }

  // ---------- W: lightning ----------
  function W_(t, lt, dur) {
    HALFTONE = .3;
    const s1 = C('p060.1:Lightning cracked'), s2 = C('p060.1:to one machine'), struck = K(t, 'p060.1:to one machine', 'p060.1:too close+.5');
    const [sx, sy] = shakeXY(t, (t > s1 && t < s1 + .4) || (t > s2 && t < s2 + .4) ? 9 : 2);
    camBegin(WORK[0] + 60 + sx, 760 + sy, 1.2);
    hallBack(t, { dark: .78 }); tiers(t, .8, { skip: 700 });
    f1(t, { reach: [[WORK[0] + 30, WORK[1] - 30], [WORK[0] + 60, WORK[1] + 10]], hum: 1, lit: 1 });
    aura(...WORK, 300, NRG.white, 1, t); f2At(t, { newborn: true });
    boilSeed('wb' + Math.floor(t * 12));
    if (t > s1) lightning(F1.x - 60, 700, F1.x - 260, G, NRG.lightning, { amp: .18 });
    const mx = 640, mg = 920 + 80 * easeIn(clamp(struck * 1.5 - .5));
    if (t > s2) lightning(WORK[0] - 40, WORK[1], mx, mg - 160, NRG.lightning, { amp: .14 });
    DES.machine(mx, mg, 16, t, { r: 1.6, h: 3, d: 2, arms: 3, dark: struck > .3, label: null });
    if (struck > 0) glow(mx, mg - 90, 160 * (1 - struck * .5), NRG.lightning, .7 * (1 - struck * .5));
    roalStand(t, WORK[0] - 360, { pose: DES.POSE.shield, look: .3 });
    camEnd();
  }

  // ---------- X: F-1 falls ----------
  function X_(t, lt, dur) {
    HALFTONE = .3;
    const snap = C('p060.1:dull snap'), fall = easeIn(K(t, 'p060.1:fell heavily', 'p060.1:fell heavily+.5')), land = C('p060.1:fell heavily+.5');
    const [sx, sy] = shakeXY(t, t > land && t < land + .5 ? 12 * (1 - seg(t, land, land + .5)) : 0);
    camBegin(1050 + sx, 720 + sy, 1.1);
    hallBack(t, { dark: t > snap ? .82 : .55 }); tiers(t, t > snap ? .1 : .7, { skip: 700 });
    f1(t, { fall, dark: t > snap, hum: t > snap ? 0 : .8, lit: t > snap ? 0 : .8 });
    DES.machine(660, 1000, 16, t, { r: 1.6, h: 3, d: 3, arms: 3, dark: true, hover: .1 });
    if (t < snap + .3) aura(...WORK, 160, NRG.white, .8, t); else glow(...WORK, 80, '#E6EEFF', .35);
    f2At(t);
    if (t > land) { boilSeed('dust'); const d = seg(t, land, land + 3); paint(ellPts(F1.x, F1.g, 260 + 200 * d, 50 + 30 * d, 20, 20), { fill: D[1], fillOp: 90 * (1 - d), bleed: .4, ink: null }); }
    roalStand(t, WORK[0] - 360, { look: .1 });
    camEnd();
  }

  // ---------- Y: held on its own power ----------
  function Y_(t, lt, dur) {
    HALFTONE = .3;
    camBegin(WORK[0] + 60, WORK[1] + 20, 1.6 + .25 * ease(lt / dur));
    hallBack(t, { dark: .91 });
    f1(t, { fall: 1, dark: true });
    glow(...WORK, 90, '#E6EEFF', .35 + .1 * wob(t, .5));
    f2At(t);
    camEnd();
  }

  // ---------- Z: waves of thought ----------
  function Z_(t, lt, dur) {
    HALFTONE = .3;
    camBegin(1000, 720, 1.05);
    hallBack(t, { dark: .90 }); tiers(t, .3);
    f1(t, { fall: 1, dark: true });
    DES.machine(660, 1000, 16, t, { r: 1.6, h: 3, d: 3, arms: 3, dark: true, hover: .1 });
    thoughtRings(...WORK, t, C('p062.1:From it came waves'), C('p062.2$'));
    glow(...WORK, 80, '#E6EEFF', .35);
    f2At(t);
    roalStand(t, WORK[0] - 360, { look: .1 });
    camEnd();
  }

  // ---------- AA: F-1 unmade ----------
  function AA(t, lt, dur) {
    HALFTONE = .3;
    camBegin(1100, 760, 1.15);
    hallBack(t, { dark: .91 });
    const flood = K(t, 'p063.1:From the floating machine', 'p063.1:down a straight channel+1'), gone = ease(K(t, 'p063.1:float back along it', 'p063.1:In seconds+.8'));
    const tx = F1.x, ty = F1.g - 120;
    f1(t, { fall: 1, dark: true, gone });
    if (flood > 0) {
      const ex = lerp(WORK[0], tx, flood), ey = lerp(WORK[1], ty, flood);
      beam(WORK[0] + 40, WORK[1], ex, ey, 30, 160, '#F4EEDC', 1, { washOp: 40, a: .45, splash: flood >= 1 && gone < 1 });
      // F-1's atomic sections floating back along the stream
      if (gone > 0 && gone < 1) for (let i = 0; i < 14; i++) { const q = frac(hash(i) + (t - C('p063.1:float back along it')) * .5); boilSeed('sec' + i); const x = lerp(tx, WORK[0] + 60, q), y = lerp(ty, WORK[1], q) + (hash(i * 3) - .5) * 80 * (1 - q); wash(rectPts(x - 8, y - 6, 16, 12), 1, { ink: true, sw: .4, op: 1 - q }); glow(x, y, 18, '#F4EEDC', .3); }
    }
    glow(...WORK, 80, '#E6EEFF', .35);
    f2At(t);
    camEnd();
  }

  // ---------- AB: the Ultimate Energy ----------
  function AB(t, lt, dur) {
    HALFTONE = .3;
    const pan = ease(K(t, 'p064.1:as they are in you', 'p064.1:nor molecular+1'));
    camBegin(lerp(WORK[0] + 120, WORK[0] - 140, pan), WORK[1] - 20, 2);
    hallBack(t, { dark: .90 }); tiers(t, .3);
    roalStand(t, WORK[0] - 300, { look: .1 });
    const core = K(t, 'p064.1:The Ultimate Energy', 'p064.1:is generated');
    glow(...WORK, 90 + 40 * core, NRG.white, .35 + .4 * core);
    f2At(t);
    if (core > 0) { glow(WORK[0] + 10, WORK[1], 40, NRG.white, .7 * core); }
    thoughtRings(...WORK, t, C('p064.1'), C('p064.1$'), { r1: 380 });
    camEnd();
  }

  // ---------- AC: all memories ----------
  function AC(t, lt, dur) {
    HALFTONE = .3;
    camBegin(WORK[0], WORK[1], 2.2 + .3 * ease(lt / dur));
    hallBack(t, { dark: .93 });
    thoughtRings(...WORK, t, C('p064.1'), C('p064.1$'), { r1: 380 });
    // memories drifting in the rings: towers of 2538, a torpedo of the void, a green beam
    const mem = K(t, 'p064.1:Already they hold', 'p064.1:known and seen'), fade = 1 - K(t, 'p064.1:I shall make others', 'p064.1$');
    if (mem > 0) for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU + t * .15, x = WORK[0] + Math.cos(a) * 260, y = WORK[1] + Math.sin(a) * 150, op = mem * fade * .8;
      boilSeed('mem' + i);
      if (i % 3 === 0) { for (let k = 0; k < 3; k++) wash(rectPts(x - 30 + k * 22, y - 30 - 25 * hash(k + i), 14, 50 + 25 * hash(k + i)), 0, { op }); }
      else if (i % 3 === 1) wash(ellPts(x, y, 50, 10, 14), 0, { op });
      else glow(x, y, 40, NRG.death, .5 * op);
    }
    glow(...WORK, 90, NRG.white, .5);
    f2At(t);
    camEnd();
  }

  // ---------- AD: forces that laugh at matter ----------
  const MAKE = [620, 830];
  function AD(t, lt, dur) {
    HALFTONE = .3;
    const died = C('p065.1:died');
    camBegin(lerp(800, 700, ease(lt / dur)), 780, 1.6 + .3 * ease(lt / dur));
    hallBack(t, { dark: .93 });
    f2At(t);
    const strain = t > died ? 1 + .15 * Math.sin(t * 20) : 1;
    for (let i = 0; i < 7; i++) { const a = t * (1.3 + i * .2) + i, r = (40 + 30 * Math.sin(t * 1.7 + i)) * strain; glow(MAKE[0] + Math.cos(a) * r, MAKE[1] + Math.sin(a) * r * .7, 50, [NRG.white, FORCE, '#F4EEDC'][i % 3], .5); }
    glow(...MAKE, 130, FORCE, .4);
    beam(WORK[0] - 40, WORK[1], MAKE[0] + 40, MAKE[1], 8, 30, FORCE, 1, { washOp: 30, splash: false, a: .3 });
    if (t > C('p065.1:Lurid flares')) for (let i = 0; i < 3; i++) { const q = frac(t * .7 + i / 3); glow(MAKE[0] + (hash(i) - .5) * 80, MAKE[1] - q * 260, 40 * (1 - q), '#F2F0FF', .7 * (1 - q)); }
    // the electrons, futilely resisting: little pale motes dodging, caught one by one
    for (let i = 0; i < 6; i++) { const caught = t > C('p065.1:futilely') + i * 1.4, a = t * 2 + i * 1.3, r = caught ? 20 : 120 + 30 * Math.sin(t * 3 + i); electron(MAKE[0] + Math.cos(a) * r, MAKE[1] + Math.sin(a) * r * .6, 7); }
    camEnd();
  }

  // ---------- AE: a ruler is made ----------
  function AE(t, lt, dur) {
    HALFTONE = .3;
    camBegin(MAKE[0] + 20, MAKE[1] - 10, 3);
    hallBack(t, { dark: .92 });
    const fade = ease(lt / 2.5);
    glow(...MAKE, 160 * (1 - fade) + 40, FORCE, .5 * (1 - fade) + .1);
    DES.cru1(MAKE[0], MAKE[1] + 2.2 * 34 - 20, 34, t, { hover: 2.2, unlit: true });
    camEnd();
  }

  // ---------- AF: Roal asks ----------
  function AF(t, lt, dur) {
    HALFTONE = .3;
    const step = ease(K(t, 'p067.1', 'p067.1+1')), turn = K(t, 'p068.3:It is a coordinator', 'p068.3:It is a coordinator+.6');
    camBegin(760, 820, 1.75);
    hallBack(t, { dark: .87 });
    DES.cru1(MAKE[0] + 30, G - 40, 34, t, { hover: 2.6, unlit: true });
    roalStand(t, 480 + 40 * step, { look: .15 });
    DES.f2(WORK[0] - 60, G, FS, t, { hover: 6, view: turn > .5 ? 'side' : 'side' });
    if (t > C('p068.1') && t < C('p068.3$')) glow(WORK[0] - 60, G - 6 * FS, 60, '#E6EEFF', .25 + .2 * Math.abs(wob(t, 2)));
    camEnd();
  }

  // ---------- AG: C-R-U-1 ----------
  function AG(t, lt, dur) {
    HALFTONE = .3;
    const name = K(t, 'p069.2:Force played', 'p069.2:in dully glowing');
    camBegin(MAKE[0] + 30, G - 150, 3 + .5 * ease(K(t, 'p069.2:on its sides appeared', 'p069.2$')));
    hallBack(t, { dark: .90 });
    if (t > C('p069.2:Force played')) glow(MAKE[0] + 30, G - 150, 120, FORCE, .3 * (1 - name * .5));
    DES.cru1(MAKE[0] + 30, G - 40, 34, t, { hover: 2.6, unlit: name < .05, glowK: name, lit: t > C('p069.1') && t < C('p069.1$') ? .6 : 0 });
    camEnd();
  }

  // ---------- AH: some life-form ----------
  function AH(t, lt, dur) {
    HALFTONE = .3;
    camBegin(WORK[0] - 60, G - 170, 3.2);
    hallBack(t, { dark: .87 });
    glow(WORK[0] - 60, G - 6 * FS, 60, '#E6EEFF', .3);
    DES.f2(WORK[0] - 60, G, FS, t, { hover: 6, flip: true });
    camEnd();
  }

  // ---------- AI: the guinea pig ----------
  const CAGE = [700, G];
  function AI(t, lt, dur) {
    HALFTONE = .3;
    const k = ease(K(t, 'p071.1', 'p071.1:which held')), down = ease(K(t, 'p071.1:which held', 'p071.1:a guinea pig+1'));
    camBegin(760, 900, 2.5);
    hallBack(t, { dark: .86 });
    DES.f2(WORK[0] - 60, G, FS, t, { hover: 6 });
    // the life-form investigator: a small machine of the family, its tentacle carrying the cage
    const ix = lerp(300, CAGE[0] - 110, k), m = DES.machine(ix, G - 30 * (1 - down), 14, t, { r: 1.4, h: 2.6, dh: 1, d: 1, arms: 2, reach: 3 });
    const cy = lerp(G - 70, G, down), handle = [CAGE[0], cy - 1.2 * 90 * .9 - 90 * .3 + 90 * .9];
    DES.tentacle([[ix + 14, m.arm], [ix + 60, m.arm + 10], [lerp(ix + 60, CAGE[0], .6), cy - 140], [CAGE[0], cy - 108]], 5, 3, 4, { grip: true });
    DES.cage(CAGE[0], cy, 90, t);
    camEnd();
  }

  // ---------- AJ: the pale-green beam ----------
  function AJ(t, lt, dur) {
    HALFTONE = .3;
    const forces = K(t, 'p071.1:Forces played', 'p071.1:moments later'), g0 = C('p071.1:came a pale-green beam'), g1 = C('p071.1:fell dead');
    camBegin(lerp(820, 760, ease(K(t, 'p071.1:and the little animal', 'p071.1$+1'))), 880, lerp(1.9, 2.4, ease(K(t, 'p071.1:and the little animal', 'p071.1$+1'))));
    hallBack(t, { dark: .87 });
    const fx = WORK[0] - 60, fy = G - 6 * FS;
    for (let i = 0; i < 5; i++) if (forces > 0) { const a = t * 2 + i * 1.3; glow(fx + Math.cos(a) * 60, fy + 40 + Math.sin(a) * 20, 30, FORCE, .4 * forces); }
    DES.f2(fx, G, FS, t, { hover: 6 });
    const beamK = seg(t, g0, g0 + .5) * (1 - seg(t, g1 + .5, g1 + 1.2));
    if (beamK > 0) beam(fx - 40, fy + 10, CAGE[0] - 120, G - 40, 6, 30, NRG.death, beamK, { washOp: 60 });
    DES.cage(CAGE[0], G, 90, t, { dead: ease(K(t, 'p071.1:and the little animal', 'p071.1:fell dead')) });
    camEnd();
  }

  // ---------- AK: no screen ----------
  function AK(t, lt, dur) {
    HALFTONE = .3;
    const tilt = ease(K(t, 'p072.1:Let machines be made', 'p072.1$'));
    camBegin(900, lerp(820, 380, tilt), lerp(1.5, 1.2, tilt));
    hallBack(t, { dark: .86 }); tiers(t, .3);
    DES.cage(CAGE[0], G, 90, t, { dead: 1 });
    DES.f2(WORK[0] - 60, G, FS, t, { hover: 6 });
    roalStand(t, 380, { look: .2 });
    // the enemy on the screens: torpedoes of the void hanging in three of them, with a faint green
    if (tilt > 0) for (let i = 0; i < 3; i++) { const sx = 610 + i * 252, sy = 210; DES.oShip(sx, sy, 150, t, { d: 3 }); glow(sx, sy + 30, 60, NRG.death, .25 * tilt); }
    camEnd();
  }

  // ---------- AL: faster than man ever could ----------
  function rock(t, dawn) {
    boilSeed('sky'); paint(rectPts(-200, -200, W + 400, 900), { wash: mixCol(D[2], D[0], dawn), washOp: 255, fill: D[1], fillOp: 80, bleed: .3, ink: null });
    blooms(0, 600, 6, 1, 73, .4);
    boilSeed('mtn'); wash([[-200, 700], [200, 520], [420, 600], [700, 470], [980, 590], [1300, 500], [1600, 610], [2100, 540], [2100, 760], [-200, 760]], 2, { ink: true, sw: .5 });
    boilSeed('rock'); wash([[-200, 720], [2100, 700], [2100, 1300], [-200, 1300]], 3, { op: 1.1 });
    for (let i = 0; i < 18; i++) { boilSeed('crack' + i); const x = hash(i * 3) * W, y = 760 + hash(i * 5) * 300; inkLine([[x, y], [x + 60 + 80 * hash(i), y + 10 * (hash(i * 7) - .5)]], .4, D[4]); }
  }
  function greatMachine(x, g, k, t) {   // the great automatic machine, built in steps: k 0..1
    const s = 22, levels = Math.floor(k * 6);
    for (let i = 0; i < levels; i++) { boilSeed('gm' + i); const w = (9 - i) * s, y = g - i * s * 1.6; wash(rrPts(x - w, y - s * 1.6, w * 2, s * 1.6, s * .3), 2 + (i % 2), { ink: true, sw: .6 }); for (let j = -3; j <= 3; j++) inkLine([[x + j * w / 4, y], [x + j * w / 4, y - s * 1.6]], .4, D[4]); }
    if (k >= 1) { boilSeed('gmtop'); DES.dcase(x, g - 6 * s * 1.6, 3 * s, 2.5 * s, 1.5 * s, 1, { shine: true, rings: [.5] }); }
    return [x, g - 6 * s * 1.6 - 4 * s];
  }
  function AL(t, lt, dur) {
    HALFTONE = .3;
    const k = K(t, 'p073.1:In a matter of hours', 'p073.1:they had built+1.5'), dawn = .2 + .5 * k;
    camBegin(W / 2, H / 2, 1);
    rock(t, dawn);
    greatMachine(960, 860, k, t);
    for (let i = 0; i < 10; i++) { const a = t * .8 + i * .63, x = 960 + Math.cos(a) * (240 + 40 * hash(i)), y = 760 - 120 * k + Math.sin(a) * 60; DES.machine(x, y + 60, 6, t, { arms: 2, d: 1 }); }
    if (t > C('p073.1:under the direction')) DES.cru1(1400, 640, 30, t, { hover: 2.5, glowK: 1 });
    camEnd();
    if (lt < .3) brushWipe(.5 + lt / .6, [PULP.w[3], PULP.w[2]]);
  }

  // ---------- AM: up and out ----------
  function AM(t, lt, dur) {
    HALFTONE = .3;
    const up = ease(K(t, 'p073.1:floating up and out', 'p073.1$+4'));
    camBegin(W / 2, lerp(H / 2, -300, up), 1);
    rock(t, .75);
    const top = greatMachine(960, 860, 1, t);
    boilSeed('stars'); for (let i = 0; i < 40; i++) glow(hash(i * 3.1) * W, -900 + hash(i * 7.7) * 900, 8, NRG.white, .4 * up);
    const go = C('p073.1:In hours more');
    for (let i = 0; i < 120; i++) { const st = go + i * .07, q = (t - st) / 6; if (q <= 0) continue;
      const x = top[0] + (hash(i) - .5) * 1400 * q, y = top[1] - q * (900 + 600 * hash(i * 3)); const sz = 16 * (1 - q * .5);
      if (sz > 3) DES.mote(x, y, sz, t, { ang: -Math.PI / 2 + (hash(i) - .5) * .8, drive: true }); else glow(x, y, 6, NRG.white, .5); }
    camEnd();
    if (lt > dur - 1.5) flash(seg(lt, dur - 1.5, dur), PULP.paper);
  }

  shots([[S.A[0], A], [S.B[0], B], [S.C[0], C_], [S.D[0], D_], [S.E[0], E], [S.F[0], F], [S.G[0], G_], [S.H[0], H_], [S.I[0], I_], [S.J[0], J], [S.K[0], K_],
    [S.L[0], L_], [S.M[0], M], [S.N[0], N_], [S.O[0], O], [S.P[0], P_], [S.Q[0], Q_], [S.R[0], R_], [S.S[0], S_], [S.T[0], T_], [S.U[0], U_], [S.V[0], V_],
    [S.W[0], W_], [S.X[0], X_], [S.Y[0], Y_], [S.Z[0], Z_], [S.AA[0], AA], [S.AB[0], AB], [S.AC[0], AC], [S.AD[0], AD], [S.AE[0], AE], [S.AF[0], AF],
    [S.AG[0], AG], [S.AH[0], AH], [S.AI[0], AI], [S.AJ[0], AJ], [S.AK[0], AK], [S.AL[0], AL], [S.AM[0], AM]]);
})();
