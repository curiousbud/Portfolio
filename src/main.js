import './styles/main.css';
import { renderContent } from './ui/render.js';
import { initNav } from './ui/nav.js';
import { initTilt } from './ui/tilt.js';
import { initAnimations } from './animations/scroll.js';
import { options } from './data/content.js';

// Flag the doc so pre-animation CSS can hide [data-reveal] elements only
// when JS is actually running (progressive enhancement).
document.documentElement.classList.add('js-anim');

// 1) Build the DOM from data first — everything else reads it.
renderContent();

// 2) Nav works immediately (doesn't wait for the 3D chunk to load).
initNav();

// 2) Decide whether this device should run WebGL at all.
//    Skip on very small screens / low core counts / reduced-motion to
//    protect the "static & fast" promise.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canDo3D =
  options.enable3DCrystal &&
  !reduceMotion &&
  window.innerWidth > 720 &&
  (navigator.hardwareConcurrency ?? 4) >= 4;

async function boot() {
  let heroScene = null;

  initTilt();

  if (canDo3D) {
    // Lazy-load Three.js + the scene so the ~150KB chunk never blocks
    // first paint. If it fails (blocked WebGL, etc.) the site is unaffected.
    try {
      const { createHeroScene } = await import('./three/hero-scene.js');
      const canvas = document.getElementById('webgl');
      heroScene = createHeroScene(canvas);
    } catch (err) {
      console.warn('3D disabled:', err);
    }
  }

  initAnimations(heroScene);
}

// Kick off after first paint so text is instantly visible.
if (document.readyState === 'complete') boot();
else window.addEventListener('load', boot);
