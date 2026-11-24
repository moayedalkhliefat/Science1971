"use strict";
// ===== Periodic Table Trends — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
// symbol, name, group, period, radius (pm), type, reactivity with water (metals) or reactivity (halogens)
const RAW = [["H", "Hydrogen", 1, 1, 53, "non"], ["He", "Helium", 18, 1, 31, "noble"],
  ["Li", "Lithium", 1, 2, 167, "metal", 5], ["Be", "Beryllium", 2, 2, 112, "metal", 0], ["B", "Boron", 13, 2, 87, "semi"], ["C", "Carbon", 14, 2, 67, "non"], ["N", "Nitrogen", 15, 2, 56, "non"], ["O", "Oxygen", 16, 2, 48, "non"], ["F", "Fluorine", 17, 2, 42, "non", 10], ["Ne", "Neon", 18, 2, 38, "noble"],
  ["Na", "Sodium", 1, 3, 190, "metal", 8], ["Mg", "Magnesium", 2, 3, 145, "metal", 2], ["Al", "Aluminium", 13, 3, 118, "metal", 0], ["Si", "Silicon", 14, 3, 111, "semi"], ["P", "Phosphorus", 15, 3, 98, "non"], ["S", "Sulfur", 16, 3, 88, "non"], ["Cl", "Chlorine", 17, 3, 79, "non", 8], ["Ar", "Argon", 18, 3, 71, "noble"],
  ["K", "Potassium", 1, 4, 243, "metal", 10], ["Ca", "Calcium", 2, 4, 194, "metal", 6], ["Ga", "Gallium", 13, 4, 136, "metal", 0], ["Ge", "Germanium", 14, 4, 125, "semi"], ["As", "Arsenic", 15, 4, 114, "semi"], ["Se", "Selenium", 16, 4, 103, "non"], ["Br", "Bromine", 17, 4, 94, "non", 6], ["Kr", "Krypton", 18, 4, 88, "noble"]];
