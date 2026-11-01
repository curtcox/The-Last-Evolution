// models.js: Phase 4's model sheets (Round 4, 4.1): every design in src/designs.js, drawn in the pulp medium with its
// views, its scale, and the words of the text it's built from. studio.html?loop=model1 … model6;
// tools/model_sheets.mjs renders them for the review page.
(() => {
  const INK = PULP.ink, L = 110;   // L: the sheet's left margin
  // the sheet's head: the running title, a double rule, the sheet's title and number
  function head(no, title) {
    letter('THE LAST EVOLUTION · MODEL SHEET', L, 62, 24, INK, { ink: false, screen: true, align: 'left', font: `700 24px ${SERIF}`, spacing: 5 });
    letter(`No. ${no}`, W - L, 62, 24, INK, { ink: false, screen: true, align: 'right', font: `italic 26px ${SERIF}` });
    rule(L, 86, W - 2 * L, INK, 3); rule(L, 95, W - 2 * L, INK, 1);
    letter(title, L, 140, 50, INK, { ink: false, screen: true, align: 'left', font: `italic 50px ${SERIF}` });
  }
  // a design's name under it, in spaced small capitals, and a line of description in italic
  function label(name, sub, x, y) {
    letter(name.toUpperCase(), x, y, 22, INK, { ink: false, screen: true, font: `700 22px ${SERIF}`, spacing: 3 });
    if (sub) letter(sub, x, y + 28, 19, INK, { ink: false, screen: true, font: `italic 19px ${SERIF}` });
  }
  // the text a design is built from: lines of italic, wrapped to wd, with the paragraph it's from
  function words(text, ref, x, y, wd, size = 20) {
    const c = letG.drawingContext; c.font = `italic ${size}px ${SERIF}`;
    const out = []; let line = '';
    for (const w of text.split(' ')) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > wd && line) { out.push(line); line = w; } else line = t; }
    out.push(line);
    out.forEach((s, i) => letter(s, x, y + i * size * 1.3, size, INK, { ink: false, screen: true, align: 'left', font: `italic ${size}px ${SERIF}` }));
    const ry = y + out.length * size * 1.3;
    if (ref) letter(ref, x + wd, ry, size * .8, INK, { ink: false, screen: true, align: 'right', font: `${size * .8}px ${SERIF}`, spacing: 1 });
    return ry + size * 1.5;
  }
  // a note of our own (not the text's): upright, smaller
  function note(text, x, y, wd, size = 18) {
    const c = letG.drawingContext; c.font = `${size}px ${SERIF}`;
    const out = []; let line = '';
    for (const w of text.split(' ')) { const t = line ? line + ' ' + w : w; if (c.measureText(t).width > wd && line) { out.push(line); line = w; } else line = t; }
    out.push(line);
    out.forEach((s, i) => letter(s, x, y + i * size * 1.3, size, INK, { ink: false, screen: true, align: 'left', font: `${size}px ${SERIF}` }));
    return y + out.length * size * 1.3 + size;
  }
  // a scale: a ruled bar of n marks, each `per` px, labelled
  function scale(x, y, n, per, unit) {
    inkLine([[x, y], [x + n * per, y]], .9, INK, 'inkfine', 0);
    for (let i = 0; i <= n; i++) inkLine([[x + i * per, y - (i % n ? 6 : 10)], [x + i * per, y + (i % n ? 6 : 10)]], .6, INK, 'inkfine', 0);
    letter(unit, x + n * per / 2, y + 24, 17, INK, { ink: false, screen: true, font: `italic 17px ${SERIF}` });
  }
  const ground = (x0, x1, y) => inkLine([[x0, y], [(x0 + x1) / 2, y + jit(.8)], [x1, y]], .6, PULP.w[3], 'inkfine', 0);

  // 1. The people of 2538
  LOOPS.model1 = t => {
    HALFTONE = 0; head(1, 'The people of 2538');
    const g = 930, s = 108;
    [['roal', 270, 'Roal, 25374', 'a hundred and fifty years old'], ['trest', 640, 'Trest, 35429', 'in his prime'], ['kahsh', 1010, 'Kahsh-256799', 'one of the Man-rulers'], ['citizen', 1370, 'a citizen', 'one of the two millions']]
      .forEach(([who, x, n, sub]) => { ground(x - 160, x + 160, g); DES.person(x, g, s, t, { who }); label(n, sub, x, g + 50); });
    scale(1560, g, 6, s, 'six feet');
    DES.head(1640, 320, 170, 'roal'); DES.head(1810, 320, 170, 'trest');
    label('Roal', '', 1640, 470); label('Trest', '', 1810, 470);
    let y = 540;
    y = words('They were the greatest human science-investigators—Roal, 25374 and Trest, 35429.', 'p018', 1560, y, 300);
    y = note('Drawn as the pulps drew the future: tunics to the thigh, belted, over close trousers and soft boots, and the high standing collar of the period\'s futures. Roal, the elder, in a long robe and white beard; Kahsh in a ruler\'s mantle with a disc of office. Not caricatures.', 1560, y, 300);
  };

  // 2. The machines of 2538
  LOOPS.model2 = t => {
    HALFTONE = 0; head(2, 'The machines of 2538');
    const g = 960, s = 50;
    ground(80, 1880, g);
    DES.person(150, g, s, t, { who: 'citizen' }); label('a man', 'for scale', 150, g + 46);
    const ms = [['x5638', 360, 'X-5638', 'the newest'], ['x6349', 600, 'X-6349', ''], ['x6621', 850, 'X-6621', 'the chemist'], ['cr21', 1120, 'C-R-21', 'chief of the rulers']];
    for (const [k, x, n, sub] of ms) { DES[k](x, g, s, t); label(n, sub, x, g + 46); }
    DES.f1(1580, g, s, t); label('F-1', 'the new brain-machine', 1580, g + 46);
    scale(1840 - 5 * s, 205, 5, s, 'five feet');
    let y = 205;
    y = words('The usual driving and lifting units were there, but a vastly greater dome-case, far more powerful energy-generators, far greater force-beam controls were used and more tentacles were built on the framework.', 'p048', L, y, 500, 19);
    words('The whirr of air sucked into a transmutation field... the hum of the powerful generators within the shining cylinder of F-1.', 'p058', L, y, 500, 19);
    note('One family: every machine a dome-case on a lifting disc, its tentacles hung from the framework between. Each is told by its build: X-5638 slim and new, X-6349 with a probe, X-6621 with the chemist\'s nozzles, C-R-21 tall with a crown of receptors, F-1 shining and vast. Designations are stencilled on the band.', 700, 205, 480, 17);
  };

  // 3. F-2 and C-R-U-1
  LOOPS.model3 = t => {
    HALFTONE = 0; head(3, 'F-2, and C-R-U-1');
    const s = 80;
    DES.f2(420, 500, s, t, { view: 'side' }); label('F-2', 'side', 420, 520);
    DES.f2(820, 500, s, t, { view: 'front' }); label('F-2', 'front', 820, 520);
    DES.f2(1180, 500, s, t, { view: 'top' }); label('F-2', 'above', 1180, 520);
    DES.f2(420, 900, s, t, { newborn: true }); label('F-2, newborn', 'held on its own power', 420, 960);
    DES.f2(820, 900, s, t, { age: 1 }); label('F-2, old', 'oxidised: the narrator', 820, 960);
    ground(1000, 1360, 960); DES.cru1(1130, 960, s, t); DES.f2(1280, 960, s * .55, t, { hover: 1.4 }); label('C-R-U-1', 'with F-2, for scale', 1180, 1000);
    scale(1540, 960, 3, s, 'three feet');
    let y = 210;
    y = words('The structure of glowing, bluish metal. From it curled three thin tentacles of the same bluish metal. An enormous aura of white light surrounded the small torpedo of metal.', 'p060', 1520, y, 330, 19);
    y = words('A small cylinder, smaller even than its creator, floated where the forces had danced.', 'p066', 1520, y, 330, 19);
    y = words('On its sides appeared C-R-U-1 in dully glowing golden light.', 'p069', 1520, y, 330, 19);
    note('F-2\'s faint blue is the only colour in the film that isn\'t energy: its metal, as the text gives it. With age it goes grey-brown, and in the closing frame it is rusted. C-R-U-1 is the family form with no disc and no tentacles: it works by force alone.', 1520, y, 330, 17);
  };

  // 4. The Outsiders
  LOOPS.model4 = t => {
    HALFTONE = 0; head(4, 'The Outsiders');
    const g = 940, s = 135;
    ground(160, 1100, g);
    DES.outsider(400, g, s, t, { view: 'front' }); label('front', 'in the suit', 400, g + 46);
    DES.outsider(860, g, s, t, { view: 'side' }); label('side', '', 860, g + 46);
    DES.outsiderCrown(1260, 380, 120); label('the crown', 'from above: three eyes, a third of a turn apart', 1260, 540);
    ground(1160, 1400, g); DES.person(1220, g, 40, t, { who: 'citizen' }); DES.outsider(1330, g, 40, t, { view: 'front' }); label('to scale', 'with a man', 1280, g + 46);
    let y = 210;
    y = words('Strange life-forms were crawling about the ship, protected by flexible, transparent suits. Their bodies were short, and squat, four-limbed and evidently powerful. They, like insects, were equipped with a thick, durable exoskeleton, horny, brownish coating that covered arms and legs and head.', 'p010', 1500, y, 340, 18);
    y = words('Their eyes projected slightly, protected by horny protruding walls—eyes that were capable of movement in every direction—and there were three of them, set at equal distances apart.', 'p010', 1500, y, 340, 18);
    note('About four feet tall and nearly as broad. The three eyes stand around the crown, so one always looks behind. Brown is a deeper sepia; the suit is clear, a line and a glint.', 1500, y, 340, 17);
  };

  // 5. Ships, investigators, motes
  LOOPS.model5 = t => {
    HALFTONE = 0; head(5, 'Ships, investigators and motes');
    DES.oShip(820, 360, 1300, t); label('A torpedo of the void', 'the Outsiders\' ship, a thousand kilads long', 820, 520);
    DES.oShipFront(1680, 360, 100); label('from ahead', '', 1680, 520);
    DES.investigator(330, 780, 95, t); label('an investigator', 'scarcely three inches across', 330, 930);
    scale(330 - 95, 680, 3, 190 / 3, 'three inches');
    for (let i = 0; i < 7; i++) DES.mote(640 + hash(i * 3.3) * 420, 700 + hash(i * 5.1) * 160, 80 + 40 * hash(i), t, { ang: -.2 + .4 * hash(i * 2), drive: true });
    DES.mote(1300, 780, 240, t, { drive: true }); label('a mote', 'one of the ten thousand tiny machine-ships', 1060, 930);
    let y = 640;
    y = words('First a thin scoutline of a hundred great ships, mighty torpedoes of the void a thousand kilads in length, they came.', 'p007', 1500, y, 340, 18);
    y = words('Ten thousand giant ships, shining dully in the radiance of a far-off blue-white sun, met ten thousand tiny, darting motes.', 'p075', 1500, y, 340, 18);
    words('The investigation machine, scarcely three inches in diameter, crept into the shattered hull.', 'p009', 1500, y, 340, 18);
  };

  // 6. Places
  LOOPS.model6 = t => {
    HALFTONE = 0; head(6, 'The places');
    const g = 980;
    ground(80, 560, g);
    DES.plant(330, g, 1.45, t); DES.person(470, g, 1.45 * 1.6, t, { who: 'citizen' });
    label('The power plant', 'nearly five hundred feet', 330, g + 46);
    inkLine([[120, g], [120, g - 500 * 1.45]], .9, INK, 'inkfine', 0);
    for (let i = 0; i <= 5; i++) inkLine([[112, g - i * 145], [128, g - i * 145]], .6, INK, 'inkfine', 0);
    letter('500 feet', 120, g - 500 * 1.45 - 22, 17, INK, { ink: false, screen: true, font: `italic 17px ${SERIF}` });
    ground(620, 1180, g);
    DES.blackDome(900, g, 250, t, { cut: true }); DES.person(820, g, 12, t, { who: 'roal' }); DES.person(990, g, 12, t, { who: 'trest', flip: true });
    label('The dome', 'cut away: the violet beam that holds it', 900, g + 46);
    DES.lab(1240, 200, 600, 420, t); label('The Denver laboratory', 'the screens, the piers, Roal\'s couch', 1540, 660);
    let y = 740;
    y = words('Nearly five hundred feet in height, a mighty, bluntly rounded dome at its top, the cylinder stood, covered over with smoothly gleaming metal, slightly luminescent in itself.', 'p113', 1240, y, 600, 18);
    words('In two minutes it was a solid, black dome that reached over them and curved down to the ground about them.', 'p092', 1240, y, 600, 18);
  };
  // 7. The pilot's poses: Roal in profile, lying, sitting up, standing and shielding his face; his eyes; the cage
  LOOPS.model7 = t => {
    HALFTONE = .3; head(7, 'Roal acting, and the pilot\'s props');
    const g = 900, s = 52, u = s * 6 / 7.4;
    const c = DES.couch(370, g, s);
    DES.personSide(330, c.seat - .35 * u, s, t, { pose: DES.POSE.lie, lid: .5, key: 'a' });
    label('lying', 'p051: thinking deeply', 370, 960);
    const c2 = DES.couch(880, g, s * .8);
    DES.personSide(860, c2.seat - .4 * u * .8, s * .8, t, { pose: DES.POSE.sit, look: .5, key: 'b' });
    label('sitting up', 'p053', 880, 960);
    DES.personSide(1230, g - DES.HIP * s, s, t, { pose: DES.POSE.stand, key: 'c' });
    label('standing', null, 1230, 960);
    DES.personSide(1480, g - DES.HIP * s, s, t, { pose: DES.POSE.shield, flip: true, key: 'd' });
    label('shielding his face', 'p060', 1480, 960);
    DES.cage(1740, g, 110, t); label('the cage', 'p071', 1740, 960);
    DES.eyes(1450, 300, 520, t, { old: true, far: true });
    label('his eyes', 'p055', 1450, 470);
  };
  for (const k of ['model1', 'model2', 'model3', 'model4', 'model5', 'model6', 'model7']) LOOPS[k].len = 2;
})();
