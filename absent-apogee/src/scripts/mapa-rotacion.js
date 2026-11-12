// Store location: the map stays 12 s, then a 4 s clip of the walk from the Cathedral plays.
// The rotation only runs on screen, keeps going after a button pick, pauses while
// the pointer or focus is on the frame, and stops once the visitor uses the map
// itself or opens the full walk. On touch screens a tap on the map (often just a scroll
// that landed on it) only pauses the rotation for a while. Reduced motion and data saver
// get the buttons only.
// Timers, the window and the visibility observer are injectable for tests.
export const DURACION = { mapa: 12000, recorrido: 4000, pausaTactil: 10000 };

export function iniciarMapa(marco, {
  reducir = false,
  ahorro = false,
  reloj = { poner: (fn, ms) => setTimeout(fn, ms), quitar: (id) => clearTimeout(id) },
  ventana = window,
  tactil = ventana.matchMedia?.('(pointer: coarse)').matches ?? false,
  observar = (el, cb) => new IntersectionObserver(([e]) => cb(e.isIntersecting), { threshold: 0.4 }).observe(el),
} = {}) {
  const video = marco.querySelector('video');
  const capa = marco.querySelector('.mapa__recorrido');
  const iframe = marco.querySelector('iframe');
  const botones = marco.querySelectorAll('[data-ver]');
  const completo = marco.querySelector('.mapa__completo');
  let vista = 'mapa';
  let temporizador = 0;
  let visible = false;
  let encima = false;
  let detenido = false;
  let entero = false;

  const reproducir = () => video.play()?.catch?.(() => {});
  const cargar = (src) => { if (video.getAttribute('src') !== src) video.src = src; };
  const verTramo = () => {
    entero = false;
    marco.classList.remove('mapa--entero');
    video.controls = false;
    cargar(video.dataset.tramo);
  };
  const mostrar = (nueva) => {
    vista = nueva;
    marco.dataset.vista = nueva;
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.ver === nueva)));
    capa.setAttribute('aria-hidden', String(nueva !== 'recorrido'));
    iframe.toggleAttribute('inert', nueva !== 'mapa');
    if (nueva === 'recorrido') {
      if (!entero) { verTramo(); video.currentTime = 0; }
      reproducir();
    } else video.pause();
  };
  const programar = () => {
    reloj.quitar(temporizador);
    if (detenido || entero || encima || !visible || reducir || ahorro) return;
    temporizador = reloj.poner(() => { mostrar(vista === 'mapa' ? 'recorrido' : 'mapa'); programar(); }, DURACION[vista]);
  };

  botones.forEach((b) => b.addEventListener('click', () => {
    if (entero) verTramo();
    mostrar(b.dataset.ver);
    programar();
  }));
  completo.addEventListener('click', () => {
    reloj.quitar(temporizador);
    entero = true;
    marco.classList.add('mapa--entero');
    cargar(video.dataset.completo);
    video.controls = true;
    video.currentTime = 0;
    mostrar('recorrido');
    video.focus();
  });
  // After the full walk, return to the map and let the rotation resume.
  video.addEventListener('ended', () => { if (entero) { verTramo(); mostrar('mapa'); programar(); } });
  // Hover pauses only for a mouse; focus pauses unless it is a tap landing in the map.
  const pausar = (v) => (e) => {
    if (e?.pointerType && e.pointerType !== 'mouse') return;
    if (tactil && e?.target === iframe) return;
    encima = v; programar();
  };
  marco.addEventListener('pointerenter', pausar(true));
  marco.addEventListener('pointerleave', pausar(false));
  marco.addEventListener('focusin', pausar(true));
  marco.addEventListener('focusout', pausar(false));
  // A click inside the map iframe never reaches the page: the window blurs instead.
  ventana.addEventListener('blur', () => {
    if (ventana.document.activeElement !== iframe) return;
    reloj.quitar(temporizador);
    if (!tactil) { detenido = true; return; }
    temporizador = reloj.poner(programar, DURACION.pausaTactil);
  });

  observar(marco, (enPantalla) => {
    visible = enPantalla;
    if (!visible) { reloj.quitar(temporizador); video.pause(); }
    else { if (vista === 'recorrido' && entero) reproducir(); programar(); }
  });
}
