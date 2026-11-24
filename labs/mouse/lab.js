"use strict";
// ===== Mouse Genetics (Punnett squares) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const GT = ["BB", "Bb", "bb"], BLACK = "#3b3330", WHITE = "#f7f5f2";
const kids = (a, b) => [a[0] + b[0], a[0] + b[1], a[1] + b[0], a[1] + b[1]].map(g => g[0] === "b" && g[1] === "B" ? "Bb" : g);
const isBlack = g => g.includes("B");
const P1 = s => s.myst || s.p1;
const frac = s => { const k = kids(P1(s), s.p2); const c = g => k.filter(x => x === g).length / 4; return { BB: c("BB"), Bb: c("Bb"), bb: c("bb"), black: k.filter(isBlack).length / 4, white: k.filter(g => !isBlack(g)).length / 4 }; };
const litter = s => { const f = frac(s), n = s.n, nb = Math.round(n * f.black); return Array.from({ length: n }, (_, i) => i < nb ? "black" : "white"); };
const pct = x => Math.round(x * 100) + "%";

function mouse(x, y, black, sc, flip) {
  const fur = black ? BLACK : WHITE, line = black ? "#1c1917" : "#9e9e9e", ear = black ? "#6d4c41" : "#f8bbd0";
  return `<g transform="translate(${x},${y}) scale(${(flip ? -1 : 1) * (sc || 1)},${sc || 1})">
    <ellipse cx="0" cy="20" rx="26" ry="4" fill="#000" opacity=".12"/>
    <path d="M-24,6 C-46,8 -52,-6 -40,-14" fill="none" stroke="${black ? "#4e342e" : "#e0a3b8"}" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="0" cy="2" rx="26" ry="16" fill="${fur}" stroke="${line}" stroke-width="1.5"/>
    <circle cx="22" cy="-14" r="8" fill="${fur}" stroke="${line}" stroke-width="1.5"/><circle cx="22" cy="-14" r="4.5" fill="${ear}"/>
    <ellipse cx="26" cy="-2" rx="12" ry="10" fill="${fur}" stroke="${line}" stroke-width="1.5"/>
    <circle cx="30" cy="-5" r="2.2" fill="${black ? "#f5f5f5" : "#212121"}"/><circle cx="37.5" cy="0" r="2.5" fill="#f48fb1"/>
    <path d="M36,2 l10,-2 M36,3 l10,2" stroke="${black ? "#bdbdbd" : "#757575"}" stroke-width=".8"/>
    <ellipse cx="-12" cy="17" rx="5" ry="2.5" fill="${ear}"/><ellipse cx="12" cy="17" rx="5" ry="2.5" fill="${ear}"/></g>`;
}
function render(s) {
  const show = s.reveal, f = frac(s), hid = !!s.myst && !s.reveal2;
  const a = hid ? ["?", "?"] : P1(s).split(""), b = s.p2.split(""), k = kids(P1(s), s.p2);
  let g = `<rect width="860" height="450" fill="#fbf7f2"/><rect y="292" width="860" height="158" fill="#efe6da"/>`;
  // parents
  g += `<g>${T(120, 30, "PARENTS", { s: 13, c: "#6d4c41" })}${mouse(80, 92, isBlack(P1(s)), 1.25)}${T(80, 140, "Mother " + (s.myst ? "❓" : P1(s)), { s: 14, c: "#3e2723" })}
    ${T(165, 96, "×", { s: 26, c: "#8d6e63" })}${mouse(240, 92, isBlack(s.p2), 1.25, true)}${T(240, 140, "Father " + s.p2, { s: 14, c: "#3e2723" })}
    ${T(160, 175, s.myst ? "mystery black mother" : (isBlack(P1(s)) ? "black" : "white") + " × " + (isBlack(s.p2) ? "black" : "white"), { s: 12, c: "#8d6e63" })}</g>`;
  // Punnett square
  const X = 345, Y = 40, C = 74;
  g += `<g>${T(X + C, Y - 12, "PUNNETT SQUARE", { s: 13, c: "#6d4c41" })}
    ${b.map((al, i) => T(X + C / 2 + i * C, Y + 14, al, { s: 20, c: "#1565c0" })).join("")}${a.map((al, j) => T(X - 18, Y + 30 + C / 2 + j * C, al, { s: 20, c: "#c2185b" })).join("")}
    ${[0, 1].map(j => [0, 1].map(i => { const gg = k[j * 2 + i], on = show && !hid; return `<rect x="${X + i * C}" y="${Y + 28 + j * C}" width="${C}" height="${C}" fill="${on ? (isBlack(gg) ? "#d7ccc8" : "#fff") : "#fff"}" stroke="#8d6e63" stroke-width="2"/>${on ? T(X + C / 2 + i * C, Y + 28 + C / 2 + j * C + 7, gg, { s: 22, c: "#3e2723" }) : ""}`; }).join("")).join("")}</g>`;
  // ratio panel
  g += `<g transform="translate(560,30)"><rect width="270" height="240" rx="14" fill="#fff" stroke="#d7ccc8" stroke-width="2"/>${T(135, 26, "EXPECTED BABIES", { s: 13, c: "#6d4c41" })}
    ${show ? [["black fur", f.black, BLACK], ["white fur", f.white, "#bdbdbd"]].map(([n, v, c], i) => `<rect x="24" y="${50 + i * 46}" width="${220 * v}" height="26" rx="6" fill="${c}"/><rect x="24" y="${50 + i * 46}" width="220" height="26" rx="6" fill="none" stroke="#d7ccc8"/>${T(24, 44 + i * 46, n + " " + pct(v), { a: "start", s: 12, c: "#3e2723" })}`).join("")
      + T(135, 160, `BB ${pct(f.BB)} · Bb ${pct(f.Bb)} · bb ${pct(f.bb)}`, { s: 14, c: "#3e2723" }) + T(135, 188, "B = black (dominant)", { s: 12, c: "#6d4c41" }) + T(135, 208, "b = white (recessive)", { s: 12, c: "#6d4c41" })
      : T(135, 120, "press ▶ to breed", { s: 14, c: "#a1887f" })}</g>`;
  // litter
  g += T(430, 312, show ? `LITTER OF ${s.n}: ${litter(s).filter(x => x === "black").length} black · ${litter(s).filter(x => x === "white").length} white` : `LITTER OF ${s.n}`, { s: 14, c: "#4e342e" });
  if (show) { const L = litter(s), per = Math.min(8, L.length), w = 760 / per; L.forEach((c, i) => { const r = Math.floor(i / 8); g += mouse(50 + w / 2 + (i % 8) * w - 20, 352 + r * 52, c === "black", L.length > 8 ? 0.72 : 0.9, i % 2); }); }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "p1", type: "choice", label: "Mother", options: GT.map(v => ({ v, label: v })), hide: s => !!s.myst, lock: lk("p1") },
  { id: "p2", type: "choice", label: "Father", options: GT.map(v => ({ v, label: v })), lock: lk("p2") },
  { id: "n", type: "range", label: "Litter size", min: 4, max: 16, step: 4, unit: "babies", hide: () => lv < 3, lock: lk("n") },
  { id: "guess", type: "choice", label: "Mystery mother is…", options: [{ v: "BB", label: "BB" }, { v: "Bb", label: "Bb" }], hide: s => !s.myst || !s.askGuess }]; };
