import type { ImageMetadata } from 'astro';
import icu from '@/assets/products/M-3.jpg';
import ward from '@/assets/products/M-11.jpg';
import transfer from '@/assets/products/M-42.jpg';
import exam from '@/assets/products/M-36.jpg';
import trolleys from '@/assets/products/M-29.jpg';
import furniture from '@/assets/products/M-51.jpg';

export type CategorySlug =
  | 'icu-beds'
  | 'ward-beds'
  | 'patient-transfer'
  | 'examination'
  | 'trolleys'
  | 'ward-furniture';

export interface Category {
  slug: CategorySlug;
  name: string;
  short: string;
  description: string;
  image: ImageMetadata;
}

export const categories: Category[] = [
  {
    slug: 'icu-beds',
    name: 'ICU & Fowler Beds',
    short: 'ICU Beds',
    description:
      'Manual, semi-motorised and motorised ICU beds and Fowler beds with polymer or stainless steel bows, collapsible railings and castor wheels for critical care units.',
    image: icu,
  },
  {
    slug: 'ward-beds',
    name: 'Ward Beds & Cribs',
    short: 'Ward Beds',
    description:
      'Semi-Fowler, plain and premium ward beds, baby cribs and cradles built for general wards, private rooms and maternity units.',
    image: ward,
  },
  {
    slug: 'patient-transfer',
    name: 'Stretchers & Patient Transfer',
    short: 'Stretchers',
    description:
      'Folding and canvas stretchers, stretcher trolleys, hydraulic and manual emergency recovery trolleys and wheelchairs for safe patient movement.',
    image: transfer,
  },
  {
    slug: 'examination',
    name: 'Examination Couches & Tables',
    short: 'Examination',
    description:
      'General and gynaecology examination couches and tables with backrests, drawers, cabinets and footsteps for OPDs and clinics.',
    image: exam,
  },
  {
    slug: 'trolleys',
    name: 'OT & Medical Trolleys',
    short: 'Trolleys',
    description:
      'Dressing, instrument, Mayo, ECG, drug, linen, laparoscopic and crash cart trolleys in stainless steel and powder-coated finishes.',
    image: trolleys,
  },
  {
    slug: 'ward-furniture',
    name: 'Ward Furniture & Accessories',
    short: 'Ward Furniture',
    description:
      'Bedside lockers, over-bed tables, IV stands, bedside screens, stools, monitor and syringe pump stands to complete every ward.',
    image: furniture,
  },
];

export const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  Category
>;
