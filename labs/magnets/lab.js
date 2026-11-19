"use strict";
// ===== Magnets & Electromagnets — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const strength = s => s.turns * s.I * (s.core ? 1 : 0.1);
const clips = s => Math.min(15, Math.floor(strength(s) / 10 + 1e-9));
const rightPole = s => s.I === 0 ? null : (s.dir === "L" ? "N" : "S"); // battery + on the left → right end is N
const emf = s => s.move === "still" ? 0 : Math.round((s.move === "in" ? 1 : -1) * s.turns * s.speed * s.mag / 50 * 100) / 100;
function coilSvg(s, cx, cy, show) {
  const n = s.turns / 5, w = 260, x0 = cx - w / 2; let loops = "";
  for (let i = 0; i < n; i++) { const x = x0 + 10 + i * (w - 20) / Math.max(1, n - 1); loops += `<ellipse cx="${x}" cy="${cy}" rx="7" ry="44" fill="none" stroke="#b87333" stroke-width="4"/>`; }
  const core = s.core ? `<rect x="${x0 - 10}" y="${cy - 26}" width="${w + 20}" height="52" rx="6" fill="#78909c"/>${T(cx, cy + 5, "iron core", { s: 12, c: "#eceff1" })}` : `<rect x="${x0 - 10}" y="${cy - 26}" width="${w + 20}" height="52" rx="6" fill="none" stroke="#b0bec5" stroke-dasharray="5 4"/>`;
  const rp = rightPole(s); const poles = show && rp ? `${T(x0 - 26, cy + 8, rp === "N" ? "S" : "N", { s: 24, c: rp === "N" ? "#1565c0" : "#c62828" })}${T(x0 + w + 26, cy + 8, rp, { s: 24, c: rp === "N" ? "#c62828" : "#1565c0" })}` : "";
  return core + loops + poles;
}
function compass(x, y, ang) { return `<g transform="translate(${x},${y})"><circle r="34" fill="#fff" stroke="#455a64" stroke-width="3"/>${["N", "E", "S", "W"].map((d, i) => T(26 * Math.sin(i * Math.PI / 2), -26 * Math.cos(i * Math.PI / 2) + 4, d, { s: 9, c: "#90a4ae" })).join("")}<g transform="rotate(${ang})"><polygon points="0,-26 6,0 -6,0" fill="#e53935"/><polygon points="0,26 6,0 -6,0" fill="#90a4ae"/></g><circle r="4" fill="#37474f"/></g>`; }
function render(s) {
  const show = s.reveal || s.showVals; let g = "";
  if (s.mode !== 3) { const cx = 300, cy = 170;
    g += coilSvg(s, cx, cy, show);
    // battery + wires
    const bx = cx, by = 330; g += `<path d="M${cx - 130},${cy + 44} L${cx - 130},${by} L${bx - 40},${by} M${bx + 40},${by} L${cx + 130},${by} L${cx + 130},${cy + 44}" fill="none" stroke="#37474f" stroke-width="3"/><rect x="${bx - 40}" y="${by - 20}" width="80" height="40" rx="6" fill="#455a64"/>${T(bx - 26, by + 6, s.dir === "L" ? "+" : "−", { s: 20, c: s.dir === "L" ? "#ef5350" : "#90caf9" })}${T(bx + 26, by + 6, s.dir === "L" ? "−" : "+", { s: 20, c: s.dir === "L" ? "#90caf9" : "#ef5350" })}${T(bx, by + 40, s.I + " A", { s: 14, c: "#37474f" })}`;
    if (s.I > 0) for (let i = 0; i < 6; i++) { const p = i / 6; g += `<circle r="4" fill="#ffca28"><animateMotion dur="${(4 / s.I).toFixed(2)}s" begin="-${(p * 4 / s.I).toFixed(2)}s" repeatCount="indefinite" path="${s.dir === "L" ? `M${bx - 40},${by} L${cx - 130},${by} L${cx - 130},${cy + 44}` : `M${bx + 40},${by} L${cx + 130},${by} L${cx + 130},${cy + 44}`}"/></circle>`; }
    // clips
    const n = show ? clips(s) : 0; for (let i = 0; i < n; i++) { const col = i % 5, row = Math.floor(i / 5); g += `<g transform="translate(${cx - 80 + col * 40},${cy + 52 + row * 30})"><rect x="-6" y="0" width="12" height="24" rx="6" fill="none" stroke="#90a4ae" stroke-width="3"/></g>`; }
    g += `<rect x="${cx - 120}" y="400" width="240" height="18" rx="4" fill="#d7ccc8"/>${!show || !n ? Array.from({ length: 8 }, (_, i) => `<rect x="${cx - 100 + i * 26}" y="388" width="22" height="9" rx="4" fill="none" stroke="#90a4ae" stroke-width="3"/>`).join("") : ""}`;
    const rp = rightPole(s), ang = !show || !rp ? 0 : rp === "N" ? 90 : -90;
    if (s.mode === 2) g += compass(cx + 220, cy, ang) + T(cx + 220, cy + 56, "compass", { s: 12, c: "#455a64" });
    g += `<g transform="translate(610,40)"><rect width="235" height="${show ? 200 : 130}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(117, 28, s.turns + " turns · " + s.I + " A", { s: 15, c: "#0d47a1" })}${T(117, 52, s.core ? "iron core" : "no core (air)", { s: 13, c: "#37474f" })}
      ${show ? T(117, 90, "strength " + fmt(strength(s)) + " units", { s: 15, c: "#6a1b9a" }) + T(117, 120, "📎 picks up " + clips(s) + " clip" + (clips(s) === 1 ? "" : "s"), { s: 16, c: "#c62828" }) + (rp ? T(117, 152, "right end = " + (rp === "N" ? "NORTH" : "SOUTH") + " pole", { s: 14, c: rp === "N" ? "#c62828" : "#1565c0" }) : T(117, 152, "no current → not a magnet", { s: 13, c: "#78909c" })) : T(117, 96, "press ▶ to switch on", { s: 13, c: "#78909c" })}</g>`;
  } else { const cx = 380, cy = 180, pos = s._p != null ? s._p : 0, mx = s.move === "out" ? 180 + pos * -120 : 60 + pos * 120;
    g += coilSvg(Object.assign({}, s, { core: false, I: 0 }), cx, cy, false);
    g += `<g transform="translate(${mx},${cy})"><rect x="0" y="-18" width="70" height="36" fill="#c62828"/><rect x="70" y="-18" width="70" height="36" fill="#1565c0"/>${T(35, 6, "N", { s: 16, c: "#fff" })}${T(105, 6, "S", { s: 16, c: "#fff" })}</g>${s.mag === 2 ? T(mx + 70, cy - 26, "strong magnet", { s: 12, c: "#37474f" }) : T(mx + 70, cy - 26, "weak magnet", { s: 12, c: "#37474f" })}`;
    const v = show ? emf(s) * (s._p != null ? Math.sin(Math.PI * s._p) : 1) : 0, a = Math.max(-60, Math.min(60, v * 6));
    g += `<path d="M${cx - 130},${cy + 44} L${cx - 130},330 L${cx - 40},330 M${cx + 40},330 L${cx + 130},330 L${cx + 130},${cy + 44}" fill="none" stroke="#37474f" stroke-width="3"/><g transform="translate(${cx},330)"><circle r="44" fill="#fff" stroke="#455a64" stroke-width="3"/><path d="M-32,-8 A34,34 0 0 1 32,-8" fill="none" stroke="#b0bec5" stroke-width="2"/>${T(-30, 4, "−", { s: 14 })}${T(30, 4, "+", { s: 14 })}<line x1="0" y1="8" x2="${36 * Math.sin(a * Math.PI / 180)}" y2="${8 - 36 * Math.cos(a * Math.PI / 180)}" stroke="#c62828" stroke-width="3"/>${T(0, 30, "V", { s: 13, c: "#455a64" })}</g>`;
    g += `<g transform="translate(610,40)"><rect width="235" height="${show ? 180 : 120}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(117, 28, s.turns + " turns · speed " + s.speed, { s: 15, c: "#0d47a1" })}${T(117, 52, "magnet moves " + (s.move === "still" ? "— (still)" : s.move.toUpperCase()), { s: 13, c: "#37474f" })}
      ${show ? T(117, 96, "induced voltage", { s: 13, c: "#6a1b9a" }) + T(117, 128, (emf(s) > 0 ? "+" : "") + fmt(emf(s)) + " V", { s: 26, c: "#c62828" }) + T(117, 160, emf(s) === 0 ? "no change in field → no voltage" : Math.abs(emf(s)) >= 2 ? "💡 enough to light a bulb (2 V)" : "too small for the bulb", { s: 12, c: "#37474f" }) : T(117, 90, "press ▶ to move the magnet", { s: 13, c: "#78909c" })}</g>`; }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f4f8fc"/>${g}</svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  const turns = { id: "turns", type: "step", label: "Turns of wire", min: 10, max: 50, step: 10, lock: lk("turns") };
  if (mode === 3) return [turns, { id: "speed", type: "step", label: "Magnet speed", min: 1, max: 5, lock: lk("speed") }, { id: "mag", type: "choice", label: "Magnet", options: [{ v: 1, label: "Weak" }, { v: 2, label: "Strong" }], lock: lk("mag") }, { id: "move", type: "choice", label: "Motion", options: [{ v: "in", label: "Push IN" }, { v: "still", label: "Hold still" }, { v: "out", label: "Pull OUT" }], lock: lk("move") }];
  return [turns, { id: "I", type: "range", label: "Current", min: 0, max: 3, step: 0.5, nudge: 0.5, unit: "A", fmt: v => fmt(v), lock: lk("I") }, { id: "core", type: "toggle", label: "Iron core inside the coil", lock: lk("core") }].concat(mode === 2 ? [{ id: "dir", type: "choice", label: "Battery", options: [{ v: "L", label: "+ on the left" }, { v: "R", label: "+ on the right" }], lock: lk("dir") }] : []);
};
const stFor = (mode, o) => Object.assign(mode === 3 ? { mode, turns: 10, speed: 1, mag: 1, move: "in" } : { mode, turns: 10, I: 1, core: true, dir: "L" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; if (s.mode !== 3) { box.innerHTML = render(s); return setTimeout(res, 800); }
  const t0 = performance.now(), dur = 1800 / Math.sqrt(s.speed); const f = now => { const k = Math.min(1, (now - t0) / dur); s._p = s.move === "still" ? 0 : k; box.innerHTML = render(s); if (k < 1) requestAnimationFrame(f); else { s._p = null; box.innerHTML = render(s); res(); } }; requestAnimationFrame(f); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${s.turns} turns × ${s.I} A${s.core ? " with iron" : " without iron"} = ${fmt(strength(s))} → ${clips(s)} clips`;
const HINT = { 1: "Strength = turns × current (an iron core makes it 10 times stronger). Every 10 units picks up one paper clip.", 2: "Reversing the current reverses the poles. Battery + on the left → the right end becomes NORTH. Like poles repel, unlike poles attract.", 3: "A voltage is induced only when the magnetic field in the coil CHANGES. Voltage = turns × speed × magnet strength ÷ 50. Pulling out gives the opposite sign." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🧲 Electromagnet challenge", 2: "🧭 Poles challenge", 3: "⚡ Induction challenge" }[mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mag-sim", diff, uses, mk);
const C = {
  six: () => { const c = choice([[6, { turns: 30, I: 2 }], [4, { turns: 20, I: 2 }], [9, { turns: 30, I: 3 }], [5, { turns: 50, I: 1 }]]);
    return simQ(1, `Make the electromagnet pick up exactly <b>${c[0]} paper clips</b>.`, stFor(1), s => ok(clips(s) === c[0] && s.core, say(s) + ".", say(s) + "."), Object.assign({ core: true }, c[1]), { wrong: Object.assign({ core: true }, c[1], { I: c[1].I - 0.5 }) }); },
  ten: () => simQ(1, "Pick up <b>at least 10 clips</b> with the <b>fewest turns</b>.", stFor(1), s => ok(clips(s) >= 10 && s.turns === 40, "40 turns × 2.5 A = 100 — 30 turns × 3 A only reaches 90.", clips(s) >= 10 ? "That works, but fewer turns are possible." : say(s) + "."), { turns: 40, I: 2.5, core: true }, { wrong: { turns: 50, I: 2, core: true } }),
  none: () => simQ(1, "Keep <b>2 A</b> and <b>40 turns</b> flowing, but make the magnet pick up <b>no clips</b>.", stFor(1, { turns: 40, I: 2 }), s => ok(clips(s) === 0 && s.I === 2, "Without the iron core the field is 10 times weaker: 8 units, no clips.", say(s) + "."), { core: false }, { lock: ["turns", "I"], wrong: { core: true } }),
  half: () => simQ(1, "50 turns × 2 A picks up 10 clips. Change <b>only the current</b> to pick up <b>half</b> as many.", stFor(1, { turns: 50, I: 2 }), s => ok(clips(s) === 5, "Half the current → half the strength → 5 clips.", say(s) + "."), { I: 1 }, { lock: ["turns", "core"], wrong: { I: 1.5 } }),
  north: () => simQ(2, "Make the <b>right end</b> of the electromagnet a <b>NORTH pole</b> strong enough to pick up <b>at least 3 clips</b>.", stFor(2, { dir: "R", I: 0.5 }), s => ok(rightPole(s) === "N" && clips(s) >= 3, say(s) + "; the compass needle points away from the right end (N).", rightPole(s) !== "N" ? "The right end is SOUTH — reverse the battery." : say(s) + "."), { dir: "L", I: 3 }, { wrong: { dir: "R", I: 3 } }),
  flip: () => simQ(2, "Reverse the poles but keep picking up exactly <b>6 clips</b>.", stFor(2, { turns: 30, I: 2, dir: "L" }), s => ok(s.dir === "R" && clips(s) === 6, "Reversing the current swaps N and S; the strength stays the same.", s.dir !== "R" ? "The poles are the same as before." : say(s) + "."), { dir: "R" }, { lock: ["turns", "I", "core"], wrong: { dir: "L" } }),
  repel: () => simQ(2, "A bar magnet's <b>NORTH</b> pole is held near the right end. Make the electromagnet <b>repel</b> it.", stFor(2, { dir: "R", I: 1 }), s => ok(rightPole(s) === "N", "N faces N: like poles repel.", rightPole(s) === "S" ? "S attracts N — reverse the current." : "Switch the current on."), { dir: "L" }, { lock: ["turns", "core"], wrong: { dir: "R" } }),
  compassS: () => simQ(2, "Make the compass needle (red end) point <b>towards</b> the coil, using <b>3 clips' worth</b> of strength exactly.", stFor(2, { dir: "L" }), s => ok(rightPole(s) === "S" && clips(s) === 3, "The red (north) end of the needle is attracted to a SOUTH pole.", rightPole(s) !== "S" ? "The needle points away — reverse the current." : say(s) + "."), { dir: "R", turns: 30, I: 1 }, { wrong: { dir: "L", turns: 30, I: 1 } }),
  bulb: () => simQ(3, "Push the <b>weak</b> magnet in with <b>20 turns</b>. Choose the speed so the bulb just lights (<b>2 V</b>).", stFor(3, { turns: 20, mag: 1 }), s => ok(Math.abs(emf(s)) >= 2 && s.speed === 5, "20 × 5 × 1 ÷ 50 = 2 V.", `Only ${fmt(Math.abs(emf(s)))} V.`), { speed: 5 }, { lock: ["turns", "mag", "move"], wrong: { speed: 4 } }),
  neg: () => { const c = choice([[-3, { turns: 30, speed: 5, mag: 1, move: "out" }], [-4, { turns: 50, speed: 2, mag: 2, move: "out" }], [-6, { turns: 50, speed: 3, mag: 2, move: "out" }]]);
    return simQ(3, `Make the voltmeter read exactly <b>${c[0]} V</b>.`, stFor(3), s => ok(Math.abs(emf(s) - c[0]) < 1e-9, `${s.turns} × ${s.speed} × ${s.mag} ÷ 50 = ${Math.abs(c[0])} V, negative because the magnet moves OUT.`, `The meter reads ${fmt(emf(s))} V.`), c[1], { wrong: Object.assign({}, c[1], { move: "in" }) }); },
  zero: () => simQ(3, "The magnet is <b>strong</b> and the coil has <b>50 turns</b>, but make the induced voltage <b>zero</b>.", stFor(3, { turns: 50, mag: 2, speed: 5 }), s => ok(emf(s) === 0, "A magnet that is not moving gives no changing field → no voltage.", `${fmt(emf(s))} V.`), { move: "still" }, { lock: ["turns", "mag"], wrong: { move: "out" } }),
  max: () => simQ(3, "Make the <b>biggest positive</b> voltage possible.", stFor(3), s => ok(emf(s) === 10, "50 turns × speed 5 × strong magnet ÷ 50 = 10 V.", `${fmt(emf(s))} V — it can be bigger.`), { turns: 50, speed: 5, mag: 2, move: "in" }, { wrong: { turns: 50, speed: 5, mag: 2, move: "out" } })
};

// ---------- diagram tasks ----------
const D = {
  field: diff => E.diaT("mag-pick", diff, 2, () => { const order = E.shuffle(["a", "b", "c"]), q = choice([["a", "the correct field lines around a bar magnet"], ["b", "two magnets that <b>attract</b>"], ["c", "two magnets that <b>repel</b>"]]);
    const bar = (x, y, f) => `<rect x="${x}" y="${y - 14}" width="50" height="28" fill="${f ? "#1565c0" : "#c62828"}"/><rect x="${x + 50}" y="${y - 14}" width="50" height="28" fill="${f ? "#c62828" : "#1565c0"}"/>${T(x + 25, y + 5, f ? "S" : "N", { s: 13, c: "#fff" })}${T(x + 75, y + 5, f ? "N" : "S", { s: 13, c: "#fff" })}`;
    const draws = { a: (x) => bar(x + 70, 130, 0) + [30, 55, 80].map(d => `<path d="M${x + 70},130 C${x + 50},${130 - d * 1.4} ${x + 190},${130 - d * 1.4} ${x + 170},130" fill="none" stroke="#7e57c2" stroke-width="2"/><path d="M${x + 70},130 C${x + 50},${130 + d * 1.4} ${x + 190},${130 + d * 1.4} ${x + 170},130" fill="none" stroke="#7e57c2" stroke-width="2"/>`).join(""),
      b: (x) => bar(x + 20, 130, 0) + bar(x + 140, 130, 0) + `<line x1="${x + 120}" x2="${x + 140}" y1="122" y2="122" stroke="#7e57c2" stroke-width="2"/><line x1="${x + 120}" x2="${x + 140}" y1="138" y2="138" stroke="#7e57c2" stroke-width="2"/>`,
      c: (x) => bar(x + 20, 130, 0) + bar(x + 140, 130, 1) + `<path d="M${x + 120},120 C${x + 128},96 ${x + 132},96 ${x + 140},120" fill="none" stroke="#7e57c2" stroke-width="2"/><path d="M${x + 120},140 C${x + 128},164 ${x + 132},164 ${x + 140},140" fill="none" stroke="#7e57c2" stroke-width="2"/>` };
    return { kind: "pick", title: "👆 Magnetic fields", prompt: "Click " + q[1] + ".", answer: [q[0]], names: { a: "the single bar magnet", b: "S facing N (attract)", c: "S facing S (repel)" },
      visual: st2 => `<svg viewBox="0 0 900 270" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="270" fill="#f4f8fc"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="254" rx="14" fill="#fff" ${E.ring(st2[k])}/>${draws[k](22 + i * 298)}${T(151 + i * 298, 250, "Picture " + (i + 1), { s: 13 })}</g>`).join("")}</svg>`,
      explain: "Field lines go from N to S around a magnet. Unlike poles (N–S) attract and field lines join; like poles (S–S) repel and field lines push apart.", summary: "Field lines and poles" }; }),
  clipNum: diff => E.diaT("mag-num", diff, 2, () => { const c = choice([[20, 2.5], [40, 1.5], [50, 2.5], [30, 0.5]]); const S0 = c[0] * c[1];
    return { kind: "num", title: "🧮 Electromagnet strength", prompt: `An electromagnet has ${c[0]} turns and ${c[1]} A with an iron core. (Strength = turns × current; 10 units per clip.)`, visual: render(stFor(1, { turns: c[0], I: c[1], showVals: false })),
      fields: [{ label: "Strength", unit: "units", answer: S0 }, { label: "Clips picked up", unit: "", answer: Math.min(15, Math.floor(S0 / 10)) }], explain: `${c[0]} × ${c[1]} = ${S0} units → ${Math.min(15, Math.floor(S0 / 10))} clips.`, summary: "Electromagnet strength" }; }),
  emfNum: diff => E.diaT("mag-num", diff, 3, () => { const c = choice([[40, 3, 2], [25, 4, 1], [50, 1, 2], [30, 5, 2]]);
    return { kind: "num", title: "⚡ Induced voltage", prompt: `A magnet (strength ${c[2]}) is pushed into a ${c[0]}-turn coil at speed ${c[1]}. Voltage = turns × speed × strength ÷ 50.`, visual: render(stFor(3, { turns: Math.min(50, c[0]), speed: c[1], mag: c[2], showVals: false })),
      fields: [{ label: "Voltage when pushed in", unit: "V", answer: c[0] * c[1] * c[2] / 50, tol: 0.006 }, { label: "Voltage when pulled out at the same speed", unit: "V", answer: -c[0] * c[1] * c[2] / 50, tol: 0.006 }], explain: `${c[0]} × ${c[1]} × ${c[2]} ÷ 50 = ${fmt(c[0] * c[1] * c[2] / 50)} V; pulling out reverses the sign.`, summary: "Electromagnetic induction" }; }),
  mcq: diff => E.diaT("mag-mcq", diff, 1, () => { const q = choice([
      { ask: "Why is an iron core put inside an electromagnet?", ok: "It makes the magnetic field much stronger", bad: ["It stops the current", "It makes the coil lighter", "It reverses the poles"], ex: "Iron is easily magnetised and concentrates the field." },
      { ask: "Which change does NOT make an electromagnet stronger?", ok: "Using thinner paper clips", bad: ["More turns of wire", "A bigger current", "Adding an iron core"], ex: "Strength depends on the turns, the current and the core." },
      { ask: "What is an advantage of an electromagnet over a permanent magnet?", ok: "It can be switched on and off", bad: ["It needs no electricity", "It has no poles", "It works on plastic"], ex: "Turn off the current and the magnetism disappears — useful in scrapyard cranes." }]);
    return { kind: "mcq", title: "📘 Electromagnets", prompt: "Look at the electromagnet.", visual: render(stFor(1, { turns: 30, I: 2, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Electromagnet ideas" }; })
};
const LEVELS = {
  1: { intro: "Build an electromagnet: change the turns, the current and the core. How many paper clips can it lift?", pool: () => [S(1, 1, C.none), S(2, 1, C.six), S(2, 1, C.half), S(3, 1, C.ten), S(3, 1, C.six), D.mcq(1), D.clipNum(2), D.field(3)] },
  2: { intro: "North and south poles: the direction of the current decides which end is north.", pool: () => [S(1, 1, C.repel), S(2, 1, C.north), S(2, 1, C.flip), S(3, 1, C.compassS), D.field(1), D.clipNum(2), D.mcq(3)] },
  3: { intro: "Electromagnetic induction: move a magnet in a coil to make a voltage.", pool: () => [S(1, 1, C.zero), S(2, 1, C.bulb), S(3, 1, C.neg), S(3, 1, C.max), D.field(1), D.emfNum(2), D.emfNum(3)] }
};
const explore = E.exploreSim({
  intro: "Level 1–2: change the coil and current and switch on. Level 3: move a magnet in and out of a coil.",
  state: lv => stFor(lv), controls: lv => ctlsFor(lv), render, run, runLabel: "▶ Run",
  goals: lv => lv === 3 ? [{ txt: "Push the magnet in", test: (s, m) => m.in }, { txt: "Pull the magnet out", test: (s, m) => m.out }, { txt: "Make more than 5 V", test: (s, m) => m.big }]
    : [{ txt: "Pick up some clips", test: (s, m) => m.some }, { txt: "Remove the iron core and compare", test: (s, m) => m.nocore }].concat(lv === 2 ? [{ txt: "Reverse the battery", test: (s, m) => m.rev }] : [{ txt: "Pick up 10 clips or more", test: (s, m) => m.ten }]),
  track: (s, m, ran) => { if (!ran) return; if (s.mode === 3) { if (s.move === "in") m.in = 1; if (s.move === "out") m.out = 1; if (Math.abs(emf(s)) > 5) m.big = 1; return; } if (clips(s) > 0) m.some = 1; if (!s.core) m.nocore = 1; if (s.dir === "R") m.rev = 1; if (clips(s) >= 10) m.ten = 1; },
  facts: lv => lv === 3 ? "📘 A <b>changing</b> magnetic field in a coil induces a voltage (Faraday). Faster, stronger, more turns → bigger voltage." : "📘 A coil with a current is an <b>electromagnet</b>. More turns, more current and an iron core make it stronger."
});
E.start({ labId: "magnets", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧲", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧲", "📎", "⚡", "✨"],
  exploreDemo: lv => lv === 3 ? [{ set: { move: "in" }, run: true }, { set: { move: "out" }, run: true }, { set: { turns: 50, speed: 5, mag: 2, move: "in" }, run: true }] : [{ set: { turns: 30, I: 2 }, run: true }, { set: { core: false }, run: true }].concat(lv === 2 ? [{ set: { dir: "R", core: true }, run: true }] : [{ set: { core: true, turns: 50, I: 3 }, run: true }]) });
})();
