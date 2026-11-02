// Hundreds of beans fall behind the tagline and settle into the 50 of the event section.
// All motion runs in the vertex shader: per frame the CPU only updates a few uniforms,
// and nothing renders while the scene is off screen.
import * as THREE from 'three';

function geometriaGrano(ancho, alto) {
  const geo = new THREE.SphereGeometry(1, ancho, alto);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) * 0.78, y = p.getY(i) * 1.08;
    let z = p.getZ(i) * 0.66;
    if (z > 0) {
      // Flat face with the S-shaped center crease of a real bean.
      z *= 0.62;
      z -= 0.2 * Math.exp(-(((x - Math.sin(y * 2.6) * 0.075) / 0.085) ** 2));
    }
    p.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

function muestrearCincuenta(cantidad) {
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

export async function iniciarGrano({ canvas, escena }) {
  try { await document.fonts.load('800 330px Manrope'); } catch {}
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.z = 14;
  const altoMundo = 2 * 14 * Math.tan(THREE.MathUtils.degToRad(15));
  scene.add(new THREE.HemisphereLight('#fff8ea', '#3a2a22', 1.5));
  const sol = new THREE.DirectionalLight('#fff3dc', 3);
  sol.position.set(-4, 6, 8);
  scene.add(sol);
  const borde = new THREE.DirectionalLight('#45bbc3', 1.1);
  borde.position.set(6, -2, 3);
  scene.add(borde);

  const movil = innerWidth <= 860;
  const puntos = muestrearCincuenta(movil ? 380 : 700);
  const n = puntos.length;
  const base = movil ? geometriaGrano(14, 10) : geometriaGrano(20, 14);
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.attributes.position);
  geo.setAttribute('normal', base.attributes.normal);
  geo.setAttribute('uv', base.attributes.uv);
  geo.instanceCount = n;

  const destino = new Float32Array(n * 2), inicio = new Float32Array(n * 3);
  const datos = new Float32Array(n * 3), eje = new Float32Array(n * 3), tonos = new Float32Array(n * 3);
  const paleta = ['#744326', '#5f361e', '#86502d', '#4f2c18'].map((c) => new THREE.Color(c));
  const v = new THREE.Vector3();
  puntos.forEach(([x, y], i) => {
    destino.set([x, y], i * 2);
    inicio.set([(Math.random() - 0.5) * 1.15, 0.62 + Math.random() * 0.9, (Math.random() - 0.5) * 3], i * 3);
    datos.set([Math.random(), 0.8 + Math.random() * 0.45, Math.random() * 6.28], i * 3);
    v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    eje.set([v.x, v.y, v.z], i * 3);
    const t = paleta[i % 4];
    tonos.set([t.r, t.g, t.b], i * 3);
  });
  geo.setAttribute('aDestino', new THREE.InstancedBufferAttribute(destino, 2));
  geo.setAttribute('aInicio', new THREE.InstancedBufferAttribute(inicio, 3));
  geo.setAttribute('aDatos', new THREE.InstancedBufferAttribute(datos, 3));
  geo.setAttribute('aEje', new THREE.InstancedBufferAttribute(eje, 3));
  geo.setAttribute('aTono', new THREE.InstancedBufferAttribute(tonos, 3));

  const uniforms = {
    uP: { value: 0 }, uT: { value: 0 }, uTam: { value: 0.1 }, uAncho: { value: 5 },
    uCentro: { value: new THREE.Vector2() }, uCaida: { value: new THREE.Vector2(10, altoMundo) },
  };
  const material = new THREE.MeshStandardMaterial({ roughness: 0.52 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `
      attribute vec2 aDestino; attribute vec3 aInicio, aDatos, aEje, aTono;
      uniform float uP, uT, uTam, uAncho; uniform vec2 uCentro, uCaida;
      varying vec3 vTono;
      vec3 girar(vec3 p, vec3 e, float a) { return p * cos(a) + cross(e, p) * sin(a) + e * dot(e, p) * (1.0 - cos(a)); }
      float caida() { float k = clamp(uP * 1.7 - aDatos.x * 0.7, 0.0, 1.0); return 1.0 - pow(1.0 - k, 3.0); }
      float angulo(float k) { return aDatos.z + (1.0 - k) * (aDatos.z + uP * 16.0) + sin(uT * 0.6 + aDatos.z) * 0.05; }
    ` + shader.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        float kG = caida();
        objectNormal = girar(objectNormal, aEje, angulo(kG));`)
      .replace('#include <begin_vertex>', `
        vec3 transformed = girar(position * uTam * aDatos.y, aEje, angulo(kG));
        vec3 salida = vec3(aInicio.x * uCaida.x, aInicio.y * uCaida.y, aInicio.z);
        vec3 llegada = vec3(uCentro + aDestino * uAncho, 0.0);
        transformed += mix(salida, llegada, kG);
        vTono = aTono;`);
    shader.fragmentShader = `varying vec3 vTono;\n` + shader.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>\n diffuseColor.rgb *= vTono;`);
  };
  const lluvia = new THREE.Mesh(geo, material);
  lluvia.frustumCulled = false;
  scene.add(lluvia);

  function medir() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    const ancho = altoMundo * camera.aspect;
    const m = innerWidth <= 860;
    uniforms.uAncho.value = m ? ancho * 0.9 : Math.min(ancho * 0.48, 7);
    uniforms.uCaida.value.set(ancho, altoMundo);
    uniforms.uTam.value = (m ? 0.082 : 0.086) * (uniforms.uAncho.value / 5) * (m ? 1.25 : 1);
    canvasCentro(m, ancho);
  }
  let cx = 0, cyBase = 0;
  function canvasCentro(m, ancho) { cx = m ? 0 : ancho * 0.2; cyBase = m ? altoMundo * 0.2 : 0; }
  medir();
  addEventListener('resize', medir);

  const timer = new THREE.Timer();
  timer.connect(document);
  renderer.compile(scene, camera);

  renderer.setAnimationLoop(() => {
    const { progreso, tope } = escena();
    const activo = progreso > 0 && tope > -innerHeight;
    canvas.style.display = activo ? 'block' : 'none';
    if (!activo) return;
    timer.update();
    uniforms.uT.value = timer.getElapsed();
    uniforms.uP.value = progreso;
    uniforms.uCentro.value.set(cx, cyBase - (tope / innerHeight) * altoMundo);
    renderer.render(scene, camera);
  });
}
