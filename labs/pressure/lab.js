"use strict";
// ===== Pressure & Hydraulics — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const GROUND = { snow: { name: "Snow", max: 2, col: "#eceff1", edge: "#b0bec5" }, sand: { name: "Sand", max: 5, col: "#ffe0b2", edge: "#d7a86e" }, concrete: { name: "Concrete", max: 1000, col: "#b0bec5", edge: "#78909c" } };
const LIQ = { water: { name: "Water", rho: 1000, col: "#4fc3f7" }, oil: { name: "Oil", rho: 800, col: "#ffd54f" }, syrup: { name: "Syrup", rho: 1300, col: "#bf7a3a" } };
// solids: pressure in N/cm²
const pS = s => r2(s.weight / s.area);
const sinks = s => pS(s) > GROUND[s.ground].max + 1e-9;
// liquids: pressure in kPa (liquid only) = density × 10 × depth ÷ 1000
const pL = s => r2(LIQ[s.liq].rho * 10 * s.depth / 1000);
// hydraulics: fluid pressure N/cm², output force N
const pH = s => r2(s.eff / s.a1);
const fOut = s => r2(s.eff * s.a2 / s.a1);
const lifts = s => fOut(s) >= s.load - 1e-9;
const panel = (rows, foot) => `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${rows}${T(120, 372, foot, { s: 10, c: "#90a4ae" })}</g>`;
function crate(cx, by, w, label, h) {
  return `<rect x="${cx - 70}" y="${by - (h || 110)}" width="140" height="${h || 110}" rx="6" fill="#8d6e63" stroke="#4e342e" stroke-width="2"/><path d="M${cx - 70},${by - (h || 110)} L${cx + 70},${by} M${cx + 70},${by - (h || 110)} L${cx - 70},${by}" stroke="#6d4c41" stroke-width="3" opacity=".5"/>${T(cx, by - (h || 110) / 2 + 6, label, { s: 18, c: "#fff" })}
    <rect x="${cx - w / 2}" y="${by}" width="${w}" height="16" rx="3" fill="#546e7a" stroke="#263238" stroke-width="2"/>`;
}
function solid(s, show, cx, gy) {
  const G = GROUND[s.ground], w = 30 + s.area * 0.55, sink = show && sinks(s) ? Math.min(70, 20 + (pS(s) / G.max - 1) * 18) : show ? 3 : 0;
  let g = `<rect x="40" y="${gy}" width="520" height="${410 - gy + 20}" fill="${G.col}" stroke="${G.edge}" stroke-width="2"/>${T(64, gy + 30, G.name, { a: "start", s: 14, c: "#546e7a" })}`;
  if (s.ground === "sand") g += Array.from({ length: 40 }, (_, i) => `<circle cx="${60 + (i * 53) % 490}" cy="${gy + 40 + (i * 37) % 70}" r="2" fill="#d7a86e"/>`).join("");
  if (s.ground === "snow") g += Array.from({ length: 16 }, (_, i) => `<circle cx="${70 + i * 31}" cy="${gy + 50 + (i % 3) * 18}" r="3" fill="#fff" stroke="#cfd8dc"/>`).join("");
  g += `<g transform="translate(0,${sink})">${crate(cx, gy - 16, w, s.weight + " N")}</g>`;
  g += `<line x1="${cx - w / 2}" y1="${gy + 60}" x2="${cx + w / 2}" y2="${gy + 60}" stroke="#37474f" stroke-width="2" marker-start="url(#ar)" marker-end="url(#ar)"/>${T(cx, gy + 82, s.area + " cm² touching the ground", { s: 13, c: "#37474f" })}`;
  return g;
}
function liquid(s, show) {
  const L = LIQ[s.liq], top = 70, px = 32, y = top + s.depth * px, P = pL(s);
  let g = `<rect x="110" y="${top - 10}" width="300" height="${10 * px + 20}" rx="6" fill="none" stroke="#607d8b" stroke-width="4"/><rect x="112" y="${top}" width="296" height="${10 * px + 8}" fill="${L.col}" opacity=".55"/>${T(260, top - 20, L.name + " tank (10 m deep)", { s: 13, c: "#37474f" })}`;
  for (let m = 0; m <= 10; m += 2) g += `<line x1="80" y1="${top + m * px}" x2="104" y2="${top + m * px}" stroke="#78909c" stroke-width="2"/>${T(74, top + m * px + 5, m + " m", { a: "end", s: 12, c: "#546e7a" })}`;
  g += `<line x1="410" y1="${y}" x2="430" y2="${y}" stroke="#607d8b" stroke-width="6"/>`;
  if (show && P > 0) { const len = Math.min(120, 14 * Math.sqrt(P)); g += `<path d="M430,${y} q${len * 0.6},0 ${len},${len * 0.55}" fill="none" stroke="${L.col}" stroke-width="7" stroke-linecap="round"/>`; }
  g += `<line x1="260" y1="${top - 6}" x2="260" y2="${y - 16}" stroke="#37474f" stroke-width="3"/><circle cx="260" cy="${y}" r="16" fill="#fff" stroke="#37474f" stroke-width="3"/><line x1="260" y1="${y}" x2="${260 + 11 * Math.cos(Math.PI * (1.2 + Math.min(1, P / 130) * 1.6))}" y2="${y + 11 * Math.sin(Math.PI * (1.2 + Math.min(1, P / 130) * 1.6))}" stroke="#c62828" stroke-width="3"/>${T(290, y + 5, "sensor at " + s.depth + " m", { a: "start", s: 13, c: "#37474f" })}`;
  return g;
}
function hydraulic(s, show) {
  const w1 = 16 + Math.sqrt(s.a1) * 7, w2 = 30 + Math.sqrt(s.a2) * 8, x1 = 150, x2 = 400, up = show && lifts(s) ? 46 : 0, base = 380;
  let g = `<path d="M${x1 - w1 / 2},${200 + up} V${base} H${x2 + w2 / 2} V${230 - up} H${x2 - w2 / 2} V${base - 40} H${x1 + w1 / 2} V${200 + up}Z" fill="#ef9a9a" opacity=".7"/>`;
  g += `<path d="M${x1 - w1 / 2},120 V${base} H${x2 + w2 / 2} V140 M${x2 - w2 / 2},140 V${base - 40} H${x1 + w1 / 2} V120" fill="none" stroke="#455a64" stroke-width="4"/>`;
  g += `<rect x="${x1 - w1 / 2 + 2}" y="${188 + up}" width="${w1 - 4}" height="12" fill="#607d8b"/><line x1="${x1}" y1="${130 + up}" x2="${x1}" y2="${186 + up}" stroke="#1565c0" stroke-width="6"/><path d="M${x1},${192 + up} l-9,-14 h18Z" fill="#1565c0"/>${T(x1, 110 + up, "effort " + s.eff + " N", { s: 14, c: "#1565c0" })}`;
  g += `<rect x="${x2 - w2 / 2 + 2}" y="${218 - up}" width="${w2 - 4}" height="12" fill="#607d8b"/>`;
  const cy = 218 - up;
  g += `<rect x="${x2 - 62}" y="${cy - 46}" width="124" height="34" rx="10" fill="#e53935" stroke="#8e0000" stroke-width="2"/><path d="M${x2 - 38},${cy - 46} l14,-24 h44 l14,24Z" fill="#ef5350" stroke="#8e0000" stroke-width="2"/><circle cx="${x2 - 34}" cy="${cy - 10}" r="10" fill="#263238"/><circle cx="${x2 + 34}" cy="${cy - 10}" r="10" fill="#263238"/>${T(x2, cy - 24, s.load + " N", { s: 13, c: "#fff" })}`;
  g += T(x1, base + 26, "small piston " + s.a1 + " cm²", { s: 12, c: "#37474f" }) + T(x2, base + 26, "big piston " + s.a2 + " cm²", { s: 12, c: "#37474f" });
  return g;
}
function render(s) {
  const show = s.reveal;
  let g = `<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="#37474f"/></marker></defs><rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  if (s.mode === "solid") {
    const G = GROUND[s.ground];
    g += solid(s, show, 300, 260) + panel(`${T(120, 64, "pressure = force ÷ area", { s: 12, c: "#546e7a" })}${T(120, 104, s.weight + " N ÷ " + s.area + " cm²", { s: 15, c: "#37474f" })}${T(120, 142, show ? "= " + fmt(pS(s)) + " N/cm²" : "= ?", { s: 20, c: "#e65100" })}
      ${T(120, 200, G.name + " holds up to", { s: 12, c: "#78909c" })}${T(120, 224, G.max + " N/cm²", { s: 16, c: "#37474f" })}${T(120, 272, show ? (sinks(s) ? "✘ it sinks in" : "✔ it stays on top") : "press ▶ to place it", { s: 16, c: show ? (sinks(s) ? "#c62828" : "#2e7d32") : "#90a4ae" })}`, "bigger area → smaller pressure");
  } else if (s.mode === "liquid") {
    g += liquid(s, show) + panel(`${T(120, 64, "pressure = density × 10 × depth", { s: 11, c: "#546e7a" })}${T(120, 104, LIQ[s.liq].name + ": " + LIQ[s.liq].rho + " kg/m³", { s: 14, c: "#37474f" })}${T(120, 130, "depth: " + s.depth + " m", { s: 14, c: "#37474f" })}
      ${T(120, 180, show ? fmt(pL(s)) + " kPa" : "? kPa", { s: 24, c: "#e65100" })}${T(120, 206, "(pressure from the liquid)", { s: 11, c: "#78909c" })}${T(120, 256, show ? (s.depth ? "deeper → stronger jet" : "no liquid above it") : "press ▶ to read the sensor", { s: 13, c: "#6d4c41" })}`, "1 kPa = 1000 N on every m²");
  } else {
    g += hydraulic(s, show) + panel(`${T(120, 64, "pressure is the same everywhere", { s: 11, c: "#546e7a" })}${T(120, 80, "in the liquid", { s: 11, c: "#546e7a" })}${T(120, 116, "pressure: " + (show ? fmt(pH(s)) + " N/cm²" : "?"), { s: 15, c: "#37474f" })}
      ${T(120, 156, "output force:", { s: 13, c: "#78909c" })}${T(120, 184, show ? fmt(fOut(s)) + " N" : "?", { s: 22, c: "#e65100" })}${T(120, 232, show ? (lifts(s) ? "✔ the car rises" : "✘ not enough to lift it") : "press ▶ to push", { s: 15, c: show ? (lifts(s) ? "#2e7d32" : "#c62828") : "#90a4ae" })}
      ${T(120, 290, "force × " + fmt(s.a2 / s.a1), { s: 15, c: "#37474f" })}${T(120, 310, "(big area ÷ small area)", { s: 11, c: "#78909c" })}`, "output = effort × big area ÷ small area");
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Experiment", options: [{ v: "solid", label: "Solids" }, { v: "liquid", label: "Liquids" }, { v: "hyd", label: "Hydraulics" }] }] : []),
  { id: "weight", type: "range", label: "Weight", min: 100, max: 1000, step: 50, nudge: 50, unit: "N", hide: s => s.mode !== "solid", lock: lk("weight") },
  { id: "area", type: "choice", label: "Area touching the ground", options: [50, 100, 200, 300, 600].map(v => ({ v, label: v + " cm²" })), hide: s => s.mode !== "solid", lock: lk("area") },
  { id: "ground", type: "choice", label: "Ground", options: Object.keys(GROUND).map(v => ({ v, label: GROUND[v].name })), hide: s => s.mode !== "solid", lock: lk("ground") },
  { id: "liq", type: "choice", label: "Liquid", options: Object.keys(LIQ).map(v => ({ v, label: LIQ[v].name })), hide: s => s.mode !== "liquid", lock: lk("liq") },
  { id: "depth", type: "range", label: "Sensor depth", min: 0, max: 10, step: 0.5, nudge: 0.5, unit: "m", hide: s => s.mode !== "liquid", lock: lk("depth") },
  { id: "a1", type: "choice", label: "Small piston", options: [5, 10, 20].map(v => ({ v, label: v + " cm²" })), hide: s => s.mode !== "hyd", lock: lk("a1") },
  { id: "a2", type: "choice", label: "Big piston", options: [50, 100, 200, 400].map(v => ({ v, label: v + " cm²" })), hide: s => s.mode !== "hyd", lock: lk("a2") },
  { id: "eff", type: "range", label: "Effort", min: 0, max: 500, step: 10, nudge: 10, unit: "N", hide: s => s.mode !== "hyd", lock: lk("eff") }]; };
const st = o => Object.assign({ mode: "solid", weight: 600, area: 100, ground: "snow", liq: "water", depth: 2, a1: 10, a2: 100, eff: 100, load: 8000 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const HINT = { solid: "Pressure = force ÷ area. Spread the force over a bigger area to lower the pressure.", liquid: "Liquid pressure = density × 10 × depth (in Pa). Divide by 1000 for kPa. Water gives 10 kPa for every metre.", hyd: "The pressure (effort ÷ small area) is passed through the liquid. Output force = pressure × big area." };
const TTL = { solid: "🥾 Pressure challenge", liquid: "🌊 Depth challenge", hyd: "🚗 Hydraulic challenge" };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: TTL[s0.mode], prompt: "Set up the experiment, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: HINT[s0.mode] },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("pr-sim", diff, uses, mk);
const C = {
  snow: () => simQ(1, "A <b>600 N</b> hiker must walk on <b>snow</b> without sinking. Choose the <b>smallest</b> shoe area that works.", st({ weight: 600, area: 100, ground: "snow" }), s => ok(!sinks(s) && s.area === 300, "300 cm²: 600 ÷ 300 = 2 N/cm² — just enough for snow.", sinks(s) ? `${fmt(pS(s))} N/cm² is more than snow can hold.` : "It works, but a smaller area also works."), { area: 300 }, { lock: ["weight", "ground"], wrong: { area: 200 } }),
  exact: () => simQ(1, "Make the pressure exactly <b>4 N/cm²</b> with an <b>800 N</b> crate.", st({ weight: 800, area: 100, ground: "concrete" }), s => ok(pS(s) === 4, "800 ÷ 200 = 4 N/cm².", `Pressure: ${fmt(pS(s))} N/cm².`), { area: 200 }, { lock: ["weight", "ground"], wrong: { area: 100 } }),
  sand: () => simQ(1, "The crate stands on <b>200 cm²</b> on <b>sand</b>. Find the <b>heaviest</b> weight that does not sink.", st({ weight: 400, area: 200, ground: "sand" }), s => ok(!sinks(s) && s.weight === 1000, "1000 ÷ 200 = 5 N/cm² — the sand's limit.", sinks(s) ? "It sinks — too heavy." : "It stays up, but it can be heavier."), { weight: 1000 }, { lock: ["area", "ground"], wrong: { weight: 900 } }),
  sharp: () => simQ(1, "Like a sharp knife: make the <b>highest</b> pressure with a <b>400 N</b> push.", st({ weight: 400, area: 300, ground: "concrete" }), s => ok(s.area === 50, "The smallest area (50 cm²) gives 8 N/cm².", `${fmt(pS(s))} N/cm² — a smaller area gives more.`), { area: 50 }, { lock: ["weight", "ground"], wrong: { area: 100 } }),
  d50: () => simQ(2, "Move the sensor to where the <b>water</b> pressure is <b>50 kPa</b>.", st({ mode: "liquid", depth: 1 }), s => ok(pL(s) === 50, "50 kPa at 5 m: 1000 × 10 × 5 = 50 000 Pa.", `${fmt(pL(s))} kPa at ${s.depth} m.`), { depth: 5 }, { lock: ["liq"], wrong: { depth: 4 } }),
  oil: () => simQ(2, "The tank holds <b>oil</b>. Find the depth where the pressure is <b>40 kPa</b>.", st({ mode: "liquid", liq: "oil", depth: 1 }), s => ok(pL(s) === 40, "800 × 10 × 5 = 40 000 Pa = 40 kPa.", `${fmt(pL(s))} kPa at ${s.depth} m.`), { depth: 5 }, { lock: ["liq"], wrong: { depth: 4 } }),
  dense: () => simQ(2, "At <b>2 m</b> deep, choose the liquid that gives <b>26 kPa</b>.", st({ mode: "liquid", depth: 2 }), s => ok(pL(s) === 26, "Syrup: 1300 × 10 × 2 = 26 000 Pa.", `${LIQ[s.liq].name} gives ${fmt(pL(s))} kPa.`), { liq: "syrup" }, { lock: ["depth"], wrong: { liq: "water" } }),
  sub: () => simQ(2, "A robot sub can take at most <b>80 kPa</b> of water pressure. Send it as <b>deep</b> as is safe.", st({ mode: "liquid", depth: 3 }), s => ok(pL(s) === 80, "8 m: 1000 × 10 × 8 = 80 kPa.", pL(s) > 80 ? `${fmt(pL(s))} kPa — it would be crushed!` : "Safe, but it can go deeper."), { depth: 8 }, { lock: ["liq"], wrong: { depth: 7.5 } }),
  car: () => simQ(3, "Lift an <b>8000 N</b> car with only <b>200 N</b> of effort. Choose the pistons.", st({ mode: "hyd", a1: 20, a2: 50, eff: 200, load: 8000 }), s => ok(lifts(s), `Output: ${fmt(fOut(s))} N — the car rises.`, `Output: ${fmt(fOut(s))} N — make the big piston bigger or the small one smaller.`), { a1: 5, a2: 200 }, { lock: ["eff"], wrong: { a1: 10, a2: 100 } }),
  least: () => simQ(3, "With these pistons, find the <b>smallest effort</b> that lifts a <b>12 000 N</b> van.", st({ mode: "hyd", a1: 10, a2: 400, eff: 100, load: 12000 }), s => ok(lifts(s) && s.eff === 300, "Area ratio 40: 300 × 40 = 12 000 N.", lifts(s) ? "It rises, but you can push less." : "Not enough force."), { eff: 300 }, { lock: ["a1", "a2"], wrong: { eff: 290 } }),
  press: () => simQ(3, "Make the pressure in the liquid exactly <b>20 N/cm²</b> with a <b>200 N</b> effort.", st({ mode: "hyd", a1: 20, eff: 200, load: 8000 }), s => ok(pH(s) === 20, "200 ÷ 10 = 20 N/cm².", `Pressure: ${fmt(pH(s))} N/cm².`), { a1: 10 }, { lock: ["eff", "a2"], wrong: { a1: 20 } }),
  truck: () => simQ(3, "Lift a <b>20 000 N</b> truck using the <b>smallest possible effort</b>.", st({ mode: "hyd", a1: 10, a2: 100, eff: 500, load: 20000 }), s => ok(lifts(s) && s.eff === 250, "5 → 400 cm² (×80): 250 × 80 = 20 000 N.", !lifts(s) ? "It does not rise." : "It rises — but a bigger area ratio needs less effort."), { a1: 5, a2: 400, eff: 250 }, { wrong: { a1: 5, a2: 200, eff: 250 } })
};
const D = {
  pick: diff => E.diaT("pr-pick", diff, 2, () => {
    if (Math.random() < 0.5) {
      const areas = [50, 100, 300, 600], w = choice([300, 600]);
      return { kind: "pick", many: true, title: "👆 Which ones sink?", prompt: `Each crate weighs <b>${w} N</b> and stands on <b>snow</b> (holds 2 N/cm²). Click <b>every</b> crate that sinks.`, answer: areas.filter(a => w / a > 2).map(a => "a" + a), names: Object.fromEntries(areas.map(a => ["a" + a, a + " cm²"])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${areas.map((a, i) => { const x = 15 + i * 212, wd = 20 + a * 0.28; return `<g class="pk" data-k="a${a}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><rect x="${x + 8}" y="190" width="180" height="88" fill="#eceff1" stroke="#b0bec5"/><rect x="${x + 48}" y="80" width="100" height="90" rx="6" fill="#8d6e63" stroke="#4e342e" stroke-width="2"/>${T(x + 98, 132, w + " N", { s: 16, c: "#fff" })}<rect x="${x + 98 - wd / 2}" y="170" width="${wd}" height="18" rx="3" fill="#546e7a"/>${T(x + 98, 245, a + " cm²", { s: 15, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["a" + a])}/></g>`; }).join("")}</svg>`,
        explain: `Pressure = ${w} ÷ area. Anything above 2 N/cm² sinks into the snow.`, summary: "Pressure on snow" };
    }
    const liq = choice(Object.keys(LIQ)), want = choice(["deep", "shallow"]), holes = [1, 3, 6, 9];
    return { kind: "pick", title: "👆 Water jets", prompt: `A tall tank of <b>${LIQ[liq].name.toLowerCase()}</b> has four holes. Click the hole with the <b>${want === "deep" ? "strongest" : "weakest"}</b> jet.`, answer: [want === "deep" ? "h9" : "h1"], names: Object.fromEntries(holes.map(h => ["h" + h, h + " m deep"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><g transform="translate(50,0)"><rect x="250" y="20" width="260" height="262" fill="${LIQ[liq].col}" opacity=".55" stroke="#607d8b" stroke-width="4"/><line x1="250" y1="28" x2="510" y2="28" stroke="#0277bd" stroke-width="2" stroke-dasharray="6 4"/>${T(380, 22, "surface", { s: 11, c: "#0277bd" })}${T(380, 160, LIQ[liq].name, { s: 22, c: "#37474f" })}${holes.map(h => { const y = 28 + h * 26; return `<g class="pk" data-k="h${h}"><rect x="160" y="${y - 12}" width="540" height="24" fill="#fff" opacity="0"/><circle cx="512" cy="${y}" r="7" fill="#37474f"/>${T(240, y + 5, h + " m deep", { a: "end", s: 13, c: "#546e7a" })}<line x1="250" y1="${y}" x2="268" y2="${y}" stroke="#607d8b" stroke-width="2"/><circle cx="512" cy="${y}" r="15" fill="none" ${E.ring(s2["h" + h])}/></g>`; }).join("")}</g></svg>`,
      explain: "Pressure grows with depth, so the deepest hole squirts hardest.", summary: "Pressure and depth" };
  }),
  num: diff => E.diaT("pr-num", diff, 2, () => {
    const t = diff === 1 ? "solid" : diff === 2 ? "liquid" : "hyd";
    if (t === "solid") { const c = choice([[600, 200], [900, 300], [500, 50], [800, 100]]);
      return { kind: "num", title: "🧮 Pressure maths", prompt: `A <b>${c[0]} N</b> crate rests on <b>${c[1]} cm²</b>.`, visual: render(st({ weight: c[0], area: [50, 100, 200, 300, 600].includes(c[1]) ? c[1] : 100, ground: "concrete" })),
        fields: [{ label: "Pressure", unit: "N/cm²", answer: c[0] / c[1] }], explain: `${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} N/cm².`, summary: "Pressure = force ÷ area" }; }
    if (t === "liquid") { const liq = choice(Object.keys(LIQ)), d = choice([2, 3, 4, 6]);
      return { kind: "num", title: "🧮 Liquid pressure", prompt: `A diver is <b>${d} m</b> deep in <b>${LIQ[liq].name.toLowerCase()}</b> (${LIQ[liq].rho} kg/m³). Use g = 10 N/kg.`, visual: render(st({ mode: "liquid", liq, depth: d })),
        fields: [{ label: "Liquid pressure", unit: "kPa", answer: LIQ[liq].rho * 10 * d / 1000 }], explain: `${LIQ[liq].rho} × 10 × ${d} = ${LIQ[liq].rho * 10 * d} Pa = ${fmt(LIQ[liq].rho * 10 * d / 1000)} kPa.`, summary: "Liquid pressure" }; }
    const c = choice([[5, 200, 100], [10, 400, 150], [20, 400, 200], [10, 200, 300]]);
    return { kind: "num", title: "🧮 Hydraulic maths", prompt: `Small piston <b>${c[0]} cm²</b>, big piston <b>${c[1]} cm²</b>, effort <b>${c[2]} N</b>.`, visual: render(st({ mode: "hyd", a1: c[0], a2: c[1], eff: c[2] })),
      fields: [{ label: "Pressure in the liquid", unit: "N/cm²", answer: c[2] / c[0] }, { label: "Output force", unit: "N", answer: c[2] * c[1] / c[0] }], explain: `${c[2]} ÷ ${c[0]} = ${fmt(c[2] / c[0])} N/cm²; × ${c[1]} = ${fmt(c[2] * c[1] / c[0])} N.`, summary: "Hydraulic force" };
  }),
  mcq: diff => E.diaT("pr-mcq", diff, 2, () => { const q = choice([
      { ask: "Why do camels have wide, flat feet?", ok: "To spread their weight and lower the pressure on sand", bad: ["To run faster", "To make more pressure", "To dig holes"], ex: "Bigger area → smaller pressure, so they do not sink." },
      { ask: "Why is a dam wall thicker at the bottom?", ok: "Water pressure is greater at greater depth", bad: ["The water is colder at the bottom", "Fish push on it", "Air pushes on the top"], ex: "Pressure increases with depth." },
      { ask: "Why do hydraulic brakes use a liquid, not air?", ok: "Liquids can hardly be squashed, so pressure passes on fully", bad: ["Liquids are lighter", "Air is too hot", "Liquids are magnetic"], ex: "Air would compress; a liquid passes the pressure straight on." },
      { ask: "A sharp knife cuts better than a blunt one because…", ok: "the force acts on a smaller area, giving more pressure", bad: ["it is heavier", "it has more area", "it is colder"], ex: "Pressure = force ÷ area." }]);
    return { kind: "mcq", title: "📘 Pressure ideas", prompt: "Think about force, area and depth.", visual: render(st({ mode: "liquid", depth: 6, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Pressure concepts" }; })
};
const LEVELS = {
  1: { intro: "Pressure = force ÷ area. The same force on a smaller area gives more pressure.", pool: () => [S(1, 1, C.exact), S(2, 1, C.snow), S(2, 1, C.sharp), S(3, 1, C.sand), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "In a liquid, pressure grows with depth — and with how dense the liquid is.", pool: () => [S(1, 1, C.d50), S(2, 1, C.oil), S(2, 1, C.dense), S(3, 1, C.sub), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Hydraulics pass pressure through a liquid: a small push on a small piston makes a big force on a big piston.", pool: () => [S(1, 1, C.press), S(2, 1, C.car), S(3, 1, C.least), S(3, 1, C.truck), D.num(3), D.mcq(2), D.pick(3)] }
};
const explore = E.exploreSim({
  intro: "Pick an experiment, change the settings and press ▶ to see the pressure.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Test",
  goals: () => [{ txt: "Make a crate sink into snow", test: (s, m) => m.k }, { txt: "Read the pressure 5 m deep in a liquid", test: (s, m) => m.d }, { txt: "Lift the car with hydraulics", test: (s, m) => m.h }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "solid" && s.ground === "snow" && sinks(s)) m.k = 1; if (s.mode === "liquid" && s.depth >= 5) m.d = 1; if (s.mode === "hyd" && lifts(s)) m.h = 1; },
  facts: () => "📘 <b>Pressure</b> = force ÷ area. In liquids it grows with depth, and a <b>hydraulic</b> machine passes it on to multiply force."
});
E.start({ labId: "pressure", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🌊", "💧", "🚗", "✨"],
  exploreDemo: () => [{ set: { mode: "solid", area: 100 }, run: true }, { set: { mode: "liquid", depth: 5 }, run: true }, { set: { mode: "hyd", a1: 5, a2: 400, eff: 100 }, run: true }] });
})();
