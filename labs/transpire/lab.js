"use strict";
// ===== Plant Transpiration (potometer) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const LIGHT = { dark: 0.3, dim: 0.7, bright: 1 }, WIND = { none: 1, low: 1.5, high: 2 }, COVER = { none: 1, top: 0.9, bottom: 0.2, both: 0.1 };
const LN = { dark: "🌑 Dark", dim: "🌥 Dim", bright: "☀️ Bright" }, WN = { none: "No fan", low: "🌬 Low", high: "🌬🌬 High" }, CN = { none: "None", top: "Top only", bottom: "Bottom only", both: "Both sides" };
const r2 = x => Math.round(x * 100) / 100;
const rate = s => r2(2 * LIGHT[s.light] * WIND[s.wind] * (1 + (s.T - 20) * 0.05) * (1 - s.h / 100) * COVER[s.cover]);
const moved = s => Math.round(Math.min(100, rate(s) * s.t) * 10) / 10;
function plant(x, y, s) {
  const open = s.light !== "dark", wet = s.reveal ? Math.min(8, Math.round(rate(s) * 2)) : 0;
  let g = `<path d="M${x},${y} C${x - 4},${y - 60} ${x + 6},${y - 110} ${x},${y - 170}" stroke="#558b2f" stroke-width="7" fill="none"/>`;
  [[-1, 40], [1, 80], [-1, 120], [1, 160]].forEach(([d, h], i) => { const lx = x + d * 8, ly = y - h; g += `<path d="M${lx},${ly} q${d * 50},-40 ${d * 100},-10 q${-d * 45},35 ${-d * 100},10Z" fill="${s.cover === "both" || (s.cover === "top" && i % 2) || (s.cover === "bottom" && !(i % 2)) ? "#9ccc65" : "#7cb342"}" stroke="#33691e" stroke-width="2"/>${s.cover !== "none" ? `<path d="M${lx + d * 10},${ly - 2} q${d * 40},-26 ${d * 80},-8" stroke="#fffde7" stroke-width="3" opacity=".7" fill="none"/>` : ""}`;
    for (let k = 0; k < wet / 2; k++) g += `<circle cx="${lx + d * (40 + k * 16)}" cy="${ly - 26 - k * 6}" r="3" fill="#4fc3f7"><animate attributeName="cy" values="${ly - 20};${ly - 60}" dur="${(2.4 - Math.min(2, rate(s) * .4)).toFixed(2)}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="${(2.4 - Math.min(2, rate(s) * .4)).toFixed(2)}s" repeatCount="indefinite"/></circle>`; });
  return g + `<g transform="translate(${x + 120},${y - 200})"><circle r="26" fill="#fff" stroke="#33691e" stroke-width="2"/><ellipse cx="-7" cy="0" rx="7" ry="16" fill="#aed581" stroke="#33691e"/><ellipse cx="7" cy="0" rx="7" ry="16" fill="#aed581" stroke="#33691e"/>${open ? `<ellipse cx="0" cy="0" rx="3.5" ry="10" fill="#33691e"/>` : `<line x1="0" y1="-12" x2="0" y2="12" stroke="#33691e" stroke-width="2"/>`}${T(0, 42, open ? "stoma open" : "stoma closed", { s: 11, c: "#33691e" })}</g>`;
}
function render(s) {
  const show = s.reveal, R = rate(s), d = show ? moved(s) : 0;
  let g = `<rect width="860" height="450" fill="${s.light === "dark" ? "#37474f" : s.light === "dim" ? "#cfd8dc" : "#f1f8e9"}"/>`;
  if (s.light === "bright") g += `<circle cx="70" cy="60" r="34" fill="#ffeb3b"/>`;
  if (s.wind !== "none") g += `<g transform="translate(560,120)"><circle r="40" fill="#eceff1" stroke="#90a4ae" stroke-width="3"/>${[0, 120, 240].map(a => `<ellipse rx="10" ry="32" fill="#90a4ae" transform="rotate(${a})"><animateTransform attributeName="transform" type="rotate" from="${a}" to="${a + 360}" dur="${s.wind === "high" ? 0.4 : 0.9}s" repeatCount="indefinite"/></ellipse>`).join("")}</g>${T(560, 182, "fan " + s.wind, { s: 12, c: "#37474f" })}`;
  g += plant(260, 290, s);
  // potometer
  g += `<rect x="236" y="290" width="48" height="40" rx="6" fill="#455a64"/><path d="M260,330 v40 h-200 v-26" stroke="#90caf9" stroke-width="14" fill="none"/><rect x="60" y="364" width="520" height="12" rx="6" fill="#bbdefb" stroke="#78909c"/>
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${540 - i * 46}" y1="380" x2="${540 - i * 46}" y2="${i % 5 ? 388 : 394}" stroke="#455a64"/>${i % 5 === 0 ? T(540 - i * 46, 408, i * 10 + " mm", { s: 11, c: "#455a64" }) : ""}`).join("")}
    <ellipse cx="${540 - d * 4.6}" cy="370" rx="9" ry="6" fill="#fff" stroke="#546e7a" stroke-width="2"/>${T(320, 432, "air bubble moves along the tube as the plant takes up water", { s: 12, c: s.light === "dark" ? "#eceff1" : "#455a64" })}`;
  g += `<g transform="translate(640,210)"><rect width="200" height="170" rx="14" fill="#fff" stroke="#c5e1a5" stroke-width="2"/>${T(100, 26, "CONDITIONS", { s: 12, c: "#33691e" })}${T(100, 52, `${s.T} °C · humidity ${s.h}%`, { s: 13, c: "#37474f" })}${T(100, 74, "vaseline: " + CN[s.cover], { s: 12, c: "#37474f" })}
    ${T(100, 112, show ? fmt(R) + " mm/min" : "?", { s: 24, c: "#1b5e20" })}${T(100, 136, "transpiration rate", { s: 11, c: "#558b2f" })}${T(100, 158, show ? `${s.t} min → bubble moved ${fmt(d)} mm` : "press ▶ to measure", { s: 12, c: "#37474f" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "light", type: "choice", label: "Light", options: Object.keys(LIGHT).map(v => ({ v, label: LN[v] })), lock: lk("light") },
  { id: "wind", type: "choice", label: "Wind", options: Object.keys(WIND).map(v => ({ v, label: WN[v] })), lock: lk("wind") },
  { id: "T", type: "range", label: "Temperature", min: 10, max: 35, step: 5, nudge: 5, unit: "°C", hide: () => lv < 2, lock: lk("T") },
  { id: "h", type: "range", label: "Humidity", min: 10, max: 90, step: 5, nudge: 5, unit: "%", hide: () => lv < 2, lock: lk("h") },
  { id: "cover", type: "choice", label: "Vaseline on leaves", options: Object.keys(COVER).map(v => ({ v, label: CN[v] })), hide: () => lv < 3, lock: lk("cover") },
  { id: "t", type: "range", label: "Time", min: 1, max: 20, step: 1, nudge: 1, unit: "min", hide: () => lv < 3, lock: lk("t") }]; };
