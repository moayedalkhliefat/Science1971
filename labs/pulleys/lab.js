"use strict";
// ===== Pulleys & Gears — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SYS = { 1: "Single fixed pulley (1 rope)", 2: "Movable pulley (2 ropes)", 3: "Block and tackle (3 ropes)", 4: "Block and tackle (4 ropes)" };
const r2 = x => Math.round(x * 100) / 100;
const need = s => r2(s.load / s.n);
const lifts = s => s.eff >= need(s) - 1e-9;
const rise = s => r2(s.pull / s.n);
const outRpm = s => r2(s.rpm * s.t1 / s.t2);
const outDir = s => s.idler ? "same" : "opposite";
function gear(cx, cy, teeth, col, rpm, dir, show) {
  const r = 14 + teeth * 2.2, n = teeth; let d = "";
  for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n, R = i % 2 ? r : r + 9; d += (i ? "L" : "M") + (cx + Math.cos(a) * R).toFixed(1) + "," + (cy + Math.sin(a) * R).toFixed(1); }
  const spin = show && rpm ? `<animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="${dir * 360} ${cx} ${cy}" dur="${Math.max(0.4, 60 / rpm).toFixed(2)}s" repeatCount="indefinite"/>` : "";
  return { r, svg: `<g><g>${spin}<path d="${d}Z" fill="${col}" stroke="#37474f" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="#eceff1" stroke="#37474f"/><line x1="${cx}" y1="${cy}" x2="${cx + r * 0.8}" y2="${cy}" stroke="#37474f" stroke-width="4"/></g>${T(cx, cy + r + 30, teeth + " teeth", { s: 13, c: "#37474f" })}</g>` };
}
// clean schematic: top block (fixed pulleys) and bottom block (moving pulleys) joined by n supporting ropes
function mech(n, load, eff, cx, ly, effort) {
  const ceil = 50, topY = 96, botY = ly - 70, w = 36 + n * 22, ropes = Array.from({ length: n }, (_, i) => cx - (n - 1) * 11 + i * 22);
  let g = `<rect x="${cx - (effort ? 150 : 120)}" y="${ceil - 14}" width="${effort ? 300 : 240}" height="14" fill="#78909c"/><line x1="${cx}" y1="${ceil}" x2="${cx}" y2="${topY - 22}" stroke="#455a64" stroke-width="5"/>`;
  const sheave = (y, k) => Array.from({ length: k }, (_, i) => `<circle cx="${cx - (k - 1) * 13 + i * 26}" cy="${y}" r="12" fill="#cfd8dc" stroke="#455a64" stroke-width="2"/><circle cx="${cx - (k - 1) * 13 + i * 26}" cy="${y}" r="3" fill="#455a64"/>`).join("");
  g += `<rect x="${cx - w / 2}" y="${topY - 22}" width="${w}" height="40" rx="12" fill="#eceff1" stroke="#455a64" stroke-width="2"/>` + sheave(topY - 2, Math.max(1, Math.ceil(n / 2)));
  if (n === 1) g += `<line x1="${cx - 14}" y1="${topY + 18}" x2="${cx - 14}" y2="${ly - 40}" stroke="#8d6e63" stroke-width="4"/>`;
  else { g += ropes.map(x => `<line x1="${x}" y1="${topY + 18}" x2="${x}" y2="${botY - 18}" stroke="#8d6e63" stroke-width="4"/>`).join("") + `<rect x="${cx - w / 2 + 6}" y="${botY - 20}" width="${w - 12}" height="36" rx="12" fill="#eceff1" stroke="#455a64" stroke-width="2"/>` + sheave(botY - 2, Math.floor(n / 2)) + `<line x1="${cx}" y1="${botY + 16}" x2="${cx}" y2="${ly - 40}" stroke="#455a64" stroke-width="5"/>`; }
  const ex = cx + w / 2 + 14;
  g += `<path d="M${cx + w / 2 - 6},${topY - 4} q20,0 20,20 V300" fill="none" stroke="#8d6e63" stroke-width="4"/>`;
  g += `<rect x="${cx - 60}" y="${ly - 40}" width="120" height="70" rx="8" fill="#795548" stroke="#4e342e" stroke-width="2"/>${T(cx, ly + 2, load + " N", { s: 18, c: "#fff" })}${effort ? `<rect x="${cx - 220}" y="380" width="440" height="8" fill="#bcaaa4"/>` : ""}`;
  if (n > 1) g += T(cx - w / 2 - 12, (topY + botY) / 2, n + " ropes", { a: "end", s: 14, c: "#6d4c41" });
  if (effort) g += `<line x1="${ex}" y1="300" x2="${ex}" y2="350" stroke="#1565c0" stroke-width="6"/><path d="M${ex},360 l-9,-14 h18Z" fill="#1565c0"/>${T(ex + 14, 340, "effort " + eff + " N", { a: "start", s: 14, c: "#1565c0" })}`;
  return g;
}
function render(s) {
  const show = s.reveal;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/>`;
  if (s.mode === "gear") {
    const a = gear(0, 0, s.t1, "#90a4ae", 0, 1, false), b = gear(0, 0, s.t2, "#ffb74d", 0, 1, false);
    const x1 = 150, gx = s.idler ? 22 + 14 + 10 * 2.2 : 0, idR = 14 + 10 * 2.2, x2i = x1 + a.r + idR + 6, x2 = s.idler ? x2i + idR + b.r + 6 : x1 + a.r + b.r + 6, cy = 200;
    g += `<rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(300, 46, "GEAR TRAIN", { s: 13, c: "#37474f" })}`;
    g += gear(x1, cy, s.t1, "#90a4ae", s.rpm, 1, show).svg + (s.idler ? gear(x2i, cy, 10, "#a5d6a7", s.rpm * s.t1 / 10, -1, show).svg : "") + gear(x2, cy, s.t2, "#ffb74d", outRpm(s), s.idler ? 1 : -1, show).svg;
    g += T(x1, 80, "input (driver)", { s: 12, c: "#546e7a" }) + T(x2, 80, "output", { s: 12, c: "#ef6c00" });
    g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
      ${T(120, 74, "input " + s.rpm + " rpm", { s: 16, c: "#37474f" })}${T(120, 124, show ? "output " + outRpm(s) + " rpm" : "?", { s: 20, c: "#e65100" })}${T(120, 152, show ? "turns " + outDir(s) + " way" : "", { s: 13, c: "#6d4c41" })}
      ${T(120, 210, "gear ratio", { s: 12, c: "#78909c" })}${T(120, 240, s.t2 + " : " + s.t1, { s: 20, c: "#37474f" })}${T(120, 290, show ? (outRpm(s) > s.rpm ? "faster, but less turning force" : outRpm(s) < s.rpm ? "slower, but MORE turning force" : "same speed") : "", { s: 12, c: "#6d4c41" })}
      ${T(120, 360, "output speed = input × driver teeth ÷ output teeth", { s: 10, c: "#90a4ae" })}</g>`;
    return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
  }
  // pulley system
  const n = s.n, up = show && lifts(s) ? Math.min(90, (s.pull ? rise(s) : 1) * 30) : 0;
  g += `<rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>` + mech(n, s.load, s.eff, 260, 330 - up, true);
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 60, SYS[n], { s: 11, c: "#546e7a" })}
    ${T(120, 104, "effort needed: " + (show ? need(s) + " N" : "?"), { s: 15, c: "#37474f" })}${T(120, 142, show ? (lifts(s) ? "✔ the load rises" : "✘ too weak — the load stays") : "press ▶ to pull", { s: 15, c: show ? (lifts(s) ? "#2e7d32" : "#c62828") : "#90a4ae" })}
    ${s.pull ? T(120, 196, `pull ${s.pull} m of rope`, { s: 15, c: "#37474f" }) + T(120, 222, show ? `→ load rises ${rise(s)} m` : "", { s: 15, c: "#2e7d32" }) + T(120, 270, show ? `work in: ${s.eff} × ${s.pull} = ${r2(s.eff * s.pull)} J` : "", { s: 12, c: "#546e7a" }) + T(120, 292, show ? `work out: ${s.load} × ${rise(s)} = ${r2(s.load * rise(s))} J` : "", { s: 12, c: "#546e7a" }) : ""}
    ${T(120, 360, "ropes holding the load = how many times", { s: 10, c: "#90a4ae" })}${T(120, 376, "the force is multiplied", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "n", type: "choice", label: "Pulley system", options: [1, 2, 3, 4].map(v => ({ v, label: v + " rope" + (v > 1 ? "s" : "") })), hide: s => s.mode !== "pulley", lock: lk("n") },
  { id: "eff", type: "range", label: "Effort (your pull)", min: 0, max: 800, step: 10, nudge: 10, unit: "N", hide: s => s.mode !== "pulley", lock: lk("eff") },
  { id: "pull", type: "range", label: "Rope pulled", min: 0, max: 20, step: 1, nudge: 1, unit: "m", hide: s => s.mode !== "pulley" || lv < 2, lock: lk("pull") },
  { id: "t1", type: "choice", label: "Driver gear", options: [10, 20, 30, 40].map(v => ({ v, label: v + " teeth" })), hide: s => s.mode !== "gear", lock: lk("t1") },
  { id: "t2", type: "choice", label: "Output gear", options: [10, 20, 30, 40].map(v => ({ v, label: v + " teeth" })), hide: s => s.mode !== "gear", lock: lk("t2") },
  { id: "idler", type: "toggle", label: "Add a middle (idler) gear", hide: s => s.mode !== "gear", lock: lk("idler") }]; };
