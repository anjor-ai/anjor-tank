# Favicons from the हेतु mark: black glyph on an ivory rounded square. Usage: python3 scripts/art/favicon.py <source.png>
import base64, io, sys
from PIL import Image, ImageDraw, ImageOps
src = Image.open(sys.argv[1]).convert('L')
box = ImageOps.invert(src).point(lambda v: 255 if v > 60 else 0).getbbox()
g = src.crop(box)
def icon(n, pad=0.14, radius=0.22, bg=(250, 249, 245)):
    out = Image.new('RGBA', (n, n), (0, 0, 0, 0))
    m = Image.new('L', (n, n), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, n - 1, n - 1], radius=int(n * radius), fill=255)
    out.paste(Image.new('RGBA', (n, n), bg + (255,)), (0, 0), m)
    inner = int(n * (1 - 2 * pad)); w, h = g.size; s = inner / max(w, h)
    gl = g.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
    ink = Image.new('RGBA', gl.size, (11, 11, 10, 255))
    out.paste(ink, ((n - gl.width) // 2, (n - gl.height) // 2), ImageOps.invert(gl))
    return out
icon(32, pad=0.08, radius=0.2).save('public/favicon-32.png')
icon(192).save('public/icon-192.png')
icon(512).save('public/icon-512.png')
a = icon(180, radius=0); a.save('public/apple-touch-icon.png')
icon(48, pad=0.08, radius=0.2).save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
b = io.BytesIO(); icon(128, pad=0.1).save(b, 'PNG', optimize=True)
open('public/favicon.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><image width="128" height="128" href="data:image/png;base64,{base64.b64encode(b.getvalue()).decode()}"/></svg>\n')
