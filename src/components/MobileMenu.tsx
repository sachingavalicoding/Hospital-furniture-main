import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Icon from './Icon';

type Link = { href: string; label: string };
interface Props {
  items: Link[];
  categories: Link[];
  current: string;
  phone: string;
  phoneHref: string;
  whatsappHref: string;
  email: string;
}

export default function MobileMenu({ items, categories, current, phone, phoneHref, whatsappHref, email }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
      // Keep keyboard focus inside the open menu.
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a, button');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? current === '/' : current === href || current.startsWith(`${href}/`));
  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Open menu"
        className="grid size-11 place-items-center rounded-md bg-ink-900 text-white"
      >
        <Icon name="menu" className="size-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="panel"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-ink-950 text-white"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: '-4%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: '-3%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:h-16 sm:px-6">
              <span className="label-mono !text-ink-300">Menu</span>
              <button
                type="button"
                onClick={() => { close(); buttonRef.current?.focus(); }}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-md bg-white/10"
              >
                <Icon name="close" className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="px-4 pt-4 sm:px-6">
              <ul>
                {items.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.03 * i + 0.04 }}
                    className="border-b border-white/10"
                  >
                    <a
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      onClick={close}
                      className="flex min-h-14 items-center justify-between font-display text-[1.35rem] font-semibold"
                    >
                      <span className={isActive(item.href) ? 'text-teal-300' : ''}>{item.label}</span>
                      <Icon name="arrowRight" className="size-4 text-ink-400" />
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="label-mono mt-8 !text-ink-400">Product ranges</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <li key={c.href}>
                    <a href={c.href} onClick={close} className="inline-flex min-h-11 items-center rounded-md border border-white/15 px-3.5 text-sm">
                      {c.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto grid gap-2 px-4 pt-8 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:px-6">
              <a href={whatsappHref} target="_blank" rel="noopener" className="btn-whatsapp w-full">
                <Icon name="whatsapp" className="size-5" /> WhatsApp us
              </a>
              <a href={phoneHref} className="btn-ghost-light w-full">
                <Icon name="phone" className="size-4" /> Call {phone}
              </a>
              <a href={`mailto:${email}`} className="mt-2 text-center text-sm break-all text-ink-300">{email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
