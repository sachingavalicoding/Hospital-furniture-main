# Shree Jagadamba Production website

Marketing and enquiry website for Shree Jagadamba Production, a hospital furniture manufacturer in Kondhwa, Pune.

Built with [Astro](https://astro.build), React islands, Tailwind CSS and Framer Motion. Every page is prerendered to static HTML, so it is fast, SEO friendly and free to host on Netlify (or any static host). There is no backend.

## Run locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs static site to dist/
npm run preview  # serve the built site
```

Requires Node 18.20+ (Node 22 recommended).

## Deploy on Netlify

`netlify.toml` already sets the build command (`npm run build`) and publish folder (`dist`). Connect the repository in Netlify and deploy. Once a custom domain is live, set `SITE_URL` in Netlify environment variables so canonical links and the sitemap use it.

Optional environment variables (see `.env.example`):

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Public URL for canonical links, Open Graph and the sitemap |
| `PUBLIC_GA_ID` | Google Analytics 4 measurement ID. Analytics stays off when empty |
| `PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console HTML-tag token |

After the first deploy, submit `https://<your-domain>/sitemap-index.xml` in Google Search Console.

## Editing content

| What | Where |
| --- | --- |
| Business name, phone, WhatsApp, email, address, map coordinates, opening hours, social links | `src/data/site.ts` |
| Industries page | `src/data/industries.ts` |
| Products (names, codes, features, photos) | `src/data/products.ts` |
| Product ranges | `src/data/categories.ts` |
| FAQ | `src/data/faqs.ts` |
| Product photos | `src/assets/products/` (file names are referenced from `products.ts`) |

To add a product, drop its photo(s) into `src/assets/products/` and add an entry to `products.ts`. Its page, catalogue card, sitemap entry and quote-form option are generated automatically.

Opening hours are hidden until you fill in `hours` in `src/data/site.ts`; they then appear in the footer, contact page and structured data.

## Quote form (Netlify Forms)

The quote and contact forms use [Netlify Forms](https://docs.netlify.com/forms/setup/), so there are no API keys or email credentials in the website code. Netlify detects the form named `quote` on deploy. To receive enquiries by email:

1. In Netlify, open **Site configuration > Forms** and enable form detection if asked.
2. Under **Form notifications**, add an **Email notification** for the `quote` form to `shreejagadambaproduction2003@gmail.com`.

Each submission includes name, organisation, phone, email, delivery city, products with quantities and the message. A hidden honeypot field filters bots, and the form blocks accidental duplicate submissions. Visitors can also send the same enquiry on WhatsApp in one click. The free Netlify plan includes 100 form submissions per month.

## Structure

```
src/
  assets/        product and site photos (optimised to WebP at build time)
  components/    Astro components and React islands (catalogue, gallery, quote form, mobile menu)
  data/          site, product, category and FAQ data
  layouts/       base layout with SEO meta, Open Graph and JSON-LD
  pages/         routes: home, products, ranges, product detail, industries, gallery, about,
                 contact, quote, FAQ, privacy, 404
  scripts/       small shared script (scroll reveal, sliders, back to top)
```
