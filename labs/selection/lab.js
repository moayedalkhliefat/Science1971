"use strict";
// ===== Natural Selection — Science Lab 1971 =====
(function () {
const E = LabEngine, choice = E.choice, T = E.svgText;
const TYPES = ["bs", "bl", "ws", "wl"];
function history(s) {
  const fw = s.furMut ? 0.2 : 0, tl = s.teethMut ? 0.2 : 0;
  let c = { bs: 20 * (1 - fw) * (1 - tl), bl: 20 * (1 - fw) * tl, ws: 20 * fw * (1 - tl), wl: 20 * fw * tl };
  const cap = s.food === "limited" ? 60 : 200, h = [c];
  for (let g = 0; g < s.gens; g++) { const n = {}; let tot = 0;
    TYPES.forEach(k => { const match = (k[0] === "w") === (s.env === "arctic"); const sf = s.wolves ? (match ? 0.9 : 0.4) : 1, stt = s.food === "limited" ? (k[1] === "l" ? 0.9 : 0.5) : 1; n[k] = c[k] * sf * stt * 2; tot += n[k]; });
    if (tot > cap) TYPES.forEach(k => n[k] *= cap / tot); c = n; h.push(c); }
  return h;
}
const tot = c => c.bs + c.bl + c.ws + c.wl;
const white = c => (c.ws + c.wl) / tot(c), longT = c => (c.bl + c.wl) / tot(c), brown = c => 1 - white(c);
const end = s => { const h = history(s); return h[h.length - 1]; };
const pc = x => Math.round(x * 1000) / 10 + "%";
const rnd = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function bunny(x, y, k, sc) {
  const w = k[0] === "w", col = w ? "#f7f7f7" : "#8d6e63", st = w ? "#9e9e9e" : "#5d4037";
  return `<g transform="translate(${x},${y}) scale(${sc || 1})"><ellipse cx="0" cy="0" rx="15" ry="11" fill="${col}" stroke="${st}" stroke-width="1.5"/><circle cx="-14" cy="2" r="4" fill="${col}" stroke="${st}"/>
    <ellipse cx="9" cy="-19" rx="3.5" ry="10" fill="${col}" stroke="${st}" stroke-width="1.5" transform="rotate(10 9 -19)"/><ellipse cx="15" cy="-18" rx="3.5" ry="10" fill="${col}" stroke="${st}" stroke-width="1.5" transform="rotate(25 15 -18)"/>
    <circle cx="13" cy="-6" r="8.5" fill="${col}" stroke="${st}" stroke-width="1.5"/><circle cx="16" cy="-8" r="1.6" fill="#212121"/>${k[1] === "l" ? `<rect x="17" y="-2" width="3" height="7" fill="#fff" stroke="#757575" stroke-width="1"/>` : ""}</g>`;
}
const wolf = (x, y, f) => `<g transform="translate(${x},${y}) scale(${f},1)"><path d="M-30,0 Q-30,-14 -8,-15 L14,-15 L24,-26 L28,-16 L38,-12 L30,-4 L14,-4 L12,10 L6,10 L4,-2 L-18,-2 L-20,10 L-26,10 L-26,-2 Q-36,-6 -44,-16 Q-34,-4 -30,0 Z" fill="#546e7a" stroke="#37474f" stroke-width="1.5"/><circle cx="27" cy="-17" r="1.6" fill="#ffeb3b"/></g>`;
function scene(s, c, w, h) {
  const arc = s.env === "arctic", R = rnd(11), n = Math.max(0, Math.min(26, Math.round(tot(c) / 4) || (tot(c) > 0.5 ? 1 : 0)));
  let g = arc ? `<rect width="${w}" height="${h}" fill="#e3f2fd"/><path d="M0,${h * 0.38} L${w * 0.2},${h * 0.2} L${w * 0.38},${h * 0.36} L${w * 0.6},${h * 0.16} L${w * 0.82},${h * 0.34} L${w},${h * 0.22} L${w},${h} L0,${h} Z" fill="#cfe3f3"/><rect y="${h * 0.42}" width="${w}" height="${h * 0.58}" fill="#fbfdff"/>`
    : `<rect width="${w}" height="${h}" fill="#e8f5e9"/><circle cx="${w - 60}" cy="50" r="28" fill="#ffd54f"/><rect y="${h * 0.42}" width="${w}" height="${h * 0.58}" fill="#8d6e48"/><rect y="${h * 0.42}" width="${w}" height="${h * 0.58}" fill="#7c5a3a" opacity=".55"/>`;
  const plants = s.food === "limited" ? 3 : 9; for (let i = 0; i < plants; i++) { const px = 30 + R() * (w - 60), py = h * 0.48 + R() * h * 0.45; g += arc ? `<path d="M${px},${py} l-8,10 h16 Z" fill="#81c784"/>` : `<circle cx="${px}" cy="${py}" r="9" fill="#66bb6a"/><circle cx="${px + 8}" cy="${py + 3}" r="7" fill="#43a047"/>`; }
  const mix = []; TYPES.forEach(k => { const m = Math.round(n * c[k] / Math.max(1e-9, tot(c))); for (let i = 0; i < m; i++) mix.push(k); });
  mix.slice(0, 26).forEach((k, i) => { g += bunny(40 + R() * (w - 90), h * 0.5 + R() * h * 0.42, k, 1); });
  if (s.wolves) g += wolf(w * 0.25, h * 0.47, 1) + wolf(w * 0.75, h * 0.5, -1);
  return g;
}
function graph(s, hist, upto, w, h) {
  const all = hist.flatMap(c => [tot(c)]), top = [20, 40, 100, 200].find(v => v >= Math.max(...all)) || 200;
  const X = g => 46 + g * (w - 60) / 10, Y = v => h - 30 - v / top * (h - 54);
  let g = `<rect width="${w}" height="${h}" rx="12" fill="#fff" stroke="#c8e6c9" stroke-width="2"/>`;
  for (let i = 0; i <= 4; i++) { const v = top * i / 4; g += `<line x1="46" x2="${w - 14}" y1="${Y(v)}" y2="${Y(v)}" stroke="#edf3ee"/>${T(40, Y(v) + 4, v, { a: "end", s: 11, c: "#78909c" })}`; }
  for (let i = 0; i <= 10; i++) g += T(X(i), h - 12, i, { s: 11, c: "#78909c" });
  g += T(w / 2 + 20, 18, "population · generation →", { s: 12, c: "#546e7a" });
  const line = (f, col, dash) => `<polyline points="${hist.slice(0, upto + 1).map((c, i) => X(i) + "," + Y(f(c)).toFixed(1)).join(" ")}" fill="none" stroke="${col}" stroke-width="3.5" ${dash ? 'stroke-dasharray="7 4"' : ""}/>`;
  g += line(tot, "#2e7d32") + line(c => c.bs + c.bl, "#8d6e63") + (s.furMut ? line(c => c.ws + c.wl, "#90a4ae") : "") + (s.teethMut ? line(c => c.bl + c.wl, "#ef6c00", true) : "");
  const key = [["total", "#2e7d32"], ["brown fur", "#8d6e63"]].concat(s.furMut ? [["white fur", "#90a4ae"]] : []).concat(s.teethMut ? [["long teeth", "#ef6c00"]] : []);
  key.forEach((k, i) => { g += `<rect x="${58 + i * 82}" y="30" width="14" height="5" fill="${k[1]}"/>${T(76 + i * 82, 36, k[0], { a: "start", s: 11, c: "#455a64" })}`; });
  return g;
}
function render(s) {
  const hist = history(s), g = s.reveal ? (s._g != null ? s._g : s.gens) : 0, c = hist[g];
  return `<svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="450" fill="#f1f8e9"/>
    <g transform="translate(10,10)">${scene(s, c, 420, 430)}<rect x="8" y="8" width="230" height="52" rx="10" fill="rgba(255,255,255,.9)"/>${T(123, 30, "Generation " + g + " · " + Math.round(tot(c)) + " bunnies", { s: 14, c: "#1b5e20" })}${T(123, 50, s.furMut ? "white fur " + pc(white(c)) + (s.teethMut ? " · long teeth " + pc(longT(c)) : "") : s.teethMut ? "long teeth " + pc(longT(c)) : "all brown fur", { s: 12, c: "#33691e" })}</g>
    <g transform="translate(440,10)">${graph(s, hist, g, 350, 280)}</g>
    <g transform="translate(440,300)"><rect width="350" height="140" rx="12" fill="#fff" stroke="#c8e6c9" stroke-width="2"/>${T(175, 26, "SELECTION RULES", { s: 12, c: "#689f38" })}
      ${T(16, 52, s.wolves ? "🐺 Wolves catch bunnies that do NOT blend in." : "🐺 No wolves.", { a: "start", s: 13, c: "#33691e" })}${T(16, 76, s.food === "limited" ? "🥕 Limited food: long teeth help bunnies eat." : "🥕 Plenty of food for everyone.", { a: "start", s: 13, c: "#33691e" })}
      ${T(16, 100, "👶 Survivors have babies with the SAME traits.", { a: "start", s: 13, c: "#33691e" })}${T(16, 124, s.reveal ? "" : "Press ▶ to run " + s.gens + " generation" + (s.gens > 1 ? "s" : "") + ".", { a: "start", s: 13, c: "#7cb342" })}</g></svg>`;
}
const ctls = (lv, o) => { o = o || {}; const L = o.lv || lv, lk = k => o.lock && o.lock.includes(k) ? () => true : null; return [
  { id: "env", type: "choice", label: "Environment", options: [{ v: "arctic", label: "❄ Arctic (snow)" }, { v: "equator", label: "🌴 Equator (soil)" }], lock: lk("env") },
  { id: "furMut", type: "toggle", label: "Add white-fur mutation", lock: lk("furMut") },
  { id: "wolves", type: "toggle", label: "Wolves (predators)", lock: lk("wolves") },
  { id: "teethMut", type: "toggle", label: "Add long-teeth mutation", hide: () => L < 2, lock: lk("teethMut") },
  { id: "food", type: "choice", label: "Food", options: [{ v: "plenty", label: "Plenty" }, { v: "limited", label: "Limited" }], hide: () => L < 2, lock: lk("food") },
  { id: "gens", type: "step", label: "Generations to run", min: 1, max: 10, lock: lk("gens") }
]; };
const st = (lv, o) => Object.assign({ lv, env: "equator", furMut: false, wolves: false, teethMut: false, food: "plenty", gens: 1 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; s._g = 0; box.innerHTML = render(s);
  const step = () => { if (s._g < s.gens) { s._g++; box.innerHTML = render(s); setTimeout(step, 330); } else { s._g = null; res(); } }; setTimeout(step, 330); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const say = s => { const c = end(s); return `After ${s.gens} generation${s.gens > 1 ? "s" : ""}: ${Math.round(tot(c))} bunnies` + (s.furMut ? `, white fur ${pc(white(c))}` : ", no white fur") + (s.teethMut ? `, long teeth ${pc(longT(c))}` : ""); };
const simQ = (goal, s0, check, sol, o) => ({ title: "🐇 Selection challenge", prompt: "Set up the environment, then press <b>▶ Run & check</b> to watch the generations.", goal,
  sim: { state: s0, controls: ctls(s0.lv, o), render, run, check, hint: "Bunnies that blend in survive wolves better. With limited food, long teeth help. Survivors pass their traits to their babies. A mutation must exist before it can be selected." },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("ns-sim", diff, uses, mk);
const C = {
  whiteWin: () => simQ("In the <b>Arctic</b>, make the <b>white</b> bunnies the majority (more than 50%) by the end of the run.", st(1, { env: "arctic" }), s => ok(s.furMut && white(end(s)) > 0.5, say(s) + ".", !s.furMut ? "There is no white fur — add the mutation first." : say(s) + "."), { furMut: true, wolves: true, gens: 3 }, { lock: ["env"], wrong: { furMut: true, wolves: false, gens: 3 } }),
  brownStay: () => simQ("The white-fur mutation is present in the <b>Arctic</b>. Keep the <b>brown</b> bunnies the majority after <b>5 generations</b>.", st(1, { env: "arctic", furMut: true, wolves: true, gens: 5 }), s => ok(brown(end(s)) > 0.5, "With no wolves, fur colour does not affect survival, so nothing is selected.", say(s) + "."), { wolves: false }, { lock: ["env", "furMut", "gens"], wrong: { wolves: true } }),
  whiteGone: () => simQ("The white-fur mutation is present. Make white fur almost disappear: <b>below 5%</b>.", st(1, { furMut: true }), s => ok(white(end(s)) < 0.05, say(s) + ".", say(s) + "."), { env: "equator", wolves: true, gens: 3 }, { lock: ["furMut"], wrong: { env: "arctic", wolves: true, gens: 3 } }),
  ninety: () => simQ("Arctic, wolves, white-fur mutation. Find the <b>fewest generations</b> to reach <b>white fur ≥ 90%</b>.", st(1, { env: "arctic", furMut: true, wolves: true }), s => ok(s.gens === 5 && white(end(s)) >= 0.9, "5 generations: " + pc(white(end(s))) + " white (4 generations give only 86.5%).", white(end(s)) >= 0.9 ? say(s) + " — fewer generations are enough." : say(s) + "."), { gens: 5 }, { lock: ["env", "furMut", "wolves"], wrong: { gens: 6 } }),
  longWin: () => simQ("Make bunnies with <b>long teeth</b> more than <b>50%</b> of the population.", st(2, { teethMut: true }), s => ok(longT(end(s)) > 0.5, say(s) + ".", say(s) + "."), { food: "limited", gens: 3 }, { lv: 2, lock: ["teethMut"], wrong: { food: "plenty", gens: 3 } }),
  bigPop: () => simQ("Get the <b>largest population</b> you can after exactly <b>3 generations</b>.", st(2, { gens: 3, furMut: true, teethMut: true, wolves: true, food: "limited" }), s => ok(tot(end(s)) > 159.9, say(s) + ": no wolves and plenty of food — every bunny survives.", say(s) + "."), { wolves: false, food: "plenty" }, { lv: 2, lock: ["gens"], wrong: { wolves: false, food: "limited" } }),
  foodCap: () => simQ("With <b>limited food</b> the land can feed only 60 bunnies. Make the population <b>reach 60</b> (long-teeth mutation present).", st(2, { food: "limited", teethMut: true }), s => ok(Math.round(tot(end(s))) >= 60, say(s) + ".", say(s) + " — not 60 yet."), { gens: 5 }, { lv: 2, lock: ["food", "teethMut"], wrong: { gens: 3 } }),
  noChange: () => simQ("Wolves live in the <b>Arctic</b>. Make the population's traits <b>NOT change at all</b> over 5 generations.", st(3, { env: "arctic", wolves: true, gens: 5, furMut: true, teethMut: true }), s => { const h = history(s), a = h[0], b = h[h.length - 1]; const same = f => Math.abs(f(a) - f(b)) < 1e-9; return ok(same(white) && same(longT), "No variation (or nothing selecting it) → no evolution.", say(s) + " — the traits changed."); }, { furMut: false, teethMut: false, food: "plenty" }, { lv: 3, lock: ["env", "wolves", "gens"], wrong: { furMut: false, teethMut: true, food: "limited" } }),
  combo: () => simQ("Arctic, wolves, limited food, both mutations. Make <b>white fur + long teeth</b> bunnies more than <b>50%</b> in the <b>fewest generations</b>.", st(3, { env: "arctic", wolves: true, food: "limited", furMut: true, teethMut: true }), s => { const c = end(s); return ok(s.gens === 4 && c.wl / tot(c) > 0.5, "4 generations: " + pc(c.wl / tot(c)) + " are white with long teeth.", c.wl / tot(c) > 0.5 ? "More than 50%, but fewer generations are enough." : `Only ${pc(c.wl / tot(c))} are white with long teeth.`); }, { gens: 4 }, { lv: 3, lock: ["env", "wolves", "food", "furMut", "teethMut"], wrong: { gens: 3 } }),
  equator: () => simQ("Equator, wolves, limited food, both mutations. In the <b>fewest generations</b>, reach <b>long teeth ≥ 80%</b> and <b>brown fur ≥ 99%</b>.", st(3, { env: "equator", wolves: true, food: "limited", furMut: true, teethMut: true }), s => { const c = end(s); return ok(s.gens === 5 && longT(c) >= 0.8 && brown(c) >= 0.99, say(s) + ".", longT(c) >= 0.8 && brown(c) >= 0.99 ? "Both reached, but in fewer generations is possible." : say(s) + "."); }, { gens: 5 }, { lv: 3, lock: ["env", "wolves", "food", "furMut", "teethMut"], wrong: { gens: 4 } }),
  pick: () => simQ("Choose the environment and selection so that <b>white fur</b> and <b>long teeth</b> both end above <b>90%</b>.", st(3, { furMut: true, teethMut: true }), s => { const c = end(s); return ok(white(c) > 0.9 && longT(c) > 0.9, say(s) + ".", say(s) + "."); }, { env: "arctic", wolves: true, food: "limited", gens: 7 }, { lv: 3, lock: ["furMut", "teethMut"], wrong: { env: "arctic", wolves: true, food: "plenty", gens: 7 } })
};

// ---------- diagram tasks ----------
const D = {
  graphNum: diff => E.diaT("ns-num", diff, 2, () => { const s = st(1, { env: "arctic", furMut: true, wolves: true, gens: 6 }), h = history(s);
    const first = h.findIndex(c => white(c) > 0.5), g = choice([2, 3, 4]), val = Math.round(h[g].ws + h[g].wl);
    const X = i => 70 + i * 100, top = [20, 40, 100, 200].find(v => v >= Math.max(...h.map(c => Math.max(c.bs, c.ws)))), Y = v => 240 - v / top * 200;
    const vis = `<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg"><rect width="740" height="280" fill="#fff"/>${[0, 1, 2, 3, 4].map(i => `<line x1="60" x2="680" y1="${Y(top * i / 4)}" y2="${Y(top * i / 4)}" stroke="#eceff1"/>${T(52, Y(top * i / 4) + 4, top * i / 4, { a: "end", s: 11, c: "#78909c" })}`).join("")}
      ${h.map((c, i) => T(X(i), 262, "gen " + i, { s: 11, c: "#78909c" })).join("")}
      <polyline points="${h.map((c, i) => X(i) + "," + Y(c.bs)).join(" ")}" fill="none" stroke="#8d6e63" stroke-width="4"/><polyline points="${h.map((c, i) => X(i) + "," + Y(c.ws)).join(" ")}" fill="none" stroke="#90a4ae" stroke-width="4"/>
      ${h.map((c, i) => `<circle cx="${X(i)}" cy="${Y(c.ws)}" r="5" fill="#90a4ae"/>${T(X(i), Y(c.ws) - 10, Math.round(c.ws), { s: 11, c: "#546e7a" })}<circle cx="${X(i)}" cy="${Y(c.bs)}" r="5" fill="#8d6e63"/>${T(X(i), Y(c.bs) + 18, Math.round(c.bs), { s: 11, c: "#5d4037" })}`).join("")}
      ${T(600, 26, (s.env === "arctic" ? "❄ Arctic" : "🌴 Equator") + " + wolves", { s: 14, c: "#33691e" })}<rect x="80" y="14" width="14" height="5" fill="#8d6e63"/>${T(98, 20, "brown", { a: "start", s: 12 })}<rect x="160" y="14" width="14" height="5" fill="#90a4ae"/>${T(178, 20, "white", { a: "start", s: 12 })}</svg>`;
    return { kind: "num", title: "📈 Read the population graph", prompt: "The graph shows brown and white bunnies over 6 generations.", visual: vis,
      fields: [{ label: `White bunnies in generation ${g}`, unit: "", answer: val }, { label: `First generation where ${s.env === "arctic" ? "white" : "brown"} bunnies are the majority`, unit: "", answer: first }],
      explain: `Read the labelled points: generation ${g} has ${val} white bunnies. ${s.env === "arctic" ? "White" : "Brown"} bunnies blend in, so they become the majority from generation ${first}.`, summary: "Read a population graph" }; }),
  camo: diff => E.diaT("ns-pick", diff, 1, () => { const env = choice(["arctic", "equator"]), surv = choice([true, false]);
    const blend = env === "arctic" ? "w" : "b", oneOut = surv ? blend : (blend === "w" ? "b" : "w"); // the single odd bunny is the answer
    const set = oneOut === "w" ? ["ws", "bs", "bl"] : ["bs", "ws", "wl"], order = E.shuffle(set.slice()), ans = set[0];
    const ask = (env === "arctic" ? "Wolves hunt in the snow." : "Wolves hunt on dark soil.") + ` Click the bunny <b>most likely to ${surv ? "survive" : "be caught"}</b>.`;
    return { kind: "pick", title: "👆 Who survives?", prompt: ask, answer: [ans], names: { bs: "the brown bunny", ws: "the white bunny", bl: "the brown bunny with long teeth", wl: "the white bunny with long teeth" },
      visual: st => `<svg viewBox="0 0 740 260" xmlns="http://www.w3.org/2000/svg">${scene(st0(env), { bs: 0, bl: 0, ws: 0, wl: 0 }, 740, 260)}${order.map((k, i) => `<g class="pk" data-k="${k}"><rect x="${90 + i * 210}" y="120" width="150" height="120" rx="16" fill="rgba(255,255,255,0)" ${E.ring(st[k])}/>${bunny(165 + i * 210, 190, k, 2.2)}</g>`).join("")}</svg>`,
      explain: (env === "arctic" ? "White fur blends in with the snow; brown fur stands out." : "Brown fur blends in with the dark soil; white fur stands out.") + " Bunnies that stand out are caught more often.", summary: "Camouflage and survival" }; }),
  mcq: diff => E.diaT("ns-mcq", diff, 2, () => { const q = choice([
      { s: { env: "arctic", furMut: false, wolves: true, gens: 4, reveal: true }, ask: "There is no white-fur mutation. Wolves hunt in the snow for 4 generations. What happens?", ok: "All bunnies stay brown — selection cannot create a new trait", bad: ["The bunnies turn white to hide", "Half the babies are born white", "The wolves turn white"], ex: "Natural selection can only act on variation that already exists. New traits come from random mutations." },
      { s: { env: "arctic", furMut: true, wolves: true, gens: 5, reveal: true }, ask: "Why did white fur become common?", ok: "White bunnies survived more often and passed white fur to their babies", bad: ["Bunnies decided to grow white fur", "The cold weather bleached their fur", "Wolves only eat young bunnies"], ex: "Variation → selection (wolves) → survivors reproduce → the helpful trait becomes more common." },
      { s: { env: "equator", furMut: true, teethMut: true, wolves: false, food: "plenty", gens: 4, reveal: true }, ask: "With no wolves and plenty of food, the percentage of each trait stays the same. Why?", ok: "No trait gives an advantage, so nothing is selected", bad: ["Mutations stop happening", "Bunnies stop having babies", "The environment is too hot"], ex: "If nothing in the environment favours one trait, all types survive equally and the percentages do not change." }]);
    return { kind: "mcq", title: "🧬 How does evolution work?", prompt: "Look at the simulation result.", visual: render(st(2, q.s)), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Natural selection ideas" }; })
};
const st0 = env => st(1, { env });
const LEVELS = {
  1: { intro: "Fur colour and predators: which bunnies blend in, survive and have babies?", pool: () => [S(1, 1, C.whiteWin), S(2, 1, C.whiteGone), S(2, 1, C.brownStay), S(3, 1, C.ninety), D.camo(1), D.mcq(2), D.graphNum(3)] },
  2: { intro: "A second trait: long teeth help when food is limited. The land can only feed so many bunnies.", pool: () => [S(1, 1, C.longWin), S(2, 1, C.bigPop), S(2, 1, C.whiteWin), S(3, 1, C.foodCap), D.camo(1), D.graphNum(2), D.mcq(3)] },
  3: { intro: "Two traits and two selection agents at once. Plan the fewest generations.", pool: () => [S(1, 1, C.noChange), S(2, 1, C.pick), S(3, 1, C.combo), S(3, 1, C.equator), D.mcq(1), D.graphNum(2), D.graphNum(3)] }
};
const explore = E.exploreSim({
  intro: "Choose the environment, add mutations and wolves, then press ▶ to watch the bunnies over several generations.",
  state: lv => st(lv, { gens: 4 }), controls: lv => ctls(lv), render, run, runLabel: "▶ Run the generations",
  goals: lv => [
    { txt: "Run the bunnies with no mutation and no wolves", test: (s, m) => m.plain },
    { txt: "Make white fur increase", test: (s, m) => m.wUp },
    { txt: "Make white fur decrease", test: (s, m) => m.wDown }
  ].concat(lv >= 2 ? [{ txt: "Make long teeth increase", test: (s, m) => m.lUp }] : []),
  track: (s, m, ran) => { if (!ran) return; const h = history(s), a = h[0], b = h[h.length - 1]; if (!s.furMut && !s.wolves) m.plain = 1; if (s.furMut && white(b) > white(a) + 1e-6) m.wUp = 1; if (s.furMut && white(b) < white(a) - 1e-6) m.wDown = 1; if (s.teethMut && longT(b) > longT(a) + 1e-6) m.lUp = 1; },
  facts: () => "📘 <b>Natural selection</b>: individuals vary (mutations) → those better suited to the environment survive → they pass on their traits → the population changes over generations."
});
E.start({ labId: "selection", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🐇", levels: LEVELS, explore, calculator: false, typeCycle: 3, confetti: ["🐇", "🧬", "🌿", "✨"],
  exploreDemo: lv => [{ set: { gens: 2 }, run: true }, { set: { furMut: true, wolves: true, env: "arctic" }, run: true }, { set: { env: "equator" }, run: true }].concat(lv >= 2 ? [{ set: { teethMut: true, food: "limited" }, run: true }] : []) });
})();
