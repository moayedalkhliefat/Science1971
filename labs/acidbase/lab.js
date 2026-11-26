"use strict";
// ===== Acid–Base Solutions — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const TYPES = { water: "Water", sa: "Strong acid", wa: "Weak acid", sb: "Strong base", wb: "Weak base" };
const KS = { "1e-2": 1e-2, "1e-4": 1e-4, "1e-6": 1e-6 };
const isAcid = s => s.type === "sa" || s.type === "wa", isBase = s => s.type === "sb" || s.type === "wb", weak = s => s.type === "wa" || s.type === "wb";
const ionConc = s => { if (s.type === "water") return 1e-7; if (!weak(s)) return s.c; const K = KS[s.k]; return (-K + Math.sqrt(K * K + 4 * K * s.c)) / 2; };
const pH = s => { const x = ionConc(s); if (s.type === "water") return 7; return r2(isAcid(s) ? Math.min(7, -Math.log10(x)) : Math.max(7, 14 + Math.log10(x))); };
const alpha = s => s.type === "water" ? 0 : r2(Math.min(1, ionConc(s) / s.c) * 100);
const bulb = s => { const x = ionConc(s); return x >= 0.05 ? "bright" : x >= 1e-4 ? "dim" : "off"; };
const sci = x => { if (x >= 0.01) return fmt(r2(x * 1000) / 1000) + " M"; const e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e); return fmt(Math.round(m * 10) / 10) + "×10^" + e + " M"; };
function pHcol(p) { const stops = [[0, [211, 47, 47]], [3, [245, 124, 0]], [5, [251, 192, 45]], [7, [67, 160, 71]], [9, [0, 137, 123]], [11, [30, 136, 229]], [14, [106, 27, 154]]]; for (let i = 1; i < stops.length; i++) if (p <= stops[i][0]) { const [a, ca] = stops[i - 1], [b, cb] = stops[i], t = (p - a) / (b - a); return `rgb(${ca.map((v, k) => Math.round(v + (cb[k] - v) * t)).join(",")})`; } return "rgb(106,27,154)"; }
function particles(s, cx, cy, R) {
  const n = 10, ion = s.type === "water" ? 0 : Math.round(n * alpha(s) / 100), whole = n - ion; let items = [];
  const P = (lbl, col, tc) => ({ lbl, col, tc });
  if (s.type === "water") items = Array.from({ length: 8 }, () => P("H₂O", "#e3f2fd", "#1565c0"));
  else if (isAcid(s)) { for (let i = 0; i < whole; i++) items.push(P("HA", "#ffcdd2", "#b71c1c")); for (let i = 0; i < ion; i++) items.push(P("H₃O⁺", "#ef5350", "#fff"), P("A⁻", "#90caf9", "#0d47a1")); }
  else { for (let i = 0; i < whole; i++) items.push(P("B", "#c5cae9", "#1a237e")); for (let i = 0; i < ion; i++) items.push(P("BH⁺", "#7986cb", "#fff"), P("OH⁻", "#4db6ac", "#fff")); }
  items = items.slice(0, 20);
  let g = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="#fff" stroke="#546e7a" stroke-width="3"/>`;
  const k = R / 125, POS = [[-40, -88], [10, -88], [58, -88], [-88, -44], [-42, -44], [4, -44], [50, -44], [94, -44], [-96, 0], [-50, 0], [-4, 0], [42, 0], [88, 0], [-88, 44], [-42, 44], [4, 44], [50, 44], [94, 44], [-40, 88], [10, 88], [58, 88]], ORD = [6, 14, 2, 10, 17, 4, 12, 19, 8, 0, 15, 11, 3, 18, 7, 13, 1, 9, 16, 5, 20];
  items.forEach((it, i) => { const q = POS[ORD[i]], x = cx + q[0] * k, y = cy + q[1] * k; g += `<ellipse cx="${x}" cy="${y}" rx="18" ry="11" fill="${it.col}" stroke="#78909c"/>${T(x, y + 4, it.lbl, { s: 10, c: it.tc })}`; });
  return g;
}
function render(s) {
  const show = s.reveal, p = pH(s), b = bulb(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  // beaker with indicator colour
  g += `<path d="M70,150 v220 q0,20 20,20 h160 q20,0 20,-20 v-220" fill="none" stroke="#78909c" stroke-width="4"/><rect x="74" y="200" width="192" height="186" rx="12" fill="${show ? pHcol(p) : "#e3f2fd"}" opacity=".55"/>${T(180, 140, TYPES[s.type] + (s.type === "water" ? "" : " · " + s.c + " M"), { s: 13, c: "#37474f" })}${weak(s) ? T(180, 122, (isAcid(s) ? "Ka" : "Kb") + " = " + s.k.replace("e", "×10^"), { s: 11, c: "#78909c" }) : ""}`;
  // pH meter probe
  g += `<line x1="252" y1="90" x2="252" y2="330" stroke="#455a64" stroke-width="5"/><rect x="207" y="44" width="90" height="48" rx="8" fill="#263238"/>${T(252, 76, show ? "pH " + p.toFixed(2) : "pH —", { s: 16, c: "#80deea" })}`;
  // conductivity circuit
  g += `<line x1="110" y1="330" x2="110" y2="80" stroke="#795548" stroke-width="4"/><line x1="110" y1="80" x2="60" y2="80" stroke="#795548" stroke-width="3"/><circle cx="60" cy="62" r="${b === "bright" && show ? 26 : 0}" fill="#fff59d" opacity=".8"/><circle cx="60" cy="62" r="15" fill="${show ? (b === "bright" ? "#ffee58" : b === "dim" ? "#fff9c4" : "#eceff1") : "#eceff1"}" stroke="#757575" stroke-width="2"/>${T(60, 112, "bulb", { s: 10, c: "#78909c" })}`;
  // magnifier
  g += `<line x1="250" y1="300" x2="335" y2="250" stroke="#90a4ae" stroke-width="3" stroke-dasharray="5 4"/>` + (show ? particles(s, 430, 220, 125) : `<circle cx="430" cy="220" r="125" fill="#fafafa" stroke="#546e7a" stroke-width="3"/>${T(430, 225, "press ▶ to look inside", { s: 13, c: "#90a4ae" })}`) + T(430, 368, "magnified view", { s: 11, c: "#78909c" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${show ? T(120, 76, "pH " + p.toFixed(2), { s: 28, c: pHcol(p) }) + T(120, 104, p < 7 ? "acidic" : p > 7 ? "basic (alkaline)" : "neutral", { s: 13, c: "#37474f" })
      + T(120, 146, (isBase(s) ? "[OH⁻] = " : "[H₃O⁺] = ") + sci(ionConc(s)), { s: 13, c: "#37474f" }) + T(120, 176, s.type === "water" ? "only water" : "ionised: " + fmt(alpha(s)) + "%", { s: 14, c: "#6d4c41" })
      + T(120, 214, "bulb: " + (b === "bright" ? "bright 💡" : b === "dim" ? "dim" : "off"), { s: 14, c: "#37474f" }) + T(120, 236, b === "bright" ? "strong electrolyte" : b === "dim" ? "weak electrolyte" : "almost no ions", { s: 11, c: "#78909c" }) : T(120, 180, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 320, "strong: ionises completely", { s: 11, c: "#546e7a" })}${T(120, 338, "weak: only partly ionised", { s: 11, c: "#546e7a" })}${T(120, 366, "pH = −log[H₃O⁺]", { s: 11, c: "#90a4ae" })}${T(120, 382, "pH = 14 + log[OH⁻]", { s: 11, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "type", type: "choice", label: "Solution", options: Object.keys(TYPES).map(v => ({ v, label: TYPES[v] })), lock: lk("type") },
  { id: "c", type: "choice", label: "Concentration", options: [0.001, 0.01, 0.1, 1].map(v => ({ v, label: v + " M" })), hide: s => s.type === "water", lock: lk("c") },
  { id: "k", type: "choice", label: "Strength (Ka or Kb)", options: Object.keys(KS).map(v => ({ v, label: v.replace("e", "×10^") })), hide: s => !weak(s), lock: lk("k") }]; };
const st = o => Object.assign({ type: "sa", c: 0.1, k: "1e-4" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `${TYPES[s.type]}: pH ${pH(s).toFixed(2)}, ${fmt(alpha(s))}% ionised, bulb ${bulb(s)}.`;
const p1 = s => Math.round(pH(s) * 10) / 10;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🧪 Solution challenge", prompt: "Make the solution, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Strong acids/bases ionise completely: [H₃O⁺] = c, pH = −log c (bases: pH = 14 + log c). Weak ones only partly ionise, so their pH is closer to 7 and the bulb is dimmer. A bigger Ka/Kb means stronger." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ab-sim", diff, uses, mk);
const C = {
  ph1: () => simQ(1, "Make a solution with <b>pH 1</b>.", st({ type: "water" }), s => ok(p1(s) === 1, "0.1 M strong acid: pH = −log 0.1 = 1.", said(s)), { type: "sa", c: 0.1 }, { wrong: { type: "wa", c: 0.1 } }),
  bright: () => simQ(1, "Make the bulb glow <b>brightly</b> using a <b>base</b>.", st({ type: "wb", c: 0.01, k: "1e-6" }), s => ok(isBase(s) && bulb(s) === "bright", "Lots of ions → it conducts well.", isBase(s) ? said(s) : "Use a base."), { type: "sb", c: 1 }, { wrong: { type: "wb", c: 0.1, k: "1e-6" } }),
  neutral: () => simQ(1, "Make a <b>neutral</b> solution (pH 7).", st({ type: "sa", c: 0.01 }), s => ok(pH(s) === 7, "Pure water: pH 7.", said(s)), { type: "water" }, { wrong: { type: "wa", c: 0.001, k: "1e-6" } }),
  under1: () => simQ(1, "Make an acid where <b>fewer than 1%</b> of the molecules ionise.", st({ type: "sa", c: 0.1 }), s => ok(isAcid(s) && alpha(s) < 1, `${fmt(alpha(s))}% ionised — a very weak acid.`, isAcid(s) ? said(s) : "Use an acid."), { type: "wa", c: 0.1, k: "1e-6" }, { wrong: { type: "wa", c: 0.001, k: "1e-2" } }),
  sa3: () => simQ(2, "Make a <b>strong acid</b> with <b>pH 3</b>.", st({ type: "sa", c: 1 }), s => ok(p1(s) === 3, "0.001 M: pH = 3.", said(s)), { c: 0.001 }, { lock: ["type"], wrong: { c: 0.01 } }),
  wa3: () => simQ(2, "A weak acid with Ka = 10⁻⁴: choose the concentration that gives <b>pH ≈ 3.0</b>.", st({ type: "wa", k: "1e-4", c: 1 }), s => ok(p1(s) === 3, "0.01 M: [H₃O⁺] ≈ 0.00095 M → pH 3.0.", said(s)), { c: 0.01 }, { lock: ["type", "k"], wrong: { c: 0.1 } }),
  sb12: () => simQ(2, "Make a <b>strong base</b> with <b>pH 12</b>.", st({ type: "sb", c: 1 }), s => ok(p1(s) === 12, "0.01 M: pOH 2 → pH 12.", said(s)), { c: 0.01 }, { lock: ["type"], wrong: { c: 0.1 } }),
  wb115: () => simQ(2, "A <b>0.1 M weak base</b>: choose Kb so the pH is about <b>11.5</b>.", st({ type: "wb", c: 0.1, k: "1e-2" }), s => ok(p1(s) === 11.5, "Kb = 10⁻⁴: [OH⁻] ≈ 0.0032 M → pH 11.5.", said(s)), { k: "1e-4" }, { lock: ["type", "c"], wrong: { k: "1e-6" } }),
  same2: () => simQ(3, "Make a <b>weak acid</b> with the <b>same pH</b> as 0.01 M strong acid (pH 2.0).", st({ type: "wa", c: 0.01, k: "1e-6" }), s => ok(s.type === "wa" && p1(s) === 2, "1 M with Ka 10⁻⁴: only ~1% ionises, giving 0.01 M H₃O⁺.", s.type !== "wa" ? "It must be a weak acid." : said(s)), { c: 1, k: "1e-4" }, { lock: ["type"], wrong: { c: 0.1, k: "1e-4" } }),
  dilute: () => simQ(3, "This strong acid has pH 1. <b>Dilute</b> it until the pH is <b>2</b>.", st({ type: "sa", c: 0.1 }), s => ok(p1(s) === 2, "10 times more dilute → pH goes up by 1.", said(s)), { c: 0.01 }, { lock: ["type"], wrong: { c: 0.001 } }),
  half: () => simQ(3, "Make a <b>weak acid</b> that is <b>more than 50%</b> ionised.", st({ type: "wa", c: 1, k: "1e-6" }), s => ok(s.type === "wa" && alpha(s) > 50, `${fmt(alpha(s))}% — dilute and fairly strong.`, s.type !== "wa" ? "Use a weak acid." : said(s)), { c: 0.001, k: "1e-2" }, { lock: ["type"], wrong: { c: 1, k: "1e-2" } }),
  dimLow: () => simQ(3, "Make an acid whose bulb is only <b>dim</b> but whose pH is <b>below 3</b>.", st({ type: "sa", c: 1 }), s => ok(isAcid(s) && bulb(s) === "dim" && pH(s) < 3, said(s), said(s)), { type: "wa", c: 1, k: "1e-4" }, { wrong: { type: "sa", c: 0.1 } })
};
const D = {
  pick: diff => E.diaT("ab-pick", diff, 2, () => {
    if (diff === 1) {
      const pool = E.shuffle([st({ type: "sa", c: 0.1 }), st({ type: "wa", c: 0.1, k: "1e-4" }), st({ type: "sb", c: 0.1 }), st({ type: "wb", c: 0.1, k: "1e-4" }), st({ type: "wa", c: 0.01, k: "1e-2" })]).slice(0, 4);
      const want = choice(["wa", "sa", "strongAny"]), t = s => want === "strongAny" ? !weak(s) : s.type === want;
      if (!pool.some(t)) pool[0] = want === "wa" ? st({ type: "wa", c: 0.1, k: "1e-4" }) : st({ type: "sa", c: 0.1 });
      return { kind: "pick", many: true, title: "👆 Look inside", prompt: `Each picture shows the particles in a solution. Click <b>every ${want === "wa" ? "weak acid" : want === "sa" ? "strong acid" : "strong acid or strong base"}</b>.`, answer: pool.map((s, i) => t(s) ? "p" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["p" + i, "solution " + "ABCD"[i]])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="p${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><g transform="translate(${x + 98 - 430 * 0.7},${135 - 220 * 0.7}) scale(.7)">${particles(s, 430, 220, 125)}</g>${T(x + 98, 268, "solution " + "ABCD"[i], { s: 15, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["p" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Strong: every molecule is split into ions. Weak: most molecules (HA or B) stay whole.", summary: "Strong vs weak" };
    }
    const pool = E.shuffle([st({ type: "sa", c: 0.01 }), st({ type: "wa", c: 0.01, k: "1e-4" }), st({ type: "wa", c: 1, k: "1e-6" }), st({ type: "sb", c: 0.001 }), st({ type: "wb", c: 0.1, k: "1e-4" }), st({ type: "sa", c: 0.001 }), st({ type: "water" })]).slice(0, 4);
    const want = choice(["lowest", "highest"]), vals = pool.map(pH), best = want === "lowest" ? Math.min(...vals) : Math.max(...vals);
    const lbl = s => s.type === "water" ? "water" : `${TYPES[s.type]} ${s.c} M${weak(s) ? ", K = " + s.k.replace("e", "×10^") : ""}`;
    return { kind: "pick", many: vals.filter(v => v === best).length > 1, title: "👆 Lowest or highest pH?", prompt: `Click the solution with the <b>${want}</b> pH.`, answer: pool.map((s, i) => pH(s) === best ? "q" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["q" + i, lbl(s)])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="q${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><path d="M${x + 58},70 v120 q0,12 12,12 h56 q12,0 12,-12 v-120" fill="#e3f2fd" stroke="#78909c" stroke-width="3"/>${T(x + 98, 232, TYPES[s.type], { s: 15, c: "#37474f" })}${T(x + 98, 254, s.type === "water" ? "" : s.c + " M" + (weak(s) ? " · K " + s.k.replace("e", "×10^") : ""), { s: 12, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["q" + i])}/></g>`; }).join("")}</svg>`,
      explain: "pH values: " + pool.map(s => `${lbl(s)} → ${pH(s).toFixed(1)}`).join("; ") + ".", summary: "Comparing pH" };
  }),
  num: diff => E.diaT("ab-num", diff, 2, () => {
    if (diff === 1) { const c = choice([0.1, 0.01, 0.001, 1]);
      return { kind: "num", title: "🧮 pH of a strong acid", prompt: `A strong acid has concentration <b>${c} M</b>. It ionises completely.`, visual: render(st({ type: "sa", c })), fields: [{ label: "pH", unit: "", answer: r2(-Math.log10(c)) }], explain: `pH = −log ${c} = ${fmt(r2(-Math.log10(c)))}.`, summary: "Strong acid pH" }; }
    if (diff === 2) { const c = choice([0.1, 0.01, 0.001]);
      return { kind: "num", title: "🧮 pH of a strong base", prompt: `A strong base has concentration <b>${c} M</b>, so [OH⁻] = ${c} M.`, visual: render(st({ type: "sb", c })), fields: [{ label: "pOH", unit: "", answer: r2(-Math.log10(c)) }, { label: "pH", unit: "", answer: r2(14 + Math.log10(c)) }], explain: `pOH = ${fmt(r2(-Math.log10(c)))}; pH = 14 − pOH = ${fmt(r2(14 + Math.log10(c)))}.`, summary: "Strong base pH" }; }
    const c = choice([[1e-4, 0.01], [1e-6, 0.1], [1e-4, 1], [1e-6, 1]]), x = Math.sqrt(c[0] * c[1]);
    return { kind: "num", title: "🧮 Weak acid pH", prompt: `Weak acid: Ka = <b>${c[0].toExponential(0).replace("e", "×10^")}</b>, c = <b>${c[1]} M</b>. Use [H₃O⁺] ≈ √(Ka × c).`, visual: render(st({ type: "wa", c: c[1], k: c[0] === 1e-4 ? "1e-4" : "1e-6" })), fields: [{ label: "pH", unit: "", answer: r2(-Math.log10(x)), tol: 0.05 }], explain: `√(${c[0]} × ${c[1]}) = ${x.toExponential(2)} M → pH ${fmt(r2(-Math.log10(x)))}.`, summary: "Weak acid approximation" };
  }),
  mcq: diff => E.diaT("ab-mcq", diff, 2, () => { const q = choice([
      { ask: "0.1 M HCl and 0.1 M ethanoic acid have the same concentration. Why is HCl's pH lower?", ok: "HCl ionises completely; ethanoic acid only partly", bad: ["HCl is more concentrated", "Ethanoic acid is a base", "HCl has more water"], ex: "Strength (how much ionises) is not the same as concentration." },
      { ask: "Why does a strong acid make the bulb glow brighter than a weak acid of the same concentration?", ok: "It produces many more ions to carry the current", bad: ["It is hotter", "It has more water molecules", "It is more colourful"], ex: "Conductivity depends on the number of ions." },
      { ask: "Diluting a strong acid 10 times changes its pH by…", ok: "+1", bad: ["−1", "+10", "0"], ex: "[H₃O⁺] drops 10× and pH = −log[H₃O⁺] rises by 1." },
      { ask: "A larger Ka means the acid is…", ok: "stronger — more of it ionises", bad: ["weaker", "more concentrated", "a base"], ex: "Ka measures how far the ionisation goes." }]);
    return { kind: "mcq", title: "📘 Acid & base ideas", prompt: "Think about strength, concentration and ions.", visual: render(st({ type: "wa", c: 0.1, k: "1e-4", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Strong vs weak" }; })
};
const LEVELS = {
  1: { intro: "Strong acids and bases split completely into ions; weak ones only partly. Look inside, check the pH and the bulb.", pool: () => [S(1, 1, C.neutral), S(2, 1, C.ph1), S(2, 1, C.bright), S(3, 1, C.under1), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Concentration and strength both change the pH.", pool: () => [S(1, 1, C.sa3), S(2, 1, C.sb12), S(2, 1, C.wa3), S(3, 1, C.wb115), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Tricky cases: weak but concentrated, dilution, and how much ionises.", pool: () => [S(1, 1, C.dilute), S(2, 1, C.half), S(3, 1, C.same2), S(3, 1, C.dimLow), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Choose a solution, its concentration and strength, then press ▶ to test the pH and the bulb.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Test",
  goals: () => [{ txt: "Light the bulb brightly", test: (s, m) => m.b }, { txt: "Make a weak acid", test: (s, m) => m.w }, { txt: "Make a basic solution", test: (s, m) => m.o }],
  track: (s, m, ran) => { if (!ran) return; if (bulb(s) === "bright") m.b = 1; if (s.type === "wa") m.w = 1; if (pH(s) > 7) m.o = 1; },
  facts: () => "📘 <b>Strong</b> and <b>weak</b> describe how much an acid or base ionises — not how concentrated it is."
});
E.start({ labId: "acidbase", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧪", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧪", "💧", "🔋", "✨"],
  exploreDemo: () => [{ set: { type: "sa", c: 1 }, run: true }, { set: { type: "wa", c: 0.1, k: "1e-4" }, run: true }, { set: { type: "sb", c: 0.1 }, run: true }] });
})();
