"use strict";
// ===== Energy Forms & Changes — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SRC = { sun: { n: "Sun", i: "☀️", out: "light" }, tap: { n: "Running water", i: "🚰", out: "kinetic" }, bike: { n: "Cyclist", i: "🚴", out: "kinetic" } };
const CONV = { solar: { n: "Solar panel", i: "🔲", in: "light", eff: 0.2 }, gen: { n: "Generator", i: "⚙️", in: "kinetic", eff: 0.6 } };
const USE = { bulb: { n: "Filament bulb", i: "💡", out: "light", eff: 0.1 }, led: { n: "LED lamp", i: "🔆", out: "light", eff: 0.4 }, heater: { n: "Water heater", i: "♨️", out: "thermal", eff: 0.9 } };
const COL = { light: "#fbc02d", kinetic: "#43a047", electrical: "#1e88e5", thermal: "#e53935", chemical: "#8e24aa" };
const works = s => SRC[s.src].out === CONV[s.conv].in;
const elec = s => works(s) ? s.P * CONV[s.conv].eff : 0;
const useful = s => Math.round(elec(s) * USE[s.user].eff * 100) / 100;
const wasted = s => Math.round((s.P - useful(s)) * 100) / 100;
const effT = s => Math.round(useful(s) / s.P * 1000) / 10;
const r2 = x => Math.round(x * 100) / 100;
function block(x, y, item, sub, col) { return `<g transform="translate(${x},${y})"><rect x="-70" y="-60" width="140" height="120" rx="16" fill="#fff" stroke="${col}" stroke-width="3"/><text x="0" y="8" text-anchor="middle" font-size="44">${item.i}</text>${T(0, 44, item.n, { s: 13, c: "#37474f" })}${sub ? T(0, -42, sub, { s: 11, c: "#78909c" }) : ""}</g>`; }
function flow(x1, x2, y, kind, w, on) { return `<line x1="${x1}" y1="${y}" x2="${x2 - 14}" y2="${y}" stroke="${on ? COL[kind] : "#cfd8dc"}" stroke-width="${Math.max(3, w)}"/><polygon points="${x2},${y} ${x2 - 16},${y - 12} ${x2 - 16},${y + 12}" fill="${on ? COL[kind] : "#cfd8dc"}"/>${T((x1 + x2) / 2, y - 12 - Math.max(3, w) / 2, kind, { s: 12, c: on ? COL[kind] : "#90a4ae" })}`; }
function render(s) {
  const show = s.reveal || s.showVals, ok_ = works(s), y = 150, on = ok_ && (show || s.on);
  let g = block(110, y, SRC[s.src], s.P + " J/s in", "#8d6e63") + block(390, y, CONV[s.conv], ok_ ? "" : "✗ wrong input", ok_ ? "#1e88e5" : "#c62828") + block(670, y, USE[s.user], "", "#43a047");
  g += flow(180, 320, y, SRC[s.src].out, show ? s.P / 10 : 6, true) + flow(460, 600, y, "electrical", show ? elec(s) / 10 : 6, on);
  // waste arrows
  if (show && ok_) { g += `<path d="M390,210 L390,270" stroke="#e57373" stroke-width="${Math.max(2, (s.P - elec(s)) / 10)}" stroke-dasharray="6 4"/>${T(396, 262, "wasted " + r2(s.P - elec(s)) + " J/s (heat)", { a: "start", s: 12, c: "#c62828" })}<path d="M670,210 L670,270" stroke="#e57373" stroke-width="${Math.max(2, (elec(s) - useful(s)) / 10)}" stroke-dasharray="6 4"/>${T(676, 262, "wasted " + r2(elec(s) - useful(s)) + " J/s", { a: "start", s: 12, c: "#c62828" })}`; }
  // output scene
  const out = USE[s.user].out, u = show ? useful(s) : 0;
  if (out === "light") g += `<g transform="translate(670,330)">${u > 0 ? `<circle r="${20 + u}" fill="#fff59d" opacity="${Math.min(0.9, 0.2 + u / 40)}"/>` : ""}<circle r="22" fill="${u > 0 ? "#ffee58" : "#eceff1"}" stroke="#455a64" stroke-width="3"/>${T(0, 60, show ? "useful light: " + r2(u) + " J/s" : "", { s: 13, c: "#f57f17" })}</g>`;
  else { const temp = Math.min(100, 20 + u * 1.2); g += `<g transform="translate(670,330)"><path d="M-50,-40 L-50,40 Q-50,50 -40,50 L40,50 Q50,50 50,40 L50,-40" fill="#e1f5fe" stroke="#5c6bc0" stroke-width="3"/><rect x="-47" y="-10" width="94" height="57" fill="${u ? `hsl(${Math.round(210 - 190 * (temp - 20) / 80)},80%,70%)` : "#b3e5fc"}"/>${temp >= 100 && show ? T(0, -50, "♨ BOILING", { s: 14, c: "#c62828" }) : ""}${T(0, 72, show ? "useful heat: " + r2(u) + " J/s · " + Math.round(temp) + " °C" : "", { s: 13, c: "#c62828" })}</g>`; }
  g += `<g transform="translate(40,300)"><rect width="300" height="${show ? 130 : 70}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(150, 28, "ENERGY FLOW (per second)", { s: 12, c: "#0d47a1" })}${show ? (ok_ ? T(150, 56, `in ${s.P} → electrical ${r2(elec(s))} → useful ${r2(useful(s))} J/s`, { s: 13, c: "#37474f" }) + T(150, 84, "total wasted: " + wasted(s) + " J/s", { s: 13, c: "#c62828" }) + T(150, 112, "overall efficiency: " + effT(s) + "%", { s: 15, c: "#2e7d32" }) : T(150, 66, "✗ the " + CONV[s.conv].n.toLowerCase() + " needs " + CONV[s.conv].in + " energy", { s: 14, c: "#c62828" })) : T(150, 54, "press ▶ to run the system", { s: 13, c: "#78909c" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f4f8fc"/>${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "src", type: "choice", label: "Energy source", options: Object.keys(SRC).map(v => ({ v, label: SRC[v].i + " " + SRC[v].n })), wide: true, lock: lk("src") },
  { id: "conv", type: "choice", label: "Converter", options: Object.keys(CONV).map(v => ({ v, label: CONV[v].i + " " + CONV[v].n })), lock: lk("conv") },
  { id: "user", type: "choice", label: "User", options: Object.keys(USE).map(v => ({ v, label: USE[v].i + " " + USE[v].n })), lock: lk("user") },
  { id: "P", type: "range", label: "Input power", min: 50, max: 200, step: 25, nudge: 25, unit: "J/s", hide: () => lv < 3, lock: lk("P") }]; };
const st = o => Object.assign({ src: "sun", conv: "gen", user: "bulb", P: 100 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const chain = s => `${SRC[s.src].n} → ${CONV[s.conv].n} → ${USE[s.user].n}`;
const say = s => works(s) ? `${chain(s)}: ${r2(useful(s))} J/s useful` : `The ${CONV[s.conv].n.toLowerCase()} cannot use ${SRC[s.src].out} energy`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔋 Energy chain challenge", prompt: "Build the energy chain, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "A solar panel needs LIGHT; a generator needs KINETIC (movement) energy. Efficiencies: solar 20%, generator 60%, filament bulb 10%, LED 40%, heater 90%." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ef-sim", diff, uses, mk);
const C = {
  boil: () => simQ(1, "Build a chain that <b>heats the water</b> using <b>running water</b> as the source.", st(), s => ok(works(s) && s.src === "tap" && s.user === "heater", "Kinetic → electrical → thermal energy.", works(s) ? `That is ${chain(s)}.` : say(s) + "."), { src: "tap", conv: "gen", user: "heater" }, { wrong: { src: "tap", conv: "solar", user: "heater" } }),
  sun: () => simQ(1, "Light a lamp using <b>the Sun</b>.", st({ src: "sun", conv: "gen" }), s => ok(works(s) && s.src === "sun" && USE[s.user].out === "light", "Light → electrical → light energy.", say(s) + "."), { conv: "solar", user: "led" }, { lock: ["src"], wrong: { conv: "gen", user: "led" } }),
  night: () => simQ(1, "It is <b>night</b> (no Sun). Make <b>light</b> anyway.", st({ src: "sun", conv: "solar" }), s => ok(works(s) && s.src !== "sun" && USE[s.user].out === "light", chain(s) + " works without sunlight.", s.src === "sun" ? "There is no Sun at night." : say(s) + "."), { src: "bike", conv: "gen", user: "led" }, { wrong: { src: "sun", conv: "solar", user: "led" } }),
  bike: () => simQ(1, "Use the <b>cyclist</b> to warm the water.", st({ src: "bike" }), s => ok(works(s) && s.user === "heater", "The cyclist's movement (kinetic) turns the generator.", say(s) + "."), { conv: "gen", user: "heater" }, { lock: ["src"], wrong: { conv: "solar", user: "heater" } }),
  heat50: () => simQ(2, "Deliver <b>at least 50 J/s</b> of heat to the water (100 J/s input).", st({ user: "heater" }), s => ok(s.user === "heater" && useful(s) >= 50, `${chain(s)}: 100 × 0.6 × 0.9 = 54 J/s.`, say(s) + "."), { src: "tap", conv: "gen" }, { lock: ["user"], wrong: { src: "sun", conv: "solar" } }),
  led24: () => simQ(2, "Make exactly <b>24 J/s</b> of useful light.", st(), s => ok(useful(s) === 24, "100 × 0.6 (generator) × 0.4 (LED) = 24 J/s.", say(s) + "."), { src: "tap", conv: "gen", user: "led" }, { wrong: { src: "tap", conv: "gen", user: "bulb" } }),
  worst: () => simQ(2, "Build a <b>working</b> chain that makes light with the <b>lowest</b> efficiency.", st({ src: "sun", conv: "solar", user: "led" }), s => ok(works(s) && USE[s.user].out === "light" && effT(s) === 2, "Solar (20%) × filament bulb (10%) = only 2%!", works(s) ? `Efficiency ${effT(s)}% — a worse chain exists.` : say(s) + "."), { src: "sun", conv: "solar", user: "bulb" }, { wrong: { src: "sun", conv: "solar", user: "led" } }),
  sunHeat: () => simQ(2, "Use <b>the Sun</b> to heat water. How much heat reaches it?", st({ src: "sun", user: "heater" }), s => ok(works(s) && useful(s) === 18, "100 × 0.2 × 0.9 = 18 J/s.", say(s) + "."), { conv: "solar" }, { lock: ["src", "user"], wrong: { conv: "gen" } }),
  p36: () => simQ(3, "With the <b>LED</b> and a <b>generator</b>, make exactly <b>36 J/s</b> of light.", st({ src: "tap", conv: "gen", user: "led" }), s => ok(useful(s) === 36, "P × 0.6 × 0.4 = 36 → P = 150 J/s.", say(s) + "."), { P: 150 }, { lock: ["src", "conv", "user"], wrong: { P: 125 } }),
  waste: () => simQ(3, "Heat the water with <b>less than 50 J/s wasted</b>.", st({ user: "heater", P: 200 }), s => ok(s.user === "heater" && works(s) && wasted(s) < 50, `Wasted ${wasted(s)} J/s.`, works(s) ? `Wasted ${wasted(s)} J/s.` : say(s) + "."), { src: "tap", conv: "gen", P: 75 }, { lock: ["user"], wrong: { src: "tap", conv: "gen", P: 125 } }),
  solar9: () => simQ(3, "Use the <b>Sun</b> and an <b>LED</b>. Choose the sunlight power to get <b>12 J/s</b> of light.", st({ src: "sun", conv: "solar", user: "led" }), s => ok(useful(s) === 12, "P × 0.2 × 0.4 = 12 → P = 150 J/s.", say(s) + "."), { P: 150 }, { lock: ["src", "conv", "user"], wrong: { P: 200 } })
};
C.match = () => simQ(3, "A <b>filament bulb</b> on a generator: make exactly <b>9 J/s</b> of light.", st({ src: "tap", conv: "gen", user: "bulb", P: 100 }), s => ok(useful(s) === 9, "P × 0.6 × 0.1 = 9 → P = 150 J/s. The LED would give 36 J/s from the same input!", say(s) + "."), { P: 150 }, { lock: ["src", "conv", "user"], wrong: { P: 100 } });

// ---------- diagram tasks ----------
const D = {
  pick: diff => E.diaT("ef-pick", diff, 1, () => { const sets = { a: st({ src: "sun", conv: "solar", user: "led" }), b: st({ src: "sun", conv: "gen", user: "led" }), c: st({ src: "tap", conv: "solar", user: "heater" }) }, order = E.shuffle(["a", "b", "c"]);
    return { kind: "pick", title: "👆 Which chain works?", prompt: "Only one of these energy chains can work. Click it.", answer: ["a"], names: { a: "Sun → solar panel → LED", b: "Sun → generator → LED", c: "Water → solar panel → heater" },
      visual: st2 => `<svg viewBox="0 0 860 330" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="330" fill="#f4f8fc"/>${order.map((k, i) => { const s = sets[k], y = 55 + i * 105; return `<g class="pk" data-k="${k}"><rect x="30" y="${y - 45}" width="800" height="92" rx="14" fill="#fff" stroke="#90caf9" stroke-width="2"/><rect x="30" y="${y - 45}" width="800" height="92" rx="14" fill="none" ${E.ring(st2[k])}/>${[SRC[s.src], CONV[s.conv], USE[s.user]].map((it, j) => `<text x="${130 + j * 290}" y="${y + 14}" text-anchor="middle" font-size="36">${it.i}</text>${T(130 + j * 290, y + 36, it.n, { s: 12, c: "#37474f" })}`).join("")}<text x="${275}" y="${y + 10}" text-anchor="middle" font-size="26">➡</text><text x="${565}" y="${y + 10}" text-anchor="middle" font-size="26">➡</text></g>`; }).join("")}</svg>`,
      explain: "A solar panel needs light, a generator needs movement. Only Sun → solar panel → LED matches.", summary: "Matching energy transfers" }; }),
  effNum: diff => E.diaT("ef-num", diff, 2, () => { const c = choice([[200, 50], [80, 20], [500, 400], [60, 45]]);
    return { kind: "num", title: "🧮 Efficiency", prompt: `A device takes in ${c[0]} J and gives out ${c[1]} J of useful energy.`, visual: render(st({ src: "tap", conv: "gen", user: "led", showVals: true })),
      fields: [{ label: "Wasted energy", unit: "J", answer: c[0] - c[1] }, { label: "Efficiency", unit: "%", answer: c[1] / c[0] * 100, tol: 0.06 }], explain: `Wasted = ${c[0]} − ${c[1]} = ${c[0] - c[1]} J. Efficiency = ${c[1]} ÷ ${c[0]} × 100 = ${fmt(c[1] / c[0] * 100)}%.`, summary: "Efficiency calculation" }; }),
  chainNum: diff => E.diaT("ef-num", diff, 3, () => { const s = choice([st({ src: "tap", conv: "gen", user: "heater", P: 150 }), st({ src: "sun", conv: "solar", user: "led", P: 200 }), st({ src: "bike", conv: "gen", user: "bulb", P: 200 })]);
    return { kind: "num", title: "⚡ Follow the energy", prompt: `${chain(s)}, with ${s.P} J/s going in.`, visual: render(Object.assign({}, s, { showVals: false, on: true })),
      fields: [{ label: "Electrical energy per second", unit: "J/s", answer: elec(s), tol: 0.06 }, { label: "Useful output per second", unit: "J/s", answer: useful(s), tol: 0.06 }], explain: `${s.P} × ${CONV[s.conv].eff} = ${r2(elec(s))} J/s; × ${USE[s.user].eff} = ${r2(useful(s))} J/s.`, summary: "Energy chain calculation" }; }),
  mcq: diff => E.diaT("ef-mcq", diff, 2, () => { const q = choice([
      { ask: "Where does most of the 'wasted' energy go?", ok: "It spreads into the surroundings as heat", bad: ["It is destroyed", "It turns back into light", "It is stored in the wires"], ex: "Energy is never destroyed; wasted energy usually heats the surroundings." },
      { ask: "Why is an LED better than a filament bulb?", ok: "It turns more of the electrical energy into light", bad: ["It uses no electricity", "It makes more heat", "It is always brighter"], ex: "LED ~40% efficient vs filament ~10%: less is wasted as heat." },
      { ask: "Which energy change happens in a solar panel?", ok: "Light → electrical", bad: ["Electrical → light", "Kinetic → electrical", "Thermal → chemical"], ex: "Solar cells transfer light energy into electrical energy." }]);
    return { kind: "mcq", title: "📘 Energy changes", prompt: "Look at the energy chain.", visual: render(st({ src: "sun", conv: "solar", user: "bulb", showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Energy transfer ideas" }; })
};
const LEVELS = {
  1: { intro: "Build energy chains: a source, a converter and a user. The energy types must match!", pool: () => [S(1, 1, C.bike), S(2, 1, C.boil), S(2, 1, C.sun), S(3, 1, C.night), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Every step wastes some energy. Follow the joules per second through the chain.", pool: () => [S(1, 1, C.sunHeat), S(2, 1, C.heat50), S(2, 1, C.led24), S(3, 1, C.worst), D.pick(1), D.effNum(2), D.chainNum(3)] },
  3: { intro: "Change the input power and plan exact outputs. How efficient is the whole chain?", pool: () => [S(1, 1, C.match), S(2, 1, C.p36), S(3, 1, C.solar9), S(3, 1, C.waste), D.effNum(1), D.chainNum(2), D.chainNum(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a source, a converter and a user, then press ▶ to see the energy flow.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Run",
  goals: () => [{ txt: "Make a chain that does NOT work", test: (s, m) => m.bad }, { txt: "Make light", test: (s, m) => m.light }, { txt: "Heat the water", test: (s, m) => m.heat }],
  track: (s, m, ran) => { if (!ran) return; if (!works(s)) m.bad = 1; else if (USE[s.user].out === "light") m.light = 1; else m.heat = 1; },
  facts: () => "📘 Energy is <b>transferred</b> from one store/form to another — never created or destroyed. Some is always <b>wasted</b>, usually as heat."
});
E.start({ labId: "eforms", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔋", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔋", "☀️", "💡", "✨"],
  exploreDemo: () => [{ set: { src: "sun", conv: "gen" }, run: true }, { set: { conv: "solar", user: "led" }, run: true }, { set: { src: "tap", conv: "gen", user: "heater" }, run: true }] });
})();
