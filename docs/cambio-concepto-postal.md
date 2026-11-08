# Cambio de concepto: la postal reemplaza al pasaporte

> Documento de reunión, 8 de noviembre de 2026. Texto original del cliente, sin editar.

Cambio de concepto: La postal reemplaza al pasaporte

- La idea del pasaporte y los sellos se descartó después de la primera reunión porque se consideró demasiado utilizada.
- Nuevo concepto: un código QR abre una animación de un cartero que entrega una postal.
  - La postal muestra la fecha, hora, lugar del evento, dirección, mapa y un código QR único.
  - El QR único funciona como un sello, canjeable por un beneficio, como un café.
  - El objetivo es atraer visitantes, fidelizarlos y aumentar los seguidores en redes sociales.
- El cartero será reemplazado por Alforjita, la mascota del Festival de Artes Vivas.
  - El fondo de la tienda debe mostrar «Somos Loja» y una fachada similar a la puerta real del establecimiento.
  - Se contempla una frase de voz opcional: «Te llegó una postal», cuyo guion será preparado por el equipo.
- La postal se rediseñará en formato horizontal, como una postal real, con una indicación que diga «Gira tu teléfono».
- El sello (código QR) se trasladará a la esquina superior de la postal, como ocurre en el correo tradicional.

Alcance y enfoque del evento

- El enfoque será únicamente en el evento 100% Café de Especialidad, que durará aproximadamente 10 días y finalizará el 22 de noviembre.
  - Se espera la participación de aproximadamente 20 marcas, no las 50 que se comercializan en la tienda.
  - La sección de la tienda y el catálogo se desarrollarán posteriormente; por ahora no se implementará un comercio electrónico.
- La página estará vinculada al mensaje de la tienda «50 especialidades», con las actividades del evento destacadas cerca del inicio.
- La mecánica de los beneficios todavía está por definirse: café gratis por acumular sellos de las marcas participantes, degustaciones, concursos o limonadas.
  - Las recompensas no deben representar pérdidas para las marcas, por lo que estas deberán estar de acuerdo con los beneficios.

Flujo y diseño de la página

- Primera pantalla de la tableta: fondo de la tienda, «Somos Loja», «50 especialidades» y un código QR con diseño de grano de café.
  - Los estudiantes recorrerán las calles con tabletas y mensajes que inviten a las personas a escanear el código.
- Al escanear el QR, se mostrará primero la animación de Alforjita, después la postal y finalmente una página web con desplazamiento vertical.
- Dirección visual elegida: página con fotografías reales, adaptadas a un estilo vintage y a los colores de la marca.
  - Fotografías reales de fincas y cosechas adaptadas al estilo vintage en la sección superior, además de una imagen principal de la catedral.
  - La sección de actividades irá inmediatamente después de «50 especialidades», seguida de la información de la tienda y los enlaces a redes sociales.
  - Se utilizará un único desplazamiento vertical en lugar de varios, optimizado para celulares y computadoras.
- Idea de animación durante el desplazamiento: los granos de café caen y se agrupan hasta formar una taza en la sección de actividades.
- Video de fondo para la tableta, de 10 a 15 segundos, grabado desde la entrada de la tienda y mostrando un recorrido por su interior.

Identidad de marca y recursos necesarios

- Utilizar ambos logotipos, el de Somos Loja y el de 100% Café de Especialidad, manteniendo una línea gráfica unificada.
  - El manual de marca y las tipografías todavía están pendientes de entrega; actualmente los logotipos solo están disponibles en PDF y JPG.
  - Los archivos de diseño de Alforjita están en la página del festival; sus colores cambiaron a fucsia y verde.
- Colores establecidos: predominantemente verde y rojo, en tonalidades vintage que combinen con las fotografías reales.
- El diseño del código QR con temática de café puede personalizarse con un grano, hojas o una taza.

Cronograma y próximos pasos

