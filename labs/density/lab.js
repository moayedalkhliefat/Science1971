"use strict";
// ===== Density & Buoyancy — Science Lab 1971 =====
(function () {
const E = LabEngine, esc = E.esc, fmt = E.fmt, choice = E.choice, T = E.svgText;
const LIQ = { water: { n: "Water", d: 1.0, c: "#4fa3e0" }, oil: { n: "Cooking oil", d: 0.9, c: "#e8c547" }, salt: { n: "Salt water", d: 1.2, c: "#6fc3c9" }, honey: { n: "Honey", d: 1.4, c: "#d98e1f" } };
const liqOpts = lv => (lv >= 2 ? ["water", "oil", "salt", "honey"] : ["water"]).map(k => ({ v: k, label: LIQ[k].n }));
const rho = s => s.m / s.V;
const state = (lv, o) => Object.assign({ m: 60, V: 100, liq: "water", showD: false }, o || {});

// ---------- the simulation picture ----------
function render(s) {
  const L = LIQ[s.liq], r = rho(s), side = Math.round(16 * Math.cbrt(s.V) + 18);
  const tx = 230, tw = 470, top = 40, bot = 410, surf = 150;
  let by, status, frac = Math.min(1, r / L.d);
  if (r < L.d - 1e-9) { by = surf - side * (1 - frac); status = "FLOATS"; }
  else if (r > L.d + 1e-9) { by = bot - side - 6; status = "SINKS"; }
  else { by = (surf + bot) / 2 - side / 2; status = "SUSPENDED"; }
  const bx = tx + tw / 2 - side / 2;
  const t = Math.max(0, Math.min(1, (r - 0.1) / 3));
  const col = `rgb(${Math.round(196 - 90 * t)},${Math.round(150 - 40 * t)},${Math.round(90 + 60 * t)})`;
  let s2 = `<svg viewBox="0 0 740 440" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="liq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L.c}" stop-opacity=".55"/><stop offset="1" stop-color="${L.c}" stop-opacity=".9"/></linearGradient>
    <linearGradient id="blk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".15" stop-color="#fff" stop-opacity=".05"/><stop offset=".85" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/></linearGradient></defs>
    <rect width="740" height="440" fill="#f4f8fc"/>
    <rect x="0" y="412" width="740" height="28" fill="#c9d6e3"/>
    <rect x="${tx}" y="${surf}" width="${tw}" height="${bot - surf}" fill="url(#liq)"/>
    <rect x="${bx}" y="${by}" width="${side}" height="${side}" rx="6" fill="${col}" stroke="#3b3b46" stroke-width="2.5"/>
    <rect x="${bx}" y="${by}" width="${side}" height="${side}" rx="6" fill="url(#blk)"/>
    ${T(bx + side / 2, by + side / 2 - 2, s.m + " g", { s: Math.max(12, side / 6), c: "#fff" })}${T(bx + side / 2, by + side / 2 + Math.max(13, side / 6), s.V + " cm³", { s: Math.max(11, side / 7), c: "#fff" })}
    <rect x="${tx}" y="${surf}" width="${tw}" height="${bot - surf}" fill="${L.c}" opacity=".18"/>
    <line x1="${tx}" y1="${surf}" x2="${tx + tw}" y2="${surf}" stroke="#1f6fb2" stroke-width="3" opacity=".7"/>
    <rect x="${tx - 8}" y="${top}" width="${tw + 16}" height="${bot - top + 8}" rx="10" fill="url(#glass)" stroke="#8aa4bd" stroke-width="5"/>
    ${T(tx + tw - 10, surf + 26, L.n + " · " + L.d.toFixed(1) + " g/cm³", { a: "end", s: 15, c: "#0b3d78" })}
    <g transform="translate(20,60)"><rect width="180" height="120" rx="14" fill="#1d1b4b"/>${T(90, 30, "BLOCK", { s: 13, c: "#b9b4ff" })}
      ${T(90, 62, s.m + " g", { s: 24, c: "#7dffb3" })}${T(90, 96, s.V + " cm³", { s: 22, c: "#7dffb3" })}</g>
    <g transform="translate(20,200)"><rect width="180" height="64" rx="14" fill="${status === "FLOATS" ? "#16a34a" : status === "SINKS" ? "#dc2626" : "#f59e0b"}"/>${T(90, 41, status, { s: 22, c: "#fff" })}</g>
    ${s.showD ? `<g transform="translate(20,284)"><rect width="180" height="64" rx="14" fill="#fff" stroke="#cbd5e1"/>${T(90, 24, "DENSITY", { s: 12, c: "#64748b" })}${T(90, 50, fmt(r) + " g/cm³", { s: 20, c: "#0b3d78" })}</g>` : ""}
    ${status === "FLOATS" && s.showD ? `${T(tx + tw - 10, by - 8, Math.round(frac * 100) + "% under the surface", { a: "end", s: 15, c: "#0b3d78" })}` : ""}
  </svg>`;
  return s2;
}
const ctls = (lv, o) => [
  { id: "m", type: "range", label: "Mass", min: 5, max: 400, step: 5, unit: "g", lock: o && o.lockM ? () => true : null },
  { id: "V", type: "range", label: "Volume", min: 10, max: 400, step: 5, unit: "cm³", lock: o && o.lockV ? () => true : null },
  { id: "liq", type: "choice", label: "Liquid", options: liqOpts(o && o.lv || lv), hide: () => (o && o.lv || lv) < 2, lock: o && o.lockL ? () => true : null }
];

// ---------- challenge builders ----------
function ch(diff, uses, mk) { return E.simT("dens-sim", diff, uses, function () { return mk(); }); }
const simQ = (goal, st, check, sol, o) => ({ title: "🧪 Density challenge", prompt: "Use the sliders to change the block, then check.", goal,
  sim: { state: st, controls: ctls(S1971Lab.level, o), render, check, hint: "density = mass ÷ volume. A block floats if its density is LESS than the liquid's." }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };

const C = {
  sink: () => simQ("Make the block <b>SINK</b> in water.", state(1), s => ok(rho(s) > 1 + 1e-9, `Density ${fmt(rho(s))} g/cm³ is more than water (1.0).`, `Density ${fmt(rho(s))} g/cm³ is not more than 1.0.`), { m: 200, V: 100 }, { wrong: { m: 50, V: 100 } }),
  float100: () => simQ("Use a mass of exactly <b>100 g</b> and make the block <b>FLOAT</b> in water.", state(1, { m: 100 }), s => ok(s.m === 100 && rho(s) < 1 - 1e-9, "It floats: its density is less than 1.0 g/cm³.", "Mass must be 100 g and density less than 1.0."), { m: 100, V: 200 }, { lockM: true, wrong: { V: 50 } }),
  target: () => { const d = choice([0.5, 2, 2.5, 0.25, 4]); const sol = d >= 1 ? { m: d * 50, V: 50 } : { m: 50, V: 50 / d };
    return simQ(`Build a block with a density of exactly <b>${d} g/cm³</b>.`, state(1), s => ok(E.near(rho(s), d, 1e-6), `${s.m} ÷ ${s.V} = ${fmt(rho(s))} g/cm³.`, `${s.m} ÷ ${s.V} = ${fmt(rho(s))} g/cm³, not ${d}.`), sol, { wrong: { m: sol.m + 5 } }); },
  frac: () => { const f = choice([0.5, 0.75, 0.25]); const sol = { m: 100 * f, V: 100 };
    return simQ(`Make the block float in water with exactly <b>${f * 100}%</b> of it under the surface.`, state(1), s => ok(E.near(rho(s), f, 1e-6), `Density ${fmt(rho(s))} = ${f * 100}% under water.`, `Density ${fmt(rho(s))} → ${Math.round(100 * Math.min(1, rho(s)))}% under water.`), sol, { wrong: { m: sol.m + 5 } }); },
  setV: () => { const m = choice([120, 150, 180]), f = choice([0.6, 0.75, 0.5]), V = m / f;
    return simQ(`The block's mass is <b>${m} g</b>. Set its <b>volume</b> so it floats with exactly <b>${f * 100}%</b> under water.`, state(1, { m }), s => ok(E.near(rho(s), f, 1e-6), `${m} ÷ ${s.V} = ${fmt(rho(s))} → ${f * 100}% under.`, `${m} ÷ ${s.V} = ${fmt(rho(s))}, need ${f}.`), { V }, { lockM: true, wrong: { V: V + 10 } }); },
  liquid: () => simQ("This block has mass <b>110 g</b> and volume <b>100 cm³</b>. Make it <b>FLOAT</b> by changing only the liquid.", state(2, { m: 110, V: 100 }), s => ok(LIQ[s.liq].d > 1.1, `${LIQ[s.liq].n} (${LIQ[s.liq].d}) is denser than the block (1.1).`, `${LIQ[s.liq].n} (${LIQ[s.liq].d}) is not denser than 1.1.`), { liq: "honey" }, { lockM: true, lockV: true, lv: 2, wrong: { liq: "oil" } }),
  between: () => { const c = choice([{ lo: 1.0, hi: 1.4, a: "honey", b: "water", sol: { m: 120, V: 100 } }, { lo: 0.9, hi: 1.0, a: "water", b: "oil", sol: { m: 95, V: 100 } }, { lo: 1.2, hi: 1.4, a: "honey", b: "salt water", sol: { m: 130, V: 100 } }]);
    return simQ(`Make a block that <b>floats in ${c.a}</b> but <b>sinks in ${c.b}</b>.`, state(2), s => ok(rho(s) > c.lo + 1e-9 && rho(s) < c.hi - 1e-9, `Density ${fmt(rho(s))} is between ${c.lo} and ${c.hi}.`, `Density ${fmt(rho(s))} must be between ${c.lo} and ${c.hi}.`), c.sol, { lv: 2, wrong: { m: 50 } }); },
  fracLiq: () => { const c = choice([{ liq: "salt", f: 0.5 }, { liq: "oil", f: 0.8 }, { liq: "honey", f: 0.75 }]); const d = LIQ[c.liq].d * c.f;
    return simQ(`In <b>${LIQ[c.liq].n}</b> (${LIQ[c.liq].d} g/cm³), make the block float with exactly <b>${c.f * 100}%</b> under the surface.`, state(2, { liq: c.liq }), s => ok(E.near(rho(s), d, 1e-6), `Block density ${fmt(rho(s))} = ${c.f} × ${LIQ[c.liq].d}.`, `Block density ${fmt(rho(s))}, needed ${fmt(d)} (= ${c.f} × ${LIQ[c.liq].d}).`), { m: d * 100, V: 100 }, { lockL: true, lv: 2, wrong: { m: d * 100 + 5 } }); },
  twoOfFour: () => simQ("Make a block that floats in <b>exactly 2</b> of the 4 liquids.", state(3), s => { const n = Object.values(LIQ).filter(l => rho(s) < l.d - 1e-9).length; return ok(n === 2, `It floats in salt water and honey only (density ${fmt(rho(s))}).`, `It floats in ${n} liquids (density ${fmt(rho(s))}).`); }, { m: 110, V: 100 }, { lv: 3, wrong: { m: 50 } }),
  heaviest: () => simQ("Volume is fixed at <b>100 cm³</b> in <b>salt water</b>. Make the block as <b>heavy as possible</b> while it still floats.", state(3, { V: 100, liq: "salt" }), s => ok(s.m === 115, "115 g → density 1.15, just below 1.2.", `${s.m} g is not the heaviest floating mass (115 g).`), { m: 115 }, { lockV: true, lockL: true, lv: 3, wrong: { m: 125 } })
};

// ---------- diagram tasks ----------
function cyl(x, level, obj, label) {
  const top = 40, h = 300, y = v => top + h - v * h / 100;
  let s = `<g transform="translate(${x},0)"><rect x="0" y="${top}" width="90" height="${h}" rx="8" fill="#fff" stroke="#8aa4bd" stroke-width="4"/>
    <rect x="4" y="${y(level)}" width="82" height="${top + h - y(level) - 4}" fill="#4fa3e0" opacity=".6"/>`;
  for (let v = 0; v <= 100; v += 10) s += `<line x1="62" x2="88" y1="${y(v)}" y2="${y(v)}" stroke="#334" stroke-width="2"/>${v % 20 === 0 ? T(54, y(v) + 5, v, { a: "end", s: 13 }) : ""}`;
  for (let v = 0; v <= 100; v += 2) s += `<line x1="76" x2="88" y1="${y(v)}" y2="${y(v)}" stroke="#334" stroke-width="1"/>`;
  if (obj) s += `<rect x="28" y="${top + h - 44}" width="32" height="32" rx="4" fill="#8d6e63" stroke="#333"/>`;
  return s + T(45, top + h + 30, label, { s: 15 }) + T(45, 28, "mL", { s: 13, c: "#64748b" }) + `</g>`;
}
const D = {
  readDensity: diff => E.diaT("dens-num", diff, 2, () => {
    const pick = choice([{ m: 54, v: 20, n: "aluminium" }, { m: 79, v: 10, n: "iron" }, { m: 19, v: 10, n: "?" }, { m: 112, v: 14, n: "?" }, { m: 26, v: 10, n: "glass" }]);
    const v0 = choice([40, 50, 60]);
    const vis = `<svg viewBox="0 0 740 400" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="400" fill="#f4f8fc"/>
      <g transform="translate(40,120)"><rect width="200" height="110" rx="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="3"/><rect x="30" y="20" width="140" height="44" rx="6" fill="#1d1b4b"/>${T(100, 52, pick.m + ".0 g", { s: 24, c: "#7dffb3" })}${T(100, 95, "Balance", { s: 15 })}
      <rect x="80" y="-34" width="40" height="34" rx="4" fill="#8d6e63" stroke="#333"/></g>
      ${cyl(330, v0, false, "Before")}${cyl(530, v0 + pick.v, true, "After")}</svg>`;
    return { kind: "num", title: "⚖️ Measure the density", prompt: "Use the balance and the measuring cylinders to find the object's volume and density. (1 mL = 1 cm³)",
      visual: vis, fields: [{ label: "Volume of object", unit: "cm³", answer: pick.v }, { label: "Density", unit: "g/cm³", answer: pick.m / pick.v }],
      explain: `Volume = ${v0 + pick.v} − ${v0} = ${pick.v} cm³. Density = ${pick.m} ÷ ${pick.v} = ${fmt(pick.m / pick.v)} g/cm³.`, summary: "Measure mass and volume → density" };
  }),
  whichFloat: diff => E.diaT("dens-pick", diff, 2, () => {
    const blocks = E.shuffle([{ m: 40, v: 50 }, { m: 120, v: 100 }, { m: 90, v: 100 }, { m: 300, v: 150 }, { m: 30, v: 60 }, { m: 70, v: 50 }]).slice(0, 4);
    const liq = diff >= 3 ? "salt" : "water", ld = LIQ[liq].d;
    const ans = blocks.map((b, i) => b.m / b.v < ld ? "b" + i : null).filter(Boolean);
    if (!ans.length) { blocks[0] = { m: 40, v: 80 }; ans.push("b0"); }
    return { kind: "pick", many: true, title: "👆 Which will float?", prompt: `Click <b>every</b> block that will <b>float</b> in ${LIQ[liq].n.toLowerCase()} (${ld} g/cm³).`,
      answer: blocks.map((b, i) => b.m / b.v < ld ? "b" + i : null).filter(Boolean), names: Object.fromEntries(blocks.map((b, i) => ["b" + i, `${b.m} g / ${b.v} cm³`])),
      visual: st => `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#f4f8fc"/>${blocks.map((b, i) => {
        const x = 40 + i * 175; return `<g class="pk" data-k="b${i}"><rect x="${x}" y="40" width="150" height="200" rx="16" fill="#fff" ${E.ring(st["b" + i])}/>
          <rect x="${x + 35}" y="70" width="80" height="80" rx="8" fill="#a1887f" stroke="#333" stroke-width="2"/>${T(x + 75, 185, b.m + " g", { s: 20 })}${T(x + 75, 215, b.v + " cm³", { s: 18, c: "#475569" })}</g>`; }).join("")}</svg>`,
      explain: "Work out density = mass ÷ volume for each block; it floats if its density is less than the liquid's.", summary: "Click the blocks that float" };
  }),
  ice: diff => E.diaT("dens-mcq", diff, 1, () => ({ kind: "mcq", title: "🧊 Explain the picture", prompt: "Look at the ice cube floating in water.",
    visual: `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#f4f8fc"/><rect x="170" y="110" width="400" height="170" fill="#4fa3e0" opacity=".6"/><rect x="320" y="70" width="100" height="100" rx="10" fill="#e3f2fd" stroke="#90caf9" stroke-width="4"/><line x1="170" y1="110" x2="570" y2="110" stroke="#1f6fb2" stroke-width="3"/>${T(560, 100, "about 90% under water", { a: "end", s: 15, c: "#0b3d78" })}</svg>`,
    ask: "Why does the ice float, with about 90% under the surface?", options: E.mkOptions("Ice (0.9 g/cm³) is slightly less dense than water (1.0 g/cm³)", ["Ice is lighter than air", "Cold things always float", "Ice is denser than water"]),
    explain: "The fraction under water equals block density ÷ liquid density = 0.9 ÷ 1.0 = 90%.", summary: "Why ice floats" })),
  fracRead: diff => E.diaT("dens-num", diff, 2, () => {
    const c = choice([{ liq: "water", f: 0.6 }, { liq: "water", f: 0.4 }, { liq: "salt", f: 0.5 }, { liq: "honey", f: 0.5 }]); const L = LIQ[c.liq];
    const vis = `<svg viewBox="0 0 740 340" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="340" fill="#f4f8fc"/><rect x="170" y="130" width="400" height="190" fill="${L.c}" opacity=".6"/>
      <rect x="320" y="${130 - 150 * (1 - c.f)}" width="150" height="150" fill="#bcaaa4" stroke="#333" stroke-width="2"/>
      ${Array.from({ length: 9 }, (_, i) => `<line x1="320" x2="470" y1="${130 - 150 * (1 - c.f) + (i + 1) * 15}" y2="${130 - 150 * (1 - c.f) + (i + 1) * 15}" stroke="#5d4037" stroke-width="1" stroke-dasharray="4 4"/>`).join("")}
      <line x1="170" y1="130" x2="570" y2="130" stroke="#1f6fb2" stroke-width="3"/>${T(560, 312, `${L.n}: ${L.d} g/cm³`, { a: "end", s: 15, c: "#0b3d78" })}${T(480, 70, "10 equal parts →", { a: "start", s: 13, c: "#64748b" })}</svg>`;
    return { kind: "num", title: "📐 Read the floating block", prompt: "The block is split into 10 equal parts. Use the picture to find the block's density.", visual: vis,
      fields: [{ label: "Fraction under the surface", unit: "%", answer: c.f * 100 }, { label: "Block density", unit: "g/cm³", answer: c.f * L.d }],
      explain: `${c.f * 100}% under → block density = ${c.f} × ${L.d} = ${fmt(c.f * L.d)} g/cm³.`, summary: "Density from the floating fraction" };
  }),
  ship: diff => E.diaT("dens-mcq", diff, 1, () => ({ kind: "mcq", title: "🚢 Explain the picture", prompt: "A huge steel ship floats, but a small steel bolt sinks.",
    visual: `<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="300" fill="#e3f2fd"/><rect y="170" width="740" height="130" fill="#4fa3e0" opacity=".7"/><path d="M120,150 L520,150 L470,215 L170,215 Z" fill="#455a64"/><rect x="230" y="105" width="160" height="45" fill="#eceff1" stroke="#455a64" stroke-width="3"/><rect x="620" y="262" width="26" height="14" fill="#455a64"/>${T(633, 250, "bolt", { s: 14 })}</svg>`,
    ask: "Why does the ship float?", options: E.mkOptions("Its hollow shape holds a lot of air, so its average density is less than water", ["Steel is less dense than water", "The ship is lighter than the bolt", "Salt water pushes all metal up"]),
    explain: "Average density = total mass ÷ total volume; the air inside makes the ship's average density lower than water's.", summary: "Why a steel ship floats" })),
  column: diff => E.diaT("dens-pick", diff, 1, () => {
    const d = choice([1.1, 0.95, 1.3]), ans = d < 1 ? "oil" : d < 1.2 ? "water" : "honey";
    return { kind: "pick", many: false, title: "🧪 Density column", prompt: `An object with density <b>${d} g/cm³</b> is dropped into this density column. Click the layer where it will <b>stop</b>.`, answer: [ans],
      names: { oil: "between oil and water (top of water)", water: "on top of the honey (in the water layer)", honey: "on the honey / bottom of honey layer" },
      visual: st => `<svg viewBox="0 0 740 380" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="380" fill="#f4f8fc"/>
        <g class="pk" data-k="oil"><rect x="250" y="40" width="240" height="100" fill="#e8c547" opacity=".8" ${E.ring(st.oil)}/>${T(370, 98, "Oil 0.9", { s: 18 })}</g>
        <g class="pk" data-k="water"><rect x="250" y="140" width="240" height="100" fill="#4fa3e0" opacity=".8" ${E.ring(st.water)}/>${T(370, 198, "Water 1.0", { s: 18, c: "#fff" })}</g>
        <g class="pk" data-k="honey"><rect x="250" y="240" width="240" height="100" fill="#d98e1f" opacity=".9" ${E.ring(st.honey)}/>${T(370, 298, "Honey 1.4", { s: 18, c: "#fff" })}</g></svg>`,
      explain: `An object sinks through every layer that is LESS dense than it (${d}) and floats on the first layer that is MORE dense. `, summary: "Density column" };
  })
};

// ---------- levels ----------
const LEVELS = {
  1: { intro: "What is density? Build blocks and test if they float or sink in water.", pool: () => [
    ch(1, 1, C.sink), ch(1, 1, C.float100), ch(2, 2, C.target), ch(3, 2, C.frac), ch(3, 1, C.setV),
    D.ice(1), D.readDensity(2), D.whichFloat(3) ] },
  2: { intro: "Different liquids have different densities. Make blocks that float in one liquid but sink in another.", pool: () => [
    ch(1, 1, C.liquid), ch(2, 2, C.between), ch(2, 1, C.target), ch(3, 2, C.fracLiq), ch(3, 1, C.setV),
    D.ship(1), D.readDensity(2), D.column(2), D.whichFloat(3) ] },
  3: { intro: "Precise buoyancy: use density = mass ÷ volume and the floating fraction to hit exact targets.", pool: () => [
    ch(1, 1, C.target), ch(2, 1, C.twoOfFour), ch(2, 1, C.fracLiq), ch(3, 1, C.heaviest), ch(3, 1, C.setV),
    D.readDensity(1), D.fracRead(2), D.column(3), D.whichFloat(3) ] }
};

const explore = E.exploreSim({
  intro: "Change the mass and the volume of the block (and the liquid in higher levels). Watch when it floats or sinks.",
  state: lv => state(lv, { showD: true }), controls: lv => ctls(lv), render,
  goals: lv => [
    { txt: "Make the block float", test: s => rho(s) < LIQ[s.liq].d - 1e-9 },
    { txt: "Make the block sink", test: s => rho(s) > LIQ[s.liq].d + 1e-9 },
    { txt: "Make a block with density exactly 1.0 g/cm³", test: s => E.near(rho(s), 1) }
  ].concat(lv >= 2 ? [{ txt: "Test 3 different liquids", test: (s, m) => (m.liqs || new Set()).size >= 3 }] : [])
   .concat(lv >= 3 ? [{ txt: "Float a block with exactly half of it under water", test: s => s.liq === "water" && E.near(rho(s), 0.5) }] : []),
  track: (s, m) => { (m.liqs = m.liqs || new Set()).add(s.liq); },
  facts: () => "📘 <b>density = mass ÷ volume</b> (g/cm³). An object floats if its density is <b>less</b> than the liquid's. Fraction under the surface = object density ÷ liquid density."
});

E.start({
  labId: "density", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🧊", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🧊", "⭐", "💧", "✨"],
  exploreDemo: lv => [{ set: { m: 50, V: 100 } }, { set: { m: 200 } }, { set: { m: 100 } }, { set: { liq: "oil" } }, { set: { liq: "salt" } }, { set: { liq: "water", m: 50 } }]
});
})();
