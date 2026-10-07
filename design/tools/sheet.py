# Contact sheet for reviewing renders: python3 design/tools/sheet.py out.png <crop height in CSS px> <scale> frame1.png frame2.png ...
# Crops the top of each 2x frame and lays them side by side.
import sys
from PIL import Image
out, h, sc, files = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
ims = []
for f in files:
    im = Image.open(f); w = im.size[0]
    im = im.crop((0, 0, w, min(im.size[1], h * 2)))
    im = im.resize((int(im.size[0] * sc), int(im.size[1] * sc)))
    ims.append(im)
W = sum(i.size[0] for i in ims) + 20 * (len(ims) - 1); H = max(i.size[1] for i in ims)
sheet = Image.new("RGB", (W, H), (60, 60, 60)); x = 0
for i in ims: sheet.paste(i, (x, 0)); x += i.size[0] + 20
sheet.save(out); print(sheet.size)
