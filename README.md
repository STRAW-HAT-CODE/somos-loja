# somos-loja
## Main integration and local preview

The served animation is `absent-apogee/public/evento/cartero/index.html`; it shares the model/timing/controller scripts with the standalone source while preserving its existing demonstration postcard, map and illustrative inactive QR.

From `absent-apogee`, run `npm run dev -- --host 127.0.0.1 --port 4331 --background`. Use `npm run dev -- status` and `npm run dev -- stop` to manage it.

- Homepage: http://localhost:4331/
- Alforjita: http://localhost:4331/evento/cartero/index.html
- Tablet: http://localhost:4331/evento/index.html

Use explicit index.html links for public static pages in Astro dev; slash-only directory URLs return404. No remote deployment or publishing is part of this work.
