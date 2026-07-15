/**
 * All GSAP / ScrollTrigger wiring lives here. It reads the DOM that
 * render.js built and (optionally) drives the 3D scene through the small
 * API that hero-scene.js exposes — neither knows about the other's guts.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(heroScene) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return; // CSS already shows everything; skip motion.

  // 1) Hero title — staggered character rise on load.
  gsap.from('.hero__title .char', {
    yPercent: 120,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.04,
    delay: 0.2,
  });

  gsap.from('.hero__eyebrow, .hero__tagline, .hero__cta', {
    y: 24,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.6,
  });

  // Looping "scroll" hint at the bottom of the hero.
  gsap.to('.hero__scroll', {
    y: 8,
    opacity: 0.35,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // 2) Scroll drives the 3D crystal: as the hero scrolls away, feed a
  //    0→1 progress value straight into the Three.js scene.
  if (heroScene) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1, // smooth, ties motion to scrollbar
      onUpdate: (self) => heroScene.setScrollProgress(self.progress),
    });
  }

  // 3) Generic reveal for every [data-reveal] element as it enters view.
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  // 4) Section index numbers drift subtly for depth.
  gsap.utils.toArray('.section__index').forEach((el) => {
    gsap.from(el, {
      x: -20,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: { trigger: el, start: 'top 90%' },
    });
  });

  // 5) 3D tech symbols — staggered pop-in as the Skills grid enters.
  gsap.from('.tech', {
    opacity: 0,
    y: 40,
    rotateX: -40,
    duration: 0.7,
    ease: 'back.out(1.6)',
    stagger: { each: 0.06, from: 'start' },
    scrollTrigger: { trigger: '.skills', start: 'top 80%' },
  });

  // 6) GitHub wordmark — slides in with a skew "morph" that settles, then
  //    a gentle scrub-parallax so it drifts as you scroll past it.
  const wm = document.querySelector('.wordmark__text');
  if (wm) {
    gsap.from(wm, {
      xPercent: -60,
      skewX: 18,
      opacity: 0,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.wordmark', start: 'top 88%' },
    });
    gsap.to(wm, {
      xPercent: 6,
      ease: 'none',
      scrollTrigger: {
        trigger: '.wordmark',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }
}
