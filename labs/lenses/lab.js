"use strict";
// ===== Lenses & Mirrors — Science Lab 1971 =====
(function () {
const E = LabEngine, fmt = E.fmt, choice = E.choice, T = E.svgText;
const r2 = x => Math.round(x * 100) / 100, rad = d => d * Math.PI / 180;
// convex lens: 1/f = 1/u + 1/v (v < 0 → virtual image on the object side)
const imgV = s => s.u === s.f ? Infinity : r2(1 / (1 / s.f - 1 / s.u));
const mag = s => r2(Math.abs(imgV(s) / s.u));
const real = s => imgV(s) > 0 && isFinite(imgV(s));
const kind = s => !isFinite(imgV(s)) ? "no image (rays come out parallel)" : real(s) ? "real, upside down" : "virtual, upright";
const sizeW = s => !isFinite(imgV(s)) ? "" : mag(s) > 1.001 ? "bigger" : mag(s) < 0.999 ? "smaller" : "same size";
const RES = (rows, foot) => `<g transform="translate(600,20)"><rect width="240" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>${T(120, 30, "RESULTS", { s: 13, c: "#37474f" })}${rows}${T(120, 372, foot, { s: 10, c: "#90a4ae" })}</g>`;
function mirror(s, show) {
  const cx = 300, my = 340, L = 230, i = s.i, a = rad(i);
  let g = `<rect x="70" y="${my}" width="460" height="14" fill="#90caf9" stroke="#1565c0" stroke-width="2"/>${Array.from({ length: 23 }, (_, k) => `<line x1="${76 + k * 20}" y1="${my + 14}" x2="${66 + k * 20}" y2="${my + 26}" stroke="#1565c0" stroke-width="2"/>`).join("")}${T(500, my + 46, "mirror", { s: 12, c: "#1565c0" })}`;
  g += `<line x1="${cx}" y1="${my}" x2="${cx}" y2="60" stroke="#78909c" stroke-width="2" stroke-dasharray="7 5"/>${T(cx, 52, "normal", { s: 12, c: "#78909c" })}`;
  const sx = cx - L * Math.sin(a), sy = my - L * Math.cos(a);
  if (s.tgt != null) { const t = rad(s.tgt), tx = cx + (L + 14) * Math.sin(t), ty = my - (L + 14) * Math.cos(t); g += `<circle cx="${tx}" cy="${ty}" r="18" fill="#fff8e1" stroke="#f9a825" stroke-width="3"/>${T(tx, ty + 6, "★", { s: 18, c: "#f9a825" })}`; }
  g += `<rect x="${sx - 26}" y="${sy - 10}" width="52" height="20" rx="5" fill="#455a64" transform="rotate(${90 - i} ${sx} ${sy})"/>`;
  g += `<line x1="${sx}" y1="${sy}" x2="${cx}" y2="${my}" stroke="#e53935" stroke-width="4"/>`;
  if (i > 0) g += `<path d="M${cx},${my - 60} A60,60 0 0 0 ${cx - 60 * Math.sin(a)},${my - 60 * Math.cos(a)}" fill="none" stroke="#e53935" stroke-width="2"/>${T(cx - 30, my - 72, "i = " + i + "°", { a: "end", s: 13, c: "#c62828" })}`;
  if (show) {
    const ex = cx + L * Math.sin(a), ey = my - L * Math.cos(a);
    g += `<line x1="${cx}" y1="${my}" x2="${ex}" y2="${ey}" stroke="#e53935" stroke-width="4" stroke-dasharray="${i === 0 ? "10 6" : "0"}"/>`;
    if (i > 0) g += `<path d="M${cx},${my - 76} A76,76 0 0 1 ${cx + 76 * Math.sin(a)},${my - 76 * Math.cos(a)}" fill="none" stroke="#2e7d32" stroke-width="2"/>${T(cx + 30, my - 88, "r = " + i + "°", { a: "start", s: 13, c: "#2e7d32" })}`;
  }
  return g;
}
const hit = s => s.tgt != null && s.i === s.tgt;
function lens(s, show) {
  const lx = 300, ay = 210, S = 4, h = 50, xo = lx - s.u * S, v = imgV(s);
  let g = `<line x1="40" y1="${ay}" x2="570" y2="${ay}" stroke="#90a4ae" stroke-width="2"/>`;
  g += `<path d="M${lx},${ay - 150} Q${lx + 22},${ay} ${lx},${ay + 150} Q${lx - 22},${ay} ${lx},${ay - 150}Z" fill="#b3e5fc" opacity=".8" stroke="#0288d1" stroke-width="2"/>${T(lx, ay - 160, "convex lens  f = " + s.f + " cm", { s: 13, c: "#0277bd" })}`;
  [-2, -1, 1, 2].forEach(k => { const x = lx + k * s.f * S; if (x > 40 && x < 570) g += `<circle cx="${x}" cy="${ay}" r="4" fill="#37474f"/>${T(x, ay + 22, (Math.abs(k) === 2 ? "2F" : "F"), { s: 12, c: "#37474f" })}`; });
  g += `<line x1="${xo}" y1="${ay}" x2="${xo}" y2="${ay - h}" stroke="#2e7d32" stroke-width="5"/><path d="M${xo},${ay - h - 10} l-9,14 h18Z" fill="#2e7d32"/>${T(xo, ay - h - 18, "object", { s: 12, c: "#2e7d32" })}`;
  g += `<line x1="${xo}" y1="${ay + 54}" x2="${lx}" y2="${ay + 54}" stroke="#78909c" stroke-width="1.5" marker-start="url(#ar)" marker-end="url(#ar)"/>${T((xo + lx) / 2, ay + 72, s.u + " cm", { s: 12, c: "#546e7a" })}`;
  if (!show) return g;
  const ty = ay - h, fx = lx + s.f * S, edge = 570;
  const ray = (x0, y0, x1, y1, col) => { const t = (edge - x0) / (x1 - x0); return `<line x1="${x0}" y1="${y0}" x2="${edge}" y2="${y0 + (y1 - y0) * t}" stroke="${col}" stroke-width="2.5"/>`; };
  g += `<line x1="${xo}" y1="${ty}" x2="${lx}" y2="${ty}" stroke="#ef6c00" stroke-width="2.5"/>` + ray(lx, ty, fx, ay, "#ef6c00");
  g += ray(xo, ty, lx, ay, "#8e24aa");
  if (isFinite(v)) {
    const xi = lx + v * S, yi = ay + (v / s.u) * h, clip = Math.abs(v) > 67 || Math.abs(yi - ay) > 170;
    if (!clip) {
      if (v < 0) g += `<line x1="${lx}" y1="${ty}" x2="${xi}" y2="${yi}" stroke="#ef6c00" stroke-width="1.5" stroke-dasharray="5 4"/><line x1="${lx}" y1="${ay}" x2="${xi}" y2="${yi}" stroke="#8e24aa" stroke-width="1.5" stroke-dasharray="5 4"/>`;
      const up = yi < ay;
      g += `<line x1="${xi}" y1="${ay}" x2="${xi}" y2="${yi}" stroke="#c62828" stroke-width="5" ${v < 0 ? 'stroke-dasharray="8 4"' : ""}/><path d="M${xi},${yi + (up ? -10 : 10)} l-9,${up ? 14 : -14} h18Z" fill="#c62828"/>${T(xi, up ? yi - 18 : yi + 26, "image", { s: 12, c: "#c62828" })}`;
    } else g += T(470, 400, "image too far away to draw", { s: 12, c: "#c62828" });
  }
  return g;
}
function render(s) {
  const show = s.reveal;
  let g = `<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="#78909c"/></marker></defs><rect width="860" height="450" fill="#f2f5f7"/><rect x="20" y="20" width="560" height="410" rx="16" fill="#fff" stroke="#cfd8dc" stroke-width="2"/>`;
  if (s.mode === "mirror") {
    g += mirror(s, show) + RES(`${T(120, 70, "angle of incidence", { s: 12, c: "#78909c" })}${T(120, 98, s.i + "°", { s: 22, c: "#c62828" })}${T(120, 146, "angle of reflection", { s: 12, c: "#78909c" })}${T(120, 174, show ? s.i + "°" : "?", { s: 22, c: "#2e7d32" })}
      ${s.tgt != null ? T(120, 230, show ? (hit(s) ? "✔ the star is hit!" : "✘ missed the star") : "press ▶ to fire", { s: 16, c: show ? (hit(s) ? "#2e7d32" : "#c62828") : "#90a4ae" }) : ""}${show ? T(120, 280, "angle between rays: " + 2 * s.i + "°", { s: 12, c: "#546e7a" }) + T(120, 302, "angle to the mirror: " + (90 - s.i) + "°", { s: 12, c: "#546e7a" }) : ""}`, "angles are measured from the NORMAL");
  } else {
    const v = imgV(s);
    g += lens(s, show) + RES(`${T(120, 64, "object distance: " + s.u + " cm", { s: 13, c: "#37474f" })}${T(120, 88, "focal length: " + s.f + " cm", { s: 13, c: "#37474f" })}
      ${T(120, 134, "image distance:", { s: 12, c: "#78909c" })}${T(120, 162, show ? (isFinite(v) ? fmt(Math.abs(v)) + " cm" + (v < 0 ? " (same side)" : "") : "—") : "?", { s: 19, c: "#e65100" })}
      ${T(120, 206, show ? kind(s) : "press ▶ to trace the rays", { s: show && !isFinite(v) ? 11 : 14, c: show ? "#37474f" : "#90a4ae" })}${show && isFinite(v) ? T(120, 236, sizeW(s) + "  (×" + fmt(mag(s)) + ")", { s: 15, c: "#6d4c41" }) : ""}`, "1/f = 1/object + 1/image");
  }
  return `<svg viewBox="0 0 860 450" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}
const ctls = (lv, lock, explore) => { const lk = k => lock && lock.includes(k) ? () => true : null; return [
  ...(explore ? [{ id: "mode", type: "choice", label: "Experiment", options: [{ v: "mirror", label: "Plane mirror" }, { v: "lens", label: "Convex lens" }] }] : []),
  { id: "i", type: "range", label: "Angle of incidence", min: 0, max: 80, step: 5, nudge: 5, unit: "°", hide: s => s.mode !== "mirror", lock: lk("i") },
  { id: "f", type: "choice", label: "Lens (focal length)", options: [10, 15, 20].map(v => ({ v, label: v + " cm" })), hide: s => s.mode !== "lens", lock: lk("f") },
  { id: "u", type: "range", label: "Object distance", min: 5, max: 60, step: 5, nudge: 5, unit: "cm", hide: s => s.mode !== "lens", lock: lk("u") }]; };
const st = o => Object.assign({ mode: "mirror", i: 30, tgt: null, f: 10, u: 40 }, o || {});
const run = (s, box) => new Promise(res => { s.reveal = true; box.innerHTML = render(s); setTimeout(res, 900); });
const ok = (c, good, bad) => c ? { pts: 1, msg: "✅ " + good } : { pts: 0, msg: "❌ " + bad };
const desc = s => `${kind(s)}${isFinite(imgV(s)) ? ", " + sizeW(s) + " (×" + fmt(mag(s)) + ")" : ""}`;
const HINT = { mirror: "Angle of incidence = angle of reflection. Both are measured from the dashed normal line, not from the mirror.", lens: "Object beyond 2F → smaller image; at 2F → same size; between F and 2F → bigger; inside F → upright magnified (virtual). Use 1/f = 1/u + 1/v." };
const simQ = (lv, goal, s0, check, sol, o) => ({ title: s0.mode === "mirror" ? "🔦 Mirror challenge" : "🔍 Lens challenge", prompt: "Set it up, then press <b>▶ Run & check</b>.", goal,
  sim: { state: s0, controls: ctls(lv, o && o.lock), render, run, check, hint: HINT[s0.mode] },
  solution: sol, wrong: o && o.wrong, summary: goal.replace(/<[^>]+>/g, "").slice(0, 70) });
const S = (diff, uses, mk) => E.simT("lm-sim", diff, uses, mk);
const C = {
  star: () => { const t = choice([35, 45, 55]); return simQ(1, `Aim the laser so the reflected ray hits the <b>star</b> (it sits ${t}° from the normal).`, st({ i: 20, tgt: t }), s => ok(hit(s), `i = r = ${t}°.`, `The ray leaves at ${s.i}°.`), { i: t }, { wrong: { i: t - 10 } }); },
  back: () => simQ(1, "Make the light reflect <b>straight back</b> along the same path.", st({ i: 40 }), s => ok(s.i === 0, "0° — along the normal it bounces straight back.", `At ${s.i}° it goes off to the side.`), { i: 0 }, { wrong: { i: 10 } }),
  between: () => simQ(1, "Make the angle <b>between</b> the incoming and reflected rays exactly <b>100°</b>.", st({ i: 20 }), s => ok(2 * s.i === 100, "i = 50°, so the rays are 50° + 50° = 100° apart.", `The rays are ${2 * s.i}° apart.`), { i: 50 }, { wrong: { i: 40 } }),
  surface: () => simQ(1, "The reflected ray must leave at <b>30° to the mirror surface</b>.", st({ i: 20 }), s => ok(s.i === 60, "30° to the mirror = 60° to the normal.", `That ray is ${90 - s.i}° from the mirror.`), { i: 60 }, { wrong: { i: 30 } }),
  same: () => simQ(2, "With the 10 cm lens, make an image the <b>same size</b> as the object.", st({ mode: "lens", f: 10, u: 50 }), s => ok(mag(s) === 1 && real(s), "At 2F (20 cm) the image is the same size, 20 cm away.", `Image: ${desc(s)}.`), { u: 20 }, { lock: ["f"], wrong: { u: 30 } }),
  screen: () => simQ(2, "With the 10 cm lens, focus a sharp image on a screen <b>15 cm</b> behind the lens.", st({ mode: "lens", f: 10, u: 50 }), s => ok(imgV(s) === 15, "u = 30 cm: 1/10 = 1/30 + 1/15.", `The image forms ${isFinite(imgV(s)) ? fmt(Math.abs(imgV(s))) + " cm away" : "nowhere"}.`), { u: 30 }, { lock: ["f"], wrong: { u: 20 } }),
  magnifier: () => simQ(2, "Use the 20 cm lens as a <b>magnifying glass</b>: make an upright, bigger image.", st({ mode: "lens", f: 20, u: 40 }), s => ok(!real(s) && isFinite(imgV(s)), "Inside F the lens makes an upright, magnified virtual image.", `Image: ${desc(s)}.`), { u: 10 }, { lock: ["f"], wrong: { u: 30 } }),
  projector: () => simQ(2, "With the 15 cm lens, make a real image <b>3 times bigger</b> than the object (like a projector).", st({ mode: "lens", f: 15, u: 50 }), s => ok(real(s) && mag(s) === 3, "u = 20 cm → v = 60 cm, ×3.", `Image: ${desc(s)}.`), { u: 20 }, { lock: ["f"], wrong: { u: 25 } }),
  camera: () => simQ(3, "A camera: make a real image <b>half the size</b> of the object, <b>15 cm</b> behind the lens. Choose the lens and the distance.", st({ mode: "lens", f: 20, u: 50 }), s => ok(real(s) && imgV(s) === 15 && mag(s) === 0.5, "10 cm lens, object at 30 cm: image 15 cm away, ×0.5.", `Image: ${desc(s)}, ${isFinite(imgV(s)) ? fmt(Math.abs(imgV(s))) + " cm away" : "none"}.`), { f: 10, u: 30 }, { wrong: { f: 10, u: 20 } }),
  twice: () => simQ(3, "Make an <b>upright</b> image exactly <b>2 times</b> bigger.", st({ mode: "lens", f: 15, u: 40 }), s => ok(!real(s) && mag(s) === 2, "Object halfway to F (e.g. 10 cm with the 20 cm lens) gives ×2 upright.", `Image: ${desc(s)}.`), { f: 20, u: 10 }, { wrong: { f: 20, u: 15 } }),
  parallel: () => simQ(3, "Make the rays come out <b>parallel</b> (no image at all) — like a torch.", st({ mode: "lens", f: 15, u: 40 }), s => ok(!isFinite(imgV(s)), "Object exactly at F: the rays leave parallel.", `Image: ${desc(s)}.`), { u: 15 }, { lock: ["f"], wrong: { u: 20 } }),
  pickf: () => simQ(3, "The object is <b>30 cm</b> from the lens and the screen is <b>60 cm</b> away. Choose the lens that makes a sharp image.", st({ mode: "lens", f: 10, u: 30 }), s => ok(imgV(s) === 60, "f = 20 cm: 1/20 = 1/30 + 1/60.", `With f = ${s.f} cm the image is ${fmt(Math.abs(imgV(s)))} cm away.`), { f: 20 }, { lock: ["u"], wrong: { f: 15 } })
};
const D = {
  pick: diff => E.diaT("lm-pick", diff, 2, () => {
    if (diff === 1) {
      const i = choice([30, 40, 50]), opts = E.shuffle([i, i - 20, i + 20, 90 - i].filter((x, k, a) => a.indexOf(x) === k && x > 0 && x < 90)).slice(0, 4), cols = ["#e53935", "#1e88e5", "#43a047", "#8e24aa"];
      return { kind: "pick", title: "👆 Which ray is right?", prompt: `A ray hits the mirror at <b>${i}°</b> to the normal. Click the reflected ray that obeys the law of reflection.`, answer: ["r" + i], names: Object.fromEntries(opts.map(o => ["r" + o, o + "° ray"])),
        visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><rect x="180" y="262" width="500" height="12" fill="#90caf9" stroke="#1565c0" stroke-width="2"/><line x1="430" y1="262" x2="430" y2="30" stroke="#78909c" stroke-width="2" stroke-dasharray="7 5"/>
          <line x1="${430 - 220 * Math.sin(rad(i))}" y1="${262 - 220 * Math.cos(rad(i))}" x2="430" y2="262" stroke="#37474f" stroke-width="4"/>${T(430 - 220 * Math.sin(rad(i)) - 8, 262 - 220 * Math.cos(rad(i)) - 8, "in", { a: "end", s: 13, c: "#37474f" })}
          ${opts.map((o, k) => { const ex = 430 + 220 * Math.sin(rad(o)), ey = 262 - 220 * Math.cos(rad(o)); return `<g class="pk" data-k="r${o}"><line x1="430" y1="262" x2="${ex}" y2="${ey}" stroke="transparent" stroke-width="22"/><line x1="430" y1="262" x2="${ex}" y2="${ey}" stroke="${cols[k]}" stroke-width="4"/><circle cx="${ex}" cy="${ey}" r="16" fill="#fff" stroke="${cols[k]}" stroke-width="3"/>${T(ex, ey + 5, "ABCD"[k], { s: 14, c: cols[k] })}<circle cx="${ex}" cy="${ey}" r="22" fill="none" ${E.ring(s2["r" + o])}/></g>`; }).join("")}</svg>`,
        explain: `The reflected ray leaves at ${i}° on the other side of the normal.`, summary: "Law of reflection" };
    }
    const f = 10, want = choice([["inside", "an upright, magnified image (magnifying glass)"], ["beyond", "a smaller, upside-down image (camera)"], ["between", "a bigger, upside-down image (projector)"], ["at2f", "an image the same size"]]), pos = { beyond: 32, at2f: 20, between: 15, inside: 5 }, lbl = { beyond: "A", at2f: "B", between: "C", inside: "D" };
    return { kind: "pick", title: "👆 Where to put the object?", prompt: `Click the place for the object to make <b>${want[1]}</b>.`, answer: [want[0]], names: Object.fromEntries(Object.keys(pos).map(k => [k, "position " + lbl[k]])),
      visual: s2 => `<svg viewBox="0 0 860 300" xmlns="http://www.w3.org/2000/svg"><rect width="860" height="300" fill="#f2f5f7"/><line x1="40" y1="170" x2="820" y2="170" stroke="#90a4ae" stroke-width="2"/><path d="M640,40 Q662,170 640,300 Q618,170 640,40Z" fill="#b3e5fc" stroke="#0288d1" stroke-width="2"/>
        ${[[1, "F"], [2, "2F"]].map(([k, t]) => `<circle cx="${640 - k * f * 16}" cy="170" r="4" fill="#37474f"/>${T(640 - k * f * 16, 194, t, { s: 13, c: "#37474f" })}<circle cx="${640 + k * f * 16}" cy="170" r="4" fill="#37474f"/>${T(640 + k * f * 16, 194, t, { s: 13, c: "#37474f" })}`).join("")}
        ${Object.keys(pos).map(k => { const x = 640 - pos[k] * 16; return `<g class="pk" data-k="${k}"><rect x="${x - 22}" y="70" width="44" height="150" fill="transparent"/><line x1="${x}" y1="170" x2="${x}" y2="118" stroke="#2e7d32" stroke-width="5"/><path d="M${x},108 l-9,14 h18Z" fill="#2e7d32"/>${T(x, 90, lbl[k], { s: 16, c: "#2e7d32" })}<rect x="${x - 22}" y="70" width="44" height="150" rx="8" fill="none" ${E.ring(s2[k])}/></g>`; }).join("")}</svg>`,
      explain: "Beyond 2F → smaller; at 2F → same size; between F and 2F → bigger; inside F → upright and magnified.", summary: "Lens image positions" };
  }),
  num: diff => E.diaT("lm-num", diff, 2, () => {
    if (diff === 1) { const i = choice([25, 35, 65, 70]);
      return { kind: "num", title: "🧮 Reflection angles", prompt: `A ray hits a plane mirror at <b>${i}°</b> to the normal.`, visual: render(st({ i, reveal: true })), fields: [{ label: "Angle of reflection", unit: "°", answer: i }, { label: "Angle between the two rays", unit: "°", answer: 2 * i }], explain: `r = i = ${i}°; the rays are ${i} + ${i} = ${2 * i}° apart.`, summary: "Reflection angles" }; }
    if (diff === 2) { const c = choice([[20, 60], [10, 30], [30, 15], [12, 48]]);
      return { kind: "num", title: "🧮 Magnification", prompt: `An object <b>${c[0]} cm</b> from a lens makes an image <b>${c[1]} cm</b> from the lens. Magnification = image distance ÷ object distance.`, visual: render(st({ mode: "lens", f: 15, u: 20 })), fields: [{ label: "Magnification", unit: "×", answer: c[1] / c[0] }], explain: `${c[1]} ÷ ${c[0]} = ${fmt(c[1] / c[0])}.`, summary: "Magnification" }; }
    const c = choice([[10, 30, 15], [15, 30, 30], [20, 30, 60], [10, 15, 30], [15, 20, 60]]);
    return { kind: "num", title: "🧮 Lens formula", prompt: `A convex lens has f = <b>${c[0]} cm</b>. The object is <b>${c[1]} cm</b> away. Use 1/f = 1/u + 1/v.`, visual: render(st({ mode: "lens", f: c[0], u: c[1] })), fields: [{ label: "Image distance v", unit: "cm", answer: c[2] }, { label: "Magnification", unit: "×", answer: c[2] / c[1] }], explain: `1/v = 1/${c[0]} − 1/${c[1]} → v = ${c[2]} cm; ×${fmt(c[2] / c[1])}.`, summary: "Lens formula" };
  }),
  mcq: diff => E.diaT("lm-mcq", diff, 2, () => { const q = choice([
      { ask: "In a plane mirror, your image is…", ok: "upright, the same size, and as far behind the mirror as you are in front", bad: ["upside down and smaller", "real and on a screen", "bigger and closer"], ex: "A plane-mirror image is virtual, upright, the same size, and laterally inverted." },
      { ask: "What does a convex lens do to parallel light rays?", ok: "Bends them so they meet at the focal point", bad: ["Spreads them apart", "Reflects them back", "Stops them"], ex: "A converging lens brings parallel rays to a focus at F." },
      { ask: "The image a camera makes on its sensor is…", ok: "real, upside down and smaller", bad: ["virtual and upright", "bigger and upright", "the same size"], ex: "The object is far beyond 2F, so the image is small and inverted." },
      { ask: "Why is the angle of incidence measured from the normal?", ok: "The normal is a fixed line at 90° to the surface, so angles are always measured the same way", bad: ["Because the mirror is curved", "Because light travels slowly", "It is measured from the mirror"], ex: "Angles are always measured from the normal." }]);
    return { kind: "mcq", title: "📘 Light ideas", prompt: "Think about how mirrors and lenses change the path of light.", visual: render(st({ mode: "lens", f: 10, u: 30, reveal: true })), ask: q.ask, options: E.mkOptions(q.ok, q.bad), explain: q.ex, summary: "Light concepts" }; })
};
const LEVELS = {
  1: { intro: "Plane mirrors: the angle of incidence equals the angle of reflection.", pool: () => [S(1, 1, C.back), S(2, 1, C.star), S(2, 1, C.between), S(3, 1, C.surface), D.pick(1), D.num(1), D.mcq(2)] },
  2: { intro: "Convex lenses: where you put the object decides what kind of image you get.", pool: () => [S(1, 1, C.same), S(2, 1, C.magnifier), S(2, 1, C.screen), S(3, 1, C.projector), D.pick(2), D.num(2), D.mcq(3)] },
  3: { intro: "Design with lenses: choose the lens and the distance to make cameras, projectors and magnifiers.", pool: () => [S(1, 1, C.parallel), S(2, 1, C.pickf), S(3, 1, C.camera), S(3, 1, C.twice), D.num(3), D.pick(3), D.mcq(2)] }
};
const explore = E.exploreSim({
  intro: "Try the mirror and the lens. Change the settings, then press ▶ to see where the light goes.",
  state: () => st({ tgt: 50 }), controls: lv => ctls(lv, null, true), render, run, runLabel: "▶ Shine",
  goals: () => [{ txt: "Hit the star with the mirror", test: (s, m) => m.h }, { txt: "Make a real, upside-down image", test: (s, m) => m.r }, { txt: "Make an upright, magnified image", test: (s, m) => m.v }],
  track: (s, m, ran) => { if (!ran) return; if (s.mode === "mirror" && hit(s)) m.h = 1; if (s.mode === "lens" && real(s)) m.r = 1; if (s.mode === "lens" && !real(s) && isFinite(imgV(s))) m.v = 1; },
  facts: () => "📘 A <b>mirror</b> reflects light at equal angles. A <b>convex lens</b> bends light to make real or virtual images."
});
E.start({ labId: "lenses", total: 7, plan: { sim: 4, dia: 3 }, emoji: "🔍", levels: LEVELS, explore, calculator: true, typeCycle: 3, confetti: ["🔍", "💡", "🌈", "✨"],
  exploreDemo: () => [{ set: { mode: "mirror", i: 50 }, run: true }, { set: { mode: "lens", u: 40 }, run: true }, { set: { mode: "lens", u: 5 }, run: true }] });
})();
