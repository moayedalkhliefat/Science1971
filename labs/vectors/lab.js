"use strict";
// ===== Vector Addition — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100, rad = d => d * Math.PI / 180;
const comp = (m, a) => ({ x: r2(m * Math.cos(rad(a))), y: r2(m * Math.sin(rad(a))) });
const Rv = s => { const a = comp(s.am, s.aa), b = comp(s.bm, s.ba); return { x: r2(a.x + b.x), y: r2(a.y + b.y) }; };
const mag = s => { const r = Rv(s); return r2(Math.hypot(r.x, r.y)); };
const ang = s => { const r = Rv(s); if (!mag(s)) return 0; let d = Math.atan2(r.y, r.x) * 180 / Math.PI; if (d < 0) d += 360; return r2(d); };
const between = s => { let d = Math.abs(s.aa - s.ba) % 360; return d > 180 ? 360 - d : d; };
const arrow = (x1, y1, x2, y2, col, w, dash) => { const a = Math.atan2(y2 - y1, x2 - x1), L = Math.hypot(x2 - x1, y2 - y1); if (L < 2) return ""; return `<line x1="${x1}" y1="${y1}" x2="${x2 - Math.cos(a) * 10}" y2="${y2 - Math.sin(a) * 10}" stroke="${col}" stroke-width="${w}" ${dash ? 'stroke-dasharray="7 5"' : ""}/><path d="M${x2},${y2} l${-Math.cos(a) * 14 + Math.sin(a) * 7},${-Math.sin(a) * 14 - Math.cos(a) * 7} l${-Math.sin(a) * 14},${Math.cos(a) * 14}Z" fill="${col}"/>`; };
function render(s) {
  const show = s.reveal, k = 17, ox = 300, oy = 225, X = x => ox + x * k, Y = y => oy - y * k, a = comp(s.am, s.aa), b = comp(s.bm, s.ba), r = Rv(s);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><clipPath id="vc"><rect x="22" y="22" width="556" height="406" rx="14"/></clipPath><g clip-path="url(#vc)">`;
  for (let i = -16; i <= 16; i++) { g += `<line x1="${X(i)}" y1="20" x2="${X(i)}" y2="430" stroke="${i ? "#eceff1" : "#b0bec5"}" stroke-width="${i ? 1 : 1.5}"/>`; if (Math.abs(i) <= 12) g += `<line x1="20" y1="${Y(i)}" x2="580" y2="${Y(i)}" stroke="${i ? "#eceff1" : "#b0bec5"}" stroke-width="${i ? 1 : 1.5}"/>`; }
  [-10, -5, 5, 10].forEach(i => g += T(X(i), oy + 14, i, { s: 9, c: "#90a4ae" }) + T(ox - 6, Y(i) + 3, i, { a: "end", s: 9, c: "#90a4ae" }));
  if (s.target) g += `<circle cx="${X(s.target.x)}" cy="${Y(s.target.y)}" r="12" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>${T(X(s.target.x), Y(s.target.y) + 5, "★", { s: 14, c: "#f9a825" })}`;
  g += arrow(X(0), Y(0), X(a.x), Y(a.y), "#e53935", 4) + T(X(a.x / 2) - 8, Y(a.y / 2) - 8, "A", { s: 15, c: "#c62828" });
  g += arrow(X(a.x), Y(a.y), X(r.x), Y(r.y), "#1e88e5", 4) + T(X(a.x + b.x / 2) + 8, Y(a.y + b.y / 2) - 8, "B", { s: 15, c: "#1565c0" });
  if (show) { g += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(r.x)}" y2="${Y(0)}" stroke="#8e24aa" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="${X(r.x)}" y1="${Y(0)}" x2="${X(r.x)}" y2="${Y(r.y)}" stroke="#8e24aa" stroke-width="1.5" stroke-dasharray="4 3"/>` + arrow(X(0), Y(0), X(r.x), Y(r.y), "#6a1b9a", 5) + T(X(r.x / 2) + 14, Y(r.y / 2) + 18, "R", { s: 16, c: "#6a1b9a" }); }
  g += `</g>${T(36, 44, "1 square = 1 unit", { a: "start", s: 10, c: "#90a4ae" })}`;
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${T(120, 58, `A = ${s.am} at ${s.aa}° → (${fmt(a.x)}, ${fmt(a.y)})`, { s: 12, c: "#c62828" })}${T(120, 80, `B = ${s.bm} at ${s.ba}° → (${fmt(b.x)}, ${fmt(b.y)})`, { s: 12, c: "#1565c0" })}
    ${show ? T(120, 120, "resultant R = A + B", { s: 12, c: "#78909c" }) + T(120, 148, `(${fmt(r.x)}, ${fmt(r.y)})`, { s: 18, c: "#6a1b9a" }) + T(120, 182, "|R| = " + fmt(mag(s)), { s: 22, c: "#e65100" }) + T(120, 210, mag(s) ? "direction " + fmt(ang(s)) + "°" : "no direction (zero)", { s: 14, c: "#37474f" }) + T(120, 238, "angle between A and B: " + between(s) + "°", { s: 11, c: "#78909c" }) : T(120, 160, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 310, "x = size × cos(angle)", { s: 12, c: "#546e7a" })}${T(120, 330, "y = size × sin(angle)", { s: 12, c: "#546e7a" })}${T(120, 354, "|R| = √(Rx² + Ry²)", { s: 12, c: "#546e7a" })}${T(120, 380, "angles from the +x axis, anticlockwise", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null, step = lv < 3 ? 90 : 15; return [
  { id: "am", type: "range", label: "Size of A", min: 0, max: 10, step: 1, nudge: 1, unit: "", lock: lk("am") },
  { id: "aa", type: "range", label: "Direction of A", min: 0, max: 345, step: lv < 3 ? 45 : 15, nudge: lv < 3 ? 45 : 15, unit: "°", lock: lk("aa") },
  { id: "bm", type: "range", label: "Size of B", min: 0, max: 10, step: 1, nudge: 1, unit: "", lock: lk("bm") },
  { id: "ba", type: "range", label: "Direction of B", min: 0, max: 345, step: lv < 3 ? 45 : 15, nudge: lv < 3 ? 45 : 15, unit: "°", lock: lk("ba") }]; };
const st = o => Object.assign({ am: 5, aa: 0, bm: 3, ba: 90, target: null }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `R = (${fmt(Rv(s).x)}, ${fmt(Rv(s).y)}), size ${fmt(mag(s))}${mag(s) ? ", at " + fmt(ang(s)) + "°" : ""}.`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.target ? "🎯 Reach the star" : "➡️ Vector challenge", prompt: "Set the two vectors, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Add vectors tip-to-tail. Same direction: sizes add. Opposite: they subtract. At right angles: |R| = √(A² + B²). Components: x = size × cos θ, y = size × sin θ; add the x's and the y's." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("va-sim", diff, uses, mk);
const C = {
  ten: () => simQ(1, "A is 6 to the right. Choose B so the resultant is <b>10 to the right</b>.", st({ am: 6, aa: 0, bm: 2, ba: 180 }), s => ok(mag(s) === 10 && ang(s) === 0, "Same direction: 6 + 4 = 10.", said(s)), { bm: 4, ba: 0 }, { lock: ["am", "aa"], wrong: { bm: 4, ba: 180 } }),
  zero: () => simQ(1, "A is 7 upwards (90°). Make the resultant <b>zero</b>.", st({ am: 7, aa: 90, bm: 3, ba: 0 }), s => ok(mag(s) === 0, "Equal and opposite vectors cancel.", said(s)), { bm: 7, ba: 270 }, { lock: ["am", "aa"], wrong: { bm: 7, ba: 90 } }),
  left2: () => simQ(1, "A is 8 to the right. Choose B so the resultant is <b>2 to the left</b>.", st({ am: 8, aa: 0, bm: 1, ba: 0 }), s => ok(mag(s) === 2 && ang(s) === 180, "B = 10 to the left: 8 − 10 = −2.", said(s)), { bm: 10, ba: 180 }, { lock: ["am", "aa"], wrong: { bm: 6, ba: 180 } }),
  tug: () => simQ(1, "A tug of war: B pulls <b>left with 5</b>. Choose A so the rope moves <b>right with 3</b>.", st({ am: 2, aa: 0, bm: 5, ba: 180 }), s => ok(mag(s) === 3 && ang(s) === 0, "A = 8 right: 8 − 5 = 3.", said(s)), { am: 8, aa: 0 }, { lock: ["bm", "ba"], wrong: { am: 3, aa: 0 } }),
  five: () => simQ(2, "A is 3 to the right. Choose B <b>at a right angle</b> so the resultant is <b>5</b>.", st({ am: 3, aa: 0, bm: 1, ba: 0 }), s => ok(mag(s) === 5 && between(s) === 90, "B = 4 at 90° (or 270°): √(3² + 4²) = 5.", between(s) !== 90 ? "B must be at a right angle to A." : said(s)), { bm: 4, ba: 90 }, { lock: ["am", "aa"], wrong: { bm: 5, ba: 90 } }),
  ten68: () => simQ(2, "Make a resultant of <b>10</b> using two vectors <b>at right angles</b>, neither bigger than 9.", st({ am: 5, aa: 0, bm: 5, ba: 90 }), s => ok(mag(s) === 10 && between(s) === 90 && s.am <= 9 && s.bm <= 9, "6 and 8 at right angles: √(36 + 64) = 10.", between(s) !== 90 ? "Keep them at a right angle." : said(s)), { am: 6, aa: 0, bm: 8, ba: 90 }, { wrong: { am: 6, aa: 0, bm: 7, ba: 90 } }),
  ne: () => simQ(2, "A is 6 east (0°). Choose B so the resultant points exactly <b>north-east (45°)</b>.", st({ am: 6, aa: 0, bm: 3, ba: 90 }), s => ok(ang(s) === 45 && mag(s) > 0, "B = 6 north: equal x and y → 45°.", said(s)), { bm: 6, ba: 90 }, { lock: ["am", "aa"], wrong: { bm: 5, ba: 90 } }),
  sw: () => simQ(2, "Make a resultant of size <b>5</b> pointing <b>down and to the left</b> (both components negative), using right angles.", st({ am: 3, aa: 0, bm: 4, ba: 90 }), s => ok(mag(s) === 5 && Rv(s).x < 0 && Rv(s).y < 0, "e.g. 3 at 180° and 4 at 270°.", said(s)), { am: 3, aa: 180, bm: 4, ba: 270 }, { wrong: { am: 3, aa: 180, bm: 4, ba: 90 } }),
  star73: () => simQ(3, "Reach the <b>star at (7, 3)</b>: the resultant must end exactly on it.", st({ am: 5, aa: 0, bm: 5, ba: 90, target: { x: 7, y: 3 } }), s => ok(Rv(s).x === 7 && Rv(s).y === 3, "7 along x and 3 along y.", said(s)), { am: 7, aa: 0, bm: 3, ba: 90 }, { wrong: { am: 7, aa: 0, bm: 3, ba: 270 } }),
  flat: () => simQ(3, "A = 8 at 60°. Choose B so the resultant is <b>exactly horizontal</b> (no y-part) and not zero.", st({ am: 8, aa: 60, bm: 5, ba: 90 }), s => ok(Math.abs(Rv(s).y) < 0.05 && mag(s) > 0.05, "B = 8 at 300° cancels the y-part: R = (8, 0).", said(s)), { bm: 8, ba: 300 }, { lock: ["am", "aa"], wrong: { bm: 7, ba: 270 } }),
  equal120: () => simQ(3, "Two vectors of size <b>10</b> with <b>120°</b> between them. What is the resultant?", st({ am: 10, aa: 0, bm: 10, ba: 90 }), s => ok(between(s) === 120 && s.am === 10 && s.bm === 10, "|R| = 10: two equal vectors at 120° add to the same size.", between(s) !== 120 ? `The angle between them is ${between(s)}°.` : "Both must be 10."), { ba: 120 }, { lock: ["am", "bm"], wrong: { ba: 135 } }),
  star_n: () => simQ(3, "Reach the <b>star at (−6, 8)</b> using A along an axis and B along an axis.", st({ am: 5, aa: 0, bm: 5, ba: 0, target: { x: -6, y: 8 } }), s => ok(Rv(s).x === -6 && Rv(s).y === 8, "6 at 180° and 8 at 90° — a resultant of 10.", said(s)), { am: 6, aa: 180, bm: 8, ba: 90 }, { wrong: { am: 6, aa: 0, bm: 8, ba: 90 } })
};
const D = {
  pick: diff => E.diaT("va-pick", diff, 2, () => {
    if (diff === 1) {
      const pool = E.shuffle([[5, 0, 5, 180], [4, 0, 3, 90], [6, 90, 6, 270], [3, 0, 3, 0], [2, 180, 2, 0], [5, 90, 2, 270]]).slice(0, 4).map(c => st({ am: c[0], aa: c[1], bm: c[2], ba: c[3] }));
      if (!pool.some(s => mag(s) === 0)) pool[0] = st({ am: 5, aa: 0, bm: 5, ba: 180 });
      return { kind: "pick", many: true, title: "👆 Cancel out", prompt: "Click <b>every</b> pair of vectors whose resultant is <b>zero</b>.", answer: pool.map((s, i) => mag(s) === 0 ? "v" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((s, i) => ["v" + i, "pair " + "ABCD"[i]])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((s, i) => { const x = 15 + i * 212, cx = x + 98, cy = 140, k = 12, a = comp(s.am, s.aa), b = comp(s.bm, s.ba); return `<g class="pk" data-k="v${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${arrow(cx - 4, cy - 6, cx - 4 + a.x * k, cy - 6 - a.y * k, "#e53935", 4)}${arrow(cx + 4, cy + 6, cx + 4 + b.x * k, cy + 6 - b.y * k, "#1e88e5", 4)}${T(cx, 262, "A " + s.am + " · B " + s.bm, { s: 13, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["v" + i])}/></g>`; }).join("")}</svg>`,
        explain: "Only equal vectors pointing in exactly opposite directions cancel.", summary: "Zero resultant" };
    }
    const base = choice([st({ am: 6, aa: 0, bm: 4, ba: 90 }), st({ am: 4, aa: 90, bm: 5, ba: 0 }), st({ am: 5, aa: 180, bm: 3, ba: 90 })]), a = comp(base.am, base.aa), r = Rv(base);
    const cands = E.shuffle([[r.x, r.y, "ok"], [a.x - comp(base.bm, base.ba).x, a.y - comp(base.bm, base.ba).y, "sub"], [r.y, r.x, "swap"], [-r.x, -r.y, "neg"]]);
    return { kind: "pick", title: "👆 Which arrow is A + B?", prompt: "Red is A, blue is B. Click the purple arrow that shows the resultant <b>A + B</b>.", answer: ["ok"], names: { ok: "arrow", sub: "arrow", swap: "arrow", neg: "arrow" },
      visual: s2 => { const k = 14; let g = `<rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="10" width="200" height="280" rx="14" fill="#fff" stroke="#cfd8dc"/>${arrow(140, 150, 140 + a.x * k, 150 - a.y * k, "#e53935", 4)}${arrow(140 + a.x * k, 150 - a.y * k, 140 + r.x * k, 150 - r.y * k, "#1e88e5", 4)}${T(140, 280, "A then B", { s: 13, c: "#37474f" })}`;
        cands.forEach((c, i) => { const x = 270 + i * 140, cx = x + 64; g += `<g class="pk" data-k="${c[2]}"><rect x="${x}" y="10" width="128" height="280" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${arrow(cx, 150, cx + c[0] * 8, 150 - c[1] * 8, "#6a1b9a", 4)}${T(cx, 280, "ABCD"[i], { s: 15, c: "#37474f" })}<rect x="${x}" y="10" width="128" height="280" rx="14" fill="none" ${E.ring(s2[c[2]])}/></g>`; });
        return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}</svg>`; },
      explain: `The resultant goes from the start of A to the tip of B: (${fmt(r.x)}, ${fmt(r.y)}).`, summary: "Tip-to-tail" };
  }),
  num: diff => E.diaT("va-num", diff, 2, () => {
    if (diff === 1) { const c = choice([[3, 4], [6, 8], [5, 12], [8, 15]]);
      return { kind: "num", title: "🧮 Right-angle vectors", prompt: `You walk <b>${c[0]} m east</b> then <b>${c[1]} m north</b>.`, visual: render(st({ am: Math.min(10, c[0]), aa: 0, bm: Math.min(10, c[1]), ba: 90 })), fields: [{ label: "Displacement", unit: "m", answer: r2(Math.hypot(c[0], c[1])) }], explain: `√(${c[0]}² + ${c[1]}²) = ${fmt(r2(Math.hypot(c[0], c[1])))} m.`, summary: "Pythagoras" }; }
    if (diff === 2) { const c = choice([[10, 30], [8, 60], [6, 45], [10, 150]]), p = comp(c[0], c[1]);
      return { kind: "num", title: "🧮 Components", prompt: `A vector of size <b>${c[0]}</b> points at <b>${c[1]}°</b>.`, visual: render(st({ am: c[0], aa: c[1], bm: 0, ba: 0 })), fields: [{ label: "x-component", unit: "", answer: p.x, tol: 0.05 }, { label: "y-component", unit: "", answer: p.y, tol: 0.05 }], explain: `x = ${c[0]} cos ${c[1]}° = ${fmt(p.x)}; y = ${c[0]} sin ${c[1]}° = ${fmt(p.y)}.`, summary: "Resolving a vector" }; }
    const s = choice([st({ am: 4, aa: 0, bm: 4, ba: 90 }), st({ am: 3, aa: 0, bm: 3, ba: 120 }), st({ am: 5, aa: 90, bm: 5, ba: 180 })]);
    return { kind: "num", title: "🧮 Size and direction", prompt: `A = ${s.am} at ${s.aa}°, B = ${s.bm} at ${s.ba}°. Add the components.`, visual: render(s), fields: [{ label: "|R|", unit: "", answer: mag(s), tol: 0.05 }, { label: "Direction", unit: "°", answer: ang(s), tol: 1 }], explain: said(s), summary: "Adding by components" };
  }),
  mcq: diff => E.diaT("va-mcq", diff, 2, () => { const q = choice([
      { ask: "Two forces of 3 N and 4 N act on an object. The resultant could NOT be…", ok: "8 N", bad: ["1 N", "5 N", "7 N"], ex: "The resultant is between 4 − 3 = 1 N and 4 + 3 = 7 N." },
      { ask: "What is the difference between a vector and a scalar?", ok: "A vector has a size and a direction; a scalar has only a size", bad: ["A vector is always bigger", "A scalar has a direction", "There is no difference"], ex: "e.g. velocity (vector) vs speed (scalar)." },
      { ask: "A plane flies north while the wind blows east. Its path over the ground…", ok: "points somewhere between north and east", bad: ["is due north", "is due east", "is due south"], ex: "Add the two velocity vectors." },
      { ask: "Which of these is a vector quantity?", ok: "Displacement", bad: ["Distance", "Mass", "Temperature"], ex: "Displacement has a direction." }]);
    return { kind: "mcq", title: "📘 Vector ideas", prompt: "Think about size and direction.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Vectors" }; })
};
const LEVELS = {
  1: { intro: "Vectors have a size and a direction. Add them tip-to-tail: in a line they simply add or subtract.", pool: () => [S(1, 1, C.zero), S(2, 1, C.ten), S(2, 1, C.tug), S(3, 1, C.left2), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "At right angles, use Pythagoras: |R| = √(A² + B²).", pool: () => [S(1, 1, C.five), S(2, 1, C.ne), S(2, 1, C.ten68), S(3, 1, C.sw), D.pick(2), D.num(1), D.mcq(3)] },
  3: { intro: "Break vectors into x and y components, add them, and find the size and direction.", pool: () => [S(1, 1, C.star73), S(2, 1, C.star_n), S(3, 1, C.flat), S(3, 1, C.equal120), D.num(2), D.num(3), D.pick(3)] }
};
const explore = E.exploreSim({
  intro: "Set the size and direction of A and B. Press ▶ to see the resultant R = A + B.",
  state: () => st(), controls: () => ctls(3), render, run, runLabel: "▶ Add",
  goals: () => [{ txt: "Make the resultant zero", test: (s, m) => m.z }, { txt: "Make a 3-4-5 triangle", test: (s, m) => m.p }, { txt: "Make the resultant point left", test: (s, m) => m.l }],
  track: (s, m, ran) => { if (!ran) return; if (mag(s) === 0 && (s.am || s.bm)) m.z = 1; if (mag(s) === 5 && between(s) === 90) m.p = 1; if (Rv(s).x < 0) m.l = 1; },
  facts: () => "📘 <b>Vectors</b> (forces, velocities, displacements) add tip-to-tail — direction matters!"
});
E.start({ labId: "vectors", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🎯", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["➡️", "↗️", "🎯", "✨"],
  exploreDemo: () => [{ set: { am: 5, aa: 0, bm: 5, ba: 180 }, run: true }, { set: { am: 3, aa: 0, bm: 4, ba: 90 }, run: true }, { set: { am: 3, aa: 180, bm: 2, ba: 90 }, run: true }] });
})();
