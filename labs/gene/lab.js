"use strict";
// ===== Gene Expression — Science Lab 1971 =====
(function () {
const E = LabEngine, choice = E.choice, T = E.svgText;
// standard genetic code (order U C A G)
const B = "UCAG", CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";
const AA = { F: "Phe", L: "Leu", S: "Ser", Y: "Tyr", "*": "STOP", C: "Cys", W: "Trp", P: "Pro", H: "His", Q: "Gln", R: "Arg", I: "Ile", M: "Met", T: "Thr", N: "Asn", K: "Lys", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gly" };
const aa = cod => AA[CODE[16 * B.indexOf(cod[0]) + 4 * B.indexOf(cod[1]) + B.indexOf(cod[2])]];
const protein = m => { const out = []; for (let i = 0; i + 3 <= m.length; i += 3) { const a = aa(m.slice(i, i + 3)); if (a === "STOP") { out.push("STOP"); break; } out.push(a); } return out; };
const COMP = { A: "U", T: "A", G: "C", C: "G" };
const BCOL = { A: "#43a047", U: "#e53935", T: "#e53935", G: "#fbc02d", C: "#1e88e5" };
const GENES = { A: { col: "#e91e63", name: "protein A", shape: "circle" }, B: { col: "#7e57c2", name: "protein B", shape: "square" }, C: { col: "#00897b", name: "protein C", shape: "tri" } };
// ---------- level 1: transcription & translation ----------
const made = s => s.tf ? s.copies * s.passes : 0;
function prot(x, y, g, k) { const c = GENES[g].col; return GENES[g].shape === "circle" ? `<circle cx="${x}" cy="${y}" r="${9 * k}" fill="${c}"/>` : GENES[g].shape === "square" ? `<rect x="${x - 8 * k}" y="${y - 8 * k}" width="${16 * k}" height="${16 * k}" rx="3" fill="${c}"/>` : `<polygon points="${x},${y - 10 * k} ${x + 9 * k},${y + 7 * k} ${x - 9 * k},${y + 7 * k}" fill="${c}"/>`; }
function render1(s) {
  const show = s.reveal || s.showVals, n = show ? made(s) : 0, gx = { A: 130, B: 300, C: 470 };
  let g = `<rect x="20" y="20" width="580" height="190" rx="70" fill="#fce4ec" stroke="#f48fb1" stroke-width="3" stroke-dasharray="10 6"/>${T(60, 48, "NUCLEUS", { a: "start", s: 12, c: "#ad1457" })}`;
  let helix = ""; for (let x = 50; x <= 570; x += 6) { const y1 = 120 + 14 * Math.sin(x / 18), y2 = 120 - 14 * Math.sin(x / 18); helix += `<line x1="${x}" x2="${x}" y1="${y1}" y2="${y2}" stroke="#cfd8dc" stroke-width="2"/>`; }
  let p1 = "", p2 = ""; for (let x = 50; x <= 570; x += 3) { p1 += `${x},${120 + 14 * Math.sin(x / 18)} `; p2 += `${x},${120 - 14 * Math.sin(x / 18)} `; }
  g += helix + `<polyline points="${p1}" fill="none" stroke="#455a64" stroke-width="4"/><polyline points="${p2}" fill="none" stroke="#78909c" stroke-width="4"/>`;
  Object.keys(gx).forEach(k => { g += `<rect x="${gx[k] - 60}" y="98" width="120" height="44" rx="10" fill="${GENES[k].col}" opacity=".13"/><rect x="${gx[k] - 60}" y="98" width="22" height="44" rx="6" fill="${GENES[k].col}" opacity=".35"/>${T(gx[k] + 10, 165, "gene " + k, { s: 14, c: GENES[k].col })}${T(gx[k] - 49, 92, "promoter", { s: 9, c: "#8e6a85" })}`; });
  const px = gx[s.gene] - 49;
  if (s.tf) g += `<g transform="translate(${px - 4},72)"><path d="M-14,0 L14,0 L8,18 L-8,18 Z" fill="#ff7043"/>${T(0, -6, "TF", { s: 11, c: "#d84315" })}</g>`;
  g += `<ellipse cx="${px + 34}" cy="120" rx="34" ry="28" fill="#5c6bc0" opacity=".85"/>${T(px + 34, 125, "RNA pol", { s: 11, c: "#fff" })}`;
  // mRNA leaving + ribosomes
  const copies = show && s.tf ? s.copies : 0;
  for (let i = 0; i < copies; i++) { const y = 250 + i * 46; g += `<path d="M300,212 C330,${y - 20} 560,${y - 10} 610,${y}" fill="none" stroke="#e53935" stroke-width="4" stroke-dasharray="2 4"/><path d="M610,${y} L800,${y}" stroke="#e53935" stroke-width="4"/>`;
    for (let r = 0; r < s.passes; r++) g += `<g transform="translate(${650 + r * 50},${y - 6})"><ellipse rx="18" ry="10" fill="#8d6e63"/><ellipse cy="10" rx="13" ry="8" fill="#a1887f"/></g>`; }
  g += `<g transform="translate(640,24)"><rect width="200" height="${show ? 190 : 120}" rx="12" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>${T(100, 22, "CYTOPLASM — proteins made", { s: 11, c: "#ad1457" })}`;
  for (let i = 0; i < n; i++) g += prot(28 + (i % 6) * 29, 52 + Math.floor(i / 6) * 30, s.gene, 1);
  g += show ? T(100, 160, n ? `${n} × ${GENES[s.gene].name}` : "no protein made", { s: 14, c: n ? GENES[s.gene].col : "#c62828" }) + T(100, 180, `${s.tf ? s.copies : 0} mRNA × ${s.passes} ribosome${s.passes > 1 ? "s" : ""}`, { s: 11, c: "#8e6a85" }) : T(100, 70, "press ▶ to express the gene", { s: 12, c: "#8e6a85" });
  return g + "</g>" + T(330, 240, "mRNA →", { s: 13, c: "#c62828" }) + T(720, 236, "ribosomes", { s: 12, c: "#6d4c41" });
}
// ---------- level 2/3: bases, codons, amino acids ----------
function strand(seq, x0, y, label, hl) { let g = T(x0 - 14, y + 26, label, { a: "end", s: 13, c: "#4a148c" });
  for (let i = 0; i < seq.length; i++) { const x = x0 + i * 56 + Math.floor(i / 3) * 14, c = seq[i];
    g += `<rect x="${x}" y="${y}" width="48" height="42" rx="9" fill="${c === "?" ? "#f5f5f5" : BCOL[c]}" stroke="${hl === i ? "#212121" : "#fff"}" stroke-width="${hl === i ? 4 : 2}"/>${T(x + 24, y + 29, c, { s: 22, c: c === "?" ? "#bdbdbd" : c === "G" ? "#5d4037" : "#fff" })}`; }
  return g; }
function aaRow(prot, x0, y) { return prot.map((a, i) => { const x = x0 + i * 182 + 70; return `<circle cx="${x}" cy="${y}" r="30" fill="${a === "STOP" ? "#212121" : "#ce93d8"}" stroke="#6a1b9a" stroke-width="3"/>${T(x, y + 6, a, { s: a === "STOP" ? 13 : 16, c: a === "STOP" ? "#fff" : "#4a148c" })}${i < prot.length - 1 && a !== "STOP" ? `<line x1="${x + 30}" x2="${x + 152}" y1="${y}" y2="${y}" stroke="#6a1b9a" stroke-width="4"/>` : ""}`; }).join(""); }
const mOf = s => [0, 1, 2, 3, 4, 5].map(i => s["b" + i]).join("");
function render2(s) {
  const m = mOf(s), show = s.reveal || s.showVals, p = protein(m);
  return strand(s.dna.split(""), 140, 40, "DNA template") + T(450, 116, "↓ transcription (base pairing: A→U, T→A, G→C, C→G)", { s: 13, c: "#8e6a85" }) + strand(m.split(""), 140, 136, "mRNA")
    + T(450, 212, "↓ translation (ribosome reads codons)", { s: 13, c: "#8e6a85" }) + (show ? aaRow(p, 140, 270) : T(450, 270, "press ▶ to translate", { s: 14, c: "#8e6a85" })) + codonCard(330);
}
function codonCard(y) { const ex = [["AUG", "Met (START)"], ["UGG", "Trp"], ["AAA", "Lys"], ["GAA", "Glu"], ["GGC", "Gly"], ["UUU", "Phe"], ["UAA·UAG·UGA", "STOP"]];
  return `<g transform="translate(40,${y})"><rect width="780" height="86" rx="12" fill="#fff" stroke="#e1bee7" stroke-width="2"/>${T(16, 22, "Some codons:", { a: "start", s: 12, c: "#6a1b9a" })}${ex.map((e, i) => T(16 + (i % 4) * 192, 46 + Math.floor(i / 4) * 26, e[0] + " = " + e[1], { a: "start", s: 14, c: "#4a148c" })).join("")}</g>`; }
const mut = s => { const a = s.orig.split(""); a[s.pos - 1] = s.nb; return a.join(""); };
const protS = m => m.startsWith("AUG") ? protein(m) : []; // translation needs a START codon
function render3(s) {
  const show = s.reveal || s.showVals, m = mut(s), p0 = protS(s.orig), p1 = protS(m);
  return strand(s.orig.split(""), 160, 24, "original mRNA") + `<g transform="translate(0,62)">${aaRow(p0, 160, 26).replace(/r="30"/g, 'r="22"')}</g>`
    + strand(m.split(""), 160, 150, "mutated mRNA", s.pos - 1) + (show ? (p1.length ? `<g transform="translate(0,190)">${aaRow(p1, 160, 26).replace(/r="30"/g, 'r="22"')}</g>` : T(450, 222, "✖ no protein is made", { s: 16, c: "#c62828" })) + T(450, 260, kind(s), { s: 15, c: "#ad1457" }) : T(450, 226, "press ▶ to make the protein", { s: 14, c: "#8e6a85" })) + codonCard(286);
}
const kind = s => { const a = protS(s.orig).join("-"), b = protS(mut(s)).join("-"); return mut(s) === s.orig ? "no change" : !b ? "the START codon is gone: no protein" : a === b ? "silent mutation: same protein" : b.includes("STOP") && !a.includes("STOP") ? "nonsense mutation: protein stops early" : "missense mutation: one amino acid changed"; };
const render = s => `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#fff7f9"/>${s.mode === 1 ? render1(s) : s.mode === 2 ? render2(s) : render3(s)}</svg>`;
const BASE4 = ["A", "U", "G", "C"].map(v => ({ v, label: v }));
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 1) return [{ id: "gene", type: "choice", label: "RNA polymerase binds to", options: ["A", "B", "C"].map(v => ({ v, label: "Gene " + v })), lock: lk("gene") },
    { id: "tf", type: "toggle", label: "Add transcription factor", lock: lk("tf") },
    { id: "copies", type: "step", label: "mRNA copies made", min: 1, max: 4, lock: lk("copies") }, { id: "passes", type: "step", label: "Ribosomes per mRNA", min: 1, max: 3, lock: lk("passes") }];
  if (mode === 2) return [0, 1, 2, 3, 4, 5].map(i => ({ id: "b" + i, type: "select", label: "mRNA base " + (i + 1), options: BASE4, lock: lk("b" + i) }));
  return [{ id: "pos", type: "step", label: "Base position to change", min: 1, max: 9, lock: lk("pos") }, { id: "nb", type: "choice", label: "New base", options: BASE4, lock: lk("nb") }];
};
const SEQS = ["AUGGAAUGG", "AUGAAAGGC", "AUGUUUGAA", "AUGGGCAAA"];
const stFor = (mode, o) => Object.assign(mode === 1 ? { mode, gene: "A", tf: false, copies: 1, passes: 1 } : mode === 2 ? { mode, dna: "TACCCG", b0: "A", b1: "A", b2: "A", b3: "A", b4: "A", b5: "A" } : { mode, orig: "AUGGAAUGG", pos: 1, nb: "A" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const HINT = { 1: "RNA polymerase needs a transcription factor at the promoter. Proteins made = mRNA copies × ribosomes per mRNA.", 2: "mRNA pairs with the DNA template: A→U, T→A, G→C, C→G. Each 3-base codon codes for one amino acid.", 3: "Change one base. Same amino acid = silent; different amino acid = missense; a STOP codon = nonsense." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🧬 Gene expression challenge", 2: "🔤 Codon challenge", 3: "🧪 Mutation challenge" }[mode], prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("gene-sim", diff, uses, mk);
const bset = m => Object.fromEntries(m.split("").map((c, i) => ["b" + i, c]));
const psay = s => { const p = protein(mOf(s)); return "mRNA " + mOf(s).replace(/(...)(?!$)/g, "$1 ") + " → " + p.join(" – "); };
const C = {
  makeA: () => { const g = choice(["A", "B", "C"]); return simQ(1, `Make <b>protein ${g}</b>.`, stFor(1, { gene: g === "A" ? "B" : "A" }), s => ok(made(s) > 0 && s.gene === g, `Gene ${g} was transcribed and translated.`, !s.tf ? "RNA polymerase cannot start without a transcription factor." : `That makes protein ${s.gene}.`), { gene: g, tf: true }, { wrong: { gene: g, tf: false } }); },
  four: () => { const g = choice(["B", "C"]); return simQ(1, `Each mRNA is read by <b>2 ribosomes</b>. Make exactly <b>4 molecules of protein ${g}</b>.`, stFor(1, { passes: 2 }), s => ok(made(s) === 4 && s.gene === g, "2 mRNA × 2 ribosomes = 4 proteins.", `You made ${made(s)} × protein ${s.gene}.`), { gene: g, tf: true, copies: 2 }, { lock: ["passes"], wrong: { gene: g, tf: true, copies: 3 } }); },
  six: () => simQ(1, "Make <b>6 molecules of protein B</b> using the <b>fewest mRNA copies</b>.", stFor(1), s => ok(made(s) === 6 && s.gene === "B" && s.copies === 2, "2 mRNA × 3 ribosomes = 6 — fewer mRNA, more ribosomes.", made(s) === 6 && s.gene === "B" ? "6 proteins, but fewer mRNA copies are possible." : `You made ${made(s)} × protein ${s.gene}.`), { gene: "B", tf: true, copies: 2, passes: 3 }, { wrong: { gene: "B", tf: true, copies: 3, passes: 2 } }),
  twelve: () => simQ(1, "Make the <b>most protein C</b> possible.", stFor(1, { gene: "C" }), s => ok(made(s) === 12 && s.gene === "C", "4 mRNA × 3 ribosomes = 12 proteins.", `You made ${made(s)}.`), { tf: true, copies: 4, passes: 3 }, { lock: ["gene"], wrong: { tf: true, copies: 4, passes: 2 } }),
  copy: () => { const d = choice(["TACCCG", "TACTTT", "TACACC", "TACCTT"]), m = d.split("").map(c => COMP[c]).join("");
    return simQ(2, `Build the <b>mRNA</b> that pairs with this DNA template: <b>${d}</b>.`, stFor(2, { dna: d }), s => ok(mOf(s) === m, psay(s) + ".", `Not the matching mRNA. Pair each base: A→U, T→A, G→C, C→G.`), bset(m), { wrong: bset(m.replace(/^A/, "U")) }); },
  metTrp: () => { const c = choice([["Met – Trp", "AUGUGG"], ["Met – Lys", "AUGAAA"], ["Met – Phe", "AUGUUU"], ["Met – Glu", "AUGGAA"]]);
    return simQ(2, `Build a 6-base mRNA that codes for <b>${c[0]}</b>.`, stFor(2, { dna: "??????" }), s => ok(protein(mOf(s)).join(" – ") === c[0], psay(s) + ".", psay(s) + "."), bset(c[1]), { wrong: bset("AUGCCC") }); },
  startStop: () => simQ(2, "Build a 6-base mRNA: a <b>START codon</b> followed by a <b>STOP codon</b>.", stFor(2, { dna: "??????" }), s => ok(protein(mOf(s)).join("-") === "Met-STOP", psay(s) + ": a protein of just one amino acid.", psay(s) + "."), bset("AUGUAA"), { wrong: bset("AUGUAU") }),
  trpTrp: () => simQ(2, "Build a 6-base mRNA where <b>both codons are Trp</b> (tryptophan).", stFor(2, { dna: "??????" }), s => ok(protein(mOf(s)).join("-") === "Trp-Trp", "UGG UGG: Trp has only one codon.", psay(s) + "."), bset("UGGUGG"), { wrong: bset("UGAUGG") }),
  silent: () => { const o = choice(["AUGGAAUGG", "AUGAAAGGC", "AUGUUUGAA"]);
    return simQ(3, "Change <b>one base</b> but keep <b>exactly the same protein</b> (silent mutation).", stFor(3, { orig: o }), s => ok(mut(s) !== o && protein(mut(s)).join() === protein(o).join(), kind(s) + " — the code has more than one codon for most amino acids.", mut(s) === o ? "That base is already there — nothing changed." : kind(s) + "."), { pos: 6, nb: o.slice(3, 6) === "AAA" ? "G" : o.slice(3, 6) === "GAA" ? "G" : "C" }, { wrong: { pos: 4, nb: "U" } }); },
  stop: () => simQ(3, "Change <b>one base</b> so the protein <b>stops after Met</b> (only 1 amino acid).", stFor(3, { orig: "AUGGAAUGG" }), s => ok(protein(mut(s)).join("-") === "Met-STOP", "GAA → UAA: a STOP codon (nonsense mutation).", kind(s) + "."), { pos: 4, nb: "U" }, { wrong: { pos: 5, nb: "U" } }),
  lys: () => simQ(3, "Change <b>one base</b> so the <b>2nd amino acid becomes Lys</b>.", stFor(3, { orig: "AUGGAAUGG" }), s => ok(protein(mut(s))[1] === "Lys" && protein(mut(s)).length === 3, "GAA → AAA: Glu → Lys (missense).", kind(s) + "."), { pos: 4, nb: "A" }, { wrong: { pos: 4, nb: "C" } }),
  third: () => simQ(3, "Change <b>one base</b> so the <b>3rd codon</b> becomes a <b>STOP</b>.", stFor(3, { orig: "AUGGAAUGG" }), s => ok(protein(mut(s)).join("-") === "Met-Glu-STOP", "UGG → UAG or UGA: STOP.", kind(s) + "."), { pos: 9, nb: "A" }, { wrong: { pos: 9, nb: "C" } }),
  noStart: () => simQ(3, "Change <b>one base</b> to <b>destroy the START codon</b> (AUG).", stFor(3, { orig: "AUGAAAGGC", pos: 5 }), s => ok(mut(s).slice(0, 3) !== "AUG", "Without AUG, the ribosome does not start: no protein at all.", "The first codon is still AUG."), { pos: 1, nb: "G" }, { wrong: { pos: 4, nb: "G" } })
};

// ---------- diagram tasks ----------
const D = {
  where: diff => E.diaT("gene-pick", diff, 1, () => { const q = choice([["nuc", "where <b>transcription</b> happens (DNA → mRNA)"], ["ribo", "where <b>translation</b> happens (mRNA → protein)"], ["dna", "the molecule that stores the <b>genetic code</b> permanently"], ["mrna", "the <b>messenger</b> that carries the code out of the nucleus"]]);
    const s = stFor(1, { gene: "B", tf: true, copies: 1, passes: 2, reveal: true }), z = (k, x, y, w, h, st) => `<g class="pk" data-k="${k}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="rgba(0,0,0,0.001)" ${E.ring(st[k])}/></g>`;
    return { kind: "pick", title: "👆 Where does it happen?", prompt: "Click " + q[1] + ".", answer: [q[0]], names: { nuc: "the nucleus", ribo: "a ribosome", dna: "DNA", mrna: "mRNA" },
      visual: st => `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#fff7f9"/>${render1(s).replace(/<text[\s\S]*?<\/text>/g, "")}${z("nuc", 20, 20, 120, 60, st)}${z("dna", 230, 92, 160, 56, st)}${z("mrna", 520, 214, 80, 50, st)}${z("ribo", 625, 220, 110, 44, st)}</svg>`,
      explain: "DNA stays in the nucleus, where it is transcribed into mRNA. mRNA leaves the nucleus; ribosomes in the cytoplasm translate it into protein.", summary: "Transcription and translation" }; }),
  pair: diff => E.diaT("gene-mcq", diff, 2, () => { const d = choice(["TACGGT", "TACAAC", "TACCTA"]), m = d.split("").map(c => COMP[c]).join(""); const wrong = [m.replace(/U/g, "T"), d, m.split("").reverse().join("")];
    return { kind: "mcq", title: "🔗 Base pairing", prompt: "A DNA template strand is shown.", visual: `<svg viewBox="0 0 860 140" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="140" fill="#fff7f9"/>${strand(d.split(""), 220, 30, "DNA template")}${T(560, 120, "Which mRNA is made from it?", { s: 15, c: "#8e6a85" })}</svg>`,
      ask: "Which mRNA is transcribed from this DNA?", options: E.mkOptions(m, wrong), explain: `A→U, T→A, G→C, C→G: ${d} → ${m}. RNA uses U instead of T.`, summary: "Complementary base pairing" }; }),
  count: diff => E.diaT("gene-num", diff, 2, () => { const n = choice([15, 21, 30, 45]);
    return { kind: "num", title: "🔢 Count codons", prompt: `An mRNA is ${n} bases long. It starts with AUG and ends with a STOP codon.`, visual: render(stFor(2, { dna: "TACCCG", ...bset("AUGGGC"), showVals: true })),
      fields: [{ label: "Number of codons", unit: "", answer: n / 3 }, { label: "Number of amino acids in the protein", unit: "", answer: n / 3 - 1 }], explain: `${n} ÷ 3 = ${n / 3} codons. The STOP codon adds no amino acid, so ${n / 3 - 1} amino acids.`, summary: "Codons and amino acids" }; }),
  mutMcq: diff => E.diaT("gene-mcq", diff, 3, () => { const q = choice([
      { s: { orig: "AUGGAAUGG", pos: 6, nb: "G" }, ask: "What type of mutation is shown?", ok: "Silent — the protein is not changed", bad: ["Nonsense — the protein stops early", "Missense — one amino acid changed", "Frameshift — all codons change"], ex: "GAA and GAG both code for Glu, so the protein is the same." },
      { s: { orig: "AUGGAAUGG", pos: 4, nb: "U" }, ask: "Why is this mutation usually harmful?", ok: "The protein stops too early and cannot work", bad: ["The protein gets longer", "It changes the DNA into RNA", "It has no effect on the protein"], ex: "UAA is a STOP codon, so a short, incomplete protein is made." },
      { s: { orig: "AUGAAAGGC", pos: 4, nb: "G" }, ask: "AAA (Lys) became GAA (Glu). What happens?", ok: "One amino acid in the protein is changed", bad: ["The protein stops", "No protein is made", "Nothing changes"], ex: "A missense mutation swaps one amino acid; the protein may work worse or differently." }]);
    return { kind: "mcq", title: "🧪 Mutations", prompt: "Compare the original and the mutated mRNA.", visual: render(stFor(3, Object.assign({ showVals: true }, q.s))), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Types of mutation" }; })
};
const LEVELS = {
  1: { intro: "From gene to protein: switch a gene on, make mRNA copies and let ribosomes build proteins.", pool: () => [S(1, 1, C.makeA), S(2, 1, C.four), S(2, 1, C.twelve), S(3, 1, C.six), S(3, 1, C.four), D.where(1), D.pair(2), D.where(3)] },
  2: { intro: "The genetic code: build mRNA by base pairing, then read it 3 bases (one codon) at a time.", pool: () => [S(1, 1, C.copy), S(2, 1, C.metTrp), S(2, 1, C.copy), S(3, 1, C.startStop), S(3, 1, C.trpTrp), D.pair(1), D.count(2), D.where(3)] },
  3: { intro: "Mutations: change one base in the mRNA and see what happens to the protein.", pool: () => [S(1, 1, C.noStart), S(2, 1, C.lys), S(2, 1, C.stop), S(3, 1, C.silent), S(3, 1, C.third), D.count(1), D.mutMcq(2), D.mutMcq(3)] }
};
const explore = E.exploreSim({
  intro: "Level 1: express a gene. Level 2: build mRNA and read the codons. Level 3: make mutations. Press ▶ to see the result.",
  state: lv => stFor(lv, lv === 3 ? { pos: 4 } : {}), controls: lv => ctlsFor(lv), render, run, runLabel: "▶ Express",
  goals: lv => lv === 1 ? [{ txt: "Try without a transcription factor", test: (s, m) => m.notf }, { txt: "Make all three proteins (A, B, C)", test: (s, m) => (m.g || new Set()).size >= 3 }]
    : lv === 2 ? [{ txt: "Start your mRNA with AUG", test: s => mOf(s).startsWith("AUG") }, { txt: "Make a STOP codon", test: s => protein(mOf(s)).includes("STOP") }]
    : [{ txt: "Make a mutation that changes the protein", test: (s, m) => m.mis }, { txt: "Make a silent mutation", test: (s, m) => m.sil }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === 1) { if (!s.tf) m.notf = 1; else (m.g = m.g || new Set()).add(s.gene); } if (s.mode === 3) { const k = kind(s); if (k.startsWith("missense") || k.startsWith("nonsense")) m.mis = 1; if (k.startsWith("silent")) m.sil = 1; } },
  facts: lv => lv === 1 ? "📘 <b>Transcription</b> (nucleus): DNA → mRNA. <b>Translation</b> (ribosome): mRNA → protein." : lv === 2 ? "📘 A <b>codon</b> = 3 bases = 1 amino acid. AUG = start. UAA, UAG, UGA = stop." : "📘 A <b>mutation</b> is a change in the DNA base sequence. It may change one amino acid, stop the protein, or have no effect."
});
E.start({ labId: "gene", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧬", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🧬", "🔬", "✨", "⭐"],
  exploreDemo: lv => lv === 1 ? [{ set: { gene: "A" }, run: true }, { set: { tf: true }, run: true }, { set: { gene: "B" }, run: true }, { set: { gene: "C" }, run: true }]
    : lv === 2 ? [{ set: bset("AUGUAA") }] : [{ set: { pos: 4, nb: "A" }, run: true }, { set: { pos: 6, nb: "G" }, run: true }] });
})();
