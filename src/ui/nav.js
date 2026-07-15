/**
 * Nav behaviour:
 *   • Smooth-scroll to in-page targets (offset by the fixed header). External
 *     links (http / mailto) behave normally.
 *   • Hamburger menu: slide-in panel holding overflow items (desktop) and all
 *     items (mobile). Toggles open/close, closes on link click / Esc / outside.
 *   • Scroll-spy: highlight the active section's link (inline + menu).
 * Runs after render.js has built the nav.
 */
export function initNav() {
  const header = document.querySelector('.nav');
  const menu = document.querySelector('[data-nav-menu]');
  const burger = document.querySelector('[data-nav-burger]');
  const offset = () => (header?.offsetHeight ?? 64) + 10;

  const closeMenu = () => {
    menu?.classList.remove('is-open');
    menu?.setAttribute('aria-hidden', 'true');
    burger?.setAttribute('aria-expanded', 'false');
  };
  const openMenu = () => {
    menu?.classList.add('is-open');
    menu?.setAttribute('aria-hidden', 'false');
    burger?.setAttribute('aria-expanded', 'true');
  };

  // Smooth scroll for every in-page nav link (inline + menu).
  document.querySelectorAll('[data-nav-link]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('#')) return;            // external — leave default
    a.addEventListener('click', (e) => {
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      const y = target.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.replaceState(null, '', href);
    });
  });

  // Hamburger toggle + dismissals.
  burger?.addEventListener('click', () =>
    menu?.classList.contains('is-open') ? closeMenu() : openMenu());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', (e) => {
    if (!menu?.classList.contains('is-open')) return;
    if (menu.contains(e.target) || burger?.contains(e.target)) return;
    closeMenu();
  });

  // Scroll-spy across inline + menu links that point at a section.
  const linkFor = (id) =>
    document.querySelectorAll(`[data-nav-link][href="#${id}"]`);
  const inPage = [...document.querySelectorAll('[data-nav-link]')]
    .filter((a) => (a.getAttribute('href') || '').startsWith('#'));
  const setActive = (id) => {
    inPage.forEach((l) => l.classList.remove('is-active'));
    linkFor(id).forEach((l) => l.classList.add('is-active'));
  };
  const ids = [...new Set(inPage.map((a) => a.getAttribute('href').slice(1)))];
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); }),
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );
  ids.forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
}
