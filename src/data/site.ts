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
  geo: { lat: 18.4473512, lng: 73.8949912 },
  mapUrl: 'https://www.google.com/maps?q=18.4473512,73.8949912',
  social: {
    instagram: 'https://www.instagram.com/shree_jagadamba_production/',
    instagramHandle: '@shree_jagadamba_production',
    facebook:
      'https://www.facebook.com/people/Mayur-Wagh/pfbid02NpBK1EjKquVdGfkvH5V8oAuHAjrwjh88vBQ6CL5ujEeMMf5Hj28pfnABqv23howql/',
  },
} as const;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

/** Builds a wa.me link with a prefilled message. */
export function whatsappLink(message?: string) {
  const text = message ?? `Hello ${site.name}, I would like a quote for hospital furniture.`;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
