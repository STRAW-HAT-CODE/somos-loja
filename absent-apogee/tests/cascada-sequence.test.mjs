import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import pkg from 'gsap/dist/gsap.js';
import { iniciarCascada } from '../src/scripts/cascada-taza.js';
const { gsap } = pkg;

for (const [width, height] of [[360,640],[400,778],[430,932],[844,390],[1440,900]]) {
  test(`cascade replays all phases at ${width}×${height}`, () => {
    const saved = Object.fromEntries(['document','innerWidth','addEventListener'].map(k => [k,globalThis[k]]));
    const targets = new Map();
    const grains = [];
    const target = key => {
      if (!targets.has(key)) targets.set(key,{opacity:0,autoAlpha:0,scale:1,x:0,y:0,yPercent:0,rotate:0});
      return targets.get(key);
    };
    const cup = {offsetWidth:width*.66,offsetHeight:width*.44,offsetTop:0,parentElement:{offsetTop:height*.45}};
    const section = {classList:{add(){}},querySelector: s => s === '.cascada__escena' ? {offsetHeight:height*.72} : s === '.cascada__taza' ? cup : {appendChild:g=>grains.push(g)},querySelectorAll:()=>[]};
    globalThis.document = {querySelector:()=>section,createElement:()=>({opacity:0,autoAlpha:0,scale:1,x:0,y:0,rotate:0,style:{setProperty(){}}})};
    globalThis.innerWidth=width;
    globalThis.addEventListener=()=>{};
    let tl, config;
    const adapter = {
      utils:{toArray:s=>s==='.cascada__marca'?[]:grains},
      timeline(options) {
        config=options.scrollTrigger;
        tl=gsap.timeline({paused:true,defaults:options.defaults});
        const proxy=new Proxy(tl,{get(obj,key){
          if (['to','fromTo','set'].includes(key)) return (selector,...args)=>{obj[key](typeof selector==='string'?target(selector):selector,...args);return proxy;};
          return Reflect.get(obj,key);
        }});
        return proxy;
      }
    };
    try {
      iniciarCascada(adapter,{refresh(){}});
      assert.equal(config.start,'top 85%','begin as the scene enters below the preceding caption');
      const snapshot = () => [...targets.values(),...grains].map(({autoAlpha,opacity,scale,x,y})=>({autoAlpha,opacity,scale,x,y}));
      const moments=[.08,.20,.35,.68,.85,.97];
      const baseline=moments.map(time=>{
        tl.time(time);
        if(time===.35) assert(grains.filter(g=>g.opacity>.9 && g.scale>.3).length>=3, 'several falling beans must remain visible after the dust');
        if(time===.68) assert(target('.cascada__taza-granos').opacity>.5, 'filled-bean cup must be visible after the falling beans');
        if(time===.97) assert(target('.cascada__taza-cafe').opacity>.99, 'brewed-coffee cup must finish the sequence');
        return snapshot();
      });
      assert(target('.cascada__grano-grande').autoAlpha===0);
      assert(target('.cascada__texto').autoAlpha===1);
      for (const time of [...moments].reverse()) {
        tl.time(time);
        assert.deepEqual(snapshot(),baseline[moments.indexOf(time)],`reverse phase ${time}`);
      }
      for (let pass=0;pass<3;pass++) {
        config.onRefreshInit();tl.invalidate();tl.progress(0);
        moments.forEach((time,i)=>{tl.time(time);assert.deepEqual(snapshot(),baseline[i],`phase ${time} on replay ${pass}`);});
      }
    } finally {
      tl?.kill();gsap.ticker.sleep();
      for(const [key,value] of Object.entries(saved)) {if(value===undefined)delete globalThis[key];else globalThis[key]=value;}
    }
  });
}

test('only the decorative circle is removed, not the particle layer', () => {
  const component=readFileSync(new URL('../src/components/Cascada.astro',import.meta.url),'utf8');
  assert(!component.includes('cascada__onda'));
  assert(component.includes('cascada__polvo'));
  assert(component.includes('cascada__granitos'));
});
