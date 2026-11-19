"use strict";
// ===== Forces & Motion — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const TRUN = 4; // seconds of motion in every run
const MASSES = [10, 20, 40, 50, 80].map(v => ({ v, label: v + " kg" }));
const FRICT = [0, 20, 40, 60, 100].map(v => ({ v, label: v === 0 ? "None" : v + " N" }));
function phys(s) {
  const Fa = s.F1 - s.F2, f = s.fr || 0;
  const moves = Math.abs(Fa) > f;
  const fric = moves ? -Math.sign(Fa) * f : -Fa; // static friction cancels the push
  const net = moves ? Fa + fric : 0, a = net / s.m;
  return { Fa, fric, net, a, v: a * TRUN, d: 0.5 * a * TRUN * TRUN, moves };
}
function arrow(x1, x2, y, col, label, w, below) {
  if (Math.abs(x2 - x1) < 2) return "";
  const dir = Math.sign(x2 - x1), hx = x2 - dir * 16;
  return `<line x1="${x1}" y1="${y}" x2="${hx}" y2="${y}" stroke="${col}" stroke-width="${w || 9}" stroke-linecap="round"/>
    <polygon points="${x2},${y} ${hx},${y - 13} ${hx},${y + 13}" fill="${col}"/>${label ? T((x1 + x2) / 2, below ? y + 30 : y - 16, label, { s: 15, c: col }) : ""}`;
}
const RANGES = [10, 20, 50, 100, 200, 500];
function render(s) {
  const r = phys(s), show = s.reveal || s.showVals, t = s._t || 0;
  const x = 0.5 * r.a * t * t, R = RANGES.find(q => q >= Math.abs(r.d)) || 500;
  const cx = 400 + (x / R) * 300, by = 330, bw = 120, bh = 96, L = cx - bw / 2, Rt = cx + bw / 2, K = 0.75; // px per N
  let ticks = "";
  for (let i = -5; i <= 5; i++) { const tx = 400 + i * 60; ticks += `<line x1="${tx}" x2="${tx}" y1="${by}" y2="${by + (i % 5 === 0 ? 18 : 10)}" stroke="#78909c" stroke-width="2"/>${i % 5 === 0 ? T(tx, by + 36, fmt(i * R / 5) + " m", { s: 12, c: "#546e7a" }) : ""}`; }
  const vNow = r.a * t;
  return `<svg viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f1fb"/><stop offset="1" stop-color="#f7fafd"/></linearGradient>
    <pattern id="crate" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#c8945a"/><line x1="0" y1="12" x2="24" y2="12" stroke="#a87442" stroke-width="2"/></pattern></defs>
    <rect width="800" height="440" fill="url(#sky)"/>
    <rect x="0" y="${by}" width="800" height="110" fill="${s.fr ? "#d7ccc8" : "#e3eaf2"}"/>${s.fr ? `<rect x="0" y="${by}" width="800" height="8" fill="#a1887f"/>` : `<rect x="0" y="${by}" width="800" height="4" fill="#90a4ae"/>`}
    ${ticks}${T(790, by + 100, s.fr ? "rough floor · friction " + s.fr + " N" : "smooth floor · no friction", { a: "end", s: 13, c: "#546e7a" })}
    <g><rect x="${L}" y="${by - bh}" width="${bw}" height="${bh}" rx="6" fill="url(#crate)" stroke="#6d4c2f" stroke-width="4"/>
      <line x1="${L + 6}" y1="${by - bh + 6}" x2="${Rt - 6}" y2="${by - 6}" stroke="#6d4c2f" stroke-width="4"/><line x1="${Rt - 6}" y1="${by - bh + 6}" x2="${L + 6}" y2="${by - 6}" stroke="#6d4c2f" stroke-width="4"/>
      <rect x="${cx - 36}" y="${by - bh / 2 - 16}" width="72" height="30" rx="6" fill="#fff"/>${T(cx, by - bh / 2 + 6, s.m + " kg", { s: 17, c: "#3e2723" })}</g>
    ${s.F1 ? arrow(L - s.F1 * K - 4, L - 4, by - bh / 2, "#1565c0") + T(L - 8, by - bh / 2 - 22, "F₁ = " + s.F1 + " N", { a: "end", s: 15, c: "#1565c0" }) : ""}
    ${s.F2 ? arrow(Rt + s.F2 * K + 4, Rt + 4, by - bh / 2, "#c62828") + T(Rt + 8, by - bh / 2 - 22, "F₂ = " + s.F2 + " N", { a: "start", s: 15, c: "#c62828" }) : ""}
    ${s.fr && r.fric ? arrow(cx, cx + r.fric * K, by + 62, "#ef6c00", "", 7) + T(cx, by + 92, "friction " + fmt(Math.abs(r.fric)) + " N", { s: 14, c: "#ef6c00" }) : ""}
    ${show ? (r.net ? arrow(cx - r.net * K / 2, cx + r.net * K / 2, by - bh - 34, "#2e7d32", "net force " + fmt(Math.abs(r.net)) + " N") : T(cx, by - bh - 24, "net force = 0 N (balanced)", { s: 15, c: "#2e7d32" })) : T(cx, by - bh - 24, "net force = ?", { s: 15, c: "#2e7d32" })}
    <g transform="translate(14,14)"><rect width="210" height="${show ? 116 : 64}" rx="10" fill="#fff" stroke="#cfd8dc"/>
      ${T(105, 26, "time " + fmt(t * 1, 1) + " s / " + TRUN + " s", { s: 14 })}
      ${show ? T(105, 52, "a = " + fmt(r.a) + " m/s²", { s: 15, c: "#0b3d78" }) + T(105, 76, "speed = " + fmt(Math.abs(vNow)) + " m/s", { s: 15, c: "#0b3d78" }) + T(105, 100, "distance = " + fmt(Math.abs(x)) + " m", { s: 15, c: "#0b3d78" }) : T(105, 50, "press ▶ to push", { s: 13, c: "#78909c" })}</g></svg>`;
}
const ctls = (lv, o) => { o = o || {}; const L = o.lv || lv; const lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "F1", type: "range", label: "F₁ push to the right →", min: 0, max: 200, step: 10, unit: "N", lock: lk("F1") },
  { id: "F2", type: "range", label: "F₂ push to the left ←", min: 0, max: 200, step: 10, unit: "N", lock: lk("F2") },
  { id: "m", type: "choice", label: "Mass of the crate", options: MASSES, hide: () => L < 2, lock: lk("m") },
  { id: "fr", type: "choice", label: "Friction", options: FRICT, hide: () => L < 3, lock: lk("fr") }
]; };
const st = o => Object.assign({ F1: 0, F2: 0, m: 40, fr: 0, _t: 0 }, o || {});
function run(s, box) {
  s.reveal = true;
  return new Promise(res => { const t0 = performance.now(), dur = 2800;
    const f = now => { s._t = Math.min(1, (now - t0) / dur) * TRUN; box.innerHTML = render(s); if (s._t < TRUN) requestAnimationFrame(f); else res(); };
    requestAnimationFrame(f); });
}
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const desc = s => { const r = phys(s); return `net force ${fmt(r.net)} N, a = ${fmt(r.net)} ÷ ${s.m} = ${fmt(r.a)} m/s²`; };
const simQ = (goal, s0, check, sol, o) => ({ title: "📦 Force challenge", prompt: "Set the forces, then press <b>▶ Run & check</b> to push the crate for 4 seconds.", goal,
  sim: { state: s0, controls: ctls(S1971Lab.level, o), render, run, check, hint: "Net force = F₁ − F₂ (− friction). Acceleration a = net force ÷ mass. After 4 s from rest: speed = a × 4, distance = ½ × a × 4²." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("force-sim", diff, uses, mk);
const near = (a, b) => E.near(a, b, 1e-6);
const C = {
  balance: () => { const F2 = choice([60, 90, 120, 150]);
    return simQ(`F₂ pushes left with <b>${F2} N</b>. Set F₁ so the crate <b>does not move</b>.`, st({ F2 }), s => ok(phys(s).net === 0 && s.F1 > 0, `${s.F1} N right and ${s.F2} N left are balanced: net force 0.`, desc(s) + " — the crate moves."), { F1: F2 }, { lock: ["F2"], wrong: { F1: F2 + 20 } }); },
  netRight: () => { const F2 = choice([30, 50, 80]), N = choice([40, 60, 100]);
    return simQ(`F₂ = <b>${F2} N</b> to the left. Make the net force exactly <b>${N} N to the right</b>.`, st({ F2 }), s => ok(near(phys(s).net, N), `${s.F1} − ${s.F2} = ${N} N to the right.`, `Net force = ${s.F1} − ${s.F2} = ${phys(s).net} N.`), { F1: F2 + N }, { lock: ["F2"], wrong: { F1: N } }); },
  left: () => { const F1 = choice([40, 80, 100]), N = choice([30, 50, 70]);
    return simQ(`F₁ = <b>${F1} N</b> to the right. Make the crate move <b>to the LEFT</b> with a net force of <b>${N} N</b>.`, st({ F1 }), s => ok(near(phys(s).net, -N), `${s.F2} − ${s.F1} = ${N} N to the left.`, `Net force = ${fmt(Math.abs(phys(s).net))} N ${phys(s).net > 0 ? "to the right" : phys(s).net < 0 ? "to the left" : "(balanced)"}.`), { F2: F1 + N }, { lock: ["F1"], wrong: { F2: N } }); },
  tug: () => simQ("Tug of war: both pushes must be <b>at least 100 N</b>, but the crate must <b>stay still</b>.", st(), s => ok(s.F1 >= 100 && s.F2 >= 100 && phys(s).net === 0, `${s.F1} N = ${s.F2} N → balanced forces.`, s.F1 < 100 || s.F2 < 100 ? "Both forces must be 100 N or more." : desc(s) + "."), { F1: 120, F2: 120 }, { wrong: { F1: 120, F2: 100 } }),
  accel: () => { const c = choice([{ m: 20, a: 2 }, { m: 50, a: 3 }, { m: 40, a: 2.5 }, { m: 80, a: 1.5 }, { m: 10, a: 7 }]);
    return simQ(`Crate mass <b>${c.m} kg</b>. Give it an acceleration of exactly <b>${c.a} m/s²</b> to the right.`, st({ m: c.m }), s => ok(near(phys(s).a, c.a), `F = m × a = ${c.m} × ${c.a} = ${c.m * c.a} N.`, desc(s) + "."), { F1: c.m * c.a }, { lv: 2, lock: ["m"], wrong: { F1: c.m * c.a + 20 } }); },
  speed: () => { const c = choice([{ m: 40, v: 12 }, { m: 20, v: 10 }, { m: 50, v: 8 }, { m: 10, v: 20 }]); const F = c.m * c.v / TRUN;
    return simQ(`Crate mass <b>${c.m} kg</b>, starting at rest. Make its speed exactly <b>${c.v} m/s</b> after 4 s.`, st({ m: c.m }), s => ok(near(phys(s).v, c.v), `a = ${fmt(phys(s).a)} m/s² → speed = a × 4 = ${fmt(phys(s).v)} m/s.`, `Speed after 4 s = ${fmt(phys(s).v)} m/s.`), { F1: F }, { lv: 2, lock: ["m"], wrong: { F1: F + 10 } }); },
  dist: () => { const c = choice([{ m: 50, d: 16 }, { m: 20, d: 24 }, { m: 40, d: 32 }]); const a = c.d / 8;
    return simQ(`Crate mass <b>${c.m} kg</b>. Make it travel exactly <b>${c.d} m</b> in 4 s (from rest).`, st({ m: c.m }), s => ok(near(Math.abs(phys(s).d), c.d), `d = ½ × ${fmt(phys(s).a)} × 16 = ${fmt(phys(s).d)} m.`, `Distance = ${fmt(Math.abs(phys(s).d))} m.`), { F1: c.m * a }, { lv: 2, lock: ["m"], wrong: { F1: c.m * a + 20 } }); },
  mass: () => { const c = choice([{ F: 120, a: 3, m: 40 }, { F: 200, a: 4, m: 50 }, { F: 80, a: 8, m: 10 }, { F: 160, a: 2, m: 80 }]);
    return simQ(`F₁ is fixed at <b>${c.F} N</b>. Choose the crate mass so the acceleration is <b>${c.a} m/s²</b>.`, st({ F1: c.F, m: 20 === c.m ? 10 : 20 }), s => ok(near(phys(s).a, c.a) && s.F2 === 0, `m = F ÷ a = ${c.F} ÷ ${c.a} = ${c.m} kg.`, desc(s) + "."), { m: c.m }, { lv: 2, lock: ["F1"], wrong: { m: c.m === 80 ? 50 : 80 } }); },
  leftA: () => { const c = choice([{ m: 20, a: 2 }, { m: 40, a: 1.5 }, { m: 50, a: 2 }]);
    return simQ(`Crate mass <b>${c.m} kg</b>. Give it an acceleration of <b>${c.a} m/s² to the LEFT</b>.`, st({ m: c.m }), s => ok(near(phys(s).a, -c.a), `Net force ${c.m * c.a} N to the left.`, desc(s) + "."), { F1: 0, F2: c.m * c.a }, { lv: 2, lock: ["m"], wrong: { F1: c.m * c.a, F2: 0 } }); },
  fricA: () => { const c = choice([{ m: 40, f: 60, a: 1.5 }, { m: 20, f: 40, a: 3 }, { m: 50, f: 100, a: 2 }, { m: 10, f: 20, a: 5 }]); const F = c.m * c.a + c.f;
    return simQ(`Mass <b>${c.m} kg</b>, friction <b>${c.f} N</b>. Push with F₁ so that a = <b>${c.a} m/s²</b>.`, st({ m: c.m, fr: c.f }), s => ok(near(phys(s).a, c.a), `Net = ${s.F1} − ${c.f} = ${fmt(phys(s).net)} N → a = ${fmt(phys(s).a)} m/s².`, desc(s) + "."), { F1: F }, { lv: 3, lock: ["m", "fr", "F2"], wrong: { F1: c.m * c.a } }); },
  stuck: () => { const f = choice([40, 60, 100]);
    return simQ(`Friction can hold up to <b>${f} N</b>. Push with the <b>biggest F₁</b> that still does <b>not</b> move the crate.`, st({ fr: f }), s => ok(s.F1 === f, `Up to ${f} N, static friction cancels the push.`, s.F1 > f ? "The crate moved — the push beat the friction." : `${s.F1} N is not the biggest push that keeps it still.`), { F1: f }, { lv: 3, lock: ["m", "fr", "F2"], wrong: { F1: f + 10 } }); },
  chooseFr: () => { const c = choice([{ F: 150, m: 50, a: 1, f: 100 }, { F: 100, m: 20, a: 3, f: 40 }, { F: 140, m: 40, a: 2, f: 60 }]);
    return simQ(`F₁ = <b>${c.F} N</b>, mass <b>${c.m} kg</b>. Choose the floor's friction so that a = <b>${c.a} m/s²</b>.`, st({ F1: c.F, m: c.m }), s => ok(near(phys(s).a, c.a), `Friction = ${c.F} − ${c.m} × ${c.a} = ${c.f} N.`, desc(s) + "."), { fr: c.f }, { lv: 3, lock: ["F1", "m", "F2"], wrong: { fr: 0 } }); },
  speedFr: () => { const c = choice([{ m: 20, f: 40, v: 6 }, { m: 40, f: 60, v: 4 }, { m: 50, f: 20, v: 8 }]); const F = c.m * c.v / TRUN + c.f;
    return simQ(`Mass <b>${c.m} kg</b>, friction <b>${c.f} N</b>. Reach a speed of <b>${c.v} m/s</b> after 4 s.`, st({ m: c.m, fr: c.f }), s => ok(near(phys(s).v, c.v), `a = ${fmt(phys(s).a)} m/s² → ${fmt(phys(s).v)} m/s after 4 s.`, `Speed after 4 s = ${fmt(phys(s).v)} m/s.`), { F1: F }, { lv: 3, lock: ["m", "fr", "F2"], wrong: { F1: F - c.f } }); },
  fricTwo: () => { const c = choice([{ F2: 60, f: 20, m: 40, a: 1 }, { F2: 40, f: 40, m: 20, a: 2 }]); const F1 = c.F2 + c.f + c.m * c.a;
    return simQ(`F₂ = <b>${c.F2} N</b> left, friction <b>${c.f} N</b>, mass <b>${c.m} kg</b>. Make a = <b>${c.a} m/s² to the right</b>.`, st({ F2: c.F2, fr: c.f, m: c.m }), s => ok(near(phys(s).a, c.a), `${s.F1} − ${c.F2} − ${c.f} = ${fmt(phys(s).net)} N → a = ${fmt(phys(s).a)} m/s².`, desc(s) + "."), { F1 }, { lv: 3, lock: ["F2", "fr", "m"], wrong: { F1: F1 - c.f } }); }
};

// ---------- diagram tasks ----------
function fbd(forces, m, x0, w, sc) {
  sc = sc || 0.6; const cx = x0 + w / 2, cy = 140; let g = `<rect x="${cx - 45}" y="${cy - 40}" width="90" height="80" rx="6" fill="url(#crate2)" stroke="#6d4c2f" stroke-width="3"/>${m ? T(cx, cy + 6, m + " kg", { s: 15, c: "#3e2723" }) : ""}`;
  forces.forEach(f => { const L = f.F * sc, col = f.c || (f.d > 0 ? "#1565c0" : "#c62828"), y = cy + (f.dy || 0);
    g += f.d > 0 ? arrow(cx + 45, cx + 45 + L, y, col, f.F + " N", 7) : arrow(cx - 45, cx - 45 - L, y, col, f.F + " N", 7); });
  return g;
}
const defs = `<defs><pattern id="crate2" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#d2a06c"/><line x1="0" y1="10" x2="20" y2="10" stroke="#b07d4a" stroke-width="2"/></pattern></defs>`;
const D = {
  netNum: diff => E.diaT("force-num", diff, 2, () => { const c = choice([{ r: [120, 30], l: [50], m: 20 }, { r: [80], l: [20, 20], m: 10 }, { r: [150], l: [60], m: 30 }, { r: [100, 50], l: [30], m: 40 }, { r: [60], l: [140], m: 20 }]);
    const R = c.r.reduce((a, b) => a + b, 0), Lf = c.l.reduce((a, b) => a + b, 0), net = Math.abs(R - Lf);
    const fs = c.r.map((F, i) => ({ F, d: 1, dy: (i - (c.r.length - 1) / 2) * 34 })).concat(c.l.map((F, i) => ({ F, d: -1, dy: (i - (c.l.length - 1) / 2) * 34 })));
    const vis = `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg">${defs}<rect width="740" height="280" fill="#f7fafd"/><rect y="182" width="740" height="6" fill="#90a4ae"/>${fbd(fs, c.m, 120, 500, 0.8)}${T(370, 250, "smooth floor — no friction", { s: 14, c: "#546e7a" })}</svg>`;
    return { kind: "num", title: "🧮 Net force and acceleration", prompt: "All the forces acting on the crate are shown.", visual: vis,
      fields: [{ label: "Net force (size)", unit: "N", answer: net }, { label: "Acceleration", unit: "m/s²", answer: net / c.m, tol: 0.011 }],
      explain: `Right: ${R} N, left: ${Lf} N → net = ${net} N ${R > Lf ? "to the right" : "to the left"}. a = ${net} ÷ ${c.m} = ${fmt(net / c.m)} m/s².`, summary: "Net force from a force diagram" }; }),
  pick: diff => E.diaT("force-pick", diff, 1, () => { const set = { b: [{ F: 80, d: 1 }, { F: 80, d: -1 }], r: [{ F: 120, d: 1 }, { F: 40, d: -1 }], l: [{ F: 50, d: 1 }, { F: 110, d: -1 }] }; const order = E.shuffle(["b", "r", "l"]);
    const ask = choice([["b", "Click the crate with <b>balanced forces</b> (it will not start moving)."], ["l", "Click the crate that will <b>accelerate to the left</b>."], ["r", "Click the crate with the <b>biggest net force to the right</b>."]]);
    return { kind: "pick", title: "👆 Balanced or unbalanced?", prompt: ask[1], answer: [ask[0]], names: { b: "the balanced crate", r: "the crate with net 80 N right", l: "the crate with net 60 N left" },
      visual: st => `<svg viewBox="0 0 740 250" xmlns="http://www.w3.org/2000/svg">${defs}<rect width="740" height="250" fill="#f4f8fc"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${6 + i * 245}" y="30" width="236" height="210" rx="14" fill="#fff" ${E.ring(st[k])}/>${fbd(set[k], 0, 6 + i * 245, 236, 0.55)}${T(124 + i * 245, 225, "Crate " + (i + 1), { s: 15 })}</g>`).join("")}</svg>`,
      explain: "Balanced: equal forces in opposite directions, net force 0. Otherwise the crate accelerates in the direction of the bigger force.", summary: "Balanced vs unbalanced forces" }; }),
  vt: diff => E.diaT("force-num", diff, 3, () => { const c = choice([{ v: 12, t: 4, m: 20 }, { v: 10, t: 5, m: 40 }, { v: 9, t: 3, m: 50 }, { v: 16, t: 8, m: 30 }]); const a = c.v / c.t;
    const px = t => 90 + t * 60, py = v => 230 - v * 10;
    let grid = ""; for (let t = 0; t <= 9; t++) grid += `<line x1="${px(t)}" x2="${px(t)}" y1="30" y2="230" stroke="#e0e7ef"/>${T(px(t), 250, t, { s: 12, c: "#546e7a" })}`; for (let v = 0; v <= 20; v += 2) grid += `<line x1="90" x2="${px(9)}" y1="${py(v)}" y2="${py(v)}" stroke="#e0e7ef"/>${T(80, py(v) + 4, v, { a: "end", s: 12, c: "#546e7a" })}`;
    const vis = `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#fff"/>${grid}<line x1="90" y1="230" x2="${px(9)}" y2="230" stroke="#263238" stroke-width="2"/><line x1="90" y1="230" x2="90" y2="30" stroke="#263238" stroke-width="2"/>
      <polyline points="${px(0)},${py(0)} ${px(c.t)},${py(c.v)} ${px(9)},${py(c.v)}" fill="none" stroke="#1565c0" stroke-width="4"/><circle cx="${px(c.t)}" cy="${py(c.v)}" r="6" fill="#1565c0"/>
      ${T(px(9) / 2 + 45, 275, "time (s)", { s: 13 })}${T(20, 24, "speed (m/s)", { a: "start", s: 13 })}${T(600, 60, "crate: " + c.m + " kg", { s: 15, c: "#3e2723" })}</svg>`;
    return { kind: "num", title: "📈 Read the speed–time graph", prompt: `The graph shows a ${c.m} kg crate pushed from rest (no friction).`, visual: vis,
      fields: [{ label: "Acceleration (first part)", unit: "m/s²", answer: a, tol: 0.011 }, { label: "Net force needed", unit: "N", answer: c.m * a, tol: 0.6 }],
      explain: `a = change in speed ÷ time = ${c.v} ÷ ${c.t} = ${fmt(a)} m/s². F = m × a = ${c.m} × ${fmt(a)} = ${fmt(c.m * a)} N. After that the speed is constant, so the net force is 0.`, summary: "Acceleration from a v–t graph" }; }),
  newton: diff => E.diaT("force-mcq", diff, 1, () => { const q = choice([
      { vis: { F1: 100, F2: 100, m: 40 }, ask: "This crate is already sliding to the right on a smooth floor. What happens next?", ok: "It keeps moving at the same speed", bad: ["It slows down and stops", "It speeds up", "It moves to the left"], ex: "Balanced forces do not change motion (Newton's 1st law): it keeps the same speed and direction." },
      { vis: { F1: 120, F2: 0, m: 40 }, ask: "The same push is used on a crate with double the mass (80 kg). The acceleration…", ok: "becomes half as big", bad: ["doubles", "stays the same", "becomes zero"], ex: "a = F ÷ m: double the mass → half the acceleration (Newton's 2nd law)." },
      { vis: { F1: 80, F2: 0, m: 20 }, ask: "The person pushes the crate with 80 N. How hard does the crate push back on the person?", ok: "80 N, in the opposite direction", bad: ["0 N — crates cannot push", "40 N", "160 N"], ex: "Newton's 3rd law: forces come in equal and opposite pairs." }]);
    return { kind: "mcq", title: "📘 Newton's laws", prompt: "Look at the forces on the crate.", visual: render(st(Object.assign({ showVals: false }, q.vis))), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Newton's laws" }; }),
  fricMcq: diff => E.diaT("force-mcq", diff, 2, () => ({ kind: "mcq", title: "🧱 Friction", prompt: "A person pushes a 50 kg crate with 60 N on a rough floor. Friction can hold up to 100 N.", visual: render(st({ F1: 60, m: 50, fr: 100, showVals: true })),
    ask: "Why does the crate not move?", options: E.mkOptions("Friction pushes back with 60 N, so the net force is 0", ["Friction is always 100 N, so it moves left", "The crate is too heavy for any force", "Gravity pulls it backwards"]),
    explain: "Static friction matches the push (up to its maximum), so the forces stay balanced until the push is more than 100 N.", summary: "Static friction" }))
};
const LEVELS = {
  1: { intro: "Balanced and unbalanced forces: two pushes act on a 40 kg crate on a smooth floor.", pool: () => [S(1, 1, C.balance), S(1, 1, C.tug), S(2, 1, C.netRight), S(2, 1, C.left), S(3, 1, C.netRight), D.pick(1), D.netNum(2), D.newton(2), D.pick(3)] },
  2: { intro: "Newton's 2nd law: a = F ÷ m. Change the force and the mass and watch the speed and distance after 4 s.", pool: () => [S(1, 1, C.accel), S(2, 1, C.accel), S(2, 1, C.leftA), S(2, 1, C.mass), S(3, 1, C.speed), S(3, 1, C.dist), D.newton(1), D.netNum(2), D.vt(3)] },
  3: { intro: "Friction opposes motion. Find the push needed to reach a target acceleration or speed.", pool: () => [S(1, 1, C.stuck), S(2, 1, C.fricA), S(2, 1, C.chooseFr), S(3, 1, C.speedFr), S(3, 1, C.fricTwo), D.fricMcq(1), D.netNum(2), D.vt(2), D.newton(3)] }
};
const explore = E.exploreSim({
  intro: "Push the crate with F₁ (right) and F₂ (left), then press ▶ to watch it move for 4 seconds.",
  state: lv => st({ showVals: true }), controls: lv => ctls(lv), render, run, runLabel: "▶ Push for 4 s",
  goals: lv => [
    { txt: "Make the crate move to the right", test: (s, m) => m.right },
    { txt: "Make the crate move to the left", test: (s, m) => m.left },
    { txt: "Use both pushes (each ≥ 50 N) and keep the crate still", test: (s, m) => m.still }
  ].concat(lv >= 2 ? [{ txt: "Run with 3 different masses", test: (s, m) => (m.ms || new Set()).size >= 3 }] : [])
   .concat(lv >= 3 ? [{ txt: "With friction ON, push but do not move the crate", test: (s, m) => m.stuck }] : []),
  track: (s, m, ran) => { if (!ran) return; const r = phys(s); if (r.a > 0) m.right = 1; if (r.a < 0) m.left = 1; if (r.net === 0 && s.F1 >= 50 && s.F2 >= 50) m.still = 1; (m.ms = m.ms || new Set()).add(s.m); if (s.fr && r.net === 0 && r.Fa !== 0) m.stuck = 1; },
  facts: lv => "📘 <b>Net force</b> = sum of forces (right +, left −). Balanced forces → no change in motion." + (lv >= 2 ? " <b>a = F ÷ m</b>: after 4 s from rest, speed = 4a, distance = 8a." : "") + (lv >= 3 ? " <b>Friction</b> always opposes the motion." : "")
});
E.start({ labId: "forces", total: 7, plan: { sim: 4, dia: 3 }, emoji: "📦", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["📦", "➡️", "⭐", "✨"],
  exploreDemo: lv => [{ set: { F1: 100 }, run: true }, { set: { F1: 0, F2: 80 }, run: true }, { set: { F1: 80, F2: 80 }, run: true }]
    .concat(lv >= 2 ? [{ set: { m: 10 }, run: true }, { set: { m: 80 }, run: true }] : [])
    .concat(lv >= 3 ? [{ set: { fr: 100, F1: 60, F2: 0 }, run: true }] : []) });
})();
