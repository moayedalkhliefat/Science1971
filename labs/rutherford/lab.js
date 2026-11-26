"use strict";
// ===== Rutherford Scattering — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r1 = x => Math.round(x * 10) / 10;
const FOIL = { Au: { name: "Gold", Z: 79 }, Ag: { name: "Silver", Z: 47 }, Al: { name: "Aluminium", Z: 13 } };
const dHead = s => r1(2.88 * FOIL[s.foil].Z / s.K); // closest approach head-on (fm)
const theta = s => s.model === "plum" ? 0.02 : s.b === 0 ? 180 : r1(2 * Math.atan(dHead(s) / (2 * s.b)) * 180 / Math.PI);
const rmin = s => { if (s.model === "plum") return null; const d = dHead(s); return r1(d / 2 + Math.sqrt(d * d / 4 + s.b * s.b)); };
const back = s => theta(s) > 90;
function path(s) { // numerical Coulomb trajectory, units of fm, v0 = 1
  if (s.model === "plum") return [[-700, s.b], [700, s.b]];
  const d = dHead(s), k = d / 2; let x = -700, y = s.b, vx = 1, vy = 0; const pts = [[x, y]];
  for (let i = 0; i < 40000; i++) { const r = Math.hypot(x, y), dt = Math.max(0.05, Math.min(4, r / 60)); const a = k / (r * r); vx += a * x / r * dt; vy += a * y / r * dt; x += vx * dt; y += vy * dt; if (i % 6 === 0) pts.push([x, y]); if (Math.hypot(x, y) > 760 && i > 50) break; }
  pts.push([x, y]); return pts;
}
function render(s) {
  const show = s.reveal, cx = 300, cy = 225, k = 0.3, P = ([x, y]) => [cx + x * k, cy - y * k];
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#0d1b3e"/><clipPath id="rc"><rect x="22" y="22" width="556" height="406" rx="14"/></clipPath><g clip-path="url(#rc)">`;
  if (s.model === "plum") { g += `<circle cx="${cx}" cy="${cy}" r="150" fill="#ef9a9a" opacity=".35" stroke="#e57373"/>`; for (let i = 0; i < 14; i++) { const a = i * 2.4, r = 30 + (i * 37) % 110; g += `<circle cx="${cx + r * Math.cos(a)}" cy="${cy + r * Math.sin(a)}" r="6" fill="#42a5f5"/>${T(cx + r * Math.cos(a), cy + r * Math.sin(a) + 3, "−", { s: 9, c: "#fff" })}`; } g += T(cx, cy + 172, "plum-pudding atom: spread-out positive charge", { s: 11, c: "#ffcdd2" }); }
  else { g += `<circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="#90caf9" stroke-dasharray="3 6" opacity=".4"/><circle cx="${cx}" cy="${cy}" r="9" fill="#ffca28" stroke="#fff"/>${T(cx, cy + 4, "+", { s: 11, c: "#5d4037" })}${T(cx, cy + 172, FOIL[s.foil].name + " nucleus (+" + FOIL[s.foil].Z + "), not to scale", { s: 11, c: "#fff59d" })}`; }
  // aiming line & gun
  const [gx, gy] = P([-700, s.b]); g += `<rect x="24" y="${gy - 10}" width="40" height="20" rx="4" fill="#78909c"/>${T(44, gy - 16, "α source", { s: 10, c: "#cfd8dc" })}<line x1="64" y1="${gy}" x2="${cx}" y2="${gy}" stroke="#90a4ae" stroke-dasharray="4 6" opacity=".5"/>`;
  if (s.b > 0) g += `<line x1="${cx + 170}" y1="${cy}" x2="${cx + 170}" y2="${gy}" stroke="#80cbc4" stroke-width="1.5"/>${T(cx + 176, (cy + gy) / 2 + 4, "b = " + s.b + " fm", { a: "start", s: 11, c: "#80cbc4" })}`;
  if (show) { const pts = path(s).map(P); g += `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="#ff7043" stroke-width="3"/>`; const L = pts[pts.length - 1]; g += `<circle cx="${L[0]}" cy="${L[1]}" r="6" fill="#ff7043"/>`; }
  else g += `<circle cx="${gx + 52}" cy="${gy}" r="6" fill="#ff7043"/>` + T(cx, 60, "press ▶ to fire the alpha particle", { s: 13, c: "#bbdefb" });
  g += `</g>`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 56, (s.model === "plum" ? "plum-pudding model" : "nuclear model") + " · " + FOIL[s.foil].name, { s: 11, c: "#546e7a" })}${T(120, 74, "α energy " + s.K + " MeV · aim b = " + s.b + " fm", { s: 11, c: "#546e7a" })}
    ${show ? T(120, 112, "deflection angle", { s: 12, c: "#78909c" }) + T(120, 144, fmt(theta(s)) + "°", { s: 26, c: "#e65100" }) + T(120, 170, back(s) ? "bounced back! ↩" : theta(s) < 1 ? "went almost straight through" : "deflected", { s: 13, c: back(s) ? "#c62828" : "#37474f" }) + (s.model === "nuclear" ? T(120, 210, "head-on closest approach: " + fmt(dHead(s)) + " fm", { s: 11, c: "#37474f" }) + T(120, 232, "this path's closest approach: " + fmt(rmin(s)) + " fm", { s: 11, c: "#37474f" }) + (dHead(s) < 5 ? T(120, 256, "it reaches the nucleus surface!", { s: 12, c: "#c62828" }) : "") : "") : T(120, 170, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 314, "head-on closest approach", { s: 11, c: "#546e7a" })}${T(120, 332, "d = 2.88 × Z ÷ K  (fm)", { s: 12, c: "#37474f" })}${T(120, 356, "angle: tan(θ/2) = d ÷ (2b)", { s: 12, c: "#37474f" })}${T(120, 380, "1 fm = 10⁻¹⁵ m; a nucleus ≈ 5–15 fm", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "model", type: "choice", label: "Model of the atom", options: [{ v: "plum", label: "Plum pudding" }, { v: "nuclear", label: "Nuclear (Rutherford)" }], lock: lk("model") },
  { id: "b", type: "range", label: "Aim (distance from centre)", min: 0, max: 500, step: 5, nudge: 5, unit: "fm", lock: lk("b") },
  { id: "K", type: "range", label: "Alpha energy", min: 2, max: 10, step: 1, nudge: 1, unit: "MeV", hide: () => lv < 2, lock: lk("K") },
  { id: "foil", type: "choice", label: "Foil", options: Object.keys(FOIL).map(v => ({ v, label: FOIL[v].name })), hide: () => lv < 3, lock: lk("foil") }]; };
