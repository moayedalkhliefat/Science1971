"use strict";
// ===== Diffusion — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const GAS = { He: { name: "Helium (He)", M: 4, c: "#26c6da" }, CH4: { name: "Methane (CH₄)", M: 16, c: "#66bb6a" }, NH3: { name: "Ammonia (NH₃)", M: 17, c: "#7e57c2" }, Ne: { name: "Neon (Ne)", M: 20, c: "#ef5350" }, O2: { name: "Oxygen (O₂)", M: 32, c: "#42a5f5" }, HCl: { name: "Hydrogen chloride (HCl)", M: 36.5, c: "#d4e157" }, CO2: { name: "Carbon dioxide (CO₂)", M: 44, c: "#78909c" }, SO2: { name: "Sulfur dioxide (SO₂)", M: 64, c: "#ffa726" } };
const speed = (g, T) => Math.round(Math.sqrt(3 * 8.314 * T / (GAS[g].M / 1000)));
const tMix = s => r2(2000 / speed(s.g1, s.T));
const ratio = s => r2(Math.sqrt(GAS[s.g2].M / GAS[s.g1].M)); // rate of g1 ÷ rate of g2
const meet = s => { const a = 1 / Math.sqrt(GAS[s.g1].M), b = 1 / Math.sqrt(GAS[s.g2].M); return r2(100 * a / (a + b)); }; // cm from the left
function render(s) {
  const show = s.reveal, G1 = GAS[s.g1], G2 = GAS[s.g2];
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`, rows = "";
  if (s.mode === "box") {
    const f = show ? Math.min(1, 2 / tMix(s)) : 0, W = 460, x0 = 70;
    g += `<rect x="${x0}" y="90" width="${W}" height="240" rx="10" fill="${s.T > 400 ? "#fff3e0" : s.T < 250 ? "#e3f2fd" : "#fafafa"}" stroke="#546e7a" stroke-width="3"/>${show ? "" : `<rect x="${x0 + W / 2 - 3}" y="90" width="6" height="240" fill="#546e7a"/>`}${T(x0 + W / 4, 80, G1.name, { s: 13, c: "#37474f" })}${T(x0 + 3 * W / 4, 80, "empty", { s: 13, c: "#90a4ae" })}`;
    for (let i = 0; i < 40; i++) { const rx = ((i * 37) % 100) / 100, ry = ((i * 53) % 97) / 97, spread = (0.5 + f * 0.5); const x = x0 + 14 + rx * (W * spread - 28), y = 104 + ry * 212; g += `<circle cx="${x}" cy="${y}" r="7" fill="${G1.c}" stroke="#37474f" stroke-width=".8"/>`; }
    g += T(300, 360, show ? (f >= 1 ? "after 2 s: spread evenly" : `after 2 s: ${Math.round(f * 100)}% of the way`) : "press ▶ to remove the divider", { s: 14, c: show ? "#37474f" : "#90a4ae" }) + T(300, 390, s.T + " K", { s: 13, c: "#78909c" });
    rows = `${T(120, 64, G1.name, { s: 13, c: "#37474f" })}${T(120, 86, "molar mass " + G1.M + " g/mol", { s: 12, c: "#78909c" })}${show ? T(120, 128, "average speed", { s: 12, c: "#78909c" }) + T(120, 158, speed(s.g1, s.T) + " m/s", { s: 22, c: "#e65100" }) + T(120, 200, "time to spread evenly", { s: 12, c: "#78909c" }) + T(120, 228, fmt(tMix(s)) + " s", { s: 20, c: "#00838f" }) : T(120, 180, "?", { s: 26, c: "#90a4ae" })}${T(120, 330, "speed = √(3RT ÷ M)", { s: 13, c: "#37474f" })}${T(120, 356, "lighter or hotter → faster", { s: 10, c: "#90a4ae" })}${T(120, 372, "spread time = 2000 ÷ speed (model)", { s: 10, c: "#90a4ae" })}`;
  } else {
    const L = 60, R = 540, y = 200, m = meet(s), mx = L + (R - L) * m / 100;
    g += `<rect x="${L}" y="${y - 30}" width="${R - L}" height="60" rx="30" fill="#e3f2fd" opacity=".5" stroke="#78909c" stroke-width="3"/><rect x="${L - 14}" y="${y - 34}" width="28" height="68" rx="8" fill="#fff" stroke="#bdbdbd" stroke-width="2"/><rect x="${R - 14}" y="${y - 34}" width="28" height="68" rx="8" fill="#fff" stroke="#bdbdbd" stroke-width="2"/>${T(L + 10, y + 64, G1.name.match(/\((.+)\)/)[1], { s: 15, c: "#37474f" })}${T(R - 10, y + 64, G2.name.match(/\((.+)\)/)[1], { s: 15, c: "#37474f" })}${T(L, y - 46, "cotton wool", { s: 10, c: "#9e9e9e" })}${T(R, y - 46, "cotton wool", { s: 10, c: "#9e9e9e" })}`;
    for (let i = 0; i <= 10; i++) g += `<line x1="${L + i * 48}" y1="${y + 34}" x2="${L + i * 48}" y2="${y + 42}" stroke="#90a4ae"/>${T(L + i * 48, y + 98, i * 10, { s: 10, c: "#90a4ae" })}`;
    g += T(300, y + 118, "distance from the left (cm)", { s: 11, c: "#78909c" });
    if (show) {
      for (let i = 0; i < 14; i++) { const x1 = L + 18 + (mx - L - 30) * ((i * 37) % 100) / 100, y1 = y - 22 + ((i * 29) % 44); g += `<circle cx="${x1}" cy="${y1}" r="5" fill="${G1.c}"/>`; const x2 = mx + 12 + (R - mx - 30) * ((i * 41) % 100) / 100, y2 = y - 22 + ((i * 31) % 44); g += `<circle cx="${x2}" cy="${y2}" r="5" fill="${G2.c}"/>`; }
      g += `<rect x="${mx - 7}" y="${y - 30}" width="14" height="60" fill="#fff" stroke="#9e9e9e"/><line x1="${mx}" y1="${y - 60}" x2="${mx}" y2="${y - 34}" stroke="#37474f" stroke-width="2"/>${T(mx, y - 66, "they meet at " + fmt(m) + " cm", { s: 13, c: "#37474f" })}`;
    } else g += T(300, 110, "press ▶ to release both gases", { s: 14, c: "#90a4ae" });
    rows = `${T(120, 64, s.g1 + ": " + G1.M + " g/mol", { s: 13, c: "#37474f" })}${T(120, 86, s.g2 + ": " + G2.M + " g/mol", { s: 13, c: "#37474f" })}${show ? T(120, 128, `rate ${s.g1} ÷ rate ${s.g2}`, { s: 12, c: "#78909c" }) + T(120, 158, "= " + fmt(ratio(s)), { s: 22, c: "#e65100" }) + T(120, 182, ratio(s) > 1 ? s.g1 + " is faster" : ratio(s) < 1 ? s.g2 + " is faster" : "same speed", { s: 12, c: "#37474f" }) + T(120, 222, "meeting point", { s: 12, c: "#78909c" }) + T(120, 250, fmt(meet(s)) + " cm from the left", { s: 16, c: "#00838f" }) : T(120, 180, "?", { s: 26, c: "#90a4ae" })}${T(120, 320, "Graham's law:", { s: 12, c: "#37474f" })}${T(120, 344, "rate₁ ÷ rate₂ = √(M₂ ÷ M₁)", { s: 13, c: "#37474f" })}${T(120, 370, "the slower gas travels less far", { s: 10, c: "#90a4ae" })}`;
  }
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${rows}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const gOpts = Object.keys(GAS).map(v => ({ v, label: GAS[v].name + " — " + GAS[v].M }));
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Experiment", options: [{ v: "box", label: "One gas spreading" }, { v: "tube", label: "Two-gas tube" }] }] : []),
  { id: "g1", type: "select", label: "Gas (left)", options: gOpts, lock: lk("g1") },
  { id: "g2", type: "select", label: "Gas (right)", options: gOpts, hide: s => s.mode !== "tube", lock: lk("g2") },
  { id: "T", type: "range", label: "Temperature", min: 100, max: 600, step: 50, nudge: 50, unit: "K", hide: s => s.mode !== "box", lock: lk("T") }]; };
