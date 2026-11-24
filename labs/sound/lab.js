"use strict";
// ===== Sound & Hearing — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const MED = { air: { n: "Air", v: 340 }, water: { n: "Water", v: 1500 }, steel: { n: "Steel", v: 5000 } };
const r3 = x => Math.round(x * 1000) / 1000;
const lam = s => r3(MED[s.med].v / s.f);
const echo = s => r3(2 * s.d / MED[s.med].v);
function scope(s, x0, y0, w, h, show) {
  const cyc = s.f * 0.01, A = s.A * (h / 2 - 8) / 10; let d = "";
  for (let i = 0; i <= 400; i++) { const x = x0 + w * i / 400, y = y0 + h / 2 - A * Math.sin(2 * Math.PI * cyc * i / 400); d += (i ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1); }
  let grid = ""; for (let i = 1; i < 10; i++) grid += `<line x1="${x0 + w * i / 10}" y1="${y0}" x2="${x0 + w * i / 10}" y2="${y0 + h}" stroke="#1b5e20" stroke-width=".6"/>`;
  for (let j = 1; j < 6; j++) grid += `<line x1="${x0}" y1="${y0 + h * j / 6}" x2="${x0 + w}" y2="${y0 + h * j / 6}" stroke="#1b5e20" stroke-width=".6"/>`;
  return `<rect x="${x0 - 10}" y="${y0 - 10}" width="${w + 20}" height="${h + 20}" rx="12" fill="#263238"/><rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#0b1f0f"/>${grid}${show ? `<path d="${d}" fill="none" stroke="#69f0ae" stroke-width="2.5"/>` : `<line x1="${x0}" y1="${y0 + h / 2}" x2="${x0 + w}" y2="${y0 + h / 2}" stroke="#69f0ae" stroke-width="2"/>`}`;
}
function render(s) {
  const show = s.reveal, L = lam(s);
  let g = `<rect width="860" height="450" fill="#f5f0fb"/>`;
  if (s.mode === "echo") {
    const W = 600, px = W / 400, wx = 90 + s.d * px;
    g += `<rect x="20" y="20" width="820" height="250" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(430, 46, "ECHO — " + MED[s.med].n.toUpperCase() + " (" + MED[s.med].v + " m/s)", { s: 13, c: "#4a148c" })}
      <rect x="40" y="110" width="40" height="70" rx="8" fill="#5e35b1"/><path d="M80,125 l20,-14 v68 l-20,-14Z" fill="#7e57c2"/>${T(60, 200, "you", { s: 12, c: "#4a148c" })}
      <rect x="${Math.min(800, wx)}" y="70" width="22" height="160" fill="#8d6e63"/>${T(Math.min(811, wx + 11), 250, s.d + " m", { s: 12, c: "#4e342e" })}
      ${show ? `<path d="M100,140 H${Math.min(800, wx) - 4}" stroke="#7e57c2" stroke-width="3" stroke-dasharray="10 8"/><path d="M${Math.min(800, wx) - 4},160 H100" stroke="#ec407a" stroke-width="3" stroke-dasharray="10 8"/><path d="M100,160 l12,-6 v12Z" fill="#ec407a"/>${T(Math.max(170, (100 + Math.min(800, wx)) / 2), 128, "sound goes out", { s: 12, c: "#5e35b1" })}${T(Math.max(170, (100 + Math.min(800, wx)) / 2), 180, "echo comes back", { s: 12, c: "#ad1457" })}` : ""}
      <line x1="90" y1="225" x2="690" y2="225" stroke="#b39ddb"/>${[0, 100, 200, 300, 400].map(v => `<line x1="${90 + v * px}" y1="220" x2="${90 + v * px}" y2="230" stroke="#7e57c2"/>${T(90 + v * px, 244, v + " m", { s: 10, c: "#7e57c2" })}`).join("")}`;
    g += `<g transform="translate(20,285)"><rect width="820" height="145" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(410, 30, "ECHO TIME = 2 × distance ÷ speed", { s: 14, c: "#4a148c" })}
      ${T(410, 80, show ? `2 × ${s.d} ÷ ${MED[s.med].v} = ${fmt(echo(s))} s` : "press ▶ to clap", { s: 26, c: "#311b92" })}${T(410, 120, show ? (echo(s) >= 0.1 ? "✔ heard as a separate echo (0.1 s or more)" : "too quick — it blends with the clap (under 0.1 s)") : "", { s: 14, c: echo(s) >= 0.1 ? "#2e7d32" : "#c62828" })}</g>`;
  } else {
    // speaker + waves
    const sp = Math.max(14, Math.min(120, L * 60));
    g += `<rect x="20" y="20" width="390" height="250" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>${T(215, 44, "SPEAKER in " + MED[s.med].n.toLowerCase(), { s: 13, c: "#4a148c" })}
      <rect x="40" y="100" width="50" height="90" rx="10" fill="#37474f"/><circle cx="65" cy="145" r="${16 + s.A * 1.2}" fill="#546e7a" stroke="#90a4ae" stroke-width="3"/>
      ${show ? Array.from({ length: 12 }, (_, i) => 100 + i * sp).filter(x => x < 395).map(x => `<path d="M${x},${145 - 60} q30,60 0,120" fill="none" stroke="#7e57c2" stroke-width="${1 + s.A * 0.4}" opacity="${Math.max(0.15, 1 - (x - 100) / 320)}"/>`).join("") : ""}
      ${T(215, 252, show ? "wavelength λ = " + fmt(L) + " m" : "", { s: 13, c: "#4a148c" })}`;
    g += `<g>${T(625, 44, "OSCILLOSCOPE (10 ms across)", { s: 13, c: "#4a148c" })}${scope(s, 440, 60, 370, 200, show)}</g>`;
    g += `<g transform="translate(20,285)"><rect width="820" height="145" rx="16" fill="#fff" stroke="#d1c4e9" stroke-width="2"/>
      ${[["frequency (pitch)", s.f + " Hz"], ["amplitude (loudness)", s.A + " / 10"], ["waves on screen", show ? fmt(r3(s.f * 0.01)) : "?"], ["speed in " + MED[s.med].n.toLowerCase(), MED[s.med].v + " m/s"]].map(([a, b], i) => `${T(105 + i * 205, 40, a, { s: 12, c: "#7e57c2" })}${T(105 + i * 205, 80, b, { s: 22, c: "#311b92" })}`).join("")}
      ${T(410, 124, show ? (s.f >= 700 ? "high pitch" : s.f <= 250 ? "low pitch" : "medium pitch") + " · " + (s.A >= 7 ? "loud" : s.A <= 3 ? "quiet" : "medium volume") : "press ▶ to play the sound", { s: 15, c: "#4a148c" })}</g>`;
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "f", type: "range", label: "Frequency", min: 100, max: 1000, step: 50, nudge: 50, unit: "Hz", hide: s => s.mode === "echo", lock: lk("f") },
  { id: "A", type: "range", label: "Amplitude", min: 1, max: 10, step: 1, nudge: 1, unit: "", hide: s => s.mode === "echo", lock: lk("A") },
  { id: "med", type: "choice", label: "Material", options: Object.keys(MED).map(v => ({ v, label: MED[v].n })), hide: () => lv < 2, lock: lk("med") },
  { id: "d", type: "range", label: "Distance to the wall", min: 5, max: 400, step: 5, nudge: 5, unit: "m", hide: s => s.mode !== "echo", lock: lk("d") }]; };
