# Copies every diagram and its note from USER-FLOW.md into user-flow.html (the published copy).
# Usage: python3 design/tools/flowsync.py   then republish design/user-flow.html to its link.
import re, html, os
D = os.path.join(os.path.dirname(__file__), "..")
md = open(f"{D}/USER-FLOW.md").read()
page = open(f"{D}/user-flow.html").read()
for n, body, note in re.findall(r'## (\d+)\. [^\n]+\n\n```mermaid\n(.*?)```\n(?:\n([^\n#-][^\n]*)\n)?', md, re.S):
    sec = re.search(r'(<section id="f%s" class="flow">\n  <h2>.*?</h2>\n)(.*?)(  <div class="diagram"><pre class="mermaid">\n)(.*?)(</pre>)' % n, page, re.S)
    note_html = f'  <p class="note">{html.escape(note, quote=True)}</p>\n' if note else '  \n'
    page = page[:sec.start()] + sec.group(1) + note_html + sec.group(3) + html.escape(body, quote=True) + sec.group(5) + page[sec.end():]
open(f"{D}/user-flow.html", "w").write(page)
print("synced")
