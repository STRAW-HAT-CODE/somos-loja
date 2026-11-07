// Watercolor beans rain onto the paper with the scroll and settle into the 50 brands.
// Same contract as granos-vintage.js, but painted sprites on a 2D canvas: no WebGL,
// no Three.js, and nothing redraws while the scroll is still.
const SPRITES = ['/granos/grano-acuarela-1.webp', '/granos/grano-acuarela-2.webp'];

function cargarImagen(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// The destination shape is read from the alpha of the text "50", one point every 3px.
function muestrear(cantidad) {
  const c = document.createElement('canvas');
  c.width = 520; c.height = 320;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.font = '800 330px Manrope, system-ui, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('50', 260, 175);
  const { data } = g.getImageData(0, 0, 520, 320);
  const puntos = [];
  for (let y = 0; y < 320; y += 3) for (let x = 0; x < 520; x += 3) if (data[(y * 520 + x) * 4 + 3] > 128) puntos.push([x, y]);
  for (let i = puntos.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [puntos[i], puntos[j]] = [puntos[j], puntos[i]]; }
  return puntos.slice(0, cantidad).map(([x, y]) => [(x - 260) / 520, (160 - y) / 520]);
}

export async function iniciarGranos(canvas, seccion, progreso) {
  try { await document.fonts.load('800 330px Manrope'); } catch {}

  const sprites = (await Promise.all(SPRITES.map((src) => cargarImagen(src).catch(() => null)))).filter(Boolean);
  if (!sprites.length) throw new Error('No watercolor sprites available');

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable');

  const movil = innerWidth <= 860;
  const puntos = muestrear(movil ? 260 : 520);

  const granos = puntos
    .map(([nx, ny], i) => ({
      nx, ny,
      sprite: sprites[i % sprites.length],
      semilla: Math.random(),
      escala: 0.8 + Math.random() * 0.45,
      angulo: Math.random() * 6.28,
      inicioX: Math.random() - 0.5,
      inicioY: 0.6 + Math.random() * 0.5,
      opacidad: 0.82 + Math.random() * 0.18,
    }))
    .sort((a, b) => a.escala - b.escala);

  let w = 0, h = 0, ancho50 = 0, tamBase = 0, centroY = 0;

  function medir() {
    w = seccion.clientWidth;
    h = seccion.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Reproduce the framing of the old camera: 7.5 world units tall, 50 centred above.
    const ppu = h / 7.5;
    const mundoAncho = w / ppu;
    ancho50 = (movil ? mundoAncho * 0.92 : Math.min(mundoAncho * 0.5, 6.4)) * ppu;
    tamBase = 0.09 * (ancho50 / 5) * (movil ? 1.35 : 1.1);
    centroY = h * 0.5 - h * 0.12;
  }

  medir();
  addEventListener('resize', medir);

  const llegar = (k) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);

  function pintar(p) {
    ctx.clearRect(0, 0, w, h);
    for (const g of granos) {
      const k = llegar(p * 1.6 - g.semilla * 0.6);
      const inicioPx = w * 0.5 + g.inicioX * w * 0.5;
      const finPx = w * 0.5 + g.nx * ancho50;
      const x = inicioPx + (finPx - inicioPx) * k;
      const inicioPy = h * 0.5 - g.inicioY * h;
      const finPy = centroY - g.ny * ancho50;
      const y = inicioPy + (finPy - inicioPy) * k;
      const tam = 2 * tamBase * g.escala;
      ctx.save();
      ctx.globalAlpha = g.opacidad;
      ctx.translate(x, y);
      ctx.rotate(g.angulo + (1 - k) * 9);
      ctx.drawImage(g.sprite, -tam / 2, -tam / 2, tam, tam);
      ctx.restore();
    }
  }

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(seccion);

  let ultimo = -1;
  function bucle() {
    if (visible) {
      const p = progreso();
      // The scroll is the clock: no scroll, no redraw.
      if (Math.abs(p - ultimo) > 0.0004) { ultimo = p; pintar(p); }
    }
    requestAnimationFrame(bucle);
  }
  pintar(progreso());
  requestAnimationFrame(bucle);
}
