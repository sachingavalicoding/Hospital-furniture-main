import { useEffect, useState } from 'react';
import Icon from './Icon';

interface Item {
  slug: string;
  code: string;
  name: string;
  thumb: string;
}

const KEY = 'sjp-recently-viewed';

/** Remembers product pages this visitor opened, on this device only. */
export default function RecentlyViewed({ items, current }: { items: Item[]; current?: string }) {
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    let slugs: string[] = [];
    try {
      slugs = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(slugs)) slugs = [];
    } catch {
      slugs = [];
    }
    const bySlug = Object.fromEntries(items.map((i) => [i.slug, i]));
    setList(slugs.filter((s) => s !== current && bySlug[s]).slice(0, 6).map((s) => bySlug[s]));
    if (current) {
      try {
        localStorage.setItem(KEY, JSON.stringify([current, ...slugs.filter((s) => s !== current)].slice(0, 12)));
      } catch {
        /* storage unavailable: nothing to remember */
      }
    }
  }, [items, current]);

  if (!list.length) return null;
  return (
    <section className="container-x py-12 sm:py-16" aria-labelledby="recent-title">
      <h2 id="recent-title" className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
        <Icon name="history" className="size-6 text-teal-600" /> Recently viewed
      </h2>
      <ul className="no-scrollbar mt-5 flex gap-3 overflow-x-auto">
        {list.map((i) => (
          <li key={i.slug} className="w-36 shrink-0 sm:w-44">
            <a href={`/products/${i.slug}`} className="group block rounded-lg border border-ink-200 bg-white p-2 transition hover:border-ink-400">
              <span className="tile block aspect-square overflow-hidden rounded-md">
                <img src={i.thumb} alt="" width={160} height={160} loading="lazy" className="size-full object-contain p-2 mix-blend-multiply" />
              </span>
              <span className="mt-2 block font-mono text-[11px] text-ink-500">{i.code}</span>
              <span className="line-clamp-2 text-[13px] leading-snug font-semibold text-ink-900">{i.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
