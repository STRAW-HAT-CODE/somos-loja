// Real business: only facts from the client's meetings and materials.
// A null value is pending client confirmation: shown as a marker in dev, hidden in production.
const base = '/carpeta-a-usar-web';
const v = `${base}/vintage`;
const g = `${base}/galeria`;

export const pendiente = {
  // Google Maps pin (2Q3X+GC Loja), on Eguiguren facing Parque Central; manual mockup: "José A. Eguiguren y Bernardo Valdivieso".
  direccion: 'José Antonio Eguiguren y Bernardo Valdivieso, frente al Parque Central' as string | null,
  horario: null as string | null,
  // Confirmed in ENLACES-REDES-SOCIALES.md (store social links page).
  facebook: 'https://www.facebook.com/share/1E2P1Ln8Uq/' as string | null,
  tiktok: 'https://www.tiktok.com/@tiendasomosloja' as string | null,
};

export const enlaces = {
  // Taken from the previous prototype: confirm with the client before publishing.
  instagram: 'https://www.instagram.com/tiendasomosloja/',
  mapa: 'https://www.google.com/maps/search/?api=1&query=TIENDA+SOMOS+LOJA+2Q3X%2BGC+Loja',
  telefono: '+593962947777',
  telefonoVisible: '096 294 7777',
};

// WhatsApp deep links with a pre-filled message.
const wa = (texto: string) => `https://wa.me/${enlaces.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(texto)}`;
// Partner brand logos for the infinite strip (public/carpeta-a-usar-web/marcas).
const m = `${base}/marcas`;
export const marcas: { nombre: string; src: string }[] = [
  ['Café Abraham', 'cafe-abraham'],
  ['Tierras del Sur', 'tierras-del-sur'],
  ['Sapikuna Café', 'sapikuna'],
  ['Yaraz’s', 'yarazs'],
  ['Café del Abuelo', 'cafe-del-abuelo'],
  ['Café El Viajero', 'cafe-el-viajero'],
  ['Café Juan Antonio', 'cafe-juan-antonio'],
  ['Café Yunguilla Cariamanga', 'cafe-yunguilla-cariamanga'],
  ['Granadillo Coffee', 'granadillo-coffee'],
  ['Guambona Coffee Estate', 'guambona-coffee-estate'],
  ['Lojanías', 'lojanias'],
  ['Los Ceibos', 'los-ceibos'],
  ['Lojanísimos', 'productos-mn-lojanisimos'],
  ['Vida Campestre', 'vida-campestre'],
].map(([nombre, slug]) => ({ nombre, src: `${m}/${slug}.webp` }));

export const whatsapp = {
  general: wa('Hola Somos Loja, vengo de la página web y quiero más información.'),
  evento: wa('Hola Somos Loja, vi la página web y quiero saber más del evento Loja 100 % Café Especial.'),
  tienda: wa('Hola Somos Loja, vi la página web y quiero preguntar por los productos de la tienda.'),
};

// Loja 100 % Café Especial, third edition: the event the home page invites to.
export const evento = {
  fechas: 'Del 13 al 22 de noviembre',
  lugar: 'Parque Central de Loja',
  esquina: 'Eguiguren y Bernardo Valdivieso',
  hora: null as string | null,
  mapa: 'https://www.google.com/maps/search/?api=1&query=Parque+Central+Loja+Ecuador',
  postal: '/evento/postal/index.html',
};

// Walk from the Cathedral to the store (client video, re-framed 16:10 with a blurred fill).
export const recorrido = {
  // 4 s clip (Cathedral to the store sign, 2.15x) for the rotation; the full walk loads on demand.
  tramo: `${base}/video/tienda-tramo.mp4`,
  src: `${base}/video/tienda-recorrido.mp4`,
  poster: `${base}/video/tienda-recorrido.webp`,
};

export const logo = `${base}/logo-somos-loja-tienda-240.webp`;
export const sello = `${base}/sello-tercera-edicion.webp`;
export const letrero = `${base}/paradas/parada-10.webp`;
export const ilustraciones = {
  fachada: `${v}/fachada.webp`,
  fachadaChica: `${v}/fachada-900.webp`,
  plaza: `${v}/plaza.webp`,
  grano: `${v}/grano.webp`,
  rama: `${v}/rama.webp`,
  guitarra: `${v}/guitarra.webp`,
};

