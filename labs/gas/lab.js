"use strict";
// ===== Gas Properties — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const P = s => Math.round(s.N * s.T / (3000 * s.V) * 1000) / 1000; // atm: 100 particles, 300 K, 10 L → 1 atm
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function gauge(x, y, p, show) { const a = -210 + Math.min(p, 4) / 4 * 240, rad = a * Math.PI / 180;
  let ticks = ""; for (let i = 0; i <= 8; i++) { const t = (-210 + i * 30) * Math.PI / 180; ticks += `<line x1="${x + 52 * Math.cos(t)}" y1="${y + 52 * Math.sin(t)}" x2="${x + 62 * Math.cos(t)}" y2="${y + 62 * Math.sin(t)}" stroke="#455a64" stroke-width="${i % 2 ? 2 : 3}"/>${i % 2 ? "" : T(x + 42 * Math.cos(t), y + 42 * Math.sin(t) + 4, i / 2, { s: 11, c: "#455a64" })}`; }
  return `<circle cx="${x}" cy="${y}" r="70" fill="#fff" stroke="#37474f" stroke-width="5"/>${ticks}${show ? `<line x1="${x}" y1="${y}" x2="${x + 50 * Math.cos(rad)}" y2="${y + 50 * Math.sin(rad)}" stroke="#c62828" stroke-width="4" stroke-linecap="round"/>` : ""}<circle cx="${x}" cy="${y}" r="6" fill="#37474f"/>${T(x, y + 30, "atm", { s: 11, c: "#78909c" })}${T(x, y + 96, show ? "P = " + fmt(p) + " atm" : "P = ? atm", { s: 17, c: "#c62828" })}`; }
