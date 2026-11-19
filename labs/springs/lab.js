"use strict";
// ===== Masses & Springs — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const g = 10, LIMIT = 40; // cm
const SPR = { s10: 10, s20: 20, s40: 40, s50: 50, A: 25, B: 16 };
const kEff = s => { const k = SPR[s.spr]; return s.arr === "parallel" ? 2 * k : s.arr === "series" ? k / 2 : k; };
const ext = s => Math.round(s.m / 1000 * g / kEff(s) * 100 * 100) / 100; // cm
const over = s => ext(s) > LIMIT + 1e-9;
const energy = s => Math.round(0.5 * kEff(s) * Math.pow(ext(s) / 100, 2) * 1000) / 1000;
const kLabel = s => (s.spr === "A" || s.spr === "B") ? "mystery spring " + s.spr : SPR[s.spr] + " N/m";
function coil(x, y1, y2, w, col) { const n = 14, h = (y2 - y1 - 20) / n; let d = `M${x},${y1} L${x},${y1 + 10}`; for (let i = 0; i < n; i++) d += ` L${x + (i % 2 ? -w : w)},${y1 + 10 + (i + 0.5) * h}`; d += ` L${x},${y2 - 10} L${x},${y2}`; return `<path d="${d}" fill="none" stroke="${col}" stroke-width="3.5" stroke-linejoin="round"/>`; }
function render(s) {
  const show = s.reveal || s.showVals, top = 40, sc = 5, nat = 110, x = Math.min(ext(s), 55), endY = top + nat + x * sc * (s.arr === "series" ? 1 : 1), cx = 330;
  let springs = "";
  if (s.arr === "parallel") springs = coil(cx - 22, top, endY, 14, over(s) ? "#c62828" : "#546e7a") + coil(cx + 22, top, endY, 14, over(s) ? "#c62828" : "#546e7a") + `<rect x="${cx - 34}" y="${endY - 4}" width="68" height="8" fill="#455a64"/>`;
  else if (s.arr === "series") { const mid = top + (endY - top) / 2; springs = coil(cx, top, mid, 14, "#546e7a") + `<circle cx="${cx}" cy="${mid}" r="5" fill="#455a64"/>` + coil(cx, mid, endY, 14, over(s) ? "#c62828" : "#546e7a"); }
  else springs = coil(cx, top, endY, 16, over(s) ? "#c62828" : "#546e7a");
  const mh = 20 + Math.sqrt(s.m) * 1.6, mw = 40 + Math.sqrt(s.m) * 1.6;
  let ruler = ""; for (let c = 0; c <= 50; c += 5) { const y = top + nat + c * sc; ruler += `<line x1="140" x2="${c % 10 ? 152 : 160}" y1="${y}" y2="${y}" stroke="#37474f" stroke-width="2"/>${c % 10 ? "" : T(132, y + 4, c + " cm", { a: "end", s: 11, c: "#37474f" })}`; }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#e8f1fb"/><rect x="120" y="${top - 16}" width="420" height="16" fill="#5d4037"/>
    <rect x="140" y="${top + nat - 8}" width="22" height="${50 * sc + 16}" fill="#fffde7" stroke="#bdbdbd"/>${ruler}<line x1="162" x2="${cx + 60}" y1="${top + nat}" y2="${top + nat}" stroke="#1e88e5" stroke-dasharray="6 5" stroke-width="2"/>${T(cx + 66, top + nat + 4, "no load", { a: "start", s: 11, c: "#1e88e5" })}
    ${springs}${s.m ? `<line x1="162" x2="${cx - mw / 2}" y1="${endY}" y2="${endY}" stroke="#e53935" stroke-width="2"/><rect x="${cx - mw / 2}" y="${endY + 4}" width="${mw}" height="${mh}" rx="5" fill="#78909c" stroke="#37474f" stroke-width="2"/>${T(cx, endY + 8 + mh / 2, s.m + " g", { s: 13, c: "#fff" })}` : ""}
    <g transform="translate(590,40)"><rect width="250" height="${show ? 220 : 130}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(125, 28, kLabel(s) + (s.arr !== "single" ? " × 2 (" + s.arr + ")" : ""), { s: 14, c: "#0d47a1" })}
      ${T(125, 56, "mass " + s.m + " g → force " + fmt(s.m / 1000 * g) + " N", { s: 13, c: "#37474f" })}${T(125, 96, show ? "extension " + fmt(ext(s)) + " cm" : "extension ? cm", { s: 20, c: "#c62828" })}
      ${show ? (over(s) ? T(125, 132, "⚠ beyond the elastic limit!", { s: 14, c: "#c62828" }) + T(125, 154, "the spring will not return", { s: 12, c: "#c62828" }) : T(125, 132, "✓ within the elastic limit (40 cm)", { s: 13, c: "#2e7d32" })) + (s.lv >= 3 ? T(125, 186, "k (total) = " + fmt(kEff(s)) + " N/m", { s: 13, c: "#1565c0" }) + T(125, 208, "energy stored ½kx² = " + fmt(energy(s)) + " J", { s: 13, c: "#1565c0" }) : "") : ""}</g></svg>`;
}
const SP = (ks) => ks.map(v => ({ v, label: v === "A" || v === "B" ? "Mystery " + v : SPR[v] + " N/m" }));
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "spr", type: "choice", label: "Spring", options: SP(lv === 2 ? ["s20", "s40", "A", "B"] : ["s10", "s20", "s40", "s50"]), lock: lk("spr") },
  { id: "m", type: "range", label: "Hanging mass", min: 0, max: 1000, step: 50, nudge: 50, unit: "g", lock: lk("m") },
  { id: "arr", type: "choice", label: "Arrangement", options: [{ v: "single", label: "One spring" }, { v: "series", label: "Two in series" }, { v: "parallel", label: "Two in parallel" }], hide: () => lv < 3, lock: lk("arr") }]; };
const st = (lv, o) => Object.assign({ lv, spr: "s20", m: 0, arr: "single" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b) => Math.abs(a - b) < 0.01;
const say = s => `${s.m} g (${fmt(s.m / 100)} N) on ${kLabel(s)}${s.arr !== "single" ? " " + s.arr : ""}: ${fmt(ext(s))} cm`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔩 Spring challenge", prompt: "Choose the spring and the mass, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: lv >= 3 ? "Two springs in parallel: k doubles. In series: k halves. Energy stored = ½ k x² (x in metres)." : "Hooke's law: F = k × x. Force = mass (kg) × 10. Extension x = F ÷ k (in metres; × 100 for cm)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("spr-sim", diff, uses, mk);
const C = {
  x15: () => { const c = choice([[15, "s20", 300], [10, "s50", 500], [20, "s10", 200], [5, "s40", 200]]); return simQ(1, `Use the <b>${SPR[c[1]]} N/m</b> spring. Stretch it exactly <b>${c[0]} cm</b>.`, st(1, { spr: c[1] }), s => ok(near(ext(s), c[0]), `F = ${c[2] / 100} N, x = ${c[2] / 100} ÷ ${SPR[c[1]]} = ${c[0] / 100} m.`, say(s) + "."), { m: c[2] }, { lock: ["spr"], wrong: { m: c[2] + 50 } }); },
  spr: () => simQ(1, "A <b>400 g</b> mass must stretch the spring <b>10 cm</b>. Choose the spring.", st(1, { m: 400 }), s => ok(s.spr === "s40", "k = F ÷ x = 4 N ÷ 0.1 m = 40 N/m.", say(s) + "."), { spr: "s40" }, { lock: ["m"], wrong: { spr: "s50" } }),
  dbl: () => simQ(1, "On the <b>20 N/m</b> spring, 150 g gives 7.5 cm. Make the extension <b>double</b>.", st(1, { m: 150 }), s => ok(near(ext(s), 15), "Double the force → double the extension (proportional).", say(s) + "."), { m: 300 }, { lock: ["spr"], wrong: { m: 250 } }),
  stiff: () => simQ(1, "Hang <b>500 g</b> so the spring stretches the <b>least</b>.", st(1, { m: 500, spr: "s10" }), s => ok(s.spr === "s50", "The stiffest spring (biggest k) stretches least: 10 cm.", say(s) + "."), { spr: "s50" }, { lock: ["m"], wrong: { spr: "s40" } }),
  myst: () => { const c = choice([["A", 20, 500], ["B", 25, 400], ["A", 10, 250]]); return simQ(2, `Stretch <b>mystery spring ${c[0]}</b> exactly <b>${c[1]} cm</b>. (Test it first to find k!)`, st(2, { spr: c[0] }), s => ok(near(ext(s), c[1]), `k = ${SPR[c[0]]} N/m, so ${c[2]} g gives ${c[1]} cm.`, say(s) + "."), { m: c[2] }, { lock: ["spr"], wrong: { m: c[2] + 100 } }); },
  limit: () => simQ(2, "With the <b>20 N/m</b> spring, hang the <b>heaviest</b> mass that stays within the elastic limit (40 cm).", st(2, { spr: "s20" }), s => ok(s.m === 800, "8 N ÷ 20 N/m = 0.4 m = 40 cm: right at the limit.", over(s) ? "Beyond the elastic limit — the spring is damaged." : `${fmt(ext(s))} cm — a heavier mass is still safe.`), { m: 800 }, { lock: ["spr"], wrong: { m: 850 } }),
  same: () => simQ(2, "Make <b>mystery spring A</b> stretch <b>the same</b> as the 20 N/m spring with 400 g (20 cm).", st(2, { spr: "A" }), s => ok(near(ext(s), 20), "k(A) = 25 N/m, so it needs 5 N (500 g) for 20 cm.", say(s) + "."), { m: 500 }, { lock: ["spr"], wrong: { m: 400 } }),
  safe: () => simQ(2, "Hang <b>1000 g</b> without passing the elastic limit.", st(2, { m: 1000, spr: "B" }), s => ok(!over(s), say(s) + " — safe.", say(s) + " — beyond the limit!"), { spr: "s40" }, { lock: ["m"], wrong: { spr: "B" } }),
  par: () => simQ(3, "Two <b>20 N/m</b> springs in <b>parallel</b>: stretch them exactly <b>10 cm</b>.", st(3, { arr: "parallel" }), s => ok(s.arr === "parallel" && near(ext(s), 10), "Parallel: k = 40 N/m, so 4 N (400 g) → 10 cm.", say(s) + "."), { m: 400 }, { lock: ["spr", "arr"], wrong: { m: 200 } }),
  ser: () => simQ(3, "Using <b>two 40 N/m springs</b> and <b>400 g</b>, make the extension <b>20 cm</b>.", st(3, { spr: "s40", m: 400 }), s => ok(near(ext(s), 20), "Series: k = 20 N/m → 4 N ÷ 20 = 0.2 m.", say(s) + "."), { arr: "series" }, { lock: ["spr", "m"], wrong: { arr: "parallel" } }),
  en: () => simQ(3, "Store exactly <b>0.25 J</b> in a single <b>50 N/m</b> spring.", st(3, { spr: "s50" }), s => ok(Math.abs(energy(s) - 0.25) < 0.001 && s.arr === "single", "½ × 50 × 0.1² = 0.25 J (x = 10 cm, 500 g).", `Energy ${fmt(energy(s))} J.`), { m: 500 }, { lock: ["spr", "arr"], wrong: { m: 1000 } }),
  enPick: () => simQ(3, "With <b>600 g</b>, choose a spring and arrangement that store exactly <b>0.9 J</b>.", st(3, { m: 600 }), s => ok(Math.abs(energy(s) - 0.9) < 0.001, `½ × ${fmt(kEff(s))} × ${fmt(ext(s) / 100)}² = 0.9 J.`, `Energy ${fmt(energy(s))} J.`), { spr: "s20", arr: "single" }, { lock: ["m"], wrong: { spr: "s40", arr: "single" } })
};

// ---------- diagram tasks ----------
const D = {
  graph: diff => E.diaT("spr-num", diff, 2, () => { const k = choice([20, 25, 40, 50]), X = x => 70 + x * 1500, Y = F => 260 - F * 22;
    const vis = `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#fff"/>${[0, 2, 4, 6, 8, 10].map(F => `<line x1="70" x2="680" y1="${Y(F)}" y2="${Y(F)}" stroke="#eceff1"/>${T(62, Y(F) + 4, F, { a: "end", s: 11, c: "#78909c" })}`).join("")}${[0, 0.1, 0.2, 0.3, 0.4].map(x => T(X(x), 282, x, { s: 11, c: "#78909c" })).join("")}
      <line x1="${X(0)}" y1="${Y(0)}" x2="${X(Math.min(0.4, 10 / k))}" y2="${Y(k * Math.min(0.4, 10 / k))}" stroke="#1e88e5" stroke-width="4"/>${[0.05, 0.1, 0.15, 0.2].filter(x => k * x <= 10).map(x => `<circle cx="${X(x)}" cy="${Y(k * x)}" r="5" fill="#0d47a1"/>`).join("")}
      ${T(380, 298, "extension (m)", { s: 12 })}${T(16, 20, "force (N)", { a: "start", s: 12 })}</svg>`;
    return { kind: "num", title: "📈 Force–extension graph", prompt: "Read the graph for this spring.", visual: vis, fields: [{ label: "Force for 0.1 m extension", unit: "N", answer: k / 10 }, { label: "Spring constant k", unit: "N/m", answer: k }], explain: `Gradient = F ÷ x = ${k / 10} ÷ 0.1 = ${k} N/m.`, summary: "Spring constant from a graph" }; }),
  pick: diff => E.diaT("spr-pick", diff, 1, () => { const sets = { a: 10, b: 20, c: 50 }, order = E.shuffle(["a", "b", "c"]); const q = choice([["c", "the <b>stiffest</b> spring (largest k)"], ["a", "the spring with the <b>smallest</b> k"]]);
    return { kind: "pick", title: "👆 Which spring is stiffest?", prompt: "The same 400 g mass hangs on each spring. Click " + q[1] + ".", answer: [q[0]], names: { a: "the spring stretched most", b: "the middle spring", c: "the spring stretched least" },
      visual: st2 => `<svg viewBox="0 0 900 360" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="360" fill="#e8f1fb"/>${order.map((k, i) => { const x = 150 + i * 298, e = 4 / sets[k] * 100, y2 = 60 + 80 + e * 4;
        return `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="344" rx="14" fill="#fff" ${E.ring(st2[k])}/><rect x="${x - 60}" y="40" width="120" height="10" fill="#5d4037"/>${coil(x, 50, y2, 14, "#546e7a")}<rect x="${x - 26}" y="${y2 + 2}" width="52" height="34" rx="5" fill="#78909c"/>${T(x, y2 + 24, "400 g", { s: 12, c: "#fff" })}${T(x, 336, "Spring " + (i + 1), { s: 14 })}</g>`; }).join("")}</svg>`,
      explain: "With the same force, the stiffest spring (biggest k) stretches the least.", summary: "Compare spring stiffness" }; }),
  mcq: diff => E.diaT("spr-mcq", diff, 2, () => { const q = choice([
      { ask: "What does Hooke's law say?", ok: "Extension is proportional to the force (up to the limit)", bad: ["Extension is the same for every force", "Heavier masses stretch springs less", "Springs never stretch more than 10 cm"], ex: "F = kx: double the force → double the extension." },
      { ask: "What happens after a spring passes its elastic limit?", ok: "It does not return to its original length", bad: ["It becomes stiffer", "It obeys Hooke's law better", "It shrinks"], ex: "Beyond the elastic limit the spring is permanently deformed." },
      { ask: "Two identical springs are joined side by side (parallel). Compared with one spring, they stretch…", ok: "half as much", bad: ["twice as much", "the same", "four times as much"], ex: "Each spring carries half the force, so the extension halves (k doubles)." }]);
    return { kind: "mcq", title: "📘 Springs", prompt: "Think about springs and forces.", visual: render(st(3, { m: 400, arr: "parallel", showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Hooke's law ideas" }; }),
  eNum: diff => E.diaT("spr-num", diff, 3, () => { const c = choice([[40, 0.1], [20, 0.2], [50, 0.2], [100, 0.05]]);
    return { kind: "num", title: "⚡ Elastic energy", prompt: `A spring with k = ${c[0]} N/m is stretched ${c[1] * 100} cm.`, visual: render(st(3, { spr: "s40", m: 400, showVals: false })),
      fields: [{ label: "Force needed", unit: "N", answer: c[0] * c[1] }, { label: "Energy stored", unit: "J", answer: 0.5 * c[0] * c[1] * c[1], tol: 0.006 }], explain: `F = ${c[0]} × ${c[1]} = ${fmt(c[0] * c[1])} N. E = ½ × ${c[0]} × ${c[1]}² = ${fmt(0.5 * c[0] * c[1] * c[1])} J.`, summary: "Elastic potential energy" }; })
};
const LEVELS = {
  1: { intro: "Hooke's law: hang masses and measure the extension. F = k × x.", pool: () => [S(1, 1, C.dbl), S(1, 1, C.x15), S(2, 1, C.spr), S(2, 1, C.x15), S(3, 1, C.stiff), D.pick(1), D.mcq(2), D.graph(3)] },
  2: { intro: "Mystery springs and the elastic limit (40 cm). Test first, then plan.", pool: () => [S(1, 1, C.safe), S(2, 1, C.myst), S(2, 1, C.limit), S(3, 1, C.same), D.pick(1), D.graph(2), D.mcq(3)] },
  3: { intro: "Springs in series and parallel, and the energy stored in a stretched spring.", pool: () => [S(1, 1, C.par), S(2, 1, C.ser), S(3, 1, C.en), S(3, 1, C.enPick), D.graph(1), D.eNum(2), D.eNum(3)] }
};
const explore = E.exploreSim({
  intro: "Hang masses on different springs. Read the extension on the ruler.",
  state: lv => st(lv, { showVals: true, m: 200 }), controls: lv => ctls(lv), render,
  goals: lv => [{ txt: "Stretch a spring more than 20 cm", test: s => ext(s) > 20 }, { txt: "Try the stiffest spring", test: s => s.spr === (lv === 2 ? "s40" : "s50") }, { txt: "Go past the elastic limit", test: s => over(s) }].concat(lv >= 3 ? [{ txt: "Try springs in parallel", test: s => s.arr === "parallel" }] : []),
  facts: lv => "📘 <b>Hooke's law: F = k x</b>. The spring constant k (N/m) tells you how stiff the spring is." + (lv >= 3 ? " Energy stored = ½kx²." : "")
});
E.start({ labId: "springs", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔩", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔩", "⚖️", "⭐", "✨"],
  exploreDemo: lv => [{ set: { m: 500 } }, { set: { spr: lv === 2 ? "s40" : "s50" } }, { set: { spr: lv === 2 ? "s20" : "s10", m: 1000 } }].concat(lv >= 3 ? [{ set: { arr: "parallel" } }] : []) });
})();
