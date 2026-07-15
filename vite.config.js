import { defineConfig } from 'vite';

export default defineConfig({
  // Set to '/<repo-name>/' if deploying to a GitHub Pages project page.
  base: './',
  build: {
    target: 'es2020',
    // Keep three.js in its own chunk so the rest of the site stays tiny.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
