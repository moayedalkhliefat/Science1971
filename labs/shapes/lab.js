"use strict";
// ===== Molecule Shapes (VSEPR) — Science Lab 1971 =====
(function () {
const E = LabEngine, choice = E.choice, T = E.svgText;
const SHAPE = { "2,0": ["linear", "180°"], "3,0": ["trigonal planar", "120°"], "2,1": ["bent", "about 118°"], "4,0": ["tetrahedral", "109.5°"], "3,1": ["trigonal pyramidal", "107°"], "2,2": ["bent", "104.5°"],
  "5,0": ["trigonal bipyramidal", "90° and 120°"], "4,1": ["seesaw", "about 90° and 117°"], "3,2": ["T-shaped", "about 87°"], "2,3": ["linear", "180°"], "6,0": ["octahedral", "90°"], "5,1": ["square pyramidal", "about 84°"], "4,2": ["square planar", "90°"],
  "1,0": ["linear (2 atoms)", "—"], "1,1": ["linear (2 atoms)", "—"], "1,2": ["linear (2 atoms)", "—"], "1,3": ["linear (2 atoms)", "—"] };
const shape = s => SHAPE[s.B + "," + s.L] || ["too many electron pairs", "—"];
const nrm = v => { const l = Math.hypot(...v); return v.map(x => x / l); };
const GEO = { 1: [[1, 0, 0]], 2: [[1, 0, 0], [-1, 0, 0]], 3: [[0, 1, 0], [0.866, -0.5, 0], [-0.866, -0.5, 0]], 4: [[0, 1, 0], [0.943, -0.333, 0], [-0.471, -0.333, 0.816], [-0.471, -0.333, -0.816]],
  5: [[1, 0, 0], [-0.5, 0, 0.866], [-0.5, 0, -0.866], [0, 1, 0], [0, -1, 0]], 6: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]] };
