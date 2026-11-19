"use strict";
// ===== Neuron — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const REST = -70, THR = -55, PEAK = 40;
const SPEED = { "0thin": 1, "0thick": 5, "1thin": 50, "1thick": 100 };
const speed = s => SPEED[(s.myelin ? 1 : 0) + s.dia];
const tms = s => Math.round(s.len / speed(s) * 1000 * 100) / 100;
const fires = s => s.stim >= 15 && !s.naBlock;
const n2mv = s => REST + (fires(s) ? 6 * s.imp : 0);
const n2fires = s => n2mv(s) >= THR;
function trace(s) { // membrane potential points (ms, mV) for 0..5 ms
  const p = [[0, REST], [1, REST]];
  if (!s.stim) return p.concat([[5, REST]]);
  const top = REST + Math.min(s.stim, 14.9);
  if (!fires(s)) return p.concat([[1.3, s.naBlock ? REST + Math.min(s.stim, 14) : top], [2.4, REST], [5, REST]]);
  if (s.kBlock) return p.concat([[1.15, THR], [1.6, PEAK], [2.2, 32], [5, 28]]);
  return p.concat([[1.15, THR], [1.6, PEAK], [2.3, -80], [3.6, REST], [5, REST]]);
}
function neuron(s, prog) {
  const ay = 120, ax1 = 160, ax2 = 690, w = s.dia === "thick" ? 16 : 9, L3 = s.lv >= 3;
  let g = `<g stroke="#ad1457" stroke-width="5" fill="none" stroke-linecap="round">${[[-1, -1], [-1, 0.2], [-0.4, 1], [0.2, -1.1], [-0.9, 0.9]].map(([a, b]) => `<path d="M110,${ay} q${a * 40},${b * 35} ${a * 75},${b * 55} m${-a * 18},${-b * 14} l${-12 + a * 6},${-14 * b}"/>`).join("")}</g>
    <circle cx="110" cy="${ay}" r="40" fill="#f8bbd0" stroke="#ad1457" stroke-width="4"/><circle cx="110" cy="${ay}" r="15" fill="#ad1457" opacity=".75"/>
    <rect x="${ax1 - 12}" y="${ay - w / 2}" width="${ax2 - ax1 + 12}" height="${w}" fill="#f48fb1"/>`;
  const nodes = [];
  if (s.myelin) for (let x = ax1 + 6; x + 52 < ax2; x += 64) { g += `<rect x="${x}" y="${ay - w / 2 - 9}" width="54" height="${w + 18}" rx="${(w + 18) / 2}" fill="#fff3e0" stroke="#ffb74d" stroke-width="2"/>`; nodes.push(x + 59); }
  g += `<g stroke="#ad1457" stroke-width="4" fill="#ad1457">${[-30, 0, 30].map(d => `<line x1="${ax2}" y1="${ay}" x2="${ax2 + 40}" y2="${ay + d}"/><circle cx="${ax2 + 44}" cy="${ay + d}" r="8"/>`).join("")}</g>`;
  if (L3) g += `<g><path d="M${ax2 + 70},${ay - 60} C${ax2 + 60},${ay - 20} ${ax2 + 60},${ay + 20} ${ax2 + 70},${ay + 60} L${ax2 + 140},${ay + 60} L${ax2 + 140},${ay - 60} Z" fill="#e1bee7" stroke="#6a1b9a" stroke-width="3"/>${T(ax2 + 108, ay + 4, "neuron 2", { s: 12, c: "#4a148c" })}
    ${n2fires(s) && s.reveal ? T(ax2 + 108, ay + 24, "⚡ FIRES", { s: 12, c: "#2e7d32" }) : s.reveal ? T(ax2 + 108, ay + 24, fmt(n2mv(s)) + " mV", { s: 12, c: "#6a1b9a" }) : ""}</g>`;
  if (prog != null && fires(s)) { let x = ax1 + (ax2 - ax1) * prog; if (s.myelin && nodes.length) x = [ax1].concat(nodes).filter(n => n <= x).pop();
    g += `<circle cx="${x}" cy="${ay}" r="${w}" fill="#ffeb3b" opacity=".9"/><circle cx="${x}" cy="${ay}" r="${w + 12}" fill="#ffeb3b" opacity=".3"/>`; }
  return g + T(110, 186, "cell body", { s: 12, c: "#880e4f" }) + T(420, ay - 34, s.myelin ? "axon with myelin sheath" : "axon (no myelin)", { s: 12, c: "#880e4f" }) + T(ax2 + 30, 186, "axon terminals", { s: 12, c: "#880e4f" });
}
function graph(s, upto) {
  const X = t => 70 + t * 140, Y = v => 420 - (v + 90) * 1.25, p = trace(s), pts = [];
  for (let i = 0; i < p.length - 1; i++) { const [t1, v1] = p[i], [t2, v2] = p[i + 1]; for (let k = 0; k <= 10; k++) { const t = t1 + (t2 - t1) * k / 10; if (t <= upto) pts.push([t, v1 + (v2 - v1) * k / 10]); } }
  let g = `<rect x="60" y="236" width="720" height="196" rx="10" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>`;
  [40, 0, -55, -70].forEach(v => { g += `<line x1="70" x2="770" y1="${Y(v)}" y2="${Y(v)}" stroke="${v === -55 ? "#ef6c00" : "#f3e5f5"}" stroke-width="${v === -55 ? 2 : 1}" ${v === -55 ? 'stroke-dasharray="6 4"' : ""}/>${T(64, Y(v) + 4, v, { a: "end", s: 11, c: "#8e6a85" })}`; });
  g += T(772, Y(-55) - 6, "threshold −55 mV", { a: "end", s: 11, c: "#ef6c00" }) + T(420, 446, "time (ms)", { s: 11, c: "#8e6a85" }) + T(14, 250, "mV", { a: "start", s: 11, c: "#8e6a85" });
  for (let t = 0; t <= 5; t++) g += T(X(t), 432, t, { s: 10, c: "#8e6a85" });
  if (pts.length > 1) g += `<polyline points="${pts.map(q => X(q[0]) + "," + Y(q[1]).toFixed(1)).join(" ")}" fill="none" stroke="#c2185b" stroke-width="3.5"/>`;
  return g;
}
function render(s) {
  const show = s.reveal || s.showVals, up = s._t != null ? s._t : show ? 5 : 1;
  let lower = "";
  if (s.lv === 2) lower = `<g transform="translate(60,240)"><rect width="720" height="190" rx="12" fill="#fff" stroke="#f8bbd0" stroke-width="2"/>
      ${T(180, 50, "axon length", { s: 13, c: "#8e6a85" })}${T(180, 90, fmt(s.len) + " m", { s: 30, c: "#880e4f" })}
      ${T(360, 50, "speed", { s: 13, c: "#8e6a85" })}${T(360, 90, show ? speed(s) + " m/s" : "? m/s", { s: 30, c: "#880e4f" })}
      ${T(540, 50, "time to reach the end", { s: 13, c: "#8e6a85" })}${T(540, 90, show ? fmt(tms(s)) + " ms" : "? ms", { s: 30, c: "#c2185b" })}
      ${T(360, 140, (s.myelin ? "Myelin: the impulse JUMPS from node to node" : "No myelin: the impulse travels along the whole membrane") + " · " + (s.dia === "thick" ? "thick axon" : "thin axon"), { s: 13, c: "#6a1b4d" })}</g>`;
  else lower = graph(s, up) + `<g transform="translate(600,250)">${show ? T(160, 22, fires(s) ? (s.kBlock ? "fired, but cannot reset" : "⚡ ACTION POTENTIAL") : "no impulse", { a: "end", s: 13, c: fires(s) ? "#2e7d32" : "#c62828" }) : ""}</g>`;
  return `<svg viewBox="0 0 840 450" xmlns="http://www.w3.org/2000/svg"><rect width="840" height="450" fill="#fff7f9"/>
    ${neuron(s, s._p)}${s.lv !== 2 ? T(40, 30, "stimulus: +" + s.stim + " mV" + (s.naBlock ? " · Na⁺ channels BLOCKED" : "") + (s.kBlock ? " · K⁺ channels BLOCKED" : "") + (s.lv >= 3 ? " · " + s.imp + " impulse" + (s.imp > 1 ? "s" : "") : ""), { a: "start", s: 13, c: "#6a1b4d" }) : ""}${lower}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (lv === 2) return [{ id: "myelin", type: "toggle", label: "Myelin sheath", lock: lk("myelin") },
    { id: "dia", type: "choice", label: "Axon diameter", options: [{ v: "thin", label: "Thin" }, { v: "thick", label: "Thick" }], lock: lk("dia") },
    { id: "len", type: "choice", label: "Axon length", options: [0.2, 0.5, 1].map(v => ({ v, label: v + " m" })), lock: lk("len") }];
  return [{ id: "stim", type: "range", label: "Stimulus strength", min: 0, max: 30, step: 1, nudge: 1, unit: "mV", lock: lk("stim") }]
    .concat(lv >= 3 ? [{ id: "imp", type: "step", label: "Impulses sent to the synapse", min: 1, max: 5, lock: lk("imp") }, { id: "naBlock", type: "toggle", label: "Toxin: block Na⁺ channels", lock: lk("naBlock") }, { id: "kBlock", type: "toggle", label: "Drug: block K⁺ channels", lock: lk("kBlock") }] : []);
};
const st = (lv, o) => Object.assign({ lv, stim: 0, myelin: false, dia: "thin", len: 0.5, imp: 1, naBlock: false, kBlock: false }, lv === 2 ? { stim: 20 } : {}, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; const t0 = performance.now(), dur = s.lv === 2 ? Math.min(2600, Math.max(700, tms(s) * 2.5)) : 1800;
  const f = now => { const k = Math.min(1, (now - t0) / dur); s._p = k; s._t = 1 + 4 * k; box.innerHTML = render(s); if (k < 1) requestAnimationFrame(f); else { s._p = null; s._t = null; box.innerHTML = render(s); res(); } }; requestAnimationFrame(f); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => fires(s) ? `A +${s.stim} mV stimulus reached the threshold: action potential (peak +40 mV)` : s.naBlock ? "Na⁺ channels are blocked — no action potential" : `−70 + ${s.stim} = ${REST + s.stim} mV: below threshold, no impulse`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: "⚡ Neuron challenge", prompt: "Set up the neuron, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: lv === 2 ? "Speed: no myelin thin 1 m/s, thick 5 m/s; myelin thin 50 m/s, thick 100 m/s. Time = length ÷ speed (×1000 for ms)." : "Resting −70 mV, threshold −55 mV: the stimulus must add at least 15 mV. An impulse is all-or-none (peak +40 mV). At the synapse each impulse adds +6 mV to neuron 2." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("neu-sim", diff, uses, mk);
const C = {
  fire: () => simQ(1, "Make the neuron <b>fire an impulse</b>.", st(1, { stim: 5 }), s => ok(fires(s), say(s) + ".", say(s) + "."), { stim: 20 }, { wrong: { stim: 10 } }),
  weakest: () => simQ(1, "Find the <b>weakest stimulus</b> (whole mV) that still makes the neuron fire.", st(1, { stim: 30 }), s => ok(s.stim === 15, "+15 mV takes −70 to exactly −55 mV, the threshold.", fires(s) ? "It fires — but a weaker stimulus would too." : say(s) + "."), { stim: 15 }, { wrong: { stim: 16 } }),
  sub: () => { const t = choice([-60, -62, -58, -65]); return simQ(1, `Raise the membrane to exactly <b>${t} mV</b> without firing.`, st(1), s => ok(!fires(s) && REST + s.stim === t, `−70 + ${s.stim} = ${t} mV: below threshold, so no impulse.`, say(s) + "."), { stim: t + 70 }, { wrong: { stim: t + 71 } }); },
  double: () => simQ(1, "Use a stimulus <b>twice as strong</b> as the weakest one that fires. Watch the peak!", st(1), s => ok(s.stim === 30, "Peak is still +40 mV: action potentials are ALL-OR-NONE.", `${s.stim} mV is not twice the threshold stimulus (15 mV).`), { stim: 30 }, { wrong: { stim: 20 } }),
  time: () => { const c = choice([[1000, { myelin: false, dia: "thin", len: 1 }], [40, { myelin: false, dia: "thick", len: 0.2 }], [4, { myelin: true, dia: "thin", len: 0.2 }], [2, { myelin: true, dia: "thick", len: 0.2 }], [100, { myelin: false, dia: "thick", len: 0.5 }]]);
    return simQ(2, `Make the impulse reach the end of the axon in exactly <b>${c[0]} ms</b>.`, st(2, { len: 0.5 }), s => ok(tms(s) === c[0], `${fmt(s.len)} m ÷ ${speed(s)} m/s = ${fmt(tms(s))} ms.`, `It takes ${fmt(tms(s))} ms.`), c[1], { wrong: Object.assign({}, c[1], { len: c[1].len === 1 ? 0.5 : 1 }) }); },
  fastest: () => simQ(2, "The axon is <b>1 m</b> long (spinal cord to toe). Make the impulse arrive <b>as fast as possible</b>.", st(2, { len: 1 }), s => ok(tms(s) === 10, "Thick + myelinated: 100 m/s → 10 ms.", `${speed(s)} m/s → ${fmt(tms(s))} ms. It can be faster.`), { myelin: true, dia: "thick" }, { lock: ["len"], wrong: { myelin: true, dia: "thin" } }),
  myelinOnly: () => simQ(2, "Thin axon, 0.5 m. Change <b>only one thing</b> to make the impulse <b>50 times faster</b>.", st(2, { len: 0.5, dia: "thin" }), s => ok(speed(s) === 50 && s.dia === "thin", "Adding myelin: 1 → 50 m/s (saltatory conduction).", `Speed ${speed(s)} m/s.`), { myelin: true }, { lock: ["len", "dia"], wrong: { myelin: false } }),
  slow: () => simQ(2, "Make the impulse take <b>longer than 0.5 s</b> to reach the end.", st(2, { myelin: true }), s => ok(tms(s) > 500, `${fmt(tms(s))} ms — unmyelinated thin axons are very slow.`, `${fmt(tms(s))} ms is not longer than 500 ms.`), { myelin: false, dia: "thin", len: 1 }, { wrong: { myelin: false, dia: "thin", len: 0.5 } }),
  syn3: () => simQ(3, "Make <b>neuron 2</b> fire using the <b>fewest impulses</b>.", st(3, { stim: 20 }), s => ok(n2fires(s) && s.imp === 3, "3 impulses × 6 mV = 18 mV → −52 mV, past the threshold (summation).", n2fires(s) ? "Neuron 2 fires, but fewer impulses are enough." : `Neuron 2 only reaches ${fmt(n2mv(s))} mV.`), { imp: 3 }, { lock: ["stim"], wrong: { imp: 2 } }),
  toxin: () => simQ(3, "A <b>25 mV</b> stimulus is given. Use a toxin to <b>stop the impulse</b>.", st(3, { stim: 25 }), s => ok(!fires(s), "With Na⁺ channels blocked, Na⁺ cannot rush in, so no action potential.", s.kBlock ? "Blocking K⁺ channels doesn't stop the impulse starting." : "The neuron still fires."), { naBlock: true }, { lock: ["stim", "imp"], wrong: { kBlock: true } }),
  stuck: () => simQ(3, "Make the neuron <b>fire</b> but <b>NOT return</b> to the resting potential.", st(3), s => ok(fires(s) && s.kBlock, "K⁺ channels blocked: K⁺ cannot leave, so the membrane cannot repolarise.", !fires(s) ? say(s) + "." : "It returns to −70 mV. Something must stop repolarisation."), { stim: 20, kBlock: true }, { lock: ["imp"], wrong: { stim: 20, kBlock: false } }),
  oneNotTwo: () => simQ(3, "Make <b>neuron 1 fire</b> but <b>neuron 2 NOT fire</b>, using as many impulses as possible.", st(3), s => ok(fires(s) && !n2fires(s) && s.imp === 2, "2 impulses: neuron 2 reaches −58 mV — not enough.", !fires(s) ? say(s) + "." : n2fires(s) ? "Neuron 2 fired." : "More impulses are possible without neuron 2 firing."), { stim: 20, imp: 2 }, { wrong: { stim: 20, imp: 3 } })
};

// ---------- diagram tasks ----------
const D = {
  parts: diff => E.diaT("neu-pick", diff, 2, () => { const q = choice([["den", "the <b>dendrites</b> (receive signals)"], ["body", "the <b>cell body</b> (contains the nucleus)"], ["axon", "the <b>axon</b> (carries the impulse away)"], ["mye", "the <b>myelin sheath</b> (insulates, speeds up)"], ["term", "the <b>axon terminals</b> (pass the signal on)"]]);
    const sv = st(1, { myelin: false, dia: "thick" }), my = [300, 364, 428].map(x => `<rect x="${x}" y="103" width="54" height="34" rx="17" fill="#fff3e0" stroke="#ffb74d" stroke-width="2"/>`).join("");
    return { kind: "pick", title: "👆 Parts of a neuron", prompt: "Click " + q[1] + ".", answer: [q[0]], names: { den: "dendrites", body: "cell body", axon: "axon", mye: "myelin sheath", term: "axon terminals" },
      visual: stt => `<svg viewBox="0 0 840 230" xmlns="http://www.w3.org/2000/svg"><rect width="840" height="230" fill="#fff7f9"/>${neuron(sv).replace(/<text[\s\S]*?<\/text>/g, "")}${my}
        <g class="pk" data-k="den"><rect x="12" y="50" width="70" height="140" rx="16" fill="rgba(0,0,0,0.001)" ${E.ring(stt.den)}/></g><g class="pk" data-k="body"><circle cx="110" cy="120" r="44" fill="rgba(0,0,0,0.001)" ${E.ring(stt.body)}/></g>
        <g class="pk" data-k="axon"><rect x="160" y="104" width="130" height="32" rx="8" fill="rgba(0,0,0,0.001)" ${E.ring(stt.axon)}/><rect x="545" y="104" width="140" height="32" rx="8" fill="rgba(0,0,0,0.001)" ${E.ring(stt.axon)}/></g>
        <g class="pk" data-k="mye"><rect x="296" y="98" width="190" height="44" rx="20" fill="rgba(0,0,0,0.001)" ${E.ring(stt.mye)}/></g><g class="pk" data-k="term"><rect x="690" y="80" width="70" height="80" rx="14" fill="rgba(0,0,0,0.001)" ${E.ring(stt.term)}/></g></svg>`,
      explain: "Dendrites → cell body → axon (wrapped in myelin) → axon terminals → synapse.", summary: "Parts of a neuron" }; }),
  ap: diff => E.diaT("neu-num", diff, 2, () => { const s = st(1, { stim: 20, showVals: true });
    return { kind: "num", title: "📈 Read the action potential", prompt: "This graph shows one action potential.", visual: `<svg viewBox="0 0 840 450" xmlns="http://www.w3.org/2000/svg"><rect width="840" height="450" fill="#fff7f9"/>${graph(s, 5).replace(/<g transform="translate\(0,0\)">/, "")}${T(420, 200, "membrane potential of the axon", { s: 14, c: "#880e4f" })}</svg>`,
      fields: [{ label: "Resting potential", unit: "mV", answer: -70 }, { label: "Peak of the action potential", unit: "mV", answer: 40 }, { label: "Total change from rest to peak", unit: "mV", answer: 110 }], explain: "Rest −70 mV → peak +40 mV: a change of 110 mV (Na⁺ rushes in). Then K⁺ leaves and the membrane repolarises.", summary: "Read an action potential graph" }; }),
  speedNum: diff => E.diaT("neu-num", diff, 3, () => { const c = choice([[1.2, 12], [0.9, 15], [0.6, 300], [2, 20]]);
    return { kind: "num", title: "🏃 Impulse speed", prompt: `An impulse travels ${c[0]} m along a nerve in ${c[1]} ms.`, visual: render(st(2, { myelin: c[1] < 100, dia: "thick", len: 1, showVals: false })),
      fields: [{ label: "Speed", unit: "m/s", answer: c[0] / (c[1] / 1000), tol: 0.6 }], explain: `v = d ÷ t = ${c[0]} ÷ ${c[1] / 1000} = ${fmt(c[0] / (c[1] / 1000))} m/s. ${c[1] < 100 ? "Fast → probably myelinated." : "Slow → probably no myelin."}`, summary: "Calculate impulse speed" }; }),
  reflex: diff => E.diaT("neu-mcq", diff, 1, () => { const q = choice([
      { ask: "What is the correct order in a <b>reflex arc</b>?", ok: "stimulus → receptor → sensory neuron → relay neuron → motor neuron → effector", bad: ["receptor → motor neuron → relay neuron → sensory neuron → effector", "effector → motor neuron → brain → receptor", "stimulus → motor neuron → sensory neuron → effector"], ex: "Sensory neurons carry the signal to the spinal cord, relay neurons pass it on, motor neurons carry it to the muscle (effector)." },
      { ask: "How does the signal cross the synapse (gap) to the next neuron?", ok: "Neurotransmitter chemicals diffuse across the gap", bad: ["The electric impulse jumps across", "The axon touches the next neuron", "Myelin carries it across"], ex: "The impulse makes the terminal release neurotransmitters, which diffuse and bind to receptors on the next neuron." },
      { ask: "Why does myelin make impulses faster?", ok: "The impulse jumps from node to node (saltatory conduction)", bad: ["Myelin carries electrons quickly", "Myelin makes the axon shorter", "Myelin adds more Na⁺ ions"], ex: "Myelin insulates the axon; depolarisation only happens at the gaps (nodes of Ranvier)." }]);
    return { kind: "mcq", title: "🧠 Nervous system", prompt: "Think about how signals travel.", visual: render(st(3, { stim: 20, imp: 3, myelin: true, showVals: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Reflexes, synapses and myelin" }; })
};
const LEVELS = {
  1: { intro: "Stimulate a neuron. Does the membrane reach the threshold (−55 mV)? An action potential is all-or-none.", pool: () => [S(1, 1, C.fire), S(2, 1, C.sub), S(2, 1, C.weakest), S(3, 1, C.double), S(3, 1, C.sub), D.parts(1), D.ap(2), D.reflex(3)] },
  2: { intro: "How fast is an impulse? Myelin and axon thickness change the speed.", pool: () => [S(1, 1, C.myelinOnly), S(2, 2, C.time), S(2, 1, C.fastest), S(3, 1, C.slow), D.parts(1), D.speedNum(2), D.reflex(3)] },
  3: { intro: "Ion channels and synapses: toxins, drugs and summation at the synapse.", pool: () => [S(1, 1, C.toxin), S(2, 1, C.syn3), S(2, 1, C.stuck), S(3, 1, C.oneNotTwo), D.ap(1), D.reflex(2), D.speedNum(3)] }
};
const explore = E.exploreSim({
  intro: "Set the stimulus (and other controls in higher levels) and press ▶ to send it down the neuron.",
  state: lv => st(lv), controls: lv => ctls(lv), render, run, runLabel: "▶ Stimulate",
  goals: lv => lv === 2 ? [{ txt: "Run with and without myelin", test: (s, m) => m.my && m.nomy }, { txt: "Try a thick axon", test: (s, m) => m.thick }]
    : [{ txt: "Give a stimulus that does NOT fire", test: (s, m) => m.no }, { txt: "Make the neuron fire", test: (s, m) => m.yes }].concat(lv >= 3 ? [{ txt: "Block the Na⁺ channels", test: (s, m) => m.na }] : []),
  track: (s, m, ran) => { if (!ran) return; if (s.lv === 2) { if (s.myelin) m.my = 1; else m.nomy = 1; if (s.dia === "thick") m.thick = 1; } else { if (fires(s)) m.yes = 1; else if (s.stim > 0) m.no = 1; if (s.naBlock) m.na = 1; } },
  facts: lv => lv === 2 ? "📘 <b>Myelin</b> insulates the axon so the impulse jumps between nodes: up to 100 m/s." : "📘 Resting potential <b>−70 mV</b>. If a stimulus reaches <b>−55 mV</b>, Na⁺ rushes in (depolarisation, +40 mV), then K⁺ leaves (repolarisation)."
});
E.start({ labId: "neuron", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧠", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["⚡", "🧠", "✨", "⭐"],
  exploreDemo: lv => lv === 2 ? [{ set: { myelin: false }, run: true }, { set: { myelin: true, dia: "thick" }, run: true }] : [{ set: { stim: 8 }, run: true }, { set: { stim: 20 }, run: true }].concat(lv >= 3 ? [{ set: { naBlock: true }, run: true }] : []) });
})();
