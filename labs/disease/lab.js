"use strict";
// ===== Disease Spread & Vaccines — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
// simple SIR model (fractions of the population), 1 step = 1 day, people are ill for about 4 days
const R0 = s => s.c * (s.wash ? 0.6 : 1);
const Reff = s => Math.round(R0(s) * (1 - s.v / 100) * 100) / 100;
function model(s) {
  const v = s.v / 100, g = 0.25, b = R0(s) * g; let S = Math.max(0, 1 - v - 0.01), I = 0.01, Rr = 0, peak = I; const curve = [I];
  for (let d = 0; d < 80; d++) { const n = b * S * I, r = g * I; S -= n; I += n - r; Rr += r; peak = Math.max(peak, I); curve.push(I); }
  return { total: Math.round((Rr + I) * 100), peak: Math.round(peak * 100), curve };
}
const order = (() => { let x = 7; const a = Array.from({ length: 100 }, (_, i) => i); for (let i = 99; i > 0; i--) { x = (x * 16807) % 2147483647; const j = x % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; })();
function person(x, y, col, shield) { return `<g transform="translate(${x},${y})"><circle cx="0" cy="-7" r="6" fill="${col}" stroke="#455a64" stroke-width="1"/><path d="M-9,12 q0,-12 9,-12 q9,0 9,12Z" fill="${col}" stroke="#455a64" stroke-width="1"/>${shield ? `<path d="M6,-16 l6,2 v5 q0,6 -6,8 q-6,-2 -6,-8 v-5Z" fill="#1e88e5" stroke="#fff" stroke-width="1"/>` : ""}</g>`; }
function render(s) {
  const m = model(s), show = s.reveal, nv = Math.round(s.v), ni = show ? m.total : 1;
  let g = `<rect width="860" height="450" fill="#f2f7fd"/><rect x="20" y="20" width="400" height="410" rx="16" fill="#fff" stroke="#bbdefb" stroke-width="2"/>`;
  const vacc = new Set(order.slice(0, nv)), rest = order.slice(nv), sick = new Set(rest.slice(0, ni));
  for (let i = 0; i < 100; i++) { const x = 55 + (i % 10) * 37, y = 58 + Math.floor(i / 10) * 37; g += person(x, y, vacc.has(i) ? "#bbdefb" : sick.has(i) ? (show ? "#ef5350" : "#ef5350") : "#c8e6c9", vacc.has(i)); }
  g += `<g font-family="Nunito,sans-serif">${T(90, 418, "🟦 vaccinated", { s: 12, c: "#1565c0" })}${T(220, 418, "🟥 got ill", { s: 12, c: "#c62828" })}${T(340, 418, "🟩 never ill", { s: 12, c: "#2e7d32" })}</g>`;
  // epidemic curve
  const X0 = 470, Y0 = 250, W = 350, H = 170; let d = ""; m.curve.forEach((v, i) => { d += (i ? "L" : "M") + (X0 + W * i / 80).toFixed(1) + "," + (Y0 - H * Math.min(1, v / 0.5)).toFixed(1); });
  g += `<rect x="440" y="20" width="400" height="410" rx="16" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(640, 46, "PEOPLE ILL EACH DAY", { s: 13, c: "#0d47a1" })}
    <line x1="${X0}" y1="${Y0}" x2="${X0 + W}" y2="${Y0}" stroke="#607d8b"/><line x1="${X0}" y1="${Y0}" x2="${X0}" y2="${Y0 - H}" stroke="#607d8b"/>${T(X0 - 6, Y0 - H + 4, "50%", { a: "end", s: 11, c: "#607d8b" })}${[0, 40, 80].map(v => T(X0 + W * v / 80, Y0 + 18, "day " + v, { s: 11, c: "#607d8b" })).join("")}
    ${show ? `<path d="${d}" fill="none" stroke="#e53935" stroke-width="3"/>` : T(640, 170, "press ▶ to start the outbreak", { s: 14, c: "#90a4ae" })}
    ${T(560, 302, "R (spread number)", { s: 12, c: "#455a64" })}${T(560, 334, show ? fmt(Reff(s)) : "?", { s: 26, c: Reff(s) < 1 ? "#2e7d32" : "#c62828" })}
    ${T(730, 302, "total ever ill", { s: 12, c: "#455a64" })}${T(730, 334, show ? m.total + "%" : "?", { s: 26, c: m.total < 20 ? "#2e7d32" : "#c62828" })}
    ${T(560, 372, "most ill at once", { s: 12, c: "#455a64" })}${T(560, 400, show ? m.peak + "%" : "?", { s: 20, c: "#37474f" })}
    ${T(730, 372, "each ill person meets", { s: 12, c: "#455a64" })}${T(730, 400, s.c + " people" + (s.wash ? " · 🧼" : ""), { s: 18, c: "#37474f" })}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "v", type: "range", label: "Vaccinated", min: 0, max: 100, step: 10, nudge: 10, unit: "%", lock: lk("v") },
  { id: "c", type: "range", label: "Contacts per ill person", min: 1, max: 6, step: 1, nudge: 1, unit: "", hide: () => lv < 2, lock: lk("c") },
  { id: "wash", type: "toggle", label: "🧼 Hand washing & masks", hide: () => lv < 2, lock: lk("wash") }]; };
const st = o => Object.assign({ v: 0, c: 3, wash: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => { const m = model(s); return `${s.v}% vaccinated, R = ${fmt(Reff(s))}: ${m.total}% got ill`; };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🦠 Outbreak challenge", prompt: "Set the town's protection, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "R = how many people each ill person infects. R = contacts × (0.6 with hand washing) × (fraction NOT vaccinated). If R is below 1, the outbreak dies out." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ds-sim", diff, uses, mk);
const C = {
  none: () => simQ(1, "Show what happens with <b>no vaccine</b>: more than 80% of the town gets ill.", st({ v: 50 }), s => ok(model(s).total > 80, say(s) + ".", say(s) + "."), { v: 0 }, { wrong: { v: 30 } }),
  under20: () => simQ(1, "Keep the total number of people who get ill <b>under 20%</b>.", st(), s => ok(model(s).total < 20, say(s) + ".", say(s) + " — vaccinate more."), { v: 70 }, { wrong: { v: 40 } }),
  herd: () => simQ(1, "Find the <b>lowest</b> vaccination that makes R <b>less than 1</b> (herd immunity).", st(), s => ok(Reff(s) < 1 && s.v === 70, say(s) + " — the virus cannot spread.", Reff(s) >= 1 ? say(s) + " — R is still 1 or more." : "You can vaccinate fewer people."), { v: 70 }, { wrong: { v: 60 } }),
  half: () => simQ(1, "Get the outbreak down to between <b>20% and 50%</b> of the town.", st(), s => ok(model(s).total >= 20 && model(s).total <= 50, say(s) + ".", say(s) + "."), { v: 50 }, { wrong: { v: 70 } }),
  washOnly: () => simQ(2, "There is <b>no vaccine</b>. Use hand washing and fewer contacts to keep illness <b>under 40%</b>.", st({ c: 4 }), s => ok(s.v === 0 && model(s).total < 40, say(s) + ".", say(s) + "."), { wash: true, c: 2 }, { lock: ["v"], wrong: { wash: true, c: 3 } }),
  stopNoVax: () => simQ(2, "Stop the outbreak completely (<b>under 5%</b>) <b>without vaccines</b>.", st({ c: 4 }), s => ok(s.v === 0 && model(s).total < 5, say(s) + " — R below 1.", say(s) + "."), { wash: true, c: 1 }, { lock: ["v"], wrong: { wash: false, c: 2 } }),
  washHelp: () => simQ(2, "Each ill person meets <b>3 people</b>. Turn on hand washing and find the <b>lowest vaccination</b> for R below 1.", st({ c: 3 }), s => ok(s.wash && Reff(s) < 1 && s.v === 50, say(s) + ": 3 × 0.6 × 0.5 = 0.9.", !s.wash ? "Turn on hand washing." : Reff(s) >= 1 ? "R is still 1 or more." : "You can vaccinate fewer."), { wash: true, v: 50 }, { lock: ["c"], wrong: { wash: true, v: 40 } }),
  peak: () => simQ(2, "Keep the most people ill <b>at one time</b> under <b>10%</b> (so hospitals cope), with no more than 30% vaccinated.", st({ c: 4 }), s => ok(model(s).peak < 10 && s.v <= 30, `Peak ${model(s).peak}%.`, s.v > 30 ? "Use at most 30% vaccination." : `Peak ${model(s).peak}%.`), { v: 30, wash: true, c: 2 }, { wrong: { v: 30, wash: false, c: 3 } }),
  r4: () => simQ(3, "A disease with <b>4 contacts</b> (R₀ = 4). Find the lowest vaccination for herd immunity.", st({ c: 4 }), s => ok(Reff(s) < 1 && s.v === 80, "Need more than 1 − 1/4 = 75% → 80%.", Reff(s) >= 1 ? say(s) + "." : "You can vaccinate fewer."), { v: 80 }, { lock: ["c", "wash"], wrong: { v: 70 } }),
  measles: () => simQ(3, "<b>Measles-like</b>: 6 contacts. Find the lowest vaccination for herd immunity.", st({ c: 6 }), s => ok(Reff(s) < 1 && s.v === 90, "Need more than 1 − 1/6 ≈ 83% → 90%.", Reff(s) >= 1 ? say(s) + "." : "You can vaccinate fewer."), { v: 90 }, { lock: ["c", "wash"], wrong: { v: 80 } }),
  combo: () => simQ(3, "<b>4 contacts with hand washing</b>. Find the lowest vaccination for herd immunity.", st({ c: 4, wash: true }), s => ok(Reff(s) < 1 && s.v === 60, "4 × 0.6 = 2.4; need > 1 − 1/2.4 ≈ 58% → 60%.", Reff(s) >= 1 ? say(s) + "." : "You can vaccinate fewer."), { v: 60 }, { lock: ["c", "wash"], wrong: { v: 50 } }),
  r1: () => simQ(3, "Make R exactly <b>1.2</b> using 50% vaccination.", st({ v: 50, c: 6 }), s => ok(Reff(s) === 1.2 && s.v === 50, "4 contacts × 0.6 × 0.5 = 1.2.", `R = ${fmt(Reff(s))}.`), { c: 4, wash: true }, { lock: ["v"], wrong: { c: 4, wash: false } })
};
const D = {
  pick: diff => E.diaT("ds-pick", diff, 2, () => { const sets = { a: st({ v: 0 }), b: st({ v: 50 }), c: st({ v: 80 }) }, want = choice(["a", "c"]);
    const mini = (s, x) => { const m = model(s); let d = ""; m.curve.forEach((v, i) => { d += (i ? "L" : "M") + (x + 230 * i / 80).toFixed(1) + "," + (230 - 170 * Math.min(1, v / 0.5)).toFixed(1); }); return d; };
    const q = { a: "Click the graph for the town with <b>no vaccination</b>.", c: "Click the graph for the town with <b>herd immunity</b>." }[want];
    return { kind: "pick", title: "📈 Read the outbreak graphs", prompt: q, answer: [want], names: { a: "0% vaccinated", b: "50% vaccinated", c: "80% vaccinated" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f7fd"/>${["b", "a", "c"].map((k, i) => { const x = 30 + i * 280; return `<g class="pk" data-k="${k}"><rect x="${x - 10}" y="20" width="260" height="260" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/><rect x="${x - 10}" y="20" width="260" height="260" rx="14" fill="none" ${E.ring(s2[k])}/><line x1="${x}" y1="230" x2="${x + 230}" y2="230" stroke="#90a4ae"/><line x1="${x}" y1="230" x2="${x}" y2="50" stroke="#90a4ae"/><path d="${mini(sets[k], x)}" fill="none" stroke="#e53935" stroke-width="3"/>${T(x + 115, 262, "town " + "ABC"[i], { s: 14, c: "#37474f" })}</g>`; }).join("")}</svg>`,
      explain: "No vaccination → a tall, early peak. 50% → a smaller, later peak. 80% → R below 1, the line stays flat.", summary: "Outbreak graphs" }; }),
  num: diff => E.diaT("ds-num", diff, 2, () => { const c = choice([[5, 40], [3, 50], [2, 25], [10, 80]]);
    return { kind: "num", title: "🧮 Spread number R", prompt: `Each ill person meets <b>${c[0]}</b> people who are not protected, and <b>${c[1]}%</b> of the town is vaccinated.`, visual: render(st({ c: Math.min(6, c[0]), v: c[1] })),
      fields: [{ label: "R after vaccination", unit: "", answer: c[0] * (1 - c[1] / 100), tol: 0.03 }, { label: "Minimum % vaccinated for R < 1", unit: "%", answer: Math.round((1 - 1 / c[0]) * 1000) / 10, tol: 0.03 }], explain: `R = ${c[0]} × ${1 - c[1] / 100} = ${fmt(c[0] * (1 - c[1] / 100))}. Herd immunity needs more than 1 − 1/${c[0]} = ${fmt((1 - 1 / c[0]) * 100)}%.`, summary: "Herd immunity calculation" }; }),
  mcq: diff => E.diaT("ds-mcq", diff, 2, () => { const q = choice([
      { ask: "How does a vaccine protect a person?", ok: "It trains the immune system to make antibodies before infection", bad: ["It kills all bacteria in the body", "It is an antibiotic", "It stops the person meeting others"], ex: "Vaccines contain harmless parts of a pathogen so memory cells are ready." },
      { ask: "What is herd immunity?", ok: "Enough people are immune that the disease cannot spread, protecting the others", bad: ["Only animals are vaccinated", "Everyone has already been ill", "The virus becomes harmless"], ex: "When R falls below 1, outbreaks die out." },
      { ask: "Why does hand washing slow down an outbreak?", ok: "Fewer pathogens are passed on at each contact", bad: ["It makes people immune", "It kills the virus inside the body", "It increases R"], ex: "Hygiene lowers the chance of transmission." }]);
    return { kind: "mcq", title: "📘 Disease ideas", prompt: "Think about how diseases spread.", visual: render(st({ v: 70, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Disease and vaccine concepts" }; })
};
const LEVELS = {
  1: { intro: "An infection arrives in a town of 100 people. Use vaccination to protect them.", pool: () => [S(1, 1, C.none), S(2, 1, C.half), S(2, 1, C.under20), S(3, 1, C.herd), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Hand washing, masks and fewer contacts also slow the spread. Combine them!", pool: () => [S(1, 1, C.washOnly), S(2, 1, C.stopNoVax), S(2, 1, C.washHelp), S(3, 1, C.peak), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Different diseases spread at different speeds (R₀). Plan the vaccination for herd immunity.", pool: () => [S(1, 1, C.r4), S(2, 1, C.combo), S(3, 1, C.measles), S(3, 1, C.r1), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change how many people are vaccinated and press ▶ to see how the infection spreads.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Start outbreak",
  goals: () => [{ txt: "See a big outbreak", test: (s, m) => m.big }, { txt: "See a small outbreak", test: (s, m) => m.small }, { txt: "Get R below 1", test: (s, m) => m.r }],
  track: (s, m, ran) => { if (!ran) return; const t = model(s).total; if (t > 80) m.big = 1; if (t < 20) m.small = 1; if (Reff(s) < 1) m.r = 1; },
  facts: () => "📘 <b>R</b> is how many people one ill person infects. Vaccines make people <b>immune</b>; when enough are immune, R falls below 1 and the disease stops spreading — <b>herd immunity</b>."
});
E.start({ labId: "disease", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🦠", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["💉", "🛡️", "🧼", "✨"],
  exploreDemo: () => [{ set: { v: 0 }, run: true }, { set: { v: 80 }, run: true }] });
})();
