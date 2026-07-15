/**
 * Adapter: shapes portfolio.config.js into the structures the UI expects.
 * You normally DON'T edit this — edit ../../portfolio.config.js instead.
 */
import { config } from '../../portfolio.config.js';

export const profile = {
  ...config.base,
  githubUrl: socialUrl(config.social.github) || `https://github.com/${config.base.githubUsername}`,
};

export const theme = config.theme;
export const options = config.options;
export const skills = config.skills;
export const sections = config.sections || {};
export const customSections = config.customSections || [];
export const navbar = config.navbar || {};

// Build the socials list from whichever links are filled in.
const SOCIAL_LABELS = {
  github:   { label: 'GitHub',   handle: (u) => '@' + tail(u) },
  linkedin: { label: 'LinkedIn', handle: (u) => 'in/' + tail(u) },
  devto:    { label: 'dev.to',   handle: (u) => '@' + tail(u) },
  reddit:   { label: 'Reddit',   handle: (u) => 'u/' + tail(u) },
  discord:  { label: 'Discord',  handle: () => config.base.githubUsername },
  email:    { label: 'Email',    handle: (u) => u },
};

// Each social entry may be a plain URL string (label + handle auto-derived)
// OR an object { url, handle, label } to override the displayed text.
export const socials = Object.entries(config.social)
  .map(([key, val]) => {
    const isObj = val && typeof val === 'object';
    const url = socialUrl(val);
    if (!url) return null;                         // '' / missing → hidden
    const def = SOCIAL_LABELS[key];
    return {
      key,
      label: (isObj && val.label) || def?.label || key,
      handle: (isObj && val.handle) || def?.handle(url) || url,
      url: key === 'email' ? `mailto:${url}` : url,
    };
  })
  .filter(Boolean);

// Normalise projects: pick the best link, keep repo as secondary, and derive
// a preview image when the config doesn't supply one.
export const projects = config.projects.map((p) => ({
  ...p,
  url: p.live || p.repo,
  hasLive: Boolean(p.live),
  preview: previewFor(p),
}));

/**
 * Preview image (no screenshots to take yourself):
 *   1. If the project sets `preview`, use it (local path or any URL).
 *   2. Else if it has a live site, auto-screenshot it (WordPress mShots —
 *      free, no key, browser-rendered). Shows the actual live site.
 *   3. Else fall back to the repo's GitHub social card.
 *      NOTE: GitHub bakes the owner avatar into that card and there's no
 *      way to strip it via URL. To hide it: use a generic avatar, OR set a
 *      custom "Social preview" image in the repo Settings (replaces the whole
 *      card). To skip GitHub entirely, set the project's `preview` to your own
 *      image, or return '' here to use the themed name placeholder instead.
 *   4. If there's no repo either, '' → themed name placeholder.
 */
function previewFor(p) {
  if (p.preview) return p.preview;
  if (p.live) {
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(p.live)}?w=1280&h=720`;
  }
  const m = (p.repo || '').match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/|$)/);
  return m ? `https://opengraph.githubassets.com/1/${m[1]}/${m[2]}` : '';
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

function tail(url) {
  return url.replace(/\/+$/, '').split('/').pop().replace(/^@/, '');
}

// A social entry is either a plain URL string or { url, handle, label }.
function socialUrl(val) {
  return (val && typeof val === 'object' ? val.url : val) || '';
}
