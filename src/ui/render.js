/**
 * Renders content from portfolio.config.js (via data/content.js) into the
 * static HTML shell. Only module that touches innerHTML.
 */
import { profile, socials, skills, projects, theme, sections, customSections, navbar } from '../data/content.js';
import { techIcons } from '../data/tech-icons.js';

const $ = (sel, root = document) => root.querySelector(sel);

// Resilient icon lookup: matches despite ".js", spaces or case differences
// (so 'React.js' finds the 'React' icon, 'Tailwind' finds 'Tailwind CSS', …).
const norm = (s) => s.toLowerCase().replace(/\.js\b/g, '').replace(/[^a-z0-9]/g, '');
const iconIndex = Object.fromEntries(
  Object.entries(techIcons).map(([k, v]) => [norm(k), v])
);
const lookupIcon = (name) => techIcons[name] || iconIndex[norm(name)];

/** Push the config's theme colours into CSS custom properties. */
export function applyTheme() {
  const r = document.documentElement.style;
  r.setProperty('--bg', theme.background);
  r.setProperty('--neon', theme.accent);
  r.setProperty('--neon-bright', theme.accentBright);
  r.setProperty('--neon-deep', theme.accentDeep);
  r.setProperty('--text', theme.text);
  r.setProperty('--muted', theme.muted);
}