- 7 de noviembre: lanzamiento del evento.
- Domingo 8 de noviembre: se entregará al equipo de desarrollo la lista de participantes.
- Lunes 9 de noviembre: la página deberá estar lista para que los estudiantes puedan recibir capacitación.
- Del 10 al 12 de noviembre: capacitación de los estudiantes.
- Los desarrolladores únicamente necesitan recibir los recursos gráficos para después programar, alojar y publicar la página en su servidor y dominios.

Tareas pendientes

1. Enviar el manual de marca, los logotipos y la línea gráfica
   Necesarios para la pantalla de la tableta, la postal y la página web. Los dos logotipos deberán combinarse visualmente.
2. Enviar los archivos de Alforjita y el video de fondo para la tableta
   Video de 10 a 15 segundos que muestre desde la entrada hasta el interior de la tienda. También se necesitan los archivos de diseño de la mascota.
3. Seleccionar fotografías reales e imágenes de las fincas para la página
   Incluir fotografías para la sección superior, además de la lista de marcas participantes y las actividades del evento.
4. Definir los beneficios y las actividades del evento con las marcas
   Esta información debe estar lista para el domingo 8 de noviembre, de manera que pueda incorporarse a la página.
5. Actualizar el prototipo: postal horizontal, Alforjita, escenario de la tienda y QR con diseño de grano de café
   Además, implementar una página con un único desplazamiento vertical, una animación de granos cayendo hasta formar una taza y fotografías reales con estilo vintage.
6. Publicar la página y compartir el enlace
   La página debe estar lista para el domingo por la noche o el lunes por la mañana, antes de la capacitación de los estudiantes.

---

## Estado en el repositorio (8 de noviembre de 2026)

Leyenda: **HECHO** (implementado), **PARCIAL** (existe una base, falta lo pedido), **PENDIENTE** (no implementado), **N/A** (no es código).

### Concepto y flujo de la postal

| Punto del documento | Estado | Evidencia |
| --- | --- | --- |
| La postal reemplaza al pasaporte | HECHO | No hay pasaporte ni sellos; el flujo es una postal. |
| Un QR abre la animación del cartero que entrega la postal | HECHO | `invitacion/index.html` y `absent-apogee/public/evento/cartero/index.html`. |
| La postal muestra fecha, hora, lugar, dirección, mapa y QR único | PARCIAL | Los campos existen con datos de ejemplo (`absent-apogee/public/evento/cartero/index.html:180-205`); el QR es una imagen referencial, no único (`:212`). |
| El QR único funciona como sello canjeable por un beneficio | PENDIENTE | La postal se declara demostración y no canjea nada (`:213-214`). |
| Atraer visitantes, fidelizar y sumar seguidores | N/A | Depende de campaña y redes, no del código. |
| El cartero se reemplaza por Alforjita | HECHO | Alforjita en 3D dentro de la invitación. |
| Fondo con «Somos Loja» y fachada similar a la puerta real | HECHO | Letras SOMOS LOJA en el techo y frente reconstruido desde el video de referencia. |
| Voz opcional «Te llegó una postal» | PENDIENTE | No hay voz ni guion en el repo. |
| Postal horizontal con «Gira tu teléfono» | PENDIENTE | La postal es vertical (artículo) y no existe ese aviso. |
| El sello QR en la esquina superior | PENDIENTE | Arriba hay una estampilla SVG de taza; el QR está en el bloque de beneficio (`:207-214`). |

### Alcance y enfoque del evento

| Punto del documento | Estado | Evidencia |
| --- | --- | --- |
| Solo el evento 100% Café, ~10 días, termina el 22 de noviembre | PARCIAL | El evento está nombrado; la fecha de la postal es demo (21 nov 2026); no hay marco de 10 días. |
| ~20 marcas participantes, no 50 | PENDIENTE | La UI dice «50 marcas de café» (`EventoFlotante.astro:9`) y «Unas 50 marcas y fincas» (`src/data/somos-loja.ts:41`). |
| Tienda y catálogo después; sin e-commerce | HECHO | No hay comercio electrónico. |
| Página ligada a «50 especialidades» y actividades cerca del inicio | PARCIAL | El sitio dice «50 marcas», no «50 especialidades»; no existe sección de actividades. |

