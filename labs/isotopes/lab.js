"use strict";
// ===== Isotopes & Atomic Mass — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const EL = { H: { z: 1, n: "hydrogen", st: [1, 2] }, He: { z: 2, n: "helium", st: [3, 4] }, Li: { z: 3, n: "lithium", st: [6, 7] }, C: { z: 6, n: "carbon", st: [12, 13] }, N: { z: 7, n: "nitrogen", st: [14, 15] },
  O: { z: 8, n: "oxygen", st: [16, 17, 18] }, Ne: { z: 10, n: "neon", st: [20, 21, 22] }, Mg: { z: 12, n: "magnesium", st: [24, 25, 26] }, Cl: { z: 17, n: "chlorine", st: [35, 37] } };
const PAIRS = { Cl: [35, 37], B: [10, 11], Cu: [63, 65], Li: [6, 7], Br: [79, 81] };
const TRIO = { Mg: [24, 25, 26], Ne: [20, 21, 22], Si: [28, 29, 30] };
const SUP = n => String(n).replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const massNo = s => EL[s.el].z + s.nn;
const stable = s => EL[s.el].st.includes(massNo(s));
const avg2 = s => { const [a, b] = PAIRS[s.el2], t = s.na + s.nb; return t ? Math.round((a * s.na + b * s.nb) / t * 1000) / 1000 : 0; };
const avg3 = s => { const m = TRIO[s.el3], t = s.p1 + s.p2 + s.p3; return t ? Math.round((m[0] * s.p1 + m[1] * s.p2 + m[2] * s.p3) / t * 1000) / 1000 : 0; };
function nucleus(cx, cy, p, n, r0) { const R = rnd(p * 31 + n * 7), tot = p + n, items = []; for (let i = 0; i < tot; i++) items.push(i < p ? "p" : "n");
  for (let i = items.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [items[i], items[j]] = [items[j], items[i]]; }
  const r = r0 || 9; return items.map((t, i) => { const a = i * 2.4, d = Math.sqrt(i) * r * 0.9; return `<circle cx="${cx + d * Math.cos(a)}" cy="${cy + d * Math.sin(a)}" r="${r}" fill="${t === "p" ? "#e53935" : "#9e9e9e"}" stroke="#fff" stroke-width="1.5"/>`; }).join(""); }
