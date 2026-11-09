import assert from 'node:assert/strict';
import { test } from 'node:test';
import { iniciarMapa } from '../src/scripts/mapa-rotacion.js';

// Minimal DOM stand-ins: only what the map controller touches.
class Nodo {
  constructor(atributos = {}) {
    this.atributos = { ...atributos };
    this.dataset = {};
    this.oyentes = {};
    this.clases = new Set();
    this.classList = {
      add: (c) => this.clases.add(c),
      remove: (c) => this.clases.delete(c),
      contains: (c) => this.clases.has(c),
    };
  }
  setAttribute(k, v) { this.atributos[k] = String(v); }
  getAttribute(k) { return k in this.atributos ? this.atributos[k] : null; }
  hasAttribute(k) { return k in this.atributos; }
  toggleAttribute(k, si) { if (si) this.atributos[k] = ''; else delete this.atributos[k]; }
  addEventListener(tipo, fn) { (this.oyentes[tipo] ||= []).push(fn); }
  emitir(tipo) { for (const fn of this.oyentes[tipo] || []) fn({ type: tipo }); }
  focus() {}
}

class Video extends Nodo {
  constructor() { super(); this.reproduciendo = false; this.controls = false; this.currentTime = 0; }
  get src() { return this.getAttribute('src') || ''; }
  set src(v) { this.setAttribute('src', v); }
  play() { this.reproduciendo = true; return Promise.resolve(); }
  pause() { this.reproduciendo = false; }
}

function montar({ reducir = false, ahorro = false } = {}) {
  const video = new Video();
  video.dataset = { tramo: '/tramo.mp4', completo: '/completo.mp4' };
  const capa = new Nodo({ 'aria-hidden': 'true' });
  const iframe = new Nodo();
  const verMapa = new Nodo({ 'aria-pressed': 'true' }); verMapa.dataset = { ver: 'mapa' };
  const verRecorrido = new Nodo({ 'aria-pressed': 'false' }); verRecorrido.dataset = { ver: 'recorrido' };
  const completo = new Nodo();
  const marco = new Nodo();
  marco.dataset = { vista: 'mapa' };
  marco.querySelector = (sel) => ({ video, '.mapa__recorrido': capa, iframe, '.mapa__completo': completo })[sel];
  marco.querySelectorAll = () => [verMapa, verRecorrido];

  let ahora = 0, siguiente = 1;
  const pendientes = new Map();
  const reloj = {
    poner: (fn, ms) => { const id = siguiente++; pendientes.set(id, { fn, en: ahora + ms }); return id; },
    quitar: (id) => pendientes.delete(id),
  };
  const avanzar = (ms) => {
    const fin = ahora + ms;
    for (;;) {
      const proximo = [...pendientes.entries()].sort((a, b) => a[1].en - b[1].en).find(([, t]) => t.en <= fin);
      if (!proximo) break;
      pendientes.delete(proximo[0]);
      ahora = proximo[1].en;
      proximo[1].fn();
    }
    ahora = fin;
  };

  const ventana = new Nodo();
  ventana.document = { activeElement: null };
  let alVer = () => {};
  const observar = (_el, cb) => { alVer = cb; };

  iniciarMapa(marco, { reducir, ahorro, reloj, ventana, observar });
  return { marco, video, capa, iframe, verMapa, verRecorrido, completo, ventana, avanzar, mostrar: (v) => alVer(v), pendientes };
}

test('map and the short walk clip take turns every 4 s while on screen', () => {
  const m = montar();
  m.mostrar(true);
  assert.equal(m.marco.dataset.vista, 'mapa');
  m.avanzar(4000);
  assert.equal(m.marco.dataset.vista, 'recorrido');
  assert.equal(m.video.src, '/tramo.mp4');
  assert.equal(m.video.reproduciendo, true);
  assert.equal(m.capa.getAttribute('aria-hidden'), 'false');
  assert.equal(m.iframe.hasAttribute('inert'), true);
  m.avanzar(4000);
  assert.equal(m.marco.dataset.vista, 'mapa');
  assert.equal(m.video.reproduciendo, false);
  assert.equal(m.iframe.hasAttribute('inert'), false);
});

test('no rotation off screen, with reduced motion or with data saver', () => {
  for (const opciones of [{}, { reducir: true }, { ahorro: true }]) {
    const m = montar(opciones);
    if (opciones.reducir || opciones.ahorro) m.mostrar(true);
    m.avanzar(20000);
    assert.equal(m.marco.dataset.vista, 'mapa', JSON.stringify(opciones));
  }
});

test('the buttons switch the view and the rotation keeps going', () => {
  const m = montar();
  m.mostrar(true);
  m.verRecorrido.emitir('click');
  assert.equal(m.marco.dataset.vista, 'recorrido');
  assert.equal(m.verRecorrido.getAttribute('aria-pressed'), 'true');
  assert.equal(m.verMapa.getAttribute('aria-pressed'), 'false');
  m.avanzar(4000);
  assert.equal(m.marco.dataset.vista, 'mapa');
});

test('pointer or focus on the frame pauses the rotation; leaving resumes it', () => {
  const m = montar();
  m.mostrar(true);
  m.marco.emitir('pointerenter');
  m.avanzar(20000);
  assert.equal(m.marco.dataset.vista, 'mapa');
  m.marco.emitir('pointerleave');
  m.avanzar(4000);
  assert.equal(m.marco.dataset.vista, 'recorrido');
});

test('the full walk stops the rotation, then returns to the map and resumes when it ends', () => {
  const m = montar();
  m.mostrar(true);
  m.completo.emitir('click');
  assert.equal(m.marco.dataset.vista, 'recorrido');
  assert.equal(m.video.src, '/completo.mp4');
  assert.equal(m.video.controls, true);
  assert.equal(m.marco.classList.contains('mapa--entero'), true);
  m.avanzar(60000);
  assert.equal(m.marco.dataset.vista, 'recorrido', 'no rotation while the full walk plays');
  m.video.emitir('ended');
  assert.equal(m.marco.dataset.vista, 'mapa');
  assert.equal(m.video.src, '/tramo.mp4');
  assert.equal(m.video.controls, false);
  assert.equal(m.marco.classList.contains('mapa--entero'), false);
  m.avanzar(4000);
  assert.equal(m.marco.dataset.vista, 'recorrido', 'rotation resumes with the short clip');
  assert.equal(m.video.src, '/tramo.mp4');
});

test('a button during the full walk goes back to the short clip', () => {
  const m = montar();
  m.mostrar(true);
  m.completo.emitir('click');
  m.verMapa.emitir('click');
  assert.equal(m.marco.dataset.vista, 'mapa');
  assert.equal(m.video.controls, false);
  assert.equal(m.video.src, '/tramo.mp4');
  m.avanzar(4000);
  assert.equal(m.marco.dataset.vista, 'recorrido');
});

test('using the map itself stops the rotation for good', () => {
  const m = montar();
  m.mostrar(true);
  m.ventana.document.activeElement = m.iframe;
  m.ventana.emitir('blur');
  m.avanzar(60000);
  assert.equal(m.marco.dataset.vista, 'mapa');
  assert.equal(m.pendientes.size, 0);
});

test('leaving the screen pauses the video and the timer', () => {
  const m = montar();
  m.mostrar(true);
  m.avanzar(4000);
  assert.equal(m.video.reproduciendo, true);
  m.mostrar(false);
  assert.equal(m.video.reproduciendo, false);
  m.avanzar(20000);
  assert.equal(m.marco.dataset.vista, 'recorrido');
});
