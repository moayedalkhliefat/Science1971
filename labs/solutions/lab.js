"use strict";
// ===== Sugar & Salt Solutions — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SOLUB = 360; // g of salt per litre of water
const SUBS = { nacl: { n: "Salt (NaCl)", ions: 2, ionic: true, parts: ["Na⁺", "Cl⁻"] }, cacl2: { n: "Calcium chloride (CaCl₂)", ions: 3, ionic: true, parts: ["Ca²⁺", "Cl⁻", "Cl⁻"] },
  sugar: { n: "Sugar (C₁₂H₂₂O₁₁)", ions: 0, ionic: false }, ethanol: { n: "Ethanol (C₂H₅OH)", ions: 0, ionic: false } };
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// level 1 & 2 model (grams of salt / sugar in V litres)
const dissolved = s => Math.min(s.salt, SOLUB * s.V);
const leftover = s => Math.max(0, s.salt - SOLUB * s.V);
const glow1 = s => s.tester === false ? 0 : Math.min(1, dissolved(s) / s.V / 40); // full glow at 40 g/L
// level 3 model (moles in 1 L)
const ionConc = s => Math.round(s.mol * SUBS[s.sub].ions * 1000) / 1000;
const glow3 = s => Math.min(1, ionConc(s) / 1.2);
function render(s) {
  const show = s.reveal || s.showVals, V = s.mode === 3 ? 1 : s.V, bx = 120, by = 110, bw = 320, bh = 280, lh = Math.min(1, V / 1) * (bh - 20);
  const R = rnd(21); let parts = "";
  if (s.mode === 3) { const d = SUBS[s.sub], n = Math.round(s.mol * 40);
    for (let i = 0; i < n; i++) { const x = bx + 20 + R() * (bw - 40), y = by + bh - 10 - R() * (lh - 20);
      if (d.ionic) d.parts.forEach((p, j) => { const xx = x + (j ? (R() - 0.5) * 60 : 0), yy = y + (j ? (R() - 0.5) * 50 : 0); parts += `<circle cx="${xx}" cy="${yy}" r="${p.startsWith("Cl") ? 8 : 6}" fill="${p.startsWith("Cl") ? "#43a047" : p.startsWith("Ca") ? "#fb8c00" : "#7e57c2"}"/>`; });
      else parts += s.sub === "sugar" ? `<polygon points="${[0, 1, 2, 3, 4, 5].map(k => `${x + 9 * Math.cos(k * Math.PI / 3)},${y + 9 * Math.sin(k * Math.PI / 3)}`).join(" ")}" fill="#fff" stroke="#bcaaa4" stroke-width="2"/>` : `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="#e1f5fe" stroke="#4fc3f7" stroke-width="2"/>`; } }
  else { const nd = Math.min(140, Math.round(dissolved(s) / 2)); for (let i = 0; i < nd; i++) { const x = bx + 14 + R() * (bw - 28), y = by + bh - 10 - R() * (lh - 20); parts += `<circle cx="${x}" cy="${y}" r="4" fill="#7e57c2"/><circle cx="${x + 9}" cy="${y + 4}" r="5" fill="#43a047"/>`; }
    const ns = Math.min(80, Math.round(s.sugar / 1.5)); for (let i = 0; i < ns; i++) { const x = bx + 14 + R() * (bw - 28), y = by + bh - 10 - R() * (lh - 20); parts += `<polygon points="${[0, 1, 2, 3, 4, 5].map(k => `${x + 6 * Math.cos(k * Math.PI / 3)},${y + 6 * Math.sin(k * Math.PI / 3)}`).join(" ")}" fill="#fff" stroke="#bcaaa4" stroke-width="1.5"/>`; }
    const lo = leftover(s); if (lo > 0) { const w = Math.min(bw - 30, 20 + lo * 0.8); parts += `<path d="M${bx + bw / 2 - w / 2},${by + bh - 4} ${Array.from({ length: 9 }, (_, k) => `L${bx + bw / 2 - w / 2 + (k + 0.5) * w / 9},${by + bh - 4 - (k % 2 ? 6 : 18)}`).join(" ")} L${bx + bw / 2 + w / 2},${by + bh - 4} Z" fill="#fafafa" stroke="#9e9e9e" stroke-width="2"/>`; } }
  const g = s.mode === 3 ? glow3(s) : glow1(s), tester = s.mode === 3 || s.tester !== false;
  const bulb = `<g transform="translate(560,70)"><rect x="-70" y="40" width="60" height="34" rx="6" fill="#455a64"/>${T(-40, 62, "battery", { s: 10, c: "#fff" })}${g > 0 ? `<circle cx="70" cy="40" r="${40 + 40 * g}" fill="#fff59d" opacity="${(0.2 + 0.6 * g).toFixed(2)}"/>` : ""}<circle cx="70" cy="40" r="30" fill="${g > 0 ? `rgba(255,${Math.round(200 + 55 * g)},${Math.round(60 + 120 * g)},1)` : "#eceff1"}" stroke="#455a64" stroke-width="3"/><rect x="58" y="68" width="24" height="16" fill="#90a4ae"/>
    <path d="M-40,74 L-40,${by + 60 - 70} M70,84 L70,110 L-200,110 L-200,${by + 70 - 70}" fill="none" stroke="#37474f" stroke-width="3"/></g>
    ${tester ? `<rect x="${bx + 70}" y="${by - 40}" width="10" height="${lh + 40 - 20}" fill="#78909c"/><rect x="${bx + 210}" y="${by - 40}" width="10" height="${lh + 40 - 20}" fill="#78909c"/>` : ""}`;
  const marks = [0.25, 0.5, 0.75, 1].map(v => { const y = by + bh - v * (bh - 20); return `<line x1="${bx + bw - 24}" x2="${bx + bw}" y1="${y}" y2="${y}" stroke="#90a4ae" stroke-width="2"/>${T(bx + bw - 30, y + 4, v + " L", { a: "end", s: 11, c: "#78909c" })}`; }).join("");
  const panel = s.mode === 3 ? `${T(30, 0, SUBS[s.sub].n, { a: "start", s: 15, c: "#311b92" })}${T(30, 26, fmt(s.mol) + " mol in 1 L", { a: "start", s: 14, c: "#4527a0" })}${T(30, 52, show ? "ions: " + fmt(ionConc(s)) + " mol/L" : "ions: ? mol/L", { a: "start", s: 14, c: "#c62828" })}`
    : `${T(30, 0, "water: " + fmt(s.V) + " L", { a: "start", s: 14, c: "#0277bd" })}${T(30, 24, "salt added: " + s.salt + " g", { a: "start", s: 14, c: "#4527a0" })}${s.mode === 1 ? T(30, 48, "sugar added: " + s.sugar + " g", { a: "start", s: 14, c: "#6d4c41" }) : ""}${show && leftover(s) > 0 ? T(30, 72, "saturated: " + fmt(leftover(s)) + " g not dissolved", { a: "start", s: 13, c: "#c62828" }) : ""}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f6f5ff"/>
    <path d="M${bx},${by} L${bx},${by + bh - 12} Q${bx},${by + bh} ${bx + 12},${by + bh} L${bx + bw - 12},${by + bh} Q${bx + bw},${by + bh} ${bx + bw},${by + bh - 12} L${bx + bw},${by}" fill="rgba(255,255,255,.7)" stroke="#5c6bc0" stroke-width="5"/>
    <rect x="${bx + 3}" y="${by + bh - lh}" width="${bw - 6}" height="${lh - 3}" rx="8" fill="rgba(129,212,250,.35)"/>${parts}${marks}${bulb}
    <g transform="translate(470,250)"><rect x="10" y="-26" width="370" height="${show ? 170 : 130}" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${panel}${show ? T(195, 120, g > 0 ? `💡 the bulb lights (${Math.round(g * 100)}%) — ions carry the current` : "the bulb stays OFF — no free ions", { s: 13, c: g > 0 ? "#2e7d32" : "#c62828" }) : ""}</g></svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 1) return [{ id: "salt", type: "range", label: "🧂 Salt", min: 0, max: 60, step: 5, nudge: 5, unit: "g", lock: lk("salt") }, { id: "sugar", type: "range", label: "🍬 Sugar", min: 0, max: 60, step: 5, nudge: 5, unit: "g", lock: lk("sugar") }];
  if (mode === 2) return [{ id: "salt", type: "range", label: "🧂 Salt", min: 0, max: 400, step: 10, nudge: 10, unit: "g", lock: lk("salt") }, { id: "V", type: "range", label: "💧 Water (evaporate / add)", min: 0.1, max: 1, step: 0.1, nudge: 0.1, unit: "L", fmt: v => fmt(v), lock: lk("V") }];
  return [{ id: "sub", type: "choice", label: "Substance", options: Object.keys(SUBS).map(v => ({ v, label: SUBS[v].n })), wide: true, lock: lk("sub") }, { id: "mol", type: "range", label: "Amount dissolved in 1 L", min: 0, max: 0.5, step: 0.05, nudge: 0.05, unit: "mol", fmt: v => fmt(v), lock: lk("mol") }];
};
const stFor = (mode, o) => Object.assign(mode === 1 ? { mode, salt: 0, sugar: 0, V: 0.5 } : mode === 2 ? { mode, salt: 0, sugar: 0, V: 0.5 } : { mode, sub: "nacl", mol: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b) => Math.abs(a - b) < 1e-6;
const HINT = { 1: "Salt splits into ions (Na⁺ and Cl⁻) that carry electric current. Sugar dissolves as whole molecules: no ions, no current. Full brightness at 20 g salt in 0.5 L.", 2: "Up to 360 g of salt dissolves in 1 L of water (180 g in 0.5 L). Extra salt stays as solid: the solution is saturated.", 3: "NaCl → 2 ions, CaCl₂ → 3 ions, sugar and ethanol → 0 ions. More ions → better conductor." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🧂 Dissolving challenge", 2: "🧊 Saturation challenge", 3: "⚡ Ions challenge" }[mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("sol-sim", diff, uses, mk);
const C = {
  light: () => simQ(1, "Make the bulb <b>light up</b>.", stFor(1, { sugar: 30 }), s => ok(glow1(s) > 0, "Dissolved salt makes free ions that carry the current.", "Sugar molecules have no charge — the bulb stays off."), { salt: 10 }, { wrong: { salt: 0, sugar: 50 } }),
  full: () => simQ(1, "Make the bulb <b>fully bright</b> using the <b>least salt</b>.", stFor(1), s => ok(glow1(s) >= 1 && s.salt === 20, "20 g in 0.5 L = 40 g/L: full brightness.", glow1(s) >= 1 ? "Full brightness, but less salt is enough." : `Only ${Math.round(glow1(s) * 100)}% brightness.`), { salt: 20 }, { lock: ["sugar"], wrong: { salt: 25 } }),
  half: () => simQ(1, "Make the bulb glow at exactly <b>half</b> brightness.", stFor(1), s => ok(Math.abs(glow1(s) - 0.5) < 1e-9, "10 g of salt: half the ions → half the brightness.", `${Math.round(glow1(s) * 100)}% brightness.`), { salt: 10 }, { wrong: { salt: 15 } }),
  sweet: () => simQ(1, "Make a <b>very sweet</b> solution (at least 40 g sugar) that does <b>NOT</b> conduct electricity.", stFor(1, { salt: 10 }), s => ok(s.sugar >= 40 && glow1(s) === 0, "Sugar dissolves but does not form ions.", s.sugar < 40 ? "Add at least 40 g of sugar." : "The salt makes it conduct."), { salt: 0, sugar: 40 }, { wrong: { salt: 5, sugar: 40 } }),
  both: () => simQ(1, "Dissolve <b>40 g of sugar</b> AND make the bulb <b>fully bright</b> with the least salt.", stFor(1, { sugar: 40 }), s => ok(s.sugar === 40 && s.salt === 20, "Sugar does not change the brightness — only the salt ions do.", s.salt !== 20 ? `${s.salt} g of salt is not the least for full brightness.` : "Keep 40 g of sugar."), { salt: 20 }, { lock: ["sugar"], wrong: { salt: 30 } }),
  sat: () => { const v = choice([0.5, 1]); return simQ(2, `Make a <b>saturated</b> salt solution in <b>${v} L</b> of water using the <b>least</b> salt.`, stFor(2, { V: v }), s => ok(near(s.salt, SOLUB * v), `${SOLUB * v} g dissolves in ${v} L — any more would stay solid.`, s.salt > SOLUB * v ? "Saturated, but some salt is left over — use less." : `${s.salt} g all dissolves: not saturated yet.`), { salt: SOLUB * v }, { lock: ["V"], wrong: { salt: SOLUB * v - 10 } }); },
  water: () => simQ(2, "You have <b>200 g of salt</b>. Use the <b>least water</b> so that it <b>all dissolves</b>.", stFor(2, { salt: 200, V: 0.1 }), s => ok(leftover(s) === 0 && near(s.V, 0.6), "200 ÷ 360 = 0.56 L → 0.6 L of water.", leftover(s) > 0 ? `${fmt(leftover(s))} g did not dissolve.` : "It all dissolves, but less water is enough."), { V: 0.6 }, { lock: ["salt"], wrong: { V: 0.5 } }),
  evap: () => simQ(2, "There is <b>150 g of salt</b> dissolved in 1 L. <b>Evaporate</b> water until crystals <b>just start</b> to appear.", stFor(2, { salt: 150, V: 1 }), s => ok(leftover(s) > 0 && near(s.V, 0.4), "At 0.4 L only 144 g can dissolve — 6 g crystallises out.", leftover(s) === 0 ? "Still no crystals — evaporate more water." : "Crystals, but you evaporated more than needed."), { V: 0.4 }, { lock: ["salt"], wrong: { V: 0.5 } }),
  small: () => simQ(2, "Dissolve <b>72 g of salt</b> completely in the <b>smallest</b> amount of water.", stFor(2, { salt: 72, V: 1 }), s => ok(leftover(s) === 0 && near(s.V, 0.2), "72 ÷ 360 = 0.2 L.", leftover(s) > 0 ? `${fmt(leftover(s))} g is left over.` : "It dissolves, but less water is enough."), { V: 0.2 }, { lock: ["salt"], wrong: { V: 0.1 } }),
  ca: () => simQ(3, "Use <b>calcium chloride</b> to make an ion concentration of exactly <b>0.6 mol/L</b>.", stFor(3, { sub: "cacl2" }), s => ok(near(ionConc(s), 0.6), "CaCl₂ → Ca²⁺ + 2 Cl⁻: 0.2 mol × 3 = 0.6 mol of ions.", `Ions: ${fmt(ionConc(s))} mol/L.`), { mol: 0.2 }, { lock: ["sub"], wrong: { mol: 0.3 } }),
  same: () => simQ(3, "0.3 mol of NaCl gives 0.6 mol/L of ions. Choose <b>another substance</b> and amount with the <b>same conductivity</b>.", stFor(3, { sub: "nacl", mol: 0.3 }), s => ok(s.sub !== "nacl" && near(ionConc(s), 0.6), `${SUBS[s.sub].n}: ${fmt(ionConc(s))} mol/L of ions.`, s.sub === "nacl" ? "Choose a different substance." : `Ions: ${fmt(ionConc(s))} mol/L.`), { sub: "cacl2", mol: 0.2 }, { wrong: { sub: "sugar", mol: 0.3 } }),
  noCond: () => simQ(3, "Dissolve <b>0.4 mol</b> of a substance that does <b>NOT conduct</b>.", stFor(3, { sub: "nacl", mol: 0.4 }), s => ok(near(s.mol, 0.4) && ionConc(s) === 0, `${SUBS[s.sub].n} is covalent: it dissolves as neutral molecules.`, ionConc(s) > 0 ? "That substance forms ions." : "Use 0.4 mol."), { sub: "sugar" }, { lock: ["mol"], wrong: { sub: "cacl2" } }),
  most: () => simQ(3, "Make <b>0.9 mol/L of ions</b> using the <b>fewest moles</b> of substance.", stFor(3), s => ok(near(ionConc(s), 0.9) && s.sub === "cacl2", "0.3 mol CaCl₂ × 3 ions = 0.9.", near(ionConc(s), 0.9) ? "Right ions, but another substance needs fewer moles." : `Ions: ${fmt(ionConc(s))} mol/L.`), { sub: "cacl2", mol: 0.3 }, { wrong: { sub: "nacl", mol: 0.45 } })
};

// ---------- diagram tasks ----------
function miniBeaker(st0, x, y) { const R = rnd(x + 3), w = 210, h = 210; let p = "";
  const ions = Math.round(st0.salt * 1.4), mols = Math.round(st0.sugar / 2);
  for (let i = 0; i < ions; i++) { const px = x + 16 + R() * (w - 40), py = y + 70 + R() * (h - 90); p += `<circle cx="${px}" cy="${py}" r="6" fill="#7e57c2"/><circle cx="${px + 13}" cy="${py + 6}" r="7" fill="#43a047"/>`; }
  for (let i = 0; i < mols; i++) { const px = x + 16 + R() * (w - 32), py = y + 70 + R() * (h - 90); p += `<polygon points="${[0, 1, 2, 3, 4, 5].map(k => `${px + 8 * Math.cos(k * Math.PI / 3)},${py + 8 * Math.sin(k * Math.PI / 3)}`).join(" ")}" fill="#fff" stroke="#8d6e63" stroke-width="2"/>`; }
  return `<path d="M${x},${y} L${x},${y + h - 10} Q${x},${y + h} ${x + 10},${y + h} L${x + w - 10},${y + h} Q${x + w},${y + h} ${x + w},${y + h - 10} L${x + w},${y}" fill="#fff" stroke="#5c6bc0" stroke-width="4"/><rect x="${x + 3}" y="${y + 56}" width="${w - 6}" height="${h - 59}" rx="6" fill="rgba(129,212,250,.35)"/>${p}`; }
const D = {
  pick: diff => E.diaT("sol-pick", diff, 1, () => { const sets = { a: stFor(1, { salt: 20 }), b: stFor(1, { sugar: 40 }), c: stFor(1) }, order = E.shuffle(["a", "b", "c"]);
    const q = choice([["a", "the beaker that <b>conducts electricity</b>"], ["b", "the beaker with <b>dissolved molecules but no ions</b>"]]);
    return { kind: "pick", title: "👆 Ions or molecules?", prompt: "Click " + q[0 + 1] + ".", answer: [q[0]], names: { a: "salt solution", b: "sugar solution", c: "pure water" },
      visual: st => `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="300" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="284" rx="14" fill="#fff" ${E.ring(st[k])}/>${miniBeaker(sets[k], 46 + i * 298, 40)}${T(151 + i * 298, 280, "Beaker " + (i + 1), { s: 14 })}</g>`).join("")}</svg>`,
      explain: "Purple/green pairs = Na⁺ and Cl⁻ ions (salt): they conduct. White hexagons = sugar molecules: no charge, no current. Pure water: almost no ions.", summary: "Ions vs molecules" }; }),
  solNum: diff => E.diaT("sol-num", diff, 2, () => { const c = choice([[0.5, 200], [0.25, 100], [1, 400], [0.2, 90]]); const d = Math.min(c[1], 360 * c[0]);
    return { kind: "num", title: "🧮 Saturation", prompt: `Salt dissolves up to 360 g per litre. ${c[1]} g of salt is stirred into ${c[0]} L of water.`, visual: render(stFor(2, { salt: c[1], V: c[0], showVals: false })),
      fields: [{ label: "Mass that dissolves", unit: "g", answer: d }, { label: "Mass left at the bottom", unit: "g", answer: c[1] - d }], explain: `Max = 360 × ${c[0]} = ${360 * c[0]} g. ${c[1] > 360 * c[0] ? `${c[1] - 360 * c[0]} g stays solid.` : "It all dissolves."}`, summary: "Solubility calculation" }; }),
  ionNum: diff => E.diaT("sol-num", diff, 3, () => { const c = choice([["cacl2", 0.25], ["nacl", 0.35], ["cacl2", 0.1], ["sugar", 0.5]]);
    return { kind: "num", title: "⚡ Count the ions", prompt: `${c[1]} mol of ${SUBS[c[0]].n} is dissolved in 1 L of water.`, visual: render(stFor(3, { sub: c[0], mol: c[1] })),
      fields: [{ label: "Ions per formula unit", unit: "", answer: SUBS[c[0]].ions }, { label: "Concentration of ions", unit: "mol/L", answer: c[1] * SUBS[c[0]].ions, tol: 0.006 }], explain: `${SUBS[c[0]].n} gives ${SUBS[c[0]].ions} ions: ${c[1]} × ${SUBS[c[0]].ions} = ${fmt(c[1] * SUBS[c[0]].ions)} mol/L.`, summary: "Ions from ionic compounds" }; }),
  mcq: diff => E.diaT("sol-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does salt water conduct electricity but sugar water does not?", ok: "Salt splits into charged ions; sugar stays as neutral molecules", bad: ["Sugar is heavier than salt", "Salt is a metal", "Sugar does not dissolve"], ex: "Moving charged ions carry the current." },
      { ask: "What happens when more salt is added to a saturated solution?", ok: "It stays as solid at the bottom", bad: ["It dissolves faster", "The water turns into salt", "The solution becomes a gas"], ex: "A saturated solution cannot dissolve any more solute at that temperature." },
      { ask: "When salt water is left in the sun, salt crystals appear. Why?", ok: "Water evaporates, so there is not enough water to keep all the salt dissolved", bad: ["The sun makes new salt", "Salt evaporates", "The ions change into sugar"], ex: "Less water → less salt can stay dissolved → crystals form." }]);
    return { kind: "mcq", title: "📘 Solutions", prompt: "Look at the solution.", visual: render(stFor(2, { salt: 220, V: 0.5, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Dissolving ideas" }; })
};
const LEVELS = {
  1: { intro: "Dissolve salt and sugar in water and test with the conductivity tester.", pool: () => [S(1, 1, C.light), S(1, 1, C.sweet), S(2, 1, C.half), S(2, 1, C.full), S(3, 1, C.both), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Saturation: only 360 g of salt dissolves in 1 L of water. Add salt or evaporate water.", pool: () => [S(1, 1, C.sat), S(2, 1, C.water), S(2, 1, C.small), S(3, 1, C.evap), S(3, 1, C.sat), D.mcq(1), D.solNum(2), D.solNum(3)] },
  3: { intro: "Ionic vs covalent: count the ions each substance gives in water.", pool: () => [S(1, 1, C.noCond), S(2, 1, C.ca), S(2, 1, C.same), S(3, 1, C.most), D.pick(1), D.ionNum(2), D.ionNum(3)] }
};
const explore = E.exploreSim({
  intro: "Add salt, sugar or other substances, and watch the particles and the conductivity bulb.",
  state: lv => stFor(lv, { showVals: true }), controls: lv => ctlsFor(lv), render,
  goals: lv => lv === 1 ? [{ txt: "Light the bulb", test: s => glow1(s) > 0 }, { txt: "Dissolve sugar only (bulb off)", test: s => s.sugar > 0 && s.salt === 0 }] : lv === 2 ? [{ txt: "Make a saturated solution", test: s => leftover(s) > 0 }, { txt: "Dissolve 200 g of salt completely", test: s => s.salt >= 200 && leftover(s) === 0 }] : [{ txt: "Try a covalent substance", test: s => !SUBS[s.sub].ionic && s.mol > 0 }, { txt: "Make a very bright bulb (over 0.9 mol/L ions)", test: s => ionConc(s) > 0.9 }],
  facts: lv => lv === 3 ? "📘 <b>Ionic</b> compounds split into ions in water (they conduct). <b>Covalent</b> compounds like sugar dissolve as whole molecules." : "📘 Salt dissolves as <b>ions</b> (Na⁺, Cl⁻), sugar as <b>molecules</b>. A <b>saturated</b> solution cannot dissolve more."
});
E.start({ labId: "solutions", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧂", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧂", "🍬", "💡", "✨"],
  exploreDemo: lv => lv === 1 ? [{ set: { salt: 10 } }, { set: { salt: 0, sugar: 30 } }] : lv === 2 ? [{ set: { salt: 250 } }, { set: { salt: 200, V: 0.6 } }] : [{ set: { sub: "sugar", mol: 0.3 } }, { set: { sub: "cacl2", mol: 0.4 } }] });
})();
