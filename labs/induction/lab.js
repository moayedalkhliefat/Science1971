"use strict";
// ===== Electromagnetic Induction — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const STR = { 1: "Weak", 2: "Medium", 3: "Strong" };
// magnet + coil: size = strength × speed × turns ÷ 100 (volts); sign: N in / S out → right (+)
const sizeV = s => s.motion === "still" ? 0 : r2(s.str * s.speed * s.turns / 100);
const dirV = s => sizeV(s) === 0 ? 0 : ((s.pole === "N") === (s.motion === "in") ? 1 : -1);
const volt = s => sizeV(s) * dirV(s);
const BULB = 6;
// transformer: Vs = Vp × Ns ÷ Np (only with AC)
const vs = s => s.ac ? r2(s.vp * s.ns / s.np) : 0;
function coilScene(s, show) {
  const loops = Math.min(16, Math.max(4, Math.round(s.turns / 25))), cx0 = 190, cw = 180, cy = 200;
  let g = `<rect x="${cx0}" y="${cy - 50}" width="${cw}" height="100" rx="10" fill="#eceff1" stroke="#b0bec5" stroke-width="2"/>`;
  for (let i = 0; i < loops; i++) { const x = cx0 + 10 + i * (cw - 20) / (loops - 1); g += `<ellipse cx="${x}" cy="${cy}" rx="7" ry="54" fill="none" stroke="#e67e22" stroke-width="3"/>`; }
  g += T(cx0 + cw / 2, cy + 82, s.turns + " turns", { s: 13, c: "#e67e22" });
  const mx = s.motion === "in" ? 172 : s.motion === "out" ? 160 : 186, first = s.pole, back = first === "N" ? "S" : "N";
  const fc = p => p === "N" ? "#e53935" : "#1e88e5", h = 18 + s.str * 6;
  g += `<rect x="${mx - 130}" y="${cy - h}" width="65" height="${2 * h}" fill="${fc(back)}" stroke="#263238" stroke-width="2"/><rect x="${mx - 65}" y="${cy - h}" width="65" height="${2 * h}" fill="${fc(first)}" stroke="#263238" stroke-width="2"/>${T(mx - 97, cy + 7, back, { s: 20, c: "#fff" })}${T(mx - 32, cy + 7, first, { s: 20, c: "#fff" })}${T(mx - 65, cy - h - 10, STR[s.str] + " magnet", { s: 12, c: "#37474f" })}`;
  if (s.motion !== "still" && s.speed > 0) { const d = s.motion === "in" ? 1 : -1, L = 20 + s.speed * 12, ax = mx - 65, ay = cy + h + 28; g += `<line x1="${ax - d * L / 2}" y1="${ay}" x2="${ax + d * L / 2}" y2="${ay}" stroke="#37474f" stroke-width="4"/><path d="M${ax + d * (L / 2 + 10)},${ay} l${-d * 13},-8 v16Z" fill="#37474f"/>${T(ax, ay + 24, (s.motion === "in" ? "pushed IN" : "pulled OUT") + " at " + s.speed + " m/s", { s: 12, c: "#37474f" })}`; }
  else g += T(mx - 65, cy + h + 34, "held still", { s: 12, c: "#78909c" });
  // wires to meter and bulb
  g += `<path d="M${cx0 + cw},${cy - 40} H420 V110 H430 M510,110 H545 V300 H488 M452,300 H420 V${cy + 40} H${cx0 + cw}" fill="none" stroke="#455a64" stroke-width="3"/>`;
  const V = show ? volt(s) : 0, ang = Math.max(-60, Math.min(60, V * 2));
  g += `<g transform="translate(470,110)"><circle r="40" fill="#fff" stroke="#37474f" stroke-width="3"/><path d="M-34,-8 A36,36 0 0 1 34,-8" fill="none" stroke="#b0bec5" stroke-width="2"/>${T(0, 26, "0", { s: 11, c: "#78909c" })}${T(-30, 18, "−", { s: 14, c: "#78909c" })}${T(30, 18, "+", { s: 14, c: "#78909c" })}<line x1="0" y1="14" x2="${34 * Math.sin(ang * Math.PI / 180)}" y2="${14 - 34 * Math.cos(ang * Math.PI / 180)}" stroke="#c62828" stroke-width="3"/><circle cy="14" r="4" fill="#37474f"/></g>${T(470, 168, "meter", { s: 11, c: "#546e7a" })}`;
  const on = show && Math.abs(V) >= BULB;
  g += `<g transform="translate(470,300)">${on ? `<circle r="34" fill="#fff59d" opacity=".8"/>` : ""}<circle r="18" fill="${on ? "#ffee58" : "#eceff1"}" stroke="#757575" stroke-width="2"/><rect x="-8" y="16" width="16" height="12" fill="#9e9e9e"/></g>${T(470, 346, BULB + " V bulb", { s: 11, c: "#546e7a" })}`;
  return g;
}
function transScene(s, show) {
  let g = `<rect x="170" y="90" width="260" height="220" fill="none" stroke="#78909c" stroke-width="26"/>${T(300, 214, "iron core", { s: 12, c: "#78909c" })}`;
  const coil = (x, n, col) => { const k = Math.min(14, Math.max(3, Math.round(Math.log2(n / 25) * 2.4))); let c = ""; for (let i = 0; i < k; i++) c += `<ellipse cx="${x}" cy="${120 + i * 160 / (k - 1)}" rx="24" ry="6" fill="none" stroke="${col}" stroke-width="3"/>`; return c; };
  g += coil(170, s.np, "#e67e22") + coil(430, s.ns, "#8e24aa") + T(170, 336, "primary " + s.np + " turns", { s: 12, c: "#e67e22" }) + T(430, 336, "secondary " + s.ns + " turns", { s: 12, c: "#8e24aa" });
  g += `<path d="M146,130 H70 V270 H146" fill="none" stroke="#455a64" stroke-width="3"/><circle cx="70" cy="200" r="28" fill="#fff" stroke="#37474f" stroke-width="3"/>${s.ac ? `<path d="M52,200 q9,-16 18,0 t18,0" fill="none" stroke="#37474f" stroke-width="3"/>` : `<line x1="56" y1="194" x2="84" y2="194" stroke="#37474f" stroke-width="3"/><line x1="56" y1="206" x2="84" y2="206" stroke="#37474f" stroke-width="3" stroke-dasharray="5 3"/>`}${T(70, 248, s.vp + " V " + (s.ac ? "AC" : "DC"), { s: 14, c: "#37474f" })}`;
  const V = show ? vs(s) : 0, on = show && V >= 6, burst = show && V > 30;
  g += `<path d="M454,130 H530 V270 H454" fill="none" stroke="#455a64" stroke-width="3"/><g transform="translate(530,200)">${on && !burst ? `<circle r="32" fill="#fff59d" opacity=".8"/>` : ""}<circle r="18" fill="${burst ? "#bdbdbd" : on ? "#ffee58" : "#eceff1"}" stroke="#757575" stroke-width="2"/>${burst ? T(0, 6, "💥", { s: 18 }) : ""}</g>${T(530, 246, "6 V lamp", { s: 11, c: "#546e7a" })}`;
  return g;
}
function render(s) {
  const show = s.reveal;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  if (s.mode === "coil") {
    const V = volt(s);
    g += coilScene(s, show) + `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
      ${T(120, 84, "induced voltage", { s: 12, c: "#78909c" })}${T(120, 118, show ? (V > 0 ? "+" : "") + fmt(V) + " V" : "? V", { s: 26, c: "#e65100" })}
      ${T(120, 160, show ? (V > 0 ? "needle swings RIGHT →" : V < 0 ? "← needle swings LEFT" : "no current — nothing changes") : "press ▶ to move the magnet", { s: 13, c: show ? "#37474f" : "#90a4ae" })}
      ${show ? T(120, 200, Math.abs(V) >= BULB ? "💡 the bulb lights" : "bulb stays off (needs " + BULB + " V)", { s: 13, c: Math.abs(V) >= BULB ? "#2e7d32" : "#78909c" }) : ""}
      ${T(120, 260, "voltage = strength × speed", { s: 11, c: "#546e7a" })}${T(120, 276, "× turns ÷ 100", { s: 11, c: "#546e7a" })}${T(120, 296, "(strength: weak 1, medium 2, strong 3)", { s: 10, c: "#90a4ae" })}
      ${T(120, 366, "a CHANGING magnetic field", { s: 10, c: "#90a4ae" })}${T(120, 382, "makes a current flow", { s: 10, c: "#90a4ae" })}</g>`;
  } else {
    const V = vs(s);
    g += transScene(s, show) + `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
      ${T(120, 70, "input: " + s.vp + " V " + (s.ac ? "AC" : "DC"), { s: 14, c: "#37474f" })}${T(120, 96, "turns: " + s.np + " → " + s.ns, { s: 14, c: "#37474f" })}
      ${T(120, 142, "output voltage", { s: 12, c: "#78909c" })}${T(120, 174, show ? fmt(V) + " V" : "? V", { s: 26, c: "#e65100" })}
      ${show ? T(120, 210, !s.ac ? "DC does not change → no output" : s.ns > s.np ? "step-UP transformer" : s.ns < s.np ? "step-DOWN transformer" : "same voltage", { s: 13, c: "#37474f" }) + T(120, 240, V > 30 ? "💥 too much — the lamp blew!" : V >= 6 ? "💡 the lamp lights" : "lamp off", { s: 13, c: V > 30 ? "#c62828" : V >= 6 ? "#2e7d32" : "#78909c" }) : ""}
      ${T(120, 300, "output = input × Ns ÷ Np", { s: 12, c: "#546e7a" })}${T(120, 372, "only AC keeps changing,", { s: 10, c: "#90a4ae" })}${T(120, 388, "so only AC works", { s: 10, c: "#90a4ae" })}</g>`;
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null, C = s => s.mode !== "coil", Tr = s => s.mode !== "trans"; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Experiment", options: [{ v: "coil", label: "Magnet & coil" }, { v: "trans", label: "Transformer" }] }] : []),
  { id: "pole", type: "choice", label: "Magnet end facing the coil", options: [{ v: "N", label: "N pole" }, { v: "S", label: "S pole" }], hide: C, lock: lk("pole") },
  { id: "motion", type: "choice", label: "Movement", options: [{ v: "in", label: "Push in" }, { v: "out", label: "Pull out" }, { v: "still", label: "Hold still" }], hide: C, lock: lk("motion") },
  { id: "str", type: "choice", label: "Magnet", options: [1, 2, 3].map(v => ({ v, label: STR[v] })), hide: C, lock: lk("str") },
  { id: "speed", type: "range", label: "Speed", min: 0, max: 5, step: 1, nudge: 1, unit: "m/s", hide: C, lock: lk("speed") },
  { id: "turns", type: "choice", label: "Coil", options: [50, 100, 200, 400].map(v => ({ v, label: v + " turns" })), hide: C, lock: lk("turns") },
  { id: "vp", type: "choice", label: "Input voltage", options: [12, 24, 240].map(v => ({ v, label: v + " V" })), hide: Tr, lock: lk("vp") },
  { id: "np", type: "choice", label: "Primary turns (Np)", options: [100, 200, 500, 1000].map(v => ({ v, label: String(v) })), hide: Tr, lock: lk("np") },
  { id: "ns", type: "choice", label: "Secondary turns (Ns)", options: [50, 100, 200, 500, 1000, 2000].map(v => ({ v, label: String(v) })), hide: Tr, lock: lk("ns"), wide: true },
  { id: "ac", type: "toggle", label: "Use AC (alternating current)", hide: Tr, lock: lk("ac") }]; };
