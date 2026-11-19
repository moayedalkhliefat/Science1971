"use strict";
// ===== Gravity & Orbits — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const K = 2 * Math.PI / 30; // km/s → AU/yr (so 30 km/s at 1 AU around 1 Sun = circular)
const vc = s => 30 * Math.sqrt(s.M / s.r);
const q = s => s.v / vc(s);
const kind = s => { const x = q(s); if (Math.abs(x - 1) <= 0.03) return "circle"; if (x >= Math.SQRT2) return "escape"; if (x < 1 && s.r * x * x / (2 - x * x) < 0.15) return "crash"; return "ellipse"; };
const far = s => { const x = q(s); if (x >= Math.SQRT2) return Infinity; const a = s.r / (2 - x * x); return Math.max(s.r, 2 * a - s.r); };
const near_ = s => { const x = q(s); if (x >= Math.SQRT2) return s.r; const a = s.r / (2 - x * x); return Math.min(s.r, 2 * a - s.r); };
const per = s => Math.round(Math.pow(s.r, 1.5) / Math.sqrt(s.M) * 100) / 100;
const force = s => Math.round(s.M * s.m / (s.r * s.r) * 1000) / 1000;
function path(s) { const GM = 4 * Math.PI * Math.PI * s.M; let x = s.r, y = 0, vx = 0, vy = s.v * K; const pts = [[x, y]], dt = 0.0008; let crashed = false;
  for (let i = 0; i < 25000; i++) { let r = Math.hypot(x, y); vx += -GM * x / (r * r * r) * dt / 2; vy += -GM * y / (r * r * r) * dt / 2; x += vx * dt; y += vy * dt; r = Math.hypot(x, y); vx += -GM * x / (r * r * r) * dt / 2; vy += -GM * y / (r * r * r) * dt / 2;
    if (i % 12 === 0) pts.push([x, y]); if (r < 0.15) { crashed = true; break; } if (r > 9) break; if (i > 400 && Math.hypot(x - s.r, y) < 0.02 && vy > 0) break; }
  return { pts, crashed }; }
