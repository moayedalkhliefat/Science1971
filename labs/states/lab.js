"use strict";
// ===== States of Matter — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SUB = {
  water: { name: "Water", f: "H₂O", mp: 0, bp: 100, c: "#1e88e5" },
  ethanol: { name: "Ethanol", f: "C₂H₅OH", mp: -114, bp: 78, c: "#8e24aa" },
  oxygen: { name: "Oxygen", f: "O₂", mp: -218, bp: -183, c: "#e53935" },
  nitrogen: { name: "Nitrogen", f: "N₂", mp: -210, bp: -196, c: "#546e7a" },
  bromine: { name: "Bromine", f: "Br₂", mp: -7, bp: 59, c: "#a1450f" }
};
const SUBS = Object.keys(SUB).map(k => ({ v: k, label: SUB[k].name }));
const TMIN = -250, TMAX = 150, K = c => c + 273;
function phase(s) { const d = SUB[s.sub]; return s.T < d.mp ? "solid" : s.T === d.mp ? "melting" : s.T < d.bp ? "liquid" : s.T === d.bp ? "boiling" : "gas"; }
const PH = { solid: "SOLID", melting: "MELTING · solid + liquid", liquid: "LIQUID", boiling: "BOILING · liquid + gas", gas: "GAS" };
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// box: x, y(top), w, h
function particles(s, box, n, small) {
  const d = SUB[s.sub], ph = phase(s), r = small ? 7 : 11, R = rnd(7 + (s.sub.length * 13)), tk = Math.max(5, K(s.T));
  const speed = Math.sqrt(tk / 273), bot = box.y + box.h - r - 3, sp = r * 2.35;
  const kind = i => ph === "solid" ? "s" : ph === "liquid" ? "l" : ph === "gas" ? "g" : ph === "melting" ? (i < 18 * n / 36 ? "s" : "l") : (i < n * 0.7 ? "l" : "g");
  const scols = 6, sx0 = ph === "melting" ? box.x + r + 6 : box.x + box.w / 2 - (scols - 1) * sp / 2;
  const lx0 = ph === "melting" ? sx0 + scols * sp + 4 : box.x + r + 4, lcols = Math.max(1, Math.floor((box.x + box.w - r - lx0) / (sp * 1.04)) + 1);
  let out = "", si = 0, li = 0;
  for (let i = 0; i < n; i++) {
    const k = kind(i);
    let x, y, pts, dur;
    if (k === "s") { const col = si % scols, row = Math.floor(si / scols); si++; x = sx0 + col * sp; y = bot - row * sp; const a = 0.8 + 2.4 * Math.min(1, tk / K(d.mp)); pts = [[x, y], [x + a, y - a], [x - a, y + a], [x, y]]; dur = 0.35; }
    else if (k === "l") { const col = li % lcols, row = Math.floor(li / lcols); li++; x = lx0 + col * sp * 1.04 + (R() - 0.5) * r * 0.8 + (row % 2) * r * 0.5; y = bot - row * sp * 0.92 - R() * r * 0.4;
      x = Math.min(box.x + box.w - r, x); const a = r * (0.45 + 0.2 * speed); pts = [[x, y]]; for (let j = 0; j < 3; j++) pts.push([Math.max(box.x + r, Math.min(box.x + box.w - r, x + (R() - 0.5) * 2 * a)), Math.min(bot, y + (R() - 0.5) * 2 * a)]); pts.push([x, y]); dur = 1.8 / speed; }
    else { pts = []; const top = ph === "boiling" ? box.y + box.h * 0.55 : box.y + box.h; for (let j = 0; j < 4; j++) pts.push([box.x + r + R() * (box.w - 2 * r), box.y + r + R() * (top - box.y - 2 * r)]); pts.push(pts[0]); [x, y] = pts[0]; dur = 5 / speed; }
    const b = (R() * dur).toFixed(2);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${d.c}" stroke="rgba(0,0,0,.25)" stroke-width="1.5">
      <animate attributeName="cx" values="${pts.map(p => p[0].toFixed(1)).join(";")}" dur="${dur.toFixed(2)}s" begin="-${b}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${pts.map(p => p[1].toFixed(1)).join(";")}" dur="${dur.toFixed(2)}s" begin="-${b}s" repeatCount="indefinite"/></circle>`;
  }
  return out;
}
function container(s, box, small) {
  return `<rect x="${box.x - 6}" y="${box.y - 6}" width="${box.w + 12}" height="${box.h + 12}" rx="${small ? 10 : 16}" fill="rgba(255,255,255,.75)" stroke="#5c6bc0" stroke-width="${small ? 3 : 5}"/>${particles(s, box, small ? 30 : 36, small)}`;
}
function render(s) {
  const d = SUB[s.sub], ph = phase(s), show = s.reveal || s.showVals, kel = s.lv >= 3;
  const box = { x: 120, y: 70, w: 380, h: 300 };
  const plate = s.T < 10 ? `hsl(205,80%,${Math.round(72 - 32 * Math.min(1, (10 - s.T) / 260))}%)` : s.T <= 30 ? "#b0bec5" : `hsl(${Math.round(35 - 30 * Math.min(1, (s.T - 30) / 120))},85%,55%)`;
  // thermometer
  const ty = t => 380 - (t - TMIN) / (TMAX - TMIN) * 300, tx = 580;
  const mark = (t, lbl, c) => `<line x1="${tx - 16}" x2="${tx + 16}" y1="${ty(t)}" y2="${ty(t)}" stroke="${c}" stroke-width="2" stroke-dasharray="4 3"/>${T(tx + 22, ty(t) + 5, lbl, { a: "start", s: 12, c })}`;
  const tlab = kel ? `${K(s.T)} K` : `${s.T} °C`;
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="450" fill="#f6f5ff"/>
    ${T(310, 40, show ? PH[ph] : "State: ?  (look at the particles)", { s: 20, c: show ? "#4527a0" : "#7e7aa8" })}
    ${container(s, box)}
    <rect x="110" y="392" width="400" height="22" rx="8" fill="${plate}"/>${T(310, 436, s.T > 30 ? "🔥 heating" : s.T < 10 ? "❄ cooling" : "room temperature", { s: 13, c: "#5e5a85" })}
    <rect x="${tx - 9}" y="70" width="18" height="312" rx="9" fill="#fff" stroke="#9e9ac8" stroke-width="2"/>
    <rect x="${tx - 5}" y="${ty(s.T)}" width="10" height="${384 - ty(s.T)}" fill="#e53935"/><circle cx="${tx}" cy="398" r="16" fill="#e53935" stroke="#9e9ac8" stroke-width="2"/>
    ${mark(d.mp, (kel ? "mp " + K(d.mp) + " K" : "mp " + d.mp + " °C"), "#1565c0")}${mark(d.bp, (kel ? "bp " + K(d.bp) + " K" : "bp " + d.bp + " °C"), "#c62828")}
    ${T(tx, 56, tlab, { s: 18, c: "#b71c1c" })}${kel ? T(tx, 434, s.T + " °C", { s: 12, c: "#5e5a85" }) : ""}
    <g transform="translate(660,70)"><rect width="128" height="150" rx="12" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>
      <circle cx="64" cy="30" r="14" fill="${d.c}"/>${T(64, 66, d.name, { s: 16, c: "#311b92" })}${T(64, 86, d.f, { s: 14, c: "#5e5a85" })}
      ${T(64, 112, "melts " + (kel ? K(d.mp) + " K" : d.mp + " °C"), { s: 13, c: "#1565c0" })}${T(64, 134, "boils " + (kel ? K(d.bp) + " K" : d.bp + " °C"), { s: 13, c: "#c62828" })}</g>
    ${show ? `<g transform="translate(660,240)"><rect width="128" height="74" rx="12" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(64, 26, "particle speed", { s: 12, c: "#5e5a85" })}
      <rect x="14" y="40" width="100" height="14" rx="7" fill="#ede7f6"/><rect x="14" y="40" width="${Math.min(100, 100 * Math.sqrt(Math.max(5, K(s.T)) / 423)).toFixed(0)}" height="14" rx="7" fill="#7e57c2"/></g>` : ""}</svg>`;
}
const ctls = (lv, o) => { o = o || {}; const L = o.lv || lv, lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "sub", type: "choice", label: "Substance", options: SUBS, hide: () => L < 2, lock: lk("sub") },
  { id: "T", type: "range", label: "Temperature", min: TMIN, max: TMAX, step: 1, nudge: 1, nudgeLabels: ["❄ −1", "🔥 +1"], fmt: v => L >= 3 ? `${v} °C = ${v + 273}` : v, unit: L >= 3 ? "K" : "°C", lock: lk("T") }
]; };
const st = (lv, o) => Object.assign({ sub: "water", T: 20, lv }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `${SUB[s.sub].name} at ${s.T} °C${s.lv >= 3 ? " (" + K(s.T) + " K)" : ""} is ${PH[phase(s)].toLowerCase()}`;
const simQ = (goal, s0, check, sol, o) => ({ title: "🧊 States challenge", prompt: "Change the temperature (and substance), watch the particles, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(s0.lv, o), render, run, check, hint: "Below the melting point → solid. Between the melting and boiling points → liquid. Above the boiling point → gas. Exactly at mp or bp, two states exist together. K = °C + 273." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("state-sim", diff, uses, mk);
const isP = (s, p) => phase(s) === p;
const C = {
  gas: () => simQ("Turn the water into a <b>gas</b> (steam).", st(1), s => ok(isP(s, "gas"), said(s) + ".", said(s) + " — heat it above 100 °C."), { T: 120 }, { wrong: { T: 80 } }),
  solid: () => simQ("Freeze the water into <b>ice</b> (solid).", st(1), s => ok(isP(s, "solid"), said(s) + ": particles vibrate in fixed places.", said(s) + "."), { T: -20 }, { wrong: { T: 10 } }),
  hot: () => simQ("Make the water a <b>liquid</b> at a temperature <b>above 50 °C</b>.", st(1), s => ok(isP(s, "liquid") && s.T > 50, said(s) + ".", s.T <= 50 ? "The temperature must be above 50 °C." : said(s) + "."), { T: 70 }, { wrong: { T: 105 } }),
  melt: () => simQ("Set the temperature where ice is <b>melting</b> (solid and liquid together).", st(1, { T: 10 }), s => ok(isP(s, "melting"), "0 °C is the melting point of water.", said(s) + "."), { T: 0 }, { wrong: { T: 1 } }),
  boil: () => simQ("Make the water <b>boil</b> (liquid and gas together).", st(1, { T: 60 }), s => ok(isP(s, "boiling"), "100 °C is the boiling point of water.", said(s) + "."), { T: 100 }, { wrong: { T: 99 } }),
  coldest: () => simQ("Make the <b>coldest</b> liquid water you can (whole degrees, not melting).", st(1, { T: 30 }), s => ok(s.T === 1, "1 °C: just above the melting point.", isP(s, "liquid") ? `${s.T} °C is liquid, but it can be colder.` : said(s) + "."), { T: 1 }, { wrong: { T: 0 } }),
  pickGas: () => simQ("The room is at <b>20 °C</b>. Choose a substance that is a <b>gas</b> at this temperature.", st(2, { T: 20 }), s => ok(isP(s, "gas"), said(s) + ": 20 °C is above its boiling point.", said(s) + "."), { sub: "oxygen" }, { lock: ["T"], wrong: { sub: "bromine" } }),
  pickLiq: () => simQ("The temperature is <b>90 °C</b>. Choose a substance that is a <b>liquid</b>.", st(2, { T: 90, sub: "oxygen" }), s => ok(isP(s, "liquid"), said(s) + ".", said(s) + "."), { sub: "water" }, { lock: ["T"], wrong: { sub: "ethanol" } }),
  ethBoil: () => simQ("Make <b>ethanol boil</b>.", st(2, { sub: "ethanol" }), s => ok(isP(s, "boiling"), "Ethanol boils at 78 °C.", said(s) + "."), { T: 78 }, { lock: ["sub"], wrong: { T: 100 } }),
  brMelt: () => simQ("Set <b>bromine</b> to its <b>melting point</b>.", st(2, { sub: "bromine" }), s => ok(isP(s, "melting"), "Bromine melts at −7 °C.", said(s) + "."), { T: -7 }, { lock: ["sub"], wrong: { T: 0 } }),
  o2Liq: () => simQ("Oxygen is a gas at 20 °C. <b>Cool it</b> until it becomes a <b>liquid</b>.", st(2, { sub: "oxygen" }), s => ok(isP(s, "liquid"), said(s) + ".", said(s) + "."), { T: -200 }, { lock: ["sub"], wrong: { T: -150 } }),
  n2Solid: () => simQ("Make <b>nitrogen</b> a <b>solid</b>.", st(2, { sub: "nitrogen" }), s => ok(isP(s, "solid"), said(s) + ".", said(s) + "."), { T: -220 }, { lock: ["sub"], wrong: { T: -200 } }),
  warmSolid: () => simQ("Choose a substance and a temperature so it is a <b>solid</b> at a temperature <b>above −10 °C</b>.", st(2, { sub: "oxygen" }), s => ok(isP(s, "solid") && s.T > -10, said(s) + ".", s.T <= -10 ? "The temperature must be above −10 °C." : said(s) + "."), { sub: "water", T: -5 }, { wrong: { sub: "ethanol", T: -5 } }),
  setK: () => { const X = choice([300, 250, 373, 200, 310]);
    return simQ(`Set the temperature to exactly <b>${X} K</b>.`, st(3), s => ok(K(s.T) === X, `${s.T} °C + 273 = ${X} K.`, `${s.T} °C = ${K(s.T)} K, not ${X} K.`), { T: X - 273 }, { wrong: { T: X - 272 } }); },
  n2BoilK: () => simQ("Make <b>nitrogen boil</b>. (Its boiling point is shown in kelvin.)", st(3, { sub: "nitrogen" }), s => ok(isP(s, "boiling"), "77 K = −196 °C.", said(s) + "."), { T: -196 }, { lock: ["sub"], wrong: { T: -183 } }),
  o2SolidK: () => simQ("Make <b>oxygen a solid</b> at a temperature <b>above 40 K</b>.", st(3, { sub: "oxygen" }), s => ok(isP(s, "solid") && K(s.T) > 40, said(s) + ".", K(s.T) <= 40 ? "The temperature must be above 40 K." : said(s) + "."), { T: -225 }, { lock: ["sub"], wrong: { T: -215 } }),
  ethGasK: () => simQ("Make <b>ethanol a gas</b> at a temperature <b>below 360 K</b>.", st(3, { sub: "ethanol" }), s => ok(isP(s, "gas") && K(s.T) < 360, said(s) + ".", K(s.T) >= 360 ? "The temperature must be below 360 K." : said(s) + "."), { T: 80 }, { lock: ["sub"], wrong: { T: 90 } }),
  bodyK: () => simQ("Body temperature is <b>310 K</b>. Set water to body temperature. What state is it?", st(3), s => ok(K(s.T) === 310 && s.sub === "water", "310 K = 37 °C → liquid water.", `${K(s.T)} K is not 310 K.`), { T: 37 }, { lock: ["sub"], wrong: { T: 310 - 300 } }),
  brBoilK: () => simQ("Set <b>bromine</b> to the temperature where it <b>boils</b>.", st(3, { sub: "bromine" }), s => ok(isP(s, "boiling"), "Bromine boils at 332 K (59 °C).", said(s) + "."), { T: 59 }, { lock: ["sub"], wrong: { T: 60 } })
};

// ---------- diagram tasks ----------
const D = {
  pickState: diff => E.diaT("state-pick", diff, 1, () => { const order = E.shuffle(["solid", "liquid", "gas"]), temps = { solid: -30, liquid: 40, gas: 130 };
    const ask = choice(["solid", "liquid", "gas"]);
    return { kind: "pick", title: "👆 Identify the state", prompt: `These are particle pictures of water. Click the <b>${ask.toUpperCase()}</b>.`, answer: [ask], names: { solid: "the solid", liquid: "the liquid", gas: "the gas" },
      visual: st => `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="260" fill="#f6f5ff"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${8 + i * 245}" y="8" width="234" height="244" rx="14" fill="#fff" ${E.ring(st[k])}/>${container({ sub: "water", T: temps[k] }, { x: 34 + i * 245, y: 30, w: 182, h: 180 }, true)}${T(125 + i * 245, 240, "Sample " + (i + 1), { s: 15 })}</g>`).join("")}</svg>`,
      explain: "Solid: particles packed in a regular pattern, vibrating. Liquid: close together but moving past each other. Gas: far apart, moving fast in all directions.", summary: "Identify solid / liquid / gas" }; }),
  table: diff => E.diaT("state-mcq", diff, 2, () => { const q = choice([{ t: -100, a: "ethanol" }, { t: 90, a: "water" }, { t: -190, a: "oxygen" }]);
    const ks = Object.keys(SUB);
    const vis = `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#fff"/>
      <rect x="60" y="20" width="620" height="44" rx="8" fill="#4527a0"/>${T(170, 48, "Substance", { s: 16, c: "#fff" })}${T(380, 48, "Melting point", { s: 16, c: "#fff" })}${T(560, 48, "Boiling point", { s: 16, c: "#fff" })}
      ${ks.map((k, i) => `<rect x="60" y="${68 + i * 40}" width="620" height="38" fill="${i % 2 ? "#f6f5ff" : "#fff"}"/><circle cx="90" cy="${87 + i * 40}" r="9" fill="${SUB[k].c}"/>${T(180, 93 + i * 40, SUB[k].name + " (" + SUB[k].f + ")", { s: 15 })}${T(380, 93 + i * 40, SUB[k].mp + " °C", { s: 15 })}${T(560, 93 + i * 40, SUB[k].bp + " °C", { s: 15 })}`).join("")}</svg>`;
    return { kind: "mcq", title: "📋 Use the data table", prompt: "Melting and boiling points of five substances.", visual: vis, ask: `Which substance is a <b>liquid</b> at <b>${q.t} °C</b>?`,
      options: E.mkOptions(SUB[q.a].name, ks.filter(k => k !== q.a).slice(0, 3).map(k => SUB[k].name)),
      explain: `A substance is liquid when mp < T < bp. ${SUB[q.a].name}: ${SUB[q.a].mp} °C < ${q.t} °C < ${SUB[q.a].bp} °C.`, summary: "Read melting/boiling point table" }; }),
  kelvin: diff => E.diaT("state-num", diff, 2, () => { const c = choice([{ C: 25, K2: 77 }, { C: -40, K2: 373 }, { C: 100, K2: 54 }, { C: -196, K2: 300 }]);
    const vis = `<svg viewBox="0 0 740 240" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="240" fill="#fff"/>
      ${[["°C", 230, -273, 150], ["K", 510, 0, 423]].map(([u, x, a, b]) => `<rect x="${x - 12}" y="30" width="24" height="170" rx="12" fill="#fff" stroke="#9e9ac8" stroke-width="2"/>${T(x, 222, u, { s: 18, c: "#311b92" })}${[0, 0.25, 0.5, 0.75, 1].map(f => `<line x1="${x + 12}" x2="${x + 24}" y1="${200 - f * 170}" y2="${200 - f * 170}" stroke="#9e9ac8"/>${T(x + 30, 205 - f * 170, Math.round(a + f * (b - a)), { a: "start", s: 12, c: "#5e5a85" })}`).join("")}`).join("")}
      ${T(370, 110, "K = °C + 273", { s: 22, c: "#4527a0" })}</svg>`;
    return { kind: "num", title: "🌡️ Celsius and Kelvin", prompt: "Use the two temperature scales.", visual: vis,
      fields: [{ label: `${c.C} °C in kelvin`, unit: "K", answer: c.C + 273 }, { label: `${c.K2} K in Celsius`, unit: "°C", answer: c.K2 - 273 }], explain: `${c.C} + 273 = ${c.C + 273} K; ${c.K2} − 273 = ${c.K2 - 273} °C.`, summary: "Convert °C ↔ K" }; }),
  curve: diff => E.diaT("state-pick", diff, 3, () => {
    const P = [[80, 230], [180, 170], [300, 170], [400, 90], [560, 90], [660, 40]], segs = ["A", "B", "C", "D", "E"];
    const what = { A: "heating the solid", B: "melting", C: "heating the liquid", D: "boiling", E: "heating the gas" };
    const ask = choice([["B", "Click the part of the heating curve where the substance is <b>melting</b>."], ["D", "Click the part where the substance is <b>boiling</b>."], ["C", "Click the part where only the <b>liquid</b> is being heated."], ["E", "Click the part where only the <b>gas</b> is being heated."]]);
    return { kind: "pick", title: "📈 Heating curve", prompt: ask[1] + " (Heat is added at a steady rate.)", answer: [ask[0]], names: what,
      visual: st => `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#fff"/><line x1="60" y1="250" x2="700" y2="250" stroke="#263238" stroke-width="2"/><line x1="60" y1="250" x2="60" y2="20" stroke="#263238" stroke-width="2"/>
        ${T(380, 274, "time (heat added) →", { s: 13 })}${T(70, 18, "temperature ↑", { a: "start", s: 13 })}
        ${segs.map((k, i) => { const [x1, y1] = P[i], [x2, y2] = P[i + 1]; return `<g class="pk" data-k="${k}"><rect x="${Math.min(x1, x2) - 6}" y="${Math.min(y1, y2) - 22}" width="${Math.abs(x2 - x1) + 12}" height="${Math.abs(y2 - y1) + 44}" rx="10" fill="rgba(103,58,183,.04)" ${E.ring(st[k])}/>
          <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#7e57c2" stroke-width="6" stroke-linecap="round"/>${T((x1 + x2) / 2, (y1 + y2) / 2 - 30 < 14 ? (y1 + y2) / 2 + 40 : (y1 + y2) / 2 - 30, k, { s: 18, c: "#311b92" })}</g>`; }).join("")}</svg>`,
      explain: "Sloping parts: one state is warming up. Flat parts: the state is changing (melting at B, boiling at D) — the energy breaks the bonds between particles, so the temperature stays the same.", summary: "Read a heating curve" }; }),
  why: diff => E.diaT("state-mcq", diff, 1, () => { const q = choice([
      { s: { sub: "water", T: 0, showVals: true }, ask: "Ice is melting at 0 °C while heat is still added. Why does the temperature not rise?", ok: "The energy is used to break the bonds between particles", bad: ["The thermometer is broken", "Ice cannot absorb heat", "The particles stop moving"], ex: "During a change of state the added energy separates the particles instead of making them move faster." },
      { s: { sub: "water", T: 130, showVals: true }, ask: "What happens to the particles when a gas is heated more?", ok: "They move faster and spread out more", bad: ["They get bigger", "They stop moving", "They join into a solid"], ex: "Heating gives particles more kinetic energy: they move faster. The particles themselves do not get bigger." },
      { s: { sub: "bromine", T: 20, showVals: true }, ask: "Which describes the particles in this liquid?", ok: "Close together, but able to slide past each other", bad: ["Far apart and moving very fast", "Fixed in a regular pattern", "Not moving at all"], ex: "In a liquid the particles touch but can move around each other, so a liquid flows and takes the shape of its container." }]);
    return { kind: "mcq", title: "🔬 Particles", prompt: "Look at the particle model.", visual: render(st(2, q.s)), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Particle model" }; })
};
const LEVELS = {
  1: { intro: "Water as a solid, liquid and gas: heat it and cool it, and watch how the particles move.", pool: () => [S(1, 1, C.gas), S(1, 1, C.solid), S(2, 1, C.hot), S(2, 1, C.melt), S(3, 1, C.boil), S(3, 1, C.coldest), D.pickState(1), D.why(2), D.curve(3)] },
  2: { intro: "Different substances melt and boil at different temperatures.", pool: () => [S(1, 1, C.pickGas), S(1, 1, C.n2Solid), S(2, 1, C.ethBoil), S(2, 1, C.o2Liq), S(3, 1, C.brMelt), S(3, 1, C.warmSolid), S(2, 1, C.pickLiq), D.pickState(1), D.table(2), D.curve(3)] },
  3: { intro: "The Kelvin scale: K = °C + 273. 0 K is absolute zero, where particles have the least energy.", pool: () => [S(1, 1, C.setK), S(2, 1, C.n2BoilK), S(2, 1, C.bodyK), S(3, 1, C.o2SolidK), S(3, 1, C.ethGasK), S(3, 1, C.brBoilK), D.why(1), D.kelvin(2), D.curve(3)] }
};
const explore = E.exploreSim({
  intro: "Heat and cool the substance with the slider (or the ❄ / 🔥 buttons). Watch the particles and the thermometer.",
  state: lv => st(lv, { showVals: true }), controls: lv => ctls(lv), render,
  goals: lv => [
    { txt: "Make a solid", test: (s, m) => m.solid },
    { txt: "Make a liquid", test: (s, m) => m.liquid },
    { txt: "Make a gas", test: (s, m) => m.gas },
    { txt: "Find a temperature where two states exist together", test: (s, m) => m.two }
  ].concat(lv >= 2 ? [{ txt: "Try 3 different substances", test: (s, m) => (m.subs || new Set()).size >= 3 }] : []),
  track: (s, m) => { const p = phase(s); m[p] = 1; if (p === "melting" || p === "boiling") m.two = 1; (m.subs = m.subs || new Set()).add(s.sub); },
  facts: lv => "📘 <b>Solid</b>: particles vibrate in fixed places. <b>Liquid</b>: close but sliding past each other. <b>Gas</b>: far apart, moving fast. Heating gives the particles more energy." + (lv >= 3 ? " <b>K = °C + 273</b>." : "")
});
E.start({ labId: "states", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧊", "💧", "☁️", "✨"],
  exploreDemo: lv => [{ set: { T: -40 } }, { set: { T: 50 } }, { set: { T: 120 } }, { set: { T: 100 } }].concat(lv >= 2 ? [{ set: { sub: "ethanol" } }, { set: { sub: "oxygen" } }] : []) });
})();
