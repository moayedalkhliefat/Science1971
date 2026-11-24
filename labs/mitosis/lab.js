"use strict";
// ===== Cell Division (Mitosis) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const ST = ["Interphase", "Prophase", "Metaphase", "Anaphase", "Telophase", "Cytokinesis"];
const DESC = ["DNA is copied; chromosomes are long and thin inside the nucleus.", "Chromosomes coil up and become visible (X shapes); the nucleus breaks down.", "Chromosomes line up in the MIDDLE of the cell on the spindle.", "Sister chromatids are PULLED APART to opposite ends.", "Two new nuclei form around each set of chromosomes.", "The cytoplasm divides: two identical daughter cells."];
const COL = ["#e53935", "#1e88e5", "#43a047", "#fb8c00", "#8e24aa", "#00897b", "#6d4c41", "#d81b60"];
const cells = s => Math.pow(2, Math.floor(s.hrs / s.cyc));
const rod = (x, y, a, c, len) => `<line x1="${x - Math.cos(a) * len}" y1="${y - Math.sin(a) * len}" x2="${x + Math.cos(a) * len}" y2="${y + Math.sin(a) * len}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
const X = (x, y, c, sc) => `<g>${rod(x, y, 0.62, c, 14 * (sc || 1))}${rod(x, y, Math.PI - 0.62, c, 14 * (sc || 1))}<circle cx="${x}" cy="${y}" r="3.2" fill="#263238"/></g>`;
const V = (x, y, c, dir, k) => { k = k || 1; return `<path d="M${x - dir * 2},${y} q${-dir * 12 * k},${-10 * k} ${-dir * 14 * k},${-22 * k} M${x - dir * 2},${y} q${-dir * 12 * k},${10 * k} ${-dir * 14 * k},${22 * k}" stroke="${c}" stroke-width="${6.5 * k}" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="3" fill="#263238"/>`; };
const nucleus = (x, y, r, n, thin, dashed) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ede7f6" stroke="#7e57c2" stroke-width="3" ${dashed ? 'stroke-dasharray="8 7"' : ""}/>${thin ? Array.from({ length: n }, (_, i) => { const u = r * .16; return `<path d="M${x - r * .62 + (i % 3) * r * .22},${y - r * .45 + Math.floor(i / 3) * r * .32} q${u},${-u} ${2 * u},0 t${2 * u},0 t${2 * u},0" stroke="${COL[i % 8]}" stroke-width="${Math.max(1.4, r * .04)}" fill="none" opacity=".85"/>`; }).join("") : ""}`;
function cellPic(s, cx, cy, sc) {
  const k = s.stage, n = s.n; let g = "";
  const body = (w, h) => `<ellipse cx="${cx}" cy="${cy}" rx="${w}" ry="${h}" fill="#fff8e1" stroke="#8d6e63" stroke-width="3"/>`;
  const R = 150 * sc, H = 120 * sc, ys = i => cy - (n - 1) * 15 * sc + i * 30 * sc;
  const spindle = (pts) => [-1, 1].map(d => pts.map(p => `<line x1="${cx + d * R * .92}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#90a4ae" stroke-width="1.4"/>`).join("") + `<g transform="translate(${cx + d * R * .92},${cy})"><rect x="-5" y="-9" width="10" height="18" rx="3" fill="#5d4037"/></g>`).join("");
  if (k === 0) g = body(R, H) + nucleus(cx, cy, 62 * sc, n, true) + `<circle cx="${cx + 18 * sc}" cy="${cy - 14 * sc}" r="${9 * sc}" fill="#9575cd"/>`;
  else if (k === 1) { g = body(R, H) + nucleus(cx, cy, 70 * sc, n, false, true); for (let i = 0; i < n; i++) g += X(cx - 40 * sc + (i % 3) * 40 * sc, cy - 30 * sc + Math.floor(i / 3) * 36 * sc, COL[i % 8], sc); }
  else if (k === 2) { g = body(R, H) + spindle(Array.from({ length: n }, (_, i) => [cx, ys(i)])); for (let i = 0; i < n; i++) g += X(cx, ys(i), COL[i % 8], sc * .9); g += `<line x1="${cx}" y1="${cy - H + 8}" x2="${cx}" y2="${cy + H - 8}" stroke="#bdbdbd" stroke-dasharray="4 5"/>`; }
  else if (k === 3) { const off = 70 * sc; g = body(R * 1.06, H * .95) + spindle(Array.from({ length: n }, (_, i) => [cx - off, ys(i)]).concat(Array.from({ length: n }, (_, i) => [cx + off, ys(i)]))); for (let i = 0; i < n; i++) g += V(cx - off, ys(i), COL[i % 8], 1, sc) + V(cx + off, ys(i), COL[i % 8], -1, sc); }
  else if (k === 4) { g = `<path d="M${cx},${cy - H * .55} C${cx - 30 * sc},${cy - H * 1.15} ${cx - R * 1.25},${cy - H} ${cx - R * 1.2},${cy} C${cx - R * 1.25},${cy + H} ${cx - 30 * sc},${cy + H * 1.15} ${cx},${cy + H * .55} C${cx + 30 * sc},${cy + H * 1.15} ${cx + R * 1.25},${cy + H} ${cx + R * 1.2},${cy} C${cx + R * 1.25},${cy - H} ${cx + 30 * sc},${cy - H * 1.15} ${cx},${cy - H * .55}Z" fill="#fff8e1" stroke="#8d6e63" stroke-width="3"/>` + nucleus(cx - 95 * sc, cy, 46 * sc, n, true, true) + nucleus(cx + 95 * sc, cy, 46 * sc, n, true, true); }
  else { [-1, 1].forEach(d => { g += `<ellipse cx="${cx + d * 92 * sc}" cy="${cy}" rx="${82 * sc}" ry="${78 * sc}" fill="#fff8e1" stroke="#8d6e63" stroke-width="3"/>` + nucleus(cx + d * 92 * sc, cy, 40 * sc, n, true); }); }
  return g;
}
function render(s) {
  let g = `<rect width="860" height="450" fill="#f3eefa"/>`;
  if (s.mode === "grow") {
    const N = cells(s), gen = Math.floor(s.hrs / s.cyc), cols = Math.ceil(Math.sqrt(N * 1.8)), rows = Math.ceil(N / cols), sz = Math.min(64, 520 / cols, 330 / rows);
    g += `<rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>`;
    for (let i = 0; i < N; i++) { const x = 300 - cols * sz / 2 + (i % cols) * sz + sz / 2, y = 225 - rows * sz / 2 + Math.floor(i / cols) * sz + sz / 2; g += `<circle cx="${x}" cy="${y}" r="${sz * .42}" fill="#fff8e1" stroke="#8d6e63" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${sz * .17}" fill="#b39ddb"/>`; }
    g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(120, 34, "CELL CULTURE", { s: 13, c: "#4527a0" })}
      ${T(120, 90, s.hrs + " h", { s: 34, c: "#311b92" })}${T(120, 116, "time passed", { s: 12, c: "#7e57c2" })}
      ${T(120, 170, "1 cycle = " + s.cyc + " h", { s: 16, c: "#311b92" })}${T(120, 214, s.reveal ? gen + " divisions" : "", { s: 16, c: "#311b92" })}
      ${T(120, 280, s.reveal ? N + "" : "?", { s: 46, c: "#2e7d32" })}${T(120, 306, "cells", { s: 13, c: "#7e57c2" })}${T(120, 360, s.reveal ? "1 × 2^" + gen + " = " + N : "press ▶ to grow", { s: 13, c: "#5e35b1" })}</g>`;
  } else {
    g += `<rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>` + cellPic(s, 300, 225, 1);
    const count = s.stage === 3 ? 2 * s.n + " separate chromosomes" : s.stage >= 4 ? s.n + " in each nucleus" : s.n + " chromosomes";
    g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(120, 34, "STAGE", { s: 13, c: "#4527a0" })}
      ${T(120, 72, s.reveal ? ST[s.stage] : "?", { s: 24, c: "#311b92" })}
      <foreignObject x="16" y="96" width="208" height="150"><div xmlns="http://www.w3.org/1999/xhtml" style="font:14px Nunito,sans-serif;color:#4a3a6a;text-align:center;line-height:1.35">${s.reveal ? DESC[s.stage] : "Press ▶ to name the stage."}</div></foreignObject>
      ${T(120, 290, "2n = " + s.n, { s: 26, c: "#2e7d32" })}${T(120, 318, s.reveal ? count : "", { s: 13, c: "#5e35b1" })}
      ${ST.map((n, i) => `<circle cx="${30 + i * 36}" cy="372" r="11" fill="${i === s.stage ? "#7e57c2" : "#ede7f6"}" stroke="#7e57c2"/>${T(30 + i * 36, 398, n.slice(0, 3), { s: 10, c: "#5e35b1" })}`).join("")}</g>`;
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "stage", type: "choice", wide: true, label: "Stage", options: ST.map((n, i) => ({ v: i, label: n })), hide: s => s.mode === "grow", lock: lk("stage") },
  { id: "n", type: "choice", label: "Chromosomes (2n)", options: [4, 6, 8].map(v => ({ v, label: "" + v })), hide: s => s.mode === "grow" || lv < 2, lock: lk("n") },
  { id: "cyc", type: "choice", label: "Cell cycle time", options: [4, 6, 8, 12].map(v => ({ v, label: v + " h" })), hide: s => s.mode !== "grow", lock: lk("cyc") },
  { id: "hrs", type: "range", label: "Time", min: 0, max: 48, step: 2, unit: "h", nudge: 2, hide: s => s.mode !== "grow", lock: lk("hrs") }]; };
