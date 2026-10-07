# Writes canvas artboards and the re-flowed index for the "Harbourly webapp" canvas.
# Usage: python3 design/tools/canvas.py <live canvas.json> <blobs.txt> <framesDir> <outRoot>
#   live canvas.json: read from the canvas (Artifact read, path project/canvas.json) right before publishing
#   blobs.txt:        one line per uploaded frame: "<prefix>__<state>__<desktop|phone> <asset id>"
#   framesDir:        render.mjs output, one folder per prefix (frames/01/01__results__desktop.png ...)
#   outRoot:          publish with root=<outRoot>, file_path=<outRoot>/project/canvas.json, files = the
#                     "project/..." paths it prints (one entry per artboard it wrote)
# Frames without a blob keep their current artboard and size. Add new phases to PHASES below.
import json, re, os, sys
from PIL import Image
live, blobs_file, FR, ROOT = sys.argv[1:5]
PAGES = os.path.join(os.path.dirname(__file__), "..", "pages")
blobs = dict(l.split() for l in open(blobs_file) if l.strip())
c = json.load(open(live)); B, N, O = c["boards"], c["notes"], c["order"]
os.makedirs(ROOT + "/project", exist_ok=True)
written = []
PX = [0, 2110, 4220]  # desktop x of each pair; phone at +1520

def size(key):
    im = Image.open(f"{FR}/{key.split('__')[0]}/{key}.png"); return im.size[0] // 2, im.size[1] // 2

def artboard(fname, title, key):
    w, h = size(key)
    alt = title.replace(" · ", ", ").replace(", Desktop", ", desktop render").replace(", Phone", ", phone render")
    open(f"{ROOT}/project/{fname}", "w").write(f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>
body{{margin:0;background:#030b17}}
</style>
</helmet>
<img src="/_blob/{blobs[key]}" alt="{alt}" style="display: block; width: {w}px; height: {h}px">
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":{w},"height":{h}}}}}'>
class Component extends DCLogic {{
renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
''')
    written.append(fname); return w, h

def labels(page_file):
    return re.findall(r'data-state="([^"]+)" data-label="([^"]+)"', open(f"{PAGES}/{page_file}").read())

def place(fname, title, key, x, y):
    if key in blobs: w, h = artboard(fname, title, key)
    else: w, h = B[fname]["w"], B[fname]["h"]
    B[fname] = {**B.get(fname, {}), "h": h, "title": title, "w": w, "x": x, "y": y}
    if fname not in O: O.append(fname)
    return h

# Phase 0, page 0.2: library sections in fixed rows (0.1 Tokens is left as it is)
lib = dict(labels("0.2-components.html"))
y = 4123
for row in [["shell", "buttons", "fields"], ["status", "identity", "cards"], ["notices", "confirm", "patterns"], ["booking"]]:
    tallest = 0
    for i, s in enumerate(row):
        for wn, dx in (("desktop", 0), ("phone", 1520)):
            tallest = max(tallest, place(f"0-2-{s}-{wn}.dc.html", f"0.2 Components · {lib[s]} · {wn.title()}", f"0-2__{s}__{wn}", PX[i] + dx, y))
    y += tallest + 200
end = y - 200

# Phases: (note id, title, [(prefix, page name, source file, artifact url), ...])
PHASES = [
    ("phase1", "Phase 1 · Find and book a coach", [
        ("01", "01 Browse coaches", "01-browse-coaches.html", "https://claude.ai/artifact/S2LvRXMYBbk7uq3xjGTfcC"),
        ("02", "02 Coach profile", "02-coach-profile.html", "https://claude.ai/artifact/GUw5NpQEWds2tvVRkCVH2Y"),
        ("03", "03 Pick a slot", "03-pick-a-slot.html", "https://claude.ai/artifact/DoTXw1NFPY7nMf64rrNVV9"),
        ("04", "04 Checkout summary", "04-checkout-summary.html", "https://claude.ai/artifact/EFj1Br4ak4Xnd7935vocsw"),
        ("05", "05 Payment return", "05-payment-return.html", "https://claude.ai/artifact/HSpMwJ9o7dDJAEYaDy6wUa"),
    ]),
]
for nid, ptitle, pages in PHASES:
    top = end + 600
    N[nid] = {**N.get(nid, {}), "kind": "title1", "maxW": 6130, "text": ptitle, "w": 240, "x": 0, "y": top}
    if nid == "phase1": N.setdefault("check2", {"fill": "green", "size": 24, "w": 520, "x": -640, "text": "Checkpoint 2: the booking flow end to end, pages 01 to 05."})["y"] = top
    ty = top + 430
    for pp, name, src, url in pages:
        sfx = "p" + nid[-1]
        N[f"page{pp}{sfx}"] = {"kind": "title1", "maxW": 6130, "text": name, "w": 240, "x": 0, "y": ty}
        y = ty + 330
        N[f"link{pp}{sfx}"] = {"fill": "green", "size": 24, "w": 520, "x": -640, "y": y, "text": f"{name}\nInteractive page: {url}\nSource: design/pages/{src}\nOne frame per state, desktop then phone."}
        st = labels(src)
        for r in range(0, len(st), 3):
            tallest = 0
            for i, (sid, lab) in enumerate(st[r:r + 3]):
                for wn, dx in (("desktop", 0), ("phone", 1520)):
                    tallest = max(tallest, place(f"{pp}-{sid}-{wn}.dc.html", f"{name} · {lab} · {wn.title()}", f"{pp}__{sid}__{wn}", PX[i] + dx, y))
            y += tallest + 200
        ty = y - 200 + 370
    end = ty - 370

json.dump(c, open(f"{ROOT}/project/canvas.json", "w"), indent=2, ensure_ascii=False)
print(json.dumps({f"project/{f}": f"project/{f}" for f in written}))
print(f"{len(written)} artboards written; canvas ends at y = {end}", file=sys.stderr)
