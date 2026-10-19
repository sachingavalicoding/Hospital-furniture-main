import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from './Icon';

interface ProductOption {
  slug: string;
  code: string;
  name: string;
}

interface Props {
  products: ProductOption[];
  whatsapp: string;
  email: string;
  /** Netlify Forms form name. Submissions are emailed to the business from Netlify, no keys in the browser. */
  formName?: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'duplicate' | 'error';
type Line = { slug: string; qty: number };

const initialForm = { name: '', organisation: '', phone: '', email: '', city: '', message: '' };
const LAST_KEY = 'sjp-last-quote';
const DUPLICATE_WINDOW = 30 * 60 * 1000;

export default function QuoteForm({ products, whatsapp, email, formName = 'quote' }: Props) {
  const [form, setForm] = useState(initialForm);
  const [lines, setLines] = useState<Line[]>([]);
  const [picker, setPicker] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentAt, setSentAt] = useState('');
  const sending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const bySlug = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, p])), [products]);

  // Keep anything typed before the script loaded (slow mobile connections).
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const typed = { ...initialForm };
    let any = false;
    for (const k of Object.keys(initialForm) as (keyof typeof initialForm)[]) {
      const v = (el.elements.namedItem(k) as HTMLInputElement | null)?.value;
      if (v) { typed[k] = v; any = true; }
    }
    if (any) setForm(typed);
  }, []);

  // Preselect a product passed as ?product=slug from product pages.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('product');
    if (slug && bySlug[slug]) setLines([{ slug, qty: 1 }]);
  }, [bySlug]);

  const matches = useMemo(() => {
    const q = picker.toLowerCase().trim();
    const chosen = new Set(lines.map((l) => l.slug));
    return products
      .filter((p) => !chosen.has(p.slug))
      .filter((p) => !q || `${p.code} ${p.name}`.toLowerCase().includes(q))
      .slice(0, 8);
  }, [picker, products, lines]);

  const clearError = (key: string) =>
    setErrors((e) => {
      if (!e[key]) return e;
      const { [key]: _, ...rest } = e;
      return rest;
    });

  const set = (key: keyof typeof initialForm) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    clearError(key === 'message' ? 'products' : key);
    if (status === 'error' || status === 'duplicate') setStatus('idle');
  };

  const addLine = (slug: string) => {
    setLines((l) => [...l, { slug, qty: 1 }]);
    clearError('products');
    setPicker('');
    setPickerOpen(false);
    setActive(0);
  };

  const productsText = lines.map((l) => `${bySlug[l.slug].code} ${bySlug[l.slug].name} x ${l.qty}`).join('\n');
  const totalQty = lines.reduce((n, l) => n + l.qty, 0);

  const summary = () => {
    const details = [
      `Name: ${form.name}`,
      form.organisation && `Hospital / organisation: ${form.organisation}`,
      `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      form.city && `Delivery city: ${form.city}`,
    ]
      .filter(Boolean)
      .join('\n');
    return `${details}\n\nProducts:\n${productsText || '- Not specified'}${form.message ? `\n\nMessage: ${form.message}` : ''}`;
  };

  const validate = (needEmail: boolean) => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^\+?[\d\s-]{10,15}$/.test(form.phone.trim())) e.phone = 'Please enter a valid 10 digit phone number.';
    if (needEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (!needEmail && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = 'Please check this email address.';
    if (!lines.length && form.message.trim().length < 5) e.products = 'Add at least one product or describe what you need.';
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) document.getElementById(`quote-${first}`)?.focus();
    return !first;
  };

  const fingerprint = () => JSON.stringify([form.name.trim(), form.phone.trim(), form.email.trim().toLowerCase(), productsText, form.message.trim()]);

  const onSubmit = async (ev: { preventDefault(): void }) => {
    ev.preventDefault();
    if (sending.current) return;
    if (!validate(true)) return;

    // Stop accidental double submissions of the same request.
    try {
      const last = JSON.parse(sessionStorage.getItem(LAST_KEY) || 'null');
      if (last && last.key === fingerprint() && Date.now() - last.at < DUPLICATE_WINDOW) {
        setSentAt(new Date(last.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setStatus('duplicate');
        return;
      }
    } catch {
      /* ignore storage errors */
    }

    sending.current = true;
    setStatus('sending');
    try {
      const data = new FormData(formRef.current!);
      data.set('products', productsText);
      data.set('quantity', String(totalQty || ''));
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try {
        sessionStorage.setItem(LAST_KEY, JSON.stringify({ key: fingerprint(), at: Date.now() }));
      } catch {
        /* ignore */
      }
      setStatus('sent');
      window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 100 });
    } catch (err) {
      console.error('Quote form failed', err);
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };

  const sendWhatsApp = () => {
    if (!validate(false)) return;
    const text = `Hello, I would like a quotation.\n\n${summary()}`;
    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
    const w = window.open(url, '_blank', 'noopener');
    if (!w) window.location.href = url;
  };

  const reset = () => {
    setForm(initialForm);
    setLines([]);
    setStatus('idle');
  };

  if (status === 'sent') {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-teal-300 bg-teal-50 p-6 text-center sm:p-10" role="status">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          className="mx-auto grid size-14 place-items-center rounded-full bg-teal-600 text-white"
        >
          <Icon name="check" className="size-7" />
        </motion.span>
        <h3 className="mt-5 text-2xl font-bold">Thank you, your request has been sent</h3>
        <p className="mx-auto mt-2 max-w-md text-ink-600">We will reply with a quotation by phone or email. For anything urgent, message us on WhatsApp.</p>
        <div className="mt-6 grid justify-center gap-2.5 sm:flex">
          <a href="/products" className="btn-line">Continue browsing</a>
          <button type="button" className="btn-ink" onClick={reset}>Send another request</button>
        </div>
      </motion.div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`quote-${k}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-red-700">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `quote-${k}-error` : undefined });
  const listOpen = pickerOpen && matches.length > 0;

  return (
    <form
      ref={formRef}
      name={formName}
      method="POST"
      action="/quote/sent/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      noValidate
      className="grid gap-5"
      aria-label="Request a quote"
    >
      <input type="hidden" name="form-name" value={formName} />
      <input type="hidden" name="products" value={productsText} />
      <input type="hidden" name="quantity" value={totalQty || ''} />
      <p className="hidden">
        <label>Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className="label">Full name *</label>
          <input id="quote-name" name="name" className="field" value={form.name} onChange={set('name')} autoComplete="name" required {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="quote-organisation" className="label">Hospital / organisation</label>
          <input id="quote-organisation" name="organisation" className="field" value={form.organisation} onChange={set('organisation')} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor="quote-phone" className="label">Phone / WhatsApp *</label>
          <input id="quote-phone" name="phone" type="tel" inputMode="tel" className="field" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91" required {...aria('phone')} />
          {err('phone')}
        </div>
        <div>
          <label htmlFor="quote-email" className="label">Email *</label>
          <input id="quote-email" name="email" type="email" inputMode="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" required {...aria('email')} />
          {err('email')}
        </div>
      </div>

      <div>
        <label htmlFor="quote-products" className="label">Products and quantities</label>
        <div className="relative">
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-400" />
          <input
            id="quote-products"
            name="product_request"
            role="combobox"
            aria-expanded={listOpen}
            aria-controls="quote-product-list"
            aria-autocomplete="list"
            aria-activedescendant={listOpen ? `quote-opt-${matches[active]?.slug}` : undefined}
            className="field !pl-11"
            placeholder="Type a product name or code, e.g. M29"
            value={picker}
            autoComplete="off"
            onChange={(e) => {
              setPicker(e.target.value);
              setPickerOpen(true);
              setActive(0);
            }}
            onFocus={() => setPickerOpen(true)}
            onBlur={() => setTimeout(() => setPickerOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setPickerOpen(true); setActive((a) => Math.min(a + 1, matches.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === 'Escape') setPickerOpen(false);
              if (e.key === 'Enter') {
                e.preventDefault();
                if (matches[active]) addLine(matches[active].slug);
              }
            }}
            {...aria('products')}
          />
          <AnimatePresence>
            {listOpen && (
              <motion.ul
                id="quote-product-list"
                role="listbox"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute inset-x-0 top-full z-20 mt-1.5 max-h-72 overflow-auto rounded-lg border border-ink-200 bg-white p-1 shadow-pop"
              >
                {matches.map((p, i) => (
                  <li
                    key={p.slug}
                    id={`quote-opt-${p.slug}`}
                    role="option"
                    aria-selected={i === active}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => addLine(p.slug)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm ${i === active ? 'bg-ink-100' : ''}`}
                  >
                    <span className="w-10 shrink-0 font-mono text-xs font-medium text-teal-700">{p.code}</span>
                    <span className="text-ink-900">{p.name}</span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        {err('products')}
        {lines.length > 0 && (
          <ul className="mt-3 space-y-2" aria-label="Selected products">
            <AnimatePresence initial={false}>
              {lines.map((l) => (
                <motion.li
                  key={l.slug}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-2 rounded-md border border-ink-200 bg-ink-50 p-1.5 pl-3"
                >
                  <span className="w-9 shrink-0 font-mono text-xs font-medium text-teal-700">{bySlug[l.slug].code}</span>
                  <span className="min-w-0 flex-1 text-sm leading-snug text-ink-900">{bySlug[l.slug].name}</span>
                  <label className="sr-only" htmlFor={`qty-${l.slug}`}>Quantity for {bySlug[l.slug].name}</label>
                  <input
                    id={`qty-${l.slug}`}
                    type="number"
                    min={1}
                    max={9999}
                    inputMode="numeric"
                    value={l.qty}
                    onChange={(e) => setLines((all) => all.map((x) => (x.slug === l.slug ? { ...x, qty: Math.min(9999, Math.max(1, Number(e.target.value) || 1)) } : x)))}
                    className="min-h-11 w-[4.5rem] rounded-md border border-ink-300 bg-white px-2 text-center text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setLines((all) => all.filter((x) => x.slug !== l.slug))}
                    aria-label={`Remove ${bySlug[l.slug].name}`}
                    className="grid size-11 shrink-0 place-items-center rounded-md text-ink-500 hover:bg-white hover:text-red-700"
                  >
                    <Icon name="close" className="size-4" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label htmlFor="quote-city" className="label">Delivery city</label>
          <input id="quote-city" name="city" className="field" value={form.city} onChange={set('city')} autoComplete="address-level2" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="quote-message" className="label">Message</label>
          <textarea id="quote-message" name="message" rows={3} className="field" value={form.message} onChange={set('message')} placeholder="Finish, size, timeline or anything else we should know" />
        </div>
      </div>

      {status === 'error' && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          Sorry, the request could not be sent right now. Please try again, send it on WhatsApp, or email{' '}
          <a className="font-semibold underline" href={`mailto:${email}?subject=${encodeURIComponent('Quote request')}&body=${encodeURIComponent(summary())}`}>{email}</a>.
        </div>
      )}
      {status === 'duplicate' && (
        <div role="alert" className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          You already sent this same request at {sentAt}. We have it and will reply soon. Change the details to send a new request.
        </div>
      )}

      <div className="grid gap-2.5 sm:grid-cols-2">
        <button type="submit" className="btn-primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>
          {status === 'sending' ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Sending…
            </>
          ) : (
            <>Send quote request <Icon name="arrowRight" className="size-4" /></>
          )}
        </button>
        <button type="button" onClick={sendWhatsApp} className="btn-whatsapp">
          <Icon name="whatsapp" className="size-5" /> Send on WhatsApp
        </button>
      </div>
      <p className="flex items-start gap-2 text-xs text-ink-500">
        <Icon name="lock" className="size-4 shrink-0" />
        <span>We use your details only to reply to this enquiry. See our <a href="/privacy" className="underline">privacy policy</a>.</span>
      </p>
    </form>
  );
}
