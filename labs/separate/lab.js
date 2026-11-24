"use strict";
// ===== Separating Mixtures — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SUB = { sand: { n: "sand", c: "#d7b46a", sol: false }, salt: { n: "salt", c: "#eceff1", sol: true }, water: { n: "water", c: "#81d4fa", liq: true }, iron: { n: "iron filings", c: "#616161", mag: true, sol: false }, sulfur: { n: "sulfur", c: "#fdd835", sol: false }, oil: { n: "oil", c: "#ffcc80", liq: true, oil: true }, ink: { n: "black ink", c: "#263238", liq: true, ink: true } };
const MIX = { sandwater: { n: "Sandy salt water", s: ["sand", "salt", "water"] }, ironsulfur: { n: "Iron + sulfur powder", s: ["iron", "sulfur"] }, seawater: { n: "Sea water (salt water)", s: ["salt", "water"] }, oilwater: { n: "Oil + water", s: ["oil", "water"] }, sandsalt: { n: "Dry sand + salt", s: ["sand", "salt"] }, ironsalt: { n: "Iron filings + salt", s: ["iron", "salt"] }, ink: { n: "Black ink", s: ["ink"] } };
const M = { none: "—", dissolve: "Add water & stir", filter: "Filter", evaporate: "Evaporate", distil: "Distil", magnet: "Use a magnet", funnel: "Separating funnel", chroma: "Chromatography" };
const ICON = { dissolve: "🥄", filter: "⏬", evaporate: "♨️", distil: "🧪", magnet: "🧲", funnel: "⚗️", chroma: "📜" };
function process(s) {
  let mix = MIX[s.mix].s.slice(), out = [], log = [], dyes = null;
  const has = k => mix.includes(k);
  [s.m1, s.m2, s.m3].forEach((m, i) => { if (!m || m === "none") return;
    if (m === "dissolve") { if (!has("water")) mix.push("water"); log.push("water added — salt dissolves"); }
    else if (m === "filter") { const ins = mix.filter(k => SUB[k].sol === false); if (!has("water") && !has("oil")) log.push("✘ nothing to pour through the filter (no liquid)"); else if (!ins.length) log.push("everything passed through the filter"); else { out.push({ where: "filter paper", items: ins }); mix = mix.filter(k => !ins.includes(k)); log.push("filter paper keeps " + ins.map(k => SUB[k].n).join(" + ")); } }
    else if (m === "evaporate") { if (!has("water")) log.push("✘ there is no water to evaporate"); else { mix = mix.filter(k => k !== "water"); log.push("water boils away — solids left in the dish"); } }
    else if (m === "distil") { if (!has("water")) log.push("✘ no liquid to distil"); else { out.push({ where: "distillate (collected)", items: ["water"] }); mix = mix.filter(k => k !== "water"); log.push("water vapour condensed and collected"); } }
    else if (m === "magnet") { if (!has("iron")) log.push("nothing is attracted"); else { out.push({ where: "magnet", items: ["iron"] }); mix = mix.filter(k => k !== "iron"); log.push("magnet pulls out the iron"); } }
    else if (m === "funnel") { if (!has("oil")) log.push("✘ there is only one liquid layer"); else { out.push({ where: "top layer (tapped off)", items: ["oil"] }); mix = mix.filter(k => k !== "oil"); log.push("water drained from the bottom, oil kept"); } }
    else if (m === "chroma") { if (!has("ink")) log.push("✘ nothing coloured to separate"); else { dyes = s.solv === "ethanol" ? 3 : 2; log.push(`${dyes} coloured spots appear on the paper`); } }
  });
  if (mix.length) out.push({ where: "left in the container", items: mix });
  return { out, log, dyes };
}
const pure = (s, k) => process(s).out.some(o => o.items.length === 1 && o.items[0] === k);
function render(s) {
  const show = s.reveal, P = process(s), mx = MIX[s.mix];
  let g = `<rect width="860" height="450" fill="#eef7f5"/>`;
  // mixture
  g += `<g transform="translate(20,20)"><rect width="200" height="260" rx="16" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>${T(100, 28, "MIXTURE", { s: 13, c: "#00695c" })}${T(100, 50, mx.n, { s: 13, c: "#004d40" })}
    <path d="M40,80 v130 q0,16 16,16 h88 q16,0 16,-16 v-130" fill="#ffffffcc" stroke="#78909c" stroke-width="3"/>
    ${mx.s.includes("water") || mx.s.includes("ink") ? `<path d="M43,${mx.s.includes("oil") ? 160 : 130} h114 v80 q0,13 -13,13 h-88 q-13,0 -13,-13Z" fill="${mx.s.includes("ink") ? "#37474f" : "#81d4fa"}" opacity=".8"/>` : ""}${mx.s.includes("oil") ? `<rect x="43" y="128" width="114" height="32" fill="#ffcc80"/>` : ""}
    ${mx.s.filter(k => !SUB[k].liq).map((k, j) => Array.from({ length: 22 }, (_, i) => `<circle cx="${52 + (i * 37 + j * 11) % 96}" cy="${214 - (i % 4) * 6 - j * 3}" r="${k === "salt" ? 2.2 : 3}" fill="${SUB[k].c}" stroke="${k === "salt" ? "#b0bec5" : "none"}"/>`).join("")).join("")}
    ${T(100, 250, mx.s.map(k => SUB[k].n).join(" + "), { s: 11, c: "#455a64" })}</g>`;
  // pipeline
  const steps = [s.m1, s.m2, s.m3].filter(m => m && m !== "none");
  g += `<g transform="translate(240,20)"><rect width="600" height="110" rx="16" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>${T(300, 26, "YOUR METHOD", { s: 13, c: "#00695c" })}
    ${steps.length ? steps.map((m, i) => `<g transform="translate(${30 + i * 190},40)"><rect width="160" height="56" rx="12" fill="#e0f2f1" stroke="#80cbc4"/><text x="28" y="38" text-anchor="middle" font-size="24">${ICON[m]}</text>${T(96, 34, (i + 1) + ". " + M[m], { s: 12, c: "#004d40" })}</g>${i < steps.length - 1 ? T(30 + i * 190 + 175, 74, "➜", { s: 18, c: "#26a69a" }) : ""}`).join("") : T(300, 74, "choose a method", { s: 14, c: "#b0bec5" })}</g>`;
  // results
  g += `<g transform="translate(240,145)"><rect width="600" height="285" rx="16" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>${T(300, 26, "WHAT YOU GET", { s: 13, c: "#00695c" })}`;
  if (show) {
    P.log.forEach((l, i) => g += T(20, 54 + i * 22, "• " + l, { a: "start", s: 13, c: l.startsWith("✘") ? "#c62828" : "#37474f" }));
    P.out.forEach((o, i) => { const x = 20 + i * 190, y = 140; g += `<rect x="${x}" y="${y}" width="170" height="${P.dyes ? 70 : 120}" rx="12" fill="${o.items.length === 1 ? "#e8f5e9" : "#fff8e1"}" stroke="${o.items.length === 1 ? "#66bb6a" : "#ffca28"}" stroke-width="2"/>${T(x + 85, y + 22, o.where, { s: 12, c: "#455a64" })}${T(x + 85, y + 50, o.items.map(k => SUB[k].n).join(" + "), { s: 14, c: "#1b5e20" })}${P.dyes ? "" : T(x + 85, y + 80, o.items.length === 1 ? "✔ pure" : "still a mixture", { s: 12, c: o.items.length === 1 ? "#2e7d32" : "#f57f17" })}`; });
    if (P.dyes) { g += `<g transform="translate(400,${140 + 80})"><rect x="0" y="-74" width="170" height="130" fill="#fffde7" stroke="#bdbdbd"/>${[["#e53935", 0.25], ["#1e88e5", 0.55], ["#fbc02d", 0.8]].slice(0, 3).map(([c, rf], i) => P.dyes === 2 && i === 2 ? "" : `<circle cx="${40 + i * 45}" cy="${40 - (P.dyes === 2 && i === 1 ? 0.65 : rf) * 100}" r="9" fill="${P.dyes === 2 && i === 1 ? "#43a047" : c}"/>`).join("")}<line x1="0" y1="40" x2="170" y2="40" stroke="#9e9e9e" stroke-dasharray="4 4"/>${T(85, 52, s.solv + " solvent", { s: 11, c: "#757575" })}</g>`; }
  } else g += T(300, 150, "press ▶ to carry out your method", { s: 14, c: "#b0bec5" });
  g += `</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const mopts = Object.keys(M).map(v => ({ v, label: v === "none" ? "— none —" : M[v] }));
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "mix", type: "select", label: "Mixture", options: Object.keys(MIX).map(v => ({ v, label: MIX[v].n })), lock: lk("mix") },
  { id: "m1", type: "select", label: lv < 3 ? "Method" : "Step 1", options: mopts.slice(1), lock: lk("m1") },
  { id: "m2", type: "select", label: "Step 2", options: mopts, hide: () => lv < 3, lock: lk("m2") },
  { id: "m3", type: "select", label: "Step 3", options: mopts, hide: () => lv < 3, lock: lk("m3") },
  { id: "solv", type: "choice", label: "Chromatography solvent", options: [{ v: "water", label: "Water" }, { v: "ethanol", label: "Ethanol" }], hide: s => s.m1 !== "chroma", lock: lk("solv") }]; };
const st = o => Object.assign({ mix: "sandwater", m1: "dissolve", m2: "none", m3: "none", solv: "water" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => process(s).log.join("; ");
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🧲 Separation challenge", prompt: "Choose the method, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Filter: removes insoluble solids. Evaporate: leaves dissolved solids. Distil: collects pure water. Magnet: pulls out iron. Separating funnel: separates liquids that don't mix. Chromatography: separates dyes." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("sp-sim", diff, uses, mk);
const target = (lv, goal, mix, k, sol, wrong, extra) => simQ(lv, goal, st(Object.assign({ mix }, extra || {})), s => ok(pure(s, k), said(s) + ` → pure ${SUB[k].n} ✔`, said(s) + ` → no pure ${SUB[k].n}.`), sol, { lock: ["mix"], wrong });
const C = {
  iron: () => target(1, "Get the <b>iron</b> out of iron + sulfur.", "ironsulfur", "iron", { m1: "magnet" }, { m1: "filter" }),
  sand: () => target(1, "Remove the <b>sand</b> from sandy salt water.", "sandwater", "sand", { m1: "filter" }, { m1: "evaporate" }),
  water: () => target(1, "Get <b>pure drinking water</b> from sea water.", "seawater", "water", { m1: "distil" }, { m1: "filter" }),
  dyes: () => simQ(1, "Find out <b>how many dyes</b> are in black ink.", st({ mix: "ink", m1: "filter" }), s => ok(s.m1 === "chroma" && process(s).dyes, said(s) + ".", "Use chromatography for coloured dyes."), { m1: "chroma" }, { lock: ["mix"], wrong: { m1: "evaporate" } }),
  salt: () => target(2, "Get <b>salt crystals</b> from sea water.", "seawater", "salt", { m1: "evaporate" }, { m1: "filter" }),
  oil: () => target(2, "Separate the <b>oil</b> from the water.", "oilwater", "oil", { m1: "funnel" }, { m1: "filter" }),
  both: () => simQ(2, "From sea water, get <b>pure water AND salt</b> in one step.", st({ mix: "seawater", m1: "evaporate" }), s => ok(pure(s, "water") && pure(s, "salt"), "Distillation: the water is collected and the salt stays behind.", said(s) + "."), { m1: "distil" }, { lock: ["mix"], wrong: { m1: "evaporate" } }),
  allDyes: () => simQ(2, "Chromatography: choose the solvent that separates <b>all 3 dyes</b> in black ink.", st({ mix: "ink", m1: "chroma", solv: "water" }), s => ok(s.m1 === "chroma" && process(s).dyes === 3, "In ethanol all 3 dyes travel different distances.", process(s).dyes ? `Only ${process(s).dyes} spots — two dyes are still together.` : "Use chromatography."), { solv: "ethanol" }, { lock: ["mix", "m1"], wrong: { solv: "water" } }),
  sandsalt: () => target(3, "Get <b>pure salt</b> from a mixture of dry sand and salt (3 steps).", "sandsalt", "salt", { m1: "dissolve", m2: "filter", m3: "evaporate" }, { m1: "filter", m2: "evaporate", m3: "none" }),
  sandyPure: () => target(3, "Get <b>pure salt</b> from sandy salt water (2 steps).", "sandwater", "salt", { m1: "filter", m2: "evaporate", m3: "none" }, { m1: "evaporate", m2: "none", m3: "none" }),
  ironsalt: () => target(3, "Get <b>pure salt</b> from iron filings + salt.", "ironsalt", "salt", { m1: "magnet", m2: "dissolve", m3: "evaporate" }, { m1: "dissolve", m2: "evaporate", m3: "none" }),
  sandFromSalt: () => target(3, "Get <b>clean sand</b> from dry sand + salt.", "sandsalt", "sand", { m1: "dissolve", m2: "filter", m3: "none" }, { m1: "filter", m2: "none", m3: "none" })
};
const D = {
  pick: diff => E.diaT("sp-pick", diff, 2, () => { const it = { filter: "sand from water", magnet: "iron from sulfur", distil: "pure water from ink", chroma: "dyes in ink" }, want = choice(Object.keys(it));
    const pic = { filter: `<path d="M-40,-40 h80 l-40,50Z" fill="#fff" stroke="#78909c" stroke-width="3"/><path d="M-30,-34 h60 l-30,36Z" fill="#d7b46a"/><rect x="-4" y="10" width="8" height="30" fill="#78909c"/>`, magnet: `<path d="M-30,-30 v40 a30,30 0 0 0 60,0 v-40 h-18 v40 a12,12 0 0 1 -24,0 v-40Z" fill="#e53935"/><rect x="-30" y="-36" width="18" height="10" fill="#cfd8dc"/><rect x="12" y="-36" width="18" height="10" fill="#cfd8dc"/>`, distil: `<circle cx="-30" cy="10" r="26" fill="#e3f2fd" stroke="#78909c" stroke-width="3"/><line x1="-14" y1="-10" x2="50" y2="20" stroke="#78909c" stroke-width="8"/><text x="-30" y="56" text-anchor="middle" font-size="20">🔥</text>`, chroma: `<rect x="-30" y="-50" width="60" height="90" fill="#fffde7" stroke="#bdbdbd"/><circle cx="-12" cy="-20" r="7" fill="#e53935"/><circle cx="12" cy="-34" r="7" fill="#1e88e5"/><circle cx="0" cy="10" r="7" fill="#fbc02d"/>` };
    const order = E.shuffle(Object.keys(it));
    return { kind: "pick", title: "👆 Choose the equipment", prompt: `Which method would you use to separate <b>${it[want]}</b>?`, answer: [want], names: Object.fromEntries(order.map(k => [k, M[k]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#eef7f5"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${15 + i * 212}" y="20" width="196" height="260" rx="14" fill="#fff" stroke="#b2dfdb" stroke-width="2"/><rect x="${15 + i * 212}" y="20" width="196" height="260" rx="14" fill="none" ${E.ring(s2[k])}/><g transform="translate(${113 + i * 212},130)">${pic[k]}</g>${T(113 + i * 212, 258, M[k], { s: 14, c: "#004d40" })}</g>`).join("")}</svg>`,
      explain: "Filter for insoluble solids; magnet for iron; distillation to collect a pure liquid; chromatography for dyes.", summary: "Choose separation equipment" }; }),
  num: diff => E.diaT("sp-num", diff, 2, () => { const c = choice([[3.2, 8], [4.5, 10], [2.4, 6], [6, 12]]);
    return { kind: "num", title: "🧮 Chromatography Rf value", prompt: `A dye spot moved <b>${c[0]} cm</b>; the solvent front moved <b>${c[1]} cm</b>.`, visual: render(st({ mix: "ink", m1: "chroma", solv: "ethanol", reveal: true })),
      fields: [{ label: "Rf value", unit: "", answer: c[0] / c[1], tol: 0.03 }], explain: `Rf = distance moved by the dye ÷ distance moved by the solvent = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])}.`, summary: "Rf calculation" }; }),
  mcq: diff => E.diaT("sp-mcq", diff, 2, () => { const q = choice([
      { ask: "Why can filtering NOT separate salt from salt water?", ok: "The salt is dissolved, so it passes through the filter paper", bad: ["Salt is magnetic", "Salt is a liquid", "The filter paper absorbs salt"], ex: "Dissolved particles are tiny and go through the paper." },
      { ask: "In distillation, what happens in the condenser?", ok: "Water vapour cools and turns back into liquid", bad: ["Salt is boiled", "Water freezes", "Oil separates"], ex: "Cold water around the condenser cools the vapour." },
      { ask: "Why does a magnet separate iron from sulfur?", ok: "Iron is magnetic but sulfur is not", bad: ["Sulfur is heavier", "Iron dissolves", "They have different colours"], ex: "We use a property that only one substance has." }]);
    return { kind: "mcq", title: "📘 Separation ideas", prompt: "Think about the properties of each substance.", visual: render(st({ mix: "seawater", m1: "distil", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Separation concepts" }; })
};
const LEVELS = {
  1: { intro: "Each method uses a different property: size, solubility, boiling point or magnetism.", pool: () => [S(1, 1, C.iron), S(2, 1, C.sand), S(2, 1, C.dyes), S(3, 1, C.water), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Choose the right method to get exactly the substance you want.", pool: () => [S(1, 1, C.salt), S(2, 1, C.oil), S(2, 1, C.allDyes), S(3, 1, C.both), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Plan methods with 2 or 3 steps to get pure substances from harder mixtures.", pool: () => [S(1, 1, C.sandyPure), S(2, 1, C.sandFromSalt), S(3, 1, C.sandsalt), S(3, 1, C.ironsalt), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a mixture and a method, then press ▶ to see what you get.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Separate",
  goals: () => [{ txt: "Get one pure substance", test: (s, m) => m.p }, { txt: "Use a magnet", test: (s, m) => m.m }, { txt: "Try a method that doesn't work", test: (s, m) => m.f }],
  track: (s, m, ran) => { if (!ran) return; const P = process(s); if (P.out.some(o => o.items.length === 1)) m.p = 1; if (s.m1 === "magnet") m.m = 1; if (P.log.some(l => l.startsWith("✘") || l.includes("nothing") || l.includes("everything"))) m.f = 1; },
  facts: () => "📘 A <b>mixture</b> can be separated by physical methods because each substance keeps its own properties."
});
E.start({ labId: "separate", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧲", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧂", "💧", "🧲", "✨"],
  exploreDemo: () => [{ set: { mix: "sandwater", m1: "filter" }, run: true }, { set: { mix: "ironsulfur", m1: "magnet" }, run: true }, { set: { mix: "seawater", m1: "filter" }, run: true }] });
})();
