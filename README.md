# Somos Loja — página de enlaces

Página estática de una sola pantalla, abierta desde una tarjeta acrílica por
**NFC** o **QR**. Su único objetivo es llevar a las redes sociales de Somos Loja.

Proyecto independiente del sitio web del evento (`Somos-Loja`), que mantiene
otra persona.

## Estado

**Entorno preparado. Sin página todavía.** Falta `index.html`, `estilos.css`
y los datos definitivos.

## Cómo abrirla en local

No requiere instalación ni build. Basta un servidor HTTP estático, porque
abrir el archivo con `file://` rompe las rutas relativas y las fuentes.

```bash
# opción 1: Python
python -m http.server 4327

# opción 2: Node
npx --yes serve . -l 4327
```

Luego abrir <http://localhost:4327/>.

## Estructura

```
AGENTS.md            Reglas que lee el agente (Antigravity)
MARCA.md             Paleta, tipografía y reglas del logo
README.md            Este archivo
.gitignore
.editorconfig
assets/
  logo-anterior.webp       Logo "Somos Loja Tienda"
  sello-evento.webp        Sello circular del evento
  fuentes/
    manrope-latin-var.woff2  Sustituto temporal de Visby CF
.agents/
  skills/
    verificar-pagina/
      SKILL.md           Procedimiento de revisión en móvil
```

## Datos del proyecto

### Confirmados

| Red | Enlace |
| --- | --- |
| Instagram | <https://www.instagram.com/tiendasomosloja/> |
| TikTok | <https://www.tiktok.com/@tiendasomosloja> |
| Google (Reseñas) | <https://search.google.com/local/writereview?placeid=ChIJHcx9b2FJy5EROqZZzSlx0Ns> |

### Pendientes

| Dato | Estado |
| --- | --- |
| Facebook | Solo hay enlace `/share/`; falta la URL del perfil |
| WhatsApp | Número por confirmar (`+593 96 294 7777` visto en una captura) |
| Evento 100 % Café Especial | Enlace por definir |
| URL del NFC / QR | Dominio propio; falta el valor exacto |
| Logo nuevo (Coopser) | Sin archivo vectorial |
| Gresmako / Visby CF | Sin archivos de fuente |

## Reglas que no se negocian

- No inventar enlaces, teléfonos ni datos. Lo que falta se queda pendiente.
- Paleta y logo según `MARCA.md`.
- La página debe funcionar sin JavaScript.
- Sin dependencias, sin build, sin CDN.

## Antes de publicar

1. Confirmar todos los enlaces con el cliente.
2. Quitar parámetros de rastreo.
3. Pasar la skill `verificar-pagina` en 390 × 844 y 360 × 800.
4. Probar el NFC y el QR reales sobre la tarjeta.
