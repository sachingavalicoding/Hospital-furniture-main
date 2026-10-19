import { getImage } from 'astro:assets';
import type { Product } from '@/data/products';
import { categoryBySlug } from '@/data/categories';
import type { CatalogItem } from '@/components/ProductCatalog';
import { attributesOf } from './attributes';
import { productImage } from './images';

export async function toCatalogItems(list: Product[]): Promise<CatalogItem[]> {
  return Promise.all(
    list.map(async (p, i) => {
      const img = await getImage({ src: productImage(p.images[0]), widths: [240, 320, 480, 640], format: 'webp' });
      const a = attributesOf(p);
      return {
        slug: p.slug,
        code: p.code,
        name: p.name,
        order: i,
        category: p.category,
        categoryShort: categoryBySlug[p.category].short,
        keywords: `${p.summary} ${p.features.join(' ')} ${categoryBySlug[p.category].name}`,
        operation: a.operation,
        materials: a.materials,
        mobile: a.mobile,
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

/** Small image used in "recently viewed" and the quote form. */
export async function thumbOf(p: Product) {
  const img = await getImage({ src: productImage(p.images[0]), width: 160, format: 'webp' });
  return img.src;
}
