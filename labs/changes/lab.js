"use strict";
// ===== Physical vs Chemical Change — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const SIGN = { gas: "🫧 Gas / bubbles", colour: "🎨 Colour change", hot: "🔥 Gets hotter", cold: "❄️ Gets colder", solid: "⬇️ Solid forms (precipitate)", light: "💡 Light given off" };
const X = {
  melt: { n: "Melt ice", chem: false, signs: [], a: ["#e3f2fd", "ice"], b: ["#90caf9", "liquid water"], rev: { cool: "freezes back to ice ✔" } },
  dissolve: { n: "Dissolve sugar in water", chem: false, signs: [], a: ["#fff8e1", "sugar + water"], b: ["#e3f2fd", "clear sugar solution"], rev: { evaporate: "sugar crystals come back ✔" } },
  boil: { n: "Boil water", chem: false, signs: ["gas"], a: ["#90caf9", "water"], b: ["#e1f5fe", "steam rising"], rev: { cool: "steam condenses to water ✔" } },
  tear: { n: "Tear paper", chem: false, signs: [], a: ["#fafafa", "sheet of paper"], b: ["#fafafa", "pieces of paper"], rev: {} },
  burn: { n: "Burn paper", chem: true, signs: ["light", "hot", "gas", "colour"], a: ["#fafafa", "paper"], b: ["#424242", "black ash + smoke"], rev: {} },
  vinegar: { n: "Vinegar + baking soda", chem: true, signs: ["gas", "cold"], a: ["#fffde7", "vinegar + white powder"], b: ["#fffde7", "fizzing, CO₂ given off"], rev: {} },
  rust: { n: "Leave an iron nail in wet air (1 week)", chem: true, signs: ["colour"], a: ["#9e9e9e", "shiny grey nail"], b: ["#a1501d", "orange-brown rust"], rev: {} },
  precip: { n: "Lead nitrate + potassium iodide", chem: true, signs: ["solid", "colour"], a: ["#ffffff", "two clear solutions"], b: ["#fdd835", "bright yellow solid"], rev: { filter: "yellow solid caught in the filter paper ✔" } },
  egg: { n: "Fry an egg", chem: true, signs: ["colour", "hot"], a: ["#fff9c4", "runny clear egg white"], b: ["#ffffff", "solid white egg"], rev: {} },
  mg: { n: "Burn magnesium ribbon", chem: true, signs: ["light", "hot", "colour"], a: ["#cfd8dc", "shiny grey ribbon"], b: ["#fafafa", "white powder (magnesium oxide)"], rev: {} }
};
const REV = { none: "Do nothing", cool: "Cool it down", evaporate: "Evaporate the water", filter: "Filter it" };
const has = (s, k) => X[s.exp].signs.includes(k);
function beaker(x, y, col, label, extra) {
  return `<g transform="translate(${x},${y})"><path d="M-60,-70 v120 q0,18 18,18 h84 q18,0 18,-18 v-120" fill="#ffffffcc" stroke="#78909c" stroke-width="3"/><path d="M-57,-10 h114 v58 q0,16 -16,16 h-82 q-16,0 -16,-16Z" fill="${col}"/>${extra || ""}${T(0, 96, label, { s: 13, c: "#37474f" })}</g>`;
}
function render(s) {
  const x = X[s.exp], show = s.reveal, after = show;
  let g = `<rect width="860" height="450" fill="#fff8f1"/><rect x="20" y="20" width="540" height="300" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(290, 48, x.n.toUpperCase(), { s: 15, c: "#bf360c" })}`;
  let fx = "";
  if (after) {
    if (has(s, "gas")) fx += Array.from({ length: 10 }, (_, i) => `<circle cx="${-44 + i * 10}" cy="${30 - (i % 4) * 12}" r="${3 + (i % 3)}" fill="#fff" stroke="#90a4ae"><animate attributeName="cy" values="40;-80" dur="${1 + (i % 3) * 0.4}s" repeatCount="indefinite"/></circle>`).join("");
    if (has(s, "light")) fx += `<circle cx="0" cy="-40" r="44" fill="#fff59d" opacity=".75"/><text x="0" y="-26" text-anchor="middle" font-size="40">${s.exp === "mg" ? "✨" : "🔥"}</text>`;
    if (has(s, "solid")) fx += Array.from({ length: 16 }, (_, i) => `<circle cx="${-48 + (i * 13) % 96}" cy="${50 + (i % 3) * 4}" r="4" fill="#f9a825"/>`).join("");
  }
  g += beaker(160, 170, x.a[0], "before: " + x.a[1]) + `<text x="290" y="185" text-anchor="middle" font-size="34">➡️</text>` + (after ? beaker(420, 170, x.b[0], "after: " + x.b[1], fx) : `<g transform="translate(420,170)"><rect x="-70" y="-80" width="140" height="160" rx="14" fill="#fafafa" stroke="#e0e0e0" stroke-dasharray="6 6"/>${T(0, 6, "press ▶", { s: 14, c: "#bdbdbd" })}</g>`);
  if (after && (has(s, "hot") || has(s, "cold"))) g += `<g transform="translate(510,120)"><rect x="-6" y="-60" width="12" height="110" rx="6" fill="#fff" stroke="#78909c"/><rect x="-3" y="${has(s, "hot") ? -55 : 10}" width="6" height="${has(s, "hot") ? 100 : 35}" rx="3" fill="${has(s, "hot") ? "#e53935" : "#1e88e5"}"/><circle cx="0" cy="52" r="9" fill="${has(s, "hot") ? "#e53935" : "#1e88e5"}"/></g>`;
  // signs board
  g += `<rect x="580" y="20" width="260" height="300" rx="16" fill="#fff" stroke="#ffccbc" stroke-width="2"/>${T(710, 48, "SIGNS SEEN", { s: 13, c: "#bf360c" })}
    ${Object.keys(SIGN).map((k, i) => { const on = after && has(s, k); return `<rect x="596" y="${64 + i * 40}" width="228" height="32" rx="8" fill="${on ? "#ffe0b2" : "#f5f5f5"}" stroke="${on ? "#ef6c00" : "#e0e0e0"}"/>${T(608, 85 + i * 40, SIGN[k], { a: "start", s: 13, c: on ? "#bf360c" : "#9e9e9e" })}`; }).join("")}`;
  // result strip
  const revTxt = s.rev && s.rev !== "none" ? (x.rev[s.rev] || (x.chem ? "✘ cannot be reversed — a new substance was made" : "✘ that method does not undo this change")) : "";
  g += `<rect x="20" y="335" width="820" height="100" rx="16" fill="${after ? (x.chem ? "#ffebee" : "#e8f5e9") : "#fafafa"}" stroke="${after ? (x.chem ? "#e57373" : "#81c784") : "#e0e0e0"}" stroke-width="2"/>
    ${after ? T(430, 372, x.chem ? "CHEMICAL CHANGE — a new substance is made" : "PHYSICAL CHANGE — no new substance", { s: 20, c: x.chem ? "#c62828" : "#2e7d32" }) + T(430, 408, s.rev && s.rev !== "none" ? REV[s.rev] + ": " + revTxt : (x.chem ? "usually cannot be reversed" : "the substance is the same, only its form changed"), { s: 14, c: "#37474f" }) : T(430, 392, "Choose an experiment and press ▶ to see what happens", { s: 15, c: "#9e9e9e" })}`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "exp", type: "select", label: "Experiment", options: Object.keys(X).map(v => ({ v, label: X[v].n })), lock: lk("exp") },
  { id: "rev", type: "choice", label: "Afterwards…", options: Object.keys(REV).map(v => ({ v, label: REV[v] })), wide: true, hide: () => lv < 3, lock: lk("rev") }]; };