const st = o => Object.assign({ mode: "wave", f: 300, A: 5, med: "air", d: 100 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => `${s.f} Hz, amplitude ${s.A}`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "echo" ? "📣 Echo challenge" : "🔊 Sound challenge", prompt: "Set the sound, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: s0.mode === "echo" ? "Echo time = 2 × distance ÷ speed of sound (air 340, water 1500, steel 5000 m/s)." : "Higher frequency = higher pitch (more waves on the screen). Bigger amplitude = louder (taller waves). Wavelength = speed ÷ frequency." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("sd-sim", diff, uses, mk);
const C = {
  highQuiet: () => simQ(1, "Make a <b>high-pitched, quiet</b> sound (800 Hz or more, amplitude 3 or less).", st(), s => ok(s.f >= 800 && s.A <= 3, say(s) + ": many small waves.", say(s) + "."), { f: 900, A: 2 }, { wrong: { f: 900, A: 6 } }),
  lowLoud: () => simQ(1, "Make a <b>low-pitched, loud</b> sound (200 Hz or less, amplitude 8 or more).", st(), s => ok(s.f <= 200 && s.A >= 8, say(s) + ": few, tall waves.", say(s) + "."), { f: 150, A: 9 }, { wrong: { f: 400, A: 9 } }),
  four: () => simQ(1, "Make exactly <b>4 waves</b> fit across the oscilloscope screen (10 ms).", st({ f: 150 }), s => ok(s.f === 400, "400 Hz × 0.01 s = 4 waves.", `${s.f} Hz shows ${fmt(s.f * 0.01)} waves.`), { f: 400 }, { lock: ["A"], wrong: { f: 300 } }),
  octave: () => simQ(1, "A note is 250 Hz. Play the note with <b>double the pitch</b>, just as loud.", st({ f: 250 }), s => ok(s.f === 500 && s.A === 5, "500 Hz — one octave higher.", s.A !== 5 ? "Keep the same loudness (amplitude 5)." : `${s.f} Hz.`), { f: 500 }, { wrong: { f: 450 } }),
  l17: () => simQ(2, "In <b>air</b>, make a wavelength of <b>1.7 m</b>.", st({ f: 500 }), s => ok(s.med === "air" && lam(s) === 1.7, "340 ÷ 200 = 1.7 m.", `λ = ${MED[s.med].v} ÷ ${s.f} = ${fmt(lam(s))} m.`), { med: "air", f: 200 }, { lock: ["A"], wrong: { med: "air", f: 250 } }),
  water3: () => simQ(2, "In <b>water</b>, make a wavelength of <b>3 m</b>.", st({ med: "water", f: 300 }), s => ok(s.med === "water" && lam(s) === 3, "1500 ÷ 500 = 3 m.", `λ = ${fmt(lam(s))} m.`), { f: 500 }, { lock: ["A", "med"], wrong: { f: 600 } }),
  fastest: () => simQ(2, "Keep 500 Hz. Choose the material where sound travels <b>fastest</b>.", st({ f: 500 }), s => ok(s.med === "steel", "Steel: 5000 m/s — particles are packed tightly.", `${MED[s.med].n}: ${MED[s.med].v} m/s.`), { med: "steel" }, { lock: ["A", "f"], wrong: { med: "water" } }),
  short: () => simQ(2, "Make the <b>shortest</b> possible wavelength.", st({ med: "steel", f: 300 }), s => ok(s.med === "air" && s.f === 1000, "Air (slowest) with the highest frequency: 340 ÷ 1000 = 0.34 m.", `λ = ${fmt(lam(s))} m — it can be shorter.`), { med: "air", f: 1000 }, { lock: ["A"], wrong: { med: "water", f: 1000 } }),
  oneSec: () => simQ(3, "Clap in <b>air</b> and hear the echo after exactly <b>1 second</b>.", st({ mode: "echo", d: 50 }), s => ok(echo(s) === 1 && s.med === "air", "2 × 170 ÷ 340 = 1 s.", `Echo after ${fmt(echo(s))} s.`), { d: 170 }, { lock: ["med"], wrong: { d: 340 } }),
  sonar: () => simQ(3, "A ship's sonar echo returns after <b>0.4 s</b> in <b>water</b>. Set the depth of the sea bed.", st({ mode: "echo", med: "water", d: 100 }), s => ok(echo(s) === 0.4, "2 × 300 ÷ 1500 = 0.4 s → 300 m deep.", `Echo after ${fmt(echo(s))} s.`), { d: 300 }, { lock: ["med"], wrong: { d: 150 } }),
  steel: () => simQ(3, "The end of a <b>250 m</b> steel rail is hit. Choose the material so the echo comes back in <b>0.1 s</b>.", st({ mode: "echo", d: 250 }), s => ok(echo(s) === 0.1, "Steel: 2 × 250 ÷ 5000 = 0.1 s.", `${MED[s.med].n}: ${fmt(echo(s))} s.`), { med: "steel" }, { lock: ["d"], wrong: { med: "water" } }),
  separate: () => simQ(3, "In air, find the <b>shortest distance</b> (in 5 m steps) where the echo is heard separately (0.1 s or more).", st({ mode: "echo", d: 100 }), s => ok(s.d === 20 && s.med === "air", "20 m: 2 × 20 ÷ 340 ≈ 0.12 s (15 m is only 0.09 s).", echo(s) < 0.1 ? "Too close — the echo blends with the clap." : "You can stand closer."), { d: 20 }, { lock: ["med"], wrong: { d: 15 } })
};
const D = {
  pick: diff => E.diaT("sd-pick", diff, 2, () => { const traces = { a: st({ f: 200, A: 8 }), b: st({ f: 800, A: 3 }), c: st({ f: 400, A: 5 }), d: st({ f: 800, A: 8 }) }, want = choice(["hi", "loud", "lowquiet"]);
    const ans = { hi: ["b", "d"], loud: ["a", "d"], lowquiet: ["a"] }, q = { hi: "Click ALL the traces with the <b>highest pitch</b>.", loud: "Click ALL the <b>loudest</b> traces.", lowquiet: "Click the trace that is <b>low-pitched but loud</b>." };
    return { kind: "pick", many: want !== "lowquiet", title: "👆 Read the oscilloscope", prompt: q[want], answer: ans[want], names: { a: "trace A", b: "trace B", c: "trace C", d: "trace D" },
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f5f0fb"/>${["a", "b", "c", "d"].map((k, i) => { const x = 30 + (i % 2) * 420, y = 20 + Math.floor(i / 2) * 140; return `<g class="pk" data-k="${k}">${scope(traces[k], x + 10, y + 10, 370, 100, true)}<rect x="${x - 6}" y="${y - 6}" width="402" height="132" rx="12" fill="none" ${E.ring(s2[k])}/>${T(x + 20, y + 26, k.toUpperCase(), { a: "start", s: 14, c: "#b9f6ca" })}</g>`; }).join("")}</svg>`,
      explain: "More waves across the screen = higher frequency (pitch). Taller waves = bigger amplitude (louder).", summary: "Read oscilloscope traces" }; }),
  num: diff => E.diaT("sd-num", diff, 2, () => { const c = choice([[340, 170], [1500, 750], [340, 680], [5000, 1000]]);
    return { kind: "num", title: "🧮 Wave equation", prompt: `Sound travels at <b>${c[0]} m/s</b> and has a frequency of <b>${c[1]} Hz</b>.`, visual: render(st({ f: Math.min(1000, c[1]), reveal: true })),
      fields: [{ label: "Wavelength", unit: "m", answer: c[0] / c[1], tol: 0.03 }, { label: "Time for one wave (period)", unit: "ms", answer: 1000 / c[1], tol: 0.03 }], explain: `λ = v ÷ f = ${c[0]} ÷ ${c[1]} = ${fmt(c[0] / c[1])} m; period = 1 ÷ ${c[1]} = ${fmt(1000 / c[1])} ms.`, summary: "Wave equation" }; }),
  mcq: diff => E.diaT("sd-mcq", diff, 2, () => { const q = choice([
      { ask: "Why can't sound travel through space?", ok: "There are no particles to vibrate", bad: ["It is too cold", "Space is too big", "Light blocks it"], ex: "Sound is a vibration passed from particle to particle." },
      { ask: "What happens to the pitch when the frequency increases?", ok: "The pitch gets higher", bad: ["The sound gets louder", "The pitch gets lower", "Nothing changes"], ex: "Frequency decides pitch; amplitude decides loudness." },
      { ask: "Humans can hear from about…", ok: "20 Hz to 20 000 Hz", bad: ["0 Hz to 100 Hz", "1000 Hz to 2000 Hz", "20 000 Hz to 100 000 Hz"], ex: "Sounds above 20 000 Hz are ultrasound." }]);
    return { kind: "mcq", title: "📘 Sound ideas", prompt: "Think about sound waves.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Sound concepts" }; })
};
const LEVELS = {
  1: { intro: "Change the frequency (pitch) and amplitude (loudness) and watch the oscilloscope.", pool: () => [S(1, 1, C.lowLoud), S(2, 1, C.highQuiet), S(2, 1, C.octave), S(3, 1, C.four), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Sound travels at different speeds in air, water and steel. Wavelength = speed ÷ frequency.", pool: () => [S(1, 1, C.fastest), S(2, 1, C.l17), S(2, 1, C.water3), S(3, 1, C.short), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Echoes: sound bounces back. Use echo times to measure distances.", pool: () => [S(1, 1, C.oneSec), S(2, 1, C.steel), S(3, 1, C.sonar), S(3, 1, C.separate), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Change the pitch and loudness, then press ▶ to see the sound on the oscilloscope.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Play",
  goals: () => [{ txt: "Play a high note", test: (s, m) => m.h }, { txt: "Play a low note", test: (s, m) => m.l }, { txt: "Play a very loud sound", test: (s, m) => m.loud }],
  track: (s, m, ran) => { if (!ran) return; if (s.f >= 700) m.h = 1; if (s.f <= 250) m.l = 1; if (s.A >= 8) m.loud = 1; },
  facts: () => "📘 Sound is a <b>vibration</b> carried by particles. <b>Frequency</b> (Hz) sets the pitch; <b>amplitude</b> sets the loudness."
});
E.start({ labId: "sound", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🎵", "🔊", "🎶", "✨"],
  exploreDemo: () => [{ set: { f: 900 }, run: true }, { set: { f: 150, A: 9 }, run: true }] });
})();
