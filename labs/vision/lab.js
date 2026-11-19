"use strict";
// ===== Color Vision — Science Lab 1971 =====
(function () {
const E = LabEngine, choice = E.choice, T = E.svgText;
const SET = { white: [1, 1, 1], red: [1, 0, 0], green: [0, 1, 0], blue: [0, 0, 1], yellow: [1, 1, 0], cyan: [0, 1, 1], magenta: [1, 0, 1], none: [1, 1, 1], black: [0, 0, 0] };
const mul = (a, b) => a.map((v, i) => v * b[i]);
function cname(r, g, b) { const M = Math.max(r, g, b); if (M <= 0) return "black"; const [x, y, z] = [r / M, g / M, b / M], hi = v => v > 0.9, lo = v => v < 0.1;
  if (hi(x) && hi(y) && hi(z)) return M >= 99 ? "white" : "grey";
  if (hi(x) && hi(y) && lo(z)) return "yellow"; if (hi(x) && hi(z) && lo(y)) return "magenta"; if (hi(y) && hi(z) && lo(x)) return "cyan";
  if (hi(x) && Math.abs(y - 0.5) < 0.1 && lo(z)) return "orange"; if (hi(x) && lo(y) && lo(z)) return "red"; if (hi(y) && lo(x) && lo(z)) return "green"; if (hi(z) && lo(x) && lo(y)) return "blue";
  return "a mixed colour"; }
const rgb = (r, g, b) => `rgb(${Math.round(r * 2.55)},${Math.round(g * 2.55)},${Math.round(b * 2.55)})`;
const seen = s => s.mode === 1 ? [s.R, s.G, s.B] : s.mode === 2 ? mul(SET[s.light], SET[s.filter]).map(v => v * 100) : mul(SET[s.light], OBJ[s.obj].refl).map(v => v * 100);
const OBJ = { apple: { n: "red apple", refl: [1, 0, 0] }, banana: { n: "yellow banana", refl: [1, 1, 0] }, leaf: { n: "green leaf", refl: [0, 1, 0] }, paper: { n: "white paper", refl: [1, 1, 1] }, shirt: { n: "blue shirt", refl: [0, 0, 1] } };
function head(x, y, col, show, label) {
  return `<g transform="translate(${x},${y})"><path d="M0,-70 C60,-70 85,-30 82,10 C80,30 92,40 100,56 C88,60 84,64 84,74 C84,96 70,104 50,104 L40,150 L-60,150 L-60,40 C-80,-10 -55,-70 0,-70 Z" fill="#ffe0b2" stroke="#8d6e63" stroke-width="3"/>
    <ellipse cx="62" cy="0" rx="13" ry="9" fill="#fff" stroke="#5d4037" stroke-width="2"/><circle cx="70" cy="0" r="5" fill="#3e2723"/></g>
    <g transform="translate(${x - 10},${y - 140})"><circle r="52" fill="#fff" stroke="#b0bec5" stroke-width="3"/><circle cx="40" cy="56" r="9" fill="#fff" stroke="#b0bec5" stroke-width="2"/><circle cx="52" cy="72" r="5" fill="#fff" stroke="#b0bec5" stroke-width="2"/>
      <circle r="36" fill="${show ? col : "#eceff1"}" stroke="#90a4ae" stroke-width="2"/>${show ? "" : T(0, 8, "?", { s: 26, c: "#90a4ae" })}</g>${show ? T(x - 10, y - 204, label, { s: 16, c: "#37474f" }) : ""}`;
}
function lamp(x, y, col, on, txt) { return `<g transform="translate(${x},${y})"><rect x="-34" y="-22" width="40" height="44" rx="8" fill="#455a64"/><path d="M6,-26 L30,-36 L30,36 L6,26 Z" fill="${on ? col : "#cfd8dc"}" stroke="#37474f" stroke-width="2"/>${T(-14, 42 + 8, txt, { s: 11, c: "#546e7a" })}</g>`; }
function beam(x1, y1, x2, y2, col, op) { return op > 0 ? `<polygon points="${x1},${y1 - 26} ${x1},${y1 + 26} ${x2},${y2 + 4} ${x2},${y2 - 4}" fill="${col}" opacity="${(0.15 + 0.55 * op).toFixed(2)}"/>` : ""; }
function render(s) {
  const show = s.reveal || s.showVals, [r, g, b] = seen(s), col = rgb(r, g, b), name = cname(r, g, b), ex = 640, ey = 250;
  let sc = "";
  if (s.mode === 1) { [["R", "#f44336", 110], ["G", "#4caf50", 230], ["B", "#2196f3", 350]].forEach(([k, c, y]) => { sc += beam(130, y, ex + 50, ey, c, s[k] / 100) + lamp(100, y, c, s[k] > 0, (k === "R" ? "red " : k === "G" ? "green " : "blue ") + s[k] + "%"); }); }
  else if (s.mode === 2) { const lc = rgb(...SET[s.light].map(v => v * 100)), fc = SET[s.filter], pass = rgb(r, g, b);
    sc += beam(130, 230, 330, 230, lc, 1) + (r + g + b > 0 ? beam(360, 230, ex + 50, ey, pass, 0.9) : "") + lamp(100, 230, lc, true, s.light + " light");
    sc += s.filter === "none" ? T(345, 190, "no filter", { s: 12, c: "#78909c" }) : `<rect x="330" y="170" width="26" height="120" rx="6" fill="${rgb(...fc.map(v => v * 100))}" opacity=".75" stroke="#455a64" stroke-width="2"/>${T(343, 160, s.filter + " filter", { s: 12, c: "#37474f" })}`; }
  else { const lc = rgb(...SET[s.light].map(v => v * 100)), o = OBJ[s.obj];
    sc += beam(130, 140, 330, 300, lc, 1) + lamp(100, 140, lc, true, s.light + " light") + (r + g + b > 0 ? beam(360, 300, ex + 50, ey, col, 0.8) : "");
    const oc = show ? col : rgb(...o.refl.map(v => v * 100));
    sc += s.obj === "apple" ? `<circle cx="340" cy="310" r="42" fill="${oc}" stroke="#333" stroke-width="2"/><path d="M340,268 q4,-16 14,-20" stroke="#5d4037" stroke-width="4" fill="none"/>`
      : s.obj === "banana" ? `<path d="M290,300 Q340,360 395,290 Q345,330 290,300 Z" fill="${oc}" stroke="#333" stroke-width="2"/>`
      : s.obj === "leaf" ? `<path d="M295,320 Q340,250 392,300 Q340,350 295,320 Z" fill="${oc}" stroke="#333" stroke-width="2"/>`
      : s.obj === "paper" ? `<rect x="300" y="268" width="80" height="96" fill="${oc}" stroke="#333" stroke-width="2"/>` : `<path d="M300,272 L325,262 L355,262 L380,272 L392,300 L376,306 L374,360 L306,360 L304,306 L288,300 Z" fill="${oc}" stroke="#333" stroke-width="2"/>`;
    sc += T(340, 390, show ? `${o.n} looks ${name}` : o.n, { s: 13, c: "#37474f" }); }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="450" fill="#1a1a2e"/><rect width="860" height="450" fill="#263238" opacity=".2"/>${sc}${head(ex, ey, col, show, "sees: " + name)}</svg>`.replace(/fill="#37474f"/g, 'fill="#eceff1"').replace(/fill="#546e7a"/g, 'fill="#cfd8dc"').replace(/fill="#78909c"/g, 'fill="#b0bec5"');
}
const LIGHTS = ["white", "red", "green", "blue"].map(v => ({ v, label: v[0].toUpperCase() + v.slice(1) }));
const ctlsFor = (mode, lock) => { const lk = k => lock && lock.includes(k) ? () => true : null;
  if (mode === 1) return ["R", "G", "B"].map(k => ({ id: k, type: "range", label: { R: "🔴 Red lamp", G: "🟢 Green lamp", B: "🔵 Blue lamp" }[k], min: 0, max: 100, step: 25, unit: "%", lock: lk(k) }));
  if (mode === 2) return [{ id: "light", type: "choice", label: "Lamp colour", options: LIGHTS, lock: lk("light") }, { id: "filter", type: "choice", label: "Filter", options: ["none", "red", "green", "blue", "yellow", "cyan", "magenta"].map(v => ({ v, label: v === "none" ? "No filter" : v[0].toUpperCase() + v.slice(1) })), wide: true, lock: lk("filter") }];
  return [{ id: "obj", type: "choice", label: "Object", options: Object.keys(OBJ).map(v => ({ v, label: OBJ[v].n })), wide: true, lock: lk("obj") }, { id: "light", type: "choice", label: "Light shining on it", options: LIGHTS, lock: lk("light") }];
};
const stFor = (mode, o) => Object.assign(mode === 1 ? { mode, R: 0, G: 0, B: 0 } : mode === 2 ? { mode, light: "white", filter: "none" } : { mode, obj: "apple", light: "white" }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 800); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const sees = s => cname(...seen(s));
const HINT = { 1: "Light mixing: red + green = yellow, red + blue = magenta, green + blue = cyan, all three = white.", 2: "A filter only lets through its own colour(s). Yellow = red + green, cyan = green + blue, magenta = red + blue.", 3: "An object reflects only its own colour(s) and absorbs the rest. If none of its colours is in the light, it looks black." };
const simQ = (mode, goal, s0, check, sol, o) => ({ title: { 1: "🌈 Colour mixing challenge", 2: "🔦 Filter challenge", 3: "🍎 Object colour challenge" }[mode], prompt: "Set the lights, then press <b>▶ Run & check</b> to see what the person sees.", goal,
  sim: { state: s0, controls: ctlsFor(mode, o && o.lock), render, run, check, hint: HINT[mode] }, solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("vis-sim", diff, uses, mk);
const C = {
  mix: () => { const c = choice([["yellow", { R: 100, G: 100, B: 0 }], ["cyan", { R: 0, G: 100, B: 100 }], ["magenta", { R: 100, G: 0, B: 100 }], ["white", { R: 100, G: 100, B: 100 }]]);
    return simQ(1, `Make the person see <b>${c[0]}</b> (full brightness).`, stFor(1), s => ok(sees(s) === c[0] && Math.max(s.R, s.G, s.B) === 100, `The person sees ${c[0]}.`, `The person sees ${sees(s)}.`), c[1], { wrong: Object.assign({}, c[1], { B: c[1].B ? 0 : 100 }) }); },
  black: () => simQ(1, "All lamps are on. Make the person see <b>black</b>.", stFor(1, { R: 100, G: 100, B: 100 }), s => ok(sees(s) === "black", "No light reaches the eye → black.", `The person sees ${sees(s)}.`), { R: 0, G: 0, B: 0 }, { wrong: { R: 0, G: 0, B: 25 } }),
  orange: () => simQ(1, "Make <b>orange</b>: full red with <b>half</b> as much green.", stFor(1), s => ok(sees(s) === "orange" && s.R === 100, "Red 100% + green 50% = orange.", `The person sees ${sees(s)}.`), { R: 100, G: 50, B: 0 }, { wrong: { R: 100, G: 100, B: 0 } }),
  grey: () => simQ(1, "Make <b>grey</b> (a dim white): all three lamps equal at <b>50%</b>.", stFor(1), s => ok(s.R === 50 && s.G === 50 && s.B === 50, "Equal red, green and blue at half brightness = grey.", `The person sees ${sees(s)}.`), { R: 50, G: 50, B: 50 }, { wrong: { R: 50, G: 50, B: 25 } }),
  yellowNoY: () => simQ(1, "There is no yellow lamp. Make <b>yellow</b> using exactly <b>two</b> lamps at full power.", stFor(1, { B: 100 }), s => ok(s.R === 100 && s.G === 100 && s.B === 0, "Red + green light = yellow (the eye's red and green cones are both stimulated).", `The person sees ${sees(s)}.`), { R: 100, G: 100, B: 0 }, { wrong: { R: 100, G: 0, B: 100 } }),
  fRed: () => simQ(2, "Use the <b>white lamp</b>. Choose a filter so the person sees <b>red</b>.", stFor(2), s => ok(sees(s) === "red", "The red filter absorbs green and blue, letting only red through.", `The person sees ${sees(s)}.`), { filter: "red" }, { lock: ["light"], wrong: { filter: "yellow" } }),
  fBlack: () => simQ(2, "The lamp is <b>green</b>. Choose a filter so <b>no light</b> gets through.", stFor(2, { light: "green" }), s => ok(sees(s) === "black", `A ${s.filter} filter does not let green through.`, `The person sees ${sees(s)}.`), { filter: "magenta" }, { lock: ["light"], wrong: { filter: "cyan" } }),
  fCyan: () => simQ(2, "Use the <b>cyan filter</b>. Choose a lamp colour so the person sees <b>blue</b>.", stFor(2, { filter: "cyan" }), s => ok(sees(s) === "blue", "Cyan lets green and blue through; with blue light only blue passes.", `The person sees ${sees(s)}.`), { light: "blue" }, { lock: ["filter"], wrong: { light: "red" } }),
  fYellow: () => simQ(2, "White lamp. Choose a filter that lets through <b>exactly two</b> colours of light, making <b>yellow</b>.", stFor(2), s => ok(sees(s) === "yellow", "Yellow filter: red + green pass, blue is absorbed.", `The person sees ${sees(s)}.`), { filter: "yellow" }, { lock: ["light"], wrong: { filter: "green" } }),
  bananaRed: () => simQ(3, "Make the <b>yellow banana</b> look <b>red</b>.", stFor(3, { obj: "banana" }), s => ok(sees(s) === "red", "In red light the banana reflects only red (it reflects red and green).", `It looks ${sees(s)}.`), { light: "red" }, { lock: ["obj"], wrong: { light: "white" } }),
  appleBlack: () => simQ(3, "Make the <b>red apple</b> look <b>black</b>.", stFor(3), s => ok(sees(s) === "black", "The apple only reflects red; with no red in the light it reflects nothing.", `It looks ${sees(s)}.`), { light: "green" }, { lock: ["obj"], wrong: { light: "red" } }),
  paperBlue: () => simQ(3, "Make the <b>white paper</b> look <b>blue</b>.", stFor(3, { obj: "paper" }), s => ok(sees(s) === "blue", "White reflects every colour, so it shows the colour of the light.", `It looks ${sees(s)}.`), { light: "blue" }, { lock: ["obj"], wrong: { light: "white" } }),
  bothBlack: () => simQ(3, "Choose an <b>object</b> and a <b>light</b> so the object looks <b>black</b>, but it would look <b>green</b> in white light.", stFor(3, { obj: "apple" }), s => ok(s.obj === "leaf" && sees(s) === "black", "The leaf only reflects green; red or blue light makes it black.", s.obj !== "leaf" ? "Which object looks green in white light?" : `It looks ${sees(s)}.`), { obj: "leaf", light: "red" }, { wrong: { obj: "leaf", light: "green" } }),
  shirt: () => simQ(3, "Choose the light that makes the <b>blue shirt</b> AND the <b>red apple</b> both look <b>black</b>. (Test with the shirt.)", stFor(3, { obj: "shirt" }), s => ok(s.light === "green", "Green light: the shirt (blue) and the apple (red) reflect none of it.", `The shirt looks ${sees(s)}; the apple would look ${cname(...mul(SET[s.light], OBJ.apple.refl).map(v => v * 100))}.`), { light: "green" }, { lock: ["obj"], wrong: { light: "red" } })
};

// ---------- diagram tasks ----------
function eye(st) { const z = (k, inner) => `<g class="pk" data-k="${k}">${inner}</g>`, R = k => E.ring(st[k]);
  return `<svg viewBox="0 0 860 330" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="330" fill="#fff7f9"/>
    <circle cx="430" cy="165" r="135" fill="#fff" stroke="#e57373" stroke-width="4"/>
    ${z("retina", `<path d="M480,40 A135,135 0 0 1 480,290" fill="none" stroke="#c62828" stroke-width="12"/><path d="M470,32 A140,140 0 0 1 470,298" fill="none" ${R("retina")}/>`)}
    ${z("nerve", `<path d="M560,150 L700,140 L700,190 L560,180 Z" fill="#ffcc80" stroke="#ef6c00" stroke-width="3"/><rect x="556" y="132" width="150" height="66" rx="10" fill="none" ${R("nerve")}/>`)}
    ${z("cornea", `<path d="M300,100 Q250,165 300,230" fill="#e3f2fd" stroke="#42a5f5" stroke-width="5"/><rect x="250" y="96" width="56" height="138" rx="20" fill="none" ${R("cornea")}/>`)}
    ${z("iris", `<rect x="318" y="88" width="14" height="52" rx="5" fill="#6d4c41"/><rect x="318" y="190" width="14" height="52" rx="5" fill="#6d4c41"/><rect x="312" y="82" width="26" height="166" rx="8" fill="none" ${R("iris")}/>`)}
    ${z("lens", `<ellipse cx="355" cy="165" rx="20" ry="46" fill="#bbdefb" stroke="#1e88e5" stroke-width="3"/><ellipse cx="355" cy="165" rx="26" ry="52" fill="none" ${R("lens")}/>`)}
    <path d="M80,130 L340,150 L560,190 M80,200 L340,180 L560,140" stroke="#ffb300" stroke-width="2" stroke-dasharray="6 5" fill="none"/>${T(110, 116, "light", { s: 12, c: "#ff8f00" })}</svg>`; }
const D = {
  eyePick: diff => E.diaT("vis-pick", diff, 2, () => { const q = choice([["retina", "the <b>retina</b> (cone cells detect colour here)"], ["lens", "the <b>lens</b> (focuses the light)"], ["cornea", "the <b>cornea</b> (clear front layer)"], ["iris", "the <b>iris</b> (controls how much light enters)"], ["nerve", "the <b>optic nerve</b> (sends signals to the brain)"]]);
    return { kind: "pick", title: "👁️ Parts of the eye", prompt: "Click " + q[1] + ".", answer: [q[0]], names: { retina: "retina", lens: "lens", cornea: "cornea", iris: "iris", nerve: "optic nerve" }, visual: st => eye(st),
      explain: "Light passes the cornea, through the pupil (in the iris), is focused by the lens onto the retina; the optic nerve carries the signals to the brain.", summary: "Parts of the eye" }; }),
  mixMcq: diff => E.diaT("vis-mcq", diff, 1, () => { const q = choice([
      { s: stFor(1, { R: 100, G: 100, B: 0, showVals: true }), ask: "Red light and green light reach the eye together. What colour is seen?", ok: "Yellow", bad: ["Brown", "Orange", "Black"], ex: "Light mixing is ADDITIVE: red + green = yellow." },
      { s: stFor(1, { R: 0, G: 100, B: 100, showVals: true }), ask: "Which two lights make cyan?", ok: "Green and blue", bad: ["Red and blue", "Red and green", "Blue and yellow"], ex: "Green + blue = cyan." },
      { s: stFor(1, { R: 100, G: 100, B: 100, showVals: true }), ask: "Which cells in the retina detect colour?", ok: "Cone cells", bad: ["Rod cells", "Nerve cells in the lens", "Red blood cells"], ex: "Cones (red, green and blue sensitive) detect colour; rods work in dim light." }]);
    return { kind: "mcq", title: "🌈 Light and colour", prompt: "Look at the lamps and the eye.", visual: render(q.s), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Additive colour mixing" }; }),
  objMcq: diff => E.diaT("vis-mcq", diff, 3, () => { const o = choice(["apple", "banana", "leaf", "paper"]), l = choice(["red", "green", "blue"]), s = stFor(3, { obj: o, light: l }); const ans = cname(...mul(SET[l], OBJ[o].refl).map(v => v * 100));
    return { kind: "mcq", title: "🍎 Predict the colour", prompt: `A ${OBJ[o].n} is lit by ${l} light.`, visual: render(s), ask: "What colour does it look?", options: E.mkOptions(ans, ["black", "red", "green", "blue", "yellow", "white"].filter(x => x !== ans).slice(0, 3)),
      explain: `The ${OBJ[o].n} reflects ${OBJ[o].refl.map((v, i) => v ? ["red", "green", "blue"][i] : null).filter(Boolean).join(" and ")} light. In ${l} light it looks ${ans}.`, summary: "Object colour in coloured light" }; }),
  filterNum: diff => E.diaT("vis-num", diff, 2, () => { const c = choice([["yellow", 2], ["red", 1], ["magenta", 2], ["cyan", 2], ["blue", 1]]);
    return { kind: "num", title: "🔦 Count the colours", prompt: `White light (red + green + blue) shines through a ${c[0]} filter.`, visual: render(stFor(2, { filter: c[0], showVals: true })),
      fields: [{ label: "How many of the 3 primary colours pass through?", unit: "", answer: c[1] }, { label: "How many are absorbed?", unit: "", answer: 3 - c[1] }], explain: `A ${c[0]} filter passes ${c[1]} primary colour(s) and absorbs ${3 - c[1]}.`, summary: "Filters absorb colours" }; })
};
const LEVELS = {
  1: { intro: "Mix red, green and blue light. What colour does the person see?", pool: () => [S(1, 1, C.black), S(1, 1, C.mix), S(2, 1, C.yellowNoY), S(2, 1, C.mix), S(3, 1, C.orange), S(3, 1, C.grey), D.mixMcq(1), D.eyePick(2), D.eyePick(3)] },
  2: { intro: "Filters: a coloured filter lets its own colour(s) through and absorbs the rest.", pool: () => [S(1, 1, C.fRed), S(2, 1, C.fCyan), S(2, 1, C.fBlack), S(3, 1, C.fYellow), D.mixMcq(1), D.filterNum(2), D.eyePick(3)] },
  3: { intro: "Why do objects have colours? They reflect some colours of light and absorb the others.", pool: () => [S(1, 1, C.paperBlue), S(2, 1, C.appleBlack), S(2, 1, C.bananaRed), S(3, 1, C.bothBlack), S(3, 1, C.shirt), D.filterNum(1), D.objMcq(2), D.objMcq(3)] }
};
const explore = E.exploreSim({
  intro: "Level 1: mix lamps. Level 2: use filters. Level 3: shine coloured light on objects. The thought bubble shows what the person sees.",
  state: lv => stFor(lv, { showVals: true }), controls: lv => ctlsFor(lv), render,
  goals: lv => lv === 1 ? [{ txt: "Make yellow", test: s => sees(s) === "yellow" }, { txt: "Make white", test: s => sees(s) === "white" }, { txt: "Make magenta", test: s => sees(s) === "magenta" }]
    : lv === 2 ? [{ txt: "Let only red through", test: s => sees(s) === "red" }, { txt: "Block all the light", test: s => sees(s) === "black" }]
    : [{ txt: "Make an object look black", test: s => sees(s) === "black" }, { txt: "Make the paper look a colour", test: s => s.obj === "paper" && s.light !== "white" }],
  facts: lv => lv === 1 ? "📘 <b>Primary colours of light</b>: red, green, blue. Red + green = yellow, green + blue = cyan, red + blue = magenta, all = white." : lv === 2 ? "📘 A <b>filter</b> transmits its own colour and <b>absorbs</b> the others." : "📘 An object <b>reflects</b> its own colour(s) and absorbs the rest."
});
E.start({ labId: "vision", total: 7, plan: { sim: 4, dia: 3 }, emoji: "👁️", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🌈", "👁️", "✨", "⭐"],
  exploreDemo: lv => lv === 1 ? [{ set: { R: 100, G: 100 } }, { set: { B: 100 } }, { set: { G: 0 } }] : lv === 2 ? [{ set: { filter: "red" } }, { set: { light: "green" } }] : [{ set: { light: "green" } }, { set: { obj: "paper", light: "blue" } }] });
})();