function notation(x, y, A, Z, sym, col) { return `<g transform="translate(${x},${y})"><rect width="150" height="120" rx="14" fill="#fff" stroke="${col || "#7e57c2"}" stroke-width="3"/>${T(42, 44, A, { a: "end", s: 22, c: "#c62828" })}${T(42, 96, Z, { a: "end", s: 22, c: "#1565c0" })}${T(90, 82, sym, { s: 52, c: "#311b92" })}</g>`; }
function render(s) {
  const show = s.reveal || s.showVals; let g = "";
  if (s.mode === 1) { const e = EL[s.el], A = massNo(s);
    const shells = [Math.min(2, e.z), Math.min(8, Math.max(0, e.z - 2)), Math.max(0, e.z - 10)].filter(x => x > 0), RAD = [95, 140, 185];
    g = shells.map((_, i) => `<circle cx="280" cy="230" r="${RAD[i]}" fill="none" stroke="#d1c4e9" stroke-width="2" stroke-dasharray="6 6"/>`).join("") + nucleus(280, 230, e.z, s.nn, 9);
    shells.forEach((n, i) => { for (let k = 0; k < n; k++) { const a = k / n * 2 * Math.PI - Math.PI / 2; g += `<circle cx="${280 + RAD[i] * Math.cos(a)}" cy="${230 + RAD[i] * Math.sin(a)}" r="7" fill="#1e88e5"/>`; } });
    g += notation(560, 40, A, e.z, s.el) + `<g transform="translate(560,180)"><rect width="270" height="${show ? 200 : 150}" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(135, 30, e.n + "-" + A, { s: 20, c: "#311b92" })}
      ${T(20, 64, "🔴 protons: " + e.z, { a: "start", s: 15, c: "#c62828" })}${T(20, 92, "⚪ neutrons: " + s.nn, { a: "start", s: 15, c: "#616161" })}${T(20, 120, "🔵 electrons: " + e.z, { a: "start", s: 15, c: "#1565c0" })}
      ${show ? T(135, 170, stable(s) ? "✔ stable isotope" : "☢ unstable (radioactive)", { s: 16, c: stable(s) ? "#2e7d32" : "#e65100" }) : ""}</g>`;
  } else if (s.mode === 2) { const [a, b] = PAIRS[s.el2], R = rnd(9); let marbles = "";
    const list = Array(s.na).fill("a").concat(Array(s.nb).fill("b")); list.forEach((t, i) => { const x = 110 + (i % 8) * 34 + (Math.floor(i / 8) % 2) * 17, y = 360 - Math.floor(i / 8) * 30; marbles += `<circle cx="${x}" cy="${y}" r="15" fill="${t === "a" ? "#7e57c2" : "#ff9800"}" stroke="#fff" stroke-width="2"/>${T(x, y + 4, t === "a" ? a : b, { s: 10, c: "#fff" })}`; });
    g = `<path d="M80,120 L80,380 Q80,400 100,400 L400,400 Q420,400 420,380 L420,120" fill="rgba(255,255,255,.7)" stroke="#5c6bc0" stroke-width="5"/>${marbles}${T(250, 104, "sample of " + s.el2 + " atoms", { s: 15, c: "#311b92" })}
      ${notation(470, 40, a, "", s.el2, "#7e57c2")}${notation(650, 40, b, "", s.el2, "#ff9800")}${T(545, 186, s.el2 + "-" + a + ": " + s.na, { s: 15, c: "#7e57c2" })}${T(725, 186, s.el2 + "-" + b + ": " + s.nb, { s: 15, c: "#ef6c00" })}
      <g transform="translate(470,220)"><rect width="360" height="160" rx="14" fill="#263238"/><rect x="20" y="20" width="320" height="76" rx="10" fill="#0f1a12"/>${T(180, 72, show ? "Ar = " + fmt(avg2(s)) : "Ar = ?", { s: 34, c: "#7dffb3" })}${T(180, 126, "AVERAGE (RELATIVE) ATOMIC MASS", { s: 12, c: "#b0bec5" })}</g>`;
  } else { const m = TRIO[s.el3], ps = [s.p1, s.p2, s.p3], cols = ["#7e57c2", "#26a69a", "#ff9800"];
    g = `<g transform="translate(70,60)"><line x1="0" y1="300" x2="420" y2="300" stroke="#37474f" stroke-width="2"/><line x1="0" y1="0" x2="0" y2="300" stroke="#37474f" stroke-width="2"/>${[0, 25, 50, 75, 100].map(v => `<line x1="0" x2="420" y1="${300 - v * 3}" y2="${300 - v * 3}" stroke="#eceff1"/>${T(-8, 304 - v * 3, v + "%", { a: "end", s: 11, c: "#78909c" })}`).join("")}
      ${ps.map((p, i) => `<rect x="${40 + i * 130}" y="${300 - p * 3}" width="90" height="${p * 3}" fill="${cols[i]}"/>${T(85 + i * 130, 292 - p * 3, p + "%", { s: 15, c: cols[i] })}${T(85 + i * 130, 324, s.el3 + "-" + m[i], { s: 15, c: "#311b92" })}`).join("")}</g>
      <g transform="translate(560,60)"><rect width="270" height="150" rx="14" fill="#263238"/><rect x="18" y="18" width="234" height="70" rx="10" fill="#0f1a12"/>${T(135, 66, show ? "Ar = " + fmt(avg3(s)) : "Ar = ?", { s: 30, c: "#7dffb3" })}${T(135, 118, "total: " + (s.p1 + s.p2 + s.p3) + "%", { s: 14, c: s.p1 + s.p2 + s.p3 === 100 ? "#b9f6ca" : "#ff8a80" })}</g>
      <g transform="translate(560,230)"><rect width="270" height="130" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(135, 30, "Ar = Σ (mass × %) ÷ 100", { s: 15, c: "#4527a0" })}${T(135, 64, `${m[0]}×${s.p1} + ${m[1]}×${s.p2} + ${m[2]}×${s.p3}`, { s: 13, c: "#5e5a85" })}${T(135, 92, "÷ 100", { s: 13, c: "#5e5a85" })}</g>`; }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f6f5ff"/>${g}</svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 1) return [{ id: "el", type: "choice", label: "Element (sets the protons)", options: Object.keys(EL).map(v => ({ v, label: v })), wide: true, lock: lk("el") }, { id: "nn", type: "step", label: "Neutrons", min: 0, max: 24, lock: lk("nn") }];
  if (mode === 2) return [{ id: "el2", type: "choice", label: "Element", options: Object.keys(PAIRS).map(v => ({ v, label: v })), lock: lk("el2") }, { id: "na", type: "step", label: "Atoms of the lighter isotope", min: 0, max: 20, lock: lk("na") }, { id: "nb", type: "step", label: "Atoms of the heavier isotope", min: 0, max: 20, lock: lk("nb") }];
  return [{ id: "el3", type: "choice", label: "Element", options: Object.keys(TRIO).map(v => ({ v, label: v })), lock: lk("el3") }, ...["p1", "p2", "p3"].map((k, i) => ({ id: k, type: "range", label: "Isotope " + (i + 1) + " abundance", min: 0, max: 100, step: 1, nudge: 1, unit: "%", lock: lk(k) }))];
};
const stFor = (mode, o) => Object.assign(mode === 1 ? { mode, el: "C", nn: 6 } : mode === 2 ? { mode, el2: "Cl", na: 1, nb: 1 } : { mode, el3: "Mg", p1: 34, p2: 33, p3: 33 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b) => Math.abs(a - b) < 0.006;
const iso = s => `${EL[s.el].n}-${massNo(s)} (${EL[s.el].z} p, ${s.nn} n)`;
const HINT = { 1: "Mass number = protons + neutrons. Isotopes of an element have the same protons but different neutrons.", 2: "Average mass = (mass₁ × count₁ + mass₂ × count₂) ÷ total atoms.", 3: "Ar = (mass₁ × %₁ + mass₂ × %₂ + mass₃ × %₃) ÷ 100. The percentages must add up to 100." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "⚛️ Isotope challenge", 2: "⚖️ Average mass challenge", 3: "📊 Abundance challenge" }[mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("iso-sim", diff, uses, mk);
const C = {
  make: () => { const c = choice([["C", 14], ["Cl", 37], ["H", 3], ["O", 18], ["Li", 7], ["N", 15]]), z = EL[c[0]].z;
    return simQ(1, `Make <b>${EL[c[0]].n}-${c[1]}</b>.`, stFor(1, { el: c[0] === "C" ? "N" : "C", nn: 4 }), s => ok(s.el === c[0] && massNo(s) === c[1], `${iso(s)}: ${z} + ${c[1] - z} = ${c[1]}.`, `You made ${iso(s)}.`), { el: c[0], nn: c[1] - z }, { wrong: { el: c[0], nn: c[1] - z + 1 } }); },
  heavy: () => simQ(1, "Make a <b>stable</b> isotope of <b>oxygen</b> with <b>more neutrons than protons</b>.", stFor(1, { el: "O", nn: 8 }), s => ok(s.el === "O" && s.nn > 8 && stable(s), `${iso(s)} is stable.`, s.nn <= 8 ? "Oxygen has 8 protons — use more than 8 neutrons." : `${iso(s)} is radioactive.`), { nn: 9 }, { lock: ["el"], wrong: { nn: 11 } }),
  radio: () => { const c = choice([["C", 14], ["H", 3]]); return simQ(1, `Make the <b>radioactive</b> isotope ${c[0] === "C" ? "used in carbon dating" : "of hydrogen (tritium)"}.`, stFor(1, { el: c[0], nn: 0 }), s => ok(massNo(s) === c[1], `${iso(s)} is unstable and decays.`, `${iso(s)} is ${stable(s) ? "stable" : "unstable, but not the one asked for"}.`), { nn: c[1] - EL[c[0]].z }, { lock: ["el"], wrong: { nn: c[1] - EL[c[0]].z - 1 } }); },
  mass: () => { const c = choice([["Mg", 26], ["Ne", 22], ["Cl", 35]]); return simQ(1, `Make a <b>${EL[c[0]].n}</b> atom with mass number <b>${c[1]}</b>. How many neutrons?`, stFor(1, { el: c[0], nn: 0 }), s => ok(massNo(s) === c[1], `${c[1]} − ${EL[c[0]].z} = ${c[1] - EL[c[0]].z} neutrons.`, `Mass number ${massNo(s)}.`), { nn: c[1] - EL[c[0]].z }, { lock: ["el"], wrong: { nn: c[1] } }); },
  equalPN: () => simQ(1, "Choose an element and make an isotope with <b>equal numbers of protons and neutrons</b> and <b>mass number 20</b>.", stFor(1, { el: "C", nn: 6 }), s => ok(s.el === "Ne" && s.nn === 10, "Neon-20: 10 protons + 10 neutrons.", `You made ${iso(s)}.`), { el: "Ne", nn: 10 }, { wrong: { el: "Ne", nn: 11 } }),
  cl355: () => simQ(2, "Make a chlorine sample with average mass <b>35.5</b>.", stFor(2, { el2: "Cl" }), s => ok(near(avg2(s), 35.5), `${s.na} × 35 + ${s.nb} × 37 → ${fmt(avg2(s))}: three Cl-35 for every Cl-37.`, `Average = ${fmt(avg2(s))}.`), { na: 3, nb: 1 }, { lock: ["el2"], wrong: { na: 2, nb: 1 } }),
  boron: () => simQ(2, "Make a boron sample with average mass <b>10.8</b>.", stFor(2, { el2: "B" }), s => ok(near(avg2(s), 10.8), "1 B-10 for every 4 B-11 → 10.8.", `Average = ${fmt(avg2(s))}.`), { na: 1, nb: 4 }, { lock: ["el2"], wrong: { na: 1, nb: 3 } }),
  cu: () => simQ(2, "Make a sample of <b>20 copper atoms</b> with average mass <b>63.5</b>.", stFor(2, { el2: "Cu" }), s => ok(near(avg2(s), 63.5) && s.na + s.nb === 20, "10 Cu-63 + 10 Cu-65 → 63.5.", s.na + s.nb !== 20 ? `That is ${s.na + s.nb} atoms.` : `Average = ${fmt(avg2(s))}.`), { na: 10, nb: 10 }, { lock: ["el2"], wrong: { na: 12, nb: 8 } }),
  li: () => simQ(2, "Make a lithium sample with average mass <b>6.9</b> using the <b>fewest atoms</b>.", stFor(2, { el2: "Li" }), s => ok(near(avg2(s), 6.9) && s.na + s.nb === 10, "1 Li-6 + 9 Li-7 = 10 atoms → 6.9.", near(avg2(s), 6.9) ? "Right average, but fewer atoms are possible." : `Average = ${fmt(avg2(s))}.`), { na: 1, nb: 9 }, { lock: ["el2"], wrong: { na: 2, nb: 18 } }),
  heavier: () => simQ(2, "Bromine: make the average <b>closer to 81 than to 79</b> using exactly <b>4 atoms</b>.", stFor(2, { el2: "Br" }), s => ok(avg2(s) > 80 && s.na + s.nb === 4, `Average ${fmt(avg2(s))}: more of the heavier isotope.`, s.na + s.nb !== 4 ? "Use 4 atoms in total." : `Average ${fmt(avg2(s))}.`), { na: 1, nb: 3 }, { lock: ["el2"], wrong: { na: 2, nb: 2 } }),
  mg: () => simQ(3, "Magnesium: Mg-24 is <b>80%</b>. Set the other two so Ar = <b>24.3</b>.", stFor(3, { el3: "Mg", p1: 80, p2: 0, p3: 20 }), s => ok(near(avg3(s), 24.3) && s.p1 + s.p2 + s.p3 === 100, "24 × 0.8 + 25 × 0.1 + 26 × 0.1 = 24.3.", s.p1 + s.p2 + s.p3 !== 100 ? "The percentages must add up to 100%." : `Ar = ${fmt(avg3(s))}.`), { p2: 10, p3: 10 }, { lock: ["el3", "p1"], wrong: { p2: 15, p3: 5 } }),
  ne: () => simQ(3, "Neon has <b>no Ne-21</b> in this sample. Make Ar = <b>20.2</b>.", stFor(3, { el3: "Ne", p1: 50, p2: 0, p3: 50 }), s => ok(near(avg3(s), 20.2) && s.p1 + s.p2 + s.p3 === 100, "90% Ne-20 + 10% Ne-22 → 20.2.", s.p1 + s.p2 + s.p3 !== 100 ? "The percentages must add up to 100%." : `Ar = ${fmt(avg3(s))}.`), { p1: 90, p3: 10 }, { lock: ["el3", "p2"], wrong: { p1: 80, p3: 20 } }),
  si: () => simQ(3, "Silicon: <b>92%</b> Si-28 and <b>5%</b> Si-29. Complete the sample and find Ar.", stFor(3, { el3: "Si", p1: 92, p2: 5, p3: 0 }), s => ok(s.p1 + s.p2 + s.p3 === 100, `3% Si-30 → Ar = ${fmt(avg3(s))}.`, "The percentages must add up to 100%."), { p3: 3 }, { lock: ["el3", "p1", "p2"], wrong: { p3: 5 } }),
  mid: () => simQ(3, "Make <b>magnesium</b> with Ar exactly <b>25.0</b> using <b>all three</b> isotopes (each at least 10%).", stFor(3, { el3: "Mg" }), s => ok(near(avg3(s), 25) && s.p1 + s.p2 + s.p3 === 100 && Math.min(s.p1, s.p2, s.p3) >= 10, "Equal amounts of Mg-24 and Mg-26 balance around 25.", Math.min(s.p1, s.p2, s.p3) < 10 ? "Each isotope must be at least 10%." : s.p1 + s.p2 + s.p3 !== 100 ? "The percentages must add up to 100%." : `Ar = ${fmt(avg3(s))}.`), { p1: 30, p2: 40, p3: 30 }, { lock: ["el3"], wrong: { p1: 40, p2: 30, p3: 30 } })
};

// ---------- diagram tasks ----------
const D = {
  count: diff => E.diaT("iso-num", diff, 2, () => { const c = choice([["Cl", 17, 37], ["C", 6, 14], ["Mg", 12, 26], ["K", 19, 40], ["O", 8, 18]]);
    return { kind: "num", title: "🔢 Read the notation", prompt: "Use the isotope notation.", visual: `<svg viewBox="0 0 740 220" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="220" fill="#f6f5ff"/>${notation(295, 40, c[2], c[1], c[0])}${T(150, 100, "mass number →", { s: 14, c: "#c62828" })}${T(150, 150, "atomic number →", { s: 14, c: "#1565c0" })}</svg>`,
      fields: [{ label: "Protons", unit: "", answer: c[1] }, { label: "Neutrons", unit: "", answer: c[2] - c[1] }, { label: "Electrons (neutral atom)", unit: "", answer: c[1] }], explain: `p = ${c[1]}, n = ${c[2]} − ${c[1]} = ${c[2] - c[1]}, e = ${c[1]}.`, summary: "Protons, neutrons, electrons" }; }),
  pick: diff => E.diaT("iso-pick", diff, 2, () => { const sets = choice([[[6, 6], [6, 8], [7, 7]], [[8, 8], [7, 9], [8, 10]], [[1, 0], [1, 2], [2, 2]]]); const odd = sets.findIndex((v, i) => sets.filter(w => w[0] === v[0]).length === 1);
    const order = E.shuffle([0, 1, 2]), names = { a0: "", a1: "", a2: "" };
    return { kind: "pick", title: "👆 Find the isotopes", prompt: "Two of these atoms are <b>isotopes of the same element</b>. Click <b>both</b>.", answer: [0, 1, 2].filter(i => i !== odd).map(i => "a" + i), many: true, names: { a0: "atom with " + sets[0][0] + " p, " + sets[0][1] + " n", a1: "atom with " + sets[1][0] + " p, " + sets[1][1] + " n", a2: "atom with " + sets[2][0] + " p, " + sets[2][1] + " n" },
      visual: st => `<svg viewBox="0 0 900 260" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="260" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="a${k}"><rect x="${8 + i * 298}" y="8" width="286" height="244" rx="14" fill="#fff" ${E.ring(st["a" + k])}/>${nucleus(151 + i * 298, 110, sets[k][0], sets[k][1], 13)}${T(151 + i * 298, 216, `🔴 ${sets[k][0]}   ⚪ ${sets[k][1]}`, { s: 16 })}${T(151 + i * 298, 240, "Atom " + (i + 1), { s: 13, c: "#7e7aa8" })}</g>`).join("")}</svg>`,
      explain: "Isotopes have the SAME number of protons (same element) but DIFFERENT numbers of neutrons.", summary: "Identify isotopes" }; }),
  arNum: diff => E.diaT("iso-num", diff, 3, () => { const c = choice([["Cl", 35, 75, 37, 25, 35.5], ["Cu", 63, 69, 65, 31, 63.62], ["Ga", 69, 60, 71, 40, 69.8], ["B", 10, 20, 11, 80, 10.8]]);
    const vis = `<svg viewBox="0 0 740 200" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="200" fill="#f6f5ff"/><rect x="170" y="30" width="400" height="140" rx="12" fill="#fff" stroke="#7e57c2" stroke-width="2"/>${T(270, 64, "isotope", { s: 15, c: "#7e57c2" })}${T(470, 64, "abundance", { s: 15, c: "#7e57c2" })}
      ${T(270, 104, c[0] + "-" + c[1], { s: 18 })}${T(470, 104, c[2] + "%", { s: 18 })}${T(270, 144, c[0] + "-" + c[3], { s: 18 })}${T(470, 144, c[4] + "%", { s: 18 })}</svg>`;
    return { kind: "num", title: "🧮 Relative atomic mass", prompt: `The isotopes of ${c[0]} and their abundances.`, visual: vis, fields: [{ label: "Relative atomic mass Ar", unit: "", answer: c[5], tol: 0.011 }], explain: `(${c[1]} × ${c[2]} + ${c[3]} × ${c[4]}) ÷ 100 = ${c[5]}.`, summary: "Calculate Ar" }; }),
  mcq: diff => E.diaT("iso-mcq", diff, 1, () => { const q = choice([
      { ask: "Why do isotopes of an element react in the same way?", ok: "They have the same number of electrons", bad: ["They have the same mass", "They have the same number of neutrons", "They are all radioactive"], ex: "Chemical reactions depend on electrons; isotopes have the same electron arrangement." },
      { ask: "Why is the relative atomic mass of chlorine 35.5 and not a whole number?", ok: "It is an average of Cl-35 and Cl-37 atoms", bad: ["Chlorine has half a proton", "Electrons add 0.5 to the mass", "It is measured badly"], ex: "Ar is the weighted average of all the isotopes in a natural sample." },
      { ask: "Carbon-12 and carbon-14 differ in…", ok: "the number of neutrons", bad: ["the number of protons", "the number of electrons", "their chemical properties"], ex: "Both have 6 protons; C-14 has 2 more neutrons." }]);
    return { kind: "mcq", title: "📘 Isotopes", prompt: "Think about isotopes.", visual: render(stFor(1, { el: "C", nn: 8, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Isotope ideas" }; })
};
const LEVELS = {
  1: { intro: "Isotopes: same element (same protons), different numbers of neutrons. Build them!", pool: () => [S(1, 1, C.make), S(1, 1, C.mass), S(2, 1, C.radio), S(2, 1, C.heavy), S(3, 1, C.equalPN), S(3, 1, C.make), D.mcq(1), D.count(2), D.pick(3)] },
  2: { intro: "Real samples are mixtures of isotopes. The relative atomic mass is their average.", pool: () => [S(1, 1, C.heavier), S(2, 1, C.cl355), S(2, 1, C.cu), S(3, 1, C.boron), S(3, 1, C.li), D.count(1), D.pick(2), D.arNum(3)] },
  3: { intro: "Percentage abundance: Ar = Σ(mass × %) ÷ 100.", pool: () => [S(1, 1, C.si), S(2, 1, C.ne), S(3, 1, C.mg), S(3, 1, C.mid), D.mcq(1), D.arNum(2), D.arNum(3)] }
};
const explore = E.exploreSim({
  intro: "Level 1: build isotopes. Level 2: mix isotopes in a sample. Level 3: set percentage abundances.",
  state: lv => stFor(lv, { showVals: true }), controls: lv => ctlsFor(lv), render,
  goals: lv => lv === 1 ? [{ txt: "Make a stable isotope", test: s => stable(s) }, { txt: "Make an unstable (radioactive) isotope", test: s => !stable(s) && s.nn > 0 }] : lv === 2 ? [{ txt: "Make the average exactly halfway", test: s => s.na === s.nb && s.na > 0 }, { txt: "Make the average closer to the heavier isotope", test: s => s.nb > s.na }] : [{ txt: "Make the percentages add up to 100%", test: s => s.p1 + s.p2 + s.p3 === 100 }, { txt: "Make one isotope 0%", test: s => Math.min(s.p1, s.p2, s.p3) === 0 && s.p1 + s.p2 + s.p3 === 100 }],
  facts: lv => lv === 1 ? "📘 <b>Isotopes</b>: same protons, different neutrons. Mass number = protons + neutrons." : "📘 <b>Relative atomic mass (Ar)</b> = weighted average mass of the isotopes in a sample."
});
E.start({ labId: "isotopes", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚛️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚛️", "🔴", "⚪", "✨"],
  exploreDemo: lv => lv === 1 ? [{ set: { nn: 6 } }, { set: { nn: 8 } }] : lv === 2 ? [{ set: { na: 2, nb: 2 } }, { set: { nb: 5 } }] : [{ set: { p1: 50, p2: 50, p3: 0 } }] });
})();
