import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { crearBloqueo } from '../src/scripts/bloqueo-scroll.js';

// The lock must stop every way of scrolling while a scene plays, and must never stay stuck.
test('the scroll lock blocks wheel, touch and keys, and always lets go', () => {
  mock.timers.enable({ apis: ['setTimeout'] });
  const oyentes = {};
  const ventana = { addEventListener: (tipo, fn) => { oyentes[tipo] = fn; }, matchMedia: () => ({ matches: true }) };
  const documento = { hidden: false, documentElement: { style: {} }, addEventListener: (tipo, fn) => { oyentes[tipo] = fn; } };
  const lenis = { parado: false, stop() { this.parado = true; }, start() { this.parado = false; } };
  const evento = (extra = {}) => ({ cancelable: true, frenado: false, preventDefault() { this.frenado = true; }, ...extra });
  const pasa = (tipo, extra) => { const e = evento(extra); oyentes[tipo](e); return !e.frenado; };
  try {
    const bloqueo = crearBloqueo(lenis, { ventana, documento });
    assert(pasa('wheel') && pasa('touchmove') && pasa('keydown', { key: 'PageDown' }), 'a free page scrolls normally');

    bloqueo.bloquear(3000);
    assert(bloqueo.activo && lenis.parado);
    assert.equal(documento.documentElement.style.overflow, 'hidden', 'a swipe already under way is cut on touch screens');
    assert(!pasa('wheel') && !pasa('touchmove'), 'wheel and touch are held');
    for (const key of [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']) assert(!pasa('keydown', { key }), `${key} is held`);
    assert(pasa('keydown', { key: 'Tab' }), 'keys that do not scroll keep working');

    bloqueo.liberar();
    assert(!bloqueo.activo && !lenis.parado && pasa('wheel'));
    assert.equal(documento.documentElement.style.overflow, '');

    bloqueo.bloquear(3000);
    mock.timers.tick(2999);
    assert(bloqueo.activo);
    mock.timers.tick(1);
    assert(!bloqueo.activo && !lenis.parado, 'the safety timeout releases a scene that never finished');

    bloqueo.bloquear(3000);
    documento.hidden = true;
    oyentes.visibilitychange();
    assert(!bloqueo.activo, 'leaving the tab releases the page');
  } finally {
    mock.timers.reset();
  }
});
