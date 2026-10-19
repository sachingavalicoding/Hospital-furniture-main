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
  emailjs: { serviceId: string; templateId: string; publicKey: string };
}

type Status = 'idle' | 'sending' | 'sent' | 'error';
type Line = { slug: string; qty: number };

const initialForm = { name: '', phone: '', email: '', organisation: '', city: '', message: '' };

export default function QuoteForm({ products, whatsapp, email, emailjs }: Props) {
  const [form, setForm] = useState(initialForm);
  const [lines, setLines] = useState<Line[]>([]);
  const [picker, setPicker] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const honeypot = useRef<HTMLInputElement>(null);
  const bySlug = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, p])), [products]);

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
  };

  const addLine = (slug: string) => {
    setLines((l) => [...l, { slug, qty: 1 }]);
    clearError('products');
    setPicker('');
    setPickerOpen(false);
  };

  const summary = () => {
    const items = lines.length
      ? lines.map((l) => `- ${bySlug[l.slug].code} ${bySlug[l.slug].name} x ${l.qty}`).join('\n')
      : '- Not specified';
    const details = [
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Email: ${form.email}`,
      form.organisation && `Hospital / organisation: ${form.organisation}`,
      form.city && `Delivery city: ${form.city}`,
    ]
      .filter(Boolean)
      .join('\n');
    return `${details}\n\nProducts:\n${items}${form.message ? `\n\nMessage: ${form.message}` : ''}`;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) e.phone = 'Please enter a valid phone number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Please enter a valid email address.';
    if (!lines.length && form.message.trim().length < 5) e.products = 'Add at least one product or describe your requirement.';
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`quote-${Object.keys(e)[0]}`)?.focus();
      return false;
    }
    return true;
  };

  const onSubmit = async (ev: { preventDefault(): void }) => {
    ev.preventDefault();
    if (honeypot.current?.value) return;
    if (!validate()) return;
    setStatus('sending');
    try {
      const { default: client } = await import('@emailjs/browser');
      await client.send(
        emailjs.serviceId,
        emailjs.templateId,
        {
          name: form.name,
          from_name: form.name,
          email: form.email,
          reply_to: form.email,
          phone: form.phone,
          organisation: form.organisation,
          city: form.city,
          products: lines.map((l) => `${bySlug[l.slug].code} x ${l.qty}`).join(', '),
          message: summary(),
        },
        { publicKey: emailjs.publicKey },
      );
      setStatus('sent');
      setForm(initialForm);
      setLines([]);
    } catch (err) {
      console.error('Quote form failed', err);
      setStatus('error');
    }
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    const text = `Hello, I would like a quotation.\n\n${summary()}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  if (status === 'sent') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-teal-200 bg-teal-50 p-8 text-center sm:p-12"
        role="status"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
          className="mx-auto grid size-16 place-items-center rounded-full bg-teal-500 text-white"
        >
          <Icon name="check" className="size-8" />
        </motion.span>
        <h3 className="mt-6 text-2xl font-bold">Thank you, your request has been sent</h3>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          We will get back to you with a quotation soon. For anything urgent, message us on WhatsApp.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/products" className="btn-outline">Continue browsing</a>
          <button type="button" className="btn-navy" onClick={() => setStatus('idle')}>Send another request</button>
        </div>
      </motion.div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`quote-${k}-error`} className="mt-1.5 text-sm text-red-600">
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: string) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `quote-${k}-error` : undefined });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5" aria-label="Request a quote">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="quote-name" className="label">Full name *</label>
          <input id="quote-name" className="field" value={form.name} onChange={set('name')} autoComplete="name" required {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="quote-phone" className="label">Phone / WhatsApp *</label>
          <input id="quote-phone" type="tel" className="field" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="+91" required {...aria('phone')} />
          {err('phone')}
        </div>
        <div>
          <label htmlFor="quote-email" className="label">Email *</label>
          <input id="quote-email" type="email" className="field" value={form.email} onChange={set('email')} autoComplete="email" required {...aria('email')} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="quote-organisation" className="label">Hospital / organisation</label>
          <input id="quote-organisation" className="field" value={form.organisation} onChange={set('organisation')} autoComplete="organization" />
        </div>
      </div>

      <div>
        <label htmlFor="quote-products" className="label">Products you need</label>
        <div className="relative">
          <input
            id="quote-products"
            role="combobox"
            aria-expanded={pickerOpen && matches.length > 0}
            aria-controls="quote-product-list"
            aria-autocomplete="list"
            className="field"
            placeholder="Type a product name or code, e.g. ICU bed or M29"
            value={picker}
            onChange={(e) => {
              setPicker(e.target.value);
              setPickerOpen(true);
            }}
            onFocus={() => setPickerOpen(true)}
            onBlur={() => setTimeout(() => setPickerOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (matches[0]) addLine(matches[0].slug);
              }
            }}
            {...aria('products')}
          />
          <AnimatePresence>
            {pickerOpen && matches.length > 0 && (
              <motion.ul
                id="quote-product-list"
                role="listbox"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl border border-navy-100 bg-white p-1.5 shadow-lift"
              >
                {matches.map((p) => (
                  <li key={p.slug} role="option" aria-selected="false">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => addLine(p.slug)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-navy-50"
                    >
                      <span className="w-10 shrink-0 font-semibold text-teal-600">{p.code}</span>
                      <span className="text-navy-900">{p.name}</span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
        {err('products')}
        <AnimatePresence initial={false}>
          {lines.length > 0 && (
            <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2">
              {lines.map((l) => (
                <motion.li
                  key={l.slug}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  className="flex items-center gap-3 rounded-2xl border border-navy-100 bg-navy-50/50 p-2 pl-4"
                >
                  <span className="w-10 shrink-0 text-sm font-semibold text-teal-600">{bySlug[l.slug].code}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-navy-900">{bySlug[l.slug].name}</span>
                  <label className="sr-only" htmlFor={`qty-${l.slug}`}>Quantity for {bySlug[l.slug].name}</label>
                  <input
                    id={`qty-${l.slug}`}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={l.qty}
                    onChange={(e) =>
                      setLines((all) => all.map((x) => (x.slug === l.slug ? { ...x, qty: Math.max(1, Number(e.target.value) || 1) } : x)))
                    }
                    className="w-20 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setLines((all) => all.filter((x) => x.slug !== l.slug))}
                    aria-label={`Remove ${bySlug[l.slug].name}`}
                    className="grid size-9 place-items-center rounded-full text-slate-500 hover:bg-white hover:text-red-600"
                  >
                    <Icon name="close" className="size-4" />
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label htmlFor="quote-city" className="label">Delivery city</label>
          <input id="quote-city" className="field" value={form.city} onChange={set('city')} autoComplete="address-level2" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="quote-message" className="label">Requirement details</label>
          <textarea id="quote-message" rows={3} className="field" value={form.message} onChange={set('message')} placeholder="Finish, size, timeline or anything else we should know" />
        </div>
      </div>

      <input ref={honeypot} type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {status === 'error' && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Sorry, the request could not be sent right now. Please send it on WhatsApp instead, or email us at{' '}
          <a className="font-semibold underline" href={`mailto:${email}?subject=Quote request&body=${encodeURIComponent(summary())}`}>{email}</a>.
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn-primary flex-1 !py-3.5" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send quote request'}
          {status !== 'sending' && <Icon name="arrowRight" className="size-4" />}
        </button>
        <button type="button" onClick={sendWhatsApp} className="btn-whatsapp flex-1 !py-3.5">
          <Icon name="whatsapp" className="size-5" /> Send on WhatsApp
        </button>
      </div>
      <p className="text-xs text-slate-500">We use your details only to reply to this enquiry.</p>
    </form>
  );
}
