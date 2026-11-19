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
  },
  {
    id: "circuits", title: "Electric Circuits", subject: "Physics", icon: "💡", color: "linear-gradient(135deg,#f9a825,#0b5cab)", grades: ["all"],
    path: "labs/circuits/index.html", description: "Build circuits with a battery, switch and bulbs in series or parallel, read the ammeter and use Ohm's law.",
    levels: [{ n: 1, id: "circuits-l1", name: "Level 1 · Explorer" }, { n: 2, id: "circuits-l2", name: "Level 2 · Investigator" }, { n: 3, id: "circuits-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "forces", title: "Forces & Motion", subject: "Physics", icon: "📦", color: "linear-gradient(135deg,#8d6e63,#0b5cab)", grades: ["all"],
    path: "labs/forces/index.html", description: "Push a crate with two forces, change its mass and the friction, and discover Newton's laws of motion.",
    levels: [{ n: 1, id: "forces-l1", name: "Level 1 · Explorer" }, { n: 2, id: "forces-l2", name: "Level 2 · Investigator" }, { n: 3, id: "forces-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "states", title: "States of Matter", subject: "Chemistry", icon: "🧊", color: "linear-gradient(135deg,#6d4aff,#00b8d9)", grades: ["all"],
    path: "labs/states/index.html", description: "Heat and cool water and other substances, watch the particles move, and find melting and boiling points (°C and K).",
    levels: [{ n: 1, id: "states-l1", name: "Level 1 · Explorer" }, { n: 2, id: "states-l2", name: "Level 2 · Investigator" }, { n: 3, id: "states-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "balance", title: "Balancing Equations", subject: "Chemistry", icon: "⚖️", color: "linear-gradient(135deg,#7e57c2,#26a69a)", grades: ["all"],
    path: "labs/balance/index.html", description: "Add molecules to both sides of a chemical equation until every atom balances — conservation of mass.",
    levels: [{ n: 1, id: "balance-l1", name: "Level 1 · Explorer" }, { n: 2, id: "balance-l2", name: "Level 2 · Investigator" }, { n: 3, id: "balance-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "ph", title: "pH Scale", subject: "Chemistry", icon: "🧪", color: "linear-gradient(135deg,#e53935,#fbc02d,#43a047,#1e3a8a,#6a1b9a)", grades: ["all"],
    path: "labs/ph/index.html", description: "Test everyday liquids with a pH meter and universal indicator, dilute acids and bases, and explore [H⁺].",
    levels: [{ n: 1, id: "ph-l1", name: "Level 1 · Explorer" }, { n: 2, id: "ph-l2", name: "Level 2 · Investigator" }, { n: 3, id: "ph-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "molecule", title: "Build a Molecule", subject: "Chemistry", icon: "⚛️", color: "linear-gradient(135deg,#424242,#e53935,#1e88e5)", grades: ["all"],
    path: "labs/molecule/index.html", description: "Use an atom kit to build molecules — every atom must use all its bonds. Discover single, double and triple bonds.",
    levels: [{ n: 1, id: "molecule-l1", name: "Level 1 · Explorer" }, { n: 2, id: "molecule-l2", name: "Level 2 · Investigator" }, { n: 3, id: "molecule-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "selection", title: "Natural Selection", subject: "Biology", icon: "🐇", color: "linear-gradient(135deg,#689f38,#8d6e63)", grades: ["all"],
    path: "labs/selection/index.html", description: "Add mutations, predators and food limits to a bunny population and watch natural selection change it over generations.",
    levels: [{ n: 1, id: "selection-l1", name: "Level 1 · Explorer" }, { n: 2, id: "selection-l2", name: "Level 2 · Investigator" }, { n: 3, id: "selection-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "cells", title: "Cells & Microscope", subject: "Biology", icon: "🔬", color: "linear-gradient(135deg,#ec407a,#7cb342)", grades: ["all"],
    path: "labs/cells/index.html", description: "Use a virtual microscope: focus, stain and magnify onion, cheek, leaf and blood cells; compare plant and animal cells.",
    levels: [{ n: 1, id: "cells-l1", name: "Level 1 · Explorer" }, { n: 2, id: "cells-l2", name: "Level 2 · Investigator" }, { n: 3, id: "cells-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "foodweb", title: "Food Chains & Webs", subject: "Biology", icon: "🕸️", color: "linear-gradient(135deg,#7cb342,#8d6e63)", grades: ["all"],
    path: "labs/foodweb/index.html", description: "Build food chains, remove species from a food web to see the effects, and follow energy through an energy pyramid.",
    levels: [{ n: 1, id: "foodweb-l1", name: "Level 1 · Explorer" }, { n: 2, id: "foodweb-l2", name: "Level 2 · Investigator" }, { n: 3, id: "foodweb-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "photo", title: "Photosynthesis", subject: "Biology", icon: "🌱", color: "linear-gradient(135deg,#43a047,#fdd835)", grades: ["all"],
    path: "labs/photo/index.html", description: "Count oxygen bubbles from pondweed while changing light, CO₂, temperature and light colour — discover limiting factors.",
    levels: [{ n: 1, id: "photo-l1", name: "Level 1 · Explorer" }, { n: 2, id: "photo-l2", name: "Level 2 · Investigator" }, { n: 3, id: "photo-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "membrane", title: "Membrane Transport", subject: "Biology", icon: "🫧", color: "linear-gradient(135deg,#ec407a,#29b6f6)", grades: ["all"],
    path: "labs/membrane/index.html", description: "Watch particles cross the cell membrane: diffusion, osmosis in red blood and plant cells, and active transport with the Na⁺/K⁺ pump.",
    levels: [{ n: 1, id: "membrane-l1", name: "Level 1 · Explorer" }, { n: 2, id: "membrane-l2", name: "Level 2 · Investigator" }, { n: 3, id: "membrane-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "neuron", title: "Neuron", subject: "Biology", icon: "🧠", color: "linear-gradient(135deg,#ad1457,#ffb74d)", grades: ["all"],
    path: "labs/neuron/index.html", description: "Stimulate a neuron: threshold and action potentials, myelin and impulse speed, toxins, drugs and synapses.",
    levels: [{ n: 1, id: "neuron-l1", name: "Level 1 · Explorer" }, { n: 2, id: "neuron-l2", name: "Level 2 · Investigator" }, { n: 3, id: "neuron-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "gene", title: "Gene Expression", subject: "Biology", icon: "🧬", color: "linear-gradient(135deg,#7e57c2,#e91e63)", grades: ["all"],
    path: "labs/gene/index.html", description: "Switch genes on, make mRNA and proteins, read codons with the genetic code, and explore mutations.",
    levels: [{ n: 1, id: "gene-l1", name: "Level 1 · Explorer" }, { n: 2, id: "gene-l2", name: "Level 2 · Investigator" }, { n: 3, id: "gene-l3", name: "Level 3 · Expert" }]
  }
];

// Subjects used to group the labs on every page
window.S1971_SUBJECTS = [
  { key: "Biology", icon: "🧬", color: "#be185d" },
  { key: "Chemistry", icon: "⚗️", color: "#6d28d9" },
  { key: "Physics", icon: "🚀", color: "#0369a1" }
];
