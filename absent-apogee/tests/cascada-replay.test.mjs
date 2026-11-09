import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import pkg from 'gsap/dist/gsap.js';

const { gsap } = pkg;
const source = readFileSync(new URL('../src/scripts/cascada-taza.js', import.meta.url), 'utf8');
const opening = source.slice(source.indexOf("tl.fromTo('.cascada__grano-grande'"), source.indexOf("tl.fromTo('.cascada__polvo'"));

test('the large bean reappears after scrolling back, including refreshes', () => {
  const bean = { autoAlpha: 1, scale: 1, yPercent: 0, rotate: 0 };
  const tl = gsap.timeline({ paused: true });
  try {
    new Function('tl', 'bean', opening.replaceAll("'.cascada__grano-grande'", 'bean'))(tl, bean);
    for (let pass = 0; pass < 3; pass++) {
      tl.time(0.08);
      assert.equal(bean.autoAlpha, 1, `falling bean is visible on pass ${pass}`);
      tl.progress(1);
      assert.equal(bean.autoAlpha, 0, 'bean disappears when it breaks');
      tl.invalidate();
      tl.progress(0);
    }
  } finally {
    tl.kill();
    gsap.ticker.sleep();
  }
});

// Conservative square bounds include transparent image margins and rotation.
test('the starting bean fits inside the scene rather than crossing its top edge', () => {
  const initial = source.match(/tl\.set\('\.cascada__grano-grande', (\{[^}]+\})/)[1];
  const state = new Function(`return (${initial})`)();
  for (const [width,height] of [[360,640],[400,778],[430,932],[844,390],[1440,900]]) {
    const mobile=width<=760;
    const sceneHeight=height*(mobile?.72:1);
    const size=Math.min(height*(mobile?.34:.38),width*(mobile?.62:.54));
    const angle=Math.abs(state.rotate)*Math.PI/180;
    const halfBounds=size*state.scale*(Math.cos(angle)+Math.sin(angle))/2;
    const center=sceneHeight*.27+size*state.yPercent/100;
    assert(center-halfBounds>=0, `bean clipped at ${width}×${height}`);
  }
});
