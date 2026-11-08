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

test('video plays inline, muted and autoplaying with a poster and a skip control', () => {
  const html = read();
  const video = html.match(/<video[^>]*>/)?.[0] ?? '';
  for (const attr of ['muted', 'playsinline', 'autoplay', 'poster=']) assert.ok(video.includes(attr), `video needs ${attr}`);
  assert.match(html, /id="saltar"/);
  assert.match(html, /Te llegó una postal/);
});

test('rotate step asks to turn the phone and lets locked phones open anyway', () => {
  const html = read();
  assert.match(html, /\(orientation: landscape\)/);
  assert.match(html, /Gira tu teléfono/);
  assert.match(html, /id="abrir-aqui"/);
});

test('postcard keeps the QR stamp contract and the demo notice', () => {
  const html = read();
  assert.match(html, /class="[^"]*sello-qr/);
  assert.match(html, /QR aún no activo/);
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

test('tablet landing and floating card point to the postal page', () => {
  const landing = readFileSync(new URL('../absent-apogee/public/evento/index.html', import.meta.url), 'utf8');
  assert.match(landing, /COURIER_INVITATION_URL = "\.\/postal\/index\.html"/);
  const flotante = readFileSync(new URL('../absent-apogee/src/components/EventoFlotante.astro', import.meta.url), 'utf8');
  assert.match(flotante, /evento\/postal\/index\.html/);
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
