import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

export interface Photo {
  src: string;
  srcset: string;
  full: string;
  width: number;
  height: number;
  alt: string;
  code: string;
  slug: string;
  category: string;
}

interface Props {
  photos: Photo[];
  categories: { slug: string; name: string }[];
}

export default function PhotoGallery({ photos, categories }: Props) {
  const [category, setCategory] = useState('all');
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const list = useMemo(() => photos.filter((p) => category === 'all' || p.category === category), [photos, category]);

  const go = (d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length));
  const close = () => {
    setOpen(null);
    opener.current?.focus();
  };

  useEffect(() => {
    if (open === null) return;
    document.documentElement.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Tab' && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('button, a'));
        const at = f.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open === null]);

  const current = open === null ? null : list[open];

  return (
    <div>
      <div role="group" aria-label="Filter photos by range" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
          <button
            key={c.slug}
            type="button"
            aria-pressed={category === c.slug}
            onClick={() => setCategory(c.slug)}
            className={`min-h-10 shrink-0 rounded-md border px-3.5 text-sm font-medium whitespace-nowrap transition ${
              category === c.slug ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 bg-white text-ink-800 hover:border-ink-400'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-ink-600" aria-live="polite">{list.length} photos</p>
      <ul className="mt-3 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
        {list.map((p, i) => (
          <li key={p.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={(e) => { opener.current = e.currentTarget; setOpen(i); }}
              className="tile group relative block w-full overflow-hidden rounded-lg border border-ink-200 transition hover:border-ink-400"
            >
              <img
                src={p.src}
                srcSet={p.srcset}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 31vw, 46vw"
                width={p.width}
                height={p.height}
                alt={p.alt}
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                className="h-auto w-full object-contain p-3 mix-blend-multiply transition duration-500 group-hover:scale-[1.03]"
              />
              <span className="stamp absolute top-2 left-2">{p.code}</span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && (
          <motion.div
            ref={dialog}
            className="fixed inset-0 z-[90] flex flex-col bg-ink-950/95"
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-white">
              <span className="truncate font-mono text-xs text-ink-300">{current.code} · {(open ?? 0) + 1} / {list.length}</span>
              <button type="button" onClick={close} aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-md bg-white/10"><Icon name="close" /></button>
            </div>
            <div
              className="relative flex-1"
              onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                if (touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
              onClick={(e) => e.target === e.currentTarget && close()}
            >
              <img key={current.full} src={current.full} alt={current.alt} className="absolute inset-0 m-auto max-h-full max-w-full bg-white object-contain p-3" />
            </div>
            <div className="flex items-center justify-center gap-3 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="grid size-11 place-items-center rounded-md bg-white/10 text-white"><Icon name="chevronLeft" /></button>
              <a href={`/products/${current.slug}`} className="btn-ghost-light !min-h-11">View product</a>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="grid size-11 place-items-center rounded-md bg-white/10 text-white"><Icon name="chevronRight" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
