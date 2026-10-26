# Usage: python3 scripts/art/bands.py <out-dir>   (needs numpy and Pillow)
# Full-bleed section backgrounds, after the blue grain references: soft blue light pooled at two corners of a white (or
# navy) field, a silk streak of light, film grain; and a "sky" version with a halftone cloud, a thin grid and faint orbit
# circles. Four files: band-light.webp, band-dark.webp, sky-light.webp, sky-dark.webp. No text.
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUT = sys.argv[1]
W, H = 1680, 945
rng = np.random.default_rng(7)
X = np.linspace(0, 1, W)[None, :]
Y = np.linspace(0, 1, H)[:, None]


def C(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def blob(cx, cy, rx, ry, rot=0.0):
    ca, sa = np.cos(rot), np.sin(rot)
    dx, dy = X - cx, Y - cy
    u, v = (dx * ca + dy * sa) / rx, (-dx * sa + dy * ca) / ry
    return np.exp(-(u * u + v * v))


def streak(y0, amp, freq, phase, width, x0=0.0, x1=1.0):
    yc = y0 + amp * np.sin(2 * np.pi * freq * X + phase)
    s = np.exp(-((Y - yc) / width) ** 2)
    return s * np.clip((X - x0) / 0.2, 0, 1) * np.clip((x1 - X) / 0.2, 0, 1)


def ramp(t, stops):
    """Map t in 0..1 through colour stops [(pos, hex), ...]."""
    out = np.zeros(t.shape + (3,), np.float32)
    for (p0, c0), (p1, c1) in zip(stops, stops[1:]):
        m = ((t >= p0) & (t <= p1))[..., None]
        k = ((t - p0) / max(p1 - p0, 1e-6))[..., None]
        out = np.where(m, C(c0) * (1 - k) + C(c1) * k, out)
    return out


def finish(a, grain=20, blur=0):
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    if blur: im = im.filter(ImageFilter.GaussianBlur(blur))
    b = np.asarray(im).astype(np.float32)
    b = b + rng.normal(0, grain, (H, W))[..., None] + rng.normal(0, grain * 0.3, (H, W, 3))
    return Image.fromarray(np.clip(b, 0, 255).astype(np.uint8))


def band(dark):
    # intensity of blue light: a pool at top right and one at bottom left, swept along a diagonal
    t = np.clip(blob(1.0, 0.1, 0.62, 0.2, -0.42) * 1.08 + blob(0.0, 0.9, 0.62, 0.2, -0.36) * 1.04 + blob(0.5, 0.5, 0.9, 0.06, -0.4) * 0.12, 0, 1)
    if dark:
        base = C('#05081a')
        col = ramp(t, [(0, '#05081a'), (0.35, '#08205f'), (0.7, '#1f5be0'), (1, '#7fb3ff')])
        a = base * (1 - t[..., None]) + col * t[..., None]
        a = a + streak(0.2, 0.05, 0.6, 1.0, 0.012, 0.55, 1.0)[..., None] * C('#9cc6ff') * 0.35
    else:
        col = ramp(t, [(0, '#ffffff'), (0.3, '#cfe2ff'), (0.62, '#3a86f0'), (0.86, '#0a47c9'), (1, '#071f5e')])
        a = col
        a = a + streak(0.16, 0.05, 0.7, 0.4, 0.01, 0.0, 0.45)[..., None] * 0.35
        a = a + streak(0.86, 0.04, 0.8, 2.2, 0.01, 0.55, 1.0)[..., None] * 0.3
    return finish(a, grain=16 if dark else 10, blur=14)


def sky(dark):
    t = np.clip(blob(0.85, 0.65, 0.45, 0.4, 0.3) * 1.15 + blob(0.95, 0.15, 0.3, 0.2) * 0.6 + blob(0.1, 0.55, 0.25, 0.35) * 0.35, 0, 1)
    if dark:
        a = ramp(t, [(0, '#060a1c'), (0.5, '#0b2a78'), (1, '#2f7bff')])
    else:
        a = ramp(t, [(0, '#f2f8ff'), (0.45, '#9cc9ff'), (0.8, '#2d7ff0'), (1, '#0d5fd8')])
    a = a + streak(0.62, 0.08, 0.55, 1.2, 0.012, 0.5, 1.0)[..., None] * (0.25 if dark else 0.5)
    a = a + streak(0.2, 0.05, 0.7, 2.6, 0.01, 0.65, 1.0)[..., None] * (0.2 if dark else 0.4)
    im = finish(a, grain=14 if dark else 10, blur=12).convert('RGBA')
    over = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    line = (255, 255, 255, 46 if dark else 70)
    # a thin grid and faint orbit circles
    for gx in range(0, W, 290): d.line([(gx + 175, 0), (gx + 175, H)], fill=line, width=1)
    for gy in range(0, H, 290): d.line([(0, gy + 75), (W, gy + 75)], fill=line, width=1)
    for (cx, cy, r) in [(1180, 440, 410), (1180, 440, 300), (220, 740, 290), (1540, 610, 290)]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=line, width=1)
    # a halftone cloud, top left: dot size follows a soft cloud mask
    cloud = np.clip(blob(0.18, 0.22, 0.18, 0.09) + blob(0.32, 0.16, 0.12, 0.07) + blob(0.42, 0.24, 0.14, 0.08) + blob(0.08, 0.3, 0.14, 0.08), 0, 1)
    dc = (255, 255, 255, 90 if dark else 235)
    for py in range(6, int(H * 0.5), 12):
        for px in range(6, int(W * 0.58), 12):
            v = cloud[py, px]
            if v > 0.18:
                rr = 1 + v * 3.6
                d.ellipse([px - rr, py - rr, px + rr, py + rr], fill=dc)
    im = Image.alpha_composite(im, over).convert('RGB')
    return im


for name, fn in [('band', band), ('sky', sky)]:
    for mode in ('light', 'dark'):
        fn(mode == 'dark').save(f'{OUT}/{name}-{mode}.webp', quality=58, method=6)
print('ok')