function render(s) {
  const show = s.reveal || s.showVals, cx = 300, cy = 225, sc = 48, P = path(s), k = kind(s), n = s._k != null ? Math.max(2, Math.round(P.pts.length * s._k)) : (s.reveal ? P.pts.length : 0);
  const stars = Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 97) % 860}" cy="${(i * 53) % 450}" r="${i % 3 ? 1 : 1.6}" fill="#fff" opacity=".6"/>`).join("");
  const sr = 14 + 8 * Math.sqrt(s.M), pr = 6 + 3 * Math.sqrt(s.m || 1);
  let g = stars + [1, 2, 3, 4].map(r => `<circle cx="${cx}" cy="${cy}" r="${r * sc}" fill="none" stroke="#37474f" stroke-dasharray="3 6"/>${T(cx + r * sc + 4, cy - 4, r + " AU", { a: "start", s: 10, c: "#78909c" })}`).join("");
  g += `<circle cx="${cx}" cy="${cy}" r="${sr + 10}" fill="#ffca28" opacity=".25"/><circle cx="${cx}" cy="${cy}" r="${sr}" fill="#ffb300"/>${T(cx, cy + sr + 18, s.M + " Sun" + (s.M === 1 ? "" : "s"), { s: 12, c: "#ffe082" })}`;
  if (n > 1) g += `<polyline points="${P.pts.slice(0, n).map(p => (cx + p[0] * sc).toFixed(1) + "," + (cy - p[1] * sc).toFixed(1)).join(" ")}" fill="none" stroke="#4fc3f7" stroke-width="2.5"/>`;
  const pp = n > 1 ? P.pts[n - 1] : [s.r, 0];
  g += `<circle cx="${cx + pp[0] * sc}" cy="${cy - pp[1] * sc}" r="${pr}" fill="#42a5f5" stroke="#bbdefb" stroke-width="2"/>`;
  if (n <= 1) g += `<line x1="${cx + s.r * sc}" y1="${cy}" x2="${cx + s.r * sc}" y2="${cy - Math.min(120, s.v * 2)}" stroke="#66bb6a" stroke-width="3"/><polygon points="${cx + s.r * sc},${cy - Math.min(120, s.v * 2) - 8} ${cx + s.r * sc - 6},${cy - Math.min(120, s.v * 2) + 2} ${cx + s.r * sc + 6},${cy - Math.min(120, s.v * 2) + 2}" fill="#66bb6a"/>${T(cx + s.r * sc + 10, cy - Math.min(120, s.v * 2) / 2, s.v + " km/s", { a: "start", s: 12, c: "#a5d6a7" })}`;
  if (s.lv >= 3) g += `<line x1="${cx + s.r * sc}" y1="${cy}" x2="${cx + s.r * sc - Math.min(110, 30 * force(s))}" y2="${cy}" stroke="#ef5350" stroke-width="3"/>${T(cx + s.r * sc - 10, cy + 20, "gravity", { a: "end", s: 11, c: "#ef9a9a" })}`;
  const msg = { circle: "🔵 circular orbit", ellipse: "🥚 elliptical orbit", escape: "🚀 escapes the star", crash: "💥 crashes into the star" }[k];
  const panel = `<g transform="translate(610,30)"><rect width="235" height="${show ? 230 : 150}" rx="14" fill="#102027" stroke="#37474f" stroke-width="2"/>${T(117, 28, "star " + s.M + " · distance " + fmt(s.r) + " AU", { s: 13, c: "#cfd8dc" })}${T(117, 52, "speed " + s.v + " km/s" + (s.lv >= 3 ? " · planet " + s.m + " Earths" : ""), { s: 13, c: "#cfd8dc" })}
    ${show ? T(117, 90, msg, { s: 16, c: "#fff" }) + (k === "circle" || k === "ellipse" ? T(117, 120, k === "circle" ? "year = " + fmt(per(s)) + " years" : "farthest " + fmt(Math.round(far(s) * 100) / 100) + " AU", { s: 14, c: "#80deea" }) : "") + T(117, 150, "circular speed here: " + fmt(Math.round(vc(s) * 10) / 10) + " km/s", { s: 12, c: "#b0bec5" }) + (s.lv >= 3 ? T(117, 182, "gravity force = " + fmt(force(s)) + " × Earth's", { s: 14, c: "#ef9a9a" }) : "") : T(117, 100, "press ▶ to launch", { s: 13, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#0b1426"/>${g}${panel}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "v", type: "range", label: "Launch speed (sideways)", min: 0, max: 70, step: 1, nudge: 1, unit: "km/s", lock: lk("v") },
  { id: "r", type: "range", label: "Distance from the star", min: 0.5, max: 4, step: 0.25, nudge: 0.25, unit: "AU", fmt: v => fmt(v), lock: lk("r") },
  { id: "M", type: "choice", label: "Star mass", options: [0.25, 1, 4].map(v => ({ v, label: v + " Sun" + (v === 1 ? "" : "s") })), hide: () => lv < 2, lock: lk("M") },
  { id: "m", type: "choice", label: "Planet mass", options: [0.5, 1, 2].map(v => ({ v, label: v + " Earth" + (v === 1 ? "" : "s") })), hide: () => lv < 3, lock: lk("m") }]; };
const st = (lv, o) => Object.assign({ lv, v: 30, r: 1, M: 1, m: 1 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; const t0 = performance.now(), dur = 2200;
  const f = now => { const kk = Math.min(1, (now - t0) / dur); s._k = kk; box.innerHTML = render(s); if (kk < 1) requestAnimationFrame(f); else { s._k = null; box.innerHTML = render(s); res(); } }; requestAnimationFrame(f); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => ({ circle: `circular orbit (year ${fmt(per(s))} years)`, ellipse: `elliptical orbit (out to ${fmt(Math.round(far(s) * 100) / 100)} AU, in to ${fmt(Math.round(near_(s) * 100) / 100)} AU)`, escape: "the planet escapes", crash: "the planet crashes into the star" })[kind(s)];
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🪐 Orbit challenge", prompt: "Set the launch, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: lv >= 3 ? "Gravity force ∝ (star mass × planet mass) ÷ distance². Twice as far → ¼ of the force." : "Circular speed = 30 × √(star mass ÷ distance) km/s. Too slow → falls in; much faster (×1.41) → escapes. Year = distance^1.5 ÷ √(star mass)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("orb-sim", diff, uses, mk);
const C = {
  circ: () => { const c = choice([[2, 21], [4, 15], [0.5, 42], [1, 30]]); return simQ(1, `The planet starts <b>${c[0]} AU</b> from the star. Give it a <b>circular orbit</b>.`, st(1, { r: c[0], v: 5 }), s => ok(kind(s) === "circle", said(s) + ".", said(s) + "."), { v: c[1] }, { lock: ["r"], wrong: { v: c[1] + 3 } }); },
  crash: () => simQ(1, "Start at <b>1 AU</b>. Make the planet <b>crash into the star</b> — but it must move (speed above 0).", st(1, { r: 1, v: 30 }), s => ok(kind(s) === "crash" && s.v > 0, said(s) + ": too slow to stay in orbit.", s.v === 0 ? "Give it some sideways speed." : said(s) + "."), { v: 10 }, { lock: ["r"], wrong: { v: 20 } }),
  esc: () => simQ(1, "Start at <b>1 AU</b>. Make the planet <b>escape</b> with the <b>smallest</b> whole speed.", st(1, { r: 1, v: 30 }), s => ok(kind(s) === "escape" && s.v === 43, "Escape speed = √2 × 30 = 42.4 km/s → 43.", kind(s) === "escape" ? "It escapes, but a smaller speed also works." : said(s) + "."), { v: 43 }, { lock: ["r"], wrong: { v: 42 } }),
  ell: () => simQ(1, "Start at <b>1 AU</b>. Make an orbit that reaches about <b>2 AU</b> at its farthest (±0.15 AU).", st(1, { r: 1, v: 30 }), s => ok(kind(s) !== "escape" && Math.abs(far(s) - 2) <= 0.15, said(s) + ".", said(s) + "."), { v: 35 }, { lock: ["r"], wrong: { v: 33 } }),
  inner: () => simQ(1, "Start at <b>3 AU</b>. Make an orbit that comes as close as about <b>1 AU</b> to the star (±0.15 AU).", st(1, { r: 3, v: 17 }), s => ok(kind(s) === "ellipse" && Math.abs(near_(s) - 1) <= 0.15, said(s) + ".", said(s) + "."), { v: 12 }, { lock: ["r"], wrong: { v: 15 } }),
  y8: () => simQ(2, "Make a <b>circular</b> orbit around <b>1 Sun</b> with a year of <b>8 years</b>.", st(2, { v: 30 }), s => ok(kind(s) === "circle" && Math.abs(per(s) - 8) < 0.01, "4 AU: 4^1.5 = 8 years; circular speed 15 km/s.", said(s) + "."), { r: 4, v: 15 }, { lock: ["M"], wrong: { r: 4, v: 18 } }),
  y4: () => simQ(2, "Around a <b>4-Sun</b> star, make a circular orbit with a year of <b>4 years</b>.", st(2, { M: 4, v: 30 }), s => ok(kind(s) === "circle" && Math.abs(per(s) - 4) < 0.01, "4 AU: 8 ÷ √4 = 4 years; speed 30 km/s.", said(s) + "."), { r: 4, v: 30 }, { lock: ["M"], wrong: { r: 2, v: 42 } }),
  y2: () => simQ(2, "At <b>1 AU</b>, make a circular orbit with a year of <b>2 years</b>. Choose the star.", st(2, { r: 1, v: 30 }), s => ok(kind(s) === "circle" && Math.abs(per(s) - 2) < 0.01, "A ¼-Sun star: 1 ÷ √0.25 = 2 years at 15 km/s.", said(s) + "."), { M: 0.25, v: 15 }, { lock: ["r"], wrong: { M: 1, v: 30 } }),
  fast: () => simQ(2, "At <b>1 AU</b>, make the <b>fastest</b> possible circular orbit.", st(2, { r: 1 }), s => ok(kind(s) === "circle" && s.M === 4, "Biggest star: 30 × √4 = 60 km/s, year 0.5.", said(s) + "."), { M: 4, v: 60 }, { lock: ["r"], wrong: { M: 1, v: 30 } }),
  f4: () => simQ(3, "Make the gravity force on the planet <b>4 times</b> Earth's (1 Sun, 1 Earth-mass).", st(3, { r: 2 }), s => ok(Math.abs(force(s) - 4) < 0.001, "Half the distance → 4 × the force (inverse square).", `Force = ${fmt(force(s))} × Earth's.`), { r: 0.5 }, { lock: ["M", "m"], wrong: { r: 1 } }),
  fq: () => simQ(3, "Make the force <b>¼ of Earth's</b> AND keep a <b>circular orbit</b> (1 Sun, 1 Earth-mass).", st(3, { r: 1, v: 30 }), s => ok(Math.abs(force(s) - 0.25) < 0.001 && kind(s) === "circle", "Twice as far (2 AU) → ¼ force; circular speed 21 km/s.", `Force ${fmt(force(s))}, ${said(s)}.`), { r: 2, v: 21 }, { lock: ["M", "m"], wrong: { r: 2, v: 30 } }),
  fm: () => simQ(3, "At <b>2 AU</b>, make the force exactly <b>1 × Earth's</b> using an <b>Earth-mass</b> planet.", st(3, { r: 2 }), s => ok(Math.abs(force(s) - 1) < 0.001 && s.m === 1, "4 Suns ÷ 2² = 1.", `Force = ${fmt(force(s))}.`), { M: 4 }, { lock: ["r", "m"], wrong: { M: 1 } }),
  fmass: () => simQ(3, "A <b>1-Sun</b> star, <b>1 AU</b>. Make the force <b>2 × Earth's</b>.", st(3), s => ok(Math.abs(force(s) - 2) < 0.001, "Double the planet mass → double the force.", `Force = ${fmt(force(s))}.`), { m: 2 }, { lock: ["r", "M"], wrong: { m: 0.5 } })
};

