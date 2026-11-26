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
  },
  {
    id: "vision", title: "Color Vision", subject: "Biology", icon: "👁️", color: "linear-gradient(135deg,#f44336,#4caf50,#2196f3)", grades: ["all"],
    path: "labs/vision/index.html", description: "Mix red, green and blue light, use filters and coloured lights on objects, and learn how the eye sees colour.",
    levels: [{ n: 1, id: "vision-l1", name: "Level 1 · Explorer" }, { n: 2, id: "vision-l2", name: "Level 2 · Investigator" }, { n: 3, id: "vision-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "eating", title: "Eating & Exercise", subject: "Biology", icon: "🍽️", color: "linear-gradient(135deg,#ffb74d,#4db6ac)", grades: ["all"],
    path: "labs/eating/index.html", description: "Balance the energy you take in from food with the energy your body and activities use, and learn where food energy comes from.",
    levels: [{ n: 1, id: "eating-l1", name: "Level 1 · Explorer" }, { n: 2, id: "eating-l2", name: "Level 2 · Investigator" }, { n: 3, id: "eating-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "molarity", title: "Concentration & Molarity", subject: "Chemistry", icon: "🧪", color: "linear-gradient(135deg,#1e6edc,#7e57c2)", grades: ["all"],
    path: "labs/molarity/index.html", description: "Dissolve solutes, change the volume and dilute stock solutions to reach exact concentrations in mol/L.",
    levels: [{ n: 1, id: "molarity-l1", name: "Level 1 · Explorer" }, { n: 2, id: "molarity-l2", name: "Level 2 · Investigator" }, { n: 3, id: "molarity-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "gas", title: "Gas Properties", subject: "Chemistry", icon: "🎈", color: "linear-gradient(135deg,#5c6bc0,#ef5350)", grades: ["all"],
    path: "labs/gas/index.html", description: "Pump gas particles into a container, heat it and move the wall — discover how pressure, volume and temperature are linked.",
    levels: [{ n: 1, id: "gas-l1", name: "Level 1 · Explorer" }, { n: 2, id: "gas-l2", name: "Level 2 · Investigator" }, { n: 3, id: "gas-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "shapes", title: "Molecule Shapes", subject: "Chemistry", icon: "🔷", color: "linear-gradient(135deg,#5c6bc0,#ab47bc)", grades: ["all"],
    path: "labs/shapes/index.html", description: "Add bonding pairs and lone pairs to a central atom and discover molecular shapes and bond angles (VSEPR).",
    levels: [{ n: 1, id: "shapes-l1", name: "Level 1 · Explorer" }, { n: 2, id: "shapes-l2", name: "Level 2 · Investigator" }, { n: 3, id: "shapes-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "isotopes", title: "Isotopes & Atomic Mass", subject: "Chemistry", icon: "⚛️", color: "linear-gradient(135deg,#e53935,#7e57c2)", grades: ["all"],
    path: "labs/isotopes/index.html", description: "Build isotopes by adding neutrons, check if they are stable, and mix isotopes to find the relative atomic mass.",
    levels: [{ n: 1, id: "isotopes-l1", name: "Level 1 · Explorer" }, { n: 2, id: "isotopes-l2", name: "Level 2 · Investigator" }, { n: 3, id: "isotopes-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "solutions", title: "Sugar & Salt Solutions", subject: "Chemistry", icon: "🧂", color: "linear-gradient(135deg,#7e57c2,#43a047)", grades: ["all"],
    path: "labs/solutions/index.html", description: "Dissolve salt and sugar, test which solutions conduct electricity, make saturated solutions and count ions.",
    levels: [{ n: 1, id: "solutions-l1", name: "Level 1 · Explorer" }, { n: 2, id: "solutions-l2", name: "Level 2 · Investigator" }, { n: 3, id: "solutions-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "projectile", title: "Projectile Motion", subject: "Physics", icon: "🎯", color: "linear-gradient(135deg,#e65100,#1e88e5)", grades: ["all"],
    path: "labs/projectile/index.html", description: "Fire a cannon: change the angle, speed and height to hit targets and discover how projectiles move.",
    levels: [{ n: 1, id: "projectile-l1", name: "Level 1 · Explorer" }, { n: 2, id: "projectile-l2", name: "Level 2 · Investigator" }, { n: 3, id: "projectile-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "pendulum", title: "Pendulum Lab", subject: "Physics", icon: "⏱️", color: "linear-gradient(135deg,#1e88e5,#8d6e63)", grades: ["all"],
    path: "labs/pendulum/index.html", description: "Swing pendulums of different lengths, masses and angles — even on other planets — and time their period.",
    levels: [{ n: 1, id: "pendulum-l1", name: "Level 1 · Explorer" }, { n: 2, id: "pendulum-l2", name: "Level 2 · Investigator" }, { n: 3, id: "pendulum-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "springs", title: "Masses & Springs", subject: "Physics", icon: "🔩", color: "linear-gradient(135deg,#546e7a,#1e88e5)", grades: ["all"],
    path: "labs/springs/index.html", description: "Hang masses on springs, discover Hooke's law, find mystery spring constants, the elastic limit and stored energy.",
    levels: [{ n: 1, id: "springs-l1", name: "Level 1 · Explorer" }, { n: 2, id: "springs-l2", name: "Level 2 · Investigator" }, { n: 3, id: "springs-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "balance2", title: "Balancing Act", subject: "Physics", icon: "⚖️", color: "linear-gradient(135deg,#6d4c41,#1565c0)", grades: ["all"],
    path: "labs/balance2/index.html", description: "Place bricks on a seesaw and use moments (mass × distance) to balance it and find mystery masses.",
    levels: [{ n: 1, id: "balance2-l1", name: "Level 1 · Explorer" }, { n: 2, id: "balance2-l2", name: "Level 2 · Investigator" }, { n: 3, id: "balance2-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "waves", title: "Waves", subject: "Physics", icon: "🌊", color: "linear-gradient(135deg,#e65100,#1e88e5)", grades: ["all"],
    path: "labs/waves/index.html", description: "Make waves on a string: change frequency, amplitude and tension, and discover v = f × λ.",
    levels: [{ n: 1, id: "waves-l1", name: "Level 1 · Explorer" }, { n: 2, id: "waves-l2", name: "Level 2 · Investigator" }, { n: 3, id: "waves-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "light", title: "Bending Light", subject: "Physics", icon: "🔦", color: "linear-gradient(135deg,#e53935,#29b6f6)", grades: ["all"],
    path: "labs/light/index.html", description: "Shine a laser into water, glass and diamond: refraction, Snell's law, the critical angle and total internal reflection.",
    levels: [{ n: 1, id: "light-l1", name: "Level 1 · Explorer" }, { n: 2, id: "light-l2", name: "Level 2 · Investigator" }, { n: 3, id: "light-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "orbits", title: "Gravity & Orbits", subject: "Physics", icon: "🪐", color: "linear-gradient(135deg,#0b1426,#ffb300)", grades: ["all"],
    path: "labs/orbits/index.html", description: "Launch planets around stars: find circular orbits, crashes and escapes, the length of a year and the gravity force.",
    levels: [{ n: 1, id: "orbits-l1", name: "Level 1 · Explorer" }, { n: 2, id: "orbits-l2", name: "Level 2 · Investigator" }, { n: 3, id: "orbits-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "magnets", title: "Magnets & Electromagnets", subject: "Physics", icon: "🧲", color: "linear-gradient(135deg,#c62828,#1565c0)", grades: ["all"],
    path: "labs/magnets/index.html", description: "Build electromagnets to lift paper clips, find north and south poles with a compass, and induce voltage with a moving magnet.",
    levels: [{ n: 1, id: "magnets-l1", name: "Level 1 · Explorer" }, { n: 2, id: "magnets-l2", name: "Level 2 · Investigator" }, { n: 3, id: "magnets-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "static", title: "Static Electricity", subject: "Physics", icon: "🎈", color: "linear-gradient(135deg,#ffca28,#1e88e5)", grades: ["all"],
    path: "labs/static/index.html", description: "Rub balloons on a sweater, watch electrons move, make balloons stick, attract and repel, and measure the electric force.",
    levels: [{ n: 1, id: "static-l1", name: "Level 1 · Explorer" }, { n: 2, id: "static-l2", name: "Level 2 · Investigator" }, { n: 3, id: "static-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "eforms", title: "Energy Forms & Changes", subject: "Physics", icon: "🔋", color: "linear-gradient(135deg,#fbc02d,#43a047,#1e88e5)", grades: ["all"],
    path: "labs/eforms/index.html", description: "Build energy chains from the Sun, running water or a cyclist to lamps and heaters, and follow the energy — and the waste.",
    levels: [{ n: 1, id: "eforms-l1", name: "Level 1 · Explorer" }, { n: 2, id: "eforms-l2", name: "Level 2 · Investigator" }, { n: 3, id: "eforms-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "mouse", title: "Mouse Genetics", subject: "Biology", icon: "🐭", color: "linear-gradient(135deg,#8d6e63,#d7ccc8)", grades: ["all"],
    path: "labs/mouse/index.html", description: "Breed black and white mice, fill Punnett squares, predict litters and use test crosses to reveal hidden genotypes.",
    levels: [{ n: 1, id: "mouse-l1", name: "Level 1 · Explorer" }, { n: 2, id: "mouse-l2", name: "Level 2 · Investigator" }, { n: 3, id: "mouse-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "mitosis", title: "Cell Division (Mitosis)", subject: "Biology", icon: "🧫", color: "linear-gradient(135deg,#7b1fa2,#ce93d8)", grades: ["all"],
    path: "labs/mitosis/index.html", description: "Stop a dividing cell at each stage of mitosis, count chromosomes and chromatids, and grow cell cultures by doubling.",
    levels: [{ n: 1, id: "mitosis-l1", name: "Level 1 · Explorer" }, { n: 2, id: "mitosis-l2", name: "Level 2 · Investigator" }, { n: 3, id: "mitosis-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "enzymes", title: "Enzymes", subject: "Biology", icon: "⚗️", color: "linear-gradient(135deg,#00897b,#80cbc4)", grades: ["all"],
    path: "labs/enzymes/index.html", description: "Test amylase, pepsin and lipase: change temperature, pH and substrate, watch the active site and find each enzyme's optimum.",
    levels: [{ n: 1, id: "enzymes-l1", name: "Level 1 · Explorer" }, { n: 2, id: "enzymes-l2", name: "Level 2 · Investigator" }, { n: 3, id: "enzymes-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "heart", title: "Heart & Circulation", subject: "Biology", icon: "❤️", color: "linear-gradient(135deg,#c62828,#ef9a9a)", grades: ["all"],
    path: "labs/heart/index.html", description: "Follow blood through the double circulation, then set heart rate and stroke volume to deliver enough oxygen for rest, walking and running.",
    levels: [{ n: 1, id: "heart-l1", name: "Level 1 · Explorer" }, { n: 2, id: "heart-l2", name: "Level 2 · Investigator" }, { n: 3, id: "heart-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "respiration", title: "Cell Respiration (Yeast)", subject: "Biology", icon: "🍞", color: "linear-gradient(135deg,#f9a825,#fff176)", grades: ["all"],
    path: "labs/respiration/index.html", description: "Feed yeast different sugars at different temperatures, collect the carbon dioxide in a balloon and test it with limewater.",
    levels: [{ n: 1, id: "respiration-l1", name: "Level 1 · Explorer" }, { n: 2, id: "respiration-l2", name: "Level 2 · Investigator" }, { n: 3, id: "respiration-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "disease", title: "Disease Spread & Vaccines", subject: "Biology", icon: "🦠", color: "linear-gradient(135deg,#1e88e5,#ef5350)", grades: ["all"],
    path: "labs/disease/index.html", description: "Watch an infection spread through a town of 100 people; use vaccination, hand washing and fewer contacts to bring R below 1.",
    levels: [{ n: 1, id: "disease-l1", name: "Level 1 · Explorer" }, { n: 2, id: "disease-l2", name: "Level 2 · Investigator" }, { n: 3, id: "disease-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "dnafp", title: "DNA Fingerprinting", subject: "Biology", icon: "🧬", color: "linear-gradient(135deg,#3949ab,#90caf9)", grades: ["all"],
    path: "labs/dnafp/index.html", description: "Run crime-scene and suspect DNA on a gel, control voltage and time, read the ladder and cut DNA with restriction enzymes.",
    levels: [{ n: 1, id: "dnafp-l1", name: "Level 1 · Explorer" }, { n: 2, id: "dnafp-l2", name: "Level 2 · Investigator" }, { n: 3, id: "dnafp-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "transpire", title: "Plant Transpiration", subject: "Biology", icon: "🌿", color: "linear-gradient(135deg,#558b2f,#c5e1a5)", grades: ["all"],
    path: "labs/transpire/index.html", description: "Use a potometer to measure water loss from a leafy shoot; change light, wind, temperature and humidity, and find where the stomata are.",
    levels: [{ n: 1, id: "transpire-l1", name: "Level 1 · Explorer" }, { n: 2, id: "transpire-l2", name: "Level 2 · Investigator" }, { n: 3, id: "transpire-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "titration", title: "Acid–Base Titration", subject: "Chemistry", icon: "🧪", color: "linear-gradient(135deg,#ad1457,#f8bbd0)", grades: ["all"],
    path: "labs/titration/index.html", description: "Neutralise hydrochloric acid with sodium hydroxide from a burette, watch indicators and the titration curve, and find unknown concentrations.",
    levels: [{ n: 1, id: "titration-l1", name: "Level 1 · Explorer" }, { n: 2, id: "titration-l2", name: "Level 2 · Investigator" }, { n: 3, id: "titration-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "rates", title: "Reaction Rates", subject: "Chemistry", icon: "⏱️", color: "linear-gradient(135deg,#ef6c00,#ffcc80)", grades: ["all"],
    path: "labs/rates/index.html", description: "React zinc with acid: change temperature, concentration, surface area and add a catalyst, then measure the hydrogen gas with collision theory.",
    levels: [{ n: 1, id: "rates-l1", name: "Level 1 · Explorer" }, { n: 2, id: "rates-l2", name: "Level 2 · Investigator" }, { n: 3, id: "rates-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "changes", title: "Physical vs Chemical Change", subject: "Chemistry", icon: "🔥", color: "linear-gradient(135deg,#e65100,#ffccbc)", grades: ["all"],
    path: "labs/changes/index.html", description: "Do ten mini experiments, spot the signs of a chemical reaction (gas, colour, heat, precipitate, light) and test which changes can be reversed.",
    levels: [{ n: 1, id: "changes-l1", name: "Level 1 · Explorer" }, { n: 2, id: "changes-l2", name: "Level 2 · Investigator" }, { n: 3, id: "changes-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "conserve", title: "Conservation of Mass", subject: "Chemistry", icon: "⚖️", color: "linear-gradient(135deg,#5e35b1,#d1c4e9)", grades: ["all"],
    path: "labs/conserve/index.html", description: "Do reactions on a balance in open and sealed containers: watch gases escape and oxygen join, and prove that mass is conserved.",
    levels: [{ n: 1, id: "conserve-l1", name: "Level 1 · Explorer" }, { n: 2, id: "conserve-l2", name: "Level 2 · Investigator" }, { n: 3, id: "conserve-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "trends", title: "Periodic Table Trends", subject: "Chemistry", icon: "📊", color: "linear-gradient(135deg,#3949ab,#9fa8da)", grades: ["all"],
    path: "labs/trends/index.html", description: "Explore the first four periods: colour the table by type, atom size and reactivity, drop metals in water and predict ions and trends.",
    levels: [{ n: 1, id: "trends-l1", name: "Level 1 · Explorer" }, { n: 2, id: "trends-l2", name: "Level 2 · Investigator" }, { n: 3, id: "trends-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "bonding", title: "Ionic & Covalent Bonding", subject: "Chemistry", icon: "🔗", color: "linear-gradient(135deg,#00838f,#80deea)", grades: ["all"],
    path: "labs/bonding/index.html", description: "Transfer or share outer electrons to build ionic compounds and covalent molecules, with dot-and-cross diagrams and full outer shells.",
    levels: [{ n: 1, id: "bonding-l1", name: "Level 1 · Explorer" }, { n: 2, id: "bonding-l2", name: "Level 2 · Investigator" }, { n: 3, id: "bonding-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "thermo", title: "Exothermic & Endothermic", subject: "Chemistry", icon: "🌡️", color: "linear-gradient(135deg,#d84315,#64b5f6)", grades: ["all"],
    path: "labs/thermo/index.html", description: "Measure temperature changes in a calorimeter, make hot packs and cold packs, draw energy level diagrams and calculate Q = mcΔT.",
    levels: [{ n: 1, id: "thermo-l1", name: "Level 1 · Explorer" }, { n: 2, id: "thermo-l2", name: "Level 2 · Investigator" }, { n: 3, id: "thermo-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "separate", title: "Separating Mixtures", subject: "Chemistry", icon: "🧲", color: "linear-gradient(135deg,#00796b,#80cbc4)", grades: ["all"],
    path: "labs/separate/index.html", description: "Choose filtering, evaporation, distillation, magnets, separating funnels or chromatography — and plan 3-step methods — to get pure substances.",
    levels: [{ n: 1, id: "separate-l1", name: "Level 1 · Explorer" }, { n: 2, id: "separate-l2", name: "Level 2 · Investigator" }, { n: 3, id: "separate-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "sound", title: "Sound & Hearing", subject: "Physics", icon: "🔊", color: "linear-gradient(135deg,#6a1b9a,#ce93d8)", grades: ["all"],
    path: "labs/sound/index.html", description: "Change pitch and loudness on an oscilloscope, compare the speed of sound in air, water and steel, and measure distances with echoes.",
    levels: [{ n: 1, id: "sound-l1", name: "Level 1 · Explorer" }, { n: 2, id: "sound-l2", name: "Level 2 · Investigator" }, { n: 3, id: "sound-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "heat", title: "Heat Transfer", subject: "Physics", icon: "☕", color: "linear-gradient(135deg,#e64a19,#ffab91)", grades: ["all"],
    path: "labs/heat/index.html", description: "Keep tea hot with cups, lids and wraps, read cooling curves, and heat water with an electric heater using energy = mass × 4.2 × ΔT.",
    levels: [{ n: 1, id: "heat-l1", name: "Level 1 · Explorer" }, { n: 2, id: "heat-l2", name: "Level 2 · Investigator" }, { n: 3, id: "heat-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "ramps", title: "Ramps & Friction", subject: "Physics", icon: "🛝", color: "linear-gradient(135deg,#795548,#d7ccc8)", grades: ["all"],
    path: "labs/ramps/index.html", description: "Tilt a ramp of ice, wood or rubber, find when boxes start to slide, push them up with the right force and calculate accelerations.",
    levels: [{ n: 1, id: "ramps-l1", name: "Level 1 · Explorer" }, { n: 2, id: "ramps-l2", name: "Level 2 · Investigator" }, { n: 3, id: "ramps-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "pulleys", title: "Pulleys & Gears", subject: "Physics", icon: "⚙️", color: "linear-gradient(135deg,#546e7a,#b0bec5)", grades: ["all"],
    path: "labs/pulleys/index.html", description: "Lift heavy loads with pulley systems, trade force for distance, and build gear trains that change speed, turning force and direction.",
    levels: [{ n: 1, id: "pulleys-l1", name: "Level 1 · Explorer" }, { n: 2, id: "pulleys-l2", name: "Level 2 · Investigator" }, { n: 3, id: "pulleys-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "pressure", title: "Pressure & Hydraulics", subject: "Physics", icon: "🌊", color: "linear-gradient(135deg,#0277bd,#80deea)", grades: ["all"],
    path: "labs/pressure/index.html", description: "Pressure on solids, in liquids and in hydraulic machines",
    levels: [{ n: 1, id: "pressure-l1", name: "Level 1 · Explorer" }, { n: 2, id: "pressure-l2", name: "Level 2 · Investigator" }, { n: 3, id: "pressure-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "lenses", title: "Lenses & Mirrors", subject: "Physics", icon: "🔍", color: "linear-gradient(135deg,#f9a825,#4fc3f7)", grades: ["all"],
    path: "labs/lenses/index.html", description: "Reflection in mirrors and images made by convex lenses",
    levels: [{ n: 1, id: "lenses-l1", name: "Level 1 · Explorer" }, { n: 2, id: "lenses-l2", name: "Level 2 · Investigator" }, { n: 3, id: "lenses-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "momentum", title: "Momentum & Collisions", subject: "Physics", icon: "🎱", color: "linear-gradient(135deg,#e53935,#1e88e5)", grades: ["all"],
    path: "labs/momentum/index.html", description: "Momentum, sticky and bouncy crashes, and conservation of momentum",
    levels: [{ n: 1, id: "momentum-l1", name: "Level 1 · Explorer" }, { n: 2, id: "momentum-l2", name: "Level 2 · Investigator" }, { n: 3, id: "momentum-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "induction", title: "Electromagnetic Induction", subject: "Physics", icon: "🧲", color: "linear-gradient(135deg,#fbc02d,#e53935)", grades: ["all"],
    path: "labs/induction/index.html", description: "Magnets, coils, induced current and transformers",
    levels: [{ n: 1, id: "induction-l1", name: "Level 1 · Explorer" }, { n: 2, id: "induction-l2", name: "Level 2 · Investigator" }, { n: 3, id: "induction-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "lacop", title: "Gene Machine: Lac Operon", subject: "Biology", icon: "🧬", color: "linear-gradient(135deg,#6a1b9a,#26a69a)", grades: ["all"],
    path: "labs/lacop/index.html", description: "How bacteria switch genes on and off: repressor, CAP and mutations",
    levels: [{ n: 1, id: "lacop-l1", name: "Level 1 · Explorer" }, { n: 2, id: "lacop-l2", name: "Level 2 · Investigator" }, { n: 3, id: "lacop-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "motors", title: "Molecular Motors", subject: "Biology", icon: "🚶", color: "linear-gradient(135deg,#00897b,#1e88e5)", grades: ["all"],
    path: "labs/motors/index.html", description: "Kinesin, dynein and myosin: tracks, ATP and load force",
    levels: [{ n: 1, id: "motors-l1", name: "Level 1 · Explorer" }, { n: 2, id: "motors-l2", name: "Level 2 · Investigator" }, { n: 3, id: "motors-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "dnastretch", title: "Stretching DNA", subject: "Biology", icon: "🧬", color: "linear-gradient(135deg,#3949ab,#ab47bc)", grades: ["all"],
    path: "labs/dnastretch/index.html", description: "Base pairs, optical tweezers, stretching and unzipping DNA",
    levels: [{ n: 1, id: "dnastretch-l1", name: "Level 1 · Explorer" }, { n: 2, id: "dnastretch-l2", name: "Level 2 · Investigator" }, { n: 3, id: "dnastretch-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "leftovers", title: "Reactants, Products & Leftovers", subject: "Chemistry", icon: "🥪", color: "linear-gradient(135deg,#ef6c00,#ffd54f)", grades: ["all"],
    path: "labs/leftovers/index.html", description: "Limiting and excess reactants, from sandwiches to burning methane",
    levels: [{ n: 1, id: "leftovers-l1", name: "Level 1 · Explorer" }, { n: 2, id: "leftovers-l2", name: "Level 2 · Investigator" }, { n: 3, id: "leftovers-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "polarity", title: "Molecule Polarity", subject: "Chemistry", icon: "⚡", color: "linear-gradient(135deg,#1e88e5,#e53935)", grades: ["all"],
    path: "labs/polarity/index.html", description: "Electronegativity, bond dipoles, electric fields and molecular shape",
    levels: [{ n: 1, id: "polarity-l1", name: "Level 1 · Explorer" }, { n: 2, id: "polarity-l2", name: "Level 2 · Investigator" }, { n: 3, id: "polarity-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "interact", title: "Atomic Interactions", subject: "Chemistry", icon: "⚛️", color: "linear-gradient(135deg,#5e35b1,#80deea)", grades: ["all"],
    path: "labs/interact/index.html", description: "Attraction, repulsion and the energy well between atoms",
    levels: [{ n: 1, id: "interact-l1", name: "Level 1 · Explorer" }, { n: 2, id: "interact-l2", name: "Level 2 · Investigator" }, { n: 3, id: "interact-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "beers", title: "Beer's Law Lab", subject: "Chemistry", icon: "🔦", color: "linear-gradient(135deg,#c2185b,#7b1fa2)", grades: ["all"],
    path: "labs/beers/index.html", description: "Colour, absorbance, transmittance and concentration (A = εbc)",
    levels: [{ n: 1, id: "beers-l1", name: "Level 1 · Explorer" }, { n: 2, id: "beers-l2", name: "Level 2 · Investigator" }, { n: 3, id: "beers-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "acidbase", title: "Acid–Base Solutions", subject: "Chemistry", icon: "🧪", color: "linear-gradient(135deg,#d81b60,#1e88e5)", grades: ["all"],
    path: "labs/acidbase/index.html", description: "Strong vs weak acids and bases: pH, ionisation and conductivity",
    levels: [{ n: 1, id: "acidbase-l1", name: "Level 1 · Explorer" }, { n: 2, id: "acidbase-l2", name: "Level 2 · Investigator" }, { n: 3, id: "acidbase-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "equil", title: "Reversible Reactions & Equilibrium", subject: "Chemistry", icon: "⚖️", color: "linear-gradient(135deg,#00838f,#fb8c00)", grades: ["all"],
    path: "labs/equil/index.html", description: "Dynamic equilibrium, Kc, catalysts and Le Chatelier's principle",
    levels: [{ n: 1, id: "equil-l1", name: "Level 1 · Explorer" }, { n: 2, id: "equil-l2", name: "Level 2 · Investigator" }, { n: 3, id: "equil-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "hatom", title: "Models of the Hydrogen Atom", subject: "Chemistry", icon: "⚛️", color: "linear-gradient(135deg,#283593,#ab47bc)", grades: ["all"],
    path: "labs/hatom/index.html", description: "Bohr energy levels, photons and the hydrogen line spectrum",
    levels: [{ n: 1, id: "hatom-l1", name: "Level 1 · Explorer" }, { n: 2, id: "hatom-l2", name: "Level 2 · Investigator" }, { n: 3, id: "hatom-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "diffusion", title: "Diffusion", subject: "Chemistry", icon: "💨", color: "linear-gradient(135deg,#00acc1,#ef5350)", grades: ["all"],
    path: "labs/diffusion/index.html", description: "How gases spread: particle speed, temperature and Graham's law",
    levels: [{ n: 1, id: "diffusion-l1", name: "Level 1 · Explorer" }, { n: 2, id: "diffusion-l2", name: "Level 2 · Investigator" }, { n: 3, id: "diffusion-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "interfere", title: "Wave Interference", subject: "Physics", icon: "🌊", color: "linear-gradient(135deg,#0288d1,#7e57c2)", grades: ["all"],
    path: "labs/interfere/index.html", description: "Two-source interference, fringes and Young's double slit",
    levels: [{ n: 1, id: "interfere-l1", name: "Level 1 · Explorer" }, { n: 2, id: "interfere-l2", name: "Level 2 · Investigator" }, { n: 3, id: "interfere-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "capacitor", title: "Capacitor Lab", subject: "Physics", icon: "🔋", color: "linear-gradient(135deg,#f9a825,#546e7a)", grades: ["all"],
    path: "labs/capacitor/index.html", description: "Parallel-plate capacitors: capacitance, charge, field and energy",
    levels: [{ n: 1, id: "capacitor-l1", name: "Level 1 · Explorer" }, { n: 2, id: "capacitor-l2", name: "Level 2 · Investigator" }, { n: 3, id: "capacitor-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "coulomb", title: "Coulomb's Law", subject: "Physics", icon: "⚡", color: "linear-gradient(135deg,#e53935,#1e88e5)", grades: ["all"],
    path: "labs/coulomb/index.html", description: "Electric force between charges and the inverse-square law",
    levels: [{ n: 1, id: "coulomb-l1", name: "Level 1 · Explorer" }, { n: 2, id: "coulomb-l2", name: "Level 2 · Investigator" }, { n: 3, id: "coulomb-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "movingman", title: "Moving Man (Motion Graphs)", subject: "Physics", icon: "🚶", color: "linear-gradient(135deg,#43a047,#1e88e5)", grades: ["all"],
    path: "labs/movingman/index.html", description: "Position–time and velocity–time graphs: slope, area and acceleration",
    levels: [{ n: 1, id: "movingman-l1", name: "Level 1 · Explorer" }, { n: 2, id: "movingman-l2", name: "Level 2 · Investigator" }, { n: 3, id: "movingman-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "vectors", title: "Vector Addition", subject: "Physics", icon: "🎯", color: "linear-gradient(135deg,#3949ab,#e53935)", grades: ["all"],
    path: "labs/vectors/index.html", description: "Adding vectors tip-to-tail, components, size and direction",
    levels: [{ n: 1, id: "vectors-l1", name: "Level 1 · Explorer" }, { n: 2, id: "vectors-l2", name: "Level 2 · Investigator" }, { n: 3, id: "vectors-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "greenhouse", title: "Greenhouse Effect", subject: "Physics", icon: "🌍", color: "linear-gradient(135deg,#2e7d32,#0d1b3e)", grades: ["all"],
    path: "labs/greenhouse/index.html", description: "Greenhouse gases, albedo and Earth's energy balance",
    levels: [{ n: 1, id: "greenhouse-l1", name: "Level 1 · Explorer" }, { n: 2, id: "greenhouse-l2", name: "Level 2 · Investigator" }, { n: 3, id: "greenhouse-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "blackbody", title: "Blackbody Spectrum", subject: "Physics", icon: "⭐", color: "linear-gradient(135deg,#e65100,#1e88e5)", grades: ["all"],
    path: "labs/blackbody/index.html", description: "Hot objects, star colours, Wien's law and Stefan's law",
    levels: [{ n: 1, id: "blackbody-l1", name: "Level 1 · Explorer" }, { n: 2, id: "blackbody-l2", name: "Level 2 · Investigator" }, { n: 3, id: "blackbody-l3", name: "Level 3 · Expert" }]
  },
  {
    id: "photoelec", title: "Photoelectric Effect", subject: "Physics", icon: "💡", color: "linear-gradient(135deg,#7b1fa2,#ffca28)", grades: ["all"],
    path: "labs/photoelec/index.html", description: "Photons, work function, kinetic energy and stopping voltage",
    levels: [{ n: 1, id: "photoelec-l1", name: "Level 1 · Explorer" }, { n: 2, id: "photoelec-l2", name: "Level 2 · Investigator" }, { n: 3, id: "photoelec-l3", name: "Level 3 · Expert" }]
  }
];

// Subjects used to group the labs on every page
window.S1971_SUBJECTS = [
  { key: "Biology", icon: "🧬", color: "#be185d" },
  { key: "Chemistry", icon: "⚗️", color: "#6d28d9" },
  { key: "Physics", icon: "🚀", color: "#0369a1" }
];
