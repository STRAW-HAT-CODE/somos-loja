// Real business: only facts from the client's meetings and materials.
// A null value is pending client confirmation: shown as a marker in dev, hidden in production.
const base = '/carpeta-a-usar-web';

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

const turquesa = '#45BBC3';

export const paradas = [
  ['finca', 'Finca', '', 'Todo empieza en la finca', 'En las laderas de Loja, las familias cuidan el café planta por planta. Este es el camino que recorre cada taza.', 1.0],
  ['cosecha', 'Cosecha', '', 'Se cosecha a mano', 'La cereza se recoge cuando está madura. Elegirla en su punto es la primera decisión de sabor.', 0.9],
  ['lavado', 'Lavado', '', 'Se lava con cuidado', 'El agua limpia la fruta y ayuda a separar lo que no sirve antes de seguir.', 0.8],
  ['seleccion', 'Selección', '', 'Se selecciona una por una', 'Sobre la zaranda, unas manos apartan las cerezas verdes o dañadas.', 0.8],
  ['despulpado', 'Despulpado', '', 'Aquí aparece el grano', 'La despulpadora retira la cáscara. Por primera vez se ve la semilla que será café.', 0.8],
  ['secado', 'Secado', '', 'Se seca al sol', 'El grano descansa al aire libre hasta perder la humedad. Aquí la paciencia cuenta.', 0.9],
  ['tostado', 'Tostado', '', 'Se tuesta', 'El calor abre los aromas. Cada productor busca el punto que mejor muestra su café.', 0.8],
  ['taza', 'Taza', '', 'Y llega a tu taza', 'Un proceso largo, muchas manos y una sola taza para probarlo.', 0.7],
  ['marcas', 'Marcas', '', 'Unas 50 marcas y fincas', 'Todo ese trabajo está en los estantes de Somos Loja, con el nombre de quien lo produce.', 1.0],
  ['tienda', 'Tienda', '', 'Encuéntralo en la tienda', 'Café, artesanías, valor agregado, vinos y licores de emprendedores locales.', 0],
].map(([id, label, _sello, title, body, connScroll], i) => ({
  id,
  label,
  title,
  body,
  accent: turquesa,
  still: `${base}/paradas/parada-${String(i + 1).padStart(2, '0')}.webp`,
  ...(connScroll ? { connScroll } : {}),
  ...(i === 9 ? { cta: { primary: { label: 'Visita la tienda', href: '#visita' } } } : {}),
}));

// Each stretch between stops is an image sequence: 60 frames on desktop, 40 on phones.
export const tramos = Array.from({ length: 9 }, (_, t) => ({
  count: 60,
  countMobile: 40,
  url: (i: number, movil: boolean) =>
    `${base}/cuadros/${String(t + 1).padStart(2, '0')}/${movil ? 'm' : 'd'}-${String(i).padStart(3, '0')}.webp`,
}));

export const evento = {
  nombre: 'Loja 100 % Café Especial',
  edicion: 'Tercera edición',
  sello: `${base}/sello-circular.webp`,
  etapas: [
    ['Recepción de muestras', 'Cada marca entrega su café para competir.'],
    ['Selección de catadores', 'Se elige a quienes van a evaluar las muestras.'],
    ['Catación de jueces', 'Los jueces prueban y califican cada café.'],
    ['Top 10 de especialidad', 'Los mejores cafés salen a la luz durante el evento.'],
  ],
  actividades: ['Filtrados', 'V60', 'Concurso de chuspas'],
};

// From the client's own words in the meetings: confirm before publishing.
export const historia = {
  cita: 'Somos Loja es servicio.',
  parrafos: [
    'Somos una cooperativa de economía popular y solidaria. No crecimos con publicidad: crecimos de boca en boca, invitando un café y conversando.',
    'Antes los productores no querían dejar su producto en la tienda. Hoy nos buscan, y los acompañamos para que mejoren y crezcan con su propia marca.',
  ],
  cifras: [
    ['300', 'emprendedores, reunidos en 7 años de trabajo'],
    ['14', 'marcas de vinos y licores'],
    ['10', 'años de trayectoria que se cumplen el próximo año'],
  ],
};

export const categorias = [
  ['Café', 'Marcas y fincas de Loja, de especialidad y de todos los días.'],
  ['Artesanías', 'Barro negro, cerámica, textiles y piezas hechas a mano.'],
  ['Valor agregado', 'Chocolates, bocadillos y productos elaborados aquí.'],
  ['Salud y belleza', 'Cuidado personal de productores locales.'],
  ['Vinos y licores', 'Catorce marcas para llevar o regalar.'],
];

const g = `${base}/galeria`;
export const galeria = [
  { src: `${g}/tienda-interior.webp`, alt: 'Interior de la tienda con una vitrina llena de productos', pie: 'La tienda' },
  { src: `${g}/olla-negra.webp`, alt: 'Olla de barro negro con dos figuras dibujadas', pie: 'Olla de barro negro' },
  { src: `${g}/vaso-negro.webp`, alt: 'Vaso de barro negro con un motivo circular', pie: 'Vaso de barro negro' },
  { src: `${g}/ceramica.webp`, alt: 'Pieza de cerámica clara con dibujos en terracota', pie: 'Cerámica' },
  { src: `${g}/taza-pintada.webp`, alt: 'Taza con plato pintados a mano en colores vivos', pie: 'Taza pintada' },
  { src: `${g}/cuadro-loja.webp`, alt: 'Cuadro pintado con tres figuras de espaldas frente a las montañas', pie: 'Cuadro de Loja' },
  { src: `${g}/cafe-yarazs.webp`, alt: 'Bolsa dorada de café Yaraz’s', pie: 'Yaraz’s' },
  { src: `${g}/cafe-la-papaya.webp`, alt: 'Bolsa negra y amarilla de café La Papaya', pie: 'La Papaya' },
  { src: `${g}/cafe-mama-lolita.webp`, alt: 'Bolsa roja de café Mamá Lolita', pie: 'Mamá Lolita' },
  { src: `${g}/cafe-los-ceibos.webp`, alt: 'Bolsa dorada de café Los Ceibos', pie: 'Los Ceibos' },
  { src: `${g}/cafe-abraham.webp`, alt: 'Bolsa blanca de café Abraham', pie: 'Café Abraham' },
  { src: `${g}/cafe-lojanias.webp`, alt: 'Bolsa negra de café Lojanías', pie: 'Lojanías' },
  { src: `${g}/cafe-kantu-murrai.webp`, alt: 'Bolsa de café de una marca local de la tienda', pie: null },
];

export const logo = `${base}/logo-somos-loja-tienda.webp`;
