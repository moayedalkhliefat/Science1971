"use strict";
// ===== Bending Light — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const MED = { air: { n: 1, c: "#f5f9ff", name: "Air" }, water: { n: 1.33, c: "#b3e5fc", name: "Water" }, glass: { n: 1.5, c: "#d7ecf2", name: "Glass" }, diamond: { n: 2.42, c: "#ede7f6", name: "Diamond" }, X: { n: 1.6, c: "#fff3e0", name: "Mystery X" } };
const D2R = Math.PI / 180, r1 = x => Math.round(x * 10) / 10;
function refr(s) { const n1 = MED[s.top].n, n2 = MED[s.bot].n, sn = n1 * Math.sin(s.ang * D2R) / n2; return sn > 1 ? null : Math.asin(sn) / D2R; }
const crit = s => { const n1 = MED[s.top].n, n2 = MED[s.bot].n; return n1 > n2 ? Math.asin(n2 / n1) / D2R : null; };
const tir = s => refr(s) === null;
function render(s) {
  const show = s.reveal || s.showVals, cx = 300, cy = 225, R = 200, a = s.ang * D2R, b = refr(s), on = s.reveal || s.showVals || s.on;
  const lx = cx - R * Math.sin(a), ly = cy - R * Math.cos(a);
  let g = `<rect width="600" height="${cy}" fill="${MED[s.top].c}"/><rect y="${cy}" width="600" height="${450 - cy}" fill="${MED[s.bot].c}"/>${T(20, 30, MED[s.top].name + " (n = " + MED[s.top].n + ")", { a: "start", s: 15, c: "#37474f" })}${T(20, 440, MED[s.bot].name + " (n = " + (s.bot === "X" && !show ? "?" : MED[s.bot].n) + ")", { a: "start", s: 15, c: "#37474f" })}
    <line x1="${cx}" x2="${cx}" y1="15" y2="435" stroke="#546e7a" stroke-width="2" stroke-dasharray="8 6"/>${T(cx + 8, 26, "normal", { a: "start", s: 12, c: "#546e7a" })}`;
  if (s.fish) { const fx = cx + 190 * Math.tan(s.fish * D2R), fy = cy + 190; g += `<text x="${fx}" y="${fy + 12}" text-anchor="middle" font-size="34">🐟</text><circle cx="${fx}" cy="${fy}" r="20" fill="none" stroke="#e53935" stroke-width="2" stroke-dasharray="4 3"/>`; }
  g += `<g transform="translate(${lx},${ly}) rotate(${90 - s.ang})"><rect x="-56" y="-12" width="56" height="24" rx="5" fill="#37474f"/><rect x="-6" y="-6" width="8" height="12" fill="#e53935"/></g>`;
  if (on) { const w = tir(s) ? 1 : Math.max(0.25, 1 - Math.pow((MED[s.top].n - MED[s.bot].n) / (MED[s.top].n + MED[s.bot].n), 2) * 4);
    g += `<line x1="${lx}" y1="${ly}" x2="${cx}" y2="${cy}" stroke="#e53935" stroke-width="5"/>`;
    g += `<line x1="${cx}" y1="${cy}" x2="${cx + R * Math.sin(a)}" y2="${cy - R * Math.cos(a)}" stroke="#e53935" stroke-width="${tir(s) ? 5 : 2}" opacity="${tir(s) ? 1 : 0.35}"/>`;
    if (!tir(s)) { const bb = b * D2R; g += `<line x1="${cx}" y1="${cy}" x2="${cx + 260 * Math.sin(bb)}" y2="${cy + 260 * Math.cos(bb)}" stroke="#e53935" stroke-width="${(5 * w).toFixed(1)}"/>`; } }
  g += `<path d="M${cx},${cy - 70} A70,70 0 0 0 ${cx - 70 * Math.sin(a)},${cy - 70 * Math.cos(a)}" fill="none" stroke="#1565c0" stroke-width="2"/>${T(cx - 86 * Math.sin(a / 2) - 4, cy - 86 * Math.cos(a / 2), s.ang + "°", { a: "end", s: 14, c: "#1565c0" })}`;
  if (show && b !== null && on) g += `<path d="M${cx},${cy + 70} A70,70 0 0 0 ${cx + 70 * Math.sin(b * D2R)},${cy + 70 * Math.cos(b * D2R)}" fill="none" stroke="#2e7d32" stroke-width="2"/>${T(cx + 92 * Math.sin(b * D2R / 2) + 6, cy + 92 * Math.cos(b * D2R / 2) + 5, r1(b) + "°", { a: "start", s: 14, c: "#2e7d32" })}`;
  const panel = `<g transform="translate(620,40)"><rect width="225" height="${show ? 220 : 130}" rx="14" fill="#fff" stroke="#bbdefb" stroke-width="2"/>${T(112, 28, "angle of incidence", { s: 12, c: "#1565c0" })}${T(112, 54, s.ang + "°", { s: 22, c: "#1565c0" })}
    ${T(112, 88, "angle of refraction", { s: 12, c: "#2e7d32" })}${T(112, 114, show ? (tir(s) ? "—" : r1(b) + "°") : "?", { s: 22, c: "#2e7d32" })}
    ${show ? (tir(s) ? T(112, 152, "TOTAL INTERNAL", { s: 14, c: "#c62828" }) + T(112, 172, "REFLECTION", { s: 14, c: "#c62828" }) : T(112, 156, "bends " + (MED[s.bot].n > MED[s.top].n ? "TOWARDS" : MED[s.bot].n < MED[s.top].n ? "AWAY FROM" : "—") + " the normal", { s: 12, c: "#37474f" })) + (crit(s) ? T(112, 204, "critical angle " + r1(crit(s)) + "°", { s: 12, c: "#6a1b9a" }) : "") : ""}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#eef3f8"/>${g}${panel}</svg>`;
}
const MO = ks => ks.map(v => ({ v, label: MED[v].name }));
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "ang", type: "range", label: "Angle of incidence", min: 0, max: 85, step: 1, nudge: 1, unit: "°", lock: lk("ang") },
  { id: "top", type: "choice", label: "Top material (laser side)", options: MO(["air", "water", "glass"]), lock: lk("top") },
  { id: "bot", type: "choice", label: "Bottom material", options: MO(lv >= 3 ? ["air", "water", "glass", "diamond", "X"] : ["air", "water", "glass", "diamond"]), wide: true, lock: lk("bot") }]; };
