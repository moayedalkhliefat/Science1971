"use strict";
// ===== Gene Machine: Lac Operon — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const LACI = { wt: "lacI⁺ (normal)", minus: "lacI⁻ (no repressor)", sup: "lacIˢ (super-repressor)" };
const OP = { wt: "O⁺ (normal)", c: "Oᶜ (repressor can't bind)" };
const ZZ = { wt: "lacZ⁺ (normal)", minus: "lacZ⁻ (broken enzyme)" };
const PP = { wt: "P⁺ (normal)", minus: "P⁻ (RNA polymerase can't bind)" };
// model
const repMade = s => s.laci !== "minus";
const repFree = s => s.laci === "wt" && s.lac; // lactose (allolactose) pulls the normal repressor off
const repBound = s => repMade(s) && s.op === "wt" && !repFree(s);
const capBound = s => !s.glu; // low glucose → high cAMP → CAP binds
const level = s => s.pr !== "wt" || repBound(s) ? 0 : capBound(s) ? 100 : 10; // mRNA per minute
const LV = v => v === 100 ? "HIGH" : v === 10 ? "LOW" : "OFF";
const bgal = s => level(s) > 0 && s.z === "wt";
const muts = s => ["laci", "op", "z", "pr"].filter(k => s[k] !== "wt").length;
const X0 = 46, SEG = [["lacI", 78, "#90a4ae"], ["", 22, null], ["CAP site", 46, "#a5d6a7"], ["promoter", 58, "#ffcc80"], ["operator", 52, "#ce93d8"], ["lacZ", 104, "#64b5f6"], ["lacY", 78, "#4dd0e1"], ["lacA", 66, "#80cbc4"]];
const segX = name => { let x = X0; for (const [n, w] of SEG) { if (n === name) return [x, w]; x += w; } return [x, 0]; };
const hexa = (x, y, r, fill) => `<polygon points="${[0, 1, 2, 3, 4, 5].map(i => (x + r * Math.cos(Math.PI / 3 * i + Math.PI / 6)) + "," + (y + r * Math.sin(Math.PI / 3 * i + Math.PI / 6))).join(" ")}" fill="${fill}" stroke="#5d4037" stroke-width="1.5"/>`;
const lactose = (x, y) => hexa(x, y, 9, "#f8bbd0") + hexa(x + 16, y, 9, "#fff59d") + `<line x1="${x + 7}" y1="${y}" x2="${x + 9}" y2="${y}" stroke="#5d4037" stroke-width="2"/>`;
const glucose = (x, y) => hexa(x, y, 9, "#fff59d");
const mutX = (name, y) => { const [x, w] = segX(name); return `<path d="M${x + w / 2 - 9},${y - 9} l18,18 M${x + w / 2 + 9},${y - 9} l-18,18" stroke="#c62828" stroke-width="4"/>`; };
function repressor(x, y, withLac) { return `<g transform="translate(${x},${y})"><rect x="-22" y="-16" width="20" height="16" rx="6" fill="#8e24aa"/><rect x="2" y="-16" width="20" height="16" rx="6" fill="#8e24aa"/><rect x="-22" y="1" width="20" height="16" rx="6" fill="#ab47bc"/><rect x="2" y="1" width="20" height="16" rx="6" fill="#ab47bc"/>${withLac ? lactose(14, -24) : ""}</g>`; }
function scene(s, show) {
  const dy = 214;
  let g = `<rect x="34" y="34" width="532" height="130" rx="60" fill="#f1f8e9" stroke="#aed581" stroke-width="2"/>${T(56, 60, "E. coli cell", { a: "start", s: 12, c: "#558b2f" })}`;
  for (let i = 0; i < 5; i++) { if (s.lac) g += lactose(300 + i * 48, 66 + (i % 2) * 18); if (s.glu) g += glucose(310 + i * 46, 118 + (i % 2) * 14); }
  g += T(250, 74, s.lac ? "lactose" : "no lactose", { a: "end", s: 12, c: s.lac ? "#ad1457" : "#90a4ae" }) + T(250, 126, s.glu ? "glucose" : "no glucose", { a: "end", s: 12, c: s.glu ? "#f9a825" : "#90a4ae" });
  let x = X0; SEG.forEach(([n, w, c]) => { if (c) g += `<rect x="${x}" y="${dy}" width="${w}" height="30" fill="${c}" stroke="#37474f" stroke-width="1.5"/>${n === "promoter" ? `<line x1="${x + w / 2}" y1="${dy + 31}" x2="${x + w / 2}" y2="${dy + 52}" stroke="#90a4ae"/>` : ""}${T(x + w / 2, dy + (n === "promoter" ? 66 : 48), n, { s: 13, c: "#37474f" })}`; else g += `<line x1="${x}" y1="${dy + 15}" x2="${x + w}" y2="${dy + 15}" stroke="#37474f" stroke-width="3"/>`; x += w; });
  
  if (s.laci !== "wt") g += mutX("lacI", dy + 15) + T(85, dy + 88, s.laci === "minus" ? "lacI⁻" : "lacIˢ", { s: 13, c: "#c62828" });
  if (s.op !== "wt") g += mutX("operator", dy + 15) + T(segX("operator")[0] + 26, dy + 88, "Oᶜ", { s: 13, c: "#c62828" });
  if (s.z !== "wt") g += mutX("lacZ", dy + 15) + T(segX("lacZ")[0] + 52, dy + 88, "lacZ⁻", { s: 13, c: "#c62828" });
  if (s.pr !== "wt") g += mutX("promoter", dy + 15) + T(segX("promoter")[0] + 29, dy + 88, "P⁻", { s: 13, c: "#c62828" });
  if (!show) return g + T(300, 380, "press ▶ to let the cell respond", { s: 15, c: "#90a4ae" });
  // proteins
  const [ox, ow] = segX("operator"), [cx, cw] = segX("CAP site"), [px, pw] = segX("promoter"), [zx] = segX("lacZ");
  if (repMade(s)) g += repBound(s) ? repressor(ox + ow / 2, dy - 18, false) : repressor(96, 122, s.lac && s.laci === "wt");
  g += capBound(s) ? `<ellipse cx="${cx + cw / 2}" cy="${dy - 14}" rx="20" ry="13" fill="#43a047"/>${T(cx + cw / 2, dy - 10, "CAP", { s: 10, c: "#fff" })}` : "";
  const L = level(s);
  if (s.pr === "wt") g += `<ellipse cx="${L ? zx + 40 : px + pw / 2}" cy="${dy - 16}" rx="26" ry="16" fill="#fb8c00" opacity=".95"/>${T(L ? zx + 40 : px + pw / 2, dy - 12, "RNA pol", { s: 10, c: "#fff" })}`;
  if (L) { const len = L === 100 ? 246 : 78, y = dy + 108; let d = `M${zx},${y}`; for (let i = 0; i < len; i += 12) d += ` q6,${i % 24 ? 7 : -7} 12,0`; g += `<path d="${d}" fill="none" stroke="#e53935" stroke-width="${L === 100 ? 3.5 : 2.5}"/>${T(zx + len + 8, y + 5, "mRNA", { a: "start", s: 12, c: "#e53935" })}`; }
  if (L) { const n = L === 100 ? 4 : 1; for (let i = 0; i < n; i++) { const ex = 120 + i * 80, ey = 372; g += s.z === "wt" ? `<g transform="translate(${ex},${ey})"><circle r="16" fill="#1e88e5"/><path d="M0,0 L16,-8 A18,18 0 0 1 16,8Z" fill="#fff"/>${lactose(24, 0)}</g>` : `<g transform="translate(${ex},${ey})"><circle r="16" fill="#b0bec5"/><path d="M-8,-8 l16,16 M8,-8 l-16,16" stroke="#c62828" stroke-width="3"/></g>`; } g += T(120 + (n - 1) * 40, 410, s.z === "wt" ? "β-galactosidase breaking lactose" : "broken β-galactosidase", { s: 12, c: s.z === "wt" ? "#1565c0" : "#c62828" }); }
  return g;
}
function render(s) {
  const show = s.reveal, L = level(s);
  const row = (y, k, v, c) => T(18, y, k, { a: "start", s: 12, c: "#78909c" }) + T(222, y, v, { a: "end", s: 13, c: c || "#37474f" });
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>` + scene(s, show);
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${show ? row(70, "repressor", !repMade(s) ? "not made" : repBound(s) ? "on operator" : "off operator", repBound(s) ? "#8e24aa" : "#37474f") + row(100, "CAP–cAMP", capBound(s) ? "bound" : "not bound", capBound(s) ? "#2e7d32" : "#78909c") + row(130, "RNA polymerase", s.pr !== "wt" ? "can't bind" : L ? "transcribing" : "blocked")
      + T(120, 180, "transcription", { s: 12, c: "#78909c" }) + T(120, 212, LV(L), { s: 26, c: L === 100 ? "#2e7d32" : L ? "#ef6c00" : "#c62828" }) + T(120, 234, L + " mRNA / min", { s: 12, c: "#546e7a" })
      + row(276, "β-galactosidase", !L ? "not made" : s.z === "wt" ? "working" : "broken", bgal(s) ? "#1565c0" : "#c62828") + row(306, "lactose used?", s.lac && bgal(s) ? "yes ✔" : "no", s.lac && bgal(s) ? "#2e7d32" : "#78909c")
      : T(120, 200, "? waiting", { s: 18, c: "#90a4ae" })}
    ${T(120, 360, "key: OFF 0 · LOW 10 · HIGH 100", { s: 10, c: "#90a4ae" })}${T(120, 376, "mRNA per minute", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const opt = o => Object.keys(o).map(v => ({ v, label: o[v] }));
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null, mut = () => lv < 2; return [
  { id: "lac", type: "toggle", label: "🍬 Lactose present", lock: lk("lac") },
  { id: "glu", type: "toggle", label: "🍯 Glucose present", lock: lk("glu") },
  { id: "laci", type: "select", label: "Repressor gene", options: opt(LACI), hide: mut, lock: lk("laci") },
  { id: "op", type: "select", label: "Operator", options: opt(OP), hide: mut, lock: lk("op") },
  { id: "pr", type: "select", label: "Promoter", options: opt(PP), hide: mut, lock: lk("pr") },
  { id: "z", type: "select", label: "lacZ gene", options: opt(ZZ), hide: mut, lock: lk("z") }]; };
const st = o => Object.assign({ lac: false, glu: true, laci: "wt", op: "wt", z: "wt", pr: "wt" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `Transcription ${LV(level(s))}${repBound(s) ? ", repressor on the operator" : ""}${s.pr !== "wt" ? ", promoter broken" : ""}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🧬 Operon challenge", prompt: "Set up the cell, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Lactose (as allolactose) pulls the repressor off the operator. Low glucose → high cAMP → CAP binds and boosts transcription. lacI⁻ makes no repressor; lacIˢ can't let go; Oᶜ can't hold the repressor; P⁻ blocks RNA polymerase; lacZ⁻ makes a broken enzyme." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("lo-sim", diff, uses, mk);
const ENV = ["lac", "glu"], MUT = ["laci", "op", "z", "pr"];
const C = {
  fullOn: () => simQ(1, "Switch the operon <b>fully ON</b> (HIGH transcription).", st(), s => ok(level(s) === 100, "Lactose removes the repressor and no glucose lets CAP bind.", said(s)), { lac: true, glu: false }, { wrong: { lac: true, glu: true } }),
  repOn: () => simQ(1, "Make the <b>repressor sit on the operator</b>.", st({ lac: true, glu: false }), s => ok(repBound(s), "No lactose → the repressor stays on the operator.", said(s)), { lac: false }, { lock: ["glu"], wrong: { lac: true } }),
  low: () => simQ(1, "The repressor must be <b>off</b> the operator, but transcription only <b>LOW</b>.", st(), s => ok(level(s) === 10, "Lactose frees the operator, but glucose keeps cAMP low, so CAP can't help.", said(s)), { lac: true, glu: true }, { wrong: { lac: true, glu: false } }),
  cap: () => simQ(1, "There is lactose. Make <b>CAP–cAMP bind</b> to the CAP site.", st({ lac: true, glu: true }), s => ok(capBound(s), "With no glucose, cAMP rises and CAP binds.", "Glucose keeps cAMP low — CAP can't bind."), { glu: false }, { lock: ["lac"], wrong: { glu: true } }),
  oneMut: () => simQ(2, "No lactose, no glucose. Use <b>ONE</b> mutation to switch the operon <b>ON</b> anyway.", st({ lac: false, glu: false }), s => ok(level(s) === 100 && muts(s) === 1, `${s.laci === "minus" ? "lacI⁻: no repressor is made" : "Oᶜ: the repressor can't bind"} — the operon is always on (constitutive).`, muts(s) !== 1 ? "Use exactly one mutation." : said(s)), { laci: "minus" }, { lock: ENV, wrong: { z: "minus" } }),
  superR: () => simQ(2, "Lactose present, no glucose — yet the operon must stay <b>OFF</b>. Change only the <b>repressor gene</b>.", st({ lac: true, glu: false }), s => ok(level(s) === 0, "lacIˢ: the super-repressor can't bind lactose, so it never lets go.", said(s)), { laci: "sup" }, { lock: ENV.concat(["op", "z", "pr"]), wrong: { laci: "minus" } }),
  zMinus: () => simQ(2, "The operon is ON, but the cell must <b>not</b> break down lactose. Change one gene.", st({ lac: true, glu: false }), s => ok(level(s) > 0 && !bgal(s), "lacZ⁻: mRNA is made, but β-galactosidase is broken.", level(s) ? "Lactose is still broken down." : "Transcription stopped — keep it ON."), { z: "minus" }, { lock: ENV, wrong: { pr: "minus" } }),
  pMinus: () => simQ(2, "The repressor has <b>left</b> the operator, yet <b>no mRNA</b> is made. Which mutation?", st({ lac: true, glu: false }), s => ok(!repBound(s) && repMade(s) && level(s) === 0, "P⁻: RNA polymerase can't bind the promoter.", repBound(s) ? "The repressor is still on the operator." : said(s)), { pr: "minus" }, { lock: ENV.concat(["laci"]), wrong: { laci: "sup" } }),
  gluOn: () => simQ(3, "With <b>glucose present</b> and <b>no lactose</b>, still get some transcription.", st({ lac: false, glu: true }), s => ok(level(s) > 0, "A constitutive mutation (lacI⁻ or Oᶜ) gives LOW transcription — glucose still keeps CAP off.", said(s)), { op: "c" }, { lock: ENV, wrong: { laci: "sup" } }),
  fixSup: () => simQ(3, "This cell has <b>lacIˢ</b>. Turn the operon <b>fully ON</b> by changing only the <b>operator</b>.", st({ lac: true, glu: false, laci: "sup" }), s => ok(level(s) === 100, "Oᶜ: even a super-repressor can't hold on.", said(s)), { op: "c" }, { lock: ENV.concat(["laci", "z", "pr"]), wrong: { op: "wt" } }),
  maxUse: () => simQ(3, "This cell is <b>lacI⁻</b> and has lactose. Choose the sugars so it breaks lactose down as <b>fast</b> as possible.", st({ laci: "minus", lac: true, glu: true }), s => ok(level(s) === 100 && bgal(s), "No glucose → CAP binds → HIGH transcription.", said(s)), { glu: false }, { lock: ["lac", "laci", "op", "z", "pr"], wrong: { glu: true } }),
  allThree: () => simQ(3, "Make all three true: <b>repressor bound</b>, <b>CAP bound</b> and <b>no mRNA</b>.", st({ lac: true, glu: true }), s => ok(repBound(s) && capBound(s) && level(s) === 0, "Repressor beats CAP: no lactose (or lacIˢ) with no glucose.", `${repBound(s) ? "" : "Repressor not bound. "}${capBound(s) ? "" : "CAP not bound. "}${said(s)}`), { lac: false, glu: false }, { wrong: { lac: true, glu: false } })
};
const D = {
  pick: diff => E.diaT("lo-pick", diff, 2, () => {
    if (diff === 1) {
      const target = choice([["operator", "where the repressor binds"], ["promoter", "where RNA polymerase binds"], ["CAP site", "where CAP–cAMP binds"], ["lacZ", "that codes for β-galactosidase"], ["lacI", "that codes for the repressor"]]);
      const regs = ["lacI", "CAP site", "promoter", "operator", "lacZ", "lacY", "lacA"];
      return { kind: "pick", title: "👆 Parts of the operon", prompt: `Click the region <b>${target[1]}</b>.`, answer: [target[0]], names: Object.fromEntries(regs.map(r => [r, r])),
        visual: s2 => { let x = 50, g = ""; SEG.forEach(([n, w, c]) => { const W = w * 1.6; if (c) g += `<g class="pk" data-k="${n}"><rect x="${x}" y="110" width="${W}" height="60" fill="${c}" stroke="#37474f" stroke-width="2"/>${T(x + W / 2, 200, "?", { s: 18, c: "#37474f" })}<rect x="${x - 2}" y="106" width="${W + 4}" height="68" fill="none" ${E.ring(s2[n])}/></g>`; else g += `<line x1="${x}" y1="140" x2="${x + W}" y2="140" stroke="#37474f" stroke-width="4"/>`; x += W; }); return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${T(430, 60, "lac operon DNA (labels hidden)", { s: 15, c: "#546e7a" })}${g}</svg>`; },
        explain: "Order: lacI · CAP site · promoter · operator · lacZ · lacY · lacA.", summary: "Operon structure" };
    }
    const pool = E.shuffle([st({ lac: true, glu: false }), st({ lac: false, glu: false }), st({ lac: true, glu: true }), st({ lac: false, glu: true, op: "c" }), st({ lac: true, glu: false, laci: "sup" }), st({ lac: false, glu: false, laci: "minus" }), st({ lac: true, glu: false, pr: "minus" })]).slice(0, 4);
    const want = choice(["on", "off"]), test = s => want === "on" ? level(s) > 0 : level(s) === 0;
    if (!pool.some(test)) pool[0] = want === "on" ? st({ lac: true, glu: false }) : st({ lac: false, glu: true });
    const lbl = s => [s.lac ? "lactose ✔" : "lactose ✘", s.glu ? "glucose ✔" : "glucose ✘", s.laci !== "wt" ? (s.laci === "minus" ? "lacI⁻" : "lacIˢ") : "", s.op !== "wt" ? "Oᶜ" : "", s.pr !== "wt" ? "P⁻" : ""].filter(Boolean);
    return { kind: "pick", many: true, title: "👆 On or off?", prompt: `Click <b>every</b> cell where the operon is <b>${want === "on" ? "ON (any mRNA)" : "OFF (no mRNA)"}</b>.`, answer: pool.map((s, i) => test(s) ? "c" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["c" + i, lbl(s).join(", ")])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="c${i}"><rect x="${x}" y="15" width="196" height="270" rx="60" fill="#f1f8e9" stroke="#aed581" stroke-width="2"/>${T(x + 98, 50, "cell " + "ABCD"[i], { s: 15, c: "#558b2f" })}${lbl(s).map((t, k) => T(x + 98, 100 + k * 34, t, { s: 16, c: /⁻|ˢ|ᶜ/.test(t) ? "#c62828" : "#37474f" })).join("")}<rect x="${x}" y="15" width="196" height="270" rx="60" fill="none" ${E.ring(s2["c" + i])}/></g>`; }).join("")}</svg>`,
      explain: "ON needs a free operator (lactose with normal lacI, or lacI⁻ / Oᶜ) and a working promoter. lacIˢ and P⁻ keep it OFF.", summary: "Predicting operon state" };
  }),
  num: diff => E.diaT("lo-num", diff, 2, () => {
    const c = choice([[st({ lac: true, glu: false }), 5], [st({ lac: true, glu: true }), 6], [st({ lac: false, glu: false, laci: "minus" }), 3], [st({ lac: false, glu: true, op: "c" }), 8], [st({ lac: true, glu: false, laci: "sup" }), 4]]), s = c[0];
    const lab = [s.lac ? "lactose" : "no lactose", s.glu ? "glucose" : "no glucose", s.laci === "minus" ? "lacI⁻" : s.laci === "sup" ? "lacIˢ" : "", s.op === "c" ? "Oᶜ" : ""].filter(Boolean).join(", ");
    return { kind: "num", title: "🧮 How much mRNA?", prompt: `Key: OFF = 0, LOW = 10, HIGH = 100 mRNA per minute. A cell has <b>${lab}</b>. How many mRNA molecules are made in <b>${c[1]} minutes</b>?`, visual: render(Object.assign({}, s, { reveal: false })),
      fields: [{ label: "mRNA made", unit: "molecules", answer: level(s) * c[1] }], explain: `Transcription is ${LV(level(s))} (${level(s)}/min) × ${c[1]} min = ${level(s) * c[1]}.`, summary: "Transcription rate" };
  }),
  mcq: diff => E.diaT("lo-mcq", diff, 2, () => { const q = choice([
      { ask: "What actually binds to the lac repressor and makes it let go of the operator?", ok: "Allolactose (made from lactose)", bad: ["Glucose", "cAMP", "RNA polymerase"], ex: "Allolactose is the inducer; it changes the repressor's shape." },
      { ask: "Why is the lac operon only LOW when both lactose and glucose are present?", ok: "Glucose keeps cAMP low, so CAP cannot boost transcription", bad: ["Glucose binds the operator", "Lactose is destroyed by glucose", "The repressor binds glucose"], ex: "This is catabolite repression — the cell prefers glucose." },
      { ask: "A lacI⁻ mutant makes β-galactosidase all the time. This is called…", ok: "constitutive expression", bad: ["induction", "catabolite repression", "translation"], ex: "With no repressor the operon is always on." },
      { ask: "Which mutation is cis-acting (only affects genes on the same DNA)?", ok: "Oᶜ (operator constitutive)", bad: ["lacI⁻", "lacIˢ", "A mutation in CAP protein"], ex: "The operator is a DNA site, not a protein, so it only controls its own operon." }]);
    return { kind: "mcq", title: "📘 Gene regulation", prompt: "Think about the repressor, CAP and the operator.", visual: render(st({ lac: true, glu: false, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Lac operon ideas" }; })
};
const LEVELS = {
  1: { intro: "The lac operon is switched by sugars: lactose removes the repressor, and no glucose lets CAP boost transcription.", pool: () => [S(1, 1, C.repOn), S(2, 1, C.fullOn), S(2, 1, C.cap), S(3, 1, C.low), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Mutations: lacI⁻, lacIˢ, Oᶜ, P⁻ and lacZ⁻ each break a different part of the switch.", pool: () => [S(1, 1, C.zMinus), S(2, 1, C.oneMut), S(2, 1, C.superR), S(3, 1, C.pMinus), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Put it together: sugars and mutations act at the same time.", pool: () => [S(1, 1, C.maxUse), S(2, 1, C.gluOn), S(3, 1, C.fixSup), S(3, 1, C.allThree), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Add or remove the sugars and try the mutations. Press ▶ to see how the cell responds.",
  state: () => st(), controls: () => ctls(2), render, run, runLabel: "▶ Run cell",
  goals: () => [{ txt: "Switch the operon fully ON", test: (s, m) => m.h }, { txt: "See the repressor on the operator", test: (s, m) => m.r }, { txt: "Try a mutation that changes the result", test: (s, m) => m.m }],
  track: (s, m, ran) => { if (!ran) return; if (level(s) === 100) m.h = 1; if (repBound(s)) m.r = 1; if (muts(s) && level(s) !== level(Object.assign({}, s, { laci: "wt", op: "wt", z: "wt", pr: "wt" }))) m.m = 1; },
  facts: () => "📘 The <b>lac operon</b> is a gene switch in bacteria: genes for using lactose are only turned on when lactose is there and glucose is not."
});
E.start({ labId: "lacop", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧬", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧬", "🦠", "🍬", "✨"],
  exploreDemo: () => [{ set: { lac: true, glu: false }, run: true }, { set: { lac: false }, run: true }, { set: { laci: "minus" }, run: true }] });
})();
