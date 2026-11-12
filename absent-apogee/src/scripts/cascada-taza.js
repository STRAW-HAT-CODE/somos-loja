export function iniciarCascada(gsap, ScrollTrigger) {
	const seccion = document.querySelector('.cascada');
	const escena = seccion?.querySelector('.cascada__escena');
	const taza = seccion?.querySelector('.cascada__taza');
	const contenedor = seccion?.querySelector('.cascada__granitos');
	if (!seccion || !escena || !taza || !contenedor) return;

	seccion.classList.add('cascada--animada');

	const N = innerWidth <= 760 ? 10 : 22;
	for (let i = 0; i < N; i++) {
		const grano = document.createElement('span');
		grano.className = 'cascada__granito';
		grano.style.setProperty('--k', (0.62 + Math.random() * 0.85).toFixed(2));
		contenedor.appendChild(grano);
	}

	const granos = gsap.utils.toArray('.cascada__granito');
	// Every visit deals the brands into new seats, so no brand is always the one at the bottom.
	const marcasDom = gsap.utils.toArray('.cascada__marca');
	const marcas = [...marcasDom];
	for (let i = marcas.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[marcas[i], marcas[j]] = [marcas[j], marcas[i]];
	}
	// Each logo's place in the markup, which is the order the phone strips are built in.
	const orden = marcas.map((m) => marcasDom.indexOf(m));
	const texto = seccion.querySelector('.cascada__texto');
	// Phones: once the logos land they hand over to two looping strips (a carousel) instead of a dense grid.
	const cinta = seccion.querySelector('.cascada__cinta');
	const filasCinta = cinta?.querySelectorAll ? [...cinta.querySelectorAll('.cascada__pista')] : [];
	let usaCinta = false;
	// A slow left-to-right wave: the logos bob in sequence once they have settled (CSS).
	marcas.forEach((m, i) => m.style.setProperty('--retraso', `${(-i * 0.33).toFixed(2)}s`));
	let geo = {};
	let destinos = [];

	function medir() {
		// Use layout coordinates so refreshes ignore animated transforms.
		const wrap = taza.parentElement;
		geo = {
			cupW: taza.offsetWidth,
			cupH: taza.offsetHeight,
			crackY: escena.offsetHeight * 0.27,
			rimY: wrap.offsetTop + taza.offsetTop + taza.offsetHeight * 0.225
		};
		geo.W = escena.offsetWidth;
		// How far the finished composition (headline to cup foot) sits below the centre of the
		// screen, header band excluded; the scene rises by that much while the logos settle.
		const arribaTexto = texto ? texto.offsetTop : geo.crackY;
		const abajo = wrap.offsetTop + wrap.offsetHeight;
		geo.subida = Math.max(0, (arribaTexto + abajo) / 2 - (escena.offsetHeight / 2 + 36));
		medirMarcas(wrap);
	}

	// Final resting places. Wide screens: two honeycomb wings framing the cup, so nothing crowds
	// the headline or the rim. Narrow screens: a balanced grid in the free band above the cup.
	function medirMarcas(wrap) {
		if (!marcas.length) return;
		// Start from the CSS cell size; the wide layout may shrink it to fit every brand.
		marcas.forEach((m) => m.style.removeProperty('--celda-w'));
		const arriba = texto ? texto.offsetTop + texto.offsetHeight + 24 : escena.offsetHeight * 0.4;
		let celdaW = marcas[0].offsetWidth;
		let celdaH = marcas[0].offsetHeight;
		const cupL = wrap.offsetLeft;
		const cupR = cupL + wrap.offsetWidth;
		const cupBottom = wrap.offsetTop + wrap.offsetHeight;
		const hueco = Math.max(28, celdaW * 0.3);
		const lado = cupL;
		const anchoAla = (cols) => hueco + cols * celdaW + (cols - 1) * hueco * 0.6 + 24;
		const cols = [3, 2].find((c) => lado >= anchoAla(c));
		if (cols) {
			const mitad = Math.ceil(marcas.length / 2);
			const disponible = cupBottom - arriba;
			const filas = Math.ceil(mitad / cols);
			const tramos = filas - 1 + 0.5;
			// Too many rows for the band: shrink the cells so neighbours never overlap.
			const minimo = celdaH * (1.22 * tramos + 1);
			if (disponible < minimo) {
				const k = Math.max(0.72, disponible / minimo);
				celdaW *= k;
				celdaH *= k;
				marcas.forEach((m) => m.style.setProperty('--celda-w', `${celdaW}px`));
			}
			const paso = Math.min(celdaH * 2.1, (disponible - celdaH) / Math.max(1, tramos));
			const y0 = arriba + Math.max(0, (disponible - (paso * tramos + celdaH)) / 2);
			destinos = marcas.map((m, i) => {
				const derecha = i >= mitad;
				const k = derecha ? i - mitad : i;
				const col = k % cols;
				// Honeycomb: every other column drops half a row.
				const fila = Math.floor(k / cols) + (col % 2 === 1 ? 0.5 : 0);
				const desde = hueco + col * (celdaW + hueco * 0.6);
				const x = derecha ? cupR + desde : cupL - desde - celdaW;
				return { x, y: y0 + fila * paso, w: celdaW, h: celdaH };
			});
			return;
		}
		const abajo = wrap.offsetTop + wrap.offsetHeight * 0.18;
		usaCinta = filasCinta.length === 2 && geo.W <= 760;
		if (usaCinta) {
			// Each logo flies to its own piece in the strip, measured at the strip's starting frame.
			ponerCinta(false);
			const alto = cinta.offsetHeight;
			cinta.style.top = `${Math.round(arriba + Math.max(0, (abajo - arriba - alto) / 2))}px`;
			const caja = escena.getBoundingClientRect();
			const mitad = Math.ceil(marcas.length / 2);
			destinos = marcas.map((m, i) => {
				const k = orden[i];
				const fila = k < mitad ? 0 : 1;
				const piezas = filasCinta[fila].children;
				// The first strip starts on its first copy; the second runs the other way and starts on its second copy.
				const pieza = piezas[fila === 0 ? k : k - mitad + piezas.length / 2];
				const r = pieza.getBoundingClientRect();
				return { x: r.left - caja.left, y: r.top - caja.top, w: r.width, h: r.height };
			});
			return;
		}
		const gapX = geo.W <= 760 ? 10 : 20;
		const gapY = geo.W <= 760 ? 14 : 18;
		const ancho = Math.min(geo.W - 32, 1100);
		const maxCols = Math.max(1, Math.floor((ancho + gapX) / (celdaW + gapX)));
		// Same number of logos per row (the last row differs by at most one), never one orphan.
		// Rows differ by at most one logo (14 on four columns: 4, 4, 3, 3), never a lonely pair.
		const filas = Math.ceil(marcas.length / maxCols);
		const base = Math.floor(marcas.length / filas);
		const extra = marcas.length % filas;
		const tam = Array.from({ length: filas }, (_, r) => base + (r < extra ? 1 : 0));
		const altoTotal = filas * celdaH + (filas - 1) * gapY;
		const y0 = arriba + Math.max(0, (abajo - arriba - altoTotal) / 2);
		destinos = [];
		let i = 0;
		tam.forEach((enFila, r) => {
			const x0 = (geo.W - (enFila * celdaW + (enFila - 1) * gapX)) / 2;
			for (let c = 0; c < enFila; c++, i++) {
				destinos[i] = { x: x0 + c * (celdaW + gapX), y: y0 + r * (celdaH + gapY), w: celdaW, h: celdaH };
			}
		});
	}
	// Swaps the landed logos for the moving strips (and back when the scene rewinds).
	let cintaViva = false;
	function ponerCinta(viva) {
		if (!cinta?.classList || viva === cintaViva) return;
		cintaViva = viva;
		cinta.classList.toggle('cascada__cinta--viva', viva);
		seccion.classList.toggle('cascada--cinta', viva);
		// Back to the starting frame, so the next landing lines up with the pieces again.
		if (!viva) filasCinta.forEach((p) => { p.style.animation = 'none'; void p.offsetWidth; p.style.animation = ''; });
	}

	medir();

	const chispas = marcas.map(() => ({
		ang: Math.random() * Math.PI * 2,
		rad: 0.22 + Math.random() * 0.2,
		rot: (Math.random() - 0.5) * 40
	}));

	const semillas = granos.map(() => ({
		x0: (Math.random() - 0.5) * 74,
		y0: (Math.random() - 0.5) * 52,
		rot0: (Math.random() - 0.5) * 140,
		rot1: (Math.random() - 0.5) * 760,
		lane: (Math.random() - 0.5) * 0.95,
		ty: (Math.random() - 0.5) * 0.06,
		sc: 0.72 + Math.random() * 0.55
	}));

	// Touch screens play the whole scene by time once it arrives: a single swipe must not leave it half built.
	const porTiempo = typeof matchMedia === 'function'
		&& matchMedia('(max-width: 760px), (pointer: coarse)').matches;
	const DURACION_TACTIL = 2.8;

	let tl;
	let avance;
	let guardado = 0;
	const reproducir = () => {
		if (tl.progress() >= 1 || avance?.isActive()) return;
		avance = tl.tweenTo(tl.duration(), { duration: DURACION_TACTIL * (1 - tl.progress()), ease: 'power1.inOut' });
	};
	const detener = () => {
		// A killed tween reports itself active, so drop the reference too.
		avance?.kill();
		avance = null;
	};
	const reiniciar = () => {
		detener();
		tl.pause(0);
		ponerCinta(false);
	};
	const activador = {
		trigger: seccion,
		start: 'top 85%',
		end: 'bottom bottom',
		invalidateOnRefresh: true,
		onRefreshInit: () => {
			guardado = tl?.progress() ?? 0;
			detener();
			// Rewind before invalidation so later tweens cannot capture the final state.
			tl?.time(0);
			medir();
		}
	};

	if (porTiempo) {
		tl = gsap.timeline({ defaults: { ease: 'none', immediateRender: false }, paused: true });
	} else {
		tl = gsap.timeline({
			defaults: { ease: 'none', immediateRender: false },
			scrollTrigger: { ...activador, scrub: 0.55 }
		});
	}

	// Explicit baseline makes every refresh and reverse scroll deterministic.
	tl.set('.cascada__grano-grande', { autoAlpha: 1, scale: 0.38, yPercent: -10, rotate: -12 }, 0);
	tl.set('.cascada__polvo', { autoAlpha: 0, scale: 0.45 }, 0);
	tl.set('.cascada__taza-granos', { opacity: 0 }, 0);
	tl.set('.cascada__taza-cafe', { opacity: 0 }, 0);
	tl.set('.cascada__texto', { autoAlpha: 0, y: 38 }, 0);
	// Logos start shrunk inside the bean's crack point.
	const enGrano = (i) => ({ x: geo.W / 2 - (destinos[i]?.w ?? 0) / 2, y: geo.crackY - (destinos[i]?.h ?? 0) / 2 });
	marcas.forEach((m, i) => tl.set(m, {
		opacity: 0, scale: 0.15, rotate: chispas[i].rot, x: () => enGrano(i).x, y: () => enGrano(i).y
	}, 0));
	granos.forEach((grano, i) => tl.set(grano, {
		opacity: 0, scale: 0.35, x: semillas[i].x0, y: semillas[i].y0, rotate: semillas[i].rot0
	}, 0));

	/* 1. el grano grande baja */
	tl.fromTo('.cascada__grano-grande',
		{ yPercent: -10, rotate: -12, scale: 0.38, autoAlpha: 1 },
		{ yPercent: 0, rotate: 12, scale: 1, autoAlpha: 1, duration: 0.16 }, 0);

	/* 2. se rompe: fade + polvo */
	// The burst holds a moment on screen, so the explosion reads even on a quick scroll.
	tl.to('.cascada__grano-grande', { scale: 1.35, autoAlpha: 0, duration: 0.08, ease: 'power2.out' }, 0.16);
	tl.fromTo('.cascada__polvo',
		{ autoAlpha: 0, scale: 0.45 },
		{ autoAlpha: 1, scale: 1.2, duration: 0.07, ease: 'power2.out' }, 0.16);
	tl.to('.cascada__polvo', { autoAlpha: 0, scale: 1.7, duration: 0.2 }, 0.26);

	/* 3. lluvia de granitos hacia la taza */
	granos.forEach((grano, i) => {
		const start = 0.18 + i * (0.2 / N);
		const dur = 0.38;
		const half = dur * 0.46;
		const sd = semillas[i];

		tl.fromTo(grano,
			{ x: () => sd.x0, y: () => sd.y0, rotate: () => sd.rot0, scale: 0.35, opacity: 1 },
			{
				immediateRender: false,
				opacity: 1,
				x: () => sd.lane * geo.cupW * 1.18,
				y: () => (geo.rimY - geo.crackY) * 0.28,
				rotate: () => sd.rot0 + (sd.rot1 - sd.rot0) * 0.5,
				scale: () => sd.sc,
				duration: half,
				ease: 'sine.out'
			}, start);

		tl.to(grano,
			{
				opacity: 1,
				x: () => (sd.lane * 0.62 - 0.035) * geo.cupW,
				y: () => geo.rimY - geo.crackY + geo.cupH * sd.ty,
				rotate: () => sd.rot1,
				duration: dur - half,
				ease: 'power1.in'
			}, start + half);

		tl.to(grano, { scale: 0, opacity: 0, duration: 0.05 }, start + dur);
	});

	/* 3b. The bean bursts into the brands: they fly out of the crack, then settle between headline and cup. */
	marcas.forEach((m, i) => {
		const ch = chispas[i];
		const inicio = 0.165 + i * (0.06 / Math.max(1, marcas.length));
		tl.to(m, {
			opacity: 1,
			scale: 0.85,
			x: () => enGrano(i).x + Math.cos(ch.ang) * ch.rad * geo.W * 0.6,
			y: () => enGrano(i).y + Math.sin(ch.ang) * ch.rad * escena.offsetHeight * 0.5,
			duration: 0.12,
			ease: 'power3.out'
		}, inicio);
		tl.to(m, {
			scale: 1,
			rotate: 0,
			x: () => destinos[i]?.x ?? 0,
			y: () => destinos[i]?.y ?? 0,
			duration: 0.24,
			ease: 'power2.inOut'
		}, 0.35 + i * (0.08 / Math.max(1, marcas.length)));
	});

	// Phones: the strips take over the moment the last logo lands.
	const ATERRIZAJE = 0.35 + 0.08 + 0.24;
	tl.eventCallback('onUpdate', () => ponerCinta(usaCinta && tl.time() >= ATERRIZAJE));

	/* 4. The gathered beans resolve into the filled cup, then brewed coffee. */
	tl.fromTo('.cascada__taza-granos', { opacity: 0 }, { opacity: 1, duration: 0.13 }, 0.58);
	tl.fromTo('.cascada__taza-cafe', { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.75);

	/* 5. The headline arrives while the cup is filling, not after the scene ends. */
	tl.fromTo('.cascada__texto',
		{ autoAlpha: 0, y: 38 },
		{ autoAlpha: 1, y: 0, duration: 0.14 }, 0.6);

	/* 6. Wide screens: while the logos settle, the whole scene rises to sit centred, so the next
	   section (the forming 50) follows it up instead of meeting an empty band. */
	if (!porTiempo) {
		tl.fromTo(escena, { y: 0 }, { y: () => -geo.subida, duration: 0.4, ease: 'sine.inOut' }, 0.38);
	}

	if (porTiempo) {
		ScrollTrigger.create({
			...activador,
			onEnter: reproducir,
			onLeaveBack: reiniciar,
			onRefresh: (self) => {
				if (self.progress >= 1) guardado = 1;
				// Without a scrubbing trigger nothing invalidates the timeline, so do it here; the nudge
				// forces a render even when the playhead is already at the requested frame.
				tl.invalidate().pause().progress(guardado > 0 ? 0 : 1e-4).progress(guardado);
				if (guardado > 0 && guardado < 1) reproducir();
				else if (guardado === 0 && self.isActive) reproducir();
			}
		});
	}

	let raf = 0;
	const refreshGeometry = () => {
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => ScrollTrigger.refresh());
	};
	// Mobile browsers fire resize when the address bar hides; only a width change needs new geometry.
	let ancho = innerWidth;
	addEventListener('resize', () => { if (innerWidth !== ancho) { ancho = innerWidth; refreshGeometry(); } }, { passive: true });
	// Logos sit in fixed cells, so only the scene's own artwork can move the layout when it loads.
	seccion.querySelectorAll('img').forEach((image) => {
		if (image.closest?.('.cascada__marca, .cascada__cinta')) return;
		if (!image.complete) image.addEventListener('load', refreshGeometry, { once: true });
	});
}
