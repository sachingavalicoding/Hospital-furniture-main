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
  /** Taken from the map link on the previous website. Confirm before launch. */
  geo: { lat: 18.4473512, lng: 73.8949912 },
  /**
   * Opening hours, e.g. [{ days: 'Mon–Sat', open: '09:30', close: '19:00', schema: ['Monday', ...] }].
   * Not confirmed yet, so hidden everywhere.
   */
  hours: null as null | { days: string; open: string; close: string; schemaDays: string[] }[],
  social: {
    instagram: 'https://www.instagram.com/shree_jagadamba_production/',
    instagramHandle: '@shree_jagadamba_production',
    facebook:
      'https://www.facebook.com/people/Mayur-Wagh/pfbid02NpBK1EjKquVdGfkvH5V8oAuHAjrwjh88vBQ6CL5ujEeMMf5Hj28pfnABqv23howql/',
  },
};

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;
export const mapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${site.geo.lat},${site.geo.lng}`;
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
