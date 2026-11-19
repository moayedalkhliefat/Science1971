"use strict";
// ===== Electric Circuits — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const RB = 3; // ohms per bulb
const VOLTS = [1.5, 3, 4.5, 6, 9, 12].map(v => ({ v, label: v + " V" }));
function solve(s) {
  const Rb = s.mode === "parallel" ? RB / s.n : RB * s.n;
  const R = Rb + (s.rx || 0);
  const I = s.sw ? s.V / R : 0;
  const Ib = s.mode === "parallel" ? I / s.n : I;
  return { R, I, Ib, P: Ib * Ib * RB };
}
function bulb(x, y, P, label) {
  const b = Math.min(1, P / 12), glow = P > 0.01;
  return `<g transform="translate(${x},${y})">
    ${glow ? `<circle r="${30 + 34 * b}" fill="url(#glow)" opacity="${0.25 + 0.75 * b}"/>` : ""}
    <circle r="24" fill="${glow ? `rgba(255,${Math.round(200 + 55 * b)},${Math.round(80 + 100 * b)},${0.35 + 0.65 * b})` : "#eceff1"}" stroke="#455a64" stroke-width="3"/>
    <path d="M-10,8 L-6,-8 L-2,6 L2,-8 L6,6 L10,-8" fill="none" stroke="${glow ? "#e65100" : "#78909c"}" stroke-width="2.5"/>
    <rect x="-10" y="22" width="20" height="10" rx="2" fill="#90a4ae"/>${label ? T(0, 52, label, { s: 12, c: "#455a64" }) : ""}</g>`;
}
function render(s) {
  const r = solve(s), show = s.reveal || s.showVals;
  const L = 110, Rr = 470, Tp = 90, Bt = 360;
  let w = "";
  const line = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#263238" stroke-width="5" stroke-linecap="round"/>`;
  // left wire with battery
  w += line(L, Tp, L, 195) + line(L, 245, L, Bt);
  w += `<line x1="${L - 34}" x2="${L + 34}" y1="200" y2="200" stroke="#263238" stroke-width="5"/><line x1="${L - 18}" x2="${L + 18}" y1="214" y2="214" stroke="#263238" stroke-width="9"/>
        <line x1="${L - 34}" x2="${L + 34}" y1="228" y2="228" stroke="#263238" stroke-width="5"/><line x1="${L - 18}" x2="${L + 18}" y1="242" y2="242" stroke="#263238" stroke-width="9"/>
        ${T(L - 46, 206, "+", { s: 20, c: "#c62828" })}${T(L - 70, 226, s.V + " V", { a: "end", s: 18, c: "#0b3d78" })}`;
  // top wire with switch and optional resistor
  w += line(L, Tp, 200, Tp);
  w += s.sw ? line(200, Tp, 270, Tp) : `<line x1="200" y1="${Tp}" x2="262" y2="${Tp - 34}" stroke="#263238" stroke-width="5" stroke-linecap="round"/>`;
  w += `<circle cx="200" cy="${Tp}" r="6" fill="#263238"/><circle cx="270" cy="${Tp}" r="6" fill="#263238"/>${s.mini ? "" : T(235, Tp - 44, s.sw ? "switch ON" : "switch OFF", { s: 13, c: s.sw ? "#2e7d32" : "#c62828" })}`;
  if (s.rx != null && s.useRx) {
    w += line(270, Tp, 320, Tp) + `<polyline points="320,${Tp} 330,${Tp - 14} 345,${Tp + 14} 360,${Tp - 14} 375,${Tp + 14} 390,${Tp - 14} 400,${Tp}" fill="none" stroke="#6a1b9a" stroke-width="4"/>` + line(400, Tp, Rr, Tp) + T(360, Tp - 24, "resistor " + fmt(s.rx) + " Ω", { s: 13, c: "#6a1b9a" });
  } else w += line(270, Tp, Rr, Tp);
  // bottom wire with ammeter
  w += line(L, Bt, 255, Bt) + line(305, Bt, Rr, Bt) + `<circle cx="280" cy="${Bt}" r="25" fill="#fff" stroke="#263238" stroke-width="4"/>${T(280, Bt + 7, "A", { s: 20 })}`;
  if (!s.mini) w += `<g transform="translate(225,${Bt + 34})"><rect width="110" height="40" rx="8" fill="#1d1b4b"/>${T(55, 27, show ? fmt(r.I) + " A" : "? A", { s: 18, c: "#7dffb3" })}</g>`;
  // bulbs
  if (s.mode === "parallel") {
    const xs = [Rr, Rr + 110, Rr + 220].slice(0, s.n);
    w += line(Rr, Tp, xs[xs.length - 1], Tp) + line(Rr, Bt, xs[xs.length - 1], Bt);
    xs.forEach((x, i) => { w += line(x, Tp, x, 195) + line(x, 255, x, Bt) + bulb(x, 225, r.P, "bulb " + (i + 1)); });
  } else {
    const ys = s.n === 1 ? [225] : s.n === 2 ? [165, 285] : [140, 225, 310];
    w += line(Rr, Tp, Rr, ys[0] - 26);
    ys.forEach((y, i) => { w += bulb(Rr, y, r.P, "") + (i < ys.length - 1 ? line(Rr, y + 34, Rr, ys[i + 1] - 26) : line(Rr, y + 34, Rr, Bt)); });
  }
  // electron flow
  let dots = "";
  if (s.sw && r.I > 0) { const dur = Math.max(1.2, 8 / r.I); for (let k = 0; k < 8; k++) dots += `<circle r="5" fill="#ffca28"><animateMotion dur="${dur}s" begin="-${(k * dur / 8).toFixed(2)}s" repeatCount="indefinite" path="M${L},${Bt} L${L},${Tp} L${Rr},${Tp} L${Rr},${Bt} Z"/></circle>`; }
  return `<svg viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="glow"><stop offset="0" stop-color="#fff59d"/><stop offset="1" stop-color="#fff59d" stop-opacity="0"/></radialGradient></defs>
    <rect width="800" height="440" fill="#fbfcfe"/>${w}${dots}
    ${show ? `<g transform="translate(620,20)"><rect width="165" height="${s.useRx ? 92 : 70}" rx="10" fill="#fff" stroke="#cfd8dc"/>${T(82, 26, "R total = " + fmt(r.R) + " Ω", { s: 14 })}${T(82, 52, "each bulb: " + fmt(r.P) + " W", { s: 14 })}</g>` : ""}
    ${s.mini ? "" : T(240, 30, s.mode === "parallel" ? "Bulbs in PARALLEL" : "Bulbs in SERIES", { s: 15, c: "#0b3d78" })}</svg>`;
}
const ctls = (lv, o) => { o = o || {}; const L2 = (o.lv || lv) >= 2, L3 = (o.lv || lv) >= 3; return [
  { id: "V", type: "choice", label: "Battery", options: VOLTS, lock: o.lockV ? () => true : null },
  { id: "n", type: "step", label: "Number of bulbs", min: 1, max: 3, lock: o.lockN ? () => true : null },
  { id: "mode", type: "choice", label: "Connection", options: [{ v: "series", label: "Series" }, { v: "parallel", label: "Parallel" }], hide: () => !L2, lock: o.lockMode ? () => true : null },
  { id: "rx", type: "range", label: "Resistor", min: 0, max: 30, step: 0.5, unit: "Ω", hide: () => !L3 },
  { id: "sw", type: "toggle", label: "Switch (close the circuit)" }
]; };
const st = (lv, o) => Object.assign({ V: 3, n: 1, mode: "series", rx: 0, useRx: lv >= 3, sw: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (goal, s0, check, sol, o) => ({ title: "💡 Circuit challenge", prompt: "Build the circuit, then press <b>▶ Run & check</b> to read the meters.", goal,
  sim: { state: s0, controls: ctls(S1971Lab.level, o), render, run, check, hint: "Each bulb has a resistance of 3 Ω. Current I = V ÷ R. Series: R adds up. Parallel: n equal bulbs give 3 ÷ n Ω." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("circ-sim", diff, uses, mk);
const desc = s => { const r = solve(s); return `${s.V} V, ${s.n} bulb(s) in ${s.mode}${s.useRx ? `, resistor ${fmt(s.rx)} Ω` : ""}: R = ${fmt(r.R)} Ω, I = ${fmt(r.I)} A`; };
const C = {
  light2: () => simQ("Light up exactly <b>2 bulbs</b>.", st(1), s => ok(s.sw && s.n === 2, "Closed circuit with 2 bulbs — current flows.", s.sw ? `There are ${s.n} bulbs.` : "The switch is open, so no current flows."), { n: 2, sw: true }, { wrong: { n: 2, sw: false } }),
  current: () => { const c = choice([{ I: 1, sol: { V: 6, n: 2 } }, { I: 0.5, sol: { V: 3, n: 2 } }, { I: 2, sol: { V: 6, n: 1 } }, { I: 1.5, sol: { V: 9, n: 2 } }, { I: 4, sol: { V: 12, n: 1 } }]);
    return simQ(`Make the current exactly <b>${c.I} A</b> (bulbs in series).`, st(1), s => ok(s.sw && E.near(solve(s).I, c.I, 1e-6), desc(s) + ".", desc(s) + `, not ${c.I} A.`), Object.assign({ sw: true }, c.sol), { wrong: { V: c.sol.V === 3 ? 6 : 3 } }); },
  bright: () => simQ("Keep <b>2 bulbs</b> in series and make them glow as <b>brightly as possible</b>.", st(1, { n: 2 }), s => ok(s.sw && s.n === 2 && s.V === 12, "12 V gives the largest current through the bulbs.", "Use the biggest battery voltage and close the switch."), { V: 12, sw: true }, { lockN: true, wrong: { V: 9 } }),
  watt: () => { const sol = choice([{ V: 3, n: 1 }, { V: 6, n: 2 }, { V: 9, n: 3 }]);
    return simQ("Make <b>each bulb</b> glow with a power of exactly <b>3 W</b> (series).", st(1), s => ok(s.sw && E.near(solve(s).P, 3, 1e-6), `I = ${fmt(solve(s).I)} A → P = I² × 3 = ${fmt(solve(s).P)} W.`, `Each bulb gets ${fmt(solve(s).P)} W, not 3 W.`), Object.assign({ sw: true }, sol), { wrong: { V: sol.V === 3 ? 4.5 : 3 } }); },
  stayOn: () => simQ("Connect <b>3 bulbs</b> so that if one bulb breaks, the others <b>stay on</b>. Turn them on.", st(2), s => ok(s.sw && s.n === 3 && s.mode === "parallel", "Parallel: each bulb has its own path.", "Use 3 bulbs in PARALLEL and close the switch."), { n: 3, mode: "parallel", sw: true }, { lv: 2, wrong: { n: 3, mode: "series", sw: true } }),
  current2: () => { const c = choice([{ V: 3, I: 2, sol: { n: 2, mode: "parallel" } }, { V: 6, I: 6, sol: { n: 3, mode: "parallel" } }, { V: 4.5, I: 0.5, sol: { n: 3, mode: "series" } }, { V: 6, I: 1, sol: { n: 2, mode: "series" } }]);
    return simQ(`Use the <b>${c.V} V</b> battery. Make the total current exactly <b>${c.I} A</b>.`, st(2, { V: c.V }), s => ok(s.sw && E.near(solve(s).I, c.I, 1e-6), desc(s) + ".", desc(s) + `, not ${c.I} A.`), Object.assign({ sw: true }, c.sol), { lockV: true, lv: 2, wrong: { mode: c.sol.mode === "series" ? "parallel" : "series" } }); },
  same: () => simQ("Make <b>2 bulbs</b> each glow as brightly as <b>one bulb on a 3 V battery</b> (3 W each).", st(2, { n: 2 }), s => ok(s.sw && s.n === 2 && E.near(solve(s).P, 3, 1e-6), `Each bulb: ${fmt(solve(s).P)} W.`, `Each bulb: ${fmt(solve(s).P)} W, not 3 W.`), { mode: "parallel", V: 3, sw: true }, { lockN: true, lv: 2, wrong: { mode: "series", V: 3, sw: true } }),
  total15: () => simQ("Use <b>2 bulbs</b>. Make the total current exactly <b>1.5 A</b>.", st(2, { n: 2 }), s => ok(s.sw && E.near(solve(s).I, 1.5, 1e-6), desc(s) + ".", desc(s) + ", not 1.5 A."), { mode: "series", V: 9, sw: true }, { lockN: true, lv: 2, wrong: { V: 6, sw: true } }),
  ohm: () => { const c = choice([{ V: 6, I: 0.5, rx: 9 }, { V: 12, I: 1, rx: 9 }, { V: 9, I: 0.5, rx: 15 }, { V: 6, I: 1, rx: 3 }]);
    return simQ(`<b>${c.V} V</b> battery, <b>1 bulb</b> (3 Ω). Set the resistor so the current is exactly <b>${c.I} A</b>.`, st(3, { V: c.V, n: 1 }), s => ok(s.sw && E.near(solve(s).I, c.I, 1e-6), desc(s) + ".", desc(s) + `, not ${c.I} A.`), { rx: c.rx, sw: true }, { lockV: true, lockN: true, lockMode: true, lv: 3, wrong: { rx: c.rx + 1, sw: true } }); },
  halve: () => simQ("<b>6 V</b>, <b>1 bulb</b>: with no resistor the current is 2 A. Add resistance so the current is <b>half</b> (1 A).", st(3, { V: 6, n: 1 }), s => ok(s.sw && E.near(solve(s).I, 1, 1e-6), "R total doubled from 3 Ω to 6 Ω.", desc(s) + "."), { rx: 3, sw: true }, { lockV: true, lockN: true, lockMode: true, lv: 3, wrong: { rx: 6, sw: true } }),
  par15: () => simQ("<b>12 V</b> battery, <b>2 bulbs in parallel</b>. Set the resistor so the total current is exactly <b>2 A</b>.", st(3, { V: 12, n: 2, mode: "parallel" }), s => ok(s.sw && E.near(solve(s).I, 2, 1e-6), "R total = 12 ÷ 2 = 6 Ω = 1.5 Ω (bulbs) + 4.5 Ω.", desc(s) + ", not 2 A."), { rx: 4.5, sw: true }, { lockV: true, lockN: true, lockMode: true, lv: 3, wrong: { rx: 6, sw: true } }),
  power075: () => simQ("<b>6 V</b>, <b>1 bulb</b>. Use the resistor to make the bulb's power exactly <b>0.75 W</b>.", st(3, { V: 6, n: 1 }), s => ok(s.sw && E.near(solve(s).P, 0.75, 1e-6), "P = I²R → I = 0.5 A → R total = 12 Ω → resistor 9 Ω.", `Bulb power ${fmt(solve(s).P)} W.`), { rx: 9, sw: true }, { lockV: true, lockN: true, lockMode: true, lv: 3, wrong: { rx: 3, sw: true } })
};

// ---------- diagram tasks ----------
const mini = (st, k, s, label) => `<g class="pk" data-k="${k}"><rect x="${s.x}" y="10" width="236" height="200" rx="14" fill="#fff" ${E.ring(st[k])}/>
  <svg x="${s.x + 6}" y="16" width="224" height="160" viewBox="40 60 700 330">${render(Object.assign({ V: 6, n: 2, mode: "series", rx: 0, sw: true, mini: true }, s.c)).replace(/<svg[^>]*>|<\/svg>/g, "")}</svg>${T(s.x + 118, 198, label, { s: 15 })}</g>`;
const D = {
  meters: diff => E.diaT("circ-num", diff, 2, () => { const c = choice([{ V: 6, I: 2 }, { V: 9, I: 1.5 }, { V: 12, I: 0.5 }, { V: 4.5, I: 1.5 }, { V: 3, I: 0.25 }]);
    const vis = `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#fbfcfe"/>
      <rect x="140" y="70" width="460" height="170" fill="none" stroke="#263238" stroke-width="5"/><rect x="330" y="50" width="80" height="40" fill="#fff" stroke="#6a1b9a" stroke-width="4"/>${T(370, 40, "component R", { s: 14, c: "#6a1b9a" })}
      <circle cx="140" cy="155" r="28" fill="#fff" stroke="#263238" stroke-width="4"/>${T(140, 163, "V", { s: 20 })}<circle cx="370" cy="240" r="28" fill="#fff" stroke="#263238" stroke-width="4"/>${T(370, 248, "A", { s: 20 })}
      <g transform="translate(20,190)"><rect width="100" height="40" rx="8" fill="#1d1b4b"/>${T(50, 27, c.V + " V", { s: 18, c: "#7dffb3" })}</g><g transform="translate(420,250)"><rect width="100" height="40" rx="8" fill="#1d1b4b"/>${T(50, 27, c.I + " A", { s: 18, c: "#7dffb3" })}</g></svg>`;
    return { kind: "num", title: "📟 Read the meters", prompt: "Read the voltmeter and the ammeter, then calculate the resistance of component R.", visual: vis,
      fields: [{ label: "Voltage", unit: "V", answer: c.V }, { label: "Current", unit: "A", answer: c.I }, { label: "Resistance", unit: "Ω", answer: c.V / c.I }], explain: `R = V ÷ I = ${c.V} ÷ ${c.I} = ${fmt(c.V / c.I)} Ω.`, summary: "Resistance from meter readings" }; }),
  whichSeries: diff => E.diaT("circ-pick", diff, 1, () => { const order = E.shuffle(["s", "p", "o"]); const cfg = { s: { c: { mode: "series" } }, p: { c: { mode: "parallel" } }, o: { c: { mode: "series", sw: false } } };
    const ask = choice([["s", "Click the circuit with the bulbs in <b>SERIES</b> that is lit."], ["p", "Click the circuit with the bulbs in <b>PARALLEL</b>."], ["o", "Click the circuit where <b>no current</b> flows."]]);
    return { kind: "pick", title: "👆 Identify the circuit", prompt: ask[1], answer: [ask[0]], names: { s: "the lit series circuit", p: "the parallel circuit", o: "the circuit with the open switch" },
      visual: st => `<svg viewBox="0 0 740 220" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="220" fill="#f4f8fc"/>${order.map((k, i) => mini(st, k, { x: 6 + i * 245, c: cfg[k].c }, "Circuit " + (i + 1))).join("")}</svg>`,
      explain: "Series = one single loop; parallel = separate branches; an open switch breaks the loop so no current flows.", summary: "Identify series / parallel / open" }; }),
  breakMcq: diff => E.diaT("circ-mcq", diff, 1, () => ({ kind: "mcq", title: "💡 Predict", prompt: "Look at this circuit: three bulbs in series.", visual: render({ V: 9, n: 3, mode: "series", rx: 0, sw: true }),
    ask: "What happens if the middle bulb breaks?", options: E.mkOptions("All the bulbs go out — the single loop is broken", ["Only the middle bulb goes out", "The other bulbs get brighter", "The battery voltage doubles"]),
    explain: "In series there is only one path, so one broken bulb stops the current everywhere.", summary: "Broken bulb in series" })),
  seriesR: diff => E.diaT("circ-num", diff, 2, () => { const rs = E.pick([2, 3, 4, 5, 6, 10], 3), V = choice([6, 12, 24]); const R = rs.reduce((a, b) => a + b, 0);
    const vis = `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="260" fill="#fbfcfe"/><rect x="90" y="60" width="560" height="150" fill="none" stroke="#263238" stroke-width="5"/>
      ${rs.map((r, i) => `<rect x="${170 + i * 150}" y="45" width="80" height="30" fill="#fff" stroke="#6a1b9a" stroke-width="4"/>${T(210 + i * 150, 35, r + " Ω", { s: 16, c: "#6a1b9a" })}`).join("")}
      <line x1="70" x2="110" y1="125" y2="125" stroke="#263238" stroke-width="5"/><line x1="78" x2="102" y1="140" y2="140" stroke="#263238" stroke-width="9"/>${T(60, 120, V + " V", { a: "end", s: 16, c: "#0b3d78" })}</svg>`;
    return { kind: "num", title: "🧮 Series resistors", prompt: "Three resistors are connected in series to the battery.", visual: vis,
      fields: [{ label: "Total resistance", unit: "Ω", answer: R }, { label: "Current", unit: "A", answer: V / R, tol: 0.011 }], explain: `R = ${rs.join(" + ")} = ${R} Ω. I = ${V} ÷ ${R} = ${fmt(V / R)} A.`, summary: "Series resistance and current" }; }),
  parMcq: diff => E.diaT("circ-mcq", diff, 1, () => ({ kind: "mcq", title: "🏠 Homes use parallel", prompt: "The lamps in a house are wired like this.", visual: render({ V: 12, n: 3, mode: "parallel", rx: 0, sw: true }),
    ask: "Why are home circuits wired in parallel?", options: E.mkOptions("Each device gets the full voltage and can be switched on/off on its own", ["It uses less wire", "The current is the same everywhere", "If one lamp breaks, all lamps go out"]),
    explain: "In parallel, every branch gets the full voltage and works independently.", summary: "Why homes use parallel circuits" }))
};
const LEVELS = {
  1: { intro: "Make a complete circuit and control the current with the battery and the number of bulbs.", pool: () => [S(1, 1, C.light2), S(1, 1, C.current), S(2, 2, C.current), S(3, 1, C.bright), S(3, 1, C.watt), D.breakMcq(1), D.meters(2), D.whichSeries(2), D.seriesR(3)] },
  2: { intro: "Series and parallel circuits: how the connection changes the current and the brightness.", pool: () => [S(1, 1, C.stayOn), S(2, 2, C.current2), S(2, 1, C.same), S(3, 1, C.total15), S(3, 1, C.watt), D.parMcq(1), D.whichSeries(2), D.meters(2), D.seriesR(3)] },
  3: { intro: "Ohm's law: use a variable resistor to set exact currents and powers.", pool: () => [S(1, 1, C.ohm), S(2, 1, C.halve), S(2, 1, C.ohm), S(3, 1, C.par15), S(3, 1, C.power075), D.meters(1), D.seriesR(2), D.whichSeries(2), D.meters(3)] }
};
const explore = E.exploreSim({
  intro: "Close the switch, change the battery and the number of bulbs" + " (and series/parallel in higher levels). Watch the bulbs and the ammeter.",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render,
  goals: lv => [
    { txt: "Close the switch and light a bulb", test: s => s.sw },
    { txt: "Light 3 bulbs at once", test: s => s.sw && s.n === 3 },
    { txt: "Try 3 different battery voltages", test: (s, m) => (m.vs || new Set()).size >= 3 }
  ].concat(lv >= 2 ? [{ txt: "Light bulbs in parallel", test: s => s.sw && s.mode === "parallel" && s.n >= 2 }] : [])
   .concat(lv >= 3 ? [{ txt: "Use the resistor to make the current less than 0.5 A", test: s => s.sw && solve(s).I < 0.5 }] : []),
  track: (s, m) => { if (s.sw) (m.vs = m.vs || new Set()).add(s.V); },
  facts: lv => "📘 Current <b>I = V ÷ R</b>. Each bulb is 3 Ω. <b>Series:</b> resistances add up, the same current flows through every bulb." + (lv >= 2 ? " <b>Parallel:</b> each bulb has its own branch and gets the full voltage." : "")
});
E.start({ labId: "circuits", total: 7, plan: { sim: 4, dia: 3 }, emoji: "💡", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["💡", "⚡", "⭐", "✨"],
  exploreDemo: lv => [{ set: { sw: true } }, { set: { n: 3 } }, { set: { V: 6 } }, { set: { V: 12 } }].concat(lv >= 2 ? [{ set: { mode: "parallel" } }] : []).concat(lv >= 3 ? [{ set: { rx: 30 } }] : []) });
})();
