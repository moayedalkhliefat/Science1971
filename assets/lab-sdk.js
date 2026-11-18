// Science1971 Lab SDK — include in any lab page AFTER config.js, app.js and labs/catalog.js
//   await S1971Lab.init("digestive")   -> reads ?level=N, checks login + level lock
//   S1971Lab.mode     -> "student" (results saved) | "preview" (teacher/admin) | "guest" (not logged in)
//   S1971Lab.locked   -> null, or the previous level that must be passed first
//   await S1971Lab.submit(score, maxScore, details) -> { saved: true/false, message }
(function () {
  const params = new URLSearchParams(location.search);
  const Lab = {
    mode: "guest", locked: null, notAssigned: false, session: null, lab: null, levelInfo: null, nextLevel: null,
    level: Math.max(1, parseInt(params.get("level") || "1", 10) || 1),

    async init(labId) {
      const lab = (window.S1971_LABS || []).find(l => l.id === labId);
      if (!lab) throw new Error("Lab not found in catalog: " + labId);
      this.lab = lab;
      if (this.level > lab.levels.length) this.level = 1;
      this.levelInfo = lab.levels[this.level - 1];
      this.nextLevel = lab.levels[this.level] || null;

      const s = S1971.getSession();
      if (!s || !s.token) { this.mode = "guest"; return this; }
      let r;
      try { r = await S1971.rpc("session_check", { p_token: s.token }); }
      catch (e) { this.mode = "guest"; return this; }
      if (!r || !r.ok) { S1971.clearSession(); this.mode = "guest"; return this; }
      this.session = Object.assign({}, s, r);
      if (r.kind === "staff") { this.mode = "preview"; return this; }

      this.mode = "student";
      try {
        const open = await S1971.rpc("student_assigned_labs", { p_token: s.token });
        if (!open.includes(lab.id)) { this.notAssigned = true; return this; }
      } catch (e) { this.notAssigned = true; return this; }
      if (this.level > 1) {
        const prev = lab.levels[this.level - 2];
        try {
          const mine = await S1971.rpc("student_my_results", { p_token: s.token });
          const best = Math.max(0, ...mine.filter(x => x.lab_id === prev.id).map(x => Math.round(100 * x.score / x.max_score)));
          if (best < S1971_CONFIG.PASS_MARK) this.locked = prev;
        } catch (e) { this.locked = prev; }
      }
      return this;
    },

    homeUrl() {
      const root = S1971.root();
      if (this.mode === "student") return root + "student.html";
      if (this.mode === "preview") return root + "teacher.html";
      return root + "index.html";
    },

    levelUrl(n) {
      const p = new URLSearchParams(location.search); p.set("level", n);
      return location.pathname + "?" + p.toString();
    },

    async submit(score, maxScore, details) {
      if (this.mode === "preview") return { saved: false, message: "Teacher preview — result not saved." };
      if (this.mode !== "student") return { saved: false, message: "Not logged in — result not saved." };
      try {
        await S1971.rpc("student_submit_result", {
          p_token: this.session.token, p_lab_id: this.levelInfo.id,
          p_lab_title: `${this.lab.title} — ${this.levelInfo.name}`,
          p_score: score, p_max_score: maxScore, p_details: details || null
        });
        return { saved: true, message: "Your result was saved ✔ Your teacher can see it." };
      } catch (e) {
        return { saved: false, message: "Could not save: " + e.message };
      }
    }
  };
  window.S1971Lab = Lab;
})();
