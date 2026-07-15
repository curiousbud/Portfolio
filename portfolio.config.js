/* ============================================================================
 *  portfolio.config.js  —  ✏️  EDIT THIS ONE FILE
 * ----------------------------------------------------------------------------
 *  Everything the site shows and every brand colour lives here (gitprofile
 *  style). Change a value, save, and the page updates live. You never need to
 *  touch anything in src/ for normal content edits.
 *
 *  QUICK RECIPES
 *  ─────────────
 *  • Change the big GitHub wordmark ("curiousbud"):
 *        base.githubUsername = 'your-new-handle'
 *    (It also becomes the /GitHub link target unless you set social.github.)
 *
 *  • Rename yourself / change the hero title:
 *        base.name = 'Your Name'
 *
 *  • Hide a social link: set its value to '' (empty string).
 *        social.discord = ''      // Discord no longer shown
 *
 *  • Add a brand-new social platform: add a key to `social` below AND add a
 *    matching label rule in src/data/content.js → SOCIAL_LABELS (one line).
 *
 *  • Re-skin the ENTIRE site: change theme.accent (see the THEME block).
 *
 *  • Add a skill WITH a 3D brand symbol: see the SKILLS block for the 2 steps.
 * ========================================================================== */

export const config = {
  /* ── WHO YOU ARE ──────────────────────────────────────────────────────
   *  name           → hero headline + nav brand + footer
   *  role           → the small eyebrow label above your name
   *  githubUsername → the giant 3D wordmark before the projects (change this
   *                   to change the wordmark text). Also the default GitHub URL.
   *  tagline        → one line under your name in the hero
   *  about          → the paragraph in the About section. Written inside
   *                   `backticks`, so just type freely — you can even press
   *                   Enter and split it across lines; line breaks render as
   *                   normal spaces. (Backticks let you use apostrophes too.)
   *  location       → small line under About
   *  email          → shown in Contact + used for the mailto link
   */
  base: {
    name: 'Areeb Khan',
    role: 'Web Developer',
    githubUsername: 'curiousbud',
    tagline: 'Building at the intersection of the web, NLP & security.',
    about: `Recent Computer Science graduate passionate about NLP, Machine
      Learning, Big Data and cybersecurity. Hands-on project experience with a
      strong foundation in coding, Linux and security fundamentals — eager to
      apply these skills to real-world problems and grow in dynamic tech
      environments.`,
    location: 'Remote · Available worldwide',
    email: 'akareeb662@gmail.com',
  },

  /* ── SOCIAL LINKS ─────────────────────────────────────────────────────
   *  Each entry has:
   *    url    → the link it opens
   *    handle → the small text shown UNDER the label (edit this freely!)
   *    label  → OPTIONAL bold label above the handle (defaults to a nice name
   *             per platform, e.g. "GitHub", "dev.to"). Add it to rename.
   *  To HIDE a link: delete its line (or set url: '').
   *  To ADD a platform: add a new entry with any key + { url, handle }.
   *  (Shortcut: an entry may also be a plain 'https://…' string, in which case
   *  the handle is auto-derived — but use the object form to control the text.)
   */
  social: {
    github:   { url: 'https://github.com/curiousbud',                    handle: '@curiousbud' },
    linkedin: { url: 'https://www.linkedin.com/in/curiousbud',           handle: 'in/curiousbud' },
    devto:    { url: 'https://dev.to/curiousbud',                        handle: '@curiousbud' },
    reddit:   { url: 'https://www.reddit.com/user/Black_Badger-001/',    handle: 'u/Black_Badger-001' },
    discord:  { url: 'https://discordapp.com/users/1062993890115858463', handle: 'curiousbud' },
    email:    { url: 'akareeb662@gmail.com',                             handle: 'akareeb662@gmail.com' },
  },

  /* ── SKILLS (the 3D animated tech symbols) ────────────────────────────
   *  Just a list of names. Each name is looked up in src/data/tech-icons.js:
   *    • MATCH  → the card shows that technology's real brand SVG (in colour)
   *    • NO MATCH → the card shows a neon dot fallback (still works fine)
   *
   *  TO ADD A NEW SKILL **WITH** ITS BRAND SYMBOL (2 steps):
   *    1) Add the name here, e.g. 'Python'
   *    2) Add its icon to src/data/tech-icons.js using the EXACT same key:
   *         'Python': { hex: '#3776AB', viewBox: '0 0 24 24', path: '<d>' }
   *       Get <d> (the SVG path) + hex from https://simeoncostadev.github.io
   *       /simple-icons or https://cdn.jsdelivr.net/npm/simple-icons@13/icons/
   *       python.svg — copy the value of the <path d="…"> attribute.
   *
   *  TO ADD A SKILL WITHOUT A SYMBOL: just add the name here; it renders with
   *  the neon-dot fallback. No second step needed.
   */
  skills: [
    'JavaScript', 'React.js', 'Node.js', 'MySQL',
    'PostgreSQL', 'Git', 'Docker', 'Tailwind CSS', 'Linux',
  ],

  /* ── PROJECTS ─────────────────────────────────────────────────────────
   *  Each project is a card in the Work section. Fields:
   *    name        → project title
   *    tagline     → one short line (accent colour)
   *    description → the paragraph
   *    tags        → array of small pills (any strings)
   *    live        → deployed URL. Shown as "Live demo ↗" AND used as the
   *                  card's main link. Leave '' if there's no live site.
   *    repo        → source URL. Always shown as "Source ↗". Used as the main
   *                  link when `live` is empty.
   *    preview     → OPTIONAL card image. Leave it out (or '') and the site
   *                  auto-generates one: projects WITH a `live` URL get a real
   *                  screenshot of the live site; projects WITHOUT a live site
   *                  fall back to the repo's GitHub card (this one includes
   *                  your GitHub avatar — see note in src/data/content.js to
   *                  hide it). To use your own instead, drop a file in public/
   *                  and set preview: '/my-shot.png', or use any image URL.
   *  TO ADD A PROJECT: copy one { … } block and edit it. Order here = order
   *  on the page.
   */
  projects: [
    {
      name: 'Nerva',
      tagline: 'A collection of powerful scripts',
      description: `A Next.js web catalogue of practical automation scripts,
        with a full build & release pipeline and production-hardening tooling.
        Deployed continuously to Netlify.`,
      tags: ['Next.js', 'JavaScript', 'Automation'],
      live: 'https://curiousbud-nerva.netlify.app/',
      repo: 'https://github.com/curiousbud/Nerva',
    },
    {
      name: 'ProofCheck',
      tagline: 'FastAPI verification service',
      description: `A Python/FastAPI service that validates and checks proofs,
        with OCR (Tesseract) support, a pytest suite and Docker-based
        deployment.`,
      tags: ['Python', 'FastAPI', 'Docker', 'OCR'],
      live: '',                              // self-hosted — no public demo
      repo: 'https://github.com/curiousbud/ProofCheck',
    },
    {
      name: 'Playlist Extractor',
      tagline: 'MERN-stack utility app',
      description: `Extracts every video link from a YouTube playlist through a
        fast, minimal MERN interface. Practical tooling, zero clutter.`,
      tags: ['React', 'Node.js', 'MongoDB', 'API'],
      live: 'https://youtube-extractor-seven.vercel.app',
      repo: 'https://github.com/curiousbud/YouTube-Playlist-videos-link-Extractor',
    },
  ],

  /* ── SECTIONS: rename the built-ins ───────────────────────────────────
   *  `label` = the text in the top nav.  `title` = the big heading shown on
   *  the section. Change either freely — the section numbers (01, 02…) and
   *  nav update automatically.
   */
  sections: {
    about:   { label: 'About',   title: 'About' },
    skills:  { label: 'Skills',  title: 'Skills' },
    work:    { label: 'Work',    title: 'Projects' },
    contact: { label: 'Contact', title: "Let's build something." },
  },

  /* ── CUSTOM SECTIONS: add your own ────────────────────────────────────
   *  Each entry becomes a titled text block AND a nav link, numbered in
   *  order automatically. Fields:
   *    id    → unique lowercase id, no spaces (also the #anchor link)
   *    label → nav text
   *    title → the big heading
   *    after → which section to place it after: 'about' | 'skills' | 'work'
   *            (defaults to 'work'; it always stays before Contact)
   *    body  → HTML string. Written in `backticks` so you can use <p>, <ul>,
   *            <a href="…">, apostrophes, and line breaks freely.
   *  Uncomment the example below to see one, or copy it to add more.
   */
  customSections: [
    // {
    //   id: 'experience',
    //   label: 'Experience',
    //   title: 'Experience',
    //   after: 'work',
    //   body: `
    //     <p>Frontend Developer — Company (2024–present). Built X, shipped Y.</p>
    //     <ul>
    //       <li>Something you did.</li>
    //       <li>Another highlight.</li>
    //     </ul>`,
    // },
  ],

  /* ── NAVBAR: control the top menu ─────────────────────────────────────
   *  OPTIONAL. Leave `items` empty and the navbar is built automatically from
   *  your sections (About, Skills, Work, Contact + any custom ones), in order.
   *  Fill `items` to control ORDER, NAMES and TARGETS yourself:
   *    label  → the text shown in the bar
   *    target → where it points:
   *               'work' or '#work'  → scrolls to that section on the page
   *               'https://…'        → opens an external link in a new tab
   *               'mailto:you@x.com' → opens the mail client
   *  maxVisible → how many items stay in the bar; anything beyond that collapses
   *               into the hamburger menu (which also holds every item on
   *               mobile). Default 4.
   *  Example (uncomment & edit): reorder, rename, and add an external Resume:
   */
  navbar: {
    maxVisible: 4,
    items: [
      // { label: 'Home',    target: 'top' },
      // { label: 'About',   target: 'about' },
      // { label: 'Skills',  target: 'skills' },
      // { label: 'Projects', target: 'work' },
      // { label: 'Contact', target: 'contact' },
      // { label: 'Resume',  target: 'https://example.com/resume.pdf' },
    ],
  },

  /* ── THEME (re-skins the whole site) ──────────────────────────────────
   *  These are injected into CSS variables at runtime, so changing one value
   *  updates everything that uses it — no CSS editing needed.
   *    background   → page background            (current: pure black)
   *    accent       → the main neon colour: wordmark, glow, links, 3D lights
   *    accentBright → brighter neon (hovers, highlights)
   *    accentDeep   → darker neon (the far layers of the 3D wordmark)
   *    text         → main text colour
   *    muted        → secondary/label text colour
   *  Example — switch to a neon-green theme: set accent '#39d98a',
   *  accentBright '#7bf5b8', accentDeep '#1f7d55'.
   */
  theme: {
    background:   '#000000',
    accent:       '#74bcdc',   // neon sky-blue (matches your live site)
    accentBright: '#a6dcf2',
    accentDeep:   '#2b7ba3',
    text:         '#ffffff',
    muted:        '#7f95a1',
  },

  /* ── FEATURE TOGGLES ──────────────────────────────────────────────────
   *  enable3DCrystal   → the WebGL crystal behind the hero. Set false to turn
   *                      off Three.js entirely (site still fully works, loads
   *                      even lighter). Auto-disables on phones/low-power/
   *                      reduced-motion regardless of this setting.
   *  enableTechSymbols → reserved flag for the 3D skill symbols (kept for
   *                      future use; the CSS-3D cards are always lightweight).
   */
  options: {
    enable3DCrystal: true,
    enableTechSymbols: true,
  },
};
