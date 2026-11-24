"use strict";
// ===== Ionic & Covalent Bonding — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const EL = { Na: { n: "Sodium", v: 1, m: true, c: "#8e24aa" }, Mg: { n: "Magnesium", v: 2, m: true, c: "#5e35b1" }, Al: { n: "Aluminium", v: 3, m: true, c: "#3949ab" },
  H: { n: "Hydrogen", v: 1, m: false, c: "#607d8b" }, C: { n: "Carbon", v: 4, m: false, c: "#37474f" }, N: { n: "Nitrogen", v: 5, m: false, c: "#1e88e5" }, O: { n: "Oxygen", v: 6, m: false, c: "#e53935" }, F: { n: "Fluorine", v: 7, m: false, c: "#43a047" }, Cl: { n: "Chlorine", v: 7, m: false, c: "#2e7d32" } };
const need = s => s === "H" ? 1 : 8 - EL[s].v;            // electrons to gain / bonds to make
const lose = s => EL[s].v;                                  // electrons a metal loses
const SUB = "₀₁₂₃₄";
const ORDER = ["Na", "Mg", "Al", "C", "N", "H", "Cl", "O", "F"];
const formula = s => { const part = (e, n) => e + (n > 1 ? SUB[n] : ""); if (s.a === s.b) return part(s.a, s.na + s.nb); const p = [[s.a, s.na], [s.b, s.nb]].sort((x, y) => ORDER.indexOf(x[0]) - ORDER.indexOf(y[0])); return part(p[0][0], p[0][1]) + part(p[1][0], p[1][1]); };
function verdict(s) {
  const A = EL[s.a], B = EL[s.b];
  if (A.m && B.m) return { ok: false, why: "Two metals do not form ionic or covalent compounds." };
  if (A.m !== B.m) { // metal + non-metal → ionic
    if (s.mode !== "transfer") return { ok: false, why: "A metal and a non-metal TRANSFER electrons (ionic bond)." };
    const M = A.m ? [s.a, s.na] : [s.b, s.nb], X = A.m ? [s.b, s.nb] : [s.a, s.na];
    if (X[0] === "H") return { ok: false, why: "Choose a non-metal other than hydrogen." };
    return M[1] * lose(M[0]) === X[1] * need(X[0]) ? { ok: true, type: "ionic", why: `${M[1]} × ${lose(M[0])} electrons lost = ${X[1]} × ${need(X[0])} gained. Charges balance.` } : { ok: false, why: `Electrons lost (${M[1] * lose(M[0])}) ≠ electrons gained (${X[1] * need(X[0])}). Change the numbers of atoms.` };
  }
  if (s.mode !== "share") return { ok: false, why: "Two non-metals SHARE electrons (covalent bond)." };
  if (s.a === s.b) return s.na === 1 && s.nb === 1 ? { ok: true, type: "cov", why: `${need(s.a)} shared pair(s) — a ${["", "single", "double", "triple"][need(s.a)]} bond.` } : { ok: false, why: "Use one atom of each for a molecule like this." };
  const okc = (s.na === 1 && need(s.a) === s.nb * need(s.b) && need(s.b) <= 3) || (s.nb === 1 && need(s.b) === s.na * need(s.a) && need(s.a) <= 3);
  return okc ? { ok: true, type: "cov", why: "Every atom now has a full outer shell." } : { ok: false, why: `${EL[s.a].n} needs ${need(s.a)} bond(s), ${EL[s.b].n} needs ${need(s.b)}. Change the numbers of atoms.` };
}
function dots(cx, cy, r, n, col, ch, start, span) { let g = ""; for (let i = 0; i < n; i++) { const a = (start || 0) + (span || Math.PI * 2) * (i + 0.5) / n, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r; g += ch === "x" ? `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="${col}">×</text>` : `<circle cx="${x}" cy="${y}" r="4.5" fill="${col}"/>`; } return g; }
function pairAngles(bonds, n) {
  if (!n) return []; if (bonds.length === 1) { const b = bonds[0] + Math.PI; return (n === 1 ? [0] : n === 2 ? [-0.9, 0.9] : [-1.25, 0, 1.25]).map(x => b + x); }
  const a = bonds.map(x => (x + Math.PI * 4) % (Math.PI * 2)).sort((x, y) => x - y), gaps = a.map((x, i) => { const y = i + 1 < a.length ? a[i + 1] : a[0] + Math.PI * 2; return { mid: (x + y) / 2, size: y - x }; }).sort((p, q) => q.size - p.size);
  return gaps.slice(0, n).map(g => g.mid);
}
function pairs(cx, cy, r, angles, col, ch) { return angles.map(a => [-0.16, 0.16].map(d => { const x = cx + Math.cos(a + d) * r, y = cy + Math.sin(a + d) * r; return ch === "x" ? `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="15" font-weight="700" fill="${col}">×</text>` : `<circle cx="${x}" cy="${y}" r="4.5" fill="${col}"/>`; }).join("")).join(""); }
function atom(x, y, sym, n, ch, r) { return `<circle cx="${x}" cy="${y}" r="${r || 44}" fill="#fff" stroke="#b0bec5" stroke-width="2"/>${T(x, y + 8, sym, { s: 24, c: EL[sym].c })}${dots(x, y, r || 44, n, EL[sym].c, ch)}`; }
function render(s) {
  const v = verdict(s), show = s.reveal;
  let g = `<rect width="860" height="450" fill="#effafa"/><rect x="20" y="20" width="580" height="330" rx="16" fill="#fff" stroke="#b2ebf2" stroke-width="2"/>`;
  const atoms = [].concat(Array(s.na).fill(s.a), Array(s.nb).fill(s.b));
  if (!show || !v.ok) {
    const n = atoms.length, w = 540 / n;
    atoms.forEach((e, i) => g += atom(40 + w / 2 + i * w, 185, e, EL[e].v, i < s.na ? "x" : "o", Math.min(44, w * 0.42)));
    g += T(310, 52, show ? "✘ no stable compound" : "separate atoms (outer electrons only)", { s: 14, c: show ? "#c62828" : "#00838f" });
  } else if (v.type === "ionic") {
    const n = atoms.length, w = 540 / n;
    atoms.forEach((e, i) => { const x = 40 + w / 2 + i * w, M = EL[e].m, r = Math.min(46, w * 0.3), q = M ? lose(e) : need(e);
      g += `<path d="M${x - r - 4},${185 - r - 8} h-8 v${2 * r + 16} h8 M${x + r + 4},${185 - r - 8} h8 v${2 * r + 16} h-8" fill="none" stroke="#90a4ae" stroke-width="3"/>`;
      g += M ? `<circle cx="${x}" cy="185" r="${r * 0.7}" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(x, 193, e, { s: 22, c: EL[e].c })}` : `<circle cx="${x}" cy="185" r="${r}" fill="#fff" stroke="#b0bec5" stroke-width="2"/>${T(x, 193, e, { s: 22, c: EL[e].c })}${dots(x, 185, r, EL[e].v, EL[e].c, "o", 0, Math.PI * 2 * EL[e].v / 8)}${dots(x, 185, r, q, "#ef6c00", "x", Math.PI * 2 * EL[e].v / 8, Math.PI * 2 * q / 8)}`;
      g += T(x + r + 16, 185 - r - 4, (M ? q + "+" : q + "−").replace(/^1/, ""), { a: "start", s: 16, c: M ? "#c62828" : "#1565c0" }); });
    g += T(310, 52, "IONIC — electrons transferred (× = electrons gained from the metal)", { s: 14, c: "#00838f" });
  } else {
    const cen = s.na === 1 && s.a !== s.b && (need(s.a) === s.nb * need(s.b)) ? s.a : s.b, other = cen === s.a ? s.b : s.a, k = cen === s.a ? s.nb : s.na, order = s.a === s.b ? need(s.a) : need(other), cx = 310, cy = 195, R = 52, ro = other === "H" ? 40 : 52, D = s.a === s.b ? 86 : other === "H" ? 80 : 88;
    const pos = s.a === s.b ? [[cx + D / 2, cy]] : Array.from({ length: k }, (_, i) => { const a = k === 1 ? 0 : k === 2 ? Math.PI * i : -Math.PI / 2 + Math.PI * 2 * i / k; return [cx + Math.cos(a) * D, cy + Math.sin(a) * D]; });
    const c0 = s.a === s.b ? [cx - D / 2, cy] : [cx, cy];
    g += `<circle cx="${c0[0]}" cy="${c0[1]}" r="${R}" fill="#fff" stroke="#b0bec5" stroke-width="2"/>${pos.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="${ro}" fill="#ffffffaa" stroke="#b0bec5" stroke-width="2"/>`).join("")}`;
    pos.forEach(p => { const L = Math.hypot(p[0] - c0[0], p[1] - c0[1]), f = (L - ro + R) / 2 / L, mx = c0[0] + (p[0] - c0[0]) * f, my = c0[1] + (p[1] - c0[1]) * f, ang = Math.atan2(p[1] - c0[1], p[0] - c0[0]) + Math.PI / 2;
      for (let j = 0; j < order; j++) { const off = (j - (order - 1) / 2) * 11; g += `<circle cx="${mx + Math.cos(ang) * off - Math.cos(ang - Math.PI / 2) * 5}" cy="${my + Math.sin(ang) * off - Math.sin(ang - Math.PI / 2) * 5}" r="4.5" fill="${EL[cen].c}"/><text x="${mx + Math.cos(ang) * off + Math.cos(ang - Math.PI / 2) * 5}" y="${my + Math.sin(ang) * off + Math.sin(ang - Math.PI / 2) * 5 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="${EL[other].c}">×</text>`; }
      const lone = EL[other].v - order; if (lone > 0) { const a0 = Math.atan2(c0[1] - p[1], c0[0] - p[0]); g += pairs(p[0], p[1], ro, pairAngles([a0], lone / 2), EL[other].c, "x"); } });
    const loneC = EL[cen].v - (s.a === s.b ? order : k * order); if (loneC > 0) g += pairs(c0[0], c0[1], R, pairAngles(pos.map(p => Math.atan2(p[1] - c0[1], p[0] - c0[0])), loneC / 2), EL[cen].c, "o");
    g += T(c0[0], c0[1] + 8, cen, { s: 22, c: EL[cen].c }) + pos.map(p => T(p[0], p[1] + 8, other, { s: 20, c: EL[other].c })).join("");
    g += T(310, 52, "COVALENT — shared pairs of electrons in the overlap", { s: 14, c: "#00838f" });
  }
  g += `<g transform="translate(620,20)"><rect width="220" height="330" rx="16" fill="#fff" stroke="#b2ebf2" stroke-width="2"/>${T(110, 30, "COMPOUND", { s: 13, c: "#006064" })}${T(110, 76, show && v.ok ? formula(s) : "?", { s: 32, c: "#004d40" })}
    ${T(110, 116, s.na + " " + EL[s.a].n + " + " + s.nb + " " + EL[s.b].n, { s: 12, c: "#455a64" })}
    ${T(110, 150, EL[s.a].n + ": " + EL[s.a].v + " outer e⁻", { s: 12, c: EL[s.a].c })}${T(110, 170, EL[s.b].n + ": " + EL[s.b].v + " outer e⁻", { s: 12, c: EL[s.b].c })}
    <foreignObject x="14" y="190" width="192" height="130"><div xmlns="http://www.w3.org/1999/xhtml" style="font:13px Nunito,sans-serif;color:${show ? (v.ok ? "#2e7d32" : "#c62828") : "#78909c"};text-align:center">${show ? (v.ok ? "✔ " : "✘ ") + v.why : "Choose the atoms and the bond type, then press ▶"}</div></foreignObject></g>`;
  g += `<rect x="20" y="364" width="820" height="72" rx="14" fill="#fff" stroke="#b2ebf2" stroke-width="2"/>${T(430, 394, "Metals LOSE outer electrons → + ions.  Non-metals GAIN electrons (− ions) or SHARE them.", { s: 14, c: "#006064" })}${T(430, 420, "Goal: every atom ends with a full outer shell (8 electrons; hydrogen 2).", { s: 13, c: "#455a64" })}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const opts = Object.keys(EL).map(v => ({ v, label: `${v} — ${EL[v].n}` }));
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "a", type: "select", label: "Atom A", options: opts, lock: lk("a") },
  { id: "na", type: "range", label: "How many A", min: 1, max: 4, step: 1, nudge: 1, unit: "", lock: lk("na") },
  { id: "b", type: "select", label: "Atom B", options: opts, lock: lk("b") },
  { id: "nb", type: "range", label: "How many B", min: 1, max: 4, step: 1, nudge: 1, unit: "", lock: lk("nb") },
  { id: "mode", type: "choice", label: "Bond", options: [{ v: "transfer", label: "Transfer electrons" }, { v: "share", label: "Share electrons" }], lock: lk("mode") }]; };
const st = o => Object.assign({ a: "Na", na: 1, b: "Cl", nb: 1, mode: "share" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const has = (s, x, nx, y, ny) => (s.a === x && s.na === nx && s.b === y && s.nb === ny) || (s.a === y && s.na === ny && s.b === x && s.nb === nx);
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔗 Bonding challenge", prompt: "Choose the atoms, how many, and the bond — then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Metal + non-metal → TRANSFER (ionic): electrons lost must equal electrons gained. Non-metal + non-metal → SHARE (covalent): each atom needs (8 − outer electrons) bonds; hydrogen needs 1." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("bd-sim", diff, uses, mk);
const target = (lv, goal, x, nx, y, ny, start, wrong) => simQ(lv, goal, st(start), s => { const v = verdict(s); return ok(v.ok && has(s, x, nx, y, ny), formula(s) + ": " + v.why, v.ok ? `You made ${formula(s)} — not the one asked for.` : v.why); }, { a: x, na: nx, b: y, nb: ny, mode: EL[x].m || EL[y].m ? "transfer" : "share" }, { wrong: wrong });
const C = {
  nacl: () => target(1, "Make <b>sodium chloride</b>.", "Na", 1, "Cl", 1, { a: "Na", b: "Cl", mode: "share" }, { a: "Na", na: 1, b: "Cl", nb: 1, mode: "share" }),
  mgo: () => target(1, "Make <b>magnesium oxide</b>.", "Mg", 1, "O", 1, { a: "Na", b: "O" }, { a: "Mg", na: 1, b: "O", nb: 2, mode: "transfer" }),
  mgcl2: () => target(1, "Make <b>magnesium chloride</b>. How many chlorine atoms does one magnesium need?", "Mg", 1, "Cl", 2, { a: "Mg", b: "Cl", mode: "transfer" }, { a: "Mg", na: 1, b: "Cl", nb: 1, mode: "transfer" }),
  na2o: () => target(1, "Make <b>sodium oxide</b>.", "Na", 2, "O", 1, { a: "Na", b: "O", mode: "transfer" }, { a: "Na", na: 1, b: "O", nb: 1, mode: "transfer" }),
  h2o: () => target(2, "Make a molecule of <b>water</b>.", "O", 1, "H", 2, { a: "O", b: "H", mode: "transfer" }, { a: "O", na: 1, b: "H", nb: 1, mode: "share" }),
  co2: () => target(2, "Make <b>carbon dioxide</b> (look for the double bonds).", "C", 1, "O", 2, { a: "C", b: "O" }, { a: "C", na: 1, b: "O", nb: 1, mode: "share" }),
  nh3: () => target(2, "Make <b>ammonia</b> from nitrogen and hydrogen.", "N", 1, "H", 3, { a: "N", b: "H" }, { a: "N", na: 1, b: "H", nb: 2, mode: "share" }),
  n2: () => simQ(2, "Make a molecule with a <b>triple bond</b>.", st({ a: "O", b: "O" }), s => { const v = verdict(s); return ok(v.ok && s.a === s.b && need(s.a) === 3, "N₂: three shared pairs.", v.ok ? `${formula(s)} has a ${["", "single", "double", "triple"][need(s.a)] || "different"} bond.` : v.why); }, { a: "N", b: "N", na: 1, nb: 1, mode: "share" }, { wrong: { a: "O", b: "O", na: 1, nb: 1, mode: "share" } }),
  al2o3: () => target(3, "Make <b>aluminium oxide</b> (it needs more than one of each!).", "Al", 2, "O", 3, { a: "Al", b: "O", mode: "transfer" }, { a: "Al", na: 1, b: "O", nb: 1, mode: "transfer" }),
  alcl3: () => target(3, "Make <b>aluminium chloride</b>.", "Al", 1, "Cl", 3, { a: "Al", b: "Cl" }, { a: "Al", na: 1, b: "Cl", nb: 2, mode: "transfer" }),
  ch4: () => target(3, "Make <b>methane</b> from carbon and hydrogen.", "C", 1, "H", 4, { a: "C", b: "H" }, { a: "C", na: 1, b: "H", nb: 3, mode: "share" }),
  ionic12: () => simQ(3, "Make <b>any ionic compound</b> with a <b>1 : 2</b> ratio of metal to non-metal.", st({ a: "Na", b: "Cl" }), s => { const v = verdict(s); return ok(v.ok && v.type === "ionic" && ((EL[s.a].m && s.na === 1 && s.nb === 2) || (EL[s.b].m && s.nb === 1 && s.na === 2)), formula(s) + ": " + v.why, v.ok ? `${formula(s)} is not a 1 : 2 ionic compound.` : v.why); }, { a: "Mg", na: 1, b: "F", nb: 2, mode: "transfer" }, { wrong: { a: "Na", na: 1, b: "Cl", nb: 1, mode: "transfer" } })
};
const D = {
  type: diff => E.diaT("bd-pick", diff, 2, () => { const cmp = { nacl: ["NaCl", true], h2o: ["H₂O", false], mgo: ["MgO", true], co2: ["CO₂", false], ch4: ["CH₄", false], kf: ["MgF₂", true] }, want = choice([true, false]), keys = E.shuffle(Object.keys(cmp));
    return { kind: "pick", many: true, title: "👆 Ionic or covalent?", prompt: `Click ALL the <b>${want ? "ionic" : "covalent"}</b> compounds.`, answer: keys.filter(k => cmp[k][1] === want), names: Object.fromEntries(keys.map(k => [k, cmp[k][0]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#effafa"/>${keys.map((k, i) => { const x = 20 + (i % 3) * 280, y = 20 + Math.floor(i / 3) * 140; return `<g class="pk" data-k="${k}"><rect x="${x}" y="${y}" width="260" height="120" rx="14" fill="#fff" stroke="#b2ebf2" stroke-width="2"/><rect x="${x}" y="${y}" width="260" height="120" rx="14" fill="none" ${E.ring(s2[k])}/>${T(x + 130, y + 72, cmp[k][0], { s: 36, c: "#004d40" })}</g>`; }).join("")}</svg>`,
      explain: "Metal + non-metal → ionic (NaCl, MgO, MgF₂). Non-metals only → covalent (H₂O, CO₂, CH₄).", summary: "Ionic or covalent" }; }),
  num: diff => E.diaT("bd-num", diff, 2, () => { const c = choice([["Mg", "O"], ["Na", "Cl"], ["Al", "Cl"], ["Al", "O"]]);
    return { kind: "num", title: "🧮 Ion charges", prompt: `${EL[c[0]].n} has <b>${EL[c[0]].v}</b> outer electrons; ${EL[c[1]].n} has <b>${EL[c[1]].v}</b>.`, visual: render(st({ a: c[0], b: c[1], mode: "transfer" })),
      fields: [{ label: `Charge on the ${EL[c[0]].n.toLowerCase()} ion`, unit: "+", answer: lose(c[0]) }, { label: `Electrons each ${EL[c[1]].n.toLowerCase()} atom gains`, unit: "", answer: need(c[1]) }], explain: `${EL[c[0]].n} loses ${lose(c[0])} → ${lose(c[0])}+ ion; ${EL[c[1]].n} gains ${need(c[1])} to reach 8.`, summary: "Ion charges" }; }),
  mcq: diff => E.diaT("bd-mcq", diff, 2, () => { const q = choice([
      { ask: "What holds the ions together in sodium chloride?", ok: "Strong attraction between opposite charges", bad: ["Shared pairs of electrons", "Gravity", "Magnetism"], ex: "Na⁺ and Cl⁻ attract each other — ionic bonding." },
      { ask: "In a covalent bond, the atoms…", ok: "share a pair of electrons", bad: ["transfer electrons completely", "lose all their electrons", "become metals"], ex: "Each shared pair is one covalent bond." },
      { ask: "Why does magnesium form a 2+ ion?", ok: "It loses its 2 outer electrons to get a full shell", bad: ["It gains 2 electrons", "It has 2 protons", "It shares 2 electrons"], ex: "Losing 2 electrons leaves a full inner shell." }]);
    return { kind: "mcq", title: "📘 Bonding ideas", prompt: "Look at the dot-and-cross diagram.", visual: render(st({ reveal: true, mode: "transfer" })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Bonding concepts" }; })
};
const LEVELS = {
  1: { intro: "Metal atoms give electrons to non-metal atoms: IONIC bonding. Balance the electrons!", pool: () => [S(1, 1, C.nacl), S(2, 1, C.mgo), S(2, 1, C.mgcl2), S(3, 1, C.na2o), D.type(1), D.mcq(2), D.type(3)] },
  2: { intro: "Non-metal atoms SHARE pairs of electrons: COVALENT bonding.", pool: () => [S(1, 1, C.h2o), S(2, 1, C.nh3), S(2, 1, C.co2), S(3, 1, C.n2), D.type(1), D.num(2), D.mcq(3)] },
  3: { intro: "Decide the bond type AND the numbers of atoms for harder compounds.", pool: () => [S(1, 1, C.alcl3), S(2, 1, C.ch4), S(3, 1, C.al2o3), S(3, 1, C.ionic12), D.num(1), D.type(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Pick two kinds of atoms, choose how many, and decide whether they transfer or share electrons. Press ▶ to test.",
  state: () => st({ mode: "transfer" }), controls: lv => ctls(lv), render, run, runLabel: "▶ Bond",
  goals: () => [{ txt: "Make an ionic compound", test: (s, m) => m.i }, { txt: "Make a covalent molecule", test: (s, m) => m.c }, { txt: "Try a combination that fails", test: (s, m) => m.f }],
  track: (s, m, ran) => { if (!ran) return; const v = verdict(s); if (v.ok && v.type === "ionic") m.i = 1; if (v.ok && v.type === "cov") m.c = 1; if (!v.ok) m.f = 1; },
  facts: () => "📘 Atoms bond to get a <b>full outer shell</b>. <b>Ionic</b>: metals transfer electrons to non-metals. <b>Covalent</b>: non-metals share pairs of electrons."
});
E.start({ labId: "bonding", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔗", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🔗", "⚛️", "✨", "🧪"],
  exploreDemo: () => [{ set: { a: "Na", b: "Cl", mode: "transfer" }, run: true }, { set: { a: "O", b: "H", nb: 2, mode: "share" }, run: true }, { set: { a: "Na", b: "Mg" }, run: true }] });
})();
