#!/usr/bin/env python3
"""Generate labs/<id>/index.html shell for a lab whose code lives in labs/<id>/lab.js.
usage: python3 tools/make_lab.py <id> "<Title>" <emoji> <theme>"""
import sys, pathlib
lab_id, title, emoji, theme = sys.argv[1:5]
html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} · Science Lab 1971</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>{emoji}</text></svg>">
<link rel="stylesheet" href="../../assets/style.css">
<link rel="stylesheet" href="../../assets/lab.css">
</head>
<body class="{theme}">
<div class="wrap">
  <div class="topbar">
    <a class="brand" id="home-link" href="../../index.html"><span class="logo">{emoji}</span><b>Science Lab 1971</b></a>
    <div class="row gap"><span class="pill" id="lvl-pill"></span><a class="btn sm ghost" id="back-btn" href="../../index.html">⬅ Back</a></div>
  </div>
  <div id="banner"></div>
  <div class="card" id="stage"><div class="empty">Loading the lab… {emoji}</div></div>
</div>
<script src="../../assets/config.js"></script>
<script src="../../assets/app.js"></script>
<script src="../catalog.js"></script>
<script src="../../assets/lab-sdk.js"></script>
<script src="../../assets/lab-engine.js"></script>
<script src="../../assets/sim-kit.js"></script>
<script src="lab.js"></script>
</body>
</html>
'''
p = pathlib.Path(__file__).resolve().parent.parent / "labs" / lab_id
p.mkdir(parents=True, exist_ok=True)
(p / "index.html").write_text(html)
print("wrote", p / "index.html")
