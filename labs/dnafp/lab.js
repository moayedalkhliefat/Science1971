"use strict";
// ===== DNA Fingerprinting (gel electrophoresis) — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const PROF = { A: [300, 800, 1500], B: [250, 700, 2000], C: [300, 900, 1500], D: [400, 900, 1200] }, CRIME = "C";
const LADDER = [100, 200, 500, 1000, 2000, 5000];
const ENZ = { EcoRI: [500, 1400], BamHI: [800], HindIII: [300, 1100, 1600], "EcoRI+BamHI": [500, 800, 1400] };
const frags = cuts => { const p = [0].concat(cuts, [2000]); return p.slice(1).map((x, i) => x - p[i]); };
const dist = (s, bp) => 0.012 * s.V * s.t * (4 - Math.log10(bp)) * (s.pol === "rev" ? -1 : 1);
const sep = s => dist(s, 800) - dist(s, 900); // closest pair of bands in the suspect line-up
const onGel = (s, bp) => { const d = dist(s, bp); return d >= 0 && d <= 100; };
function lanes(s) {
  if (s.mode === "cut") return [["Ladder", LADDER, true], ["Uncut DNA", [2000]], [s.enz, frags(ENZ[s.enz])]];
  const L = [["Crime scene", PROF[CRIME]]].concat(Object.keys(PROF).map(k => ["Suspect " + k, PROF[k]]));
  return s.ladder ? [["Ladder", LADDER, true]].concat(L) : L;
}
function render(s) {
  const show = s.reveal, LN = lanes(s), n = LN.length, GX = 40, GW = 520, lw = GW / n, Y0 = 80, MM = 3.0;
  let g = `<rect width="860" height="450" fill="#eef1fb"/>`;
  g += `<rect x="${GX - 14}" y="40" width="${GW + 28}" height="${100 * MM + 80}" rx="14" fill="#cfd8dc"/><rect x="${GX}" y="${Y0 - 10}" width="${GW}" height="${100 * MM + 20}" rx="6" fill="#e3f2fd" stroke="#90a4ae"/>
    <rect x="${GX - 14}" y="40" width="${GW + 28}" height="22" rx="8" fill="${s.pol === "rev" ? "#e53935" : "#263238"}"/>${T(GX + GW / 2, 56, s.pol === "rev" ? "+  positive (red)" : "−  negative (black)", { s: 12, c: "#fff" })}
    <rect x="${GX - 14}" y="${Y0 + 100 * MM + 12}" width="${GW + 28}" height="22" rx="8" fill="${s.pol === "rev" ? "#263238" : "#e53935"}"/>${T(GX + GW / 2, Y0 + 100 * MM + 28, s.pol === "rev" ? "−  negative (black)" : "+  positive (red)", { s: 12, c: "#fff" })}`;
  for (let mm = 0; mm <= 100; mm += 20) g += `<line x1="${GX + GW}" y1="${Y0 + mm * MM}" x2="${GX + GW + 8}" y2="${Y0 + mm * MM}" stroke="#546e7a"/>${T(GX + GW + 12, Y0 + mm * MM + 4, mm + " mm", { a: "start", s: 10, c: "#546e7a" })}`;
  LN.forEach(([name, list, ladder], i) => { const x = GX + i * lw + lw / 2;
    g += `<rect x="${x - lw * .3}" y="${Y0 - 6}" width="${lw * .6}" height="8" rx="2" fill="#78909c"/>${T(x, Y0 + 100 * MM + 50, name, { s: 11, c: name === "Crime scene" ? "#c62828" : "#37474f" })}`;
    list.forEach(bp => { if (show && !onGel(s, bp)) return; const d = show ? dist(s, bp) : 0, y = Y0 + d * MM, dup = list.filter(b => b === bp).length;
      g += `<rect x="${x - lw * .32}" y="${y - 3}" width="${lw * .64}" height="${6 + (dup > 1 ? 3 : 0)}" rx="3" fill="${ladder ? "#7e57c2" : name === "Crime scene" ? "#e53935" : "#1e88e5"}" opacity="${show ? 0.9 : 0.5}"/>${ladder && show ? T(x - lw * .36, y + 4, bp + "", { a: "end", s: 9, c: "#4527a0" }) : ""}`; }); });
  // info panel
  const lost = show ? LN.reduce((a, l) => a + l[1].filter(b => !onGel(s, b)).length, 0) : 0;
  g += `<g transform="translate(620,40)"><rect width="220" height="380" rx="14" fill="#fff" stroke="#c5cae9" stroke-width="2"/>${T(110, 28, "POWER SUPPLY", { s: 13, c: "#283593" })}
    ${T(110, 64, s.V + " V", { s: 26, c: "#1a237e" })}${T(110, 98, s.t + " minutes", { s: 18, c: "#1a237e" })}
    ${T(110, 140, s.pol === "rev" ? "⚠ wires reversed" : "DNA (−) moves to +", { s: 13, c: s.pol === "rev" ? "#c62828" : "#2e7d32" })}
    ${show ? T(110, 186, s.mode === "cut" ? frags(ENZ[s.enz]).length + " fragments" : "800/900 bands: " + fmt(Math.abs(sep(s))) + " mm apart", { s: 13, c: "#37474f" }) : ""}
    ${show && lost ? T(110, 212, lost + " band(s) ran off the gel!", { s: 13, c: "#c62828" }) : ""}
    ${s.mode === "cut" && show ? T(110, 250, "sizes: " + frags(ENZ[s.enz]).join(", ") + " bp", { s: 11, c: "#37474f" }) : ""}
    ${T(110, 300, "Small pieces of DNA", { s: 12, c: "#5c6bc0" })}${T(110, 318, "move FASTER and FARTHER.", { s: 12, c: "#5c6bc0" })}${T(110, 350, show ? "" : "press ▶ to run the gel", { s: 13, c: "#9fa8da" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "pol", type: "choice", label: "Wires", options: [{ v: "ok", label: "− top / + bottom" }, { v: "rev", label: "+ top / − bottom" }], hide: () => lv > 1, lock: lk("pol") },
  { id: "enz", type: "choice", label: "Restriction enzyme", options: Object.keys(ENZ).map(v => ({ v, label: v })), wide: true, hide: s => s.mode !== "cut", lock: lk("enz") },
  { id: "V", type: "range", label: "Voltage", min: 50, max: 150, step: 10, nudge: 10, unit: "V", lock: lk("V") },
  { id: "t", type: "range", label: "Run time", min: 10, max: 60, step: 5, nudge: 5, unit: "min", lock: lk("t") },
  { id: "guess", type: "choice", label: "Who matches the crime scene?", options: Object.keys(PROF).map(v => ({ v, label: "Suspect " + v })), hide: s => !s.ask, lock: lk("guess") }]; };
const st = o => Object.assign({ mode: "match", pol: "ok", V: 100, t: 40, enz: "EcoRI", ladder: false }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🧬 Gel challenge", prompt: "Set up the gel, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "DNA is negative, so it moves towards the + electrode. Distance ∝ voltage × time; small fragments move farther. Bands that go past 100 mm are lost." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("fp-sim", diff, uses, mk);
const C = {
  match: () => simQ(1, "Run the gel and decide: <b>which suspect's DNA matches</b> the crime scene?", st({ ask: true }), s => ok(s.guess === CRIME && s.pol === "ok", "Suspect C has exactly the same bands (300, 900, 1500 bp).", s.pol !== "ok" ? "Connect the wires so the DNA moves into the gel." : "Compare every band — they must ALL line up."), { guess: "C" }, { lock: ["V", "t"], wrong: { guess: "A" } }),
  wires: () => simQ(1, "The DNA must move <b>down into the gel</b>. Connect the wires the right way.", st({ pol: "rev" }), s => ok(s.pol === "ok", "DNA is negatively charged, so it moves towards the + electrode at the bottom.", "The DNA moved out of the wells the wrong way!"), { pol: "ok" }, { lock: ["V", "t"], wrong: { pol: "rev" } }),
  time: () => simQ(1, "At 100 V, choose a run time that <b>separates the 800 and 900 bp bands</b> (at least 2 mm apart) <b>without losing</b> any band off the gel.", st({ t: 10 }), s => ok(s.pol === "ok" && Math.abs(sep(s)) >= 2 && Object.values(PROF).flat().every(b => onGel(s, b)), `${s.t} min: bands ${fmt(sep(s))} mm apart, all still on the gel.`, Math.abs(sep(s)) < 2 ? "Bands still too close — run longer." : "Some bands ran off the end — run shorter."), { t: 40 }, { lock: ["V", "pol"], wrong: { t: 25 } }),
  noShare: () => simQ(1, "Find the suspect who shares <b>no bands at all</b> with the crime scene.", st({ ask: true }), s => ok(s.guess === "B", "Suspect B: 250, 700, 2000 bp — none match.", "That suspect shares at least one band."), { guess: "B" }, { lock: ["V", "t", "pol"], wrong: { guess: "D" } }),
  ladder50: () => simQ(2, "Run until the <b>500 bp ladder band</b> reaches the <b>50 mm</b> mark (±1.5 mm).", st({ ladder: true, V: 50, t: 10 }), s => ok(Math.abs(dist(s, 500) - 50) <= 1.5, `500 bp band at ${fmt(dist(s, 500))} mm.`, `500 bp band at ${fmt(dist(s, 500))} mm.`), { V: 80, t: 40 }, { wrong: { V: 100, t: 40 } }),
  keep100: () => simQ(2, "At <b>150 V</b>, run for the <b>longest time</b> that keeps the 100 bp ladder band on the gel.", st({ ladder: true, V: 150, t: 10 }), s => ok(onGel(s, 100) && s.t === 25, `25 min: 100 bp band at ${fmt(dist(s, 100))} mm.`, !onGel(s, 100) ? "The 100 bp band ran off the gel." : "You can run longer."), { t: 25 }, { lock: ["V"], wrong: { t: 30 } }),
  k40: () => simQ(2, "Make the <b>1000 bp</b> ladder band travel <b>40 mm</b> (±1 mm).", st({ ladder: true, V: 50, t: 20 }), s => ok(Math.abs(dist(s, 1000) - 40) <= 1, `1000 bp band at ${fmt(dist(s, 1000))} mm.`, `1000 bp band at ${fmt(dist(s, 1000))} mm.`), { V: 110, t: 30 }, { wrong: { V: 100, t: 30 } }),
  sixty: () => simQ(2, "The run time is fixed at <b>60 min</b>. Choose a voltage that separates 800/900 bp by <b>2.5 mm or more</b> and keeps every band on the gel.", st({ ladder: false, V: 50, t: 60 }), s => ok(Math.abs(sep(s)) >= 2.5 && Object.values(PROF).flat().every(b => onGel(s, b)), `${s.V} V: ${fmt(sep(s))} mm apart, all bands on the gel.`, Math.abs(sep(s)) < 2.5 ? "Bands too close — more voltage." : "Bands ran off — less voltage."), { V: 70 }, { lock: ["t"], wrong: { V: 50 } }),
  three: () => simQ(3, "Cut the 2000 bp DNA into <b>exactly 3 fragments</b>.", st({ mode: "cut", enz: "BamHI" }), s => ok(frags(ENZ[s.enz]).length === 3, `${s.enz} cuts twice → ${frags(ENZ[s.enz]).join(", ")} bp.`, `${s.enz} makes ${frags(ENZ[s.enz]).length} fragments.`), { enz: "EcoRI" }, { lock: ["V", "t"], wrong: { enz: "HindIII" } }),
  big1200: () => simQ(3, "Choose the enzyme that makes a <b>1200 bp</b> fragment.", st({ mode: "cut", enz: "EcoRI" }), s => ok(frags(ENZ[s.enz]).includes(1200), `${s.enz}: ${frags(ENZ[s.enz]).join(", ")} bp.`, `${s.enz}: ${frags(ENZ[s.enz]).join(", ")} bp — no 1200.`), { enz: "BamHI" }, { lock: ["V", "t"], wrong: { enz: "EcoRI+BamHI" } }),
  hidden: () => simQ(3, "Make <b>4 fragments</b> that show only <b>3 bands</b> (two pieces the same size).", st({ mode: "cut", enz: "EcoRI" }), s => { const f = frags(ENZ[s.enz]); return ok(f.length === 4 && new Set(f).size === 3, "EcoRI + BamHI: 500, 300, 600, 600 — the two 600s make one thick band.", `${s.enz}: ${f.join(", ")} bp.`); }, { enz: "EcoRI+BamHI" }, { lock: ["V", "t"], wrong: { enz: "HindIII" } }),
  far: () => simQ(3, "Cut with <b>HindIII</b>. Run at 100 V so the <b>300 bp</b> band reaches at least <b>70 mm</b> without running off.", st({ mode: "cut", enz: "HindIII", V: 100, t: 20 }), s => ok(dist(s, 300) >= 70 && onGel(s, 300) && onGel(s, 100) !== null, `300 bp band at ${fmt(dist(s, 300))} mm.`, `300 bp band at ${fmt(dist(s, 300))} mm.`), { t: 45 }, { lock: ["V", "enz"], wrong: { t: 35 } })
};
const D = {
  pick: diff => E.diaT("fp-pick", diff, 2, () => { const s = st({ reveal: true, V: 100, t: 40 }), want = choice(["small", "large"]);
    const bands = [["a", 300], ["b", 900], ["c", 1500], ["d", 2000]];
    return { kind: "pick", title: "👆 Read the gel", prompt: want === "small" ? "Click the band made of the <b>smallest</b> DNA fragment." : "Click the band made of the <b>largest</b> DNA fragment.", answer: [want === "small" ? "a" : "d"], names: { a: "band 1", b: "band 2", c: "band 3", d: "band 4" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#eef1fb"/><rect x="200" y="20" width="460" height="260" rx="8" fill="#e3f2fd" stroke="#90a4ae"/><rect x="380" y="26" width="100" height="8" fill="#78909c"/>${T(430, 18, "well (−)", { s: 11, c: "#37474f" })}${T(430, 296, "+", { s: 14, c: "#c62828" })}${bands.map(([k, bp]) => { const y = 34 + dist(s, bp) * 2.4; return `<g class="pk" data-k="${k}"><rect x="370" y="${y - 8}" width="120" height="16" rx="4" fill="#1e88e5"/><rect x="364" y="${y - 12}" width="132" height="24" rx="6" fill="none" ${E.ring(s2[k])}/></g>`; }).join("")}</svg>`,
      explain: "Smaller fragments travel farthest from the well; the largest stays nearest the well.", summary: "Read a gel" }; }),
  num: diff => E.diaT("fp-num", diff, 2, () => { const c = choice([[[400, 1100, 1700], 0], [[500, 900, 2600], 0], [[350, 450, 1200], 0]]), cuts = c[0], f = frags(cuts.filter(x => x < 2000));
    return { kind: "num", title: "🧮 Restriction fragments", prompt: `A 2000 bp piece of DNA is cut at positions <b>${cuts.filter(x => x < 2000).join(", ")}</b> bp.`, visual: render(st({ mode: "cut", enz: "HindIII" })),
      fields: [{ label: "Number of fragments", unit: "", answer: f.length }, { label: "Size of the largest fragment", unit: "bp", answer: Math.max(...f) }], explain: `Fragments: ${f.join(", ")} bp.`, summary: "Restriction fragment sizes" }; }),
  mcq: diff => E.diaT("fp-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does DNA move towards the positive electrode?", ok: "DNA is negatively charged", bad: ["DNA is positively charged", "The gel pulls it by gravity", "Water carries it"], ex: "Phosphate groups give DNA a negative charge." },
      { ask: "Why do small DNA fragments travel farther in the gel?", ok: "They slip through the holes in the gel more easily", bad: ["They have more charge", "They are heavier", "They are pushed by large fragments"], ex: "The gel acts like a sieve." },
      { ask: "Why is a DNA fingerprint useful in solving crimes?", ok: "Almost everyone's band pattern is different", bad: ["Everyone has the same bands", "It shows a person's age", "It only works on blood"], ex: "Except identical twins, DNA profiles are unique." }]);
    return { kind: "mcq", title: "📘 Gel ideas", prompt: "Look at the gel.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Gel electrophoresis concepts" }; })
};
const LEVELS = {
  1: { intro: "A crime-scene DNA sample and four suspects are loaded into a gel. Run it and find the match!", pool: () => [S(1, 1, C.wires), S(2, 1, C.match), S(2, 1, C.noShare), S(3, 1, C.time), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Voltage × time decides how far DNA travels. Use the ladder to measure exactly.", pool: () => [S(1, 1, C.ladder50), S(2, 1, C.k40), S(2, 1, C.keep100), S(3, 1, C.sixty), D.pick(1), D.mcq(2), D.pick(3)] },
  3: { intro: "Restriction enzymes cut DNA at special places. Plan the cuts and read the fragments.", pool: () => [S(1, 1, C.three), S(2, 1, C.big1200), S(3, 1, C.hidden), S(3, 1, C.far), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change the voltage and time, then press ▶ to run the gel and compare the DNA bands.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Run gel",
  goals: () => [{ txt: "Run the gel the right way", test: (s, m) => m.ok }, { txt: "Make a band run off the end", test: (s, m) => m.lost }, { txt: "Separate the bands clearly", test: (s, m) => m.sep }],
  track: (s, m, ran) => { if (!ran) return; if (s.pol === "ok") m.ok = 1; if (Object.values(PROF).flat().some(b => !onGel(s, b))) m.lost = 1; if (Math.abs(sep(s)) >= 2 && s.pol === "ok") m.sep = 1; },
  facts: () => "📘 <b>Gel electrophoresis</b> sorts DNA fragments by size. Each person's band pattern is like a <b>fingerprint</b>."
});
E.start({ labId: "dnafp", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧬", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧬", "🔍", "🧪", "✨"],
  exploreDemo: () => [{ set: { V: 100, t: 40 }, run: true }, { set: { V: 150, t: 60 }, run: true }] });
})();
