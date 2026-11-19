"use strict";
// ===== Waves on a String — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const TEN = { low: 2, medium: 4, high: 8 };
const vel = s => TEN[s.ten];
const lam = s => Math.round(vel(s) / s.f * 1000) / 1000;
const per = s => Math.round(1 / s.f * 1000) / 1000;
function render(s) {
  const show = s.reveal || s.showVals, x0 = 70, L = 4, sc = 165, y0 = 210, ap = s.A * 14, ph = s._ph || 0, k = 2 * Math.PI / lam(s);
  const pts = []; for (let i = 0; i <= 400; i++) { const x = L * i / 400; pts.push(`${(x0 + x * sc).toFixed(1)},${(y0 - ap * Math.sin(k * x - ph)).toFixed(1)}`); }
  let ruler = ""; for (let m = 0; m <= 4; m += 0.5) ruler += `<line x1="${x0 + m * sc}" x2="${x0 + m * sc}" y1="352" y2="${m % 1 ? 360 : 366}" stroke="#37474f" stroke-width="2"/>${m % 1 ? "" : T(x0 + m * sc, 382, m + " m", { s: 12, c: "#37474f" })}`;
  let gridA = ""; for (let c = -5; c <= 5; c++) gridA += `<line x1="${x0 - 12}" x2="${x0 + L * sc}" y1="${y0 - c * 14}" y2="${y0 - c * 14}" stroke="${c === 0 ? "#90a4ae" : "#eef3f8"}" stroke-width="${c === 0 ? 1.5 : 1}" ${c === 0 ? 'stroke-dasharray="6 5"' : ""}/>${c !== 0 ? T(x0 + L * sc + 26, y0 - c * 14 + 4, c, { a: "start", s: 11, c: "#78909c" }) : ""}`;
  let labels = "";
  if (show && s._ph == null) { const l = lam(s), xc = l / 4, xc2 = xc + l; if (xc2 <= L) labels += `<line x1="${x0 + xc * sc}" x2="${x0 + xc2 * sc}" y1="${y0 - ap - 22}" y2="${y0 - ap - 22}" stroke="#c62828" stroke-width="2"/><polygon points="${x0 + xc * sc},${y0 - ap - 22} ${x0 + xc * sc + 9},${y0 - ap - 27} ${x0 + xc * sc + 9},${y0 - ap - 17}" fill="#c62828"/><polygon points="${x0 + xc2 * sc},${y0 - ap - 22} ${x0 + xc2 * sc - 9},${y0 - ap - 27} ${x0 + xc2 * sc - 9},${y0 - ap - 17}" fill="#c62828"/>${T(x0 + (xc + xc2) / 2 * sc, y0 - ap - 30, "λ = " + fmt(l) + " m", { s: 13, c: "#c62828" })}`;
    if (xc <= L) labels += `<line x1="${x0 + xc * sc}" x2="${x0 + xc * sc}" y1="${y0}" y2="${y0 - ap}" stroke="#1565c0" stroke-width="2"/>${T(x0 + xc * sc + 8, y0 - ap / 2 + 4, "A", { a: "start", s: 13, c: "#1565c0" })}${T(x0 + xc * sc, y0 - ap - 6, "crest", { s: 11, c: "#2e7d32" })}`;
    if (3 * l / 4 <= L) labels += T(x0 + 3 * l / 4 * sc, y0 + ap + 18, "trough", { s: 11, c: "#2e7d32" }); }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#e8f1fb"/>${gridA}${T(x0 + L * sc + 30, y0 - 84, "cm", { s: 11, c: "#78909c" })}
    <rect x="${x0 - 50}" y="${y0 - 70}" width="36" height="140" rx="6" fill="#455a64"/>${T(x0 - 32, y0 + 92, "oscillator", { s: 11, c: "#455a64" })}<rect x="${x0 + L * sc}" y="${y0 - 80}" width="16" height="160" fill="#8d6e63"/>
    <polyline points="${pts.join(" ")}" fill="none" stroke="#e65100" stroke-width="4"/>${labels}<line x1="${x0}" x2="${x0 + L * sc}" y1="352" y2="352" stroke="#37474f" stroke-width="2"/>${ruler}
    <g transform="translate(70,396)"><rect width="760" height="46" rx="10" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(90, 29, "f = " + fmt(s.f) + " Hz", { s: 15, c: "#0d47a1" })}${T(240, 29, "A = " + fmt(s.A) + " cm", { s: 15, c: "#0d47a1" })}${T(400, 29, "v = " + vel(s) + " m/s (" + s.ten + " tension)", { s: 15, c: "#0d47a1" })}${T(640, 29, show ? "λ = " + fmt(lam(s)) + " m · T = " + fmt(per(s)) + " s" : "λ = ? · T = ?", { s: 15, c: "#c62828" })}</g></svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "f", type: "range", label: "Frequency", min: 0.5, max: 8, step: 0.5, nudge: 0.5, unit: "Hz", fmt: v => fmt(v), lock: lk("f") },
  { id: "A", type: "range", label: "Amplitude", min: 1, max: 5, step: 0.5, nudge: 0.5, unit: "cm", fmt: v => fmt(v), lock: lk("A") },
  { id: "ten", type: "choice", label: "String tension (sets the speed)", options: [{ v: "low", label: "Low · 2 m/s" }, { v: "medium", label: "Medium · 4 m/s" }, { v: "high", label: "High · 8 m/s" }], hide: () => lv < 2, lock: lk("ten") }]; };
