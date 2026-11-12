import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const pagePath = new URL('../absent-apogee/public/evento/postal/index.html', import.meta.url);
const pageDir = dirname(fileURLToPath(pagePath));
const read = () => readFileSync(pagePath, 'utf8');

test('postal page exists with the four phases driven by one function', () => {
  assert.ok(existsSync(pagePath), 'evento/postal/index.html must exist');
  const html = read();
  for (const phase of ['video', 'girar', 'apertura', 'postal']) {
    assert.match(html, new RegExp(`irA\\('${phase}'`), `phase ${phase} must be reachable through irA`);
  }
  assert.match(html, /dataset\.fase\s*=/);
});

test('video plays inline with a poster and a skip control, and waits for the opening tap', () => {
  const html = read();
  const video = html.match(/<video[^>]*>/)?.[0] ?? '';
  for (const attr of ['muted', 'playsinline', 'poster=']) assert.ok(video.includes(attr), `video needs ${attr}`);
  assert.ok(!video.includes('autoplay'), 'the video must wait for the opening tap so it can play with sound');
  assert.match(html, /id="saltar"/);
  assert.match(html, /Te llegó una postal/);
});

test('rotate step asks to turn the phone and lets locked phones open anyway', () => {
  const html = read();
  assert.match(html, /\(orientation: landscape\)/);
  assert.match(html, /Gira tu teléfono/);
  assert.match(html, /id="abrir-aqui"/);
});

test('postcard keeps the QR stamp contract with the live coffee QR', () => {
  const html = read();
  assert.match(html, /class="[^"]*sello-qr/);
  assert.match(html, /src="recursos\/qr-cafe\.webp"/, 'the stamp uses the coffee-plant QR');
  assert.match(html, /<figcaption><a href="https:\/\/strawhatcode\.com\/r\/nPXZOXf\?c=q"[^>]*>Escanéame o haz clic aquí<\/a><\/figcaption>/, 'the QR caption is also a link to the QR destination');
  assert.ok(existsSync(join(pageDir, 'recursos/qr-cafe.webp')), 'missing recursos/qr-cafe.webp');
  assert.match(html, /loading="eager" fetchpriority="high"/);
  assert.match(html, /Una degustación por persona/);
  assert.match(html, /id="titulo"/);
});

test('accessibility and lifecycle guards are present', () => {
  const html = read();
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /document\.hidden/);
});

