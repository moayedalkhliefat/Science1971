"use strict";
// ===== Eating & Exercise (energy balance) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const KJ = { c: 17, p: 17, f: 37 }; // kJ per gram of carbohydrate, protein, fat
const FOOD = {
  sandwich: { n: "Sandwich", i: "🥪", c: 40, p: 15, f: 10 }, rice: { n: "Rice & chicken", i: "🍛", c: 80, p: 35, f: 15 }, apple: { n: "Apple", i: "🍎", c: 18, p: 0, f: 0 },
  yogurt: { n: "Yogurt", i: "🥛", c: 15, p: 8, f: 4 }, milk: { n: "Glass of milk", i: "🥛", c: 12, p: 8, f: 8 }, pasta: { n: "Pasta plate", i: "🍝", c: 75, p: 15, f: 10 },
  burger: { n: "Burger", i: "🍔", c: 40, p: 25, f: 30 }, fries: { n: "Fries", i: "🍟", c: 45, p: 4, f: 20 }, banana: { n: "Banana", i: "🍌", c: 23, p: 1, f: 0 }, nuts: { n: "Handful of nuts", i: "🥜", c: 6, p: 6, f: 15 }
};
Object.values(FOOD).forEach(f => f.kj = f.c * KJ.c + f.p * KJ.p + f.f * KJ.f);
const ACT = { football: { n: "Football", i: "⚽", r: 40 }, cycling: { n: "Cycling", i: "🚲", r: 30 }, walking: { n: "Walking", i: "🚶", r: 15 } };
const BASE = 6000; // energy for the body at rest in one day (kJ)
const MENU = { 1: ["sandwich", "rice", "apple", "yogurt", "milk"], 3: ["pasta", "burger", "fries", "banana", "nuts"] };
const eIn = s => (s.fixedIn != null ? s.fixedIn : 0) + Object.keys(FOOD).reduce((a, k) => a + (s[k] || 0) * FOOD[k].kj, 0);
const eOut = s => s.use != null ? s.use : BASE + Object.keys(ACT).reduce((a, k) => a + (s[k] || 0) * ACT[k].r, 0);
const bal = s => Math.abs(eIn(s) - eOut(s)) <= 300;
const macro = s => { let c = 0, p = 0, f = 0; Object.keys(FOOD).forEach(k => { const n = s[k] || 0; c += n * FOOD[k].c * KJ.c; p += n * FOOD[k].p * KJ.p; f += n * FOOD[k].f * KJ.f; }); const t = c + p + f || 1; return { c: c / t * 100, p: p / t * 100, f: f / t * 100 }; };
function search(menu, use, max, test) { // find the plan with the fewest items that is balanced and passes test
  let best = null; const n = menu.length, idx = new Array(n).fill(0);
  const rec = i => { if (i === n) { const s = {}; menu.forEach((k, j) => s[k] = idx[j]); s.use = use; if (bal(s) && (!test || test(s))) { const c = idx.reduce((a, b) => a + b, 0); if (!best || c < best.c) best = { c, s: Object.fromEntries(menu.map((k, j) => [k, idx[j]])) }; } return; }
    for (let v = 0; v <= max; v++) { idx[i] = v; rec(i + 1); } };
  rec(0); return best && best.s; }
