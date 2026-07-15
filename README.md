# Areeb Khan

**Live → [areebkhan-portfolio.netlify.app](https://areebkhan-portfolio.netlify.app/)**
· Source → [github.com/curiousbud/Portfolio](https://github.com/curiousbud/Portfolio)

A static, 3D-enhanced minimalist portfolio. Vanilla JS on Vite, GSAP for
scroll motion, Three.js for the hero crystal, CSS-3D for the tech symbols.
Pure black with neon `#74bcdc`, JetBrains Mono self-hosted.

Everything you'd want to change lives in **one file**: [`portfolio.config.js`](./portfolio.config.js).

> The previous hand-coded version of this site is preserved on the
> [`legacy-v1`](https://github.com/curiousbud/Portfolio/tree/legacy-v1) branch.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the production build
```

## ✏️ Edit everything in ONE file

All content, the navbar and every brand colour live in **`portfolio.config.js`**
at the project root — gitprofile-style. Change a value, save, done. You never
touch `src/` for normal edits. The file itself is heavily commented with
step-by-step recipes.

```js
base:           { name, role, githubUsername, tagline, about, location, email }
social:         { github: { url, handle }, linkedin, devto, reddit, discord, email }
skills:         ['JavaScript', 'React.js', ...]      // names match src/data/tech-icons.js
projects:       [ { name, tagline, description, tags, live, repo, preview? } ]
sections:       { about, skills, work, contact }     // rename any built-in section
customSections: [ { id, label, title, after, body } ]// add your own sections
navbar:         { maxVisible, items: [ { label, target } ] }
theme:          { background, accent, accentBright, accentDeep, text, muted }
options:        { enable3DCrystal, enableTechSymbols }
```

**Common edits**

| Want to… | Do this |
|---|---|
| Change the big 3D wordmark | `base.githubUsername` |
| Re-skin the entire site | `theme.accent` (+ `accentBright` / `accentDeep`) |
| Hide a social link | delete its entry, or set `url: ''` |
| Change the text under a social link | its `handle` |
| Rename a section | `sections.work.label` / `.title` |
| Add your own section | push to `customSections` |
| Reorder / rename nav items | `navbar.items` (leave empty = auto from sections) |
| Add a project | copy a `projects[]` block |

`theme` colours are injected into CSS custom properties at runtime, so changing
`accent` re-skins everything — no CSS editing.

### Navbar

Leave `navbar.items` empty and the bar builds itself from your sections. Fill it
to control order, names and targets:

```js
navbar: {
  maxVisible: 4,                                          // extras → hamburger
  items: [
    { label: 'Projects', target: 'work' },                // in-page section
    { label: 'Resume',   target: 'https://…/cv.pdf' },    // external, new tab
    { label: 'Contact',  target: 'mailto:you@x.com' },    // mail client
  ],
}
```

Anything past `maxVisible` collapses into the slide-in hamburger menu, which
also holds every item on mobile (≤700px).

### Project previews

No screenshots to take yourself. Each card resolves its image in this order:

1. `preview` if you set one (local path in `public/`, or any URL)
2. an auto-screenshot of `live` (WordPress mShots — free, no key)
3. the repo's GitHub social card
4. a themed name placeholder

> GitHub bakes the owner avatar into its social card and it can't be stripped via
> URL. To avoid it, set a custom **Social preview** image in the repo settings, or
> give the project its own `preview`.

## Architecture

| Path | Responsibility |
|------|----------------|
| `portfolio.config.js`      | **The one file you edit.** Content + navbar + theme + toggles. |
| `src/data/content.js`      | Adapter: shapes the config for the UI. |
| `src/data/tech-icons.js`   | Brand SVG paths for the 3D tech symbols. |
| `src/ui/render.js`         | Injects content → DOM; applies theme; builds the navbar. |
| `src/ui/nav.js`            | Smooth scroll, hamburger menu, scroll-spy. |
| `src/ui/tilt.js`           | Pointer 3D-tilt for the tech cards. |
| `src/three/hero-scene.js`  | The hero WebGL crystal. |
| `src/animations/scroll.js` | GSAP + ScrollTrigger (reveals, wordmark morph, crystal). |
| `src/styles/main.css`      | Design system + all styling. |
| `src/main.js`              | Boot: render → nav → tilt → (lazy) 3D → animations. |

Content is fully separated from animation logic: `render.js` is the only module
that touches `innerHTML`, and the 3D/GSAP layers read from the same config
without knowing where it came from.

## Fonts (self-hosted, no CDN)

JetBrains Mono `.woff2` (weights 300/400/500/700/800) live in `public/fonts/`
and load via `@font-face` in `src/styles/main.css`. **To use the true Nerd Font
build** (terminal glyphs), drop the Nerd Font `.woff2` files in with the **same
filenames** — no code change needed.

## Deploy (Netlify)

`netlify.toml` is committed (`npm run build` → publish `dist/`), plus
`public/_redirects` for SPA fallback and `public/_headers` for long-cache headers
on the hashed assets and fonts. Connect the repo on Netlify and it just builds —
`netlify.toml` overrides any dashboard build settings. Or deploy by hand:

```bash
npm run build && npx netlify deploy --prod --dir dist
```

Also deploys as-is to Vercel, GitHub Pages or Cloudflare Pages (static `dist/`).

## Performance

- Three.js is lazy-loaded in its own chunk — never blocks first paint.
- Critical path is ~35 kB gzip; GSAP is a separate 28 kB gzip chunk.
- The 3D crystal auto-disables on small screens, low-core devices and
  `prefers-reduced-motion` — the site is fully functional without it.
- Tech symbols are CSS-3D (zero WebGL cost); tilt is off on touch/reduced-motion.
- Render loop pauses on a hidden tab; DPR capped at 2.

## License

MIT