const st = o => Object.assign({ mode: "coil", pole: "N", motion: "in", str: 2, speed: 2, turns: 100, vp: 12, np: 200, ns: 200, ac: true }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const HINT = { coil: "Moving the magnet changes the magnetic field in the coil and makes a voltage. Reverse the pole OR the movement to reverse the needle. Stronger magnet, faster movement or more turns → bigger voltage.", trans: "Output voltage = input × secondary turns ÷ primary turns. More turns on the secondary steps the voltage UP. A transformer needs AC." };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "coil" ? "🧲 Induction challenge" : "⚡ Transformer challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: HINT[s0.mode] },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("in-sim", diff, uses, mk);
const said = s => `Meter: ${volt(s) > 0 ? "+" : ""}${fmt(volt(s))} V`;
const C = {
  right: () => simQ(1, "Push the magnet <b>into</b> the coil and make the needle swing to the <b>RIGHT</b>.", st({ pole: "S", motion: "out" }), s => ok(volt(s) > 0 && s.motion === "in", "N pole pushed in → needle right.", s.motion !== "in" ? "Push the magnet IN." : said(s) + " — swing the other way."), { pole: "N", motion: "in" }, { lock: ["str", "speed", "turns"], wrong: { pole: "S", motion: "in" } }),
  zero: () => simQ(1, "The magnet is <b>inside</b> the coil. Make the meter read <b>zero</b>.", st({ motion: "in", speed: 3 }), s => ok(volt(s) === 0, "No movement → no change in the field → no current.", said(s) + "."), { motion: "still" }, { lock: ["pole", "str", "turns"], wrong: { motion: "out" } }),
  outR: () => simQ(1, "Now you must <b>pull the magnet out</b>, but the needle must still swing <b>RIGHT</b>.", st({ pole: "N", motion: "out" }), s => ok(volt(s) > 0 && s.motion === "out", "S pole pulled out → needle right.", s.motion !== "out" ? "You must pull it OUT." : said(s) + " — change the pole."), { pole: "S" }, { lock: ["motion", "str", "speed", "turns"], wrong: { pole: "N" } }),
  biggest: () => simQ(1, "Make the <b>biggest voltage</b> you can.", st({ str: 1, speed: 1, turns: 50 }), s => ok(sizeV(s) === 60, "Strong magnet, 5 m/s and 400 turns: 3 × 5 × 400 ÷ 100 = 60 V.", `${fmt(sizeV(s))} V — it can be bigger.`), { str: 3, speed: 5, turns: 400, motion: "in" }, { lock: ["pole"], wrong: { str: 3, speed: 5, turns: 200, motion: "in" } }),
  v12: () => simQ(2, "With the <b>strong</b> magnet and <b>200 turns</b>, make exactly <b>12 V</b>.", st({ str: 3, turns: 200, speed: 1 }), s => ok(sizeV(s) === 12, "3 × 2 × 200 ÷ 100 = 12 V.", `${fmt(sizeV(s))} V.`), { speed: 2, motion: "in" }, { lock: ["str", "turns", "pole"], wrong: { speed: 3, motion: "in" } }),
  bulb: () => simQ(2, "Light the <b>6 V bulb</b> with the <b>weak</b> magnet moving at <b>2 m/s</b>. Choose the coil.", st({ str: 1, speed: 2, turns: 50 }), s => ok(sizeV(s) >= BULB, `${s.turns} turns: ${fmt(sizeV(s))} V — the bulb lights.`, `Only ${fmt(sizeV(s))} V — the bulb needs 6 V.`), { turns: 400 }, { lock: ["str", "speed", "pole", "motion"], wrong: { turns: 200 } }),
  double: () => simQ(2, "This gives 6 V. <b>Double</b> the voltage by changing <b>only the coil</b>.", st({ str: 2, speed: 3, turns: 100 }), s => ok(sizeV(s) === 12, "Twice the turns → twice the voltage.", `${fmt(sizeV(s))} V.`), { turns: 200 }, { lock: ["str", "speed", "pole", "motion"], wrong: { turns: 400 } }),
  v8: () => simQ(2, "With <b>100 turns</b>, make exactly <b>8 V</b>. Choose the magnet and the speed.", st({ turns: 100, str: 1, speed: 1 }), s => ok(sizeV(s) === 8, "Medium magnet at 4 m/s: 2 × 4 × 100 ÷ 100 = 8 V.", `${fmt(sizeV(s))} V.`), { str: 2, speed: 4, motion: "in" }, { lock: ["turns", "pole"], wrong: { str: 2, speed: 3, motion: "in" } }),
  charger: () => simQ(3, "A phone charger: step <b>240 V</b> mains down to <b>12 V</b>.", st({ mode: "trans", vp: 240, np: 200, ns: 200 }), s => ok(vs(s) === 12, "1000 → 50 turns: 240 × 50 ÷ 1000 = 12 V.", `Output: ${fmt(vs(s))} V.`), { np: 1000, ns: 50 }, { lock: ["vp", "ac"], wrong: { np: 500, ns: 50 } }),
  up24: () => simQ(3, "Step <b>12 V up to 24 V</b>.", st({ mode: "trans", vp: 12, np: 200, ns: 100 }), s => ok(vs(s) === 24, "Twice as many secondary turns → twice the voltage.", `Output: ${fmt(vs(s))} V.`), { np: 100, ns: 200 }, { lock: ["vp", "ac"], wrong: { np: 200, ns: 200 } }),
  acfix: () => simQ(3, "This transformer gives <b>0 V</b>. Fix it so the lamp lights.", st({ mode: "trans", vp: 24, np: 200, ns: 100, ac: false }), s => ok(s.ac && vs(s) >= 6, "With AC the field keeps changing, so the transformer works.", "DC makes a steady field — nothing is induced."), { ac: true }, { lock: ["vp", "np", "ns"], wrong: { ac: false } }),
  lamp6: () => simQ(3, "Light the <b>6 V lamp</b> from <b>24 V</b> without blowing it. The primary has <b>200 turns</b>.", st({ mode: "trans", vp: 24, np: 200, ns: 1000 }), s => ok(vs(s) === 6, "50 turns: 24 × 50 ÷ 200 = 6 V.", `Output: ${fmt(vs(s))} V.`), { ns: 50 }, { lock: ["vp", "np", "ac"], wrong: { ns: 100 } })
};
const D = {
  pick: diff => E.diaT("in-pick", diff, 2, () => {
    if (diff === 1) {
      const cases = E.shuffle([["N", "in"], ["S", "in"], ["N", "out"], ["S", "out"], ["N", "still"]]).slice(0, 4), want = choice(["right", "left"]);
      const ans = cases.map((c, i) => { const v = dirV(st({ pole: c[0], motion: c[1] })); return (want === "right" ? v > 0 : v < 0) ? "k" + i : null; }).filter(Boolean);
      if (!ans.length) cases[0] = want === "right" ? ["N", "in"] : ["S", "in"];
      const ans2 = cases.map((c, i) => { const v = dirV(st({ pole: c[0], motion: c[1] })); return (want === "right" ? v > 0 : v < 0) ? "k" + i : null; }).filter(Boolean);
      return { kind: "pick", many: true, title: "👆 Which way does it swing?", prompt: `“N pole pushed in” makes the needle swing RIGHT. Click <b>every</b> setup that makes it swing <b>${want.toUpperCase()}</b>.`, answer: ans2, names: Object.fromEntries(cases.map((c, i) => ["k" + i, c[0] + " pole, " + (c[1] === "still" ? "held still" : c[1] === "in" ? "pushed in" : "pulled out")])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${cases.map((c, i) => { const x = 15 + i * 212, f = c[0] === "N" ? "#e53935" : "#1e88e5", b = c[0] === "N" ? "#1e88e5" : "#e53935", d = c[1] === "in" ? 1 : -1; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${Array.from({ length: 6 }, (_, k) => `<ellipse cx="${x + 120 + k * 12}" cy="140" rx="5" ry="34" fill="none" stroke="#e67e22" stroke-width="3"/>`).join("")}<rect x="${x + 22}" y="124" width="36" height="32" fill="${b}"/><rect x="${x + 58}" y="124" width="36" height="32" fill="${f}"/>${T(x + 40, 146, c[0] === "N" ? "S" : "N", { s: 14, c: "#fff" })}${T(x + 76, 146, c[0], { s: 14, c: "#fff" })}
          ${c[1] === "still" ? T(x + 98, 210, "held still", { s: 14, c: "#78909c" }) : `<line x1="${x + 98 - d * 30}" y1="200" x2="${x + 98 + d * 30}" y2="200" stroke="#37474f" stroke-width="4"/><path d="M${x + 98 + d * 40},200 l${-d * 13},-8 v16Z" fill="#37474f"/>${T(x + 98, 236, c[1] === "in" ? "pushed in" : "pulled out", { s: 14, c: "#37474f" })}`}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Reversing the pole OR the movement reverses the current. Reversing both gives the same direction. No movement → no current.", summary: "Direction of induced current" };
    }
    const tr = E.shuffle([[200, 1000], [1000, 200], [500, 500], [100, 2000], [500, 100], [200, 500]]).slice(0, 4), want = choice(["up", "down"]);
    const fits = t => want === "up" ? t[1] > t[0] : t[1] < t[0];
    if (!tr.some(fits)) tr[Math.floor(Math.random() * 4)] = want === "up" ? [200, 1000] : [1000, 200];
    const ans = tr.map((t, i) => fits(t) ? "t" + i : null).filter(Boolean);
    return { kind: "pick", many: true, title: "👆 Step up or step down?", prompt: `Click <b>every</b> step-<b>${want.toUpperCase()}</b> transformer.`, answer: ans, names: Object.fromEntries(tr.map((t, i) => ["t" + i, t[0] + " → " + t[1] + " turns"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${tr.map((t, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="t${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><rect x="${x + 48}" y="70" width="100" height="120" fill="none" stroke="#78909c" stroke-width="14"/>${T(x + 48, 222, "Np " + t[0], { s: 14, c: "#e67e22" })}${T(x + 148, 222, "Ns " + t[1], { s: 14, c: "#8e24aa" })}${Array.from({ length: 5 }, (_, k) => `<ellipse cx="${x + 48}" cy="${86 + k * 22}" rx="16" ry="4" fill="none" stroke="#e67e22" stroke-width="3"/><ellipse cx="${x + 148}" cy="${86 + k * 22}" rx="16" ry="4" fill="none" stroke="#8e24aa" stroke-width="3"/>`).join("")}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["t" + i])}/></g>`; }).join("")}</svg>`,
      explain: "Step-up: more turns on the secondary (Ns > Np). Step-down: fewer (Ns < Np).", summary: "Step-up and step-down" };
  }),
  num: diff => E.diaT("in-num", diff, 2, () => {
    if (diff < 3) { const c = choice([[100, 3, 400], [200, 4, 100], [50, 2, 200], [400, 20, 100]]);
      return { kind: "num", title: "🧮 Coil turns", prompt: `A coil with <b>${c[0]} turns</b> gives <b>${c[1]} V</b>. The same magnet moves at the same speed into a coil with <b>${c[2]} turns</b>.`, visual: render(st({ turns: c[0], reveal: false })), fields: [{ label: "New voltage", unit: "V", answer: c[1] * c[2] / c[0] }], explain: `Voltage ∝ turns: ${c[1]} × ${c[2]} ÷ ${c[0]} = ${fmt(c[1] * c[2] / c[0])} V.`, summary: "Voltage and coil turns" }; }
    const c = choice([[240, 1000, 50], [12, 100, 500], [24, 200, 50], [240, 500, 100]]);
    return { kind: "num", title: "🧮 Transformer maths", prompt: `A transformer has <b>${c[1]}</b> primary turns and <b>${c[2]}</b> secondary turns. The input is <b>${c[0]} V AC</b>.`, visual: render(st({ mode: "trans", vp: c[0], np: c[1], ns: c[2] })), fields: [{ label: "Output voltage", unit: "V", answer: c[0] * c[2] / c[1] }], explain: `${c[0]} × ${c[2]} ÷ ${c[1]} = ${fmt(c[0] * c[2] / c[1])} V.`, summary: "Transformer equation" };
  }),
  mcq: diff => E.diaT("in-mcq", diff, 2, () => { const q = choice([
      { ask: "What makes a current flow in the coil?", ok: "A changing magnetic field through the coil", bad: ["Any magnet that is nearby, even if still", "Heating the coil", "Using a heavier coil"], ex: "Only a CHANGE in the field induces a voltage." },
      { ask: "Why does a transformer not work with a battery (DC)?", ok: "DC makes a steady field that does not change", bad: ["Batteries are too weak", "DC is too fast", "Iron blocks DC"], ex: "No change in field → nothing induced in the secondary." },
      { ask: "Power stations step the voltage UP before sending electricity far away because…", ok: "a high voltage means a smaller current, so less energy is wasted as heat", bad: ["it travels faster", "the wires are thinner", "homes need very high voltage"], ex: "Lower current → less heating in the cables." },
      { ask: "Which device uses electromagnetic induction to make electricity?", ok: "A generator (dynamo)", bad: ["A battery", "A solar cell", "A light bulb"], ex: "A generator spins a coil in a magnetic field." }]);
    return { kind: "mcq", title: "📘 Induction ideas", prompt: "Think about changing magnetic fields.", visual: render(st({ str: 3, speed: 3, turns: 200, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Induction concepts" }; })
};
const LEVELS = {
  1: { intro: "Moving a magnet in a coil makes a current. Reverse the pole or the movement to reverse it.", pool: () => [S(1, 1, C.right), S(2, 1, C.zero), S(2, 1, C.outR), S(3, 1, C.biggest), D.pick(1), D.mcq(1), D.num(2)] },
  2: { intro: "Bigger voltage: a stronger magnet, faster movement or more turns on the coil.", pool: () => [S(1, 1, C.double), S(2, 1, C.v12), S(2, 1, C.bulb), S(3, 1, C.v8), D.num(1), D.pick(1), D.mcq(3)] },
  3: { intro: "Transformers use induction to step AC voltages up or down.", pool: () => [S(1, 1, C.acfix), S(2, 1, C.up24), S(3, 1, C.lamp6), S(3, 1, C.charger), D.num(3), D.pick(2), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Move the magnet in and out of the coil, or try the transformer. Press ▶ to see the result.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Move",
  goals: () => [{ txt: "Make the needle swing both ways", test: (s, m) => m.r && m.l }, { txt: "Light the bulb with the magnet", test: (s, m) => m.b }, { txt: "Step a voltage up with the transformer", test: (s, m) => m.u }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "coil") { if (volt(s) > 0) m.r = 1; if (volt(s) < 0) m.l = 1; if (sizeV(s) >= BULB) m.b = 1; } else if (vs(s) > s.vp) m.u = 1; },
  facts: () => "📘 <b>Electromagnetic induction</b>: a changing magnetic field makes a voltage. Generators and transformers depend on it."
});
E.start({ labId: "induction", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧲", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧲", "⚡", "💡", "✨"],
  exploreDemo: () => [{ set: { mode: "coil", pole: "N", motion: "in", speed: 3 }, run: true }, { set: { mode: "coil", pole: "N", motion: "out" }, run: true }, { set: { mode: "trans", np: 100, ns: 500 }, run: true }] });
})();
