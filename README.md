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

## Editing content

| What | Where |
| --- | --- |
| Business name, phone, WhatsApp, email, address, social links | `src/data/site.ts` |
| Products (names, codes, features, photos) | `src/data/products.ts` |
| Product ranges | `src/data/categories.ts` |
| FAQ | `src/data/faqs.ts` |
| Product photos | `src/assets/products/` (file names are referenced from `products.ts`) |

To add a product, drop its photo(s) into `src/assets/products/` and add an entry to `products.ts`. Its page, catalogue card, sitemap entry and quote-form option are generated automatically.

## Quote form

The form sends enquiries through [EmailJS](https://www.emailjs.com) using the existing account (keys in `.env.example`, overridable with `PUBLIC_EMAILJS_*` environment variables). The full enquiry, including products and quantities, is sent in the `message` template variable; `name`, `email`, `phone`, `organisation`, `city` and `products` are also available for the template. Visitors can also send the same enquiry on WhatsApp in one click.

## Structure

```
src/
  assets/        product and site photos (optimised to WebP at build time)
  components/    Astro components and React islands (catalogue, gallery, quote form, mobile menu)
  data/          site, product, category and FAQ data
  layouts/       base layout with SEO meta, Open Graph and JSON-LD
  pages/         routes: home, products, product detail, category pages, about, contact, 404
```
