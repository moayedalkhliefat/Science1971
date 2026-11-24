"use strict";
// ===== Cell Respiration (yeast) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SUG = { glucose: { n: "Glucose", f: 1 }, sucrose: { n: "Sucrose", f: 0.8 }, starch: { n: "Starch", f: 0.05 }, none: { n: "No sugar", f: 0 } };
const fT = t => t > 50 ? 0 : t <= 35 ? Math.exp(-Math.pow((t - 35) / 16, 2)) : Math.exp(-Math.pow((t - 35) / 9, 2));
const rate = s => s.sugar === "none" || s.amt === 0 ? 0 : 6 * fT(s.T) * SUG[s.sugar].f * s.amt / (s.amt + 5);
const r2 = x => Math.round(x * 100) / 100;
const co2 = s => Math.round(Math.min(rate(s) * s.t, s.amt * 20 * (SUG[s.sugar].f > 0 ? 1 : 0)));
function render(s) {
  const show = s.reveal, R = rate(s), V = show ? co2(s) : 0, br = 14 + Math.min(40, Math.cbrt(V) * 7), dead = s.T > 50;
  let g = `<rect width="860" height="450" fill="#fffbea"/><rect y="360" width="860" height="90" fill="#efe3c3"/>`;
  // water bath + flask + balloon
  g += `<rect x="40" y="250" width="300" height="120" rx="12" fill="${s.T > 45 ? "#ffccbc" : s.T < 15 ? "#bbdefb" : "#b2ebf2"}" stroke="#78909c" stroke-width="2"/>${T(190, 390, "water bath " + s.T + " °C", { s: 14, c: "#37474f" })}
    <path d="M165,130 v60 l-55,110 q-8,22 18,22 h124 q26,0 18,-22 l-55,-110 v-60Z" fill="#fff8e1" stroke="#78909c" stroke-width="3"/>
    <path d="M122,276 q68,-14 136,0 l12,24 q4,22 -18,22 h-124 q-22,0 -18,-22Z" fill="${s.sugar === "none" ? "#fff3cd" : "#f3d98b"}"/>
    ${show && R > 0.05 ? Array.from({ length: 10 }, (_, i) => `<circle cx="${140 + (i * 37) % 100}" cy="${300 - (i * 23) % 60}" r="${2 + (i % 3)}" fill="#fff" opacity=".85"><animate attributeName="cy" values="${300 - (i * 23) % 60};190" dur="${(1.6 / Math.min(4, R)).toFixed(2)}s" repeatCount="indefinite"/></circle>`).join("") : ""}
    <rect x="160" y="118" width="40" height="16" rx="4" fill="#90a4ae"/><ellipse cx="180" cy="${118 - br}" rx="${br * 0.9}" ry="${br}" fill="#ef5350" opacity=".9" stroke="#c62828" stroke-width="2"/>
    ${T(180, 228, dead ? "yeast killed by heat" : "yeast + " + SUG[s.sugar].n.toLowerCase(), { s: 13, c: dead ? "#c62828" : "#5d4037" })}${T(180, 246, s.sugar === "none" ? "" : s.amt + " g sugar", { s: 12, c: "#6d4c41" })}`;
  // limewater
  const cloudy = show && V > 5;
  g += `<g transform="translate(380,150)"><path d="M0,0 v150 q0,24 24,24 q24,0 24,-24 v-150" fill="${cloudy ? "#eceff1" : "#e3f2fd"}" stroke="#78909c" stroke-width="3"/>${cloudy ? `<rect x="4" y="40" width="40" height="130" rx="18" fill="#cfd8dc"/>` : ""}${T(24, -12, "limewater", { s: 12, c: "#37474f" })}${T(24, 200, show ? (cloudy ? "milky = CO₂ ✔" : "clear") : "", { s: 12, c: "#37474f" })}</g>`;
  // results + graph
  const X0 = 500, Y0 = 300, W = 320, H = 200;
  let d = ""; for (let i = 0; i <= 30; i++) d += (i ? "L" : "M") + (X0 + W * i / 30).toFixed(1) + "," + (Y0 - H * Math.min(rate(s) * i, s.amt * 20) / 200).toFixed(1);
  g += `<rect x="470" y="30" width="370" height="320" rx="14" fill="#fff" stroke="#ffe082" stroke-width="2"/>${T(655, 54, "CO₂ COLLECTED (mL)", { s: 13, c: "#8d6e00" })}
    <line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>
    ${[0, 10, 20, 30].map(v => T(X0 + W * v / 30, Y0 + 18, v + " min", { s: 11, c: "#607d8b" })).join("")}${[0, 100, 200].map(v => T(X0 - 6, Y0 - H * v / 200 + 4, "" + v, { a: "end", s: 11, c: "#607d8b" })).join("")}
    ${show ? `<path d="${d}" fill="none" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="5 5"/><path d="${d.split("L").slice(0, s.t + 1).join("L")}" fill="none" stroke="#f57f17" stroke-width="4"/><circle cx="${X0 + W * s.t / 30}" cy="${Y0 - H * V / 200}" r="6" fill="#e53935"/>` : ""}
    ${T(655, 336, show ? `${s.t} min → ${V} mL CO₂ · rate ${fmt(r2(R))} mL/min` : "press ▶ to start", { s: 14, c: "#4e342e" })}`;
  g += T(430, 414, "glucose → ethanol + carbon dioxide (+ energy)   — anaerobic respiration in yeast", { s: 14, c: "#6d4c41" });
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "sugar", type: "choice", label: "Food for the yeast", options: Object.keys(SUG).map(v => ({ v, label: SUG[v].n })), lock: lk("sugar") },
  { id: "T", type: "range", label: "Temperature", min: 0, max: 70, step: 1, nudge: 1, unit: "°C", lock: lk("T") },
  { id: "amt", type: "range", label: "Sugar", min: 1, max: 20, step: 1, nudge: 1, unit: "g", hide: () => lv < 2, lock: lk("amt") },
  { id: "t", type: "range", label: "Time", min: 0, max: 30, step: 5, nudge: 5, unit: "min", hide: () => lv < 3, lock: lk("t") }]; };
