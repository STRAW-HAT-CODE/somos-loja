// Real business: only facts from the client's meetings and materials.
// A null value is pending client confirmation: shown as a marker in dev, hidden in production.
const base = '/carpeta-a-usar-web';
const v = `${base}/vintage`;
const g = `${base}/galeria`;

export const pendiente = {
  fecha: null as string | null,
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
export const sello = `${base}/sello-circular.webp`;
export const letrero = `${base}/paradas/parada-10.webp`;
export const interior = `${g}/tienda-interior.webp`;
export const ilustraciones = {
  fachada: `${v}/fachada.webp`,
  plaza: `${v}/plaza.webp`,
  grano: `${v}/grano.webp`,
  rama: `${v}/rama.webp`,
  guitarra: `${v}/guitarra.webp`,
};

export const capitulos = [
  { img: `${v}/finca.webp`, ancho: 1100, alto: 825, titulo: 'Nace en la finca', texto: 'Familias productoras cuidan cada planta en las laderas de Loja.', alt: 'Ilustración de cafetales en una ladera andina' },
  { img: `${v}/secado.webp`, ancho: 1100, alto: 825, titulo: 'Se seca al sol', texto: 'Se cosecha a mano, se despulpa y el grano descansa al aire libre.', alt: 'Ilustración de granos de café secándose al sol' },
  { img: `${v}/taza.webp`, ancho: 1400, alto: 788, titulo: 'Llega a tu taza', texto: 'Se tuesta, se sirve y cuenta de dónde viene.', alt: 'Ilustración de una taza de café humeante con granos y hojas' },
];

export const cifras = [
  ['300', 'emprendedores y productores'],
  ['50', 'marcas y fincas de café, aprox.'],
  ['14', 'marcas de vinos y licores'],
];

export const sabores = [
  { img: `${v}/cafe.webp`, titulo: 'Café de Loja', texto: 'Unas 50 marcas y fincas.', alt: 'Ilustración de un saco de café tostado con cerezas' },
  { img: `${v}/barro.webp`, titulo: 'Barro negro', texto: 'Ollas y tazas hechas a mano.', alt: 'Ilustración de una olla y una taza de barro negro' },
  { img: `${v}/dulces.webp`, titulo: 'Chocolates y bocadillos', texto: 'Para llevar de recuerdo.', alt: 'Ilustración de chocolate, cacao y dulces en una canasta' },
  { img: `${v}/licores.webp`, titulo: 'Vinos y licores', texto: 'Catorce marcas para regalar.', alt: 'Ilustración de botellas de vino y licor con uvas' },
  { img: `${v}/textil.webp`, titulo: 'Textiles', texto: 'Tejidos y trabajo artesanal.', alt: 'Ilustración de textiles andinos tejidos a mano' },
  { img: `${v}/belleza.webp`, titulo: 'Salud y belleza', texto: 'Cuidado natural de aquí.', alt: 'Ilustración de jabones naturales y bálsamos' },
];

export const productos = [
  { src: `${g}/cafe-la-papaya.webp`, titulo: 'La Papaya', alt: 'Bolsa de café La Papaya' },
  { src: `${g}/olla-negra.webp`, titulo: 'Barro negro', alt: 'Olla de barro negro con dos figuras' },
  { src: `${g}/cafe-mama-lolita.webp`, titulo: 'Mamá Lolita', alt: 'Bolsa roja de café Mamá Lolita' },
  { src: `${g}/ceramica.webp`, titulo: 'Cerámica', alt: 'Pieza de cerámica con dibujos en terracota' },
  { src: `${g}/cafe-abraham.webp`, titulo: 'Café Abraham', alt: 'Bolsa blanca de Café Abraham' },
  { src: `${g}/taza-pintada.webp`, titulo: 'Taza pintada', alt: 'Taza con plato pintados a mano' },
  { src: `${g}/cafe-yarazs.webp`, titulo: 'Yaraz’s', alt: 'Bolsa dorada de café Yaraz’s' },
  { src: `${g}/cuadro-loja.webp`, titulo: 'Cuadro de Loja', alt: 'Cuadro de Loja pintado a mano' },
];
