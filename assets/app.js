// Science1971 shared helpers: API calls, session, small UI tools
(function () {
  const C = window.S1971_CONFIG;
  const KEY = "s1971_session";

  async function rpc(fn, args) {
    let res;
    try {
      res = await fetch(`${C.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: C.SUPABASE_KEY },
        body: JSON.stringify(args || {})
      });
    } catch (e) {
      throw new Error("No connection. Check your internet and try again.");
    }
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    if (!res.ok) {
      const msg = (data && data.message) || "Server error. Please try again.";
      if (/log in again/i.test(msg)) { clearSession(); }
      throw new Error(msg);
    }
    return data;
  }

  function getSession() {
    try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return window.__s1971mem || null; }
  }
  function setSession(s) {
    window.__s1971mem = s;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function clearSession() {
    window.__s1971mem = null;
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  // Root path of the site (works on github.io/science1971/ and on a custom domain)
  function root() {
    const s = document.querySelector('script[src*="assets/app.js"]');
    if (!s) return "./";
    return s.getAttribute("src").replace(/assets\/app\.js.*$/, "") || "./";
  }

  function homeFor(sess) {
    if (!sess) return root() + "index.html";
    if (sess.role === "admin") return root() + "admin.html";
    if (sess.role === "teacher") return root() + "teacher.html";
    return root() + "student.html";
  }

  // Page guard: checks the saved session is still valid on the server
  async function requireRole(roles) {
    const s = getSession();
    if (!s || !s.token) { location.href = root() + "index.html"; return null; }
    try {
      const r = await rpc("session_check", { p_token: s.token });
      if (!r || !r.ok) { clearSession(); location.href = root() + "index.html"; return null; }
      const merged = Object.assign({}, s, r);
      setSession(merged);
      if (roles && !roles.includes(merged.role)) { location.href = homeFor(merged); return null; }
      return merged;
    } catch (e) {
      toast(e.message, "bad");
      return null;
    }
  }

  async function logout() {
    const s = getSession();
    if (s && s.token) { try { await rpc("logout", { p_token: s.token }); } catch (e) {} }
    clearSession();
    location.href = root() + "index.html";
  }

  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function toast(msg, kind) {
    let box = document.getElementById("toast-box");
    if (!box) { box = document.createElement("div"); box.id = "toast-box"; document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast " + (kind || "");
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(() => t.classList.add("show"), 10);
    setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 300); }, 3800);
  }

  function fmtDate(d) {
    try { return new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return d; }
  }

  function gradeNum(g) { const m = String(g == null ? "" : g).match(/\d+/); return m ? m[0] : ""; }

  // Simple modal
  function modal(html) {
    const wrap = document.createElement("div");
    wrap.className = "modal-wrap";
    wrap.innerHTML = `<div class="modal card">${html}</div>`;
    wrap.addEventListener("click", e => { if (e.target === wrap) wrap.remove(); });
    document.body.appendChild(wrap);
    return wrap;
  }

  function changePasswordDialog() {
    const m = modal(`
      <h3>🔑 Change my password</h3>
      <label>Current password<input type="password" id="cp-old"></label>
      <label>New password (6+ characters)<input type="password" id="cp-new"></label>
      <label>Repeat new password<input type="password" id="cp-new2"></label>
      <div class="row gap end"><button class="btn ghost" id="cp-cancel">Cancel</button><button class="btn" id="cp-save">Save</button></div>`);
    m.querySelector("#cp-cancel").onclick = () => m.remove();
    m.querySelector("#cp-save").onclick = async () => {
      const o = m.querySelector("#cp-old").value, n = m.querySelector("#cp-new").value, n2 = m.querySelector("#cp-new2").value;
      if (n !== n2) return toast("The two new passwords are different.", "bad");
      try {
        const r = await rpc("change_password", { p_token: getSession().token, p_old: o, p_new: n });
        if (!r.ok) return toast(r.error, "bad");
        toast("Password changed ✔", "good"); m.remove();
      } catch (e) { toast(e.message, "bad"); }
    };
  }

  function downloadCSV(filename, rows) {
    const csv = rows.map(r => r.map(c => {
      const s = String(c == null ? "" : c);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  window.S1971 = { rpc, getSession, setSession, clearSession, requireRole, logout, homeFor, root, esc, toast, fmtDate, gradeNum, modal, changePasswordDialog, downloadCSV };
})();
