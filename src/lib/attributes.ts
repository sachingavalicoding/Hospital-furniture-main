import type { Product } from '@/data/products';

export type Operation = 'Manual' | 'Semi motorised' | 'Motorised' | 'Hydraulic';
export type Material = 'Stainless steel' | 'Powder-coated steel' | 'Polymer parts' | 'Upholstered top' | 'Canvas';

export interface ProductAttributes {
  operation: Operation | null;
  materials: Material[];
  mobile: boolean;
  functions: number | null;
}

/**
 * Derives filterable attributes from the catalogue name and listed features,
 * so filters stay in sync when products are added or renamed.
 */
export function attributesOf(p: Product): ProductAttributes {
  const text = `${p.name} ${p.features.join(' ')}`.toLowerCase();
  let operation: Operation | null = null;
  if (/semi[ -]?motori/.test(text)) operation = 'Semi motorised';
  else if (/motori|electric/.test(text)) operation = 'Motorised';
  else if (/hydraulic/.test(text)) operation = 'Hydraulic';
  else if (/manual|crank|screw mechanism/.test(text)) operation = 'Manual';

  const materials: Material[] = [];
  if (/\bss\b|stainless/.test(text)) materials.push('Stainless steel');
  if (/powder|\bms\b|mild steel/.test(text)) materials.push('Powder-coated steel');
  if (/polymer/.test(text)) materials.push('Polymer parts');
  if (/cushion|upholster|padded/.test(text)) materials.push('Upholstered top');
  if (/canvas/.test(text)) materials.push('Canvas');

  const mobile = /castor|wheel|trolley|mobile/.test(text);
  const fn = text.match(/(\d)[ -]?function/);
  return { operation, materials, mobile, functions: fn ? Number(fn[1]) : null };
}

export const operations: Operation[] = ['Manual', 'Semi motorised', 'Motorised', 'Hydraulic'];
export const materials: Material[] = ['Stainless steel', 'Powder-coated steel', 'Polymer parts', 'Upholstered top', 'Canvas'];