const st = o => Object.assign({ light: "dim", wind: "none", T: 20, h: 50, cover: "none", t: 10 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `rate ${fmt(rate(s))} mm/min`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🌿 Transpiration challenge", prompt: "Set the conditions, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Water evaporates out of open stomata. Bright light (stomata open), wind, warmth and DRY air speed it up; darkness, still air, cold and humid air slow it down." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("tp-sim", diff, uses, mk);
const C = {
  fastest: () => simQ(1, "Make the plant lose water <b>as fast as possible</b>.", st(), s => ok(s.light === "bright" && s.wind === "high", say(s) + " — open stomata and wind carrying vapour away.", say(s) + " — it can go faster."), { light: "bright", wind: "high" }, { wrong: { light: "bright", wind: "low" } }),
  slowest: () => simQ(1, "Make the plant lose water <b>as slowly as possible</b>.", st({ light: "bright", wind: "high" }), s => ok(s.light === "dark" && s.wind === "none", say(s) + " — stomata closed, still air.", say(s) + " — it can go slower."), { light: "dark", wind: "none" }, { wrong: { light: "dim", wind: "none" } }),
  night: () => simQ(1, "Show that at <b>night</b> the stomata close: rate <b>under 0.5</b> mm/min with no fan.", st({ light: "bright" }), s => ok(rate(s) < 0.5 && s.wind === "none", say(s) + ".", say(s) + "."), { light: "dark" }, { lock: ["wind"], wrong: { light: "dim" } }),
  fan: () => simQ(1, "In bright light, <b>double</b> the rate using only the fan.", st({ light: "bright" }), s => ok(s.light === "bright" && rate(s) === 2, "High wind doubles it: 1 → 2 mm/min.", say(s) + "."), { wind: "high" }, { lock: ["light"], wrong: { wind: "low" } }),
  warm15: () => simQ(2, "Bright light, no fan, humidity 50%. Make the rate exactly <b>1.5 mm/min</b> with temperature.", st({ light: "bright", T: 10 }), s => ok(rate(s) === 1.5, "30 °C → 1.5 mm/min.", say(s) + "."), { T: 30 }, { lock: ["light", "wind", "h"], wrong: { T: 25 } }),
  humid: () => simQ(2, "It is getting <b>humid</b>. Set the humidity so the rate drops to <b>0.5 mm/min</b> (bright, 20 °C, no fan).", st({ light: "bright", h: 20 }), s => ok(rate(s) === 0.5, "75% humidity: little difference between the leaf and the air.", say(s) + "."), { h: 75 }, { lock: ["light", "wind", "T"], wrong: { h: 70 } }),
  desert: () => simQ(2, "A hot, dry desert day: reach <b>at least 3 mm/min</b> with <b>no fan</b>.", st({ light: "bright" }), s => ok(rate(s) >= 3 && s.wind === "none", say(s) + ".", say(s) + " — hotter and drier!"), { T: 35, h: 10 }, { lock: ["wind", "light"], wrong: { T: 35, h: 30 } }),
  coldWet: () => simQ(2, "Bright light, no fan: make the rate as low as you can using temperature and humidity.", st({ light: "bright", T: 25, h: 40 }), s => ok(s.T === 10 && s.h === 90, say(s) + " — cold and very humid.", say(s) + " — colder and more humid!"), { T: 10, h: 90 }, { lock: ["light", "wind"], wrong: { T: 10, h: 80 } }),
  bottom: () => simQ(3, "Cover ONE side of the leaves with vaseline so the rate falls to <b>0.2 mm/min or less</b> (bright, no fan).", st({ light: "bright" }), s => ok(s.cover === "bottom", "Most stomata are on the BOTTOM of the leaf.", s.cover === "both" ? "Cover only one side." : say(s) + "."), { cover: "bottom" }, { lock: ["light", "wind", "T", "h"], wrong: { cover: "top" } }),
  top: () => simQ(3, "Cover one side but keep the rate <b>above 0.8 mm/min</b>. Which side has few stomata?", st({ light: "bright" }), s => ok(s.cover === "top", "Covering the top hardly changes it (0.9 mm/min).", say(s) + "."), { cover: "top" }, { lock: ["light", "wind", "T", "h"], wrong: { cover: "bottom" } }),
  thirty: () => simQ(3, "Bright light, high wind: move the bubble <b>exactly 30 mm</b>.", st({ light: "bright", wind: "high", t: 5 }), s => ok(moved(s) === 30, "2 mm/min × 15 min = 30 mm.", `${s.t} min → ${fmt(moved(s))} mm.`), { t: 15 }, { lock: ["light", "wind", "T", "h", "cover"], wrong: { t: 12 } }),
  plan24: () => simQ(3, "Move the bubble <b>24 mm in 8 minutes</b> (bright light, humidity 50%).", st({ light: "bright", t: 8 }), s => ok(moved(s) === 24, "High wind at 30 °C: 3 mm/min × 8 = 24 mm.", `${fmt(rate(s))} mm/min × 8 = ${fmt(moved(s))} mm.`), { wind: "high", T: 30 }, { lock: ["light", "h", "t", "cover"], wrong: { wind: "high", T: 25 } })
};
const D = {
  pick: diff => E.diaT("tp-pick", diff, 2, () => { const want = choice(["guard", "stoma", "xylem"]);
    const q = { guard: "Click the <b>guard cells</b> that open and close the pore.", stoma: "Click the <b>stoma</b> (pore) where water vapour escapes.", xylem: "Click the <b>xylem</b> that carries water up from the roots." }[want];
    return { kind: "pick", title: "👆 Leaf close-up", prompt: q, answer: [want], names: { guard: "guard cells", stoma: "stoma", xylem: "xylem", palisade: "palisade cells" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f1f8e9"/><rect x="80" y="40" width="700" height="210" rx="20" fill="#dcedc8" stroke="#33691e" stroke-width="2"/>
        <g class="pk" data-k="palisade">${Array.from({ length: 12 }, (_, i) => `<rect x="${100 + i * 56}" y="52" width="44" height="70" rx="12" fill="#9ccc65" stroke="#33691e"/>`).join("")}<rect x="92" y="46" width="676" height="82" rx="10" fill="none" ${E.ring(s2.palisade)}/></g>
        <g class="pk" data-k="xylem"><circle cx="300" cy="180" r="30" fill="#90caf9" stroke="#1565c0" stroke-width="3"/><circle cx="300" cy="180" r="36" fill="none" ${E.ring(s2.xylem)}/>${T(300, 185, "vein", { s: 11, c: "#0d47a1" })}</g>
        <g class="pk" data-k="guard"><ellipse cx="560" cy="246" rx="18" ry="11" fill="#aed581" stroke="#33691e" stroke-width="2"/><ellipse cx="610" cy="246" rx="18" ry="11" fill="#aed581" stroke="#33691e" stroke-width="2"/><rect x="536" y="230" width="98" height="32" rx="12" fill="none" ${E.ring(s2.guard)}/></g>
        <g class="pk" data-k="stoma"><rect x="579" y="236" width="12" height="40" rx="5" fill="#1b5e20"/><rect x="574" y="232" width="22" height="50" rx="6" fill="none" ${E.ring(s2.stoma)}/></g>
        ${T(430, 30, "upper surface", { s: 12, c: "#33691e" })}${T(430, 292, "lower surface", { s: 12, c: "#33691e" })}</svg>`,
      explain: "Water travels up the xylem, evaporates inside the leaf and escapes through the stoma; two guard cells control the size of the pore.", summary: "Leaf structures" }; }),
  num: diff => E.diaT("tp-num", diff, 2, () => { const c = choice([[36, 12], [45, 15], [24, 6], [50, 20]]);
    return { kind: "num", title: "🧮 Potometer reading", prompt: `The air bubble moved <b>${c[0]} mm</b> in <b>${c[1]} min</b>.`, visual: render(st({ light: "bright", reveal: true })),
      fields: [{ label: "Rate", unit: "mm/min", answer: c[0] / c[1] }, { label: "Distance in 30 min at the same rate", unit: "mm", answer: c[0] / c[1] * 30 }], explain: `${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} mm/min; × 30 = ${fmt(c[0] / c[1] * 30)} mm.`, summary: "Transpiration rate" }; }),
  mcq: diff => E.diaT("tp-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does transpiration slow down on a humid day?", ok: "The air is already full of water vapour, so less evaporates", bad: ["Stomata get bigger", "The roots stop working", "Light is brighter"], ex: "Evaporation depends on the difference in water vapour between leaf and air." },
      { ask: "Why do stomata close at night?", ok: "No light means no photosynthesis, so the plant saves water", bad: ["To let in more CO₂", "Because it is windy", "To grow faster"], ex: "Guard cells close the pores in the dark." },
      { ask: "How does transpiration help the plant?", ok: "It pulls water and minerals up the xylem and cools the leaves", bad: ["It makes glucose", "It removes oxygen from the roots", "It stops photosynthesis"], ex: "The transpiration stream moves water from roots to leaves." }]);
    return { kind: "mcq", title: "📘 Transpiration ideas", prompt: "Think about the leaf.", visual: render(st({ light: "bright", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Transpiration concepts" }; })
};
const LEVELS = {
  1: { intro: "A potometer measures how fast a plant takes up water. Change the light and the wind.", pool: () => [S(1, 1, C.fastest), S(2, 1, C.night), S(2, 1, C.fan), S(3, 1, C.slowest), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Temperature and humidity also change the rate. Make exact rates.", pool: () => [S(1, 1, C.warm15), S(2, 1, C.humid), S(2, 1, C.coldWet), S(3, 1, C.desert), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Cover leaves with vaseline to find the stomata, and plan bubble distances over time.", pool: () => [S(1, 1, C.top), S(2, 1, C.bottom), S(3, 1, C.thirty), S(3, 1, C.plan24), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change the light and the fan, then press ▶ to watch the bubble in the potometer.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Measure",
  goals: () => [{ txt: "Make the bubble move fast", test: (s, m) => m.fast }, { txt: "Close the stomata", test: (s, m) => m.dark }, { txt: "Try the fan", test: (s, m) => m.fan }],
  track: (s, m, ran) => { if (!ran) return; if (rate(s) >= 1.5) m.fast = 1; if (s.light === "dark") m.dark = 1; if (s.wind !== "none") m.fan = 1; },
  facts: () => "📘 <b>Transpiration</b> is the loss of water vapour from leaves through the <b>stomata</b>. It pulls water up the <b>xylem</b> from the roots."
});
E.start({ labId: "transpire", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌿", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🌿", "💧", "☀️", "✨"],
  exploreDemo: () => [{ set: { light: "bright", wind: "high" }, run: true }, { set: { light: "dark", wind: "none" }, run: true }] });
})();
