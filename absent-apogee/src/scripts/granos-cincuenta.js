// Beans fall when the page opens and settle into the 50 brands of the store.
// When the visitor scrolls they drop out, leading into the coffee process.
// All motion runs in the vertex shader; nothing renders while the hero is off screen.
import * as THREE from 'three';

function geometriaGrano() {
  const geo = new THREE.SphereGeometry(1, 18, 12);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i) * 0.78, y = p.getY(i) * 1.08;
    let z = p.getZ(i) * 0.66;
    if (z > 0) {
      z *= 0.62;
      z -= 0.2 * Math.exp(-(((x - Math.sin(y * 2.6) * 0.075) / 0.085) ** 2));
    }
    p.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

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

export async function iniciarGranos(canvas, seccion) {
  try { await document.fonts.load('800 330px Manrope'); } catch {}
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  camera.position.z = 14;
  const alto = 2 * 14 * Math.tan(THREE.MathUtils.degToRad(15));
  scene.add(new THREE.HemisphereLight('#fff8ea', '#2a1d16', 1.7));
  const sol = new THREE.DirectionalLight('#fff3dc', 3);
  sol.position.set(-4, 6, 8);
  scene.add(sol);

  const movil = innerWidth <= 860;
  const puntos = muestrear(movil ? 260 : 520);
  const n = puntos.length;
  const base = geometriaGrano();
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.attributes.position);
  geo.setAttribute('normal', base.attributes.normal);
  geo.instanceCount = n;
  const destino = new Float32Array(n * 2), inicio = new Float32Array(n * 2), datos = new Float32Array(n * 3), eje = new Float32Array(n * 3), tono = new Float32Array(n * 3);
  const paleta = ['#8a5230', '#6f4026', '#a0623a', '#5c341d'].map((c) => new THREE.Color(c));
  const v = new THREE.Vector3();
  puntos.forEach(([x, y], i) => {
    destino.set([x, y], i * 2);
    inicio.set([(Math.random() - 0.5) * 0.5, 0.6 + Math.random() * 0.5], i * 2);
    datos.set([Math.random(), 0.8 + Math.random() * 0.45, Math.random() * 6.28], i * 3);
    v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    eje.set([v.x, v.y, v.z], i * 3);
    const c = paleta[i % 4];
    tono.set([c.r, c.g, c.b], i * 3);
  });
  geo.setAttribute('aDestino', new THREE.InstancedBufferAttribute(destino, 2));
  geo.setAttribute('aInicio', new THREE.InstancedBufferAttribute(inicio, 2));
  geo.setAttribute('aDatos', new THREE.InstancedBufferAttribute(datos, 3));
  geo.setAttribute('aEje', new THREE.InstancedBufferAttribute(eje, 3));
  geo.setAttribute('aTono', new THREE.InstancedBufferAttribute(tono, 3));

  const uniforms = { uI: { value: 0 }, uS: { value: 0 }, uTam: { value: 0.09 }, uAncho: { value: 5 }, uAlto: { value: alto }, uCentro: { value: new THREE.Vector2() }, uW: { value: 10 } };
  const material = new THREE.MeshStandardMaterial({ roughness: 0.5 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `
      attribute vec2 aDestino, aInicio; attribute vec3 aDatos, aEje, aTono;
      uniform float uI, uS, uTam, uAncho, uAlto, uW; uniform vec2 uCentro;
      varying vec3 vTono;
      vec3 girar(vec3 p, vec3 e, float a) { return p * cos(a) + cross(e, p) * sin(a) + e * dot(e, p) * (1.0 - cos(a)); }
      float llegada() { float k = clamp(uI * 1.6 - aDatos.x * 0.6, 0.0, 1.0); return 1.0 - pow(1.0 - k, 3.0); }
      float caida() { float k = clamp(uS * 1.7 - aDatos.x * 0.7, 0.0, 1.0); return k * k; }
    ` + shader.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        float kL = llegada(), kC = caida();
        float aG = aDatos.z + (1.0 - kL) * 9.0 + kC * 7.0;
        objectNormal = girar(objectNormal, aEje, aG);`)
      .replace('#include <begin_vertex>', `
        vec3 transformed = girar(position * uTam * aDatos.y, aEje, aG);
        vec2 sitio = mix(vec2(uCentro.x + aInicio.x * uW, aInicio.y * uAlto), uCentro + aDestino * uAncho, kL);
        sitio.y -= kC * uAlto * (1.2 + aDatos.x);
        transformed.xy += sitio;
        vTono = aTono;`);
    shader.fragmentShader = `varying vec3 vTono;\n` + shader.fragmentShader
      .replace('#include <color_fragment>', `#include <color_fragment>\n diffuseColor.rgb *= vTono;`);
  };
  const mesh = new THREE.Mesh(geo, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  function medir() {
    const w = seccion.clientWidth, h = seccion.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const ancho = alto * camera.aspect;
    const m = w <= 860;
    uniforms.uW.value = ancho;
    uniforms.uAncho.value = m ? ancho * 0.72 : Math.min(ancho * 0.34, 5.2);
    uniforms.uTam.value = 0.09 * (uniforms.uAncho.value / 5) * (m ? 1.35 : 1.1);
    uniforms.uCentro.value.set(m ? 0 : ancho * 0.25, m ? alto * 0.3 : alto * 0.14);
  }
  medir();
  addEventListener('resize', medir);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(seccion);
  const t0 = performance.now();
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    uniforms.uI.value = Math.min(1, (performance.now() - t0) / 2200);
    uniforms.uS.value = Math.min(1, scrollY / (innerHeight * 0.75));
    renderer.render(scene, camera);
  });
}
