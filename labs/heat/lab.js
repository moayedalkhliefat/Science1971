"use strict";
// ===== Heat Transfer — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const CUP = { metal: { n: "Metal mug", k: 0.06, c: "#b0bec5" }, glass: { n: "Glass", k: 0.04, c: "#e1f5fe" }, foam: { n: "Polystyrene foam", k: 0.015, c: "#fafafa" } };
const WRAP = { none: { n: "Nothing", f: 1 }, foil: { n: "Shiny foil", f: 0.8 }, wool: { n: "Wool", f: 0.6 } };
const r1 = x => Math.round(x * 10) / 10;
const k = s => CUP[s.cup].k * (s.lid ? 0.7 : 1) * WRAP[s.wrap].f;
const temp = (s, t) => r1(20 + 70 * Math.exp(-k(s) * t));
const heatT = s => r1(20 + s.P * s.ts / (s.m * 4.2));
function render(s) {
  const show = s.reveal;
  let g = `<rect width="860" height="450" fill="#fff4ef"/>`;
  if (s.mode === "heat") {
    const Tn = show ? Math.min(100, heatT(s)) : 20, lvl = 300 - s.m * 0.12;
    g += `<rect x="20" y="20" width="360" height="410" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(200, 46, "ELECTRIC HEATER " + s.P + " W", { s: 13, c: "#bf360c" })}
      <path d="M110,140 v190 q0,14 14,14 h152 q14,0 14,-14 v-190" fill="#ffffffcc" stroke="#78909c" stroke-width="3"/><rect x="113" y="${lvl}" width="174" height="${344 - lvl - 2}" rx="6" fill="hsl(${Math.round(210 - Tn * 2)},70%,75%)"/>
      <rect x="150" y="120" width="12" height="200" rx="4" fill="#546e7a"/><path d="M156,320 c-20,0 -20,-14 0,-14 c20,0 20,-14 0,-14 c-20,0 -20,-14 0,-14" fill="none" stroke="${show ? "#ff5722" : "#90a4ae"}" stroke-width="5"/>
      <rect x="240" y="80" width="12" height="230" rx="6" fill="#fff" stroke="#78909c"/><rect x="243" y="${300 - Tn * 2.1}" width="6" height="${Tn * 2.1 + 6}" rx="3" fill="#e53935"/>
      ${T(200, 372, `${s.m} g of water`, { s: 14, c: "#37474f" })}${T(200, 400, show ? `${s.ts} s → ${r1(Math.min(100, heatT(s)))} °C${heatT(s) >= 100 ? " (boiling!)" : ""}` : "press ▶ to switch on", { s: 15, c: "#bf360c" })}`;
    const X0 = 430, Y0 = 380, W = 380, H = 290; let d = ""; for (let i = 0; i <= 60; i++) { const ts = 600 * i / 60, Tt = Math.min(100, 20 + s.P * ts / (s.m * 4.2)); d += (i ? "L" : "M") + (X0 + W * i / 60).toFixed(1) + "," + (Y0 - H * Tt / 100).toFixed(1); }
    g += `<rect x="400" y="20" width="440" height="410" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(620, 46, "TEMPERATURE vs TIME", { s: 13, c: "#bf360c" })}<line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>
      ${[0, 50, 100].map(v => T(X0 - 6, Y0 - H * v / 100 + 4, v + "°", { a: "end", s: 11, c: "#607d8b" })).join("")}${[0, 300, 600].map(v => T(X0 + W * v / 600, Y0 + 18, v + " s", { s: 11, c: "#607d8b" })).join("")}
      ${show ? `<path d="${d}" fill="none" stroke="#ff7043" stroke-width="3"/><circle cx="${X0 + W * s.ts / 600}" cy="${Y0 - H * Math.min(100, heatT(s)) / 100}" r="6" fill="#1565c0"/>` : ""}${T(620, 414, "energy = mass × 4.2 × ΔT   ·   energy = power × time", { s: 12, c: "#6d4c41" })}`;
    return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
  }
  const Tn = show ? temp(s, s.t) : 90, c = CUP[s.cup];
  g += `<rect x="20" y="20" width="370" height="410" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(205, 46, "HOT TEA (starts at 90 °C, room 20 °C)", { s: 13, c: "#bf360c" })}
    <path d="M110,140 l12,190 q2,16 18,16 h110 q16,0 18,-16 l12,-190Z" fill="${c.c}" stroke="#78909c" stroke-width="3"/>${s.wrap === "wool" ? `<path d="M108,180 l10,150 q2,16 18,16 h118 q16,0 18,-16 l10,-150Z" fill="#d7ccc8" opacity=".9"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${116 + i * 21},190 q6,70 0,140" stroke="#a1887f" stroke-width="3" fill="none"/>`).join("")}` : s.wrap === "foil" ? `<path d="M108,180 l10,150 q2,16 18,16 h118 q16,0 18,-16 l10,-150Z" fill="url(#foil)"/>` : ""}
    <path d="M118,160 l10,160 h134 l10,-160Z" fill="hsl(${Math.round(30 - (Tn - 20) * 0.1)},60%,${Math.round(55 + (90 - Tn) * 0.2)}%)" opacity="${s.wrap === "none" ? 0.9 : 0.25}"/>
    ${s.lid ? `<rect x="100" y="126" width="190" height="16" rx="6" fill="#8d6e63"/>` : show && Tn > 40 ? Array.from({ length: 4 }, (_, i) => `<path d="M${150 + i * 28},120 q10,-15 0,-30 q-10,-15 0,-30" stroke="#cfd8dc" stroke-width="4" fill="none" opacity="${(Tn - 20) / 70}"/>`).join("") : ""}
    <defs><linearGradient id="foil" x1="0" x2="1"><stop offset="0" stop-color="#eceff1"/><stop offset=".5" stop-color="#b0bec5"/><stop offset="1" stop-color="#eceff1"/></linearGradient></defs>
    ${show ? `<g opacity=".85">${[["conduction", 70, 250, k(s) / 0.06], ["convection", 205, 76, s.lid ? 0.3 : 1], ["radiation", 335, 250, s.wrap === "foil" ? 0.3 : 1]].map(([n, x, y, w]) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${12 + w * 10}" fill="#e64a19">${n === "convection" ? "⬆" : n === "conduction" ? "⬅" : "➡"}</text>${T(x, y + 22, n, { s: 11, c: "#bf360c" })}`).join("")}</g>` : ""}
    ${T(205, 376, `${c.n} · ${s.lid ? "lid on" : "no lid"} · ${WRAP[s.wrap].n.toLowerCase()}`, { s: 13, c: "#37474f" })}${T(205, 406, show ? `after ${s.t} min: ${Tn.toFixed(1)} °C` : "press ▶ to wait", { s: 17, c: "#bf360c" })}`;
  const X0 = 430, Y0 = 380, W = 380, H = 290; let d = ""; for (let i = 0; i <= 60; i++) { const t = 30 * i / 60; d += (i ? "L" : "M") + (X0 + W * i / 60).toFixed(1) + "," + (Y0 - H * temp(s, t) / 100).toFixed(1); }
  g += `<rect x="400" y="20" width="440" height="410" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(620, 46, "COOLING CURVE", { s: 13, c: "#bf360c" })}<line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>
    ${[0, 50, 100].map(v => T(X0 - 6, Y0 - H * v / 100 + 4, v + "°", { a: "end", s: 11, c: "#607d8b" })).join("")}${[0, 10, 20, 30].map(v => T(X0 + W * v / 30, Y0 + 18, v + " min", { s: 11, c: "#607d8b" })).join("")}
    <line x1="${X0}" y1="${Y0 - H * 0.2}" x2="${X0 + W}" y2="${Y0 - H * 0.2}" stroke="#cfd8dc" stroke-dasharray="4 5"/>${T(X0 + W - 4, Y0 - H * 0.2 - 6, "room 20 °C", { a: "end", s: 10, c: "#90a4ae" })}
    ${show ? `<path d="${d}" fill="none" stroke="#ff7043" stroke-width="3"/><circle cx="${X0 + W * s.t / 30}" cy="${Y0 - H * Tn / 100}" r="6" fill="#1565c0"/>` : ""}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "cup", type: "choice", label: "Cup", options: Object.keys(CUP).map(v => ({ v, label: CUP[v].n })), hide: s => s.mode === "heat", lock: lk("cup") },
  { id: "lid", type: "toggle", label: "Put a lid on", hide: s => s.mode === "heat", lock: lk("lid") },
  { id: "wrap", type: "choice", label: "Wrap the cup in", options: Object.keys(WRAP).map(v => ({ v, label: WRAP[v].n })), hide: s => s.mode === "heat", lock: lk("wrap") },
  { id: "t", type: "range", label: "Time", min: 0, max: 30, step: 5, nudge: 5, unit: "min", hide: s => s.mode === "heat" || lv < 2, lock: lk("t") },
  { id: "P", type: "range", label: "Heater power", min: 50, max: 1000, step: 10, nudge: 10, unit: "W", hide: s => s.mode !== "heat", lock: lk("P") },
  { id: "ts", type: "range", label: "Heating time", min: 0, max: 600, step: 10, nudge: 10, unit: "s", hide: s => s.mode !== "heat", lock: lk("ts") },
  { id: "m", type: "range", label: "Mass of water", min: 100, max: 1000, step: 100, nudge: 100, unit: "g", hide: s => s.mode !== "heat", lock: lk("m") }]; };
const st = o => Object.assign({ mode: "cool", cup: "glass", lid: false, wrap: "none", t: 10, P: 200, ts: 60, m: 500 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${CUP[s.cup].n}, ${s.lid ? "lid" : "no lid"}, ${WRAP[s.wrap].n.toLowerCase()}: ${temp(s, s.t)} °C after ${s.t} min`;
const hsay = s => `${s.P} W × ${s.ts} s on ${s.m} g → ${r1(heatT(s))} °C`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "heat" ? "⚡ Heating challenge" : "☕ Keep-warm challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: s0.mode === "heat" ? "Energy = power × time = mass × 4.2 × temperature rise. So ΔT = P × t ÷ (m × 4.2)." : "Insulators (foam, wool) slow conduction; a lid stops convection and evaporation; shiny foil reflects radiation. Metal conducts heat away fastest." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ht2-sim", diff, uses, mk);
const C = {
  hottest: () => simQ(1, "Keep the tea as <b>hot as possible</b> after 10 minutes.", st(), s => ok(s.cup === "foam" && s.lid && s.wrap === "wool", say(s) + " — every kind of heat loss is slowed.", say(s) + " — it can stay hotter."), { cup: "foam", lid: true, wrap: "wool" }, { wrong: { cup: "foam", lid: true, wrap: "foil" } }),
  fastest: () => simQ(1, "Make the tea <b>cool down as fast as possible</b>.", st({ cup: "foam", lid: true }), s => ok(s.cup === "metal" && !s.lid && s.wrap === "none", say(s) + " — metal conducts, no lid lets convection happen.", say(s) + " — it can cool faster."), { cup: "metal", lid: false, wrap: "none" }, { wrong: { cup: "glass", lid: false, wrap: "none" } }),
  insulator: () => simQ(1, "Choose the cup that is the <b>best insulator</b>.", st({ cup: "metal" }), s => ok(s.cup === "foam", "Foam traps air, a poor conductor.", say(s) + "."), { cup: "foam" }, { lock: ["lid", "wrap"], wrong: { cup: "glass" } }),
  above70: () => simQ(1, "In a <b>glass</b> cup, keep the tea <b>at 70 °C or more</b> after 10 minutes.", st(), s => ok(temp(s, 10) >= 70, say(s) + ".", say(s) + "."), { lid: true }, { lock: ["cup"], wrong: { lid: false, wrap: "none" } }),
  below50: () => simQ(2, "Metal mug, no lid: stop the clock at the <b>first</b> time (5-minute steps) the tea is <b>below 50 °C</b>.", st({ cup: "metal", t: 0 }), s => ok(s.t === 15, "15 min: " + temp(s, 15) + " °C (10 min was still " + temp(s, 10) + " °C).", `${s.t} min: ${temp(s, s.t)} °C.`), { t: 15 }, { lock: ["cup", "lid", "wrap"], wrong: { t: 20 } }),
  between: () => simQ(2, "Choose the setup so the tea is between <b>40 and 45 °C</b> after exactly <b>20 min</b>.", st({ t: 20 }), s => ok(s.t === 20 && temp(s, 20) >= 40 && temp(s, 20) <= 45, say(s) + ".", say(s) + "."), { cup: "metal", lid: false, wrap: "none" }, { lock: ["t"], wrong: { cup: "metal", lid: false, wrap: "foil" } }),
  glass65: () => simQ(2, "Glass cup <b>with a lid</b>: when does the tea first drop <b>below 65 °C</b>?", st({ lid: true, t: 0 }), s => ok(s.t === 20, "At 20 min: " + temp(s, 20) + " °C.", `${s.t} min: ${temp(s, s.t)} °C.`), { t: 20 }, { lock: ["cup", "lid", "wrap"], wrong: { t: 15 } }),
  foilHelp: () => simQ(2, "Metal mug, no lid. Wrap it so the tea is still above <b>55 °C after 15 min</b>.", st({ cup: "metal", t: 15 }), s => ok(temp(s, 15) > 55, say(s) + " — wool traps air.", say(s) + "."), { wrap: "wool" }, { lock: ["cup", "lid", "t"], wrong: { wrap: "foil" } }),
  h100: () => simQ(3, "Heat <b>500 g</b> of water by <b>10 °C</b> with a <b>210 W</b> heater. Set the time.", st({ mode: "heat", P: 210, m: 500, ts: 10 }), s => ok(heatT(s) === 30, "210 × 100 = 21 000 J = 500 × 4.2 × 10.", hsay(s) + "."), { ts: 100 }, { lock: ["P", "m"], wrong: { ts: 80 } }),
  p420: () => simQ(3, "Warm <b>200 g</b> of water by <b>50 °C</b> in <b>100 s</b>. Choose the heater power.", st({ mode: "heat", P: 100, m: 200, ts: 100 }), s => ok(heatT(s) === 70, "200 × 4.2 × 50 = 42 000 J ÷ 100 s = 420 W.", hsay(s) + "."), { P: 420 }, { lock: ["m", "ts"], wrong: { P: 400 } }),
  boil: () => simQ(3, "Bring <b>300 g</b> of water from 20 °C to <b>100 °C</b> with a 420 W heater.", st({ mode: "heat", P: 420, m: 300, ts: 60 }), s => ok(heatT(s) === 100, "300 × 4.2 × 80 = 100 800 J ÷ 420 W = 240 s.", hsay(s) + "."), { ts: 240 }, { lock: ["P", "m"], wrong: { ts: 200 } }),
  mass: () => simQ(3, "A <b>100 W</b> heater runs for <b>420 s</b> and the water warms by <b>20 °C</b>. How much water is there?", st({ mode: "heat", P: 100, ts: 420, m: 100 }), s => ok(heatT(s) === 40, "100 × 420 = 42 000 J ÷ (4.2 × 20) = 500 g.", hsay(s) + "."), { m: 500 }, { lock: ["P", "ts"], wrong: { m: 400 } })
};
const D = {
  pick: diff => E.diaT("ht2-pick", diff, 2, () => { const want = choice(["cond", "conv", "rad"]);
    const card = { cond: `<rect x="-70" y="-6" width="140" height="12" fill="#90a4ae"/><text x="-70" y="10" font-size="30">🔥</text><text x="0" y="-16" font-size="16" text-anchor="middle">➡➡➡</text>`, conv: `<path d="M-40,40 v-70 q0,-20 20,-20 h40 q20,0 20,20 v70Z" fill="#e3f2fd" stroke="#78909c" stroke-width="2"/><path d="M-10,30 v-50 M10,-20 v50" stroke="#e53935" stroke-width="3"/><path d="M-10,-20 l-5,8 h10Z M10,30 l-5,-8 h10Z" fill="#e53935"/><text x="0" y="62" font-size="22" text-anchor="middle">🔥</text>`, rad: `<circle cx="-40" cy="0" r="22" fill="#ffca28"/><path d="M-12,-10 h60 M-12,0 h60 M-12,10 h60" stroke="#ff7043" stroke-width="3" stroke-dasharray="6 5"/><text x="60" y="10" font-size="22">🙂</text>` };
    const order = E.shuffle(["cond", "conv", "rad"]), nm = { cond: "conduction", conv: "convection", rad: "radiation" };
    return { kind: "pick", title: "👆 How is heat moving?", prompt: `Click the picture that shows <b>${nm[want]}</b>.`, answer: [want], names: nm,
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fff4ef"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${30 + i * 280}" y="20" width="260" height="260" rx="14" fill="#fff" stroke="#ffccbc" stroke-width="2"/><rect x="${30 + i * 280}" y="20" width="260" height="260" rx="14" fill="none" ${E.ring(s2[k])}/><g transform="translate(${160 + i * 280},140)">${card[k]}</g></g>`).join("")}</svg>`,
      explain: "Conduction: heat passes along a solid. Convection: warm fluid rises and cool fluid sinks. Radiation: infrared waves travel even through empty space.", summary: "Types of heat transfer" }; }),
  num: diff => E.diaT("ht2-num", diff, 2, () => { const c = choice([[500, 20], [250, 40], [1000, 15], [200, 60]]);
    return { kind: "num", title: "🧮 Energy to heat water", prompt: `Heat <b>${c[0]} g</b> of water by <b>${c[1]} °C</b> (4.2 J per g per °C).`, visual: render(st({ mode: "heat", m: c[0], reveal: true })),
      fields: [{ label: "Energy needed", unit: "J", answer: c[0] * 4.2 * c[1] }, { label: "Time with a 500 W heater", unit: "s", answer: c[0] * 4.2 * c[1] / 500, tol: 0.03 }], explain: `${c[0]} × 4.2 × ${c[1]} = ${fmt(c[0] * 4.2 * c[1])} J; ÷ 500 W = ${fmt(c[0] * 4.2 * c[1] / 500)} s.`, summary: "Specific heat calculation" }; }),
  mcq: diff => E.diaT("ht2-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does a lid keep a drink warm?", ok: "It stops warm air rising away (convection) and evaporation", bad: ["It conducts heat in", "It makes the drink heavier", "It reflects sound"], ex: "Most heat from an open cup leaves by convection and evaporation." },
      { ask: "Why is a metal spoon in hot tea soon hot at the handle?", ok: "Metals are good conductors", bad: ["Metals are good insulators", "Heat rises through the air", "The spoon absorbs light"], ex: "Free electrons pass the energy along the metal quickly." },
      { ask: "How does heat from the Sun reach Earth?", ok: "Radiation", bad: ["Conduction", "Convection", "Evaporation"], ex: "Infrared radiation needs no particles — it crosses empty space." }]);
    return { kind: "mcq", title: "📘 Heat transfer", prompt: "Think about conduction, convection and radiation.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Heat transfer concepts" }; })
};
const LEVELS = {
  1: { intro: "Keep a cup of tea warm — or cool it fast — using cups, lids and wraps.", pool: () => [S(1, 1, C.insulator), S(2, 1, C.fastest), S(2, 1, C.above70), S(3, 1, C.hottest), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Read the cooling curve: temperature drops quickly at first, then more slowly.", pool: () => [S(1, 1, C.below50), S(2, 1, C.glass65), S(2, 1, C.foilHelp), S(3, 1, C.between), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Heat water with an electric heater: energy = power × time = mass × 4.2 × ΔT.", pool: () => [S(1, 1, C.h100), S(2, 1, C.boil), S(3, 1, C.p420), S(3, 1, C.mass), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a cup, a lid and a wrap, then press ▶ to see how warm the tea stays.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Wait",
  goals: () => [{ txt: "Keep it above 75 °C", test: (s, m) => m.w }, { txt: "Let it drop below 60 °C", test: (s, m) => m.c }, { txt: "Try the lid", test: (s, m) => m.l }],
  track: (s, m, ran) => { if (!ran) return; const t = temp(s, s.t); if (t > 75) m.w = 1; if (t < 60) m.c = 1; if (s.lid) m.l = 1; },
  facts: () => "📘 Heat moves from hot to cold by <b>conduction</b> (solids), <b>convection</b> (liquids and gases) and <b>radiation</b> (infrared waves)."
});
E.start({ labId: "heat", total: 7, plan: { sim: 4, dia: 3 }, emoji: "☕", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["☕", "🔥", "🌡️", "✨"],
  exploreDemo: () => [{ set: { cup: "foam", lid: true }, run: true }, { set: { cup: "metal", lid: false }, run: true }] });
})();