const st = o => Object.assign({ p1: "Bb", p2: "Bb", n: 8 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => { const f = frac(s); return `${P1(s)} × ${s.p2} gives ${pct(f.black)} black, ${pct(f.white)} white`; };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🐭 Breeding challenge", prompt: "Choose the parents, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Fill the Punnett square: each parent gives ONE letter. Any baby with a capital B has black fur; only bb is white." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("mg-sim", diff, uses, mk);
const C = {
  allBlack: () => simQ(1, "Make sure <b>every baby is black</b>.", st({ p1: "bb", p2: "bb" }), s => ok(frac(s).black === 1, say(s) + " — a BB parent always passes on B.", say(s) + "."), { p1: "BB" }, { wrong: { p1: "Bb", p2: "Bb" } }),
  allWhite: () => simQ(1, "Make a litter where <b>every baby is white</b>.", st({ p1: "BB" }), s => ok(frac(s).white === 1, "bb × bb: both parents can only give b.", say(s) + "."), { p1: "bb", p2: "bb" }, { wrong: { p1: "Bb", p2: "bb" } }),
  surprise: () => simQ(1, "Both parents are <b>black</b>, but some babies are <b>white</b>. Choose them!", st({ p1: "BB", p2: "BB" }), s => ok(isBlack(s.p1) && isBlack(s.p2) && frac(s).white > 0, "Bb × Bb — both carry the hidden b allele.", isBlack(s.p1) && isBlack(s.p2) ? say(s) + " — no white babies." : "Both parents must be black."), { p1: "Bb", p2: "Bb" }, { wrong: { p1: "BB", p2: "Bb" } }),
  whiteMum: () => simQ(1, "The mother is <b>bb</b> (white). Choose a father so that <b>all babies are black</b>.", st({ p1: "bb", p2: "bb" }), s => ok(frac(s).black === 1, "BB father: every baby gets one B → all Bb, all black.", say(s) + "."), { p2: "BB" }, { lock: ["p1"], wrong: { p2: "Bb" } }),
  r31: () => simQ(2, "Get a ratio of <b>3 black : 1 white</b>.", st({ p1: "BB", p2: "bb" }), s => ok(frac(s).black === 0.75, "Bb × Bb → 1 BB : 2 Bb : 1 bb = 3 black : 1 white.", say(s) + "."), { p1: "Bb", p2: "Bb" }, { wrong: { p1: "Bb", p2: "bb" } }),
  half: () => simQ(2, "Get <b>half black, half white</b> babies.", st({ p1: "BB", p2: "BB" }), s => ok(frac(s).black === 0.5, say(s) + ".", say(s) + "."), { p1: "Bb", p2: "bb" }, { wrong: { p1: "Bb", p2: "Bb" } }),
  carriers: () => simQ(2, "Make <b>every</b> baby a <b>carrier (Bb)</b>.", st(), s => ok(frac(s).Bb === 1, "BB × bb → all Bb: black fur, but carrying b.", say(s) + `; only ${pct(frac(s).Bb)} are Bb.`), { p1: "BB", p2: "bb" }, { wrong: { p1: "Bb", p2: "bb" } }),
  quarterBB: () => simQ(2, "The father is <b>Bb</b>. Get exactly <b>25% BB</b> babies.", st({ p1: "BB", p2: "Bb" }), s => ok(frac(s).BB === 0.25, "Bb × Bb → BB 25%, Bb 50%, bb 25%.", `${P1(s)} × Bb gives BB ${pct(frac(s).BB)}.`), { p1: "Bb" }, { lock: ["p2"], wrong: { p1: "BB" } }),
  two8: () => simQ(3, "In a litter of <b>8</b>, get exactly <b>2 white</b> babies.", st({ p1: "BB", p2: "bb", n: 4 }), s => { const w = litter(s).filter(x => x === "white").length; return ok(s.n === 8 && w === 2, "8 × ¼ = 2 white (Bb × Bb).", `Litter of ${s.n}: ${w} white.`); }, { p1: "Bb", p2: "Bb", n: 8 }, { wrong: { p1: "Bb", p2: "bb", n: 8 } }),
  six16: () => simQ(3, "Get exactly <b>8 white</b> babies in the biggest litter.", st({ p1: "Bb", p2: "Bb", n: 4 }), s => { const w = litter(s).filter(x => x === "white").length; return ok(w === 8, "16 × ½ = 8 white (Bb × bb).", `Litter of ${s.n}: ${w} white.`); }, { p1: "Bb", p2: "bb", n: 16 }, { wrong: { p1: "Bb", p2: "Bb", n: 16 } }),
  testBb: () => simQ(3, "A black mother's genotype is <b>hidden</b>. Do a <b>test cross</b> (choose the father), then decide: is she BB or Bb?", st({ myst: "Bb", askGuess: true, p2: "BB" }), s => ok(s.p2 === "bb" && s.guess === "Bb", "Test cross with bb: white babies appeared, so she must carry b → Bb.", s.p2 !== "bb" ? "Use a white (bb) father — only then do the babies reveal her genotype." : "White babies appeared, so she carries b."), { p2: "bb", guess: "Bb" }, { wrong: { p2: "bb", guess: "BB" } }),
  testBB: () => simQ(3, "Another black mother has a <b>hidden</b> genotype. Test-cross her and decide: BB or Bb?", st({ myst: "BB", askGuess: true, p2: "Bb" }), s => ok(s.p2 === "bb" && s.guess === "BB", "Test cross with bb: ALL babies black, so she has no b → BB.", s.p2 !== "bb" ? "Use a white (bb) father for a test cross." : "No white babies, so she has no b allele."), { p2: "bb", guess: "BB" }, { wrong: { p2: "bb", guess: "Bb" } })
};
// ---------- diagram tasks ----------
const D = {
  square: diff => E.diaT("mg-num", diff, 2, () => { const pr = choice([["Bb", "Bb"], ["Bb", "bb"], ["BB", "Bb"], ["BB", "bb"]]), s = st({ p1: pr[0], p2: pr[1], reveal: true }), f = frac(s);
    return { kind: "num", title: "🧮 Punnett square", prompt: `Mother <b>${pr[0]}</b> × father <b>${pr[1]}</b>. Use the Punnett square.`, visual: render(Object.assign({}, s, { reveal: false })),
      fields: [{ label: "Babies with black fur", unit: "%", answer: f.black * 100 }, { label: "Babies that are bb", unit: "%", answer: f.bb * 100 }], explain: `${say(s)}; bb = ${pct(f.bb)}.`, summary: "Punnett square percentages" }; }),
  litterNum: diff => E.diaT("mg-num", diff, 3, () => { const pr = choice([["Bb", "Bb", 12], ["Bb", "bb", 10], ["Bb", "Bb", 20]]), s = st({ p1: pr[0], p2: pr[1], n: pr[2] }), f = frac(s);
    return { kind: "num", title: "🐭 Predict the litter", prompt: `${pr[0]} × ${pr[1]} have <b>${pr[2]}</b> babies. How many do you expect to be white?`, visual: render(Object.assign({}, s, { reveal: false })),
      fields: [{ label: "White babies", unit: "", answer: pr[2] * f.white }], explain: `${pct(f.white)} of ${pr[2]} = ${fmt(pr[2] * f.white)}.`, summary: "Expected litter numbers" }; }),
  pick: diff => E.diaT("mg-pick", diff, 2, () => { const want = choice(["Bb", "bb", "BB"]), set = { a: "BB", b: "Bb", c: "bb", d: "Bb" }, order = E.shuffle(["a", "b", "c", "d"]);
    const q = { Bb: "Click ALL the mice that are <b>carriers</b> (Bb).", bb: "Click the mouse that is <b>homozygous recessive</b> (bb).", BB: "Click the mouse that is <b>homozygous dominant</b> (BB)." }[want];
    return { kind: "pick", many: want === "Bb", title: "👆 Genotypes", prompt: q, answer: order.filter(k => set[k] === want), names: { a: "BB mouse", b: "Bb mouse", c: "bb mouse", d: "Bb mouse" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#fbf7f2"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${20 + i * 210}" y="30" width="190" height="240" rx="16" fill="#fff" stroke="#d7ccc8" stroke-width="2"/><rect x="${20 + i * 210}" y="30" width="190" height="240" rx="16" fill="none" ${E.ring(s2[k])}/>${mouse(105 + i * 210, 130, isBlack(set[k]), 1.6)}${T(115 + i * 210, 222, set[k], { s: 26, c: "#3e2723" })}${T(115 + i * 210, 250, isBlack(set[k]) ? "black fur" : "white fur", { s: 13, c: "#8d6e63" })}</g>`).join("")}</svg>`,
      explain: "BB and bb are homozygous (two same letters). Bb is heterozygous — a black 'carrier' of the hidden white allele.", summary: "Identify genotypes" }; }),
  mcq: diff => E.diaT("mg-mcq", diff, 2, () => { const q = choice([
      { ask: "Why can two black mice have a white baby?", ok: "Both parents are Bb and each passed on b", bad: ["Black fur is recessive", "The baby mutated", "White fur is dominant"], ex: "Each Bb parent can give b; bb babies are white." },
      { ask: "What is the PHENOTYPE of a Bb mouse?", ok: "Black fur", bad: ["White fur", "Grey fur", "Bb"], ex: "Phenotype = what you see. B is dominant, so Bb looks black." },
      { ask: "In Bb × Bb, what fraction of babies are expected to be white?", ok: "1 in 4 (25%)", bad: ["1 in 2 (50%)", "3 in 4 (75%)", "None"], ex: "Only bb (1 box of 4) is white." }]);
    return { kind: "mcq", title: "📘 Inheritance ideas", prompt: "Use the Punnett square.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Inheritance concepts" }; })
};
const LEVELS = {
  1: { intro: "Breed mice! Each parent passes ONE fur allele to each baby. B (black) is dominant over b (white).", pool: () => [S(1, 1, C.allBlack), S(2, 1, C.allWhite), S(2, 1, C.whiteMum), S(3, 1, C.surprise), D.pick(1), D.mcq(2), D.square(3)] },
  2: { intro: "Use Punnett squares to get exact ratios of black and white babies.", pool: () => [S(1, 1, C.half), S(2, 1, C.r31), S(2, 1, C.carriers), S(3, 1, C.quarterBB), D.square(1), D.pick(2), D.mcq(3)] },
  3: { intro: "Plan litters and use TEST CROSSES to reveal hidden genotypes.", pool: () => [S(1, 1, C.two8), S(2, 1, C.six16), S(3, 1, C.testBb), S(3, 1, C.testBB), D.litterNum(1), D.square(2), D.litterNum(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a mother and a father, then press ▶ to breed them and see the Punnett square and the babies.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Breed",
  goals: () => [{ txt: "Get some white babies", test: (s, m) => m.white }, { txt: "Get only black babies", test: (s, m) => m.black }, { txt: "Breed two black parents that give a white baby", test: (s, m) => m.surprise }],
  track: (s, m, ran) => { if (!ran) return; const f = frac(s); if (f.white > 0) m.white = 1; if (f.black === 1) m.black = 1; if (isBlack(s.p1) && isBlack(s.p2) && f.white > 0) m.surprise = 1; },
  facts: () => "📘 Each parent has TWO alleles and passes ONE to each baby. <b>B</b> (black) is dominant, <b>b</b> (white) is recessive — only <b>bb</b> mice are white."
});
E.start({ labId: "mouse", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🐭", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🐭", "🧀", "🧬", "✨"],
  exploreDemo: () => [{ set: { p1: "bb", p2: "bb" }, run: true }, { set: { p1: "BB", p2: "bb" }, run: true }, { set: { p1: "Bb", p2: "Bb" }, run: true }] });
})();