// Real photos (Somos Loja archive) graded "foto antigua"; source: design/fotos-vintage/grade_c.py.
const f = `${base}/fotos`;

// Each step is told twice: the illustration (memory) and the real photo developed over it.
export const capitulos = [
  { img: null, ancho: 0, alto: 0, titulo: 'Nace en la finca', texto: 'Familias productoras cuidan cada planta en las laderas de Loja.', alt: '',
    fotos: [
      { src: `${f}/15-recorrido.webp`, ancho: 1200, alto: 800, alt: 'Foto real: caficultores recorren el cafetal y revisan las plantas' },
      { src: `${f}/14-cosecha.webp`, ancho: 900, alto: 1200, alt: 'Foto real: un caficultor cosecha cerezas rojas entre las ramas' },
    ] },
  { img: null, ancho: 0, alto: 0, titulo: 'Se lava y se escoge a mano', texto: 'Cada cereza pasa por manos lojanas antes de secarse.', alt: '',
    fotos: [
      { src: `${f}/05-lavado.webp`, ancho: 1200, alto: 800, alt: 'Foto real: lavado de cerezas rojas de café en un balde' },
      { src: `${f}/06-seleccion-1.webp`, ancho: 900, alto: 1200, alt: 'Foto real: personas escogiendo a mano cerezas de café sobre una mesa' },
    ] },
  { img: null, ancho: 0, alto: 0, titulo: 'Se seca al sol', texto: 'Se despulpa y el grano descansa al aire libre.', alt: '',
    fotos: [
      { src: `${f}/08-marquesina.webp`, ancho: 1200, alto: 799, alt: 'Foto real: camas de secado de café bajo una marquesina' },
      { src: `${f}/04-secado-montana.webp`, ancho: 900, alto: 1200, alt: 'Foto real: café secándose al sol con las montañas detrás' },
    ] },
  { img: null, ancho: 0, alto: 0, titulo: 'Llega a tu taza', texto: 'Se tuesta, se sirve y cuenta de dónde viene.', alt: '',
    fotos: [
      { src: `${f}/13-barista.webp`, ancho: 1200, alto: 799, alt: 'Foto real: barista sirviendo café de filtro en una barra de madera' },
      { src: `${f}/11-granos-taza.webp`, ancho: 799, alto: 1200, alt: 'Foto real: granos de café tostado cayendo sobre una taza' },
    ] },
];


export const cifras = [
  ['300', 'emprendedores y productores'],
  ['50', 'marcas y fincas de café, aprox.'],
  ['14', 'marcas de vinos y licores'],
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
  { src: `${g}/donrey-geisha-presidencial.webp`, titulo: 'Don Rey', alt: 'Café Geisha Presidencial Don Rey, ganador del concurso Loja' },
  { src: `${g}/sapikuna-raices-gourmet.webp`, titulo: 'Sapikuna', alt: 'Café Sapikuna Raíces con planta de café y prensa' },
  { src: `${g}/granadillo-bolsas.webp`, titulo: 'Granadillo', alt: 'Dos bolsas negras de café Granadillo de Loja' },
  { src: `${g}/lojanias-bolsa-taza.webp`, titulo: 'Lojanías', alt: 'Bolsa de café Lojanías junto a una taza de café negro' },
  { src: `${g}/cafe-del-abuelo-bolsas.webp`, titulo: 'Café del Abuelo', alt: 'Bolsas de Café del Abuelo, microlote de Olmedo' },
  { src: `${g}/cafe-el-viajero-bolsa.webp`, titulo: 'Café El Viajero', alt: 'Bolsa dorada de Café El Viajero' },
  { src: `${g}/cafe-yunguilla-cariamanga-latte.webp`, titulo: 'Café Yunguilla', alt: 'Café Yunguilla de Cariamanga con un latte y granos' },
  { src: `${g}/vallicoffee-bolsas.webp`, titulo: 'Vallicoffee', alt: 'Bolsas de Vallicoffee con paisaje de montaña' },
];