function project([x, y, z], ry, rx) { const c = Math.cos(ry), s = Math.sin(ry); [x, z] = [x * c + z * s, -x * s + z * c]; const c2 = Math.cos(rx), s2 = Math.sin(rx); [y, z] = [y * c2 - z * s2, y * s2 + z * c2]; return [x, y, z]; }
function mol(s, cx, cy, R, small) {
  const n = s.B + s.L; if (n < 1 || n > 6) return T(cx, cy, "Use 1–6 electron pairs", { s: 16, c: "#c62828" });
  const items = GEO[n].map((v, i) => ({ v, lone: i < s.L }));
  const pr = items.map(it => ({ ...it, p: project(nrm(it.v), 0.35, 0.4) })).sort((a, b) => a.p[2] - b.p[2]);
  let back = "", lines = "", front = ""; const ac = s.atom || "#78909c";
  pr.forEach(it => { const [x, y, z] = it.p, X = cx + x * R, Y = cy - y * R, k = 1 + z * 0.18;
    if (it.lone) { const lp = `<ellipse cx="${cx + x * R * 0.55}" cy="${cy - y * R * 0.55}" rx="${(small ? 16 : 26) * k}" ry="${(small ? 10 : 16) * k}" transform="rotate(${Math.atan2(-y, x) * 180 / Math.PI} ${cx + x * R * 0.55} ${cy - y * R * 0.55})" fill="rgba(171,71,188,.35)" stroke="#8e24aa" stroke-width="2"/><circle cx="${cx + x * R * 0.48}" cy="${cy - y * R * 0.48}" r="3.5" fill="#6a1b9a"/><circle cx="${cx + x * R * 0.62}" cy="${cy - y * R * 0.62}" r="3.5" fill="#6a1b9a"/>`; if (z < 0) back += lp; else front += lp; return; }
    const ln = `<line x1="${cx}" y1="${cy}" x2="${X}" y2="${Y}" stroke="#90a4ae" stroke-width="${(small ? 6 : 10) * k}" stroke-linecap="round"/>`, at = `<circle cx="${X}" cy="${Y}" r="${(small ? 13 : 22) * k}" fill="${ac}" stroke="#37474f" stroke-width="2"/>${s.ligand && !small ? T(X, Y + 5, s.ligand, { s: 13 * k, c: "#fff" }) : ""}`;
    if (z < 0) back += ln + at; else { lines += ln; front += at; } });
  return back + lines + `<circle cx="${cx}" cy="${cy}" r="${small ? 18 : 30}" fill="${s.centerCol || "#5c6bc0"}" stroke="#283593" stroke-width="3"/>${s.center ? T(cx, cy + 6, s.center, { s: small ? 13 : 17, c: "#fff" }) : ""}` + front;
}
function render(s) {
  const show = s.reveal || s.showVals, sh = shape(s);
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f6f5ff"/>${mol(s, 300, 230, 150)}
    ${s.title ? T(300, 40, s.title, { s: 18, c: "#311b92" }) : ""}
    <g transform="translate(600,60)"><rect width="240" height="250" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(120, 30, "ELECTRON PAIRS", { s: 12, c: "#7e57c2" })}
      ${T(120, 62, s.B + " bonding  +  " + s.L + " lone", { s: 16, c: "#311b92" })}${T(120, 88, "= " + (s.B + s.L) + " electron domains", { s: 14, c: "#5e5a85" })}
      <line x1="20" x2="220" y1="104" y2="104" stroke="#ede7f6" stroke-width="2"/>${T(120, 134, "shape:", { s: 12, c: "#7e57c2" })}${T(120, 164, show ? sh[0] : "?", { s: 19, c: "#c62828" })}
      ${T(120, 198, "bond angle:", { s: 12, c: "#7e57c2" })}${T(120, 226, show ? sh[1] : "?", { s: 17, c: "#c62828" })}</g>
    <g transform="translate(600,330)">${`<circle cx="20" cy="20" r="12" fill="#78909c" stroke="#37474f" stroke-width="2"/>`}${T(42, 25, "bonded atom", { a: "start", s: 13, c: "#37474f" })}<ellipse cx="20" cy="56" rx="18" ry="11" fill="rgba(171,71,188,.35)" stroke="#8e24aa" stroke-width="2"/>${T(42, 61, "lone pair (takes up more space)", { a: "start", s: 13, c: "#37474f" })}</g></svg>`;
}
const ctls = (lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "B", type: "step", label: "Bonding pairs (atoms attached)", min: 1, max: 6, lock: lk("B") }, { id: "L", type: "step", label: "Lone pairs on the central atom", min: 0, max: 3, lock: lk("L") }]; };
const st = o => Object.assign({ B: 2, L: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${s.B} bonds + ${s.L} lone pairs → ${shape(s)[0]} (${shape(s)[1]})`;
const is = (s, b, l) => s.B === b && s.L === l;
const simQ = (goal, s0, check, sol, o) => ({ title: "🔷 Molecule shape challenge", prompt: "Set the bonding pairs and lone pairs on the central atom, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(o && o.lock), render, run, check, hint: "Electron pairs repel and spread out as far as possible (VSEPR). Lone pairs repel more than bonding pairs, squeezing the bond angles. A double bond counts as ONE electron domain." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("vs-sim", diff, uses, mk);
const MOLS = {
  H2O: { c: "O", lig: "H", b: 2, l: 2, info: "O has 6 outer electrons and bonds to 2 H" }, NH3: { c: "N", lig: "H", b: 3, l: 1, info: "N has 5 outer electrons and bonds to 3 H" },
  CH4: { c: "C", lig: "H", b: 4, l: 0, info: "C has 4 outer electrons and bonds to 4 H" }, BF3: { c: "B", lig: "F", b: 3, l: 0, info: "B has 3 outer electrons and bonds to 3 F" },
  BeCl2: { c: "Be", lig: "Cl", b: 2, l: 0, info: "Be has 2 outer electrons and bonds to 2 Cl" }, PCl5: { c: "P", lig: "Cl", b: 5, l: 0, info: "P has 5 outer electrons and bonds to 5 Cl" },
  SF6: { c: "S", lig: "F", b: 6, l: 0, info: "S has 6 outer electrons and bonds to 6 F" }, H2S: { c: "S", lig: "H", b: 2, l: 2, info: "S has 6 outer electrons and bonds to 2 H" },
  ClF3: { c: "Cl", lig: "F", b: 3, l: 2, info: "Cl has 7 outer electrons and bonds to 3 F" }, XeF4: { c: "Xe", lig: "F", b: 4, l: 2, info: "Xe has 8 outer electrons and bonds to 4 F" },
  SF4: { c: "S", lig: "F", b: 4, l: 1, info: "S has 6 outer electrons and bonds to 4 F" }, XeF2: { c: "Xe", lig: "F", b: 2, l: 3, info: "Xe has 8 outer electrons and bonds to 2 F" },
  BrF5: { c: "Br", lig: "F", b: 5, l: 1, info: "Br has 7 outer electrons and bonds to 5 F" }, CO2: { c: "C", lig: "O", b: 2, l: 0, info: "C (4 outer electrons) makes a DOUBLE bond to each O" },
  SO2: { c: "S", lig: "O", b: 2, l: 1, info: "S (6 outer electrons) makes a double bond to each O" }
};
const SUB = f => f.replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[d]);
const realQ = (keys, lock) => () => { const k = choice(keys), m = MOLS[k];
  return simQ(`Build the shape of <b>${SUB(k)}</b>. ${m.info}.`, st({ B: 1, L: 0, center: m.c, ligand: m.lig, title: SUB(k) }), s => ok(is(s, m.b, m.l), `${SUB(k)}: ${say(s)}.`, `${SUB(k)} has ${m.b} bonding and ${m.l} lone pair(s). You built ${say(s)}.`), { B: m.b, L: m.l }, { wrong: { B: m.b, L: m.l === 0 ? 1 : m.l - 1 } }); };
const C = {
  linear: () => simQ("Make a <b>linear</b> molecule with <b>no lone pairs</b> (3 atoms).", st({ B: 4 }), s => ok(is(s, 2, 0), say(s) + ".", say(s) + "."), { B: 2, L: 0 }, { wrong: { B: 2, L: 1 } }),
  tetra: () => simQ("Make a <b>tetrahedral</b> molecule.", st(), s => ok(shape(s)[0] === "tetrahedral", say(s) + ": like methane, CH₄.", say(s) + "."), { B: 4, L: 0 }, { wrong: { B: 3, L: 1 } }),
  bent: () => simQ("Make a <b>bent</b> molecule with a bond angle of <b>104.5°</b> (like water).", st(), s => ok(is(s, 2, 2), "2 bonds + 2 lone pairs: the lone pairs push the H atoms closer together.", say(s) + "."), { B: 2, L: 2 }, { wrong: { B: 2, L: 1 } }),
  pyr: () => simQ("Make a <b>trigonal pyramidal</b> molecule.", st(), s => ok(shape(s)[0] === "trigonal pyramidal", say(s) + ": like ammonia, NH₃.", say(s) + "."), { B: 3, L: 1 }, { wrong: { B: 3, L: 0 } }),
  a120: () => simQ("Make a molecule with bond angles of exactly <b>120°</b> and <b>no lone pairs</b>.", st(), s => ok(is(s, 3, 0), "3 bonding pairs spread out flat: trigonal planar.", say(s) + "."), { B: 3, L: 0 }, { wrong: { B: 2, L: 1 } }),
  oct: () => simQ("Make a molecule where <b>all</b> bond angles are <b>90°</b> and there are <b>6 atoms</b> around the centre.", st(), s => ok(is(s, 6, 0), "Octahedral, like SF₆.", say(s) + "."), { B: 6, L: 0 }, { wrong: { B: 5, L: 1 } }),
  real1: realQ(["H2O", "NH3", "CH4", "BF3", "BeCl2"]),
  real2: realQ(["PCl5", "SF6", "H2S", "NH3"]),
  real3: realQ(["ClF3", "XeF4", "SF4", "XeF2", "BrF5"]),
  dbl: realQ(["CO2", "SO2"]),
  same: () => simQ("Make a <b>linear</b> molecule that HAS lone pairs on the central atom (like XeF₂).", st(), s => ok(is(s, 2, 3), "2 bonds + 3 lone pairs: the lone pairs sit around the middle, the atoms are opposite each other.", say(s) + "."), { B: 2, L: 3 }, { wrong: { B: 2, L: 0 } }),
  square: () => simQ("Make a <b>square planar</b> molecule.", st(), s => ok(shape(s)[0] === "square planar", "4 bonds + 2 lone pairs (opposite each other), like XeF₄.", say(s) + "."), { B: 4, L: 2 }, { wrong: { B: 4, L: 0 } })
};

// ---------- diagram tasks ----------
const D = {
  name: diff => E.diaT("vs-mcq", diff, 1, () => { const k = choice(["2,0", "3,0", "4,0", "3,1", "2,2", "6,0", "5,0"]), [b, l] = k.split(",").map(Number), right = SHAPE[k][0];
    const all = ["linear", "trigonal planar", "tetrahedral", "trigonal pyramidal", "bent", "octahedral", "trigonal bipyramidal"].filter(x => x !== right);
    return { kind: "mcq", title: "🔷 Name the shape", prompt: `A central atom with ${b} bonded atom(s) and ${l} lone pair(s).`, visual: render(st({ B: b, L: l, showVals: false })), ask: "What is the shape of this molecule?", options: E.mkOptions(right, E.pick(all, 3)), explain: `${b} bonding + ${l} lone → ${right} (${SHAPE[k][1]}).`, summary: "Name molecular shapes" }; }),
  pick: diff => E.diaT("vs-pick", diff, 2, () => { const opts = { a: [4, 0], b: [3, 1], c: [2, 2] }, order = E.shuffle(["a", "b", "c"]);
    const q = choice([["a", "the molecule with bond angle <b>109.5°</b>"], ["b", "the <b>trigonal pyramidal</b> molecule (like NH₃)"], ["c", "the molecule with <b>two lone pairs</b>"]]);
    return { kind: "pick", title: "👆 Pick the shape", prompt: "Click " + q[1] + ".", answer: [q[0]], names: { a: "tetrahedral", b: "trigonal pyramidal", c: "bent" },
      visual: stt => `<svg viewBox="0 0 900 280" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="280" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="264" rx="14" fill="#fff" ${E.ring(stt[k])}/>${mol(st({ B: opts[k][0], L: opts[k][1] }), 151 + i * 298, 140, 90, true)}${T(151 + i * 298, 260, "Molecule " + (i + 1), { s: 14 })}</g>`).join("")}</svg>`,
      explain: "4 bonds + 0 lone = tetrahedral (109.5°). 3 bonds + 1 lone = trigonal pyramidal (107°). 2 bonds + 2 lone = bent (104.5°).", summary: "Recognise shapes" }; }),
  lpNum: diff => E.diaT("vs-num", diff, 3, () => { const k = choice(["H2O", "NH3", "ClF3", "XeF4", "SF4", "PCl5"]), m = MOLS[k], ve = { O: 6, N: 5, Cl: 7, Xe: 8, S: 6, P: 5 }[m.c];
    return { kind: "num", title: "🔢 Count the lone pairs", prompt: `${SUB(k)}: the central ${m.c} has ${ve} outer electrons and makes ${m.b} single bonds.`, visual: render(st({ B: m.b, L: 0, center: m.c, ligand: m.lig, title: SUB(k) + " (lone pairs not shown)" })),
      fields: [{ label: "Electrons used in bonds (from the central atom)", unit: "", answer: m.b }, { label: "Lone pairs on the central atom", unit: "", answer: m.l }], explain: `(${ve} − ${m.b}) ÷ 2 = ${m.l} lone pair(s).`, summary: "Lone pairs from valence electrons" }; }),
  why: diff => E.diaT("vs-mcq", diff, 2, () => { const q = choice([
      { ask: "Why is the H–O–H angle in water (104.5°) smaller than 109.5°?", ok: "Lone pairs repel more strongly than bonding pairs", bad: ["Hydrogen atoms attract each other", "Water has a double bond", "Oxygen is very small"], ex: "Lone pairs are closer to the nucleus and take up more space, pushing the bonds together." },
      { ask: "Why is CO₂ linear even though it has double bonds?", ok: "A double bond counts as one electron domain, so there are 2 domains", bad: ["Double bonds are always linear", "Carbon has lone pairs", "Oxygen atoms repel to 90°"], ex: "Two domains spread out to 180°." },
      { ask: "What does VSEPR say about electron pairs?", ok: "They repel and move as far apart as possible", bad: ["They attract each other", "They stay next to each other", "Only lone pairs move"], ex: "Valence Shell Electron Pair Repulsion: pairs get as far apart as possible." }]);
    return { kind: "mcq", title: "📘 VSEPR theory", prompt: "Think about electron-pair repulsion.", visual: render(st({ B: 2, L: 2, center: "O", ligand: "H", title: "H₂O", showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Explaining shapes" }; })
};
const LEVELS = {
  1: { intro: "Electron pairs around a central atom push each other as far apart as possible. Build the basic shapes.", pool: () => [S(1, 1, C.linear), S(1, 1, C.tetra), S(2, 1, C.a120), S(2, 1, C.pyr), S(3, 1, C.bent), S(3, 1, C.oct), D.name(1), D.pick(2), D.why(3)] },
  2: { intro: "Real molecules: work out how many bonding and lone pairs the central atom has.", pool: () => [S(1, 2, C.real1), S(2, 2, C.real1), S(3, 2, C.real2), D.name(1), D.lpNum(2), D.pick(3)] },
  3: { intro: "Expanded octets and double bonds: 5 and 6 electron domains, and multiple bonds counted as one domain.", pool: () => [S(1, 1, C.dbl), S(2, 2, C.real3), S(3, 1, C.square), S(3, 1, C.same), S(2, 1, C.dbl), D.lpNum(1), D.why(2), D.lpNum(3)] }
};
const explore = E.exploreSim({
  intro: "Add bonding pairs and lone pairs to the central atom. Watch the shape and the bond angle change.",
  state: () => st({ showVals: true }), controls: () => ctls(), render,
  goals: () => [{ txt: "Make a tetrahedral shape", test: s => shape(s)[0] === "tetrahedral" }, { txt: "Add a lone pair and see the angle shrink", test: s => s.L >= 1 && s.B >= 2 }, { txt: "Make an octahedral shape", test: s => shape(s)[0] === "octahedral" }],
  facts: () => "📘 <b>VSEPR</b>: electron pairs repel. 2 domains → 180°, 3 → 120°, 4 → 109.5°, 5 → 90°/120°, 6 → 90°. Lone pairs squeeze the bond angles."
});
E.start({ labId: "shapes", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔷", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🔷", "⚛️", "✨", "⭐"],
  exploreDemo: () => [{ set: { B: 4, L: 0 } }, { set: { L: 1 } }, { set: { B: 6, L: 0 } }] });
})();
