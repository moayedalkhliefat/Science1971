"use strict";
// ===== Ramps & Friction — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SURF = { ice: { n: "Ice", mu: 0.05, c: "#e1f5fe" }, wood: { n: "Wood", mu: 0.3, c: "#d7a86e" }, rubber: { n: "Rubber", mu: 0.8, c: "#546e7a" } };
const g = 10, rad = d => d * Math.PI / 180, r2 = x => Math.round(x * 100) / 100;
const Wpar = s => s.m * g * Math.sin(rad(s.a)), Fmax = s => SURF[s.surf].mu * s.m * g * Math.cos(rad(s.a));
// motion: positive = up the slope
function result(s) {
  const down = Wpar(s) - s.F; // net push down the slope before friction
  if (Math.abs(down) <= Fmax(s) + 1e-9) return { move: "still", a: 0, fr: r2(down) };
  if (down > 0) return { move: "down", a: r2((down - Fmax(s)) / s.m), fr: r2(Fmax(s)) };
  return { move: "up", a: r2((-down - Fmax(s)) / s.m), fr: r2(-Fmax(s)) };
}
function render(s) {
  const show = s.reveal, R = result(s), A = rad(s.a), x0 = 50, y0 = 360, L = Math.min(520 / Math.max(0.05, Math.cos(A)), s.a > 0 ? 300 / Math.sin(A) : 520), xt = x0 + L * Math.cos(A), yt = y0 - L * Math.sin(A);
  let gr = `<rect width="860" height="450" fill="#f7f4ee"/><rect x="0" y="${y0}" width="860" height="90" fill="#e0d6c2"/>`;
  gr += `<path d="M${x0},${y0} L${xt},${y0} L${xt},${yt}Z" fill="${SURF[s.surf].c}" stroke="#6d4c41" stroke-width="3" opacity=".95"/>`;
  gr += `<path d="M${x0 + 70},${y0} A70,70 0 0 0 ${x0 + 70 * Math.cos(A)},${y0 - 70 * Math.sin(A)}" fill="none" stroke="#3e2723" stroke-width="2"/>${T(x0 + 92, y0 - 12, s.a + "°", { s: 15, c: "#3e2723" })}`;
  // box placed on the slope (moves a bit if sliding)
  const shift = show ? (R.move === "down" ? -120 : R.move === "up" ? 50 : 0) : 0, along = Math.min(L - 50, Math.max(60, L * 0.55 + shift * L / 520)), bx = x0 + along * Math.cos(A), by = y0 - along * Math.sin(A);
  gr += `<g transform="translate(${bx},${by}) rotate(${-s.a})"><rect x="-34" y="-58" width="68" height="58" rx="6" fill="#a1887f" stroke="#4e342e" stroke-width="2"/>${T(0, -24, s.m + " kg", { s: 13, c: "#fff" })}
    ${show ? (() => { const sc = 1.1, arr = (x1, y1, x2, y2, c, lab) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="5"/><circle cx="${x2}" cy="${y2}" r="5" fill="${c}"/>${T(x2 + (x2 > x1 ? 8 : -8), y2 - 8, lab, { a: x2 > x1 ? "start" : "end", s: 12, c })}`;
      let a = Wpar(s) > 0.5 ? arr(-34, -29, -34 - Math.min(100, Wpar(s) * sc), -29, "#c62828", "pull down slope " + r2(Wpar(s)) + " N") : "";
      if (s.F) a += arr(34, -40, 34 + Math.min(100, s.F * sc), -40, "#1565c0", "push " + s.F + " N");
      if (Math.abs(R.fr) > 0.01) a += arr((R.fr > 0 ? 34 : -34), -4, (R.fr > 0 ? 34 : -34) + (R.fr > 0 ? 1 : -1) * Math.min(100, Math.abs(R.fr) * sc), -4, "#2e7d32", "friction " + Math.abs(R.fr) + " N");
      return a; })() : ""}</g>`;
  // info
  gr += `<g transform="translate(600,20)"><rect width="240" height="150" rx="14" fill="#fff" stroke="#d7ccc8" stroke-width="2"/>${T(120, 26, "RESULT", { s: 13, c: "#4e342e" })}
    ${T(120, 66, show ? (R.move === "still" ? "stays still ✋" : R.move === "down" ? "slides DOWN ⬇" : "moves UP ⬆") : "press ▶ to let go", { s: 20, c: show ? (R.move === "still" ? "#2e7d32" : "#c62828") : "#bcaaa4" })}
    ${T(120, 98, show && R.move !== "still" ? "acceleration " + R.a + " m/s²" : "", { s: 15, c: "#37474f" })}
    ${T(120, 128, `${SURF[s.surf].n}: friction up to ${r2(Fmax(s))} N`, { s: 12, c: "#6d4c41" })}</g>`;
  gr += T(430, 420, "pull down the slope = m × 10 × sin(angle)   ·   largest friction = μ × m × 10 × cos(angle)", { s: 13, c: "#4e342e" });
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${gr}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "surf", type: "choice", label: "Ramp surface", options: Object.keys(SURF).map(v => ({ v, label: `${SURF[v].n} (μ = ${SURF[v].mu})` })), lock: lk("surf") },
  { id: "a", type: "range", label: "Angle", min: 0, max: 60, step: 1, nudge: 1, unit: "°", lock: lk("a") },
  { id: "m", type: "range", label: "Mass", min: 1, max: 20, step: 0.5, nudge: 0.5, unit: "kg", hide: () => lv < 2, lock: lk("m") },
  { id: "F", type: "range", label: "Push up the ramp", min: 0, max: 300, step: 1, nudge: 1, unit: "N", hide: () => lv < 2, lock: lk("F") }]; };
const st = o => Object.assign({ surf: "wood", a: 10, m: 10, F: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => { const R = result(s); return `${SURF[s.surf].n}, ${s.a}°: ${R.move === "still" ? "stays still" : "moves " + R.move + " at " + R.a + " m/s²"}`; };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🛝 Ramp challenge", prompt: "Set up the ramp, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "The box slides when the pull down the slope (m g sin θ) is bigger than the largest friction (μ m g cos θ). Net force = mass × acceleration." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("rp-sim", diff, uses, mk);
const C = {
  start: () => simQ(1, "On <b>wood</b>, find the <b>smallest angle</b> where the box starts to slide.", st({ a: 5 }), s => ok(s.a === 17 && result(s).move === "down", "17°: tan 17° = 0.31 > μ = 0.3.", result(s).move === "still" ? say(s) + " — steeper!" : "It slides — but a smaller angle also works."), { a: 17 }, { lock: ["surf"], wrong: { a: 16 } }),
  ice: () => simQ(1, "On <b>ice</b>, what is the <b>steepest</b> angle where the box still stays put?", st({ surf: "ice", a: 10 }), s => ok(s.a === 2 && result(s).move === "still", "2°: ice has very little friction (μ = 0.05).", result(s).move !== "still" ? say(s) + "." : "It could be a bit steeper."), { a: 2 }, { lock: ["surf"], wrong: { a: 3 } }),
  grip: () => simQ(1, "The ramp is at <b>30°</b>. Choose the surface that keeps the box still.", st({ surf: "ice", a: 30 }), s => ok(result(s).move === "still", "Rubber: lots of friction (μ = 0.8).", say(s) + "."), { surf: "rubber" }, { lock: ["a"], wrong: { surf: "wood" } }),
  rubber: () => simQ(1, "Make the box slide on <b>rubber</b>.", st({ surf: "rubber", a: 20 }), s => ok(result(s).move === "down", say(s) + " — very steep!", say(s) + " — steeper!"), { a: 45 }, { lock: ["surf"], wrong: { a: 35 } }),
  steady: () => simQ(2, "Push the <b>10 kg</b> box up a <b>30° wooden</b> ramp so it just moves at a steady speed (acceleration 0–0.1 m/s²).", st({ a: 30 }), s => { const R = result(s); return ok(R.move === "up" && R.a <= 0.1, "76 N: 50 N (gravity part) + 26 N (friction).", R.move === "up" ? `It speeds up at ${R.a} m/s² — push less.` : say(s) + " — push harder."); }, { F: 76 }, { lock: ["surf", "a", "m"], wrong: { F: 70 } }),
  hold: () => simQ(2, "The 10 kg box is on <b>ice at 30°</b>. Use the <b>smallest push</b> (whole newtons) that stops it sliding down.", st({ surf: "ice", a: 30 }), s => ok(result(s).move === "still" && s.F === 46, "46 N + 4.3 N friction ≥ 50 N pull.", result(s).move === "down" ? "It still slides — push harder." : "It stays, but you can push less."), { F: 46 }, { lock: ["surf", "a", "m"], wrong: { F: 45 } }),
  heavy: () => simQ(2, "Does mass matter? On wood at <b>20°</b>, find a mass that makes the box slide.", st({ a: 20, m: 2 }), s => ok(false, "", "Mass cancels out — the box slides at the same angle whatever its mass!"), { m: 20 }, { lock: ["surf", "a"], wrong: { m: 5 } }),
  upIce: () => simQ(2, "Push a <b>4 kg</b> box up an <b>icy 10°</b> ramp at a steady speed (acceleration 0–0.1 m/s²).", st({ surf: "ice", a: 10, m: 4 }), s => { const R = result(s); return ok(R.move === "up" && R.a <= 0.1, "9 N: 6.9 N (gravity part) + 2 N (friction).", R.move === "up" ? `It speeds up at ${R.a} m/s² — push less.` : say(s) + " — push harder."); }, { F: 9 }, { lock: ["surf", "a", "m"], wrong: { F: 8 } }),
  zero: () => simQ(2, "On wood, set the angle so the pull down the slope is <b>exactly zero</b>.", st({ a: 20 }), s => ok(s.a === 0, "Flat ground: no part of the weight pulls along it.", `At ${s.a}° the pull is ${r2(Wpar(s))} N.`), { a: 0 }, { lock: ["surf", "m", "F"], wrong: { a: 5 } }),
  acc2: () => simQ(3, "On <b>ice</b>, make the box slide down at about <b>2 m/s²</b> (±0.1).", st({ surf: "ice", a: 5 }), s => { const R = result(s); return ok(R.move === "down" && Math.abs(R.a - 2) <= 0.1, say(s) + ".", say(s) + "."); }, { a: 14 }, { lock: ["surf", "m", "F"], wrong: { a: 15 } }),
  up1: () => simQ(3, "Push a <b>5 kg</b> box up a <b>10° wooden</b> ramp with an acceleration of <b>1 m/s²</b> (±0.1).", st({ a: 10, m: 5 }), s => { const R = result(s); return ok(R.move === "up" && Math.abs(R.a - 1) <= 0.1, "F = 5 × (1 + 1.74 + 2.95) ≈ 28 N.", say(s) + "."); }, { F: 28 }, { lock: ["surf", "a", "m"], wrong: { F: 30 } }),
  which4: () => simQ(3, "At <b>40°</b>, choose the surface where the box slides down at about <b>4 m/s²</b> (±0.2).", st({ a: 40, surf: "rubber" }), s => { const R = result(s); return ok(R.move === "down" && Math.abs(R.a - 4) <= 0.2, say(s) + ".", say(s) + "."); }, { surf: "wood" }, { lock: ["a", "m", "F"], wrong: { surf: "ice" } }),
  fr5: () => simQ(3, "The box slides down <b>ice at 30°</b>. Choose the mass so the friction force is about <b>5 N</b> (±0.1).", st({ surf: "ice", a: 30, m: 2 }), s => ok(Math.abs(Fmax(s) - 5) <= 0.1, `${s.m} kg → friction ${r2(Fmax(s))} N.`, `${s.m} kg → friction ${r2(Fmax(s))} N.`), { m: 11.5 }, { lock: ["surf", "a", "F"], wrong: { m: 10 } })
};
// "heavy" is a trick question: no mass works, so it is not used as a challenge
delete C.heavy;
const D = {
  pick: diff => E.diaT("rp-pick", diff, 2, () => { const want = choice(["fr", "w", "n"]), nm = { fr: "friction", w: "pull down the slope (part of the weight)", n: "normal (contact) force" };
    return { kind: "pick", title: "👆 Name the force", prompt: `Click the arrow that shows the <b>${nm[want]}</b> on a box resting on a ramp.`, answer: [want], names: nm,
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f7f4ee"/><path d="M150,270 L710,270 L710,90Z" fill="#d7a86e" stroke="#6d4c41" stroke-width="3"/><g transform="translate(430,180) rotate(-17.8)"><rect x="-40" y="-60" width="80" height="60" rx="6" fill="#a1887f" stroke="#4e342e" stroke-width="2"/>
        <g class="pk" data-k="w"><line x1="0" y1="-30" x2="-130" y2="-30" stroke="#c62828" stroke-width="6"/><circle cx="-130" cy="-30" r="7" fill="#c62828"/><rect x="-140" y="-44" width="140" height="28" fill="transparent" ${E.ring(s2.w)}/></g>
        <g class="pk" data-k="fr"><line x1="40" y1="-4" x2="150" y2="-4" stroke="#2e7d32" stroke-width="6"/><circle cx="150" cy="-4" r="7" fill="#2e7d32"/><rect x="40" y="-16" width="120" height="24" fill="transparent" ${E.ring(s2.fr)}/></g>
        <g class="pk" data-k="n"><line x1="0" y1="-60" x2="0" y2="-160" stroke="#1565c0" stroke-width="6"/><circle cx="0" cy="-160" r="7" fill="#1565c0"/><rect x="-14" y="-170" width="28" height="112" fill="transparent" ${E.ring(s2.n)}/></g></g></svg>`,
      explain: "The weight's slope part pulls the box DOWN the ramp; friction acts UP the ramp to stop it; the normal force pushes out of the ramp surface.", summary: "Forces on a ramp" }; }),
  num: diff => E.diaT("rp-num", diff, 2, () => { const c = choice([[10, 30], [4, 30], [20, 30], [6, 90]]);
    return { kind: "num", title: "🧮 Forces on a slope", prompt: `A <b>${c[0]} kg</b> box rests on a <b>${c[1]}°</b> slope (g = 10 N/kg, sin 30° = 0.5).`, visual: render(st({ m: c[0], a: Math.min(60, c[1]) })),
      fields: [{ label: "Weight", unit: "N", answer: c[0] * 10 }, { label: "Pull down the slope", unit: "N", answer: c[0] * 10 * Math.sin(c[1] * Math.PI / 180), tol: 0.03 }], explain: `Weight = ${c[0]} × 10 = ${c[0] * 10} N; pull = ${c[0] * 10} × sin ${c[1]}° = ${fmt(c[0] * 10 * Math.sin(c[1] * Math.PI / 180))} N.`, summary: "Slope force calculation" }; }),
  mcq: diff => E.diaT("rp-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does a box slide more easily on ice than on rubber?", ok: "Ice gives much less friction", bad: ["Ice is steeper", "The box is lighter on ice", "Rubber has no friction"], ex: "Friction depends on the surfaces: μ(ice) is tiny." },
      { ask: "What happens to the pull down a ramp as the ramp gets steeper?", ok: "It gets bigger", bad: ["It gets smaller", "It stays the same", "It becomes zero"], ex: "Pull = m g sin θ, which grows with the angle." },
      { ask: "Which way does friction act on a box sliding DOWN a ramp?", ok: "Up the ramp, against the motion", bad: ["Down the ramp", "Straight down", "Into the ramp"], ex: "Friction always opposes motion." }]);
    return { kind: "mcq", title: "📘 Friction ideas", prompt: "Think about the forces.", visual: render(st({ a: 25, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Friction concepts" }; })
};
const LEVELS = {
  1: { intro: "Tilt the ramp and change the surface. When does the box start to slide?", pool: () => [S(1, 1, C.grip), S(2, 1, C.start), S(2, 1, C.rubber), S(3, 1, C.ice), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Push the box up the ramp. Balance the forces: weight, friction and your push.", pool: () => [S(1, 1, C.zero), S(2, 1, C.upIce), S(2, 1, C.steady), S(3, 1, C.hold), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Unbalanced forces make the box accelerate: F = m × a.", pool: () => [S(1, 1, C.which4), S(2, 1, C.fr5), S(3, 1, C.acc2), S(3, 1, C.up1), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change the angle and the surface, then press ▶ to let go of the box.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Let go",
  goals: () => [{ txt: "Keep the box still", test: (s, m) => m.st }, { txt: "Make it slide down", test: (s, m) => m.dn }, { txt: "Try all 3 surfaces", test: (s, m) => (m.sf || []).length >= 3 }],
  track: (s, m, ran) => { if (!ran) return; const R = result(s); if (R.move === "still") m.st = 1; if (R.move === "down") m.dn = 1; m.sf = Array.from(new Set((m.sf || []).concat(s.surf))); },
  facts: () => "📘 <b>Friction</b> acts against motion. A box stays still while friction can balance the pull down the slope; steeper ramps and slippery surfaces make it slide."
});
E.start({ labId: "ramps", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🛝", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["📦", "🛝", "⭐", "✨"],
  exploreDemo: () => [{ set: { surf: "ice", a: 20 }, run: true }, { set: { surf: "rubber" }, run: true }, { set: { surf: "wood", a: 10 }, run: true }] });
})();
