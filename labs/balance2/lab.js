"use strict";
// ===== Balancing Act (moments) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const MASSES = [5, 10, 15, 20, 30];
const leftM = s => s.left.reduce((a, o) => a + o.m * o.d, 0);
const rightM = s => s.r1m * s.r1d + (s.two ? s.r2m * s.r2d : 0) + (s.ldm ? 0 : 0);
const lmom = s => leftM(s) + (s.lbm ? s.lbm * s.lbd : 0);
const net = s => Math.round((rightM(s) - lmom(s)) * 1000) / 1000;
const tip = s => net(s) > 0 ? "right" : net(s) < 0 ? "left" : "balanced";
function obj(x, y, m, label, col, mystery) { const h = 22 + m * 1.4, w = 30 + m * 0.8; return `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" rx="4" fill="${col}" stroke="#37474f" stroke-width="2"/>${T(x, y - h / 2 + 5, mystery ? "?" : m + " kg", { s: mystery ? 20 : 12, c: "#fff" })}${label ? T(x, y - h - 8, label, { s: 11, c: "#37474f" }) : ""}`; }
function render(s) {
  const show = s.reveal || s.showVals, ang = s._a != null ? s._a : (s.reveal ? (tip(s) === "right" ? 10 : tip(s) === "left" ? -10 : 0) : 0), cx = 330, cy = 300, sc = 120;
  let marks = ""; for (let d = -2; d <= 2.001; d += 0.25) marks += `<line x1="${cx + d * sc}" x2="${cx + d * sc}" y1="-4" y2="${Math.abs(d * 4) % 2 === 0 ? 10 : 6}" stroke="#fff" stroke-width="2"/>${Math.abs(d * 2) % 1 === 0 && d !== 0 ? T(cx + d * sc, 34, Math.abs(d) + " m", { s: 13, c: "#263238" }) : ""}`;
  let items = s.left.map(o => obj(cx - o.d * sc, -6, o.m, "", o.mystery ? "#6a1b9a" : "#8d6e63", o.mystery && !show)).join("");
  if (s.r1m) items += obj(cx + s.r1d * sc, -6, s.r1m, "", "#1565c0");
  if (s.two && s.r2m) items += obj(cx + s.r2d * sc, -6, s.r2m, "", "#00897b");
  const sup = s.reveal ? "" : `<rect x="${cx - 2.1 * sc}" y="${cy + 8}" width="24" height="${400 - cy - 8}" fill="#bcaaa4"/><rect x="${cx + 2.1 * sc - 24}" y="${cy + 8}" width="24" height="${400 - cy - 8}" fill="#bcaaa4"/>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#e8f1fb"/><rect y="400" width="860" height="50" fill="#a5d6a7"/>
    <polygon points="${cx},${cy + 8} ${cx - 40},400 ${cx + 40},400" fill="#6d4c41"/>${sup}
    <g transform="translate(0,${cy}) rotate(${ang} ${cx} 0)"><rect x="${cx - 2.15 * sc}" y="0" width="${4.3 * sc}" height="16" rx="4" fill="#455a64"/><g transform="translate(0,2)">${marks}</g>${items}</g>
    ${s.hideMom ? "" : `<g transform="translate(620,30)"><rect width="225" height="${show ? 160 : 100}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(112, 26, "MOMENTS (mass × distance)", { s: 12, c: "#0d47a1" })}
      ${T(112, 54, "left: " + (show ? fmt(lmom(s)) : s.left.some(o => o.mystery) ? "?" : fmt(lmom(s))) + " kg·m", { s: 15, c: "#6d4c41" })}${T(112, 80, "right: " + fmt(rightM(s)) + " kg·m", { s: 15, c: "#1565c0" })}
      ${show ? T(112, 114, tip(s) === "balanced" ? "⚖️ BALANCED" : "tips to the " + tip(s).toUpperCase(), { s: 17, c: tip(s) === "balanced" ? "#2e7d32" : "#c62828" }) + (s.left.some(o => o.mystery) ? T(112, 142, "mystery mass = " + s.left.find(o => o.mystery).m + " kg", { s: 13, c: "#6a1b9a" }) : "") : ""}</g>`}
    ${s.reveal ? "" : T(cx, 436, "the supports hold the plank level — press ▶ to remove them", { s: 12, c: "#33691e" })}</svg>`;
}
const POS = Array.from({ length: 8 }, (_, i) => (i + 1) * 0.25).map(v => ({ v, label: v + " m" }));
const ctls = (lv, o) => { o = o || {}; const lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "r1m", type: "choice", label: "Blue brick mass", options: MASSES.map(v => ({ v, label: v + " kg" })), lock: lk("r1m") },
  { id: "r1d", type: "select", label: "Blue brick distance from pivot", options: POS, lock: lk("r1d") },
  { id: "r2m", type: "choice", label: "Green brick mass", options: MASSES.map(v => ({ v, label: v + " kg" })), hide: () => !o.two, lock: lk("r2m") },
  { id: "r2d", type: "select", label: "Green brick distance", options: POS, hide: () => !o.two, lock: lk("r2d") }]; };
