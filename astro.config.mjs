// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://pulsar.cometthemes.com',
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    starlight({
      title: 'Vega',
      description: 'Documentation for Vega — the API platform for teams that ship.',
      customCss: ['./src/styles/starlight.css'],
      components: {
        // Keep the marketing shell on docs pages: default header internals
        // plus the marketing nav links and Get started CTA. The mobile
        // drawer footer gains the same links on small viewports.
        Header: './src/components/starlight/Header.astro',
        MobileMenuFooter: './src/components/starlight/MobileMenuFooter.astro',
      },
      head: [
        {
          // Name Expressive Code's scrollable region landmarks (see BaseLayout
          // for the marketing-page equivalent).
          tag: 'script',
          content: `document.addEventListener('DOMContentLoaded', () => {
  for (const pre of document.querySelectorAll('pre[role="region"]:not([aria-label])')) {
    const lang = pre.dataset.language;
    pre.setAttribute('aria-label', lang ? 'Code sample (' + lang + ')' : 'Code sample');
  }
});`,
        },
      ],
      disable404Route: true,
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com' }],
      expressiveCode: {
        // Single dark theme — the docs are dark-only, matching the marketing site.
        themes: ['catppuccin-mocha'],
        useStarlightDarkModeSwitch: false,
      },
      sidebar: [
        {
          label: 'Getting started',
          items: [{ autogenerate: { directory: 'docs/getting-started' } }],
        },
        {
          label: 'Guides',
          items: [{ autogenerate: { directory: 'docs/guides' } }],
        },
        {
          label: 'API Reference',
          items: [{ autogenerate: { directory: 'docs/api' } }],
        },
      ],
    }),
  ],
});
