"use strict";
// ===== Reversible Reactions & Equilibrium — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
const TEMPS = ["cold", "room", "hot"], KF = { cold: 0.1, room: 0.2, hot: 0.45 }, KR = { cold: 0.2, room: 0.2, hot: 0.15 };
const DIST = { none: "Nothing", addA: "Add 6 A", addB: "Add 6 B", remB: "Remove all B", heat: "Heat it up", cool: "Cool it down" };
const Kc = t => r2(KF[t] / KR[t]);
const eq = (N, t) => ({ A: N / (1 + Kc(t)), B: N * Kc(t) / (1 + Kc(t)) });
function phases(s) {
  const N = s.a + s.b, e1 = eq(N, s.temp); let t2 = s.temp, A2 = e1.A, B2 = e1.B;
  if (s.dist === "addA") A2 += 6; if (s.dist === "addB") B2 += 6; if (s.dist === "remB") B2 = 0;
  if (s.dist === "heat") t2 = TEMPS[Math.min(2, TEMPS.indexOf(s.temp) + 1)]; if (s.dist === "cool") t2 = TEMPS[Math.max(0, TEMPS.indexOf(s.temp) - 1)];
  const e2 = eq(A2 + B2, t2);
  const shift = s.dist === "none" ? "none" : Math.abs(e2.B - B2) < 1e-9 ? "none" : e2.B > B2 ? "right" : "left";
  return { N, e1, t2, A2, B2, e2, shift };
}
const fin = s => { const p = phases(s); return { A: r1(p.e2.A), B: r1(p.e2.B) }; };
const rate = (t, cat) => (KF[t] + KR[t]) * (cat ? 3 : 1);
const tEq = s => r1(3 / rate(s.temp, s.cat));
function render(s) {
  const show = s.reveal, p = phases(s), f = fin(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(300, 46, "A  ⇌  B   (forward reaction is endothermic)", { s: 14, c: "#37474f" })}`;
  // container
  const nA = Math.round(show ? f.A : s.a), nB = Math.round(show ? f.B : s.b), tcol = { cold: "#e3f2fd", room: "#fafafa", hot: "#fff3e0" }[show ? p.t2 : s.temp];
  g += `<rect x="40" y="62" width="190" height="190" rx="12" fill="${tcol}" stroke="#78909c" stroke-width="3"/>${T(135, 270, show ? "at the end" : "at the start", { s: 12, c: "#546e7a" })}`;
  const spots = []; for (let i = 0; i < 36; i++) spots.push([58 + (i % 6) * 31 + ((i * 7) % 5), 80 + Math.floor(i / 6) * 29 + ((i * 3) % 4)]);
  for (let i = 0; i < Math.min(36, nA + nB); i++) { const [x, y] = spots[(i * 13) % 36]; g += i < nA ? `<circle cx="${x}" cy="${y}" r="10" fill="#42a5f5" stroke="#1565c0"/>${T(x, y + 4, "A", { s: 10, c: "#fff" })}` : `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" rx="5" fill="#ffa726" stroke="#e65100"/>${T(x, y + 4, "B", { s: 10, c: "#fff" })}`; }
  g += T(135, 294, (show ? p.t2 : s.temp) + " · " + (s.cat ? "catalyst ✔" : "no catalyst"), { s: 11, c: "#78909c" });
  // graph
  const gx = t => 270 + t * 4.8, gy = n => 380 - n * 12, k1 = rate(s.temp, s.cat), k2 = rate(p.t2, s.cat);
  g += `<rect x="250" y="62" width="320" height="350" fill="#fafafa" stroke="#eceff1"/><line x1="270" y1="380" x2="560" y2="380" stroke="#90a4ae" stroke-width="1.5"/><line x1="270" y1="380" x2="270" y2="70" stroke="#90a4ae" stroke-width="1.5"/>${T(556, 408, "time (s)", { a: "end", s: 11, c: "#546e7a" })}${T(276, 80, "number of molecules", { a: "start", s: 11, c: "#546e7a" })}`;
  [0, 10, 20, 30, 40, 50, 60].forEach(t => g += T(gx(t), 394, t, { s: 10, c: "#90a4ae" }));
  [6, 12, 18, 24].forEach(n => g += `<line x1="270" y1="${gy(n)}" x2="560" y2="${gy(n)}" stroke="#f0f0f0"/>${T(266, gy(n) + 4, n, { a: "end", s: 10, c: "#90a4ae" })}`);
  if (show) {
    let dA = "", dB = ""; for (let t = 0; t <= 60; t += 0.5) { let A, B; if (t <= 30 || s.dist === "none") { const tt = Math.min(t, 1e9); A = p.e1.A + (s.a - p.e1.A) * Math.exp(-k1 * tt); B = p.N - A; } else { const tt = t - 30; A = p.e2.A + (p.A2 - p.e2.A) * Math.exp(-k2 * tt); B = p.A2 + p.B2 - A; } dA += (t ? " L" : "M") + gx(t) + "," + gy(A); dB += (t ? " L" : "M") + gx(t) + "," + gy(B); }
    if (s.dist !== "none") g += `<line x1="${gx(30)}" y1="72" x2="${gx(30)}" y2="380" stroke="#8e24aa" stroke-dasharray="5 4"/>${T(gx(30) + 4, 96, DIST[s.dist], { a: "start", s: 11, c: "#8e24aa" })}`;
    g += `<path d="${dA}" fill="none" stroke="#1e88e5" stroke-width="3"/><path d="${dB}" fill="none" stroke="#fb8c00" stroke-width="3"/>${T(548, gy(p.e2.A) - 6, "A", { a: "end", s: 12, c: "#1565c0" })}${T(548, gy(p.e2.B) - 6, "B", { a: "end", s: 12, c: "#e65100" })}`;
  } else g += T(415, 230, "press ▶ to let it react", { s: 14, c: "#90a4ae" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 58, `start: ${s.a} A, ${s.b} B`, { s: 13, c: "#37474f" })}
    ${show ? T(120, 92, "Kc = [B] ÷ [A] = " + Kc(s.temp) + " (" + s.temp + ")", { s: 12, c: "#546e7a" }) + T(120, 120, `equilibrium: ${fmt(r1(p.e1.A))} A, ${fmt(r1(p.e1.B))} B`, { s: 13, c: "#37474f" }) + T(120, 144, "reached in about " + tEq(s) + " s", { s: 12, c: "#78909c" })
      + (s.dist !== "none" ? T(120, 186, "then: " + DIST[s.dist], { s: 13, c: "#8e24aa" }) + T(120, 212, p.shift === "right" ? "→ shifts RIGHT (more B)" : p.shift === "left" ? "← shifts LEFT (more A)" : "no shift", { s: 14, c: "#6a1b9a" }) + T(120, 238, `new equilibrium: ${fmt(f.A)} A, ${fmt(f.B)} B`, { s: 12, c: "#37474f" }) + (p.t2 !== s.temp ? T(120, 260, "new Kc = " + Kc(p.t2), { s: 12, c: "#546e7a" }) : "") : "")
      : T(120, 180, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 330, "at equilibrium the forward and", { s: 10, c: "#90a4ae" })}${T(120, 346, "backward rates are equal", { s: 10, c: "#90a4ae" })}${T(120, 372, "a catalyst only makes it faster", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "a", type: "range", label: "Start with A", min: 0, max: 24, step: 1, nudge: 1, unit: "", lock: lk("a") },
  { id: "b", type: "range", label: "Start with B", min: 0, max: 24, step: 1, nudge: 1, unit: "", lock: lk("b") },
  { id: "temp", type: "choice", label: "Temperature", options: TEMPS.map(v => ({ v, label: v[0].toUpperCase() + v.slice(1) })), hide: () => lv < 2 && !explore, lock: lk("temp") },
  { id: "cat", type: "toggle", label: "Add a catalyst", lock: lk("cat") },
  { id: "dist", type: "select", label: "At 30 s, then…", options: Object.keys(DIST).map(v => ({ v, label: DIST[v] })), hide: () => lv < 3 && !explore, lock: lk("dist") }]; };
