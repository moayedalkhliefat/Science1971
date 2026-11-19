"use strict";
// ===== Projectile Motion — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const g = 10;
function fly(s) { const a = s.ang * Math.PI / 180, vx = s.v * Math.cos(a), vy = s.v * Math.sin(a), h = s.h;
  const t = (vy + Math.sqrt(vy * vy + 2 * g * h)) / g; return { vx, vy, t, R: vx * t, H: h + vy * vy / (2 * g), tTop: vy / g }; }
const r1 = x => Math.round(x * 10) / 10;
function render(s) {
  const f = fly(s), show = s.reveal || s.showVals, sc = Math.min(13, 680 / Math.max(60, f.R + 10, (s.tx || 0) + 10)), gy = 400, x0 = 60, X = x => x0 + x * sc, Y = y => gy - y * sc;
  const tt = s._t != null ? s._t : (show ? f.t : 0); let path = "";
  if (tt > 0) { const pts = []; for (let i = 0; i <= 60; i++) { const t = tt * i / 60; pts.push(`${X(f.vx * t).toFixed(1)},${Y(s.h + f.vy * t - 0.5 * g * t * t).toFixed(1)}`); } path = `<polyline points="${pts.join(" ")}" fill="none" stroke="#e65100" stroke-width="3" stroke-dasharray="6 5"/>`; }
  const bx = f.vx * tt, by = s.h + f.vy * tt - 0.5 * g * tt * tt;
  let ticks = ""; const step = sc > 9 ? 10 : sc > 4 ? 20 : 50; for (let d = 0; X(d) < 840; d += step) ticks += `<line x1="${X(d)}" x2="${X(d)}" y1="${gy}" y2="${gy + 8}" stroke="#5d4037" stroke-width="2"/>${T(X(d), gy + 24, d + " m", { s: 11, c: "#5d4037" })}`;
  const tgt = s.tx ? `<g transform="translate(${X(s.tx)},${gy})"><ellipse rx="${Math.max(10, 2 * sc)}" ry="6" fill="#e53935"/><ellipse rx="${Math.max(5, sc)}" ry="3" fill="#fff"/>${T(0, -14, "target " + s.tx + " m", { s: 12, c: "#c62828" })}</g>` : "";
  const wall = s.wall ? `<rect x="${X(s.wall[0]) - 6}" y="${Y(s.wall[1])}" width="12" height="${s.wall[1] * sc}" fill="#8d6e63"/>${T(X(s.wall[0]), Y(s.wall[1]) - 8, "wall " + s.wall[1] + " m", { s: 12, c: "#5d4037" })}` : "";
  const a = s.ang * Math.PI / 180;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#e8f1fb"/><rect y="${gy}" width="860" height="50" fill="#a5d6a7"/>${ticks}
    ${s.h ? `<rect x="${x0 - 40}" y="${Y(s.h)}" width="60" height="${s.h * sc}" fill="#bcaaa4" stroke="#8d6e63"/>${T(x0 - 10, Y(s.h) + 18, s.h + " m", { s: 12, c: "#4e342e" })}` : ""}
    <g transform="translate(${x0},${Y(s.h)}) rotate(${-s.ang})"><rect x="-6" y="-9" width="46" height="18" rx="6" fill="#37474f"/></g><circle cx="${x0}" cy="${Y(s.h)}" r="12" fill="#546e7a"/>
    ${wall}${tgt}${path}${tt > 0 ? `<circle cx="${X(bx)}" cy="${Y(Math.max(0, by))}" r="8" fill="#212121"/>` : ""}
    <g transform="translate(600,16)"><rect width="246" height="${show ? 128 : 74}" rx="12" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(123, 26, `v = ${s.v} m/s · angle ${s.ang}° · h = ${s.h} m`, { s: 13, c: "#0d47a1" })}
      ${T(123, 52, show ? `range: ${r1(f.R)} m` : "range: ? m", { s: 15, c: "#c62828" })}${show ? T(123, 78, `max height: ${r1(f.H)} m`, { s: 13, c: "#1565c0" }) + T(123, 100, `time of flight: ${r1(f.t)} s`, { s: 13, c: "#1565c0" }) + T(123, 120, `vₓ = ${r1(f.vx)} m/s (constant)`, { s: 12, c: "#546e7a" }) : ""}</g></svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "ang", type: "range", label: "Angle", min: 0, max: 90, step: 5, nudge: 5, unit: "°", lock: lk("ang") },
  { id: "v", type: "range", label: "Launch speed", min: 5, max: 30, step: 1, nudge: 1, unit: "m/s", lock: lk("v") },
  { id: "h", type: "choice", label: "Launch height", options: [0, 5, 20, 45].map(v => ({ v, label: v + " m" })), hide: () => lv < 2, lock: lk("h") }]; };
