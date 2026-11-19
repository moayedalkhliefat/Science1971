// Science Lab 1971 — Simulation toolkit (extends LabEngine)
//   E.simTask(q, cfg)      lab challenge: student changes the simulation until the goal is reached, then Check
//   E.exploreSim(cfg)      returns an explore(lvl, done) step with goals
//   E.numTask(q)           diagram task: read the picture, type numbers
//   E.mcqTask(q)           diagram task: picture + multiple choice
//   E.pickTask(q)          diagram task: click part(s) of the picture
(function () {
  const E = window.LabEngine, esc = E.esc, fmt = E.fmt;
  const clone = o => JSON.parse(JSON.stringify(o));

  function ctlHtml(c, v, dis) {
    const d = dis ? "disabled" : "";
    const show = c.fmt ? c.fmt(v) : v;
    if (c.type === "range") return `<label class="sl" style="margin:0">${c.label}: <b><span id="v-${c.id}">${show}</span> ${c.unit || ""}</b>
      <input type="range" data-c="${c.id}" min="${c.min}" max="${c.max}" step="${c.step || 1}" value="${v}" ${d}></label>`;
    if (c.type === "step") return `<div class="stepper"><span>${c.label}</span><div><button type="button" data-c="${c.id}" data-d="-1" ${d}>−</button><b id="v-${c.id}">${show}</b><button type="button" data-c="${c.id}" data-d="1" ${d}>+</button></div></div>`;
    if (c.type === "choice") return `<div class="choice"><span>${c.label}</span><div class="seg">${c.options.map(o => `<button type="button" data-c="${c.id}" data-v="${esc(String(o.v))}" class="${String(o.v) === String(v) ? "sel" : ""}" ${d}>${o.label}</button>`).join("")}</div></div>`;
    if (c.type === "toggle") return `<label class="switch-row tg"><span>${c.label}</span><input type="checkbox" class="sw" data-c="${c.id}" ${v ? "checked" : ""} ${d}></label>`;
    return "";
  }

  // mounts a live simulation into #simbox / #simctl / #simro
  function mount(st, cfg) {
    let locked = false;
    const box = document.getElementById("simbox"), ctl = document.getElementById("simctl"), ro = document.getElementById("simro");
    const find = id => cfg.controls.find(c => c.id === id);
    const draw = () => { box.innerHTML = cfg.render(st); if (ro && cfg.readout) ro.innerHTML = cfg.readout(st); if (cfg.after) cfg.after(st); };
    const drawCtl = () => {
      ctl.innerHTML = cfg.controls.filter(c => !c.hide || !c.hide(st)).map(c => ctlHtml(c, st[c.id], locked || (c.lock && c.lock(st)))).join("");
      ctl.style.display = ctl.innerHTML ? "" : "none";
      ctl.querySelectorAll("input[type=range]").forEach(el => el.oninput = () => {
        const c = find(el.dataset.c); st[c.id] = +el.value;
        const v = document.getElementById("v-" + c.id); if (v) v.textContent = c.fmt ? c.fmt(st[c.id]) : st[c.id];
        draw();
      });
      ctl.querySelectorAll("button[data-d]").forEach(b => b.onclick = () => {
        const c = find(b.dataset.c); const step = c.step || 1;
        st[c.id] = Math.max(c.min != null ? c.min : 0, Math.min(c.max != null ? c.max : 99, Math.round((st[c.id] + step * (+b.dataset.d)) * 1000) / 1000));
        drawCtl(); draw();
      });
      ctl.querySelectorAll("button[data-v]").forEach(b => b.onclick = () => {
        const c = find(b.dataset.c), o = c.options.find(o => String(o.v) === b.dataset.v);
        st[c.id] = o.v; drawCtl(); draw();
      });
      ctl.querySelectorAll("input.sw[data-c]").forEach(b => b.onchange = () => { st[b.dataset.c] = b.checked; drawCtl(); draw(); });
    };
    drawCtl(); draw();
    return { lock() { locked = true; drawCtl(); }, unlock() { locked = false; drawCtl(); }, draw, drawCtl };
  }
  E.mountSim = mount;

  // ---------- LAB CHALLENGE ----------
  // cfg: { state, controls[], render(st), readout?(st), goal (html), story?, run?(st, boxEl) async, check(st) -> {pts, msg} , checkLabel? }
  E.simTask = function (q, cfg) {
    cfg = Object.assign({ goal: q.goal, story: q.story }, cfg);
    const st = clone(cfg.state); let done = false;
    E.stage.innerHTML = E.header() + (cfg.story ? `<div class="story">📋 ${cfg.story}</div>` : "") +
      `<div class="goal"><small>🎯 YOUR GOAL</small>${cfg.goal}</div>
       <div class="scene" id="simbox"></div><div class="controls" id="simctl"></div>${cfg.readout ? `<div class="instruments" id="simro"></div>` : ""}
       ${cfg.hint ? `<p class="hint">💡 ${cfg.hint}</p>` : ""}
       <div id="simres"></div><div class="actions" id="simact"><span class="hint">Change the simulation, then press the button.</span><button class="btn" id="check">${cfg.checkLabel || (cfg.run ? "▶ Run & check" : "✔ Check")}</button></div>`;
    const ui = mount(st, cfg);
    document.getElementById("check").onclick = async () => {
      if (done) return; done = true; ui.lock();
      document.getElementById("simact").innerHTML = "";
      if (cfg.run) await cfg.run(st, document.getElementById("simbox"));
      const r = cfg.check(st);
      document.getElementById("simres").innerHTML = r.msg ? `<div class="notice">${r.msg}</div>` : "";
      E.grade(r.pts);
    };
  };

  // ---------- EXPLORE ----------
  // cfg: { intro, state(lvl)|state, controls(lvl), render, readout?, run?(st, box), runLabel?, goals(lvl) -> [{txt, test(st, mem)}], track?(st, mem), facts?(lvl) }
  E.exploreSim = cfg => (lvl, done) => {
    const st = clone(typeof cfg.state === "function" ? cfg.state(lvl) : cfg.state), mem = { runs: 0 }, goals = cfg.goals(lvl), got = new Set();
    E.stage.innerHTML = `<div class="lab-head"><b>🔍 Step 1: Explore the simulation</b><b id="gcount"></b></div><div class="bar"><i id="gbar"></i></div>
      <p class="prompt">${cfg.intro}</p>
      <div class="scene" id="simbox"></div><div class="controls" id="simctl"></div>
      ${cfg.readout || cfg.run ? `<div class="instruments"><div id="simro" style="display:contents"></div>${cfg.run ? `<button class="btn orange" id="simrun">${cfg.runLabel || "▶ Run"}</button>` : ""}</div>` : ""}
      <div class="step-box"><b>🎯 Explore goals</b><ul class="checklist" id="goals"></ul></div>
      ${cfg.facts ? `<div class="notice">${cfg.facts(lvl)}</div>` : ""}
      <div class="actions"><span class="hint" id="ghint"></span><button class="btn green" id="go" disabled>Step 2: Start the ${E.TOTAL} tasks 🚀</button></div>`;
    const upd = () => {
      goals.forEach((g, i) => { if (g.test(st, mem)) got.add(i); });
      const ul = document.getElementById("goals"); if (!ul) return;
      ul.innerHTML = goals.map((g, i) => `<li>${got.has(i) ? "✅" : "⬜"} ${g.txt}</li>`).join("");
      document.getElementById("gcount").textContent = `Goals: ${got.size} / ${goals.length}`;
      document.getElementById("gbar").style.width = (100 * got.size / goals.length) + "%";
      const all = got.size === goals.length;
      document.getElementById("go").disabled = !all;
      document.getElementById("ghint").textContent = all ? "Great exploring!" : "Complete every goal to continue.";
    };
    const c2 = Object.assign({}, cfg, { controls: cfg.controls(lvl), after: s => { if (cfg.track) cfg.track(s, mem); upd(); } });
    const ui = mount(st, c2);
    const rb = document.getElementById("simrun");
    if (rb) rb.onclick = async () => { rb.disabled = true; ui.lock(); await cfg.run(st, document.getElementById("simbox")); mem.runs++; if (cfg.track) cfg.track(st, mem, true); ui.unlock(); upd(); rb.disabled = false; };
    document.getElementById("go").onclick = done;
  };

  // ---------- DIAGRAM: type numbers ----------
  // q: { visual (html), note?, fields:[{label, unit, answer, tol?, check?(v), show?}] }
  E.numTask = function (q) {
    const vals = {}; let checked = false;
    const draw = res => {
      E.stage.innerHTML = E.header() + `<div class="scene">${q.visual}</div>` + (q.note ? `<div class="notice">${q.note}</div>` : "") +
        `<div class="step-box">${q.fields.map((f, i) => `<div class="numans ${res ? (res[i] ? "ok" : "no") : ""}"><label style="margin:0;min-width:170px">${f.label}</label><input id="nf${i}" inputmode="decimal" autocomplete="off" value="${vals[i] != null ? esc(vals[i]) : ""}" ${res ? "disabled" : ""}><span class="unit">${f.unit || ""}</span></div>`).join("")}
         ${res ? `<p class="fix">✔ ${q.fields.map(f => `${f.label}: ${f.show != null ? f.show : fmt(f.answer)} ${f.unit || ""}`).join(" · ")}</p>` : ""}</div>` + (checked ? "" : E.actions(true));
      if (checked) return;
      q.fields.forEach((f, i) => document.getElementById("nf" + i).oninput = e => vals[i] = e.target.value);
      document.getElementById("check").onclick = () => {
        if (q.fields.some((f, i) => !String(vals[i] || "").trim())) return S1971.toast("Fill in every box first.", "bad");
        const r = q.fields.map((f, i) => f.check ? f.check(vals[i]) : E.close(E.num(vals[i]), f.answer, f.tol));
        checked = true; draw(r); E.grade(r.filter(Boolean).length / r.length);
      };
    };
    draw();
  };

  // ---------- DIAGRAM: multiple choice about a picture ----------
  // q: { visual, ask, options: E.mkOptions(correct, wrong[]) }
  E.mcqTask = function (q) {
    let sel = null, checked = false;
    const draw = () => {
      E.stage.innerHTML = E.header() + `<div class="scene">${q.visual}</div>` + `<div class="step-box"><b>${q.ask}</b></div>` + E.optionsHtml(q.options, sel, checked) + (checked ? "" : E.actions(sel != null));
      if (checked) return;
      E.stage.querySelectorAll(".opt").forEach(o => o.onclick = () => { sel = +o.dataset.i; draw(); });
      const b = document.getElementById("check"); if (b) b.onclick = () => { checked = true; draw(); E.grade(q.options[sel].correct ? 1 : 0); };
    };
    draw();
  };

  // ---------- DIAGRAM: click part(s) of a picture ----------
  // q: { visual(states) -> svg with elements class="pk" data-k="key" ; answer:[keys] ; many ; names:{key:label} }
  E.pickTask = function (q) {
    const sel = new Set(); let checked = false;
    const draw = () => {
      const st = {};
      sel.forEach(k => st[k] = "sel");
      if (checked) { sel.forEach(k => st[k] = q.answer.includes(k) ? "ok" : "no"); q.answer.forEach(k => { if (!sel.has(k)) st[k] = "miss"; }); }
      E.stage.innerHTML = E.header() + `<div class="scene pickscene">${q.visual(st)}</div>
        <div class="step-box">${q.many ? "Click <b>every</b> correct part of the picture (click again to undo)." : "Click <b>one</b> part of the picture."} Selected: <b>${sel.size}</b></div>` +
        (checked ? `<div class="notice">✅ Answer: <b>${q.answer.map(k => esc((q.names || {})[k] || k)).join(", ")}</b></div>` : E.actions(sel.size > 0));
      if (checked) return;
      E.stage.querySelectorAll(".pk").forEach(el => el.onclick = () => { const k = el.dataset.k; if (q.many) { sel.has(k) ? sel.delete(k) : sel.add(k); } else { sel.clear(); sel.add(k); } draw(); });
      const b = document.getElementById("check");
      if (b) b.onclick = () => { checked = true; const right = [...sel].filter(k => q.answer.includes(k)).length, wrong = sel.size - right; draw(); E.grade(q.many ? Math.max(0, (right - wrong) / q.answer.length) : (right ? 1 : 0)); };
    };
    draw();
  };
  // highlight ring for a pickable element: returns stroke attrs by state
  E.ring = st => st === "sel" ? 'stroke="#f59e0b" stroke-width="6"' : st === "ok" ? 'stroke="#16a34a" stroke-width="6"' : st === "no" ? 'stroke="#dc2626" stroke-width="6"' : st === "miss" ? 'stroke="#16a34a" stroke-width="6" stroke-dasharray="10 6"' : 'stroke="transparent" stroke-width="6"';

  // standard renderers so a lab can just list them
  E.std = { num: q => E.numTask(q), mcq: q => E.mcqTask(q), pick: q => E.pickTask(q) };
  // template helpers: sim(diff, uses, type, build) / dia(diff, uses, type, build)
  E.simT = (type, diff, uses, build) => ({ type, cat: "sim", diff, uses, build });
  E.diaT = (type, diff, uses, build) => ({ type, cat: "dia", diff, uses, build });
  E.near = (a, b, tol) => Math.abs(a - b) <= (tol != null ? tol : 1e-6);
  E.svgText = (x, y, t, o) => { o = o || {}; return `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-family="Nunito,sans-serif" font-weight="${o.w || 800}" font-size="${o.s || 16}" fill="${o.c || "#1f2a44"}">${t}</text>`; };
})();
