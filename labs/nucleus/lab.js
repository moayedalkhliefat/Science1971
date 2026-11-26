"use strict";
// ===== Build a Nucleus & Radioactive Decay — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SYM = ["n", "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th", "Pa", "U"];
const NAME = { 1: "hydrogen", 2: "helium", 3: "lithium", 4: "beryllium", 5: "boron", 6: "carbon", 7: "nitrogen", 8: "oxygen", 9: "fluorine", 10: "neon", 11: "sodium", 12: "magnesium", 13: "aluminium", 14: "silicon", 15: "phosphorus", 16: "sulfur", 17: "chlorine", 18: "argon", 19: "potassium", 20: "calcium" };
const STABLE = { 1: [0, 1], 2: [1, 2], 3: [3, 4], 4: [5], 5: [5, 6], 6: [6, 7], 7: [7, 8], 8: [8, 9, 10], 9: [10], 10: [10, 11, 12], 11: [12], 12: [12, 13, 14], 13: [14], 14: [14, 15, 16], 15: [16], 16: [16, 17, 18, 20], 17: [18, 20], 18: [18, 20, 22], 19: [20, 22], 20: [20, 22, 23, 24, 26, 28] };
const stable = (z, n) => z >= 1 && (STABLE[z] || []).includes(n);
const fate = (z, n) => { if (!z) return "not a nucleus"; if (stable(z, n)) return "stable"; const L = STABLE[z]; return n > Math.max(...L) ? "too many neutrons (β⁻ decay)" : n < Math.min(...L) ? "too few neutrons (β⁺ decay)" : "unstable"; };
const label = (z, n) => z ? `${SYM[z]}-${z + n}` : "—";
const PARENT = { C14: [6, 8], Ra226: [88, 138], Na22: [11, 11], Co60: [27, 33], U238: [92, 146], Tc99: [43, 56] };
const PNAME = { C14: "Carbon-14", Ra226: "Radium-226", Na22: "Sodium-22", Co60: "Cobalt-60", U238: "Uranium-238", Tc99: "Technetium-99m (excited)" };
const DEC = { alpha: { name: "α (alpha)", dz: -2, dn: -2 }, betaM: { name: "β⁻ (beta-minus)", dz: 1, dn: -1 }, betaP: { name: "β⁺ (beta-plus)", dz: -1, dn: 1 }, gamma: { name: "γ (gamma)", dz: 0, dn: 0 } };
const daughter = s => { const [z, n] = PARENT[s.par], d = DEC[s.dec]; return [z + d.dz, n + d.dn]; };
const left = s => Math.round(s.n0 / Math.pow(2, s.t / s.half) * 10) / 10;
function ball(cx, cy, list) { let g = ""; list.forEach((p, i) => { const a = i * 2.39996, r = 7.5 * Math.sqrt(i + 0.6); g += `<circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="9" fill="${p ? "#e53935" : "#90a4ae"}" stroke="#37474f" stroke-width="1"/>`; }); return g; }
const mix = (z, n) => { const out = []; let a = 0, b = 0; while (a < z || b < n) { if (a < z && (a * (n || 1) <= b * (z || 1) || b >= n)) { out.push(1); a++; } else { out.push(0); b++; } } return out; };
function render(s) {
  const show = s.reveal;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`, rows = "";
  if (s.mode === "build") {
    g += `<g transform="translate(170,200) scale(1.45) translate(-170,-200)">${ball(170, 200, mix(s.z, s.n))}</g>` + `<circle cx="70" cy="380" r="8" fill="#e53935"/>${T(84, 384, "proton", { a: "start", s: 11 })}<circle cx="160" cy="380" r="8" fill="#90a4ae"/>${T(174, 384, "neutron", { a: "start", s: 11 })}`;
    // stability chart N vs Z
    const ox = 340, oy = 380, k = 10;
    g += `<rect x="${ox - 10}" y="${oy - 300}" width="240" height="320" fill="#fafafa" stroke="#eceff1"/><line x1="${ox}" y1="${oy}" x2="${ox + 220}" y2="${oy}" stroke="#90a4ae"/><line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - 290}" stroke="#90a4ae"/>${T(ox + 220, oy + 16, "protons Z", { a: "end", s: 10, c: "#546e7a" })}${T(ox + 4, oy - 282, "neutrons N", { a: "start", s: 10, c: "#546e7a" })}<line x1="${ox}" y1="${oy}" x2="${ox + 210}" y2="${oy - 210}" stroke="#cfd8dc" stroke-dasharray="4 3"/>${T(ox + 196, oy - 214, "N = Z", { s: 9, c: "#90a4ae" })}`;
    Object.keys(STABLE).forEach(z => STABLE[z].forEach(n => g += `<rect x="${ox + z * k - 4}" y="${oy - n * k - 4}" width="8" height="8" fill="#43a047" opacity=".7"/>`));
    g += `<circle cx="${ox + s.z * k}" cy="${oy - s.n * k}" r="7" fill="none" stroke="#ff7043" stroke-width="3"/>${T(ox + 215, oy - 24, "green = stable nuclei", { a: "end", s: 10, c: "#2e7d32" })}`;
    rows = `${T(120, 64, s.z + " protons · " + s.n + " neutrons", { s: 13, c: "#37474f" })}${show ? T(120, 104, "element", { s: 12, c: "#78909c" }) + T(120, 132, s.z ? (NAME[s.z] || SYM[s.z]) : "none", { s: 20, c: "#e65100" }) + T(120, 170, "isotope " + label(s.z, s.n), { s: 16, c: "#37474f" }) + T(120, 194, "mass number A = " + (s.z + s.n), { s: 13, c: "#546e7a" }) + T(120, 232, fate(s.z, s.n), { s: 13, c: stable(s.z, s.n) ? "#2e7d32" : "#c62828" }) : T(120, 170, "?", { s: 26, c: "#90a4ae" })}${T(120, 330, "protons decide the element", { s: 11, c: "#546e7a" })}${T(120, 350, "neutrons decide the isotope", { s: 11, c: "#546e7a" })}`;
  } else if (s.mode === "decay") {
    const [z, n] = PARENT[s.par], [dz, dn] = daughter(s);
    g += `<circle cx="140" cy="200" r="64" fill="#ffcdd2" stroke="#c62828" stroke-width="2"/>${T(140, 196, label(z, n), { s: 17, c: "#b71c1c" })}${T(140, 218, `${z} p · ${n} n`, { s: 11, c: "#546e7a" })}${T(140, 290, "parent", { s: 12, c: "#546e7a" })}`;
    g += `<line x1="214" y1="200" x2="350" y2="200" stroke="#78909c" stroke-width="4"/><path d="M362,200 l-14,-8 v16Z" fill="#78909c"/>`;
    if (show) {
      const em = s.dec === "alpha" ? `<circle cx="290" cy="120" r="10" fill="#e53935"/><circle cx="306" cy="120" r="10" fill="#90a4ae"/><circle cx="290" cy="136" r="10" fill="#90a4ae"/><circle cx="306" cy="136" r="10" fill="#e53935"/>${T(298, 166, "α = helium nucleus", { s: 11, c: "#37474f" })}` : s.dec === "gamma" ? `<path d="M260,128 q8,-12 16,0 t16,0 t16,0 t16,0" fill="none" stroke="#7b1fa2" stroke-width="3"/>${T(290, 160, "γ ray (energy)", { s: 11, c: "#37474f" })}` : `<circle cx="296" cy="128" r="10" fill="${s.dec === "betaM" ? "#1e88e5" : "#fb8c00"}"/>${T(296, 132, s.dec === "betaM" ? "e⁻" : "e⁺", { s: 10, c: "#fff" })}${T(296, 160, s.dec === "betaM" ? "electron" : "positron", { s: 11, c: "#37474f" })}`;
      g += em + `<circle cx="450" cy="200" r="64" fill="#c8e6c9" stroke="#2e7d32" stroke-width="2"/>${T(450, 196, label(dz, dn), { s: 17, c: "#1b5e20" })}${T(450, 218, `${dz} p · ${dn} n`, { s: 11, c: "#546e7a" })}${T(450, 290, "daughter", { s: 12, c: "#546e7a" })}`;
    } else g += T(450, 205, "?", { s: 30, c: "#90a4ae" });
    g += T(300, 360, s.dec === "alpha" ? "loses 2 protons + 2 neutrons" : s.dec === "betaM" ? "a neutron turns into a proton" : s.dec === "betaP" ? "a proton turns into a neutron" : "only energy is given out", { s: 13, c: "#6d4c41" });
    rows = `${T(120, 64, PNAME[s.par], { s: 13, c: "#37474f" })}${T(120, 86, DEC[s.dec].name + " decay", { s: 13, c: "#6a1b9a" })}${show ? T(120, 128, "becomes", { s: 12, c: "#78909c" }) + T(120, 158, label(dz, dn), { s: 24, c: "#e65100" }) + T(120, 186, `Z ${z} → ${dz} · A ${z + n} → ${dz + dn}`, { s: 12, c: "#546e7a" }) : T(120, 160, "?", { s: 26, c: "#90a4ae" })}${T(120, 300, "α: Z − 2, A − 4", { s: 12, c: "#546e7a" })}${T(120, 320, "β⁻: Z + 1, A same", { s: 12, c: "#546e7a" })}${T(120, 340, "β⁺: Z − 1, A same", { s: 12, c: "#546e7a" })}${T(120, 360, "γ: no change in Z or A", { s: 12, c: "#546e7a" })}`;
  } else {
    const L = show ? left(s) : s.n0, frac = L / s.n0, dots = 100, live = Math.round(frac * dots);
    for (let i = 0; i < dots; i++) { const x = 50 + (i % 10) * 22, y = 70 + Math.floor(i / 10) * 22, alive = ((i * 37) % 100) < live; g += `<circle cx="${x}" cy="${y}" r="8" fill="${alive ? "#ffca28" : "#cfd8dc"}" stroke="#90a4ae"/>`; }
    g += T(150, 300, "each dot = " + (s.n0 / 100) + " atoms", { s: 11, c: "#78909c" }) + `<circle cx="70" cy="330" r="7" fill="#ffca28"/>${T(84, 334, "not decayed", { a: "start", s: 11 })}<circle cx="170" cy="330" r="7" fill="#cfd8dc"/>${T(184, 334, "decayed", { a: "start", s: 11 })}`;
    const gx = t => 320 + t * 6, gy = v => 380 - v / s.n0 * 280;
    g += `<line x1="320" y1="380" x2="565" y2="380" stroke="#90a4ae"/><line x1="320" y1="380" x2="320" y2="90" stroke="#90a4ae"/>${T(565, 396, "time (s)", { a: "end", s: 10, c: "#546e7a" })}${T(326, 98, "atoms left", { a: "start", s: 10, c: "#546e7a" })}`;
    [0, 10, 20, 30, 40].forEach(t => g += T(gx(t), 394, t, { s: 9, c: "#90a4ae" }));
    let d = ""; for (let t = 0; t <= 40; t += 0.5) d += (t ? " L" : "M") + gx(t) + "," + gy(s.n0 / Math.pow(2, t / s.half)); g += `<path d="${d}" fill="none" stroke="#fb8c00" stroke-width="3"/>`;
    for (let k = 1; k * s.half <= 40; k++) g += `<line x1="${gx(k * s.half)}" y1="380" x2="${gx(k * s.half)}" y2="${gy(s.n0 / Math.pow(2, k))}" stroke="#ffe0b2" stroke-dasharray="3 3"/>`;
    if (show) g += `<circle cx="${gx(s.t)}" cy="${gy(L)}" r="7" fill="#e53935" stroke="#fff" stroke-width="2"/>`;
    rows = `${T(120, 64, "start: " + s.n0 + " atoms", { s: 13, c: "#37474f" })}${T(120, 86, "half-life: " + s.half + " s", { s: 13, c: "#37474f" })}${T(120, 108, "time: " + s.t + " s", { s: 13, c: "#37474f" })}${show ? T(120, 148, "atoms left", { s: 12, c: "#78909c" }) + T(120, 178, fmt(L), { s: 26, c: "#e65100" }) + T(120, 206, fmt(Math.round(s.t / s.half * 100) / 100) + " half-lives", { s: 13, c: "#546e7a" }) : T(120, 170, "?", { s: 26, c: "#90a4ae" })}${T(120, 320, "every half-life, half of the", { s: 11, c: "#546e7a" })}${T(120, 338, "remaining atoms decay", { s: 11, c: "#546e7a" })}${T(120, 362, "left = start ÷ 2^(t ÷ half-life)", { s: 11, c: "#546e7a" })}`;
  }
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${rows}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null, M = m => s => s.mode !== m; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Experiment", options: [{ v: "build", label: "Build a nucleus" }, { v: "decay", label: "Decay" }, { v: "half", label: "Half-life" }] }] : []),
  { id: "z", type: "range", label: "Protons", min: 0, max: 20, step: 1, nudge: 1, unit: "", hide: M("build"), lock: lk("z") },
  { id: "n", type: "range", label: "Neutrons", min: 0, max: 30, step: 1, nudge: 1, unit: "", hide: M("build"), lock: lk("n") },
  { id: "par", type: "select", label: "Radioactive nucleus", options: Object.keys(PARENT).map(v => ({ v, label: PNAME[v] })), hide: M("decay"), lock: lk("par") },
  { id: "dec", type: "choice", label: "Type of decay", options: Object.keys(DEC).map(v => ({ v, label: DEC[v].name })), hide: M("decay"), lock: lk("dec") },
  { id: "n0", type: "choice", label: "Starting atoms", options: [800, 1600, 3200].map(v => ({ v, label: String(v) })), hide: M("half"), lock: lk("n0") },
  { id: "half", type: "choice", label: "Half-life", options: [2, 5, 10].map(v => ({ v, label: v + " s" })), hide: M("half"), lock: lk("half") },
  { id: "t", type: "range", label: "Time", min: 0, max: 40, step: 1, nudge: 1, unit: "s", hide: M("half"), lock: lk("t") }]; };
