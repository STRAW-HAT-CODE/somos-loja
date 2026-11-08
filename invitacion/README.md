# Invitación del cartero

Prototipo de la entrada por QR de Loja 100 % Café Especial. Sin build ni dependencias.

- Abrir: `python3 -m http.server 4325 --directory invitacion` y visitar `http://localhost:4325/`.
- Forzar el respaldo sin WebGL: `?fallback=1`.
- Estados expuestos en `<html>`: `data-estado`, `data-corrida`, `data-renderer`, `data-frames`, `data-audio`, `data-audio-disparos`, `data-audio-fuentes`.

La entrada por QR se reproduce automáticamente sin audio. El botón «Vivir la invitación con sonido» inicia de nuevo la secuencia y habilita efectos locales; «Silenciar» los detiene. No hay música. Los archivos se cargan únicamente después de pulsar el botón y su ausencia no impide ver la invitación. Con movimiento reducido o sin WebGL, el control de sonido no se muestra.

## Créditos de sonido

Los efectos son recortes normalizados con fundidos de vistas previas MP3 de Freesound, bajo [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Se agradece voluntariamente a sus creadores:

| Archivo local | Creador | Fuente |
| --- | --- | --- |
| `recursos/sonido/paso-1.mp3` a `paso-4.mp3` | Nox_Sound | https://freesound.org/people/Nox_Sound/sounds/543685/ |
| `recursos/sonido/sobre-entrega.mp3` | MTJohnson | https://freesound.org/people/MTJohnson/sounds/444431/ |
| `recursos/sonido/cafe-servido.mp3` | Maajora | https://freesound.org/people/Maajora/sounds/432775/ |

El efecto del sobre corresponde a su deslizamiento durante la entrega, no a su apertura. Los recortes todavía requieren una escucha humana en contexto antes de publicarse.

Las imágenes `finca` y `taza` son ilustraciones de IA, rotuladas en pantalla. `cereza-roja`, `grano-cayendo` y `olla-negra` son fotos reales del material del proyecto. Fecha, horario, lugar, dirección y mapa siguen "Por confirmar". No hay canje real.
