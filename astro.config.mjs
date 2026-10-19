// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Canonical URL for links, Open Graph and the sitemap. SITE_URL wins if set; otherwise
// Netlify's URL (the site's primary domain), so moving to a .in domain needs no code change.
const site = process.env.SITE_URL || process.env.URL || 'https://shreejagadambaproduction.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/quote/sent') })],
  vite: { plugins: [tailwindcss()] },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
