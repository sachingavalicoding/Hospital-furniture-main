import { products } from '@/data/products';
import { thumbOf } from './catalog';

let cache: { slug: string; code: string; name: string; thumb: string }[] | undefined;

/** Compact product list for the "recently viewed" strip. */
export async function recentItems() {
  cache ??= await Promise.all(products.map(async (p) => ({ slug: p.slug, code: p.code, name: p.name, thumb: await thumbOf(p) })));
  return cache;
}
