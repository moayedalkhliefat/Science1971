"use strict";
// ===== Heart & Circulation — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const PART = { vc: "Vena cava", ra: "Right atrium", rv: "Right ventricle", pa: "Pulmonary artery", lungs: "Lungs", pv: "Pulmonary vein", la: "Left atrium", lv: "Left ventricle", ao: "Aorta", body: "Body" };
const ORDER = ["vc", "ra", "rv", "pa", "lungs", "pv", "la", "lv", "ao", "body"];
const NEXT = k => ORDER[(ORDER.indexOf(k) + 1) % ORDER.length];
const RICH = k => ["pv", "la", "lv", "ao"].includes(k);
const NEED = { rest: 1000, walk: 2000, run: 3600 }, ACT = { rest: "🧍 Resting", walk: "🚶 Walking", run: "🏃 Running" };
const co = s => Math.round(s.HR * s.SV / 100) / 10, o2 = s => Math.round(co(s) * 200);
const RED = "#d32f2f", BLUE = "#1e5fbf";
// shapes of the circulation diagram (patient's right side is on the LEFT of the picture)
const SH = {
  lungs: `<path d="M282,45 q-82,0 -104,62 q-6,30 30,30 h74Z M358,45 q82,0 104,62 q6,30 -30,30 h-74Z"/>`,
  body: `<rect x="170" y="385" width="300" height="48" rx="18"/>`,
  ra: `<rect x="200" y="180" width="100" height="70" rx="22"/>`, la: `<rect x="340" y="180" width="100" height="70" rx="22"/>`,
  rv: `<path d="M200,256 H300 V352 Q228,336 200,256Z"/>`, lv: `<path d="M440,256 H340 V352 Q412,336 440,256Z"/>`,
  vc: `<path d="M200,405 H150 V215 H200" fill="none" stroke-width="16"/>`, pa: `<path d="M300,300 H320 V158 H245 V137" fill="none" stroke-width="13"/>`,
  pv: `<path d="M400,137 V180" fill="none" stroke-width="13"/>`, ao: `<path d="M440,300 H490 V385" fill="none" stroke-width="16"/>`
};
function heartPic(s, hi) {
  let g = "";
  ORDER.forEach(k => { const col = k === "lungs" ? "#f8bbd0" : k === "body" ? "#ffe0b2" : RICH(k) ? RED : BLUE, line = ["vc", "pa", "pv", "ao"].includes(k);
    g += `<g ${line ? `stroke="${col}" fill="none"` : `fill="${col}" stroke="#5d4037" stroke-width="2"`} opacity="${hi && hi !== k ? 0.55 : 1}">${SH[k]}</g>`; });
  g += T(320, 70, "LUNGS", { s: 13, c: "#880e4f" }) + T(320, 414, "BODY", { s: 13, c: "#e65100" }) + T(250, 221, "RA", { s: 14, c: "#fff" }) + T(390, 221, "LA", { s: 14, c: "#fff" }) + T(262, 296, "RV", { s: 14, c: "#fff" }) + T(378, 296, "LV", { s: 14, c: "#fff" });
  if (hi) g += `<g fill="none" stroke="#ffd600" stroke-width="5" stroke-dasharray="9 6">${SH[hi].replace(/fill="none"|stroke-width="\d+"/g, "")}</g>`;
  return g;
}
function render(s) {
  let g = `<rect width="860" height="450" fill="#fff5f5"/>`;
  if (s.mode === "path") {
    g += `<rect x="20" y="20" width="600" height="420" rx="16" fill="#fff" stroke="#ffcdd2" stroke-width="2"/>` + heartPic(s, s.part);
    const nx = NEXT(s.part);
    g += `<g transform="translate(640,20)"><rect width="200" height="420" rx="16" fill="#fff" stroke="#ffcdd2" stroke-width="2"/>${T(100, 34, "SELECTED", { s: 12, c: "#b71c1c" })}${T(100, 66, PART[s.part], { s: 17, c: "#3e2723" })}
      ${T(100, 100, RICH(s.part) ? "oxygen-RICH blood" : ["lungs", "body"].includes(s.part) ? "" : "oxygen-POOR blood", { s: 13, c: RICH(s.part) ? RED : BLUE })}
      ${s.reveal ? T(100, 160, "blood goes next to", { s: 12, c: "#6d4c41" }) + T(100, 196, "⬇ " + PART[nx], { s: 17, c: "#3e2723" }) : T(100, 180, "press ▶ to follow the blood", { s: 12, c: "#8d6e63" })}
      ${T(100, 270, "🟥 oxygen-rich", { s: 13, c: RED })}${T(100, 296, "🟦 oxygen-poor", { s: 13, c: BLUE })}${T(100, 350, "The picture is drawn", { s: 11, c: "#8d6e63" })}${T(100, 368, "as if you face the person:", { s: 11, c: "#8d6e63" })}${T(100, 386, "their RIGHT side is on your LEFT.", { s: 11, c: "#8d6e63" })}</g>`;
  } else {
    const c = co(s), O = o2(s), need = NEED[s.act], beat = Math.max(0.3, 60 / s.HR);
    g += `<g><rect x="20" y="20" width="330" height="410" rx="16" fill="#fff" stroke="#ffcdd2" stroke-width="2"/>${T(185, 46, "HEART", { s: 13, c: "#b71c1c" })}
      <g transform="translate(185,170)"><path d="M0,60 C-90,0 -70,-80 0,-40 C70,-80 90,0 0,60Z" fill="#e53935" stroke="#b71c1c" stroke-width="3">${s.reveal ? `<animateTransform attributeName="transform" type="scale" values="1;1.12;1" dur="${beat.toFixed(2)}s" repeatCount="indefinite"/>` : ""}</path></g>
      ${T(185, 276, s.HR + " beats/min", { s: 20, c: "#3e2723" })}${T(185, 306, "stroke volume " + s.SV + " mL", { s: 15, c: "#5d4037" })}
      ${T(185, 360, s.reveal ? "Cardiac output = " + fmt(c) + " L/min" : "press ▶ to pump", { s: 16, c: "#b71c1c" })}${T(185, 388, s.reveal ? `${s.HR} × ${s.SV} mL = ${fmt(c * 1000)} mL/min` : "", { s: 12, c: "#6d4c41" })}</g>`;
    g += `<g><rect x="370" y="20" width="470" height="410" rx="16" fill="#fff" stroke="#ffcdd2" stroke-width="2"/>${T(605, 46, "MUSCLES", { s: 13, c: "#b71c1c" })}${T(605, 120, ACT[s.act], { s: 40, c: "#3e2723" })}
      ${T(605, 170, "need " + need + " mL oxygen / min", { s: 15, c: "#5d4037" })}
      ${s.show !== false ? `<rect x="410" y="210" width="390" height="34" rx="10" fill="#ffebee"/><rect x="410" y="210" width="${s.reveal ? Math.min(390, 390 * O / 4000) : 0}" height="34" rx="10" fill="${O >= need ? "#43a047" : "#e53935"}"/><line x1="${410 + 390 * need / 4000}" y1="200" x2="${410 + 390 * need / 4000}" y2="254" stroke="#3e2723" stroke-width="3"/>${T(410 + 390 * need / 4000, 272, "needed", { s: 12, c: "#3e2723" })}` : ""}
      ${T(605, 320, s.reveal ? "oxygen delivered: " + O + " mL/min" : "", { s: 18, c: O >= need ? "#2e7d32" : "#c62828" })}${T(605, 350, s.reveal ? "(each litre of blood carries 200 mL oxygen)" : "", { s: 12, c: "#6d4c41" })}
      ${T(605, 392, s.reveal ? (O >= need ? "✔ enough oxygen" : "✘ muscles are short of oxygen") : "", { s: 16, c: O >= need ? "#2e7d32" : "#c62828" })}</g>`;
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  { id: "part", type: "select", label: "Part of the circulation", options: ORDER.map(v => ({ v, label: PART[v] })), hide: s => s.mode !== "path", lock: lk("part") },
  { id: "act", type: "choice", label: "Activity", options: Object.keys(ACT).map(v => ({ v, label: ACT[v] })), hide: s => s.mode !== "pump" || lv < 3, lock: lk("act") },
  { id: "HR", type: "range", label: "Heart rate", min: 40, max: 200, step: 5, nudge: 5, unit: "beats/min", hide: s => s.mode !== "pump", lock: lk("HR") },
  { id: "SV", type: "range", label: "Stroke volume", min: 50, max: 120, step: 5, nudge: 5, unit: "mL", hide: s => s.mode !== "pump", lock: lk("SV") }]; };
const st = o => Object.assign({ mode: "path", part: "ra", HR: 70, SV: 70, act: "rest" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "path" ? "❤️ Follow the blood" : "💓 Pump challenge", prompt: s0.mode === "path" ? "Choose the part, then press <b>▶ Run & check</b>." : "Set the heart, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: s0.mode === "path" ? "Body → vena cava → right atrium → right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium → left ventricle → aorta → body." : "Cardiac output (L/min) = heart rate × stroke volume (mL) ÷ 1000. Oxygen delivered = cardiac output × 200 mL." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ht-sim", diff, uses, mk);
const pathQ = (goal, want, why, start, wrong) => simQ(1, goal, st({ part: start }), s => ok(s.part === want, PART[want] + ": " + why, `${PART[s.part]} — blood there goes to the ${PART[NEXT(s.part)].toLowerCase()}.`), { part: want }, { wrong: { part: wrong } });
const C = {
  toLungs: () => pathQ("Choose the <b>chamber</b> that pumps blood <b>to the lungs</b>.", "rv", "it pumps oxygen-poor blood into the pulmonary artery.", "ra", "lv"),
  toBody: () => pathQ("Choose the chamber that pumps <b>oxygen-rich</b> blood to the <b>whole body</b>.", "lv", "the strongest chamber, pushing blood into the aorta.", "ra", "rv"),
  fromLungs: () => pathQ("Choose the <b>vessel</b> that brings oxygen-rich blood <b>from the lungs</b> to the heart.", "pv", "it carries oxygen-rich blood to the left atrium.", "vc", "pa"),
  fromBody: () => pathQ("Choose the vessel that brings oxygen-poor blood <b>back from the body</b>.", "vc", "it empties into the right atrium.", "ao", "ao"),
  rest5: () => simQ(2, "At rest the heart beats <b>70 times/min</b>. Set the stroke volume to pump about <b>5 L/min</b> (4.8–5.2).", st({ mode: "pump", HR: 70, SV: 100 }), s => ok(co(s) >= 4.8 && co(s) <= 5.2, `70 × ${s.SV} mL = ${fmt(co(s))} L/min.`, `${fmt(co(s))} L/min.`), { SV: 70 }, { lock: ["HR"], wrong: { SV: 80 } }),
  run15: () => simQ(2, "A runner's stroke volume is <b>100 mL</b>. Set the heart rate for <b>15 L/min</b>.", st({ mode: "pump", HR: 70, SV: 100 }), s => ok(co(s) === 15, "150 × 100 mL = 15 L/min.", `${s.HR} × 100 = ${fmt(co(s))} L/min.`), { HR: 150 }, { lock: ["SV"], wrong: { HR: 140 } }),
  athlete: () => simQ(2, "A trained athlete (stroke volume <b>100 mL</b>) needs <b>5 L/min</b> at rest. What is the resting heart rate?", st({ mode: "pump", HR: 80, SV: 100 }), s => ok(co(s) === 5, "50 × 100 mL = 5 L/min — trained hearts beat slower.", `${s.HR} × 100 = ${fmt(co(s))} L/min.`), { HR: 50 }, { lock: ["SV"], wrong: { HR: 70 } }),
  double: () => simQ(2, "The heart pumps 60 × 80 mL = 4.8 L/min. <b>Double</b> the cardiac output by changing only the heart rate.", st({ mode: "pump", HR: 60, SV: 80 }), s => ok(co(s) === 9.6, "120 × 80 mL = 9.6 L/min — double.", `${fmt(co(s))} L/min.`), { HR: 120 }, { lock: ["SV"], wrong: { HR: 100 } }),
  walk: () => simQ(3, "Walking at <b>100 beats/min</b>. Set the stroke volume so the muscles get <b>exactly</b> the oxygen they need.", st({ mode: "pump", act: "walk", HR: 100, SV: 60 }), s => ok(o2(s) === NEED.walk, "100 × 100 mL = 10 L/min → 2000 mL oxygen.", `${o2(s)} mL/min of oxygen.`), { SV: 100 }, { lock: ["HR", "act"], wrong: { SV: 90 } }),
  runO2: () => simQ(3, "Running needs <b>3600 mL</b> oxygen/min. Supply it with a heart rate of <b>no more than 150</b>.", st({ mode: "pump", act: "run", HR: 100, SV: 70 }), s => ok(o2(s) >= NEED.run && s.HR <= 150, `${s.HR} × ${s.SV} mL → ${o2(s)} mL oxygen.`, s.HR > 150 ? "Heart rate too high — increase the stroke volume." : `Only ${o2(s)} mL oxygen.`), { HR: 150, SV: 120 }, { lock: ["act"], wrong: { HR: 150, SV: 100 } }),
  restLow: () => simQ(3, "At rest, stroke volume is <b>100 mL</b>. Use the <b>lowest</b> heart rate that still supplies enough oxygen.", st({ mode: "pump", act: "rest", HR: 80, SV: 100 }), s => ok(o2(s) >= NEED.rest && s.HR === 50, "50 × 100 mL = 5 L/min → 1000 mL oxygen.", o2(s) < NEED.rest ? "Not enough oxygen." : "You can go lower."), { HR: 50 }, { lock: ["act", "SV"], wrong: { HR: 45 } }),
  which: () => simQ(3, "This heart pumps <b>120 × 100 mL</b>. Choose the <b>hardest</b> activity it can fully supply.", st({ mode: "pump", act: "rest", HR: 120, SV: 100 }), s => ok(s.act === "walk", "12 L/min → 2400 mL: enough for walking (2000), not running (3600).", s.act === "run" ? "Running needs 3600 mL — too much." : "It can do something harder."), { act: "walk" }, { lock: ["HR", "SV"], wrong: { act: "run" } })
};
const D = {
  pick: diff => E.diaT("ht-pick", diff, 2, () => { const want = choice([["lv"], ["ra", "rv"], ["pa", "vc"], ["ao", "pv"]]);
    const q = { lv: "Click the chamber with the <b>thickest wall</b> that pumps blood to the body.", ra: "Click BOTH chambers on the <b>right side</b> of the heart.", pa: "Click BOTH vessels that carry <b>oxygen-poor</b> blood.", ao: "Click BOTH vessels that carry <b>oxygen-rich</b> blood." }[want[0]];
    return { kind: "pick", many: want.length > 1, title: "👆 Heart diagram", prompt: q, answer: want, names: PART,
      visual: s2 => `<svg viewBox="120 30 400 420" xmlns="http://www.w3.org/2000/svg"><rect x="120" y="30" width="400" height="420" fill="#fff5f5"/>${ORDER.filter(k => k !== "lungs" && k !== "body").map(k => `<g class="pk" data-k="${k}" ${["vc", "pa", "pv", "ao"].includes(k) ? `stroke="#9e9e9e" fill="none"` : `fill="#bdbdbd" stroke="#616161" stroke-width="2"`}>${SH[k]}<g fill="none" ${E.ring(s2[k])}>${SH[k].replace(/fill="none"|stroke-width="\d+"/g, "")}</g></g>`).join("")}${T(320, 70, "LUNGS", { s: 13, c: "#880e4f" })}${T(320, 414, "BODY", { s: 13, c: "#e65100" })}</svg>`,
      explain: "Right side (RA, RV) = oxygen-poor blood to the lungs. Left side (LA, LV) = oxygen-rich blood to the body; the left ventricle has the thickest wall.", summary: "Parts of the heart" }; }),
  num: diff => E.diaT("ht-num", diff, 2, () => { const c = choice([[72, 70], [150, 110], [60, 80], [90, 90]]);
    return { kind: "num", title: "🧮 Cardiac output", prompt: `Heart rate <b>${c[0]}</b> beats/min, stroke volume <b>${c[1]} mL</b>.`, visual: render(st({ mode: "pump", HR: c[0], SV: c[1] })),
      fields: [{ label: "Cardiac output", unit: "L/min", answer: c[0] * c[1] / 1000, tol: 0.03 }, { label: "Oxygen delivered (200 mL per L)", unit: "mL/min", answer: c[0] * c[1] / 1000 * 200, tol: 0.03 }], explain: `${c[0]} × ${c[1]} = ${c[0] * c[1]} mL = ${fmt(c[0] * c[1] / 1000)} L/min; × 200 = ${fmt(c[0] * c[1] / 5)} mL oxygen.`, summary: "Cardiac output calculation" }; }),
  mcq: diff => E.diaT("ht-mcq", diff, 2, () => { const q = choice([
      { ask: "Why is it called a DOUBLE circulation?", ok: "Blood passes through the heart twice in one full trip", bad: ["There are two hearts", "Blood flows in both directions", "Each vessel has two layers"], ex: "Heart → lungs → heart → body → heart." },
      { ask: "Why does the heart rate go up during exercise?", ok: "Muscles need more oxygen and glucose", bad: ["The lungs need less blood", "Blood gets thicker", "To cool the heart down"], ex: "A faster heart delivers more oxygen-rich blood to working muscles." },
      { ask: "Which vessel carries oxygen-RICH blood even though it is called a vein?", ok: "Pulmonary vein", bad: ["Vena cava", "Pulmonary artery", "Aorta"], ex: "The pulmonary vein brings oxygen-rich blood from the lungs." }]);
    return { kind: "mcq", title: "📘 Circulation ideas", prompt: "Look at the circulation diagram.", visual: render(st({ part: "lv" })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Circulation concepts" }; })
};
const LEVELS = {
  1: { intro: "Follow the blood around the double circulation: body → heart → lungs → heart → body.", pool: () => [S(1, 1, C.toLungs), S(2, 1, C.fromBody), S(2, 1, C.fromLungs), S(3, 1, C.toBody), D.pick(1), D.mcq(2), D.pick(3)] },
  2: { intro: "Cardiac output = heart rate × stroke volume. Make the heart pump the right amount.", pool: () => [S(1, 1, C.run15), S(2, 1, C.rest5), S(2, 1, C.athlete), S(3, 1, C.double), D.pick(1), D.num(2), D.mcq(3)] },
  3: { intro: "Working muscles need oxygen. Make the heart deliver enough for resting, walking and running.", pool: () => [S(1, 1, C.walk), S(2, 1, C.restLow), S(3, 1, C.runO2), S(3, 1, C.which), D.num(1), D.pick(2), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Choose a part of the circulation and press ▶ to see where the blood goes next.",
  state: () => st(), controls: lv => ctls(lv), render, run, runLabel: "▶ Follow",
  goals: () => [{ txt: "Follow blood into the lungs", test: (s, m) => m.l }, { txt: "Follow blood into the body", test: (s, m) => m.b }, { txt: "Look at 4 different parts", test: (s, m) => (m.seen || []).length >= 4 }],
  track: (s, m, ran) => { if (!ran) return; m.seen = Array.from(new Set((m.seen || []).concat(s.part))); if (NEXT(s.part) === "lungs") m.l = 1; if (NEXT(s.part) === "body") m.b = 1; },
  facts: () => "📘 The <b>right</b> side of the heart pumps oxygen-poor blood to the lungs; the <b>left</b> side pumps oxygen-rich blood to the body."
});
E.start({ labId: "heart", total: 7, plan: { sim: 4, dia: 3 }, emoji: "❤️", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["❤️", "🫁", "🩸", "✨"],
  exploreDemo: () => [{ set: { part: "pa" }, run: true }, { set: { part: "ao" }, run: true }, { set: { part: "rv" }, run: true }, { set: { part: "vc" }, run: true }] });
})();
