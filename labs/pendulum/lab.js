"use strict";
// ===== Pendulum Lab — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const PL = { earth: { n: "Earth", g: 9.8, i: "🌍" }, moon: { n: "Moon", g: 1.6, i: "🌕" }, mars: { n: "Mars", g: 3.7, i: "🔴" }, jupiter: { n: "Jupiter", g: 24.8, i: "🟠" } };
const per = s => 2 * Math.PI * Math.sqrt(s.L / PL[s.pl].g);
const hgt = s => s.L * (1 - Math.cos(s.amp * Math.PI / 180));
const vmax = s => Math.sqrt(2 * PL[s.pl].g * hgt(s));
const r2 = x => Math.round(x * 100) / 100;
function render(s) {
  const show = s.reveal || s.showVals, P = per(s), sc = 150, px = 300, py = 50, th = (s._th != null ? s._th : s.amp) * Math.PI / 180, len = s.L * sc;
  const bx = px + len * Math.sin(th), by = py + len * Math.cos(th), r = 10 + 6 * Math.sqrt(s.m);
  let ruler = ""; for (let k = 0; k <= 20; k++) { const y = py + k * 0.1 * sc; if (y > 440) break; ruler += `<line x1="70" x2="${k % 5 ? 80 : 90}" y1="${y}" y2="${y}" stroke="#78909c" stroke-width="2"/>${k % 5 ? "" : T(64, y + 4, (k / 10) + " m", { a: "end", s: 11, c: "#546e7a" })}`; }
  const a0 = s.amp * Math.PI / 180, arc = `<polyline points="${Array.from({ length: 41 }, (_, i) => { const t = -a0 + 2 * a0 * i / 40; return (px + len * Math.sin(t)).toFixed(1) + "," + (py + len * Math.cos(t)).toFixed(1); }).join(" ")}" fill="none" stroke="#90a4ae" stroke-width="2" stroke-dasharray="5 5"/>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="${s.pl === "moon" ? "#eceff1" : s.pl === "mars" ? "#fbe9e7" : s.pl === "jupiter" ? "#fff3e0" : "#e8f1fb"}"/>
    <rect x="80" y="${py - 14}" width="440" height="14" fill="#5d4037"/>${ruler}<line x1="80" x2="80" y1="${py}" y2="440" stroke="#78909c" stroke-width="2"/>${arc}
    <line x1="${px}" y1="${py}" x2="${px}" y2="${py + len}" stroke="#90a4ae" stroke-dasharray="4 4"/><path d="M${px},${py + 40} A40,40 0 0 ${a0 > 0 ? 0 : 1} ${px + 40 * Math.sin(a0)},${py + 40 * Math.cos(a0)}" fill="none" stroke="#e65100" stroke-width="2"/>${T(px + 50 * Math.sin(a0 / 2) + 10, py + 52, s.amp + "°", { s: 12, c: "#e65100" })}
    <line x1="${px}" y1="${py}" x2="${bx}" y2="${by}" stroke="#37474f" stroke-width="3"/><circle cx="${bx}" cy="${by}" r="${r}" fill="#1e88e5" stroke="#0d47a1" stroke-width="3"/>${T(bx, by + 4, s.m + "kg", { s: 10, c: "#fff" })}
    <g transform="translate(560,40)"><rect width="270" height="${show ? 260 : 170}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(135, 28, PL[s.pl].i + " " + PL[s.pl].n + "  (g = " + PL[s.pl].g + " m/s²)", { s: 14, c: "#0d47a1" })}
      ${T(135, 58, `length ${fmt(s.L)} m · mass ${s.m} kg · ${s.amp}°`, { s: 13, c: "#37474f" })}
      <rect x="40" y="76" width="190" height="60" rx="10" fill="#263238"/>${T(135, 116, s._clock != null ? s._clock.toFixed(2) + " s" : show ? (10 * P).toFixed(2) + " s" : "0.00 s", { s: 26, c: "#7dffb3" })}${T(135, 156, "stopwatch: 10 full swings", { s: 12, c: "#546e7a" })}
      ${show ? T(135, 190, "period T = " + r2(P) + " s", { s: 18, c: "#c62828" }) + (s.lv >= 3 ? T(135, 218, "height drop " + r2(hgt(s)) + " m", { s: 13, c: "#1565c0" }) + T(135, 242, "speed at bottom " + r2(vmax(s)) + " m/s", { s: 13, c: "#1565c0" }) : T(135, 222, "(one swing there and back)", { s: 12, c: "#78909c" })) : ""}</g></svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "L", type: "range", label: "Length", min: 0.1, max: 2.5, step: 0.01, nudge: 0.01, unit: "m", fmt: v => fmt(v), lock: lk("L") },
  { id: "m", type: "choice", label: "Mass", options: [0.5, 1, 2].map(v => ({ v, label: v + " kg" })), lock: lk("m") },
  { id: "amp", type: "range", label: "Release angle", min: 5, max: 60, step: 5, nudge: 5, unit: "°", lock: lk("amp") },
  { id: "pl", type: "choice", label: "Planet", options: Object.keys(PL).map(v => ({ v, label: PL[v].i + " " + PL[v].n })), wide: true, hide: () => lv < 2, lock: lk("pl") }]; };
const st = (lv, o) => Object.assign({ lv, L: 1, m: 1, amp: 15, pl: "earth" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; const P = per(s), sw = Math.min(3, Math.max(1, Math.round(3 / P))), dur = Math.min(3200, Math.max(1600, P * sw * 600)), t0 = performance.now();
  const f = now => { const k = Math.min(1, (now - t0) / dur); s._th = s.amp * Math.cos(2 * Math.PI * sw * k); s._clock = 10 * P * k; box.innerHTML = render(s); if (k < 1) requestAnimationFrame(f); else { s._th = null; s._clock = null; box.innerHTML = render(s); res(); } }; requestAnimationFrame(f); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b, t) => Math.abs(a - b) <= (t || 0.03);
const say = s => `L = ${fmt(s.L)} m on ${PL[s.pl].n}: T = ${r2(per(s))} s`;
const Lfor = (T0, g) => Math.round(g * Math.pow(T0 / (2 * Math.PI), 2) * 100) / 100;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⏱️ Pendulum challenge", prompt: "Set up the pendulum, then press <b>▶ Run & check</b> to time 10 swings.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: lv >= 3 ? "Height drop h = L(1 − cos θ). Speed at the bottom v = √(2gh)." : "T = 2π√(L ÷ g). Only the LENGTH (and g) change the period — not the mass, and hardly the angle." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("pen-sim", diff, uses, mk);
const C = {
  two: () => { const t = choice([2, 1.5, 1, 2.5]); return simQ(1, `Make the period <b>${t} s</b> (±0.03 s).`, st(1, { L: 0.3 }), s => ok(near(per(s), t), say(s) + ".", say(s) + "."), { L: Lfor(t, 9.8) }, { wrong: { L: Lfor(t, 9.8) + 0.1 } }); },
  half: () => simQ(1, "The 1.6 m pendulum has T = 2.54 s. Change it so the period is <b>half</b>.", st(1, { L: 1.6 }), s => ok(near(per(s), 1.27), "A quarter of the length (0.4 m) halves the period: T ∝ √L.", say(s) + "."), { L: 0.4 }, { wrong: { L: 0.8 } }),
  mass: () => simQ(1, "Use the <b>2 kg</b> bob and get a period of <b>2 s</b>.", st(1, { m: 0.5, L: 0.5 }), s => ok(s.m === 2 && near(per(s), 2), "The mass makes no difference — only the length (0.99 m).", s.m !== 2 ? "Use the 2 kg bob." : say(s) + "."), { m: 2, L: 0.99 }, { wrong: { m: 2, L: 2 } }),
  ten: () => simQ(1, "Make <b>10 swings take 15 s</b>.", st(1, { L: 1 }), s => ok(near(per(s), 1.5), "T = 1.5 s → L = 0.56 m.", `10 swings take ${(10 * per(s)).toFixed(2)} s.`), { L: 0.56 }, { wrong: { L: 0.6 } }),
  moon: () => simQ(2, "On the <b>Moon</b>, make the period <b>2 s</b>.", st(2, { pl: "moon" }), s => ok(s.pl === "moon" && near(per(s), 2), "Weak gravity → a much shorter pendulum: 0.16 m.", say(s) + "."), { L: 0.16 }, { lock: ["pl"], wrong: { L: 0.99 } }),
  jup: () => simQ(2, "On <b>Jupiter</b>, make the period <b>2 s</b>.", st(2, { pl: "jupiter" }), s => ok(near(per(s), 2), "Strong gravity → a longer pendulum: 2.51 m … the closest is 2.5 m.", say(s) + "."), { L: 2.5 }, { lock: ["pl"], wrong: { L: 2 } }),
  planet: () => simQ(2, "A <b>1 m</b> pendulum has a period of about <b>3.27 s</b>. Which planet is it on?", st(2, { L: 1 }), s => ok(s.pl === "mars", "On Mars (g = 3.7): T = 2π√(1 ÷ 3.7) = 3.27 s.", say(s) + "."), { pl: "mars" }, { lock: ["L"], wrong: { pl: "moon" } }),
  same: () => simQ(2, "On <b>Mars</b>, make a pendulum with the <b>same period</b> as a 1 m pendulum on Earth (2.01 s).", st(2, { pl: "mars", L: 1 }), s => ok(near(per(s), 2.01), "L = 1 × 3.7 ÷ 9.8 = 0.38 m.", say(s) + "."), { L: 0.38 }, { lock: ["pl"], wrong: { L: 1 } }),
  v2: () => simQ(3, "Earth, L = 1 m. Choose the release angle so the speed at the bottom is about <b>1.6 m/s</b> (±0.05).", st(3, { L: 1 }), s => ok(Math.abs(vmax(s) - 1.6) <= 0.05, `h = ${r2(hgt(s))} m → v = ${r2(vmax(s))} m/s.`, `Speed at the bottom ${r2(vmax(s))} m/s.`), { amp: 30 }, { lock: ["L", "pl"], wrong: { amp: 40 } }),
  drop: () => simQ(3, "Earth, release angle <b>60°</b>. Choose the length so the bob drops <b>0.5 m</b>.", st(3, { amp: 60 }), s => ok(Math.abs(hgt(s) - 0.5) <= 0.005, "h = L(1 − cos 60°) = L ÷ 2 → L = 1 m.", `Height drop ${r2(hgt(s))} m.`), { L: 1 }, { lock: ["amp", "pl"], wrong: { L: 1.5 } }),
  moonV: () => simQ(3, "On the <b>Moon</b> with <b>L = 2 m</b>, make the speed at the bottom about <b>1.8 m/s</b> (±0.05).", st(3, { pl: "moon", L: 2 }), s => ok(Math.abs(vmax(s) - 1.8) <= 0.05, `v = √(2 × 1.6 × ${r2(hgt(s))}) = ${r2(vmax(s))} m/s.`, `Speed ${r2(vmax(s))} m/s.`), { amp: 60 }, { lock: ["pl", "L"], wrong: { amp: 45 } }),
  both: () => simQ(3, "Earth: period <b>2 s</b> AND speed at the bottom about <b>1.1 m/s</b> (±0.05).", st(3), s => ok(near(per(s), 2) && Math.abs(vmax(s) - 1.1) <= 0.05, say(s) + `, v = ${r2(vmax(s))} m/s.`, `T = ${r2(per(s))} s, v = ${r2(vmax(s))} m/s.`), { L: 0.99, amp: 20 }, { lock: ["pl"], wrong: { L: 0.99, amp: 30 } })
};

// ---------- diagram tasks ----------
const D = {
  pick: diff => E.diaT("pen-pick", diff, 1, () => { const sets = { a: { L: 0.5, m: 2 }, b: { L: 1, m: 1 }, c: { L: 1.5, m: 0.5 } }, order = E.shuffle(["a", "b", "c"]);
    const q = choice([["c", "the <b>longest period</b> (slowest swing)"], ["a", "the <b>shortest period</b> (fastest swing)"]]);
    return { kind: "pick", title: "👆 Which swings slowest?", prompt: "Click the pendulum with " + q[1] + ".", answer: [q[0]], names: { a: "0.5 m, 2 kg", b: "1 m, 1 kg", c: "1.5 m, 0.5 kg" },
      visual: st2 => `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="300" fill="#e8f1fb"/>${order.map((k, i) => { const x = 150 + i * 298, len = sets[k].L * 150, r = 10 + 6 * Math.sqrt(sets[k].m);
        return `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="284" rx="14" fill="#fff" ${E.ring(st2[k])}/><rect x="${x - 60}" y="20" width="120" height="8" fill="#5d4037"/><line x1="${x}" y1="28" x2="${x + len * 0.26}" y2="${28 + len * 0.96}" stroke="#37474f" stroke-width="3"/><circle cx="${x + len * 0.26}" cy="${28 + len * 0.96}" r="${r}" fill="#1e88e5"/>${T(x, 280, sets[k].L + " m · " + sets[k].m + " kg", { s: 14 })}</g>`; }).join("")}</svg>`,
      explain: "The period depends on the length, not on the mass: the longest pendulum swings slowest.", summary: "Period depends on length" }; }),
  tNum: diff => E.diaT("pen-num", diff, 2, () => { const c = choice([[18.2, 10], [25.4, 10], [14.2, 10], [30, 20]]);
    return { kind: "num", title: "⏱️ Use the stopwatch", prompt: `A student times ${c[1]} full swings: ${c[0]} s.`, visual: render(st(1, { L: 1, showVals: false })),
      fields: [{ label: "Period of one swing", unit: "s", answer: c[0] / c[1], tol: 0.011 }, { label: "Swings per second (frequency)", unit: "Hz", answer: c[1] / c[0], tol: 0.011 }], explain: `T = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} s; f = 1 ÷ T = ${fmt(c[1] / c[0])} Hz. Timing many swings reduces the error.`, summary: "Period and frequency" }; }),
  graph: diff => E.diaT("pen-num", diff, 3, () => { const pts = [0.25, 0.5, 1, 1.5, 2].map(L => [L, 2 * Math.PI * Math.sqrt(L / 9.8)]), X = L => 70 + L * 290, Y = t => 260 - t * 75, ask = choice([[1, 2.01], [0.5, 1.42], [2, 2.84]]);
    const vis = `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#fff"/>${[0, 1, 2, 3].map(t => `<line x1="70" x2="680" y1="${Y(t)}" y2="${Y(t)}" stroke="#eceff1"/>${T(62, Y(t) + 4, t, { a: "end", s: 11, c: "#78909c" })}`).join("")}${[0, 0.5, 1, 1.5, 2].map(L => T(X(L), 282, L, { s: 11, c: "#78909c" })).join("")}
      <polyline points="${Array.from({ length: 41 }, (_, i) => { const L = 0.05 + i * 0.05; return X(L) + "," + Y(2 * Math.PI * Math.sqrt(L / 9.8)); }).join(" ")}" fill="none" stroke="#1e88e5" stroke-width="3"/>${pts.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="5" fill="#0d47a1"/>`).join("")}${T(380, 298, "length (m)", { s: 12 })}${T(16, 20, "period (s)", { a: "start", s: 12 })}</svg>`;
    return { kind: "num", title: "📈 Period–length graph", prompt: "Results from a pendulum experiment on Earth.", visual: vis, fields: [{ label: `Period for L = ${ask[0]} m`, unit: "s", answer: ask[1], tol: 0.06 }], explain: `Read the curve at ${ask[0]} m: about ${ask[1]} s. The curve bends because T ∝ √L.`, summary: "Read a T–L graph" }; }),
  mcq: diff => E.diaT("pen-mcq", diff, 2, () => { const q = choice([
      { ask: "Which change makes a pendulum swing more slowly?", ok: "Making the string longer", bad: ["Using a heavier bob", "Using a lighter bob", "Pulling it back a little further"], ex: "T = 2π√(L/g): a longer string → longer period." },
      { ask: "At which point is the bob moving fastest?", ok: "At the bottom of the swing", bad: ["At the highest point", "Half-way up", "It moves at constant speed"], ex: "Gravitational potential energy changes to kinetic energy: maximum speed at the lowest point." },
      { ask: "A pendulum clock is taken to the Moon. What happens?", ok: "It runs slow — each swing takes longer", bad: ["It runs fast", "It keeps perfect time", "It stops swinging completely"], ex: "Smaller g → longer period." }]);
    return { kind: "mcq", title: "📘 Pendulum ideas", prompt: "Think about what affects the swing.", visual: render(st(2, { L: 1.2, amp: 30, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Pendulum ideas" }; })
};
const LEVELS = {
  1: { intro: "What changes the period of a pendulum? Test the length, the mass and the angle.", pool: () => [S(1, 1, C.mass), S(1, 1, C.two), S(2, 1, C.ten), S(2, 1, C.two), S(3, 1, C.half), D.pick(1), D.tNum(2), D.mcq(3)] },
  2: { intro: "Take the pendulum to other planets: gravity changes the period too.", pool: () => [S(1, 1, C.moon), S(2, 1, C.planet), S(2, 1, C.jup), S(3, 1, C.same), D.pick(1), D.mcq(2), D.graph(3)] },
  3: { intro: "Energy in a pendulum: potential energy at the top, kinetic energy at the bottom.", pool: () => [S(1, 1, C.drop), S(2, 1, C.v2), S(3, 1, C.moonV), S(3, 1, C.both), D.tNum(1), D.graph(2), D.mcq(3)] }
};
const explore = E.exploreSim({
  intro: "Change the length, mass and angle (and planet in higher levels), then press ▶ to time 10 swings.",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render, run, runLabel: "▶ Release",
  goals: lv => [{ txt: "Swing a short pendulum (under 0.5 m)", test: (s, m) => m.short }, { txt: "Swing a long pendulum (over 1.5 m)", test: (s, m) => m.long }, { txt: "Try two different masses", test: (s, m) => (m.ms || new Set()).size >= 2 }].concat(lv >= 2 ? [{ txt: "Swing it on the Moon", test: (s, m) => m.moon }] : []),
  track: (s, m, ran) => { if (!ran) return; if (s.L < 0.5) m.short = 1; if (s.L > 1.5) m.long = 1; (m.ms = m.ms || new Set()).add(s.m); if (s.pl === "moon") m.moon = 1; },
  facts: lv => "📘 Period <b>T = 2π√(L ÷ g)</b>. Longer string → slower. Mass does not matter." + (lv >= 3 ? " Energy: mgh at the top = ½mv² at the bottom." : "")
});
E.start({ labId: "pendulum", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⏱️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⏱️", "🔵", "⭐", "✨"],
  exploreDemo: lv => [{ set: { L: 0.3 }, run: true }, { set: { L: 2 }, run: true }, { set: { m: 2 }, run: true }].concat(lv >= 2 ? [{ set: { pl: "moon" }, run: true }] : []) });
})();
