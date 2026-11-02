// Coffee beans floating in front of the hero video. All motion runs in the vertex shader;
// nothing renders while the hero is off screen.
import * as THREE from 'three';

function geometriaGrano() {
  const geo = new THREE.SphereGeometry(1, 24, 16);
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

export function iniciarGranos(canvas, seccion) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
  camera.position.z = 14;
  scene.add(new THREE.HemisphereLight('#fff8ea', '#2a1d16', 1.6));
  const sol = new THREE.DirectionalLight('#fff3dc', 3.2);
  sol.position.set(-4, 6, 8);
  scene.add(sol);

  const movil = innerWidth <= 860;
  const n = movil ? 12 : 42;
  const base = geometriaGrano();
  const geo = new THREE.InstancedBufferGeometry();
  geo.index = base.index;
  geo.setAttribute('position', base.attributes.position);
  geo.setAttribute('normal', base.attributes.normal);
  geo.instanceCount = n;
  const lugar = new Float32Array(n * 3), datos = new Float32Array(n * 3), eje = new Float32Array(n * 3), tono = new Float32Array(n * 3);
  const paleta = ['#744326', '#5f361e', '#86502d', '#4f2c18'].map((c) => new THREE.Color(c));
  const v = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    // Keeps most beans toward the edges so the text stays clear.
    const lado = Math.random() < 0.72 ? 0.32 + Math.random() * 0.2 : Math.random() * 0.3;
    // Beans stay above the text on phones, and clear of the lower left on desktop.
    const alto = movil ? 0.02 + Math.random() * 0.48 : (Math.random() - 0.35) * 0.95;
    lugar.set([lado * (movil ? 0.95 : 1), alto, -2 + Math.random() * 5], i * 3);
    datos.set([Math.random() * 6.28, (movil ? 0.05 : 0.07) + Math.random() * 0.09, 0.25 + Math.random() * 0.45], i * 3);
    v.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    eje.set([v.x, v.y, v.z], i * 3);
    const c = paleta[i % 4];
    tono.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('aLugar', new THREE.InstancedBufferAttribute(lugar, 3));
  geo.setAttribute('aDatos', new THREE.InstancedBufferAttribute(datos, 3));
  geo.setAttribute('aEje', new THREE.InstancedBufferAttribute(eje, 3));
  geo.setAttribute('aTono', new THREE.InstancedBufferAttribute(tono, 3));

  const uniforms = { uT: { value: 0 }, uS: { value: 0 }, uMundo: { value: new THREE.Vector2(10, 8) }, uM: { value: new THREE.Vector2() } };
  const material = new THREE.MeshStandardMaterial({ roughness: 0.5 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = `
      attribute vec3 aLugar, aDatos, aEje, aTono;
      uniform float uT, uS; uniform vec2 uMundo, uM;
      varying vec3 vTono;
      vec3 girar(vec3 p, vec3 e, float a) { return p * cos(a) + cross(e, p) * sin(a) + e * dot(e, p) * (1.0 - cos(a)); }
    ` + shader.vertexShader
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        float aG = aDatos.x + uT * aDatos.z + uS * 4.0;
        objectNormal = girar(objectNormal, aEje, aG);`)
      .replace('#include <begin_vertex>', `
        vec3 transformed = girar(position * aDatos.y * 2.2, aEje, aG);
        float lado = mod(aDatos.x * 7.0, 2.0) < 0.55 ? -1.0 : 1.0;
        vec3 sitio = vec3(aLugar.x * lado * uMundo.x, aLugar.y * uMundo.y, aLugar.z);
        sitio.y += sin(uT * aDatos.z + aDatos.x) * 0.22 + uS * (1.5 + aDatos.z * 7.0);
        sitio.xy += uM * (0.15 + aLugar.z * 0.07);
        transformed += sitio;
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
    const alto = 2 * 14 * Math.tan(THREE.MathUtils.degToRad(16));
    uniforms.uMundo.value.set(alto * camera.aspect, alto);
  }
  medir();
  addEventListener('resize', medir);

  const raton = new THREE.Vector2();
  addEventListener('pointermove', (e) => raton.set(e.clientX / innerWidth - 0.5, 0.5 - e.clientY / innerHeight), { passive: true });

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(seccion);
  const timer = new THREE.Timer();
  timer.connect(document);
  renderer.setAnimationLoop(() => {
    if (!visible) return;
    timer.update();
    uniforms.uT.value = timer.getElapsed();
    uniforms.uS.value = Math.max(0, scrollY / innerHeight);
    uniforms.uM.value.lerp(raton, 0.05);
    renderer.render(scene, camera);
  });
}
