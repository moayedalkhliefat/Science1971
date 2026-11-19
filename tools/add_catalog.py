#!/usr/bin/env python3
"""Append a lab entry to labs/catalog.js. usage: add_catalog.py id "Title" Subject emoji "color css" "description" """
import sys, pathlib, json
lid, title, subj, icon, color, desc = sys.argv[1:7]
p = pathlib.Path(__file__).resolve().parent.parent / "labs" / "catalog.js"
s = p.read_text()
if f'id: "{lid}"' in s: print("exists"); sys.exit()
entry = f'''  {{
    id: "{lid}", title: {json.dumps(title, ensure_ascii=False)}, subject: "{subj}", icon: "{icon}", color: "{color}", grades: ["all"],
    path: "labs/{lid}/index.html", description: {json.dumps(desc, ensure_ascii=False)},
    levels: [{{ n: 1, id: "{lid}-l1", name: "Level 1 · Explorer" }}, {{ n: 2, id: "{lid}-l2", name: "Level 2 · Investigator" }}, {{ n: 3, id: "{lid}-l3", name: "Level 3 · Expert" }}]
  }}
];

// Subjects'''
s = s.replace("  }\n];\n\n// Subjects", "  },\n" + entry, 1)
p.write_text(s); print("added", lid)
