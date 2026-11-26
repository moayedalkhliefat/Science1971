"use strict";
// ===== Models of the Hydrogen Atom — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const INF = 99;
const En = n => n >= INF ? 0 : -13.6 / (n * n);
const dE = s => r2(Math.abs(En(s.from) - En(s.to)));
const lam = s => dE(s) ? Math.round(1240 / dE(s) * 10) / 10 : 0;
const emits = s => s.to < s.from, absorbs = s => s.to > s.from;
const region = l => !l ? "—" : l < 380 ? "ultraviolet" : l <= 750 ? "visible" : "infrared";
const series = s => !emits(s) ? "" : s.to === 1 ? "Lyman series" : s.to === 2 ? "Balmer series" : s.to === 3 ? "Paschen series" : "";
function wcol(l) { if (l < 380 || l > 750) return null; const st = [[380, [120, 0, 160]], [440, [60, 60, 255]], [490, [0, 200, 220]], [530, [40, 200, 40]], [580, [240, 220, 0]], [620, [255, 120, 0]], [700, [220, 0, 0]], [750, [140, 0, 0]]]; for (let i = 1; i < st.length; i++) if (l <= st[i][0]) { const [a, ca] = st[i - 1], [b, cb] = st[i], t = (l - a) / (b - a); return `rgb(${ca.map((v, k) => Math.round(v + (cb[k] - v) * t)).join(",")})`; } }
const colName = l => l < 380 ? "UV (invisible)" : l > 750 ? "IR (invisible)" : l < 440 ? "violet" : l < 490 ? "blue" : l < 570 ? "green" : l < 590 ? "yellow" : l < 620 ? "orange" : "red";
const nLabel = n => n >= INF ? "∞ (free)" : "n = " + n;
function render(s) {
  const show = s.reveal, cx = 165, cy = 205, R = n => 18 + Math.min(n, 7) * 19, l = lam(s), col = wcol(l) || "#90a4ae";
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  for (let n = 1; n <= 6; n++) g += `<circle cx="${cx}" cy="${cy}" r="${R(n)}" fill="none" stroke="${n === s.from || n === s.to ? "#5c6bc0" : "#e0e0e0"}" stroke-width="${n === s.from || n === s.to ? 2.5 : 1.5}"/>${T(cx + R(n) * 0.7 + 4, cy - R(n) * 0.7 - 2, n, { s: 10, c: "#9e9e9e" })}`;
  g += `<circle cx="${cx}" cy="${cy}" r="9" fill="#e53935"/>${T(cx, cy + 4, "+", { s: 12, c: "#fff" })}${T(cx, 46, "Bohr model (not to scale)", { s: 12, c: "#546e7a" })}`;
  const ePos = n => n >= INF ? [cx + 150, cy - 140] : [cx + R(n) * Math.cos(-0.6), cy + R(n) * Math.sin(-0.6)];
  const [ex, ey] = ePos(show ? s.to : s.from);
  if (show && s.from !== s.to) { const [fx, fy] = ePos(s.from); g += `<path d="M${fx},${fy} L${ex},${ey}" stroke="#5c6bc0" stroke-width="2" stroke-dasharray="4 3"/>`; }
  g += `<circle cx="${ex}" cy="${ey}" r="8" fill="#1e88e5" stroke="#fff" stroke-width="2"/>`;
  if (show && s.from !== s.to) {
    const dir = emits(s) ? 1 : -1, x0 = emits(s) ? ex + 14 : ex + 120, y0 = ey + 70;
    let d = `M${x0},${y0}`; for (let i = 1; i <= 24; i++) d += ` L${x0 + dir * i * 4},${y0 + Math.sin(i * Math.PI / 2.5) * 7}`;
    g += `<path d="${d}" fill="none" stroke="${col}" stroke-width="3"/><path d="M${x0 + dir * 102},${y0} l${-dir * 12},-7 v14Z" fill="${col}"/>${T(x0 + dir * 50, y0 + 26, emits(s) ? "photon out" : "photon in", { s: 12, c: "#37474f" })}`;
  }
  // energy level diagram
  const ey2 = e => 90 + Math.sqrt(-e / 13.6) * 300;
  g += `${T(445, 46, "Energy levels (eV)", { s: 12, c: "#546e7a" })}<line x1="330" y1="90" x2="560" y2="90" stroke="#bdbdbd" stroke-dasharray="4 4"/>${T(566, 94, "0", { a: "start", s: 10, c: "#9e9e9e" })}${T(336, 84, "∞ (free)", { a: "start", s: 10, c: "#9e9e9e" })}`;
  for (let n = 1; n <= 6; n++) g += `<line x1="340" y1="${ey2(En(n))}" x2="540" y2="${ey2(En(n))}" stroke="${n === s.from || n === s.to ? "#3949ab" : "#9e9e9e"}" stroke-width="${n === s.from || n === s.to ? 3 : 1.5}"/>${T(546, ey2(En(n)) + 4, fmt(r2(En(n))), { a: "start", s: 10, c: "#546e7a" })}${n <= 4 ? T(334, ey2(En(n)) + 4, "n=" + n, { a: "end", s: 10, c: "#546e7a" }) : ""}`;
  if (show && s.from !== s.to) { const y1 = ey2(En(s.from)), y2 = ey2(En(s.to)), x = 440; g += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 + (y2 > y1 ? -10 : 10)}" stroke="${col}" stroke-width="4"/><path d="M${x},${y2} l-8,${y2 > y1 ? -14 : 14} h16Z" fill="${col}"/>`; }
  // spectrum strip
  g += `<defs><linearGradient id="spec" x1="0" x2="1"><stop offset="0" stop-color="#78009f"/><stop offset=".17" stop-color="#3c3cff"/><stop offset=".3" stop-color="#00c8dc"/><stop offset=".41" stop-color="#28c828"/><stop offset=".54" stop-color="#f0dc00"/><stop offset=".65" stop-color="#ff7800"/><stop offset=".86" stop-color="#dc0000"/><stop offset="1" stop-color="#8c0000"/></linearGradient></defs><rect x="40" y="386" width="270" height="18" fill="url(#spec)" opacity=".35"/>${T(40, 420, "380 nm", { a: "start", s: 10, c: "#78909c" })}${T(310, 420, "750 nm", { a: "end", s: 10, c: "#78909c" })}`;
  if (show && l >= 380 && l <= 750) g += `<rect x="${40 + (l - 380) / 370 * 270 - 2}" y="382" width="5" height="26" fill="${col}"/>`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 58, nLabel(s.from) + " → " + nLabel(s.to), { s: 15, c: "#37474f" })}
    ${show ? (s.from === s.to ? T(120, 120, "no jump — no photon", { s: 14, c: "#78909c" }) : T(120, 96, emits(s) ? "energy given out" : "energy taken in", { s: 13, c: emits(s) ? "#e65100" : "#1565c0" }) + T(120, 128, "ΔE = " + fmt(dE(s)) + " eV", { s: 22, c: "#37474f" }) + T(120, 166, "λ = 1240 ÷ ΔE", { s: 11, c: "#78909c" }) + T(120, 192, fmt(lam(s)) + " nm", { s: 20, c: wcol(l) ? col : "#546e7a" }) + T(120, 218, colName(l), { s: 14, c: "#37474f" }) + T(120, 242, series(s), { s: 12, c: "#6a1b9a" }) + (s.to >= INF ? T(120, 266, "the atom is ionised", { s: 12, c: "#c62828" }) : "")) : T(120, 160, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 330, "Eₙ = −13.6 ÷ n² eV", { s: 14, c: "#37474f" })}${T(120, 356, "down a level → emits light", { s: 10, c: "#90a4ae" })}${T(120, 372, "up a level → absorbs light", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const lv6 = [1, 2, 3, 4, 5, 6].map(v => ({ v, label: "n = " + v }));
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "from", type: "select", label: "Electron starts at", options: lv6, lock: lk("from") },
  { id: "to", type: "select", label: "Electron jumps to", options: lv6.concat(lv >= 2 ? [{ v: INF, label: "∞ (free — ionised)" }] : []), lock: lk("to") }]; };
