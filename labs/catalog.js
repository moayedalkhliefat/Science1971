// Science1971 lab catalogue — add new labs here.
// grades: which student grades see the lab ("all" = everyone). levels unlock in order at PASS_MARK %.
window.S1971_LABS = [
  {
    id: "digestive",
    title: "Functions of the Digestive System",
    subject: "Biology",
    icon: "🍎",
    color: "linear-gradient(135deg,#ff4d9d,#ff9f1c)",
    grades: ["7", "8"],
    path: "labs/digestive/index.html",
    description: "Label the organs, match them to their jobs, follow the food journey and solve real problems.",
    levels: [
      { n: 1, id: "digestive-l1", name: "Level 1 · Explorer" },
      { n: 2, id: "digestive-l2", name: "Level 2 · Investigator" },
      { n: 3, id: "digestive-l3", name: "Level 3 · Expert" }
    ]
  }
];