const st = o => Object.assign({ exp: "tear", rev: "none" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const desc = s => `${X[s.exp].n}: ${X[s.exp].chem ? "chemical" : "physical"}${X[s.exp].signs.length ? ", signs: " + X[s.exp].signs.map(k => SIGN[k].replace(/^\S+\s/, "").toLowerCase()).join(", ") : ", no signs of reaction"}`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔥 Change challenge", prompt: "Choose an experiment, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "A CHEMICAL change makes a new substance (signs: gas, colour change, heat or cold, a precipitate, light) and is hard to reverse. A PHYSICAL change only changes shape or state." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ch-sim", diff, uses, mk);
const C = {
  newSub: () => simQ(1, "Do an experiment that makes a <b>new substance</b>.", st(), s => ok(X[s.exp].chem, desc(s) + ".", desc(s) + " — nothing new was made."), { exp: "burn" }, { wrong: { exp: "boil" } }),
  physical: () => simQ(1, "Do a <b>physical</b> change that only changes the <b>state</b> (solid, liquid, gas).", st({ exp: "burn" }), s => ok(["melt", "boil"].includes(s.exp), desc(s) + ".", desc(s) + "."), { exp: "melt" }, { wrong: { exp: "tear" } }),
  chemGas: () => simQ(1, "Find a <b>chemical</b> change that gives off a <b>gas</b> but no flame.", st(), s => ok(X[s.exp].chem && has(s, "gas") && !has(s, "light"), desc(s) + ".", desc(s) + "."), { exp: "vinegar" }, { wrong: { exp: "boil" } }),
  solid: () => simQ(1, "Mix two clear liquids so that a <b>solid</b> appears.", st(), s => ok(has(s, "solid"), desc(s) + " — the solid is called a precipitate.", desc(s) + "."), { exp: "precip" }, { wrong: { exp: "dissolve" } }),
  colder: () => simQ(2, "Find a reaction that gets <b>colder</b>.", st(), s => ok(has(s, "cold"), desc(s) + " — it takes in heat (endothermic).", desc(s) + "."), { exp: "vinegar" }, { wrong: { exp: "burn" } }),
  trick: () => simQ(2, "Find a change that makes bubbles of gas but is only <b>physical</b>.", st(), s => ok(has(s, "gas") && !X[s.exp].chem, "Boiling: the steam is still water — no new substance.", desc(s) + "."), { exp: "boil" }, { wrong: { exp: "vinegar" } }),
  slowColour: () => simQ(2, "Find a chemical change where the <b>only</b> sign is a <b>colour change</b>.", st(), s => ok(X[s.exp].chem && X[s.exp].signs.length === 1 && has(s, "colour"), "Rusting: iron + oxygen + water → rust.", desc(s) + "."), { exp: "rust" }, { wrong: { exp: "egg" } }),
  light: () => simQ(2, "Find a reaction that gives off a very bright <b>light</b> and leaves a <b>white powder</b>.", st(), s => ok(s.exp === "mg", "Magnesium + oxygen → magnesium oxide.", desc(s) + "."), { exp: "mg" }, { wrong: { exp: "burn" } }),
  sugarBack: () => simQ(3, "Dissolve sugar in water, then get the <b>sugar back</b>.", st({ exp: "dissolve" }), s => ok(s.exp === "dissolve" && s.rev === "evaporate", "Evaporating the water leaves the sugar — a physical change can be reversed.", "That doesn't bring the sugar back."), { rev: "evaporate" }, { lock: ["exp"], wrong: { rev: "filter" } }),
  steam: () => simQ(3, "Boil water, then turn the steam <b>back into water</b>.", st({ exp: "boil" }), s => ok(s.exp === "boil" && s.rev === "cool", "Cooling condenses the steam.", "That doesn't turn steam back into water."), { rev: "cool" }, { lock: ["exp"], wrong: { rev: "evaporate" } }),
  eggNo: () => simQ(3, "Fry an egg, then cool it. Show that the change <b>cannot be reversed</b>.", st({ exp: "egg" }), s => ok(s.exp === "egg" && s.rev === "cool", "Cooling does not make the egg runny again — new substances were made.", "Fry the egg, then cool it."), { rev: "cool" }, { lock: ["exp"], wrong: { rev: "none" } }),
  filterIt: () => simQ(3, "Make the yellow precipitate, then <b>separate</b> it from the liquid.", st({ exp: "precip" }), s => ok(s.exp === "precip" && s.rev === "filter", "Filtering traps the insoluble solid.", "That doesn't separate the solid."), { rev: "filter" }, { lock: ["exp"], wrong: { rev: "evaporate" } })
};
const D = {
  sort: diff => E.diaT("ch-pick", diff, 2, () => { const pool = E.shuffle(Object.keys(X)).slice(0, 6), want = choice([true, false]), ans = pool.filter(k => X[k].chem === want);
    if (!ans.length) pool[0] = want ? "burn" : "melt";
    const answer = pool.filter(k => X[k].chem === want);
    return { kind: "pick", many: true, title: "👆 Sort the changes", prompt: `Click ALL the <b>${want ? "chemical" : "physical"}</b> changes.`, answer, names: Object.fromEntries(pool.map(k => [k, X[k].n])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fff8f1"/>${pool.map((k, i) => { const x = 20 + (i % 3) * 280, y = 20 + Math.floor(i / 3) * 140; return `<g class="pk" data-k="${k}"><rect x="${x}" y="${y}" width="260" height="120" rx="14" fill="#fff" stroke="#ffccbc" stroke-width="2"/><rect x="${x}" y="${y}" width="260" height="120" rx="14" fill="none" ${E.ring(s2[k])}/><rect x="${x + 20}" y="${y + 30}" width="40" height="40" rx="8" fill="${X[k].a[0]}" stroke="#90a4ae"/><text x="${x + 80}" y="${y + 58}" font-size="18">➡</text><rect x="${x + 110}" y="${y + 30}" width="40" height="40" rx="8" fill="${X[k].b[0]}" stroke="#90a4ae"/>${T(x + 130, y + 100, X[k].n, { s: 12, c: "#4e342e" })}</g>`; }).join("")}</svg>`,
      explain: "Chemical: " + pool.filter(k => X[k].chem).map(k => X[k].n.toLowerCase()).join(", ") + ". Physical: " + (pool.filter(k => !X[k].chem).map(k => X[k].n.toLowerCase()).join(", ") || "none") + ".", summary: "Sort physical and chemical changes" }; }),
  mcq: diff => E.diaT("ch-mcq", diff, 2, () => { const q = choice([
      { ask: "Which is the BEST evidence that a chemical change happened?", ok: "A new substance with different properties was made", bad: ["The shape changed", "It melted", "It was cut into pieces"], ex: "Only chemical changes make new substances." },
      { ask: "Why is dissolving salt in water a physical change?", ok: "The salt is still there and can be recovered by evaporation", bad: ["Salt disappears forever", "A gas is made", "It gets very hot"], ex: "No new substance — the salt is just spread out in the water." },
      { ask: "A nail slowly turns orange-brown in wet air. What kind of change is this?", ok: "Chemical — rust is a new substance", bad: ["Physical — it is only a colour", "Physical — it can be washed off", "No change at all"], ex: "Iron reacts with oxygen and water to make rust." }]);
    return { kind: "mcq", title: "📘 Changes", prompt: "Think about new substances.", visual: render(st({ exp: "rust", reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Physical and chemical change concepts" }; }),
  num: diff => E.diaT("ch-num", diff, 3, () => { const c = choice([[20, 35], [50, 22], [18, 4]]);
    return { kind: "num", title: "🌡️ Temperature change", prompt: `A mixture starts at <b>${c[0]} °C</b> and ends at <b>${c[1]} °C</b>.`, visual: render(st({ exp: c[1] < c[0] ? "vinegar" : "burn", reveal: true })),
      fields: [{ label: "Temperature change (end − start)", unit: "°C", answer: c[1] - c[0] }], explain: `${c[1]} − ${c[0]} = ${c[1] - c[0]} °C. ${c[1] < c[0] ? "Negative: it got colder (endothermic)." : "Positive: it got hotter (exothermic)."}`, summary: "Temperature change" }; })
};
const LEVELS = {
  1: { intro: "Try experiments and look for evidence: is a NEW substance made?", pool: () => [S(1, 1, C.newSub), S(2, 1, C.physical), S(2, 1, C.solid), S(3, 1, C.chemGas), D.sort(1), D.mcq(2), D.sort(3)] },
  2: { intro: "Be a detective: match each sign of a chemical reaction to an experiment.", pool: () => [S(1, 1, C.colder), S(2, 1, C.light), S(2, 1, C.slowColour), S(3, 1, C.trick), D.sort(1), D.num(2), D.mcq(3)] },
  3: { intro: "Can the change be reversed? Physical changes can — chemical changes usually cannot.", pool: () => [S(1, 1, C.sugarBack), S(2, 1, C.steam), S(3, 1, C.eggNo), S(3, 1, C.filterIt), D.num(1), D.sort(2), D.mcq(3)] }
};
const explore = E.exploreSim({
  intro: "Choose an experiment and press ▶ to see what happens and which signs appear.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Do it",
  goals: () => [{ txt: "Do a physical change", test: (s, m) => m.p }, { txt: "Do a chemical change", test: (s, m) => m.c }, { txt: "See 3 different signs of reaction", test: (s, m) => (m.sg || []).length >= 3 }],
  track: (s, m, ran) => { if (!ran) return; if (X[s.exp].chem) m.c = 1; else m.p = 1; m.sg = Array.from(new Set((m.sg || []).concat(X[s.exp].signs))); },
  facts: () => "📘 A <b>chemical change</b> makes a new substance — look for gas, colour change, temperature change, a precipitate or light. A <b>physical change</b> only changes shape or state."
});
E.start({ labId: "changes", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔥", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🔥", "🫧", "🎨", "✨"],
  exploreDemo: () => [{ set: { exp: "melt" }, run: true }, { set: { exp: "burn" }, run: true }] });
})();
