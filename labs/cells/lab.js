"use strict";
// ===== Cells & Microscope — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SPEC = { onion: { name: "Onion skin (plant)", size: 250, stain: "iodine" }, cheek: { name: "Cheek cells (animal)", size: 60, stain: "methylene blue" },
  leaf: { name: "Pondweed leaf (plant)", size: 100, stain: "iodine" }, blood: { name: "Red blood cells", size: 8, stain: "—" } };
const OBJ = [4, 10, 40, 100], F0 = { 4: 20, 10: 45, 40: 70, 100: 88 }, FOV = { 4: 4500, 10: 1800, 40: 450, 100: 180 }; // field of view in µm
const R = 185, CX = 260, CY = 225;
const sharp = s => Math.abs(s.focus - F0[s.obj]) <= 2;
const lightOK = s => s.light >= 30 && s.light <= 90;
function pattern(s, k) {
  const sp = s.spec, st = s.stain;
  if (sp === "onion") { const W = 250 * k, H = 70 * k, w = Math.max(0.6, 3 * k), fill = st ? "#f1d58a" : "#fbf5e6", nuc = st ? "#6d4c2f" : "rgba(160,140,110,.25)";
    const cell = (x, y) => `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="${fill}" stroke="${st ? "#a07a3c" : "#c9b48a"}" stroke-width="${w}"/><ellipse cx="${x + W * 0.32}" cy="${y + H * 0.5}" rx="${11 * k}" ry="${9 * k}" fill="${nuc}"/>`;
    return { w: W, h: 2 * H, body: cell(0, 0) + cell(-W / 2, H) + cell(W / 2, H) }; }
  if (sp === "leaf") { const W = 100 * k, H = 45 * k, w = Math.max(0.6, 2.5 * k);
    const cell = (x, y) => { let g = `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#e8f5e9" stroke="#7cb342" stroke-width="${w}"/>`;
      [[.12, .2], [.3, .15], [.5, .2], [.7, .15], [.88, .22], [.1, .8], [.3, .85], [.52, .8], [.72, .86], [.9, .78], [.2, .5], [.82, .5]].forEach(([a, b]) => g += `<ellipse cx="${x + a * W}" cy="${y + b * H}" rx="${4 * k}" ry="${2.6 * k}" fill="#2e7d32"/>`);
      if (st) g += `<circle cx="${x + W * 0.55}" cy="${y + H * 0.5}" r="${6 * k}" fill="#5d4037"/>`; return g; };
    return { w: W, h: 2 * H, body: cell(0, 0) + cell(-W / 2, H) + cell(W / 2, H) }; }
  if (sp === "cheek") { const S = 150 * k, fill = st ? "#bbdefb" : "#fdf0f3", edge = st ? "#64b5f6" : "#f3c6d2", nuc = st ? "#1a237e" : "rgba(240,190,205,.6)";
    const blob = (x, y, rot) => `<g transform="translate(${x},${y}) rotate(${rot}) scale(${k})"><path d="M-30,-6 Q-26,-30 2,-28 Q28,-26 30,-4 Q32,22 6,28 Q-22,30 -28,14 Z" fill="${fill}" stroke="${edge}" stroke-width="2"/><circle cx="2" cy="0" r="5" fill="${nuc}"/></g>`;
    return { w: S, h: S, body: blob(40 * k, 42 * k, 10) + blob(112 * k, 105 * k, -35) }; }
  const S = 20 * k, disc = (x, y) => `<circle cx="${x}" cy="${y}" r="${4 * k}" fill="#e57373" stroke="#c62828" stroke-width="${0.4 * k}"/><circle cx="${x}" cy="${y}" r="${1.6 * k}" fill="#ffcdd2"/>`;
  return { w: S, h: S, body: disc(5 * k, 6 * k) + disc(14.5 * k, 14 * k) };
}
function view(s, cx, cy, r, id) {
  const k = (2 * r) / FOV[s.obj], p = pattern(s, k), blur = Math.min(9, Math.abs(s.focus - F0[s.obj]) * 0.45);
  const dark = s.light < 50 ? (50 - s.light) / 50 * 0.92 : 0, wash = s.light > 85 ? (s.light - 85) / 15 * 0.8 : 0;
  const bars = [2000, 1000, 500, 200, 100, 50, 20, 10, 5]; const bar = bars.find(b => b * k <= r * 0.9 && b * k >= 30) || 10;
  return `<defs><clipPath id="cv${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><pattern id="pt${id}" width="${p.w}" height="${p.h}" patternUnits="userSpaceOnUse" x="${cx}" y="${cy}">${p.body}</pattern>
    <filter id="bl${id}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="${blur.toFixed(2)}"/></filter></defs>
    <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="#1c1c1c"/><g clip-path="url(#cv${id})"><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#fffdf6"/>
    <rect x="${cx - r - 20}" y="${cy - r - 20}" width="${2 * r + 40}" height="${2 * r + 40}" fill="url(#pt${id})" filter="url(#bl${id})"/>
    <rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#000" opacity="${dark.toFixed(2)}"/><rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" fill="#fff" opacity="${wash.toFixed(2)}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="18" filter="url(#bl${id})"/></g>
    <g transform="translate(${cx - bar * k / 2},${cy + r - 26})"><rect x="-6" y="-14" width="${bar * k + 12}" height="26" rx="6" fill="rgba(255,255,255,.8)"/><line x1="0" x2="${bar * k}" y1="0" y2="0" stroke="#212121" stroke-width="3"/>${T(bar * k / 2, -3, bar >= 1000 ? bar / 1000 + " mm" : bar + " µm", { s: 11, c: "#212121" })}</g>`;
}
function scope(x, y) { return `<g transform="translate(${x},${y})" fill="#455a64"><rect x="-40" y="118" width="90" height="12" rx="4"/><path d="M14,118 L22,40 L34,40 L30,118 Z"/><rect x="-26" y="78" width="56" height="7" rx="2" fill="#78909c"/>
  <g transform="rotate(-22 0 30)"><rect x="-6" y="-10" width="14" height="62" rx="3"/><rect x="-9" y="-18" width="20" height="10" rx="3" fill="#263238"/><rect x="-3" y="52" width="8" height="14" fill="#90a4ae"/></g><circle cx="30" cy="62" r="7" fill="#90a4ae"/><circle cx="-14" cy="104" r="6" fill="#fff59d" stroke="#f9a825"/></g>`; }
