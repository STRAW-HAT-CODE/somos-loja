// Real business: only facts from the client's meetings and materials.
// A null value is pending client confirmation: shown as a marker in dev, hidden in production.
const base = '/carpeta-a-usar-web';

export const pendiente = {
  direccion: null as string | null,
  horario: null as string | null,
  facebook: null as string | null,
  tiktok: null as string | null,
};

export const enlaces = {
  // Taken from the previous prototype: confirm with the client before publishing.
  instagram: 'https://www.instagram.com/tiendasomosloja/',
  mapa: 'https://maps.google.com/?q=Tienda+Somos+Loja+Loja+Ecuador',
};

export const logo = `${base}/logo-somos-loja-tienda.webp`;
export const fondo = { video: `${base}/fondo.mp4`, poster: `${base}/paradas/parada-01.webp` };
export const final = `${base}/paradas/parada-10.webp`;

export const hechos = ['300 emprendedores', 'Unas 50 marcas y fincas de café', 'Loja, Ecuador'];
export const momentos = ['De la finca', 'a la cosecha', 'al grano', 'a tu taza'];

const g = `${base}/galeria`;
export const tarjetas = [
  { src: `${g}/cafe-la-papaya.webp`, titulo: 'Café', alt: 'Bolsa de café La Papaya' },
  { src: `${g}/olla-negra.webp`, titulo: 'Barro negro', alt: 'Olla de barro negro con dos figuras' },
  { src: `${g}/ceramica.webp`, titulo: 'Cerámica', alt: 'Pieza de cerámica con dibujos en terracota' },
  { src: `${g}/taza-pintada.webp`, titulo: 'Tazas pintadas', alt: 'Taza con plato pintados a mano' },
  { src: `${g}/cuadro-loja.webp`, titulo: 'Recuerdos', alt: 'Cuadro de Loja pintado a mano' },
];

// Sequence for the process: 9 stretches, sampled down so it stays light.
const PASO = { d: 3, m: 2 };
const TOTAL = { d: 60, m: 40 };
export function cuadros(movil: boolean) {
  const k = movil ? 'm' : 'd';
  const lista: string[] = [];
  for (let t = 1; t <= 9; t++) {
    for (let i = 0; i < TOTAL[k]; i += PASO[k]) lista.push(`${base}/cuadros/${String(t).padStart(2, '0')}/${k}-${String(i).padStart(3, '0')}.webp`);
  }
  lista.push(`${base}/cuadros/09/${k}-${String(TOTAL[k] - 1).padStart(3, '0')}.webp`);
  return lista;
}
