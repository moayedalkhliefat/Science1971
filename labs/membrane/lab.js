"use strict";
// ===== Membrane Transport — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const CX = 330, CY = 228, RX = 205, RY = 150;
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function spots(n, inside, seed) { const R = rnd(seed), out = []; let guard = 0;
  while (out.length < n && guard++ < 5000) { const x = 20 + R() * 600, y = 20 + R() * 410, d = Math.pow((x - CX) / RX, 2) + Math.pow((y - CY) / RY, 2);
    if (inside ? d < 0.72 : d > 1.25 && x < 620) { if (out.every(p => Math.hypot(p[0] - x, p[1] - y) > 22)) out.push([x, y]); } }
  return out; }
const o2 = ([x, y]) => `<g transform="translate(${x},${y})"><circle cx="-5" r="7" fill="#e53935"/><circle cx="5" r="7" fill="#e53935" stroke="#b71c1c" stroke-width="1"/></g>`;
const glu = ([x, y]) => `<polygon points="${[0, 1, 2, 3, 4, 5].map(i => `${x + 10 * Math.cos(i * Math.PI / 3)},${y + 10 * Math.sin(i * Math.PI / 3)}`).join(" ")}" fill="#fbc02d" stroke="#f57f17" stroke-width="1.5"/>`;
const ion = (c, t) => ([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${c}"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${t}</text>`;
const na = ion("#7e57c2", "Na⁺"), kk = ion("#2e7d32", "K⁺");
function membrane(extra) {
  let heads = ""; for (let i = 0; i < 72; i++) { const a = i / 72 * 2 * Math.PI; heads += `<circle cx="${CX + (RX + 7) * Math.cos(a)}" cy="${CY + (RY + 7) * Math.sin(a)}" r="4.2" fill="#f4a261"/><circle cx="${CX + (RX - 7) * Math.cos(a)}" cy="${CY + (RY - 7) * Math.sin(a)}" r="4.2" fill="#f4a261"/>`; }
  return `<ellipse cx="${CX}" cy="${CY}" rx="${RX}" ry="${RY}" fill="none" stroke="#ffe0b2" stroke-width="12"/>${heads}${extra || ""}`;
}
const protein = (a, col, label, open) => { const x = CX + RX * Math.cos(a), y = CY + RY * Math.sin(a), deg = a * 180 / Math.PI + 90;
  return `<g transform="translate(${x},${y}) rotate(${deg})"><rect x="-17" y="-16" width="12" height="32" rx="5" fill="${col}"/><rect x="5" y="-16" width="12" height="32" rx="5" fill="${col}"/>${open ? "" : `<rect x="-5" y="-6" width="10" height="12" fill="${col}"/>`}</g>${label ? T(x + 34 * Math.cos(a), y + 34 * Math.sin(a) + 4, label, { s: 11, c: col }) : ""}`; };
// ----- level 1: diffusion -----
const diffEnd = s => { const o = (s.oIn + s.oOut) / 2, g = s.chan ? (s.gIn + s.gOut) / 2 : s.gIn; return { oIn: o, oOut: o, gIn: g, gOut: s.chan ? g : s.gOut }; };
// ----- level 2: osmosis -----
const SOLS = [0, 0.3, 0.9, 3, 10];
const OSMO = { rbc: { 0: [null, "BURSTS (lysis)"], 0.3: [20, "swells"], 0.9: [0, "normal (no net water movement)"], 3: [-15, "shrinks"], 10: [-35, "shrinks a lot (crenated)"] },
  plant: { 0: [10, "TURGID (firm)"], 0.3: [6, "turgid"], 0.9: [0, "flaccid (no net water movement)"], 3: [-12, "starts to plasmolyse"], 10: [-25, "fully PLASMOLYSED"] } };
const osmoRes = s => OSMO[s.cell][s.sol];
const water = s => s.sol < 0.9 ? "in" : s.sol > 0.9 ? "out" : "none";
// ----- level 3: active transport -----
function actEnd(s) { let nI = s.naIn, nO = 12 - s.naIn, kI = s.kIn, kO = 10 - s.kIn, used = 0;
  for (let i = 0; i < s.atp; i++) { if (nI < 3 || kO < 2) break; nI -= 3; nO += 3; kI += 2; kO -= 2; used++; }
  if (s.chan) { const t = nI + nO; nI = t / 2; nO = t / 2; }
  return { naIn: nI, naOut: nO, kIn: kI, kOut: kO, used }; }
function render(s) {
  const show = s.reveal || s.showVals; let g = "", panel = "";
  if (s.mode === "diff") {
    const e = show && s.reveal ? diffEnd(s) : { oIn: s.oIn, oOut: s.oOut, gIn: s.gIn, gOut: s.gOut };
    g = membrane(s.chan ? protein(-0.5, "#0277bd", "glucose channel", true) + protein(2.6, "#0277bd", "", true) : "");
    g += spots(e.oIn, true, 3).map(o2).join("") + spots(e.oOut, false, 5).map(o2).join("") + spots(e.gIn, true, 7).map(glu).join("") + spots(e.gOut, false, 11).map(glu).join("");
    const row = (lbl, a, b, icon) => `<g>${icon}${T(52, 0, lbl, { a: "start", s: 13, c: "#4a148c" })}${T(138, 0, a, { s: 15, c: "#ad1457" })}${T(182, 0, b, { s: 15, c: "#ad1457" })}</g>`;
    panel = `<rect width="210" height="${s.reveal ? 170 : 130}" rx="12" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${T(105, 22, s.reveal ? "AFTER diffusion" : "START", { s: 12, c: "#ad1457" })}${T(138, 44, "in", { s: 11, c: "#8e6a85" })}${T(182, 44, "out", { s: 11, c: "#8e6a85" })}
      <g transform="translate(0,70)">${row("O₂", e.oIn, e.oOut, o2([28, -5]))}</g><g transform="translate(0,104)">${row("glucose", e.gIn, e.gOut, glu([28, -5]))}</g>
      ${s.reveal ? T(105, 136, `O₂ moved ${s.oIn > s.oOut ? "OUT" : s.oIn < s.oOut ? "IN" : "—"}`, { s: 12, c: "#2e7d32" }) + T(105, 156, `glucose ${!s.chan ? "could not cross" : s.gIn > s.gOut ? "moved OUT" : s.gIn < s.gOut ? "moved IN" : "—"}`, { s: 12, c: "#2e7d32" }) : ""}`;
  } else if (s.mode === "osmo") {
    const r = osmoRes(s), done = s.reveal, wd = water(s), conc = s.sol, k = done ? (r[0] == null ? 1.25 : 1 + r[0] / 100) : 1;
    let dots = ""; const n = Math.round(conc * 6), R = rnd(17); for (let i = 0; i < n; i++) dots += `<circle cx="${30 + R() * 580}" cy="${30 + R() * 390}" r="3" fill="#90a4ae"/>`;
    g = `<rect x="10" y="10" width="610" height="430" rx="16" fill="rgba(178,235,242,${0.25 + conc * 0.03})" stroke="#4fc3f7" stroke-width="2"/>${dots}`;
    if (s.cell === "rbc") { if (done && r[0] == null) g += `<g fill="#e57373" opacity=".75">${[0, 1, 2, 3, 4, 5, 6].map(i => `<path transform="translate(${CX + 120 * Math.cos(i)},${CY + 90 * Math.sin(i)}) rotate(${i * 50})" d="M-30,0 Q-10,-22 24,-8 Q12,14 -30,0 Z"/>`).join("")}</g>${T(CX, CY, "💥 the cell burst", { s: 20, c: "#b71c1c" })}`;
      else { const rx = 150 * k, ry = 150 * (k < 1 ? k * 0.95 : k), crenate = done && r[0] < 0; let path = "";
        if (crenate) { const pts = []; for (let i = 0; i < 36; i++) { const a = i / 36 * 2 * Math.PI, rr = 1 + (i % 2 ? (r[0] < -20 ? 0.12 : 0.07) : 0); pts.push(`${CX + rx * rr * Math.cos(a)},${CY + ry * rr * Math.sin(a)}`); } path = `<polygon points="${pts.join(" ")}" fill="#e53935" stroke="#b71c1c" stroke-width="3"/>`; }
        else path = `<ellipse cx="${CX}" cy="${CY}" rx="${rx}" ry="${ry}" fill="#e53935" stroke="#b71c1c" stroke-width="3"/>`;
        g += path + (k <= 1.01 ? `<ellipse cx="${CX}" cy="${CY}" rx="${rx * 0.45}" ry="${ry * 0.45}" fill="#ef9a9a" opacity=".8"/>` : ""); } }
    else { const wall = `<rect x="${CX - 170}" y="${CY - 130}" width="340" height="260" rx="14" fill="#f1f8e9" stroke="#7cb342" stroke-width="12"/>`;
      const sh = done ? (r[0] >= 0 ? 1 : r[0] > -20 ? 0.82 : 0.6) : 0.97, w = 320 * sh, h = 240 * sh;
      g += wall + `<rect x="${CX - w / 2}" y="${CY - h / 2}" width="${w}" height="${h}" rx="${40 * sh}" fill="#c5e1a5" stroke="#558b2f" stroke-width="3"/><rect x="${CX - w * 0.3}" y="${CY - h * 0.3}" width="${w * 0.6}" height="${h * 0.6}" rx="30" fill="#b3e5fc" stroke="#4fc3f7" stroke-width="2"/>${[[-0.38, -0.3], [0.38, 0.32], [-0.36, 0.3], [0.36, -0.32]].map(([a, b]) => `<ellipse cx="${CX + a * w}" cy="${CY + b * h}" rx="10" ry="6" fill="#43a047"/>`).join("")}`; }
    if (done && wd !== "none") for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * Math.PI + 0.3, x1 = CX + 230 * Math.cos(a), y1 = CY + 190 * Math.sin(a), x2 = CX + 175 * Math.cos(a), y2 = CY + 145 * Math.sin(a);
      const [ax, ay, bx, by] = wd === "in" ? [x1, y1, x2, y2] : [x2, y2, x1, y1]; g += `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="#0288d1" stroke-width="4"/><circle cx="${bx}" cy="${by}" r="5" fill="#0288d1"/>`; }
    panel = `<rect width="210" height="190" rx="12" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${T(105, 24, s.cell === "rbc" ? "Red blood cell" : "Plant cell", { s: 14, c: "#4a148c" })}${T(105, 48, "inside: 0.9% salt", { s: 12, c: "#6a1b4d" })}${T(105, 70, "outside: " + conc + "% salt", { s: 12, c: "#6a1b4d" })}
      ${done ? T(105, 104, "water moves " + (wd === "in" ? "IN" : wd === "out" ? "OUT" : "— (balanced)"), { s: 13, c: "#0277bd" }) + T(105, 130, r[0] == null ? "mass: —" : "mass change: " + (r[0] > 0 ? "+" : "") + r[0] + "%", { s: 13, c: "#ad1457" }) + T(105, 158, r[1], { s: 12, c: "#2e7d32" }) : T(105, 120, "press ▶ to wait 30 minutes", { s: 12, c: "#8e6a85" })}`;
  } else {
    const e = s.reveal ? actEnd(s) : { naIn: s.naIn, naOut: 12 - s.naIn, kIn: s.kIn, kOut: 10 - s.kIn, used: 0 };
    g = membrane(protein(-0.9, "#6a1b9a", "Na⁺/K⁺ pump", false) + protein(2.2, "#6a1b9a", "pump", false) + protein(0.9, "#0277bd", s.chan ? "Na⁺ channel OPEN" : "Na⁺ channel closed", s.chan));
    g += spots(e.naIn, true, 23).map(na).join("") + spots(e.naOut, false, 29).map(na).join("") + spots(e.kIn, true, 31).map(kk).join("") + spots(e.kOut, false, 37).map(kk).join("");
    for (let i = 0; i < s.atp; i++) g += `<g transform="translate(${CX - 70 + (i % 3) * 30},${CY + 70 + Math.floor(i / 3) * 26})"><rect x="-13" y="-9" width="26" height="18" rx="5" fill="${s.reveal && i < e.used ? "#cfd8dc" : "#ffca28"}" stroke="#f57f17"/>${T(0, 4, s.reveal && i < e.used ? "ADP" : "ATP", { s: 8, c: "#5d4037" })}</g>`;
    panel = `<rect width="210" height="176" rx="12" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${T(105, 22, s.reveal ? "AFTER" : "START", { s: 12, c: "#ad1457" })}${T(138, 44, "in", { s: 11, c: "#8e6a85" })}${T(182, 44, "out", { s: 11, c: "#8e6a85" })}
      ${[["Na⁺", e.naIn, e.naOut, na([28, 66])], ["K⁺", e.kIn, e.kOut, kk([28, 98])]].map(([l, a, b, ic], i) => `${ic}${T(52, 70 + i * 32, l, { a: "start", s: 13, c: "#4a148c" })}${T(138, 70 + i * 32, fmt(a), { s: 15, c: "#ad1457" })}${T(182, 70 + i * 32, fmt(b), { s: 15, c: "#ad1457" })}`).join("")}
      ${T(105, 140, "ATP used: " + (s.reveal ? e.used : "?"), { s: 13, c: "#e65100" })}${T(105, 162, "1 ATP: 3 Na⁺ out, 2 K⁺ in", { s: 11, c: "#8e6a85" })}`;
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#fff7f9"/>${s.mode !== "osmo" ? T(CX, 30, "OUTSIDE the cell", { s: 13, c: "#8e6a85" }) + T(CX, CY + 6, "INSIDE", { s: 13, c: "#c48aa8" }) : ""}${g}<g transform="translate(638,20)">${panel}</g></svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === "diff") return [
    { id: "oOut", type: "step", label: "O₂ outside", min: 0, max: 30, step: 2, lock: lk("oOut") }, { id: "oIn", type: "step", label: "O₂ inside", min: 0, max: 30, step: 2, lock: lk("oIn") },
    { id: "gOut", type: "step", label: "Glucose outside", min: 0, max: 20, step: 2, lock: lk("gOut") }, { id: "gIn", type: "step", label: "Glucose inside", min: 0, max: 20, step: 2, lock: lk("gIn") },
    { id: "chan", type: "toggle", label: "Add glucose channel proteins", lock: lk("chan") }];
  if (mode === "osmo") return [
    { id: "cell", type: "choice", label: "Cell", options: [{ v: "rbc", label: "🔴 Red blood cell" }, { v: "plant", label: "🌿 Plant cell" }], lock: lk("cell") },
    { id: "sol", type: "choice", label: "Put the cell in (salt solution)", options: SOLS.map(v => ({ v, label: v === 0 ? "Pure water" : v + "%" })), lock: lk("sol") }];
  return [
    { id: "naIn", type: "step", label: "Na⁺ inside at start (12 in total)", min: 0, max: 12, step: 3, lock: lk("naIn") }, { id: "kIn", type: "step", label: "K⁺ inside at start (10 in total)", min: 0, max: 10, step: 2, lock: lk("kIn") },
    { id: "atp", type: "step", label: "ATP molecules", min: 0, max: 6, lock: lk("atp") }, { id: "chan", type: "toggle", label: "Open the Na⁺ channel", lock: lk("chan") }];
};
const stFor = (mode, o) => Object.assign(mode === "diff" ? { mode, oOut: 10, oIn: 0, gOut: 0, gIn: 0, chan: false } : mode === "osmo" ? { mode, cell: "rbc", sol: 0.9 } : { mode, naIn: 9, kIn: 2, atp: 0, chan: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const HINT = { diff: "Particles diffuse from HIGH to LOW concentration until it is equal. Small O₂ passes the membrane; glucose needs channel proteins.", osmo: "Water moves by osmosis from the weaker salt solution to the stronger one. Inside the cell is 0.9% salt.", act: "Active transport uses energy (ATP) to move particles AGAINST the gradient. Each ATP: 3 Na⁺ out, 2 K⁺ in." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { diff: "🫧 Diffusion challenge", osmo: "💧 Osmosis challenge", act: "⚡ Active transport challenge" }[mode], prompt: "Set up the cell, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mem-sim", diff, uses, mk);
const dsay = s => { const e = diffEnd(s); return `After diffusion: O₂ ${e.oIn} in / ${e.oOut} out, glucose ${e.gIn} in / ${e.gOut} out`; };
const C = {
  o10: () => { const t = choice([6, 10, 14]); return simQ("diff", `Start with <b>no O₂ inside</b>. Finish with exactly <b>${t} O₂ inside</b> the cell.`, stFor("diff", { oOut: 4 }), s => ok(diffEnd(s).oIn === t, dsay(s) + ".", dsay(s) + "."), { oOut: 2 * t }, { lock: ["oIn"], wrong: { oOut: t } }); },
  oOut: () => simQ("diff", "Make oxygen diffuse <b>OUT of</b> the cell.", stFor("diff", { oOut: 10, oIn: 0 }), s => ok(s.oIn > s.oOut, "More O₂ inside than outside → it diffuses out.", s.oIn === s.oOut ? "Equal concentration: no net movement." : "O₂ moves in, not out."), { oIn: 20, oOut: 4 }, { wrong: { oIn: 4, oOut: 20 } }),
  gIn: () => simQ("diff", "There are 16 glucose outside. Get glucose <b>INTO</b> the cell.", stFor("diff", { gOut: 16 }), s => ok(diffEnd(s).gIn > 0, "Glucose is too big for the membrane — the channel proteins let it through (facilitated diffusion).", "Glucose cannot pass the lipid membrane on its own."), { chan: true }, { lock: ["gOut", "gIn"], wrong: { chan: false } }),
  gKeep: () => simQ("diff", "Let <b>oxygen enter</b> the cell but keep <b>all the glucose outside</b> (12 glucose outside).", stFor("diff", { gOut: 12, chan: true, oOut: 0 }), s => ok(diffEnd(s).gIn === 0 && diffEnd(s).oIn > s.oIn, dsay(s) + ".", dsay(s) + "."), { chan: false, oOut: 10 }, { lock: ["gOut", "gIn"], wrong: { chan: true, oOut: 10 } }),
  g6: () => simQ("diff", "Start with <b>no glucose inside</b>. Finish with exactly <b>6 glucose inside</b>.", stFor("diff"), s => ok(diffEnd(s).gIn === 6, dsay(s) + ".", dsay(s) + "."), { gOut: 12, chan: true }, { lock: ["gIn"], wrong: { gOut: 12, chan: false } }),
  none: () => simQ("diff", "Put <b>at least 4 of each</b> particle and open the channels, but make sure there is <b>no net movement</b> at all.", stFor("diff", { chan: true }), s => ok(s.oIn === s.oOut && s.gIn === s.gOut && Math.min(s.oIn + s.oOut, s.gIn + s.gOut) >= 4 && s.chan, "Equal concentrations inside and outside: no net diffusion.", s.oIn + s.oOut < 4 || s.gIn + s.gOut < 4 ? "Use at least 4 of each particle." : dsay(s) + "."), { oIn: 4, oOut: 4, gIn: 2, gOut: 2 }, { lock: ["chan"], wrong: { oIn: 4, oOut: 6, gIn: 2, gOut: 2 } }),
  burst: () => simQ("osmo", "Make the <b>red blood cell burst</b>.", stFor("osmo"), s => ok(s.cell === "rbc" && s.sol === 0, "Pure water enters the cell by osmosis until it bursts.", `The cell ${osmoRes(s)[1]}.`), { sol: 0 }, { lock: ["cell"], wrong: { sol: 0.3 } }),
  normal: () => simQ("osmo", "Put the <b>red blood cell</b> in a solution where it <b>keeps its normal size</b>.", stFor("osmo", { sol: 10 }), s => ok(s.sol === 0.9, "0.9% is isotonic — the same as inside the cell.", `The cell ${osmoRes(s)[1]}.`), { sol: 0.9 }, { lock: ["cell"], wrong: { sol: 3 } }),
  plasmo: () => simQ("osmo", "Make the <b>plant cell fully plasmolysed</b>.", stFor("osmo", { cell: "plant" }), s => ok(s.cell === "plant" && s.sol === 10, "Water leaves the vacuole; the membrane pulls away from the wall.", `The cell ${osmoRes(s)[1]}.`), { sol: 10 }, { lock: ["cell"], wrong: { sol: 3 } }),
  turgid: () => simQ("osmo", "Make the <b>plant cell turgid</b> (firm) — and choose the solution that gives the <b>biggest</b> mass gain.", stFor("osmo", { cell: "plant", sol: 3 }), s => ok(s.sol === 0, "Pure water: +10%. The cell wall stops it bursting.", `Mass change ${osmoRes(s)[0]}%.`), { sol: 0 }, { lock: ["cell"], wrong: { sol: 0.3 } }),
  lose15: () => { const c = choice([["rbc", -15, 3], ["plant", -12, 3], ["rbc", -35, 10], ["plant", -25, 10]]);
    return simQ("osmo", `Make the <b>${c[0] === "rbc" ? "red blood cell" : "plant cell"}</b> lose exactly <b>${-c[1]}%</b> of its mass.`, stFor("osmo", { cell: c[0], sol: 0.3 }), s => ok(osmoRes(s)[0] === c[1], `${c[2]}% salt: water moves out — ${osmoRes(s)[1]}.`, osmoRes(s)[0] == null ? "The cell burst." : `Mass change ${osmoRes(s)[0]}%.`), { sol: c[2] }, { lock: ["cell"], wrong: { sol: c[2] === 3 ? 10 : 3 } }); },
  allNa: () => simQ("act", "Use the pump to move <b>ALL the Na⁺</b> out of the cell — with the <b>fewest ATP</b>.", stFor("act", { naIn: 9 }), s => { const e = actEnd(s); return ok(e.naIn === 0 && s.atp === 3, "3 ATP × 3 Na⁺ = 9 Na⁺ pumped out, against the gradient.", e.naIn > 0 ? `${fmt(e.naIn)} Na⁺ are still inside.` : "All out — but fewer ATP are enough."); }, { atp: 3 }, { lock: ["naIn", "kIn", "chan"], wrong: { atp: 4 } }),
  k8: () => simQ("act", "K⁺: 2 inside, 8 outside. Get exactly <b>8 K⁺ inside</b>.", stFor("act", { naIn: 12, kIn: 2 }), s => ok(actEnd(s).kIn === 8, "3 ATP × 2 K⁺ = 6 more K⁺ inside.", `${actEnd(s).kIn} K⁺ inside.`), { atp: 3 }, { lock: ["naIn", "kIn", "chan"], wrong: { atp: 2 } }),
  leak: () => simQ("act", "Pump Na⁺ out with ATP, then <b>open the channel</b> so Na⁺ leaks back until inside = outside.", stFor("act", { naIn: 9 }), s => { const e = actEnd(s); return ok(s.atp >= 1 && s.chan && e.naIn === e.naOut, "The channel lets Na⁺ diffuse back DOWN its gradient (passive, no ATP).", !s.chan ? "Open the Na⁺ channel." : "Use some ATP first."); }, { atp: 2, chan: true }, { lock: ["naIn", "kIn"], wrong: { atp: 2, chan: false } }),
  uphill: () => simQ("act", "Na⁺ starts <b>equal</b> (6 in, 6 out). Make Na⁺ <b>higher outside</b> than inside.", stFor("act", { naIn: 6, kIn: 4 }), s => { const e = actEnd(s); return ok(e.naOut > e.naIn, "Only active transport (ATP) can move particles from LOW to HIGH concentration.", s.chan ? "The open channel lets Na⁺ even out again." : "Without ATP nothing moves against the gradient."); }, { atp: 1, chan: false }, { lock: ["naIn", "kIn"], wrong: { atp: 0, chan: false } }),
  ratio: () => simQ("act", "K⁺: 2 in, 8 out. With the <b>fewest ATP</b>, make K⁺ inside <b>at least 3 times</b> K⁺ outside.", stFor("act", { naIn: 12, kIn: 2 }), s => { const e = actEnd(s); return ok(e.kIn >= 3 * e.kOut && s.atp === 3, "3 ATP: 8 K⁺ in, 2 out → 4 times.", e.kIn >= 3 * e.kOut ? "That works, but fewer ATP are enough." : `${e.kIn} in / ${e.kOut} out.`); }, { atp: 3 }, { lock: ["naIn", "kIn", "chan"], wrong: { atp: 2 } })
};

// ---------- diagram tasks ----------
const D = {
  passMcq: diff => E.diaT("mem-mcq", diff, 1, () => { const q = choice([
      { ask: "Which particle can pass through the lipid membrane <b>without</b> a protein?", ok: "Oxygen (O₂) — small, non-polar", bad: ["Glucose", "Sodium ions (Na⁺)", "Proteins"], ex: "Small non-polar molecules like O₂ and CO₂ slip between the lipids. Big or charged particles need proteins." },
      { ask: "Diffusion always moves particles…", ok: "from high to low concentration", bad: ["from low to high concentration", "only into cells", "only when ATP is used"], ex: "Diffusion is passive: particles spread out down the concentration gradient." },
      { ask: "Why does diffusion stop changing the numbers after a while?", ok: "Concentrations become equal, so movement in = movement out", bad: ["The particles stop moving", "The membrane closes", "The cell runs out of ATP"], ex: "Particles keep moving, but there is no NET movement at equilibrium." }]);
    return { kind: "mcq", title: "🧫 The cell membrane", prompt: "Look at the cell.", visual: render(stFor("diff", { oOut: 12, oIn: 2, gOut: 8, chan: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Diffusion across membranes" }; }),
  predNum: diff => E.diaT("mem-num", diff, 2, () => { const c = choice([{ oO: 18, oI: 2, gO: 10, gI: 0, ch: true }, { oO: 4, oI: 16, gO: 8, gI: 4, ch: false }, { oO: 12, oI: 12, gO: 0, gI: 14, ch: true }]); const s = stFor("diff", { oOut: c.oO, oIn: c.oI, gOut: c.gO, gIn: c.gI, chan: c.ch }), e = diffEnd(s);
    return { kind: "num", title: "🔮 Predict the result", prompt: `This cell is left for a long time. Glucose channels: <b>${c.ch ? "present" : "none"}</b>.`, visual: render(s),
      fields: [{ label: "O₂ inside at the end", unit: "", answer: e.oIn }, { label: "Glucose inside at the end", unit: "", answer: e.gIn }], explain: `O₂ evens out: (${c.oI}+${c.oO})÷2 = ${e.oIn}. Glucose ${c.ch ? `evens out: ${e.gIn}` : "cannot cross without channels: stays " + c.gI}.`, summary: "Predict diffusion" }; }),
  tonPick: diff => E.diaT("mem-pick", diff, 2, () => { const ask = choice([["0", "the cell put in a <b>hypotonic</b> solution (water moves IN)"], ["10", "the cell put in a <b>hypertonic</b> solution (water moves OUT)"], ["0.9", "the cell in an <b>isotonic</b> solution"]]), cell = choice(["rbc", "plant"]), order = E.shuffle(["0", "0.9", "10"]);
    return { kind: "pick", title: "👆 Which solution?", prompt: "Three " + (cell === "rbc" ? "red blood cells" : "plant cells") + " after 30 minutes. Click " + ask[1] + ".", answer: [ask[0]], names: { 0: "the cell from pure water", 0.9: "the cell from 0.9% salt", 10: "the cell from 10% salt" },
      visual: st => `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="300" fill="#fff7f9"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${8 + i * 298}" y="8" width="286" height="284" rx="14" fill="#fff" ${E.ring(st[k])}/><g transform="translate(${10 + i * 298},18) scale(0.44)">${render(stFor("osmo", { cell, sol: +k, reveal: true })).replace(/<svg[^>]*>|<\/svg>/g, "").replace(/<g transform="translate\(638,20\)">[\s\S]*$/, "")}</g>${T(151 + i * 298, 278, "Cell " + (i + 1), { s: 15 })}</g>`).join("")}</svg>`,
      explain: "Hypotonic (weaker outside): water in → swells/bursts or turgid. Hypertonic (stronger outside): water out → shrinks/plasmolysed. Isotonic: no net change.", summary: "Hypo-, iso- and hypertonic" }; }),
  graph: diff => E.diaT("mem-num", diff, 3, () => { const pts = [[0, 10], [0.3, 6], [0.9, 0], [3, -12], [10, -25]]; const X = c => 70 + Math.log10(c + 0.1) * 230 + 230, Y = m => 150 - m * 4.4;
    const vis = `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#fff"/><line x1="50" x2="720" y1="${Y(0)}" y2="${Y(0)}" stroke="#90a4ae" stroke-width="2"/>${[10, 5, -5, -10, -15, -20, -25].map(m => `<line x1="50" x2="720" y1="${Y(m)}" y2="${Y(m)}" stroke="#f1f1f1"/>${T(44, Y(m) + 4, m, { a: "end", s: 11, c: "#78909c" })}`).join("")}
      <polyline points="${pts.map(p => X(p[0]) + "," + Y(p[1])).join(" ")}" fill="none" stroke="#2e7d32" stroke-width="4"/>${pts.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="6" fill="#2e7d32"/>${T(X(p[0]), 290, p[0] + "%", { s: 12, c: "#546e7a" })}`).join("")}
      ${T(380, 276, "salt concentration outside", { s: 12 })}${T(16, 20, "% change in mass (potato cylinders)", { a: "start", s: 12 })}</svg>`;
    return { kind: "num", title: "📈 Osmosis graph", prompt: "Potato cylinders were left in different salt solutions.", visual: vis,
      fields: [{ label: "Concentration with NO change in mass (isotonic)", unit: "%", answer: 0.9 }, { label: "Mass change in 3% salt", unit: "%", answer: -12 }], explain: "The line crosses 0% change at 0.9%: same concentration as the cell. At 3% the potato lost 12% of its mass.", summary: "Read an osmosis graph" }; }),
  compare: diff => E.diaT("mem-mcq", diff, 2, () => { const q = choice([
      { ask: "Which process needs <b>ATP</b> (energy from respiration)?", ok: "Active transport", bad: ["Diffusion", "Osmosis", "Facilitated diffusion"], ex: "Only active transport uses energy; it moves particles against the gradient." },
      { ask: "Why do plant cells NOT burst in pure water?", ok: "The strong cell wall stops the cell expanding", bad: ["Plant cells have no membrane", "Water cannot enter plant cells", "Chloroplasts absorb the water"], ex: "Water enters until the cell is turgid; the cell wall pushes back." },
      { ask: "Root hair cells take in minerals from soil where the concentration is LOWER than inside. Which process?", ok: "Active transport", bad: ["Diffusion", "Osmosis", "Evaporation"], ex: "Moving particles from low to high concentration needs active transport." }]);
    return { kind: "mcq", title: "⚖️ Compare the processes", prompt: "Diffusion, osmosis and active transport.", visual: render(stFor("act", { naIn: 9, atp: 2 })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Compare transport processes" }; }),
  atpNum: diff => E.diaT("mem-num", diff, 3, () => { const n = choice([12, 18, 24, 30]);
    return { kind: "num", title: "⚡ Counting ATP", prompt: "Each ATP lets the pump move 3 Na⁺ out and 2 K⁺ in.", visual: render(stFor("act", { naIn: 12, atp: 4, showVals: true })),
      fields: [{ label: `ATP needed to pump ${n} Na⁺ out`, unit: "", answer: n / 3 }, { label: "K⁺ moved in at the same time", unit: "", answer: n / 3 * 2 }], explain: `${n} ÷ 3 = ${n / 3} ATP; ${n / 3} × 2 = ${n / 3 * 2} K⁺.`, summary: "Sodium–potassium pump" }; })
};
const LEVELS = {
  1: { intro: "Diffusion: particles spread from high to low concentration. Small O₂ crosses the membrane; glucose needs channel proteins.", pool: () => [S(1, 1, C.o10), S(1, 1, C.oOut), S(2, 1, C.gIn), S(2, 1, C.g6), S(3, 1, C.gKeep), S(3, 1, C.none), D.passMcq(1), D.predNum(2), D.predNum(3)] },
  2: { intro: "Osmosis: water moves across the membrane from a weak solution to a strong one.", pool: () => [S(1, 1, C.burst), S(1, 1, C.normal), S(2, 1, C.plasmo), S(2, 1, C.turgid), S(3, 2, C.lose15), D.tonPick(1), D.compare(2), D.graph(3)] },
  3: { intro: "Active transport: the Na⁺/K⁺ pump uses ATP to move ions AGAINST their gradient.", pool: () => [S(1, 1, C.allNa), S(2, 1, C.k8), S(2, 1, C.uphill), S(3, 1, C.leak), S(3, 1, C.ratio), D.compare(1), D.atpNum(2), D.atpNum(3)] }
};
const MODE = { 1: "diff", 2: "osmo", 3: "act" };
const explore = E.exploreSim({
  intro: "Level 1: diffusion. Level 2: osmosis. Level 3: active transport. Change the cell and press ▶ to see what happens.",
  state: lv => stFor(MODE[lv]), controls: lv => ctlsFor(MODE[lv]), render, run, runLabel: "▶ Wait and watch",
  goals: lv => lv === 1 ? [{ txt: "Make O₂ diffuse into the cell", test: (s, m) => m.oin }, { txt: "Get glucose into the cell", test: (s, m) => m.gin }, { txt: "Try glucose without channels", test: (s, m) => m.gno }]
    : lv === 2 ? [{ txt: "Make a red blood cell burst", test: (s, m) => m.burst }, { txt: "Plasmolyse a plant cell", test: (s, m) => m.plas }, { txt: "Find the solution with no change", test: (s, m) => m.iso }]
    : [{ txt: "Pump Na⁺ out with ATP", test: (s, m) => m.pump }, { txt: "Open the channel and watch Na⁺ leak back", test: (s, m) => m.leak }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "diff") { if (s.oOut > s.oIn) m.oin = 1; if (s.chan && s.gOut > s.gIn) m.gin = 1; if (!s.chan && s.gOut > 0) m.gno = 1; }
    if (s.mode === "osmo") { if (s.cell === "rbc" && s.sol === 0) m.burst = 1; if (s.cell === "plant" && s.sol === 10) m.plas = 1; if (s.sol === 0.9) m.iso = 1; }
    if (s.mode === "act") { if (s.atp > 0 && !s.chan) m.pump = 1; if (s.atp > 0 && s.chan) m.leak = 1; } },
  facts: lv => lv === 1 ? "📘 <b>Diffusion</b>: net movement from high to low concentration. No energy needed." : lv === 2 ? "📘 <b>Osmosis</b>: diffusion of WATER through a partially permeable membrane, from dilute to concentrated solution." : "📘 <b>Active transport</b>: uses ATP and carrier proteins to move particles from LOW to HIGH concentration."
});
E.start({ labId: "membrane", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🫧", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🫧", "💧", "🧫", "✨"],
  exploreDemo: lv => lv === 1 ? [{ set: { oOut: 20 }, run: true }, { set: { gOut: 10, chan: true }, run: true }, { set: { chan: false }, run: true }]
    : lv === 2 ? [{ set: { sol: 0 }, run: true }, { set: { cell: "plant", sol: 10 }, run: true }, { set: { sol: 0.9 }, run: true }] : [{ set: { atp: 2 }, run: true }, { set: { chan: true }, run: true }] });
})();
