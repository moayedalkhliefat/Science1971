"use strict";
// ===== Photoelectric Effect — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100;
const MET = { Cs: { name: "Caesium", phi: 2.1 }, Na: { name: "Sodium", phi: 2.3 }, Ca: { name: "Calcium", phi: 2.9 }, Zn: { name: "Zinc", phi: 4.3 }, Pt: { name: "Platinum", phi: 5.6 } };
const Eph = s => r2(1240 / s.lam);
const KE = s => r2(Math.max(0, 1240 / s.lam - MET[s.metal].phi));
const frees = s => 1240 / s.lam > MET[s.metal].phi;
const thr = m => Math.round(1240 / MET[m].phi);
const current = s => { if (!frees(s) || !s.I) return 0; const k = KE(s); if (s.V >= 0) return r2(s.I / 50); if (s.V <= -k + 0.04) return 0; return r2(s.I / 50 * (1 + s.V / k)); };
function lamCol(l) { if (l < 380) return "#9575cd"; const st = [[380, [120, 0, 160]], [440, [60, 60, 255]], [490, [0, 200, 220]], [530, [40, 200, 40]], [580, [240, 220, 0]], [620, [255, 120, 0]], [700, [220, 0, 0]], [800, [140, 0, 0]]]; for (let i = 1; i < st.length; i++) if (l <= st[i][0]) { const [a, ca] = st[i - 1], [b, cb] = st[i], t = (l - a) / (b - a); return `rgb(${ca.map((v, k) => Math.round(v + (cb[k] - v) * t)).join(",")})`; } return "rgb(140,0,0)"; }
const band = l => l < 380 ? "ultraviolet" : l <= 750 ? "visible" : "infrared";
function render(s) {
  const show = s.reveal, col = lamCol(s.lam), on = show && frees(s) && s.I > 0, i = current(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  // lamp & beam
  g += `<rect x="230" y="34" width="90" height="40" rx="8" fill="#37474f"/>${T(275, 59, "lamp", { s: 11, c: "#fff" })}`;
  if (s.I > 0) g += `<path d="M250,74 L310,74 L150,200 L110,200Z" fill="${col}" opacity="${0.12 + s.I / 260}"/>`;
  // tube
  g += `<rect x="70" y="120" width="460" height="170" rx="85" fill="#e3f2fd" opacity=".55" stroke="#90a4ae" stroke-width="2"/>${T(300, 140, "vacuum tube", { s: 10, c: "#78909c" })}`;
  g += `<rect x="110" y="150" width="16" height="110" fill="#b0bec5" stroke="#546e7a"/>${T(118, 310, MET[s.metal].name, { s: 12, c: "#37474f" })}<rect x="470" y="150" width="16" height="110" fill="#cfd8dc" stroke="#546e7a"/>${T(478, 310, "collector", { s: 12, c: "#37474f" })}`;
  if (on) { const n = Math.max(2, Math.round(s.I / 12)), reach = i > 0 ? 1 : Math.min(0.9, KE(s) / Math.max(0.01, -s.V)); for (let k = 0; k < n; k++) { const y = 162 + k * (90 / Math.max(1, n - 1)), x = 132 + (330 * reach) * (0.25 + 0.75 * ((k * 37) % 10) / 10); g += `<circle cx="${x}" cy="${y}" r="5" fill="#1e88e5"/>${T(x, y + 3.5, "−", { s: 9, c: "#fff" })}<line x1="${x + 8}" y1="${y}" x2="${x + 8 + 8 + KE(s) * 6}" y2="${y}" stroke="#1e88e5" stroke-width="1.5" opacity=".6"/>`; } }
  // circuit with battery and ammeter
  g += `<path d="M118,260 V370 H250 M350,370 H478 V260" fill="none" stroke="#455a64" stroke-width="3"/><rect x="250" y="352" width="100" height="36" rx="6" fill="#37474f"/>${T(300, 376, (s.V > 0 ? "+" : "") + s.V + " V", { s: 14, c: "#fff" })}${T(300, 404, s.V < 0 ? "collector negative (slows electrons)" : "collector positive", { s: 10, c: "#78909c" })}`;
  g += `<circle cx="478" cy="330" r="22" fill="#fff" stroke="#37474f" stroke-width="2"/>${T(478, 336, "A", { s: 14, c: "#37474f" })}`;
  if (!show) g += T(300, 215, "press ▶ to switch on the lamp", { s: 14, c: "#90a4ae" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${T(120, 56, `${s.lam} nm (${band(s.lam)}) · ${s.I}% bright`, { s: 11, c: "#546e7a" })}
    ${show ? T(120, 92, "photon energy = " + fmt(Eph(s)) + " eV", { s: 13, c: "#37474f" }) + T(120, 114, "work function = " + MET[s.metal].phi + " eV", { s: 13, c: "#37474f" }) + T(120, 150, frees(s) ? "✔ electrons escape" : "✘ no electrons escape", { s: 15, c: frees(s) ? "#2e7d32" : "#c62828" }) + T(120, 184, "max kinetic energy", { s: 12, c: "#78909c" }) + T(120, 210, fmt(KE(s)) + " eV", { s: 20, c: "#e65100" }) + T(120, 248, "current: " + fmt(i) + " µA", { s: 16, c: "#1565c0" }) + T(120, 274, MET[s.metal].name + " threshold: " + thr(s.metal) + " nm", { s: 11, c: "#78909c" }) : T(120, 170, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 330, "photon E (eV) = 1240 ÷ λ (nm)", { s: 11, c: "#37474f" })}${T(120, 350, "KE max = photon E − work function", { s: 11, c: "#37474f" })}${T(120, 372, "stopping voltage = KE max (in V)", { s: 11, c: "#37474f" })}${T(120, 392, "brighter = more electrons, not faster", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "metal", type: "select", label: "Metal plate", options: Object.keys(MET).map(v => ({ v, label: MET[v].name + " (" + MET[v].phi + " eV)" })), lock: lk("metal") },
  { id: "lam", type: "range", label: "Wavelength", min: 100, max: 800, step: 10, nudge: 10, unit: "nm", lock: lk("lam") },
  { id: "I", type: "range", label: "Brightness", min: 0, max: 100, step: 10, nudge: 10, unit: "%", lock: lk("I") },
  { id: "V", type: "range", label: "Battery voltage", min: -5, max: 5, step: 0.1, nudge: 0.1, unit: "V", hide: () => lv < 3, lock: lk("V") }]; };
const st = o => Object.assign({ metal: "Na", lam: 500, I: 50, V: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => frees(s) ? `Photon ${fmt(Eph(s))} eV → KE ${fmt(KE(s))} eV; current ${fmt(current(s))} µA.` : `Photon ${fmt(Eph(s))} eV is less than ${MET[s.metal].phi} eV — no electrons.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "💡 Photoelectric challenge", prompt: "Set up the experiment, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Each photon has energy 1240 ÷ λ (eV). It frees an electron only if this is more than the metal's work function. Brightness changes how many electrons, not their energy. KE max = photon energy − work function; a reverse voltage equal to KE max stops the current." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("pe-sim", diff, uses, mk);
const near = (a, b, t) => Math.abs(a - b) <= t;
const C = {
  naOn: () => simQ(1, "Make electrons come out of <b>sodium</b>.", st({ lam: 700 }), s => ok(frees(s) && s.I > 0, `${s.lam} nm photons have ${fmt(Eph(s))} eV — enough.`, said(s)), { lam: 400 }, { lock: ["metal"], wrong: { lam: 600 } }),
  bright: () => simQ(1, "Red light (700 nm) on sodium frees no electrons. Show that making it <b>100% bright</b> still frees <b>none</b>.", st({ lam: 700, I: 20 }), s => ok(s.I === 100 && current(s) === 0 && s.lam === 700, "Brighter red light = more photons, but each one is still too weak.", s.I !== 100 ? "Turn the brightness to 100%." : said(s)), { I: 100 }, { lock: ["metal", "lam"], wrong: { I: 80 } }),
  dbl: () => simQ(1, "Electrons are flowing. <b>Double the current</b> without changing the colour.", st({ lam: 400, I: 40 }), s => ok(current(s) === 1.6, "Twice as bright → twice as many photons → twice the current.", `Current: ${fmt(current(s))} µA.`), { I: 80 }, { lock: ["metal", "lam"], wrong: { I: 60 } }),
  zinc: () => simQ(1, "<b>Zinc</b>: find the <b>longest</b> wavelength that still frees electrons.", st({ metal: "Zn", lam: 400 }), s => ok(s.lam === 280, "280 nm (UV). Zinc's threshold is about 288 nm.", frees(s) ? "It works, but a longer wavelength also works." : said(s)), { lam: 280 }, { lock: ["metal", "I"], wrong: { lam: 290 } }),
  na08: () => simQ(2, "Make electrons leave <b>sodium</b> with <b>0.8 eV</b> (within 0.05).", st({ lam: 500 }), s => ok(frees(s) && near(KE(s), 0.8, 0.05), "400 nm: 3.1 − 2.3 = 0.8 eV.", said(s)), { lam: 400 }, { lock: ["metal", "I"], wrong: { lam: 450 } }),
  fastest: () => simQ(2, "Blue-violet light (<b>400 nm</b>). Choose the metal that gives the <b>fastest</b> electrons.", st({ metal: "Ca", lam: 400 }), s => ok(s.metal === "Cs", "Caesium has the lowest work function (2.1 eV): KE 1.0 eV.", `${MET[s.metal].name}: ${frees(s) ? fmt(KE(s)) + " eV" : "no electrons"}.`), { metal: "Cs" }, { lock: ["lam", "I"], wrong: { metal: "Na" } }),
  zn2: () => simQ(2, "Get electrons out of <b>zinc</b> with <b>more than 2 eV</b> of kinetic energy.", st({ metal: "Zn", lam: 280 }), s => ok(KE(s) > 2, `${s.lam} nm: ${fmt(KE(s))} eV.`, said(s)), { lam: 190 }, { lock: ["metal", "I"], wrong: { lam: 200 } }),
  ca10: () => simQ(2, "Make <b>calcium</b> give electrons with <b>1.0 eV</b> (within 0.05).", st({ metal: "Ca", lam: 400 }), s => ok(frees(s) && near(KE(s), 1, 0.05), "320 nm: 3.875 − 2.9 ≈ 0.98 eV.", said(s)), { lam: 320 }, { lock: ["metal", "I"], wrong: { lam: 300 } }),
  stop08: () => simQ(3, "Sodium, 400 nm. Find the battery voltage that <b>just stops</b> the current.", st({ lam: 400, V: 0 }), s => ok(current(s) === 0 && near(s.V, -0.8, 0.001), "−0.8 V: equal to the 0.8 eV kinetic energy.", current(s) ? `Still ${fmt(current(s))} µA.` : "The current stops — but a smaller reverse voltage also works."), { V: -0.8 }, { lock: ["metal", "lam", "I"], wrong: { V: -0.7 } }),
  zinc19: () => simQ(3, "Zinc at <b>200 nm</b>, <b>100% bright</b>: find the stopping voltage.", st({ metal: "Zn", lam: 200, I: 100, V: 0 }), s => ok(current(s) === 0 && near(s.V, -1.9, 0.001), "6.2 − 4.3 = 1.9 eV → −1.9 V. Brightness doesn't change it.", current(s) ? `Still ${fmt(current(s))} µA.` : "Stopped — but a smaller reverse voltage also works."), { V: -1.9 }, { lock: ["metal", "lam", "I"], wrong: { V: -1.8 } }),
  cs2: () => simQ(3, "<b>Caesium</b>: choose the light so the stopping voltage is about <b>2.0 V</b>, then set the battery to stop the current.", st({ metal: "Cs", lam: 500, V: 0 }), s => ok(near(KE(s), 2, 0.05) && current(s) === 0, "300 nm: 4.13 − 2.1 = 2.03 eV → stop with −2.0 V.", !near(KE(s), 2, 0.05) ? `KE is ${fmt(KE(s))} eV.` : `Still ${fmt(current(s))} µA.`), { lam: 300, V: -2 }, { lock: ["metal", "I"], wrong: { lam: 300, V: -1.5 } }),
  forward: () => simQ(3, "Sodium at 400 nm. Make the battery <b>help</b> the electrons (forward voltage) so the current is at its <b>maximum</b> for 60% brightness.", st({ lam: 400, I: 60, V: -0.5 }), s => ok(s.V >= 0 && current(s) === 1.2, "Any forward voltage collects every electron: 1.2 µA.", `Current: ${fmt(current(s))} µA.`), { V: 1 }, { lock: ["metal", "lam", "I"], wrong: { V: -0.2 } })
};
const D = {
  pick: diff => E.diaT("pe-pick", diff, 2, () => {
    const pool = E.shuffle([st({ metal: "Na", lam: 600 }), st({ metal: "Na", lam: 400 }), st({ metal: "Zn", lam: 400 }), st({ metal: "Zn", lam: 200 }), st({ metal: "Cs", lam: 550 }), st({ metal: "Pt", lam: 250 }), st({ metal: "Ca", lam: 350 })]).slice(0, 4);
    if (diff === 1) { if (!pool.some(frees)) pool[0] = st({ metal: "Na", lam: 400 }); if (pool.every(frees)) pool[pool.findIndex(frees) === 0 ? 1 : 0] = st({ metal: "Zn", lam: 400 });
      return { kind: "pick", many: true, title: "👆 Electrons or not?", prompt: "Click <b>every</b> set-up where electrons escape from the metal.", answer: pool.map((s, i) => frees(s) ? "k" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["k" + i, MET[s.metal].name + ", " + s.lam + " nm"])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><path d="M${x + 60},40 L${x + 130},40 L${x + 110},150 L${x + 80},150Z" fill="${lamCol(s.lam)}" opacity=".45"/><rect x="${x + 50}" y="150" width="96" height="20" fill="#b0bec5" stroke="#546e7a"/>${T(x + 98, 206, MET[s.metal].name + " (" + MET[s.metal].phi + " eV)", { s: 13, c: "#37474f" })}${T(x + 98, 232, s.lam + " nm → " + fmt(Eph(s)) + " eV", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Electrons escape only when the photon energy is bigger than the work function.", summary: "Threshold" }; }
    const ok2 = pool.filter(frees); if (ok2.length < 2) { pool[0] = st({ metal: "Zn", lam: 200 }); pool[1] = st({ metal: "Na", lam: 400 }); }
    const want = choice(["most", "least"]), vals = pool.map(s => frees(s) ? KE(s) : -1), cand = vals.filter(v => v >= 0), best = want === "most" ? Math.max(...cand) : Math.min(...cand);
    return { kind: "pick", title: "👆 Fastest electrons", prompt: `Of the set-ups that free electrons, click the one giving the <b>${want === "most" ? "fastest" : "slowest"}</b> electrons.`, answer: pool.map((s, i) => frees(s) && KE(s) === best ? "k" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["k" + i, MET[s.metal].name + ", " + s.lam + " nm"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212; return `<g class="pk" data-k="k${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><path d="M${x + 60},40 L${x + 130},40 L${x + 110},150 L${x + 80},150Z" fill="${lamCol(s.lam)}" opacity=".45"/><rect x="${x + 50}" y="150" width="96" height="20" fill="#b0bec5" stroke="#546e7a"/>${T(x + 98, 206, MET[s.metal].name + " (" + MET[s.metal].phi + " eV)", { s: 13, c: "#37474f" })}${T(x + 98, 232, s.lam + " nm", { s: 13, c: "#78909c" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["k" + i])}/></g>`; }).join("")}</svg>`,
      explain: "KE = 1240 ÷ λ − work function: " + pool.map(s => frees(s) ? fmt(KE(s)) + " eV" : "none").join(", ") + ".", summary: "Comparing KE" };
  }),
  num: diff => E.diaT("pe-num", diff, 2, () => {
    if (diff === 1) { const l = choice([400, 310, 620, 248]);
      return { kind: "num", title: "🧮 Photon energy", prompt: `Light of wavelength <b>${l} nm</b>. Photon energy (eV) = 1240 ÷ λ (nm).`, visual: render(st({ lam: l })), fields: [{ label: "Photon energy", unit: "eV", answer: r2(1240 / l) }], explain: `1240 ÷ ${l} = ${fmt(r2(1240 / l))} eV.`, summary: "Photon energy" }; }
    if (diff === 2) { const c = choice([["Na", 400], ["Zn", 200], ["Cs", 310], ["Ca", 248]]);
      return { kind: "num", title: "🧮 Kinetic energy", prompt: `${MET[c[0]].name} (work function <b>${MET[c[0]].phi} eV</b>) is lit with <b>${c[1]} nm</b> light.`, visual: render(st({ metal: c[0], lam: c[1] })), fields: [{ label: "Max kinetic energy", unit: "eV", answer: r2(1240 / c[1] - MET[c[0]].phi), tol: 0.02 }], explain: `${fmt(r2(1240 / c[1]))} − ${MET[c[0]].phi} = ${fmt(r2(1240 / c[1] - MET[c[0]].phi))} eV.`, summary: "Einstein's equation" }; }
    const m = choice(["Na", "Zn", "Pt", "Cs"]);
    return { kind: "num", title: "🧮 Threshold wavelength", prompt: `${MET[m].name} has a work function of <b>${MET[m].phi} eV</b>. Threshold λ = 1240 ÷ work function.`, visual: render(st({ metal: m })), fields: [{ label: "Threshold wavelength", unit: "nm", answer: r2(1240 / MET[m].phi), tol: 2 }], explain: `1240 ÷ ${MET[m].phi} = ${fmt(r2(1240 / MET[m].phi))} nm — shorter wavelengths free electrons.`, summary: "Threshold" };
  }),
  mcq: diff => E.diaT("pe-mcq", diff, 2, () => { const q = choice([
      { ask: "Why can't very bright red light free electrons from zinc?", ok: "Each red photon has too little energy, and one photon frees one electron", bad: ["Red light is too bright", "Zinc reflects all light", "Electrons need heat, not light"], ex: "Brightness = number of photons, not energy per photon." },
      { ask: "What does the photoelectric effect show about light?", ok: "Light comes in packets of energy called photons", bad: ["Light is only a wave", "Light has no energy", "Light is made of electrons"], ex: "Einstein won the Nobel Prize for this idea." },
      { ask: "Making the light brighter (same colour, above threshold)…", ok: "frees more electrons per second but not faster ones", bad: ["makes the electrons faster", "lowers the work function", "stops the effect"], ex: "KE depends only on the photon energy." },
      { ask: "Solar panels use a similar effect to…", ok: "turn light energy into electrical energy", bad: ["store heat", "make light from electricity", "turn sound into electricity"], ex: "Photons free charges in the cell to make a current." }]);
    return { kind: "mcq", title: "📘 Photon ideas", prompt: "Think about photons, energy and electrons.", visual: render(st({ lam: 400, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Photoelectric effect" }; })
};
const LEVELS = {
  1: { intro: "Light knocks electrons out of a metal — but only if each photon has enough energy. Brightness alone can't do it.", pool: () => [S(1, 1, C.naOn), S(2, 1, C.bright), S(2, 1, C.dbl), S(3, 1, C.zinc), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "The leftover energy becomes the electron's kinetic energy: KE = photon energy − work function.", pool: () => [S(1, 1, C.fastest), S(2, 1, C.na08), S(2, 1, C.ca10), S(3, 1, C.zn2), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "A reverse voltage can stop the fastest electrons: the stopping voltage equals KE max.", pool: () => [S(1, 1, C.forward), S(2, 1, C.stop08), S(3, 1, C.zinc19), S(3, 1, C.cs2), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Choose the metal, the light's wavelength and brightness, and the battery voltage. Press ▶ to switch on the lamp.",
  state: () => st(), controls: () => ctls(3), render, run, runLabel: "▶ Shine",
  goals: () => [{ txt: "Free electrons from a metal", test: (s, m) => m.f }, { txt: "Shine light that frees none", test: (s, m) => m.n }, { txt: "Stop the current with a reverse voltage", test: (s, m) => m.s }],
  track: (s, m, ran) => { if (!ran) return; if (frees(s) && s.I > 0) m.f = 1; if (!frees(s) && s.I > 0) m.n = 1; if (frees(s) && s.I > 0 && current(s) === 0) m.s = 1; },
  facts: () => "📘 The <b>photoelectric effect</b> showed that light comes in <b>photons</b> — the start of quantum physics."
});
E.start({ labId: "photoelec", total: 7, plan: { sim: 4, dia: 3 }, emoji: "💡", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["💡", "⚡", "✨", "🔵"],
  exploreDemo: () => [{ set: { metal: "Na", lam: 400, I: 50, V: 0 }, run: true }, { set: { lam: 700 }, run: true }, { set: { lam: 400, V: -1 }, run: true }] });
})();
