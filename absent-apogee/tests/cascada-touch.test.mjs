import { test } from 'node:test';
import assert from 'node:assert/strict';
import pkg from 'gsap/dist/gsap.js';
import { iniciarCascada } from '../src/scripts/cascada-taza.js';
const { gsap } = pkg;

// One swipe on a phone must play the whole cascade by time, not stop wherever the finger stopped.
test('on touch screens the cascade plays to its final frame on its own and replays after scrolling back', () => {
  const saved = Object.fromEntries(['document','innerWidth','addEventListener','matchMedia'].map(k => [k,globalThis[k]]));
  const targets = new Map();
  const grains = [];
  const target = key => {
    if (!targets.has(key)) targets.set(key,{opacity:0,autoAlpha:0,scale:1,x:0,y:0,yPercent:0,rotate:0});
    return targets.get(key);
  };
  const cup = {offsetWidth:260,offsetHeight:170,offsetTop:0,parentElement:{offsetTop:380}};
  const section = {classList:{add(){}},querySelector: s => s === '.cascada__escena' ? {offsetHeight:600} : s === '.cascada__taza' ? cup : {appendChild:g=>grains.push(g)},querySelectorAll:()=>[]};
  globalThis.document = {querySelector:()=>section,createElement:()=>({opacity:0,autoAlpha:0,scale:1,x:0,y:0,rotate:0,style:{setProperty(){}}})};
  globalThis.innerWidth = 390;
  globalThis.addEventListener = () => {};
  globalThis.matchMedia = query => ({ matches: /coarse|max-width/.test(query) });
  let proxy, real, timelineOptions, trigger;
  const playback = () => gsap.getTweensOf(real).at(-1);
  const adapter = {
    utils:{toArray:s=>s==='.cascada__marca'?[]:grains},
    timeline(options) {
      timelineOptions = options;
      const tl = real = gsap.timeline({paused:true,defaults:options.defaults});
      proxy = new Proxy(tl,{get(obj,key){
        if (['to','fromTo','set'].includes(key)) return (selector,...args)=>{obj[key](typeof selector==='string'?target(selector):selector,...args);return proxy;};
        const value = Reflect.get(obj,key);
        return typeof value === 'function' ? value.bind(obj) : value;
      }});
      return proxy;
    }
  };
  const scrollTrigger = { refresh(){}, create(config){ trigger = config; return config; } };
  try {
    iniciarCascada(adapter, scrollTrigger);
    assert.equal(timelineOptions.scrollTrigger, undefined, 'touch playback must not be scrubbed by the finger');
    assert.equal(trigger.start, 'top 85%');
    assert.equal(proxy.progress(), 0, 'nothing plays before the section arrives');

    for (let pass = 0; pass < 2; pass++) {
      trigger.onEnter();
      const tween = playback();
      assert(tween, `entering starts a timed playback on pass ${pass}`);
      assert(tween.duration() >= 2 && tween.duration() <= 4, `playback lasts a readable 2–4 s, got ${tween.duration()}`);
      tween.progress(1);
      assert.equal(proxy.progress(), 1, 'one swipe reaches the final frame');
      assert(target('.cascada__taza-cafe').opacity > 0.99, 'brewed coffee is served');
      assert.equal(target('.cascada__texto').autoAlpha, 1, 'the headline is shown');
      assert.equal(target('.cascada__grano-grande').autoAlpha, 0);

      trigger.onLeaveBack();
      assert.equal(proxy.progress(), 0, 'scrolling back above the section resets it');
      assert.equal(target('.cascada__grano-grande').autoAlpha, 1, 'the large bean is ready to fall again');
    }

    // A width-change refresh in the middle of the show keeps going instead of freezing or restarting.
    trigger.onEnter();
    playback().progress(0.5);
    const mid = proxy.progress();
    assert(mid > 0 && mid < 1);
    trigger.onRefreshInit();
    trigger.onRefresh({ progress: 0.3, isActive: true });
    assert(Math.abs(proxy.progress() - mid) < 0.02, 'refresh keeps the current frame');
    playback().progress(1);
    assert.equal(proxy.progress(), 1, 'and still finishes after the refresh');
  } finally {
    gsap.getTweensOf(real ?? {}).forEach(t => t.kill());
    real?.kill();
    gsap.ticker.sleep();
    for (const [key,value] of Object.entries(saved)) { if (value === undefined) delete globalThis[key]; else globalThis[key] = value; }
  }
});
