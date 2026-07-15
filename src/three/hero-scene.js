/**
 * A single subtle 3D object: a faceted "crystal" that floats behind the
 * hero text and reacts to scroll + pointer. Deliberately minimal — one
 * geometry, one light rig, no textures, no post-processing — so it stays
 * cheap and on-brand (charcoal / gold / blue).
 *
 * Exposes a tiny API so the animation layer can drive it without knowing
 * anything about Three.js internals.
 */
import * as THREE from 'three';

// Neon sky-blue accent from the live site (#74bcdc) + a brighter tint.
const NEON = 0x74bcdc;
const NEON_BRIGHT = 0xa6dcf2;

export function createHeroScene(canvas) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, aspect(), 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,        // transparent — CSS charcoal shows through
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Cap DPR at 2 — retina looks identical past that but costs 2x+ pixels.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- The object -------------------------------------------------------
  const geometry = new THREE.IcosahedronGeometry(1.6, 0); // detail 0 = low poly
  const group = new THREE.Group();

  // Solid near-black core with a faint neon self-glow so it reads against
  // the pure-black background.
  const core = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0x05080a,
      emissive: NEON,
      emissiveIntensity: 0.12,
      metalness: 0.85,
      roughness: 0.3,
      flatShading: true,
    })
  );

  // Neon wireframe overlay — the signature element.
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(geometry),
    new THREE.LineBasicMaterial({ color: NEON, transparent: true, opacity: 0.9 })
  );

  // Faint glowing halo shell (slightly larger, additive) for the neon bloom.
  const halo = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.68, 0),
    new THREE.MeshBasicMaterial({
      color: NEON,
      transparent: true,
      opacity: 0.05,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
  );

  group.add(core, wire, halo);
  group.position.x = 1.6; // sit to the right of the hero text
  scene.add(group);

  // --- Lights (neon key + brighter neon rim) ----------------------------
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  const keyLight = new THREE.PointLight(NEON, 45, 20);
  keyLight.position.set(-4, 3, 4);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(NEON_BRIGHT, 30, 20);
  rimLight.position.set(4, -2, 3);
  scene.add(rimLight);

  // --- Interaction state ------------------------------------------------
  const pointer = { x: 0, y: 0 };
  const state = { scrollProgress: 0 }; // 0 at top → 1 further down page

  if (!reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    });
  }

  // --- Render loop (paused when tab hidden) -----------------------------
  const clock = new THREE.Clock();
  let running = true;

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();

    // Idle drift
    group.rotation.y += reduceMotion ? 0 : 0.0016;
    group.rotation.x = Math.sin(t * 0.4) * 0.15;

    // Neon "breathing" — pulse the glow and scale gently.
    const pulse = reduceMotion ? 0 : (Math.sin(t * 1.4) * 0.5 + 0.5);
    core.material.emissiveIntensity = 0.1 + pulse * 0.22;
    halo.material.opacity = 0.04 + pulse * 0.07;
    const breathe = 1 + pulse * 0.02;
    group.scale.setScalar(breathe);

    // Scroll pushes the crystal back and spins it — set by GSAP.
    group.rotation.z = state.scrollProgress * Math.PI;
    group.position.z = -state.scrollProgress * 4;
    wire.material.opacity = (0.9 - state.scrollProgress * 0.6);

    // Subtle pointer parallax on the camera
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-pointer.y * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { clock.start(); tick(); }
  });

  window.addEventListener('resize', onResize);
  function onResize() {
    camera.aspect = aspect();
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  tick();

  // Public API for the animation layer.
  return {
    /** 0 → 1, typically bound to a ScrollTrigger on the hero. */
    setScrollProgress(p) { state.scrollProgress = p; },
    group,
    renderer,
  };
}

function aspect() { return window.innerWidth / window.innerHeight; }
