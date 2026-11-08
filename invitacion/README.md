# Alforjita postcard invitation

Isolated local variant of the existing automatic courier invitation. Uses the same raw WebGL renderer, timeline, envelope socket, sounds, skip/replay, reduced-motion mode and static fallback; no Three.js, new plugins, CDN or generated model dependency.

Alforjita is a stylized geometric recreation of the supplied illustration, not an exact copy. The storefront uses the supplied video's entrance instead of a cabin. Brand sources are archived in `../assets/brand/somos-loja/`.

Performance: DPR capped at 1.5, shared static geometry, single timeline, hidden-tab pause and final renderer stop. Detailed character geometry renders once per frame; envelope socket and planar shadow use simpler poses. Audio fetches only after a gesture. No full video/PDF/reference PNG is loaded at runtime.

Run from a local HTTP server at `/invitacion/`. `?lento=4` slows the sequence for review; `?fallback=1` forces the static illustration. Node contracts: `node --test tests/alforjita-invitacion.test.mjs`.

No real redemption, personal QR issuance, publishing or voice recording is implemented. Perks are pending agreement. Other website/tablet/scroll work remains untouched.

## Organic 3D revision

The character now uses derivative-normal parametric surfaces rather than faceted primitive assemblies: continuous curved striped cap, rounded striped body and satchel, smooth face/limbs, curved eyebrows and smile. A single prebuilt vertex buffer is retained; tests enforce finite unit normals, fewer than 100,000 uploaded vertices, and no geometry uploads while rendering. The original low-poly environment remains unchanged.

Hat and flower movement is tied to the walking clock; blink timing is deterministic. Satchel sway lags the body and pivots at the stationary strap attachment; the contained letters share the satchel transform. The curved strap stays attached to the torso. Separate smile/tooth depth avoids coplanar flicker.

Five Node tests pass. Observed final flow: six sound cues after activation, no remaining audio sources, stopped renderer, working replay/skip and no mobile overflow. Physical-phone FPS is not measured. It remains an approximate 3D interpretation of a single-view 2D reference, not exact all-angle likeness. No extra runtime library or network model was added.

## Deliberate delivery pacing

The shared `delivery-timing` script controls both model and page choreography. The walk now lasts 2.6 seconds (previously 1.2); Alforjita follows a diagonal path toward the visitor, turns and raises the envelope over 1.35 seconds, then holds it visibly for 0.55 seconds before the camera approaches. Full reveal lasts 8.6 seconds (previously 5.6). Five footfall cues are computed from the same eased path and foot phase; the existing four footstep files are reused. Two later cues accompany offering and coffee. The skip button and reduced-motion shortcut remain immediate.

The safety timeout and fallback reveal derive from the same shared timings, rather than stale numeric offsets. Six Node tests cover beat ordering, the approach path, footstep synchronization and existing geometry/resource safeguards.

## Latest scene direction

Walking is exactly 2.2 seconds; the full reveal is 8.2 seconds. The satchel swings more visibly around its attached strap pivot. Two of its original letters release at 32% and 68% of the walk, flutter along deterministic gravity arcs and settle flat on the ground; one stays in the bag. Letter geometry and size are reused, not replaced during flight. This explicitly supersedes the earlier all-letters-stay-contained direction.

SOMOS LOJA now uses independent extruded white block letters on narrow roof supports, with no facade sign or billboard backing.

## Main integration and local preview

The served animation is `absent-apogee/public/evento/cartero/index.html`; it shares the model/timing/controller scripts with the standalone source while preserving its existing demonstration postcard, map and illustrative inactive QR.

From `absent-apogee`, run `npm run dev -- --host 127.0.0.1 --port 4331 --background`. Use `npm run dev -- status` and `npm run dev -- stop` to manage it.

- Homepage: http://localhost:4331/
- Alforjita: http://localhost:4331/evento/cartero/index.html
- Tablet: http://localhost:4331/evento/index.html

Use explicit index.html links for public static pages in Astro dev; slash-only directory URLs return404. No remote deployment or publishing is part of this work.
