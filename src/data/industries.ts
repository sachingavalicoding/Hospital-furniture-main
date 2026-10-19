import type { ImageMetadata } from 'astro';
import type { CategorySlug } from './categories';
import corridor from '@/assets/site/corridor.jpg';
import icu from '@/assets/site/icu.jpg';
import opd from '@/assets/site/opd.jpg';
import privateRoom from '@/assets/site/private-room.jpg';
import procedure from '@/assets/site/procedure-room.jpg';
import ward from '@/assets/site/general-ward.jpg';

export interface Industry {
  id: string;
  name: string;
  icon: 'hospital' | 'heart' | 'clipboard' | 'baby' | 'truck' | 'shield';
  /** Illustrative photo of the setting (not an installation by us). */
  image: ImageMetadata;
  text: string;
  ranges: CategorySlug[];
  /** Product codes that are typical for this setting. */
  picks: string[];
}

export const industries: Industry[] = [
  {
    id: 'hospitals',
    name: 'Multi-speciality hospitals',
    icon: 'hospital',
    image: corridor,
    text: 'One supplier for beds, trolleys, couches and ward furniture when you equip a new block or replace old stock across departments.',
    ranges: ['icu-beds', 'ward-beds', 'trolleys', 'ward-furniture'],
    picks: ['M3', 'M11', 'M29', 'M51'],
  },
  {
    id: 'icu',
    name: 'ICU and critical care',
    icon: 'heart',
    image: icu,
    text: 'Manual, semi-motorised and motorised ICU beds with crash carts, monitor stands and syringe pump stands for the bedside.',
    ranges: ['icu-beds', 'trolleys', 'ward-furniture'],
    picks: ['M3', 'M5', 'M29', 'M52'],
  },
  {
    id: 'wards',
    name: 'General and private wards',
    icon: 'shield',
    image: ward,
    text: 'Semi-Fowler and plain ward beds with bedside lockers, over-bed tables, IV stands and bedside screens.',
    ranges: ['ward-beds', 'ward-furniture'],
    picks: ['M12', 'M14', 'M50', 'M16'],
  },
  {
    id: 'clinics',
    name: 'Clinics and OPDs',
    icon: 'clipboard',
    image: opd,
    text: 'Examination couches and tables, stools, dressing trolleys and screens for consultation and treatment rooms.',
    ranges: ['examination', 'trolleys', 'ward-furniture'],
    picks: ['M37', 'M38', 'M22', 'M46'],
  },
  {
    id: 'maternity',
    name: 'Nursing homes and maternity',
    icon: 'baby',
    image: privateRoom,
    text: 'Ward beds, baby cribs and cradles, gynaecology examination tables and the ward furniture a smaller facility needs.',
    ranges: ['ward-beds', 'examination', 'ward-furniture'],
    picks: ['M15', 'M21', 'M36', 'M39'],
  },
  {
    id: 'emergency',
    name: 'Emergency and patient transfer',
    icon: 'truck',
    image: procedure,
    text: 'Stretcher trolleys, emergency recovery trolleys, folding stretchers and wheelchairs for casualty and patient movement.',
    ranges: ['patient-transfer', 'trolleys'],
    picks: ['M42', 'M41', 'M40', 'M19'],
  },
];