function render(s) {
  const show = s.lv < 3 || s.reveal || s.showVals, mag = 10 * s.obj;
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#fff7f9"/>${view(s, CX, CY, R, "m")}
    <g transform="translate(500,16)"><rect width="286" height="418" rx="16" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${scope(60, 26)}
      ${T(190, 50, "MICROSCOPE", { s: 12, c: "#ad1457" })}${T(190, 76, "eyepiece 10×", { s: 13, c: "#6a1b4d" })}${T(190, 98, "objective " + s.obj + "×", { s: 13, c: "#6a1b4d" })}
      <line x1="20" x2="266" y1="176" y2="176" stroke="#fce4ec" stroke-width="2"/>
      ${T(143, 210, "Total magnification", { s: 13, c: "#880e4f" })}${T(143, 244, mag + "×", { s: 30, c: "#ad1457" })}
      ${T(143, 282, "Field of view: " + (show ? fmt(FOV[s.obj] / 1000) + " mm" : "? mm"), { s: 14, c: "#6a1b4d" })}
      ${T(143, 312, SPEC[s.spec].name, { s: 14, c: "#4a148c" })}${T(143, 336, s.stain ? "stained with " + SPEC[s.spec].stain : "not stained", { s: 13, c: "#8e6a85" })}
      ${s.reveal || s.showVals ? T(143, 372, sharp(s) ? "✓ image in focus" : "✗ image blurred", { s: 14, c: sharp(s) ? "#2e7d32" : "#c62828" }) + T(143, 396, lightOK(s) ? "✓ good light" : "✗ light too " + (s.light < 30 ? "dim" : "bright"), { s: 14, c: lightOK(s) ? "#2e7d32" : "#c62828" }) : ""}</g></svg>`;
}
const ctls = (lv, o) => { o = o || {}; const L = o.lv || lv, lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "spec", type: "choice", label: "Slide (specimen)", options: Object.keys(SPEC).map(k => ({ v: k, label: SPEC[k].name })), wide: true, lock: lk("spec") },
  { id: "obj", type: "choice", label: "Objective lens", options: OBJ.map(v => ({ v, label: v + "×" })), lock: lk("obj") },
  { id: "focus", type: "range", label: "Focus knob", min: 0, max: 100, step: 1, nudge: 1, nudgeLabels: ["◀ fine", "fine ▶"], lock: lk("focus") },
  { id: "light", type: "range", label: "Light", min: 0, max: 100, step: 5, unit: "%", lock: lk("light") },
  { id: "stain", type: "toggle", label: "Add stain", lock: lk("stain") }
]; };
const st = (lv, o) => Object.assign({ lv, spec: "onion", obj: 4, focus: 0, light: 60, stain: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const why = s => !sharp(s) ? "The image is blurred — turn the focus knob slowly." : !lightOK(s) ? "The light is too " + (s.light < 30 ? "dim." : "bright.") : "";
const simQ = (goal, s0, check, sol, o) => ({ title: "🔬 Microscope challenge", prompt: "Set up the microscope, look through the eyepiece, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(s0.lv, o), render, run, check, hint: "Total magnification = eyepiece (10×) × objective. Every objective needs its own focus. Higher magnification → smaller field of view. Image size = real size × magnification." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("cell-sim", diff, uses, mk);
const C = {
  mag: () => { const m = choice([40, 100, 400, 1000]);
    return simQ(`Set the <b>total magnification</b> to <b>${m}×</b>.`, st(1, { obj: m === 40 ? 10 : 4 }), s => ok(10 * s.obj === m, `10 × ${s.obj} = ${m}×.`, `10 × ${s.obj} = ${10 * s.obj}×, not ${m}×.`), { obj: m / 10 }, { wrong: { obj: m === 400 ? 10 : 40 } }); },
  focus: () => simQ("Look at <b>onion cells at 100×</b> and bring them into <b>sharp focus</b>.", st(1), s => ok(s.spec === "onion" && s.obj === 10 && sharp(s), "Sharp onion cells at 100×: you can see the cell walls.", s.obj !== 10 ? `That is ${10 * s.obj}×, not 100×.` : why(s) || "Use the onion slide."), { obj: 10, focus: 45 }, { lock: ["spec"], wrong: { obj: 10, focus: 36 } }),
  chloro: () => simQ("Find cells that contain <b>chloroplasts</b> and focus on them at <b>100× or more</b>.", st(1, { spec: "cheek" }), s => ok(s.spec === "leaf" && s.obj >= 10 && sharp(s), "Pondweed leaf cells: the green dots are chloroplasts.", s.spec !== "leaf" ? "These cells have no chloroplasts — try a green plant." : s.obj < 10 ? "Use at least 100×." : why(s)), { spec: "leaf", obj: 10, focus: 45 }, { wrong: { spec: "onion", obj: 10, focus: 45 } }),
  light: () => simQ("The view is <b>too dark</b>. Fix the light and get a <b>sharp image at 40×</b>.", st(1, { light: 5, obj: 4 }), s => ok(s.obj === 4 && sharp(s) && lightOK(s), "Bright, sharp image at 40×.", s.obj !== 4 ? "Keep the 4× objective (40×)." : why(s)), { light: 60, focus: 20 }, { lock: ["spec"], wrong: { light: 5, focus: 20 } }),
  nucleus: () => simQ("Make the <b>nuclei of cheek cells</b> clearly visible: <b>stain</b> them and focus at <b>400×</b>.", st(2, { spec: "cheek" }), s => ok(s.spec === "cheek" && s.stain && s.obj === 40 && sharp(s) && lightOK(s), "Methylene blue stains the nucleus dark blue.", !s.stain ? "Without stain the nucleus is almost invisible." : s.obj !== 40 ? "Use the 40× objective (400×)." : why(s)), { stain: true, obj: 40, focus: 70 }, { lock: ["spec"], wrong: { stain: false, obj: 40, focus: 70 } }),
  blood: () => simQ("Red blood cells are tiny (8 µm). Show them clearly at <b>1000×</b> in focus.", st(2, { spec: "blood" }), s => ok(s.obj === 100 && sharp(s) && lightOK(s), "At 1000× you can see the disc shape — red blood cells have no nucleus.", s.obj !== 100 ? `That is ${10 * s.obj}×.` : why(s)), { obj: 100, focus: 88 }, { lock: ["spec"], wrong: { obj: 100, focus: 70 } }),
  fov: () => { const c = choice([[1.8, 10], [0.45, 40], [4.5, 4], [0.18, 100]]);
    return simQ(`Set the microscope so the <b>field of view is ${c[0]} mm</b> wide, and focus.`, st(2, { spec: "leaf" }), s => ok(s.obj === c[1] && sharp(s), `Objective ${c[1]}× → field of view ${c[0]} mm.`, s.obj !== c[1] ? `Field of view is ${fmt(FOV[s.obj] / 1000)} mm.` : why(s)), { obj: c[1], focus: F0[c[1]] }, { wrong: { obj: c[1] === 10 ? 40 : 10, focus: F0[c[1] === 10 ? 40 : 10] } }); },
  onion400: () => simQ("Stain the <b>onion cells</b> and focus at <b>400×</b> to see their nuclei.", st(2), s => ok(s.spec === "onion" && s.stain && s.obj === 40 && sharp(s), "Iodine stains the onion cell nuclei brown.", !s.stain ? "Add the stain." : s.obj !== 40 ? "Use 400×." : why(s)), { stain: true, obj: 40, focus: 70 }, { lock: ["spec"], wrong: { stain: true, obj: 10, focus: 45 } }),
  image: () => simQ("A cheek cell is <b>60 µm</b> wide. Make its image <b>24 mm</b> wide (in focus).", st(3, { spec: "cheek", stain: true }), s => ok(s.obj === 40 && sharp(s), "Magnification = 24 mm ÷ 0.06 mm = 400×.", s.obj !== 40 ? `60 µm × ${10 * s.obj} = ${fmt(0.06 * 10 * s.obj)} mm.` : why(s)), { obj: 40, focus: 70 }, { lock: ["spec"], wrong: { obj: 10, focus: 45 } }),
  count18: () => simQ("Onion cells are <b>250 µm</b> long. Choose the magnification where <b>18 cells</b> fit across the field of view, and focus.", st(3, { obj: 40 }), s => ok(s.obj === 4 && sharp(s), "4.5 mm ÷ 0.25 mm = 18 cells at 40×.", s.obj !== 4 ? `${fmt(FOV[s.obj] / 1000)} mm ÷ 0.25 mm = ${fmt(FOV[s.obj] / 250)} cells.` : why(s)), { obj: 4, focus: 20 }, { lock: ["spec"], wrong: { obj: 10, focus: 45 } }),
  blood8: () => simQ("A red blood cell is <b>8 µm</b>. Make its image <b>8 mm</b> wide (in focus).", st(3, { spec: "blood" }), s => ok(s.obj === 100 && sharp(s), "8 mm ÷ 0.008 mm = 1000×.", s.obj !== 100 ? `8 µm × ${10 * s.obj} = ${fmt(0.008 * 10 * s.obj)} mm.` : why(s)), { obj: 100, focus: 88 }, { lock: ["spec"], wrong: { obj: 40, focus: 70 } }),
  tenth: () => simQ("Choose the <b>lowest</b> magnification at which one cheek cell (60 µm) is at least <b>1/10 of the field of view</b> wide. Focus it.", st(3, { spec: "cheek", stain: true }), s => ok(s.obj === 40 && sharp(s), "At 400× the field is 450 µm: 60 ÷ 450 ≈ 0.13 > 0.1. At 100× it is only 60 ÷ 1800 ≈ 0.03.", s.obj === 100 ? "1000× works, but a lower magnification is enough." : s.obj !== 40 ? `Field of view ${FOV[s.obj]} µm: 60 ÷ ${FOV[s.obj]} = ${fmt(60 / FOV[s.obj], 3)} — too small.` : why(s)), { obj: 40, focus: 70 }, { lock: ["spec"], wrong: { obj: 100, focus: 88 } })
};

// ---------- diagram tasks ----------
const PARTS = { plant: { nucleus: "nucleus", wall: "cell wall", membrane: "cell membrane", chloro: "chloroplast", vacuole: "vacuole", cyto: "cytoplasm" }, animal: { nucleus: "nucleus", membrane: "cell membrane", cyto: "cytoplasm", mito: "mitochondrion" } };
function bigCell(type, st) {
  const R = k => E.ring(st[k]);
  if (type === "plant") return `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#fff7f9"/>
    <g class="pk" data-k="wall"><rect x="170" y="20" width="400" height="260" rx="10" fill="none" stroke="#7cb342" stroke-width="18"/><rect x="170" y="20" width="400" height="260" rx="10" fill="none" ${R("wall")}/></g>
    <g class="pk" data-k="cyto"><rect x="186" y="36" width="368" height="228" rx="8" fill="#f1f8e9" ${R("cyto")}/></g>
    <g class="pk" data-k="membrane"><rect x="186" y="36" width="368" height="228" rx="8" fill="none" stroke="#c0ca33" stroke-width="7"/><rect x="186" y="36" width="368" height="228" rx="8" fill="none" ${R("membrane")}/></g>
    <g class="pk" data-k="vacuole"><rect x="300" y="70" width="210" height="160" rx="40" fill="#e1f5fe" stroke="#81d4fa" stroke-width="3"/><rect x="300" y="70" width="210" height="160" rx="40" fill="none" ${R("vacuole")}/></g>
    <g class="pk" data-k="nucleus"><circle cx="240" cy="150" r="34" fill="#ce93d8" stroke="#8e24aa" stroke-width="3"/><circle cx="240" cy="150" r="12" fill="#8e24aa"/><circle cx="240" cy="150" r="38" fill="none" ${R("nucleus")}/></g>
    <g class="pk" data-k="chloro">${[[215, 70], [215, 235], [530, 60], [535, 240], [280, 248], [460, 250]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="16" ry="9" fill="#43a047" stroke="#1b5e20" stroke-width="2"/>`).join("")}<ellipse cx="215" cy="70" rx="20" ry="13" fill="none" ${R("chloro")}/></g></svg>`;
  return `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#fff7f9"/>
    <g class="pk" data-k="cyto"><path d="M200,150 Q190,40 360,34 Q540,30 548,140 Q560,262 380,268 Q206,272 200,150 Z" fill="#fce4ec" ${R("cyto")}/></g>
    <g class="pk" data-k="membrane"><path d="M200,150 Q190,40 360,34 Q540,30 548,140 Q560,262 380,268 Q206,272 200,150 Z" fill="none" stroke="#f06292" stroke-width="8"/><path d="M200,150 Q190,40 360,34 Q540,30 548,140 Q560,262 380,268 Q206,272 200,150 Z" fill="none" ${R("membrane")}/></g>
    <g class="pk" data-k="nucleus"><circle cx="370" cy="150" r="46" fill="#ce93d8" stroke="#8e24aa" stroke-width="3"/><circle cx="370" cy="150" r="15" fill="#8e24aa"/><circle cx="370" cy="150" r="50" fill="none" ${R("nucleus")}/></g>
    <g class="pk" data-k="mito">${[[270, 100, 20], [470, 200, -25], [460, 90, 30]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="24" ry="12" fill="#ffab91" stroke="#d84315" stroke-width="2"/><path d="M${x - 16},${y} q5,-8 8,0 t8,0 t8,0" fill="none" stroke="#d84315" stroke-width="2"/></g>`).join("")}<ellipse cx="270" cy="100" rx="28" ry="17" fill="none" ${R("mito")} transform="rotate(20 270 100)"/></g></svg>`;
}
const D = {
  part: diff => E.diaT("cell-pick", diff, 2, () => { const type = choice(["plant", "animal"]), part = choice(Object.keys(PARTS[type]));
    const role = { nucleus: "controls the cell and contains DNA", wall: "is a strong layer that supports a plant cell", membrane: "controls what goes in and out of the cell", chloro: "carries out photosynthesis", vacuole: "stores cell sap and keeps the cell firm", cyto: "is the jelly where most reactions happen", mito: "releases energy by respiration" }[part];
    return { kind: "pick", title: "👆 Find the organelle", prompt: `This is a${type === "animal" ? "n animal" : " plant"} cell. Click the part that <b>${role}</b>.`, answer: [part], names: PARTS[type],
      visual: stt => bigCell(type, stt), explain: `The ${PARTS[type][part]} ${role}.`, summary: "Identify cell organelles" }; }),
  plantOnly: diff => E.diaT("cell-mcq", diff, 1, () => { const q = choice([
      { s: { spec: "leaf", obj: 40, focus: 70, stain: true }, ask: "Which structures are found in plant cells but NOT in animal cells?", ok: "Cell wall, chloroplasts and a large permanent vacuole", bad: ["Nucleus and cell membrane", "Cytoplasm and mitochondria", "Cell membrane only"], ex: "Both cell types have a nucleus, membrane, cytoplasm and mitochondria. Only plant cells have a cell wall, chloroplasts and a large vacuole." },
      { s: { spec: "cheek", obj: 40, focus: 70, stain: false }, ask: "Why is the stain needed to see the nucleus clearly?", ok: "Cell parts are almost transparent; the stain adds colour and contrast", bad: ["The stain makes the cell bigger", "The stain kills bacteria", "Without stain there is no nucleus"], ex: "Most cell parts are colourless. Stains bind to structures like the nucleus so they stand out." },
      { s: { spec: "onion", obj: 4, focus: 20 }, ask: "You switch from 40× to 400×. What happens to the field of view?", ok: "It becomes smaller — you see fewer cells, but bigger", bad: ["It becomes larger", "It stays the same", "The cells become smaller"], ex: "Higher magnification shows a smaller area in more detail." }]);
    return { kind: "mcq", title: "🧫 Cells", prompt: "Look at the microscope view.", visual: render(st(2, Object.assign({ showVals: true, light: 60 }, q.s))), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Plant and animal cells" }; }),
  magNum: diff => E.diaT("cell-num", diff, 2, () => { const c = choice([{ img: 30, act: 0.1, M: 300 }, { img: 20, act: 0.05, M: 400 }, { img: 12, act: 0.012, M: 1000 }, { img: 50, act: 0.25, M: 200 }]);
    const vis = `<svg viewBox="0 0 740 240" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="240" fill="#fff7f9"/><rect x="90" y="50" width="250" height="140" rx="60" fill="#fce4ec" stroke="#f06292" stroke-width="5"/><circle cx="215" cy="120" r="26" fill="#ce93d8" stroke="#8e24aa" stroke-width="3"/>
      <line x1="90" x2="340" y1="215" y2="215" stroke="#212121" stroke-width="2"/><line x1="90" x2="90" y1="207" y2="223" stroke="#212121" stroke-width="2"/><line x1="340" x2="340" y1="207" y2="223" stroke="#212121" stroke-width="2"/>${T(215, 236, "image = " + c.img + " mm", { s: 15 })}
      ${T(550, 90, "real cell: " + c.act + " mm", { s: 18, c: "#6a1b4d" })}${T(550, 130, "magnification = image ÷ real", { s: 15, c: "#ad1457" })}${T(550, 160, "eyepiece = 10×", { s: 15, c: "#6a1b4d" })}</svg>`;
    return { kind: "num", title: "🧮 Magnification", prompt: "A drawing of a cell from a microscope.", visual: vis,
      fields: [{ label: "Magnification of the drawing", unit: "×", answer: c.M }, { label: "Objective needed with a 10× eyepiece", unit: "×", answer: c.M / 10 }], explain: `${c.img} ÷ ${c.act} = ${c.M}×. ${c.M} ÷ 10 = ${c.M / 10}× objective.`, summary: "Calculate magnification" }; })
};
const LEVELS = {
  1: { intro: "Use the microscope: choose a slide and objective, then focus and adjust the light.", pool: () => [S(1, 1, C.mag), S(1, 1, C.light), S(2, 1, C.focus), S(3, 1, C.chloro), S(2, 1, C.mag), D.part(1), D.plantOnly(2), D.part(3)] },
  2: { intro: "Staining and high power: see nuclei, chloroplasts and tiny blood cells.", pool: () => [S(1, 1, C.onion400), S(2, 1, C.nucleus), S(2, 1, C.fov), S(3, 1, C.blood), D.part(1), D.plantOnly(2), D.magNum(3)] },
  3: { intro: "Calculate with the microscope: image size = real size × magnification. The field of view is hidden.", pool: () => [S(1, 1, C.image), S(2, 1, C.count18), S(3, 1, C.blood8), S(3, 1, C.tenth), D.magNum(1), D.part(2), D.magNum(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a slide and an objective, then turn the focus knob until the cells are sharp. Try the stain and the light.",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render,
  goals: () => [
    { txt: "Get a sharp image at 40×", test: s => s.obj === 4 && sharp(s) && lightOK(s) },
    { txt: "Get a sharp image at 400×", test: s => s.obj === 40 && sharp(s) && lightOK(s) },
    { txt: "Look at a plant cell and an animal cell", test: (s, m) => m.plant && m.animal },
    { txt: "Stain a slide", test: s => s.stain && s.spec !== "blood" }
  ],
  track: (s, m) => { if (s.spec === "onion" || s.spec === "leaf") m.plant = 1; if (s.spec === "cheek" || s.spec === "blood") m.animal = 1; },
  facts: () => "📘 Total magnification = eyepiece × objective. Each objective needs refocusing. <b>Plant cells</b>: cell wall, chloroplasts, large vacuole. <b>Animal cells</b>: no wall, no chloroplasts."
});
E.start({ labId: "cells", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔬", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔬", "🧫", "🌿", "✨"],
  exploreDemo: () => [{ set: { focus: 20 } }, { set: { obj: 40, focus: 70 } }, { set: { spec: "cheek" } }, { set: { stain: true } }] });
})();
