import { useCallback, useEffect, useState } from 'react';
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

export default function ProductGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const count = images.length;
  const go = useCallback((d: number) => setIndex((i) => (i + d + count) % count), [count]);

  useEffect(() => {
    if (!zoom) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [zoom, go]);

  const current = images[index];

  return (
    <div>
      <div className="relative overflow-hidden rounded-[2rem] border border-navy-100 bg-gradient-to-br from-navy-50 to-white">
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="block aspect-square w-full cursor-zoom-in"
          aria-label="Open full-size image"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={current.src}
              src={current.src}
              srcSet={current.srcset}
              sizes="(min-width: 1024px) 560px, 92vw"
              width={current.width}
              height={current.height}
              alt={count > 1 ? `${alt}, view ${index + 1} of ${count}` : alt}
              className="size-full object-contain p-8 mix-blend-multiply"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              fetchPriority={index === 0 ? 'high' : 'auto'}
            />
          </AnimatePresence>
        </button>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 rotate-180 place-items-center rounded-full bg-white/90 text-navy-900 shadow-card hover:bg-white">
              <Icon name="arrowRight" className="size-4" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy-900 shadow-card hover:bg-white">
              <Icon name="arrowRight" className="size-4" />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1" role="group" aria-label="Product images">
          {images.map((img, i) => (
            <button
              key={img.thumb}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
              className={`size-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-navy-50 transition ${
                i === index ? 'border-teal-500' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img.thumb} alt="" width={80} height={80} loading="lazy" className="size-full object-contain p-1.5 mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {zoom && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${alt} full-size image`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
          >
            <motion.img
              key={current.full}
              src={current.full}
              alt={alt}
              className="max-h-[88vh] max-w-full rounded-2xl bg-white object-contain p-4"
              initial={{ scale: 0.94 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" autoFocus onClick={() => setZoom(false)} aria-label="Close" className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white text-navy-900">
              <Icon name="close" />
            </button>
            {count > 1 && (
              <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white">
                {index + 1} / {count} · use arrow keys
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
