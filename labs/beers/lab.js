"use strict";
// ===== Beer's Law Lab — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000;
const LIGHT = { red: { name: "Red (650 nm)", c: "#e53935" }, green: { name: "Green (530 nm)", c: "#43a047" }, blue: { name: "Blue (450 nm)", c: "#1e88e5" } };
const SOL = { kmno4: { name: "KMnO₄ (purple)", c: [123, 31, 162], eps: { green: 0.2, blue: 0.05, red: 0.02 } }, cuso4: { name: "CuSO₄ (blue)", c: [21, 101, 192], eps: { red: 0.1, green: 0.02, blue: 0.01 } }, drink: { name: "Drink mix (red)", c: [198, 40, 40], eps: { green: 0.15, blue: 0.08, red: 0.01 } } };
const eps = s => SOL[s.sol].eps[s.light];
const Ab = s => r3(eps(s) * s.b * s.c);
const Tp = s => r2(100 * Math.pow(10, -Ab(s)));
function render(s) {
  const show = s.reveal, L = LIGHT[s.light], S = SOL[s.sol], a = Ab(s), t = Tp(s) / 100, op = Math.min(0.95, 0.08 + s.c * 0.09);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  const y = 110, cw = 40 + s.b * 40, cx0 = 260 - cw / 2;
  g += `<rect x="40" y="${y - 34}" width="70" height="68" rx="10" fill="#37474f"/><circle cx="96" cy="${y}" r="16" fill="${L.c}"/>${T(75, y + 52, "light", { s: 11, c: "#546e7a" })}`;
  g += `<rect x="110" y="${y - 10}" width="${cx0 - 110}" height="20" fill="${L.c}" opacity=".75"/>`;
  g += `<rect x="${cx0}" y="${y - 50}" width="${cw}" height="100" rx="4" fill="rgba(${S.c.join(",")},${op})" stroke="#90a4ae" stroke-width="3"/><line x1="${cx0}" y1="${y + 64}" x2="${cx0 + cw}" y2="${y + 64}" stroke="#78909c" stroke-width="1.5" marker-start="url(#bl)" marker-end="url(#bl)"/>${T(260, y + 82, "path b = " + s.b + " cm", { s: 12, c: "#546e7a" })}${T(260, y - 60, S.name + " · " + s.c + " mM", { s: 12, c: "#37474f" })}`;
  g += `<rect x="${cx0 + cw}" y="${y - 10}" width="${440 - cx0 - cw}" height="20" fill="${L.c}" opacity="${show ? 0.75 * t : 0.15}"/>`;
  g += `<rect x="440" y="${y - 40}" width="110" height="80" rx="10" fill="#263238"/>${T(495, y - 12, "detector", { s: 11, c: "#b0bec5" })}${T(495, y + 18, show ? fmt(Tp(s)) + " %T" : "— %T", { s: 18, c: "#80deea" })}`;
  // graph A vs c
  const gx = r => 90 + r * 44, gy = v => 400 - Math.min(2.2, v) * 90;
  g += `<rect x="50" y="200" width="520" height="220" fill="#fafafa" stroke="#eceff1"/><line x1="90" y1="400" x2="550" y2="400" stroke="#90a4ae" stroke-width="1.5"/><line x1="90" y1="400" x2="90" y2="206" stroke="#90a4ae" stroke-width="1.5"/>${T(548, 416, "concentration (mM)", { a: "end", s: 11, c: "#546e7a" })}${T(96, 216, "absorbance A", { a: "start", s: 11, c: "#546e7a" })}`;
  [0, 2, 4, 6, 8].forEach(c => g += T(gx(c), 414, c, { s: 10, c: "#90a4ae" }));
  [0.5, 1, 1.5, 2].forEach(v => g += `<line x1="90" y1="${gy(v)}" x2="550" y2="${gy(v)}" stroke="#f0f0f0"/>${T(86, gy(v) + 4, v, { a: "end", s: 10, c: "#90a4ae" })}`);
  const aMax = eps(s) * s.b * 10; g += `<line x1="${gx(0)}" y1="${gy(0)}" x2="${gx(Math.min(10, aMax > 2.2 ? 2.2 / (eps(s) * s.b) : 10))}" y2="${gy(Math.min(2.2, aMax))}" stroke="${L.c}" stroke-width="2.5" opacity=".7"/>`;
  if (show) g += `<circle cx="${gx(s.c)}" cy="${gy(a)}" r="7" fill="#ff7043" stroke="#fff" stroke-width="2"/>`;
  g += `<defs><marker id="bl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="#78909c"/></marker></defs>`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 58, L.name + " light", { s: 13, c: L.c })}${T(120, 80, "ε = " + eps(s) + " per mM per cm", { s: 12, c: "#546e7a" })}
    ${show ? T(120, 120, "absorbance", { s: 12, c: "#78909c" }) + T(120, 152, "A = " + fmt(a), { s: 24, c: "#e65100" }) + T(120, 196, "transmittance", { s: 12, c: "#78909c" }) + T(120, 226, fmt(Tp(s)) + " %", { s: 22, c: "#00838f" }) + T(120, 262, `${eps(s)} × ${s.b} × ${s.c} = ${fmt(a)}`, { s: 12, c: "#546e7a" }) : T(120, 180, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 330, "A = ε × b × c", { s: 15, c: "#37474f" })}${T(120, 356, "%T = 100 × 10^(−A)", { s: 13, c: "#37474f" })}${T(120, 382, "more absorbed → less transmitted", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "sol", type: "select", label: "Solution", options: Object.keys(SOL).map(v => ({ v, label: SOL[v].name })), lock: lk("sol") },
  { id: "light", type: "choice", label: "Light colour", options: Object.keys(LIGHT).map(v => ({ v, label: v[0].toUpperCase() + v.slice(1) })), lock: lk("light") },
  { id: "c", type: "range", label: "Concentration", min: 0, max: 10, step: 0.5, nudge: 0.5, unit: "mM", lock: lk("c") },
  { id: "b", type: "choice", label: "Cuvette width (path length)", options: [0.5, 1, 2].map(v => ({ v, label: v + " cm" })), lock: lk("b") }]; };