const st = (o) => Object.assign({ f: 1, A: 2, ten: "medium" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; const t0 = performance.now(), dur = 1800;
  const fr = now => { const k = Math.min(1, (now - t0) / dur); s._ph = 2 * Math.PI * s.f * k * 1.5; box.innerHTML = render(s); if (k < 1) requestAnimationFrame(fr); else { s._ph = null; box.innerHTML = render(s); res(); } }; requestAnimationFrame(fr); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const near = (a, b) => Math.abs(a - b) < 1e-6;
const say = s => `v = ${vel(s)} m/s, f = ${fmt(s.f)} Hz → λ = ${fmt(lam(s))} m`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🌊 Wave challenge", prompt: "Set the wave, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Wave speed v = f × λ, so λ = v ÷ f. Period T = 1 ÷ f. Amplitude is the height from the middle line to a crest." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("wav-sim", diff, uses, mk);
const C = {
  amp: () => { const a = choice([3, 4.5, 1.5]); return simQ(1, `Make a wave with amplitude <b>${a} cm</b> and frequency <b>2 Hz</b>.`, st(), s => ok(near(s.A, a) && near(s.f, 2), "Amplitude = height from the middle line to a crest.", `A = ${fmt(s.A)} cm, f = ${fmt(s.f)} Hz.`), { A: a, f: 2 }, { wrong: { A: a * 2 > 5 ? a - 1 : a * 2, f: 2 } }); },
  lam: () => { const l = choice([2, 1, 0.5, 4]); return simQ(1, `Make the wavelength exactly <b>${l} m</b>.`, st(), s => ok(near(lam(s), l), say(s) + ".", say(s) + "."), { f: 4 / l }, { wrong: { f: 4 / l + 0.5 } }); },
  four: () => simQ(1, "Fit exactly <b>4 complete waves</b> on the 4 m string.", st(), s => ok(near(lam(s), 1), "λ = 1 m → 4 waves in 4 m (f = 4 Hz).", `λ = ${fmt(lam(s))} m → ${fmt(4 / lam(s))} waves.`), { f: 4 }, { wrong: { f: 2 } }),
  period: () => { const t = choice([0.5, 0.25, 2]); return simQ(1, `Make each oscillation take <b>${t} s</b> (the period).`, st(), s => ok(near(per(s), t), `f = 1 ÷ ${t} = ${1 / t} Hz.`, `T = ${fmt(per(s))} s.`), { f: 1 / t }, { wrong: { f: t } }); },
  ten: () => { const c = choice([[2, 1, "low"], [4, 2, "high"], [1, 2, "low"], [0.5, 8, "medium"]]); return simQ(2, `With frequency <b>${c[1]} Hz</b>, make the wavelength <b>${c[0]} m</b>.`, st({ f: c[1] }), s => ok(near(lam(s), c[0]), `v = ${c[0]} × ${c[1]} = ${vel(s)} m/s → ${s.ten} tension.`, say(s) + "."), { ten: c[2] }, { lock: ["f"], wrong: { ten: c[2] === "low" ? "high" : "low" } }); },
  keep: () => simQ(2, "Switch to <b>high tension</b> but keep the wavelength at <b>2 m</b>.", st({ f: 2, ten: "medium" }), s => ok(s.ten === "high" && near(lam(s), 2), "Speed doubled (8 m/s), so frequency must double (4 Hz).", s.ten !== "high" ? "Use high tension." : say(s) + "."), { ten: "high", f: 4 }, { wrong: { ten: "high", f: 2 } }),
  same: () => simQ(2, "Make the <b>same wavelength (1 m)</b> with the <b>lowest</b> frequency possible.", st({ f: 4 }), s => ok(near(lam(s), 1) && near(s.f, 2), "Low tension (2 m/s) needs only 2 Hz for λ = 1 m.", near(lam(s), 1) ? "λ = 1 m, but a lower frequency is possible." : say(s) + "."), { ten: "low", f: 2 }, { wrong: { ten: "medium", f: 4 } }),
  longest: () => simQ(2, "With <b>2 Hz</b>, make the <b>longest</b> wavelength you can.", st({ f: 2 }), s => ok(s.ten === "high", "Highest speed → longest wavelength: 8 ÷ 2 = 4 m.", say(s) + "."), { ten: "high" }, { lock: ["f"], wrong: { ten: "medium" } }),
  dist: () => simQ(3, "Make the wave travel <b>16 m in 2 s</b> AND have a wavelength of <b>2 m</b>.", st(), s => ok(vel(s) === 8 && near(lam(s), 2), "v = 16 ÷ 2 = 8 m/s → high tension; f = 8 ÷ 2 = 4 Hz.", `v = ${vel(s)} m/s, λ = ${fmt(lam(s))} m.`), { ten: "high", f: 4 }, { wrong: { ten: "medium", f: 2 } }),
  half: () => simQ(3, "Make <b>half a wave</b> fill the whole 4 m string (a wavelength of 8 m).", st({ ten: "low" }), s => ok(near(lam(s), 8), "λ = 8 m: high tension (8 m/s) at 1 Hz, or medium at 0.5 Hz.", say(s) + "."), { ten: "high", f: 1 }, { wrong: { ten: "high", f: 2 } }),
  combo: () => { const c = choice([[0.25, 0.5], [0.5, 1], [0.125, 0.25]]); return simQ(3, `Make a wave with period <b>${c[0]} s</b> and wavelength <b>${c[1]} m</b>.`, st(), s => ok(near(per(s), c[0]) && near(lam(s), c[1]), `f = ${1 / c[0]} Hz, v = f × λ = ${c[1] / c[0]} m/s.`, `T = ${fmt(per(s))} s, λ = ${fmt(lam(s))} m.`), { f: 1 / c[0], ten: "low" }, { wrong: { f: 1 / c[0], ten: "high" } }); },
  energy: () => simQ(3, "Carry the <b>most energy</b> along the string with a wavelength of exactly <b>1 m</b> and <b>medium</b> tension.", st(), s => ok(near(s.A, 5) && near(lam(s), 1) && s.ten === "medium", "Bigger amplitude → more energy. λ = 1 m at 4 Hz.", !near(s.A, 5) ? "More amplitude carries more energy." : say(s) + "."), { A: 5, f: 4 }, { lock: ["ten"], wrong: { A: 3, f: 4 } })
};

// ---------- diagram tasks ----------
const D = {
  read: diff => E.diaT("wav-num", diff, 2, () => { const s = st(choice([{ f: 2, A: 3 }, { f: 4, A: 2 }, { f: 1, A: 4 }, { f: 2, A: 4.5 }]));
    return { kind: "num", title: "📏 Read the wave", prompt: "Use the grid (cm) and the ruler (m). v = 4 m/s.", visual: render(Object.assign({}, s, { showVals: false })),
      fields: [{ label: "Amplitude", unit: "cm", answer: s.A }, { label: "Wavelength", unit: "m", answer: lam(s) }, { label: "Frequency", unit: "Hz", answer: s.f }], explain: `A = ${s.A} cm. λ = ${fmt(lam(s))} m (one crest to the next). f = v ÷ λ = 4 ÷ ${fmt(lam(s))} = ${s.f} Hz.`, summary: "Read amplitude and wavelength" }; }),
  calc: diff => E.diaT("wav-num", diff, 3, () => { const c = choice([[340, 680], [1500, 3000], [3, 0.5], [12, 4]]);
    return { kind: "num", title: "🧮 Wave equation", prompt: `A wave travels at ${c[0]} m/s with a frequency of ${c[1]} Hz.`, visual: render(st({ f: 2, A: 2, showVals: false })),
      fields: [{ label: "Wavelength", unit: "m", answer: c[0] / c[1], tol: 0.006 }, { label: "Period", unit: "s", answer: 1 / c[1], tol: 0.0006 }], explain: `λ = v ÷ f = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} m. T = 1 ÷ ${c[1]} = ${fmt(1 / c[1], 4)} s.`, summary: "v = f λ" }; }),
  pick: diff => E.diaT("wav-pick", diff, 1, () => { const sets = { a: st({ f: 1, A: 2 }), b: st({ f: 3, A: 2 }), c: st({ f: 1, A: 4.5 }) }, order = E.shuffle(["a", "b", "c"]);
    const q = choice([["b", "the <b>highest frequency</b> (shortest wavelength)"], ["c", "the <b>largest amplitude</b>"]]);
    return { kind: "pick", title: "👆 Compare waves", prompt: "Three waves on the same string. Click the wave with " + q[1] + ".", answer: [q[0]], names: { a: "the small, long wave", b: "the short-wavelength wave", c: "the tall wave" },
      visual: st2 => `<svg viewBox="0 0 860 420" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="420" fill="#e8f1fb"/>${order.map((k, i) => { const s = sets[k], y = 70 + i * 130, kk = 2 * Math.PI / lam(s), pts = []; for (let j = 0; j <= 300; j++) { const x = 4 * j / 300; pts.push(`${80 + x * 180},${y - s.A * 9 * Math.sin(kk * x)}`); }
        return `<g class="pk" data-k="${k}"><rect x="40" y="${y - 58}" width="780" height="116" rx="14" fill="#fff" ${E.ring(st2[k])}/><line x1="80" x2="800" y1="${y}" y2="${y}" stroke="#cfd8dc" stroke-dasharray="5 5"/><polyline points="${pts.join(" ")}" fill="none" stroke="#e65100" stroke-width="3"/>${T(60, y + 5, "W" + (i + 1), { s: 14 })}</g>`; }).join("")}</svg>`,
      explain: "More waves in the same length = shorter wavelength = higher frequency. A taller wave = larger amplitude.", summary: "Frequency vs amplitude" }; }),
  mcq: diff => E.diaT("wav-mcq", diff, 2, () => { const q = choice([
      { ask: "What does a wave transfer from place to place?", ok: "Energy (not the material itself)", bad: ["The string itself", "Water molecules all the way across", "Mass"], ex: "Each part of the string only moves up and down; the energy moves along." },
      { ask: "On a string, the particles move up and down while the wave moves sideways. This is a…", ok: "transverse wave", bad: ["longitudinal wave", "sound wave", "standing still wave"], ex: "Transverse: vibrations at right angles to the direction of travel." },
      { ask: "If the frequency doubles and the speed stays the same, the wavelength…", ok: "halves", bad: ["doubles", "stays the same", "becomes zero"], ex: "λ = v ÷ f." }]);
    return { kind: "mcq", title: "📘 Waves", prompt: "Think about wave properties.", visual: render(st({ f: 2, A: 3, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Wave ideas" }; })
};
const LEVELS = {
  1: { intro: "Make waves on a string (speed 4 m/s). Change the frequency and the amplitude.", pool: () => [S(1, 1, C.amp), S(1, 1, C.lam), S(2, 1, C.four), S(2, 1, C.period), S(3, 1, C.lam), D.pick(1), D.read(2), D.mcq(3)] },
  2: { intro: "Tension changes the wave speed: v = f × λ.", pool: () => [S(1, 1, C.longest), S(2, 1, C.ten), S(2, 1, C.keep), S(3, 1, C.same), D.pick(1), D.read(2), D.calc(3)] },
  3: { intro: "Combine speed, frequency, period and wavelength.", pool: () => [S(1, 1, C.energy), S(2, 1, C.dist), S(3, 1, C.half), S(3, 1, C.combo), D.read(1), D.calc(2), D.mcq(3)] }
};
const explore = E.exploreSim({
  intro: "Change the frequency and amplitude (and the tension in higher levels). Press ▶ to watch the wave move.",
  state: () => st({ showVals: true }), controls: lv => ctls(lv), render, run, runLabel: "▶ Send waves",
  goals: lv => [{ txt: "Make a long wavelength (2 m or more)", test: (s, m) => m.long }, { txt: "Make a short wavelength (0.5 m or less)", test: (s, m) => m.short }, { txt: "Make the biggest amplitude", test: (s, m) => m.big }].concat(lv >= 2 ? [{ txt: "Try high tension", test: (s, m) => m.high }] : []),
  track: (s, m, ran) => { if (!ran) return; if (lam(s) >= 2) m.long = 1; if (lam(s) <= 0.5) m.short = 1; if (s.A === 5) m.big = 1; if (s.ten === "high") m.high = 1; },
  facts: () => "📘 <b>Wavelength λ</b>: crest to crest. <b>Amplitude A</b>: middle to crest. <b>v = f × λ</b>."
});
E.start({ labId: "waves", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🌊", "〰️", "⭐", "✨"],
  exploreDemo: lv => [{ set: { f: 1 }, run: true }, { set: { f: 8 }, run: true }, { set: { A: 5 }, run: true }].concat(lv >= 2 ? [{ set: { ten: "high" }, run: true }] : []) });
})();
