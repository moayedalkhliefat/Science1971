"use strict";
// ===== Molecule Polarity — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100, rad = d => d * Math.PI / 180;
const EL = { Na: { en: 0.9, c: "#ab47bc", t: "#fff", r: 34 }, H: { en: 2.2, c: "#f5f5f5", t: "#37474f", r: 24 }, C: { en: 2.6, c: "#424242", t: "#fff", r: 30 }, N: { en: 3.0, c: "#1e88e5", t: "#fff", r: 29 }, Cl: { en: 3.2, c: "#43a047", t: "#fff", r: 33 }, O: { en: 3.4, c: "#e53935", t: "#fff", r: 28 }, F: { en: 4.0, c: "#c0ca33", t: "#263238", r: 26 } };
const dEN = s => r2(Math.abs(EL[s.a].en - EL[s.b].en));
const bondType = d => d < 0.5 ? "non-polar covalent" : d <= 1.8 ? "polar covalent" : "ionic";
const neg = s => EL[s.a].en > EL[s.b].en ? s.a : EL[s.b].en > EL[s.a].en ? s.b : null; // δ− atom (two-atom)
const total = s => s.mode === "two" ? dEN(s) : r2(2 * dEN(s) * Math.cos(rad(s.angle / 2)));
const polar = s => s.mode === "two" ? dEN(s) >= 0.5 && dEN(s) <= 1.8 : dEN(s) >= 0.5 && total(s) >= 0.05;
const atomSVG = (el, x, y, lbl, k) => { const e = EL[el], r = e.r * (k || 1.45); return `<circle cx="${x}" cy="${y}" r="${r}" fill="${e.c}" stroke="#37474f" stroke-width="2"/>${T(x, y + 7, el, { s: k ? 18 : 24, c: e.t })}${lbl ? T(x, y - r - 12, lbl, { s: 20, c: lbl.includes("−") ? "#1565c0" : "#c62828" }) : ""}`; };
const dipArrow = (x1, y1, x2, y2, col, w) => { const a = Math.atan2(y2 - y1, x2 - x1), px = Math.cos(a + Math.PI / 2) * 8, py = Math.sin(a + Math.PI / 2) * 8, cx = x1 + (x2 - x1) * 0.12, cy = y1 + (y2 - y1) * 0.12; return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 10}" y2="${y2 - Math.sin(a) * 10}" stroke="${col}" stroke-width="${w}"/><path d="M${x2},${y2} l${-Math.cos(a) * 14 - Math.sin(a) * 8},${-Math.sin(a) * 14 + Math.cos(a) * 8} l${Math.sin(a) * 16},${-Math.cos(a) * 16}Z" fill="${col}"/><line x1="${cx + px}" y1="${cy + py}" x2="${cx - px}" y2="${cy - py}" stroke="${col}" stroke-width="${w}"/>`; };
function twoScene(s, show) {
  const cx = 300, cy = 225, d = dEN(s), n = neg(s), ion = d > 1.8;
  let rot = 0; if (show && s.field && n && !ion) rot = n === s.a ? 0 : 180; // δ− turns toward the + plate (left)
  if (show && s.field && ion) rot = n === s.a ? 0 : 180;
  let g = "";
  if (s.field) g += `<rect x="40" y="70" width="20" height="310" fill="#ef9a9a" stroke="#c62828"/>${T(50, 62, "+", { s: 22, c: "#c62828" })}<rect x="540" y="70" width="20" height="310" fill="#90caf9" stroke="#1565c0"/>${T(550, 62, "−", { s: 22, c: "#1565c0" })}${[110, 170, 230, 290, 350].map(y => `<line x1="70" y1="${y}" x2="530" y2="${y}" stroke="#eceff1" stroke-width="2"/><path d="M500,${y} l-10,-5 v10Z" fill="#cfd8dc"/>`).join("")}`;
  const xa = cx - 95, xb = cx + 95, shift = n ? (n === s.b ? 1 : -1) * Math.min(1, d / 2) * 40 : 0;
  g += `<g transform="rotate(${rot} ${cx} ${cy})"><ellipse cx="${cx + shift}" cy="${cy}" rx="${170 - Math.min(d, 2) * 12}" ry="76" fill="#b39ddb" opacity="${ion ? 0 : 0.35}"/>`;
  if (!ion) g += `<line x1="${xa}" y1="${cy}" x2="${xb}" y2="${cy}" stroke="#455a64" stroke-width="8"/>`;
  const la = !show || !n ? "" : ion ? (n === s.a ? "−" : "+") : (n === s.a ? "δ−" : "δ+"), lb = !show || !n ? "" : ion ? (n === s.b ? "−" : "+") : (n === s.b ? "δ−" : "δ+");
  g += `<g transform="rotate(${-rot} ${xa} ${cy})">${atomSVG(s.a, xa, cy, la)}</g><g transform="rotate(${-rot} ${xb} ${cy})">${atomSVG(s.b, xb, cy, lb)}</g>`;
  if (show && n && !ion) g += dipArrow(n === s.a ? xb : xa, cy + 104, n === s.a ? xa : xb, cy + 104, "#6a1b9a", 3 + d * 2);
  g += `</g>`;
  return g + T(300, 410, show ? (ion ? "electron transferred → ions" : n ? "electrons pulled toward " + n : "electrons shared equally") : "press ▶ to see the electrons", { s: 14, c: show ? "#37474f" : "#90a4ae" });
}
function threeScene(s, show) {
  const cx = 300, cy = 170, L = 150, h = s.angle / 2;
  const p1 = [cx - L * Math.sin(rad(h)), cy + L * Math.cos(rad(h))], p2 = [cx + L * Math.sin(rad(h)), cy + L * Math.cos(rad(h))];
  let g = `<line x1="${cx}" y1="${cy}" x2="${p1[0]}" y2="${p1[1]}" stroke="#455a64" stroke-width="8"/><line x1="${cx}" y1="${cy}" x2="${p2[0]}" y2="${p2[1]}" stroke="#455a64" stroke-width="8"/>`;
  if (s.angle < 180) g += `<path d="M${cx - 40 * Math.sin(rad(h))},${cy + 40 * Math.cos(rad(h))} A40,40 0 0 0 ${cx + 40 * Math.sin(rad(h))},${cy + 40 * Math.cos(rad(h))}" fill="none" stroke="#78909c" stroke-width="2"/>`;
  g += T(cx, cy + (s.angle < 180 ? 70 : 66), s.angle + "°", { s: 13, c: "#546e7a" });
  const n = neg(s), d = dEN(s), outerNeg = n === s.a;
  const lc = !show || !n ? "" : outerNeg ? "δ+" : "δ−", lo = !show || !n ? "" : outerNeg ? "δ−" : "δ+";
  g += atomSVG(s.a, p1[0], p1[1], lo) + atomSVG(s.a, p2[0], p2[1], lo) + atomSVG(s.b, cx, cy, lc);
  if (show && n && d > 0) {
    [p1, p2].forEach(p => { const f = outerNeg ? [cx, cy, p[0], p[1]] : [p[0], p[1], cx, cy]; const mx = (f[0] + f[2]) / 2, my = (f[1] + f[3]) / 2, ox = (f[3] - f[1]) * 0.25, oy = -(f[2] - f[0]) * 0.25; g += dipArrow(mx - (f[2] - f[0]) * 0.3 + ox * (p === p1 ? -1 : 1), my - (f[3] - f[1]) * 0.3 + oy * (p === p1 ? -1 : 1), mx + (f[2] - f[0]) * 0.3 + ox * (p === p1 ? -1 : 1), my + (f[3] - f[1]) * 0.3 + oy * (p === p1 ? -1 : 1), "#9575cd", 3); });
    const tot = total(s); if (tot > 0.05) { const dir = outerNeg ? 1 : -1, len = 40 + tot * 40; g += dipArrow(cx, cy - dir * 40 + (dir > 0 ? 70 : -10), cx, cy - dir * 40 + (dir > 0 ? 70 + len : -10 - len), "#4a148c", 5); }
  }
  return g + T(300, 410, show ? (total(s) > 0.05 ? "the bond dipoles add up → polar molecule" : d > 0 ? "the bond dipoles cancel → non-polar molecule" : "no bond dipoles → non-polar") : "press ▶ to add up the dipoles", { s: 14, c: show ? "#37474f" : "#90a4ae" });
}
function render(s) {
  const show = s.reveal, d = dEN(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>` + (s.mode === "two" ? twoScene(s, show) : threeScene(s, show));
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${T(120, 64, `${s.a}: ${EL[s.a].en}   ${s.b}: ${EL[s.b].en}`, { s: 14, c: "#37474f" })}${T(120, 86, "(electronegativity)", { s: 10, c: "#90a4ae" })}
    ${show ? T(120, 124, "ΔEN = " + fmt(d), { s: 20, c: "#e65100" }) + T(120, 154, bondType(d) + " bond" + (s.mode === "three" ? "s" : ""), { s: 14, c: "#37474f" })
      + T(120, 204, "molecule dipole", { s: 12, c: "#78909c" }) + T(120, 232, fmt(total(s)), { s: 22, c: "#6a1b9a" }) + T(120, 266, s.mode === "two" && d > 1.8 ? "ionic compound" : polar(s) ? "POLAR molecule" : "NON-POLAR molecule", { s: 16, c: polar(s) ? "#6a1b9a" : "#37474f" })
      + (s.mode === "two" && s.field ? T(120, 300, d >= 0.5 ? "it turns in the field" : "it hardly turns", { s: 13, c: "#546e7a" }) : "") : T(120, 200, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 350, "ΔEN < 0.5 non-polar · up to 1.8 polar", { s: 10, c: "#90a4ae" })}${T(120, 366, "above 1.8 ionic", { s: 10, c: "#90a4ae" })}${s.mode === "three" ? T(120, 386, "dipole = 2 × ΔEN × cos(angle ÷ 2)", { s: 10, c: "#90a4ae" }) : ""}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const elOpts = Object.keys(EL).map(v => ({ v, label: v + " (" + EL[v].en + ")" }));
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Molecule", options: [{ v: "two", label: "Two atoms" }, { v: "three", label: "Three atoms" }] }] : []),
  { id: "a", type: "select", label: "Atom A (outer atoms)", options: elOpts, lock: lk("a") },
  { id: "b", type: "select", label: "Atom B (centre atom)", options: elOpts, lock: lk("b") },
  { id: "field", type: "toggle", label: "⚡ Electric field on", hide: s => s.mode !== "two" || (lv < 2 && !explore), lock: lk("field") },
  { id: "angle", type: "range", label: "Bond angle", min: 90, max: 180, step: 15, nudge: 15, unit: "°", hide: s => s.mode !== "three", lock: lk("angle") }]; };
const st = o => Object.assign({ mode: "two", a: "H", b: "Cl", field: false, angle: 180 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `${s.a}–${s.b}: ΔEN ${fmt(dEN(s))}, ${bondType(dEN(s))}${s.mode === "three" ? `, molecule dipole ${fmt(total(s))}` : ""}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "two" ? "⚡ Bond challenge" : "🔺 Shape challenge", prompt: "Build the molecule, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "ΔEN = difference in electronegativity. Below 0.5: non-polar; 0.5–1.8: polar covalent; above 1.8: ionic. The more electronegative atom is δ−. In a 3-atom molecule the bond dipoles add like arrows: at 180° they cancel." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("po-sim", diff, uses, mk);
const C = {
  nonpol: () => simQ(1, "Make a <b>non-polar covalent</b> bond between <b>two different</b> elements.", st({ a: "H", b: "O" }), s => ok(s.a !== s.b && dEN(s) < 0.5, `${s.a}–${s.b}: ΔEN ${fmt(dEN(s))} — shared almost equally.`, s.a === s.b ? "Use two different elements." : said(s)), { a: "H", b: "C" }, { wrong: { a: "H", b: "N" } }),
  ionic: () => simQ(1, "Make an <b>ionic</b> bond with <b>fluorine</b>.", st({ a: "H", b: "F" }), s => ok(dEN(s) > 1.8, "Na–F: ΔEN 3.1 — an electron is transferred.", said(s)), { a: "Na" }, { lock: ["b"], wrong: { a: "H" } }),
  nNeg: () => simQ(1, "Make <b>nitrogen</b> the <b>δ−</b> end of a <b>polar covalent</b> bond.", st({ a: "O", b: "N" }), s => ok(neg(s) === "N" && bondType(dEN(s)) === "polar covalent", "H–N: ΔEN 0.8, N pulls the electrons.", neg(s) !== "N" ? `${neg(s) || "Neither atom"} is δ−.` : said(s)), { a: "H" }, { lock: ["b"], wrong: { a: "C" } }),
  most: () => simQ(1, "Make the <b>most polar</b> bond that is still <b>covalent</b> (not ionic).", st({ a: "C", b: "O" }), s => ok(dEN(s) === 1.8, "H–F: ΔEN 1.8 — the most polar covalent bond here.", dEN(s) > 1.8 ? "That is ionic." : `ΔEN ${fmt(dEN(s))} — find a bigger difference.`), { a: "H", b: "F" }, { wrong: { a: "C", b: "F" } }),
  o2: () => simQ(2, "The field is ON. Choose the partner for <b>oxygen</b> so the molecule does <b>not turn</b>.", st({ a: "H", b: "O", field: true }), s => ok(dEN(s) === 0, "O₂: no ΔEN, no dipole — it doesn't turn.", `ΔEN ${fmt(dEN(s))} — it still has a dipole.`), { a: "O" }, { lock: ["b", "field"], wrong: { a: "N" } }),
  hStrong: () => simQ(2, "With <b>H</b> as one atom, make the covalent molecule that turns <b>most strongly</b> in the field.", st({ a: "H", b: "C", field: true }), s => ok(s.b === "F", "H–F has the biggest covalent dipole (1.8).", dEN(s) > 1.8 ? "That is ionic." : `Dipole ${fmt(dEN(s))} — try a bigger one.`), { b: "F" }, { lock: ["a", "field"], wrong: { b: "O" } }),
  d10: () => simQ(2, "Make a molecule with a dipole of exactly <b>1.0</b>.", st({ a: "C", b: "O", field: true }), s => ok(dEN(s) === 1.0, "H–Cl: 3.2 − 2.2 = 1.0.", said(s)), { a: "H", b: "Cl" }, { lock: ["field"], wrong: { a: "H", b: "N" } }),
  cNeg: () => simQ(2, "Switch the field <b>on</b> and make <b>carbon</b> the <b>δ−</b> end.", st({ a: "C", b: "O", field: false }), s => ok(s.field && neg(s) === "C", "C is more electronegative than H (or Na), so it pulls the electrons.", !s.field ? "Turn the field on." : `${neg(s) || "Neither atom"} is δ−.`), { b: "H", field: true }, { lock: ["a"], wrong: { b: "H", field: false } }),
  co2: () => simQ(3, "Build <b>CO₂</b> (O outside, C in the centre) so it is <b>non-polar</b> overall.", st({ mode: "three", a: "O", b: "C", angle: 120 }), s => ok(!polar(s) && dEN(s) > 0, "Linear (180°): the two C=O dipoles cancel.", `Molecule dipole ${fmt(total(s))}.`), { angle: 180 }, { lock: ["a", "b"], wrong: { angle: 165 } }),
  water: () => simQ(3, "Build <b>water</b>: H outside, O in the centre, with its real <b>bent</b> shape (about 105°).", st({ mode: "three", a: "C", b: "C", angle: 180 }), s => ok(s.a === "H" && s.b === "O" && s.angle === 105, "H₂O is bent (104.5°) → polar.", "Check the atoms and the angle."), { a: "H", b: "O", angle: 105 }, { wrong: { a: "H", b: "O", angle: 120 } }),
  cancel: () => simQ(3, "Make a molecule with <b>polar bonds</b> that is <b>non-polar</b> overall.", st({ mode: "three", a: "H", b: "O", angle: 105 }), s => ok(bondType(dEN(s)) !== "non-polar covalent" && !polar(s), "Polar bonds at 180° cancel out.", bondType(dEN(s)) === "non-polar covalent" ? "The bonds must be polar." : `Molecule dipole ${fmt(total(s))}.`), { angle: 180 }, { wrong: { angle: 150 } }),
  dip12: () => simQ(3, "H outside, O in the centre: choose the angle that gives a molecule dipole of exactly <b>1.2</b>.", st({ mode: "three", a: "H", b: "O", angle: 180 }), s => ok(total(s) === 1.2, "2 × 1.2 × cos 60° = 1.2 at 120°.", `Dipole ${fmt(total(s))}.`), { angle: 120 }, { lock: ["a", "b"], wrong: { angle: 105 } })
};
const D = {
  pick: diff => E.diaT("po-pick", diff, 2, () => {
    if (diff === 1) {
      const pool = E.shuffle([["H", "H"], ["H", "Cl"], ["Na", "Cl"], ["C", "H"], ["H", "O"], ["N", "Cl"], ["C", "O"], ["Na", "F"], ["H", "F"]]).slice(0, 4).map(p => st({ a: p[0], b: p[1] }));
      const want = choice(["non-polar covalent", "polar covalent", "ionic"]); if (!pool.some(s => bondType(dEN(s)) === want)) pool[0] = want === "ionic" ? st({ a: "Na", b: "Cl" }) : want === "polar covalent" ? st({ a: "H", b: "O" }) : st({ a: "Cl", b: "Cl" });
      return { kind: "pick", many: true, title: "👆 Sort the bonds", prompt: `Click <b>every ${want}</b> bond.`, answer: pool.map((s, i) => bondType(dEN(s)) === want ? "k" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["k" + i, s.a + "–" + s.b])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><line x1="${x + 60}" y1="140" x2="${x + 136}" y2="140" stroke="#455a64" stroke-width="7"/>${atomSVG(s.a, x + 60, 140, "", 1)}${atomSVG(s.b, x + 136, 140, "", 1)}${T(x + 98, 220, s.a + " " + EL[s.a].en + " · " + s.b + " " + EL[s.b].en, { s: 14, c: "#546e7a" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Work out ΔEN: below 0.5 non-polar, 0.5–1.8 polar covalent, above 1.8 ionic.", summary: "Bond types" };
    }
    const pool = E.shuffle([st({ mode: "three", a: "O", b: "C", angle: 180 }), st({ mode: "three", a: "H", b: "O", angle: 105 }), st({ mode: "three", a: "F", b: "O", angle: 105 }), st({ mode: "three", a: "Cl", b: "C", angle: 180 }), st({ mode: "three", a: "H", b: "N", angle: 120 }), st({ mode: "three", a: "O", b: "O", angle: 120 })]).slice(0, 4);
    const want = choice(["polar", "nonpolar"]), t = s => want === "polar" ? polar(s) : !polar(s);
    if (!pool.some(t)) pool[0] = want === "polar" ? st({ mode: "three", a: "H", b: "O", angle: 105 }) : st({ mode: "three", a: "O", b: "C", angle: 180 });
    return { kind: "pick", many: true, title: "👆 Polar or non-polar?", prompt: `Click <b>every ${want === "polar" ? "polar" : "non-polar"}</b> molecule.`, answer: pool.map((s, i) => t(s) ? "m" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["m" + i, s.a + "–" + s.b + "–" + s.a + " at " + s.angle + "°"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="m${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><g transform="translate(${x + 98 - 0.45 * 300},${40 - 0.45 * 120}) scale(.45)">${threeScene(s, false).replace(/<text[^>]*>press ▶[^<]*<\/text>/, "")}</g>${T(x + 98, 230, s.a + "–" + s.b + "–" + s.a, { s: 15, c: "#37474f" })}${T(x + 98, 254, "ΔEN " + fmt(dEN(s)) + " · " + s.angle + "°", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["m" + i])}/></g>`; }).join("")}</svg>`,
      explain: "Polar bonds in a symmetric (180°) molecule cancel; in a bent molecule they add up.", summary: "Molecular polarity" };
  }),
  num: diff => E.diaT("po-num", diff, 2, () => {
    if (diff < 3) { const p = choice([["H", "O"], ["C", "F"], ["Na", "Cl"], ["N", "H"], ["C", "Cl"], ["H", "F"]]), s = st({ a: p[0], b: p[1] });
      return { kind: "num", title: "🧮 Electronegativity difference", prompt: `Electronegativity: <b>${p[0]} = ${EL[p[0]].en}</b>, <b>${p[1]} = ${EL[p[1]].en}</b>.`, visual: render(Object.assign({}, s, { reveal: false })), fields: [{ label: "ΔEN", unit: "", answer: dEN(s) }], explain: `${Math.max(EL[p[0]].en, EL[p[1]].en)} − ${Math.min(EL[p[0]].en, EL[p[1]].en)} = ${fmt(dEN(s))} → ${bondType(dEN(s))}.`, summary: "ΔEN" }; }
    const c = choice([["H", "O", 120], ["H", "O", 90], ["F", "O", 120], ["Cl", "C", 90]]), s = st({ mode: "three", a: c[0], b: c[1], angle: c[2] });
    return { kind: "num", title: "🧮 Adding dipoles", prompt: `${c[0]}–${c[1]}–${c[0]} at <b>${c[2]}°</b>. Each bond dipole = ΔEN. Molecule dipole = 2 × ΔEN × cos(angle ÷ 2).`, visual: render(s), fields: [{ label: "ΔEN of each bond", unit: "", answer: dEN(s) }, { label: "Molecule dipole", unit: "", answer: total(s) }], explain: `2 × ${fmt(dEN(s))} × cos ${c[2] / 2}° = ${fmt(total(s))}.`, summary: "Vector sum of dipoles" };
  }),
  mcq: diff => E.diaT("po-mcq", diff, 2, () => { const q = choice([
      { ask: "Why is water polar but carbon dioxide is not?", ok: "Water is bent, so its bond dipoles add; CO₂ is linear, so they cancel", bad: ["Water has no polar bonds", "CO₂ has no electrons", "Oxygen is less electronegative in CO₂"], ex: "Shape decides whether bond dipoles cancel." },
      { ask: "What does electronegativity measure?", ok: "How strongly an atom pulls shared electrons toward itself", bad: ["How many electrons an atom has", "The size of the nucleus", "How fast an atom moves"], ex: "The more electronegative atom becomes δ−." },
      { ask: "Why does oil not mix with water?", ok: "Oil is non-polar and water is polar — 'like dissolves like'", bad: ["Oil is heavier than water", "Oil is ionic", "Water is non-polar"], ex: "Polar dissolves polar; non-polar dissolves non-polar." },
      { ask: "In an electric field, a polar molecule…", ok: "turns so its δ− end points toward the positive plate", bad: ["does not move", "splits into ions", "turns its δ+ end toward the positive plate"], ex: "Opposite charges attract." }]);
    return { kind: "mcq", title: "📘 Polarity ideas", prompt: "Think about electronegativity and shape.", visual: render(st({ mode: "three", a: "H", b: "O", angle: 105, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Polarity" }; })
};
const LEVELS = {
  1: { intro: "Electronegativity decides who gets the electrons: equal sharing, unequal sharing, or a full transfer.", pool: () => [S(1, 1, C.ionic), S(2, 1, C.nonpol), S(2, 1, C.nNeg), S(3, 1, C.most), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Polar molecules have a δ+ and a δ− end, so they turn to line up in an electric field.", pool: () => [S(1, 1, C.o2), S(2, 1, C.cNeg), S(2, 1, C.hStrong), S(3, 1, C.d10), D.num(2), D.pick(2), D.mcq(3)] },
  3: { intro: "In bigger molecules the bond dipoles add like arrows. Shape decides if they cancel.", pool: () => [S(1, 1, C.co2), S(2, 1, C.water), S(3, 1, C.cancel), S(3, 1, C.dip12), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Choose the atoms, switch the electric field on, or build a 3-atom molecule and bend it. Press ▶ to see the electrons.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Show",
  goals: () => [{ txt: "Make an ionic bond", test: (s, m) => m.i }, { txt: "Turn a polar molecule in the field", test: (s, m) => m.f }, { txt: "Make a non-polar molecule with polar bonds", test: (s, m) => m.c }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "two" && dEN(s) > 1.8) m.i = 1; if (s.mode === "two" && s.field && dEN(s) >= 0.5 && dEN(s) <= 1.8) m.f = 1; if (s.mode === "three" && dEN(s) >= 0.5 && !polar(s)) m.c = 1; },
  facts: () => "📘 A molecule is <b>polar</b> when its electrons are pulled to one side — this depends on <b>electronegativity</b> and on <b>shape</b>."
});
E.start({ labId: "polarity", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚡", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚡", "💧", "➕", "➖"],
  exploreDemo: () => [{ set: { mode: "two", a: "Na", b: "Cl", field: false }, run: true }, { set: { mode: "two", a: "H", b: "F", field: true }, run: true }, { set: { mode: "three", a: "O", b: "C", angle: 180 }, run: true }] });
})();
