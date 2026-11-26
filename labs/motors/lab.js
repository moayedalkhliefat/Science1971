"use strict";
// ===== Molecular Motors — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const VMAX = 800, KM = 100, FSTALL = 6;
const MOT = { kin: { name: "Kinesin", track: "mt", dir: 1, step: 8, col: "#1e88e5" }, dyn: { name: "Dynein", track: "mt", dir: -1, step: 8, col: "#8e24aa" }, myo: { name: "Myosin V", track: "actin", dir: 1, step: 36, col: "#e53935" } };
const fits = s => MOT[s.motor].track === s.track;
const speed = s => !fits(s) ? 0 : Math.max(0, r2(VMAX * s.atp / (KM + s.atp) * (1 - s.force / FSTALL)));
const steps = s => r2(speed(s) / MOT[s.motor].step);
const dist = s => r2(speed(s) * s.time);
const dirTxt = s => !speed(s) ? "not moving" : MOT[s.motor].dir > 0 ? "→ to the + end (cell membrane)" : "← to the − end (nucleus)";
function track(s, y) {
  if (s.track === "mt") { let g = `<rect x="70" y="${y - 12}" width="470" height="24" rx="12" fill="#c8e6c9" stroke="#2e7d32" stroke-width="2"/>`; for (let x = 82; x < 535; x += 16) g += `<line x1="${x}" y1="${y - 12}" x2="${x}" y2="${y + 12}" stroke="#81c784"/>`; return g + T(62, y + 6, "−", { a: "end", s: 22, c: "#2e7d32" }) + T(548, y + 6, "+", { a: "start", s: 22, c: "#2e7d32" }) + T(300, y + 34, "microtubule", { s: 12, c: "#2e7d32" }); }
  let g = ""; for (let x = 74; x < 538; x += 13) { const o = Math.sin(x / 26) * 5; g += `<circle cx="${x}" cy="${y - 4 + o}" r="6" fill="#ef9a9a" stroke="#c62828" stroke-width="1"/><circle cx="${x + 6}" cy="${y + 4 - o}" r="6" fill="#ffcdd2" stroke="#c62828" stroke-width="1"/>`; }
  return g + T(62, y + 6, "−", { a: "end", s: 22, c: "#c62828" }) + T(548, y + 6, "+", { a: "start", s: 22, c: "#c62828" }) + T(300, y + 34, "actin filament", { s: 12, c: "#c62828" });
}
function motor(s, x, y) {
  const M = MOT[s.motor], c = M.col;
  return `<line x1="${x}" y1="${y - 14}" x2="${x}" y2="${y - 62}" stroke="${c}" stroke-width="5"/><circle cx="${x}" cy="${y - 92}" r="30" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>${T(x, y - 87, "cargo", { s: 11, c: "#f57f17" })}
    <ellipse cx="${x - 9}" cy="${y - 18}" rx="9" ry="7" fill="${c}"/><ellipse cx="${x + 9}" cy="${y - 18}" rx="9" ry="7" fill="${c}"/>${T(x, y - 138, M.name, { s: 13, c })}`;
}
function render(s) {
  const show = s.reveal, y = 260, x0 = 300, v = speed(s), d = show ? dist(s) : 0, px = Math.max(-225, Math.min(225, MOT[s.motor].dir * d / 20)), x = x0 + px;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += `<clipPath id="mmc"><rect x="21" y="21" width="558" height="408" rx="15"/></clipPath><ellipse clip-path="url(#mmc)" cx="20" cy="250" rx="46" ry="110" fill="#d1c4e9" stroke="#7e57c2" stroke-width="2"/>${T(34, 120, "nucleus", { a: "start", s: 11, c: "#5e35b1" })}<rect x="560" y="40" width="10" height="370" fill="#ffe0b2" stroke="#ef6c00"/>${T(552, 56, "cell membrane", { a: "end", s: 11, c: "#ef6c00" })}`;
  g += track(s, y);
  if (show && px) g += `<line x1="${x0}" y1="${y + 52}" x2="${x}" y2="${y + 52}" stroke="#78909c" stroke-width="2" stroke-dasharray="5 4"/>${T((x0 + x) / 2, y + 70, fmt(d) + " nm in " + s.time + " s", { s: 12, c: "#546e7a" })}<circle cx="${x0}" cy="${y + 52}" r="4" fill="#78909c"/>`;
  if (s.force > 0) { const bx = x - MOT[s.motor].dir * 0; g += `<path d="M${bx - 30},${y - 92} L${bx - 120},${y - 140} L${bx - 120},${y - 44}Z" fill="#ff5252" opacity=".12"/><line x1="${bx - 34}" y1="${y - 92}" x2="${bx - 34 - s.force * 12 - 12}" y2="${y - 92}" stroke="#d32f2f" stroke-width="4"/><path d="M${bx - 34 - s.force * 12 - 22},${y - 92} l12,-7 v14Z" fill="#d32f2f"/>${T(bx - 70, y - 104, s.force + " pN trap", { s: 12, c: "#d32f2f" })}`; }
  g += motor(s, x, y);
  if (show && !fits(s)) g += T(300, 380, `✘ ${MOT[s.motor].name} can't walk on ${s.track === "mt" ? "a microtubule" : "actin"}`, { s: 15, c: "#c62828" });
  else if (!show) g += T(300, 400, "press ▶ to add ATP and watch", { s: 14, c: "#90a4ae" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${T(120, 62, `[ATP] ${s.atp} µM · load ${s.force} pN`, { s: 12, c: "#546e7a" })}
    ${T(120, 102, "speed", { s: 12, c: "#78909c" })}${T(120, 134, show ? fmt(v) + " nm/s" : "?", { s: 24, c: "#e65100" })}
    ${show ? T(120, 166, dirTxt(s), { s: 11, c: "#37474f" }) + T(120, 206, "steps per second: " + fmt(steps(s)), { s: 13, c: "#37474f" }) + T(120, 230, "ATP used per second: " + fmt(steps(s)), { s: 13, c: "#37474f" }) + T(120, 254, "step size: " + MOT[s.motor].step + " nm", { s: 12, c: "#78909c" }) + T(120, 284, "distance: " + fmt(dist(s)) + " nm", { s: 14, c: "#37474f" }) : ""}
    ${T(120, 336, "speed = 800 × ATP ÷ (100 + ATP)", { s: 10, c: "#90a4ae" })}${T(120, 352, "× (1 − load ÷ 6 pN)", { s: 10, c: "#90a4ae" })}${T(120, 380, "1 step uses 1 ATP", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "motor", type: "choice", label: "Motor protein", options: Object.keys(MOT).map(v => ({ v, label: MOT[v].name })), lock: lk("motor") },
  { id: "track", type: "choice", label: "Track", options: [{ v: "mt", label: "Microtubule" }, { v: "actin", label: "Actin filament" }], lock: lk("track") },
  { id: "atp", type: "choice", label: "ATP concentration", options: [0, 100, 300, 900].map(v => ({ v, label: v + " µM" })), hide: () => lv < 2 && !explore, lock: lk("atp") },
  { id: "force", type: "range", label: "Optical-trap load", min: 0, max: 6, step: 0.5, nudge: 0.5, unit: "pN", hide: () => lv < 3 && !explore, lock: lk("force") },
  { id: "time", type: "range", label: "Time", min: 1, max: 10, step: 1, nudge: 1, unit: "s", hide: () => lv < 2 && !explore, lock: lk("time") }]; };
const st = o => Object.assign({ motor: "kin", track: "mt", atp: 900, force: 0, time: 4 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => fits(s) ? `${MOT[s.motor].name}: ${fmt(speed(s))} nm/s, ${dirTxt(s)}.` : `${MOT[s.motor].name} can't use that track.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🚶 Motor challenge", prompt: "Set up the motor, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Kinesin walks to the + end of microtubules (out to the membrane); dynein walks to the − end (in to the nucleus); myosin V walks on actin. Speed = 800 × ATP ÷ (100 + ATP) × (1 − load ÷ 6)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mm-sim", diff, uses, mk);
const C = {
  out: () => simQ(1, "Deliver the cargo <b>out to the cell membrane</b> along a <b>microtubule</b>.", st({ motor: "dyn" }), s => ok(fits(s) && s.track === "mt" && MOT[s.motor].dir > 0, "Kinesin walks to the + end — out to the membrane.", said(s)), { motor: "kin", track: "mt" }, { wrong: { motor: "dyn", track: "mt" } }),
  inward: () => simQ(1, "Bring the cargo <b>in towards the nucleus</b>.", st({ motor: "kin" }), s => ok(speed(s) > 0 && MOT[s.motor].dir < 0, "Dynein walks to the − end, near the nucleus.", said(s)), { motor: "dyn", track: "mt" }, { wrong: { motor: "kin", track: "mt" } }),
  actin: () => simQ(1, "The cargo is on an <b>actin filament</b>. Choose a motor that can move it.", st({ track: "actin", motor: "kin" }), s => ok(speed(s) > 0, "Myosin V walks along actin.", said(s)), { motor: "myo" }, { lock: ["track"], wrong: { motor: "dyn" } }),
  stuck: () => simQ(1, "Make a motor that <b>cannot move at all</b> because it is on the <b>wrong track</b>.", st({ motor: "kin", track: "mt" }), s => ok(!fits(s), `${MOT[s.motor].name} can't grip ${s.track === "mt" ? "microtubules" : "actin"}.`, said(s)), { motor: "myo", track: "mt" }, { wrong: { motor: "dyn", track: "mt" } }),
  v600: () => simQ(2, "Make kinesin walk at <b>600 nm/s</b>.", st({ atp: 0 }), s => ok(speed(s) === 600, "800 × 300 ÷ 400 = 600 nm/s.", said(s)), { atp: 300 }, { lock: ["motor", "track"], wrong: { atp: 900 } }),
  half: () => simQ(2, "Make kinesin walk at <b>half</b> its top speed (top speed 800 nm/s).", st({ atp: 900 }), s => ok(speed(s) === 400, "Half speed happens when [ATP] = Km = 100 µM.", said(s)), { atp: 100 }, { lock: ["motor", "track"], wrong: { atp: 300 } }),
  d3000: () => simQ(2, "With <b>300 µM ATP</b>, make the cargo travel exactly <b>3000 nm</b>.", st({ atp: 300, time: 2 }), s => ok(dist(s) === 3000, "600 nm/s × 5 s = 3000 nm.", `Distance: ${fmt(dist(s))} nm.`), { time: 5 }, { lock: ["motor", "track", "atp"], wrong: { time: 4 } }),
  noATP: () => simQ(2, "Stop the moving kinesin <b>without changing the motor or the track</b>.", st({ atp: 300 }), s => ok(speed(s) === 0 && fits(s), "No ATP → no steps. Each step needs one ATP.", said(s)), { atp: 0 }, { lock: ["motor", "track"], wrong: { atp: 100 } }),
  stall: () => simQ(3, "Find the <b>stall force</b>: the smallest load that stops kinesin.", st({ atp: 900, force: 1 }), s => ok(speed(s) === 0 && s.force === FSTALL && s.atp > 0, "6 pN — the stall force.", speed(s) ? `Still ${fmt(speed(s))} nm/s.` : "Use the load, not the ATP."), { force: 6 }, { lock: ["motor", "track", "atp"], wrong: { force: 5.5 } }),
  slow300: () => simQ(3, "With <b>300 µM ATP</b>, use the trap to slow kinesin to <b>300 nm/s</b>.", st({ atp: 300 }), s => ok(speed(s) === 300, "600 × (1 − 3 ÷ 6) = 300 nm/s.", said(s)), { force: 3 }, { lock: ["motor", "track", "atp"], wrong: { force: 2 } }),
  v200: () => simQ(3, "Make kinesin walk at exactly <b>200 nm/s</b> using ATP and load.", st({ atp: 900, force: 0 }), s => ok(speed(s) === 200, "e.g. 100 µM (400 nm/s) with a 3 pN load.", said(s)), { atp: 100, force: 3 }, { lock: ["motor", "track"], wrong: { atp: 100, force: 2 } }),
  steps50: () => simQ(3, "Make kinesin take exactly <b>50 steps per second</b> while pulling against a load.", st({ atp: 900, force: 0 }), s => ok(steps(s) === 50 && s.force > 0, "50 steps × 8 nm = 400 nm/s, e.g. 300 µM with a 2 pN load.", s.force === 0 ? "Add a load from the trap." : `${fmt(steps(s))} steps per second.`), { atp: 300, force: 2 }, { lock: ["motor", "track"], wrong: { atp: 300, force: 3 } })
};
const D = {
  pick: diff => E.diaT("mm-pick", diff, 2, () => {
    if (diff === 1) {
      const cards = E.shuffle([["kin", "mt"], ["dyn", "mt"], ["myo", "actin"], ["kin", "actin"], ["myo", "mt"]]).slice(0, 4), want = choice(["out", "in"]);
      const good = c => MOT[c[0]].track === c[1] && (want === "out" ? MOT[c[0]].dir > 0 : MOT[c[0]].dir < 0);
      if (!cards.some(good)) cards[0] = want === "out" ? ["kin", "mt"] : ["dyn", "mt"];
      return { kind: "pick", many: true, title: "👆 Which ones deliver?", prompt: `Click <b>every</b> motor that carries its cargo <b>${want === "out" ? "out to the membrane (+ end)" : "in to the nucleus (− end)"}</b>.`, answer: cards.map((c, i) => good(c) ? "m" + i : null).filter(Boolean), names: Object.fromEntries(cards.map((c, i) => ["m" + i, MOT[c[0]].name + " on " + (c[1] === "mt" ? "microtubule" : "actin")])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${cards.map((c, i) => { const x = 15 + i * 212, M = MOT[c[0]]; return `<g class="pk" data-k="m${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(x + 98, 54, M.name, { s: 17, c: M.col })}<circle cx="${x + 98}" cy="${120}" r="24" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/><line x1="${x + 98}" y1="144" x2="${x + 98}" y2="178" stroke="${M.col}" stroke-width="5"/><ellipse cx="${x + 90}" cy="184" rx="8" ry="6" fill="${M.col}"/><ellipse cx="${x + 106}" cy="184" rx="8" ry="6" fill="${M.col}"/><rect x="${x + 18}" y="192" width="160" height="16" rx="8" fill="${c[1] === "mt" ? "#c8e6c9" : "#ffcdd2"}" stroke="${c[1] === "mt" ? "#2e7d32" : "#c62828"}" stroke-width="2"/>${T(x + 14, 206, "−", { a: "end", s: 16 })}${T(x + 182, 206, "+", { a: "start", s: 16 })}${T(x + 98, 240, c[1] === "mt" ? "microtubule" : "actin", { s: 14, c: "#546e7a" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["m" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Kinesin → + end (out); dynein → − end (in); both on microtubules. Myosin V walks on actin. A motor on the wrong track can't move.", summary: "Motors and tracks" };
    }
    const pts = [[0, 0], [100, 400], [300, 600], [900, 720]], want = choice(["half", "zero", "most"]), key = { half: 100, zero: 0, most: 900 }[want];
    const sx = a => 90 + a * 0.75, sy = v => 250 - v * 0.27;
    return { kind: "pick", title: "👆 Read the curve", prompt: `Kinesin speed against [ATP] (no load). Click the point where the motor ${want === "half" ? "moves at <b>half its top speed</b> (this [ATP] is Km)" : want === "zero" ? "<b>cannot step at all</b>" : "is <b>closest to its top speed</b>"}.`, answer: ["p" + key], names: Object.fromEntries(pts.map(p => ["p" + p[0], p[0] + " µM"])),
      visual: s2 => { let g = `<rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="16" width="780" height="270" rx="14" fill="#fff" stroke="#cfd8dc"/><line x1="90" y1="250" x2="790" y2="250" stroke="#90a4ae" stroke-width="2"/><line x1="90" y1="250" x2="90" y2="30" stroke="#90a4ae" stroke-width="2"/>${T(440, 280, "[ATP] (µM)", { s: 13, c: "#546e7a" })}${T(60, 30, "nm/s", { s: 12, c: "#546e7a" })}`;
        [0, 200, 400, 600, 800].forEach(v => g += `<line x1="90" y1="${sy(v)}" x2="790" y2="${sy(v)}" stroke="#eceff1"/>${T(84, sy(v) + 4, v, { a: "end", s: 11, c: "#78909c" })}`);
        let d = ""; for (let a = 0; a <= 930; a += 10) d += (a ? " L" : "M") + sx(a) + "," + sy(VMAX * a / (KM + a)); g += `<path d="${d}" fill="none" stroke="#1e88e5" stroke-width="3"/><line x1="90" y1="${sy(800)}" x2="790" y2="${sy(800)}" stroke="#c62828" stroke-dasharray="6 5"/>${T(788, sy(800) - 6, "top speed 800", { a: "end", s: 11, c: "#c62828" })}`;
        pts.forEach(p => g += `<g class="pk" data-k="p${p[0]}"><circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="18" fill="transparent"/><circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="8" fill="#ff7043" stroke="#fff" stroke-width="2"/>${T(sx(p[0]), 268, p[0], { s: 12, c: "#37474f" })}<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="16" fill="none" ${E.ring(s2["p" + p[0]])}/></g>`);
        return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}</svg>`; },
      explain: "At [ATP] = Km (100 µM) the speed is half the top speed; with no ATP it can't step; at high ATP it approaches the top speed.", summary: "Michaelis–Menten curve" };
  }),
  num: diff => E.diaT("mm-num", diff, 2, () => {
    if (diff === 1) { const v = choice([400, 600, 720, 240]);
      return { kind: "num", title: "🧮 Steps and ATP", prompt: `Kinesin moves at <b>${v} nm/s</b>. Each step is <b>8 nm</b> and uses <b>one ATP</b>.`, visual: render(st({ atp: 900 })), fields: [{ label: "Steps per second", unit: "steps/s", answer: v / 8 }, { label: "ATP used in 10 s", unit: "ATP", answer: v / 8 * 10 }], explain: `${v} ÷ 8 = ${v / 8} steps/s → ${v / 8 * 10} ATP in 10 s.`, summary: "Steps and ATP" }; }
    if (diff === 2) { const a = choice([100, 300, 900, 400, 60]);
      return { kind: "num", title: "🧮 Speed and ATP", prompt: `Top speed 800 nm/s, Km = 100 µM. Use speed = 800 × [ATP] ÷ (100 + [ATP]) with <b>[ATP] = ${a} µM</b>.`, visual: render(st({ atp: [0, 100, 300, 900].includes(a) ? a : 300 })), fields: [{ label: "Speed", unit: "nm/s", answer: r2(800 * a / (100 + a)) }], explain: `800 × ${a} ÷ ${100 + a} = ${fmt(r2(800 * a / (100 + a)))} nm/s.`, summary: "Michaelis–Menten" }; }
    const c = choice([[300, 2], [900, 3], [100, 1.5], [300, 4.5]]), s = st({ atp: c[0], force: c[1] });
    return { kind: "num", title: "🧮 Motor under load", prompt: `[ATP] = <b>${c[0]} µM</b>, load = <b>${c[1]} pN</b>, stall force 6 pN. Speed = (no-load speed) × (1 − load ÷ 6).`, visual: render(s), fields: [{ label: "Speed", unit: "nm/s", answer: speed(s) }, { label: "Distance in 5 s", unit: "nm", answer: r2(speed(s) * 5) }], explain: `${fmt(r2(VMAX * c[0] / (KM + c[0])))} × (1 − ${c[1]} ÷ 6) = ${fmt(speed(s))} nm/s; × 5 s = ${fmt(r2(speed(s) * 5))} nm.`, summary: "Force–velocity" };
  }),
  mcq: diff => E.diaT("mm-mcq", diff, 2, () => { const q = choice([
      { ask: "Where does a motor protein get the energy for each step?", ok: "From hydrolysing ATP to ADP + phosphate", bad: ["From glucose directly", "From the cargo", "From light"], ex: "One ATP is used per step." },
      { ask: "What is the stall force of a motor?", ok: "The opposing load at which it can no longer move forward", bad: ["Its top speed", "The force it needs to start", "The weight of its cargo"], ex: "At the stall force the speed drops to zero." },
      { ask: "Why does the speed stop rising at very high ATP?", ok: "The motor's ATP sites are saturated — it can't step any faster", bad: ["ATP becomes toxic", "The track breaks", "Cargo gets heavier"], ex: "Like an enzyme, the motor approaches Vmax." },
      { ask: "Which motor moves vesicles from the cell edge back toward the nucleus?", ok: "Dynein", bad: ["Kinesin", "Myosin V", "RNA polymerase"], ex: "Dynein walks toward the minus end near the centre of the cell." }]);
    return { kind: "mcq", title: "📘 Motor ideas", prompt: "Think about tracks, direction, ATP and load.", visual: render(st({ atp: 300, force: 2, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Motor proteins" }; })
};
const LEVELS = {
  1: { intro: "Motor proteins carry cargo along tracks. Each motor fits one kind of track and walks one way.", pool: () => [S(1, 1, C.out), S(2, 1, C.inward), S(2, 1, C.actin), S(3, 1, C.stuck), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Speed depends on ATP: it rises fast, then levels off at the top speed (Michaelis–Menten).", pool: () => [S(1, 1, C.noATP), S(2, 1, C.v600), S(2, 1, C.half), S(3, 1, C.d3000), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "An optical trap pulls back on the cargo. The bigger the load, the slower the motor — until it stalls.", pool: () => [S(1, 1, C.slow300), S(2, 1, C.stall), S(3, 1, C.v200), S(3, 1, C.steps50), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Choose a motor and a track, change the ATP and the load, then press ▶ to watch it walk.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Walk",
  goals: () => [{ txt: "Move cargo out to the membrane", test: (s, m) => m.o }, { txt: "Move cargo in to the nucleus", test: (s, m) => m.i }, { txt: "Stall a motor with the trap", test: (s, m) => m.s }],
  track: (s, m, ran) => { if (!ran) return; if (speed(s) > 0 && MOT[s.motor].dir > 0) m.o = 1; if (speed(s) > 0 && MOT[s.motor].dir < 0) m.i = 1; if (fits(s) && s.atp > 0 && s.force >= FSTALL) m.s = 1; },
  facts: () => "📘 <b>Motor proteins</b> (kinesin, dynein, myosin) turn the energy of ATP into steps along the cell's skeleton."
});
E.start({ labId: "motors", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🚶", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧬", "⚙️", "🔋", "✨"],
  exploreDemo: () => [{ set: { motor: "kin", track: "mt" }, run: true }, { set: { motor: "dyn" }, run: true }, { set: { motor: "kin", force: 6 }, run: true }] });
})();
