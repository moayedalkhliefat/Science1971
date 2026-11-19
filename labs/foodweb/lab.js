"use strict";
// ===== Food Chains & Webs — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const ORG = {
  grass: { n: "Grass", i: "🌿", eats: [] }, grasshopper: { n: "Grasshopper", i: "🦗", eats: ["grass"] }, rabbit: { n: "Rabbit", i: "🐇", eats: ["grass"] },
  mouse: { n: "Mouse", i: "🐭", eats: ["grass", "grasshopper"] }, frog: { n: "Frog", i: "🐸", eats: ["grasshopper"] }, snake: { n: "Snake", i: "🐍", eats: ["mouse", "frog"] },
  fox: { n: "Fox", i: "🦊", eats: ["rabbit", "mouse"] }, hawk: { n: "Hawk", i: "🦅", eats: ["snake", "mouse", "rabbit"] }
};
const KEYS = Object.keys(ORG), ANIMALS = KEYS.filter(k => k !== "grass");
const POS = { hawk: [400, 82], fox: [650, 170], snake: [170, 170], frog: [80, 295], mouse: [400, 235], rabbit: [650, 310], grasshopper: [240, 330], grass: [430, 388] };
const ROLE = ["producer", "primary consumer", "secondary consumer", "tertiary consumer", "quaternary consumer"];
const chainOf = s => { const c = []; for (let i = 0; i < 5; i++) { const v = s["p" + i]; if (!v || v === "none") break; c.push(v); } return c; };
const linkOK = (a, b) => ORG[b].eats.includes(a);
const validChain = c => c.length >= 2 && c[0] === "grass" && c.every((x, i) => i === 0 || linkOK(c[i - 1], x)) && new Set(c).size === c.length;
const gapFree = s => { let seen = false; for (let i = 0; i < 5; i++) { const v = s["p" + i]; if (!v || v === "none") seen = true; else if (seen) return false; } return true; };
// effect of removing one species on the others: up / down / out / same
function effects(rem) {
  const eff = {}; if (!rem || rem === "none") { KEYS.forEach(k => eff[k] = "same"); return eff; }
  eff[rem] = "removed";
  ANIMALS.forEach(k => { if (ORG[k].eats.includes(rem)) eff[k] = ORG[k].eats.length === 1 ? "out" : "down"; });
  ORG[rem].eats.forEach(k => { if (!eff[k]) eff[k] = "up"; });
  const vote = {};
  KEYS.forEach(k => { if (eff[k]) return; let v = 0;
    ORG[k].eats.forEach(f => { if (eff[f] === "up") v++; if (eff[f] === "down" || eff[f] === "out") v--; });
    ANIMALS.forEach(p => { if (ORG[p].eats.includes(k)) { if (eff[p] === "up") v--; if (eff[p] === "down" || eff[p] === "out") v++; } });
    vote[k] = v; });
  Object.keys(vote).forEach(k => eff[k] = vote[k] > 0 ? "up" : vote[k] < 0 ? "down" : "same");
  return eff;
}
const EFF = { up: ["▲ increases", "#2e7d32", 1.5], down: ["▼ decreases", "#e65100", 0.55], out: ["✖ dies out", "#c62828", 0], same: ["= no big change", "#607d8b", 1], removed: ["removed", "#9e9e9e", 0] };
const node = (k, x, y, extra, dim) => `<g opacity="${dim ? 0.35 : 1}"><circle cx="${x}" cy="${y}" r="32" fill="#fff" stroke="${k === "grass" ? "#7cb342" : "#8d6e63"}" stroke-width="3"/><text x="${x}" y="${y + 11}" text-anchor="middle" font-size="30">${ORG[k].i}</text><rect x="${x - 46}" y="${y + 36}" width="92" height="20" rx="8" fill="rgba(245,251,239,.92)"/>${T(x, y + 51, ORG[k].n, { s: 13, c: "#33691e" })}${extra || ""}</g>`;
function arrowLine(x1, y1, x2, y2, col, w) { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, sx = x1 + ux * 36, sy = y1 + uy * 36, ex = x2 - ux * 38, ey = y2 - uy * 38;
  return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${col}" stroke-width="${w || 2.5}"/><polygon points="${ex},${ey} ${ex - ux * 11 - uy * 6},${ey - uy * 11 + ux * 6} ${ex - ux * 11 + uy * 6},${ey - uy * 11 - ux * 6}" fill="${col}"/>`; }
function webSvg(eff, opts) {
  opts = opts || {}; let g = "";
  KEYS.forEach(k => ORG[k].eats.forEach(f => { const dead = eff && (eff[k] === "removed" || eff[f] === "removed"); g += dead ? "" : arrowLine(POS[f][0], POS[f][1], POS[k][0], POS[k][1], "#9ccc65"); }));
  KEYS.forEach(k => { const e = eff && eff[k]; const tag = e && e !== "same" && e !== "removed" ? `<rect x="${POS[k][0] - 52}" y="${POS[k][1] - 62}" width="104" height="22" rx="11" fill="${EFF[e][1]}"/>${T(POS[k][0], POS[k][1] - 46, EFF[e][0], { s: 12, c: "#fff" })}` : "";
    g += opts.pick ? `<g class="pk" data-k="${k}"><circle cx="${POS[k][0]}" cy="${POS[k][1]}" r="38" fill="none" ${E.ring(opts.pick[k])}/>${node(k, POS[k][0], POS[k][1])}</g>` : node(k, POS[k][0], POS[k][1], tag, e === "removed"); });
  return g;
}
function renderChain(s) {
  const c = chainOf(s), show = s.reveal || s.showVals, n = 5, w = 150;
  let g = "";
  for (let i = 0; i < n; i++) { const v = s["p" + i], x = 20 + i * w + w / 2 - 75 + 75, y = 170;
    if (v && v !== "none") g += `<rect x="${x - 62}" y="${y - 62}" width="124" height="150" rx="16" fill="#fff" stroke="#aed581" stroke-width="2"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="46">${ORG[v].i}</text>${T(x, y + 44, ORG[v].n, { s: 15, c: "#33691e" })}${show && i < c.length ? T(x, y + 70, ROLE[i], { s: 11, c: "#689f38" }) : ""}`;
    else g += `<rect x="${x - 62}" y="${y - 62}" width="124" height="150" rx="16" fill="none" stroke="#c5e1a5" stroke-width="2" stroke-dasharray="7 6"/>${T(x, y + 10, "empty", { s: 13, c: "#aed581" })}`;
    if (i < n - 1 && v && v !== "none" && s["p" + (i + 1)] && s["p" + (i + 1)] !== "none") { const okL = linkOK(v, s["p" + (i + 1)]); const col = show ? (okL ? "#2e7d32" : "#c62828") : "#689f38";
      g += `<line x1="${x + 64}" x2="${x + w - 72}" y1="${y}" y2="${y}" stroke="${col}" stroke-width="4"/><polygon points="${x + w - 64},${y} ${x + w - 76},${y - 8} ${x + w - 76},${y + 8}" fill="${col}"/>${show ? T(x + w / 2, y - 14, okL ? "✓" : "✗", { s: 16, c: col }) : ""}`; } }
  let en = "";
  if (show && validChain(c)) { const E0 = s.E0 || 10000; en = c.map((k, i) => T(20 + i * w + w / 2, 290, fmt(E0 * Math.pow(0.1, i)) + " kJ", { s: 15, c: "#ef6c00" })).join("") + T(400, 330, "Only about 10% of the energy passes to the next level.", { s: 14, c: "#8d6e63" }); }
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f5fbef"/>${T(400, 50, "FOOD CHAIN  ·  the arrow means “is eaten by” (energy flows this way)", { s: 15, c: "#558b2f" })}${g}${en}
    ${show && c.length ? T(400, 400, validChain(c) ? "✓ This is a correct food chain (" + c.length + " organisms)." : c[0] !== "grass" ? "✗ A food chain must start with a producer." : "✗ At least one arrow is wrong.", { s: 17, c: validChain(c) ? "#2e7d32" : "#c62828" }) : ""}</svg>`;
}
function renderWeb(s) {
  const eff = s.reveal || s.showVals ? effects(s.rem) : (s.rem && s.rem !== "none" ? Object.assign(Object.fromEntries(KEYS.map(k => [k, "same"])), { [s.rem]: "removed" }) : null);
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f5fbef"/>${webSvg(eff)}
    <g transform="translate(560,380)"><rect width="230" height="60" rx="12" fill="#fff" stroke="#c5e1a5"/>${T(115, 26, s.rem && s.rem !== "none" ? ORG[s.rem].n + " removed" : "Nothing removed", { s: 14, c: "#33691e" })}${T(115, 46, s.reveal ? "after several years:" : "press ▶ to see the effect", { s: 12, c: "#7cb342" })}</g></svg>`;
}
function renderPyr(s) {
  const n = s.lv3 || s.levels, eff = s.eff / 100, show = s.reveal || s.showVals; let g = "";
  const names = ["Producers (grass)", "Primary consumers", "Secondary consumers", "Tertiary consumers", "Quaternary consumers"];
  for (let i = 0; i < s.levels; i++) { const v = s.E0 * Math.pow(eff, i), w = Math.max(40, 600 * (1 - i / 5.5)), y = 380 - i * 66;
    g += `<rect x="${400 - w / 2}" y="${y}" width="${w}" height="56" rx="8" fill="${["#9ccc65", "#ffd54f", "#ffb74d", "#ff8a65", "#e57373"][i]}" stroke="#fff" stroke-width="2"/>${T(400, y + 24, names[i], { s: 13, c: "#3e2723" })}${T(400, y + 45, i === 0 || show ? fmt(v) + " kJ" : "? kJ", { s: 15, c: "#3e2723" })}`;
    if (i > 0) g += T(400 + w / 2 + 30, y + 40, "×" + s.eff + "%", { a: "start", s: 12, c: "#8d6e63" }); }
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f5fbef"/>${T(400, 34, "ENERGY PYRAMID — energy available at each level", { s: 15, c: "#558b2f" })}${g}</svg>`;
}
const render = s => s.mode === "chain" ? renderChain(s) : s.mode === "web" ? renderWeb(s) : renderPyr(s);
const orgOpts = (none) => (none ? [{ v: "none", label: "—" }] : []).concat(KEYS.map(k => ({ v: k, label: ORG[k].i + " " + ORG[k].n })));
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === "chain") return [0, 1, 2, 3, 4].map(i => ({ id: "p" + i, type: "select", label: "Box " + (i + 1) + (i === 0 ? " (start)" : ""), options: orgOpts(i > 0), lock: lk("p" + i) }));
  if (mode === "web") return [{ id: "rem", type: "choice", label: "Remove one species (disease, hunting…)", options: [{ v: "none", label: "Nothing" }].concat(ANIMALS.map(k => ({ v: k, label: ORG[k].i + " " + ORG[k].n }))), wide: true, lock: lk("rem") }];
  return [{ id: "E0", type: "range", label: "Energy captured by grass", min: 1000, max: 100000, step: 1000, nudge: 1000, unit: "kJ", fmt: v => fmt(v), lock: lk("E0") },
    { id: "levels", type: "step", label: "Number of levels", min: 2, max: 5, lock: lk("levels") },
    { id: "eff", type: "choice", label: "Energy passed on", options: [5, 10, 20].map(v => ({ v, label: v + "%" })), lock: lk("eff") }];
};
const stFor = (mode, o) => Object.assign(mode === "chain" ? { mode, p0: "grass", p1: "none", p2: "none", p3: "none", p4: "none", E0: 10000 } : mode === "web" ? { mode, rem: "none" } : { mode, E0: 10000, levels: 3, eff: 10 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const chainTxt = s => chainOf(s).map(k => ORG[k].n).join(" → ");
const chainWhy = s => { const c = chainOf(s); if (!gapFree(s)) return "Do not leave empty boxes inside the chain."; if (!c.length) return "The chain is empty."; if (c[0] !== "grass") return "Start with the producer (grass)."; const i = c.findIndex((x, j) => j > 0 && !linkOK(c[j - 1], x)); return i > 0 ? `${ORG[c[i]].n} does not eat ${ORG[c[i - 1]].n.toLowerCase()}.` : new Set(c).size !== c.length ? "Each organism only once." : ""; };
const HINT = { chain: "Start with the producer. Each arrow points to the animal that EATS the one before it.", web: "Removing a species affects its food (prey) and the animals that eat it — and then the next links too.", pyr: "Only about 10% of the energy passes to the next level: multiply by 0.1 for each step up." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { chain: "🔗 Build a food chain", web: "🕸️ Food web challenge", pyr: "🔺 Energy pyramid" }[mode], prompt: { chain: "Fill the boxes from left to right, then press <b>▶ Run & check</b>.", web: "Choose a species to remove, then press <b>▶ Run & check</b> to see what happens to the others.", pyr: "Set up the energy pyramid, then press <b>▶ Run & check</b>." }[mode], goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("fw-sim", diff, uses, mk);
const C = {
  end3: () => { const t = choice([["fox", { p1: "rabbit", p2: "fox" }], ["frog", { p1: "grasshopper", p2: "frog" }], ["snake", { p1: "mouse", p2: "snake" }]]);
    return simQ("chain", `Build a food chain of <b>3 organisms</b> that ends with the <b>${ORG[t[0]].n.toLowerCase()}</b>.`, stFor("chain"), s => { const c = chainOf(s); return ok(gapFree(s) && validChain(c) && c.length === 3 && c[2] === t[0], chainTxt(s) + ".", chainWhy(s) || (c.length !== 3 ? `It has ${c.length} organisms.` : `It ends with the ${ORG[c[c.length - 1]].n.toLowerCase()}.`)); }, t[1], { wrong: { p1: "frog", p2: t[0] === "frog" ? "snake" : t[0] } }); },
  hawk4: () => simQ("chain", "Build a food chain of <b>4 organisms</b> that ends with the <b>hawk</b>.", stFor("chain"), s => { const c = chainOf(s); return ok(gapFree(s) && validChain(c) && c.length === 4 && c[3] === "hawk", chainTxt(s) + ".", chainWhy(s) || (c.length !== 4 ? `It has ${c.length} organisms.` : "It must end with the hawk.")); }, { p1: "mouse", p2: "snake", p3: "hawk" }, { wrong: { p1: "rabbit", p2: "snake", p3: "hawk" } }),
  five: () => simQ("chain", "Build the <b>longest</b> food chain possible: <b>5 organisms</b>.", stFor("chain"), s => { const c = chainOf(s); return ok(gapFree(s) && validChain(c) && c.length === 5, chainTxt(s) + ".", chainWhy(s) || `It has ${c.length} organisms.`); }, { p1: "grasshopper", p2: "frog", p3: "snake", p4: "hawk" }, { wrong: { p1: "grasshopper", p2: "mouse", p3: "frog", p4: "hawk" } }),
  mouse2: () => simQ("chain", "Build a food chain where the <b>mouse is a secondary consumer</b>.", stFor("chain"), s => { const c = chainOf(s); return ok(gapFree(s) && validChain(c) && c[2] === "mouse", chainTxt(s) + ": the mouse eats a primary consumer.", chainWhy(s) || "The mouse must be in position 3."); }, { p1: "grasshopper", p2: "mouse", p3: "fox" }, { wrong: { p1: "mouse", p2: "fox" } }),
  frog: () => simQ("chain", "Build a food chain with the <b>frog as the secondary consumer</b> and a <b>tertiary consumer</b> after it.", stFor("chain"), s => { const c = chainOf(s); return ok(gapFree(s) && validChain(c) && c[2] === "frog" && c.length >= 4, chainTxt(s) + ".", chainWhy(s) || (c[2] !== "frog" ? "The frog must be in position 3." : "Add the animal that eats the frog.")); }, { p1: "grasshopper", p2: "frog", p3: "snake" }, { wrong: { p1: "grasshopper", p2: "frog", p3: "hawk" } }),
  grassUp: () => simQ("web", "Remove <b>one</b> animal so that the <b>grass increases</b>.", stFor("web"), s => ok(effects(s.rem).grass === "up", `Without the ${ORG[s.rem].n.toLowerCase()}, less grass is eaten.`, s.rem === "none" ? "Remove an animal." : `Grass ${EFF[effects(s.rem).grass][0].replace(/^\S+ /, "")}.`), { rem: "rabbit" }, { wrong: { rem: "fox" } }),
  hopperUp: () => simQ("web", "Remove <b>one</b> animal so that the <b>grasshoppers increase</b>.", stFor("web"), s => ok(effects(s.rem).grasshopper === "up", `The ${ORG[s.rem].n.toLowerCase()} ate grasshoppers — now fewer are eaten.`, s.rem === "none" ? "Remove an animal." : "Grasshoppers do not increase."), { rem: "frog" }, { wrong: { rem: "snake" } }),
  snakeOut: () => simQ("web", "Remove <b>one</b> animal so that the <b>frog dies out</b>.", stFor("web"), s => ok(effects(s.rem).frog === "out", "The frog's only food was grasshoppers.", s.rem === "none" ? "Remove an animal." : "The frog still has food."), { rem: "grasshopper" }, { wrong: { rem: "snake" } }),
  rabbitUp: () => simQ("web", "Remove <b>one</b> animal so that the <b>rabbits increase</b> and, as a result, the <b>grass decreases</b>.", stFor("web"), s => { const e = effects(s.rem); return ok(e.rabbit === "up" && e.grass === "down", "Fewer rabbits are eaten, so more rabbits eat more grass.", s.rem === "none" ? "Remove an animal." : `Rabbits: ${EFF[e.rabbit][0]} · Grass: ${EFF[e.grass][0]}.`); }, { rem: "fox" }, { wrong: { rem: "rabbit" } }),
  foxEffect: () => simQ("web", "Remove <b>one</b> animal so that <b>both snakes and hawks decrease</b>.", stFor("web"), s => { const e = effects(s.rem); return ok(["down", "out"].includes(e.snake) && ["down", "out"].includes(e.hawk), `Without the ${s.rem === "none" ? "" : ORG[s.rem].n.toLowerCase()}, snakes and hawks have less food.`, s.rem === "none" ? "Remove an animal." : `Snake: ${EFF[e.snake][0]} · Hawk: ${EFF[e.hawk][0]}.`); }, { rem: "mouse" }, { wrong: { rem: "rabbit" } }),
  hawk20: () => { const t = choice([[20, 20000], [5, 5000], [50, 50000]]);
    return simQ("pyr", `With 10% passed on, give the <b>tertiary consumer</b> (4th level) exactly <b>${t[0]} kJ</b>.`, stFor("pyr", { levels: 4, eff: 10 }), s => ok(s.levels === 4 && s.eff === 10 && E.near(s.E0 * 0.001, t[0], 1e-6), `${fmt(s.E0)} × 0.1 × 0.1 × 0.1 = ${t[0]} kJ.`, `The 4th level gets ${fmt(s.E0 * Math.pow(s.eff / 100, s.levels - 1))} kJ.`), { E0: t[1] }, { lock: ["levels", "eff"], wrong: { E0: t[1] * 10 } }); },
  levels: () => simQ("pyr", "Grass captures <b>10 000 kJ</b>. A top predator needs <b>at least 10 kJ</b>. Show the <b>most levels</b> the pyramid can have.", stFor("pyr", { E0: 10000, levels: 2 }), s => ok(s.levels === 4 && s.eff === 10, "10 000 → 1 000 → 100 → 10 kJ: 4 levels. A 5th would get only 1 kJ.", s.levels === 5 ? "The 5th level would get only 1 kJ." : `${s.levels} levels — more are possible.`), { levels: 4 }, { lock: ["E0", "eff"], wrong: { levels: 5 } }),
  effPick: () => simQ("pyr", "From <b>10 000 kJ</b> of grass, the <b>3rd level</b> must get <b>400 kJ</b>. Choose the efficiency.", stFor("pyr", { E0: 10000, levels: 3, eff: 10 }), s => ok(s.eff === 20, "10 000 × 0.2 × 0.2 = 400 kJ.", `10 000 × ${s.eff / 100} × ${s.eff / 100} = ${fmt(10000 * Math.pow(s.eff / 100, 2))} kJ.`), { eff: 20 }, { lock: ["E0", "levels"], wrong: { eff: 10 } }),
  grass5: () => simQ("pyr", "With 10% passed on, set up a <b>5-level</b> pyramid whose top level gets exactly <b>3 kJ</b>.", stFor("pyr", { levels: 3 }), s => ok(s.levels === 5 && E.near(s.E0 * 1e-4, 3, 1e-6), "30 000 kJ × 0.1⁴ = 3 kJ.", `Top level: ${fmt(s.E0 * Math.pow(s.eff / 100, s.levels - 1))} kJ with ${s.levels} levels.`), { levels: 5, E0: 30000 }, { lock: ["eff"], wrong: { levels: 4, E0: 30000 } })
};

// ---------- diagram tasks ----------
const D = {
  pickWeb: diff => E.diaT("fw-pick", diff, 2, () => { const q = choice([["grass", "the <b>producer</b>"], ["mouse", "the animal that eats <b>both a plant and an animal</b>"], ["frog", "the animal that eats <b>only grasshoppers</b>"], ["hawk", "the animal that eats <b>snakes</b>"], ["snake", "the animal that eats <b>frogs</b>"]]);
    return { kind: "pick", title: "👆 Read the food web", prompt: "Click " + q[1] + ". Arrows point from the food to the animal that eats it.", answer: [q[0]], names: Object.fromEntries(KEYS.map(k => [k, "the " + ORG[k].n.toLowerCase()])),
      visual: stt => `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f5fbef"/>${webSvg(null, { pick: stt })}</svg>`,
      explain: `Answer: the ${ORG[q[0]].n.toLowerCase()}. ${ORG[q[0]].eats.length ? "It eats " + ORG[q[0]].eats.map(x => ORG[x].n.toLowerCase()).join(" and ") + "." : "It makes its own food by photosynthesis."}`, summary: "Read a food web" }; }),
  energyNum: diff => E.diaT("fw-num", diff, 2, () => { const E0 = choice([20000, 50000, 8000, 30000]), lv = choice([2, 3, 4]);
    const s = stFor("pyr", { E0, levels: 4, eff: 10 });
    return { kind: "num", title: "🔺 Energy at each level", prompt: `Grass captures ${fmt(E0)} kJ. 10% of the energy passes to each next level.`, visual: renderPyr(s),
      fields: [{ label: `Energy at level ${lv}`, unit: "kJ", answer: E0 * Math.pow(0.1, lv - 1) }, { label: "Energy lost between level 1 and 2", unit: "kJ", answer: E0 * 0.9 }],
      explain: `Level ${lv}: ${fmt(E0)} × 0.1${lv > 2 ? "^" + (lv - 1) : ""} = ${fmt(E0 * Math.pow(0.1, lv - 1))} kJ. 90% (${fmt(E0 * 0.9)} kJ) is lost as heat, movement and waste.`, summary: "10% energy rule" }; }),
  countChains: diff => E.diaT("fw-num", diff, 3, () => { const tgt = choice([["snake", 3], ["fox", 3], ["hawk", 6], ["frog", 1]]);
    return { kind: "num", title: "🔢 Count the food chains", prompt: "Every food chain starts at the grass and follows the arrows.", visual: `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f5fbef"/>${webSvg(null)}</svg>`,
      fields: [{ label: `How many different food chains end with the ${ORG[tgt[0]].n.toLowerCase()}?`, unit: "", answer: tgt[1] }],
      explain: { snake: "grass→grasshopper→frog→snake, grass→mouse→snake, grass→grasshopper→mouse→snake.", fox: "grass→rabbit→fox, grass→mouse→fox, grass→grasshopper→mouse→fox.", hawk: "3 chains through the snake + 2 through the mouse + 1 through the rabbit = 6.", frog: "Only grass→grasshopper→frog." }[tgt[0]], summary: "Count chains in a web" }; }),
  arrowMcq: diff => E.diaT("fw-mcq", diff, 1, () => { const q = choice([
      { ask: "What does the arrow in a food chain show?", ok: "The direction that energy flows (food → eater)", bad: ["Which animal is bigger", "Which animal runs faster", "The direction the animal moves"], ex: "Arrows point from the organism eaten to the organism that eats it: the energy moves that way." },
      { ask: "Why do food chains rarely have more than 5 levels?", ok: "Too little energy is left at the top", bad: ["Animals cannot eat more than 5 things", "There are only 5 kinds of animals", "Producers stop growing"], ex: "About 90% of the energy is lost at each step, so after 4–5 steps too little energy remains." },
      { ask: "Where does the energy in this food web originally come from?", ok: "The Sun", bad: ["The soil", "The water", "The hawk"], ex: "Producers capture light energy from the Sun by photosynthesis." }]);
    return { kind: "mcq", title: "📘 Energy in ecosystems", prompt: "Look at the food chain.", visual: renderChain(stFor("chain", { p1: "grasshopper", p2: "frog", p3: "snake", p4: "hawk", showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Energy flow ideas" }; })
};
const LEVELS = {
  1: { intro: "Build food chains: producer → primary consumer → secondary consumer → …", pool: () => [S(1, 1, C.end3), S(2, 1, C.hawk4), S(2, 1, C.mouse2), S(3, 1, C.five), S(3, 1, C.frog), D.arrowMcq(1), D.pickWeb(2), D.pickWeb(3)] },
  2: { intro: "Food webs: remove one species and predict what happens to the others.", pool: () => [S(1, 1, C.grassUp), S(2, 1, C.hopperUp), S(2, 1, C.snakeOut), S(3, 1, C.rabbitUp), S(3, 1, C.foxEffect), D.pickWeb(1), D.arrowMcq(2), D.countChains(3)] },
  3: { intro: "Energy pyramids: only about 10% of the energy passes from one level to the next.", pool: () => [S(1, 1, C.hawk20), S(2, 1, C.levels), S(2, 1, C.effPick), S(3, 1, C.grass5), D.energyNum(1), D.countChains(2), D.energyNum(3)] }
};
const MODE = { 1: "chain", 2: "web", 3: "pyr" };
const explore = E.exploreSim({
  intro: "Level 1: build a food chain. Level 2: remove species from the food web. Level 3: explore the energy pyramid.",
  state: lv => stFor(MODE[lv], { showVals: true }), controls: lv => ctlsFor(MODE[lv]), render,
  goals: lv => lv === 1 ? [{ txt: "Build a correct 3-organism chain", test: s => validChain(chainOf(s)) && chainOf(s).length >= 3 }, { txt: "Build a correct 4-organism chain", test: s => validChain(chainOf(s)) && chainOf(s).length >= 4 }]
    : lv === 2 ? [{ txt: "Remove an animal that makes another die out", test: (s, m) => m.out }, { txt: "Remove 3 different animals", test: (s, m) => (m.r || new Set()).size >= 3 }]
    : [{ txt: "Make a 5-level pyramid", test: s => s.levels === 5 }, { txt: "Try 20% efficiency", test: s => s.eff === 20 }, { txt: "Give the top level at least 100 kJ", test: s => s.E0 * Math.pow(s.eff / 100, s.levels - 1) >= 100 }],
  track: (s, m) => { if (s.mode === "web" && s.rem !== "none") { (m.r = m.r || new Set()).add(s.rem); if (Object.values(effects(s.rem)).includes("out")) m.out = 1; } },
  facts: lv => lv === 1 ? "📘 A food chain starts with a <b>producer</b>. Arrows show the flow of energy: food → eater." : lv === 2 ? "📘 In a <b>food web</b> many chains are linked. Changing one population affects the others." : "📘 Only about <b>10%</b> of the energy passes to the next level; the rest is lost as heat, movement and waste."
});
E.start({ labId: "foodweb", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🕸️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🌿", "🐇", "🦊", "✨"],
  exploreDemo: lv => lv === 1 ? [{ set: { p1: "grasshopper", p2: "frog" } }, { set: { p3: "snake" } }] : lv === 2 ? [{ set: { rem: "grasshopper" } }, { set: { rem: "fox" } }, { set: { rem: "hawk" } }] : [{ set: { levels: 5 } }, { set: { eff: 20 } }] });
})();
