"use strict";
// ===== Atomic Interactions — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
// Lennard-Jones in "rm" form: U = ε[(rm/r)^12 − 2(rm/r)^6]; minimum −ε at r = rm
const GAS = { He: { name: "Helium", rm: 290, eps: 0.9, bp: -269, c: "#80deea" }, Ne: { name: "Neon", rm: 310, eps: 3.1, bp: -246, c: "#ef9a9a" }, Ar: { name: "Argon", rm: 380, eps: 10.3, bp: -186, c: "#ce93d8" }, Kr: { name: "Krypton", rm: 410, eps: 14.1, bp: -153, c: "#a5d6a7" } };
const U = (g, r) => { const x = GAS[g].rm / r, x6 = Math.pow(x, 6); return GAS[g].eps * (x6 * x6 - 2 * x6); };
const F = (g, r) => { const x = GAS[g].rm / r, x6 = Math.pow(x, 6); return 12 * GAS[g].eps / r * (x6 * x6 - x6) * 160.2; }; // pN, + = repel
const Ur = s => r2(U(s.gas, s.r)), Fr = s => r2(F(s.gas, s.r));
const kind = s => Math.abs(Fr(s)) < 0.5 ? "balanced" : Fr(s) > 0 ? "repel" : "attract";
const GRID = Array.from({ length: 61 }, (_, i) => 200 + i * 10);
const bestAttract = g => GRID.reduce((b, r) => F(g, r) < F(g, b) ? r : b, 200);
const motion = s => Math.abs(s.r - GAS[s.gas].rm) < 1e-9 ? "still" : U(s.gas, s.r) < 0 ? "vibrates" : "flies apart";
function turning(s) { // outer/inner turning points for a release from rest at r
  const Ev = U(s.gas, s.r), rm = GAS[s.gas].rm; if (Ev >= 0) return null;
  const solve = (lo, hi) => { for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if ((U(s.gas, m) - Ev) * (U(s.gas, lo) - Ev) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; };
  return s.r < rm ? [s.r, solve(rm, 5000)] : [solve(150, rm), s.r];
}
const px = r => 60 + (r - 200) / 600 * 500, py = u => 300 - Math.max(-17, Math.min(17, u)) * 6.5;
function render(s) {
  const show = s.reveal, G = GAS[s.gas], R = G.rm * 0.11, k = kind(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  // atoms
  const ax = 120, bx = ax + (s.r - 0) * 0.42;
  g += `<defs><radialGradient id="ia" cx=".35" cy=".35"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="${G.c}"/></radialGradient></defs>`;
  g += `<circle cx="${ax}" cy="95" r="${R}" fill="url(#ia)" stroke="#546e7a" stroke-width="2"/><circle cx="${Math.min(540, bx)}" cy="95" r="${R}" fill="url(#ia)" stroke="#546e7a" stroke-width="2"/>${T(ax, 100, s.gas, { s: 15, c: "#37474f" })}${T(Math.min(540, bx), 100, s.gas, { s: 15, c: "#37474f" })}`;
  g += `<line x1="${ax}" y1="${95 + R + 12}" x2="${Math.min(540, bx)}" y2="${95 + R + 12}" stroke="#78909c" stroke-width="1.5" stroke-dasharray="4 3"/>${T((ax + Math.min(540, bx)) / 2, 95 + R + 28, s.r + " pm", { s: 12, c: "#546e7a" })}`;
  if (show && k !== "balanced") { const d = k === "repel" ? 1 : -1, L = Math.min(70, 14 + Math.abs(Fr(s)) * 0.5), x0 = Math.min(540, bx) + d * (R + 6); g += `<line x1="${x0}" y1="95" x2="${x0 + d * L}" y2="95" stroke="${k === "repel" ? "#c62828" : "#1565c0"}" stroke-width="5"/><path d="M${x0 + d * (L + 10)},95 l${-d * 13},-8 v16Z" fill="${k === "repel" ? "#c62828" : "#1565c0"}"/>`; }
  // graph
  g += `<rect x="50" y="168" width="520" height="252" fill="#fafafa" stroke="#eceff1"/><line x1="60" y1="${py(0)}" x2="560" y2="${py(0)}" stroke="#90a4ae" stroke-width="1.5"/>${T(66, 182, "potential energy (meV)", { a: "start", s: 11, c: "#546e7a" })}${T(556, 414, "distance (pm)", { a: "end", s: 11, c: "#546e7a" })}`;
  [200, 300, 400, 500, 600, 700, 800].forEach(r => g += `<line x1="${px(r)}" y1="${py(0) - 3}" x2="${px(r)}" y2="${py(0) + 3}" stroke="#90a4ae"/>${T(px(r), py(0) + 16, r, { s: 10, c: "#90a4ae" })}`);
  [-15, -10, -5, 5, 10, 15].forEach(u => g += `<line x1="56" y1="${py(u)}" x2="560" y2="${py(u)}" stroke="#f0f0f0"/>${T(54, py(u) + 4, u, { a: "end", s: 10, c: "#90a4ae" })}`);
  let d = ""; for (let r = 220; r <= 800; r += 2) { const u = U(s.gas, r); if (u > 17) continue; d += (d ? " L" : "M") + px(r) + "," + py(u); }
  g += `<path d="${d}" fill="none" stroke="#5e35b1" stroke-width="3"/>`;
  if (show) {
    const u = Ur(s);
    if (s.mode === "release") { const tp = turning(s); if (tp) g += `<line x1="${px(Math.max(200, tp[0]))}" y1="${py(u)}" x2="${px(Math.min(800, tp[1]))}" y2="${py(u)}" stroke="#ef6c00" stroke-width="3" stroke-dasharray="6 4"/>`; else g += `<path d="M${px(s.r)},${py(u)} H556" stroke="#ef6c00" stroke-width="3" stroke-dasharray="6 4"/><path d="M560,${py(u)} l-10,-6 v12Z" fill="#ef6c00"/>`; }
    g += `<circle cx="${px(s.r)}" cy="${py(u)}" r="7" fill="#ff7043" stroke="#fff" stroke-width="2"/>`;
  }
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 58, G.name + " pair", { s: 15, c: "#37474f" })}${T(120, 80, `boils at ${G.bp} °C`, { s: 11, c: "#78909c" })}
    ${show ? T(120, 116, "potential energy", { s: 12, c: "#78909c" }) + T(120, 142, fmt(Ur(s)) + " meV", { s: 20, c: "#5e35b1" }) + T(120, 178, "force on atom", { s: 12, c: "#78909c" }) + T(120, 204, k === "balanced" ? "0 — balanced" : fmt(Math.abs(Fr(s))) + " pN " + (k === "repel" ? "repulsive" : "attractive"), { s: 15, c: k === "repel" ? "#c62828" : k === "attract" ? "#1565c0" : "#2e7d32" })
      + (s.mode === "release" ? T(120, 246, "released from rest:", { s: 12, c: "#78909c" }) + T(120, 272, motion(s) === "vibrates" ? "the atoms vibrate" : motion(s) === "still" ? "the atoms stay still" : "the atoms fly apart", { s: 15, c: "#ef6c00" }) + (turning(s) && motion(s) === "vibrates" ? T(120, 294, `between ${Math.round(turning(s)[0])} and ${turning(s)[1] > 800 ? ">800" : Math.round(turning(s)[1])} pm`, { s: 12, c: "#546e7a" }) : "") : "") : T(120, 190, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 340, "well depth ε = " + G.eps + " meV", { s: 12, c: "#546e7a" })}${T(120, 360, "deeper well → atoms stick more", { s: 10, c: "#90a4ae" })}${T(120, 376, "→ higher boiling point", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Mode", options: [{ v: "hold", label: "Hold the atom" }, { v: "release", label: "Release it" }] }] : []),
  { id: "gas", type: "choice", label: "Atoms", options: Object.keys(GAS).map(v => ({ v, label: GAS[v].name })), lock: lk("gas") },
  { id: "r", type: "range", label: "Distance between nuclei", min: 200, max: 800, step: 10, nudge: 10, unit: "pm", lock: lk("r") }]; };
const st = o => Object.assign({ mode: "hold", gas: "Ar", r: 500 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `${GAS[s.gas].name} at ${s.r} pm: ${fmt(Ur(s))} meV, ${kind(s) === "balanced" ? "no net force" : kind(s) === "repel" ? "they repel" : "they attract"}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "release" ? "🎯 Release challenge" : "⚛️ Interaction challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Too close → the electron clouds repel. Further apart → weak attraction. At the bottom of the energy well (r = rₘ) the forces balance. Released from rest, the atoms vibrate if their energy is below zero and fly apart if it is above zero." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ai-sim", diff, uses, mk);
const C = {
  eqAr: () => simQ(1, "Place the <b>argon</b> atoms where they <b>neither attract nor repel</b>.", st({ r: 500 }), s => ok(kind(s) === "balanced", "380 pm — the bottom of the energy well.", said(s)), { r: 380 }, { lock: ["gas"], wrong: { r: 390 } }),
  repelNe: () => simQ(1, "Push the <b>neon</b> atoms close enough that they <b>repel</b>.", st({ gas: "Ne", r: 500 }), s => ok(kind(s) === "repel", "Closer than 310 pm, the electron clouds push apart.", said(s)), { r: 280 }, { lock: ["gas"], wrong: { r: 330 } }),
  strong: () => simQ(1, "Find the distance where the <b>argon</b> atoms <b>attract most strongly</b>.", st({ r: 600 }), s => ok(s.r === bestAttract("Ar"), `${bestAttract("Ar")} pm — just outside the energy minimum.`, `${fmt(Math.abs(Fr(s)))} pN ${kind(s)}.`), { r: bestAttract("Ar") }, { lock: ["gas"], wrong: { r: bestAttract("Ar") + 30 } }),
  pick310: () => simQ(1, "Choose the gas whose atoms balance at <b>310 pm</b>, and place them there.", st({ gas: "He", r: 400 }), s => ok(s.gas === "Ne" && kind(s) === "balanced", "Neon: rₘ = 310 pm.", said(s)), { gas: "Ne", r: 310 }, { wrong: { gas: "He", r: 310 } }),
  u103: () => simQ(2, "Make the potential energy exactly <b>−10.3 meV</b>.", st({ r: 600 }), s => ok(Ur(s) === -10.3, "Argon at 380 pm: the bottom of its well.", `${fmt(Ur(s))} meV.`), { r: 380 }, { lock: ["gas"], wrong: { r: 400 } }),
  deep: () => simQ(2, "Choose the gas with the <b>deepest</b> energy well and put its atoms at the bottom.", st({ gas: "He", r: 290 }), s => ok(s.gas === "Kr" && kind(s) === "balanced", "Krypton: −14.1 meV at 410 pm.", s.gas !== "Kr" ? `${GAS[s.gas].name}'s well is only ${GAS[s.gas].eps} meV deep.` : "Move to the bottom of the well."), { gas: "Kr", r: 410 }, { wrong: { gas: "Ar", r: 380 } }),
  edge: () => simQ(2, "For <b>argon</b>, find the <b>closest</b> distance where the energy is still <b>negative</b>.", st({ r: 500 }), s => ok(s.r === 340, "340 pm: −1.0 meV. At 330 pm it is already positive.", `${fmt(Ur(s))} meV.`), { r: 340 }, { lock: ["gas"], wrong: { r: 330 } }),
  weak: () => simQ(2, "Choose the gas whose atoms stick together <b>most weakly</b>, at the bottom of its well.", st({ gas: "Kr", r: 500 }), s => ok(s.gas === "He" && kind(s) === "balanced", "Helium: only 0.9 meV — that is why it boils at −269 °C.", s.gas !== "He" ? "Another gas has a shallower well." : "Move to the bottom of the well."), { gas: "He", r: 290 }, { wrong: { gas: "Ne", r: 310 } }),
  vib: () => simQ(3, "Release the <b>argon</b> atom so the pair <b>vibrates</b> but stays together.", st({ mode: "release", r: 300 }), s => ok(motion(s) === "vibrates", "Energy below zero → trapped in the well → vibration.", `The atoms ${motion(s) === "still" ? "stay still" : "fly apart"}.`), { r: 450 }, { lock: ["gas"], wrong: { r: 320 } }),
  fly: () => simQ(3, "Release the <b>argon</b> atom from rest so the atoms <b>fly apart</b>.", st({ mode: "release", r: 450 }), s => ok(motion(s) === "flies apart", "Starting with energy above zero, they escape the well.", `The atoms ${motion(s) === "still" ? "stay still" : "vibrate"}.`), { r: 320 }, { lock: ["gas"], wrong: { r: 340 } }),
  still: () => simQ(3, "Release the <b>krypton</b> atom so the pair <b>stays perfectly still</b>.", st({ mode: "release", gas: "Kr", r: 500 }), s => ok(motion(s) === "still", "At rₘ the forces balance — no motion.", `The atoms ${motion(s)}.`), { r: 410 }, { lock: ["gas"], wrong: { r: 420 } }),
  barely: () => simQ(3, "Release from rest so the pair is <b>only just bound</b>: energy below zero but within <b>0.05 meV</b> of zero.", st({ mode: "release", r: 400 }), s => { const u = U(s.gas, s.r); return ok(u < 0 && u > -0.05, `${u.toFixed(3)} meV — a huge, slow vibration.`, `${u.toFixed(3)} meV.`); }, { gas: "He", r: 800 }, { wrong: { gas: "Ar", r: 600 } })
};
const D = {
  pick: diff => E.diaT("ai-pick", diff, 2, () => {
    if (diff === 1) {
      const g0 = choice(["Ar", "Kr"]), pts = [GAS[g0].rm - 40, GAS[g0].rm, bestAttract(g0), 700], lab = ["rep", "eq", "max", "far"], want = choice([["rep", "the atoms <b>repel</b>"], ["eq", "the force is <b>zero</b>"], ["max", "the <b>attraction is strongest</b>"]]);
      return { kind: "pick", title: "👆 Read the energy curve", prompt: `${GAS[g0].name} pair. Click the point where ${want[1]}.`, answer: [want[0]], names: { rep: pts[0] + " pm", eq: pts[1] + " pm", max: pts[2] + " pm", far: "700 pm" },
        visual: s2 => { const sx = r => 80 + (r - 250) * 1.25, sy = u => 120 - Math.max(-17, Math.min(17, u)) * 8; let d = ""; for (let r = 270; r <= 800; r += 2) { const u = U(g0, r); if (u > 14) continue; d += (d ? " L" : "M") + sx(r) + "," + sy(u); }
          return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="10" width="780" height="280" rx="14" fill="#fff" stroke="#cfd8dc"/><line x1="70" y1="${sy(0)}" x2="800" y2="${sy(0)}" stroke="#90a4ae" stroke-width="1.5"/>${T(796, sy(0) - 8, "distance →", { a: "end", s: 12, c: "#546e7a" })}${T(80, 28, "energy", { a: "start", s: 12, c: "#546e7a" })}<path d="${d}" fill="none" stroke="#5e35b1" stroke-width="3"/>${pts.map((r, i) => `<g class="pk" data-k="${lab[i]}"><circle cx="${sx(r)}" cy="${sy(U(g0, r))}" r="20" fill="transparent"/><circle cx="${sx(r)}" cy="${sy(U(g0, r))}" r="8" fill="#ff7043" stroke="#fff" stroke-width="2"/>${T(sx(r), sy(U(g0, r)) + (i ? 30 : -16), "ABCD"[i], { s: 15, c: "#37474f" })}<circle cx="${sx(r)}" cy="${sy(U(g0, r))}" r="17" fill="none" ${E.ring(s2[lab[i]])}/></g>`).join("")}</svg>`; },
        explain: "Left of the minimum the curve slopes down to the right → repulsion. At the minimum the force is zero. The steepest uphill slope to the right of the minimum is the strongest attraction.", summary: "Energy curve" };
    }
    const keys = E.shuffle(Object.keys(GAS)), want = choice(["high", "low"]), target = keys.reduce((b, k) => want === "high" ? (GAS[k].eps > GAS[b].eps ? k : b) : (GAS[k].eps < GAS[b].eps ? k : b), keys[0]);
    return { kind: "pick", title: "👆 Boiling points", prompt: `The wells below show how strongly each pair of atoms sticks together. Click the gas with the <b>${want === "high" ? "highest" : "lowest"}</b> boiling point.`, answer: [target], names: Object.fromEntries(keys.map(k => [k, GAS[k].name])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${keys.map((k, i) => { const x = 15 + i * 212, sx = r => x + 20 + (r - 250) * 0.3, sy = u => 110 - Math.max(-16, Math.min(12, u)) * 9; let d = ""; for (let r = 260; r <= 760; r += 4) { const u = U(k, r); if (u > 10) continue; d += (d ? " L" : "M") + sx(r) + "," + sy(u); } return `<g class="pk" data-k="${k}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><line x1="${x + 12}" y1="${sy(0)}" x2="${x + 184}" y2="${sy(0)}" stroke="#cfd8dc"/><path d="${d}" fill="none" stroke="#5e35b1" stroke-width="3"/>${T(x + 98, 268, "gas " + "ABCD"[i], { s: 15, c: "#37474f" })}${T(x + 98, 248, "well depth " + GAS[k].eps + " meV", { s: 12, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2[k])}/></g>`; }).join("")}</svg>`,
      explain: "A deeper well means stronger attraction between atoms, so more energy (a higher temperature) is needed to pull them apart into a gas.", summary: "Well depth and boiling point" };
  }),
  num: diff => E.diaT("ai-num", diff, 2, () => {
    if (diff === 1) { const g0 = choice(Object.keys(GAS));
      return { kind: "num", title: "🧮 Breaking the pair", prompt: `A ${GAS[g0].name.toLowerCase()} pair sits at rest at the bottom of its well (depth <b>${GAS[g0].eps} meV</b>). How much energy is needed to pull the atoms completely apart?`, visual: render(st({ gas: g0, r: GAS[g0].rm, reveal: true })), fields: [{ label: "Energy needed", unit: "meV", answer: GAS[g0].eps }], explain: `From −${GAS[g0].eps} meV up to 0 → ${GAS[g0].eps} meV.`, summary: "Well depth" }; }
    if (diff === 2) { const g0 = choice(Object.keys(GAS)), r = choice([1.1, 1.2, 1.5, 2]);
      return { kind: "num", title: "🧮 Energy at a distance", prompt: `U = ε[(rₘ/r)¹² − 2(rₘ/r)⁶]. ${GAS[g0].name}: ε = ${GAS[g0].eps} meV, rₘ = ${GAS[g0].rm} pm. Find U at <b>r = ${r} × rₘ</b> (${r2(r * GAS[g0].rm)} pm).`, visual: render(st({ gas: g0, r: Math.round(r * GAS[g0].rm / 10) * 10 })), fields: [{ label: "U", unit: "meV", answer: r2(U(g0, r * GAS[g0].rm)), tol: 0.05 }], explain: `(1/${r})¹² − 2(1/${r})⁶ = ${fmt(r2(U(g0, r * GAS[g0].rm) / GAS[g0].eps * 1000) / 1000)} → × ${GAS[g0].eps} = ${fmt(r2(U(g0, r * GAS[g0].rm)))} meV.`, summary: "Lennard-Jones" }; }
    const sig = choice([300, 340, 360, 270]);
    return { kind: "num", title: "🧮 Size and spacing", prompt: `For a Lennard-Jones pair, the energy is 0 at r = σ and lowest at rₘ = 1.12 × σ. If <b>σ = ${sig} pm</b>:`, visual: render(st({ gas: "Ar", r: 380 })), fields: [{ label: "rₘ", unit: "pm", answer: r2(1.12 * sig), tol: 1 }], explain: `1.12 × ${sig} = ${fmt(r2(1.12 * sig))} pm.`, summary: "σ and rₘ" };
  }),
  mcq: diff => E.diaT("ai-mcq", diff, 2, () => { const q = choice([
      { ask: "What causes the strong repulsion when two atoms are pushed very close?", ok: "Their electron clouds overlap and repel", bad: ["Gravity", "The nuclei attract", "Hydrogen bonds"], ex: "Overlapping electron clouds push the atoms apart." },
      { ask: "What causes the weak attraction between noble-gas atoms?", ok: "Temporary dipoles in the electron clouds (London dispersion forces)", bad: ["Ionic bonds", "Shared electron pairs", "Magnetism"], ex: "Fluctuating electron clouds make temporary dipoles that attract." },
      { ask: "Why does krypton boil at a higher temperature than helium?", ok: "Krypton atoms have more electrons, so they attract each other more strongly", bad: ["Krypton atoms are smaller", "Helium is ionic", "Krypton has no electrons"], ex: "Bigger electron clouds → stronger dispersion forces → deeper well." },
      { ask: "At the bottom of the energy well, the force between the atoms is…", ok: "zero — attraction and repulsion balance", bad: ["strongest", "always repulsive", "infinite"], ex: "Force = −slope of the energy curve; the slope is zero at the minimum." }]);
    return { kind: "mcq", title: "📘 Interaction ideas", prompt: "Think about the energy curve.", visual: render(st({ r: 420, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Intermolecular forces" }; })
};
const LEVELS = {
  1: { intro: "Atoms attract when far apart and repel when pushed too close. In between, the forces balance.", pool: () => [S(1, 1, C.eqAr), S(2, 1, C.repelNe), S(2, 1, C.pick310), S(3, 1, C.strong), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "The potential-energy curve has a well. Its depth shows how strongly the atoms stick together.", pool: () => [S(1, 1, C.u103), S(2, 1, C.weak), S(2, 1, C.deep), S(3, 1, C.edge), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Release one atom from rest: will the pair vibrate, stay still, or fly apart?", pool: () => [S(1, 1, C.still), S(2, 1, C.vib), S(3, 1, C.fly), S(3, 1, C.barely), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Choose the atoms and drag them closer or further apart. Press ▶ to see the force and the energy.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Measure",
  goals: () => [{ txt: "Make the atoms repel", test: (s, m) => m.r }, { txt: "Find where the forces balance", test: (s, m) => m.b }, { txt: "Release the atoms so they vibrate", test: (s, m) => m.v }],
  track: (s, m, ran) => { if (!ran) return; if (kind(s) === "repel") m.r = 1; if (kind(s) === "balanced") m.b = 1; if (s.mode === "release" && motion(s) === "vibrates") m.v = 1; },
  facts: () => "📘 Even noble-gas atoms attract each other weakly. The <b>energy well</b> explains why gases condense when cooled."
});
E.start({ labId: "interact", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚛️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚛️", "✨", "🔗", "💫"],
  exploreDemo: () => [{ set: { mode: "hold", gas: "Ar", r: 330 }, run: true }, { set: { r: 380 }, run: true }, { set: { mode: "release", r: 450 }, run: true }] });
})();
