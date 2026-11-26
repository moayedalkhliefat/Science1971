"use strict";
// ===== Reactants, Products & Leftovers — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const RX = {
  sand: { name: "Cheese sandwich", a: ["bread", 2, "Bread"], b: ["cheese", 1, "Cheese"], p: [["sand", 1, "Sandwich"]] },
  water: { name: "Making water", a: ["H2", 2, "H₂"], b: ["O2", 1, "O₂"], p: [["H2O", 2, "H₂O"]] },
  ammonia: { name: "Making ammonia", a: ["N2", 1, "N₂"], b: ["H2", 3, "H₂"], p: [["NH3", 2, "NH₃"]] },
  methane: { name: "Burning methane", a: ["CH4", 1, "CH₄"], b: ["O2", 2, "O₂"], p: [["CO2", 1, "CO₂"], ["H2O", 2, "H₂O"]] }
};
const R = s => RX[s.rxn];
const times = s => Math.min(Math.floor(s.a / R(s).a[1]), Math.floor(s.b / R(s).b[1]));
const leftA = s => s.a - times(s) * R(s).a[1], leftB = s => s.b - times(s) * R(s).b[1];
const prods = s => R(s).p.map(p => [p[0], p[1] * times(s), p[2] === "Sandwich" && p[1] * times(s) !== 1 ? "Sandwiches" : p[2]]);
const totalProd = s => prods(s).reduce((t, p) => t + p[1], 0);
const noLeft = s => leftA(s) === 0 && leftB(s) === 0;
const limiting = s => times(s) === 0 && s.a === 0 && s.b === 0 ? "—" : noLeft(s) ? "none (exact amounts)" : leftA(s) === 0 && (s.a > 0 || s.b === 0) ? R(s).a[2] : leftB(s) === 0 ? R(s).b[2] : "—";
const eqn = s => `${R(s).a[1]} ${R(s).a[2]} + ${R(s).b[1]} ${R(s).b[2]} → ${R(s).p.map(p => (p[1] > 1 ? p[1] + " " : "") + p[2]).join(" + ")}`.replace(/^1 /, "").replace(/\+ 1 /g, "+ ");
const atom = (x, y, r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="#37474f" stroke-width="1.2"/>`;
function icon(k, x, y) {
  switch (k) {
    case "bread": return `<rect x="${x - 16}" y="${y - 12}" width="32" height="24" rx="8" fill="#e0b070" stroke="#8d6e63" stroke-width="1.5"/><rect x="${x - 12}" y="${y - 8}" width="24" height="16" rx="5" fill="#fff3e0"/>`;
    case "cheese": return `<path d="M${x - 16},${y + 10} L${x + 16},${y + 10} L${x + 16},${y - 10}Z" fill="#ffd54f" stroke="#f9a825" stroke-width="1.5"/><circle cx="${x + 9}" cy="${y + 3}" r="2.5" fill="#f9a825"/>`;
    case "sand": return `<rect x="${x - 18}" y="${y - 12}" width="36" height="8" rx="4" fill="#e0b070" stroke="#8d6e63"/><rect x="${x - 17}" y="${y - 4}" width="34" height="6" fill="#ffd54f"/><rect x="${x - 18}" y="${y + 2}" width="36" height="8" rx="4" fill="#e0b070" stroke="#8d6e63"/>`;
    case "H2": return atom(x - 6, y, 8, "#fff") + atom(x + 6, y, 8, "#fff");
    case "O2": return atom(x - 8, y, 11, "#e53935") + atom(x + 8, y, 11, "#e53935");
    case "N2": return atom(x - 8, y, 11, "#1e88e5") + atom(x + 8, y, 11, "#1e88e5");
    case "H2O": return atom(x - 11, y + 7, 7, "#fff") + atom(x + 11, y + 7, 7, "#fff") + atom(x, y - 2, 11, "#e53935");
    case "NH3": return atom(x - 12, y + 8, 7, "#fff") + atom(x + 12, y + 8, 7, "#fff") + atom(x, y - 13, 7, "#fff") + atom(x, y, 11, "#1e88e5");
    case "CH4": return atom(x - 12, y - 10, 6, "#fff") + atom(x + 12, y - 10, 6, "#fff") + atom(x - 12, y + 10, 6, "#fff") + atom(x + 12, y + 10, 6, "#fff") + atom(x, y, 11, "#424242");
    case "CO2": return atom(x - 15, y, 9, "#e53935") + atom(x + 15, y, 9, "#e53935") + atom(x, y, 11, "#424242");
  }
  return "";
}
function pile(list, x0, y0, cols, gap) { let g = "", i = 0; list.forEach(([k, n]) => { for (let j = 0; j < n; j++, i++) { const cx = x0 + (i % cols) * (gap || 46), cy = y0 + Math.floor(i / cols) * 34; g += icon(k, cx, cy); } }); return g; }
function render(s) {
  const show = s.reveal, r = R(s), n = times(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(300, 50, r.name + ":  " + eqn(s), { s: 15, c: "#37474f" })}`;
  g += `<rect x="36" y="70" width="236" height="340" rx="12" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>${T(154, 92, "BEFORE (reactants)", { s: 13, c: "#1565c0" })}`;
  g += `<rect x="328" y="70" width="236" height="340" rx="12" fill="#e8f5e9" stroke="#a5d6a7" stroke-width="2"/>${T(446, 92, "AFTER", { s: 13, c: "#2e7d32" })}<path d="M282,240 h30" stroke="#78909c" stroke-width="4"/><path d="M322,240 l-12,-8 v16Z" fill="#78909c"/>`;
  g += pile([[r.a[0], s.a]], 62, 122, 5) + pile([[r.b[0], s.b]], 62, 282, 5);
  g += T(154, 252, s.a + " " + r.a[2], { s: 13, c: "#37474f" }) + T(154, 404, s.b + " " + r.b[2], { s: 13, c: "#37474f" });
  if (show) {
    g += T(446, 116, "products", { s: 12, c: "#2e7d32" }) + pile(prods(s).map(p => [p[0], p[1]]), 362, 140, s.rxn === "methane" ? 4 : 5, s.rxn === "methane" ? 56 : 46);
    g += `<line x1="340" y1="300" x2="552" y2="300" stroke="#a5d6a7" stroke-dasharray="5 4"/>${T(446, 318, "leftovers", { s: 12, c: "#e65100" })}` + pile([[r.a[0], leftA(s)], [r.b[0], leftB(s)]], 354, 340, 5);
  } else g += T(446, 240, "press ▶ to react", { s: 14, c: "#90a4ae" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${show ? T(120, 70, "the recipe ran " + n + " time" + (n === 1 ? "" : "s"), { s: 13, c: "#546e7a" }) + T(120, 108, "products", { s: 12, c: "#78909c" }) + prods(s).map((p, i) => T(120, 134 + i * 26, p[1] + " " + p[2], { s: 18, c: "#2e7d32" })).join("")
      + T(120, 200, "leftovers", { s: 12, c: "#78909c" }) + T(120, 226, leftA(s) + " " + r.a[2] + " · " + leftB(s) + " " + r.b[2], { s: 16, c: noLeft(s) ? "#2e7d32" : "#e65100" }) + T(120, 266, "limiting:", { s: 12, c: "#78909c" }) + T(120, 290, limiting(s), { s: 14, c: "#37474f" }) : T(120, 200, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 360, "the reactant that runs out first", { s: 10, c: "#90a4ae" })}${T(120, 376, "limits how much you can make", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "rxn", type: "select", label: "Reaction", options: Object.keys(RX).map(v => ({ v, label: RX[v].name })), lock: lk("rxn") },
  { id: "a", type: "range", label: "First reactant", min: 0, max: 12, step: 1, nudge: 1, unit: "", lock: lk("a") },
  { id: "b", type: "range", label: "Second reactant", min: 0, max: 12, step: 1, nudge: 1, unit: "", lock: lk("b") }]; };
const st = o => Object.assign({ rxn: "sand", a: 4, b: 4 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `Made ${prods(s).map(p => p[1] + " " + p[2]).join(" + ")}; leftovers ${leftA(s)} ${R(s).a[2]}, ${leftB(s)} ${R(s).b[2]}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.rxn === "sand" ? "🥪 Recipe challenge" : "⚗️ Reaction challenge", prompt: "Choose the amounts, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Use the coefficients like a recipe. Divide each reactant by its coefficient — the smaller answer is how many times the reaction can run. The one that runs out is the limiting reactant." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("lf-sim", diff, uses, mk);
const C = {
  four: () => simQ(1, "Make <b>4 sandwiches</b> with <b>nothing left over</b>.", st({ a: 3, b: 7 }), s => ok(times(s) === 4 && noLeft(s), "8 bread + 4 cheese → 4 sandwiches, no leftovers.", said(s)), { a: 8, b: 4 }, { lock: ["rxn"], wrong: { a: 8, b: 5 } }),
  cheese3: () => simQ(1, "You have <b>10 bread</b>. Add cheese so that the <b>cheese runs out</b> after exactly <b>3 sandwiches</b>.", st({ a: 10, b: 6 }), s => ok(times(s) === 3 && leftB(s) === 0 && leftA(s) > 0, "3 cheese → 3 sandwiches; 4 bread left over.", said(s)), { b: 3 }, { lock: ["rxn", "a"], wrong: { b: 5 } }),
  bread12: () => simQ(1, "You have <b>6 cheese</b>. Use the <b>least</b> bread to make the <b>most</b> sandwiches.", st({ a: 4, b: 6 }), s => ok(times(s) === 6 && leftA(s) === 0, "12 bread + 6 cheese → 6 sandwiches.", said(s)), { a: 12 }, { lock: ["rxn", "b"], wrong: { a: 11 } }),
  left2: () => simQ(1, "Make <b>5 sandwiches</b> and have exactly <b>2 bread</b> and <b>0 cheese</b> left over.", st({ a: 6, b: 6 }), s => ok(times(s) === 5 && leftA(s) === 2 && leftB(s) === 0, "12 bread + 5 cheese.", said(s)), { a: 12, b: 5 }, { lock: ["rxn"], wrong: { a: 11, b: 5 } }),
  water6: () => simQ(2, "Make <b>6 H₂O</b> molecules with <b>no leftovers</b>.", st({ rxn: "water", a: 2, b: 2 }), s => ok(prods(s)[0][1] === 6 && noLeft(s), "6 H₂ + 3 O₂ → 6 H₂O.", said(s)), { a: 6, b: 3 }, { lock: ["rxn"], wrong: { a: 6, b: 4 } }),
  waterO: () => simQ(2, "You have <b>8 H₂</b>. Add <b>just enough O₂</b> to use up all the hydrogen.", st({ rxn: "water", a: 8, b: 1 }), s => ok(leftA(s) === 0 && leftB(s) === 0, "8 H₂ needs 4 O₂.", said(s)), { b: 4 }, { lock: ["rxn", "a"], wrong: { b: 5 } }),
  nh3a: () => simQ(2, "You have <b>3 N₂</b>. Add the H₂ needed to use up all the nitrogen, with nothing left over.", st({ rxn: "ammonia", a: 3, b: 3 }), s => ok(noLeft(s), "3 N₂ + 9 H₂ → 6 NH₃.", said(s)), { b: 9 }, { lock: ["rxn", "a"], wrong: { b: 8 } }),
  nh3b: () => simQ(2, "Make exactly <b>4 NH₃</b> and have <b>1 N₂</b> left over.", st({ rxn: "ammonia", a: 1, b: 1 }), s => ok(prods(s)[0][1] === 4 && leftA(s) === 1 && leftB(s) === 0, "3 N₂ + 6 H₂: H₂ runs out after 2 reactions.", said(s)), { a: 3, b: 6 }, { lock: ["rxn"], wrong: { a: 3, b: 7 } }),
  burn3: () => simQ(3, "Burn <b>3 CH₄</b> completely with <b>no oxygen</b> left over.", st({ rxn: "methane", a: 3, b: 2 }), s => ok(noLeft(s), "CH₄ + 2 O₂: 3 CH₄ needs 6 O₂.", said(s)), { b: 6 }, { lock: ["rxn", "a"], wrong: { b: 7 } }),
  o7: () => simQ(3, "You have <b>7 O₂</b>. Add CH₄ so that oxygen is the limiting reactant and exactly <b>1 CH₄</b> is left over.", st({ rxn: "methane", a: 1, b: 7 }), s => ok(leftA(s) === 1 && times(s) === 3, "4 CH₄: 3 burn (using 6 O₂), 1 CH₄ and 1 O₂ remain.", said(s)), { a: 4 }, { lock: ["rxn", "b"], wrong: { a: 3 } }),
  h2o8: () => simQ(3, "Burn methane to make exactly <b>8 H₂O</b> with <b>no leftovers</b>.", st({ rxn: "methane", a: 2, b: 2 }), s => ok(prods(s)[1][1] === 8 && noLeft(s), "4 CH₄ + 8 O₂ → 4 CO₂ + 8 H₂O.", said(s)), { a: 4, b: 8 }, { lock: ["rxn"], wrong: { a: 4, b: 9 } }),
  ten: () => simQ(3, "Choose <b>any reaction</b> and amounts to make exactly <b>10 product molecules</b> with <b>no leftovers</b>.", st({ rxn: "ammonia", a: 2, b: 2 }), s => ok(s.rxn !== "sand" && totalProd(s) === 10 && noLeft(s), "e.g. 10 H₂ + 5 O₂ → 10 H₂O.", s.rxn === "sand" ? "Use a chemical reaction, not sandwiches." : `${totalProd(s)} product molecules; ${noLeft(s) ? "no" : "some"} leftovers.`), { rxn: "water", a: 10, b: 5 }, { wrong: { rxn: "water", a: 10, b: 6 } })
};
const D = {
  pick: diff => E.diaT("lf-pick", diff, 2, () => {
    const rx = diff === 1 ? "sand" : diff === 2 ? choice(["water", "ammonia"]) : "methane", r = RX[rx];
    const pool = E.shuffle([[2, 1], [4, 2], [3, 3], [6, 2], [2, 4], [6, 3], [4, 4], [1, 3], [3, 9], [2, 6], [3, 6]]).slice(0, 4).map(c => st({ rxn: rx, a: c[0], b: c[1] }));
    if (!pool.some(noLeft)) pool[Math.floor(Math.random() * 4)] = st({ rxn: rx, a: r.a[1] * 2, b: r.b[1] * 2 });
    return { kind: "pick", many: true, title: "👆 Perfect mixtures", prompt: `${r.name}: <b>${eqn(st({ rxn: rx }))}</b>. Click <b>every</b> mixture that leaves <b>nothing over</b>.`, answer: pool.map((s, i) => noLeft(s) ? "m" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["m" + i, s.a + " " + r.a[2] + " + " + s.b + " " + r.b[2]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="m${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>${pile([[r.a[0], s.a]], x + 30, 50, 4)}${pile([[r.b[0], s.b]], x + 30, 170, 4)}${T(x + 98, 274, s.a + " " + r.a[2] + " + " + s.b + " " + r.b[2], { s: 14, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["m" + i])}/></g>`; }).join("")}</svg>`,
      explain: `The amounts must be in the ratio ${r.a[1]} : ${r.b[1]}.`, summary: "Exact ratios" };
  }),
  num: diff => E.diaT("lf-num", diff, 2, () => {
    const rx = diff === 1 ? "sand" : diff === 2 ? choice(["water", "ammonia"]) : "methane", a = 1 + Math.floor(Math.random() * 10), b = 1 + Math.floor(Math.random() * 10), s = st({ rxn: rx, a, b }), r = RX[rx];
    return { kind: "num", title: "🧮 Limiting reactant", prompt: `${r.name}: ${eqn(s)}. You start with <b>${a} ${r.a[2]}</b> and <b>${b} ${r.b[2]}</b>.`, visual: render(s),
      fields: [{ label: `${r.p[r.p.length - 1][2]} made`, unit: "", answer: prods(s)[prods(s).length - 1][1] }, { label: `${r.a[2]} left over`, unit: "", answer: leftA(s) }, { label: `${r.b[2]} left over`, unit: "", answer: leftB(s) }],
      explain: `${a} ÷ ${r.a[1]} and ${b} ÷ ${r.b[1]} → the reaction runs ${times(s)} times. ${said(s)}`, summary: "Limiting reactant" };
  }),
  mcq: diff => E.diaT("lf-mcq", diff, 2, () => { const q = choice([
      { ask: "What is the limiting reactant?", ok: "The reactant that is used up first and stops the reaction", bad: ["The reactant with the smallest coefficient", "The reactant there is most of", "The product that forms first"], ex: "When it runs out, no more product can form." },
      { ask: "In 2 H₂ + O₂ → 2 H₂O, you mix 10 H₂ with 10 O₂. Which is limiting?", ok: "H₂", bad: ["O₂", "Neither", "H₂O"], ex: "10 H₂ only needs 5 O₂ — H₂ runs out first, 5 O₂ is left over." },
      { ask: "Why are atoms conserved in every reaction here?", ok: "Atoms are only rearranged — none are made or destroyed", bad: ["Because leftovers are removed", "Because products are lighter", "Because heat is released"], ex: "Count the atoms before and after: they match." },
      { ask: "Chemists often add an excess of one cheap reactant because…", ok: "it makes sure the expensive reactant is completely used up", bad: ["it makes the reaction slower", "it changes the products", "it removes leftovers"], ex: "The expensive one becomes the limiting reactant." }]);
    return { kind: "mcq", title: "📘 Reaction ideas", prompt: "Think about ratios and running out.", visual: render(st({ rxn: "water", a: 6, b: 5, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Limiting reactants" }; })
};
const LEVELS = {
  1: { intro: "A recipe tells you the ratio: 2 bread + 1 cheese → 1 sandwich. Whatever runs out first limits how many you make.", pool: () => [S(1, 1, C.four), S(2, 1, C.cheese3), S(2, 1, C.bread12), S(3, 1, C.left2), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Chemical equations are recipes too. Use the coefficients to find the limiting reactant.", pool: () => [S(1, 1, C.water6), S(2, 1, C.waterO), S(2, 1, C.nh3a), S(3, 1, C.nh3b), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Burning methane makes two products. Plan mixtures exactly.", pool: () => [S(1, 1, C.burn3), S(2, 1, C.o7), S(3, 1, C.h2o8), S(3, 1, C.ten), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Pick a recipe or a reaction, choose the amounts and press ▶ to see what you make — and what is left over.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ React",
  goals: () => [{ txt: "Make sandwiches with nothing left over", test: (s, m) => m.s }, { txt: "Have a leftover reactant", test: (s, m) => m.l }, { txt: "Run a real chemical reaction", test: (s, m) => m.c }],
  track: (s, m, ran) => { if (!ran) return; if (s.rxn === "sand" && times(s) > 0 && noLeft(s)) m.s = 1; if (!noLeft(s) && times(s) > 0) m.l = 1; if (s.rxn !== "sand" && times(s) > 0) m.c = 1; },
  facts: () => "📘 The <b>limiting reactant</b> runs out first. Anything else is left over — an <b>excess reactant</b>."
});
E.start({ labId: "leftovers", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🥪", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🥪", "⚗️", "💧", "✨"],
  exploreDemo: () => [{ set: { rxn: "sand", a: 8, b: 4 }, run: true }, { set: { rxn: "water", a: 6, b: 5 }, run: true }] });
})();