const EL = {}; RAW.forEach(r => EL[r[0]] = { s: r[0], n: r[1], g: r[2], p: r[3], r: r[4], t: r[5], re: r[6] || 0 });
const TYPE = { metal: ["metal", "#64b5f6"], semi: ["metalloid", "#81c784"], non: ["non-metal", "#ffb74d"], noble: ["noble gas", "#ba68c8"] };
const outer = e => e.g <= 2 ? e.g : e.g === 18 ? (e.p === 1 ? 2 : 8) : e.g - 10;
const ion = e => e.t === "metal" ? "+" + (e.g <= 2 ? e.g : 3) : e.g >= 15 && e.g <= 17 ? (e.g - 18) + "" : "—";
const WATER = re => re >= 10 ? "violent! lilac flame, fizzes across the water" : re >= 8 ? "fizzes fast, melts into a ball" : re >= 5 ? "fizzes steadily" : re >= 2 ? "very slow bubbles (faster in hot water)" : "no visible reaction";
function table(s, sel, ring) {
  let g = "";
  RAW.forEach(r => { const e = EL[r[0]], c = GROUPS.indexOf(e.g), x = 30 + c * 64, y = 70 + (e.p - 1) * 62;
    let fill = TYPE[e.t][1];
    if (s.view === "size") fill = `hsl(210,70%,${Math.round(92 - (e.r / 243) * 55)}%)`;
    if (s.view === "plain") fill = "#e8eaf6";
    if (s.view === "react") fill = e.re ? `hsl(${e.t === "metal" ? 10 : 140},80%,${Math.round(90 - e.re * 4.5)}%)` : "#eceff1";
    g += `<g ${ring ? `class="pk" data-k="${e.s}"` : ""}><rect x="${x}" y="${y}" width="58" height="56" rx="8" fill="${fill}" stroke="${sel === e.s ? "#d50000" : "#fff"}" stroke-width="${sel === e.s ? 4 : 2}"/>${ring ? `<rect x="${x}" y="${y}" width="58" height="56" rx="8" fill="none" ${E.ring(ring[e.s])}/>` : ""}${T(x + 29, y + 30, e.s, { s: 20, c: "#263238" })}${T(x + 29, y + 48, s.view === "size" ? e.r + "" : "", { s: 10, c: "#37474f" })}</g>`; });
  GROUPS.forEach((gr, c) => g += T(30 + c * 64 + 29, 62, "" + gr, { s: 11, c: "#78909c" }));
  [1, 2, 3, 4].forEach(p => g += T(18, 70 + (p - 1) * 62 + 34, "" + p, { s: 11, c: "#78909c" }));
  return g;
}
function render(s) {
  const e = EL[s.el], show = s.reveal;
  let g = `<rect width="860" height="450" fill="#f0f3fb"/><rect x="10" y="20" width="540" height="320" rx="16" fill="#fff" stroke="#c5cae9" stroke-width="2"/>${T(280, 44, { type: "METALS · METALLOIDS · NON-METALS · NOBLE GASES", size: "ATOMIC RADIUS (pm) — darker = bigger", react: "REACTIVITY — darker = more reactive" }[s.view], { s: 12, c: "#283593" })}` + table(s, s.el);
  // atom size drawing
  g += `<g transform="translate(570,20)"><rect width="270" height="320" rx="16" fill="#fff" stroke="#c5cae9" stroke-width="2"/>${T(135, 32, e.n + " (" + e.s + ")", { s: 18, c: "#1a237e" })}${T(135, 54, `group ${e.g} · period ${e.p} · ${TYPE[e.t][0]}`, { s: 12, c: "#5c6bc0" })}
    <circle cx="135" cy="150" r="${e.r * 0.4}" fill="${TYPE[e.t][1]}" opacity=".35" stroke="#3949ab" stroke-dasharray="4 4"/><circle cx="135" cy="150" r="6" fill="#d32f2f"/>
    ${Array.from({ length: Math.min(8, outer(e)) }, (_, i) => `<circle cx="${135 + Math.cos(i / Math.min(8, outer(e)) * 6.283) * e.r * 0.4}" cy="${150 + Math.sin(i / Math.min(8, outer(e)) * 6.283) * e.r * 0.4}" r="5" fill="#1e88e5"/>`).join("")}
    ${T(135, 254, show ? `radius ${e.r} pm · ${outer(e)} outer electron${outer(e) > 1 ? "s" : ""}` : "press ▶ to test", { s: 13, c: "#283593" })}${T(135, 278, show ? "usual ion: " + ion(e) : "", { s: 13, c: "#283593" })}</g>`;
  // water / reactivity test
  g += `<g transform="translate(10,352)"><rect width="830" height="88" rx="16" fill="#fff" stroke="#c5cae9" stroke-width="2"/>${T(140, 26, e.g === 17 ? "REACTIVITY TEST (with iron wool)" : "DROP IT IN WATER", { s: 12, c: "#283593" })}
    <rect x="30" y="38" width="220" height="40" rx="8" fill="#e3f2fd" stroke="#90caf9"/>${show && e.t === "metal" && e.re > 0 ? Array.from({ length: Math.round(e.re * 1.4) }, (_, i) => `<circle cx="${50 + (i * 23) % 180}" cy="${68 - (i % 3) * 9}" r="3" fill="#fff" stroke="#90a4ae"/>`).join("") + (e.re >= 10 ? `<text x="140" y="56" text-anchor="middle" font-size="22">🔥</text>` : "") : ""}
    ${T(540, 58, show ? (e.t === "metal" ? WATER(e.re) : e.g === 17 ? ["", "", "", "", "", "", "glows slowly", "", "burns brightly", "", "bursts into flame instantly"][e.re] : e.t === "noble" ? "no reaction — noble gases are unreactive" : "not a metal — no reaction with water") : "", { s: 15, c: "#37474f" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "el", type: "select", label: "Element", options: RAW.map(r => ({ v: r[0], label: `${r[0]} — ${r[1]}` })), lock: lk("el") },
  { id: "view", type: "choice", label: "Colour the table by", options: [{ v: "type", label: "Type" }, { v: "size", label: "Atom size" }, { v: "react", label: "Reactivity" }], lock: lk("view") }]; };
const st = o => Object.assign({ el: "C", view: "type" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 700); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const d = s => { const e = EL[s.el]; return `${e.n}: group ${e.g}, period ${e.p}, ${TYPE[e.t][0]}, radius ${e.r} pm`; };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "📊 Periodic table challenge", prompt: "Choose an element, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Atoms get BIGGER down a group and SMALLER across a period. Group 1 metals get MORE reactive down the group; halogens (group 17) get LESS reactive down the group." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("pt-sim", diff, uses, mk);
const pickQ = (lv, goal, test, why, sol, wrong, o) => simQ(lv, goal, st(o), s => ok(test(EL[s.el]), d(s) + " — " + why, d(s) + "."), { el: sol }, { wrong: { el: wrong } });
const C = {
  largest: () => pickQ(1, "Choose the element with the <b>largest atom</b> in the table.", e => e.s === "K", "bottom-left of the table.", "K", "Na", { view: "size" }),
  smallP3: () => pickQ(1, "Choose the <b>smallest atom in period 3</b>.", e => e.s === "Ar", "atoms shrink across a period.", "Ar", "Na"),
  noble2: () => pickQ(1, "Choose the <b>noble gas in period 2</b>.", e => e.s === "Ne", "group 18, full outer shell.", "Ne", "F"),
  mg: () => pickQ(1, "Choose the <b>metal</b> in <b>group 2, period 3</b>.", e => e.g === 2 && e.p === 3, "magnesium.", "Mg", "Ca"),
  violent: () => pickQ(2, "Drop metals in water: find the one that reacts <b>most violently</b>.", e => e.s === "K", "group 1 metals get more reactive down the group.", "K", "Na", { view: "react" }),
  lessNa: () => pickQ(2, "Find a <b>group 1</b> metal that reacts <b>less</b> than sodium.", e => e.g === 1 && e.t === "metal" && e.re < 8, "lithium is higher up group 1.", "Li", "K", { view: "react" }),
  noWater: () => pickQ(2, "Find a <b>period 3 metal</b> that shows <b>no visible reaction</b> with cold water.", e => e.p === 3 && e.t === "metal" && e.re === 0, "aluminium is protected by an oxide layer.", "Al", "Mg"),
  halogen: () => pickQ(2, "Find the <b>most reactive halogen</b>.", e => e.s === "F", "halogens get LESS reactive down group 17.", "F", "Br", { view: "react" }),
  twice: () => pickQ(3, "Choose an element whose atom is about <b>twice as wide as chlorine</b> (150–175 pm).", e => e.r >= 150 && e.r <= 175, "chlorine is 79 pm.", "Li", "Mg", { view: "size" }),
  seven4: () => pickQ(3, "Choose the element in <b>period 4</b> with <b>7 outer electrons</b>.", e => e.p === 4 && outer(e) === 7, "bromine, group 17.", "Br", "Se"),
  likeO: () => pickQ(3, "Choose an element that reacts like <b>oxygen</b> but has <b>bigger</b> atoms.", e => e.g === 16 && e.r > 48, "same group → same number of outer electrons.", "S", "Cl"),
  ion2: () => pickQ(3, "Choose the <b>period 4</b> element that forms a <b>2+ ion</b>.", e => e.p === 4 && ion(e) === "+2", "calcium loses its 2 outer electrons.", "Ca", "K")
};
const D = {
  pick: diff => E.diaT("pt-pick", diff, 2, () => { const want = choice([["alkali", "Click ALL the <b>group 1 metals</b> (alkali metals).", e => e.g === 1 && e.t === "metal"], ["halo", "Click ALL the <b>halogens</b> (group 17).", e => e.g === 17], ["noble", "Click ALL the <b>noble gases</b>.", e => e.t === "noble"], ["semi", "Click ALL the <b>metalloids</b>.", e => e.t === "semi"]]);
    const ans = RAW.map(r => EL[r[0]]).filter(want[2]).map(e => e.s);
    return { kind: "pick", many: true, title: "👆 Families of elements", prompt: want[1], answer: ans, names: Object.fromEntries(RAW.map(r => [r[0], r[1]])),
      visual: s2 => `<svg viewBox="0 30 560 290" xmlns="http://www.w3.org/2000/svg"><rect y="30" width="560" height="290" fill="#f0f3fb"/>${table({ view: "plain" }, null, s2)}</svg>`,
      explain: "Group 1 = alkali metals (Li, Na, K); group 17 = halogens (F, Cl, Br); group 18 = noble gases; metalloids sit on the staircase (B, Si, Ge, As).", summary: "Element families" }; }),
  num: diff => E.diaT("pt-num", diff, 2, () => { const pr = choice([["Na", "Cl"], ["K", "Li"], ["Mg", "S"], ["Ca", "Be"]]), a = EL[pr[0]], b = EL[pr[1]];
    return { kind: "num", title: "🧮 Atom sizes", prompt: `${a.n} has radius <b>${a.r} pm</b>; ${b.n} has radius <b>${b.r} pm</b>.`, visual: render(st({ el: pr[0], view: "size" })),
      fields: [{ label: "Difference in radius", unit: "pm", answer: Math.abs(a.r - b.r) }, { label: "How many times bigger is the larger one?", unit: "×", answer: Math.max(a.r, b.r) / Math.min(a.r, b.r), tol: 0.03 }], explain: `${Math.max(a.r, b.r)} − ${Math.min(a.r, b.r)} = ${Math.abs(a.r - b.r)} pm; ${Math.max(a.r, b.r)} ÷ ${Math.min(a.r, b.r)} = ${fmt(Math.max(a.r, b.r) / Math.min(a.r, b.r))}.`, summary: "Atomic radius calculation" }; }),
  mcq: diff => E.diaT("pt-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does potassium react more violently with water than sodium?", ok: "Its outer electron is farther from the nucleus, so it is lost more easily", bad: ["It has more outer electrons", "It is a non-metal", "Its atoms are smaller"], ex: "Bigger atom → weaker hold on the outer electron." },
      { ask: "What happens to atom size across period 3 (Na → Ar)?", ok: "It gets smaller", bad: ["It gets bigger", "It stays the same", "It doubles"], ex: "More protons pull the same shell in closer." },
      { ask: "Why are noble gases so unreactive?", ok: "They have full outer shells", bad: ["They are metals", "They have no electrons", "They are very large"], ex: "A full outer shell is stable." }]);
    return { kind: "mcq", title: "📘 Periodic trends", prompt: "Use the table.", visual: render(st({ el: "K", view: "size", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Periodic trend concepts" }; })
};
const LEVELS = {
  1: { intro: "Explore the first four periods of the periodic table: groups, periods and families.", pool: () => [S(1, 1, C.noble2), S(2, 1, C.mg), S(2, 1, C.smallP3), S(3, 1, C.largest), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Test reactivity: drop metals in water and compare the halogens.", pool: () => [S(1, 1, C.halogen), S(2, 1, C.lessNa), S(2, 1, C.noWater), S(3, 1, C.violent), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Use trends to predict sizes, outer electrons and ions.", pool: () => [S(1, 1, C.seven4), S(2, 1, C.likeO), S(3, 1, C.twice), S(3, 1, C.ion2), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose elements and colour the table by type, size or reactivity. Press ▶ to test each one.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Test",
  goals: () => [{ txt: "Test a metal in water", test: (s, m) => m.m }, { txt: "Test a noble gas", test: (s, m) => m.n }, { txt: "Colour the table by atom size", test: (s, m) => m.z }],
  track: (s, m, ran) => { if (!ran) return; const e = EL[s.el]; if (e.t === "metal") m.m = 1; if (e.t === "noble") m.n = 1; if (s.view === "size") m.z = 1; },
  facts: () => "📘 Elements in the same <b>group</b> have the same number of outer electrons and react in similar ways. Atoms get bigger <b>down a group</b> and smaller <b>across a period</b>."
});
E.start({ labId: "trends", total: 7, plan: { sim: 4, dia: 3 }, emoji: "📊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚛️", "🧪", "📊", "✨"],
  exploreDemo: () => [{ set: { el: "Na" }, run: true }, { set: { el: "Ar", view: "size" }, run: true }] });
})();
