/* ═══════════════════════════════════════════════════════════════════════════
   Shader gradients. A dependency-free WebGL port of ShaderGradient (github.com/ruucm/shadergradient, MIT):
   the same plane geometry, the same periodic-noise displacement along the normal, the same three-colour mix
   (x across the plane, then the displacement), lit the way its '3d' light type lights it (ambient × brightness,
   metalness 0.2, linear output, no tone mapping). Camera and mesh transforms follow its props exactly, so a
   preset copied from shadergradient.co renders the same here, without three.js.
   Renders only while on screen; one still frame under reduced motion; pauses in background tabs.
   ═══════════════════════════════════════════════════════════════════════════ */

export const PRESETS = {
  /* Your first link: ember water. */
  ember: { type: 'waterPlane', bg: '#000000', brightness: 1.2, cAzimuthAngle: 180, cDistance: 2.41, cPolarAngle: 95, fov: 45,
    color1: '#ff6a1a', color2: '#c73c00', color3: '#FD4912', positionX: 0, positionY: -2.1, positionZ: 0, rotationX: 0, rotationY: 0, rotationZ: 225,
    uDensity: 1.8, uSpeed: 0.2, uStrength: 3, uTime: 0.2, grain: false },
  /* Your second link: violet water. */
  violet: { type: 'waterPlane', bg: '#000000', brightness: 1.1, cAzimuthAngle: 180, cDistance: 3.9, cPolarAngle: 115, fov: 45,
    color1: '#5606ff', color2: '#fe8989', color3: '#000000', positionX: -0.5, positionY: 0.1, positionZ: 0, rotationX: 0, rotationY: 0, rotationZ: 235,
    uDensity: 1.1, uSpeed: 0.1, uStrength: 2.4, uTime: 0.2, grain: false },
  /* Your third link: dawn plane, with grain. */
  dawn: { type: 'plane', bg: null, brightness: 1.2, cAzimuthAngle: 180, cDistance: 3.6, cPolarAngle: 90, fov: 45,
    color1: '#ff5005', color2: '#dbba95', color3: '#d0bce1', positionX: -1.4, positionY: 0, positionZ: 0, rotationX: 0, rotationY: 10, rotationZ: 50,
    uDensity: 1.3, uSpeed: 0.4, uStrength: 4, uTime: 0, grain: true },
}

const NOISE = `vec3 mod289(vec3 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}`

const VERT = `
precision highp float;
attribute vec2 aPos;
uniform mat4 uMVP;
uniform float uTime, uSpeed, uDensity, uStrength;
varying vec3 vPos;
${NOISE}
void main() {
  vec3 position = vec3(aPos, 0.0);
  vec3 noisePos = 0.43 * position * uDensity;
  float distortion = 0.75 * cnoise(noisePos + uTime * uSpeed);
  vec3 pos = position + vec3(0.0, 0.0, 1.0) * distortion * uStrength;
  vPos = pos;
  gl_Position = uMVP * vec4(pos, 1.0);
}`

const FRAG = `
precision highp float;
uniform vec3 uC1, uC2, uC3;
uniform float uLight;
varying vec3 vPos;
void main() {
  vec3 base = mix(mix(uC1, uC2, smoothstep(-3.0, 3.0, vPos.x)), uC3, vPos.z);
  gl_FragColor = vec4(clamp(base * uLight, 0.0, 1.0), 1.0);
}`

const hex = (h) => { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255] }
const rad = (d) => (d * Math.PI) / 180

/* Small column-major mat4 helpers. */
const mul = (a, b) => { const o = new Float32Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s } return o }
const perspective = (fovY, aspect, near, far) => { const f = 1 / Math.tan(fovY / 2), nf = 1 / (near - far); return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]) }
function lookAt(e, t, up) {
  let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2]; let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l
  let xx = up[1] * zz - up[2] * zy, xy = up[2] * zx - up[0] * zz, xz = up[0] * zy - up[1] * zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx
  return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0, -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1])
}
/* three.js Euler 'XYZ' → matrix, then translation. */
function model(p) {
  const a = rad(p.rotationX), b = rad(p.rotationY), c = rad(p.rotationZ)
  const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c)
  const ae = ca * cc, af = ca * sc, be = sa * cc, bf = sa * sc
  return new Float32Array([
    cb * cc, af + be * sb, bf - ae * sb, 0,
    -cb * sc, ae - bf * sb, be + af * sb, 0,
    sb, -sa * cb, ca * cb, 0,
    p.positionX, p.positionY, p.positionZ, 1,
  ])
}
function camera(p) {
  const phi = rad(p.cPolarAngle), th = rad(p.cAzimuthAngle), r = p.cDistance
  return [r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi), r * Math.sin(phi) * Math.cos(th)]
}
/* PlaneGeometry(10, 10, wSeg, hSeg), drawn as indexed triangles. */
function plane(ws, hs) {
  const v = [], idx = []
  for (let iy = 0; iy <= hs; iy++) for (let ix = 0; ix <= ws; ix++) v.push(ix / ws * 10 - 5, 5 - iy / hs * 10)
  for (let iy = 0; iy < hs; iy++) for (let ix = 0; ix < ws; ix++) {
    const a = ix + (ws + 1) * iy, b = ix + (ws + 1) * (iy + 1), c = ix + 1 + (ws + 1) * (iy + 1), d = ix + 1 + (ws + 1) * iy
    idx.push(a, b, d, b, c, d)
  }
  return { v: new Float32Array(v), i: idx.length > 65535 ? new Uint32Array(idx) : new Uint16Array(idx) }
}