const st = o => Object.assign({ a: 12, b: 0, temp: "room", cat: false, dist: "none" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => { const f = fin(s); return `Ends with ${fmt(f.A)} A and ${fmt(f.B)} B.`; };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⚖️ Equilibrium challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "At equilibrium B ÷ A = Kc. Kc: cold 0.5, room 1, hot 3 (the forward reaction is endothermic). Total molecules stay the same. Le Chatelier: the system shifts to undo a change — add A or remove B → right; add B → left; heat → endothermic direction (right)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("eq-sim", diff, uses, mk);
const C = {
  six: () => simQ(1, "Start with <b>only A</b> and end with <b>6 A and 6 B</b> at equilibrium.", st({ a: 8, b: 0 }), s => ok(s.b === 0 && fin(s).A === 6 && fin(s).B === 6, "12 A → 6 A + 6 B (Kc = 1).", s.b !== 0 ? "Start with A only." : said(s)), { a: 12 }, { lock: ["b"], wrong: { a: 10 } }),
  fromB: () => simQ(1, "Start with <b>only B</b> and end with <b>5 of each</b>.", st({ a: 0, b: 4 }), s => ok(s.a === 0 && fin(s).A === 5 && fin(s).B === 5, "10 B → 5 A + 5 B: the reverse reaction works too.", s.a !== 0 ? "Start with B only." : said(s)), { b: 10 }, { lock: ["a"], wrong: { b: 12 } }),
  faster: () => simQ(1, "Reach equilibrium <b>faster</b> without changing the amounts at equilibrium.", st({ a: 12 }), s => ok(s.cat && fin(s).B === 6, "A catalyst speeds up both directions equally.", !s.cat ? "Still the same speed." : said(s)), { cat: true }, { lock: ["a", "b"], wrong: { cat: false } }),
  already: () => simQ(1, "Set up a mixture that is <b>already at equilibrium</b> (nothing changes).", st({ a: 10, b: 2 }), s => ok(s.a > 0 && s.a === s.b, "Equal amounts: B ÷ A = 1 = Kc already.", "The amounts change — it was not at equilibrium."), { a: 6, b: 6 }, { wrong: { a: 7, b: 5 } }),
  mostB: () => simQ(2, "Make <b>B</b> the main product: at least <b>75%</b> B at equilibrium.", st({ a: 12, temp: "cold" }), s => ok(fin(s).B / (s.a + s.b) >= 0.75, "Hot: Kc = 3 → 75% B.", said(s)), { temp: "hot" }, { lock: ["a", "b"], wrong: { temp: "room" } }),
  k05: () => simQ(2, "Choose the temperature that makes <b>Kc = 0.5</b>.", st({ a: 12, temp: "hot" }), s => ok(Kc(s.temp) === 0.5, "Cold: the endothermic forward reaction is slowed.", `Kc = ${Kc(s.temp)}.`), { temp: "cold" }, { lock: ["a", "b"], wrong: { temp: "room" } }),
  four: () => simQ(2, "Start with <b>12 A</b>. Get exactly <b>4 B</b> at equilibrium.", st({ a: 12, temp: "room" }), s => ok(fin(s).B === 4, "Cold (Kc 0.5): 12 × 0.5 ÷ 1.5 = 4 B.", said(s)), { temp: "cold" }, { lock: ["a", "b"], wrong: { temp: "room" } }),
  catK: () => simQ(2, "Turn the <b>catalyst on</b> and get <b>Kc = 1</b>.", st({ temp: "hot" }), s => ok(s.cat && Kc(s.temp) === 1, "Room temperature. The catalyst does not change Kc.", !s.cat ? "Turn the catalyst on." : `Kc = ${Kc(s.temp)}.`), { cat: true, temp: "room" }, { lock: ["a", "b"], wrong: { cat: true, temp: "hot" } }),
  right: () => simQ(3, "After equilibrium, make a change that shifts it to the <b>right</b> (more B).", st({ a: 12 }), s => ok(phases(s).shift === "right", `${DIST[s.dist]} → shifts right.`, phases(s).shift === "left" ? "That shifts left." : "No shift."), { dist: "addA" }, { lock: ["a", "b", "temp"], wrong: { dist: "addB" } }),
  leftT: () => simQ(3, "Shift the equilibrium to the <b>left</b> using <b>temperature</b>.", st({ a: 12, temp: "room" }), s => ok(phases(s).shift === "left" && (s.dist === "cool"), "Cooling favours the exothermic (backward) direction.", s.dist !== "cool" && s.dist !== "heat" ? "Use a temperature change." : "That shifts right."), { dist: "cool" }, { lock: ["a", "b", "temp"], wrong: { dist: "heat" } }),
  nine: () => simQ(3, "Start with <b>6 A and 6 B</b> at room temperature. Use one change at 30 s so it ends with <b>9 B</b>.", st({ a: 6, b: 6 }), s => ok(fin(s).B === 9, `${DIST[s.dist]}: ends with 9 B.`, said(s)), { dist: "addA" }, { lock: ["a", "b", "temp"], wrong: { dist: "remB" } }),
  three: () => simQ(3, "Start with <b>12 A</b> at room temperature. Use one change so it ends with exactly <b>3 B</b>.", st({ a: 12 }), s => ok(fin(s).B === 3, "Removing B: 6 A left → 3 A + 3 B.", said(s)), { dist: "remB" }, { lock: ["a", "b", "temp"], wrong: { dist: "cool" } })
};
const D = {
  pick: diff => E.diaT("eq-pick", diff, 2, () => {
    if (diff === 1) {
      const k = 0.4, a0 = 20, Ae = 10, pts = [3, 6, 12, 25], target = 12;
      return { kind: "pick", title: "👆 When is equilibrium reached?", prompt: "The graph shows A turning into B. Click the <b>first</b> point where the amounts stop changing (equilibrium).", answer: ["t" + target], names: Object.fromEntries(pts.map(t => ["t" + t, t + " s"])),
        visual: s2 => { const gx = t => 100 + t * 24, gy = n => 260 - n * 11; let dA = "", dB = ""; for (let t = 0; t <= 28; t += 0.25) { const A = Ae + (a0 - Ae) * Math.exp(-k * t); dA += (t ? " L" : "M") + gx(t) + "," + gy(A); dB += (t ? " L" : "M") + gx(t) + "," + gy(a0 - A); }
          return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="10" width="780" height="280" rx="14" fill="#fff" stroke="#cfd8dc"/><line x1="100" y1="260" x2="790" y2="260" stroke="#90a4ae" stroke-width="2"/><line x1="100" y1="260" x2="100" y2="24" stroke="#90a4ae" stroke-width="2"/>${T(786, 280, "time (s)", { a: "end", s: 12, c: "#546e7a" })}<path d="${dA}" fill="none" stroke="#1e88e5" stroke-width="3"/><path d="${dB}" fill="none" stroke="#fb8c00" stroke-width="3"/>${T(780, gy(10) - 8, "A and B", { a: "end", s: 12, c: "#37474f" })}${pts.map(t => `<g class="pk" data-k="t${t}"><rect x="${gx(t) - 16}" y="24" width="32" height="236" fill="transparent"/><line x1="${gx(t)}" y1="30" x2="${gx(t)}" y2="260" stroke="#b0bec5" stroke-dasharray="4 4"/>${T(gx(t), 276, t + " s", { s: 12, c: "#37474f" })}<rect x="${gx(t) - 16}" y="24" width="32" height="236" rx="8" fill="none" ${E.ring(s2["t" + t])}/></g>`).join("")}</svg>`; },
        explain: "At equilibrium the lines go flat: the forward and backward rates are equal (here from about 12 s).", summary: "Reaching equilibrium" };
    }
    const pool = E.shuffle(Object.keys(DIST).filter(k => k !== "none")).slice(0, 4), want = choice(["right", "left"]), t = k => phases(st({ a: 12, dist: k })).shift === want;
    if (!pool.some(t)) pool[0] = want === "right" ? "addA" : "addB";
    const icon = { addA: "➕ A", addB: "➕ B", remB: "➖ B", heat: "🔥 heat", cool: "❄️ cool" };
    return { kind: "pick", many: true, title: "👆 Le Chatelier", prompt: `A ⇌ B (forward is endothermic), at equilibrium. Click <b>every</b> change that shifts it to the <b>${want}</b>.`, answer: pool.map((k, i) => t(k) ? "d" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((k, i) => ["d" + i, DIST[k]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((k, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="d${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(x + 98, 140, icon[k], { s: 34, c: "#37474f" })}${T(x + 98, 210, DIST[k], { s: 16, c: "#546e7a" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["d" + i])}/></g>`; }).join("")}</svg>`,
      explain: "Right: add A, remove B, heat (endothermic way). Left: add B, cool.", summary: "Le Chatelier's principle" };
  }),
  num: diff => E.diaT("eq-num", diff, 2, () => {
    if (diff === 1) { const c = choice([[4, 8], [3, 9], [10, 5], [6, 6]]);
      return { kind: "num", title: "🧮 Find Kc", prompt: `At equilibrium a container has <b>${c[0]} A</b> and <b>${c[1]} B</b> (same volume). Kc = [B] ÷ [A].`, visual: render(st({ a: c[0], b: c[1] })), fields: [{ label: "Kc", unit: "", answer: r2(c[1] / c[0]) }], explain: `${c[1]} ÷ ${c[0]} = ${fmt(r2(c[1] / c[0]))}.`, summary: "Equilibrium constant" }; }
    if (diff === 2) { const c = choice([[12, 3], [20, 1], [12, 0.5], [16, 3]]);
      return { kind: "num", title: "🧮 Equilibrium amounts", prompt: `You start with <b>${c[0]} A</b> and no B. Kc = <b>${c[1]}</b>. At equilibrium B ÷ A = Kc and A + B = ${c[0]}.`, visual: render(st({ a: c[0] })), fields: [{ label: "B at equilibrium", unit: "", answer: r2(c[0] * c[1] / (1 + c[1])) }], explain: `B = ${c[0]} × ${c[1]} ÷ ${1 + c[1]} = ${fmt(r2(c[0] * c[1] / (1 + c[1])))}.`, summary: "Using Kc" }; }
    const s = st({ a: choice([12, 18]), dist: choice(["addA", "remB", "addB"]) }), f = fin(s);
    return { kind: "num", title: "🧮 After the change", prompt: `Room temperature (Kc = 1). Start: <b>${s.a} A</b>. At equilibrium you <b>${DIST[s.dist].toLowerCase()}</b>.`, visual: render(Object.assign({}, s, { reveal: false })), fields: [{ label: "B at the new equilibrium", unit: "", answer: f.B }], explain: `First: ${s.a / 2} A, ${s.a / 2} B. After the change the total is ${fmt(r1(phases(s).A2 + phases(s).B2))}, shared equally → ${fmt(f.B)} B.`, summary: "Le Chatelier calculation" };
  }),
  mcq: diff => E.diaT("eq-mcq", diff, 2, () => { const q = choice([
      { ask: "At dynamic equilibrium…", ok: "the forward and backward reactions continue at equal rates", bad: ["both reactions stop", "there are equal amounts of A and B, always", "only the forward reaction happens"], ex: "Molecules keep changing, but the amounts stay constant." },
      { ask: "What does a catalyst do to an equilibrium?", ok: "It is reached faster, but the amounts at equilibrium are unchanged", bad: ["It shifts it to the right", "It increases Kc", "It stops the reverse reaction"], ex: "It speeds up both directions equally." },
      { ask: "For an endothermic forward reaction, raising the temperature…", ok: "shifts the equilibrium to the right and increases Kc", bad: ["shifts it to the left", "has no effect", "decreases Kc"], ex: "The system absorbs the added heat by going the endothermic way." },
      { ask: "Le Chatelier's principle says that a system at equilibrium…", ok: "shifts to oppose any change made to it", bad: ["always moves to the right", "ignores changes", "makes the change bigger"], ex: "It partly undoes the disturbance." }]);
    return { kind: "mcq", title: "📘 Equilibrium ideas", prompt: "Think about rates, Kc and Le Chatelier.", visual: render(st({ a: 12, dist: "addA", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Equilibrium" }; })
};
const LEVELS = {
  1: { intro: "A reversible reaction goes both ways. It settles at equilibrium, where B ÷ A = Kc.", pool: () => [S(1, 1, C.six), S(2, 1, C.fromB), S(2, 1, C.faster), S(3, 1, C.already), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Temperature changes Kc. Because the forward reaction is endothermic, heating makes more B.", pool: () => [S(1, 1, C.k05), S(2, 1, C.mostB), S(2, 1, C.catK), S(3, 1, C.four), D.num(2), D.pick(2), D.mcq(3)] },
  3: { intro: "Disturb the equilibrium and watch it shift to oppose the change (Le Chatelier).", pool: () => [S(1, 1, C.right), S(2, 1, C.leftT), S(3, 1, C.nine), S(3, 1, C.three), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Choose the starting amounts, the temperature and a change at 30 s. Press ▶ to watch the reaction settle.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ React",
  goals: () => [{ txt: "Reach equilibrium from A only", test: (s, m) => m.a }, { txt: "Try the catalyst", test: (s, m) => m.c }, { txt: "Shift the equilibrium", test: (s, m) => m.s }],
  track: (s, m, ran) => { if (!ran) return; if (s.b === 0 && s.a > 0) m.a = 1; if (s.cat) m.c = 1; if (phases(s).shift !== "none") m.s = 1; },
  facts: () => "📘 At <b>equilibrium</b> the reaction has not stopped — both directions run at the same rate."
});
E.start({ labId: "equil", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⚖️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚖️", "🔄", "🧪", "✨"],
  exploreDemo: () => [{ set: { a: 12, b: 0, cat: true }, run: true }, { set: { dist: "heat" }, run: true }] });
})();
