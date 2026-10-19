import { site, addressLine } from './site';

/**
 * The last three answers (delivery, warranty, customisation) are PLACEHOLDERS
 * written to be safe and general. Replace them once the business confirms its policies.
 */
export const faqs = [
  {
    q: 'Can I buy products directly on this website?',
    a: 'We work on quotations rather than online checkout, because pricing depends on quantity, finish and delivery location. Send a quote request or a WhatsApp message and we will reply with a detailed quotation.',
  },
  {
    q: 'Do you supply bulk orders for new hospitals and wards?',
    a: 'Yes. We supply sets of beds, trolleys, examination couches and ward furniture for hospitals, nursing homes and clinics. Share your list of product codes and quantities to get one combined quotation.',
  },
  {
    q: 'How do I share my exact requirement?',
    a: 'Use the catalogue code shown on each product, such as M3 or M29, in the quote form or on WhatsApp. Mention quantities, any finish preference and your delivery city.',
  },
  {
    q: 'Where are you located?',
    a: `Our workshop is at ${addressLine}. Please call or WhatsApp us before visiting so we can arrange a time.`,
  },
  {
    q: 'How can I contact you?',
    a: `Call ${site.phone}, message us on WhatsApp at ${site.whatsappDisplay} or email ${site.email}. You can also send a request through the quote form on this website.`,
  },
  // PLACEHOLDER: confirm delivery area and charges.
  {
    q: 'Do you deliver outside Pune?',
    a: 'Yes, we can arrange delivery to other cities. Transport charges depend on the location and order size, and are included in your quotation. Mention your delivery city when you send your requirement.',
  },
  // PLACEHOLDER: confirm warranty terms.
  {
    q: 'Do your products come with a warranty?',
    a: 'Warranty terms depend on the product and are stated in your quotation. Ask us about the cover for any specific item before you order.',
  },
  // PLACEHOLDER: confirm which changes are possible.
  {
    q: 'Can you make products in custom sizes or finishes?',
    a: 'Many of our products can be adapted in size, finish or accessories because we make them in our own workshop. Share your requirement and we will tell you what is possible and the price.',
  },
];