/** Mount a gradient on a canvas. Returns { destroy, setPreset }. */
export function mountShader(canvas, name = 'violet', { still = false } = {}) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false, powerPreference: 'low-power' })
  if (!gl) return null
  const big = gl.getExtension('OES_element_index_uint')
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o }
  const prog = gl.createProgram()
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(prog)
  gl.useProgram(prog)
  const U = Object.fromEntries(['uMVP', 'uTime', 'uSpeed', 'uDensity', 'uStrength', 'uC1', 'uC2', 'uC3', 'uLight'].map((k) => [k, gl.getUniformLocation(prog, k)]))
  const vbo = gl.createBuffer(), ibo = gl.createBuffer()
  const aPos = gl.getAttribLocation(prog, 'aPos')
  let p, count = 0, itype = gl.UNSIGNED_SHORT, t = 0, raf = 0, last = 0, on = true, w = 0, h = 0
  const setPreset = (n) => {
    p = PRESETS[n] || PRESETS.violet
    const seg = big ? 192 : 128
    const g = p.type === 'plane' ? plane(1, seg) : plane(seg, seg)
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, g.v, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, g.i, gl.STATIC_DRAW)
    itype = g.i instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT; count = g.i.length
    gl.enableVertexAttribArray(aPos); gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    gl.uniform3fv(U.uC1, hex(p.color1)); gl.uniform3fv(U.uC2, hex(p.color2)); gl.uniform3fv(U.uC3, hex(p.color3))
    gl.uniform1f(U.uLight, p.brightness * 0.8); gl.uniform1f(U.uSpeed, p.uSpeed); gl.uniform1f(U.uDensity, p.uDensity); gl.uniform1f(U.uStrength, p.uStrength)
    t = p.uTime
    w = 0
  }
  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const cw = Math.max(1, Math.round(canvas.clientWidth * dpr)), ch = Math.max(1, Math.round(canvas.clientHeight * dpr))
    if (cw !== w || ch !== h) {
      w = cw; h = ch; canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h)
      const proj = perspective(rad(p.fov), w / h, 0.1, 100)
      const view = lookAt(camera(p), [0, 0, 0], [0, 1, 0])
      gl.uniformMatrix4fv(U.uMVP, false, mul(mul(proj, view), model(p)))
    }
    if (p.bg) { const c = hex(p.bg); gl.clearColor(c[0], c[1], c[2], 1) } else gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform1f(U.uTime, t)
    gl.drawElements(gl.TRIANGLES, count, itype, 0)
  }
  const loop = (now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
    last = now
    t += dt
    draw()
    raf = on ? requestAnimationFrame(loop) : 0
  }
  setPreset(name)
  draw()
  const start = () => { if (!raf && !still) { last = 0; on = true; raf = requestAnimationFrame(loop) } }
  const stop = () => { on = false; cancelAnimationFrame(raf); raf = 0 }
  let seen = false
  const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen && !document.hidden) start(); else stop() }, { rootMargin: '120px' })
  io.observe(canvas)
  const vis = () => (document.hidden ? stop() : seen && start())
  document.addEventListener('visibilitychange', vis)
  const ro = new ResizeObserver(() => { if (!raf) draw() })
  ro.observe(canvas)
  return {
    setPreset: (n) => { setPreset(n); draw() },
    destroy: () => { stop(); io.disconnect(); ro.disconnect(); document.removeEventListener('visibilitychange', vis); gl.getExtension('WEBGL_lose_context')?.loseContext() },
  }
}