function scale(s) {
  const a = eIn(s), b = eOut(s), d = Math.max(-1, Math.min(1, (a - b) / 3000)), tilt = -d * 12, show = s.reveal || s.showVals;
  const foods = Object.keys(FOOD).filter(k => s[k]).flatMap(k => Array(s[k]).fill(FOOD[k].i)).slice(0, 14).join("");
  const acts = Object.keys(ACT).filter(k => s[k]).map(k => ACT[k].i + " " + s[k] + " min").join("  ");
  return `<g transform="translate(335,250)"><polygon points="0,-10 -40,150 40,150" fill="#8d6e63"/><g transform="rotate(${tilt.toFixed(1)})"><rect x="-265" y="-14" width="530" height="12" rx="6" fill="#5d4037"/>
      <g transform="translate(-200,0)"><line x1="-80" y1="0" x2="-100" y2="70" stroke="#5d4037" stroke-width="3"/><line x1="80" y1="0" x2="100" y2="70" stroke="#5d4037" stroke-width="3"/><path d="M-110,70 L110,70 Q92,110 0,110 Q-92,110 -110,70 Z" fill="#ffcc80" stroke="#ef6c00" stroke-width="3"/>
        <text x="0" y="62" text-anchor="middle" font-size="22">${foods || ""}</text>${T(0, 98, "IN: " + fmt(a) + " kJ", { s: 15, c: "#bf360c" })}</g>
      <g transform="translate(200,0)"><line x1="-80" y1="0" x2="-100" y2="70" stroke="#5d4037" stroke-width="3"/><line x1="80" y1="0" x2="100" y2="70" stroke="#5d4037" stroke-width="3"/><path d="M-110,70 L110,70 Q92,110 0,110 Q-92,110 -110,70 Z" fill="#b2dfdb" stroke="#00897b" stroke-width="3"/>
        ${T(0, 50, acts || (s.use != null ? "the whole day" : "resting only"), { s: 13, c: "#004d40" })}${T(0, 98, "OUT: " + fmt(b) + " kJ", { s: 15, c: "#004d40" })}</g></g></g>
    ${T(330, 40, show ? (bal(s) ? "⚖️ BALANCED (within 300 kJ)" : a > b ? `More energy IN than OUT (+${fmt(a - b)} kJ) → the extra is stored` : `More energy OUT than IN (−${fmt(b - a)} kJ) → body stores are used`) : "Energy in vs energy out", { s: 16, c: show && bal(s) ? "#2e7d32" : "#5d4037" })}`;
}
function render(s) {
  let side = "";
  if (s.mode === 3) { const m = macro(s), W = 200; side = `<g transform="translate(660,60)"><rect width="180" height="250" rx="12" fill="#fff" stroke="#c8e6c9" stroke-width="2"/>${T(90, 24, "WHERE THE ENERGY COMES FROM", { s: 9, c: "#558b2f" })}
      ${[["carbohydrate", m.c, "#fbc02d"], ["protein", m.p, "#e57373"], ["fat", m.f, "#8d6e63"]].map(([n, v, c], i) => `<rect x="16" y="${44 + i * 66}" width="148" height="18" rx="9" fill="#f1f1f1"/><rect x="16" y="${44 + i * 66}" width="${(148 * v / 100).toFixed(1)}" height="18" rx="9" fill="${c}"/>${T(16, 80 + i * 66, n + ": " + Math.round(v) + "%", { a: "start", s: 13, c: "#37474f" })}`).join("")}</g>`; }
  else side = `<g transform="translate(660,60)"><rect width="180" height="250" rx="12" fill="#fff" stroke="#c8e6c9" stroke-width="2"/>${T(90, 24, s.mode === 1 ? "FOOD ENERGY" : "ACTIVITY ENERGY", { s: 11, c: "#558b2f" })}
      ${(s.mode === 1 ? MENU[1].map(k => [FOOD[k].i + " " + FOOD[k].n, fmt(FOOD[k].kj) + " kJ"]) : Object.keys(ACT).map(k => [ACT[k].i + " " + ACT[k].n, ACT[k].r + " kJ/min"]).concat([["😴 Body at rest", "6000 kJ/day"]])).map(([a, b], i) => T(14, 52 + i * 40, a, { a: "start", s: 12, c: "#33691e" }) + T(166, 70 + i * 40, b, { a: "end", s: 12, c: "#ef6c00" })).join("")}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f5fbef"/>${scale(s)}${side}</svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 2) return Object.keys(ACT).map(k => ({ id: k, type: "range", label: ACT[k].i + " " + ACT[k].n, min: 0, max: 120, step: 15, nudge: 15, unit: "min", lock: lk(k) }));
  return MENU[mode].map(k => ({ id: k, type: "step", label: FOOD[k].i + " " + FOOD[k].n + " (" + fmt(FOOD[k].kj) + " kJ)", min: 0, max: mode === 1 ? 4 : 3, lock: lk(k) }));
};
const stFor = (mode, o) => { const s = { mode }; (mode === 2 ? Object.keys(ACT) : MENU[mode]).forEach(k => s[k] = 0); return Object.assign(s, o || {}); };
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `In ${fmt(eIn(s))} kJ, out ${fmt(eOut(s))} kJ (difference ${fmt(eIn(s) - eOut(s))} kJ)`;
const HINT = { 1: "Add up the energy of the food. Balanced = within 300 kJ of the energy used.", 2: "Energy out = 6000 kJ (body at rest) + minutes × kJ per minute for each activity.", 3: "Carbohydrate and protein give 17 kJ per gram, fat gives 37 kJ per gram." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🍽️ Meal plan challenge", 2: "⚽ Activity challenge", 3: "🥗 Nutrition challenge" }[mode], prompt: "Plan the day, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("eat-sim", diff, uses, mk);
const bump = (sol, menu) => { const w = Object.assign({}, sol), k = menu.find(x => w[x] < 3) || menu[0]; w[k] = (w[k] || 0) + (FOOD[k].kj > 1000 ? 1 : 2); return w; };
const C = {
  plan: () => { const use = choice([7000, 8000, 9000, 10000]), sol = search(MENU[1], use, 4);
    return simQ(1, `Today your body uses <b>${fmt(use)} kJ</b>. Plan meals so energy in and out are <b>balanced</b> (within 300 kJ).`, stFor(1, { use }), s => ok(bal(s), say(s) + ".", say(s) + "."), sol, { wrong: bump(sol, MENU[1]) }); },
  fruit: () => { const use = choice([8000, 9000]), sol = search(MENU[1], use, 4, s => s.apple >= 2);
    return simQ(1, `The day uses <b>${fmt(use)} kJ</b>. Make a balanced plan with <b>at least 2 apples</b>.`, stFor(1, { use }), s => ok(bal(s) && s.apple >= 2, say(s) + ".", s.apple < 2 ? "Add at least 2 apples." : say(s) + "."), sol, { wrong: bump(sol, MENU[1]) }); },
  remove: () => { const use = 7000, start = { sandwich: 2, rice: 2, apple: 2, yogurt: 2, milk: 1 };
    return simQ(1, `This plan gives too much energy for a <b>quiet day</b> (${fmt(use)} kJ used). Remove food until it is <b>balanced</b>.`, stFor(1, Object.assign({ use }, start)), s => ok(bal(s), say(s) + ".", say(s) + "."), { sandwich: 2, rice: 1, apple: 2, yogurt: 1, milk: 1 }, { wrong: start }); },
  oneRice: () => { const use = 8500, sol = search(MENU[1], use, 4, s => s.rice <= 1 && s.milk >= 1);
    return simQ(1, `The day uses <b>${fmt(use)} kJ</b>. Balance it with <b>at most 1 rice plate</b> and <b>at least 1 glass of milk</b>.`, stFor(1, { use }), s => ok(bal(s) && s.rice <= 1 && s.milk >= 1, say(s) + ".", s.rice > 1 ? "At most 1 rice plate." : s.milk < 1 ? "Add a glass of milk." : say(s) + "."), sol, { wrong: bump(sol, MENU[1]) }); },
  football: () => simQ(2, "You ate <b>9,000 kJ</b>. Balance it with <b>football only</b>.", stFor(2, { fixedIn: 9000 }), s => ok(bal(s) && !s.cycling && !s.walking, `6000 + ${s.football} × 40 = ${fmt(eOut(s))} kJ.`, say(s) + "."), { football: 75 }, { lock: ["cycling", "walking"], wrong: { football: 45 } }),
  walk: () => simQ(2, "You ate <b>7,800 kJ</b>. Balance it with <b>walking only</b>.", stFor(2, { fixedIn: 7800 }), s => ok(bal(s), `6000 + ${s.walking} × 15 = ${fmt(eOut(s))} kJ.`, say(s) + "."), { walking: 120 }, { lock: ["football", "cycling"], wrong: { walking: 60 } }),
  two30: () => simQ(2, "You ate <b>8,100 kJ</b>. Balance it with <b>two different activities, 30 minutes each</b>.", stFor(2, { fixedIn: 8100 }), s => { const used = Object.keys(ACT).filter(k => s[k]); return ok(bal(s) && used.length === 2 && used.every(k => s[k] === 30), "Football 30 min (1200) + cycling 30 min (900) = 2100 kJ.", used.length !== 2 || !used.every(k => s[k] === 30) ? "Use exactly two activities at 30 minutes each." : say(s) + "."); }, { football: 30, cycling: 30 }, { wrong: { football: 30, walking: 30 } }),
  hour: () => simQ(2, "You ate <b>8,400 kJ</b> and have only <b>60 minutes</b> in total for activity. Balance the day.", stFor(2, { fixedIn: 8400 }), s => { const t = s.football + s.cycling + s.walking; return ok(bal(s) && t <= 60, "60 min of football = 2400 kJ — the most intense activity.", t > 60 ? `That is ${t} minutes.` : say(s) + "."); }, { football: 60 }, { wrong: { cycling: 60 } }),
  rest: () => simQ(2, "A <b>rest day</b>: you ate <b>6,900 kJ</b>. Balance it with the <b>least activity</b> time.", stFor(2, { fixedIn: 6900 }), s => { const t = s.football + s.cycling + s.walking; return ok(bal(s) && t === 15, "15 min of football (600 kJ) is enough: 6600 kJ is within 300 kJ.", bal(s) ? `${t} minutes — less is possible.` : say(s) + "."); }, { football: 15 }, { wrong: { walking: 15 } }),
  carbs: () => { const sol = search(MENU[3], 9000, 3, s => macro(s).c >= 55);
    return simQ(3, "The day uses <b>9,000 kJ</b>. Make it <b>balanced</b> with <b>at least 55%</b> of the energy from <b>carbohydrate</b>.", stFor(3, { use: 9000 }), s => ok(bal(s) && macro(s).c >= 55, `${say(s)}; carbohydrate ${Math.round(macro(s).c)}%.`, !bal(s) ? say(s) + "." : `Carbohydrate is only ${Math.round(macro(s).c)}%.`), sol, { wrong: Object.assign({}, sol, { burger: 2, pasta: Math.max(0, sol.pasta - 1) }) }); },
  lowFat: () => { const sol = search(MENU[3], 8000, 3, s => macro(s).f < 25);
    return simQ(3, "The day uses <b>8,000 kJ</b>. Make it <b>balanced</b> with <b>less than 25%</b> of the energy from <b>fat</b>.", stFor(3, { use: 8000 }), s => ok(bal(s) && macro(s).f < 25, `Fat ${Math.round(macro(s).f)}%.`, !bal(s) ? say(s) + "." : `Fat is ${Math.round(macro(s).f)}%.`), sol, { wrong: { pasta: 1, burger: 1, fries: 2, banana: 0, nuts: 1 } }); },
  protein: () => { const sol = search(MENU[3], 9000, 3, s => macro(s).p >= 15 && macro(s).f < 35);
    return simQ(3, "Sports training day: <b>9,000 kJ</b>. Balanced, with <b>protein at least 15%</b> and <b>fat under 35%</b>.", stFor(3, { use: 9000 }), s => { const m = macro(s); return ok(bal(s) && m.p >= 15 && m.f < 35, `Protein ${Math.round(m.p)}%, fat ${Math.round(m.f)}%.`, !bal(s) ? say(s) + "." : `Protein ${Math.round(m.p)}%, fat ${Math.round(m.f)}%.`); }, sol, { wrong: { pasta: 0, burger: 0, fries: 3, banana: 3, nuts: 3 } }); }
};

// ---------- diagram tasks ----------
const label = (c, p, f, name) => `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#f5fbef"/><rect x="200" y="20" width="340" height="240" rx="10" fill="#fff" stroke="#212121" stroke-width="3"/>
  ${T(370, 52, "NUTRITION — " + name, { s: 16, c: "#212121" })}<line x1="216" x2="524" y1="66" y2="66" stroke="#212121" stroke-width="5"/>
  ${[["Carbohydrate", c + " g"], ["Protein", p + " g"], ["Fat", f + " g"], ["Energy", "? kJ"]].map(([a, b], i) => `${T(222, 104 + i * 42, a, { a: "start", s: 16, c: "#212121" })}${T(518, 104 + i * 42, b, { a: "end", s: 16, c: "#212121" })}<line x1="216" x2="524" y1="${116 + i * 42}" y2="${116 + i * 42}" stroke="#bdbdbd"/>`).join("")}
  ${T(620, 120, "carb 17 kJ/g", { s: 13, c: "#558b2f" })}${T(620, 144, "protein 17 kJ/g", { s: 13, c: "#558b2f" })}${T(620, 168, "fat 37 kJ/g", { s: 13, c: "#558b2f" })}</svg>`;
const D = {
  labelNum: diff => E.diaT("eat-num", diff, 2, () => { const c = choice([[30, 10, 5, "cereal bar"], [50, 20, 10, "lunch box"], [20, 5, 15, "biscuits"], [60, 30, 20, "dinner"]]); const kj = c[0] * 17 + c[1] * 17 + c[2] * 37;
    return { kind: "num", title: "🏷️ Read the food label", prompt: "Use the label to find the energy.", visual: label(c[0], c[1], c[2], c[3]),
      fields: [{ label: "Energy from fat", unit: "kJ", answer: c[2] * 37 }, { label: "Total energy", unit: "kJ", answer: kj }], explain: `${c[0]}×17 + ${c[1]}×17 + ${c[2]}×37 = ${kj} kJ.`, summary: "Energy from a food label" }; }),
  actNum: diff => E.diaT("eat-num", diff, 2, () => { const a = choice(Object.keys(ACT)), m = choice([20, 45, 60, 90]);
    return { kind: "num", title: "⏱️ Activity energy", prompt: `${ACT[a].i} ${ACT[a].n} uses ${ACT[a].r} kJ per minute.`, visual: render(stFor(2, { fixedIn: 9000, [a]: m >= 120 ? 120 : Math.round(m / 15) * 15, showVals: true })),
      fields: [{ label: `Energy used in ${m} minutes`, unit: "kJ", answer: ACT[a].r * m }, { label: "Total for the day (with 6000 kJ at rest)", unit: "kJ", answer: 6000 + ACT[a].r * m }], explain: `${m} × ${ACT[a].r} = ${ACT[a].r * m} kJ; 6000 + ${ACT[a].r * m} = ${6000 + ACT[a].r * m} kJ.`, summary: "Energy used in activity" }; }),
  pickDay: diff => E.diaT("eat-pick", diff, 1, () => { const days = { a: [9000, 9000], b: [11000, 8000], c: [6500, 9500] }, order = E.shuffle(["a", "b", "c"]);
    const q = choice([["a", "the <b>balanced</b> day"], ["b", "the day where the body <b>stores</b> extra energy"], ["c", "the day where the body <b>uses its stores</b>"]]);
    return { kind: "pick", title: "👆 Energy in vs out", prompt: "Three days are shown as bar charts. Click " + q[1] + ".", answer: [q[0]], names: { a: "Day with 9000 in / 9000 out", b: "Day with 11000 in / 8000 out", c: "Day with 6500 in / 9500 out" },
      visual: st => `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#f5fbef"/>${order.map((k, i) => { const [a, b] = days[k], x = 20 + i * 240; return `<g class="pk" data-k="${k}"><rect x="${x}" y="10" width="220" height="260" rx="14" fill="#fff" ${E.ring(st[k])}/>
        <rect x="${x + 40}" y="${230 - a / 60}" width="50" height="${a / 60}" fill="#ffb74d"/><rect x="${x + 130}" y="${230 - b / 60}" width="50" height="${b / 60}" fill="#4db6ac"/>${T(x + 65, 250, "IN", { s: 13 })}${T(x + 155, 250, "OUT", { s: 13 })}${T(x + 65, 222 - a / 60, fmt(a), { s: 11 })}${T(x + 155, 222 - b / 60, fmt(b), { s: 11 })}${T(x + 110, 34, "Day " + (i + 1), { s: 15 })}</g>`; }).join("")}</svg>`,
      explain: "Balanced: in = out. If in > out, the extra is stored (mostly as fat). If out > in, the body uses its stores.", summary: "Energy balance bar charts" }; }),
  nutMcq: diff => E.diaT("eat-mcq", diff, 3, () => { const q = choice([
      { ask: "Which nutrient is mainly used for <b>growth and repair</b> of the body?", ok: "Protein", bad: ["Carbohydrate", "Fat", "Water"], ex: "Proteins build and repair muscles and other tissues." },
      { ask: "Why does fat give more energy per gram than carbohydrate?", ok: "Fat stores more chemical energy per gram (37 vs 17 kJ)", bad: ["Fat is digested faster", "Fat contains vitamins", "Fat is heavier"], ex: "Each gram of fat releases about twice as much energy as a gram of carbohydrate." },
      { ask: "A footballer trains for 2 hours every day. What should happen to the energy they eat?", ok: "Increase, to balance the extra energy used", bad: ["Decrease, because they are fit", "Stay the same as a resting person", "Only drink water"], ex: "More activity → more energy out → more energy in is needed to stay balanced." }]);
    return { kind: "mcq", title: "🥗 Nutrients", prompt: "Think about food and energy.", visual: render(stFor(3, { use: 9000, pasta: 2, banana: 2, milk: 0, nuts: 1, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Nutrients and energy" }; })
};
const LEVELS = {
  1: { intro: "Energy IN (food) and energy OUT (body + activity). Plan meals that balance the day.", pool: () => [S(1, 1, C.plan), S(2, 1, C.fruit), S(2, 1, C.remove), S(3, 1, C.oneRice), S(3, 1, C.plan), D.pickDay(1), D.actNum(2), D.labelNum(3)] },
  2: { intro: "Activity uses energy: football 40, cycling 30, walking 15 kJ per minute, plus 6000 kJ at rest.", pool: () => [S(1, 1, C.football), S(2, 1, C.walk), S(2, 1, C.rest), S(3, 1, C.two30), S(3, 1, C.hour), D.pickDay(1), D.actNum(2), D.labelNum(3)] },
  3: { intro: "Nutrients: carbohydrate, protein and fat. Balance the day AND choose where the energy comes from.", pool: () => [S(1, 1, C.lowFat), S(2, 1, C.carbs), S(3, 1, C.protein), S(3, 1, C.carbs), D.labelNum(1), D.nutMcq(2), D.nutMcq(3)] }
};
const explore = E.exploreSim({
  intro: "Add food and activity and watch the energy balance tip. A balanced day keeps energy in and out about equal.",
  state: lv => stFor(lv, lv === 2 ? { fixedIn: 9000, showVals: true } : { use: 9000, showVals: true }), controls: lv => ctlsFor(lv), render,
  goals: lv => [{ txt: "Make energy IN bigger than OUT", test: s => eIn(s) - eOut(s) > 300 }, { txt: "Make energy OUT bigger than IN", test: s => eOut(s) - eIn(s) > 300 }, { txt: "Balance the day", test: s => bal(s) && eIn(s) > 0 }],
  facts: lv => "📘 Energy is measured in <b>kilojoules (kJ)</b>. Balanced: energy in ≈ energy out. Active days need more food energy than quiet days." + (lv >= 3 ? " Carbohydrate and protein: 17 kJ/g, fat: 37 kJ/g." : "")
});
E.start({ labId: "eating", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🍽️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🍎", "⚽", "🥗", "✨"],
  exploreDemo: lv => lv === 2 ? [{ set: { football: 120 } }, { set: { football: 0 } }, { set: { football: 75 } }] : lv === 1 ? [{ set: { rice: 4 } }, { set: { rice: 0 } }, Object.assign({ set: search(MENU[1], 9000, 4) })] : [{ set: { pasta: 3, burger: 3 } }, { set: { pasta: 0, burger: 0 } }, { set: search(MENU[3], 9000, 3) }] });
})();