export function renderContent() {
  applyTheme();

  // Hero title → per-character spans for the reveal
  const titleEl = $('[data-hero-title]');
  titleEl.setAttribute('aria-label', profile.name);
  titleEl.innerHTML = profile.name
    .split('')
    .map((ch) => (ch === ' '
      ? '<span class="char">&nbsp;</span>'
      : `<span class="char">${ch}</span>`))
    .join('');

  $('.hero__eyebrow').textContent = profile.role;
  $('.hero__tagline').textContent = profile.tagline;

  // About
  $('[data-about]').textContent = profile.about;
  $('[data-location]').textContent = profile.location;

  // Skills → 3D tech symbols
  $('[data-skills]').innerHTML = skills.map((name) => {
    const icon = lookupIcon(name);
    const glyph = icon
      ? `<svg class="tech__icon" viewBox="${icon.viewBox}" style="--brand:${icon.hex}"
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <path d="${icon.path}" fill="currentColor"/>
         </svg>`
      : '<span class="tech__dot"></span>';
    return `
      <li class="tech" data-tilt>
        <div class="tech__inner">
          ${glyph}
          <span class="tech__name">${name}</span>
        </div>
      </li>`;
  }).join('');

  // GitHub wordmark — per-letter spans inside a tilt wrapper so it can
  // react to the cursor (whole-word 3D tilt) and per-letter hover lift.
  const wm = $('[data-wordmark]');
  wm.href = profile.githubUrl;
  wm.target = '_blank';
  wm.rel = 'noopener';
  const chars = profile.githubUsername
    .split('')
    .map((ch) => (ch === ' '
      ? '<span class="wm-char">&nbsp;</span>'
      : `<span class="wm-char">${ch}</span>`))
    .join('');
  $('[data-wordmark-text]').innerHTML = `<span class="wordmark__tilt">${chars}</span>`;

  // Work
  $('[data-projects]').innerHTML = projects.map((p) => `
    <article class="project" data-reveal>
      ${p.preview
        ? `<a class="project__media" href="${p.url}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">
             <img src="${p.preview}" alt="${p.name} preview" loading="lazy" decoding="async" />
           </a>`
        : `<div class="project__media project__media--ph" aria-hidden="true"><span>${p.name}</span></div>`}
      <div class="project__body">
        <div class="project__head">
          <h3 class="project__name">
            <a href="${p.url}" target="_blank" rel="noopener">${p.name} <span class="arrow">&#8599;</span></a>
          </h3>
          <p class="project__tagline">${p.tagline}</p>
        </div>
        <p class="project__desc">${p.description}</p>
        <div class="project__tags">${p.tags.map((t) => `<span>${t}</span>`).join('')}</div>
        <div class="project__links">
          ${p.hasLive ? `<a href="${p.live}" target="_blank" rel="noopener">Live demo &#8599;</a>` : ''}
          <a href="${p.repo}" target="_blank" rel="noopener">Source &#8599;</a>
        </div>
      </div>
    </article>`).join('');

  // Contact
  const mail = $('[data-contact-mail]');
  mail.textContent = profile.email;
  mail.href = `mailto:${profile.email}`;

  $('[data-socials]').innerHTML = socials.map((s) => `
    <li>
      <a href="${s.url}" target="_blank" rel="noopener">
        ${s.label}<span class="handle">${s.handle}</span>
      </a>
    </li>`).join('');

  $('[data-year]').textContent = new Date().getFullYear();

  renderSections();
}

/**
 * Applies section renames from config, injects any custom sections, then
 * rebuilds the nav and renumbers the section indices from the live DOM order.
 */
function renderSections() {
  // 1) Rename built-in sections (heading + nav label).
  ['about', 'skills', 'work', 'contact'].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const cfg = sections[id] || {};
    const titleEl = sec.querySelector('.section__title');
    if (titleEl && cfg.title) titleEl.textContent = cfg.title;
    sec.dataset.label = cfg.label || id;
  });

  // 2) Inject custom sections (kept in listed order after their target).
  customSections.forEach((cs) => {
    if (!cs || !cs.id) return;
    const sec = document.createElement('section');
    sec.className = 'section';
    sec.id = cs.id;
    sec.dataset.label = cs.label || cs.title || cs.id;
    sec.dataset.custom = cs.after || 'work';
    sec.innerHTML = `
      <p class="section__index"></p>
      <h2 class="section__title" data-reveal>${cs.title || ''}</h2>
      <div class="section__prose" data-reveal>${cs.body || ''}</div>`;

    let ref = document.getElementById(cs.after || 'work');
    // Chain multiple customs that share the same target, preserving order.
    while (ref && ref.nextElementSibling &&
           ref.nextElementSibling.dataset.custom === (cs.after || 'work')) {
      ref = ref.nextElementSibling;
    }
    if (ref) ref.insertAdjacentElement('afterend', sec);
    else document.getElementById('contact')?.before(sec);
  });

  // 3) Renumber indices from the final DOM order.
  const secs = [...document.querySelectorAll('main section[id]')]
    .filter((s) => !s.classList.contains('hero'));
  secs.forEach((s, i) => {
    const idx = s.querySelector('.section__index');
    if (idx) idx.textContent = String(i + 1).padStart(2, '0');
  });

  buildNavbar(secs);
}

/**
 * Builds the navbar. Uses config.navbar.items when provided (explicit order,
 * names & targets); otherwise auto-derives from the page sections. Items past
 * `maxVisible` (default 4) overflow into the hamburger menu, which also holds
 * every item on mobile.
 */
function buildNavbar(secs) {
  const items = (Array.isArray(navbar.items) && navbar.items.length)
    ? navbar.items.map((it) => normNavItem(it.label, it.target))
    : secs.map((s) => normNavItem(s.dataset.label || s.id, s.id));

  const maxVisible = Number(navbar.maxVisible) > 0 ? Number(navbar.maxVisible) : 4;

  $('[data-nav-links]').innerHTML =
    items.map((it, i) =>
      navLinkHTML(it, `nav__link${i >= maxVisible ? ' nav__link--overflow' : ''}`)).join('') +
    `<button class="nav__burger" data-nav-burger aria-label="Open menu" aria-expanded="false">
       <span></span><span></span><span></span>
     </button>`;

  $('[data-nav-menu]').innerHTML =
    items.map((it) => navLinkHTML(it, 'nav__menu-link')).join('');

  document.querySelector('.nav')
    .toggleAttribute('data-has-overflow', items.length > maxVisible);
}

// target: a section id / '#id' → in-page link; a URL or mailto: → external.
function normNavItem(label, target) {
  const t = String(target || '').trim();
  const external = /^https?:\/\//i.test(t) || t.startsWith('mailto:');
  const href = external ? t : `#${t.replace(/^#/, '')}`;
  return { label: label || t, href, external };
}

function navLinkHTML(it, cls) {
  const attrs = it.external ? ' target="_blank" rel="noopener"' : '';
  return `<a class="${cls}" href="${it.href}"${attrs} data-nav-link>${it.label}</a>`;
}
