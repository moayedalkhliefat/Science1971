"use strict";
// ===== Blackbody Spectrum — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r1 = x => Math.round(x * 10) / 10, r2 = x => Math.round(x * 100) / 100;
const WIEN = 2898000, SIG = 5.67e-8, HCK = 1.4388e7;
const peak = s => r1(WIEN / s.T);
const power = s => r2(SIG * Math.pow(s.T, 4) / 1e6); // MW/m²
const region = l => l < 380 ? "ultraviolet" : l <= 750 ? "visible" : "infrared";
const glow = t => t < 1000 ? "no visible glow" : t < 2000 ? "dull red" : t < 3500 ? "orange" : t < 5000 ? "yellow-white" : t < 7000 ? "white" : "blue-white";
const planck = (l, t) => 1 / Math.pow(l, 5) / (Math.exp(HCK / (l * t)) - 1);
function rgb(t) { // approximate colour of a blackbody (Tanner Helland)
  const k = t / 100; let r, g, b;
  r = k <= 66 ? 255 : 329.7 * Math.pow(k - 60, -0.1332);
  g = k <= 66 ? 99.47 * Math.log(k) - 161.12 : 288.12 * Math.pow(k - 60, -0.0755);
  b = k >= 66 ? 255 : k <= 19 ? 0 : 138.52 * Math.log(k - 10) - 305.04;
  const c = v => Math.max(0, Math.min(255, Math.round(v)));
  const dim = t < 1000 ? 0.15 : t < 1800 ? 0.4 + (t - 1000) / 1800 : 1;
  return `rgb(${c(r * dim)},${c(g * dim)},${c(b * dim)})`;
}
function render(s) {
  const show = s.reveal, lp = peak(s), gx = l => 70 + l / 3000 * 470, base = 372, top = 178;
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += `<rect x="40" y="34" width="150" height="100" rx="12" fill="#263238"/><circle cx="115" cy="84" r="${show ? 36 : 30}" fill="${show ? rgb(s.T) : "#424242"}"/>${show && s.T >= 1000 ? `<circle cx="115" cy="84" r="46" fill="${rgb(s.T)}" opacity=".25"/>` : ""}${T(115, 150, show ? glow(s.T) : "", { s: 12, c: "#37474f" })}`;
  g += T(380, 60, "object at " + s.T + " K", { s: 18, c: "#37474f" }) + T(380, 88, "(" + (s.T - 273) + " °C)", { s: 12, c: "#78909c" });
  // graph
  g += `<defs><linearGradient id="vis" x1="0" x2="1"><stop offset="0" stop-color="#78009f"/><stop offset=".2" stop-color="#3c3cff"/><stop offset=".35" stop-color="#00c8dc"/><stop offset=".48" stop-color="#28c828"/><stop offset=".62" stop-color="#f0dc00"/><stop offset=".75" stop-color="#ff7800"/><stop offset="1" stop-color="#dc0000"/></linearGradient></defs>`;
  g += `<rect x="${gx(380)}" y="${top}" width="${gx(750) - gx(380)}" height="${base - top}" fill="url(#vis)" opacity=".18"/>${T((gx(380) + gx(750)) / 2, top + 14, "visible", { s: 10, c: "#546e7a" })}${T((gx(0) + gx(380)) / 2, top + 14, "UV", { s: 10, c: "#546e7a" })}${T((gx(750) + gx(3000)) / 2, top + 14, "infrared", { s: 10, c: "#546e7a" })}`;
  g += `<line x1="70" y1="${base}" x2="545" y2="${base}" stroke="#90a4ae" stroke-width="1.5"/><line x1="70" y1="${base}" x2="70" y2="${top - 6}" stroke="#90a4ae" stroke-width="1.5"/>${T(545, base + 30, "wavelength (nm)", { a: "end", s: 11, c: "#546e7a" })}${T(545, top - 10, "brightness (curve scaled to its peak)", { a: "end", s: 10, c: "#546e7a" })}`;
  [0, 500, 1000, 1500, 2000, 2500, 3000].forEach(l => g += T(gx(l), base + 14, l, { s: 10, c: "#90a4ae" }));
  if (show) {
    const pk = planck(Math.min(3000, Math.max(60, lp)), s.T); let d = "";
    for (let l = 60; l <= 3000; l += 10) { const v = planck(l, s.T) / pk; d += (d ? " L" : "M") + gx(l) + "," + (base - Math.min(1.05, v) * (base - top - 24)); }
    g += `<path d="${d}" fill="none" stroke="#5e35b1" stroke-width="3"/>`;
    if (lp <= 3000) g += `<line x1="${gx(lp)}" y1="${base}" x2="${gx(lp)}" y2="${top + 20}" stroke="#ef6c00" stroke-dasharray="5 4" stroke-width="2"/>${T(gx(lp) + 6, top + 34, "peak " + fmt(lp) + " nm", { a: "start", s: 12, c: "#ef6c00" })}`;
    else g += T(540, top + 34, "peak is off the scale (" + fmt(lp) + " nm) →", { a: "end", s: 12, c: "#ef6c00" });
  } else g += T(300, 270, "press ▶ to heat the object", { s: 14, c: "#90a4ae" });
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${show ? T(120, 70, "peak wavelength", { s: 12, c: "#78909c" }) + T(120, 100, fmt(lp) + " nm", { s: 24, c: "#e65100" }) + T(120, 124, region(lp), { s: 13, c: "#37474f" }) + T(120, 166, "power given out", { s: 12, c: "#78909c" }) + T(120, 194, fmt(power(s)) + " MW/m²", { s: 20, c: "#c62828" }) + T(120, 226, "glow: " + glow(s.T), { s: 13, c: "#37474f" }) : T(120, 160, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 300, "Wien: λ peak = 2 898 000 ÷ T", { s: 12, c: "#37474f" })}${T(120, 318, "(λ in nm, T in K)", { s: 10, c: "#90a4ae" })}${T(120, 344, "Stefan: power = σT⁴", { s: 12, c: "#37474f" })}${T(120, 362, "σ = 5.67 × 10⁻⁸ W/m²K⁴", { s: 10, c: "#90a4ae" })}${T(120, 386, "hotter → bluer and much brighter", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "T", type: "range", label: "Temperature", min: 300, max: 12000, step: 100, nudge: 100, unit: "K", lock: lk("T") }]; };
const st = o => Object.assign({ T: 1500 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `${s.T} K: peak ${fmt(peak(s))} nm (${region(peak(s))}), ${fmt(power(s))} MW/m², ${glow(s.T)}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔥 Hot-object challenge", prompt: "Set the temperature, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Hotter objects glow brighter and bluer. Wien's law: peak wavelength (nm) = 2 898 000 ÷ T (K). Stefan's law: power ∝ T⁴ — double T gives 16 × the power. Glow: below 1000 K none; dull red; orange; yellow-white; white; above 7000 K blue-white." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("bb-sim", diff, uses, mk);
const C = {
  red: () => simQ(1, "Make the object glow <b>dull red</b> (like a hot stove ring).", st({ T: 300 }), s => ok(glow(s.T) === "dull red", "1000–2000 K: a dull red glow.", said(s)), { T: 1500 }, { wrong: { T: 2500 } }),
  noGlow: () => simQ(1, "Make the object <b>hot</b> (above room temperature) but give <b>no visible glow</b> at all.", st({ T: 2000 }), s => ok(s.T > 300 && s.T < 1000, "Below 1000 K it only gives out infrared.", s.T <= 300 ? "That is not hot." : said(s)), { T: 700 }, { wrong: { T: 1200 } }),
  sun: () => simQ(1, "Make the peak at about <b>500 nm</b> like the Sun (within 3 nm).", st({ T: 3000 }), s => ok(Math.abs(peak(s) - 500) <= 3, "About 5800 K — the Sun's surface.", said(s)), { T: 5800 }, { wrong: { T: 5500 } }),
  blue: () => simQ(1, "Make a <b>blue-white</b> star whose peak is in the <b>ultraviolet</b>.", st({ T: 4000 }), s => ok(glow(s.T) === "blue-white" && region(peak(s)) === "ultraviolet", "Above about 7600 K the peak is below 380 nm.", said(s)), { T: 9000 }, { wrong: { T: 7000 } }),
  p1000: () => simQ(2, "Put the peak at <b>1000 nm</b> (within 2 nm).", st({ T: 5000 }), s => ok(Math.abs(peak(s) - 1000) <= 2, "T = 2 898 000 ÷ 1000 ≈ 2900 K.", said(s)), { T: 2900 }, { wrong: { T: 3000 } }),
  p290: () => simQ(2, "Put the peak at <b>290 nm</b> in the ultraviolet (within 1 nm).", st({ T: 5000 }), s => ok(Math.abs(peak(s) - 290) <= 1, "10 000 K: 2 898 000 ÷ 10 000 = 289.8 nm.", said(s)), { T: 10000 }, { wrong: { T: 9900 } }),
  half: () => simQ(2, "At 3000 K the peak is 966 nm. <b>Halve</b> the peak wavelength.", st({ T: 3000 }), s => ok(Math.abs(peak(s) - 483) <= 1, "Double the temperature (6000 K) → half the wavelength.", said(s)), { T: 6000 }, { wrong: { T: 4500 } }),
  edge: () => simQ(2, "Find the <b>lowest</b> temperature whose peak is <b>inside the visible range</b> (≤ 750 nm).", st({ T: 2000 }), s => ok(s.T === 3900, "3900 K: peak 743 nm. At 3800 K it is 763 nm (infrared).", region(peak(s)) !== "visible" ? `Peak ${fmt(peak(s))} nm — not visible.` : "Visible — but a lower temperature also works."), { T: 3900 }, { wrong: { T: 4000 } }),
  x16: () => simQ(3, "At 3000 K the object gives out 4.59 MW/m². Make it give out <b>16 times</b> as much.", st({ T: 3000 }), s => ok(Math.abs(power(s) - 16 * 4.59) < 0.2, "Double the temperature: 2⁴ = 16.", said(s)), { T: 6000 }, { wrong: { T: 12000 } }),
  mw1: () => simQ(3, "Make the object give out about <b>1 MW/m²</b> (within 0.1).", st({ T: 5000 }), s => ok(Math.abs(power(s) - 1) <= 0.1, "About 2000 K.", said(s)), { T: 2000 }, { wrong: { T: 2200 } }),
  sixty4: () => simQ(3, "Make the object give out <b>81 times</b> the power it gives at 1000 K.", st({ T: 1000 }), s => ok(s.T === 3000, "3 × the temperature → 3⁴ = 81 × the power.", said(s)), { T: 3000 }, { wrong: { T: 9000 } }),
  both: () => simQ(3, "Make the peak <b>visible</b> AND the power <b>more than 100 MW/m²</b>.", st({ T: 4000 }), s => ok(region(peak(s)) === "visible" && power(s) > 100, `${s.T} K works.`, said(s)), { T: 7000 }, { wrong: { T: 6000 } })
};
const D = {
  pick: diff => E.diaT("bb-pick", diff, 2, () => {
    const pool = E.shuffle([3000, 4500, 5800, 9000, 2000, 12000]).slice(0, 4), want = choice(["hot", "cold"]), best = want === "hot" ? Math.max(...pool) : Math.min(...pool);
    if (diff === 1) return { kind: "pick", title: "👆 Star colours", prompt: `Click the <b>${want === "hot" ? "hottest" : "coolest"}</b> star.`, answer: ["t" + best], names: Object.fromEntries(pool.map(t => ["t" + t, "star"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#0d1b3e"/>${pool.map((t, i) => { const x = 113 + i * 212; return `<g class="pk" data-k="t${t}"><circle cx="${x}" cy="140" r="80" fill="transparent"/><circle cx="${x}" cy="140" r="62" fill="${rgb(t)}" opacity=".25"/><circle cx="${x}" cy="140" r="46" fill="${rgb(t)}"/>${T(x, 250, "star " + "ABCD"[i], { s: 15, c: "#fff" })}<circle cx="${x}" cy="140" r="70" fill="none" ${E.ring(s2["t" + t])}/></g>`; }).join("")}</svg>`,
      explain: "Red stars are coolest; blue-white stars are hottest.", summary: "Star colour and temperature" };
    return { kind: "pick", title: "👆 Spectrum peaks", prompt: `Each curve is a blackbody spectrum. Click the <b>${want === "hot" ? "hottest" : "coolest"}</b> object.`, answer: ["t" + best], names: Object.fromEntries(pool.map(t => ["t" + t, "curve"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((t, i) => { const x = 15 + i * 212, lp = WIEN / t, pk = planck(Math.min(3000, lp), t); let d = ""; for (let l = 80; l <= 3000; l += 20) d += (d ? " L" : "M") + (x + 18 + l / 3000 * 160) + "," + (230 - Math.min(1.05, planck(l, t) / pk) * 160); return `<g class="pk" data-k="t${t}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><rect x="${x + 18 + 380 / 3000 * 160}" y="60" width="${370 / 3000 * 160}" height="170" fill="url(#vis2)" opacity=".25"/><line x1="${x + 18}" y1="230" x2="${x + 178}" y2="230" stroke="#90a4ae"/><path d="${d}" fill="none" stroke="#5e35b1" stroke-width="3"/>${T(x + 98, 262, "curve " + "ABCD"[i], { s: 14, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["t" + t])}/></g>`; }).join("")}<defs><linearGradient id="vis2" x1="0" x2="1"><stop offset="0" stop-color="#78009f"/><stop offset=".5" stop-color="#28c828"/><stop offset="1" stop-color="#dc0000"/></linearGradient></defs></svg>`,
      explain: "The hotter the object, the further left (shorter wavelength) its peak.", summary: "Wien's law" };
  }),
  num: diff => E.diaT("bb-num", diff, 2, () => {
    if (diff === 1) { const t = choice([5800, 3000, 10000, 300]);
      return { kind: "num", title: "🧮 Wien's law", prompt: `An object is at <b>${t} K</b>. λ peak (nm) = 2 898 000 ÷ T.`, visual: render(st({ T: t })), fields: [{ label: "Peak wavelength", unit: "nm", answer: r1(WIEN / t), tol: 1 }], explain: `2 898 000 ÷ ${t} = ${fmt(r1(WIEN / t))} nm.`, summary: "Peak wavelength" }; }
    if (diff === 2) { const l = choice([500, 966, 290, 10000]);
      return { kind: "num", title: "🧮 Temperature from colour", prompt: `A star's spectrum peaks at <b>${l} nm</b>.`, visual: render(st({ T: Math.min(12000, Math.max(300, Math.round(WIEN / l / 100) * 100)) })), fields: [{ label: "Temperature", unit: "K", answer: Math.round(WIEN / l), tol: 10 }], explain: `T = 2 898 000 ÷ ${l} = ${Math.round(WIEN / l)} K.`, summary: "Temperature from Wien" }; }
    const f = choice([2, 3, 0.5, 4]);
    return { kind: "num", title: "🧮 Stefan's law", prompt: `An object's temperature (in K) is multiplied by <b>${f}</b>. By what factor does the power it gives out change?`, visual: render(st({ T: 3000 })), fields: [{ label: "Power factor", unit: "×", answer: Math.pow(f, 4) }], explain: `${f}⁴ = ${Math.pow(f, 4)}.`, summary: "Power ∝ T⁴" };
  }),
  mcq: diff => E.diaT("bb-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does a heated iron bar glow red before it glows white?", ok: "As it gets hotter its peak moves to shorter wavelengths", bad: ["Red light is easier to make", "The iron changes into a new metal", "White light is cooler"], ex: "Wien's law: hotter → shorter peak wavelength." },
      { ask: "Which star is hottest?", ok: "A blue-white star", bad: ["A red star", "An orange star", "A yellow star"], ex: "Blue-white stars peak in the UV." },
      { ask: "Why can thermal cameras see people in the dark?", ok: "Our bodies give out infrared radiation", bad: ["We reflect moonlight", "We glow red", "The camera makes light"], ex: "At about 310 K we peak near 9400 nm (infrared)." },
      { ask: "If a star's temperature doubles, the power from each m² …", ok: "increases 16 times", bad: ["doubles", "increases 4 times", "halves"], ex: "Power ∝ T⁴." }]);
    return { kind: "mcq", title: "📘 Hot-object ideas", prompt: "Think about temperature, colour and power.", visual: render(st({ T: 5800, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Blackbody radiation" }; })
};
const LEVELS = {
  1: { intro: "Every object gives out radiation. Hotter objects glow — first red, then white, then blue-white.", pool: () => [S(1, 1, C.red), S(2, 1, C.noGlow), S(2, 1, C.sun), S(3, 1, C.blue), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Wien's law: the peak wavelength = 2 898 000 ÷ T (nm). Double the temperature, half the wavelength.", pool: () => [S(1, 1, C.half), S(2, 1, C.p1000), S(2, 1, C.p290), S(3, 1, C.edge), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Stefan's law: the power given out grows with T⁴.", pool: () => [S(1, 1, C.x16), S(2, 1, C.sixty4), S(3, 1, C.mw1), S(3, 1, C.both), D.num(3), D.num(1), D.pick(3)] }
};
const explore = E.exploreSim({
  intro: "Slide the temperature and press ▶ to see the colour, the spectrum and the power.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Heat",
  goals: () => [{ txt: "Make it glow red", test: (s, m) => m.r }, { txt: "Match the Sun (peak ≈ 500 nm)", test: (s, m) => m.s }, { txt: "Make a blue-white star", test: (s, m) => m.b }],
  track: (s, m, ran) => { if (!ran) return; if (glow(s.T) === "dull red") m.r = 1; if (Math.abs(peak(s) - 500) <= 10) m.s = 1; if (glow(s.T) === "blue-white") m.b = 1; },
  facts: () => "📘 A star's <b>colour</b> tells astronomers its <b>temperature</b> — that is Wien's law at work."
});
E.start({ labId: "blackbody", total: 7, plan: { sim: 4, dia: 3 }, emoji: "⭐", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⭐", "🔥", "💡", "✨"],
  exploreDemo: () => [{ set: { T: 1500 }, run: true }, { set: { T: 5800 }, run: true }, { set: { T: 9000 }, run: true }] });
})();
