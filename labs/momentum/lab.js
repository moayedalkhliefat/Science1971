"use strict";
// ===== Momentum & Collisions — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const pA = s => s.mA * s.vA, pB = s => s.mB * s.vB, pTot = s => pA(s) + pB(s);
const meet = s => s.vA > s.vB; // A is on the left, B on the right
function after(s) {
  if (!meet(s)) return { a: s.vA, b: s.vB, none: true };
  const M = s.mA + s.mB;
  if (s.type === "stick") { const v = r2(pTot(s) / M); return { a: v, b: v }; }
  return { a: r2(((s.mA - s.mB) * s.vA + 2 * s.mB * s.vB) / M), b: r2(((s.mB - s.mA) * s.vB + 2 * s.mA * s.vA) / M) };
}
const ke = (m, v) => r2(0.5 * m * v * v);
const keB = s => r2(ke(s.mA, s.vA) + ke(s.mB, s.vB)), keA = s => { const o = after(s); return r2(ke(s.mA, o.a) + ke(s.mB, o.b)); };
const sg = v => (v > 0 ? "+" : "") + fmt(v);
function cart(x, y, m, col, label, sticky, side) {
  const w = 46 + m * 14;
  return { w, svg: `<rect x="${x - w / 2}" y="${y - 46}" width="${w}" height="40" rx="8" fill="${col}" stroke="#263238" stroke-width="2"/>${T(x, y - 21, label + " · " + m + " kg", { s: 13, c: "#fff" })}<circle cx="${x - w / 2 + 14}" cy="${y - 4}" r="8" fill="#37474f"/><circle cx="${x + w / 2 - 14}" cy="${y - 4}" r="8" fill="#37474f"/>${sticky ? `<rect x="${side > 0 ? x + w / 2 - 2 : x - w / 2 - 4}" y="${y - 40}" width="6" height="28" fill="#fdd835" stroke="#f57f17"/>` : ""}` };
}
function arrow(x, y, v, col) {
  if (!v) return T(x, y, "at rest", { s: 12, c: "#78909c" });
  const L = 10 + Math.abs(v) * 11, d = Math.sign(v);
  return `<line x1="${x - d * L / 2}" y1="${y}" x2="${x + d * L / 2}" y2="${y}" stroke="${col}" stroke-width="5"/><path d="M${x + d * (L / 2 + 10)},${y} l${-d * 14},-9 v18Z" fill="${col}"/>${T(x, y - 12, sg(v) + " m/s", { s: 13, c: col })}`;
}
function row(y, title, mA, vA, mB, vB, xa, xb, sticky, show, joined) {
  const A = cart(xa, y, mA, "#e53935", "A", sticky, 1), B = cart(xb, y, mB, "#1e88e5", "B", sticky, -1);
  let g = `<rect x="40" y="${y}" width="520" height="8" fill="#90a4ae"/>${T(52, y - 120, title, { a: "start", s: 13, c: "#37474f" })}${A.svg}${B.svg}`;
  if (show && joined) { const xm = (xa + xb) / 2; g += arrow(xm, y - 78, vA, "#6a1b9a") + T(xm, y + 30, "joined: p = " + (mA + mB) + "×" + fmt(vA) + " = " + fmt(r2((mA + mB) * vA)), { s: 12, c: "#6d4c41" }); }
  else if (show) g += arrow(xa, y - 78, vA, "#c62828") + arrow(xb, y - 78, vB, "#1565c0") + T(xa, y + 30, "p = " + mA + "×" + fmt(vA) + " = " + fmt(r2(mA * vA)), { s: 12, c: "#6d4c41" }) + T(xb, y + 30, "p = " + mB + "×" + fmt(vB) + " = " + fmt(r2(mB * vB)), { s: 12, c: "#6d4c41" });
  return g;
}
function render(s) {
  const show = s.reveal, o = after(s), st2 = s.type === "stick";
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += row(170, "BEFORE", s.mA, s.vA, s.mB, s.vB, 160, 420, st2, true);
  g += `<line x1="40" y1="222" x2="560" y2="222" stroke="#eceff1" stroke-width="2"/>`;
  if (show) {
    const wa = 46 + s.mA * 14, wb = 46 + s.mB * 14, gap = st2 ? 0 : 16;
    const xa = o.none ? 160 : 300 - gap - wa / 2, xb = o.none ? 420 : 300 + gap + wb / 2;
    g += row(380, "AFTER" + (o.none ? " — no crash: they never meet!" : ""), s.mA, o.a, s.mB, o.b, xa, xb, st2, true, st2 && !o.none);
  } else g += `${T(52, 260, "AFTER", { a: "start", s: 13, c: "#37474f" })}<rect x="40" y="380" width="520" height="8" fill="#cfd8dc"/>${T(300, 330, "press ▶ to crash the carts", { s: 15, c: "#90a4ae" })}`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 56, st2 ? "🧲 sticky collision" : "🏀 bouncy collision", { s: 13, c: "#546e7a" })}
    ${T(120, 96, "total momentum before", { s: 12, c: "#78909c" })}${T(120, 122, fmt(r2(pTot(s))) + " kg·m/s", { s: 18, c: "#37474f" })}
    ${T(120, 162, "total momentum after", { s: 12, c: "#78909c" })}${T(120, 188, show ? fmt(r2(s.mA * o.a + s.mB * o.b)) + " kg·m/s" : "?", { s: 18, c: "#e65100" })}
    ${show ? T(120, 240, "movement energy (KE)", { s: 12, c: "#78909c" }) + T(120, 264, keB(s) + " J → " + keA(s) + " J", { s: 15, c: "#37474f" }) + T(120, 288, o.none ? "" : keA(s) < keB(s) - 0.01 ? "some energy turned to heat & sound" : "no energy lost", { s: 11, c: "#6d4c41" }) : ""}
    ${T(120, 356, "momentum = mass × velocity", { s: 10, c: "#90a4ae" })}${T(120, 372, "+ means right, − means left", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "mA", type: "choice", label: "Cart A mass", options: [1, 2, 3, 4].map(v => ({ v, label: v + " kg" })), lock: lk("mA") },
  { id: "vA", type: "range", label: "Cart A velocity", min: -6, max: 6, step: 1, nudge: 1, unit: "m/s", lock: lk("vA") },
  { id: "mB", type: "choice", label: "Cart B mass", options: [1, 2, 3, 4].map(v => ({ v, label: v + " kg" })), lock: lk("mB") },
  { id: "vB", type: "range", label: "Cart B velocity", min: -6, max: 6, step: 1, nudge: 1, unit: "m/s", lock: lk("vB") },
  { id: "type", type: "choice", label: "Collision", options: [{ v: "stick", label: "🧲 Sticky" }, { v: "bounce", label: "🏀 Bouncy" }], lock: lk("type") }]; };
