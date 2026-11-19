"use strict";
// ===== Concentration & Molarity — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SOL = { cuso4: { n: "Copper sulfate", f: "CuSO₄", M: 160, col: [30, 110, 220], sat: 1.4 }, kmno4: { n: "Potassium permanganate", f: "KMnO₄", M: 158, col: [120, 30, 150], sat: 0.4 },
  nicl2: { n: "Nickel chloride", f: "NiCl₂", M: 130, col: [40, 160, 80], sat: 4 }, naoh: { n: "Sodium hydroxide", f: "NaOH", M: 40, col: [215, 225, 235], sat: 20 },
  nacl: { n: "Sodium chloride", f: "NaCl", M: 58.5, col: [215, 225, 235], sat: 6 }, glucose: { n: "Glucose", f: "C₆H₁₂O₆", M: 180, col: [235, 225, 200], sat: 5 } };
const r3 = x => Math.round(x * 1000) / 1000;
const mol = s => s.mode === 2 ? s.g / SOL[s.sol].M : s.mode === 3 ? 2 * s.vs : s.n;
const vol = s => s.mode === 3 ? s.vf : s.V;
const conc = s => s.mode === 3 && s.vf < s.vs ? NaN : r3(mol(s) / vol(s));
const sat = s => conc(s) > SOL[s.sol].sat + 1e-9;
function beaker(x, y, w, h, s, show, label) {
  const V = vol(s), c = conc(s), d = SOL[s.sol], lh = Math.min(1, V / 2) * (h - 16), cc = Math.min(1, (sat(s) ? d.sat : c) / 1.2);
  const col = `rgba(${d.col.join(",")},${(0.08 + 0.85 * cc).toFixed(2)})`;
  let marks = ""; for (let v = 0.5; v <= 2; v += 0.5) { const yy = y + h - v / 2 * (h - 16); marks += `<line x1="${x + w - 26}" x2="${x + w}" y1="${yy}" y2="${yy}" stroke="#90a4ae" stroke-width="2"/>${T(x + w - 32, yy + 4, fmt(v) + " L", { a: "end", s: 11, c: "#78909c" })}`; }
  let dots = ""; const n = Math.min(160, Math.round(mol(s) * 60)), R = (seed => () => (seed = seed * 16807 % 2147483647) / 2147483647)(5);
  for (let i = 0; i < n; i++) dots += `<circle cx="${x + 8 + R() * (w - 40)}" cy="${y + h - 6 - R() * (lh - 8)}" r="2.6" fill="rgba(${d.col.map(v => Math.round(v * 0.6)).join(",")},.9)"/>`;
  return `<path d="M${x},${y} L${x},${y + h - 12} Q${x},${y + h} ${x + 12},${y + h} L${x + w - 12},${y + h} Q${x + w},${y + h} ${x + w},${y + h - 12} L${x + w},${y}" fill="rgba(255,255,255,.7)" stroke="#5c6bc0" stroke-width="5"/>
    <rect x="${x + 3}" y="${y + h - lh}" width="${w - 6}" height="${lh - 3}" rx="8" fill="${col}"/>${dots}${sat(s) ? `<path d="M${x + 20},${y + h - 4} l14,-14 l14,14 l16,-18 l14,18 l12,-10 l12,10 Z" fill="rgb(${d.col.join(",")})"/>` + T(x + w / 2, y + h + 22, "saturated: solid left over", { s: 13, c: "#c62828" }) : ""}${marks}${label ? T(x + w / 2, y + h + (sat(s) ? 42 : 22), label, { s: 13, c: "#311b92" }) : ""}`;
}
function render(s) {
  const show = s.reveal || s.showVals || s.mode === 1, d = SOL[s.sol], c = conc(s);
  let left = "";
  if (s.mode === 3) left = `<g><path d="M60,120 L60,300 Q60,312 72,312 L148,312 Q160,312 160,300 L160,120" fill="rgba(255,255,255,.7)" stroke="#5c6bc0" stroke-width="4"/><rect x="63" y="160" width="94" height="149" rx="6" fill="rgba(${d.col.join(",")},.9)"/>${T(110, 106, "STOCK 2.0 mol/L", { s: 13, c: "#311b92" })}
      ${T(110, 340, "take " + fmt(s.vs) + " L", { s: 15, c: "#c62828" })}<path d="M170,220 C210,200 230,200 250,230" fill="none" stroke="#7e57c2" stroke-width="4"/><polygon points="250,230 238,224 246,214" fill="#7e57c2"/></g>`;
  else left = `<g transform="translate(150,74)"><rect x="-30" y="-30" width="60" height="70" rx="12" fill="#fff" stroke="#9575cd" stroke-width="3"/><rect x="-18" y="-46" width="36" height="18" rx="5" fill="#9575cd"/>${T(0, 12, d.f, { s: 13, c: "#311b92" })}${T(0, 66, s.mode === 2 ? fmt(s.g) + " g" : fmt(s.n) + " mol", { s: 15, c: "#c62828" })}</g>`;
  const meter = `<g transform="translate(600,60)"><rect width="220" height="160" rx="16" fill="#263238"/><rect x="16" y="16" width="188" height="70" rx="10" fill="#0f1a12"/>${T(110, 64, show ? (isNaN(c) ? "error" : fmt(Math.min(c, d.sat)) + " M") : "? M", { s: 30, c: "#7dffb3" })}
      ${T(110, 108, "CONCENTRATION (mol/L)", { s: 11, c: "#b0bec5" })}${T(110, 134, d.n, { s: 12, c: "#cfd8dc" })}</g>
    <g transform="translate(600,240)"><rect width="220" height="${s.mode === 2 ? 130 : 100}" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>
      ${s.mode === 2 ? T(110, 28, "molar mass " + d.M + " g/mol", { s: 13, c: "#4527a0" }) + T(110, 56, "moles = " + (show ? fmt(r3(mol(s))) : "?") + " mol", { s: 14, c: "#4527a0" }) + T(110, 84, "volume = " + fmt(vol(s)) + " L", { s: 14, c: "#4527a0" }) + T(110, 112, "c = n ÷ V", { s: 13, c: "#7e57c2" })
        : s.mode === 3 ? T(110, 30, "c₁V₁ = c₂V₂", { s: 16, c: "#4527a0" }) + T(110, 58, `2.0 × ${fmt(s.vs)} = ? × ${fmt(s.vf)}`, { s: 14, c: "#4527a0" }) + T(110, 84, s.vf < s.vs ? "final volume too small!" : "add water up to " + fmt(s.vf) + " L", { s: 12, c: s.vf < s.vs ? "#c62828" : "#7e57c2" })
        : T(110, 30, "moles = " + fmt(s.n) + " mol", { s: 14, c: "#4527a0" }) + T(110, 56, "volume = " + fmt(s.V) + " L", { s: 14, c: "#4527a0" }) + T(110, 84, "c = n ÷ V", { s: 13, c: "#7e57c2" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f6f5ff"/>${left}${beaker(s.mode === 3 ? 270 : 240, 120, 280, 260, s, show, s.mode === 3 ? "final solution" : "")}${meter}</svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 1) return [{ id: "sol", type: "choice", label: "Solute", options: ["cuso4", "kmno4", "nicl2"].map(v => ({ v, label: SOL[v].f })), lock: lk("sol") },
    { id: "n", type: "range", label: "Solute added", min: 0, max: 1.5, step: 0.05, nudge: 0.05, unit: "mol", fmt: v => fmt(v), lock: lk("n") }, { id: "V", type: "range", label: "Volume of solution", min: 0.2, max: 2, step: 0.1, nudge: 0.1, unit: "L", fmt: v => fmt(v), lock: lk("V") }];
  if (mode === 2) return [{ id: "sol", type: "choice", label: "Solute", options: ["naoh", "nacl", "cuso4", "glucose"].map(v => ({ v, label: SOL[v].f })), lock: lk("sol") },
    { id: "g", type: "range", label: "Mass of solute", min: 0, max: 100, step: 0.5, nudge: 0.5, unit: "g", fmt: v => fmt(v), lock: lk("g") }, { id: "V", type: "range", label: "Volume of solution", min: 0.1, max: 2, step: 0.05, nudge: 0.05, unit: "L", fmt: v => fmt(v), lock: lk("V") }];
  return [{ id: "vs", type: "range", label: "Volume of stock taken (2.0 mol/L)", min: 0.05, max: 1, step: 0.05, nudge: 0.05, unit: "L", fmt: v => fmt(v), lock: lk("vs") }, { id: "vf", type: "range", label: "Final volume (add water)", min: 0.1, max: 2, step: 0.1, nudge: 0.1, unit: "L", fmt: v => fmt(v), lock: lk("vf") }];
};
const stFor = (mode, o) => Object.assign(mode === 1 ? { mode, sol: "cuso4", n: 0.1, V: 1 } : mode === 2 ? { mode, sol: "naoh", g: 0, V: 1 } : { mode, sol: "cuso4", vs: 0.1, vf: 1 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b) => Math.abs(a - b) < 1e-6;
const say = s => isNaN(conc(s)) ? "The final volume must be bigger than the stock volume" : sat(s) ? `Saturated — only ${SOL[s.sol].sat} mol/L can dissolve` : `${fmt(r3(mol(s)))} mol ÷ ${fmt(vol(s))} L = ${fmt(conc(s))} mol/L`;
const HINT = { 1: "Concentration c = moles ÷ volume (mol/L). More solute or less water → more concentrated.", 2: "moles = mass ÷ molar mass. Then c = n ÷ V.", 3: "Dilution: c₁V₁ = c₂V₂. The moles of solute stay the same; only water is added." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🧪 Concentration challenge", 2: "⚖️ Make a solution", 3: "💧 Dilution challenge" }[mode], prompt: "Prepare the solution, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mol-sim2", diff, uses, mk);
const C = {
  half: () => { const c = choice([0.5, 0.25, 1, 0.75]); return simQ(1, `Make a solution with a concentration of <b>${c} mol/L</b>.`, stFor(1), s => ok(near(conc(s), c) && !sat(s), say(s) + ".", say(s) + "."), { n: c, V: 1 }, { wrong: { n: c, V: 2 } }); },
  fixV: () => { const c = choice([[0.8, 0.5, 0.4], [0.5, 0.6, 0.3], [1.5, 0.4, 0.6]]); return simQ(1, `The flask holds <b>${c[0]} L</b>. Add solute to make <b>${c[1]} mol/L</b>.`, stFor(1, { V: c[0] }), s => ok(near(conc(s), c[1]), say(s) + ".", say(s) + "."), { n: c[2] }, { lock: ["V"], wrong: { n: c[2] + 0.1 } }); },
  fixN: () => { const c = choice([[0.6, 1.2, 0.5], [0.3, 0.5, 0.6], [0.9, 0.75, 1.2]]); return simQ(1, `You have <b>${c[0]} mol</b> of solute. Choose the volume to make <b>${c[1]} mol/L</b>.`, stFor(1, { n: c[0] }), s => ok(near(conc(s), c[1]), `V = n ÷ c = ${c[0]} ÷ ${c[1]} = ${c[2]} L.`, say(s) + "."), { V: c[2] }, { lock: ["n"], wrong: { V: c[2] + 0.2 } }); },
  satur: () => simQ(1, "Make a <b>saturated</b> copper sulfate solution in <b>0.5 L</b> using the <b>least</b> solute (it dissolves up to 1.4 mol/L).", stFor(1, { V: 0.5, sol: "cuso4" }), s => ok(near(conc(s), 1.4), "0.7 mol in 0.5 L = 1.4 mol/L: exactly saturated.", sat(s) ? "Saturated, but some solid is left over — use less." : say(s) + " — not saturated yet."), { n: 0.7 }, { lock: ["V", "sol"], wrong: { n: 0.75 } }),
  naoh: () => { const c = choice([[1, 0.5, 20], [0.5, 1, 20], [0.25, 2, 20], [2, 0.25, 20]]); return simQ(2, `Make <b>${c[0]} L</b> of <b>${c[1]} mol/L NaOH</b> (40 g/mol).`, stFor(2, { sol: "naoh", V: c[0] }), s => ok(s.sol === "naoh" && near(conc(s), c[1]), `${c[1]} × ${c[0]} = ${c[1] * c[0]} mol × 40 = ${c[2]} g.`, say(s) + "."), { g: c[2] }, { lock: ["sol", "V"], wrong: { g: c[2] / 2 } }); },
  cuso4: () => { const c = choice([[0.25, 0.2, 8], [0.5, 0.1, 8], [1, 0.25, 40], [0.5, 0.5, 40]]); return simQ(2, `Make <b>${c[0]} L</b> of <b>${c[1]} mol/L copper sulfate</b> (160 g/mol).`, stFor(2, { sol: "cuso4", V: c[0] }), s => ok(s.sol === "cuso4" && near(conc(s), c[1]), `${fmt(c[0] * c[1])} mol × 160 = ${c[2]} g.`, say(s) + "."), { g: c[2] }, { lock: ["sol", "V"], wrong: { g: c[2] * 2 } }); },
  glucose: () => simQ(2, "Make <b>0.5 L</b> of <b>0.1 mol/L glucose</b> (180 g/mol).", stFor(2, { sol: "glucose", V: 0.5 }), s => ok(near(conc(s), 0.1), "0.05 mol × 180 = 9 g.", say(s) + "."), { g: 9 }, { lock: ["sol", "V"], wrong: { g: 18 } }),
  nacl: () => simQ(2, "Using <b>58.5 g of NaCl</b> (1 mol), choose the volume to make <b>0.5 mol/L</b>.", stFor(2, { sol: "nacl", g: 58.5, V: 1 }), s => ok(near(conc(s), 0.5), "1 mol ÷ 0.5 mol/L = 2 L.", say(s) + "."), { V: 2 }, { lock: ["sol", "g"], wrong: { V: 0.5 } }),
  pick: () => simQ(2, "Choose a solute and make <b>1 L</b> of a <b>0.5 mol/L</b> solution using <b>less than 25 g</b>.", stFor(2, { sol: "cuso4", V: 1 }), s => ok(near(conc(s), 0.5) && s.g < 25, `${SOL[s.sol].f}: ${s.g} g.`, near(conc(s), 0.5) ? `That needs ${s.g} g — too much.` : say(s) + "."), { sol: "naoh", g: 20 }, { lock: ["V"], wrong: { sol: "nacl", g: 29.5 } }),
  dil1: () => { const c = choice([[1, 0.5, 0.25], [1, 0.2, 0.1], [2, 0.5, 0.5], [0.5, 1, 0.25]]); return simQ(3, `Make <b>${c[0]} L</b> of <b>${c[1]} mol/L</b> from the 2.0 mol/L stock.`, stFor(3, { vf: c[0], vs: 0.05 }), s => ok(near(conc(s), c[1]) && near(s.vf, c[0]), `V₁ = ${c[1]} × ${c[0]} ÷ 2 = ${c[2]} L of stock.`, say(s) + "."), { vs: c[2] }, { lock: ["vf"], wrong: { vs: c[2] * 2 } }); },
  least: () => simQ(3, "Make <b>0.5 L</b> of a <b>0.2 mol/L</b> solution — the stock is expensive, use it carefully.", stFor(3, { vs: 0.3, vf: 0.5 }), s => ok(near(conc(s), 0.2) && near(s.vf, 0.5), "0.2 × 0.5 ÷ 2 = 0.05 L of stock.", say(s) + "."), { vs: 0.05 }, { lock: ["vf"], wrong: { vs: 0.1 } }),
  four: () => simQ(3, "Take <b>0.1 L</b> of stock and dilute it <b>4 times</b>.", stFor(3, { vs: 0.1, vf: 0.1 }), s => ok(near(conc(s), 0.5), "0.1 L → 0.4 L: 2.0 → 0.5 mol/L.", say(s) + "."), { vf: 0.4 }, { lock: ["vs"], wrong: { vf: 0.8 } }),
  big: () => simQ(3, "Make <b>1.5 L</b> of <b>0.8 mol/L</b>.", stFor(3, { vf: 1.5 }), s => ok(near(conc(s), 0.8), "0.8 × 1.5 ÷ 2 = 0.6 L of stock.", say(s) + "."), { vs: 0.6 }, { lock: ["vf"], wrong: { vs: 0.4 } })
};

// ---------- diagram tasks ----------
const D = {
  cNum: diff => E.diaT("mol-num", diff, 2, () => { const c = choice([[0.4, 2], [0.15, 0.5], [0.6, 0.25], [1.2, 1.5]]);
    return { kind: "num", title: "🧮 Calculate the concentration", prompt: `${c[0]} mol of copper sulfate is dissolved to make ${c[1]} L of solution.`, visual: render(stFor(1, { n: Math.min(1.5, c[0]), V: c[1] })).replace(/\d+(\.\d+)? M</, "? M<"),
      fields: [{ label: "Concentration", unit: "mol/L", answer: c[0] / c[1], tol: 0.006 }], explain: `c = n ÷ V = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} mol/L.`, summary: "c = n ÷ V" }; }),
  mNum: diff => E.diaT("mol-num", diff, 3, () => { const c = choice([["naoh", 10, 0.5], ["cuso4", 32, 0.4], ["glucose", 45, 0.25], ["nacl", 11.7, 0.2]]); const d = SOL[c[0]], n = c[1] / d.M;
    return { kind: "num", title: "⚖️ Grams → moles → mol/L", prompt: `${c[1]} g of ${d.n} (${d.f}, ${d.M} g/mol) is dissolved to make ${c[2]} L.`, visual: render(stFor(2, { sol: c[0], g: Math.min(100, c[1]), V: c[2] })).replace(/\d+(\.\d+)? M</, "? M<"),
      fields: [{ label: "Moles", unit: "mol", answer: n, tol: 0.006 }, { label: "Concentration", unit: "mol/L", answer: n / c[2], tol: 0.011 }], explain: `n = ${c[1]} ÷ ${d.M} = ${fmt(n)} mol; c = ${fmt(n)} ÷ ${c[2]} = ${fmt(n / c[2])} mol/L.`, summary: "Mass to concentration" }; }),
  pick: diff => E.diaT("mol-pick", diff, 1, () => { const bs = { a: [0.2, 1], b: [0.6, 1.5], c: [0.3, 0.5] }; const conc3 = k => bs[k][0] / bs[k][1]; const ks = ["a", "b", "c"], order = E.shuffle(ks.slice());
    const q = choice([["max", "the <b>most concentrated</b>"], ["min", "the <b>least concentrated</b>"]]); const ans = ks.reduce((b, k) => (q[0] === "max" ? conc3(k) > conc3(b) : conc3(k) < conc3(b)) ? k : b, ks[0]);
    return { kind: "pick", title: "👆 Compare the solutions", prompt: `Click ${q[1]} solution. (Moles and volume are written under each beaker.)`, answer: [ans], names: { a: "0.2 mol in 1 L", b: "0.6 mol in 1.5 L", c: "0.3 mol in 0.5 L" },
      visual: st => `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="300" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${10 + i * 298}" y="8" width="284" height="284" rx="14" fill="#fff" ${E.ring(st[k])}/>${beaker(60 + i * 298, 40, 180, 190, stFor(1, { n: bs[k][0], V: bs[k][1] }), false)}${T(150 + i * 298, 270, bs[k][0] + " mol in " + bs[k][1] + " L", { s: 15, c: "#311b92" })}</g>`).join("")}</svg>`,
      explain: `Concentrations: 0.2 ÷ 1 = 0.2, 0.6 ÷ 1.5 = 0.4, 0.3 ÷ 0.5 = 0.6 mol/L.`, summary: "Compare concentrations" }; }),
  dilMcq: diff => E.diaT("mol-mcq", diff, 2, () => { const q = choice([
      { ask: "When water is added to a solution, what stays the same?", ok: "The number of moles of solute", bad: ["The concentration", "The volume", "The colour"], ex: "Only water is added, so the moles stay the same; the concentration falls." },
      { ask: "A solution has some solid that will not dissolve at the bottom. It is…", ok: "saturated", bad: ["dilute", "pure solvent", "a gas"], ex: "A saturated solution cannot dissolve any more solute at that temperature." },
      { ask: "Half of a 1 mol/L solution is poured away. The concentration of what is left is…", ok: "still 1 mol/L", bad: ["0.5 mol/L", "2 mol/L", "0 mol/L"], ex: "Pouring some away removes solute AND water in the same ratio — the concentration does not change." }]);
    return { kind: "mcq", title: "💧 Solutions", prompt: "Think about solute, solvent and concentration.", visual: render(stFor(3, { vs: 0.25, vf: 1, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Dilution and saturation" }; })
};
const LEVELS = {
  1: { intro: "Concentration = moles of solute ÷ volume of solution (mol/L). Watch the colour and the meter.", pool: () => [S(1, 1, C.half), S(2, 1, C.fixV), S(2, 1, C.fixN), S(3, 1, C.satur), S(3, 1, C.fixN), D.pick(1), D.cNum(2), D.dilMcq(3)] },
  2: { intro: "Real labs weigh grams: moles = mass ÷ molar mass. The meter is hidden until you check.", pool: () => [S(1, 1, C.naoh), S(2, 1, C.cuso4), S(2, 1, C.glucose), S(3, 1, C.nacl), S(3, 1, C.pick), D.cNum(1), D.mNum(2), D.mNum(3)] },
  3: { intro: "Dilution: take some stock solution and add water. c₁V₁ = c₂V₂.", pool: () => [S(1, 1, C.four), S(2, 1, C.dil1), S(2, 1, C.least), S(3, 1, C.big), D.dilMcq(1), D.mNum(2), D.cNum(3)] }
};
const explore = E.exploreSim({
  intro: "Add solute and change the volume. Watch the colour and the concentration meter.",
  state: lv => stFor(lv, { showVals: true }), controls: lv => ctlsFor(lv), render,
  goals: lv => lv === 3 ? [{ txt: "Make the solution 10 times more dilute than the stock", test: s => near(conc(s), 0.2) }, { txt: "Make it 4 times more dilute", test: s => near(conc(s), 0.5) }]
    : [{ txt: "Make a concentration of exactly 1 mol/L", test: s => near(conc(s), 1) }, { txt: "Make a very dilute solution (below 0.1 mol/L)", test: s => conc(s) < 0.1 && conc(s) > 0 }].concat(lv === 1 ? [{ txt: "Make a saturated solution", test: s => sat(s) }] : []),
  facts: lv => lv === 3 ? "📘 <b>c₁V₁ = c₂V₂</b>: adding water does not change the moles of solute." : "📘 <b>Concentration (mol/L) = moles ÷ volume (L)</b>." + (lv === 2 ? " Moles = mass ÷ molar mass." : "")
});
E.start({ labId: "molarity", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧪", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧪", "💧", "⚗️", "✨"],
  exploreDemo: lv => lv === 1 ? [{ set: { n: 1, V: 1 } }, { set: { n: 0.1, V: 2 } }, { set: { n: 1.5, V: 0.5 } }] : lv === 2 ? [{ set: { g: 40, V: 1 } }, { set: { g: 2 } }] : [{ set: { vs: 0.1, vf: 1 } }, { set: { vs: 0.25 } }] });
})();
