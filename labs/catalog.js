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
  },
  {
    id: "speed",
    title: "Speed and How to Calculate It",
    subject: "Physics",
    icon: "🏎️",
    color: "linear-gradient(135deg,#2f80ff,#00b4d8)",
    grades: ["7"],
    path: "labs/speed/index.html",
    description: "Race on the virtual road, time it with the stopwatch, read the speedometer and decode distance–time graphs.",
    levels: [
      { n: 1, id: "speed-l1", name: "Level 1 · Explorer" },
      { n: 2, id: "speed-l2", name: "Level 2 · Investigator" },
      { n: 3, id: "speed-l3", name: "Level 3 · Expert" }
    ]
  },
  {
    id: "atom",
    title: "Build an Atom",
    subject: "Chemistry",
    icon: "⚛️",
    color: "linear-gradient(135deg,#7b4dff,#ff4d9d)",
    grades: ["9", "10"],
    path: "labs/atom/index.html",
    description: "Drag protons, neutrons and electrons onto a Bohr model to build atoms, ions and isotopes of the first 20 elements.",
    levels: [
      { n: 1, id: "atom-l1", name: "Level 1 · Explorer" },
      { n: 2, id: "atom-l2", name: "Level 2 · Investigator" },
      { n: 3, id: "atom-l3", name: "Level 3 · Expert" }
    ]
  },
  {
    id: "density", title: "Density & Buoyancy", subject: "Physics", icon: "🧊", color: "linear-gradient(135deg,#0b5cab,#26c6da)", grades: ["all"],
    path: "labs/density/index.html", description: "Change a block's mass and volume, drop it into water, oil, salt water or honey, and predict sink or float.",
    levels: [{ n: 1, id: "density-l1", name: "Level 1 · Explorer" }, { n: 2, id: "density-l2", name: "Level 2 · Investigator" }, { n: 3, id: "density-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "energy", title: "Energy Skate Park", subject: "Physics", icon: "🛹", color: "linear-gradient(135deg,#1e88e5,#43a047)", grades: ["all"],
    path: "labs/energy/index.html", description: "Send a skater down a ramp, change height, mass and friction, and watch potential, kinetic and heat energy change.",
    levels: [{ n: 1, id: "energy-l1", name: "Level 1 · Explorer" }, { n: 2, id: "energy-l2", name: "Level 2 · Investigator" }, { n: 3, id: "energy-l3", name: "Level 3 · Expert" }]
  }
];

// Subjects used to group the labs on every page
window.S1971_SUBJECTS = [
  { key: "Biology", icon: "🧬", color: "#be185d" },
  { key: "Chemistry", icon: "⚗️", color: "#6d28d9" },
  { key: "Physics", icon: "🚀", color: "#0369a1" }
];