const st = o => Object.assign({ mode: "box", g1: "O2", g2: "HCl", T: 300 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => s.mode === "box" ? `${GAS[s.g1].name} at ${s.T} K: ${speed(s.g1, s.T)} m/s, spreads in ${fmt(tMix(s))} s.` : `Rate ratio ${fmt(ratio(s))}; they meet at ${fmt(meet(s))} cm.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "box" ? "💨 Spreading challenge" : "🧪 Tube challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Lighter particles and higher temperatures move faster: speed = √(3RT ÷ M). Graham's law: rate₁ ÷ rate₂ = √(M₂ ÷ M₁). In the tube, the faster gas travels further before they meet." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("df-sim", diff, uses, mk);
const C = {
  fast2: () => simQ(1, "At <b>300 K</b>, choose a gas that spreads evenly in <b>under 2 seconds</b>.", st({ g1: "CO2" }), s => ok(tMix(s) < 2, `${GAS[s.g1].name}: ${fmt(tMix(s))} s — light particles move fast.`, said(s)), { g1: "He" }, { lock: ["T"], wrong: { g1: "Ne" } }),
  o600: () => simQ(1, "Make <b>oxygen</b> particles move at about <b>600 m/s</b> (within 15).", st({ g1: "O2", T: 200 }), s => ok(Math.abs(speed(s.g1, s.T) - 600) <= 15, "About 450 K.", said(s)), { T: 450 }, { lock: ["g1"], wrong: { T: 500 } }),
  slow: () => simQ(1, "At <b>300 K</b>, choose the gas that spreads <b>most slowly</b>.", st({ g1: "He" }), s => ok(s.g1 === "SO2", "SO₂ (64 g/mol) is the heaviest here.", `${GAS[s.g1].name}: ${fmt(tMix(s))} s — another gas is slower.`), { g1: "SO2" }, { lock: ["T"], wrong: { g1: "CO2" } }),
  heMatch: () => simQ(1, "Make <b>helium</b> spread exactly as fast as <b>neon at 500 K</b>.", st({ g1: "He", T: 400 }), s => ok(speed(s.g1, s.T) === speed("Ne", 500), "100 K: T ÷ M is the same (100 ÷ 4 = 500 ÷ 20).", `He: ${speed(s.g1, s.T)} m/s; Ne at 500 K: ${speed("Ne", 500)} m/s.`), { T: 100 }, { lock: ["g1"], wrong: { T: 150 } }),
  twice: () => simQ(2, "Choose two gases so the left gas diffuses <b>exactly twice</b> as fast as the right gas.", st({ mode: "tube", g1: "O2", g2: "HCl" }), s => ok(ratio(s) === 2, `√(${GAS[s.g2].M} ÷ ${GAS[s.g1].M}) = 2.`, said(s)), { g1: "He", g2: "CH4" }, { wrong: { g1: "He", g2: "NH3" } }),
  r15: () => simQ(2, "<b>Methane</b> is on the left. Choose a gas so methane is about <b>1.5 times</b> faster (within 0.02).", st({ mode: "tube", g1: "CH4", g2: "O2" }), s => ok(Math.abs(ratio(s) - 1.5) <= 0.02, `${GAS[s.g2].name}: √(${GAS[s.g2].M} ÷ 16) = ${fmt(ratio(s))}.`, said(s)), { g2: "HCl" }, { lock: ["g1"], wrong: { g2: "CO2" } }),
  near: () => simQ(2, "Choose two <b>different</b> gases that diffuse at almost the <b>same rate</b> (ratio between 0.97 and 1.03).", st({ mode: "tube", g1: "He", g2: "SO2" }), s => ok(s.g1 !== s.g2 && ratio(s) >= 0.97 && ratio(s) <= 1.03, `${s.g1} and ${s.g2} have nearly equal molar masses.`, s.g1 === s.g2 ? "Use two different gases." : said(s)), { g1: "CH4", g2: "NH3" }, { wrong: { g1: "O2", g2: "HCl" } }),
  four: () => simQ(2, "<b>SO₂</b> is on the right. Choose a left gas that is <b>4 times</b> faster.", st({ mode: "tube", g1: "Ne", g2: "SO2" }), s => ok(ratio(s) === 4, "He: √(64 ÷ 4) = 4.", said(s)), { g1: "He" }, { lock: ["g2"], wrong: { g1: "CH4" } }),
  nh4cl: () => simQ(3, "Set up the classic experiment: <b>NH₃</b> on the left, <b>HCl</b> on the right. Where does the white ring form?", st({ mode: "tube", g1: "HCl", g2: "NH3" }), s => ok(s.g1 === "NH3" && s.g2 === "HCl", "About 59 cm from the NH₃ end — ammonia is lighter, so it travels further.", "Put NH₃ on the left and HCl on the right."), { g1: "NH3", g2: "HCl" }, { wrong: { g1: "HCl", g2: "NH3" } }),
  middle: () => simQ(3, "Make two <b>different</b> gases meet within <b>1 cm</b> of the <b>middle</b> (50 cm).", st({ mode: "tube", g1: "He", g2: "CO2" }), s => ok(s.g1 !== s.g2 && Math.abs(meet(s) - 50) <= 1, `They meet at ${fmt(meet(s))} cm.`, s.g1 === s.g2 ? "Use two different gases." : said(s)), { g1: "CH4", g2: "NH3" }, { wrong: { g1: "O2", g2: "HCl" } }),
  twoThirds: () => simQ(3, "Make the gases meet at about <b>66.7 cm</b> from the left (within 0.5 cm).", st({ mode: "tube", g1: "O2", g2: "O2" }), s => ok(Math.abs(meet(s) - 66.67) <= 0.5, "The left gas must be twice as fast (e.g. He and CH₄).", said(s)), { g1: "He", g2: "CH4" }, { wrong: { g1: "He", g2: "Ne" } }),
  nearLeft: () => simQ(3, "<b>HCl</b> is on the right. Choose a left gas so they meet <b>closer to the left end</b> (under 50 cm).", st({ mode: "tube", g1: "He", g2: "HCl" }), s => ok(meet(s) < 50, "A heavier gas than HCl on the left travels less far.", said(s)), { g1: "CO2" }, { lock: ["g2"], wrong: { g1: "O2" } })
};
const D = {
  pick: diff => E.diaT("df-pick", diff, 2, () => {
    if (diff === 1) {
      const pool = E.shuffle([["He", 300], ["CO2", 300], ["O2", 600], ["Ne", 150], ["SO2", 600], ["CH4", 300], ["NH3", 450]]).slice(0, 4), want = choice(["fast", "slow"]);
      const v = pool.map(p => speed(p[0], p[1])), best = want === "fast" ? Math.max(...v) : Math.min(...v);
      return { kind: "pick", title: "👆 Fastest or slowest?", prompt: `Click the gas that spreads <b>${want === "fast" ? "fastest" : "slowest"}</b>.`, answer: pool.map((p, i) => v[i] === best ? "g" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((p, i) => ["g" + i, p[0] + " at " + p[1] + " K"])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((p, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="g${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="${p[1] > 400 ? "#fff3e0" : p[1] < 250 ? "#e3f2fd" : "#fff"}" stroke="#cfd8dc" stroke-width="2"/>${Array.from({ length: 10 }, (_, k) => `<circle cx="${x + 40 + (k % 4) * 38}" cy="${70 + Math.floor(k / 4) * 40}" r="9" fill="${GAS[p[0]].c}" stroke="#37474f" stroke-width=".8"/>`).join("")}${T(x + 98, 222, GAS[p[0]].name, { s: 13, c: "#37474f" })}${T(x + 98, 248, GAS[p[0]].M + " g/mol · " + p[1] + " K", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["g" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Speed depends on √(T ÷ M): " + pool.map((p, i) => `${p[0]} ${v[i]} m/s`).join(", ") + ".", summary: "Molecular speed" };
    }
    const pair = choice([["NH3", "HCl"], ["He", "CH4"], ["CH4", "SO2"], ["Ne", "CO2"]]), s = st({ mode: "tube", g1: pair[0], g2: pair[1] }), m = meet(s);
    const marks = E.shuffle([Math.round(m), 100 - Math.round(m), 50, Math.round(m) > 60 ? 80 : 30].filter((x, i, a) => a.indexOf(x) === i)).slice(0, 4);
    return { kind: "pick", title: "👆 Where is the ring?", prompt: `<b>${GAS[pair[0]].name}</b> (${GAS[pair[0]].M}) from the left, <b>${GAS[pair[1]].name}</b> (${GAS[pair[1]].M}) from the right. Click where they meet.`, answer: ["m" + Math.round(m)], names: Object.fromEntries(marks.map(x => ["m" + x, x + " cm"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><rect x="80" y="110" width="700" height="60" rx="30" fill="#e3f2fd" stroke="#78909c" stroke-width="3"/>${T(80, 200, pair[0], { s: 15, c: "#37474f" })}${T(780, 200, pair[1], { s: 15, c: "#37474f" })}${marks.map(x => `<g class="pk" data-k="m${x}"><rect x="${80 + x * 7 - 22}" y="90" width="44" height="100" fill="transparent"/><line x1="${80 + x * 7}" y1="100" x2="${80 + x * 7}" y2="180" stroke="#5c6bc0" stroke-width="3" stroke-dasharray="6 4"/>${T(80 + x * 7, 240, x + " cm", { s: 14, c: "#37474f" })}<rect x="${80 + x * 7 - 22}" y="90" width="44" height="100" rx="10" fill="none" ${E.ring(s2["m" + x])}/></g>`).join("")}</svg>`,
      explain: `The lighter gas goes further: meeting point = ${fmt(m)} cm from the left.`, summary: "Meeting point" };
  }),
  num: diff => E.diaT("df-num", diff, 2, () => {
    if (diff === 2) { const p = choice([["He", "O2"], ["CH4", "SO2"], ["He", "Ne"], ["Ne", "SO2"]]), s = st({ mode: "tube", g1: p[0], g2: p[1] });
      return { kind: "num", title: "🧮 Graham's law", prompt: `${GAS[p[0]].name} (${GAS[p[0]].M}) and ${GAS[p[1]].name} (${GAS[p[1]].M}). How many times faster does ${p[0]} diffuse?`, visual: render(s), fields: [{ label: "rate ratio", unit: "×", answer: ratio(s), tol: 0.02 }], explain: `√(${GAS[p[1]].M} ÷ ${GAS[p[0]].M}) = ${fmt(ratio(s))}.`, summary: "Graham's law" }; }
    const p = choice([["NH3", "HCl"], ["He", "CO2"], ["CH4", "O2"]]), s = st({ mode: "tube", g1: p[0], g2: p[1] });
    return { kind: "num", title: "🧮 Meeting point", prompt: `A 100 cm tube: ${p[0]} (${GAS[p[0]].M}) from the left, ${p[1]} (${GAS[p[1]].M}) from the right. Distance from the left = 100 × rate₁ ÷ (rate₁ + rate₂), with rate ∝ 1/√M.`, visual: render(s), fields: [{ label: "Meeting point", unit: "cm", answer: meet(s), tol: 0.5 }], explain: `1/√${GAS[p[0]].M} ÷ (1/√${GAS[p[0]].M} + 1/√${GAS[p[1]].M}) × 100 = ${fmt(meet(s))} cm.`, summary: "Diffusion tube" };
  }),
  mcq: diff => E.diaT("df-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does the smell of perfume spread across a room?", ok: "Its particles move randomly and spread from high to low concentration", bad: ["The air pushes it in one direction", "Particles are attracted to noses", "It evaporates and then sinks"], ex: "Diffusion: random motion → net spreading." },
      { ask: "In the NH₃ / HCl tube, why does the white ring form nearer the HCl end?", ok: "NH₃ is lighter, so it diffuses faster and travels further", bad: ["HCl is lighter", "The ring is attracted to HCl", "NH₃ is slower"], ex: "17 g/mol vs 36.5 g/mol — ammonia is faster." },
      { ask: "What happens to diffusion when the temperature rises?", ok: "It speeds up because particles move faster", bad: ["It slows down", "It stops", "It doesn't change"], ex: "Speed ∝ √T." },
      { ask: "Graham's law says the rate of diffusion is…", ok: "inversely proportional to the square root of the molar mass", bad: ["proportional to the molar mass", "the same for all gases", "proportional to the square of the mass"], ex: "rate ∝ 1/√M." }]);
    return { kind: "mcq", title: "📘 Diffusion ideas", prompt: "Think about mass, temperature and particle speed.", visual: render(st({ mode: "tube", g1: "NH3", g2: "HCl", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Diffusion" }; })
};
// level-1 numeric task (simple √T scaling)
D.num1 = diff => E.diaT("df-num", diff, 2, () => { const f = choice([4, 0.25, 9, 2.25]), T2 = 300 * f;
  return { kind: "num", title: "🧮 Speed and temperature", prompt: `Speed ∝ √T. A gas moves at <b>500 m/s</b> at 300 K. How fast does it move at <b>${T2} K</b>?`, visual: render(st({ g1: "O2" })), fields: [{ label: "Speed", unit: "m/s", answer: r2(500 * Math.sqrt(f)) }], explain: `500 × √(${T2} ÷ 300) = 500 × ${fmt(Math.sqrt(f))} = ${fmt(r2(500 * Math.sqrt(f)))} m/s.`, summary: "Speed and temperature" }; });
const LEVELS = {
  1: { intro: "Gas particles spread out by diffusion. Lighter and hotter particles move faster.", pool: () => [S(1, 1, C.fast2), S(2, 1, C.slow), S(2, 1, C.o600), S(3, 1, C.heMatch), D.pick(1), D.num1(1), D.mcq(2)] },
  2: { intro: "Graham's law: the lighter gas diffuses faster, by the square root of the mass ratio.", pool: () => [S(1, 1, C.four), S(2, 1, C.twice), S(2, 1, C.near), S(3, 1, C.r15), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Release two gases from opposite ends of a tube and predict where they meet.", pool: () => [S(1, 1, C.nh4cl), S(2, 1, C.nearLeft), S(3, 1, C.middle), S(3, 1, C.twoThirds), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Watch one gas spread, or race two gases along a tube. Change the gas and the temperature, then press ▶.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Release",
  goals: () => [{ txt: "Make a gas spread in under 2 s", test: (s, m) => m.f }, { txt: "Heat a gas up", test: (s, m) => m.h }, { txt: "Race two gases in the tube", test: (s, m) => m.t }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "box" && tMix(s) < 2) m.f = 1; if (s.mode === "box" && s.T > 300) m.h = 1; if (s.mode === "tube") m.t = 1; },
  facts: () => "📘 <b>Diffusion</b> is the net spreading of particles from where there are many to where there are few."
});
E.start({ labId: "diffusion", total: 7, plan: { sim: 4, dia: 3 }, emoji: "💨", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["💨", "🔵", "🔴", "✨"],
  exploreDemo: () => [{ set: { mode: "box", g1: "He", T: 450 }, run: true }, { set: { mode: "tube", g1: "NH3", g2: "HCl" }, run: true }] });
})();
