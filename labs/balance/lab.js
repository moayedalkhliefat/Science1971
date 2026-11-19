"use strict";
// ===== Balancing Chemical Equations — Science Lab 1971 =====
(function () {
const E = LabEngine, choice = E.choice, T = E.svgText;
const SUBD = "₀₁₂₃₄₅₆₇₈₉";
const sub = f => f.replace(/\d/g, d => SUBD[+d]);
function parse(f) { // "Ca(OH)2" -> {Ca:1,O:2,H:2}
  const st = [{}]; const re = /([A-Z][a-z]?)(\d*)|(\()|\)(\d*)/g; let m;
  while ((m = re.exec(f))) {
    if (m[1]) { const o = st[st.length - 1]; o[m[1]] = (o[m[1]] || 0) + (+m[2] || 1); }
    else if (m[3]) st.push({});
    else { const g = st.pop(), k = +m[4] || 1, o = st[st.length - 1]; for (const e in g) o[e] = (o[e] || 0) + g[e] * k; }
  }
  return st[0];
}
const COL = { H: ["#fafafa", "#90a4ae"], O: ["#e53935", "#b71c1c"], N: ["#1e88e5", "#0d47a1"], C: ["#424242", "#111"], Cl: ["#43a047", "#1b5e20"], Na: ["#8e24aa", "#4a148c"], Mg: ["#9ccc65", "#558b2f"], Fe: ["#d84315", "#8d2a0b"], Al: ["#b0a7b8", "#6d6575"], Zn: ["#78909c", "#37474f"], K: ["#7e57c2", "#4527a0"], Ca: ["#26a69a", "#00695c"], S: ["#fdd835", "#c6a700"] };
const RAD = e => e === "H" ? 8 : ["Fe", "Al", "Zn", "K", "Ca", "Na", "Mg", "Cl", "S"].includes(e) ? 12 : 10;
const atomsOf = f => { const a = parse(f), out = []; Object.keys(a).forEach(e => { for (let i = 0; i < a[e]; i++) out.push(e); }); out.sort((x, y) => (x === "H") - (y === "H")); return out; };
function molecule(f, x, y) { // centred at x,y
  const at = atomsOf(f), n = at.length, per = n <= 3 ? n : Math.ceil(n / 2), rows = n <= 3 ? 1 : 2;
  let g = "";
  at.forEach((e, i) => { const row = Math.floor(i / per), col = i % per, cnt = row === 0 ? Math.min(per, n) : n - per;
    const ax = x + (col - (cnt - 1) / 2) * 15, ay = y + (rows === 2 ? (row ? 9 : -9) : 0);
    g += `<circle cx="${ax}" cy="${ay}" r="${RAD(e)}" fill="${COL[e][0]}" stroke="${COL[e][1]}" stroke-width="1.6"/>`; });
  return g;
}
const molW = f => { const n = atomsOf(f).length, per = n <= 3 ? n : Math.ceil(n / 2); return (per - 1) * 15 + 26; };
function area(f, c, x, y, w, h) { // draw c molecules of f inside a box
  if (!c) return T(x + w / 2, y + h / 2 + 5, "—", { s: 18, c: "#b0a7c8" });
  const cw = molW(f) + 10, ch = 40; let cols = Math.max(1, Math.min(c, Math.ceil(Math.sqrt(c * 1.6)))), rows = Math.ceil(c / cols);
  const sc = Math.min(2, w / (cols * cw), h / (rows * ch)); let g = "";
  for (let i = 0; i < c; i++) { const r = Math.floor(i / cols), k = i % cols, inRow = r === rows - 1 ? c - r * cols : cols;
    g += molecule(f, (k - (inRow - 1) / 2) * cw, (r - (rows - 1) / 2) * ch); }
  return `<g transform="translate(${x + w / 2},${y + h / 2}) scale(${sc.toFixed(3)})">${g}</g>`;
}
const EQ = {
  1: [["H2", "O2", ">", "H2O"], ["N2", "H2", ">", "NH3"], ["Na", "Cl2", ">", "NaCl"], ["Mg", "O2", ">", "MgO"], ["H2", "Cl2", ">", "HCl"], ["K", "O2", ">", "K2O"], ["Zn", "O2", ">", "ZnO"]],
  2: [["CH4", "O2", ">", "CO2", "H2O"], ["Al", "O2", ">", "Al2O3"], ["Fe", "O2", ">", "Fe2O3"], ["Zn", "HCl", ">", "ZnCl2", "H2"], ["N2", "O2", ">", "NO2"], ["KClO3", ">", "KCl", "O2"], ["Mg", "HCl", ">", "MgCl2", "H2"]],
  3: [["C3H8", "O2", ">", "CO2", "H2O"], ["Fe2O3", "C", ">", "Fe", "CO2"], ["C2H6", "O2", ">", "CO2", "H2O"], ["Al", "HCl", ">", "AlCl3", "H2"], ["Ca(OH)2", "HCl", ">", "CaCl2", "H2O"], ["NH3", "O2", ">", "NO", "H2O"], ["C2H4", "O2", ">", "CO2", "H2O"]]
};
const split = eq => { const i = eq.indexOf(">"); return { L: eq.slice(0, i), R: eq.slice(i + 1), all: eq.filter(x => x !== ">") }; };
function counts(eq, cs) { const { L, R } = split(eq), l = {}, r = {}, order = [];
  const add = (o, f, c) => { const a = parse(f); for (const e in a) { if (!order.includes(e)) order.push(e); o[e] = (o[e] || 0) + a[e] * c; } };
  L.forEach((f, i) => add(l, f, cs[i])); R.forEach((f, i) => add(r, f, cs[L.length + i])); return { l, r, order }; }
const coefs = s => s.eq.filter(x => x !== ">").map((_, i) => s["c" + i]);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const isBal = s => { const cs = coefs(s); if (cs.some(c => !c)) return false; const k = counts(s.eq, cs); return k.order.every(e => (k.l[e] || 0) === (k.r[e] || 0)); };
const lowest = s => coefs(s).reduce(gcd) === 1;
function solveEq(eq) { const n = eq.filter(x => x !== ">").length; const cs = new Array(n).fill(1);
  const rec = i => { if (i === n) { const k = counts(eq, cs); return k.order.every(e => k.l[e] === k.r[e]); } for (let c = 1; c <= 10; c++) { cs[i] = c; if (rec(i + 1)) return true; } return false; };
  rec(0); return cs.slice(); }
const eqText = (s, hide) => { const { L, R } = split(s.eq); let i = 0; const part = arr => arr.map(f => { const c = s["c" + i++]; return `${hide ? "" : c === 0 ? "<tspan fill='#c62828'>0</tspan> " : c === 1 ? "" : c + " "}${sub(f)}`; }).join("  +  "); return part(L) + "   ⟶   " + part(R); };
function render(s) {
  const { L, R, all } = split(s.eq), cs = coefs(s), k = counts(s.eq, cs), showC = s.lv < 3 || s.reveal || s.showVals, bal = isBal(s);
  const zone = (arr, x0, w, off) => arr.map((f, i) => { const aw = w / arr.length, x = x0 + i * aw; return `<rect x="${x + 6}" y="74" width="${aw - 12}" height="200" rx="12" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${area(f, cs[off + i], x + 10, 84, aw - 20, 166)}${T(x + aw / 2, 266, cs[off + i] + " × " + sub(f), { s: 14, c: "#4527a0" })}${i < arr.length - 1 ? T(x + aw, 180, "+", { s: 26, c: "#7e57c2" }) : ""}`; }).join("");
  let panel = "";
  if (showC) { const n = k.order.length, w = Math.min(150, 720 / n);
    panel = k.order.map((e, i) => { const x = 400 - (n * w) / 2 + i * w + w / 2, a = k.l[e] || 0, b = k.r[e] || 0, eq = a === b && a > 0, tilt = a === b ? 0 : a > b ? -8 : 8;
      return `<g transform="translate(${x},372)"><g transform="rotate(${tilt})"><line x1="-50" x2="50" y1="0" y2="0" stroke="${eq ? "#2e7d32" : "#c62828"}" stroke-width="4"/>
        <rect x="-62" y="-30" width="34" height="28" rx="6" fill="#ede7f6"/>${T(-45, -10, a, { s: 16, c: "#311b92" })}<rect x="28" y="-30" width="34" height="28" rx="6" fill="#ede7f6"/>${T(45, -10, b, { s: 16, c: "#311b92" })}</g>
        <polygon points="0,2 -12,36 12,36" fill="#9575cd"/><circle cx="0" cy="-50" r="${RAD(e) + 5}" fill="${COL[e][0]}" stroke="${COL[e][1]}" stroke-width="2"/>${T(0, -45, e, { s: 13, c: ["H", "S", "Mg", "Al"].includes(e) ? "#263238" : "#fff" })}${T(0, 58, e + (eq ? " ✓" : ""), { s: 15, c: eq ? "#2e7d32" : "#c62828" })}</g>`; }).join("");
  } else panel = T(400, 380, "Atom counter hidden in Level 3 — count the atoms in the pictures!", { s: 15, c: "#7e7aa8" });
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f6f5ff"/>
    <rect x="20" y="14" width="760" height="46" rx="12" fill="${showC && bal ? "#e8f5e9" : "#fff"}" stroke="${showC && bal ? "#43a047" : "#d1c4e9"}" stroke-width="2"/>${T(400, 45, eqText(s), { s: 21, c: "#1a1446" })}
    ${zone(L, 20, 350, 0)}${T(400, 180, "⟶", { s: 34, c: "#4527a0" })}${zone(R, 430, 350, L.length)}
    ${T(205, 296, "REACTANTS", { s: 12, c: "#7e7aa8" })}${T(605, 296, "PRODUCTS", { s: 12, c: "#7e7aa8" })}
    ${panel}</svg>`;
}
const ctls = (eq, lock) => eq.filter(x => x !== ">").map((f, i) => ({ id: "c" + i, type: "step", label: sub(f), min: 0, max: 10, lock: lock && lock[i] != null ? () => true : null }));
const st = (lv, eq, lock) => { const o = { lv, eq }; eq.filter(x => x !== ">").forEach((_, i) => o["c" + i] = lock && lock[i] != null ? lock[i] : 0); return o; };
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const why = s => { const k = counts(s.eq, coefs(s)); if (coefs(s).some(c => !c)) return "Every substance needs at least one molecule (no zeros)."; const bad = k.order.filter(e => (k.l[e] || 0) !== (k.r[e] || 0)); return bad.length ? "Not balanced: " + bad.map(e => `${e} ${k.l[e] || 0} ≠ ${k.r[e] || 0}`).join(", ") + "." : "Balanced, but not with the smallest whole numbers — divide all the numbers."; };
const simQ = (goal, s0, check, sol, lock) => { const ctl = ctls(s0.eq, lock), solO = {}, wrong = {}; sol.forEach((c, i) => { solO["c" + i] = c; }); const wi = sol.findIndex((_, i) => !lock || lock[i] == null); Object.assign(wrong, solO, { ["c" + wi]: sol[wi] + 1 });
  return { title: "⚖️ Balance the equation", prompt: "Use the − / + buttons to set the number of molecules (coefficients). Then press <b>▶ Run & check</b>.", goal,
    sim: { state: s0, controls: ctl, render, run, check, hint: "Atoms are never created or destroyed: each element must have the same number of atoms on both sides. Change only the big numbers in front, never the small subscripts." },
    solution: solO, wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) }; };
const S = (diff, uses, mk) => E.simT("bal-sim", diff, uses, mk);
const C = {
  bal: lv => () => { const eq = choice(EQ[lv]), sol = solveEq(eq);
    return simQ(`Balance: <b>${split(eq).L.map(sub).join(" + ")} → ${split(eq).R.map(sub).join(" + ")}</b> using the <b>smallest whole numbers</b>.`, st(lv, eq), s => ok(isBal(s) && lowest(s), "Balanced: " + eqText(s).replace(/<[^>]+>/g, ""), why(s)), sol); },
  scaled: lv => () => { const eq = choice(EQ[lv]), sol = solveEq(eq), n = sol.length, j = n - 1, f = choice([2, 3]); if (sol.some(c => c * f > 10)) return C.bal(lv)();
    const lock = {}; lock[j] = sol[j] * f; const all = eq.filter(x => x !== ">");
    return simQ(`You need exactly <b>${sol[j] * f} molecules of ${sub(all[j])}</b>. Balance the equation for that amount.`, st(lv, eq, lock), s => ok(isBal(s), "Balanced for " + sol[j] * f + " " + sub(all[j]) + ": " + eqText(s).replace(/<[^>]+>/g, ""), why(s)), sol.map(c => c * f), lock); },
  given: lv => () => { const eq = choice(EQ[lv]), sol = solveEq(eq), lock = { 0: sol[0] * 2 }; if (sol.some(c => c * 2 > 10)) return C.bal(lv)(); const all = eq.filter(x => x !== ">");
    return simQ(`You start with <b>${sol[0] * 2} ${sub(all[0])}</b>. Balance the equation so that all of it reacts.`, st(lv, eq, lock), s => ok(isBal(s), eqText(s).replace(/<[^>]+>/g, "") + " is balanced.", why(s)), sol.map(c => c * 2), lock); }
};

// ---------- diagram tasks ----------
const D = {
  count: diff => E.diaT("bal-num", diff, 2, () => { const c = choice([["H2O", 3], ["Ca(OH)2", 2], ["NH3", 4], ["CO2", 5], ["CH4", 3], ["Al2O3", 2], ["C2H6", 2], ["Fe2O3", 3]]), a = parse(c[0]);
    const vis = `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#f6f5ff"/>${T(370, 60, c[1] + " " + sub(c[0]), { s: 46, c: "#1a1446" })}
      <rect x="120" y="90" width="500" height="170" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${area(c[0], c[1], 130, 100, 480, 150)}</svg>`;
    return { kind: "num", title: "🔢 Count the atoms", prompt: "Count the total number of atoms of each element.", visual: vis,
      fields: Object.keys(a).map(e => ({ label: e + " atoms", unit: "", answer: a[e] * c[1] })), explain: Object.keys(a).map(e => `${e}: ${c[1]} × ${a[e]} = ${c[1] * a[e]}`).join("; ") + ".", summary: "Count atoms in a formula" }; }),
  pick: diff => E.diaT("bal-pick", diff, 2, () => { const lv = diff >= 3 ? 3 : 2, eqs = E.pick(EQ[lv], 3); const good = choice([0, 1, 2]);
    const cards = eqs.map((eq, i) => { let cs = solveEq(eq); if (i !== good) { cs = cs.slice(); const j = (i + 1) % cs.length; cs[j] = cs[j] === 1 ? 2 : cs[j] - 1; } const s = { eq }; cs.forEach((c, k) => s["c" + k] = c); return eqText(s).replace(/<[^>]+>/g, ""); });
    return { kind: "pick", title: "👆 Which one is balanced?", prompt: "Click the <b>balanced</b> equation. Count every element on both sides.", answer: ["e" + good], names: { e0: "equation 1", e1: "equation 2", e2: "equation 3" },
      visual: st => `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="260" fill="#f6f5ff"/>${cards.map((t, i) => `<g class="pk" data-k="e${i}"><rect x="30" y="${14 + i * 80}" width="680" height="66" rx="12" fill="#fff" ${E.ring(st["e" + i])}/>${T(60, 54 + i * 80, (i + 1) + ")", { a: "start", s: 18, c: "#7e7aa8" })}${T(390, 55 + i * 80, t, { s: 21, c: "#1a1446" })}</g>`).join("")}</svg>`,
      explain: "Balanced: " + cards[good] + ". In the others at least one element has a different number of atoms on each side.", summary: "Identify the balanced equation" }; }),
  missing: diff => E.diaT("bal-num", diff, 3, () => { const lv = diff >= 3 ? 3 : 2, eq = choice(EQ[lv]), sol = solveEq(eq), j = choice(sol.map((_, i) => i).filter(i => sol[i] > 1)); const s = { eq, lv: 1 }; sol.forEach((c, k) => s["c" + k] = c);
    let i = 0; const { L, R } = split(eq); const part = arr => arr.map(f => { const k = i++; return `${k === j ? "<tspan fill='#c62828'>?</tspan> " : sol[k] === 1 ? "" : sol[k] + " "}${sub(f)}`; }).join("  +  ");
    const vis = `<svg viewBox="0 0 740 160" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="160" fill="#f6f5ff"/><rect x="20" y="40" width="700" height="80" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(370, 92, part(L) + "   ⟶   " + part(R), { s: 26, c: "#1a1446" })}</svg>`;
    return { kind: "num", title: "❓ Missing coefficient", prompt: "All the other numbers are correct. Find the missing coefficient so the equation is balanced.", visual: vis,
      fields: [{ label: "Missing number", unit: "", answer: sol[j] }], explain: "Balanced: " + eqText(s).replace(/<[^>]+>/g, "") + ".", summary: "Find a missing coefficient" }; }),
  mass: diff => E.diaT("bal-num", diff, 2, () => { const c = choice([{ eq: "2 H₂ + O₂ → 2 H₂O", a: ["H₂", 4], b: ["O₂", 32], p: "H₂O", m: 36 }, { eq: "2 Mg + O₂ → 2 MgO", a: ["Mg", 48], b: ["O₂", 32], p: "MgO", m: 80 }, { eq: "C + O₂ → CO₂", a: ["C", 12], b: ["O₂", 32], p: "CO₂", m: 44 }, { eq: "N₂ + 3 H₂ → 2 NH₃", a: ["N₂", 28], b: ["H₂", 6], p: "NH₃", m: 34 }]);
    const pan = (x, txt, w) => `<rect x="${x - 90}" y="150" width="180" height="16" rx="6" fill="#9575cd"/><rect x="${x - 70}" y="${150 - w}" width="140" height="${w}" rx="10" fill="#ede7f6" stroke="#9575cd" stroke-width="2"/>${T(x, 150 - w / 2 + 6, txt, { s: 16, c: "#311b92" })}<rect x="${x - 50}" y="166" width="100" height="40" rx="8" fill="#1d1b4b"/>${T(x, 192, "? g", { s: 18, c: "#7dffb3" })}`;
    const vis = `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="260" fill="#f6f5ff"/>${T(370, 34, c.eq, { s: 22, c: "#1a1446" })}
      ${pan(190, `${c.a[1]} g ${c.a[0]} + ${c.b[1]} g ${c.b[0]}`, 70).replace("? g", (c.a[1] + c.b[1]) + " g")}${T(370, 130, "⟶ sealed flask ⟶", { s: 15, c: "#7e7aa8" })}${pan(550, c.p + " only", 70)}${T(370, 240, "BEFORE the reaction                                  AFTER the reaction", { s: 13, c: "#7e7aa8" })}</svg>`;
    return { kind: "num", title: "⚖️ Conservation of mass", prompt: `${c.a[1]} g of ${c.a[0]} reacts completely with ${c.b[1]} g of ${c.b[0]} in a sealed flask.`, visual: vis,
      fields: [{ label: "Mass of " + c.p + " made", unit: "g", answer: c.m }], explain: `Atoms are only rearranged, so mass is conserved: ${c.a[1]} + ${c.b[1]} = ${c.m} g.`, summary: "Conservation of mass" }; }),
  meaning: diff => E.diaT("bal-mcq", diff, 1, () => { const q = choice([
      { ask: "In <b>3 H₂O</b>, what does the big <b>3</b> mean?", ok: "There are 3 water molecules", bad: ["There are 3 oxygen atoms in one molecule", "Water has 3 hydrogen atoms", "The water is 3 times heavier"], ex: "The coefficient counts molecules; the small subscript counts atoms inside one molecule." },
      { ask: "Why may you NOT change H₂O into H₂O₂ to balance oxygen?", ok: "It would change the substance into a different compound", bad: ["Subscripts can only be even numbers", "Oxygen cannot have a subscript", "It would make the equation too long"], ex: "Subscripts are fixed by the formula of the substance. H₂O₂ is hydrogen peroxide, not water. Only coefficients may change." },
      { ask: "Why must a chemical equation be balanced?", ok: "Atoms are not created or destroyed in a reaction", bad: ["To make the equation look neat", "Because reactants and products are the same substances", "Because molecules cannot break apart"], ex: "Law of conservation of mass: atoms are only rearranged, so the number of each atom is the same before and after." }]);
    const s = st(1, ["H2", "O2", ">", "H2O"]); s.c0 = 2; s.c1 = 1; s.c2 = 2;
    return { kind: "mcq", title: "📘 What the numbers mean", prompt: "Look at the balanced equation and the molecules.", visual: render(s), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Coefficients vs subscripts" }; })
};
const LEVELS = {
  1: { intro: "Simple equations with two reactants and one product. The atom counter shows each element.", pool: () => [S(1, 2, C.bal(1)), S(2, 2, C.bal(1)), S(3, 1, C.scaled(1)), S(3, 1, C.given(1)), D.meaning(1), D.count(2), D.pick(2), D.mass(3)] },
  2: { intro: "Bigger equations, including the burning of methane (combustion).", pool: () => [S(1, 2, C.bal(2)), S(2, 2, C.bal(2)), S(3, 1, C.scaled(2)), S(3, 1, C.given(2)), D.count(1), D.pick(2), D.missing(2), D.mass(3)] },
  3: { intro: "Expert equations — the atom counter is hidden. Count the atoms in the pictures yourself!", pool: () => [S(1, 2, C.bal(3)), S(2, 2, C.bal(3)), S(3, 1, C.scaled(3)), S(3, 1, C.given(3)), D.count(1), D.missing(2), D.pick(3), D.missing(3)] }
};
const EXQ = { 1: ["H2", "O2", ">", "H2O"], 2: ["CH4", "O2", ">", "CO2", "H2O"], 3: ["C2H4", "O2", ">", "CO2", "H2O"] };
const explore = E.exploreSim({
  intro: "Add molecules with the + buttons. Watch the atom counter (the balance scales): each element must be equal on both sides.",
  state: lv => Object.assign(st(lv, EXQ[lv]), { showVals: true }), controls: lv => ctls(EXQ[lv]), render,
  goals: lv => [
    { txt: "Put at least one molecule of every substance", test: s => coefs(s).every(c => c > 0) },
    { txt: "Make the " + (lv === 1 ? "hydrogen (H)" : "oxygen (O)") + " atoms equal on both sides", test: (s, m) => m.one },
    { txt: "Balance the whole equation", test: (s, m) => m.bal },
    { txt: "Find a second, bigger balanced answer (e.g. double it)", test: (s, m) => m.dbl }
  ],
  track: (s, m) => { const k = counts(s.eq, coefs(s)), e = s.lv === 1 ? "H" : "O"; if (coefs(s).every(c => c > 0) && k.l[e] === k.r[e]) m.one = 1; if (isBal(s)) { m.bal = 1; if (!lowest(s)) m.dbl = 1; } },
  facts: () => "📘 <b>Coefficients</b> (big numbers) count molecules — you may change them. <b>Subscripts</b> (small numbers) are part of the formula — never change them. A balanced equation has the same number of each atom on both sides."
});
E.start({ labId: "balance", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚖️", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["⚖️", "⚛️", "⭐", "✨"],
  exploreDemo: lv => { const sol = solveEq(EXQ[lv]); const set1 = {}, set2 = {}; sol.forEach((c, i) => { set1["c" + i] = c; set2["c" + i] = c * 2; }); return [{ set: set1 }, { set: set2 }]; } });
})();
