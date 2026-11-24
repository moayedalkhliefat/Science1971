// Science1971 Lab Engine — shared by every lab.
// A lab calls LabEngine.start({ labId, total, levels, renderers, explore, typeInfo, emoji, calculator })
//   levels[n] = { intro, pool: () => [templates] }   template = { type, diff (1-3), uses, build() -> question }
//   renderers[type](q, E)  draws the task into E.stage and calls E.grade(points 0..1) when checked.
//   explore(level, done)  optional "Step 1" screen; call done() to start the tasks.
(function () {
  const esc = S1971.esc;
  const PASS = S1971_CONFIG.PASS_MARK;
  const DIFF_NAME = { 1: "⭐ Easy", 2: "⭐⭐ Medium", 3: "⭐⭐⭐ Hard" };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = (a, n) => shuffle(a).slice(0, Math.min(n, a.length));
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const choice = a => a[Math.floor(Math.random() * a.length)];
  const fmt = n => (Math.round(n * 100) / 100).toString();

  const E = { esc, shuffle, pick, rnd, choice, fmt, PASS, G: null, C: null, stage: null };
  // load the game-break games (assets/minigames.js) next to this engine file
  try { const src = document.currentScript && document.currentScript.src; if (src && !window.MiniGames) { const sc = document.createElement("script"); sc.src = new URL("minigames.js", src).href; document.head.appendChild(sc); } } catch (e) {}

  E.start = async function (cfg) {
    E.C = cfg; E.TOTAL = cfg.total || 12;
    E.stage = document.getElementById("stage");
    document.body.classList.add("lab-fit");
    try { await S1971Lab.init(cfg.labId); }
    catch (e) { E.stage.innerHTML = `<div class="empty">${esc(e.message)}</div>`; return; }
    document.getElementById("lvl-pill").textContent = S1971Lab.levelInfo.name;
    const home = S1971Lab.homeUrl();
    document.getElementById("back-btn").href = home; document.getElementById("home-link").href = home;
    const ban = document.getElementById("banner");
    if (S1971Lab.mode === "preview") ban.innerHTML = `<div class="banner preview">👁️ Teacher preview — you can try every level. Results are not saved.</div>`;
    if (S1971Lab.mode === "guest") ban.innerHTML = `<div class="banner guest">⚠️ You are not logged in — your score will NOT be saved. <a href="${S1971.root()}index.html">Log in here</a></div>`;
    if (cfg.calculator) addCalculator();
    new MutationObserver(() => layout()).observe(E.stage, { childList: true });
    new MutationObserver(() => { if (!E._fitQ) E._fitQ = requestAnimationFrame(() => { E._fitQ = 0; fitTask(); }); }).observe(E.stage, { childList: true, subtree: true });
    window.addEventListener("resize", () => { const g = E.stage.querySelector(".task-grid"); if (g) { g._z = g._cz = 1; g.querySelectorAll(".tg-vis > *, .tg-task > *").forEach(c => { c.style.zoom = ""; }); } fitTask(); });
    showIntro();
  };

  function showIntro() {
    const L = E.C.levels[S1971Lab.level], info = S1971Lab.levelInfo, st = E.stage;
    if (S1971Lab.notAssigned) {
      st.innerHTML = `<div class="center"><div style="font-size:4rem">🚪</div><h1>This lab is not open yet</h1>
        <p class="prompt">Your teacher has not opened <b>${esc(S1971Lab.lab.title)}</b> for your class.</p>
        <div class="actions" style="justify-content:center"><a class="btn orange" href="${S1971Lab.homeUrl()}">⬅ Back to my labs</a></div></div>`;
      return;
    }
    if (S1971Lab.locked) {
      st.innerHTML = `<div class="center"><div style="font-size:4rem">🔒</div><h1>${esc(info.name)} is locked</h1>
        <p class="prompt">Score <b>${PASS}%</b> or more in <b>${esc(S1971Lab.locked.name)}</b> to unlock it.</p>
        <div class="actions" style="justify-content:center"><a class="btn green" href="${S1971Lab.levelUrl(S1971Lab.level - 1)}">Go to ${esc(S1971Lab.locked.name)}</a></div></div>`;
      return;
    }
    st.innerHTML = `<div class="center">
      <div style="font-size:4rem">${E.C.emoji || "🧪"}</div>
      <h1>${esc(S1971Lab.lab.title)}</h1>
      <p><span class="pill" style="background:#ff4d9d;font-size:1rem">${esc(info.name)}</span></p>
      <p class="prompt">${esc(L.intro)}</p>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr));text-align:left;margin:16px 0">
        ${E.C.explore ? `<div class="notice">🔍 <b>Step 1:</b> explore the model.</div>` : ""}
        <div class="notice">🧩 <b>Step ${E.C.explore ? 2 : 1}:</b> ${E.TOTAL} tasks${E.C.plan ? `: <b>${E.C.plan.sim} lab challenges</b> (change the simulation until you reach the goal) + <b>${E.C.plan.dia} diagram tasks</b>` : ""}.</div>
        <div class="notice">📈 Answer correctly and the tasks get <b>harder</b> ⭐⭐⭐</div>
        <div class="notice">🔓 Score <b>${PASS}%</b> to ${S1971Lab.nextLevel ? "unlock <b>" + esc(S1971Lab.nextLevel.name) + "</b>" : "finish as an Expert"}!</div>
      </div>
      <button class="btn green" id="start" style="font-size:1.4rem;padding:14px 34px">${E.C.explore ? "Step 1: Explore 🔍" : "Start 🚀"}</button></div>`;
    document.getElementById("start").onclick = () => E.C.explore ? E.C.explore(S1971Lab.level, startTasks) : startTasks();
  }

  function startTasks() { newGame(); E.t0 = Date.now(); E.tEnd = null; startTimer(); next(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  E.startTasks = startTasks;

  function newGame() {
    const pool = E.C.levels[S1971Lab.level].pool().map(t => Object.assign(t, { used: 0, uses: t.uses || 1 }));
    E.G = { pool, diff: 1, qn: 0, score: 0, answers: [], lastType: null, typesSeen: new Set(), q: null, catCount: {} };
  }

  function nextTemplate(cat) {
    const G = E.G;
    let avail = G.pool.filter(t => t.used < t.uses);
    if (cat) { const c = avail.filter(t => (t.cat || "dia") === cat); if (c.length) avail = c; }
    if (!avail.length) return null;
    for (let d = 0; d <= 2; d++) {
      let c = avail.filter(t => Math.abs(t.diff - G.diff) === d);
      if (!c.length) continue;
      if (d > 0 && c.some(t => t.diff < G.diff)) c = c.filter(t => t.diff < G.diff);
      const fresh = c.filter(t => !G.typesSeen.has(t.type) && t.type !== G.lastType);
      const other = c.filter(t => t.type !== G.lastType);
      return shuffle(fresh.length ? fresh : other.length ? other : c)[0];
    }
    return null;
  }

  function next() {
    const G = E.G;
    if (G.qn >= E.TOTAL) return finish();
    // game break after task 4 (every level, every try). The lab timer pauses; game points never count.
    if (G.qn === 4 && !G.mgDone && window.MiniGames && !E.noGames) {
      G.mgDone = true; E.pausedAt = Date.now();
      return window.MiniGames.open(E.C.labId, () => { E.t0 += Date.now() - E.pausedAt; E.pausedAt = null; next(); });
    }
    let cat = null;
    if (E.C.plan) {
      const want = G.qn % 2 === 0 ? "sim" : "dia", other = want === "sim" ? "dia" : "sim";
      cat = (G.catCount[want] || 0) < E.C.plan[want] ? want : other;
    }
    const t = nextTemplate(cat);
    if (!t) return finish();
    const tc = t.cat || "dia"; G.catCount[tc] = (G.catCount[tc] || 0) + 1;
    t.used++;
    G.q = Object.assign(t.build(), { diff: t.diff, type: t.type, cat: t.cat || "dia" });
    G.qn++;
    G.lastType = G.q.type; G.typesSeen.add(G.q.type);
    if (G.typesSeen.size >= (E.C.typeCycle || 4)) G.typesSeen = new Set([G.q.type]);
    const r = (E.C.renderers && E.C.renderers[G.q.type]) || (G.q.sim ? (qq => E.simTask(qq, qq.sim)) : E.std[G.q.kind]);
    r(G.q, E);
    updateBar();
  }

  E.header = function () {
    const G = E.G, q = G.q, ti = (E.C.typeInfo || {})[q.type] || q.title || "🧩 Task";
    const badge = E.C.plan ? (q.cat === "sim" ? `<span class="catb sim">🧪 Lab challenge</span>` : `<span class="catb dia">🖼️ Diagram task</span>`) : "";
    return `<div class="qhead"><span class="qnum">Task ${G.qn}</span>${badge}<span class="diff">${DIFF_NAME[q.diff]}</span></div>
      <div class="qtype">${ti}</div>${q.prompt ? `<div class="prompt">${q.prompt}</div>` : ""}`;
  };

  E.actions = function (ready, label) {
    return `<div class="actions"><span class="hint">${ready ? "" : "Finish the task to check it."}</span><button class="btn" id="check" ${ready ? "" : "disabled"}>${label || "Check ✔"}</button></div>`;
  };

  // reads a typed number (accepts comma decimals); returns NaN if empty
  E.num = v => { const s = String(v == null ? "" : v).trim().replace(",", "."); return s === "" ? NaN : Number(s); };
  E.close = (got, want, tol) => Math.abs(got - want) <= (tol != null ? tol : Math.max(0.011, Math.abs(want) * 0.02));

  E.grade = function (points, extra) {
    const G = E.G, q = G.q;
    points = Math.max(0, Math.min(1, points));
    G.score += points;
    G.answers.push({ task: (q.cat === "sim" ? "🧪 " : "🖼️ ") + (q.summary || q.type), type: q.type, difficulty: q.diff, points: Math.round(points * 100) / 100 });
    const old = G.diff;
    if (points >= 0.999) G.diff = Math.min(3, G.diff + 1);
    else if (points < 0.5) G.diff = Math.max(1, G.diff - 1);
    const cls = points >= 0.999 ? "good" : points >= 0.5 ? "mid" : "bad";
    const title = points >= 0.999 ? "🎉 Excellent! All correct." : points > 0 ? `👍 ${Math.round(points * 100)}% correct.` : "❌ Not this time.";
    const move = G.diff > old ? " Next task will be harder ⬆️" : G.diff < old ? " Next task will be a bit easier ⬇️" : "";
    const box = document.createElement("div");
    box.innerHTML = `<div class="feedback ${cls}">${title}${move}${q.explain || extra ? `<br><span style="font-weight:600">💡 ${extra || ""}${q.explain || ""}</span>` : ""}</div>
      <div class="actions"><button class="btn green" id="next">${G.qn >= E.TOTAL ? "See my result 🏁" : "Next task ➜"}</button></div>`;
    E.stage.appendChild(box);
    updateBar();
    const bar = E.stage.querySelector(".bar i"); if (bar) bar.style.width = (100 * G.qn / E.TOTAL) + "%";
    document.getElementById("next").onclick = () => { next(); window.scrollTo({ top: 0, behavior: "smooth" }); };
    box.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  async function finish() {
    const G = E.G, max = Math.max(1, G.answers.length);
    E.tEnd = Date.now(); const timeS = Math.round((E.tEnd - E.t0) / 1000); updateBar();
    const score = Math.round(G.score * 100) / 100, exact = 100 * score / max, pct = Math.floor(exact), passed = exact >= PASS - 1e-9;
    const hard = G.answers.filter(a => a.difficulty === 3).length;
    E.stage.innerHTML = `<div class="center">
      <div style="font-size:4rem">${passed ? "🏆" : "💪"}</div>
      <h1>${passed ? "Great job!" : "Keep going!"}</h1>
      <div class="big-score" style="color:${passed ? "#16c172" : "#ff9f1c"}">${pct}%</div>
      <p class="prompt">${fmt(score)} / ${max} points · ${hard} hard ⭐⭐⭐ tasks · ⏱ ${mmss(timeS)}</p>
      <p>${passed ? (S1971Lab.nextLevel ? `🔓 You unlocked <b>${esc(S1971Lab.nextLevel.name)}</b>!` : "🎓 You finished the final level — Expert!") : `You need <b>${PASS}%</b> to pass. Read the tips and try again!`}</p>
      <p id="save-msg" class="hint">Saving your result…</p>
      <div id="cert-btns" class="actions" style="justify-content:center"></div>
      <div class="actions" style="justify-content:center">
        <button class="btn ghost" id="again">🔁 Try again</button>
        ${passed && S1971Lab.nextLevel ? `<a class="btn green" href="${S1971Lab.levelUrl(S1971Lab.level + 1)}">Go to ${esc(S1971Lab.nextLevel.name)} ➜</a>` : ""}
        <a class="btn orange" href="${S1971Lab.homeUrl()}">⬅ Back to my labs</a>
      </div></div>`;
    document.getElementById("again").onclick = startTasks;
    if (passed) burst();
    const r = await S1971Lab.submit(score, max, { level: S1971Lab.level, answers: G.answers, time_s: timeS });
    const msg = document.getElementById("save-msg");
    if (msg) { msg.textContent = r.message; msg.style.color = r.saved ? "#0c8a50" : "#b52f2f"; msg.style.fontWeight = "800"; }
    // certificates
    const cb = document.getElementById("cert-btns"), root = S1971.root(), lab = S1971Lab.lab;
    if (cb && passed) {
      const url = lvl => `${root}certificate.html?lab=${lab.id}&level=${lvl}`;
      if (r.saved) {
        cb.innerHTML = `<a class="btn green" href="${url(S1971Lab.level)}">🎓 Open my Level ${S1971Lab.level} certificate</a>`;
        try {
          const mine = await S1971.rpc("student_my_results", { p_token: S1971Lab.session.token });
          const all = lab.levels.every(lv => mine.some(x => x.lab_id === lv.id && 100 * x.score / x.max_score >= PASS - 1e-9));
          if (all) cb.innerHTML += `<a class="btn blue" href="${url("all")}">🏆 Open my Lab Completion certificate</a>`;
        } catch (e) {}
      } else if (S1971Lab.mode === "preview") {
        cb.innerHTML = `<a class="btn ghost" href="${url(S1971Lab.level)}">👁️ Preview the certificate</a>`;
      } else {
        cb.innerHTML = `<span class="hint">🎓 Log in as a student to get a certificate.</span>`;
      }
    }
  }

  function burst() {
    const b = document.createElement("div"); b.className = "burst";
    const em = E.C.confetti || ["🎉", "⭐", "✨", "🧪"];
    for (let i = 0; i < 40; i++) {
      const s = document.createElement("span");
      s.textContent = em[i % em.length];
      s.style.left = Math.random() * 100 + "vw"; s.style.animationDelay = Math.random() * 0.8 + "s";
      b.appendChild(s);
    }
    document.body.appendChild(b); setTimeout(() => b.remove(), 3800);
  }

  // ---------- sticky student bar: who, lab, task, dots, score, difficulty, streak, timer, tracker ----------
  const mmss = sec => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  E.mmss = mmss;
  function startTimer() {
    clearInterval(E._tick);
    E._tick = setInterval(() => { const el = document.getElementById("sb-time"); if (el && E.t0) el.textContent = mmss(Math.round(((E.tEnd || E.pausedAt || Date.now()) - E.t0) / 1000)); if (E.tEnd) clearInterval(E._tick); }, 1000);
  }
  function who() {
    const s = S1971Lab.session;
    if (S1971Lab.mode === "student" && s) return `<b>${esc(s.name)}</b><span>${[s.grade && "Grade " + esc(s.grade), esc(s.section || "")].filter(Boolean).join(" · ")}</span>`;
    if (S1971Lab.mode === "preview") return `<b>${esc(s ? s.name : "Teacher")}</b><span>Teacher preview</span>`;
    return `<b>Guest</b><span>not logged in</span>`;
  }
  function updateBar() {
    const G = E.G; if (!G) return;
    let bar = E._bar;
    if (!bar) { bar = E._bar = document.createElement("div"); bar.id = "sbar"; bar.className = "sbar"; }
    placeBar();
    const done = G.answers.length, cur = Math.min(G.qn, E.TOTAL);
    let streak = 0; for (let i = G.answers.length - 1; i >= 0 && G.answers[i].points >= 0.999; i--) streak++;
    const passPts = E.TOTAL * PASS / 100, pct = 100 * G.score / E.TOTAL;
    const dots = Array.from({ length: E.TOTAL }, (_, i) => { const a = G.answers[i]; const c = a ? (a.points >= 0.999 ? "ok" : a.points > 0 ? "mid" : "no") : (i === cur - 1 && !E.tEnd ? "cur" : ""); return `<i class="dot ${c}" title="Task ${i + 1}"></i>`; }).join("");
    const open = bar.querySelector(".sb-list:not(.hidden)") != null;
    const secs = E.t0 ? Math.round(((E.tEnd || E.pausedAt || Date.now()) - E.t0) / 1000) : 0;
    bar.innerHTML = `
      <div class="sb-who">👤 ${who()}</div>
      <div class="sb-lab">${E.C.emoji || "🧪"} <b>${esc(S1971Lab.lab.title)}</b><span>${esc(S1971Lab.levelInfo.name)}</span></div>
      <div class="sb-task"><small>TASK</small><b>${cur} / ${E.TOTAL}</b><div class="dots">${dots}</div></div>
      <div class="sb-score"><small>SCORE ${fmt(G.score)} / ${E.TOTAL} · ${Math.round(pct)}%</small><div class="meter"><i style="width:${Math.min(100, pct)}%" class="${pct >= PASS ? "pass" : ""}"></i><span class="line" style="left:${PASS}%"></span></div>
        <small class="need">${G.score >= passPts ? "✅ Pass mark reached!" : `Need ${fmt(passPts)} points (${PASS}%) to pass`}</small></div>
      <div class="sb-stats"><div class="sb-diff"><small>DIFFICULTY</small><b>${[1, 2, 3].map(i => `<span class="${i <= G.diff ? "on" : ""}">★</span>`).join("")}</b></div>
      <div class="sb-streak"><small>STREAK</small><b>🔥 ${streak}</b></div></div>
      <div class="sb-time"><small>TIME</small><b id="sb-time">${mmss(secs)}</b></div>
      <div class="sb-cells">${Array.from({ length: E.TOTAL }, (_, i) => { const a = G.answers[i], c = a ? (a.points >= 0.999 ? "ok" : a.points > 0 ? "mid" : "no") : (i === cur - 1 && !E.tEnd ? "cur" : "");
        return `<div class="cell ${c}" title="${a ? esc(a.task) : "Task " + (i + 1)}"><b>${i + 1}</b><i>${a ? (a.points >= 0.999 ? "✅" : a.points > 0 ? "🟡" : "❌") : c === "cur" ? "▶" : "·"}</i><small>${a ? fmt(a.points) + " pt" : ""}</small></div>`; }).join("")}</div>
      <button class="sb-trk" type="button">📋 Details</button>
      <div class="sb-list ${open ? "" : "hidden"}">${done ? `<table><tr><th>#</th><th>Task</th><th>Level</th><th>Points</th><th></th></tr>${G.answers.map((a, i) => `<tr><td>${i + 1}</td><td>${esc(a.task)}</td><td>${"★".repeat(a.difficulty)}</td><td>${fmt(a.points)}</td><td>${a.points >= 0.999 ? "✅" : a.points > 0 ? "🟡" : "❌"}</td></tr>`).join("")}</table>` : `<p class="hint">Your finished tasks will appear here.</p>`}</div>`;
    bar.querySelector(".sb-trk").onclick = () => bar.querySelector(".sb-list").classList.toggle("hidden");
  }
  E.updateBar = updateBar;
  // the student box sits at the top of the task column; on screens without a task column it is a strip above the stage
  function placeBar() {
    const bar = E._bar; if (!bar) return;
    const task = E.stage && E.stage.querySelector(":scope > .task-grid > .tg-task");
    if (task) { bar.classList.add("box"); if (task.firstElementChild !== bar) task.insertBefore(bar, task.firstChild); }
    else { bar.classList.remove("box"); const w = E.stage.parentNode; if (bar.parentNode !== w || bar.nextElementSibling !== E.stage) w.insertBefore(bar, E.stage); }
  }

  // ---------- two-column layout: simulation/picture LEFT, question + task RIGHT ----------
  const VIS = ".scene,.diagram,.atom-box,.mini-atoms,.instruments,.controls";
  function layout() {
    const st = E.stage; if (!st || st._busy) return;
    const grid = st.querySelector(":scope > .task-grid");
    if (grid) { [...st.children].forEach(c => { if (c !== grid) grid.querySelector(".tg-task").appendChild(c); }); placeBar(); return; }
    const flat = [];
    [...st.children].forEach(n => { if (n.classList.contains("split") || n.classList.contains("atom-wrap")) flat.push(...n.children); else flat.push(n); });
    // a picture box with a caption under it: the box and its caption both stay on the LEFT, and the box itself gets the fixed size
    const keepLeft = new Set();
    for (let i = flat.length - 1; i >= 0; i--) { const n = flat[i]; if (n.tagName === "DIV" && n.querySelector(":scope > .atom-box") && !n.querySelector(".palette,.tray,.chips")) { const kids = [...n.children]; kids.forEach(k => keepLeft.add(k)); flat.splice(i, 1, ...kids); } }
    const isVis = n => keepLeft.has(n) || n.matches(VIS) || (!!n.querySelector(".atom-box,.diagram") && !n.querySelector(".palette,.tray,.chips"));
    if (!flat.some(isVis)) { placeBar(); return; }
    st._busy = true;
    const g = document.createElement("div"); g.className = "task-grid";
    const L = document.createElement("div"); L.className = "tg-vis"; const R = document.createElement("div"); R.className = "tg-task";
    g.append(L, R);
    flat.forEach(n => (isVis(n) ? L : R).appendChild(n));
    st.innerHTML = ""; st.appendChild(g);
    st._busy = false;
    placeBar();
  }
  E.layout = layout;
  // fit one task on the screen. The two halves never change size:
  //  - LEFT: the simulation / picture box always has the same size (pictures are centred); controls shrink if needed
  //  - RIGHT: if the question is too long, its text and options get a bit smaller (no scrolling)
  const MAINVIS = ":scope > .scene, :scope > .diagram, :scope > .atom-box, :scope > div:has(> .atom-box)";
  const shrink = (box, kids, key, g) => {
    const apply = z => kids.forEach(c => { c.style.zoom = z === 1 ? "" : z; });
    g[key] = g[key] || 1; apply(g[key]);
    while (box.scrollHeight > box.clientHeight + 2 && g[key] > 0.6) { g[key] = Math.round((g[key] - 0.04) * 100) / 100; apply(g[key]); }
  };
  function fitTask() {
    if (!document.body.classList.contains("lab-fit") || !matchMedia("(min-width:900px) and (min-height:560px)").matches) return;
    const g = E.stage && E.stage.querySelector(":scope > .task-grid"); if (!g) return;
    const t = g.querySelector(".tg-task"), v = g.querySelector(".tg-vis"); if (!t) return;
    if (v) {
      const main = v.querySelector(MAINVIS);
      [...v.children].forEach(c => c.classList.toggle("mainvis", c === main));
      v.classList.toggle("pic", !v.querySelector(":scope > .controls, :scope > .instruments"));
      shrink(v, [...v.children].filter(c => c !== main), "_cz", g);
    }
    shrink(t, [...t.children].filter(c => c !== E._bar), "_z", g);
    const fb = t.querySelector(".feedback");
    if (fb && t.scrollHeight > t.clientHeight + 2 && !fb._seen) { fb._seen = true; t.scrollTop = t.scrollHeight; }
  }
  E.fitTask = fitTask;

  // ---------- shared renderers ----------
  // chips into slots: q.slots=[{left(html), answer}], optional q.side(html) shown at left (e.g. a diagram)
  E.chipTask = function (q, opts) {
    opts = opts || {};
    const chips = shuffle(q.slots.map((s, i) => ({ id: i, text: s.answer })));
    const placed = {}; let selected = null, checked = false;
    const draw = states => {
      const free = chips.filter(c => !Object.values(placed).includes(c.id));
      const ready = Object.keys(placed).length === q.slots.length;
      const slotsHtml = q.slots.map((s, i) => {
        const c = placed[i] != null ? chips.find(x => x.id === placed[i]) : null;
        const st = states ? (states[i] ? "ok" : "no") : "";
        return `<div class="slot"><div class="left">${s.left}</div>
          <div class="target ${c ? "filled" : ""} ${st}" data-slot="${i}">${c ? esc(c.text) : `<span class="hint">${opts.dropText || "drop here"}</span>`}
          ${states && !states[i] ? `<span class="fix">✔ ${esc(s.answer)}</span>` : ""}</div></div>`;
      }).join("");
      const chipsHtml = checked ? "" : `<div class="chips">${free.map(c => `<span class="chip ${selected === c.id ? "sel" : ""}" draggable="true" data-chip="${c.id}">${esc(c.text)}</span>`).join("") || `<span class="hint">All placed ✔</span>`}</div>`;
      const side = opts.side ? opts.side(states) : "";
      const body = side ? `<div class="split"><div class="diagram">${side}</div><div>${chipsHtml}<div class="slots">${slotsHtml}</div></div></div>` : chipsHtml + `<div class="slots">${slotsHtml}</div>`;
      E.stage.innerHTML = E.header() + `<p class="hint">Tap a card, then tap a box — or drag it. Tap a filled box to take the card back.</p>` + body + (checked ? "" : E.actions(ready));
      if (checked) return;
      E.stage.querySelectorAll(".chip").forEach(el => {
        el.onclick = () => { selected = selected === +el.dataset.chip ? null : +el.dataset.chip; draw(); };
        el.ondragstart = e => { e.dataTransfer.setData("text/plain", el.dataset.chip); selected = +el.dataset.chip; };
      });
      E.stage.querySelectorAll(".target").forEach(el => {
        const i = +el.dataset.slot;
        el.onclick = () => { if (selected != null) { placed[i] = selected; selected = null; } else if (placed[i] != null) delete placed[i]; draw(); };
        el.ondragover = e => { e.preventDefault(); el.classList.add("over"); };
        el.ondragleave = () => el.classList.remove("over");
        el.ondrop = e => { e.preventDefault(); const id = +e.dataTransfer.getData("text/plain"); for (const k in placed) if (placed[k] === id) delete placed[k]; placed[i] = id; selected = null; draw(); };
      });
      const btn = document.getElementById("check");
      if (btn) btn.onclick = () => {
        const states = q.slots.map((s, i) => chips.find(c => c.id === placed[i]).text === s.answer);
        checked = true; draw(states);
        E.grade(states.filter(Boolean).length / states.length);
      };
    };
    draw();
  };

  // multiple-choice block (returns html + wires events); used inside other tasks
  E.optionsHtml = (options, sel, checked) => `<div class="opts">${options.map((o, i) => {
    let cls = sel === i ? "sel" : ""; if (checked) cls = o.correct ? "ok" : sel === i ? "no" : "";
    return `<button class="opt ${cls}" data-i="${i}" ${checked ? "disabled" : ""}>${String.fromCharCode(65 + i)}. ${esc(o.text)}</button>`;
  }).join("")}</div>`;
  E.mkOptions = (correct, wrong) => shuffle([{ text: correct, correct: true }].concat(wrong.map(w => ({ text: w, correct: false }))));

  // ---------- drag & drop (mouse, touch, or tap-then-tap) ----------
  // tokens: elements with data-id ; zone: element to drop on ; onDrop(id, clientX, clientY)
  E.dragDrop = function (tokens, zone, onDrop) {
    let sel = null;
    tokens.forEach(el => {
      el.style.touchAction = "none";
      el.onpointerdown = ev => {
        ev.preventDefault();
        const x0 = ev.clientX, y0 = ev.clientY; let moved = false;
        const g = document.createElement("div"); g.className = "drag-ghost"; g.innerHTML = el.dataset.ghost || el.innerHTML;
        const mv = e => { if (Math.hypot(e.clientX - x0, e.clientY - y0) > 6) { moved = true; if (!g.parentNode) document.body.appendChild(g); } g.style.left = e.clientX + "px"; g.style.top = e.clientY + "px"; };
        const up = e => {
          window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); g.remove();
          if (moved) { const r = zone.getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) onDrop(el.dataset.id, e.clientX, e.clientY); }
          else { sel = sel === el.dataset.id ? null : el.dataset.id; tokens.forEach(t => t.classList.toggle("sel", t.dataset.id === sel)); }
        };
        window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
      };
    });
    zone.addEventListener("click", ev => { if (sel) { const id = sel; sel = null; onDrop(id, ev.clientX, ev.clientY); } });
  };
  E.svgPoint = (svg, cx, cy) => { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
  // number box next to a slider: the student can type any value in range (the slider itself does not move)
  E.numBox = (id, min, max, unit, val, dis) => `<span class="nbx"><input type="number" class="numbox" id="${id}" data-min="${min}" data-max="${max}" data-unit="${unit || ""}" step="any" inputmode="decimal" placeholder="type" title="Type a number" value="${val == null ? "" : val}" ${dis || ""}></span>`;
  // returns the typed number, or null (and shows a red message) when it is empty / not a number / out of range
  E.readNumBox = el => {
    const box = el.closest(".sl"), err = box && box.querySelector(".nerr"), raw = String(el.value).trim();
    const lo = +el.dataset.min, hi = +el.dataset.max, x = E.num(raw), say = t => { if (err) err.textContent = t; };
    if (raw === "") { say(""); return null; }
    if (!Number.isFinite(x) || x < lo - 1e-9 || x > hi + 1e-9) { say(`Enter ${fmt(lo)}–${fmt(hi)}${el.dataset.unit ? " " + el.dataset.unit : ""}`); return null; }
    say(""); return x;
  };
  E.wireNumBox = (el, cb) => { if (!el) return; el.onchange = () => { const x = E.readNumBox(el); if (x != null) cb(x); }; el.onkeydown = ev => { if (ev.key === "Enter") { ev.preventDefault(); el.blur(); } }; };
  E.slider = (id, label, min, max, step, val, unit) => `<label class="sl" style="margin:0">${label}: <b><span id="${id}-v">${val}</span> ${unit}</b>
    <span class="slrow"><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}">${E.numBox(id + "-n", min, max, unit)}</span><small class="nerr"></small></label>`;

  // ---------- calculator ----------
  function addCalculator() {
    const fab = document.createElement("button");
    fab.className = "btn sm blue"; fab.innerHTML = "🧮 Calculator"; fab.type = "button";
    const bar = document.querySelector(".topbar .row");
    if (bar) bar.insertBefore(fab, bar.firstChild); else { fab.classList.add("calc-fab"); document.body.appendChild(fab); }
    let box = null, expr = "";
    fab.onclick = () => {
      if (box) { box.remove(); box = null; return; }
      box = document.createElement("div"); box.className = "calc";
      const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+", "C", "⌫", "(", ")"];
      box.innerHTML = `<div class="row between" style="margin-bottom:6px"><b style="color:#b9b4ff">🧮 Calculator</b><button class="cl" id="calc-x" style="padding:4px 10px">✕</button></div><div class="scr" id="calc-scr">0</div><div class="keys">${keys.map(k => `<button class="${"÷×−+".includes(k) ? "op" : k === "=" ? "eq" : k === "C" ? "cl" : ""}" data-k="${k}">${k}</button>`).join("")}</div>`;
      document.body.appendChild(box);
      const scr = box.querySelector("#calc-scr");
      box.querySelector("#calc-x").onclick = () => { box.remove(); box = null; };
      box.querySelectorAll("button[data-k]").forEach(b => b.onclick = () => {
        const k = b.dataset.k;
        if (k === "C") expr = "";
        else if (k === "⌫") expr = expr.slice(0, -1);
        else if (k === "=") {
          try {
            const js = expr.replace(/÷/g, "/").replace(/×/g, "*").replace(/−/g, "-");
            if (!/^[0-9+\-*/(). ]+$/.test(js)) throw 0;
            const v = Function('"use strict";return (' + js + ")")();
            expr = Number.isFinite(v) ? String(Math.round(v * 1e6) / 1e6) : "Error";
          } catch (e) { expr = "Error"; }
        } else { if (expr === "Error") expr = ""; expr += k; }
        scr.textContent = expr || "0";
      });
    };
  }

  window.LabEngine = E;
})();
