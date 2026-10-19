// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Set SITE_URL in your host's environment once a custom domain is live.
const site = process.env.SITE_URL || 'https://shreejagadambaproduction.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
