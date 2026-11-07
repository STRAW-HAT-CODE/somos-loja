# Web general: secciones acordadas en la reunión

Objective: bring the vintage landing in line with the four sections agreed in the meeting notes, starting with the two that do not exist yet (Eventos and Invitación).
Branch: `feat/web-vintage`. Delivery: local commits only, nothing pushed. Runner: `npx astro build`.

## Specs

S1. Add an "Eventos" section with an accordion of three groups: `pasados, en curso y próximos (estilo acordeón)`.
S2. Only one accordion group open at a time; keyboard reachable; no JavaScript required to open a group.
S3. Never invent facts. Any missing value is rendered through the existing `<Pendiente dato="..." />` marker (`{{dato}}` in dev, hidden in production). The site is a prototype for `ir con prototipo inicial + preguntas abiertas, no con todo cerrado`.
S4. Add an "Invitación" section with the invitation message, social links and a vertical video: `Mensaje de invitación + redes sociales + vídeo vertical`.
S5. The invitation message reads exactly `Te invitamos a Loja 100% Café Especial`.
S6. The social block shows only links that exist in `src/data/somos-loja.ts`; Facebook and TikTok stay pending.
S7. The vertical video frame is 9:16 and uses an existing clip as a placeholder until the client supplies vertical footage; the gap is stated in the UI-free way (data comment) and in this document, never as fake content.
S8. The interactive activity is NOT implemented: the meeting marked it `Actividad interactiva (aún por definir)`.
S9. Keep the vintage language: use the existing tokens (`--papel`, `--tinta`, `--ocre`, `--cafe`, `--curva`), no `sepia` filters. The notes explicitly say `vintage, no realista ni sepia genérico`.
S10. Do not reorder the existing narrative (300vh opening stage and its scroll timeline). The new sections are inserted into the narrative gaps.

## Tasks

- T1 — data model for events, social links and invitation. `src/data/somos-loja.ts`. inline.
- T2 — `src/components/Eventos.astro` accordion, scoped styles. inline.
- T3 — `src/components/Invitacion.astro` with 9:16 video frame. inline.
- T4 — mount both in `src/pages/index.astro`. inline.
- T5 — verify: build, desktop and mobile screenshots. inline.
- T6 — commit work units. inline.

## Log

L1 (user, verbatim): "ok ya me voy a domrir permiso a todo y has lo enotnces chaou"

L2 (user, meeting notes, verbatim fragments used as requirements):
- "Eventos: pasados, en curso y próximos (estilo acordeón)"
- "Mensaje de invitación + redes sociales + vídeo vertical"
- "Actividad interactiva (aún por definir)"
- "Vintage, no realista ni sepia genérico"
- "Te invitamos a Loja 100% Café Especial"
- "ir con prototipo inicial + preguntas abiertas, no con todo cerrado"

L3 (assumption): the four sections are added rather than reordering the page. Reordering the opening stage would break the 300vh sticky choreography that the whole page depends on, and it is harder to review. Recorded as S10.

L4 (assumption): no event names or dates exist in the repository. The accordion ships with the structure filled by real known facts (third edition, store location) and everything else behind `Pendiente`, so the client can answer the open questions while looking at the prototype.

L5 (discovery): the worktree had uncommitted work from Nov 2–3 (header redesign, hero rework, cartero page). It was preserved first in `7893d59` so the new work stays reviewable on its own.