const st = (left, o) => Object.assign({ left, r1m: 10, r1d: 0.5, r2m: 5, r2d: 0.25, two: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; const t0 = performance.now(), end = tip(s) === "right" ? 10 : tip(s) === "left" ? -10 : 0;
  const f = now => { const k = Math.min(1, (now - t0) / 700); s._a = end * k * k; box.innerHTML = render(s); if (k < 1) requestAnimationFrame(f); else { s._a = null; res(); } }; requestAnimationFrame(f); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `Left ${fmt(lmom(s))} kg·m, right ${fmt(rightM(s))} kg·m → ${tip(s) === "balanced" ? "balanced" : "tips " + tip(s)}`;
const simQ = (goal, s0, check, sol, o) => ({ title: "⚖️ Balance challenge", prompt: "Place the brick(s) on the right, then press <b>▶ Run & check</b> to remove the supports.", goal,
  sim: { state: s0, controls: ctls(0, o), render, run, check, hint: "Moment = mass × distance from the pivot. The plank balances when the left moments equal the right moments." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("bal2-sim", diff, uses, mk);
const bal = s => tip(s) === "balanced";
const C = {
  pos: () => { const c = choice([[20, 1, 10, 2], [10, 1.5, 15, 1], [30, 0.5, 10, 1.5], [15, 1, 20, 0.75], [20, 0.75, 30, 0.5]]);
    return simQ(`A <b>${c[0]} kg</b> box sits <b>${c[1]} m</b> left of the pivot. Use the <b>${c[2]} kg</b> brick to balance it.`, st([{ m: c[0], d: c[1] }], { r1m: c[2] }), s => ok(bal(s), `${c[2]} × ${s.r1d} = ${c[0]} × ${c[1]} = ${c[0] * c[1]} kg·m.`, say(s) + "."), { r1d: c[3] }, { lock: ["r1m"], wrong: { r1d: c[3] === 2 ? 1.75 : c[3] + 0.25 } }); },
  mass: () => { const c = choice([[20, 1.5, 1.5, 20], [10, 2, 1, 20], [15, 1, 0.5, 30], [30, 1, 2, 15]]);
    return simQ(`A <b>${c[0]} kg</b> box is <b>${c[1]} m</b> left of the pivot. The blue brick must go at <b>${c[2]} m</b>. Choose its mass.`, st([{ m: c[0], d: c[1] }], { r1d: c[2] }), s => ok(bal(s), `${s.r1m} × ${c[2]} = ${c[0] * c[1]} kg·m.`, say(s) + "."), { r1m: c[3] }, { lock: ["r1d"], wrong: { r1m: c[3] === 30 ? 20 : 30 } }); },
  tipR: () => simQ("A <b>20 kg</b> box sits <b>1 m</b> left. Make the plank tip to the <b>right</b> using the <b>lightest</b> possible brick.", st([{ m: 20, d: 1 }], { r1m: 30 }), s => ok(tip(s) === "right" && s.r1m === 15, "15 kg at 1.5 m or more beats 20 kg·m — 10 kg at 2 m only balances.", tip(s) !== "right" ? say(s) + "." : "It tips right, but a lighter brick can do it."), { r1m: 15, r1d: 1.5 }, { wrong: { r1m: 10, r1d: 2 } }),
  close: () => simQ("A <b>10 kg</b> box sits <b>2 m</b> left. Balance it with the brick as <b>close to the pivot</b> as possible.", st([{ m: 10, d: 2 }]), s => ok(bal(s) && s.r1d === 1, "20 kg × 1 m = 20 kg·m — 30 kg would need 0.67 m, which is not on the plank.", bal(s) ? "Balanced — but a heavier brick could sit closer." : say(s) + "."), { r1m: 20, r1d: 1 }, { wrong: { r1m: 10, r1d: 2 } }),
  two: () => { const c = choice([[[{ m: 20, d: 1 }, { m: 10, d: 2 }], { r1m: 20, r1d: 2 }], [[{ m: 15, d: 2 }, { m: 10, d: 1.5 }], { r1m: 30, r1d: 1.5 }], [[{ m: 10, d: 1.5 }, { m: 20, d: 0.75 }], { r1m: 15, r1d: 2 }]]);
    return simQ(`Two boxes are on the left. Balance them with <b>one</b> blue brick.`, st(c[0]), s => ok(bal(s), say(s) + ".", say(s) + "."), c[1], { wrong: Object.assign({}, c[1], { r1d: c[1].r1d - 0.25 }) }); },
  pair: () => simQ("A <b>30 kg</b> box sits <b>1 m</b> left. Balance it with <b>both</b> bricks: blue <b>10 kg</b> and green <b>10 kg</b>.", st([{ m: 30, d: 1 }], { two: true, r1m: 10, r2m: 10 }), s => ok(bal(s), say(s) + `: ${s.r1d} + ${s.r2d} = 3 m in total.`, say(s) + "."), { r1d: 2, r2d: 1 }, { two: true, lock: ["r1m", "r2m"], wrong: { r1d: 1.5, r2d: 1 } }),
  pair2: () => simQ("A <b>20 kg</b> box sits <b>2 m</b> left (40 kg·m). Balance it with <b>two bricks</b> placed at the <b>same distance</b>.", st([{ m: 20, d: 2 }], { two: true }), s => ok(bal(s) && s.r1d === s.r2d, say(s) + ".", s.r1d !== s.r2d ? "Put both bricks at the same distance." : say(s) + "."), { r1m: 20, r2m: 20, r1d: 1, r2d: 1 }, { two: true, wrong: { r1m: 20, r2m: 10, r1d: 1, r2d: 1 } }),
  myst: () => { const m = choice([15, 25, 40]), sol = { 15: { r1m: 15, r1d: 1 }, 25: { r1m: 20, r1d: 1.25 }, 40: { r1m: 20, r1d: 2 } }[m];
    return simQ("A <b>mystery box</b> sits <b>1 m</b> left of the pivot. Balance it — then the scale shows its mass.", st([{ m, d: 1, mystery: true }]), s => ok(bal(s), `Balanced: mystery mass = ${s.r1m} × ${s.r1d} ÷ 1 = ${m} kg.`, say(s).replace(/Left [\d.]+/, "Left ?") + "."), sol, { wrong: Object.assign({}, sol, { r1d: sol.r1d - 0.25 }) }); },
  myst2: () => { const m = choice([30, 45]), sol = m === 30 ? { r1m: 30, r1d: 1.25, r2m: 5, r2d: 1.5 } : { r1m: 30, r1d: 2, r2m: 5, r2d: 1.5 };
    return simQ("A <b>mystery box</b> sits <b>1.5 m</b> left. Balance it using <b>both</b> bricks (blue 30 kg, green 5 kg).", st([{ m, d: 1.5, mystery: true }], { two: true, r1m: 30, r2m: 5 }), s => ok(bal(s), `Mystery mass = (${s.r1m}×${s.r1d} + ${s.r2m}×${s.r2d}) ÷ 1.5 = ${m} kg.`, "Not balanced yet — the plank tips " + tip(s) + "."), sol, { two: true, lock: ["r1m", "r2m"], wrong: Object.assign({}, sol, { r2d: sol.r2d + 0.25 }) }); }
};

// ---------- diagram tasks ----------
const D = {
  pred: diff => E.diaT("bal2-pick", diff, 1, () => { const c = choice([[[{ m: 20, d: 1 }], { r1m: 10, r1d: 1.5 }], [[{ m: 10, d: 2 }], { r1m: 30, r1d: 1 }], [[{ m: 15, d: 1 }], { r1m: 10, r1d: 1.5 }]]); const s = st(c[0], c[1]), ans = tip(s);
    return { kind: "pick", title: "👆 Which way will it tip?", prompt: "The supports are about to be removed. Click what will happen.", answer: [ans], names: { left: "tips left", balanced: "stays balanced", right: "tips right" },
      visual: st2 => `<svg viewBox="0 0 860 560" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="560" fill="#f4f8fc"/>${render(Object.assign({}, s, { hideMom: true })).replace(/<svg[^>]*>|<\/svg>/g, "")}${["left", "balanced", "right"].map((k, i) => `<g class="pk" data-k="${k}"><rect x="${40 + i * 270}" y="462" width="240" height="80" rx="14" fill="#fff" stroke="#90caf9" stroke-width="2"/><rect x="${40 + i * 270}" y="462" width="240" height="80" rx="14" fill="none" ${E.ring(st2[k])}/>${T(160 + i * 270, 510, ["⬅️ tips LEFT", "⚖️ BALANCED", "tips RIGHT ➡️"][i], { s: 18, c: "#0d47a1" })}</g>`).join("")}</svg>`,
      explain: `Left: ${fmt(lmom(s))} kg·m, right: ${fmt(rightM(s))} kg·m → ${ans === "balanced" ? "balanced" : "tips " + ans}.`, summary: "Predict the tip" }; }),
  num: diff => E.diaT("bal2-num", diff, 2, () => { const c = choice([[30, 1, 20], [24, 0.5, 15], [40, 0.75, 20], [12, 2, 30]]); const s = st([{ m: c[0], d: c[1] }], { r1m: c[2], r1d: 0.25 });
    return { kind: "num", title: "🧮 Where to sit?", prompt: `A ${c[0]} kg child sits ${c[1]} m left of the pivot. A ${c[2]} kg child sits on the right.`, visual: render(s),
      fields: [{ label: "Left moment", unit: "kg·m", answer: c[0] * c[1] }, { label: "Distance for balance", unit: "m", answer: c[0] * c[1] / c[2], tol: 0.011 }], explain: `${c[0]} × ${c[1]} = ${c[0] * c[1]}; ${c[0] * c[1]} ÷ ${c[2]} = ${fmt(c[0] * c[1] / c[2])} m.`, summary: "Principle of moments" }; }),
  myNum: diff => E.diaT("bal2-num", diff, 3, () => { const c = choice([[1.5, 20, 1.2, 16], [2, 10, 1.6, 8], [1, 30, 0.6, 18]]); const s = st([{ m: c[3], d: c[0], mystery: true }], { r1m: c[1], r1d: 1 });
    return { kind: "num", title: "❓ Find the mystery mass", prompt: `The plank is balanced. The mystery box is ${c[0]} m left of the pivot; a ${c[1]} kg brick is ${c[2]} m right.`, visual: render(Object.assign(s, { r1d: c[2] })),
      fields: [{ label: "Mystery mass", unit: "kg", answer: c[1] * c[2] / c[0], tol: 0.06 }], explain: `m × ${c[0]} = ${c[1]} × ${c[2]} → m = ${fmt(c[1] * c[2] / c[0])} kg.`, summary: "Unknown mass by moments" }; }),
  mcq: diff => E.diaT("bal2-mcq", diff, 2, () => { const q = choice([
      { ask: "Why is it easier to open a door by pushing far from the hinge?", ok: "A larger distance gives a larger moment for the same force", bad: ["The door is lighter there", "The hinge pushes back less", "Gravity is weaker there"], ex: "Moment = force × distance: more distance, more turning effect." },
      { ask: "A heavy adult and a light child want to balance on a seesaw. Where should the adult sit?", ok: "Closer to the pivot", bad: ["Further from the pivot", "At the same distance as the child", "Exactly on the pivot"], ex: "The heavier person needs a smaller distance to make an equal moment." },
      { ask: "The unit of a moment (with force in newtons) is…", ok: "N·m (newton-metre)", bad: ["N/m", "kg", "J/s"], ex: "Moment = force (N) × distance (m)." }]);
    return { kind: "mcq", title: "📘 Moments", prompt: "Think about turning effects.", visual: render(st([{ m: 30, d: 1 }], { r1m: 15, r1d: 2, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Moments ideas" }; })
};
const LEVELS = {
  1: { intro: "Balance a seesaw: moment = mass × distance from the pivot.", pool: () => [S(1, 1, C.pos), S(2, 1, C.mass), S(2, 1, C.pos), S(3, 1, C.tipR), S(3, 1, C.close), D.pred(1), D.mcq(2), D.num(3)] },
  2: { intro: "More objects: add up the moments on each side.", pool: () => [S(1, 1, C.two), S(2, 1, C.pair), S(2, 1, C.close), S(3, 1, C.pair2), D.pred(1), D.num(2), D.mcq(3)] },
  3: { intro: "Use moments to find the mass of mystery boxes.", pool: () => [S(1, 1, C.myst), S(2, 1, C.myst), S(3, 1, C.myst2), S(3, 1, C.pair), D.num(1), D.myNum(2), D.myNum(3)] }
};
const explore = E.exploreSim({
  intro: "A 20 kg box sits 1 m left of the pivot. Place the blue brick and press ▶ to remove the supports.",
  state: () => st([{ m: 20, d: 1 }]), controls: () => ctls(1), render, run, runLabel: "▶ Remove supports",
  goals: () => [{ txt: "Make it tip to the left", test: (s, m) => m.l }, { txt: "Make it tip to the right", test: (s, m) => m.r }, { txt: "Make it balance", test: (s, m) => m.b }],
  track: (s, m, ran) => { if (!ran) return; m[tip(s)[0]] = 1; },
  facts: () => "📘 <b>Principle of moments</b>: balanced when clockwise moments = anticlockwise moments. Moment = force × distance."
});
E.start({ labId: "balance2", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚖️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚖️", "🧱", "⭐", "✨"],
  exploreDemo: () => [{ set: { r1m: 5, r1d: 0.5 }, run: true }, { set: { r1m: 30, r1d: 2 }, run: true }, { set: { r1m: 10, r1d: 2 }, run: true }] });
})();
