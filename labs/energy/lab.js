"use strict";
// ===== Energy Skate Park — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const g = 10;
const FR = [{ v: 0, label: "None" }, { v: 0.2, label: "Low (20%)" }, { v: 0.5, label: "High (50%)" }];
const pe0 = s => s.m * g * s.h;
const hEnd = s => s.h * (1 - 2 * s.fr);
const heightAt = (s, t) => t <= 0.5 ? s.h * Math.cos(Math.PI * t) ** 2 : Math.max(0, hEnd(s)) * Math.cos(Math.PI * t) ** 2;
function energies(s, t) {
  const P0 = pe0(s), pe = s.m * g * heightAt(s, t), th = Math.min(P0, P0 * s.fr * 2 * t);
  return { pe, ke: Math.max(0, P0 - pe - th), th, tot: P0 };
}
const vBottom = s => Math.sqrt(2 * g * s.h * (1 - s.fr));

// U-shaped track: x from 70 (left top) to 670 (right top), bottom at 370; height 10 m = 300 px
const Y0 = 390, PX = 30;
const xFor = (hm, side) => 370 + side * 300 * Math.sqrt(Math.max(0, hm) / 10);
function render(s) {
  const t = s._t || 0, side = t <= 0.5 ? -1 : 1, hm = heightAt(s, t);
  const x = xFor(hm, side), y = Y0 - hm * PX;
  const en = energies(s, t), show = s.reveal || s.showVals, maxE = 8000;
  let track = "M70," + (Y0 - 300);
  for (let i = 1; i <= 60; i++) { const xx = 70 + i * 10; const hh = 10 * ((xx - 370) / 300) ** 2; track += ` L${xx},${Y0 - hh * PX}`; }
  let svg = `<svg viewBox="0 0 980 450" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3f2fd"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
    <rect width="980" height="450" fill="url(#sky)"/>
    <rect y="${Y0 + 8}" width="700" height="60" fill="#cfd8dc"/>`;
  for (let m = 0; m <= 10; m++) svg += `<line x1="20" x2="${m % 5 === 0 ? 44 : 34}" y1="${Y0 - m * PX}" y2="${Y0 - m * PX}" stroke="#455a64" stroke-width="2"/>${m % 2 === 0 ? T(52, Y0 - m * PX + 5, m + " m", { a: "start", s: 13, c: "#455a64" }) : ""}`;
  svg += `<path d="${track}" fill="none" stroke="#607d8b" stroke-width="12" stroke-linecap="round"/><path d="${track}" fill="none" stroke="#b0bec5" stroke-width="4"/>
    <line x1="${xFor(s.h, -1) - 30}" x2="${xFor(s.h, -1) + 30}" y1="${Y0 - s.h * PX}" y2="${Y0 - s.h * PX}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4"/>
    ${T(xFor(s.h, -1) - 34, Y0 - s.h * PX - 6, "start " + fmt(s.h) + " m", { a: "end", s: 13, c: "#b45309" })}
    <g transform="translate(${x},${y - 6})">
      <rect x="-22" y="-6" width="44" height="8" rx="4" fill="#37474f"/><circle cx="-14" cy="5" r="4" fill="#263238"/><circle cx="14" cy="5" r="4" fill="#263238"/>
      <rect x="-7" y="-40" width="14" height="34" rx="6" fill="#1e88e5"/><circle cx="0" cy="-50" r="10" fill="#ffcc80"/><path d="M-10,-54 a10,10 0 0 1 20,0 z" fill="#e53935"/>
    </g>
    ${s.fr ? T(370, Y0 + 42, "friction: " + (s.fr === 0.2 ? "low" : "high"), { s: 14, c: "#b71c1c" }) : ""}`;
  // energy bars
  const bx = 712, bw = 50, bh = 300, by = 70;
  const bar = (i, v, c, lab) => { const h = Math.min(bh, bh * v / maxE); return `<rect x="${bx + i * 62}" y="${by + bh - h}" width="${bw}" height="${h}" rx="6" fill="${c}"/>${T(bx + i * 62 + bw / 2, by + bh + 22, lab, { s: 13 })}${show ? T(bx + i * 62 + bw / 2, by + bh - h - 8, Math.round(v), { s: 13, c: c }) : ""}`; };
  svg += `<rect x="${bx - 14}" y="${by - 30}" width="262" height="${bh + 80}" rx="14" fill="#fff" stroke="#cfd8dc"/>${T(bx + 120, by - 10, "ENERGY (J)", { s: 14, c: "#455a64" })}
    ${bar(0, en.pe, "#1e88e5", "PE")}${bar(1, en.ke, "#43a047", "KE")}${bar(2, en.th, "#e53935", "Heat")}${bar(3, en.tot, "#78909c", "Total")}</svg>`;
  return svg;
}
const ctls = (lv, o) => {
  o = o || {};
  return [
    { id: "h", type: "range", label: "Start height", min: 0.5, max: 10, step: 0.1, unit: "m", lock: o.lockH ? () => true : null },
    { id: "m", type: "range", label: "Mass", min: 20, max: 80, step: 5, unit: "kg", lock: o.lockM ? () => true : null },
    { id: "fr", type: "choice", label: "Friction", options: FR, hide: () => (o.lv || lv) < 2, lock: o.lockF ? () => true : null }
  ];
};
function runAnim(s, box) {
  s.reveal = true;
  return new Promise(res => { const t0 = performance.now(), dur = 3200;
    const f = now => { s._t = Math.min(1, (now - t0) / dur); box.innerHTML = render(s); if (s._t < 1) requestAnimationFrame(f); else { s._t = 0.5; box.innerHTML = render(s); res(); } };
    requestAnimationFrame(f); });
}
const st = o => Object.assign({ h: 3, m: 40, fr: 0, _t: 0 }, o || {});
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const simQ = (goal, s0, check, sol, o) => ({ title: "🛹 Energy challenge", prompt: "Set up the skater, then press <b>▶ Run & check</b>. Energy values appear when the skater runs.", goal,
  sim: { state: s0, controls: ctls(S1971Lab.level, o), render, run: runAnim, check, hint: "PE = m × g × h (g = 10 N/kg). At the bottom, KE = PE at the top − energy lost as heat." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("energy-sim", diff, uses, mk);
const C = {
  pe: () => { const P = choice([2000, 3000, 1500, 4000, 2400]); const m = P % 400 === 0 ? 40 : 50, h = P / (m * g);
    return simQ(`Give the skater exactly <b>${P} J</b> of potential energy at the start.`, st(), s => ok(E.near(pe0(s), P, 0.5), `PE = ${s.m} × 10 × ${fmt(s.h)} = ${fmt(pe0(s))} J.`, `PE = ${s.m} × 10 × ${fmt(s.h)} = ${fmt(pe0(s))} J, not ${P} J.`), { m, h }, { wrong: { h: h + 0.5 } }); },
  speed: () => { const v = choice([4, 6, 8, 10, 12]), h = v * v / 20;
    return simQ(`Make the skater reach exactly <b>${v} m/s</b> at the bottom of the ramp.`, st(), s => ok(E.near(vBottom(s), v, 0.01), `v = √(2 × 10 × ${fmt(s.h)}) = ${fmt(vBottom(s))} m/s.`, `v = √(2 × 10 × ${fmt(s.h)}) = ${fmt(vBottom(s))} m/s, not ${v}.`), { h }, { wrong: { h: h + 0.5 } }); },
  ke: () => { const m = choice([40, 50, 60]), h = choice([5, 6, 7]), K = m * g * h;
    return simQ(`The skater's mass is <b>${m} kg</b>. Make its kinetic energy at the bottom exactly <b>${K} J</b>.`, st({ m }), s => ok(E.near(pe0(s) * (1 - s.fr), K, 0.5), `KE at the bottom = ${fmt(pe0(s))} J.`, `KE at the bottom = ${fmt(pe0(s) * (1 - s.fr))} J, not ${K} J.`), { h }, { lockM: true, wrong: { h: h - 1 } }); },
  keFric: () => { const K = choice([2400, 3200, 1600]), P = K / 0.8, m = 40, h = P / (m * g);
    return simQ(`Friction is <b>LOW</b> (20% of the energy becomes heat by the bottom). Make the KE at the bottom exactly <b>${K} J</b>.`, st({ fr: 0.2, m }), s => ok(E.near(pe0(s) * 0.8, K, 0.5), `0.8 × ${fmt(pe0(s))} = ${fmt(pe0(s) * 0.8)} J.`, `KE = 0.8 × ${fmt(pe0(s))} = ${fmt(pe0(s) * 0.8)} J, not ${K}.`), { h }, { lockF: true, lockM: true, lv: 2, wrong: { h: h + 1 } }); },
  heat: () => { const H = choice([1000, 600, 800]), P = H / 0.2, m = 50, h = P / (m * g);
    return simQ(`Friction is <b>LOW</b> (20%). Make exactly <b>${H} J</b> turn into heat by the time the skater reaches the bottom.`, st({ fr: 0.2, m }), s => ok(E.near(pe0(s) * 0.2, H, 0.5), `Heat = 0.2 × ${fmt(pe0(s))} = ${fmt(pe0(s) * 0.2)} J.`, `Heat = 0.2 × ${fmt(pe0(s))} = ${fmt(pe0(s) * 0.2)} J.`), { h }, { lockF: true, lockM: true, lv: 2, wrong: { h: h + 1 } }); },
  stopAt: () => { const e = choice([3, 2.4, 1.8]), h = e / 0.6;
    return simQ(`Friction is <b>LOW</b>: the skater loses 40% of its energy over the whole ride. Make it stop exactly at <b>${e} m</b> high on the other side.`, st({ fr: 0.2 }), s => ok(E.near(hEnd(s), e, 0.01), `0.6 × ${fmt(s.h)} = ${fmt(hEnd(s))} m.`, `It stopped at ${fmt(hEnd(s))} m, not ${e} m.`), { h }, { lockF: true, lv: 2, wrong: { h: h + 1 } }); },
  speedHigh: () => { const v = choice([4, 6, 8]), h = v * v / 10;
    return simQ(`Friction is <b>HIGH</b> (50% becomes heat by the bottom). Make the skater reach exactly <b>${v} m/s</b> at the bottom.`, st({ fr: 0.5 }), s => ok(E.near(vBottom(s), v, 0.01), `v = √(2 × 10 × ${fmt(s.h)} × 0.5) = ${fmt(vBottom(s))} m/s.`, `v = ${fmt(vBottom(s))} m/s, not ${v}.`), { h }, { lockF: true, lv: 3, wrong: { h: h + 1 } }); },
  split: () => simQ("Mass is <b>50 kg</b>. Choose the friction and height so that at the bottom the skater has <b>2000 J of KE</b> and <b>2000 J of heat</b>.", st({ m: 50 }), s => ok(E.near(pe0(s) * (1 - s.fr), 2000, 0.5) && E.near(pe0(s) * s.fr, 2000, 0.5), "Total 4000 J, half became heat (high friction).", `KE ${fmt(pe0(s) * (1 - s.fr))} J and heat ${fmt(pe0(s) * s.fr)} J.`), { fr: 0.5, h: 8 }, { lockM: true, lv: 3, wrong: { fr: 0.2, h: 8 } }),
  speed40: () => { const v = choice([8, 4]), h = v * v / 16;
    return simQ(`Mass <b>40 kg</b>, friction <b>LOW</b> (20%). Make the speed at the bottom exactly <b>${v} m/s</b>.`, st({ m: 40, fr: 0.2 }), s => ok(E.near(vBottom(s), v, 0.01), `v = √(2 × 10 × ${fmt(s.h)} × 0.8) = ${fmt(vBottom(s))} m/s.`, `v = ${fmt(vBottom(s))} m/s.`), { h }, { lockM: true, lockF: true, lv: 3, wrong: { h: h + 1 } }); }
};

// ---------- diagram tasks ----------
const trackPts = [["A", 9, -1], ["B", 4.5, -1], ["C", 0, 0], ["D", 2.5, 1], ["E", 7, 1]];
function trackSvg(st, extra) {
  let tr = "M70," + (Y0 - 300); for (let i = 1; i <= 60; i++) { const xx = 70 + i * 10; tr += ` L${xx},${Y0 - 10 * ((xx - 370) / 300) ** 2 * PX}`; }
  return `<svg viewBox="0 0 740 450" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="450" fill="#f4f8fc"/><path d="${tr}" fill="none" stroke="#607d8b" stroke-width="12"/>
    ${Array.from({ length: 11 }, (_, m) => `<line x1="20" x2="34" y1="${Y0 - m * PX}" y2="${Y0 - m * PX}" stroke="#455a64" stroke-width="2"/>${m % 2 === 0 ? T(40, Y0 - m * PX + 5, m + " m", { a: "start", s: 12 }) : ""}`).join("")}
    ${trackPts.map(([k, h, sd]) => { const x = sd === 0 ? 370 : xFor(h, sd), y = Y0 - h * PX; return `<g class="pk" data-k="${k}"><circle cx="${x}" cy="${y - 4}" r="24" fill="#fff" ${E.ring(st[k])}/><circle cx="${x}" cy="${y - 4}" r="16" fill="#1e88e5"/>${T(x, y + 2, k, { s: 15, c: "#fff" })}</g>`; }).join("")}${extra || ""}</svg>`;
}
const D = {
  fastest: diff => E.diaT("energy-pick", diff, 1, () => ({ kind: "pick", title: "👆 Read the track", prompt: "No friction. The skater starts from rest at point A. Click the point where the skater is <b>fastest</b>.", answer: ["C"], names: { C: "C (the lowest point)" }, visual: st => trackSvg(st),
    explain: "The lowest point has the least PE, so the most energy is KE → highest speed.", summary: "Where is the skater fastest?" })),
  half: diff => E.diaT("energy-pick", diff, 1, () => ({ kind: "pick", title: "👆 Read the track", prompt: "No friction. The skater starts from rest at <b>A (9 m)</b>. Click the point where <b>KE = PE</b>.", answer: ["B"], names: { B: "B (4.5 m — half the height)" }, visual: st => trackSvg(st),
    explain: "KE = PE when the skater is at half the starting height: 9 ÷ 2 = 4.5 m (point B).", summary: "Where does KE equal PE?" })),
  calcPE: diff => E.diaT("energy-num", diff, 2, () => { const m = choice([30, 45, 60, 55]), h = choice([4, 6, 8, 5]);
    return { kind: "num", title: "🧮 Calculate from the picture", prompt: `A skater of mass <b>${m} kg</b> stands at the start (g = 10 N/kg). Read the height from the scale.`,
      visual: trackSvg({}, `<g transform="translate(${xFor(h, -1)},${Y0 - h * PX - 30})"><rect x="-38" y="-30" width="76" height="26" rx="8" fill="#1d1b4b"/>${T(0, -11, m + " kg", { s: 14, c: "#7dffb3" })}<circle r="10" fill="#ff7043"/></g><line x1="${xFor(h, -1)}" x2="40" y1="${Y0 - h * PX}" y2="${Y0 - h * PX}" stroke="#ff7043" stroke-dasharray="6 4" stroke-width="2"/>`),
      fields: [{ label: "Height", unit: "m", answer: h }, { label: "Potential energy", unit: "J", answer: m * g * h }, { label: "Speed at the bottom (no friction)", unit: "m/s", answer: Math.sqrt(20 * h), tol: 0.06 }],
      explain: `PE = ${m} × 10 × ${h} = ${m * g * h} J. v = √(2 × 10 × ${h}) = ${fmt(Math.sqrt(20 * h))} m/s.`, summary: "PE and speed from the picture" }; }),
  bars: diff => E.diaT("energy-num", diff, 2, () => { const tot = choice([3000, 4000, 5000]), pe = choice([1000, 1500, 2000]), th = diff >= 3 ? choice([200, 500]) : 0;
    const vis = `<svg viewBox="0 0 740 360" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="360" fill="#f4f8fc"/>${T(370, 34, "Energy bar chart at one moment on the ride", { s: 16 })}
      ${[["PE", pe, "#1e88e5"], ["KE", null, "#43a047"], ["Heat", th, "#e53935"], ["Total", tot, "#78909c"]].map(([n, v, c], i) => { const x = 140 + i * 130, h = v == null ? 0 : 240 * v / 6000;
        return `<rect x="${x}" y="${300 - h}" width="80" height="${h}" rx="6" fill="${c}"/>${v == null ? `<rect x="${x}" y="120" width="80" height="180" rx="6" fill="none" stroke="${c}" stroke-width="3" stroke-dasharray="8 6"/>${T(x + 40, 215, "?", { s: 40, c })}` : T(x + 40, 292 - h, v + " J", { s: 15, c })}${T(x + 40, 326, n, { s: 15 })}`; }).join("")}</svg>`;
    return { kind: "num", title: "📊 Read the energy bars", prompt: "Use the bar chart and conservation of energy to find the missing kinetic energy.", visual: vis,
      fields: [{ label: "Kinetic energy", unit: "J", answer: tot - pe - th }], explain: `Total = PE + KE + heat → KE = ${tot} − ${pe} − ${th} = ${tot - pe - th} J.`, summary: "Missing KE from the energy bars" }; }),
  transform: diff => E.diaT("energy-mcq", diff, 1, () => ({ kind: "mcq", title: "🔁 Energy changes", prompt: "Look at the skater going DOWN the ramp from A to C.", visual: trackSvg({}),
    ask: "Which energy change happens from A to C (no friction)?", options: E.mkOptions("Potential energy changes into kinetic energy", ["Kinetic energy changes into potential energy", "Energy is destroyed", "Heat changes into potential energy"]),
    explain: "Going down, height falls (less PE) and speed rises (more KE); the total stays the same.", summary: "Energy change going down" })),
  fricMcq: diff => E.diaT("energy-mcq", diff, 1, () => ({ kind: "mcq", title: "🔥 Friction", prompt: "With friction, the skater starts at A (9 m) but only reaches 7 m on the other side.", visual: trackSvg({}),
    ask: "Where did the 'missing' energy go?", options: E.mkOptions("It became thermal energy (heat) because of friction", ["It was destroyed", "It became extra potential energy", "It went into the skater's mass"]),
    explain: "Energy is conserved: friction turns some mechanical energy into heat.", summary: "Where the energy goes with friction" }))
};

const LEVELS = {
  1: { intro: "Potential and kinetic energy: the higher you start, the faster you go.", pool: () => [S(1, 2, C.pe), S(2, 2, C.speed), S(3, 2, C.ke), D.transform(1), D.fastest(1), D.calcPE(2), D.half(3)] },
  2: { intro: "Friction turns some energy into heat — but the total energy stays the same.", pool: () => [S(1, 1, C.pe), S(2, 1, C.keFric), S(2, 1, C.heat), S(3, 1, C.stopAt), S(3, 1, C.speed), D.fricMcq(1), D.bars(2), D.calcPE(2), D.half(3)] },
  3: { intro: "Energy conservation with friction: hit exact speeds and energy splits.", pool: () => [S(1, 1, C.speed), S(2, 1, C.speedHigh), S(2, 1, C.keFric), S(3, 1, C.split), S(3, 1, C.speed40), D.bars(1), D.calcPE(2), D.half(2), D.bars(3)] }
};

const explore = E.exploreSim({
  intro: "Set the start height and mass (and friction in higher levels), then press <b>▶ Run</b> and watch the energy bars change.",
  state: () => st({ showVals: true }), controls: lv => ctls(lv), render, run: runAnim, runLabel: "▶ Run the skater",
  goals: lv => [
    { txt: "Run the skater 3 times", test: (s, m) => m.runs >= 3 },
    { txt: "Try a start height above 8 m", test: s => s.h > 8 },
    { txt: "Change the mass", test: (s, m) => (m.ms || new Set()).size >= 2 }
  ].concat(lv >= 2 ? [{ txt: "Run with friction turned on", test: (s, m) => m.fricRun }] : []),
  track: (s, m, ran) => { (m.ms = m.ms || new Set()).add(s.m); if (ran && s.fr > 0) m.fricRun = true; },
  facts: lv => "📘 <b>PE = m × g × h</b>, <b>KE = ½ m v²</b> (g = 10 N/kg). Without friction, the total energy stays the same, so PE at the top = KE at the bottom." + (lv >= 2 ? " With friction, part of the energy becomes <b>heat</b>." : "")
});

E.start({
  labId: "energy", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🛹", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🛹", "⭐", "⚡", "✨"],
  exploreDemo: lv => [{ set: { h: 4 }, run: true }, { set: { h: 9, m: 60 }, run: true }].concat(lv >= 2 ? [{ set: { fr: 0.2 }, run: true }] : [{ set: { m: 50 }, run: true }])
});
})();