function render(s) {
  const show = s.reveal || s.showVals, p = P(s), x0 = 60, y0 = 80, h = 270, w = 26 * s.V, R = rnd(13), n = Math.min(90, Math.round(s.N / 2)), sp = Math.sqrt(s.T / 300);
  const hue = Math.round(220 - 200 * Math.min(1, (s.T - 100) / 500));
  let dots = ""; for (let i = 0; i < n; i++) { const pts = []; for (let j = 0; j < 4; j++) pts.push([x0 + 8 + R() * (w - 16), y0 + 8 + R() * (h - 16)]); pts.push(pts[0]); const dur = (3.2 / sp).toFixed(2), b = (R() * 3).toFixed(2);
    dots += `<circle r="5" fill="hsl(${hue},75%,50%)"><animate attributeName="cx" values="${pts.map(q => q[0].toFixed(0)).join(";")}" dur="${dur}s" begin="-${b}s" repeatCount="indefinite"/><animate attributeName="cy" values="${pts.map(q => q[1].toFixed(0)).join(";")}" dur="${dur}s" begin="-${b}s" repeatCount="indefinite"/></circle>`; }
  const th = (s.T - 100) / 500;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f6f5ff"/>
    <rect x="${x0 - 8}" y="${y0 - 8}" width="${26 * 20 + 16}" height="${h + 16}" rx="8" fill="#eceff1" opacity=".5"/>
    <path d="M${x0 + w},${y0 - 8} L${x0 - 8},${y0 - 8} L${x0 - 8},${y0 + h + 8} L${x0 + w},${y0 + h + 8}" fill="#fff" stroke="#37474f" stroke-width="8"/><rect x="${x0 + w}" y="${y0 - 14}" width="14" height="${h + 28}" rx="4" fill="#607d8b"/><rect x="${x0 + w + 14}" y="${y0 + h / 2 - 8}" width="${26 * 20 - w + 30}" height="16" fill="#90a4ae"/>
    <rect x="${x0}" y="${y0 - 4}" width="${w}" height="${h + 8}" fill="hsl(${hue},80%,96%)"/>${dots}
    ${T(x0 + w / 2, y0 + h + 40, "V = " + s.V + " L", { s: 15, c: "#37474f" })}${T(x0 + 4, 50, s.N + " particles", { a: "start", s: 15, c: "#4527a0" })}
    <rect x="${x0 + 40}" y="${y0 + h + 10}" width="${w - 80 > 0 ? w - 80 : 0}" height="0"/>
    <g transform="translate(610,40)"><rect x="0" y="0" width="16" height="170" rx="8" fill="#fff" stroke="#9e9e9e"/><rect x="4" y="${166 - 160 * th}" width="8" height="${160 * th}" fill="#e53935"/><circle cx="8" cy="178" r="12" fill="#e53935"/>${T(28, 24, s.T + " K", { a: "start", s: 16, c: "#c62828" })}${T(28, 46, (s.T - 273) + " °C", { a: "start", s: 12, c: "#78909c" })}</g>
    ${gauge(760, 120, p, show)}
    <g transform="translate(620,270)"><rect width="230" height="150" rx="12" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(115, 26, "IDEAL GAS", { s: 12, c: "#7e57c2" })}${T(115, 56, "P × V = constant × N × T", { s: 14, c: "#4527a0" })}
      ${T(115, 86, "100 particles, 300 K, 10 L", { s: 12, c: "#5e5a85" })}${T(115, 106, "→ 1 atm", { s: 12, c: "#5e5a85" })}${show ? T(115, 134, `${fmt(p)} × ${s.V} = ${fmt(p * s.V)}`, { s: 13, c: "#c62828" }) : ""}</g></svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "N", type: "step", label: "Particles (pump)", min: 10, max: 300, step: 10, lock: lk("N") },
  { id: "T", type: "range", label: "Temperature (heat / cool)", min: 100, max: 600, step: 50, nudge: 50, nudgeLabels: ["❄ −50", "🔥 +50"], unit: "K", lock: lk("T") },
  { id: "V", type: "range", label: "Volume (move the wall)", min: 2, max: 20, step: 1, nudge: 1, unit: "L", hide: () => lv < 2 && !(lock && lock.includes("showV")), lock: lk("V") }
]; };
const st = (o) => Object.assign({ N: 100, T: 300, V: 10 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b) => Math.abs(a - b) < 0.006;
const say = s => `${s.N} particles, ${s.T} K, ${s.V} L → ${fmt(P(s))} atm`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🎈 Gas challenge", prompt: "Change the gas, then press <b>▶ Run & check</b> to read the pressure gauge.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Pressure comes from particles hitting the walls. More particles or higher temperature → more pressure. Smaller volume → more pressure (P × V stays constant at fixed T)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("gas-sim", diff, uses, mk);
const C = {
  addN: () => { const p = choice([2, 1.5, 3]); return simQ(1, `Change <b>only the number of particles</b> to make the pressure <b>${p} atm</b>.`, st(), s => ok(near(P(s), p), say(s) + ": double the particles → double the hits.", say(s) + "."), { N: 100 * p }, { lock: ["T"], wrong: { N: 100 * p - 20 } }); },
  heat: () => { const p = choice([[2, 600], [1.5, 450], [0.5, 150]]); return simQ(1, `Change <b>only the temperature</b> to make the pressure <b>${p[0]} atm</b>.`, st(), s => ok(near(P(s), p[0]), say(s) + ": faster particles hit the walls harder and more often.", say(s) + "."), { T: p[1] }, { lock: ["N"], wrong: { T: p[1] - 50 } }); },
  both: () => simQ(1, "Make the pressure <b>3 atm</b> using <b>both</b> particles and temperature (the temperature must be <b>above 300 K</b>).", st(), s => ok(near(P(s), 3) && s.T > 300, say(s) + ".", s.T <= 300 ? "Heat the gas above 300 K." : say(s) + "."), { N: 200, T: 450 }, { wrong: { N: 300, T: 300 } }),
  half: () => simQ(1, "Remove particles so the pressure <b>halves</b> (from 1 atm).", st(), s => ok(near(P(s), 0.5), say(s) + ".", say(s) + "."), { N: 50 }, { lock: ["T"], wrong: { N: 60 } }),
  boyle: () => { const c = choice([[2.5, 4], [2, 5], [0.5, 20], [5, 2]]); return simQ(2, `Change <b>only the volume</b> to make the pressure <b>${c[0]} atm</b>.`, st(), s => ok(near(P(s), c[0]), `P × V = 10: ${fmt(P(s))} × ${s.V} = 10 (Boyle's law).`, say(s) + "."), { V: c[1] }, { lock: ["N", "T"], wrong: { V: c[1] > 2 ? c[1] - 1 : c[1] + 1 } }); },
  squeeze: () => simQ(2, "Start: 200 particles in 10 L (2 atm). Change the volume to make it <b>4 atm</b>.", st({ N: 200 }), s => ok(near(P(s), 4), "Half the volume → double the pressure.", say(s) + "."), { V: 5 }, { lock: ["N", "T"], wrong: { V: 4 } }),
  keep: () => simQ(2, "Heat the gas to <b>450 K</b> but keep the pressure at exactly <b>1 atm</b>.", st(), s => ok(s.T === 450 && near(P(s), 1), "Charles's law: V ∝ T at constant pressure → 15 L.", s.T !== 450 ? "The temperature must be 450 K." : say(s) + "."), { T: 450, V: 15 }, { lock: ["N"], wrong: { T: 450, V: 10 } }),
  pump: () => simQ(2, "The volume is <b>5 L</b>. Make the pressure <b>1 atm</b> at 300 K.", st({ V: 5, N: 200 }), s => ok(near(P(s), 1), "Half the space needs half the particles: 50.", say(s) + "."), { N: 50 }, { lock: ["T", "V"], wrong: { N: 100 } }),
  combo: () => { const c = choice([[3, { N: 150, T: 300, V: 5 }], [3, { N: 100, T: 450, V: 5 }], [0.5, { N: 100, T: 300, V: 20 }]]); return simQ(3, `<b>100 particles</b>, 5 L. Change the temperature so the pressure is <b>3 atm</b>.`, st({ V: 5, N: 100 }), s => ok(near(P(s), 3), "100 × 450 ÷ (3000 × 5) = 3 atm.", say(s) + "."), { T: 450 }, { lock: ["N", "V"], wrong: { T: 400 } }); },
  charles: () => simQ(3, "Cool the gas to <b>150 K</b>. Change the volume so the pressure stays <b>1 atm</b>.", st({ T: 150 }), s => ok(s.T === 150 && near(P(s), 1), "Half the temperature (K) → half the volume at the same pressure.", say(s) + "."), { V: 5 }, { lock: ["N", "T"], wrong: { V: 10 } }),
  balloon: () => simQ(3, "A balloon at <b>1 atm, 10 L, 300 K</b> is taken up a mountain where the pressure is <b>0.5 atm</b> (same temperature). Set its new volume.", st(), s => ok(near(P(s), 0.5), "P halves → V doubles: 20 L.", say(s) + "."), { V: 20 }, { lock: ["N", "T"], wrong: { V: 15 } }),
  all3: () => simQ(3, "Make <b>2 atm</b> with <b>V = 6 L</b> and <b>T = 450 K</b>. How many particles?", st({ V: 6, T: 450 }), s => ok(near(P(s), 2), "N = 2 × 3000 × 6 ÷ 450 = 80 particles.", say(s) + "."), { N: 80 }, { lock: ["V", "T"], wrong: { N: 90 } })
};

// ---------- diagram tasks ----------
const mini = (st2, x, lab) => { const s = st(st2); return `<g transform="translate(${x},0) scale(0.42)">${render(Object.assign(s, { showVals: false })).replace(/<svg[^>]*>|<\/svg>/g, "").replace(/<g transform="translate\(610,40\)">[\s\S]*$/, "")}</g>${T(x + 120, 200, lab, { s: 14, c: "#311b92" })}`; };
const D = {
  pick: diff => E.diaT("gas-pick", diff, 2, () => { const sets = { a: { N: 100, T: 300, V: 10 }, b: { N: 200, T: 300, V: 10 }, c: { N: 100, T: 600, V: 20 } }; const order = E.shuffle(["a", "b", "c"]);
    const q = choice([["b", "the <b>highest pressure</b>"], ["a", "a pressure of <b>1 atm</b> with the fewest particles and the lowest temperature"]]);
    return { kind: "pick", title: "👆 Which has the highest pressure?", prompt: "Three containers of gas. Click " + q[1] + ".", answer: [q[0]], names: { a: "100 particles, 300 K, 10 L", b: "200 particles, 300 K, 10 L", c: "100 particles, 600 K, 20 L" },
      visual: stt => `<svg viewBox="0 0 900 220" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="220" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${6 + i * 298}" y="4" width="288" height="210" rx="14" fill="#fff" ${E.ring(stt[k])}/>${mini(sets[k], 20 + i * 298, sets[k].N + " particles · " + sets[k].T + " K · " + sets[k].V + " L")}</g>`).join("")}</svg>`,
      explain: "P ∝ N × T ÷ V: 1 atm, 2 atm and 1 atm. Doubling T and V together keeps the pressure the same.", summary: "Compare gas pressures" }; }),
  boyleNum: diff => E.diaT("gas-num", diff, 2, () => { const c = choice([[1, 12, 3], [2, 6, 4], [1.5, 8, 2], [3, 4, 6]]); const p2 = c[0] * c[1] / c[2];
    const pts = []; for (let v = 2; v <= 20; v += 0.5) pts.push([v, c[0] * c[1] / v]); const X = v => 60 + v * 32, Y = p => 250 - p * 40;
    const vis = `<svg viewBox="0 0 740 290" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="290" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map(p => `<line x1="60" x2="700" y1="${Y(p)}" y2="${Y(p)}" stroke="#eceff1"/>${T(52, Y(p) + 4, p, { a: "end", s: 11, c: "#78909c" })}`).join("")}${[0, 4, 8, 12, 16, 20].map(v => T(X(v), 272, v, { s: 11, c: "#78909c" })).join("")}
      <polyline points="${pts.filter(q => q[1] <= 5.5).map(q => X(q[0]) + "," + Y(q[1])).join(" ")}" fill="none" stroke="#7e57c2" stroke-width="4"/><circle cx="${X(c[1])}" cy="${Y(c[0])}" r="7" fill="#c62828"/>${T(X(c[1]) + 10, Y(c[0]) - 10, `${c[0]} atm, ${c[1]} L`, { a: "start", s: 13, c: "#c62828" })}
      ${T(380, 290, "volume (L)", { s: 12 })}${T(14, 18, "pressure (atm)", { a: "start", s: 12 })}</svg>`;
    return { kind: "num", title: "📈 Boyle's law", prompt: "The graph shows P against V for a gas at constant temperature.", visual: vis,
      fields: [{ label: "P × V (constant)", unit: "atm·L", answer: c[0] * c[1] }, { label: `Pressure when V = ${c[2]} L`, unit: "atm", answer: p2, tol: 0.011 }], explain: `P × V = ${c[0] * c[1]}. At ${c[2]} L: P = ${c[0] * c[1]} ÷ ${c[2]} = ${fmt(p2)} atm.`, summary: "Boyle's law calculation" }; }),
  kelvin: diff => E.diaT("gas-num", diff, 3, () => { const c = choice([[27, 2], [127, 0.5], [-73, 3]]); const K = c[0] + 273;
    return { kind: "num", title: "🌡️ Use kelvin!", prompt: `A gas at ${c[0]} °C is heated so its kelvin temperature is multiplied by ${c[1]} (volume and particles fixed).`, visual: render(st({ T: Math.max(100, Math.min(600, Math.round(K / 50) * 50)), showVals: false })),
      fields: [{ label: "Start temperature", unit: "K", answer: K }, { label: "New temperature", unit: "K", answer: K * c[1] }, { label: "Pressure change factor", unit: "×", answer: c[1] }], explain: `${c[0]} + 273 = ${K} K → ${K * c[1]} K. P ∝ T (in kelvin), so the pressure is multiplied by ${c[1]}.`, summary: "Gas laws use kelvin" }; }),
  mcq: diff => E.diaT("gas-mcq", diff, 1, () => { const q = choice([
      { ask: "What causes the pressure of a gas?", ok: "Particles colliding with the walls of the container", bad: ["Particles sticking together", "The weight of the container", "Particles stopping at the walls"], ex: "Every collision pushes on the wall; many collisions per second make the pressure." },
      { ask: "Why does heating a gas in a sealed can raise the pressure?", ok: "The particles move faster and hit the walls harder and more often", bad: ["The particles get bigger", "More particles are made", "The can gets smaller"], ex: "Higher temperature = higher kinetic energy = faster particles." },
      { ask: "You push a syringe in (smaller volume, same temperature). The pressure…", ok: "increases, because particles hit the walls more often", bad: ["decreases", "stays the same", "becomes zero"], ex: "Less space means more collisions per second on each part of the wall (Boyle's law)." }]);
    return { kind: "mcq", title: "📘 Particles and pressure", prompt: "Look at the gas particles.", visual: render(st({ N: 150, T: 450, V: 8, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Gas pressure ideas" }; })
};
const LEVELS = {
  1: { intro: "Pressure, particles and temperature (the volume is fixed at 10 L).", pool: () => [S(1, 1, C.half), S(1, 1, C.addN), S(2, 1, C.heat), S(3, 1, C.both), S(2, 1, C.addN), D.mcq(1), D.pick(2), D.kelvin(3)] },
  2: { intro: "Move the wall to change the volume. Boyle's law: P × V stays constant at the same temperature.", pool: () => [S(1, 1, C.boyle), S(2, 1, C.squeeze), S(2, 1, C.pump), S(3, 1, C.keep), D.mcq(1), D.boyleNum(2), D.pick(3)] },
  3: { intro: "Combine everything: P ∝ N × T ÷ V. Always use kelvin!", pool: () => [S(1, 1, C.charles), S(2, 1, C.balloon), S(2, 1, C.combo), S(3, 1, C.all3), D.boyleNum(1), D.kelvin(2), D.kelvin(3)] }
};
const explore = E.exploreSim({
  intro: "Pump particles in, heat or cool the gas and (higher levels) move the wall. Watch the particles and the pressure gauge.",
  state: () => st({ showVals: true }), controls: lv => ctls(lv), render,
  goals: lv => [{ txt: "Make the pressure higher than 2 atm", test: s => P(s) > 2 }, { txt: "Make the pressure lower than 0.5 atm", test: s => P(s) < 0.5 }].concat(lv >= 2 ? [{ txt: "Squeeze the gas into 5 L or less", test: s => s.V <= 5 }] : []),
  facts: () => "📘 Gas pressure comes from particle collisions with the walls. <b>P ∝ N × T ÷ V</b> (T in kelvin)."
});
E.start({ labId: "gas", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🎈", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🎈", "💨", "✨", "⭐"],
  exploreDemo: lv => [{ set: { N: 250 } }, { set: { N: 40 } }].concat(lv >= 2 ? [{ set: { V: 4 } }] : []) });
})();