const st = o => Object.assign({ mA: 2, vA: 3, mB: 2, vB: 0, type: "stick" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "💥 Crash challenge", prompt: "Set up the carts, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Momentum = mass × velocity (right is +, left is −). The total momentum before a crash equals the total after. Sticky carts move off together at total momentum ÷ total mass." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mo-sim", diff, uses, mk);
const out = s => { const o = after(s); return o.none ? "they never meet" : `A ${sg(o.a)} m/s, B ${sg(o.b)} m/s`; };
const C = {
  p12: () => simQ(1, "Give cart A a momentum of exactly <b>12 kg·m/s</b> to the right.", st({ mA: 1, vA: 2 }), s => ok(pA(s) === 12, `${s.mA} × ${s.vA} = 12 kg·m/s.`, `A has ${fmt(pA(s))} kg·m/s.`), { mA: 3, vA: 4 }, { lock: ["mB", "vB", "type"], wrong: { mA: 3, vA: 3 } }),
  half: () => simQ(1, "A <b>2 kg</b> cart at <b>4 m/s</b> hits a resting cart and they stick. Choose cart B so they move off at <b>2 m/s</b>.", st({ mA: 2, vA: 4, mB: 1 }), s => ok(after(s).a === 2, "8 ÷ (2 + 2) = 2 m/s.", `They move at ${fmt(after(s).a)} m/s.`), { mB: 2 }, { lock: ["mA", "vA", "vB", "type"], wrong: { mB: 3 } }),
  stop: () => simQ(1, "Cart A (2 kg, +3 m/s) meets a 3 kg cart. Give cart B a velocity so they <b>stick and stop dead</b>.", st({ mA: 2, vA: 3, mB: 3, vB: 0 }), s => ok(meet(s) && after(s).a === 0, "B at −2 m/s: +6 + (−6) = 0, so they stop.", `They move at ${fmt(after(s).a)} m/s.`), { vB: -2 }, { lock: ["mA", "vA", "mB", "type"], wrong: { vB: -3 } }),
  equalp: () => simQ(1, "Cart A is 4 kg at +2 m/s. Give the <b>lighter</b> cart B the <b>same momentum</b> as A.", st({ mA: 4, vA: 2, mB: 4, vB: 0 }), s => ok(s.mB < s.mA && pB(s) === pA(s), `${s.mB} × ${s.vB} = 8 kg·m/s — same momentum, less mass, more speed.`, s.mB >= s.mA ? "B must be lighter than A." : `B has ${fmt(pB(s))} kg·m/s.`), { mB: 2, vB: 4 }, { lock: ["mA", "vA", "type"], wrong: { mB: 2, vB: 2 } }),
  swap: () => simQ(2, "Bouncy crash: make cart A <b>stop dead</b> and cart B fly off at <b>+5 m/s</b>.", st({ type: "bounce", mA: 2, vA: 3, mB: 4, vB: 0 }), s => ok(after(s).a === 0 && after(s).b === 5, "Equal masses swap velocities in a bouncy crash.", `After: ${out(s)}.`), { mB: 2, vA: 5 }, { lock: ["mA", "vB", "type"], wrong: { mB: 1, vA: 5 } }),
  recoil: () => simQ(2, "Bouncy crash: cart A hits the resting cart B. Make <b>A bounce backwards</b>.", st({ type: "bounce", mA: 3, vA: 4, mB: 2, vB: 0 }), s => ok(meet(s) && after(s).a < 0, "A light cart bounces back off a heavier one.", `After: ${out(s)}.`), { mA: 1, mB: 4 }, { lock: ["vA", "vB", "type"], wrong: { mA: 3, mB: 2 } }),
  follow: () => simQ(2, "Bouncy crash: make cart A <b>keep moving forward</b> after it hits the resting cart B.", st({ type: "bounce", mA: 1, vA: 4, mB: 3, vB: 0 }), s => ok(meet(s) && after(s).a > 0, "A heavy cart keeps going after hitting a lighter one.", `After: ${out(s)}.`), { mA: 4, mB: 1 }, { lock: ["vA", "vB", "type"], wrong: { mA: 2, mB: 2 } }),
  headon: () => simQ(2, "Two <b>2 kg</b> carts bounce head-on. Make them both bounce back at <b>3 m/s</b>.", st({ type: "bounce", mA: 2, mB: 2, vA: 1, vB: 0 }), s => ok(after(s).a === -3 && after(s).b === 3, "+3 and −3 m/s: they swap velocities.", `After: ${out(s)}.`), { vA: 3, vB: -3 }, { lock: ["mA", "mB", "type"], wrong: { vA: 3, vB: -2 } }),
  left1: () => simQ(3, "Sticky crash: make the joined carts move <b>left at 1 m/s</b> (−1 m/s).", st({ mA: 2, vA: 2, mB: 2, vB: 0 }), s => ok(meet(s) && after(s).a === -1, "e.g. 2 kg at +2 and 2 kg at −4: (4 − 8) ÷ 4 = −1 m/s.", `After: ${out(s)}.`), { vB: -4 }, { lock: ["type"], wrong: { vB: -3 } }),
  keep: () => simQ(3, "Choose the collision that keeps <b>all</b> the movement energy (no energy turned to heat).", st({ mA: 3, vA: 4, mB: 1, vB: -2 }), s => ok(s.type === "bounce" && keA(s) === keB(s), "A perfectly bouncy collision keeps all the kinetic energy.", "Sticky crashes always waste some energy."), { type: "bounce" }, { lock: ["mA", "vA", "mB", "vB"], wrong: { type: "stick" } }),
  fly6: () => simQ(3, "Bouncy crash: B is at rest. Make B fly off at <b>+6 m/s</b>.", st({ type: "bounce", mA: 1, vA: 2, mB: 1, vB: 0 }), s => ok(after(s).b === 6, `B leaves at 6 m/s.`, `After: ${out(s)}.`), { mA: 1, mB: 1, vA: 6 }, { lock: ["vB", "type"], wrong: { mA: 1, mB: 1, vA: 5 } }),
  cancel: () => simQ(3, "Sticky crash: a 3 kg cart at +4 m/s meets cart B head-on. Make the joined carts <b>stop</b>.", st({ mA: 3, vA: 4, mB: 2, vB: -2 }), s => ok(meet(s) && after(s).a === 0, "2 kg at −6 m/s: +12 − 12 = 0.", `After: ${out(s)}.`), { vB: -6 }, { lock: ["mA", "vA", "type"], wrong: { vB: -5 } })
};
const D = {
  pick: diff => E.diaT("mo-pick", diff, 2, () => {
    const pool = E.shuffle([[1, 6], [2, 3], [3, 2], [2, 2], [4, 1], [1, 4], [3, 3], [4, 2]]).slice(0, 4), want = diff === 1 ? "max" : "eq";
    const ps = pool.map(c => c[0] * c[1]); let target;
    if (want === "eq") { const cnt = {}; ps.forEach(p => cnt[p] = (cnt[p] || 0) + 1); target = +Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || b - a)[0]; }
    else target = Math.max(...ps);
    const ans = pool.map((c, i) => ps[i] === target ? "c" + i : null).filter(Boolean);
    return { kind: "pick", many: ans.length > 1 || want === "eq", title: "👆 Momentum spotter", prompt: want === "max" ? "Click the cart with the <b>most momentum</b>" + (ans.length > 1 ? " (there may be more than one)" : "") + "." : `Click <b>every</b> cart with a momentum of <b>${target} kg·m/s</b>.`, answer: ans, names: Object.fromEntries(pool.map((c, i) => ["c" + i, c[0] + " kg at " + c[1] + " m/s"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((c, i) => { const x = 113 + i * 212, k = cart(x, 200, c[0], ["#e53935", "#1e88e5", "#43a047", "#8e24aa"][i], "ABCD"[i]); return `<g class="pk" data-k="c${i}"><rect x="${x - 98}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${arrow(x, 110, c[1], "#37474f")}${k.svg}<rect x="${x - 90}" y="200" width="180" height="6" fill="#90a4ae"/><rect x="${x - 98}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["c" + i])}/></g>`; }).join("")}</svg>`,
      explain: "Momentum = mass × velocity: " + pool.map(c => `${c[0]}×${c[1]}=${c[0] * c[1]}`).join(", ") + ".", summary: "Comparing momentum" };
  }),
  num: diff => E.diaT("mo-num", diff, 2, () => {
    if (diff === 1) { const c = choice([[3, 4], [2, 5], [4, 3], [1, 6]]);
      return { kind: "num", title: "🧮 Momentum maths", prompt: `Cart A has a mass of <b>${c[0]} kg</b> and moves at <b>${c[1]} m/s</b>.`, visual: render(st({ mA: c[0], vA: c[1] })), fields: [{ label: "Momentum", unit: "kg·m/s", answer: c[0] * c[1] }], explain: `${c[0]} × ${c[1]} = ${c[0] * c[1]} kg·m/s.`, summary: "p = m × v" }; }
    const c = diff === 2 ? choice([[2, 6, 1, 0], [3, 4, 3, 0], [4, 3, 2, 0], [1, 6, 2, 0]]) : choice([[3, 4, 1, -2], [2, 5, 3, 0], [4, 2, 2, -1], [2, 6, 2, -2]]), s = st({ mA: c[0], vA: c[1], mB: c[2], vB: c[3] });
    return { kind: "num", title: "🧮 Sticky crash", prompt: `A <b>${c[0]} kg</b> cart at <b>${c[1]} m/s</b> hits a <b>${c[2]} kg</b> cart moving at <b>${c[3]} m/s</b>. They stick together.`, visual: render(s),
      fields: [{ label: "Total momentum", unit: "kg·m/s", answer: pTot(s) }, { label: "Velocity after", unit: "m/s", answer: r2(pTot(s) / (c[0] + c[2])) }], explain: `${c[0]}×${c[1]} + ${c[2]}×${c[3]} = ${pTot(s)}; ÷ ${c[0] + c[2]} kg = ${fmt(r2(pTot(s) / (c[0] + c[2])))} m/s.`, summary: "Conservation of momentum" };
  }),
  mcq: diff => E.diaT("mo-mcq", diff, 2, () => { const q = choice([
      { ask: "In any collision with no outside forces, what stays the same?", ok: "The total momentum", bad: ["Each cart's speed", "The total kinetic energy, always", "Each cart's momentum"], ex: "Total momentum is conserved; kinetic energy only in perfectly bouncy collisions." },
      { ask: "Why does a gun recoil backwards when it fires?", ok: "The bullet gets forward momentum, so the gun gets equal backward momentum", bad: ["The bullet is heavier than the gun", "Air pushes the gun", "Momentum is lost"], ex: "Total momentum before was zero, so it must still be zero after." },
      { ask: "A truck and a bike move at the same speed. Which has more momentum?", ok: "The truck, because it has more mass", bad: ["The bike", "They are equal", "Neither has momentum"], ex: "p = m × v — more mass, more momentum." },
      { ask: "Crumple zones in cars make a crash safer because they…", ok: "make the car stop over a longer time, so the force is smaller", bad: ["remove all the momentum", "make the car heavier", "bounce the car backwards"], ex: "The same change in momentum over a longer time needs a smaller force." }]);
    return { kind: "mcq", title: "📘 Momentum ideas", prompt: "Think about mass, velocity and collisions.", visual: render(st({ mA: 3, vA: 4, mB: 1, vB: -2, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Momentum concepts" }; })
};
const LEVELS = {
  1: { intro: "Momentum = mass × velocity. In a sticky crash the carts share the total momentum.", pool: () => [S(1, 1, C.p12), S(2, 1, C.half), S(2, 1, C.equalp), S(3, 1, C.stop), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Bouncy crashes: momentum is still conserved — and here no energy is lost.", pool: () => [S(1, 1, C.swap), S(2, 1, C.recoil), S(2, 1, C.follow), S(3, 1, C.headon), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Design crashes: use conservation of momentum to plan exactly what happens.", pool: () => [S(1, 1, C.keep), S(2, 1, C.left1), S(3, 1, C.fly6), S(3, 1, C.cancel), D.num(3), D.pick(2), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Set the masses, velocities and the type of crash, then press ▶ to crash the carts.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Crash",
  goals: () => [{ txt: "Make the carts stick and stop", test: (s, m) => m.z }, { txt: "Make a cart bounce backwards", test: (s, m) => m.b }, { txt: "Try both kinds of crash", test: (s, m) => (m.t || []).length >= 2 }],
  track: (s, m, ran) => { if (!ran) return; const o = after(s); if (!o.none && s.type === "stick" && o.a === 0) m.z = 1; if (!o.none && s.type === "bounce" && (o.a < 0 && s.vA > 0)) m.b = 1; m.t = Array.from(new Set((m.t || []).concat(s.type))); },
  facts: () => "📘 <b>Momentum</b> = mass × velocity. In every collision the <b>total momentum</b> before equals the total after."
});
E.start({ labId: "momentum", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🎱", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🎱", "🛒", "💥", "✨"],
  exploreDemo: () => [{ set: { type: "stick", mA: 2, vA: 3, mB: 3, vB: -2 }, run: true }, { set: { type: "bounce", mA: 1, vA: 4, mB: 4, vB: 0 }, run: true }] });
})();
