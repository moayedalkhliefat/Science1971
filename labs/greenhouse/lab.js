"use strict";
// ===== Greenhouse Effect — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r1 = x => Math.round(x * 10) / 10;
const SIG = 5.67e-8, S0 = 1361;
const GAS = { none: { name: "No greenhouse gases", e: 0 }, low: { name: "Very little", e: 0.6 }, pre: { name: "Pre-industrial (1750)", e: 0.75 }, today: { name: "Today", e: 0.78 }, dbl: { name: "Doubled CO₂", e: 0.82 }, high: { name: "Very high", e: 0.9 } };
const ALB = { 0.6: "Ice-covered (0.6)", 0.4: "Very cloudy (0.4)", 0.3: "Today's Earth (0.3)", 0.1: "Dark oceans (0.1)" };
const Te = s => Math.pow(S0 * s.sun * (1 - s.alb) / (4 * SIG), 0.25);
const Ts = s => Te(s) * Math.pow(2 / (2 - GAS[s.gas].e), 0.25);
const TC = s => r1(Ts(s) - 273.15);
const inW = s => Math.round(S0 * s.sun / 4), refl = s => Math.round(S0 * s.sun / 4 * s.alb), absd = s => inW(s) - refl(s), emit = s => Math.round(SIG * Math.pow(Ts(s), 4));
function render(s) {
  const show = s.reveal, e = GAS[s.gas].e, t = TC(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#0d1b3e"/>`;
  // sun
  g += `<circle cx="70" cy="64" r="30" fill="#ffd54f"/><circle cx="70" cy="64" r="40" fill="#ffd54f" opacity=".25"/>`;
  // atmosphere band with gas molecules
  g += `<rect x="22" y="150" width="556" height="120" fill="#90caf9" opacity="${0.08 + e * 0.25}"/>${T(560, 168, "atmosphere", { a: "end", s: 11, c: "#bbdefb" })}`;
  const nm = Math.round(e * 22); for (let i = 0; i < nm; i++) { const x = 40 + (i * 97) % 520, y = 166 + (i * 41) % 90; g += `<circle cx="${x}" cy="${y}" r="5" fill="#455a64"/><circle cx="${x - 7}" cy="${y}" r="4" fill="#e53935"/><circle cx="${x + 7}" cy="${y}" r="4" fill="#e53935"/>`; }
  // ground
  const gc = s.alb >= 0.6 ? "#eceff1" : s.alb >= 0.4 ? "#b0bec5" : s.alb >= 0.3 ? "#66bb6a" : "#1565c0";
  g += `<path d="M22,350 Q300,320 578,350 L578,428 L22,428Z" fill="${gc}"/>${s.alb >= 0.4 && s.alb < 0.6 ? `<ellipse cx="200" cy="140" rx="70" ry="18" fill="#eceff1" opacity=".8"/><ellipse cx="420" cy="132" rx="80" ry="20" fill="#eceff1" opacity=".8"/>` : ""}`;
  // sunlight arrows
  for (let i = 0; i < 4; i++) { const x = 120 + i * 60; g += `<line x1="${x - 30}" y1="90" x2="${x + 40}" y2="330" stroke="#ffeb3b" stroke-width="4"/><path d="M${x + 44},338 l-2,-15 l-10,6Z" fill="#ffeb3b"/>`; }
  if (show) {
    const nr = Math.round(s.alb * 6); for (let i = 0; i < nr; i++) { const x = 140 + i * 30; g += `<line x1="${x}" y1="332" x2="${x + 50}" y2="${120}" stroke="#fff59d" stroke-width="2.5" stroke-dasharray="6 4"/>`; }
    const nIR = 6; for (let i = 0; i < nIR; i++) { const x = 340 + i * 36, absorbed = i < Math.round(e * nIR); let d = `M${x},335`; const top = absorbed ? 210 : 40; for (let y = 335; y > top; y -= 12) d += ` q8,-6 0,-12`; g += `<path d="${d}" fill="none" stroke="#ff7043" stroke-width="3"/>`; if (absorbed) { let d2 = `M${x + 14},214`; for (let y = 214; y < 330; y += 12) d2 += ` q-8,6 0,12`; g += `<path d="${d2}" fill="none" stroke="#ff8a65" stroke-width="2" opacity=".85"/>`; } else g += `<path d="M${x},36 l-6,10 h12Z" fill="#ff7043"/>`; }
    g += T(150, 300, "sunlight in", { s: 11, c: "#fff59d" }) + T(430, 300, "infrared out", { s: 11, c: "#ffab91" });
  } else g += T(380, 120, "press ▶ to let the planet warm up", { s: 13, c: "#bbdefb" });
  // thermometer
  const tf = Math.max(0, Math.min(1, ((show ? t : -40) + 40) / 80));
  g += `<rect x="530" y="200" width="20" height="120" rx="10" fill="#fff"/><rect x="534" y="${204 + 112 * (1 - tf)}" width="12" height="${112 * tf}" rx="6" fill="#e53935"/><circle cx="540" cy="330" r="14" fill="#e53935"/>${T(540, 194, show ? t + " °C" : "? °C", { s: 13, c: "#fff" })}`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 56, GAS[s.gas].name, { s: 12, c: "#37474f" })}${T(120, 74, "albedo " + s.alb + " · sun " + Math.round(s.sun * 100) + "%", { s: 11, c: "#78909c" })}
    ${show ? T(120, 112, "surface temperature", { s: 12, c: "#78909c" }) + T(120, 144, t + " °C", { s: 26, c: t < 0 ? "#1565c0" : t > 25 ? "#c62828" : "#2e7d32" }) + T(120, 164, t < 0 ? "frozen planet ❄️" : t > 25 ? "very hot 🔥" : "liquid water 💧", { s: 12, c: "#546e7a" })
      + T(120, 202, "sunlight arriving: " + inW(s) + " W/m²", { s: 12, c: "#37474f" }) + T(120, 222, "reflected: " + refl(s) + " W/m²", { s: 12, c: "#37474f" }) + T(120, 242, "absorbed: " + absd(s) + " W/m²", { s: 12, c: "#37474f" }) + T(120, 262, "surface gives out: " + emit(s) + " W/m²", { s: 12, c: "#37474f" }) : T(120, 170, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 320, "greenhouse gases absorb infrared", { s: 10, c: "#90a4ae" })}${T(120, 336, "and send some back down", { s: 10, c: "#90a4ae" })}${T(120, 360, "albedo = fraction of sunlight reflected", { s: 10, c: "#90a4ae" })}${T(120, 380, "without gases Earth would be −18 °C", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "gas", type: "select", label: "Greenhouse gases", options: Object.keys(GAS).map(v => ({ v, label: GAS[v].name })), lock: lk("gas") },
  { id: "alb", type: "choice", label: "Surface / albedo", options: [0.6, 0.4, 0.3, 0.1].map(v => ({ v, label: ALB[v] })), hide: () => lv < 2 && !explore, lock: lk("alb") },
  { id: "sun", type: "choice", label: "Sunlight", options: [0.9, 1, 1.1].map(v => ({ v, label: Math.round(v * 100) + "%" })), hide: () => lv < 3 && !explore, lock: lk("sun") }]; };
