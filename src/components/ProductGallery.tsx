import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

export interface GalleryImage {
  src: string;
  srcset: string;
  thumb: string;
  full: string;
  width: number;
  height: number;
}

interface Props {
  images: GalleryImage[];
  alt: string;
  code: string;
}

export default function ProductGallery({ images, alt, code }: Props) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState('50% 50%');
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const count = images.length;

  const scrollTo = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: 'smooth' });
  }, []);

  // Keep the active index in sync with swipes.
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) setIndex(i);
  };

  const go = useCallback((d: number) => {
    setZoomed(false);
    setIndex((i) => {
      const n = (i + d + count) % count;
      if (!open) scrollTo(n);
      return n;
    });
  }, [count, open, scrollTo]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Tab' && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>('button'));
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
  }, [open, go]);

  const close = () => {
    setOpen(false);
    setZoomed(false);
    scrollTo(index);
    opener.current?.focus();
  };

  // Swipe between images in the lightbox when not zoomed.
  const touchX = useRef<number | null>(null);

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-ink-200">
        <div
          ref={track}
          onScroll={onScroll}
          className="no-scrollbar tile flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          aria-label={`${alt} images`}
          role="group"
        >
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={(e) => { opener.current = e.currentTarget; setIndex(i); setOpen(true); }}
              className="relative aspect-square w-full shrink-0 snap-center cursor-zoom-in"
              aria-label={`Zoom image ${i + 1} of ${count}`}
            >
              <img
                src={img.src}
                srcSet={img.srcset}
                sizes="(min-width: 1024px) 580px, 100vw"
                width={img.width}
                height={img.height}
                alt={count > 1 ? `${alt}, view ${i + 1} of ${count}` : alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchPriority={i === 0 ? 'high' : 'auto'}
                decoding={i === 0 ? 'sync' : 'async'}
                className="size-full object-contain p-6 mix-blend-multiply sm:p-10"
              />
            </button>
          ))}
        </div>
        <span className="stamp pointer-events-none absolute top-3 left-3">{code}</span>
        <span className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-ink-700">
          <Icon name="zoom" className="size-4" /> Tap to zoom
        </span>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute top-1/2 left-2 hidden size-11 -translate-y-1/2 place-items-center rounded-md bg-white/90 text-ink-900 shadow-tile hover:bg-white sm:grid">
              <Icon name="chevronLeft" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute top-1/2 right-2 hidden size-11 -translate-y-1/2 place-items-center rounded-md bg-white/90 text-ink-900 shadow-tile hover:bg-white sm:grid">
              <Icon name="chevronRight" />
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
              {images.map((img, i) => <span key={img.src} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-ink-900' : 'w-1.5 bg-ink-300'}`} />)}
            </div>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Choose image">
          {images.map((img, i) => (
            <button
              key={img.thumb}
              type="button"
              onClick={() => { setIndex(i); scrollTo(i); }}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`tile size-16 shrink-0 overflow-hidden rounded-md border-2 transition sm:size-20 ${i === index ? 'border-teal-600' : 'border-ink-200 opacity-75 hover:opacity-100'}`}
            >
              <img src={img.thumb} alt="" width={80} height={80} loading="lazy" className="size-full object-contain p-1.5 mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            ref={dialog}
            className="fixed inset-0 z-[90] flex flex-col bg-ink-950/95"
            role="dialog"
            aria-modal="true"
            aria-label={`${alt}, image ${index + 1} of ${count}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-3 py-2 text-white">
              <span className="font-mono text-xs text-ink-300">{code} · {index + 1} / {count}</span>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close" className="grid size-11 place-items-center rounded-md bg-white/10"><Icon name="close" /></button>
            </div>
            <div
              className="relative flex-1 overflow-hidden"
              onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
              onTouchEnd={(e) => {
                if (zoomed || touchX.current === null) return;
                const dx = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
                touchX.current = null;
              }}
            >
              <img
                key={images[index].full}
                src={images[index].full}
                alt={alt}
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                  setZoomed((z) => !z);
                }}
                onMouseMove={(e) => {
                  if (!zoomed) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                }}
                style={{ transformOrigin: origin, transform: zoomed ? 'scale(2.2)' : 'scale(1)' }}
                className={`absolute inset-0 m-auto max-h-full max-w-full bg-white object-contain p-3 transition-transform duration-300 ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              />
            </div>
            <div className="flex items-center justify-center gap-3 px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              {count > 1 && <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="grid size-11 place-items-center rounded-md bg-white/10 text-white"><Icon name="chevronLeft" /></button>}
              <button type="button" onClick={() => setZoomed((z) => !z)} className="btn-ghost-light !min-h-11"><Icon name="zoom" className="size-5" /> {zoomed ? 'Zoom out' : 'Zoom in'}</button>
              {count > 1 && <button type="button" onClick={() => go(1)} aria-label="Next image" className="grid size-11 place-items-center rounded-md bg-white/10 text-white"><Icon name="chevronRight" /></button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
