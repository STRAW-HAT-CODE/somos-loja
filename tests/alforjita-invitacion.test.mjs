import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const standalone = new URL('../invitacion/', import.meta.url);
const root = existsSync(new URL('index.html', standalone)) ? standalone : new URL('../design/alforjita-invitacion/', import.meta.url);
const html = () => readFileSync(new URL('index.html', root), 'utf8');

test('the delivery gives walking and presentation their own readable beats', () => {
  const timing=html().match(/<script id="delivery-timing">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(timing,'one shared delivery timeline exists');
  const t=vm.runInNewContext(timing+';DELIVERY_TIMING');
  assert.equal(t.walk,2.2);
  assert.ok(t.zoom-t.hand>=.5,'hold the offered postcard before moving closer');
  assert.ok(t.finish>=8 && t.finish<=9.5);
  assert.ok(t.zoomEnd<t.openEnd && t.cardOutEnd<t.grow && t.growEnd<t.finish);
  assert.equal(t.walkProgress(0),0);
  assert.equal(t.walkProgress(t.walk),1);
  assert.ok(t.endZ>t.startZ,'the character actually walks toward the visitor');
  for(let n=1;n<=5;n++) {
    const at=t.stepTime(n);
    assert.ok(at>0 && at<t.walk);
    assert.ok(Math.abs(t.walkProgress(at)*t.distance-n*t.stride/2)<.00001,'audio step matches foot phase');
  }
});

test('Alforjita and the Somos Loja entrance replace the generic courier and cabin', () => {
  const source = html();
  for (const feature of ['drawAlforjitaHat', 'drawAlforjitaFlower', 'ROBE_LIME', 'ROBE_FUCHSIA', 'SHOP_LETTERS', 'SOMOS LOJA']) assert.ok(source.includes(feature), feature);
  assert.doesNotMatch(source, /Roof ridge|Striped awning/);
  assert.match(source, /Beneficio por confirmar/);
});

test('the reference satchel is open, rounded and stitched, retaining letter identity', () => {
  const source=html();
  for(const feature of ['SATCHEL_BODY','drawSatchel','AIRMAIL_RED','METAL_PLATE','drawLetterArt']) assert.ok(source.includes(feature),feature);
  assert.doesNotMatch(source,/at\(BOX,GOLD,0,-\.015/);
});

test('two letters fall on separate walking beats and settle without vanishing; the third stays in the bag', () => {
  const code=html().match(/<script id="delivery-timing">([\s\S]*?)<\/script>/)[1];
  const t=vm.runInNewContext(code+';DELIVERY_TIMING');
  assert.ok(t.letterRelease(0)<t.letterRelease(1));
  for(const index of [0,1]) {
    const release=t.letterRelease(index);
    assert.ok(release>0 && release<t.walk);
    assert.equal(t.paperMotion(index,release-.001,1).phase,'in-bag');
    assert.equal(t.paperMotion(index,release,1).y,1);
    const falling=t.paperMotion(index,release+.25,1);
    assert.equal(falling.phase,'falling');
    const landed=t.paperMotion(index,30,1);
    assert.equal(landed.phase,'landed');
    assert.equal(landed.y,.075);
    assert.equal(landed.progress,1);
    assert.equal(t.paperMotion(index,60,1).elapsed,landed.elapsed);
  }
  assert.equal(t.paperMotion(2,60,1).phase,'in-bag');
});

test('Somos Loja uses freestanding extruded roof letters instead of the facade sign', () => {
  const source=html();
  assert.match(source,/function drawRoofSign\(/);
  assert.match(source,/const ROOF_SIGN_BASE=2\.98/);
  assert.match(source,/extrudeSignCell/);
  assert.match(source,/draw\(SHOP_LETTERS,TEAL/,'high-contrast teal letter faces');
  assert.match(source,/draw\(SHOP_LETTERS,GOLD/,'warm dimensional outline behind the letters');
  assert.doesNotMatch(source,/move\(\.03,1\.97,1\.075\)/);
});

test('delivery scripts parse and retain existing performance and accessibility safeguards', () => {
  const source = html();
  for (const match of source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!match[1].includes('x-shader')) new vm.Script(match[2]);
  }
  for (const feature of ['prefers-reduced-motion', 'document.hidden', 'enManoMatriz.set(top)', 'pedidoSonido', 'getContext(\'webgl\'', 'Math.min(window.devicePixelRatio || 1, 1.5)']) assert.ok(source.includes(feature), feature);
  for (const name of ['paso-1','paso-2','paso-3','paso-4','sobre-entrega','cafe-servido']) assert.ok(existsSync(new URL(`recursos/sonido/${name}.mp3`, root)));
  for (const match of source.matchAll(/(?:src|href)="(recursos\/[^"#]+)"/g)) assert.ok(existsSync(new URL(match[1], root)), match[1]);
  assert.doesNotMatch(source, /https?:\/\/[^'"\s]+\.(?:js|glb)/);
});

test('the real raw WebGL renderer draws finite poses at every delivery phase', () => {
  let badMatrices=0, draws=0, uploads=0, vertices;
  const gl=new Proxy({}, {get(_,key){
    if(typeof key==='string' && /^[A-Z0-9_]+$/.test(key)) return 1;
    if(key==='getShaderParameter'||key==='getProgramParameter') return ()=>true;
    if(key==='uniformMatrix4fv') return (_,__,matrix)=>{if(!matrix.every(Number.isFinite)) badMatrices++;};
    if(key==='drawArrays') return ()=>{draws++;};
    if(key==='bufferData') return (_,data)=>{uploads++;vertices=data;};
    return ()=>({});
  }});
  const sandbox={window:{devicePixelRatio:3},document:{getElementById:()=>({textContent:''})},Float32Array,Math};
  const code=html().match(/<script id="miniature">([\s\S]*?)<\/script>/)[1];
  const timing=html().match(/<script id="delivery-timing">([\s\S]*?)<\/script>/)?.[1]||'';
  const create=vm.runInNewContext(timing+'\n'+code+';createMiniature',sandbox);
  const canvas={clientWidth:390,clientHeight:844,getContext:()=>gl,addEventListener(){}};
  const scene=create(canvas,{onLost(){}});
  assert.equal(canvas.width,585);
  const beats=vm.runInNewContext(timing+';DELIVERY_TIMING');
  for(const camino of [0,.9,beats.walk,beats.hand-.3,beats.hand]) for(const zoom of [0,.5,1]) {
    scene.render({camino,zoom,funde:0,abre:.6,sale:.5,crece:.5,salto:.5,reloj:camino+zoom*2,rect:{w:358,h:600,cx:195,cy:422}});
  }
  assert.equal(badMatrices,0);
  assert.ok(draws>100);
  assert.equal(scene.frames(),15);
  assert.equal(uploads,1,'all geometry is uploaded only once, never per animation frame');
  assert.ok(vertices.length/6 < 100000,'character geometry stays within the explicit vertex budget');
  for(let i=0;i<vertices.length;i+=6) {
    for(let j=0;j<6;j++) assert.ok(Number.isFinite(vertices[i+j]));
    assert.ok(Math.abs(Math.hypot(vertices[i+3],vertices[i+4],vertices[i+5])-1)<.02);
  }
});

test('organic shapes use smooth normals, a continuous swept hat and restrained attached secondary motion', () => {
  const source=html();
  for(const part of ['smoothSurface','MODEL_SPHERE','HAT_LIME','HAT_PURPLE','pose.blink','pose.fabric','bagSway']) assert.ok(source.includes(part),part);
});

const served=new URL('../absent-apogee/public/evento/cartero/',import.meta.url);
test('main serves the same animation and preserves the illustrative inactive QR', {skip:!existsSync(new URL('index.html',served))},()=>{
  const publicHtml=readFileSync(new URL('index.html',served),'utf8');
  for(const id of ['delivery-timing','miniature','app']) {
    const pattern=new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`);
    assert.equal(publicHtml.match(pattern)?.[1],html().match(pattern)?.[1],id);
  }
  assert.match(publicHtml,/QR aún no activo/);
  assert.match(publicHtml,/loading="eager" fetchpriority="high"/);
  assert.ok(existsSync(new URL('recursos/qr-puerta-loja-mvp.png',served)));
  const datos=readFileSync(new URL('../absent-apogee/src/data/somos-loja.ts',import.meta.url),'utf8');
  assert.match(datos,/postal: '\/evento\/postal\/index\.html'/);
});

test('the served tablet links to the explicit invitation HTML supported by Astro dev', {skip:!existsSync(new URL('index.html',served))},()=>{
  const tablet=readFileSync(new URL('../absent-apogee/public/evento/index.html',import.meta.url),'utf8');
  assert.match(tablet,/COURIER_INVITATION_URL\s*=\s*["']\.\/postal\/index\.html["']/);
});
