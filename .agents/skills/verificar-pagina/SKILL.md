---
name: verificar-pagina
description: Revisa la página de enlaces en viewport de teléfono antes de darla por terminada. Usar al completar un cambio visual o de datos, y siempre antes de entregar o publicar.
---

# Verificar la página de enlaces

## 1. Preparar

Levantar un servidor local en la raíz del proyecto:

```bash
python -m http.server 4327
```

Abrir `http://localhost:4327/` con `/browser`.

## 2. Revisar en móvil

Probar en **390 × 844** (iPhone) y **360 × 800** (Android pequeño).

Comprobar:

- No hay scroll horizontal en ninguno de los dos.
- Todos los botones miden al menos 44 × 44 px.
- El texto se lee sin hacer zoom.
- Nada queda tapado por la barra de estado ni por el notch.
- Las fuentes cargan desde `assets/fuentes/`, sin peticiones externas.

## 3. Revisar sin JavaScript

Desactivar JavaScript y recargar.

- Los enlaces deben seguir visibles y funcionando.
- Si algo desaparece o queda inutilizable, es un fallo: reportarlo.

## 4. Revisar los datos

- Ningún enlace inventado.
- Ningún botón apunta a `#` ni a una URL vacía.
- Los parámetros de rastreo están eliminados.
- Todos los enlaces externos tienen `target="_blank"` y `rel="noopener noreferrer"`.

## 5. Revisar la marca

- Solo se usan colores de `MARCA.md`.
- El logo no está rotado, estirado ni recoloreado.
- El logo mide al menos 94 px de ancho.
- El contraste cumple AA.

## 6. Reportar

Devolver una lista con: problema, archivo y línea, y corrección propuesta.
**No editar archivos sin pedir confirmación.**