const st = o => Object.assign({ sol: "kmno4", light: "green", c: 2, b: 1 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `A = ${fmt(Ab(s))}, %T = ${fmt(Tp(s))}%.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔦 Absorbance challenge", prompt: "Set up the experiment, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "A coloured solution absorbs the colour opposite to its own (purple absorbs green, blue absorbs red, red absorbs green). Beer's law: A = ε × b × c. %T = 100 × 10^(−A): A = 1 lets 10% through, A = 0.3 lets about 50% through." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("bl-sim", diff, uses, mk);
const C = {
  most: () => simQ(1, "Choose the light colour that <b>KMnO₄</b> (purple) <b>absorbs the most</b>.", st({ light: "red", c: 4 }), s => ok(s.light === "green", "Purple solutions absorb green light.", `${LIGHT[s.light].name}: A = ${fmt(Ab(s))} — another colour is absorbed more.`), { light: "green" }, { lock: ["sol", "c", "b"], wrong: { light: "blue" } }),
  cuRed: () => simQ(1, "Choose the light that gives the <b>lowest %T</b> through <b>CuSO₄</b>.", st({ sol: "cuso4", light: "blue", c: 6 }), s => ok(s.light === "red", "Blue solutions absorb red light.", `%T = ${fmt(Tp(s))}% — try another colour.`), { light: "red" }, { lock: ["sol", "c", "b"], wrong: { light: "green" } }),
  clear: () => simQ(1, "Make <b>100%</b> of the light reach the detector — without changing the light colour.", st({ c: 3 }), s => ok(Tp(s) === 100, "No dissolved dye → nothing absorbs.", said(s)), { c: 0 }, { lock: ["sol", "light", "b"], wrong: { c: 0.5 } }),
  half: () => simQ(1, "KMnO₄ in green light: let about <b>50%</b> of the light through (within 1%).", st({ c: 4 }), s => ok(Math.abs(Tp(s) - 50) <= 1, "1.5 mM: A = 0.3 → about 50%.", said(s)), { c: 1.5 }, { lock: ["sol", "light", "b"], wrong: { c: 2 } }),
  a1: () => simQ(2, "Make the absorbance exactly <b>1.0</b>.", st({ c: 2 }), s => ok(Ab(s) === 1, "0.2 × 1 × 5 = 1.0.", said(s)), { c: 5 }, { lock: ["sol", "light", "b"], wrong: { c: 4.5 } }),
  dbl: () => simQ(2, "<b>Double</b> the absorbance by changing <b>only the cuvette</b>.", st({ c: 2.5, b: 1 }), s => ok(Ab(s) === 1, "2 cm: twice the path → twice the absorbance (0.5 → 1.0).", said(s)), { b: 2 }, { lock: ["sol", "light", "c"], wrong: { b: 0.5 } }),
  a04: () => simQ(2, "With the <b>0.5 cm</b> cuvette, make A = <b>0.4</b>.", st({ c: 2, b: 0.5 }), s => ok(Ab(s) === 0.4, "0.2 × 0.5 × 4 = 0.4.", said(s)), { c: 4 }, { lock: ["sol", "light", "b"], wrong: { c: 3.5 } }),
  t10: () => simQ(2, "Let exactly <b>10%</b> of the light through. Use the concentration and the cuvette.", st({ c: 1, b: 0.5 }), s => ok(Math.abs(Tp(s) - 10) < 0.05, "A = 1.0 → 10% (e.g. 5 mM in 1 cm).", said(s)), { c: 5, b: 1 }, { lock: ["sol", "light"], wrong: { c: 4, b: 1 } }),
  cu06: () => simQ(3, "CuSO₄, red light, <b>2 cm</b> cuvette: find the concentration that gives <b>A = 0.6</b>.", st({ sol: "cuso4", light: "red", c: 1, b: 2 }), s => ok(Ab(s) === 0.6, "c = 0.6 ÷ (0.1 × 2) = 3 mM.", said(s)), { c: 3 }, { lock: ["sol", "light", "b"], wrong: { c: 6 } }),
  drink: () => simQ(3, "Drink mix in a <b>1 cm</b> cuvette: choose the light and concentration to get <b>A = 0.75</b>.", st({ sol: "drink", light: "red", c: 2, b: 1 }), s => ok(Ab(s) === 0.75, "Green light (ε 0.15) × 5 mM = 0.75.", said(s)), { light: "green", c: 5 }, { lock: ["sol", "b"], wrong: { light: "blue", c: 5 } }),
  who16: () => simQ(3, "With <b>4 mM</b> in a <b>2 cm</b> cuvette, choose the solution and light that give <b>A = 1.6</b>.", st({ sol: "cuso4", light: "blue", c: 4, b: 2 }), s => ok(Ab(s) === 1.6, "ε must be 0.2 → KMnO₄ in green light.", said(s)), { sol: "kmno4", light: "green" }, { lock: ["c", "b"], wrong: { sol: "drink", light: "green" } }),
  t2030: () => simQ(3, "Using <b>CuSO₄</b>, get the %T between <b>20% and 30%</b>.", st({ sol: "cuso4", light: "green", c: 2, b: 1 }), s => ok(Tp(s) >= 20 && Tp(s) <= 30, `%T = ${fmt(Tp(s))}% (A ≈ 0.52–0.70).`, said(s)), { light: "red", c: 6, b: 1 }, { lock: ["sol"], wrong: { light: "red", c: 3, b: 1 } })
};
const D = {
  pick: diff => E.diaT("bl-pick", diff, 2, () => {
    if (diff === 1) {
      const pool = E.shuffle([[1, 0.5], [2, 1], [4, 1], [3, 2], [8, 0.5], [6, 2], [1, 2]]).slice(0, 4).map(c => st({ c: c[0], b: c[1] }));
      const want = choice(["low", "high"]), vals = pool.map(Ab), best = want === "low" ? Math.max(...vals) : Math.min(...vals);
      return { kind: "pick", many: vals.filter(v => v === best).length > 1, title: "👆 Which lets through…", prompt: `KMnO₄ in green light. Click the cuvette that lets through the <b>${want === "low" ? "least" : "most"}</b> light.`, answer: pool.map((s, i) => Ab(s) === best ? "k" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["k" + i, s.c + " mM, " + s.b + " cm"])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212, w = 30 + s.b * 40; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><rect x="${x + 98 - w / 2}" y="60" width="${w}" height="140" rx="4" fill="rgba(123,31,162,${Math.min(0.95, 0.08 + s.c * 0.09)})" stroke="#90a4ae" stroke-width="3"/>${T(x + 98, 236, s.c + " mM", { s: 16, c: "#37474f" })}${T(x + 98, 260, "path " + s.b + " cm", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Absorbance = ε × b × c: more concentrated or a longer path → more absorbed, less transmitted. " + pool.map(s => `${s.c}×${s.b}`).join(", ") + ".", summary: "Path and concentration" };
    }
    const target = choice([1, 2, 3, 4, 6]), A = r2(0.2 * target), pts = E.shuffle([1, 2, 3, 4, 5, 6, 7].filter(c => c !== target)).slice(0, 3).concat(target).sort((a, b) => a - b);
    return { kind: "pick", title: "👆 Calibration curve", prompt: `A KMnO₄ sample of unknown concentration has <b>A = ${A}</b> (green light, 1 cm). Click its concentration on the calibration line.`, answer: ["c" + target], names: Object.fromEntries(pts.map(c => ["c" + c, c + " mM"])),
      visual: s2 => { const gx = c => 100 + c * 90, gy = a => 260 - a * 140; let g = `<rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="10" width="780" height="280" rx="14" fill="#fff" stroke="#cfd8dc"/><line x1="100" y1="260" x2="790" y2="260" stroke="#90a4ae" stroke-width="2"/><line x1="100" y1="260" x2="100" y2="24" stroke="#90a4ae" stroke-width="2"/>${T(786, 280, "concentration (mM)", { a: "end", s: 12, c: "#546e7a" })}${T(106, 34, "A", { a: "start", s: 13, c: "#546e7a" })}<line x1="${gx(0)}" y1="${gy(0)}" x2="${gx(7.5)}" y2="${gy(1.5)}" stroke="#43a047" stroke-width="3"/>`;
        [0.4, 0.8, 1.2].forEach(a => g += `<line x1="100" y1="${gy(a)}" x2="790" y2="${gy(a)}" stroke="#f0f0f0"/>${T(94, gy(a) + 4, a, { a: "end", s: 11, c: "#78909c" })}`);
        pts.forEach(c => g += `<g class="pk" data-k="c${c}"><circle cx="${gx(c)}" cy="${gy(0.2 * c)}" r="20" fill="transparent"/><circle cx="${gx(c)}" cy="${gy(0.2 * c)}" r="8" fill="#ff7043" stroke="#fff" stroke-width="2"/>${T(gx(c), 278 - 4, c, { s: 12, c: "#37474f" })}<circle cx="${gx(c)}" cy="${gy(0.2 * c)}" r="16" fill="none" ${E.ring(s2["c" + c])}/></g>`);
        return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}</svg>`; },
      explain: `c = A ÷ (ε × b) = ${A} ÷ 0.2 = ${target} mM.`, summary: "Using a calibration curve" };
  }),
  num: diff => E.diaT("bl-num", diff, 2, () => {
    if (diff < 3) { const e = choice([0.2, 0.1, 0.15]), b = choice([0.5, 1, 2]), c = choice([2, 3, 4, 5]);
      return { kind: "num", title: "🧮 Beer's law", prompt: `ε = <b>${e}</b> per mM per cm, path b = <b>${b} cm</b>, concentration c = <b>${c} mM</b>.`, visual: render(st({ c, b })), fields: [{ label: "Absorbance A", unit: "", answer: r3(e * b * c) }], explain: `${e} × ${b} × ${c} = ${fmt(r3(e * b * c))}.`, summary: "A = εbc" }; }
    const a = choice([1, 2, 0.5, 0.3]);
    return { kind: "num", title: "🧮 Absorbance to %T", prompt: `A solution has absorbance <b>A = ${a}</b>. Use %T = 100 × 10^(−A).`, visual: render(st({ c: a / 0.2, reveal: true })), fields: [{ label: "%T", unit: "%", answer: r2(100 * Math.pow(10, -a)), tol: 0.5 }], explain: `100 × 10^(−${a}) = ${fmt(r2(100 * Math.pow(10, -a)))}%.`, summary: "Absorbance and transmittance" };
  }),
  mcq: diff => E.diaT("bl-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does a copper sulfate solution look blue?", ok: "It absorbs red/orange light and lets blue light through", bad: ["It absorbs blue light", "It gives out blue light", "It reflects all colours"], ex: "We see the colours that are not absorbed." },
      { ask: "If you double the concentration, the absorbance…", ok: "doubles", bad: ["halves", "stays the same", "becomes zero"], ex: "A = εbc, so A is proportional to c." },
      { ask: "Why measure at the colour the solution absorbs most?", ok: "The absorbance changes most with concentration, so measurements are more accurate", bad: ["So the solution looks brighter", "Because that colour is cheaper", "To make the cuvette warmer"], ex: "A bigger ε gives a steeper calibration line." },
      { ask: "An absorbance of 2 means the solution lets through…", ok: "1% of the light", bad: ["2% of the light", "50% of the light", "20% of the light"], ex: "10^(−2) = 0.01 → 1%." }]);
    return { kind: "mcq", title: "📘 Light and solutions", prompt: "Think about colour, absorbance and transmittance.", visual: render(st({ c: 3, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Beer's law ideas" }; })
};
const LEVELS = {
  1: { intro: "A coloured solution absorbs some colours of light and lets others through.", pool: () => [S(1, 1, C.clear), S(2, 1, C.most), S(2, 1, C.cuRed), S(3, 1, C.half), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Beer's law: absorbance = ε × path length × concentration.", pool: () => [S(1, 1, C.a1), S(2, 1, C.dbl), S(2, 1, C.a04), S(3, 1, C.t10), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Use Beer's law like a chemist: choose the light, find unknown concentrations.", pool: () => [S(1, 1, C.cu06), S(2, 1, C.drink), S(3, 1, C.who16), S(3, 1, C.t2030), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Pick a solution and a light colour, change the concentration and the cuvette, then press ▶ to measure.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Measure",
  goals: () => [{ txt: "Find the colour KMnO₄ absorbs best", test: (s, m) => m.g }, { txt: "Make absorbance above 1", test: (s, m) => m.a }, { txt: "Let all the light through", test: (s, m) => m.t }],
  track: (s, m, ran) => { if (!ran) return; if (s.sol === "kmno4" && s.light === "green" && s.c > 0) m.g = 1; if (Ab(s) > 1) m.a = 1; if (Tp(s) === 100) m.t = 1; },
  facts: () => "📘 <b>Beer's law</b> (A = εbc) lets chemists find a concentration just by shining light through a sample."
});
E.start({ labId: "beers", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔦", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔦", "🧪", "🌈", "✨"],
  exploreDemo: () => [{ set: { sol: "kmno4", light: "green", c: 6, b: 1 }, run: true }, { set: { c: 0 }, run: true }] });
})();
