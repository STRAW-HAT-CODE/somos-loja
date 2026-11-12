// Holds the page still while a timed scene plays, so no wheel, swipe or key can skip through it.
// The lock always lets go: on liberar(), after a safety timeout, or when the tab is hidden.
const TECLAS = new Set([' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'Home', 'End']);

export function crearBloqueo(lenis, { ventana = globalThis, documento = globalThis.document } = {}) {
	let activo = false;
	let tope = 0;
	const tactil = typeof ventana.matchMedia === 'function' && ventana.matchMedia('(pointer: coarse)').matches;
	const raiz = documento?.documentElement;

	const frenar = (e) => { if (activo && e.cancelable) e.preventDefault(); };
	const frenarTecla = (e) => { if (activo && TECLAS.has(e.key)) e.preventDefault(); };
	ventana.addEventListener?.('wheel', frenar, { passive: false });
	ventana.addEventListener?.('touchmove', frenar, { passive: false });
	ventana.addEventListener?.('keydown', frenarTecla);

	function liberar() {
		if (!activo) return;
		activo = false;
		clearTimeout(tope);
		// Touch screens only: scrollbars there are overlays, so this never shifts the layout.
		if (tactil && raiz) raiz.style.overflow = '';
		lenis?.start();
	}

	function bloquear(maxMs = 4500) {
		clearTimeout(tope);
		tope = setTimeout(liberar, maxMs);
		if (activo) return;
		activo = true;
		lenis?.stop();
		// Cuts the momentum of a swipe that is already under way.
		if (tactil && raiz) raiz.style.overflow = 'hidden';
	}

	documento?.addEventListener?.('visibilitychange', () => { if (documento.hidden) liberar(); });

	return { bloquear, liberar, get activo() { return activo; } };
}
