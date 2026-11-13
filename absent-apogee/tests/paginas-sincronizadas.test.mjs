import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { paginas } from '../scripts/sincronizar-paginas.mjs';

const sitio = join(dirname(fileURLToPath(import.meta.url)), '..');
const raiz = join(sitio, '..');

function archivos(base, rel = '.') {
	const ruta = join(base, rel);
	if (statSync(ruta).isFile()) return [rel];
	return readdirSync(ruta).flatMap((n) => archivos(base, join(rel, n)));
}

test('the tablet, invitation and social links copies in public/ match their originals', () => {
	for (const { destino, archivos: lista, omitir } of paginas) {
		for (const [origen, copia] of lista) {
			const fuente = join(raiz, origen);
			assert(existsSync(fuente), `source ${origen} exists`);
			const esperados = archivos(fuente).filter((r) => !omitir.includes(r));
			for (const r of esperados) {
				const publicado = join(sitio, 'public', destino, copia, r);
				assert(existsSync(publicado), `${destino}/${join(copia, r)} is published (run npm run paginas)`);
				assert(readFileSync(publicado).equals(readFileSync(join(fuente, r))), `${destino}/${join(copia, r)} is up to date (run npm run paginas)`);
			}
		}
	}
});
