// Copies the standalone pages that live at the repository root (tablet, invitation and the
// social links page) into public/, so the one Vercel deploy of this site serves all of them.
// Vercel only receives this folder, so the copies are committed; run `npm run paginas` after
// editing any of the originals. A missing source (for example on the Vercel build machine) is skipped.
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sitio = join(dirname(fileURLToPath(import.meta.url)), '..');
const raiz = join(sitio, '..');
const publico = join(sitio, 'public');

export const paginas = [
	{ destino: 'tablet', archivos: [['tablet', '.']], omitir: ['server.mjs', 'README.md'] },
	{ destino: 'invitacion', archivos: [['invitacion', '.']], omitir: ['README.md'] },
	{
		destino: 'redes',
		archivos: [
			['index.html', 'index.html'],
			['estilos.css', 'estilos.css'],
			['assets/fuentes/manrope-latin-var.woff2', 'assets/fuentes/manrope-latin-var.woff2'],
			['assets/sello-evento.webp', 'assets/sello-evento.webp'],
			['assets/logo-anterior.webp', 'assets/logo-anterior.webp']
		],
		omitir: []
	}
];

export function sincronizar() {
	for (const { destino, archivos, omitir } of paginas) {
		if (!archivos.every(([origen]) => existsSync(join(raiz, origen)))) continue;
		const carpeta = join(publico, destino);
		rmSync(carpeta, { recursive: true, force: true });
		for (const [origen, copia] of archivos) {
			const hacia = join(carpeta, copia);
			mkdirSync(dirname(hacia), { recursive: true });
			cpSync(join(raiz, origen), hacia, {
				recursive: true,
				filter: (ruta) => !omitir.some((nombre) => ruta === join(raiz, origen, nombre))
			});
		}
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) sincronizar();