### Flujo y diseño de la página

| Punto del documento | Estado | Evidencia |
| --- | --- | --- |
| Tablet: fondo de tienda, «Somos Loja», «50 especialidades» y QR grano | PARCIAL | Hay SOMOS LOJA, video de fondo y CTA; faltan «50 especialidades» y el QR (`tablet/index.html:296-299`). |
| QR → Alforjita → postal → página con scroll vertical | HECHO | Flujo implementado de punta a punta. |
| Fotos reales con estilo vintage y colores de marca | PARCIAL | Hay sección vintage, pero con ilustraciones generadas; la paleta es índigo/ocre/café, no verde/rojo. |
| Fotos reales de fincas y cosechas arriba, catedral como imagen principal | PENDIENTE | `proceso` usa ilustraciones (`vintage/finca.webp`, `vintage/secado.webp`); la catedral es ilustración/video. |
| Actividades después de «50 especialidades», luego tienda y redes | PENDIENTE | No hay sección de actividades; orden actual: inicio → proceso → evento → sabores → tienda. |
| Un único scroll vertical | HECHO | Una sola página. |
| Granos que caen y forman una taza en actividades | PENDIENTE | Los granos forman «50» (`src/scripts/granos-vintage.js:1`, `granos-acuarela.js:1`). |
| Video de tablet de 10-15 s, entrada → interior | PENDIENTE | `tablet/recursos/plaza.mp4` es un loop de la plaza, no entrada → interior. |

### Identidad de marca y recursos

| Punto del documento | Estado | Evidencia |
| --- | --- | --- |
| Ambos logos unificados (Somos Loja + 100% Café) | PARCIAL | Solo existe `logo-somos-loja-tienda.webp`; falta el logo 100% Café. |
| Manual de marca y tipografías | PARCIAL | El manual (2da propuesta) está en `assets/brand/somos-loja/`; las tipografías no fueron entregadas. |
| Alforjita en fucsia y verde | HECHO | Referencia y modelo 3D fucsia/lima. |
| Colores predominantes verde y rojo vintage | PENDIENTE | Paleta actual índigo/ocre/café (`absent-apogee/DESIGN.md`). |
| QR temático de café | PENDIENTE | QR referencial con la Puerta de la Ciudad (`absent-apogee/public/evento/cartero/recursos/qr-puerta-loja-mvp.png`). |

### Tareas pendientes del documento

| # | Tarea | Estado | Nota |
| --- | --- | --- | --- |
| 1 | Enviar manual, logotipos y línea gráfica | PARCIAL | Manual recibido; falta el logo 100% Café y las tipografías. |
| 2 | Enviar archivos de Alforjita y video de fondo de tablet | PARCIAL | Hay imagen de referencia de Alforjita; faltan los archivos de diseño y el video entrada → interior. |
| 3 | Seleccionar fotografías reales e imágenes de fincas | PENDIENTE | Solo hay fotos reales de tienda/producto; las fincas son ilustraciones. |
| 4 | Definir beneficios y actividades con las marcas | PENDIENTE | Sin definición; la postal sigue en modo demostración. |
| 5 | Actualizar el prototipo (postal horizontal, QR grano, granos → taza, fotos reales vintage) | PARCIAL | Alforjita, escenario de tienda y scroll único ya están; falta el resto. |
| 6 | Publicar la página y compartir el enlace | PENDIENTE | Todo el trabajo es local; no hay despliegue. |

### Resumen

- **HECHO:** 8 puntos.
- **PARCIAL:** 7 puntos.
- **PENDIENTE:** 11 puntos.
- **N/A:** 1 punto.
