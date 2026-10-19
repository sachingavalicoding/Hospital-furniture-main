/**
 * Business facts used across the site, structured data and forms.
 * Only verified details belong here. Leave a field null until it is confirmed;
 * components hide anything that is null.
 */
export const site = {
  name: 'Shree Jagadamba Production',
  shortName: 'Shree Jagadamba',
  tagline: 'Hospital furniture manufacturer in Pune',
  description:
    'Shree Jagadamba Production manufactures ICU beds, ward beds, examination couches, stretchers, OT trolleys and ward furniture in Pune. Request a quote for hospitals, clinics and nursing homes.',
  owner: 'Mayur Wagh',
  founded: '2022',
  email: 'shreejagadambaproduction2003@gmail.com',
  phone: '+91 88302 77269',
  phoneHref: 'tel:+918830277269',
  whatsapp: '919921113378',
  whatsappDisplay: '+91 99211 13378',
  address: {
    street: 'S. No. 32, Behind Angaraj Dhaba, Yeolewadi Road, Kondhwa (BK)',
    city: 'Pune',
    region: 'Maharashtra',
    postalCode: '411048',
    country: 'IN',
  },
  /** Pin of the Google Business listing, from https://maps.app.goo.gl/hrGudcACYrmPNqy59 */
  geo: { lat: 18.4473619, lng: 73.8954829 },
  /** Google Maps listing shared by the business. */
  mapsUrl: 'https://maps.app.goo.gl/hrGudcACYrmPNqy59',
  /**
   * Opening hours. `open`/`close` are 24h for structured data, `label` is what visitors see.
   * Add `days` (e.g. 'Mon–Sat') and `schemaDays` (e.g. ['Monday', ...]) once the working days
   * are confirmed; structured data only includes hours that have days.
   */
  hours: [{ label: '9:30 AM to 5:00 PM', open: '09:30', close: '17:00' }] as {
    label: string;
    open: string;
    close: string;
    days?: string;
    schemaDays?: string[];
  }[] | null,
  social: {
    instagram: 'https://www.instagram.com/shree_jagadamba_production/',
    instagramHandle: '@shree_jagadamba_production',
    facebook:
      'https://www.facebook.com/people/Mayur-Wagh/pfbid02NpBK1EjKquVdGfkvH5V8oAuHAjrwjh88vBQ6CL5ujEeMMf5Hj28pfnABqv23howql/',
  },
};

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
export const mapsPlaceUrl = site.mapsUrl;
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat},${site.geo.lng}`;
export const mapEmbedUrl = `https://maps.google.com/maps?q=${site.geo.lat},${site.geo.lng}&z=16&output=embed`;

export const nav = [
  { href: '/products', label: 'Products' },
  { href: '/industries', label: 'Industries' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Builds a wa.me link with a prefilled message. */
export function whatsappLink(message?: string) {
  const text = message ?? `Hello ${site.name}, I would like a quote for hospital furniture.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function productWhatsappText(name: string, code: string) {
  return `Hello ${site.name}, I would like a quote for ${name} (${code}).\nQuantity: \nDelivery city: `;
}

/** Opening hours as one line, e.g. "Mon–Sat, 9:30 AM to 5:00 PM". */
export const hoursText = site.hours?.map((h) => (h.days ? `${h.days}, ${h.label}` : h.label)).join('; ') ?? null;
