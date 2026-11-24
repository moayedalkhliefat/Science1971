"use strict";
// ===== Conservation of Mass — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
// d = change in mass per gram of solid when the container is OPEN (gas leaves: −, oxygen joins: +)
const RX = {
  soda: { n: "Baking soda + vinegar", other: 50, d: -0.524, gas: "CO₂ escapes", eq: "NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂", solid: "baking soda", vessel: "flask" },
  precip: { n: "Two salt solutions → precipitate", other: 60, d: 0, gas: "", eq: "Pb(NO₃)₂ + 2KI → PbI₂ (yellow solid) + 2KNO₃", solid: "lead nitrate", vessel: "flask" },
  steel: { n: "Burning steel wool", other: 0, d: 0.429, gas: "O₂ from the air joins", eq: "4Fe + 3O₂ → 2Fe₂O₃", solid: "steel wool", vessel: "crucible" },
  mg: { n: "Burning magnesium", other: 0, d: 0.667, gas: "O₂ from the air joins", eq: "2Mg + O₂ → 2MgO", solid: "magnesium", vessel: "crucible" },
  lime: { n: "Heating limestone", other: 0, d: -0.44, gas: "CO₂ escapes", eq: "CaCO₃ → CaO + CO₂", solid: "limestone", vessel: "crucible" }
};
const r2 = x => Math.round(x * 100) / 100;
const before = s => r2(100 + RX[s.rx].other + s.m);
const change = s => s.cont === "closed" ? 0 : r2(RX[s.rx].d * s.m);
const after = s => r2(before(s) + change(s));
function render(s) {
  const x = RX[s.rx], show = s.reveal, closed = s.cont === "closed", flask = x.vessel === "flask";
  let g = `<rect width="860" height="450" fill="#f5f2fc"/>`;
  // balance
  g += `<rect x="60" y="330" width="380" height="70" rx="14" fill="#455a64"/><rect x="90" y="318" width="320" height="16" rx="6" fill="#90a4ae"/><rect x="180" y="345" width="140" height="42" rx="6" fill="#a5d6a7"/>
    ${T(250, 375, (show ? after(s) : before(s)).toFixed(2) + " g", { s: 22, c: "#1b5e20" })}`;
  if (flask) {
    g += `<path d="M230,150 v40 l-70,110 q-8,18 14,18 h152 q22,0 14,-18 l-70,-110 v-40Z" fill="#ffffffcc" stroke="#78909c" stroke-width="3"/><path d="M182,262 h136 l16,30 q6,14 -12,14 h-144 q-18,0 -12,-14Z" fill="${s.rx === "precip" && show ? "#fff59d" : "#e3f2fd"}"/>
      ${show && s.rx === "precip" ? Array.from({ length: 14 }, (_, i) => `<circle cx="${190 + (i * 11) % 120}" cy="${298 - (i % 3) * 4}" r="4" fill="#f9a825"/>`).join("") : ""}
      ${closed ? `<rect x="226" y="140" width="48" height="14" rx="4" fill="#8d6e63"/><ellipse cx="250" cy="${show && x.gas ? 100 : 128}" rx="${show && x.gas ? 34 : 14}" ry="${show && x.gas ? 40 : 14}" fill="#ef9a9a" stroke="#c62828" stroke-width="2"/>` : ""}
      ${show && x.gas && !closed ? Array.from({ length: 6 }, (_, i) => `<text x="${222 + (i % 3) * 22}" y="120" font-size="16">⬆<animate attributeName="y" values="140;60" dur="1.4s" begin="${i * 0.2}s" repeatCount="indefinite"/></text>`).join("") : ""}`;
  } else {
    g += `<path d="M190,250 h120 l-14,60 h-92Z" fill="#eceff1" stroke="#607d8b" stroke-width="3"/><rect x="${210}" y="${show && x.d > 0 ? 258 : 270}" width="80" height="${show && x.d > 0 ? 36 : 24}" rx="6" fill="${show ? (s.rx === "lime" ? "#fafafa" : s.rx === "mg" ? "#ffffff" : "#6d4c41") : s.rx === "mg" ? "#b0bec5" : s.rx === "lime" ? "#d7ccc8" : "#9e9e9e"}" stroke="#757575"/>
      ${closed ? `<path d="M186,250 q64,-70 128,0" fill="#e1f5fe88" stroke="#4fc3f7" stroke-width="3"/>${T(250, 206, "sealed lid", { s: 11, c: "#0277bd" })}` : ""}
      ${show && !closed ? Array.from({ length: 5 }, (_, i) => `<text x="${200 + i * 22}" y="230" font-size="16">${x.d > 0 ? "⬇" : "⬆"}<animate attributeName="y" values="${x.d > 0 ? "180;240" : "240;170"}" dur="1.4s" begin="${i * 0.2}s" repeatCount="indefinite"/></text>`).join("") : ""}
      ${show ? `<text x="250" y="318" text-anchor="middle" font-size="22">🔥</text>` : ""}`;
  }
  g += T(250, 424, x.n + (closed ? " · closed" : " · open"), { s: 14, c: "#4527a0" });
  // results
  g += `<g transform="translate(470,30)"><rect width="370" height="400" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(185, 30, "MASS RECORD", { s: 13, c: "#4527a0" })}
    ${T(30, 74, "Before:", { a: "start", s: 16, c: "#37474f" })}${T(340, 74, before(s).toFixed(2) + " g", { a: "end", s: 18, c: "#311b92" })}
    ${T(30, 112, "After:", { a: "start", s: 16, c: "#37474f" })}${T(340, 112, show ? after(s).toFixed(2) + " g" : "?", { a: "end", s: 18, c: "#311b92" })}
    ${T(30, 150, "Change:", { a: "start", s: 16, c: "#37474f" })}${T(340, 150, show ? (change(s) > 0 ? "+" : "") + change(s).toFixed(2) + " g" : "?", { a: "end", s: 18, c: show ? (change(s) === 0 ? "#2e7d32" : "#c62828") : "#311b92" })}
    <line x1="24" y1="172" x2="346" y2="172" stroke="#ede7f6" stroke-width="2"/>
    ${T(30, 200, `${s.m} g of ${x.solid}`, { a: "start", s: 14, c: "#455a64" })}${x.other ? T(30, 224, `+ ${x.other} g of liquid, container 100 g`, { a: "start", s: 13, c: "#78909c" }) : T(30, 224, "crucible 100 g", { a: "start", s: 13, c: "#78909c" })}
    <foreignObject x="20" y="240" width="330" height="70"><div xmlns="http://www.w3.org/1999/xhtml" style="font:13px Nunito,sans-serif;color:#4527a0;text-align:center">${x.eq}</div></foreignObject>
    ${T(185, 340, show ? (change(s) === 0 ? "Mass is conserved ✔" : x.gas + (change(s) < 0 ? " — it leaves the container" : " — it adds mass")) : "press ▶ to react", { s: 14, c: show ? (change(s) === 0 ? "#2e7d32" : "#c62828") : "#b39ddb" })}
    ${T(185, 372, show && change(s) !== 0 ? "Atoms are not lost or made — they moved in or out!" : "", { s: 12, c: "#6a1b9a" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "rx", type: "select", label: "Reaction", options: Object.keys(RX).map(v => ({ v, label: RX[v].n })), lock: lk("rx") },
  { id: "cont", type: "choice", label: "Container", options: [{ v: "open", label: "Open" }, { v: "closed", label: "Closed (sealed)" }], lock: lk("cont") },
  { id: "m", type: "range", label: "Mass of solid", min: 1, max: 10, step: 0.5, nudge: 0.5, unit: "g", hide: () => lv < 2, lock: lk("m") }]; };
const st = o => Object.assign({ rx: "soda", cont: "open", m: 5 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${RX[s.rx].n}, ${s.cont}: ${before(s)} g → ${after(s)} g`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⚖️ Mass challenge", prompt: "Set up the reaction on the balance, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Mass is never created or destroyed. In an OPEN container a gas can escape (mass goes down) or oxygen from the air can join (mass goes up). In a CLOSED container the mass stays the same." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("cm-sim", diff, uses, mk);
const C = {
  keep: () => simQ(1, "Baking soda + vinegar: make the balance show the <b>same mass</b> before and after.", st(), s => ok(s.rx === "soda" && change(s) === 0, "Sealed flask: the CO₂ is trapped in the balloon — mass conserved.", say(s) + " — the gas escaped."), { cont: "closed" }, { lock: ["rx"], wrong: { cont: "open" } }),
  lose: () => simQ(1, "Make the mass on the balance <b>go down</b>.", st({ rx: "precip" }), s => ok(change(s) < 0, say(s) + " — a gas left the container.", say(s) + "."), { rx: "soda", cont: "open" }, { wrong: { rx: "soda", cont: "closed" } }),
  gain: () => simQ(1, "Make the mass on the balance <b>go up</b>!", st({ rx: "soda" }), s => ok(change(s) > 0, say(s) + " — oxygen from the air joined the metal.", say(s) + "."), { rx: "steel", cont: "open" }, { wrong: { rx: "lime", cont: "open" } }),
  openSame: () => simQ(1, "Find a reaction where the mass stays the same <b>even in an open container</b>.", st(), s => ok(s.cont === "open" && change(s) === 0, "No gas is made or used — the precipitate stays in the flask.", s.cont !== "open" ? "Use an OPEN container." : say(s) + "."), { rx: "precip", cont: "open" }, { wrong: { rx: "soda", cont: "open" } }),
  co2: () => simQ(2, "Open flask: lose exactly <b>2.62 g</b> of CO₂ from baking soda + vinegar.", st({ m: 2 }), s => ok(s.rx === "soda" && Math.abs(change(s) + 2.62) < 0.02, "5 g × 0.524 = 2.62 g of CO₂.", say(s) + "."), { m: 5 }, { lock: ["rx", "cont"], wrong: { m: 4 } }),
  steel3: () => simQ(2, "Burn steel wool in an open crucible so the mass goes up by about <b>3 g</b> (±0.05).", st({ rx: "steel", m: 2 }), s => ok(Math.abs(change(s) - 3) <= 0.05, "7 g of iron gains 3 g of oxygen.", say(s) + "."), { m: 7 }, { lock: ["rx", "cont"], wrong: { m: 6 } }),
  reading: () => simQ(2, "<b>10 g</b> of baking soda with vinegar. Make the balance read <b>160.00 g</b> at the end.", st({ m: 10 }), s => ok(Math.abs(after(s) - 160) < 0.01, "Closed: 100 + 50 + 10 = 160 g — nothing escapes.", say(s) + "."), { cont: "closed" }, { lock: ["rx", "m"], wrong: { cont: "open" } }),
  lime: () => simQ(2, "Heat limestone in an open crucible so <b>4.4 g</b> of CO₂ escapes.", st({ rx: "lime", m: 3 }), s => ok(Math.abs(change(s) + 4.4) < 0.02, "10 g CaCO₃ → 5.6 g CaO + 4.4 g CO₂.", say(s) + "."), { m: 10 }, { lock: ["rx", "cont"], wrong: { m: 8 } }),
  oxygen: () => simQ(3, "Burn <b>6 g</b> of magnesium. Show how much oxygen joined it.", st({ rx: "mg", m: 6, cont: "closed" }), s => ok(s.cont === "open" && Math.abs(change(s) - 4) < 0.02, "6 g Mg + 4 g O₂ → 10 g MgO.", s.cont === "closed" ? "In a sealed crucible the balance cannot show the oxygen joining." : say(s) + "."), { cont: "open" }, { lock: ["rx", "m"], wrong: { cont: "closed" } }),
  sameLoss: () => simQ(3, "Choose the reaction and mass that loses <b>2.2 g</b> of CO₂ in an open container, using <b>exactly 5 g</b> of solid.", st({ rx: "soda", m: 5 }), s => ok(s.m === 5 && Math.abs(change(s) + 2.2) < 0.02, "5 g limestone × 0.44 = 2.2 g CO₂.", say(s) + "."), { rx: "lime" }, { lock: ["cont", "m"], wrong: { rx: "soda" } }),
  hidden: () => simQ(3, "A sealed flask shows <b>no change</b>, but a reaction happened. Pick a reaction that makes a gas and prove the mass is conserved with 8 g of solid.", st({ rx: "steel", m: 8 }), s => ok(s.rx === "soda" && s.cont === "closed", "The CO₂ is trapped in the balloon: mass 158 g before and after.", "Choose the gas-making reaction in a sealed flask."), { rx: "soda", cont: "closed" }, { lock: ["m"], wrong: { rx: "precip", cont: "closed" } })
};
C.mgo6 = () => simQ(3, "Burn magnesium in an open crucible to make <b>10 g</b> of magnesium oxide.", st({ rx: "mg", m: 2 }), s => ok(s.cont === "open" && Math.abs(s.m * 5 / 3 - 10) < 0.05, "6 g Mg + 4 g O₂ → 10 g MgO (ratio 24 : 40).", `${s.m} g Mg makes ${fmt(r2(s.m * 5 / 3))} g MgO.`), { m: 6, cont: "open" }, { lock: ["rx"], wrong: { m: 5, cont: "open" } });
const D = {
  pick: diff => E.diaT("cm-pick", diff, 2, () => { const want = choice(["down", "up", "same"]), items = { a: st({ rx: "soda", cont: "open" }), b: st({ rx: "steel", cont: "open" }), c: st({ rx: "soda", cont: "closed" }) }, map = { down: "a", up: "b", same: "c" };
    return { kind: "pick", title: "👆 Predict the balance", prompt: { down: "Which experiment's mass will go <b>DOWN</b>?", up: "Which experiment's mass will go <b>UP</b>?", same: "Which experiment's mass will stay the <b>SAME</b>?" }[want], answer: [map[want]], names: { a: "open flask, soda + vinegar", b: "steel wool burning", c: "sealed flask with balloon" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f5f2fc"/>${["a", "b", "c"].map((k, i) => `<g class="pk" data-k="${k}"><rect x="${20 + i * 280}" y="20" width="260" height="260" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/><rect x="${20 + i * 280}" y="20" width="260" height="260" rx="14" fill="none" ${E.ring(s2[k])}/><g transform="translate(${i * 280},-25) scale(.6)">${render(Object.assign({}, items[k])).replace(/^<svg[^>]*>|<\/svg>$/g, "").replace(/<rect width="860" height="450"[^>]*\/>/, "").replace(/<g transform="translate\(470,30\)">[\s\S]*$/, "")}</g>${T(150 + i * 280, 270, items[k].cont === "closed" ? "sealed flask" : items[k].rx === "steel" ? "steel wool, open" : "open flask", { s: 13, c: "#4527a0" })}</g>`).join("")}</svg>`,
      explain: "Open soda + vinegar: CO₂ escapes → mass down. Burning steel wool: oxygen joins → mass up. Sealed flask: nothing in or out → same.", summary: "Predict mass changes" }; }),
  num: diff => E.diaT("cm-num", diff, 2, () => { const c = choice([[12, 7.6], [20, 11.2], [8.4, 4.4], [25, 14]]);
    return { kind: "num", title: "🧮 Use conservation of mass", prompt: `Heating <b>${c[0]} g</b> of a solid makes <b>${c[1]} g</b> of solid product and a gas.`, visual: render(st({ rx: "lime", m: 5, reveal: true })),
      fields: [{ label: "Mass of gas made", unit: "g", answer: r2(c[0] - c[1]) }], explain: `Mass of reactants = mass of products: ${c[0]} − ${c[1]} = ${fmt(r2(c[0] - c[1]))} g of gas.`, summary: "Conservation of mass calculation" }; }),
  mcq: diff => E.diaT("cm-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does the mass go down when baking soda and vinegar react in an open flask?", ok: "Carbon dioxide gas escapes into the air", bad: ["Atoms are destroyed", "The vinegar evaporates instantly", "The flask gets lighter"], ex: "The atoms are still there — some just left as a gas." },
      { ask: "Why does steel wool get HEAVIER when it burns?", ok: "Oxygen from the air combines with the iron", bad: ["Fire adds mass", "Smoke is heavy", "Iron atoms split"], ex: "Iron + oxygen → iron oxide: the oxygen atoms add mass." },
      { ask: "What does the law of conservation of mass say?", ok: "Total mass of reactants = total mass of products", bad: ["Mass always increases", "Gases have no mass", "Products are always lighter"], ex: "Atoms are rearranged, not created or destroyed." }]);
    return { kind: "mcq", title: "📘 Conservation of mass", prompt: "Think about atoms.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Conservation of mass concepts" }; })
};
const LEVELS = {
  1: { intro: "Do reactions on a balance. Does the mass really change — or do atoms just move in or out?", pool: () => [S(1, 1, C.keep), S(2, 1, C.lose), S(2, 1, C.openSame), S(3, 1, C.gain), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Measure exactly how much gas escapes or how much oxygen joins.", pool: () => [S(1, 1, C.reading), S(2, 1, C.co2), S(2, 1, C.lime), S(3, 1, C.steel3), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Use reacting masses to plan experiments: reactants = products.", pool: () => [S(1, 1, C.hidden), S(2, 1, C.oxygen), S(3, 1, C.mgo6), S(3, 1, C.sameLoss), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a reaction and an open or sealed container, then press ▶ and watch the balance.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ React",
  goals: () => [{ txt: "Make the mass go down", test: (s, m) => m.d }, { txt: "Make the mass go up", test: (s, m) => m.u }, { txt: "Keep the mass the same", test: (s, m) => m.s }],
  track: (s, m, ran) => { if (!ran) return; const c = change(s); if (c < 0) m.d = 1; if (c > 0) m.u = 1; if (c === 0) m.s = 1; },
  facts: () => "📘 <b>Law of conservation of mass</b>: in a chemical reaction, atoms are rearranged — never created or destroyed — so the total mass stays the same."
});
E.start({ labId: "conserve", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚖️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚖️", "⚛️", "🧪", "✨"],
  exploreDemo: () => [{ set: { rx: "soda", cont: "open" }, run: true }, { set: { rx: "steel" }, run: true }, { set: { cont: "closed" }, run: true }] });
})();
