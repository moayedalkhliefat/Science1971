"use strict";
// ===== Capacitor Lab — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
const DIEL = { air: { name: "Air", k: 1, c: "none" }, plastic: { name: "Plastic", k: 2, c: "#ffe082" }, glass: { name: "Glass", k: 4, c: "#b2ebf2" } };
const Cp = s => r2(0.885 * DIEL[s.diel].k * s.A / s.d);       // pF  (ε0 = 8.85 pF/m)
const Q = s => r1(Cp(s) * s.V);                                   // pC
const U = s => r1(0.5 * Cp(s) * s.V * s.V);                      // pJ
const Ef = s => r2(s.V / s.d);                                    // V/mm
function render(s) {
  const show = s.reveal, D = DIEL[s.diel], w = 120 + Math.sqrt(s.A) * 8, gap = 16 + s.d * 16, cx = 260, top = 220 - gap / 2, bot = 220 + gap / 2, sk = 34;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += `<g transform="translate(290,232) scale(1.3) translate(-290,-232)">`;
  const plate = (y, col) => `<path d="M${cx - w / 2},${y} L${cx + w / 2},${y} L${cx + w / 2 + sk},${y - sk * 0.6} L${cx - w / 2 + sk},${y - sk * 0.6}Z" fill="${col}" stroke="#455a64" stroke-width="2"/><path d="M${cx - w / 2},${y} L${cx + w / 2},${y} L${cx + w / 2},${y + 6} L${cx - w / 2},${y + 6}Z" fill="#90a4ae"/>`;
  if (D.c !== "none") g += `<path d="M${cx - w / 2 + 4},${bot - 2} L${cx + w / 2 - 4},${bot - 2} L${cx + w / 2 - 4},${top + 8} L${cx - w / 2 + 4},${top + 8}Z" fill="${D.c}" opacity=".8"/>`;
  g += plate(bot, "#cfd8dc");
  if (show && s.V > 0) { const n = Math.min(9, 2 + Math.round(Ef(s) * 1.5)); for (let i = 0; i < n; i++) { const x = cx - w / 2 + 20 + i * (w - 40) / Math.max(1, n - 1); g += `<line x1="${x}" y1="${top + 10}" x2="${x}" y2="${bot - 10}" stroke="#e53935" stroke-width="1.5"/><path d="M${x},${bot - 6} l-4,-8 h8Z" fill="#e53935"/>`; } }
  g += plate(top, "#eceff1");
  if (show && s.V > 0) { const nq = Math.min(14, 2 + Math.round(Q(s) / 250)); for (let i = 0; i < nq; i++) { const x = cx - w / 2 + 16 + i * (w - 20) / nq; g += T(x + 10, top - 8, "+", { s: 14, c: "#c62828" }) + T(x + 4, bot + 22, "−", { s: 16, c: "#1565c0" }); } }
  // battery & wires
  g += `<path d="M${cx + w / 2},${top - 4} H${cx + w / 2 + 80} V180 M${cx + w / 2},${bot + 4} H${cx + w / 2 + 80} V260" fill="none" stroke="#455a64" stroke-width="3"/><rect x="${cx + w / 2 + 60}" y="180" width="40" height="80" rx="6" fill="#37474f"/><rect x="${cx + w / 2 + 72}" y="172" width="16" height="8" fill="#37474f"/>${T(cx + w / 2 + 80, 225, s.V + " V", { s: 13, c: "#fff" })}`;
  g += `<line x1="${cx - w / 2 - 22}" y1="${top}" x2="${cx - w / 2 - 22}" y2="${bot}" stroke="#78909c" stroke-width="1.5"/>${T(cx - w / 2 - 28, 224, s.d + " mm", { a: "end", s: 12, c: "#546e7a" })}${T(cx, 378, `plates ${s.A} cm² · ${D.name.toLowerCase()} between`, { s: 12, c: "#37474f" })}</g>`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${show ? T(120, 66, "capacitance", { s: 12, c: "#78909c" }) + T(120, 94, "C = " + fmt(Cp(s)) + " pF", { s: 20, c: "#e65100" }) + T(120, 130, "charge Q = C × V", { s: 12, c: "#78909c" }) + T(120, 154, fmt(Q(s)) + " pC", { s: 17, c: "#37474f" }) + T(120, 190, "energy U = ½CV²", { s: 12, c: "#78909c" }) + T(120, 214, fmt(U(s)) + " pJ", { s: 17, c: "#37474f" }) + T(120, 250, "field E = V ÷ d", { s: 12, c: "#78909c" }) + T(120, 274, fmt(Ef(s)) + " V/mm", { s: 17, c: "#37474f" }) : T(120, 170, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 330, "C = 0.885 × k × A ÷ d", { s: 13, c: "#37474f" })}${T(120, 350, "(A in cm², d in mm, C in pF)", { s: 10, c: "#90a4ae" })}${T(120, 370, "k: air 1 · plastic 2 · glass 4", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "A", type: "choice", label: "Plate area", options: [100, 200, 400].map(v => ({ v, label: v + " cm²" })), lock: lk("A") },
  { id: "d", type: "range", label: "Gap between plates", min: 1, max: 10, step: 1, nudge: 1, unit: "mm", lock: lk("d") },
  { id: "diel", type: "choice", label: "Material between plates", options: Object.keys(DIEL).map(v => ({ v, label: DIEL[v].name })), lock: lk("diel") },
  { id: "V", type: "range", label: "Battery voltage", min: 0, max: 12, step: 1, nudge: 1, unit: "V", hide: () => lv < 2, lock: lk("V") }]; };