const st = o => Object.assign({ mode: "pulley", n: 1, load: 400, eff: 100, pull: 0, t1: 20, t2: 20, rpm: 60, idler: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "gear" ? "⚙️ Gear challenge" : "🪝 Pulley challenge", prompt: "Set up the machine, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: s0.mode === "gear" ? "Output speed = input speed × driver teeth ÷ output teeth. Two touching gears turn opposite ways; an idler gear makes them turn the same way." : "Effort needed = load ÷ number of supporting ropes. But you must pull that many times MORE rope: rope pulled = ropes × height." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("pg-sim", diff, uses, mk);
const C = {
  four: () => simQ(1, "Lift a <b>400 N</b> crate with only <b>100 N</b> of effort.", st({ load: 400, eff: 100 }), s => ok(lifts(s) && s.eff === 100, "4 ropes: 400 ÷ 4 = 100 N.", `With ${s.n} rope(s) you need ${need(s)} N.`), { n: 4 }, { lock: ["eff"], wrong: { n: 3 } }),
  direction: () => simQ(1, "Use a pulley that only <b>changes the direction</b> of your pull — it saves no force. Lift the 200 N load.", st({ load: 200, n: 3, eff: 100 }), s => ok(s.n === 1 && lifts(s), "A single fixed pulley: pull DOWN to lift UP, effort = load.", s.n !== 1 ? "That pulley also saves force." : `You need ${need(s)} N.`), { n: 1, eff: 200 }, { wrong: { n: 1, eff: 150 } }),
  six: () => simQ(1, "Lift <b>600 N</b> with an effort of <b>300 N</b>.", st({ load: 600, eff: 300 }), s => ok(lifts(s) && s.n === 2, "2 ropes: 600 ÷ 2 = 300 N.", `With ${s.n} rope(s) you need ${need(s)} N.`), { n: 2 }, { lock: ["eff"], wrong: { n: 1 } }),
  least: () => simQ(1, "With a <b>3-rope</b> pulley, find the <b>smallest effort</b> that lifts <b>450 N</b>.", st({ n: 3, load: 450, eff: 300 }), s => ok(lifts(s) && s.eff === 150, "450 ÷ 3 = 150 N.", lifts(s) ? "It lifts, but you can pull less." : "Too weak."), { eff: 150 }, { lock: ["n"], wrong: { eff: 140 } }),
  rope9: () => simQ(2, "With <b>3 ropes</b>, lift the 300 N load by exactly <b>3 m</b>.", st({ mode: "pulley", n: 3, load: 300, eff: 100, pull: 1 }), s => ok(lifts(s) && rise(s) === 3, "Pull 9 m of rope: 9 ÷ 3 = 3 m.", `Pulling ${s.pull} m lifts it ${rise(s)} m.`), { pull: 9 }, { lock: ["n", "eff"], wrong: { pull: 3 } }),
  ma4: () => simQ(2, "You pull <b>8 m</b> of rope and the load rises <b>2 m</b>. Choose the pulley system.", st({ n: 1, load: 400, eff: 400, pull: 8 }), s => ok(rise(s) === 2 && lifts(s), "4 ropes: 8 ÷ 4 = 2 m.", `With ${s.n} rope(s) the load rises ${rise(s)} m.`), { n: 4 }, { lock: ["pull", "eff"], wrong: { n: 2 } }),
  short: () => simQ(2, "Lift <b>500 N</b> by <b>2 m</b> with an effort of <b>250 N</b>, pulling the <b>least</b> rope.", st({ n: 4, load: 500, eff: 250, pull: 8 }), s => ok(s.n === 2 && rise(s) === 2 && lifts(s), "2 ropes: 250 N is enough and you pull only 4 m.", !lifts(s) ? "Too weak." : rise(s) !== 2 ? `It rises ${rise(s)} m.` : "That works, but uses more rope than needed."), { n: 2, pull: 4 }, { lock: ["eff"], wrong: { n: 4, pull: 8 } }),
  work: () => simQ(2, "Lift <b>800 N</b> by <b>1 m</b> with only <b>200 N</b>. Set the system and the rope.", st({ n: 1, load: 800, eff: 200, pull: 1 }), s => ok(lifts(s) && rise(s) === 1, "4 ropes, 4 m of rope: 200 × 4 = 800 × 1 = 800 J.", !lifts(s) ? "Too weak — more ropes." : `It rises ${rise(s)} m.`), { n: 4, pull: 4 }, { lock: ["eff"], wrong: { n: 4, pull: 2 } }),
  fast3: () => simQ(3, "Make the output gear turn <b>3 times faster</b> than the input.", st({ mode: "gear" }), s => ok(outRpm(s) === 180, "30 teeth driving 10 teeth: 60 × 30 ÷ 10 = 180 rpm.", `Output: ${outRpm(s)} rpm.`), { t1: 30, t2: 10 }, { lock: ["idler"], wrong: { t1: 20, t2: 10 } }),
  slow20: () => simQ(3, "The driver turns at 60 rpm. Make the output turn at <b>20 rpm</b> (with more turning force).", st({ mode: "gear" }), s => ok(outRpm(s) === 20, "10 teeth driving 30 teeth: 60 × 10 ÷ 30 = 20 rpm.", `Output: ${outRpm(s)} rpm.`), { t1: 10, t2: 30 }, { lock: ["idler"], wrong: { t1: 10, t2: 20 } }),
  same: () => simQ(3, "Make the output turn the <b>same way</b> as the input, at the <b>same speed</b>.", st({ mode: "gear", t1: 20, t2: 40 }), s => ok(outDir(s) === "same" && outRpm(s) === 60, "Equal gears plus an idler: same speed, same direction.", outDir(s) !== "same" ? "Two touching gears turn opposite ways." : `Output: ${outRpm(s)} rpm.`), { t2: 20, idler: true }, { lock: ["t1"], wrong: { t2: 20, idler: false } }),
  bike: () => simQ(3, "A bicycle: get the <b>fastest</b> back wheel from the pedal gear.", st({ mode: "gear", t1: 20, t2: 20 }), s => ok(s.t1 === 40 && s.t2 === 10, "40 → 10 teeth: 4 turns of the wheel per pedal turn.", `Output ${outRpm(s)} rpm — it can be faster.`), { t1: 40, t2: 10 }, { lock: ["idler"], wrong: { t1: 30, t2: 10 } })
};
const D = {
  pick: diff => E.diaT("pg-pick", diff, 2, () => { const want = choice([2, 3, 4]), loads = { 1: 600, 2: 600, 3: 600, 4: 600 };
    return { kind: "pick", title: "👆 Count the ropes", prompt: `A <b>600 N</b> load. Click the pulley system where the effort is <b>${600 / want} N</b>.`, answer: ["p" + want], names: { p1: "1 rope", p2: "2 ropes", p3: "3 ropes", p4: "4 ropes" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${[1, 2, 3, 4].map((n, i) => `<g class="pk" data-k="p${n}"><rect x="${15 + i * 212}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><rect x="${15 + i * 212}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["p" + n])}/><g transform="translate(${113 + i * 212 - 0.6 * 260},-12) scale(.6)">${mech(n, 600, 0, 260, 330, false)}</g></g>`).join("")}</svg>`,
      explain: "Count the ropes that hold up the moving block: effort = load ÷ ropes.", summary: "Pulley ropes" }; }),
  num: diff => E.diaT("pg-num", diff, 2, () => { const c = choice([[600, 3, 2], [800, 4, 1.5], [500, 2, 3], [900, 3, 1]]);
    return { kind: "num", title: "🧮 Pulley maths", prompt: `A <b>${c[0]} N</b> load is lifted <b>${c[2]} m</b> with a pulley that has <b>${c[1]}</b> supporting ropes.`, visual: render(st({ n: c[1], load: c[0], eff: c[0] / c[1] })),
      fields: [{ label: "Effort needed", unit: "N", answer: c[0] / c[1] }, { label: "Rope you must pull", unit: "m", answer: c[1] * c[2] }], explain: `Effort = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} N; rope = ${c[1]} × ${c[2]} = ${fmt(c[1] * c[2])} m.`, summary: "Pulley calculation" }; }),
  mcq: diff => E.diaT("pg-mcq", diff, 2, () => { const q = choice([
      { ask: "A pulley lets you lift a load with less force. What is the catch?", ok: "You must pull the rope a longer distance", bad: ["The load gets heavier", "You do less work", "It only works upwards"], ex: "Work in = force × distance, so less force means more distance." },
      { ask: "A small gear drives a big gear. The big gear…", ok: "turns more slowly but with more turning force", bad: ["turns faster with more force", "turns faster with less force", "does not turn"], ex: "Speed and turning force trade off." },
      { ask: "Why do two meshing gears turn in opposite directions?", ok: "Their teeth push each other sideways at the contact point", bad: ["Gravity pulls them", "One is magnetic", "They are different sizes"], ex: "Add an idler gear to make the output turn the same way." }]);
    return { kind: "mcq", title: "📘 Simple machines", prompt: "Think about force and distance.", visual: render(st({ n: 4, eff: 100, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Simple machine concepts" }; })
};
const LEVELS = {
  1: { intro: "Pulleys: more supporting ropes means less effort to lift the same load.", pool: () => [S(1, 1, C.six), S(2, 1, C.four), S(2, 1, C.direction), S(3, 1, C.least), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Nothing is free: less force means pulling more rope. Work in = work out.", pool: () => [S(1, 1, C.rope9), S(2, 1, C.ma4), S(2, 1, C.work), S(3, 1, C.short), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Gears trade speed for turning force — and can change direction.", pool: () => [S(1, 1, C.fast3), S(2, 1, C.slow20), S(3, 1, C.same), S(3, 1, C.bike), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a pulley system and your pull, then press ▶ to try to lift the 400 N crate.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Pull",
  goals: () => [{ txt: "Fail to lift the crate", test: (s, m) => m.f }, { txt: "Lift it with 200 N or less", test: (s, m) => m.e }, { txt: "Try all 4 systems", test: (s, m) => (m.sy || []).length >= 4 }],
  track: (s, m, ran) => { if (!ran) return; if (!lifts(s)) m.f = 1; if (lifts(s) && s.eff <= 200) m.e = 1; m.sy = Array.from(new Set((m.sy || []).concat(s.n))); },
  facts: () => "📘 A <b>pulley</b> system multiplies your force by the number of supporting ropes — but you pull the rope that many times farther."
});
E.start({ labId: "pulleys", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚙️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚙️", "🪝", "📦", "✨"],
  exploreDemo: () => [{ set: { n: 1 }, run: true }, { set: { n: 2 }, run: true }, { set: { n: 3 }, run: true }, { set: { n: 4 }, run: true }] });
})();
