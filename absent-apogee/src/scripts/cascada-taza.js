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
	let geo = {};

	function medir() {
		// Use layout coordinates so refreshes ignore animated transforms.
		const wrap = taza.parentElement;
		geo = {
			cupW: taza.offsetWidth,
			cupH: taza.offsetHeight,
			crackY: escena.offsetHeight * 0.27,
			rimY: wrap.offsetTop + taza.offsetTop + taza.offsetHeight * 0.225
		};
	}
	medir();

	const semillas = granos.map(() => ({
		x0: (Math.random() - 0.5) * 74,
		y0: (Math.random() - 0.5) * 52,
		rot0: (Math.random() - 0.5) * 140,
		rot1: (Math.random() - 0.5) * 760,
		lane: (Math.random() - 0.5) * 0.95,
		ty: (Math.random() - 0.5) * 0.06,
		sc: 0.72 + Math.random() * 0.55
	}));

	let tl;
	tl = gsap.timeline({
		defaults: { ease: 'none', immediateRender: false },
		scrollTrigger: {
			trigger: seccion,
			start: 'top 85%',
			end: 'bottom bottom',
			scrub: 0.55,
			invalidateOnRefresh: true,
			onRefreshInit: () => {
				// Rewind before invalidation so later tweens cannot capture the final state.
				tl?.time(0);
				medir();
			}
		}
	});

	// Explicit baseline makes every refresh and reverse scroll deterministic.
	tl.set('.cascada__grano-grande', { autoAlpha: 1, scale: 0.38, yPercent: -10, rotate: -12 }, 0);
	tl.set('.cascada__polvo', { autoAlpha: 0, scale: 0.45 }, 0);
	tl.set('.cascada__taza-granos', { opacity: 0 }, 0);
	tl.set('.cascada__taza-cafe', { opacity: 0 }, 0);
	tl.set('.cascada__texto', { autoAlpha: 0, y: 38 }, 0);
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

	/* 4. The gathered beans resolve into the filled cup, then brewed coffee. */
	tl.fromTo('.cascada__taza-granos', { opacity: 0 }, { opacity: 1, duration: 0.13 }, 0.58);
	tl.fromTo('.cascada__taza-cafe', { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.75);

	/* 5. The headline arrives while the cup is filling, not after the scene ends. */
	tl.fromTo('.cascada__texto',
		{ autoAlpha: 0, y: 38 },
		{ autoAlpha: 1, y: 0, duration: 0.14 }, 0.6);

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
