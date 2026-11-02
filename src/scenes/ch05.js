// ch05.js: chapter 5, The Hydrogen Wall: the pilot (PLAN.md §6). It draws script/boards/ch05.yaml; every time in it is
// a cue against the voice (src/gen/ch05.js, from tools/timeline.mjs), so it holds when a line is voiced again.
// studio.html?chapter=5. This is the draft pass (Round 5's notes): the film is continuous. The hall is one world, drawn
// whole at every moment, and each figure's place in it is a function of time, so things walk, drift and turn from mark
// to mark instead of jumping; the camera moves between the storyboard's framings (camPath) instead of cutting; the
// other spaces (the page, Roal's eyes, F-1's lens, the science plate, Morey's page, the rock) are reached by matched
// dissolves and pushes. The storyboard's shots are now framings and beats within that, and its boards are stills of it.
(() => {
  const D = PULP.w, INK = PULP.ink, S = CHAPTER.shots, C = cue;
  const K = (t, a, b) => seg(t, C(a), C(b)), ez = (t, a, b) => ease(seg(t, a, b));
  const win = (t, a, b, fi = .5, fo = fi) => clamp(Math.min((t - a) / fi, (b - t) / fo));    // 1 inside [a, b], faded at both ends
  const lerpP = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  const T0 = id => S[id][0], T1 = id => S[id][1];
  const FORCE = '#CFE0FF';                       // F-1's force shafts: the text gives them no colour, so a cold white
  // a setting that steps from key to key, easing over d seconds (or the key's own third value) after each key's time
  function steps(t, keys, d = 1.2) { let v = keys[0][1]; for (let i = 1; i < keys.length && t >= keys[i][0]; i++) v = lerp(v, keys[i][1], ease((t - keys[i][0]) / (keys[i][2] ?? d))); return v; }

  // ---------- acting from the voice: mouths and lenses move with the words ----------
  const SAID = {}; for (const l of CHAPTER.lines) (SAID[l.who] ||= []).push(l);
  function talk(t, who) {
    for (const l of SAID[who] || []) { if (t < l.t0 - .1 || t > l.t1 + .1) continue;
      for (const w of l.words) if (t >= w[1] && t <= w[2]) return Math.pow(Math.sin(Math.PI * Math.min(1, (t - w[1]) / Math.max(.1, w[2] - w[1]) * 1.6)), .7) * (.55 + .45 * Math.abs(Math.sin(t * 19))); }
    return 0;
  }
  const blink = (t, seed) => { const p = frac(t / 3.9 + hash(seed)); return p < .04 ? Math.sin(Math.PI * p / .04) : 0; };

  // ---------- the hall: one set ----------
  // world layout (px): the floor's back edge at 864, figures stand at G; Roal's couch at the left, F-1's place at the
  // right, the working point between them, the tiers of science-machines floating in a ring behind and around
  const G = 1000, F1 = { x: 1420, g: 975, s: 50 }, WORK = [1000, 790], COUCH = { x: 420, s: 44 }, RS = 44, RU = RS * 6 / 7.4, FS = 30;
  const MAKE = [1330, 830], CRU = [1330, 810], CAGE = [760, G], SEAT = G - 1.72 * COUCH.s, F2HOV = (G - WORK[1]) / FS;
  const night = op => { stillSeed('night'); paint(rectPts(-500, -400, 3000, 1900), { wash: PULP.black, washOp: 215 * op, fill: '#3B322B', fillOp: 60, bleed: .2, tex: .4, ink: null }); };

  // the moments everything keys to
  const tCome = C('p054.1'), tBack = C('p058.1') + .3, tSudden = C('p058.3:Suddenly'), tTent = C('p058.3:tentacles became');
  const tStraight = C('p060.1:straightened'), tRolled = C('p060.1:rolled back') + 1, tThree = C('p060.1:but three beams'), tSmall = C('p060.1:It was a small thing');
  const tGen = C('p060.1:Suddenly the generators'), tAura = C('p060.1:An enormous aura'), tShot = C('p060.1:shot through');
  const tCrack = C('p060.1:Lightning cracked'), tHit = C('p060.1:to one machine'), tSnap = C('p060.1:dull snap'), tFell = C('p060.1:fell heavily');
  const tMake = C('p064.1:I shall make others'), tCage = C('p071.1'), tHeld = C('p071.1:which held'), tPig = C('p071.1:a guinea pig') + 1;
  const tGreen = C('p071.1:came a pale-green beam'), tDead = C('p071.1:fell dead');

  // a science-machine far off on its tier: the family form in silhouette, its lens turned toward the work and lit by
  // the flashes
  function farMachine(x, y, s, d, lit, i, lx) {
    boilSeed('fm' + i);
    wash(ellPts(x, y, s * 2, s * .4, 14), d + 1, { ink: true, sw: .4 });
    wash([[x - s * 1.5, y - s * .6], [x - s * 1.5, y - s * 3.4], [x - s * 1.1, y - s * 4.3], [x + s * 1.1, y - s * 4.3], [x + s * 1.5, y - s * 3.4], [x + s * 1.5, y - s * .6]], d, { ink: true, sw: .45, curv: .3 });
    inkLine([[x - s * 1.5, y - s * 2.2], [x + s * 1.5, y - s * 2.2]], .35, D[4]);
    const ex = x + lx * s * .7; paint(ellPts(ex, y - s * 3.6, s * .5, s * .45, 10), { wash: mixCol(D[4], '#EFE6D2', .2 + .7 * lit), washOp: 230, ink: PULP.ink, sw: .3 });
    glow(ex, y - s * 3.6, s * (.8 + 1.6 * lit), NRG.white, .3 + .6 * lit);
  }
  // "floating tiers of science-machines, watching steadily" (p059): two rings of them around F-1's place. The far side
  // is small, high and dim against the screens; the near side is the family drawn whole, larger and lower, floating
  // left and right of the floor so the work stays clear. Every lens turns to the working point.
  function tierRing(t, lit, near) {
    for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) {
      const th = (i + .5 * r) / 12 * TAU + .03 * wob(t, .015, r), z = Math.sin(th);
      if ((z > 0) !== near || (near && Math.abs(Math.cos(th)) < .6)) continue;
      const x = 1150 + Math.cos(th) * (1000 + r * 90) + 10 * wob(t, .07, i), y = 430 + r * 130 + z * (90 + r * 30) + 6 * wob(t, .11, i * .7);
      const l = lit * (.5 + .5 * hash(i + r * 12 + Math.floor(t * 6))), look = clamp((WORK[0] - x) / 900, -1, 1);
      if (!near) farMachine(x, y, (12 + r * 3) * (1 + .35 * z), z < -.5 ? 3 : 2, l, r * 12 + i, look);
      else { const s = 13 + r * 3; DES.machine(x, G, s, t, { r: 1.5, h: 3, dh: 1, d: 2 + r, arms: 3, reach: 3, hover: (G - y) / s, face: look * .9, lit: l, label: null }); glow(x + look * s * .8, y - s * 4.6, s * (1 + 1.6 * l), NRG.white, .2 + .5 * l); }
    }
  }

  // ---------- F-1 ----------
  // It drifts to Roal's couch to talk (p054), and back to its place to work (p058); its lens turns down to him
  const f1In = t => ez(t, tCome, tCome + 7), f1Near = t => f1In(t) * (1 - ez(t, tBack, tBack + 6));
  const f1X = t => lerp(F1.x, 860, f1Near(t)), f1Hov = t => lerp(3, 1, f1Near(t));
  const f1Face = t => steps(t, [[0, 0], [C('p052.2'), -.55], [tBack + 2, 0, 3]], 1.2);
  const f1Eye = t => [f1X(t) + Math.sin(f1Face(t)) * 3.4 * F1.s * .55, F1.g - (f1Hov(t) + .7 + 7.5 + 2.6 * .42) * F1.s];   // as DES.machine places it
  // its tentacles: hanging until the work starts, then six of them weaving round the working point; rolled back when
  // it's done; two reaching to hold the newborn in the aura
  const hangTip = (x, i) => { const sx = x + (i - 2.5) * F1.s * 1.1; return [sx + (sx - x) * .35, F1.g - 40]; };
  const around = (t, i) => { const a = i * 1.05 + .3, r = 60 + 18 * (i % 3); return [WORK[0] + Math.cos(a) * r + 30 * wob(t, 3, i * .37), WORK[1] + Math.sin(a) * r * .6 + 30 * wob(t, 2.6, i * .53)]; };
  function reachAt(t, x) {
    if (t < tTent || t > tSnap) return null;
    return [0, 1, 2, 3, 4, 5].map(i => {
      const h = hangTip(x, i); let p = lerpP(h, around(t, i), ez(t, tTent, tTent + 1.2));
      p = lerpP(p, h, ez(t, tStraight, tRolled));
      if (i < 2) p = lerpP(p, [WORK[0] + 40 + 30 * i + 12 * wob(t, .6, i), WORK[1] - 20 + 35 * i], ez(t, tGen, tGen + 1.2));
      return p;
    });
  }
  function f1(t, o) {
    const x = f1X(t), g = F1.g, s = F1.s, fall = o.fall || 0, land = tFell + .5;
    if (o.gone >= 1) return;
    // the fall has weight: a lurch back as the snap takes it, the drop, a bounce on landing, and settling
    const lurch = -.05 * Math.sin(Math.PI * seg(t, tSnap, tFell + .1)), bounce = t > land ? spring(t, land, 5, 14) : 0;
    push(); translate(x, g); rotate(lurch + fall * .3 - .06 * bounce); if (o.gone) scale(1, 1 - o.gone); translate(-x, -g);
    const reach = reachAt(t, x), m = DES.f1(x, g, s, t, { arms: reach ? 0 : 8, hover: lerp(f1Hov(t), .2, easeIn(fall)) + .5 * Math.abs(bounce), lit: o.lit, dark: o.dark, face: f1Face(t) });
    if (reach) reach.forEach((p, i) => { const sx = x + (i - 2.5) * s * 1.1, sy = m.arm, w = o.writhe || 0;
      const mx = lerp(sx, p[0], .5) + s * 2.2 * wob(t, .9 + .4 * w, i * .37) * (.3 + w), my = lerp(sy, p[1], .5) + s * 1.5 * wob(t, .7 + .5 * w, i * .21) * (.3 + w);
      DES.tentacle([[sx, sy], [lerp(sx, mx, .5), lerp(sy, my, .6) + s], [mx, my], [lerp(mx, p[0], .6), lerp(my, p[1], .6)], p], .34 * s, .16 * s, 4); });
    if (o.hum) for (let k = 0; k < 5; k++) glow(x, m.yb - m.h * (.1 + k * .2), m.r * 1.1, NRG.white, .22 * o.hum);
    pop();
    return m;
  }
  // the science-machine that drifts too close in the birth and is struck (p060); it falls beside F-1
  function stray(t) {
    const k = ez(t, tGen - 3, tGen + 8), fall = easeIn(seg(t, tFell + .1, tFell + .7)), x = lerp(1760, 1210, k), g = lerp(905, 990, k);
    push(); translate(x, g); rotate(-fall * .5); translate(-x, -g);
    DES.machine(x, g + fall * 12, 16, t, { r: 1.6, h: 3, d: 2, arms: 3, dark: t > tHit + .3, label: null, hover: lerp(1.5, .1, fall) });
    pop();
    if (t > tHit && t < tHit + 2.5) glow(x, g - 90, 160 * (1 - seg(t, tHit, tHit + 2.5) * .5), NRG.lightning, .7 * (1 - seg(t, tHit, tHit + 2.5)));
    return [x, g - 100];
  }

  // ---------- Roal ----------
  // On the couch (lying, then sitting up, p053); he gets up while F-1 hums (p058), and walks: to watch the work, to the
  // newborn's side, a step back from the aura, back out of the way when F-2 says it will make others, forward to ask.
  const tRise = C('p058.1') + .8, tRise1 = tRise + 1.5, tRise2 = tRise1 + 1.5;
  const WALKS = [[tRise2 + .2, tRise2 + 1.6, 560, 590], [C('p060.1:rolled back') + .3, C('p060.1:rolled back') + 5.5, 590, 830], [tAura, tAura + .9, 830, 770],
    [tMake + .3, tMake + 4, 770, 610], [C('p067.1') - .2, C('p067.1') + 1.2, 610, 660]];
  const mixPose = (a, b, k) => { const p = {}; for (const f in a) p[f] = lerp(a[f], b[f] ?? a[f], k); return p; };
  const LOOK = [[0, 0], [T0('D') + .4, .2, .6], [T0('D') + 1.4, .62], [tCome + 3, .45], [T0('H'), .6], [T0('M'), .55], [tRise, .1], [tRise2 + 2, .4], [C('p060.1:rolled back') + 5, -.15], [tGen, .3],
    [tFell + 2, .1], [C('p064.1:nor molecular'), .05], [C('p067.1'), .12], [C('p072.1:Let machines be made'), .3]];
  // ---------- Roal's acting, from the voice and the story's beats ----------
  // his own clauses (from one stop, ; . ? ! or a dash, to the next) each carry a gesture of the near hand; each clause
  // said to him ends in a small nod; he starts at the work's violence and at the guinea pig's death; he shades his eyes
  // from F-2's stream of light; and when his eyes dream (p057.2) his hand goes to his chin
  function clausesOf(ids) { const out = []; for (const l of CHAPTER.lines) { if (!ids.includes(l.id)) continue; let a = null;
    for (const w of l.words) { a ??= w[1]; if (/([.;?!—]|--)["”]?$/.test(w[0]) || w === l.words.at(-1)) { out.push([a, w[2]]); a = null; } } } return out; }
  const MINE = clausesOf(['p053.2', 'p056.1', 'p057.1']), TOLD = clausesOf(['p054.1', 'p058.2', 'p064.1', 'p068.1']);
  const GEST = [[.8, 1.9], [1.1, 2.4], [.6, 1.6]];   // the near arm (up, fore): an open hand forward, a lift, a small turn
  const bump = (t, t0, rise = .15, fall = .8) => t < t0 ? 0 : Math.min(1, (t - t0) / rise) * Math.exp(-Math.max(0, t - t0 - rise) / fall);
  const STARTS = [[tSudden, .6], [C('p059.1:sudden crashing arcs'), .8], [C('p059.1:blasting atoms'), .5], [tGen, .7], [tSnap, 1], [tFell, .8], [tDead, 1]];
  function act(t, pose) {   // lays the acting over a pose; returns how it moves his head (look) and lids
    let look = 0, lid = 0;
    for (let i = 0; i < MINE.length; i++) { const [a, b] = MINE[i]; if (b - a < .9 || t < a - .3 || t > b + .9) continue;
      const k = win(t, a - .2, b + .3, .5, .6), g = GEST[i % 3]; pose.up = lerp(pose.up, g[0], k); pose.fore = lerp(pose.fore, g[1], k); look += .05 * k * Math.sin((t - a) * 1.7); }
    for (const [, b] of TOLD) look -= .1 * Math.sin(Math.PI * clamp((t - b - .1) / .7));
    const chin = win(t, C('p057.2'), tRise - .1, 1.6, .7);
    pose.torso += .22 * chin; pose.up = lerp(pose.up, 1.05, chin); pose.fore = lerp(pose.fore, 3.45, chin); look -= .12 * chin; lid += .1 * chin;
    const s = STARTS.reduce((m, [t0, a]) => Math.max(m, bump(t, t0) * a), 0);
    pose.torso -= .12 * s; pose.up += .45 * s; pose.fore += .9 * s; look += .1 * s; lid -= .3 * s;
    const shade = win(t, C('p063.1:there broke a stream'), C('p063.1:In seconds') + 1, 1, 1.5);
    pose.up = lerp(pose.up, 1.7, .8 * shade); pose.fore = lerp(pose.fore, 3.9, .8 * shade); pose.torso -= .06 * shade; lid += .25 * shade;
    look -= .55 * win(t, tDead + .8, C('p072.1') + .5, 1, 1.5);   // down at the little animal, until F-2 speaks
    lid += .2 * ez(t, C('p072.1:Let machines be made'), C('p072.1$'));   // and the war decided, his lids lower
    return { look, lid };
  }
  function roal(t) {
    const P = DES.POSE, look = steps(t, LOOK, 1), lidBase = steps(t, [[0, .3], [T0('D'), 0, .6], [T0('H'), .1], [T0('M'), .1], [C('p057.2'), .45, 4], [tRise, 0, .5]], 1);
    const say = talk(t, 'roal');
    if (t < tRise) {   // on the couch
      const k = backOut(K(t, 'p053.1', 'p053.1+1.3')), pose = mixPose(P.lie, P.sitUp, k); pose.torso += .012 * wob(t, .22);
      const a = act(t, pose), lid = clamp(Math.max(lidBase + a.lid, blink(t, 3)));
      return DES.personSide(COUCH.x - 30 + k * 12, SEAT - .38 * RU, RS, t, { pose, look: look + a.look, lid, key: 'r', talk: say });
    }
    let lid = Math.max(lidBase, blink(t, 3)), acted = 0;
    let hip, pose, flip = false, f = 1;
    if (t < tRise1) { const k = ease(seg(t, tRise, tRise1)); pose = mixPose(P.sitUp, P.sit, k); hip = [lerp(COUCH.x - 18, 505, k), lerp(SEAT - .38 * RU, SEAT - .2 * RU, k)]; }
    else if (t < tRise2) { const k = ease(seg(t, tRise1, tRise2)); pose = mixPose(P.sit, P.stand, k); pose.torso += .55 * Math.sin(Math.PI * k); hip = [lerp(505, 560, k), lerp(SEAT - .2 * RU, G - DES.HIP * RS, k)]; }
    else {
      let x = 560, walk = null;
      for (const w of WALKS) { if (t < w[0]) break; const q = seg(t, w[0], w[1]); x = lerp(w[2], w[3], ease(q)); if (q < 1) walk = { q, d: x - w[2], back: w[3] < w[2] }; }
      pose = { ...P.stand }; hip = [x, G - DES.HIP * RS];
      // breath and a slow shift of weight, standing
      pose.torso += .015 * wob(t, .22) + .02 * wob(t, .05, .3); hip[1] += 1.5 * wob(t, .22);
      if (walk) {
        const ph = Math.PI * Math.abs(walk.d) / (1.25 * RU) * Math.sign(walk.d || 1), m = clamp(Math.min(walk.q, 1 - walk.q) * 7), sn = Math.sin(ph), cs = Math.cos(ph);
        pose.thigh = .32 * sn * m; pose.shin = (.32 * sn - .35 * Math.max(0, cs)) * m; pose.farThigh = -.32 * sn * m; pose.farShin = (-.32 * sn - .35 * Math.max(0, -cs)) * m;
        pose.up = .12 - .28 * sn * m; pose.farUp = .05 + .28 * sn * m; pose.torso += .06 * m; hip[1] -= 3 * Math.abs(cs) * m;
      }
      // walking away from the floor he turns to go, and turns back at the end (a quick squash of the profile)
      const w3 = WALKS[3]; f = 1 - 2 * ez(t, w3[0] - .1, w3[0] + .35) + 2 * ez(t, w3[1] - .1, w3[1] + .35); flip = f < 0;
      const a = act(t, pose); acted = a.look; lid = clamp(Math.max(lidBase + a.lid, blink(t, 3)));
      // his arm up across his face in the birth's light (Morey's page), down again when F-1 has fallen
      const sh = ez(t, tAura, tAura + .5) * (1 - ez(t, tFell + 1.5, tFell + 2.8)); pose = mixPose(pose, P.shield, sh);
      // asking (p067): the near hand opens toward F-2
      const ask = win(t, C('p067.1'), C('p067.1$') + .6, .4, .8); pose.up = lerp(pose.up, .55, ask); pose.fore = lerp(pose.fore, 1.5, ask);
    }
    push(); translate(hip[0], 0); scale(Math.max(.2, Math.abs(f)), 1); translate(-hip[0], 0);
    const r = DES.personSide(hip[0], hip[1], RS, t, { pose, flip, look: flip ? .05 : look + acted, lid, key: 'rs', talk: say });
    pop();
    return r;
  }
  // thought, drawn two ways: Roal's as a loose curl of pale wash, the machines' as ruled ink
  function dreamCurl(x, y, k, t, op = .6) {
    if (k <= 0 || op <= 0) return;
    const P = []; for (let i = 0; i <= 14 * k; i++) { const u = i / 14; P.push([x + u * 160 + 70 * Math.sin(u * 7 + t * .6), y - (u * 300 + 30 * Math.sin(u * 5 + t * .4))]); }
    if (P.length > 2) { boilSeed('curl'); wash(ribbon(P, 26, 6), 0, { op }); }
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
  // thought-speech's signature (PLAN.md §4): rings of light going out from the thinker, one per beat of the words
  function thoughtRings(x, y, t, t0, t1, o = {}) {
    if (t < t0) return;
    const per = o.per ?? 1.1, fade = clamp((t1 + per * 2 - t) / (per * 2));
    for (let n = 0; n < 4; n++) { const age = (t - t0) / per - n; if (age < 0) continue; const k = frac(age), r = (o.r0 ?? 40) + k * (o.r1 ?? 520), a = (1 - k) * .35 * fade;
      if ((t - t0) - n * per > t1 - t0 + per) continue;
      for (let i = 0; i < 26; i++) { const q = i / 26 * TAU; glow(x + Math.cos(q) * r, y + Math.sin(q) * r * (o.sq ?? .55), 22, o.col || '#E6EEFF', a); } }
  }
  const electron = (x, y, r, key) => { boilSeed('el' + key); paint(ellPts(x, y, r, r, 14), { wash: '#EFE6D2', washOp: 240, ink: '#B4A283', sw: .5 }); };

  // ---------- F-2 ----------
  // Born at the working point and staying there, floating on its own power. It turns as it attends: to Roal when it
  // answers him (p068), back to the ruler it made on F-1's empty floor, three-quarters toward us (p070), to the cage,
  // and its nose up to the screens (p072). Its heading: 0 faces right, π left, π/2 toward us; the side view squashes
  // through a turn (foreshortened), and only nearly nose-on becomes the front view.
  const f2Head = t => steps(t, [[0, 0], [C('p068.1') - .3, Math.PI, .8], [C('p068.3:It is a coordinator'), 0, .8], [T0('AH') - .2, 1.15, .6], [T0('AI') + .5, Math.PI, .7]]);
  function f2(t, o = {}) {
    const x = WORK[0], hd = f2Head(t), c = Math.cos(hd), tilt = .45 * ez(t, tGen, tGen + 1.5) * (1 - ez(t, tSnap, tSnap + 2.5)) - .35 * K(t, 'p072.1:Let machines be made', 'p072.1:Let machines be made+1.2') * (c < 0 ? -1 : 1);
    push(); translate(x, WORK[1]); rotate(tilt); if (Math.abs(c) >= .3) scale(c, 1); translate(-x, -WORK[1]);
    DES.f2(x, G, FS, t, { hover: F2HOV, view: Math.abs(c) < .3 ? 'front' : 'side', newborn: o.newborn });
    pop();
  }
  const f2Nose = t => [WORK[0] + Math.cos(f2Head(t)) * 4.2 * FS * .45, WORK[1] + 4];

  // ---------- the hall, whole, at time t ----------
  function symphony(t) {   // the flashes of p059: 0..1, and the envelope they live in
    const fl = hash(Math.floor(t * 5)), env = win(t, T0('Q'), T0('S') + .5, .3, 1.5);
    return { lit: (fl > .4 ? fl : .15) * env, env, fl };
  }
  const roarAt = t => ez(t, tGen, tAura) * (1 - ez(t, tSnap, tSnap + .4));
  function hallWorld(t) {
    const sym = symphony(t), roar = roarAt(t), snapped = t > tSnap, up = ez(t, C('p056.1'), C('p056.1:but a single proton')) * win(t, T0('H'), T0('M'), .1, 1);
    const dark = steps(t, [[0, .85], [T0('H'), .8], [T0('M'), .89], [T0('N'), .84], [T0('P'), .86], [T0('Q'), .93], [T0('R'), .91], [T0('S'), .89], [T0('U'), .9], [T0('W'), .78], [T0('X'), .55], [tSnap, .82, .25],
      [T0('Y'), .91], [T0('Z'), .9], [T0('AA'), .91], [T0('AC'), .93], [T0('AE'), .92], [T0('AF'), .87], [T0('AG'), .9], [T0('AH'), .87], [T0('AI'), .86]]) + .35 * up - .4 * sym.lit - .3 * roar;
    const lit = Math.max(steps(t, [[0, 0], [tSudden, .4, .3], [T0('S') + 2, .1], [T0('W'), .8, .3], [tSnap, .1, .3], [T0('Z'), .3], [T0('AE'), .15], [T0('AK'), .3]]), sym.lit, roar);
    DES.lab(-300, -150, 2520, 1300, t, { couch: false });
    night(dark);
    tierRing(t, lit, false);
    DES.couch(COUCH.x, G, COUCH.s);

    // F-1: talking, humming, working; struck dead by its own child's birth; unmade by it
    const fall = easeIn(K(t, 'p060.1:fell heavily', 'p060.1:fell heavily+.5')), gone = ease(K(t, 'p063.1:float back along it', 'p063.1:In seconds+.8'));
    const hum = snapped ? 0 : Math.max(win(t, T0('N'), tSudden + 1, 1, 1) * (.4 + .3 * Math.abs(wob(t, 1.7))), tSudden < t ? .5 * (1 - ez(t, tStraight, tRolled)) : 0,
      K(t, 'p058.3:the hum', 'p058.3:waxed') * win(t, T0('P'), T0('Q'), .5, .5) * (.3 + .7 * (.5 + .5 * Math.sin(t * 2.2))), sym.lit, roar, win(t, T0('W'), tSnap, .2, .1));
    const writhe = ez(t, tTent, tTent + 1) * (1 - ez(t, tStraight, tRolled)) + .2 * ez(t, tGen, tGen + 1);
    f1(t, { fall, gone, dark: snapped, hum, writhe, lit: snapped ? 0 : steps(t, [[0, .15], [T0('C'), .3], [tSudden, .5], [tGen, 1, .8]]) + .7 * talk(t, 'f1') });
    const st = stray(t);
    if (t > tFell + .5) { const d = seg(t, tFell + .5, tFell + 3.5); if (d < 1) { boilSeed('dust'); paint(ellPts(F1.x, F1.g, 260 + 200 * d, 50 + 30 * d, 20, 20), { fill: D[1], fillOp: 90 * (1 - d), bleed: .4, ink: null }); } }

    // B: his thought rises as a curl; F-1's ruled line follows it, and is wiped when the scene moves on
    const head0 = [COUCH.x - 10, SEAT - 120];
    dreamCurl(head0[0] + 20, head0[1] - 30, K(t, 'p051.1:not with', 'p051.1$'), t, .6 * (1 - ez(t, T0('C'), T0('C') + 1.5)));
    const line1 = [[F1.x - 30, 560], [1080, 560], [1080, 470], [860, 470], [860, 400], [700, 400]];
    ruled(line1, seg(t, C('p051.1:not with') + 1, C('p051.1$') + .5) * .9, D[0], .9, .9 * ez(t, T0('C'), T0('C') + 1.5));
    // N: the steps no logic can ascend, climbing from its lens to a gap; a line from the far side closes it
    if (t > C('p058.2') && t < T0('O') + 2) {
      const [x0, y0] = [F1.x - 240, 560], steps_ = [[x0, y0]]; for (let i = 0; i < 6; i++) { const [x, y] = steps_.at(-1); steps_.push([x - 90, y], [x - 90, y - 60]); }
      const gap = steps_.at(-1), far = [gap[0] - 240, gap[1] - 140], wipe = ez(t, T0('O'), T0('O') + 1.5);
      ruled(steps_, K(t, 'p058.2', 'p058.2:no logic can'), '#EFE6D2', 1.1, wipe);
      if (t > C('p058.2:a step') && wipe < 1) { boilSeed('far'); paint(ellPts(...far, 14, 14, 12), { wash: '#EFE6D2', washOp: 220 * (1 - wipe), ink: null }); glow(...far, 40, NRG.white, .4 * (1 - wipe)); }
      if (t > C('p058.2:working backwards')) {
        ruled([far, [far[0], far[1] + 70], [far[0] + 120, far[1] + 70], [far[0] + 120, gap[1]], gap], K(t, 'p058.2:working backwards', 'p058.2$'), '#EFE6D2', 1.1, wipe);
        if (t > C('p058.2$')) glow(gap[0], gap[1], 50, NRG.white, .6 * (1 - seg(t, C('p058.2$'), C('p058.2$') + 1.2)));
      }
    }
    // O to the snap: the force shafts from F-1 to the working point; then "but three beams"
    const shafts = ez(t, tSudden, tSudden + .5) * (1 - ez(t, tStraight, tThree)), three = K(t, 'p060.1:but three beams', 'p060.1:but three beams+.8') * (snapped ? 0 : 1);
    if (shafts > 0) [-60, 0, 60].forEach(dx => beam(F1.x + dx, 640, WORK[0] + dx * .3, WORK[1], 18, 8, FORCE, 1, { washOp: 50 * shafts, a: .5 * shafts, splash: false }));
    if (three > 0) [-50, 0, 50].forEach(dx => beam(F1.x + dx, 660, WORK[0] + dx * .2, WORK[1], 10, 6, FORCE, three, { washOp: 40, splash: false }));
    // P: the transmutation field; the air pulled into it in spirals, something taking shape
    const field = win(t, T0('P') - 1, T0('Q') + .4, 1.5, .1);
    if (field > 0) {
      for (let i = 0; i < 12; i++) { const a0 = i / 12 * TAU + t * 2, P = []; for (let k = 0; k <= 10; k++) { const r = 260 - k * 22, a = a0 + k * .35; P.push([WORK[0] + Math.cos(a) * r, WORK[1] + Math.sin(a) * r * .6]); } boilSeed('air' + i); inkLine(P, .5 * field, D[0], 'inkfine', .5); }
      const m = K(t, 'p058.3:Fierce beams', 'p058.3$');
      glow(...WORK, 120 + 60 * m, NRG.white, (.4 + .4 * m) * field); glow(...WORK, 220, FORCE, .3 * field);
      if (m > 0) { boilSeed('something'); paint(ellPts(...WORK, 60 * m, 18 * m, 14, 12), { wash: mixCol(D[1], '#7F9BD0', .38), washOp: 160 * m * field, ink: null }); }
    }
    // Q, R: the weird symphony; arcs across the floor, white-hot metal in the beams
    if (sym.env > 0) {
      const f5 = Math.floor(t * 5); boilSeed('arc' + Math.floor(t * 12));
      if (sym.fl > .4 && t < T0('R') + .5) { lightning(WORK[0] + 40, WORK[1] - 20, WORK[0] + 260 * (hash(f5 + 3) - .5) * 2, G - 20, NRG.lightning, { amp: .15, r: 50 }); lightning(WORK[0] - 30, WORK[1], WORK[0] - 240 - 200 * hash(f5 + 7), 560 + 200 * hash(f5 + 9), NRG.lightning, { amp: .14, r: 40, br: 1 }); }
      const hot = K(t, 'p059.1:glimpses of white-hot metal', 'p059.1:The sputter');
      glow(...WORK, 90, '#FFE2B0', (.5 + .4 * hot) * sym.env); glow(...WORK, 40, NRG.white, .7 * sym.env);
    }

    // F-2: from the tentacles rolling back, held in the beams, born in the aura, on its own power after
    if (t > T0('S')) {
      const whole = K(t, 'p060.1:held the structure', 'p060.1:It was a small thing'), reveal = ez(t, T0('S'), tThree);
      if (roar > 0) aura(...WORK, 120 + 220 * roar, NRG.white, .4 + .6 * roar, t);
      if (t > tCrack && t < tSnap + .3) aura(...WORK, 300 * (1 - .45 * seg(t, tSnap - .5, tSnap + .3)), NRG.white, 1, t);
      f2(t, { newborn: roar > .3 });
      if (whole < 1) { boilSeed('unf'); wash(ellPts(WORK[0] - 20, WORK[1], 70 * (1 - whole), 26, 14), 0, { op: .8 * (1 - whole) }); }
      glow(...WORK, 150, NRG.white, .8 * (1 - reveal));
      if (t > tSnap + .3) glow(...WORK, 85, '#E6EEFF', .35 + .1 * wob(t, .5) + .3 * talk(t, 'f2'));
      if (roar > 0 && t < tCrack) { const bolt = K(t, 'p060.1:shot through', 'p060.1:shot through+.5');
        if (bolt > 0) { boilSeed('bolt' + Math.floor(t * 12)); lightning(WORK[0] - 40, WORK[1], WORK[0] - 300, G - 10, NRG.lightning, { amp: .15 }); lightning(WORK[0] + 60, WORK[1] + 20, WORK[0] + 260, G, NRG.lightning, { amp: .12 }); lightning(WORK[0], WORK[1] - 40, WORK[0] - 120, 420, NRG.lightning, { amp: .12, br: 1 }); glow(...WORK, 520, NRG.lightning, .4 * bolt); } }
    }
    // W: lightning from F-1 to the floor, and from the aura to the machine that came too close
    if (t > tCrack && t < tSnap) { boilSeed('wb' + Math.floor(t * 12)); lightning(F1.x - 60, 700, F1.x - 260, G, NRG.lightning, { amp: .18 });
      if (t > tHit && t < tHit + 1.5) lightning(WORK[0] + 60, WORK[1], st[0], st[1], NRG.lightning, { amp: .14 }); }
    // Z, AB, AC: F-2's thought going out in rings; the light inside it; the memories in the rings
    thoughtRings(...WORK, t, C('p062.1:From it came waves'), C('p062.2$'));
    thoughtRings(...WORK, t, C('p064.1'), C('p064.1$'), { r1: 380 });
    const core = K(t, 'p064.1:The Ultimate Energy', 'p064.1:is generated') * (1 - ez(t, T0('AD'), T0('AD') + 2));
    if (core > 0) { glow(...WORK, 90 + 40 * core, NRG.white, .4 * core); glow(WORK[0] + 10, WORK[1], 40, NRG.white, .7 * core); }
    const mem = K(t, 'p064.1:Already they hold', 'p064.1:known and seen') * (1 - K(t, 'p064.1:I shall make others', 'p064.1$'));
    if (mem > 0) for (let i = 0; i < 5; i++) {
      const a = i / 5 * TAU + t * .15, x = WORK[0] + Math.cos(a) * 260, y = WORK[1] + Math.sin(a) * 150, op = mem * .8;
      boilSeed('mem' + i);
      if (i % 3 === 0) { for (let k = 0; k < 3; k++) wash(rectPts(x - 30 + k * 22, y - 30 - 25 * hash(k + i), 14, 50 + 25 * hash(k + i)), 0, { op }); }
      else if (i % 3 === 1) wash(ellPts(x, y, 50, 10, 14), 0, { op });
      else glow(x, y, 40, NRG.death, .5 * op);
    }
    // AA: the stream of light that unmakes F-1, its sections floating back along it
    const flood = K(t, 'p063.1:From the floating machine', 'p063.1:down a straight channel+1'), streamA = 1 - ez(t, C('p063.1:In seconds') + .8, C('p063.1$'));
    if (flood > 0 && streamA > 0) {
      const tx = F1.x, ty = F1.g - 120, ex = lerp(WORK[0], tx, flood), ey = lerp(WORK[1], ty, flood);
      beam(WORK[0] + 40, WORK[1], ex, ey, 30, 160, '#F4EEDC', 1, { washOp: 40 * streamA, a: .45 * streamA, splash: flood >= 1 && gone < 1 });
      if (gone > 0 && gone < 1) for (let i = 0; i < 14; i++) { const q = frac(hash(i) + (t - C('p063.1:float back along it')) * .5); boilSeed('sec' + i); const x = lerp(tx, WORK[0] + 60, q), y = lerp(ty, WORK[1], q) + (hash(i * 3) - .5) * 80 * (1 - q); wash(rectPts(x - 8, y - 6, 16, 12), 1, { ink: true, sw: .4, op: 1 - q }); glow(x, y, 18, '#F4EEDC', .3); }
    }
    // AD, AE: forces that laugh at matter, making C-R-U-1 on the floor where F-1 stood; the glow fades from it
    const forces = win(t, T0('AD') - .5, T0('AE') + 1.5, 1, 2);
    if (forces > 0) {
      const died = C('p065.1:died'), strain = t > died ? 1 + .15 * Math.sin(t * 20) : 1, made = ez(t, T0('AE') - .5, T0('AE') + 2.5);
      for (let i = 0; i < 7; i++) { const a = t * (1.3 + i * .2) + i, r = (40 + 30 * Math.sin(t * 1.7 + i)) * strain * (1 - made * .6); glow(MAKE[0] + Math.cos(a) * r, MAKE[1] + Math.sin(a) * r * .7, 50, [NRG.white, FORCE, '#F4EEDC'][i % 3], .5 * forces); }
      glow(...MAKE, 130 + 60 * (1 - made), FORCE, .4 * forces);
      beam(WORK[0] + 60, WORK[1], MAKE[0] - 40, MAKE[1], 8, 30, FORCE, 1, { washOp: 30 * forces * (1 - made), splash: false, a: .3 * forces * (1 - made) });
      if (t > C('p065.1:Lurid flares') && made < 1) for (let i = 0; i < 3; i++) { const q = frac(t * .7 + i / 3); glow(MAKE[0] + (hash(i) - .5) * 80, MAKE[1] - q * 260, 40 * (1 - q), '#F2F0FF', .7 * (1 - q) * (1 - made)); }
      for (let i = 0; i < 6 && made < .5; i++) { const caught = t > C('p065.1:futilely') + i * 1.4, a = t * 2 + i * 1.3, r = lerp(120 + 30 * Math.sin(t * 3 + i), 20, ez(t, C('p065.1:futilely') + i * 1.4, C('p065.1:futilely') + i * 1.4 + .6)); if (!caught || r > 21) electron(MAKE[0] + Math.cos(a) * r, MAKE[1] + Math.sin(a) * r * .6, 7, i); }
    }
    if (t > T0('AE') - .3) {
      const name = K(t, 'p069.2:Force played', 'p069.2:in dully glowing');
      if (t > C('p069.2:Force played')) glow(CRU[0], CRU[1] - 40, 120, FORCE, .3 * (1 - name * .5));
      DES.cru1(CRU[0], G, 34, t, { hover: (G - CRU[1]) / 34, unlit: name < .05, glowK: name, lit: .7 * talk(t, 'cru1') });
    }
    // AF to AK: F-2's glow as it speaks
    if (t > T0('AF')) glow(WORK[0], WORK[1], 60, '#E6EEFF', .2 * talk(t, 'f2'));

    roal(t);

    // AI, AJ: the life-form investigator brings the cage and sets it down; the green beam; it leaves when it's done
    if (t > tCage - 2) {
      const k = ez(t, tCage - 2, tHeld), down = ez(t, tHeld, tPig), leave = ez(t, C('p072.1') + 1.5, C('p072.1') + 8);
      const ix = lerp(2150, CAGE[0] + 130, k) + 1300 * leave, iy = G - 30 * (1 - down) - 60 * leave;   // in from the right, under F-2
      const m = DES.machine(ix, iy, 14, t, { r: 1.4, h: 2.6, dh: 1, d: 1, arms: 2, reach: 3 });
      const cy = lerp(G - 70, G, down);
      if (leave < .05) { const hd = [CAGE[0], cy - 108]; DES.tentacle([[ix - 14, m.arm], [lerp(ix - 14, hd[0], .45), Math.min(m.arm, hd[1]) - 18], [lerp(ix - 14, hd[0], .8), hd[1] - 14], hd], 5, 3, 4, { grip: true }); }
      // AJ: forces play about F-2's base; the pale-green beam passes through the cage
      const fz = K(t, 'p071.1:Forces played', 'p071.1:moments later') * (1 - ez(t, tDead, tDead + 2));
      for (let i = 0; i < 5; i++) if (fz > 0) { const a = t * 2 + i * 1.3; glow(WORK[0] + Math.cos(a) * 60, WORK[1] + 40 + Math.sin(a) * 20, 30, FORCE, .4 * fz); }
      DES.cage(CAGE[0], cy, 90, t, { dead: ease(K(t, 'p071.1:and the little animal', 'p071.1:fell dead')) });
      const bk = seg(t, tGreen, tGreen + .5) * (1 - seg(t, tDead + .5, tDead + 1.2));
      if (bk > 0) { const n = f2Nose(t); beam(n[0], n[1], CAGE[0] - 30, G - 40, 6, 30, NRG.death, bk, { washOp: 60 }); }
    }
    tierRing(t, lit, true);
    // AK: the enemy on the screens, torpedoes of the void hanging in three of them, with a faint green
    const ships = K(t, 'p072.1:Let machines be made', 'p072.1:Let machines be made+2');
    if (ships > 0) for (let i = 0; i < 3; i++) { const sx = 610 + i * 252, sy = 210; DES.oShip(sx + 20 * wob(t, .05, i), sy, 150, t, { d: 3 }); glow(sx, sy + 30, 60, NRG.death, .25 * ships); }
  }

  // ---------- the hall's camera: the storyboard's framings, and the moves between them ----------
  const along = (t, id) => ez(t, T0(id), T1(id));
  const HALLCAM = [
    [T0('B'), t => { const k = along(t, 'B'); return [lerp(960, 830, k), lerp(640, 690, k), lerp(1, 1.1, k)]; }],
    [T0('C'), t => [1385, lerp(800, 560, ez(t, T0('C'), T1('C') + 1)), 1.7], { mv: 1.8, lead: .6 }],
    [T0('D'), t => [COUCH.x + 40, 850, 2.4 + .15 * K(t, 'p053.2', 'p053.2$')], { mv: 3.2, lead: .9, dip: .35 }],
    [T0('E'), t => { const k = f1In(t); return [lerp(860, 660, k), lerp(700, 680, k), lerp(1.05, 1.35, k)]; }, { mv: 2.2, lead: .4 }],
    [T0('F'), t => [COUCH.x - 14, SEAT - 132, 5.5], { mv: 2.2, lead: 1.6 }],                  // into his eyes
    [T0('H'), t => { const e = f1Eye(t); return [e[0], e[1], 4]; }, { mv: .01, lead: .6 }],    // out of F-1's lens
    [T0('H') + .7, t => { const up = ez(t, C('p056.1'), C('p056.1:but a single proton')); return [COUCH.x + 60, lerp(860, 560, up), lerp(2, 1.3, up)]; }, { mv: 2.8, lead: 0 }],
    [T0('M'), t => [COUCH.x - 10, 790, lerp(4.2, 3.6, along(t, 'M'))], { mv: .01, lead: 0 }],
    [T0('N'), t => [lerp(980, 1040, along(t, 'N')), 660, 1.08], { mv: 4, lead: -.5 }],
    [T0('O'), t => [1080, 640, 1.05 + .04 * along(t, 'O')], { mv: 2, lead: .5 }],
    [T0('P'), t => [WORK[0] + 90, WORK[1] - 40, 2 + .5 * along(t, 'P')], { mv: 2.5, lead: .3 }],
    [T0('Q'), t => [lerp(1030, 980, along(t, 'Q')), 660, 1.3], { mv: .01, lead: 0 }],           // under the wipe
    [T0('R'), t => [1000, 600, lerp(1, .93, along(t, 'R'))], { mv: 2.5, lead: .5 }],
    [T0('S'), t => [WORK[0] + 80, WORK[1] - 50, 1.8], { mv: 2.2, lead: .4 }],
    [tStraight + 1, t => [lerp(WORK[0] + 40, WORK[0] - 40, ez(t, tStraight + 1, T1('S'))), lerp(WORK[1] - 30, 800, ez(t, tStraight + 1, T1('S'))), 1.8], { mv: 3, lead: 0 }],   // with Roal coming in
    [T0('T'), t => [WORK[0] - 70, 820, lerp(2, 2.1, along(t, 'T'))], { mv: 2, lead: .5 }],
    [T0('U'), t => { const k = along(t, 'U'); return [WORK[0] + 110, lerp(650, 600, k), 1.45 + .12 * k]; }, { mv: 1.6, lead: .3 }],
    [T0('W'), t => [WORK[0] + 150, 740, 1.12], { mv: 1.2, lead: .4 }],
    [T0('X'), t => [1110, 730, 1.1], { mv: 1.5, lead: .3 }],
    [T0('Y'), t => [WORK[0] + 60, WORK[1] + 20, 1.6 + .25 * along(t, 'Y')], { mv: 2.4, lead: .3 }],
    [T0('Z'), t => [lerp(1000, 1040, along(t, 'Z')), 700, 1.05], { mv: 2.5, lead: .3 }],
    [T0('AA'), t => [1150, 760, 1.15 + .05 * along(t, 'AA')], { mv: 2, lead: .4 }],
    [T0('AB'), t => { const p = ez(t, C('p064.1:as they are in you'), C('p064.1:nor molecular') + 1); return [lerp(WORK[0] + 120, WORK[0] - 160, p), WORK[1] - 20, 2]; }, { mv: 2.2, lead: .3 }],
    [T0('AC'), t => [WORK[0] - 40, WORK[1], 2.2 + .3 * along(t, 'AC')], { mv: 1.8, lead: .3 }],
    [tMake + .5, t => [lerp(1000, 1120, ez(t, tMake, T1('AC'))), 790, 1.45], { mv: 2.5, lead: 0 }],   // to the empty floor
    [T0('AD'), t => [lerp(1150, 1250, along(t, 'AD')), 790, 1.6 + .3 * along(t, 'AD')], { mv: 2.4, lead: .3 }],
    [T0('AE'), t => [CRU[0] + 10, CRU[1] - 38, lerp(3.4, 3.8, along(t, 'AE'))], { mv: 2, lead: .3 }],
    [T0('AF'), t => [lerp(980, 1000, along(t, 'AF')), 800, 1.4], { mv: 2.4, lead: .3 }],
    [T0('AG'), t => [CRU[0] + 10, CRU[1] - 38, 3.2 + .5 * ez(t, C('p069.2:on its sides appeared'), C('p069.2$'))], { mv: 2, lead: .3 }],
    [T0('AH'), t => [WORK[0], WORK[1] - 10, 3.4], { mv: 2.6, lead: .6, dip: .3 }],
    [T0('AI'), t => [lerp(790, 840, along(t, 'AI')), 890, 2.3], { mv: 1.8, lead: .3 }],
    [T0('AJ'), t => { const k = ez(t, C('p071.1:and the little animal'), C('p071.1$') + 1); return [lerp(880, 800, k), 880, lerp(1.8, 2.4, k)]; }, { mv: 1.5, lead: .3 }],
    [T0('AK'), t => { const k = ez(t, C('p072.1:Let machines be made'), C('p072.1$')); return [900, lerp(820, 380, k), lerp(1.5, 1.2, k)]; }, { mv: 1.8, lead: .3 }],
  ];
  // shake: the force shafts' arrival, the symphony's arcs, the roar, the strikes, F-1 landing
  function shake(t) {
    const land = tFell + .5, sym = symphony(t);
    return Math.max(t > tSudden && t < tSudden + .4 ? 8 : 0, sym.fl > .8 && t < T0('R') ? 5 * sym.env : 0, 4 * roarAt(t), t > T0('W') && t < tSnap ? 2 : 0,
      (t > tCrack && t < tCrack + .4) || (t > tHit && t < tHit + .4) ? 9 : 0, t > land && t < land + .5 ? 12 * (1 - seg(t, land, land + .5)) : 0);
  }
  function hall(t) {
    HALFTONE = .3;
    let [cx, cy, z] = camPath(t, HALLCAM);
    const hw = W / 2 / z, hh = H / 2 / z; cx = clamp(cx, -300 + hw, 2220 - hw); cy = clamp(cy, -150 + hh, 1150 - hh);   // keep inside the set
    const [sx, sy] = shakeXY(t, shake(t));
    camBegin(cx + sx / z, cy + sy / z, z);
    hallWorld(t);
    camEnd();
    // the scene's openings and closings, in screen space
    if (t < T0('B') + .8) flash(1 - seg(t, T0('B'), T0('B') + .8), '#3B322B');
    if (t > T0('M') && t < T0('M') + 1) flash(1 - seg(t, T0('M'), T0('M') + 1), '#F4EEDC');
    if (t > T0('Q') - .3 && t < T0('Q') + .3) brushWipe((t - (T0('Q') - .3)) / .6, [PULP.w[4], PULP.w[3]]);
    if (t > T0('V') && t < T1('V')) morey(t);
    if (t > T0('AL') - .3) brushWipe((t - (T0('AL') - .3)) / .6, [PULP.w[3], PULP.w[2]]);
  }

  // ---------- V: Morey's page, over the hall ----------
  const MOREY = Object.assign(new Image(), { src: 'assets/ref/morey_1932_p415.jpg' });
  let moreyG = null;
  function morey(t) {
    if (!moreyG && MOREY.complete && MOREY.naturalWidth) { moreyG = createGraphics(MOREY.naturalWidth / 2, MOREY.naturalHeight / 2); moreyG.drawingContext.drawImage(MOREY, 0, 0, moreyG.width, moreyG.height); }
    if (!moreyG) return;
    const lt = t - T0('V'), dur = T1('V') - T0('V'), a = clamp(lt / 1.2) * (1 - seg(lt, dur - .8, dur)), h = 1040 * (1 + .02 * lt / dur), w = h * moreyG.width / moreyG.height;
    HALFTONE = .3 * (1 - a);
    flushBrush();
    push(); paint(rectPts(-60, -60, W + 120, H + 120), { wash: PULP.paper, washOp: 255 * a, ink: null }); flushBrush();
    blendMode(MULTIPLY); tint(255, 255 * a); image(moreyG, W / 2 - w / 2, H / 2 - h / 2, w, h); blendMode(BLEND); noTint(); pop();
  }

  // ---------- A: the chapter's page ----------
  function page(t) {
    HALFTONE = 0;
    const k = ease(seg(t, 0, T1('A'))), x = 460, wd = 1000;
    camBegin(W / 2 + 40 * k, H / 2 + 40 * k, 1 + .06 * k);
    pageHeader('The Hydrogen Wall', x, 250, wd, { screen: false });
    dropCapPara('Roal was lying quietly on a couch. He was thinking deeply, and yet not with the logical trains of thought that machines must follow.', x, 470, wd, { size: 44, lines: 8, screen: false });
    rule(x + wd * .35, 800, wd * .3, INK, 1);
    camEnd();
    flushLetters();
    if (t < 1.2) flash(1 - easeOut(t / 1.2), PULP.paper);
    const lt = t, dur = T1('A');
    if (lt > dur - 1.2) { const s = ease(seg(lt, dur - 1.2, dur)); boilSeed('soak'); paint(ellPts(W / 2, H / 2, 1400 * s, 900 * s, 30, 40), { wash: '#3B322B', washOp: 255 * s, fill: '#3B322B', fillOp: 160, bleed: .3, ink: null }); }
  }

  // ---------- F, and the interlude in K: Roal's eyes ----------
  // Pushed into from the hall; at the end it pushes into his pupil, which becomes F-1's lens.
  const PUPIL = [W / 2 + 1500 * .27 - .15 * 1500 * .19 * .25, H / 2 + 40];
  function eyes(t, o = {}) {
    HALFTONE = .25;
    boilSeed('skin'); paint(rectPts(-100, -100, W + 200, H + 200), { wash: D[0], washOp: 255, fill: D[1], fillOp: 60, bleed: .2, ink: null });
    if (o.dream) {   // K: his eyes over the atom, dreaming
      camBegin(W / 2, H / 2, 1.1 + .05 * seg(t, o.t0, o.t0 + 6));
      DES.eyes(W / 2, H / 2 + 40, 1500, t, { old: true, far: true, lid: .25 + .3 * blink(t, 11), look: .05 * wob(t, .1) });
    } else {
      const m = ez(t, T0('G') - 1.5, T0('G') + .4), z = (1 + .05 * seg(t, T0('F'), T0('G'))) * Math.exp(lerp(0, Math.log(2.6), m));
      camBegin(lerp(W / 2, PUPIL[0], m), lerp(H / 2 + 20, PUPIL[1], m), z);
      DES.eyes(W / 2, H / 2 + 40, 1500, t, { old: true, far: true, lid: .2 + .08 * K(t, 'p055.1', 'p055.1+3') + .8 * blink(t, 7) * (t < T0('G') - 2 ? 1 : 0), look: -.15 });
    }
    camEnd();
  }
  // ---------- G: F-1's lens ----------
  // It comes in matched to the pupil and keeps the push; at the end it pulls back to match F-1's lens in the hall.
  function lens(t) {
    HALFTONE = .25;
    boilSeed('lensbg'); paint(rectPts(-100, -100, W + 200, H + 200), { wash: D[2], washOp: 255, ink: null });
    const z = lerp(.59, 1, easeOut(seg(t, T0('G') - .5, T0('G') + 3))) * Math.exp(lerp(0, Math.log(.36), ease(seg(t, T0('H') - 1.4, T0('H') + .5))));
    camBegin(W / 2, H / 2 + 40, z);
    boilSeed('biglens'); wash(ellPts(W / 2, H / 2 + 40, 560, 560, 48), 1, { ink: true, sw: 1.4 });
    wash(ellPts(W / 2, H / 2 + 40, 420, 420, 40), 4, { ink: true, sw: 1 });
    for (let i = 0; i < 6; i++) { const a = -2.4 + i * .3; inkLine([[W / 2 + Math.cos(a) * 380, H / 2 + 40 + Math.sin(a) * 380], [W / 2 + Math.cos(a) * 150, H / 2 + 40 + Math.sin(a) * 150]], .6, D[2]); }   // the hall, small and bent in the glass
    glow(W / 2 - 120, H / 2 - 80, 120, NRG.white, .5);
    camEnd();
  }

  // ---------- H to L: the science plate of Roal's atom ----------
  // One atom throughout: the camera pulls back to the bombardment and pushes in ring by ring to the wall, and the grid
  // of space bends around the same proton.
  const AT = [W / 2, H / 2], RINGS = [460, 330, 230, 150], BURST = [AT[0] - 1500, AT[1]], RY = .55;
  const tProton = C('p056.1:but a single proton'), tElec = C('p056.1:but a single electron'), tAwful = C('p056.1:the awful expelling force'), tNever = C('p056.1:Never in all science');
  const tReach = C('p056.1:never do they reach'), tPos = C('p056.1:the proton is positive'), tBlocked = C('p056.1:Blocked'), tWall = C('p056.1:What is that wall');
  const FLASH = ['p056.1:there goes a flash', 'p056.1:Another flash', 'p056.1:Always falling nearer', 'p056.1:that one state'].map(C);
  const tNear = C('p057.1:As the two come nearer'), tBounds = C('p057.1:beyond all bounds'), tNew = C('p057.1:and are in a new space');
  const eR = t => { let R = RINGS[0]; FLASH.forEach((f, i) => { R = lerp(R, RINGS[Math.min(3, i + 1)], easeOut(clamp((t - f) / .5))); }); return lerp(R, 30, ease(seg(t, tNear, tBounds))); };
  // the electron's angle: the integral of its speed, which rises as its orbit tightens (so nothing jumps when it falls)
  const ePhase = t => { let a = 0; for (let s = tElec; s < t; s += .04) a += .04 * Math.min(4.5, 1.2 * Math.pow(RINGS[0] / eR(s), .6)); return a; };
  const BG = '#2E2620', fade = (col, a) => mixCol(BG, col, a);
  const dotted = (cx, cy, rx, ry, col, n = 60) => { for (let i = 0; i < n; i += 2) { const a0 = i / n * TAU, a1 = (i + 1) / n * TAU; inkLine([[cx + Math.cos(a0) * rx, cy + Math.sin(a0) * ry], [cx + Math.cos(a1) * rx, cy + Math.sin(a1) * ry]], .7, col, 'inkfine', 0); } };
  const proton = (x, y, r) => { if (r < 1) return; boilSeed('proton'); wash(ellPts(x, y, r, r, 24), 2, { ink: true, sw: .8 }); wash(ellPts(x - r * .3, y - r * .3, r * .35, r * .3, 12), 0, { op: .6 }); };
  const flashRing = (x, y, r, a) => { for (let i = 0; i < 28; i++) { const q = i / 28 * TAU; glow(x + Math.cos(q) * r, y + Math.sin(q) * r, 26, NRG.white, a); } };
  const PLATECAM = [
    [tProton, t => [AT[0], AT[1], lerp(1.7, 1, ez(t, tProton, tElec + 1.5))]],
    [tNever, t => { const k = ez(t, tAwful + .5, tReach + 1.5); return [lerp(BURST[0] + 700, AT[0] - 350, k), AT[1], lerp(.62, .78, k)]; }, { mv: 2.2, lead: .4 }],
    [tPos, t => { let n = 0; FLASH.forEach(f => { n += ez(t, f, f + 1.2); }); return [AT[0], AT[1], 1 + .13 * n + .35 * ez(t, tBlocked, tWall + 1)]; }, { mv: 2.5, lead: .3 }],
    [T0('L'), t => [AT[0], AT[1], 1 + 1.6 * ez(t, tNew, T1('L'))], { mv: 2.5, lead: 0 }],
  ];
  function plate(t) {
    HALFTONE = .3;
    stillSeed('plate'); paint(rectPts(-200, -200, W + 400, H + 400), { wash: BG, washOp: 255, fill: '#3B322B', fillOp: 120, bleed: .25, tex: .5, ink: null }); blooms(0, H, 8, 4, 55, .5);
    const [cx, cy, z] = camPath(t, PLATECAM);
    camBegin(cx, cy, z);
    const [ax, ay] = AT, orbit = ez(t, tElec, tElec + 1) * (1 - ez(t, T0('L'), T0('L') + 2)), rings = ez(t, tPos, tPos + 2) * (1 - ez(t, T0('L'), T0('L') + 2));
    const bend = .15 + .85 * ez(t, C('p057.1'), tBounds), fold = ez(t, tBounds, tNew + 1), grid = ez(t, T0('L') - .5, T0('L') + 2.5);
    // the grid of space, bending toward the proton until it folds shut (L)
    if (grid > 0) { const warp = (x, y) => { const dx = x - ax, dy = y - ay, r = Math.hypot(dx, dy) || 1, d = bend * 260 * Math.exp(-r / 380) * (1 + 1.5 * fold), r2 = Math.max(3, r - d); return [ax + dx * r2 / r, ay + dy * r2 / r]; };
      for (let i = -10; i <= 10; i++) { const P = [], Q = []; for (let j = -14; j <= 14; j++) { P.push(warp(ax + i * 70, ay + j * 50)); Q.push(warp(ax + j * 70, ay + i * 50)); } inkLine(P, .6, fade('#8D7C63', grid), 'inkfine', .3); inkLine(Q, .6, fade('#8D7C63', grid), 'inkfine', .3); } }
    // the orbit, then the nested rings and the wall
    if (orbit > 0) dotted(ax, ay, RINGS[0], RINGS[0] * RY, fade('#B4A283', orbit));
    if (rings > 0) for (let i = 1; i < 4; i++) dotted(ax, ay, RINGS[i], RINGS[i] * RY, fade(i === 3 && t > tBlocked ? '#EFE6D2' : '#8D7C63', rings), 50 + i * 10);
    if (t > tBlocked && rings > 0) { boilSeed('wall'); const k = K(t, 'p056.1:Blocked', 'p056.1:What is that wall'); paint(ellPts(ax, ay, 150, 82, 40), { ink: fade('#EFE6D2', rings), sw: 1.2 + 2.5 * k, br: 'dry' }); glow(ax, ay, 180 + 40 * k, '#F4EEDC', (.1 + .15 * k) * rings); }
    // the bombardment (J): a burst far to the left; its electrons fly at the atom, and every one swerves off
    if (t > tAwful - .3 && t < tPos + 3) {
      const t0 = tAwful, k = clamp((t - t0) / 3), b = backOut(seg(t, t0 - .3, t0 + .4)), out = 1 - ez(t, tPos - 1, tPos + 2), [bx, by] = BURST;
      glow(bx, by, 260 * b, NRG.white, .8 * (1 - k * .6) * out); boilSeed('burst'); paint(starPts(bx, by, 120 * b, .35, 9), { wash: '#EFE6D2', washOp: 160 * out, ink: null });
      for (let i = 0; i < 9; i++) {
        const s0 = t0 + i * .35, q = clamp((t - s0) / 2.6); if (q <= 0 || q >= 1) continue;
        const aim = (i - 4) * 26, f = Math.min(1, q * 1.6), mx = lerp(bx, ax - 200, f), my = lerp(by, ay + aim, f), sw = Math.max(0, q * 1.6 - 1) / .6, dir = aim >= 0 ? 1 : -1;
        electron(f < 1 ? mx : ax - 200 + sw * 300, f < 1 ? my : ay + aim + dir * sw * sw * 420, 9, 'b' + i);
      }
    }
    proton(ax, ay, 64 * backOut(seg(t, tProton, tProton + .6)) * (1 - .7 * fold));
    // the electron: on its orbit, dropping a ring at each flash, stopping at the wall, then passing it (L)
    if (t > tElec && fold < .9) {
      const R = eR(t), a = ePhase(t), ex = ax + Math.cos(a) * R, ey = ay + Math.sin(a) * R * RY, s = backOut(seg(t, tElec, tElec + .5));
      electron(ex, ey, 15 * s, 'e');
      FLASH.forEach(f => { const age = t - f; if (age > 0 && age < 1.2) flashRing(ex, ey, 30 + age * 500, .5 * (1 - age / 1.2)); });
    }
    if (fold > 0) { glow(ax, ay, 30 + 400 * fold, NRG.white, .8 * fold); glow(ax, ay, 20 + 120 * fold, '#F4EEDC', fold); }
    camEnd();
    if (t > T1('L') - 1) flash(seg(t, T1('L') - 1, T1('L')), '#F4EEDC');
  }

  // ---------- AL, AM: outside, on the bare rock ----------
  function rockSky(t, dawn) {
    stillSeed('sky'); paint(rectPts(-200, -1400, W + 400, 2300), { wash: mixCol(D[2], D[0], dawn), washOp: 255, fill: D[1], fillOp: 80, bleed: .3, ink: null });
    blooms(0, 600, 6, 1, 73, .4);
    stillSeed('mtn'); wash([[-200, 700], [200, 520], [420, 600], [700, 470], [980, 590], [1300, 500], [1600, 610], [2100, 540], [2100, 760], [-200, 760]], 2, { ink: true, sw: .5 });
    stillSeed('rock'); wash([[-200, 720], [2100, 700], [2100, 1300], [-200, 1300]], 3, { op: 1.1 });
    for (let i = 0; i < 18; i++) { stillSeed('crack' + i); const x = hash(i * 3) * W, y = 760 + hash(i * 5) * 300; inkLine([[x, y], [x + 60 + 80 * hash(i), y + 10 * (hash(i * 7) - .5)]], .4, D[4]); }
  }
  function greatMachine(x, g, k) {   // the great automatic machine, built in steps: k 0..1, each level easing up into place
    const s = 22;
    for (let i = 0; i < 6; i++) { const lk = clamp(k * 6 - i); if (lk <= 0) break; boilSeed('gm' + i); const w = (9 - i) * s, y = g - i * s * 1.6 + (1 - easeOut(lk)) * 30, hh = s * 1.6 * easeOut(lk);
      wash(rrPts(x - w, y - hh, w * 2, hh, s * .3), 2 + (i % 2), { ink: true, sw: .6 }); for (let j = -3; j <= 3; j++) inkLine([[x + j * w / 4, y], [x + j * w / 4, y - hh]], .4, D[4]); }
    if (k >= 1) { boilSeed('gmtop'); DES.dcase(x, g - 6 * s * 1.6, 3 * s, 2.5 * s, 1.5 * s, 1, { shine: true, rings: [.5] }); }
    return [x, g - 6 * s * 1.6 - 4 * s];
  }
  function rock(t) {
    HALFTONE = .3;
    const k = K(t, 'p073.1:In a matter of hours', 'p073.1:they had built+1.5'), up = ez(t, C('p073.1:floating up and out'), C('p073.1$') + 4), go = C('p073.1:In hours more');
    camBegin(W / 2, lerp(H / 2, -300, up), lerp(1, 1.05, ez(t, T0('AL'), go)));
    rockSky(t, .2 + .55 * k);
    const top = greatMachine(960, 860, k);
    // the builders swarming over it; when it's done they are the first to rise
    for (let i = 0; i < 10; i++) { const a = t * .8 + i * .63, rise = Math.max(0, t - go - i * .3), x = 960 + Math.cos(a) * (240 + 40 * hash(i)) * (1 - Math.min(.7, rise * .1)), y = 760 - 120 * k + Math.sin(a) * 60 - rise * rise * 40;
      if (y > -1400) DES.machine(x, y + 60, 6, t, { arms: 2, d: 1 }); }
    const tDir = C('p073.1:under the direction');
    if (t > tDir - 2) DES.cru1(lerp(2150, 1400, ez(t, tDir - 2, tDir + 1.5)), 640, 30, t, { hover: 2.5, glowK: 1 });
    boilSeed('stars'); for (let i = 0; i < 40; i++) glow(hash(i * 3.1) * W, -900 + hash(i * 7.7) * 900, 8, NRG.white, .4 * up);
    for (let i = 0; i < 120; i++) { const st = go + i * .07, q = (t - st) / 6; if (q <= 0) continue;
      const x = top[0] + (hash(i) - .5) * 1400 * q, y = top[1] - q * (900 + 600 * hash(i * 3)), sz = 16 * (1 - q * .5);
      if (sz > 3) DES.mote(x, y, sz, t, { ang: -Math.PI / 2 + (hash(i) - .5) * .8, drive: true }); else glow(x, y, 6, NRG.white, .5); }
    camEnd();
    if (t < T0('AL') + .3) brushWipe(.5 + (t - T0('AL')) / .6, [PULP.w[3], PULP.w[2]]);
    if (t > DUR - 1.5) flash(seg(t, DUR - 1.5, DUR), PULP.paper);
  }

  // ---------- the film: which space, and the dissolves between them ----------
  function film(t) {
    const tE = T0('F'), tG = T0('G'), tH = T0('H'), tM = T0('M');
    if (t < T0('B')) return page(t);
    if (t < tE - .7) return hall(t);
    if (t < tE + .5) return dissolve(seg(t, tE - .7, tE + .5), () => hall(t), () => eyes(t));
    if (t < tG - .6) return eyes(t);
    if (t < tG + .4) return dissolve(seg(t, tG - .6, tG + .4), () => eyes(t), () => lens(t));
    if (t < tH - .5) return lens(t);
    if (t < tH + .5) return dissolve(seg(t, tH - .5, tH + .5), () => lens(t), () => hall(t));
    if (t < tProton - .6) return hall(t);
    if (t < tProton + 1) return dissolve(seg(t, tProton - .6, tProton + 1), () => hall(t), () => plate(t));
    if (t < tM) {   // the plate; at "the proton is positive", his eyes dreaming over it
      const ek = .55 * win(t, tPos - .3, tPos + 5, 1, 1.4);
      return ek > 0 ? dissolve(ek, () => plate(t), () => eyes(t, { dream: true, t0: tPos })) : plate(t);
    }
    if (t < T0('AL')) return hall(t);
    return rock(t);
  }
  shots([[0, film]]);
  window.CH05 = { hallCam: t => camPath(t, HALLCAM), plateCam: t => camPath(t, PLATECAM) };   // for checking the moves
})();
