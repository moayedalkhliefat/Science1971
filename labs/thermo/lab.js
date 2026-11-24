"use strict";
// ===== Exothermic & Endothermic Reactions — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
// k = temperature change (°C) per unit in 50 mL of water
const RX = {
  cacl2: { n: "Calcium chloride dissolving", k: 4, u: "g", use: "hot pack" },
  mg: { n: "Magnesium + acid", k: 8, u: "g", use: "" },
  iron: { n: "Iron powder rusting (hand warmer)", k: 2.5, u: "g", use: "hand warmer" },
  neut: { n: "Acid + alkali (neutralisation)", k: 6.8, u: "M", use: "" },
  nh4no3: { n: "Ammonium nitrate dissolving", k: -3, u: "g", use: "cold pack" },
  citric: { n: "Citric acid + baking soda", k: -2, u: "g", use: "sherbet fizz" }
};
const r1 = x => Math.round(x * 10) / 10;
const dT = s => r1(RX[s.rx].k * s.a / (s.v / 50));
const Tend = s => r1(20 + dT(s));
const Q = s => Math.round(s.v * 4.2 * dT(s));
const exo = s => RX[s.rx].k > 0;
function render(s) {
  const show = s.reveal, d = show ? dT(s) : 0, Tn = 20 + d;
  let g = `<rect width="860" height="450" fill="#fff5ef"/>`;
  // calorimeter
  const lvl = 300 - s.v * 1.1;
  g += `<path d="M90,150 l14,200 h120 l14,-200Z" fill="#fafafa" stroke="#b0bec5" stroke-width="3"/><path d="M${92 + (300 - lvl) * 0.07},${lvl} L${236 - (300 - lvl) * 0.07},${lvl} L224,350 L104,350Z" fill="${show ? (d > 0 ? "#ffccbc" : d < 0 ? "#bbdefb" : "#e3f2fd") : "#e3f2fd"}" opacity=".9"/>
    <rect x="80" y="138" width="168" height="14" rx="6" fill="#cfd8dc"/>${T(164, 380, "polystyrene cup · " + s.v + " mL water", { s: 12, c: "#455a64" })}
    <rect x="184" y="60" width="14" height="260" rx="7" fill="#fff" stroke="#78909c" stroke-width="2"/><rect x="188" y="${290 - Math.max(0, Math.min(60, Tn)) * 3.6}" width="6" height="${Math.max(0, Math.min(60, Tn)) * 3.6 + 26}" rx="3" fill="${d >= 0 ? "#e53935" : "#1e88e5"}"/><circle cx="191" cy="316" r="11" fill="${d >= 0 ? "#e53935" : "#1e88e5"}"/>
    ${[0, 20, 40, 60].map(t => `<line x1="198" y1="${290 - t * 3.6}" x2="206" y2="${290 - t * 3.6}" stroke="#455a64"/>${T(210, 294 - t * 3.6, t + "°", { a: "start", s: 10, c: "#455a64" })}`).join("")}
    ${show ? Array.from({ length: 6 }, (_, i) => `<text x="${120 + i * 14}" y="${d > 0 ? 130 : 330}" font-size="16">${d > 0 ? "♨" : "❄"}<animate attributeName="y" values="${d > 0 ? "140;100" : "300;330"}" dur="1.6s" begin="${i * 0.25}s" repeatCount="indefinite"/></text>`).join("") : ""}
    ${T(164, 410, `${RX[s.rx].n}: ${s.a} ${RX[s.rx].u}`, { s: 13, c: "#bf360c" })}`;
  // readout
  g += `<g transform="translate(290,40)"><rect width="230" height="260" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(115, 30, "TEMPERATURE", { s: 13, c: "#bf360c" })}
    ${T(115, 70, "start 20.0 °C", { s: 15, c: "#455a64" })}${T(115, 118, show ? Tend(s).toFixed(1) + " °C" : "?", { s: 32, c: show ? (d > 0 ? "#c62828" : "#1565c0") : "#bdbdbd" })}${T(115, 146, "end", { s: 12, c: "#90a4ae" })}
    ${T(115, 188, show ? "ΔT = " + (d > 0 ? "+" : "") + d.toFixed(1) + " °C" : "", { s: 18, c: "#37474f" })}${T(115, 226, show ? `energy ${d >= 0 ? "released" : "taken in"}: ${Math.abs(Q(s))} J` : "", { s: 13, c: "#37474f" })}${T(115, 248, show ? `(${s.v} g × 4.2 × ${Math.abs(d).toFixed(1)})` : "", { s: 11, c: "#90a4ae" })}</g>`;
  // energy level diagram
  const up = exo(s) ? 1 : -1, ry = 150, py = ry + up * 90;
  g += `<g transform="translate(540,40)"><rect width="300" height="260" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(150, 30, "ENERGY LEVEL DIAGRAM", { s: 13, c: "#bf360c" })}
    <line x1="40" y1="60" x2="40" y2="240" stroke="#607d8b" stroke-width="2"/><path d="M40,56 l-5,10 h10Z" fill="#607d8b"/>${T(26, 150, "energy", { s: 11, c: "#607d8b" })}
    ${show ? `<line x1="60" y1="${ry - 40}" x2="160" y2="${ry - 40}" stroke="#37474f" stroke-width="4"/>${T(110, ry - 50, "reactants", { s: 12, c: "#37474f" })}<line x1="180" y1="${py - 40}" x2="280" y2="${py - 40}" stroke="${exo(s) ? "#c62828" : "#1565c0"}" stroke-width="4"/>${T(230, py - 50, "products", { s: 12, c: "#37474f" })}
      <line x1="170" y1="${ry - 40}" x2="170" y2="${py - 46}" stroke="${exo(s) ? "#c62828" : "#1565c0"}" stroke-width="3"/><path d="M170,${py - 40} l-6,${-up * 10} h12Z" fill="${exo(s) ? "#c62828" : "#1565c0"}"/>${T(150, 240, exo(s) ? "EXOTHERMIC — energy given out" : "ENDOTHERMIC — energy taken in", { s: 13, c: exo(s) ? "#c62828" : "#1565c0" })}` : T(150, 150, "press ▶ to react", { s: 13, c: "#bdbdbd" })}</g>`;
  g += `<rect x="290" y="316" width="550" height="110" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(565, 348, "Exothermic: energy goes OUT to the surroundings → temperature rises", { s: 13, c: "#c62828" })}${T(565, 374, "Endothermic: energy is taken IN from the surroundings → temperature falls", { s: 13, c: "#1565c0" })}${T(565, 404, "Energy (J) = mass of water (g) × 4.2 × ΔT", { s: 13, c: "#455a64" })}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "rx", type: "select", label: "Reaction", options: Object.keys(RX).map(v => ({ v, label: RX[v].n })), lock: lk("rx") },
  { id: "a", type: "range", label: "Amount", min: 0.5, max: 5, step: 0.5, nudge: 0.5, unit: "g or M", hide: () => lv < 2, lock: lk("a") },
  { id: "v", type: "range", label: "Water", min: 25, max: 100, step: 25, nudge: 25, unit: "mL", hide: () => lv < 2, lock: lk("v") }]; };
const st = o => Object.assign({ rx: "neut", a: 4, v: 50 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${RX[s.rx].n}: ${s.a} ${RX[s.rx].u} in ${s.v} mL → ΔT ${dT(s) > 0 ? "+" : ""}${dT(s)} °C`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🌡️ Energy challenge", prompt: "Choose the reaction, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Exothermic reactions warm the water; endothermic reactions cool it. More substance → bigger change; more water → smaller change. Energy = mass of water × 4.2 × ΔT." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("th-sim", diff, uses, mk);
const C = {
  hotpack: () => simQ(1, "Make a <b>hot pack</b>: choose a reaction that <b>warms</b> the water and is used in hot packs.", st({ rx: "nh4no3" }), s => ok(s.rx === "cacl2", say(s) + " — exothermic.", exo(s) ? "It warms up, but which one is used in hot packs?" : say(s) + " — that cools down!"), { rx: "cacl2" }, { wrong: { rx: "citric" } }),
  coldpack: () => simQ(1, "Make the temperature fall <b>below 10 °C</b>.", st(), s => ok(Tend(s) < 10, say(s) + " — strongly endothermic.", say(s) + "."), { rx: "nh4no3" }, { wrong: { rx: "citric" } }),
  biggest: () => simQ(1, "Find the reaction with the <b>biggest temperature rise</b>.", st({ rx: "iron" }), s => ok(s.rx === "mg", say(s) + ".", say(s) + " — find a bigger one."), { rx: "mg" }, { wrong: { rx: "neut" } }),
  endo: () => simQ(1, "Find an <b>endothermic</b> reaction that is <b>not</b> used as a cold pack.", st(), s => ok(s.rx === "citric", "Citric acid + baking soda takes in heat (the fizz in sherbet feels cold).", say(s) + "."), { rx: "citric" }, { wrong: { rx: "nh4no3" } }),
  ten: () => simQ(2, "Calcium chloride in 50 mL: make the temperature rise by exactly <b>10 °C</b>.", st({ rx: "cacl2", a: 1 }), s => ok(dT(s) === 10, "2.5 g × 4 °C per g = 10 °C.", say(s) + "."), { a: 2.5 }, { lock: ["rx", "v"], wrong: { a: 2 } }),
  sixteen: () => simQ(2, "<b>2 g</b> of calcium chloride. Get a rise of <b>16 °C</b> by changing only the water.", st({ rx: "cacl2", a: 2, v: 100 }), s => ok(dT(s) === 16, "Half the water (25 mL) → double the temperature change.", say(s) + "."), { v: 25 }, { lock: ["rx", "a"], wrong: { v: 50 } }),
  five: () => simQ(2, "Ammonium nitrate in 50 mL: cool the water to exactly <b>5 °C</b>.", st({ rx: "nh4no3", a: 1 }), s => ok(Tend(s) === 5, "5 g × −3 °C = −15 °C → 5 °C.", say(s) + "."), { a: 5 }, { lock: ["rx", "v"], wrong: { a: 4 } }),
  neut: () => simQ(2, "Neutralisation in 50 mL: reach exactly <b>33.6 °C</b>.", st({ rx: "neut", a: 1 }), s => ok(Tend(s) === 33.6, "2 M acid and alkali: +13.6 °C.", say(s) + "."), { a: 2 }, { lock: ["rx", "v"], wrong: { a: 1.5 } }),
  q4200: () => simQ(3, "Calcium chloride: release exactly <b>4200 J</b> of energy.", st({ rx: "cacl2", a: 1, v: 50 }), s => ok(Q(s) === 4200, `${s.v} g × 4.2 × ${dT(s)} = ${Q(s)} J — the energy depends on the amount, not on the water!`, `${Q(s)} J.`), { a: 5 }, { lock: ["rx"], wrong: { a: 4 } }),
  q2520: () => simQ(3, "Ammonium nitrate: take in exactly <b>2520 J</b> from the water.", st({ rx: "nh4no3", a: 1 }), s => ok(Q(s) === -2520, `4 g takes in 2520 J.`, `${Math.abs(Q(s))} J taken in.`), { a: 4 }, { lock: ["rx"], wrong: { a: 3 } }),
  minus6: () => simQ(3, "Use <b>3 units</b> in 50 mL. Choose the reaction where products have <b>more</b> energy than reactants and ΔT is <b>−6 °C</b>.", st({ rx: "nh4no3", a: 3 }), s => ok(dT(s) === -6, "Citric acid + baking soda: 3 × −2 = −6 °C.", say(s) + "."), { rx: "citric" }, { lock: ["a", "v"], wrong: { rx: "nh4no3" } }),
  mg100: () => simQ(3, "Magnesium in <b>100 mL</b> of acid: make the temperature rise by <b>6 °C</b>.", st({ rx: "mg", a: 3, v: 100 }), s => ok(dT(s) === 6, "1.5 g × 8 ÷ 2 = 6 °C.", say(s) + "."), { a: 1.5 }, { lock: ["rx", "v"], wrong: { a: 3 } })
};
const D = {
  pick: diff => E.diaT("th-pick", diff, 2, () => { const want = choice(["exo", "endo"]);
    const dia = (x, isExo) => `<line x1="${x + 30}" y1="40" x2="${x + 30}" y2="230" stroke="#607d8b" stroke-width="2"/><line x1="${x + 50}" y1="${isExo ? 90 : 190}" x2="${x + 150}" y2="${isExo ? 90 : 190}" stroke="#37474f" stroke-width="4"/>${T(x + 100, isExo ? 80 : 180, "reactants", { s: 12, c: "#37474f" })}<line x1="${x + 170}" y1="${isExo ? 190 : 90}" x2="${x + 270}" y2="${isExo ? 190 : 90}" stroke="#37474f" stroke-width="4"/>${T(x + 220, isExo ? 180 : 80, "products", { s: 12, c: "#37474f" })}`;
    return { kind: "pick", title: "👆 Energy level diagrams", prompt: want === "exo" ? "Click the diagram for an <b>exothermic</b> reaction." : "Click the diagram for an <b>endothermic</b> reaction.", answer: [want], names: { exo: "diagram with products lower", endo: "diagram with products higher" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fff5ef"/>${[["endo", 40], ["exo", 450]].map(([k, x]) => `<g class="pk" data-k="${k}"><rect x="${x}" y="20" width="370" height="260" rx="14" fill="#fff" stroke="#ffccbc" stroke-width="2"/><rect x="${x}" y="20" width="370" height="260" rx="14" fill="none" ${E.ring(s2[k])}/>${dia(x + 20, k === "exo")}${T(x + 185, 262, "energy ↑", { s: 12, c: "#90a4ae" })}</g>`).join("")}</svg>`,
      explain: "Exothermic: products are LOWER than reactants (energy given out). Endothermic: products are HIGHER (energy taken in).", summary: "Energy level diagrams" }; }),
  num: diff => E.diaT("th-num", diff, 2, () => { const c = choice([[50, 6], [100, 4.5], [25, -8], [75, -2]]);
    return { kind: "num", title: "🧮 Energy change", prompt: `<b>${c[0]} g</b> of water changes temperature by <b>${c[1] > 0 ? "+" : ""}${c[1]} °C</b>.`, visual: render(st({ rx: c[1] > 0 ? "cacl2" : "nh4no3", a: 2, reveal: true })),
      fields: [{ label: "Energy transferred (size only)", unit: "J", answer: Math.round(c[0] * 4.2 * Math.abs(c[1])) }], explain: `${c[0]} × 4.2 × ${Math.abs(c[1])} = ${fmt(Math.round(c[0] * 4.2 * Math.abs(c[1])))} J (${c[1] > 0 ? "released — exothermic" : "taken in — endothermic"}).`, summary: "Q = m c ΔT" }; }),
  mcq: diff => E.diaT("th-mcq", diff, 2, () => { const q = choice([
      { ask: "A cold pack feels cold because the reaction…", ok: "takes in energy from your skin (endothermic)", bad: ["makes ice", "gives out cold particles", "is exothermic"], ex: "Endothermic reactions take energy from the surroundings." },
      { ask: "Which is an exothermic process?", ok: "Burning fuel", bad: ["Melting ice", "Dissolving ammonium nitrate", "Photosynthesis"], ex: "Combustion releases energy to the surroundings." },
      { ask: "Why do we use a polystyrene cup with a lid?", ok: "To reduce heat lost to the surroundings", bad: ["To speed up the reaction", "Because glass reacts", "To make the reaction exothermic"], ex: "Insulation keeps the energy in the water so ΔT is accurate." }]);
    return { kind: "mcq", title: "📘 Energy changes", prompt: "Think about energy transfer.", visual: render(st({ rx: "nh4no3", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Energy change concepts" }; })
};
const LEVELS = {
  1: { intro: "Some reactions warm the water (exothermic), others cool it (endothermic). Test them!", pool: () => [S(1, 1, C.hotpack), S(2, 1, C.coldpack), S(2, 1, C.endo), S(3, 1, C.biggest), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Control the amount of chemical and the volume of water to hit exact temperatures.", pool: () => [S(1, 1, C.ten), S(2, 1, C.five), S(2, 1, C.neut), S(3, 1, C.sixteen), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Calculate the energy transferred: Q = m × 4.2 × ΔT.", pool: () => [S(1, 1, C.q4200), S(2, 1, C.q2520), S(3, 1, C.minus6), S(3, 1, C.mg100), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a reaction and press ▶ to watch the thermometer and the energy level diagram.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ React",
  goals: () => [{ txt: "Make it warmer", test: (s, m) => m.h }, { txt: "Make it colder", test: (s, m) => m.c }, { txt: "Reach above 40 °C", test: (s, m) => m.x }],
  track: (s, m, ran) => { if (!ran) return; if (dT(s) > 0) m.h = 1; if (dT(s) < 0) m.c = 1; if (Tend(s) > 40) m.x = 1; },
  facts: () => "📘 <b>Exothermic</b> reactions give out energy (temperature rises). <b>Endothermic</b> reactions take in energy (temperature falls)."
});
E.start({ labId: "thermo", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌡️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔥", "❄️", "🌡️", "✨"],
  exploreDemo: () => [{ set: { rx: "mg" }, run: true }, { set: { rx: "nh4no3" }, run: true }] });
})();
