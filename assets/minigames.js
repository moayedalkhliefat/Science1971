"use strict";
// ===== Science Lab 1971 — game break (after task 4 in every lab) =====
// 3 random games from a pool of 7; the student picks one. The game ends after 1 minute or 10 points
// (whichever comes first) or when the student presses Skip. Game points and time never count in the lab.
(function () {
  const MG = window.MiniGames = {};
  const W = 720, H = 420, GOAL = 10, LIMIT = 60;

  // ---------- topic themes: things to collect (good) and to avoid (bad), lab colour ----------
  const T = (good, bad, word, c1, hero) => ({ good, bad, word, c1, hero });
  const THEMES = {
    digestive: T(["🍞", "🍎", "🥕", "🧀"], ["🦠"], "food", "#c2185b", "😋"),
    speed: T(["⏱️", "🏁", "⭐"], ["🚧"], "speed stars", "#ef6c00", "🏃"),
    atom: T(["🔵", "🔴", "⚪"], ["💥"], "particles", "#3949ab", "⚛️"),
    density: T(["🪵", "🧊", "🎈"], ["🪨", "🧱"], "floaters", "#0277bd", "🛟"),
    energy: T(["⚡", "⭐", "🔋"], ["🧱"], "energy", "#f9a825", "🛹"),
    circuits: T(["💡", "🔋", "⚡"], ["⛔"], "charges", "#f9a825", "🔌"),
    forces: T(["📦", "⚙️", "⭐"], ["🧱"], "boxes", "#6d4c41", "💪"),
    states: T(["💧", "🧊", "💨"], ["🔥"], "water particles", "#00838f", "🧊"),
    balance: T(["⚗️", "🧪", "⚖️"], ["💥"], "atoms", "#5e35b1", "⚖️"),
    ph: T(["🧪", "🍋", "🧼"], ["☠️"], "liquids", "#8e24aa", "🧪"),
    molecule: T(["⚛️", "💧", "🫧"], ["💥"], "molecules", "#00897b", "⚛️"),
    selection: T(["🥕", "🌿", "🥬"], ["🐺"], "carrots", "#6d4c41", "🐇"),
    cells: T(["🧫", "🧬", "🔬"], ["🦠"], "cells", "#2e7d32", "🔬"),
    foodweb: T(["🌿", "🐛", "🐟"], ["🦅"], "food", "#558b2f", "🐸"),
    photo: T(["☀️", "💧", "🌱"], ["🐛"], "sunlight", "#43a047", "🌱"),
    membrane: T(["🫧", "💧", "🟡"], ["🦠"], "molecules", "#00acc1", "🫧"),
    neuron: T(["⚡", "🧠", "✨"], ["💤"], "signals", "#7b1fa2", "🧠"),
    gene: T(["🧬", "🟦", "🟨"], ["💥"], "DNA bases", "#3949ab", "🧬"),
    vision: T(["🔴", "🟢", "🔵"], ["⚫"], "colours of light", "#e53935", "👁️"),
    eating: T(["🍎", "🥦", "🍌", "🥕"], ["🧱"], "healthy food", "#ef6c00", "🏃"),
    molarity: T(["🧪", "💧", "🧂"], ["☠️"], "solute", "#1e88e5", "🧪"),
    gas: T(["🎈", "🫧", "💨"], ["📌"], "gas particles", "#ff7043", "🎈"),
    shapes: T(["🔷", "🔺", "⚛️"], ["💥"], "shapes", "#3949ab", "🔷"),
    isotopes: T(["⚛️", "🔵", "⚪"], ["☢️"], "nucleons", "#5c6bc0", "⚛️"),
    solutions: T(["🧂", "🍬", "💧"], ["🪨"], "salt & sugar", "#26a69a", "🥄"),
    projectile: T(["🎯", "⭐", "🏀"], ["🧱"], "targets", "#ef6c00", "🎯"),
    pendulum: T(["⏱️", "⭐", "🔔"], ["🧱"], "ticks", "#6d4c41", "⏱️"),
    springs: T(["🔩", "⚖️", "⭐"], ["🧱"], "weights", "#546e7a", "🔩"),
    balance2: T(["⚖️", "⭐", "📦"], ["🧱"], "weights", "#8d6e63", "⚖️"),
    waves: T(["🌊", "🎵", "〰️"], ["🪨"], "waves", "#0288d1", "🏄"),
    light: T(["🔦", "🌈", "💡"], ["⚫"], "light rays", "#f9a825", "🔦"),
    orbits: T(["🪐", "🌍", "🌙", "⭐"], ["☄️"], "planets", "#283593", "🚀"),
    magnets: T(["🧲", "📎", "🔩"], ["🪵"], "iron objects", "#c62828", "🧲"),
    static: T(["🎈", "⚡", "✨"], ["💧"], "charges", "#7e57c2", "🎈"),
    eforms: T(["☀️", "⚡", "🔋"], ["🔥"], "energy", "#f9a825", "🔋")
  };
  const DEF = T(["⭐", "✨", "🔬"], ["🧱"], "stars", "#1e3a8a", "🚀");

  const GAMES = {
    tetris: { name: "Tetris", icon: "🧱", how: "◀ ▶ move · ▲ rotate · ▼ drop. Clear a line = 1 point." },
    shooter: { name: "Shooter", icon: "🛸", how: "◀ ▶ move — you fire automatically. Hit = 1 point." },
    snake: { name: "Snake", icon: "🐍", how: "Arrows steer. Each item eaten = 1 point." },
    bicycle: { name: "Bicycle", icon: "🚲", how: "▲ or Space to jump. Collect = 1 point, jump over obstacles." },
    runner: { name: "3-Lane Runner", icon: "🏃", how: "◀ ▶ change lane. Collect = 1 point, dodge obstacles." },
    carrace: { name: "Car Race", icon: "🏎️", how: "◀ ▶ steer. Collect = 1 point, avoid obstacles." },
    collector: { name: "Energy Collector", icon: "✨", how: "Move with the mouse, finger or arrows. Each orb = 1 point." }
  };

  // ---------- small helpers ----------
  const rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const em = (c, ch, x, y, s) => { c.font = `${s}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(ch, x, y); };
  const hit = (a, b, r) => Math.hypot(a.x - b.x, a.y - b.y) < r;
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; const t = f < 0 ? 0 : 255, p = Math.abs(f); r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b); return `rgb(${r},${g},${b})`; };
  let AC = null; const beep = (f, d) => { try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; o.type = "triangle"; g.gain.value = 0.06; o.connect(g); g.connect(AC.destination); o.start(); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d); o.stop(AC.currentTime + d); } catch (e) {} };
  const sky = (c, th) => { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, shade(th.c1, 0.86)); g.addColorStop(1, shade(th.c1, 0.97)); c.fillStyle = g; c.fillRect(0, 0, W, H); };

  // ---------- the 7 games (each: init / step(dt) / draw / press(key)) ----------
  const MAKE = {
    snake(th, api) {
      const C = 30, CW = W / C, CH = H / C; let s, dir, nd, acc = 0, food, flash = 0;
      const place = () => { do { food = { x: Math.floor(rnd(0, CW)), y: Math.floor(rnd(0, CH)), e: pick(th.good) }; } while (s.some(p => p.x === food.x && p.y === food.y)); };
      s = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }]; dir = nd = { x: 1, y: 0 }; place();
      return {
        press(k) { const m = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] }[k]; if (m && !(m[0] === -dir.x && m[1] === -dir.y)) nd = { x: m[0], y: m[1] }; },
        step(dt) { flash = Math.max(0, flash - dt); acc += dt; if (acc < 0.13) return; acc = 0; dir = nd;
          const h = { x: (s[0].x + dir.x + CW) % CW, y: (s[0].y + dir.y + CH) % CH };
          if (s.some(p => p.x === h.x && p.y === h.y)) { s = s.slice(0, 3); flash = 0.4; beep(160, 0.2); }
          s.unshift(h); if (h.x === food.x && h.y === food.y) { api.point(); place(); } else s.pop(); },
        draw(c) { sky(c, th); c.fillStyle = shade(th.c1, 0.75); for (let x = 0; x < CW; x++) for (let y = 0; y < CH; y++) if ((x + y) % 2) c.fillRect(x * C, y * C, C, C);
          em(c, food.e, food.x * C + C / 2, food.y * C + C / 2 + 1, 24);
          s.forEach((p, i) => { c.fillStyle = flash > 0 ? "#e53935" : i ? shade(th.c1, 0.15) : th.c1; c.beginPath(); c.roundRect(p.x * C + 2, p.y * C + 2, C - 4, C - 4, 8); c.fill(); });
          c.fillStyle = "#fff"; c.beginPath(); c.arc(s[0].x * C + C / 2 + dir.x * 5 - dir.y * 5, s[0].y * C + C / 2 + dir.y * 5 - dir.x * 5, 3.5, 0, 7); c.arc(s[0].x * C + C / 2 + dir.x * 5 + dir.y * 5, s[0].y * C + C / 2 + dir.y * 5 + dir.x * 5, 3.5, 0, 7); c.fill(); }
      };
    },
    tetris(th, api) {
      const CO = 8, RO = 14, S = 28, OX = (W - CO * S) / 2, OY = 14;
      const SH = [[[1, 1, 1, 1]], [[1, 1], [1, 1]], [[0, 1, 0], [1, 1, 1]], [[1, 0, 0], [1, 1, 1]], [[0, 0, 1], [1, 1, 1]], [[1, 1, 0], [0, 1, 1]], [[0, 1, 1], [1, 1, 0]]];
      let grid = Array.from({ length: RO }, () => Array(CO).fill(null)), cur, acc = 0, drop = false;
      const spawn = () => { const m = pick(SH); cur = { m, x: Math.floor((CO - m[0].length) / 2), y: 0, e: pick(th.good) }; if (bad(cur.m, cur.x, cur.y)) grid = grid.map(r => r.fill(null)); };
      const bad = (m, x, y) => m.some((r, j) => r.some((v, i) => v && (x + i < 0 || x + i >= CO || y + j >= RO || (y + j >= 0 && grid[y + j][x + i]))));
      const lock = () => { cur.m.forEach((r, j) => r.forEach((v, i) => { if (v && cur.y + j >= 0) grid[cur.y + j][cur.x + i] = cur.e; })); let n = 0;
        grid = grid.filter(r => { const full = r.every(Boolean); if (full) n++; return !full; }); while (grid.length < RO) grid.unshift(Array(CO).fill(null));
        for (let i = 0; i < n; i++) api.point(); beep(n ? 660 : 300, 0.08); spawn(); };
      spawn();
      return {
        press(k) { if (k === "left" && !bad(cur.m, cur.x - 1, cur.y)) cur.x--; if (k === "right" && !bad(cur.m, cur.x + 1, cur.y)) cur.x++;
          if (k === "up") { const r = cur.m[0].map((_, i) => cur.m.map(row => row[i]).reverse()); for (const dx of [0, -1, 1, -2]) if (!bad(r, cur.x + dx, cur.y)) { cur.m = r; cur.x += dx; break; } }
          if (k === "down" || k === "action") drop = true; },
        release(k) { if (k === "down" || k === "action") drop = false; },
        step(dt) { acc += dt; if (acc < (drop ? 0.04 : 0.45)) return; acc = 0; if (!bad(cur.m, cur.x, cur.y + 1)) cur.y++; else lock(); },
        draw(c) { sky(c, th); c.fillStyle = "rgba(255,255,255,.85)"; c.fillRect(OX - 6, OY - 6, CO * S + 12, RO * S + 12); c.strokeStyle = th.c1; c.lineWidth = 3; c.strokeRect(OX - 6, OY - 6, CO * S + 12, RO * S + 12);
          const cell = (x, y, e) => { c.fillStyle = shade(th.c1, 0.55); c.fillRect(OX + x * S + 1, OY + y * S + 1, S - 2, S - 2); em(c, e, OX + x * S + S / 2, OY + y * S + S / 2 + 1, 18); };
          grid.forEach((r, y) => r.forEach((e, x) => e && cell(x, y, e))); cur.m.forEach((r, j) => r.forEach((v, i) => v && cur.y + j >= 0 && cell(cur.x + i, cur.y + j, cur.e)));
          c.fillStyle = th.c1; c.font = "700 15px Inter,sans-serif"; c.textAlign = "left"; c.fillText("Fill a whole row", 18, 30); c.fillText("to clear it!", 18, 52); }
      };
    },
    shooter(th, api) {
      const p = { x: W / 2, y: H - 40 }; let shots = [], foes = [], acc = 0, fire = 0, keys = {};
      return {
        press(k) { keys[k] = 1; }, release(k) { keys[k] = 0; },
        step(dt) { p.x = Math.max(24, Math.min(W - 24, p.x + ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 330 * dt));
          fire += dt; if (fire > 0.3) { fire = 0; shots.push({ x: p.x, y: p.y - 22 }); }
          acc += dt; if (acc > 0.75) { acc = 0; foes.push({ x: rnd(40, W - 40), y: -20, v: rnd(55, 95), e: pick(th.bad) }); }
          shots.forEach(s => s.y -= 480 * dt); foes.forEach(f => { f.y += f.v * dt; f.x += Math.sin(f.y / 30) * 0.6; });
          shots = shots.filter(s => { const f = foes.find(f => hit(s, f, 24)); if (f) { f.dead = 1; api.point(); return false; } return s.y > -10; });
          foes = foes.filter(f => !f.dead && f.y < H + 20); },
        draw(c) { sky(c, th); c.fillStyle = shade(th.c1, 0.6); for (let i = 0; i < 40; i++) c.fillRect((i * 97) % W, (i * 53 + performance.now() / 20) % H, 2, 2);
          foes.forEach(f => em(c, f.e, f.x, f.y, 32)); c.fillStyle = "#ffb300"; shots.forEach(s => { c.fillRect(s.x - 2, s.y - 9, 4, 14); });
          em(c, th.hero || "🚀", p.x, p.y, 38); }
      };
    },
    bicycle(th, api) {
      const GY = H - 70; const b = { x: 130, y: GY, vy: 0 }; let things = [], acc = 0, slow = 0, off = 0;
      const jump = () => { if (b.y >= GY - 0.5) { b.vy = -560; beep(520, 0.06); } };
      return {
        press(k) { if (k === "up" || k === "action") jump(); },
        step(dt) { slow = Math.max(0, slow - dt); const v = slow ? 120 : 270; off += v * dt;
          b.vy += 1400 * dt; b.y = Math.min(GY, b.y + b.vy * dt); if (b.y >= GY) b.vy = 0;
          acc += dt; if (acc > rnd(0.9, 1.4)) { acc = 0; const good = Math.random() < 0.6; things.push({ x: W + 30, y: good ? pick([GY - 10, GY - 120]) : GY + 4, good, e: good ? pick(th.good) : pick(th.bad) }); }
          things.forEach(t => t.x -= v * dt);
          things = things.filter(t => { if (hit(t, { x: b.x, y: b.y - 18 }, t.good ? 36 : 30)) { if (t.good) api.point(); else { slow = 0.8; beep(150, 0.2); } return false; } return t.x > -30; }); },
        draw(c) { sky(c, th); c.fillStyle = shade(th.c1, 0.7); for (let i = 0; i < 6; i++) { const x = ((i * 160 - off * 0.3) % (W + 160) + W + 160) % (W + 160) - 80; c.beginPath(); c.arc(x, GY - 10, 70, Math.PI, 0); c.fill(); }
          c.fillStyle = shade(th.c1, 0.25); c.fillRect(0, GY + 22, W, H - GY); c.fillStyle = "#fff"; for (let x = -((off) % 60); x < W; x += 60) c.fillRect(x, GY + 40, 30, 4);
          things.forEach(t => em(c, t.e, t.x, t.y, t.good ? 30 : 34)); c.save(); if (slow) c.globalAlpha = 0.55 + 0.45 * Math.sin(performance.now() / 50); em(c, "🚴", b.x, b.y, 54); c.restore(); }
      };
    },
    runner(th, api) {
      let lane = 1, items = [], acc = 0, stumble = 0, t = 0; const HY = 90, BY = H - 40;
      const lx = (l, y) => { const k = (y - HY) / (BY - HY); return W / 2 + (l - 1) * (60 + 170 * k); };
      return {
        press(k) { if (k === "left") lane = Math.max(0, lane - 1); if (k === "right") lane = Math.min(2, lane + 1); },
        step(dt) { t += dt; stumble = Math.max(0, stumble - dt); const v = stumble ? 0.25 : 0.55;
          acc += dt; if (acc > 0.6) { acc = 0; const good = Math.random() < 0.6; items.push({ l: Math.floor(rnd(0, 3)), k: 0, good, e: good ? pick(th.good) : pick(th.bad) }); }
          items.forEach(i => i.k += v * dt);
          items = items.filter(i => { if (i.k > 0.9 && i.k < 1.02 && i.l === lane) { if (i.good) api.point(); else { stumble = 0.7; beep(150, 0.2); } return false; } return i.k < 1.1; }); },
        draw(c) { sky(c, th); c.fillStyle = shade(th.c1, 0.35); c.beginPath(); c.moveTo(W / 2 - 90, HY); c.lineTo(W / 2 + 90, HY); c.lineTo(W / 2 + 330, H); c.lineTo(W / 2 - 330, H); c.fill();
          c.strokeStyle = "rgba(255,255,255,.7)"; c.lineWidth = 3; c.setLineDash([18, 16]); c.lineDashOffset = -t * 160; [0.5, 1.5].forEach(l => { c.beginPath(); c.moveTo(lx(l, HY), HY); c.lineTo(lx(l, H), H); c.stroke(); }); c.setLineDash([]);
          items.forEach(i => { const y = HY + (BY - HY) * i.k; em(c, i.e, lx(i.l, y), y - 8, 14 + 34 * i.k); });
          c.save(); if (stumble) c.globalAlpha = 0.55 + 0.45 * Math.sin(performance.now() / 50); em(c, "🏃", lx(lane, BY), BY - 16, 50); c.restore(); }
      };
    },
    carrace(th, api) {
      const RL = 160, RR = W - 160; const car = { x: W / 2, y: H - 70 }; let items = [], acc = 0, off = 0, slow = 0, keys = {};
      return {
        press(k) { keys[k] = 1; }, release(k) { keys[k] = 0; },
        step(dt) { slow = Math.max(0, slow - dt); const v = slow ? 140 : 300; off += v * dt;
          car.x = Math.max(RL + 26, Math.min(RR - 26, car.x + ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * 320 * dt));
          acc += dt; if (acc > 0.55) { acc = 0; const good = Math.random() < 0.55; items.push({ x: rnd(RL + 30, RR - 30), y: -30, good, e: good ? pick(th.good) : pick(th.bad) }); }
          items.forEach(i => i.y += v * dt);
          items = items.filter(i => { if (hit(i, car, 40)) { if (i.good) api.point(); else { slow = 0.8; beep(150, 0.2); } return false; } return i.y < H + 30; }); },
        draw(c) { c.fillStyle = shade(th.c1, 0.55); c.fillRect(0, 0, W, H); c.fillStyle = "#455a64"; c.fillRect(RL, 0, RR - RL, H);
          c.fillStyle = "#fff"; c.fillRect(RL, 0, 6, H); c.fillRect(RR - 6, 0, 6, H); for (let y = (off % 60) - 60; y < H; y += 60) { c.fillRect(W / 2 - 3, y, 6, 30); }
          items.forEach(i => em(c, i.e, i.x, i.y, 34));
          c.save(); c.translate(car.x, car.y); if (slow) c.rotate(Math.sin(performance.now() / 40) * 0.12);
          c.fillStyle = th.c1; c.beginPath(); c.roundRect(-20, -34, 40, 68, 10); c.fill(); c.fillStyle = "#bbdefb"; c.fillRect(-14, -22, 28, 14); c.fillRect(-14, 12, 28, 10);
          c.fillStyle = "#212121"; [[-24, -22], [18, -22], [-24, 12], [18, 12]].forEach(([x, y]) => c.fillRect(x, y, 6, 14)); c.restore(); }
      };
    },
    collector(th, api) {
      const p = { x: W / 2, y: H / 2 }; let orbs = [], foes = [], keys = {}, slow = 0, target = null;
      const add = () => orbs.push({ x: rnd(40, W - 40), y: rnd(40, H - 40), e: pick(th.good), ph: rnd(0, 6) });
      for (let i = 0; i < 4; i++) add(); for (let i = 0; i < 2; i++) foes.push({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-90, 90), vy: rnd(-90, 90), e: pick(th.bad) });
      return {
        press(k) { keys[k] = 1; target = null; }, release(k) { keys[k] = 0; },
        pointer(x, y) { target = { x, y }; },
        step(dt) { slow = Math.max(0, slow - dt); const sp = slow ? 120 : 300;
          if (target) { const dx = target.x - p.x, dy = target.y - p.y, d = Math.hypot(dx, dy); if (d > 2) { const m = Math.min(d, sp * dt); p.x += dx / d * m; p.y += dy / d * m; } }
          else { p.x += ((keys.right ? 1 : 0) - (keys.left ? 1 : 0)) * sp * dt; p.y += ((keys.down ? 1 : 0) - (keys.up ? 1 : 0)) * sp * dt; }
          p.x = Math.max(20, Math.min(W - 20, p.x)); p.y = Math.max(20, Math.min(H - 20, p.y));
          orbs = orbs.filter(o => { if (hit(o, p, 36)) { api.point(); return false; } return true; }); while (orbs.length < 4) add();
          foes.forEach(f => { f.x += f.vx * dt; f.y += f.vy * dt; if (f.x < 20 || f.x > W - 20) f.vx *= -1; if (f.y < 20 || f.y > H - 20) f.vy *= -1; if (!slow && hit(f, p, 34)) { slow = 1; beep(150, 0.2); } }); },
        draw(c) { c.fillStyle = shade(th.c1, -0.55); c.fillRect(0, 0, W, H); c.fillStyle = "rgba(255,255,255,.5)"; for (let i = 0; i < 60; i++) c.fillRect((i * 131) % W, (i * 71) % H, 2, 2);
          const t = performance.now() / 400;
          orbs.forEach(o => { const r = 24 + Math.sin(t + o.ph) * 3, g = c.createRadialGradient(o.x, o.y, 2, o.x, o.y, r + 12); g.addColorStop(0, "rgba(255,255,200,.95)"); g.addColorStop(1, "rgba(255,255,150,0)"); c.fillStyle = g; c.beginPath(); c.arc(o.x, o.y, r + 12, 0, 7); c.fill(); em(c, o.e, o.x, o.y + 1, 26); });
          foes.forEach(f => em(c, f.e, f.x, f.y, 30)); c.save(); if (slow) c.globalAlpha = 0.5 + 0.5 * Math.sin(performance.now() / 50); em(c, th.hero || "🧺", p.x, p.y, 40); c.restore(); }
      };
    }
  };

  // ---------- overlay UI ----------
  const CSS = `
  .mg-ov{position:fixed;inset:0;z-index:9999;background:rgba(10,18,40,.72);display:flex;align-items:center;justify-content:center;padding:14px;font-family:Inter,Nunito,system-ui,sans-serif}
  .mg-box{width:min(780px,100%);max-height:100%;overflow:auto;background:#fff;border-radius:22px;padding:20px 22px;box-shadow:0 30px 80px rgba(0,0,0,.4);border-top:8px solid var(--mg)}
  .mg-box h2{margin:0 0 4px;font-size:1.5rem;color:#0f172a}.mg-sub{margin:0 0 16px;color:#475569}
  .mg-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .mg-card{border:2px solid #e2e8f0;border-radius:16px;padding:16px 10px;text-align:center;cursor:pointer;background:#f8fafc;transition:.15s;font:inherit}
  .mg-card:hover{border-color:var(--mg);transform:translateY(-3px);box-shadow:0 10px 24px rgba(0,0,0,.12)}
  .mg-card .i{font-size:2.6rem;display:block}.mg-card b{display:block;font-size:1.08rem;margin:6px 0 4px;color:#0f172a}.mg-card small{color:#64748b;line-height:1.35;display:block}
  .mg-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}
  .mg-pill{background:#f1f5f9;border-radius:999px;padding:6px 14px;font-weight:700;color:#0f172a}
  .mg-skip{margin-left:auto;border:0;border-radius:10px;padding:9px 16px;font-family:inherit;font-weight:600;font-size:.95rem;background:#e2e8f0;color:#0f172a;cursor:pointer}
  .mg-go{border:0;border-radius:12px;padding:12px 22px;font-family:inherit;font-weight:700;font-size:1.05rem;background:var(--mg);color:#fff;cursor:pointer}
  .mg-canvas{width:100%;aspect-ratio:${W}/${H};display:block;border-radius:14px;touch-action:none;background:#eee}
  .mg-pad{display:flex;justify-content:center;gap:8px;margin-top:10px}.mg-pad button{width:58px;height:46px;border-radius:12px;border:2px solid #e2e8f0;background:#f8fafc;font-size:1.3rem;cursor:pointer;touch-action:manipulation}
  .mg-how{color:#64748b;font-size:.9rem;margin:8px 0 0;text-align:center}
  .mg-end{text-align:center;padding:16px 0}.mg-end .big{font-size:3.4rem}
  @media (max-width:640px){.mg-cards{grid-template-columns:1fr}}`;

  MG.open = function (labId, done) {
    const th = THEMES[labId] || DEF;
    if (!document.getElementById("mg-css")) { const s = document.createElement("style"); s.id = "mg-css"; s.textContent = CSS; document.head.appendChild(s); }
    const ov = document.createElement("div"); ov.className = "mg-ov"; ov.style.setProperty("--mg", th.c1); document.body.appendChild(ov);
    let raf = 0, game = null, cleanup = () => {};
    const close = () => { cancelAnimationFrame(raf); cleanup(); ov.remove(); done && done(); };
    const choices = shuffle(Object.keys(GAMES)).slice(0, 3);
    ov.innerHTML = `<div class="mg-box"><div class="mg-row"><h2>🎮 Game break!</h2><button class="mg-skip" id="mg-skip">Skip ⏭</button></div>
      <p class="mg-sub">Great work — 4 tasks done! Pick a game and collect the <b>${th.word}</b> ${th.good.slice(0, 3).join("")}. It lasts <b>1 minute</b> or until you get <b>${GOAL} points</b>. It doesn't count in your lab score or time.</p>
      <div class="mg-cards">${choices.map(k => `<button type="button" class="mg-card" data-g="${k}"><span class="i">${GAMES[k].icon}</span><b>${GAMES[k].name}</b><small>${GAMES[k].how}</small></button>`).join("")}</div></div>`;
    ov.querySelector("#mg-skip").onclick = close;
    ov.querySelectorAll(".mg-card").forEach(b => b.onclick = () => play(b.dataset.g));

    function play(key) {
      let pts = 0, left = LIMIT, last = performance.now(), over = false;
      const info = GAMES[key], pad = { tetris: ["left", "up", "down", "right"], shooter: ["left", "right"], snake: ["left", "up", "down", "right"], bicycle: ["up"], runner: ["left", "right"], carrace: ["left", "right"], collector: ["left", "up", "down", "right"] }[key];
      const sym = { left: "◀", right: "▶", up: "▲", down: "▼" };
      ov.innerHTML = `<div class="mg-box"><div class="mg-row"><span class="mg-pill">${info.icon} ${info.name}</span><span class="mg-pill">⏱ <span id="mg-t">${LIMIT}</span> s</span><span class="mg-pill">⭐ <span id="mg-p">0</span> / ${GOAL}</span><button class="mg-skip" id="mg-skip">Skip ⏭</button></div>
        <canvas class="mg-canvas" id="mg-c" width="${W}" height="${H}"></canvas>
        <div class="mg-pad">${pad.map(k => `<button type="button" data-k="${k}">${sym[k]}</button>`).join("")}</div><p class="mg-how">${info.how}</p></div>`;
      const cv = ov.querySelector("#mg-c"), c = cv.getContext("2d");
      const api = { point() { if (over) return; pts++; beep(880, 0.07); ov.querySelector("#mg-p").textContent = pts; if (pts >= GOAL) end("🎉", `You reached ${GOAL} points!`); } };
      game = MAKE[key](th, api);
      ov.querySelector("#mg-skip").onclick = close;
      const KM = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", " ": "action", a: "left", d: "right", w: "up", s: "down" };
      const kd = e => { const k = KM[e.key]; if (!k || over) return; e.preventDefault(); game.press && game.press(k); };
      const ku = e => { const k = KM[e.key]; if (!k) return; game.release && game.release(k); };
      addEventListener("keydown", kd); addEventListener("keyup", ku);
      cleanup = () => { removeEventListener("keydown", kd); removeEventListener("keyup", ku); };
      ov.querySelectorAll(".mg-pad button").forEach(b => { const k = b.dataset.k;
        b.onpointerdown = e => { e.preventDefault(); if (!over) game.press && game.press(k); }; b.onpointerup = b.onpointerleave = () => game.release && game.release(k); });
      const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
      cv.onpointermove = e => { if (game.pointer) game.pointer(...pos(e)); };
      cv.onpointerdown = e => { if (game.pointer) game.pointer(...pos(e)); else if (key === "bicycle") game.press("up"); };
      function end(icon, msg) {
        over = true; cancelAnimationFrame(raf); cleanup();
        ov.querySelector(".mg-box").innerHTML = `<div class="mg-end"><div class="big">${icon}</div><h2>${msg}</h2><p class="mg-sub">You collected <b>${pts}</b> point${pts === 1 ? "" : "s"}. Now back to the lab — 3 tasks to go!</p><button class="mg-go" id="mg-back">Back to the lab ▶</button></div>`;
        ov.querySelector("#mg-back").onclick = close; beep(990, 0.15);
      }
      const loop = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; if (over) return;
        left -= dt; ov.querySelector("#mg-t").textContent = Math.max(0, Math.ceil(left));
        if (left <= 0) return end("⏰", "Time's up!");
        game.step(dt); if (over) return; game.draw(c); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
  };
  MG.THEMES = THEMES; MG.GAMES = GAMES;
})();
