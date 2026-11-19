"use strict";
// ===== Static Electricity — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const qOf = r => -2 * r;
function inter(s) { const q = qOf(s.rubs);
  if (s.target === "sweater") return q ? "attract" : "none";
  if (s.target === "wall") return Math.abs(q) >= 6 ? "stick" : q ? "slips" : "none";
  if (s.target === "neutral") return q ? "attract" : "none";
  return q ? "repel" : "none"; }
const qB = s => (s.signB === "+" ? 1 : -1) * 2 * s.rubsB;
const F3 = s => Math.round(Math.abs(qOf(s.rubs) * qB(s)) / (s.d * s.d) * 100) / 100;
const kind3 = s => !qOf(s.rubs) || !qB(s) ? "none" : (qOf(s.rubs) * qB(s) > 0 ? "repel" : "attract");
function signs(cx, cy, n, sign, rx, ry, seed) { let g = ""; for (let i = 0; i < n; i++) { const a = i * 2.39996 + seed, r = Math.sqrt((i + 0.5) / Math.max(n, 1)); const x = cx + rx * 0.8 * r * Math.cos(a), y = cy + ry * 0.8 * r * Math.sin(a); g += sign === "-" ? `<circle cx="${x}" cy="${y}" r="7" fill="#1e88e5"/><rect x="${x - 4}" y="${y - 1}" width="8" height="2" fill="#fff"/>` : `<circle cx="${x}" cy="${y}" r="7" fill="#e53935"/><rect x="${x - 4}" y="${y - 1}" width="8" height="2" fill="#fff"/><rect x="${x - 1}" y="${y - 4}" width="2" height="8" fill="#fff"/>`; } return g; }
function balloon(x, y, q, col, label) { return `<line x1="${x}" y1="${y + 70}" x2="${x - 6}" y2="${y + 150}" stroke="#90a4ae" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="52" ry="66" fill="${col}" opacity=".9"/><polygon points="${x - 6},${y + 64} ${x + 6},${y + 64} ${x},${y + 74}" fill="${col}"/>${signs(x, y, Math.abs(q), q < 0 ? "-" : "+", 52, 66, 1)}${label ? T(x, y - 76, label, { s: 13, c: "#37474f" }) : ""}`; }
function render(s) {
  const show = s.reveal || s.showVals; let g = "";
  if (s.mode !== 3) { const q = qOf(s.rubs), r = s.mode === 2 && show ? inter(s) : null;
    // sweater
    g += `<path d="M30,120 L90,90 L150,90 L210,120 L190,170 L170,160 L170,380 L50,380 L50,160 L30,170 Z" fill="#7cb342" stroke="#558b2f" stroke-width="3"/>${signs(110, 250, 24, "+", 55, 110, 0.3)}${signs(110, 250, Math.max(0, 24 - s.rubs * 2), "-", 50, 100, 2.1)}${T(110, 405, "sweater: " + (s.rubs ? "+" + s.rubs * 2 : "0"), { s: 14, c: "#33691e" })}`;
    let bx = s.mode === 1 ? 330 : 380;
    if (r === "attract" && s.target === "sweater") bx = 250; if (r === "stick") bx = 600; if (r === "repel") bx = 300; if (r === "attract" && s.target === "neutral") bx = 470;
    g += balloon(bx, 200, q, "#ffca28", "balloon: " + (q || 0));
    if (s.mode === 2) { if (s.target === "wall") g += `<rect x="660" y="20" width="60" height="400" fill="#d7ccc8"/>${signs(690, 220, 10, "+", 26, 150, 0.7)}${signs(690, 220, 10, "-", 26, 150, 2.7).replace(/cx="(\d+\.?\d*)"/g, (m, v) => `cx="${+v + (r === "stick" ? 10 : 0)}"`)}${T(690, 440, "wall (neutral)", { s: 13, c: "#5d4037" })}`;
      else if (s.target === "neutral") g += balloon(600, 200, 0, "#80deea", "neutral balloon") + signs(600, 200, 6, "+", 52, 66, 0.4) + signs(600, 200, 6, "-", 52, 66, 2.2);
      else if (s.target === "charged") g += balloon(600, 200, -6, "#ef9a9a", "charged balloon: −6"); }
    g += `<g transform="translate(${s.mode === 2 ? 470 : 470},360)"><rect width="370" height="76" rx="12" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(185, 28, `rubbed ${s.rubs} time${s.rubs === 1 ? "" : "s"} → ${s.rubs * 2} electrons moved to the balloon`, { s: 13, c: "#0d47a1" })}${s.mode === 2 ? T(185, 56, show ? { attract: "↔ they ATTRACT", stick: "📌 the balloon STICKS to the wall", slips: "the balloon slides down (too little charge)", repel: "⟷ they REPEL", none: "nothing happens (no charge)" }[r] : "press ▶ to let go of the balloon", { s: 15, c: show ? "#c62828" : "#78909c" }) : T(185, 56, "balloon " + (q ? "NEGATIVE" : "neutral") + " · sweater " + (s.rubs ? "POSITIVE" : "neutral"), { s: 14, c: "#37474f" })}</g>`;
  } else { const qa = qOf(s.rubs), qb = qB(s), k = show ? kind3(s) : "none", gap = 60 + s.d * 100, cx = 300, ax = cx - gap / 2, bx = cx + gap / 2;
    g += balloon(ax, 190, qa, "#ffca28", "A: " + qa) + balloon(bx, 190, qb, qb > 0 ? "#ef9a9a" : "#90caf9", "B: " + (qb > 0 ? "+" : "") + qb);
    g += `<line x1="${ax}" x2="${bx}" y1="300" y2="300" stroke="#78909c" stroke-width="2"/>${T(cx, 320, "distance " + s.d, { s: 13, c: "#546e7a" })}`;
    if (show && k !== "none") { const L = Math.min(80, 8 + F3(s) * 4), dir = k === "repel" ? -1 : 1; g += `<line x1="${ax}" y1="120" x2="${ax + dir * L}" y2="120" stroke="#c62828" stroke-width="4"/><polygon points="${ax + dir * (L + 10)},120 ${ax + dir * L},113 ${ax + dir * L},127" fill="#c62828"/><line x1="${bx}" y1="120" x2="${bx - dir * L}" y2="120" stroke="#c62828" stroke-width="4"/><polygon points="${bx - dir * (L + 10)},120 ${bx - dir * L},113 ${bx - dir * L},127" fill="#c62828"/>`; }
    g += `<g transform="translate(620,40)"><rect width="225" height="${show ? 170 : 110}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(112, 28, "F = qA × qB ÷ d²", { s: 15, c: "#0d47a1" })}${T(112, 54, `${qa} × ${qb} ÷ ${s.d}²`, { s: 14, c: "#37474f" })}
      ${show ? T(112, 92, "force = " + fmt(F3(s)) + " units", { s: 17, c: "#c62828" }) + T(112, 124, { repel: "⟷ REPEL (like charges)", attract: "↔ ATTRACT (unlike charges)", none: "no force" }[kind3(s)], { s: 14, c: "#6a1b9a" }) : T(112, 88, "press ▶ to release", { s: 13, c: "#78909c" })}</g>`; }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#f4f8fc"/>${g}</svg>`;
}
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 3) return [{ id: "rubs", type: "step", label: "Rubs on balloon A (always −)", min: 0, max: 5, lock: lk("rubs") }, { id: "rubsB", type: "step", label: "Charge given to balloon B", min: 0, max: 5, lock: lk("rubsB") }, { id: "signB", type: "choice", label: "Balloon B charge", options: [{ v: "-", label: "Negative (−)" }, { v: "+", label: "Positive (+)" }], lock: lk("signB") }, { id: "d", type: "choice", label: "Distance", options: [1, 2, 3, 4].map(v => ({ v, label: String(v) })), lock: lk("d") }];
  return [{ id: "rubs", type: "step", label: "Rub the balloon on the sweater", min: 0, max: 10, lock: lk("rubs") }].concat(mode === 2 ? [{ id: "target", type: "choice", label: "Bring the balloon near", options: [{ v: "sweater", label: "🧶 Sweater" }, { v: "wall", label: "🧱 Wall" }, { v: "neutral", label: "🎈 Neutral balloon" }, { v: "charged", label: "🎈 Charged balloon (−)" }], wide: true, lock: lk("target") }] : []);
};
const stFor = (mode, o) => Object.assign(mode === 3 ? { mode, rubs: 1, rubsB: 1, signB: "-", d: 2 } : { mode, rubs: 0, target: "wall" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const HINT = { 1: "Rubbing moves ELECTRONS (negative) from the sweater to the balloon: each rub moves 2. The balloon becomes negative, the sweater positive.", 2: "Unlike charges attract, like charges repel. A charged balloon can stick to a neutral wall (needs at least 6 charges).", 3: "Force = charge A × charge B ÷ distance². Twice the distance → ¼ of the force." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🎈 Charging challenge", 2: "🧲 Attract or repel?", 3: "⚡ Force challenge" }[mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("stat-sim", diff, uses, mk);
const C = {
  q8: () => { const n = choice([8, 6, 12, 4]); return simQ(1, `Give the balloon a charge of exactly <b>−${n}</b>.`, stFor(1), s => ok(qOf(s.rubs) === -n, `${s.rubs} rubs × 2 electrons = −${n}.`, `The balloon has ${qOf(s.rubs)}.`), { rubs: n / 2 }, { wrong: { rubs: n / 2 + 1 } }); },
  sw: () => simQ(1, "Make the <b>sweater</b> have a charge of <b>+10</b>.", stFor(1), s => ok(s.rubs * 2 === 10, "The sweater lost 10 electrons, so it is +10.", `The sweater is +${s.rubs * 2}.`), { rubs: 5 }, { wrong: { rubs: 10 } }),
  neutral: () => simQ(1, "The balloon was rubbed 6 times. Make <b>both</b> objects <b>neutral</b> again.", stFor(1, { rubs: 6 }), s => ok(s.rubs === 0, "With no electrons moved, both have equal + and −.", "Something is still charged."), { rubs: 0 }, { wrong: { rubs: 1 } }),
  total: () => simQ(1, "Move exactly <b>14 electrons</b> in total from the sweater to the balloon.", stFor(1), s => ok(s.rubs === 7, "7 rubs × 2 = 14 electrons.", `${s.rubs * 2} electrons moved.`), { rubs: 7 }, { wrong: { rubs: 14 > 10 ? 6 : 6 } }),
  stick: () => simQ(2, "Make the balloon <b>stick to the wall</b> with the <b>fewest rubs</b>.", stFor(2, { target: "wall" }), s => ok(inter(s) === "stick" && s.rubs === 3, "3 rubs = −6: just enough to stick.", inter(s) === "stick" ? "It sticks — but fewer rubs work." : "The balloon slides down."), { rubs: 3 }, { lock: ["target"], wrong: { rubs: 2 } }),
  rep: () => simQ(2, "Make the balloon <b>repel</b> something.", stFor(2, { target: "sweater" }), s => ok(inter(s) === "repel", "Both balloons are negative: like charges repel.", "That does not repel."), { rubs: 4, target: "charged" }, { wrong: { rubs: 4, target: "sweater" } }),
  noReact: () => simQ(2, "Bring the balloon near the <b>charged balloon</b> but make <b>nothing happen</b>.", stFor(2, { target: "charged", rubs: 3 }), s => ok(inter(s) === "none", "A neutral balloon (0 rubs) feels no force here.", "Something happens."), { rubs: 0 }, { lock: ["target"], wrong: { rubs: 1 } }),
  sweatr: () => simQ(2, "Make the balloon <b>attract</b> something that is <b>positively charged</b>.", stFor(2, { target: "wall" }), s => ok(s.target === "sweater" && inter(s) === "attract", "The rubbed sweater is positive: it attracts the negative balloon.", s.target !== "sweater" ? "That object is not positively charged." : "The balloon needs some charge."), { rubs: 4, target: "sweater" }, { wrong: { rubs: 4, target: "neutral" } }),
  f4: () => { const c = choice([[4, { rubs: 1, rubsB: 1, signB: "-", d: 1 }], [9, { rubs: 3, rubsB: 3, signB: "-", d: 2 }], [1, { rubs: 1, rubsB: 1, signB: "-", d: 2 }]]); return simQ(3, `Make the balloons <b>repel</b> with a force of exactly <b>${c[0]} units</b>.`, stFor(3, { rubs: 2, rubsB: 2 }), s => ok(F3(s) === c[0] && kind3(s) === "repel", `${qOf(s.rubs)} × ${qB(s)} ÷ ${s.d}² = ${c[0]}.`, `Force ${fmt(F3(s))} units, ${kind3(s)}.`), c[1], { wrong: Object.assign({}, c[1], { d: c[1].d + 1 }) }); },
  att: () => simQ(3, "Make the balloons <b>attract</b> with a force of <b>16 units</b>.", stFor(3, { rubs: 2, rubsB: 2, signB: "-" }), s => ok(kind3(s) === "attract" && F3(s) === 16, "−4 × +4 ÷ 1² = 16, opposite charges attract.", `Force ${fmt(F3(s))}, ${kind3(s)}.`), { signB: "+", d: 1 }, { lock: ["rubs", "rubsB"], wrong: { signB: "-", d: 1 } }),
  quart: () => simQ(3, "The force is 16 units at distance 1. Change <b>only the distance</b> to make it <b>1 unit</b>.", stFor(3, { rubs: 2, rubsB: 2, d: 1 }), s => ok(F3(s) === 1, "4 times the distance → 1/16 of the force.", `Force ${fmt(F3(s))} units.`), { d: 4 }, { lock: ["rubs", "rubsB", "signB"], wrong: { d: 2 } }),
  same: () => simQ(3, "At distance <b>2</b>, make the force the same as 2 × 2 charge at distance 1 (4 units) — <b>repelling</b>.", stFor(3, { d: 2, rubs: 1, rubsB: 1 }), s => ok(F3(s) === 4 && kind3(s) === "repel", "−4 × −4 ÷ 4 = 4: double each charge to make up for double distance.", `Force ${fmt(F3(s))}, ${kind3(s)}.`), { rubs: 2, rubsB: 2, signB: "-" }, { lock: ["d"], wrong: { rubs: 2, rubsB: 1, signB: "-" } })
};

// ---------- diagram tasks ----------
const D = {
  pick: diff => E.diaT("stat-pick", diff, 1, () => { const sets = { r: ["-", "-"], a: ["-", "+"], n: ["-", "0"] }, order = E.shuffle(["r", "a", "n"]); const q = choice([["r", "will <b>repel</b>"], ["a", "will <b>attract</b> most strongly"]]);
    return { kind: "pick", title: "👆 Like or unlike charges?", prompt: "Click the pair that " + q[1] + ".", answer: [q[0]], names: { r: "two negative balloons", a: "negative and positive balloons", n: "a charged and a neutral balloon" },
      visual: st2 => `<svg viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="300" fill="#f4f8fc"/>${order.map((k, i) => { const x = 8 + i * 298, p = sets[k]; const mk = (bx, sg) => `<ellipse cx="${bx}" cy="130" rx="44" ry="56" fill="${sg === "-" ? "#90caf9" : sg === "+" ? "#ef9a9a" : "#e0e0e0"}"/>${sg === "0" ? signs(bx, 130, 3, "+", 44, 56, 0.4) + signs(bx, 130, 3, "-", 44, 56, 2.2) : signs(bx, 130, 5, sg, 44, 56, 1)}`;
        return `<g class="pk" data-k="${k}"><rect x="${x}" y="8" width="286" height="284" rx="14" fill="#fff" ${E.ring(st2[k])}/>${mk(x + 85, p[0])}${mk(x + 200, p[1])}${T(x + 143, 270, "Pair " + (i + 1), { s: 13 })}</g>`; }).join("")}</svg>`,
      explain: "Like charges (− and −) repel. Unlike charges (− and +) attract strongly. A charged object also weakly attracts a neutral one (by induction).", summary: "Charges attract and repel" }; }),
  fNum: diff => E.diaT("stat-num", diff, 2, () => { const c = choice([[2, 4], [3, 9], [0.5, 0.25], [4, 16]]);
    return { kind: "num", title: "🧮 Distance and force", prompt: `Two charged balloons are moved so the distance between them is divided by ${c[0]}.`, visual: render(stFor(3, { rubs: 2, rubsB: 2, d: 2, showVals: false })),
      fields: [{ label: "The force becomes … times bigger", unit: "×", answer: c[1], tol: 0.01 }], explain: `F ∝ 1 ÷ d²: dividing d by ${c[0]} multiplies F by ${c[0]}² = ${c[1]}.`, summary: "Inverse square law" }; }),
  eNum: diff => E.diaT("stat-num", diff, 3, () => { const r = choice([3, 5, 7]);
    return { kind: "num", title: "🔢 Count the charges", prompt: `A balloon is rubbed on a neutral sweater ${r} times (2 electrons each time).`, visual: render(stFor(1, { rubs: r })),
      fields: [{ label: "Charge on the balloon", unit: "", answer: -2 * r }, { label: "Charge on the sweater", unit: "", answer: 2 * r }], explain: `The balloon gains ${2 * r} electrons (−${2 * r}); the sweater loses them (+${2 * r}). Charge is conserved: total = 0.`, summary: "Conservation of charge" }; }),
  mcq: diff => E.diaT("stat-mcq", diff, 2, () => { const q = choice([
      { ask: "When a balloon is rubbed on a sweater, what moves?", ok: "Electrons move from the sweater to the balloon", bad: ["Protons move to the balloon", "Positive charges move to the sweater", "Atoms move from the balloon"], ex: "Only electrons move; protons stay in the nuclei." },
      { ask: "Why does a charged balloon stick to a neutral wall?", ok: "It repels the wall's electrons, leaving a positive surface that attracts it", bad: ["The wall is always positive", "The balloon is sticky", "Air pressure pushes it"], ex: "Induced charge: the wall surface near the balloon becomes slightly positive." },
      { ask: "Why are lightning conductors used on tall buildings?", ok: "To carry charge safely to the ground", bad: ["To make more lightning", "To store electrons", "To charge the building"], ex: "They give the charge an easy path to earth." }]);
    return { kind: "mcq", title: "📘 Static electricity", prompt: "Think about charges.", visual: render(stFor(2, { rubs: 4, target: "wall", showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Static electricity ideas" }; })
};
const LEVELS = {
  1: { intro: "Rub a balloon on a sweater. Electrons move from the sweater to the balloon.", pool: () => [S(1, 1, C.neutral), S(2, 1, C.q8), S(2, 1, C.sw), S(3, 1, C.total), S(3, 1, C.q8), D.pick(1), D.eNum(2), D.mcq(3)] },
  2: { intro: "Bring the charged balloon near different objects: attract, repel or stick?", pool: () => [S(1, 1, C.sweatr), S(2, 1, C.rep), S(2, 1, C.noReact), S(3, 1, C.stick), D.pick(1), D.mcq(2), D.eNum(3)] },
  3: { intro: "The electric force between two balloons depends on their charges and the distance.", pool: () => [S(1, 1, C.att), S(2, 1, C.f4), S(3, 1, C.quart), S(3, 1, C.same), D.pick(1), D.fNum(2), D.fNum(3)] }
};
const explore = E.exploreSim({
  intro: "Rub the balloon and watch the charges move. (Level 2: bring it near objects. Level 3: two balloons.)",
  state: lv => stFor(lv), controls: lv => ctlsFor(lv), render, run, runLabel: "▶ Let go",
  goals: lv => lv === 3 ? [{ txt: "Make the balloons repel", test: (s, m) => m.repel }, { txt: "Make the balloons attract", test: (s, m) => m.attract }] : lv === 2 ? [{ txt: "Make the balloon stick to the wall", test: (s, m) => m.stick }, { txt: "Make the balloons repel", test: (s, m) => m.repel }] : [{ txt: "Rub the balloon 5 times", test: s => s.rubs >= 5 }, { txt: "Make it neutral again", test: (s, m) => m.back }],
  track: (s, m, ran) => { if (s.mode === 1) { if (s.rubs >= 5) m.five = 1; if (m.five && s.rubs === 0) m.back = 1; return; } if (!ran) return; if (s.mode === 2) m[inter(s)] = 1; else m[kind3(s)] = 1; },
  facts: lv => lv === 3 ? "📘 <b>F = qA × qB ÷ d²</b> (in units). Like charges repel, unlike charges attract." : "📘 Rubbing moves <b>electrons</b>. Gaining electrons → negative. Losing electrons → positive. Like charges repel, unlike attract."
});
E.start({ labId: "static", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🎈", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🎈", "⚡", "✨", "⭐"],
  exploreDemo: lv => lv === 3 ? [{ set: { signB: "-" }, run: true }, { set: { signB: "+" }, run: true }] : lv === 2 ? [{ set: { rubs: 4, target: "wall" }, run: true }, { set: { target: "charged" }, run: true }] : [{ set: { rubs: 5 } }, { set: { rubs: 0 } }] });
})();