const st = o => Object.assign({ ang: 30, v: 15, h: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; const f = fly(s), t0 = performance.now(), dur = Math.min(2400, 600 + f.t * 400);
  const fr = now => { const k = Math.min(1, (now - t0) / dur); s._t = f.t * k; box.innerHTML = render(s); if (k < 1) requestAnimationFrame(fr); else { s._t = null; res(); } }; requestAnimationFrame(fr); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const hits = (s, x, tol) => Math.abs(fly(s).R - x) <= (tol || 1);
const say = s => { const f = fly(s); return `${s.v} m/s at ${s.ang}° lands at ${r1(f.R)} m`; };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🎯 Projectile challenge", prompt: "Aim the cannon, then press <b>▶ Run & check</b> to fire.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "From the ground, range = v² × sin(2θ) ÷ 10. 45° gives the longest range; complementary angles (30° and 60°) give the same range. Horizontal speed stays constant." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("proj-sim", diff, uses, mk);
const C = {
  hit: () => { const c = choice([[20, { ang: 45, v: 14 }], [40, { ang: 45, v: 20 }], [10, { ang: 45, v: 10 }], [90, { ang: 45, v: 30 }]]);
    return simQ(1, `Hit the target <b>${c[0]} m</b> away (within 1 m).`, st({ tx: c[0] }), s => ok(hits(s, c[0]), say(s) + ". Hit!", say(s) + "."), c[1], { wrong: Object.assign({}, c[1], { v: c[1].v - 2 }) }); },
  max: () => simQ(1, "The speed is fixed at <b>20 m/s</b>. Choose the angle that sends the ball <b>as far as possible</b>.", st({ v: 20, ang: 20 }), s => ok(s.ang === 45, "45° gives the maximum range: 40 m.", say(s) + " — another angle goes further."), { ang: 45 }, { lock: ["v"], wrong: { ang: 50 } }),
  same: () => { const a0 = choice([30, 20, 15]); return simQ(1, `At 20 m/s, ${a0}° lands at ${r1(fly(st({ v: 20, ang: a0 })).R)} m. Find a <b>different angle</b> that lands at the <b>same place</b>.`, st({ v: 20, ang: a0 }), s => ok(s.ang !== a0 && hits(st({ v: 20, ang: a0 }), fly(s).R, 0.05), `${a0}° and ${90 - a0}° add up to 90°: same range, different height.`, say(s) + "."), { ang: 90 - a0 }, { lock: ["v"], wrong: { ang: 90 - a0 - 5 } }); },
  high: () => simQ(1, "Make the ball reach a height of exactly <b>20 m</b> (max height).", st({ v: 25 }), s => ok(Math.abs(fly(s).H - 20) < 0.01, "Straight up at 20 m/s: H = 20² ÷ 20 = 20 m.", `Max height ${r1(fly(s).H)} m.`), { ang: 90, v: 20 }, { wrong: { ang: 90, v: 21 } }),
  cliff: () => simQ(2, "From a <b>20 m</b> cliff, fire <b>horizontally</b> (0°) to hit the target <b>30 m</b> away.", st({ h: 20, ang: 0, tx: 30 }), s => ok(s.ang === 0 && hits(s, 30, 0.5), "Falling 20 m takes 2 s; 15 m/s × 2 s = 30 m.", s.ang !== 0 ? "Fire horizontally (0°)." : say(s) + "."), { v: 15 }, { lock: ["h", "ang"], wrong: { v: 20 } }),
  fall: () => { const h = choice([5, 45]), t = Math.sqrt(2 * h / g); return simQ(2, `Fire horizontally from <b>${h} m</b> so the ball lands <b>${r1(20 * t)} m</b> away.`, st({ h, ang: 0, tx: r1(20 * t) }), s => ok(hits(s, 20 * t, 0.5), `Time to fall ${h} m = ${r1(t)} s; 20 m/s × ${r1(t)} s = ${r1(20 * t)} m.`, say(s) + "."), { v: 20 }, { lock: ["h", "ang"], wrong: { v: 25 } }); },
  height: () => simQ(2, "Fire at <b>0°</b> and <b>10 m/s</b>. Choose the launch height so the ball lands <b>30 m</b> away.", st({ ang: 0, v: 10, tx: 30 }), s => ok(hits(s, 30, 0.5), "From 45 m the fall takes 3 s: 10 × 3 = 30 m.", say(s) + "."), { h: 45 }, { lock: ["ang", "v"], wrong: { h: 20 } }),
  tower: () => simQ(2, "From <b>20 m</b> high at <b>20 m/s</b>, choose an angle to land between <b>45 and 55 m</b>.", st({ h: 20, v: 20, tx: 50 }), s => ok(fly(s).R >= 45 && fly(s).R <= 55, say(s) + ".", say(s) + "."), { ang: 20 }, { lock: ["h", "v"], wrong: { ang: 60 } }),
  wall: () => simQ(3, "Clear the <b>8 m wall</b> at 20 m and land beyond it, with speed <b>20 m/s</b>, from the ground.", st({ v: 20, wall: [20, 8], ang: 20 }), s => { const f = fly(s), t = 20 / f.vx, y = f.vy * t - 5 * t * t; return ok(y > 8 && f.R > 20, `Height at the wall: ${r1(y)} m — cleared!`, f.R <= 20 ? "The ball lands before the wall." : `Height at the wall only ${r1(y)} m.`); }, { ang: 50 }, { lock: ["v", "h"], wrong: { ang: 30 } }),
  time: () => simQ(3, "Make the flight from the ground last exactly <b>3 s</b> at <b>30 m/s</b>.", st({ v: 30 }), s => ok(Math.abs(fly(s).t - 3) < 0.01, "vᵧ = 15 m/s → sin θ = 0.5 → θ = 30°.", `Flight time ${r1(fly(s).t)} s.`), { ang: 30 }, { lock: ["v", "h"], wrong: { ang: 35 } }),
  far: () => simQ(3, "Hit the target <b>70 m</b> away, launching from <b>45 m</b> high.", st({ h: 45, tx: 70 }), s => ok(hits(s, 70, 1.5), say(s) + ". Hit!", say(s) + "."), { ang: 0, v: 23 }, { lock: ["h"], wrong: { ang: 0, v: 20 } }),
  mid: () => simQ(3, "At <b>25 m/s</b> from the ground, hit the target at <b>60 m</b> with the <b>lower</b> of the two possible angles.", st({ v: 25, tx: 60 }), s => ok(hits(s, 60, 1.5) && s.ang < 45, say(s) + ".", hits(s, 60, 1.5) ? "That hits — but use the lower angle." : say(s) + "."), { ang: 35 }, { lock: ["v", "h"], wrong: { ang: 55 } })
};

// ---------- diagram tasks ----------
const D = {
  graphNum: diff => E.diaT("proj-num", diff, 2, () => { const s = choice([st({ v: 20, ang: 45 }), st({ v: 20, ang: 30 }), st({ v: 30, ang: 60 })]), f = fly(s);
    return { kind: "num", title: "📏 Read the path", prompt: "The ball was fired from the ground. Use the readout and the path.", visual: render(Object.assign({}, s, { showVals: true })),
      fields: [{ label: "Horizontal speed vₓ", unit: "m/s", answer: r1(f.vx), tol: 0.11 }, { label: "Horizontal distance after 1 s", unit: "m", answer: r1(f.vx), tol: 0.11 }], explain: `There is no horizontal force, so vₓ = ${r1(f.vx)} m/s stays constant: ${r1(f.vx)} m every second.`, summary: "Horizontal motion" }; }),
  dropNum: diff => E.diaT("proj-num", diff, 3, () => { const c = choice([[5, 1], [20, 2], [45, 3], [80, 4]]), v = choice([10, 15, 20]);
    return { kind: "num", title: "⬇️ Horizontal launch", prompt: `A ball is fired horizontally at ${v} m/s from ${c[0]} m high (g = 10 m/s²).`, visual: render(st({ h: Math.min(45, c[0]), ang: 0, v, showVals: false })),
      fields: [{ label: "Time to reach the ground", unit: "s", answer: c[1] }, { label: "Horizontal distance", unit: "m", answer: v * c[1] }], explain: `h = ½gt² → t = √(2×${c[0]}÷10) = ${c[1]} s. d = ${v} × ${c[1]} = ${v * c[1]} m.`, summary: "Horizontal launch calculation" }; }),
  pick: diff => E.diaT("proj-pick", diff, 1, () => { const sets = { a: st({ v: 20, ang: 30 }), b: st({ v: 20, ang: 45 }), c: st({ v: 20, ang: 75 }) }, order = E.shuffle(["a", "b", "c"]);
    const q = choice([["b", "the <b>longest range</b>"], ["c", "the <b>highest path</b>"], ["a", "the <b>lowest path</b>"]]);
    return { kind: "pick", title: "👆 Compare the paths", prompt: "Three balls fired at the same speed. Click the one with " + q[1] + ".", answer: [q[0]], names: { a: "the 30° shot", b: "the 45° shot", c: "the 75° shot" },
      visual: st2 => { const X = x => 40 + x * 16, Y = y => 220 - y * 16; return `<svg viewBox="0 0 740 250" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="250" fill="#e8f1fb"/><rect y="220" width="740" height="30" fill="#a5d6a7"/>${order.map((k, i) => { const f = fly(sets[k]), pts = []; for (let j = 0; j <= 40; j++) { const t = f.t * j / 40; pts.push(`${X(f.vx * t)},${Y(f.vy * t - 5 * t * t)}`); } const col = ["#e53935", "#1e88e5", "#43a047"][i];
        return `<g class="pk" data-k="${k}"><polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="12" opacity=".001"/><polyline points="${pts.join(" ")}" fill="none" stroke="${col}" stroke-width="4" ${st2[k] ? 'stroke-width="7"' : ""}/>${T(X(f.vx * f.tTop), Y(f.H) - 10, "path " + (i + 1), { s: 13, c: col })}</g>`; }).join("")}</svg>`; },
      explain: "At the same speed: 45° goes furthest, steep angles go highest, low angles stay low.", summary: "Angle vs range and height" }; }),
  mcq: diff => E.diaT("proj-mcq", diff, 2, () => { const q = choice([
      { ask: "One ball is dropped and another fired horizontally from the same height at the same moment. Which lands first?", ok: "They land at the same time", bad: ["The dropped ball", "The fired ball", "It depends on the mass"], ex: "Vertical motion does not depend on horizontal speed: both fall the same height with the same acceleration." },
      { ask: "At the top of its path, the ball's vertical speed is…", ok: "zero", bad: ["at its maximum", "equal to the launch speed", "equal to the horizontal speed"], ex: "At the top it stops going up before coming down: vᵧ = 0, but vₓ is still there." },
      { ask: "Ignoring air resistance, which force acts on the ball during flight?", ok: "Only gravity, downwards", bad: ["A forward force from the cannon", "Gravity and a forward force", "No force at all"], ex: "Once launched, only gravity acts; that is why vₓ stays constant." }]);
    return { kind: "mcq", title: "📘 Projectile ideas", prompt: "Think about horizontal and vertical motion.", visual: render(st({ v: 20, ang: 45, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Projectile ideas" }; })
};
const LEVELS = {
  1: { intro: "Fire from the ground. Change the angle and the speed to hit targets.", pool: () => [S(1, 1, C.max), S(1, 1, C.hit), S(2, 1, C.same), S(2, 1, C.hit), S(3, 1, C.high), D.pick(1), D.mcq(2), D.graphNum(3)] },
  2: { intro: "Launch from a height. Horizontal and vertical motion are independent.", pool: () => [S(1, 1, C.cliff), S(2, 1, C.fall), S(2, 1, C.height), S(3, 1, C.tower), D.pick(1), D.graphNum(2), D.dropNum(3)] },
  3: { intro: "Expert shots: clear walls, time the flight and choose between two possible angles.", pool: () => [S(1, 1, C.time), S(2, 1, C.wall), S(3, 1, C.far), S(3, 1, C.mid), D.mcq(1), D.dropNum(2), D.dropNum(3)] }
};
const explore = E.exploreSim({
  intro: "Set the angle and speed (and height in higher levels), then fire with ▶.",
  state: lv => st({ showVals: true }), controls: lv => ctls(lv), render, run, runLabel: "▶ Fire",
  goals: lv => [{ txt: "Fire at 45°", test: (s, m) => m.a45 }, { txt: "Make the ball go more than 50 m", test: (s, m) => m.far }, { txt: "Fire straight up (90°)", test: (s, m) => m.up }].concat(lv >= 2 ? [{ txt: "Fire horizontally from a height", test: (s, m) => m.hor }] : []),
  track: (s, m, ran) => { if (!ran) return; if (s.ang === 45) m.a45 = 1; if (fly(s).R > 50) m.far = 1; if (s.ang === 90) m.up = 1; if (s.ang === 0 && s.h > 0) m.hor = 1; },
  facts: () => "📘 A projectile moves at a <b>constant horizontal speed</b> while gravity speeds it up <b>vertically</b> (g = 10 m/s²)."
});
E.start({ labId: "projectile", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🎯", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🎯", "💥", "⭐", "✨"],
  exploreDemo: lv => [{ set: { ang: 45, v: 25 }, run: true }, { set: { ang: 90 }, run: true }].concat(lv >= 2 ? [{ set: { ang: 0, h: 20 }, run: true }] : []) });
})();