const st = o => Object.assign({ mode: "stage", stage: 0, n: 4, cyc: 12, hrs: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 700); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "grow" ? "🧫 Growth challenge" : "🔬 Mitosis challenge", prompt: "Set the cell, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: s0.mode === "grow" ? "Every cycle the number of cells DOUBLES: 1 → 2 → 4 → 8 → 16 … Divisions = time ÷ cycle time." : "Order: Interphase → Prophase → Metaphase (middle) → Anaphase (apart) → Telophase (two nuclei) → Cytokinesis (two cells)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mi-sim", diff, uses, mk);
const stageQ = (lv, goal, want, why, s0, o) => simQ(lv, goal, st(s0), s => ok(s.stage === want && (!o || !o.n || s.n === o.n), why, s.stage !== want ? `That is ${ST[s.stage]}.` : `Right stage, but the cell needs ${(o || {}).n} chromosomes.`), Object.assign({ stage: want }, o && o.n ? { n: o.n } : {}), { wrong: { stage: (want + 1) % 6 } });
const C = {
  meta: () => stageQ(1, "Stop the cell when the chromosomes are <b>lined up in the middle</b>.", 2, "Metaphase: chromosomes line up on the equator of the spindle.", { stage: 0 }),
  ana: () => stageQ(1, "Show the stage where the <b>sister chromatids are pulled apart</b>.", 3, "Anaphase: spindle fibres pull the chromatids to opposite poles.", { stage: 1 }),
  pro: () => stageQ(1, "Show the stage where chromosomes first become <b>visible as X shapes</b> and the nucleus breaks down.", 1, "Prophase: chromosomes condense and the nuclear membrane breaks down.", { stage: 4 }),
  telo: () => stageQ(1, "Show the stage where <b>two new nuclei</b> form (the cell has not split yet).", 4, "Telophase: two nuclei form; cytokinesis follows.", { stage: 2 }),
  meta6: () => stageQ(2, "Make a cell with <b>2n = 6</b> and stop it at <b>metaphase</b>.", 2, "6 chromosomes lined up in the middle.", { stage: 0, n: 4 }, { n: 6 }),
  ana8: () => stageQ(2, "Each new cell must get <b>8 chromosomes</b>. Show the cell while the chromatids are moving apart.", 3, "Anaphase with 2n = 8: 16 chromatids move, 8 to each pole.", { stage: 0, n: 4 }, { n: 8 }),
  cyto4: () => stageQ(2, "Show the <b>end</b> of mitosis: two daughter cells with <b>4 chromosomes</b> each.", 5, "Cytokinesis: two identical cells, each 2n = 4.", { stage: 2, n: 8 }, { n: 4 }),
  twelve: () => stageQ(2, "Show the stage where the cell contains <b>12 separate chromosomes</b> moving to the poles.", 3, "Anaphase with 2n = 6 → 12 chromatids moving apart.", { stage: 2, n: 4 }, { n: 6 }),
  g16: () => simQ(3, "Grow <b>1 cell into 16 cells</b> (cycle = 12 h).", st({ mode: "grow", cyc: 12, hrs: 0 }), s => ok(cells(s) === 16, "4 divisions × 12 h = 48 h → 2⁴ = 16 cells.", `${s.hrs} h → ${cells(s)} cells.`), { hrs: 48 }, { lock: ["cyc"], wrong: { hrs: 36 } }),
  g32: () => simQ(3, "The cycle is <b>6 h</b>. Get exactly <b>32 cells</b>.", st({ mode: "grow", cyc: 6, hrs: 0 }), s => ok(cells(s) === 32 && s.hrs === 30, "5 divisions × 6 h = 30 h → 32 cells.", `${s.hrs} h → ${cells(s)} cells.`), { hrs: 30 }, { lock: ["cyc"], wrong: { hrs: 24 } }),
  g8: () => simQ(3, "Cycle = <b>12 h</b>. When do you first reach <b>8 cells</b>?", st({ mode: "grow", cyc: 12, hrs: 0 }), s => ok(s.hrs === 36, "3 divisions × 12 h = 36 h.", `${s.hrs} h → ${cells(s)} cells.`), { hrs: 36 }, { lock: ["cyc"], wrong: { hrs: 24 } }),
  g64: () => simQ(3, "Get <b>64 cells in 24 hours</b>. Choose the cell cycle time.", st({ mode: "grow", cyc: 12, hrs: 24 }), s => ok(cells(s) === 64 && s.hrs === 24, "24 h ÷ 4 h = 6 divisions → 2⁶ = 64.", `${s.cyc} h cycle → ${cells(s)} cells in ${s.hrs} h.`), { cyc: 4 }, { lock: ["hrs"], wrong: { cyc: 6 } })
};
const D = {
  pick: diff => E.diaT("mi-pick", diff, 2, () => { const want = choice([1, 2, 3, 4]), opts = E.shuffle([0, 1, 2, 3, 4, 5]).filter(i => i !== want).slice(0, 3).concat([want]), order = E.shuffle(opts);
    return { kind: "pick", title: "👆 Spot the stage", prompt: `Click the cell in <b>${ST[want]}</b>.`, answer: ["s" + want], names: Object.fromEntries(order.map(i => ["s" + i, ST[i]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f3eefa"/>${order.map((k, i) => `<g class="pk" data-k="s${k}"><rect x="${15 + i * 212}" y="20" width="196" height="260" rx="14" fill="#fff" stroke="#d1c4e9" stroke-width="2"/><rect x="${15 + i * 212}" y="20" width="196" height="260" rx="14" fill="none" ${E.ring(s2["s" + k])}/>${cellPic(st({ stage: k, n: 4 }), 113 + i * 212, 150, 0.6)}</g>`).join("")}</svg>`,
      explain: `${ST[want]}: ${DESC[want]}`, summary: "Identify mitosis stages" }; }),
  num: diff => E.diaT("mi-num", diff, 2, () => { const n = choice([46, 8, 24, 14]), d = choice([2, 3, 4]);
    return { kind: "num", title: "🧮 Count the chromosomes", prompt: `A body cell with <b>2n = ${n}</b> divides by mitosis ${d} times in a row (every cell divides each time).`, visual: render(st({ stage: 5, n: 4, reveal: true })),
      fields: [{ label: "Chromosomes in each daughter cell", unit: "", answer: n }, { label: "Number of cells at the end", unit: "", answer: Math.pow(2, d) }], explain: `Mitosis keeps the number the same (${n}); ${d} divisions → 2^${d} = ${Math.pow(2, d)} cells.`, summary: "Mitosis numbers" }; }),
  grow: diff => E.diaT("mi-num", diff, 3, () => { const c = choice([[8, 40], [6, 24], [12, 48], [5, 30]]);
    return { kind: "num", title: "⏱️ Cell growth", prompt: `A cell divides every <b>${c[0]} h</b>. Start with 1 cell.`, visual: render(st({ mode: "grow", cyc: c[0], hrs: 0 })),
      fields: [{ label: `Divisions in ${c[1]} h`, unit: "", answer: c[1] / c[0] }, { label: `Cells after ${c[1]} h`, unit: "", answer: Math.pow(2, c[1] / c[0]) }], explain: `${c[1]} ÷ ${c[0]} = ${c[1] / c[0]} divisions → 2^${c[1] / c[0]} = ${Math.pow(2, c[1] / c[0])} cells.`, summary: "Cell growth calculation" }; }),
  mcq: diff => E.diaT("mi-mcq", diff, 2, () => { const q = choice([
      { ask: "Which stage comes straight AFTER metaphase?", ok: "Anaphase", bad: ["Prophase", "Telophase", "Interphase"], ex: "Pro → Meta → Ana → Telo." },
      { ask: "What is special about the two daughter cells made by mitosis?", ok: "They are genetically identical to the parent cell", bad: ["They have half the chromosomes", "They are always different sizes", "They have no nucleus"], ex: "Mitosis copies the DNA exactly — used for growth and repair." },
      { ask: "When is the DNA copied?", ok: "Interphase", bad: ["Metaphase", "Anaphase", "Cytokinesis"], ex: "DNA replication happens before mitosis, in interphase." }]);
    return { kind: "mcq", title: "📘 Mitosis ideas", prompt: "Think about the cell cycle.", visual: render(st({ stage: 2, n: 4, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Mitosis concepts" }; })
};
const LEVELS = {
  1: { intro: "Watch a cell divide by mitosis. Stop it at the right stage!", pool: () => [S(1, 1, C.meta), S(2, 1, C.ana), S(2, 1, C.pro), S(3, 1, C.telo), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Count the chromosomes: mitosis keeps the number the same in every new cell.", pool: () => [S(1, 1, C.meta6), S(2, 1, C.cyto4), S(2, 1, C.ana8), S(3, 1, C.twelve), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Cells keep dividing: 1 → 2 → 4 → 8 … Control the time and the cell cycle.", pool: () => [S(1, 1, C.g16), S(2, 1, C.g8), S(3, 1, C.g32), S(3, 1, C.g64), D.num(1), D.grow(2), D.grow(3)] }
};
const explore = E.exploreSim({
  intro: "Click through the stages of mitosis and press ▶ to name each one.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Name it",
  goals: () => [{ txt: "See the chromosomes line up (metaphase)", test: (s, m) => m.m }, { txt: "See them pulled apart (anaphase)", test: (s, m) => m.a }, { txt: "Finish with two cells (cytokinesis)", test: (s, m) => m.c }],
  track: (s, m, ran) => { if (!ran) return; if (s.stage === 2) m.m = 1; if (s.stage === 3) m.a = 1; if (s.stage === 5) m.c = 1; },
  facts: () => "📘 <b>Mitosis</b> makes two identical cells with the SAME number of chromosomes. It is used for growth and repair."
});
E.start({ labId: "mitosis", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧫", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧫", "🧬", "🔬", "✨"],
  exploreDemo: () => [{ set: { stage: 2 }, run: true }, { set: { stage: 3 }, run: true }, { set: { stage: 5 }, run: true }] });
})();