const st = o => Object.assign({ model: "nuclear", b: 100, K: 5, foil: "Au" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `Deflected ${fmt(theta(s))}°${back(s) ? " — bounced back" : ""}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🎯 Scattering challenge", prompt: "Aim and fire, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "In the nuclear model a tiny, positive nucleus repels the alpha particle: the closer you aim (smaller b), the bigger the deflection. Head-on (b = 0) it bounces straight back. A faster alpha or a smaller charge Z gives less deflection. tan(θ/2) = d ÷ (2b), with d = 2.88 Z ÷ K fm." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ru-sim", diff, uses, mk);
const C = {
  backHit: () => simQ(1, "Make the alpha particle <b>bounce straight back</b> off the nucleus.", st({ b: 200 }), s => ok(theta(s) === 180, "Aimed head-on (b = 0): it stops and comes straight back.", said(s)), { b: 0 }, { lock: ["model"], wrong: { b: 5 } }),
  plum: () => simQ(1, "Choose the model where alpha particles go <b>almost straight through</b> however you aim.", st({ model: "nuclear", b: 0 }), s => ok(s.model === "plum" && s.b <= 50, "In the plum-pudding model the positive charge is spread out, so it can't push hard.", s.model !== "plum" ? said(s) : "Aim near the centre to prove it."), { model: "plum", b: 0 }, { wrong: { model: "nuclear", b: 0 } }),
  ninety: () => simQ(1, "Deflect the alpha particle through about <b>90°</b> (80°–100°).", st({ b: 100 }), s => ok(theta(s) >= 80 && theta(s) <= 100, `${fmt(theta(s))}° — aim about 20–25 fm from the centre.`, said(s)), { b: 20 }, { lock: ["model"], wrong: { b: 50 } }),
  tiny: () => simQ(1, "Aim so the alpha particle is deflected by <b>less than 10°</b>.", st({ b: 30 }), s => ok(theta(s) < 10, "Far from the nucleus the push is weak.", said(s)), { b: 300 }, { lock: ["model"], wrong: { b: 200 } }),
  fast90: () => simQ(2, "A fast <b>10 MeV</b> alpha: aim so it is still deflected <b>more than 90°</b>.", st({ K: 10, b: 60 }), s => ok(theta(s) > 90, `${fmt(theta(s))}° — fast alphas must aim very close (b < 11 fm).`, said(s)), { b: 10 }, { lock: ["model", "K"], wrong: { b: 15 } }),
  sixty: () => simQ(2, "With a <b>5 MeV</b> alpha, make the deflection about <b>60°</b> (55°–65°).", st({ K: 5, b: 100 }), s => ok(theta(s) >= 55 && theta(s) <= 65, `${fmt(theta(s))}°.`, said(s)), { b: 40 }, { lock: ["model", "K"], wrong: { b: 60 } }),
  close30: () => simQ(2, "Fire head-on and get <b>closer than 30 fm</b> to the gold nucleus.", st({ b: 0, K: 3 }), s => ok(s.b === 0 && dHead(s) < 30, `${s.K} MeV: closest approach ${fmt(dHead(s))} fm.`, s.b ? "Fire head-on (b = 0)." : `${fmt(dHead(s))} fm — give it more energy.`), { K: 8 }, { lock: ["model", "b"], wrong: { K: 7 } }),
  slow: () => simQ(2, "Aim at <b>100 fm</b>. Choose the alpha energy that gives the <b>biggest</b> deflection.", st({ b: 100, K: 6 }), s => ok(s.K === 2, "The slowest alpha (2 MeV) is pushed off course most.", `${fmt(theta(s))}° — another energy deflects more.`), { K: 2 }, { lock: ["model", "b"], wrong: { K: 3 } }),
  al: () => simQ(3, "Aim at <b>50 fm</b> with a 5 MeV alpha. Choose the foil that scatters it <b>most</b>.", st({ foil: "Al", b: 50 }), s => ok(s.foil === "Au", "Gold has the most protons (79), so the biggest push.", `${FOIL[s.foil].name}: ${fmt(theta(s))}°.`), { foil: "Au" }, { lock: ["model", "b", "K"], wrong: { foil: "Ag" } }),
  touch: () => simQ(3, "Make the alpha reach the <b>surface of the nucleus</b>: head-on closest approach <b>under 5 fm</b>.", st({ foil: "Au", K: 5, b: 0 }), s => ok(s.b === 0 && dHead(s) < 5, `${FOIL[s.foil].name}, ${s.K} MeV: ${fmt(dHead(s))} fm — here Rutherford's simple formula stops working!`, `${fmt(dHead(s))} fm.`), { foil: "Al", K: 8 }, { lock: ["model", "b"], wrong: { foil: "Al", K: 7 } }),
  alBack: () => simQ(3, "Make a <b>2 MeV</b> alpha bounce back (more than 90°) off <b>aluminium</b> without aiming head-on.", st({ foil: "Al", K: 2, b: 40 }), s => ok(theta(s) > 90 && s.b > 0, `${fmt(theta(s))}° at b = ${s.b} fm.`, s.b === 0 ? "Don't aim head-on." : said(s)), { b: 5 }, { lock: ["model", "foil", "K"], wrong: { b: 10 } }),
  ag30: () => simQ(3, "Silver foil, <b>6 MeV</b> alpha: deflect it by about <b>30°</b> (25°–35°).", st({ foil: "Ag", K: 6, b: 100 }), s => ok(theta(s) >= 25 && theta(s) <= 35, `${fmt(theta(s))}°.`, said(s)), { b: 40 }, { lock: ["model", "foil", "K"], wrong: { b: 70 } })
};
const D = {
  pick: diff => E.diaT("ru-pick", diff, 2, () => {
    const bs = E.shuffle([0, 40, 100, 200]), want = choice(["most", "least"]), sel = want === "most" ? Math.min(...bs) : Math.max(...bs);
    return { kind: "pick", title: "👆 Which path?", prompt: `Four alpha particles are fired at a gold nucleus. Click the one that is deflected the <b>${want}</b>.`, answer: ["b" + sel], names: Object.fromEntries(bs.map(b => ["b" + b, "path"])),
      visual: s2 => { const cx = 560, cy = 190, k = 0.45; let g = `<rect width="860" height="300" fill="#0d1b3e"/><clipPath id="rpc"><rect width="860" height="300"/></clipPath><circle cx="${cx}" cy="${cy}" r="8" fill="#ffca28"/>`; bs.forEach((b, i) => { const pts = path(st({ b, K: 5 })).map(([x, y]) => [cx + x * k, cy - y * k]); const col = ["#ff7043", "#4fc3f7", "#aed581", "#ce93d8"][i], st0 = pts[0]; const lx = st0[0] - 30 - i * 40; g += `<g class="pk" data-k="b${b}"><line x1="${lx}" y1="${st0[1]}" x2="${st0[0]}" y2="${st0[1]}" stroke="${col}" stroke-width="2" stroke-dasharray="3 4"/><g clip-path="url(#rpc)"><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="transparent" stroke-width="16"/><polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="3"/></g><circle cx="${lx}" cy="${st0[1]}" r="14" fill="#fff" stroke="${col}" stroke-width="3"/>${T(lx, st0[1] + 5, "ABCD"[i], { s: 13, c: "#37474f" })}<circle cx="${lx}" cy="${st0[1]}" r="20" fill="none" ${E.ring(s2["b" + b])}/></g>`; }); return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}</svg>`; },
      explain: "The closer the aim to the nucleus, the bigger the deflection; a head-on alpha bounces straight back.", summary: "Aim and deflection" };
  }),
  num: diff => E.diaT("ru-num", diff, 2, () => {
    if (diff === 1) { const c = choice([["Au", 5], ["Au", 8], ["Ag", 4], ["Al", 2]]);
      return { kind: "num", title: "🧮 Closest approach", prompt: `A <b>${c[1]} MeV</b> alpha is fired head-on at a <b>${FOIL[c[0]].name.toLowerCase()}</b> nucleus (Z = ${FOIL[c[0]].Z}). d = 2.88 × Z ÷ K.`, visual: render(st({ foil: c[0], K: c[1], b: 0 })), fields: [{ label: "Closest approach", unit: "fm", answer: r1(2.88 * FOIL[c[0]].Z / c[1]), tol: 0.2 }], explain: `2.88 × ${FOIL[c[0]].Z} ÷ ${c[1]} = ${fmt(r1(2.88 * FOIL[c[0]].Z / c[1]))} fm.`, summary: "Closest approach" }; }
    if (diff === 2) { const c = choice([[45.5, 22.75], [45.5, 45.5], [45.5, 91], [22.75, 11.4]]);
      return { kind: "num", title: "🧮 Scattering angle", prompt: `d = <b>${c[0]} fm</b>, aim b = <b>${c[1]} fm</b>. Use θ = 2 × tan⁻¹(d ÷ 2b).`, visual: render(st({ b: Math.round(c[1] / 5) * 5 })), fields: [{ label: "θ", unit: "°", answer: r1(2 * Math.atan(c[0] / (2 * c[1])) * 180 / Math.PI), tol: 1 }], explain: `2 × tan⁻¹(${c[0]} ÷ ${2 * c[1]}) = ${fmt(r1(2 * Math.atan(c[0] / (2 * c[1])) * 180 / Math.PI))}°.`, summary: "Rutherford angle" }; }
    const f = choice([2, 4, 0.5]);
    return { kind: "num", title: "🧮 Energy and approach", prompt: `If the alpha's energy is multiplied by <b>${f}</b>, by what factor does the head-on closest approach change?`, visual: render(st({ b: 0 })), fields: [{ label: "Factor", unit: "×", answer: 1 / f }], explain: `d ∝ 1/K → × ${fmt(1 / f)}.`, summary: "d ∝ 1/K" };
  }),
  mcq: diff => E.diaT("ru-mcq", diff, 2, () => { const q = choice([
      { ask: "Most alpha particles went straight through the gold foil. This showed that…", ok: "the atom is mostly empty space", bad: ["the atom is solid", "gold has no electrons", "alpha particles have no charge"], ex: "Only a tiny fraction came close to a nucleus." },
      { ask: "A few alpha particles bounced back. This showed that…", ok: "the positive charge and mass are packed into a tiny nucleus", bad: ["the electrons are very heavy", "the foil was too thick", "positive charge is spread out"], ex: "Only a tiny, dense nucleus can push hard enough." },
      { ask: "Why are alpha particles repelled by the nucleus?", ok: "Both are positively charged", bad: ["Both are negative", "Gravity pushes them apart", "The nucleus is magnetic"], ex: "Like charges repel (Coulomb's law)." },
      { ask: "Which model did Rutherford's experiment replace?", ok: "Thomson's plum-pudding model", bad: ["Bohr's model", "The quantum model", "Dalton's model"], ex: "Plum pudding could not explain the large deflections." }]);
    return { kind: "mcq", title: "📘 Gold-foil ideas", prompt: "Think about what the results tell us about the atom.", visual: render(st({ b: 20, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Rutherford's experiment" }; })
};
const LEVELS = {
  1: { intro: "Fire alpha particles at an atom. In the nuclear model a tiny positive nucleus can turn them right round.", pool: () => [S(1, 1, C.backHit), S(2, 1, C.plum), S(2, 1, C.tiny), S(3, 1, C.ninety), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "The alpha's energy matters: faster alphas are harder to turn and get closer to the nucleus.", pool: () => [S(1, 1, C.slow), S(2, 1, C.close30), S(2, 1, C.fast90), S(3, 1, C.sixty), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Different foils have different nuclear charges. Use them to probe the size of the nucleus.", pool: () => [S(1, 1, C.al), S(2, 1, C.ag30), S(3, 1, C.alBack), S(3, 1, C.touch), D.num(3), D.num(1), D.pick(3)] }
};
const explore = E.exploreSim({
  intro: "Pick a model of the atom, aim the alpha particle and set its energy. Press ▶ to fire.",
  state: () => st(), controls: () => ctls(3), render, run, runLabel: "▶ Fire",
  goals: () => [{ txt: "Bounce an alpha straight back", test: (s, m) => m.b }, { txt: "Try the plum-pudding model", test: (s, m) => m.p }, { txt: "Deflect an alpha by less than 10°", test: (s, m) => m.t }],
  track: (s, m, ran) => { if (!ran) return; if (back(s) && s.model === "nuclear") m.b = 1; if (s.model === "plum") m.p = 1; if (theta(s) < 10) m.t = 1; },
  facts: () => "📘 In 1909 Geiger and Marsden fired alpha particles at gold foil. Rutherford explained the results with a tiny <b>nucleus</b>."
});
E.start({ labId: "rutherford", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🎯", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚛️", "🎯", "✨", "💫"],
  exploreDemo: () => [{ set: { model: "nuclear", b: 0 }, run: true }, { set: { model: "plum", b: 0 }, run: true }] });
})();
