# Somos Loja

Sitio web, postal interactiva y página de tablet para Somos Loja, tienda cooperativa de Loja, Ecuador, con la campaña **Loja 100 % Café Especial**.

Cambio de concepto y estado de avance: [`docs/cambio-concepto-postal.md`](docs/cambio-concepto-postal.md).

## Orden de lectura

Para entender el proyecto de punta a punta, leer en este orden:

1. **Marca** — `assets/brand/somos-loja/`
   - `manual-marca-2da-propuesta.pdf`: manual de marca entregado por el cliente.
   - `alforjita-reference.png`: referencia de la mascota.
   - `entrada-video-reference.jpg`: fotograma de referencia de la entrada de la tienda.
   - `README.md`: notas de marca y límites de fidelidad.
2. **Producto** — `absent-apogee/PRODUCT.md`
   Qué es la tienda, a quién le habla, tono y reglas de contenido.
3. **Diseño** — `absent-apogee/DESIGN.md`
   Dirección visual vintage, tipografías y movimiento.
4. **Código del sitio** — `absent-apogee/src/`
   Astro: página, componentes, datos y estilos.
5. **Piezas independientes**
   - `invitacion/`: postal animada de Alforjita (HTML + WebGL, sin dependencias externas).
   - `tablet/`: landing de QR con video de fondo.
   - `design/cascada-cafe/`: prototipo de granos que caen y llenan una taza (HTML + GSAP/Lenis, assets locales).
6. **Verificación** — `tests/`
   Contratos de comportamiento de la invitación.

## Estructura

```text
.
├── absent-apogee/          Sitio Astro (src, public, package.json)
├── assets/brand/somos-loja/ Manual de marca y referencias del cliente
├── design/cascada-cafe/    Prototipo de granos cayendo en una taza
├── invitacion/             Postal animada de Alforjita
├── tablet/                 Landing de QR para tablet
└── tests/                  Verificaciones en Node
```

## Cómo correr

Sitio principal (Astro):

```sh
cd absent-apogee
npm install
npm run dev
```

Páginas estáticas servidas por Astro:

- Home: `/`
- Tablet: `/evento/index.html`
- Alforjita: `/evento/cartero/index.html`

En desarrollo, Astro no resuelve URLs de directorio sin `index.html`; usar siempre el enlace explícito.

Tablet como pieza aislada:

```sh
cd tablet
python3 -m http.server 4326
```

Invitación como pieza aislada: servir `invitacion/` con cualquier servidor HTTP local y abrir `/invitacion/`.

Prototipo de cascada: servir `design/cascada-cafe/` con un servidor HTTP local y abrir su `index.html`.

Verificación:

```sh
node --test tests/alforjita-invitacion.test.mjs
```

## Estado y pendientes

- Fecha, hora y lugar del evento: **por confirmar**.
- Redes sociales: Facebook y TikTok **pendientes** (solo se muestran las que existen en `absent-apogee/src/data/somos-loja.ts`).
- Video vertical: falta material del cliente.
- Actividad interactiva: **aún por definir**.
- Beneficios y canje de la postal: **por acordar**. La postal actual es una demostración, no emite un QR real.
- Paleta: el manual (p. 8) define `#185269`, `#E0E0D5` y `#FC9E6E`; el sitio usa una paleta provisional (`#F6EEDD`, `#1B2F6B`, `#E0A93B`, `#5A331C`). **A confirmar**.

## Reglas de contenido

- No inventar datos ni cifras: lo que falta queda marcado como pendiente.
- Vintage ilustrado, no realista ni sepia genérico.
- Fotos de tienda y producto son reales; las ilustraciones son generadas y no documentales.
- Nada de despliegue remoto ni publicación sin autorización explícita.
