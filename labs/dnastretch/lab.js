"use strict";
// ===== Stretching DNA — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const gcPairs = s => Math.round(s.bp * s.gc / 100), atPairs = s => s.bp - gcPairs(s);
const hbonds = s => 2 * atPairs(s) + 3 * gcPairs(s);
const fUnzip = s => r2(10 + 0.1 * s.gc); // pN
const unzipped = s => s.force >= fUnzip(s);
const contour = s => r2(s.len * 0.34); // nm
const OVER = 65;
const extFrac = F => F <= 10 ? r2(0.3 + 0.07 * F) : F < OVER ? r2(1 + 0.002 * (F - 10)) : 1.7;
const ext = s => r2(contour(s) * extFrac(s.force));
const phase = F => F < 10 ? "coiled (entropic spring)" : F < OVER ? "straight B-DNA" : "overstretched";
const COL = { A: "#42a5f5", T: "#ffa726", G: "#66bb6a", C: "#ab47bc" };
function pairsList(s, n) { const g = Math.round(n * s.gc / 100); return Array.from({ length: n }, (_, i) => Math.floor((i + 1) * g / n) - Math.floor(i * g / n)); }
function rung(x, y1, y2, gc, flip, lbl) {
  const a = gc ? (flip ? "C" : "G") : (flip ? "T" : "A"), b = gc ? (flip ? "G" : "C") : (flip ? "A" : "T"), m = (y1 + y2) / 2, n = gc ? 3 : 2;
  let g = `<rect x="${x - 9}" y="${y1}" width="18" height="${m - y1 - 6}" rx="4" fill="${COL[a]}"/><rect x="${x - 9}" y="${m + 6}" width="18" height="${y2 - m - 6}" rx="4" fill="${COL[b]}"/>`;
  for (let k = 0; k < n; k++) { const dx = (k - (n - 1) / 2) * 6; g += `<line x1="${x + dx}" y1="${m - 6}" x2="${x + dx}" y2="${m + 6}" stroke="#263238" stroke-width="1.5" stroke-dasharray="2 2"/>`; }
  if (lbl) g += T(x, y1 + 14, a, { s: 11, c: "#fff" }) + T(x, y2 - 5, b, { s: 11, c: "#fff" });
  return g;
}
function ladder(s, x0, x1, y, show) {
  const n = 12, pl = pairsList(s, n), w = (x1 - x0) / n;
  let g = `<rect x="${x0 - 6}" y="${y - 66}" width="${x1 - x0 + 12}" height="10" rx="5" fill="#455a64"/><rect x="${x0 - 6}" y="${y + 56}" width="${x1 - x0 + 12}" height="10" rx="5" fill="#455a64"/>`;
  pl.forEach((gc, i) => g += rung(x0 + w * (i + 0.5), y - 56, y + 56, gc, i % 3 === 1, true));
  return g + T((x0 + x1) / 2, y + 92, `showing 12 of ${s.bp} base pairs · ${s.gc}% G–C`, { s: 12, c: "#546e7a" });
}
function stretchScene(s, show) {
  const L = contour(s), F = show ? s.force : 0, fr = extFrac(F), px = 60 + Math.min(440, 440 * fr / 1.7), y = 220;
  let g = `<rect x="34" y="${y - 40}" width="28" height="80" fill="#b0bec5" stroke="#546e7a"/>${T(48, y + 62, "pipette", { s: 11, c: "#546e7a" })}<circle cx="70" cy="${y}" r="18" fill="#90caf9" stroke="#1565c0" stroke-width="2"/>`;
  const amp = F < 10 ? 52 * (1 - F / 10) + 4 : F < OVER ? 3 : 0, waves = 9;
  let d = `M84,${y}`; for (let i = 1; i <= 60; i++) { const xx = 84 + (px - 98) * i / 60; d += ` L${xx},${y + amp * Math.sin(i / 60 * waves * 2 * Math.PI)}`; }
  g += `<path d="${d}" fill="none" stroke="${F >= OVER ? "#ce93d8" : "#6a1b9a"}" stroke-width="${F >= OVER ? 3 : 5}" stroke-linejoin="round"/>`;
  g += `<circle cx="${px}" cy="${y}" r="18" fill="#90caf9" stroke="#1565c0" stroke-width="2"/><path d="M${px},${y} L${px + 70},${y - 50} L${px + 70},${y + 50}Z" fill="#ff5252" opacity=".12"/>`;
  if (s.force) g += `<line x1="${px + 16}" y1="${y}" x2="${px + 16 + Math.min(60, 8 + s.force * 0.7)}" y2="${y}" stroke="#d32f2f" stroke-width="4"/><path d="M${px + 26 + Math.min(60, 8 + s.force * 0.7)},${y} l-12,-7 v14Z" fill="#d32f2f"/>${T(px + 30, y - 24, s.force + " pN", { a: "start", s: 13, c: "#d32f2f" })}`;
  g += `<line x1="70" y1="${y + 90}" x2="${60 + 440 / 1.7}" y2="${y + 90}" stroke="#78909c" stroke-width="1.5" stroke-dasharray="5 4"/>${T(60 + 220 / 1.7, y + 108, "contour length " + fmt(L) + " nm", { s: 12, c: "#546e7a" })}<line x1="${60 + 440 / 1.7}" y1="${y + 80}" x2="${60 + 440 / 1.7}" y2="${y + 100}" stroke="#78909c" stroke-width="2"/>`;
  return g + T(300, 80, `${s.len} bp DNA held by two beads`, { s: 14, c: "#37474f" });
}
function unzipScene(s, show) {
  const open = show && unzipped(s), y = 220, x0 = 90, split = open ? 120 : 400;
  let g = "", n = 10, w = (split - x0) / Math.max(1, Math.round(n * (split - x0) / 310));
  const pl = pairsList(s, 12);
  let i = 0; for (let x = x0 + 14; x < split - 6; x += 26) { g += rung(x, y - 44, y + 44, pl[i % 12], i % 3 === 1, false); i++; }
  g += `<rect x="${x0}" y="${y - 54}" width="${split - x0}" height="8" rx="4" fill="#455a64"/><rect x="${x0}" y="${y + 46}" width="${split - x0}" height="8" rx="4" fill="#455a64"/>`;
  g += `<path d="M${split},${y - 50} Q${split + 60},${y - 60} ${open ? 520 : 470},${open ? y - 150 : y - 90}" fill="none" stroke="#455a64" stroke-width="8" stroke-linecap="round"/><path d="M${split},${y + 50} Q${split + 60},${y + 60} ${open ? 520 : 470},${open ? y + 150 : y + 90}" fill="none" stroke="#455a64" stroke-width="8" stroke-linecap="round"/>`;
  const ty = open ? y - 150 : y - 90, by = open ? y + 150 : y + 90, ex = open ? 520 : 470;
  for (let k = 1; k <= (open ? 9 : 2); k++) { const t = k / ((open ? 9 : 2) + 1), qx = (1 - t) * (1 - t) * split + 2 * t * (1 - t) * (split + 60) + t * t * ex; [[y - 50, y - 60, ty, 1], [y + 50, y + 60, by, -1]].forEach(([a, b, c, sg], j) => { const qy = (1 - t) * (1 - t) * a + 2 * t * (1 - t) * b + t * t * c; g += `<rect x="${qx - 6}" y="${sg > 0 ? qy + 4 : qy - 22}" width="12" height="18" rx="3" fill="${pl[k % 12] ? (j ? COL.C : COL.G) : (j ? COL.T : COL.A)}"/>`; }); }
  g += `<circle cx="${ex}" cy="${ty}" r="14" fill="#90caf9" stroke="#1565c0" stroke-width="2"/><circle cx="${ex}" cy="${by}" r="14" fill="#90caf9" stroke="#1565c0" stroke-width="2"/>`;
  if (s.force) g += `<line x1="${ex}" y1="${ty - 16}" x2="${ex}" y2="${ty - 44}" stroke="#d32f2f" stroke-width="4"/><path d="M${ex},${ty - 52} l-7,12 h14Z" fill="#d32f2f"/><line x1="${ex}" y1="${by + 16}" x2="${ex}" y2="${by + 44}" stroke="#d32f2f" stroke-width="4"/><path d="M${ex},${by + 52} l-7,-12 h14Z" fill="#d32f2f"/>${T(ex - 24, y + 6, s.force + " pN", { a: "end", s: 14, c: "#d32f2f" })}`;
  return g + T(250, 66, `pulling the two strands apart · ${s.gc}% G–C`, { s: 14, c: "#37474f" }) + (show ? T(250, 400, open ? "✔ the strands unzip" : "✘ base pairs still hold", { s: 15, c: open ? "#2e7d32" : "#c62828" }) : T(250, 400, "press ▶ to pull", { s: 14, c: "#90a4ae" }));
}
function render(s) {
  const show = s.reveal;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`, rows = "";
  if (s.mode === "pair") {
    g += ladder(s, 70, 530, 210, show) + T(300, 60, "Double helix (shown flat)", { s: 14, c: "#37474f" }) + `${Object.keys(COL).map((b, i) => `<rect x="${150 + i * 80}" y="350" width="16" height="16" rx="3" fill="${COL[b]}"/>${T(172 + i * 80, 363, b, { a: "start", s: 13 })}`).join("")}${T(300, 400, "A–T: 2 hydrogen bonds · G–C: 3 hydrogen bonds", { s: 12, c: "#546e7a" })}`;
    rows = `${T(120, 70, s.bp + " base pairs", { s: 15, c: "#37474f" })}${show ? T(120, 110, "A–T pairs: " + atPairs(s), { s: 14, c: "#1565c0" }) + T(120, 136, "G–C pairs: " + gcPairs(s), { s: 14, c: "#2e7d32" }) + T(120, 180, "hydrogen bonds", { s: 12, c: "#78909c" }) + T(120, 214, hbonds(s), { s: 28, c: "#e65100" }) + T(120, 256, "% A = % T = " + fmt((100 - s.gc) / 2) + "%", { s: 12, c: "#546e7a" }) + T(120, 278, "% G = % C = " + fmt(s.gc / 2) + "%", { s: 12, c: "#546e7a" }) : T(120, 200, "press ▶ to count", { s: 14, c: "#90a4ae" })}`;
  } else if (s.mode === "stretch") {
    g += stretchScene(s, show);
    rows = `${T(120, 70, "contour length = bp × 0.34 nm", { s: 11, c: "#546e7a" })}${T(120, 94, fmt(contour(s)) + " nm", { s: 16, c: "#37474f" })}${T(120, 140, "extension", { s: 12, c: "#78909c" })}${T(120, 172, show ? fmt(ext(s)) + " nm" : "?", { s: 24, c: "#e65100" })}${show ? T(120, 200, "= " + Math.round(extFrac(s.force) * 100) + "% of contour length", { s: 12, c: "#546e7a" }) + T(120, 240, phase(s.force), { s: 14, c: s.force >= OVER ? "#8e24aa" : "#37474f" }) : ""}${T(120, 300, "< 10 pN: coiled · 10 pN: straight", { s: 10, c: "#90a4ae" })}${T(120, 316, "65 pN: overstretches to 1.7×", { s: 10, c: "#90a4ae" })}`;
  } else {
    g += unzipScene(s, show);
    rows = `${T(120, 70, "G–C content: " + s.gc + "%", { s: 14, c: "#37474f" })}${T(120, 110, "force needed to unzip", { s: 12, c: "#78909c" })}${T(120, 142, show ? fmt(fUnzip(s)) + " pN" : "?", { s: 24, c: "#e65100" })}${T(120, 180, "your pull: " + s.force + " pN", { s: 14, c: "#37474f" })}${show ? T(120, 220, unzipped(s) ? "✔ unzipped" : "✘ still zipped", { s: 16, c: unzipped(s) ? "#2e7d32" : "#c62828" }) : ""}${T(120, 300, "unzip force = 10 + 0.1 × %GC", { s: 11, c: "#546e7a" })}${T(120, 318, "G–C has 3 H bonds → harder", { s: 10, c: "#90a4ae" })}`;
  }
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${rows}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Experiment", options: [{ v: "pair", label: "Base pairs" }, { v: "stretch", label: "Stretch" }, { v: "unzip", label: "Unzip" }] }] : []),
  { id: "bp", type: "choice", label: "Strand length", options: [10, 20, 40].map(v => ({ v, label: v + " bp" })), hide: s => s.mode !== "pair", lock: lk("bp") },
  { id: "len", type: "choice", label: "DNA length", options: [1000, 3000, 6000].map(v => ({ v, label: v + " bp" })), hide: s => s.mode !== "stretch", lock: lk("len") },
  { id: "gc", type: "range", label: "G–C content", min: 0, max: 100, step: 10, nudge: 10, unit: "%", hide: s => s.mode === "stretch", lock: lk("gc") },
  { id: "force", type: "range", label: "Pulling force", min: 0, max: 80, step: 1, nudge: 1, unit: "pN", hide: s => s.mode === "pair", lock: lk("force") }]; };
const st = o => Object.assign({ mode: "pair", bp: 20, len: 3000, gc: 50, force: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const HINT = { pair: "A pairs with T (2 hydrogen bonds); G pairs with C (3 hydrogen bonds). H bonds = 2 × (A–T pairs) + 3 × (G–C pairs).", stretch: "Contour length = bp × 0.34 nm. Below 10 pN the DNA is coiled; at 10 pN it is straight; at 65 pN it suddenly overstretches to 1.7 × its length.", unzip: "Unzip force = 10 + 0.1 × %GC (pN). More G–C pairs means more hydrogen bonds to break." };
const TTL = { pair: "🧬 Base-pair challenge", stretch: "📏 Stretching challenge", unzip: "🔓 Unzipping challenge" };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: TTL[s0.mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: HINT[s0.mode] },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ds-sim", diff, uses, mk);
const C = {
  h50: () => simQ(1, "Build a <b>20 bp</b> strand with exactly <b>50 hydrogen bonds</b>.", st({ gc: 0 }), s => ok(hbonds(s) === 50, "10 A–T (20 bonds) + 10 G–C (30 bonds) = 50.", `${hbonds(s)} hydrogen bonds.`), { gc: 50 }, { lock: ["bp"], wrong: { gc: 40 } }),
  fewest: () => simQ(1, "Make the <b>20 bp</b> strand with the <b>fewest</b> hydrogen bonds possible.", st({ gc: 50 }), s => ok(hbonds(s) === 40, "All A–T: 20 × 2 = 40 bonds.", `${hbonds(s)} bonds — you can have fewer.`), { gc: 0 }, { lock: ["bp"], wrong: { gc: 10 } }),
  h26: () => simQ(1, "Build a strand with exactly <b>26 hydrogen bonds</b>. Choose the length and the G–C content.", st({ bp: 20, gc: 50 }), s => ok(hbonds(s) === 26, "10 bp with 60% G–C: 4 × 2 + 6 × 3 = 26.", `${s.bp} bp gives ${hbonds(s)} bonds.`), { bp: 10, gc: 60 }, { wrong: { bp: 10, gc: 50 } }),
  chargaff: () => simQ(1, "Chargaff's rule: make <b>adenine (A) 30%</b> of all the bases.", st({ bp: 40, gc: 50 }), s => ok((100 - s.gc) / 2 === 30, "A = T = 30%, so G = C = 20% → 40% G–C.", `A is ${fmt((100 - s.gc) / 2)}% of the bases.`), { gc: 40 }, { lock: ["bp"], wrong: { gc: 60 } }),
  straight: () => simQ(2, "Pull with the <b>smallest force</b> that makes the DNA <b>fully straight</b> (extension = contour length).", st({ mode: "stretch", len: 3000, force: 2 }), s => ok(s.force === 10, "At 10 pN the coils are pulled out.", s.force < 10 ? `Still coiled: ${Math.round(extFrac(s.force) * 100)}%.` : "It's straight, but a smaller force is enough."), { force: 10 }, { lock: ["len"], wrong: { force: 9 } }),
  over: () => simQ(2, "Find the force where the DNA suddenly <b>overstretches</b>.", st({ mode: "stretch", len: 3000, force: 30 }), s => ok(s.force === OVER, "65 pN — the DNA jumps to 1.7 × its length.", s.force < OVER ? "Not overstretched yet." : "It's overstretched, but at a lower force too."), { force: 65 }, { lock: ["len"], wrong: { force: 60 } }),
  pct65: () => simQ(2, "Make the extension exactly <b>65%</b> of the contour length.", st({ mode: "stretch", len: 1000, force: 0 }), s => ok(Math.round(extFrac(s.force) * 100) === 65, "5 pN: 0.3 + 0.07 × 5 = 0.65.", `${Math.round(extFrac(s.force) * 100)}% of the contour length.`), { force: 5 }, { lock: ["len"], wrong: { force: 6 } }),
  x2040: () => simQ(2, "Choose the DNA and the force so it is <b>just fully straight</b> at <b>2040 nm</b> long.", st({ mode: "stretch", len: 1000, force: 0 }), s => ok(ext(s) === 2040, "6000 bp × 0.34 = 2040 nm, straight at 10 pN.", `Extension: ${fmt(ext(s))} nm.`), { len: 6000, force: 10 }, { wrong: { len: 6000, force: 8 } }),
  atOnly: () => simQ(3, "This strand is <b>all A–T</b>. Find the <b>smallest</b> force that unzips it.", st({ mode: "unzip", gc: 0, force: 5 }), s => ok(unzipped(s) && s.force === 10, "10 pN for 0% G–C.", unzipped(s) ? "It unzips, but less force is enough." : "Still zipped."), { force: 10 }, { lock: ["gc"], wrong: { force: 9 } }),
  gc80: () => simQ(3, "A <b>G–C-rich</b> strand (80%). Find the smallest force that unzips it.", st({ mode: "unzip", gc: 80, force: 10 }), s => ok(unzipped(s) && s.force === 18, "10 + 0.1 × 80 = 18 pN.", unzipped(s) ? "It unzips, but less force is enough." : "Still zipped."), { force: 18 }, { lock: ["gc"], wrong: { force: 17 } }),
  hold15: () => simQ(3, "You pull with <b>15 pN</b>. Make the <b>most A–T-rich</b> strand that still <b>holds together</b>.", st({ mode: "unzip", gc: 20, force: 15 }), s => ok(!unzipped(s) && s.gc === 60, "60% G–C needs 16 pN, so 15 pN can't open it.", unzipped(s) ? "It unzipped — add more G–C." : "It holds, but it could have less G–C."), { gc: 60 }, { lock: ["force"], wrong: { gc: 50 } }),
  at13: () => simQ(3, "Make a strand that unzips at exactly <b>13 pN</b> — and pull with exactly that force.", st({ mode: "unzip", gc: 0, force: 0 }), s => ok(fUnzip(s) === 13 && s.force === 13, "30% G–C: 10 + 3 = 13 pN.", `This strand needs ${fmt(fUnzip(s))} pN; you pull ${s.force} pN.`), { gc: 30, force: 13 }, { wrong: { gc: 30, force: 12 } })
};
const D = {
  pick: diff => E.diaT("ds-pick", diff, 2, () => {
    if (diff === 1) {
      const pairs = Array.from({ length: 6 }, () => Math.random() < 0.5 ? 1 : 0); if (!pairs.some(x => x)) pairs[2] = 1; if (pairs.every(x => x)) pairs[4] = 0;
      const want = choice([1, 0]);
      return { kind: "pick", many: true, title: "👆 Count the bonds", prompt: `The letters are hidden. Click <b>every ${want ? "G–C" : "A–T"}</b> pair.`, answer: pairs.map((p, i) => p === want ? "b" + i : null).filter(Boolean), names: Object.fromEntries(pairs.map((p, i) => ["b" + i, "pair " + (i + 1)])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><rect x="80" y="50" width="700" height="12" rx="6" fill="#455a64"/><rect x="80" y="238" width="700" height="12" rx="6" fill="#455a64"/>${pairs.map((p, i) => { const x = 140 + i * 116, n = p ? 3 : 2; let l = ""; for (let k = 0; k < n; k++) { const dx = (k - (n - 1) / 2) * 14; l += `<line x1="${x + dx}" y1="134" x2="${x + dx}" y2="166" stroke="#263238" stroke-width="3" stroke-dasharray="4 3"/>`; } return `<g class="pk" data-k="b${i}"><rect x="${x - 40}" y="56" width="80" height="190" fill="transparent"/><rect x="${x - 18}" y="62" width="36" height="70" rx="6" fill="#b0bec5"/><rect x="${x - 18}" y="168" width="36" height="70" rx="6" fill="#cfd8dc"/>${l}<rect x="${x - 40}" y="56" width="80" height="190" rx="10" fill="none" ${E.ring(s2["b" + i])}/></g>`; }).join("")}</svg>`,
        explain: "G–C pairs are held by 3 hydrogen bonds, A–T pairs by 2.", summary: "Hydrogen bonds in base pairs" };
    }
    const want = choice(["straight", "over", "coil"]), P = [[2, "coil"], [10, "straight"], [40, "mid"], [65, "over"]];
    const sx = f => 100 + f * 8.5, sy = fr => 250 - fr * 120;
    return { kind: "pick", title: "👆 Read the force–extension curve", prompt: `Click the point where the DNA ${want === "straight" ? "first becomes <b>fully straight</b>" : want === "over" ? "<b>overstretches</b>" : "is still <b>coiled up</b> like a spring"}.`, answer: [want === "straight" ? "p10" : want === "over" ? "p65" : "p2"], names: Object.fromEntries(P.map(p => ["p" + p[0], p[0] + " pN"])),
      visual: s2 => { let g = `<rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="16" width="780" height="270" rx="14" fill="#fff" stroke="#cfd8dc"/><line x1="100" y1="250" x2="790" y2="250" stroke="#90a4ae" stroke-width="2"/><line x1="100" y1="250" x2="100" y2="30" stroke="#90a4ae" stroke-width="2"/>${T(445, 280, "force (pN)", { s: 13, c: "#546e7a" })}${T(70, 32, "ext.", { s: 12, c: "#546e7a" })}`;
        [0.5, 1, 1.5].forEach(v => g += `<line x1="100" y1="${sy(v)}" x2="790" y2="${sy(v)}" stroke="#eceff1"/>${T(94, sy(v) + 4, v + "×", { a: "end", s: 11, c: "#78909c" })}`);
        let d = ""; for (let f = 0; f <= 78; f += 0.5) d += (f ? " L" : "M") + sx(f) + "," + sy(extFrac(f)); g += `<path d="${d}" fill="none" stroke="#6a1b9a" stroke-width="3"/>`;
        P.forEach(p => g += `<g class="pk" data-k="p${p[0]}"><circle cx="${sx(p[0])}" cy="${sy(extFrac(p[0]))}" r="18" fill="transparent"/><circle cx="${sx(p[0])}" cy="${sy(extFrac(p[0]))}" r="8" fill="#ff7043" stroke="#fff" stroke-width="2"/>${T(sx(p[0]), 268, p[0], { s: 12, c: "#37474f" })}<circle cx="${sx(p[0])}" cy="${sy(extFrac(p[0]))}" r="16" fill="none" ${E.ring(s2["p" + p[0]])}/></g>`);
        return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}</svg>`; },
      explain: "Low force: coiled (entropic). About 10 pN: straight. 65 pN: a sudden jump to 1.7× (overstretching).", summary: "Force–extension curve" };
  }),
  num: diff => E.diaT("ds-num", diff, 2, () => {
    if (diff === 1) { const c = choice([[20, 30], [10, 70], [40, 25], [30, 40]]); const s = st({ bp: c[0], gc: c[1] });
      return { kind: "num", title: "🧮 Hydrogen bonds", prompt: `A strand has <b>${c[0]} base pairs</b> and is <b>${c[1]}% G–C</b>.`, visual: render(st({ bp: [10, 20, 40].includes(c[0]) ? c[0] : 20, gc: c[1] })), fields: [{ label: "G–C pairs", unit: "pairs", answer: gcPairs(s) }, { label: "Hydrogen bonds", unit: "bonds", answer: hbonds(s) }], explain: `${gcPairs(s)} G–C × 3 + ${atPairs(s)} A–T × 2 = ${hbonds(s)}.`, summary: "Counting H bonds" }; }
    if (diff === 2) { const bp = choice([1000, 3000, 6000, 5000, 48500]);
      return { kind: "num", title: "🧮 Contour length", prompt: `Each base pair adds <b>0.34 nm</b>. A DNA molecule has <b>${bp} bp</b>.`, visual: render(st({ mode: "stretch", len: [1000, 3000, 6000].includes(bp) ? bp : 3000, force: 10, reveal: true })), fields: [{ label: "Contour length", unit: "nm", answer: r2(bp * 0.34) }, { label: "Length when overstretched (×1.7)", unit: "nm", answer: r2(bp * 0.34 * 1.7) }], explain: `${bp} × 0.34 = ${fmt(r2(bp * 0.34))} nm; × 1.7 = ${fmt(r2(bp * 0.34 * 1.7))} nm.`, summary: "Contour length" }; }
    const g = choice([20, 40, 70, 90]);
    return { kind: "num", title: "🧮 Unzipping force", prompt: `Unzip force = 10 + 0.1 × %GC. A strand is <b>${g}% G–C</b>.`, visual: render(st({ mode: "unzip", gc: g, force: 0 })), fields: [{ label: "Force to unzip", unit: "pN", answer: r2(10 + 0.1 * g) }], explain: `10 + 0.1 × ${g} = ${fmt(r2(10 + 0.1 * g))} pN.`, summary: "Unzip force" };
  }),
  mcq: diff => E.diaT("ds-mcq", diff, 2, () => { const q = choice([
      { ask: "Why is G–C-rich DNA harder to unzip?", ok: "Each G–C pair has 3 hydrogen bonds instead of 2", bad: ["G and C are heavier", "G–C pairs are covalently bonded", "It has more phosphate"], ex: "More hydrogen bonds must be broken." },
      { ask: "Why does relaxed DNA act like a spring at low force?", ok: "Random thermal motion coils it up — pulling it straight lowers its entropy", bad: ["The hydrogen bonds stretch", "The phosphates repel the beads", "It is magnetic"], ex: "This is an entropic spring." },
      { ask: "How do optical tweezers hold a bead?", ok: "A focused laser beam traps it and can pull with tiny forces (pN)", bad: ["With tiny metal clips", "With glue", "With sound waves"], ex: "The bead is pulled toward the brightest part of the beam." },
      { ask: "Which enzyme unzips DNA before it is copied?", ok: "Helicase", bad: ["Ligase", "Amylase", "RNA polymerase only"], ex: "Helicase breaks the hydrogen bonds between base pairs." }]);
    return { kind: "mcq", title: "📘 DNA mechanics", prompt: "Think about hydrogen bonds, entropy and force.", visual: render(st({ mode: "stretch", len: 3000, force: 30, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "DNA mechanics" }; })
};
const LEVELS = {
  1: { intro: "DNA is two strands held together by base pairs: A–T has 2 hydrogen bonds, G–C has 3.", pool: () => [S(1, 1, C.fewest), S(2, 1, C.h50), S(2, 1, C.chargaff), S(3, 1, C.h26), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Pull DNA with optical tweezers: it uncoils, straightens at about 10 pN and overstretches at 65 pN.", pool: () => [S(1, 1, C.straight), S(2, 1, C.pct65), S(2, 1, C.over), S(3, 1, C.x2040), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Pull the two strands apart: the more G–C pairs, the more force you need to unzip.", pool: () => [S(1, 1, C.atOnly), S(2, 1, C.gc80), S(3, 1, C.hold15), S(3, 1, C.at13), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Build base pairs, stretch the DNA and unzip it. Press ▶ to see what happens.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Run",
  goals: () => [{ txt: "Count the hydrogen bonds", test: (s, m) => m.h }, { txt: "Overstretch the DNA", test: (s, m) => m.o }, { txt: "Unzip the two strands", test: (s, m) => m.u }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "pair") m.h = 1; if (s.mode === "stretch" && s.force >= OVER) m.o = 1; if (s.mode === "unzip" && unzipped(s)) m.u = 1; },
  facts: () => "📘 Scientists use <b>optical tweezers</b> to stretch and unzip single DNA molecules and measure the forces in piconewtons."
});
E.start({ labId: "dnastretch", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧬", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧬", "🔗", "📏", "✨"],
  exploreDemo: () => [{ set: { mode: "pair", gc: 60 }, run: true }, { set: { mode: "stretch", len: 3000, force: 65 }, run: true }, { set: { mode: "unzip", gc: 30, force: 15 }, run: true }] });
})();