const st = o => Object.assign({ A: 200, d: 2, diel: "air", V: 6 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `C = ${fmt(Cp(s))} pF, Q = ${fmt(Q(s))} pC, U = ${fmt(U(s))} pJ, E = ${fmt(Ef(s))} V/mm.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔋 Capacitor challenge", prompt: "Build the capacitor, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Capacitance grows with plate area and the dielectric constant k, and falls as the gap grows: C = 0.885 × k × A ÷ d. Charge Q = C × V. Energy U = ½ C V². Field E = V ÷ d." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("cp-sim", diff, uses, mk);
const near = (a, b) => Math.abs(a - b) < 0.6;
const C = {
  big: () => simQ(1, "Build the capacitor with the <b>largest</b> capacitance.", st({ A: 100, d: 5 }), s => ok(Cp(s) === r2(0.885 * 4 * 400 / 1), "Biggest plates, smallest gap, glass: 1416 pF.", `C = ${fmt(Cp(s))} pF — it can be bigger.`), { A: 400, d: 1, diel: "glass" }, { wrong: { A: 400, d: 2, diel: "glass" } }),
  halve: () => simQ(1, "This capacitor is 88.5 pF. <b>Halve</b> its capacitance by changing <b>only the gap</b>.", st({ A: 200, d: 2 }), s => ok(near(Cp(s), 44.25), "Doubling the gap to 4 mm halves C.", `C = ${fmt(Cp(s))} pF.`), { d: 4 }, { lock: ["A", "diel"], wrong: { d: 3 } }),
  x4: () => simQ(1, "Make the capacitance <b>4 times</b> bigger <b>without changing the plates or the gap</b>.", st({ A: 200, d: 2 }), s => ok(near(Cp(s), 354), "Glass (k = 4) multiplies C by 4.", `C = ${fmt(Cp(s))} pF.`), { diel: "glass" }, { lock: ["A", "d"], wrong: { diel: "plastic" } }),
  c354: () => simQ(1, "Build a capacitor of <b>354 pF</b>.", st({ A: 100, d: 4 }), s => ok(near(Cp(s), 354), "e.g. 400 cm², 1 mm, air — or 200 cm², 1 mm, plastic.", `C = ${fmt(Cp(s))} pF.`), { A: 400, d: 1, diel: "air" }, { wrong: { A: 400, d: 2, diel: "air" } }),
  q1062: () => simQ(2, "The capacitor is 88.5 pF. Store a charge of <b>1062 pC</b>.", st({ A: 100, d: 1, V: 3 }), s => ok(near(Q(s), 1062), "88.5 × 12 V = 1062 pC.", `Q = ${fmt(Q(s))} pC.`), { V: 12 }, { lock: ["A", "d", "diel"], wrong: { V: 11 } }),
  dblQ: () => simQ(2, "<b>Double</b> the stored charge by changing <b>only the battery</b>.", st({ V: 3 }), s => ok(near(Q(s), 2 * r1(88.5 * 3)), "6 V: Q = C × V doubles.", `Q = ${fmt(Q(s))} pC.`), { V: 6 }, { lock: ["A", "d", "diel"], wrong: { V: 9 } }),
  e2: () => simQ(2, "Make the electric field between the plates exactly <b>2 V/mm</b>.", st({ V: 3, d: 5 }), s => ok(Ef(s) === 2, `E = ${s.V} ÷ ${s.d} = 2 V/mm.`, `E = ${fmt(Ef(s))} V/mm.`), { V: 6, d: 3 }, { lock: ["A", "diel"], wrong: { V: 6, d: 4 } }),
  sameQ: () => simQ(2, "At 12 V and 2 mm this capacitor stores 531 pC. Now the battery is <b>6 V</b>: change the gap so it still stores <b>531 pC</b>.", st({ A: 100, d: 2, V: 6 }), s => ok(near(Q(s), 531), "Halving the gap doubles C, so half the voltage stores the same charge.", `Q = ${fmt(Q(s))} pC.`), { d: 1 }, { lock: ["A", "diel", "V"], wrong: { d: 2 } }),
  maxU: () => simQ(3, "Store the <b>most energy</b> possible.", st({ A: 200, d: 3, V: 6 }), s => ok(U(s) === r1(0.5 * 1416 * 144), "Biggest C and the highest voltage: ½ × 1416 × 12².", `U = ${fmt(U(s))} pJ — it can be more.`), { A: 400, d: 1, diel: "glass", V: 12 }, { wrong: { A: 400, d: 1, diel: "glass", V: 11 } }),
  x4U: () => simQ(3, "<b>Quadruple</b> the stored energy by changing <b>only the voltage</b>.", st({ V: 3 }), s => ok(near(U(s), 4 * r1(0.5 * 88.5 * 9)), "Double the voltage → 4 × the energy (U ∝ V²).", `U = ${fmt(U(s))} pJ.`), { V: 6 }, { lock: ["A", "d", "diel"], wrong: { V: 12 } }),
  u1593: () => simQ(3, "With the 88.5 pF capacitor, store exactly <b>1593 pJ</b>.", st({ A: 100, d: 1, V: 2 }), s => ok(near(U(s), 1593), "½ × 88.5 × 6² = 1593 pJ.", `U = ${fmt(U(s))} pJ.`), { V: 6 }, { lock: ["A", "d", "diel"], wrong: { V: 5 } }),
  glassU: () => simQ(3, "An air capacitor at 10 V stores 4425 pJ. Fill it with <b>glass</b> and choose the voltage to store the <b>same</b> energy.", st({ A: 100, d: 1, diel: "glass", V: 10 }), s => ok(near(U(s), r1(0.5 * 88.5 * 100)), "4 × C needs half the voltage: 5 V.", `U = ${fmt(U(s))} pJ.`), { V: 5 }, { lock: ["A", "d", "diel"], wrong: { V: 4 } })
};
const D = {
  pick: diff => E.diaT("cp-pick", diff, 2, () => {
    const pool = E.shuffle([st({ A: 400, d: 2 }), st({ A: 100, d: 1, diel: "glass" }), st({ A: 200, d: 4, diel: "plastic" }), st({ A: 200, d: 1 }), st({ A: 400, d: 5, diel: "glass" }), st({ A: 100, d: 2, diel: "plastic", V: 12 }), st({ A: 400, d: 4, V: 3 })]).slice(0, 4);
    const by = diff === 1 ? Cp : U, want = choice(["most", "least"]), vals = pool.map(by), best = want === "most" ? Math.max(...vals) : Math.min(...vals);
    return { kind: "pick", many: vals.filter(v => v === best).length > 1, title: diff === 1 ? "👆 Capacitance" : "👆 Stored energy", prompt: `Click the capacitor with the <b>${want}</b> ${diff === 1 ? "capacitance" : "stored energy"}.`, answer: pool.map((s, i) => by(s) === best ? "k" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["k" + i, `${s.A} cm², ${s.d} mm, ${DIEL[s.diel].name}${diff > 1 ? ", " + s.V + " V" : ""}`])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212, w = 40 + Math.sqrt(s.A) * 5, gp = 10 + s.d * 10; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${DIEL[s.diel].c !== "none" ? `<rect x="${x + 98 - w / 2}" y="${110 - gp / 2}" width="${w}" height="${gp}" fill="${DIEL[s.diel].c}"/>` : ""}<rect x="${x + 98 - w / 2}" y="${110 - gp / 2 - 8}" width="${w}" height="8" fill="#90a4ae"/><rect x="${x + 98 - w / 2}" y="${110 + gp / 2}" width="${w}" height="8" fill="#90a4ae"/>${T(x + 98, 206, s.A + " cm² · " + s.d + " mm", { s: 14, c: "#37474f" })}${T(x + 98, 230, DIEL[s.diel].name + (diff > 1 ? " · " + s.V + " V" : ""), { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
      explain: (diff === 1 ? "C = 0.885 × k × A ÷ d: " + pool.map(s => fmt(Cp(s)) + " pF").join(", ") : "U = ½CV²: " + pool.map(s => fmt(U(s)) + " pJ").join(", ")) + ".", summary: diff === 1 ? "Comparing capacitance" : "Comparing energy" };
  }),
  num: diff => E.diaT("cp-num", diff, 2, () => {
    if (diff === 1) { const s = choice([st({ A: 200, d: 1 }), st({ A: 400, d: 2, diel: "plastic" }), st({ A: 100, d: 2, diel: "glass" }), st({ A: 400, d: 5 })]);
      return { kind: "num", title: "🧮 Capacitance", prompt: `Plates <b>${s.A} cm²</b>, gap <b>${s.d} mm</b>, ${DIEL[s.diel].name.toLowerCase()} (k = ${DIEL[s.diel].k}). C = 0.885 × k × A ÷ d.`, visual: render(s), fields: [{ label: "C", unit: "pF", answer: Cp(s), tol: 0.5 }], explain: `0.885 × ${DIEL[s.diel].k} × ${s.A} ÷ ${s.d} = ${fmt(Cp(s))} pF.`, summary: "Parallel-plate capacitance" }; }
    if (diff === 2) { const c = choice([[100, 12], [250, 6], [400, 9], [50, 10]]);
      return { kind: "num", title: "🧮 Charge and field", prompt: `A <b>${c[0]} pF</b> capacitor is connected to <b>${c[1]} V</b>. The gap is <b>3 mm</b>.`, visual: render(st({ V: c[1], d: 3 })), fields: [{ label: "Charge Q", unit: "pC", answer: c[0] * c[1] }, { label: "Field E", unit: "V/mm", answer: r2(c[1] / 3) }], explain: `Q = ${c[0]} × ${c[1]} = ${c[0] * c[1]} pC; E = ${c[1]} ÷ 3 = ${fmt(r2(c[1] / 3))} V/mm.`, summary: "Q = CV, E = V/d" }; }
    const c = choice([[100, 10], [200, 6], [50, 12], [400, 5]]);
    return { kind: "num", title: "🧮 Stored energy", prompt: `A <b>${c[0]} pF</b> capacitor is charged to <b>${c[1]} V</b>. U = ½CV².`, visual: render(st({ V: c[1] })), fields: [{ label: "Energy", unit: "pJ", answer: 0.5 * c[0] * c[1] * c[1] }], explain: `½ × ${c[0]} × ${c[1]}² = ${0.5 * c[0] * c[1] * c[1]} pJ.`, summary: "Capacitor energy" };
  }),
  mcq: diff => E.diaT("cp-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does putting glass between the plates increase the capacitance?", ok: "The glass becomes polarised and weakens the field, so more charge can be stored at the same voltage", bad: ["Glass conducts electricity", "Glass adds extra electrons", "Glass makes the plates bigger"], ex: "A dielectric reduces the field, letting more charge build up." },
      { ask: "What is stored in a charged capacitor?", ok: "Energy, in the electric field between the plates", bad: ["Current", "Extra electrons that were created", "Magnetic poles"], ex: "U = ½CV², stored in the field." },
      { ask: "A camera flash uses a capacitor because…", ok: "it can release its stored energy very quickly", bad: ["it stores more energy than a battery", "it makes light by itself", "it never runs out"], ex: "Capacitors discharge in a fraction of a second." },
      { ask: "If you double the voltage across a capacitor, the stored energy…", ok: "becomes 4 times bigger", bad: ["doubles", "halves", "stays the same"], ex: "U ∝ V²." }]);
    return { kind: "mcq", title: "📘 Capacitor ideas", prompt: "Think about plates, charge and energy.", visual: render(st({ diel: "glass", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Capacitors" }; })
};
const LEVELS = {
  1: { intro: "A capacitor is two plates with a gap. Bigger plates, a smaller gap or a dielectric give more capacitance.", pool: () => [S(1, 1, C.halve), S(2, 1, C.x4), S(2, 1, C.big), S(3, 1, C.c354), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Connect a battery: the capacitor stores charge Q = C × V, and there is a field E = V ÷ d between the plates.", pool: () => [S(1, 1, C.dblQ), S(2, 1, C.q1062), S(2, 1, C.e2), S(3, 1, C.sameQ), D.num(2), D.pick(1), D.mcq(3)] },
  3: { intro: "A charged capacitor stores energy U = ½CV².", pool: () => [S(1, 1, C.x4U), S(2, 1, C.u1593), S(3, 1, C.maxU), S(3, 1, C.glassU), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Change the plates, the gap, the material and the battery. Press ▶ to charge the capacitor.",
  state: () => st(), controls: () => ctls(3), render, run, runLabel: "▶ Charge",
  goals: () => [{ txt: "Make C bigger than 300 pF", test: (s, m) => m.c }, { txt: "Use a dielectric", test: (s, m) => m.d }, { txt: "Store more than 10 000 pJ", test: (s, m) => m.u }],
  track: (s, m, ran) => { if (!ran) return; if (Cp(s) > 300) m.c = 1; if (s.diel !== "air") m.d = 1; if (U(s) > 10000) m.u = 1; },
  facts: () => "📘 <b>Capacitors</b> store charge and energy — in phones, camera flashes and defibrillators."
});
E.start({ labId: "capacitor", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔋", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔋", "⚡", "➕", "✨"],
  exploreDemo: () => [{ set: { A: 400, d: 1, diel: "glass", V: 12 }, run: true }] });
})();
