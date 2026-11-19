"use strict";
// ===== Photosynthesis — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const DIST = [10, 20, 30, 40, 50], COL = { white: [1, "#fffde7", "White"], red: [0.9, "#ef5350", "Red"], blue: [1, "#42a5f5", "Blue"], green: [0.15, "#66bb6a", "Green"] };
const PMAX = 60;
const inten = d => 100 * Math.pow(10 / d, 2);
const fT = t => t <= 30 ? t / 30 : Math.max(0, 1 - Math.pow((t - 30) / 15, 2));
function model(s) {
  const L = s.lamp ? 0.6 * inten(s.d) * COL[s.col][0] : 0, Cc = 15 * s.C, base = Math.min(L, Cc, PMAX), rate = base * fT(s.T);
  const lim = !s.lamp || L <= Math.min(Cc, PMAX) - 1e-9 ? "light" : Cc < Math.min(L, PMAX) - 1e-9 ? "carbon dioxide" : Math.abs(L - Cc) < 1e-9 && L < PMAX ? "light and CO₂" : fT(s.T) < 1 ? "temperature" : "none — maximum rate";
  return { L, Cc, rate: Math.round(rate * 10) / 10, lim };
}
function render(s) {
  const m = model(s), show = s.reveal || s.showVals, lx = 330 - s.d * 5, col = COL[s.col];
  const per = m.rate > 0 ? Math.max(0.35, 60 / Math.max(m.rate, 0.1) / 6) : 0; let bub = "";
  if (m.rate > 0) for (let i = 0; i < 6; i++) { const x = 392 + (i % 3) * 6; bub += `<circle cx="${x}" cy="300" r="${3 + (i % 2)}" fill="#e1f5fe" stroke="#81d4fa"><animate attributeName="cy" values="300;120" dur="${(per * 3).toFixed(2)}s" begin="-${(i * per / 2).toFixed(2)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" dur="${(per * 3).toFixed(2)}s" begin="-${(i * per / 2).toFixed(2)}s" repeatCount="indefinite"/></circle>`; }
  const beam = s.lamp ? `<polygon points="${lx + 30},170 ${lx + 30},250 360,310 360,120" fill="${col[1]}" opacity="${Math.min(0.5, 0.06 + inten(s.d) / 220)}"/>` : "";
  let ruler = ""; DIST.forEach(d => { const x = 330 - d * 5; ruler += `<line x1="${x}" x2="${x}" y1="392" y2="404" stroke="#558b2f" stroke-width="2"/>${T(x, 420, d + " cm", { s: 11, c: "#558b2f" })}`; });
  const thermo = (s.T - 5) / 40;
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f5fbef"/>
    ${beam}<g transform="translate(${lx},150)"><rect x="-10" y="20" width="40" height="60" rx="6" fill="#455a64"/><path d="M30,10 L52,-4 L52,104 L30,90 Z" fill="${s.lamp ? col[1] : "#cfd8dc"}" stroke="#37474f" stroke-width="2"/><rect x="0" y="80" width="12" height="160" fill="#607d8b"/><rect x="-24" y="236" width="60" height="10" rx="4" fill="#455a64"/></g>
    <line x1="80" x2="330" y1="398" y2="398" stroke="#558b2f" stroke-width="2"/>${ruler}${T(205, 440, "lamp distance from the plant", { s: 12, c: "#558b2f" })}
    <rect x="330" y="100" width="150" height="250" rx="10" fill="rgba(178,235,242,${0.25 + s.C * 0.08})" stroke="#4fc3f7" stroke-width="4"/>${T(405, 368, "water + " + fmt(s.C) + "% NaHCO₃", { s: 12, c: "#0277bd" })}
    <rect x="385" y="110" width="30" height="120" rx="8" fill="rgba(255,255,255,.5)" stroke="#90a4ae" stroke-width="2"/>
    <path d="M400,330 C392,300 410,280 398,250 C390,228 406,210 400,200" stroke="#2e7d32" stroke-width="5" fill="none"/>${[[392, 300, -30], [408, 280, 30], [392, 260, -35], [406, 240, 25], [394, 222, -30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="5" fill="#43a047" transform="rotate(${r} ${x} ${y})"/>`).join("")}${bub}
    <g transform="translate(500,110)"><rect x="0" y="0" width="16" height="200" rx="8" fill="#fff" stroke="#9e9e9e"/><rect x="4" y="${196 - 190 * thermo}" width="8" height="${190 * thermo}" fill="#e53935"/><circle cx="8" cy="208" r="12" fill="#e53935"/>${T(30, 20, s.T + " °C", { a: "start", s: 14, c: "#c62828" })}</g>
    <g transform="translate(570,40)"><rect width="215" height="300" rx="14" fill="#fff" stroke="#c5e1a5" stroke-width="2"/>${T(107, 26, "OXYGEN BUBBLES", { s: 12, c: "#689f38" })}
      ${T(107, 74, show ? fmt(m.rate) : "?", { s: 40, c: "#2e7d32" })}${T(107, 98, "bubbles per minute", { s: 13, c: "#558b2f" })}
      <line x1="16" x2="199" y1="116" y2="116" stroke="#e8f5e9" stroke-width="2"/>
      ${T(107, 140, "light: " + (s.lamp ? fmt(inten(s.d)) + "% intensity" : "lamp OFF"), { s: 13, c: "#33691e" })}${T(107, 162, "colour: " + col[2], { s: 13, c: "#33691e" })}
      ${T(107, 184, "CO₂ (NaHCO₃): " + fmt(s.C) + "%", { s: 13, c: "#33691e" })}${T(107, 206, "temperature: " + s.T + " °C", { s: 13, c: "#33691e" })}
      ${show ? `<rect x="12" y="226" width="191" height="60" rx="10" fill="#fff8e1"/>${T(107, 248, "limiting factor:", { s: 12, c: "#8d6e63" })}${T(107, 272, m.lim, { s: 14, c: "#e65100" })}` : ""}</g></svg>`;
}
const ctls = (lv, o) => { o = o || {}; const L = o.lv || lv, lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "d", type: "choice", label: "Lamp distance", options: DIST.map(v => ({ v, label: v + " cm" })), lock: lk("d") },
  { id: "C", type: "step", label: "CO₂ source (NaHCO₃ %)", min: 0, max: 4, step: 0.5, lock: lk("C") },
  { id: "T", type: "range", label: "Water temperature", min: 5, max: 45, step: 5, unit: "°C", hide: () => L < 2, lock: lk("T") },
  { id: "col", type: "choice", label: "Light colour", options: Object.keys(COL).map(k => ({ v: k, label: COL[k][2] })), hide: () => L < 2, lock: lk("col") },
  { id: "lamp", type: "toggle", label: "Lamp on", lock: lk("lamp") }
]; };
const st = (lv, o) => Object.assign({ lv, d: 30, C: 1, T: 30, col: "white", lamp: true }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 1100); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => { const m = model(s); return `${fmt(m.rate)} bubbles/min (limiting factor: ${m.lim})`; };
const R = s => model(s).rate;
const simQ = (goal, s0, check, sol, o) => ({ title: "🌱 Photosynthesis challenge", prompt: "Change the conditions for the pondweed, then press <b>▶ Run & check</b> to count the oxygen bubbles for 1 minute.", goal,
  sim: { state: s0, controls: ctls(s0.lv, o), render, run, check, hint: "The rate is held back by the factor in shortest supply (the limiting factor). Light intensity ∝ 1 ÷ distance². Green light is mostly reflected. The best temperature is about 30 °C." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ph-sim2", diff, uses, mk);
const C = {
  max: () => simQ("Make the pondweed produce the <b>maximum rate: 60 bubbles per minute</b>.", st(1), s => ok(R(s) === 60, "Strong light and plenty of CO₂: " + say(s) + ".", say(s) + "."), { d: 10, C: 4 }, { wrong: { d: 10, C: 2 } }),
  lamp15: () => simQ("Change <b>only the lamp distance</b> to get exactly <b>15 bubbles per minute</b>.", st(1, { C: 4, d: 50 }), s => ok(R(s) === 15, "At 20 cm the light intensity is 25%: " + say(s) + ".", say(s) + "."), { d: 20 }, { lock: ["C", "lamp"], wrong: { d: 30 } }),
  co2lim: () => simQ("The lamp is at <b>10 cm</b>. Make <b>CO₂ the limiting factor</b> with a rate of exactly <b>30 bubbles/min</b>.", st(1, { d: 10, C: 0 }), s => ok(R(s) === 30 && model(s).lim === "carbon dioxide", say(s) + ".", say(s) + "."), { C: 2 }, { lock: ["d", "lamp"], wrong: { C: 4 } }),
  double: () => simQ("Lamp at 10 cm, CO₂ 1% gives 15 bubbles/min. <b>Double the rate</b> by changing <b>one</b> factor.", st(1, { d: 10, C: 1 }), s => ok(R(s) === 30, "CO₂ was limiting — doubling it doubled the rate.", say(s) + "."), { C: 2 }, { lock: ["lamp"], wrong: { d: 20, C: 1 } }),
  dark: () => simQ("Show that the pondweed needs <b>light</b>: make the rate <b>zero</b> while CO₂ is 4%.", st(1, { C: 4 }), s => ok(R(s) === 0 && s.C === 4, "No light → no photosynthesis → no oxygen bubbles.", say(s) + "."), { lamp: false }, { lock: ["C"], wrong: { lamp: true, d: 50 } }),
  green: () => simQ("Lamp at 10 cm, CO₂ 4%. Choose the <b>light colour</b> that gives the <b>lowest</b> rate.", st(2, { d: 10, C: 4 }), s => ok(s.col === "green" && s.lamp, "Chlorophyll reflects green light, so it absorbs little of it: " + say(s) + ".", say(s) + " — another colour is lower."), { col: "green" }, { lv: 2, lock: ["d", "C", "T", "lamp"], wrong: { col: "red" } }),
  opt: () => simQ("Lamp 10 cm, CO₂ 4%. Find the <b>optimum temperature</b> (highest rate).", st(2, { d: 10, C: 4, T: 10 }), s => ok(s.T === 30, "30 °C: the enzymes work best.", say(s) + " — try other temperatures."), { T: 30 }, { lv: 2, lock: ["d", "C", "col", "lamp"], wrong: { T: 35 } }),
  t40: () => simQ("Lamp 10 cm, CO₂ 4%. Make the rate exactly <b>40 bubbles/min</b> by changing <b>only the temperature</b>.", st(2, { d: 10, C: 4 }), s => ok(R(s) === 40, "At 20 °C the rate is ⅔ of the maximum.", say(s) + "."), { T: 20 }, { lv: 2, lock: ["d", "C", "col", "lamp"], wrong: { T: 25 } }),
  blue30: () => simQ("Use <b>blue light</b> at <b>10 cm</b> and get exactly <b>30 bubbles/min</b>.", st(2, { col: "white", d: 30 }), s => ok(s.col === "blue" && s.d === 10 && R(s) === 30, say(s) + ".", s.col !== "blue" || s.d !== 10 ? "Use blue light at 10 cm." : say(s) + "."), { col: "blue", d: 10, C: 2 }, { lv: 2, wrong: { col: "blue", d: 10, C: 3 } }),
  hot: () => simQ("Lamp 10 cm, CO₂ 4%. Find a temperature where the rate drops to <b>0</b> because the enzymes are damaged.", st(2, { d: 10, C: 4 }), s => ok(R(s) === 0 && s.T > 30, "45 °C: the enzymes are denatured.", say(s) + "."), { T: 45 }, { lv: 2, lock: ["d", "C", "col", "lamp"], wrong: { T: 5 } }),
  four: () => simQ("The lamp is at <b>40 cm</b>. Move it so the rate becomes <b>exactly 4 times bigger</b>.", st(3, { d: 40, C: 4 }), s => ok(s.d === 20, "Half the distance → 4× the light (inverse square law): 3.75 → 15.", `Rate ${fmt(R(s))} = ${fmt(R(s) / 3.75)} × the start.`), { d: 20 }, { lv: 3, lock: ["C", "T", "col", "lamp"], wrong: { d: 10 } }),
  tlim: () => simQ("Make <b>temperature</b> the limiting factor with a rate of exactly <b>30 bubbles/min</b>.", st(3, { T: 30 }), s => ok(R(s) === 30 && model(s).lim === "temperature", say(s) + ".", say(s) + "."), { d: 10, C: 4, T: 15 }, { lv: 3, wrong: { d: 10, C: 2, T: 30 } }),
  co2set: () => simQ("CO₂ is <b>2%</b>. Choose the lamp distance so that <b>CO₂, not light</b>, limits the rate.", st(3, { C: 2, d: 50 }), s => ok(model(s).lim === "carbon dioxide", say(s) + ".", say(s) + "."), { d: 10 }, { lv: 3, lock: ["C", "T", "col", "lamp"], wrong: { d: 20 } }),
  red9: () => simQ("<b>Red light</b>, CO₂ 4%, 30 °C. Choose the distance that gives exactly <b>13.5 bubbles/min</b>.", st(3, { col: "red", C: 4, d: 50 }), s => ok(R(s) === 13.5, "0.6 × 25% × 0.9 = 13.5 at 20 cm.", say(s) + "."), { d: 20 }, { lv: 3, lock: ["C", "T", "col", "lamp"], wrong: { d: 10 } })
};

// ---------- diagram tasks ----------
const D = {
  inOut: diff => E.diaT("ps-pick", diff, 1, () => { const q = choice([["o2", "the gas that the plant <b>releases</b>"], ["co2", "the gas the plant <b>takes in</b>"], ["h2o", "the substance taken in by the <b>roots</b>"], ["sun", "the source of <b>energy</b>"], ["glu", "the <b>sugar</b> that is made"]]);
    const arrow = (k, x1, y1, x2, y2, label, c, st) => `<g class="pk" data-k="${k}"><rect x="${Math.min(x1, x2) - 50}" y="${Math.min(y1, y2) - 30}" width="${Math.abs(x2 - x1) + 100}" height="${Math.abs(y2 - y1) + 60}" rx="12" fill="rgba(255,255,255,.01)" ${E.ring(st[k])}/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="5"/>${(() => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L; return `<polygon points="${x2 + ux * 6},${y2 + uy * 6} ${x2 - ux * 14 - uy * 9},${y2 - uy * 14 + ux * 9} ${x2 - ux * 14 + uy * 9},${y2 - uy * 14 - ux * 9}" fill="${c}"/>`; })()}${T((x1 + x2) / 2, Math.min(y1, y2) - 8, label, { s: 15, c })}</g>`;
    return { kind: "pick", title: "👆 Inputs and outputs", prompt: "Click " + q[1] + ".", answer: [q[0]], names: { o2: "oxygen", co2: "carbon dioxide", h2o: "water", sun: "light", glu: "glucose" },
      visual: stt => `<svg viewBox="0 0 740 320" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="320" fill="#f5fbef"/><rect y="250" width="740" height="70" fill="#a1887f"/>
        <path d="M370,250 L370,130" stroke="#558b2f" stroke-width="8"/><ellipse cx="330" cy="150" rx="50" ry="18" fill="#66bb6a" transform="rotate(-20 330 150)"/><ellipse cx="410" cy="120" rx="50" ry="18" fill="#43a047" transform="rotate(20 410 120)"/><path d="M370,250 l-30,40 M370,250 l10,50 M370,250 l35,35" stroke="#6d4c41" stroke-width="4"/>
        <g class="pk" data-k="sun"><circle cx="90" cy="70" r="40" fill="#ffd54f" ${E.ring(stt.sun)}/>${T(90, 130, "?", { s: 16, c: "#f57f17" })}</g>
        ${arrow("co2", 180, 170, 290, 150, "gas A", "#607d8b", stt)}${arrow("o2", 460, 110, 590, 70, "gas B", "#29b6f6", stt)}${arrow("h2o", 230, 300, 340, 280, "substance C", "#1e88e5", stt)}${arrow("glu", 400, 190, 520, 230, "substance D", "#8d6e63", stt)}</svg>`,
      explain: "Carbon dioxide + water → (light, chlorophyll) → glucose + oxygen. CO₂ enters the leaves, water enters the roots, oxygen is released.", summary: "Photosynthesis inputs and outputs" }; }),
  graph: diff => E.diaT("ps-num", diff, 2, () => { const c = choice([{ C: 2, max: 30 }, { C: 3, max: 45 }, { C: 1, max: 15 }]);
    const pts = []; for (let i = 0; i <= 100; i += 5) pts.push([i, Math.min(0.6 * i, c.max)]); const X = i => 70 + i * 6, Y = r => 250 - r * 3.4;
    const bend = c.max / 0.6;
    const vis = `<svg viewBox="0 0 740 290" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="290" fill="#fff"/>${[0, 10, 20, 30, 40, 50, 60].map(r => `<line x1="70" x2="670" y1="${Y(r)}" y2="${Y(r)}" stroke="#eef3ea"/>${T(62, Y(r) + 4, r, { a: "end", s: 11, c: "#78909c" })}`).join("")}
      ${[0, 20, 40, 60, 80, 100].map(i => T(X(i), 270, i + "%", { s: 11, c: "#78909c" })).join("")}<polyline points="${pts.map(p => X(p[0]) + "," + Y(p[1])).join(" ")}" fill="none" stroke="#2e7d32" stroke-width="4"/>
      ${T(370, 288, "light intensity", { s: 12 })}${T(20, 20, "rate (bubbles/min)", { a: "start", s: 12 })}${T(560, Y(c.max) - 12, "CO₂ = " + c.C + "%", { s: 14, c: "#2e7d32" })}</svg>`;
    return { kind: "num", title: "📈 Limiting factors graph", prompt: "The graph shows the rate of photosynthesis as light intensity increases (CO₂ kept constant).", visual: vis,
      fields: [{ label: "Maximum rate", unit: "bubbles/min", answer: c.max }, { label: "Light intensity where the graph levels off", unit: "%", answer: bend, tol: 2.6 }],
      explain: `The rate rises while light is limiting, then levels off at ${c.max} bubbles/min at about ${fmt(bend)}% light — after that CO₂ is the limiting factor.`, summary: "Read a limiting-factor graph" }; }),
  inverse: diff => E.diaT("ps-num", diff, 3, () => { const c = choice([[20, 10, 4], [40, 20, 4], [30, 10, 9], [10, 20, 0.25], [50, 10, 25]]);
    return { kind: "num", title: "💡 Inverse square law", prompt: `The lamp is moved from ${c[0]} cm to ${c[1]} cm from the plant.`, visual: render(st(3, { d: c[1], C: 4, showVals: false })),
      fields: [{ label: "The light intensity becomes … times the start", unit: "×", answer: c[2], tol: 0.01 }], explain: `Intensity ∝ 1/d²: (${c[0]} ÷ ${c[1]})² = ${c[2]}.`, summary: "Light intensity and distance" }; }),
  eqMcq: diff => E.diaT("ps-mcq", diff, 1, () => { const q = choice([
      { ask: "Which word equation shows photosynthesis?", ok: "carbon dioxide + water → glucose + oxygen", bad: ["glucose + oxygen → carbon dioxide + water", "oxygen + water → glucose + carbon dioxide", "glucose + water → oxygen + carbon dioxide"], ex: "Plants use light energy to turn carbon dioxide and water into glucose; oxygen is released." },
      { ask: "What gas is in the bubbles from the pondweed?", ok: "Oxygen", bad: ["Carbon dioxide", "Nitrogen", "Water vapour"], ex: "Oxygen is the by-product of photosynthesis — counting bubbles measures the rate." },
      { ask: "Why is sodium hydrogen carbonate (NaHCO₃) added to the water?", ok: "It releases carbon dioxide for the plant", bad: ["It gives the plant light", "It keeps the water warm", "It kills bacteria"], ex: "NaHCO₃ dissolves and provides CO₂, one of the raw materials of photosynthesis." }]);
    return { kind: "mcq", title: "📘 Photosynthesis", prompt: "Look at the experiment.", visual: render(st(2, { d: 20, C: 2, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Photosynthesis basics" }; })
};
const LEVELS = {
  1: { intro: "Count oxygen bubbles from pondweed. Change the light (lamp distance) and the CO₂.", pool: () => [S(1, 1, C.dark), S(1, 1, C.max), S(2, 1, C.lamp15), S(2, 1, C.double), S(3, 1, C.co2lim), D.eqMcq(1), D.inOut(2), D.inOut(3)] },
  2: { intro: "More factors: light colour and temperature.", pool: () => [S(1, 1, C.green), S(2, 1, C.opt), S(2, 1, C.hot), S(3, 1, C.t40), S(3, 1, C.blue30), D.inOut(1), D.eqMcq(2), D.graph(3)] },
  3: { intro: "Limiting factors and the inverse square law for light.", pool: () => [S(1, 1, C.co2set), S(2, 1, C.four), S(3, 1, C.tlim), S(3, 1, C.red9), D.graph(1), D.inverse(2), D.graph(3)] }
};
const explore = E.exploreSim({
  intro: "Move the lamp, add CO₂ (NaHCO₃) and watch the oxygen bubbles. Higher levels: temperature and light colour.",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render,
  goals: lv => [
    { txt: "Reach the maximum rate (60 bubbles/min)", test: s => R(s) === 60 },
    { txt: "Find a setting where light is the limiting factor", test: s => model(s).lim === "light" && s.lamp },
    { txt: "Find a setting where CO₂ is the limiting factor", test: s => model(s).lim === "carbon dioxide" }
  ].concat(lv >= 2 ? [{ txt: "Try green light", test: s => s.col === "green" }] : []),
  facts: () => "📘 <b>carbon dioxide + water → glucose + oxygen</b> (needs light and chlorophyll). The <b>limiting factor</b> is the one in shortest supply — improving it speeds up photosynthesis."
});
E.start({ labId: "photo", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌱", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🌱", "☀️", "🫧", "✨"],
  exploreDemo: lv => [{ set: { d: 10, C: 4 } }, { set: { d: 50 } }, { set: { d: 10, C: 1 } }].concat(lv >= 2 ? [{ set: { col: "green" } }] : []) });
})();
