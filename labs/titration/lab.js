"use strict";
// ===== Acid–Base Titration — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const IND = { phenol: "Phenolphthalein", methyl: "Methyl orange", universal: "Universal indicator" };
const pHof = (s, vb) => { const na = s.Ca * s.Va, nb = s.Cb * vb, V = s.Va + vb; if (Math.abs(na - nb) < 1e-9) return 7; return na > nb ? -Math.log10((na - nb) / V) : 14 + Math.log10((nb - na) / V); };
const pH = s => Math.round(pHof(s, s.Vb) * 100) / 100;
const Veq = s => Math.round(s.Ca * s.Va / s.Cb * 100) / 100;
function colour(ind, p) {
  if (ind === "phenol") return p < 8.2 ? "#fbfdff" : `rgba(236,64,122,${Math.min(0.85, 0.35 + (p - 8.2) * 0.12)})`;
  if (ind === "methyl") return p < 3.1 ? "#e53935" : p < 4.4 ? "#fb8c00" : "#fdd835";
  return `hsl(${Math.round(Math.max(0, Math.min(14, p)) / 14 * 280)},75%,55%)`;
}
function render(s) {
  const show = s.reveal, p = pH(s), col = show ? colour(s.ind, p) : colour(s.ind, pHof(s, 0));
  let g = `<rect width="860" height="450" fill="#fdf2f7"/>`;
  // stand + burette
  const lvl = 60 + (s.Vb / 50) * 200;
  g += `<rect x="40" y="420" width="220" height="12" rx="4" fill="#8d6e63"/><rect x="58" y="40" width="10" height="384" fill="#a1887f"/><rect x="62" y="130" width="96" height="8" fill="#a1887f"/>
    <rect x="140" y="50" width="22" height="230" rx="4" fill="#ffffffcc" stroke="#78909c" stroke-width="2"/><rect x="142" y="${show ? lvl : 60}" width="18" height="${show ? 268 - lvl : 208}" fill="#bbdefb"/>
    ${Array.from({ length: 11 }, (_, i) => `<line x1="162" y1="${60 + i * 20}" x2="${i % 5 ? 168 : 172}" y2="${60 + i * 20}" stroke="#455a64"/>${i % 5 === 0 ? T(176, 64 + i * 20, i * 5 + "", { a: "start", s: 10, c: "#455a64" }) : ""}`).join("")}
    <path d="M144,280 h14 l-4,16 h-6Z" fill="#78909c"/><rect x="146" y="282" width="10" height="5" fill="#37474f"/>${T(151, 40, "NaOH " + s.Cb + " M", { s: 12, c: "#1565c0" })}`;
  // flask
  g += `<path d="M138,320 v22 l-46,62 q-8,14 10,14 h98 q18,0 10,-14 l-46,-62 v-22Z" fill="#ffffffaa" stroke="#78909c" stroke-width="3"/><path d="M104,384 h94 l14,20 q4,10 -8,10 h-106 q-12,0 -8,-10Z" fill="${col}" stroke="none"/>
    ${T(151, 444, `HCl ${s.Va} mL · ${s.hideCa ? "? M" : s.Ca + " M"}`, { s: 12, c: "#c62828" })}`;
  // pH meter + readout
  g += `<g transform="translate(290,60)"><rect width="170" height="150" rx="14" fill="#263238"/><rect x="14" y="14" width="142" height="56" rx="8" fill="#a5d6a7"/>${T(85, 54, show ? p.toFixed(2) : "--.--", { s: 28, c: "#1b5e20" })}${T(85, 96, "pH meter", { s: 12, c: "#eceff1" })}
    ${T(85, 124, show ? (p < 6.9 ? "acidic" : p > 7.1 ? "alkaline" : "neutral") : "", { s: 14, c: "#fff59d" })}</g>
    <g transform="translate(290,230)"><rect width="170" height="160" rx="14" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${T(85, 26, "BASE ADDED", { s: 12, c: "#ad1457" })}${T(85, 66, fmt(s.Vb) + " mL", { s: 26, c: "#880e4f" })}
    ${T(85, 102, IND[s.ind], { s: 12, c: "#6d4c41" })}<rect x="45" y="114" width="80" height="26" rx="6" fill="${col}" stroke="#bdbdbd"/></g>`;
  // curve
  const X0 = 510, Y0 = 400, W = 320, H = 330; let d = "";
  for (let i = 0; i <= 200; i++) { const v = 50 * i / 200; if (v > s.Vb && !s.full) break; d += (i ? "L" : "M") + (X0 + W * v / 50).toFixed(1) + "," + (Y0 - H * pHof(s, v) / 14).toFixed(1); }
  g += `<rect x="485" y="30" width="360" height="410" rx="14" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${T(665, 54, "TITRATION CURVE", { s: 13, c: "#ad1457" })}
    <line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>
    ${[0, 7, 14].map(v => T(X0 - 6, Y0 - H * v / 14 + 4, "" + v, { a: "end", s: 11, c: "#607d8b" })).join("")}${[0, 25, 50].map(v => T(X0 + W * v / 50, Y0 + 18, v + " mL", { s: 11, c: "#607d8b" })).join("")}
    <line x1="${X0}" y1="${Y0 - H / 2}" x2="${X0 + W}" y2="${Y0 - H / 2}" stroke="#cfd8dc" stroke-dasharray="4 5"/>
    ${show ? `<path d="${d}" fill="none" stroke="#d81b60" stroke-width="3"/><circle cx="${X0 + W * s.Vb / 50}" cy="${Y0 - H * p / 14}" r="6" fill="#1565c0"/>` : T(665, 220, "press ▶ to add the base", { s: 13, c: "#b0bec5" })}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "Vb", type: "range", label: "NaOH added", min: 0, max: 50, step: 0.1, nudge: 0.5, unit: "mL", lock: lk("Vb") },
  { id: "ind", type: "choice", label: "Indicator", options: Object.keys(IND).map(v => ({ v, label: IND[v] })), wide: true, lock: lk("ind") },
  { id: "Cb", type: "choice", label: "NaOH concentration", options: [0.1, 0.2, 0.5].map(v => ({ v, label: v + " M" })), hide: () => lv < 3, lock: lk("Cb") },
  { id: "guess", type: "choice", label: "Acid concentration is…", options: [0.05, 0.1, 0.15, 0.2, 0.25].map(v => ({ v, label: v + " M" })), hide: s => !s.hideCa, lock: lk("guess") }]; };
const st = o => Object.assign({ Ca: 0.1, Va: 25, Cb: 0.1, Vb: 0, ind: "phenol" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${fmt(s.Vb)} mL added: pH ${pH(s).toFixed(2)}`;
const atEq = s => Math.abs(s.Vb - Veq(s)) <= 0.1;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🧪 Titration challenge", prompt: "Add NaOH from the burette, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Moles = concentration × volume. At the END POINT, moles of NaOH = moles of HCl, so V(base) = C(acid) × V(acid) ÷ C(base). Phenolphthalein turns pink just after it." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ti-sim", diff, uses, mk);
const C = {
  end: () => simQ(1, "25 mL of 0.1 M HCl. Add 0.1 M NaOH until it is <b>exactly neutralised</b> (end point).", st(), s => ok(atEq(s), "25.0 mL — moles of base = moles of acid, pH 7.", say(s) + "."), { Vb: 25 }, { lock: ["ind"], wrong: { Vb: 22 } }),
  acidic: () => simQ(1, "Add <b>at least 10 mL</b> of NaOH but keep the flask <b>acidic (pH below 3)</b>.", st(), s => ok(s.Vb >= 10 && pH(s) < 3, say(s) + " — still more acid than base.", s.Vb < 10 ? "Add at least 10 mL." : say(s) + "."), { Vb: 15 }, { lock: ["ind"], wrong: { Vb: 24.9 } }),
  basic: () => simQ(1, "Make the solution strongly <b>alkaline (pH above 12)</b>.", st(), s => ok(pH(s) > 12, say(s) + " — excess NaOH.", say(s) + "."), { Vb: 40 }, { lock: ["ind"], wrong: { Vb: 26 } }),
  pink: () => simQ(1, "Using <b>methyl orange</b>, make the flask turn <b>yellow</b> using as little NaOH as possible (25.0 mL or less).", st({ ind: "phenol" }), s => ok(s.ind === "methyl" && pH(s) > 4.4 && s.Vb <= 25, say(s) + " — methyl orange is yellow above pH 4.4.", s.ind !== "methyl" ? "Choose methyl orange." : say(s) + "."), { ind: "methyl", Vb: 25 }, { wrong: { ind: "methyl", Vb: 20 } }),
  double: () => simQ(2, "25 mL of <b>0.2 M</b> HCl with 0.1 M NaOH. Find the end point.", st({ Ca: 0.2 }), s => ok(atEq(s), "0.2 × 25 ÷ 0.1 = 50 mL.", say(s) + "."), { Vb: 50 }, { lock: ["ind"], wrong: { Vb: 25 } }),
  strongBase: () => simQ(2, "20 mL of 0.1 M HCl, but the NaOH is <b>0.2 M</b>. Find the end point.", st({ Va: 20, Cb: 0.2 }), s => ok(atEq(s), "0.1 × 20 ÷ 0.2 = 10 mL.", say(s) + "."), { Vb: 10 }, { lock: ["ind"], wrong: { Vb: 20 } }),
  half: () => simQ(2, "30 mL of 0.1 M HCl, 0.1 M NaOH. Add <b>exactly half</b> the base needed to neutralise it.", st({ Va: 30 }), s => ok(Math.abs(s.Vb - 15) <= 0.1, "End point 30 mL → half = 15 mL.", say(s) + "."), { Vb: 15 }, { lock: ["ind"], wrong: { Vb: 30 } }),
  ph2: () => simQ(2, "25 mL of 0.2 M HCl, 0.1 M NaOH. Raise the pH to exactly <b>2.00</b>.", st({ Ca: 0.2 }), s => ok(Math.abs(pH(s) - 2) <= 0.02, say(s) + ".", say(s) + "."), { Vb: 43.2 }, { lock: ["ind"], wrong: { Vb: 30 } }),
  unknown: () => simQ(3, "20 mL of HCl of <b>unknown</b> concentration. Titrate to the end point, then choose its concentration.", st({ Ca: 0.15, Va: 20, hideCa: true, Cb: 0.1 }), s => ok(atEq(s) && s.guess === 0.15, "30 mL × 0.1 M ÷ 20 mL = 0.15 M.", !atEq(s) ? "First find the end point exactly." : "Use C = 0.1 × V(base) ÷ 20."), { Vb: 30, guess: 0.15 }, { lock: ["Cb"], wrong: { Vb: 30, guess: 0.1 } }),
  unknown2: () => simQ(3, "25 mL of an <b>unknown</b> HCl. Titrate with 0.2 M NaOH and find its concentration.", st({ Ca: 0.2, Va: 25, hideCa: true, Cb: 0.2 }), s => ok(atEq(s) && s.guess === 0.2, "25 mL × 0.2 ÷ 25 = 0.2 M.", !atEq(s) ? "First find the end point." : "C = 0.2 × V(base) ÷ 25."), { Vb: 25, guess: 0.2 }, { lock: ["Cb"], wrong: { Vb: 25, guess: 0.25 } }),
  pickCb: () => simQ(3, "25 mL of 0.2 M HCl. Choose the NaOH concentration so the end point is <b>under 20 mL</b>, then reach it.", st({ Ca: 0.2, Cb: 0.1 }), s => ok(atEq(s) && Veq(s) < 20, `${s.Cb} M → end point ${fmt(Veq(s))} mL.`, Veq(s) >= 20 ? `With ${s.Cb} M the end point is ${fmt(Veq(s))} mL.` : "Now add exactly that volume."), { Cb: 0.5, Vb: 10 }, { wrong: { Cb: 0.2, Vb: 25 } }),
  excess: () => simQ(3, "25 mL of 0.1 M HCl with 0.5 M NaOH. Go past the end point to <b>pH 12.00</b> (±0.05).", st({ Cb: 0.5 }), s => ok(Math.abs(pH(s) - 12) <= 0.05, say(s) + ".", say(s) + "."), { Cb: 0.5, Vb: 5.6 }, { lock: ["Cb"], wrong: { Cb: 0.5, Vb: 7 } })
};
const D = {
  pick: diff => E.diaT("ti-pick", diff, 2, () => { const s = st({ full: true, reveal: true }), want = choice(["eq", "acid", "base"]), X0 = 120, W = 620, Y0 = 260, H = 220;
    let d = ""; for (let i = 0; i <= 200; i++) { const v = 50 * i / 200; d += (i ? "L" : "M") + (X0 + W * v / 50).toFixed(1) + "," + (Y0 - H * pHof(s, v) / 14).toFixed(1); }
    const P = { acid: 10, eq: 25, base: 42 };
    return { kind: "pick", title: "📈 Read the titration curve", prompt: { eq: "Click the <b>end point</b> (neutral, pH 7).", acid: "Click a point where the flask is still <b>acidic</b>.", base: "Click a point where there is <b>excess base</b>." }[want], answer: [want], names: { acid: "10 mL", eq: "25 mL", base: "42 mL" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fdf2f7"/><line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>${T(70, 150, "pH", { s: 13, c: "#607d8b" })}${T(430, 290, "volume of NaOH (mL)", { s: 12, c: "#607d8b" })}<path d="${d}" fill="none" stroke="#d81b60" stroke-width="4"/>${Object.entries(P).map(([k, v]) => { const x = X0 + W * v / 50, y = Y0 - H * pHof(s, v) / 14; return `<g class="pk" data-k="${k}"><circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="#880e4f" stroke-width="3"/><circle cx="${x}" cy="${y}" r="15" fill="none" ${E.ring(s2[k])}/></g>`; }).join("")}</svg>`,
      explain: "Before the end point the flask is acidic; at the end point the pH shoots through 7; after it, excess NaOH makes it alkaline.", summary: "Titration curve" }; }),
  num: diff => E.diaT("ti-num", diff, 2, () => { const c = choice([[25, 0.1, 20], [20, 0.2, 16], [10, 0.1, 25], [25, 0.15, 30]]);
    return { kind: "num", title: "🧮 Titration calculation", prompt: `<b>${c[0]} mL</b> of HCl was neutralised by <b>${c[2]} mL</b> of <b>${c[1]} M</b> NaOH.`, visual: render(st({ Vb: 25, reveal: true })),
      fields: [{ label: "Moles of NaOH", unit: "mmol", answer: c[1] * c[2] }, { label: "Concentration of HCl", unit: "M", answer: c[1] * c[2] / c[0], tol: 0.03 }], explain: `n = ${c[1]} × ${c[2]} = ${fmt(c[1] * c[2])} mmol; C = ${fmt(c[1] * c[2])} ÷ ${c[0]} = ${fmt(c[1] * c[2] / c[0])} M.`, summary: "Titration calculation" }; }),
  mcq: diff => E.diaT("ti-mcq", diff, 2, () => { const q = choice([
      { ask: "What are the products when HCl reacts with NaOH?", ok: "Sodium chloride and water", bad: ["Hydrogen and oxygen", "Sodium and chlorine", "Carbon dioxide and water"], ex: "Acid + alkali → salt + water (neutralisation)." },
      { ask: "Why do we add the base drop by drop near the end point?", ok: "The pH changes very quickly there, so we can stop exactly", bad: ["To make the reaction slower", "So the indicator doesn't burn", "To heat the flask"], ex: "Near the end point one drop can change the pH by several units." },
      { ask: "Phenolphthalein is colourless in acid. What colour is it in alkali?", ok: "Pink", bad: ["Blue", "Yellow", "Green"], ex: "It turns pink above about pH 8.2." }]);
    return { kind: "mcq", title: "📘 Neutralisation ideas", prompt: "Look at the titration.", visual: render(st({ Vb: 26, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Titration concepts" }; })
};
const LEVELS = {
  1: { intro: "Neutralise hydrochloric acid with sodium hydroxide from the burette. Watch the indicator!", pool: () => [S(1, 1, C.end), S(2, 1, C.acidic), S(2, 1, C.basic), S(3, 1, C.pink), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Different concentrations and volumes: calculate the end point before you add the base.", pool: () => [S(1, 1, C.double), S(2, 1, C.strongBase), S(2, 1, C.half), S(3, 1, C.ph2), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Use titration to find UNKNOWN concentrations and plan your experiment.", pool: () => [S(1, 1, C.unknown), S(2, 1, C.unknown2), S(3, 1, C.pickCb), S(3, 1, C.excess), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Add sodium hydroxide from the burette and press ▶ to watch the pH and the indicator.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Add",
  goals: () => [{ txt: "Keep it acidic", test: (s, m) => m.a }, { txt: "Reach the end point (pH 7)", test: (s, m) => m.n }, { txt: "Turn the indicator pink", test: (s, m) => m.p }],
  track: (s, m, ran) => { if (!ran) return; const p = pH(s); if (p < 6) m.a = 1; if (Math.abs(p - 7) < 0.5) m.n = 1; if (s.ind === "phenol" && p > 8.2) m.p = 1; },
  facts: () => "📘 <b>Neutralisation</b>: acid + alkali → salt + water. In a <b>titration</b> we add one solution exactly until the end point to find a concentration."
});
E.start({ labId: "titration", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧪", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧪", "💧", "🩷", "✨"],
  exploreDemo: () => [{ set: { Vb: 10 }, run: true }, { set: { Vb: 25 }, run: true }, { set: { Vb: 30 }, run: true }] });
})();
