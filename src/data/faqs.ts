import { site } from './site';

export const faqs = [
  {
    q: 'Can I buy products directly on this website?',
    a: 'We work on quotations rather than online checkout, because pricing depends on quantity, finish and delivery location. Send a quote request or a WhatsApp message and we will reply with a detailed quotation.',
  },
  {
    q: 'Do you supply bulk orders for new hospitals and wards?',
    a: 'Yes. We supply complete sets of beds, trolleys, examination couches and ward furniture for hospitals, nursing homes and clinics. Share your list of product codes and quantities to get a combined quote.',
  },
  {
    q: 'Can I visit your workshop in Pune?',
    a: `Yes. We are located at ${site.address.street}, ${site.address.city} ${site.address.postalCode}. Please call or WhatsApp us before visiting so we can arrange a time.`,
  },
  {
    q: 'How do I share my exact requirement?',
    a: 'Use the product codes shown on each item, such as M3 or M29, in the quote form or on WhatsApp. Mention quantities, any finish preferences and your delivery city.',
  },
];
