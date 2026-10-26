# Usage: python3 scripts/art/hills.py <out-dir>   (needs numpy and Pillow)
# The ROQIVA horizon: soft, grainy hills in magenta, ember, violet-blue and a thread of gold, under a sky that fades to the
# page colour. Two versions: hills-light.webp (sky = white) and hills-dark.webp (sky = warm near-black).
import sys, math
import numpy as np
from PIL import Image, ImageFilter

OUT = sys.argv[1]
W, H = 1800, 975
rng = np.random.default_rng(11)
x = np.linspace(0, 1, W)[None, :]
y = np.linspace(0, 1, H)[:, None]

def C(h): h = h.lstrip('#'); return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], np.float32) / 255

def ridge(base, amp, freqs, phase):
    v = np.zeros_like(x)
    for k, f in enumerate(freqs): v = v + amp / (k + 1) * np.sin(2 * np.pi * f * x + phase * (k + 1.3))
    return base - v

def render(sky):
    img = np.ones((H, W, 3), np.float32) * C(sky)
    # layers back to front: (ridge line, top colour, bottom colour, softness)
    layers = [
        (ridge(0.50, 0.07, [0.8, 1.9, 4.1], 0.4), '#c9b8ff', '#5d63d8', 0.10),
        (ridge(0.58, 0.06, [1.1, 2.3, 5.0], 1.7), '#8f7cf0', '#3f47c4', 0.08),
        (ridge(0.66, 0.05, [0.7, 1.6, 3.7], 2.6), '#ff7ab8', '#d8326a', 0.07),
        (ridge(0.72, 0.035, [1.3, 2.9, 6.1], 0.9), '#d9c45a', '#7a7a3a', 0.05),
        (ridge(0.78, 0.05, [0.9, 2.1, 4.4], 3.3), '#ff5a3c', '#c2261e', 0.06),
        (ridge(0.88, 0.04, [1.2, 2.6, 5.2], 1.1), '#ff7a2f', '#9e1f1a', 0.05),
    ]
    for top, c1, c2, soft in layers:
        t = np.clip((y - top) / 0.28, 0, 1)
        col = C(c1)[None, None, :] * (1 - t[..., None]) + C(c2)[None, None, :] * t[..., None]
        a = np.clip((y - top) / soft + 0.5, 0, 1)[..., None]
        img = img * (1 - a) + col * a
    # a pale haze rising off the hills into the sky
    haze = np.exp(-((y - 0.5) / 0.12) ** 2)[..., None] * np.array([1.0, 0.82, 0.9])[None, None, :]
    img = img + haze * (0.18 if sky.lower() != '#141413' else 0.08)
    # flowing light streaks across the slopes
    streak = np.exp(-((y - (0.74 + 0.03 * np.sin(x * 7))) / 0.006) ** 2) * np.clip(np.sin(x * 3.1 + 1) , 0, 1)
    img = img + streak[..., None] * np.array([1, 0.9, 0.7])[None, None, :] * 0.35
    if sky.lower() == '#141413': img = C(sky) + (img - C(sky)) * 0.7  # quieter hills on the dark page
    im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(14))
    a = np.asarray(im).astype(np.float32)
    # the sky fades into the page colour at the top
    fade = np.clip((y - 0.1) / 0.38, 0, 1) ** 1.4
    a = a * fade[..., None] + (C(sky) * 255)[None, None, :] * (1 - fade[..., None])
    # heavy grain, like film, coloured slightly
    g = rng.normal(0, 26, (H, W))
    gc = rng.normal(0, 10, (H, W, 3))
    a = a + g[..., None] * (0.35 + 0.65 * fade[..., None]) + gc * fade[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

render('#ffffff').save(f'{OUT}/hills-light.webp', quality=60, method=6)
render('#141413').save(f'{OUT}/hills-dark.webp', quality=60, method=6)
print('ok')
