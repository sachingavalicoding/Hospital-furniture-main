import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';

export interface CatalogItem {
  slug: string;
  code: string;
  name: string;
  order: number;
  category: string;
  categoryShort: string;
  keywords: string;
  operation: string | null;
  materials: string[];
  mobile: boolean;
  image: { src: string; srcset: string; width: number; height: number };
}

interface Props {
  items: CatalogItem[];
  categories: { slug: string; name: string }[];
  operations: string[];
  materials: string[];
  whatsapp: string;
  /** Locks the catalogue to one category (category landing pages). */
  fixedCategory?: string;
}

type Sort = 'catalogue' | 'name' | 'code';
const sorts: { value: Sort; label: string }[] = [
  { value: 'catalogue', label: 'Catalogue order' },
  { value: 'name', label: 'Name A to Z' },
  { value: 'code', label: 'Code M1 to M53' },
];

const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const codeNum = (c: string) => Number(c.replace(/\D/g, '')) || 0;
const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function ProductCatalog({ items, categories, operations, materials, whatsapp, fixedCategory }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(fixedCategory ?? 'all');
  const [ops, setOps] = useState<string[]>([]);
  const [mats, setMats] = useState<string[]>([]);
  const [mobileOnly, setMobileOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('catalogue');
  const [sheet, setSheet] = useState(false);
  const ready = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const filterButton = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  // Read initial filters from the URL so filtered views can be shared.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const typed = (document.getElementById('product-search') as HTMLInputElement | null)?.value;
    if (p.get('q') || typed) setQuery(typed || p.get('q')!);
    const c = p.get('category');
    if (!fixedCategory && c && categories.some((x) => x.slug === c)) setCategory(c);
    if (p.get('operation')) setOps(p.get('operation')!.split(',').filter((o) => operations.includes(o)));
    if (p.get('material')) setMats(p.get('material')!.split(',').filter((m) => materials.includes(m)));
    if (p.get('mobile') === '1') setMobileOnly(true);
    const s = p.get('sort') as Sort | null;
    if (s && sorts.some((x) => x.value === s)) setSort(s);
    ready.current = true;
  }, [categories, fixedCategory, operations, materials]);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (!fixedCategory && category !== 'all') p.set('category', category);
    if (ops.length) p.set('operation', ops.join(','));
    if (mats.length) p.set('material', mats.join(','));
    if (mobileOnly) p.set('mobile', '1');
    if (sort !== 'catalogue') p.set('sort', sort);
    const qs = p.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
  }, [query, category, ops, mats, mobileOnly, sort, fixedCategory]);

  // Bottom sheet: lock scroll, close on Escape, return focus.
  useEffect(() => {
    if (!sheet) return;
    document.documentElement.style.overflow = 'hidden';
    sheetRef.current?.querySelector<HTMLElement>('button, input')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeSheet();
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [sheet]);
  const closeSheet = () => {
    setSheet(false);
    filterButton.current?.focus();
  };

  const scoped = useMemo(() => items.filter((i) => category === 'all' || i.category === category), [items, category]);

  const results = useMemo(() => {
    const terms = normalise(query).split(' ').filter(Boolean);
    const list = scoped.filter((i) => {
      if (ops.length && !(i.operation && ops.includes(i.operation))) return false;
      if (mats.length && !mats.some((m) => i.materials.includes(m))) return false;
      if (mobileOnly && !i.mobile) return false;
      if (!terms.length) return true;
      const hay = normalise(`${i.code} ${i.name} ${i.categoryShort} ${i.keywords}`);
      return terms.every((t) => hay.includes(t));
    });
    const sorted = [...list];
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'code') sorted.sort((a, b) => codeNum(a.code) - codeNum(b.code));
    else sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }, [scoped, query, ops, mats, mobileOnly, sort]);

  // Only offer attribute values that exist in the current range.
  const opsAvailable = operations.filter((o) => scoped.some((i) => i.operation === o));
  const matsAvailable = materials.filter((m) => scoped.some((i) => i.materials.includes(m)));
  const mobileAvailable = scoped.some((i) => i.mobile) && scoped.some((i) => !i.mobile);
  const activeCount = ops.length + mats.length + (mobileOnly ? 1 : 0);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: items.length };
    for (const i of items) map[i.category] = (map[i.category] ?? 0) + 1;
    return map;
  }, [items]);

  const clearAll = () => {
    setQuery('');
    setOps([]);
    setMats([]);
    setMobileOnly(false);
    if (!fixedCategory) setCategory('all');
  };

  const filterGroups = (
    <div className="grid gap-6">
      {opsAvailable.length > 1 && (
        <fieldset>
          <legend className="label-mono">Operation</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {opsAvailable.map((o) => (
              <FilterChip key={o} label={o} active={ops.includes(o)} onClick={() => setOps((v) => toggle(v, o))} />
            ))}
          </div>
        </fieldset>
      )}
      {matsAvailable.length > 1 && (
        <fieldset>
          <legend className="label-mono">Material</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {matsAvailable.map((m) => (
              <FilterChip key={m} label={m} active={mats.includes(m)} onClick={() => setMats((v) => toggle(v, m))} />
            ))}
          </div>
        </fieldset>
      )}
      {mobileAvailable && (
        <fieldset>
          <legend className="label-mono">Mobility</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <FilterChip label="On castors / wheels" active={mobileOnly} onClick={() => setMobileOnly((v) => !v)} />
          </div>
        </fieldset>
      )}
    </div>
  );
  const hasAttributeFilters = opsAvailable.length > 1 || matsAvailable.length > 1 || mobileAvailable;

  return (
    <div>
      <div className="grid gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <label htmlFor="product-search" className="sr-only">Search products</label>
            <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-400" />
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or code"
              className="field !pl-11"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
          {hasAttributeFilters && (
            <button
              ref={filterButton}
              type="button"
              onClick={() => setSheet(true)}
              aria-haspopup="dialog"
              className="btn-line !px-3.5 lg:!hidden"
            >
              <Icon name="sliders" className="size-5" />
              <span>Filters</span>
              {activeCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-teal-600 text-[11px] text-white">{activeCount}</span>}
            </button>
          )}
        </div>

        {!fixedCategory && (
          <div role="group" aria-label="Filter by range" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {[{ slug: 'all', name: 'All' }, ...categories].map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(c.slug)}
                  className={`relative min-h-10 shrink-0 rounded-md border px-3.5 text-sm font-medium whitespace-nowrap transition ${
                    active ? 'border-ink-900 text-white' : 'border-ink-200 bg-white text-ink-800 hover:border-ink-400'
                  }`}
                >
                  {active && (
                    <motion.span layoutId="chip" className="absolute inset-0 rounded-[5px] bg-ink-900" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                  )}
                  <span className="relative">
                    {c.name} <span className={`font-mono text-xs ${active ? 'text-teal-300' : 'text-ink-500'}`}>{counts[c.slug] ?? 0}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
        {hasAttributeFilters && (
          <aside className="hidden lg:block" aria-label="Product filters">
            <div className="sticky top-24 rounded-lg border border-ink-200 p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Filters</h2>
                {activeCount > 0 && (
                  <button type="button" onClick={() => { setOps([]); setMats([]); setMobileOnly(false); }} className="text-xs font-semibold text-teal-700 hover:underline">Clear</button>
                )}
              </div>
              {filterGroups}
            </div>
          </aside>
        )}

        <div className={hasAttributeFilters ? '' : 'lg:col-span-2'}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-200 pb-3">
            <h2 className="text-sm text-ink-600" aria-live="polite">
              <strong className="text-ink-900">{results.length}</strong> of {scoped.length} products
            </h2>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <span>Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-h-10 rounded-md border border-ink-200 bg-white px-2.5 text-sm font-medium text-ink-900">
                {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
          </div>

          <motion.ul layout={!reduceMotion} className={`mt-5 grid grid-cols-2 gap-3 sm:gap-5 ${hasAttributeFilters ? 'md:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4'}`}>
            <AnimatePresence mode="popLayout" initial={false}>
              {results.map((p) => (
                <motion.li
                  key={p.slug}
                  layout={!reduceMotion}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card item={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          {results.length === 0 && (
            <div className="mt-5 rounded-lg border border-dashed border-ink-300 p-8 text-center sm:p-10">
              <h3 className="text-lg font-semibold">No products match</h3>
              <p className="mt-2 text-sm text-ink-600">Try fewer filters, or tell us what you need. We may be able to make it.</p>
              <div className="mt-5 grid justify-center gap-2.5 sm:flex">
                <button type="button" className="btn-line" onClick={clearAll}>Clear search and filters</button>
                <a className="btn-whatsapp" target="_blank" rel="noopener" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hello, I am looking for: ${query || 'hospital furniture'}`)}`}>
                  <Icon name="whatsapp" /> Ask on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {sheet && (
          <>
            <motion.div key="bg" className="fixed inset-0 z-[80] bg-ink-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeSheet} />
            <motion.div
              key="sheet"
              ref={sheetRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-title"
              className="fixed inset-x-0 bottom-0 z-[81] flex max-h-[85vh] flex-col rounded-t-xl bg-white"
              initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              <div className="flex items-center justify-between border-b border-ink-200 px-4 py-2">
                <h2 id="filter-title" className="text-base font-semibold">Filters</h2>
                <button type="button" onClick={closeSheet} aria-label="Close filters" className="grid size-11 place-items-center rounded-md"><Icon name="close" /></button>
              </div>
              <div className="overflow-y-auto px-4 py-5">{filterGroups}</div>
              <div className="grid grid-cols-2 gap-2 border-t border-ink-200 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
                <button type="button" className="btn-line" onClick={() => { setOps([]); setMats([]); setMobileOnly(false); }}>Clear</button>
                <button type="button" className="btn-ink" onClick={closeSheet}>Show {results.length}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-1.5 rounded-md border px-3 text-sm transition ${
        active ? 'border-teal-600 bg-teal-50 font-semibold text-teal-800' : 'border-ink-200 text-ink-800 hover:border-ink-400'
      }`}
    >
      {active && <Icon name="check" className="size-4" />}
      {label}
    </button>
  );
}

function Card({ item }: { item: CatalogItem }) {
  const href = `/products/${item.slug}`;
  const [loaded, setLoaded] = useState(false);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-ink-200 bg-white transition duration-300 hover:border-ink-400 hover:shadow-tile">
      <div className={`tile img-ph relative aspect-square overflow-hidden ${loaded ? 'loaded' : ''}`}>
        <img
          src={item.image.src}
          srcSet={item.image.srcset}
          sizes="(min-width: 1280px) 280px, (min-width: 768px) 30vw, 46vw"
          width={item.image.width}
          height={item.image.height}
          alt={item.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          ref={(el) => { if (el?.complete && !loaded) setLoaded(true); }}
          className="size-full object-contain p-4 mix-blend-multiply transition duration-500 group-hover:scale-[1.04] sm:p-6"
        />
        <span className="stamp absolute top-2.5 left-2.5 sm:top-3 sm:left-3">{item.code}</span>
      </div>
      <div className="flex flex-1 flex-col border-t border-ink-200 p-3 sm:p-4">
        <p className="label-mono !text-[10px] !text-teal-700">{item.categoryShort}</p>
        <h3 className="mt-1 text-[14px] leading-snug font-semibold sm:text-[15px]">
          <a href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{item.name}</a>
        </h3>
        {(item.operation || item.materials[0]) && (
          <p className="mt-1.5 text-xs text-ink-500">{[item.operation, item.materials[0]].filter(Boolean).join(' · ')}</p>
        )}
        <p className="mt-auto flex items-center gap-1 pt-3 text-[13px] font-semibold text-teal-700">
          View details <span aria-hidden="true" className="transition group-hover:translate-x-0.5">→</span>
        </p>
      </div>
    </article>
  );
}
