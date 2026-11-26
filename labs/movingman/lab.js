"use strict";
// ===== Moving Man (Motion Graphs) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const DUR = 6, WALL = 10;
function motion(s, t) { // position & velocity at time t, stopping at the walls
  let x = s.x0, v = s.v; const dt = 0.01;
  for (let k = 0; k < Math.round(t / dt); k++) { v += s.a * dt; x += v * dt; if (x > WALL) { x = WALL; v = 0; } if (x < -WALL) { x = -WALL; v = 0; } }
  return { x: r2(x), v: r2(v) };
}
const exact = s => ({ x: r2(s.x0 + s.v * DUR + 0.5 * s.a * DUR * DUR), v: r2(s.v + s.a * DUR) });
const hits = s => Math.abs(exact(s).x) > WALL + 1e-9 || (() => { for (let t = 0; t <= DUR; t += 0.05) if (Math.abs(s.x0 + s.v * t + 0.5 * s.a * t * t) > WALL + 1e-9) return true; return false; })();
const fin = s => hits(s) ? motion(s, DUR) : exact(s);
const disp = s => r2(fin(s).x - s.x0);
function graph(x0, y0, w, h, f, lo, hi, col, lbl, target) {
  const gx = t => x0 + t / DUR * w, gy = v => y0 + h - (v - lo) / (hi - lo) * h;
  let g = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#fafafa" stroke="#eceff1"/><line x1="${x0}" y1="${gy(0)}" x2="${x0 + w}" y2="${gy(0)}" stroke="#90a4ae"/>${T(x0 + 4, y0 + 14, lbl, { a: "start", s: 11, c: "#546e7a" })}`;
  for (let t = 0; t <= DUR; t += 2) g += T(gx(t), y0 + h + 14, t, { s: 10, c: "#90a4ae" });
  [hi, lo].forEach(v => g += T(x0 - 4, gy(v) + 4, v, { a: "end", s: 10, c: "#90a4ae" }));
  if (target) { let d = ""; for (let t = 0; t <= DUR + 1e-9; t += 0.1) d += (t ? " L" : "M") + gx(t) + "," + gy(Math.max(lo, Math.min(hi, target(t)))); g += `<path d="${d}" fill="none" stroke="#bdbdbd" stroke-width="5" stroke-dasharray="8 6"/>`; }
  if (f) { let d = ""; for (let t = 0; t <= DUR + 1e-9; t += 0.1) d += (t ? " L" : "M") + gx(t) + "," + gy(Math.max(lo, Math.min(hi, f(t)))); g += `<path d="${d}" fill="none" stroke="${col}" stroke-width="3"/>`; }
  return g + T(x0 + w, y0 + h + 14, "t (s)", { a: "end", s: 10, c: "#90a4ae" });
}
function render(s) {
  const show = s.reveal, px = x => 300 + x * 23, F = fin(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += `<rect x="60" y="118" width="480" height="14" fill="#bcaaa4"/>`; for (let x = -10; x <= 10; x += 2) g += `<line x1="${px(x)}" y1="132" x2="${px(x)}" y2="140" stroke="#8d6e63"/>${T(px(x), 154, x, { s: 10, c: "#8d6e63" })}`;
  g += `<rect x="34" y="62" width="34" height="54" fill="#ffccbc" stroke="#8d6e63"/><path d="M30,64 L51,44 L72,64Z" fill="#a1887f"/>${T(51, 40, "house", { s: 10, c: "#8d6e63" })}<circle cx="556" cy="72" r="20" fill="#81c784"/><rect x="552" y="88" width="8" height="30" fill="#8d6e63"/>${T(556, 44, "tree", { s: 10, c: "#558b2f" })}${T(560, 154, "m", { a: "start", s: 10, c: "#8d6e63" })}`;
  const man = (x, op) => `<g opacity="${op}" transform="translate(${px(x)},76)"><circle cx="0" cy="0" r="9" fill="#ffcc80" stroke="#6d4c41"/><line x1="0" y1="9" x2="0" y2="28" stroke="#1565c0" stroke-width="5"/><line x1="0" y1="28" x2="-7" y2="42" stroke="#37474f" stroke-width="4"/><line x1="0" y1="28" x2="7" y2="42" stroke="#37474f" stroke-width="4"/><line x1="0" y1="14" x2="-9" y2="24" stroke="#1565c0" stroke-width="4"/><line x1="0" y1="14" x2="9" y2="24" stroke="#1565c0" stroke-width="4"/></g>`;
  g += show ? man(s.x0, 0.3) + man(F.x, 1) + `<line x1="${px(s.x0)}" y1="104" x2="${px(F.x)}" y2="104" stroke="#ef6c00" stroke-width="2" stroke-dasharray="4 3"/>` : man(s.x0, 1);
  const tgt = s.target ? { x: t => s.target.x0 + s.target.v * t + 0.5 * s.target.a * t * t, v: t => s.target.v + s.target.a * t } : null;
  g += graph(70, 186, 210, 190, show ? t => motion(s, t).x : null, -10, 10, "#1e88e5", "position x (m)", tgt && tgt.x);
  g += graph(330, 186, 210, 190, show ? t => motion(s, t).v : null, -5, 5, "#e65100", "velocity v (m/s)", tgt && tgt.v);
  if (s.target) g += T(300, 420, "match the dashed grey graphs", { s: 11, c: "#78909c" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 58, `start ${s.x0} m · v ${s.v} m/s · a ${s.a} m/s²`, { s: 11, c: "#546e7a" })}
    ${show ? T(120, 96, "after 6 s", { s: 12, c: "#78909c" }) + T(120, 124, "x = " + fmt(F.x) + " m", { s: 22, c: "#1565c0" }) + T(120, 154, "v = " + fmt(F.v) + " m/s", { s: 18, c: "#e65100" }) + T(120, 192, "displacement " + fmt(disp(s)) + " m", { s: 13, c: "#37474f" }) + T(120, 216, "average velocity " + fmt(r2(disp(s) / DUR)) + " m/s", { s: 13, c: "#37474f" }) + (hits(s) ? T(120, 244, "he hit the " + (F.x > 0 ? "tree" : "house") + " and stopped!", { s: 12, c: "#c62828" }) : "") : T(120, 160, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 318, "slope of x–t = velocity", { s: 12, c: "#546e7a" })}${T(120, 338, "slope of v–t = acceleration", { s: 12, c: "#546e7a" })}${T(120, 358, "area under v–t = displacement", { s: 12, c: "#546e7a" })}${T(120, 384, "+ is towards the tree", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "x0", type: "range", label: "Start position", min: -10, max: 10, step: 1, nudge: 1, unit: "m", lock: lk("x0") },
  { id: "v", type: "range", label: "Starting velocity", min: -4, max: 4, step: 0.5, nudge: 0.5, unit: "m/s", lock: lk("v") },
  { id: "a", type: "range", label: "Acceleration", min: -2, max: 2, step: 0.5, nudge: 0.5, unit: "m/s²", hide: () => lv < 2 && !explore, lock: lk("a") }]; };
const st = o => Object.assign({ x0: 0, v: 1, a: 0, target: null }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `After 6 s: x = ${fmt(fin(s).x)} m, v = ${fmt(fin(s).v)} m/s.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.target ? "📈 Match the graph" : "🚶 Motion challenge", prompt: "Set the motion, then press <b>▶ Run & check</b> (it runs for 6 s).", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Position after 6 s = start + v × 6 + ½ × a × 6². The x–t graph's slope is the velocity; the v–t graph's slope is the acceleration and its area is the displacement. Negative means towards the house." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mm2-sim", diff, uses, mk);
const match = (s, tg) => s.x0 === tg.x0 && s.v === tg.v && s.a === tg.a;
const C = {
  end8: () => simQ(1, "Start at <b>−4 m</b> and end at <b>+8 m</b> after 6 s, walking at a steady speed.", st({ x0: -4, v: 0 }), s => ok(fin(s).x === 8, "v = 12 m ÷ 6 s = 2 m/s.", said(s)), { v: 2 }, { lock: ["x0"], wrong: { v: 1.5 } }),
  house: () => simQ(1, "Walk <b>towards the house</b> at <b>1 m/s</b>, starting at the tree end (+8 m).", st({ x0: 8, v: 1 }), s => ok(s.v === -1, "Towards the house is the negative direction: −1 m/s.", `v = ${s.v} m/s.`), { v: -1 }, { lock: ["x0"], wrong: { v: 1 } }),
  still: () => simQ(1, "Make the position–time graph a <b>flat line at 5 m</b>.", st({ x0: 0, v: 1 }), s => ok(s.x0 === 5 && s.v === 0, "Standing still at 5 m: slope 0.", said(s)), { x0: 5, v: 0 }, { wrong: { x0: 5, v: 0.5 } }),
  slope: () => simQ(1, "Make the x–t graph go from <b>+9 m</b> down to <b>0 m</b> in 6 s.", st({ x0: 9, v: 0 }), s => ok(fin(s).x === 0, "Slope = −9 ÷ 6 = −1.5 m/s.", said(s)), { v: -1.5 }, { lock: ["x0"], wrong: { v: -1 } }),
  speedUp: () => simQ(2, "Start <b>from rest</b> and reach <b>3 m/s</b> after 6 s.", st({ x0: -10, v: 0, a: 0 }), s => ok(s.v === 0 && fin(s).v === 3, "a = 3 ÷ 6 = 0.5 m/s².", s.v !== 0 ? "Start from rest (v = 0)." : said(s)), { a: 0.5 }, { lock: ["x0", "v"], wrong: { a: 1 } }),
  stop: () => simQ(2, "Moving at <b>3 m/s</b>, slow down to <b>stop exactly at 6 s</b>.", st({ x0: -9, v: 3, a: 0 }), s => ok(fin(s).v === 0 && !hits(s), "a = −0.5 m/s²: the v–t line falls to zero at 6 s.", said(s)), { a: -0.5 }, { lock: ["x0", "v"], wrong: { a: -1 } }),
  flatNeg: () => simQ(2, "Make the velocity–time graph a <b>flat line at −2 m/s</b>.", st({ x0: 8, v: 1, a: 1 }), s => ok(s.v === -2 && s.a === 0, "Constant velocity: no acceleration.", `v starts at ${s.v} m/s with a = ${s.a} m/s².`), { v: -2, a: 0 }, { lock: ["x0"], wrong: { v: -2, a: -0.5 } }),
  area12: () => simQ(2, "Starting at <b>−6 m</b>, make the area under the v–t graph (the displacement) exactly <b>12 m</b>.", st({ x0: -6, v: 0, a: 0 }), s => ok(disp(s) === 12, "e.g. 2 m/s for 6 s, or from rest with a = 2/3… try 2 m/s.", `Displacement: ${fmt(disp(s))} m.`), { v: 2, a: 0 }, { lock: ["x0"], wrong: { v: 1.5, a: 0 } }),
  m1: () => { const tg = { x0: -8, v: 0, a: 0.5 }; return simQ(3, "Match the dashed graphs: he <b>starts from rest</b> and <b>speeds up</b>.", st({ x0: 0, v: 0, a: 0, target: tg }), s => ok(match(s, tg), "x₀ = −8 m, v = 0, a = 0.5 m/s².", said(s)), { x0: -8, v: 0, a: 0.5 }, { wrong: { x0: -8, v: 0, a: 1 } }); },
  m2: () => { const tg = { x0: 8, v: -3, a: 0.5 }; return simQ(3, "Match the dashed graphs: he walks <b>towards the house</b> and <b>slows down</b>.", st({ x0: 0, v: 0, a: 0, target: tg }), s => ok(match(s, tg), "x₀ = 8 m, v = −3 m/s, a = +0.5 m/s².", said(s)), { x0: 8, v: -3, a: 0.5 }, { wrong: { x0: 8, v: -3, a: -0.5 } }); },
  m3: () => { const tg = { x0: -2, v: 2, a: -1 }; return simQ(3, "Match the dashed graphs: he walks out, <b>turns around</b> and comes back.", st({ x0: 0, v: 0, a: 0, target: tg }), s => ok(match(s, tg), "x₀ = −2 m, v = 2 m/s, a = −1 m/s²: he turns at t = 2 s.", said(s)), { x0: -2, v: 2, a: -1 }, { wrong: { x0: -2, v: 2, a: -0.5 } }); },
  m4: () => { const tg = { x0: 4, v: -1, a: 0 }; return simQ(3, "Match the dashed graphs: a <b>steady walk</b>.", st({ x0: 0, v: 0, a: 0, target: tg }), s => ok(match(s, tg), "x₀ = 4 m, v = −1 m/s, a = 0.", said(s)), { x0: 4, v: -1, a: 0 }, { wrong: { x0: 4, v: -1.5, a: 0 } }); }
};
const D = {
  pick: diff => E.diaT("mm2-pick", diff, 2, () => {
    const lib = diff === 1 ? [["still", "stands still", { x0: 3, v: 0, a: 0 }], ["fwdFast", "walks towards the tree fastest", { x0: -8, v: 2.5, a: 0 }], ["fwdSlow", "walks slowly towards the tree", { x0: -4, v: 0.5, a: 0 }], ["back", "walks towards the house", { x0: 6, v: -1.5, a: 0 }]]
      : [["up", "speeds up", { x0: -8, v: 0, a: 0.5 }], ["down", "slows down", { x0: -8, v: 3, a: -0.5 }], ["const", "moves at a steady velocity", { x0: -6, v: 1.5, a: 0 }], ["rev", "turns around", { x0: 0, v: 2, a: -1 }]];
    const cards = E.shuffle(lib), want = choice(lib), useV = diff > 1;
    return { kind: "pick", title: useV ? "👆 Read the v–t graph" : "👆 Read the x–t graph", prompt: `Click the ${useV ? "velocity–time" : "position–time"} graph where the man <b>${want[1]}</b>.`, answer: [want[0]], names: Object.fromEntries(lib.map(l => [l[0], "graph"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${cards.map((c, i) => { const x = 15 + i * 212, p = st(c[2]); return `<g class="pk" data-k="${c[0]}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${graph(x + 30, 50, 150, 170, useV ? t => p.v + p.a * t : t => p.x0 + p.v * t + 0.5 * p.a * t * t, useV ? -5 : -10, useV ? 5 : 10, useV ? "#e65100" : "#1e88e5", useV ? "v" : "x")}${T(x + 98, 268, "graph " + "ABCD"[i], { s: 14, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2[c[0]])}/></g>`; }).join("")}</svg>`,
      explain: useV ? "v–t: rising line = speeding up; falling to zero = slowing; flat = steady; crossing zero = turning around." : "x–t: flat = still; steeper = faster; sloping down = towards the house.", summary: "Reading motion graphs" };
  }),
  num: diff => E.diaT("mm2-num", diff, 2, () => {
    if (diff === 1) { const c = choice([[-6, 6], [8, -4], [-3, 9], [2, -10]]);
      return { kind: "num", title: "🧮 Slope = velocity", prompt: `The x–t graph goes from <b>${c[0]} m</b> to <b>${c[1]} m</b> in <b>6 s</b> in a straight line.`, visual: render(st({ x0: c[0], v: r2((c[1] - c[0]) / 6), reveal: true })), fields: [{ label: "Velocity", unit: "m/s", answer: r2((c[1] - c[0]) / 6) }], explain: `(${c[1]} − ${c[0]}) ÷ 6 = ${fmt(r2((c[1] - c[0]) / 6))} m/s.`, summary: "Velocity from x–t" }; }
    if (diff === 2) { const c = choice([[0, 3], [4, 1], [1, 4], [-2, 1]]);
      return { kind: "num", title: "🧮 Acceleration and area", prompt: `The v–t graph is a straight line from <b>${c[0]} m/s</b> at 0 s to <b>${c[1]} m/s</b> at 6 s.`, visual: render(st({ x0: -8, v: c[0], a: r2((c[1] - c[0]) / 6), reveal: true })), fields: [{ label: "Acceleration", unit: "m/s²", answer: r2((c[1] - c[0]) / 6) }, { label: "Displacement (area)", unit: "m", answer: r2((c[0] + c[1]) / 2 * 6) }], explain: `a = (${c[1]} − ${c[0]}) ÷ 6 = ${fmt(r2((c[1] - c[0]) / 6))} m/s²; area = average v × 6 = ${fmt(r2((c[0] + c[1]) / 2 * 6))} m.`, summary: "Slope and area of v–t" }; }
    const c = choice([[-8, 0, 0.5], [0, 2, -0.5], [4, -1, 0.5], [-8, 1, 0.5]]);
    return { kind: "num", title: "🧮 Where does he end?", prompt: `Start <b>${c[0]} m</b>, starting velocity <b>${c[1]} m/s</b>, acceleration <b>${c[2]} m/s²</b>. Use x = x₀ + vt + ½at² with t = 6 s.`, visual: render(st({ x0: c[0], v: c[1], a: c[2] })), fields: [{ label: "Final position", unit: "m", answer: r2(c[0] + c[1] * 6 + 0.5 * c[2] * 36) }, { label: "Final velocity", unit: "m/s", answer: r2(c[1] + c[2] * 6) }], explain: `x = ${c[0]} + ${c[1]}×6 + ½×${c[2]}×36 = ${fmt(r2(c[0] + c[1] * 6 + 0.5 * c[2] * 36))} m; v = ${fmt(r2(c[1] + c[2] * 6))} m/s.`, summary: "Equations of motion" };
  }),
  mcq: diff => E.diaT("mm2-mcq", diff, 2, () => { const q = choice([
      { ask: "On a position–time graph, a steeper line means…", ok: "a higher speed", bad: ["a bigger acceleration", "a longer time", "standing still"], ex: "The slope of x–t is the velocity." },
      { ask: "A curved position–time graph that gets steeper means…", ok: "the object is speeding up", bad: ["it is slowing down", "it is standing still", "it moves at a constant speed"], ex: "The slope (velocity) is increasing." },
      { ask: "What does the area under a velocity–time graph tell you?", ok: "The displacement", bad: ["The acceleration", "The speed", "The time"], ex: "velocity × time = distance moved." },
      { ask: "A velocity–time graph crosses from positive to negative. The object…", ok: "turns around and moves the other way", bad: ["stops forever", "speeds up in the same direction", "goes back in time"], ex: "Negative velocity means moving in the opposite direction." }]);
    return { kind: "mcq", title: "📘 Motion-graph ideas", prompt: "Think about slopes and areas.", visual: render(st({ x0: -8, v: 0, a: 0.5, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Motion graphs" }; })
};
const LEVELS = {
  1: { intro: "At a steady velocity the position–time graph is a straight line. Its slope is the velocity.", pool: () => [S(1, 1, C.still), S(2, 1, C.end8), S(2, 1, C.house), S(3, 1, C.slope), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Acceleration changes the velocity: the v–t graph slopes, and its area is the displacement.", pool: () => [S(1, 1, C.flatNeg), S(2, 1, C.speedUp), S(2, 1, C.stop), S(3, 1, C.area12), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Match the motion to the dashed graphs: find the start, the velocity and the acceleration.", pool: () => [S(1, 1, C.m4), S(2, 1, C.m1), S(3, 1, C.m2), S(3, 1, C.m3), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Set where he starts, how fast he walks and his acceleration. Press ▶ to watch him and his graphs for 6 seconds.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Walk",
  goals: () => [{ txt: "Walk towards the house", test: (s, m) => m.h }, { txt: "Make a curved x–t graph", test: (s, m) => m.c }, { txt: "Stand still", test: (s, m) => m.s }],
  track: (s, m, ran) => { if (!ran) return; if (s.v < 0 || (s.v === 0 && s.a < 0)) m.h = 1; if (s.a !== 0) m.c = 1; if (s.v === 0 && s.a === 0) m.s = 1; },
  facts: () => "📘 <b>Motion graphs</b>: the slope of position–time is velocity; the slope of velocity–time is acceleration."
});
E.start({ labId: "movingman", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🚶", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🚶", "📈", "⏱️", "✨"],
  exploreDemo: () => [{ set: { x0: 6, v: -1, a: 0 }, run: true }, { set: { x0: -8, v: 0, a: 0.5 }, run: true }, { set: { x0: 0, v: 0, a: 0 }, run: true }] });
})();
