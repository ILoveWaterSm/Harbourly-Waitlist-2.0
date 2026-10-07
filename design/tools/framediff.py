# Which re-rendered frames really changed: python3 design/tools/framediff.py <oldFramesDir> <newFramesDir>
# Prints CHANGED or NEW with the bounding box of the difference. Boxes about 30 to 170 px across that sit on a
# spinner are animation timing, not a change: skip those frames when replacing canvas frames.
import sys, os, glob
from PIL import Image, ImageChops
old, new = sys.argv[1], sys.argv[2]
for f in sorted(glob.glob(os.path.join(new, "**", "*.png"), recursive=True)):
    o = os.path.join(old, os.path.relpath(f, new))
    if not os.path.exists(o): print("NEW", f); continue
    a, b = Image.open(f).convert("RGB"), Image.open(o).convert("RGB")
    if a.size != b.size: print("CHANGED", f, "size", b.size, "->", a.size); continue
    box = ImageChops.difference(a, b).getbbox()
    if box: print("CHANGED", f, box)