const st = o => Object.assign({ mode: "build", z: 3, n: 3, par: "C14", dec: "alpha", n0: 1600, half: 5, t: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const saidB = s => `${label(s.z, s.n)}: ${fate(s.z, s.n)}.`, saidD = s => `${PNAME[s.par]} → ${label(...daughter(s))}.`, saidH = s => `${fmt(left(s))} atoms left after ${s.t} s.`;
const TT = { build: "⚛️ Build challenge", decay: "☢️ Decay challenge", half: "⏳ Half-life challenge" };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: TT[s0.mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Protons decide the element; mass number = protons + neutrons. α: lose 2p + 2n. β⁻: a neutron becomes a proton (Z + 1). β⁺: a proton becomes a neutron (Z − 1). γ: energy only. After each half-life, half of the atoms are left." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("nu-sim", diff, uses, mk);
const C = {
  c12: () => simQ(1, "Build a <b>carbon-12</b> nucleus.", st({ z: 3, n: 3 }), s => ok(s.z === 6 && s.n === 6, "6 protons + 6 neutrons.", saidB(s)), { z: 6, n: 6 }, { wrong: { z: 6, n: 7 } }),
  c13: () => simQ(1, "Build a <b>stable</b> isotope of carbon that is <b>not</b> carbon-12.", st({ z: 6, n: 6 }), s => ok(s.z === 6 && s.n !== 6 && stable(6, s.n), "Carbon-13: 6 p + 7 n.", s.z !== 6 ? "It must stay carbon (6 protons)." : saidB(s)), { n: 7 }, { lock: ["z"], wrong: { n: 8 } }),
  he4: () => simQ(1, "Build a <b>stable</b> nucleus with mass number <b>4</b>.", st({ z: 1, n: 1 }), s => ok(s.z + s.n === 4 && stable(s.z, s.n), "Helium-4: 2 p + 2 n (an α particle).", saidB(s)), { z: 2, n: 2 }, { wrong: { z: 1, n: 3 } }),
  oUn: () => simQ(1, "Build an <b>unstable</b> isotope of <b>oxygen</b>.", st({ z: 8, n: 8 }), s => ok(s.z === 8 && !stable(8, s.n), `${label(8, s.n)} — ${fate(8, s.n)}.`, s.z !== 8 ? "Oxygen has 8 protons." : "That one is stable."), { n: 12 }, { lock: ["z"], wrong: { n: 9 } }),
  c14: () => simQ(2, "Carbon-14 has too many neutrons. Choose the decay that turns it into <b>nitrogen-14</b>.", st({ mode: "decay", par: "C14", dec: "alpha" }), s => ok(s.dec === "betaM", "β⁻: a neutron becomes a proton → N-14.", saidD(s)), { dec: "betaM" }, { lock: ["par"], wrong: { dec: "betaP" } }),
  ra: () => simQ(2, "Make <b>radium-226</b> decay into <b>radon-222</b>.", st({ mode: "decay", par: "Ra226", dec: "gamma" }), s => ok(s.dec === "alpha", "α: lose 2 p + 2 n → Rn-222.", saidD(s)), { dec: "alpha" }, { lock: ["par"], wrong: { dec: "betaM" } }),
  na22: () => simQ(2, "Sodium-22 has too few neutrons. Choose the decay that makes <b>neon-22</b>.", st({ mode: "decay", par: "Na22", dec: "betaM" }), s => ok(s.dec === "betaP", "β⁺: a proton becomes a neutron → Ne-22.", saidD(s)), { dec: "betaP" }, { lock: ["par"], wrong: { dec: "betaM" } }),
  gam: () => simQ(2, "Choose a nucleus and a decay where the nucleus <b>stays the same element and mass</b> (only energy is given out).", st({ mode: "decay", par: "C14", dec: "alpha" }), s => ok(s.dec === "gamma", "γ decay: Tc-99m gives out a γ ray and stays Tc-99.", saidD(s)), { par: "Tc99", dec: "gamma" }, { wrong: { par: "Tc99", dec: "betaM" } }),
  t200: () => simQ(3, "1600 atoms, half-life 5 s. When are only <b>200</b> left?", st({ mode: "half", t: 0 }), s => ok(left(s) === 200, "15 s: 1600 → 800 → 400 → 200 (3 half-lives).", saidH(s)), { t: 15 }, { lock: ["n0", "half"], wrong: { t: 10 } }),
  h100: () => simQ(3, "Start with 1600 atoms. Choose the half-life so exactly <b>100</b> are left after <b>20 s</b>.", st({ mode: "half", t: 20, half: 2 }), s => ok(left(s) === 100, "5 s: 20 s is 4 half-lives → 1600 ÷ 16 = 100.", saidH(s)), { half: 5 }, { lock: ["n0", "t"], wrong: { half: 10 } }),
  quarter: () => simQ(3, "Half-life 10 s. Leave exactly <b>a quarter</b> of the sample.", st({ mode: "half", half: 10, t: 5 }), s => ok(left(s) === s.n0 / 4, "20 s = 2 half-lives → ¼ left.", saidH(s)), { t: 20 }, { lock: ["half"], wrong: { t: 25 } }),
  c50: () => simQ(3, "Make exactly <b>50</b> atoms remain at <b>10 s</b>.", st({ mode: "half", n0: 1600, half: 5, t: 10 }), s => ok(left(s) === 50, "1600 atoms with a 2 s half-life: 10 s = 5 half-lives → 1600 ÷ 32 = 50.", saidH(s)), { n0: 1600, half: 2 }, { lock: ["t"], wrong: { n0: 800, half: 2 } })
};
const D = {
  pick: diff => E.diaT("nu-pick", diff, 2, () => {
    if (diff === 1) {
      const pool = E.shuffle([[6, 6], [6, 8], [8, 8], [2, 2], [3, 5], [11, 12], [7, 6], [1, 2]]).slice(0, 4), want = choice(["stable", "unstable"]), t = p => want === "stable" ? stable(p[0], p[1]) : !stable(p[0], p[1]);
      if (!pool.some(t)) pool[0] = want === "stable" ? [6, 6] : [6, 8];
      return { kind: "pick", many: true, title: "👆 Stable or not?", prompt: `Click <b>every ${want}</b> nucleus.`, answer: pool.map((p, i) => t(p) ? "k" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((p, i) => ["k" + i, label(p[0], p[1])])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((p, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><g transform="translate(${x + 98},120) scale(.8) translate(${-(x + 98)},-120)">${ball(x + 98, 120, mix(p[0], p[1]))}</g>${T(x + 98, 226, label(p[0], p[1]), { s: 17, c: "#37474f" })}${T(x + 98, 252, p[0] + " p · " + p[1] + " n", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Light stable nuclei have about as many neutrons as protons; too many or too few makes them radioactive.", summary: "Nuclear stability" };
    }
    const par = choice(Object.keys(PARENT).filter(k => k !== "Tc99")), z0 = PARENT[par][0], n0 = PARENT[par][1], opts = E.shuffle(["alpha", "betaM", "betaP", "gamma"]), want = choice(["alpha", "betaM", "betaP"]);
    const [dz, dn] = [z0 + DEC[want].dz, n0 + DEC[want].dn];
    return { kind: "pick", title: "👆 Which decay?", prompt: `<b>${PNAME[par]}</b> (${z0} p, ${n0} n) decays into <b>${label(dz, dn)}</b> (${dz} p, ${dn} n). Click the decay.`, answer: [want], names: Object.fromEntries(opts.map(o => [o, DEC[o].name])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${opts.map((o, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="${o}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(x + 98, 130, { alpha: "α", betaM: "β⁻", betaP: "β⁺", gamma: "γ" }[o], { s: 56, c: "#6a1b9a" })}${T(x + 98, 200, DEC[o].name, { s: 14, c: "#37474f" })}${T(x + 98, 226, `Z ${DEC[o].dz >= 0 ? "+" : ""}${DEC[o].dz}, N ${DEC[o].dn >= 0 ? "+" : ""}${DEC[o].dn}`, { s: 12, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2[o])}/></g>`; }).join("")}</svg>`,
      explain: `Z changed by ${dz - z0} and N by ${dn - n0} → ${DEC[want].name}.`, summary: "Identifying decay" };
  }),
  num: diff => E.diaT("nu-num", diff, 2, () => {
    if (diff === 1) { const p = choice([[6, 8], [17, 20], [92, 146], [11, 12]]);
      return { kind: "num", title: "🧮 Protons and neutrons", prompt: `The nucleus <b>${SYM[p[0]]}-${p[0] + p[1]}</b> has <b>${p[0]}</b> protons.`, visual: render(st({ z: Math.min(20, p[0]), n: Math.min(30, p[1]) })), fields: [{ label: "Neutrons", unit: "", answer: p[1] }], explain: `${p[0] + p[1]} − ${p[0]} = ${p[1]} neutrons.`, summary: "Mass number" }; }
    if (diff === 2) { const c = choice([["U238", "alpha"], ["Co60", "betaM"], ["Ra226", "alpha"], ["Na22", "betaP"]]), s = st({ mode: "decay", par: c[0], dec: c[1] }), [dz, dn] = daughter(s);
      return { kind: "num", title: "🧮 After the decay", prompt: `<b>${PNAME[c[0]]}</b> (Z = ${PARENT[c[0]][0]}, A = ${PARENT[c[0]][0] + PARENT[c[0]][1]}) undergoes <b>${DEC[c[1]].name}</b> decay.`, visual: render(Object.assign({}, s, { reveal: false })), fields: [{ label: "New Z", unit: "", answer: dz }, { label: "New A", unit: "", answer: dz + dn }], explain: `→ ${label(dz, dn)}.`, summary: "Decay equations" }; }
    const c = choice([[3200, 5, 20], [800, 2, 6], [1600, 10, 30], [5730, 5730, 11460]]);
    return { kind: "num", title: "🧮 Half-life", prompt: c[0] === 5730 ? "Carbon-14 has a half-life of <b>5730 years</b>. What fraction (as a decimal) of the C-14 is left after <b>11 460 years</b>?" : `<b>${c[0]}</b> atoms, half-life <b>${c[1]} s</b>. How many are left after <b>${c[2]} s</b>?`, visual: render(st({ mode: "half", n0: c[0] === 5730 ? 1600 : c[0], half: c[1] === 5730 ? 5 : c[1], t: c[2] === 11460 ? 10 : c[2], reveal: false })), fields: [{ label: c[0] === 5730 ? "Fraction left" : "Atoms left", unit: "", answer: c[0] === 5730 ? 0.25 : c[0] / Math.pow(2, c[2] / c[1]) }], explain: c[0] === 5730 ? "2 half-lives → ¼ = 0.25." : `${c[2] / c[1]} half-lives → ${c[0]} ÷ ${Math.pow(2, c[2] / c[1])} = ${c[0] / Math.pow(2, c[2] / c[1])}.`, summary: "Half-life" };
  }),
  mcq: diff => E.diaT("nu-mcq", diff, 2, () => { const q = choice([
      { ask: "What decides which element an atom is?", ok: "The number of protons", bad: ["The number of neutrons", "The mass number", "The number of electrons only"], ex: "Z (protons) is the atomic number." },
      { ask: "Which radiation is stopped by a sheet of paper?", ok: "Alpha", bad: ["Beta", "Gamma", "None of them"], ex: "α particles are big and highly ionising, so they stop quickly." },
      { ask: "In β⁻ decay, what happens inside the nucleus?", ok: "A neutron turns into a proton and an electron is emitted", bad: ["A proton turns into a neutron", "Two protons leave", "Only energy leaves"], ex: "Z goes up by 1; A stays the same." },
      { ask: "Isotopes of the same element have…", ok: "the same number of protons but different numbers of neutrons", bad: ["different numbers of protons", "the same mass number", "no neutrons"], ex: "e.g. C-12, C-13 and C-14." }]);
    return { kind: "mcq", title: "📘 Nuclear ideas", prompt: "Think about protons, neutrons and decay.", visual: render(st({ z: 6, n: 8, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Nuclear physics" }; })
};
const LEVELS = {
  1: { intro: "A nucleus is made of protons and neutrons. Protons decide the element; the right mix of neutrons makes it stable.", pool: () => [S(1, 1, C.c12), S(2, 1, C.he4), S(2, 1, C.c13), S(3, 1, C.oUn), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Unstable nuclei decay: α, β⁻, β⁺ or γ — each changes the nucleus in its own way.", pool: () => [S(1, 1, C.ra), S(2, 1, C.c14), S(2, 1, C.na22), S(3, 1, C.gam), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Decay is random, but after each half-life half of the remaining atoms have decayed.", pool: () => [S(1, 1, C.quarter), S(2, 1, C.t200), S(3, 1, C.h100), S(3, 1, C.c50), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Build a nucleus, make one decay, or watch a sample over time. Press ▶ to see what happens.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Go",
  goals: () => [{ txt: "Build a stable nucleus", test: (s, m) => m.s }, { txt: "Watch an alpha decay", test: (s, m) => m.a }, { txt: "Let a sample decay for one half-life", test: (s, m) => m.h }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "build" && stable(s.z, s.n)) m.s = 1; if (s.mode === "decay" && s.dec === "alpha") m.a = 1; if (s.mode === "half" && s.t >= s.half) m.h = 1; },
  facts: () => "📘 <b>Radioactive decay</b> lets us date fossils (carbon-14), treat cancer and power nuclear reactors."
});
E.start({ labId: "nucleus", total: 7, plan: { sim: 4, dia: 3 }, emoji: "☢️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚛️", "☢️", "✨", "🔬"],
  exploreDemo: () => [{ set: { mode: "build", z: 6, n: 6 }, run: true }, { set: { mode: "decay", par: "Ra226", dec: "alpha" }, run: true }, { set: { mode: "half", t: 5 }, run: true }] });
})();
