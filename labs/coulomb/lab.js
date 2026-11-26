"use strict";
// ===== Coulomb's Law — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
// F = k q1 q2 / r²  with q in µC and r in cm → F = 90 × q1 × q2 ÷ r²  (newtons)
const Fs = s => r2(90 * s.q1 * s.q2 / (s.r * s.r));
const F = s => Math.abs(Fs(s));
const kind = s => !s.q1 || !s.q2 ? "none" : s.q1 * s.q2 > 0 ? "repel" : "attract";
const chg = (x, y, q) => { const R = 16 + Math.abs(q) * 2.4, c = q > 0 ? "#e53935" : q < 0 ? "#1e88e5" : "#bdbdbd"; return `<circle cx="${x}" cy="${y}" r="${R}" fill="${c}" stroke="#37474f" stroke-width="2"/>${T(x, y + 6, (q > 0 ? "+" : "") + q, { s: 16, c: "#fff" })}`; };
function render(s) {
  const show = s.reveal, y = 200, pxcm = 22, sep = Math.max(s.r * pxcm, 40 + (Math.abs(s.q1) + Math.abs(s.q2)) * 2.4), x1 = 300 - sep / 2, x2 = 300 + sep / 2, k = kind(s), f = F(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += `<rect x="60" y="300" width="480" height="26" fill="#fff8e1" stroke="#bcaaa4"/>`; for (let c = 0; c <= 21; c++) g += `<line x1="${300 - 10.5 * pxcm + c * pxcm}" y1="300" x2="${300 - 10.5 * pxcm + c * pxcm}" y2="${c % 5 ? 308 : 314}" stroke="#8d6e63"/>`;
  g += `<line x1="${x1}" y1="250" x2="${x2}" y2="250" stroke="#78909c" stroke-width="1.5" marker-start="url(#cl)" marker-end="url(#cl)"/>${T(300, 272, "r = " + s.r + " cm", { s: 13, c: "#546e7a" })}<defs><marker id="cl" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="#78909c"/></marker></defs>`;
  if (show && k !== "none") {
    const d = k === "repel" ? 1 : -1, col = k === "repel" ? "#c62828" : "#1565c0", R1 = 16 + Math.abs(s.q1) * 2.4, R2 = 16 + Math.abs(s.q2) * 2.4, room = d < 0 ? Math.max(6, ((x2 - x1) - R1 - R2) / 2 - 14) : 110, L = Math.min(room, 18 + Math.log10(1 + f) * 34);
    const a1 = x1 - d * (R1 + 4), a2 = x2 + d * (R2 + 4);
    g += `<line x1="${a1}" y1="${y}" x2="${a1 - d * L}" y2="${y}" stroke="${col}" stroke-width="5"/><path d="M${a1 - d * (L + 10)},${y} l${d * 13},-8 v16Z" fill="${col}"/>`;
    g += `<line x1="${a2}" y1="${y}" x2="${a2 + d * L}" y2="${y}" stroke="${col}" stroke-width="5"/><path d="M${a2 + d * (L + 10)},${y} l${-d * 13},-8 v16Z" fill="${col}"/>`;
    g += T(300, 120, fmt(f) + " N on each charge", { s: 16, c: col });
  }
  g += chg(x1, y, s.q1) + chg(x2, y, s.q2) + T(x1 - 10, y - 30 - Math.abs(s.q1) * 2.4, "q₁ = " + s.q1 + " µC", { s: 12, c: "#37474f" }) + T(x2 + 10, y - 30 - Math.abs(s.q2) * 2.4, "q₂ = " + s.q2 + " µC", { s: 12, c: "#37474f" });
  if (!show) g += T(300, 120, "press ▶ to measure the force", { s: 14, c: "#90a4ae" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${show ? T(120, 76, "force", { s: 12, c: "#78909c" }) + T(120, 108, fmt(f) + " N", { s: 26, c: "#e65100" }) + T(120, 140, k === "repel" ? "↔ they REPEL (like charges)" : k === "attract" ? "→← they ATTRACT (unlike charges)" : "no force (a charge is zero)", { s: 13, c: "#37474f" }) + T(120, 186, `90 × ${s.q1} × ${s.q2} ÷ ${s.r}²`, { s: 13, c: "#546e7a" }) : T(120, 160, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 312, "F = k q₁ q₂ ÷ r²", { s: 15, c: "#37474f" })}${T(120, 336, "with q in µC and r in cm:", { s: 10, c: "#90a4ae" })}${T(120, 354, "F = 90 × q₁ × q₂ ÷ r² (N)", { s: 12, c: "#546e7a" })}${T(120, 380, "double r → ¼ of the force", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "q1", type: "range", label: "Charge q₁", min: -10, max: 10, step: 1, nudge: 1, unit: "µC", lock: lk("q1") },
  { id: "q2", type: "range", label: "Charge q₂", min: -10, max: 10, step: 1, nudge: 1, unit: "µC", lock: lk("q2") },
  { id: "r", type: "range", label: "Distance", min: 1, max: 20, step: 1, nudge: 1, unit: "cm", lock: lk("r") }]; };
const st = o => Object.assign({ q1: 2, q2: 3, r: 6 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `F = ${fmt(F(s))} N, ${kind(s) === "none" ? "no force" : kind(s)}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⚡ Coulomb challenge", prompt: "Set the charges, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Like charges repel, unlike charges attract. F = 90 × q₁ × q₂ ÷ r² (q in µC, r in cm, F in N). Doubling the distance makes the force 4 times smaller." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("co-sim", diff, uses, mk);
const C = {
  attract: () => simQ(1, "Make the two charges <b>attract</b> each other.", st({ q1: 2, q2: 3 }), s => ok(kind(s) === "attract", "Unlike charges attract.", kind(s) === "repel" ? "Like charges repel." : "One charge is zero — no force."), { q2: -3 }, { lock: ["q1", "r"], wrong: { q2: 3 } }),
  repelNeg: () => simQ(1, "q₁ is <b>negative</b>. Make the charges <b>repel</b>.", st({ q1: -4, q2: 2 }), s => ok(kind(s) === "repel", "Two negative charges repel.", said(s)), { q2: -2 }, { lock: ["q1", "r"], wrong: { q2: 2 } }),
  zero: () => simQ(1, "Make the force between them <b>zero</b> without moving them.", st({ q1: 5, q2: -3 }), s => ok(F(s) === 0, "A neutral object (0 µC) feels no electric force.", said(s)), { q2: 0 }, { lock: ["q1", "r"], wrong: { q2: 1 } }),
  ten: () => simQ(1, "Two <b>+1 µC</b> charges: make the force exactly <b>10 N</b>.", st({ q1: 1, q2: 1, r: 10 }), s => ok(F(s) === 10, "3 cm: 90 × 1 × 1 ÷ 9 = 10 N.", said(s)), { r: 3 }, { lock: ["q1", "q2"], wrong: { r: 4 } }),
  quarter: () => simQ(2, "At 3 cm the force is 10 N. Make it <b>2.5 N</b> by changing <b>only the distance</b>.", st({ q1: 1, q2: 1, r: 3 }), s => ok(F(s) === 2.5, "Double the distance (6 cm) → ¼ of the force.", said(s)), { r: 6 }, { lock: ["q1", "q2"], wrong: { r: 9 } }),
  ninety: () => simQ(2, "Two <b>+1 µC</b> charges: make the force <b>90 N</b>.", st({ q1: 1, q2: 1, r: 5 }), s => ok(F(s) === 90, "1 cm apart: 90 × 1 × 1 ÷ 1 = 90 N.", said(s)), { r: 1 }, { lock: ["q1", "q2"], wrong: { r: 2 } }),
  triple: () => simQ(2, "At 3 cm, make the force <b>30 N</b> by changing <b>only q₂</b>.", st({ q1: 1, q2: 1, r: 3 }), s => ok(F(s) === 30, "Triple a charge → triple the force: q₂ = ±3 µC.", said(s)), { q2: 3 }, { lock: ["q1", "r"], wrong: { q2: 2 } }),
  same90: () => simQ(2, "+4 µC and +4 µC at 4 cm push with 90 N. Move them to <b>2 cm</b> and change <b>one charge</b> so the force is still <b>90 N</b>.", st({ q1: 4, q2: 4, r: 2 }), s => ok(F(s) === 90, "Half the distance → ×4, so one charge must be ¼: 1 µC.", said(s)), { q2: 1 }, { lock: ["q1", "r"], wrong: { q2: 2 } }),
  find4: () => simQ(3, "q₁ = <b>−2 µC</b>, 6 cm apart. Choose q₂ so they <b>attract</b> with <b>20 N</b>.", st({ q1: -2, q2: -1, r: 6 }), s => ok(kind(s) === "attract" && F(s) === 20, "+4 µC: 90 × 2 × 4 ÷ 36 = 20 N.", said(s)), { q2: 4 }, { lock: ["q1", "r"], wrong: { q2: -4 } }),
  find6: () => simQ(3, "+3 µC and +6 µC: find the distance where the force is <b>45 N</b>.", st({ q1: 3, q2: 6, r: 2 }), s => ok(F(s) === 45, "r² = 90 × 18 ÷ 45 = 36 → 6 cm.", said(s)), { r: 6 }, { lock: ["q1", "q2"], wrong: { r: 5 } }),
  biggest: () => simQ(3, "Make the <b>largest attractive</b> force possible.", st({ q1: 1, q2: 1, r: 10 }), s => ok(kind(s) === "attract" && F(s) === 9000, "+10 and −10 µC, 1 cm apart: 9000 N!", said(s)), { q1: 10, q2: -10, r: 1 }, { wrong: { q1: 10, q2: -10, r: 2 } }),
  p36: () => simQ(3, "Make two charges <b>repel</b> with exactly <b>36 N</b> at <b>5 cm</b>.", st({ q1: 1, q2: 1, r: 5 }), s => ok(kind(s) === "repel" && F(s) === 36, "q₁ × q₂ = 36 × 25 ÷ 90 = 10, e.g. +2 and +5 µC.", said(s)), { q1: 2, q2: 5 }, { lock: ["r"], wrong: { q1: 2, q2: -5 } })
};
const D = {
  pick: diff => E.diaT("co-pick", diff, 2, () => {
    const pool = E.shuffle([st({ q1: 2, q2: -3, r: 4 }), st({ q1: -1, q2: -5, r: 2 }), st({ q1: 4, q2: 4, r: 8 }), st({ q1: -2, q2: 6, r: 3 }), st({ q1: 3, q2: 3, r: 3 }), st({ q1: 5, q2: -1, r: 1 })]).slice(0, 4);
    if (diff === 1) {
      const want = choice(["attract", "repel"]); if (!pool.some(s => kind(s) === want)) pool[0] = want === "attract" ? st({ q1: 2, q2: -3, r: 4 }) : st({ q1: 3, q2: 3, r: 3 });
      return { kind: "pick", many: true, title: "👆 Attract or repel?", prompt: `Click <b>every</b> pair that <b>${want}s</b>.`, answer: pool.map((s, i) => kind(s) === want ? "p" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["p" + i, s.q1 + " and " + s.q2 + " µC"])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="p${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${chg(x + 55, 140, s.q1)}${chg(x + 141, 140, s.q2)}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["p" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Like signs repel; opposite signs attract.", summary: "Like and unlike charges" };
    }
    const vals = pool.map(F), want = choice(["most", "least"]), best = want === "most" ? Math.max(...vals) : Math.min(...vals);
    return { kind: "pick", many: vals.filter(v => v === best).length > 1, title: "👆 Strongest or weakest?", prompt: `Click the pair with the <b>${want === "most" ? "strongest" : "weakest"}</b> force.`, answer: pool.map((s, i) => F(s) === best ? "p" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["p" + i, `${s.q1}, ${s.q2} µC at ${s.r} cm`])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212, gap = 14 + s.r * 9; return `<g class="pk" data-k="p${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><g transform="translate(${x + 98},120) scale(.75) translate(${-(x + 98)},-120)">${chg(x + 98 - gap, 120, s.q1)}${chg(x + 98 + gap, 120, s.q2)}</g>${T(x + 98, 224, `${s.q1} and ${s.q2} µC`, { s: 14, c: "#37474f" })}${T(x + 98, 248, s.r + " cm apart", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["p" + i])}/></g>`; }).join("")}</svg>`,
      explain: "F = 90 q₁q₂ ÷ r²: " + pool.map(s => fmt(F(s)) + " N").join(", ") + ".", summary: "Comparing forces" };
  }),
  num: diff => E.diaT("co-num", diff, 2, () => {
    if (diff === 1) { const s = choice([st({ q1: 2, q2: 3, r: 3 }), st({ q1: 1, q2: 4, r: 6 }), st({ q1: -5, q2: 2, r: 10 }), st({ q1: 3, q2: 3, r: 9 })]);
      return { kind: "num", title: "🧮 Coulomb's law", prompt: `q₁ = <b>${s.q1} µC</b>, q₂ = <b>${s.q2} µC</b>, r = <b>${s.r} cm</b>. F = 90 × q₁ × q₂ ÷ r².`, visual: render(s), fields: [{ label: "Force (size)", unit: "N", answer: F(s) }], explain: `90 × ${Math.abs(s.q1 * s.q2)} ÷ ${s.r * s.r} = ${fmt(F(s))} N.`, summary: "Calculating force" }; }
    if (diff === 2) { const f = choice([[40, 2], [40, 3], [36, 0.5], [90, 2]]);
      return { kind: "num", title: "🧮 Changing the distance", prompt: `Two charges push with <b>${f[0]} N</b>. The distance is multiplied by <b>${f[1]}</b>.`, visual: render(st()), fields: [{ label: "New force", unit: "N", answer: r2(f[0] / (f[1] * f[1])) }], explain: `${f[0]} ÷ ${f[1]}² = ${fmt(r2(f[0] / (f[1] * f[1])))} N.`, summary: "Inverse square" }; }
    const c = choice([[2, 6, 20], [3, 3, 90], [1, 9, 10], [5, 10, 45]]);
    return { kind: "num", title: "🧮 Find the charge", prompt: `A <b>+${c[0]} µC</b> charge and another charge, <b>${c[1]} cm</b> apart, repel with <b>${c[2]} N</b>.`, visual: render(st({ q1: c[0], r: c[1] })), fields: [{ label: "Other charge", unit: "µC", answer: r2(c[2] * c[1] * c[1] / (90 * c[0])) }], explain: `q₂ = F r² ÷ (90 q₁) = ${c[2]} × ${c[1] * c[1]} ÷ ${90 * c[0]} = ${fmt(r2(c[2] * c[1] * c[1] / (90 * c[0])))} µC.`, summary: "Rearranging Coulomb's law" };
  }),
  mcq: diff => E.diaT("co-mcq", diff, 2, () => { const q = choice([
      { ask: "How does the electric force change if the distance is tripled?", ok: "It becomes 9 times smaller", bad: ["3 times smaller", "3 times bigger", "It stays the same"], ex: "F ∝ 1/r² → 1/3² = 1/9." },
      { ask: "Why does a rubbed balloon stick to a wall?", ok: "Its charge polarises the wall, and the nearby opposite charges attract", bad: ["The wall is magnetic", "Air pressure pushes it", "The balloon is sticky"], ex: "Induced charges in the wall are closer, so attraction wins." },
      { ask: "How are Coulomb's law and Newton's law of gravity alike?", ok: "Both forces get weaker with the square of the distance", bad: ["Both can repel", "Both depend on mass", "Both are always tiny"], ex: "Both are inverse-square laws." },
      { ask: "Two charges are both doubled (same distance). The force…", ok: "becomes 4 times bigger", bad: ["doubles", "stays the same", "halves"], ex: "F ∝ q₁ × q₂ → 2 × 2 = 4." }]);
    return { kind: "mcq", title: "📘 Electric force ideas", prompt: "Think about charge and distance.", visual: render(st({ q1: 3, q2: -2, r: 5, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Coulomb's law" }; })
};
const LEVELS = {
  1: { intro: "Like charges repel, unlike charges attract. The force depends on the charges and the distance.", pool: () => [S(1, 1, C.attract), S(2, 1, C.repelNeg), S(2, 1, C.zero), S(3, 1, C.ten), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "The force follows an inverse-square law: double the distance, a quarter of the force.", pool: () => [S(1, 1, C.ninety), S(2, 1, C.quarter), S(2, 1, C.triple), S(3, 1, C.same90), D.num(2), D.pick(2), D.mcq(3)] },
  3: { intro: "Use F = 90 q₁q₂ ÷ r² to design exact forces.", pool: () => [S(1, 1, C.find6), S(2, 1, C.find4), S(3, 1, C.p36), S(3, 1, C.biggest), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Change the two charges and the distance between them, then press ▶ to measure the force.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Measure",
  goals: () => [{ txt: "Make them attract", test: (s, m) => m.a }, { txt: "Make them repel", test: (s, m) => m.r }, { txt: "Make a force over 100 N", test: (s, m) => m.b }],
  track: (s, m, ran) => { if (!ran) return; if (kind(s) === "attract") m.a = 1; if (kind(s) === "repel") m.r = 1; if (F(s) > 100) m.b = 1; },
  facts: () => "📘 <b>Coulomb's law</b>: the electric force grows with the charges and falls with the square of the distance."
});
E.start({ labId: "coulomb", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚡", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚡", "➕", "➖", "✨"],
  exploreDemo: () => [{ set: { q1: 2, q2: -3, r: 6 }, run: true }, { set: { q1: 5, q2: 5, r: 2 }, run: true }] });
})();
