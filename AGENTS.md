# Somos Loja — página de enlaces (NFC / QR)

## Qué es

Página estática de una sola pantalla que se abre tocando una tarjeta acrílica
por NFC o escaneando su código QR. Lista los accesos a las redes sociales de
Somos Loja.

No es el sitio web del evento. Ese lo lleva otra persona en otro repositorio
(`Somos-Loja`) y **no se toca desde aquí**.

## Reglas de marca

Fuente de verdad: **Manual de Marca, 2da propuesta** (`MARCA.md` resume lo
necesario; no hace falta abrir el PDF).

- Paleta oficial, sin excepciones:
  - `#185269` azul petróleo — color principal
  - `#E0E0D5` crema — fondo
  - `#FC9E6E` coral — acento
  - `#FFD300` amarillo — secundario
  - `#007779` verde azulado — secundario
  - `#1D1D1B` negro — texto
  - `#575756` gris — texto secundario
- Tipografía del manual: **Gresmako** (títulos) y **Visby CF** (texto).
  Los archivos **no están disponibles**. Mientras no lleguen, usar
  **Manrope** (ya incluida en `assets/fuentes/`) y decirlo al entregar.
  Nunca afirmar que se está usando la tipografía oficial si no es así.
- Logo: nunca rotar, inclinar, estirar, recolorear, añadir elementos ni
  colocarlo sobre fondos que reduzcan su legibilidad.
- Tamaño mínimo del logo en web: **94 px**. Ícono: 76 px / 57 px.
- Estilo: vintage contenido — papel, textura sutil, tipografía con aire.
  No usar sepia genérico ni filtros que ensucien las fotos.

## Reglas de contenido

- **Prohibido inventar** URLs, usuarios, números de teléfono, direcciones,
  fechas o nombres de redes.
- Si un dato no existe, queda como pendiente y **no se renderiza** un botón
  que no lleve a ninguna parte.
- Todo el texto visible va en español.
- No agregar secciones que no sean enlaces (sin blog, sin formularios,
  sin catálogo, sin carrito).
- Los parámetros de rastreo (`?dlrf=`, `?_r=`, `?_t=`, `/share/`) se eliminan
  antes de publicar un enlace.

## Reglas técnicas

- HTML + CSS + JavaScript mínimo. **Sin** frameworks, sin build, sin CDN,
  sin fuentes remotas, sin dependencias de npm.
- **Debe funcionar sin JavaScript.** Los enlaces viven en el HTML; el JS solo
  puede mejorar la experiencia, nunca ser requisito.
- Cada enlace externo: `target="_blank"` y `rel="noopener noreferrer"`.
- Área táctil mínima: 44 × 44 px.
- Contraste mínimo AA. Ojo: `#FC9E6E` sobre `#E0E0D5` **no** sirve para texto.
- Respetar `prefers-reduced-motion`.
- Mobile first. Sin scroll horizontal en 360 px de ancho.

## Estructura esperada

```
index.html
estilos.css
enlaces.js          (solo si aporta; opcional)
assets/
  logo-anterior.webp
  sello-evento.webp
  fuentes/manrope-latin-var.woff2
```

## Prohibido

- Publicar, desplegar o hacer `push`.
- Hacer `commit`, `merge` o `rebase`: eso lo hace la persona dueña del repo.
- Leer o modificar el repositorio `Somos-Loja`.
- Copiar imágenes desde `Somos-Loja` sin traerlas explícitamente a `assets/`.

## Cómo verificar antes de entregar

Usar la skill `verificar-pagina`. Como mínimo: 390 × 844 y 360 × 800 sin
scroll horizontal, enlaces funcionando con JS desactivado, y ningún enlace
inventado.