const st = o => Object.assign({ gas: "today", alb: 0.3, sun: 1 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `Surface temperature ${TC(s)} °C.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🌍 Climate challenge", prompt: "Set up the planet, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Greenhouse gases let sunlight in but absorb outgoing infrared and send some back, warming the surface. A higher albedo (ice, clouds) reflects more sunlight and cools the planet. On average 340 W/m² of sunlight arrives; reflected = albedo × 340." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("gh-sim", diff, uses, mk);
const C = {
  freeze: () => simQ(1, "What if Earth had <b>no greenhouse effect</b>? Make the surface freeze (below 0 °C) using the gases.", st({ gas: "today" }), s => ok(TC(s) < 0, `${TC(s)} °C — without greenhouse gases Earth would be frozen.`, said(s)), { gas: "none" }, { wrong: { gas: "low" } }),
  today: () => simQ(1, "Give Earth its comfortable average of about <b>15 °C</b> (between 14 and 17).", st({ gas: "none" }), s => ok(TC(s) >= 14 && TC(s) <= 17, `${TC(s)} °C — just right for liquid water.`, said(s)), { gas: "today" }, { wrong: { gas: "high" } }),
  hot20: () => simQ(1, "Use greenhouse gases to make the surface <b>warmer than 20 °C</b>.", st({ gas: "pre" }), s => ok(TC(s) > 20, `${TC(s)} °C — more gas traps more heat.`, said(s)), { gas: "high" }, { wrong: { gas: "dbl" } }),
  cold0: () => simQ(1, "Find the gas level that gives the <b>coldest</b> planet that is still <b>above 0 °C</b>.", st({ gas: "today" }), s => ok(s.gas === "low", "Very little gas: about 5.6 °C.", TC(s) <= 0 ? "Frozen!" : `${TC(s)} °C — a lower gas level is still above 0 °C.`), { gas: "low" }, { wrong: { gas: "pre" } }),
  snowball: () => simQ(2, "Snowball Earth: keep <b>today's gases</b> but make the planet <b>freeze</b> by changing its surface.", st({ alb: 0.3 }), s => ok(TC(s) < 0, `Ice (albedo 0.6) reflects so much sunlight: ${TC(s)} °C.`, said(s)), { alb: 0.6 }, { lock: ["gas"], wrong: { alb: 0.4 } }),
  dark: () => simQ(2, "Melting ice uncovers dark ocean. With today's gases, choose the surface that makes the planet <b>warmest</b>.", st({ alb: 0.3 }), s => ok(s.alb === 0.1, `Dark oceans absorb most sunlight: ${TC(s)} °C.`, `${TC(s)} °C — a darker surface would be warmer.`), { alb: 0.1 }, { lock: ["gas"], wrong: { alb: 0.3 } }),
  cloudy: () => simQ(2, "A <b>very cloudy</b> planet (albedo 0.4). Choose the gas level that keeps it <b>above 10 °C</b>.", st({ alb: 0.4, gas: "today" }), s => ok(TC(s) > 10, `${TC(s)} °C.`, said(s)), { gas: "high" }, { lock: ["alb"], wrong: { gas: "dbl" } }),
  feedback: () => simQ(2, "Today's Earth is about 15 °C. Change only the <b>surface</b> to make it <b>colder</b> but still <b>above 0 °C</b>.", st({ alb: 0.3 }), s => ok(TC(s) < 14.9 && TC(s) > 0, `${TC(s)} °C — clouds reflect more sunlight.`, TC(s) <= 0 ? "Frozen — too cold." : said(s)), { alb: 0.4 }, { lock: ["gas"], wrong: { alb: 0.1 } }),
  r136: () => simQ(3, "Make the planet <b>reflect 136 W/m²</b> of sunlight (normal sunlight).", st({ alb: 0.3, sun: 1 }), s => ok(refl(s) === 136, "0.4 × 340 = 136 W/m².", `Reflected: ${refl(s)} W/m².`), { alb: 0.4 }, { lock: ["gas", "sun"], wrong: { alb: 0.6 } }),
  a306: () => simQ(3, "Make the surface <b>absorb 306 W/m²</b> of sunlight (normal sunlight).", st({ alb: 0.3, sun: 1 }), s => ok(absd(s) === 306, "Albedo 0.1: 0.9 × 340 = 306 W/m².", `Absorbed: ${absd(s)} W/m².`), { alb: 0.1 }, { lock: ["gas", "sun"], wrong: { alb: 0.3 } }),
  e390: () => simQ(3, "Today the surface gives out about <b>390 W/m²</b> of infrared. Choose the gases so it is within 5 W/m² of that (normal sun, albedo 0.3).", st({ gas: "none" }), s => ok(Math.abs(emit(s) - 390) <= 5, `${emit(s)} W/m².`, `${emit(s)} W/m².`), { gas: "today" }, { lock: ["alb", "sun"], wrong: { gas: "pre" } }),
  hottest: () => simQ(3, "Make the <b>hottest</b> planet possible (like Venus).", st({ gas: "today", alb: 0.3, sun: 1 }), s => ok(s.gas === "high" && s.alb === 0.1 && s.sun === 1.1, `${TC(s)} °C — a runaway greenhouse.`, `${TC(s)} °C — it can be hotter.`), { gas: "high", alb: 0.1, sun: 1.1 }, { wrong: { gas: "high", alb: 0.1, sun: 1 } })
};
const D = {
  pick: diff => E.diaT("gh-pick", diff, 2, () => {
    const pool = E.shuffle(diff === 1 ? [st({ gas: "none" }), st({ gas: "low" }), st({ gas: "today" }), st({ gas: "high" }), st({ gas: "pre" })] : [st({ alb: 0.6 }), st({ alb: 0.4 }), st({ alb: 0.3 }), st({ alb: 0.1 }), st({ alb: 0.6, gas: "high" }), st({ alb: 0.1, gas: "low" })]).slice(0, 4);
    const want = choice(["warm", "cold"]), vals = pool.map(TC), best = want === "warm" ? Math.max(...vals) : Math.min(...vals);
    return { kind: "pick", title: "👆 Warmest or coldest?", prompt: `Click the planet with the <b>${want === "warm" ? "warmest" : "coldest"}</b> surface.`, answer: pool.map((s, i) => TC(s) === best ? "p" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["p" + i, GAS[s.gas].name + ", " + ALB[s.alb]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212, e = GAS[s.gas].e, gc = s.alb >= 0.6 ? "#eceff1" : s.alb >= 0.4 ? "#b0bec5" : s.alb >= 0.3 ? "#66bb6a" : "#1565c0"; return `<g class="pk" data-k="p${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#0d1b3e"/><circle cx="${x + 98}" cy="130" r="70" fill="#90caf9" opacity="${0.08 + e * 0.4}"/><circle cx="${x + 98}" cy="130" r="52" fill="${gc}" stroke="#263238" stroke-width="2"/>${Array.from({ length: Math.round(e * 10) }, (_, k) => `<circle cx="${x + 98 + 62 * Math.cos(k * 0.63)}" cy="${130 + 62 * Math.sin(k * 0.63)}" r="4" fill="#e53935"/>`).join("")}${T(x + 98, 232, GAS[s.gas].name, { s: 12, c: "#fff" })}${T(x + 98, 254, "albedo " + s.alb, { s: 12, c: "#bbdefb" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["p" + i])}/></g>`; }).join("")}</svg>`,
      explain: "More greenhouse gas → warmer; higher albedo → colder. " + pool.map(s => TC(s) + " °C").join(", ") + ".", summary: "Comparing planets" };
  }),
  num: diff => E.diaT("gh-num", diff, 2, () => {
    if (diff === 1) { const k = choice([288, 255, 300, 273]);
      return { kind: "num", title: "🧮 Kelvin to Celsius", prompt: `A planet's surface is <b>${k} K</b>. °C = K − 273.`, visual: render(st({ reveal: true })), fields: [{ label: "Temperature", unit: "°C", answer: k - 273 }], explain: `${k} − 273 = ${k - 273} °C.`, summary: "Temperature scales" }; }
    if (diff === 2) { const a = choice([0.3, 0.6, 0.1, 0.4]);
      return { kind: "num", title: "🧮 Reflected sunlight", prompt: `On average <b>340 W/m²</b> of sunlight reaches the planet. Its albedo is <b>${a}</b>.`, visual: render(st({ alb: a })), fields: [{ label: "Reflected", unit: "W/m²", answer: Math.round(340 * a) }, { label: "Absorbed", unit: "W/m²", answer: Math.round(340 * (1 - a)) }], explain: `${a} × 340 = ${Math.round(340 * a)}; 340 − ${Math.round(340 * a)} = ${Math.round(340 * (1 - a))} W/m².`, summary: "Albedo" }; }
    const t = choice([255, 288, 300]);
    return { kind: "num", title: "🧮 Infrared given out", prompt: `A surface at <b>${t} K</b> gives out P = σT⁴ watts per m², with σ = 5.67 × 10⁻⁸.`, visual: render(st({ reveal: true })), fields: [{ label: "P", unit: "W/m²", answer: Math.round(SIG * Math.pow(t, 4)), tol: 3 }], explain: `5.67×10⁻⁸ × ${t}⁴ = ${Math.round(SIG * Math.pow(t, 4))} W/m².`, summary: "Stefan–Boltzmann" };
  }),
  mcq: diff => E.diaT("gh-mcq", diff, 2, () => { const q = choice([
      { ask: "How do greenhouse gases warm the Earth?", ok: "They absorb infrared given off by the surface and send some back down", bad: ["They block sunlight from reaching the ground", "They make the Sun hotter", "They reflect sunlight back into space"], ex: "Sunlight gets in, but some outgoing heat is trapped." },
      { ask: "Why does melting sea ice speed up warming?", ok: "Dark ocean absorbs more sunlight than white ice (lower albedo)", bad: ["Ice is a greenhouse gas", "Water reflects more than ice", "Melting releases heat"], ex: "This is a positive feedback." },
      { ask: "Which of these is a greenhouse gas?", ok: "Carbon dioxide", bad: ["Nitrogen", "Oxygen", "Argon"], ex: "CO₂, water vapour and methane absorb infrared." },
      { ask: "Without any greenhouse effect, Earth's average surface temperature would be about…", ok: "−18 °C", bad: ["+15 °C", "+50 °C", "−100 °C"], ex: "The natural greenhouse effect keeps us about 33 °C warmer." }]);
    return { kind: "mcq", title: "📘 Climate ideas", prompt: "Think about sunlight, infrared and albedo.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Greenhouse effect" }; })
};
const LEVELS = {
  1: { intro: "Sunlight warms the ground; the ground gives off infrared. Greenhouse gases trap some of it and keep the planet warm.", pool: () => [S(1, 1, C.freeze), S(2, 1, C.today), S(2, 1, C.hot20), S(3, 1, C.cold0), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Albedo: white ice and clouds reflect sunlight; dark ocean absorbs it.", pool: () => [S(1, 1, C.dark), S(2, 1, C.snowball), S(2, 1, C.feedback), S(3, 1, C.cloudy), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Follow the energy: sunlight in, reflected, absorbed, and infrared out (in W/m²).", pool: () => [S(1, 1, C.r136), S(2, 1, C.a306), S(3, 1, C.e390), S(3, 1, C.hottest), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Change the greenhouse gases, the surface and the sunlight. Press ▶ to see the planet's temperature.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Warm up",
  goals: () => [{ txt: "Freeze the planet", test: (s, m) => m.f }, { txt: "Make it about today's 15 °C", test: (s, m) => m.t }, { txt: "Make it hotter than 25 °C", test: (s, m) => m.h }],
  track: (s, m, ran) => { if (!ran) return; if (TC(s) < 0) m.f = 1; if (TC(s) >= 14 && TC(s) <= 17) m.t = 1; if (TC(s) > 25) m.h = 1; },
  facts: () => "📘 The <b>greenhouse effect</b> keeps Earth about 33 °C warmer than it would be — adding more gas makes it warmer still."
});
E.start({ labId: "greenhouse", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌍", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["☀️", "🌍", "🌳", "✨"],
  exploreDemo: () => [{ set: { gas: "none", alb: 0.3, sun: 1 }, run: true }, { set: { gas: "today" }, run: true }, { set: { gas: "high", alb: 0.1 }, run: true }] });
})();
