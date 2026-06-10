// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pulsar-lite.cometthemes.com',
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      // Single dark theme, matching the hero code panel
      // (see src/components/home/Hero.astro).
      theme: 'catppuccin-mocha',
    },
  },
});
