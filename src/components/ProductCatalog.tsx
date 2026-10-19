import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';

export interface CatalogItem {
  slug: string;
  code: string;
  name: string;
  category: string;
  categoryShort: string;
  features: string[];
  keywords: string;
  image: { src: string; srcset: string; width: number; height: number };
}

interface Props {
  items: CatalogItem[];
  categories: { slug: string; name: string }[];
  whatsapp: string;
  /** Locks the catalogue to one category (category landing pages). */
  fixedCategory?: string;
}

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export default function ProductCatalog({ items, categories, whatsapp, fixedCategory }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(fixedCategory ?? 'all');
  const reduceMotion = useReducedMotion();

  // Read initial filters from the URL so filtered views can be shared.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const c = params.get('category');
    if (q) setQuery(q);
    if (!fixedCategory && c && categories.some((x) => x.slug === c)) setCategory(c);
  }, [categories, fixedCategory]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    query ? params.set('q', query) : params.delete('q');
    if (!fixedCategory) category !== 'all' ? params.set('category', category) : params.delete('category');
    const qs = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }, [query, category, fixedCategory]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const i of items) map[i.category] = (map[i.category] ?? 0) + 1;
    return map;
  }, [items]);

  const results = useMemo(() => {
    const terms = normalise(query).split(' ').filter(Boolean);
    return items.filter((i) => {
      if (category !== 'all' && i.category !== category) return false;
      if (!terms.length) return true;
      const hay = normalise(`${i.code} ${i.name} ${i.categoryShort} ${i.keywords}`);
      return terms.every((t) => hay.includes(t));
    });
  }, [items, query, category]);

  const chips = [{ slug: 'all', name: 'All products' }, ...categories];

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-3xl border border-navy-100 bg-white p-4 shadow-card sm:p-5">
        <div className="relative">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or code, e.g. ICU bed, stretcher, M29"
            className="field !rounded-2xl !py-3.5 !pl-12"
            autoComplete="off"
          />
        </div>
        {!fixedCategory && (
          <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {chips.map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c.slug)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                    active ? 'text-white' : 'bg-navy-50 text-navy-800 hover:bg-navy-100'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="chip"
                      className="absolute inset-0 rounded-full bg-navy-900"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">
                    {c.name} <span className={active ? 'text-teal-200' : 'text-slate-500'}>({counts[c.slug] ?? 0})</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <h2 className="sr-only">Products</h2>
      <p className="mt-6 text-sm text-slate-500" aria-live="polite">
        Showing <strong className="text-navy-900">{results.length}</strong> of {items.length} products
      </p>

      <motion.ul layout={!reduceMotion} className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((p) => (
            <motion.li
              key={p.slug}
              layout={!reduceMotion}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <Card item={p} whatsapp={whatsapp} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {results.length === 0 && (
        <div className="mt-6 rounded-3xl border border-dashed border-navy-200 p-10 text-center">
          <h3 className="text-lg font-semibold">No products match your search</h3>
          <p className="mt-2 text-sm text-slate-600">We make many items to order. Tell us what you need and we will help.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" className="btn-outline" onClick={() => { setQuery(''); if (!fixedCategory) setCategory('all'); }}>
              Clear filters
            </button>
            <a
              className="btn-whatsapp"
              target="_blank"
              rel="noopener"
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello, I am looking for: ${query}`)}`}
            >
              <Icon name="whatsapp" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ item, whatsapp }: { item: CatalogItem; whatsapp: string }) {
  const href = `/products/${item.slug}`;
  const msg = `Hello, I am interested in ${item.name} (${item.code}). Please share price and details.`;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <a href={href} className="relative block aspect-square overflow-hidden bg-navy-50/50" tabIndex={-1} aria-hidden="true">
        <img
          src={item.image.src}
          srcSet={item.image.srcset}
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw"
          width={item.image.width}
          height={item.image.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-contain p-6 mix-blend-multiply transition duration-500 group-hover:scale-105"
        />
        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-700 ring-1 ring-navy-100">
          {item.code}
        </span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-wider text-teal-600 uppercase">{item.categoryShort}</p>
        <h3 className="mt-1.5 text-base leading-snug font-semibold">
          <a href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {item.name}
          </a>
        </h3>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
          {item.features.map((f) => (
            <li key={f} className="flex gap-2">
              <Icon name="check" className="mt-0.5 size-4 shrink-0 text-teal-500" />
              {f}
            </li>
          ))}
        </ul>
        <div className="relative z-10 mt-auto flex gap-2 pt-5">
          <a href={`/contact?product=${item.slug}#quote`} className="btn-navy flex-1 !px-4 !py-2.5 text-xs">
            Get Quote
          </a>
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener"
            aria-label={`Ask about ${item.name} on WhatsApp`}
            className="btn-whatsapp !p-2.5"
          >
            <Icon name="whatsapp" className="size-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
