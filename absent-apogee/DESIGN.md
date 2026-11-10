# Somos Loja: guía de identidad para la web

La web debe saber a Loja. Es un grabado antiguo de la Catedral y el Parque Central, en tinta y acuarela sobre papel crema. Se recorre bajando desde la Catedral hasta la tienda. La tienda es el destino y la única superficie oscura.

Fuentes: Manual de Marca Coopser (2.ª propuesta), logo de la tienda y sellos «100 % Café Especial» y «Tercera Edición». También las conversaciones con el cliente («Conversacion Somos loja», «Conversacion y lluvias de ideas de somos loja»).

## 1. Logos: cuál va dónde

| Logo | Archivo | Dónde se usa |
|---|---|---|
| Somos Loja **Tienda** (molinos, «Somos» manuscrito) | `public/carpeta-a-usar-web/logo-somos-loja-tienda.webp` | Logo principal: cabecera y pie. |
| Sello **Tercera Edición** | `public/carpeta-a-usar-web/sello-tercera-edicion.webp` | Sección del evento («50»), postal e invitación. |
| Sello **100 % Café Especial** | `public/carpeta-a-usar-web/sello-cafe-especial.webp` | Piezas del evento sin edición: favicon futuro y redes. El cliente dice que es «la marca que queremos a futuro». |
| Somos Loja **Coopser** (manual) | falta SVG | Partes institucionales: nosotros, pie legal y aliados. |

Usos prohibidos de cualquier logo (manual, p. 11):
- rotarlo como logo. Los sellos sí pueden girarse unos grados, como si estuvieran estampados;
- cambiarle los colores;
- deformarlo;
- agregarle textos o elementos;
- ponerlo sobre un fondo que lo vuelva ilegible;
- usarlo por debajo de 57 px de alto en pantalla.

## 2. Colores

Los tokens viven en `src/styles/global.css`. Los contrastes se midieron con WCAG sobre `--papel`.

| Token | Hex | Origen | Uso | Contraste |
|---|---|---|---|---|
| `--tinta` | `#185269` | Petróleo del manual y de los sellos | Texto, navegación, botones y fondo de la tienda | 7,4:1 ✅ |
| `--tinta-suave` | `#46697A` | Derivado | Texto secundario y notas | 5,1:1 ✅ |
| `--durazno` | `#FC9E6E` | Manual y sellos | CTA, subrayados, bordes y puntos de acento | 1,8:1. **Nunca como texto sobre claro.** Sobre petróleo da 4,2:1, solo para texto grande. |
| `--papel` | `#F6EEDD` | Web | Fondo general. Acompaña a la acuarela. | — |
| `--hueso` | `#E0E0D5` | Manual | Tarjetas y superficies secundarias | — |
| `--turquesa` | `#44BBC3` | Logo de la tienda | Solo decoración (ilustración, detalles) | 1,9:1 ❌ como texto |
| `--azul` | `#2E7CBF` | Logo de la tienda | Solo decoración | 3,8:1 ❌ como texto chico |
| `--ocre` / `--cafe` | `#E0A93B` / `#5A331C` | Ilustración | **Solo** en la ilustración y en el proceso del café (granos, cinta, tickets de papel) | — |

Reglas:
- Un acento por pantalla. El durazno guía la mirada; si aparece en todas partes, deja de guiar.
- El texto sobre `--durazno` va en `#1D1A12` (8,5:1).
- El turquesa y el azul acompañan al logo de la tienda. No compiten con el petróleo.

## 3. Tipografía

| Rol | Hoy | Según el manual (cuando el cliente entregue los archivos) |
|---|---|---|
| Firma «Somos Loja» | Yellowtail. Hace eco del «Somos» manuscrito del logo de la tienda. | Se mantiene. |
| Títulos | Cormorant (serif de grabado) | Gresmako |
| Texto | Manrope | Visby CF |

> Gresmako y Visby CF son las tipografías del manual, pero no tenemos los archivos ni sus licencias. Hasta que lleguen se usan las actuales, que ya están optimizadas (woff2 latino, `font-display: swap`). El cambio se hace en un solo lugar: los `@font-face` y las clases de §4.

## 4. Escala tipográfica

| Clase | Fuente | Tamaño | Interlineado | Uso |
|---|---|---|---|---|
| `.firma` | Yellowtail | clamp(4.5rem, 13vw, 11rem) | 1 | El nombre, una vez por pantalla |
| `.firma--media` | Yellowtail | clamp(3rem, 6vw, 4.5rem) | 1 | Firmas de sección («Sabe a Loja») |
| `.titular` | Cormorant 600 | clamp(2.5rem, 6vw, 5rem) | 1.02 | H2 de sección |
| `.titular--media` | Cormorant 600 | clamp(1.875rem, 3.2vw, 2.75rem) | — | Subtítulos |
| `.titular--chica` | Cormorant 600 | 1.375rem | 1.625rem | Títulos de tarjeta |
| `.versal` | Cormorant 600, MAYÚSCULAS, +0.2em | clamp(1rem, 1.7vw, 1.5rem) | 1.3 | Etiquetas y navegación |
| `.cuerpo` | Manrope 400 | 1.125rem | 1.75rem | Párrafos |
| `.nota` | Manrope 400, `--tinta-suave` | 0.875rem | 1.25rem | Aclaraciones y pies |
| `.boton` | Manrope 600 | 1rem | 1.5rem | Acciones |

Ninguna clase nueva sin pasar por esta tabla.

## 5. Cómo escribimos

Somos una cooperativa de servicio: «Somos Loja es servicio. Nosotros no lucramos». La voz es cálida, orgullosa de Loja, un poco rebelde («capital de la cultura, de la música, del arte»), **nunca vendedora**. Unimos «el arte del lojano con el arte del café».

| Escribimos | No escribimos |
|---|---|
| «Más de 50 marcas de café» | «50 cafés de especialidad» (no todos lo son: hay un top 10) |
| «Una degustación por persona» | «Degustaciones ilimitadas», «gratis para todos» |
| «Emprendedores lojanos», «hecho en Loja» | «Productos», «oferta», «compra ya» |
| «A pasos de la Catedral» | Referencias a la Puerta de la Ciudad (para el cliente es «símbolo del colonialismo») |
| Postal, cartilla de viaje | Pasaporte |
| Frases cortas, tuteo, verbos de invitación («ven», «prueba», «conoce») | Frases largas, «usted», tecnicismos |

- Sin datos inventados. Lo que falta se marca con `<Pendiente dato="…" />`, que solo se ve en desarrollo.
- En la tienda se cuentan las categorías y la ubicación, no el detalle de cada producto.
- La ortografía es parte de la marca: tildes, «100 %» con espacio, «3.ª edición».

## 6. Ilustración y movimiento

- Ilustraciones: grabado y acuarela de la Catedral y el Parque Central, hechas con IA a partir de fotos de referencia. No son documentales. Las fotos de la tienda y de los productos son reales.
- Recorrido: el nombre se escribe junto a la Catedral viva; la plaza se convierte en un grano; una cinta de café une el proceso (foto → proceso → molido → taza); granos 3D forman el 50; los productos se inclinan hacia el puntero; el carrusel pasa productos reales.
- Siempre respetar `prefers-reduced-motion`.
