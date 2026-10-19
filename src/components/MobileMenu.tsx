import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

interface Props {
  items: { href: string; label: string }[];
  current: string;
}

export default function MobileMenu({ items, current }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? current === '/' : current.startsWith(href));

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="relative z-[60] grid size-11 place-items-center rounded-full border border-navy-100 bg-white text-navy-900"
      >
        <Icon name={open ? 'close' : 'menu'} className="size-5" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              key="panel"
              id="mobile-menu"
              aria-label="Mobile"
              className="fixed inset-x-3 top-3 z-50 rounded-3xl bg-white p-6 pt-20 shadow-lift"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            >
              <ul className="flex flex-col gap-1">
                {items.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                  >
                    <a
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className={`block rounded-2xl px-4 py-3 font-display text-lg font-semibold ${
                        isActive(item.href) ? 'bg-navy-50 text-navy-900' : 'text-slate-700'
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a href="/contact#quote" className="btn-primary mt-6 w-full" onClick={() => setOpen(false)}>
                Request a Quote
              </a>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
