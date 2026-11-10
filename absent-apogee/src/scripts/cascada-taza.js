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
	const marcas = gsap.utils.toArray('.cascada__marca');
	const texto = seccion.querySelector('.cascada__texto');
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
		medirMarcas(wrap);
	}

	// Final resting places. Wide screens: two honeycomb wings framing the cup, so nothing crowds
	// the headline or the rim. Narrow screens: a balanced grid in the free band above the cup.
	function medirMarcas(wrap) {
		if (!marcas.length) return;
		const arriba = texto ? texto.offsetTop + texto.offsetHeight + 24 : escena.offsetHeight * 0.4;
		const celdaW = marcas[0].offsetWidth;
		const celdaH = marcas[0].offsetHeight;
		const cupL = wrap.offsetLeft;
		const cupR = cupL + wrap.offsetWidth;
		const cupBottom = wrap.offsetTop + wrap.offsetHeight;
		const hueco = Math.max(28, celdaW * 0.3);
		const lado = cupL;
		if (lado >= 2 * celdaW + hueco * 2 + 24) {
			const mitad = Math.ceil(marcas.length / 2);
			const disponible = cupBottom - arriba;
			const filas = Math.ceil(mitad / 2);
			const paso = Math.min(celdaH * 2.1, (disponible - celdaH) / Math.max(1, filas - 0.5));
			const y0 = arriba + Math.max(0, (disponible - (paso * (filas - 0.5) + celdaH)) / 2);
			destinos = marcas.map((m, i) => {
				const derecha = i >= mitad;
				const k = derecha ? i - mitad : i;
				const exterior = k % 2 === 1;
				const fila = Math.floor(k / 2) + (exterior ? 0.5 : 0);
				const desde = hueco + (exterior ? celdaW + hueco * 0.6 : 0);
				const x = derecha ? cupR + desde : cupL - desde - celdaW;
				return { x, y: y0 + fila * paso, w: celdaW, h: celdaH };
			});
			return;
		}
		const abajo = wrap.offsetTop + wrap.offsetHeight * 0.18;
		const gapX = geo.W <= 760 ? 10 : 20;
		const gapY = geo.W <= 760 ? 14 : 18;
		const ancho = Math.min(geo.W - 32, 1100);
		const maxCols = Math.max(1, Math.floor((ancho + gapX) / (celdaW + gapX)));
		// Same number of logos per row (the last row differs by at most one), never one orphan.
		const filas = Math.ceil(marcas.length / maxCols);
		const cols = Math.ceil(marcas.length / filas);
		const altoTotal = filas * celdaH + (filas - 1) * gapY;
		const y0 = arriba + Math.max(0, (abajo - arriba - altoTotal) / 2);
		destinos = marcas.map((m, i) => {
			const r = Math.floor(i / cols);
			const enFila = Math.min(cols, marcas.length - r * cols);
			const c = i - r * cols;
			const x0 = (geo.W - (enFila * celdaW + (enFila - 1) * gapX)) / 2;
			return { x: x0 + c * (celdaW + gapX), y: y0 + r * (celdaH + gapY), w: celdaW, h: celdaH };
		});
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
	tl.to('.cascada__grano-grande', { scale: 1.2, autoAlpha: 0, duration: 0.05 }, 0.16);
	tl.fromTo('.cascada__polvo',
		{ autoAlpha: 0, scale: 0.45 },
		{ autoAlpha: 0.95, scale: 1.05, duration: 0.06 }, 0.16);
	tl.to('.cascada__polvo', { autoAlpha: 0, scale: 1.55, duration: 0.15 }, 0.23);

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

	/* 4. The gathered beans resolve into the filled cup, then brewed coffee. */
	tl.fromTo('.cascada__taza-granos', { opacity: 0 }, { opacity: 1, duration: 0.13 }, 0.58);
	tl.fromTo('.cascada__taza-cafe', { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.75);

	/* 5. The headline arrives while the cup is filling, not after the scene ends. */
	tl.fromTo('.cascada__texto',
		{ autoAlpha: 0, y: 38 },
		{ autoAlpha: 1, y: 0, duration: 0.14 }, 0.6);

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
	seccion.querySelectorAll('img').forEach((image) => {
		if (!image.complete) image.addEventListener('load', refreshGeometry, { once: true });
	});
}
