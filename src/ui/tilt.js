/**
 * Lightweight 3D pointer-tilt for [data-tilt] cards. No dependencies,
 * uses rAF-free transforms (cheap) and cleans up on pointer leave.
 * Disabled under reduced-motion or on touch (no hover).
 */
export function initTilt() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const noHover = window.matchMedia('(hover: none)').matches;
  if (reduce || noHover) return;

  const MAX = 16; // max degrees of tilt

  document.querySelectorAll('[data-tilt]').forEach((card) => {
    const inner = card.querySelector('.tech__inner') || card;

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;   // -0.5 → 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform =
        `rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg) translateZ(18px)`;
    });

    card.addEventListener('pointerleave', () => {
      inner.style.transform = '';
    });
  });
}
