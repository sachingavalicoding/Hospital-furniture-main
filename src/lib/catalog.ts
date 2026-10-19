import { getImage } from 'astro:assets';
import type { Product } from '@/data/products';
import { categoryBySlug } from '@/data/categories';
import type { CatalogItem } from '@/components/ProductCatalog';
import { productImage } from './images';

export async function toCatalogItems(list: Product[]): Promise<CatalogItem[]> {
  return Promise.all(
    list.map(async (p) => {
      const img = await getImage({ src: productImage(p.images[0]), widths: [320, 480, 640], format: 'webp' });
      return {
        slug: p.slug,
        code: p.code,
        name: p.name,
        category: p.category,
        categoryShort: categoryBySlug[p.category].short,
        features: p.features.slice(0, 2),
        keywords: `${p.summary} ${p.features.join(' ')} ${categoryBySlug[p.category].name}`,
        image: {
          src: img.src,
          srcset: img.srcSet.attribute,
          width: Number(img.attributes.width ?? 640),
          height: Number(img.attributes.height ?? 640),
        },
      };
    }),
  );
}
