"use strict";
// ===== pH Scale — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const LIQ = {
  battery: { name: "Battery acid", pH: 1, c: "#f1f8e9" }, lemon: { name: "Lemon juice", pH: 2, c: "#fff59d" }, vinegar: { name: "Vinegar", pH: 3, c: "#fffde7" },
  orange: { name: "Orange juice", pH: 4, c: "#ffb74d" }, coffee: { name: "Coffee", pH: 5, c: "#795548" }, milk: { name: "Milk", pH: 6.5, c: "#fafafa" },
  water: { name: "Pure water", pH: 7, c: "#e3f2fd" }, blood: { name: "Blood", pH: 7.4, c: "#c62828" }, soda: { name: "Baking soda", pH: 9, c: "#f5f5f5" },
  soap: { name: "Hand soap", pH: 10, c: "#e1bee7" }, ammonia: { name: "Ammonia cleaner", pH: 11, c: "#e0f7fa" }, drain: { name: "Drain cleaner", pH: 13, c: "#fff9c4" }
};
const LIQS = Object.keys(LIQ).map(k => ({ v: k, label: LIQ[k].name }));
const VMAX = 1.5;
function pH(s) {
  const p0 = LIQ[s.liq].pH, f = s.Vs / (s.Vs + s.W);
  const x = (Math.pow(10, -p0) - Math.pow(10, p0 - 14)) * f; // excess H+ (negative = excess OH-)
  const h = (x + Math.sqrt(x * x + 4e-14)) / 2;
  return -Math.log10(h);
}
const UI = [[0, "#d32f2f", "red"], [3, "#f57c00", "orange"], [5, "#fbc02d", "yellow"], [6.5, "#43a047", "green"], [7.6, "#00897b", "blue-green"], [9.5, "#1e3a8a", "dark blue"], [11.5, "#6a1b9a", "purple"]];
const ui = p => { let r = UI[0]; UI.forEach(u => { if (p >= u[0]) r = u; }); return r; };
const kind = p => p < 6.95 ? "acid" : p > 7.05 ? "base" : "neutral";
const mix = (c1, c2, f) => { const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16); const ch = sh => Math.round(((a >> sh) & 255) * f + ((b >> sh) & 255) * (1 - f)); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; };
const r2 = p => Math.round(p * 100) / 100;
function render(s) {
  const p = pH(s), show = s.lv < 3 || s.reveal || s.showVals, d = LIQ[s.liq], V = s.Vs + s.W, f = s.Vs / V;
  const bx = 170, by = 80, bw = 270, bh = 290, lh = V / VMAX * (bh - 20), col = s.ind ? ui(p)[1] : mix(d.c, "#e3f2fd", Math.max(0.25, f));
  let marks = ""; for (let v = 0.25; v <= VMAX; v += 0.25) { const y = by + bh - v / VMAX * (bh - 20); marks += `<line x1="${bx + bw - 30}" x2="${bx + bw}" y1="${y}" y2="${y}" stroke="#90a4ae" stroke-width="2"/>${T(bx + bw - 36, y + 5, fmt(v) + " L", { a: "end", s: 11, c: "#78909c" })}`; }
  let bar = ""; for (let i = 0; i < 14; i++) bar += `<rect x="${60 + i * 48}" y="398" width="48" height="20" fill="${ui(i + 0.5)[1]}"/>`;
  for (let i = 0; i <= 14; i++) bar += T(60 + i * 48, 436, i, { s: 12, c: "#5e5a85" });
  const mx = 60 + Math.max(0, Math.min(14, p)) * 48;
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f6f5ff"/>
    ${T(305, 34, d.name + (s.W > 0 ? " + water" : ""), { s: 20, c: "#311b92" })}${T(305, 58, `${fmt(s.Vs)} L ${d.name.toLowerCase()}${s.W > 0 ? ` + ${fmt(s.W)} L water = ${fmt(V)} L` : ""}`, { s: 13, c: "#5e5a85" })}
    <path d="M${bx},${by} L${bx},${by + bh - 14} Q${bx},${by + bh} ${bx + 14},${by + bh} L${bx + bw - 14},${by + bh} Q${bx + bw},${by + bh} ${bx + bw},${by + bh - 14} L${bx + bw},${by}" fill="rgba(255,255,255,.6)" stroke="#5c6bc0" stroke-width="5"/>
    <rect x="${bx + 3}" y="${by + bh - lh}" width="${bw - 6}" height="${lh - 3}" rx="8" fill="${col}" opacity=".92"/><rect x="${bx + 3}" y="${by + bh - lh}" width="${bw - 6}" height="6" fill="rgba(255,255,255,.55)"/>
    ${marks}${s.ind ? T(bx + bw / 2, by + bh + 22, "universal indicator: " + ui(p)[2], { s: 13, c: "#5e5a85" }) : ""}
    <path d="M${bx + 70},74 L${bx + 70},${by + bh - 30}" stroke="#37474f" stroke-width="7"/><rect x="${bx + 60}" y="66" width="20" height="16" rx="4" fill="#37474f"/><circle cx="${bx + 70}" cy="${by + bh - 26}" r="9" fill="#b0bec5" stroke="#37474f" stroke-width="3"/>
    <path d="M${bx + 80},74 C${bx + 200},74 480,40 620,70" fill="none" stroke="#37474f" stroke-width="4"/>
    <g transform="translate(540,70)"><rect width="200" height="150" rx="16" fill="#263238"/><rect x="16" y="16" width="168" height="74" rx="10" fill="#0f1a12"/>
      ${T(100, 70, show ? "pH " + p.toFixed(2) : "pH ?.??", { s: 34, c: "#7dffb3" })}${T(100, 118, "pH METER", { s: 13, c: "#b0bec5" })}${T(100, 138, show ? kind(p).toUpperCase() : "", { s: 14, c: kind(p) === "acid" ? "#ff8a80" : kind(p) === "base" ? "#82b1ff" : "#b9f6ca" })}</g>
    ${show && s.lv >= 3 ? `<g transform="translate(540,236)"><rect width="200" height="92" rx="12" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(100, 30, "[H⁺] = " + sci(Math.pow(10, -p)) + " mol/L", { s: 14, c: "#c62828" })}${T(100, 56, "[OH⁻] = " + sci(Math.pow(10, p - 14)) + " mol/L", { s: 14, c: "#1565c0" })}${T(100, 80, "pH = −log[H⁺]", { s: 12, c: "#5e5a85" })}</g>` : ""}
    ${bar}${T(120, 392, "◀ ACID", { s: 13, c: "#c62828" })}${T(396, 392, "NEUTRAL", { s: 13, c: "#2e7d32" })}${T(690, 392, "BASE ▶", { s: 13, c: "#1565c0" })}
    ${show ? `<polygon points="${mx},396 ${mx - 9},380 ${mx + 9},380" fill="#1a1446"/>` : ""}</svg>`;
}
const sci = x => { const e = Math.floor(Math.log10(x)), m = x / Math.pow(10, e); return (Math.abs(m - 1) < 0.005 ? "" : m.toFixed(1) + "×") + "10" + String(e).replace("-", "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]); };
const ctls = (lv, o) => { o = o || {}; const L = o.lv || lv, lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "liq", type: "choice", label: "Solution", options: LIQS, wide: true, lock: lk("liq") },
  { id: "Vs", type: "range", label: "Volume of solution", min: 0.05, max: 0.5, step: 0.05, nudge: 0.05, unit: "L", fmt: v => fmt(v), hide: () => L < 2, lock: lk("Vs") },
  { id: "W", type: "range", label: "Water added", min: 0, max: 1, step: 0.05, nudge: 0.05, unit: "L", fmt: v => fmt(v), hide: () => L < 2, lock: lk("W") },
  { id: "ind", type: "toggle", label: "Add universal indicator", lock: lk("ind") }
]; };
const st = (lv, o) => Object.assign({ lv, liq: "water", Vs: 0.5, W: 0, ind: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `${LIQ[s.liq].name}${s.W ? " diluted" : ""}: pH ${pH(s).toFixed(2)} (${kind(pH(s))})`;
const near = (s, t) => Math.abs(pH(s) - t) < 0.006;
const simQ = (goal, s0, check, sol, o) => ({ title: "🧪 pH challenge", prompt: "Choose the solution and the volumes, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(s0.lv, o), render, run, check, hint: "pH < 7 acid, pH 7 neutral, pH > 7 base. Diluting 10 times moves the pH 1 unit toward 7. pH = −log[H⁺]." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ph-sim", diff, uses, mk);
const C = {
  strongAcid: () => simQ("Choose a <b>strong acid</b> with a pH <b>below 3</b>.", st(1), s => ok(pH(s) < 3, said(s) + ".", said(s) + "."), { liq: "lemon" }, { wrong: { liq: "vinegar" } }),
  strongBase: () => simQ("Choose a <b>strong base</b> with a pH <b>above 12</b>.", st(1), s => ok(pH(s) > 12, said(s) + ".", said(s) + "."), { liq: "drain" }, { wrong: { liq: "ammonia" } }),
  neutral: () => simQ("Choose a <b>neutral</b> liquid.", st(1, { liq: "milk" }), s => ok(kind(pH(s)) === "neutral", said(s) + ".", said(s) + " — neutral means pH 7."), { liq: "water" }, { wrong: { liq: "milk" } }),
  weakAcid: () => simQ("Choose a <b>weak acid</b>: pH between <b>4 and 7</b> (not 7).", st(1), s => ok(pH(s) >= 4 && pH(s) < 6.95, said(s) + ".", said(s) + "."), { liq: "coffee" }, { wrong: { liq: "vinegar" } }),
  weakBase: () => simQ("Choose a <b>weak base</b>: pH above 7 but <b>below 10</b>.", st(1), s => ok(pH(s) > 7.05 && pH(s) < 10, said(s) + ".", said(s) + "."), { liq: "soda" }, { wrong: { liq: "soap" } }),
  indColor: () => { const c = choice([["purple", "drain"], ["orange", "vinegar"], ["red", "lemon"], ["dark blue", "soap"], ["yellow", "coffee"]]);
    return simQ(`Turn on the <b>universal indicator</b>. Find a liquid that turns it <b>${c[0]}</b>.`, st(1), s => ok(s.ind && ui(pH(s))[2] === c[0], `${LIQ[s.liq].name} turns the indicator ${c[0]} (pH ${pH(s).toFixed(1)}).`, !s.ind ? "Turn the indicator on." : `The indicator is ${ui(pH(s))[2]}.`), { ind: true, liq: c[1] }, { wrong: { ind: true, liq: "water" } }); },
  dil1: () => { const c = choice([["lemon", 3], ["vinegar", 4], ["battery", 2]]);
    return simQ(`${LIQ[c[0]].name} has pH ${LIQ[c[0]].pH}. Add water to make the pH exactly <b>${c[1]}.00</b>.`, st(2, { liq: c[0], Vs: 0.1 }), s => ok(near(s, c[1]), "Diluted 10 times → pH up by 1.", said(s) + "."), { W: 0.9 }, { lv: 2, lock: ["liq", "Vs"], wrong: { W: 0.4 } }); },
  dilBase: () => { const c = choice([["drain", 12], ["ammonia", 10], ["soap", 9]]);
    return simQ(`${LIQ[c[0]].name} has pH ${LIQ[c[0]].pH}. Add water to make the pH exactly <b>${c[1]}.00</b>.`, st(2, { liq: c[0], Vs: 0.1 }), s => ok(near(s, c[1]), "Diluting a base 10 times lowers the pH by 1 (toward 7).", said(s) + "."), { W: 0.9 }, { lv: 2, lock: ["liq", "Vs"], wrong: { W: 0.5 } }); },
  half: () => simQ("Make exactly <b>1.00 L</b> of diluted vinegar with pH <b>3.30</b>.", st(2, { liq: "vinegar" }), s => ok(E.near(s.Vs + s.W, 1, 1e-9) && near(s, 3.3), "0.5 L vinegar + 0.5 L water: diluted 2 times.", E.near(s.Vs + s.W, 1, 1e-9) ? said(s) + "." : `Total volume is ${fmt(s.Vs + s.W)} L, not 1.00 L.`), { Vs: 0.5, W: 0.5 }, { lv: 2, lock: ["liq"], wrong: { Vs: 0.2, W: 0.8 } }),
  highest: () => simQ("Use <b>lemon juice</b>. Make its pH <b>as high as possible</b> by diluting.", st(2, { liq: "lemon" }), s => ok(E.near(s.Vs, 0.05, 1e-9) && E.near(s.W, 1, 1e-9), `pH ${pH(s).toFixed(2)} — still an acid! Water alone can never make it neutral.`, said(s) + " — you can go higher."), { Vs: 0.05, W: 1 }, { lv: 2, lock: ["liq"], wrong: { Vs: 0.1, W: 1 } }),
  above35: () => simQ("<b>0.1 L of vinegar</b>. Add the <b>least</b> water (in steps of 0.05 L) so the pH is <b>at least 3.5</b>.", st(2, { liq: "vinegar", Vs: 0.1 }), s => ok(pH(s) >= 3.5 && E.near(s.W, 0.25, 1e-9), `0.25 L water → pH ${pH(s).toFixed(2)}.`, pH(s) < 3.5 ? said(s) + " — add more water." : said(s) + " — you used more water than needed."), { W: 0.25 }, { lv: 2, lock: ["liq", "Vs"], wrong: { W: 0.3 } }),
  lemon33: () => simQ("Using <b>lemon juice</b>, reach pH <b>3.30</b>. (The meter is hidden — use the dilution rule.)", st(3, { liq: "lemon" }), s => ok(near(s, 3.3), "Diluted 20 times → pH 2 + log 20 = 3.30.", said(s) + "."), { Vs: 0.05, W: 0.95 }, { lock: ["liq"], wrong: { Vs: 0.05, W: 0.45 } }),
  h10: () => simQ("Make [H⁺] in <b>lemon juice</b> exactly <b>10 times smaller</b>.", st(3, { liq: "lemon" }), s => ok(near(s, 3), "[H⁺] 0.01 → 0.001 mol/L: pH 2 → 3.", said(s) + "."), { Vs: 0.1, W: 0.9 }, { lock: ["liq"], wrong: { Vs: 0.1, W: 0.5 } }),
  h001: () => simQ("Make a solution with <b>[H⁺] = 0.001 mol/L</b> (10⁻³) <b>without adding water</b>.", st(3), s => ok(near(s, 3), "pH = −log(0.001) = 3: vinegar.", said(s) + "."), { liq: "vinegar", W: 0 }, { lock: ["W"], wrong: { liq: "lemon" } }),
  oh: () => simQ("Make a solution with <b>[OH⁻] = 0.01 mol/L</b>.", st(3, { liq: "drain" }), s => ok(near(s, 12), "[OH⁻] = 10⁻² → pOH 2 → pH 12.", said(s) + "."), { Vs: 0.1, W: 0.9 }, { lock: ["liq"], wrong: { Vs: 0.5, W: 0 } }),
  soap97: () => simQ("Use <b>hand soap</b> (pH 10). Dilute it to pH <b>9.70</b>.", st(3, { liq: "soap" }), s => ok(near(s, 9.7), "Diluted 2 times → pH 10 − 0.30 = 9.70.", said(s) + "."), { Vs: 0.5, W: 0.5 }, { lock: ["liq"], wrong: { Vs: 0.5, W: 0.25 } })
};

// ---------- diagram tasks ----------
const beaker = (x, col, lbl) => `<path d="M${x},40 L${x},190 Q${x},205 ${x + 15},205 L${x + 135},205 Q${x + 150},205 ${x + 150},190 L${x + 150},40" fill="#fff" stroke="#5c6bc0" stroke-width="4"/><rect x="${x + 3}" y="90" width="144" height="112" rx="8" fill="${col}"/>${T(x + 75, 232, lbl, { s: 15 })}`;
const D = {
  pick: diff => E.diaT("ph-pick", diff, 1, () => { const sets = E.pick([[1.5, "a1"], [4, "a2"], [7, "n"], [9, "b1"], [12.5, "b2"]], 3).sort((a, b) => a[0] - b[0]);
    const q = choice([["most acidic", 0], ["most basic (alkaline)", 2], ["closest to neutral", sets.reduce((bi, v, i) => Math.abs(v[0] - 7) < Math.abs(sets[bi][0] - 7) ? i : bi, 0)]]), order = E.shuffle([0, 1, 2]);
    return { kind: "pick", title: "🌈 Read the indicator", prompt: `Universal indicator was added to three liquids. Click the <b>${q[0]}</b> one. Use the colour chart.`, answer: ["k" + q[1]], names: { k0: "the " + ui(sets[0][0])[2] + " liquid", k1: "the " + ui(sets[1][0])[2] + " liquid", k2: "the " + ui(sets[2][0])[2] + " liquid" },
      visual: st => { let bar = ""; for (let i = 0; i < 14; i++) bar += `<rect x="${90 + i * 40}" y="250" width="40" height="18" fill="${ui(i + 0.5)[1]}"/>${T(90 + i * 40, 284, i, { s: 11, c: "#5e5a85" })}`;
        return `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="k${k}"><rect x="${60 + i * 220}" y="22" width="190" height="220" rx="14" fill="none" ${E.ring(st["k" + k])}/>${beaker(80 + i * 220, ui(sets[k][0])[1], "Liquid " + (i + 1))}</g>`).join("")}${bar}${T(650, 284, "14", { s: 11, c: "#5e5a85" })}</svg>`; },
      explain: "Red/orange = strong to weak acid, green = neutral, blue/purple = base. The pH values were " + sets.map(v => ui(v[0])[2] + " ≈ " + v[0]).join(", ") + ".", summary: "Use universal indicator colours" }; }),
  logNum: diff => E.diaT("ph-num", diff, 2, () => { const a = choice([1, 2, 3]), b = a + choice([1, 2, 3]);
    const vis = render(st(2, { liq: ["", "battery", "lemon", "vinegar"][a], Vs: 0.5, showVals: true }));
    return { kind: "num", title: "🔢 The pH scale is ×10", prompt: `Solution A has pH ${a}. Solution B has pH ${b}.`, visual: vis,
      fields: [{ label: `[H⁺] in A = 10^? mol/L`, unit: "", answer: -a }, { label: "How many times more H⁺ does A have than B?", unit: "times", answer: Math.pow(10, b - a) }],
      explain: `[H⁺] = 10^−pH → A: 10^−${a}. Each pH step is ×10, so ${b - a} steps = ${Math.pow(10, b - a)} times.`, summary: "pH is a logarithmic scale" }; }),
  dilNum: diff => E.diaT("ph-num", diff, 3, () => { const c = choice([{ p: 2, f: 10, n: 3 }, { p: 3, f: 100, n: 5 }, { p: 13, f: 10, n: 12 }, { p: 12, f: 100, n: 10 }, { p: 1, f: 1000, n: 4 }]);
    const vis = `<svg viewBox="0 0 740 250" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="250" fill="#f6f5ff"/>${beaker(80, ui(c.p)[1], "pH " + c.p)}${T(370, 110, "add water → " + c.f + "× the volume", { s: 18, c: "#311b92" })}${T(370, 140, "⟶", { s: 40, c: "#7e57c2" })}${beaker(510, ui(c.n)[1], "pH ?")}</svg>`;
    return { kind: "num", title: "💧 Dilution", prompt: `A solution with pH ${c.p} is diluted with water to ${c.f} times its volume.`, visual: vis,
      fields: [{ label: "New pH", unit: "", answer: c.n }], explain: `Each 10× dilution moves the pH 1 unit toward 7: ${c.p} → ${c.n}.`, summary: "pH after dilution" }; }),
  mcq: diff => E.diaT("ph-mcq", diff, 2, () => { const q = choice([
      { s: { liq: "lemon", Vs: 0.1, W: 0.9 }, ask: "Water was added to lemon juice. What happened to the pH?", ok: "It went up, closer to 7, but it is still an acid", bad: ["It went down", "It became exactly 7", "It became a base"], ex: "Dilution lowers [H⁺], so the pH rises toward 7 — but water can never turn an acid into a base." },
      { s: { liq: "drain", ind: true }, ask: "The indicator turned purple. This liquid is…", ok: "a strong base", bad: ["a strong acid", "neutral", "a weak acid"], ex: "Purple on the universal indicator means pH 12–14: a strong base (alkali)." },
      { s: { liq: "blood" }, ask: "Blood has pH 7.4. Which statement is true?", ok: "It is very slightly basic", bad: ["It is a strong acid", "It is exactly neutral", "It is a strong base"], ex: "pH just above 7 = weakly basic." }]);
    return { kind: "mcq", title: "📘 Acids and bases", prompt: "Look at the beaker and the meter.", visual: render(st(2, Object.assign({ showVals: true }, q.s))), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Acids, bases and dilution" }; })
};
const LEVELS = {
  1: { intro: "Test everyday liquids with the pH meter and the universal indicator: acid, neutral or base?", pool: () => [S(1, 1, C.strongAcid), S(1, 1, C.neutral), S(2, 1, C.strongBase), S(2, 1, C.weakAcid), S(3, 1, C.weakBase), S(3, 2, C.indColor), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Dilution: adding water moves the pH toward 7. Ten times more water = 1 pH unit.", pool: () => [S(1, 1, C.dil1), S(2, 1, C.dilBase), S(2, 1, C.half), S(3, 1, C.highest), S(3, 1, C.above35), D.mcq(1), D.dilNum(2), D.pick(2), D.logNum(3)] },
  3: { intro: "Concentration: pH = −log[H⁺]. The meter is hidden until you press Run & check.", pool: () => [S(1, 1, C.h001), S(2, 1, C.h10), S(2, 1, C.oh), S(3, 1, C.lemon33), S(3, 1, C.soap97), D.logNum(1), D.dilNum(2), D.mcq(2), D.logNum(3)] }
};
const explore = E.exploreSim({
  intro: "Pick different liquids and read the pH meter. Turn on the universal indicator. (Higher levels: add water.)",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render,
  goals: lv => [
    { txt: "Find an acid", test: (s, m) => m.acid }, { txt: "Find a base", test: (s, m) => m.base },
    { txt: "See 3 different indicator colours", test: (s, m) => (m.cols || new Set()).size >= 3 }
  ].concat(lv >= 2 ? [{ txt: "Add water to an acid and watch the pH rise", test: (s, m) => m.dil }] : []),
  track: (s, m) => { const p = pH(s); m[kind(p)] = 1; if (s.ind) (m.cols = m.cols || new Set()).add(ui(p)[2]); if (s.W > 0 && LIQ[s.liq].pH < 7) m.dil = 1; },
  facts: lv => "📘 <b>pH &lt; 7</b> acid · <b>pH 7</b> neutral · <b>pH &gt; 7</b> base. Each pH unit is 10× change in [H⁺]." + (lv >= 2 ? " Adding water moves the pH toward 7." : "")
});
E.start({ labId: "ph", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧪", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧪", "🍋", "🧼", "✨"],
  exploreDemo: lv => [{ set: { ind: true } }, { set: { liq: "lemon" } }, { set: { liq: "drain" } }, { set: { liq: "vinegar" } }].concat(lv >= 2 ? [{ set: { W: 0.5 } }] : []) });
})();
