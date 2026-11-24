"use strict";
// ===== Reaction Rates — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SIZE = { lumps: { f: 1, n: "Large lumps" }, granules: { f: 2, n: "Granules" }, powder: { f: 4, n: "Powder" } };
const r2 = x => Math.round(x * 100) / 100;
const k = s => r2(0.5 * Math.pow(2, (s.T - 20) / 10) * s.conc * SIZE[s.size].f * (s.cat ? 2 : 1));
const fin = s => Math.round(180 / k(s));
const vol = (s, t) => Math.round(60 * (1 - Math.exp(-k(s) * t / 60)) * 10) / 10;
function render(s) {
  const show = s.reveal, K = k(s), tt = s.mode === "time" ? s.t : Math.min(120, fin(s)), V = show ? vol(s, tt) : 0;
  let g = `<rect width="860" height="450" fill="#fff7ef"/>`;
  // flask + syringe
  g += `<path d="M120,150 v40 l-60,110 q-8,20 16,20 h128 q24,0 16,-20 l-60,-110 v-40Z" fill="#fffde7" stroke="#78909c" stroke-width="3"/><path d="M78,268 h124 l16,30 q6,14 -12,14 h-132 q-18,0 -12,-14Z" fill="#e1f5fe"/>
    ${Array.from({ length: s.size === "powder" ? 40 : s.size === "granules" ? 12 : 4 }, (_, i) => { const n = s.size === "powder" ? 40 : s.size === "granules" ? 12 : 4, r = s.size === "powder" ? 2.5 : s.size === "granules" ? 6 : 13; return `<circle cx="${92 + (i * 97 % 96) + (i % n) * 0.5}" cy="${302 - (i * 31 % 14)}" r="${r}" fill="#9e9e9e" stroke="#616161"/>`; }).join("")}
    ${s.cat ? `<g>${Array.from({ length: 6 }, (_, i) => `<circle cx="${100 + i * 16}" cy="296" r="3" fill="#29b6f6"/>`).join("")}</g>` : ""}
    ${show ? Array.from({ length: Math.min(14, Math.round(K * 2)) }, (_, i) => `<circle cx="${96 + (i * 41) % 90}" cy="290" r="3" fill="#fff" stroke="#90a4ae"><animate attributeName="cy" values="300;160" dur="${(1.8 / Math.min(6, Math.max(0.6, K))).toFixed(2)}s" begin="${(i * 0.13).toFixed(2)}s" repeatCount="indefinite"/></circle>`).join("") : ""}
    <path d="M140,150 v-30 h80" stroke="#90a4ae" stroke-width="6" fill="none"/><rect x="220" y="100" width="190" height="40" rx="6" fill="#fff" stroke="#78909c" stroke-width="2"/>
    ${Array.from({ length: 7 }, (_, i) => `<line x1="${230 + i * 28}" y1="100" x2="${230 + i * 28}" y2="${i % 2 ? 108 : 114}" stroke="#455a64"/>${i % 2 === 0 ? T(230 + i * 28, 94, i * 10 + "", { s: 10, c: "#455a64" }) : ""}`).join("")}
    <rect x="${226 + V / 60 * 168}" y="104" width="8" height="32" fill="#546e7a"/><rect x="234" y="${116}" width="${Math.max(0, 166 - V / 60 * 168)}" height="8" fill="#90a4ae" transform="translate(${V / 60 * 168},0)"/>
    ${T(315, 160, "gas syringe: " + fmt(V) + " mL H₂", { s: 13, c: "#37474f" })}${T(160, 350, `zinc (${SIZE[s.size].n.toLowerCase()}) + ${s.conc} M HCl · ${s.T} °C${s.cat ? " · CuSO₄ catalyst" : ""}`, { s: 13, c: "#4e342e" })}`;
  // particles panel
  const hot = Math.min(1, 0.2 * Math.pow(2, (s.T - 20) / 10));
  g += `<g transform="translate(40,370)"><rect width="390" height="70" rx="12" fill="#fff" stroke="#ffcc80" stroke-width="2"/>${T(195, 22, "COLLISIONS", { s: 12, c: "#e65100" })}
    ${T(100, 50, show ? fmt(K * 10) + " per second" : "?", { s: 15, c: "#4e342e" })}${T(290, 50, show ? Math.round(hot * 100) + "% have enough energy" : "", { s: 13, c: "#4e342e" })}</g>`;
  // graph
  const X0 = 490, Y0 = 380, W = 330, H = 290; let d = "", base = "";
  for (let i = 0; i <= 120; i += 2) { d += (i ? "L" : "M") + (X0 + W * i / 120).toFixed(1) + "," + (Y0 - H * vol(s, i) / 60).toFixed(1); base += (i ? "L" : "M") + (X0 + W * i / 120).toFixed(1) + "," + (Y0 - H * vol({ T: 20, conc: 1, size: "granules", cat: false }, i) / 60).toFixed(1); }
  g += `<rect x="460" y="30" width="385" height="410" rx="14" fill="#fff" stroke="#ffcc80" stroke-width="2"/>${T(652, 54, "VOLUME OF HYDROGEN", { s: 13, c: "#e65100" })}
    <line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>
    ${[0, 30, 60].map(v => T(X0 - 6, Y0 - H * v / 60 + 4, v + "", { a: "end", s: 11, c: "#607d8b" })).join("")}${[0, 60, 120].map(v => T(X0 + W * v / 120, Y0 + 18, v + " s", { s: 11, c: "#607d8b" })).join("")}
    <path d="${base}" fill="none" stroke="#bdbdbd" stroke-width="2" stroke-dasharray="6 5"/>${T(X0 + W - 4, Y0 - H * vol({ T: 20, conc: 1, size: "granules", cat: false }, 120) / 60 + 16, "standard", { a: "end", s: 10, c: "#9e9e9e" })}
    ${show ? `<path d="${d}" fill="none" stroke="#ef6c00" stroke-width="3.5"/>${s.mode === "time" ? `<circle cx="${X0 + W * s.t / 120}" cy="${Y0 - H * V / 60}" r="6" fill="#1565c0"/>` : ""}` : T(652, 200, "press ▶ to start", { s: 13, c: "#bdbdbd" })}
    ${T(652, 420, show ? `rate at start ${fmt(K)} mL/s · finished after ≈ ${fin(s)} s` : "", { s: 13, c: "#4e342e" })}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "size", type: "choice", label: "Zinc pieces", options: Object.keys(SIZE).map(v => ({ v, label: SIZE[v].n })), lock: lk("size") },
  { id: "conc", type: "choice", label: "Acid concentration", options: [0.5, 1, 2].map(v => ({ v, label: v + " M" })), lock: lk("conc") },
  { id: "T", type: "range", label: "Temperature", min: 10, max: 60, step: 5, nudge: 5, unit: "°C", lock: lk("T") },
  { id: "cat", type: "toggle", label: "Add CuSO₄ catalyst", hide: () => lv < 3, lock: lk("cat") },
  { id: "t", type: "range", label: "Time", min: 0, max: 120, step: 5, nudge: 5, unit: "s", hide: s => s.mode !== "time", lock: lk("t") }]; };
const st = o => Object.assign({ size: "granules", conc: 1, T: 20, cat: false, t: 30, mode: "rate" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `rate ${fmt(k(s))} mL/s, finished after ≈ ${fin(s)} s`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⏱️ Rate challenge", prompt: "Set the conditions, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Rate = 0.5 × (×2 for every +10 °C) × concentration × (lumps 1, granules 2, powder 4) × (2 with catalyst). More collisions, with more energy, make the reaction faster." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("rr-sim", diff, uses, mk);
const C = {
  powder: () => simQ(1, "Make the reaction <b>as fast as possible</b> by changing only the zinc pieces.", st({ size: "lumps" }), s => ok(s.size === "powder", say(s) + " — more surface area, more collisions.", say(s) + "."), { size: "powder" }, { lock: ["conc", "T"], wrong: { size: "granules" } }),
  warm: () => simQ(1, "Use temperature to make it <b>finish in under 60 s</b> (1 M acid, granules).", st(), s => ok(fin(s) < 60, say(s) + " — particles move faster and collide harder.", say(s) + " — warmer!"), { T: 40 }, { lock: ["conc", "size"], wrong: { T: 30 } }),
  slow: () => simQ(1, "Make the reaction <b>as slow as possible</b>.", st({ T: 40, size: "powder", conc: 2 }), s => ok(s.size === "lumps" && s.conc === 0.5 && s.T === 10, say(s) + ".", say(s) + " — it can be slower."), { size: "lumps", conc: 0.5, T: 10 }, { wrong: { size: "lumps", conc: 0.5, T: 20 } }),
  conc2: () => simQ(1, "<b>Double</b> the rate by changing only the acid concentration.", st(), s => ok(k(s) === 2, "2 M acid: twice as many acid particles to collide with.", say(s) + "."), { conc: 2 }, { lock: ["size", "T"], wrong: { conc: 0.5 } }),
  eight: () => simQ(2, "Make the starting rate exactly <b>8 mL/s</b>.", st(), s => ok(k(s) === 8, say(s) + ".", say(s) + "."), { size: "powder", T: 40 }, { wrong: { size: "powder", T: 30 } }),
  four20: () => simQ(2, "At <b>20 °C</b>, reach exactly <b>4 mL/s</b>.", st(), s => ok(k(s) === 4, "2 M acid with powder: 0.5 × 2 × 4 = 4.", say(s) + "."), { conc: 2, size: "powder" }, { lock: ["T"], wrong: { conc: 1, size: "powder" } }),
  cold: () => simQ(2, "The lab is <b>10 °C</b>. Still reach at least <b>2 mL/s</b>.", st({ T: 10, size: "lumps" }), s => ok(k(s) >= 2, say(s) + " — concentration and surface area make up for the cold.", say(s) + "."), { conc: 2, size: "powder" }, { lock: ["T"], wrong: { conc: 2, size: "granules" } }),
  match: () => simQ(2, "You only have <b>0.5 M</b> acid and <b>powder</b>. Find the temperature that gives <b>2 mL/s</b>.", st({ conc: 0.5, size: "powder" }), s => ok(k(s) === 2, "30 °C: 0.5 × 2 × 0.5 × 4 = 2.", say(s) + "."), { T: 30 }, { lock: ["conc", "size"], wrong: { T: 40 } }),
  half: () => simQ(3, "With the catalyst (1 M, granules, 20 °C), stop the clock when <b>about 30 mL</b> of gas (±1.5) is collected.", st({ mode: "time", cat: true, t: 0 }), s => ok(Math.abs(vol(s, s.t) - 30) <= 1.5, `${s.t} s → ${fmt(vol(s, s.t))} mL.`, `${s.t} s → ${fmt(vol(s, s.t))} mL.`), { t: 20 }, { lock: ["conc", "size", "T", "cat"], wrong: { t: 30 } }),
  cat30: () => simQ(3, "Using the catalyst, make the reaction finish within <b>30 s</b> at the <b>lowest temperature</b> possible.", st({ T: 50, cat: false }), s => ok(s.cat && fin(s) <= 30 && s.T === 20, say(s) + ".", !s.cat ? "Use the catalyst." : fin(s) > 30 ? say(s) + " — too slow." : "Try a lower temperature."), { cat: true, conc: 2, size: "powder", T: 20 }, { wrong: { cat: true, conc: 2, size: "powder", T: 30 } }),
  same: () => simQ(3, "At 20 °C, the catalyst gives the same rate as heating to <b>30 °C</b> without it. Show it: use 1 M granules with the catalyst at 20 °C.", st({ T: 30 }), s => ok(s.cat && s.T === 20 && k(s) === 2, "Both give 2 mL/s — a catalyst lowers the energy needed instead of heating.", say(s) + "."), { cat: true, T: 20 }, { lock: ["conc", "size"], wrong: { cat: false, T: 20 } }),
  at60: () => simQ(3, "Powder, 2 M, 20 °C (no catalyst). How much gas after <b>15 s</b>? Run to 15 s.", st({ mode: "time", size: "powder", conc: 2, t: 0 }), s => ok(s.t === 15, `15 s → ${fmt(vol(s, 15))} mL (fast at first, then slowing down).`, `That is ${s.t} s.`), { t: 15 }, { lock: ["conc", "size", "T", "cat"], wrong: { t: 10 } })
};
const D = {
  pick: diff => E.diaT("rr-pick", diff, 2, () => { const sets = { a: st({ size: "powder", T: 40 }), b: st(), c: st({ size: "lumps", conc: 0.5 }) }, want = choice(["a", "c"]), X0 = 140, W = 600, Y0 = 260, H = 220;
    const line = s => { let d = ""; for (let i = 0; i <= 120; i += 2) d += (i ? "L" : "M") + (X0 + W * i / 120) + "," + (Y0 - H * vol(s, i) / 60); return d; };
    return { kind: "pick", title: "📈 Compare the curves", prompt: want === "a" ? "Click the curve for <b>powder at 40 °C</b> (fastest)." : "Click the curve for <b>large lumps in 0.5 M acid</b> (slowest).", answer: [want], names: { a: "curve A", b: "curve B", c: "curve C" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fff7ef"/><line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>${T(80, 150, "gas", { s: 13, c: "#607d8b" })}${T(440, 290, "time", { s: 12, c: "#607d8b" })}${["a", "b", "c"].map((k, i) => `<g class="pk" data-k="${k}"><path d="${line(sets[k])}" fill="none" stroke="${["#e53935", "#fb8c00", "#1e88e5"][i]}" stroke-width="5"/><path d="${line(sets[k])}" fill="none" stroke="transparent" stroke-width="22"/><path d="${line(sets[k])}" fill="none" ${E.ring(s2[k])}/></g>`).join("")}</svg>`,
      explain: "The steepest curve is the fastest reaction. All curves end at the same volume — the amount of zinc decides the total gas.", summary: "Rate curves" }; }),
  num: diff => E.diaT("rr-num", diff, 2, () => { const c = choice([[60, 30], [45, 15], [24, 8], [50, 25]]);
    return { kind: "num", title: "🧮 Mean rate", prompt: `A reaction made <b>${c[0]} mL</b> of gas in <b>${c[1]} s</b>.`, visual: render(st({ reveal: true })),
      fields: [{ label: "Mean rate", unit: "mL/s", answer: c[0] / c[1] }, { label: "Rate if the temperature rises by 10 °C (doubles)", unit: "mL/s", answer: 2 * c[0] / c[1] }], explain: `${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} mL/s; doubled = ${fmt(2 * c[0] / c[1])} mL/s.`, summary: "Rate calculation" }; }),
  mcq: diff => E.diaT("rr-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does powder react faster than a lump of the same mass?", ok: "It has a larger surface area, so more collisions", bad: ["It is hotter", "It has more mass", "It is a catalyst"], ex: "More particles are exposed to the acid." },
      { ask: "What does a catalyst do?", ok: "Speeds up a reaction without being used up", bad: ["Makes more product", "Is used up in the reaction", "Raises the temperature"], ex: "It provides a route with lower activation energy." },
      { ask: "Why does a higher temperature increase the rate?", ok: "Particles move faster and more collisions have enough energy", bad: ["The acid gets more concentrated", "The zinc gets bigger", "Heat is a catalyst"], ex: "Collision theory: more frequent and more energetic collisions." }]);
    return { kind: "mcq", title: "📘 Collision theory", prompt: "Think about particles colliding.", visual: render(st({ reveal: true, size: "powder" })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Rate concepts" }; })
};
const LEVELS = {
  1: { intro: "Zinc reacts with hydrochloric acid and makes hydrogen gas. Change ONE thing at a time.", pool: () => [S(1, 1, C.powder), S(2, 1, C.conc2), S(2, 1, C.warm), S(3, 1, C.slow), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Combine temperature, concentration and surface area to hit exact rates.", pool: () => [S(1, 1, C.four20), S(2, 1, C.eight), S(2, 1, C.match), S(3, 1, C.cold), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Add a catalyst and follow the gas volume over time.", pool: () => [S(1, 1, C.at60), S(2, 1, C.same), S(3, 1, C.half), S(3, 1, C.cat30), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change the zinc, the acid and the temperature, then press ▶ to measure the hydrogen gas.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Start",
  goals: () => [{ txt: "Make it faster than standard", test: (s, m) => m.f }, { txt: "Make it slower than standard", test: (s, m) => m.sl }, { txt: "Try powder", test: (s, m) => m.p }],
  track: (s, m, ran) => { if (!ran) return; if (k(s) > 1) m.f = 1; if (k(s) < 1) m.sl = 1; if (s.size === "powder") m.p = 1; },
  facts: () => "📘 Reactions happen when particles <b>collide</b> with enough energy. Higher temperature, concentration and surface area — or a <b>catalyst</b> — make the rate faster."
});
E.start({ labId: "rates", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⏱️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⏱️", "⚡", "🔥", "✨"],
  exploreDemo: () => [{ set: { size: "powder" }, run: true }, { set: { size: "lumps", conc: 0.5 }, run: true }] });
})();
