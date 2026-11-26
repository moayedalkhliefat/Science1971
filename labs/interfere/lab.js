"use strict";
// ===== Wave Interference — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100, r3 = x => Math.round(x * 1000) / 1000;
const LW = 30, LL = 2; // water: screen 30 cm away; light: screen 2 m away
const spacing = s => s.mode === "water" ? r2(s.lam * LW / s.d) : r2(s.nm * LL / s.dmm / 1000); // cm or mm
const pos = s => s.mode === "water" ? s.y : s.ymm;
const order = s => r3(pos(s) / spacing(s)); // path difference in wavelengths
const I = s => Math.pow(Math.cos(Math.PI * order(s)), 2);
const kind = s => I(s) > 0.95 ? "bright" : I(s) < 0.05 ? "dark" : "in between";
function nmCol(l) { const st = [[400, [130, 0, 200]], [450, [40, 60, 255]], [500, [0, 200, 200]], [550, [60, 220, 0]], [600, [255, 190, 0]], [650, [255, 40, 0]], [700, [200, 0, 0]]]; for (let i = 1; i < st.length; i++) if (l <= st[i][0]) { const [a, ca] = st[i - 1], [b, cb] = st[i], t = (l - a) / (b - a); return ca.map((v, k) => Math.round(v + (cb[k] - v) * t)); } return [200, 0, 0]; }
function render(s) {
  const show = s.reveal, W = s.mode === "water", sp = spacing(s), py0 = 225, k = 9, sx0 = 70, scrX = 420;
  const col = W ? [21, 101, 192] : nmCol(s.nm);
  let g = `<rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  g += `<clipPath id="wc"><rect x="${sx0}" y="40" width="${scrX - sx0}" height="370"/></clipPath>`;
  const half = W ? s.d / 2 * k : 12 + s.dmm * 40;
  if (W) {
    g += `<rect x="${sx0}" y="40" width="${scrX - sx0}" height="370" fill="#e3f2fd"/><g clip-path="url(#wc)">`;
    for (const sy of [py0 - half, py0 + half]) for (let r = s.lam * k; r < 420; r += s.lam * k) g += `<circle cx="${sx0}" cy="${sy}" r="${r}" fill="none" stroke="#1e88e5" stroke-width="1.2" opacity=".45"/>`;
    g += `</g><circle cx="${sx0}" cy="${py0 - half}" r="6" fill="#0d47a1"/><circle cx="${sx0}" cy="${py0 + half}" r="6" fill="#0d47a1"/>${T(sx0 + 4, 34, "two dippers", { a: "start", s: 11, c: "#546e7a" })}`;
  } else {
    g += `<rect x="40" y="${py0 - 10}" width="60" height="20" rx="4" fill="#37474f"/><rect x="100" y="${py0 - 3}" width="90" height="6" fill="rgb(${col.join(",")})"/>${T(70, py0 - 18, "laser", { s: 11, c: "#546e7a" })}<rect x="190" y="60" width="8" height="330" fill="#455a64"/><rect x="190" y="${py0 - half - 3}" width="8" height="6" fill="#fff"/><rect x="190" y="${py0 + half - 3}" width="8" height="6" fill="#fff"/>${T(194, 52, "double slit", { s: 11, c: "#546e7a" })}`;
    if (show) for (let a = -0.5; a <= 0.5; a += 0.1) g += `<line x1="198" y1="${py0}" x2="${scrX}" y2="${py0 + a * 360}" stroke="rgb(${col.join(",")})" stroke-width="1" opacity=".25"/>`;
    g += T(300, 410, "(not to scale: screen 2 m away)", { s: 10, c: "#90a4ae" });
  }
  // screen intensity pattern
  g += `<rect x="${scrX}" y="45" width="26" height="360" fill="#263238"/>`;
  if (show) for (let p = -180; p <= 180; p += 2) { const yy = p / k, i = Math.pow(Math.cos(Math.PI * yy / sp), 2); g += `<rect x="${scrX + 2}" y="${py0 - p - 1}" width="22" height="2.2" fill="rgba(${col.join(",")},${(i * 0.95).toFixed(2)})"/>`; }
  for (let v = -20; v <= 20; v += 10) g += `<line x1="${scrX + 26}" y1="${py0 - v * k}" x2="${scrX + 34}" y2="${py0 - v * k}" stroke="#90a4ae"/>${T(scrX + 38, py0 - v * k + 4, v, { a: "start", s: 10, c: "#90a4ae" })}`;
  g += T(scrX + 13, 38, "screen", { s: 11, c: "#546e7a" }) + T(scrX + 60, 420, W ? "cm" : "mm", { s: 10, c: "#90a4ae" });
  const dy = py0 - pos(s) * k;
  g += `<path d="M${scrX - 14},${dy} l-12,-8 v16Z" fill="#ff7043"/><line x1="${scrX - 14}" y1="${dy}" x2="${scrX}" y2="${dy}" stroke="#ff7043" stroke-width="3"/>`;
  if (show) g += `<line x1="${W ? sx0 : 198}" y1="${py0 - half}" x2="${scrX}" y2="${dy}" stroke="#ef6c00" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="${W ? sx0 : 198}" y1="${py0 + half}" x2="${scrX}" y2="${dy}" stroke="#ef6c00" stroke-width="1.2" stroke-dasharray="4 3"/>`;
  const U = W ? "cm" : "mm";
  g += `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}
    ${T(120, 58, W ? `λ = ${s.lam} cm · d = ${s.d} cm · L = 30 cm` : `λ = ${s.nm} nm · d = ${s.dmm} mm · L = 2 m`, { s: 11, c: "#546e7a" })}
    ${show ? T(120, 96, "fringe spacing", { s: 12, c: "#78909c" }) + T(120, 124, fmt(sp) + " " + U, { s: 22, c: "#e65100" }) + T(120, 164, "detector at " + pos(s) + " " + U, { s: 13, c: "#37474f" }) + T(120, 190, "path difference = " + fmt(order(s)) + " λ", { s: 13, c: "#37474f" }) + T(120, 228, kind(s) === "bright" ? "☀️ BRIGHT (constructive)" : kind(s) === "dark" ? "🌑 DARK (destructive)" : "partly bright", { s: 14, c: kind(s) === "bright" ? "#f9a825" : kind(s) === "dark" ? "#37474f" : "#78909c" }) : T(120, 170, "?", { s: 26, c: "#90a4ae" })}
    ${T(120, 320, "spacing = λ × L ÷ d", { s: 14, c: "#37474f" })}${T(120, 346, "bright: path diff = 0, 1λ, 2λ…", { s: 10, c: "#90a4ae" })}${T(120, 362, "dark: path diff = ½λ, 1½λ…", { s: 10, c: "#90a4ae" })}</g>`;
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null, W = s => s.mode !== "water", L = s => s.mode !== "light"; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Waves", options: [{ v: "water", label: "Water ripples" }, { v: "light", label: "Light (double slit)" }] }] : []),
  { id: "lam", type: "choice", label: "Wavelength", options: [1, 2, 3].map(v => ({ v, label: v + " cm" })), hide: W, lock: lk("lam") },
  { id: "d", type: "choice", label: "Distance between sources", options: [3, 6, 9, 12].map(v => ({ v, label: v + " cm" })), hide: W, lock: lk("d") },
  { id: "y", type: "range", label: "Detector position", min: -20, max: 20, step: 1, nudge: 1, unit: "cm", hide: W, lock: lk("y") },
  { id: "nm", type: "range", label: "Light wavelength", min: 400, max: 700, step: 50, nudge: 50, unit: "nm", hide: L, lock: lk("nm") },
  { id: "dmm", type: "choice", label: "Slit separation", options: [0.1, 0.2, 0.25, 0.4, 0.5].map(v => ({ v, label: v + " mm" })), hide: L, lock: lk("dmm") },
  { id: "ymm", type: "range", label: "Detector position", min: -20, max: 20, step: 0.5, nudge: 0.5, unit: "mm", hide: L, lock: lk("ymm") }]; };
const st = o => Object.assign({ mode: "water", lam: 2, d: 6, y: 3, nm: 500, dmm: 0.2, ymm: 0 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const said = s => `Spacing ${fmt(spacing(s))} ${s.mode === "water" ? "cm" : "mm"}; at ${pos(s)}: ${kind(s)} (${fmt(order(s))} λ).`;
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "water" ? "🌊 Ripple challenge" : "🔦 Double-slit challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: "Bright where the waves arrive in step (path difference 0, 1λ, 2λ…); dark where they cancel (½λ, 1½λ…). Fringe spacing = λ × L ÷ d. Path difference at the detector = position ÷ spacing (in wavelengths)." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("wi-sim", diff, uses, mk);
const C = {
  dark: () => simQ(1, "Move the detector to a <b>dark</b> spot.", st({ y: 0 }), s => ok(kind(s) === "dark", "Path difference ½λ: crest meets trough.", said(s)), { y: 5 }, { lock: ["lam", "d"], wrong: { y: 10 } }),
  first: () => simQ(1, "Find the <b>first bright</b> spot <b>above</b> the centre.", st({ y: 3 }), s => ok(s.y === 10, "10 cm: path difference 1λ.", s.y <= 0 ? "Go above the centre." : said(s)), { y: 10 }, { lock: ["lam", "d"], wrong: { y: 20 } }),
  two: () => simQ(1, "Put the detector where the path difference is exactly <b>2 wavelengths</b> (above the centre).", st({ y: 4 }), s => ok(order(s) === 2, "20 cm: 2λ → bright.", said(s)), { y: 20 }, { lock: ["lam", "d"], wrong: { y: 15 } }),
  centre: () => simQ(1, "Put the detector where it is <b>always bright</b>, whatever λ and d are.", st({ y: 7 }), s => ok(s.y === 0, "The centre: both waves travel the same distance.", said(s)), { y: 0 }, { wrong: { y: 10 } }),
  sp5: () => simQ(2, "Make the bright fringes <b>5 cm apart</b>.", st({ lam: 3, d: 3 }), s => ok(spacing(s) === 5, "e.g. λ 1 cm, d 6 cm: 1 × 30 ÷ 6 = 5.", said(s)), { lam: 1, d: 6 }, { lock: ["y"], wrong: { lam: 2, d: 6 } }),
  sp15: () => simQ(2, "Change <b>only the wavelength</b> so the fringes are <b>15 cm</b> apart.", st({ lam: 1, d: 6 }), s => ok(spacing(s) === 15, "λ 3 cm: 3 × 30 ÷ 6 = 15.", said(s)), { lam: 3 }, { lock: ["d", "y"], wrong: { lam: 2 } }),
  dark10: () => simQ(2, "The detector is fixed at <b>10 cm</b>. Choose λ and d to make it <b>dark</b> there.", st({ lam: 2, d: 6, y: 10 }), s => ok(kind(s) === "dark", "e.g. λ 2 cm, d 3 cm: spacing 20 cm → 10 cm is half-way.", said(s)), { lam: 2, d: 3 }, { lock: ["y"], wrong: { lam: 2, d: 6 } }),
  tight: () => simQ(2, "Make the fringes as <b>close together</b> as possible.", st({ lam: 2, d: 6 }), s => ok(spacing(s) === 2.5, "Shortest λ (1 cm) and widest d (12 cm): 2.5 cm.", said(s)), { lam: 1, d: 12 }, { lock: ["y"], wrong: { lam: 1, d: 9 } }),
  red1: () => simQ(3, "Red light (<b>650 nm</b>), slits <b>0.2 mm</b> apart: find the <b>first bright fringe</b> above the centre.", st({ mode: "light", nm: 650, dmm: 0.2, ymm: 2 }), s => ok(s.ymm === 6.5, "Spacing = 650 nm × 2 m ÷ 0.2 mm = 6.5 mm.", said(s)), { ymm: 6.5 }, { lock: ["nm", "dmm"], wrong: { ymm: 6 } }),
  sp4: () => simQ(3, "With slits <b>0.25 mm</b> apart, choose the light that makes fringes <b>4 mm</b> apart.", st({ mode: "light", nm: 700, dmm: 0.25 }), s => ok(spacing(s) === 4, "500 nm: 500 × 2 ÷ 0.25 ÷ 1000 = 4 mm.", said(s)), { nm: 500 }, { lock: ["dmm", "ymm"], wrong: { nm: 550 } }),
  widest: () => simQ(3, "With slits <b>0.4 mm</b> apart, make the <b>widest</b> fringes possible.", st({ mode: "light", nm: 500, dmm: 0.4 }), s => ok(s.nm === 700, "Longest wavelength (700 nm, red) → widest fringes.", said(s)), { nm: 700 }, { lock: ["dmm", "ymm"], wrong: { nm: 650 } }),
  sp2: () => simQ(3, "Make light fringes exactly <b>2 mm</b> apart.", st({ mode: "light", nm: 650, dmm: 0.1 }), s => ok(spacing(s) === 2, "e.g. 500 nm with 0.5 mm, or 400 nm with 0.4 mm.", said(s)), { nm: 500, dmm: 0.5 }, { lock: ["ymm"], wrong: { nm: 500, dmm: 0.4 } })
};
const D = {
  pick: diff => E.diaT("wi-pick", diff, 2, () => {
    if (diff === 1) {
      const sp = 8, marks = [0, 4, 8, 12], want = choice(["bright", "dark"]);
      return { kind: "pick", many: true, title: "👆 Bright or dark?", prompt: `This screen pattern has fringes ${sp} cm apart. Click <b>every</b> mark on a <b>${want}</b> fringe.`, answer: marks.filter(m => (m / sp) % 1 === (want === "bright" ? 0 : 0.5)).map(m => "y" + m), names: Object.fromEntries(marks.map(m => ["y" + m, m + " cm"])),
        visual: s2 => { let g = `<rect width="860" height="300" fill="#f2f5f7"/><rect x="40" y="110" width="780" height="70" fill="#263238"/>`; for (let x = 0; x <= 780; x += 3) { const yy = (x - 100) / 30, i = Math.pow(Math.cos(Math.PI * yy / sp), 2); g += `<rect x="${40 + x}" y="112" width="3.2" height="66" fill="rgba(30,136,229,${(i * 0.95).toFixed(2)})"/>`; }
          marks.forEach((m, i) => { const x = 140 + m * 30; g += `<g class="pk" data-k="y${m}"><rect x="${x - 26}" y="70" width="52" height="170" fill="transparent"/><path d="M${x},100 l-9,-16 h18Z" fill="#ff7043"/>${T(x, 220, "ABCD"[i] + " (" + m + " cm)", { s: 14, c: "#37474f" })}<rect x="${x - 26}" y="70" width="52" height="170" rx="10" fill="none" ${E.ring(s2["y" + m])}/></g>`; });
          return `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg">${g}${T(140, 60, "centre", { s: 12, c: "#546e7a" })}</svg>`; },
        explain: "Bright at 0, 8, 16 cm (whole wavelengths); dark half-way between (4, 12 cm).", summary: "Fringe pattern" };
    }
    const pool = E.shuffle([[400, 0.2], [700, 0.2], [500, 0.5], [600, 0.1], [550, 0.25]]).slice(0, 4), want = choice(["wide", "narrow"]), sps = pool.map(p => r2(p[0] * 2 / p[1] / 1000)), best = want === "wide" ? Math.max(...sps) : Math.min(...sps);
    return { kind: "pick", title: "👆 Wide or narrow fringes?", prompt: `Click the set-up that gives the <b>${want === "wide" ? "widest" : "narrowest"}</b> fringes (screen 2 m away).`, answer: pool.map((p, i) => sps[i] === best ? "p" + i : null).filter(Boolean), names: Object.fromEntries(pool.map((p, i) => ["p" + i, p[0] + " nm, " + p[1] + " mm"])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/>${pool.map((p, i) => { const x = 15 + i * 212, c = nmCol(p[0]); return `<g class="pk" data-k="p${i}"><rect x="${x}" y="15" width="196" height="270" rx="14" fill="#fff" stroke="#cfd8dc" stroke-width="2"/><rect x="${x + 30}" y="60" width="136" height="80" rx="8" fill="rgb(${c.join(",")})" opacity=".85"/>${T(x + 98, 106, p[0] + " nm", { s: 18, c: "#fff" })}${T(x + 98, 186, "slits " + p[1] + " mm apart", { s: 14, c: "#37474f" })}<rect x="${x}" y="15" width="196" height="270" rx="14" fill="none" ${E.ring(s2["p" + i])}/></g>`; }).join("")}</svg>`,
      explain: "Spacing = λL ÷ d: " + pool.map((p, i) => `${p[0]}/${p[1]} → ${sps[i]} mm`).join(", ") + ".", summary: "Fringe spacing" };
  }),
  num: diff => E.diaT("wi-num", diff, 2, () => {
    if (diff === 1) { const c = choice([[2, 6], [1, 3], [3, 9], [2, 12]]);
      return { kind: "num", title: "🧮 Fringe spacing", prompt: `Water waves: λ = <b>${c[0]} cm</b>, sources <b>${c[1]} cm</b> apart, screen <b>30 cm</b> away.`, visual: render(st({ lam: c[0], d: c[1] })), fields: [{ label: "Fringe spacing", unit: "cm", answer: r2(c[0] * 30 / c[1]) }], explain: `${c[0]} × 30 ÷ ${c[1]} = ${fmt(r2(c[0] * 30 / c[1]))} cm.`, summary: "Spacing = λL/d" }; }
    if (diff === 2) { const c = choice([[600, 0.2], [450, 0.3], [500, 0.25], [700, 0.5]]);
      return { kind: "num", title: "🧮 Young's double slit", prompt: `Light of <b>${c[0]} nm</b> passes two slits <b>${c[1]} mm</b> apart. The screen is <b>2 m</b> away.`, visual: render(st({ mode: "light", nm: c[0] >= 400 && c[0] % 50 === 0 ? c[0] : 500, dmm: [0.1, 0.2, 0.25, 0.4, 0.5].includes(c[1]) ? c[1] : 0.2 })), fields: [{ label: "Fringe spacing", unit: "mm", answer: r2(c[0] * 2 / c[1] / 1000) }], explain: `${c[0]}×10⁻⁹ × 2 ÷ ${c[1]}×10⁻³ = ${fmt(r2(c[0] * 2 / c[1] / 1000))} mm.`, summary: "Double slit" }; }
    const c = choice([[5, 0.2], [3, 0.4], [6, 0.2], [2.4, 0.5]]);
    return { kind: "num", title: "🧮 Find the wavelength", prompt: `Fringes are <b>${c[0]} mm</b> apart, slits <b>${c[1]} mm</b> apart, screen <b>2 m</b> away. λ = spacing × d ÷ L.`, visual: render(st({ mode: "light", dmm: c[1] })), fields: [{ label: "Wavelength", unit: "nm", answer: r2(c[0] * c[1] / 2 * 1000) }], explain: `${c[0]} mm × ${c[1]} mm ÷ 2 m = ${fmt(r2(c[0] * c[1] / 2 * 1000))} nm.`, summary: "Measuring λ" };
  }),
  mcq: diff => E.diaT("wi-mcq", diff, 2, () => { const q = choice([
      { ask: "What makes a dark fringe?", ok: "Two waves arrive half a wavelength out of step and cancel", bad: ["The waves are blocked by the slits", "No waves reach that point", "The waves arrive in step"], ex: "Crest meets trough → destructive interference." },
      { ask: "What happens to the fringes if the slits are moved closer together?", ok: "They spread further apart", bad: ["They get closer together", "They disappear", "They change colour"], ex: "Spacing = λL ÷ d — smaller d, bigger spacing." },
      { ask: "Why did Young's double-slit experiment matter?", ok: "It showed light behaves as a wave", bad: ["It showed light is made of particles only", "It measured the speed of sound", "It proved atoms exist"], ex: "Only waves interfere to make fringes." },
      { ask: "Noise-cancelling headphones work by…", ok: "making a sound wave that cancels the noise (destructive interference)", bad: ["blocking all sound with thick padding", "making the noise louder", "changing the noise's colour"], ex: "An inverted copy of the noise cancels it." }]);
    return { kind: "mcq", title: "📘 Interference ideas", prompt: "Think about waves adding and cancelling.", visual: render(st({ reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Interference" }; })
};
const LEVELS = {
  1: { intro: "Two sources make overlapping waves. Where they meet in step it is bright; out of step, dark.", pool: () => [S(1, 1, C.centre), S(2, 1, C.dark), S(2, 1, C.first), S(3, 1, C.two), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "The fringe spacing depends on the wavelength and the source separation: spacing = λL ÷ d.", pool: () => [S(1, 1, C.sp15), S(2, 1, C.sp5), S(2, 1, C.tight), S(3, 1, C.dark10), D.pick(1), D.num(1), D.mcq(3)] },
  3: { intro: "Young's double slit: the same idea with light, in nanometres and millimetres.", pool: () => [S(1, 1, C.widest), S(2, 1, C.red1), S(3, 1, C.sp4), S(3, 1, C.sp2), D.num(2), D.pick(3), D.num(3)] }
};
const explore = E.exploreSim({
  intro: "Try water ripples or light through a double slit. Move the detector and change λ and d, then press ▶.",
  state: () => st(), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Make waves",
  goals: () => [{ txt: "Find a bright spot", test: (s, m) => m.b }, { txt: "Find a dark spot", test: (s, m) => m.d }, { txt: "Make fringes with light", test: (s, m) => m.l }],
  track: (s, m, ran) => { if (!ran) return; if (kind(s) === "bright") m.b = 1; if (kind(s) === "dark") m.d = 1; if (s.mode === "light") m.l = 1; },
  facts: () => "📘 <b>Interference</b> is proof that something is a wave: two waves can add up or cancel out."
});
E.start({ labId: "interfere", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🌊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🌊", "〰️", "💡", "✨"],
  exploreDemo: () => [{ set: { mode: "water", y: 0 }, run: true }, { set: { y: 5 }, run: true }, { set: { mode: "light" }, run: true }] });
})();