const st = o => Object.assign({ ang: 30, top: "air", bot: "water" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => tir(s) ? `${MED[s.top].name} → ${MED[s.bot].name} at ${s.ang}°: total internal reflection` : `${MED[s.top].name} → ${MED[s.bot].name} at ${s.ang}°: refracted at ${r1(refr(s))}°`;
const at = (s, t, tol) => !tir(s) && Math.abs(refr(s) - t) <= (tol || 0.6);
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "🔦 Light challenge", prompt: "Aim the laser and choose the materials, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Snell's law: n₁ sin θ₁ = n₂ sin θ₂. Into a denser material light bends towards the normal; out of it, away. Beyond the critical angle: total internal reflection." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("lgt-sim", diff, uses, mk);
const C = {
  g30: () => simQ(1, "Air → glass: make the angle of refraction <b>30°</b> (±0.6°).", st({ bot: "glass", ang: 10 }), s => ok(at(s, 30), say(s) + ".", say(s) + "."), { ang: 49 }, { lock: ["top", "bot"], wrong: { ang: 30 } }),
  w32: () => simQ(1, "Air → water: make the beam in the water travel at <b>32°</b> from the normal (±0.6°).", st({ bot: "water", ang: 10 }), s => ok(at(s, 32), say(s) + ".", say(s) + "."), { ang: 45 }, { lock: ["top", "bot"], wrong: { ang: 32 } }),
  straight: () => simQ(1, "Make the beam go into the glass <b>without bending</b>.", st({ bot: "glass", ang: 40 }), s => ok(s.ang === 0, "Along the normal (0°) light does not change direction.", say(s) + "."), { ang: 0 }, { lock: ["top", "bot"], wrong: { ang: 5 } }),
  most: () => simQ(1, "At <b>45°</b> from air, choose the material that bends the beam <b>the most</b>.", st({ ang: 45 }), s => ok(s.bot === "diamond", "Diamond has the highest refractive index (2.42): refraction angle 17°.", say(s) + "."), { bot: "diamond" }, { lock: ["ang", "top"], wrong: { bot: "glass" } }),
  tirG: () => simQ(2, "Glass → air: make <b>total internal reflection</b> happen.", st({ top: "glass", bot: "air", ang: 20 }), s => ok(tir(s), "Above the critical angle (41.8°) all the light reflects.", say(s) + "."), { ang: 45 }, { lock: ["top", "bot"], wrong: { ang: 40 } }),
  critW: () => simQ(2, "Water → air: find the <b>smallest whole angle</b> that gives total internal reflection.", st({ top: "water", bot: "air", ang: 30 }), s => ok(tir(s) && s.ang === 49, "Critical angle for water is 48.8°, so 49°.", tir(s) ? "TIR — but a smaller angle also works." : say(s) + "."), { ang: 49 }, { lock: ["top", "bot"], wrong: { ang: 48 } }),
  out60: () => simQ(2, "Glass → air: make the beam leave the glass at <b>60°</b> (±1°).", st({ top: "glass", bot: "air", ang: 10 }), s => ok(at(s, 60, 1), say(s) + ": bent away from the normal.", say(s) + "."), { ang: 35 }, { lock: ["top", "bot"], wrong: { ang: 40 } }),
  escape: () => simQ(2, "The laser is in <b>water at 60°</b>. Choose a bottom material so the light <b>gets through</b> (no total internal reflection).", st({ top: "water", bot: "air", ang: 60 }), s => ok(!tir(s), say(s) + " — into a denser material there is no TIR.", say(s) + "."), { bot: "glass" }, { lock: ["top", "ang"], wrong: { bot: "air" } }),
  fish: () => simQ(3, "Air → water: aim the laser to hit the <b>fish</b> (it is 30° from the normal in the water).", st({ bot: "water", fish: 30, ang: 10 }), s => ok(at(s, 30, 0.8), "Hit! Incidence 42° refracts to 30°.", say(s) + " — missed."), { ang: 42 }, { lock: ["top", "bot"], wrong: { ang: 30 } }),
  fish2: () => simQ(3, "Air → glass: hit the target at <b>20°</b> from the normal in the glass.", st({ bot: "glass", fish: 20, ang: 5 }), s => ok(at(s, 20, 0.8), "Hit! sin θ₁ = 1.5 × sin 20° → θ₁ = 31°.", say(s) + " — missed."), { ang: 31 }, { lock: ["top", "bot"], wrong: { ang: 20 } }),
  myst: () => simQ(3, "Air → <b>Mystery X</b>: make the angle of refraction <b>25°</b> (±0.6°). Then work out n!", st({ bot: "X", ang: 10 }), s => ok(at(s, 25), `sin ${s.ang}° ÷ sin ${r1(refr(s))}° = 1.6: n(X) = 1.6.`, say(s) + "."), { ang: 43 }, { lock: ["top", "bot"], wrong: { ang: 25 } }),
  fibre: () => simQ(3, "An optical fibre: glass core with <b>water</b> around it. Find the <b>smallest whole angle</b> that keeps the light inside (TIR).", st({ top: "glass", bot: "water", ang: 40 }), s => ok(tir(s) && s.ang === 63, "Critical angle = sin⁻¹(1.33 ÷ 1.5) = 62.5°, so 63°.", tir(s) ? "TIR — but a smaller angle also works." : say(s) + "."), { ang: 63 }, { lock: ["top", "bot"], wrong: { ang: 62 } })
};

// ---------- diagram tasks ----------
const D = {
  nNum: diff => E.diaT("lgt-num", diff, 3, () => { const c = choice([[40, 25.4, 1.5], [60, 40.6, 1.33], [30, 12, 2.42], [50, 28.6, 1.6]]);
    return { kind: "num", title: "🧮 Find the refractive index", prompt: `Light enters a material from air at ${c[0]}° and refracts at ${c[1]}°.`, visual: render(st({ bot: c[2] === 1.5 ? "glass" : c[2] === 1.33 ? "water" : c[2] === 2.42 ? "diamond" : "X", ang: c[0], showVals: false, on: true })),
      fields: [{ label: "Refractive index n", unit: "", answer: c[2], tol: 0.03 }], explain: `n = sin ${c[0]}° ÷ sin ${c[1]}° = ${fmt(Math.sin(c[0] * D2R) / Math.sin(c[1] * D2R))}.`, summary: "Snell's law" }; }),
  critNum: diff => E.diaT("lgt-num", diff, 2, () => { const c = choice([["glass", 1.5, 41.8], ["water", 1.33, 48.8], ["diamond", 2.42, 24.4]]);
    return { kind: "num", title: "📐 Critical angle", prompt: `Light goes from ${c[0]} (n = ${c[1]}) into air.`, visual: render(st({ top: c[0] === "diamond" ? "glass" : c[0], bot: "air", ang: 30, showVals: false, on: true })),
      fields: [{ label: "Critical angle", unit: "°", answer: c[2], tol: 0.3 }], explain: `sin c = 1 ÷ ${c[1]} → c = ${c[2]}°.`, summary: "Critical angle" }; }),
  pick: diff => E.diaT("lgt-pick", diff, 1, () => { const order = E.shuffle(["t", "a", "s"]), q = choice([["t", "light going from <b>air into glass</b>"], ["a", "light going from <b>glass into air</b>"]]);
    const draw = (k, x) => { const cx = x + 120, cy = 140, a = 40 * D2R, b = (k === "t" ? 25 : k === "a" ? 60 : 40) * D2R; return `<rect x="${x}" y="20" width="240" height="120" fill="${k === "a" ? "#9fd3df" : "#f5f9ff"}"/><rect x="${x}" y="140" width="240" height="120" fill="${k === "a" ? "#f5f9ff" : "#9fd3df"}"/><line x1="${cx}" x2="${cx}" y1="24" y2="256" stroke="#546e7a" stroke-dasharray="6 5"/><line x1="${cx - 100 * Math.sin(a)}" y1="${cy - 100 * Math.cos(a)}" x2="${cx}" y2="${cy}" stroke="#e53935" stroke-width="4"/><line x1="${cx}" y1="${cy}" x2="${cx + 110 * Math.sin(b)}" y2="${cy + 110 * Math.cos(b)}" stroke="#e53935" stroke-width="4"/>`; };
    return { kind: "pick", title: "👆 Which way does it bend?", prompt: "Click the diagram that correctly shows " + q[1] + ". (Glass is shaded.)", answer: [q[0]], names: { t: "bends towards the normal", a: "bends away from the normal", s: "does not bend" },
      visual: st2 => `<svg viewBox="0 0 860 290" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="290" fill="#eef3f8"/>${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${14 + i * 285}" y="10" width="262" height="270" rx="14" fill="#fff" ${E.ring(st2[k])}/>${draw(k, 25 + i * 285)}${T(145 + i * 285, 276, "Diagram " + (i + 1), { s: 13 })}</g>`).join("")}</svg>`,
      explain: "Into glass (slower) light bends towards the normal; out of glass into air it bends away. A ray that does not bend at 40° is wrong.", summary: "Direction of refraction" }; }),
  mcq: diff => E.diaT("lgt-mcq", diff, 2, () => { const q = choice([
      { ask: "Why does light bend when it enters water?", ok: "It slows down in water", bad: ["It speeds up in water", "Water absorbs the light", "The light becomes heavier"], ex: "A change of speed at an angle changes the direction: refraction." },
      { ask: "Total internal reflection can only happen when light goes…", ok: "from a denser material into a less dense one, above the critical angle", bad: ["from air into glass", "at 0° to the normal", "through a mirror"], ex: "Only when n₁ > n₂ and the angle is bigger than the critical angle." },
      { ask: "Optical fibres carry light along their length because of…", ok: "total internal reflection", bad: ["refraction into the air", "absorption", "diffraction"], ex: "The light keeps hitting the edge above the critical angle and reflects back inside." }]);
    return { kind: "mcq", title: "📘 Refraction", prompt: "Think about light at a boundary.", visual: render(st({ top: "glass", bot: "air", ang: 50, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Refraction ideas" }; })
};
const LEVELS = {
  1: { intro: "Shine a laser from air into water, glass and diamond. Watch the beam bend towards the normal.", pool: () => [S(1, 1, C.straight), S(2, 1, C.most), S(2, 1, C.w32), S(3, 1, C.g30), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Light leaving glass or water bends away from the normal — and can be totally reflected.", pool: () => [S(1, 1, C.tirG), S(2, 1, C.escape), S(2, 1, C.out60), S(3, 1, C.critW), D.pick(1), D.critNum(2), D.mcq(3)] },
  3: { intro: "Use Snell's law: hit targets, find a mystery refractive index and design an optical fibre.", pool: () => [S(1, 1, C.fish), S(2, 1, C.fish2), S(3, 1, C.myst), S(3, 1, C.fibre), D.critNum(1), D.nNum(2), D.nNum(3)] }
};
const explore = E.exploreSim({
  intro: "Change the angle and the materials. Watch the refracted (and reflected) beam.",
  state: lv => st({ showVals: true, top: lv >= 2 ? "glass" : "air", bot: lv >= 2 ? "air" : "water" }), controls: lv => ctls(lv), render,
  goals: lv => [{ txt: "Make the beam bend towards the normal", test: s => !tir(s) && MED[s.bot].n > MED[s.top].n && s.ang > 0 }, { txt: "Make the beam bend away from the normal", test: s => !tir(s) && MED[s.bot].n < MED[s.top].n && s.ang > 0 }].concat(lv >= 2 ? [{ txt: "Make total internal reflection", test: s => tir(s) }] : [{ txt: "Try diamond", test: s => s.bot === "diamond" }]),
  facts: () => "📘 <b>Refraction</b>: light changes direction when its speed changes. <b>n₁ sin θ₁ = n₂ sin θ₂</b>."
});
E.start({ labId: "light", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔦", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔦", "💎", "🌈", "✨"],
  exploreDemo: lv => [{ set: { top: "air", bot: "glass", ang: 40 } }, { set: { top: "glass", bot: "air", ang: 30 } }, { set: { bot: "diamond", top: "air" } }].concat(lv >= 2 ? [{ set: { top: "glass", bot: "air", ang: 60 } }] : []) });
})();