const st = o => Object.assign({ from: 3, to: 1 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => s.from === s.to ? "No jump." : `${nLabel(s.from)} → ${nLabel(s.to)}: ${fmt(dE(s))} eV, ${fmt(lam(s))} nm (${colName(lam(s))}).`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⚛️ Electron-jump challenge", prompt: "Choose the jump, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Eₙ = −13.6 ÷ n² eV. Jumping down emits a photon with ΔE = difference in energy; jumping up absorbs one. λ (nm) = 1240 ÷ ΔE (eV). Down to n = 1 → UV (Lyman); to n = 2 → visible (Balmer); to n = 3 → infrared (Paschen)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ha-sim", diff, uses, mk);
const C = {
  red: () => simQ(1, "Make the hydrogen atom give out <b>red</b> light.", st({ from: 4, to: 1 }), s => ok(emits(s) && colName(lam(s)) === "red", "3 → 2 gives the red 656 nm line.", said(s)), { from: 3, to: 2 }, { wrong: { from: 4, to: 2 } }),
  uv: () => simQ(1, "Make a photon of <b>ultraviolet</b> light.", st({ from: 3, to: 2 }), s => ok(emits(s) && region(lam(s)) === "ultraviolet", "Any jump down to n = 1 (Lyman series) is UV.", said(s)), { from: 2, to: 1 }, { wrong: { from: 4, to: 2 } }),
  absorb: () => simQ(1, "Make the electron <b>absorb</b> energy.", st({ from: 3, to: 1 }), s => ok(absorbs(s), "Jumping up to a higher level takes in a photon.", emits(s) ? "Jumping down gives energy out." : "No jump."), { from: 1, to: 3 }, { wrong: { from: 3, to: 2 } }),
  blue: () => simQ(1, "Make the <b>blue-green</b> Balmer line (about 486 nm).", st({ from: 3, to: 2 }), s => ok(Math.abs(lam(s) - 486) < 2, "4 → 2: 2.55 eV, 486 nm.", said(s)), { from: 4, to: 2 }, { wrong: { from: 5, to: 2 } }),
  e102: () => simQ(2, "Emit a photon of exactly <b>10.2 eV</b>.", st({ from: 3, to: 1 }), s => ok(emits(s) && dE(s) === 10.2, "2 → 1: −3.4 − (−13.6) = 10.2 eV.", said(s)), { from: 2, to: 1 }, { wrong: { from: 3, to: 1 } }),
  e1209: () => simQ(2, "Emit a photon of <b>12.09 eV</b>.", st({ from: 2, to: 1 }), s => ok(emits(s) && dE(s) === 12.09, "3 → 1: −1.51 − (−13.6) = 12.09 eV.", said(s)), { from: 3, to: 1 }, { wrong: { from: 4, to: 1 } }),
  abs189: () => simQ(2, "Make the atom <b>absorb</b> a <b>1.89 eV</b> photon.", st({ from: 1, to: 2 }), s => ok(absorbs(s) && dE(s) === 1.89, "2 → 3 absorbs 1.89 eV (red light).", said(s)), { from: 2, to: 3 }, { wrong: { from: 3, to: 2 } }),
  ionise: () => simQ(2, "<b>Ionise</b> hydrogen from its <b>ground state</b>. How much energy does it take?", st({ from: 2, to: 4 }), s => ok(s.from === 1 && s.to >= INF, "n = 1 → ∞: 13.6 eV, the ionisation energy.", s.to < INF ? "The electron must leave the atom (∞)." : "Start from the ground state."), { from: 1, to: INF }, { wrong: { from: 2, to: INF } }),
  l486: () => simQ(3, "Emit a photon with λ = <b>486 nm</b>.", st({ from: 5, to: 3 }), s => ok(emits(s) && Math.abs(lam(s) - 486) < 2, "4 → 2: 1240 ÷ 2.55 = 486 nm.", said(s)), { from: 4, to: 2 }, { wrong: { from: 4, to: 3 } }),
  ir: () => simQ(3, "Make an <b>infrared</b> photon from the <b>Paschen</b> series.", st({ from: 3, to: 2 }), s => ok(emits(s) && s.to === 3, "Any jump down to n = 3 is infrared.", said(s)), { from: 5, to: 3 }, { wrong: { from: 5, to: 2 } }),
  shortBal: () => simQ(3, "Make the Balmer line with the <b>shortest</b> wavelength you can.", st({ from: 3, to: 2 }), s => ok(s.to === 2 && s.from === 6, "6 → 2: 410 nm (violet).", s.to !== 2 ? "Balmer lines end at n = 2." : `${fmt(lam(s))} nm — a higher start gives a shorter λ.`), { from: 6 }, { lock: ["to"], wrong: { from: 5 } }),
  l1875: () => simQ(3, "Emit an infrared photon with λ ≈ <b>1875 nm</b> (within 5 nm).", st({ from: 5, to: 3 }), s => ok(emits(s) && Math.abs(lam(s) - 1875) <= 5, "4 → 3: 0.66 eV → 1879 nm.", said(s)), { from: 4, to: 3 }, { wrong: { from: 6, to: 3 } })
};
const D = {
  pick: diff => E.diaT("ha-pick", diff, 2, () => {
    const pool = E.shuffle([[2, 1], [3, 2], [4, 2], [4, 3], [1, 3], [3, 1], [6, 2], [2, 4]]).slice(0, 4);
    const asks = [["emit most", "gives out the <b>most energy</b>"], ["absorb", "<b>absorbs</b> a photon"], ["visible", "gives out <b>visible</b> light"]];
    const want = diff === 1 ? choice(asks.slice(1)) : choice(asks);
    const val = p => { const s = st({ from: p[0], to: p[1] }); return want[0] === "absorb" ? absorbs(s) : want[0] === "visible" ? emits(s) && region(lam(s)) === "visible" : emits(s) ? dE(s) : -1; };
    let ans; if (want[0] === "emit most") { const m = Math.max(...pool.map(val)); ans = pool.map((p, i) => val(p) === m ? "t" + i : null).filter(Boolean); } else { if (!pool.some(val)) pool[0] = want[0] === "absorb" ? [1, 3] : [3, 2]; ans = pool.map((p, i) => val(p) ? "t" + i : null).filter(Boolean); }
    const ey2 = e => 40 + Math.sqrt(-e / 13.6) * 220;
    return { kind: "pick", many: want[0] !== "emit most", title: "👆 Pick the jump", prompt: `Click ${want[0] === "emit most" ? "the jump that" : "<b>every</b> jump that"} ${want[1]}.`, answer: ans, names: Object.fromEntries(pool.map((p, i) => ["t" + i, `n = ${p[0]} → ${p[1]}`])),
      visual: s2 => { let g = `<rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="10" width="780" height="280" rx="14" fill="#fff" stroke="#cfd8dc"/>`; for (let n = 1; n <= 6; n++) g += `<line x1="90" y1="${ey2(En(n))}" x2="800" y2="${ey2(En(n))}" stroke="#bdbdbd" stroke-width="1.5"/>${n <= 4 ? T(84, ey2(En(n)) + 4, "n=" + n, { a: "end", s: 11, c: "#546e7a" }) : ""}`;
        pool.forEach((p, i) => { const x = 190 + i * 170, y1 = ey2(En(p[0])), y2 = ey2(En(p[1])); g += `<g class="pk" data-k="t${i}"><rect x="${x - 36}" y="16" width="72" height="268" fill="transparent"/><line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 + (y2 > y1 ? -10 : 10)}" stroke="#3949ab" stroke-width="4"/><path d="M${x},${y2} l-8,${y2 > y1 ? -14 : 14} h16Z" fill="#3949ab"/>${T(x + 20, (y1 + y2) / 2, "ABCD"[i], { a: "start", s: 15, c: "#3949ab" })}<rect x="${x - 36}" y="16" width="72" height="268" rx="10" fill="none" ${E.ring(s2["t" + i])}/></g>`; });
        return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}</svg>`; },
      explain: "Down arrows emit, up arrows absorb. The longer the downward jump, the more energy. Jumps down to n = 2 are visible.", summary: "Energy-level jumps" };
  }),
  num: diff => E.diaT("ha-num", diff, 2, () => {
    if (diff === 1) { const n = choice([2, 3, 4, 5]);
      return { kind: "num", title: "🧮 Energy levels", prompt: `Eₙ = −13.6 ÷ n² eV. Find the energy of level <b>n = ${n}</b>.`, visual: render(st({ from: n, to: n })), fields: [{ label: "Eₙ", unit: "eV", answer: r2(En(n)), tol: 0.01 }], explain: `−13.6 ÷ ${n * n} = ${fmt(r2(En(n)))} eV.`, summary: "Bohr energy levels" }; }
    const p = choice([[3, 2], [4, 2], [2, 1], [4, 3], [5, 2]]), s = st({ from: p[0], to: p[1] });
    return { kind: "num", title: diff === 2 ? "🧮 Photon energy" : "🧮 Wavelength", prompt: `An electron jumps from <b>n = ${p[0]}</b> to <b>n = ${p[1]}</b>. Eₙ = −13.6 ÷ n² eV${diff === 3 ? "; λ (nm) = 1240 ÷ ΔE" : ""}.`, visual: render(st({ from: p[0], to: p[0] })),
      fields: diff === 2 ? [{ label: "ΔE", unit: "eV", answer: dE(s), tol: 0.02 }] : [{ label: "ΔE", unit: "eV", answer: dE(s), tol: 0.02 }, { label: "λ", unit: "nm", answer: lam(s), tol: 3 }], explain: `ΔE = ${fmt(r2(En(p[0])))} − (${fmt(r2(En(p[1])))}) = ${fmt(dE(s))} eV${diff === 3 ? `; λ = 1240 ÷ ${fmt(dE(s))} = ${fmt(lam(s))} nm` : ""}.`, summary: "Photon from a jump" };
  }),
  mcq: diff => E.diaT("ha-mcq", diff, 2, () => { const q = choice([
      { ask: "Which model first explained why hydrogen gives out only certain colours of light?", ok: "Bohr's model, with fixed energy levels", bad: ["Dalton's solid-sphere model", "Thomson's plum-pudding model", "Rutherford's nuclear model"], ex: "Fixed levels mean only fixed photon energies." },
      { ask: "What did Rutherford's model add that Thomson's did not have?", ok: "A tiny, dense, positive nucleus", bad: ["Electrons", "Energy levels", "Neutrons in shells"], ex: "The gold-foil experiment revealed the nucleus." },
      { ask: "Why does hydrogen give a line spectrum, not a rainbow?", ok: "Electrons can only jump between fixed energy levels", bad: ["Hydrogen is colourless", "Hydrogen only absorbs light", "The nucleus gives out light"], ex: "Each jump has one exact energy, so one exact colour." },
      { ask: "In the modern (quantum) model, electrons are best described as…", ok: "clouds of probability around the nucleus", bad: ["tiny planets on exact circles", "particles stuck in a positive pudding", "solid spheres"], ex: "We can only say where an electron is likely to be." }]);
    return { kind: "mcq", title: "📘 Atomic models", prompt: "Dalton → Thomson → Rutherford → Bohr → quantum.", visual: render(st({ from: 3, to: 2, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Models of the atom" }; })
};
const LEVELS = {
  1: { intro: "In Bohr's model the electron can only sit on certain levels. Jumping down gives out light; jumping up takes it in.", pool: () => [S(1, 1, C.absorb), S(2, 1, C.red), S(2, 1, C.uv), S(3, 1, C.blue), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Each level has an energy Eₙ = −13.6 ÷ n² eV. The photon carries the difference.", pool: () => [S(1, 1, C.e102), S(2, 1, C.e1209), S(2, 1, C.abs189), S(3, 1, C.ionise), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Turn energies into wavelengths (λ = 1240 ÷ ΔE) and sort the lines into series.", pool: () => [S(1, 1, C.ir), S(2, 1, C.l486), S(3, 1, C.shortBal), S(3, 1, C.l1875), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Move the electron between levels. Press ▶ to see the photon and where its line appears in the spectrum.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Jump",
  goals: () => [{ txt: "Make a visible line", test: (s, m) => m.v }, { txt: "Make an ultraviolet photon", test: (s, m) => m.u }, { txt: "Make the electron absorb energy", test: (s, m) => m.a }],
  track: (s, m, ran) => { if (!ran) return; if (emits(s) && region(lam(s)) === "visible") m.v = 1; if (emits(s) && region(lam(s)) === "ultraviolet") m.u = 1; if (absorbs(s)) m.a = 1; },
  facts: () => "📘 Each element has its own <b>line spectrum</b> — a fingerprint used to find what stars are made of."
});
E.start({ labId: "hatom", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚛️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚛️", "🌈", "✨", "💡"],
  exploreDemo: () => [{ set: { from: 3, to: 2 }, run: true }, { set: { from: 2, to: 1 }, run: true }, { set: { from: 1, to: 3 }, run: true }] });
})();
