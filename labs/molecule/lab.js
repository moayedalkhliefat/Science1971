"use strict";
// ===== Build a Molecule — Science Lab 1971 =====
(function () {
const E = LabEngine, choice = E.choice, T = E.svgText;
const EL = { H: { c: "#fafafa", s: "#90a4ae", t: "#263238", r: 15, v: 1, n: "hydrogen" }, C: { c: "#424242", s: "#111", t: "#fff", r: 21, v: 4, n: "carbon" }, N: { c: "#1e88e5", s: "#0d47a1", t: "#fff", r: 21, v: 3, n: "nitrogen" },
  O: { c: "#e53935", s: "#b71c1c", t: "#fff", r: 21, v: 2, n: "oxygen" }, Cl: { c: "#43a047", s: "#1b5e20", t: "#fff", r: 23, v: 1, n: "chlorine" } };
const ORDER = ["C", "H", "N", "O", "Cl"];
const M = (name, shape, atoms, bonds) => ({ name, shape, atoms, bonds });
const LIB = {
  H2: M("Hydrogen", "linear", [["H", -0.5, 0], ["H", 0.5, 0]], [[0, 1, 1]]),
  O2: M("Oxygen", "linear", [["O", -0.6, 0], ["O", 0.6, 0]], [[0, 1, 2]]),
  N2: M("Nitrogen", "linear", [["N", -0.6, 0], ["N", 0.6, 0]], [[0, 1, 3]]),
  Cl2: M("Chlorine", "linear", [["Cl", -0.65, 0], ["Cl", 0.65, 0]], [[0, 1, 1]]),
  HCl: M("Hydrogen chloride", "linear", [["H", -0.6, 0], ["Cl", 0.6, 0]], [[0, 1, 1]]),
  H2O: M("Water", "bent", [["O", 0, -0.2], ["H", -0.85, 0.45], ["H", 0.85, 0.45]], [[0, 1, 1], [0, 2, 1]]),
  H2O2: M("Hydrogen peroxide", "bent (non-flat)", [["O", -0.6, 0], ["O", 0.6, 0], ["H", -1.3, -0.65], ["H", 1.3, 0.65]], [[0, 1, 1], [0, 2, 1], [1, 3, 1]]),
  NH3: M("Ammonia", "trigonal pyramidal", [["N", 0, -0.2], ["H", -0.95, 0.4], ["H", 0.95, 0.4], ["H", 0, 0.85]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]),
  CH4: M("Methane", "tetrahedral", [["C", 0, 0], ["H", 0, -1], ["H", 1, 0], ["H", 0, 1], ["H", -1, 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]),
  CCl4: M("Tetrachloromethane", "tetrahedral", [["C", 0, 0], ["Cl", 0, -1.15], ["Cl", 1.15, 0], ["Cl", 0, 1.15], ["Cl", -1.15, 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]),
  CH3Cl: M("Chloromethane", "tetrahedral", [["C", 0, 0], ["Cl", 1.15, 0], ["H", 0, -1], ["H", 0, 1], ["H", -1, 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]),
  CO2: M("Carbon dioxide", "linear", [["O", -1.2, 0], ["C", 0, 0], ["O", 1.2, 0]], [[0, 1, 2], [1, 2, 2]]),
  HCN: M("Hydrogen cyanide", "linear", [["H", -1.1, 0], ["C", 0, 0], ["N", 1.2, 0]], [[0, 1, 1], [1, 2, 3]]),
  C2H2: M("Ethyne (acetylene)", "linear", [["H", -1.9, 0], ["C", -0.6, 0], ["C", 0.6, 0], ["H", 1.9, 0]], [[0, 1, 1], [1, 2, 3], [2, 3, 1]]),
  C2H4: M("Ethene", "flat (trigonal planar)", [["C", -0.62, 0], ["C", 0.62, 0], ["H", -1.25, -0.85], ["H", -1.25, 0.85], ["H", 1.25, -0.85], ["H", 1.25, 0.85]], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]),
  C2H6: M("Ethane", "tetrahedral", [["C", -0.6, 0], ["C", 0.6, 0], ["H", -0.6, -1], ["H", -0.6, 1], ["H", -1.6, 0], ["H", 0.6, -1], ["H", 0.6, 1], ["H", 1.6, 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1], [1, 6, 1], [1, 7, 1]]),
  CH2O: M("Methanal (formaldehyde)", "trigonal planar", [["C", -0.3, 0], ["O", 0.9, 0], ["H", -1, -0.8], ["H", -1, 0.8]], [[0, 1, 2], [0, 2, 1], [0, 3, 1]]),
  CH4O: M("Methanol", "tetrahedral", [["C", -0.6, 0], ["O", 0.6, 0], ["H", -0.6, -1], ["H", -0.6, 1], ["H", -1.6, 0], ["H", 1.3, 0.65]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1]])
};
const SUBD = "₀₁₂₃₄₅₆₇₈₉";
const keyOf = cnt => ORDER.filter(e => cnt[e]).map(e => e + (cnt[e] > 1 ? cnt[e] : "")).join("");
const BYKEY = {}; Object.keys(LIB).forEach(k => { const c = {}; LIB[k].atoms.forEach(a => c[a[0]] = (c[a[0]] || 0) + 1); BYKEY[keyOf(c)] = k; });
const formula = k => (k === "CH4O" ? "CH3OH" : k).replace(/\d/g, d => SUBD[+d]);
const cntOf = s => ({ C: s.C, H: s.H, N: s.N, O: s.O, Cl: s.Cl });
const molOf = s => BYKEY[keyOf(cntOf(s))] || null;
const nAtoms = s => ORDER.reduce((a, e) => a + (s[e] || 0), 0);
const bondCount = (k, o) => LIB[k].bonds.filter(b => o == null || b[2] === o).length;
function drawMol(m, cx, cy, sc, small) {
  let g = "";
  m.bonds.forEach(([i, j, o]) => { const [, x1, y1] = m.atoms[i], [, x2, y2] = m.atoms[j]; const X1 = cx + x1 * sc, Y1 = cy + y1 * sc, X2 = cx + x2 * sc, Y2 = cy + y2 * sc, L = Math.hypot(X2 - X1, Y2 - Y1), nx = -(Y2 - Y1) / L, ny = (X2 - X1) / L, gap = small ? 4 : 6;
    for (let k = 0; k < o; k++) { const off = (k - (o - 1) / 2) * gap; g += `<line x1="${X1 + nx * off}" y1="${Y1 + ny * off}" x2="${X2 + nx * off}" y2="${Y2 + ny * off}" stroke="#37474f" stroke-width="${small ? 3 : 4}" stroke-linecap="round"/>`; } });
  m.atoms.forEach(([e, x, y]) => { const d = EL[e], r = d.r * (small ? 0.7 : 1); g += `<circle cx="${cx + x * sc}" cy="${cy + y * sc}" r="${r}" fill="${d.c}" stroke="${d.s}" stroke-width="2"/>${T(cx + x * sc, cy + y * sc + (small ? 4 : 6), e, { s: small ? 11 : 15, c: d.t })}`; });
  return g;
}
function loose(s, x0, y0, w) { // atoms that are not a stable molecule, with their bond "arms"
  const list = []; ORDER.forEach(e => { for (let i = 0; i < (s[e] || 0); i++) list.push(e); });
  const per = Math.max(1, Math.min(list.length, 6)), gap = Math.min(80, w / per); let g = "";
  list.forEach((e, i) => { const x = x0 + w / 2 + ((i % per) - (per - 1) / 2) * gap, y = y0 + Math.floor(i / per) * 80, d = EL[e];
    for (let k = 0; k < d.v; k++) { const a = -Math.PI / 2 + k * 2 * Math.PI / d.v; g += `<line x1="${x}" y1="${y}" x2="${x + Math.cos(a) * (d.r + 12)}" y2="${y + Math.sin(a) * (d.r + 12)}" stroke="#ef6c00" stroke-width="3" stroke-dasharray="4 3"/>`; }
    g += `<circle cx="${x}" cy="${y}" r="${d.r}" fill="${d.c}" stroke="${d.s}" stroke-width="2"/>${T(x, y + 6, e, { s: 15, c: d.t })}`; });
  return g;
}
function render(s) {
  const k = molOf(s), n = nAtoms(s);
  let kit = ORDER.map((e, i) => { const d = EL[e], y = 46 + i * 64; return `<circle cx="58" cy="${y + 16}" r="${d.r}" fill="${d.c}" stroke="${d.s}" stroke-width="2"/>${T(58, y + 22, e, { s: 15, c: d.t })}${T(92, y + 12, d.n, { a: "start", s: 13, c: "#311b92" })}${T(92, y + 32, "makes " + d.v + " bond" + (d.v > 1 ? "s" : ""), { a: "start", s: 12, c: "#7e7aa8" })}${s[e] ? `<circle cx="80" cy="${y - 2}" r="12" fill="#4527a0"/>${T(80, y + 3, s[e], { s: 13, c: "#fff" })}` : ""}`; }).join("");
  let work, info;
  if (!n) { work = T(470, 220, "Add atoms with the + buttons to build a molecule", { s: 16, c: "#9e9ac8" }); info = ""; }
  else if (k) { const m = LIB[k], xs = m.atoms.map(a => a[1]), ys = m.atoms.map(a => a[2]); const span = Math.max(Math.max(...xs) - Math.min(...xs), (Math.max(...ys) - Math.min(...ys)) * 1.3, 1); const sc = Math.min(110, 360 / (span + 0.6));
    work = drawMol(m, 470 - (Math.max(...xs) + Math.min(...xs)) / 2 * sc, 200 - (Math.max(...ys) + Math.min(...ys)) / 2 * sc, sc);
    const b1 = bondCount(k, 1), b2 = bondCount(k, 2), b3 = bondCount(k, 3);
    info = `<rect x="250" y="340" width="440" height="96" rx="14" fill="#e8f5e9" stroke="#43a047" stroke-width="2"/>${T(470, 368, "✓ " + m.name + "  ·  " + formula(k), { s: 18, c: "#1b5e20" })}
      ${T(470, 394, `${n} atoms · ${[b1 ? b1 + " single" : "", b2 ? b2 + " double" : "", b3 ? b3 + " triple" : ""].filter(Boolean).join(" · ")} bond${b1 + b2 + b3 > 1 ? "s" : ""}`, { s: 14, c: "#2e7d32" })}${T(470, 418, "shape: " + m.shape, { s: 14, c: "#2e7d32" })}`; }
  else { work = loose(s, 250, 120, 440); info = `<rect x="250" y="340" width="440" height="80" rx="14" fill="#fff3e0" stroke="#ef6c00" stroke-width="2"/>${T(470, 372, "✗ Not a stable molecule", { s: 18, c: "#e65100" })}${T(470, 400, "Every atom must use ALL its bonds (dashed arms).", { s: 14, c: "#bf360c" })}`; }
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f6f5ff"/>
    <rect x="16" y="16" width="200" height="340" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(116, 38, "ATOM KIT", { s: 13, c: "#7e7aa8" })}${kit}
    <rect x="236" y="16" width="548" height="314" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(510, 38, "WORKSPACE", { s: 13, c: "#7e7aa8" })}${work}${info}</svg>`;
}
const ctls = () => ORDER.map(e => ({ id: e, type: "step", label: `${EL[e].n} (${e})`, min: 0, max: e === "H" ? 8 : e === "Cl" ? 4 : 2 }));
const st = o => Object.assign({ C: 0, H: 0, N: 0, O: 0, Cl: 0 }, o || {});
const solOf = k => { const c = { C: 0, H: 0, N: 0, O: 0, Cl: 0 }; LIB[k].atoms.forEach(a => c[a[0]]++); return c; };
const run = (s, box) => new Promise(res => { box.innerHTML = render(s); setTimeout(res, 700); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const got = s => { const k = molOf(s); return k ? `You built ${LIB[k].name} (${formula(k)})` : nAtoms(s) ? "These atoms do not make a stable molecule" : "The workspace is empty"; };
const simQ = (goal, check, sol, wrong) => ({ title: "⚛️ Molecule challenge", prompt: "Choose the atoms for your molecule with − / +. The bonds form automatically when every atom has the right number of bonds. Then press <b>▶ Run & check</b>.", goal,
  sim: { state: st(), controls: ctls(), render, run, check, hint: "Bonds each atom makes: H 1 · Cl 1 · O 2 · N 3 · C 4. A double bond counts as 2, a triple bond as 3." },
  solution: solOf(sol), wrong: wrong ? solOf(wrong) : Object.assign(solOf(sol), { H: solOf(sol).H + 1 }), summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mol-sim", diff, uses, mk);
const is = (s, ks) => ks.includes(molOf(s));
const C = {
  byFormula: () => { const k = choice(["H2O", "NH3", "CH4", "HCl", "O2", "N2", "CO2"]);
    return simQ(`Build one molecule of <b>${formula(k)}</b>.`, s => ok(molOf(s) === k, got(s) + ".", got(s) + `, not ${formula(k)}.`), k); },
  byName: () => { const k = choice(["H2O", "NH3", "CH4", "CO2", "HCl", "H2O2", "C2H6"]);
    return simQ(`Build a molecule of <b>${LIB[k].name.toLowerCase()}</b>.`, s => ok(molOf(s) === k, got(s) + ".", got(s) + "."), k); },
  three: () => simQ("Build a stable molecule made of exactly <b>3 atoms</b>.", s => ok(molOf(s) && nAtoms(s) === 3, got(s) + ": 3 atoms.", got(s) + (molOf(s) ? ` — it has ${nAtoms(s)} atoms.` : ".")), "H2O", "NH3"),
  five: () => simQ("Build a stable molecule made of exactly <b>5 atoms</b> that contains <b>carbon</b>.", s => ok(molOf(s) && nAtoms(s) === 5 && s.C > 0, got(s) + ".", got(s) + (molOf(s) ? ` — ${nAtoms(s)} atoms${s.C ? "" : ", no carbon"}.` : ".")), "CH4", "C2H2"),
  dbl: () => simQ("Build a molecule that has a <b>double bond</b>.", s => ok(molOf(s) && bondCount(molOf(s), 2) > 0, got(s) + " — it has a double bond.", got(s) + (molOf(s) ? " — no double bond." : ".")), "O2", "H2O"),
  chlorine: () => simQ("Build a molecule with <b>one carbon</b> and <b>chlorine</b> atoms only.", s => ok(molOf(s) === "CCl4", got(s) + ".", got(s) + "."), "CCl4", "CH3Cl"),
  twoDbl: () => simQ("Build a molecule that has <b>two double bonds</b>.", s => ok(molOf(s) && bondCount(molOf(s), 2) === 2, got(s) + " — O=C=O.", got(s) + "."), "CO2", "CH2O"),
  tripleH: () => simQ("Build a molecule that has a <b>triple bond</b> and contains <b>hydrogen</b>.", s => ok(molOf(s) && bondCount(molOf(s), 3) > 0 && s.H > 0, got(s) + ".", got(s) + "."), choice(["HCN", "C2H2"]), "N2"),
  seven: () => simQ("Build a molecule with <b>7 bonds, all single</b>.", s => ok(molOf(s) === "C2H6", got(s) + ": 1 C–C + 6 C–H.", got(s) + "."), "C2H6", "C2H4"),
  sixO: () => simQ("Build a molecule of <b>6 atoms</b> that contains <b>carbon and oxygen</b>.", s => ok(molOf(s) === "CH4O", got(s) + ".", got(s) + "."), "CH4O", "CH2O"),
  oo: () => simQ("Build a molecule with a <b>single bond between two oxygen atoms</b>.", s => ok(molOf(s) === "H2O2", got(s) + ": H–O–O–H.", got(s) + "."), "H2O2", "O2"),
  flat: () => simQ("Build a molecule with <b>two carbons and a double bond</b>.", s => ok(molOf(s) === "C2H4", got(s) + ".", got(s) + "."), "C2H4", "C2H6")
};

// ---------- diagram tasks ----------
const BAD = [
  M("", "", [["C", 0, 0], ["H", 0, -1], ["H", 1, 0], ["H", -1, 0]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]),
  M("", "", [["O", 0, 0], ["H", -0.9, 0.5], ["H", 0.9, 0.5], ["H", 0, -1]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]),
  M("", "", [["O", -1.1, 0], ["H", 0, 0], ["O", 1.1, 0]], [[0, 1, 1], [1, 2, 1]]),
  M("", "", [["N", -0.6, 0], ["N", 0.6, 0]], [[0, 1, 2]]),
  M("", "", [["C", -1.2, 0], ["O", 0, 0], ["C", 1.2, 0]], [[0, 1, 2], [1, 2, 2]])
];
const BADWHY = ["carbon has only 3 bonds (it needs 4)", "oxygen has 3 bonds (it needs 2)", "hydrogen has 2 bonds (it can only make 1)", "each nitrogen has only 2 bonds (it needs 3)", "oxygen has 4 bonds (it needs 2) and each carbon only 2"];
const D = {
  rules: diff => E.diaT("mol-pick", diff, 2, () => { const goods = E.pick(["H2O", "NH3", "CH4", "CO2", "HCN", "C2H4", "CH2O"], 2), bi = Math.floor(Math.random() * BAD.length);
    const items = [{ k: "bad", m: BAD[bi] }, { k: "g0", m: LIB[goods[0]] }, { k: "g1", m: LIB[goods[1]] }], order = E.shuffle([0, 1, 2]);
    return { kind: "pick", title: "👆 Break the rules?", prompt: "One drawing <b>breaks the bonding rules</b>. Click it. (H 1 · O 2 · N 3 · C 4 bonds)", answer: ["bad"], names: { bad: "the wrong drawing", g0: LIB[goods[0]].name, g1: LIB[goods[1]].name },
      visual: st => `<svg viewBox="0 0 740 250" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="250" fill="#f6f5ff"/>${order.map((ix, i) => { const it = items[ix], xs = it.m.atoms.map(a => a[1]); const sc = Math.min(60, 170 / (Math.max(...xs) - Math.min(...xs) + 1.2));
        return `<g class="pk" data-k="${it.k}"><rect x="${8 + i * 245}" y="10" width="234" height="230" rx="14" fill="#fff" ${E.ring(st[it.k])}/>${drawMol(it.m, 125 + i * 245 - (Math.max(...xs) + Math.min(...xs)) / 2 * sc, 115, sc, true)}${T(125 + i * 245, 228, "Drawing " + (i + 1), { s: 14 })}</g>`; }).join("")}</svg>`,
      explain: "In the wrong drawing, " + BADWHY[bi] + ". Every atom must make its exact number of bonds.", summary: "Check bonding rules" }; }),
  count: diff => E.diaT("mol-num", diff, 2, () => { const k = choice(["C2H4", "C2H6", "CH4O", "HCN", "CO2", "H2O2", "CH2O", "C2H2"]), m = LIB[k];
    const xs = m.atoms.map(a => a[1]), sc = Math.min(100, 520 / (Math.max(...xs) - Math.min(...xs) + 1));
    const vis = `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="260" fill="#fff"/>${drawMol(m, 370 - (Math.max(...xs) + Math.min(...xs)) / 2 * sc, 125, sc)}</svg>`;
    return { kind: "num", title: "🔢 Count atoms and bonds", prompt: `This is a molecule of ${m.name.toLowerCase()}.`, visual: vis,
      fields: [{ label: "Number of atoms", unit: "", answer: m.atoms.length }, { label: "Single bonds", unit: "", answer: bondCount(k, 1) }, { label: "Double + triple bonds", unit: "", answer: bondCount(k, 2) + bondCount(k, 3) }],
      explain: `${formula(k)}: ${m.atoms.length} atoms, ${bondCount(k, 1)} single, ${bondCount(k, 2)} double, ${bondCount(k, 3)} triple bond(s).`, summary: "Count atoms and bonds" }; }),
  formulaMcq: diff => E.diaT("mol-mcq", diff, 1, () => { const k = choice(["NH3", "CH4O", "C2H6", "CH3Cl", "H2O2", "HCN"]), m = LIB[k], wrong = E.pick(Object.keys(LIB).filter(x => x !== k && LIB[x].atoms.length >= 3), 3);
    const xs = m.atoms.map(a => a[1]), sc = Math.min(100, 520 / (Math.max(...xs) - Math.min(...xs) + 1));
    return { kind: "mcq", title: "🧾 Write the formula", prompt: "Look at the structure of the molecule.", visual: `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="260" fill="#fff"/>${drawMol(m, 370 - (Math.max(...xs) + Math.min(...xs)) / 2 * sc, 125, sc)}</svg>`,
      ask: "What is its chemical formula?", options: E.mkOptions(formula(k), wrong.map(formula)), explain: `Count each type of atom: ${formula(k)} (${m.name}).`, summary: "Formula from a structure" }; }),
  shape: diff => E.diaT("mol-mcq", diff, 3, () => { const q = choice([
      { k: "CO2", ask: "Carbon dioxide has a <b>linear</b> shape. Why?", ok: "Carbon makes two double bonds in opposite directions", bad: ["Carbon has no bonds", "Oxygen atoms attract each other", "It has a triple bond"], ex: "The two bonding regions around carbon push apart to 180° — linear." },
      { k: "H2O", ask: "Why does each oxygen atom make exactly two bonds?", ok: "Oxygen needs 2 more electrons to fill its outer shell", bad: ["Oxygen has 2 protons", "Oxygen is a metal", "Oxygen is always in water"], ex: "Oxygen has 6 outer electrons; sharing 2 more (two bonds) gives a full shell of 8." },
      { k: "N2", ask: "How many electrons are shared in the triple bond of N₂?", ok: "6", bad: ["3", "2", "9"], ex: "Each bond is a shared pair of electrons: 3 bonds × 2 = 6 electrons." }]);
    const m = LIB[q.k], xs = m.atoms.map(a => a[1]), sc = Math.min(110, 420 / (Math.max(...xs) - Math.min(...xs) + 1));
    return { kind: "mcq", title: "🔬 Bonds and shapes", prompt: m.name + " (" + formula(q.k) + ")", visual: `<svg viewBox="0 0 740 240" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="240" fill="#fff"/>${drawMol(m, 370 - (Math.max(...xs) + Math.min(...xs)) / 2 * sc, 120, sc)}</svg>`,
      ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Covalent bonds and shapes" }; })
};
const LEVELS = {
  1: { intro: "Build simple molecules from their formulas. Each atom makes a fixed number of bonds.", pool: () => [S(1, 2, C.byFormula), S(2, 2, C.byFormula), S(2, 1, C.three), S(3, 1, C.dbl), S(3, 1, C.five), D.formulaMcq(1), D.count(2), D.rules(3)] },
  2: { intro: "Build molecules from their names, and molecules with double bonds.", pool: () => [S(1, 1, C.byName), S(2, 1, C.byName), S(2, 1, C.chlorine), S(3, 1, C.twoDbl), S(3, 1, C.flat), D.formulaMcq(1), D.rules(2), D.count(3)] },
  3: { intro: "Expert builder: molecules described only by their bonds and atoms.", pool: () => [S(1, 1, C.tripleH), S(2, 1, C.seven), S(2, 1, C.sixO), S(3, 1, C.oo), S(3, 1, C.twoDbl), D.count(1), D.rules(2), D.shape(3)] }
};
const explore = E.exploreSim({
  intro: "Add atoms to the workspace. When every atom uses all of its bonds, the molecule forms and is named.",
  state: () => st(), controls: () => ctls(), render,
  goals: () => [
    { txt: "Build water (H₂O)", test: s => molOf(s) === "H2O" },
    { txt: "Build a molecule that contains carbon", test: (s, m) => m.carbon },
    { txt: "Build a molecule with a double or triple bond", test: (s, m) => m.multi },
    { txt: "Build 4 different molecules", test: (s, m) => (m.made || new Set()).size >= 4 }
  ],
  track: (s, m) => { const k = molOf(s); if (!k) return; (m.made = m.made || new Set()).add(k); if (s.C) m.carbon = 1; if (bondCount(k, 2) + bondCount(k, 3)) m.multi = 1; },
  facts: () => "📘 A <b>covalent bond</b> is a shared pair of electrons. Each atom makes a fixed number of bonds: <b>H 1, Cl 1, O 2, N 3, C 4</b>. Double bond = 2 shared pairs."
});
E.start({ labId: "molecule", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚛️", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["⚛️", "🧪", "⭐", "✨"],
  exploreDemo: () => [{ set: solOf("H2O") }, { set: solOf("CH4") }, { set: solOf("CO2") }, { set: solOf("NH3") }] });
})();