const st = o => Object.assign({ sugar: "glucose", T: 20, amt: 10, t: 20 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${SUG[s.sugar].n}, ${s.T} °C: ${fmt(r2(rate(s)))} mL/min, ${co2(s)} mL in ${s.t} min`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🍞 Yeast challenge", prompt: "Set up the flask, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Yeast respires sugar and makes CO₂ (the balloon fills). It works best around 35 °C; above 50 °C it dies. Glucose is easiest to use; yeast can hardly use starch." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("rs-sim", diff, uses, mk);
const C = {
  fast: () => simQ(1, "Make the balloon fill <b>as fast as possible</b>.", st({ T: 10 }), s => ok(s.sugar === "glucose" && Math.abs(s.T - 35) <= 3, say(s) + " — warm, with glucose.", say(s) + "."), { sugar: "glucose", T: 35 }, { wrong: { sugar: "glucose", T: 20 } }),
  noSugar: () => simQ(1, "Show that yeast <b>needs food</b>: keep it warm but get <b>no CO₂</b>.", st({ T: 20 }), s => ok(s.sugar === "none" && fT(s.T) > 0.5, "No sugar → no respiration → no CO₂.", s.sugar !== "none" ? "Take the sugar away." : "Keep the yeast warm (alive) so only the sugar is missing."), { sugar: "none", T: 35 }, { wrong: { sugar: "starch", T: 35 } }),
  kill: () => simQ(1, "Use heat to <b>kill the yeast</b> so the balloon stays empty.", st({ T: 35 }), s => ok(s.T > 50 && s.sugar !== "none", "Above 50 °C the yeast's enzymes are denatured.", s.sugar === "none" ? "Keep the sugar — use heat." : say(s) + " — hotter!"), { T: 60 }, { wrong: { T: 45 } }),
  cold: () => simQ(1, "The yeast is alive but <b>very slow</b> (under 1 mL/min) because it is cold. Set it up.", st({ T: 35 }), s => ok(s.sugar === "glucose" && s.T < 35 && rate(s) < 1 && rate(s) > 0, say(s) + ".", say(s) + "."), { T: 5 }, { lock: ["sugar"], wrong: { T: 20 } }),
  bestSugar: () => simQ(2, "At 35 °C, choose the food that gives the <b>most CO₂</b>.", st({ T: 35, sugar: "starch" }), s => ok(s.sugar === "glucose", "Glucose is used directly in respiration.", say(s) + "."), { sugar: "glucose" }, { lock: ["T", "amt"], wrong: { sugar: "sucrose" } }),
  starch: () => simQ(2, "Show that yeast <b>can hardly use starch</b> (rate under 0.5 mL/min at 35 °C).", st({ T: 35 }), s => ok(s.sugar === "starch", say(s) + " — starch is too big a molecule for yeast to use quickly.", say(s) + "."), { sugar: "starch" }, { lock: ["T", "amt"], wrong: { sugar: "sucrose" } }),
  three: () => simQ(2, "With glucose at 35 °C, make <b>exactly 3 mL/min</b> by changing the sugar amount.", st({ T: 35, amt: 15 }), s => ok(Math.abs(rate(s) - 3) < 0.01, "5 g → 3 mL/min.", say(s) + "."), { amt: 5 }, { lock: ["sugar", "T"], wrong: { amt: 6 } }),
  sixty: () => simQ(2, "Collect at least <b>60 mL</b> of CO₂ in 20 minutes at 35 °C using the <b>least</b> glucose.", st({ T: 35, amt: 15 }), s => ok(co2(s) >= 60 && s.amt === 5, say(s) + ".", co2(s) < 60 ? say(s) + " — not enough." : "You can use less sugar."), { amt: 5 }, { lock: ["sugar", "T"], wrong: { amt: 4 } }),
  hundred: () => simQ(3, "10 g glucose at 35 °C makes 4 mL/min. Collect <b>exactly 100 mL</b>.", st({ T: 35, amt: 10, t: 5 }), s => ok(co2(s) === 100, "4 mL/min × 25 min = 100 mL.", say(s) + "."), { t: 25 }, { lock: ["sugar", "T", "amt"], wrong: { t: 20 } }),
  limit: () => simQ(3, "With only <b>2 g</b> glucose the balloon stops growing (20 mL per gram). Run long enough to reach the <b>limit</b>.", st({ T: 35, amt: 2, t: 5 }), s => ok(co2(s) === 40, "All 2 g used up → 40 mL, then it stops.", say(s) + " — not finished yet."), { t: 30 }, { lock: ["sugar", "T", "amt"], wrong: { t: 15 } }),
  ninety: () => simQ(3, "Get <b>at least 90 mL</b> in <b>30 min</b> at 35 °C using the <b>least</b> glucose.", st({ T: 35, amt: 15, t: 30 }), s => ok(co2(s) >= 90 && s.amt === 5, "5 g → 3 mL/min × 30 = 90 mL.", co2(s) < 90 ? say(s) + "." : "You can use less sugar."), { amt: 5 }, { lock: ["sugar", "T", "t"], wrong: { amt: 4 } }),
  cool25: () => simQ(3, "The room is <b>25 °C</b>. Collect at least <b>80 mL</b> in 30 minutes using the least glucose.", st({ T: 25, amt: 3, t: 30 }), s => ok(co2(s) >= 80 && s.amt === 10, "10 g at 25 °C → 81 mL.", co2(s) < 80 ? say(s) + "." : "You can use less sugar."), { amt: 10 }, { lock: ["sugar", "T", "t"], wrong: { amt: 9 } })
};
const D = {
  pick: diff => E.diaT("rs-pick", diff, 2, () => { const set = { a: st({ sugar: "glucose", T: 35 }), b: st({ sugar: "none", T: 35 }), c: st({ sugar: "glucose", T: 65 }), d: st({ sugar: "glucose", T: 5 }) }, want = choice(["a", "b", "c"]), order = E.shuffle(["a", "b", "c", "d"]);
    const q = { a: "Click the flask that makes the <b>most CO₂</b>.", b: "Click the flask with <b>no food</b> for the yeast.", c: "Click the flask where the yeast was <b>killed by heat</b>." }[want];
    return { kind: "pick", title: "👆 Compare the flasks", prompt: q, answer: [want], names: { a: "glucose 35 °C", b: "no sugar 35 °C", c: "glucose 65 °C", d: "glucose 5 °C" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fffbea"/>${order.map((k, i) => { const s = set[k], V = co2(Object.assign({}, s, { t: 20 })), br = 12 + Math.cbrt(V) * 7, x = 110 + i * 213; return `<g class="pk" data-k="${k}"><rect x="${x - 95}" y="15" width="190" height="270" rx="14" fill="#fff" stroke="#ffe082" stroke-width="2"/><rect x="${x - 95}" y="15" width="190" height="270" rx="14" fill="none" ${E.ring(s2[k])}/><path d="M${x - 12},110 v40 l-40,80 q-6,16 12,16 h80 q18,0 12,-16 l-40,-80 v-40Z" fill="#fff8e1" stroke="#78909c" stroke-width="2"/><ellipse cx="${x}" cy="${104 - br}" rx="${br * .9}" ry="${br}" fill="#ef5350" stroke="#c62828"/>${T(x, 266, (s.sugar === "none" ? "no sugar" : "glucose") + " · " + s.T + " °C", { s: 13, c: "#4e342e" })}</g>`; }).join("")}</svg>`,
      explain: "Most CO₂: glucose at a warm 35 °C. No sugar → no respiration. At 65 °C the yeast is dead; at 5 °C it is alive but very slow.", summary: "Compare yeast flasks" }; }),
  num: diff => E.diaT("rs-num", diff, 2, () => { const c = choice([[48, 12, 20], [30, 10, 25], [36, 9, 15], [50, 20, 30]]);
    return { kind: "num", title: "🧮 Rate of respiration", prompt: `Yeast made <b>${c[0]} mL</b> of CO₂ in <b>${c[1]} min</b>.`, visual: render(st({ T: 35, reveal: true })),
      fields: [{ label: "Rate", unit: "mL/min", answer: c[0] / c[1] }, { label: `CO₂ after ${c[2]} min at the same rate`, unit: "mL", answer: c[0] / c[1] * c[2] }], explain: `${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} mL/min; × ${c[2]} = ${fmt(c[0] / c[1] * c[2])} mL.`, summary: "Respiration rate calculation" }; }),
  mcq: diff => E.diaT("rs-mcq", diff, 2, () => { const q = choice([
      { ask: "What are the products when yeast respires WITHOUT oxygen?", ok: "Ethanol and carbon dioxide", bad: ["Oxygen and water", "Glucose and oxygen", "Lactic acid only"], ex: "Anaerobic respiration in yeast: glucose → ethanol + CO₂." },
      { ask: "How can you test the gas in the balloon is carbon dioxide?", ok: "It turns limewater milky", bad: ["It relights a glowing splint", "It pops with a squeaky sound", "It turns blue litmus red only"], ex: "CO₂ turns limewater cloudy (milky)." },
      { ask: "Why do bakers put dough in a warm place?", ok: "Yeast respires faster, making more CO₂ to rise the bread", bad: ["To kill the yeast", "To make the dough lose water", "Because yeast makes oxygen"], ex: "Warmth speeds up the yeast's enzymes." }]);
    return { kind: "mcq", title: "📘 Respiration ideas", prompt: "Think about yeast respiration.", visual: render(st({ T: 35, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Respiration concepts" }; })
};
const LEVELS = {
  1: { intro: "Yeast respires sugar and releases carbon dioxide that fills the balloon. Change the temperature and the food.", pool: () => [S(1, 1, C.fast), S(2, 1, C.noSugar), S(2, 1, C.cold), S(3, 1, C.kill), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Different sugars and amounts change the rate. Measure the CO₂ per minute.", pool: () => [S(1, 1, C.bestSugar), S(2, 1, C.starch), S(2, 1, C.three), S(3, 1, C.sixty), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Plan the experiment: time, sugar amount and temperature. When the sugar runs out, respiration stops.", pool: () => [S(1, 1, C.hundred), S(2, 1, C.limit), S(3, 1, C.ninety), S(3, 1, C.cool25), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Feed the yeast and change the temperature, then press ▶ to watch the balloon and the limewater.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Start",
  goals: () => [{ txt: "Fill the balloon quickly", test: (s, m) => m.fast }, { txt: "Get no CO₂ at all", test: (s, m) => m.none }, { txt: "Turn the limewater milky", test: (s, m) => m.milk }],
  track: (s, m, ran) => { if (!ran) return; if (rate(s) >= 3) m.fast = 1; if (co2(s) === 0) m.none = 1; if (co2(s) > 5) m.milk = 1; },
  facts: () => "📘 <b>Respiration</b> releases energy from food in every living cell. Yeast can respire <b>without oxygen</b>: glucose → ethanol + carbon dioxide."
});
E.start({ labId: "respiration", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🍞", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🍞", "🎈", "🫧", "✨"],
  exploreDemo: () => [{ set: { T: 35 }, run: true }, { set: { sugar: "none" }, run: true }] });
})();
