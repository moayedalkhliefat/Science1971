"use strict";
// ===== Enzymes — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const ENZ = { amylase: { n: "Amylase", pH: 7, sub: "starch", where: "mouth & small intestine" }, pepsin: { n: "Pepsin", pH: 2, sub: "protein", where: "stomach" }, lipase: { n: "Lipase", pH: 8, sub: "fat", where: "small intestine" } };
const fT = t => t <= 37 ? Math.exp(-Math.pow((t - 37) / 16, 2)) : Math.exp(-Math.pow((t - 37) / 8, 2));
const fP = (p, o) => Math.exp(-Math.pow((p - o) / 1.5, 2));
const sat = x => (x / (x + 2)) / (10 / 12);
const rate = s => Math.round(100 * fT(s.T) * fP(s.pH, ENZ[s.enz].pH) * sat(s.sub));
const denat = s => s.T > 50 || Math.abs(s.pH - ENZ[s.enz].pH) > 3;
const left = s => Math.max(0, 100 - Math.round(rate(s) * 1.25));
const pHcol = p => `hsl(${Math.round(p / 14 * 260)},75%,55%)`;
function curve(s, ax) {
  const R = ax === "T" ? [0, 80] : ax === "pH" ? [0, 14] : [0, 10], X0 = 600, Y0 = 250, W = 220, H = 150;
  const f = v => { const t = Object.assign({}, s); t[ax] = v; return rate(t); };
  let d = ""; for (let i = 0; i <= 80; i++) { const v = R[0] + (R[1] - R[0]) * i / 80; d += (i ? "L" : "M") + (X0 + W * i / 80).toFixed(1) + "," + (Y0 - H * f(v) / 100).toFixed(1); }
  const cv = s[ax], mx = X0 + W * (cv - R[0]) / (R[1] - R[0]), my = Y0 - H * rate(s) / 100;
  const lab = { T: "temperature (°C)", pH: "pH", sub: "substrate amount" }[ax];
  return `<rect x="575" y="40" width="265" height="260" rx="14" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>${T(707, 62, "RATE vs " + lab.toUpperCase(), { s: 12, c: "#00695c" })}
    <line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H - 6}" stroke="#607d8b"/>
    ${[0, 0.5, 1].map(k => T(X0 + W * k, Y0 + 18, fmt(R[0] + (R[1] - R[0]) * k), { s: 11, c: "#607d8b" })).join("")}${T(X0 - 8, Y0 - H + 4, "100%", { a: "end", s: 10, c: "#607d8b" })}
    ${s.reveal ? `<path d="${d}" fill="none" stroke="#26a69a" stroke-width="3"/>` : ""}<circle cx="${mx}" cy="${s.reveal ? my : Y0}" r="7" fill="#e53935" stroke="#fff" stroke-width="2"/>${T(X0 + W / 2, 290, lab, { s: 11, c: "#607d8b" })}`;
}
function render(s) {
  const r = rate(s), show = s.reveal, bad = denat(s), e = ENZ[s.enz];
  let g = `<rect width="860" height="450" fill="#eef8f6"/>`;
  // water bath
  const wc = s.T < 15 ? "#bbdefb" : s.T > 50 ? "#ffab91" : "#b2ebf2";
  g += `<g><rect x="30" y="60" width="240" height="230" rx="16" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>${T(150, 84, "WATER BATH", { s: 12, c: "#00695c" })}
    <rect x="60" y="150" width="180" height="120" rx="10" fill="${wc}" stroke="#78909c" stroke-width="2"/><path d="M60,150 q22,-8 45,0 t45,0 t45,0 t45,0" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>
    <rect x="132" y="104" width="34" height="140" rx="12" fill="#ffffffcc" stroke="#78909c" stroke-width="2"/><rect x="134" y="${show ? 150 + left(s) * 0.9 : 150}" width="30" height="${show ? 92 - left(s) * 0.9 : 92}" rx="10" fill="${pHcol(s.pH)}" opacity=".35"/>
    <rect x="134" y="150" width="30" height="${show ? left(s) * 0.92 : 92}" rx="10" fill="${show ? "#1a237e" : "#fff8e1"}" opacity="${show ? 0.75 : 0.9}"/>
    <rect x="206" y="90" width="12" height="160" rx="6" fill="#fff" stroke="#78909c"/><rect x="208" y="${250 - s.T * 1.9}" width="8" height="${s.T * 1.9 + 2}" rx="4" fill="#e53935"/><circle cx="212" cy="252" r="10" fill="#e53935"/>
    ${T(150, 300, `${s.T} °C · pH ${fmt(s.pH)}`, { s: 15, c: "#004d40" })}</g>`;
  // lock and key
  const cx = 420, cy = 170;
  g += `<g><rect x="290" y="60" width="265" height="240" rx="16" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>${T(422, 84, e.n.toUpperCase() + " + " + e.sub, { s: 12, c: "#00695c" })}
    ${bad && show ? `<path d="M${cx - 70},${cy - 40} q30,-30 60,-6 q30,24 50,-10 q30,40 0,80 q-40,30 -80,10 q-50,-20 -30,-74Z" fill="#80cbc4" stroke="#00796b" stroke-width="3"/>${T(cx, cy + 92, "shape changed — DENATURED", { s: 13, c: "#c62828" })}`
      : `<path d="M${cx - 80},${cy - 50} h90 v28 h-26 v44 h26 v28 h-90 q-24,0 -24,-24 v-52 q0,-24 24,-24Z" fill="#80cbc4" stroke="#00796b" stroke-width="3"/>${T(cx - 40, cy + 92, "active site fits the substrate", { s: 12, c: "#00695c" })}`}
    <rect x="${show && !bad && r > 15 ? cx - 16 : cx + 40}" y="${cy - 22}" width="${show && !bad && r > 15 ? 26 : 34}" height="44" rx="6" fill="#ffcc80" stroke="#ef6c00" stroke-width="2.5"/>
    ${show && r > 15 && !bad ? `<rect x="${cx + 40}" y="${cy - 60}" width="20" height="20" rx="4" fill="#ffe0b2" stroke="#ef6c00" stroke-width="2"/><rect x="${cx + 70}" y="${cy - 34}" width="20" height="20" rx="4" fill="#ffe0b2" stroke="#ef6c00" stroke-width="2"/>${T(cx + 80, cy + 50, "products", { s: 11, c: "#ef6c00" })}` : ""}
    ${T(422, 278, `${e.n}: best near pH ${e.pH}, 37 °C`, { s: 12, c: "#455a64" })}</g>`;
  g += curve(s, s.axis);
  // results strip
  g += `<g transform="translate(30,320)"><rect width="810" height="110" rx="14" fill="#fff" stroke="#b2dfdb" stroke-width="2"/>
    ${T(110, 30, "REACTION RATE", { s: 12, c: "#00695c" })}${T(110, 76, show ? r + "%" : "?", { s: 38, c: r >= 80 ? "#2e7d32" : r >= 30 ? "#ef6c00" : "#c62828" })}
    ${T(330, 30, "SUBSTRATE AMOUNT", { s: 12, c: "#00695c" })}${T(330, 76, s.sub + " units", { s: 24, c: "#004d40" })}
    ${T(600, 30, `IODINE TEST AFTER 5 MIN (${e.sub} left)`, { s: 12, c: "#00695c" })}${T(600, 76, show ? (s.enz === "amylase" ? (left(s) < 10 ? "orange-brown: no starch left ✔" : left(s) + "% starch left (blue-black)") : left(s) + "% " + e.sub + " left") : "press ▶", { s: 16, c: "#37474f" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "enz", type: "choice", label: "Enzyme", options: Object.keys(ENZ).map(v => ({ v, label: ENZ[v].n })), hide: () => lv < 2, lock: lk("enz") },
  { id: "T", type: "range", label: "Temperature", min: 0, max: 80, step: 1, nudge: 1, unit: "°C", lock: lk("T") },
  { id: "pH", type: "range", label: "pH", min: 1, max: 13, step: 0.5, nudge: 0.5, unit: "", hide: () => lv < 2, lock: lk("pH") },
  { id: "sub", type: "range", label: "Substrate", min: 1, max: 10, step: 1, nudge: 1, unit: "units", hide: () => lv < 3, lock: lk("sub") }]; };
const st = o => Object.assign({ enz: "amylase", T: 20, pH: 7, sub: 10, axis: "T" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${ENZ[s.enz].n} at ${s.T} °C, pH ${fmt(s.pH)}: rate ${rate(s)}%`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⚗️ Enzyme challenge", prompt: "Set the conditions, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Enzymes work fastest at their optimum (body temperature, 37 °C, and their best pH). Too hot or the wrong pH changes the active site — the enzyme is denatured." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("en-sim", diff, uses, mk);
const C = {
  best: () => simQ(1, "Find the <b>best temperature</b> for amylase (fastest rate).", st({ T: 15 }), s => ok(Math.abs(s.T - 37) <= 2, say(s) + " — body temperature is the optimum.", say(s) + "."), { T: 37 }, { wrong: { T: 50 } }),
  cold: () => simQ(1, "Make the enzyme work <b>very slowly because it is too cold</b> (rate under 10%).", st({ T: 37 }), s => ok(s.T < 37 && rate(s) < 10, say(s) + ": particles move slowly, few collisions.", s.T >= 37 ? "Cool it down!" : say(s) + " — colder!"), { T: 2 }, { wrong: { T: 25 } }),
  hot: () => simQ(1, "<b>Denature</b> the enzyme with heat so it stops completely.", st({ T: 37 }), s => ok(s.T > 50 && rate(s) === 0, say(s) + ": the active site lost its shape.", say(s) + " — hotter!"), { T: 70 }, { wrong: { T: 45 } }),
  digest: () => simQ(1, "Digest <b>all the starch</b> in 5 minutes (iodine turns orange-brown).", st({ T: 10 }), s => ok(left(s) < 10, say(s) + " — no starch left.", say(s) + `, ${left(s)}% starch left.`), { T: 37 }, { wrong: { T: 25 } }),
  bestPH: () => simQ(2, "Find the <b>best pH</b> for amylase at 37 °C.", st({ T: 37, pH: 3, axis: "pH" }), s => ok(s.pH === 7, say(s) + " — amylase works best at neutral pH.", say(s) + "."), { pH: 7 }, { lock: ["enz", "T"], wrong: { pH: 9 } }),
  stomach: () => simQ(2, "In the <b>stomach</b> (pH 2, 37 °C), choose the enzyme that works fastest.", st({ T: 37, pH: 2, axis: "pH" }), s => ok(s.enz === "pepsin", say(s) + " — pepsin digests protein in stomach acid.", say(s) + "."), { enz: "pepsin" }, { lock: ["T", "pH"], wrong: { enz: "amylase" } }),
  intestine: () => simQ(2, "In the <b>small intestine</b> (pH 8), which enzyme is fastest?", st({ T: 37, pH: 8, axis: "pH" }), s => ok(s.enz === "lipase", say(s) + " — lipase's optimum is pH 8.", say(s) + "."), { enz: "lipase" }, { lock: ["T", "pH"], wrong: { enz: "pepsin" } }),
  slowPH: () => simQ(2, "Slow amylase to between <b>50% and 70%</b> by changing <b>only the pH</b>.", st({ T: 37, pH: 7, axis: "pH" }), s => ok(rate(s) >= 50 && rate(s) <= 70, say(s) + ".", say(s) + "."), { pH: 6 }, { lock: ["enz", "T"], wrong: { pH: 5 } }),
  sub80: () => simQ(3, "At 37 °C and pH 7, reach <b>80%</b> rate using the <b>least</b> substrate.", st({ T: 37, pH: 7, sub: 10, axis: "sub" }), s => ok(rate(s) >= 80 && s.sub === 4, say(s) + " with 4 units.", rate(s) < 80 ? say(s) + " — add substrate." : "You can use less substrate."), { sub: 4 }, { lock: ["enz", "T", "pH"], wrong: { sub: 3 } }),
  sub60: () => simQ(3, "Make the rate exactly <b>60%</b> (37 °C, pH 7) by changing the substrate.", st({ T: 37, pH: 7, sub: 10, axis: "sub" }), s => ok(rate(s) === 60, "2 units of substrate → 60%: not enough substrate to fill all active sites.", say(s) + "."), { sub: 2 }, { lock: ["enz", "T", "pH"], wrong: { sub: 4 } }),
  hot45: () => simQ(3, "The bath is stuck at <b>45 °C</b>. Get the <b>highest rate</b> you can from amylase.", st({ T: 45, pH: 4, sub: 3, axis: "pH" }), s => ok(s.pH === 7 && s.sub === 10, say(s) + " — best pH and lots of substrate.", say(s) + " — you can do better."), { pH: 7, sub: 10 }, { lock: ["enz", "T"], wrong: { pH: 7, sub: 5 } }),
  pepsinBest: () => simQ(3, "Set up <b>pepsin</b> to digest protein as fast as possible.", st({ enz: "pepsin", T: 20, pH: 7, sub: 5, axis: "T" }), s => ok(Math.abs(s.T - 37) <= 2 && s.pH === 2 && s.sub === 10, say(s) + ".", say(s) + " — optimise temperature, pH and substrate."), { T: 37, pH: 2, sub: 10 }, { lock: ["enz"], wrong: { T: 37, pH: 7, sub: 10 } })
};
const D = {
  pick: diff => E.diaT("en-pick", diff, 2, () => { const want = choice(["opt", "den", "cold"]), pts = { cold: 10, opt: 37, den: 60, mid: 25 };
    const s = st({ reveal: true }), X0 = 120, W = 620, Y0 = 250, H = 190, f = v => rate(Object.assign({}, s, { T: v }));
    let d = ""; for (let i = 0; i <= 80; i++) d += (i ? "L" : "M") + (X0 + W * i / 80) + "," + (Y0 - H * f(i) / 100);
    const q = { opt: "Click the point where the enzyme works <b>fastest</b> (optimum).", den: "Click the point where the enzyme is <b>denatured</b>.", cold: "Click the point where it is slow because it is <b>too cold</b> (not damaged)." }[want];
    return { kind: "pick", title: "📈 Read the graph", prompt: q, answer: [want], names: { cold: "10 °C", opt: "37 °C", den: "60 °C", mid: "25 °C" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#eef8f6"/><line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="40" stroke="#607d8b"/>${[0, 20, 40, 60, 80].map(v => T(X0 + W * v / 80, Y0 + 20, v + " °C", { s: 12, c: "#607d8b" })).join("")}${T(60, 140, "rate", { s: 13, c: "#607d8b" })}<path d="${d}" fill="none" stroke="#26a69a" stroke-width="4"/>${Object.entries(pts).map(([k, v]) => `<g class="pk" data-k="${k}"><circle cx="${X0 + W * v / 80}" cy="${Y0 - H * f(v) / 100}" r="16" fill="#fff" stroke="#00796b" stroke-width="3"/><circle cx="${X0 + W * v / 80}" cy="${Y0 - H * f(v) / 100}" r="16" fill="none" ${E.ring(s2[k])}/>${T(X0 + W * v / 80, Y0 - H * f(v) / 100 + 5, v + "", { s: 11, c: "#004d40" })}</g>`).join("")}</svg>`,
      explain: "Rate rises with temperature up to 37 °C (optimum), then falls quickly as the enzyme denatures. When cold, the enzyme is slow but not damaged.", summary: "Enzyme rate graph" }; }),
  num: diff => E.diaT("en-num", diff, 2, () => { const c = choice([[60, 4, 90], [30, 5, 48], [24, 3, 40], [45, 9, 25]]);
    return { kind: "num", title: "🧮 Rate of reaction", prompt: `An enzyme digests <b>${c[0]} g</b> of starch in <b>${c[1]} min</b>.`, visual: render(st({ T: 37, reveal: true })),
      fields: [{ label: "Rate", unit: "g/min", answer: c[0] / c[1] }, { label: `Time to digest ${c[2]} g at the same rate`, unit: "min", answer: c[2] / (c[0] / c[1]), tol: 0.05 }], explain: `Rate = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} g/min; time = ${c[2]} ÷ ${fmt(c[0] / c[1])} = ${fmt(c[2] / (c[0] / c[1]))} min.`, summary: "Enzyme rate calculation" }; }),
  mcq: diff => E.diaT("en-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does an enzyme stop working at 70 °C?", ok: "Its active site changes shape (denatured)", bad: ["It runs out of energy", "It is used up in the reaction", "It turns into starch"], ex: "Heat breaks bonds in the protein, so the substrate no longer fits." },
      { ask: "Which statement about enzymes is TRUE?", ok: "They speed up reactions and are not used up", bad: ["They are made of fat", "Each enzyme works on every substrate", "They work faster when boiled"], ex: "Enzymes are protein catalysts — reusable and specific." },
      { ask: "Why does pepsin work well in the stomach but amylase does not?", ok: "Pepsin's optimum pH is acidic (about 2)", bad: ["The stomach is too cold for amylase", "Amylase only works on fat", "Pepsin is not a protein"], ex: "Each enzyme has an optimum pH; the stomach is very acidic." }]);
    return { kind: "mcq", title: "📘 Enzyme ideas", prompt: "Think about the lock-and-key model.", visual: render(st({ T: 70, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Enzyme concepts" }; })
};
const LEVELS = {
  1: { intro: "Amylase digests starch. Change the temperature of the water bath and watch the rate.", pool: () => [S(1, 1, C.best), S(2, 1, C.cold), S(2, 1, C.digest), S(3, 1, C.hot), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Each enzyme has its own best pH. Match the enzyme to the part of the gut.", pool: () => [S(1, 1, C.bestPH), S(2, 1, C.stomach), S(2, 1, C.intestine), S(3, 1, C.slowPH), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Control temperature, pH AND substrate amount to plan exact reaction rates.", pool: () => [S(1, 1, C.sub60), S(2, 1, C.sub80), S(3, 1, C.hot45), S(3, 1, C.pepsinBest), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change the water-bath temperature and press ▶ to test amylase with starch.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Test",
  goals: () => [{ txt: "Find a temperature where it works fast", test: (s, m) => m.fast }, { txt: "Make it very slow by cooling", test: (s, m) => m.cold }, { txt: "Denature it with heat", test: (s, m) => m.hot }],
  track: (s, m, ran) => { if (!ran) return; const r = rate(s); if (r >= 80) m.fast = 1; if (s.T < 37 && r < 15) m.cold = 1; if (s.T > 50 && r === 0) m.hot = 1; },
  facts: () => "📘 Enzymes are <b>biological catalysts</b>. The substrate fits the <b>active site</b> like a key in a lock. High temperature or the wrong pH <b>denatures</b> the enzyme."
});
E.start({ labId: "enzymes", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚗️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚗️", "🔑", "🧪", "✨"],
  exploreDemo: () => [{ set: { T: 37 }, run: true }, { set: { T: 3 }, run: true }, { set: { T: 70 }, run: true }] });
})();