test('every local resource exists and no external script is loaded', () => {
  const html = read();
  const refs = [...html.matchAll(/(?:src|href|poster)="(recursos\/[^"]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length >= 3, 'expected video, poster and QR resources');
  for (const ref of refs) assert.ok(existsSync(join(pageDir, ref)), `missing ${ref}`);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('inline scripts parse', () => {
  const html = read();
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.ok(scripts.length >= 1);
  for (const code of scripts) assert.doesNotThrow(() => new vm.Script(code));
});

test('tablet landing and the home invitation button point to the postal page', () => {
  const landing = readFileSync(new URL('../absent-apogee/public/evento/index.html', import.meta.url), 'utf8');
  assert.match(landing, /COURIER_INVITATION_URL = "\.\/postal\/index\.html"/);
  const datos = readFileSync(new URL('../absent-apogee/src/data/somos-loja.ts', import.meta.url), 'utf8');
  assert.match(datos, /postal: '\/evento\/postal\/index\.html'/);
  const home = readFileSync(new URL('../absent-apogee/src/pages/index.astro', import.meta.url), 'utf8');
  assert.match(home, /href=\{evento\.postal\}>Abrir la invitación/);
});

test('rotate hint stays on screen 2-3 seconds before the postcard opens', () => {
  const html = read();
  const ms = Number(html.match(/GIRAR_MINIMO\s*=\s*(\d+)/)?.[1]);
  assert.ok(ms >= 2000 && ms <= 3000, 'GIRAR_MINIMO must be between 2000 and 3000 ms');
  assert.doesNotMatch(html, /if \(horizontal\.matches\) return irA\('apertura'\)/, 'landscape must not skip the hint instantly');
});

test('event link leaves the iframe and respects the site base path', () => {
  const html = read();
  const link = html.match(/<a[^>]*>Ver la página del evento/)?.[0] ?? '';
  assert.match(link, /href="\.\.\/\.\.\/"/, 'link must be relative so it works under any base path');
  assert.match(link, /target="_top"/, 'link must open in the top window, not inside the floating iframe');
});

test('slow video loading is not treated as a failure', () => {
  const html = read();
  assert.match(html, /VIDEO_ESPERA_MAX\s*=\s*\d{4,}/, 'a longer wait must exist for buffering videos');
  assert.doesNotMatch(html, /video\.paused \|\| video\.currentTime === 0\) falloVideo/, 'buffering at time 0 must not fail at 2.5 s');
});

test('envelope opens after the hint in any orientation and the postcard adapts to portrait', () => {
  const html = read();
  assert.match(html, /setTimeout\(\(\) => irA\('apertura'\), GIRAR_MINIMO\)/, 'the hint must open the envelope even without rotating');
  const portrait = html.match(/@media \(orientation: portrait\), \(max-width: 640px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.ok(portrait, 'the compact postcard block must live in the portrait / narrow media query');
  assert.match(portrait, /grid-template-areas/, 'portrait postcard needs its own compact layout');
  assert.match(portrait, /"marca sello"/, 'QR stamp sits at the top right in portrait');
});

// Behaviour harness: runs the page script against a minimal fake DOM with a manual clock,
// so the phase machine is exercised instead of only matched as text.
function montar({ autoplay = true, reducido = false, abrir = true } = {}) {
  const html = read();
  const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  let ahora = 0, sig = 1;
  const timers = new Map();
  const el = () => {
    const l = {};
    const clases = new Set();
    return {
      dataset: {}, inert: false, listeners: l, focused: 0,
      classList: { add: (c) => clases.add(c), remove: (c) => clases.delete(c), toggle: (c, on) => (on ? clases.add(c) : clases.delete(c)), contains: (c) => clases.has(c) },
      addEventListener: (t, f) => ((l[t] ||= []).push(f)),
      emit(t) { (l[t] || []).forEach((f) => f()); },
      focus() { this.focused++; },
      setAttribute(k, v) { this[k] = v; },
      animate: () => ({ cancel() {}, finished: Promise.resolve() }),
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }),
    };
  };
  const ids = {};
  for (const id of ['video', 'titular', 'postal', 'titulo', 'solapa', 'carta', 'sobre', 'lacre', 'saltar', 'abrir-aqui', 'repetir', 'mesa', 'abrir-postal', 'sonido']) ids[id] = el();
  const sel = { '.escena': el(), '.girar': el(), '.inicio': el() };
  const video = Object.assign(ids.video, {
    paused: true, currentTime: 0,
    play() { if (!autoplay) return Promise.reject(new Error('blocked')); this.paused = false; return Promise.resolve(); },
    pause() { this.paused = true; },
  });
  const raiz = { dataset: {} };
  const docL = {};
  const document = {
    documentElement: raiz, hidden: false,
    getElementById: (id) => ids[id], querySelector: (s) => sel[s],
    addEventListener: (t, f) => ((docL[t] ||= []).push(f)),
  };
  const ctx = {
    document,
    matchMedia: () => ({ matches: reducido, addEventListener() {} }),
    setTimeout: (f, ms) => { const id = sig++; timers.set(id, { f, at: ahora + ms }); return id; },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: () => 0, cancelAnimationFrame() {},
  };
  vm.runInNewContext(code, ctx);
  // The page waits for the opening tap; most tests start right after it.
  if (abrir) ids['abrir-postal'].emit('click');
  const flush = () => new Promise((r) => setImmediate(r));
  return {
    raiz, ids, sel, video, document,
    fase: () => raiz.dataset.fase,
    async avanzar(ms) {
      const fin = ahora + ms;
      for (;;) {
        const prox = [...timers].filter(([, t]) => t.at <= fin).sort((a, b) => a[1].at - b[1].at)[0];
        if (!prox) break;
        timers.delete(prox[0]); ahora = prox[1].at; prox[1].f(); await flush();
      }
      ahora = fin; await flush();
    },
    async ocultar(oculto) { document.hidden = oculto; (docL.visibilitychange || []).forEach((f) => f()); await flush(); },
    flush,
  };
}

test('a playing video survives a hidden tab during the first seconds', async () => {
  const p = montar();
  await p.flush();
  p.video.currentTime = 0.5;
  await p.ocultar(true);
  await p.avanzar(9000);
  assert.equal(p.fase(), 'video', 'hiding the tab must not skip the video');
  assert.notEqual(p.raiz.dataset.video, 'fallo');
  await p.ocultar(false);
  assert.equal(p.video.paused, false, 'the video resumes when the tab returns');
  await p.avanzar(3000);
  assert.equal(p.fase(), 'video');
});

test('the rotate hint waits for a visible tab before opening the envelope', async () => {
  const p = montar();
  await p.flush();
  p.ids.saltar.emit('click');
  assert.equal(p.fase(), 'girar');
  await p.ocultar(true);
  await p.avanzar(10000);
  assert.equal(p.fase(), 'girar', 'the envelope must not open while nobody is looking');
  await p.ocultar(false);
  await p.avanzar(2500);
  assert.notEqual(p.fase(), 'girar');
});

test('blocked autoplay falls back to the still image and the rotate hint', async () => {
  const p = montar({ autoplay: false });
  await p.flush();
  assert.equal(p.raiz.dataset.video, 'fallo');
  assert.equal(p.fase(), 'girar');
});

test('the full flow reaches the postcard, focuses its title and replays', async () => {
  const p = montar();
  await p.flush();
  p.ids.video.emit('ended');
  assert.equal(p.fase(), 'girar');
  await p.avanzar(2500);
  assert.equal(p.fase(), 'postal');
  assert.equal(p.ids.titulo.focused, 1);
  p.ids.repetir.emit('click');
  assert.equal(p.fase(), 'video');
  assert.equal(p.video.paused, false);
});

test('reduced motion goes straight to the postcard', async () => {
  const p = montar({ reducido: true });
  await p.flush();
  assert.equal(p.fase(), 'postal');
});

test('only the visible phase can take keyboard focus', async () => {
  const p = montar();
  await p.flush();
  const estado = () => ({ escena: p.sel['.escena'].inert, girar: p.sel['.girar'].inert, postal: p.ids.postal.inert });
  assert.deepEqual(estado(), { escena: false, girar: true, postal: true }, 'video phase');
  p.ids.saltar.emit('click');
  assert.deepEqual(estado(), { escena: false, girar: false, postal: true }, 'rotate phase');
  await p.avanzar(2500);
  assert.deepEqual(estado(), { escena: true, girar: true, postal: false }, 'postcard phase');
  const html = read();
  assert.match(html, /<div class="girar"[^>]*\binert\b/, 'rotate overlay starts inert before the script runs');
  assert.match(html, /<article class="postal"[^>]*\binert\b/, 'postcard starts inert before the script runs');
});

test('postcard shows the event dates and places the event in the store, not in the park', () => {
  const html = read();
  assert.ok(html.includes('<dd>Del 13 al 22 de noviembre</dd>'), 'postcard must show the event dates');
  assert.ok(html.includes('<dd>Por confirmar</dd>'), 'the time stays marked as pending');
  assert.ok(html.includes('<dd>Tienda Somos Loja</dd>'), 'the event happens in the store');
  assert.ok(!html.includes('query=Parque+Central'), 'no map link may point at the park');
  assert.ok(html.includes('unas 25 marcas de café'), 'the event has about 25 brands, never the 50 of the store');
  assert.ok(html.includes('<dd>José Antonio Eguiguren y Bernardo Valdivieso, frente al Parque Central</dd>'), 'postcard must show the store address');
  assert.match(html, /href="https:\/\/www\.google\.com\/maps\/search\/\?api=1&amp;query=TIENDA\+SOMOS\+LOJA\+2Q3X%2BGC\+Loja"/, 'map must point at the store');
});

test('an opening tap unlocks sound, which can be muted and remembered', () => {
  const html = read();
  assert.match(html, /irA\('inicio'/, 'there must be an opening phase');
  assert.match(html, /id="abrir-postal"/);
  assert.match(html, /Toca para abrirla/);
  assert.match(html, /video\.muted = !sonidoActivo/, 'the sound preference decides whether the video is muted');
  assert.match(html, /id="sonido"[^>]*aria-pressed/, 'a mute toggle must expose its state');
  assert.match(html, /localStorage/, 'the mute choice must be remembered');
});

test('opening sounds exist and the rotate hint shows over the frozen last frame', () => {
  const html = read();
  const sonidos = [...html.matchAll(/'(recursos\/sonido\/[a-z-]+\.mp3)'/g)].map((m) => m[1]);
  assert.ok(sonidos.length >= 3, 'expected tap, flap and postcard sounds');
  for (const ref of sonidos) assert.ok(existsSync(join(pageDir, ref)), `missing ${ref}`);
  const fin = Number(html.match(/FIN_ANIMACION\s*=\s*([\d.]+)/)[1]);
  assert.ok(fin >= 9, 'the rotate hint must wait until Alforjita finishes speaking and her animation ends');
});

test('the page waits on the opening screen and the tap starts the video with sound', async () => {
  const p = montar({ abrir: false });
  await p.flush();
  assert.equal(p.fase(), 'inicio');
  assert.equal(p.video.paused, true, 'nothing plays before the tap');
  assert.equal(p.sel['.inicio'].inert, false, 'the tap button can take focus');
  assert.equal(p.ids.sonido.hidden, undefined, 'the mute toggle stays as authored until the tap');
  p.ids['abrir-postal'].emit('click');
  await p.flush();
  assert.equal(p.fase(), 'video');
  assert.equal(p.video.paused, false);
  assert.equal(p.video.muted, false, 'the tap unlocks the soundtrack');
  assert.equal(p.ids.sonido.hidden, false);
  assert.equal(p.sel['.inicio'].inert, true);
});

test('the mute toggle silences the video and exposes its state', async () => {
  const p = montar();
  await p.flush();
  p.ids.sonido.emit('click');
  assert.equal(p.video.muted, true);
  assert.equal(p.ids.sonido['aria-pressed'], 'false');
  p.ids.sonido.emit('click');
  assert.equal(p.video.muted, false);
  assert.equal(p.ids.sonido['aria-pressed'], 'true');
});

test('reduced motion skips the opening screen too', async () => {
  const p = montar({ reducido: true, abrir: false });
  await p.flush();
  assert.equal(p.fase(), 'postal');
});

test('postal offers a WhatsApp redeem link with a per-device code, plus store and map links', () => {
  const html = read();
  assert.match(html, /id="canjear"[^>]*href="https:\/\/wa\.me\/593962947777/);
  assert.match(html, /id="codigo-postal"/);
  assert.match(html, /'LOJA-'/);
  assert.match(html, /href="\.\.\/\.\.\/#tienda"/);
  assert.match(html, />Mapa del evento/);
});

test('the postcard ends with the store social links', () => {
  const html = read();
  const redes = html.slice(html.indexOf('class="postal__redes"'));
  for (const url of ['https://www.instagram.com/tiendasomosloja/', 'https://www.facebook.com/share/1E2P1Ln8Uq/', 'https://www.tiktok.com/@tiendasomosloja']) {
    assert.ok(redes.includes(`href="${url}"`), `missing social link ${url}`);
  }
  assert.ok(html.indexOf('class="postal__redes"') > html.indexOf('class="postal__pie"'), 'social links sit below the invitation buttons');
});