// ---------- diagram tasks ----------
const D = {
  pick: diff => E.diaT("orb-pick", diff, 1, () => { const sets = { c: st(1, { r: 1.5, v: Math.round(30 / Math.sqrt(1.5)) }), e: st(1, { r: 1, v: 37 }), x: st(1, { r: 1, v: 48 }) }, order = E.shuffle(["c", "e", "x"]);
    const qq = choice([["x", "the planet that <b>escapes</b>"], ["c", "the <b>circular</b> orbit"], ["e", "the <b>elliptical</b> orbit"]]);
    return { kind: "pick", title: "👆 Identify the orbit", prompt: "Click " + qq[1] + ".", answer: [qq[0]], names: { c: "circular orbit", e: "elliptical orbit", x: "escaping planet" },
      visual: st2 => `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="300" fill="#0b1426"/>${order.map((k, i) => { const P = path(sets[k]), cx = 190 + i * 298, cy = 140, sc = 32;
        return `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="284" rx="14" fill="#102027" ${E.ring(st2[k])}/><svg x="${8 + i * 298}" y="8" width="286" height="284" viewBox="${8 + i * 298} 8 286 284"><circle cx="${cx}" cy="${cy}" r="16" fill="#ffb300"/><polyline points="${P.pts.map(p => (cx + p[0] * sc).toFixed(1) + "," + (cy - p[1] * sc).toFixed(1)).join(" ")}" fill="none" stroke="#4fc3f7" stroke-width="3"/></svg>${T(151 + i * 298, 282, "Orbit " + (i + 1), { s: 13, c: "#cfd8dc" })}</g>`; }).join("")}</svg>`,
      explain: "Exactly the circular speed → circle; a little faster or slower → ellipse; √2 × the circular speed or more → it escapes.", summary: "Orbit shapes" }; }),
  fNum: diff => E.diaT("orb-num", diff, 2, () => { const c = choice([[2, 0.25], [3, 1 / 9], [0.5, 4], [4, 0.0625]]);
    return { kind: "num", title: "📉 Inverse square law", prompt: `A planet is moved from 1 AU to ${c[0]} AU from the same star.`, visual: render(st(3, { r: c[0], showVals: false })),
      fields: [{ label: "New force (× the old force)", unit: "×", answer: c[1], tol: 0.006 }], explain: `F ∝ 1 ÷ r²: 1 ÷ ${c[0]}² = ${fmt(c[1], 4)}.`, summary: "Gravity and distance" }; }),
  tNum: diff => E.diaT("orb-num", diff, 3, () => { const c = choice([[4, 1, 8], [9, 1, 27], [1, 4, 0.5], [4, 4, 4]]);
    return { kind: "num", title: "📅 How long is the year?", prompt: `A planet orbits a ${c[1]}-Sun star in a circle of radius ${c[0]} AU. (Year = r^1.5 ÷ √M)`, visual: render(st(2, { r: Math.min(4, c[0]), M: c[1], v: Math.round(vc({ M: c[1], r: Math.min(4, c[0]) })), showVals: false })),
      fields: [{ label: "Length of its year", unit: "years", answer: c[2], tol: 0.02 }], explain: `${c[0]}^1.5 ÷ √${c[1]} = ${c[2]} years.`, summary: "Kepler's third law" }; }),
  mcq: diff => E.diaT("orb-mcq", diff, 2, () => { const qq = choice([
      { ask: "Why doesn't the Earth fly off into space?", ok: "The Sun's gravity keeps pulling it towards the Sun", bad: ["There is no force on the Earth", "The Moon holds it in place", "Space is too thick to move through"], ex: "Gravity provides the centripetal force that keeps bending its path into an orbit." },
      { ask: "If the Sun's gravity suddenly disappeared, the Earth would…", ok: "move off in a straight line", bad: ["fall into the Sun", "stop moving", "keep orbiting"], ex: "With no force, an object keeps moving in a straight line (Newton's first law)." },
      { ask: "Planets further from the Sun…", ok: "move more slowly and have longer years", bad: ["move faster and have shorter years", "do not feel the Sun's gravity", "have circular orbits only"], ex: "Weaker gravity far away → lower orbital speed and a much longer path." }]);
    return { kind: "mcq", title: "📘 Gravity", prompt: "Think about orbits.", visual: render(st(1, { r: 2, v: 21, reveal: true })), ask: qq.ask, options: E.mkOptions(qq.ok, qq.bad), explain: qq.ex, summary: "Gravity ideas" }; })
};
const LEVELS = {
  1: { intro: "Launch a planet sideways next to the Sun. Too slow → it falls in. Just right → circle. Too fast → it escapes.", pool: () => [S(1, 1, C.circ), S(2, 1, C.crash), S(2, 1, C.esc), S(3, 1, C.ell), S(3, 1, C.inner), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Bigger stars and bigger orbits: how long is a year?", pool: () => [S(1, 1, C.fast), S(2, 1, C.y8), S(2, 1, C.y2), S(3, 1, C.y4), D.pick(1), D.tNum(2), D.mcq(3)] },
  3: { intro: "The gravity force: depends on both masses and on the distance squared.", pool: () => [S(1, 1, C.fmass), S(2, 1, C.f4), S(2, 1, C.fm), S(3, 1, C.fq), D.fNum(1), D.tNum(2), D.fNum(3)] }
};
const explore = E.exploreSim({
  intro: "Set the launch speed and distance (and the star mass in higher levels), then press ▶ to launch the planet.",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render, run, runLabel: "▶ Launch",
  goals: () => [{ txt: "Make a circular orbit", test: (s, m) => m.circle }, { txt: "Make the planet crash", test: (s, m) => m.crash }, { txt: "Make the planet escape", test: (s, m) => m.escape }],
  track: (s, m, ran) => { if (ran) m[kind(s)] = 1; },
  facts: lv => "📘 Gravity pulls the planet towards the star. With the right sideways speed it keeps falling around the star: an <b>orbit</b>." + (lv >= 3 ? " <b>F ∝ M m ÷ r²</b>." : "")
});
E.start({ labId: "orbits", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🪐", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🪐", "⭐", "☀️", "✨"],
  exploreDemo: lv => [{ set: { v: 30, r: 1 }, run: true }, { set: { v: 8 }, run: true }, { set: { v: 50 }, run: true }] });
})();
